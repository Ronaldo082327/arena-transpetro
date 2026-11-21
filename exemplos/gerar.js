/* Gera os concursos de exemplo da versão pública a partir do TEXTO dos editais oficiais (pdftotext -layout),
   usando o mesmo motor que o aluno usa no app (motor.js) e os perfis de banca (bancas/perfis.json).
   Uso: node exemplos/gerar.js <pasta-com-os-txt>   (os PDFs/TXT dos editais não ficam no repositório) */
const fs = require('fs'), path = require('path');
require('../motor.js'); const M = globalThis.DoraMotor;
const P = JSON.parse(fs.readFileSync(path.join(__dirname, '../bancas/perfis.json'), 'utf8'));
const dir = process.argv[2]; if (!dir) { console.error('informe a pasta dos .txt'); process.exit(1); }
const LISTA = [
  { slug: 'bacen-analista-ti', arq: 'bcb.txt', cargo: 'TECNOLOGIA DA INFORMA', area: 'ti', nome: 'Banco Central 2024 · Analista · Tecnologia da Informação', ano: 2024, fonte: 'https://www.bcb.gov.br/content/acessoinformacao/analista_2024/Edital-n-1-de-Abertura-do-concurso.pdf', obs: ['Data da prova conforme o edital de abertura; retificações posteriores podem ter mudado o cronograma [VERIFICAR].', 'Atualidades entra só na prova discursiva.'] },
  { slug: 'receita-auditor', arq: 'rfb.txt', cargo: 'AUDITOR-FISCAL', area: 'fiscal', nome: 'Receita Federal 2022 · Auditor-Fiscal', ano: 2022, prova: '2023-03-19', fonte: 'https://conhecimento.fgv.br/sites/default/files/concursos/edital_receita_federal_-_3a_retificacao.pdf', obs: ['Edital nº 1/2022 consolidado na 3ª retificação (FGV).', 'Data da prova objetiva (19/03/2023) vem de fontes de imprensa, não do edital [VERIFICAR].'] },
  { slug: 'sefaz-al-auditor', arq: 'sefazal.txt', cargo: '', area: 'fiscal', nome: 'SEFAZ-AL 2026 · Auditor Fiscal da Administração Tributária Estadual', ano: 2026, prova: '2026-12-20', cargoFixo: 'Auditor Fiscal da Administração Tributária Estadual', duracao_min: 270,
    questoes: { 'Matemática Financeira': 5, 'Direito Constitucional': 5, 'Direito Administrativo': 5, 'Contabilidade Geral': 5, 'Direito Tributário': 10, 'Estatística e Probabilidade': 10, 'Contabilidade Pública': 10, 'Economia': 10, 'Finanças Públicas': 10, 'Legislação Tributária Estadual': 10, 'Inteligência Artificial': 10, 'Desenvolvimento de Sistemas': 10, 'Infraestrutura de TIC e Segurança da Informação': 10, 'Reforma Tributária': 15, 'Auditoria Fiscal': 15, 'Ciência de Dados': 20 },
    blocos: { P1: ['Matemática Financeira', 'Direito Constitucional', 'Direito Administrativo', 'Contabilidade Geral', 'Direito Tributário', 'Estatística e Probabilidade', 'Contabilidade Pública', 'Economia'] },
    quadro: [{ bloco: 'P1 · Conhecimentos básicos', questoes: 60, minimo: 'nota mínima M1 (item 8.11.5 do edital)' }, { bloco: 'P2 · Conhecimentos específicos', questoes: 100, minimo: 'nota mínima M2; conjunto das objetivas M3' }, { bloco: 'P3 · Discursiva', questoes: 4, minimo: 'quatro questões abertas (10/1/2027)' }],
    fonte: 'https://cdn.cebraspe.org.br/concursos/SEFAZ_AL_26/arquivos/2B5730DDD358C0CDBDC1FB3C376F3E90E50A11D503FA6742A63289214E9CD983.pdf', obs: ['Edital nº 1 – SEFAZ/AL, de 24/8/2026, consolidado até a retificação do Edital nº 5, de 22/10/2026 (Cebraspe).', 'Itens certo/errado: cada item errado desconta (fórmula do subitem 8.11 do edital); em branco não pontua.', 'Provas objetivas em 20/12/2026 (4h30); discursiva em 10/1/2027; datas sujeitas a alteração pelo Cebraspe.', 'Quantidade de itens por disciplina conferida no quadro do item 7.1 do edital.'] },
  { slug: 'sefaz-es-auditor', arq: 'sefaz.txt', cargo: '', area: 'fiscal', nome: 'SEFAZ-ES 2021 · Auditor Fiscal da Receita Estadual', ano: 2021, fonte: 'https://conhecimento.fgv.br/sites/default/files/concursos/edital_de_abertura_retificado_2_sefaz-es.pdf', obs: ['Edital nº 01/2021 retificado (2ª retificação, FGV).', 'Específicas com peso 2; mínimos de pontos por bloco no item 10.10 do edital.'] }
];
LISTA.forEach(function (e) {
  const t = fs.readFileSync(path.join(dir, e.arq), 'utf8');
  const r = M.lerEdital(t, P, { cargo: e.cargo }); M.quadro(t, r.disc);
  const disc = r.disc.filter(function (d) { return d.topicos.length; }).map(function (d) { return { nome: d.nome, questoes: d.questoes || null, peso: d.peso || 1, topicos: d.topicos, sub: d.sub }; });
  const conc = { slug: e.slug, nome: e.nome, orgao: r.meta.orgao, banca: r.meta.banca, banca_id: r.meta.banca_id, cargo: e.cargoFixo || (r.meta.cargo || '').replace('Auditor-fiscal', 'Auditor-Fiscal'), area: e.area, ano: e.ano, prova: e.prova || r.meta.prova, disc: disc };
  if (e.questoes) conc.disc.forEach(function (d) { var k = Object.keys(e.questoes).find(function (n) { return M.norm(n) === M.norm(d.nome); }); if (k) d.questoes = e.questoes[k]; if (e.blocos) d.bloco = e.blocos.P1.some(function (n) { return M.norm(n) === M.norm(d.nome); }) ? 'P1 · Conhecimentos básicos' : 'P2 · Conhecimentos específicos'; });
  if (e.quadro) conc.quadro = e.quadro; if (e.duracao_min) conc.duracao_min = e.duracao_min; conc.formato = conc.banca_id === 'cebraspe' && e.slug === 'sefaz-al-auditor' ? 'certo-errado' : undefined;
  M.pesar(conc, P);
  conc.disc.forEach(function (d) { delete d.sub; });
  conc.questoes_total = conc.disc.reduce(function (a, d) { return a + (+d.questoes || 0); }, 0);
  conc.fontes = [e.fonte]; conc.observacoes = e.obs.concat(['Matérias, tópicos e quadro lidos do edital pelo motor do app; pesos dos tópicos (1–5) calculados sem IA a partir do perfil da banca, do núcleo de alta incidência e do tamanho de cada item. Não é previsão de prova.']);
  conc.exemplo = true;
  fs.writeFileSync(path.join(__dirname, e.slug + '.json'), JSON.stringify(conc, null, 1));
  console.log(e.slug, conc.disc.length, 'matérias,', conc.disc.reduce(function (a, d) { return a + d.topicos.length; }, 0), 'tópicos,', conc.questoes_total, 'questões,', conc.banca, '|', conc.cargo, '|', conc.prova);
});
fs.writeFileSync(path.join(__dirname, 'indice.json'), JSON.stringify(LISTA.map(function (e) { const c = JSON.parse(fs.readFileSync(path.join(__dirname, e.slug + '.json'))); return { slug: c.slug, nome: c.nome, banca: c.banca, banca_id: c.banca_id, area: c.area, materias: c.disc.length, questoes: c.questoes_total }; }), null, 1));
