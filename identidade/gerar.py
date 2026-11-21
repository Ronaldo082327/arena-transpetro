#!/usr/bin/env python3
"""Gera a identidade visual da Dora Guilda: marca, logo, capa e avatares (SVG). Os ícones dos módulos ficam em guilda.js.
Conceito: CONSTELAÇÃO. Nós ligados por linhas (grafo de conhecimento, IA, conexões entre tópicos) dentro de um escudo de guilda.
Cores: as do Dora Draw/tema claro (laranja #e8853a, âmbar #f4a463, marrom #a64d14, creme #faf6f1, tinta #3a2e26). Estilo 3D: gradiente, brilho no topo e sombra."""
import math, os, random
OUT=os.path.dirname(os.path.abspath(__file__))
PET='#3a2e26'; PET2='#a64d14'; PET3='#fde3cc'; LAR='#e8853a'; CANA='#a64d14'; GELO='#ffffff'; AMB='#f4a463'; BORDA='#d27330'
def w(n,s): open(os.path.join(OUT,n),'w',encoding='utf-8').write(s)

def simbolo(uid='m'):
    """Escudo com um D feito de nós e uma faísca de IA."""
    P1,P2,P3,P4,P5,P6,S=(21,19),(21,45),(35,19),(46,32),(35,45),(31,32),(49,15)
    edges=[(P1,P2),(P1,P3),(P3,P4),(P4,P5),(P5,P2),(P6,P1),(P6,P2),(P6,P4)]
    e=''.join(f'<path d="M{a[0]} {a[1]}L{b[0]} {b[1]}"/>' for a,b in edges[:5])
    ei=''.join(f'<path d="M{a[0]} {a[1]}L{b[0]} {b[1]}"/>' for a,b in edges[5:])
    return f'''<defs><linearGradient id="{uid}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{AMB}"/><stop offset="1" stop-color="{LAR}"/></linearGradient>
<linearGradient id="{uid}h" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".75"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/></linearGradient>
<filter id="{uid}s" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="2" stdDeviation="1.6" flood-color="#5c381a" flood-opacity=".35"/></filter></defs>
<g filter="url(#{uid}s)"><path d="M32 3L57 13v20c0 14-10 25-25 29C17 58 7 47 7 33V13z" fill="url(#{uid}g)" stroke="{BORDA}" stroke-width="1.6" stroke-linejoin="round"/></g>
<path d="M32 5L55 14v19c0 12-9 22-23 27" fill="none" stroke="url(#{uid}h)" stroke-width="2" stroke-linejoin="round"/>
<path d="M32 3L57 13v20c0 14-10 25-25 29C17 58 7 47 7 33V13z" fill="url(#{uid}h)" opacity=".5"/>
<g stroke="{GELO}" stroke-width="2.2" stroke-linecap="round" fill="none">{e}</g>
<g stroke="{GELO}" stroke-width="1.2" stroke-linecap="round" opacity=".55" fill="none">{ei}</g>
<path d="M{P3[0]} {P3[1]}L{S[0]} {S[1]}" stroke="{PET2}" stroke-width="1.8" stroke-linecap="round" fill="none"/>
<circle cx="{P6[0]}" cy="{P6[1]}" r="2.1" fill="#fff"/><circle cx="{P3[0]}" cy="{P3[1]}" r="2.6" fill="#fff" stroke="{PET2}" stroke-width="1"/><circle cx="{P5[0]}" cy="{P5[1]}" r="2.6" fill="#fff" stroke="{PET2}" stroke-width="1"/>
<circle cx="{P1[0]}" cy="{P1[1]}" r="3.5" fill="#fff" stroke="{PET2}" stroke-width="1.4"/><circle cx="{P2[0]}" cy="{P2[1]}" r="3.5" fill="#fff" stroke="{PET2}" stroke-width="1.4"/><circle cx="{P4[0]}" cy="{P4[1]}" r="3.5" fill="#fff" stroke="{PET2}" stroke-width="1.4"/>
<circle cx="{S[0]}" cy="{S[1]}" r="3" fill="{PET2}"/><circle cx="{S[0]}" cy="{S[1]}" r="5.4" fill="none" stroke="{PET2}" stroke-width=".8" opacity=".6"/>'''

w('marca.svg',f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="256" height="256" role="img" aria-label="Dora Guilda">{simbolo("a")}</svg>')
w('logo.svg',f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 120" width="520" height="120" role="img" aria-label="Dora Guilda, Engenharia Cognitiva para Concursos Públicos">
<g transform="translate(8 8) scale(1.6)">{simbolo("l")}</g>
<text x="126" y="64" font-family="'Barlow Condensed','Arial Narrow',Arial,sans-serif" font-weight="700" font-size="56" fill="{PET}">Dora Guilda</text>
<text x="128" y="92" font-family="'IBM Plex Sans',Arial,sans-serif" font-size="14.5" letter-spacing=".5" fill="#7a6a5e">Engenharia Cognitiva para Concursos Públicos</text></svg>''')
w('logo-claro.svg',f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 120" width="520" height="120" role="img" aria-label="Dora Guilda">
<g transform="translate(8 8) scale(1.6)">{simbolo("c")}</g>
<text x="126" y="64" font-family="'Barlow Condensed','Arial Narrow',Arial,sans-serif" font-weight="700" font-size="56" fill="#fff">Dora Guilda</text>
<text x="128" y="92" font-family="'IBM Plex Sans',Arial,sans-serif" font-size="14.5" letter-spacing=".5" fill="#fde3cc">Engenharia Cognitiva para Concursos Públicos</text></svg>''')

def rede(n,W,H,seed,margem=0,raio=(2,5),liga=118):
    random.seed(seed);pts=[(random.uniform(margem,W-margem),random.uniform(margem,H-margem),random.uniform(*raio)) for _ in range(n)]
    ls=[];ns=[]
    for i,(x,y,r) in enumerate(pts):
        for j in range(i+1,len(pts)):
            d=math.hypot(x-pts[j][0],y-pts[j][1])
            if d<liga:ls.append(f'<path d="M{x:.0f} {y:.0f}L{pts[j][0]:.0f} {pts[j][1]:.0f}" opacity="{max(.08,.55-d/liga*.45):.2f}"/>')
    for x,y,r in pts:
        c=random.choice([LAR,LAR,AMB,PET2,'#d27330',AMB]);ns.append(f'<circle cx="{x:.0f}" cy="{y:.0f}" r="{r:.1f}" fill="{c}" opacity=".9"/>')
    return ''.join(ls),''.join(ns)
L,N=rede(130,1500,500,7,liga=135)
w('capa.svg',f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1500 500" width="1500" height="500" role="img" aria-label="Capa da Dora Guilda">
<defs><linearGradient id="fc" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff1e4"/><stop offset=".6" stop-color="#fde3cc"/><stop offset="1" stop-color="#f7cfa6"/></linearGradient>
<radialGradient id="br" cx=".78" cy=".35" r=".6"><stop offset="0" stop-color="#fff" stop-opacity=".7"/><stop offset="1" stop-color="{LAR}" stop-opacity="0"/></radialGradient></defs>
<rect width="1500" height="500" fill="url(#fc)"/><rect width="1500" height="500" fill="url(#br)"/>
<g stroke="{LAR}" stroke-width="1.3" fill="none">{L}</g>{N}
<defs><linearGradient id="fz" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff1e4" stop-opacity=".95"/><stop offset=".62" stop-color="#fff1e4" stop-opacity=".82"/><stop offset="1" stop-color="#fff1e4" stop-opacity="0"/></linearGradient></defs><rect x="0" y="0" width="1120" height="500" fill="url(#fz)"/>
<g transform="translate(120 112) scale(4.6)">{simbolo("p")}</g>
<text x="440" y="236" font-family="'Barlow Condensed','Arial Narrow',Arial,sans-serif" font-weight="700" font-size="124" fill="{PET}">Dora Guilda</text>
<text x="446" y="292" font-family="'IBM Plex Sans',Arial,sans-serif" font-size="30" fill="{CANA}">Engenharia Cognitiva para Concursos Públicos</text>
<g font-family="'IBM Plex Mono',monospace" font-size="20" fill="{LAR}"><text x="446" y="352">grafos · conexões · método · IA</text></g></svg>''')

# Avatares: patentes. n nós em polígono + centro, cor da patente
PAT=[('aprendiz','Aprendiz','#b4561a',3),('escudeiro','Escudeiro','#7d8a94',4),('cavaleiro','Cavaleiro','#c98f0a',5),('mestre','Mestre',LAR,6),('arquimestre','Arquimestre','#a64d14',7),('lenda','Lenda','#7c4dcc',8)]
for i,(slug,nome,cor,n) in enumerate(PAT,1):
    cx=cy=128;R=62;pts=[(cx+R*math.cos(-math.pi/2+2*math.pi*k/n),cy+R*math.sin(-math.pi/2+2*math.pi*k/n)) for k in range(n)]
    arestas=''.join(f'<path d="M{pts[k][0]:.1f} {pts[k][1]:.1f}L{pts[(k+1)%n][0]:.1f} {pts[(k+1)%n][1]:.1f}"/>' for k in range(n))
    raios=''.join(f'<path d="M{cx} {cy}L{p[0]:.1f} {p[1]:.1f}" opacity=".5"/>' for p in pts)
    extra=''.join(f'<path d="M{pts[k][0]:.1f} {pts[k][1]:.1f}L{pts[(k+2)%n][0]:.1f} {pts[(k+2)%n][1]:.1f}" opacity=".3"/>' for k in range(n)) if n>=5 else ''
    nos=''.join(f'<circle cx="{p[0]:.1f}" cy="{p[1]:.1f}" r="7" fill="{cor}" stroke="#fff" stroke-width="1.6"/>' for p in pts)
    coroa=''.join(f'<path d="M{cx-18+k*18} 28l-7 14h14z" fill="{cor}"/>' for k in range(1 if n<5 else (2 if n<7 else 3))) if n>=4 else ''
    w(f'avatar-{i}-{slug}.svg',f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256" role="img" aria-label="Avatar {nome}">
<defs><radialGradient id="a{i}" cx=".5" cy=".4" r=".75"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#fde3cc"/></radialGradient><filter id="s{i}" x="-10%" y="-10%" width="120%" height="125%"><feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#5c381a" flood-opacity=".3"/></filter></defs>
<g filter="url(#s{i})"><circle cx="128" cy="128" r="122" fill="url(#a{i})"/></g><circle cx="128" cy="128" r="120" fill="none" stroke="{cor}" stroke-width="5"/>
<circle cx="128" cy="128" r="108" fill="none" stroke="{cor}" stroke-width="1.2" opacity=".5" stroke-dasharray="3 7"/>
<g stroke="{PET2}" stroke-width="2.4" stroke-linecap="round" fill="none" opacity=".85">{arestas}<g stroke-width="1.6">{raios}{extra}</g></g>{nos}
<circle cx="{cx}" cy="{cy}" r="11" fill="{cor}" stroke="#fff" stroke-width="2"/>{coroa}
<text x="128" y="214" text-anchor="middle" font-family="'Barlow Condensed',Arial,sans-serif" font-weight="700" font-size="17" fill="{cor}" letter-spacing="1.5">{nome.upper()}</text></svg>''')
print('ok')
