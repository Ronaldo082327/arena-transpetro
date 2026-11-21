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
G.ICONS={
 plano:'<circle cx="22" cy="26" r="15"/><circle cx="22" cy="26" r="8"/><path d="M22 26L38 10"/><circle class="nd" cx="22" cy="26" r="3.2"/><circle class="nd" cx="39" cy="9" r="3.2"/>',
 mira:'<circle cx="24" cy="24" r="15"/><path d="M24 4v10M24 34v10M4 24h10M34 24h10"/><circle class="nd" cx="24" cy="24" r="3.6"/>',
 sim:'<path d="M24 5l16 9v20l-16 9-16-9V14z"/><path d="M8 14l16 9 16-9M24 23v20"/><circle class="nd" cx="24" cy="23" r="3.2"/><circle class="nd" cx="16" cy="29" r="2.4"/><circle class="nd" cx="32" cy="29" r="2.4"/>',
 mt:'<path d="M4 24c6-10 13-15 20-15s14 5 20 15c-6 10-13 15-20 15S10 34 4 24z"/><circle cx="24" cy="24" r="8"/><circle class="nd" cx="24" cy="24" r="3.4"/>',
 met:'<path d="M8 10c6-2 11-1 16 3 5-4 10-5 16-3v26c-6-2-11-1-16 3-5-4-10-5-16-3z"/><path d="M24 13v26"/><path d="M16 21l8 8 8-8"/><circle class="nd" cx="16" cy="21" r="2.6"/><circle class="nd" cx="32" cy="21" r="2.6"/><circle class="nd" cx="24" cy="29" r="2.6"/>',
 ref:'<path d="M27 4L10 27h12l-3 17 19-25H26z"/><circle class="nd" cx="39" cy="9" r="3"/>',
 mm:'<circle cx="24" cy="24" r="6"/><path d="M29 20l10-9M29 28l10 9M19 20L9 11M19 28L9 37"/><circle class="nd" cx="40" cy="10" r="3.2"/><circle class="nd" cx="40" cy="38" r="3.2"/><circle class="nd" cx="8" cy="10" r="3.2"/><circle class="nd" cx="8" cy="38" r="3.2"/>',
 esq:'<rect x="9" y="6" width="30" height="36" rx="5"/><path d="M17 16h14M17 16l6 9M31 16l-8 9M23 25v9"/><circle class="nd" cx="17" cy="16" r="2.6"/><circle class="nd" cx="31" cy="16" r="2.6"/><circle class="nd" cx="23" cy="25" r="2.6"/><circle class="nd" cx="23" cy="34" r="2.6"/>',
 cq:'<rect x="10" y="12" width="26" height="30" rx="5"/><path d="M14 8h22a4 4 0 014 4v24"/><path d="M23 27l7-6M23 27l-6 7"/><circle class="nd" cx="23" cy="27" r="3.4"/>',
 fc:'<rect x="7" y="14" width="30" height="26" rx="5"/><path d="M12 9h24a5 5 0 015 5v22"/><path d="M15 27h16M23 21v12"/><circle class="nd" cx="23" cy="27" r="2.8"/>',
 anki:'<rect x="9" y="19" width="30" height="21" rx="4"/><path d="M13 14h22M17 9h14"/><circle class="nd" cx="24" cy="29" r="3.2"/>',
 v:'<rect x="5" y="9" width="38" height="26" rx="6"/><path d="M20 16l11 6-11 6z"/><path d="M16 42h16"/><circle class="nd" cx="40" cy="9" r="2.8"/>',
 pod:'<path d="M8 28v-4a16 16 0 0132 0v4"/><rect x="6" y="28" width="9" height="13" rx="3"/><rect x="33" y="28" width="9" height="13" rx="3"/><circle class="nd" cx="24" cy="12" r="3"/>',
 lab:'<path d="M18 5h12M20 5v13L9 38a4 4 0 003.5 6h23a4 4 0 003.5-6L28 18V5"/><path d="M14 31h20"/><circle class="nd" cx="21" cy="37" r="2.4"/><circle class="nd" cx="29" cy="39" r="2"/>',
 radar:'<circle cx="24" cy="24" r="18"/><circle cx="24" cy="24" r="10"/><path d="M24 24l13-13"/><circle class="nd" cx="24" cy="24" r="3"/><circle class="nd" cx="32" cy="31" r="2.6"/>',
 geo:'<path d="M24 44S10 30 10 20a14 14 0 0128 0c0 10-14 24-14 24z"/><circle class="nd" cx="24" cy="20" r="4.6"/>',
 gem:'<path d="M22 6l4 12 12 4-12 4-4 12-4-12-12-4 12-4z"/><path d="M26 22l12-12M26 26l12 12"/><circle class="nd" cx="38" cy="10" r="3"/><circle class="nd" cx="38" cy="38" r="3"/>',
 expedicao:'<path d="M24 5v28M24 5l16 24H24"/><path d="M6 37c5 5 9 5 14 0 5 5 9 5 14 0 3 3 5 3 8 1"/><circle class="nd" cx="24" cy="5" r="3"/>',
 jogo:'<path d="M24 5l16 6v12c0 10-7 17-16 20-9-3-16-10-16-20V11z"/><path d="M26 14l-8 11h7l-3 10 9-12h-7z"/>',
 index:'<rect x="7" y="8" width="8" height="32" rx="2"/><rect x="19" y="8" width="8" height="32" rx="2"/><path d="M32 12l8-2 5 28-8 2z"/><circle class="nd" cx="11" cy="16" r="2.2"/><circle class="nd" cx="23" cy="16" r="2.2"/>',
 draw:'<path d="M8 40l3-11L33 7a4 4 0 016 6L17 35z"/><path d="M29 11l6 6"/><circle class="nd" cx="10" cy="40" r="2.8"/>',
 central:'<path d="M9 42V14h7v5h4v-5h8v5h4v-5h7v28z"/><path d="M20 42V33a4 4 0 018 0v9"/><circle class="nd" cx="24" cy="25" r="2.6"/>',
 marca:'<path d="M24 4l19 8v15c0 11-8 19-19 22C13 46 5 38 5 27V12z"/><path d="M16 15v18M16 15h8l8 9-8 9h-8"/><circle class="nd" cx="16" cy="15" r="2.8"/><circle class="nd" cx="16" cy="33" r="2.8"/><circle class="nd" cx="32" cy="24" r="2.8"/>',
 identidade:'<circle cx="24" cy="24" r="17"/><circle class="nd" cx="24" cy="14" r="3.2"/><circle class="nd" cx="15" cy="28" r="3.2"/><circle class="nd" cx="33" cy="28" r="3.2"/><path d="M24 14L15 28h18z"/>'
};
G.CHAVES={'draw/index.html':'draw','expedicao.html':'expedicao','jogo.html':'jogo','index.html':'index','identidade/index.html':'identidade'};
G.svg=function(k,size){var n=G.CHAVES[k]||(/artifact\/Ukc2/.test(k)?'draw':(/artifact\/RM3d/.test(k)?'central':k)),d=G.ICONS[n];if(!d)return null;size=size||26;return '<svg class="gi" viewBox="0 0 48 48" width="'+size+'" height="'+size+'" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">'+d+'</svg>';};
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
