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
G.MAPA={plano:'plano',mira:'foco',sim:'simulados',mt:'examinador',met:'estruturas',ref:'rajada',mm:'mapa-mental',esq:'quadro',cq:'cartas',fc:'revisoes',anki:'cartao',v:'youtube-minuto',pod:'radio',lab:'raiox',radar:'estatisticas',geo:'orgao',gem:'mentora',expedicao:'trilha',jogo:'conquistas',index:'estante',draw:'rascunho',central:'palacio',identidade:'galeria',config:'concursos'};
G.SIMBOLO='<defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4a463"/><stop offset="1" stop-color="#e8853a"/></linearGradient><linearGradient id="ah" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".75"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/></linearGradient><filter id="as" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="2" stdDeviation="1.6" flood-color="#5c381a" flood-opacity=".35"/></filter></defs><g filter="url(#as)"><path d="M32 3L57 13v20c0 14-10 25-25 29C17 58 7 47 7 33V13z" fill="url(#ag)" stroke="#d27330" stroke-width="1.6" stroke-linejoin="round"/></g><path d="M32 5L55 14v19c0 12-9 22-23 27" fill="none" stroke="url(#ah)" stroke-width="2" stroke-linejoin="round"/><path d="M32 3L57 13v20c0 14-10 25-25 29C17 58 7 47 7 33V13z" fill="url(#ah)" opacity=".5"/><g stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" fill="none"><path d="M21 19L21 45"/><path d="M21 19L35 19"/><path d="M35 19L46 32"/><path d="M46 32L35 45"/><path d="M35 45L21 45"/></g><g stroke="#ffffff" stroke-width="1.2" stroke-linecap="round" opacity=".55" fill="none"><path d="M31 32L21 19"/><path d="M31 32L21 45"/><path d="M31 32L46 32"/></g><path d="M35 19L49 15" stroke="#a64d14" stroke-width="1.8" stroke-linecap="round" fill="none"/><circle cx="31" cy="32" r="2.1" fill="#fff"/><circle cx="35" cy="19" r="2.6" fill="#fff" stroke="#a64d14" stroke-width="1"/><circle cx="35" cy="45" r="2.6" fill="#fff" stroke="#a64d14" stroke-width="1"/><circle cx="21" cy="19" r="3.5" fill="#fff" stroke="#a64d14" stroke-width="1.4"/><circle cx="21" cy="45" r="3.5" fill="#fff" stroke="#a64d14" stroke-width="1.4"/><circle cx="46" cy="32" r="3.5" fill="#fff" stroke="#a64d14" stroke-width="1.4"/><circle cx="49" cy="15" r="3" fill="#a64d14"/><circle cx="49" cy="15" r="5.4" fill="none" stroke="#a64d14" stroke-width=".8" opacity=".6"/>';
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
