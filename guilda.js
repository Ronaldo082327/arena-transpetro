/* Dora Guilda · Engenharia Cognitiva para Concursos Públicos
   Catálogo único dos módulos (nome próprio + o que faz) e menu comum a todas as páginas. */
(function(){
var G=window.GUILDA={nome:'Dora Guilda',sub:'Engenharia Cognitiva para Concursos Públicos'};
/* item: [chave ou endereço, ícone, nome, o que faz]. Chave simples = rota do Dora Estúdio (estudio.html#chave) */
G.groups=[
 ['Começar',[['plano','🎯','Dora Missão do Dia','O que estudar agora e seu plano até a prova'],['sim','🎲','Dora Oráculo','Sua chance de passar, em 10.000 provas simuladas']],'treino'],
 ['Aprender a resolver',[['mt','🎓','Dora Examinador','Como a banca cobra cada tópico e onde ela pega'],['met','📜','Grimório de Métodos','Passo a passo para cada tipo de questão'],['ref','⚡','Dora Reflexo','Treinos rápidos de 6 segundos'],['mm','🧠','Mapas da Guilda','O assunto inteiro numa imagem'],['esq','🗺️','Pergaminhos de Esquemas','Duelos, listas e desenhos para a prova']],'treino'],
 ['Treinar',[['cq','🧩','Dora Cartas','Questão como na prova e explicação de cada alternativa'],['fc','🃏','Dora Memória','Flashcards com repetição espaçada'],['anki','🎴','Baralhos da Guilda','Seus baralhos do Anki, com imagem']],'memoria'],
 ['Assistir e ouvir',[['v','🎬','Dora Aulas','Aulas animadas e narradas'],['pod','🎧','Dora Rádio','Resumos em áudio do NotebookLM']],'apoio'],
 ['Inteligência da prova',[['lab','🔬','Laboratório da Banca','O que é mito e o que foi medido na banca'],['radar','📡','Radar da Guilda','Tendências da Transpetro e da prova'],['geo','📍','Mapa-Mundi Transpetro','Onde a empresa atua']],'acompanhar'],
 ['Inteligência artificial',[['gem','✨','Dora Mentora (IA)','Gemini ou Claude: crie questões e explicações']],'apoio'],
 ['Acompanhar seu estudo',[['draw/index.html','✏️','Dora Draw','Edital, foco, ciclo, agenda, revisões, simulados, cartas e cofre']],'acompanhar'],
 ['Outros módulos',[['expedicao.html','🚢','Dora Expedição','Jornada por 115 estações'],['jogo.html','🏁','Arena Relâmpago','Jogo de questões com XP'],['index.html','📚','Doroxandria','Biblioteca de 1.000 questões e caderno de erros']],'acompanhar'],
 ['Em integração (online)',[['https://claude.ai/artifact/RM3deSQtfLSBqJ5yBAgUMP','🏰','Dora Central','Fichas do examinador, simulados e atlas']],'apoio']];
G.href=function(t){var k=t[0];if(/^https?:/.test(k))return k;if(/\.html$/.test(k))return k;return 'estudio.html#'+k;};
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function ui(){
  if(document.getElementById('sb')||document.documentElement.classList.contains('embed')||document.getElementById('gdb'))return;
  var page=(location.pathname.split('/').pop()||'index.html');
  var b=document.createElement('button');b.id='gdb';b.type='button';b.setAttribute('aria-expanded','false');b.setAttribute('aria-controls','gd');b.innerHTML='<span aria-hidden="true">🏰</span> <span class="gl">Menu da Guilda</span>';
  var sc=document.createElement('div');sc.id='gds';sc.hidden=true;
  var d=document.createElement('aside');d.id='gd';d.setAttribute('aria-label','Menu da Dora Guilda');
  var h='<a class="gdl" href="estudio.html"><i>🏰</i><span>'+G.nome+'<small>'+G.sub+'</small></span></a>';
  G.groups.forEach(function(g){h+='<div class="gdg">'+esc(g[0])+'</div>';g[1].forEach(function(t){var cur=(t[0]===page);h+='<a class="gdi" data-sec="'+g[2]+'" href="'+G.href(t)+'"'+(cur?' aria-current="page"':'')+'><span class="ic" aria-hidden="true">'+t[1]+'</span><span class="tx"><b>'+esc(t[2])+'</b><small>'+esc(t[3])+'</small></span></a>';});});
  d.innerHTML=h;document.body.appendChild(sc);document.body.appendChild(d);document.body.appendChild(b);
  function open(on){d.classList.toggle('on',on);sc.hidden=!on;b.setAttribute('aria-expanded',String(on));if(on){var a=d.querySelector('a.gdi');if(a)a.focus();}else b.focus();}
  b.onclick=function(){open(!d.classList.contains('on'));};sc.onclick=function(){open(false);};
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&d.classList.contains('on')){e.stopPropagation();open(false);}},true);
}
if(document.body)ui();else document.addEventListener('DOMContentLoaded',ui);
})();
