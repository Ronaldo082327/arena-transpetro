/* Dora Draw — lógica pura (sem DOM, sem rede). Testada em testes/logica.test.js.
   Roda no app, no service worker, na página injetada e no Node. Datas: 'AAAA-MM-DD' no fuso local. */
(function (raiz, fab) { const L = fab(); if (typeof module === 'object' && module.exports) module.exports = L; else raiz.DoraLogica = L; })(typeof self !== 'undefined' ? self : this, function () {
  // ---------- datas ----------
  const p2 = (n) => String(n).padStart(2, '0');
  const diaLocal = (ts) => { const d = ts == null ? new Date() : new Date(ts); return d.getFullYear() + '-' + p2(d.getMonth() + 1) + '-' + p2(d.getDate()); };
  const paraData = (dia) => { const [a, m, d] = dia.split('-').map(Number); return new Date(a, m - 1, d, 12); };
  const somaDias = (dia, n) => { const d = paraData(dia); d.setDate(d.getDate() + n); return diaLocal(d.getTime()); };
  const diasEntre = (a, b) => Math.round((paraData(b) - paraData(a)) / 86400000);
  const DS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
  const rotuloDia = (dia) => { const d = paraData(dia); return DS[d.getDay()] + ' ' + p2(d.getDate()) + '/' + p2(d.getMonth() + 1); };
  const uid = (p = 'x') => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

  // ---------- parser de edital ----------
  // Entrada: texto colado. Saída: [{ nome, topicos: [{ titulo, nivel, num }] }]. nivel 1 = "1.", 2 = "1.1", 3 = "1.1.1"...
  const ehTitulo = (l) => {
    const t = l.trim(); if (t.length < 3 || t.length > 90) return false;
    if (/^\d/.test(t) || /[;]/.test(t)) return false;
    const letras = t.replace(/[^A-Za-zÀ-ÿ]/g, ''); if (letras.length < 3) return false;
    const maiusc = t.replace(/[^A-ZÀ-Ý]/g, '').length;
    return maiusc / letras.length >= 0.85;
  };
  const MARCA = /(^|[\n;:.]\s*|\s{2,})(\d{1,2}(?:\.\d{1,2}){0,4})\s*[.)\-–]?\s+(?=[A-Za-zÀ-ÿ"“(])/g;
  function limpaTopico(s) { return s.replace(/\s+/g, ' ').replace(/^[\s;:.\-–,]+|[\s;,]+$/g, '').replace(/\.$/, '').trim(); }
  function itensNumerados(corpo) {
    const marcas = []; let m; MARCA.lastIndex = 0;
    while ((m = MARCA.exec(corpo))) {
      const antes = m[1]; const ini = m.index + antes.length; const num = m[2];
      // "Lei 8.112" ou "art. 5 " no meio da frase: só vale se veio de início de linha, ponto/;/: ou espaço duplo
      marcas.push({ ini, fim: MARCA.lastIndex, num });
    }
    const itens = [];
    marcas.forEach((mk, i) => { const fim = i + 1 < marcas.length ? marcas[i + 1].ini : corpo.length; const texto = limpaTopico(corpo.slice(mk.fim, fim)); if (texto) itens.push({ num: mk.num, nivel: mk.num.split('.').length, texto }); });
    return itens;
  }
  function expandePontoVirgula(item) { // "Banco de dados: modelo relacional; SQL; normalização" -> pai + filhos
    const partes = item.texto.split(/;/).map(limpaTopico).filter(Boolean);
    if (partes.length < 2) return [{ titulo: item.texto, nivel: item.nivel, num: item.num }];
    const out = []; let primeira = partes[0];
    const dp = primeira.indexOf(':');
    if (dp > 0 && dp < 80) { out.push({ titulo: limpaTopico(primeira.slice(0, dp)), nivel: item.nivel, num: item.num }); primeira = limpaTopico(primeira.slice(dp + 1)); partes[0] = primeira; partes.forEach((p, i) => { if (p) out.push({ titulo: p, nivel: item.nivel + 1, num: item.num + '.' + (i + 1) }); }); return out; }
    partes.forEach((p, i) => out.push({ titulo: p, nivel: item.nivel, num: item.num + (i ? '+' + i : '') }));
    return out;
  }
  function parseEdital(texto) {
    const linhas = String(texto || '').replace(/\r/g, '').replace(/\u00a0/g, ' ').split('\n');
    const blocos = []; let atual = null;
    for (const bruta of linhas) {
      const l = bruta.trim(); if (!l) { if (atual) atual.corpo += '\n'; continue; }
      const mDisc = l.match(/^(?:disciplina|mat[ée]ria|bloco|[áa]rea)\s*[:\-–]\s*(.{3,80})$/i);
      if (mDisc) { atual = { nome: mDisc[1].trim(), corpo: '' }; blocos.push(atual); continue; }
      if (ehTitulo(l) || (/:$/.test(l) && l.length <= 70 && !/\d/.test(l) && !/;/.test(l) && /^[A-ZÀ-Ý]/.test(l) && l.split(/\s+/).length <= 8 && (!atual || /\n$/.test(atual.corpo) || !atual.corpo))) {
        const nome = l.replace(/[:\s]+$/, ''); atual = { nome: nome.replace(/\b([A-ZÀ-Ý])([A-ZÀ-Ý]+)/g, (_, a, b) => a + b.toLowerCase()), corpo: '' }; blocos.push(atual); continue;
      }
      if (!atual) { atual = { nome: 'Conteúdo do edital', corpo: '' }; blocos.push(atual); }
      atual.corpo += (atual.corpo && !/\n$/.test(atual.corpo) ? ' ' : '') + l + '\n';
    }
    const res = [];
    for (const b of blocos) {
      const corpo = '\n' + b.corpo.replace(/\n(?=\S)/g, '\n'); const itens = itensNumerados(corpo);
      let topicos = [];
      if (itens.length) itens.forEach(it => topicos.push(...expandePontoVirgula(it)));
      else {
        const partes = b.corpo.split(/;|\n/).map(limpaTopico).filter(p => p.length > 2);
        partes.forEach(p => { const dp = p.indexOf(':'); if (dp > 0 && dp < 70 && p.slice(dp + 1).includes(',')) { topicos.push({ titulo: limpaTopico(p.slice(0, dp)), nivel: 1, num: '' }); p.slice(dp + 1).split(',').map(limpaTopico).filter(Boolean).forEach(q => topicos.push({ titulo: q, nivel: 2, num: '' })); } else topicos.push({ titulo: p, nivel: 1, num: '' }); });
      }
      // ajusta saltos de nível (1 -> 3 vira 1 -> 2)
      let ant = 0; topicos.forEach(t => { if (t.nivel > ant + 1) t.nivel = ant + 1; ant = t.nivel; });
      if (topicos.length || b.nome) res.push({ nome: b.nome, topicos });
    }
    return res.filter(d => d.topicos.length);
  }

  // ---------- SM-2 ----------
  const QUAL = { errei: 1, dificil: 3, bom: 4, facil: 5 };
  function sm2(c, resposta, hoje) {
    const q = QUAL[resposta]; if (q == null) throw new Error('resposta inválida: ' + resposta);
    const ef0 = c.ef || 2.5; let rep = c.rep || 0; let int = c.int || 0;
    const ef = Math.max(1.3, Math.round((ef0 + 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)) * 100) / 100);
    if (q < 3) { rep = 0; int = 1; }
    else { rep += 1; int = rep === 1 ? 1 : rep === 2 ? (q === 5 ? 4 : 3) : Math.round(int * ef); if (q === 3) int = Math.max(1, Math.round(int * 0.8)); }
    int = Math.min(int, 60);
    return Object.assign({}, c, { ef, rep, int, ult: hoje, prox: somaDias(hoje, int), ultQ: q, vistas: (c.vistas || 0) + 1, acertos: (c.acertos || 0) + (q >= 3 ? 1 : 0) });
  }
  const cartaoDevido = (c, hoje) => !c.prox || c.prox <= hoje;
  // Dora Carta: converte certo/errado + confiança numa resposta do SM-2
  function respostaDeQuestao(correta, confianca, lento) {
    if (!correta) return 'errei';
    if (confianca === 'chute') return 'dificil';
    if (confianca === 'duvida' || lento) return 'dificil';
    return 'bom';
  }

  // ---------- diário de erros ----------
  // motivo: 'erro' | 'duvida' (acertou com dúvida) | 'chute' | 'lento'. Sai após 2 acertos COM CERTEZA, o 1º ≥ 2 dias depois e o 2º ≥ 7 dias depois do 1º.
  const TIPOS_ERRO = { conteudo: 'Conteúdo (não sabia)', reconhecer: 'Não reconheci o tipo', execucao: 'Execução (errei a conta/passo)', leitura: 'Leitura ou tempo' };
  function classificarResposta({ correta, confianca, ms, alvoMs }) {
    if (!correta) return 'erro';
    if (confianca === 'chute') return 'chute';
    if (confianca === 'duvida') return 'duvida';
    if (alvoMs && ms && ms > alvoMs * 1.5) return 'lento';
    return null; // acerto limpo
  }
  function novaEntradaErro(base, motivo, hoje) {
    return Object.assign({ motivo, tipoErro: motivo === 'erro' ? '' : motivo === 'lento' ? 'leitura' : '', acertosSeg: 0, criado: hoje, ultimo: hoje, proxCheque: somaDias(hoje, 2), resolvido: false, vezes: 1 }, base);
  }
  // aplica uma nova resposta sobre o diário (lista de entradas); devolve { entradas, evento }
  function atualizarDiario(entradas, ref, resp, hoje) {
    const motivo = classificarResposta(resp); const lista = entradas.slice();
    const i = lista.findIndex(e => e.refTipo === ref.refTipo && e.refId === ref.refId && !e.resolvido);
    if (motivo) {
      if (i < 0) { const e = novaEntradaErro(ref, motivo, hoje); lista.push(e); return { entradas: lista, evento: 'nova', entrada: e }; }
      const e = Object.assign({}, lista[i], { motivo: motivo === 'erro' || lista[i].motivo !== 'erro' ? motivo : lista[i].motivo, acertosSeg: 0, ultimo: hoje, proxCheque: somaDias(hoje, 2), vezes: (lista[i].vezes || 1) + 1 }); lista[i] = e; return { entradas: lista, evento: 'reincidiu', entrada: e };
    }
    if (i < 0) return { entradas: lista, evento: null };
    const e = Object.assign({}, lista[i]);
    if (hoje < e.proxCheque) { return { entradas: lista, evento: 'cedo', entrada: e }; } // acerto no mesmo dia não conta
    e.acertosSeg += 1; e.ultimo = hoje;
    if (e.acertosSeg >= 2) { e.resolvido = true; e.resolvidoEm = hoje; lista[i] = e; return { entradas: lista, evento: 'saiu', entrada: e }; }
    e.proxCheque = somaDias(hoje, 7); lista[i] = e; return { entradas: lista, evento: 'contou', entrada: e };
  }

  // ---------- nota do tópico e prioridade ----------
  function acertosDe(resps) { return (resps || []).reduce((a, r) => ({ n: a.n + (r.qtd || 1), ok: a.ok + (r.acertos != null ? r.acertos : (r.correta ? 1 : 0)) }), { n: 0, ok: 0 }); }
  // nota 0-100 combinando: questões (40%), cartões (25%), domínio marcado (20%), revisão em dia (15%); o que não tem dado sai da conta
  function notaTopico({ respostas = [], cartoes = [], dominio = null, ultEstudo = null, proxRev = null }, hoje) {
    const comp = {}; const q = acertosDe(respostas);
    comp.questoes = q.n ? q.ok / q.n : null;
    const est = cartoes.filter(c => c.vistas > 0);
    comp.cartoes = est.length ? est.reduce((a, c) => a + (c.ultQ >= 3 ? (c.prox && c.prox < hoje ? 0.5 : 1) : 0), 0) / est.length : null;
    comp.marcado = dominio == null ? null : dominio / 100;
    comp.revisao = !ultEstudo ? null : (!proxRev || proxRev >= hoje ? 1 : Math.max(0, 1 - diasEntre(proxRev, hoje) / 7));
    const P = { questoes: 0.4, cartoes: 0.25, marcado: 0.2, revisao: 0.15 }; let s = 0, w = 0;
    for (const k in P) if (comp[k] != null) { s += P[k] * comp[k]; w += P[k]; }
    return { nota: w ? Math.round(100 * s / w) : 0, temDado: w > 0, comp };
  }
  function intervaloRevisao(nota, dificuldade) { let d = nota < 40 ? 1 : nota < 60 ? 2 : nota < 75 ? 4 : nota < 90 ? 7 : 12; if (dificuldade >= 4) d = Math.max(1, Math.round(d * 0.6)); if (dificuldade && dificuldade <= 2) d = Math.round(d * 1.3); return d; }
  function proximaRevisao(ultEstudo, nota, dificuldade, provaData) {
    if (!ultEstudo) return null; let p = somaDias(ultEstudo, intervaloRevisao(nota, dificuldade));
    if (provaData) { const lim = somaDias(provaData, -1); if (p > lim) p = lim; }
    return p;
  }
  // prioridade = questões esperadas × fraqueza × urgência
  //  esperadas: peso da disciplina (nº de questões) repartido pelos tópicos conforme a relevância
  //  fraqueza: 1 − nota/100 (sem dado: 0,85, "ainda não sei")
  //  urgência: 1 + atraso na revisão + tempo sem estudar + proximidade da prova
  function urgencia(t, hoje, provaData) {
    let u = 1;
    if (!t.ultEstudo) u += 0.5; else { u += Math.min(1, diasEntre(t.ultEstudo, hoje) / 21) * 0.6; if (t.proxRev && t.proxRev <= hoje) u += 0.4; }
    if (provaData) { const f = diasEntre(hoje, provaData); if (f >= 0 && f <= 30) u += (30 - f) / 30 * 0.3; }
    return u;
  }
  function prioridades({ disciplinas, topicos, notas = {}, hoje, provaData }) {
    const folhas = topicos.filter(t => !topicos.some(o => o.paiId === t.id));
    const porDisc = {}; folhas.forEach(t => (porDisc[t.disciplinaId] = porDisc[t.disciplinaId] || []).push(t));
    const out = [];
    disciplinas.forEach(d => {
      const ts = porDisc[d.id] || []; const somaRel = ts.reduce((a, t) => a + (t.relevancia || 3), 0) || 1; const peso = d.peso == null ? 10 : +d.peso;
      ts.forEach(t => {
        const esperadas = peso * (t.relevancia || 3) / somaRel; const nota = notas[t.id] != null ? notas[t.id] : (t.dominio != null ? t.dominio : null);
        const fraqueza = nota == null ? 0.85 : 1 - nota / 100; const urg = urgencia(t, hoje, provaData);
        out.push({ topicoId: t.id, disciplinaId: d.id, esperadas, fraqueza, urgencia: urg, nota, prioridade: Math.round(esperadas * fraqueza * urg * 1000) / 1000 });
      });
    });
    return out.sort((a, b) => b.prioridade - a.prioridade);
  }
  const prioridadeCartao = (c, prio) => (prio[c.topicoId] || 0.01) * (1 + (c.prox && c.prox < '9999' ? 0 : 0.2));

  // ---------- plano semanal ----------
  // minutosPorDia: [dom..sáb] ; devolve [{dia, rotulo, minutos, blocos:[{topicoId, minutos, tipo}], revisoes:[topicoId]}]
  function planoSemanal({ prioridade, hoje, minutosPorDia = [0, 90, 90, 90, 90, 90, 120], bloco = 45, revisoes = [] }) {
    const dias = []; const usos = {}; let k = 0; const lista = prioridade.slice(0, 40);
    for (let i = 0; i < 7; i++) {
      const dia = somaDias(hoje, i); const dow = paraData(dia).getDay(); let min = minutosPorDia[dow] || 0; const blocos = [];
      const rev = revisoes.filter(r => r.data === dia || (i === 0 && r.data < dia)).map(r => r.topicoId);
      while (min >= 25 && lista.length) {
        let escolhido = null; // evita repetir o mesmo tópico no mesmo dia e espalha pela semana
        for (let n = 0; n < lista.length; n++) { const c = lista[(k + n) % lista.length]; if (!blocos.some(b => b.topicoId === c.topicoId)) { escolhido = c; k = (k + n + 1) % lista.length; break; } }
        if (!escolhido) break; const dur = Math.min(bloco, min); blocos.push({ topicoId: escolhido.topicoId, minutos: dur, tipo: 'estudo' }); min -= dur; usos[escolhido.topicoId] = (usos[escolhido.topicoId] || 0) + dur;
      }
      dias.push({ dia, rotulo: rotuloDia(dia), minutos: (minutosPorDia[dow] || 0), blocos, revisoes: [...new Set(rev)] });
    }
    return dias;
  }
  // sequência de dias seguidos com estudo (dias = lista de 'AAAA-MM-DD'); conta a partir de hoje (ou ontem, se hoje ainda não estudou)
  function sequenciaDias(dias, hoje) {
    const s = new Set(dias); let d = s.has(hoje) ? hoje : somaDias(hoje, -1); let n = 0; while (s.has(d)) { n++; d = somaDias(d, -1); } return n;
  }

  // ---------- exportações: CSV e iCalendar ----------
  const csvCampo = (v) => { const s = v == null ? '' : String(v); return /[",;\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
  const paraCSV = (linhas, sep = ';') => '\uFEFF' + linhas.map(l => l.map(csvCampo).join(sep)).join('\r\n') + '\r\n';
  function lerCSV(texto, sep) {
    texto = String(texto || '').replace(/^\uFEFF/, ''); if (!sep) { const l1 = texto.split('\n')[0] || ''; sep = (l1.match(/;/g) || []).length >= (l1.match(/,/g) || []).length ? ';' : ','; if ((l1.match(/\t/g) || []).length > Math.max((l1.match(/;/g) || []).length, (l1.match(/,/g) || []).length)) sep = '\t'; }
    const linhas = []; let campo = '', lin = [], asp = false;
    for (let i = 0; i < texto.length; i++) {
      const c = texto[i];
      if (asp) { if (c === '"') { if (texto[i + 1] === '"') { campo += '"'; i++; } else asp = false; } else campo += c; }
      else if (c === '"') asp = true; else if (c === sep) { lin.push(campo); campo = ''; }
      else if (c === '\n' || c === '\r') { if (c === '\r' && texto[i + 1] === '\n') i++; lin.push(campo); campo = ''; if (lin.some(x => x !== '')) linhas.push(lin); lin = []; }
      else campo += c;
    }
    lin.push(campo); if (lin.some(x => x !== '')) linhas.push(lin); return linhas;
  }
  const icsEsc = (s) => String(s || '').replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
  function dobra(l) { const out = []; let b = Buffer_len(l); while (l.length > 70) { out.push(l.slice(0, 70)); l = ' ' + l.slice(70); } out.push(l); return out.join('\r\n'); }
  function Buffer_len(s) { return s.length; }
  // eventos: [{ uid, dia:'AAAA-MM-DD', inicio:'HH:MM'|null, minutos, titulo, descricao }]; sem inicio = evento de dia inteiro
  function paraICS(eventos, nomeCal = 'Dora Draw') {
    const agora = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
    const L = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Dora Draw//PT-BR//', 'CALSCALE:GREGORIAN', 'X-WR-CALNAME:' + icsEsc(nomeCal)];
    eventos.forEach((e, i) => {
      L.push('BEGIN:VEVENT', 'UID:' + (e.uid || (uid('e') + i)) + '@doradraw.local', 'DTSTAMP:' + agora);
      const dia = e.dia.replace(/-/g, '');
      if (e.inicio) { const [h, m] = e.inicio.split(':').map(Number); const ini = new Date(2000, 0, 1, h, m); const fim = new Date(ini.getTime() + (e.minutos || 45) * 60000); L.push('DTSTART:' + dia + 'T' + p2(h) + p2(m) + '00', 'DTEND:' + dia + 'T' + p2(fim.getHours()) + p2(fim.getMinutes()) + '00'); }
      else { L.push('DTSTART;VALUE=DATE:' + dia, 'DTEND;VALUE=DATE:' + somaDias(e.dia, 1).replace(/-/g, '')); }
      L.push('SUMMARY:' + icsEsc(e.titulo)); if (e.descricao) L.push('DESCRIPTION:' + icsEsc(e.descricao)); L.push('END:VEVENT');
    });
    L.push('END:VCALENDAR'); return L.map(dobra).join('\r\n') + '\r\n';
  }

  // ---------- parser de questões em texto (PDF de sites de questões, CSV, JSON) ----------
  const normLinhas = (t) => String(t || '').replace(/\r/g, '').replace(/\u00a0/g, ' ').replace(/[ \t]+/g, ' ').split('\n').map(l => l.trim());
  function juntaLetrasSoltas(linhas) { // "A" / "texto" em linhas separadas -> "A) texto"
    const out = []; for (let i = 0; i < linhas.length; i++) { const l = linhas[i]; if (/^\(?[A-Ea-e][\).]?$/.test(l) && i + 1 < linhas.length && linhas[i + 1]) { out.push(l.replace(/[().]/g, '').toUpperCase() + ') ' + linhas[i + 1]); i++; } else out.push(l); } return out;
  }
  const RE_GAB = /(?:gabarito|resposta(?:\s+correta)?|gab\.?|alternativa\s+correta)\s*[:\-–]?\s*(?:letra\s*|alternativa\s*)?\(?([A-Ea-e]|certo|errado)\)?(?![A-Za-zÀ-ÿ])/i;
  function extrairAlternativas(texto) { // devolve { enunciado, alternativas:[{letra,texto}] } exigindo sequência A, B, C...
    const re = /(?:^|\n|\s)\(?([A-Ea-e])\s*[\).]\s+/g; const marcas = []; let m;
    while ((m = re.exec(texto))) marcas.push({ letra: m[1].toUpperCase(), ini: m.index + (m[0].length - m[0].trimStart().length), fim: re.lastIndex });
    // procura a melhor sequência A,B,C,... (a última sequência completa que começa em A)
    let melhor = [];
    for (let s = 0; s < marcas.length; s++) { if (marcas[s].letra !== 'A') continue; const seq = [marcas[s]]; let prox = 'B'; for (let j = s + 1; j < marcas.length; j++) if (marcas[j].letra === prox) { seq.push(marcas[j]); prox = String.fromCharCode(prox.charCodeAt(0) + 1); } if (seq.length >= melhor.length && seq.length >= 2) melhor = seq; }
    if (melhor.length < 2) return null;
    const alts = melhor.map((mk, i) => ({ letra: mk.letra, texto: texto.slice(mk.fim, i + 1 < melhor.length ? melhor[i + 1].ini : texto.length).replace(/\s+/g, ' ').trim() }));
    return { enunciado: texto.slice(0, melhor[0].ini).replace(/\s+/g, ' ').trim(), alternativas: alts };
  }
  function lerMeta(bloco) {
    const meta = {}; const FIM = '(?=\\s+(?:banca|ano|[óo]rg[ãa]o|disciplina|assunto)\\s*[:\\-–]|\\n|$|[|;])';
    const get = (nome, n = 80) => { const m = bloco.match(new RegExp('\\b' + nome + '\\s*[:\\-–]\\s*([^\\n|;]{2,' + n + '}?)' + FIM, 'i')); return m ? m[1].trim() : ''; };
    meta.banca = get('banca', 40); const a = get('ano', 4); const am = a.match(/\d{4}/) || bloco.match(/\b(20[0-3]\d|19[89]\d)\b/); meta.ano = am ? +am[0] : null;
    meta.orgao = get('[óo]rg[ãa]o', 60); meta.disciplina = get('disciplina', 60); meta.assunto = get('assunto', 80);
    return meta;
  }
  function blocoParaQuestao(bruto) {
    let corpo = bruto; let comentario = '';
    const mc = corpo.match(/\n\s*(?:coment[áa]rio|resolu[çc][ãa]o|explica[çc][ãa]o|justificativa)[^\n:]*[:\-–]?\s*/i);
    if (mc) { comentario = corpo.slice(mc.index + mc[0].length).trim(); corpo = corpo.slice(0, mc.index); }
    let gab = ''; const mg = (corpo + '\n' + comentario).match(RE_GAB);
    if (mg) { gab = mg[1].toUpperCase(); if (gab === 'CERTO') gab = 'C'; else if (gab === 'ERRADO') gab = 'E'; corpo = corpo.replace(new RegExp(RE_GAB.source, 'i'), ''); }
    const meta = lerMeta(corpo);
    corpo = corpo.replace(/^\s*(?:banca|ano|[óo]rg[ãa]o|disciplina|assunto)\s*[:\-–].*$/gim, '');
    const ea = extrairAlternativas(corpo);
    if (ea && ea.enunciado.length > 10) {
      return Object.assign({ tipo: 'multipla', enunciado: ea.enunciado, alternativas: ea.alternativas, gabarito: gab, comentario }, meta);
    }
    // certo/errado: sem alternativas, mas com gabarito C/E (Cespe/Cebraspe)
    if (/^[CE]$/.test(gab) && corpo.replace(/\s+/g, ' ').trim().length > 20) {
      const enun = corpo.replace(/\b(certo|errado)\b\s*$/i, '').replace(/\s+/g, ' ').trim();
      return Object.assign({ tipo: 'certo-errado', enunciado: enun, alternativas: [{ letra: 'C', texto: 'Certo' }, { letra: 'E', texto: 'Errado' }], gabarito: gab, comentario }, meta);
    }
    return null;
  }
  function parseQuestoesTexto(texto) {
    const linhas = juntaLetrasSoltas(normLinhas(texto)); let t = linhas.join('\n');
    // gabarito geral no fim: "Gabarito: 1-A 2-C 3-E" / "1. A" ...
    let gabGeral = {}; const mg = t.match(/\n\s*(?:gabarito|respostas)\s*(?:oficial|geral)?\s*[:\-–]?\s*\n?((?:\s*(?:quest[ãa]o\s*)?\d{1,4}\s*[.:)\-–]?\s*(?:[A-Ea-e]|certo|errado)\b[\s,;]*)+)\s*$/i);
    if (mg) { const re = /(\d{1,4})\s*[.:)\-–]?\s*([A-Ea-e]|certo|errado)\b/gi; let m; while ((m = re.exec(mg[1]))) { let v = m[2].toUpperCase(); if (v === 'CERTO') v = 'C'; if (v === 'ERRADO') v = 'E'; gabGeral[+m[1]] = v; } t = t.slice(0, mg.index); }
    // divide em blocos
    let marcas = []; const reQ = /^\s*(?:quest[ãa]o|q)\s*\.?\s*(\d{1,7})\b.*$/gim; let m;
    while ((m = reQ.exec(t))) marcas.push({ ini: m.index, num: +m[1] });
    if (marcas.length < 1) { const reN = /^\s*(\d{1,4})\s*[.)\-–]\s+(?=\S)/gm; while ((m = reN.exec(t))) marcas.push({ ini: m.index, num: +m[1] }); }
    const blocos = marcas.length ? marcas.map((mk, i) => ({ num: mk.num, txt: t.slice(mk.ini, i + 1 < marcas.length ? marcas[i + 1].ini : t.length).replace(/^\s*(?:quest[ãa]o|q)\s*\.?\s*\d+\s*[.)\-–:]?/i, '').replace(/^\s*\d{1,4}\s*[.)\-–]\s+/, '') })) : [{ num: 1, txt: t }];
    const out = [];
    blocos.forEach((b, i) => { const q = blocoParaQuestao(b.txt); if (q) { if (!q.gabarito && gabGeral[b.num]) q.gabarito = gabGeral[b.num]; else if (!q.gabarito && gabGeral[i + 1]) q.gabarito = gabGeral[i + 1]; q.num = b.num; out.push(q); } });
    return out;
  }
  function normalizaQuestao(o) {
    const alts = Array.isArray(o.alternativas) ? o.alternativas.map((a, i) => typeof a === 'string' ? { letra: 'ABCDE'[i], texto: a } : { letra: (a.letra || 'ABCDE'[i]).toUpperCase(), texto: a.texto || '' }) : o.alternativas && typeof o.alternativas === 'object' ? Object.keys(o.alternativas).map(k => ({ letra: k.toUpperCase(), texto: String(o.alternativas[k]) })) : [];
    let g = String(o.gabarito || o.resposta || '').trim().toUpperCase(); if (g === 'CERTO') g = 'C'; if (g === 'ERRADO') g = 'E'; g = g.slice(0, 1);
    return { tipo: o.tipo || (alts.length === 2 && alts[0].letra === 'C' ? 'certo-errado' : 'multipla'), enunciado: String(o.enunciado || o.pergunta || '').trim(), alternativas: alts, gabarito: g, comentario: String(o.comentario || o.explicacao || '').trim(), banca: o.banca || '', ano: o.ano ? +o.ano : null, orgao: o.orgao || '', disciplina: o.disciplina || '', assunto: o.assunto || '', fonte: o.fonte || '' };
  }
  function questoesDeCSV(texto) {
    const l = lerCSV(texto); if (l.length < 2) return []; const cab = l[0].map(c => c.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''));
    const ix = (...nomes) => cab.findIndex(c => nomes.includes(c)); const iE = ix('enunciado', 'pergunta', 'questao'), iG = ix('gabarito', 'resposta', 'correta');
    if (iE < 0) return []; const letras = ['a', 'b', 'c', 'd', 'e'].map(x => ix(x, 'alternativa ' + x, 'alt ' + x, 'alternativa_' + x));
    const iAlt = ix('alternativas'); const iB = ix('banca'), iA = ix('ano'), iAs = ix('assunto'), iC = ix('comentario', 'explicacao', 'resolucao'), iO = ix('orgao'), iD = ix('disciplina'), iF = ix('fonte', 'url');
    return l.slice(1).map(r => {
      let alternativas = letras.map((j, k) => j >= 0 && r[j] ? { letra: 'ABCDE'[k], texto: r[j] } : null).filter(Boolean);
      if (!alternativas.length && iAlt >= 0 && r[iAlt]) alternativas = r[iAlt].split(/\s*\|\s*/).map((t, k) => ({ letra: 'ABCDE'[k], texto: t.replace(/^\(?[A-E][\).]\s*/, '') }));
      return normalizaQuestao({ enunciado: r[iE], alternativas, gabarito: iG >= 0 ? r[iG] : '', banca: iB >= 0 ? r[iB] : '', ano: iA >= 0 ? r[iA] : null, assunto: iAs >= 0 ? r[iAs] : '', comentario: iC >= 0 ? r[iC] : '', orgao: iO >= 0 ? r[iO] : '', disciplina: iD >= 0 ? r[iD] : '', fonte: iF >= 0 ? r[iF] : '' });
    }).filter(q => q.enunciado);
  }
  function questoesDeJSON(texto) { let v; try { v = JSON.parse(texto); } catch (e) { return []; } if (!Array.isArray(v)) v = v.questoes || v.questions || []; return v.map(normalizaQuestao).filter(q => q.enunciado); }

  // ---------- IA: JSON e escada de modelos ----------
  function extrairJSON(texto) {
    let t = String(texto || '').trim(); const cerca = t.match(/```(?:json)?\s*([\s\S]*?)```/i); if (cerca) t = cerca[1].trim();
    try { return JSON.parse(t); } catch (e) { /* tenta recortar */ }
    const a = t.search(/[\[{]/); if (a < 0) return null; const abre = t[a], fecha = abre === '[' ? ']' : '}'; const z = t.lastIndexOf(fecha); if (z <= a) return null;
    try { return JSON.parse(t.slice(a, z + 1)); } catch (e) { return null; }
  }
  const HORAS = 3600000;
  // escada: { ordem:[ids], bloqueios:{ id:{ ate:ts, motivo:'cota'|'semcota' } }, removidos:[ids] }
  const ESCADA_GEMINI = ['gemini-4-neon', 'gemini-4-argon', 'gemini-4-carbon', 'gemini-3.1-pro-preview', 'gemini-4-hydrogen', 'gemini-3.7-flash', 'gemini-3.5-flash', 'gemini-3.1-flash-lite'];
  const ESCADA_CLAUDE = ['claude-fable-5-2', 'claude-opus-5-5', 'claude-sonnet-5-5', 'claude-haiku-5-5'];
  const liberarTudo = (esc) => ({ ordem: esc.ordem.slice(), bloqueios: {}, removidos: esc.removidos.slice() }); // botão "tentar o melhor agora"
  function novaEscada(ordem) { return { ordem: ordem.slice(), bloqueios: {}, removidos: [] }; }
  function modeloAtivo(esc, agora) { return esc.ordem.find(id => !esc.removidos.includes(id) && !(esc.bloqueios[id] && esc.bloqueios[id].ate > agora)) || null; }
  function bloqueados(esc, agora) { return Object.keys(esc.bloqueios).filter(id => esc.bloqueios[id].ate > agora && !esc.removidos.includes(id)).map(id => Object.assign({ id }, esc.bloqueios[id])); }
  // lê "retryDelay":"37s" / "Please retry in 37.2s" do corpo do erro (ms) ou null
  function esperaDoErro(corpo) {
    const s = typeof corpo === 'string' ? corpo : JSON.stringify(corpo || ''); let m = s.match(/"retryDelay"\s*:\s*"(\d+(?:\.\d+)?)s"/); if (!m) m = s.match(/retry in (\d+(?:\.\d+)?)s/i); return m ? Math.ceil(parseFloat(m[1]) * 1000) : null;
  }
  // devolve nova escada (imutável) e o que aconteceu: 'bloqueado' | 'semcota' | 'removido' | 'outro'
  function registrarFalha(esc, id, status, corpo, agora, horasPadrao = 5) {
    const e = { ordem: esc.ordem.slice(), bloqueios: Object.assign({}, esc.bloqueios), removidos: esc.removidos.slice() }; const txt = typeof corpo === 'string' ? corpo : JSON.stringify(corpo || '');
    if (status === 404) { if (!e.removidos.includes(id)) e.removidos.push(id); return { escada: e, acao: 'removido' }; }
    if (status === 429 || /RESOURCE_EXHAUSTED|rate_limit|overloaded/i.test(txt)) {
      // "limit: 0" (sem cota gratuita) também volta a ser tentado depois do bloqueio padrão (5 h): nada fica bloqueado para sempre
      const semCota = /limit:\s*0\b/.test(txt); const espera = esperaDoErro(txt) || 0;
      e.bloqueios[id] = { ate: agora + Math.max(espera, horasPadrao * HORAS), motivo: semCota ? 'semcota' : 'cota' }; return { escada: e, acao: semCota ? 'semcota' : 'bloqueado' };
    }
    return { escada: e, acao: 'outro' };
  }
  // junta a ordem preferida com a lista da API (models.list): mantém a ordem do usuário, acrescenta novos "generateContent" no fim, tira os que a API não lista
  function mesclarEscada(esc, listaApi) {
    const lista = (listaApi || []).filter(Boolean); if (!lista.length) return esc;
    const ordem = esc.ordem.filter(id => lista.includes(id)); lista.forEach(id => { if (!ordem.includes(id)) ordem.push(id); });
    return { ordem, bloqueios: esc.bloqueios, removidos: esc.removidos.filter(id => lista.includes(id)) };
  }
  // ordena nomes do Gemini do "melhor" ao mais simples (série maior primeiro; pro > flash > flash-lite; sem preview antes)
  function ordenarGemini(ids) {
    const pts = (id) => { const m = id.match(/gemini-(\d+(?:\.\d+)?)/); const v = m ? parseFloat(m[1]) : 0; const t = /ultra|neon|argon|carbon/.test(id) ? 4 : /pro/.test(id) ? 3 : /lite/.test(id) ? 1 : /flash|hydrogen/.test(id) ? 2 : 1.5; return v * 10 + t - (/preview|exp/.test(id) ? 0.5 : 0); };
    return ids.slice().sort((a, b) => pts(b) - pts(a));
  }
  // gasto estimado (US$): tokens em milhões × preço; Gemini gratuito = 0
  function custoUSD(uso, precos) { return (uso.tokIn / 1e6) * (precos.entrada || 0) + (uso.tokOut / 1e6) * (precos.saida || 0); }
  const dentroDoTeto = (gastoUSD, tetoUSD) => !(tetoUSD > 0) || gastoUSD < tetoUSD;

  // ---------- backup ----------
  const VERSAO_BACKUP = 1;
  const LOJAS = ['concursos', 'disciplinas', 'topicos', 'cartoes', 'questoes', 'cadernos', 'respostas', 'erros', 'materiais', 'grifos', 'sessoes', 'capturas', 'simulados', 'mural', 'penas', 'marcacoes', 'artefatos', 'config']; // 'artefatos' = criações salvas da Dora Estúdio; o índice 'rag' fica fora (é refeito)
  function montarBackup(dados, extra = {}) { const out = { app: 'dora-draw', versao: VERSAO_BACKUP, criadoEm: new Date().toISOString() }; Object.assign(out, extra); LOJAS.forEach(l => { out[l] = (dados[l] || []).slice(); }); return out; }
  function validarBackup(o) {
    if (!o || typeof o !== 'object') return { ok: false, erro: 'O arquivo não é um backup do Dora Draw.' };
    if (o.app !== 'dora-draw') return { ok: false, erro: 'Este arquivo não é um backup do Dora Draw.' };
    if (typeof o.versao !== 'number' || o.versao > VERSAO_BACKUP) return { ok: false, erro: 'Este backup é de uma versão mais nova do app. Atualize o Dora Draw.' };
    for (const l of LOJAS) if (o[l] != null && !Array.isArray(o[l])) return { ok: false, erro: 'Backup danificado (parte "' + l + '").' };
    const nConc = (o.concursos || []).length; return { ok: true, resumo: { concursos: nConc, topicos: (o.topicos || []).length, cartoes: (o.cartoes || []).length, questoes: (o.questoes || []).length } };
  }
  // modo 'substituir' devolve o backup como está; 'mesclar' mantém o que já existe e acrescenta o que tem id novo
  function mesclarDados(atual, backup) { const out = {}; LOJAS.forEach(l => { const m = new Map((atual[l] || []).map(x => [x.id != null ? x.id : x.chave, x])); (backup[l] || []).forEach(x => { const k = x.id != null ? x.id : x.chave; if (!m.has(k)) m.set(k, x); }); out[l] = [...m.values()]; }); return out; }


  // ---------- cobertura do edital, ritmo e estimativa ----------
  const folhasDe = (topicos) => topicos.filter(t => !topicos.some(o => o.paiId === t.id));
  // % de tópicos (folhas) estudados e revisados, no total e por disciplina
  function coberturaEdital(disciplinas, topicos) {
    const folhas = folhasDe(topicos); const calc = (fs) => { const n = fs.length; const est = fs.filter(t => t.ultEstudo).length; const rev = fs.filter(t => (t.revs || []).length > 0).length; return { n, estudados: est, revisados: rev, pctEst: n ? Math.round(100 * est / n) : 0, pctRev: n ? Math.round(100 * rev / n) : 0 }; };
    return { total: calc(folhas), porDisc: disciplinas.map(d => Object.assign({ id: d.id, nome: d.nome }, calc(folhas.filter(t => t.disciplinaId === d.id)))) };
  }
  // ritmo: minutos por semana (média das últimas 4 semanas) e minutos por tópico estudado (padrão 90 enquanto há pouco dado)
  function ritmo({ sessoes, topicosEstudados, hoje }) {
    const rec = sessoes.filter(s => diasEntre(diaLocal(s.inicio), hoje) < 28); const min4 = rec.reduce((a, s) => a + (s.minutos || 0), 0); const total = sessoes.reduce((a, s) => a + (s.minutos || 0), 0);
    return { minutosSemana: min4 / 4, minutosPorTopico: topicosEstudados >= 3 && total > 0 ? Math.max(20, total / topicosEstudados) : 90 };
  }
  function estimativaCobertura({ restantes, minutosPorTopico, minutosSemana, hoje, provaData }) {
    if (restantes <= 0) return { semanas: 0, concluido: true, passaDaProva: false, semDados: false };
    if (!(minutosSemana > 0)) return { semanas: null, semDados: true, passaDaProva: false };
    const semanas = Math.ceil(restantes * minutosPorTopico / minutosSemana * 10) / 10; const dataPrevista = somaDias(hoje, Math.ceil(semanas * 7));
    return { semanas, dataPrevista, semDados: false, passaDaProva: !!provaData && dataPrevista > provaData, diasDeSobra: provaData ? diasEntre(dataPrevista, provaData) : null };
  }

  // ---------- Dora Agenda: distribui a fila de prioridade pelos dias fixos da semana até a véspera da prova ----------
  function agendaAteProva({ prioridade, hoje, provaData, minutosPorDia, minutosPorTopico = 60, maxDias = 400 }) {
    const fim = provaData ? somaDias(provaData, -1) : somaDias(hoje, 55); const fila = prioridade.slice(); const dias = []; let n = 0;
    for (let d = hoje; d <= fim && n < maxDias; d = somaDias(d, 1), n++) {
      let min = minutosPorDia[paraData(d).getDay()] || 0; const blocos = [];
      while (min >= 20 && fila.length) { const p = fila.shift(); const dur = Math.min(minutosPorTopico, min); blocos.push({ topicoId: p.topicoId, minutos: dur }); min -= dur; }
      if (blocos.length) dias.push({ dia: d, rotulo: rotuloDia(d), blocos });
    }
    return { dias, naoCabem: fila.map(p => p.topicoId) };
  }

  // ---------- Dora Ciclo ----------
  // meta de cada disciplina no ciclo = horas do ciclo × (peso × fraqueza média) / soma; a próxima é a primeira, na ordem do ciclo, que ainda não bateu a meta
  // niveis: {idDaDisciplina: 1 a 5} (1 = estou começando, pede mais horas; 5 = muito bom, pede menos)
  const FATOR_NIVEL = { 1: 1.5, 2: 1.25, 3: 1, 4: 0.8, 5: 0.6 };
  function ciclo({ disciplinas, topicos, notas = {}, feitos = {}, horasCiclo = 20, niveis = {} }) {
    const folhas = folhasDe(topicos); const base = disciplinas.map(d => { const ts = folhas.filter(t => t.disciplinaId === d.id); if (!ts.length) return null; const fr = ts.reduce((a, t) => a + (notas[t.id] == null ? 0.85 : 1 - notas[t.id] / 100), 0) / ts.length; return { id: d.id, nome: d.nome, w: Math.max(0.01, (d.peso == null ? 10 : +d.peso) * fr * (FATOR_NIVEL[niveis[d.id]] || 1)) }; }).filter(Boolean);
    const soma = base.reduce((a, b) => a + b.w, 0) || 1; const itens = base.sort((a, b) => b.w - a.w).map(b => { const meta = Math.round(horasCiclo * 60 * b.w / soma); const feito = Math.round(feitos[b.id] || 0); return { id: b.id, nome: b.nome, meta, feito, falta: Math.max(0, meta - feito), pct: meta ? Math.min(100, Math.round(100 * feito / meta)) : 100 }; });
    const pend = itens.find(i => i.falta > 0); return { itens, proxima: pend || itens[0] || null, completo: itens.length > 0 && !pend, minutosFeitos: itens.reduce((a, i) => a + Math.min(i.feito, i.meta), 0), minutosMeta: itens.reduce((a, i) => a + i.meta, 0) };
  }

  // ---------- nota do simulado pelo Quadro da prova ----------
  // quadro: [{id, nome, questoes, pontos (por questão), minimo (acertos líquidos mínimos)}]; penalidade 1 = cada erro anula um acerto (estilo certo/errado)
  function notaSimulado({ quadro, resultados, penalidade = 0, minimoGeral = 0 }) {
    const motivos = []; let total = 0, maximo = 0;
    const porDisc = quadro.map(q => { const r = resultados[q.id] || { acertos: 0, erros: 0, branco: 0 }; const pts = q.pontos == null ? 1 : +q.pontos; const liquidos = Math.max(0, r.acertos - penalidade * r.erros); const pontos = liquidos * pts; const max = (+q.questoes || 0) * pts; const minimo = +q.minimo || 0; const abaixo = minimo > 0 && liquidos < minimo; if (abaixo) motivos.push(q.nome + ': ' + liquidos + ' acertos líquidos, o mínimo é ' + minimo); total += pontos; maximo += max; return { id: q.id, nome: q.nome, pontos, maximo: max, acertos: r.acertos, erros: r.erros, branco: r.branco, liquidos, minimo, abaixo, pct: max ? Math.round(1000 * pontos / max) / 10 : 0 }; });
    if (minimoGeral > 0 && total < minimoGeral) motivos.push('Total de ' + total + ' pontos, o mínimo geral é ' + minimoGeral);
    return { porDisc, total, maximo, pct: maximo ? Math.round(1000 * total / maximo) / 10 : 0, eliminado: motivos.length > 0, motivos };
  }
  // sims: [{data, nota}] em qualquer ordem
  function compararSimulados(sims) {
    const l = sims.slice().sort((a, b) => (a.data || '').localeCompare(b.data || '') || (a.criado || 0) - (b.criado || 0)); if (!l.length) return null; const ult = l[l.length - 1]; const ant = l.length > 1 ? l[l.length - 2] : null; const media = l.reduce((a, s) => a + s.nota.pct, 0) / l.length;
    const ordem = ult.nota.porDisc.slice().sort((a, b) => b.pct - a.pct); const k = Math.max(1, Math.min(2, Math.floor(ordem.length / 2))); const fracos = ordem.slice().reverse().slice(0, k).filter(d => d.pct < 100); const treinar = ult.nota.porDisc.filter(d => d.abaixo).map(d => d.nome); fracos.forEach(f => { if (!treinar.includes(f.nome)) treinar.push(f.nome); });
    return { ultimo: ult, anterior: ant, deltaAnterior: ant ? Math.round((ult.nota.pct - ant.nota.pct) * 10) / 10 : null, media: Math.round(media * 10) / 10, deltaMedia: Math.round((ult.nota.pct - media) * 10) / 10, evolucao: l.map(s => s.nota.pct), fortes: ordem.slice(0, k).filter(d => d.pct > 0), fracos, treinar };
  }

  // ---------- revisões ----------
  // dias padrão das revisões de um tópico concluído (e do modo "Dias fixos" dos cartões, em logica3.js)
  const DIAS_REVISAO_PADRAO = [1, 7, 30];
  const datasRevisao = (base, dias = DIAS_REVISAO_PADRAO) => dias.map(n => somaDias(base, n));
  function revisaoReforcada({ topicos, respostas, hoje, janela = 30, minResp = 4, limiar = 0.6 }) {
    const porT = {}; respostas.filter(r => r.topicoId && diasEntre(r.dia || diaLocal(r.ts), hoje) <= janela).forEach(r => { const a = porT[r.topicoId] = porT[r.topicoId] || { n: 0, ok: 0 }; a.n += r.qtd || 1; a.ok += r.acertos != null ? r.acertos : (r.correta ? 1 : 0); });
    return Object.keys(porT).filter(id => porT[id].n >= minResp && porT[id].ok / porT[id].n < limiar && topicos.some(t => t.id === id)).map(id => ({ topicoId: id, pct: Math.round(100 * porT[id].ok / porT[id].n), n: porT[id].n })).sort((a, b) => a.pct - b.pct);
  }

  // ---------- Dora Cofre: rotação das cópias automáticas (20 mais recentes + 1 por dia nos últimos 30 dias) ----------
  function rotacionarCopias(copias, agora, { recentes = 20, dias = 30 } = {}) {
    const l = copias.slice().sort((a, b) => b.ts - a.ts); const manter = new Set(l.slice(0, recentes).map(c => c.id)); const hoje = diaLocal(agora); const vistos = new Set();
    l.forEach(c => { const d = diaLocal(c.ts); if (diasEntre(d, hoje) <= dias && !vistos.has(d)) { vistos.add(d); manter.add(c.id); } });
    return { manter: l.filter(c => manter.has(c.id)).map(c => c.id), apagar: l.filter(c => !manter.has(c.id)).map(c => c.id) };
  }

  // ---------- Estruturas da Guilda: concurso pronto em JSON ----------
  const VERSAO_ESTRUTURA = 1; const FICHA = ['nome', 'banca', 'orgao', 'cargo', 'salario', 'vagas', 'cargaHoraria', 'linkEdital', 'dataProva', 'horaProva', 'situacao'];
  function montarEstrutura({ concurso, disciplinas, topicos, simulados = [] }) {
    const ficha = {}; FICHA.forEach(k => { if (concurso[k] != null && concurso[k] !== '') ficha[k] = concurso[k]; });
    return { app: 'dora-draw-estrutura', versao: VERSAO_ESTRUTURA, criadoEm: new Date().toISOString(), concurso: ficha,
      disciplinas: disciplinas.map(d => ({ ref: d.id, nome: d.nome, questoes: d.peso, pontos: d.pontos == null ? 1 : d.pontos, minimo: d.minimo || 0, ordem: d.ordem })),
      topicos: topicos.map(t => ({ ref: t.id, disciplina: t.disciplinaId, pai: t.paiId || null, titulo: t.titulo, ordem: t.ordem, relevancia: t.relevancia || 3, dificuldade: t.dificuldade || 3, links: (t.links || []).map(x => ({ url: x.url, titulo: x.titulo, tipo: x.tipo })) })),
      regras: { penalidade: concurso.penalidade || 0, minimoGeral: concurso.minimoGeral || 0 },
      simulados: simulados.map(s => ({ nome: s.nome, data: s.data, resultados: Object.fromEntries(Object.entries(s.resultados || {}).map(([k, v]) => [k, { acertos: v.acertos, erros: v.erros, branco: v.branco }])) })) };
  }
  const urlOk = (u) => { try { const x = new URL(u); return x.protocol === 'http:' || x.protocol === 'https:'; } catch (e) { return false; } };
  function validarEstrutura(o) {
    const falha = (erro) => ({ ok: false, erro });
    if (!o || typeof o !== 'object') return falha('O arquivo não é uma estrutura de concurso.'); if (o.app !== 'dora-draw-estrutura') return falha('Este arquivo não é uma estrutura do Dora Draw.'); if (typeof o.versao !== 'number' || o.versao > VERSAO_ESTRUTURA) return falha('Estrutura de uma versão mais nova do app.');
    if (!o.concurso || typeof o.concurso.nome !== 'string' || !o.concurso.nome.trim()) return falha('A estrutura não tem o nome do concurso.');
    for (const k of ['disciplinas', 'topicos']) if (!Array.isArray(o[k])) return falha('Parte "' + k + '" ausente ou danificada.');
    if (o.disciplinas.length > 200 || o.topicos.length > 20000) return falha('Estrutura grande demais.');
    const dRefs = new Set(); for (const d of o.disciplinas) { if (!d || typeof d.ref !== 'string' || typeof d.nome !== 'string' || !d.nome.trim()) return falha('Há disciplina sem nome.'); if (d.questoes != null && !(+d.questoes >= 0)) return falha('Número de questões inválido em "' + d.nome + '".'); dRefs.add(d.ref); }
    const tRefs = new Set(o.topicos.map(t => t && t.ref)); for (const t of o.topicos) { if (!t || typeof t.ref !== 'string' || typeof t.titulo !== 'string' || !t.titulo.trim()) return falha('Há tópico sem título.'); if (!dRefs.has(t.disciplina)) return falha('O tópico "' + t.titulo + '" aponta para uma disciplina que não existe.'); if (t.pai && !tRefs.has(t.pai)) return falha('O tópico "' + t.titulo + '" aponta para um tópico pai que não existe.'); for (const x of (t.links || [])) if (!urlOk(x.url)) return falha('Link inválido em "' + t.titulo + '" (só endereços http ou https).'); }
    if (o.concurso.linkEdital && !urlOk(o.concurso.linkEdital)) return falha('O link do edital não é um endereço http ou https.');
    for (const s of (o.simulados || [])) if (!s || typeof s.nome !== 'string' || !s.resultados || typeof s.resultados !== 'object') return falha('Há simulado danificado.');
    return { ok: true, resumo: { concurso: o.concurso.nome, disciplinas: o.disciplinas.length, topicos: o.topicos.length, simulados: (o.simulados || []).length, links: o.topicos.reduce((a, t) => a + (t.links || []).length, 0) } };
  }
  // cria os registros com ids novos (nunca colide com o que já existe)
  function instanciarEstrutura(o, novoId, agora = Date.now()) {
    const cid = novoId('k'); const dMap = {}, tMap = {}; const c = Object.assign({}, o.concurso, { id: cid, criado: agora, penalidade: (o.regras && o.regras.penalidade) || 0, minimoGeral: (o.regras && o.regras.minimoGeral) || 0, situacao: o.concurso.situacao || 'aguardando' });
    const disciplinas = o.disciplinas.map((d, i) => { const id = novoId('d'); dMap[d.ref] = id; return { id, concursoId: cid, nome: d.nome, peso: d.questoes == null ? 10 : +d.questoes, pontos: d.pontos == null ? 1 : +d.pontos, minimo: +d.minimo || 0, ordem: d.ordem != null ? d.ordem : i }; });
    o.topicos.forEach(t => { tMap[t.ref] = novoId('t'); });
    const topicos = o.topicos.map(t => ({ id: tMap[t.ref], concursoId: cid, disciplinaId: dMap[t.disciplina], paiId: t.pai ? tMap[t.pai] : null, titulo: t.titulo, ordem: t.ordem || 0, relevancia: t.relevancia || 3, dificuldade: t.dificuldade || 3, dominio: null, nota: null, notaHtml: '', mapa: null, quadro: null, comoBanca: '', ultEstudo: null, proxRev: null, links: (t.links || []).map(x => ({ url: x.url, titulo: x.titulo || x.url, tipo: x.tipo || 'link' })), criado: agora }));
    const nomeDisc = Object.fromEntries(o.disciplinas.map(d => [d.ref, dMap[d.ref]]));
    const simulados = (o.simulados || []).map(s => ({ id: novoId('sim'), concursoId: cid, nome: s.nome, data: s.data || '', tipo: 'lancado', resultados: Object.fromEntries(Object.entries(s.resultados).map(([k, v]) => [nomeDisc[k] || k, v])), criado: agora }));
    return { concurso: c, disciplinas, topicos, simulados };
  }

  return { DIAS_REVISAO_PADRAO, agendaAteProva, coberturaEdital, ritmo, estimativaCobertura, ciclo, notaSimulado, compararSimulados, datasRevisao, revisaoReforcada, rotacionarCopias, montarEstrutura, validarEstrutura, instanciarEstrutura, VERSAO_ESTRUTURA, diaLocal, paraData, somaDias, diasEntre, rotuloDia, uid, parseEdital, sm2, QUAL, cartaoDevido, respostaDeQuestao, TIPOS_ERRO, classificarResposta, novaEntradaErro, atualizarDiario, notaTopico, intervaloRevisao, proximaRevisao, urgencia, prioridades, prioridadeCartao, planoSemanal, sequenciaDias, paraCSV, lerCSV, paraICS, parseQuestoesTexto, normalizaQuestao, questoesDeCSV, questoesDeJSON, extrairAlternativas, extrairJSON, novaEscada, liberarTudo, ESCADA_GEMINI, ESCADA_CLAUDE, modeloAtivo, bloqueados, esperaDoErro, registrarFalha, mesclarEscada, ordenarGemini, custoUSD, dentroDoTeto, montarBackup, validarBackup, mesclarDados, LOJAS, VERSAO_BACKUP };
});
