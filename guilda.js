/* Dora Guilda · Engenharia Cognitiva para Concursos Públicos
   Catálogo único dos módulos (nome próprio + o que faz) e menu comum a todas as páginas. */
(function(){
var G=window.GUILDA={nome:'Dora Guilda',sub:'Engenharia Cognitiva para Concursos Públicos'};
/* item: [chave ou endereço, ícone, nome, o que faz]. Chave simples = rota do Dora Estúdio (estudio.html#chave) */
G.groups=[
 ['Começar',[['plano','🎯','Dora Missão do Dia','O que estudar agora e seu plano até a prova'],['mira','🧭','Mira da Guilda','Onde mirar: o que mais vale × onde você mais erra'],['sim','🎲','Dora Oráculo','Sua chance de passar, em 10.000 provas simuladas']],'treino'],
 ['Aprender a resolver',[['mt','🎓','Dora Examinador','Como a banca cobra cada tópico e onde ela pega'],['met','📜','Grimório de Métodos','Passo a passo para cada tipo de questão'],['ref','⚡','Dora Reflexo','Treinos rápidos de 6 segundos'],['mm','🧠','Mapas da Guilda','O assunto inteiro numa imagem'],['esq','🗺️','Pergaminhos de Esquemas','Duelos, listas e desenhos para a prova']],'treino'],
 ['Treinar',[['cq','🧩','Dora Cartas','Questão como na prova e explicação de cada alternativa'],['fc','🃏','Dora Memória','Flashcards com repetição espaçada'],['anki','🎴','Baralhos da Guilda','Seus baralhos do Anki, com imagem']],'memoria'],
 ['Assistir e ouvir',[['v','🎬','Dora Aulas','Aulas animadas e narradas'],['pod','🎧','Dora Rádio','Resumos em áudio do NotebookLM']],'apoio'],
 ['Inteligência da prova',[['lab','🔬','Laboratório da Banca','O que é mito e o que foi medido na banca'],['radar','📡','Radar da Guilda','Tendências da Transpetro e da prova'],['geo','📍','Mapa-Mundi Transpetro','Onde a empresa atua']],'acompanhar'],
 ['Inteligência artificial',[['gem','✨','Dora Mentora (IA)','Gemini ou Claude: crie questões e explicações']],'apoio'],
 ['Acompanhar seu estudo',[['draw/index.html','✏️','Dora Draw','Edital, foco, ciclo, agenda, revisões, simulados, cartas e cofre']],'acompanhar'],
 ['Outros módulos',[['expedicao.html','🚢','Dora Expedição','Jornada por 115 estações'],['jogo.html','🏁','Arena Relâmpago','Jogo de questões com XP'],['index.html','📚','Doroxandria','Biblioteca de 1.000 questões e caderno de erros']],'acompanhar'],
 ['Em integração (online)',[['https://claude.ai/artifact/RM3deSQtfLSBqJ5yBAgUMP','🏰','Dora Central','Fichas do examinador, simulados e atlas'],['identidade/index.html','🎨','Identidade da Guilda','Logo, ícones, capa e avatares das patentes']],'apoio']];

/* Ícones dos módulos: estilo "constelação" (traço + nós em laranja). Inline, herdam a cor do texto e o laranja do tema. */
G.BASE=(function(){var s=document.currentScript;return s&&s.src?s.src.replace(/[^\/]*$/,''):'';})();
/* Ícones: sprite da identidade "D-Grafo" (identidade/sprite.svg). Nomes antigos -> nomes do sprite */
G.MAPA={plano:'plano',mira:'foco',sim:'simulados',mt:'examinador',met:'estruturas',ref:'rajada',mm:'mapa-mental',esq:'quadro',cq:'cartas',fc:'revisoes',anki:'cartao',v:'youtube-minuto',pod:'radio',lab:'raiox',radar:'estatisticas',geo:'orgao',gem:'mentora',expedicao:'trilha',jogo:'conquistas',index:'estante',draw:'rascunho',central:'palacio',identidade:'galeria'};
G.SIMBOLO='<title id="simb-t">Símbolo Dora Guilda</title><desc id="simb-d">Letra D formada por nós e arestas de um grafo, com um cérebro orgânico no centro, de onde saem as conexões: estudo como rede de ideias.</desc><defs><radialGradient id="simb-gl"><stop offset="0" stop-color="var(--destaque-2, #f4a463)" stop-opacity=".75"/><stop offset="1" stop-color="var(--destaque-2, #f4a463)" stop-opacity="0"/></radialGradient><linearGradient id="simb-st" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--destaque-2, #f4a463)"/><stop offset="1" stop-color="var(--destaque, #e8853a)"/></linearGradient></defs><circle cx="31" cy="32" r="14" fill="url(#simb-gl)"/><path d="M31 32 16 12M31 32 16 52M31 32 34 12M31 32 49 24M31 32 49 40M31 32 34 52" fill="none" stroke="var(--accent, #a64d14)" stroke-width="1.7" stroke-linecap="round" opacity=".55"/><path d="M16 12H34L49 24V40L34 52H16Z" fill="none" stroke="var(--accent, #a64d14)" stroke-width="4.4" stroke-linejoin="round" stroke-linecap="round"/><circle cx="16" cy="12" r="3.3" fill="var(--destaque, #e8853a)" stroke="var(--paper, #ffffff)" stroke-width="1.5"/><circle cx="16" cy="52" r="3.3" fill="var(--destaque, #e8853a)" stroke="var(--paper, #ffffff)" stroke-width="1.5"/><circle cx="34" cy="12" r="3.3" fill="var(--destaque, #e8853a)" stroke="var(--paper, #ffffff)" stroke-width="1.5"/><circle cx="49" cy="24" r="3.3" fill="var(--destaque, #e8853a)" stroke="var(--paper, #ffffff)" stroke-width="1.5"/><circle cx="49" cy="40" r="3.3" fill="var(--destaque, #e8853a)" stroke="var(--paper, #ffffff)" stroke-width="1.5"/><circle cx="34" cy="52" r="3.3" fill="var(--destaque, #e8853a)" stroke="var(--paper, #ffffff)" stroke-width="1.5"/><g transform="translate(31.5 32.4) scale(1.02) translate(-12.3 -9.6)" stroke-linecap="round" stroke-linejoin="round"><path d="M13.6 15.6C14 17.4 13.7 18.9 12.8 20.4" fill="none" stroke="var(--destaque-borda, #d27330)" stroke-width="1.87"/><path d="M15.4 15.4C15.5 17.8 19.4 18.4 20.6 16.1 21.2 15.1 20.4 14.2 18.4 14.5 17.4 16.1 16.3 16 15.4 15.4Z" fill="url(#simb-st)" stroke="var(--destaque-borda, #d27330)" stroke-width="0.85"/><path d="M3.4 11.6C1.9 9.9 2.2 7 4.3 5.7 4.8 3.4 7.4 2.1 9.5 2.9 10.8 1.3 13.7 1.1 15.1 2.6 17 1.7 19.6 2.8 20.2 5 22.2 5.8 22.8 8.5 21.7 10.3 22.3 12.6 20.8 14.6 18.4 14.5 17.4 16.1 15 16.4 13.7 15.4 12.2 16.6 9.5 16.5 8.5 15.1 6.2 15.7 3.9 14.3 3.4 11.6Z" fill="url(#simb-st)" stroke="var(--destaque-borda, #d27330)" stroke-width="0.85"/><path d="M13.3 3.1C12.2 4.7 13.9 5.9 12.9 7.5S12.5 9.8 13.6 10.5M6.4 12.7C8.3 11.6 9.9 12.9 12 11.9S15.3 11.2 16.6 12.5M5 9.5C6.3 8.3 7.4 9.7 8.8 8.7S10.5 6.7 9.7 5.3M15.6 4.2C14.9 5.7 16.8 6.4 16.3 8S17.9 9.7 19.6 8.8M6.5 6.1C7.6 5.2 8.9 5.7 9.5 4.6M18 11.3C19.1 10.5 20.2 11.4 20.9 10.7M9.1 14.7C10.2 13.8 11.5 14.7 12.7 13.8M10.6 9.9C11.3 9.2 12.3 9.6 12.8 9" fill="none" stroke="var(--accent, #a64d14)" stroke-width="0.85" opacity=".9"/><path d="M6 5.6C7.4 4 9.4 3.6 10.6 4.2" fill="none" stroke="#fff" stroke-width="0.765" opacity=".55"/></g>';
G.CHAVES={'draw/index.html':'draw','expedicao.html':'expedicao','jogo.html':'jogo','index.html':'index','identidade/index.html':'identidade'};
G.svg=function(k,size){var n=G.CHAVES[k]||(/artifact\/Ukc2/.test(k)?'draw':(/artifact\/RM3d/.test(k)?'central':k));size=size||26;
  if(n==='marca')return '<svg class="gi gm" viewBox="0 0 64 64" width="'+size+'" height="'+size+'" aria-hidden="true" focusable="false">'+G.SIMBOLO+'</svg>';
  var d=G.MAPA[n];if(!d)return null;return '<svg class="gi" viewBox="0 0 24 24" width="'+size+'" height="'+size+'" aria-hidden="true" focusable="false"><use href="'+G.BASE+'identidade/sprite.svg#dg-'+d+'"/></svg>';};
G.ico=function(t,size){return G.svg(t[0],size)||t[1];};
G.href=function(t){var k=t[0];if(/^https?:/.test(k))return k;if(/\.html$/.test(k))return k;return 'estudio.html#'+k;};
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function ui(){
  if(document.getElementById('sb')||document.documentElement.classList.contains('embed')||document.getElementById('gdb'))return;
  var page=(location.pathname.split('/').pop()||'index.html');
  var b=document.createElement('button');b.id='gdb';b.type='button';b.setAttribute('aria-expanded','false');b.setAttribute('aria-controls','gd');b.innerHTML='<span aria-hidden="true" style="display:grid">'+G.svg('marca',24)+'</span> <span class="gl">Menu da Guilda</span>';
  var sc=document.createElement('div');sc.id='gds';sc.hidden=true;
  var d=document.createElement('aside');d.id='gd';d.setAttribute('aria-label','Menu da Dora Guilda');
  var h='<a class="gdl" href="estudio.html"><i>'+G.svg('marca',34)+'</i><span>'+G.nome+'<small>'+G.sub+'</small></span></a>';
  G.groups.forEach(function(g){h+='<div class="gdg">'+esc(g[0])+'</div>';g[1].forEach(function(t){var cur=(t[0]===page);h+='<a class="gdi" data-sec="'+g[2]+'" href="'+G.href(t)+'"'+(cur?' aria-current="page"':'')+'><span class="ic" aria-hidden="true">'+G.ico(t,22)+'</span><span class="tx"><b>'+esc(t[2])+'</b><small>'+esc(t[3])+'</small></span></a>';});});
  d.innerHTML=h;document.body.appendChild(sc);document.body.appendChild(d);document.body.appendChild(b);
  function open(on){d.classList.toggle('on',on);sc.hidden=!on;b.setAttribute('aria-expanded',String(on));if(on){var a=d.querySelector('a.gdi');if(a)a.focus();}else b.focus();}
  b.onclick=function(){open(!d.classList.contains('on'));};sc.onclick=function(){open(false);};
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&d.classList.contains('on')){e.stopPropagation();open(false);}},true);
}
if(document.body)ui();else document.addEventListener('DOMContentLoaded',ui);
})();

(function(){var GG=window.GUILDA,G=GG;
/* Figuras da identidade (molduras, selos, estados vazios). Mapas: patente->moldura, conquista->selo. Selo não conquistado fica cinza e opaco. */
GG.PATENTES=['aprendiz','estudante','praticante','veterano','estrategista','mestre','grao-mestre','lenda'];
GG.fig=function(pasta,nome,w,extra){return '<img src="'+GG.BASE+'identidade/'+pasta+'/'+nome+'.svg" width="'+(w||96)+'" alt="'+(extra&&extra.alt||'')+'" style="'+(extra&&extra.off?'filter:grayscale(1);opacity:.4;':'')+'max-width:100%;height:auto">';};
GG.vazio=function(nome,texto,w){return '<div style="text-align:center;padding:18px 8px">'+GG.fig('estados-vazios',nome,w||220)+'<p class="note" style="margin-top:8px">'+(texto||'')+'</p></div>';};
GG.selo=function(nome,on,w){return GG.fig('selos',nome,w||72,{off:!on,alt:nome});};
GG.moldura=function(i,w){return GG.fig('molduras',GG.PATENTES[Math.min(GG.PATENTES.length-1,Math.max(0,i|0))],w||96);};
})();
