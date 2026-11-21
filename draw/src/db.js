/* Dora Draw — banco local (IndexedDB). Funciona na página do app, no painel lateral e no service worker. */
(function (raiz) {
  const perfil = () => { try { return (typeof localStorage !== 'undefined' && localStorage.getItem('doraDraw.perfil')) || ''; } catch (e) { return ''; } };
  const NOME = 'dora-draw' + (perfil() ? '-p-' + perfil() : ''), VERSAO = 2;
  // loja: [chave, índices...]
  const LOJAS = {
    concursos: ['id'], disciplinas: ['id', 'concursoId'], topicos: ['id', 'concursoId', 'disciplinaId'], cartoes: ['id', 'concursoId', 'topicoId'],
    questoes: ['id', 'concursoId', 'topicoId'], cadernos: ['id', 'concursoId'], respostas: ['id', 'concursoId', 'topicoId'], erros: ['id', 'concursoId', 'topicoId'],
    materiais: ['id', 'concursoId', 'topicoId'], grifos: ['id', 'materialId', 'topicoId'], sessoes: ['id', 'concursoId', 'topicoId'], capturas: ['id', 'concursoId'],
    simulados: ['id', 'concursoId'], copias: ['id'], config: ['chave'], arquivos: ['id']
  };
  const SEGREDOS = ['ia-chaves']; // nunca entram no backup
  let abrindo = null;
  function abrir() {
    if (abrindo) return abrindo;
    abrindo = new Promise((res, rej) => {
      const rq = indexedDB.open(NOME, VERSAO);
      rq.onupgradeneeded = () => { const db = rq.result; for (const nome in LOJAS) { const [chave, ...idx] = LOJAS[nome]; if (!db.objectStoreNames.contains(nome)) { const st = db.createObjectStore(nome, { keyPath: chave }); idx.forEach(i => st.createIndex(i, i)); } } };
      rq.onsuccess = () => { rq.result.onversionchange = () => rq.result.close(); res(rq.result); };
      rq.onerror = () => { abrindo = null; rej(rq.error); };
    });
    return abrindo;
  }
  const pedido = (rq) => new Promise((res, rej) => { rq.onsuccess = () => res(rq.result); rq.onerror = () => rej(rq.error); });
  async function tx(lojas, modo, fn) { const db = await abrir(); const t = db.transaction(lojas, modo); const feito = new Promise((res, rej) => { t.oncomplete = () => res(); t.onerror = () => rej(t.error); t.onabort = () => rej(t.error); }); const r = await fn(t); await feito; return r; }
  const avisar = (loja) => { try { raiz.__doraCanal = raiz.__doraCanal || new BroadcastChannel('dora-draw'); raiz.__doraCanal.postMessage({ loja, t: Date.now() }); } catch (e) { /* sem BroadcastChannel */ } };
  const DB = {
    LOJAS, abrir,
    async put(loja, obj) { await tx(loja, 'readwrite', t => pedido(t.objectStore(loja).put(obj))); avisar(loja); return obj; },
    async putMuitos(loja, arr) { if (!arr.length) return; await tx(loja, 'readwrite', t => { const st = t.objectStore(loja); arr.forEach(o => st.put(o)); return null; }); avisar(loja); },
    get(loja, id) { return tx(loja, 'readonly', t => pedido(t.objectStore(loja).get(id))); },
    async del(loja, id) { await tx(loja, 'readwrite', t => pedido(t.objectStore(loja).delete(id))); avisar(loja); },
    async delMuitos(loja, ids) { if (!ids.length) return; await tx(loja, 'readwrite', t => { const st = t.objectStore(loja); ids.forEach(i => st.delete(i)); return null; }); avisar(loja); },
    todos(loja) { return tx(loja, 'readonly', t => pedido(t.objectStore(loja).getAll())); },
    porIndice(loja, indice, valor) { return tx(loja, 'readonly', t => pedido(t.objectStore(loja).index(indice).getAll(IDBKeyRange.only(valor)))); },
    async limpar(loja) { await tx(loja, 'readwrite', t => pedido(t.objectStore(loja).clear())); avisar(loja); },
    async cfgGet(chave, padrao) { const r = await DB.get('config', chave); return r && r.valor !== undefined ? r.valor : padrao; },
    cfgSet(chave, valor) { return DB.put('config', { chave, valor }); },
    // exportar tudo (sem segredos). Com PDFs: os arquivos viram base64.
    async exportar(L, { comArquivos = false } = {}) {
      const dados = {}; for (const l of L.LOJAS) dados[l] = await DB.todos(l);
      dados.config = dados.config.filter(c => !SEGREDOS.includes(c.chave));
      const extra = {}; if (comArquivos) { extra.arquivos = []; for (const a of await DB.todos('arquivos')) extra.arquivos.push({ id: a.id, tipo: a.blob && a.blob.type, b64: await blobParaB64(a.blob) }); }
      return L.montarBackup(dados, extra);
    },
    async importar(L, backup, modo = 'mesclar') {
      const v = L.validarBackup(backup); if (!v.ok) throw new Error(v.erro);
      let dados = backup; if (modo === 'mesclar') { const atual = {}; for (const l of L.LOJAS) atual[l] = await DB.todos(l); dados = L.mesclarDados(atual, backup); }
      else for (const l of L.LOJAS) if (l !== 'config') await DB.limpar(l);
      for (const l of L.LOJAS) { if (l === 'config' && modo === 'substituir') { const mant = (await DB.todos('config')).filter(c => SEGREDOS.includes(c.chave)); await DB.limpar('config'); await DB.putMuitos('config', mant); } await DB.putMuitos(l, dados[l] || []); }
      if (backup.arquivos) for (const a of backup.arquivos) await DB.put('arquivos', { id: a.id, blob: b64ParaBlob(a.b64, a.tipo) });
      return v.resumo;
    },
    async apagarTudo() { for (const l in LOJAS) { if (l === 'config') { const mant = (await DB.todos('config')).filter(c => SEGREDOS.includes(c.chave)); await DB.limpar('config'); await DB.putMuitos('config', mant); } else await DB.limpar(l); } }
  };
  function blobParaB64(blob) { return new Promise((res) => { if (!blob) return res(''); const fr = new FileReader(); fr.onload = () => res(String(fr.result).split(',')[1] || ''); fr.readAsDataURL(blob); }); }
  function b64ParaBlob(b64, tipo) { const bin = atob(b64 || ''); const u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return new Blob([u], { type: tipo || 'application/pdf' }); }
  DB.nome = NOME; raiz.DoraDB = DB;
})(typeof self !== 'undefined' ? self : this);
