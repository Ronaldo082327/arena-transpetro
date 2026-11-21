/* Dora Canvas (window.DoraCanvas): quadro infinito para esquemas, mapas e linhas do tempo.
   Formato de dados = JSON Canvas (especificação aberta, a mesma do canvas do Obsidian):
   { nodes: [{id, type:'text'|'link'|'group'|'file', x, y, width, height, color?, text?, url?, label?, file?}],
     edges: [{id, fromNode, toNode, fromSide?, toSide?, label?, color?}] }
   Interação: arrastar cartão, redimensionar pelo canto, duplo clique edita o texto, modo Conectar (clique na origem e no
   destino), arrastar o fundo move, roda/pinça dá zoom no cursor, Delete apaga o selecionado, grade opcional. Código próprio. */
(function (raiz) {
  'use strict';
  var CORES = { '1': '#e5534b', '2': '#e07a2e', '3': '#e0b12e', '4': '#3fa66b', '5': '#3b9bd1', '6': '#9b6ad6' };
  function cor(c) { return !c ? null : CORES[c] || c; }
  function uid() { return Math.random().toString(16).slice(2, 10) + Math.random().toString(16).slice(2, 10); }
  function montar(el, dados, op) {
    op = op || {}; var D = { nodes: (dados && dados.nodes || []).slice(), edges: (dados && dados.edges || []).slice() };
    var cam = { x: 0, y: 0, z: 1 }, sel = null, modoConectar = null, grade = op.grade !== false, G = 20;
    el.classList.add('dcv'); el.innerHTML = '<div class="dcv-mundo"><svg class="dcv-svg" width="1" height="1"><defs><marker id="dcv-seta" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs><g class="dcv-ar"></g></svg><div class="dcv-nos"></div></div><div class="dcv-dica" hidden></div>';
    var mundo = el.querySelector('.dcv-mundo'), svg = el.querySelector('.dcv-svg'), gAr = el.querySelector('.dcv-ar'), camada = el.querySelector('.dcv-nos'), dica = el.querySelector('.dcv-dica');
    function salvar() { if (op.aoMudar) op.aoMudar(D); }
    function aplicarCam() { mundo.style.transform = 'translate(' + cam.x + 'px,' + cam.y + 'px) scale(' + cam.z + ')'; }
    function ajuste(v) { return grade ? Math.round(v / G) * G : Math.round(v); }
    function no(id) { return D.nodes.find(function (n) { return n.id === id; }); }
    function lado(n, alvo) { var cx = n.x + n.width / 2, cy = n.y + n.height / 2, tx = alvo.x + alvo.width / 2, ty = alvo.y + alvo.height / 2, dx = tx - cx, dy = ty - cy;
      return Math.abs(dx) * n.height > Math.abs(dy) * n.width ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'bottom' : 'top'); }
    function ponto(n, s) { return s === 'right' ? [n.x + n.width, n.y + n.height / 2] : s === 'left' ? [n.x, n.y + n.height / 2] : s === 'top' ? [n.x + n.width / 2, n.y] : [n.x + n.width / 2, n.y + n.height]; }
    function desenharArestas() {
      var minx = 0, miny = 0, maxx = 1, maxy = 1; D.nodes.forEach(function (n) { minx = Math.min(minx, n.x - 200); miny = Math.min(miny, n.y - 200); maxx = Math.max(maxx, n.x + n.width + 200); maxy = Math.max(maxy, n.y + n.height + 200); });
      svg.setAttribute('width', maxx - minx); svg.setAttribute('height', maxy - miny); svg.style.left = minx + 'px'; svg.style.top = miny + 'px'; svg.setAttribute('viewBox', minx + ' ' + miny + ' ' + (maxx - minx) + ' ' + (maxy - miny));
      gAr.innerHTML = D.edges.map(function (e) { var a = no(e.fromNode), b = no(e.toNode); if (!a || !b) return '';
        var sa = e.fromSide || lado(a, b), sb = e.toSide || lado(b, a), p = ponto(a, sa), q = ponto(b, sb), k = Math.max(40, Math.hypot(q[0] - p[0], q[1] - p[1]) / 3), off = { right: [k, 0], left: [-k, 0], top: [0, -k], bottom: [0, k] };
        var d = 'M' + p[0] + ',' + p[1] + ' C' + (p[0] + off[sa][0]) + ',' + (p[1] + off[sa][1]) + ' ' + (q[0] + off[sb][0]) + ',' + (q[1] + off[sb][1]) + ' ' + q[0] + ',' + q[1], c = cor(e.color) || 'var(--accent,#e07a2e)', mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2;
        return '<g class="dcv-e' + (sel === 'e:' + e.id ? ' sel' : '') + '" data-e="' + e.id + '" style="color:' + c + '"><path d="' + d + '" class="dcv-hit"/><path d="' + d + '" class="dcv-linha" marker-end="url(#dcv-seta)"/>' + (e.label ? '<text x="' + mx + '" y="' + (my - 6) + '" text-anchor="middle" class="dcv-rot">' + esc(e.label) + '</text>' : '') + '</g>';
      }).join('');
    }
    function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
    function conteudo(n) {
      if (n.type === 'group') return '<div class="dcv-gtit">' + esc(n.label || 'Grupo') + '</div>';
      if (n.type === 'link') { var pdf = /draw\/index\.html#\/leitor/.test(n.url || ''); return '<div class="dcv-link">' + (pdf ? '📄 ' : '🔗 ') + '<a href="' + esc(n.url) + '"' + (/^https?:/.test(n.url) ? ' target="_blank" rel="noopener"' : '') + '>' + esc(n.label || n.url) + '</a></div>'; }
      if (n.type === 'file') return '<div class="dcv-link">📎 ' + esc(n.file) + '</div>';
      return '<div class="dcv-txt">' + (op.md ? op.md(n.text || '') : esc(n.text || '')) + '</div>';
    }
    function desenharNos() {
      camada.innerHTML = D.nodes.slice().sort(function (a, b) { return (a.type === 'group' ? 0 : 1) - (b.type === 'group' ? 0 : 1); }).map(function (n) { var c = cor(n.color);
        return '<div class="dcv-no dcv-' + n.type + (sel === 'n:' + n.id ? ' sel' : '') + (modoConectar === n.id ? ' origem' : '') + '" data-n="' + n.id + '" style="left:' + n.x + 'px;top:' + n.y + 'px;width:' + n.width + 'px;height:' + n.height + 'px;' + (c ? '--dcv-c:' + c + ';' : '') + '">' + conteudo(n) + '<i class="dcv-rs" title="Redimensionar"></i></div>'; }).join('');
      desenharArestas();
    }
    function tudo() { desenharNos(); aplicarCam(); }
    function mundoDe(ev) { var r = el.getBoundingClientRect(); return { x: (ev.clientX - r.left - cam.x) / cam.z, y: (ev.clientY - r.top - cam.y) / cam.z }; }
    function mostrarDica(t) { dica.hidden = !t; dica.textContent = t || ''; }
    // ---- eventos ----
    var arr = null;
    el.addEventListener('pointerdown', function (ev) {
      if (ev.target.closest('a') || ev.target.isContentEditable) return;
      var rs = ev.target.closest('.dcv-rs'), card = ev.target.closest('.dcv-no'), ed = ev.target.closest('.dcv-e');
      if (ed && !card) { sel = 'e:' + ed.dataset.e; desenharArestas(); return; }
      if (card) {
        var n = no(card.dataset.n);
        if (modoConectar) { if (modoConectar === true) { modoConectar = n.id; mostrarDica('Agora toque no cartão de destino.'); desenharNos(); } else if (modoConectar !== n.id) { var e = { id: uid(), fromNode: modoConectar, toNode: n.id }; if (op.pedirRotulo) { var r0 = op.pedirRotulo(); if (r0 === null) { modoConectar = true; desenharNos(); return; } if (r0) e.label = r0; } D.edges.push(e); modoConectar = true; mostrarDica('Conectado. Toque em outra origem ou em "Conectar" para sair.'); salvar(); desenharNos(); } return; }
        sel = 'n:' + n.id; var m = mundoDe(ev);
        arr = rs ? { tipo: 'rs', n: n, w: n.width, h: n.height, x0: m.x, y0: m.y } : { tipo: 'mv', n: n, dx: m.x - n.x, dy: m.y - n.y, filhos: n.type === 'group' ? D.nodes.filter(function (o) { return o !== n && o.x >= n.x && o.y >= n.y && o.x + o.width <= n.x + n.width && o.y + o.height <= n.y + n.height; }).map(function (o) { return { o: o, dx: o.x - n.x, dy: o.y - n.y }; }) : [] };
        el.setPointerCapture(ev.pointerId); card.classList.add('sel'); return;
      }
      sel = null; desenharNos(); arr = { tipo: 'pan', x: ev.clientX, y: ev.clientY, cx: cam.x, cy: cam.y }; el.setPointerCapture(ev.pointerId);
    });
    el.addEventListener('pointermove', function (ev) {
      if (!arr) return; var m = mundoDe(ev);
      if (arr.tipo === 'pan') { cam.x = arr.cx + ev.clientX - arr.x; cam.y = arr.cy + ev.clientY - arr.y; aplicarCam(); return; }
      if (arr.tipo === 'mv') { arr.n.x = ajuste(m.x - arr.dx); arr.n.y = ajuste(m.y - arr.dy); arr.filhos.forEach(function (f) { f.o.x = arr.n.x + f.dx; f.o.y = arr.n.y + f.dy; }); }
      else { arr.n.width = Math.max(120, ajuste(arr.w + m.x - arr.x0)); arr.n.height = Math.max(50, ajuste(arr.h + m.y - arr.y0)); }
      var c = camada.querySelector('[data-n="' + arr.n.id + '"]'); if (c) { c.style.left = arr.n.x + 'px'; c.style.top = arr.n.y + 'px'; c.style.width = arr.n.width + 'px'; c.style.height = arr.n.height + 'px'; }
      arr.filhos && arr.filhos.forEach(function (f) { var cc = camada.querySelector('[data-n="' + f.o.id + '"]'); if (cc) { cc.style.left = f.o.x + 'px'; cc.style.top = f.o.y + 'px'; } });
      desenharArestas();
    });
    el.addEventListener('pointerup', function () { if (arr && arr.tipo !== 'pan') salvar(); arr = null; });
    el.addEventListener('dblclick', function (ev) {
      var card = ev.target.closest('.dcv-no'); if (!card) { var m = mundoDe(ev); adicionar({ type: 'text', text: 'Novo cartão', x: ajuste(m.x - 20), y: ajuste(m.y - 20) }); return; }
      var n = no(card.dataset.n); if (n.type === 'group') { var l = op.pedirTexto ? op.pedirTexto('Nome do grupo', n.label || '') : null; if (l != null) { n.label = l; salvar(); desenharNos(); } return; }
      if (n.type !== 'text') return; var box = card.querySelector('.dcv-txt'); box.contentEditable = 'true'; box.textContent = n.text || ''; box.classList.add('editando'); box.focus();
      var fim = function () { box.contentEditable = 'false'; n.text = box.innerText.replace(/ /g, ' ').trim(); salvar(); desenharNos(); }; box.addEventListener('blur', fim, { once: true });
    });
    el.addEventListener('wheel', function (ev) { ev.preventDefault(); var r = el.getBoundingClientRect(), px = ev.clientX - r.left, py = ev.clientY - r.top, z0 = cam.z; cam.z = Math.max(0.15, Math.min(3, cam.z * (ev.deltaY < 0 ? 1.12 : 0.89))); cam.x = px - (px - cam.x) * cam.z / z0; cam.y = py - (py - cam.y) * cam.z / z0; aplicarCam(); }, { passive: false });
    var pinca = null; el.addEventListener('touchmove', function (ev) { if (ev.touches.length !== 2) return; ev.preventDefault(); var d = Math.hypot(ev.touches[0].clientX - ev.touches[1].clientX, ev.touches[0].clientY - ev.touches[1].clientY); if (pinca) { cam.z = Math.max(0.15, Math.min(3, cam.z * d / pinca)); aplicarCam(); } pinca = d; }, { passive: false }); el.addEventListener('touchend', function () { pinca = null; });
    var tecla = function (ev) { if (!el.isConnected) { document.removeEventListener('keydown', tecla); return; } if (document.activeElement && document.activeElement.isContentEditable) return; if ((ev.key === 'Delete' || ev.key === 'Backspace') && sel && /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) === false) { ev.preventDefault(); apagarSel(); } };
    document.addEventListener('keydown', tecla);
    function apagarSel() { if (!sel) return; var id = sel.slice(2); if (sel[0] === 'n') { D.nodes = D.nodes.filter(function (n) { return n.id !== id; }); D.edges = D.edges.filter(function (e) { return e.fromNode !== id && e.toNode !== id; }); } else D.edges = D.edges.filter(function (e) { return e.id !== id; }); sel = null; salvar(); desenharNos(); }
    function adicionar(n) { var r = el.getBoundingClientRect(), cx = (r.width / 2 - cam.x) / cam.z, cy = (r.height / 2 - cam.y) / cam.z; var o = Object.assign({ id: uid(), type: 'text', width: n.type === 'group' ? 480 : 240, height: n.type === 'group' ? 320 : (n.type === 'link' ? 70 : 120) }, n); if (o.x == null) { o.x = ajuste(cx - o.width / 2 + (D.nodes.length % 5) * 24); o.y = ajuste(cy - o.height / 2 + (D.nodes.length % 5) * 24); } D.nodes.push(o); sel = 'n:' + o.id; salvar(); desenharNos(); return o; }
    function centralizar() { if (!D.nodes.length) { cam = { x: el.clientWidth / 2, y: el.clientHeight / 2, z: 1 }; aplicarCam(); return; } var x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity; D.nodes.forEach(function (n) { x0 = Math.min(x0, n.x); y0 = Math.min(y0, n.y); x1 = Math.max(x1, n.x + n.width); y1 = Math.max(y1, n.y + n.height); });
      var W = el.clientWidth, H = el.clientHeight; cam.z = Math.max(0.2, Math.min(1.2, Math.min(W / (x1 - x0 + 80), H / (y1 - y0 + 80)))); cam.x = W / 2 - (x0 + x1) / 2 * cam.z; cam.y = H / 2 - (y0 + y1) / 2 * cam.z; aplicarCam(); }
    tudo(); setTimeout(centralizar, 0);
    return {
      dados: function () { return { nodes: D.nodes, edges: D.edges }; }, adicionar: adicionar, centralizar: centralizar, apagar: apagarSel,
      conectar: function (on) { modoConectar = on ? true : null; mostrarDica(on ? 'Modo Conectar: toque no cartão de origem.' : ''); desenharNos(); return !!modoConectar; },
      grade: function (on) { grade = on; }, carregar: function (d) { D = { nodes: (d.nodes || []).slice(), edges: (d.edges || []).slice() }; sel = null; tudo(); centralizar(); salvar(); },
      corSel: function (c) { if (!sel) return; var id = sel.slice(2), o = sel[0] === 'n' ? no(id) : D.edges.find(function (e) { return e.id === id; }); if (o) { o.color = c; salvar(); desenharNos(); } }
    };
  }
  // Exportação JSON Canvas (só os campos da especificação)
  function exportar(d) { var campos = ['id', 'type', 'x', 'y', 'width', 'height', 'color', 'text', 'url', 'label', 'file', 'subpath', 'background', 'backgroundStyle'];
    return JSON.stringify({ nodes: d.nodes.map(function (n) { var o = {}; campos.forEach(function (k) { if (n[k] != null) o[k] = k === 'x' || k === 'y' || k === 'width' || k === 'height' ? Math.round(n[k]) : n[k]; }); return o; }), edges: d.edges.map(function (e) { var o = {}; ['id', 'fromNode', 'fromSide', 'fromEnd', 'toNode', 'toSide', 'toEnd', 'color', 'label'].forEach(function (k) { if (e[k] != null) o[k] = e[k]; }); return o; }) }, null, '\t'); }
  function importar(txt) { var o = JSON.parse(txt); if (!o || !Array.isArray(o.nodes)) throw new Error('arquivo .canvas inválido'); o.edges = o.edges || []; return o; }
  // Layout automático simples (árvore radial) para esboços gerados: nodes sem x/y em volta do primeiro.
  function arrumar(d) { var c = d.nodes[0]; if (!c) return d; c.x = c.x || 0; c.y = c.y || 0; var resto = d.nodes.slice(1).filter(function (n) { return n.x == null; }), N = resto.length;
    resto.forEach(function (n, i) { var a = i / Math.max(1, N) * 2 * Math.PI - Math.PI / 2, R = 340 + (i % 2) * 60; n.width = n.width || 230; n.height = n.height || 110; n.x = Math.round(c.x + c.width / 2 + R * Math.cos(a) - n.width / 2); n.y = Math.round(c.y + c.height / 2 + R * 0.75 * Math.sin(a) - n.height / 2); }); return d; }
  raiz.DoraCanvas = { montar: montar, exportar: exportar, importar: importar, arrumar: arrumar, CORES: CORES, uid: uid };
})(typeof window !== 'undefined' ? window : globalThis);
