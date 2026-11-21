/* Dora Draw — telas e ligações da quinta leva (a lógica pura está em logica5.js e é testada em testes\gemeo.test.js,
   testes\agentes.test.js e testes\transformar.test.js):
   1. Gêmeo digital (nota estimada, girassol, o que mais sobe a nota, chance de passar da meta; alimenta prioridades e ciclo)
   2. Agentes sintéticos (perfis de candidatos, TRI, alerta de pegadinha, agentes de IA) + nota na questão e no Raio-X
   3. Transformar marcações (resumo, Dora Cartas e mapa mental) no leitor, na Estante, no tópico e em lote
   AVISO: tudo aqui é ESTIMATIVA feita com os dados do próprio aluno. Nunca "prevê a prova". Embrulha views que já existem. Obra original. */
(function () {
  const App = window.App, { L, h, DB } = App, V = App.views, L5 = window.DoraLogica5, TU = window.DoraTransformar;
  const ls = (k, p) => { try { const v = localStorage.getItem(k); return v == null ? p : JSON.parse(v); } catch (e) { return p; } };
  const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* sem armazenamento */ } };
  const SVGNS = 'http://www.w3.org/2000/svg';
  const sv = (tag, at = {}, ...filhos) => { const e = document.createElementNS(SVGNS, tag); for (const k in at) e.setAttribute(k, at[k]); filhos.flat().forEach(f => e.append(f && f.nodeType ? f : document.createTextNode(f))); return e; };
  const pct = (v) => Math.round(100 * v) + '%'; const num = (v, c = 1) => String(Math.round(v * Math.pow(10, c)) / Math.pow(10, c)).replace('.', ',');
  const corta = (s, n) => { s = String(s || ''); return s.length > n ? s.slice(0, n - 1) + '…' : s; };
  const AVISO = 'É uma estimativa feita só com os seus dados (respostas, domínio que você declarou e datas de estudo). Não prevê a prova.';

  // menu: Agentes sintéticos depois do Raio-X; Gêmeo digital depois de Evolução
  const MENU = App.MENU; const iR = MENU.findIndex(m => m[0] === 'raiox'); if (iR >= 0 && !MENU.some(m => m[0] === 'agentes')) MENU.splice(iR + 1, 0, ['agentes', 'Agentes sintéticos']);
  const iE = MENU.findIndex(m => m[0] === 'evolucao'); if (!MENU.some(m => m[0] === 'gemeo')) MENU.splice(iE >= 0 ? iE + 1 : MENU.length, 0, ['gemeo', 'Gêmeo digital']);

  // =====================================================================
  // 1. Gêmeo digital
  // =====================================================================
  App.usarGemeo = () => ls('doraDraw.usarGemeo', true) !== false;
  App.dadosGemeo = (rodadas = 1500) => {
    const c = App.S.conc; const hoje = App.hoje(); const t = App.S.topicos; const d = App.S.disciplinas;
    const modelos = L5.construirGemeo({ topicos: t, respostas: App.S.respostas, cartoes: App.S.cartoes, hoje });
    const sim = L5.simularProva({ disciplinas: d, topicos: t, modelos, rodadas, semente: L5.hashTexto(c.id) });
    return { modelos, sim, rank: L5.rankingGanho({ disciplinas: d, topicos: t, modelos }) };
  };
  // as prioridades e o ciclo passam a usar a chance de acerto do gêmeo (com esquecimento e incerteza) onde ele tem alguma informação;
  // o resto (tópico sem nenhum dado) continua como antes. Desligável em Gêmeo digital.
  const mapaOrig = App.mapaNotas;
  App.mapaNotasPlano = () => { const base = mapaOrig(); if (!App.usarGemeo() || !App.S.conc || !App.S.topicos.length) return base; try { return L5.notasComGemeo(base, L5.construirGemeo({ topicos: App.S.topicos, respostas: App.S.respostas, cartoes: App.S.cartoes, hoje: App.hoje(), intervalo: false })); } catch (e) { console.warn('Gêmeo', e); return base; } };
  App.prioridades = () => L.prioridades({ disciplinas: App.S.disciplinas, topicos: App.S.topicos, notas: App.mapaNotasPlano(), hoje: App.hoje(), provaData: App.provaData() });

  function girassol(d, aoMostrar) {
    const folhas = []; App.S.disciplinas.forEach(dc => App.arvore(dc.id).forEach(({ t }) => { if (App.ehFolha(t) && d.modelos[t.id]) folhas.push(t); }));
    const pesos = {}; d.rank.forEach(r => { pesos[r.topicoId] = r.esperadas; }); const maxP = Math.max(0.0001, ...Object.values(pesos)); const n = Math.max(1, folhas.length); const rmax = Math.min(12, 80 / Math.sqrt(n)), rmin = rmax * 0.35;
    const pts = L5.girassolPontos(folhas.length, 100); const svg = sv('svg', { viewBox: '-112 -112 224 224', class: 'gm-girassol', role: 'img', 'aria-label': 'Girassol do aluno: cada semente é um tópico; quanto mais brilhante, maior a chance estimada de acerto; quanto maior, mais peso na prova' });
    folhas.forEach((t, i) => { const m = d.modelos[t.id]; const r = rmin + (rmax - rmin) * Math.sqrt((pesos[t.id] || 0) / maxP);
      const c = sv('circle', { cx: pts[i].x, cy: pts[i].y, r: arredonda(r), class: 'gm-semente' + (m.insuficiente ? ' gm-pouco' : ''), 'fill-opacity': String(arredonda(0.12 + 0.88 * m.p, 2)), tabindex: '0', 'data-topico': t.id, 'data-p': String(m.p), role: 'img', 'aria-label': t.titulo + ': chance estimada ' + pct(m.p) + ', faixa de ' + pct(m.lo) + ' a ' + pct(m.hi) + ', ' + num(m.n, 0) + ' questões respondidas' + (m.insuficiente ? ', dados insuficientes' : ''), style: '--i:' + i }, sv('title', {}, t.titulo + ' — ' + pct(m.p) + ' (' + pct(m.lo) + ' a ' + pct(m.hi) + ')'));
      ['pointerenter', 'focus', 'click'].forEach(ev => c.addEventListener(ev, () => aoMostrar(t, m, c))); svg.append(c); });
    return svg;
  }
  const arredonda = (v, c = 1) => Math.round(v * Math.pow(10, c)) / Math.pow(10, c);

  function barraFaixa(r) {
    const W = 360, H = 24, x0 = 4, w = W - 8; const k = (v) => x0 + w * Math.min(1, Math.max(0, r.max ? v / r.max : 0));
    return sv('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'gm-faixa-svg', role: 'img', 'aria-label': r.nome + ': nota estimada ' + num(r.media) + ' de ' + num(r.max) + ' pontos, faixa de 80% de ' + num(r.lo) + ' a ' + num(r.hi) },
      sv('rect', { x: x0, y: 5, width: w, height: 12, rx: 6, class: 'gm-trilho' }), sv('rect', { x: x0, y: 5, width: Math.max(2, k(r.media) - x0), height: 12, rx: 6, class: 'gm-barra' }),
      sv('line', { x1: k(r.lo), x2: k(r.hi), y1: 11, y2: 11, class: 'gm-bigode' }), sv('line', { x1: k(r.lo), x2: k(r.lo), y1: 5, y2: 17, class: 'gm-bigode' }), sv('line', { x1: k(r.hi), x2: k(r.hi), y1: 5, y2: 17, class: 'gm-bigode' }));
  }

  V.gemeo = async (alvo) => {
    if (!App.exigeEdital(alvo)) return; const c = App.S.conc; const d = App.dadosGemeo(); const tot = d.sim.total;
    alvo.append(h('h1', {}, 'Gêmeo digital'), h('p', { class: 'muted' }, 'Um modelo estatístico simples de você: para cada tópico, a chance de acertar uma questão hoje, considerando o que você respondeu, o domínio que declarou e o quanto já esqueceu.'));
    alvo.append(h('div', { class: 'cartao destaque', 'data-gemeo-aviso': '1' }, h('b', {}, 'Leia como estimativa, nunca como previsão. '), AVISO + ' A faixa mostra a incerteza (80% das simulações caem dentro dela); com poucos dados ela é larga e o número vale pouco.'));
    alvo.append(h('div', { class: 'cartao', 'data-gemeo-total': '1' }, h('div', { class: 'rotulo' }, 'Nota estimada hoje'), h('div', { class: 'linha', style: 'align-items:baseline' }, h('div', { class: 'numgrande' }, num(tot.media)), h('div', { class: 'muted' }, 'de ' + num(tot.max) + ' pontos (' + num(tot.pct) + '%)')),
      h('div', { class: 'linha', style: 'margin:6px 0' }, h('span', { class: 'chip azul' }, 'faixa de 80%: ' + num(tot.lo) + ' a ' + num(tot.hi)), h('span', { class: 'chip' }, 'amostra: ' + num(tot.n, 0) + ' questões respondidas'), h('span', { class: 'chip' }, tot.topicosComDados + ' de ' + tot.topicos + ' tópicos com 5 ou mais questões'), tot.insuficiente ? h('span', { class: 'chip aviso', 'data-dados-insuficientes': '1' }, 'dados insuficientes') : null),
      h('p', { class: 'muted peq', style: 'margin:0' }, L5.avisoDeDados(tot) + ' (' + d.sim.rodadas + ' simulações, semente fixa: o mesmo dado dá sempre o mesmo resultado.)')));
    const usar = h('input', { type: 'checkbox', 'data-usar-gemeo': '1', checked: App.usarGemeo(), onchange: (e) => { lsSet('doraDraw.usarGemeo', e.target.checked); App.toast(e.target.checked ? 'As prioridades e o ciclo passam a usar o gêmeo.' : 'As prioridades e o ciclo voltam ao cálculo de antes.'); } });
    alvo.append(h('div', { class: 'cartao' }, h('label', { class: 'marca-op' }, usar, h('span', {}, h('b', {}, 'Usar o gêmeo nas prioridades e no ciclo. '), 'Onde há informação, a fraqueza do tópico passa a ser 1 − (chance estimada), que já inclui o esquecimento. Tópico sem nenhum dado continua como antes ("ainda não sei"). Desligue para voltar ao cálculo antigo.'))));
    // ---- girassol
    const info = h('div', { class: 'afundado peq', 'data-girassol-info': '1', 'aria-live': 'polite' }, 'Passe o mouse (ou toque) numa semente para ver o tópico, a chance estimada e a faixa.');
    const g = girassol(d, (t, m, el) => { alvo.querySelectorAll('.gm-semente.sel').forEach(x => x.classList.remove('sel')); el.classList.add('sel'); info.replaceChildren(h('b', {}, t.titulo), h('span', { class: 'muted' }, ' · ' + ((App.disciplina(t.disciplinaId) || {}).nome || '')), h('div', {}, 'Chance estimada de acerto: ', h('b', {}, pct(m.p)), ' (faixa de 80%: ' + pct(m.lo) + ' a ' + pct(m.hi) + ')'), h('div', { class: 'muted' }, 'Amostra: ' + num(m.n, 0) + ' questões' + (m.dias ? ' · última revisão há ' + m.dias + (m.dias === 1 ? ' dia' : ' dias') : '') + (m.insuficiente ? ' · dados insuficientes: o número é um palpite' : '')), h('a', { href: '#/topico/' + t.id }, 'Abrir o tópico')); });
    alvo.append(h('div', { class: 'cartao', 'data-girassol': '1' }, h('h2', {}, 'Seu girassol'), h('p', { class: 'muted peq' }, 'Cada semente é um tópico. Brilho = chance estimada de acerto. Tamanho = peso do tópico na prova. Contorno tracejado = menos de 5 questões respondidas (dado insuficiente).'), h('div', { class: 'gm-palco' }, g), info));
    // ---- por disciplina
    alvo.append(h('div', { class: 'cartao', 'data-gemeo-disc': '1' }, h('h2', {}, 'Nota estimada por disciplina'), h('p', { class: 'muted peq' }, 'Barra = nota estimada. Traço = faixa de 80%. Usa o número de questões e os pontos do quadro da prova de cada disciplina (se não houver pesos, divide pela relevância dos tópicos).'),
      h('div', { class: 'pilha' }, d.sim.disciplinas.map(r => h('div', { class: 'gm-linha' }, h('div', { class: 'linha entre' }, h('b', {}, r.nome), h('span', { class: 'muted peq' }, num(r.media) + ' de ' + num(r.max) + ' (faixa ' + num(r.lo) + ' a ' + num(r.hi) + ')')), barraFaixa(r), h('div', { class: 'muted peq' }, 'amostra: ' + num(r.n, 0) + ' questões em ' + r.topicos + ' tópicos' + (r.insuficiente ? ' · ' : ''), r.insuficiente ? h('span', { class: 'chip aviso' }, 'dados insuficientes') : null))))));
    // ---- meta
    const chave = 'doraDraw.gemeo-meta:' + c.id; const meta0 = ls(chave, Math.round(tot.max * 0.6)); const saida = h('div', { 'data-meta-saida': '1' });
    const metaIn = h('input', { type: 'number', min: 0, max: tot.max, step: 0.5, value: meta0, style: 'width:110px', 'aria-label': 'Nota de corte em pontos', 'data-meta': '1', oninput: () => calc() });
    const calc = () => { const m = Math.max(0, +metaIn.value || 0); lsSet(chave, m); const r = L5.chanceDeMeta(d.sim, m); const falta = m - tot.media;
      saida.replaceChildren(h('div', { class: 'linha', style: 'align-items:baseline' }, h('div', { class: 'numgrande', 'data-meta-p': '1' }, pct(r.p)), h('div', { class: 'muted' }, 'chance estimada de chegar a ' + num(m) + ' pontos')),
        h('div', { class: 'peq muted' }, 'Erro do sorteio: ' + pct(r.lo) + ' a ' + pct(r.hi) + '. ' + (falta > 0 ? 'Você precisa de cerca de ' + num(falta) + ' pontos a mais que a média estimada.' : 'A meta está ' + num(-falta) + ' pontos abaixo da média estimada.') + (App.S.disciplinas.some(x => +x.minimo > 0) ? ' Considera também os mínimos por disciplina do quadro da prova.' : '')),
        h('div', { class: 'afundado peq', style: 'margin-top:6px' }, (tot.insuficiente ? 'Dados insuficientes: ' : '') + AVISO + ' Nota de corte real varia de ano a ano e depende dos outros candidatos.')); };
    alvo.append(h('div', { class: 'cartao', 'data-gemeo-meta': '1' }, h('h2', {}, 'Comparar com a meta'), h('div', { class: 'linha' }, h('label', { class: 'campo' }, h('span', {}, 'Nota de corte (pontos, de 0 a ' + num(tot.max) + ')'), metaIn)), saida)); calc();
    // ---- ranking
    const top = d.rank.slice(0, 10);
    alvo.append(h('div', { class: 'cartao', 'data-gemeo-rank': '1' }, h('h2', {}, 'O que mais sobe a sua nota'), h('p', { class: 'muted peq' }, 'Ganho esperado em pontos por hora de estudo = questões esperadas do tópico × (1 − chance) × facilidade × 25%. O 25% (quanto 1 hora fecha do que falta) é uma suposição, não uma medida: use a ordem, não o valor exato.'),
      h('div', { class: 'rolagem-x' }, h('table', { class: 'tabela' }, h('thead', {}, h('tr', {}, ['#', 'Tópico', 'Chance', 'Ganho/h', ''].map(x => h('th', {}, x)))),
        h('tbody', {}, top.map((r, i) => h('tr', {}, h('td', {}, String(i + 1)), h('td', {}, h('a', { href: '#/topico/' + r.topicoId }, corta(App.nomeTopico(r.topicoId), 46)), h('div', { class: 'muted peq' }, (App.disciplina(r.disciplinaId) || {}).nome || '')), h('td', {}, pct(r.p), r.insuficiente ? h('div', { class: 'muted peq' }, 'poucos dados') : null), h('td', {}, '+' + num(r.ganhoHora, 2) + ' pts'), h('td', {}, h('a', { class: 'btn mini', href: '#/foco?t=' + r.topicoId }, 'Estudar')))))))));
  };
  const inicioOrig = V.inicio;
  V.inicio = async (alvo, r) => {
    await inicioOrig(alvo, r); if (!App.S.conc || !App.S.topicos.length || alvo.querySelector('[data-gemeo-inicio]')) return;
    try { const t = App.dadosGemeo().sim.total; const card = h('a', { class: 'cartao', 'data-gemeo-inicio': '1', href: '#/gemeo', style: 'display:block;text-decoration:none;color:inherit' }, h('div', { class: 'linha entre' }, h('h2', { style: 'margin:0' }, 'Gêmeo digital'), h('span', { class: 'chip ' + (t.insuficiente ? 'aviso' : 'azul') }, t.insuficiente ? 'dados insuficientes' : 'estimativa')),
      h('div', { class: 'linha', style: 'margin-top:6px;align-items:baseline' }, h('div', { class: 'numgrande' }, num(t.media)), h('div', { class: 'muted' }, 'de ' + num(t.max) + ' pontos · faixa de ' + num(t.lo) + ' a ' + num(t.hi))), h('div', { class: 'muted peq' }, 'Estimativa com ' + num(t.n, 0) + ' questões respondidas. Não prevê a prova. Toque para ver o girassol e o que mais sobe a sua nota.'));
      const ant = alvo.querySelector('[data-hoje-inicio]'); const h1 = alvo.querySelector('h1'); if (ant) ant.after(card); else if (h1) h1.after(card); else alvo.append(card); } catch (e) { console.warn('Gêmeo no início', e); }
  };

  // =====================================================================
  // 2. Agentes sintéticos
  // =====================================================================
  const VOCE = { id: 'voce', nome: 'Você (gêmeo)', theta: 0, chuteExtra: 0, tendencias: { conteudo: 0.3, reconhecer: 0.25, execucao: 0.2, leitura: 0.25 } };
  const PERFIS = L5.PERFIS.concat([VOCE]);
  // contexto para analisar questões: habilidade do aluno por tópico/disciplina, vinda do gêmeo
  App.contextoAgentes = () => {
    const hoje = App.hoje(); const modelos = L5.construirGemeo({ topicos: App.S.topicos, respostas: App.S.respostas, cartoes: App.S.cartoes, hoje, intervalo: false }); const rs = {}; App.S.respostas.filter(r => r.refTipo === 'questao').forEach(r => (rs[r.refId] = rs[r.refId] || []).push(r));
    const porDisc = {}; App.S.topicos.filter(App.ehFolha).forEach(t => { const m = modelos[t.id]; if (m) (porDisc[t.disciplinaId] = porDisc[t.disciplinaId] || []).push(m.p); }); const pDisc = (id) => { const v = porDisc[id] || []; return v.length ? v.reduce((a, b) => a + b, 0) / v.length : 0.4; };
    return { analisar(q) {
      const t = App.topico(q.topicoId); const dc = t ? App.disciplina(t.disciplinaId) : null; const c = 1 / Math.max(2, (q.alternativas || []).length || 2); const m = t && modelos[t.id]; const p = m ? m.p : (t ? pDisc(t.disciplinaId) : 0.4);
      return L5.analisarQuestao(q, { respostas: rs[q.id] || [], thetaAluno: L5.thetaDeP(p, c), discNome: dc ? dc.nome : '', thetaVoce: L5.thetaDeP(t ? pDisc(t.disciplinaId) : 0.4, c), perfis: PERFIS, agentesIA: q.agentesIA && q.agentesIA.total ? q.agentesIA : null });
    } };
  };
  const questoesValidas = () => App.S.questoes.filter(q => !q.revisar && q.gabarito && (q.alternativas || []).length >= 2);
  const NIVEL_CHIP = { provavel: ['ruim', 'pegadinha provável'], possivel: ['aviso', 'pegadinha possível'] };

  function cartaoAgentes(q, a, ia) {
    const alerta = NIVEL_CHIP[a.pegadinha.nivel];
    const linhas = a.perfis.map(p => h('tr', {}, h('td', {}, p.nome), h('td', {}, h('div', { class: 'barra' }, h('i', { style: 'width:' + Math.round(100 * p.p) + '%' }))), h('td', {}, pct(p.p))));
    return h('div', { class: 'cartao', 'data-agente-q': q.id },
      h('div', { class: 'linha entre' }, h('div', { class: 'tit', style: 'font-weight:600;overflow-wrap:anywhere;flex:1;min-width:200px' }, corta(q.enunciado, 160)), alerta ? h('span', { class: 'chip ' + alerta[0] }, alerta[1]) : null),
      h('div', { class: 'linha peq', style: 'margin:6px 0' }, [q.banca, q.ano].filter(Boolean).map(x => h('span', { class: 'chip' }, String(x))), h('span', { class: 'chip azul', title: 'Dificuldade estimada na escala do modelo (de −3 fácil a +3 difícil)' }, 'dificuldade ' + a.dificuldadeRotulo + ' (' + (a.b > 0 ? '+' : '') + num(a.b) + ' ± ' + num(a.dp) + ')'), h('span', { class: 'chip', title: 'Diferença de acerto entre o perfil Avançado e o Iniciante no modelo' }, 'discriminação ' + num(a.discriminacao, 2)), h('span', { class: 'chip' }, a.n ? 'suas respostas: ' + a.n : 'sem respostas suas'), a.insuficiente ? h('span', { class: 'chip aviso' }, 'poucos dados') : null),
      h('div', { class: 'rolagem-x' }, h('table', { class: 'tabela' }, h('thead', {}, h('tr', {}, ['Perfil', 'Taxa de acerto estimada', ''].map(x => h('th', {}, x)))), h('tbody', {}, linhas))),
      a.atrator ? h('div', { class: 'peq', style: 'margin-top:6px' }, 'A alternativa ', h('b', {}, a.atrator.letra), ' atrai cerca de ' + Math.round(100 * a.atrator.parte) + '% dos erros estimados.') : null,
      a.pegadinha.motivos.length ? h('ul', { class: 'peq', style: 'margin:6px 0 0' }, a.pegadinha.motivos.map(m => h('li', {}, m))) : null,
      ia && ia.total ? blocoIA(q) : null);
  }
  function blocoIA(q) {
    const ia = q.agentesIA; if (!ia || !ia.total) return null;
    return h('div', { class: 'afundado peq', style: 'margin-top:8px', 'data-agentes-ia': '1' }, h('div', {}, h('b', {}, 'Agentes de IA: '), ia.texto + '.'), (ia.rodadas || []).map(r => h('div', { class: r.correta ? 'muted' : '' }, (r.correta ? '✔ ' : '✘ ') + r.nome + ' marcou ' + r.letra + (r.motivo ? ': ' + r.motivo : ''))), ia.pegadinhaIA ? h('div', { style: 'margin-top:4px' }, h('span', { class: 'pegadinha' }, 'Por quê'), ' ' + ia.pegadinhaIA) : null, h('div', { class: 'muted' }, 'Simulado por IA' + (ia.modelo ? ' (' + ia.modelo + ')' : '') + ': pode errar, e não é um candidato de verdade.'));
  }
  const filtroAg = { so: 'alertas' };
  V.agentes = async (alvo) => {
    if (!App.exigeConcurso(alvo)) return; const c = App.S.conc; const qs = questoesValidas();
    alvo.append(h('h1', {}, 'Agentes sintéticos'), h('p', { class: 'muted' }, 'Candidatos simulados (Iniciante, Mediano, Avançado, Chutador, Leitor apressado e um que é você) respondem ao seu banco de questões por estatística. Serve para achar pegadinhas e ver quais questões separam quem sabe de quem não sabe.'));
    alvo.append(h('div', { class: 'cartao destaque', 'data-agentes-aviso': '1' }, h('b', {}, 'Estimativa, não medida. '), 'A dificuldade vem de um modelo de 3 parâmetros (TRI) calibrado só com as SUAS respostas e com os metadados da questão. A discriminação é a diferença entre o perfil avançado e o iniciante nesse modelo. Os perfis são inventados: não são pessoas reais e não preveem a prova. Com poucas respostas suas, leia "poucos dados" como "palpite".'));
    if (!qs.length) { alvo.append(h('div', { class: 'cartao vazio' }, App.vazioFig('sem-questoes'), h('p', {}, 'O banco ainda não tem questões com gabarito e alternativas.'), h('a', { class: 'btn p', href: '#/questoes?aba=importar' }, 'Importar questões'), ' ', h('a', { class: 'btn', href: '#/rajada' }, 'Gerar uma Rajada de 5'))); return; }
    const ctx = App.contextoAgentes(); const todas = qs.map(q => ({ q, a: ctx.analisar(q) })).filter(x => !x.a.semGabarito); const res = L5.resumoAgentes(todas.map(x => x.a));
    try { await DB.cfgSet('agentes-resumo:' + c.id, { em: Date.now(), analisadas: res.analisadas, provaveis: res.provaveis, possiveis: res.possiveis, comDadosDoAluno: res.comDadosDoAluno }); } catch (e) { /* o resumo salvo é só um registro */ }
    alvo.append(h('div', { class: 'cartao', 'data-agentes-resumo': '1' }, h('div', { class: 'linha' }, h('span', { class: 'chip azul' }, res.analisadas + ' questões analisadas'), h('span', { class: 'chip' }, res.comDadosDoAluno + ' com respostas suas'), h('span', { class: 'chip ' + (res.provaveis ? 'ruim' : 'ok') }, res.provaveis + ' pegadinhas prováveis'), h('span', { class: 'chip aviso' }, res.possiveis + ' possíveis'), h('span', { class: 'chip' }, 'discriminação média ' + num(res.discriminacaoMedia || 0, 2))),
      h('h3', {}, 'Taxa de acerto estimada por perfil'), App.barrasSVG(Object.values(res.porPerfil).map(p => ({ rot: p.nome, v: Math.round(100 * p.taxa) })), { sufixo: '%', max: 100, rotulo: 'Taxa de acerto por perfil' }),
      res.comDadosDoAluno < Math.max(3, res.analisadas * 0.3) ? h('div', { class: 'afundado peq', style: 'margin-top:8px' }, 'Dados insuficientes: poucas questões têm respostas suas. A dificuldade está quase toda no palpite dos metadados.') : null));
    // ---- agentes de IA
    const temIA = App.ia && App.ia.temIA(); const marc = new Set(['mediano', 'avancado', 'apressado']); const lim = h('input', { type: 'number', min: 1, max: 10, value: ls('doraDraw.agentes-lim', 6), style: 'width:80px', 'aria-label': 'Questões por rodada', 'data-ag-lim': '1' }); const estim = h('div', { class: 'muted peq', 'data-ag-estimativa': '1' });
    const pers = h('div', { class: 'linha' }, L5.PERFIS.map(p => h('label', { class: 'marca-op' }, h('input', { type: 'checkbox', 'data-persona': p.id, checked: marc.has(p.id), onchange: (e) => { e.target.checked ? marc.add(p.id) : marc.delete(p.id); conta(); } }), h('span', {}, p.nome))));
    const fila = () => { const n = Math.max(1, Math.min(10, +lim.value || 6)); const ordem = todas.slice().sort((x, y) => (x.q.agentesIA ? 1 : 0) - (y.q.agentesIA ? 1 : 0) || y.a.pegadinha.score - x.a.pegadinha.score); return ordem.slice(0, n).map(x => x.q); };
    const conta = () => { const n = fila().length, m = marc.size; estim.textContent = n + ' questões × ' + m + ' agentes = ' + n * m + ' chamadas' + (m ? ', mais até ' + Math.min(n, 5) + ' explicações de pegadinha' : '') + '. Começa pelas que ainda não rodaram e pelas de maior alerta.'; btn.disabled = !temIA || m < 2 || m > 5; };
    const btn = h('button', { class: 'btn p', type: 'button', 'data-rodar-ia': '1', onclick: () => rodarIA(btn) }, 'Rodar agentes com IA'); lim.addEventListener('input', () => { lsSet('doraDraw.agentes-lim', +lim.value || 6); conta(); });
    async function rodarIA(b) {
      const lista = fila(); const ids = [...marc]; const personas = L5.PERFIS.filter(p => ids.includes(p.id)); const chamadas = lista.length * personas.length;
      if (!(await App.confirmar('Vai fazer cerca de ' + chamadas + ' chamadas à IA (' + lista.length + ' questões × ' + personas.length + ' agentes, mais explicações). Isso gasta cota. Continuar?', 'Rodar', false))) return;
      let feitas = 0, explic = 0; try {
        for (const [i, q] of lista.entries()) {
          const rod = []; const letras = (q.alternativas || []).map(a => a.letra);
          for (const [j, p] of personas.entries()) { App.rodando(b, 'Questão ' + (i + 1) + ' de ' + lista.length + ' · agente ' + (j + 1) + ' de ' + personas.length); const pr = L5.promptAgente(p.persona, q); const r = await App.ia.chamar({ sistema: pr.sistema, prompt: pr.prompt, json: true }); const l = L5.lerRespostaAgente(L.extrairJSON(r.texto), letras); if (l) rod.push({ persona: p.id, nome: p.nome, letra: l.letra, motivo: l.motivo, modelo: r.modelo }); }
          const cons = L5.consolidarIA(q, rod); let porque = '';
          if (cons.nivel === 'pegadinha' && explic < 5) { App.rodando(b, 'Questão ' + (i + 1) + ' de ' + lista.length + ' · explicando a pegadinha'); try { const e = await App.ia.chamar({ sistema: 'Você é um professor experiente em concursos públicos brasileiros. Responda SOMENTE o JSON.', prompt: L5.promptExplicarPegadinha(q, cons), json: true }); const d = L.extrairJSON(e.texto); porque = String((d && (d.pegadinha || d.explicacao)) || '').slice(0, 500); explic++; } catch (er) { console.warn(er); } }
          q.agentesIA = Object.assign({}, cons, { em: Date.now(), pegadinhaIA: porque, modelo: rod.length ? rod[rod.length - 1].modelo : '' }); await App.salvar('questoes', q); feitas++;
        }
        App.toast(feitas + ' questões rodadas com agentes de IA.');
      } catch (er) { App.toast((feitas ? feitas + ' questões feitas e salvas. ' : '') + er.message, true); }
      App.render();
    }
    alvo.append(h('div', { class: 'cartao', 'data-agentes-ia-painel': '1' }, h('h2', {}, 'Rodar agentes com IA'), h('p', { class: 'muted peq' }, 'Pede a 2 a 5 "candidatos" com personalidades diferentes que respondam SEM ver o gabarito. Depois compara com o gabarito: se vários caem na mesma alternativa, a questão é marcada como pegadinha e a IA explica o porquê. O resultado fica salvo na questão.'), pers,
      h('div', { class: 'linha', style: 'margin-top:8px' }, h('label', { class: 'campo' }, h('span', {}, 'Questões nesta rodada (1 a 10)'), lim), btn), estim, !temIA ? h('div', { class: 'afundado peq' }, 'Sem IA configurada. Cole a chave ou o código da Guilda na ', h('a', { href: '#/ia' }, 'Dora Mentora'), '. A simulação estatística acima funciona sem IA.') : null)); conta();
    // ---- lista
    const seg = h('div', { class: 'seg', role: 'group', 'aria-label': 'Filtrar questões' }, [['alertas', 'Com alerta'], ['todas', 'Todas']].map(([k, n]) => h('button', { type: 'button', 'data-ag-filtro': k, 'aria-pressed': String(filtroAg.so === k), onclick: () => { filtroAg.so = k; App.render(); } }, n)));
    let vis = todas.slice().sort((x, y) => y.a.pegadinha.score - x.a.pegadinha.score || y.a.discriminacao - x.a.discriminacao); if (filtroAg.so === 'alertas') vis = vis.filter(x => x.a.pegadinha.nivel !== 'nenhum');
    alvo.append(h('div', { class: 'linha entre' }, h('h2', { style: 'margin:0' }, 'Questões'), seg), h('p', { class: 'muted peq' }, vis.length + ' de ' + todas.length + ' questões' + (vis.length > 40 ? ' (mostrando as 40 de maior alerta)' : '') + '.'));
    if (!vis.length) alvo.append(h('div', { class: 'cartao vazio' }, 'Nenhuma questão com alerta de pegadinha por enquanto. Responda mais questões (as suas respostas calibram o modelo) ou rode os agentes de IA.'));
    const col = h('div', { class: 'pilha' }); vis.slice(0, 40).forEach(x => col.append(cartaoAgentes(x.q, x.a, x.q.agentesIA))); alvo.append(col);
  };
  // nota na própria questão, depois de responder: "3 de 5 agentes caíram na alternativa C"
  const renderOrig = App.renderQuestao;
  App.renderQuestao = (item, op = {}) => {
    if (op.semGabarito) return renderOrig(item, op); let raiz = null;
    const mostra = () => { try { if (!raiz || raiz.querySelector('[data-agentes-q-nota]')) return; const ia = item.agentesIA && item.agentesIA.total ? item.agentesIA : null; const a = App.contextoAgentes().analisar(item); if (a.semGabarito) return; const alerta = a.pegadinha.nivel !== 'nenhum';
      if (!ia && !alerta) return; const caixa = h('div', { class: 'afundado peq', 'data-agentes-q-nota': '1', style: 'margin-top:8px' });
      if (ia) caixa.append(h('div', {}, h('b', {}, 'Agentes: '), ia.texto + '.'), item.agentesIA.pegadinhaIA ? h('div', {}, h('span', { class: 'pegadinha' }, 'Por quê'), ' ' + item.agentesIA.pegadinhaIA) : null);
      if (alerta) caixa.append(h('div', {}, h('b', {}, 'Alerta estatístico (estimativa): '), NIVEL_CHIP[a.pegadinha.nivel][1] + (a.atrator ? '; a alternativa ' + a.atrator.letra + ' atrai muitos erros' : '') + '. ' + a.pegadinha.motivos.slice(0, 2).join('; ') + '.'));
      raiz.append(caixa); } catch (e) { console.warn('Agentes na questão', e); } };
    raiz = renderOrig(item, Object.assign({}, op, { aoResponder: async (x) => { const r = op.aoResponder ? await op.aoResponder(x) : undefined; if (r !== false) setTimeout(mostra, 0); return r; } })); return raiz;
  };
  const raioxOrig = V.raiox;
  V.raiox = async (alvo, r) => {
    await raioxOrig(alvo, r); if (!App.S.conc || alvo.querySelector('[data-raiox-agentes]')) return;
    try { const qs = questoesValidas(); if (!qs.length) return; const ctx = App.contextoAgentes(); const an = qs.map(q => ({ q, a: ctx.analisar(q) })).filter(x => !x.a.semGabarito); const res = L5.resumoAgentes(an.map(x => x.a)); const top = an.filter(x => x.a.pegadinha.nivel !== 'nenhum').sort((x, y) => y.a.pegadinha.score - x.a.pegadinha.score).slice(0, 5); const rodadas = qs.filter(q => q.agentesIA && q.agentesIA.total).length;
      alvo.append(h('div', { class: 'cartao', 'data-raiox-agentes': '1' }, h('div', { class: 'linha entre' }, h('h2', { style: 'margin:0' }, 'Agentes sintéticos'), h('a', { class: 'btn mini p', href: '#/agentes' }, 'Abrir')), h('p', { class: 'muted peq' }, 'Candidatos simulados por estatística (estimativa) sobre as questões do banco' + (rodadas ? ' e ' + rodadas + ' questões já rodadas com agentes de IA' : '') + '.'),
        h('div', { class: 'linha' }, h('span', { class: 'chip ' + (res.provaveis ? 'ruim' : 'ok') }, res.provaveis + ' pegadinhas prováveis'), h('span', { class: 'chip aviso' }, res.possiveis + ' possíveis'), h('span', { class: 'chip' }, res.comDadosDoAluno + ' de ' + res.analisadas + ' com respostas suas')),
        top.length ? h('ul', { class: 'peq' }, top.map(x => h('li', {}, corta(x.q.enunciado, 90), ' ', h('span', { class: 'chip ' + NIVEL_CHIP[x.a.pegadinha.nivel][0] }, NIVEL_CHIP[x.a.pegadinha.nivel][1])))) : h('div', { class: 'muted peq' }, 'Nenhum alerta por enquanto.')));
    } catch (e) { console.warn('Agentes no Raio-X', e); }
  };

  // =====================================================================
  // 3. Transformar marcações
  // =====================================================================
  const sigApp = () => { const s = ls('doraDraw.marcSignificados', null); return Array.isArray(s) ? L5.SIGNIFICADOS.map((n, i) => s[i] || n) : L5.SIGNIFICADOS; };
  // junta grifos do leitor, textos da Dora Pena e marcações de páginas. alvo: { materialId } | { topicoId } | { tudo: true }
  App.coletarMarcas = async ({ materialId, topicoId, tudo } = {}) => {
    const c = App.S.conc; const mats = App.S.materiais; const matDe = (id) => mats.find(m => m.id === id);
    let grifos = [], marcacoes = [], penas = [];
    if (materialId) { grifos = await DB.porIndice('grifos', 'materialId', materialId); penas = (await DB.porIndice('penas', 'alvoId', materialId)).filter(p => p.tipo === 'pdf'); }
    else if (topicoId) { const ms = mats.filter(m => m.topicoId === topicoId).map(m => m.id); grifos = (await DB.porIndice('grifos', 'topicoId', topicoId)); for (const id of ms) for (const g of await DB.porIndice('grifos', 'materialId', id)) if (!grifos.some(x => x.id === g.id)) grifos.push(g); for (const id of ms) penas.push(...(await DB.porIndice('penas', 'alvoId', id)).filter(p => p.tipo === 'pdf')); try { marcacoes = (await DB.porIndice('marcacoes', 'concursoId', c.id)).filter(m => m.topicoId === topicoId); } catch (e) { /* sem a loja */ } }
    else { const ids = new Set(mats.map(m => m.id)); grifos = (await DB.todos('grifos')).filter(g => ids.has(g.materialId) || g.concursoId === c.id); for (const m of mats) penas.push(...(await DB.porIndice('penas', 'alvoId', m.id)).filter(p => p.tipo === 'pdf')); try { marcacoes = (await DB.porIndice('marcacoes', 'concursoId', c.id)); } catch (e) { /* sem a loja */ } }
    const a = L5.marcasDeGrifos(grifos, mats); a.forEach(m => { if (!m.topicoId && m.materialId) { const mt = matDe(m.materialId); if (mt) m.topicoId = mt.topicoId || null; } });
    const b = L5.marcasDeMarcacoes(marcacoes);
    const p = []; penas.forEach(doc => ((doc.dados && doc.dados.e) || []).filter(e => e.k === 't' && String(e.s || '').trim().length >= 4).forEach(e => { const mt = matDe(doc.alvoId); p.push({ id: 'pena-' + doc.id + '-' + e.id, texto: String(e.s).trim(), nota: '', cor: 3, pagina: +doc.chave || null, fonte: mt ? mt.nome : '', materialId: doc.alvoId, topicoId: mt ? mt.topicoId || null : null, favorito: false, tags: ['pena'], criado: doc.atualizado || 0 }); }));
    return a.concat(b, p);
  };
  App.transformarMarcacoes = async (alvoInfo = {}, titulo = '') => {
    if (!App.S.conc) { App.toast('Abra um concurso primeiro.', true); return; }
    const marcas = await App.coletarMarcas(alvoInfo); if (!marcas.length) { App.toast('Ainda não há marcações aqui. Grife trechos no leitor (ou anote com a Dora Pena) e volte.', true); return; }
    const mat = alvoInfo.materialId ? App.S.materiais.find(m => m.id === alvoInfo.materialId) : null; const top = alvoInfo.topicoId ? App.topico(alvoInfo.topicoId) : null;
    const tit = titulo || (mat ? mat.nome : top ? top.titulo : App.S.conc.nome); let m;
    const corpo = TU.montar({ h, L, marcas, titulo: tit, topicos: App.S.topicos, topico: App.topico, concursoId: App.S.conc.id, cartoesExistentes: App.S.cartoes.map(c => c.frente), significados: sigApp(), hoje: App.hoje(), sanitizar: App.E.sanitizar, toast: App.toast,
      salvarTopico: (t) => App.salvar('topicos', t), salvarCartao: (c) => App.salvar('cartoes', c), temIA: () => App.ia && App.ia.temIA(), ia: App.ia, rodando: App.rodando, irMapa: (id) => { if (m) m.fechar(); App.ir('topico/' + id + '?aba=mapa'); } });
    m = App.modal('Transformar marcações', corpo, { larga: true });
  };
  const btnTransformar = (info, rot) => h('button', { class: 'btn mini', type: 'button', 'data-transformar-btn': '1', title: 'Gera resumo, Dora Cartas e mapa mental a partir dos grifos e anotações', onclick: () => App.transformarMarcacoes(info) }, rot || 'Transformar marcações');
  const leitorOrig = V.leitor;
  V.leitor = async (alvo, r) => {
    await leitorOrig(alvo, r); const id = r.args[0]; if (!App.S.materiais.some(m => m.id === id)) return; const pena = alvo.querySelector('button[title^="Dora Pena"]'); const b = btnTransformar({ materialId: id });
    if (pena) pena.after(b); else { const barra = alvo.querySelector('.ferr'); if (barra) barra.append(b); }
  };
  const estanteOrig = V.estante;
  V.estante = async (alvo, r) => {
    await estanteOrig(alvo, r); if (!App.S.conc || !App.S.materiais.length) return;
    alvo.querySelectorAll('.grade > .cartao').forEach(cartao => { const a = cartao.querySelector('a[href^="#/leitor/"]'); if (!a || cartao.querySelector('[data-transformar-btn]')) return; const id = a.getAttribute('href').split('/').pop().split('?')[0]; a.parentElement.append(btnTransformar({ materialId: id })); });
    const grade = alvo.querySelector('.grade'); const lote = h('div', { class: 'cartao', 'data-transformar-lote': '1' }, h('div', { class: 'linha entre' }, h('div', {}, h('b', {}, 'Transformar marcações em estudo'), h('div', { class: 'muted peq' }, 'Resumo, Dora Cartas e mapa mental a partir dos seus grifos e anotações. Você vê a prévia e escolhe o que gravar.')), h('button', { class: 'btn', type: 'button', 'data-transformar-tudo': '1', onclick: () => App.transformarMarcacoes({ tudo: true }, App.S.conc.nome) }, 'Transformar todo o material do concurso')));
    if (grade) grade.before(lote); else alvo.append(lote);
  };
  const topicoOrig = V.topico;
  V.topico = async (alvo, r) => {
    await topicoOrig(alvo, r); if (r.query.aba !== 'materiais') return; const t = App.topico(r.args[0]); if (!t) return;
    const cartao = [...alvo.querySelectorAll('.cartao')].find(x => /Grifos deste tópico/.test((x.querySelector('h3') || {}).textContent || '')); if (cartao && !cartao.querySelector('[data-transformar-btn]')) cartao.append(h('div', { class: 'linha', style: 'margin-top:8px' }, btnTransformar({ topicoId: t.id }, 'Transformar marcações deste tópico')));
  };
})();
