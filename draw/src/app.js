/* Dora Draw — núcleo do app: estado, atalhos, rotas, menu, janelas e registro de respostas. As telas ficam em v-*.js. */
(function () {
  const L = window.DoraLogica, DB = window.DoraDB, E = window.DoraEditores, h = E.h;
  const App = window.App = { L, DB, E, h, views: {}, S: { concursos: [], conc: null }, ia: window.DoraIA };
  const VAZIO = () => ({ simulados: [], disciplinas: [], topicos: [], cartoes: [], questoes: [], cadernos: [], respostas: [], erros: [], materiais: [], sessoes: [], capturas: [] });
  Object.assign(App.S, VAZIO());
  const ehExt = !!(window.chrome && chrome.runtime && chrome.runtime.id); App.ehExt = ehExt;

  // ---------- utilidades ----------
  App.hoje = () => L.diaLocal();
  App.esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  App.fmtData = (d) => d ? d.split('-').reverse().join('/') : '';
  App.min = (m) => m >= 60 ? Math.floor(m / 60) + ' h ' + (m % 60 ? String(m % 60).padStart(2, '0') + ' min' : '') : m + ' min';
  App.toast = (msg, erro) => { const el = h('div', { class: 'aviso' + (erro ? ' erro' : ''), role: erro ? 'alert' : 'status' }, msg); $('#avisos').append(el); setTimeout(() => el.remove(), erro ? 7000 : 3200); };
  const $ = (s, r = document) => r.querySelector(s); App.$ = $;
  App.modal = (titulo, conteudo, op = {}) => {
    const d = h('dialog', { class: op.larga ? 'larga' : '' });
    const fechar = () => { try { d.close(); } catch (e) { /* já fechado */ } };
    d.append(h('div', { class: 'linha entre' }, h('h2', { style: 'margin:0' }, titulo), h('button', { class: 'btn mini', type: 'button', 'aria-label': 'Fechar', onclick: fechar }, 'Fechar')), h('div', { style: 'margin-top:12px' }, conteudo));
    d.addEventListener('close', () => { if (op.aoFechar) op.aoFechar(); d.remove(); }); document.body.append(d); d.showModal(); return { fechar, el: d };
  };
  App.confirmar = (msg, rotulo = 'Confirmar', perigo = true) => new Promise(res => {
    let ok = false; const m = App.modal('Confirmar', h('div', { class: 'pilha' }, h('p', {}, msg), h('div', { class: 'linha' }, h('button', { class: 'btn' + (perigo ? ' perigo' : ' p'), onclick: () => { ok = true; m.fechar(); } }, rotulo), h('button', { class: 'btn', onclick: () => m.fechar() }, 'Cancelar'))), { aoFechar: () => res(ok) });
  });
  App.pedir = (titulo, rotulo, valor = '', multi = false) => new Promise(res => {
    let v = null; const inp = multi ? h('textarea', {}, valor) : h('input', { type: 'text', value: valor }); const m = App.modal(titulo, h('div', { class: 'pilha' }, h('label', { class: 'campo' }, h('span', {}, rotulo), inp), h('div', { class: 'linha' }, h('button', { class: 'btn p', onclick: () => { v = inp.value.trim(); m.fechar(); } }, 'Salvar'), h('button', { class: 'btn', onclick: () => m.fechar() }, 'Cancelar'))), { aoFechar: () => res(v) });
    if (!multi) inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') { v = inp.value.trim(); m.fechar(); } }); setTimeout(() => inp.focus(), 30);
  });
  const baixar = (nome, conteudo, tipo) => { const b = conteudo instanceof Blob ? conteudo : new Blob([conteudo], { type: tipo || 'text/plain;charset=utf-8' }); const a = h('a', { href: URL.createObjectURL(b), download: nome }); document.body.append(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500); };
  App.baixar = baixar;
  const ICO = {
    inicio: 'M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z', conc: 'M5 21V4m0 0h11l-2 4 2 4H5', edital: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01', estudar: 'M4 8h13v12H4zM8 8V4h13v12h-4',
    erros: 'M12 3l10 18H2zM12 10v5M12 18h.01', questoes: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 1-1 1.7M12 17h.01', estante: 'M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 21h15',
    plano: 'M4 6h16v15H4zM4 10h16M8 3v4M16 3v4', stats: 'M4 20V10M10 20V4M16 20v-8M22 20H2', simulados: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2', ia: 'M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z',
    ajustes: 'M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M14 4v4M8 10v4M16 16v4', mais: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z', discursivas: 'M4 20l4-1L20 7l-3-3L5 16zM14 6l3 3', revisoes: 'M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5', ciclo: 'M17 2l4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4M21 13v2a3 3 0 0 1-3 3H3', cofre: 'M6 11V8a6 6 0 0 1 12 0v3M4 11h16v10H4zM12 15v2', estruturas: 'M3 8l9-5 9 5-9 5zM3 8v8l9 5 9-5V8', mural: 'M3 4h18v12H3zM8 20h8M12 16v4'
  };
  Object.assign(ICO, { vertical: 'M5 3v18M5 6h6M5 12h10M5 18h8M15 6h6M19 12h2M17 18h4', raiox: 'M3 12s3.5-7 9-7 9 7 9 7-3.5 7-9 7-9-7-9-7zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', rajada: 'M13 2L4 14h7l-1 8 9-12h-7z', escriba: 'M4 20l4-1L20 7l-3-3L5 16zM14 6l3 3M4 22h16', guilda: 'M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5zM12 8v6M9 11h6', salao: 'M3 21h18M5 21V9l7-5 7 5v12M10 21v-6h4v6', radio: 'M4 9h16v11H4zM8 9l8-5M8 14h2M14 13a2 2 0 1 0 4 0 2 2 0 0 0-4 0z', mural: 'M4 4h16v13l-5 5H4zM15 22v-5h5M8 9h8M8 13h5' });
  const svgIco = (n) => { const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('aria-hidden', 'true'); const p = document.createElementNS('http://www.w3.org/2000/svg', 'path'); p.setAttribute('d', ICO[n] || ICO.mais); s.append(p); return s; };
  App.ico = svgIco;
  App.tile = (n, cls = '') => h('span', { class: 'ico-tile ' + cls }, svgIco(n));

  // ---------- dados ----------
  App.carregarConcurso = async (id) => {
    App.S.concursos = (await DB.todos('concursos')).sort((a, b) => (a.criado || 0) - (b.criado || 0));
    let c = App.S.concursos.find(x => x.id === id) || App.S.concursos.find(x => x.id === (localStorage.getItem('doraDraw.conc') || '')) || App.S.concursos[0] || null;
    App.S.conc = c; Object.assign(App.S, VAZIO());
    if (c) { localStorage.setItem('doraDraw.conc', c.id); const por = (l) => DB.porIndice(l, 'concursoId', c.id); const [a, b, d, e, f, g, i, j, k, m] = await Promise.all(['disciplinas', 'topicos', 'cartoes', 'questoes', 'cadernos', 'respostas', 'erros', 'materiais', 'sessoes', 'capturas', 'simulados'].map(por)); Object.assign(App.S, { simulados: (await por('simulados')).sort((x, y) => (x.data || '').localeCompare(y.data || '')), disciplinas: a.sort((x, y) => x.ordem - y.ordem), topicos: b, cartoes: d, questoes: e, cadernos: f, respostas: g, erros: i, materiais: j, sessoes: k, capturas: m }); }
    App.S.capturasSemConcurso = (await DB.todos('capturas')).filter(x => !x.concursoId);
    return c;
  };
  const LISTA = { disciplinas: 'disciplinas', topicos: 'topicos', cartoes: 'cartoes', questoes: 'questoes', cadernos: 'cadernos', respostas: 'respostas', erros: 'erros', materiais: 'materiais', sessoes: 'sessoes', capturas: 'capturas', simulados: 'simulados' };
  App.salvar = async (loja, obj) => {
    if (loja === 'concursos') { const i = App.S.concursos.findIndex(x => x.id === obj.id); if (i < 0) App.S.concursos.push(obj); else App.S.concursos[i] = obj; if (App.S.conc && App.S.conc.id === obj.id) App.S.conc = obj; }
    else if (LISTA[loja]) { const arr = App.S[loja]; const i = arr.findIndex(x => x.id === obj.id); if (i < 0) arr.push(obj); else arr[i] = obj; }
    await DB.put(loja, obj); return obj;
  };
  App.remover = async (loja, id) => { if (LISTA[loja]) App.S[loja] = App.S[loja].filter(x => x.id !== id); await DB.del(loja, id); };
  App.novoId = L.uid;
  App.topico = (id) => App.S.topicos.find(t => t.id === id);
  App.disciplina = (id) => App.S.disciplinas.find(d => d.id === id);
  App.nomeTopico = (id) => { const t = App.topico(id); return t ? t.titulo : '(sem tópico)'; };
  App.filhos = (id) => App.S.topicos.filter(t => t.paiId === id).sort((a, b) => a.ordem - b.ordem);
  App.arvore = (discId) => { const out = []; const visita = (paiId, nivel) => App.S.topicos.filter(t => t.disciplinaId === discId && (t.paiId || null) === paiId).sort((a, b) => a.ordem - b.ordem).forEach(t => { out.push({ t, nivel }); visita(t.id, nivel + 1); }); visita(null, 0); return out; };
  App.ehFolha = (t) => !App.S.topicos.some(o => o.paiId === t.id);
  App.provaData = () => (App.S.conc && App.S.conc.dataProva) || null;
  App.notaDe = (t) => L.notaTopico({ respostas: App.S.respostas.filter(r => r.topicoId === t.id), cartoes: App.S.cartoes.filter(c => c.topicoId === t.id), dominio: t.dominio, ultEstudo: t.ultEstudo, proxRev: t.proxRev }, App.hoje());
  App.mapaNotas = () => { const m = {}; App.S.topicos.forEach(t => { const n = App.notaDe(t); m[t.id] = n.temDado ? n.nota : (t.dominio != null ? t.dominio : null); }); return m; };
  App.prioridades = () => L.prioridades({ disciplinas: App.S.disciplinas, topicos: App.S.topicos, notas: App.mapaNotas(), hoje: App.hoje(), provaData: App.provaData() });
  App.recalcTopico = async (id) => { const t = App.topico(id); if (!t) return; const n = App.notaDe(t); t.nota = n.temDado ? n.nota : null; if (t.ultEstudo) t.proxRev = L.proximaRevisao(t.ultEstudo, n.nota, t.dificuldade, App.provaData()); await App.salvar('topicos', t); };
  App.marcarEstudo = async (id) => { const t = App.topico(id); if (!t) return; t.ultEstudo = App.hoje(); await App.recalcTopico(id); };
  App.pillNota = (n) => h('span', { class: 'nota-pill ' + (n == null ? '' : n >= 75 ? 'b' : n >= 50 ? 'm' : 'r'), title: 'Nota do tópico (0 a 100)' }, n == null ? '—' : String(n));
  App.cartoesDevidos = () => App.S.cartoes.filter(c => L.cartaoDevido(c, App.hoje()));
  App.errosAtivos = () => App.S.erros.filter(e => !e.resolvido);

  // registra a resposta a uma questão/Dora Carta: histórico, diário de erros, repetição espaçada e nota do tópico
  App.registrarResposta = async ({ refTipo, item, escolha, confianca, ms }) => {
    const hoje = App.hoje(); const correta = !!item.gabarito && escolha === item.gabarito; const topicoId = item.topicoId || null; const concursoId = App.S.conc.id;
    const r = { id: L.uid('r'), concursoId, topicoId, refTipo, refId: item.id, ts: Date.now(), dia: hoje, correta, confianca, ms, escolha }; await App.salvar('respostas', r);
    const ref = { id: L.uid('er'), refTipo, refId: item.id, topicoId, concursoId, resumo: String(item.enunciado || item.frente || '').slice(0, 140) };
    const antes = App.S.erros; const res = L.atualizarDiario(antes, ref, { correta, confianca, ms, alvoMs: 120000 }, hoje); App.S.erros = res.entradas;
    for (const e of res.entradas) if (!antes.includes(e)) await DB.put('erros', e);
    let novo = Object.assign({}, item); novo.feitas = (item.feitas || 0) + 1; novo.acertos = (item.acertos || 0) + (correta ? 1 : 0); novo.ult = hoje;
    if (refTipo === 'cartao') novo = L.sm2(novo, L.respostaDeQuestao(correta, confianca, ms > 180000), hoje);
    await App.salvar(refTipo === 'cartao' ? 'cartoes' : 'questoes', novo);
    if (topicoId) await App.marcarEstudo(topicoId);
    return { correta, evento: res.evento, item: novo };
  };

  // desenho de rascunho ligado a um cartão
  App.abrirRascunho = (item, loja) => {
    const area = h('div'); let dados = item.rascunho || null; let ed;
    const m = App.modal('Dora Rascunho', area, { larga: true, aoFechar: async () => { if (ed) ed.sair(); const novo = Object.assign({}, item, { rascunho: dados }); Object.assign(item, novo); await App.salvar(loja, novo); } });
    ed = E.editorQuadro(area, dados, (d) => { dados = d; }, App.toast, baixar);
  };

  // ---------- questão (usada em estudo, banco, simulado) ----------
  App.renderQuestao = (item, op = {}) => {
    const t0 = Date.now(); let escolha = null; let travada = false; const raiz = h('div', { class: 'pilha' });
    const altBtns = []; const confBox = h('div', { class: 'oculto' }); const fim = h('div');
    const alts = item.alternativas && item.alternativas.length ? item.alternativas : [{ letra: 'C', texto: 'Certo' }, { letra: 'E', texto: 'Errado' }];
    const escolher = (letra) => { if (travada) return; escolha = letra; altBtns.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.l === letra))); if (op.semConfianca) { enviar(null); } else confBox.classList.remove('oculto'); };
    alts.forEach(a => { const b = h('button', { type: 'button', class: 'alt', 'data-l': a.letra, 'aria-pressed': 'false', onclick: () => escolher(a.letra) }, h('b', {}, a.letra), h('span', {}, a.texto)); altBtns.push(b); });
    async function enviar(conf) {
      if (travada || !escolha) return; travada = true; const ms = Date.now() - t0; confBox.classList.add('oculto');
      if (op.aoResponder) { const r = await op.aoResponder({ escolha, confianca: conf, ms }); if (r === false) { travada = false; return; } }
      if (!op.semGabarito) altBtns.forEach(b => { b.disabled = true; if (b.dataset.l === item.gabarito) b.classList.add('certa'); else if (b.dataset.l === escolha) b.classList.add('errada'); });
      const expl = item.explicacao || item.comentario; const acertou = escolha === item.gabarito;
      if (!op.semGabarito) fim.append(h('div', { class: 'afundado' }, h('p', {}, h('b', {}, !item.gabarito ? 'Esta questão está sem gabarito. Edite-a para conferir.' : acertou ? 'Você acertou.' : 'Você marcou ' + escolha + '. O gabarito é ' + item.gabarito + '.')), item.pegadinha ? h('p', {}, h('span', { class: 'pegadinha' }, 'Pegadinha'), ' ', item.pegadinha) : null, expl ? h('div', { class: 'verso' }, expl) : null));
      const ac = h('div', { class: 'linha', style: 'margin-top:10px' });
      if (op.rascunhoLoja) ac.append(h('button', { class: 'btn mini', onclick: () => App.abrirRascunho(item, op.rascunhoLoja) }, 'Dora Rascunho'));
      if (!op.semGabarito && App.ia && (App.ia.temChave('gemini') || App.ia.temChave('claude'))) ac.append(h('button', { class: 'btn mini', onclick: async (ev) => { ev.target.disabled = true; ev.target.textContent = 'Pensando...'; try { const r = await App.ia.tarefas.explicarQuestao(item); fim.append(App.cartaoExplicacao(r.dados, r.modelo)); ev.target.remove(); } catch (er) { App.toast(er.message, true); ev.target.disabled = false; ev.target.textContent = 'Explicar com a IA'; } } }, 'Explicar com a IA'));
      if (op.aoContinuar) ac.append(h('button', { class: 'btn p', onclick: op.aoContinuar }, op.rotuloContinuar || 'Continuar'));
      fim.append(ac);
    }
    const meta = [item.banca, item.ano, item.orgao, item.assunto].filter(Boolean); if (op.titulo) raiz.append(h('div', { class: 'rotulo' }, op.titulo));
    if (meta.length) raiz.append(h('div', { class: 'linha' }, meta.map(x => h('span', { class: 'chip azul' }, String(x)))));
    raiz.append(h('div', { class: 'q-enunciado' }, item.enunciado || ''), h('div', {}, altBtns));
    confBox.append(h('div', { class: 'rotulo', style: 'margin-bottom:6px' }, 'Como você se sentiu?'), h('div', { class: 'linha' }, [['certeza', 'Tenho certeza'], ['duvida', 'Fiquei em dúvida'], ['chute', 'Foi chute']].map(([k, n]) => h('button', { class: 'btn' + (k === 'certeza' ? ' p' : ''), onclick: () => enviar(k) }, n))));
    raiz.append(confBox, fim); return raiz;
  };
  App.cartaoExplicacao = (d, modelo) => {
    const li = (a) => h('ul', {}, (a || []).map(x => h('li', {}, String(x)))); const er = d.porQueErradas ? Object.keys(d.porQueErradas).map(k => h('li', {}, h('b', {}, k + ') '), String(d.porQueErradas[k]))) : [];
    return h('div', { class: 'cartao destaque' }, h('h3', {}, 'Explicação da IA'), h('p', {}, h('b', {}, 'Tipo: '), d.tipo || ''), h('p', {}, h('b', {}, 'Sinal no enunciado: '), d.sinal || ''), h('p', { style: 'margin-bottom:0' }, h('b', {}, 'Passos')), li(d.passos), d.pegadinha ? h('p', {}, h('span', { class: 'pegadinha' }, 'Pegadinha'), ' ' + d.pegadinha) : null, er.length ? h('div', {}, h('b', {}, 'Por que as outras estão erradas'), h('ul', {}, er)) : null, h('p', { class: 'muted peq' }, 'Modelo: ' + modelo + '. A IA pode errar: confira com o gabarito e com a matéria.'));
  };

  // ---------- rotas e menu ----------
  const MENU = [['inicio', 'Início'], ['concursos', 'Concursos'], ['edital', 'Dora Edital'], ['vertical', 'Dora Vertical'], ['estudar', 'Estudar'], ['erros', 'Diário de Batalha'], ['questoes', 'Questões'], ['raiox', 'Raio-X da Banca'], ['rajada', 'Rajada'], ['estante', 'Estante'], ['foco', 'Dora Foco'], ['radio', 'Rádio Foco'], ['revisoes', 'Dora Revisões'], ['ciclo', 'Dora Ciclo'], ['agenda', 'Dora Agenda'], ['simulados', 'Diário de Simulados'], ['estatisticas', 'Estatísticas'], ['discursivas', 'Discursivas'], ['escriba', 'Dora Escriba'], ['mural', 'Mural da Guilda'], ['guilda', 'Guilda'], ['salao', 'Salão da Guilda'], ['estruturas', 'Estruturas da Guilda'], ['ia', 'Dora Mentora'], ['cofre', 'Dora Cofre'], ['ajustes', 'Ajustes']];
  const ICONE_DE = { estatisticas: 'stats', concursos: 'conc', foco: 'simulados', agenda: 'plano' };
  const RAPIDO = [['inicio', 'Início'], ['edital', 'Edital'], ['estudar', 'Estudar'], ['erros', 'Erros'], ['mais', 'Mais']];
  App.rota = () => { const [cam, q] = (location.hash.replace(/^#\/?/, '') || 'inicio').split('?'); const [nome, ...args] = cam.split('/'); const query = {}; (q || '').split('&').filter(Boolean).forEach(p => { const [k, v] = p.split('='); query[k] = decodeURIComponent(v || ''); }); return { nome: nome || 'inicio', args, query }; };
  App.ir = (hash) => { if (location.hash === '#/' + hash) App.render(); else location.hash = '#/' + hash; };
  App.limpezas = [];
  App.aoSair = (fn) => App.limpezas.push(fn);
  App.render = async () => {
    App.limpezas.splice(0).forEach(f => { try { f(); } catch (e) { /* ignora */ } });
    const r = App.rota(); const nome = r.nome; const alvo = $('#principal'); const sup = alvo.scrollTop; alvo.replaceChildren();
    const v = App.views[nome] || App.views.inicio; menu(nome === 'topico' ? 'edital' : nome === 'leitor' ? 'estante' : nome);
    try { await v(alvo, r); } catch (e) { console.error(e); alvo.append(h('div', { class: 'cartao' }, h('h2', {}, 'Algo deu errado nesta tela'), h('p', {}, e.message), h('button', { class: 'btn', onclick: () => App.ir('inicio') }, 'Voltar ao início'))); }
    window.scrollTo(0, 0);
  };
  function menu(atual) {
    const lat = $('#lateral'); lat.replaceChildren(h('div', { class: 'marca' }, h('img', { src: 'icones/icone-48.png', alt: '' }), h('span', {}, 'Dora Draw')));
    lat.append(App.seletorConcurso()); if (App.seletorPerfil) lat.append(App.seletorPerfil());
    MENU.filter(m => !App.escondido || !App.escondido(m[0])).forEach(([k, n]) => lat.append(h('a', { class: 'nav-item', href: '#/' + k, 'aria-current': atual === k ? 'page' : null }, svgIco(ICONE_DE[k] || k), n)));
    const bx = $('#baixo'); bx.replaceChildren(...RAPIDO.map(([k, n]) => h('button', { type: 'button', 'aria-current': (atual === k || (k === 'mais' && !RAPIDO.some(x => x[0] === atual))) ? 'page' : null, onclick: () => App.ir(k) }, svgIco(k), n)));
  }
  App.seletorConcurso = () => {
    if (!App.S.concursos.length) return h('div', { class: 'muted peq seletor-conc' }, 'Nenhum concurso ainda.');
    return h('label', { class: 'campo seletor-conc' }, h('span', {}, 'Concurso'), h('select', { 'aria-label': 'Concurso atual', onchange: async (e) => { await App.carregarConcurso(e.target.value); App.render(); } }, App.S.concursos.map(c => h('option', Object.assign({ value: c.id }, App.S.conc && c.id === App.S.conc.id ? { selected: true } : {}), c.nome))));
  };
  App.views.mais = (alvo) => {
    alvo.append(h('h1', {}, 'Mais'), h('div', { class: 'cartao' }, h('ul', { class: 'k3d-grade' }, MENU.filter(m => !['inicio', 'edital', 'estudar', 'erros'].includes(m[0]) && !(App.escondido && App.escondido(m[0]))).map(([k, n], i) => h('li', {}, h('a', { class: 'k3d-ladrilho', href: '#/' + k }, h('span', { class: 'k3d-ico ' + ['', 'k3d-memoria', 'k3d-acompanhar', 'k3d-apoio'][i % 4] }, svgIco(ICONE_DE[k] || k)), h('span', { class: 'k3d-nome' }, n)))))));
  };
  // exige concurso aberto; senão mostra convite
  App.exigeConcurso = (alvo, texto) => { if (App.S.conc) return true; alvo.append(h('div', { class: 'cartao destaque vazio' }, h('h2', {}, 'Crie ou escolha um concurso'), h('p', {}, texto || 'Tudo no Dora Draw fica dentro de um concurso.'), h('a', { class: 'btn p', href: '#/concursos' }, 'Ir para Concursos'))); return false; };
  App.exigeEdital = (alvo) => { if (!App.exigeConcurso(alvo)) return false; if (App.S.topicos.length) return true; alvo.append(h('div', { class: 'cartao destaque vazio' }, h('h2', {}, 'Falta montar o edital'), h('p', {}, 'Cole o texto do edital e o app propõe as disciplinas e os tópicos.'), h('a', { class: 'btn p', href: '#/edital' }, 'Montar o edital'))); return false; };
  App.selTopico = (valorId, aoMudar, comVazio = true, rotulo = 'Tópico') => {
    const s = h('select', { 'aria-label': rotulo, onchange: (e) => aoMudar(e.target.value || null) }); if (comVazio) s.append(h('option', { value: '' }, '(nenhum)'));
    App.S.disciplinas.forEach(d => { const g = h('optgroup', { label: d.nome }); App.arvore(d.id).forEach(({ t, nivel }) => g.append(h('option', Object.assign({ value: t.id }, t.id === valorId ? { selected: true } : {}), ' '.repeat(nivel) + t.titulo))); s.append(g); }); return s;
  };
  // atualiza quando a extensão grava no banco (captura)
  try { const canal = new BroadcastChannel('dora-draw'); let tm = null; canal.onmessage = (m) => { if (!m.data || !['capturas', 'topicos', 'cartoes', 'questoes', 'sessoes', 'concursos'].includes(m.data.loja)) return; clearTimeout(tm); tm = setTimeout(async () => { if (App.ocupado) return; await App.carregarConcurso(App.S.conc && App.S.conc.id); if (['inicio', 'estudar'].includes(App.rota().nome)) App.render(); }, 400); }; } catch (e) { /* sem canal */ }
  window.addEventListener('hashchange', () => App.render());
})();
