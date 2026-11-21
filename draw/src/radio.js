/* Dora Draw — Rádio Foco: sons de concentração GERADOS no navegador com Web Audio. Nenhum arquivo de áudio, nenhuma música de terceiros.
   Ruído branco, rosa e marrom; chuva sintética; "café" sintético. Volume, temporizador e ligação automática com o Dora Foco. */
(function (raiz) {
  const TIPOS = [['branco', 'Ruído branco', 'Chiado uniforme, bom para tapar barulho'], ['rosa', 'Ruído rosa', 'Mais grave e macio, parece cachoeira distante'], ['marrom', 'Ruído marrom', 'Grave e fundo, parece trovão distante'], ['chuva', 'Chuva', 'Chuva sintética com pingos'], ['cafe', 'Café', 'Murmúrio de conversa e xícaras ao longe']];
  const CHAVE = 'doraDraw.radio';
  const ler = () => { try { return Object.assign({ tipo: 'rosa', vol: 0.4, min: 0, junto: false }, JSON.parse(localStorage.getItem(CHAVE) || '{}')); } catch (e) { return { tipo: 'rosa', vol: 0.4, min: 0, junto: false }; } };
  const gravar = (c) => { try { localStorage.setItem(CHAVE, JSON.stringify(c)); } catch (e) { /* sem armazenamento */ } };
  const R = { TIPOS, cfg: ler(), tocando: false, origem: null, fim: null };
  let ctx = null, mestre = null, nos = [], tempos = [], temporizador = null, ouvintes = [];
  const avisa = () => ouvintes.forEach(f => { try { f(R); } catch (e) { /* ouvinte quebrado */ } });
  R.aoMudar = (f) => { ouvintes.push(f); return () => { ouvintes = ouvintes.filter(x => x !== f); }; };

  function buffer(tipo) {
    const seg = 4, n = ctx.sampleRate * seg; const b = ctx.createBuffer(1, n, ctx.sampleRate); const d = b.getChannelData(0);
    if (tipo === 'branco') for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    else if (tipo === 'marrom') { let ult = 0; for (let i = 0; i < n; i++) { const w = Math.random() * 2 - 1; ult = (ult + 0.02 * w) / 1.02; d[i] = ult * 3.5; } }
    else { let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0; for (let i = 0; i < n; i++) { const w = Math.random() * 2 - 1; b0 = 0.99886 * b0 + w * 0.0555179; b1 = 0.99332 * b1 + w * 0.0750759; b2 = 0.969 * b2 + w * 0.153852; b3 = 0.8665 * b3 + w * 0.3104856; b4 = 0.55 * b4 + w * 0.5329522; b5 = -0.7616 * b5 - w * 0.016898; d[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11; b6 = w * 0.115926; } }
    // emenda suave: o fim do buffer encontra o começo sem estalo
    const f = Math.floor(ctx.sampleRate * 0.05); for (let i = 0; i < f; i++) { const k = i / f; d[n - 1 - i] = d[n - 1 - i] * (1 - k) + d[f - 1 - i] * k; }
    return b;
  }
  function fonteRuido(tipo) { const s = ctx.createBufferSource(); s.buffer = buffer(tipo); s.loop = true; s.start(); nos.push(s); return s; }
  function ganho(v, destino) { const g = ctx.createGain(); g.gain.value = v; g.connect(destino); nos.push(g); return g; }
  function filtro(tipo, freq, q, destino) { const f = ctx.createBiquadFilter(); f.type = tipo; f.frequency.value = freq; f.Q.value = q || 0.7; f.connect(destino); nos.push(f); return f; }
  function lfo(freq, prof, alvo) { const o = ctx.createOscillator(); o.frequency.value = freq; const g = ctx.createGain(); g.gain.value = prof; o.connect(g); g.connect(alvo); o.start(); nos.push(o, g); return o; }
  const agenda = (fn, min, max) => { const passo = () => { if (!R.tocando) return; fn(); tempos.push(setTimeout(passo, min + Math.random() * (max - min))); }; tempos.push(setTimeout(passo, min + Math.random() * (max - min))); };
  function pingo(destino, f0, f1, vol, dur) { const s = ctx.createBufferSource(); s.buffer = ruidoCurto || (ruidoCurto = buffer('branco')); const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = f0 + Math.random() * (f1 - f0); bp.Q.value = 3; const g = ctx.createGain(); const t = ctx.currentTime; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + 0.004); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); s.connect(bp); bp.connect(g); g.connect(destino); s.start(t, Math.random() * 2, dur + 0.05); }
  let ruidoCurto = null;
  function clink(destino) { const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = 1800 + Math.random() * 2200; const g = ctx.createGain(); const t = ctx.currentTime; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.05 + Math.random() * 0.04, t + 0.003); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.25 + Math.random() * 0.25); o.connect(g); g.connect(destino); o.start(t); o.stop(t + 0.6); }

  function monta(tipo) {
    if (tipo === 'branco' || tipo === 'rosa' || tipo === 'marrom') { const f = fonteRuido(tipo); f.connect(ganho(tipo === 'branco' ? 0.35 : 0.8, mestre)); return; }
    if (tipo === 'chuva') {
      const base = fonteRuido('rosa'); const hp = filtro('highpass', 500, 0.5, ganho(0.7, mestre)); base.connect(hp);
      const chiado = fonteRuido('branco'); chiado.connect(filtro('bandpass', 5500, 0.6, ganho(0.06, mestre)));
      agenda(() => pingo(mestre, 1800, 6500, 0.08 + Math.random() * 0.1, 0.03 + Math.random() * 0.05), 25, 110); return;
    }
    if (tipo === 'cafe') {
      const m1 = fonteRuido('marrom'); const bp1 = filtro('bandpass', 420, 0.6, ganho(0.9, mestre)); m1.connect(bp1); lfo(0.15, 160, bp1.frequency);
      const m2 = fonteRuido('rosa'); const g2 = ganho(0.25, mestre); const bp2 = filtro('bandpass', 900, 1.2, g2); m2.connect(bp2); lfo(0.4, 300, bp2.frequency); lfo(0.23, 0.12, g2.gain);
      const m3 = fonteRuido('rosa'); m3.connect(filtro('lowpass', 250, 0.7, ganho(0.35, mestre)));
      agenda(() => clink(mestre), 1500, 6500); agenda(() => pingo(mestre, 300, 1200, 0.05, 0.12), 400, 1600);
    }
  }

  function limpa() { tempos.forEach(clearTimeout); tempos = []; nos.forEach(n => { try { if (n.stop) n.stop(); n.disconnect(); } catch (e) { /* já parado */ } }); nos = []; if (temporizador) { clearTimeout(temporizador); temporizador = null; } R.fim = null; }
  R.ligar = async (tipo, origem) => {
    try {
      R.parar(true); tipo = tipo || R.cfg.tipo; R.cfg.tipo = tipo; gravar(R.cfg);
      if (!ctx) { const AC = raiz.AudioContext || raiz.webkitAudioContext; if (!AC) throw new Error('Este navegador não tem Web Audio.'); ctx = new AC(); }
      if (ctx.state === 'suspended') await ctx.resume();
      ruidoCurto = null; mestre = ctx.createGain(); mestre.gain.value = 0; mestre.connect(ctx.destination); nos.push(mestre);
      R.tocando = true; R.origem = origem || 'manual'; monta(tipo);
      mestre.gain.setTargetAtTime(Math.pow(R.cfg.vol, 2), ctx.currentTime, 0.4);
      if (R.cfg.min > 0) { R.fim = Date.now() + R.cfg.min * 60000; temporizador = setTimeout(() => R.parar(), R.cfg.min * 60000); }
      avisa(); return true;
    } catch (e) { R.tocando = false; avisa(); throw e; }
  };
  R.parar = (silencioso) => {
    if (!silencioso) R.origem = 'parou-manual'; // não deixa o "junto com o Foco" religar sozinho depois de você parar
    if (!mestre || !R.tocando) { limpa(); R.tocando = false; if (!silencioso) avisa(); return; }
    const m = mestre; try { m.gain.setTargetAtTime(0, ctx.currentTime, 0.15); } catch (e) { /* sem contexto */ }
    R.tocando = false; const velhos = nos.slice(); tempos.forEach(clearTimeout); tempos = []; if (temporizador) { clearTimeout(temporizador); temporizador = null; } R.fim = null; nos = [];
    setTimeout(() => velhos.forEach(n => { try { if (n.stop) n.stop(); n.disconnect(); } catch (e) { /* já parado */ } }), 700); if (!silencioso) avisa();
  };
  R.volume = (v) => { R.cfg.vol = Math.max(0, Math.min(1, v)); gravar(R.cfg); if (mestre && R.tocando) mestre.gain.setTargetAtTime(Math.pow(R.cfg.vol, 2), ctx.currentTime, 0.1); };
  R.temporizador = (min) => { R.cfg.min = Math.max(0, Math.min(240, +min || 0)); gravar(R.cfg); if (R.tocando) { if (temporizador) clearTimeout(temporizador); R.fim = null; if (R.cfg.min > 0) { R.fim = Date.now() + R.cfg.min * 60000; temporizador = setTimeout(() => R.parar(), R.cfg.min * 60000); } avisa(); } };
  R.junto = (v) => { R.cfg.junto = !!v; gravar(R.cfg); };
  // liga junto com o Dora Foco: observa o cronômetro guardado pelo Foco (fase "foco" em andamento)
  setInterval(() => { if (!R.cfg.junto) return; let cron = null; try { cron = JSON.parse(localStorage.getItem('doraDraw.cron') || 'null'); } catch (e) { /* sem cronômetro */ } const focando = !!(cron && cron.fase === 'foco');
    if (focando && !R.tocando && R.origem !== 'parou-manual') R.ligar(R.cfg.tipo, 'foco').catch(() => { /* o navegador pede um toque antes de tocar som */ });
    if (!focando && R.tocando && R.origem === 'foco') R.parar(); if (!focando && R.origem === 'parou-manual') R.origem = null; }, 1000);
  raiz.DoraRadio = R;
})(typeof self !== 'undefined' ? self : this);
