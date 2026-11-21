/* Telas: Início, Concursos e Edital. */
(function () {
  const App = window.App, { L, h, DB } = App, V = App.views;

  // ---------- criar disciplinas e tópicos a partir do texto do edital ----------
  App.inserirEdital = async (concursoId, propostas) => {
    let ordemD = App.S.disciplinas.length ? Math.max(...App.S.disciplinas.map(d => d.ordem)) + 1 : 0; const novasD = [], novosT = [];
    for (const p of propostas) {
      const d = { id: L.uid('d'), concursoId, nome: p.nome, peso: p.peso != null ? p.peso : 10, ordem: ordemD++ }; novasD.push(d);
      const pilha = []; let o = 0;
      p.topicos.forEach(t => { const nivel = Math.max(1, t.nivel); pilha.length = nivel - 1; const pai = pilha[nivel - 2] || null; const nt = { id: L.uid('t'), concursoId, disciplinaId: d.id, paiId: pai ? pai.id : null, titulo: t.titulo, ordem: o++, relevancia: t.relevancia || 3, relevanciaOrigem: t.relevancia ? 'edital' : null, dificuldade: 3, dominio: null, nota: null, notaHtml: '', mapa: null, quadro: null, comoBanca: '', ultEstudo: null, proxRev: null, criado: Date.now() }; pilha[nivel - 1] = nt; novosT.push(nt); });
    }
    await DB.putMuitos('disciplinas', novasD); await DB.putMuitos('topicos', novosT);
    if (concursoId === (App.S.conc && App.S.conc.id)) { App.S.disciplinas.push(...novasD); App.S.topicos.push(...novosT); }
    return { disciplinas: novasD.length, topicos: novosT.length };
  };
  const EXEMPLO_EDITAL = `LÍNGUA PORTUGUESA
1. Compreensão e interpretação de textos
2. Emprego das classes de palavras
3. Crase
4. Concordância verbal e nominal
MATEMÁTICA
1. Porcentagem e juros simples
2. Razão e proporção
3. Equações do 1º e do 2º grau
INFORMÁTICA
1. Conceitos de internet e navegadores
2. Planilhas eletrônicas
3. Segurança da informação`;
  const EXEMPLO_Q = [
    { enunciado: 'Assinale a frase em que o uso da crase está correto.', alternativas: ['Fui à pé até a escola.', 'Entreguei o documento à diretora.', 'Começou a chover à cântaros.', 'Vou a casa de meus pais.', 'Ela saiu à noite sem dizer a quem.'], gabarito: 'B', topico: 'Crase', explicacao: 'Antes de palavra feminina determinada ("a diretora") há fusão da preposição a com o artigo a.', pegadinha: 'Crase antes de palavra masculina ou de "casa" sem adjunto' },
    { enunciado: 'Um produto de R$ 200,00 sofreu desconto de 15%. Qual o novo preço?', alternativas: ['R$ 160,00', 'R$ 165,00', 'R$ 170,00', 'R$ 175,00', 'R$ 185,00'], gabarito: 'C', topico: 'Porcentagem e juros simples', explicacao: '15% de 200 = 30. 200 − 30 = 170.', pegadinha: 'Somar o desconto em vez de subtrair' },
    { enunciado: 'Em uma planilha, qual função soma os valores do intervalo A1:A10?', alternativas: ['=MÉDIA(A1:A10)', '=SOMA(A1:A10)', '=MÁXIMO(A1:A10)', '=CONT.VALORES(A1:A10)', '=SE(A1:A10)'], gabarito: 'B', topico: 'Planilhas eletrônicas', explicacao: 'SOMA adiciona todos os números do intervalo.', pegadinha: 'Confundir SOMA com CONT.VALORES (que conta células)' }
  ];
  App.criarExemplo = async () => {
    const c = { id: L.uid('k'), nome: 'Concurso de exemplo (modelo genérico)', banca: 'Exemplo', orgao: 'Órgão de exemplo', cargo: 'Cargo de exemplo', dataProva: L.somaDias(App.hoje(), 90), exemplo: true, criado: Date.now() };
    await DB.put('concursos', c); await App.carregarConcurso(c.id); const pesos = [20, 15, 10]; const props = L.parseEdital(EXEMPLO_EDITAL); props.forEach((p, i) => p.peso = pesos[i]); await App.inserirEdital(c.id, props);
    for (const q of EXEMPLO_Q) { const t = App.S.topicos.find(x => x.titulo === q.topico); await App.salvar('questoes', { id: L.uid('q'), concursoId: c.id, topicoId: t ? t.id : null, tipo: 'multipla', enunciado: q.enunciado, alternativas: q.alternativas.map((x, i) => ({ letra: 'ABCDE'[i], texto: x })), gabarito: q.gabarito, comentario: q.explicacao, pegadinha: q.pegadinha, banca: 'Exemplo', ano: 2024, exemplo: true, criado: Date.now() }); }
    const t = App.S.topicos.find(x => x.titulo === 'Crase'); if (t) { await App.salvar('cartoes', { id: L.uid('c'), concursoId: c.id, topicoId: t.id, tipo: 'basico', frente: 'Quando NÃO ocorre crase?', verso: 'Antes de palavras masculinas, verbos no infinitivo, pronomes de tratamento (exceto senhora, senhorita, dona) e a maioria dos pronomes.', criado: Date.now() }); }
    return c;
  };

  // ---------- Início ----------
  V.inicio = async (alvo) => {
    const hoje = App.hoje(); alvo.append(h('h1', { class: 'sombra-titulo' }, 'Início'));
    if (!App.S.conc) {
      alvo.append(h('div', { class: 'cartao destaque' }, h('h2', {}, 'Bem-vindo ao Dora Draw'), h('p', {}, 'Um caderno de estudo para qualquer concurso: edital, notas, mapa mental, desenho, cartões, questões, diário de erros e plano de estudo. Seus dados ficam só neste computador.'),
        h('div', { class: 'linha' }, h('a', { class: 'btn p', href: '#/concursos' }, 'Criar meu concurso'), h('button', { class: 'btn', onclick: async () => { await App.criarExemplo(); App.toast('Concurso de exemplo criado. Explore à vontade e apague depois.'); App.render(); } }, 'Ver um concurso de exemplo'), h('a', { class: 'btn', href: '#/ajustes' }, 'Tenho um backup'))));
      return;
    }
    const c = App.S.conc; const falta = c.dataProva ? L.diasEntre(hoje, c.dataProva) : null;
    const devidos = App.cartoesDevidos().length; const errosHoje = App.errosAtivos().filter(e => e.proxCheque <= hoje).length;
    const dias = [...new Set(App.S.sessoes.map(s => L.diaLocal(s.inicio)).concat(App.S.respostas.map(r => r.dia)))]; const seq = L.sequenciaDias(dias, hoje);
    const sem = App.S.sessoes.filter(s => L.diasEntre(L.diaLocal(s.inicio), hoje) < 7).reduce((a, s) => a + (s.minutos || 0), 0);
    alvo.append(h('div', { class: 'cartao destaque' }, h('div', { class: 'linha entre' }, h('div', {}, h('div', { class: 'rotulo' }, c.banca || 'Concurso'), h('h2', { style: 'margin:0' }, c.nome), h('div', { class: 'muted peq' }, [c.orgao, c.cargo].filter(Boolean).join(' · '))), h('div', { class: 'centro' }, falta == null ? h('a', { class: 'btn', href: '#/concursos' }, 'Definir data da prova') : [h('div', { class: 'numgrande' }, falta >= 0 ? String(falta) : '0'), h('div', { class: 'muted peq' }, falta > 1 ? 'dias para a prova' : falta === 1 ? 'dia para a prova' : falta === 0 ? 'a prova é hoje' : 'prova já passou')])), c.exemplo ? h('p', { class: 'aviso-caixa info', style: 'margin:10px 0 0' }, 'Este é um concurso de exemplo, só para você conhecer o app. Dá para apagá-lo na tela Concursos.') : null));
    const tile = (num, rot, href, cls) => h('a', { class: 'cartao', href, style: 'text-decoration:none;color:inherit;margin:0' }, h('div', { class: 'numgrande' + (cls ? ' ' + cls : '') }, String(num)), h('div', { class: 'muted' }, rot));
    alvo.append(h('div', { class: 'grade', style: 'grid-template-columns:repeat(auto-fit,minmax(150px,1fr));margin-bottom:14px' }, tile(devidos, 'cartões para hoje', '#/estudar'), tile(errosHoje, 'erros para rever', '#/erros'), tile(seq, seq === 1 ? 'dia seguido' : 'dias seguidos', '#/foco'), tile(App.min(sem), 'estudados em 7 dias', '#/foco')));
    // caixa de entrada
    const caixa = App.S.capturas.concat(App.S.capturasSemConcurso || []); if (caixa.length) alvo.append(App.cartaoCaixa(caixa));
    // prioridades
    const pr = App.prioridades().slice(0, 6);
    const lista = h('div', { class: 'arvore' }); pr.forEach(p => { const t = App.topico(p.topicoId); const d = App.disciplina(p.disciplinaId); lista.append(h('a', { class: 'no-t', href: '#/topico/' + t.id, style: 'text-decoration:none;color:inherit' }, h('div', {}, h('div', { class: 'tit' }, t.titulo), h('div', { class: 'meta' }, h('span', { class: 'chip azul' }, d ? d.nome : ''), h('span', { class: 'muted peq' }, 'prioridade ' + p.prioridade.toFixed(1)))), App.pillNota(p.nota))); });
    alvo.append(h('div', { class: 'cartao' }, h('div', { class: 'linha entre' }, h('h2', { style: 'margin:0' }, 'O que estudar primeiro'), h('a', { class: 'btn mini', href: '#/agenda' }, 'Abrir a Dora Agenda')), h('p', { class: 'muted peq' }, 'Calculado por: questões esperadas × o quanto você ainda erra × urgência.'), pr.length ? lista : h('div', { class: 'vazio' }, 'Monte o edital para ver as prioridades.', h('div', {}, h('a', { class: 'btn p', href: '#/edital' }, 'Montar o edital')))));
    const rev = App.S.topicos.filter(t => t.proxRev && t.proxRev <= hoje && App.ehFolha(t)).slice(0, 5);
    if (rev.length) alvo.append(h('div', { class: 'cartao' }, h('h2', {}, 'Revisões de tópicos em dia de fazer'), h('div', { class: 'arvore' }, rev.map(t => h('a', { class: 'no-t', href: '#/topico/' + t.id, style: 'text-decoration:none;color:inherit' }, h('div', { class: 'tit' }, t.titulo), h('span', { class: 'chip aviso' }, 'desde ' + App.fmtData(t.proxRev)))))));
  };
  App.cartaoCaixa = (caixa) => {
    const el = h('div', { class: 'cartao destaque' }, h('h2', {}, 'Caixa de entrada (' + caixa.length + ')'), h('p', { class: 'muted peq' }, 'Coisas que você capturou e ainda não guardou em um tópico.'));
    caixa.slice(0, 6).forEach(c => el.append(h('div', { class: 'no-t', style: 'margin-bottom:6px' }, h('div', { style: 'min-width:0' }, h('div', { class: 'rotulo' }, { nota: 'Nota rápida', pagina: 'Página', minuto: 'Minuto de vídeo', selecao: 'Seleção', questao: 'Questão', imagem: 'Recorte', pena: 'Anotação da página' }[c.tipo] || 'Captura'), h('div', { class: 'tit', style: 'font-weight:500' }, (c.titulo || c.texto || '(imagem)').slice(0, 110))), h('div', { class: 'linha' }, h('button', { class: 'btn mini p', onclick: () => App.classificarCaptura(c) }, 'Guardar'), h('button', { class: 'btn mini perigo', 'aria-label': 'Descartar', onclick: async () => { await DB.del('capturas', c.id); App.S.capturas = App.S.capturas.filter(x => x.id !== c.id); App.render(); } }, 'Descartar')))));
    return el;
  };
  App.classificarCaptura = (c) => {
    if (!App.exigeConcursoSilencioso()) return; let topicoId = c.topicoId || null; let como = c.tipo === 'questao' || (c.tipo === 'pena' && c.questao) ? 'questao' : c.tipo === 'imagem' || c.tipo === 'pena' ? 'imagem' : 'nota';
    const seg = h('div', { class: 'seg' }); const rot = { nota: 'Nota', cartao: 'Cartão', questao: 'Dora Carta', imagem: 'Imagem no quadro' };
    const pinta = () => [...seg.children].forEach(b => b.setAttribute('aria-pressed', String(b.dataset.k === como)));
    Object.keys(rot).filter(k => k !== 'imagem' || c.imagem).forEach(k => seg.append(h('button', { type: 'button', 'data-k': k, onclick: () => { como = k; pinta(); } }, rot[k]))); pinta();
    const m = App.modal('Guardar captura', h('div', { class: 'pilha' }, h('div', { class: 'afundado peq' }, (c.titulo ? c.titulo + ' — ' : '') + (c.texto || '').slice(0, 300)), c.imagem ? h('img', { src: c.imagem, alt: 'Recorte', style: 'max-width:100%;border-radius:10px' }) : null, h('div', {}, h('div', { class: 'rotulo' }, 'Guardar como'), seg), h('label', { class: 'campo' }, h('span', {}, 'Tópico'), App.selTopico(topicoId, (v) => topicoId = v)), h('div', { class: 'linha' }, h('button', { class: 'btn p', onclick: async () => { try { await window.DoraCaptura.aplicar(c, { concursoId: App.S.conc.id, topicoId, como }); m.fechar(); await App.carregarConcurso(App.S.conc.id); App.toast('Guardado.'); App.render(); } catch (e) { App.toast(e.message, true); } } }, 'Guardar'))));
  };
  App.exigeConcursoSilencioso = () => { if (App.S.conc && App.S.topicos.length) return true; App.toast('Crie um concurso e monte o edital antes.', true); return false; };

  // ---------- Concursos ----------
  V.concursos = async (alvo) => {
    alvo.append(h('h1', {}, 'Concursos'));
    const form = (c) => {
      const campos = { nome: h('input', { type: 'text', value: c.nome || '', placeholder: 'Ex.: Analista Judiciário 2026' }), banca: h('input', { type: 'text', value: c.banca || '', placeholder: 'Ex.: FGV, Cebraspe, Vunesp' }), orgao: h('input', { type: 'text', value: c.orgao || '' }), cargo: h('input', { type: 'text', value: c.cargo || '' }), dataProva: h('input', { type: 'date', value: c.dataProva || '' }) };
      const campo = (k, rot) => h('label', { class: 'campo' }, h('span', {}, rot), campos[k]);
      return { el: h('div', { class: 'pilha' }, campo('nome', 'Nome do concurso'), h('div', { class: 'grade2' }, campo('banca', 'Banca'), campo('orgao', 'Órgão')), h('div', { class: 'grade2' }, campo('cargo', 'Cargo'), campo('dataProva', 'Data da prova'))), ler: () => { const o = {}; for (const k in campos) o[k] = campos[k].value.trim(); return o; } };
    };
    const novo = form({});
    alvo.append(h('div', { class: 'cartao' }, h('h2', {}, 'Novo concurso'), novo.el, h('div', { class: 'linha', style: 'margin-top:12px' }, h('button', { class: 'btn p', onclick: async () => { const v = novo.ler(); if (!v.nome) { App.toast('Dê um nome ao concurso.', true); return; } const c = Object.assign({ id: L.uid('k'), criado: Date.now() }, v); await DB.put('concursos', c); await App.carregarConcurso(c.id); App.toast('Concurso criado. Agora monte o edital.'); App.ir('edital'); } }, 'Criar concurso'), h('button', { class: 'btn', onclick: async () => { await App.criarExemplo(); App.toast('Exemplo criado.'); App.render(); } }, 'Criar um concurso de exemplo'))));
    if (!App.S.concursos.length) return;
    alvo.append(h('h2', {}, 'Meus concursos'));
    const g = h('div', { class: 'grade' }); alvo.append(g);
    for (const c of App.S.concursos) {
      const falta = c.dataProva ? L.diasEntre(App.hoje(), c.dataProva) : null; const atual = App.S.conc && App.S.conc.id === c.id;
      g.append(h('div', { class: 'cartao' + (atual ? ' destaque' : '') }, h('h3', {}, c.nome), h('div', { class: 'muted peq' }, [c.banca, c.orgao, c.cargo].filter(Boolean).join(' · ') || 'Sem detalhes'), h('p', {}, c.dataProva ? h('span', { class: 'chip' }, App.fmtData(c.dataProva) + (falta != null ? ' · ' + (falta >= 0 ? 'faltam ' + falta + ' dias' : 'já passou') : '')) : h('span', { class: 'muted peq' }, 'Sem data da prova')),
        h('div', { class: 'linha' }, atual ? h('span', { class: 'chip ok' }, 'Aberto agora') : h('button', { class: 'btn mini p', onclick: async () => { await App.carregarConcurso(c.id); App.render(); } }, 'Abrir'),
          h('button', { class: 'btn mini', onclick: () => { const f = form(c); const m = App.modal('Editar concurso', h('div', { class: 'pilha' }, f.el, h('button', { class: 'btn p', onclick: async () => { Object.assign(c, f.ler()); await DB.put('concursos', c); await App.carregarConcurso(App.S.conc && App.S.conc.id); m.fechar(); App.render(); } }, 'Salvar'))); } }, 'Editar'),
          h('button', { class: 'btn mini perigo', onclick: async () => { if (!(await App.confirmar('Apagar "' + c.nome + '" com todos os tópicos, cartões, questões e diário? Isso não tem volta (faça um backup antes se quiser guardar).', 'Apagar tudo deste concurso'))) return; for (const l of ['disciplinas', 'topicos', 'cartoes', 'questoes', 'cadernos', 'respostas', 'erros', 'materiais', 'sessoes', 'capturas']) { const itens = await DB.porIndice(l, 'concursoId', c.id); if (l === 'materiais') for (const m of itens) { await DB.del('arquivos', m.id); await DB.delMuitos('grifos', (await DB.porIndice('grifos', 'materialId', m.id)).map(x => x.id)); } await DB.delMuitos(l, itens.map(x => x.id)); } await DB.del('concursos', c.id); await App.carregarConcurso(null); App.render(); } }, 'Apagar'))));
    }
  };

  // ---------- Edital ----------
  V.edital = async (alvo) => {
    if (!App.exigeConcurso(alvo)) return; const c = App.S.conc;
    alvo.append(h('h1', {}, 'Dora Edital — ' + c.nome)); App.cartoesEdital(alvo);
    const caixaCola = () => {
      const ta = h('textarea', { placeholder: 'Cole aqui o conteúdo programático do edital. Pode ser com numeração (1., 1.1, 1.1.1), com ponto e vírgula, ou só uma lista. Disciplinas em MAIÚSCULAS ou "Disciplina: Nome".', style: 'min-height:200px' });
      return h('div', { class: 'cartao' + (App.S.topicos.length ? '' : ' destaque') }, h('h2', {}, App.S.topicos.length ? 'Acrescentar mais texto do edital' : 'Cole o texto do edital'), h('p', { class: 'muted peq' }, 'O app propõe as disciplinas e os tópicos; você confere e corrige antes de salvar. O texto não sai do seu computador.'), ta, h('div', { class: 'linha', style: 'margin-top:10px' }, h('button', { class: 'btn p', onclick: () => { const r = (window.DoraLogica2 ? window.DoraLogica2.parseEditalVertical(ta.value).disciplinas : L.parseEdital(ta.value)); if (!r.length) { App.toast('Não achei tópicos nesse texto. Confira se colou o conteúdo programático.', true); return; } proporEdital(r); } }, 'Propor disciplinas e tópicos'), h('button', { class: 'btn', onclick: async () => { const nome = await App.pedir('Nova disciplina', 'Nome da disciplina'); if (!nome) return; await App.inserirEdital(c.id, [{ nome, topicos: [] }]); App.render(); } }, 'Criar disciplina em branco')));
    };
    function proporEdital(props) {
      const lista = h('div', { class: 'pilha' }); const marcas = [];
      props.forEach((p, i) => { const cb = h('input', { type: 'checkbox', checked: true }); const nome = h('input', { type: 'text', value: p.nome, 'aria-label': 'Nome da disciplina' }); marcas.push({ cb, nome, p }); lista.append(h('div', { class: 'afundado' }, h('div', { class: 'linha' }, cb, h('div', { style: 'flex:1;min-width:140px' }, nome), h('span', { class: 'chip' }, p.topicos.length + ' tópicos')), h('div', { class: 'muted peq', style: 'margin-top:6px' }, p.topicos.slice(0, 4).map(t => ' '.repeat(t.nivel - 1) + '• ' + t.titulo).join('  |  ') + (p.topicos.length > 4 ? '  …' : '')))); });
      const m = App.modal('Confira a proposta', h('div', { class: 'pilha' }, h('p', { class: 'muted' }, 'Desmarque o que não for disciplina e corrija os nomes. Depois você ajusta cada tópico na tela do edital.'), lista, h('button', { class: 'btn p', onclick: async () => { const ok = marcas.filter(x => x.cb.checked).map(x => Object.assign({}, x.p, { nome: x.nome.value.trim() || x.p.nome })); if (!ok.length) { App.toast('Marque pelo menos uma disciplina.', true); return; } const r = await App.inserirEdital(c.id, ok); m.fechar(); App.toast(r.disciplinas + ' disciplinas e ' + r.topicos + ' tópicos criados.'); App.render(); } }, 'Criar disciplinas e tópicos')), { larga: true });
    }
    if (!App.S.disciplinas.length) { alvo.append(caixaCola()); return; }
    const total = App.S.disciplinas.reduce((a, d) => a + (+d.peso || 0), 0); const notas = App.mapaNotas();
    alvo.append(h('div', { class: 'cartao' }, h('div', { class: 'linha entre' }, h('div', {}, h('b', {}, App.S.disciplinas.length + ' disciplinas · ' + App.S.topicos.length + ' tópicos · ' + total + ' questões na prova')), h('div', { class: 'muted peq' }, 'Peso = número de questões da disciplina (usado nas prioridades). Relevância e dificuldade vão de 1 a 5; domínio é o quanto você acha que sabe (0 a 100).'))));
    const reordenar = async (discId) => { const mudou = []; const grupos = {}; App.S.topicos.filter(t => t.disciplinaId === discId).forEach(t => (grupos[t.paiId || ''] = grupos[t.paiId || ''] || []).push(t)); for (const k in grupos) grupos[k].sort((a, b) => a.ordem - b.ordem).forEach((t, i) => { if (t.ordem !== i) { t.ordem = i; mudou.push(t); } }); await DB.putMuitos('topicos', mudou); };
    for (const d of App.S.disciplinas) {
      const nos = App.arvore(d.id); const corpo = h('div', { class: 'arvore' });
      const num = (v, min, max, fn, rot) => h('select', { 'aria-label': rot, title: rot, onchange: (e) => fn(+e.target.value) }, [1, 2, 3, 4, 5].map(n => h('option', Object.assign({ value: n }, n === v ? { selected: true } : {}), n)));
      nos.forEach(({ t, nivel }) => {
        const irmaos = App.S.topicos.filter(x => x.disciplinaId === d.id && (x.paiId || null) === (t.paiId || null)).sort((a, b) => a.ordem - b.ordem); const idx = irmaos.findIndex(x => x.id === t.id);
        const salvaT = async () => { await App.salvar('topicos', t); };
        const botoes = h('div', { class: 'linha', style: 'gap:4px' },
          h('button', { class: 'btn mini', title: 'Subir', 'aria-label': 'Subir', disabled: idx === 0, onclick: async () => { const o = irmaos[idx - 1]; [o.ordem, t.ordem] = [t.ordem, o.ordem]; await DB.putMuitos('topicos', [o, t]); App.render(); } }, '↑'),
          h('button', { class: 'btn mini', title: 'Descer', 'aria-label': 'Descer', disabled: idx === irmaos.length - 1, onclick: async () => { const o = irmaos[idx + 1]; [o.ordem, t.ordem] = [t.ordem, o.ordem]; await DB.putMuitos('topicos', [o, t]); App.render(); } }, '↓'),
          h('button', { class: 'btn mini', title: 'Virar subtópico do item de cima', 'aria-label': 'Virar subtópico', disabled: idx === 0, onclick: async () => { t.paiId = irmaos[idx - 1].id; t.ordem = 999; await salvaT(); await reordenar(d.id); App.render(); } }, '→'),
          h('button', { class: 'btn mini', title: 'Subir um nível', 'aria-label': 'Subir um nível', disabled: !t.paiId, onclick: async () => { const pai = App.topico(t.paiId); t.paiId = pai.paiId || null; t.ordem = pai.ordem + 0.5; await salvaT(); await reordenar(d.id); App.render(); } }, '←'),
          h('button', { class: 'btn mini', title: 'Renomear', 'aria-label': 'Renomear', onclick: async () => { const v = await App.pedir('Renomear tópico', 'Título', t.titulo); if (v) { t.titulo = v; await salvaT(); App.render(); } } }, 'Editar'),
          h('button', { class: 'btn mini', title: 'Novo subtópico', 'aria-label': 'Novo subtópico', onclick: async () => { const v = await App.pedir('Novo subtópico de "' + t.titulo + '"', 'Título'); if (!v) return; await App.salvar('topicos', { id: L.uid('t'), concursoId: c.id, disciplinaId: d.id, paiId: t.id, titulo: v, ordem: 999, relevancia: 3, dificuldade: 3, dominio: null, nota: null, notaHtml: '', mapa: null, quadro: null, comoBanca: '', ultEstudo: null, proxRev: null, criado: Date.now() }); await reordenar(d.id); App.render(); } }, '+'),
          h('button', { class: 'btn mini perigo', title: 'Apagar', 'aria-label': 'Apagar tópico', onclick: async () => { const ids = [t.id]; const colhe = (id) => App.filhos(id).forEach(f => { ids.push(f.id); colhe(f.id); }); colhe(t.id); if (!(await App.confirmar('Apagar "' + t.titulo + '"' + (ids.length > 1 ? ' e seus ' + (ids.length - 1) + ' subtópicos' : '') + '? As notas, o mapa e o quadro deste tópico se perdem. Cartões e questões ligados ficam sem tópico.', 'Apagar'))) return; App.S.topicos = App.S.topicos.filter(x => !ids.includes(x.id)); await DB.delMuitos('topicos', ids); for (const loja of ['cartoes', 'questoes']) for (const x of App.S[loja].filter(y => ids.includes(y.topicoId))) { x.topicoId = null; await DB.put(loja, x); } App.render(); } }, '✕'));
        corpo.append(h('div', { class: 'no-t', style: 'margin-left:' + Math.min(nivel, 4) * 16 + 'px' }, h('div', { style: 'min-width:0' }, h('a', { class: 'tit', href: '#/topico/' + t.id }, t.titulo), h('div', { class: 'meta' },
          h('label', { class: 'peq muted' }, 'Relevância ', num(t.relevancia || 3, 1, 5, async (v) => { t.relevancia = v; await salvaT(); }, 'Relevância de 1 a 5')),
          h('label', { class: 'peq muted' }, 'Dificuldade ', num(t.dificuldade || 3, 1, 5, async (v) => { t.dificuldade = v; await salvaT(); }, 'Dificuldade de 1 a 5')),
          h('label', { class: 'peq muted' }, 'Domínio ', h('input', { type: 'number', min: 0, max: 100, value: t.dominio == null ? '' : t.dominio, placeholder: '–', style: 'width:68px;min-height:34px;padding:2px 6px', 'aria-label': 'Domínio de 0 a 100', onchange: async (e) => { const v = e.target.value === '' ? null : Math.max(0, Math.min(100, +e.target.value)); t.dominio = v; await salvaT(); } })), botoes)), App.pillNota(notas[t.id])));
      });
      const peso = h('input', { type: 'number', min: 0, max: 500, value: d.peso == null ? 10 : d.peso, style: 'width:80px', 'aria-label': 'Número de questões de ' + d.nome, onchange: async (e) => { d.peso = Math.max(0, +e.target.value || 0); await App.salvar('disciplinas', d); } });
      alvo.append(h('div', { class: 'cartao' }, h('div', { class: 'linha entre', style: 'margin-bottom:10px' }, h('h2', { style: 'margin:0' }, d.nome), h('div', { class: 'linha' }, h('button', { class: 'btn mini', onclick: async () => { const v = await App.pedir('Renomear disciplina', 'Nome', d.nome); if (v) { d.nome = v; await App.salvar('disciplinas', d); App.render(); } } }, 'Renomear'), h('button', { class: 'btn mini', onclick: async () => { const v = await App.pedir('Novo tópico em ' + d.nome, 'Título'); if (!v) return; await App.salvar('topicos', { id: L.uid('t'), concursoId: c.id, disciplinaId: d.id, paiId: null, titulo: v, ordem: 999, relevancia: 3, dificuldade: 3, dominio: null, nota: null, notaHtml: '', mapa: null, quadro: null, comoBanca: '', ultEstudo: null, proxRev: null, criado: Date.now() }); await reordenar(d.id); App.render(); } }, '+ Tópico'), h('button', { class: 'btn mini perigo', onclick: async () => { if (!(await App.confirmar('Apagar a disciplina "' + d.nome + '" e todos os seus tópicos?', 'Apagar'))) return; const ids = App.S.topicos.filter(t => t.disciplinaId === d.id).map(t => t.id); App.S.topicos = App.S.topicos.filter(t => t.disciplinaId !== d.id); await DB.delMuitos('topicos', ids); await App.remover('disciplinas', d.id); App.render(); } }, 'Apagar'))), nos.length ? corpo : h('div', { class: 'vazio' }, 'Sem tópicos ainda.')));
    }
    alvo.append(caixaCola());
  };
})();
