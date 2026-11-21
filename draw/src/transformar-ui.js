/* Dora Draw — janela "Transformar marcações" (usada no app, na Estante/Leitor e no painel "Minhas marcações" da extensão).
   Pega grifos, anotações e marcações e gera: (a) um RESUMO organizado (vira nota do tópico), (b) DORA CARTAS com prévia e seleção,
   (c) um MAPA MENTAL editável. Sem IA a transformação é determinística (logica5.js); com IA, "Melhorar com a IA" refina tudo.
   Nada é gravado antes de o aluno apertar o botão de salvar. Recebe tudo por parâmetro (op), para funcionar fora do app também. */
(function (raiz) {
  const L5 = raiz.DoraLogica5;
  // op: { h, L, marcas, titulo, topicos, topico(id), concursoId, cartoesExistentes[], significados, hoje, sanitizar, toast,
  //       salvarTopico(t), salvarCartao(c), temIA(), ia (com .chamar), rodando(el, texto), irMapa(topicoId), aoGravar() }
  function montar(op) {
    const h = op.h, L = op.L; const sig = op.significados || L5.SIGNIFICADOS; const topicoDe = op.topico || ((id) => (op.topicos || []).find(t => t.id === id));
    const est = { organizar: 'cor', padrao: null, melhoria: {}, marcadas: null }; const raizEl = h('div', { class: 'pilha', 'data-transformar': '1' });
    const grupos = () => L5.agruparPorTopico(op.marcas, est.padrao).map(g => { const t = g.topicoId ? topicoDe(g.topicoId) : null; const multi = L5.agruparPorTopico(op.marcas, est.padrao).length > 1; return Object.assign(g, { topico: t, titulo: op.titulo ? (multi && t ? op.titulo + ' — ' + t.titulo : op.titulo) : (t ? t.titulo : 'Marcações') }); });
    const semTopico = () => op.marcas.some(m => !m.topicoId) && !est.padrao;
    const html = (g) => { const m = est.melhoria[g.topicoId || '']; return m && m.secoes.length ? L5.htmlDoResumo(g.titulo, m.secoes, { total: g.marcas.length, data: op.hoje }) : L5.resumoDeMarcas({ marcas: g.marcas, titulo: g.titulo, significados: sig, organizar: est.organizar, data: op.hoje }).html; };
    const mapa = (g, i) => { const m = est.melhoria[g.topicoId || '']; const pre = 'mk' + (Date.now() % 100000).toString(36) + i; return m && m.ramos.length ? L5.mapaDeGrupos(g.titulo, m.ramos, { prefixo: pre }) : L5.mapaDeMarcas({ marcas: g.marcas, titulo: g.titulo, significados: sig, organizar: est.organizar, prefixo: pre }); };
    const chave = (f) => raiz.DoraLogica3.chaveCartao(f);
    const cartas = () => { const vistos = new Set(op.cartoesExistentes.map(chave)); const out = [];
      grupos().forEach(g => { const m = est.melhoria[g.topicoId || '']; const ia = m ? m.perguntas.map(p => ({ tipo: 'basica', frente: p.frente, verso: p.verso, lacuna: null, tags: ['ia'], origem: 'marcacao-ia', significado: 'IA' })) : [];
        const det = L5.cartasDeMarcas({ marcas: g.marcas, significados: sig, existentes: Array.from(vistos), max: 60 });
        ia.concat(det).forEach(c => { const k = chave(c.frente); if (!k || vistos.has(k)) return; vistos.add(k); out.push(Object.assign(c, { topicoId: g.topicoId, topico: g.topico })); }); });
      return out; };
    function pinta() {
      const gs = grupos(); const total = op.marcas.length; raizEl.replaceChildren();
      raizEl.append(h('p', { class: 'muted peq', style: 'margin:0' }, total + (total === 1 ? ' marcação' : ' marcações') + ' em ' + gs.length + (gs.length === 1 ? ' tópico' : ' tópicos') + '. Veja a prévia, escolha o que gravar e confirme. Nada é salvo antes.'));
      if (op.marcas.some(m => !m.topicoId)) { const s = h('select', { 'aria-label': 'Tópico para as marcações sem tópico', 'data-padrao': '1', onchange: (e) => { est.padrao = e.target.value || null; pinta(); } }, h('option', { value: '' }, '(escolha um tópico)'), (op.topicos || []).filter(t => !(op.topicos || []).some(o => o.paiId === t.id)).map(t => h('option', Object.assign({ value: t.id }, est.padrao === t.id ? { selected: true } : {}), t.titulo))); raizEl.append(h('label', { class: 'campo' }, h('span', {}, 'Tópico para as marcações que ainda não têm tópico'), s)); }
      const org = h('div', { class: 'seg', role: 'group', 'aria-label': 'Organizar por' }, [['cor', 'Por cor (significado)'], ['pagina', 'Por página']].map(([k, n]) => h('button', { type: 'button', 'data-org': k, 'aria-pressed': String(est.organizar === k), onclick: () => { est.organizar = k; pinta(); } }, n)));
      const ia = h('button', { class: 'btn', type: 'button', 'data-melhorar-ia': '1', onclick: (ev) => melhorar(ev.currentTarget) }, 'Melhorar com a IA');
      raizEl.append(h('div', { class: 'linha' }, org, op.temIA && op.temIA() ? ia : h('span', { class: 'muted peq' }, 'Sem IA configurada: a transformação é feita só por regras (sem enviar nada para fora).')));
      if (Object.keys(est.melhoria).length) raizEl.append(h('div', { class: 'afundado peq', 'data-ia-aviso': '1' }, 'Refinado pela IA. Ela pode errar ou resumir demais: confira com o seu material antes de gravar.'));
      // ---- resumo
      const pre = h('div', { class: 'afundado', style: 'max-height:260px;overflow:auto' }); gs.slice(0, 6).forEach(g => { const d = h('div', { 'data-resumo-previa': '1' }); d.innerHTML = op.sanitizar ? op.sanitizar(html(g)) : ''; pre.append(d); }); if (gs.length > 6) pre.append(h('div', { class: 'muted peq' }, '...e mais ' + (gs.length - 6) + ' tópicos.'));
      raizEl.append(h('div', { class: 'cartao', style: 'margin:0' }, h('h3', { style: 'margin-top:0' }, 'Resumo organizado'), h('p', { class: 'muted peq' }, 'Vira uma nota no editor de notas do tópico (a nota que já existe é mantida; o resumo entra no fim).'), pre,
        h('button', { class: 'btn p', type: 'button', 'data-salvar-resumo': '1', disabled: semTopico() ? true : null, onclick: async (ev) => { ev.currentTarget.disabled = true; let n = 0; for (const g of grupos()) { if (!g.topico) continue; g.topico.notaHtml = (g.topico.notaHtml || '') + html(g); await op.salvarTopico(g.topico); n++; } op.toast('Resumo salvo como nota em ' + n + (n === 1 ? ' tópico.' : ' tópicos.')); if (op.aoGravar) op.aoGravar(); } }, 'Salvar como nota do tópico')));
      // ---- cartas
      const cs = cartas(); if (!est.marcadas || est.marcadas.length !== cs.length) est.marcadas = cs.map(() => true);
      const lista = h('div', { class: 'pilha', style: 'max-height:300px;overflow:auto' }); cs.forEach((c, i) => lista.append(h('label', { class: 'afundado marca-op', 'data-carta-previa': '1' }, h('input', { type: 'checkbox', checked: est.marcadas[i], 'aria-label': 'Incluir a carta ' + (i + 1), onchange: (e) => { est.marcadas[i] = e.target.checked; conta(); } }), h('div', { style: 'min-width:0;overflow-wrap:anywhere' }, h('div', {}, h('span', { class: 'chip ' + (c.tipo === 'lacuna' ? 'azul' : '') }, c.tipo === 'lacuna' ? 'lacuna' : 'básica'), ' ', h('b', {}, c.frente)), h('div', { class: 'muted peq' }, c.verso), h('div', { class: 'muted peq' }, (c.significado ? c.significado : '') + (c.topico ? ' · ' + c.topico.titulo : ''))))));
      const botCartas = h('button', { class: 'btn p', type: 'button', 'data-salvar-cartas': '1', onclick: async (ev) => { ev.currentTarget.disabled = true; let n = 0; const agora = Date.now(); for (let i = 0; i < cs.length; i++) { if (!est.marcadas[i]) continue; const c = cs[i]; const tid = c.topicoId || est.padrao; if (!tid) continue; await op.salvarCartao({ id: L.uid('c'), concursoId: op.concursoId, topicoId: tid, tipo: 'basico', frente: c.frente, verso: c.verso, tags: c.tags || [], lacuna: c.lacuna || null, origem: c.origem === 'marcacao-ia' ? 'marcacao-ia' : 'marcacao', criado: agora + n }); n++; } op.toast(n + (n === 1 ? ' carta criada.' : ' cartas criadas.')); if (op.aoGravar) op.aoGravar(); } }, 'Criar cartas');
      const conta = () => { const n = est.marcadas.filter(Boolean).length; botCartas.textContent = 'Criar ' + n + (n === 1 ? ' carta' : ' cartas'); botCartas.disabled = !n || semTopico(); }; conta();
      raizEl.append(h('div', { class: 'cartao', style: 'margin:0' }, h('h3', { style: 'margin-top:0' }, 'Dora Cartas (' + cs.length + ')'), h('p', { class: 'muted peq' }, 'Lacuna: a palavra-chave do trecho grifado fica escondida. Básica: a sua anotação vira a pergunta e o trecho, a resposta. Cartas que você já tem ficam de fora.'),
        cs.length ? h('div', { class: 'linha', style: 'margin-bottom:8px' }, h('button', { class: 'btn mini', type: 'button', onclick: () => { est.marcadas = cs.map(() => true); pinta(); } }, 'Marcar todas'), h('button', { class: 'btn mini', type: 'button', onclick: () => { est.marcadas = cs.map(() => false); pinta(); } }, 'Desmarcar todas')) : null, cs.length ? lista : h('div', { class: 'vazio' }, 'Nenhuma carta nova: os trechos são curtos demais ou as cartas já existem.'), h('div', { style: 'margin-top:8px' }, botCartas)));
      // ---- mapa
      const nos = gs.reduce((a, g, i) => a + mapa(g, i).nos.length, 0);
      raizEl.append(h('div', { class: 'cartao', style: 'margin:0' }, h('h3', { style: 'margin-top:0' }, 'Mapa mental'), h('p', { class: 'muted peq' }, 'Raiz = ' + (op.titulo || 'o tópico') + ', ramos = ' + (est.organizar === 'cor' ? 'significados (cores)' : 'páginas') + ', folhas = os grifos. Se o tópico já tem mapa, o novo entra como um ramo a mais. Dá para editar depois (' + nos + ' nós).'),
        h('div', { class: 'linha' }, h('button', { class: 'btn p', type: 'button', 'data-salvar-mapa': '1', disabled: semTopico() ? true : null, onclick: async (ev) => { ev.currentTarget.disabled = true; let n = 0, ultimo = null; for (const [i, g] of grupos().entries()) { if (!g.topico) continue; g.topico.mapa = L5.mesclarMapa(g.topico.mapa, mapa(g, i)); await op.salvarTopico(g.topico); n++; ultimo = g.topico.id; } op.toast('Mapa mental criado em ' + n + (n === 1 ? ' tópico.' : ' tópicos.')); if (op.aoGravar) op.aoGravar(); if (ultimo && op.irMapa) op.irMapa(ultimo); } }, 'Criar mapa mental'))));
    }
    async function melhorar(btn) {
      const rot = btn.textContent; const gs = grupos().filter(g => g.marcas.length).slice(0, 4); op.rodando(btn, 'Pensando...'); let i = 0;
      try { for (const g of gs) { i++; op.rodando(btn, 'Pensando... (' + i + ' de ' + gs.length + ')'); const r = await op.ia.chamar({ sistema: 'Você é um professor experiente em concursos públicos brasileiros. Responda sempre em português do Brasil, simples e direto. Responda SOMENTE o JSON.', prompt: L5.promptMelhorar({ marcas: g.marcas, titulo: g.titulo, significados: sig }), json: true }); const m = L5.lerMelhoria(L.extrairJSON(r.texto)); if (!m) throw new Error('A IA respondeu em um formato que não consegui ler. Tente de novo.'); est.melhoria[g.topicoId || ''] = m; }
        est.marcadas = null; op.toast('Pronto: resumo, perguntas e mapa refinados pela IA. Confira antes de gravar.'); }
      catch (er) { op.toast(er.message, true); }
      pinta();
    }
    pinta(); return raizEl;
  }
  raiz.DoraTransformar = { montar };
})(typeof self !== 'undefined' ? self : this);
