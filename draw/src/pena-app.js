/* Dora Pena dentro do app: salva as anotações no IndexedDB (loja "penas"), áudio em "arquivos", relógio na barra,
   e recebe da extensão as anotações da página, o "Errei esta" e os resultados do modo assistido. */
(function () {
  const App = window.App, { L, h, DB } = App, P = window.DoraPena; if (!P) return;
  const pena = App.pena = {}; const CH_FILA = 'doraDraw.penaFila';
  const idDoc = (tipo, alvoId, chave) => 'pena:' + tipo + ':' + alvoId + ':' + (chave == null ? '' : chave);

  // ---------- documentos (um por página de PDF ou por questão) ----------
  pena.carregarDoc = async (tipo, alvoId, chave) => {
    const id = idDoc(tipo, alvoId, chave); const d = await DB.get('penas', id);
    if (d) return Object.assign({ audios: [], tempoMs: 0 }, d, { dados: P.limpar(d.dados) });
    return { id, concursoId: App.S.conc ? App.S.conc.id : null, tipo, alvoId, chave: String(chave == null ? '' : chave), dados: P.novoDados(), audios: [], tempoMs: 0, atualizado: Date.now() };
  };
  pena.salvarDoc = async (doc) => {
    doc.dados = P.limpar(doc.dados); doc.atualizado = Date.now(); if (!doc.concursoId && App.S.conc) doc.concursoId = App.S.conc.id;
    if (!doc.dados.e.length && !(doc.audios || []).length && !(doc.tempoMs > 0)) await DB.del('penas', doc.id); else await DB.put('penas', doc);
  };
  pena.apagarDocsDe = async (alvoId) => { const docs = await DB.porIndice('penas', 'alvoId', alvoId); for (const d of docs) for (const a of d.audios || []) await DB.del('arquivos', a.id); await DB.delMuitos('penas', docs.map(d => d.id)); };
  pena.bytesDeAudio = async () => (await DB.todos('penas')).reduce((s, d) => s + (d.audios || []).reduce((x, a) => x + (a.bytes || 0), 0), 0);

  // ---------- relógio: cronômetro, temporizador, pomodoro e tempo por questão ----------
  function criarRelogio(o) {
    let est = P.novoRelogio({ modo: o.modo || 'cron', minutos: o.modo === 'questao' ? 3 : 10 }); let chave = o.chave == null ? '' : String(o.chave); let ultimo = null, sessaoMs = 0, inicioSessao = null, avisado = false; const parciais = {}, detalhe = {}; let minutos = est.alvoMs ? est.alvoMs / 60000 : 3;
    const tela = h('span', { class: 'tempo', role: 'timer', 'aria-label': 'Tempo' }, '00:00'); const min = h('input', { type: 'number', min: 1, max: 180, value: minutos, 'aria-label': 'Minutos', onchange: () => { minutos = Math.max(1, Math.min(180, +min.value || 3)); refaz(est.modo); } });
    const modoSel = h('select', { 'aria-label': 'Tipo de relógio', onchange: () => refaz(modoSel.value) }, [['cron', 'Cronômetro'], ['pomo', 'Pomodoro 25/5'], ['questao', 'Tempo por questão'], ['temp', 'Temporizador']].map(([k, n]) => h('option', Object.assign({ value: k }, k === est.modo ? { selected: true } : {}), n)));
    const btn = h('button', { class: 'btn mini p', type: 'button', onclick: () => (est.rodando ? pausar() : iniciar()) }, 'Iniciar'); const zera = h('button', { class: 'btn mini', type: 'button', onclick: () => { fechar(); refaz(est.modo); } }, 'Zerar');
    const node = h('div', { class: 'pena-relogio' }, tela, modoSel, h('label', { class: 'peq muted' }, 'min ', min), btn, zera);
    function refaz(modo) { const rodava = est.rodando; fechar(); est = P.novoRelogio({ modo, minutos: modo === 'questao' ? (+min.value || 3) : (+min.value || 10) }); avisado = false; min.hidden = !(modo === 'questao' || modo === 'temp'); min.parentElement.hidden = min.hidden; if (rodava) iniciar(); mostra(); }
    function acumula(now) { if (est.rodando && ultimo != null) { const d = Math.max(0, now - ultimo); if (P.contaComoEstudo(est)) { parciais[chave] = (parciais[chave] || 0) + d; detalhe[chave] = (detalhe[chave] || 0) + d; sessaoMs += d; } } ultimo = now; }
    function iniciar() { const now = Date.now(); acumula(now); est = P.iniciarRelogio(est, now); ultimo = now; if (!inicioSessao) inicioSessao = now; btn.textContent = 'Pausar'; mostra(); }
    function pausar() { const now = Date.now(); acumula(now); est = P.pausarRelogio(est, now); btn.textContent = 'Continuar'; despeja(); mostra(); }
    async function despeja() { const ks = Object.keys(parciais).filter(k => parciais[k] > 0); for (const k of ks) { const ms = parciais[k]; parciais[k] = 0; await o.aoTempo(k, ms); } }
    async function fechar() { // fecha a sessão de estudo no histórico (Dora Foco) se passou de 1 minuto
      const now = Date.now(); acumula(now); est = P.pausarRelogio(est, now); btn.textContent = 'Iniciar'; await despeja();
      if (sessaoMs >= 60000 && App.S.conc) { const minutosSes = Math.round(sessaoMs / 60000); const ses = { id: L.uid('s'), concursoId: App.S.conc.id, topicoId: o.topicoId || null, inicio: inicioSessao || now - sessaoMs, fim: now, minutos: minutosSes, tipo: est.modo === 'pomo' ? 'foco' : est.modo === 'cron' ? 'livre' : 'regressivo', origem: 'pena', detalhe: Object.keys(detalhe).map(k => ({ c: k, ms: Math.round(detalhe[k]) })) }; try { await App.salvar('sessoes', ses); if (o.topicoId) await App.marcarEstudo(o.topicoId); if (App.registrarEstudoModal) App.registrarEstudoModal({ sessao: ses }); } catch (e) { console.warn('sessão da Pena', e); } }
      sessaoMs = 0; inicioSessao = null; for (const k in detalhe) delete detalhe[k]; mostra();
    }
    function mostra() { const now = Date.now(); const r = P.restante(est, now); tela.textContent = P.formatarMs(r == null ? P.decorrido(est, now) : r); tela.classList.toggle('estourou', r != null && r < 0); modoSel.title = est.modo === 'pomo' ? (est.fase === 'foco' ? 'Foco' : 'Pausa') : ''; if (est.modo === 'pomo') tela.setAttribute('aria-label', 'Tempo de ' + (est.fase === 'foco' ? 'foco' : 'pausa')); }
    min.hidden = !(est.modo === 'questao' || est.modo === 'temp'); min.parentElement.hidden = min.hidden;
    const tic = setInterval(() => {
      if (!o.vivo()) { clearInterval(tic); fechar(); return; } const now = Date.now(); acumula(now);
      if (est.rodando && P.acabou(est, now) && !avisado) {
        avisado = true; if (est.modo === 'pomo') { const foco = est.fase === 'foco'; App.toast(foco ? 'Pomodoro: hora da pausa.' : 'Fim da pausa: volte ao foco.'); est = P.proximaFase(est, now); avisado = false; } else if (est.modo === 'questao') App.toast('Passou do tempo desta questão. Decida e siga em frente.', true); else { App.toast('Tempo acabou.'); est = P.pausarRelogio(est, now); btn.textContent = 'Iniciar'; }
      }
      mostra();
    }, 500); mostra();
    return { node, trocarChave(nova) { const now = Date.now(); acumula(now); if (chave !== String(nova)) { despeja(); chave = String(nova); if (est.modo === 'questao') { const rodava = est.rodando; est = P.novoRelogio({ modo: 'questao', minutos: +min.value || 3 }); avisado = false; if (rodava) est = P.iniciarRelogio(est, now); } } }, fechar, parar() { clearInterval(tic); return fechar(); } };
  }

  // ---------- controlador: camada + barra + áudio + relógio, ligados a um documento ----------
  // o: { tipo, alvoId, topicoId, barraAlvo, modoRelogio }
  pena.controlador = (o) => {
    const st = { cam: null, doc: null, pai: null, seq: 0, pref: { ferr: 'ler', cor: 0, esp: 1, forma: 'l' }, grav: null, gravId: null, audioEl: null, audioId: null, raf: 0, vivo: true }; let relogio = null; const barraAlvo = o.barraAlvo;
    const vivo = () => st.vivo && barraAlvo.isConnected;
    relogio = criarRelogio({ modo: o.modoRelogio || 'cron', topicoId: o.topicoId, vivo: () => { if (!vivo() && st.vivo) destruir(); return st.vivo; }, aoTempo: async (k, ms) => { const doc = st.doc && st.doc.chave === String(k) ? st.doc : await pena.carregarDoc(o.tipo, o.alvoId, k); doc.tempoMs = (doc.tempoMs || 0) + Math.round(ms); await pena.salvarDoc(doc); } });
    const audiosBox = h('div', { class: 'pena-audio' }); const playerBox = h('div'); const btnGrava = h('button', { class: 'btn mini', type: 'button', onclick: () => alternarGravacao() }, 'Gravar áudio'); const listaAudios = h('div', { class: 'pena-audio' });
    const extras = h('div', { class: 'pena-audio' }, h('div', { class: 'ferr' }, relogio.node), h('div', { class: 'ferr' }, btnGrava, h('span', { class: 'peq muted', 'aria-live': 'polite', 'data-aud-estado': '1' }, '')), listaAudios, playerBox);
    const estadoAud = extras.querySelector('[data-aud-estado]');
    function desenhaLista() {
      listaAudios.replaceChildren(); const as = (st.doc && st.doc.audios) || []; if (st.cam) st.cam.definirOuvir(as.length > 0);
      as.forEach((a, i) => listaAudios.append(h('div', { class: 'item' }, h('span', { class: 'peq' }, 'Áudio ' + (i + 1) + ' · ' + P.formatarMs(a.dur) + ' · ' + (a.bytes > 1048576 ? (a.bytes / 1048576).toFixed(1) + ' MB' : Math.round(a.bytes / 1024) + ' KB')), h('button', { class: 'btn mini', type: 'button', onclick: () => tocar(a.id, null) }, 'Ouvir'), h('button', { class: 'btn mini perigo', type: 'button', 'aria-label': 'Apagar áudio ' + (i + 1), onclick: () => apagarAudio(a.id) }, 'Apagar'))));
    }
    async function tocar(id, instante) {
      if (st.audioId !== id) {
        const arq = await DB.get('arquivos', id); if (!arq || !arq.blob) { App.toast('Este áudio não está mais guardado.', true); return; }
        if (st.audioEl) { st.audioEl.pause(); URL.revokeObjectURL(st.audioEl.src); } const a = P.prepararAudio(h('audio', { controls: true, 'aria-label': 'Áudio da anotação' })); a.src = URL.createObjectURL(arq.blob); st.audioEl = a; st.audioId = id; playerBox.replaceChildren(a);
        const passo = () => { if (st.audioEl !== a) return; if (st.cam) st.cam.acender(a.paused && !a.seeking ? (a.currentTime > 0 ? a.currentTime * 1000 : null) : a.currentTime * 1000, id); st.raf = requestAnimationFrame(passo); }; cancelAnimationFrame(st.raf); a.addEventListener('play', () => { cancelAnimationFrame(st.raf); passo(); }); a.addEventListener('pause', () => { if (st.cam) st.cam.acender(a.currentTime * 1000, id); }); a.addEventListener('ended', () => { if (st.cam) st.cam.acender(null); });
      }
      const a = st.audioEl; if (instante != null) a.currentTime = instante / 1000; try { await a.play(); } catch (e) { /* o navegador pode exigir novo toque */ }
    }
    async function apagarAudio(id) {
      if (!(await App.confirmar('Apagar este áudio? Os traços ficam, mas perdem a ligação com o som.', 'Apagar'))) return; if (st.audioId === id && st.audioEl) { st.audioEl.pause(); URL.revokeObjectURL(st.audioEl.src); st.audioEl = null; st.audioId = null; playerBox.replaceChildren(); cancelAnimationFrame(st.raf); }
      await DB.del('arquivos', id); st.doc.audios = st.doc.audios.filter(a => a.id !== id); if (st.cam) { st.cam.removerAudio(id); st.cam.acender(null); st.doc.dados = st.cam.dados(); } await pena.salvarDoc(st.doc); desenhaLista();
    }
    let tmGrav = null;
    async function alternarGravacao() {
      if (st.grav) { await pararGravacao(); return; }
      const g = P.criarGravador({ aoParar: null }); if (!g.suporta()) { App.toast('Este navegador não grava áudio.', true); return; }
      try { st.gravId = L.uid('au'); st.grav = g; await g.iniciar(); } catch (e) { st.grav = null; st.gravId = null; App.toast(/denied|NotAllowed|Permission/i.test(e.name + e.message) ? 'Sem permissão para o microfone. Libere o microfone nas permissões do navegador.' : 'Não consegui gravar: ' + e.message, true); return; }
      btnGrava.textContent = 'Parar gravação'; btnGrava.classList.add('p'); tmGrav = setInterval(() => { estadoAud.textContent = 'Gravando ' + P.formatarMs(g.agora() || 0) + ' (máx. ' + Math.round(P.AUDIO.maxMs / 60000) + ' min)'; if (!g.gravando() && st.grav === g) pararGravacao(); }, 500);
    }
    async function pararGravacao() {
      const g = st.grav, id = st.gravId; if (!g) return; clearInterval(tmGrav); st.grav = null; st.gravId = null; btnGrava.textContent = 'Gravar áudio'; btnGrava.classList.remove('p'); estadoAud.textContent = '';
      const r = await g.parar(); const doc = st.doc;
      if (!r) { if (st.cam) st.cam.removerAudio(id); return; }
      const total = await pena.bytesDeAudio(); if (total + r.bytes > P.AUDIO.totalBytes) { App.toast('O limite de áudio do app (' + Math.round(P.AUDIO.totalBytes / 1048576) + ' MB) foi atingido. Apague áudios antigos.', true); if (st.cam) st.cam.removerAudio(id); return; }
      await DB.put('arquivos', { id, blob: r.blob, tipo: 'audio', alvoId: o.alvoId, criado: Date.now() }); doc.audios = (doc.audios || []).concat([{ id, dur: r.duracaoMs, bytes: r.bytes, mime: r.mime, criado: Date.now() }]); if (st.cam && st.doc === doc) doc.dados = st.cam.dados(); await pena.salvarDoc(doc);
      if (r.motivo) App.toast('Gravação encerrada: ' + r.motivo + '.'); desenhaLista();
    }
    async function soltar() {
      if (st.grav) await pararGravacao(); if (st.audioEl) { st.audioEl.pause(); } cancelAnimationFrame(st.raf);
      if (st.cam) { const cam = st.cam; st.cam = null; if (st.doc) { st.doc.dados = cam.dados(); await pena.salvarDoc(st.doc); } cam.destruir(); }
    }
    async function montarEm(pai, chave) {
      const mine = ++st.seq; await soltar(); if (mine !== st.seq || !st.vivo) return; const doc = await pena.carregarDoc(o.tipo, o.alvoId, chave); if (mine !== st.seq || !st.vivo) return;
      st.doc = doc; st.pai = pai; relogio.trocarChave(chave);
      const cam = P.criarCamada({ pai, dados: doc.dados, relogio: () => (st.grav ? st.grav.agora() : null), audioId: () => st.gravId, atalhos: (() => { try { return JSON.parse(localStorage.getItem('doraDraw.penaAtalhos') || 'null'); } catch (e) { return null; } })(), aoMudarAtalhos: (m) => { try { localStorage.setItem('doraDraw.penaAtalhos', JSON.stringify(m)); } catch (e) { /* */ } }, aoMudar: (d) => { if (st.doc !== doc) return; doc.dados = d; pena.salvarDoc(doc); } }); st.cam = cam;
      cam.aoEstado((s) => { st.pref = { ferr: s.ferr, cor: s.cor, esp: s.esp, forma: s.forma }; });
      cam.aoTocarTraco((t) => { if (!t.a || !(doc.audios || []).some(a => a.id === t.a)) { App.toast('Este traço foi feito sem gravação de áudio.'); return; } tocar(t.a, P.instanteDoTraco(t)); });
      const barra = P.criarBarra(cam, { extras: [extras] }); barraAlvo.replaceChildren(barra); cam.ferramenta(st.pref.ferr, st.pref.forma); cam.cor(st.pref.cor); cam.espessura(st.pref.esp); desenhaLista(); return cam;
    }
    async function destruir() { if (!st.vivo) return; st.vivo = false; await soltar(); await relogio.parar(); }
    window.addEventListener('pagehide', () => { if (st.cam) st.cam.salvarAgora(); });
    return { montarEm, destruir, camada: () => st.cam, ferramenta: (f) => st.cam && st.cam.ferramenta(f), flush: soltar };
  };

  // ---------- onde a camada aparece ----------
  pena.botaoQuestao = (bloco, barraAlvo, item) => {
    let ctrl = null, aberto = false; const ensure = async () => { if (!ctrl) { ctrl = pena.controlador({ tipo: 'questao', alvoId: item.id, topicoId: item.topicoId, barraAlvo, modoRelogio: 'questao' }); await ctrl.montarEm(bloco, ''); } return ctrl; };
    const btn = h('button', { class: 'btn mini', type: 'button', 'aria-pressed': 'false', title: 'Rabiscar sobre o enunciado: caneta, marca-texto, fita para tapar alternativas, áudio e relógio', onclick: async () => { aberto = !aberto; btn.setAttribute('aria-pressed', String(aberto)); barraAlvo.classList.toggle('oculto', !aberto); const c = await ensure(); if (!aberto) c.ferramenta('ler'); } }, 'Rabiscar (Dora Pena)');
    setTimeout(async () => { try { if (!bloco.isConnected) return; const d = await pena.carregarDoc('questao', item.id, ''); if (d.dados.e.length || (d.audios || []).length) await ensure(); } catch (e) { console.warn('Dora Pena', e); } }, 0);
    return btn;
  };
  // leitor de PDF: devolve o controlador; o leitor chama montarEm(caixa, pagina) a cada página desenhada
  pena.leitor = (m, barraAlvo) => pena.controlador({ tipo: 'pdf', alvoId: m.id, topicoId: m.topicoId, barraAlvo, modoRelogio: 'cron' });

  // ---------- recebe da extensão (anotação da página, "Errei esta", resultados do modo assistido) ----------
  pena.registrarErro = async (it) => {
    const concursoId = App.S.conc.id; const q = it.questao && it.questao.enunciado ? it.questao : { tipo: 'multipla', enunciado: 'Questão anotada: ' + (it.titulo || it.url || ''), alternativas: [], gabarito: '', comentario: '' };
    const carta = { id: L.uid('c'), concursoId, topicoId: null, tipo: 'questao', enunciado: q.enunciado, alternativas: q.alternativas || [], gabarito: q.gabarito || it.gabarito || '', explicacao: q.comentario || '', banca: q.banca || '', ano: q.ano || null, fonte: it.url || '', origem: 'pena', criado: Date.now() }; if (it.imagem) carta.imagem = it.imagem;
    await App.salvar('cartoes', carta); await App.registrarResposta({ refTipo: 'cartao', item: carta, escolha: it.escolha || '', confianca: 'certeza', ms: it.ms || 0, forcarErro: true });
    const e = App.S.erros.find(x => x.refTipo === 'cartao' && x.refId === carta.id && !x.resolvido); if (e) { if (L.TIPOS_ERRO[it.tipoErro]) e.tipoErro = it.tipoErro; await DB.put('erros', e); } return carta;
  };
  pena.registrarAcerto = async (it) => { const hoje = App.hoje(); await App.salvar('respostas', { id: L.uid('r'), concursoId: App.S.conc.id, topicoId: null, refTipo: 'manual', refId: null, ts: Date.now(), dia: hoje, correta: true, confianca: null, ms: it.ms || 0, escolha: it.escolha || '', qtd: 1, acertos: 1, origem: 'pena' }); };
  async function processar(it) {
    if (it.tipo === 'pena') { const item = { id: L.uid('cap'), ts: Date.now(), concursoId: App.S.conc ? App.S.conc.id : null, tipo: 'pena', titulo: it.titulo || '', url: it.url || '', texto: it.texto || '', imagem: it.imagem || '', questao: it.questao || null, pena: it.pena || null }; await DB.put('capturas', item); if (App.S.conc) App.S.capturas.push(item); return true; }
    if (!App.S.conc) return false; if (it.tipo === 'pena-erro') { await pena.registrarErro(it); return true; } if (it.tipo === 'pena-acerto') { await pena.registrarAcerto(it); return true; } return true;
  }
  pena.importarFila = async () => {
    if (!App.ehExt || pena._importando) return 0; pena._importando = true; let n = 0;
    try {
      const r = await chrome.storage.local.get(CH_FILA); const fila = r[CH_FILA] || []; if (!fila.length) return 0; pena._ignorarAte = Date.now() + 2500; await chrome.storage.local.set({ [CH_FILA]: [] }); const sobra = [];
      for (const it of fila) { try { if (await processar(it)) n++; else sobra.push(it); } catch (e) { console.error('Dora Pena: item descartado', e); } }
      if (sobra.length) { pena._ignorarAte = Date.now() + 2500; await chrome.storage.local.set({ [CH_FILA]: sobra }); }
      if (n) { await App.carregarConcurso(App.S.conc && App.S.conc.id); App.toast(n + (n === 1 ? ' item da Dora Pena recebido.' : ' itens da Dora Pena recebidos.')); if (['inicio', 'erros', 'estudar'].includes(App.rota().nome)) App.render(); }
      if (sobra.length) App.toast(sobra.length + ' item(ns) esperam um concurso aberto para entrar no Diário.', true);
    } finally { pena._importando = false; } return n;
  };
  if (App.ehExt) {
    try { chrome.storage.local.set({ 'doraDraw.perfilAtivo': localStorage.getItem('doraDraw.perfil') || '' }); } catch (e) { /* */ }
    try { chrome.storage.onChanged.addListener((mud, area) => { if (area === 'local' && mud[CH_FILA] && Date.now() > (pena._ignorarAte || 0) && (mud[CH_FILA].newValue || []).length) pena.importarFila(); }); chrome.runtime.onMessage.addListener((msg) => { if (msg && msg.tipo === 'pena-fila') pena.importarFila(); }); } catch (e) { /* sem API */ }
    const espera = setInterval(() => { if (window.__doraPronto) { clearInterval(espera); pena.importarFila(); } }, 300); setTimeout(() => clearInterval(espera), 20000);
  }
})();
