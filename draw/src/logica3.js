/* Dora Draw — lógica pura da terceira leva (obra original; só ideias gerais, código 100% próprio):
   1. Revisão espaçada: FSRS (algoritmo público, implementação própria, parâmetros padrão) + modos por concurso (Automático, Do meu jeito, Dias fixos)
   2. Anki: exportar/importar cartões em texto TSV (frente<TAB>verso<TAB>tags)
   3. Estudo reverso: depois de errar, "o que rever" (tópico, grifos, notas, PDF, marcações e Dora Cartas)
   4. Edital por PDF: limpeza do texto extraído (cabeçalho, rodapé, hifenização) e recorte do conteúdo programático
   5. Mapa mental como teste (revelar nós, "sabia/não sabia")
   6. Mural: Kanban e calendário mensal
   7. Tela Hoje (plano do dia, revisões, cartas vencendo, erros)
   8. Aviso de 5 min antes do fim do foco
   Roda no app e no Node (node --test). Datas: 'AAAA-MM-DD' no fuso local. */
(function (raiz, fab) { const L3 = fab(typeof module === 'object' && module.exports ? require('./logica.js') : raiz.DoraLogica); if (typeof module === 'object' && module.exports) module.exports = L3; else raiz.DoraLogica3 = L3; })(typeof self !== 'undefined' ? self : this, function (L) {
  const { somaDias, diasEntre, diaLocal, paraData } = L;
  const limita = (v, a, b) => Math.min(b, Math.max(a, v));

  // =====================================================================
  // 1. Revisão espaçada
  // =====================================================================
  // --- FSRS (Free Spaced Repetition Scheduler, versão 4.5, fórmulas públicas). Notas: 1 errei, 2 difícil, 3 bom, 4 fácil.
  const FSRS_PESOS = [0.4872, 1.4003, 3.7145, 13.8206, 5.1618, 1.2298, 0.8975, 0.031, 1.6474, 0.1367, 1.0461, 2.1072, 0.0793, 0.3246, 1.587, 0.2272, 2.8755];
  const DECAIMENTO = -0.5, FATOR = 19 / 81;
  const NOTA = { errei: 1, dificil: 2, bom: 3, facil: 4 };
  const QUAL_SM2 = { errei: 1, dificil: 3, bom: 4, facil: 5 }; // mesma escala do SM-2, para manter ultQ/acertos coerentes
  // chance de lembrar depois de t dias, dada a estabilidade s (dias em que a chance cai a 90%)
  const fsrsLembranca = (t, s) => Math.pow(1 + FATOR * Math.max(0, t) / s, DECAIMENTO);
  // intervalo (dias) para a chance de lembrar cair até a retenção desejada
  const fsrsIntervalo = (s, retencao = 0.9) => s / FATOR * (Math.pow(retencao, 1 / DECAIMENTO) - 1);
  const dInicial = (nota, w) => limita(w[4] - (nota - 3) * w[5], 1, 10);
  const fsrsEstadoInicial = (nota, w = FSRS_PESOS) => ({ s: Math.max(0.1, w[nota - 1]), d: dInicial(nota, w) });
  function fsrsProximoEstado(est, nota, dias, w = FSRS_PESOS) {
    const r = fsrsLembranca(dias, est.s);
    let d = est.d - w[6] * (nota - 3); d = limita(w[7] * dInicial(3, w) + (1 - w[7]) * d, 1, 10); // volta devagar para a dificuldade média
    let s;
    if (nota === 1) s = w[11] * Math.pow(est.d, -w[12]) * (Math.pow(est.s + 1, w[13]) - 1) * Math.exp(w[14] * (1 - r));
    else s = est.s * (1 + Math.exp(w[8]) * (11 - est.d) * Math.pow(est.s, -w[9]) * (Math.exp(w[10] * (1 - r)) - 1) * (nota === 2 ? w[15] : 1) * (nota === 4 ? w[16] : 1));
    if (nota === 1) s = Math.min(s, est.s); // errar nunca aumenta a estabilidade
    return { s: Math.max(0.1, s), d };
  }
  // estado de um cartão que veio do SM-2 (aproximação): estabilidade ≈ intervalo atual; dificuldade pelo fator de facilidade
  const estadoDeSM2 = (c) => ({ s: Math.max(0.5, c.int || 1), d: limita(9 - (Math.min(c.ef || 2.5, 2.5) - 1.3) / 1.2 * 5, 1, 10) });
  // aplica o resultado já calculado ao cartão (campos comuns ao SM-2, para as outras telas continuarem funcionando)
  function comResultado(c, resposta, hoje, int, extra) {
    const q = QUAL_SM2[resposta];
    return Object.assign({}, c, extra, { int, prox: somaDias(hoje, int), ult: hoje, ultQ: q, rep: resposta === 'errei' ? 0 : (c.rep || 0) + 1, vistas: (c.vistas || 0) + 1, acertos: (c.acertos || 0) + (q >= 3 ? 1 : 0) });
  }
  function limiteProva(int, hoje, provaData) { if (provaData && provaData > hoje) int = Math.min(int, Math.max(1, diasEntre(hoje, provaData) - 1)); return int; }
  // avalia um cartão pelo FSRS. op: { retencao 0.7–0.97 (padrão 0.9), pesos, max (dias, padrão 365), provaData }
  function fsrs(c, resposta, hoje, op = {}) {
    const nota = NOTA[resposta]; if (!nota) throw new Error('resposta inválida: ' + resposta);
    const w = op.pesos || FSRS_PESOS; const ret = limita(op.retencao || 0.9, 0.7, 0.97);
    let est, reps = 0, lapses = 0, ult;
    if (c.fsrs) { est = c.fsrs; ult = c.fsrs.ult || c.ult || hoje; reps = c.fsrs.reps || 0; lapses = c.fsrs.lapses || 0; }
    else if ((c.vistas || 0) > 0 || c.prox) { est = estadoDeSM2(c); ult = c.ult || hoje; reps = c.vistas || 0; }
    let novo;
    if (!est) novo = fsrsEstadoInicial(nota, w); else novo = fsrsProximoEstado(est, nota, Math.max(0, diasEntre(ult, hoje)), w);
    let int = limiteProva(limita(Math.round(fsrsIntervalo(novo.s, ret)), 1, op.max || 365), hoje, op.provaData);
    if (nota === 1) int = 1; // errou: volta amanhã
    return comResultado(c, resposta, hoje, int, { fsrs: { s: Math.round(novo.s * 1000) / 1000, d: Math.round(novo.d * 1000) / 1000, ult: hoje, reps: reps + 1, lapses: lapses + (nota === 1 ? 1 : 0) } });
  }
  // os 4 intervalos possíveis (dias) para mostrar ao aluno antes de responder
  const intervalosPossiveis = (c, hoje, op = {}) => { const o = {}; ['errei', 'dificil', 'bom', 'facil'].forEach(r => { o[r] = (op.algoritmo === 'fsrs' ? fsrs(c, r, hoje, op) : L.sm2(c, r, hoje)).int; }); return o; };

  // --- modos de revisão de um concurso
  const MODOS = [['auto', 'Automático'], ['meu', 'Do meu jeito'], ['fixos', 'Dias fixos']];
  function configRevisao(conc) {
    const r = (conc && conc.revisao) || {};
    const fixos = Array.isArray(r.fixos) ? [...new Set(r.fixos.map(Number).filter(n => Number.isFinite(n) && n >= 1 && n <= 365).map(Math.round))].sort((a, b) => a - b) : [];
    return { modo: MODOS.some(m => m[0] === r.modo) ? r.modo : 'auto', algoritmo: r.algoritmo === 'fsrs' ? 'fsrs' : 'sm2', fixos: fixos.length ? fixos : L.DIAS_REVISAO_PADRAO.slice(), retencao: limita(+r.retencao || 0.9, 0.7, 0.97) };
  }
  // "Dias fixos": a cada acerto o cartão avança um degrau da lista (padrão 1, 7, 30 dias — a mesma da revisão de tópico concluído); difícil repete o degrau anterior; errar volta ao primeiro
  function diasFixos(c, resposta, hoje, fixos) {
    const lista = fixos && fixos.length ? fixos : L.DIAS_REVISAO_PADRAO; const passo = c.passoFixo || 0; let int, novoPasso;
    if (resposta === 'errei') { int = lista[0]; novoPasso = 0; }
    else if (resposta === 'dificil') { int = lista[Math.min(Math.max(passo - 1, 0), lista.length - 1)]; novoPasso = passo; }
    else { int = lista[Math.min(passo, lista.length - 1)]; novoPasso = passo + 1; }
    return comResultado(c, resposta, hoje, int, { passoFixo: novoPasso });
  }
  // agenda o cartão conforme o modo do concurso. No modo "Do meu jeito" devolve a sugestão do algoritmo; o aluno troca depois com intervaloEscolhido
  function agendarCartao(c, resposta, hoje, conc, provaData) {
    const cfg = configRevisao(conc);
    if (cfg.modo === 'fixos') return limiteCartao(diasFixos(c, resposta, hoje, cfg.fixos), hoje, provaData);
    if (cfg.algoritmo === 'fsrs') return fsrs(c, resposta, hoje, { retencao: cfg.retencao, provaData });
    return limiteCartao(L.sm2(c, resposta, hoje), hoje, provaData);
  }
  const limiteCartao = (c, hoje, provaData) => { const int = limiteProva(c.int, hoje, provaData); return int === c.int ? c : Object.assign({}, c, { int, prox: somaDias(hoje, int) }); };
  // o aluno escolheu o próximo intervalo (em dias)
  function intervaloEscolhido(c, dias, hoje) { const int = limita(Math.round(+dias) || 1, 1, 365); return Object.assign({}, c, { int, prox: somaDias(hoje, int), escolhaManual: true }); }
  // opções do botão "Quando rever?" no modo "Do meu jeito": a sugestão do algoritmo + degraus comuns, sem repetir
  function opcoesDoMeuJeito(sugerido) { const base = [1, 3, 7, 15, 30, 60]; const v = [...new Set(base.concat([sugerido]))].sort((a, b) => a - b); return v.map(d => ({ dias: d, sugerido: d === sugerido })); }

  // =====================================================================
  // 2. Anki: TSV (texto com tabulação). Não é .apkg (esse é um pacote SQLite+mídia compactado; o texto é o que o Anki importa em "Arquivo > Importar").
  // =====================================================================
  const escHtml = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const campoTSV = (s) => { const t = escHtml(s).replace(/\r\n?|\n/g, '<br>'); return /[\t"]/.test(t) ? '"' + t.replace(/"/g, '""') + '"' : t; };
  const tagAnki = (s) => String(s || '').trim().replace(/\s+/g, '_').replace(/::+/g, '::').replace(/[,;"]/g, '');
  const textoDoCartao = (c) => {
    if (c.tipo === 'questao') {
      const alts = (c.alternativas || []).map(a => a.letra + ') ' + a.texto).join('\n');
      return { frente: (c.enunciado || '') + (alts ? '\n\n' + alts : ''), verso: [c.gabarito ? 'Gabarito: ' + c.gabarito : '', c.explicacao || '', c.pegadinha ? 'Pegadinha: ' + c.pegadinha : ''].filter(Boolean).join('\n') };
    }
    return { frente: c.frente || '', verso: c.verso || '' };
  };
  // cartoes: array de cartões do app; ctx: { topicos, disciplinas } para montar a etiqueta "Disciplina::Tópico"
  function cartoesParaTSV(cartoes, ctx = {}) {
    const top = {}; (ctx.topicos || []).forEach(t => top[t.id] = t); const disc = {}; (ctx.disciplinas || []).forEach(d => disc[d.id] = d);
    const linhas = ['#separator:tab', '#html:true', '#tags column:3'];
    cartoes.forEach(c => {
      const { frente, verso } = textoDoCartao(c); if (!frente.trim() && !verso.trim()) return;
      const t = top[c.topicoId]; const tags = []; if (t) tags.push(tagAnki((disc[t.disciplinaId] ? disc[t.disciplinaId].nome + '::' : '') + t.titulo)); if (c.tipo === 'questao') tags.push('dora_carta');
      linhas.push([campoTSV(frente), campoTSV(verso), tags.join(' ')].join('\t'));
    });
    return linhas.join('\n') + '\n';
  }
  // lê linhas de uma tabela com separador e aspas (aceita campo com quebra de linha dentro de aspas)
  function lerTabela(texto, sep) {
    const out = []; let linha = []; let campo = ''; let aspas = false; const s = String(texto).replace(/^﻿/, '');
    for (let i = 0; i < s.length; i++) {
      const ch = s[i];
      if (aspas) { if (ch === '"') { if (s[i + 1] === '"') { campo += '"'; i++; } else aspas = false; } else campo += ch; }
      else if (ch === '"' && campo === '') aspas = true;
      else if (ch === sep) { linha.push(campo); campo = ''; }
      else if (ch === '\n' || ch === '\r') { if (ch === '\r' && s[i + 1] === '\n') i++; linha.push(campo); out.push(linha); linha = []; campo = ''; }
      else campo += ch;
    }
    if (campo !== '' || linha.length) { linha.push(campo); out.push(linha); }
    return out;
  }
  const SEPS = { tab: '\t', comma: ',', semicolon: ';', pipe: '|', space: ' ', colon: ':' };
  const htmlParaTexto = (s) => String(s).replace(/<\s*br\s*\/?>/gi, '\n').replace(/<\/(div|p|li|tr)>/gi, '\n').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&amp;/g, '&').replace(/\n{3,}/g, '\n\n').trim();
  const temHtml = (s) => /<\/?(br|div|b|i|u|span|p|font|img|ul|li|table|tr|td)[\s\/>]/i.test(s) || /&(nbsp|lt|gt|amp|quot);/.test(s);
  // cartão de lacuna do Anki: {{c1::resposta::dica}} -> frente com [...] e verso com a resposta
  function lacunas(texto) {
    if (!/\{\{c\d+::/.test(texto)) return null;
    const frente = texto.replace(/\{\{c\d+::(.*?)(::(.*?))?\}\}/gs, (m, r, x, dica) => '[' + (dica ? dica : '...') + ']');
    const verso = texto.replace(/\{\{c\d+::(.*?)(::.*?)?\}\}/gs, (m, r) => r);
    return { frente, verso };
  }
  // devolve { cartoes:[{frente,verso,tags:[]}], ignoradas, separador }
  function tsvParaCartoes(texto) {
    const bruto = String(texto || '').replace(/^﻿/, ''); const cab = {}; const todas = bruto.split(/\r\n?|\n/); let k = 0;
    while (k < todas.length && /^#/.test(todas[k])) { const m = todas[k].match(/^#\s*([a-z ]+?)\s*:\s*(.*)$/i); if (m) cab[m[1].toLowerCase()] = m[2].trim(); k++; }
    const corpo = todas.slice(k);
    let sep = SEPS[cab.separator] || null; const textoCorpo = corpo.join('\n');
    if (!sep) sep = /\t/.test(textoCorpo) ? '\t' : /;/.test(textoCorpo) ? ';' : /,/.test(textoCorpo) ? ',' : '\t';
    const html = cab.html != null ? /^true$/i.test(cab.html) : temHtml(textoCorpo);
    const meta = new Set(); let colTags = null;
    Object.keys(cab).forEach(k => { const m = k.match(/^(.*) column$/); const n = parseInt(cab[k], 10); if (m && n > 0) { if (m[1] === 'tags') colTags = n - 1; else meta.add(n - 1); } });
    if (colTags != null) meta.add(colTags);
    const cartoes = []; let ignoradas = 0;
    lerTabela(textoCorpo, sep).forEach(cols => {
      if (cols.length === 1 && !cols[0].trim()) return; // linha em branco
      const campos = cols.filter((_, i) => !meta.has(i)); const tags = colTags != null ? (cols[colTags] || '') : (campos[2] || '');
      const conv = (x) => html ? htmlParaTexto(x || '') : String(x || '').trim();
      let frente = conv(campos[0]), verso = conv(campos[1]); const lac = lacunas(frente); if (lac) { frente = lac.frente; verso = (lac.verso + (verso ? '\n\n' + verso : '')).trim(); }
      if (!frente) { ignoradas++; return; }
      cartoes.push({ frente, verso, tags: String(tags || '').split(/\s+/).filter(Boolean) });
    });
    return { cartoes, ignoradas, separador: Object.keys(SEPS).find(k => SEPS[k] === sep) || sep };
  }
  // liga etiquetas "Disciplina::Tópico" (ou só "Tópico") aos tópicos do concurso; devolve o id ou null
  function topicoDaTag(tags, topicos, disciplinas) {
    const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[_\s]+/g, ' ').trim();
    for (const tag of tags || []) {
      const partes = String(tag).split('::'); const nomeT = norm(partes[partes.length - 1]); const nomeD = partes.length > 1 ? norm(partes[partes.length - 2]) : null;
      const achou = (topicos || []).find(t => norm(t.titulo) === nomeT && (!nomeD || !disciplinas || norm((disciplinas.find(d => d.id === t.disciplinaId) || {}).nome) === nomeD));
      if (achou) return achou.id;
    }
    return null;
  }
  const chaveCartao = (frente) => String(frente || '').toLowerCase().replace(/\s+/g, ' ').trim();

  // =====================================================================
  // 3. Estudo reverso: o que rever depois de errar
  // =====================================================================
  const textoSimples = (html) => htmlParaTexto(String(html || '').replace(/<(script|style)[\s\S]*?<\/\1>/gi, ''));
  // conta erros por tópico a partir de entradas do diário (erros) ou de uma lista de ids de tópico
  function topicosErrados(fonte, { so = null } = {}) {
    const c = {}; (fonte || []).forEach(x => { const id = typeof x === 'string' ? x : x && x.topicoId; if (!id) return; if (so && !so.has(id)) return; c[id] = (c[id] || 0) + 1; });
    return Object.keys(c).map(id => ({ topicoId: id, erros: c[id] })).sort((a, b) => b.erros - a.erros);
  }
  // para cada tópico errado, junta o que há ligado a ele
  function estudoReverso({ errados, topicos = [], disciplinas = [], grifos = [], materiais = [], cartoes = [], marcacoes = [], erros = [], hoje = diaLocal() }) {
    const T = {}; topicos.forEach(t => T[t.id] = t); const D = {}; disciplinas.forEach(d => D[d.id] = d); const M = {}; materiais.forEach(m => M[m.id] = m);
    return (errados || []).filter(e => T[e.topicoId]).map(e => {
      const t = T[e.topicoId]; const gr = grifos.filter(g => g.topicoId === t.id); const ms = materiais.filter(m => m.topicoId === t.id);
      const ca = cartoes.filter(c => c.topicoId === t.id); const mk = marcacoes.filter(m => m.topicoId === t.id);
      const nota = textoSimples(t.notaHtml); const matIds = new Set(ms.map(m => m.id)); gr.forEach(g => { if (M[g.materialId]) matIds.add(g.materialId); });
      const out = {
        topicoId: t.id, titulo: t.titulo, disciplina: (D[t.disciplinaId] || {}).nome || '', erros: e.erros,
        resumos: erros.filter(x => x.topicoId === t.id && !x.resolvido).slice(0, 3).map(x => x.resumo).filter(Boolean),
        nota: nota ? nota.slice(0, 240) : '', temMapa: !!(t.mapa && t.mapa.nos && t.mapa.nos.length > 1), temQuadro: !!(t.quadro && t.quadro.e && t.quadro.e.length), comoBanca: t.comoBanca ? String(t.comoBanca).slice(0, 200) : '',
        grifos: gr.slice(0, 6).map(g => ({ id: g.id, texto: String(g.texto || '').slice(0, 160), nota: g.nota || '', pagina: g.pagina, materialId: g.materialId, material: (M[g.materialId] || {}).nome || '' })), totalGrifos: gr.length,
        materiais: [...matIds].map(id => M[id]).filter(Boolean).map(m => ({ id: m.id, nome: m.nome, paginas: m.paginas })),
        marcacoes: mk.slice(0, 5).map(m => ({ id: m.id, url: m.url, texto: String(m.texto || '').slice(0, 160), nota: m.nota || '' })),
        cartas: ca.filter(c => c.tipo === 'questao').slice(0, 6).map(c => ({ id: c.id, tipo: c.tipo, texto: String(c.enunciado || '').slice(0, 140) })).concat(ca.filter(c => c.tipo !== 'questao').slice(0, 4).map(c => ({ id: c.id, tipo: c.tipo || 'basico', texto: String(c.frente || '').slice(0, 140) }))),
        totalCartas: ca.length, cartasVencidas: ca.filter(c => !c.prox || c.prox <= hoje).length
      };
      out.semMaterial = !out.nota && !out.grifos.length && !out.materiais.length && !out.marcacoes.length && !out.temMapa && !out.temQuadro && !out.cartas.length;
      return out;
    });
  }

  // =====================================================================
  // 4. Edital por PDF
  // =====================================================================
  // junta os itens de texto de UMA página do pdf.js em linhas (usa a posição vertical quando hasEOL não existe)
  function juntarItensPdf(itens) {
    const linhas = []; let atual = ''; let yAtual = null;
    (itens || []).forEach(it => {
      const s = it.str == null ? '' : String(it.str); const y = it.transform ? it.transform[5] : null;
      if (yAtual != null && y != null && Math.abs(y - yAtual) > 3 && atual.trim()) { linhas.push(atual.trim()); atual = ''; }
      if (y != null) yAtual = y;
      atual += s; if (s && !/\s$/.test(s) && !it.hasEOL) atual += ' ';
      if (it.hasEOL) { if (atual.trim()) linhas.push(atual.trim()); atual = ''; yAtual = null; }
    });
    if (atual.trim()) linhas.push(atual.trim());
    return linhas.map(l => l.replace(/\s{2,}/g, ' ')).join('\n');
  }
  const ehNumeroDePagina = (l) => /^(p[áa]g(ina)?\.?\s*)?\d{1,4}(\s*(\/|de)\s*\d{1,4})?$/i.test(l) || /^[-–—]\s*\d{1,4}\s*[-–—]$/.test(l);
  const ehInicioDeItem = (l) => /^(\d+(\.\d+)*[.)]?|[a-z][.)]|[•\-–])\s+\S/i.test(l) && !/^\d{1,2}\s*(de|\/)\s*\w+/i.test(l);
  // paginas: array de textos (um por página). Tira número de página, cabeçalho/rodapé repetidos, junta palavras quebradas e linhas cortadas.
  function limparTextoPdf(paginas) {
    const pgs = (paginas || []).map(p => String(p || '').split(/\r\n?|\n/).map(l => l.replace(/\s+/g, ' ').trim()));
    const cont = {}; pgs.forEach(ls => new Set(ls.filter(l => l && l.length < 90 && !ehNumeroDePagina(l))).forEach(l => { const k = l.replace(/\d+/g, '#').toLowerCase(); cont[k] = (cont[k] || 0) + 1; }));
    const minimo = Math.max(3, Math.ceil(pgs.length * 0.4)); const repetida = (l) => pgs.length >= 3 && (cont[l.replace(/\d+/g, '#').toLowerCase()] || 0) >= minimo && !ehInicioDeItem(l);
    const todas = []; pgs.forEach(ls => { ls.forEach(l => { if (!l) { todas.push(''); return; } if (ehNumeroDePagina(l) || repetida(l)) return; todas.push(l); }); todas.push(''); });
    const saida = [];
    for (let i = 0; i < todas.length; i++) {
      let l = todas[i];
      if (!l) { if (saida.length && saida[saida.length - 1] !== '') saida.push(''); continue; }
      // palavra quebrada com hífen no fim da linha
      while (/[a-zà-ú]-$/i.test(l) && todas[i + 1] && /^[a-zà-ú]/.test(todas[i + 1])) { l = l.slice(0, -1) + todas[i + 1]; i++; }
      // linha cortada no meio da frase: a próxima começa em minúscula e não é item
      while (!/[.;:!?]$/.test(l) && todas[i + 1] && /^[a-zà-ú(]/.test(todas[i + 1]) && !ehInicioDeItem(todas[i + 1])) { l = l + ' ' + todas[i + 1]; i++; }
      saida.push(l);
    }
    while (saida.length && saida[saida.length - 1] === '') saida.pop();
    return saida.join('\n');
  }
  const LINHA_DE_TOPICO = /^\s*\d+(\.\d+)*[.)]?\s+\S/;
  // acha o trecho do conteúdo programático dentro do edital inteiro (o que tem mais cara de lista de tópicos)
  function recortarConteudoProgramatico(texto) {
    const t = String(texto || ''); const re = /^(?:[^\n]{0,30}[-–—:]\s*)?(conte[uú]do\s+program[aá]tico|programa\s+das\s+provas|conhecimentos\s+(b[aá]sicos|gerais|espec[ií]ficos))[^\n]{0,25}$/gim; let m; let melhor = null;
    while ((m = re.exec(t))) { const trecho = t.slice(m.index, m.index + 1500); const pontos = trecho.split('\n').filter(l => LINHA_DE_TOPICO.test(l)).length + (trecho.match(/;/g) || []).length * 0.3; if (!melhor || pontos >= melhor.pontos) melhor = { ini: m.index, pontos }; }
    if (!melhor || melhor.pontos < 3) return { texto: t, recortado: false };
    let fim = t.length; const reFim = /\n\s*(anexo\s+[ivx\d]+\b|das\s+atribui[cç][oõ]es|dos\s+recursos|das\s+disposi[cç][oõ]es\s+finais)[^\n]*/gi; reFim.lastIndex = melhor.ini + 10; const f = reFim.exec(t); if (f) fim = f.index;
    return { texto: t.slice(melhor.ini, fim).trim(), recortado: true };
  }
  function prepararEditalDePdf(paginas) {
    const limpo = limparTextoPdf(paginas); const r = recortarConteudoProgramatico(limpo);
    return { texto: r.texto, recortado: r.recortado, paginas: (paginas || []).length, linhas: r.texto ? r.texto.split('\n').filter(Boolean).length : 0 };
  }

  // =====================================================================
  // 5. Mapa mental como teste
  // =====================================================================
  // estado: { rev: {id:true}, marca: {id:'sabia'|'nao'} }. A raiz já nasce revelada; os filhos de um nó revelado aparecem mascarados ("?") até o clique.
  const testeNovo = (nos) => { const raizes = (nos || []).filter(n => n.pai == null); const rev = {}; raizes.forEach(r => rev[r.id] = true); return { rev, marca: {} }; };
  function testeVisiveis(nos, est) {
    const por = {}; nos.forEach(n => por[n.id] = n); const out = {};
    nos.forEach(n => { if (n.pai == null) out[n.id] = 'revelado'; else if (est.rev[n.pai] && por[n.pai]) out[n.id] = est.rev[n.id] ? 'revelado' : 'mascarado'; });
    return out; // nó fora do objeto = escondido
  }
  const testeRevelar = (est, id) => ({ rev: Object.assign({}, est.rev, { [id]: true }), marca: est.marca });
  const testeMarcar = (est, id, valor) => ({ rev: est.rev, marca: Object.assign({}, est.marca, { [id]: valor === 'sabia' ? 'sabia' : 'nao' }) });
  function testeResumo(nos, est) {
    const alvos = nos.filter(n => n.pai != null); const marcados = alvos.filter(n => est.marca[n.id]); const sabia = marcados.filter(n => est.marca[n.id] === 'sabia').length;
    return { total: alvos.length, revelados: alvos.filter(n => est.rev[n.id]).length, marcados: marcados.length, sabia, naoSabia: marcados.length - sabia, pct: marcados.length ? Math.round(100 * sabia / marcados.length) : null, completo: alvos.length > 0 && marcados.length === alvos.length, revisar: marcados.filter(n => est.marca[n.id] === 'nao').map(n => n.t) };
  }

  // =====================================================================
  // 6. Mural: Kanban e calendário
  // =====================================================================
  const COLUNAS = [['fazer', 'A fazer'], ['fazendo', 'Fazendo'], ['feito', 'Feito']];
  const colunaDe = (n) => COLUNAS.some(c => c[0] === n.coluna) ? n.coluna : 'fazer';
  function kanbanColunas(notas) {
    const out = { fazer: [], fazendo: [], feito: [] }; (notas || []).forEach(n => out[colunaDe(n)].push(n));
    Object.keys(out).forEach(k => out[k].sort((a, b) => (a.ordem != null ? a.ordem : 1e15) - (b.ordem != null ? b.ordem : 1e15) || (a.criado || 0) - (b.criado || 0)));
    return out;
  }
  // move a nota para a coluna, na posição `pos` (0 = topo). Devolve as notas que mudaram (para gravar).
  function kanbanMover(notas, id, coluna, pos) {
    if (!COLUNAS.some(c => c[0] === coluna)) throw new Error('coluna inválida: ' + coluna);
    const cols = kanbanColunas(notas); const n = (notas || []).find(x => x.id === id); if (!n) return [];
    const antes = colunaDe(n); Object.keys(cols).forEach(k => { cols[k] = cols[k].filter(x => x.id !== id); });
    const alvo = cols[coluna]; const i = pos == null ? alvo.length : limita(pos, 0, alvo.length); alvo.splice(i, 0, n); n.coluna = coluna;
    const mudou = new Set(); if (antes !== coluna) mudou.add(n);
    alvo.forEach((x, k) => { if (x.ordem !== k) { x.ordem = k; mudou.add(x); } });
    return [...mudou];
  }
  const diaDaNota = (n) => n.data || (n.criado ? diaLocal(n.criado) : null);
  // grade do mês: semanas (dom a sáb) com { dia, doMes, hoje, notas }
  function calendarioMes(notas, ano, mes, hoje) {
    const pad = (x) => String(x).padStart(2, '0'); const primeiro = ano + '-' + pad(mes) + '-01'; const dow = paraData(primeiro).getDay(); const ini = somaDias(primeiro, -dow);
    const por = {}; (notas || []).forEach(n => { const d = diaDaNota(n); if (d) (por[d] = por[d] || []).push(n); });
    const semanas = []; for (let s = 0; s < 6; s++) { const sem = []; for (let d = 0; d < 7; d++) { const dia = somaDias(ini, s * 7 + d); sem.push({ dia, n: +dia.slice(8), doMes: +dia.slice(5, 7) === mes, hoje: dia === hoje, notas: por[dia] || [] }); } if (s >= 4 && !sem.some(x => x.doMes)) break; semanas.push(sem); }
    return semanas;
  }
  const mesVizinho = (ano, mes, delta) => { const t = ano * 12 + (mes - 1) + delta; return { ano: Math.floor(t / 12), mes: (t % 12) + 1 }; };
  const NOMES_MES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

  // =====================================================================
  // 7. Hoje
  // =====================================================================
  // plano: { blocos:[{topicoId,minutos}] } do dia (L.planoSemanal().dias[0]); revisoes: [{topicoId,data}]; cartoes; erros (entradas do diário)
  function montarHoje({ hoje, plano = null, revisoes = [], cartoes = [], erros = [], topicos = [], janelaCartas = 2 }) {
    const T = {}; topicos.forEach(t => T[t.id] = t); const nome = (id) => (T[id] || {}).titulo || '(sem tópico)';
    const blocos = ((plano && plano.blocos) || []).filter(b => T[b.topicoId]).map(b => ({ topicoId: b.topicoId, titulo: nome(b.topicoId), minutos: b.minutos }));
    const rev = revisoes.filter(r => r.data <= hoje && T[r.topicoId]).map(r => ({ topicoId: r.topicoId, titulo: nome(r.topicoId), data: r.data, atrasada: r.data < hoje, dias: diasEntre(r.data, hoje) })).sort((a, b) => a.data.localeCompare(b.data));
    const limite = somaDias(hoje, janelaCartas); const vencidas = cartoes.filter(c => !c.prox || c.prox <= hoje); const vencendo = cartoes.filter(c => c.prox && c.prox > hoje && c.prox <= limite);
    const porTopico = {}; vencidas.forEach(c => { const k = c.topicoId || '-'; porTopico[k] = (porTopico[k] || 0) + 1; });
    const cartasPorTopico = Object.keys(porTopico).map(k => ({ topicoId: k === '-' ? null : k, titulo: k === '-' ? '(sem tópico)' : nome(k), n: porTopico[k] })).sort((a, b) => b.n - a.n).slice(0, 5);
    const ativos = erros.filter(e => !e.resolvido && (!e.proxCheque || e.proxCheque <= hoje)); const g = {}; ativos.forEach(e => { const k = e.topicoId || '-'; (g[k] = g[k] || []).push(e); });
    const errosRever = Object.keys(g).map(k => ({ topicoId: k === '-' ? null : k, titulo: k === '-' ? '(sem tópico)' : nome(k), qtd: g[k].length, resumo: (g[k][0] || {}).resumo || '' })).sort((a, b) => b.qtd - a.qtd).slice(0, 5);
    const minutos = blocos.reduce((a, b) => a + (b.minutos || 0), 0);
    return { hoje, blocos, minutosPlano: minutos, revisoes: rev, cartas: { vencidas: vencidas.length, vencendo: vencendo.length, porTopico: cartasPorTopico }, erros: { total: ativos.length, topicos: errosRever }, vazio: !blocos.length && !rev.length && !vencidas.length && !vencendo.length && !ativos.length };
  }

  // =====================================================================
  // 8. Dora Foco: aviso antes do fim
  // =====================================================================
  // true quando falta 5 min (ou menos) e ainda não avisou. Só vale para foco com pelo menos 10 min (senão o aviso cairia logo no começo).
  function avisoFimFoco({ durMs, decorridoMs, jaAvisou = false, minAviso = 5 }) {
    if (jaAvisou || !durMs || durMs < (minAviso + 5) * 60000) return false;
    const resta = durMs - decorridoMs; return resta > 0 && resta <= minAviso * 60000;
  }

  // =====================================================================
  // 9. Parte 3 (só lógica pura): relevância pela estatística de cobrança, fases do estudo reverso, lacunas e Markdown das marcações
  // =====================================================================
  // relevância 1–5 proporcional à quantidade de questões (o maior vale 5; quem tem questão nunca fica abaixo de 1)
  function relevanciaPorQuantidade(qtds) {
    const max = Math.max(0, ...qtds.map(q => +q || 0)); return qtds.map(q => { q = +q || 0; return max <= 0 || q <= 0 ? 1 : limita(Math.ceil(5 * q / max), 1, 5); });
  }
  // "Assunto ..... 1234", "Assunto 1.234", "Assunto (1234)": devolve [{nome, qtd}]
  function parseIndiceQuestoes(texto) {
    const out = []; String(texto || '').split(/\r\n?|\n/).forEach(l => {
      const m = l.trim().match(/^(.*?\S)[\s.·…_\-–]*\(?\s*(\d{1,3}(?:[.\s]\d{3})+|\d+)\s*\)?\s*$/); if (!m) return;
      const nome = m[1].replace(/[\s.·…_\-–]+$/, '').trim(); if (!nome || /^\d+$/.test(nome)) return; out.push({ nome, qtd: parseInt(m[2].replace(/[.\s]/g, ''), 10) });
    }); return out;
  }
  // formato "1 Disciplina / 1.1 Tópico [5] / 1.1.1 Subtópico [3]": nível pelo número de partes (até 3 abaixo da disciplina); relevância entre colchetes
  function parseEditalRelevancia(texto) {
    const out = []; let atual = null;
    String(texto || '').split(/\r\n?|\n/).forEach(l => {
      const m = l.trim().match(/^(\d+(?:\.\d+)*)[.)]?\s+(.+?)\s*(?:\[\s*([1-5])\s*\])?\s*$/); if (!m) return; const partes = m[1].split('.').length; const titulo = m[2].trim(); if (!titulo) return;
      if (partes === 1) { atual = { nome: titulo, topicos: [] }; out.push(atual); return; }
      if (!atual) { atual = { nome: 'Geral', topicos: [] }; out.push(atual); }
      atual.topicos.push({ titulo, nivel: Math.min(3, partes - 1), num: m[1], relevancia: m[3] ? +m[3] : null });
    }); return out;
  }
  const FASES = [['novo', 'Novo'], ['descoberta', 'Descoberta'], ['consolidacao', 'Consolidação'], ['dominado', 'Dominado'], ['confirmado', 'Confirmado']];
  // fase de um tópico pela taxa de acerto e pelo volume de questões; resps: [{correta, ts}] do tópico
  function faseTopico(resps) {
    const r = (resps || []).slice().sort((a, b) => (a.ts || 0) - (b.ts || 0)); const n = r.length; if (!n) return 'novo'; if (n < 10) return 'descoberta';
    const taxa = r.filter(x => x.correta).length / n; const ult = r.slice(-10); const taxaUlt = ult.filter(x => x.correta).length / ult.length;
    if (n >= 40 && taxa >= 0.85 && taxaUlt >= 0.85) return 'confirmado'; if (n >= 20 && taxa >= 0.85) return 'dominado'; return taxa >= 0.6 ? 'consolidacao' : 'descoberta';
  }
  // trilha do dia: lotes por tópico (consolidação, descoberta, novos; dominados só no "voltar a ver") até completar a cota de questões
  function trilhaDoDia({ topicos, respostas = [], hoje, cota = 30, periodoRever = 21 }) {
    const por = {}; respostas.forEach(x => { if (x.topicoId) (por[x.topicoId] = por[x.topicoId] || []).push(x); });
    const ordemFase = { consolidacao: 0, descoberta: 1, novo: 2 }; const itens = topicos.map(t => { const rs = por[t.id] || []; const fase = faseTopico(rs); const acertos = rs.filter(x => x.correta).length; const ultimo = rs.reduce((a, x) => Math.max(a, x.ts || 0), 0); return { topicoId: t.id, titulo: t.titulo, fase, relevancia: t.relevancia || 3, taxa: rs.length ? acertos / rs.length : null, feitas: rs.length, ultimo: ultimo ? diaLocal(ultimo) : null }; });
    const fila = itens.filter(i => i.fase in ordemFase).sort((a, b) => ordemFase[a.fase] - ordemFase[b.fase] || b.relevancia - a.relevancia || (a.taxa == null ? 1 : a.taxa) - (b.taxa == null ? 1 : b.taxa));
    const rever = itens.filter(i => (i.fase === 'dominado' || i.fase === 'confirmado') && i.ultimo && diasEntre(i.ultimo, hoje) >= periodoRever).map(i => Object.assign({ voltarAVer: true }, i));
    const lotes = []; let resta = cota; fila.concat(rever).forEach(i => { if (resta <= 0) return; const tam = Math.min(resta, i.voltarAVer ? 3 : i.fase === 'novo' ? 5 : 10); lotes.push({ topicoId: i.topicoId, titulo: i.titulo, fase: i.fase, questoes: tam, voltarAVer: !!i.voltarAVer }); resta -= tam; });
    return { lotes, cota, total: cota - resta };
  }
  // evolução: taxa de acerto da janela atual contra a anterior, por tópico (o que subiu ou caiu)
  function evolucaoTopicos({ respostas, hoje, janela = 14, minimo = 3 }) {
    const ini = somaDias(hoje, -(janela - 1)), iniAnt = somaDias(hoje, -(2 * janela - 1)); const a = {}, b = {};
    respostas.forEach(x => { if (!x.topicoId || !x.dia) return; const alvo = x.dia >= ini && x.dia <= hoje ? a : x.dia >= iniAnt && x.dia < ini ? b : null; if (alvo) { const o = alvo[x.topicoId] = alvo[x.topicoId] || { n: 0, ok: 0 }; o.n++; if (x.correta) o.ok++; } });
    return Object.keys(a).filter(id => a[id].n >= minimo && b[id] && b[id].n >= minimo).map(id => { const atual = Math.round(100 * a[id].ok / a[id].n), antes = Math.round(100 * b[id].ok / b[id].n); return { topicoId: id, atual, antes, delta: atual - antes }; }).sort((x, y) => y.delta - x.delta);
  }
  // omissão de palavras: {{c1::resposta::dica}}. Um cartão por número cN: só o cN fica escondido.
  function lacunasCartoes(texto) {
    const t = String(texto || ''); const re = /\{\{c(\d+)::(.*?)(?:::(.*?))?\}\}/gs; const nums = [...new Set([...t.matchAll(re)].map(m => +m[1]))].sort((a, b) => a - b);
    return nums.map(n => ({ n, frente: t.replace(re, (m, k, r, d) => +k === n ? '[' + (d || '...') + ']' : r), verso: t.replace(re, (m, k, r) => r) }));
  }
  // marcações de texto: 6 cores com significado editável; exporta em Markdown agrupado por significado (trechos ocultos não saem)
  const CORES_MARCACAO = ['Regra', 'Exceção', 'Prazo', 'Conceito', 'Pegadinha', 'Revisar'];
  function marcacoesParaMarkdown(marcacoes, { significados = CORES_MARCACAO, titulo = 'Minhas marcações' } = {}) {
    const nome = (c) => (significados && significados[c]) || CORES_MARCACAO[c] || 'Cor ' + (c + 1); const grupos = {};
    (marcacoes || []).filter(m => !m.oculto && m.texto).forEach(m => { const c = Number.isInteger(m.cor) ? m.cor : 0; (grupos[c] = grupos[c] || []).push(m); });
    const linhas = ['# ' + titulo, '']; Object.keys(grupos).map(Number).sort((a, b) => a - b).forEach(c => {
      linhas.push('## ' + nome(c), '');
      grupos[c].sort((a, b) => (b.favorito ? 1 : 0) - (a.favorito ? 1 : 0)).forEach(m => { let t = String(m.texto).replace(/\s+/g, ' ').trim(); if (m.sublinhado) t = '<u>' + t + '</u>'; if (m.negrito) t = '**' + t + '**'; const tags = (m.tags || []).map(x => '#' + String(x).replace(/\s+/g, '_')).join(' '); linhas.push('- ' + (m.favorito ? '⭐ ' : '') + t + (m.nota ? ' — ' + String(m.nota).replace(/\s+/g, ' ') : '') + (m.url ? ' ([fonte](' + m.url + '))' : '') + (tags ? ' ' + tags : '')); });
      linhas.push('');
    });
    if (linhas.length === 2) linhas.push('_Nenhuma marcação._', ''); return linhas.join('\n');
  }

  return { relevanciaPorQuantidade, parseIndiceQuestoes, parseEditalRelevancia, FASES, faseTopico, trilhaDoDia, evolucaoTopicos, lacunasCartoes, CORES_MARCACAO, marcacoesParaMarkdown, FSRS_PESOS, fsrsLembranca, fsrsIntervalo, fsrsEstadoInicial, fsrsProximoEstado, fsrs, intervalosPossiveis, MODOS, configRevisao, diasFixos, agendarCartao, intervaloEscolhido, opcoesDoMeuJeito,
    cartoesParaTSV, tsvParaCartoes, topicoDaTag, chaveCartao, lerTabela, htmlParaTexto, topicosErrados, estudoReverso,
    juntarItensPdf, limparTextoPdf, recortarConteudoProgramatico, prepararEditalDePdf,
    testeNovo, testeVisiveis, testeRevelar, testeMarcar, testeResumo, COLUNAS, colunaDe, kanbanColunas, kanbanMover, diaDaNota, calendarioMes, mesVizinho, NOMES_MES, montarHoje, avisoFimFoco };
});
