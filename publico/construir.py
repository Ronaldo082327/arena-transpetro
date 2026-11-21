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
# garantia: nenhuma chave de API
import re
for dp,_,fs in os.walk(SAIDA):
    for f in fs:
        if f.endswith(('.html','.js','.json','.css')):
            t=open(os.path.join(dp,f),encoding='utf-8',errors='ignore').read()
            if re.search(r'AIza[0-9A-Za-z_-]{30,}|sk-ant-[0-9A-Za-z_-]{20,}',t): sys.exit('CHAVE ENCONTRADA em '+os.path.join(dp,f))
print('Versão pública gerada em',SAIDA)
