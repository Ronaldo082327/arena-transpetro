/* Dora Draw — lógica pura da quinta leva (obra original; só ideias gerais de estatística, código 100% próprio).
   Serve às telas de v-quinta.js e é testada em testes\gemeo.test.js, testes\agentes.test.js e testes\transformar.test.js.
   Roda no app, no painel da extensão e no Node.

   AVISO DE HONESTIDADE: tudo aqui são ESTIMATIVAS feitas só com os dados do próprio aluno (respostas, domínio declarado,
   datas de estudo) e com palpites razoáveis dos metadados. Nada aqui "prevê a prova". Toda função devolve o tamanho da
   amostra (n) e uma faixa de incerteza, e marca "dados insuficientes" quando há pouco dado.

   1. Gêmeo digital: probabilidade de acerto por tópico (Beta-Binomial + esquecimento do FSRS), nota por disciplina e total
      (Monte Carlo com semente), ranking de ganho de pontos por hora, chance de passar da meta, pontos do girassol.
   2. Agentes sintéticos: TRI simples (3PL), perfis de candidatos, dificuldade estimada, discriminação, alerta de pegadinha,
      consolidação das respostas dos agentes de IA.
   3. Transformar marcações: resumo, Dora Cartas e mapa mental a partir de grifos, anotações e marcações.
   Datas: 'AAAA-MM-DD' no fuso local. */
(function (raiz, fab) {
  const ehNode = typeof module === 'object' && module.exports;
  const L = ehNode ? require('./logica.js') : raiz.DoraLogica; const L3 = ehNode ? require('./logica3.js') : raiz.DoraLogica3;
  const L5 = fab(L, L3); if (ehNode) module.exports = L5; else raiz.DoraLogica5 = L5;
})(typeof self !== 'undefined' ? self : this, function (L, L3) {
  const { diasEntre } = L;
  const limita = (v, a, b) => Math.min(b, Math.max(a, v));
  const arred = (v, c = 2) => { const k = Math.pow(10, c); return Math.round(v * k) / k; };
  const semAcento = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const corta = (s, n) => { s = String(s || '').replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…' : s; };

  // =====================================================================
  // 0. Números aleatórios com semente (mesmo resultado sempre) e distribuição Beta
  // =====================================================================
  function rng(semente) { let a = (semente >>> 0) || 1; return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function hashTexto(s) { let h = 2166136261; const t = String(s); for (let i = 0; i < t.length; i++) { h ^= t.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function normalPadrao(r) { let u = 0; while (u === 0) u = r(); const v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
  function gama(r, k) { // Marsaglia-Tsang
    if (k < 1) return gama(r, k + 1) * Math.pow(r() || 1e-12, 1 / k);
    const d = k - 1 / 3, c = 1 / Math.sqrt(9 * d);
    for (;;) { let x, v; do { x = normalPadrao(r); v = 1 + c * x; } while (v <= 0); v = v * v * v; const u = r(); if (u < 1 - 0.0331 * x * x * x * x) return d * v; if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) return d * v; }
  }
  function sorteioBeta(r, a, b) { const x = gama(r, a), y = gama(r, b); return x / (x + y); }
  function lgama(x) { const c = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5]; let y = x, t = x + 5.5; t -= (x + 0.5) * Math.log(t); let s = 1.000000000190015; for (let j = 0; j < 6; j++) s += c[j] / ++y; return -t + Math.log(2.5066282746310005 * s / x); }
  function fracaoContinua(a, b, x) {
    const FP = 1e-300; const qab = a + b, qap = a + 1, qam = a - 1; let c = 1, d = 1 - qab * x / qap; if (Math.abs(d) < FP) d = FP; d = 1 / d; let h = d;
    for (let m = 1; m <= 200; m++) { const m2 = 2 * m; let aa = m * (b - m) * x / ((qam + m2) * (a + m2)); d = 1 + aa * d; if (Math.abs(d) < FP) d = FP; c = 1 + aa / c; if (Math.abs(c) < FP) c = FP; d = 1 / d; h *= d * c;
      aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2)); d = 1 + aa * d; if (Math.abs(d) < FP) d = FP; c = 1 + aa / c; if (Math.abs(c) < FP) c = FP; d = 1 / d; const del = d * c; h *= del; if (Math.abs(del - 1) < 3e-12) break; }
    return h;
  }
  // função de distribuição da Beta(a, b) em x
  function betaCdf(x, a, b) { if (x <= 0) return 0; if (x >= 1) return 1; const bt = Math.exp(lgama(a + b) - lgama(a) - lgama(b) + a * Math.log(x) + b * Math.log(1 - x)); return x < (a + 1) / (a + b + 2) ? bt * fracaoContinua(a, b, x) / a : 1 - bt * fracaoContinua(b, a, 1 - x) / b; }
  function betaQuantil(q, a, b) { let lo = 0, hi = 1; for (let i = 0; i < 50; i++) { const m = (lo + hi) / 2; if (betaCdf(m, a, b) < q) lo = m; else hi = m; } return (lo + hi) / 2; }
  const quantil = (ord, q) => { if (!ord.length) return 0; const i = (ord.length - 1) * q; const a = Math.floor(i), b = Math.ceil(i); return ord[a] + (ord[b] - ord[a]) * (i - a); };

  // =====================================================================
  // 1. Gêmeo digital
  // =====================================================================
  const CHUTE_PADRAO = 0.2; // chance de acertar no chute (5 alternativas)
  const DOM_ESTAB = [0.5, 1.4, 3.7, 9, 16, 30]; // estabilidade (dias até a lembrança cair a 90%) por domínio declarado 0..5; os três primeiros seguem os pesos iniciais do FSRS
  const TAXA_HORA = 0.25; // suposição: 1 hora num tópico de dificuldade média fecha 25% do que falta
  // estabilidade de um tópico: pelo domínio (0–100) e pela dificuldade (1–5); se há cartões no FSRS, mistura com a estabilidade deles
  function estabilidadeTopico(t, cartoes = []) {
    const d = t.dominio == null ? 1 : limita(t.dominio / 20, 0, 5); const i = Math.floor(d), f = d - i;
    let s = DOM_ESTAB[i] * (1 - f) + DOM_ESTAB[Math.min(5, i + 1)] * f; s *= limita(1.3 - 0.1 * (t.dificuldade || 3), 0.8, 1.2);
    const fs = cartoes.filter(c => c.fsrs && c.fsrs.s > 0); if (fs.length) { const m = fs.reduce((a, c) => a + c.fsrs.s, 0) / fs.length; const w = Math.min(1, fs.length / 6) * 0.6; s = s * (1 - w) + m * w; }
    return Math.max(0.3, s);
  }
  // crença inicial (antes de ver as respostas): o domínio que o aluno declarou, ou um palpite pela relevância e dificuldade
  function priorTopico(t) {
    if (t.dominio != null) return { p0: limita(t.dominio / 100, 0.03, 0.97), k0: 5, declarado: true };
    return { p0: limita(0.3 + 0.02 * ((t.relevancia || 3) - 3) - 0.03 * ((t.dificuldade || 3) - 3), 0.1, 0.5), k0: 2, declarado: false };
  }
  // modelo de UM tópico. respostas: as respostas do tópico ({qtd, acertos, correta, confianca, dia, ts}).
  // devolve p (chance de acertar uma questão do tópico HOJE), faixa de 80% (lo..hi), n (questões respondidas) e se os dados são insuficientes
  function modeloTopico(t, { respostas = [], cartoes = [], hoje, chute = CHUTE_PADRAO, intervalo = true } = {}) {
    const pr = priorTopico(t); let n = 0, ok = 0, ultResp = null;
    respostas.forEach(r => { const q = r.qtd || 1; const a = r.acertos != null ? r.acertos : (r.correta ? 1 : 0); n += q; ok += a - (r.confianca === 'chute' && r.qtd == null && a ? 0.5 : 0); const d = r.dia || (r.ts ? L.diaLocal(r.ts) : null); if (d && (!ultResp || d > ultResp)) ultResp = d; });
    const alfa = pr.p0 * pr.k0 + ok, beta = (1 - pr.p0) * pr.k0 + (n - ok); const pk = alfa / (alfa + beta);
    const ult = [t.ultEstudo, ultResp].filter(Boolean).sort().pop() || null; const dias = ult && hoje ? Math.max(0, diasEntre(ult, hoje)) : 0;
    const s = estabilidadeTopico(t, cartoes); const R = L3.fsrsLembranca(dias, s); const tr = (x) => chute + (x - chute) * R;
    const fonte = n >= 5 ? 'dados' : (n >= 1 || pr.declarado) ? 'parcial' : 'prior';
    const m = { topicoId: t.id, p: arred(tr(pk), 4), lo: null, hi: null, n: Math.round(n * 10) / 10, pk: arred(pk, 4), R: arred(R, 4), dias, s: arred(s, 2), alfa, beta, fonte, insuficiente: n < 5, declarado: pr.declarado, ult };
    if (intervalo) { m.lo = arred(tr(betaQuantil(0.1, alfa, beta)), 4); m.hi = arred(tr(betaQuantil(0.9, alfa, beta)), 4); }
    return m;
  }
  const folhasDe = (topicos) => topicos.filter(t => !topicos.some(o => o.paiId === t.id));
  const indicePor = (lista, campo) => { const m = {}; lista.forEach(x => { const k = x[campo]; if (k != null) (m[k] = m[k] || []).push(x); }); return m; };
  // modelos de todos os tópicos folha: { [topicoId]: modelo }
  function construirGemeo({ topicos, respostas = [], cartoes = [], hoje, chute = CHUTE_PADRAO, intervalo = true }) {
    const rs = indicePor(respostas, 'topicoId'), cs = indicePor(cartoes, 'topicoId'); const modelos = {};
    folhasDe(topicos).forEach(t => { modelos[t.id] = modeloTopico(t, { respostas: rs[t.id] || [], cartoes: cs[t.id] || [], hoje, chute, intervalo }); });
    return modelos;
  }
  // quantas questões cada disciplina vale: peso (nº de questões do quadro da prova); sem nenhum peso, proporcional à relevância (total 100)
  function questoesPorDisciplina(disciplinas, topicos) {
    const folhas = folhasDe(topicos); const comPeso = disciplinas.filter(d => d.peso != null && +d.peso >= 0); const out = {};
    if (comPeso.length) { const media = comPeso.reduce((a, d) => a + (+d.peso), 0) / comPeso.length; disciplinas.forEach(d => { out[d.id] = Math.round(d.peso != null ? +d.peso : media); }); return out; }
    const rel = disciplinas.map(d => folhas.filter(t => t.disciplinaId === d.id).reduce((a, t) => a + (t.relevancia || 3), 0)); const tot = rel.reduce((a, b) => a + b, 0) || 1;
    disciplinas.forEach((d, i) => { out[d.id] = Math.round(100 * rel[i] / tot); }); return out;
  }
  // reparte N questões entre os tópicos pela relevância (maior resto): devolve [{topico, n, esperadas}]
  function repartir(ts, N) {
    const tot = ts.reduce((a, t) => a + (t.relevancia || 3), 0) || 1; const bruto = ts.map(t => N * (t.relevancia || 3) / tot); const base = bruto.map(Math.floor); let falta = N - base.reduce((a, b) => a + b, 0);
    bruto.map((b, i) => [b - base[i], i]).sort((a, b) => b[0] - a[0]).forEach(([, i]) => { if (falta > 0) { base[i]++; falta--; } });
    return ts.map((t, i) => ({ topico: t, n: base[i], esperadas: bruto[i] }));
  }
  // simula a prova `rodadas` vezes (semente fixa = mesmo resultado). Em cada rodada, cada tópico sorteia a sua chance verdadeira da Beta
  // (a incerteza vale para todas as questões do tópico) e cada questão é um cara-ou-coroa com essa chance.
  function simularProva({ disciplinas, topicos, modelos, rodadas = 1500, semente = 2026, penalidade = 0, chute = CHUTE_PADRAO }) {
    const r = rng(semente); const folhas = folhasDe(topicos); const qd = questoesPorDisciplina(disciplinas, topicos);
    const plano = disciplinas.map(d => { const ts = folhas.filter(t => t.disciplinaId === d.id); const rep = ts.length ? repartir(ts, qd[d.id] || 0) : []; return { d, pontos: d.pontos == null ? 1 : +d.pontos, minimo: +d.minimo || 0, rep }; });
    const acD = plano.map(() => new Float64Array(rodadas)); const tot = new Float64Array(rodadas); const passouMin = new Uint8Array(rodadas);
    for (let k = 0; k < rodadas; k++) {
      let soma = 0, ok = 1;
      plano.forEach((pl, i) => {
        let ac = 0, er = 0;
        pl.rep.forEach(({ topico, n }) => { if (!n) return; const m = modelos[topico.id]; if (!m) return; const x = sorteioBeta(r, m.alfa, m.beta); const p = chute + (x - chute) * m.R; for (let j = 0; j < n; j++) { if (r() < p) ac++; else er++; } });
        const liq = Math.max(0, ac - penalidade * er); acD[i][k] = liq * pl.pontos; soma += liq * pl.pontos; if (pl.minimo && liq < pl.minimo) ok = 0;
      });
      tot[k] = soma; passouMin[k] = ok;
    }
    const resumo = (arr, max, extra) => { const o = Array.from(arr).sort((a, b) => a - b); const m = o.reduce((a, b) => a + b, 0) / (o.length || 1); return Object.assign({ media: arred(m, 2), lo: arred(quantil(o, 0.1), 2), hi: arred(quantil(o, 0.9), 2), max, pct: max ? arred(100 * m / max, 1) : 0 }, extra); };
    const porDisc = plano.map((pl, i) => { const ms = pl.rep.map(x => modelos[x.topico.id]).filter(Boolean); const n = ms.reduce((a, m) => a + m.n, 0); const suf = ms.filter(m => !m.insuficiente).length;
      return resumo(acD[i], (qd[pl.d.id] || 0) * pl.pontos, { id: pl.d.id, nome: pl.d.nome, questoes: qd[pl.d.id] || 0, pontos: pl.pontos, minimo: pl.minimo, n: Math.round(n), topicos: ms.length, topicosComDados: suf, insuficiente: ms.length > 0 && suf / ms.length < 0.3 }); });
    const max = plano.reduce((a, pl) => a + (qd[pl.d.id] || 0) * pl.pontos, 0); const nTot = Object.values(modelos).reduce((a, m) => a + m.n, 0); const comDados = Object.values(modelos).filter(m => !m.insuficiente).length; const nTop = Object.keys(modelos).length;
    const total = resumo(tot, max, { n: Math.round(nTot), topicos: nTop, topicosComDados: comDados, insuficiente: nTop === 0 || comDados / nTop < 0.25 });
    return { disciplinas: porDisc, total, rodadas, semente, totais: Float64Array.from(tot).sort(), totaisOrdem: tot, passouMin, penalidade };
  }
  // chance estimada de chegar à nota de corte (em pontos), respeitando os mínimos por disciplina do quadro da prova (se houver).
  // A faixa mostrada é só o erro do sorteio (Monte Carlo); a incerteza do modelo já está nas faixas da nota.
  function chanceDeMeta(sim, meta, { minimos = true } = {}) {
    const N = sim.rodadas; let ok = 0; for (let k = 0; k < N; k++) if (sim.totaisOrdem[k] >= meta && (!minimos || sim.passouMin[k])) ok++;
    const p = ok / N; const e = 1.96 * Math.sqrt(Math.max(p * (1 - p), 1e-4) / N); return { p: arred(p, 4), lo: arred(Math.max(0, p - e), 4), hi: arred(Math.min(1, p + e), 4), rodadas: N, meta };
  }
  // ranking "o que mais sobe a sua nota": ganho esperado de pontos por hora = questões esperadas × pontos × (1 − p) × facilidade × taxa
  function rankingGanho({ disciplinas, topicos, modelos }) {
    const folhas = folhasDe(topicos); const qd = questoesPorDisciplina(disciplinas, topicos); const out = [];
    disciplinas.forEach(d => {
      const ts = folhas.filter(t => t.disciplinaId === d.id); const tot = ts.reduce((a, t) => a + (t.relevancia || 3), 0) || 1; const pts = d.pontos == null ? 1 : +d.pontos;
      ts.forEach(t => { const m = modelos[t.id]; if (!m) return; const esperadas = (qd[d.id] || 0) * (t.relevancia || 3) / tot * pts; const falta = Math.max(0, 1 - m.p); const facil = limita((6 - (t.dificuldade || 3)) / 3, 0.4, 1.6);
        const ganho = Math.min(esperadas * falta, esperadas * falta * facil * TAXA_HORA); out.push({ topicoId: t.id, disciplinaId: d.id, esperadas: arred(esperadas, 3), p: m.p, falta: arred(falta, 3), facilidade: arred(facil, 2), ganhoHora: arred(ganho, 4), n: m.n, insuficiente: m.insuficiente, fonte: m.fonte }); });
    });
    return out.sort((a, b) => b.ganhoHora - a.ganhoHora);
  }
  // notas (0–100) para as prioridades e o ciclo: onde o gêmeo tem alguma informação (dados ou domínio declarado) usa 100 × p; no resto mantém a nota de antes
  function notasComGemeo(notasAntes, modelos) { const o = Object.assign({}, notasAntes); for (const id in modelos) { const m = modelos[id]; if (m.fonte !== 'prior') o[id] = Math.round(100 * m.p); } return o; }
  // posição de cada semente do girassol (ângulo de ouro). Devolve pontos em [-raio, raio]
  const ANGULO_OURO = Math.PI * (3 - Math.sqrt(5));
  function girassolPontos(n, raio = 100) { const out = []; for (let i = 0; i < n; i++) { const r = raio * Math.sqrt((i + 0.5) / Math.max(1, n)); const a = i * ANGULO_OURO; out.push({ x: arred(r * Math.cos(a), 2), y: arred(r * Math.sin(a), 2), r: arred(r, 2), ang: arred(a, 4) }); } return out; }
  // texto honesto sobre a confiança da estimativa
  function avisoDeDados(total) {
    if (!total || total.topicos === 0) return 'Ainda não há tópicos: monte o edital primeiro.';
    if (total.insuficiente) return 'Dados insuficientes: só ' + total.topicosComDados + ' de ' + total.topicos + ' tópicos têm 5 ou mais questões respondidas. A faixa é larga porque o modelo está usando palpites. Responda questões e registre o estudo para estreitar.';
    if (total.topicosComDados / total.topicos < 0.6) return 'Poucos dados: ' + total.topicosComDados + ' de ' + total.topicos + ' tópicos têm 5 ou mais questões respondidas. Leia a faixa, não só o número.';
    return 'Estimativa com ' + total.n + ' questões respondidas em ' + total.topicosComDados + ' de ' + total.topicos + ' tópicos. É uma estimativa, não uma previsão da prova.';
  }

  // =====================================================================
  // 2. Agentes sintéticos (TRI simples)
  // =====================================================================
  // tendências de erro = os 4 tipos do app: conteudo, reconhecer, execucao, leitura
  const PERFIS = [
    { id: 'iniciante', nome: 'Iniciante', theta: -1.3, chuteExtra: 0, tendencias: { conteudo: 0.55, reconhecer: 0.2, execucao: 0.1, leitura: 0.15 }, desc: 'Conhece pouco da matéria; a maior parte dos erros é falta de conteúdo.',
      persona: 'Você é um candidato iniciante: estudou pouco, conhece só o básico da matéria e às vezes não sabe do que a questão trata. Responda como ele responderia, sem fingir que sabe o que não sabe.' },
    { id: 'mediano', nome: 'Mediano', theta: 0, chuteExtra: 0, tendencias: { conteudo: 0.3, reconhecer: 0.25, execucao: 0.2, leitura: 0.25 }, desc: 'Domina o essencial; erra por um pouco de tudo.',
      persona: 'Você é um candidato mediano: estudou o essencial, sabe as regras gerais mas esquece exceções e detalhes. Responda como ele responderia.' },
    { id: 'avancado', nome: 'Avançado', theta: 1.4, chuteExtra: 0, tendencias: { conteudo: 0.1, reconhecer: 0.2, execucao: 0.35, leitura: 0.35 }, desc: 'Sabe quase tudo; erra por descuido de conta ou de leitura.',
      persona: 'Você é um candidato avançado: domina a matéria, mas é humano e pode errar por descuido de leitura ou de conta. Responda como ele responderia.' },
    { id: 'chutador', nome: 'Chutador', theta: -0.6, chuteExtra: 0.3, tendencias: { conteudo: 0.4, reconhecer: 0.3, execucao: 0.1, leitura: 0.2 }, desc: 'Em parte das questões marca sem pensar.',
      persona: 'Você é um candidato que chuta: em dúvida, marca a alternativa que "parece" certa pelo som ou pelo tamanho, sem fazer a análise completa. Responda como ele responderia.' },
    { id: 'apressado', nome: 'Leitor apressado', theta: 0.5, chuteExtra: 0, tendencias: { conteudo: 0.1, reconhecer: 0.15, execucao: 0.15, leitura: 0.6 }, desc: 'Sabe razoavelmente, mas lê rápido demais e cai em "exceto", "incorreta" e palavras de absoluto.',
      persona: 'Você é um candidato apressado: sabe razoavelmente a matéria, mas lê o enunciado rápido demais, passa por cima de "exceto", "incorreta", "somente", "sempre" e marca a primeira alternativa que parece certa. Responda como ele responderia.' }
  ];
  const sigmoide = (x) => 1 / (1 + Math.exp(-x));
  const logit = (p) => Math.log(p / (1 - p));
  // modelo de 3 parâmetros: chance de acertar com habilidade th, discriminação a, dificuldade b e chute c
  const p3pl = (th, a, b, c) => c + (1 - c) * sigmoide(a * (th - b));
  const letrasDe = (q) => (q.alternativas && q.alternativas.length ? q.alternativas.map(a => a.letra) : ['C', 'E']);
  const chuteDe = (q) => 1 / Math.max(2, letrasDe(q).length);
  // habilidade do perfil numa disciplina: nível-base + pequeno desvio fixo (mesmo sempre) por disciplina
  function habilidadePerfil(perfil, discNome, thetaVoce = null) {
    if (perfil.id === 'voce') return thetaVoce == null ? 0 : thetaVoce;
    const h = hashTexto(perfil.id + '|' + discNome); return perfil.theta + ((h % 801) / 1000 - 0.4);
  }
  // da chance de acertar (0–1) para a habilidade na escala do modelo (b = 0, a = 1)
  const thetaDeP = (p, c = CHUTE_PADRAO) => limita(logit(limita((p - c) / (1 - c), 0.02, 0.98)), -3, 3);
  // sinais do enunciado que ativam as tendências de erro
  function gatilhos(q) {
    const txt = (q.enunciado || '') + ' ' + (q.alternativas || []).map(a => a.texto).join(' ');
    return { leitura: /\b(exceto|incorret[ao]s?|falsa?s?|errad[ao]s?|nenhum[a]?|somente|apenas|sempre|nunca|todos|todas)\b/i.test(txt) ? 1 : 0, execucao: ((txt.match(/\d/g) || []).length >= 6 || /%|R\$|calcul|quanto/i.test(txt)) ? 1 : 0, reconhecer: q.pegadinha ? 1 : 0 };
  }
  // dificuldade que o enunciado/metadados sugerem (antes de olhar as respostas do aluno): -1 fácil, 0 média, 1 difícil; pegadinha soma 0,3
  function priorDificuldade(q) {
    let d = q.dificuldade; let b = 0;
    if (typeof d === 'number') b = d <= 2 ? -1 : d >= 4 ? 1 : 0; else if (typeof d === 'string' && d) { const s = semAcento(d); b = /facil/.test(s) ? -1 : /dificil/.test(s) ? 1 : 0; }
    return b + (q.pegadinha ? 0.3 : 0);
  }
  // dificuldade b estimada: a priori pelos metadados + as respostas do aluno (máximo a posteriori numa grade). Devolve b, incerteza (dp) e n
  function estimarDificuldade(q, respostas, thetaAluno, a = 1) {
    const c = chuteDe(q); const b0 = priorDificuldade(q); const g = []; for (let x = -3; x <= 3.0001; x += 0.1) g.push(arred(x, 1));
    const lp = g.map(b => { let v = -((b - b0) * (b - b0)) / 2; respostas.forEach(r => { const w = r.confianca === 'chute' ? 0.5 : 1; const P = limita(p3pl(thetaAluno, a, b, c), 1e-4, 1 - 1e-4); v += w * (r.correta ? Math.log(P) : Math.log(1 - P)); }); return v; });
    const mx = Math.max(...lp); const pr = lp.map(v => Math.exp(v - mx)); const z = pr.reduce((s, x) => s + x, 0); const media = g.reduce((s, b, i) => s + b * pr[i] / z, 0); const dp = Math.sqrt(g.reduce((s, b, i) => s + (b - media) * (b - media) * pr[i] / z, 0));
    const mapa = g[lp.indexOf(mx)];
    return { b: arred(mapa, 2), bPrior: b0, dp: arred(dp, 2), n: respostas.length };
  }
  const NIVEL_PEGADINHA = (s) => s >= 0.6 ? 'provavel' : s >= 0.3 ? 'possivel' : 'nenhum';
  // análise completa de UMA questão: dificuldade, discriminação, taxa de acerto por perfil, alternativa que atrai e alerta de pegadinha.
  // ctx: { respostas (do aluno nesta questão), thetaAluno, discNome, thetaVoce, perfis, agentesIA (consolidado) }
  function analisarQuestao(q, ctx = {}) {
    const letras = letrasDe(q); const gab = q.gabarito || null; if (!gab || !letras.includes(gab)) return { id: q.id, semGabarito: true };
    const rs = (ctx.respostas || []).filter(r => r.refTipo ? r.refTipo === 'questao' : true); const th = ctx.thetaAluno == null ? 0 : ctx.thetaAluno; const c = chuteDe(q);
    const a = q.pegadinha ? 0.8 : 1; const est = estimarDificuldade(q, rs, th, a); const g = gatilhos(q);
    const perfis = (ctx.perfis || PERFIS).map(pf => {
      const w = pf.tendencias || {}; const mult = limita(1 - 0.85 * ((w.leitura || 0) * g.leitura + (w.execucao || 0) * g.execucao + (w.reconhecer || 0) * g.reconhecer), 0.2, 1);
      const hab = habilidadePerfil(pf, ctx.discNome || '', ctx.thetaVoce); let P = c + (p3pl(hab, a, est.b, c) - c) * mult; if (pf.chuteExtra) P = (1 - pf.chuteExtra) * P + pf.chuteExtra * c;
      return { id: pf.id, nome: pf.nome, p: arred(limita(P, 0, 1), 3), theta: arred(hab, 2) };
    });
    // alternativa que atrai: pesos das erradas = 1 + 2 por cada vez que o aluno caiu nela (+1 se estava com certeza) + 2 por agente de IA que caiu
    const peso = {}; letras.filter(l => l !== gab).forEach(l => { peso[l] = 1; });
    rs.filter(r => !r.correta && r.escolha && peso[r.escolha] != null).forEach(r => { peso[r.escolha] += 2 + (r.confianca === 'certeza' ? 1 : 0); });
    const ia = ctx.agentesIA; if (ia && ia.porLetra) for (const l in ia.porLetra) if (peso[l] != null) peso[l] += 2 * ia.porLetra[l];
    const somaPeso = Object.values(peso).reduce((s, x) => s + x, 0) || 1; const top = Object.keys(peso).sort((x, y) => peso[y] - peso[x])[0]; const share = top ? peso[top] / somaPeso : 0;
    perfis.forEach(pf => { pf.escolhas = {}; pf.escolhas[gab] = pf.p; for (const l in peso) pf.escolhas[l] = arred((1 - pf.p) * peso[l] / somaPeso, 3); });
    const atrator = top && share >= 0.4 && Object.values(peso).some(x => x > 1) ? { letra: top, parte: arred(share, 2) } : null;
    const av = perfis.find(p => p.id === 'avancado'), ini = perfis.find(p => p.id === 'iniciante');
    const discriminacao = av && ini ? arred(av.p - ini.p, 2) : null;
    // alerta de pegadinha: soma de sinais, cada um explicado
    const motivos = []; let s = 0;
    const certezaErrada = rs.filter(r => !r.correta && r.confianca === 'certeza').length; if (certezaErrada) { s += 0.35; motivos.push('você errou ' + (certezaErrada === 1 ? 'uma vez' : certezaErrada + ' vezes') + ' marcando "tenho certeza"'); }
    if (q.pegadinha) { s += 0.25; motivos.push('a questão tem pegadinha anotada: ' + corta(q.pegadinha, 80)); }
    if (atrator && rs.some(r => !r.correta) || (atrator && ia && ia.erraram)) { s += 0.2; motivos.push('a alternativa ' + atrator.letra + ' atrai ' + Math.round(100 * atrator.parte) + '% dos erros estimados'); }
    const pAvPrior = p3pl(habilidadePerfil(PERFIS[2], ctx.discNome || ''), a, est.bPrior, c), pAvCal = p3pl(habilidadePerfil(PERFIS[2], ctx.discNome || ''), a, est.b, c);
    if (est.n >= 1 && pAvPrior - pAvCal >= 0.15) { s += 0.3; motivos.push('quem domina o assunto erraria mais do que o esperado (o seu histórico puxou a dificuldade para cima)'); }
    if (rs.length >= 3) { const obs = rs.filter(r => r.correta).length / rs.length; const esp = p3pl(th, a, est.bPrior, c); const dp = Math.sqrt(esp * (1 - esp) / rs.length) || 0.2; if ((esp - obs) / dp >= 1.5) { s += 0.2; motivos.push('você acerta bem menos do que o esperado para o seu nível (' + Math.round(100 * obs) + '% contra ' + Math.round(100 * esp) + '%)'); } }
    if (ia && ia.nivel === 'pegadinha') { s += 0.4; motivos.push('agentes de IA caíram: ' + ia.texto); } else if (ia && ia.nivel === 'atencao') { s += 0.15; motivos.push('um agente de IA errou esta questão'); }
    s = limita(s, 0, 1);
    return { id: q.id, gabarito: gab, b: est.b, bPrior: est.bPrior, dp: est.dp, n: est.n, a, c: arred(c, 2), perfis, discriminacao, atrator, dificuldadeRotulo: est.b <= -0.6 ? 'fácil' : est.b >= 0.6 ? 'difícil' : 'média', pegadinha: { score: arred(s, 2), nivel: NIVEL_PEGADINHA(s), motivos }, insuficiente: est.n < 2 };
  }
  // resumo de uma lista de análises
  function resumoAgentes(analises) {
    const ok = analises.filter(a => !a.semGabarito); const prov = ok.filter(a => a.pegadinha.nivel === 'provavel'), poss = ok.filter(a => a.pegadinha.nivel === 'possivel');
    const med = (f) => ok.length ? arred(ok.reduce((s, a) => s + f(a), 0) / ok.length, 3) : null; const porPerfil = {}; PERFIS.concat([{ id: 'voce', nome: 'Você (gêmeo)' }]).forEach(pf => { const v = ok.map(a => (a.perfis.find(p => p.id === pf.id) || {}).p).filter(x => x != null); if (v.length) porPerfil[pf.id] = { nome: pf.nome, taxa: arred(v.reduce((s, x) => s + x, 0) / v.length, 3) }; });
    return { total: analises.length, analisadas: ok.length, semGabarito: analises.length - ok.length, provaveis: prov.length, possiveis: poss.length, discriminacaoMedia: med(a => a.discriminacao || 0), porPerfil, comDadosDoAluno: ok.filter(a => a.n >= 1).length };
  }

  // ---- agentes de IA: o que perguntar, como ler e como consolidar ----
  function promptAgente(persona, q) {
    const sem = (q.enunciado || '') + '\n' + (q.alternativas || []).map(a => a.letra + ') ' + a.texto).join('\n');
    return { sistema: persona + ' Responda SOMENTE em JSON, em português do Brasil.', prompt: 'Resolva a questão abaixo SEM ajuda e responda em JSON: {"resposta":"letra","motivo":"uma frase curta (até 25 palavras) dizendo por que marcou essa","confianca":"alta, media ou baixa"}.\n\n' + sem };
  }
  function lerRespostaAgente(dados, letrasValidas) {
    const d = Array.isArray(dados) ? dados[0] : dados; if (!d || typeof d !== 'object') return null; const letra = String(d.resposta || d.gabarito || d.letra || '').trim().toUpperCase().slice(0, 1); if (!letra || (letrasValidas && !letrasValidas.includes(letra))) return null;
    return { letra, motivo: corta(d.motivo || d.justificativa || '', 220), confianca: ['alta', 'media', 'baixa'].includes(semAcento(d.confianca)) ? semAcento(d.confianca) : null };
  }
  // rodadas: [{persona (id), nome, letra, motivo}] → quem errou, em qual letra, e se parece pegadinha
  function consolidarIA(q, rodadas) {
    const gab = q.gabarito; const validas = (rodadas || []).filter(r => r && r.letra); const erraram = validas.filter(r => gab && r.letra !== gab); const porLetra = {}; erraram.forEach(r => { porLetra[r.letra] = (porLetra[r.letra] || 0) + 1; });
    const letraTop = Object.keys(porLetra).sort((a, b) => porLetra[b] - porLetra[a])[0] || null; const n = validas.length;
    const forteErrou = erraram.some(r => r.persona === 'avancado');
    let nivel = 'ok'; if (n && erraram.length) { if (forteErrou || (erraram.length >= 2 && erraram.length / n >= 0.5 && letraTop && porLetra[letraTop] >= 2)) nivel = 'pegadinha'; else nivel = 'atencao'; }
    let texto = '';
    if (!n) texto = 'Nenhum agente respondeu.'; else if (!erraram.length) texto = 'Os ' + n + ' agentes acertaram.'; else texto = letraTop && porLetra[letraTop] > 1 ? porLetra[letraTop] + ' de ' + n + ' agentes caíram na alternativa ' + letraTop : erraram.length + ' de ' + n + ' agentes erraram' + (letraTop ? ' (alternativa ' + letraTop + ')' : '');
    if (forteErrou && n) texto += '; até o agente avançado errou';
    return { total: n, erraram: erraram.length, porLetra, atrator: letraTop, nivel, texto, rodadas: validas.map(r => ({ persona: r.persona, nome: r.nome, letra: r.letra, motivo: r.motivo || '', correta: !gab || r.letra === gab })) };
  }
  function promptExplicarPegadinha(q, consolidado) {
    const just = (consolidado.rodadas || []).filter(r => !r.correta).map(r => '- ' + r.nome + ' marcou ' + r.letra + ': ' + r.motivo).join('\n');
    return 'Questão de concurso:\n' + (q.enunciado || '') + '\n' + (q.alternativas || []).map(a => a.letra + ') ' + a.texto).join('\n') + '\nGabarito: ' + q.gabarito + '\n\nCandidatos simulados que erraram:\n' + just + '\n\nExplique em até 3 frases curtas, em português simples, por que essa questão engana (qual é a pegadinha) e como não cair. Responda em JSON: {"pegadinha":"..."}.';
  }

  // =====================================================================
  // 3. Transformar marcações em estudo
  // =====================================================================
  const SIGNIFICADOS = ['Regra', 'Exceção', 'Prazo', 'Conceito', 'Pegadinha', 'Revisar'];
  const HEX_COR = { '#fff176': 0, '#a5d6a7': 1, '#90caf9': 2, '#f8bbd0': 3, '#ffcc80': 4, '#d1c4e9': 5 };
  const IDS_COR = ['amarelo', 'verde', 'azul', 'rosa', 'laranja', 'lilas'];
  const nomeSig = (sig, i) => (sig && sig[i]) || SIGNIFICADOS[i] || 'Cor ' + (i + 1);
  function marcasDeGrifos(grifos, materiais = []) {
    const nome = {}; materiais.forEach(m => { nome[m.id] = m.nome; });
    return (grifos || []).filter(g => g && String(g.texto || '').trim()).map(g => ({ id: g.id, texto: String(g.texto).replace(/\s+/g, ' ').trim(), nota: String(g.nota || '').trim(), cor: HEX_COR[String(g.cor || '').toLowerCase()] != null ? HEX_COR[String(g.cor).toLowerCase()] : 0, pagina: g.pagina || null, fonte: nome[g.materialId] || '', materialId: g.materialId || null, topicoId: g.topicoId || null, favorito: false, tags: [], criado: g.criado || 0 }));
  }
  function marcasDeMarcacoes(lista) {
    return (lista || []).filter(m => m && !m.oculto && String(m.texto || '').trim()).map(m => ({ id: m.id, texto: String(m.texto).replace(/\s+/g, ' ').trim(), nota: String(m.nota || '').trim(), cor: Math.max(0, IDS_COR.indexOf(m.cor)), pagina: null, fonte: m.titulo || m.url || '', materialId: null, topicoId: m.topicoId || null, favorito: !!m.favorito, tags: m.tags || [], criado: m.criado || 0 }));
  }
  // marcas sem tópico vão para `padrao`; devolve [{topicoId, marcas}] na ordem em que aparecem
  function agruparPorTopico(marcas, padrao = null) { const ordem = []; const m = {}; marcas.forEach(x => { const k = x.topicoId || padrao || ''; if (!m[k]) { m[k] = { topicoId: k || null, marcas: [] }; ordem.push(k); } m[k].marcas.push(x); }); return ordem.map(k => m[k]); }
  const ordenaMarcas = (a, b) => ((a.materialId || '') < (b.materialId || '') ? -1 : (a.materialId || '') > (b.materialId || '') ? 1 : 0) || (a.pagina || 0) - (b.pagina || 0) || (a.criado || 0) - (b.criado || 0);
  // grupos para resumo e mapa: por significado (cor) ou por página
  function agruparMarcas(marcas, { organizar = 'cor', significados = SIGNIFICADOS } = {}) {
    const ms = marcas.slice().sort(ordenaMarcas);
    if (organizar === 'pagina') { const g = {}; ms.forEach(m => { const k = m.pagina != null ? m.pagina : 0; (g[k] = g[k] || []).push(m); }); return Object.keys(g).map(Number).sort((a, b) => a - b).map(k => ({ chave: 'p' + k, nome: k ? 'Página ' + k : 'Sem página', marcas: g[k] })); }
    const g = {}; ms.forEach(m => { (g[m.cor] = g[m.cor] || []).push(m); }); return Object.keys(g).map(Number).sort((a, b) => a - b).map(k => ({ chave: 'c' + k, nome: nomeSig(significados, k), cor: k, marcas: g[k] }));
  }
  const rotuloMarca = (m, comPagina) => (comPagina && m.pagina ? ' (p. ' + m.pagina + ')' : '');
  // resumo organizado em HTML para o editor de notas (só tags que o editor aceita)
  function resumoDeMarcas({ marcas, titulo = 'Marcações', significados = SIGNIFICADOS, organizar = 'cor', data = '' }) {
    const grupos = agruparMarcas(marcas, { organizar, significados }); const secoes = grupos.map(g => ({ titulo: g.nome, itens: g.marcas.map(m => ({ texto: m.texto, nota: m.nota, pagina: m.pagina, fonte: m.fonte })) }));
    return { html: htmlDoResumo(titulo, secoes, { organizar, data, total: marcas.length }), secoes, total: marcas.length };
  }
  function htmlDoResumo(titulo, secoes, { organizar = 'cor', data = '', total = null } = {}) {
    const n = total != null ? total : secoes.reduce((a, s) => a + s.itens.length, 0);
    let html = '<h3>Resumo das marcações: ' + esc(titulo) + '</h3><p>' + n + (n === 1 ? ' marcação' : ' marcações') + (data ? ' (gerado em ' + esc(data.split('-').reverse().join('/')) + ')' : '') + '. Edite à vontade.</p>';
    secoes.forEach(s => { if (!s.itens.length) return; html += '<h4>' + esc(s.titulo) + ' (' + s.itens.length + ')</h4><ul>'; s.itens.forEach(i => { const t = typeof i === 'string' ? i : i.texto; const nota = typeof i === 'string' ? '' : i.nota; const pg = typeof i === 'string' ? '' : (organizar === 'cor' && i.pagina ? ' (p. ' + i.pagina + ')' : ''); html += '<li><mark>' + esc(t) + '</mark>' + (nota ? ' — ' + esc(nota) : '') + esc(pg) + '</li>'; }); html += '</ul>'; });
    return html;
  }
  const PARADAS = new Set(['para', 'como', 'sobre', 'entre', 'quando', 'onde', 'qual', 'quais', 'cujo', 'cuja', 'ainda', 'assim', 'porém', 'porem', 'todos', 'todas', 'sendo', 'pelo', 'pela', 'pelos', 'pelas', 'esse', 'essa', 'esses', 'essas', 'este', 'esta', 'estes', 'estas', 'seus', 'suas', 'deve', 'devem', 'pode', 'podem', 'será', 'serão', 'mesmo', 'mesma', 'apenas', 'somente', 'também', 'tambem', 'caso', 'nos', 'nas', 'que', 'uma', 'uns', 'umas', 'dos', 'das', 'com', 'sem', 'não', 'nao', 'mais', 'menos', 'muito', 'desde', 'após', 'apos', 'perante', 'segundo', 'conforme', 'mediante', 'seja', 'forem', 'houver', 'quando']);
  // palavra-chave de um trecho grifado (a que vira lacuna): prazo/número com unidade, artigo, sigla, ou a palavra mais longa que não seja comum
  function palavraChave(texto) {
    const t = String(texto || ''); let m = t.match(/\b\d+[\d.,]*\s*(?:dias?|meses|m[êe]s|anos?|horas?|semanas?|%|por cento|vezes|salários|salarios)\b/i); if (m) return m[0];
    m = t.match(/\b(?:art\.?|artigos?)\s*\d+[ºo°]?(?:-[A-Z])?/i); if (m) return m[0];
    m = t.match(/\b[A-ZÁÂÃÉÊÍÓÔÕÚÇ]{2,6}\b/); if (m && !/^(O|A|OS|AS)$/.test(m[0])) return m[0];
    const pal = t.match(/[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ-]{4,}/g) || []; const boas = pal.filter(p => !PARADAS.has(semAcento(p)) && !PARADAS.has(p.toLowerCase())); if (!boas.length) return null;
    const sem1 = boas.filter(p => t.indexOf(p) > 0); const base = sem1.length ? sem1 : boas; return base.slice().sort((a, b) => b.length - a.length)[0];
  }
  // Dora Cartas a partir das marcas: uma de lacuna (palavra-chave escondida) e, se há anotação, uma básica (anotação → trecho)
  function cartasDeMarcas({ marcas, significados = SIGNIFICADOS, existentes = [], max = 80 }) {
    const vistos = new Set(existentes.map(x => L3.chaveCartao(x))); const out = [];
    const adiciona = (c) => { const k = L3.chaveCartao(c.frente); if (!k || vistos.has(k) || out.length >= max) return; vistos.add(k); out.push(c); };
    for (const m of marcas.slice().sort(ordenaMarcas)) {
      if (out.length >= max) break; const texto = m.texto.length > 300 ? corta(m.texto, 300) : m.texto; if (texto.length < 12) continue; const sig = nomeSig(significados, m.cor);
      const tags = [semAcento(sig).replace(/[^a-z0-9]+/g, '-')].concat(m.tags || []);
      const kw = palavraChave(texto);
      if (kw) { const i = texto.indexOf(kw); const marcado = texto.slice(0, i) + '{{c1::' + kw + '}}' + texto.slice(i + kw.length); const lac = L3.lacunasCartoes(marcado)[0]; if (lac) adiciona({ tipo: 'lacuna', frente: lac.frente, verso: lac.verso, lacuna: 1, tags, origem: 'marcacao', marcaId: m.id, significado: sig, pagina: m.pagina, fonte: m.fonte }); }
      if (m.nota && m.nota.length >= 6) adiciona({ tipo: 'basica', frente: m.nota.replace(/[.:;]+$/, '') + (/[?]$/.test(m.nota) ? '' : '?'), verso: texto, lacuna: null, tags, origem: 'marcacao', marcaId: m.id, significado: sig, pagina: m.pagina, fonte: m.fonte });
    }
    return out;
  }
  // mapa mental (formato do editor): raiz no centro, um ramo por grupo, uma folha por item. grupos: [{nome, folhas:[texto], cor?}]
  function mapaDeGrupos(titulo, grupos, { prefixo = 'mk', maxFolhas = 80 } = {}) {
    const nos = [{ id: prefixo + 'r', pai: null, t: corta(titulo, 90), x: 0, y: 0, cor: 0 }]; let y = 0; const pos = []; let usadas = 0; let seq = 0;
    grupos.forEach((g, gi) => {
      const folhas = (g.folhas || []).slice(0, Math.max(0, maxFolhas - usadas)); const resto = (g.folhas || []).length - folhas.length; usadas += folhas.length; const cor = g.cor != null ? g.cor % 6 : gi % 6; const bid = prefixo + 'b' + (gi + 1); const ys = [];
      const itens = folhas.slice(); if (resto > 0) itens.push('+ ' + resto + ' marcações (veja o resumo)');
      itens.forEach(tx => { nos.push({ id: prefixo + 'f' + (++seq), pai: bid, t: corta(tx, 90), x: 480, y, cor }); ys.push(y); y += 70; });
      const by = ys.length ? (ys[0] + ys[ys.length - 1]) / 2 : y; if (!ys.length) y += 70; nos.splice(1 + gi, 0, { id: bid, pai: prefixo + 'r', t: corta(g.nome, 60), x: 240, y: by, cor }); pos.push(by);
    });
    const centro = pos.length ? (pos[0] + pos[pos.length - 1]) / 2 : 0; nos.forEach(n => { if (n.pai != null) n.y = arred(n.y - centro, 1); });
    return { nos, z: 1, px: 0, py: 0 };
  }
  function mapaDeMarcas({ marcas, titulo = 'Marcações', significados = SIGNIFICADOS, organizar = 'cor', prefixo = 'mk', maxFolhas = 80 }) {
    const grupos = agruparMarcas(marcas, { organizar, significados }).map(g => ({ nome: g.nome, cor: g.cor, folhas: g.marcas.map(m => (organizar === 'cor' && m.pagina ? 'p.' + m.pagina + ' ' : '') + m.texto) }));
    return mapaDeGrupos(titulo, grupos, { prefixo, maxFolhas });
  }
  // junta o mapa novo ao que o tópico já tem: sem mapa (ou só raiz) o novo vira o mapa; com mapa, a raiz nova pendura-se na raiz antiga, abaixo do que já existe
  function mesclarMapa(existente, novo) {
    if (!existente || !existente.nos || existente.nos.length <= 1) { return JSON.parse(JSON.stringify(novo)); }
    const base = JSON.parse(JSON.stringify(existente)); const ids = new Set(base.nos.map(n => n.id)); const raizAntiga = base.nos.find(n => n.pai == null); const maxY = Math.max(...base.nos.map(n => n.y)); const novos = JSON.parse(JSON.stringify(novo.nos)); const troca = {};
    novos.forEach(n => { let id = n.id; while (ids.has(id)) id = id + 'x'; ids.add(id); troca[n.id] = id; });
    novos.forEach(n => { n.id = troca[n.id]; if (n.pai != null) n.pai = troca[n.pai]; });
    const rn = novos.find(n => n.pai == null); const minY = Math.min(...novos.map(n => n.y)); const dy = maxY + 90 - minY; rn.pai = raizAntiga.id; novos.forEach(n => { n.x = n.x + 230; n.y = arred(n.y + dy, 1); }); rn.x = 230; rn.cor = (rn.cor + 1) % 6;
    base.nos.push(...novos); return base;
  }
  // IA: refinar. O texto das marcas vai agrupado por significado; a IA devolve resumo, perguntas e ramos do mapa
  function promptMelhorar({ marcas, titulo, significados = SIGNIFICADOS, max = 70 }) {
    const grupos = agruparMarcas(marcas.slice(0, max), { organizar: 'cor', significados }); const lista = grupos.map(g => '## ' + g.nome + '\n' + g.marcas.map(m => '- ' + corta(m.texto, 260) + (m.nota ? ' [nota do aluno: ' + corta(m.nota, 120) + ']' : '')).join('\n')).join('\n\n');
    return 'Você ajuda um aluno de concurso a estudar a partir do que ele grifou em "' + titulo + '". Use SOMENTE o que está nos trechos abaixo; não invente regras, números ou artigos. Responda em JSON: {"resumo":[{"titulo":"nome da seção","itens":["frase curta e clara"]}],"perguntas":[{"frente":"pergunta objetiva","verso":"resposta curta"}],"mapa":[{"ramo":"tema","folhas":["ideia curta"]}]}. Faça de 3 a 6 seções, de 6 a 12 perguntas boas (que cobram o ponto central, como uma banca faria) e de 3 a 6 ramos com até 6 folhas cada.\n\nTRECHOS GRIFADOS:\n' + lista;
  }
  function lerMelhoria(d) {
    if (!d || typeof d !== 'object') return null; const txt = (x, n) => corta(typeof x === 'string' ? x : (x && (x.texto || x.t)) || '', n); const arr = (x) => Array.isArray(x) ? x : [];
    const secoes = arr(d.resumo).map(s => ({ titulo: txt(s.titulo || s.nome || 'Resumo', 80), itens: arr(s.itens).map(i => txt(i, 400)).filter(Boolean).slice(0, 20) })).filter(s => s.itens.length).slice(0, 10);
    const perguntas = arr(d.perguntas).map(p => ({ frente: txt(p.frente || p.pergunta, 300), verso: txt(p.verso || p.resposta, 500) })).filter(p => p.frente && p.verso).slice(0, 20);
    const ramos = arr(d.mapa).map(r => ({ nome: txt(r.ramo || r.nome || r.titulo, 60), folhas: arr(r.folhas).map(f => txt(f, 90)).filter(Boolean).slice(0, 8) })).filter(r => r.nome && r.folhas.length).slice(0, 8);
    return (secoes.length || perguntas.length || ramos.length) ? { secoes, perguntas, ramos } : null;
  }

  return { rng, hashTexto, sorteioBeta, betaCdf, betaQuantil, quantil,
    CHUTE_PADRAO, TAXA_HORA, DOM_ESTAB, estabilidadeTopico, priorTopico, modeloTopico, construirGemeo, questoesPorDisciplina, repartir, simularProva, chanceDeMeta, rankingGanho, notasComGemeo, girassolPontos, avisoDeDados,
    PERFIS, p3pl, thetaDeP, habilidadePerfil, gatilhos, priorDificuldade, estimarDificuldade, analisarQuestao, resumoAgentes, promptAgente, lerRespostaAgente, consolidarIA, promptExplicarPegadinha,
    SIGNIFICADOS, HEX_COR, IDS_COR, marcasDeGrifos, marcasDeMarcacoes, agruparPorTopico, agruparMarcas, resumoDeMarcas, htmlDoResumo, palavraChave, cartasDeMarcas, mapaDeGrupos, mapaDeMarcas, mesclarMapa, promptMelhorar, lerMelhoria };
});
