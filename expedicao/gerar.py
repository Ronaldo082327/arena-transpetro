import re,json,os,sys
import pathlib; R=pathlib.Path(__file__).resolve().parent.parent; G=str(R/'guias')
OUT=str(R/'expedicao')
DISC=[('01-portugues','Português','portugues'),('02-ingles','Inglês','ingles'),('03-dados','Dados','dados'),('04-projetos','Projetos','projetos'),('05-governanca','Governança','governanca'),('06-engenharia-software','Eng. Software','engsoft'),('07-ux','UX','ux'),('08-bi','BI','bi'),('09-logica','Lógica','logica'),('10-seguranca','Segurança','seguranca')]
LAB={'Peso':'peso','O que a banca cobra':'cobra','O que a banca cobra (previsão)':'cobra','Como ela pergunta':'pergunta','Como ela pergunta (previsão)':'pergunta','Onde ela confunde':'confunde','Macete':'macete','Para o Anki':'anki','O que decorar':'decorar'}
QRE=re.compile(r'^\*\*(Questão comentada(?: \d+)?|Questão-modelo \(autoral\))\.\*\*\s*(.*)')
def sections(md):
    out=[];cur=None
    for line in md.split('\n'):
        m=re.match(r'^## (\d+)\.\s*(.*)',line)
        if m: cur={'n':int(m.group(1)),'t':m.group(2),'body':[]};out.append(cur);continue
        if cur is not None: cur['body'].append(line)
    return out
def subs(lines):
    out=[];cur=None;pre=[]
    for l in lines:
        m=re.match(r'^### (.*)',l)
        if m: cur={'t':m.group(1).strip(),'lines':[]};out.append(cur);continue
        (cur['lines'] if cur else pre).append(l)
    return pre,out
def parse_q(txt):
    # txt: full question text incl. gabarito/explanation
    g=re.search(r'\*\*Gabarito:\s*([A-E])\.?\*\*',txt)
    gab=g.group(1) if g else None
    head=txt[:g.start()].strip() if g else txt
    expl=txt[g.end():].strip() if g else ''
    head=head.strip()
    mm=re.match(r'^`\((.*?)\)`\s*',head)
    if mm: head='('+mm.group(1)+') '+head[mm.end():]
    src='';m=re.match(r'^\(([^)]*(?:\([^)]*\)[^)]*)*)\)\s*',head)
    if m: src=m.group(1);head=head[m.end():]
    q=head.strip()
    if q.startswith('"') and q.endswith('"'): q=q[1:-1]
    elif q.startswith('"') and q.endswith('."'): q=q[1:-2]
    parts=re.split(r'(?:(?<=\s)|^)\(([a-eA-E])\)\s',q)
    if len(parts)!=11: parts=[q]
    alts={}
    stem=parts[0].strip()
    if len(parts)>=11:
        for i in range(1,len(parts)-1,2):
            alts[parts[i].upper()]=parts[i+1].strip().rstrip(';').strip()
            if i+2>=len(parts): alts[parts[i].upper()]=alts[parts[i].upper()].rstrip('.').strip()
    return {'src':src,'stem':stem,'alts':alts if len(alts)==5 else {},'gab':gab,'expl':expl,'raw':'' if len(alts)==5 else head.strip()}
def anki(t):
    cards=[]
    for p in re.split(r'\s·\s',t):
        if '→' in p:
            f,b=p.split('→',1);cards.append([f.strip(),b.strip().rstrip('.')])
    return cards
def topic(t,lines):
    d={'t':t};qs=[];last=None;extra=[]
    for l in lines:
        if not l.strip(): continue
        m=QRE.match(l)
        if m: last={'txt':m.group(2),'auto':'autoral' in m.group(1)};qs.append(last);continue
        m=re.match(r'^\*\*([^*]+?)\.\*\*\s*(.*)',l)
        if m and m.group(1) in LAB:
            d[LAB[m.group(1)]]=m.group(2).strip();last=None;continue
        if last is not None: last['txt']+=' '+l.strip();continue
        extra.append(l)
    d['qs']=[dict(parse_q(q['txt']),auto=q['auto']) for q in qs]
    if 'anki' in d: d['cards']=anki(d['anki'])
    if extra: d['extra']='\n'.join(extra)
    return d
def fmt(t,lines):
    d={'t':t};txt='\n'.join(lines)
    for k,key in [('Como reconhecer','rec'),('Exemplo real','ex'),('Procedimento','proc'),('Erro típico','erro')]:
        m=re.search(r'^(?:- )?'+k+r'[^:\n]*:\s*(.*)$',txt,re.M)
        if m: d[key]=m.group(1).strip()
    if len(d)==1: d['md']=txt.strip()
    return d

def duelos(md):
    out=[]
    for l in md.split('\n'):
        if not l.startswith('|') or re.match(r'^\|[\s:|-]+\|$',l): continue
        c=[x.strip() for x in l.strip().strip('|').split('|')]
        if len(c)<2 or c[0].lower().startswith('o par'): continue
        lados=[x.strip() for x in re.split(r'\s+×\s+',c[0])]
        dist=[x.strip() for x in re.split(r'\s+×\s+',c[1])]
        out.append({'lados':lados,'dist':dist if len(dist)==len(lados) and len(lados)>1 else [c[1]],'src':c[2] if len(c)>2 else ''})
    return out
def listas(md):
    out=[];head=None;buf=[]
    def flush():
        if buf and head: out.append({'t':head,'md':'\n'.join(buf).strip()})
    for bl in re.split(r'\n\s*\n',md):
        b=bl.strip()
        if not b: continue
        m=re.match(r'^###\s+([^\n]*)\n?(.*)$',b,re.S)
        if m:
            flush();buf=[];head=m.group(1).strip()
            if m.group(2).strip(): buf.append(m.group(2).strip())
            continue
        m=re.match(r'^\*\*(.+?)\*\*\s*(.*)$',b,re.S)
        if m and not b.startswith('|'):
            flush();buf=[];head=None
            t=m.group(1).strip().rstrip('.')
            g=re.search(r'\(gatilho:\s*(.*)\)$',t)
            gat=g.group(1).strip().strip('"“”') if g else ''
            if g: t=t[:g.start()].strip()
            body=m.group(2).strip()
            items=[x.strip() for x in body.split(' · ')] if body.count(' · ')>=2 else []
            if not items:
                items=[x.strip() for x in re.split(r'(?<=[.;])\s+(?=[A-ZÀ-Ú0-9"“])',body) if x.strip()]
            out.append({'t':t,'gat':gat,'items':items})
            continue
        if all(re.match(r'^- ',x) for x in b.split('\n') if x.strip()):
            flush();buf=[];head=None
            for x in b.split('\n'):
                x=x[2:].strip()
                if not x: continue
                gat='';g=re.search(r'Gatilho:\s*(.+)$',x)
                if g: gat=g.group(1).strip().strip('"“”'); x=(x[:g.start()]+x[g.end():]).strip()
                t,body=(x.split(':',1) if ':' in x[:70] else (x[:60],x))
                body=body.strip()
                items=[y.strip() for y in body.split('; ')] if body.count('; ')>=2 else [y.strip() for y in re.split(r'(?<=[.;])\s+(?=[A-ZÀ-Ú0-9"“])',body) if y.strip()]
                if len(items)==1 and items[0].count(', ')>=3 and all(len(z)<60 for z in items[0].rstrip('.').split(', ')): items=[z.strip() for z in items[0].rstrip('.').split(', ')]
                out.append({'t':t.strip(),'gat':gat.rstrip('.'),'items':items})
            continue
        buf.append(b)
    flush()
    return out
def itens(md):
    return [re.sub(r'^\s*(?:\d+[.)]|[-*])\s+','',l).strip() for l in md.split('\n') if re.match(r'^\s*(?:\d+[.)]|[-*])\s+',l)]
idx=[];os.makedirs(OUT,exist_ok=True);tot=0;st={'alts5':0,'q':0,'cards':0}
for f,nome,slug in DISC:
    md=open(f'{G}/{f}.md').read()
    title=md.split('\n',1)[0].lstrip('# ').strip()
    intro=md.split('\n## ',1)[0].split('\n',1)[1].strip()
    secs={s['n']:s for s in sections(md)}
    pre1,rad=subs(secs[1]['body'])
    pre2,fm=subs(secs[2]['body'])
    if not fm:
        cur=None
        for l in pre2:
            m=re.match(r'^\*\*(Formato[^*]+)\*\*\s*$',l)
            if m: cur={'t':m.group(1).strip(),'lines':[]};fm.append(cur);continue
            if cur: cur['lines'].append(l)
    _,tp=subs(secs[3]['body'])
    o={'slug':slug,'nome':nome,'titulo':title,'intro':intro,
       'radar':[{'t':s['t'],'md':'\n'.join(s['lines']).strip()} for s in rad] or [{'t':'Radar','md':'\n'.join(pre1).strip()}],
       'formatos':[fmt(s['t'],s['lines']) for s in fm],
       'topicos':[topic(s['t'],s['lines']) for s in tp if any(l.startswith('**') for l in s['lines'])],
       'pares':'\n'.join(secs[4]['body']).strip() if 4 in secs else '',
       'lei':'\n'.join(secs[5]['body']).strip() if 5 in secs else '',
       'vespera':'\n'.join(secs[6]['body']).strip() if 6 in secs else ''}
    o['duelos']=duelos(o['pares']);o['listas']=listas(o['lei']);o['vesperaItens']=itens(o['vespera'])
    st.setdefault('duelos',0);st['duelos']+=len(o['duelos']);st.setdefault('listas',0);st['listas']+=len(o['listas'])
    for t in o['topicos']:
        for q in t['qs']:
            st['q']+=1; st['alts5']+=bool(q['alts'])
        st['cards']+=len(t.get('cards',[]))
    tot+=len(o['topicos'])
    json.dump(o,open(f'{OUT}/{slug}.json','w'),ensure_ascii=False,separators=(',',':'))
    idx.append({'slug':slug,'nome':nome,'titulo':title,'topicos':[t['t'] for t in o['topicos']],'nformatos':len(o['formatos'])})
    print(slug,len(o['formatos']),len(o['topicos']),os.path.getsize(f'{OUT}/{slug}.json'))
an=open(f'{G}/00-anatomia-cesgranrio.md').read()
json.dump({'disciplinas':idx,'anatomia':an.split('\n',1)[1].strip()},open(f'{OUT}/indice.json','w'),ensure_ascii=False,separators=(',',':'))
print(tot,st)
