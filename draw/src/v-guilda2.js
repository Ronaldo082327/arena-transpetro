/* Telas novas: Guilda (XP, patentes, Chama, brasões, mapa de calor, placar), Salão da Guilda (cosméticos), Rádio Foco e Mural.
   Tudo local, sem servidor. A lógica pura (XP, níveis, sequência com escudo, brasões, calor) fica em logica2.js. */
(function () {
  const App = window.App, { L, h, DB } = App, V = App.views, G = window.DoraLogica2, R = window.DoraRadio;
  const ls = (k, p) => { try { const v = localStorage.getItem(k); return v == null ? p : JSON.parse(v); } catch (e) { return p; } };
  const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* sem armazenamento */ } };
  const SVGNS = 'http://www.w3.org/2000/svg';
  const sv = (tag, at = {}, ...filhos) => { const e = document.createElementNS(SVGNS, tag); for (const k in at) e.setAttribute(k, at[k]); filhos.flat().forEach(f => e.append(f && f.nodeType ? f : document.createTextNode(f))); return e; };
  const ICONES = { chama: 'M12 2c1 4 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-9z', escudo: 'M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5z', livro: 'M4 5a2 2 0 0 1 2-2h6v17H6a2 2 0 0 0-2 2zM20 5a2 2 0 0 0-2-2h-6v17h6a2 2 0 0 1 2 2z', coroa: 'M3 8l4 4 5-7 5 7 4-4-2 11H5z', estrela: 'M12 2l3 7 7 .6-5.3 4.7 1.6 7.2L12 17.8 5.7 21.5l1.6-7.2L2 9.6 9 9z', relogio: 'M12 6v6l4 2M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', duvida: 'M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 1-1 1.7M12 17h.01M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', ciclo: 'M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5', prova: 'M6 3h12v18H6zM9 8h6M9 12h6M9 16h3' };
  const ico = (nome, cls = '') => sv('svg', { viewBox: '0 0 24 24', class: 'g-ico ' + cls, 'aria-hidden': 'true' }, sv('path', { d: ICONES[nome] || ICONES.estrela }));

  // ---------- liga/desliga ----------
  const ligada = () => { try { return localStorage.getItem('doraDraw.guilda') !== 'off'; } catch (e) { return true; } };
  App.escondido = (k) => !ligada() && ['guilda', 'salao'].includes(k);

  // ---------- dados de XP (de todos os concursos deste perfil) ----------
  const dadosDe = async (leitor) => {
    const [sessoes, respostas, topicos, simulados] = await Promise.all(['sessoes', 'respostas', 'topicos', 'simulados'].map(l => leitor(l)));
    const revisoes = []; topicos.forEach(t => (t.revs || []).forEach(x => revisoes.push(typeof x === 'string' ? x : x && x.data)));
    return { sessoes, respostas, revisoes, simulados };
  };
  const guilda = App.guilda = {
    ligada,
    async calcular() { const d = await dadosDe((l) => DB.todos(l)); const hoje = App.hoje(); const g = G.calcularGuilda(d, hoje); g.hoje = hoje; g.acertoPct = g.totais.q ? Math.round(100 * g.totais.ac / g.totais.q) : null; return g; },
    // lê as lojas de outro perfil do mesmo computador (somente leitura)
    async lerPerfil(nomeBanco) {
      const existe = (indexedDB.databases ? (await indexedDB.databases()).some(d => d.name === nomeBanco) : true); if (!existe) return null;
      const db = await new Promise((res, rej) => { const rq = indexedDB.open(nomeBanco); rq.onsuccess = () => res(rq.result); rq.onerror = () => rej(rq.error); });
      try { const ler = (loja) => new Promise((res) => { if (!db.objectStoreNames.contains(loja)) { res([]); return; } const rq = db.transaction(loja, 'readonly').objectStore(loja).getAll(); rq.onsuccess = () => res(rq.result); rq.onerror = () => res([]); }); return await dadosDe(ler); } finally { db.close(); }
    },
    async placar() {
      const hoje = App.hoje(); const perfis = [{ nome: 'Principal', banco: 'dora-draw' }].concat(ls('doraDraw.perfis', []).map(p => ({ nome: p.nome, banco: 'dora-draw-p-' + p.id }))); const atual = ls('doraDraw.perfil', '') || ''; const out = [];
      for (const p of perfis) { try { const d = await guilda.lerPerfil(p.banco); if (!d) continue; const g = G.calcularGuilda(d, hoje); out.push({ nome: p.nome, xpPorDia: g.xpPorDia, ativo: p.banco === 'dora-draw' + (atual ? '-p-' + atual : '') }); } catch (e) { /* perfil ilegível: ignora */ } }
      return G.placarSemanal(out, hoje).map(x => Object.assign(x, { ativo: (out.find(o => o.nome === x.nome) || {}).ativo }));
    }
  };
  const sal = () => Object.assign({ moldura: 'simples', realce: 'padrao', selo: 'nenhum', fundo: 'liso', nome: '' }, ls('doraDraw.salao', {}));
  const aplicaRealce = () => { try { const r = sal().realce; if (r && r !== 'padrao') document.documentElement.setAttribute('data-realce', r); else document.documentElement.removeAttribute('data-realce'); } catch (e) { /* sem DOM */ } };
  aplicaRealce();
  const nomeUsuario = () => { const s = sal(); if (s.nome) return s.nome; const pid = ls('doraDraw.perfil', ''); const p = ls('doraDraw.perfis', []).find(x => x.id === pid); return p ? p.nome : ''; };
  const avatar = (nivel, tam = '') => { const s = sal(); const mold = G.desbloqueado('molduras', s.moldura, nivel) ? s.moldura : 'simples'; const selo = G.desbloqueado('selos', s.selo, nivel) ? s.selo : 'nenhum'; return h('div', { class: 'av av-' + mold + ' ' + tam, role: 'img', 'aria-label': 'Avatar de ' + (nomeUsuario() || 'você') }, h('span', {}, G.iniciais(nomeUsuario())), selo !== 'nenhum' ? h('span', { class: 'av-selo' }, ico(selo === 'chama' ? 'chama' : selo)) : null); };
  const fundoDe = (nivel) => { const s = sal(); return 'g-fundo g-fundo-' + (G.desbloqueado('fundos', s.fundo, nivel) ? s.fundo : 'liso'); };
  const barraXP = (n) => h('div', { class: 'barra', role: 'progressbar', 'aria-valuenow': n.pct, 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-label': 'Progresso até o próximo nível' }, h('i', { style: 'width:' + n.pct + '%' }));
  const cabecalho = (g, grande) => h('div', { class: 'cartao ' + fundoDe(g.nivel.nivel) }, h('div', { class: 'linha', style: 'flex-wrap:nowrap;gap:14px' }, avatar(g.nivel.nivel, grande ? 'av-g' : ''), h('div', { style: 'flex:1;min-width:0' }, h('div', { class: 'rotulo' }, nomeUsuario() || 'Seu perfil'), h('div', { class: grande ? 'numgrande' : 'g-patente' }, g.nivel.patente + ' · nível ' + g.nivel.nivel), h('div', { class: 'peq muted' }, g.xp.toLocaleString('pt-BR') + ' XP · faltam ' + g.nivel.falta.toLocaleString('pt-BR') + ' para o nível ' + (g.nivel.nivel + 1))), h('div', { class: 'g-chama-peq', title: 'Chama da Guilda' }, ico('chama', 'g-fogo'), h('b', {}, g.chama.atual))), barraXP(g.nivel));

  // ---------- Início: cartão compacto ----------
  const inicioOrig = V.inicio;
  V.inicio = async (alvo, r) => {
    await inicioOrig(alvo, r); if (!ligada()) return;
    try { const g = await guilda.calcular(); const c = h('a', { href: '#/guilda', style: 'text-decoration:none;color:inherit;display:block' }, cabecalho(g, false)); if (!alvo.querySelector('[data-guilda-inicio]')) alvo.prepend(h('div', { class: 'nao-imprime', 'data-guilda-inicio': '1' }, c)); } catch (e) { console.warn('Guilda', e); }
  };

  // ---------- tela Guilda ----------
  V.guilda = async (alvo) => {
    alvo.append(h('h1', {}, 'Guilda'));
    if (!ligada()) { alvo.append(h('div', { class: 'cartao vazio' }, h('p', {}, 'A gamificação está desligada.'), h('button', { class: 'btn p', onclick: () => { try { localStorage.removeItem('doraDraw.guilda'); } catch (e) { /* */ } App.render(); } }, 'Ligar de novo'))); return; }
    const g = await guilda.calcular(); const ch = g.chama; const t = g.totais;
    alvo.append(cabecalho(g, true));
    alvo.append(h('div', { class: 'grade2' },
      h('div', { class: 'cartao' }, h('h2', { class: 'linha' }, ico('chama', 'g-fogo'), 'Chama da Guilda'), h('div', { class: 'numgrande' }, ch.atual + (ch.atual === 1 ? ' dia' : ' dias')), h('div', { class: 'linha', style: 'margin:6px 0' }, h('span', { class: 'chip azul' }, 'melhor: ' + ch.melhor + ' dias'), h('span', { class: 'chip ' + (ch.escudo ? 'ok' : 'aviso') }, ch.escudo ? 'escudo da semana disponível' : 'escudo da semana já usado'), h('span', { class: 'chip' }, 'bônus de XP: +' + Math.round((g.multiplicador - 1) * 100) + '%')),
        h('p', { class: 'muted peq', style: 'margin-bottom:0' }, 'Conta o dia com pelo menos ' + G.REGRAS.diaAtivoMin + ' min de foco, ' + G.REGRAS.diaAtivoQuestoes + ' questões, uma revisão ou um simulado. Cada dia seguido soma +3% de XP (até +42%). Uma vez por semana (a partir da segunda-feira) o escudo cobre um dia sem estudo e a chama não apaga.' + (ch.escudosUsados.length ? ' Escudos já usados: ' + ch.escudosUsados.slice(-3).map(App.fmtData).join(', ') + '.' : ''))),
      h('div', { class: 'cartao' }, h('h2', {}, 'Seus números'), h('div', { class: 'grade', style: 'grid-template-columns:repeat(2,minmax(0,1fr))' }, [['Horas focadas', App.min(Math.round(t.min))], ['Questões', t.q + (g.acertoPct != null ? ' (' + g.acertoPct + '% de acerto)' : '')], ['Revisões', t.rev], ['Simulados', t.sim]].map(([n, v]) => h('div', { class: 'afundado' }, h('div', { class: 'rotulo' }, n), h('b', {}, String(v))))),
        h('p', { class: 'muted peq' }, 'Regras do XP: 1 por minuto focado (até 300 por dia), 10 por questão, +5 por acerto, +5 por acerto com certeza, 15 por revisão e 100 por simulado.'))));
    // mapa de calor anual
    const cel = G.mapaCalor(g.xpPorDia, g.hoje); const W = 53 * 13 + 24, H = 7 * 13 + 18; const svg = sv('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'g-calor', role: 'img', 'aria-label': 'Mapa de calor de estudo dos últimos 12 meses' });
    cel.forEach(c => { if (c.nivel < 0) return; svg.append(sv('rect', { x: 24 + c.s * 13, y: 14 + c.d * 13, width: 11, height: 11, rx: 2, class: 'cal cal' + c.nivel }, sv('title', {}, App.fmtData(c.dia) + ': ' + c.xp + ' XP'))); });
    [['Seg', 1], ['Qua', 3], ['Sex', 5]].forEach(([n, d]) => svg.append(sv('text', { x: 0, y: 14 + d * 13 + 9, class: 'rx-rot cal-txt' }, n)));
    alvo.append(h('div', { class: 'cartao' }, h('h2', {}, 'Mapa de calor do ano'), h('div', { class: 'rolagem-x' }, svg), h('div', { class: 'linha peq muted', style: 'margin-top:6px' }, 'menos ', [0, 1, 2, 3, 4].map(n => sv('svg', { viewBox: '0 0 11 11', width: 11, height: 11, 'aria-hidden': 'true' }, sv('rect', { width: 11, height: 11, rx: 2, class: 'cal cal' + n }))), ' mais')));
    // brasões
    const grupos = {}; g.conquistas.forEach(c => (grupos[c.grupo] = grupos[c.grupo] || { nome: c.grupoNome, itens: [] }).itens.push(c)); const IC = { horas: 'relogio', questoes: 'duvida', revisoes: 'ciclo', simulados: 'prova', chama: 'chama' };
    const brasoes = h('div', { class: 'cartao' }, h('h2', {}, 'Brasões (' + g.conquistas.filter(c => c.ganha).length + ' de ' + g.conquistas.length + ')'));
    Object.keys(grupos).forEach(k => { const gr = grupos[k]; brasoes.append(h('h3', {}, gr.nome), h('div', { class: 'g-brasoes' }, gr.itens.map(c => h('div', { class: 'g-brasao br' + Math.min(5, c.nivelMarco + (k === 'horas' || k === 'questoes' ? 0 : 1)) + (c.ganha ? '' : ' trancado'), title: c.nome + ' — ' + c.texto + (c.ganha ? ' (conquistado)' : ' (faltam ' + Math.max(0, Math.ceil(c.meta - c.valor)) + ')') }, sv('svg', { viewBox: '0 0 48 56', class: 'g-brasao-svg', 'aria-hidden': 'true' }, sv('path', { d: 'M24 2l20 7v16c0 14-9 24-20 29C13 49 4 39 4 25V9z', class: 'g-escudo' }), sv('g', { transform: 'translate(12 12) scale(1)', class: 'g-glifo' }, sv('path', { d: ICONES[IC[k]], fill: 'none' }))), h('div', { class: 'g-bn' }, c.nome), h('div', { class: 'peq muted' }, c.ganha ? 'conquistado' : (k === 'horas' ? Math.floor(c.valor) + ' / ' + c.texto : Math.floor(c.valor) + ' / ' + c.meta)))))); });
    alvo.append(brasoes);
    // placar entre perfis
    const pl = await guilda.placar(); const max = Math.max(1, ...pl.map(p => p.xpSemana));
    alvo.append(h('div', { class: 'cartao' }, h('h2', {}, 'Placar da semana (perfis deste computador)'), pl.length < 2 ? h('div', { class: 'afundado muted peq' }, 'Só há um perfil. Crie outro no Dora Cofre (por exemplo, para outra pessoa da casa) para competir de forma amistosa. Nada sai do computador.') : null,
      h('div', { class: 'pilha' }, pl.map((p, i) => h('div', {}, h('div', { class: 'linha entre' }, h('b', {}, (i + 1) + 'º ' + p.nome + (p.ativo ? ' (você)' : '')), h('span', { class: 'muted' }, p.xpSemana + ' XP na semana · ' + p.xpTotal + ' no total')), h('div', { class: 'barra' }, h('i', { style: 'width:' + Math.round(100 * p.xpSemana / max) + '%' }))))), h('p', { class: 'muted peq' }, 'A semana começa na segunda-feira.')));
    alvo.append(h('div', { class: 'linha' }, h('a', { class: 'btn p', href: '#/salao' }, 'Abrir o Salão da Guilda'), h('a', { class: 'btn', href: '#/ajustes' }, 'Desligar a gamificação nos Ajustes')));
  };

  // ---------- Salão da Guilda (cosméticos) ----------
  V.salao = async (alvo) => {
    alvo.append(h('h1', {}, 'Salão da Guilda'), h('p', { class: 'muted' }, 'Personalize o seu perfil. Os itens são liberados conforme você sobe de nível estudando.'));
    if (!ligada()) { alvo.append(h('div', { class: 'cartao vazio' }, h('p', {}, 'A gamificação está desligada.'), h('a', { class: 'btn p', href: '#/ajustes' }, 'Ir aos Ajustes'))); return; }
    const g = await guilda.calcular(); const nivel = g.nivel.nivel; const prev = h('div'); const s = sal();
    const mostra = () => { prev.replaceChildren(cabecalho(g, true)); };
    const salva = () => { lsSet('doraDraw.salao', s); aplicaRealce(); mostra(); desenha(); };
    const nome = h('input', { type: 'text', value: s.nome, maxlength: 40, placeholder: nomeUsuario() || 'Seu nome', 'aria-label': 'Nome para as iniciais', onchange: (e) => { s.nome = e.target.value.trim(); salva(); } });
    const grade = h('div');
    const bloco = (titulo, grupo, chave, ver) => h('div', { class: 'cartao' }, h('h2', {}, titulo), h('div', { class: 'g-opcoes' }, G.SALAO[grupo].map(([id, n, niv]) => { const livre = nivel >= niv; return h('button', { type: 'button', class: 'g-opcao' + (s[chave] === id ? ' sel' : '') + (livre ? '' : ' trancado'), 'aria-pressed': String(s[chave] === id), disabled: !livre, title: livre ? n : 'Libera no nível ' + niv, onclick: () => { s[chave] = id; salva(); } }, ver(id), h('span', { class: 'g-on' }, n), livre ? null : h('span', { class: 'peq muted' }, 'nível ' + niv)); })));
    const desenha = () => { grade.replaceChildren(
      bloco('Moldura do avatar', 'molduras', 'moldura', (id) => h('div', { class: 'av av-' + id }, h('span', {}, G.iniciais(nomeUsuario())))),
      bloco('Cor de destaque', 'realces', 'realce', (id) => h('span', { class: 'g-amostra', 'data-realce': id === 'padrao' ? null : id }, '')),
      bloco('Selo', 'selos', 'selo', (id) => id === 'nenhum' ? h('span', { class: 'muted' }, '—') : ico(id)),
      bloco('Fundo do cabeçalho', 'fundos', 'fundo', (id) => h('div', { class: 'g-fundo g-fundo-' + id, style: 'width:64px;height:36px;border-radius:8px' }))); };
    alvo.append(prev, h('div', { class: 'cartao' }, h('label', { class: 'campo', style: 'max-width:340px' }, h('span', {}, 'Nome (para as iniciais do avatar)'), nome)), grade); mostra(); desenha();
  };

  // ---------- Rádio Foco ----------
  App.cartaoRadio = () => {
    const c = R.cfg; const estado = h('div', { class: 'chip' }, ''); const sel = h('div', { class: 'seg seg-quebra', role: 'group', 'aria-label': 'Som' });
    const btn = h('button', { class: 'btn p', type: 'button' }, 'Ligar'); const vol = h('input', { type: 'range', min: 0, max: 100, value: Math.round(c.vol * 100), 'aria-label': 'Volume', oninput: (e) => R.volume(e.target.value / 100) });
    const tmin = h('select', { 'aria-label': 'Temporizador', onchange: (e) => R.temporizador(+e.target.value) }, [[0, 'Sem temporizador'], [15, '15 min'], [25, '25 min'], [45, '45 min'], [60, '1 hora'], [90, '1 h 30'], [120, '2 horas']].map(([v, n]) => h('option', Object.assign({ value: v }, c.min === v ? { selected: true } : {}), n)));
    const junto = h('input', Object.assign({ type: 'checkbox', onchange: (e) => R.junto(e.target.checked) }, c.junto ? { checked: true } : {}));
    const desc = h('div', { class: 'muted peq' });
    const atualiza = () => { sel.replaceChildren(...R.TIPOS.map(([k, n]) => h('button', { type: 'button', 'aria-pressed': String(R.cfg.tipo === k), onclick: async () => { R.cfg.tipo = k; if (R.tocando) { try { await R.ligar(k, R.origem === 'parou-manual' ? 'manual' : R.origem); } catch (e) { App.toast(e.message, true); } } else atualiza(); } }, n))); estado.textContent = R.tocando ? 'tocando' + (R.fim ? ' · até ' + new Date(R.fim).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '') : 'parado'; estado.className = 'chip ' + (R.tocando ? 'ok' : ''); btn.textContent = R.tocando ? 'Parar' : 'Ligar'; desc.textContent = (R.TIPOS.find(t => t[0] === R.cfg.tipo) || [])[2] || ''; };
    btn.onclick = async () => { if (R.tocando) { R.parar(); return; } try { await R.ligar(R.cfg.tipo, 'manual'); } catch (e) { App.toast(e.message, true); } };
    atualiza(); const off = R.aoMudar(() => { if (!document.body.contains(btn)) { off(); return; } atualiza(); });
    return h('div', { class: 'cartao' }, h('div', { class: 'linha entre' }, h('h2', { style: 'margin:0' }, 'Rádio Foco'), estado), h('p', { class: 'muted peq' }, 'Sons de concentração gerados aqui mesmo, no navegador. Nenhum arquivo de música.'), sel, desc,
      h('div', { class: 'grade', style: 'grid-template-columns:repeat(auto-fit,minmax(180px,1fr));margin-top:10px' }, h('label', { class: 'campo' }, h('span', {}, 'Volume'), vol), h('label', { class: 'campo' }, h('span', {}, 'Temporizador'), tmin)),
      h('div', { class: 'linha', style: 'margin-top:10px' }, btn, h('label', { class: 'marca-op' }, junto, ' Ligar junto com o Dora Foco')));
  };
  V.radio = async (alvo) => { alvo.append(h('h1', {}, 'Rádio Foco'), App.cartaoRadio(), h('p', { class: 'muted peq' }, 'Dica: em fone de ouvido o ruído rosa ou a chuva cansam menos. Se o som não tocar, clique em Ligar: o navegador só libera o áudio depois de um clique.')); };
  const focoOrig = V.foco;
  V.foco = async (alvo, r) => { await focoOrig(alvo, r); alvo.append(App.cartaoRadio()); };

  // ---------- Ajustes: ligar/desligar a gamificação ----------
  const ajustesOrig = V.ajustes;
  V.ajustes = async (alvo, r) => {
    await ajustesOrig(alvo, r);
    const cb = h('input', Object.assign({ type: 'checkbox', onchange: (e) => { try { if (e.target.checked) localStorage.removeItem('doraDraw.guilda'); else localStorage.setItem('doraDraw.guilda', 'off'); } catch (er) { /* */ } App.toast(e.target.checked ? 'Gamificação ligada.' : 'Gamificação desligada.'); App.render(); } }, ligada() ? { checked: true } : {}));
    alvo.append(h('div', { class: 'cartao' }, h('h2', {}, 'Gamificação da Guilda'), h('p', { class: 'muted peq' }, 'XP, patentes, Chama da Guilda, brasões, mapa de calor, placar entre perfis e Salão. Tudo calculado a partir dos seus próprios estudos, só neste computador.'), h('label', { class: 'marca-op' }, cb, ' Gamificação ligada'), h('div', { class: 'linha', style: 'margin-top:8px' }, h('a', { class: 'btn', href: '#/guilda' }, 'Ver a Guilda'), h('a', { class: 'btn', href: '#/radio' }, 'Rádio Foco'))));
  };

  // ===================================================================
  // Mural da Guilda (post-its por disciplina)
  // ===================================================================
  const CORES = [['amarelo', 'Amarelo'], ['laranja', 'Laranja'], ['azul', 'Azul'], ['verde', 'Verde'], ['rosa', 'Rosa']];
  const MU = { disc: '' };
  V.mural = async (alvo) => {
    if (!App.exigeConcurso(alvo)) return; const c = App.S.conc; alvo.append(h('h1', {}, 'Mural da Guilda'), h('p', { class: 'muted' }, 'Post-its por disciplina: arraste, mude a cor, fixe, ligue a um tópico e cole imagens (Ctrl+V). Fica só no seu computador.'));
    let notas = (await DB.porIndice('mural', 'concursoId', c.id)); const urls = {}; let zmax = Math.max(10, ...notas.map(n => n.z || 0));
    if (MU.disc && MU.disc !== 'geral' && !App.S.disciplinas.some(d => d.id === MU.disc)) MU.disc = '';
    const quadro = h('div', { class: 'mural-quadro', tabindex: -1, 'aria-label': 'Quadro de post-its' }); const abas = h('div', { class: 'abas', role: 'tablist' });
    const chaveDisc = () => MU.disc || 'geral'; const daAba = () => notas.filter(n => (n.disciplinaId || 'geral') === chaveDisc());
    const grava = (n) => DB.put('mural', n);
    const imagemUrl = async (n) => { if (!n.imagemId) return null; if (urls[n.imagemId]) return urls[n.imagemId]; const a = await DB.get('arquivos', n.imagemId); if (!a || !a.blob) return null; return urls[n.imagemId] = URL.createObjectURL(a.blob); };
    const ajustaAltura = () => { let max = 520; quadro.querySelectorAll('.postit').forEach(p => { max = Math.max(max, p.offsetTop + p.offsetHeight + 24); }); quadro.style.height = max + 'px'; };
    const novo = async (extra = {}) => { const k = daAba().length; const n = Object.assign({ id: L.uid('mu'), concursoId: c.id, disciplinaId: MU.disc && MU.disc !== 'geral' ? MU.disc : null, topicoId: null, texto: '', cor: 'amarelo', fixo: false, x: 12 + (k % 6) * 24, y: 12 + (k % 6) * 24, z: ++zmax, criado: Date.now() }, extra); notas.push(n); await grava(n); desenha(); };
    const apaga = async (n) => { if (!(await App.confirmar('Apagar este post-it?', 'Apagar'))) return; notas = notas.filter(x => x.id !== n.id); await DB.del('mural', n.id); if (n.imagemId) { await DB.del('arquivos', n.imagemId); if (urls[n.imagemId]) { URL.revokeObjectURL(urls[n.imagemId]); delete urls[n.imagemId]; } } desenha(); };
    const guardaImagem = async (blob) => { const id = L.uid('mi'); await DB.put('arquivos', { id, blob }); await novo({ imagemId: id, cor: 'azul' }); };
    const card = async (n) => {
      const img = await imagemUrl(n); const ta = h('textarea', { class: 'postit-txt', 'aria-label': 'Texto do post-it', placeholder: 'Escreva aqui...', onchange: async (e) => { n.texto = e.target.value; await grava(n); } }, n.texto || ''); ta.addEventListener('input', () => { ta.style.height = 'auto'; ta.style.height = Math.min(220, ta.scrollHeight) + 'px'; ajustaAltura(); });
      const el = h('div', { class: 'postit cor-' + n.cor + (n.fixo ? ' fixo' : ''), style: 'left:' + n.x + 'px;top:' + n.y + 'px;z-index:' + (n.fixo ? 5000 + (n.z || 0) : (n.z || 1)) });
      const cab = h('div', { class: 'postit-cab', tabindex: 0, title: n.fixo ? 'Fixado: solte o pino para mover' : 'Arraste para mover (ou use as setas)', 'aria-label': 'Mover post-it' }, h('span', { class: 'pino' }, n.fixo ? '📌' : '⠿'), h('span', { class: 'muted peq' }, n.fixo ? 'fixado' : 'arraste'));
      const limita = () => { const q = quadro.clientWidth; n.x = Math.max(0, Math.min(n.x, Math.max(0, q - el.offsetWidth))); n.y = Math.max(0, n.y); el.style.left = n.x + 'px'; el.style.top = n.y + 'px'; ajustaAltura(); };
      let arrasta = null; cab.addEventListener('pointerdown', (e) => { if (n.fixo) return; e.preventDefault(); cab.setPointerCapture(e.pointerId); const r0 = el.getBoundingClientRect(); arrasta = { dx: e.clientX - r0.left, dy: e.clientY - r0.top }; n.z = ++zmax; el.style.zIndex = n.z; el.classList.add('movendo'); });
      cab.addEventListener('pointermove', (e) => { if (!arrasta) return; const q = quadro.getBoundingClientRect(); n.x = e.clientX - q.left - arrasta.dx; n.y = e.clientY - q.top - arrasta.dy; limita(); });
      const solta = async () => { if (!arrasta) return; arrasta = null; el.classList.remove('movendo'); await grava(n); }; cab.addEventListener('pointerup', solta); cab.addEventListener('pointercancel', solta);
      cab.addEventListener('keydown', async (e) => { const d = { ArrowLeft: [-12, 0], ArrowRight: [12, 0], ArrowUp: [0, -12], ArrowDown: [0, 12] }[e.key]; if (!d || n.fixo) return; e.preventDefault(); n.x += d[0]; n.y += d[1]; limita(); await grava(n); });
      const cores = h('div', { class: 'postit-cores', role: 'group', 'aria-label': 'Cor' }, CORES.map(([k, nm]) => h('button', { type: 'button', class: 'pcor cor-' + k + (n.cor === k ? ' sel' : ''), title: nm, 'aria-label': nm, 'aria-pressed': String(n.cor === k), onclick: async () => { n.cor = k; await grava(n); desenha(); } })));
      const link = App.selTopico(n.topicoId, async (v) => { n.topicoId = v; await grava(n); desenha(); }, true, 'Ligar a um tópico'); link.className = 'postit-sel';
      const rodape = h('div', { class: 'postit-pe' }, h('button', { class: 'btn mini', type: 'button', onclick: async () => { n.fixo = !n.fixo; n.z = ++zmax; await grava(n); desenha(); } }, n.fixo ? 'Soltar' : 'Fixar'), h('button', { class: 'btn mini perigo', type: 'button', 'aria-label': 'Apagar post-it', onclick: () => apaga(n) }, 'Apagar'));
      el.append(...[cab, img ? h('img', { class: 'postit-img', src: img, alt: 'Imagem do post-it' }) : null, ta, n.topicoId && App.topico(n.topicoId) ? h('a', { class: 'chip azul postit-link', href: '#/topico/' + n.topicoId }, App.nomeTopico(n.topicoId)) : null, cores, link, rodape].filter(Boolean)); return el;
    };
    const desenha = async () => {
      abas.replaceChildren(...[['geral', 'Geral']].concat(App.S.disciplinas.map(d => [d.id, d.nome])).map(([k, n]) => h('button', { type: 'button', role: 'tab', 'aria-selected': String(chaveDisc() === k), onclick: () => { MU.disc = k === 'geral' ? '' : k; desenha(); } }, n + ' (' + notas.filter(x => (x.disciplinaId || 'geral') === k).length + ')')));
      const lista = daAba().sort((a, b) => (a.fixo ? 1 : 0) - (b.fixo ? 1 : 0) || (a.z || 0) - (b.z || 0)); const els = []; for (const n of lista) els.push(await card(n));
      quadro.replaceChildren(...els); if (!lista.length) quadro.append(h('div', { class: 'vazio mural-vazio' }, 'Nenhum post-it aqui. Clique em "Novo post-it" ou cole uma imagem com Ctrl+V.')); requestAnimationFrame(() => { quadro.querySelectorAll('.postit-txt').forEach(t => { t.style.height = 'auto'; t.style.height = Math.min(220, Math.max(60, t.scrollHeight)) + 'px'; }); els.forEach((el, i) => { const n = lista[i]; const q = quadro.clientWidth; if (n.x > q - el.offsetWidth) { n.x = Math.max(0, q - el.offsetWidth); el.style.left = n.x + 'px'; } }); ajustaAltura(); });
    };
    const arq = h('input', { type: 'file', accept: 'image/*', class: 'oculto', 'aria-label': 'Escolher imagem', onchange: async (e) => { const f = e.target.files[0]; if (f) await guardaImagem(f); e.target.value = ''; } });
    alvo.append(h('div', { class: 'linha nao-imprime', style: 'margin-bottom:10px' }, h('button', { class: 'btn p', onclick: () => novo() }, 'Novo post-it'), h('button', { class: 'btn', onclick: () => arq.click() }, 'Adicionar imagem'), arq, h('span', { class: 'muted peq' }, 'Dica: copie um print e aperte Ctrl+V nesta tela.')), h('div', { class: 'cartao' }, abas, h('div', { style: 'margin-top:10px' }, quadro)));
    const colar = async (e) => { if (!document.body.contains(quadro)) { document.removeEventListener('paste', colar); return; } const tag = (e.target && e.target.tagName) || ''; if (tag === 'TEXTAREA' || tag === 'INPUT') return; const item = [...(e.clipboardData ? e.clipboardData.items : [])].find(i => i.type.startsWith('image/')); if (!item) return; e.preventDefault(); await guardaImagem(item.getAsFile()); App.toast('Imagem colada no mural.'); };
    document.addEventListener('paste', colar); App.aoSair(() => { document.removeEventListener('paste', colar); Object.values(urls).forEach(u => URL.revokeObjectURL(u)); });
    window.addEventListener('resize', ajustaAltura); App.aoSair(() => window.removeEventListener('resize', ajustaAltura));
    await desenha();
  };
})();
