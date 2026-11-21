/* Telas: Estante de materiais (PDFs guardados no navegador, com busca) e Leitor com grifos coloridos. */
(function () {
  const App = window.App, { L, h, DB } = App, V = App.views;
  const CORES = [['#fff176', 'Amarelo'], ['#a5d6a7', 'Verde'], ['#90caf9', 'Azul'], ['#f8bbd0', 'Rosa']];
  const kb = (b) => b > 1048576 ? (b / 1048576).toFixed(1) + ' MB' : Math.round(b / 1024) + ' KB';
  const esc = App.esc;

  App.guardarPdf = guardarPdf;
  async function guardarPdf(arq, prog) {
    const id = L.uid('m'); await DB.put('arquivos', { id, blob: arq }); const m = { id, concursoId: App.S.conc.id, topicoId: null, nome: arq.name.replace(/\.pdf$/i, ''), tamanho: arq.size, paginas: 0, texto: [], indexado: false, criado: Date.now() }; await App.salvar('materiais', m);
    try { const { paginas, n } = await App.textoDoPdf(arq, (i, t) => prog && prog(i, t)); m.paginas = n; m.texto = paginas; m.indexado = paginas.join('').trim().length > 30; await App.salvar('materiais', m); } catch (e) { console.error(e); App.toast('Guardei "' + arq.name + '", mas não consegui ler o texto dele (busca indisponível).', true); }
    return m;
  }

  V.estante = async (alvo) => {
    if (!App.exigeConcurso(alvo)) return; alvo.append(h('h1', {}, 'Estante de materiais'));
    const status = h('div', { class: 'muted peq' }); const arq = h('input', { type: 'file', accept: 'application/pdf,.pdf', multiple: true, 'aria-label': 'Escolher PDFs', onchange: async (e) => { const fs = [...e.target.files]; for (const f of fs) { status.textContent = 'Guardando e lendo "' + f.name + '"...'; await guardarPdf(f, (i, n) => status.textContent = '"' + f.name + '": lendo página ' + i + ' de ' + n); } App.toast(fs.length + ' PDF(s) guardados.'); App.render(); } });
    alvo.append(h('div', { class: 'cartao destaque' }, h('p', { style: 'margin-top:0' }, 'Guarde seus PDFs aqui. Eles ficam só neste navegador (nada é enviado). Depois é possível buscar no texto, grifar com cores e transformar grifos em notas ou cartões.'), h('label', { class: 'campo' }, h('span', {}, 'Adicionar PDFs'), arq), status));
    const busca = h('input', { type: 'search', placeholder: 'Buscar em todos os materiais', 'aria-label': 'Buscar nos textos' }); const res = h('div', { class: 'pilha' });
    busca.addEventListener('input', () => {
      res.replaceChildren(); const b = busca.value.trim().toLowerCase(); if (b.length < 3) return; let n = 0;
      for (const m of App.S.materiais) (m.texto || []).forEach((t, i) => { if (n >= 40) return; const k = t.toLowerCase().indexOf(b); if (k < 0) return; n++; const ini = Math.max(0, k - 60); const trecho = t.slice(ini, k + b.length + 90).replace(/\s+/g, ' '); res.append(h('a', { class: 'afundado', href: '#/leitor/' + m.id + '?p=' + (i + 1), style: 'text-decoration:none;color:inherit;display:block' }, h('div', { class: 'peq muted' }, m.nome + ' · página ' + (i + 1)), h('div', {}, (ini ? '…' : '') + trecho + '…'))); });
      if (!res.children.length) res.append(h('div', { class: 'vazio' }, App.vazioFig('sem-resultados'), 'Nada encontrado.'));
    });
    if (App.S.materiais.length) alvo.append(h('div', { class: 'cartao' }, h('label', { class: 'campo' }, h('span', {}, 'Busca nos textos'), busca), res));
    const g = h('div', { class: 'grade' }); alvo.append(g); if (!App.S.materiais.length) alvo.append(h('div', { class: 'vazio' }, 'Nenhum material guardado ainda.'));
    App.S.materiais.forEach(m => g.append(h('div', { class: 'cartao' }, h('h3', { style: 'overflow-wrap:anywhere' }, m.nome), h('div', { class: 'meta linha', style: 'margin-bottom:8px' }, h('span', { class: 'chip' }, (m.paginas || '?') + ' páginas'), h('span', { class: 'chip' }, kb(m.tamanho || 0)), m.indexado ? h('span', { class: 'chip ok' }, 'com busca') : h('span', { class: 'chip aviso' }, 'sem busca')),
      h('label', { class: 'campo', style: 'margin-bottom:8px' }, h('span', {}, 'Tópico ligado'), App.selTopico(m.topicoId, async (v) => { m.topicoId = v; await App.salvar('materiais', m); })), h('div', { class: 'linha' }, h('a', { class: 'btn mini p', href: '#/leitor/' + m.id }, 'Abrir e grifar'), h('button', { class: 'btn mini', onclick: async () => { const a = await DB.get('arquivos', m.id); if (a) App.baixar(m.nome + '.pdf', a.blob); } }, 'Baixar'), h('button', { class: 'btn mini perigo', onclick: async () => { if (!(await App.confirmar('Apagar "' + m.nome + '" e todos os grifos dele?', 'Apagar'))) return; await DB.del('arquivos', m.id); await App.pena.apagarDocsDe(m.id); await DB.delMuitos('grifos', (await DB.porIndice('grifos', 'materialId', m.id)).map(x => x.id)); await App.remover('materiais', m.id); App.render(); } }, 'Apagar')))));
  };

  V.leitor = async (alvo, r) => {
    const m = App.S.materiais.find(x => x.id === r.args[0]); if (!m) { alvo.append(h('div', { class: 'cartao vazio' }, h('p', {}, 'Material não encontrado.'), h('a', { class: 'btn p', href: '#/estante' }, 'Voltar à estante'))); return; }
    const arq = await DB.get('arquivos', m.id); if (!arq) { alvo.append(h('div', { class: 'cartao vazio' }, 'O arquivo deste material não está mais guardado.')); return; }
    const pdf = await App.abrirPdf(arq.blob); const lib = await App.carregarPdfJs(); let pag = Math.max(1, Math.min(pdf.numPages, +r.query.p || 1)); let zoom = 1; let grifos = await DB.porIndice('grifos', 'materialId', m.id); let pendente = null; let seq = 0;
    const barraPena = h('div', { class: 'oculto' }); let penaAberta = false; const ctrlPena = App.pena.leitor(m, barraPena); App.aoSair(() => ctrlPena.destruir());
    const btnPena = h('button', { class: 'btn mini', type: 'button', 'aria-pressed': 'false', title: 'Dora Pena: anotar sobre a página (caneta, marca-texto, fita, áudio, relógio)', onclick: () => { penaAberta = !penaAberta; btnPena.setAttribute('aria-pressed', String(penaAberta)); barraPena.classList.toggle('oculto', !penaAberta); if (!penaAberta) ctrlPena.ferramenta('ler'); } }, 'Dora Pena');
    const palco = h('div'); const lateral = h('div', { class: 'pilha' }); const barraSel = h('div', { class: 'barra-sel oculto', role: 'toolbar', 'aria-label': 'Grifar seleção' });
    const num = h('input', { type: 'number', min: 1, max: pdf.numPages, value: pag, style: 'width:80px', 'aria-label': 'Página', onchange: (e) => { pag = Math.max(1, Math.min(pdf.numPages, +e.target.value || 1)); desenha(); } });
    alvo.append(h('div', { class: 'linha entre' }, h('h1', { style: 'margin:0;overflow-wrap:anywhere' }, m.nome), h('a', { class: 'btn mini', href: '#/estante' }, 'Estante')), h('div', { class: 'ferr', style: 'margin:10px 0' }, h('button', { class: 'btn mini', onclick: () => { if (pag > 1) { pag--; desenha(); } } }, '← Anterior'), num, h('span', { class: 'muted', style: 'align-self:center' }, 'de ' + pdf.numPages), h('button', { class: 'btn mini', onclick: () => { if (pag < pdf.numPages) { pag++; desenha(); } } }, 'Próxima →'), h('button', { class: 'btn mini', 'aria-label': 'Diminuir', onclick: () => { zoom = Math.max(0.6, zoom - 0.2); desenha(); } }, 'A−'), h('button', { class: 'btn mini', 'aria-label': 'Aumentar', onclick: () => { zoom = Math.min(2.4, zoom + 0.2); desenha(); } }, 'A+'), btnPena), barraPena, h('div', { class: 'leitor' }, h('div', { style: 'min-width:0;overflow:auto' }, palco), lateral), barraSel);
    document.body.append(barraSel); App.aoSair(() => barraSel.remove());
    async function desenha() {
      const mine = ++seq; num.value = pag; const page = await pdf.getPage(pag); if (mine !== seq) return; const base = page.getViewport({ scale: 1 }); const larg = Math.min(palco.parentElement.clientWidth || 700, 1000) * zoom; const vp = page.getViewport({ scale: larg / base.width }); const dpr = window.devicePixelRatio || 1;
      const caixa = h('div', { class: 'pag-caixa', style: 'width:' + vp.width + 'px;height:' + vp.height + 'px' }); const cv = h('canvas', { width: Math.floor(vp.width * dpr), height: Math.floor(vp.height * dpr), style: 'width:100%;height:100%' }); const tl = h('div', { class: 'textLayer' }); tl.style.setProperty('--scale-factor', String(vp.scale)); const gl = h('div', { style: 'position:absolute;inset:0;pointer-events:none' }); caixa.append(cv, gl, tl); palco.replaceChildren(caixa);
      await page.render({ canvasContext: cv.getContext('2d'), viewport: vp, transform: dpr !== 1 ? [dpr, 0, 0, dpr, 0, 0] : null }).promise; if (mine !== seq) return;
      try { if (lib.TextLayer) await new lib.TextLayer({ textContentSource: page.streamTextContent(), container: tl, viewport: vp }).render(); } catch (e) { console.warn('camada de texto', e); }
      marcas(gl); lista(); ctrlPena.montarEm(caixa, pag);
      caixa.addEventListener('pointerup', () => setTimeout(() => leSel(caixa, tl), 30)); document.addEventListener('selectionchange', escondeSeVazio, { once: true });
    }
    function marcas(gl) { gl.replaceChildren(); grifos.filter(g => g.pagina === pag).forEach(g => (g.rects || []).forEach(rc => gl.append(h('div', { class: 'grifo-ret', style: `left:${rc.x * 100}%;top:${rc.y * 100}%;width:${rc.w * 100}%;height:${rc.h * 100}%;background:${g.cor}` })))); }
    function escondeSeVazio() { const s = getSelection(); if (!s || s.isCollapsed) barraSel.classList.add('oculto'); }
    function leSel(caixa, tl) {
      const s = getSelection(); if (!s || s.isCollapsed || !s.rangeCount || !tl.contains(s.anchorNode)) { barraSel.classList.add('oculto'); return; }
      const rg = s.getRangeAt(0); const cr = caixa.getBoundingClientRect(); const rects = [...rg.getClientRects()].filter(x => x.width > 2 && x.height > 2).map(x => ({ x: (x.left - cr.left) / cr.width, y: (x.top - cr.top) / cr.height, w: x.width / cr.width, h: x.height / cr.height }));
      const texto = s.toString().replace(/\s+/g, ' ').trim(); if (!texto || !rects.length) { barraSel.classList.add('oculto'); return; } pendente = { texto, rects };
      const ult = rg.getBoundingClientRect(); barraSel.style.left = Math.max(8, Math.min(window.innerWidth - 270, ult.left)) + 'px'; barraSel.style.top = Math.min(window.innerHeight - 70, ult.bottom + 8) + 'px'; barraSel.classList.remove('oculto');
    }
    async function grifar(cor, comNota) { if (!pendente) return; let nota = ''; if (comNota) { nota = await App.pedir('Anotação do grifo', 'Sua anotação', '', true); if (nota == null) return; } const g = { id: L.uid('g'), materialId: m.id, concursoId: App.S.conc.id, topicoId: m.topicoId || null, pagina: pag, cor, texto: pendente.texto, nota, rects: pendente.rects, criado: Date.now() }; await DB.put('grifos', g); grifos.push(g); pendente = null; barraSel.classList.add('oculto'); getSelection().removeAllRanges(); desenha(); }
    CORES.forEach(([c, n]) => barraSel.append(h('button', { class: 'cor', style: 'background:' + c, 'aria-label': 'Grifar de ' + n.toLowerCase(), title: n, onmousedown: (e) => e.preventDefault(), onclick: () => grifar(c, false) })));
    barraSel.append(h('button', { class: 'btn mini', onmousedown: (e) => e.preventDefault(), onclick: () => grifar(CORES[0][0], true) }, 'Anotar'));
    function lista() {
      lateral.replaceChildren(h('h3', { style: 'margin:0' }, 'Grifos (' + grifos.length + ')'), h('p', { class: 'muted peq', style: 'margin:0' }, 'Selecione um trecho no PDF e escolha uma cor.'));
      if (!grifos.length) lateral.append(h('div', { class: 'vazio' }, App.vazioFig('sem-anotacoes'), 'Nenhum grifo ainda.'));
      grifos.slice().sort((a, b) => a.pagina - b.pagina || a.criado - b.criado).forEach(g => {
        const nt = h('input', { type: 'text', value: g.nota || '', placeholder: 'Anotação', 'aria-label': 'Anotação do grifo', onchange: async (e) => { g.nota = e.target.value; await DB.put('grifos', g); } });
        lateral.append(h('div', { class: 'cartao', style: 'margin:0' }, h('div', { class: 'peq muted' }, 'Página ' + g.pagina), h('div', { style: 'overflow-wrap:anywhere;margin:4px 0 8px' }, h('mark', { style: 'background:' + g.cor }, g.texto.slice(0, 280))), nt,
          h('label', { class: 'campo', style: 'margin:8px 0' }, h('span', {}, 'Tópico'), App.selTopico(g.topicoId, async (v) => { g.topicoId = v; await DB.put('grifos', g); })),
          h('div', { class: 'linha', style: 'gap:4px' }, h('button', { class: 'btn mini', onclick: () => { pag = g.pagina; desenha(); } }, 'Ir'), h('button', { class: 'btn mini', onclick: async () => { const t = App.topico(g.topicoId); if (!t) { App.toast('Escolha o tópico do grifo primeiro.', true); return; } t.notaHtml = (t.notaHtml || '') + '<p><mark>' + esc(g.texto) + '</mark></p>' + (g.nota ? '<p>' + esc(g.nota) + '</p>' : '') + '<p>(' + esc(m.nome) + ', página ' + g.pagina + ')</p>'; await App.salvar('topicos', t); App.toast('Virou nota em "' + t.titulo + '".'); } }, 'Virar nota'), h('button', { class: 'btn mini', onclick: async () => { const fr = await App.pedir('Cartão: pergunta (frente)', 'A resposta será o trecho grifado', g.nota || 'O que diz este trecho?', true); if (!fr) return; await App.salvar('cartoes', { id: L.uid('c'), concursoId: App.S.conc.id, topicoId: g.topicoId || null, tipo: 'basico', frente: fr, verso: g.texto, fonte: m.nome + ', p. ' + g.pagina, origem: 'grifo', criado: Date.now() }); App.toast('Cartão criado.'); } }, 'Virar cartão'), h('button', { class: 'btn mini', onclick: () => App.gerarCartoesIA(g.topicoId, g.texto) }, 'Cartões com IA'), h('button', { class: 'btn mini perigo', 'aria-label': 'Apagar grifo', onclick: async () => { await DB.del('grifos', g.id); grifos = grifos.filter(x => x.id !== g.id); desenha(); } }, '✕')))); });
    }
    desenha();
  };
})();
