/* Dora Pena — camada de anotação do Dora Draw (obra original; só ideias gerais de apps de notas).
   Este arquivo tem 4 partes, todas reaproveitáveis:
   1) lógica pura (testada em testes\pena.test.js): endireitar formas, laço, serialização, sincronia áudio e traço, cronômetro;
   2) criarCamada: o canvas de anotação (caneta, marca-texto, fita, borracha, laço, texto, formas, desfazer/refazer);
   3) criarBarra: a barra de ferramentas (funciona no app e dentro de uma página, com as mesmas classes);
   4) criarGravador: gravação de áudio (MediaRecorder) com limite de tamanho.
   Coordenadas dos traços: "unidades lógicas" onde a largura do bloco vale sempre 1000. Assim a anotação acompanha zoom e tamanho da tela. */
(function (raiz, fabrica) {
  const api = fabrica(raiz);
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  raiz.DoraPena = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (raiz) {
  const LARG = 1000;
  const NOMES_COR = ['ink', 'accent', 'azul', 'ok', 'bad', 'warn'];
  const NOMES_COR_PT = ['Tinta', 'Laranja', 'Azul', 'Verde', 'Vermelho', 'Âmbar'];
  const COR_PADRAO = { ink: '#2b2420', accent: '#b34600', azul: '#1f6470', ok: '#23704a', bad: '#b0372b', warn: '#8a5600' }; // só se o tema não definir o token
  const TIPOS = ['p', 'm', 'l', 'a', 'r', 'e', 't', 'f'];
  const LIMITES = { tracos: 4000, pontos: 6000, texto: 300 };
  const AUDIO = { maxMs: 40 * 60 * 1000, maxBytes: 20 * 1024 * 1024, totalBytes: 300 * 1024 * 1024 };
  const arred = (n) => Math.round(n * 10) / 10;
  const num = (n) => typeof n === 'number' && isFinite(n);
  const novoId = () => 'tr' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

  // ================= 1) LÓGICA PURA =================
  function espessura(k, i) { const t = k === 'm' ? [14, 24, 38] : [2.5, 5, 9]; return t[Math.max(0, Math.min(2, i | 0))]; }
  function tamTexto(i) { return [26, 38, 56][Math.max(0, Math.min(2, i | 0))]; }
  const pares = (p) => { const o = []; for (let i = 0; i + 1 < p.length; i += 2) o.push([p[i], p[i + 1]]); return o; };
  function distSeg(px, py, ax, ay, bx, by) { const dx = bx - ax, dy = by - ay, l = dx * dx + dy * dy; let t = l ? ((px - ax) * dx + (py - ay) * dy) / l : 0; t = Math.max(0, Math.min(1, t)); return Math.hypot(ax + t * dx - px, ay + t * dy - py); }
  function comprimento(p) { let c = 0; for (let i = 2; i + 1 < p.length; i += 2) c += Math.hypot(p[i] - p[i - 2], p[i + 1] - p[i - 1]); return c; }
  function caixaDe(p) { let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity; for (let i = 0; i + 1 < p.length; i += 2) { x0 = Math.min(x0, p[i]); x1 = Math.max(x1, p[i]); y0 = Math.min(y0, p[i + 1]); y1 = Math.max(y1, p[i + 1]); } return { x0, y0, x1, y1 }; }

  // Decide se um traço feito à mão parece uma forma. Devolve { k, p } ou null.
  function endireitar(p) {
    if (!p || p.length < 8) return null; const pts = pares(p), n = pts.length; const cx = caixaDe(p); const w = cx.x1 - cx.x0, h = cx.y1 - cx.y0; const diag = Math.hypot(w, h);
    if (diag < 24) return null;
    const ini = pts[0], fim = pts[n - 1]; const comp = comprimento(p); const corda = Math.hypot(fim[0] - ini[0], fim[1] - ini[1]);
    const desvioAte = (ate) => { let d = 0; for (let i = 0; i <= ate; i++) d = Math.max(d, distSeg(pts[i][0], pts[i][1], ini[0], ini[1], pts[ate][0], pts[ate][1])); return d; };
    // linha: reta e sem voltas
    if (corda >= 30 && desvioAte(n - 1) <= 0.07 * corda && comp <= 1.25 * corda) return { k: 'l', p: [arred(ini[0]), arred(ini[1]), arred(fim[0]), arred(fim[1])] };
    // seta: vai reto até a ponta e depois rabisca perto dela (as asinhas da cabeça)
    let ponta = 0, dmax = 0; pts.forEach((q, i) => { const d = Math.hypot(q[0] - ini[0], q[1] - ini[1]); if (d > dmax) { dmax = d; ponta = i; } });
    if (dmax >= 40 && ponta < n - 3 && ponta >= 2) {
      let perto = true, cauda = 0; for (let i = ponta; i < n; i++) { if (Math.hypot(pts[i][0] - pts[ponta][0], pts[i][1] - pts[ponta][1]) > 0.4 * dmax) perto = false; if (i > ponta) cauda += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); }
      if (perto && cauda >= 0.08 * dmax && desvioAte(ponta) <= 0.08 * dmax) return { k: 'a', p: [arred(ini[0]), arred(ini[1]), arred(pts[ponta][0]), arred(pts[ponta][1])] };
    }
    // formas fechadas: retângulo ou elipse (compara o erro de cada modelo)
    const maior = Math.max(w, h), menor = Math.min(w, h);
    if (menor >= 0.15 * maior && menor >= 14 && corda <= 0.3 * maior && comp >= 2.2 * maior) {
      const a = w / 2, b = h / 2, mx = cx.x0 + a, my = cx.y0 + b; let eE = 0, eR = 0;
      pts.forEach(q => { const u = (q[0] - mx) / a, v = (q[1] - my) / b; eE += Math.abs(Math.sqrt(u * u + v * v) - 1); eR += Math.abs(Math.max(Math.abs(u), Math.abs(v)) - 1); });
      eE /= n; eR /= n; const box = [arred(cx.x0), arred(cx.y0), arred(cx.x1), arred(cx.y1)];
      if (eR < eE && eR < 0.18) return { k: 'r', p: box };
      if (eE <= eR && eE < 0.18) return { k: 'e', p: box };
    }
    return null;
  }
  // "segurar" com uma ferramenta de forma: alinha a ângulos de 15 graus e deixa quadrado/círculo quando está quase
  function ajustarForma(k, p) {
    const [x0, y0, x1, y1] = p;
    if (k === 'l' || k === 'a') { const dx = x1 - x0, dy = y1 - y0, len = Math.hypot(dx, dy), passo = Math.PI / 12; const ang = Math.round(Math.atan2(dy, dx) / passo) * passo; return [x0, y0, arred(x0 + len * Math.cos(ang)), arred(y0 + len * Math.sin(ang))]; }
    if (k === 'r' || k === 'e') { const w = Math.abs(x1 - x0), h = Math.abs(y1 - y0), m = Math.max(w, h); if (m > 0 && Math.min(w, h) / m >= 0.8) { const s = (w + h) / 2; return [x0, y0, arred(x0 + (x1 >= x0 ? s : -s)), arred(y0 + (y1 >= y0 ? s : -s))]; } }
    return p.slice();
  }
  function poligonoContem(poly, x, y) { let dentro = false; const n = poly.length / 2; for (let i = 0, j = n - 1; i < n; j = i++) { const xi = poly[2 * i], yi = poly[2 * i + 1], xj = poly[2 * j], yj = poly[2 * j + 1]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) dentro = !dentro; } return dentro; }
  function caixaTexto(t) { const sz = tamTexto(t.w), ls = String(t.s || '').split('\n'); const larg = Math.max.apply(null, ls.map(l => l.length)) * sz * 0.56; return { x0: t.p[0], y0: t.p[1], x1: t.p[0] + larg, y1: t.p[1] + ls.length * sz * 1.25 }; }
  function caixaDoTraco(t) { if (t.k === 't') return caixaTexto(t); const c = caixaDe(t.p); const r = t.k === 'p' || t.k === 'm' || t.k === 'l' || t.k === 'a' ? espessura(t.k, t.w) / 2 : 0; return { x0: c.x0 - r, y0: c.y0 - r, x1: c.x1 + r, y1: c.y1 + r }; }
  function pontosAmostra(t) {
    if (t.k === 'p' || t.k === 'm') { const ps = pares(t.p), passo = Math.max(1, Math.floor(ps.length / 60)); return ps.filter((_, i) => i % passo === 0); }
    const c = caixaDoTraco(t), mx = (c.x0 + c.x1) / 2, my = (c.y0 + c.y1) / 2;
    if (t.k === 'l' || t.k === 'a') return [0, .25, .5, .75, 1].map(f => [t.p[0] + f * (t.p[2] - t.p[0]), t.p[1] + f * (t.p[3] - t.p[1])]);
    return [[c.x0, c.y0], [c.x1, c.y0], [c.x0, c.y1], [c.x1, c.y1], [mx, my], [mx, c.y0], [mx, c.y1], [c.x0, my], [c.x1, my]];
  }
  // laço: devolve os ids dos traços com pelo menos 60% dos pontos dentro do polígono (texto e fita: o centro dentro também vale)
  function selecionarPorLaco(tracos, poly) {
    if (!poly || poly.length < 6) return []; const ids = [];
    tracos.forEach(t => { const ps = pontosAmostra(t); if (!ps.length) return; const dentro = ps.filter(q => poligonoContem(poly, q[0], q[1])).length; const c = caixaDoTraco(t); const centro = poligonoContem(poly, (c.x0 + c.x1) / 2, (c.y0 + c.y1) / 2); if (dentro / ps.length >= 0.6 || ((t.k === 't' || t.k === 'f') && centro)) ids.push(t.id); });
    return ids;
  }
  function mover(t, dx, dy) { const o = Object.assign({}, t); o.p = t.p.map((v, i) => arred(v + (i % 2 ? dy : dx))); return o; }
  // o ponto (x,y) encosta no traço? (borracha e toque para ouvir)
  function tocaTraco(t, x, y, r) {
    const p = t.p || [];
    if (t.k === 'p' || t.k === 'm') { r += espessura(t.k, t.w) / 2; if (p.length === 2) return Math.hypot(p[0] - x, p[1] - y) <= r; for (let i = 2; i + 1 < p.length; i += 2) if (distSeg(x, y, p[i - 2], p[i - 1], p[i], p[i + 1]) <= r) return true; return false; }
    if (t.k === 'l' || t.k === 'a') return distSeg(x, y, p[0], p[1], p[2], p[3]) <= r + espessura(t.k, t.w) / 2;
    if (t.k === 'r') { const x0 = Math.min(p[0], p[2]), x1 = Math.max(p[0], p[2]), y0 = Math.min(p[1], p[3]), y1 = Math.max(p[1], p[3]); return distSeg(x, y, x0, y0, x1, y0) <= r || distSeg(x, y, x1, y0, x1, y1) <= r || distSeg(x, y, x1, y1, x0, y1) <= r || distSeg(x, y, x0, y1, x0, y0) <= r; }
    if (t.k === 'e') { const a = Math.abs(p[2] - p[0]) / 2 || 1, b = Math.abs(p[3] - p[1]) / 2 || 1, mx = (p[0] + p[2]) / 2, my = (p[1] + p[3]) / 2; const u = (x - mx) / a, v = (y - my) / b; return Math.abs(Math.sqrt(u * u + v * v) - 1) * Math.min(a, b) <= r; }
    const c = caixaDoTraco(t); return x >= c.x0 - r && x <= c.x1 + r && y >= c.y0 - r && y <= c.y1 + r;
  }
  // ---- serialização ----
  const novoDados = () => ({ v: 1, w: LARG, h: 0, e: [] });
  function limparTraco(t) {
    if (!t || typeof t !== 'object' || !TIPOS.includes(t.k) || !Array.isArray(t.p)) return null; let p = t.p.filter(num); if (p.length !== t.p.length) return null;
    if (p.length % 2) p = p.slice(0, -1); const forma = t.k !== 'p' && t.k !== 'm' && t.k !== 't'; if ((forma && p.length < 4) || p.length < 2) return null; if (forma) p = p.slice(0, 4); if (t.k === 't') p = p.slice(0, 2); if (p.length > LIMITES.pontos * 2) return null;
    const o = { id: typeof t.id === 'string' && t.id.length <= 40 ? t.id : novoId(), k: t.k, c: Math.max(0, Math.min(NOMES_COR.length - 1, t.c | 0)), w: Math.max(0, Math.min(2, t.w | 0)), p: p.map(arred) };
    if (t.k === 't') { if (typeof t.s !== 'string' || !t.s.trim()) return null; o.s = t.s.slice(0, LIMITES.texto); }
    if (num(t.t) && t.t >= 0) { o.t = Math.round(t.t); if (num(t.d) && t.d >= 0) o.d = Math.round(t.d); if (typeof t.a === 'string' && t.a.length <= 60) o.a = t.a; }
    if (Array.isArray(t.pr) && t.pr.length === p.length / 2 && t.pr.every(num)) o.pr = t.pr.map(v => Math.max(1, Math.min(100, Math.round(v))));
    return o;
  }
  function limpar(d) {
    if (!d || typeof d !== 'object' || !Array.isArray(d.e)) return novoDados(); const e = []; const vistos = new Set();
    for (const t of d.e) { if (e.length >= LIMITES.tracos) break; const o = limparTraco(t); if (!o) continue; if (vistos.has(o.id)) o.id = novoId(); vistos.add(o.id); e.push(o); }
    return { v: 1, w: LARG, h: num(d.h) ? Math.max(0, Math.round(d.h)) : 0, e };
  }
  const serializar = (d) => JSON.stringify(limpar(d));
  function desserializar(x) { try { return limpar(typeof x === 'string' ? JSON.parse(x) : x); } catch (e) { return novoDados(); } }
  // ---- sincronia áudio e traço ----
  function tracosAcesos(tracos, tMs, o) {
    o = o || {}; const jan = o.janela == null ? 1200 : o.janela;
    return tracos.filter(t => t.t != null && (o.audioId == null || t.a === o.audioId) && tMs >= t.t && tMs <= t.t + (t.d || 0) + jan).map(t => t.id);
  }
  const instanteDoTraco = (t) => (t && t.t != null ? Math.max(0, t.t - 300) : null); // volta 0,3 s para ouvir o começo da fala
  function removerAudio(tracos, audioId) { return tracos.map(t => { if (t.a !== audioId) return t; const o = Object.assign({}, t); delete o.t; delete o.d; delete o.a; return o; }); }
  // ---- cronômetro, temporizador, pomodoro e tempo por questão ----
  function novoRelogio(cfg) {
    cfg = cfg || {}; const modo = ['cron', 'temp', 'pomo', 'questao'].includes(cfg.modo) ? cfg.modo : 'cron'; const focoMs = (cfg.focoMin || 25) * 60000, pausaMs = (cfg.pausaMin || 5) * 60000;
    const alvoMs = modo === 'cron' ? null : modo === 'pomo' ? focoMs : (cfg.minutos || (modo === 'questao' ? 3 : 10)) * 60000;
    return { modo, fase: 'foco', rodando: false, inicio: null, acum: 0, alvoMs, focoMs, pausaMs, ciclos: 0 };
  }
  const decorrido = (e, agora) => e.acum + (e.rodando ? Math.max(0, agora - e.inicio) : 0);
  const iniciarRelogio = (e, agora) => (e.rodando ? e : Object.assign({}, e, { rodando: true, inicio: agora }));
  const pausarRelogio = (e, agora) => (e.rodando ? Object.assign({}, e, { rodando: false, acum: decorrido(e, agora), inicio: null }) : e);
  const restante = (e, agora) => (e.alvoMs == null ? null : e.alvoMs - decorrido(e, agora));
  const acabou = (e, agora) => e.alvoMs != null && decorrido(e, agora) >= e.alvoMs;
  const contaComoEstudo = (e) => e.modo !== 'pomo' || e.fase === 'foco';
  function proximaFase(e, agora) { if (e.modo !== 'pomo') return e; const foco = e.fase === 'pausa'; return Object.assign({}, e, { fase: foco ? 'foco' : 'pausa', alvoMs: foco ? e.focoMs : e.pausaMs, acum: 0, inicio: e.rodando ? agora : null, ciclos: e.ciclos + (foco ? 1 : 0) }); }
  function formatarMs(ms) { const neg = ms < 0; const s = Math.floor(Math.abs(ms) / 1000); const h = Math.floor(s / 3600), m = Math.floor(s / 60) % 60, ss = s % 60; return (neg ? '-' : '') + (h ? h + ':' + String(m).padStart(2, '0') : String(m).padStart(2, '0')) + ':' + String(ss).padStart(2, '0'); }
  const somarTempo = (tempos, chave, ms) => { const o = Object.assign({}, tempos || {}); o[chave] = Math.round((o[chave] || 0) + Math.max(0, ms)); return o; };

  // ---- calculadora simples (sem eval): + - × ÷ ( ) % e vírgula ----
  function calcular(expr) {
    const s = String(expr == null ? '' : expr).replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-').replace(/,/g, '.').replace(/\s+/g, ''); if (!s || /[^0-9+\-*/().%]/.test(s)) return null; let i = 0;
    const numero = () => { const m = s.slice(i).match(/^\d*\.?\d+|^\d+\.?/); if (!m) throw new Error('num'); i += m[0].length; return parseFloat(m[0]); };
    function fator() { if (s[i] === '-') { i++; return -fator(); } if (s[i] === '+') { i++; return fator(); } let v; if (s[i] === '(') { i++; v = soma(); if (s[i] !== ')') throw new Error('par'); i++; } else v = numero(); while (s[i] === '%') { i++; v /= 100; } return v; }
    function termo() { let v = fator(); while (s[i] === '*' || s[i] === '/') { const o = s[i++]; const d = fator(); v = o === '*' ? v * d : v / d; } return v; }
    function soma() { let v = termo(); while (s[i] === '+' || s[i] === '-') { const o = s[i++]; const d = termo(); v = o === '+' ? v + d : v - d; } return v; }
    try { const r = soma(); if (i !== s.length || !isFinite(r)) return null; return Math.round(r * 1e10) / 1e10; } catch (e) { return null; }
  }
  // ---- atalhos de teclado (Alt + tecla), configuráveis ----
  const ATALHOS_PADRAO = { ler: '1', p: '2', m: '3', fita: '4', x: '5', laco: '6', t: '7', forma: '8', laser: '9', ouvir: '0', desfazer: 'z', refazer: 'y' };
  const ATALHOS_NOMES = { ler: 'Ler (sem desenhar)', p: 'Caneta', m: 'Marca-texto', fita: 'Fita', x: 'Borracha', laco: 'Laço', t: 'Texto', forma: 'Forma', laser: 'Laser', ouvir: 'Ouvir áudio', desfazer: 'Desfazer', refazer: 'Refazer' };
  function normalizarAtalhos(o) {
    const out = {}, usados = new Set();
    Object.keys(ATALHOS_PADRAO).forEach(k => { let v = o && typeof o[k] === 'string' ? o[k].trim().toLowerCase().slice(0, 1) : ATALHOS_PADRAO[k]; if (!/^[a-z0-9]$/.test(v) || usados.has(v)) v = ATALHOS_PADRAO[k]; if (usados.has(v)) v = ''; if (v) usados.add(v); out[k] = v; });
    return out;
  }
  const acharAcao = (mapa, tecla) => Object.keys(mapa).find(k => mapa[k] && mapa[k] === String(tecla || '').toLowerCase()) || null;
  const teclaDoEvento = (e) => { const m = /^Digit(\d)$/.exec(e.code || '') || /^Key([A-Z])$/.exec(e.code || ''); return m ? m[1].toLowerCase() : (e.key && e.key.length === 1 ? e.key.toLowerCase() : null); };
  // ---- velocidade de vídeo ----
  const VELOCIDADES = [1, 1.25, 1.5, 2, 2.5];
  function proximaVelocidade(atual, dir) { let i = 0, d = Infinity; VELOCIDADES.forEach((v, j) => { if (Math.abs(v - atual) < d) { d = Math.abs(v - atual); i = j; } }); return VELOCIDADES[Math.max(0, Math.min(VELOCIDADES.length - 1, i + (dir > 0 ? 1 : -1)))]; }

  // ================= utilidades de DOM =================
  function el(tag, at) {
    const e = document.createElement(tag); at = at || {};
    for (const k in at) { const v = at[k]; if (k === 'class') e.className = v; else if (k === 'style' && typeof v === 'string') e.style.cssText = v; else if (k.startsWith('on')) e.addEventListener(k.slice(2), v); else if (v != null && v !== false) e.setAttribute(k, v === true ? '' : v); }
    for (let i = 2; i < arguments.length; i++) [].concat(arguments[i]).forEach(f => { if (f != null && f !== false) e.append(f.nodeType ? f : document.createTextNode(String(f))); });
    return e;
  }

  // ================= 2) A CAMADA =================
  // op: { pai, dados, aoMudar(dados), medida(), relogio(), audioId(), rolar(dx,dy), fixa, dpr }
  function criarCamada(op) {
    const pai = op.pai; let els = limpar(op.dados).e.slice(); let atual = null, sel = new Set(), movendo = null, laco = null, apagando = false, dedo = null, hold = null, acesos = new Set(), visivel = true, temOuvir = false, aoTocar = null, timerSalvar = null, campoTexto = null, vistoCaneta = false;
    let laserPts = [], laserOn = false, laserRaf = 0, atalhos = normalizarAtalhos(op.atalhos);
    let ferr = 'ler', cor = 0, esp = 1, forma = 'l'; const pilha = [], refeitos = [], ouvintes = [], ativos = new Set(), reveladas = new Set(), fitaEls = new Map();
    const camada = el('div', { class: 'pena-camada' + (op.fixa ? ' fixa' : '') }); const canvas = el('canvas', { 'aria-label': 'Camada de anotações' }); const g = canvas.getContext('2d'); camada.append(canvas); pai.append(camada);
    const medir = op.medida || (() => ({ ox: 0, oy: 0, k: (pai.clientWidth || 1) / LARG, w: pai.clientWidth || 1, h: pai.clientHeight || 1 }));
    const agora = () => (op.relogio ? op.relogio() : null);
    const estado = () => ({ atalhos, ferr, cor, esp, forma, visivel, temSelecao: sel.size > 0, podeDesfazer: pilha.length > 0, podeRefazer: refeitos.length > 0, tracos: els.length, temOuvir, fitas: els.filter(t => t.k === 'f').length, reveladas: els.filter(t => t.k === 'f' && reveladas.has(t.id)).length });
    const avisarEstado = () => ouvintes.forEach(f => { try { f(estado()); } catch (e) { /* ouvinte com erro não derruba a camada */ } });
    function lerPaleta() { const cs = typeof getComputedStyle === 'function' ? getComputedStyle(camada) : null; const o = {}; NOMES_COR.forEach(n => { const v = cs && cs.getPropertyValue('--' + n).trim(); o[n] = v || COR_PADRAO[n]; }); return o; }
    const dadosAtuais = () => { const m = medir(); return { v: 1, w: LARG, h: Math.round(m.h / m.k), e: els }; };
    function mudou() { avisarEstado(); clearTimeout(timerSalvar); if (op.aoMudar) timerSalvar = setTimeout(salvarAgora, 450); }
    function salvarAgora() { clearTimeout(timerSalvar); timerSalvar = null; if (op.aoMudar) op.aoMudar(limpar(dadosAtuais())); }
    const guardar = () => { pilha.push(els.slice()); if (pilha.length > 100) pilha.shift(); refeitos.length = 0; };

    // ---- desenho ----
    function trilha(t) {
      const p = t.p; g.beginPath();
      if (t.k === 'p' || t.k === 'm') {
        g.moveTo(p[0], p[1]); if (p.length === 2) { g.lineTo(p[0] + 0.01, p[1]); return; } if (p.length === 4) { g.lineTo(p[2], p[3]); return; }
        for (let i = 2; i + 3 < p.length; i += 2) g.quadraticCurveTo(p[i], p[i + 1], (p[i] + p[i + 2]) / 2, (p[i + 1] + p[i + 3]) / 2); g.lineTo(p[p.length - 2], p[p.length - 1]);
      } else if (t.k === 'l' || t.k === 'a') { g.moveTo(p[0], p[1]); g.lineTo(p[2], p[3]); }
      else if (t.k === 'r') g.rect(Math.min(p[0], p[2]), Math.min(p[1], p[3]), Math.abs(p[2] - p[0]), Math.abs(p[3] - p[1]));
      else if (t.k === 'e') g.ellipse((p[0] + p[2]) / 2, (p[1] + p[3]) / 2, Math.abs(p[2] - p[0]) / 2 || 1, Math.abs(p[3] - p[1]) / 2 || 1, 0, 0, Math.PI * 2);
    }
    function ponta(t, larg) { const p = t.p, an = Math.atan2(p[3] - p[1], p[2] - p[0]), L = 10 + larg * 3.2; g.beginPath(); g.moveTo(p[2], p[3]); g.lineTo(p[2] - L * Math.cos(an - 0.45), p[3] - L * Math.sin(an - 0.45)); g.lineTo(p[2] - L * Math.cos(an + 0.45), p[3] - L * Math.sin(an + 0.45)); g.closePath(); g.fill(); }
    function pintar(t, paleta) {
      const larg = espessura(t.k, t.w), cs = paleta[NOMES_COR[t.c]] || paleta.ink;
      if (acesos.has(t.id)) { g.save(); g.globalAlpha = 0.35; g.strokeStyle = paleta.accent; g.lineWidth = larg + 12; g.lineCap = g.lineJoin = 'round'; if (t.k === 't') { const c = caixaTexto(t); g.fillStyle = paleta.accent; g.fillRect(c.x0 - 6, c.y0 - 6, c.x1 - c.x0 + 12, c.y1 - c.y0 + 12); } else trilha(t); if (t.k !== 't') g.stroke(); g.restore(); }
      g.save(); g.strokeStyle = g.fillStyle = cs; g.lineWidth = larg; g.lineCap = t.k === 'm' ? 'butt' : 'round'; g.lineJoin = 'round';
      if (t.k === 'm') g.globalAlpha = 0.38;
      if (t.k === 'f') { g.globalAlpha = 0.25; g.fillStyle = paleta.accent; g.fillRect(Math.min(t.p[0], t.p[2]), Math.min(t.p[1], t.p[3]), Math.abs(t.p[2] - t.p[0]), Math.abs(t.p[3] - t.p[1])); g.restore(); return; }
      if (t.k === 't') { const sz = tamTexto(t.w); g.font = '600 ' + sz + 'px "Segoe UI", system-ui, sans-serif'; g.textBaseline = 'top'; String(t.s || '').split('\n').forEach((l, i) => g.fillText(l, t.p[0], t.p[1] + i * sz * 1.25)); }
      else if (t.k === 'p' && t.pr && t.pr.length === t.p.length / 2 && t.pr.length > 2) { for (let i = 1; i < t.pr.length; i++) { g.lineWidth = larg * (0.4 + 1.2 * (t.pr[i - 1] + t.pr[i]) / 200); g.beginPath(); g.moveTo(t.p[2 * i - 2], t.p[2 * i - 1]); g.lineTo(t.p[2 * i], t.p[2 * i + 1]); g.stroke(); } }
      else { trilha(t); g.stroke(); if (t.k === 'a') ponta(t, larg); }
      g.restore();
    }
    function ver(t) { // o que mostrar de um traço em andamento (forma já endireitada ou ajustada)
      if (t.fixa) return Object.assign({}, t, { k: t.fixa.k, p: t.fixa.p, pr: null });
      if (t.snap) return Object.assign({}, t, { p: ajustarForma(t.k, t.p) });
      return t;
    }
    function caixaSelecao() { const ts = els.filter(t => sel.has(t.id)); if (!ts.length) return null; const c = { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity }; ts.forEach(t => { const b = caixaDoTraco(t); c.x0 = Math.min(c.x0, b.x0); c.y0 = Math.min(c.y0, b.y0); c.x1 = Math.max(c.x1, b.x1); c.y1 = Math.max(c.y1, b.y1); }); return c; }
    function desenhar() {
      const m = medir(); const dpr = op.dpr || (typeof devicePixelRatio === 'number' ? devicePixelRatio : 1) || 1; const cw = Math.max(1, Math.round(m.w * dpr)), ch = Math.max(1, Math.round(m.h * dpr));
      if (canvas.width !== cw || canvas.height !== ch) { canvas.width = cw; canvas.height = ch; }
      g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, m.w, m.h); posFitas(m); if (!visivel) return;
      const paleta = lerPaleta(); g.save(); g.translate(m.ox, m.oy); g.scale(m.k, m.k);
      const lista = els.concat(atual ? [ver(atual)] : []);
      lista.filter(t => t.k === 'm').forEach(t => pintar(t, paleta)); lista.filter(t => t.k !== 'm' && (t.k !== 'f' || t === lista[lista.length - 1] && atual)).forEach(t => pintar(t, paleta));
      const cs = caixaSelecao(); if (cs) { g.save(); g.setLineDash([8, 6]); g.lineWidth = 2; g.strokeStyle = paleta.azul; g.strokeRect(cs.x0 - 6, cs.y0 - 6, cs.x1 - cs.x0 + 12, cs.y1 - cs.y0 + 12); g.restore(); }
      if (laco && laco.length >= 4) { g.save(); g.setLineDash([6, 6]); g.lineWidth = 2; g.strokeStyle = paleta.azul; g.fillStyle = paleta.azul; g.globalAlpha = 0.9; g.beginPath(); g.moveTo(laco[0], laco[1]); for (let i = 2; i + 1 < laco.length; i += 2) g.lineTo(laco[i], laco[i + 1]); g.stroke(); g.globalAlpha = 0.08; g.fill(); g.restore(); }
      if (laserPts.length) { const agora = performance.now(); g.save(); g.lineCap = g.lineJoin = 'round'; for (let i = 1; i < laserPts.length; i++) { g.globalAlpha = Math.max(0, 1 - (agora - laserPts[i].t) / 1400); g.strokeStyle = paleta.bad; g.lineWidth = 7; g.beginPath(); g.moveTo(laserPts[i - 1].x, laserPts[i - 1].y); g.lineTo(laserPts[i].x, laserPts[i].y); g.stroke(); } const u = laserPts[laserPts.length - 1]; g.globalAlpha = Math.max(0, 1 - (agora - u.t) / 1400); g.fillStyle = paleta.bad; g.beginPath(); g.arc(u.x, u.y, 11, 0, Math.PI * 2); g.fill(); g.restore(); }
      g.restore();
    }
    function tickLaser() { const agora = performance.now(); laserPts = laserPts.filter(p => agora - p.t < 1400); desenhar(); laserRaf = laserPts.length ? requestAnimationFrame(tickLaser) : 0; }
    function posFitas(m) {
      const vistas = new Set();
      if (visivel) els.filter(t => t.k === 'f').forEach(t => {
        vistas.add(t.id); let d = fitaEls.get(t.id);
        if (!d) { const alternar = () => { if (reveladas.has(t.id)) reveladas.delete(t.id); else reveladas.add(t.id); posFitas(medir()); avisarEstado(); }; d = el('div', { class: 'pena-fita', role: 'button', tabindex: '0', 'aria-label': 'Parte tapada. Toque para mostrar ou tapar de novo.', onclick: alternar, onkeydown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); alternar(); } } }, el('span', {}, 'toque para ver')); fitaEls.set(t.id, d); camada.append(d); }
        const x0 = Math.min(t.p[0], t.p[2]), y0 = Math.min(t.p[1], t.p[3]); d.style.left = (m.ox + x0 * m.k) + 'px'; d.style.top = (m.oy + y0 * m.k) + 'px'; d.style.width = Math.abs(t.p[2] - t.p[0]) * m.k + 'px'; d.style.height = Math.abs(t.p[3] - t.p[1]) * m.k + 'px'; d.classList.toggle('aberta', reveladas.has(t.id));
      });
      for (const [id, d] of fitaEls) if (!vistas.has(id)) { d.remove(); fitaEls.delete(id); }
    }

    // ---- entrada (mouse, caneta e toque) ----
    const ponto = (e) => { const r = canvas.getBoundingClientRect(), m = medir(); return [arred((e.clientX - r.left - m.ox) / m.k), arred((e.clientY - r.top - m.oy) / m.k)]; };
    const pressao = (e) => (e.pointerType === 'pen' && e.pressure > 0 ? Math.max(1, Math.round(e.pressure * 100)) : null);
    function armarHold() {
      clearTimeout(hold); if (!atual) return;
      hold = setTimeout(() => {
        if (!atual) return; const k = atual.k;
        if (k === 'p' && atual.p.length >= 8) { const f = endireitar(atual.p); if (f) { atual.fixa = f; atual.fixaEm = atual.p.slice(-2); } }
        else if (k === 'm' && atual.p.length >= 4) { atual.fixa = { k: 'm', p: [atual.p[0], atual.p[1], atual.p[atual.p.length - 2], atual.p[atual.p.length - 1]] }; atual.fixaEm = atual.p.slice(-2); }
        else if (k === 'l' || k === 'a' || k === 'r' || k === 'e') atual.snap = true;
        desenhar();
      }, 550);
    }
    const acharTraco = (x, y) => { for (let i = els.length - 1; i >= 0; i--) if (tocaTraco(els[i], x, y, 14)) return els[i]; return null; };
    function dentroSelecao(x, y) { const c = caixaSelecao(); return !!c && x >= c.x0 - 8 && x <= c.x1 + 8 && y >= c.y0 - 8 && y <= c.y1 + 8; }
    function apagaEm(x, y) { const n = els.length; els = els.filter(t => !tocaTraco(t, x, y, 10)); if (els.length !== n) { sel = new Set([...sel].filter(id => els.some(t => t.id === id))); desenhar(); } }
    function pedirTexto(x, y) {
      if (campoTexto) campoTexto.remove(); const m = medir(); const inp = el('input', { type: 'text', class: 'pena-texto-campo', placeholder: 'Digite e tecle Enter', 'aria-label': 'Texto da anotação' }); inp.style.left = Math.max(4, m.ox + x * m.k) + 'px'; inp.style.top = (m.oy + y * m.k) + 'px'; campoTexto = inp; let feito = false;
      const ok = () => { if (feito) return; feito = true; const s = inp.value.trim(); inp.remove(); campoTexto = null; if (s) { guardar(); const t = { id: novoId(), k: 't', c: cor, w: esp, p: [x, y], s: s.slice(0, LIMITES.texto) }; const ag = agora(); if (ag != null) { t.t = ag; t.d = 0; if (op.audioId && op.audioId()) t.a = op.audioId(); } els.push(t); desenhar(); mudou(); } };
      inp.addEventListener('keydown', (e) => { e.stopPropagation(); if (e.key === 'Enter') ok(); if (e.key === 'Escape') { feito = true; inp.remove(); campoTexto = null; } }); inp.addEventListener('blur', ok); camada.append(inp); setTimeout(() => inp.focus(), 0);
    }
    function iniciar(x, y, pr) {
      if (ferr === 'laser') { laserOn = true; laserPts.push({ x, y, t: performance.now() }); if (!laserRaf) laserRaf = requestAnimationFrame(tickLaser); return; }
      if (ferr === 'x') { guardar(); apagando = true; apagaEm(x, y); return; }
      if (ferr === 't') { pedirTexto(x, y); return; }
      if (ferr === 'ouvir') { const t = acharTraco(x, y); if (t && aoTocar) aoTocar(t); return; }
      if (ferr === 'laco') { if (sel.size && dentroSelecao(x, y)) { guardar(); movendo = { x, y, base: els, moveu: false }; } else { sel = new Set(); laco = [x, y]; avisarEstado(); } return; }
      const k = ferr === 'forma' ? forma : ferr === 'fita' ? 'f' : ferr; const livre = k === 'p' || k === 'm';
      atual = { id: novoId(), k, c: cor, w: esp, p: livre ? [x, y] : [x, y, x, y] }; if (k === 'p' && pr) atual.pr = [pr]; const ag = agora(); if (ag != null) { atual.t = ag; const a = op.audioId && op.audioId(); if (a) atual.a = a; } armarHold();
    }
    function mover_(x, y, pr) {
      if (laserOn) { laserPts.push({ x, y, t: performance.now() }); return; }
      if (apagando) { apagaEm(x, y); return; }
      if (movendo) { const dx = x - movendo.x, dy = y - movendo.y; if (Math.abs(dx) + Math.abs(dy) > 1) movendo.moveu = true; els = movendo.base.map(t => (sel.has(t.id) ? mover(t, dx, dy) : t)); desenhar(); return; }
      if (laco) { laco.push(x, y); desenhar(); return; }
      if (!atual) return; const p = atual.p;
      if (atual.k === 'p' || atual.k === 'm') {
        if (atual.fixa && Math.hypot(x - atual.fixaEm[0], y - atual.fixaEm[1]) < 8) return; if (atual.fixa) { atual.fixa = null; }
        const n = p.length; if (Math.hypot(x - p[n - 2], y - p[n - 1]) >= 1.2) { p.push(x, y); if (atual.pr) atual.pr.push(pr || atual.pr[atual.pr.length - 1]); armarHold(); }
      } else { p[2] = x; p[3] = y; armarHold(); }
      desenhar();
    }
    function terminar() {
      clearTimeout(hold); if (laserOn) { laserOn = false; return; }
      if (apagando) { apagando = false; mudou(); desenhar(); return; }
      if (movendo) { if (!movendo.moveu) pilha.pop(); else { mudou(); } movendo = null; desenhar(); return; }
      if (laco) { sel = new Set(selecionarPorLaco(els, laco)); laco = null; avisarEstado(); desenhar(); return; }
      if (!atual) return; let t = atual; atual = null;
      if (t.fixa) { t = Object.assign({}, t, { k: t.fixa.k, p: t.fixa.p }); delete t.pr; } else if (t.snap) t.p = ajustarForma(t.k, t.p);
      delete t.fixa; delete t.fixaEm; delete t.snap;
      if (t.k === 'p' || t.k === 'm') { if (t.p.length === 2) { t.p.push(t.p[0] + 0.01, t.p[1]); if (t.pr) t.pr.push(t.pr[0]); } }
      else { const c = caixaDe(t.p); if (Math.max(c.x1 - c.x0, c.y1 - c.y0) < 4) { desenhar(); return; } t.p = t.p.slice(0, 4); }
      if (t.t != null) { const ag = agora(); t.d = Math.max(0, (ag == null ? t.t : ag) - t.t); }
      guardar(); els.push(t); desenhar(); mudou();
    }
    function cancelar() { clearTimeout(hold); laserOn = false; atual = null; laco = null; if (apagando) { apagando = false; } if (movendo) { els = movendo.base; movendo = null; pilha.pop(); } desenhar(); }
    canvas.addEventListener('pointerdown', (e) => {
      if (ferr === 'ler') return; if (e.pointerType === 'pen') vistoCaneta = true;
      if (e.pointerType === 'touch' && (vistoCaneta || op.soCaneta)) { dedo = { id: e.pointerId, x: e.clientX, y: e.clientY }; try { canvas.setPointerCapture(e.pointerId); } catch (er) { /* */ } return; } // palma e dedo não desenham quando há caneta
      if (e.pointerType === 'mouse' && e.button !== 0) return; ativos.add(e.pointerId);
      if (ativos.size > 1) { cancelar(); return; } // dois dedos: gesto, não traço
      e.preventDefault(); try { canvas.setPointerCapture(e.pointerId); } catch (er) { /* */ } const [x, y] = ponto(e); iniciar(x, y, pressao(e));
    });
    canvas.addEventListener('pointermove', (e) => {
      if (dedo && e.pointerId === dedo.id) { const dx = e.clientX - dedo.x, dy = e.clientY - dedo.y; dedo.x = e.clientX; dedo.y = e.clientY; if (op.rolar) op.rolar(-dx, -dy); else if (typeof scrollBy === 'function') scrollBy(-dx, -dy); return; }
      if (!ativos.has(e.pointerId)) return; const [x, y] = ponto(e); mover_(x, y, pressao(e));
    });
    const soltou = (e) => { if (dedo && e.pointerId === dedo.id) { dedo = null; return; } if (!ativos.has(e.pointerId)) return; ativos.delete(e.pointerId); if (e.type === 'pointercancel') cancelar(); else terminar(); };
    canvas.addEventListener('pointerup', soltou); canvas.addEventListener('pointercancel', soltou);
    canvas.addEventListener('contextmenu', (e) => { if (ferr !== 'ler') e.preventDefault(); });
    const tecla = (e) => {
      if (ferr === 'ler' || !camada.isConnected) return; const origem = (e.composedPath && e.composedPath()[0]) || e.target; const alvo = origem && origem.tagName; if (alvo === 'INPUT' || alvo === 'TEXTAREA' || alvo === 'SELECT') return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') { e.preventDefault(); if (e.shiftKey) api_.refazer(); else api_.desfazer(); }
      else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') { e.preventDefault(); api_.refazer(); }
      else if ((e.key === 'Delete' || e.key === 'Backspace') && sel.size) { e.preventDefault(); api_.apagarSelecao(); }
      else if (e.key === 'Escape' && sel.size) { sel = new Set(); avisarEstado(); desenhar(); }
    };
    document.addEventListener('keydown', tecla, true);
    const teclaAlt = (e) => {
      if (!e.altKey || e.ctrlKey || e.metaKey || !camada.isConnected) return; const acao = acharAcao(atalhos, teclaDoEvento(e)); if (!acao) return;
      e.preventDefault(); e.stopPropagation(); if (acao === 'desfazer') api_.desfazer(); else if (acao === 'refazer') api_.refazer(); else if (acao === 'ouvir' && !temOuvir) return; else api_.ferramenta(acao);
    };
    document.addEventListener('keydown', teclaAlt, true);
    let ro = null; if (typeof ResizeObserver === 'function') { ro = new ResizeObserver(() => desenhar()); ro.observe(pai); }
    const noResize = () => desenhar(); if (typeof addEventListener === 'function') addEventListener('resize', noResize);

    const api_ = {
      el: camada, canvas, estado, desenhar, redesenhar: desenhar, salvarAgora,
      dados: () => limpar(dadosAtuais()),
      carregar(d) { els = limpar(d).e.slice(); pilha.length = 0; refeitos.length = 0; sel = new Set(); acesos = new Set(); reveladas.clear(); desenhar(); avisarEstado(); },
      aoEstado(f) { ouvintes.push(f); f(estado()); },
      aoTocarTraco(f) { aoTocar = f; },
      definirOuvir(v) { temOuvir = !!v; if (!v && ferr === 'ouvir') api_.ferramenta('ler'); avisarEstado(); },
      ferramenta(f, sub) { if (sub) forma = sub; ferr = f; if (f !== 'laco' && sel.size) { sel = new Set(); } camada.classList.toggle('ativa', f !== 'ler'); canvas.style.cursor = f === 'x' ? 'cell' : f === 'ouvir' ? 'pointer' : f === 't' ? 'text' : 'crosshair'; if (campoTexto) { campoTexto.remove(); campoTexto = null; } desenhar(); avisarEstado(); },
      atalhos: () => atalhos, definirAtalhos(m) { atalhos = normalizarAtalhos(m); if (op.aoMudarAtalhos) op.aoMudarAtalhos(atalhos); avisarEstado(); },
      cor(i) { cor = Math.max(0, Math.min(NOMES_COR.length - 1, i | 0)); if (sel.size) { guardar(); els = els.map(t => (sel.has(t.id) && t.k !== 'f' ? Object.assign({}, t, { c: cor }) : t)); mudou(); desenhar(); } avisarEstado(); },
      espessura(i) { esp = Math.max(0, Math.min(2, i | 0)); avisarEstado(); },
      desfazer() { if (!pilha.length) return; refeitos.push(els); els = pilha.pop(); sel = new Set(); desenhar(); mudou(); },
      refazer() { if (!refeitos.length) return; pilha.push(els); els = refeitos.pop(); sel = new Set(); desenhar(); mudou(); },
      limpar() { if (!els.length) return; guardar(); els = []; sel = new Set(); reveladas.clear(); desenhar(); mudou(); },
      apagarSelecao() { if (!sel.size) return; guardar(); els = els.filter(t => !sel.has(t.id)); sel = new Set(); desenhar(); mudou(); },
      tapar(cobrir) { if (cobrir) reveladas.clear(); else els.filter(t => t.k === 'f').forEach(t => reveladas.add(t.id)); desenhar(); avisarEstado(); },
      mostrar(v) { visivel = !!v; camada.classList.toggle('oculta', !visivel); desenhar(); avisarEstado(); },
      acender(tMs, audioId) { const novo = new Set(tMs == null ? [] : tracosAcesos(els, tMs, { audioId })); let igual = novo.size === acesos.size; if (igual) for (const id of novo) if (!acesos.has(id)) { igual = false; break; } if (!igual) { acesos = novo; desenhar(); } },
      tracosDoAudio: (audioId) => els.filter(t => t.a === audioId),
      removerAudio(audioId) { els = removerAudio(els, audioId); mudou(); },
      destruir() { clearTimeout(hold); if (timerSalvar) salvarAgora(); document.removeEventListener('keydown', tecla, true); document.removeEventListener('keydown', teclaAlt, true); if (ro) ro.disconnect(); if (typeof removeEventListener === 'function') removeEventListener('resize', noResize); camada.remove(); }
    };
    desenhar(); return api_;
  }

  // ================= 3) A BARRA =================
  // opc: { extras: [nós], aoFechar, rotulo }. Usa só estas classes: ferr, seg, cores, cor, btn, mini. Vale no app e dentro da página.
  const FERRAMENTAS = [['ler', 'Ler', 'Só ler: rolar e selecionar texto, sem desenhar'], ['p', 'Caneta', 'Caneta (segure no fim do traço para endireitar a forma)'], ['m', 'Marca-texto', 'Marca-texto (segure no fim para fazer uma reta)'], ['fita', 'Fita', 'Fita corretiva: tapa uma parte; toque nela para revelar'], ['x', 'Borracha', 'Borracha: apaga o traço inteiro'], ['laco', 'Laço', 'Laço: circule traços para mover ou apagar'], ['t', 'Texto', 'Texto solto'], ['forma', 'Forma', 'Linha, seta, retângulo ou círculo'], ['laser', 'Laser', 'Ponteiro laser: o traço some sozinho e não é salvo'], ['ouvir', 'Ouvir', 'Toque num traço para pular o áudio até ele']];
  const FORMAS = [['l', 'Linha'], ['a', 'Seta'], ['r', 'Retângulo'], ['e', 'Círculo']];
  function criarCalculadora() {
    const tela = el('input', { type: 'text', class: 'pena-calc-tela', inputmode: 'decimal', 'aria-label': 'Conta', placeholder: 'ex.: 12,5 × 4 + 10%' }); const res = el('div', { class: 'pena-calc-res', 'aria-live': 'polite' }, '=');
    const calc = () => { const v = calcular(tela.value); res.textContent = v == null ? (tela.value.trim() ? 'conta incompleta' : '=') : '= ' + String(v).replace('.', ','); return v; };
    tela.addEventListener('input', calc); tela.addEventListener('keydown', (e) => { e.stopPropagation(); if (e.key === 'Enter') { const v = calc(); if (v != null) tela.value = String(v).replace('.', ','); } });
    const toca = (t) => { if (t === 'C') tela.value = ''; else if (t === '=') { const v = calc(); if (v != null) tela.value = String(v).replace('.', ','); } else tela.value += t; calc(); tela.focus(); };
    const grade = el('div', { class: 'pena-calc-grade' }, [['7', '8', '9', '÷'], ['4', '5', '6', '×'], ['1', '2', '3', '−'], ['0', ',', '(', ')'], ['%', '+', 'C', '=']].flat().map(t => el('button', { type: 'button', class: 'btn mini', onclick: () => toca(t) }, t)));
    return el('div', { class: 'pena-calc', role: 'group', 'aria-label': 'Calculadora' }, tela, res, grade);
  }
  function criarBarra(camada, opc) {
    opc = opc || {}; const B = (rot, fn, extra) => el('button', Object.assign({ class: 'btn mini', type: 'button', onclick: fn }, extra || {}), rot);
    const bF = {}; const segF = el('div', { class: 'seg', role: 'group', 'aria-label': 'Ferramenta' });
    FERRAMENTAS.forEach(([k, n, dica]) => { const b = el('button', { type: 'button', title: dica, 'data-dica': dica, 'aria-pressed': 'false', 'data-f': k, onclick: () => camada.ferramenta(k) }, n); bF[k] = b; segF.append(b); });
    const selForma = el('select', { 'aria-label': 'Tipo de forma', onchange: (e) => camada.ferramenta('forma', e.target.value) }, FORMAS.map(([k, n]) => el('option', { value: k }, n)));
    const bC = NOMES_COR.map((n, i) => el('button', { type: 'button', class: 'cor', style: 'background:var(--' + n + ')', 'aria-label': 'Cor ' + NOMES_COR_PT[i], title: NOMES_COR_PT[i], 'aria-pressed': 'false', onclick: () => camada.cor(i) }));
    const bE = [['Fino', 0], ['Médio', 1], ['Grosso', 2]].map(([n, i]) => el('button', { type: 'button', 'aria-pressed': 'false', onclick: () => camada.espessura(i) }, n));
    const bDes = B('↶ Desfazer', () => camada.desfazer()), bRef = B('↷ Refazer', () => camada.refazer()), bApSel = B('Apagar seleção', () => camada.apagarSelecao()), bTapa = B('Tapar tudo', () => camada.tapar(true)), bReve = B('Revelar tudo', () => camada.tapar(false)), bOcu = B('Ocultar anotações', () => camada.mostrar(!camada.estado().visivel));
    const calc = criarCalculadora(); calc.hidden = true; const bCalc = B('Calculadora', () => { calc.hidden = !calc.hidden; bCalc.setAttribute('aria-pressed', String(!calc.hidden)); }, { 'aria-pressed': 'false' });
    const painelAt = el('div', { class: 'pena-atalhos', hidden: true }); const bAt = B('Atalhos', () => { painelAt.hidden = !painelAt.hidden; bAt.setAttribute('aria-pressed', String(!painelAt.hidden)); if (!painelAt.hidden) montaAtalhos(); }, { 'aria-pressed': 'false' });
    function montaAtalhos() { const m = camada.atalhos(); painelAt.replaceChildren(el('div', { class: 'peq' }, 'Segure Alt e aperte a tecla. Troque a tecla de cada ferramenta (uma letra ou número):'), ...Object.keys(m).map(k => { const inp = el('input', { type: 'text', maxlength: '1', value: m[k], 'aria-label': 'Tecla de ' + ATALHOS_NOMES[k], style: 'width:44px;min-height:32px;text-align:center', onchange: () => { const n = Object.assign({}, camada.atalhos()); n[k] = inp.value; camada.definirAtalhos(n); montaAtalhos(); } }); return el('label', { class: 'peq', style: 'display:inline-flex;gap:6px;align-items:center;margin:2px 10px 2px 0' }, 'Alt +', inp, ATALHOS_NOMES[k]); }), el('div', {}, B('Restaurar padrão', () => { camada.definirAtalhos({}); montaAtalhos(); }))); }
    const bLimpa = B('Limpar tudo', () => { if (!camada.estado().tracos) return; if (typeof confirm === 'function' && !confirm('Apagar todas as anotações desta camada? Dá para desfazer em seguida.')) return; camada.limpar(); });
    const barra = el('div', { class: 'pena-barra', role: 'toolbar', 'aria-label': opc.rotulo || 'Dora Pena: ferramentas de anotação' },
      el('div', { class: 'ferr' }, segF, selForma), el('div', { class: 'ferr' }, el('div', { class: 'cores', role: 'group', 'aria-label': 'Cor' }, bC), el('div', { class: 'seg', role: 'group', 'aria-label': 'Espessura' }, bE)),
      el('div', { class: 'ferr' }, bDes, bRef, bApSel, bTapa, bReve, bLimpa, bOcu, bCalc, bAt, opc.aoFechar ? B('Fechar', opc.aoFechar) : null), calc, painelAt);
    (opc.extras || []).forEach(x => { if (x) barra.append(x); });
    function pinta(s) {
      Object.keys(bF).forEach(k => { bF[k].setAttribute('aria-pressed', String(s.ferr === k)); const t = s.atalhos && s.atalhos[k]; bF[k].title = bF[k].dataset.dica + (t ? ' (Alt+' + t.toUpperCase() + ')' : ''); }); bF.ouvir.hidden = !s.temOuvir; selForma.value = s.forma;
      bC.forEach((b, i) => b.setAttribute('aria-pressed', String(i === s.cor))); bE.forEach((b, i) => b.setAttribute('aria-pressed', String(i === s.esp)));
      bDes.disabled = !s.podeDesfazer; bRef.disabled = !s.podeRefazer; bApSel.hidden = !s.temSelecao; bTapa.hidden = !(s.fitas && s.reveladas > 0); bReve.hidden = !(s.fitas && s.reveladas < s.fitas); bOcu.textContent = s.visivel ? 'Ocultar anotações' : 'Mostrar anotações'; bLimpa.disabled = !s.tracos;
    }
    camada.aoEstado(pinta); return barra;
  }

  // ================= 4) O GRAVADOR =================
  function criarGravador(op) {
    op = op || {}; const maxMs = op.maxMs || AUDIO.maxMs, maxBytes = op.maxBytes || AUDIO.maxBytes; let mr = null, partes = [], bytes = 0, t0 = 0, stream = null, timer = null, mime = '', resolver = null, motivo = '';
    const suporta = () => typeof navigator !== 'undefined' && !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) && typeof MediaRecorder !== 'undefined';
    async function iniciar() {
      if (!suporta()) throw new Error('Este navegador não grava áudio.'); stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mime = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'].find(m => MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(m)) || ''; partes = []; bytes = 0; motivo = '';
      mr = new MediaRecorder(stream, Object.assign({ audioBitsPerSecond: 32000 }, mime ? { mimeType: mime } : {}));
      mr.ondataavailable = (e) => { if (e.data && e.data.size) { partes.push(e.data); bytes += e.data.size; if (bytes >= maxBytes) { motivo = 'limite de tamanho'; parar(); } } };
      mr.onstop = () => { clearTimeout(timer); const dur = Math.round(performance.now() - t0); stream.getTracks().forEach(t => t.stop()); const blob = partes.length ? new Blob(partes, { type: mime || 'audio/webm' }) : null; const r = blob ? { blob, duracaoMs: dur, bytes: blob.size, mime: blob.type, motivo } : null; if (op.aoParar) op.aoParar(r); if (resolver) resolver(r); resolver = null; };
      mr.start(1000); t0 = performance.now(); timer = setTimeout(() => { motivo = 'limite de tempo'; parar(); }, maxMs);
    }
    function parar() { return new Promise((res) => { if (!mr || mr.state === 'inactive') return res(null); resolver = res; mr.stop(); }); }
    return { suporta, iniciar, parar, agora: () => (mr && mr.state === 'recording' ? Math.round(performance.now() - t0) : null), gravando: () => !!mr && mr.state === 'recording', bytes: () => bytes };
  }
  // webm gravado pelo navegador não traz a duração: este truque faz o navegador descobri-la e permite pular para um instante
  function prepararAudio(a) { a.addEventListener('loadedmetadata', () => { if (a.duration === Infinity) { a.currentTime = 1e101; const volta = () => { a.removeEventListener('timeupdate', volta); a.currentTime = 0; }; a.addEventListener('timeupdate', volta); } }); return a; }

  return { LARG, NOMES_COR, NOMES_COR_PT, COR_PADRAO, AUDIO, espessura, tamTexto, endireitar, ajustarForma, poligonoContem, selecionarPorLaco, mover, tocaTraco, caixaDoTraco, pontosAmostra,
    calcular, ATALHOS_PADRAO, ATALHOS_NOMES, normalizarAtalhos, acharAcao, teclaDoEvento, VELOCIDADES, proximaVelocidade, novoDados, limpar, serializar, desserializar, tracosAcesos, instanteDoTraco, removerAudio, novoRelogio, decorrido, iniciarRelogio, pausarRelogio, restante, acabou, contaComoEstudo, proximaFase, formatarMs, somarTempo, novoId,
    el, criarCamada, criarBarra, criarGravador, prepararAudio };
});
