/* Dora Guilda · temas (17 do pacote 3D da Central e do Dora Draw), Aparência e seletor. Compartilhado por todas as páginas. */
(function(){
var K='arenaTP.tema',M='arenaTP.movimento',X='arenaTP.texto',TH=[["auto", "Automático", "Segue o sistema", "#faf6f1", "#e8853a"], ["claro", "Claro", "Laranja de sempre", "#faf6f1", "#e8853a"], ["escuro", "Escuro", "Marrom suave", "#2a2420", "#e8964f"], ["grafite", "Grafite", "Cinza-azulado", "#23272e", "#75a6ea"], ["meia-noite", "Meia-noite", "Marinho e âmbar", "#162034", "#f5b14a"], ["oceano", "Oceano", "Turquesa claro", "#f1f8f9", "#2bb3c0"], ["floresta", "Floresta", "Verde-sálvia", "#f3f6f0", "#7fae5e"], ["lavanda", "Lavanda", "Lilás suave", "#f6f3fa", "#a882e2"], ["areia", "Areia", "Papel sépia", "#f4ecd8", "#cc8d42"], ["neon", "Neon", "Ciano e magenta", "#1a1b2c", "#ff62c9"], ["alto-contraste", "Alto contraste", "Máxima leitura", "#fffef9", "#ffb36b"], ["retafinal", "Reta Final", "Dora Guilda: petróleo", "#eef3f3", "#ff7a00"], ["petroleo", "Petróleo", "Dora Guilda: escuro", "#062129", "#ff7a00"], ["laranja", "Laranja", "Dora Guilda: neutro", "#f5f3f0", "#ff7a00"], ["cana", "Verde-cana", "Dora Guilda: verde", "#eff6e9", "#8bd33f"], ["itau", "Azul e laranja", "Dora Guilda: azul", "#edf2f8", "#ff6a00"], ["noite", "Noite", "Dora Guilda: preto 3D", "#0d0d0e", "#ff7a00"]];
function get(k,d){try{return localStorage.getItem(k)||d;}catch(e){return d;}}
function set(k,v){try{if(v==null)localStorage.removeItem(k);else localStorage.setItem(k,v);}catch(e){}}
function theme(){var t=get(K,'auto');return TH.some(function(x){return x[0]===t;})?t:'auto';}
function apply(){var r=document.documentElement,t=theme();if(/[?&]embed=1/.test(location.search))r.classList.add('embed');
  r.setAttribute('data-theme',t);if(get(M,'')==='1')r.setAttribute('data-movimento','reduzido');else r.removeAttribute('data-movimento');
  if(get(X,'')==='grande')r.setAttribute('data-texto','grande');else r.removeAttribute('data-texto');
  try{var bg=getComputedStyle(r).getPropertyValue('--bg').trim(),m=document.querySelector('meta[name="theme-color"]');if(m&&bg)m.setAttribute('content',bg);}catch(e){}}
apply();
window.addEventListener('storage',function(e){if(e.key===K||e.key===M||e.key===X)apply();});
window.arenaTema={apply:apply,themes:TH};
function ui(){if(document.getElementById('thbtn'))return;var b=document.createElement('button');b.id='thbtn';b.type='button';b.setAttribute('aria-label','Aparência: escolher tema');b.setAttribute('aria-expanded','false');b.innerHTML='🎨 <span class="tl">Tema</span>';
 var slot=document.getElementById('thslot');if(slot){slot.appendChild(b);b.classList.add('th-inline');document.documentElement.classList.add('th-slotted');}else document.body.appendChild(b);
 var bt=document.documentElement.getAttribute('data-th-bottom');if(bt)document.documentElement.style.setProperty('--th-bottom',bt+'px');
 var p=document.createElement('div');p.id='thp';p.setAttribute('role','dialog');p.setAttribute('aria-label','Aparência');document.body.appendChild(p);apply();
 function panel(){var t=theme();p.innerHTML='<h4>🎨 Aparência</h4><div class="thgrid" role="radiogroup" aria-label="Tema">'+TH.map(function(x){return '<button type="button" class="thsw" role="radio" data-th="'+x[0]+'" aria-checked="'+(t===x[0])+'" aria-pressed="'+(t===x[0])+'"><span class="pv"><i style="background:'+x[3]+'"></i><i style="background:'+x[4]+'"></i></span>'+x[1]+(x[0]==='auto'?' (padrão)':'')+'<small>'+x[2]+'</small></button>';}).join('')+'</div>'+
  '<label class="thopt"><input type="checkbox" id="thm" '+(get(M,'')==='1'?'checked':'')+'> Movimento reduzido</label><label class="thopt"><input type="checkbox" id="thx" '+(get(X,'')==='grande'?'checked':'')+'> Texto grande</label><button type="button" class="thrst" id="thr">Voltar ao padrão</button><p class="tn">A escolha vale neste aparelho e neste navegador, em todas as páginas da Dora Guilda.</p>';
  [].forEach.call(p.querySelectorAll('[data-th]'),function(e){e.onclick=function(){set(K,e.dataset.th);apply();panel();var n=p.querySelector('[data-th="'+e.dataset.th+'"]');if(n)n.focus();};});
  p.querySelector('#thm').onchange=function(){set(M,this.checked?'1':null);apply();};p.querySelector('#thx').onchange=function(){set(X,this.checked?'grande':null);apply();};
  p.querySelector('#thr').onclick=function(){set(K,null);set(M,null);set(X,null);apply();panel();};}
 b.onclick=function(ev){ev.stopPropagation();var on=!p.classList.contains('on');if(on)panel();p.classList.toggle('on',on);b.setAttribute('aria-expanded',on);};
 document.addEventListener('click',function(ev){if(p.classList.contains('on')&&ev.composedPath().indexOf(p)<0&&ev.composedPath().indexOf(b)<0){p.classList.remove('on');b.setAttribute('aria-expanded','false');}});}
if(document.body)ui();else document.addEventListener('DOMContentLoaded',ui);
})();
