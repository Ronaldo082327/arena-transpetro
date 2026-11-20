"""Converte o export dos 47 baralhos Anki (sessão Preparação Cesgranrio Transpetro, revisados contra os capítulos e gabaritos)
em anki/baralhos.json. Uso: python3 anki/importar.py <arquivo.txt>"""
import sys,re,json,pathlib
R=pathlib.Path(__file__).resolve().parent
txt=open(sys.argv[1],encoding='utf-8').read().split('\n')
MAT={'ingles':'ingles','portugues':'portugues','dados':'dados','seguranca':'seguranca','projetos':'projetos','engsoft':'engsoft','eng':'engsoft','governanca':'governanca','lgpd':'governanca','ux':'ux','logica':'logica','bi':'bi','metodo':'metodo'}
def slug(nome,tags):
    n=nome.lower()
    for k,v in [('ingles','ingles'),('portugues','portugues'),('arquitetura de dados','dados'),('dados','dados'),('seguranca','seguranca'),('projetos','projetos'),('eng','engsoft'),('governanca','governanca'),('lgpd','governanca'),('ux','ux'),('logica','logica'),('bi','bi'),('metodo','metodo')]:
        if k in n: return v
    return 'metodo'
def parte(back):
    out={'sig':'','dica':'','ex':'','exSrc':'','nc':'','extra':''}
    for p in re.split(r'<br>\s*<br>',back):
        p=p.strip()
        if not p: continue
        if p.startswith('💡'): out['dica']=p[1:].strip()
        elif re.match(r'^<i>Exemplo:</i>',p):
            m=re.search(r'<small>\((.*)\)</small>\s*$',p)
            out['exSrc']=m.group(1) if m else ''
            out['ex']=re.sub(r'<small>.*</small>\s*$','',re.sub(r'^<i>Exemplo:</i>\s*','',p)).strip()
        elif p.startswith('<b>Não confunda com:</b>'): out['nc']=p.replace('<b>Não confunda com:</b>','').strip()
        elif not out['sig']: out['sig']=p
        else: out['extra']=(out['extra']+' '+p).strip()
    return out
decks=[];cards=[];cur=None
for l in txt:
    m=re.match(r'^BARALHO:\s*(.+?)\.txt\s*\((\d+)',l)
    if m:
        nome=m.group(1);num=nome.split(' - ')[0];cur={'id':num,'nome':nome.split(' - ',1)[1] if ' - ' in nome else nome,'n':int(m.group(2))};decks.append(cur);continue
    if l.count('\t')<2 or cur is None: continue
    f,b,t=l.split('\t',2)
    tags=t.split()
    niv=next((int(x[-1]) for x in tags if re.match(r'^nivel\d$',x)),2)
    c={'id':cur['id']+'-'+str(sum(1 for x in cards if x['d']==cur['id'])+1),'d':cur['id'],'s':slug(cur['nome'],tags),'f':f.strip(),'n':niv,'tp':'tema-provavel' in tags,'bolso':'bolso' in tags or 'bolso' in cur['nome'].lower()}
    c.update({k:v for k,v in parte(b).items() if v})
    cards.append(c)
for d in decks: d['s']=slug(d['nome'],[]);d['real']=sum(1 for c in cards if c['d']==d['id'])
json.dump({'fonte':'47 baralhos Anki do Ronaldo (revisados pela sessão Preparação Cesgranrio Transpetro contra os capítulos e gabaritos oficiais)','n':len(cards),'decks':decks,'cards':cards},open(R/'baralhos.json','w'),ensure_ascii=False,separators=(',',':'))
import collections
print(len(cards),len(decks),[d for d in decks if d['real']!=d['n']])
print(collections.Counter(c['s'] for c in cards))
print(sum('nc' in c for c in cards),'com nao confunda;',sum('ex' in c for c in cards),'com exemplo;',sum('dica' in c for c in cards),'com dica')
print(json.dumps(cards[1000],ensure_ascii=False)[:500])
