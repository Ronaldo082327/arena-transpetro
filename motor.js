/* Dora Motor: leitura do edital e distribuição de pesos SEM IA (window.DoraMotor; testável em Node).
   1) lerEdital(texto)        -> {disc:[{nome, topicos[], sub[]}], meta:{banca_id, orgao, cargo, prova}}
   2) quadro(texto, disc)     -> tenta achar nº de questões/peso por disciplina no texto do edital
   3) pesar(conc, perfis, op) -> relevância 1–5 por tópico e questões esperadas por tópico, combinando:
        - núcleo de alta incidência entre bancas (perfis.topicos_nucleo, por palavras);
        - o que a banca da prova mais cobra na área (perfis.bancas[].areas[area]);
        - tamanho do item no edital (itens com muitos subitens rendem mais questões);
        - incidência dos cadernos do aluno (nome | link | nº de questões), quando houver.
   4) prioridade(conc)        -> ganho = questões esperadas × (1 − domínio declarado), com erros do caderno.
   Tudo explicável na tela: cada tópico guarda os motivos do peso. Nada é "previsão". */
(function (raiz) {
  'use strict';
  function norm(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim(); }
  var MAI = 'A-ZÁÉÍÓÚÂÊÔÃÕÇÀÜ';
  var RX_DISC = new RegExp('(?:^|[\\s.;])((?:[' + MAI + '][' + MAI + '0-9ºª,\\-–()/ ]{2,90}?)|(?:[' + MAI + '][a-záéíóúâêôãõçà]+(?: (?:de|da|do|das|dos|e|em|à|a|para)?\\s?[' + MAI + '][a-záéíóúâêôãõçà]+){0,6}))\\s*(?:\\((\\d{1,3})\\))?\\s*:\\s*(?=(?:[IVX]{1,4}\\s+[' + MAI + ']{3,}[^:]{0,60}:\\s*)?\\d{1,2}(?:\\.\\d{1,2})*\\s*[.)\\-–]?\\s*[' + MAI + 'a-z])', 'g');
  function limpa(t) { return String(t || '').replace(/[\u00ad\uE000-\uF8FF\u200B-\u200D\uFEFF]/g, '').replace(/[ \t]+/g, ' ').replace(/\s*\n\s*/g, '\n'); }
  // Corta a parte do conteúdo programático, se houver marcador.
  function recorte(t) {
    var i = t.search(/CONTE[ÚU]DOS?\s+PROGRAM[ÁA]TICOS?|OBJETOS\s+DE\s+AVALIA[ÇC][ÃA]O|CONHECIMENTOS\s+B[ÁA]SICOS|ANEXO\s+[IVX]+\s*[–-]\s*CONTE/);
    return i >= 0 ? t.slice(i) : t;
  }
  function itens(bloco) {
    // "1 Texto. 1.1 Sub. 2 Outro." -> [{n:'1', t:'Texto', sub:['1.1 Sub']}]
    var partes = (' ' + bloco).split(/\s(?=\d{1,2}(?:\.\d{1,2}){0,3}\s*[.)\-–]?\s+[A-ZÁÉÍÓÚÂÊÔÃÕÇa-z(])/), out = [], cur = null;
    partes.forEach(function (p) {
      p = p.trim(); var m = p.match(/^(\d{1,2}(?:\.\d{1,2}){0,3})\s*[.)\-–]?\s+([\s\S]+)$/);
      if (!m) { if (cur && p) cur.t += ' ' + p; return; }
      var txt = m[2].replace(/\s+/g, ' ').replace(/[.;\s]+$/, '');
      if (m[1].indexOf('.') < 0) { cur = { n: m[1], t: txt, sub: [] }; out.push(cur); }
      else if (cur) cur.sub.push(m[1] + ' ' + txt); else { cur = { n: m[1], t: txt, sub: [] }; out.push(cur); }
    });
    return out;
  }
  function nomeBonito(n) { n = n.replace(/\s+/g, ' ').trim(); if (n === n.toUpperCase()) n = n.toLowerCase().replace(/(^|\s)(\S)/g, function (a, s, c) { return s + c.toUpperCase(); }).replace(/\b(De|Da|Do|Das|Dos|E|Em|A|À|Para|Ao|Aplicada)\b/g, function (w) { return w.toLowerCase(); }); n = n.replace(/\b(Ti|Tic|Sql|Lgpd|Itil|Cobit|Afo|Tcu|Bpmn|Ia|Erp|Pmbok|Icms|Ipva|Sped)\b/g, function (w) { return w.toUpperCase(); }); return n.charAt(0).toUpperCase() + n.slice(1); }
  // Mantém só os conhecimentos básicos + o bloco do cargo escolhido (texto do cargo, ex.: 'TECNOLOGIA DA INFORMA').
  function doCargo(r, cargo) {
    if (!cargo) return r; var marcas = [], m, rx = /CARGO\s+\d+\s*:[^\n]{0,160}/g; while ((m = rx.exec(r))) marcas.push({ i: m.index, t: m[0] });
    if (!marcas.length) return r; var k = norm(cargo), alvo = marcas.findIndex(function (x) { return norm(x.t).indexOf(k) >= 0; }); if (alvo < 0) return r;
    var ini = r.lastIndexOf('CONHECIMENTOS ESPEC', marcas[0].i); var base = ini > 0 ? r.slice(0, ini) : r.slice(0, marcas[0].i);
    doCargo.ultimo = marcas[alvo].t.replace(/^CARGO\s+\d+\s*:\s*/, '').trim();
    return base + r.slice(marcas[alvo].i, alvo + 1 < marcas.length ? marcas[alvo + 1].i : r.length);
  }
  function lerEdital(texto, perfis, op) {
    op = op || {}; anexo.cargo = null; doCargo.ultimo = null; var t = limpa(texto), r = doCargo(recorte(t), op.cargo), achados = [], m;
    RX_DISC.lastIndex = 0;
    while ((m = RX_DISC.exec(r))) { var nome = m[1].trim(); if (nome.length < 4 || /^(ANEXO|EDITAL|CARGO|ITEM|OBS|NOTA|PROVA|CONHECIMENTOS (B[ÁA]SICOS|ESPEC[ÍI]FICOS|GERAIS))$/i.test(nome)) continue; achados.push({ nome: nome, q: m[2] ? +m[2] : null, ini: m.index + m[0].indexOf(m[1]), corpo: m.index + m[0].length }); }
    var disc = [];
    achados.forEach(function (a, i) {
      var fim = i + 1 < achados.length ? achados[i + 1].ini : r.length, corpo = r.slice(a.corpo, fim), its = itens(corpo);
      if (its.length < 1) return;
      if (/^[IVX]{1,4}\s+\S/.test(a.nome) && disc.length) { var ant = disc[disc.length - 1], rot = nomeBonito(a.nome.replace(/^[IVX]{1,4}\s+/, '')); its.forEach(function (x) { ant.topicos.push(rot + ': ' + x.n + ' ' + x.t); ant.sub.push(x.sub); }); return; }
      var nm = nomeBonito(a.nome.replace(/^(NOÇÕES DE|NOCOES DE)\s+/i, function (x) { return x; }));
      var ex = disc.find(function (d) { return norm(d.nome) === norm(nm); });
      var tops = its.map(function (x) { return x.n + ' ' + x.t; }), subs = its.map(function (x) { return x.sub; });
      if (ex) { ex.topicos = ex.topicos.concat(tops); ex.sub = ex.sub.concat(subs); if (a.q) ex.questoes = (ex.questoes || 0) + a.q; } else disc.push({ nome: nm, topicos: tops, sub: subs, questoes: a.q });
    });
    // Sem cabeçalhos reconhecíveis: cai no formato de linhas (MAIÚSCULAS ou "Matéria:" por linha; itens por ";").
    var nomesQ = quadroLinhas(texto).map(function (x) { return norm(x.nome); });
    var nota = function (D) { var hit = D.filter(function (d) { var k = norm(d.nome); return nomesQ.some(function (n) { return n === k || (n.length > 6 && (n.indexOf(k) >= 0 || k.indexOf(n) >= 0)); }); }).length; return hit * 10 + Math.min(9, D.reduce(function (x, d) { return x + d.topicos.length; }, 0) / 50) - (nomesQ.length ? Math.max(0, D.length - nomesQ.length) : 0); };
    var an = anexo(t, op.cargo);
    if (an) { var dl = linhas(an, quadroLinhas(texto).map(function (x) { return x.nome; })); if (!disc.length || nota(dl) > nota(disc)) disc = dl; }
    else if (!disc.length) disc = linhas(t);
    var mt = meta(t, perfis); if (op.cargo && (anexo.cargo || doCargo.ultimo)) mt.cargo = nomeBonito(anexo.cargo || doCargo.ultimo); return { disc: disc, meta: mt };
  }
  // Conteúdo programático em anexo, sem numeração (estilo FGV): do último "CONTEÚDO PROGRAMÁTICO" até o próximo "ANEXO".
  function anexo(t, cargo) {
    var re = /CONTE[ÚU]DOS?\s+PROGRAM[ÁA]TICOS?/g, m, ult = -1; while ((m = re.exec(t))) ult = m.index; if (ult < 0) return null;
    var resto = t.slice(ult + 20), f = resto.search(/\n\s*ANEXO\s+[IVX]+\b/); resto = f > 0 ? resto.slice(0, f) : resto;
    if (!cargo) return resto;
    // cabeçalhos de cargo: linha em maiúsculas seguida de "MÓDULO"/"CONHECIMENTOS" nas 2 linhas seguintes
    var L = resto.split('\n'), cab = [];
    L.forEach(function (l, i) { var x = l.trim(); if (x.length > 4 && x.length < 90 && x === x.toUpperCase() && !/^(M[ÓO]DULO|CONHECIMENTOS)/.test(x) && /^(M[ÓO]DULO|CONHECIMENTOS)/.test(((L[i + 1] || '') + ' ' + (L[i + 2] || '')).trim())) cab.push({ i: i, t: x }); });
    var k = norm(cargo), alvo = cab.findIndex(function (c) { return norm(c.t).indexOf(k) >= 0 || k.indexOf(norm(c.t)) >= 0; });
    if (alvo < 0) return resto; anexo.cargo = cab[alvo].t;
    return L.slice(cab[alvo].i, alvo + 1 < cab.length ? cab[alvo + 1].i : L.length).join('\n');
  }
  function linhas(t, nomes) {
    var conhecidos = (nomes || []).map(norm);
    var L = String(t).split(/\n/), conta = {}, chave = function (l) { return l.trim().replace(/\d+/g, '#'); }; L.forEach(function (l) { var k = chave(l); if (k) conta[k] = (conta[k] || 0) + 1; });
    var out = [], cur = null, buf = '';
    var fecha = function () { if (!cur || !buf.trim()) { buf = ''; return; } buf.replace(/\s+/g, ' ').split(/(?:\.|;)\s+(?=[A-ZÁÉÍÓÚÂÊÔÃÕÇ0-9])/).forEach(function (x) { x = x.replace(/[.;\s]+$/, '').trim(); if (x.length > 2) { cur.topicos.push(x); cur.sub.push([]); } }); buf = ''; };
    L.forEach(function (l0) {
      var l = l0.replace(/^\s*(?:[-•*])\s*/, '').trim(); if (!l || conta[chave(l)] >= 3 || /^\d{1,3}$/.test(l)) return;
      var mi = l.match(/^([A-ZÁÉÍÓÚÂÊÔÃÕÇ][A-Za-zÀ-ÿ ,\-–]{2,70}?):\s*(.*)$/);
      if (mi && !(cur && !buf.trim() && norm(cur.nome).indexOf(norm(mi[1])) === 0) && conhecidos.some(function (n) { var q = norm(mi[1]); return q === n || (n.length > 8 && q.length > 8 && (n.indexOf(q) === 0 || q.indexOf(n) === 0)); })) { fecha(); cur = { nome: nomeBonito(mi[1]), topicos: [], sub: [] }; out.push(cur); buf = ' ' + mi[2]; return; }
      var ehDisc = l.length > 3 && l.length < 90 && (/^[^a-z]+:\s*$/.test(l) || (l === l.toUpperCase() && /[A-ZÁÉÍÓÚ]{3}/.test(l) && !/\.\s*$/.test(l)));
      if (ehDisc) {
        if (/^(CONHECIMENTOS|CARGO|N[ÍI]VEL|ANEXO|PROVA)\b/i.test(l)) { fecha(); return; }
        fecha(); cur = { nome: nomeBonito(l.replace(/:\s*$/, '')), topicos: [], sub: [] }; out.push(cur); return;
      }
      if (!cur) { cur = { nome: 'Geral', topicos: [], sub: [] }; out.push(cur); }
      buf += ' ' + l;
    });
    fecha();
    return out.filter(function (d) { return d.topicos.length; });
  }
  var MESES = { janeiro: 1, fevereiro: 2, marco: 3, abril: 4, maio: 5, junho: 6, julho: 7, agosto: 8, setembro: 9, outubro: 10, novembro: 11, dezembro: 12 };
  function meta(t, perfis) {
    var n = norm(t.slice(0, 60000)), out = { banca_id: null, banca: null, orgao: null, cargo: null, prova: null };
    var melhor = 0; ((perfis && perfis.bancas) || []).forEach(function (b) {
      var sc = 0; (b.palavras_chave_edital || []).concat(b.apelidos || [], [b.nome]).forEach(function (k) { var kk = norm(k); if (kk.length < 3) return; var i = 0, c = 0; while ((i = n.indexOf(kk, i)) >= 0 && c < 20) { c++; i += kk.length; } sc += c * (kk.length > 12 ? 3 : 1); });
      if (sc > melhor) { melhor = sc; out.banca_id = b.id; out.banca = b.nome; }
    });
    var o = t.match(/(Banco Central do Brasil|Receita Federal(?: do Brasil)?|Secretaria (?:de Estado )?da Fazenda[^\n.,;]{0,40}|Tribunal [^\n.,;]{3,60}|Autoridade Nacional de Prote[çc][ãa]o de Dados|Ag[êe]ncia Nacional [^\n.,;]{3,50}|Minist[ée]rio [^\n.,;]{3,60}|Pol[íi]cia [^\n.,;]{3,40}|Prefeitura [^\n.,;]{3,50}|Petrobras|Transpetro|Caixa Econ[ôo]mica Federal|Banco do Brasil|Controladoria-Geral [^\n.,;]{3,30})/i);
    if (o) out.orgao = o[1].replace(/\s+/g, ' ').trim();
    var c = t.match(/CARGO\s*\d*\s*[:–\-]\s*([^\n;]{4,90})/i) || t.match(/(Analista[^\n;,.]{0,60}|Auditor[^\n;,.]{0,60}|T[ée]cnico[^\n;,.]{0,60}|Especialista[^\n;,.]{0,60}|Agente[^\n;,.]{0,40}|Escritur[áa]rio[^\n;,.]{0,30})/);
    if (c) out.cargo = c[1].replace(/\s+/g, ' ').trim();
    var p = t.match(/prova[s]?\s+objetiva[s]?[^.]{0,160}?(\d{1,2})\s+de\s+(janeiro|fevereiro|mar[çc]o|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)\s+de\s+(\d{4})/i) || t.match(/prova[s]?\s+objetiva[s]?[^.]{0,160}?(\d{1,2})\/(\d{1,2})\/(\d{4})/i);
    if (p) { var mes = isNaN(+p[2]) ? MESES[norm(p[2])] : +p[2]; if (mes) out.prova = p[3] + '-' + String(mes).padStart(2, '0') + '-' + String(+p[1]).padStart(2, '0'); }
    return out;
  }
  // Procura "Disciplina ... N questões/itens" no texto (quadro de provas).
  function quadroLinhas(texto) {
    var t = String(texto || '').replace(/[\u00ad\uE000-\uF8FF\u200B-\u200D\uFEFF]/g, ''), pesoBloco = null, linhasQ = [];
    t.split(/\n/).forEach(function (l) {
      var pb = l.match(/PESO\s+(\d+(?:,\d+)?)/i); if (pb && /CONHECIMENTOS|BLOCO|M[ÓO]DULO/i.test(l)) pesoBloco = +pb[1].replace(',', '.');
      var m = l.match(/^\s*(?:\d{1,2}[.)]\s+)?([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ ,\-–()\/]{3,90}?)\s{2,}(\d{1,3})(?:\s{2,}(\d{1,3}(?:,\d{1,2})?))?\s*$/);
      if (m && !/^(total|disciplinas?|quest)/i.test(m[1].trim())) linhasQ.push({ nome: m[1].trim(), q: +m[2], pts: m[3] ? +m[3].replace(',', '.') : null, pb: pesoBloco });
    });
    return linhasQ;
  }
  function quadro(texto, disc) {
    var t = String(texto || ''), linhasQ = quadroLinhas(texto);
    disc.forEach(function (d) {
      var k = norm(d.nome), achou = linhasQ.find(function (x) { var n = norm(x.nome); return n === k || (n.length > 5 && (k.indexOf(n) >= 0 || n.indexOf(k) >= 0)); });
      if (achou) { if (!d.questoes) d.questoes = achou.q; d.peso = achou.pts && achou.q ? Math.round(100 * achou.pts / achou.q) / 100 : (achou.pb || d.peso || 1); return; }
      var tt = t.replace(/\n/g, ' '), kk = d.nome.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');
      var m2 = tt.match(new RegExp(kk + '[^\\d]{0,40}(\\d{1,3})\\s*(?:quest|itens|item)', 'i')); if (m2 && !d.questoes) d.questoes = +m2[1];
    });
    return disc;
  }
  // ---------- pesos ----------
  function casa(texto, palavras) { var n = ' ' + norm(texto) + ' '; return (palavras || []).some(function (p) { var q = norm(p); return q.length > 2 && n.indexOf(' ' + q) >= 0; }); }
  function chaveDisc(nome) { return norm(nome).replace(/\b(nocoes|de|da|do|e|conhecimentos|basicos|especificos)\b/g, ' ').replace(/\s+/g, ' ').trim(); }
  function nucleoDe(perfis, nomeDisc) {
    var tn = (perfis && perfis.topicos_nucleo) || {}, k = chaveDisc(nomeDisc), melhor = null, mk = 0;
    Object.keys(tn).forEach(function (d) { var dk = chaveDisc(d), sc = 0; dk.split(' ').forEach(function (w) { if (w.length > 3 && k.indexOf(w) >= 0) sc++; }); if (sc > mk) { mk = sc; melhor = tn[d]; } });
    return melhor || [];
  }
  function bancaArea(perfis, bancaId, area, nomeDisc) {
    var b = ((perfis && perfis.bancas) || []).find(function (x) { return x.id === bancaId; }); if (!b || !b.areas) return null;
    var lst = ((b.areas[area] || {}).disciplinas_mais_cobradas) || [], k = chaveDisc(nomeDisc);
    return lst.find(function (x) { var dk = chaveDisc(x.disciplina); return dk && (k.indexOf(dk) >= 0 || dk.indexOf(k) >= 0 || dk.split(' ').some(function (w) { return w.length > 4 && k.indexOf(w) >= 0; })); }) || null;
  }
  function areaDe(conc) {
    if (conc.area) return conc.area; var t = norm((conc.cargo || '') + ' ' + (conc.nome || '') + ' ' + (conc.orgao || ''));
    if (/tecnologia|informacao|sistemas|ti\b|dados|software|desenvolv|infraestrutura/.test(t)) return 'ti';
    if (/fiscal|tribut|receita|fazenda|auditor fiscal|sefaz/.test(t)) return 'fiscal';
    if (/controle|tcu|tce|cgu|controladoria|auditor federal/.test(t)) return 'controle';
    return null;
  }
  // cadernos: [{nome, url, n}] (n = nº de questões do caderno, opcional)
  function pesar(conc, perfis, op) {
    op = op || {}; var area = areaDe(conc), cads = conc.cadernos || [];
    (conc.disc || []).forEach(function (d) {
      var nuc = nucleoDe(perfis, d.nome), ba = bancaArea(perfis, conc.banca_id, area, d.nome), brutos = [];
      d.motivos = []; d.sub = d.sub || [];
      d.topicos.forEach(function (t, j) {
        var s = 1, mot = [], sub = (d.sub[j] || []).join(' '), txt = t + ' ' + sub;
        var nn = nuc.find(function (x) { return casa(txt, x.palavras || [x.topico]); });
        if (nn) { s += nn.nivel === 'alto' ? 2 : 1; mot.push('núcleo de alta incidência' + (nn.nivel === 'alto' ? '' : ' (médio)') + (nn.hipotese ? ' [hipótese]' : '')); }
        if (ba && (ba.topicos_frequentes || []).some(function (x) { return casa(txt, norm(x).split(' ').filter(function (w) { return w.length > 4; }).slice(0, 3)); })) { s += 1.5; mot.push('a ' + (conc.banca || 'banca') + ' cobra muito isso em ' + (area || 'provas da área')); }
        var tam = (d.sub[j] || []).length; if (tam >= 3) { s += Math.min(1, tam / 8); mot.push(tam + ' subitens no edital'); }
        var nc = 0; cads.forEach(function (c) { if (casa(c.nome, norm(t).split(' ').filter(function (w) { return w.length > 4; }).slice(0, 4))) nc += (+c.n || 10); });
        if (nc) { s += Math.min(2, Math.log10(1 + nc)); mot.push('seus cadernos: ' + nc + ' questões'); }
        brutos.push(s); d.motivos[j] = mot;
      });
      // 1–5 por quantis dentro da disciplina (relativo; o tamanho da disciplina vem das questões)
      var ord = brutos.slice().sort(function (a, b) { return a - b; });
      d.rel = brutos.map(function (s) { if (ord[ord.length - 1] === ord[0]) return 3; var q = (ord.indexOf(s) + ord.lastIndexOf(s)) / 2 / Math.max(1, ord.length - 1); return q >= .85 ? 5 : q >= .65 ? 4 : q >= .3 ? 3 : q >= .12 ? 2 : 1; });
      var Q = +d.questoes || 0, soma = d.rel.reduce(function (a, r) { return a + r; }, 0) || 1;
      d.esperadas = d.rel.map(function (r) { return Q ? Math.round(10 * Q * r / soma) / 10 : null; });
      if (ba && ba.disciplina) d.motivoDisc = 'Entre as mais cobradas pela ' + (conc.banca || 'banca') + ' em ' + area;
    });
    conc.area = area; conc.motor = { versao: 1, quando: new Date().toISOString().slice(0, 10) };
    return conc;
  }
  var PDOM = { 1: .15, 2: .3, 3: .5, 4: .68, 5: .82 };
  // Lista ordenada de tópicos pelo ganho; erros: [{disc, topico}] do Caderno de Erros.
  function prioridade(conc, erros) {
    var rows = [], er = erros || [];
    (conc.disc || []).forEach(function (d, di) {
      var Q = +d.questoes || 0, pesoD = +d.peso || 1, somaRel = (d.rel || []).reduce(function (a, r) { return a + r; }, 0) || d.topicos.length || 1;
      d.topicos.forEach(function (t, j) {
        var rel = (d.rel && d.rel[j]) || 3, esp = Q ? Q * pesoD * rel / somaRel : pesoD * rel / 5, dom = (d.domT && d.domT[j]) || d.dom || 3,
          ne = er.filter(function (e) { var tt = norm(e.topico), tn = norm(t); return (tt && (tt.indexOf(tn) >= 0 || tn.indexOf(tt) >= 0)) || (!tt && norm(e.disc) === norm(d.nome)); }).length;
        rows.push({ disc: d.nome, topico: t, rel: rel, er: ne, di: di, ti: j, esp: Math.round(100 * esp) / 100, dom: dom, prio: esp * (1 - PDOM[dom]) * (1 + 0.35 * Math.min(6, ne)), motivos: (d.motivos && d.motivos[j]) || [] });
      });
    });
    return rows.sort(function (a, b) { return b.prio - a.prio; });
  }
  raiz.DoraMotor = { doCargo: doCargo, anexo: anexo, quadroLinhas: quadroLinhas, lerEdital: lerEdital, quadro: quadro, pesar: pesar, prioridade: prioridade, meta: meta, areaDe: areaDe, norm: norm, itens: itens };
})(typeof window !== 'undefined' ? window : globalThis);
