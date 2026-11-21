/* Dora Draw — IA com a chave do próprio usuário (Gemini e/ou Claude). A chave fica só no banco local deste navegador.
   Escada de modelos: começa sempre pelo melhor; se der limite (429), bloqueia o modelo por 5 h (ou o retryDelay da API, se maior)
   e desce para o próximo; 404 tira o modelo da escada. Depende de DoraLogica e DoraDB. Nunca grava chave em arquivo. */
(function (raiz) {
  const L = raiz.DoraLogica, DB = raiz.DoraDB;
  const URL_GEMINI = 'https://generativelanguage.googleapis.com/v1beta/';
  const URL_CLAUDE = 'https://api.anthropic.com/v1/messages';
  // Porteiro da Guilda: servidor que guarda a chave do dono do app e limita o uso por pessoa. Na cópia distribuída, coloque aqui o endereço dele.
  const PORTEIRO_PADRAO = '';
  const padrao = () => ({ padrao: 'gemini', tetoUSD: 0, gratisGemini: true, precos: { gemini: { entrada: 0.3, saida: 2.5 }, claude: { entrada: 3, saida: 15 } }, uso: { mes: '', chamadas: 0, tokIn: 0, tokOut: 0, usdEst: 0, porModelo: {} }, escada: { gemini: L.novaEscada(L.ESCADA_GEMINI), claude: L.novaEscada(L.ESCADA_CLAUDE) }, porteiroURL: PORTEIRO_PADRAO, guildaRestante: null });
  const I = { cfg: padrao(), chaves: { gemini: '', claude: '', guilda: '' }, ultimo: null };

  I.carregar = async () => {
    const c = await DB.cfgGet('ia-config', null); const k = await DB.cfgGet('ia-chaves', null);
    I.cfg = Object.assign(padrao(), c || {}); I.cfg.escada = Object.assign(padrao().escada, (c && c.escada) || {}); I.cfg.uso = Object.assign(padrao().uso, (c && c.uso) || {});
    I.chaves = Object.assign({ gemini: '', claude: '', guilda: '' }, k || {}); if (!I.cfg.porteiroURL && PORTEIRO_PADRAO) I.cfg.porteiroURL = PORTEIRO_PADRAO; virarMes(); return I;
  };
  I.salvar = async () => { await DB.cfgSet('ia-config', I.cfg); await DB.cfgSet('ia-chaves', I.chaves); };
  I.salvarChave = async (prov, valor) => { I.chaves[prov] = String(valor || '').trim(); await I.salvar(); };
  I.apagarChave = async (prov) => { I.chaves[prov] = ''; await I.salvar(); };
  I.temChave = (prov) => prov === 'guilda' ? !!(I.chaves.guilda && I.cfg.porteiroURL) : !!I.chaves[prov];
  I.versaoPublica = !!PORTEIRO_PADRAO; // na cópia distribuída o aluno não escolhe provedor nem modelo: tudo passa pelo porteiro
  // quem vai responder: 'propria' (chave do aluno) ou 'guilda' (porteiro). A Dora Estúdio usa isso para saber o tamanho máximo do pedido.
  I.via = () => (I.temChave('gemini') || I.temChave('claude')) ? 'propria' : I.temChave('guilda') ? 'guilda' : null;
  I.temIA = () => I.temChave('gemini') || I.temChave('claude') || I.temChave('guilda');
  const virarMes = () => { const m = L.diaLocal().slice(0, 7); if (I.cfg.uso.mes !== m) I.cfg.uso = { mes: m, chamadas: 0, tokIn: 0, tokOut: 0, usdEst: 0, porModelo: {} }; };
  I.gastoMesUSD = () => { virarMes(); return I.cfg.uso.usdEst || 0; };
  const gratis = (prov) => prov === 'gemini' && I.cfg.gratisGemini;
  const registrarUso = (prov, modelo, tin, tout) => {
    virarMes(); const u = I.cfg.uso; u.chamadas++; u.tokIn += tin || 0; u.tokOut += tout || 0;
    const pm = u.porModelo[modelo] = u.porModelo[modelo] || { chamadas: 0, tokIn: 0, tokOut: 0 }; pm.chamadas++; pm.tokIn += tin || 0; pm.tokOut += tout || 0;
    if (!gratis(prov)) u.usdEst = (u.usdEst || 0) + L.custoUSD({ tokIn: tin || 0, tokOut: tout || 0 }, I.cfg.precos[prov]);
  };

  // ---- Gemini ----
  const cabG = () => ({ 'content-type': 'application/json', 'x-goog-api-key': I.chaves.gemini });
  I.listarModelosGemini = async () => {
    if (!I.chaves.gemini) throw new Error('Cole primeiro a chave do Gemini.');
    const r = await fetch(URL_GEMINI + 'models?pageSize=200', { headers: cabG() }); if (!r.ok) throw new Error('A lista de modelos não veio (código ' + r.status + ').');
    const j = await r.json(); return (j.models || []).filter(m => (m.supportedGenerationMethods || []).includes('generateContent')).map(m => String(m.name).replace(/^models\//, '')).filter(id => /^gemini-/.test(id) && !/embed|tts|image|live|audio|robotics|aqa|vision|learnlm|computer-use/i.test(id));
  };
  I.atualizarEscadaGemini = async () => {
    const lista = await I.listarModelosGemini(); const esc = I.cfg.escada.gemini;
    const novos = L.ordenarGemini(lista.filter(id => !esc.ordem.includes(id) && !esc.removidos.includes(id)));
    I.cfg.escada.gemini = { ordem: esc.ordem.concat(novos), bloqueios: esc.bloqueios, removidos: esc.removidos }; await I.salvar(); return { total: lista.length, novos };
  };
  async function chamarGemini(modelo, sistema, prompt, json) {
    const corpo = { contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { temperature: 0.4 } };
    if (sistema) corpo.systemInstruction = { parts: [{ text: sistema }] }; if (json) corpo.generationConfig.responseMimeType = 'application/json';
    const r = await fetch(URL_GEMINI + 'models/' + encodeURIComponent(modelo) + ':generateContent', { method: 'POST', headers: cabG(), body: JSON.stringify(corpo) });
    const txt = await r.text(); if (!r.ok) return { erro: true, status: r.status, corpo: txt };
    let j; try { j = JSON.parse(txt); } catch (e) { return { erro: true, status: 502, corpo: txt }; }
    const partes = (((j.candidates || [])[0] || {}).content || {}).parts || []; const texto = partes.map(p => p.text || '').join('');
    if (!texto) return { erro: true, status: 502, corpo: 'resposta vazia (' + ((j.promptFeedback || {}).blockReason || 'sem texto') + ')' };
    const u = j.usageMetadata || {}; return { texto, tin: u.promptTokenCount, tout: u.candidatesTokenCount };
  }
  // ---- Claude ----
  // a Dora Estúdio pode pedir uma página HTML inteira: aí a resposta pode ser maior (12 mil tokens)
  async function chamarClaude(modelo, sistema, prompt, tarefa) {
    const corpo = { model: modelo, max_tokens: tarefa === 'estudio' ? 12000 : 4096, messages: [{ role: 'user', content: prompt }] }; if (sistema) corpo.system = sistema;
    const r = await fetch(URL_CLAUDE, { method: 'POST', headers: { 'content-type': 'application/json', 'x-api-key': I.chaves.claude, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' }, body: JSON.stringify(corpo) });
    const txt = await r.text(); if (!r.ok) return { erro: true, status: r.status === 529 ? 429 : r.status, corpo: txt };
    let j; try { j = JSON.parse(txt); } catch (e) { return { erro: true, status: 502, corpo: txt }; }
    const texto = (j.content || []).map(c => c.text || '').join(''); const u = j.usage || {}; return { texto, tin: u.input_tokens, tout: u.output_tokens };
  }
  // ---- Porteiro da Guilda (IA com a chave do dono do app, com limite por pessoa) ----
  const urlPorteiro = (rota) => String(I.cfg.porteiroURL || '').trim().replace(/\/+$/, '') + rota;
  // tarefa: 'estudio' (Dora Estúdio) deixa o porteiro aceitar pedido maior (60 mil caracteres em vez de 24 mil)
  async function chamarPorteiro(sistema, prompt, json, prov, evitar, tarefa) {
    let r; try { r = await fetch(urlPorteiro('/ia'), { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(Object.assign({ codigo: I.chaves.guilda, sistema, prompt, json, prov: prov || 'auto', evitar: evitar || [] }, tarefa ? { tarefa } : {})) }); } catch (e) { throw new Error('Não consegui falar com a IA da Guilda. Confira a internet e o endereço do porteiro.'); }
    let j = {}; try { j = await r.json(); } catch (e) { /* resposta sem JSON */ }
    if (!r.ok || j.erro) { const err = new Error(j.msg || ('A IA da Guilda respondeu com erro ' + r.status + '.')); err.status = r.status; err.volta = j.volta; err.maximo = j.maximo; throw err; }
    I.cfg.guildaRestante = j.restanteHoje != null ? j.restanteHoje : null; return { texto: j.texto || '', modelo: j.modelo || 'guilda', prov: j.prov || 'guilda' };
  }
  I.contaGuilda = async () => { const r = await fetch(urlPorteiro('/conta'), { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ codigo: I.chaves.guilda }) }); const j = await r.json().catch(() => ({})); if (!r.ok || j.erro) throw new Error(j.msg || 'Código não aceito.'); return j; };
  const horaDe = (ts) => new Date(ts).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  I.horaDe = horaDe;
  // escolhe o melhor modelo livre, pulando os de `evitar` (usado pelo Tribunal das IAs para ouvir um SEGUNDO modelo)
  const escolherModelo = (esc, agora, evitar) => evitar && evitar.length ? L.modeloAtivo({ ordem: esc.ordem.filter(id => !evitar.includes(id)), removidos: esc.removidos, bloqueios: esc.bloqueios }, agora) : L.modeloAtivo(esc, agora);
  async function descer(prov, sistema, prompt, json, evitar, tarefa) {
    for (let guarda = 0; guarda < 20; guarda++) {
      const agora = Date.now(); const esc = I.cfg.escada[prov]; const modelo = escolherModelo(esc, agora, evitar);
      if (!modelo) { const bl = L.bloqueados(esc, agora).sort((a, b) => a.ate - b.ate)[0]; return { vazio: true, volta: bl ? bl.ate : null }; }
      const r = prov === 'gemini' ? await chamarGemini(modelo, sistema, prompt, json) : await chamarClaude(modelo, sistema, prompt, tarefa);
      if (!r.erro) { registrarUso(prov, modelo, r.tin, r.tout); I.ultimo = { prov, modelo, em: agora }; await I.salvar(); return { texto: r.texto, modelo, prov }; }
      const f = L.registrarFalha(esc, modelo, r.status, r.corpo, agora); I.cfg.escada[prov] = f.escada; await I.salvar();
      if (f.acao === 'outro') { let msg = 'Erro ' + r.status; try { const j = JSON.parse(r.corpo); msg += ': ' + ((j.error && (j.error.message || j.error)) || ''); } catch (e) { msg += ': ' + String(r.corpo).slice(0, 200); } if (r.status === 401 || r.status === 403 || r.status === 400 && /API key|api_key|invalid/i.test(String(r.corpo))) msg = 'A chave não foi aceita (' + r.status + '). Confira se colou a chave inteira.'; const e = new Error(msg); e.status = r.status; throw e; }
    }
    throw new Error('Não consegui um modelo livre agora.');
  }
  // chama o provedor padrão; se toda a escada dele estiver bloqueada, tenta o outro (se houver chave)
  // opções extras: `prov` força um provedor ('gemini' ou 'claude', sem cair para o outro); `evitar` lista modelos a não usar
  I.chamar = async ({ sistema = '', prompt, json = false, prov: soProv = null, evitar = [], tarefa = null }) => {
    virarMes(); const ordem = (soProv ? [soProv] : [I.cfg.padrao, I.cfg.padrao === 'gemini' ? 'claude' : 'gemini']).filter(p => I.temChave(p));
    // sem chave própria (ou com ela esgotada), usa a IA da Guilda pelo porteiro
    const usarGuilda = async () => { const r = await chamarPorteiro(sistema, prompt, json, soProv, evitar, tarefa); I.ultimo = { prov: 'guilda', modelo: r.modelo, em: Date.now() }; await I.salvar(); return r; };
    if (!ordem.length) { if (I.temChave('guilda')) return usarGuilda(); throw new Error('Nenhuma IA configurada. Abra a tela Dora Mentora e cole a sua chave ou o seu código da Guilda.'); }
    let volta = null; let teto = false;
    for (const prov of ordem) {
      if (!gratis(prov) && !L.dentroDoTeto(I.gastoMesUSD(), I.cfg.tetoUSD)) { teto = true; continue; }
      const r = await descer(prov, sistema, prompt, json, evitar, tarefa); if (r.texto != null) return r; if (r.volta) volta = Math.min(volta || Infinity, r.volta);
    }
    if (I.temChave('guilda')) return usarGuilda();
    if (teto && !volta) throw new Error('O teto de gasto do mês foi atingido (estimado US$ ' + I.gastoMesUSD().toFixed(2) + '). Aumente o teto na tela Dora Mentora ou use o Gemini gratuito.');
    throw new Error('Todos os modelos estão com limite agora.' + (volta ? ' O primeiro volta às ' + horaDe(volta) + '.' : ''));
  };
  I.tentarMelhorAgora = async () => { for (const p in I.cfg.escada) I.cfg.escada[p] = L.liberarTudo(I.cfg.escada[p]); await I.salvar(); };
  I.estadoEscada = (prov) => { const agora = Date.now(); const esc = I.cfg.escada[prov]; return { ativo: L.modeloAtivo(esc, agora), bloqueados: L.bloqueados(esc, agora), removidos: esc.removidos, ordem: esc.ordem }; };
  I.testarChave = async (prov) => { const r = await I.chamar({ prompt: 'Responda apenas: ok', json: false }); return r; };

  // ---------- tarefas (prompts em português) ----------
  const SIS = 'Você é um professor experiente em concursos públicos brasileiros. Responda sempre em português do Brasil, simples e direto. Quando pedirem JSON, responda SOMENTE o JSON, sem texto em volta.';
  const textoQ = (q) => (q.enunciado || '') + '\n' + (q.alternativas || []).map(a => a.letra + ') ' + a.texto).join('\n') + (q.gabarito ? '\nGabarito oficial: ' + q.gabarito : '');
  const J = async (prompt) => { const r = await I.chamar({ sistema: SIS, prompt, json: true }); const v = L.extrairJSON(r.texto); if (v == null) throw new Error('A IA respondeu em um formato que não consegui ler. Tente de novo.'); return { dados: v, modelo: r.modelo }; };
  I.tarefas = {
    explicarQuestao: (q) => J('Explique esta questão no formato abaixo. Responda em JSON: {"tipo":"tipo da questão (o que ela cobra)","sinal":"a pista no enunciado que revela o tipo","resposta":"letra correta","passos":["passo 1","passo 2"],"pegadinha":"a armadilha principal","porQueErradas":{"A":"por que está errada"}}. Inclua em porQueErradas só as erradas.\n\n' + textoQ(q)),
    gerarCartoes: (texto, n = 6) => J('A partir do texto abaixo, crie ' + n + ' itens de estudo. Responda em JSON: {"cartoes":[{"frente":"pergunta curta","verso":"resposta curta"}],"cartoesQuestao":[{"enunciado":"...","alternativas":["texto A","texto B","texto C","texto D","texto E"],"gabarito":"B","explicacao":"...","pegadinha":"..."}]}. Crie ' + Math.ceil(n * 2 / 3) + ' cartões simples e ' + Math.floor(n / 3) + ' Dora Cartas. Use só o que está no texto.\n\nTEXTO:\n' + String(texto).slice(0, 12000)),
    gerarQuestoes: ({ banca, assunto, n = 5, exemplos = [] }) => J('Crie ' + n + ' questões INÉDITAS de múltipla escolha (A a E) no estilo da banca ' + (banca || 'genérica') + ' sobre: ' + assunto + '. Responda em JSON: [{"enunciado":"...","alternativas":["A","B","C","D","E"],"gabarito":"C","comentario":"explicação curta"}]. Não copie questões reais.' + (exemplos.length ? '\nExemplos do estilo:\n' + exemplos.slice(0, 3).map(textoQ).join('\n---\n') : '')),
    resumoDiario: (erros) => J('Veja o diário de erros de um candidato e responda em JSON: {"resumo":"3 a 5 frases sobre o padrão dos erros","treinarAmanha":["ação concreta 1","ação 2","ação 3"]}.\n\n' + erros.slice(0, 60).map(e => '- ' + (e.topico || '') + ' | motivo: ' + e.motivo + ' | tipo: ' + (e.tipoErro || '-') + ' | ' + (e.resumo || '')).join('\n')),
    comoBancaCobra: ({ banca, topico, questoes }) => I.chamar({ sistema: SIS, prompt: 'Com base nas questões abaixo (banca ' + (banca || 'não informada') + '), escreva em até 8 linhas COMO A BANCA COBRA o tópico "' + topico + '": tipos de cobrança, pegadinhas frequentes e o que decorar. Texto simples, sem JSON.\n\n' + questoes.slice(0, 12).map(textoQ).join('\n---\n') }).then(r => ({ texto: r.texto.trim(), modelo: r.modelo }))
  };
  // organiza o texto de um edital (vindo de PDF) em disciplinas e tópicos numerados, sem inventar nada
  I.tarefas.organizarEdital = (texto) => I.chamar({ sistema: SIS, prompt: 'Abaixo está o texto do CONTEÚDO PROGRAMÁTICO de um edital de concurso, extraído de um PDF (pode ter quebras de linha erradas, cabeçalhos e números de página soltos). Reescreva-o limpo: cada disciplina em uma linha só, em MAIÚSCULAS, e abaixo os tópicos numerados (1., 2., 3.), um por linha. Una linhas cortadas ao meio e remova lixo de página. NÃO invente, NÃO resuma e NÃO tire nenhum tópico. Responda só com o texto, sem comentários. TEXTO: ' + String(texto).slice(0, 30000) }).then(r => ({ texto: r.texto.trim(), modelo: r.modelo }));
  // ---------- tarefas da segunda leva: Rajada de 5, Tribunal das IAs, Dora Escriba ----------
  const JO = async (prompt, opc = {}) => { const r = await I.chamar(Object.assign({ sistema: SIS, prompt, json: true }, opc)); const v = L.extrairJSON(r.texto); if (v == null) throw new Error('A IA respondeu em um formato que não consegui ler. Tente de novo.'); return { dados: v, modelo: r.modelo, prov: r.prov }; };
  const gerarQuestoesBase = I.tarefas.gerarQuestoes;
  // com `contexto` (texto de um PDF, grifo ou tópico) as questões se baseiam nele
  I.tarefas.gerarQuestoes = (args) => {
    if (!args.contexto) return gerarQuestoesBase(args);
    return JO('Crie ' + (args.n || 5) + ' questões INÉDITAS de múltipla escolha (A a E) no estilo da banca ' + (args.banca || 'genérica') + ', baseadas SOMENTE no texto abaixo (assunto: ' + (args.assunto || 'o texto') + '). Cada questão testa um ponto diferente e tem uma pegadinha plausível. Responda em JSON: [{"enunciado":"...","alternativas":["A","B","C","D","E"],"gabarito":"C","comentario":"explicação curta","pegadinha":"a armadilha"}]. Não copie questões reais.\n\nTEXTO:\n' + String(args.contexto).slice(0, 6000));
  };
  // o segundo modelo responde SEM ver o gabarito. modo: 'gemini' (outro modelo da escada), 'claude' ou 'auto' (Claude se houver chave; senão outro Gemini)
  I.tarefas.verificarQuestao = async (q, { modo = 'auto', modeloA = '' } = {}) => {
    const prov = modo === 'claude' || (modo === 'auto' && I.temChave('claude')) ? 'claude' : 'gemini';
    const sem = (q.enunciado || '') + '\n' + (q.alternativas || []).map(a => a.letra + ') ' + a.texto).join('\n');
    const r = await JO('Resolva a questão abaixo como candidato experiente de concurso. Responda em JSON: {"resposta":"letra","confianca":"alta, media ou baixa","motivo":"uma frase"}.\n\n' + sem, { prov, evitar: modeloA ? [modeloA] : [] });
    const d = Array.isArray(r.dados) ? r.dados[0] : r.dados; return { letra: String((d && (d.resposta || d.gabarito)) || '').trim().toUpperCase().slice(0, 1), confianca: d && d.confianca, motivo: d && d.motivo, modelo: r.modelo, prov: r.prov };
  };
  // avalia o RACIOCÍNIO do aluno (não só o resultado)
  I.tarefas.avaliarRaciocinio = (q, escolha, comoPensei) => JO('Um candidato errou uma questão. Avalie o RACIOCÍNIO dele, não só a resposta. Responda em JSON: {"onde":"onde o raciocínio desviou, em 1 a 2 frases","sinal":"qual sinal do enunciado ele perdeu","gesto":"qual gesto de resolução aplicar da próxima vez (curto e prático)","explicacao":"explicação curta de por que a alternativa correta é a correta","tipoErro":"conteudo, reconhecer, execucao ou leitura"}. tipoErro: conteudo = não sabia a matéria; reconhecer = não reconheceu o tipo da questão; execucao = sabia mas errou o passo ou a conta; leitura = leu errado ou faltou tempo.\n\nQUESTÃO:\n' + textoQ(q) + '\nO candidato marcou: ' + escolha + '\nComo ele disse que pensou: ' + comoPensei);
  I.tarefas.corrigirDiscursiva = ({ banca, linhas, tema, texto }) => JO('Corrija esta resposta discursiva como um corretor da banca ' + (banca || 'genérica') + '. Limite: ' + linhas + ' linhas. Tema: ' + (tema || 'não informado') + '. Use um espelho com 3 critérios: conteúdo, estrutura e linguagem (pesos 5, 3 e 2). Responda em JSON: {"nota":0 a 10,"criterios":[{"nome":"Conteúdo","peso":5,"obtido":0 a 5,"comentario":"..."},{"nome":"Estrutura","peso":3,"obtido":0,"comentario":"..."},{"nome":"Linguagem","peso":2,"obtido":0,"comentario":"..."}],"pontosFortes":["..."],"melhorar":["..."],"versaoComentada":"o texto do candidato reescrito com melhorias, com comentários entre colchetes explicando cada mudança"}.\n\nTEXTO DO CANDIDATO:\n' + String(texto).slice(0, 6000));
  raiz.DoraIA = I;
})(typeof self !== 'undefined' ? self : this);
