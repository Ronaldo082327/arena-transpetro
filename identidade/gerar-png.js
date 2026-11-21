/* Gera os ícones PNG do app (PWA) a partir de identidade/marca.svg (girassol com braços de Fibonacci, 377 pontos). Uso: node identidade/gerar-png.js (na raiz do projeto). */
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const svg=fs.readFileSync(__dirname+'/marca.svg','utf8').replace(/ width="256" height="256"/,' width="100%" height="100%"');
const alvo=[['icon-192.png',192,.86,true],['icon-512.png',512,.86,true],['icon-maskable-512.png',512,.66,false],['identidade/final/icone-escuro-512.png',512,.86,'escuro']];
for(const [f,n,pad,tipo] of alvo){const p=await b.newPage({viewport:{width:n,height:n},deviceScaleFactor:1});
 const dark=tipo==='escuro';const bg=dark?'linear-gradient(180deg,#3a2e26,#211a16)':'linear-gradient(180deg,#ffffff,#fde3cc)';
 const root=dark?':root{--accent:#f4a463;--destaque:#ff9a4d;--destaque-2:#ffb878}':'';
 await p.setContent(`<style>${root}</style><body style="margin:0;width:${n}px;height:${n}px;background:${bg};display:grid;place-items:center;border-radius:${tipo===true?Math.round(n*.22):0}px"><div style="width:${Math.round(n*pad)}px;height:${Math.round(n*pad)}px">${svg}</div></body>`);
 await p.screenshot({path:__dirname+'/../'+f,omitBackground:true});await p.close();console.log('ok',f);}
await b.close();})();
