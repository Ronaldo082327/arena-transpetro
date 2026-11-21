/* Dora Draw — editores: Notas (texto rico), Mapa mental (SVG) e Quadro (desenho vetorial em canvas). */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const h = (tag, at = {}, ...filhos) => { const e = document.createElement(tag); for (const k in at) { if (k === 'class') e.className = at[k]; else if (k.startsWith('on')) e.addEventListener(k.slice(2), at[k]); else if (at[k] != null && at[k] !== false) e.setAttribute(k, at[k] === true ? '' : at[k]); } filhos.flat().forEach(f => e.append(f && f.nodeType ? f : document.createTextNode(f == null ? '' : f))); return e; };
  const SVGNS = 'http://www.w3.org/2000/svg';
  const sv = (tag, at = {}) => { const e = document.createElementNS(SVGNS, tag); for (const k in at) e.setAttribute(k, at[k]); return e; };

  // ================= NOTAS =================
  const PERMITIDAS = new Set(['P', 'DIV', 'BR', 'B', 'STRONG', 'I', 'EM', 'U', 'MARK', 'UL', 'OL', 'LI', 'H3', 'H4', 'IMG', 'SPAN', 'BLOCKQUOTE']);
  function sanitizar(html) {
    const doc = new DOMParser().parseFromString('<div>' + (html || '') + '</div>', 'text/html'); const raiz = doc.body.firstChild;
    (function limpa(no) {
      [...no.childNodes].forEach(f => {
        if (f.nodeType === 3) return; if (f.nodeType !== 1) { f.remove(); return; }
        if (!PERMITIDAS.has(f.tagName)) { if (/^(SCRIPT|STYLE|IFRAME|OBJECT|EMBED|svg|SVG)$/i.test(f.tagName)) { f.remove(); return; } limpa(f); f.replaceWith(...f.childNodes); return; }
        [...f.attributes].forEach(a => { const ok = f.tagName === 'IMG' && a.name === 'src' && /^data:image\/(png|jpeg|webp|gif);base64,/i.test(a.value); if (!ok) f.removeAttribute(a.name); });
        if (f.tagName === 'IMG' && !f.getAttribute('src')) { f.remove(); return; }
        limpa(f);
      });
    })(raiz);
    return raiz.innerHTML;
  }
  function imagemReduzida(arquivo, max = 900) {
    return new Promise((res, rej) => { const fr = new FileReader(); fr.onload = () => { const im = new Image(); im.onload = () => { const k = Math.min(1, max / Math.max(im.width, im.height)); const c = document.createElement('canvas'); c.width = Math.round(im.width * k); c.height = Math.round(im.height * k); const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height); g.drawImage(im, 0, 0, c.width, c.height); res(c.toDataURL('image/jpeg', 0.72)); }; im.onerror = rej; im.src = fr.result; }; fr.onerror = rej; fr.readAsDataURL(arquivo); });
  }
  function editorNotas(alvo, html, aoMudar, avisar) {
    const ed = h('div', { class: 'editor rico', contenteditable: 'true', role: 'textbox', 'aria-multiline': 'true', 'aria-label': 'Notas do tópico', 'data-vazio': 'Escreva aqui. Use os botões para título, lista, negrito e destaque. Cole uma imagem com Ctrl+V.' });
    ed.innerHTML = sanitizar(html);
    const cmd = (c, v) => { ed.focus(); document.execCommand(c, false, v); mudou(); };
    const destacar = () => { ed.focus(); const sel = getSelection(); if (!sel.rangeCount || sel.isCollapsed) { avisar('Selecione o trecho que quer destacar.'); return; } const r = sel.getRangeAt(0); const m = document.createElement('mark'); try { r.surroundContents(m); } catch (e) { m.append(r.extractContents()); r.insertNode(m); } sel.removeAllRanges(); mudou(); };
    const B = (rot, titulo, fn) => h('button', { class: 'btn mini', type: 'button', title: titulo, 'aria-label': titulo, onmousedown: (e) => e.preventDefault(), onclick: fn }, rot);
    const ferr = h('div', { class: 'ferr', role: 'toolbar', 'aria-label': 'Formatação' },
      B('Título', 'Título', () => cmd('formatBlock', 'H3')), B('Texto', 'Texto normal', () => cmd('formatBlock', 'P')),
      B('• Lista', 'Lista com marcadores', () => cmd('insertUnorderedList')), B('1. Lista', 'Lista numerada', () => cmd('insertOrderedList')),
      B(h('b', {}, 'N'), 'Negrito', () => cmd('bold')), B(h('mark', {}, 'Destaque'), 'Destacar', destacar),
      B('Limpar', 'Tirar formatação', () => cmd('removeFormat')));
    let t = null; const mudou = () => { clearTimeout(t); t = setTimeout(() => aoMudar(sanitizar(ed.innerHTML)), 500); };
    ed.addEventListener('input', mudou);
    ed.addEventListener('paste', async (e) => {
      const itens = [...(e.clipboardData && e.clipboardData.items || [])]; const img = itens.find(i => i.type.startsWith('image/'));
      if (img) { e.preventDefault(); try { const url = await imagemReduzida(img.getAsFile()); document.execCommand('insertHTML', false, '<img src="' + url + '" alt="">'); mudou(); } catch (er) { avisar('Não consegui colar a imagem.'); } return; }
      const txt = e.clipboardData && e.clipboardData.getData('text/plain'); if (txt != null) { e.preventDefault(); document.execCommand('insertText', false, txt); }
    });
    alvo.append(ferr, ed);
    return { sair() { clearTimeout(t); aoMudar(sanitizar(ed.innerHTML)); } };
  }

  // ================= MAPA MENTAL =================
  const CORES_NO = ['#fde3cc', '#e1eff1', '#ece4f6', '#e2f1e4', '#ffe7a8', '#fbe5e1'];
  const BORDA_NO = ['#d27330', '#1f6470', '#6a4a9c', '#2d6b3c', '#a07a10', '#b0372b'];
  function quebra(t, max = 20) { const ps = String(t || '').split(/\s+/); const ls = []; let l = ''; ps.forEach(p => { if ((l + ' ' + p).trim().length > max && l) { ls.push(l); l = p; } else l = (l + ' ' + p).trim(); }); if (l) ls.push(l); if (ls.length > 4) { ls.length = 4; ls[3] += '…'; } return ls.length ? ls : ['']; }
  function editorMapa(alvo, dados, titulo, aoMudar) {
    const m = dados && dados.nos && dados.nos.length ? JSON.parse(JSON.stringify(dados)) : { nos: [{ id: 'r', pai: null, t: titulo, x: 0, y: 0, cor: 0 }], z: 1, px: 0, py: 0 };
    let sel = m.nos[0].id; let seq = Date.now() % 100000;
    const svg = sv('svg', { class: 'mapa', role: 'img', 'aria-label': 'Mapa mental' }); const g = sv('g'); svg.append(g);
    const entrada = h('input', { type: 'text', 'aria-label': 'Texto do nó selecionado', maxlength: '90' });
    const salvar = () => aoMudar(JSON.parse(JSON.stringify(m)));
    const no = (id) => m.nos.find(n => n.id === id);
    const tam = (n) => { const ls = quebra(n.t); return { ls, w: Math.max(80, Math.min(190, Math.max(...ls.map(l => l.length)) * 8 + 24)), hh: ls.length * 18 + 16 }; };
    function desenha() {
      g.innerHTML = ''; const W = svg.clientWidth || 600, H = svg.clientHeight || 460;
      g.setAttribute('transform', `translate(${W / 2 + m.px},${H / 2 + m.py}) scale(${m.z})`);
      m.nos.forEach(n => { if (n.pai == null) return; const p = no(n.pai); if (!p) return; const mx = (p.x + n.x) / 2;
        g.append(sv('path', { d: `M${p.x},${p.y} C${mx},${p.y} ${mx},${n.y} ${n.x},${n.y}`, fill: 'none', stroke: BORDA_NO[n.cor || 0], 'stroke-width': 2.2, opacity: .7 })); });
      m.nos.forEach(n => { const { ls, w, hh } = tam(n); const gr = sv('g', { class: 'no' + (n.id === sel ? ' sel' : ''), transform: `translate(${n.x},${n.y})`, 'data-id': n.id });
        gr.append(sv('rect', { x: -w / 2, y: -hh / 2, width: w, height: hh, rx: n.pai == null ? 16 : 11, fill: CORES_NO[n.cor || 0], stroke: BORDA_NO[n.cor || 0] }));
        ls.forEach((l, i) => { const tx = sv('text', { x: 0, y: -hh / 2 + 22 + i * 18, 'text-anchor': 'middle', 'font-weight': n.pai == null ? 700 : 500 }); tx.textContent = l; gr.append(tx); });
        g.append(gr); });
      const s = no(sel); entrada.value = s ? s.t : '';
    }
    const filhos = (id) => m.nos.filter(n => n.pai === id);
    function novo(pai) { const p = no(pai); const fs = filhos(pai); const lado = p.pai == null ? (fs.length % 2 ? -1 : 1) : (p.x >= (no(p.pai) || p).x ? 1 : -1);
      const n = { id: 'n' + (seq++), pai, t: 'Nova ideia', x: p.x + lado * 220, y: p.y + (fs.length - (fs.length > 0 ? 0.5 : 0)) * 70 - 30 * fs.length / 2, cor: p.pai == null ? (fs.length + 1) % CORES_NO.length : p.cor };
      m.nos.push(n); sel = n.id; desenha(); salvar(); entrada.focus(); entrada.select(); }
    function ajustar() { // enquadra todos os nós no palco
      const W = svg.clientWidth || 600, H = svg.clientHeight || 460; let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
      m.nos.forEach(n => { const { w, hh } = tam(n); x0 = Math.min(x0, n.x - w / 2); x1 = Math.max(x1, n.x + w / 2); y0 = Math.min(y0, n.y - hh / 2); y1 = Math.max(y1, n.y + hh / 2); });
      m.z = Math.max(0.5, Math.min(1.2, (W - 24) / (x1 - x0), (H - 24) / (y1 - y0))); m.px = -((x0 + x1) / 2) * m.z; m.py = -((y0 + y1) / 2) * m.z; desenha(); }
    function foraDoPalco() { const W = svg.clientWidth || 600, H = svg.clientHeight || 460; return m.nos.some(n => { const { w } = tam(n); const sx = W / 2 + m.px + n.x * m.z, sy = H / 2 + m.py + n.y * m.z; return sx - w * m.z / 2 < 0 || sx + w * m.z / 2 > W || sy < 0 || sy > H; }); }
    function organizar() { // árvore: raiz no centro, ramos alternando direita/esquerda
      const raiz = m.nos.find(n => n.pai == null); raiz.x = 0; raiz.y = 0; const ramos = filhos(raiz.id); const lados = [[], []]; ramos.forEach((r, i) => lados[i % 2].push(r));
      const altura = (n) => Math.max(1, filhos(n.id).reduce((a, f) => a + altura(f), 0));
      lados.forEach((lista, li) => { const dir = li === 0 ? 1 : -1; let total = lista.reduce((a, n) => a + altura(n), 0); let y = -total * 70 / 2;
        const coloca = (n, nivel, y0) => { const a = altura(n); n.x = dir * 230 * nivel; n.y = y0 + a * 70 / 2; let yy = y0; filhos(n.id).forEach(f => { coloca(f, nivel + 1, yy); yy += altura(f) * 70; }); };
        lista.forEach(n => { coloca(n, 1, y); y += altura(n) * 70; }); });
      ajustar(); salvar(); }
    // arrastar nó ou o fundo
    let arr = null;
    svg.addEventListener('pointerdown', (e) => { const gr = e.target.closest('.no'); svg.setPointerCapture(e.pointerId);
      if (gr) { sel = gr.dataset.id; const n = no(sel); arr = { tipo: 'no', n, x: e.clientX, y: e.clientY, ox: n.x, oy: n.y, mov: false }; desenha(); }
      else arr = { tipo: 'fundo', x: e.clientX, y: e.clientY, ox: m.px, oy: m.py }; });
    svg.addEventListener('pointermove', (e) => { if (!arr) return; const dx = e.clientX - arr.x, dy = e.clientY - arr.y;
      if (arr.tipo === 'no') { if (Math.abs(dx) + Math.abs(dy) > 3) arr.mov = true; arr.n.x = Math.round(arr.ox + dx / m.z); arr.n.y = Math.round(arr.oy + dy / m.z); } else { m.px = arr.ox + dx; m.py = arr.oy + dy; } desenha(); });
    const solta = () => { if (arr && (arr.tipo === 'fundo' || arr.mov)) salvar(); arr = null; };
    svg.addEventListener('pointerup', solta); svg.addEventListener('pointercancel', solta);
    svg.addEventListener('dblclick', () => { entrada.focus(); entrada.select(); });
    svg.addEventListener('wheel', (e) => { e.preventDefault(); m.z = Math.max(0.3, Math.min(2.5, m.z * (e.deltaY < 0 ? 1.1 : 0.9))); desenha(); }, { passive: false });
    entrada.addEventListener('input', () => { const n = no(sel); if (n) { n.t = entrada.value; desenha(); } });
    entrada.addEventListener('change', salvar);
    entrada.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); salvar(); entrada.blur(); } });
    const B = (rot, fn, extra = {}) => h('button', Object.assign({ class: 'btn mini', type: 'button', onclick: fn }, extra), rot);
    const apagar = () => { const n = no(sel); if (!n || n.pai == null) return; const tira = new Set([n.id]); let mudou = true; while (mudou) { mudou = false; m.nos.forEach(x => { if (x.pai && tira.has(x.pai) && !tira.has(x.id)) { tira.add(x.id); mudou = true; } }); } m.nos = m.nos.filter(x => !tira.has(x.id)); sel = n.pai; desenha(); salvar(); };
    const cores = h('div', { class: 'cores', role: 'group', 'aria-label': 'Cor do nó' }, CORES_NO.map((c, i) => h('button', { type: 'button', class: 'cor', style: `background:${c};border-color:${BORDA_NO[i]}`, 'aria-label': 'Cor ' + (i + 1), onclick: () => { const n = no(sel); if (n) { n.cor = i; desenha(); salvar(); } } })));
    alvo.append(
      h('div', { class: 'ferr' }, B('+ Filho', () => novo(sel)), B('+ Irmão', () => { const n = no(sel); novo(n && n.pai != null ? n.pai : sel); }), B('Apagar nó', apagar), B('−', () => { m.z = Math.max(0.3, m.z * 0.85); desenha(); }, { 'aria-label': 'Diminuir zoom' }), B('+', () => { m.z = Math.min(2.5, m.z * 1.15); desenha(); }, { 'aria-label': 'Aumentar zoom' }), B('Organizar', organizar), B('Ver tudo', () => { ajustar(); salvar(); })),
      h('div', { class: 'linha', style: 'margin-bottom:8px' }, h('label', { class: 'campo', style: 'flex:1;min-width:180px' }, h('span', {}, 'Texto do nó selecionado (Enter salva)'), entrada), cores),
      h('div', { class: 'palco' }, svg));
    requestAnimationFrame(() => { desenha(); if (foraDoPalco()) ajustar(); }); const ro = new ResizeObserver(() => desenha()); ro.observe(svg);
    return { sair() { ro.disconnect(); } };
  }

  // ================= QUADRO =================
  const W = 1200, H = 800; // coordenadas lógicas
  const CORES_Q = ['#2b2420', '#c2410c', '#1d4ed8', '#15803d', '#a21caf', '#dc2626', '#f59e0b', '#ffffff'];
  function simplifica(pts, d = 2.2) { if (pts.length <= 4) return pts; const o = [pts[0], pts[1]]; for (let i = 2; i < pts.length - 2; i += 2) { const dx = pts[i] - o[o.length - 2], dy = pts[i + 1] - o[o.length - 1]; if (dx * dx + dy * dy >= d * d) o.push(pts[i], pts[i + 1]); } o.push(pts[pts.length - 2], pts[pts.length - 1]); return o; }
  let semImg = null; const cacheImg = {};
  function imgDe(u) { if (!cacheImg[u]) { const im = new Image(); im.onload = () => { if (semImg) semImg(); }; im.src = u; cacheImg[u] = im; } return cacheImg[u]; }
  function desenhaElem(g, el) {
    g.save(); g.strokeStyle = g.fillStyle = CORES_Q[el.c] || el.c || '#2b2420'; g.lineWidth = el.w || 3; g.lineCap = 'round'; g.lineJoin = 'round';
    if (el.k === 'm') { g.globalAlpha = 0.35; g.lineWidth = (el.w || 3) * 4; }
    const p = el.p || [];
    if (el.k === 'p' || el.k === 'm') { g.beginPath(); g.moveTo(p[0], p[1]); if (p.length === 2) g.lineTo(p[0] + 0.1, p[1]); for (let i = 2; i < p.length; i += 2) g.lineTo(p[i], p[i + 1]); g.stroke(); }
    else if (el.k === 'l' || el.k === 'a') { g.beginPath(); g.moveTo(p[0], p[1]); g.lineTo(p[2], p[3]); g.stroke(); if (el.k === 'a') { const an = Math.atan2(p[3] - p[1], p[2] - p[0]); const L = 12 + (el.w || 3) * 3; g.beginPath(); g.moveTo(p[2], p[3]); g.lineTo(p[2] - L * Math.cos(an - 0.45), p[3] - L * Math.sin(an - 0.45)); g.lineTo(p[2] - L * Math.cos(an + 0.45), p[3] - L * Math.sin(an + 0.45)); g.closePath(); g.fill(); } }
    else if (el.k === 'r') { g.strokeRect(Math.min(p[0], p[2]), Math.min(p[1], p[3]), Math.abs(p[2] - p[0]), Math.abs(p[3] - p[1])); }
    else if (el.k === 'e') { g.beginPath(); g.ellipse((p[0] + p[2]) / 2, (p[1] + p[3]) / 2, Math.abs(p[2] - p[0]) / 2 || 1, Math.abs(p[3] - p[1]) / 2 || 1, 0, 0, Math.PI * 2); g.stroke(); }
    else if (el.k === 'i') { const im = imgDe(el.u); if (im.complete && im.naturalWidth) g.drawImage(im, p[0], p[1], p[2] - p[0], p[3] - p[1]); }
    else if (el.k === 't') { g.font = `600 ${10 + (el.w || 3) * 5}px "Segoe UI", system-ui, sans-serif`; g.textBaseline = 'top'; String(el.s || '').split('\n').forEach((l, i) => g.fillText(l, p[0], p[1] + i * (14 + (el.w || 3) * 6))); }
    g.restore();
  }
  function tocaElem(el, x, y, r) { // borracha: o ponto encosta no elemento?
    const p = el.p || []; const perto = (ax, ay, bx, by) => { const dx = bx - ax, dy = by - ay; const l = dx * dx + dy * dy; let t = l ? ((x - ax) * dx + (y - ay) * dy) / l : 0; t = Math.max(0, Math.min(1, t)); const px = ax + t * dx - x, py = ay + t * dy - y; return px * px + py * py <= r * r; };
    if (el.k === 'p' || el.k === 'm') { if (p.length === 2) return perto(p[0], p[1], p[0], p[1]); for (let i = 2; i < p.length; i += 2) if (perto(p[i - 2], p[i - 1], p[i], p[i + 1])) return true; return false; }
    if (el.k === 'l' || el.k === 'a') return perto(p[0], p[1], p[2], p[3]);
    if (el.k === 'r' || el.k === 'e' || el.k === 'i') { const x0 = Math.min(p[0], p[2]) - r, x1 = Math.max(p[0], p[2]) + r, y0 = Math.min(p[1], p[3]) - r, y1 = Math.max(p[1], p[3]) + r; return x >= x0 && x <= x1 && y >= y0 && y <= y1; }
    if (el.k === 't') return x >= p[0] - r && x <= p[0] + 30 * String(el.s || '').length / 2 + r && y >= p[1] - r && y <= p[1] + 40 + r;
    return false;
  }
  function editorQuadro(alvo, dados, aoMudar, avisar, baixar) {
    let els = (dados && Array.isArray(dados.e)) ? dados.e.slice() : []; const desfeitos = []; const pilha = []; // pilha: estados anteriores (cópias rasas)
    let ferr = 'p', cor = 0, esp = 3; let atual = null;
    const cv = h('canvas', { width: W, height: H, 'aria-label': 'Quadro de desenho' }); const g = cv.getContext('2d');
    const caixa = h('div', { class: 'quadro-caixa' });
    const salvar = () => aoMudar({ v: 1, w: W, h: H, e: els });
    function redesenha() { g.clearRect(0, 0, W, H); g.fillStyle = '#fffdf9'; g.fillRect(0, 0, W, H); g.save(); g.strokeStyle = 'rgba(120,90,60,.08)'; g.lineWidth = 1; for (let x = 40; x < W; x += 40) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); } for (let y = 40; y < H; y += 40) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); } g.restore(); els.forEach(el => desenhaElem(g, el)); if (atual) desenhaElem(g, atual); }
    const ponto = (e) => { const r = cv.getBoundingClientRect(); return [Math.round((e.clientX - r.left) * W / r.width), Math.round((e.clientY - r.top) * H / r.height)]; };
    const guardar = () => { pilha.push(els.slice()); if (pilha.length > 80) pilha.shift(); desfeitos.length = 0; };
    let apagando = false;
    cv.addEventListener('pointerdown', (e) => { e.preventDefault(); cv.setPointerCapture(e.pointerId); const [x, y] = ponto(e);
      if (ferr === 't') { pedirTexto(x, y, e); return; }
      if (ferr === 'x') { guardar(); apagando = true; apagaEm(x, y); return; }
      atual = { k: ferr, c: cor, w: esp, p: [x, y].concat(ferr === 'p' || ferr === 'm' ? [] : [x, y]) }; redesenha(); });
    cv.addEventListener('pointermove', (e) => { const [x, y] = ponto(e); if (apagando) { apagaEm(x, y); return; } if (!atual) return; if (atual.k === 'p' || atual.k === 'm') atual.p.push(x, y); else { atual.p[2] = x; atual.p[3] = y; } redesenha(); });
    const fim = () => { if (apagando) { apagando = false; salvar(); return; } if (!atual) return; if (atual.k === 'p' || atual.k === 'm') atual.p = simplifica(atual.p); guardar(); els.push(atual); atual = null; redesenha(); salvar(); };
    cv.addEventListener('pointerup', fim); cv.addEventListener('pointercancel', fim);
    function apagaEm(x, y) { const antes = els.length; els = els.filter(el => !tocaElem(el, x, y, 10 + esp * 2)); if (els.length !== antes) redesenha(); }
    function pedirTexto(x, y) {
      const r = cv.getBoundingClientRect(); const cx = r.left + x * r.width / W - caixa.getBoundingClientRect().left; const cy = r.top + y * r.height / H - caixa.getBoundingClientRect().top;
      const inp = h('input', { type: 'text', class: 'txt-flutua', placeholder: 'Digite e tecle Enter', 'aria-label': 'Texto no quadro', style: `left:${Math.min(cx, caixa.clientWidth - 170)}px;top:${cy}px` });
      const ok = () => { const s = inp.value.trim(); inp.remove(); if (s) { guardar(); els.push({ k: 't', c: cor, w: esp, p: [x, y], s: s.slice(0, 200) }); redesenha(); salvar(); } };
      inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') ok(); if (e.key === 'Escape') inp.remove(); }); inp.addEventListener('blur', ok);
      caixa.append(inp); setTimeout(() => inp.focus(), 0);
    }
    const desfazer = () => { if (!pilha.length) return; desfeitos.push(els); els = pilha.pop(); redesenha(); salvar(); };
    const refazer = () => { if (!desfeitos.length) return; pilha.push(els); els = desfeitos.pop(); redesenha(); salvar(); };
    const FERR = [['p', 'Caneta'], ['m', 'Marcador'], ['x', 'Borracha'], ['l', 'Linha'], ['a', 'Seta'], ['r', 'Retângulo'], ['e', 'Elipse'], ['t', 'Texto']];
    const bFerr = FERR.map(([k, n]) => h('button', { type: 'button', 'aria-pressed': String(k === ferr), onclick: () => { ferr = k; bFerr.forEach((b, i) => b.setAttribute('aria-pressed', String(FERR[i][0] === k))); } }, n));
    const bCor = CORES_Q.map((c, i) => h('button', { type: 'button', class: 'cor', style: `background:${c}${c === '#ffffff' ? ';border-color:#ccc' : ''}`, 'aria-label': 'Cor ' + (i + 1), 'aria-pressed': String(i === cor), onclick: () => { cor = i; bCor.forEach((b, j) => b.setAttribute('aria-pressed', String(j === i))); } }));
    const bEsp = [[2, 'Fino'], [3, 'Médio'], [6, 'Grosso']].map(([v, n]) => h('button', { type: 'button', 'aria-pressed': String(v === esp), onclick: () => { esp = v; bEsp.forEach(b => b.setAttribute('aria-pressed', String(b.textContent === n))); } }, n));
    const B = (rot, fn) => h('button', { class: 'btn mini', type: 'button', onclick: fn }, rot);
    const cheio = B('Tela cheia', () => { caixa.classList.toggle('cheio'); cheio.textContent = caixa.classList.contains('cheio') ? 'Sair da tela cheia' : 'Tela cheia'; });
    caixa.append(
      h('div', { class: 'ferr' }, h('div', { class: 'seg', role: 'group', 'aria-label': 'Ferramenta' }, bFerr)),
      h('div', { class: 'ferr' }, h('div', { class: 'cores', role: 'group', 'aria-label': 'Cor' }, bCor), h('div', { class: 'seg', role: 'group', 'aria-label': 'Espessura' }, bEsp)),
      h('div', { class: 'ferr' }, B('↶ Desfazer', desfazer), B('↷ Refazer', refazer), B('Limpar', () => { if (!els.length) return; if (!confirm('Apagar todo o desenho deste quadro? Dá para desfazer em seguida.')) return; guardar(); els = []; redesenha(); salvar(); }), B('Salvar imagem', () => cv.toBlob(b => baixar('quadro.png', b), 'image/png')), cheio),
      h('div', { class: 'palco' }, cv));
    alvo.append(caixa); semImg = redesenha; redesenha();
    const teclas = (e) => { if (!document.body.contains(cv)) return; if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && document.activeElement.tagName !== 'INPUT') { e.preventDefault(); e.shiftKey ? refazer() : desfazer(); } };
    document.addEventListener('keydown', teclas);
    function adicionarImagem(u, nw, nh) { const k = Math.min(1, 640 / nw, 420 / nh); const w = Math.round(nw * k), hh = Math.round(nh * k); guardar(); els.push({ k: 'i', u, p: [Math.round((W - w) / 2), Math.round((H - hh) / 2), Math.round((W + w) / 2), Math.round((H + hh) / 2)] }); redesenha(); salvar(); }
    const colar = (e) => { if (!document.body.contains(cv) || document.activeElement.tagName === 'INPUT') return; const it = [...(e.clipboardData && e.clipboardData.items || [])].find(i => i.type.startsWith('image/')); if (!it) return; e.preventDefault(); imagemReduzida(it.getAsFile(), 800).then(u => { const im = new Image(); im.onload = () => adicionarImagem(u, im.width, im.height); im.src = u; }); };
    document.addEventListener('paste', colar);
    return { sair() { document.removeEventListener('keydown', teclas); document.removeEventListener('paste', colar); semImg = null; } };
  }
  window.DoraEditores = { imagemReduzida, editorNotas, editorMapa, editorQuadro, sanitizar, h, simplifica, desenhaElem };
})();
