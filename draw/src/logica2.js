/* Dora Draw — lógica pura da segunda leva (Dora Vertical, Raio-X, Rajada, Tribunal das IAs, Dora Escriba, Guilda/XP, Replanejar).
   Roda no app e no Node (node --test). Depende de DoraLogica (datas, CSV). Datas: 'AAAA-MM-DD' no fuso local. */
(function (raiz, fab) { const L2 = fab(typeof module === 'object' && module.exports ? require('./logica.js') : raiz.DoraLogica); if (typeof module === 'object' && module.exports) module.exports = L2; else raiz.DoraLogica2 = L2; })(typeof self !== 'undefined' ? self : this, function (L) {
  const { somaDias, paraData, diaLocal, diasEntre } = L;

  // =====================================================================
  // 1. Dora Vertical: parser melhorado e linhas do edital verticalizado
  // =====================================================================
  const ABREV = /^(art|arts|inc|al|nº|no|dec|lc|ex|obs|pág|págs|sr|sra|dr|dra|prof|vol|cap|seç|fl)$/i;
  // quebra um item em vários: por ";" e por "." final de frase (não quebra "art. 5", "Lei nº 8.112", "inc. II")
  function quebrarItem(texto) {
    const base = String(texto || '').replace(/\s+/g, ' ').trim(); if (!base) return [];
    const saida = [];
    for (const parte of base.split(/\s*;\s*/)) {
      let atual = ''; const pedacos = parte.split(/(?<=\.)\s+(?=[A-ZÀ-Ý"“(])/);
      for (const p of pedacos) {
        atual = atual ? atual + ' ' + p : p;
        const palavra = (atual.match(/([A-Za-zÀ-ÿ0-9º°\/]+)\.$/) || [])[1] || '';
        const ehAbrev = ABREV.test(palavra) || /^[A-ZÀ-Ý]$/.test(palavra);
        if (ehAbrev) continue; // continua juntando
        saida.push(atual); atual = '';
      }
      if (atual) saida.push(atual);
    }
    return saida.map(s => s.replace(/^[\s;:.\-–,]+|[\s;,]+$/g, '').replace(/\.$/, '').trim()).filter(s => s.length > 1);
  }
  // recebe [{nome, topicos:[{titulo,nivel,num}]}] (saída de parseEdital) e devolve versão com itens quebrados
  function refinarEdital(props) {
    let antes = 0, depois = 0;
    const out = props.map(d => {
      const topicos = [];
      d.topicos.forEach(t => {
        antes++; const partes = quebrarItem(t.titulo); const lista = partes.length ? partes : [t.titulo];
        lista.forEach((p, i) => { topicos.push({ titulo: p, nivel: t.nivel, num: (t.num || '') + (i ? '+' + i : '') }); depois++; });
      });
      return { nome: d.nome, topicos };
    });
    return { disciplinas: out, antes, depois };
  }
  // protege "art. 5", "nº 8" e "inc. II" para o parser não confundir o número do artigo com um item numerado
  function parseEditalVertical(texto) {
    const protegido = String(texto || '').replace(/\b(arts?|inc|al|nº|no)\.?\s+(?=\d)/gi, (m) => m.replace(/\s+$/, '\u0001'));
    const r = refinarEdital(L.parseEdital(protegido)); r.disciplinas.forEach(d => d.topicos.forEach(t => { t.titulo = t.titulo.replace(/\u0001/g, ' '); }));
    return r;
  }
  // texto legível do resultado (para "copiar resultado")
  function editalParaTexto(props) {
    const linhas = [];
    props.forEach(d => { linhas.push(d.nome.toUpperCase()); d.topicos.forEach(t => linhas.push('  '.repeat(Math.max(0, (t.nivel || 1) - 1)) + '- ' + t.titulo)); linhas.push(''); });
    return linhas.join('\n').replace(/\n+$/, '\n');
  }

  const CAIXAS = ['teoria', 'questoes', 'r1', 'r2', 'r3'];
  // linhas do edital verticalizado. topico.vert = { teoria, questoes, r1, r2, r3, data }
  function montarVertical({ disciplinas, topicos, respostas = [], filtro = {} }) {
    const feitasPor = {}; respostas.forEach(r => { if (!r.topicoId) return; const a = feitasPor[r.topicoId] = feitasPor[r.topicoId] || { n: 0, ok: 0 }; const q = r.qtd != null ? r.qtd : 1; a.n += q; a.ok += r.qtd != null ? (r.acertos || 0) : (r.correta ? 1 : 0); });
    const filhosDe = {}; topicos.forEach(t => { (filhosDe[t.paiId || ''] = filhosDe[t.paiId || ''] || []).push(t); });
    Object.values(filhosDe).forEach(a => a.sort((x, y) => (x.ordem || 0) - (y.ordem || 0)));
    const linhas = [];
    const agrega = (t) => { const a = Object.assign({ n: 0, ok: 0 }, feitasPor[t.id]); (filhosDe[t.id] || []).forEach(f => { const b = agrega(f); a.n += b.n; a.ok += b.ok; }); return a; };
    const pendenteDe = (t) => { const fs = filhosDe[t.id] || []; if (!fs.length) { const v = t.vert || {}; return CAIXAS.some(c => !v[c]); } return fs.some(pendenteDe); };
    const visita = (t, nivel, disc) => {
      const ag = agrega(t); const v = Object.assign({ teoria: false, questoes: false, r1: false, r2: false, r3: false, data: '' }, t.vert || {}); const folha = !(filhosDe[t.id] || []).length;
      linhas.push({ discId: disc.id, disciplina: disc.nome, topicoId: t.id, titulo: t.titulo, nivel, folha, v, feitas: ag.n, acertos: ag.ok, pct: ag.n ? Math.round(100 * ag.ok / ag.n) : null, pendente: pendenteDe(t) });
      (filhosDe[t.id] || []).forEach(f => visita(f, nivel + 1, disc));
    };
    disciplinas.slice().sort((a, b) => (a.ordem || 0) - (b.ordem || 0)).forEach(d => { if (filtro.discId && filtro.discId !== d.id) return; (filhosDe[''] || []).filter(t => t.disciplinaId === d.id).forEach(t => visita(t, 0, d)); });
    return linhas.filter(l => (!filtro.pendentes || l.pendente) && (!filtro.fracos || (l.pct != null && l.feitas >= 3 && l.pct < 60)));
  }
  function verticalParaCSV(linhas) {
    const sn = (b) => b ? 'sim' : 'não';
    const cab = ['Disciplina', 'Tópico', 'Nível', 'Teoria lida', 'Questões feitas', 'Revisão 1', 'Revisão 2', 'Revisão 3', 'Data', '% de acerto', 'Questões respondidas'];
    return L.paraCSV([cab].concat(linhas.map(l => [l.disciplina, l.titulo, l.nivel + 1, sn(l.v.teoria), sn(l.v.questoes), sn(l.v.r1), sn(l.v.r2), sn(l.v.r3), l.v.data || '', l.pct == null ? '' : l.pct, l.feitas])));
  }

  // =====================================================================
  // 2. Raio-X da Banca
  // =====================================================================
  const contar = (itens, chave) => { const m = {}; itens.forEach(i => { const k = chave(i); if (k == null || k === '') return; m[k] = (m[k] || 0) + 1; }); return Object.entries(m).map(([k, n]) => ({ chave: k, n })).sort((a, b) => b.n - a.n || String(a.chave).localeCompare(String(b.chave))); };
  function tipoDeQuestao(q) { const n = (q.alternativas || []).length; if (q.tipo && !/^(multipla|m[úu]ltipla|objetiva)$/i.test(q.tipo)) return q.tipo; if (n === 2 || (n === 0 && /^[CE]$/.test(q.gabarito || ''))) return 'Certo ou Errado'; if (n >= 3) return 'Múltipla escolha'; return 'Outro'; }
  function dificuldadeDe(q) {
    const d = q.dificuldade; if (typeof d === 'number') return d <= 2 ? 'fácil' : d >= 4 ? 'difícil' : 'média';
    if (typeof d === 'string' && d) return d.toLowerCase().replace('facil', 'fácil').replace('dificil', 'difícil').replace('media', 'média');
    if ((q.feitas || 0) >= 2) { const p = (q.acertos || 0) / q.feitas; return p >= 0.75 ? 'fácil' : p >= 0.45 ? 'média' : 'difícil'; }
    return 'sem dado';
  }
  function raioX({ questoes, respostas = [], topicos = [], banca = '' }) {
    const nomeTop = {}; topicos.forEach(t => nomeTop[t.id] = t.titulo);
    const alvo = String(banca || '').trim().toLowerCase();
    const qs = questoes.filter(q => !q.revisar && (!alvo || String(q.banca || '').toLowerCase() === alvo));
    const assuntoDe = (q) => q.assunto || (q.topicoId && nomeTop[q.topicoId]) || 'Sem assunto';
    const porQ = {}; respostas.filter(r => r.refTipo === 'questao').forEach(r => { (porQ[r.refId] = porQ[r.refId] || []).push(r); });
    const erra = {}; let totalR = 0, totalE = 0;
    qs.forEach(q => (porQ[q.id] || []).forEach(r => { const k = assuntoDe(q); const a = erra[k] = erra[k] || { chave: k, erros: 0, total: 0, certezaErrada: 0 }; a.total++; totalR++; if (!r.correta) { a.erros++; totalE++; if (r.confianca === 'certeza') a.certezaErrada++; } }));
    const ondeErra = Object.values(erra).filter(a => a.total >= 2 && a.erros > 0).map(a => Object.assign(a, { pct: Math.round(100 * a.erros / a.total) })).sort((a, b) => b.erros - a.erros || b.pct - a.pct);
    const total = qs.length; const comPct = (lista) => lista.map(i => Object.assign(i, { pct: total ? Math.round(100 * i.n / total) : 0 }));
    return {
      total, bancas: contar(questoes.filter(q => !q.revisar), q => q.banca || 'Sem banca'),
      porAssunto: comPct(contar(qs, assuntoDe)), porTipo: comPct(contar(qs, tipoDeQuestao)), porAno: contar(qs, q => q.ano).sort((a, b) => String(a.chave).localeCompare(String(b.chave))), porDificuldade: comPct(contar(qs, dificuldadeDe)),
      pegadinhas: qs.filter(q => q.pegadinha).length, ondeErra, taxaErro: totalR ? Math.round(100 * totalE / totalR) : null, respondidas: totalR
    };
  }

  // =====================================================================
  // 3. Rajada de 5: diagnóstico e avaliação do raciocínio
  // =====================================================================
  function diagnosticoRajada(itens) {
    const total = itens.length; const acertos = itens.filter(i => i.correta).length; const ms = itens.map(i => i.ms || 0).filter(Boolean);
    const tipos = {}; itens.filter(i => !i.correta).forEach(i => { const k = i.tipoErro || 'sem-analise'; tipos[k] = (tipos[k] || 0) + 1; });
    const lentas = itens.filter(i => i.ms && ms.length && i.ms > 1.5 * (ms.reduce((a, b) => a + b, 0) / ms.length)).length;
    return { total, acertos, pct: total ? Math.round(100 * acertos / total) : 0, msMedio: ms.length ? Math.round(ms.reduce((a, b) => a + b, 0) / ms.length) : 0, tipos, certezaErrada: itens.filter(i => !i.correta && i.confianca === 'certeza').length, lentas };
  }
  function normalizaAvaliacao(o) {
    o = o || {}; const tipo = Object.keys(L.TIPOS_ERRO).includes(o.tipoErro) ? o.tipoErro : 'reconhecer';
    return { onde: String(o.onde || o.desvio || '').trim(), sinal: String(o.sinal || o.sinalPerdido || '').trim(), gesto: String(o.gesto || '').trim(), explicacao: String(o.explicacao || '').trim(), tipoErro: tipo };
  }

  // =====================================================================
  // 4. Tribunal das IAs
  // =====================================================================
  const letra = (x) => { const m = String(x == null ? '' : x).trim().toUpperCase().match(/[A-E]/); return m ? m[0] : ''; };
  function consenso(gabA, gabB) { const a = letra(gabA), b = letra(gabB); if (!a || !b) return 'indefinido'; return a === b ? 'concordam' : 'divergem'; }
  // lista: [{ q, gabB, modeloB, erro }] -> aprovadas (concordam) e revisar (divergem ou sem resposta)
  function julgarTribunal(lista) {
    const aprovadas = [], revisar = []; let concordam = 0, divergem = 0, semResposta = 0;
    lista.forEach(it => { const c = it.erro ? 'indefinido' : consenso(it.q.gabarito, it.gabB); if (c === 'concordam') { concordam++; aprovadas.push(it); } else { if (c === 'divergem') divergem++; else semResposta++; revisar.push(it); } });
    const total = lista.length; return { aprovadas, revisar, placar: { total, concordam, divergem, semResposta, pct: total ? Math.round(100 * concordam / total) : 0 } };
  }
  // verificar(q) -> { letra, modelo }. Para depois de 2 falhas seguidas (limite, teto, rede) e marca o resto como sem resposta.
  async function rodarTribunal(qs, verificar, aoProgresso) {
    const lista = []; let falhasSeguidas = 0; let parou = null;
    for (let i = 0; i < qs.length; i++) {
      const q = qs[i];
      if (parou) { lista.push({ q, gabB: '', erro: parou }); continue; }
      try { const r = await verificar(q); falhasSeguidas = 0; lista.push({ q, gabB: letra(r.letra), modeloB: r.modelo || '', erro: r.letra ? null : 'sem letra' }); }
      catch (e) { falhasSeguidas++; lista.push({ q, gabB: '', erro: e.message || 'falha' }); if (falhasSeguidas >= 2) parou = e.message || 'falha'; }
      if (aoProgresso) aoProgresso(i + 1, qs.length);
    }
    return julgarTribunal(lista);
  }

  // =====================================================================
  // 5. Dora Escriba
  // =====================================================================
  function normalizaCorrecao(o, max) {
    o = o || {}; const crit = (o.criterios || o.espelho || []).map(c => ({ nome: String(c.nome || c.criterio || ''), peso: +c.peso || 0, obtido: Math.max(0, +c.obtido || 0), comentario: String(c.comentario || '') })).filter(c => c.nome);
    const somaPeso = crit.reduce((a, c) => a + c.peso, 0); const somaObt = crit.reduce((a, c) => a + Math.min(c.obtido, c.peso || c.obtido), 0);
    let nota = o.nota != null ? +o.nota : (somaPeso ? 10 * somaObt / somaPeso : 0); if (!(nota >= 0)) nota = 0; nota = Math.min(10, Math.round(nota * 10) / 10);
    return { nota, criterios: crit, pontosFortes: [].concat(o.pontosFortes || []).map(String), melhorar: [].concat(o.melhorar || []).map(String), versaoComentada: String(o.versaoComentada || ''), linhasMax: max || 0 };
  }
  function contarLinhas(texto, caracteresPorLinha = 85) { return String(texto || '').split('\n').reduce((a, p) => a + Math.max(1, Math.ceil(p.length / caracteresPorLinha)), 0); }

  // =====================================================================
  // 6. Gamificação da Guilda (tudo derivado dos dados locais; nada de servidor)
  // =====================================================================
  const REGRAS = { xpMinuto: 1, tetoMinutosDia: 300, xpQuestao: 10, bonusAcerto: 5, bonusCerteza: 5, xpRevisao: 15, xpSimulado: 100, diaAtivoMin: 10, diaAtivoQuestoes: 3, tetoBonusChama: 14, bonusChamaPorDia: 0.03 };
  const PATENTES = [{ nome: 'Aprendiz', de: 1 }, { nome: 'Escudeiro', de: 5 }, { nome: 'Cavaleiro', de: 10 }, { nome: 'Guardião', de: 16 }, { nome: 'Mestre', de: 23 }, { nome: 'Lenda', de: 30 }];
  const xpParaNivel = (n) => n <= 1 ? 0 : Math.round(50 * Math.pow(n - 1, 1.7));
  function nivelDe(xp) {
    let n = 1; while (xpParaNivel(n + 1) <= xp && n < 99) n++;
    const pat = PATENTES.slice().reverse().find(p => n >= p.de); const ini = xpParaNivel(n), fim = xpParaNivel(n + 1);
    return { nivel: n, patente: pat.nome, patenteIdx: PATENTES.indexOf(pat), xpNivel: xp - ini, xpProx: fim - ini, falta: fim - xp, pct: Math.min(100, Math.round(100 * (xp - ini) / (fim - ini))) };
  }
  const segunda = (dia) => somaDias(dia, -((paraData(dia).getDay() + 6) % 7));
  function agregarDias({ sessoes = [], respostas = [], revisoes = [], simulados = [] }) {
    const dias = {}; const d = (k) => dias[k] = dias[k] || { min: 0, q: 0, ac: 0, cert: 0, rev: 0, sim: 0 };
    sessoes.forEach(s => { const k = s.dia || diaLocal(s.fim || s.inicio); if (k && s.minutos > 0) d(k).min += s.minutos; });
    respostas.forEach(r => { const k = r.dia || (r.ts && diaLocal(r.ts)); if (!k) return; const x = d(k); const q = r.qtd != null ? r.qtd : 1; x.q += q; if (r.qtd != null) x.ac += r.acertos || 0; else if (r.correta) { x.ac++; if (r.confianca === 'certeza') x.cert++; } });
    revisoes.forEach(k => { if (k) d(k).rev++; }); simulados.forEach(s => { const k = s.data || s.dia; if (k) d(k).sim++; });
    return dias;
  }
  const xpBase = (x) => Math.min(x.min, REGRAS.tetoMinutosDia) * REGRAS.xpMinuto + x.q * REGRAS.xpQuestao + x.ac * REGRAS.bonusAcerto + x.cert * REGRAS.bonusCerteza + x.rev * REGRAS.xpRevisao + x.sim * REGRAS.xpSimulado;
  const diaAtivo = (x) => !!x && (x.min >= REGRAS.diaAtivoMin || x.q >= REGRAS.diaAtivoQuestoes || x.rev >= 1 || x.sim >= 1);
  // sequência ("Chama da Guilda") com 1 escudo por semana (renova na segunda). Hoje sem estudo ainda não quebra a chama.
  function chama(dias, hoje) {
    const chaves = Object.keys(dias).filter(k => diaAtivo(dias[k])).sort(); const out = { atual: 0, melhor: 0, escudo: true, escudosUsados: [], porDia: {} };
    if (!chaves.length) return out;
    let streak = 0, escudo = true, semana = segunda(chaves[0]);
    for (let dia = chaves[0]; dia <= hoje; dia = somaDias(dia, 1)) {
      const sem = segunda(dia); if (sem !== semana) { semana = sem; escudo = true; }
      if (diaAtivo(dias[dia])) { streak++; out.melhor = Math.max(out.melhor, streak); }
      else if (dia < hoje) { if (streak > 0 && escudo) { escudo = false; out.escudosUsados.push(dia); } else streak = 0; }
      out.porDia[dia] = streak;
    }
    out.atual = streak; out.escudo = escudo; return out;
  }
  function calcularGuilda(dados, hoje) {
    const dias = agregarDias(dados); const ch = chama(dias, hoje); const xpPorDia = {}; let xp = 0;
    const tot = { min: 0, q: 0, ac: 0, rev: 0, sim: 0 };
    Object.keys(dias).sort().forEach(k => { const x = dias[k]; const mult = 1 + Math.min(ch.porDia[k] || 0, REGRAS.tetoBonusChama) * REGRAS.bonusChamaPorDia; const v = Math.round(xpBase(x) * (diaAtivo(x) ? mult : 1)); xpPorDia[k] = v; xp += v; tot.min += x.min; tot.q += x.q; tot.ac += x.ac; tot.rev += x.rev; tot.sim += x.sim; });
    return { xp, xpPorDia, nivel: nivelDe(xp), chama: ch, totais: tot, dias, multiplicador: 1 + Math.min(ch.atual, REGRAS.tetoBonusChama) * REGRAS.bonusChamaPorDia, conquistas: conquistas(tot, ch) };
  }
  const MARCOS = [
    ['horas', 'Horas focadas', (t) => t.min / 60, [10, 50, 100, 250, 500, 1000], ['Primeiras horas', 'Foco firme', 'Cem horas', 'Maratonista', 'Meio milhar', 'Mil horas'], (v) => Math.floor(v) + ' h'],
    ['questoes', 'Questões resolvidas', (t) => t.q, [50, 250, 1000, 2500, 5000, 10000], ['Primeiro lote', 'Duzentas e cinquenta', 'Mil questões', 'Calejado', 'Veterano', 'Dez mil'], (v) => String(v)],
    ['revisoes', 'Revisões em dia', (t) => t.rev, [5, 25, 100, 250], ['Revisor', 'Memória ativa', 'Cem revisões', 'Guardião da memória'], (v) => String(v)],
    ['simulados', 'Simulados feitos', (t) => t.sim, [1, 5, 10, 25], ['Primeiro simulado', 'Cinco provas', 'Dez provas', 'Veterano de prova'], (v) => String(v)],
    ['chama', 'Chama da Guilda (melhor sequência)', (t, c) => c.melhor, [3, 7, 30, 100], ['Faísca', 'Chama de uma semana', 'Fogueira de um mês', 'Fogo eterno'], (v) => v + ' dias']
  ];
  function conquistas(tot, ch) {
    const lista = [];
    MARCOS.forEach(([grupo, nomeGrupo, valorDe, metas, nomes, fmt]) => { const v = valorDe(tot, ch); metas.forEach((m, i) => lista.push({ id: grupo + '-' + m, grupo, grupoNome: nomeGrupo, nome: nomes[i], meta: m, valor: v, ganha: v >= m, texto: fmt(m), nivelMarco: i })); });
    return lista;
  }
  // mapa de calor: 53 colunas de 7 dias terminando em hoje (cada célula: dia, xp, nivel 0-4)
  function mapaCalor(xpPorDia, hoje, semanas = 53) {
    const fim = hoje; const dow = (paraData(fim).getDay() + 6) % 7; const ini = somaDias(fim, -(dow + 7 * (semanas - 1)));
    const max = Math.max(1, ...Object.values(xpPorDia));
    const celulas = [];
    for (let s = 0; s < semanas; s++) for (let d = 0; d < 7; d++) { const dia = somaDias(ini, s * 7 + d); if (dia > hoje) { celulas.push({ dia, xp: 0, nivel: -1, s, d }); continue; } const xp = xpPorDia[dia] || 0; celulas.push({ dia, xp, nivel: xp <= 0 ? 0 : xp <= max * 0.25 ? 1 : xp <= max * 0.5 ? 2 : xp <= max * 0.75 ? 3 : 4, s, d }); }
    return celulas;
  }
  function xpDaSemana(xpPorDia, hoje) { const ini = segunda(hoje); let s = 0; for (let d = ini; d <= hoje; d = somaDias(d, 1)) s += xpPorDia[d] || 0; return s; }
  function placarSemanal(perfis, hoje) { return perfis.map(p => ({ nome: p.nome, xpSemana: xpDaSemana(p.xpPorDia || {}, hoje), xpTotal: Object.values(p.xpPorDia || {}).reduce((a, b) => a + b, 0) })).sort((a, b) => b.xpSemana - a.xpSemana || b.xpTotal - a.xpTotal); }

  // Salão da Guilda: itens cosméticos liberados por nível
  const SALAO = {
    molduras: [['simples', 'Simples', 1], ['bronze', 'Bronze', 3], ['prata', 'Prata', 6], ['ouro', 'Ouro', 10], ['brasao', 'Brasão', 16], ['lenda', 'Lenda', 30]],
    realces: [['padrao', 'Padrão do tema', 1], ['azul', 'Azul-petróleo', 4], ['verde', 'Verde-cana', 7], ['vinho', 'Vinho', 12], ['ouro', 'Dourado', 20]],
    selos: [['nenhum', 'Sem selo', 1], ['chama', 'Chama', 2], ['escudo', 'Escudo', 5], ['livro', 'Livro aberto', 8], ['coroa', 'Coroa', 14], ['estrela', 'Estrela', 22]],
    fundos: [['liso', 'Liso', 1], ['faixas', 'Faixas', 4], ['pontos', 'Pontos', 9], ['ondas', 'Ondas', 15], ['rede', 'Rede de brasões', 24]]
  };

  // ---------- identidade visual: moldura por patente e selo por conquista (lógica pura) ----------
  // 8 molduras para 6 patentes: cada patente puxa a sua; Aprendiz e Grão-mestre/Lenda se dividem por nível. Ordem: aprendiz, estudante, praticante, veterano, estrategista, mestre, grao-mestre, lenda.
  const MOLDURAS_NIVEL = [[1, 'aprendiz'], [3, 'estudante'], [5, 'praticante'], [10, 'veterano'], [16, 'estrategista'], [23, 'mestre'], [30, 'grao-mestre'], [45, 'lenda']];
  const molduraDoNivel = (nivel) => { let r = MOLDURAS_NIVEL[0][1]; MOLDURAS_NIVEL.forEach(([n, id]) => { if (nivel >= n) r = id; }); return r; };
  // Cada conquista (brasão) usa um dos 12 selos novos. Selo não conquistado aparece cinza/opaco na tela.
  const SELO_POR_GRUPO = { horas: 'maratona-de-foco', questoes: '100-questoes', revisoes: 'revisor-de-ferro', simulados: 'chegada-na-prova', chama: 'sequencia-7' };
  const SELO_ESPECIAL = { 'questoes-50': 'primeira-questao', 'revisoes-100': 'mestre-das-cartas', 'revisoes-250': 'mestre-das-cartas', 'simulados-5': 'gabaritou-materia', 'simulados-10': 'gabaritou-materia', 'simulados-25': 'simulado-perfeito' };
  const seloDaConquista = (id) => SELO_ESPECIAL[id] || SELO_POR_GRUPO[String(id).split('-')[0]] || 'primeira-questao';
  const desbloqueado = (grupo, id, nivel) => { const it = SALAO[grupo].find(x => x[0] === id); return !!it && nivel >= it[2]; };
  function iniciais(nome) { const p = String(nome || '').trim().split(/\s+/).filter(Boolean); if (!p.length) return 'EU'; return ((p[0][0] || '') + (p.length > 1 ? p[p.length - 1][0] : (p[0][1] || ''))).toUpperCase(); }

  // =====================================================================
  // 10. Replanejar metas atrasadas até a prova
  // =====================================================================
  // metas: [{ id, topicoId, dia, minutos, feita }]; minutosPorDia: 7 números (dom..sáb). Devolve novas metas e o que não coube.
  function replanejar({ metas, hoje, provaData, minutosPorDia, minimoBloco = 20 }) {
    const fim = provaData ? somaDias(provaData, -1) : somaDias(hoje, 55);
    const atrasadas = metas.filter(m => !m.feita && m.dia < hoje).sort((a, b) => a.dia.localeCompare(b.dia));
    const futuras = metas.filter(m => m.feita || m.dia >= hoje);
    const usado = {}; futuras.filter(m => !m.feita).forEach(m => usado[m.dia] = (usado[m.dia] || 0) + (m.minutos || 0));
    const novas = []; const naoCabem = []; const moveu = [];
    for (const m of atrasadas) {
      let resta = m.minutos || 0; let primeiro = true;
      for (let d = hoje; d <= fim && resta > 0; d = somaDias(d, 1)) {
        const livre = (minutosPorDia[paraData(d).getDay()] || 0) - (usado[d] || 0); if (livre < minimoBloco) continue;
        const dur = Math.min(resta, livre); usado[d] = (usado[d] || 0) + dur; resta -= dur;
        novas.push(Object.assign({}, m, { id: primeiro ? m.id : m.id + '+' + d, dia: d, minutos: dur, replanejada: true, diaOriginal: m.diaOriginal || m.dia })); primeiro = false; moveu.push({ id: m.id, de: m.dia, para: d, minutos: dur });
      }
      if (resta > 0) naoCabem.push(Object.assign({}, m, { minutos: resta }));
    }
    const minAtrasado = atrasadas.reduce((a, m) => a + (m.minutos || 0), 0); const minNaoCabe = naoCabem.reduce((a, m) => a + m.minutos, 0);
    const diasRestantes = Math.max(0, diasEntre(hoje, fim) + 1);
    const aviso = !atrasadas.length ? 'Nada atrasado. Tudo em dia.' : naoCabem.length ? 'Não cabe tudo: faltam ' + minNaoCabe + ' min (' + naoCabem.length + ' meta' + (naoCabem.length > 1 ? 's' : '') + ') antes da prova. Aumente os minutos por dia, tire folgas ou corte tópicos de menor peso.' : 'Tudo redistribuído até ' + (provaData ? 'a prova' : 'daqui a 8 semanas') + ' (' + minAtrasado + ' min em ' + moveu.length + ' blocos).';
    return { metas: futuras.concat(novas).sort((a, b) => a.dia.localeCompare(b.dia)), atrasadas: atrasadas.length, minAtrasado, moveu, naoCabem, minNaoCabe, diasRestantes, cabe: naoCabem.length === 0, aviso };
  }
  // meta é considerada feita se o tópico foi estudado no dia da meta ou depois
  function aplicarFeitas(metas, topicos) { const mapa = {}; topicos.forEach(t => mapa[t.id] = t); return metas.map(m => m.feita ? m : Object.assign({}, m, { feita: !!(mapa[m.topicoId] && mapa[m.topicoId].ultEstudo && mapa[m.topicoId].ultEstudo >= m.dia) })); }

  return { quebrarItem, refinarEdital, parseEditalVertical, editalParaTexto, montarVertical, verticalParaCSV, CAIXAS, raioX, tipoDeQuestao, dificuldadeDe, diagnosticoRajada, normalizaAvaliacao, letra, consenso, julgarTribunal, rodarTribunal, normalizaCorrecao, contarLinhas, REGRAS, PATENTES, xpParaNivel, nivelDe, agregarDias, chama, calcularGuilda, conquistas, mapaCalor, xpDaSemana, placarSemanal, SALAO, desbloqueado, iniciais, molduraDoNivel, MOLDURAS_NIVEL, seloDaConquista, segunda, replanejar, aplicarFeitas };
});
