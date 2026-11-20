/* Identidade Reta Final: temas compartilhados por todos os apps (estudio, expedicao, jogo, index). */
(function(){
var K='arenaTP.tema',R='arenaTP.relevo',TH=[["retafinal", "Reta Final", "#FF7A00", "#0A3D4A", false, "#EEF3F3"], ["petroleo", "Petróleo", "#FF7A00", "#062129", true, "#062129"], ["laranja", "Laranja", "#FF7A00", "#FFFFFF", false, "#F5F3F0"], ["cana", "Verde-cana", "#8BD33F", "#1F6B14", false, "#EFF6E9"], ["itau", "Azul e laranja", "#FF6A00", "#00479B", false, "#EDF2F8"], ["noite", "Noite", "#FF7A00", "#0D0D0E", true, "#0D0D0E"]];
var old={pessego:1,gelo:1,menta:1,lavanda:1,rosa:1,grafite:1,aurora:1};
function get(k,d){try{return localStorage.getItem(k)||d;}catch(e){return d;}}
function theme(){var t=get(K,'');if(!t||old[t]||!TH.some(function(x){return x[0]===t;})){t=(window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches)?'petroleo':'retafinal';}return t;}
function apply(){if(/[?&]embed=1/.test(location.search))document.documentElement.classList.add('embed');var t=theme(),d=get(R,'1'),r=document.documentElement;r.setAttribute('data-theme',t);r.setAttribute('data-depth',d);var x=TH.filter(function(y){return y[0]===t;})[0]||TH[0],m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute('content',x[5]);}
apply();
window.addEventListener('storage',function(e){if(e.key===K||e.key===R)apply();});
window.arenaTema={apply:apply,themes:TH};
function ui(){if(document.getElementById('thbtn'))return;var sc=document.currentScript,b=document.createElement('button');b.id='thbtn';b.type='button';b.setAttribute('aria-label','Escolher tema e relevo');b.setAttribute('aria-expanded','false');b.innerHTML='🎨 <span class="tl">Tema</span>';var slot=document.getElementById('thslot');if(slot){slot.appendChild(b);b.classList.add('th-inline');document.documentElement.classList.add('th-slotted');}else document.body.appendChild(b);
 var bt=document.documentElement.getAttribute('data-th-bottom');if(bt)document.documentElement.style.setProperty('--th-bottom',bt+'px');
 var p=document.createElement('div');p.id='thp';p.setAttribute('role','dialog');p.setAttribute('aria-label','Temas');document.body.appendChild(p);
 function panel(){var t=theme(),d=get(R,'1');p.innerHTML='<h4>🎨 Tema</h4><div class="thgrid">'+TH.map(function(x){return '<button type="button" class="thsw" data-th="'+x[0]+'" aria-pressed="'+(t===x[0])+'"><i style="--s1:'+x[2]+';--s2:'+x[3]+'"></i>'+x[1]+'</button>';}).join('')+'</div><h4 style="margin-top:12px">Relevo (3D)</h4><div class="threl">'+[['0','Plano'],['1','Suave'],['2','Forte']].map(function(x){return '<button type="button" data-rl="'+x[0]+'" aria-pressed="'+(d===x[0])+'">'+x[1]+'</button>';}).join('')+'</div>';
  [].forEach.call(p.querySelectorAll('[data-th]'),function(e){e.onclick=function(){try{localStorage.setItem(K,e.dataset.th);}catch(x){}apply();panel();};});
  [].forEach.call(p.querySelectorAll('[data-rl]'),function(e){e.onclick=function(){try{localStorage.setItem(R,e.dataset.rl);}catch(x){}apply();panel();};});}
 b.onclick=function(ev){ev.stopPropagation();var on=!p.classList.contains('on');if(on)panel();p.classList.toggle('on',on);b.setAttribute('aria-expanded',on);};
 document.addEventListener('click',function(ev){if(p.classList.contains('on')&&ev.composedPath().indexOf(p)<0&&ev.composedPath().indexOf(b)<0){p.classList.remove('on');b.setAttribute('aria-expanded','false');}});}
if(document.body)ui();else document.addEventListener('DOMContentLoaded',ui);
})();
