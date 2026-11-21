/* Telas novas: Dora Vertical, Raio-X da Banca, Rajada de 5, Tribunal das IAs, Dora Escriba e Replanejar (na Dora Agenda).
   A lógica pura fica em logica2.js (testada com node --test). */
(function () {
  const App = window.App, { L, h, DB } = App, V = App.views, G = window.DoraLogica2;
  const ls = (k, p) => { try { const v = localStorage.getItem(k); return v == null ? p : JSON.parse(v); } catch (e) { return p; } };
  const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* sem armazenamento */ } };
  const temIA = () => App.ia.temIA();
  const semIA = () => { App.toast('Cole a chave da IA na tela Dora Mentora primeiro.', true); App.ir('ia'); };
  const copiar = async (texto) => { try { await navigator.clipboard.writeText(texto); return true; } catch (e) { const ta = h('textarea', { style: 'position:fixed;opacity:0' }, texto); document.body.append(ta); ta.select(); let ok = false; try { ok = document.execCommand('copy'); } catch (er) { /* sem cópia */ } ta.remove(); return ok; } };
  const SVGNS = 'http://www.w3.org/2000/svg';
  const sv = (tag, at = {}, ...filhos) => { const e = document.createElementNS(SVGNS, tag); for (const k in at) e.setAttribute(k, at[k]); filhos.flat().forEach(f => e.append(f && f.nodeType ? f : document.createTextNode(f))); return e; };
  const corta = (s, n) => { s = String(s); return s.length > n ? s.slice(0, n - 1) + '…' : s; };
  // gráfico de barras horizontais simples em SVG (cores só por classe/token)
  App.barrasSVG = (itens, { sufixo = '', max = null, classe = 'rx-barra', rotulo = 'Gráfico de barras' } = {}) => {
    const w = 360, linha = 26, pad = 4, rotW = 128, valW = 50; const m = max || Math.max(1, ...itens.map(i => i.v)); const alt = itens.length * linha + pad * 2;
    const svg = sv('svg', { viewBox: '0 0 ' + w + ' ' + alt, class: 'rx-svg', role: 'img', 'aria-label': rotulo });
    itens.forEach((it, i) => { const y = pad + i * linha; const larg = Math.max(2, Math.round((w - rotW - valW) * it.v / m));
      svg.append(sv('text', { x: 0, y: y + 16, class: 'rx-rot' }, sv('title', {}, it.rot), corta(it.rot, 20)), sv('rect', { x: rotW, y: y + 4, width: larg, height: 14, rx: 4, class: classe + (it.cls ? ' ' + it.cls : '') }), sv('text', { x: rotW + larg + 6, y: y + 16, class: 'rx-val' }, it.v + sufixo)); });
    return svg;
  };
  const semDados = (txt) => h('div', { class: 'afundado muted peq' }, txt);

  // ===================================================================
  // 1. Dora Vertical (edital verticalizado) + parser com prévia
  // ===================================================================
  const FV = { discId: '', pendentes: false, fracos: false, ordem: 'edital', relMin: 1 };
  V.vertical = async (alvo) => {
    if (!App.exigeConcurso(alvo)) return; const c = App.S.conc; const hoje = App.hoje();
    alvo.append(h('h1', {}, 'Dora Vertical'), h('p', { class: 'muted nao-imprime' }, 'O seu edital em lista vertical: disciplina, tópico e subtópico, com as caixas de teoria, questões e revisões, a data e o % de acerto de cada linha.'));
    const tabelaBox = h('div'); const resumo = h('div', { class: 'linha', style: 'margin-bottom:8px' });
    const relDe = () => { const m = {}; App.S.topicos.forEach(t => { m[t.id] = t.relevancia || 3; }); return m; }; // relevância 1–5 do edital (ver Dora Edital)
    const linhasAtuais = () => window.DoraLogica4.ordenarVertical(G.montarVertical({ disciplinas: App.S.disciplinas, topicos: App.S.topicos, respostas: App.S.respostas, filtro: { discId: FV.discId, pendentes: FV.pendentes, fracos: FV.fracos } }), relDe(), { ordem: FV.ordem, relMin: FV.relMin });
    const nomes = { teoria: 'Teoria lida', questoes: 'Questões feitas', r1: 'Revisão 1', r2: 'Revisão 2', r3: 'Revisão 3' };
    const desenha = () => {
      const linhas = linhasAtuais(); const folhas = linhas.filter(l => l.folha); const feitas = folhas.reduce((a, l) => a + G.CAIXAS.filter(k => l.v[k]).length, 0); const total = folhas.length * G.CAIXAS.length;
      resumo.replaceChildren(...[h('span', { class: 'chip azul' }, linhas.length + ' linhas'), h('span', { class: 'chip ' + (total && feitas === total ? 'ok' : '') }, total ? Math.round(100 * feitas / total) + '% das caixas marcadas' : 'sem folhas'), FV.pendentes ? h('span', { class: 'chip aviso' }, 'só pendentes') : null, FV.fracos ? h('span', { class: 'chip ruim' }, 'só fracos (menos de 60%)') : null, FV.ordem !== 'edital' ? h('span', { class: 'chip aviso' }, 'ordem: ' + (FV.ordem === 'relevancia' ? 'relevância' : 'mais fracos primeiro')) : null, FV.relMin > 1 ? h('span', { class: 'chip aviso' }, 'relevância ' + FV.relMin + ' ou mais') : null].filter(Boolean));
      if (!linhas.length) { tabelaBox.replaceChildren(h('div', { class: 'vazio' }, App.S.topicos.length ? App.vazioFig('sem-resultados') : null, App.S.topicos.length ? 'Nenhuma linha com esses filtros.' : 'Ainda não há edital. Use o quadro abaixo para colar o texto e ver a prévia.')); return; }
      const corpo = h('tbody'); let ultima = null;
      linhas.forEach(l => {
        if (l.discId !== ultima) { ultima = l.discId; corpo.append(h('tr', { class: 'vt-disc' }, h('th', { colspan: 9 }, l.disciplina))); }
        const t = App.topico(l.topicoId); const caixa = (k) => l.folha ? h('td', { class: 'vt-cx' }, h('input', Object.assign({ type: 'checkbox', 'aria-label': nomes[k] + ': ' + l.titulo, onchange: async (e) => { t.vert = Object.assign({ teoria: false, questoes: false, r1: false, r2: false, r3: false }, t.vert, { [k]: e.target.checked, data: hoje }); await App.salvar('topicos', t); desenha(); } }, l.v[k] ? { checked: true } : {}))) : h('td', { class: 'vt-cx' }, '');
        const dataIn = l.folha ? h('input', { type: 'date', value: l.v.data || '', 'aria-label': 'Data: ' + l.titulo, onchange: async (e) => { t.vert = Object.assign({}, t.vert, { data: e.target.value }); await App.salvar('topicos', t); } }) : '';
        corpo.append(h('tr', { class: l.folha ? '' : 'vt-pai' }, h('td', { class: 'vt-tit', style: 'padding-left:' + (8 + l.nivel * 16) + 'px' }, h('a', { href: '#/topico/' + l.topicoId }, l.titulo)), h('td', { class: 'vt-rel' }, h('span', { class: 'chip ' + ((t.relevancia || 3) >= 4 ? 'azul' : ''), title: 'Relevância no edital (1 a 5)', 'data-rel': t.relevancia || 3 }, '★ ' + (t.relevancia || 3))), G.CAIXAS.map(caixa), h('td', {}, dataIn), h('td', {}, l.pct == null ? h('span', { class: 'muted' }, '—') : h('span', { class: 'chip ' + (l.pct >= 75 ? 'ok' : l.pct >= 60 ? 'aviso' : 'ruim') }, l.pct + '%'), l.feitas ? h('span', { class: 'muted peq' }, ' ' + l.feitas + 'q') : null)));
      });
      tabelaBox.replaceChildren(h('div', { class: 'rolagem-x' }, h('table', { class: 'tabela vertical' }, h('thead', {}, h('tr', {}, h('th', {}, 'Tópico'), h('th', { title: 'Relevância no edital (1 a 5)' }, 'Rel.'), h('th', { class: 'vt-cx', title: nomes.teoria }, 'Teoria'), h('th', { class: 'vt-cx', title: nomes.questoes }, 'Questões'), h('th', { class: 'vt-cx' }, 'Rev 1'), h('th', { class: 'vt-cx' }, 'Rev 2'), h('th', { class: 'vt-cx' }, 'Rev 3'), h('th', {}, 'Data'), h('th', {}, '% acerto'))), corpo)));
    };
    const selDisc = h('select', { 'aria-label': 'Disciplina', onchange: (e) => { FV.discId = e.target.value; desenha(); } }, [h('option', { value: '' }, 'Todas as disciplinas')].concat(App.S.disciplinas.map(d => h('option', Object.assign({ value: d.id }, FV.discId === d.id ? { selected: true } : {}), d.nome))));
    const marca = (k, n) => h('label', { class: 'marca-op' }, h('input', Object.assign({ type: 'checkbox', onchange: (e) => { FV[k] = e.target.checked; desenha(); } }, FV[k] ? { checked: true } : {})), ' ' + n);
    alvo.append(h('div', { class: 'cartao nao-imprime' }, h('div', { class: 'linha' }, h('label', { class: 'campo', style: 'min-width:200px;flex:1' }, h('span', {}, 'Disciplina'), selDisc), marca('pendentes', 'Só pendentes'), marca('fracos', 'Só fracos'), h('label', { class: 'campo' }, h('span', {}, 'Ordenar por'), h('select', { 'aria-label': 'Ordenar por', 'data-vt-ordem': '1', onchange: (e) => { FV.ordem = e.target.value; desenha(); } }, [['edital', 'Ordem do edital'], ['relevancia', 'Relevância (maior primeiro)'], ['fraco', 'Mais fracos primeiro']].map(([k, n]) => h('option', Object.assign({ value: k }, FV.ordem === k ? { selected: true } : {}), n)))), h('label', { class: 'campo' }, h('span', {}, 'Relevância mínima'), h('select', { 'aria-label': 'Relevância mínima', 'data-vt-relmin': '1', onchange: (e) => { FV.relMin = +e.target.value; desenha(); } }, [1, 2, 3, 4, 5].map(n => h('option', Object.assign({ value: n }, FV.relMin === n ? { selected: true } : {}), n === 1 ? 'Todas' : n + ' ou mais'))))), h('div', { class: 'linha', style: 'margin-top:10px' },
      h('button', { class: 'btn p', onclick: () => { const csv = G.verticalParaCSV(linhasAtuais()); App.baixar('dora-vertical-' + (c.nome || 'concurso').replace(/[^\w-]+/g, '-').slice(0, 40) + '.csv', csv, 'text/csv;charset=utf-8'); App.toast('CSV exportado. Abra no Excel ou Planilhas Google.'); } }, 'Exportar CSV (Planilhas)'),
      h('button', { class: 'btn', onclick: () => window.print() }, 'Imprimir'))));
    alvo.append(h('h2', { class: 'so-imprime' }, c.nome + ' — edital verticalizado'), h('div', { class: 'cartao' }, resumo, tabelaBox)); desenha();

    // ---- parser com prévia lado a lado ----
    const ent = h('textarea', { 'aria-label': 'Texto do edital (entrada)', placeholder: 'Cole aqui o conteúdo programático. Ex.:\nLÍNGUA PORTUGUESA\n1. Compreensão de textos. Tipologia textual; gêneros textuais.\n2. Crase. Concordância verbal e nominal.', style: 'min-height:200px' });
    const saida = h('pre', { class: 'afundado vt-saida', 'aria-label': 'Resultado' }, ''); const info = h('div', { class: 'muted peq' }); let atual = null;
    const atualiza = () => { if (ent.value.trim().length < 5) { atual = null; saida.textContent = 'O resultado aparece aqui.'; info.textContent = ''; return; } atual = G.parseEditalVertical(ent.value); saida.textContent = G.editalParaTexto(atual.disciplinas) || '(nada encontrado)'; info.textContent = atual.disciplinas.length + ' disciplinas · ' + atual.antes + ' itens do parser antigo viraram ' + atual.depois + ' (quebra por numeração, ponto e vírgula e ponto final).'; };
    ent.addEventListener('input', atualiza);
    alvo.append(h('div', { class: 'cartao nao-imprime' }, h('h2', {}, 'Colar e quebrar o edital'), h('p', { class: 'muted peq' }, 'O app quebra o texto por numeração (1., 1.1), por ponto e vírgula e pelo ponto final de cada item. Confira a prévia ao lado antes de usar. Não quebra "art. 5" nem "Lei nº 8.112".'),
      h('div', { class: 'grade2' }, h('label', { class: 'campo' }, h('span', {}, 'Entrada'), ent), h('div', { class: 'campo' }, h('span', {}, 'Saída (prévia)'), saida)), info,
      h('div', { class: 'linha', style: 'margin-top:10px' }, h('button', { class: 'btn', onclick: async () => { if (!atual) { App.toast('Cole um texto primeiro.', true); return; } App.toast(await copiar(G.editalParaTexto(atual.disciplinas)) ? 'Resultado copiado.' : 'Não consegui copiar. Selecione o texto da saída e use Ctrl+C.', false); } }, 'Copiar resultado'),
        h('button', { class: 'btn p', onclick: async () => { if (!atual || !atual.disciplinas.length) { App.toast('Cole um texto primeiro.', true); return; } if (!(await App.confirmar('Criar ' + atual.disciplinas.length + ' disciplinas e ' + atual.depois + ' tópicos em "' + c.nome + '"?', 'Criar', false))) return; const r = await App.inserirEdital(c.id, atual.disciplinas); App.toast(r.disciplinas + ' disciplinas e ' + r.topicos + ' tópicos criados.'); ent.value = ''; App.render(); } }, 'Acrescentar ao concurso'))));
    atualiza();
  };

  // ===================================================================
  // 2. Raio-X da Banca
  // ===================================================================
  const RX = { banca: null };
  V.raiox = async (alvo) => {
    if (!App.exigeConcurso(alvo)) return; const c = App.S.conc;
    alvo.append(h('h1', {}, 'Raio-X da Banca'), h('p', { class: 'muted' }, 'Cruza o seu banco de questões (importadas, capturadas e geradas) para mostrar o que mais cai, como cai e onde você erra.'));
    const bancas = G.raioX({ questoes: App.S.questoes, respostas: App.S.respostas, topicos: App.S.topicos }).bancas;
    if (RX.banca == null) RX.banca = (c.banca && bancas.some(b => b.chave.toLowerCase() === c.banca.toLowerCase())) ? bancas.find(b => b.chave.toLowerCase() === c.banca.toLowerCase()).chave : '';
    const corpo = h('div', { class: 'pilha' });
    const sel = h('select', { 'aria-label': 'Banca', onchange: (e) => { RX.banca = e.target.value; desenha(); } }, [h('option', { value: '' }, 'Todas as bancas (' + App.S.questoes.filter(q => !q.revisar).length + ' questões)')].concat(bancas.map(b => h('option', Object.assign({ value: b.chave }, RX.banca === b.chave ? { selected: true } : {}), b.chave + ' (' + b.n + ')'))));
    alvo.append(h('div', { class: 'cartao' }, h('label', { class: 'campo', style: 'max-width:380px' }, h('span', {}, 'Banca analisada' + (c.banca ? ' (do concurso: ' + c.banca + ')' : '')), sel)), corpo);
    function desenha() {
      const x = G.raioX({ questoes: App.S.questoes, respostas: App.S.respostas, topicos: App.S.topicos, banca: RX.banca }); corpo.replaceChildren();
      if (!x.total) { corpo.append(h('div', { class: 'cartao vazio' }, h('p', {}, 'Ainda não há questões' + (RX.banca ? ' da banca ' + RX.banca : '') + ' no banco.'), h('a', { class: 'btn p', href: '#/questoes?aba=importar' }, 'Importar questões'), ' ', h('a', { class: 'btn', href: '#/rajada' }, 'Gerar uma Rajada de 5'))); return; }
      const bar = (lista, op = {}) => lista.length ? App.barrasSVG(lista.map(i => ({ rot: i.chave, v: op.pct ? i.pct : i.n })), Object.assign({ sufixo: op.pct ? '%' : '' }, op)) : semDados('Sem dados para este recorte.');
      corpo.append(h('div', { class: 'cartao destaque' }, h('div', { class: 'linha' }, h('span', { class: 'chip azul' }, x.total + ' questões'), h('span', { class: 'chip' }, x.respondidas + ' respostas suas'), x.taxaErro != null ? h('span', { class: 'chip ' + (x.taxaErro > 40 ? 'ruim' : 'ok') }, x.taxaErro + '% de erro') : null, x.pegadinhas ? h('span', { class: 'chip aviso' }, x.pegadinhas + ' com pegadinha anotada') : null)));
      const maisCai = x.porAssunto.slice(0, 8);
      const cx1 = h('div', { class: 'cartao' }, h('h2', {}, 'O que mais cai'), h('p', { class: 'muted peq' }, 'Assuntos mais frequentes nas questões analisadas (% do total).'), bar(maisCai, { pct: true, rotulo: 'Assuntos que mais caem' }));
      corpo.append(cx1);
      // texto de "como a banca cobra" sugerido pela Dora Mentora, por assunto
      const sug = h('div', { class: 'pilha', style: 'margin-top:12px' }); cx1.append(h('h3', {}, 'Como a banca cobra'), h('p', { class: 'muted peq' }, 'A Dora Mentora lê as questões do assunto e sugere o padrão de cobrança. Ela pode errar: confira.'), sug);
      maisCai.slice(0, 3).forEach(a => { const caixa = h('div', { class: 'afundado' }); const saida = h('div', {});
        caixa.append(h('div', { class: 'linha entre' }, h('b', {}, a.chave), h('button', { class: 'btn mini', onclick: async (ev) => { if (!temIA()) { semIA(); return; } const btn = ev.target; btn.disabled = true; btn.textContent = 'Pensando...';
          try { const qs = App.S.questoes.filter(q => !q.revisar && (!RX.banca || (q.banca || '').toLowerCase() === RX.banca.toLowerCase()) && ((q.assunto || App.nomeTopico(q.topicoId)) === a.chave)); const r = await App.ia.tarefas.comoBancaCobra({ banca: RX.banca || c.banca, topico: a.chave, questoes: qs });
            const top = qs.map(q => App.topico(q.topicoId)).find(Boolean); saida.replaceChildren(h('p', { style: 'white-space:pre-wrap' }, r.texto), h('div', { class: 'peq muted' }, 'Modelo: ' + r.modelo), top ? h('button', { class: 'btn mini p', onclick: async () => { top.comoBanca = (top.comoBanca ? top.comoBanca + '\n\n' : '') + r.texto; await App.salvar('topicos', top); App.toast('Salvo em "Como a banca cobra" do tópico ' + top.titulo + '.'); } }, 'Salvar no tópico') : h('span', { class: 'muted peq' }, 'Sem tópico ligado a estas questões para salvar.')); } catch (e) { App.toast(e.message, true); }
          btn.disabled = false; btn.textContent = 'Sugerir com a IA'; } }, 'Sugerir com a IA')), saida); sug.append(caixa); });
      corpo.append(h('div', { class: 'grade2' },
        h('div', { class: 'cartao' }, h('h2', {}, 'Como cai: tipo de questão'), bar(x.porTipo, { pct: true, rotulo: 'Tipos de questão' })),
        h('div', { class: 'cartao' }, h('h2', {}, 'Como cai: dificuldade'), bar(x.porDificuldade, { pct: true, rotulo: 'Dificuldade' }), h('p', { class: 'muted peq' }, 'Quando a questão não tem dificuldade, o app estima pelo seu acerto (a partir de 2 tentativas).'))));
      corpo.append(h('div', { class: 'grade2' },
        h('div', { class: 'cartao' }, h('h2', {}, 'Por ano'), bar(x.porAno, { rotulo: 'Questões por ano' })),
        h('div', { class: 'cartao' }, h('h2', {}, 'Por banca'), bar(x.bancas.slice(0, 8).map(b => ({ chave: b.chave, n: b.n })), { rotulo: 'Questões por banca' }))));
      const erra = x.ondeErra.slice(0, 8);
      corpo.append(h('div', { class: 'cartao' }, h('h2', {}, 'Onde você erra'), h('p', { class: 'muted peq' }, 'Assuntos com mais erros seus (pelo menos 2 respostas). Em vermelho, o que você marcou com certeza e errou: é o ponto mais perigoso.'),
        erra.length ? App.barrasSVG(erra.map(a => ({ rot: a.chave, v: a.erros, cls: a.certezaErrada ? 'rx-perigo' : '' })), { sufixo: ' erros', rotulo: 'Assuntos com mais erros' }) : semDados('Ainda não há erros suficientes. Resolva questões deste banco para ver o seu ponto fraco.'),
        erra.length ? h('div', { class: 'linha', style: 'margin-top:8px' }, erra.slice(0, 3).map(a => h('span', { class: 'chip ruim' }, a.chave + ': ' + a.pct + '% de erro'))) : null));
    }
    desenha();
  };

  // ===================================================================
  // 4. Tribunal das IAs (verificação cruzada)
  // ===================================================================
  App.tribunal = {
    // modo: 'auto' | 'gemini' | 'claude'
    modos() { return [['auto', App.ia.temChave('claude') ? 'Automático (Claude, se houver chave)' : 'Automático (outro modelo Gemini)'], ['gemini', 'Outro modelo Gemini da escada'], ['claude', 'Claude (precisa de chave)']]; },
    conferir(lista, { modo = 'auto', modeloA = '', aoProgresso } = {}) {
      return G.rodarTribunal(lista, (q) => App.ia.tarefas.verificarQuestao(q, { modo, modeloA }), aoProgresso);
    },
    cartaoPlacar(p) {
      return h('div', { class: 'cartao destaque' }, h('h3', { style: 'margin-top:0' }, 'Placar do Tribunal das IAs'), h('div', { class: 'linha' }, h('span', { class: 'chip ok' }, p.concordam + ' concordam'), h('span', { class: p.divergem ? 'chip ruim' : 'chip' }, p.divergem + ' divergem'), p.semResposta ? h('span', { class: 'chip aviso' }, p.semResposta + ' sem resposta') : null, h('span', { class: 'chip azul' }, p.pct + '% de concordância')),
        h('p', { class: 'muted peq', style: 'margin-bottom:0' }, 'Só entram no banco as questões em que os dois modelos marcaram o mesmo gabarito. As outras ficam marcadas "revisar".'));
    }
  };

  // ===================================================================
  // 3. Rajada de 5
  // ===================================================================
  V.rajada = async (alvo, r) => {
    if (!App.exigeEdital(alvo)) return; const c = App.S.conc; let topicoId = r.query.t || null; let fonte = 'topico'; let qtd = Math.max(1, Math.min(100, +r.query.n || 5));
    const titulo = h('h1', {}, 'Rajada de ' + qtd);
    alvo.append(titulo, h('p', { class: 'muted' }, 'Questões novas no estilo da banca, uma atrás da outra, geradas em lotes. Você começa a responder enquanto o resto é gerado. Ao errar, escreva em 1 a 3 frases como pensou e a IA avalia o seu RACIOCÍNIO: onde desviou, que sinal perdeu e que gesto aplicar. Tudo vai para o Diário de Batalha.'));
    const palco = h('div', { class: 'pilha' });
    const banca = h('input', { type: 'text', value: c.banca || '', 'aria-label': 'Banca' });
    const selFonte = h('select', { 'aria-label': 'De onde tirar as questões', onchange: (e) => { fonte = e.target.value; extra.replaceChildren(); montaExtra(); } }, [['topico', 'Só o tópico (a IA usa o nome)'], ['grifos', 'Meus grifos deste tópico'], ['pdf', 'Páginas de um PDF da Estante']].map(([k, n]) => h('option', { value: k }, n)));
    const extra = h('div', { class: 'pilha' }); let selMat = null, pIni = null, pFim = null;
    const montaExtra = () => {
      if (fonte === 'pdf') { const mats = App.S.materiais.filter(m => m.texto && m.texto.length); if (!mats.length) { extra.append(semDados('Nenhum PDF com texto na Estante deste concurso.')); return; } selMat = h('select', { 'aria-label': 'PDF' }, mats.map(m => h('option', { value: m.id }, m.nome + ' (' + m.paginas + ' pág.)'))); pIni = h('input', { type: 'number', min: 1, value: 1, 'aria-label': 'Página inicial' }); pFim = h('input', { type: 'number', min: 1, value: 3, 'aria-label': 'Página final' }); extra.append(h('div', { class: 'grade', style: 'grid-template-columns:repeat(auto-fit,minmax(130px,1fr))' }, h('label', { class: 'campo' }, h('span', {}, 'PDF'), selMat), h('label', { class: 'campo' }, h('span', {}, 'Da página'), pIni), h('label', { class: 'campo' }, h('span', {}, 'Até a página'), pFim))); }
    };
    // quantidade: 5, 10, 20, 30, 50 ou número livre até 100
    const PRE = [5, 10, 20, 30, 50]; const livre = h('input', { type: 'number', min: 1, max: 100, value: PRE.includes(qtd) ? 15 : qtd, 'aria-label': 'Quantidade livre (1 a 100)', class: PRE.includes(qtd) ? 'oculto' : '', style: 'width:110px', oninput: () => { qtd = Math.max(1, Math.min(100, +livre.value || 1)); titulo.textContent = 'Rajada de ' + qtd; } });
    const selQtd = h('select', { 'aria-label': 'Quantidade de questões', onchange: (e) => { if (e.target.value === 'livre') { livre.classList.remove('oculto'); qtd = Math.max(1, Math.min(100, +livre.value || 1)); } else { livre.classList.add('oculto'); qtd = +e.target.value; } titulo.textContent = 'Rajada de ' + qtd; } }, PRE.map(n => h('option', Object.assign({ value: n }, n === qtd ? { selected: true } : {}), n + ' questões')).concat([h('option', Object.assign({ value: 'livre' }, PRE.includes(qtd) ? {} : { selected: true }), 'Outro número (até 100)')]));
    const tribunal = h('input', { type: 'checkbox', 'aria-label': 'Conferir com um segundo modelo' }); const modo = h('select', { 'aria-label': 'Modelo do Tribunal' }, App.tribunal.modos().map(([k, n]) => h('option', { value: k }, n)));
    const iniciar = h('button', { class: 'btn p' }, 'Disparar a rajada');
    alvo.append(h('div', { class: 'cartao' }, h('div', { class: 'grade', style: 'grid-template-columns:repeat(auto-fit,minmax(200px,1fr))' }, h('label', { class: 'campo' }, h('span', {}, 'Tópico'), App.selTopico(topicoId, (v) => topicoId = v, true)), h('label', { class: 'campo' }, h('span', {}, 'Banca'), banca), h('label', { class: 'campo' }, h('span', {}, 'Fonte'), selFonte), h('div', { class: 'campo' }, h('span', {}, 'Quantidade'), h('div', { class: 'linha' }, selQtd, livre))), extra,
      h('div', { class: 'linha', style: 'margin-top:10px' }, h('label', { class: 'marca-op' }, tribunal, ' Conferir cada lote com um segundo modelo (Tribunal das IAs)'), modo), h('p', { class: 'muted peq' }, 'As questões saem em lotes de 5 a 10 por chamada, para respeitar o limite da API e o teto de gasto. A conferência do Tribunal faz mais chamadas. Dá para cancelar a geração no meio.'), iniciar), palco);
    iniciar.onclick = async () => {
      if (!temIA()) { semIA(); return; } if (!topicoId) { App.toast('Escolha um tópico.', true); return; } const top = App.topico(topicoId); let contexto = '';
      if (fonte === 'grifos') { const gr = (await DB.porIndice('grifos', 'topicoId', topicoId)).map(g => g.texto).filter(Boolean); if (!gr.length) { App.toast('Este tópico não tem grifos. Grife trechos no leitor da Estante ou escolha outra fonte.', true); return; } contexto = gr.join('\n'); }
      else if (fonte === 'pdf') { const m = App.S.materiais.find(x => x.id === (selMat && selMat.value)); if (!m) { App.toast('Escolha um PDF.', true); return; } const a = Math.max(1, +pIni.value || 1), b = Math.min(m.texto.length, Math.max(a, +pFim.value || a)); contexto = m.texto.slice(a - 1, b).join('\n'); if (contexto.trim().length < 80) { App.toast('Essas páginas quase não têm texto (PDF escaneado?).', true); return; } }
      const total = qtd; const usaTrib = tribunal.checked; const modoT = modo.value; iniciar.disabled = true; palco.replaceChildren(); rodar(total, top, contexto, usaTrib, modoT).then(() => { iniciar.disabled = false; });
    };
    async function rodar(total, top, contexto, usaTrib, modoT) {
      const lote = total >= 20 ? 10 : 5; const fila = []; const feitas = []; const res = []; let geradas = 0, pedidas = 0, aprovTotal = 0, divTotal = 0; let gerando = true, cancelado = false, erroGer = '', i = 0; let acordar = null; const avisa = () => { if (acordar) { const f = acordar; acordar = null; f(); } };
      let placarAc = { total: 0, concordam: 0, divergem: 0, semResposta: 0, pct: 0 };
      const status = h('div', { class: 'cartao' }); const barraG = h('div', { class: 'barra' }, h('i', { style: 'width:0%' })); const txtG = h('div', { class: 'muted peq' }); const btnCancel = h('button', { class: 'btn mini perigo', onclick: () => { cancelado = true; btnCancel.disabled = true; btnCancel.textContent = 'Cancelando...'; } }, 'Cancelar a geração');
      const placarBox = h('div'); const area = h('div', { class: 'pilha' });
      status.append(h('div', { class: 'linha entre' }, h('b', {}, 'Rajada de ' + total + ' · ' + top.titulo), btnCancel), barraG, txtG); palco.append(status, placarBox, area);
      const atualizaStatus = () => { barraG.firstChild.style.width = Math.round(100 * Math.min(pedidas, total) / total) + '%'; txtG.textContent = (gerando ? 'Gerando... ' : cancelado ? 'Geração cancelada. ' : 'Geração concluída. ') + 'Prontas para responder: ' + aprovTotal + (usaTrib ? ' (aprovadas pelo Tribunal)' : '') + ' · pedidas à IA: ' + Math.min(pedidas, total) + ' de ' + total + (divTotal ? ' · para revisar: ' + divTotal : '') + (erroGer ? ' · parou: ' + erroGer : ''); if (!gerando) btnCancel.remove(); };
      // geração em lotes, em paralelo com as respostas
      (async () => {
        try {
          while (geradas < total && !cancelado) {
            const n = Math.min(lote, total - geradas); const previas = fila.concat(feitas).slice(-8).map(q => String(q.enunciado).slice(0, 50)); atualizaStatus();
            const exemplos = App.S.questoes.filter(q => q.topicoId === topicoId && q.alternativas.length && !q.revisar).slice(0, 2);
            const g = await App.ia.tarefas.gerarQuestoes({ banca: banca.value, assunto: top.titulo + (previas.length ? ' (não repita estes enunciados: ' + previas.join(' | ') + ')' : ''), n, exemplos, contexto: contexto || undefined });
            pedidas += n; geradas += n; let lista = (Array.isArray(g.dados) ? g.dados : g.dados.questoes || []).map(L.normalizaQuestao).filter(q => q.enunciado && q.alternativas.length >= 2 && q.gabarito).slice(0, n); let revisar = [];
            if (usaTrib && lista.length) { txtG.textContent = 'Conferindo o lote com o segundo modelo...'; const t = await App.tribunal.conferir(lista, { modo: modoT, modeloA: g.modelo }); lista = t.aprovadas.map(x => x.q); revisar = t.revisar; const p = t.placar; placarAc = { total: placarAc.total + p.total, concordam: placarAc.concordam + p.concordam, divergem: placarAc.divergem + p.divergem, semResposta: placarAc.semResposta + p.semResposta }; placarAc.pct = placarAc.total ? Math.round(100 * placarAc.concordam / placarAc.total) : 0; placarBox.replaceChildren(App.tribunal.cartaoPlacar(placarAc)); }
            for (const q of lista) { const it = Object.assign({}, q, { id: L.uid('q'), concursoId: c.id, topicoId, banca: banca.value, assunto: top.titulo, origem: 'ia', rajada: true, criado: Date.now() }); await App.salvar('questoes', it); fila.push(it); aprovTotal++; }
            for (const x of revisar) { await App.salvar('questoes', Object.assign({}, x.q, { id: L.uid('q'), concursoId: c.id, topicoId, banca: banca.value, assunto: top.titulo, origem: 'ia', rajada: true, revisar: true, tribunal: { gabB: x.gabB || '', modeloB: x.modeloB || '' }, criado: Date.now() })); divTotal++; }
            atualizaStatus(); avisa();
          }
        } catch (e) { erroGer = e.message; App.toast(e.message, true); }
        gerando = false; atualizaStatus(); avisa();
      })();
      const esperaProxima = () => new Promise(res2 => { acordar = res2; });
      const proxima = async () => {
        while (i >= fila.length && gerando) { area.replaceChildren(h('div', { class: 'cartao vazio' }, h('p', {}, 'Gerando o próximo lote... ' + res.length + ' respondidas até agora.'), res.length ? h('button', { class: 'btn', onclick: () => { cancelado = true; fim(); } }, 'Encerrar aqui e ver o diagnóstico') : null)); await esperaProxima(); }
        if (i >= fila.length) { fim(); return; } const item = fila[i]; const extraErro = h('div', { class: 'pilha' }); const pos = i + 1;
        const q = App.renderQuestao(item, { titulo: 'Questão ' + pos + (gerando ? '' : ' de ' + fila.length) + ' · ' + top.titulo, rotuloContinuar: 'Próxima', aoContinuar: () => { feitas.push(fila[i]); i++; proxima(); },
          aoResponder: async (x) => { const rr = await App.registrarResposta({ refTipo: 'questao', item, escolha: x.escolha, confianca: x.confianca, ms: x.ms }); const resp = { correta: rr.correta, ms: x.ms, confianca: x.confianca, item: rr.item, tipoErro: '' }; res.push(resp); if (!rr.correta) pensei(item, x.escolha, resp, extraErro); } });
        area.replaceChildren(h('div', { class: 'cartao' }, q, h('div', { class: 'linha', style: 'margin-top:10px' }, h('button', { class: 'btn mini', onclick: () => { cancelado = true; fim(); } }, 'Encerrar e ver o diagnóstico'))), extraErro);
      };
      function pensei(item, escolha, resp, caixa) {
        const ta = h('textarea', { maxlength: 400, placeholder: 'Em 1 a 3 frases: o que você pensou para marcar ' + escolha + '? (Ex.: "vi a palavra X e achei que...")', 'aria-label': 'Como pensei', style: 'min-height:80px' }); const saida = h('div', { class: 'pilha' });
        const btn = h('button', { class: 'btn p', onclick: async () => { const txt = ta.value.trim(); if (txt.length < 8) { App.toast('Escreva pelo menos uma frase curta.', true); return; } if (!temIA()) { semIA(); return; } btn.disabled = true; btn.textContent = 'Avaliando...';
          try { const r2 = await App.ia.tarefas.avaliarRaciocinio(item, escolha, txt); const a = G.normalizaAvaliacao(Array.isArray(r2.dados) ? r2.dados[0] : r2.dados); resp.tipoErro = a.tipoErro;
            const e = App.S.erros.find(x => x.refId === item.id && !x.resolvido); if (e) { Object.assign(e, { comoPensei: txt, analise: { onde: a.onde, sinal: a.sinal, gesto: a.gesto }, tipoErro: a.tipoErro, explicacaoIA: a.explicacao }); await DB.put('erros', e); }
            saida.replaceChildren(h('div', { class: 'cartao destaque' }, h('h3', { style: 'margin-top:0' }, 'Avaliação do seu raciocínio'), h('p', {}, h('b', {}, 'Onde desviou: '), a.onde), h('p', {}, h('b', {}, 'Sinal que você perdeu: '), a.sinal), h('p', {}, h('b', {}, 'Gesto para a próxima: '), a.gesto), a.explicacao ? h('p', {}, h('b', {}, 'Por que o gabarito está certo: '), a.explicacao) : null, h('p', { class: 'peq muted', style: 'margin-bottom:0' }, 'Tipo de erro: ' + L.TIPOS_ERRO[a.tipoErro] + (e ? ' · salvo no Diário de Batalha.' : '') + ' Modelo: ' + r2.modelo))); btn.remove(); ta.disabled = true; } catch (er) { App.toast(er.message, true); btn.disabled = false; btn.textContent = 'Avaliar meu raciocínio'; } } }, 'Avaliar meu raciocínio');
        caixa.replaceChildren(h('div', { class: 'cartao' }, h('h3', { style: 'margin-top:0' }, 'Como você pensou?'), h('label', { class: 'campo' }, h('span', {}, 'Escreva em 1 a 3 frases'), ta), h('div', { class: 'linha', style: 'margin-top:8px' }, btn), saida));
      }
      function fim() {
        if (fim.feito) return; fim.feito = true; const d = G.diagnosticoRajada(res); const tipos = Object.entries(d.tipos).map(([k, n]) => ({ rot: L.TIPOS_ERRO[k] || 'Erro sem análise', v: n }));
        area.replaceChildren(h('div', { class: 'cartao destaque' }, h('h2', {}, 'Diagnóstico da rajada'), h('div', { class: 'numgrande' }, d.acertos + ' de ' + d.total + ' (' + d.pct + '%)'), h('div', { class: 'linha' }, h('span', { class: 'chip azul' }, 'Tempo médio: ' + Math.round(d.msMedio / 1000) + ' s'), d.lentas ? h('span', { class: 'chip aviso' }, d.lentas + ' lenta(s)') : null, d.certezaErrada ? h('span', { class: 'chip ruim' }, d.certezaErrada + ' erro(s) com certeza') : null)),
          tipos.length ? h('div', { class: 'cartao' }, h('h3', {}, 'Tipos de erro'), App.barrasSVG(tipos, { rotulo: 'Tipos de erro da rajada' })) : h('div', { class: 'cartao muted' }, d.total ? 'Sem erros nesta rajada. Boa!' : 'Nenhuma questão respondida.'),
          h('div', { class: 'linha' }, h('button', { class: 'btn p', onclick: () => App.render() }, 'Nova rajada'), res.some(x => !x.correta && x.item && x.item.topicoId) ? h('button', { class: 'btn', type: 'button', 'data-estudo-reverso-btn': '1', onclick: () => App.abrirEstudoReverso(res.filter(x => !x.correta).map(x => x.item.topicoId)) }, 'O que rever') : null, h('a', { class: 'btn', href: '#/erros' }, 'Ver o Diário de Batalha')));
      }
      proxima();
    }
    montaExtra();
  };

  // ===================================================================
  // 5. Dora Escriba (discursivas com IA)
  // ===================================================================
  V.escriba = async (alvo, r) => {
    if (!App.exigeEdital(alvo)) return; const c = App.S.conc; const chave = 'doraDraw.escriba:' + c.id; const est = ls(chave, { topicoId: r.query.t || '', banca: c.banca || '', linhas: 30, cpl: 85, tema: '', texto: '' }); if (r.query.t) est.topicoId = r.query.t;
    const salva = () => lsSet(chave, est);
    alvo.append(h('h1', {}, 'Dora Escriba'), h('p', { class: 'muted' }, 'Escreva a resposta, escolha a banca e o número de linhas. A IA corrige com um espelho (conteúdo, estrutura e linguagem), dá a nota e devolve a versão comentada. Tudo fica salvo no tópico.'));
    const ta = h('textarea', { style: 'min-height:300px', 'aria-label': 'Sua resposta', placeholder: 'Escreva aqui a sua resposta.', oninput: (e) => { est.texto = e.target.value; salva(); conta(); } }, est.texto); const cont = h('div', { class: 'linha' }); const saida = h('div', { class: 'pilha' });
    const conta = () => { const n = G.contarLinhas(ta.value, est.cpl); cont.replaceChildren(h('span', { class: 'chip ' + (n > est.linhas ? 'ruim' : 'ok') }, n + ' de ' + est.linhas + ' linhas'), h('span', { class: 'chip' }, ((ta.value.match(/\S+/g) || []).length) + ' palavras')); };
    const num = (k, min, max, rot, w = 90) => h('input', { type: 'number', min, max, value: est[k], style: 'width:' + w + 'px', 'aria-label': rot, onchange: (e) => { est[k] = Math.max(min, Math.min(max, +e.target.value || min)); salva(); conta(); } });
    const btn = h('button', { class: 'btn p' }, 'Corrigir com a IA');
    alvo.append(h('div', { class: 'cartao' }, h('div', { class: 'grade', style: 'grid-template-columns:repeat(auto-fit,minmax(170px,1fr));margin-bottom:10px' }, h('label', { class: 'campo' }, h('span', {}, 'Tópico (onde salvar)'), App.selTopico(est.topicoId, (v) => { est.topicoId = v || ''; salva(); }, true)), h('label', { class: 'campo' }, h('span', {}, 'Banca'), h('input', { type: 'text', value: est.banca, onchange: (e) => { est.banca = e.target.value; salva(); } })), h('label', { class: 'campo' }, h('span', {}, 'Linhas (máximo)'), num('linhas', 5, 200, 'Número de linhas')), h('label', { class: 'campo' }, h('span', {}, 'Caracteres por linha'), num('cpl', 20, 200, 'Caracteres por linha'))),
      h('label', { class: 'campo', style: 'margin-bottom:10px' }, h('span', {}, 'Tema ou comando da questão'), h('input', { type: 'text', value: est.tema, onchange: (e) => { est.tema = e.target.value; salva(); } })), ta, cont, h('div', { class: 'linha', style: 'margin-top:10px' }, btn)), saida);
    conta();
    const mostra = (reg) => { const cr = reg.correcao; return h('div', { class: 'pilha' }, h('div', { class: 'cartao destaque' }, h('div', { class: 'linha entre' }, h('h2', { style: 'margin:0' }, 'Nota ' + cr.nota.toString().replace('.', ',') + ' de 10'), h('span', { class: 'chip azul' }, reg.banca || 'sem banca')), h('div', { class: 'afundado', style: 'margin-top:10px' }, cr.criterios.map(k => h('div', { style: 'margin-bottom:8px' }, h('div', { class: 'linha entre' }, h('b', {}, k.nome), h('span', { class: 'chip' }, k.obtido + ' / ' + k.peso)), h('div', { class: 'peq' }, k.comentario))))),
      cr.pontosFortes.length ? h('div', { class: 'cartao' }, h('h3', {}, 'Pontos fortes'), h('ul', {}, cr.pontosFortes.map(p => h('li', {}, p)))) : null, cr.melhorar.length ? h('div', { class: 'cartao' }, h('h3', {}, 'O que melhorar'), h('ul', {}, cr.melhorar.map(p => h('li', {}, p)))) : null,
      cr.versaoComentada ? h('div', { class: 'cartao' }, h('h3', {}, 'Versão comentada'), h('p', { style: 'white-space:pre-wrap' }, cr.versaoComentada)) : null); };
    btn.onclick = async () => {
      if (!temIA()) { semIA(); return; } if (!est.topicoId) { App.toast('Escolha o tópico onde a correção será salva.', true); return; } if (ta.value.trim().length < 60) { App.toast('Escreva um texto maior antes de corrigir.', true); return; }
      btn.disabled = true; btn.textContent = 'Corrigindo...';
      try { const r2 = await App.ia.tarefas.corrigirDiscursiva({ banca: est.banca, linhas: est.linhas, tema: est.tema, texto: ta.value }); const cr = G.normalizaCorrecao(Array.isArray(r2.dados) ? r2.dados[0] : r2.dados, est.linhas); const t = App.topico(est.topicoId);
        const reg = { id: L.uid('e'), ts: Date.now(), dia: App.hoje(), banca: est.banca, linhasMax: est.linhas, linhasUsadas: G.contarLinhas(ta.value, est.cpl), tema: est.tema, texto: ta.value, correcao: cr, modelo: r2.modelo }; t.escritas = (t.escritas || []).concat([reg]); await App.salvar('topicos', t);
        saida.replaceChildren(mostra(reg), h('p', { class: 'muted peq' }, 'Salvo no tópico "' + t.titulo + '". Modelo: ' + r2.modelo)); } catch (e) { App.toast(e.message, true); }
      btn.disabled = false; btn.textContent = 'Corrigir com a IA';
    };
    // histórico do tópico escolhido
    const hist = h('div', { class: 'pilha' }); alvo.append(hist);
    const histDesenha = () => { const t = App.topico(est.topicoId); const es = t ? (t.escritas || []).slice().reverse() : []; hist.replaceChildren(); if (!es.length) return; hist.append(h('h2', {}, 'Correções salvas em "' + t.titulo + '"')); es.slice(0, 10).forEach(reg => { const det = h('div', { class: 'oculto' }); hist.append(h('div', { class: 'cartao', style: 'margin:0' }, h('div', { class: 'linha entre' }, h('div', {}, h('b', {}, 'Nota ' + reg.correcao.nota.toString().replace('.', ',')), h('span', { class: 'muted' }, ' · ' + App.fmtData(reg.dia) + (reg.banca ? ' · ' + reg.banca : ''))), h('button', { class: 'btn mini', onclick: () => det.classList.toggle('oculto') }, 'Ver')), det)); det.append(mostra(reg), h('details', {}, h('summary', {}, 'Texto enviado'), h('p', { style: 'white-space:pre-wrap' }, reg.texto))); }); };
    histDesenha(); btn.addEventListener('click', () => setTimeout(histDesenha, 3000));
  };

  // ===================================================================
  // 10. Replanejar (metas atrasadas da Dora Agenda)
  // ===================================================================
  const agendaOrig = V.agenda;
  V.agenda = async (alvo, r) => {
    await agendaOrig(alvo, r); if (!App.S.conc || !App.S.topicos.length) return; const c = App.S.conc; const chave = 'doraDraw.metas:' + c.id; const hoje = App.hoje();
    const mins = ls('doraDraw.plano-min', [0, 90, 90, 90, 90, 90, 120]); const mpt = ls('doraDraw.min-topico', 60); const box = h('div', { class: 'cartao' }); alvo.append(box);
    const carrega = () => G.aplicarFeitas(ls(chave, []), App.S.topicos);
    const desenha = () => {
      const metas = carrega(); const atrasadas = metas.filter(m => !m.feita && m.dia < hoje); const proximas = metas.filter(m => !m.feita && m.dia >= hoje).slice(0, 8);
      box.replaceChildren(h('h2', {}, 'Metas fixadas e replanejamento'), h('p', { class: 'muted peq' }, 'Fixe o plano das próximas 2 semanas como metas. Uma meta conta como feita quando você estuda o tópico no dia dela ou depois. Se atrasar, use "Replanejar" para redistribuir o que ficou para trás até a prova.'),
        h('div', { class: 'linha' }, h('button', { class: 'btn', onclick: () => fixar() }, metas.length ? 'Fixar de novo (substitui as metas)' : 'Fixar o plano das próximas 2 semanas'), h('button', { class: 'btn p', disabled: !atrasadas.length, onclick: () => replanejar() }, 'Replanejar' + (atrasadas.length ? ' (' + atrasadas.length + ' atrasada' + (atrasadas.length > 1 ? 's' : '') + ')' : ''))),
        !metas.length ? h('div', { class: 'afundado muted peq', style: 'margin-top:10px' }, 'Nenhuma meta fixada ainda.') : h('div', { class: 'arvore', style: 'margin-top:10px' }, atrasadas.map(m => h('div', { class: 'no-t' }, h('div', {}, h('b', {}, App.nomeTopico(m.topicoId)), h('div', { class: 'meta' }, h('span', { class: 'chip ruim' }, 'atrasada · ' + App.fmtData(m.dia)), h('span', { class: 'chip' }, m.minutos + ' min'), m.replanejada ? h('span', { class: 'chip aviso' }, 'já replanejada') : null)))), proximas.map(m => h('div', { class: 'no-t' }, h('div', {}, h('b', {}, App.nomeTopico(m.topicoId)), h('div', { class: 'meta' }, h('span', { class: 'chip azul' }, App.fmtData(m.dia)), h('span', { class: 'chip' }, m.minutos + ' min'), m.replanejada ? h('span', { class: 'chip aviso' }, 'replanejada') : null))))));
    };
    const fixar = () => {
      const notas = App.mapaNotas(); const fila = App.prioridades().filter(p => { const t = App.topico(p.topicoId); return !t.ultEstudo || (notas[t.id] != null && notas[t.id] < 70); });
      const ag = L.agendaAteProva({ prioridade: fila, hoje, provaData: App.provaData(), minutosPorDia: mins, minutosPorTopico: mpt }); const lim = L.somaDias(hoje, 13);
      const metas = []; ag.dias.filter(d => d.dia <= lim).forEach(d => d.blocos.forEach(b => metas.push({ id: L.uid('m'), topicoId: b.topicoId, dia: d.dia, minutos: b.minutos, feita: false })));
      lsSet(chave, metas); App.toast(metas.length + ' metas fixadas.'); desenha();
    };
    const replanejar = () => {
      const res = G.replanejar({ metas: carrega(), hoje, provaData: App.provaData(), minutosPorDia: mins });
      const m = App.modal('Replanejar metas atrasadas', h('div', { class: 'pilha' }, h('div', { class: res.cabe ? 'aviso-caixa' : 'aviso-caixa', role: 'status' }, h('b', {}, res.cabe ? 'Cabe: ' : 'Atenção: '), res.aviso), h('div', { class: 'peq muted' }, res.atrasadas + ' meta(s) atrasada(s), ' + res.minAtrasado + ' min · ' + res.diasRestantes + ' dias até a prova.'),
        h('div', { class: 'arvore' }, res.moveu.slice(0, 12).map(x => h('div', { class: 'peq' }, App.nomeTopico((res.metas.find(k => k.id === x.id) || {}).topicoId) + ': ' + App.fmtData(x.de) + ' → ' + App.fmtData(x.para) + ' (' + x.minutos + ' min)'))),
        res.naoCabem.length ? h('div', { class: 'afundado peq' }, h('b', {}, 'Não cabem: '), res.naoCabem.map(k => App.nomeTopico(k.topicoId) + ' (' + k.minutos + ' min)').join('; ')) : null,
        h('div', { class: 'linha' }, h('button', { class: 'btn p', onclick: () => { lsSet(chave, res.metas.concat(res.naoCabem.map(k => Object.assign({}, k, { id: k.id + '~resto', feita: false })))); m.fechar(); App.toast(res.cabe ? 'Metas replanejadas.' : 'Replanejado o que coube. Veja o aviso.', !res.cabe); desenha(); } }, 'Aplicar'), h('button', { class: 'btn', onclick: () => m.fechar() }, 'Cancelar'))));
    };
    desenha();
  };
})();
