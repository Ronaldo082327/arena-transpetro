/* Dora Draw — identidade visual (figuras novas): ícones por sprite, logo, estados vazios, onboarding, molduras, selos, avatares e capas.
   As figuras vêm de identidade-dados.js (GERADO por scripts/montar-identidade.js). Todas usam var(--token), então seguem os 17 temas.
   Aqui só entram FIGURAS: nenhuma cor, token ou layout do app é alterado. */
(function () {
  const D = window.DoraIdentidadeDados; if (!D) return;
  const SVGNS = 'http://www.w3.org/2000/svg';
  // nomes antigos do app -> nomes da identidade (os que já são iguais passam direto)
  const MAPA = { conc: 'concursos', erros: 'diario', plano: 'agenda', stats: 'estatisticas', ia: 'mentora', ajustes: 'configuracoes', guilda: 'patente', escudo: 'patente', livro: 'estante', coroa: 'conquistas', estrela: 'xp', relogio: 'timer' };
  // 'mais' (grade de quatro quadros do menu) não existe no conjunto novo: desenhado no mesmo estilo (traço 1,75, um nó de grafo)
  const MAIS = '<symbol id="dg-mais" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4.5h4.5a.5.5 0 0 1 .5.5v4.5a.5.5 0 0 1-.5.5H5a.5.5 0 0 1-.5-.5V5a.5.5 0 0 1 .5-.5zM14 4.5h4.5a.5.5 0 0 1 .5.5v4.5a.5.5 0 0 1-.5.5H14a.5.5 0 0 1-.5-.5V5a.5.5 0 0 1 .5-.5zM5 14h4.5a.5.5 0 0 1 .5.5V19a.5.5 0 0 1-.5.5H5a.5.5 0 0 1-.5-.5v-4.5A.5.5 0 0 1 5 14z"/></g><circle cx="16.25" cy="16.25" r="2.4" fill="currentColor" stroke="none"/></symbol>';
  const nomeIco = (n) => { const novo = MAPA[n] || n; return D.icones.indexOf(novo) >= 0 || novo === 'mais' ? novo : null; };

  // sprite de linha: colado uma vez no corpo da página
  const injeta = () => { if (document.getElementById('dg-sprite-raiz')) return; const t = document.createElement('div'); t.id = 'dg-sprite-raiz'; t.setAttribute('aria-hidden', 'true'); t.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden'; t.innerHTML = D.sprite.replace('</svg>', MAIS + '</svg>'); document.body.insertBefore(t, document.body.firstChild); };
  if (document.body) injeta(); else document.addEventListener('DOMContentLoaded', injeta);

  // ícone de interface: <svg><use href="#dg-nome"/></svg>
  const ico = (n, cls) => { const s = document.createElementNS(SVGNS, 'svg'); s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('aria-hidden', 'true'); if (cls) s.setAttribute('class', cls); const u = document.createElementNS(SVGNS, 'use'); u.setAttribute('href', '#dg-' + (nomeIco(n) || 'mais')); s.append(u); return s; };

  // figura inline (para herdar o tema). Cada inserção ganha ids próprios para os gradientes não colidirem.
  let contador = 0;
  const unico = (svg) => { const n = ++contador; const ids = []; svg.replace(/\bid="([^"]+)"/g, (m, i) => { ids.push(i); return m; }); let r = svg; ids.forEach((i) => { const novo = i + '-u' + n; r = r.split('id="' + i + '"').join('id="' + novo + '"').split('url(#' + i + ')').join('url(#' + novo + ')').split('#' + i + '"').join('#' + novo + '"').split('"' + i + ' ').join('"' + novo + ' ').split(' ' + i + '"').join(' ' + novo + '"'); }); return r; };
  const figura = (grupo, nome, cls, op = {}) => { let svg = D[grupo] && D[grupo][nome]; const el = document.createElement('span'); el.className = 'dg-fig ' + (cls || ''); if (!svg) return el; svg = unico(svg); if (op.cobrir) svg = svg.replace(/preserveAspectRatio="[^"]*"/, '').replace('<svg ', '<svg preserveAspectRatio="xMidYMid slice" '); if (op.decorativa !== false) svg = svg.replace('role="img"', 'aria-hidden="true"').replace(/\saria-labelledby="[^"]*"/, ''); el.innerHTML = svg; return el; };

  const marca = (cls) => figura('marca', 'simbolo', 'dg-marca ' + (cls || ''));
  const vazio = (nome, cls) => { const w = figura('vazios', nome, 'dg-vazio-fig ' + (cls || '')); return w; };
  const CAPA_DE = { inicio: 'inicio', edital: 'edital', estudar: 'estudar', simulados: 'simulados', ia: 'mentora', salao: 'salao' };
  const capa = (rota) => CAPA_DE[rota] && D.capas[CAPA_DE[rota]] ? figura('capas', CAPA_DE[rota], 'dg-capa', { cobrir: true }) : null;
  const moldura = (id) => figura('molduras', id, 'dg-moldura');
  const selo = (id, ganho) => figura('selos', id, 'dg-selo' + (ganho === false ? ' dg-selo-off' : ''));
  const avatar = (id) => figura('avatares', id, 'dg-avatar-img');

  // onboarding (3 telas) com "Pular"; aparece uma vez, no primeiro acesso
  const CHAVE_ONB = 'doraDraw.onboarding';
  const TEXTOS = [['1-mapeie-o-edital', 'Mapeie o edital', 'Cole o texto do edital (ou escolha o PDF) e o Dora Draw monta as disciplinas e os tópicos para você.'], ['2-treine-com-metodo', 'Treine com método', 'Resolva questões, classifique cada erro e deixe o Diário de Batalha mostrar o que treinar.'], ['3-revise-no-momento-certo', 'Revise no momento certo', 'Cartões e tópicos voltam na hora certa, antes de você esquecer.']];
  const jaViu = () => { try { return localStorage.getItem(CHAVE_ONB) === '1'; } catch (e) { return true; } };
  const marcaVisto = () => { try { localStorage.setItem(CHAVE_ONB, '1'); } catch (e) { /* sem armazenamento */ } };
  const onboarding = (App, forcar) => {
    if (!forcar && jaViu()) return null; const h = App.h; let i = D.marca && D.marca.abertura ? -1 : 0; const cena = h('div', { class: 'dg-onb' }); let m;
    const fim = () => { marcaVisto(); m.fechar(); };
    const desenha = () => {
      // tela de abertura: o girassol nasce semente por semente (animação no próprio SVG; respeita "reduzir movimento")
      if (i < 0) { cena.replaceChildren(figura('marca', 'abertura', 'dg-onb-fig dg-abertura'), h('div', { class: 'linha', style: 'justify-content:center;margin-top:10px' }, h('button', { class: 'btn', type: 'button', 'data-onb': 'pular', onclick: fim }, 'Pular'), h('button', { class: 'btn p', type: 'button', 'data-onb': 'proximo', onclick: () => { i++; desenha(); } }, 'Começar'))); return; }
      const [k, tit, txt] = TEXTOS[i]; cena.replaceChildren(figura('onboarding', k, 'dg-onb-fig'), h('h3', { style: 'margin:8px 0 4px;text-align:center' }, tit), h('p', { class: 'muted', style: 'text-align:center;margin:0 0 10px' }, txt), h('div', { class: 'dg-onb-pontos', 'aria-hidden': 'true' }, TEXTOS.map((_, j) => h('i', { class: j === i ? 'on' : '' }))), h('div', { class: 'linha', style: 'justify-content:center' }, h('button', { class: 'btn', type: 'button', 'data-onb': 'pular', onclick: fim }, 'Pular'), i < TEXTOS.length - 1 ? h('button', { class: 'btn p', type: 'button', 'data-onb': 'proximo', onclick: () => { i++; desenha(); } }, 'Próximo') : h('button', { class: 'btn p', type: 'button', 'data-onb': 'comecar', onclick: fim }, 'Começar'))); };
    m = App.modal('Bem-vindo ao Dora Draw', cena, { aoFechar: marcaVisto }); m.el.classList.add('dg-onb-dialogo'); desenha(); return m;
  };

  window.DoraIdentidade = { dados: D, ico, nomeIco, figura, marca, vazio, capa, moldura, selo, avatar, onboarding, jaViu, CHAVE_ONB, MAPA };
})();
