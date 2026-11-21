#!/usr/bin/env python3
"""Dora Guilda · versão pública. Copia o MOTOR do app e troca o CONTEÚDO pessoal (Transpetro, questões, cartas, dossiê, guias, áudio) por esqueletos vazios.
Uso: python3 publico/construir.py [pasta-de-saida]   (padrão: publico/dist, ignorada pelo git)
O aluno importa os próprios materiais pelo app (ficam só no navegador dele). Nenhuma chave de IA é copiada nem embutida."""
import json, os, shutil, sys
RAIZ=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SAIDA=os.path.abspath(sys.argv[1] if len(sys.argv)>1 else os.path.join(RAIZ,'publico','dist'))
IGNORAR={'.git','publico','docs','AGENTS.md','README.md','audio','guias','__pycache__','node_modules'}
CONTEUDO_JSON=['questoes.json','cards.json','biblioteca.json','cadernos.json','banca.json','macetes.json','links.json','videos.json',
 'anki/baralhos.json','ingles/textos.json','inteligencia/padroes.json','inteligencia/incidencia.json','inteligencia/radar.json']
def vazio(v,n=0):
    if isinstance(v,list): return []
    if isinstance(v,dict): return {k:vazio(x,n+1) for k,x in v.items()}
    if isinstance(v,bool): return v
    if isinstance(v,(int,float)): return 0
    return ''
def copiar(src,dst):
    for nome in os.listdir(src):
        if nome in IGNORAR or nome.endswith('.py'): continue
        a,b=os.path.join(src,nome),os.path.join(dst,nome)
        if os.path.isdir(a): os.makedirs(b,exist_ok=True); copiar(a,b)
        else: shutil.copy2(a,b)
if os.path.exists(SAIDA): shutil.rmtree(SAIDA)
os.makedirs(SAIDA); copiar(RAIZ,SAIDA)
def esq(rel):
    p=os.path.join(SAIDA,rel)
    if os.path.exists(p):
        d=json.load(open(p,encoding='utf-8')); json.dump(vazio(d),open(p,'w',encoding='utf-8'),ensure_ascii=False)
for rel in CONTEUDO_JSON: esq(rel)
for pasta in ('dossie','expedicao'):
    for f in os.listdir(os.path.join(SAIDA,pasta)):
        if f.endswith('.json') and f!='indice.json': esq(pasta+'/'+f)
# concurso modelo (o aluno edita ou importa o próprio edital)
pk=os.path.join(SAIDA,'concursos'); os.makedirs(pk,exist_ok=True)
for f in os.listdir(pk): os.remove(os.path.join(pk,f))
modelo={"tipo":"doroxandria-pacote-concurso","schemaVersion":2,"geradoEm":"","biblioteca":{"disciplinas":[],"topicos":[],"materiais":[],"bancos":[]},
 "concurso":{"id":"modelo","nome":"Meu concurso","orgao":"","banca":"","cargo":"","enfase":"","polo":"","modalidade":"","edital":{},"datas":{},"status":"modelo","resultado":{}}}
json.dump(modelo,open(os.path.join(pk,'modelo.json'),'w',encoding='utf-8'),ensure_ascii=False)
json.dump({"pacotes":[{"arquivo":"modelo.json","nome":"Meu concurso (modelo)","primeiraExecucao":True}]},open(os.path.join(pk,'indice.json'),'w',encoding='utf-8'),ensure_ascii=False)
sw=open(os.path.join(SAIDA,'sw.js'),encoding='utf-8').read().replace('concursos/transpetro-2026-enfase5.json','concursos/modelo.json')
open(os.path.join(SAIDA,'sw.js'),'w',encoding='utf-8').write(sw)

# ---- personalização: tira Transpetro/Cesgranrio dos textos e esconde módulos específicos ----
import re as _re
TROCAS=[
 ('Prova Transpetro 2026 · Ênfase 5','Prova do seu concurso'),('Engenharia Cognitiva para Concursos Públicos · Transpetro 2026 · Ênfase 5','Engenharia Cognitiva para Concursos Públicos'),
 ('TRANSPETRO 2026 · CESGRANRIO · ÊNFASE 5 · 06/12','SEU CONCURSO'),('TRANSPETRO 2026 · CESGRANRIO · ÊNFASE 5','SEU CONCURSO'),('TRANSPETRO 2026 · CESGRANRIO · PRANCHA','SEU CONCURSO · PRANCHA'),
 ('Transpetro 2026 · Ênfase 5','Seu concurso'),('Transpetro 2026 Premium','Seu concurso Premium'),('Transpetro-2026-Anki-Premium','Anki-Premium'),('Transpetro 06/12','Seu concurso'),
 ('Reflexo Cesgranrio','Reflexo da Banca'),('Cesgranrio','banca'),('CESGRANRIO','BANCA'),
 ('Mapa-Mundi Transpetro','Mapa do seu concurso'),('Radar Transpetro','Radar do seu concurso'),('CAIU NA TRANSPETRO','JÁ CAIU NA PROVA'),
 ('Transpetro','seu concurso'),('TRANSPETRO','SEU CONCURSO'),('Ênfase 5','sua área'),('06/12/2026','data da prova'),('06/12','data da prova'),('Dias até a prova (data da prova)','Dias até a prova'),
]
def personaliza(t):
    for a,b in TROCAS: t=t.replace(a,b)
    t=_re.sub(r'\b(a|da|na|pela|à|A|Da|Na) banca',lambda m:m.group(1)+' banca',t)
    return t
for dp,_,fs in os.walk(SAIDA):
    if os.sep+'identidade' in dp or os.sep+'draw' in dp: continue
    for f in fs:
        if f.endswith(('.html','.js')) and f not in ('sw.js',):
            p=os.path.join(dp,f); t=open(p,encoding='utf-8').read(); n=personaliza(t)
            if n!=t: open(p,'w',encoding='utf-8').write(n)
# contagem regressiva configurável (arenaTP.prova = AAAA-MM-DD); sem data, o chip some
p=os.path.join(SAIDA,'estudio.html'); t=open(p,encoding='utf-8').read()
a="var el=$('#dias');if(!el)return;var d=Math.ceil((new Date(2026,11,6)-"
if a in t:
    t=t.replace(a,"var el=$('#dias');if(!el)return;var pv=null;try{pv=localStorage.getItem('arenaTP.prova');}catch(e){}if(!pv){el.hidden=true;return;}var d=Math.ceil((new Date(pv+'T12:00:00')-")
    open(p,'w',encoding='utf-8').write(t)
# catálogo: esconde módulos que só fazem sentido para a Transpetro
p=os.path.join(SAIDA,'guilda.js'); t=open(p,encoding='utf-8').read()
t+="\n(function(){var G=window.GUILDA;if(!G||!G.groups)return;var fica=['hoje','agenda','relatorio','voo','topico','plano','mira','mt','mapaia','pergunte','estante','fc','bolso','erros','gem','draw/index.html','identidade/index.html'];G.groups.forEach(function(g){g[1]=g[1].filter(function(i){return fica.indexOf(i[0])>=0;});});G.groups[0][1].unshift(['config','⚙️','Meu concurso','Nome, banca, data da prova e edital']);G.groups=G.groups.filter(function(g){return g[1].length;});})();\n"
open(p,'w',encoding='utf-8').write(t)

# modo público: Mira e Plano usam as matérias do aluno
p2=os.path.join(SAIDA,'estudio.html');t2=open(p2,encoding='utf-8').read();t2=t2.replace('var MODO_PUBLICO=false;','var MODO_PUBLICO=true;',1);open(p2,'w',encoding='utf-8').write(t2)

# porteiro padrão (opcional): PORTEIRO_URL=https://... python3 publico/construir.py
_pu=os.environ.get('PORTEIRO_URL','').strip()
if _pu:
    p3=os.path.join(SAIDA,'estudio.html');t3=open(p3,encoding='utf-8').read();t3=t3.replace("var PORTEIRO_PADRAO='';","var PORTEIRO_PADRAO='"+_pu.replace("'","")+"';",1);open(p3,'w',encoding='utf-8').write(t3)
# garantia: nenhuma chave de API
import re
for dp,_,fs in os.walk(SAIDA):
    for f in fs:
        if f.endswith(('.html','.js','.json','.css')):
            t=open(os.path.join(dp,f),encoding='utf-8',errors='ignore').read()
            if re.search(r'AIza[0-9A-Za-z_-]{30,}|sk-ant-[0-9A-Za-z_-]{20,}',t): sys.exit('CHAVE ENCONTRADA em '+os.path.join(dp,f))
print('Versão pública gerada em',SAIDA)
