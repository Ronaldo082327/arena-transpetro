/* Telas: Estudar (sessões de cartões) e Diário de Batalha. */
(function () {
  const App = window.App, { L, h, DB } = App, V = App.views;
  const embaralha = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const achar = (refTipo, id) => (refTipo === 'cartao' ? App.S.cartoes : App.S.questoes).find(x => x.id === id);

  // cartão de frente e verso: registra pelo SM-2 e pelo diário
  App.registrarBasico = async (c, resp) => {
    const hoje = App.hoje(); const correta = resp !== 'errei'; const conf = resp === 'dificil' ? 'duvida' : 'certeza';
    await App.salvar('respostas', { id: L.uid('r'), concursoId: App.S.conc.id, topicoId: c.topicoId || null, refTipo: 'cartao', refId: c.id, ts: Date.now(), dia: hoje, correta, confianca: conf, ms: 0, escolha: resp });
    const antes = App.S.erros; const res = L.atualizarDiario(antes, { id: L.uid('er'), refTipo: 'cartao', refId: c.id, topicoId: c.topicoId || null, concursoId: App.S.conc.id, resumo: String(c.frente || '').slice(0, 140) }, { correta, confianca: conf }, hoje); App.S.erros = res.entradas; for (const e of res.entradas) if (!antes.includes(e)) await DB.put('erros', e);
    const novo = L.sm2(c, resp, hoje); await App.salvar('cartoes', novo); if (c.topicoId) await App.marcarEstudo(c.topicoId); return { correta, item: novo, evento: res.evento };
  };
  // um item (cartão básico, Dora Carta ou questão do banco) com tudo o que ele pede
  App.executarItem = (item, refTipo, o = {}) => {
    if (refTipo === 'cartao' && item.tipo === 'basico') {
      const raiz = h('div', { class: 'pilha' }); const verso = h('div', { class: 'oculto' }); const resp = h('div', { class: 'oculto' });
      const mostrar = h('button', { class: 'btn p', onclick: () => { mostrar.classList.add('oculto'); verso.classList.remove('oculto'); resp.classList.remove('oculto'); } }, 'Mostrar o verso');
      verso.append(h('div', { class: 'verso' }, item.verso || '(sem verso)'), item.fonte ? h('div', { class: 'muted peq' }, 'Fonte: ' + item.fonte) : null);
      resp.append(h('div', { class: 'rotulo', style: 'margin-bottom:6px' }, 'Como foi?'), h('div', { class: 'linha' }, [['errei', 'Errei'], ['dificil', 'Difícil'], ['bom', 'Bom'], ['facil', 'Fácil']].map(([k, n]) => h('button', { class: 'btn' + (k === 'bom' ? ' p' : ''), onclick: async () => { const r = await App.registrarBasico(item, k); if (o.aoConcluir) o.aoConcluir(r); } }, n))));
      raiz.append(h('div', { class: 'rotulo' }, o.titulo || 'Cartão'), h('div', { class: 'q-enunciado' }, item.frente), mostrar, verso, resp, h('div', { class: 'linha' }, h('button', { class: 'btn mini', onclick: () => App.abrirRascunho(item, 'cartoes') }, 'Dora Rascunho'), h('button', { class: 'btn mini', onclick: () => App.editarCartao(item, item.topicoId, (c) => { Object.assign(item, c); }) }, 'Editar')));
      return raiz;
    }
    let res = null;
    return App.renderQuestao(item, { titulo: o.titulo || (refTipo === 'cartao' ? 'Dora Carta' : 'Questão'), rascunhoLoja: refTipo === 'cartao' ? 'cartoes' : null, rotuloContinuar: o.rotuloContinuar,
      aoResponder: async (r) => { res = await App.registrarResposta({ refTipo, item, escolha: r.escolha, confianca: r.confianca, ms: r.ms }); }, aoContinuar: () => o.aoConcluir && o.aoConcluir(res) });
  };
  App.abrirItem = (refTipo, id, aoFim) => { const it = achar(refTipo, id); if (!it) { App.toast('Esse item não existe mais.', true); return; } const m = App.modal('Rever', h('div'), { larga: true, aoFechar: aoFim }); const corpo = m.el.lastChild; corpo.replaceChildren(App.executarItem(it, refTipo, { rotuloContinuar: 'Concluir', aoConcluir: () => m.fechar() })); };

  // ---------- Estudar ----------
  function montarSessao(modo, q) {
    const hoje = App.hoje(); const pr = {}; App.prioridades().forEach(p => pr[p.topicoId] = p.prioridade); let itens = [];
    const cartao = (c) => ({ refTipo: 'cartao', item: c }); const questao = (c) => ({ refTipo: 'questao', item: c });
    if (modo === 'dia') itens = App.cartoesDevidos().sort((a, b) => (pr[b.topicoId] || 0) - (pr[a.topicoId] || 0) || (a.prox || '') .localeCompare(b.prox || '')).slice(0, 40).map(cartao);
    else if (modo === 'topico') { const cs = App.S.cartoes.filter(c => c.topicoId === q.t); const dev = cs.filter(c => L.cartaoDevido(c, hoje)); itens = (dev.length ? dev : cs).map(cartao); }
    else if (modo === 'erros') { let es = App.errosAtivos(); const dev = es.filter(e => e.proxCheque <= hoje); es = dev.length ? dev : es; itens = es.map(e => { const it = achar(e.refTipo, e.refId); return it ? { refTipo: e.refTipo, item: it } : null; }).filter(Boolean); }
    else if (modo === 'relampago') itens = embaralha(App.S.cartoes.filter(c => c.tipo === 'questao' && c.gabarito).map(cartao).concat(App.S.questoes.filter(x => x.gabarito && x.alternativas.length).map(questao))).slice(0, 10);
    return itens;
  }
  V.estudar = async (alvo, r) => {
    if (!App.exigeEdital(alvo)) return; const modo = r.query.modo; alvo.append(h('h1', {}, 'Estudar'));
    if (!modo) {
      const dev = App.cartoesDevidos().length, erros = App.errosAtivos().length, nq = App.S.cartoes.filter(c => c.tipo === 'questao' && c.gabarito).length + App.S.questoes.filter(x => x.gabarito).length;
      const op = (ico, tit, desc, href, n, p) => h('a', { class: 'cartao' + (p ? ' destaque' : ''), href, style: 'text-decoration:none;color:inherit;margin:0;display:grid;gap:8px' }, h('div', { class: 'linha' }, App.tile(ico), h('div', {}, h('h3', { style: 'margin:0' }, tit), h('span', { class: 'chip' }, n))), h('div', { class: 'muted' }, desc));
      const tops = h('div', { class: 'cartao', style: 'margin:0' }, h('h3', {}, 'Por tópico'), h('p', { class: 'muted' }, 'Estude os cartões de um tópico só.'), App.selTopico(null, (v) => { if (v) App.ir('estudar?modo=topico&t=' + v); }, true, 'Escolha um tópico'));
      alvo.append(h('div', { class: 'grade' }, op('estudar', 'Do dia', 'Cartões para hoje, dos tópicos mais prioritários (peso × fraqueza × urgência).', '#/estudar?modo=dia', dev + ' para hoje', true), tops, op('erros', 'Só erros', 'Refaz o que está no diário de erros.', '#/estudar?modo=erros', erros + ' no diário'), op('simulados', 'Simulado relâmpago', '10 questões, 10 minutos, sem ver o gabarito até o fim.', '#/estudar?modo=relampago', nq + ' questões')));
      if (!App.S.cartoes.length) alvo.append(h('div', { class: 'aviso-caixa info', style: 'margin-top:14px' }, 'Você ainda não tem cartões. Crie na aba Cartões de um tópico, importe questões em Questões ou use a extensão para capturar do navegador.'));
      return;
    }
    let itens = montarSessao(modo, { t: r.query.t }); const titulos = { dia: 'Sessão do dia', topico: 'Sessão do tópico: ' + App.nomeTopico(r.query.t), erros: 'Só erros', relampago: 'Simulado relâmpago' };
    const topo = h('div', { class: 'linha entre', style: 'margin-bottom:10px' }, h('h2', { style: 'margin:0' }, titulos[modo]), h('a', { class: 'btn mini', href: '#/estudar' }, 'Sair da sessão'));
    if (!itens.length) { alvo.append(topo, h('div', { class: 'cartao vazio' }, h('h3', {}, modo === 'dia' ? 'Nada para revisar hoje.' : 'Não há itens para esta sessão.'), h('p', {}, 'Crie cartões, importe questões ou volte amanhã.'), h('a', { class: 'btn p', href: '#/estudar' }, 'Voltar'))); return; }
    const palco = h('div', { class: 'cartao' }); const prog = h('div', { class: 'barra' }, h('i', { style: 'width:0%' })); const cont = h('div', { class: 'muted peq' }); alvo.append(topo, prog, cont, palco);
    let i = 0; const feitos = []; let relogio = null; let acabou = false;
    if (modo === 'relampago') { let resta = 600; const rel = h('div', { class: 'chip aviso' }, '10:00'); topo.insertBefore(rel, topo.lastChild); relogio = setInterval(() => { resta--; rel.textContent = String(Math.floor(resta / 60)).padStart(2, '0') + ':' + String(resta % 60).padStart(2, '0'); if (resta <= 0) { clearInterval(relogio); fim(); } }, 1000); App.aoSair(() => clearInterval(relogio)); }
    const fim = async () => {
      if (acabou) return; acabou = true; clearInterval(relogio); prog.firstChild.style.width = '100%'; cont.textContent = '';
      if (modo === 'relampago') { for (const f of feitos) { f.res = await App.registrarResposta({ refTipo: f.refTipo, item: f.item, escolha: f.escolha, confianca: null, ms: f.ms }); } }
      const ok = modo === 'relampago' ? feitos.filter(f => f.res.correta).length : feitos.filter(f => f.res && f.res.correta).length; const pct = feitos.length ? Math.round(100 * ok / feitos.length) : 0;
      palco.replaceChildren(h('h2', {}, 'Sessão concluída'), h('div', { class: 'numgrande' }, pct + '%'), h('p', {}, ok + ' de ' + feitos.length + ' certos.'), modo === 'relampago' ? h('div', { class: 'pilha' }, feitos.filter(f => !f.res.correta).map(f => h('div', { class: 'afundado' }, h('div', { class: 'peq muted' }, 'Você marcou ' + f.escolha + ' · gabarito ' + f.item.gabarito), h('div', {}, f.item.enunciado.slice(0, 200)), (f.item.explicacao || f.item.comentario) ? h('div', { class: 'muted peq' }, f.item.explicacao || f.item.comentario) : null))) : null, h('div', { class: 'linha', style: 'margin-top:10px' }, h('a', { class: 'btn p', href: '#/estudar' }, 'Voltar'), h('a', { class: 'btn', href: '#/erros' }, 'Ver diário de erros')));
    };
    const mostra = () => {
      if (i >= itens.length) { fim(); return; } const { refTipo, item } = itens[i]; prog.firstChild.style.width = Math.round(100 * i / itens.length) + '%'; cont.textContent = 'Item ' + (i + 1) + ' de ' + itens.length + (item.topicoId ? ' · ' + App.nomeTopico(item.topicoId) : '');
      const prox = (res) => { if (modo !== 'relampago') feitos.push({ res, item }); i++; mostra(); };
      if (modo === 'relampago') {
        palco.replaceChildren(App.renderQuestao(item, { titulo: 'Questão ' + (i + 1), semConfianca: true, semGabarito: true, rotuloContinuar: i + 1 >= itens.length ? 'Terminar' : 'Próxima', aoResponder: async (r) => { feitos.push({ refTipo, item, escolha: r.escolha, ms: r.ms }); setTimeout(() => { i++; mostra(); }, 150); } }));
      } else palco.replaceChildren(App.executarItem(item, refTipo, { rotuloContinuar: i + 1 >= itens.length ? 'Terminar' : 'Próximo', aoConcluir: prox }));
    };
    mostra();
  };

  // ---------- Diário de Batalha ----------
  V.erros = async (alvo, r) => {
    if (!App.exigeConcurso(alvo)) return; alvo.append(h('h1', {}, 'Diário de Batalha'));
    const hoje = App.hoje(); const ativos = App.errosAtivos(); const resolvidos = App.S.erros.filter(e => e.resolvido);
    const cont = (f) => ativos.filter(f).length; const MOT = { erro: 'Errei', duvida: 'Acertei com dúvida', chute: 'Acertei no chute', lento: 'Acertei, mas lento' };
    alvo.append(h('div', { class: 'cartao destaque' }, h('p', { style: 'margin:0 0 10px' }, 'Entram aqui, sozinhos: erros, acertos com dúvida ou chute e acertos lentos. Um item sai depois de 2 acertos com certeza (o primeiro 2 dias depois, o segundo 7 dias depois).'), h('div', { class: 'grade', style: 'grid-template-columns:repeat(auto-fit,minmax(130px,1fr))' }, Object.keys(MOT).map(k => h('div', { class: 'afundado centro' }, h('div', { class: 'numgrande' }, String(cont(e => e.motivo === k))), h('div', { class: 'muted peq' }, MOT[k])))), h('div', { class: 'linha', style: 'margin-top:12px' }, h('span', { class: 'chip aviso' }, cont(e => e.proxCheque <= hoje) + ' para rever hoje'), h('span', { class: 'chip ok' }, resolvidos.length + ' já superados'), ativos.length ? h('a', { class: 'btn mini p', href: '#/estudar?modo=erros' }, 'Refazer erros agora') : null, ativos.length ? h('button', { class: 'btn mini', onclick: resumoIA }, 'Resumo com a IA') : null)));
    const tipos = Object.keys(L.TIPOS_ERRO); const porTipo = tipos.map(k => [k, ativos.filter(e => e.tipoErro === k).length]);
    const porTop = {}; ativos.forEach(e => { if (e.topicoId) porTop[e.topicoId] = (porTop[e.topicoId] || 0) + 1; }); const top = Object.entries(porTop).sort((a, b) => b[1] - a[1]).slice(0, 5);
    alvo.append(h('div', { class: 'grade2' }, h('div', { class: 'cartao' }, h('h3', {}, 'Por tipo de erro'), h('p', { class: 'muted peq' }, 'Classifique cada erro abaixo. O tipo mostra o que treinar: matéria, reconhecimento, execução ou leitura.'), porTipo.map(([k, n]) => h('div', { class: 'linha entre', style: 'margin-bottom:6px' }, h('span', {}, L.TIPOS_ERRO[k]), h('span', { class: 'chip' }, String(n)))), h('div', { class: 'linha entre' }, h('span', { class: 'muted' }, 'Sem classificação'), h('span', { class: 'chip' }, String(ativos.filter(e => !e.tipoErro).length)))), h('div', { class: 'cartao' }, h('h3', {}, 'Tópicos com mais erros'), top.length ? top.map(([id, n]) => h('div', { class: 'linha entre', style: 'margin-bottom:6px' }, h('a', { href: '#/topico/' + id }, App.nomeTopico(id)), h('span', { class: 'chip ruim' }, String(n)))) : h('div', { class: 'vazio' }, 'Sem erros no diário.'))));
    let filtro = 'ativos'; const lista = h('div', { class: 'pilha' }); const seg = h('div', { class: 'seg' });
    const desenha = () => {
      [...seg.children].forEach(b => b.setAttribute('aria-pressed', String(b.dataset.k === filtro))); lista.replaceChildren(); const es = (filtro === 'ativos' ? ativos : resolvidos).slice().sort((a, b) => (a.proxCheque || '').localeCompare(b.proxCheque || ''));
      if (!es.length) lista.append(h('div', { class: 'vazio' }, filtro === 'ativos' ? 'Diário vazio. Resolva questões e cartões e os erros aparecem aqui.' : 'Nada superado ainda.'));
      es.forEach(e => { const it = achar(e.refTipo, e.refId);
        const sel = h('select', { 'aria-label': 'Tipo de erro', onchange: async (ev) => { e.tipoErro = ev.target.value; await DB.put('erros', e); App.render(); } }, [h('option', { value: '' }, '(tipo de erro?)')].concat(tipos.map(k => h('option', Object.assign({ value: k }, e.tipoErro === k ? { selected: true } : {}), L.TIPOS_ERRO[k]))));
        lista.append(h('div', { class: 'cartao', style: 'margin:0' }, h('div', { class: 'meta linha', style: 'margin-bottom:6px' }, h('span', { class: 'chip ' + (e.motivo === 'erro' ? 'ruim' : 'aviso') }, MOT[e.motivo] || e.motivo), e.topicoId ? h('a', { class: 'chip azul', href: '#/topico/' + e.topicoId, style: 'text-decoration:none' }, App.nomeTopico(e.topicoId)) : null, h('span', { class: 'muted peq' }, e.resolvido ? 'superado em ' + App.fmtData(e.resolvidoEm) : e.acertosSeg + '/2 acertos com certeza · rever em ' + App.fmtData(e.proxCheque)), (e.vezes || 1) > 1 ? h('span', { class: 'chip ruim' }, 'repetiu ' + e.vezes + 'x') : null), h('div', { style: 'margin-bottom:8px' }, it ? (it.enunciado || it.frente || '').slice(0, 220) : (e.resumo || '(item apagado)')), h('div', { class: 'linha' }, !e.resolvido ? sel : null, it && !e.resolvido ? h('button', { class: 'btn mini p', onclick: () => App.abrirItem(e.refTipo, e.refId, () => App.render()) }, 'Rever agora') : null, h('button', { class: 'btn mini', onclick: async () => { await DB.del('erros', e.id); App.S.erros = App.S.erros.filter(x => x.id !== e.id); App.render(); } }, 'Tirar do diário'))));
      });
    };
    [['ativos', 'No diário (' + ativos.length + ')'], ['resolvidos', 'Superados (' + resolvidos.length + ')']].forEach(([k, n]) => seg.append(h('button', { type: 'button', 'data-k': k, onclick: () => { filtro = k; desenha(); } }, n))); alvo.append(h('div', { style: 'margin:14px 0 10px' }, seg), lista); desenha();
    async function resumoIA(ev) {
      if (!App.ia.temChave('gemini') && !App.ia.temChave('claude')) { App.toast('Cole a chave da IA na tela Dora Mentora primeiro.', true); App.ir('ia'); return; } ev.target.disabled = true; ev.target.textContent = 'Pensando...';
      try { const rr = await App.ia.tarefas.resumoDiario(ativos.map(e => ({ topico: App.nomeTopico(e.topicoId), motivo: e.motivo, tipoErro: e.tipoErro ? L.TIPOS_ERRO[e.tipoErro] : '', resumo: e.resumo }))); const d = rr.dados; App.modal('Resumo do diário e o que treinar amanhã', h('div', { class: 'pilha' }, h('p', {}, d.resumo || ''), h('h3', {}, 'Treinar amanhã'), h('ul', {}, (d.treinarAmanha || []).map(x => h('li', {}, String(x)))), h('p', { class: 'muted peq' }, 'Modelo: ' + rr.modelo + '. A IA pode errar: use como sugestão.'))); } catch (e) { App.toast(e.message, true); }
      ev.target.disabled = false; ev.target.textContent = 'Resumo com a IA';
    }
  };
})();
