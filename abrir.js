/* Visualizador interno: links externos abrem dentro do app, com a barra e o tema do app.
   Sites que proíbem ser exibidos em outros apps (NotebookLM, AI Studio, Gemini, Claude, TecConcursos...) mostram uma tela-ponte no tema do app. */
(function(){
var BLOQ=/(^|\.)(notebooklm\.google\.com|notebook\.google\.com|aistudio\.google\.com|gemini\.google\.com|claude\.ai|claude\.com|anthropic\.com|tecconcursos\.com\.br|labs\.google|antigravity\.google|accounts\.google\.com|colab\.research\.google\.com|github\.com|linkedin\.com|x\.com|twitter\.com|facebook\.com|instagram\.com|ankiweb\.net|canva\.com|figma\.com|miro\.com)$/i;
var NOMES={'notebooklm.google.com':'NotebookLM','notebook.google.com':'NotebookLM','aistudio.google.com':'Google AI Studio','gemini.google.com':'Gemini','claude.ai':'Claude','tecconcursos.com.br':'TecConcursos','colab.research.google.com':'Google Colab','github.com':'GitHub'};
var root=null,last=null,cur=null,opener=null;
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function host(u){return u.hostname.replace(/^www\./,'');}
function nome(u){var h=host(u);for(var k in NOMES)if(h===k||h.endsWith('.'+k))return NOMES[k];return h;}
function classify(u){var h=host(u),p=u.pathname,m,id;
  if(h==='youtu.be'||/(^|\.)youtube\.com$/.test(h)){id=h==='youtu.be'?p.slice(1):(u.searchParams.get('v')||((m=p.match(/\/(?:embed|shorts|live)\/([\w-]{6,})/))&&m[1]));var list=u.searchParams.get('list');var t=u.searchParams.get('t')||u.searchParams.get('start');
    if(id){var q=['rel=0'];if(t)q.push('start='+parseInt(t,10));if(list)q.push('list='+encodeURIComponent(list));return {t:'frame',src:'https://www.youtube-nocookie.com/embed/'+id+'?'+q.join('&'),ti:'Vídeo do YouTube',ar:'16/9'};}
    if(list&&/playlist/.test(p))return {t:'frame',src:'https://www.youtube-nocookie.com/embed/videoseries?list='+encodeURIComponent(list),ti:'Playlist do YouTube',ar:'16/9'};}
  if(h==='drive.google.com'){if((m=p.match(/\/file\/d\/([\w-]+)/)))return {t:'frame',src:'https://drive.google.com/file/d/'+m[1]+'/preview',ti:'Arquivo do Google Drive'};
    if((m=p.match(/\/folders\/([\w-]+)/)))return {t:'frame',src:'https://drive.google.com/embeddedfolderview?id='+m[1]+'#list',ti:'Pasta do Google Drive'};
    if(p==='/open'&&u.searchParams.get('id'))return {t:'frame',src:'https://drive.google.com/file/d/'+u.searchParams.get('id')+'/preview',ti:'Arquivo do Google Drive'};}
  if(h==='docs.google.com'){if((m=p.match(/^\/(document|spreadsheets)\/d\/([\w-]+)/)))return {t:'frame',src:'https://docs.google.com/'+m[1]+'/d/'+m[2]+'/preview',ti:m[1]==='document'?'Google Docs':'Google Planilhas'};
    if((m=p.match(/^\/presentation\/d\/([\w-]+)/)))return {t:'frame',src:'https://docs.google.com/presentation/d/'+m[1]+'/embed?start=false&loop=false',ti:'Google Apresentações'};
    if((m=p.match(/^\/forms\/d\/e\/([\w-]+)/)))return {t:'frame',src:'https://docs.google.com/forms/d/e/'+m[1]+'/viewform?embedded=true',ti:'Google Formulários'};}
  if(h==='raw.githubusercontent.com'&&/\.md$/i.test(p))return {t:'md',src:u.href,ti:decodeURIComponent(p.split('/').pop())};
  if(BLOQ.test(h))return {t:'ponte',ti:nome(u)};
  return {t:'frame',src:u.href,ti:nome(u)};}
function inl(s){return esc(s).replace(/`([^`]+)`/g,'<code>$1</code>').replace(/\*\*([^*]+)\*\*/g,'<b>$1</b>').replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g,'<a href="$2">$1</a>');}
function md(src){var L=String(src).replace(/\r/g,'').split('\n'),o=[],i=0,lst=null;function close(){if(lst){o.push('</'+lst+'>');lst=null;}}
  while(i<L.length){var l=L[i];
    if(/^```/.test(l)){close();var b=[];i++;while(i<L.length&&!/^```/.test(L[i]))b.push(L[i++]);i++;o.push('<pre>'+esc(b.join('\n'))+'</pre>');continue;}
    if(/^\|.*\|\s*$/.test(l)&&/^\|[\s:|-]+\|\s*$/.test(L[i+1]||'')){close();var h=l.split('|').slice(1,-1);i+=2;var rows=[];while(i<L.length&&/^\|.*\|\s*$/.test(L[i]))rows.push(L[i++].split('|').slice(1,-1));
      o.push('<div class="vtab"><table><tr>'+h.map(function(c){return '<th>'+inl(c.trim())+'</th>';}).join('')+'</tr>'+rows.map(function(r){return '<tr>'+r.map(function(c){return '<td>'+inl(c.trim())+'</td>';}).join('')+'</tr>';}).join('')+'</table></div>');continue;}
    var m;if((m=l.match(/^(#{1,4})\s+(.*)/))){close();o.push('<h'+(m[1].length+1)+'>'+inl(m[2])+'</h'+(m[1].length+1)+'>');i++;continue;}
    if((m=l.match(/^\s*([-*]|\d+\.)\s+(.*)/))){var t=/\d/.test(m[1])?'ol':'ul';if(lst!==t){close();o.push('<'+t+'>');lst=t;}o.push('<li>'+inl(m[2])+'</li>');i++;continue;}
    if(/^>\s?/.test(l)){close();o.push('<blockquote>'+inl(l.replace(/^>\s?/,''))+'</blockquote>');i++;continue;}
    if(!l.trim()){close();i++;continue;}close();o.push('<p>'+inl(l)+'</p>');i++;}
  close();return o.join('');}
function build(){if(root)return;root=document.createElement('div');root.id='vw';root.setAttribute('role','dialog');root.setAttribute('aria-modal','true');root.setAttribute('aria-label','Visualizador');
  root.innerHTML='<div class="vb"><button type="button" class="vbtn vback" id="vwx" aria-label="Voltar ao app">← Voltar</button><div class="vt"><span id="vwt"></span><small id="vwh"></small></div><button type="button" class="vbtn" id="vwr" aria-label="Recarregar" title="Recarregar">↻</button><a class="vbtn" id="vwo" target="_blank" rel="noopener noreferrer" data-fora="1">Abrir fora ↗</a></div><div class="vbody" id="vwb"></div>';
  document.body.appendChild(root);
  root.querySelector('#vwx').onclick=close;
  root.querySelector('#vwr').onclick=function(){var f=root.querySelector('iframe');if(f)f.src=f.src;};
  root.addEventListener('keydown',function(e){if(e.key==='Tab'){var f=[].slice.call(root.querySelectorAll('button,a[href],iframe')).filter(function(x){return x.offsetParent;});if(!f.length)return;var a=f[0],z=f[f.length-1];if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus();}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus();}}});}
function abrir(url,titulo){var u;try{u=new URL(url,location.href);}catch(e){return false;}if(!/^https?:$/.test(u.protocol))return false;build();cur=u.href;opener=document.activeElement;
  var c=classify(u),ti=titulo||c.ti||nome(u),b=root.querySelector('#vwb');
  root.querySelector('#vwt').textContent=ti;root.querySelector('#vwh').textContent=host(u);root.querySelector('#vwo').href=u.href;root.querySelector('#vwr').style.display=c.t==='frame'?'':'none';
  if(c.t==='frame'){b.innerHTML='<div class="vload" id="vwl">Carregando '+esc(ti)+'…</div><iframe id="vwf" title="'+esc(ti)+'" src="'+esc(c.src)+'" allow="autoplay; fullscreen; encrypted-media; picture-in-picture; clipboard-write" allowfullscreen referrerpolicy="strict-origin-when-cross-origin" sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation allow-downloads"></iframe><p class="vnote">Se esta área ficar em branco ou pedir login, o site não permite ser mostrado aqui: use <b>Abrir fora ↗</b>.</p>';
    var f=b.querySelector('#vwf');f.onload=function(){var l=b.querySelector('#vwl');if(l)l.remove();};}
  else if(c.t==='md'){b.innerHTML='<div class="vload">Carregando…</div>';fetch(c.src).then(function(r){if(!r.ok)throw new Error('HTTP '+r.status);return r.text();}).then(function(t){if(cur!==u.href)return;b.innerHTML='<article class="vmd">'+md(t)+'</article>';}).catch(function(){b.innerHTML='<div class="vbridge"><p>Não consegui carregar este texto.</p><a class="vbtn vprim" href="'+esc(u.href)+'" target="_blank" rel="noopener noreferrer" data-fora="1">Abrir fora ↗</a></div>';});}
  else{b.innerHTML='<div class="vbridge"><div class="vlock" aria-hidden="true">🔒</div><h2>'+esc(ti)+' não abre dentro de outro app</h2><p>É uma trava de segurança do próprio site: ele recusa ser mostrado dentro de outra página. Não é falha do Reta Final.</p><div class="vacts"><button type="button" class="vbtn vprim" id="vwp">Abrir em janela ao lado</button><a class="vbtn" href="'+esc(u.href)+'" target="_blank" rel="noopener noreferrer" data-fora="1">Abrir em nova aba ↗</a><button type="button" class="vbtn" id="vwc">Copiar link</button></div>'+(/NotebookLM/.test(ti)?'<p class="vtip">💡 Gere o áudio no NotebookLM, salve o MP3 na pasta <code>audio/</code> do projeto e ele toca aqui dentro, na página <b>🎧 Áudios</b> do Estúdio.</p>':'')+'</div>';
    b.querySelector('#vwp').onclick=function(){var w=Math.min(520,screen.availWidth),h=Math.min(860,screen.availHeight);window.open(u.href,'arenaExterno','popup=yes,noopener,width='+w+',height='+h+',left='+Math.max(0,screen.availWidth-w)+',top=0');};
    b.querySelector('#vwc').onclick=function(){try{navigator.clipboard.writeText(u.href);this.textContent='Link copiado ✓';}catch(e){this.textContent='Copie na barra';}};}
  root.classList.add('on');document.documentElement.classList.add('vw-open');
  try{history.pushState({arenaViewer:1},'',location.href);}catch(e){}
  setTimeout(function(){var x=root.querySelector('#vwx');if(x)x.focus();},30);return true;}
function fechar(){if(!root||!root.classList.contains('on'))return;root.classList.remove('on');document.documentElement.classList.remove('vw-open');root.querySelector('#vwb').innerHTML='';cur=null;if(opener&&opener.focus)try{opener.focus();}catch(e){}}
function close(){if(history.state&&history.state.arenaViewer)history.back();else fechar();}
window.addEventListener('popstate',function(){fechar();});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&root&&root.classList.contains('on')){e.stopPropagation();close();}},true);
document.addEventListener('click',function(e){if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;var a=e.target.closest&&e.target.closest('a[href]');if(!a||a.hasAttribute('data-fora')||a.hasAttribute('download'))return;
  var u;try{u=new URL(a.getAttribute('href'),location.href);}catch(x){return;}if(!/^https?:$/.test(u.protocol)||u.origin===location.origin)return;
  if(abrir(u.href,a.getAttribute('data-titulo')||''))e.preventDefault();},true);
window.arenaAbrir=abrir;
})();
