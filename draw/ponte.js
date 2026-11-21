/* Ponte de tema entre o Dora Draw e o resto da Dora Guilda: a escolha vale nos dois (chave arenaTP.tema). */
(function(){try{var D='doraDraw.tema',A='arenaTP.tema',ls=window.localStorage,set=Storage.prototype.setItem;
  var a=ls.getItem(A);if(a&&ls.getItem(D)!==a){set.call(ls,D,a);document.documentElement.setAttribute('data-theme',a);}
  Storage.prototype.setItem=function(k,v){set.apply(this,arguments);if(this===ls&&k===D)set.call(ls,A,v);};
  var m=ls.getItem('arenaTP.movimento');if(m==='1')document.documentElement.setAttribute('data-movimento','reduzido');
}catch(e){}})();
/* Atalho de volta para a Dora Guilda (menu com todos os módulos). */
document.addEventListener('DOMContentLoaded',function(){try{var a=document.createElement('a');a.href='../estudio.html#mais';a.innerHTML='<img src="../identidade/marca.svg" width="18" height="18" alt="" style="vertical-align:-4px"> Dora Guilda';a.setAttribute('aria-label','Voltar ao menu da Dora Guilda');
a.style.cssText='position:fixed;top:10px;right:12px;z-index:60;padding:8px 14px;border-radius:999px;font:700 13px system-ui,sans-serif;text-decoration:none;color:var(--ink,#222);background:var(--grad-btn,var(--paper,#fff));border:1px solid var(--line,#ccc);box-shadow:var(--sombra-btn,0 2px 6px rgba(0,0,0,.2))';document.body.appendChild(a);}catch(e){}});
