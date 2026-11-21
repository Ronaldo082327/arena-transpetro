# Rede da Dora: busca nos próprios materiais do aluno (estilo NotebookLM)

`rag.js` (`window.DoraRAG`) é um índice local que conecta tudo o que entra no app e tudo o que é produzido nele. Não usa servidor e não guarda nada novo: lê os dados que já existem e monta a busca na memória. Recria o índice quando algo é salvo ou a cada 5 minutos.

## Fontes indexadas (`ragRegistrar` em `estudio.html`)

| Fonte | Onde está | Peso |
|---|---|---|
| Seu concurso (nome, banca, cargo, edital) | `arenaTP.concurso` | 1,3 |
| Caderno de Erros (enunciado, motivo, nota, análise, cartas) | `arenaTP.erros` | 1,25 |
| Fichas da Dora Examinadora | `arenaTP.fichas` | 1,1 |
| Mapas da Dora | `arenaTP.mapas` | 1 |
| Respostas da Dora (o que a própria Dora já produziu) | `arenaTP.dora` | 0,9 |
| Perfil da banca, prioridades, armadilhas, comentários | `banca.json` | 1,1 a 1,2 |
| Guias por disciplina (tópicos, questões reais, lei seca, pares, radar) | `expedicao/*.json` | 1 a 1,1 |
| Macetes, cartas, questões da banca | `macetes.json`, `cards.json`, `questoes.json` | 0,9 a 1 |
| Dora Draw: PDFs (texto por página), grifos, notas de tópico, cartões, questões, Diário, marcações de sites, Caixa de entrada, criações do Estúdio | IndexedDB `dora-draw` (ou `dora-draw-p-<perfil>`) | 0,9 a 1,2 |

- **Dora Draw.** Lido só para leitura e só se o banco já existir (`indexedDB.databases()`), para nunca criar um banco vazio que atrapalhe a migração do Draw.
- **Cópia pública.** Os JSON de conteúdo saem vazios; só entram os dados do próprio aluno.

## Como a busca funciona
- **Ranqueamento:** BM25 com normalização do português (acentos, stopwords, plurais e terminações). O título conta em dobro, e há bônus para frase exata.
- **Pedaços:** textos longos viram trechos de cerca de 900 caracteres.
- **Variedade:** no máximo 3 trechos por fonte em cada busca.
- **Contexto para a IA:** `DoraRAG.contexto(pergunta)` devolve até 5 mil caracteres, com a regra de que as fontes do aluno são a base principal e devem ser citadas como [F1]. O conhecimento geral é permitido, marcado "(fora do seu material)".
- **Não é a única fonte.** A IA completa com o conhecimento dela, e a Estante na nuvem (File Search do porteiro) entra junto quando marcada.

## Onde a busca é usada
- **`aicall(prompt, json, {rag:'consulta'})`.** Antes de pedir à IA, junta os trechos. Os trechos usados ficam em `window.__ragUsado`.
- **Já ligada em:**
  - análise do Caderno de Erros;
  - fichas da Dora Examinadora;
  - Mapas da Dora.
- **Tela `#pergunte` (Pergunte à Dora).** Modos Responder, Questões no estilo da banca, Resumo, Cartas e Plano de 30 minutos.
  - "Só procurar nos meus materiais" busca sem IA.
  - "Só do meu material" deixa a resposta estrita.
  - Cada resposta mostra as fontes com link e é guardada, passando a fazer parte da Rede.

## Para a sessão local (Dora Draw)
- O Dora Estúdio do Draw já tem um BM25 próprio (`logica6`). O que ainda falta indexar está em `docs/bussola-draw-analise.md` e na revisão de capturas:
  - `capturas`;
  - `erros`;
  - `questoes`;
  - `artefatos`;
  - textos da Pena.
- No site (mesma origem), o Draw também pode ler `arenaTP.erros`, `arenaTP.fichas`, `arenaTP.mapas` e `arenaTP.dora`. Na extensão a origem é outra, então isso só funciona no site.
