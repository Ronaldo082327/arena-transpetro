/* Dora Draw — telas e ligações da terceira leva (a lógica pura está em logica3.js e é testada em testes\logica3.test.js):
   revisão espaçada (FSRS e modos por concurso), Anki em TSV, Estudo reverso, Edital por PDF, tela Hoje.
   Embrulha views que já existem (revisões, ajustes, edital, início, erros) chamando a original primeiro. */
(function () {
  const App = window.App, { L, h, DB } = App, V = App.views, L3 = window.DoraLogica3, G = window.DoraLogica2;
  const ls = (k, p) => { try { const v = localStorage.getItem(k); return v == null ? p : JSON.parse(v); } catch (e) { return p; } };

  // ---------- revisão espaçada: o algoritmo e o modo vêm do concurso aberto ----------
  App.configRevisao = () => L3.configRevisao(App.S.conc);
  App.agendar = (c, resp, hoje) => L3.agendarCartao(c, resp, hoje || App.hoje(), App.S.conc, App.provaData());
  // modo "Do meu jeito": o aluno escolhe o próximo intervalo; nos outros modos devolve o cartão como está
  App.confirmarIntervalo = (c, resp, hoje, o = {}) => {
    if (App.configRevisao().modo !== 'meu' || o.lote) return Promise.resolve(c);
    return new Promise(res => {
      let saida = c; const op = L3.opcoesDoMeuJeito(c.int); const outro = h('input', { type: 'number', min: 1, max: 365, placeholder: 'outro (dias)', style: 'width:120px', 'aria-label': 'Outro intervalo em dias' });
      const m = App.modal('Quando rever este cartão?', h('div', { class: 'pilha' }, h('p', { class: 'muted peq', style: 'margin:0' }, 'O app sugere ' + c.int + (c.int === 1 ? ' dia' : ' dias') + '. Escolha o seu.'),
        h('div', { class: 'linha' }, op.map(x => h('button', { class: 'btn' + (x.sugerido ? ' p' : ''), type: 'button', 'data-dias': x.dias, onclick: () => { saida = L3.intervaloEscolhido(c, x.dias, hoje); m.fechar(); } }, x.dias + (x.dias === 1 ? ' dia' : ' dias') + (x.sugerido ? ' (sugerido)' : '')))),
        h('div', { class: 'linha' }, outro, h('button', { class: 'btn', type: 'button', onclick: () => { if (+outro.value >= 1) { saida = L3.intervaloEscolhido(c, +outro.value, hoje); m.fechar(); } } }, 'Usar este'))), { aoFechar: () => res(saida) });
    });
  };

  const revOrig = V.revisoes;
  V.revisoes = async (alvo, r) => {
    await revOrig(alvo, r); if (!App.S.conc) return; const c = App.S.conc; const cfg = App.configRevisao();
    const sel = (rot, opcoes, valor, aoMudar) => h('label', { class: 'campo' }, h('span', {}, rot), h('select', { onchange: (e) => aoMudar(e.target.value) }, opcoes.map(([k, n]) => h('option', Object.assign({ value: k }, String(valor) === String(k) ? { selected: true } : {}), n))));
    const grava = async (campo, valor) => { c.revisao = Object.assign({}, c.revisao || {}, { [campo]: valor }); await App.salvar('concursos', c); App.render(); };
    const fixos = h('input', { type: 'text', value: cfg.fixos.join(', '), 'aria-label': 'Dias fixos', style: 'max-width:200px', onchange: (e) => grava('fixos', e.target.value.split(/[,;\s]+/).filter(Boolean)) });
    const textos = { auto: 'O app calcula sozinho o dia de cada cartão (pelo algoritmo escolhido) e a revisão do tópico segue o score dele.', meu: 'O app sugere e você escolhe o próximo intervalo ao responder cada cartão.', fixos: 'Cada acerto leva o cartão ao próximo dia da lista abaixo (a mesma lista usada ao concluir um tópico).' };
    alvo.append(h('div', { class: 'cartao', 'data-config-revisao': '1' }, h('h2', {}, 'Revisão espaçada deste concurso'), h('p', { class: 'muted peq' }, textos[cfg.modo] + ' Vale só para "' + c.nome + '".'),
      h('div', { class: 'grade', style: 'grid-template-columns:repeat(auto-fit,minmax(170px,1fr))' }, sel('Modo', L3.MODOS, cfg.modo, (v) => grava('modo', v)), sel('Algoritmo', [['sm2', 'SM-2 (clássico)'], ['fsrs', 'FSRS (mais preciso)']], cfg.algoritmo, (v) => grava('algoritmo', v)),
        cfg.algoritmo === 'fsrs' && cfg.modo !== 'fixos' ? sel('Quanto quero lembrar', [[0.8, '80% (menos revisões)'], [0.9, '90% (padrão)'], [0.95, '95% (mais revisões)']], cfg.retencao, (v) => grava('retencao', +v)) : null,
        cfg.modo === 'fixos' ? h('label', { class: 'campo' }, h('span', {}, 'Dias (separe por vírgula)'), fixos) : null),
      h('p', { class: 'muted peq', style: 'margin-bottom:0' }, 'FSRS usa os parâmetros padrão públicos; cartões antigos entram nele sem perder o ritmo.')));
  };

  // ---------- Anki: cartões em texto TSV ----------
  const baixa = (nome, texto, tipo) => App.baixar(nome, new Blob(['﻿' + texto], { type: tipo }), tipo);
  App.exportarTSV = () => { const tsv = L3.cartoesParaTSV(App.S.cartoes, { topicos: App.S.topicos, disciplinas: App.S.disciplinas }); const n = tsv.split('\n').length - 4; baixa('dora-cartoes-' + (App.S.conc.nome || 'concurso').replace(/[^\w]+/g, '-').toLowerCase() + '.tsv', tsv, 'text/tab-separated-values;charset=utf-8'); return n; };
  App.importarTSV = async (texto) => {
    const r = L3.tsvParaCartoes(texto); if (!r.cartoes.length) { App.toast('Não achei cartões nesse arquivo.', true); return; }
    let padrao = null; const jaTem = new Set(App.S.cartoes.map(c => L3.chaveCartao(c.frente))); const novos = r.cartoes.filter(c => !jaTem.has(L3.chaveCartao(c.frente))); const ligados = r.cartoes.filter(c => L3.topicoDaTag(c.tags, App.S.topicos, App.S.disciplinas)).length;
    const m = App.modal('Importar cartões (Anki)', h('div', { class: 'pilha' }, h('p', {}, h('b', {}, r.cartoes.length + ' cartões'), ' lidos' + (r.ignoradas ? ' (' + r.ignoradas + ' linhas sem frente foram ignoradas)' : '') + '. ' + (r.cartoes.length - novos.length) + ' já existem e serão pulados. ' + ligados + ' foram ligados a tópicos pelas etiquetas.'),
      h('div', { class: 'afundado peq' }, r.cartoes.slice(0, 3).map(c => h('div', {}, h('b', {}, c.frente.slice(0, 80)), ' → ' + c.verso.slice(0, 80)))), h('label', { class: 'campo' }, h('span', {}, 'Tópico para os cartões sem etiqueta conhecida'), App.selTopico(null, (v) => padrao = v)),
      h('button', { class: 'btn p', 'data-importar': '1', onclick: async () => { let n = 0; const agora = Date.now(); for (const c of novos) { const topicoId = L3.topicoDaTag(c.tags, App.S.topicos, App.S.disciplinas) || padrao || null; await App.salvar('cartoes', { id: L.uid('c'), concursoId: App.S.conc.id, topicoId, tipo: 'basico', frente: c.frente, verso: c.verso, origem: 'anki', criado: agora + n }); n++; } m.fechar(); App.toast(n + ' cartões importados.'); App.render(); } }, 'Importar ' + novos.length + ' cartões')));
  };
  const ajOrig = V.ajustes;
  V.ajustes = async (alvo, r) => {
    await ajOrig(alvo, r); if (!App.S.conc) return;
    const arq = h('input', { type: 'file', accept: '.tsv,.txt,.csv,text/plain,text/tab-separated-values', class: 'oculto', 'aria-label': 'Escolher arquivo de cartões', onchange: async (e) => { const f = e.target.files[0]; if (f) await App.importarTSV(await f.text()); e.target.value = ''; } });
    alvo.append(h('div', { class: 'cartao', 'data-anki': '1' }, h('h2', {}, 'Cartões para o Anki (texto TSV)'), h('p', { class: 'muted peq' }, 'Exporta os cartões deste concurso em texto com tabulação (frente, verso, etiquetas), que o Anki importa em Arquivo > Importar. Também lê arquivos de texto exportados pelo Anki. Não é .apkg: esse é um pacote compactado de banco de dados e mídia; o texto é simples, aberto e funciona nas duas direções.'),
      h('div', { class: 'linha' }, h('button', { class: 'btn', type: 'button', onclick: () => { const n = App.exportarTSV(); App.toast(n + ' cartões exportados.'); } }, 'Exportar cartões (.tsv)'), h('button', { class: 'btn', type: 'button', onclick: () => arq.click() }, 'Importar cartões (.tsv / .txt)'), arq)));
  };

  // ---------- Estudo reverso: o que rever depois de errar ----------
  // ids: lista de tópicos (um id por erro) ou lista de entradas do diário; abre a janela "O que rever"
  App.abrirEstudoReverso = async (fonte) => {
    const c = App.S.conc; const errados = L3.topicosErrados(fonte); if (!errados.length) { App.toast('Nenhum erro ligado a um tópico para rever.', true); return; }
    const grifos = []; for (const e of errados) grifos.push(...await DB.porIndice('grifos', 'topicoId', e.topicoId));
    let marcacoes = []; try { marcacoes = (await DB.porIndice('marcacoes', 'concursoId', c.id)).filter(x => x.topicoId); } catch (e) { /* sem a loja */ }
    const itens = L3.estudoReverso({ errados, topicos: App.S.topicos, disciplinas: App.S.disciplinas, grifos, materiais: App.S.materiais, cartoes: App.S.cartoes, marcacoes, erros: App.S.erros, hoje: App.hoje() });
    const corpo = h('div', { class: 'pilha', 'data-estudo-reverso': '1' }, h('p', { class: 'muted peq', style: 'margin:0' }, 'Os tópicos onde você mais errou, com tudo o que você já guardou sobre eles. Comece pelo primeiro.'));
    itens.forEach(t => corpo.append(h('div', { class: 'cartao', style: 'margin:0' }, h('div', { class: 'linha entre' }, h('a', { class: 'tit', href: '#/topico/' + t.topicoId, onclick: () => setTimeout(() => document.querySelectorAll('dialog[open]').forEach(d => d.close()), 0) }, t.titulo), h('span', { class: 'chip ruim' }, t.erros + (t.erros === 1 ? ' erro' : ' erros'))), h('div', { class: 'muted peq' }, t.disciplina),
      t.resumos.length ? h('ul', { class: 'peq' }, t.resumos.map(x => h('li', {}, x))) : null,
      t.nota ? h('div', { class: 'afundado peq' }, h('b', {}, 'Sua nota: '), t.nota) : null, t.comoBanca ? h('div', { class: 'peq' }, h('b', {}, 'Como a banca cobra: '), t.comoBanca) : null,
      t.grifos.length ? h('div', { class: 'peq' }, h('b', {}, 'Grifos (' + t.totalGrifos + '): '), t.grifos.map(g => h('div', {}, h('mark', {}, g.texto), g.material ? h('span', { class: 'muted' }, ' — ' + g.material + ', p. ' + g.pagina) : null))) : null,
      t.materiais.length ? h('div', { class: 'linha peq' }, h('b', {}, 'PDF: '), t.materiais.map(m => h('a', { class: 'chip azul', href: '#/leitor/' + m.id, onclick: () => setTimeout(() => document.querySelectorAll('dialog[open]').forEach(d => d.close()), 0) }, m.nome))) : null,
      t.marcacoes.length ? h('div', { class: 'peq' }, h('b', {}, 'Marcações: '), t.marcacoes.map(x => h('div', {}, x.texto))) : null,
      t.cartas.length ? h('div', { class: 'peq' }, h('b', {}, 'Dora Cartas (' + t.totalCartas + (t.cartasVencidas ? ', ' + t.cartasVencidas + ' para hoje' : '') + '): '), t.cartas.map(x => h('div', { class: 'muted' }, '• ' + x.texto))) : null,
      t.semMaterial ? h('div', { class: 'afundado peq' }, 'Você ainda não guardou nada deste tópico. Escreva uma nota, grife um PDF ou crie cartas a partir dos erros.') : null,
      h('div', { class: 'linha', style: 'margin-top:8px' }, t.totalCartas ? h('a', { class: 'btn mini p', href: '#/estudar?modo=topico&t=' + t.topicoId, onclick: () => setTimeout(() => document.querySelectorAll('dialog[open]').forEach(d => d.close()), 0) }, 'Estudar as cartas') : null, h('a', { class: 'btn mini', href: '#/topico/' + t.topicoId + '?aba=notas', onclick: () => setTimeout(() => document.querySelectorAll('dialog[open]').forEach(d => d.close()), 0) }, 'Abrir o tópico')))));
    if (!itens.length) corpo.append(h('div', { class: 'vazio' }, 'Os tópicos dos erros não existem mais neste concurso.'));
    App.modal('O que rever', corpo, { larga: true });
  };
  const errosOrig = V.erros;
  V.erros = async (alvo, r) => {
    await errosOrig(alvo, r); if (!App.S.conc || !App.errosAtivos().length) return;
    const bt = h('button', { class: 'btn p', type: 'button', 'data-estudo-reverso-btn': '1', onclick: () => App.abrirEstudoReverso(App.errosAtivos()) }, 'O que rever (estudo reverso)');
    const h1 = alvo.querySelector('h1'); const caixa = h('div', { class: 'linha nao-imprime', style: 'margin-bottom:10px' }, bt, h('span', { class: 'muted peq' }, 'Mostra os tópicos que mais derrubam você e o que você já guardou sobre eles.')); if (h1) h1.after(caixa); else alvo.prepend(caixa);
  };

  // ---------- Edital por PDF ----------
  const edOrig = V.edital;
  V.edital = async (alvo, r) => {
    await edOrig(alvo, r); if (!App.S.conc) return;
    const status = h('div', { class: 'muted peq' }); const arq = h('input', { type: 'file', accept: 'application/pdf,.pdf', class: 'oculto', 'aria-label': 'Escolher PDF do edital', onchange: async (e) => { const f = e.target.files[0]; e.target.value = ''; if (f) await lerPdf(f); } });
    async function lerPdf(f) {
      try {
        status.textContent = 'Lendo "' + f.name + '"...'; const pdfjs = await App.carregarPdfJs(); const doc = await pdfjs.getDocument({ data: new Uint8Array(await f.arrayBuffer()) }).promise; const pags = [];
        for (let i = 1; i <= doc.numPages; i++) { const pg = await doc.getPage(i); const tc = await pg.getTextContent(); pags.push(L3.juntarItensPdf(tc.items)); status.textContent = 'Lendo página ' + i + ' de ' + doc.numPages + '...'; }
        await doc.destroy(); status.textContent = ''; previa(L3.prepararEditalDePdf(pags), f.name);
      } catch (er) { status.textContent = ''; App.toast('Não consegui ler esse PDF: ' + er.message, true); }
    }
    function previa(p, nome) {
      if (!p.texto.trim()) { App.toast('Esse PDF não tem texto (talvez seja só imagem escaneada; não há OCR).', true); return; }
      const ta = h('textarea', { style: 'min-height:260px', 'aria-label': 'Texto extraído do edital' }, p.texto); const info = h('div', { class: 'peq muted' });
      const conta = () => { const d = G.parseEditalVertical(ta.value).disciplinas; info.textContent = p.paginas + ' páginas lidas. ' + (p.recortado ? 'Achei o conteúdo programático e deixei só ele. ' : 'Não achei um trecho claro de conteúdo programático; usei o texto todo. ') + 'Pelo texto abaixo o app propõe ' + d.length + ' disciplinas e ' + d.reduce((a, x) => a + x.topicos.length, 0) + ' tópicos.'; };
      ta.addEventListener('input', conta); conta(); const ia = h('button', { class: 'btn', type: 'button', 'data-ia-edital': '1', onclick: async (ev) => { ev.target.disabled = true; ev.target.textContent = 'Organizando...'; try { const rr = await App.ia.tarefas.organizarEdital(ta.value); ta.value = rr.texto; conta(); App.toast('Texto organizado pela IA (' + rr.modelo + '). Confira antes de usar.'); } catch (er) { App.toast(er.message, true); } ev.target.disabled = false; ev.target.textContent = 'Organizar com a IA'; } }, 'Organizar com a IA');
      const m = App.modal('Prévia do edital em PDF — ' + nome, h('div', { class: 'pilha' }, info, ta, h('div', { class: 'linha' }, App.ia && App.ia.temIA() ? ia : h('span', { class: 'muted peq' }, 'Sem IA configurada: o texto vai como está.'), h('button', { class: 'btn p', type: 'button', 'data-usar-edital': '1', onclick: () => { const dest = alvo.querySelector('textarea'); if (dest) { dest.value = ta.value; dest.focus(); } m.fechar(); App.toast('Texto colocado na caixa do edital. Confira e toque em "Propor disciplinas e tópicos".'); } }, 'Usar este texto'))), { larga: true });
    }
    alvo.append(h('div', { class: 'cartao', 'data-edital-pdf': '1' }, h('h2', {}, 'Edital em PDF'), h('p', { class: 'muted peq' }, 'Escolha o PDF do edital. O texto é lido aqui mesmo (nada sai do computador), os cabeçalhos e rodapés são tirados e o conteúdo programático é separado. Você confere a prévia antes de qualquer coisa ser gravada.'), h('div', { class: 'linha' }, h('button', { class: 'btn', type: 'button', onclick: () => arq.click() }, 'Escolher PDF do edital'), arq), status));
  };

  // ---------- tela Hoje ----------
  App.dadosHoje = () => {
    const hoje = App.hoje(); const notas = App.mapaNotas(); const fila = App.prioridades().filter(p => { const t = App.topico(p.topicoId); return t && (!t.ultEstudo || (notas[t.id] != null && notas[t.id] < 70)); });
    const dias = L.planoSemanal({ prioridade: fila, hoje, minutosPorDia: ls('doraDraw.plano-min', [0, 90, 90, 90, 90, 90, 120]) }); const rev = App.revisoesPendentes ? App.revisoesPendentes().map(x => ({ topicoId: x.t.id, data: x.data })) : [];
    return L3.montarHoje({ hoje, plano: dias[0], revisoes: rev, cartoes: App.S.cartoes, erros: App.S.erros, topicos: App.S.topicos });
  };
  const bloco = (titulo, filhos, link, rotuloLink) => h('div', { class: 'cartao' }, h('div', { class: 'linha entre', style: 'margin-bottom:8px' }, h('h2', { style: 'margin:0' }, titulo), link ? h('a', { class: 'btn mini', href: link }, rotuloLink) : null), filhos);
  App.cartaoHoje = (d) => {
    const lista = (itens) => h('div', { class: 'arvore' }, itens);
    return h('div', { class: 'pilha', 'data-hoje': '1' },
      bloco('Plano do dia' + (d.minutosPlano ? ' (' + App.min(d.minutosPlano) + ')' : ''), d.blocos.length ? lista(d.blocos.map(b => h('a', { class: 'no-t', href: '#/foco?t=' + b.topicoId, style: 'text-decoration:none;color:inherit' }, h('div', { class: 'tit' }, b.titulo), h('span', { class: 'chip' }, b.minutos + ' min')))) : h('div', { class: 'vazio' }, 'Nada planejado para hoje. Ajuste seus dias na Dora Agenda.'), '#/agenda', 'Agenda'),
      bloco('Revisões (' + d.revisoes.length + ')', d.revisoes.length ? lista(d.revisoes.map(r => h('a', { class: 'no-t', href: '#/topico/' + r.topicoId, style: 'text-decoration:none;color:inherit' }, h('div', { class: 'tit' }, r.titulo), h('span', { class: 'chip ' + (r.atrasada ? 'ruim' : 'aviso') }, r.atrasada ? 'atrasada ' + r.dias + ' d' : 'hoje')))) : h('div', { class: 'vazio' }, App.vazioFig('sem-revisoes'), 'Nenhuma revisão para hoje.'), '#/revisoes', 'Revisões'),
      bloco('Cartas vencendo', h('div', {}, h('div', { class: 'linha' }, h('span', { class: 'chip ' + (d.cartas.vencidas ? 'ruim' : 'ok') }, d.cartas.vencidas + ' para hoje'), h('span', { class: 'chip azul' }, d.cartas.vencendo + ' nos próximos 2 dias')), d.cartas.porTopico.length ? lista(d.cartas.porTopico.map(t => h('div', { class: 'peq' }, t.titulo + ': ' + t.n))) : null, d.cartas.vencidas ? h('a', { class: 'btn p', style: 'margin-top:8px', href: '#/estudar?modo=dia' }, 'Estudar as cartas de hoje') : null), '#/estudar', 'Estudar'),
      bloco('Erros para rever (' + d.erros.total + ')', d.erros.total ? h('div', {}, lista(d.erros.topicos.map(e => h('div', { class: 'no-t' }, h('div', { style: 'min-width:0' }, h('div', { class: 'tit' }, e.titulo), e.resumo ? h('div', { class: 'peq muted' }, e.resumo) : null), h('span', { class: 'chip ruim' }, e.qtd)))), h('div', { class: 'linha', style: 'margin-top:8px' }, h('a', { class: 'btn mini p', href: '#/estudar?modo=erros' }, 'Refazer os erros'), h('button', { class: 'btn mini', type: 'button', onclick: () => App.abrirEstudoReverso(App.errosAtivos()) }, 'O que rever'))) : h('div', { class: 'vazio' }, App.vazioFig('sem-anotacoes'), 'Nenhum erro para rever hoje.'), '#/erros', 'Diário'));
  };
  V.hoje = async (alvo) => {
    if (!App.exigeEdital(alvo)) return; alvo.append(h('h1', {}, 'Hoje'), h('p', { class: 'muted' }, 'O que fazer agora: plano do dia, revisões, cartas vencendo e erros para rever.'), App.cartaoHoje(App.dadosHoje()));
  };
  const inicioOrig = V.inicio;
  V.inicio = async (alvo, r) => {
    await inicioOrig(alvo, r); if (!App.S.conc || !App.S.topicos.length || alvo.querySelector('[data-hoje-inicio]')) return;
    try { const d = App.dadosHoje(); const n = d.revisoes.length + d.cartas.vencidas + d.erros.total + d.blocos.length; const c = h('a', { class: 'cartao destaque', 'data-hoje-inicio': '1', href: '#/hoje', style: 'display:block;text-decoration:none;color:inherit' }, h('div', { class: 'linha entre' }, h('h2', { style: 'margin:0' }, 'Hoje'), h('span', { class: 'chip ' + (n ? 'aviso' : 'ok') }, n ? 'ver o que fazer' : 'tudo em dia')), h('div', { class: 'linha peq', style: 'margin-top:6px' }, h('span', { class: 'chip' }, d.blocos.length + ' no plano'), h('span', { class: 'chip' }, d.revisoes.length + ' revisões'), h('span', { class: 'chip' }, d.cartas.vencidas + ' cartas'), h('span', { class: 'chip' }, d.erros.total + ' erros')));
      const h1 = alvo.querySelector('h1'); if (h1) h1.after(c); else alvo.append(c); } catch (e) { console.warn('Hoje', e); }
  };
})();
