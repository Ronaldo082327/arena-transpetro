/* Dora Draw — tela "Dora Estúdio" (#/estudio). Obra original; código 100% próprio.
   O aluno escolhe a fonte (um PDF, um tópico, uma disciplina ou todo o material do concurso), o tipo de artefato e, se quiser,
   um pedido livre. A Dora acha os trechos certos NO PRÓPRIO APARELHO (índice BM25 da logica6.js, guardado na loja `rag` do IndexedDB),
   manda SÓ esses trechos para a IA (App.ia.chamar: chave própria ou porteiro, com tarefa:'estudio') e entrega o resultado no app:
   resumo (nota do tópico), mapa mental (editor existente), Dora Cartas, questões no estilo da banca, infográfico (desenhado pelo app)
   e página interativa (isolada em <iframe sandbox="allow-scripts"> sem allow-same-origin, com CSP própria e HTML saneado).
   Nada é gravado antes do botão de salvar. Todo artefato cita as fontes (material + página) e traz a marca "Criado pela Dora".
   Sem IA: as opções de IA ficam desligadas com explicação; "Ver os trechos" e "Transformar marcações" continuam funcionando.
   Lógica pura e testada: logica6.js (testes\estudio.test.js). Embrulha V.topico, V.estante e V.leitor chamando a original primeiro. */
(function () {
  const App = window.App, { L, h, DB } = App, V = App.views, L6 = window.DoraLogica6, L5 = window.DoraLogica5;
  const ls = (k, p) => { try { const v = localStorage.getItem(k); return v == null ? p : JSON.parse(v); } catch (e) { return p; } };
  const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* sem armazenamento */ } };
  const pausa = () => new Promise(r => setTimeout(r, 0));
  const temIA = () => !!(App.ia && App.ia.temIA());

  // menu: "Dora Estúdio" logo depois da Estante
  const MENU = App.MENU; if (!MENU.some(m => m[0] === 'estudio')) { const i = MENU.findIndex(m => m[0] === 'estante'); MENU.splice(i >= 0 ? i + 1 : MENU.length, 0, ['estudio', 'Dora Estúdio']); }

  // =====================================================================
  // 1. Índice no aparelho (loja `rag`: um registro por fonte)
  // =====================================================================
  const E6 = App.estudio = { idx: null, conc: null, sincronizando: null, ultimo: null };
  const idReg = (cid, fonteId) => 'rag:' + cid + ':' + fonteId;
  E6.carregarIndice = async () => {
    const c = App.S.conc; if (!c) return null; if (E6.idx && E6.conc === c.id) return E6.idx;
    const regs = await DB.porIndice('rag', 'concursoId', c.id); E6.idx = L6.criarIndice(regs); E6.conc = c.id; return E6.idx;
  };
  // tudo o que pode entrar no índice deste concurso: PDFs (texto por página), notas, grifos, marcações e cartas
  E6.fontes = async () => {
    const c = App.S.conc; const ids = new Set(App.S.materiais.map(m => m.id));
    const grifos = (await DB.todos('grifos')).filter(g => ids.has(g.materialId) || g.concursoId === c.id);
    let marcacoes = []; try { marcacoes = await DB.porIndice('marcacoes', 'concursoId', c.id); } catch (e) { /* loja vazia no site */ }
    return L6.fontesDoConcurso({ materiais: App.S.materiais, topicos: App.S.topicos, grifos, cartoes: App.S.cartoes, marcacoes });
  };
  // refaz só as fontes que mudaram (assinatura diferente) e apaga as que sumiram. prog(feitas, total, nome)
  E6.sincronizar = async (prog) => {
    if (E6.sincronizando) return E6.sincronizando;
    E6.sincronizando = (async () => {
      const c = App.S.conc; if (!c) return null; const idx = await E6.carregarIndice(); const fs = await E6.fontes(); const plano = L6.planoSincronia(idx, fs); let i = 0;
      for (const f of plano.refazer) { if (prog) prog(i, plano.refazer.length, f.nome); const reg = Object.assign({ id: idReg(c.id, f.fonteId), concursoId: c.id, atualizado: Date.now() }, L6.indexarFonte(f)); await DB.put('rag', reg); L6.adicionarRegistro(idx, reg); i++; await pausa(); }
      if (plano.remover.length) { await DB.delMuitos('rag', plano.remover.map(id => idReg(c.id, id))); plano.remover.forEach(id => L6.removerFonte(idx, id)); }
      E6.ultimo = Date.now(); return { refeitas: plano.refazer.length, removidas: plano.remover.length, resumo: L6.resumoIndice(idx) };
    })();
    try { return await E6.sincronizando; } finally { E6.sincronizando = null; }
  };
  // material adicionado ou removido (Estante): atualiza o índice em segundo plano, sem travar a tela
  let tmSinc = null; const agendar = () => { clearTimeout(tmSinc); tmSinc = setTimeout(() => { if (!App.S.conc) return; E6.sincronizar().catch(e => console.warn('Dora Estúdio: índice', e)); }, 2500); };
  const salvarOrig = App.salvar, removerOrig = App.remover;
  App.salvar = async (loja, obj) => { const r = await salvarOrig(loja, obj); if (loja === 'materiais') agendar(); return r; };
  App.remover = async (loja, id) => { const r = await removerOrig(loja, id); if (loja === 'materiais') agendar(); return r; };
  // troca de concurso: o índice em memória é o do concurso aberto
  const carregarOrig = App.carregarConcurso; App.carregarConcurso = async (id) => { const c = await carregarOrig(id); if (!c || c.id !== E6.conc) { E6.idx = null; E6.conc = null; } return c; };

  // =====================================================================
  // 2. Busca e seleção dos trechos
  // =====================================================================
  const nomeEscopo = (e) => { if (!e) return ''; if (e.tipo === 'material') { const m = App.S.materiais.find(x => x.id === e.id); return m ? m.nome : 'PDF'; } if (e.tipo === 'topico') return App.nomeTopico(e.id); if (e.tipo === 'disciplina') { const d = App.disciplina(e.id); return d ? d.nome : 'Disciplina'; } return 'Todo o material de ' + ((App.S.conc && App.S.conc.nome) || 'concurso'); };
  // o pedido do aluno pesa mais; nomes do tópico/disciplina/PDF ajudam um pouco; termos sugeridos pela IA pesam metade
  const consultaDe = ({ escopo, pedido, extras = [] }) => { const q = [{ texto: pedido, peso: 1 }]; if (escopo.tipo === 'topico') q.push({ texto: App.nomeTopico(escopo.id), peso: 0.6 }); if (escopo.tipo === 'disciplina') q.push({ texto: nomeEscopo(escopo), peso: 0.4 }); extras.forEach(t => q.push({ texto: t, peso: 0.5 })); return q; };
  E6.selecionar = async ({ escopo, pedido = '', extras = [], orcamento = 20000 }) => {
    const idx = await E6.carregarIndice(); const filtro = L6.filtroDoEscopo(escopo, App.S.topicos);
    const res = L6.buscar(idx, consultaDe({ escopo, pedido, extras }), { filtro, limite: 0 });
    return L6.selecionarTrechos(res, { orcamento, maxPorFonte: escopo.tipo === 'material' ? 0 : 8, encher: escopo.tipo === 'material' || escopo.tipo === 'topico' });
  };
  // tópico onde o resultado é gravado: o do escopo; senão o do PDF; senão o mais comum entre os trechos
  const destinoPadrao = (escopo, trechos) => { if (escopo.tipo === 'topico') return escopo.id; if (escopo.tipo === 'material') { const m = App.S.materiais.find(x => x.id === escopo.id); if (m && m.topicoId) return m.topicoId; } const n = {}; (trechos || []).forEach(t => { if (t.topicoId) n[t.topicoId] = (n[t.topicoId] || 0) + 1; }); const k = Object.keys(n).sort((a, b) => n[b] - n[a])[0]; return k && App.topico(k) ? k : null; };

  // =====================================================================
  // 3. Pedido à IA
  // =====================================================================
  E6.gerar = async ({ tipo, escopo, pedido = '', subtipo = 'quiz', expandir = false, qtd = 0, aoPasso = () => {} }) => {
    const titulo = nomeEscopo(escopo); let extras = [];
    if (expandir) { aoPasso('Ampliando a busca...'); try { const r = await App.ia.chamar({ sistema: 'Responda SOMENTE o JSON pedido, em português do Brasil.', prompt: L6.promptExpansao({ pedido, titulo }), json: true }); extras = L6.lerExpansao(L.extrairJSON(r.texto)); } catch (e) { App.toast('A busca ampliada não deu certo (' + e.message + '). Sigo só com o seu pedido.', true); } }
    const banca = (App.S.conc && App.S.conc.banca) || ''; const args = { pedido, titulo, banca, subtipo, qtd };
    const tentar = async (limite) => {
      aoPasso('Procurando os trechos...'); const base = L6.promptEstudio(tipo, Object.assign({ contexto: '', n: 99 }, args));
      const sel = await E6.selecionar({ escopo, pedido, extras, orcamento: L6.orcamentoContexto({ limite, sistema: L6.SISTEMA_ESTUDIO, base }) });
      if (!sel.trechos.length) { const e = new Error('Não achei trechos do seu material para isso. Confira a fonte escolhida (o PDF precisa ter texto; PDF escaneado não tem) ou atualize o índice.'); e.semTrechos = true; throw e; }
      aoPasso('A Dora está criando (' + sel.trechos.length + ' trechos)...');
      const prompt = L6.promptEstudio(tipo, Object.assign({ contexto: L6.montarContexto(sel.trechos), n: sel.trechos.length }, args));
      const r = await App.ia.chamar({ sistema: L6.SISTEMA_ESTUDIO, prompt, json: tipo !== 'pagina', tarefa: 'estudio' }); return { r, sel };
    };
    let out; try { out = await tentar(L6.LIMITE_ESTUDIO); } catch (e) { if (e.status === 413) out = await tentar(Math.min(e.maximo || L6.LIMITE_PADRAO, L6.LIMITE_PADRAO)); else throw e; } // porteiro antigo (24 mil): refaz menor
    const { r, sel } = out; const fontes = L6.listaFontes(sel.trechos); const n = sel.trechos.length; const base = { tipo, subtipo, escopo, titulo, pedido, fontes, trechos: sel.trechos, modelo: r.modelo || '', em: Date.now(), extras };
    const ruim = () => new Error('A IA respondeu num formato que não consegui ler. Tente de novo (ou mude o pedido).');
    if (tipo === 'pagina') { const bruto = L6.extrairHtml(r.texto); if (!/<[a-z]/i.test(bruto)) throw ruim(); return Object.assign(base, { bruto }); }
    const d = L.extrairJSON(r.texto); if (d == null) throw ruim();
    if (tipo === 'resumo') { const x = L6.lerResumo(d, n); if (!x) throw ruim(); return Object.assign(base, { dados: x, faltou: x.faltou }); }
    if (tipo === 'mapa') { const x = L6.lerMapa(d, n); if (!x) throw ruim(); return Object.assign(base, { dados: x, faltou: x.faltou }); }
    if (tipo === 'cartas') { const x = L6.lerCartas(d, n, App.S.cartoes.map(c => c.frente)); if (!x.cartas.length) throw ruim(); return Object.assign(base, { dados: x, faltou: x.faltou }); }
    if (tipo === 'questoes') { const x = L6.lerQuestoes(d, n, App.S.questoes.map(q => q.enunciado).concat(App.S.cartoes.map(c => c.enunciado || ''))); if (!x.questoes.length) throw ruim(); return Object.assign(base, { dados: x, faltou: x.faltou }); }
    if (tipo === 'infografico') { const x = L6.lerInfografico(d, n); if (!x) throw ruim(); return Object.assign(base, { dados: x, faltou: x.faltou }); }
    throw ruim();
  };

  // =====================================================================
  // 4. Infográfico (SVG do app) e caixa isolada da página interativa
  // =====================================================================
  const token = (n, p) => { try { return (getComputedStyle(document.documentElement).getPropertyValue(n) || '').trim() || p; } catch (e) { return p; } };
  // cores lidas do tema na hora de desenhar (o infográfico segue o tema; o PNG sai com as cores de agora)
  E6.paleta = () => ({ fundo: token('--paper-2', '#fffaf5'), papel: token('--paper', '#ffffff'), tinta: token('--ink', '#3a2e26'), suave: token('--muted', '#76614f'), linha: token('--line', '#ecdfd2'), cores: Object.fromEntries(Object.entries(L6.CORES_INFO).map(([k, [a, b]]) => [k, [token(a, '#a64d14'), token(b, '#fdeedd')]])) });
  // ícones da identidade (sprite de linha): o conteúdo do <symbol> vai dentro do SVG, para o PNG sair com os ícones
  E6.icones = () => { const out = {}; const sp = window.DoraIdentidade && window.DoraIdentidade.dados && window.DoraIdentidade.dados.sprite; if (!sp) return out; L6.ICONES_INFO.forEach(n => { const m = sp.match(new RegExp('<symbol id="dg-' + n + '"[^>]*>([\\s\\S]*?)</symbol>')); if (m) out[n] = m[1].replace(/<title>[\s\S]*?<\/title>/, ''); }); return out; };
  E6.svgInfo = (res) => L6.svgInfografico(res.dados, { paleta: E6.paleta(), icones: E6.icones(), fontes: res.fontes, data: App.hoje() });
  E6.baixarPng = (svg, nome) => new Promise((ok, falha) => {
    const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' })); const img = new Image();
    img.onload = () => { try { const cv = document.createElement('canvas'); cv.width = img.naturalWidth || 1080; cv.height = img.naturalHeight || 1350; cv.getContext('2d').drawImage(img, 0, 0); URL.revokeObjectURL(url); cv.toBlob(b => { if (!b) return falha(new Error('Não consegui gerar o PNG.')); App.baixar(nome, b); ok(b); }, 'image/png'); } catch (e) { falha(e); } };
    img.onerror = () => { URL.revokeObjectURL(url); falha(new Error('Não consegui desenhar o infográfico.')); }; img.src = url;
  });
  // página interativa: <iframe sandbox="allow-scripts"> (SEM allow-same-origin) com a caixa estudio-caixa.html; ela recebe o HTML saneado
  // e o mostra num segundo iframe sandbox via srcdoc. Origem opaca: nada de IndexedDB, cookies, localStorage ou acesso ao app.
  E6.caixa = (htmlSaneado) => {
    const f = h('iframe', { sandbox: 'allow-scripts', src: 'src/estudio-caixa.html', title: 'Página interativa criada pela Dora (isolada, sem internet)', referrerpolicy: 'no-referrer', loading: 'eager', class: 'est-caixa', 'data-estudio-caixa': '1' });
    const ouvir = (e) => { if (e.source !== f.contentWindow || !e.data || e.data.tipo !== 'dora-estudio-caixa-pronta') return; f.contentWindow.postMessage({ tipo: 'dora-estudio-html', html: htmlSaneado }, '*'); };
    window.addEventListener('message', ouvir); App.aoSair(() => window.removeEventListener('message', ouvir)); return f;
  };
  const saneado = (res) => L6.sanearHtml(res.bruto, { titulo: res.titulo + ' — ' + ((L6.SUBTIPOS_PAGINA.find(s => s[0] === res.subtipo) || [])[1] || 'Página'), fontes: res.fontes, data: L.diaLocal(res.em || Date.now()) });

  // =====================================================================
  // 5. Telas do resultado (prévia + gravar)
  // =====================================================================
  const marca = () => h('span', { class: 'chip', 'data-criado-dora': '1' }, 'Criado pela Dora');
  const blocoFontes = (fontes) => h('details', { class: 'afundado', 'data-estudio-fontes': '1' }, h('summary', {}, 'Fontes usadas (' + fontes.length + ')'), h('ol', { class: 'peq', style: 'margin:6px 0 0;padding-left:22px' }, fontes.map(f => h('li', { value: f.n }, f.rotulo))));
  const avisoFaltou = (t) => t ? h('div', { class: 'afundado peq', 'data-estudio-faltou': '1' }, h('b', {}, 'O que faltou no seu material: '), t) : null;
  const rodapeIA = (res) => h('p', { class: 'muted peq', style: 'margin:0' }, 'Feito só com os trechos acima' + (res.modelo ? ' (modelo: ' + res.modelo + ')' : '') + '. A IA pode errar: confira com o seu material antes de estudar por aqui.');
  const selDestino = (res, aoMudar) => h('label', { class: 'campo' }, h('span', {}, 'Gravar no tópico'), App.selTopico(res.destino, (v) => { res.destino = v; if (aoMudar) aoMudar(v); }, true, 'Tópico onde gravar'));
  const precisaTopico = (res) => { const t = res.destino && App.topico(res.destino); if (!t) App.toast('Escolha o tópico onde gravar.', true); return t; };

  function mostrarResultado(alvo, res) {
    alvo.replaceChildren(); if (res.destino === undefined) res.destino = destinoPadrao(res.escopo, res.trechos);
    const tipoNome = (L6.TIPOS.find(t => t.id === res.tipo) || {}).nome || res.tipo;
    const cab = h('div', { class: 'linha entre' }, h('h2', { style: 'margin:0' }, tipoNome + ': ' + res.titulo), h('div', { class: 'linha' }, marca(), res.artefatoId ? h('span', { class: 'chip ok' }, 'salvo') : null));
    const caixa = h('div', { class: 'cartao destaque', 'data-estudio-resultado': res.tipo }, cab, res.pedido ? h('p', { class: 'muted peq' }, 'Pedido: ' + res.pedido) : null); alvo.append(caixa);
    const corpo = h('div', { class: 'pilha' }); caixa.append(corpo);
    if (res.tipo === 'resumo') {
      const html = L6.htmlResumo(res.dados, res.fontes, { data: App.hoje(), pedido: res.pedido }); const pre = h('div', { class: 'afundado', style: 'max-height:420px;overflow:auto', 'data-resumo-previa': '1' }); pre.innerHTML = App.E.sanitizar(html);
      corpo.append(pre, selDestino(res), h('div', { class: 'linha' }, h('button', { class: 'btn p', type: 'button', 'data-estudio-salvar': 'resumo', onclick: async (ev) => { const t = precisaTopico(res); if (!t) return; ev.currentTarget.disabled = true; t.notaHtml = (t.notaHtml || '') + html; await App.salvar('topicos', t); App.toast('Resumo salvo na nota de "' + t.titulo + '".'); } }, 'Salvar como nota do tópico'), h('button', { class: 'btn', type: 'button', onclick: () => { const t = precisaTopico(res); if (t) App.ir('topico/' + t.id + '?aba=notas'); } }, 'Abrir as notas')));
    } else if (res.tipo === 'mapa') {
      const m = L6.mapaEstudio(res.dados, res.fontes, { prefixo: 'de' + (Date.now() % 100000).toString(36), titulo: res.titulo });
      corpo.append(h('div', { class: 'afundado', 'data-mapa-previa': '1' }, h('b', {}, res.dados.raiz || res.titulo), h('ul', { style: 'margin:6px 0 0' }, res.dados.ramos.map(r => h('li', {}, h('b', {}, r.nome), ': ' + r.folhas.join(' · ') + (r.fontes.length ? ' [' + r.fontes.join(', ') + ']' : ''))))), h('p', { class: 'muted peq', style: 'margin:0' }, m.nos.length + ' nós. Se o tópico já tem mapa, este entra como um ramo novo. Dá para editar tudo depois.'),
        selDestino(res), h('div', { class: 'linha' }, h('button', { class: 'btn p', type: 'button', 'data-estudio-salvar': 'mapa', onclick: async (ev) => { const t = precisaTopico(res); if (!t) return; ev.currentTarget.disabled = true; t.mapa = L5.mesclarMapa(t.mapa, m); await App.salvar('topicos', t); App.toast('Mapa mental criado em "' + t.titulo + '".'); App.ir('topico/' + t.id + '?aba=mapa'); } }, 'Criar mapa mental')));
    } else if (res.tipo === 'cartas' || res.tipo === 'questoes') {
      const itens = res.tipo === 'cartas' ? res.dados.cartas : res.dados.questoes; const marc = itens.map(() => true); const lista = h('div', { class: 'pilha', style: 'max-height:440px;overflow:auto' });
      itens.forEach((it, i) => lista.append(h('label', { class: 'afundado marca-op', 'data-estudio-item': '1' }, h('input', { type: 'checkbox', checked: true, 'aria-label': 'Incluir o item ' + (i + 1), onchange: (e) => { marc[i] = e.target.checked; conta(); } }),
        h('div', { style: 'min-width:0;overflow-wrap:anywhere' }, res.tipo === 'cartas' ? [h('b', {}, it.frente), h('div', { class: 'muted peq' }, it.verso)] : [h('b', {}, it.enunciado), h('ol', { type: 'A', class: 'peq', style: 'margin:4px 0;padding-left:22px' }, it.alternativas.map(a => h('li', { style: a.letra === it.gabarito ? 'font-weight:700' : '' }, a.texto))), h('div', { class: 'muted peq' }, 'Gabarito: ' + it.gabarito + (it.pegadinha ? ' · Pegadinha: ' + it.pegadinha : ''))], h('div', { class: 'muted peq' }, it.fontes.length ? 'Fontes: [' + it.fontes.join(', ') + ']' : 'Sem fonte citada pela IA: confira')))));
      const rotFonte = (it) => (it.fontes.length ? it.fontes : [1]).map(n => (res.fontes.find(f => f.n === n) || {}).rotulo).filter(Boolean).join('; ');
      const gravar = async (ev, como) => {
        const tid = res.destino || null; let n = 0; const agora = Date.now(); ev.currentTarget.disabled = true;
        for (let i = 0; i < itens.length; i++) { if (!marc[i]) continue; const it = itens[i]; const comum = { concursoId: App.S.conc.id, topicoId: tid, origem: 'estudio', fonte: 'Dora Estúdio: ' + rotFonte(it), tags: ['dora-estudio'], criado: agora + n };
          if (como === 'cartas') await App.salvar('cartoes', Object.assign({ id: L.uid('c'), tipo: 'basico', frente: it.frente, verso: it.verso }, comum));
          else if (como === 'doracartas') await App.salvar('cartoes', Object.assign({ id: L.uid('c'), tipo: 'questao', enunciado: it.enunciado, alternativas: it.alternativas, gabarito: it.gabarito, explicacao: it.comentario, pegadinha: it.pegadinha }, comum));
          else await App.salvar('questoes', Object.assign({ id: L.uid('q'), tipo: 'multipla', enunciado: it.enunciado, alternativas: it.alternativas, gabarito: it.gabarito, comentario: it.comentario, pegadinha: it.pegadinha, banca: (App.S.conc.banca || '') + ' (estilo, Dora Estúdio)', assunto: tid ? App.nomeTopico(tid) : res.titulo, feitas: 0, acertos: 0 }, comum, { origem: 'ia', criadoPor: 'estudio' }));
          n++; }
        App.toast(n + (como === 'questoes' ? (n === 1 ? ' questão salva no banco de Questões.' : ' questões salvas no banco de Questões.') : (n === 1 ? ' carta criada.' : ' cartas criadas.')));
      };
      const botoes = res.tipo === 'cartas' ? [h('button', { class: 'btn p', type: 'button', 'data-estudio-salvar': 'cartas', onclick: (e) => gravar(e, 'cartas') }, 'Criar cartas')] : [h('button', { class: 'btn p', type: 'button', 'data-estudio-salvar': 'questoes', onclick: (e) => gravar(e, 'questoes') }, 'Salvar no banco de Questões'), h('button', { class: 'btn', type: 'button', 'data-estudio-salvar': 'doracartas', onclick: (e) => gravar(e, 'doracartas') }, 'Salvar como Dora Cartas')];
      const conta = () => { const n = marc.filter(Boolean).length; botoes.forEach(b => { b.disabled = !n; }); botoes[0].textContent = res.tipo === 'cartas' ? 'Criar ' + n + (n === 1 ? ' carta' : ' cartas') : 'Salvar ' + n + ' no banco de Questões'; };
      corpo.append(h('p', { class: 'muted peq', style: 'margin:0' }, 'Desmarque o que não quiser. Itens que você já tem ficaram de fora.'), lista, selDestino(res), h('div', { class: 'linha' }, botoes)); conta();
    } else if (res.tipo === 'infografico') {
      const svg = E6.svgInfo(res); const vis = h('div', { class: 'est-info', 'data-estudio-info': '1' }); vis.innerHTML = svg; // SVG montado pelo app (textos escapados), nunca HTML da IA
      corpo.append(vis, selDestino(res), h('div', { class: 'linha' }, h('button', { class: 'btn p', type: 'button', 'data-estudio-png': '1', onclick: async () => { try { await E6.baixarPng(E6.svgInfo(res), L6.nomeArquivo(res.dados.titulo) + '.png'); } catch (e) { App.toast(e.message, true); } } }, 'Baixar PNG'), botaoSalvarArtefato(res)));
    } else if (res.tipo === 'pagina') {
      const s = saneado(res);
      if (!s.ok) corpo.append(h('div', { class: 'afundado' }, h('b', {}, 'Não deu para mostrar: '), s.erro));
      else {
        corpo.append(h('p', { class: 'muted peq', style: 'margin:0', 'data-estudio-isolada': '1' }, 'A página roda isolada: sem internet, sem acesso aos seus dados, ao banco do app ou aos cookies.' + (s.avisos.length ? ' A Dora tirou ou desligou: ' + s.avisos.join(', ') + '.' : '')), E6.caixa(s.html),
          selDestino(res), h('div', { class: 'linha' }, botaoSalvarArtefato(res), h('button', { class: 'btn', type: 'button', 'data-estudio-exportar': '1', onclick: () => App.baixar(L6.nomeArquivo(res.titulo + '-' + res.subtipo) + '.html', s.html, 'text/html;charset=utf-8') }, 'Exportar .html')));
      }
    }
    caixa.append(avisoFaltou(res.faltou), blocoFontes(res.fontes), rodapeIA(res));
  }
  // infográfico e página interativa ficam na loja `artefatos` (entra no backup). A página guarda o HTML da IA e é saneada de novo ao abrir.
  function botaoSalvarArtefato(res) {
    return h('button', { class: 'btn' + (res.tipo === 'pagina' ? ' p' : ''), type: 'button', 'data-estudio-salvar': 'artefato', onclick: async (ev) => {
      const b = ev.currentTarget; b.disabled = true; const reg = { id: res.artefatoId || L.uid('art'), concursoId: App.S.conc.id, topicoId: res.destino || null, tipo: res.tipo, subtipo: res.subtipo || null, titulo: res.tipo === 'infografico' ? res.dados.titulo : res.titulo + ' — ' + ((L6.SUBTIPOS_PAGINA.find(s => s[0] === res.subtipo) || [])[1] || ''), pedido: res.pedido || '', fontes: res.fontes, modelo: res.modelo || '', spec: res.tipo === 'infografico' ? res.dados : null, html: res.tipo === 'pagina' ? res.bruto : null, escopo: res.escopo, criadoPor: 'Dora Estúdio', criado: res.criado || Date.now() };
      await DB.put('artefatos', reg); res.artefatoId = reg.id; App.toast('Salvo' + (reg.topicoId ? ' no tópico "' + App.nomeTopico(reg.topicoId) + '"' : '') + '. Fica em "Criações da Dora".'); b.textContent = 'Salvo';
    } }, res.artefatoId ? 'Salvar de novo' : 'Salvar no tópico');
  }
  const deArtefato = (a) => ({ tipo: a.tipo, subtipo: a.subtipo, escopo: a.escopo || { tipo: 'tudo' }, titulo: a.tipo === 'infografico' ? (a.spec && a.spec.titulo) || a.titulo : String(a.titulo || '').split(' — ')[0], pedido: a.pedido, fontes: a.fontes || [], trechos: [], modelo: a.modelo, em: a.criado, criado: a.criado, dados: a.spec, bruto: a.html, faltou: a.spec && a.spec.faltou, artefatoId: a.id, destino: a.topicoId });

  // =====================================================================
  // 6. A tela
  // =====================================================================
  V.estudio = async (alvo, r) => {
    if (!App.exigeConcurso(alvo, 'A Dora Estúdio usa o material do concurso aberto.')) return;
    const q = r.query; const est = ls('doraDraw.estudio', {}) || {};
    let escopo = q.material ? { tipo: 'material', id: q.material } : q.topico ? { tipo: 'topico', id: q.topico } : q.disciplina ? { tipo: 'disciplina', id: q.disciplina } : q.tudo ? { tipo: 'tudo' } : null;
    if (!escopo) escopo = App.S.materiais.length ? { tipo: 'material', id: App.S.materiais[0].id } : { tipo: 'tudo' };
    let tipo = L6.TIPOS.some(t => t.id === q.tipo) ? q.tipo : (L6.TIPOS.some(t => t.id === est.tipo) ? est.tipo : 'resumo'); let subtipo = est.subtipo || 'quiz';
    const ia = temIA();
    alvo.append(h('h1', {}, 'Dora Estúdio'), h('p', { class: 'muted', style: 'margin-top:0' }, 'Escolha o seu material e o que a Dora deve criar. Ela acha os trechos certos aqui no aparelho e manda só eles para a IA. O resultado volta para o app, com as fontes citadas.'));
    // ---- estado do índice
    const statusEl = h('span', { class: 'muted peq', 'data-estudio-indice': '1' }, 'Preparando o índice...');
    const btnIdx = h('button', { class: 'btn mini', type: 'button', 'data-estudio-reindexar': '1', onclick: () => sincronizar(true) }, 'Atualizar índice');
    alvo.append(h('div', { class: 'cartao' }, h('div', { class: 'linha entre' }, h('div', { class: 'linha' }, App.tile('busca'), h('div', {}, h('b', {}, 'Índice do seu material'), h('div', {}, statusEl))), btnIdx), h('p', { class: 'muted peq', style: 'margin:8px 0 0' }, 'Fica só neste aparelho (PDFs da Estante, notas, grifos, marcações e cartas). Nenhum arquivo vai para servidor nenhum: só os trechos escolhidos vão para a IA, na hora de criar.')));
    async function sincronizar(manual) {
      btnIdx.disabled = true; try { const s = await E6.sincronizar((i, n, nome) => { statusEl.textContent = 'Lendo ' + (i + 1) + ' de ' + n + ': ' + nome; }); const x = s.resumo; statusEl.textContent = x.trechos ? x.trechos + ' trechos de ' + x.fontes + (x.fontes === 1 ? ' fonte' : ' fontes') + ' · pronto' : 'Ainda não há material com texto. Guarde PDFs na Estante, escreva notas ou grife.'; if (manual) App.toast('Índice atualizado' + (s.refeitas || s.removidas ? ' (' + s.refeitas + ' refeitas, ' + s.removidas + ' removidas).' : ': nada mudou.')); }
      catch (e) { console.warn(e); statusEl.textContent = 'Não consegui montar o índice: ' + e.message; } finally { btnIdx.disabled = false; }
    }
    sincronizar(false);

    // ---- 1. fonte
    const segF = h('div', { class: 'seg', role: 'group', 'aria-label': 'Fonte' }); const escolhaF = h('div');
    const FONTES = [['material', 'Um PDF'], ['topico', 'Um tópico'], ['disciplina', 'Uma disciplina'], ['tudo', 'Todo o material do concurso']];
    const pintaFonte = () => {
      [...segF.children].forEach(b => b.setAttribute('aria-pressed', String(b.dataset.f === escopo.tipo))); escolhaF.replaceChildren();
      if (escopo.tipo === 'material') { if (!App.S.materiais.length) escolhaF.append(h('div', { class: 'vazio' }, 'Nenhum PDF na Estante ainda. ', h('a', { href: '#/estante' }, 'Ir para a Estante'))); else escolhaF.append(h('label', { class: 'campo' }, h('span', {}, 'PDF da Estante'), h('select', { 'aria-label': 'PDF', 'data-estudio-material': '1', onchange: (e) => { escopo = { tipo: 'material', id: e.target.value }; } }, App.S.materiais.map(m => h('option', Object.assign({ value: m.id }, m.id === escopo.id ? { selected: true } : {}), m.nome + (m.indexado ? '' : ' (sem texto)')))))); }
      else if (escopo.tipo === 'topico') { if (!App.topico(escopo.id)) escopo.id = (App.S.topicos.find(App.ehFolha) || App.S.topicos[0] || {}).id; escolhaF.append(h('label', { class: 'campo' }, h('span', {}, 'Tópico (inclui os subtópicos)'), App.selTopico(escopo.id, (v) => { escopo = { tipo: 'topico', id: v }; }, false, 'Tópico'))); }
      else if (escopo.tipo === 'disciplina') { if (!App.disciplina(escopo.id)) escopo.id = (App.S.disciplinas[0] || {}).id; escolhaF.append(h('label', { class: 'campo' }, h('span', {}, 'Disciplina'), h('select', { 'aria-label': 'Disciplina', onchange: (e) => { escopo = { tipo: 'disciplina', id: e.target.value }; } }, App.S.disciplinas.map(d => h('option', Object.assign({ value: d.id }, d.id === escopo.id ? { selected: true } : {}), d.nome))))); }
      else escolhaF.append(h('p', { class: 'muted peq', style: 'margin:0' }, 'A Dora procura em tudo o que você guardou neste concurso e escolhe os trechos mais ligados ao seu pedido. Escreva o pedido para a busca ficar certeira.'));
    };
    FONTES.forEach(([k, n]) => segF.append(h('button', { type: 'button', 'data-f': k, onclick: () => { escopo = { tipo: k, id: k === 'material' ? (App.S.materiais[0] || {}).id : null }; pintaFonte(); } }, n)));
    if (escopo.tipo === 'material' && !App.S.materiais.some(m => m.id === escopo.id) && App.S.materiais.length) escopo.id = App.S.materiais[0].id;
    alvo.append(h('div', { class: 'cartao' }, h('h3', { style: 'margin-top:0' }, '1. De onde vem o conteúdo'), segF, h('div', { style: 'margin-top:10px' }, escolhaF))); pintaFonte();

    // ---- 2. tipo
    const gradeT = h('div', { class: 'grade', role: 'radiogroup', 'aria-label': 'O que criar' }); const subBox = h('div');
    const pintaTipo = () => { [...gradeT.children].forEach(b => b.setAttribute('aria-checked', String(b.dataset.tipo === tipo))); subBox.replaceChildren(); if (tipo === 'pagina') subBox.append(h('label', { class: 'campo' }, h('span', {}, 'Tipo de página'), h('select', { 'aria-label': 'Tipo de página', 'data-estudio-subtipo': '1', onchange: (e) => { subtipo = e.target.value; lsSet('doraDraw.estudio', { tipo, subtipo }); } }, L6.SUBTIPOS_PAGINA.map(([k, n]) => h('option', Object.assign({ value: k }, k === subtipo ? { selected: true } : {}), n))))); if (tipo === 'cartas' || tipo === 'questoes') subBox.append(h('label', { class: 'campo' }, h('span', {}, 'Quantas (até ' + (tipo === 'cartas' ? 30 : 15) + ')'), h('input', { type: 'number', min: 1, max: tipo === 'cartas' ? 30 : 15, value: tipo === 'cartas' ? (est.qtdC || 10) : (est.qtdQ || 5), 'data-estudio-qtd': '1', 'aria-label': 'Quantidade' }))); };
    L6.TIPOS.forEach(t => gradeT.append(h('button', { type: 'button', role: 'radio', class: 'cartao est-tipo', 'data-tipo': t.id, 'aria-checked': 'false', disabled: ia ? null : true, onclick: () => { tipo = t.id; lsSet('doraDraw.estudio', { tipo, subtipo }); pintaTipo(); } }, h('b', {}, t.nome), h('span', { class: 'muted peq' }, t.desc))));
    const semIA = ia ? null : h('div', { class: 'afundado', 'data-estudio-sem-ia': '1' }, h('p', { style: 'margin-top:0' }, h('b', {}, 'Sem IA configurada, a criação fica desligada.'), ' A Dora Estúdio precisa da IA para escrever o resumo, o mapa, as cartas, as questões, o infográfico e a página. Configure a sua chave ou o código da Guilda na Dora Mentora.'),
      h('p', {}, 'Mesmo sem IA você pode: ver os trechos que a Dora usaria (busca aqui no aparelho) e usar "Transformar marcações", que faz resumo, Dora Cartas e mapa mental por regras, a partir dos seus grifos.'),
      h('div', { class: 'linha' }, h('a', { class: 'btn', href: '#/ia' }, 'Configurar a IA'), h('button', { class: 'btn p', type: 'button', 'data-estudio-transformar': '1', onclick: () => App.transformarMarcacoes(escopo.tipo === 'material' ? { materialId: escopo.id } : escopo.tipo === 'topico' ? { topicoId: escopo.id } : { tudo: true }) }, 'Transformar marcações (sem IA)')));
    alvo.append(h('div', { class: 'cartao' }, h('h3', { style: 'margin-top:0' }, '2. O que a Dora deve criar'), semIA, gradeT, h('div', { style: 'margin-top:10px' }, subBox))); pintaTipo();

    // ---- 3. pedido
    const ped = h('textarea', { 'aria-label': 'Pedido livre (opcional)', 'data-estudio-pedido': '1', placeholder: 'Opcional. Ex.: foque nos prazos e nas exceções; compare dispensa e inexigibilidade; quiz com 8 perguntas...', style: 'min-height:90px' }, q.pedido || '');
    const exp = h('input', { type: 'checkbox', 'data-estudio-expandir': '1', disabled: ia ? null : true });
    const saida = h('div', { class: 'pilha', 'data-estudio-saida': '1' });
    const ver = h('button', { class: 'btn', type: 'button', 'data-estudio-ver': '1', onclick: async () => { await E6.sincronizar().catch(() => null); const sel = await E6.selecionar({ escopo, pedido: ped.value.trim(), orcamento: 20000 }); saida.replaceChildren(h('div', { class: 'cartao', 'data-estudio-trechos': '1' }, h('h3', { style: 'margin-top:0' }, sel.trechos.length + (sel.trechos.length === 1 ? ' trecho escolhido' : ' trechos escolhidos') + ' (' + Math.round(sel.usado / 1000) + ' mil caracteres)'), sel.trechos.length ? h('div', { class: 'pilha', style: 'max-height:420px;overflow:auto' }, sel.trechos.map(t => h('div', { class: 'afundado' }, h('div', { class: 'peq muted' }, '[' + t.ref + '] ' + L6.rotuloFonte(t)), h('div', { class: 'peq', style: 'overflow-wrap:anywhere' }, L6.corta(t.texto, 360))))) : h('div', { class: 'vazio' }, App.vazioFig('sem-resultados'), 'Nenhum trecho com texto nesta fonte.'))); } }, 'Ver os trechos');
    const criar = h('button', { class: 'btn p', type: 'button', 'data-estudio-criar': '1', disabled: ia ? null : true, title: ia ? '' : 'Configure a IA na Dora Mentora', onclick: async () => {
      const qtdEl = alvo.querySelector('[data-estudio-qtd]'); const qtd = qtdEl ? Math.max(1, Math.min(tipo === 'cartas' ? 30 : 15, +qtdEl.value || 0)) : 0; if (qtdEl) lsSet('doraDraw.estudio', Object.assign({ tipo, subtipo }, tipo === 'cartas' ? { qtdC: qtd } : { qtdQ: qtd }));
      if (escopo.tipo === 'material' && !escopo.id) { App.toast('Escolha um PDF.', true); return; }
      App.ocupado = true; App.rodando(criar, 'Preparando...'); saida.replaceChildren();
      try { await E6.sincronizar(); const res = await E6.gerar({ tipo, escopo, pedido: ped.value.trim(), subtipo, expandir: exp.checked, qtd, aoPasso: (t) => App.rodando(criar, t) }); mostrarResultado(saida, res); saida.scrollIntoView({ block: 'start', behavior: 'smooth' }); }
      catch (e) { App.toast(e.message, true); saida.replaceChildren(h('div', { class: 'cartao', 'data-estudio-erro': '1' }, h('b', {}, 'Não deu certo: '), e.message)); }
      finally { App.ocupado = false; criar.disabled = false; criar.replaceChildren('Criar com a Dora'); }
    } }, 'Criar com a Dora');
    alvo.append(h('div', { class: 'cartao' }, h('h3', { style: 'margin-top:0' }, '3. Pedido (opcional)'), ped, h('label', { class: 'marca-op', style: 'margin-top:8px' }, exp, h('span', {}, 'Ampliar a busca com a IA (sinônimos e palavras parecidas; gasta 1 pedido a mais)')),
      h('div', { class: 'linha', style: 'margin-top:10px' }, criar, ver), h('p', { class: 'muted peq', style: 'margin:8px 0 0' }, 'Cada criação gasta 1 pedido de IA (2 com a busca ampliada). Vão no máximo uns 45 mil caracteres de trechos.')));
    alvo.append(saida);

    // ---- criações salvas
    const salvos = (await DB.porIndice('artefatos', 'concursoId', App.S.conc.id)).sort((a, b) => (b.criado || 0) - (a.criado || 0));
    alvo.append(listaArtefatos(salvos, saida));
    if (q.artefato) { const a = salvos.find(x => x.id === q.artefato); if (a) mostrarResultado(saida, deArtefato(a)); }
  };
  function listaArtefatos(salvos, saida) {
    const nomeT = { pagina: 'Página', infografico: 'Infográfico' };
    return h('div', { class: 'cartao', 'data-estudio-salvos': '1' }, h('h3', { style: 'margin-top:0' }, 'Criações da Dora (' + salvos.length + ')'), salvos.length ? h('div', { class: 'pilha' }, salvos.map(a => h('div', { class: 'no-t' }, h('div', { style: 'min-width:0' }, h('div', { class: 'meta', style: 'margin:0 0 4px' }, h('span', { class: 'chip azul' }, nomeT[a.tipo] || a.tipo), h('span', { class: 'muted peq' }, (a.topicoId ? App.nomeTopico(a.topicoId) + ' · ' : '') + new Date(a.criado || 0).toLocaleDateString('pt-BR'))), h('div', { class: 'tit', style: 'overflow-wrap:anywhere' }, a.titulo || '')),
      h('div', { class: 'linha', style: 'gap:4px' }, h('button', { class: 'btn mini p', type: 'button', 'data-abrir-artefato': a.id, onclick: () => { mostrarResultado(saida, deArtefato(a)); saida.scrollIntoView({ block: 'start' }); } }, 'Abrir'), h('button', { class: 'btn mini perigo', type: 'button', 'aria-label': 'Apagar criação', onclick: async () => { if (!(await App.confirmar('Apagar "' + (a.titulo || 'esta criação') + '"?', 'Apagar'))) return; await DB.del('artefatos', a.id); App.render(); } }, 'Apagar')))))
      : h('div', { class: 'vazio' }, 'Infográficos e páginas interativas que você salvar aparecem aqui e na aba Materiais do tópico.'));
  }

  // =====================================================================
  // 7. Botões contextuais: tópico, Estante e leitor de PDF
  // =====================================================================
  const linkEstudio = (q, rot) => h('a', { class: 'btn mini', href: '#/estudio?' + q, 'data-estudio-link': '1', title: 'Criar com a Dora a partir deste material' }, rot || 'Dora Estúdio');
  const topicoOrig = V.topico;
  V.topico = async (alvo, r) => {
    await topicoOrig(alvo, r); const t = App.topico(r.args[0]); if (!t) return;
    const barra = alvo.querySelector('.linha.entre .linha'); if (barra && !barra.querySelector('[data-estudio-link]')) barra.append(linkEstudio('topico=' + encodeURIComponent(t.id)));
    if (r.query.aba !== 'materiais') return;
    const arts = (await DB.porIndice('artefatos', 'topicoId', t.id)).filter(a => a.concursoId === App.S.conc.id);
    alvo.append(h('div', { class: 'cartao', 'data-estudio-topico': '1' }, h('h3', {}, 'Criações da Dora (' + arts.length + ')'), arts.length ? h('div', { class: 'pilha' }, arts.map(a => h('div', { class: 'no-t' }, h('div', { class: 'tit', style: 'overflow-wrap:anywhere' }, a.titulo || ''), h('a', { class: 'btn mini p', href: '#/estudio?artefato=' + encodeURIComponent(a.id) }, 'Abrir')))) : h('p', { class: 'muted peq' }, 'Peça à Dora um resumo, mapa, cartas, questões, infográfico ou página interativa deste tópico.'), h('div', { class: 'linha', style: 'margin-top:8px' }, linkEstudio('topico=' + encodeURIComponent(t.id), 'Criar com a Dora Estúdio'))));
  };
  const estanteOrig = V.estante;
  V.estante = async (alvo, r) => {
    await estanteOrig(alvo, r); if (!App.S.conc) return;
    alvo.querySelectorAll('.grade > .cartao').forEach(cartao => { const a = cartao.querySelector('a[href^="#/leitor/"]'); if (!a || cartao.querySelector('[data-estudio-link]')) return; const id = a.getAttribute('href').split('/').pop().split('?')[0]; a.parentElement.append(linkEstudio('material=' + encodeURIComponent(id))); });
    const topo = h('div', { class: 'cartao', 'data-estudio-estante': '1' }, h('div', { class: 'linha entre' }, h('div', {}, h('b', {}, 'Dora Estúdio'), h('div', { class: 'muted peq' }, 'Peça à Dora um resumo, mapa mental, cartas, questões, infográfico ou página interativa feitos só com o seu material.')), linkEstudio('tudo=1', 'Criar com todo o material')));
    const ref = alvo.querySelector('[data-transformar-lote]') || alvo.querySelector('.grade'); if (ref) ref.before(topo); else alvo.append(topo);
  };
  const leitorOrig = V.leitor;
  V.leitor = async (alvo, r) => {
    await leitorOrig(alvo, r); const id = r.args[0]; if (!App.S.materiais.some(m => m.id === id)) return;
    const barra = alvo.querySelector('.ferr'); if (barra && !barra.querySelector('[data-estudio-link]')) barra.append(linkEstudio('material=' + encodeURIComponent(id)));
  };
})();
