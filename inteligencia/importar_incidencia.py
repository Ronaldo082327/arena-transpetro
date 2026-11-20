"""Converte os JSON dos cadernos 'por incidência' (enviados pela sessão Preparação Cesgranrio Transpetro, via Drive)
em inteligencia/incidencia.json. Uso: python3 inteligencia/importar_incidencia.py <550-questoes.json> <349-classificadas.json>"""
import json,sys,ast,pathlib
R=pathlib.Path(__file__).resolve().parent.parent
A=json.load(open(sys.argv[1]));B=json.load(open(sys.argv[2]))
CAD={'1':'Dados','4':'Governanca','5':'EngSoftware_UX','8':'Logica','9':'Seguranca'}
BL={'DADOS':'Dados','GOVERNANCA':'Governanca','ENG_SOFTWARE':'EngSoftware_UX','LOGICA':'Logica','SEGURANCA':'Seguranca'}
banco={str(q['id']) for q in json.load(open(R/'questoes.json'))}
rx={b['id']:b for b in B}
out=[]
for q in A['questoes']:
    if q.get('fora_do_app'): continue
    alts=q['alternativas'] if isinstance(q['alternativas'],dict) else ast.literal_eval(q['alternativas'])
    if q.get('gabarito') not in list('ABCDE') or len(alts)!=5: continue
    x={'id':str(q['id']),'disc':CAD.get(str(q['caderno']),'?'),'subitem':q.get('subitem'),'assunto':q.get('topico_tec',''),'concurso':q.get('cabecalho',''),'orgao':q.get('orgao',''),'ano':q.get('ano'),
       'enunciado':q['enunciado'],'alternativas':alts,'gabarito':q['gabarito'],'figura':bool(q.get('figura')),'noBanco':str(q['id']) in banco}
    if q.get('revisar'): x['revisar']=q['revisar'] if isinstance(q['revisar'],str) else True
    b=rx.get(x['id'])
    if b:
        x['rx']={'formato':b['f'],'tipo':b['tp'],'gatilho':b['g'],'tecnica':b['t'],'armadilha':b['a'],'conceito':b['c'],'familia':b['fam'],'itemDesc':b['itd']}
        if b['k']!=x['gabarito']: x['conflitoGabarito']=b['k']
    out.append(x)
for b in B:  # classificadas que não vieram no arquivo de 550
    if b['id'] in {o['id'] for o in out}: continue
    alts=b['alt'] if isinstance(b['alt'],dict) else ast.literal_eval(b['alt'])
    out.append({'id':b['id'],'disc':BL.get(b['b'],'?'),'subitem':b['it'],'assunto':b['tp'],'concurso':b['conc'],'ano':b['ano'],'enunciado':b['en'],'alternativas':alts,'gabarito':b['k'],'figura':False,'noBanco':False,
      'rx':{'formato':b['f'],'tipo':b['tp'],'gatilho':b['g'],'tecnica':b['t'],'armadilha':b['a'],'conceito':b['c'],'familia':b['fam'],'itemDesc':b['itd']}})
json.dump({'fonte':'TecConcursos, cadernos Cesgranrio por incidência (Dados 1, Governança 4, Eng. Software 5, Lógica 8, Segurança 9), extraídos e classificados pela sessão Preparação Cesgranrio Transpetro em 19/11/2026','n':len(out),'questoes':out},open(R/'inteligencia'/'incidencia.json','w'),ensure_ascii=False,separators=(',',':'))
import collections
print(len(out),'novas',sum(not o['noBanco'] for o in out),'com raio-x',sum('rx' in o for o in out),'figura',sum(o['figura'] for o in out),'conflitos',sum('conflitoGabarito' in o for o in out))
print(collections.Counter(o['disc'] for o in out))
