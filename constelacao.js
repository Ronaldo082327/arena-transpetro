/* Constelação da Guilda (window.DoraConstelacao): grafo de conhecimento em forma de galáxia de Fibonacci.
   Inspirado na ideia geral do "graph view" de apps de notas, com código próprio.
   - layout(grafo): centro = concurso; disciplinas no ângulo de ouro; cada disciplina vira um braço em espiral
     logarítmica com os tópicos do edital; os objetos ligados a um tópico (erros, fichas, mapas, grifos, PDFs,
     perguntas, sessões) orbitam o tópico em filotaxia (ângulo de ouro, raio ∝ √n).
   - tocar(canvas, grafo): a galáxia se forma na ordem do tempo; cada conexão é "escrita" como um traço de luz
     do pai até o filho; zoom (roda/pinça), arrastar, passar o mouse realça os vizinhos, clique abre o objeto.
   grafo = { nos: [{id, tipo, rot, pai, t, ref, dom}], arestas: [[a, b]] } (pai também gera aresta). */
(function (raiz) {
  'use strict';
  var AUREO = 137.50776 * Math.PI / 180;
  var COR_TIPO = { concurso: '#fff6e8', disciplina: '#f2b544', topico: '#e07a2e', erro: '#ff6b5e', ficha: '#7fd3a8', mapa: '#8fb8ff', grifo: '#ffe36e', pdf: '#c9a7ff', pergunta: '#5fd7e8', sessao: '#ffffff', carta: '#ffa94d', caderno: '#b8f27a' };
  var ROT_TIPO = { concurso: 'Concurso', disciplina: 'Disciplina', topico: 'Tópico do edital', erro: 'Erro', ficha: 'Ficha', mapa: 'Mapa mental', grifo: 'Grifo', pdf: 'PDF', pergunta: 'Pergunta à Dora', sessao: 'Sessão de estudo', carta: 'Cartas', caderno: 'Caderno de questões' };
  function layout(G) {
    var porId = {}, filhos = {}; G.nos.forEach(function (n) { porId[n.id] = n; (filhos[n.pai] = filhos[n.pai] || []).push(n); });
    var raizN = G.nos.find(function (n) { return n.tipo === 'concurso'; }) || G.nos[0]; if (!raizN) return G;
    raizN.x = 0; raizN.y = 0; raizN.r = 16;
    var discs = (filhos[raizN.id] || []).filter(function (n) { return n.tipo === 'disciplina'; }), nd = discs.length || 1;
    discs.forEach(function (d, i) {
      var a0 = i * (2 * Math.PI / nd), r0 = 58; d.x = r0 * Math.cos(a0); d.y = r0 * Math.sin(a0); d.r = 9; d.a0 = a0; d.hue = (i * 137.5) % 360;
      d.lx = 112 * Math.cos(a0 - 0.18); d.ly = 112 * Math.sin(a0 - 0.18);
      var tops = (filhos[d.id] || []).filter(function (n) { return n.tipo === 'topico'; }), passo = Math.min(0.42, 5.2 / Math.max(1, tops.length));
      tops.forEach(function (t, j) { var th = (j + 1) * passo, ang = a0 + th, rad = r0 * Math.exp(0.33 * th) + 6 * j; t.braco = j ? tops[j - 1].id : d.id; t.x = rad * Math.cos(ang); t.y = rad * Math.sin(ang); t.r = 4 + 1.3 * (t.peso || 3) / 3; t.hue = d.hue; });
      (filhos[d.id] || []).filter(function (n) { return n.tipo !== 'topico'; }).forEach(function (o, k) { var ang = a0 - 0.5 + k * AUREO * 0.15, rr = r0 * 0.9 + 5 * Math.sqrt(k + 1); o.x = rr * Math.cos(ang); o.y = rr * Math.sin(ang); o.r = 2.4; o.hue = d.hue; });
    });
    G.nos.forEach(function (n) {
      if (n.x != null || !porId[n.pai]) return; var p = porId[n.pai]; if (p.x == null) return;
      var irm = filhos[n.pai], k = irm.indexOf(n), ang = k * AUREO, rr = 10 + 5.2 * Math.sqrt(k + 1); n.x = p.x + rr * Math.cos(ang); n.y = p.y + rr * Math.sin(ang); n.r = n.tipo === 'pdf' ? 3.6 : 2.4; n.hue = p.hue;
    });
    // sem pai posicionado: anel externo
    var soltos = G.nos.filter(function (n) { return n.x == null; }); soltos.forEach(function (n, i) { var ang = i * AUREO, rr = 22 + 3.2 * Math.sqrt(i + 1); n.x = rr * Math.cos(ang); n.y = rr * Math.sin(ang); n.r = 2; });
    var arestas = []; G.nos.forEach(function (n) { if (n.braco && porId[n.braco]) arestas.push([n.braco, n.id]); else if (porId[n.pai]) arestas.push([n.pai, n.id]); }); (G.arestas || []).forEach(function (e) { if (porId[e[0]] && porId[e[1]]) arestas.push(e); });
    G.porId = porId; G.todas = arestas; return G;
  }
  function tocar(canvas, G, op) {
    op = op || {}; layout(G); var ctx = canvas.getContext('2d'), dpr = Math.min(2, window.devicePixelRatio || 1), W, H, vivo = true, raf = 0, t0 = 0;
    var ordem = G.nos.slice().sort(function (a, b) { return (a.t || 0) - (b.t || 0); }), nT = ordem.length, DUR = op.reduzido ? 1 : Math.min(18000, 4000 + nT * 18), visto = {};
    ordem.forEach(function (n, i) { n.ord = i; });
    var cam = { x: 0, y: 0, z: 1, rot: 0 }, alvoZ = 1, arrasto = null, sobre = null, filtro = op.filtro || null, part = [], estrelas = [];
    for (var i = 0; i < 260; i++) estrelas.push({ x: Math.random() * 2 - 1, y: Math.random() * 2 - 1, s: Math.random() * 1.4 + .2, f: Math.random() * 6 });
    function tam() { W = canvas.clientWidth || 800; H = canvas.clientHeight || 520; canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); var ext = 0; G.nos.forEach(function (n) { ext = Math.max(ext, Math.abs(n.x || 0), Math.abs(n.y || 0)); }); alvoZ = Math.min(W, H) / 2 / Math.max(200, ext + 30); cam.z = cam.z === 1 && !tam.ok ? alvoZ * 0.35 : cam.z; tam.ok = 1; }
    tam(); var onR = function () { tam(); }; window.addEventListener('resize', onR);
    function tela(n) { var c = Math.cos(cam.rot), s = Math.sin(cam.rot), x = n.x * c - n.y * s, y = n.x * s + n.y * c; return { x: W / 2 + (x - cam.x) * cam.z, y: H / 2 + (y - cam.y) * cam.z }; }
    function mundo(px, py) { var x = (px - W / 2) / cam.z + cam.x, y = (py - H / 2) / cam.z + cam.y, c = Math.cos(-cam.rot), s = Math.sin(-cam.rot); return { x: x * c - y * s, y: x * s + y * c }; }
    function vizinhos(id) { var v = {}; v[id] = 1; G.todas.forEach(function (e) { if (e[0] === id) v[e[1]] = 1; if (e[1] === id) v[e[0]] = 1; }); return v; }
    var viz = null;
    canvas.addEventListener('wheel', function (e) { e.preventDefault(); cam.z *= e.deltaY < 0 ? 1.12 : 0.89; cam.z = Math.max(0.05, Math.min(12, cam.z)); }, { passive: false });
    canvas.addEventListener('pointerdown', function (e) { arrasto = { x: e.clientX, y: e.clientY, cx: cam.x, cy: cam.y, mov: 0 }; canvas.setPointerCapture(e.pointerId); });
    canvas.addEventListener('pointermove', function (e) {
      var rc = canvas.getBoundingClientRect(), px = e.clientX - rc.left, py = e.clientY - rc.top;
      if (arrasto) { var dx = e.clientX - arrasto.x, dy = e.clientY - arrasto.y; arrasto.mov += Math.abs(dx) + Math.abs(dy); cam.x = arrasto.cx - dx / cam.z; cam.y = arrasto.cy - dy / cam.z; return; }
      var melhor = null, md = 14; G.nos.forEach(function (n) { if (!visto[n.id] || (filtro && !filtro[n.tipo] && n.tipo !== 'concurso')) return; var p = tela(n), d = Math.hypot(p.x - px, p.y - py); if (d < md + n.r * cam.z) { md = d; melhor = n; } });
      if (melhor !== sobre) { sobre = melhor; viz = sobre ? vizinhos(sobre.id) : null; canvas.style.cursor = sobre && sobre.ref ? 'pointer' : 'grab'; if (op.aoSobre) op.aoSobre(sobre); }
    });
    canvas.addEventListener('pointerup', function () { if (arrasto && arrasto.mov < 6 && sobre && op.aoClicar) op.aoClicar(sobre); arrasto = null; });
    var pinca = null; canvas.addEventListener('touchmove', function (e) { if (e.touches.length === 2) { e.preventDefault(); var d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY); if (pinca) cam.z = Math.max(0.05, Math.min(12, cam.z * d / pinca)); pinca = d; } }, { passive: false }); canvas.addEventListener('touchend', function () { pinca = null; });
    function quadro(agora) {
      if (!vivo || !canvas.isConnected) { window.removeEventListener('resize', onR); return; }
      if (!t0) t0 = agora; var tt = agora - t0, prog = Math.min(1, tt / DUR), lim = Math.floor(prog * nT);
      if (!arrasto) { cam.z += (alvoZ * (0.55 + 0.45 * Math.min(1, prog * 1.3)) - cam.z) * (op.reduzido ? 1 : 0.02) * (op._zoomLivre ? 0 : 1); cam.rot += op.reduzido ? 0 : 0.00025; }
      for (var k = 0; k < lim; k++) { var n = ordem[k]; if (!visto[n.id]) { visto[n.id] = agora; if (!op.reduzido && n.tipo !== 'topico' && n.tipo !== 'disciplina' && part.length < 400) { var p0 = tela(n); for (var q = 0; q < 6; q++) { var a = Math.random() * 6.283, v = .5 + Math.random() * 1.8; part.push({ x: p0.x, y: p0.y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, vida: 1, c: COR_TIPO[n.tipo] || '#fff' }); } } } }
      var g = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * .7); g.addColorStop(0, '#2a1b12'); g.addColorStop(.55, '#140d09'); g.addColorStop(1, '#070504'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      estrelas.forEach(function (e) { ctx.globalAlpha = .25 + .45 * Math.abs(Math.sin(tt / 1500 + e.f)); ctx.fillStyle = '#fff3d6'; ctx.fillRect(W / 2 + e.x * W * .6, H / 2 + e.y * H * .6, e.s, e.s); }); ctx.globalAlpha = 1;
      // nebulosas dos braços
      G.nos.forEach(function (n) { if (n.tipo !== 'disciplina' || !visto[n.id]) return; var p = tela(n), rr = 140 * cam.z; var gn = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rr); gn.addColorStop(0, 'hsla(' + n.hue + ',85%,60%,.16)'); gn.addColorStop(1, 'hsla(' + n.hue + ',85%,60%,0)'); ctx.fillStyle = gn; ctx.beginPath(); ctx.arc(p.x, p.y, rr, 0, 6.283); ctx.fill(); });
      // arestas: escritas do pai ao filho ao longo de 700 ms
      ctx.lineCap = 'round';
      G.todas.forEach(function (e) { var a = G.porId[e[0]], b = G.porId[e[1]]; if (!visto[a.id] || !visto[b.id]) return; if (filtro && ((!filtro[b.tipo] && b.tipo !== 'disciplina' && b.tipo !== 'topico') || (!filtro[a.tipo] && a.tipo !== 'disciplina' && a.tipo !== 'topico' && a.tipo !== 'concurso'))) return;
        var f = op.reduzido ? 1 : Math.min(1, (agora - Math.max(visto[a.id], visto[b.id])) / 700), pa = tela(a), pb = tela(b), x2 = pa.x + (pb.x - pa.x) * f, y2 = pa.y + (pb.y - pa.y) * f, real = viz && viz[a.id] && viz[b.id];
        ctx.strokeStyle = real ? 'rgba(255,230,170,.95)' : 'hsla(' + (b.hue || 35) + ',70%,70%,' + (viz ? .06 : .22) + ')'; ctx.lineWidth = real ? 1.8 : (b.tipo === 'topico' ? 1.1 : .7); ctx.beginPath(); ctx.moveTo(pa.x, pa.y); ctx.lineTo(x2, y2); ctx.stroke();
        if (f < 1) { ctx.fillStyle = '#fff6e8'; ctx.shadowColor = '#f2b544'; ctx.shadowBlur = 10; ctx.beginPath(); ctx.arc(x2, y2, 2.2, 0, 6.283); ctx.fill(); ctx.shadowBlur = 0; } });
      // nós
      G.nos.forEach(function (n) { if (!visto[n.id]) return; if (filtro && !filtro[n.tipo] && n.tipo !== 'concurso' && n.tipo !== 'disciplina' && n.tipo !== 'topico') return;
        var p = tela(n), idade = op.reduzido ? 1 : Math.min(1, (agora - visto[n.id]) / 500), r = Math.max(1.2, n.r * Math.sqrt(cam.z) * (0.3 + 0.7 * idade)) * (sobre === n ? 1.8 : 1), dim = viz && !viz[n.id];
        var c = n.tipo === 'topico' && n.dom != null ? 'hsl(' + Math.round(10 + 110 * n.dom) + ',80%,58%)' : (COR_TIPO[n.tipo] || '#fff');
        ctx.globalAlpha = dim ? .18 : 1; ctx.fillStyle = c; ctx.shadowColor = c; ctx.shadowBlur = dim ? 0 : (n.tipo === 'concurso' || n.tipo === 'disciplina' ? 22 : 9); ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, 6.283); ctx.fill(); ctx.shadowBlur = 0;
        if ((n.tipo === 'disciplina' || n.tipo === 'concurso' || (n.tipo === 'topico' && cam.z > 1.6) || sobre === n || (viz && viz[n.id] && cam.z > .8)) && !dim) { var lp = n.tipo === 'disciplina' && n.lx != null ? tela({ x: n.lx, y: n.ly }) : { x: p.x + r + 4, y: p.y + 4 }; ctx.fillStyle = n.tipo === 'disciplina' ? 'hsl(' + n.hue + ',90%,78%)' : '#fff6e8'; ctx.font = (n.tipo === 'disciplina' || n.tipo === 'concurso' ? '700 13px' : '11px') + ' system-ui'; if (n.tipo === 'disciplina') ctx.textAlign = 'center'; ctx.fillText(String(n.rot).slice(0, 42), lp.x, lp.y); ctx.textAlign = 'left'; }
        ctx.globalAlpha = 1; });
      part = part.filter(function (p) { p.x += p.vx; p.y += p.vy; p.vida -= .025; if (p.vida <= 0) return false; ctx.globalAlpha = p.vida; ctx.fillStyle = p.c; ctx.fillRect(p.x, p.y, 2, 2); return true; }); ctx.globalAlpha = 1;
      // contador de evolução
      var vis = Object.keys(visto).length, ult = ordem[Math.max(0, lim - 1)];
      ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(10, H - 44, Math.min(W - 20, 420), 34); ctx.fillStyle = '#f2b544'; ctx.font = '700 14px system-ui'; ctx.fillText((prog < 1 ? 'Formando a galáxia… ' : 'Sua galáxia hoje · ') + vis + ' estrelas · ' + G.todas.filter(function (e) { return visto[e[0]] && visto[e[1]]; }).length + ' conexões', 20, H - 22);
      if (ult && ult.t && prog < 1) { ctx.fillStyle = 'rgba(255,240,220,.75)'; ctx.font = '12px system-ui'; ctx.textAlign = 'right'; ctx.fillText(new Date(ult.t).toLocaleDateString('pt-BR'), W - 16, 24); ctx.textAlign = 'left'; }
      if (prog >= 1 && !op._fim) { op._fim = 1; if (op.aoFim) op.aoFim(); }
      raf = requestAnimationFrame(quadro);
    }
    raf = requestAnimationFrame(quadro);
    return { parar: function () { vivo = false; cancelAnimationFrame(raf); }, filtrar: function (f) { filtro = f; }, rever: function () { visto = {}; t0 = 0; op._fim = 0; }, focar: function (id) { var n = G.porId[id]; if (n) { cam.x = n.x; cam.y = n.y; cam.z = Math.max(cam.z, 2.2); } } };
  }
  raiz.DoraConstelacao = { layout: layout, tocar: tocar, COR_TIPO: COR_TIPO, ROT_TIPO: ROT_TIPO };
})(typeof window !== 'undefined' ? window : globalThis);
