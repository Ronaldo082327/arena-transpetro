/* Dora Draw — o que fazer com uma captura (seleção, página, questão, minuto de vídeo, recorte de tela).
   Usado pelo painel lateral da extensão e pela "Caixa de entrada" do app. Só grava depois que o usuário escolhe concurso e tópico. */
(function (raiz) {
  const L = raiz.DoraLogica, DB = raiz.DoraDB;
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const par = (t) => String(t || '').split(/\n{2,}/).map(p => '<p>' + esc(p).replace(/\n/g, '<br>') + '</p>').join('');
  function htmlNota(c) {
    let h = '';
    if (c.tipo === 'minuto') h += '<p><b>Marcação de vídeo ' + esc(c.tempoTxt || '') + '</b> — ' + esc(c.titulo || '') + '<br>' + esc(c.url || '') + '</p>' + (c.texto ? par(c.texto) : '');
    else { if (c.titulo) h += '<h3>' + esc(c.titulo) + '</h3>'; if (c.texto) h += par(c.texto); if (c.url) h += '<p>Fonte: ' + esc(c.url) + '</p>'; }
    if (c.comentario) h += par(c.comentario);
    return h;
  }
  async function questaoDeCaptura(c) {
    if (c.questao && c.questao.enunciado) return c.questao;
    const lista = L.parseQuestoesTexto(c.texto || ''); return lista[0] || { tipo: 'multipla', enunciado: c.texto || '', alternativas: [], gabarito: '', comentario: '' };
  }
  // como: 'nota' | 'cartao' | 'questao' | 'imagem'
  async function aplicar(c, { concursoId, topicoId, como }) {
    if (!concursoId) throw new Error('Escolha o concurso.');
    const t = topicoId ? await DB.get('topicos', topicoId) : null; const agora = Date.now(); let id = null;
    if (como === 'nota') { if (!t) throw new Error('Escolha o tópico.'); t.notaHtml = (t.notaHtml || '') + htmlNota(c); await DB.put('topicos', t); }
    else if (como === 'imagem') {
      if (!t) throw new Error('Escolha o tópico.'); const img = await new Promise((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = rej; im.src = c.imagem; });
      const k = Math.min(1, 640 / img.width, 420 / img.height); const w = Math.round(img.width * k), hh = Math.round(img.height * k); const q = t.quadro && Array.isArray(t.quadro.e) ? t.quadro : { v: 1, w: 1200, h: 800, e: [] };
      const off = (q.e.filter(e => e.k === 'i').length % 4) * 24; q.e.push({ k: 'i', u: c.imagem, p: [60 + off, 60 + off, 60 + off + w, 60 + off + hh] }); t.quadro = q; await DB.put('topicos', t);
    } else if (como === 'cartao') {
      id = L.uid('c'); await DB.put('cartoes', { id, concursoId, topicoId: topicoId || null, tipo: 'basico', frente: (c.titulo && !c.texto ? c.titulo : c.texto || '').slice(0, 1500), verso: c.comentario || '', fonte: c.url || '', origem: 'captura', criado: agora });
    } else if (como === 'questao') {
      const q = await questaoDeCaptura(c); id = L.uid('c');
      await DB.put('cartoes', Object.assign({ id, concursoId, topicoId: topicoId || null, tipo: 'questao', enunciado: q.enunciado, alternativas: q.alternativas, gabarito: q.gabarito || '', explicacao: q.comentario || '', banca: q.banca || '', ano: q.ano || null, fonte: c.url || '', origem: 'captura', criado: agora }, c.imagem ? { imagem: c.imagem } : {}));
    } else throw new Error('Escolha o que fazer com a captura.');
    if (c.id && await DB.get('capturas', c.id)) await DB.del('capturas', c.id);
    return id;
  }
  async function guardarNaCaixa(c) { const item = Object.assign({ id: L.uid('cap'), ts: Date.now() }, c); await DB.put('capturas', item); return item; }
  raiz.DoraCaptura = { aplicar, guardarNaCaixa, htmlNota, questaoDeCaptura };
})(typeof self !== 'undefined' ? self : this);
