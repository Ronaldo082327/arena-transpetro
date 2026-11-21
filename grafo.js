/* Grafo do Concurso: diário único de evidências do Estúdio (window.DoraGrafo).
   Todo fato de desempenho vira um registro compacto, só de acréscimo, em arenaTP.eventos:
   {t: epoch em segundos, k:'resp'|'rev'|'ses'|'erro'|'sim', top:'tópico ou disciplina', ok:0|1, c:1|2|3 (chute, dúvida, certeza),
    s: segundos, m: minutos (sessão), f:'estudio'|'draw'|'tec'|'arena', r:'id do objeto', d:'disciplina', n:'nota 1-5'}
   Dele saem, por tópico/disciplina/dia: n, acerto com faixa de 80% (Beta), calibração, minutos. Nada de "prevê". */
(function (raiz) {
  'use strict';
  var K = 'arenaTP.eventos', KD = 'arenaTP.eventos.dia', TETO = 8000;
  function ler(k, pad) { try { return JSON.parse(localStorage.getItem(k) || pad); } catch (e) { return JSON.parse(pad); } }
  function todos() { return ler(K, '[]'); }
  function diaDe(t) { var d = new Date(t * 1000); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function hoje() { return diaDe(Date.now() / 1000); }
  function somaNoDia(acc, e) {
    var d = acc[diaDe(e.t)] || (acc[diaDe(e.t)] = { resp: 0, ok: 0, min: 0, rev: 0, erro: 0 });
    if (e.k === 'resp') { d.resp++; d.ok += e.ok ? 1 : 0; } else if (e.k === 'ses') { d.min += e.m || 0; d.resp += e.qn || 0; d.ok += e.qok || 0; } else if (e.k === 'rev') d.rev++; else if (e.k === 'erro') d.erro++;
  }
  function ev(o) {
    var e = Object.assign({ t: Math.round(Date.now() / 1000), f: 'estudio' }, o); var L = todos(); L.push(e);
    if (L.length > TETO) { var velhos = L.splice(0, L.length - TETO), acc = ler(KD, '{}'); velhos.forEach(function (x) { somaNoDia(acc, x); }); try { localStorage.setItem(KD, JSON.stringify(acc)); } catch (x) { } }
    try { localStorage.setItem(K, JSON.stringify(L)); } catch (x) { }
    if (raiz.DoraRAG && e.k === 'ses') raiz.DoraRAG.sujar();
    return e;
  }
  // Beta(acertos+1, erros+1): média e faixa de 80% por aproximação normal (n pequeno: faixa larga, honesta).
  function faixa(ok, n) { var a = ok + 1, b = n - ok + 1, m = a / (a + b), sd = Math.sqrt(a * b / ((a + b) * (a + b) * (a + b + 1))); return { n: n, p: m, lo: Math.max(0, m - 1.2816 * sd), hi: Math.min(1, m + 1.2816 * sd) }; }
  function filtra(fn) { return todos().filter(fn); }
  function dominio(chave) {
    var L = filtra(function (e) { return e.k === 'resp' && (e.top === chave || e.d === chave); }), ok = 0;
    L.forEach(function (e) { ok += e.ok ? 1 : 0; });
    var f = faixa(ok, L.length); f.ultimo = L.length ? L[L.length - 1].t : null; return f;
  }
  // Calibração: acerto por nível de confiança (1 chute, 2 dúvida, 3 certeza).
  function calibracao(desde) {
    var out = { 1: [0, 0], 2: [0, 0], 3: [0, 0] };
    filtra(function (e) { return e.k === 'resp' && e.c && (!desde || e.t >= desde); }).forEach(function (e) { out[e.c][0] += e.ok ? 1 : 0; out[e.c][1]++; });
    return out;
  }
  function porDia(de, ate) {
    var acc = ler(KD, '{}'), copia = {}; Object.keys(acc).forEach(function (k) { copia[k] = Object.assign({}, acc[k]); });
    todos().forEach(function (e) { somaNoDia(copia, e); });
    var out = [], d = new Date(de + 'T12:00:00'), fim = new Date(ate + 'T12:00:00');
    while (d <= fim) { var k = d.toISOString().slice(0, 10); out.push(Object.assign({ dia: k }, copia[k] || { resp: 0, ok: 0, min: 0, rev: 0, erro: 0 })); d.setDate(d.getDate() + 1); }
    return out;
  }
  function porDisciplina(desde) {
    var acc = {}; filtra(function (e) { return e.t >= desde && (e.d || e.top); }).forEach(function (e) {
      var k = e.d || e.top, a = acc[k] || (acc[k] = { resp: 0, ok: 0, min: 0 }); if (e.k === 'resp') { a.resp++; a.ok += e.ok ? 1 : 0; } if (e.k === 'ses') { a.min += e.m || 0; a.resp += e.qn || 0; a.ok += e.qok || 0; }
    }); return acc;
  }
  // Sentinela: padrões simples do próprio aluno, sempre com n.
  function sentinela() {
    var L = todos(), out = [], agora = Date.now() / 1000;
    var cal = calibracao(agora - 14 * 86400); if (cal[3][1] >= 10 && cal[3][0] / cal[3][1] < 0.7) out.push('Quando você marca "certeza", acerta ' + Math.round(100 * cal[3][0] / cal[3][1]) + '% (n=' + cal[3][1] + '). Desconfie das certezas rápidas.');
    if (cal[1][1] >= 8 && cal[1][0] / cal[1][1] > 0.45) out.push('Seus "chutes" acertam ' + Math.round(100 * cal[1][0] / cal[1][1]) + '% (n=' + cal[1][1] + '): você sabe mais do que acha. Elimine e marque.');
    var ses = L.filter(function (e) { return e.k === 'ses' && e.t > agora - 7 * 86400; }), min = ses.reduce(function (a, e) { return a + (e.m || 0); }, 0);
    if (ses.length) out.push('Nos últimos 7 dias: ' + Math.round(min / 60 * 10) / 10 + ' h em ' + ses.length + ' sessões registradas.');
    var dias = {}; L.filter(function (e) { return e.k === 'resp' && e.t > agora - 21 * 86400 && e.d; }).forEach(function (e) { dias[e.d] = Math.max(dias[e.d] || 0, e.t); });
    Object.keys(dias).forEach(function (d) { var sem = Math.floor((agora - dias[d]) / 86400); if (sem >= 3) out.push(sem + ' dias sem questões de ' + d + '.'); });
    return out.slice(0, 4);
  }
  raiz.DoraGrafo = { ev: ev, todos: todos, dominio: dominio, faixa: faixa, calibracao: calibracao, porDia: porDia, porDisciplina: porDisciplina, sentinela: sentinela, hoje: hoje, diaDe: diaDe };
})(typeof window !== 'undefined' ? window : globalThis);
