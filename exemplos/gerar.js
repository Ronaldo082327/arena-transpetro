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
  { slug: 'sefaz-es-auditor', arq: 'sefaz.txt', cargo: '', area: 'fiscal', nome: 'SEFAZ-ES 2021 · Auditor Fiscal da Receita Estadual', ano: 2021, fonte: 'https://conhecimento.fgv.br/sites/default/files/concursos/edital_de_abertura_retificado_2_sefaz-es.pdf', obs: ['Edital nº 01/2021 retificado (2ª retificação, FGV).', 'Específicas com peso 2; mínimos de pontos por bloco no item 10.10 do edital.'] }
];
LISTA.forEach(function (e) {
  const t = fs.readFileSync(path.join(dir, e.arq), 'utf8');
  const r = M.lerEdital(t, P, { cargo: e.cargo }); M.quadro(t, r.disc);
  const disc = r.disc.filter(function (d) { return d.topicos.length; }).map(function (d) { return { nome: d.nome, questoes: d.questoes || null, peso: d.peso || 1, topicos: d.topicos, sub: d.sub }; });
  const conc = { slug: e.slug, nome: e.nome, orgao: r.meta.orgao, banca: r.meta.banca, banca_id: r.meta.banca_id, cargo: (r.meta.cargo || '').replace('Auditor-fiscal', 'Auditor-Fiscal'), area: e.area, ano: e.ano, prova: e.prova || r.meta.prova, disc: disc };
  M.pesar(conc, P);
  conc.disc.forEach(function (d) { delete d.sub; });
  conc.questoes_total = conc.disc.reduce(function (a, d) { return a + (+d.questoes || 0); }, 0);
  conc.fontes = [e.fonte]; conc.observacoes = e.obs.concat(['Matérias, tópicos e quadro lidos do edital pelo motor do app; pesos dos tópicos (1–5) calculados sem IA a partir do perfil da banca, do núcleo de alta incidência e do tamanho de cada item. Não é previsão de prova.']);
  conc.exemplo = true;
  fs.writeFileSync(path.join(__dirname, e.slug + '.json'), JSON.stringify(conc, null, 1));
  console.log(e.slug, conc.disc.length, 'matérias,', conc.disc.reduce(function (a, d) { return a + d.topicos.length; }, 0), 'tópicos,', conc.questoes_total, 'questões,', conc.banca, '|', conc.cargo, '|', conc.prova);
});
fs.writeFileSync(path.join(__dirname, 'indice.json'), JSON.stringify(LISTA.map(function (e) { const c = JSON.parse(fs.readFileSync(path.join(__dirname, e.slug + '.json'))); return { slug: c.slug, nome: c.nome, banca: c.banca, banca_id: c.banca_id, area: c.area, materias: c.disc.length, questoes: c.questoes_total }; }), null, 1));
