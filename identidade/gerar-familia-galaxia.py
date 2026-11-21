#!/usr/bin/env python3
"""Família de ícones 'galáxia' das seções novas (Constelação, Gêmeo Digital, Dora Canvas, Consultas).
Mesma geometria do girassol: braços em espiral logarítmica e ângulo de ouro. Fundo escuro fixo (identidade),
luz nas cores do tema (var(--accent) e var(--destaque), com o laranja/dourado da marca como reserva).
Uso: python3 identidade/gerar-familia-galaxia.py  -> identidade/familia-galaxia.svg"""
import math, os
AC='var(--accent,#e07a2e)'; DE='var(--destaque,#f2b544)'; FUNDO='#1f1611'
def esp(cx,cy,a0,n,r0,k,passo):
    return [(cx+r0*math.exp(k*i*passo)*math.cos(a0+i*passo), cy+r0*math.exp(k*i*passo)*math.sin(a0+i*passo)) for i in range(n)]
def cam(pts): return 'M'+' L'.join('%.2f %.2f'%p for p in pts)
def suave(pts):
    d='M%.2f %.2f'%pts[0]
    for i in range(1,len(pts)):
        x0,y0=pts[i-1];x1,y1=pts[i];mx,my=(x0+x1)/2,(y0+y1)/2;d+=' Q%.2f %.2f %.2f %.2f'%(x0,y0,mx,my) if i>1 else ' L%.2f %.2f'%(mx,my)
    return d+' L%.2f %.2f'%pts[-1]
def tile(id_,titulo,corpo):
    # Sem gradientes por id: <linearGradient> dentro de sprite oculto não pinta no Chrome/Safari.
    return ('<symbol id="%s" viewBox="0 0 48 48"><title>%s</title>'
      '<rect x="1" y="1" width="46" height="46" rx="12" fill="%s"/>'
      '<path d="M1 13 A12 12 0 0 1 13 1 H35 A12 12 0 0 1 47 13 V22 H1 Z" fill="#fff" fill-opacity=".045"/>'
      '<rect x="1.5" y="1.5" width="45" height="45" rx="11.5" fill="none" stroke="#fff" stroke-opacity=".09"/>%s</symbol>')%(id_,titulo,FUNDO,corpo)
def brilho(cx,cy,R): return ''.join('<circle cx="%.2f" cy="%.2f" r="%.2f" fill="%s" fill-opacity="%.2f"/>'%(cx,cy,R*f,DE,o) for f,o in ((1,.08),(.7,.12),(.45,.18)))
def braco(cx,cy,a0,n,r0,k,passo,op,larg,contas=True,rc=(1.0,2.2)):
    pts=esp(cx,cy,a0,n,r0,k,passo); s='<path d="%s" fill="none" stroke="%s" stroke-opacity="%.2f" stroke-width="%.2f" stroke-linecap="round"/>'%(suave(pts),AC,op,larg)
    if contas:
        for i,(x,y) in enumerate(pts[1:],1):
            r=rc[0]+(rc[1]-rc[0])*i/(n-1); s+='<circle cx="%.2f" cy="%.2f" r="%.2f" fill="%s"/>'%(x,y,r,AC if i<n-1 else DE)
    return s
def nucleo(cx,cy,r=3.0): return brilho(cx,cy,r*3.2)+'<circle cx="%.2f" cy="%.2f" r="%.2f" fill="%s"/>'%(cx,cy,r,DE)
icones=[]
# 1) Constelação: galáxia de três braços
c=''.join(braco(24,24,a,5,3.6,0.36,0.95,.6,1.5) for a in (0,2.094,4.189)); icones.append(tile('gx-constelacao','Constelação da Guilda',c+nucleo(24,24,2.8)))
# 2) Gêmeo Digital: galáxia ao fundo + linha da evolução subindo com faixa
g=''.join(braco(22,26,a,4,3.2,0.36,0.95,.28,1.2,False) for a in (0,2.094,4.189))
linha=[(8,36),(14,33),(19,34),(24,28),(30,26),(35,19),(40,13)]
faixa='M8 39 L14 37 L19 38 L24 32 L30 30 L35 24 L40 18 L40 9 L35 15 L30 22 L24 24 L19 30 L14 29 L8 33 Z'
g+='<path d="%s" fill="%s" fill-opacity=".18"/><path d="%s" fill="none" stroke="%s" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>'%(faixa,DE,cam(linha),DE)
g+=brilho(40,13,5.5)+'<circle cx="40" cy="13" r="2.4" fill="#fff6e8"/>'
icones.append(tile('gx-gemeo','Gêmeo Digital',g))
# 3) Dora Canvas: braço em espiral ligando três cartões
pts=esp(25,22,3.6,6,2.2,0.40,1.0); cv='<path d="%s" fill="none" stroke="%s" stroke-opacity=".6" stroke-width="1.5" stroke-linecap="round"/>'%(suave(pts),AC)
for (x,y),w in zip([pts[2],pts[4],pts[5]],[8,9,10]):
    cv+='<rect x="%.2f" y="%.2f" width="%d" height="%.1f" rx="1.8" fill="%s" fill-opacity=".22" stroke="%s" stroke-width="1.3"/>'%(x-w/2,y-w*0.36,w,w*0.72,DE,DE)
cv+=nucleo(pts[0][0],pts[0][1],2.4); icones.append(tile('gx-canvas','Dora Canvas',cv))
# 4) Consultas: barras subindo ao longo de um arco de espiral, contas no topo
q=''.join(braco(24,22,a,4,3.0,0.36,0.95,.22,1.1,False) for a in (0,3.14))
for i,(x,h) in enumerate([(12,7),(19,12),(26,17),(33,23)]):
    q+='<rect x="%.1f" y="%.1f" width="4.6" height="%.1f" rx="1.6" fill="%s" fill-opacity="%.2f"/>'%(x-2.3,40-h,h,AC,.55+.12*i)
    q+='<circle cx="%.1f" cy="%.1f" r="%.1f" fill="%s"/>'%(x,40-h-3,1.4+0.3*i,DE if i==3 else AC)
q+='<path d="M12 29 Q22 24 33 14" fill="none" stroke="%s" stroke-opacity=".75" stroke-width="1.3" stroke-dasharray="1.6 2.2" stroke-linecap="round"/>'%DE
icones.append(tile('gx-consultas','Consultas',q))
svg='<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style="position:absolute"><!-- gerado por identidade/gerar-familia-galaxia.py; não editar à mão -->'+''.join(icones)+'</svg>\n'
open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'familia-galaxia.svg'),'w').write(svg)
print(len(icones),'ícones,',len(svg),'bytes')
