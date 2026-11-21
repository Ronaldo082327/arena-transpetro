/* Gêmeo Digital da Guilda (window.DoraGemeo): reconstrói a jornada do concurseiro dia a dia e reproduz em animação.
   Fontes (só leitura, no aparelho): Dora Cartas (S.cq.log), Doroxandria (arenaTP.v2.hist), diário de evidências (arenaTP.eventos),
   Caderno de Erros e, se existir, as respostas e sessões do Dora Draw.
   Gêmeo: para cada dia, acerto por disciplina ~ Beta(acertos+1, erros+1); nota = Σ questões da disciplina × acerto.
   Faixa de 80% por Monte Carlo (sorteia o acerto de cada disciplina e as questões). Agentes sintéticos: um campo
   ilustrativo de concorrentes (não são dados reais) para situar o gêmeo. Tudo com n e faixa; nunca "previsão". */
(function (raiz) {
  'use strict';
  function norm(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim(); }
  function dia(ms) { var d = new Date(ms); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  // gerador pseudoaleatório com semente (a animação é sempre a mesma para os mesmos dados)
  function rng(seed) { var s = seed >>> 0 || 1; return function () { s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; }
  function gamma(k, r) { if (k < 1) return gamma(k + 1, r) * Math.pow(r(), 1 / k); var d = k - 1 / 3, c = 1 / Math.sqrt(9 * d); for (;;) { var x, v; do { var u1 = r(), u2 = r(); x = Math.sqrt(-2 * Math.log(u1 || 1e-9)) * Math.cos(2 * Math.PI * u2); v = 1 + c * x; } while (v <= 0); v = v * v * v; var u = r(); if (u < 1 - 0.0331 * x * x * x * x || Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) return d * v; } }
  function beta(a, b, r) { var x = gamma(a, r), y = gamma(b, r); return x / (x + y); }
  function pct(arr, p) { var a = arr.slice().sort(function (x, y) { return x - y; }); return a[Math.min(a.length - 1, Math.max(0, Math.round(p * (a.length - 1))))]; }
  /* eventos: [{t, ok, d}] ; pesos: [{d, q, alias:[]}] ; cortes opcionais */
  function serie(eventos, pesos, op) {
    op = op || {}; var r = rng(op.semente || 7), total = pesos.reduce(function (a, p) { return a + p.q; }, 0) || 1;
    var chave = {}; pesos.forEach(function (p, i) { [p.d].concat(p.alias || []).forEach(function (a) { chave[norm(a)] = i; }); });
    var ev = eventos.filter(function (e) { return e && e.t; }).map(function (e) { var k = chave[norm(e.d)]; if (k == null) { var nd = norm(e.d); Object.keys(chave).some(function (c) { if (c && nd && (nd.indexOf(c) >= 0 || c.indexOf(nd) >= 0)) { k = chave[c]; return true; } }); } return { t: e.t, ok: e.ok ? 1 : 0, k: k, min: e.min || 0 }; }).sort(function (a, b) { return a.t - b.t; });
    if (!ev.length) return { dias: [], total: total, pesos: pesos };
    var ini = new Date(dia(ev[0].t) + 'T12:00:00'), fim = new Date(dia(Date.now()) + 'T12:00:00'), acc = pesos.map(function () { return { ok: 0, n: 0 }; }), out = [], j = 0, Q = 0, OK = 0, MIN = 0, melhor = 0, seq = 0, seqMax = 0;
    for (var d = new Date(ini); d <= fim; d.setDate(d.getDate() + 1)) {
      var k = dia(d.getTime()), nDia = 0, okDia = 0;
      while (j < ev.length && dia(ev[j].t) === k) { var e = ev[j++]; if (e.min) { MIN += e.min; continue; } nDia++; okDia += e.ok; if (e.k != null) { acc[e.k].n++; acc[e.k].ok += e.ok; } }
      Q += nDia; OK += okDia; seq = nDia ? seq + 1 : 0; seqMax = Math.max(seqMax, seq); var recorde = nDia > melhor; if (recorde) melhor = nDia;
      // Monte Carlo do dia (120 provas sorteadas)
      var amostras = []; for (var s = 0; s < 120; s++) { var nota = 0; pesos.forEach(function (p, i) { var a = acc[i]; nota += p.q * beta(a.ok + 1, a.n - a.ok + 1, r); }); amostras.push(nota); }
      out.push({ dia: k, n: nDia, ok: okDia, Q: Q, OK: OK, min: MIN, med: pct(amostras, .5), lo: pct(amostras, .1), hi: pct(amostras, .9), seq: seq, recorde: recorde && nDia >= 10, porDisc: acc.map(function (a) { return { ok: a.ok, n: a.n }; }) });
    }
    return { dias: out, total: total, pesos: pesos, seqMax: seqMax, melhor: melhor };
  }
  // Campo de concorrentes sintéticos (ilustrativo): notas ~ Normal(media, dp), truncadas em [0, total].
  function agentes(n, total, media, dp, semente) { var r = rng(semente || 11), out = []; for (var i = 0; i < n; i++) { var u1 = r(), u2 = r(), z = Math.sqrt(-2 * Math.log(u1 || 1e-9)) * Math.cos(2 * Math.PI * u2); out.push(Math.max(0, Math.min(total, media + dp * z))); } return out.sort(function (a, b) { return a - b; }); }
  function marcos(S) {
    var out = [], lim = [50, 100, 250, 500, 1000, 2000, 5000], li = 0;
    S.dias.forEach(function (d, i) {
      while (li < lim.length && d.Q >= lim[li]) { out.push({ i: i, txt: lim[li] + ' questões resolvidas', tipo: 'q' }); li++; }
      if (d.recorde) out.push({ i: i, txt: 'Recorde: ' + d.n + ' questões num dia', tipo: 'r' });
      if (d.seq === 7) out.push({ i: i, txt: '7 dias seguidos treinando', tipo: 's' });
    });
    return out;
  }
  // ---------------- animação (canvas) ----------------
  function cor(nome, pad) { try { var v = getComputedStyle(document.documentElement).getPropertyValue(nome).trim(); return v || pad; } catch (e) { return pad; } }
  function tocar(canvas, S, op) {
    op = op || {}; var ctx = canvas.getContext('2d'), dpr = Math.min(2, window.devicePixelRatio || 1), W, H, raf = 0, t0 = 0, vivo = true;
    var C = { ac: cor('--accent', '#e07a2e'), de: cor('--destaque', '#f2b544'), ok: cor('--ok', '#2e9e6a'), bad: cor('--bad', '#c0453a'), ink: cor('--ink', '#2b2420'), paper: cor('--paper', '#fffaf3'), mut: cor('--muted', '#8a7a6a') };
    var N = S.dias.length, DUR = op.reduzido ? 1 : Math.min(16000, 5000 + N * 160), M = marcos(S), ag = op.agentes || [], part = [], estrelas = [], r = rng(3), total = S.total;
    function tam() { var w = canvas.clientWidth || 800, h = canvas.clientHeight || 460; W = w; H = h; canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    tam(); for (var i = 0; i < 90; i++) estrelas.push({ x: r(), y: r(), v: .02 + r() * .06, s: .5 + r() * 1.6, f: r() * 6 });
    var onR = function () { tam(); }; window.addEventListener('resize', onR);
    function explosao(x, y, c, n) { for (var k = 0; k < (n || 46); k++) { var a = r() * 6.283, v = 1.2 + r() * 3.6; part.push({ x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 1, vida: 1, c: c, s: 1.5 + r() * 2.5 }); } }
    var feitos = {}, legenda = null, legT = 0;
    function girassol(cx, cy, R, frac, tt) {
      var aur = 137.50776 * Math.PI / 180, luz = Math.round(55 * frac);
      var g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 1.6); g.addColorStop(0, 'rgba(255,200,90,' + (0.18 + 0.25 * frac) + ')'); g.addColorStop(1, 'rgba(255,200,90,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R * 1.6, 0, 6.283); ctx.fill();
      for (var p = 0; p < 21; p++) { var ang = p / 21 * 6.283 + tt * 0.00008; ctx.save(); ctx.translate(cx, cy); ctx.rotate(ang); ctx.fillStyle = C.de; ctx.globalAlpha = 0.25 + 0.6 * frac; ctx.beginPath(); ctx.ellipse(R * 1.05, 0, R * 0.42, R * 0.13, 0, 0, 6.283); ctx.fill(); ctx.restore(); }
      ctx.globalAlpha = 1;
      for (var s = 0; s < 55; s++) { var rr = R * 0.86 * Math.sqrt((s + .5) / 55), a = s * aur + tt * 0.00012, x = cx + rr * Math.cos(a), y = cy + rr * Math.sin(a), on = s < luz;
        ctx.beginPath(); ctx.arc(x, y, on ? R * 0.055 : R * 0.035, 0, 6.283); ctx.fillStyle = on ? C.ac : 'rgba(120,100,80,.35)'; if (on) { ctx.shadowColor = C.de; ctx.shadowBlur = 10; } ctx.fill(); ctx.shadowBlur = 0; }
      ctx.beginPath(); ctx.arc(cx, cy, R * (0.12 + 0.03 * Math.sin(tt / 300)), 0, 6.283); ctx.fillStyle = C.de; ctx.shadowColor = C.de; ctx.shadowBlur = 18; ctx.fill(); ctx.shadowBlur = 0;
    }
    function quadro(agora) {
      if (!vivo || !canvas.isConnected) { window.removeEventListener('resize', onR); return; } if (!t0) t0 = agora; var tt = agora - t0, prog = Math.min(1, tt / DUR), ease = prog < .5 ? 2 * prog * prog : 1 - Math.pow(-2 * prog + 2, 2) / 2, idx = Math.max(0, Math.min(N - 1, Math.floor(ease * (N - 1) + 0.0001))), D = S.dias[idx];
      ctx.clearRect(0, 0, W, H); var bg = ctx.createLinearGradient(0, 0, W, H); bg.addColorStop(0, '#1b1410'); bg.addColorStop(1, '#2b1d14'); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      estrelas.forEach(function (e) { e.y -= e.v / 600 * 16; if (e.y < 0) e.y = 1; ctx.globalAlpha = 0.3 + 0.5 * Math.abs(Math.sin(tt / 900 + e.f)); ctx.fillStyle = '#fff3d6'; ctx.fillRect(e.x * W, e.y * H, e.s, e.s); }); ctx.globalAlpha = 1;
      var narrow = W < 640, gx = narrow ? 16 : W * 0.36, gw = narrow ? W - 32 : W * 0.5, gy = narrow ? H * 0.44 : 70, gh = narrow ? H * 0.38 : H - 150;
      // girassol cresce com o volume de questões (55 sementes)
      var alvoQ = Math.max(500, S.dias[N - 1].Q), frac = Math.min(1, D.Q / alvoQ), R = narrow ? Math.min(W, H) * 0.13 : Math.min(W * 0.105, H * 0.22);
      girassol(narrow ? W * 0.22 : W * 0.17, narrow ? H * 0.2 : H * 0.42, R * (0.6 + 0.4 * Math.min(1, ease * 1.4)), frac, tt);
      // eixos e linha de corte
      var y = function (v) { return gy + gh - gh * v / total; }, x = function (i) { return gx + gw * (N < 2 ? 1 : i / (N - 1)); };
      ctx.strokeStyle = 'rgba(255,240,220,.15)'; ctx.lineWidth = 1; for (var k2 = 0; k2 <= 4; k2++) { var yy = gy + gh * k2 / 4; ctx.beginPath(); ctx.moveTo(gx, yy); ctx.lineTo(gx + gw, yy); ctx.stroke(); ctx.fillStyle = 'rgba(255,240,220,.5)'; ctx.font = '11px system-ui'; ctx.fillText(Math.round(total * (1 - k2 / 4)), gx - 26, yy + 4); }
      if (op.corte) { ctx.setLineDash([6, 6]); ctx.strokeStyle = C.bad; ctx.beginPath(); ctx.moveTo(gx, y(op.corte)); ctx.lineTo(gx + gw, y(op.corte)); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = C.bad; ctx.font = '12px system-ui'; ctx.fillText('referência: ' + op.corteTxt, gx + 6, y(op.corte) - 6); }
      // faixa de 80% e mediana até o dia atual da animação
      ctx.beginPath(); for (var a = 0; a <= idx; a++) ctx.lineTo(x(a), y(S.dias[a].hi)); for (var b = idx; b >= 0; b--) ctx.lineTo(x(b), y(S.dias[b].lo)); ctx.closePath(); ctx.fillStyle = 'rgba(242,181,68,.22)'; ctx.fill();
      ctx.beginPath(); for (var c2 = 0; c2 <= idx; c2++) { var px = x(c2), py = y(S.dias[c2].med); c2 ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.strokeStyle = C.de; ctx.lineWidth = 3; ctx.shadowColor = C.de; ctx.shadowBlur = 12; ctx.stroke(); ctx.shadowBlur = 0;
      var hx = x(idx), hy = y(D.med); ctx.beginPath(); ctx.arc(hx, hy, 6 + 2 * Math.sin(tt / 150), 0, 6.283); ctx.fillStyle = '#fff'; ctx.shadowColor = C.de; ctx.shadowBlur = 20; ctx.fill(); ctx.shadowBlur = 0;
      // agentes sintéticos: coluna à direita
      var ax = narrow ? W - 22 : gx + gw + 46, acima = 0; ag.forEach(function (v, i) { var yy = y(v) + Math.sin(tt / 700 + i) * 1.5, xx = ax + ((i * 37) % 23) - 11; ctx.globalAlpha = .55; ctx.fillStyle = v <= D.med ? C.ok : 'rgba(255,240,220,.6)'; ctx.beginPath(); ctx.arc(xx, yy, 2.3, 0, 6.283); ctx.fill(); if (v <= D.med) acima++; }); ctx.globalAlpha = 1;
      if (ag.length) { ctx.beginPath(); ctx.arc(ax, hy, 7, 0, 6.283); ctx.fillStyle = C.ac; ctx.shadowColor = C.ac; ctx.shadowBlur = 16; ctx.fill(); ctx.shadowBlur = 0; }
      // marcos com explosões
      M.forEach(function (m, mi) { if (m.i <= idx && !feitos[mi]) { feitos[mi] = 1; explosao(hx, hy, m.tipo === 'r' ? C.ok : C.de, op.reduzido ? 0 : 50); legenda = m.txt; legT = tt; } });
      part = part.filter(function (p) { p.x += p.vx; p.y += p.vy; p.vy += 0.06; p.vida -= 0.016; if (p.vida <= 0) return false; ctx.globalAlpha = p.vida; ctx.fillStyle = p.c; ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, 6.283); ctx.fill(); return true; }); ctx.globalAlpha = 1;
      // painel de números
      var ac = D.Q ? Math.round(100 * D.OK / D.Q) : 0, dataTxt = new Date(D.dia + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }), txt = [[D.Q.toLocaleString('pt-BR'), 'questões'], [ac + '%', 'acerto'], [D.med.toFixed(1) + ' / ' + total, 'gêmeo (mediana)'], [Math.round(D.lo) + '–' + Math.round(D.hi), 'faixa 80%']];
      if (ag.length) txt.push([Math.round(100 * acima / ag.length) + '%', 'do campo sintético atrás']);
      ctx.textAlign = 'left';
      var bx = narrow ? 12 : 20, by = narrow ? H - 74 : H - 66; ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(bx - 6, by - 26, W - 2 * bx + 12, narrow ? 72 : 58);
      txt.forEach(function (t, i) { var cols = narrow ? 3 : txt.length, cw = (W - 2 * bx) / cols, tx = bx + (i % cols) * cw, ty = by + Math.floor(i / cols) * 34; ctx.fillStyle = '#fff6e8'; ctx.font = '700 ' + (narrow ? 15 : 19) + 'px system-ui'; ctx.fillText(t[0], tx, ty); ctx.fillStyle = 'rgba(255,240,220,.6)'; ctx.font = '11px system-ui'; ctx.fillText(t[1], tx, ty + 14); });
      // título e legenda de marco
      ctx.fillStyle = '#fff6e8'; ctx.font = '700 ' + (narrow ? 15 : 18) + 'px system-ui'; ctx.fillText(prog < 1 ? 'Sua jornada até aqui…' : 'Hoje, o seu gêmeo digital', narrow ? 16 : 24, 30); ctx.fillStyle = C.de; ctx.font = '700 ' + (narrow ? 13 : 16) + 'px system-ui'; ctx.textAlign = 'right'; ctx.fillText(dataTxt, W - (narrow ? 16 : 24), 30); ctx.textAlign = 'left';
      if (legenda && tt - legT < 2400) { var al = Math.min(1, (2400 - (tt - legT)) / 500); ctx.globalAlpha = al; ctx.font = '700 ' + (narrow ? 16 : 22) + 'px system-ui'; ctx.textAlign = 'center'; ctx.fillStyle = C.de; ctx.shadowColor = C.de; ctx.shadowBlur = 14; ctx.fillText('✦ ' + legenda + ' ✦', W / 2, narrow ? H * 0.40 : 46); ctx.shadowBlur = 0; ctx.textAlign = 'left'; ctx.globalAlpha = 1; }
      if (prog >= 1 && !op._fim) { op._fim = 1; explosao(hx, hy, C.ac, op.reduzido ? 0 : 90); if (op.aoFim) op.aoFim(D); }
      if (prog < 1 || part.length || !op.reduzido) raf = requestAnimationFrame(quadro);
    }
    raf = requestAnimationFrame(quadro);
    return { parar: function () { vivo = false; cancelAnimationFrame(raf); window.removeEventListener('resize', onR); }, pular: function () { t0 = performance.now() - DUR; } };
  }
  raiz.DoraGemeo = { serie: serie, agentes: agentes, marcos: marcos, tocar: tocar, dia: dia };
})(typeof window !== 'undefined' ? window : globalThis);
