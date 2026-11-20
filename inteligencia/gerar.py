"""Gera inteligencia/padroes.json a partir de questoes.json e dos guias (expedicao/*.json).
Rode: python3 inteligencia/gerar.py"""
import json,re,collections,pathlib
R=pathlib.Path(__file__).resolve().parent.parent
Q=[q for q in json.load(open(R/'questoes.json')) if q.get('gabarito') in list('ABCDE') and len(q.get('alternativas',{}))==5]
_inc=R/'inteligencia'/'incidencia.json'
if _inc.exists():
    _ids={str(q['id']) for q in Q}
    Q+=[q for q in json.load(open(_inc))['questoes'] if not q['noBanco'] and q['id'] not in _ids and len(q['alternativas'])==5]
N=len(Q);DL={'Logica':'Lógica','BI_CienciaDados':'BI e Ciência de Dados','Seguranca':'Segurança','EngSoftware_UX':'Eng. Software e UX','Dados':'Dados','Governanca':'Governança','Projetos':'Projetos'}
out={'n':N,'fonte':'questoes.json + cadernos por incidência ('+str(N)+' questões reais Cesgranrio do TecConcursos, sem repetição)'}
out['letras']=dict(sorted(collections.Counter(q['gabarito'] for q in Q).items()))
rk=collections.Counter()
for q in Q:
    a=q['alternativas'];o=sorted(a,key=lambda k:-len(a[k]));rk[o.index(q['gabarito'])+1]+=1
out['tamanho']={str(k):rk[k] for k in sorted(rk)}
def taxa(pat):
    c=t=0
    for q in Q:
        for k,v in q['alternativas'].items():
            if re.search(pat,v,re.I): t+=1; c+=(k==q['gabarito'])
    return {'alts':t,'certas':c,'taxa':round(100*c/t,1) if t else None}
W={'somente/apenas/unicamente':r'\b(somente|apenas|unicamente)\b','exclusivamente':r'\bexclusivamente\b','necessariamente/obrigatoriamente':r'\b(necessariamente|obrigatoriamente)\b','sempre':r'\bsempre\b','nunca/jamais':r'\b(nunca|jamais)\b','todo(s)/toda(s)':r'\b(todos?|todas?)\b','qualquer':r'\bqualquer\b','nenhum(a)':r'\bnenhuma?\b',
   'pode/podem/poderá':r'\b(pode|podem|poderá|poderão|possível)\b','geralmente/em regra/normalmente':r'\b(geralmente|em regra|normalmente|tipicamente|frequentemente)\b','não (na alternativa)':r'\bnão\b'}
out['palavras']={k:taxa(v) for k,v in W.items()}
out['base']=20.0
neg=[q for q in Q if re.search(r'\b(NÃO|INCORRET|EXCETO|ERRAD)',q['enunciado'])]
out['negativos']=len(neg)
pre=[q for q in Q if q['ano']<2023];pos=[q for q in Q if q['ano']>=2023]
def ass(q): return re.sub(r'^(TI - [^-]+ - |Gestão de Projetos \(PMBOK\) - )','',q['assunto']).strip()
cp=collections.Counter((q['disc'],ass(q)) for q in pre);cq=collections.Counter((q['disc'],ass(q)) for q in pos)
tr=[]
for k in set(cp)|set(cq):
    a,b=cp[k],cq[k]
    if a+b<5: continue
    sa,sb=100*a/len(pre),100*b/len(pos)
    tr.append({'disc':DL.get(k[0],k[0]),'assunto':k[1],'antes':a,'depois':b,'pp':round(sb-sa,2)})
tr.sort(key=lambda x:-x['pp'])
out['tendencia']={'nAntes':len(pre),'nDepois':len(pos),'sobe':tr[:14],'desce':tr[-10:][::-1]}
T=[q for q in Q if 'TRANSPETRO' in q['concurso'].upper()]
out['transpetro']={'n':len(T),'top':[{'disc':DL.get(d,d),'assunto':a,'n':n} for (d,a),n in collections.Counter((q['disc'],ass(q)) for q in T).most_common(15)]}
out['porAno']=dict(sorted(collections.Counter(str(q['ano']) for q in Q).items()))
out['porDisc']={DL.get(k,k):v for k,v in collections.Counter(q['disc'] for q in Q).most_common()}
# lacunas a partir dos guias
lac=[]
for f in sorted((R/'expedicao').glob('*.json')):
    if f.name=='indice.json': continue
    o=json.load(open(f))
    for i,t in enumerate(o['topicos']):
        p=t.get('peso','');m=re.search(r'(\d+)\s+quest',p);n=int(m.group(1)) if m else 0
        tp=bool(re.search(r'Transpetro',p));sem=bool(re.search(r'sem precedente',p,re.I))
        lac.append({'slug':o['slug'],'disc':o['nome'],'i':i,'t':re.sub(r'^[\d.]+\s*','',t['t']),'n':n,'tp':tp,'sem':sem})
out['topicos']=lac

# ---------- heurísticas medidas (cada uma escolhe ou marca alternativas; taxa = acerto) ----------
import unicodedata
def nrm(x): return unicodedata.normalize('NFD',x.lower()).encode('ascii','ignore').decode()
STOP=set('a o e de da do das dos em no na nos nas um uma uns umas que se para por com ao aos as os ou como mais menos sua seu suas seus sao esta este isso essa esse ser foi ha nao entre sobre pela pelo pelas pelos ja'.split())
def tk(x): return set(w for w in re.findall(r'[a-z0-9]+',nrm(x)) if w not in STOP and len(w)>2)
def escolhe(nome,f,como,uso):
    n=h=0
    for q in Q:
        k=f(q)
        if k: n+=1;h+=(k==q['gabarito'])
    return {'nome':nome,'n':n,'acertos':h,'taxa':round(100*h/n,1) if n else None,'como':como,'uso':uso}
def unico(sc,fn):
    m=fn(sc.values());ks=[k for k in sc if sc[k]==m];return ks[0] if len(ks)==1 else None
H=[]
H.append(escolhe('Marcar a mais longa',lambda q:max(q['alternativas'],key=lambda k:len(q['alternativas'][k])),'Comprimento da alternativa','não use'))
H.append(escolhe('Marcar a mais curta',lambda q:min(q['alternativas'],key=lambda k:len(q['alternativas'][k])),'Comprimento da alternativa','não use'))
def cent(q,fn):
    T={k:tk(v) for k,v in q['alternativas'].items()};return unico({k:sum(len(T[k]&T[j])/(len(T[k]|T[j]) or 1) for j in T if j!=k) for k in T},fn)
H.append(escolhe('Marcar a mais parecida com as outras (convergência)',lambda q:cent(q,max),'Palavras em comum com as demais alternativas','não use'))
H.append(escolhe('Marcar a mais diferente das outras',lambda q:cent(q,min),'Palavras em comum com as demais alternativas','não use'))
def sov(q,fn):
    S=tk(q['enunciado']);return unico({k:len(S&tk(v)) for k,v in q['alternativas'].items()},fn)
H.append(escolhe('Marcar a que mais repete termos do enunciado',lambda q:sov(q,max),'Termos do enunciado na alternativa','sinal fraco'))
H.append(escolhe('A que menos repete termos do enunciado (para ELIMINAR)',lambda q:sov(q,min),'Alternativa que foge do vocabulário do enunciado','eliminar'))
ANT=[('aumenta','diminui'),('aumentar','diminuir'),('maior','menor'),('antes','depois'),('permite','impede'),('normalizado','desnormalizado'),('sincrono','assincrono'),('simetrica','assimetrica'),('publica','privada'),('interno','externo'),('verificacao','validacao'),('eficacia','eficiencia'),('total','parcial'),('ativo','passivo'),('estatico','dinamico'),('estatica','dinamica'),('qualitativa','quantitativa'),('entrada','saida'),('detecta','bloqueia'),('fisico','logico'),('dependente','independente'),('alta','baixa'),('positiva','negativa'),('verdadeira','falsa'),('controlador','operador'),('cliente','servidor')]
def espelho(q):
    al={k:nrm(v) for k,v in q['alternativas'].items()};ks=list(al);ps=set()
    for i in range(5):
        for j in range(i+1,5):
            a,b=al[ks[i]],al[ks[j]]
            for x,y in ANT:
                if (re.search(r'\b'+x+r'\b',a) and re.search(r'\b'+y+r'\b',b)) or (re.search(r'\b'+y+r'\b',a) and re.search(r'\b'+x+r'\b',b)):
                    if len(tk(a)&tk(b))/(len(tk(a)|tk(b)) or 1)>=.4: ps.add((ks[i],ks[j]))
    return ps
n=h=0;ex=[]
for q in Q:
    ps=espelho(q)
    if len(ps)==1:  # só um par: senão os pares cobrem mais de 2 letras e a taxa infla
        n+=1;h+=q['gabarito'] in next(iter(ps))
        if len(ex)<8: ex.append(q['id'])
H.append({'nome':'Par espelho por antônimo (um único par): o gabarito está no par','n':n,'acertos':h,'taxa':round(100*h/n,1) if n else None,'como':'Duas alternativas quase iguais trocando um antônimo','uso':'mito: Central mediu 42% a 44% (acaso 40%)','base':40,'exemplos':ex})
out['heuristicas']=H
ABS=r'\b(exclusivamente|necessariamente|obrigatoriamente|nunca|jamais|qualquer|sempre|somente|apenas|unicamente)\b'
pd=collections.defaultdict(lambda:[0,0])
for q in Q:
    for k,v in q['alternativas'].items():
        if re.search(ABS,v,re.I): pd[q['disc']][0]+=1;pd[q['disc']][1]+=(k==q['gabarito'])
out['absPorDisc']=[{'disc':DL.get(d,d),'alts':t,'certas':c,'taxa':round(100*c/t,1)} for d,(t,c) in sorted(pd.items(),key=lambda x:x[1][1]/max(1,x[1][0]))]
json.dump(out,open(R/'inteligencia'/'padroes.json','w'),ensure_ascii=False,indent=1)
print(N,len(lac))
for k,v in out['palavras'].items(): print(k,v)
print(out['transpetro']['top'][:6])
