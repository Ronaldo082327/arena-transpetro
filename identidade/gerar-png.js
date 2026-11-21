/* Gera os ícones PNG do app (PWA e Dora Draw) a partir de identidade/marca.svg. Uso: servir a pasta do projeto em http://localhost:8765 e rodar `node identidade/gerar-png.js`. */
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const svg=fs.readFileSync(__dirname+'/marca.svg','utf8').replace(/ width="256" height="256"/,' width="100%" height="100%"');
const alvo=[['icon-192.png',192],['icon-512.png',512],['draw/icones/icone-16.png',16],['draw/icones/icone-32.png',32],['draw/icones/icone-48.png',48],['draw/icones/icone-128.png',128],['draw/icones/icone-192.png',192],['draw/icones/icone-512.png',512]];
for(const [f,n] of alvo){const p=await b.newPage({viewport:{width:n,height:n},deviceScaleFactor:1});
 const pad=n<64?0.04:0.15; // área segura para ícone "maskable"
 await p.setContent(`<body style="margin:0;width:${n}px;height:${n}px;background:radial-gradient(circle at 50% 35%,#12687D,#062B36);display:grid;place-items:center;border-radius:${n<64?Math.round(n*.2):0}px"><div style="width:${Math.round(n*(1-2*pad))}px;height:${Math.round(n*(1-2*pad))}px">${svg}</div></body>`);
 await p.screenshot({path:__dirname+'/../'+f,omitBackground:true});await p.close();console.log('ok',f);}
await b.close();})();
