/* Dora Draw — lógica pura da quarta leva (obra original; só ideias gerais de métodos de estudo, código 100% próprio).
   Serve às telas de v-quarta.js e é testada em testes\logica4.test.js. Roda no app, no painel da extensão e no Node.
   1. Relevância do edital (prompt, leitura da resposta, casamento com o índice de questões, aplicação nos tópicos)
   2. Dora Vertical (filtro e ordem por relevância), caderno de questões e fase do tópico
   3. Registrar estudo (domínio 0–5, questões, como estudou, esqueci o timer)
   4. Cartas: lote com tags, omissão, oclusão de imagem, simulado de cartas, retenção, timer da sessão
   5. Ciclo: horas por dia da semana, nível por disciplina, modo por questões, plano do dia sem acumular atraso
   6. Marcações: filtro, tags, exportação em Markdown
   7. Concursos como objetivos, menu escondido, resumo da semana, resumo de superfície
   Datas: 'AAAA-MM-DD' no fuso local. */
(function (raiz, fab) {
  const ehNode = typeof module === 'object' && module.exports;
  const L = ehNode ? require('./logica.js') : raiz.DoraLogica; const L3 = ehNode ? require('./logica3.js') : raiz.DoraLogica3;
  const L4 = fab(L, L3); if (ehNode) module.exports = L4; else raiz.DoraLogica4 = L4;
})(typeof self !== 'undefined' ? self : this, function (L, L3) {
  const { somaDias, diasEntre, diaLocal, paraData } = L;
  const limita = (v, a, b) => Math.min(b, Math.max(a, v));
  const semAcento = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
  const PARADAS = new Set(['de', 'da', 'do', 'das', 'dos', 'e', 'em', 'a', 'o', 'as', 'os', 'para', 'com', 'na', 'no', 'nas', 'nos', 'um', 'uma', 'ao', 'aos', 'por', 'que']);
  const palavras = (s) => semAcento(s).split(' ').filter(w => w && !PARADAS.has(w));
  // 0 a 1: o quanto dois títulos se parecem (palavras em comum; um dentro do outro vale muito)
  function parecido(a, b) {
    const na = semAcento(a), nb = semAcento(b); if (!na || !nb) return 0; if (na === nb) return 1; if (na.length > 4 && nb.length > 4 && (na.includes(nb) || nb.includes(na))) return 0.9;
    const A = new Set(palavras(a)), B = new Set(palavras(b)); if (!A.size || !B.size) return 0; let i = 0; A.forEach(x => { if (B.has(x)) i++; }); return i / (A.size + B.size - i);
  }

  // =====================================================================
  // 1. Relevância do edital
  // =====================================================================
  // texto do edital -> pedido para a IA (serve também para colar em qualquer chat)
  function promptCruzamento(edital, indice) {
    return 'Você ajuda um candidato a concurso. Abaixo há (A) o conteúdo programático do edital e (B) o índice de uma plataforma de questões, com a quantidade de questões por assunto.\n\n' +
      'TAREFA: devolva o edital organizado, uma linha por item, e ao fim de cada TÓPICO ponha a relevância de 1 a 5 entre colchetes, proporcional à quantidade de questões do assunto que corresponde a ele no índice (o assunto com mais questões vale 5; assunto sem questão no índice vale 1).\n' +
      'FORMATO EXATO (sem texto antes ou depois, sem markdown, sem inventar tópicos):\n1 NOME DA DISCIPLINA\n1.1 Tópico [5]\n1.1.1 Subtópico [3]\n2 OUTRA DISCIPLINA\n2.1 Tópico [2]\n\n' +
      'REGRAS: use só os itens do edital (A), na mesma ordem; a disciplina não leva colchetes; use o índice (B) só para estimar a relevância; se um item do edital agrupa vários assuntos do índice, some as quantidades.\n\n' +
      '(A) EDITAL:\n' + String(edital || '').trim() + '\n\n(B) ÍNDICE COM QUANTIDADE DE QUESTÕES:\n' + String(indice || '').trim() + '\n';
  }
  // limpa a resposta de uma IA (cercas ```, marcadores "-", "*", negrito) e lê no formato "1.1 Tópico [5]"
  function lerRespostaCruzamento(texto) {
    const limpo = String(texto || '').split(/\r\n?|\n/).map(l => l.replace(/^\s*(?:```\w*|[-*•]\s+)/, '').replace(/\*\*/g, '').trimEnd()).filter(l => !/^\s*```/.test(l)).join('\n');
    const disciplinas = L3.parseEditalRelevancia(limpo); let total = 0, comRel = 0; disciplinas.forEach(d => d.topicos.forEach(t => { total++; if (t.relevancia) comRel++; }));
    return { disciplinas, total, comRel, semRel: total - comRel };
  }
  // quantidade de questões por tópico a partir do índice (casa por semelhança de título); relevância 1–5 só para quem casou
  function casarIndice(topicos, indice, minimo = 0.5) {
    const out = topicos.map(t => { let melhor = null, pts = 0; indice.forEach(x => { const p = parecido(t.titulo, x.nome); if (p > pts) { pts = p; melhor = x; } }); return pts >= minimo ? { titulo: t.titulo, qtd: melhor.qtd, indice: melhor.nome } : { titulo: t.titulo, qtd: null, indice: null }; });
    const casados = out.filter(o => o.qtd != null); const rel = L3.relevanciaPorQuantidade(casados.map(o => o.qtd)); let k = 0; out.forEach(o => { o.relevancia = o.qtd != null ? rel[k++] : null; }); return out;
  }
  // aplica a relevância lida da resposta na proposta [{nome, topicos:[{titulo, nivel}]}] (por título parecido; senão pela posição se as listas têm o mesmo tamanho)
  function aplicarRelevanciaNaProposta(proposta, lida) {
    return proposta.map((d, i) => {
      const rd = lida.find(x => parecido(x.nome, d.nome) >= 0.6) || (lida.length === proposta.length ? lida[i] : null);
      return Object.assign({}, d, { topicos: d.topicos.map((t, j) => { let r = null; if (rd) { let melhor = null, pts = 0; rd.topicos.forEach(x => { const p = parecido(x.titulo, t.titulo); if (p > pts) { pts = p; melhor = x; } }); r = pts >= 0.6 ? melhor : (rd.topicos.length === d.topicos.length ? rd.topicos[j] : null); } return Object.assign({}, t, { relevancia: r && r.relevancia ? r.relevancia : null }); }) });
    });
  }
  // para o edital que já existe no app: [{topicoId, titulo, disciplina, atual, nova}] (nova = null quando a resposta não trouxe relevância)
  function relevanciaParaExistentes({ disciplinas, topicos, lida }) {
    const out = [];
    disciplinas.forEach(d => { const rd = lida.find(x => parecido(x.nome, d.nome) >= 0.6); topicos.filter(t => t.disciplinaId === d.id).forEach(t => { let nova = null; if (rd) { let melhor = null, pts = 0; rd.topicos.forEach(x => { const p = parecido(x.titulo, t.titulo); if (p > pts) { pts = p; melhor = x; } }); if (pts >= 0.6 && melhor.relevancia) nova = melhor.relevancia; } out.push({ topicoId: t.id, titulo: t.titulo, disciplina: d.nome, atual: t.relevancia || 3, nova }); }); });
    return out;
  }
  // texto numerado do edital que está no app (para pedir o cruzamento sem colar de novo)
  function editalParaPrompt(disciplinas, topicos) {
    const linhas = []; disciplinas.forEach((d, i) => { linhas.push((i + 1) + ' ' + d.nome.toUpperCase()); const filhos = (pai, pref) => topicos.filter(t => t.disciplinaId === d.id && (t.paiId || null) === pai).sort((a, b) => a.ordem - b.ordem).forEach((t, k) => { const num = pref + '.' + (k + 1); linhas.push(num + ' ' + t.titulo); filhos(t.id, num); }); filhos(null, String(i + 1)); }); return linhas.join('\n');
  }

  // =====================================================================
  // 2. Dora Vertical, caderno e fase
  // =====================================================================
  // linhas de G.montarVertical; ordem: 'edital' (como está) | 'relevancia' (maior primeiro) | 'fraco' (menor % de acerto primeiro).
  // Com relevância mínima ou outra ordem a lista vira só folhas, por disciplina (a árvore deixaria de fazer sentido)
  function ordenarVertical(linhas, relPorTopico, { ordem = 'edital', relMin = 1 } = {}) {
    const rel = (l) => relPorTopico[l.topicoId] || 3;
    if (ordem === 'edital' && relMin <= 1) return linhas.slice();
    const folhas = linhas.filter(l => l.folha && rel(l) >= relMin); const grupos = []; const ix = {};
    folhas.forEach(l => { if (!(l.discId in ix)) { ix[l.discId] = grupos.length; grupos.push([]); } grupos[ix[l.discId]].push(l); });
    return grupos.map(g => ordem === 'relevancia' ? g.slice().sort((a, b) => rel(b) - rel(a)) : ordem === 'fraco' ? g.slice().sort((a, b) => (a.pct == null ? 101 : a.pct) - (b.pct == null ? 101 : b.pct)) : g).reduce((a, g) => a.concat(g), []);
  }
  const urlValida = (u) => /^https?:\/\/\S+$/i.test(String(u || '').trim());
  const semCaderno = (t) => !t.caderno || !urlValida(t.caderno);
  const ROTULO_FASE = Object.fromEntries(L3.FASES);
  // { topicoId: 'novo'|'descoberta'|... } a partir das respostas do concurso
  function fasesDosTopicos(topicos, respostas) {
    const por = {}; respostas.forEach(r => { if (r.topicoId) (por[r.topicoId] = por[r.topicoId] || []).push(r); });
    const out = {}; topicos.forEach(t => { out[t.id] = L3.faseTopico(por[t.id] || []); }); return out;
  }

  // =====================================================================
  // 3. Registrar estudo
  // =====================================================================
  const FORMAS = [['questoes', 'Questões'], ['pdf', 'PDF'], ['leiseca', 'Lei seca'], ['cartas', 'Cartas'], ['mapa', 'Mapa mental'], ['video', 'Vídeo']];
  // início e fim de um estudo cujo timer foi esquecido: terminou agora e durou "minutos"
  function minutosEsquecidos(minutos, agora = Date.now()) { const m = Math.round(+minutos); if (!(m >= 1 && m <= 720)) return null; return { inicio: agora - m * 60000, fim: agora, minutos: m }; }
  // transforma o formulário de fim de estudo em registros. dominio 0–5 vira 0–100 no tópico (x20)
  function montarRegistroEstudo({ concursoId, topicoId, sessao = null, minutos = 0, dominio = null, questoes = 0, acertos = 0, formas = [], dia, agora = Date.now(), uid = L.uid }) {
    if (!topicoId) return { erro: 'Escolha o tópico que você estudou.' };
    const nq = Math.max(0, Math.round(+questoes || 0)), na = Math.max(0, Math.round(+acertos || 0)); if (na > nq) return { erro: 'Os acertos não podem passar das questões feitas.' };
    const dm = dominio === '' || dominio == null ? null : Math.round(+dominio); if (dm != null && !(dm >= 0 && dm <= 5)) return { erro: 'O domínio vai de 0 a 5.' };
    const f = formas.filter(k => FORMAS.some(x => x[0] === k)); const d = dia || diaLocal(agora); const min = Math.round(+minutos || 0);
    let ses = null;
    if (sessao) ses = Object.assign({}, sessao, { topicoId, questoes: nq, acertos: na, formas: f, dominio: dm });
    else if (min >= 1) ses = { id: uid('s'), concursoId, topicoId, inicio: agora - min * 60000, fim: agora, minutos: min, tipo: 'manual', questoes: nq, acertos: na, formas: f, dominio: dm };
    const resposta = nq > 0 ? { id: uid('r'), concursoId, topicoId, refTipo: 'manual', refId: null, ts: agora, dia: d, correta: na * 2 >= nq, qtd: nq, acertos: na, confianca: null, ms: 0, origem: 'registro' } : null;
    return { sessao: ses, resposta, dominio: dm, dominioPct: dm == null ? null : dm * 20, formas: f };
  }

  // =====================================================================
  // 4. Cartas
  // =====================================================================
  // um cartão por linha: "frente :: verso #tag1 #tag2" (também aceita TAB). Linha com {{c1::...}} vira omissão de palavras. Linhas vazias e "//" são ignoradas.
  function parseLoteCartas(texto) {
    const cartoes = []; let ignoradas = 0;
    String(texto || '').split(/\r\n?|\n/).forEach(bruta => {
      let l = bruta.trim(); if (!l || l.startsWith('//')) return; const tags = []; l = l.replace(/(?:^|\s)#([\p{L}\p{N}_:-]+)/gu, (m, t) => { tags.push(t); return ''; }).trim();
      if (/\{\{c\d+::/.test(l)) { L3.lacunasCartoes(l).forEach(x => cartoes.push({ tipo: 'basico', frente: x.frente, verso: x.verso, tags, lacuna: x.n })); return; }
      const i = l.indexOf('::') >= 0 ? l.indexOf('::') : l.indexOf('\t'); const sep = l.indexOf('::') >= 0 ? 2 : 1;
      if (i <= 0) { ignoradas++; return; } const frente = l.slice(0, i).trim(), verso = l.slice(i + sep).trim(); if (!frente || !verso) { ignoradas++; return; } cartoes.push({ tipo: 'basico', frente, verso, tags });
    });
    return { cartoes, ignoradas };
  }
  // retângulos de oclusão em frações da imagem (0 a 1); descarta os muito pequenos
  function retangulosValidos(rets) {
    return (rets || []).map(r => ({ x: limita(+r.x || 0, 0, 1), y: limita(+r.y || 0, 0, 1), w: +r.w || 0, h: +r.h || 0 })).map(r => ({ x: r.x, y: r.y, w: Math.min(r.w, 1 - r.x), h: Math.min(r.h, 1 - r.y) })).filter(r => r.w >= 0.015 && r.h >= 0.015).map(r => ({ x: Math.round(r.x * 1e4) / 1e4, y: Math.round(r.y * 1e4) / 1e4, w: Math.round(r.w * 1e4) / 1e4, h: Math.round(r.h * 1e4) / 1e4 }));
  }
  // um cartão por retângulo: na frente só aquele retângulo fica tapado; os outros aparecem
  function cartoesDeOclusao({ imagem, retangulos, concursoId, topicoId = null, tags = [], uid = L.uid, agora = Date.now() }) {
    const rs = retangulosValidos(retangulos); const grupo = uid('oc');
    return rs.map((r, i) => ({ id: uid('c'), concursoId, topicoId, tipo: 'oclusao', frente: 'Oclusão de imagem (' + (i + 1) + ' de ' + rs.length + ')', verso: '', imagem, retangulos: rs, alvo: i, grupo, tags, origem: 'oclusao', criado: agora + i }));
  }
  const embaralhar = (a, rng) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  // monta a fila do simulado de cartas. origem: misturado | fila | aleatorio | erradas; ordem: intercalado | agrupado (por disciplina)
  function montarSimuladoCartas({ cartoes, topicos = [], hoje, origem = 'misturado', discIds = [], qtd = 20, ordem = 'intercalado', rng = Math.random }) {
    const discDe = {}; topicos.forEach(t => { discDe[t.id] = t.disciplinaId; }); const dd = (c) => discDe[c.topicoId] || '';
    const base = discIds.length ? cartoes.filter(c => discIds.includes(dd(c))) : cartoes.slice(); const erros = (c) => Math.max(0, (c.feitas || 0) - (c.acertos || 0));
    const fila = () => base.filter(c => L.cartaoDevido(c, hoje)).sort((a, b) => (a.prox ? 0 : 1) - (b.prox ? 0 : 1) || (a.prox || '').localeCompare(b.prox || ''));
    const erradas = () => base.filter(c => erros(c) > 0).sort((a, b) => erros(b) - erros(a) || (erros(b) / (b.feitas || 1)) - (erros(a) / (a.feitas || 1)));
    let lista;
    if (origem === 'fila') lista = fila(); else if (origem === 'erradas') lista = erradas(); else if (origem === 'aleatorio') lista = embaralhar(base, rng);
    else { const fontes = [fila(), erradas(), embaralhar(base, rng)]; const visto = new Set(); lista = []; for (let i = 0; lista.length < base.length && i < base.length + 1; i++) fontes.forEach(f => { while (f.length && visto.has(f[0].id)) f.shift(); if (f.length) { const c = f.shift(); visto.add(c.id); lista.push(c); } }); }
    lista = lista.slice(0, Math.max(1, qtd | 0));
    const grupos = []; const ix = {}; lista.forEach(c => { const k = dd(c); if (!(k in ix)) { ix[k] = grupos.length; grupos.push([]); } grupos[ix[k]].push(c); });
    if (ordem === 'agrupado') return grupos.reduce((a, g) => a.concat(g), []);
    const out = []; for (let i = 0; out.length < lista.length; i++) grupos.forEach(g => { if (g[i]) out.push(g[i]); }); return out;
  }
  // retenção = % de acertos nas REVISÕES de cartas (a primeira vez que o aluno vê o cartão não conta)
  function retencaoCartas({ respostas, topicos, disciplinas }) {
    const porCarta = {}; respostas.filter(r => r.refTipo === 'cartao' && r.refId).forEach(r => (porCarta[r.refId] = porCarta[r.refId] || []).push(r));
    const topDe = {}; topicos.forEach(t => { topDe[t.id] = t; }); const porT = {}, porD = {}; let n = 0, ok = 0;
    Object.values(porCarta).forEach(rs => { rs.sort((a, b) => (a.ts || 0) - (b.ts || 0)).slice(1).forEach(r => { n++; if (r.correta) ok++; const t = topDe[r.topicoId]; if (!t) return; const a = porT[t.id] = porT[t.id] || { n: 0, ok: 0 }; a.n++; if (r.correta) a.ok++; const b = porD[t.disciplinaId] = porD[t.disciplinaId] || { n: 0, ok: 0 }; b.n++; if (r.correta) b.ok++; }); });
    const pct = (o) => o.n ? Math.round(100 * o.ok / o.n) : null;
    return { geral: { n, ok, pct: pct({ n, ok }) },
      porDisciplina: disciplinas.filter(d => porD[d.id]).map(d => ({ id: d.id, nome: d.nome, n: porD[d.id].n, ok: porD[d.id].ok, pct: pct(porD[d.id]) })).sort((a, b) => a.pct - b.pct),
      porTopico: Object.keys(porT).map(id => ({ id, titulo: topDe[id].titulo, n: porT[id].n, ok: porT[id].ok, pct: pct(porT[id]) })).sort((a, b) => a.pct - b.pct || b.n - a.n) };
  }
  // o timer da sessão de cartas só começa na primeira resposta; só vira sessão se passar de 1 minuto
  function sessaoDeCartas({ primeiraRespostaTs, fimTs, feitas = 0, acertos = 0 }) {
    if (!primeiraRespostaTs || !fimTs || fimTs <= primeiraRespostaTs) return null; const ms = fimTs - primeiraRespostaTs; if (ms <= 60000) return null;
    return { inicio: primeiraRespostaTs, fim: fimTs, minutos: Math.round(ms / 60000), tipo: 'foco', origem: 'cartas', questoes: feitas, acertos };
  }

  // =====================================================================
  // 5. Ciclo
  // =====================================================================
  const NIVEIS = [[1, 'Estou começando'], [2, 'Fraco'], [3, 'Médio'], [4, 'Bom'], [5, 'Muito bom']];
  // minutos do dia (0 = domingo) segundo as horas por dia da semana [dom..sáb] (em horas, aceita 1,5)
  function minutosDoDia(horasSemana, dia) { const h = (horasSemana || [])[paraData(dia).getDay()]; return Math.max(0, Math.round((+h || 0) * 60)); }
  // continua de onde parou: o plano do dia pega as disciplinas pendentes na ordem do ciclo; dia sem estudo não deixa dívida
  function planoDoDiaCiclo({ itens, minutosHoje }) {
    const out = []; let resta = Math.max(0, Math.round(minutosHoje || 0)); itens.filter(i => i.falta > 0).forEach(i => { if (resta <= 0) return; const m = Math.min(i.falta, resta); out.push({ id: i.id, nome: i.nome, minutos: m }); resta -= m; });
    return out;
  }
  // modo por questões: cada rodada pede "porRodada" questões de cada disciplina, na ordem do ciclo. feitas: {discId: questões desde o início do ciclo}
  function cicloPorQuestoes({ disciplinas, topicos, feitas = {}, porRodada = 10 }) {
    const N = Math.max(1, Math.round(+porRodada || 10)); const folhas = topicos.filter(t => !topicos.some(o => o.paiId === t.id));
    const ds = disciplinas.filter(d => folhas.some(t => t.disciplinaId === d.id)).slice().sort((a, b) => (b.peso == null ? 10 : +b.peso) - (a.peso == null ? 10 : +a.peso));
    if (!ds.length) return { itens: [], proxima: null, rodada: 1, porRodada: N, completo: false };
    const base = Math.min(...ds.map(d => Math.floor((feitas[d.id] || 0) / N)));
    const itens = ds.map(d => { const feito = Math.max(0, Math.min(N, (feitas[d.id] || 0) - base * N)); return { id: d.id, nome: d.nome, meta: N, feito, falta: N - feito, pct: Math.round(100 * feito / N) }; });
    return { itens, proxima: itens.find(i => i.falta > 0) || itens[0], rodada: base + 1, porRodada: N, completo: false };
  }

  // =====================================================================
  // 6. Marcações de texto
  // =====================================================================
  const normalizarTags = (s) => [...new Set((Array.isArray(s) ? s : String(s || '').split(/[,;\s]+/)).map(x => String(x).replace(/^#/, '').trim().toLowerCase()).filter(Boolean))].slice(0, 12);
  function filtrarMarcacoes(lista, { cor = '', tag = '', favorito = false, busca = '', ocultas = null } = {}) {
    const b = semAcento(busca); return lista.filter(m => (!cor || m.cor === cor) && (!tag || (m.tags || []).includes(tag)) && (!favorito || m.favorito) && (ocultas == null || !!m.oculto === ocultas) && (!b || semAcento([m.texto, m.nota, m.titulo, (m.tags || []).join(' ')].join(' ')).includes(b)));
  }
  const todasAsTags = (lista) => [...new Set(lista.reduce((a, m) => a.concat(m.tags || []), []))].sort();
  // idsDeCores: ['amarelo','verde',...] na ordem das 6 cores; significados: ['Regra','Exceção',...]
  function marcacoesParaExportar(lista, idsDeCores, significados, titulo) {
    const conv = lista.map(m => Object.assign({}, m, { cor: Math.max(0, idsDeCores.indexOf(m.cor)) }));
    return L3.marcacoesParaMarkdown(conv, { significados, titulo: titulo || 'Minhas marcações' });
  }

  // =====================================================================
  // 7. Concursos como objetivos, menu, resumo da semana e resumo de superfície
  // =====================================================================
  const OBJETIVOS = [['ativo', 'Ativos'], ['concluido', 'Concluídos'], ['arquivado', 'Arquivados']];
  const objetivoDe = (c) => c && ['concluido', 'arquivado'].includes(c.objetivo) ? c.objetivo : 'ativo';
  function filtrarConcursos(lista, filtro, atualId) { if (filtro === 'todos') return lista.slice(); return lista.filter(c => objetivoDe(c) === filtro || (filtro === 'ativo' && c.id === atualId)); }
  function mudarObjetivo(c, novo, agora = Date.now()) { if (!['ativo', 'concluido', 'arquivado'].includes(novo)) throw new Error('Objetivo desconhecido.'); return Object.assign({}, c, { objetivo: novo, objetivoEm: novo === 'ativo' ? null : agora }); }
  const PROTEGIDOS = ['inicio', 'concursos', 'edital', 'estudar', 'ajustes', 'mais'];
  function menuVisivel(menu, escondidos) { const e = new Set((escondidos || []).filter(k => !PROTEGIDOS.includes(k))); return menu.filter(m => !e.has(m[0])); }
  // últimos 7 dias: horas, questões, acerto e tópicos mais trabalhados
  function resumoSemana({ sessoes, respostas, topicos, hoje }) {
    const ini = somaDias(hoje, -6); const dentro = (d) => d && d >= ini && d <= hoje; const ss = sessoes.filter(s => dentro(diaLocal(s.inicio))); const rs = respostas.filter(r => dentro(r.dia));
    const minutos = ss.reduce((a, s) => a + (s.minutos || 0), 0); const questoes = rs.reduce((a, r) => a + (r.qtd || 1), 0); const acertos = rs.reduce((a, r) => a + (r.acertos != null ? r.acertos : r.correta ? 1 : 0), 0);
    const nomes = {}; topicos.forEach(t => { nomes[t.id] = t.titulo; }); const por = {}; const toca = (id) => (por[id] = por[id] || { min: 0, q: 0 });
    ss.forEach(s => { if (s.topicoId) toca(s.topicoId).min += s.minutos || 0; }); rs.forEach(r => { if (r.topicoId) toca(r.topicoId).q += r.qtd || 1; });
    const dias = new Set(ss.map(s => diaLocal(s.inicio)).concat(rs.map(r => r.dia))); const lista = Object.keys(por).filter(id => nomes[id]).map(id => ({ id, titulo: nomes[id], min: por[id].min, q: por[id].q })).sort((a, b) => (b.min + b.q * 2) - (a.min + a.q * 2));
    return { de: ini, ate: hoje, minutos, horas: Math.round(minutos / 6) / 10, questoes, acertos, pct: questoes ? Math.round(100 * acertos / questoes) : null, diasAtivos: dias.size, topicos: lista.slice(0, 5), totalTopicos: lista.length };
  }
  // resumo de superfície: pedido para a IA a partir do texto de um PDF de questões com gabarito
  function prepararTextoQuestoes(paginas, maxChars = 24000) { const t = (Array.isArray(paginas) ? paginas.join('\n') : String(paginas || '')).replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim(); return t.length > maxChars ? t.slice(0, maxChars) + '\n[... texto cortado ...]' : t; }
  function promptSuperficie({ texto, banca = '', materia = '' }) {
    return 'Você é um mentor de concursos. Abaixo está o texto de um PDF de questões' + (banca ? ' da banca ' + banca : '') + (materia ? ' de ' + materia : '') + ', com gabarito. Faça um RESUMO DE SUPERFÍCIE do que essas questões cobram, em português simples, sem copiar enunciados.\n\n' +
      'Entregue exatamente estas seções:\n1) ASSUNTOS COBRADOS: lista dos assuntos, cada um com a contagem de questões (ex.: "Crase — 6 questões"), do mais cobrado ao menos cobrado.\n2) COMO A BANCA COBRA: 3 a 6 linhas sobre o estilo (certo/errado ou múltipla escolha, literalidade, casos concretos, pegadinhas de texto).\n3) PEGADINHAS REPETIDAS: as armadilhas que aparecem mais de uma vez, com a contagem.\n4) O QUE ESTUDAR PRIMEIRO: 3 a 5 itens, em ordem.\nSe algo não estiver claro no texto, diga "não consegui identificar" em vez de inventar. Confira o gabarito antes de afirmar qual alternativa está certa.\n\nTEXTO DAS QUESTÕES:\n' + texto + '\n';
  }
  // contagem local (sem IA): quantas questões, quantas com gabarito e como as letras se distribuem
  function contarSuperficie(texto) {
    const qs = L.parseQuestoesTexto(String(texto || '')); const letras = {}; qs.forEach(q => { if (q.gabarito) letras[q.gabarito] = (letras[q.gabarito] || 0) + 1; });
    return { total: qs.length, comGabarito: qs.filter(q => q.gabarito).length, letras };
  }

  // =====================================================================
  // 8. Ida e volta com a Dora Guilda (Estúdio): erros em JSON {tipo:'dora-guilda-erros', versao:1, erros:[...]}
  // =====================================================================
  const TIPO_PARA_GUILDA = { conteudo: 'teoria', reconhecer: 'pegadinha', leitura: 'leitura', execucao: 'teoria' };
  const TIPO_DA_GUILDA = { teoria: 'conteudo', pegadinha: 'reconhecer', leitura: 'leitura', chute: 'conteudo' };
  // entradas do Diário -> objeto de exportação. ctx: {topicos, disciplinas, respostas, cartoes, questoes, hoje}
  function errosParaGuilda(entradas, ctx) {
    const top = {}; (ctx.topicos || []).forEach(t => { top[t.id] = t; }); const disc = {}; (ctx.disciplinas || []).forEach(d => { disc[d.id] = d; });
    const achar = (e) => (e.refTipo === 'cartao' ? ctx.cartoes : e.refTipo === 'questao' ? ctx.questoes : []) .find(x => x.id === e.refId) || null;
    const erros = entradas.map(e => {
      const t = top[e.topicoId] || null; const item = achar(e); const rs = (ctx.respostas || []).filter(r => r.refId === e.refId).sort((a, b) => (b.ts || 0) - (a.ts || 0));
      const ult = rs[0]; const chute = e.motivo === 'chute'; const tipo = chute ? 'chute' : (TIPO_PARA_GUILDA[e.tipoErro] || 'teoria');
      const notas = []; if (e.tipoErro === 'execucao') notas.push('execução'); if (e.comoPensei) notas.push(e.comoPensei);
      const cartas = item && e.refTipo === 'cartao' ? [{ f: String(item.frente || item.enunciado || ''), b: String(item.verso || item.explicacao || '') }] : [];
      return { id: e.id, quando: ult && ult.dia ? ult.dia : ctx.hoje || diaLocal(), disc: t && disc[t.disciplinaId] ? disc[t.disciplinaId].nome : '', topico: t ? t.titulo : '', enunciado: String((item && (item.enunciado || item.frente)) || e.resumo || ''), minha: ult && /^[A-E]$/.test(ult.escolha || '') ? ult.escolha : '', gab: item && item.gabarito ? item.gabarito : '', tipo, nota: notas.join(' · '),
        cartas, analise: { causa: (e.analise && e.analise.onde) || '', regra: (e.analise && e.analise.gesto) || '' }, rev: { n: e.acertosSeg || 0, prox: e.proxCheque || ctx.hoje || diaLocal() } };
    });
    return { tipo: 'dora-guilda-erros', versao: 1, erros };
  }
  // texto JSON (ou objeto) -> lista de erros válidos; aceita o formato com envelope e um array puro
  function lerErrosDaGuilda(entrada) {
    let v = entrada; if (typeof v === 'string') { try { v = JSON.parse(v); } catch (e) { return { erro: 'Esse texto não é um JSON válido.', itens: [] }; } }
    if (v && !Array.isArray(v)) { if (v.tipo !== 'dora-guilda-erros') return { erro: 'Esse arquivo não é de erros da Dora Guilda (tipo "dora-guilda-erros").', itens: [] }; v = v.erros; }
    if (!Array.isArray(v)) return { erro: 'Não achei a lista de erros.', itens: [] };
    const itens = v.filter(x => x && typeof x === 'object' && x.id != null && String(x.enunciado || x.topico || '').trim()).map(x => ({ id: String(x.id), quando: /^\d{4}-\d{2}-\d{2}$/.test(x.quando || '') ? x.quando : null, disc: String(x.disc || ''), topico: String(x.topico || ''), enunciado: String(x.enunciado || ''), minha: String(x.minha || ''), gab: String(x.gab || ''), tipo: String(x.tipo || 'teoria'), nota: String(x.nota || ''), cartas: Array.isArray(x.cartas) ? x.cartas.filter(c => c && c.f).map(c => ({ f: String(c.f), b: String(c.b || '') })) : [], analise: { causa: String(x.analise && x.analise.causa || ''), regra: String(x.analise && x.analise.regra || '') }, rev: { n: +(x.rev && x.rev.n) || 0, prox: x.rev && /^\d{4}-\d{2}-\d{2}$/.test(x.rev.prox || '') ? x.rev.prox : null } }));
    return { erro: null, itens, ignorados: v.length - itens.length };
  }
  // prévia: o que entra, o que já existe (mesmo id) e a qual tópico cada erro se liga (por título)
  function previaErrosGuilda(itens, { erros = [], topicos = [], disciplinas = [] }) {
    const ja = new Set(erros.map(e => e.id).concat(erros.map(e => e.guildaId).filter(Boolean))); const vistos = new Set();
    return itens.map(it => { const dup = ja.has(it.id) || vistos.has(it.id); vistos.add(it.id); let melhor = null, pts = 0; topicos.forEach(t => { const p = parecido(t.titulo, it.topico); if (p > pts) { pts = p; melhor = t; } }); return Object.assign({}, it, { duplicado: dup, topicoId: pts >= 0.6 ? melhor.id : null }); });
  }
  // item da prévia -> entrada do Diário (+ cartas); hoje para o que não trouxer data
  function erroDaGuilda(it, concursoId, hoje) {
    const execucao = it.tipo === 'teoria' && /execu[cç][aã]o/i.test(it.nota); const chute = it.tipo === 'chute';
    return { id: it.id, guildaId: it.id, refTipo: 'manual', refId: it.id, topicoId: it.topicoId || null, concursoId, resumo: it.enunciado.slice(0, 140), motivo: chute ? 'chute' : 'erro', tipoErro: execucao ? 'execucao' : (TIPO_DA_GUILDA[it.tipo] || 'conteudo'), acertosSeg: it.rev.n || 0, proxCheque: it.rev.prox || hoje, resolvido: false, vezes: 1, comoPensei: it.nota, analise: it.analise.causa || it.analise.regra ? { onde: it.analise.causa, sinal: '', gesto: it.analise.regra } : null, origem: 'guilda', quando: it.quando || hoje };
  }

  return { errosParaGuilda, lerErrosDaGuilda, previaErrosGuilda, erroDaGuilda, semAcento, parecido, promptCruzamento, lerRespostaCruzamento, casarIndice, aplicarRelevanciaNaProposta, relevanciaParaExistentes, editalParaPrompt,
    ordenarVertical, urlValida, semCaderno, ROTULO_FASE, fasesDosTopicos,
    FORMAS, minutosEsquecidos, montarRegistroEstudo,
    parseLoteCartas, retangulosValidos, cartoesDeOclusao, montarSimuladoCartas, retencaoCartas, sessaoDeCartas,
    NIVEIS, minutosDoDia, planoDoDiaCiclo, cicloPorQuestoes,
    normalizarTags, filtrarMarcacoes, todasAsTags, marcacoesParaExportar,
    OBJETIVOS, objetivoDe, filtrarConcursos, mudarObjetivo, PROTEGIDOS, menuVisivel, resumoSemana, prepararTextoQuestoes, promptSuperficie, contarSuperficie };
});
