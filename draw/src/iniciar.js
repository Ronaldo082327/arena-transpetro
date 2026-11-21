/* Dora Draw — partida: carrega concurso aberto e a IA, e desenha a primeira tela. */
(async function () {
  const App = window.App;
  try {
    await App.carregarConcurso(null);
    try { await App.ia.carregar(); } catch (e) { console.warn('IA', e); }
    if (!location.hash) location.hash = '#/inicio';
    await App.render(); App.copiaAutomatica(); setInterval(() => App.copiaAutomatica(), 1800000);
    window.__doraPronto = true;
  } catch (e) {
    console.error(e);
    document.getElementById('principal').textContent = 'Não consegui abrir o banco de dados do navegador: ' + e.message + '. Se você está em janela anônima, abra em uma janela normal.';
  }
})();
