/* Dora Draw — telas e ligações da quarta leva (a lógica pura está em logica4.js e logica3.js, testada em testes\logica4.test.js):
   relevância do edital, caderno e fase do tópico, registrar estudo, trilha do dia, evolução, Dora Cartas (lote, omissão, oclusão,
   simulado, retenção), Dora Ciclo por horas/questões, concursos como objetivos, menu escondido, resumo da semana em PNG e
   resumo de superfície na Estante. Embrulha views que já existem chamando a original primeiro. Obra original. */
(function () {
  const App = window.App, { L, h, DB } = App, V = App.views, L3 = window.DoraLogica3, L4 = window.DoraLogica4, G = window.DoraLogica2;
  const ls = (k, p) => { try { const v = localStorage.getItem(k); return v == null ? p : JSON.parse(v); } catch (e) { return p; } };
  const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* sem armazenamento */ } };
  const copiar = async (texto) => { try { await navigator.clipboard.writeText(texto); return true; } catch (e) { try { const t = h('textarea', { style: 'position:fixed;opacity:0' }, texto); document.body.append(t); t.select(); const ok = document.execCommand('copy'); t.remove(); return ok; } catch (er) { return false; } } };
  const seg = (opcoes, valor, aoMudar, rot) => { const el = h('div', { class: 'seg', role: 'group', 'aria-label': rot || 'Opções' }); const pinta = (v) => [...el.children].forEach(b => b.setAttribute('aria-pressed', String(b.dataset.k === String(v)))); opcoes.forEach(([k, n]) => el.append(h('button', { type: 'button', 'data-k': k, onclick: () => { pinta(k); aoMudar(k); } }, n))); pinta(valor); return el; };
  const selecao = (opcoes, valor, aoMudar, rot) => h('select', { 'aria-label': rot, onchange: (e) => aoMudar(e.target.value) }, opcoes.map(([k, n]) => h('option', Object.assign({ value: k }, String(valor) === String(k) ? { selected: true } : {}), n)));
  const folhas = () => App.S.topicos.filter(App.ehFolha);
  const fases = () => L4.fasesDosTopicos(App.S.topicos, App.S.respostas);
  const chipFase = (f) => h('span', { class: 'chip ' + (f === 'novo' ? '' : f === 'descoberta' ? 'aviso' : f === 'consolidacao' ? 'azul' : 'ok'), 'data-fase': f, title: 'Fase do tópico pelas suas respostas' }, L4.ROTULO_FASE[f] || f);
  const abrirLink = (u) => { if (L4.urlValida(u)) window.open(u, '_blank', 'noopener,noreferrer'); else App.toast('Esse endereço precisa começar com http:// ou https://', true); };

  // =====================================================================
  // 1. Dora Edital: relevância pelas questões da banca
  // =====================================================================
  const SISTEMA_EDITAL = 'Você organiza editais de concurso e estima relevância pela quantidade de questões. Responda só no formato pedido, em português, sem inventar tópicos.';
  async function gravarRelevancia(linhas) { // linhas: [{topicoId, valor}]
    const mudou = []; linhas.forEach(l => { const t = App.topico(l.topicoId); if (t && (t.relevancia !== l.valor || t.relevanciaOrigem !== 'edital')) { t.relevancia = l.valor; t.relevanciaOrigem = 'edital'; mudou.push(t); } });
    if (mudou.length) await DB.putMuitos('topicos', mudou); return mudou.length;
  }
  // prévia editável: cada tópico com um seletor 1–5. Se o edital já existe, grava a relevância nos tópicos; se não, cria o edital já com a relevância
  function previaRelevancia(lida, textoEdital) {
    const existe = App.S.topicos.length > 0; const sel5 = (v, rot) => h('select', { 'aria-label': rot, 'data-rel-sel': '1' }, [1, 2, 3, 4, 5].map(n => h('option', Object.assign({ value: n }, n === v ? { selected: true } : {}), '★ ' + n)));
    const corpo = h('div', { class: 'pilha', 'data-previa-relevancia': '1' }); const linhas = []; let proposta = null;
    if (existe) {
      const rows = L4.relevanciaParaExistentes({ disciplinas: App.S.disciplinas, topicos: App.S.topicos, lida }); const comNova = rows.filter(r => r.nova).length;
      corpo.append(h('p', { class: 'muted peq', style: 'margin:0' }, comNova + ' de ' + rows.length + ' tópicos receberam relevância. Os outros ficam como estão (marcados "mantém"). Ajuste o que quiser e só então grave.'));
      let disc = null; rows.forEach(r => { if (r.disciplina !== disc) { disc = r.disciplina; corpo.append(h('div', { class: 'rotulo', style: 'margin-top:8px' }, disc)); } const s = sel5(r.nova || r.atual, 'Relevância de ' + r.titulo); linhas.push({ topicoId: r.topicoId, s }); corpo.append(h('div', { class: 'linha entre afundado', style: 'padding:6px 10px' }, h('span', { style: 'min-width:0;overflow-wrap:anywhere' }, r.titulo), h('span', { class: 'linha' }, h('span', { class: 'muted peq' }, r.nova ? 'era ' + r.atual : 'mantém'), s))); });
    } else {
      proposta = lida.map(d => ({ nome: d.nome, topicos: d.topicos.map(t => ({ titulo: t.titulo, nivel: t.nivel, relevancia: t.relevancia })) }));
      corpo.append(h('p', { class: 'muted peq', style: 'margin:0' }, 'O edital ainda não foi montado: ao gravar, as disciplinas e os tópicos são criados já com a relevância abaixo.'));
      proposta.forEach(d => { corpo.append(h('div', { class: 'rotulo', style: 'margin-top:8px' }, d.nome)); d.topicos.forEach(t => { const s = sel5(t.relevancia || 3, 'Relevância de ' + t.titulo); linhas.push({ t, s }); corpo.append(h('div', { class: 'linha entre afundado', style: 'padding:6px 10px' }, h('span', { style: 'min-width:0;overflow-wrap:anywhere;padding-left:' + (t.nivel - 1) * 14 + 'px' }, t.titulo), s)); }); });
    }
    const m = App.modal('Confira a relevância', corpo, { larga: true });
    corpo.append(h('div', { class: 'linha', style: 'margin-top:10px' }, h('button', { class: 'btn p', type: 'button', 'data-gravar-relevancia': '1', onclick: async () => {
      if (existe) { const n = await gravarRelevancia(linhas.map(l => ({ topicoId: l.topicoId, valor: +l.s.value }))); m.fechar(); App.toast(n + ' tópicos com relevância nova. Ela já pesa nas prioridades.'); }
      else { linhas.forEach(l => { l.t.relevancia = +l.s.value; }); const r = await App.inserirEdital(App.S.conc.id, proposta); m.fechar(); App.toast(r.disciplinas + ' disciplinas e ' + r.topicos + ' tópicos criados com relevância.'); }
      App.render(); } }, 'Gravar'), h('button', { class: 'btn', type: 'button', onclick: () => m.fechar() }, 'Cancelar')));
  }
  function cartaoRelevancia() {
    const existe = App.S.topicos.length > 0; const temIA = !!(App.ia && App.ia.temIA());
    const edital = h('textarea', { 'aria-label': 'Edital', 'data-rel-edital': '1', style: 'min-height:110px', placeholder: existe ? 'Opcional: o edital que já está montado no app é usado.' : 'Cole aqui o conteúdo programático do edital.' });
    const indice = h('textarea', { 'aria-label': 'Índice com quantidade de questões', 'data-rel-indice': '1', style: 'min-height:130px', placeholder: 'Cole o índice de assuntos com a quantidade de questões de cada um. Ex.:\nCrase ........ 120\nConcordância verbal (85)\nAtos administrativos 1.234' });
    const resposta = h('textarea', { 'aria-label': 'Resposta da IA', 'data-rel-resposta': '1', style: 'min-height:110px', placeholder: 'Cole aqui a resposta, no formato:\n1 PORTUGUÊS\n1.1 Crase [5]\n1.2 Concordância [4]' });
    const textoEdital = () => edital.value.trim() || (existe ? L4.editalParaPrompt(App.S.disciplinas, App.S.topicos) : '');
    const prompt = () => { if (indice.value.trim().length < 5) { App.toast('Cole o índice de questões primeiro.', true); return null; } const e = textoEdital(); if (!e) { App.toast('Cole o texto do edital (o app ainda não tem um montado).', true); return null; } return L4.promptCruzamento(e, indice.value); };
    const lerEUsar = (texto) => { const r = L4.lerRespostaCruzamento(texto); if (!r.total) { App.toast('Não achei linhas como "1.1 Tópico [5]" nessa resposta.', true); return; } if (!r.comRel) App.toast('A resposta veio sem relevância [1 a 5]: os tópicos ficam como estão.', true); previaRelevancia(r.disciplinas, textoEdital()); };
    const bIA = h('button', { class: 'btn p', type: 'button', 'data-rel-ia': '1', onclick: async (ev) => { const p = prompt(); if (!p) return; App.rodando(ev.target, 'Cruzando...'); try { const r = await App.ia.chamar({ sistema: SISTEMA_EDITAL, prompt: p }); lerEUsar(r.texto); } catch (e) { App.toast(e.message, true); } ev.target.disabled = false; ev.target.textContent = 'Cruzar com a IA'; } }, 'Cruzar com a IA');
    const bCopiar = h('button', { class: 'btn' + (temIA ? '' : ' p'), type: 'button', 'data-rel-copiar': '1', onclick: async () => { const p = prompt(); if (!p) return; App.toast(await copiar(p) ? 'Prompt copiado. Cole em uma IA (a sua, no navegador) e traga a resposta aqui.' : 'Não consegui copiar.', false); } }, 'Copiar prompt');
    const bLocal = h('button', { class: 'btn', type: 'button', 'data-rel-local': '1', onclick: () => {
      const itens = L3.parseIndiceQuestoes(indice.value); if (!itens.length) { App.toast('Não achei "assunto … quantidade" no índice.', true); return; }
      let discs; if (existe) discs = App.S.disciplinas.map(d => ({ nome: d.nome, topicos: App.S.topicos.filter(t => t.disciplinaId === d.id).map(t => ({ titulo: t.titulo, nivel: 1 })) })); else { if (!edital.value.trim()) { App.toast('Cole o texto do edital.', true); return; } discs = G.parseEditalVertical(edital.value).disciplinas.map(d => ({ nome: d.nome, topicos: d.topicos.map(t => ({ titulo: t.titulo, nivel: t.nivel })) })); }
      const todos = []; discs.forEach(d => d.topicos.forEach(t => todos.push(t))); const r = L4.casarIndice(todos, itens); r.forEach((x, i) => { todos[i].relevancia = x.relevancia; });
      const casou = r.filter(x => x.qtd != null).length; App.toast(casou + ' de ' + todos.length + ' tópicos casaram com o índice. Confira na prévia.'); previaRelevancia(discs, textoEdital()); } }, 'Cruzar sozinho (sem IA)');
    const blocoResp = h('div', { class: 'pilha' }, h('label', { class: 'campo' }, h('span', {}, temIA ? 'Ou cole a resposta de outra IA' : 'Cole aqui a resposta da IA'), resposta), h('div', { class: 'linha' }, h('button', { class: 'btn', type: 'button', 'data-rel-ler': '1', onclick: () => lerEUsar(resposta.value) }, 'Ler resposta e ver a prévia')));
    return h('div', { class: 'cartao', 'data-relevancia': '1' }, h('h2', {}, 'Relevância pelas questões da banca'), h('p', { class: 'muted peq' }, 'Cole o índice de uma plataforma de questões (assunto e quantidade). O app cruza com o edital e dá a cada tópico uma relevância de 1 a 5 (o assunto mais cobrado vale 5). Você confere a prévia antes de gravar. A relevância entra no cálculo de "o que estudar primeiro" e aparece na Dora Vertical.'),
      h('div', { class: 'grade2' }, h('label', { class: 'campo' }, h('span', {}, existe ? 'Edital (opcional)' : 'Edital'), edital), h('label', { class: 'campo' }, h('span', {}, 'Índice com quantidade de questões'), indice)),
      h('div', { class: 'linha', style: 'margin:8px 0' }, temIA ? bIA : null, bCopiar, bLocal), temIA ? h('details', {}, h('summary', {}, 'Colar a resposta de outra IA'), blocoResp) : blocoResp);
  }

  // fase, caderno e filtros na lista do edital
  const edOrig = V.edital;
  V.edital = async (alvo, r) => {
    await edOrig(alvo, r); if (!App.S.conc) return;
    alvo.append(cartaoRelevancia());
    if (!App.S.topicos.length) return;
    const fs = fases(); const porId = {}; App.S.topicos.forEach(t => { porId[t.id] = t; }); const linhas = [];
    alvo.querySelectorAll('.no-t').forEach(no => { const a = no.querySelector('a.tit[href^="#/topico/"]'); if (!a) return; const id = a.getAttribute('href').split('/').pop().split('?')[0]; const t = porId[id]; if (!t) return; const meta = no.querySelector('.meta'); if (meta) { meta.prepend(chipFase(fs[id])); if (!L4.semCaderno(t)) meta.append(h('a', { class: 'chip azul', href: t.caderno, target: '_blank', rel: 'noopener noreferrer', title: 'Abrir o caderno de questões deste tópico', 'data-caderno-link': '1' }, 'Caderno')); } linhas.push({ no, t, fase: fs[id] }); });
    const st = { semCad: false, fase: '' }; const info = h('span', { class: 'chip', 'data-filtro-info': '1' });
    const aplica = () => { let n = 0; linhas.forEach(l => { const ok = (!st.semCad || L4.semCaderno(l.t)) && (!st.fase || l.fase === st.fase); l.no.style.display = ok ? '' : 'none'; if (ok) n++; }); info.textContent = n + ' de ' + linhas.length + ' tópicos'; };
    const barra = h('div', { class: 'cartao nao-imprime', 'data-edital-filtros': '1' }, h('div', { class: 'linha' }, h('label', { class: 'marca-op' }, h('input', { type: 'checkbox', 'data-sem-caderno': '1', onchange: (e) => { st.semCad = e.target.checked; aplica(); } }), h('span', {}, 'Só tópicos sem caderno de questões')), h('label', { class: 'campo' }, h('span', {}, 'Fase'), selecao([['', 'Todas']].concat(L3.FASES), '', (v) => { st.fase = v; aplica(); }, 'Filtrar por fase')), info));
    const h1 = alvo.querySelector('h1'); if (h1) h1.after(barra); else alvo.prepend(barra); aplica();
  };

  // =====================================================================
  // 2. Tópico: caderno de questões e fase
  // =====================================================================
  const topOrig = V.topico;
  V.topico = async (alvo, r) => {
    await topOrig(alvo, r); const t = App.topico(r.args[0]); if (!t) return;
    const h1 = alvo.querySelector('h1'); if (h1) { const cf = chipFase(fases()[t.id]); cf.style.cssText = 'font-size:.45em;vertical-align:middle'; h1.append(' ', cf); }
    if ((r.query.aba || 'resumo') !== 'resumo') return;
    const url = h('input', { type: 'url', 'data-caderno-url': '1', value: t.caderno || '', placeholder: 'https://... (endereço do caderno de questões deste tópico)', 'aria-label': 'Link do caderno de questões' });
    const abre = h('button', { class: 'btn p', type: 'button', 'data-abrir-caderno': '1', disabled: L4.semCaderno(t), onclick: () => abrirLink(url.value.trim()) }, 'Abrir caderno');
    url.addEventListener('input', () => { abre.disabled = !L4.urlValida(url.value.trim()); });
    url.addEventListener('change', async () => { const v = url.value.trim(); if (v && !L4.urlValida(v)) { App.toast('O link precisa começar com http:// ou https://', true); return; } t.caderno = v; await App.salvar('topicos', t); App.toast(v ? 'Link do caderno salvo.' : 'Link do caderno removido.'); App.render(); });
    alvo.append(h('div', { class: 'cartao', 'data-caderno': '1' }, h('h3', {}, 'Link do caderno de questões'), h('p', { class: 'muted peq' }, 'Cole o endereço do caderno deste tópico na plataforma de questões que você usa. O botão abre em outra aba. Tópicos sem caderno aparecem no filtro da Dora Edital.'), h('label', { class: 'campo' }, h('span', {}, 'Endereço'), url), h('div', { class: 'linha', style: 'margin-top:8px' }, abre)));
  };

  // =====================================================================
  // 3. Registrar estudo (fim do Dora Foco ou da sessão da Dora Pena; "esqueci o timer")
  // =====================================================================
  App.registrarEstudoModal = ({ sessao = null, esqueci = false } = {}) => {
    const c = App.S.conc; if (!c || !App.S.topicos.length) return null; let topicoId = sessao ? sessao.topicoId : null; let dominio = null; const formas = new Set();
    const dominioDe = (id) => { const t = App.topico(id); return t && t.dominioDeclarado != null ? t.dominioDeclarado : null; }; dominio = dominioDe(topicoId);
    const nq = h('input', { type: 'number', min: 0, value: 0, style: 'width:100px', 'aria-label': 'Questões feitas', 'data-re-q': '1' }); const na = h('input', { type: 'number', min: 0, value: 0, style: 'width:100px', 'aria-label': 'Acertos', 'data-re-a': '1' });
    const min = h('input', { type: 'number', min: 1, max: 720, placeholder: 'ex.: 45', style: 'width:120px', 'aria-label': 'Minutos estudados', 'data-re-min': '1' });
    const segDom = h('div', { class: 'seg', role: 'group', 'aria-label': 'Quanto você domina o tópico, de 0 a 5' }); const pinta = () => [...segDom.children].forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.dom === dominio)));
    for (let n = 0; n <= 5; n++) segDom.append(h('button', { type: 'button', 'data-dom': n, onclick: () => { dominio = dominio === n ? null : n; pinta(); } }, String(n))); pinta();
    const selT = App.selTopico(topicoId, (v) => { topicoId = v; dominio = dominioDe(v); pinta(); }, true, 'Tópico estudado');
    const caixas = L4.FORMAS.map(([k, n]) => h('label', { class: 'marca-op' }, h('input', { type: 'checkbox', 'data-forma': k, onchange: (e) => e.target.checked ? formas.add(k) : formas.delete(k) }), h('span', {}, n)));
    const corpo = h('div', { class: 'pilha', 'data-registrar-estudo': '1' },
      h('p', { class: 'muted peq', style: 'margin:0' }, sessao ? 'Sessão de ' + sessao.minutos + ' min salva. Conte rápido como foi (tudo é opcional, menos o tópico).' : 'Esqueceu de ligar o timer? Diga quantos minutos estudou: o registro termina agora.'),
      h('label', { class: 'campo' }, h('span', {}, 'Tópico' + (sessao && !sessao.topicoId ? ' (você não tinha escolhido um)' : '')), selT), sessao ? null : h('label', { class: 'campo' }, h('span', {}, 'Minutos estudados'), min),
      h('div', {}, h('div', { class: 'rotulo', style: 'margin-bottom:4px' }, 'Domínio agora (0 = não sei nada, 5 = dominei)'), segDom),
      h('div', { class: 'linha' }, h('label', { class: 'campo' }, h('span', {}, 'Questões feitas'), nq), h('label', { class: 'campo' }, h('span', {}, 'Acertos'), na)),
      h('div', {}, h('div', { class: 'rotulo', style: 'margin-bottom:4px' }, 'Como você estudou'), h('div', { class: 'linha' }, caixas)));
    const m = App.modal(sessao ? 'Registrar este estudo' : 'Registrar estudo (esqueci o timer)', corpo);
    corpo.append(h('div', { class: 'linha' }, h('button', { class: 'btn p', type: 'button', 'data-re-salvar': '1', onclick: async (ev) => {
      if (!sessao && min.value !== '' && !L4.minutosEsquecidos(min.value)) { App.toast('Informe os minutos entre 1 e 720.', true); return; } if (!sessao && min.value === '' && !(+nq.value > 0)) { App.toast('Informe os minutos estudados (ou as questões feitas).', true); return; }
      const r = L4.montarRegistroEstudo({ concursoId: c.id, topicoId, sessao, minutos: sessao ? 0 : +min.value || 0, dominio, questoes: nq.value, acertos: na.value, formas: [...formas] }); if (r.erro) { App.toast(r.erro, true); return; }
      ev.target.disabled = true; if (r.sessao) await App.salvar('sessoes', r.sessao); if (r.resposta) await App.salvar('respostas', r.resposta);
      const t = App.topico(topicoId); if (r.dominio != null) { t.dominio = r.dominioPct; t.dominioDeclarado = r.dominio; await App.salvar('topicos', t); }
      if (r.sessao || r.resposta) await App.marcarEstudo(topicoId); else await App.recalcTopico(topicoId);
      m.fechar(); App.toast('Estudo registrado em "' + t.titulo + '".'); App.render(); } }, 'Salvar'), h('button', { class: 'btn', type: 'button', onclick: () => m.fechar() }, 'Agora não')));
    return m;
  };
  const focoOrig = V.foco;
  V.foco = async (alvo, r) => {
    await focoOrig(alvo, r); if (!App.S.conc || !App.S.topicos.length) return;
    alvo.append(h('div', { class: 'cartao', 'data-esqueci-timer': '1' }, h('div', { class: 'linha entre' }, h('div', {}, h('b', {}, 'Esqueci o timer'), h('div', { class: 'muted peq' }, 'Estudou e não ligou o cronômetro? Informe os minutos, o domínio, as questões e como estudou.')), h('button', { class: 'btn p', type: 'button', 'data-esqueci-btn': '1', onclick: () => App.registrarEstudoModal({ esqueci: true }) }, 'Registrar estudo sem timer'))));
  };

  // =====================================================================
  // 4. Hoje: trilha do dia. Evolução por tópico
  // =====================================================================
  const hojeOrig = V.hoje;
  V.hoje = async (alvo, r) => {
    await hojeOrig(alvo, r); if (!App.S.conc || !App.S.topicos.length) return;
    const caixa = h('div', { class: 'cartao', 'data-trilha': '1' }); let cota = Math.max(5, Math.min(300, +ls('doraDraw.trilha-cota', 30) || 30));
    const desenha = () => {
      const tr = L3.trilhaDoDia({ topicos: folhas(), respostas: App.S.respostas, hoje: App.hoje(), cota }); const novos = tr.lotes.filter(l => !l.voltarAVer), rever = tr.lotes.filter(l => l.voltarAVer);
      const linha = (l) => { const t = App.topico(l.topicoId); return h('div', { class: 'no-t' }, h('div', { style: 'min-width:0' }, h('a', { class: 'tit', href: '#/topico/' + l.topicoId }, l.titulo), h('div', { class: 'meta' }, chipFase(l.fase), l.voltarAVer ? h('span', { class: 'chip azul' }, 'voltar a ver') : null)), h('div', { class: 'linha', style: 'gap:6px' }, h('span', { class: 'chip' }, l.questoes + (l.questoes === 1 ? ' questão' : ' questões')), t && !L4.semCaderno(t) ? h('button', { class: 'btn mini', type: 'button', 'data-trilha-caderno': '1', onclick: () => abrirLink(t.caderno) }, 'Abrir caderno') : h('a', { class: 'btn mini', href: '#/topico/' + l.topicoId + '?aba=questoes' }, 'Questões'))); };
      const num = h('input', { type: 'number', min: 5, max: 300, step: 5, value: cota, style: 'width:90px', 'aria-label': 'Cota de questões do dia', onchange: (e) => { cota = Math.max(5, Math.min(300, +e.target.value || 30)); lsSet('doraDraw.trilha-cota', cota); desenha(); } });
      caixa.replaceChildren(h('div', { class: 'linha entre', style: 'margin-bottom:8px' }, h('h2', { style: 'margin:0' }, 'Trilha do dia'), h('label', { class: 'peq muted' }, 'Cota de questões ', num)), h('p', { class: 'muted peq' }, 'Lotes de questões por tópico até completar a cota: primeiro o que está em consolidação, depois descoberta e tópicos novos. Tópicos dominados só voltam depois de 3 semanas sem ver.'),
        novos.length ? h('div', { class: 'arvore' }, novos.map(linha)) : h('div', { class: 'vazio' }, 'Nada a fazer na trilha: todos os tópicos estão dominados ou sem respostas ainda.'), rever.length ? h('div', { style: 'margin-top:10px' }, h('div', { class: 'rotulo' }, 'Voltar a ver'), h('div', { class: 'arvore' }, rever.map(linha))) : null, h('div', { class: 'muted peq', style: 'margin-top:8px' }, tr.total + ' de ' + tr.cota + ' questões na trilha de hoje.'));
    };
    desenha(); alvo.append(caixa);
  };
  V.evolucao = async (alvo) => {
    if (!App.exigeEdital(alvo)) return; alvo.append(h('h1', {}, 'Evolução'), h('p', { class: 'muted' }, 'Como mudou a sua taxa de acerto em cada tópico: os últimos dias contra o período anterior do mesmo tamanho.'));
    const janela = ls('doraDraw.evolucao-janela', 14); const lista = App.S.topicos.length ? L3.evolucaoTopicos({ respostas: App.S.respostas, hoje: App.hoje(), janela, minimo: 3 }) : [];
    alvo.append(h('div', { class: 'cartao nao-imprime' }, h('div', { class: 'linha' }, h('label', { class: 'campo' }, h('span', {}, 'Janela de comparação'), selecao([[7, '7 dias'], [14, '14 dias'], [30, '30 dias']], janela, (v) => { lsSet('doraDraw.evolucao-janela', +v); App.render(); }, 'Janela de comparação')), h('a', { class: 'btn', href: '#/erros' }, 'Diário de Batalha'))));
    const linha = (e) => h('div', { class: 'no-t', 'data-evolucao-linha': '1' }, h('div', { style: 'min-width:0' }, h('a', { class: 'tit', href: '#/topico/' + e.topicoId }, App.nomeTopico(e.topicoId)), h('div', { class: 'peq muted' }, e.antes + '% → ' + e.atual + '%')), h('span', { class: 'chip ' + (e.delta > 0 ? 'ok' : e.delta < 0 ? 'ruim' : '') }, (e.delta > 0 ? '+' : '') + e.delta + ' pontos'));
    const sobe = lista.filter(e => e.delta > 0), cai = lista.filter(e => e.delta < 0).sort((a, b) => a.delta - b.delta), igual = lista.filter(e => e.delta === 0);
    if (!lista.length) { alvo.append(h('div', { class: 'cartao vazio' }, App.vazioFig('sem-estatisticas'), h('p', {}, 'Ainda não há dados para comparar.'), h('p', { class: 'muted peq' }, 'Preciso de pelo menos 3 respostas no tópico nos últimos ' + janela + ' dias e 3 nos ' + janela + ' dias anteriores.'))); return; }
    alvo.append(h('div', { class: 'grade2' }, h('div', { class: 'cartao' }, h('h2', {}, 'Subiram (' + sobe.length + ')'), sobe.length ? h('div', { class: 'arvore' }, sobe.map(linha)) : h('div', { class: 'vazio' }, 'Nenhum tópico subiu.')), h('div', { class: 'cartao' }, h('h2', {}, 'Caíram (' + cai.length + ')'), cai.length ? h('div', { class: 'arvore' }, cai.map(linha)) : h('div', { class: 'vazio' }, 'Nenhum tópico caiu.'))));
    if (igual.length) alvo.append(h('div', { class: 'cartao' }, h('h3', {}, 'Estáveis (' + igual.length + ')'), h('div', { class: 'arvore' }, igual.map(linha))));
  };
  const errosOrig = V.erros;
  V.erros = async (alvo, r) => {
    await errosOrig(alvo, r); const b = alvo.querySelector('[data-estudo-reverso-btn]'); if (b && !alvo.querySelector('[data-evolucao-btn]')) b.after(h('a', { class: 'btn', href: '#/evolucao', 'data-evolucao-btn': '1' }, 'Evolução por tópico'));
  };

  // ida e volta com a Dora Guilda (Estúdio)
  App.exportarErrosGuilda = () => { const j = L4.errosParaGuilda(App.S.erros, { topicos: App.S.topicos, disciplinas: App.S.disciplinas, respostas: App.S.respostas, cartoes: App.S.cartoes, questoes: App.S.questoes, hoje: App.hoje() }); App.baixar('dora-guilda-erros-' + App.hoje() + '.json', JSON.stringify(j, null, 2), 'application/json;charset=utf-8'); return j.erros.length; };
  App.importarErrosGuilda = (texto) => {
    const r = L4.lerErrosDaGuilda(texto); if (r.erro) { App.toast(r.erro, true); return null; } if (!r.itens.length) { App.toast('Não achei erros nesse arquivo.', true); return null; }
    const pv = L4.previaErrosGuilda(r.itens, { erros: App.S.erros, topicos: App.S.topicos, disciplinas: App.S.disciplinas }); const novos = pv.filter(x => !x.duplicado);
    const m = App.modal('Importar da Dora Guilda', h('div', { class: 'pilha', 'data-previa-guilda': '1' }, h('p', {}, h('b', {}, novos.length + ' erros novos'), ' de ' + pv.length + '. ' + (pv.length - novos.length) + ' já existem (mesmo id) e serão pulados. ' + novos.filter(x => x.topicoId).length + ' ligam a um tópico pelo título.'),
      h('div', { class: 'pilha' }, pv.slice(0, 8).map(x => h('div', { class: 'afundado peq' }, h('span', { class: 'chip ' + (x.duplicado ? '' : 'ruim') }, x.duplicado ? 'já existe' : x.tipo), ' ', x.enunciado.slice(0, 110), h('div', { class: 'muted' }, [x.disc, x.topico].filter(Boolean).join(' › '))))),
      h('button', { class: 'btn p', type: 'button', 'data-importar-guilda': '1', disabled: !novos.length, onclick: async () => { let n = 0, nc = 0; const jaC = new Set(App.S.cartoes.map(c => L3.chaveCartao(c.frente))); for (const it of novos) { const e = L4.erroDaGuilda(it, App.S.conc.id, App.hoje()); App.S.erros.push(e); await DB.put('erros', e); n++; for (const c of it.cartas) { if (jaC.has(L3.chaveCartao(c.f))) continue; jaC.add(L3.chaveCartao(c.f)); await App.salvar('cartoes', { id: L.uid('c'), concursoId: App.S.conc.id, topicoId: it.topicoId || null, tipo: 'basico', frente: c.f, verso: c.b, origem: 'guilda', criado: Date.now() + nc }); nc++; } } m.fechar(); App.toast(n + ' erros importados' + (nc ? ' e ' + nc + ' cartas criadas' : '') + '.'); App.render(); } }, 'Importar ' + novos.length + ' erros')));
    return pv;
  };
  const errosOrig2 = V.erros;
  V.erros = async (alvo, r) => {
    await errosOrig2(alvo, r); if (!App.S.conc) return; const arq = h('input', { type: 'file', accept: '.json,application/json', class: 'oculto', 'aria-label': 'Escolher arquivo de erros da Dora Guilda', onchange: async (e) => { const f = e.target.files[0]; e.target.value = ''; if (f) App.importarErrosGuilda(await f.text()); } });
    const caixa = h('div', { class: 'cartao nao-imprime', 'data-guilda-erros': '1' }, h('div', { class: 'linha' }, h('button', { class: 'btn', type: 'button', 'data-exportar-guilda': '1', disabled: !App.S.erros.length, onclick: () => { const n = App.exportarErrosGuilda(); App.toast(n + ' erros exportados (JSON).'); } }, 'Exportar para a Dora Guilda (Estúdio)'), h('button', { class: 'btn', type: 'button', 'data-guilda-arquivo': '1', onclick: () => arq.click() }, 'Importar da Dora Guilda'), arq), h('p', { class: 'muted peq', style: 'margin:6px 0 0' }, 'Arquivo JSON com os seus erros (tipo, tópico, cartas, análise e revisão). Na importação você vê a prévia e erros com o mesmo id não são repetidos.'));
    const h1 = alvo.querySelector('h1'); if (h1) h1.after(caixa); else alvo.prepend(caixa);
  };

  // =====================================================================
  // 5. Dora Cartas
  // =====================================================================
  const execOrig = App.executarItem;
  App.executarItem = (item, refTipo, o = {}) => {
    if (refTipo !== 'cartao' || item.tipo !== 'oclusao') return execOrig(item, refTipo, o);
    const raiz = h('div', { class: 'pilha' }); let revelado = false; const rets = item.retangulos || [];
    const img = h('img', { src: item.imagem, alt: 'Imagem com partes cobertas', style: 'display:block;max-width:100%;border-radius:10px' }); const area = h('div', { style: 'position:relative;display:inline-block;max-width:100%', 'data-oclusao': '1' }, img);
    const caixas = rets.map((r, j) => { const d = h('div', { style: 'position:absolute;box-sizing:border-box;left:' + r.x * 100 + '%;top:' + r.y * 100 + '%;width:' + r.w * 100 + '%;height:' + r.h * 100 + '%;display:grid;place-items:center;font-weight:700' }); area.append(d); return d; });
    const pinta = () => caixas.forEach((d, j) => { const alvo = j === item.alvo; d.textContent = alvo && !revelado ? '?' : ''; d.style.background = alvo && !revelado ? 'var(--ink)' : 'transparent'; d.style.color = 'var(--paper)'; d.style.border = alvo ? '2px solid ' + (revelado ? 'var(--ok)' : 'var(--accent)') : '1px dashed var(--line-forte)'; }); pinta();
    const verso = h('div', { class: 'oculto' }); const mostrar = h('button', { class: 'btn p', type: 'button', 'data-mostrar': '1', onclick: () => { revelado = true; pinta(); mostrar.classList.add('oculto'); verso.classList.remove('oculto'); } }, 'Mostrar a resposta');
    verso.append(h('div', { class: 'rotulo', style: 'margin-bottom:6px' }, 'Como foi?'), h('div', { class: 'linha' }, [['errei', 'Errei'], ['dificil', 'Difícil'], ['bom', 'Bom'], ['facil', 'Fácil']].map(([k, n]) => h('button', { class: 'btn' + (k === 'bom' ? ' p' : ''), type: 'button', 'data-resp': k, onclick: async () => { const rs = await App.registrarBasico(item, k); if (o.aoConcluir) o.aoConcluir(rs); } }, n))));
    raiz.append(h('div', { class: 'rotulo' }, o.titulo || 'Oclusão de imagem'), h('div', { class: 'muted peq' }, 'Qual é a parte coberta?'), area, mostrar, verso); return raiz;
  };
  const edCartaOrig = App.editarCartao;
  App.editarCartao = (c, topicoId, aoSalvar) => { if (c && c.tipo === 'oclusao') { App.toast('Cartões de oclusão não se editam: apague e crie de novo em Dora Cartas.', true); return; } return edCartaOrig(c, topicoId, aoSalvar); };

  async function salvarCartoes(lista, topicoId, extraTags) {
    const jaTem = new Set(App.S.cartoes.map(c => L3.chaveCartao(c.frente))); let n = 0, pulados = 0; const agora = Date.now();
    for (const x of lista) {
      if (jaTem.has(L3.chaveCartao(x.frente))) { pulados++; continue; } jaTem.add(L3.chaveCartao(x.frente)); const tags = L4.normalizarTags((x.tags || []).concat(extraTags || []));
      const tid = topicoId || L3.topicoDaTag(tags, App.S.topicos, App.S.disciplinas) || null;
      await App.salvar('cartoes', { id: L.uid('c'), concursoId: App.S.conc.id, topicoId: tid, tipo: 'basico', frente: x.frente, verso: x.verso, tags, lacuna: x.lacuna || null, origem: x.lacuna ? 'omissao' : 'lote', criado: agora + n }); n++;
    }
    return { n, pulados };
  }
  function abaLote(box) {
    let topicoId = null; const ta = h('textarea', { 'data-lote-texto': '1', 'aria-label': 'Cartões em lote', style: 'min-height:200px', placeholder: 'Um cartão por linha:\nPrazo da apelação :: 15 dias #processo\nQuem julga ADI? :: O STF #constitucional\n\nTambém aceita omissão: O {{c1::STF}} julga {{c2::ADI}}.' });
    const tags = h('input', { type: 'text', 'data-lote-tags': '1', 'aria-label': 'Tags para todos', placeholder: 'tags para todos (separe por espaço), ex.: direito prazos' }); const info = h('div', { class: 'muted peq', 'data-lote-info': '1' });
    const conta = () => { const r = L4.parseLoteCartas(ta.value); info.textContent = r.cartoes.length + ' cartões prontos' + (r.ignoradas ? ' (' + r.ignoradas + ' linhas sem "::" ignoradas)' : '') + '.'; return r; }; ta.addEventListener('input', conta); conta();
    box.append(h('div', { class: 'cartao' }, h('h2', {}, 'Criar cartões em lote'), h('p', { class: 'muted peq' }, 'Escreva ou cole um cartão por linha, com "::" (ou TAB) entre a frente e o verso. Palavras com #tag viram tags; a tag "Disciplina::Tópico" liga o cartão ao tópico. Cartões repetidos são pulados.'), ta, info,
      h('div', { class: 'grade2', style: 'margin-top:8px' }, h('label', { class: 'campo' }, h('span', {}, 'Tópico (para todos)'), App.selTopico(null, (v) => topicoId = v)), h('label', { class: 'campo' }, h('span', {}, 'Tags'), tags)),
      h('div', { class: 'linha', style: 'margin-top:10px' }, h('button', { class: 'btn p', type: 'button', 'data-lote-criar': '1', onclick: async (ev) => { const r = conta(); if (!r.cartoes.length) { App.toast('Nenhum cartão para criar.', true); return; } ev.target.disabled = true; const s = await salvarCartoes(r.cartoes, topicoId, L4.normalizarTags(tags.value)); App.toast(s.n + ' cartões criados' + (s.pulados ? ' (' + s.pulados + ' já existiam)' : '') + '.'); ta.value = ''; conta(); ev.target.disabled = false; } }, 'Criar cartões'))));
  }
  function abaOmissao(box) {
    let topicoId = null; const ta = h('textarea', { 'data-omissao-texto': '1', 'aria-label': 'Texto com omissões', style: 'min-height:170px', placeholder: 'Cole um trecho e marque as palavras que quer esconder. Ex.:\nA {{c1::Constituição}} foi promulgada em {{c2::1988}}, e a {{c1::emenda}} exige {{c3::três quintos}}.' });
    const previa = h('div', { class: 'pilha', 'data-omissao-previa': '1' }); const info = h('div', { class: 'muted peq' }); const proximo = () => { const ns = [...ta.value.matchAll(/\{\{c(\d+)::/g)].map(m => +m[1]); return (ns.length ? Math.max(...ns) : 0) + 1; };
    const desenha = () => { const cs = L3.lacunasCartoes(ta.value); info.textContent = cs.length ? cs.length + ' cartões (um por número cN; só o cN fica escondido).' : 'Nenhuma omissão ainda: selecione uma palavra no texto e use "Esconder a seleção".'; previa.replaceChildren(...cs.slice(0, 4).map(c => h('div', { class: 'afundado peq' }, h('div', {}, h('b', {}, 'c' + c.n + ' · '), c.frente), h('div', { class: 'muted' }, '→ ' + c.verso)))); }; ta.addEventListener('input', desenha); desenha();
    const esconde = h('button', { class: 'btn', type: 'button', 'data-omissao-esconder': '1', onclick: () => { const a = ta.selectionStart, b = ta.selectionEnd; if (b <= a) { App.toast('Selecione uma palavra no texto primeiro.', true); return; } ta.value = ta.value.slice(0, a) + '{{c' + proximo() + '::' + ta.value.slice(a, b) + '}}' + ta.value.slice(b); desenha(); } }, 'Esconder a seleção');
    box.append(h('div', { class: 'cartao' }, h('h2', {}, 'Omissão de palavras'), h('p', { class: 'muted peq' }, 'Um texto vira vários cartões: em cada um só um número de omissão fica escondido ([...]); no verso aparece o texto completo. Use {{c1::resposta::dica}} para pôr uma dica.'), ta, h('div', { class: 'linha', style: 'margin:8px 0' }, esconde), info, previa, h('label', { class: 'campo', style: 'margin-top:8px' }, h('span', {}, 'Tópico'), App.selTopico(null, (v) => topicoId = v)),
      h('div', { class: 'linha', style: 'margin-top:10px' }, h('button', { class: 'btn p', type: 'button', 'data-omissao-criar': '1', onclick: async (ev) => { const cs = L3.lacunasCartoes(ta.value); if (!cs.length) { App.toast('Marque pelo menos uma omissão com {{c1::palavra}}.', true); return; } ev.target.disabled = true; const s = await salvarCartoes(cs.map(c => ({ frente: c.frente, verso: c.verso, lacuna: c.n, tags: [] })), topicoId, []); App.toast(s.n + ' cartões de omissão criados' + (s.pulados ? ' (' + s.pulados + ' já existiam)' : '') + '.'); ta.value = ''; desenha(); ev.target.disabled = false; } }, 'Criar cartões'))));
  }
  // lê uma imagem (arquivo ou colada) e reduz para no máximo 1400 px de largura
  async function imagemParaDataUrl(blob) { const url = URL.createObjectURL(blob); try { const im = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(new Error('Não consegui abrir essa imagem.')); i.src = url; }); const k = Math.min(1, 1400 / im.naturalWidth); const cv = document.createElement('canvas'); cv.width = Math.round(im.naturalWidth * k); cv.height = Math.round(im.naturalHeight * k); cv.getContext('2d').drawImage(im, 0, 0, cv.width, cv.height); return cv.toDataURL('image/jpeg', 0.85); } finally { URL.revokeObjectURL(url); } }
  function abaOclusao(box) {
    let topicoId = null; let imagem = null; const rets = []; const area = h('div', { 'data-oc-area': '1', style: 'position:relative;display:inline-block;max-width:100%;touch-action:none;user-select:none;cursor:crosshair' }); const info = h('div', { class: 'muted peq', 'data-oc-info': '1' }, 'Escolha uma imagem ou cole com Ctrl+V.');
    const desenha = () => { area.replaceChildren(); if (!imagem) return; area.append(h('img', { src: imagem, alt: 'Imagem para oclusão', draggable: 'false', style: 'display:block;max-width:100%;border-radius:10px;pointer-events:none' })); rets.forEach((r, i) => area.append(h('div', { style: 'position:absolute;box-sizing:border-box;left:' + r.x * 100 + '%;top:' + r.y * 100 + '%;width:' + r.w * 100 + '%;height:' + r.h * 100 + '%;background:var(--ink);opacity:.82;border:2px solid var(--accent);display:grid;place-items:center;color:var(--paper);font-weight:700;pointer-events:none' }, String(i + 1)))); info.textContent = imagem ? rets.length + ' áreas cobertas. Arraste sobre a imagem para cobrir mais uma parte.' : 'Escolha uma imagem ou cole com Ctrl+V.'; };
    const poe = async (blob) => { try { imagem = await imagemParaDataUrl(blob); rets.length = 0; desenha(); } catch (e) { App.toast(e.message, true); } };
    const arq = h('input', { type: 'file', accept: 'image/*', 'data-oc-arquivo': '1', 'aria-label': 'Escolher imagem', onchange: async (e) => { const f = e.target.files[0]; if (f) await poe(f); } });
    const colar = (ev) => { const it = [...(ev.clipboardData ? ev.clipboardData.items : [])].find(x => x.type.startsWith('image/')); if (it) { ev.preventDefault(); poe(it.getAsFile()); } }; document.addEventListener('paste', colar); App.aoSair(() => document.removeEventListener('paste', colar));
    let ini = null, tmp = null; const frac = (ev) => { const b = area.getBoundingClientRect(); return { x: Math.min(1, Math.max(0, (ev.clientX - b.left) / b.width)), y: Math.min(1, Math.max(0, (ev.clientY - b.top) / b.height)) }; };
    area.addEventListener('pointerdown', (ev) => { if (!imagem) return; ini = frac(ev); try { area.setPointerCapture(ev.pointerId); } catch (e) { /* ponteiro simulado */ } tmp = h('div', { style: 'position:absolute;border:2px dashed var(--accent);box-sizing:border-box;pointer-events:none' }); area.append(tmp); });
    area.addEventListener('pointermove', (ev) => { if (!ini) return; const p = frac(ev); Object.assign(tmp.style, { left: Math.min(ini.x, p.x) * 100 + '%', top: Math.min(ini.y, p.y) * 100 + '%', width: Math.abs(p.x - ini.x) * 100 + '%', height: Math.abs(p.y - ini.y) * 100 + '%' }); });
    const solta = (ev) => { if (!ini) return; const p = frac(ev); const r = { x: Math.min(ini.x, p.x), y: Math.min(ini.y, p.y), w: Math.abs(p.x - ini.x), h: Math.abs(p.y - ini.y) }; ini = null; const v = L4.retangulosValidos([r]); if (v.length) rets.push(v[0]); desenha(); };
    area.addEventListener('pointerup', solta); area.addEventListener('pointercancel', () => { ini = null; desenha(); }); window.__ocRets = rets; window.__ocPoe = poe;
    box.append(h('div', { class: 'cartao', 'data-oclusao-aba': '1' }, h('h2', {}, 'Oclusão de imagem'), h('p', { class: 'muted peq' }, 'Escolha ou cole uma imagem (mapa, esquema, tabela) e arraste retângulos sobre as partes que quer esconder. Cada retângulo vira um cartão: na frente só aquela parte fica coberta.'), h('div', { class: 'linha' }, arq, h('button', { class: 'btn mini', type: 'button', onclick: () => { rets.pop(); desenha(); } }, 'Desfazer o último'), h('button', { class: 'btn mini', type: 'button', onclick: () => { rets.length = 0; desenha(); } }, 'Limpar')), info, h('div', { style: 'margin:10px 0' }, area),
      h('label', { class: 'campo' }, h('span', {}, 'Tópico'), App.selTopico(null, (v) => topicoId = v)), h('div', { class: 'linha', style: 'margin-top:10px' }, h('button', { class: 'btn p', type: 'button', 'data-oc-criar': '1', onclick: async (ev) => { const cs = L4.cartoesDeOclusao({ imagem, retangulos: rets, concursoId: App.S.conc.id, topicoId }); if (!imagem || !cs.length) { App.toast('Escolha uma imagem e cubra pelo menos uma parte.', true); return; } ev.target.disabled = true; for (const c of cs) await App.salvar('cartoes', c); App.toast(cs.length + ' cartões de oclusão criados.'); imagem = null; rets.length = 0; desenha(); ev.target.disabled = false; } }, 'Criar cartões'))));
  }
  function abaRetencao(box) {
    const r = L4.retencaoCartas({ respostas: App.S.respostas, topicos: App.S.topicos, disciplinas: App.S.disciplinas }); const barra = (p) => h('div', { class: 'barra ' + (p >= 80 ? 'ok' : '') }, h('i', { style: 'width:' + p + '%' }));
    box.append(h('div', { class: 'cartao', 'data-retencao': '1' }, h('h2', {}, 'Retenção das cartas'), h('p', { class: 'muted peq' }, 'Retenção = quanto você acerta ao REVER uma carta (a primeira vez que você vê uma carta não conta). Abaixo de 80% pede mais revisões ou um cartão melhor.'),
      r.geral.n ? h('div', {}, h('div', { class: 'linha' }, h('span', { class: 'numgrande' }, r.geral.pct + '%'), h('span', { class: 'muted' }, r.geral.ok + ' acertos em ' + r.geral.n + ' revisões')),
        h('h3', {}, 'Por disciplina'), h('div', { class: 'pilha' }, r.porDisciplina.map(d => h('div', { 'data-ret-disc': '1' }, h('div', { class: 'linha entre' }, h('b', {}, d.nome), h('span', { class: 'muted peq' }, d.pct + '% · ' + d.n + ' revisões')), barra(d.pct)))),
        h('h3', {}, 'Por tópico (os mais fracos primeiro)'), h('div', { class: 'arvore' }, r.porTopico.slice(0, 15).map(t => h('a', { class: 'no-t', href: '#/topico/' + t.id + '?aba=cartoes', style: 'text-decoration:none;color:inherit' }, h('div', { class: 'tit' }, t.titulo), h('span', { class: 'chip ' + (t.pct >= 80 ? 'ok' : t.pct >= 60 ? 'aviso' : 'ruim') }, t.pct + '% · ' + t.n))))) : h('div', { class: 'vazio' }, App.vazioFig('sem-cartas'), 'Ainda não há revisões de cartas. Faça uma sessão e volte quando as cartas vencerem.')));
  }
  // sessão do simulado de cartas: teclado (1–4 e espaço), timer que só começa na 1ª resposta
  function rodarSimulado(raiz, itens) {
    let i = 0, t0 = null, feitas = 0, acertos = 0, tic = null, acabou = false, espacoTratado = false;
    const cron = h('span', { class: 'chip', 'data-sim-timer': '1' }, 'timer começa na 1ª resposta'); const prog = h('div', { class: 'barra' }, h('i', { style: 'width:0%' })); const info = h('div', { class: 'muted peq' }); const palco = h('div', { class: 'cartao', 'data-sim-palco': '1' });
    const mm = (ms) => { const s = Math.floor(ms / 1000); return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); };
    const visivel = (el) => el.offsetParent !== null && !el.disabled; const q = (s) => [...palco.querySelectorAll(s)].filter(visivel);
    const teclas = (e) => {
      if (acabou || e.ctrlKey || e.metaKey || e.altKey || document.querySelector('dialog[open]') || /INPUT|TEXTAREA|SELECT/.test(e.target.tagName || '')) return;
      if (e.key === ' ') { const b = q('[data-mostrar]')[0] || q('[data-continuar]')[0] || q('[data-resp=bom]')[0]; if (b) { e.preventDefault(); espacoTratado = true; if (document.activeElement && document.activeElement.blur) document.activeElement.blur(); b.click(); } return; }
      if (/^[1-5]$/.test(e.key)) { const n = +e.key - 1; const l = q('[data-resp]').length ? q('[data-resp]') : q('[data-conf]').length ? q('[data-conf]') : q('.alt'); if (l[n]) { e.preventDefault(); l[n].click(); } }
    };
    const soltou = (e) => { if (e.key === ' ' && espacoTratado) { e.preventDefault(); espacoTratado = false; } };
    document.addEventListener('keydown', teclas); document.addEventListener('keyup', soltou); const solta = () => { document.removeEventListener('keydown', teclas); document.removeEventListener('keyup', soltou); clearInterval(tic); }; App.aoSair(solta);
    palco.addEventListener('click', (ev) => { if (!t0 && ev.target.closest && ev.target.closest('[data-resp], .alt')) { t0 = Date.now(); cron.textContent = '00:00'; tic = setInterval(() => { cron.textContent = mm(Date.now() - t0); }, 500); } }, true);
    const fim = async () => {
      if (acabou) return; acabou = true; solta(); prog.firstChild.style.width = '100%'; info.textContent = ''; const ses = L4.sessaoDeCartas({ primeiraRespostaTs: t0, fimTs: Date.now(), feitas, acertos }); let salvou = false; if (ses) { await App.salvar('sessoes', Object.assign({ id: L.uid('s'), concursoId: App.S.conc.id, topicoId: null }, ses)); salvou = true; }
      const pct = feitas ? Math.round(100 * acertos / feitas) : 0; palco.replaceChildren(h('h2', {}, 'Simulado concluído'), h('div', { class: 'numgrande' }, pct + '%'), h('p', {}, acertos + ' de ' + feitas + ' certos.'), h('p', { class: 'muted peq', 'data-sim-resultado': '1' }, salvou ? 'O tempo (' + ses.minutos + ' min) foi salvo como sessão de estudo.' : 'Sessão de menos de 1 minuto: o tempo não foi salvo.'), h('div', { class: 'linha' }, h('a', { class: 'btn p', href: '#/cartas' }, 'Voltar'), h('a', { class: 'btn', href: '#/cartas?aba=retencao' }, 'Ver a retenção')));
    };
    const mostra = () => {
      if (i >= itens.length) { fim(); return; } const c = itens[i]; prog.firstChild.style.width = Math.round(100 * i / itens.length) + '%'; info.textContent = 'Carta ' + (i + 1) + ' de ' + itens.length + (c.topicoId ? ' · ' + App.nomeTopico(c.topicoId) : '');
      palco.replaceChildren(App.executarItem(c, 'cartao', { rotuloContinuar: i + 1 >= itens.length ? 'Terminar' : 'Próxima', aoConcluir: (res) => { feitas++; if (res && res.correta) acertos++; i++; mostra(); } }));
    };
    raiz.replaceChildren(h('div', { class: 'linha entre' }, h('b', {}, 'Simulado de cartas'), h('div', { class: 'linha' }, cron, h('button', { class: 'btn mini', type: 'button', 'data-sim-encerrar': '1', onclick: fim }, 'Encerrar'))), prog, info, palco, h('div', { class: 'muted peq' }, 'Teclado: espaço mostra a resposta e segue; 1 a 4 respondem (errei, difícil, bom, fácil); nas questões, 1 a 5 escolhem A a E e depois 1 a 3 dão a confiança.')); mostra();
  }
  function abaSimulado(box) {
    const cfg = Object.assign({ origem: 'misturado', qtd: 20, ordem: 'intercalado', discIds: [] }, ls('doraDraw.sim-cartas', {})); const total = App.S.cartoes.length;
    const marcas = App.S.disciplinas.map(d => { const cb = h('input', { type: 'checkbox', 'data-sim-disc': d.id, checked: !cfg.discIds.length || cfg.discIds.includes(d.id) }); return { d, cb, el: h('label', { class: 'marca-op' }, cb, h('span', {}, d.nome)) }; });
    const origem = selecao([['misturado', 'Misturado (fila, erradas e sorteio)'], ['fila', 'Fila (cartas que vencem)'], ['aleatorio', 'Aleatório'], ['erradas', 'Mais erradas']], cfg.origem, (v) => cfg.origem = v, 'Origem das cartas'); const ordem = selecao([['intercalado', 'Intercalado (alterna as disciplinas)'], ['agrupado', 'Agrupado (uma disciplina por vez)']], cfg.ordem, (v) => cfg.ordem = v, 'Ordem'); const qtd = h('input', { type: 'number', min: 1, max: 200, value: cfg.qtd, style: 'width:100px', 'aria-label': 'Quantidade de cartas', 'data-sim-qtd': '1', onchange: (e) => cfg.qtd = Math.max(1, +e.target.value || 20) });
    const palco = h('div'); const conf = h('div', { class: 'cartao', 'data-sim-config': '1' }, h('h2', {}, 'Simulado de cartas'), h('p', { class: 'muted peq' }, total + ' cartas no concurso. Escolha de onde vêm, de quais disciplinas e quantas. O tempo só começa a contar na primeira resposta.'), h('div', { class: 'grade2' }, h('label', { class: 'campo' }, h('span', {}, 'Origem'), origem), h('label', { class: 'campo' }, h('span', {}, 'Ordem'), ordem)), h('label', { class: 'campo', style: 'margin-top:8px' }, h('span', {}, 'Quantidade'), qtd), h('div', { style: 'margin-top:8px' }, h('div', { class: 'rotulo' }, 'Disciplinas'), h('div', { class: 'linha' }, marcas.map(m => m.el))),
      h('div', { class: 'linha', style: 'margin-top:12px' }, h('button', { class: 'btn p', type: 'button', 'data-sim-comecar': '1', onclick: () => {
        const ids = marcas.filter(m => m.cb.checked).map(m => m.d.id); if (!ids.length) { App.toast('Marque pelo menos uma disciplina.', true); return; } cfg.discIds = ids.length === marcas.length ? [] : ids; lsSet('doraDraw.sim-cartas', cfg);
        const itens = L4.montarSimuladoCartas({ cartoes: App.S.cartoes, topicos: App.S.topicos, hoje: App.hoje(), origem: cfg.origem, discIds: cfg.discIds, qtd: cfg.qtd, ordem: cfg.ordem }); if (!itens.length) { App.toast('Nenhuma carta com esses filtros. Crie cartas ou mude a origem.', true); return; }
        conf.classList.add('oculto'); rodarSimulado(palco, itens); } }, 'Começar')));
    if (!total) { box.append(h('div', { class: 'cartao vazio' }, App.vazioFig('sem-cartas'), h('p', {}, 'Ainda não há cartas.'), h('p', { class: 'muted peq' }, 'Crie em lote na aba ao lado, ou pelas abas de omissão e oclusão.'))); return; } box.append(conf, palco);
  }
  V.cartas = async (alvo, r) => {
    if (!App.exigeEdital(alvo)) return; const aba = ['simulado', 'lote', 'omissao', 'oclusao', 'retencao'].includes(r.query.aba) ? r.query.aba : 'simulado';
    alvo.append(h('h1', {}, 'Dora Cartas'), h('div', { class: 'abas', role: 'tablist' }, [['simulado', 'Simulado'], ['lote', 'Criar em lote'], ['omissao', 'Omissão'], ['oclusao', 'Oclusão de imagem'], ['retencao', 'Retenção']].map(([k, n]) => h('button', { role: 'tab', 'aria-selected': String(k === aba), 'data-aba': k, onclick: () => App.ir('cartas?aba=' + k) }, n)))); const box = h('div', { class: 'pilha' }); alvo.append(box);
    ({ simulado: abaSimulado, lote: abaLote, omissao: abaOmissao, oclusao: abaOclusao, retencao: abaRetencao })[aba](box);
  };

  // =====================================================================
  // 6. Dora Ciclo: horas por dia, peso e nível, por horas ou por questões
  // =====================================================================
  const NOMES_DIA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const modoCiclo = () => ls('doraDraw.ciclo-modo', 'horas') === 'questoes' ? 'questoes' : 'horas';
  App.niveisCiclo = () => { const m = {}; App.S.disciplinas.forEach(d => { if (d.nivel) m[d.id] = d.nivel; }); return m; };
  const questoesDoCiclo = () => { const c = App.S.conc; const ini = c.cicloInicio || c.criado || 0; const por = {}; App.S.respostas.filter(r => (r.ts || 0) >= ini && r.topicoId).forEach(r => { const t = App.topico(r.topicoId); if (t) por[t.disciplinaId] = (por[t.disciplinaId] || 0) + (r.qtd || 1); }); return por; };
  const cicloQ = () => L4.cicloPorQuestoes({ disciplinas: App.S.disciplinas, topicos: App.S.topicos, feitas: questoesDoCiclo(), porRodada: ls('doraDraw.ciclo-n', 10) });
  const proximaOrig = App.proximaDoCiclo;
  App.proximaDoCiclo = () => { if (modoCiclo() !== 'questoes') return proximaOrig(); const ci = cicloQ(); if (!ci.proxima) return null; const pr = {}; App.prioridades().forEach(p => pr[p.topicoId] = p); const t = App.S.topicos.filter(x => x.disciplinaId === ci.proxima.id && App.ehFolha(x)).sort((a, b) => ((pr[b.id] || {}).prioridade || 0) - ((pr[a.id] || {}).prioridade || 0))[0] || null; return { disciplina: ci.proxima, topico: t }; };
  const cicloOrig = V.ciclo;
  V.ciclo = async (alvo, r) => {
    if (!App.exigeEdital(alvo)) return; const c = App.S.conc; const modo = modoCiclo();
    if (modo === 'questoes') {
      const ci = cicloQ(); alvo.append(h('h1', {}, 'Dora Ciclo'), h('p', { class: 'muted' }, 'Modo por questões: em cada rodada você faz ' + ci.porRodada + ' questões de cada disciplina, na ordem do ciclo. Terminou a rodada, a próxima começa sozinha.'));
      if (!ci.itens.length) { alvo.append(h('div', { class: 'cartao vazio' }, 'Nenhuma disciplina com tópicos.')); } else {
        const prox = ci.proxima; const pr = {}; App.prioridades().forEach(p => pr[p.topicoId] = p); const tp = App.S.topicos.filter(t => t.disciplinaId === prox.id && App.ehFolha(t)).sort((a, b) => ((pr[b.id] || {}).prioridade || 0) - ((pr[a.id] || {}).prioridade || 0))[0];
        alvo.append(h('div', { class: 'cartao destaque', 'data-ciclo-questoes': '1' }, h('div', { class: 'linha entre' }, h('div', {}, h('div', { class: 'rotulo' }, 'Rodada ' + ci.rodada + ' · próxima disciplina'), h('h2', { style: 'margin:0' }, prox.nome), h('p', { class: 'muted', style: 'margin:4px 0 0' }, 'Faltam ' + prox.falta + ' de ' + prox.meta + ' questões.' + (tp ? ' Sugestão de tópico: ' + tp.titulo + '.' : ''))), tp && !L4.semCaderno(tp) ? h('button', { class: 'btn p', type: 'button', onclick: () => abrirLink(tp.caderno) }, 'Abrir caderno') : h('a', { class: 'btn p', href: tp ? '#/topico/' + tp.id + '?aba=questoes' : '#/questoes' }, 'Fazer questões'))));
        alvo.append(h('div', { class: 'cartao' }, h('h2', {}, 'Fila da rodada'), h('div', { class: 'pilha' }, ci.itens.map((i, k) => h('div', {}, h('div', { class: 'linha entre' }, h('b', {}, (k + 1) + '. ' + i.nome + (i.id === prox.id ? '  ← próxima' : '')), h('span', { class: 'muted peq' }, i.feito + ' de ' + i.meta)), h('div', { class: 'barra' + (i.pct >= 100 ? ' ok' : '') }, h('i', { style: 'width:' + i.pct + '%' })))))));
      }
    } else await cicloOrig(alvo, r);
    // configuração: modo, horas por dia, plano de hoje, peso e nível por disciplina
    const horasDia = ls('doraDraw.ciclo-dias', [0, 2, 2, 2, 2, 2, 3]); const n = ls('doraDraw.ciclo-n', 10);
    const campos = NOMES_DIA.map((nm, i) => h('label', { class: 'campo' }, h('span', {}, nm), h('input', { type: 'number', min: 0, max: 16, step: 0.25, value: horasDia[i], 'aria-label': 'Horas na ' + nm, 'data-ciclo-dia': i, onchange: (e) => { horasDia[i] = Math.max(0, Math.min(16, +e.target.value || 0)); lsSet('doraDraw.ciclo-dias', horasDia); App.render(); } })));
    let plano;
    if (modo === 'horas') { const horas = ls('doraDraw.ciclo-horas', 20); const ini = c.cicloInicio || c.criado || 0; const feitos = {}; App.S.sessoes.filter(s => s.inicio >= ini).forEach(s => { const t = App.topico(s.topicoId); if (t) feitos[t.disciplinaId] = (feitos[t.disciplinaId] || 0) + (s.minutos || 0); }); const ci = L.ciclo({ disciplinas: App.S.disciplinas, topicos: App.S.topicos, notas: (App.mapaNotasPlano || App.mapaNotas)(), feitos, horasCiclo: horas, niveis: App.niveisCiclo() }); const min = L4.minutosDoDia(horasDia, App.hoje()); const itens = L4.planoDoDiaCiclo({ itens: ci.itens, minutosHoje: min });
      plano = h('div', { 'data-ciclo-plano': '1' }, h('p', { class: 'muted peq' }, 'Hoje (' + NOMES_DIA[new Date().getDay()] + ') você reservou ' + App.min(min) + '. O plano pega as disciplinas pendentes na ordem do ciclo, a partir de onde você parou.'), itens.length ? h('div', { class: 'arvore' }, itens.map(i => h('div', { class: 'no-t' }, h('div', { class: 'tit' }, i.nome), h('span', { class: 'chip' }, App.min(i.minutos))))) : h('div', { class: 'vazio' }, ci.completo ? 'Ciclo completo: comece um novo acima.' : 'Hoje não há horas reservadas. Ajuste os dias abaixo.')); }
    else { const ci = cicloQ(); plano = h('div', { 'data-ciclo-plano': '1' }, h('p', { class: 'muted peq' }, 'No modo por questões o plano é a fila da rodada: faça as questões na ordem, no seu ritmo. Dia parado não gera atraso.'), ci.proxima ? h('div', { class: 'chip' }, 'Agora: ' + ci.proxima.nome + ' (' + ci.proxima.falta + ' questões)') : null); }
    const lin = App.S.disciplinas.map(d => h('tr', {}, h('td', {}, d.nome), h('td', {}, h('input', { type: 'number', min: 0, max: 500, value: d.peso == null ? 10 : d.peso, style: 'width:80px', 'aria-label': 'Peso (questões) de ' + d.nome, onchange: async (e) => { d.peso = Math.max(0, +e.target.value || 0); await App.salvar('disciplinas', d); App.render(); } })), h('td', {}, selecao(L4.NIVEIS, d.nivel || 3, async (v) => { d.nivel = +v; await App.salvar('disciplinas', d); App.render(); }, 'Nível em ' + d.nome))));
    alvo.append(h('div', { class: 'cartao', 'data-ciclo-config': '1' }, h('h2', {}, 'Como o ciclo funciona para você'),
      h('div', { class: 'linha' }, h('label', { class: 'campo' }, h('span', {}, 'Medir o ciclo por'), seg([['horas', 'Horas'], ['questoes', 'Questões']], modo, (v) => { lsSet('doraDraw.ciclo-modo', v); App.render(); }, 'Modo do ciclo')), modo === 'questoes' ? h('label', { class: 'campo' }, h('span', {}, 'Questões por disciplina em cada rodada'), h('input', { type: 'number', min: 1, max: 200, value: n, style: 'width:100px', 'aria-label': 'Questões por rodada', 'data-ciclo-n': '1', onchange: (e) => { lsSet('doraDraw.ciclo-n', Math.max(1, +e.target.value || 10)); App.render(); } })) : null),
      h('h3', {}, 'Plano de hoje'), plano, h('h3', {}, 'Horas por dia da semana'), h('div', { class: 'grade', style: 'grid-template-columns:repeat(auto-fit,minmax(64px,1fr))' }, campos),
      h('h3', {}, 'Peso no edital e seu nível por disciplina'), h('p', { class: 'muted peq' }, 'O peso (número de questões) é o mesmo do quadro da prova. O nível pesa na meta: "estou começando" pede 50% mais tempo, "muito bom" pede 40% menos. O ciclo não tem datas: se você ficar dias sem estudar, ele continua de onde parou, sem atraso acumulado.'),
      h('div', { class: 'rolagem-x' }, h('table', { class: 'tabela' }, h('thead', {}, h('tr', {}, ['Disciplina', 'Peso (questões)', 'Meu nível'].map(x => h('th', {}, x)))), h('tbody', {}, lin)))));
  };

  // =====================================================================
  // 7. Concursos como objetivos; seletor do menu só com os ativos
  // =====================================================================
  const selConcOrig = App.seletorConcurso;
  App.seletorConcurso = () => { const todos = App.S.concursos; App.S.concursos = L4.filtrarConcursos(todos, 'ativo', App.S.conc && App.S.conc.id); try { return selConcOrig(); } finally { App.S.concursos = todos; } };
  const concOrig = V.concursos;
  V.concursos = async (alvo, r) => {
    await concOrig(alvo, r); if (!App.S.concursos.length) return; const titulo = [...alvo.querySelectorAll('h2')].find(x => x.textContent === 'Meus concursos'); const grade = titulo && titulo.nextElementSibling; if (!grade) return;
    let filtro = ls('doraDraw.conc-filtro', 'ativo'); const cards = [...grade.children];
    const aplica = () => cards.forEach((card, i) => { const c = App.S.concursos[i]; if (c) card.style.display = (filtro === 'todos' || L4.objetivoDe(c) === filtro || (filtro === 'ativo' && App.S.conc && c.id === App.S.conc.id)) ? '' : 'none'; });
    cards.forEach((card, i) => {
      const c = App.S.concursos[i]; if (!c) return; const obj = L4.objetivoDe(c); const linha = card.querySelector('.linha:last-child'); const muda = async (novo) => { await App.salvar('concursos', L4.mudarObjetivo(c, novo)); if (novo !== 'ativo' && App.S.conc && App.S.conc.id === c.id) { const outro = App.S.concursos.find(x => x.id !== c.id && L4.objetivoDe(x) === 'ativo'); if (outro) await App.carregarConcurso(outro.id); } App.toast(novo === 'ativo' ? 'Objetivo reativado.' : novo === 'concluido' ? 'Objetivo concluído. Os dados ficam guardados.' : 'Objetivo arquivado. Os dados ficam guardados.'); App.render(); };
      if (obj !== 'ativo') card.querySelector('h3').after(h('span', { class: 'chip ' + (obj === 'concluido' ? 'ok' : ''), 'data-objetivo': obj }, obj === 'concluido' ? 'Concluído' : 'Arquivado'));
      if (linha) linha.prepend(...(obj === 'ativo' ? [h('button', { class: 'btn mini', type: 'button', 'data-concluir': '1', onclick: () => muda('concluido') }, 'Concluir'), h('button', { class: 'btn mini', type: 'button', 'data-arquivar': '1', onclick: () => muda('arquivado') }, 'Arquivar')] : [h('button', { class: 'btn mini p', type: 'button', 'data-reativar': '1', onclick: () => muda('ativo') }, 'Reativar')]));
    });
    titulo.after(h('div', { class: 'linha nao-imprime', style: 'margin:6px 0 10px', 'data-conc-filtro': '1' }, seg([['ativo', 'Ativos'], ['concluido', 'Concluídos'], ['arquivado', 'Arquivados'], ['todos', 'Todos']], filtro, (v) => { filtro = v; lsSet('doraDraw.conc-filtro', v); aplica(); }, 'Filtrar concursos'), h('span', { class: 'muted peq' }, 'Concluir ou arquivar não apaga nada: tira o concurso do menu.'))); aplica();
  };

  // =====================================================================
  // 8. Ajustes: esconder módulos do menu
  // =====================================================================
  const escOrig = App.escondido; App.escondido = (k) => (escOrig ? escOrig(k) : false) || (ls('doraDraw.menu-escondido', []).includes(k) && !L4.PROTEGIDOS.includes(k));
  const ajOrig = V.ajustes;
  V.ajustes = async (alvo, r) => {
    await ajOrig(alvo, r); const esc = ls('doraDraw.menu-escondido', []);
    const itens = App.MENU.filter(m => !L4.PROTEGIDOS.includes(m[0])).map(([k, n]) => h('label', { class: 'marca-op' }, h('input', { type: 'checkbox', 'data-menu-item': k, checked: !esc.includes(k), onchange: (e) => { const atual = ls('doraDraw.menu-escondido', []).filter(x => x !== k); if (!e.target.checked) atual.push(k); lsSet('doraDraw.menu-escondido', atual); App.render(); } }), h('span', {}, n)));
    alvo.append(h('div', { class: 'cartao', 'data-menu-config': '1' }, h('h2', {}, 'Menu: o que mostrar'), h('p', { class: 'muted peq' }, 'Desmarque os módulos que você não usa para o menu ficar mais curto. Nada é apagado: é só voltar aqui e marcar de novo. Início, Concursos, Dora Edital, Estudar e Ajustes sempre aparecem.'), h('div', { class: 'grade', style: 'grid-template-columns:repeat(auto-fit,minmax(190px,1fr))' }, itens), h('div', { class: 'linha', style: 'margin-top:10px' }, h('button', { class: 'btn', type: 'button', 'data-menu-todos': '1', onclick: () => { lsSet('doraDraw.menu-escondido', []); App.render(); } }, 'Mostrar todos'))));
  };

  // =====================================================================
  // 9. Estatísticas: resumo da semana em PNG
  // =====================================================================
  const token = (n, p) => (getComputedStyle(document.documentElement).getPropertyValue(n) || '').trim() || p;
  App.desenharResumoSemana = (cv, r, concurso) => {
    const W = 1080, H = 1350; cv.width = W; cv.height = H; const g = cv.getContext('2d'); const bg = token('--bg', '#faf6f1'), paper = token('--paper', '#ffffff'), ink = token('--ink', '#3a2e26'), mut = token('--muted', '#76614f'), acc = token('--accent', '#a64d14'), dest = token('--destaque', '#e8853a'), line = token('--line', '#ecdfd2');
    g.fillStyle = bg; g.fillRect(0, 0, W, H); g.fillStyle = dest; g.fillRect(0, 0, W, 18); g.textBaseline = 'alphabetic'; const fonte = (px, peso) => (peso || 600) + ' ' + px + 'px system-ui, "Segoe UI", sans-serif';
    g.fillStyle = acc; g.font = fonte(34, 700); g.fillText('Dora Draw', 72, 100); g.fillStyle = ink; g.font = fonte(76, 800); g.fillText('Minha semana', 72, 200); g.fillStyle = mut; g.font = fonte(32, 500); g.fillText(App.fmtData(r.de) + ' a ' + App.fmtData(r.ate), 72, 252); g.fillText(String(concurso || '').slice(0, 48), 72, 298);
    const cx = [['horas', r.horas.toString().replace('.', ','), 'h estudadas'], ['q', String(r.questoes), 'questões'], ['pct', r.pct == null ? '—' : r.pct + '%', 'de acerto'], ['d', String(r.diasAtivos), 'dias ativos']];
    cx.forEach((c, i) => { const x = 72 + (i % 2) * 468, y = 350 + Math.floor(i / 2) * 230; g.fillStyle = paper; g.strokeStyle = line; g.lineWidth = 3; g.beginPath(); g.roundRect(x, y, 440, 200, 28); g.fill(); g.stroke(); g.fillStyle = acc; g.font = fonte(104, 800); g.fillText(c[1], x + 36, y + 120); g.fillStyle = mut; g.font = fonte(32, 600); g.fillText(c[2], x + 36, y + 170); });
    g.fillStyle = ink; g.font = fonte(44, 700); g.fillText('Tópicos da semana', 72, 860); g.font = fonte(34, 500); const topicos = r.topicos.length ? r.topicos : [{ titulo: 'Nenhum estudo registrado na semana', min: 0, q: 0 }];
    topicos.forEach((t, i) => { const y = 930 + i * 72; g.fillStyle = dest; g.beginPath(); g.arc(90, y - 12, 12, 0, Math.PI * 2); g.fill(); g.fillStyle = ink; let tx = String(t.titulo); while (g.measureText(tx).width > 640 && tx.length > 4) tx = tx.slice(0, -2); if (tx !== t.titulo) tx += '…'; g.fillText(tx, 120, y); g.fillStyle = mut; g.textAlign = 'right'; g.fillText((t.min ? App.min(t.min) : '') + (t.min && t.q ? ' · ' : '') + (t.q ? t.q + ' q' : ''), W - 72, y); g.textAlign = 'left'; });
    g.fillStyle = mut; g.font = fonte(28, 500); g.fillText('Feito no Dora Draw: dados só no meu aparelho', 72, H - 60);
  };
  const estOrig = V.estatisticas;
  V.estatisticas = async (alvo, r) => {
    await estOrig(alvo, r); if (!App.S.conc) return; const res = L4.resumoSemana({ sessoes: App.S.sessoes, respostas: App.S.respostas, topicos: App.S.topicos, hoje: App.hoje() }); const cv = h('canvas', { 'data-resumo-canvas': '1', role: 'img', 'aria-label': 'Resumo da semana em imagem', style: 'width:100%;max-width:420px;height:auto;border-radius:14px;box-shadow:var(--sombra-1)' });
    alvo.append(h('div', { class: 'cartao', 'data-resumo-semana': '1' }, h('h2', {}, 'Resumo da semana (imagem)'), h('p', { class: 'muted peq' }, 'Uma imagem com as horas, questões, acerto e tópicos dos últimos 7 dias, para guardar ou compartilhar quando quiser. Nada é enviado.'), cv, h('div', { class: 'linha', style: 'margin-top:10px' }, h('button', { class: 'btn p', type: 'button', 'data-resumo-baixar': '1', onclick: () => cv.toBlob((b) => { if (b) { App.baixar('dora-resumo-semana-' + App.hoje() + '.png', b, 'image/png'); App.toast('Imagem salva.'); } else App.toast('Não consegui gerar a imagem.', true); }, 'image/png') }, 'Baixar PNG')))); try { App.desenharResumoSemana(cv, res, App.S.conc.nome); } catch (e) { console.warn('Resumo da semana', e); }
  };

  // =====================================================================
  // 10. Estante: resumo de superfície de um PDF de questões
  // =====================================================================
  const estOrig2 = V.estante;
  V.estante = async (alvo, r) => {
    await estOrig2(alvo, r); if (!App.S.conc) return; const temIA = !!(App.ia && App.ia.temIA()); let texto = ''; let nome = '';
    const status = h('div', { class: 'muted peq', role: 'status' }); const saida = h('pre', { class: 'afundado', 'data-superficie-saida': '1', style: 'white-space:pre-wrap;overflow-wrap:anywhere;margin:0', hidden: true }); const banca = h('input', { type: 'text', value: App.S.conc.banca || '', 'aria-label': 'Banca', placeholder: 'Banca (opcional)' }); const materia = h('input', { type: 'text', 'aria-label': 'Matéria', placeholder: 'Matéria (opcional)' });
    const prontos = App.S.materiais.filter(m => (m.texto || []).join('').trim().length > 30);
    const sel = h('select', { 'aria-label': 'PDF da estante', 'data-superficie-sel': '1', onchange: (e) => { const m = prontos.find(x => x.id === e.target.value); texto = m ? L4.prepararTextoQuestoes(m.texto) : ''; nome = m ? m.nome : ''; status.textContent = m ? m.nome + ': ' + L4.contarSuperficie(texto).total + ' questões reconhecidas.' : ''; } }, [h('option', { value: '' }, prontos.length ? '(escolha um PDF da estante)' : '(nenhum PDF com texto na estante)')].concat(prontos.map(m => h('option', { value: m.id }, m.nome))));
    const arq = h('input', { type: 'file', accept: 'application/pdf,.pdf', class: 'oculto', 'aria-label': 'Escolher PDF de questões', onchange: async (e) => { const f = e.target.files[0]; e.target.value = ''; if (!f) return; try { status.textContent = 'Lendo "' + f.name + '"...'; const { paginas } = await App.textoDoPdf(f, (i, t) => { status.textContent = 'Lendo página ' + i + ' de ' + t + '...'; }); texto = L4.prepararTextoQuestoes(paginas); nome = f.name; if (texto.length < 30) { status.textContent = ''; App.toast('Esse PDF não tem texto (talvez seja imagem escaneada; não há OCR).', true); texto = ''; return; } status.textContent = f.name + ': ' + L4.contarSuperficie(texto).total + ' questões reconhecidas.'; } catch (er) { status.textContent = ''; App.toast('Não consegui ler esse PDF: ' + er.message, true); } } });
    const pronto = () => { if (!texto) { App.toast('Escolha um PDF de questões primeiro.', true); return null; } return L4.promptSuperficie({ texto, banca: banca.value.trim(), materia: materia.value.trim() }); };
    const mostra = (t) => { saida.hidden = false; saida.textContent = t; };
    const bIA = h('button', { class: 'btn p', type: 'button', 'data-superficie-ia': '1', onclick: async (ev) => { const p = pronto(); if (!p) return; App.rodando(ev.target, 'Resumindo...'); try { const rr = await App.ia.chamar({ sistema: 'Você é um mentor de concursos. Responda em português simples e confira o gabarito antes de afirmar algo.', prompt: p }); mostra(rr.texto.trim() + '\n\n(Modelo: ' + rr.modelo + '. A IA pode errar: confira com o gabarito.)'); } catch (e) { App.toast(e.message, true); } ev.target.disabled = false; ev.target.textContent = 'Resumir com a IA'; } }, 'Resumir com a IA');
    const bCopiar = h('button', { class: temIA ? 'btn' : 'btn p', type: 'button', 'data-superficie-copiar': '1', onclick: async () => { const p = pronto(); if (!p) return; App.toast(await copiar(p) ? 'Prompt copiado. Cole em uma IA e leia o resumo lá.' : 'Não consegui copiar.', false); } }, 'Copiar prompt');
    const bConta = h('button', { class: 'btn', type: 'button', 'data-superficie-conta': '1', onclick: () => { if (!texto) { App.toast('Escolha um PDF de questões primeiro.', true); return; } const c = L4.contarSuperficie(texto); mostra('Contagem sem IA (' + nome + '):\n' + c.total + ' questões reconhecidas, ' + c.comGabarito + ' com gabarito.\nGabaritos por letra: ' + (Object.keys(c.letras).sort().map(k => k + ' = ' + c.letras[k]).join(', ') || 'nenhum')); } }, 'Contar sem IA');
    alvo.append(h('div', { class: 'cartao', 'data-superficie': '1' }, h('h2', {}, 'Resumo de superfície de um PDF de questões'), h('p', { class: 'muted peq' }, 'Escolha um PDF de questões com gabarito (da estante ou do computador). A IA resume o que as questões cobram: assuntos com contagem, como a banca pergunta e as pegadinhas que se repetem. Sem IA, copie o prompt e cole em outra IA.'),
      h('div', { class: 'grade2' }, h('label', { class: 'campo' }, h('span', {}, 'PDF da estante'), sel), h('div', { class: 'campo' }, h('span', {}, 'Ou do computador'), h('button', { class: 'btn', type: 'button', onclick: () => arq.click() }, 'Escolher PDF'), arq)), h('div', { class: 'grade2', style: 'margin-top:8px' }, banca, materia), status,
      h('div', { class: 'linha', style: 'margin:8px 0' }, temIA ? bIA : null, bCopiar, bConta, h('button', { class: 'btn', type: 'button', onclick: async () => { if (!saida.textContent) return; App.toast(await copiar(saida.textContent) ? 'Resumo copiado.' : 'Não consegui copiar.', false); } }, 'Copiar o resultado')), saida));
  };
})();
