/* Rede da Dora: busca nos próprios materiais do aluno (estilo NotebookLM), local, sem servidor.
   Junta num índice só tudo o que entra e tudo o que é produzido no app: concurso e edital, perfil da banca,
   guias, questões, cartas, Caderno de Erros, fichas, mapas, respostas da Dora e os dados do Dora Draw
   (PDFs com texto por página, grifos, notas, cartões, questões, marcações, criações do Estúdio).
   Busca BM25 com normalização do português. Não é a única fonte: o bloco de contexto manda a IA usar
   primeiro estes trechos, citando [F1], [F2]…, e marcar o que vier de fora do material.
   Uso: DoraRAG.registrar(nome, rotulo, async () => [{id,titulo,texto,ref,peso}]); DoraRAG.contexto(pergunta). */
(function (raiz) {
  'use strict';
  var PARADAS = ('a o as os um uma uns umas de da do das dos d em na no nas nos num numa por pela pelo pelas pelos para pra com sem ' +
    'e ou mas nem que se ao aos à às é ser são era foi sao esta este isto esse essa isso aquele aquela aquilo ele ela eles elas ' +
    'lhe lhes me te nos vos seu sua seus suas meu minha teu tua qual quais quando como onde porque pois ja nao sim mais menos muito ' +
    'muita tambem so entre sobre ate apos ha tem ter sua the of and to in is are for on with be by an or as at it this that from').split(' ');
  var PARA = {}; PARADAS.forEach(function (p) { PARA[p] = 1; });

  function norm(s) {
    return String(s == null ? '' : s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/<[^>]+>/g, ' ').replace(/[^a-z0-9]+/g, ' ').trim();
  }
  // Redução leve (plural e algumas terminações) para "cardinalidades" achar "cardinalidade".
  function raizDe(t) {
    if (t.length <= 3 || /^\d+$/.test(t)) return t;
    var r = t;
    if (/coes$/.test(r)) r = r.replace(/coes$/, 'cao');
    else if (/oes$|aes$/.test(r)) r = r.replace(/(oes|aes)$/, 'ao');
    else if (/ais$/.test(r)) r = r.replace(/ais$/, 'al');
    else if (/eis$/.test(r) && r.length > 5) r = r.replace(/eis$/, 'el');
    else if (/ns$/.test(r)) r = r.replace(/ns$/, 'm');
    else if (/[aeiou]s$/.test(r) && r.length > 4) r = r.slice(0, -1);
    else if (/res$|zes$|les$/.test(r) && r.length > 5) r = r.slice(0, -2);
    if (/mente$/.test(r) && r.length > 8) r = r.replace(/mente$/, '');
    return r;
  }
  function tokens(s) {
    var o = [], p = norm(s).split(' ');
    for (var i = 0; i < p.length; i++) { var t = p[i]; if (!t || t.length < 2 || PARA[t]) continue; o.push(raizDe(t)); }
    return o;
  }
  // Corta texto longo em pedaços de ~900 caracteres, respeitando frases, com sobreposição curta.
  function pedacos(texto, tam) {
    tam = tam || 900; texto = String(texto || '').replace(/\s+/g, ' ').trim(); if (!texto) return [];
    if (texto.length <= tam) return [texto];
    var frases = texto.split(/(?<=[.!?;:])\s+/), out = [], cur = '';
    frases.forEach(function (f) {
      if (f.length > tam) { for (var i = 0; i < f.length; i += tam - 120) { if (cur) { out.push(cur); cur = ''; } out.push(f.slice(i, i + tam)); } return; }
      if ((cur + ' ' + f).length > tam && cur) { out.push(cur); var tail = cur.slice(-150); cur = tail.slice(tail.indexOf(' ') + 1) + ' ' + f; }
      else cur = cur ? cur + ' ' + f : f;
    });
    if (cur) out.push(cur);
    return out;
  }

  var fontes = [];            // {nome, rotulo, fn}
  var idx = null, sujo = true, construindo = null, ultima = 0;
  var K1 = 1.2, B = 0.75, VALIDADE = 5 * 60 * 1000;

  function registrar(nome, rotulo, fn) { fontes = fontes.filter(function (f) { return f.nome !== nome; }); fontes.push({ nome: nome, rotulo: rotulo, fn: fn }); sujo = true; }
  function sujar() { sujo = true; }

  function construir() {
    var docs = [];
    return Promise.all(fontes.map(function (f) {
      return Promise.resolve().then(f.fn).then(function (itens) {
        (itens || []).forEach(function (it) {
          if (!it) return; var titulo = String(it.titulo || '').trim(), corpo = String(it.texto || '').trim(); if (!corpo && !titulo) return;
          pedacos(corpo || titulo).forEach(function (p, i) {
            docs.push({ fonte: f.nome, rotulo: it.rotulo || f.rotulo, id: (it.id || titulo) + (i ? '#' + i : ''), titulo: titulo, texto: p, ref: it.ref || '', peso: it.peso || 1 });
          });
        });
      }).catch(function (e) { if (raiz.console) console.warn('Rede da Dora: fonte ' + f.nome + ' falhou', e); });
    })).then(function () {
      var inv = {}, soma = 0;
      docs.forEach(function (d, n) {
        var tk = tokens(d.titulo).concat(tokens(d.titulo), tokens(d.texto)); // título conta em dobro
        d.len = tk.length || 1; soma += d.len; var tf = {};
        tk.forEach(function (t) { tf[t] = (tf[t] || 0) + 1; });
        for (var t in tf) (inv[t] || (inv[t] = [])).push([n, tf[t]]);
      });
      idx = { docs: docs, inv: inv, media: docs.length ? soma / docs.length : 1, quando: Date.now() };
      sujo = false; ultima = Date.now(); construindo = null; return idx;
    });
  }
  function pronto(forcar) {
    if (construindo) return construindo;
    if (!idx || sujo || forcar || Date.now() - ultima > VALIDADE) return (construindo = construir());
    return Promise.resolve(idx);
  }

  function buscarSync(ix, q, op) {
    op = op || {}; var k = op.k || 8, porFonte = op.porFonte || 3;
    var qt = tokens(q), vistos = {}, sc = {}, N = ix.docs.length; if (!N || !qt.length) return [];
    qt.forEach(function (t) {
      if (vistos[t]) return; vistos[t] = 1; var lista = ix.inv[t]; if (!lista) return;
      var idf = Math.log(1 + (N - lista.length + 0.5) / (lista.length + 0.5));
      lista.forEach(function (p) { var d = ix.docs[p[0]], tf = p[1]; sc[p[0]] = (sc[p[0]] || 0) + idf * (tf * (K1 + 1)) / (tf + K1 * (1 - B + B * d.len / ix.media)); });
    });
    // bônus para frase exata de 2+ palavras
    var frase = norm(q); if (frase.split(' ').length >= 2 && frase.length >= 8) for (var n in sc) if (norm(ix.docs[n].texto).indexOf(frase) >= 0) sc[n] *= 1.4;
    var ord = Object.keys(sc).map(function (n) { var d = ix.docs[n]; return { d: d, s: sc[n] * d.peso }; }).sort(function (a, b) { return b.s - a.s; });
    var out = [], cont = {}, ids = {};
    for (var i = 0; i < ord.length && out.length < k; i++) {
      var d = ord[i].d, base = d.fonte + '|' + String(d.id).split('#')[0];
      if ((cont[d.fonte] || 0) >= porFonte || ids[base + d.texto.slice(0, 40)]) continue;
      cont[d.fonte] = (cont[d.fonte] || 0) + 1; ids[base + d.texto.slice(0, 40)] = 1;
      out.push({ fonte: d.fonte, rotulo: d.rotulo, titulo: d.titulo, texto: d.texto, ref: d.ref, score: +ord[i].s.toFixed(3) });
    }
    return out;
  }
  function buscar(q, op) { return pronto().then(function (ix) { return buscarSync(ix, q, op); }); }

  // Bloco para colar antes do pedido à IA. json=true: a IA não põe [F1] dentro do JSON.
  function contexto(q, op) {
    op = op || {}; var max = op.max || 5000;
    return buscar(q, { k: op.k || 8, porFonte: op.porFonte || 3 }).then(function (r) {
      if (!r.length) return { bloco: '', trechos: [] };
      var usados = [], tam = 0;
      r.forEach(function (t) { var linha = '[F' + (usados.length + 1) + '] ' + t.rotulo + (t.titulo ? ' · ' + t.titulo : '') + '\n' + t.texto; if (tam + linha.length > max) return; tam += linha.length; usados.push(Object.assign({ n: usados.length + 1 }, t)); usados[usados.length - 1].linha = linha; });
      var regra = 'FONTES DO PRÓPRIO ALUNO (Rede da Dora: materiais, questões, erros, resumos e perfil da banca). Use estas fontes como base principal. ' +
        (op.json ? 'Não escreva marcadores [F1] dentro do JSON. ' : 'Quando usar uma fonte, cite assim: [F1]. ') +
        'Se precisar de conhecimento que não está nas fontes, pode usar, mas deixe claro com "(fora do seu material)". Nunca diga que algo está no material do aluno se não estiver. Se uma fonte do aluno contradiz o que você sabe, diga isso.';
      return { bloco: regra + '\n\n' + usados.map(function (u) { return u.linha; }).join('\n\n') + '\n\nFIM DAS FONTES.\n\n', trechos: usados };
    });
  }
  function stats() {
    return pronto().then(function (ix) { var por = {}; ix.docs.forEach(function (d) { por[d.rotulo] = (por[d.rotulo] || 0) + 1; }); return { trechos: ix.docs.length, termos: Object.keys(ix.inv).length, porFonte: por, quando: ix.quando }; });
  }

  // Leitura (só leitura) do banco do Dora Draw no mesmo site. Só abre se o banco já existir,
  // para nunca criar um banco vazio que atrapalhe a migração do Draw.
  function lerDraw() {
    if (!raiz.indexedDB || !indexedDB.databases) return Promise.resolve(null);
    var perfil = ''; try { perfil = localStorage.getItem('doraDraw.perfil') || ''; } catch (e) { }
    var nome = perfil ? 'dora-draw-p-' + perfil : 'dora-draw';
    return indexedDB.databases().then(function (l) {
      if (!l.some(function (d) { return d.name === nome; })) return null;
      return new Promise(function (ok) {
        var r = indexedDB.open(nome); r.onerror = function () { ok(null); };
        r.onupgradeneeded = function () { try { r.transaction.abort(); } catch (e) { } ok(null); };
        r.onsuccess = function () {
          var db = r.result, lojas = ['concursos', 'disciplinas', 'topicos', 'materiais', 'grifos', 'cartoes', 'questoes', 'erros', 'marcacoes', 'capturas', 'artefatos'].filter(function (s) { return db.objectStoreNames.contains(s); });
          if (!lojas.length) { db.close(); return ok(null); }
          var tx = db.transaction(lojas, 'readonly'), out = {};
          lojas.forEach(function (s) { var q = tx.objectStore(s).getAll(); q.onsuccess = function () { out[s] = q.result || []; }; });
          tx.oncomplete = function () { db.close(); ok(out); }; tx.onerror = function () { db.close(); ok(null); };
        };
      });
    }).catch(function () { return null; });
  }

  raiz.DoraRAG = { registrar: registrar, sujar: sujar, buscar: buscar, contexto: contexto, stats: stats, pronto: pronto, lerDraw: lerDraw, norm: norm, tokens: tokens, pedacos: pedacos, _buscarSync: buscarSync };
})(typeof window !== 'undefined' ? window : globalThis);
