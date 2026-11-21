# Dora Guilda · Visão 360° e plano de execução

Análise de 21/11/2026 (sessão nuvem). Prova da Transpetro em 06/12/2026: faltam 15 dias. Base: `AGENTS.md`, `docs/*`, `guilda.js`, `estudio.html`, `rag.js`, `publico/construir.py`, `draw/LEIA-ME.md`, `draw/src/db.js` e a proposta da Mesa (`claude/mesa-pdf-proposta`). O código de `draw/`, a extensão e o porteiro são da sessão local: tudo o que toca neles aparece aqui como **proposta [LOCAL]**. O que é do Estúdio aparece como **[NUVEM]** e pode começar já.

**Tese.** O mercado vende três coisas separadas: banco de questões (Tec, QConcursos), conteúdo (Estratégia, Gran) e ferramenta genérica (Anki, RemNote, GoodNotes, NotebookLM, Notion). Nenhuma liga *a página que você leu* à *questão que você errou*, ao *tópico do edital* e ao *seu calendário real*. A Dora Guilda já tem as peças; falta o fio. O plano é um só: **tudo vira objeto ligado a um tópico do edital, com evidência**, e uma tela "Hoje" decide o próximo passo.

---

## 1. Diagnóstico 360: a jornada do aluno

| Etapa | O que já existe (módulo) | Lacuna | Fragmentação Estúdio × Draw | O que o mercado não faz |
|---|---|---|---|---|
| 1. Descobrir o edital | Meu concurso (`#config`, edital colado, relevância 1–5 por IA); Draw: Dora Edital por PDF, Quadro da prova, Estruturas da Guilda | Tópico sem id estável (é texto por índice); sem "quadro da prova" no Estúdio (mínimos por bloco) | Dois editais, digitados duas vezes, sem ponte | Edital vira lista, não mapa com peso, cobertura e domínio |
| 2. Diagnosticar | Mira da Guilda (peso × relevância × erros); Dora Oráculo (Monte Carlo); Draw: Gêmeo digital | Não há diagnóstico inicial (pré-teste); acerto por tópico sem intervalo na Mira | Dois estimadores (Oráculo e Gêmeo) com números diferentes | Diagnóstico honesto, com n e faixa |
| 3. Planejar | Dora Missão do Dia (`#plano`: 16 dias fixos no app principal; 3 tópicos na cópia pública); Draw: Ciclo, Agenda, tela Hoje | Plano ignora a agenda real; dia perdido não replaneja; não exporta | Dois "Hoje", dois planos | Nenhum encaixa o ciclo nos buracos do calendário do aluno |
| 4. Teoria / PDF | Estante inteligente (`#estante`, File Search); Draw: Estante com grifos, Dora Pena, áudio, Pomodoro | Sessão não fica ligada a material/página/tópico; sem ritmo nem projeção; grifo não vira nada sozinho | PDF vive em dois lugares (nuvem do porteiro e IndexedDB do Draw) | GoodNotes/UPDF não conhecem edital nem banca |
| 5. Questões | Doroxandria (1.000), Dora Cartas (`#cq`), Dora Reflexo, Arena; Draw: banco, Clipper, modo assistido | Sem confiança antes da resposta em todo lugar; sem dificuldade/tópico/print no assistido; sem autópsia por alternativa | Respostas em 4 lugares (`arenaTP.v2.hist`, `S.cq.log`, `arenaTP.jogo.v1`, `respostas` do Draw) | Tec tem a questão, não tem o *porquê do seu erro* nem o seu PDF |
| 6. Revisar / memorizar | Dora Memória (caixas 1-3-7-14-30), Caderno de Erros (1-3-7-15-30), Baralhos; Draw: Dora Cartas FSRS, Dora Revisões | Três agendadores; nenhum conhece a data da prova | Três filas diárias | Anki não sabe que a prova é em 15 dias |
| 7. Simulados | Simulados do Doroxandria (calibração, tipos de erro); Draw: Diário de Simulados, agentes TRI | Sem curva de fadiga, trocas de resposta, plano de tempo por bloco | Resultado do simulado não volta para a Mira | Simulado dá nota, não dá estratégia |
| 8. Reta final | Pranchas, Esquemas → Véspera, checklist; plano marca os 2 últimos dias | Sem "modo reta final" que comprima revisões e corte conteúdo novo | — | Cursos empurram mais conteúdo |
| 9. Dia da prova | Método de 5 passos no plano; chute por dezena (medido) | Sem cartão de voo (ordem, tempos, pausas), sem logística | — | Ninguém cobre |
| 10. Pós-prova / recursos | Nada | Conferir gabarito, estimar nota, rascunhar recurso com base no próprio material, levar a estrutura para o próximo concurso | — | Recursos são do professor, não do aluno |

**Três problemas de fundo:**
1. **Sem identidade de tópico.** `arenaTP.concurso.disc[i].topicos[j]` é texto; erros casam por `indexOf` (`ccLinhas`). Qualquer edição do edital quebra os vínculos.
2. **Sem diário único de evidências.** Cada módulo guarda o seu log. Nenhuma tela consegue responder "o que eu fiz ontem?".
3. **Dois apps.** O Estúdio já lê o IndexedDB do Draw só para leitura (`DoraRAG.lerDraw()`), mas só usa isso para busca. Essa ponte é a chave da Onda 1: dá para unificar a *leitura* sem tocar no Draw.

---

## 2. Camadas e o Grafo do Concurso

**Camadas:** app (casca, tema, IA, busca) → jornada (10 etapas) → módulos → **objetos de estudo**. A unificação acontece na camada dos objetos, não na dos módulos.

### 2.1 Objetos e ids

| Objeto | Id | Hoje | Campos mínimos novos |
|---|---|---|---|
| Concurso | `con:<slug>` | `arenaTP.concurso` / `concursos` | `orgaoId`, `bancaId`, `quadro[{bloco,q,min}]` |
| Banca / Órgão | `banca:cesgranrio`, `orgao:transpetro` | texto livre | perfil agregado (2.3) |
| Disciplina | `disc:<hash>` | `disc[i]` | `id`, `bloco` |
| **Tópico do edital** | `top:<hash(disc+texto normalizado)>` | texto por índice | `ids[j]` paralelo a `topicos[j]`; `pai`; `drawId` |
| Material (PDF) / Página | `mat:<id>` / `pag:<mat>:<n>` | `materiais` do Draw; Estante | `topicoIds[]` por faixa de páginas |
| Grifo / carimbo | `grifo:<id>` | `grifos` | `significado`, `destino` |
| Questão | `q:<fonte>:<id>` (`q:tec:123`, `q:banco:Q0412`) | 4 bancos | `bancaId`, `orgaoId`, `ano`, `formato`, `topicoId` |
| Alternativa | `alt:<q>:<letra>` | não existe | `papel` (gabarito, vizinho, absoluto, inversão, exceção, literal trocada) |
| Sessão de estudo | `ses:<ts>` | `sessoes` do Draw | `topicoId`, `matId`, `pagIni/pagFim`, `min`, `modo`, `blocoPlano` |
| Resposta | `resp:<ts>` | 4 logs | `qId`, `ok`, `conf`, `seg`, `dif`, `fonte` |
| Erro | `erro:<id>` | `arenaTP.erros`, `erros` do Draw | `topicoId`, `qId`, `altMarcada`, `pagRef` |
| Carta | `carta:<id>` | `S.box`, FSRS do Draw, Anki | `topicoId`, `origem` (grifo, erro, ficha, mapa) |
| Ficha, mapa, resposta da Dora | `ficha:` `mapa:` `dora:` | `arenaTP.fichas/mapas/dora` | `topicoId` |
| Evento de agenda / bloco do plano | `ev:` / `bloco:<data>:<n>` | não existe | 3.1 |

**Regra única:** todo objeto carrega `topicoId` (ou herda do pai) e todo fato de desempenho vira uma **evidência**.

### 2.2 Diário de evidências (o fio)

Registro compacto, só de acréscimo:
`{t:<epoch s>, k:'resp|rev|ses|erro|leit|sim', top:'top:…', ok:0|1, c:1|2|3 (chute, dúvida, certeza), s:<seg>, f:'estudio|draw|tec|sim|arena', r:'<id do objeto>'}`.

Dele saem, por tópico, disciplina, banca ou dia: n, acerto com faixa (Beta(acertos+1, erros+1), intervalo de 80%), calibração (acerto por nível de confiança), tempo médio, última evidência. Com n < 5 a tela mostra "pista", como a Dora Examinadora já faz. A palavra "prevê" não aparece.

### 2.3 Perfil de banca e órgão (agregado, derivado)

`perfil[bancaId][orgaoId|*][discId][topicoId] = {n, pct, formatos{}, papeisDeDistrator{}, anos[], acertoDoAluno, n_aluno}`. Fontes: `questoes.json` e `inteligencia/*` (app principal), questões resolvidas no modo assistido, banco do Draw e, com consentimento, o Censo da Guilda (ideia 18). Sempre com n e a fonte ao lado.

### 2.4 Onde isso vive

- **[NUVEM]** `grafo.js` (`window.DoraGrafo`): gera e migra ids de tópico (aditivo), grava o diário, agrega por tópico e lê o Draw pela ponte que já existe.
- **[LOCAL]** o Draw mantém as lojas dele; só acrescenta campos opcionais (`topicoId` já existe em quase todas) e expõe o mesmo formato de evidência na exportação `dora-guilda-evidencias` v1, irmã do `dora-guilda-erros` v1.
- **Rede da Dora** passa a indexar por `topicoId`: `DoraRAG.porTopico(id)` devolve os trechos de um tópico sem consulta textual.

---

## 3. Ideias (33), do PDF ao pós-prova

Custo de IA: **0** = nenhum; **1** = uma chamada sob demanda; **N** = várias, com aviso de cota. Esforço: P (até 1 dia), M (2 a 4 dias), G (mais de uma semana). As seis obrigatórias estão detalhadas em 3.1 a 3.6.

### PDF e leitura

| # | Nome | O que faz | Por que vai além | Onde | IA | Esf. | Depende de |
|---|---|---|---|---|---|---|---|
| 1 | **Legenda Viva** | A cor do grifo decide o destino: resumo do tópico, carta de lacuna, "como a banca cobra", fila de dúvidas (Mesa A) | Grifar passa a ser codificação com consequência; hoje é o gesto mais passivo do estudo | Draw [LOCAL] | 0 | M | `marcSignificados` |
| 2 | **Dora Sonda** | Antes de abrir o PDF de um tópico, 3 questões da banca sobre ele, mesmo sem ter estudado | Efeito de pré-teste: errar antes aumenta a retenção da leitura e mostra o que a banca quer | Estúdio (Sala do Tópico) [NUVEM] | 0 (banco) ou 1 | P | Grafo |
| 3 | **Folha em Branco** | Ao fim do bloco, o aluno escreve o que lembra; o app compara com os grifos da sessão (BM25 local) e mostra os grifos **não lembrados**, que viram cartas | Recordação livre com correção automática e sem IA; nenhum leitor de PDF fecha esse ciclo | Estúdio lendo `grifos` [NUVEM]; no Draw depois | 0 | M | Sessão com `matId` (4) |
| 4 | **Dora Ampulheta** | Sessão ligada a material, páginas e tópico; ritmo (pág/h) e projeção "faltam 212 pág ≈ 9 h; termina 30/11"; mapa de calor das páginas (Mesa D) | Planejamento por evidência do próprio ritmo, com data | Draw [LOCAL]; leitura no Estúdio | 0 | M | `sessoes.pagIni/pagFim` |
| 5 | **Lupa da Banca** | Ao lado da página, as questões do banco do aluno que casam com o texto dela; no erro, o caminho inverso (**Fio de Ariadne**: "a resposta está na p. 47 do seu PDF") | Tec não conhece seu PDF; NotebookLM não conhece suas questões | Estúdio [NUVEM] (`rag.js`) e Draw [LOCAL] | 0 | M | Texto por página (já indexado) |
| 6 | **Tesoura da Guilda** | Marca as páginas do PDF que não casam com nenhum tópico do edital nem com questões da banca: "leia 140 de 380" | Decide o que **não** ler, a decisão mais valiosa na reta final; mostra a evidência de cada corte | Estúdio [NUVEM] | 0 | M | Grafo, perfil da banca |
| 7 | **Carimbos da Guilda** | "Cai muito", "Pegadinha", "Lei seca", "Errei aqui"; filtro por carimbo; sublinhado, tachado, ondulado, nota adesiva (Mesa B) | Anotação com semântica de concurso | Draw [LOCAL] | 0 | M | — |
| 8 | **Teste esta Página** | 3 a 5 questões no estilo da banca a partir dos grifos da página; acerto entra no diário (Mesa F) | Prática de recuperação colada na fonte | Draw [LOCAL] + porteiro | 1 | M | Cota |
| 9 | **Olho da Dora** | OCR de página escaneada e "ler minha letra" do laço, uma página por vez (Mesa C/A) | Manuscrito e escaneado passam a ser buscáveis na Rede | Draw + porteiro [LOCAL] | 1/pág | M | Cota, aviso |

### Questões

| # | Nome | O que faz | Por que vai além | Onde | IA | Esf. | Depende de |
|---|---|---|---|---|---|---|---|
| 10 | **Dora Escudeira** (modo assistido do Tec, completo) | Ver 3.4 | Banco de questões alheio vira dado próprio | Extensão [LOCAL] | 0 | G | Adaptador do Tec |
| 11 | **Balança da Dora** | Confiança (certeza, dúvida, chute) **antes** de ver o gabarito, em todo lugar; curva de calibração por disciplina; acerto frágil volta para revisão | Metacognição medida: o aluno descobre onde "acha que sabe" | Estúdio [NUVEM] + Draw | 0 | P | Diário |
| 12 | **Dora Legista** | Autópsia por alternativa: em um toque, o papel de cada distrator (vizinho, absoluto, inversão, exceção, literal trocada); forma o catálogo de distratores da banca | Ninguém trata a alternativa como objeto; é onde a banca "assina" | Estúdio (`#cq`, erros) [NUVEM]; extensão depois | 0 (toque) ou 1 | M | Objeto `alt` |
| 13 | **Gêmeas da Dora** | Para cada erro, 2 variantes que mudam só o traço decisivo; agendadas em 2 e 7 dias; guardadas em cache | Casos contrastantes e transferência: testa a regra, não a memória da questão | Estúdio + IA [NUVEM] | 1 por erro | P | `aicall` com RAG |
| 14 | **Treino Trançado** | Sessão que intercala tópicos que o aluno confunde (pares `vizinhos` do dossiê e erros "confundi dois conceitos") | Intercalação dirigida pelos erros reais, não aleatória | Estúdio [NUVEM] | 0 | P | Diário, erros |
| 15 | **Trilha do Avesso** (estudo reverso) | 10 questões do tópico primeiro; depois só as páginas apontadas pelos erros (Fio de Ariadne) | Leitura guiada por lacuna; economiza horas | Estúdio [NUVEM] | 0 | P | 5 |

### Edital, banca e conhecimento

| # | Nome | O que faz | Por que vai além | Onde | IA | Esf. | Depende de |
|---|---|---|---|---|---|---|---|
| 16 | **Sala do Tópico** | Uma tela por tópico com tudo junto: como cai, páginas e grifos, questões, erros, cartas, mapa, tempo investido, domínio com faixa | É o "um app só" na prática | Estúdio [NUVEM] | 0 | M | Grafo |
| 17 | **Dora Cartógrafa** (Edital Vivo) | Edital como mapa de 3 camadas: quanto vale, quanto cobri, quanto domino (com faixa); entrada por PDF do edital | Edital deixa de ser checklist | Estúdio [NUVEM] | 1 (leitura do edital) | M | `draw/lib/pdf.min.mjs` |
| 18 | **Dossiê Vivo da Banca** + **Censo da Guilda** | Ver 3.6 | Inteligência de banca do próprio aluno, com n | Estúdio [NUVEM]; Censo no porteiro [LOCAL] | 0 | M / G | Diário |
| 19 | **Dora Tecelã** | Tudo o que entra (captura, erro, PDF, carta) recebe sugestão de tópico por BM25 contra o edital e as fichas; o aluno confirma com um toque | Classificação sem IA e sem digitar; é o que mantém o grafo vivo | `rag.js` [NUVEM] | 0 | P | Ids de tópico |
| 20 | **Rede da Dora como espinha** | Ver 3.5 | — | `rag.js` [NUVEM] | 0/1 | M | — |

### Ciclo, cronograma e relatórios

| # | Nome | O que faz | Por que vai além | Onde | IA | Esf. | Depende de |
|---|---|---|---|---|---|---|---|
| 21 | **Dora Agenda Viva** | Ver 3.1 | — | Estúdio [NUVEM]; proxy no porteiro [LOCAL] | 0 | M | — |
| 22 | **Bússola de Pontos** | Minutos por tópico = questões esperadas × (1 − domínio) × relevância, com piso por disciplina e teto diário; substitui o rodízio fixo | Alocação por ganho marginal, explicada na tela | Estúdio (`plano`) [NUVEM] | 0 | P | Diário |
| 23 | **Guarda do Corte** | Vigia os mínimos por bloco (Transpetro: 25/50 específicas, 10/20 gerais, zero elimina em Português e Inglês); se a faixa inferior encosta no corte, o plano reserva tempo para esse bloco | Aluno reprova por corte, não por média; nenhum app vigia isso | Estúdio [NUVEM] | 0 | P | Quadro da prova |
| 24 | **Selo da Sessão** | "Começar" no bloco do Hoje abre o relógio; ao fechar: o que fez, nota de 1 a 5 e a Folha em Branco opcional; grava a sessão no diário | Registro em um toque; sem ele o plano não aprende | Estúdio [NUVEM] | 0 | P | — |
| 25 | **Carta da Manhã** e **Vitral da Semana** | Ver 3.2 | — | Estúdio [NUVEM]; push e e-mail no porteiro [LOCAL] | 0 | M / G | Diário |
| 26 | **Dora Sentinela** | Regras sobre o diário: "erros de leitura sobem depois de 40 min", "3 dias sem Inglês", "acerto frágil alto em Segurança" | Padrões do próprio aluno, com n, sem IA | Estúdio [NUVEM] | 0 | P | Diário |

### Memorização

| # | Nome | O que faz | Por que vai além | Onde | IA | Esf. | Depende de |
|---|---|---|---|---|---|---|---|
| 27 | **Fila Única da Memória** | Uma fila diária que junta Dora Memória, revisões do Caderno de Erros, Baralhos e (leitura) cartas FSRS do Draw; orçamento em minutos, ordenada pela Mira | Hoje são 3 filas; o aluno escolhe a mais fácil | Estúdio [NUVEM] | 0 | M | Grafo |
| 28 | **Horizonte da Prova** | O intervalo máximo de qualquer carta é limitado pela data da prova (teto = metade dos dias restantes); nos últimos 3 dias, só passada final das frágeis | Espaçamento ótimo para uma data, não para a vida toda | Estúdio (`session`, `erSoma`) [NUVEM]; FSRS no Draw [LOCAL] | 0 | P | `arenaTP.prova` |
| 29 | **Rádio de Bolso** | Cartas por voz para trânsito: lê a frente, pausa, lê o verso; botões do fone (MediaSession) marcam lembrei ou errei | Recuperação ativa em tempo morto; usa os buracos "trânsito" da agenda | Estúdio [NUVEM] | 0 (voz do aparelho) | P | `speechSynthesis` |
| 30 | **Pergaminho de Uma Página** | Por tópico: mapa + 3 pegadinhas + macete num SVG para a véspera; no app principal já existem as Pranchas, na cópia pública sai da ficha | Codificação dupla; material de véspera feito do próprio estudo | Estúdio [NUVEM] | 0 (da ficha) | P | `arenaTP.fichas`, `mpSvg` |

### Treino e estratégia de prova

| # | Nome | O que faz | Por que vai além | Onde | IA | Esf. | Depende de |
|---|---|---|---|---|---|---|---|
| 31 | **Dora Ensaio** | Simulado instrumentado: tempo por questão, trocas de resposta (certo→errado), acerto por quarto do tempo (fadiga), ganho do chute por dezena | Sai com estratégia, não só com nota | Doroxandria [NUVEM] / Draw | 0 | M | Diário |
| 32 | **Cartão de Voo** e **Rito da Véspera** | Ordem dos blocos, tempo-alvo e pausas (330 min) vindos do Ensaio; logística (local, documento, horário) como evento .ics com alarme; a partir de D-2 o app esconde conteúdo novo | Dia da prova tratado como desempenho; mercado ignora | Estúdio [NUVEM] | 0 | P | 31 (opcional) |
| 33 | **Tribunal dos Recursos** e **Legado** | Pós-prova: lança as respostas, confere com o gabarito preliminar, estima a nota com os cortes; para cada divergência, a Rede acha o trecho do seu material e a IA rascunha o recurso; prazos em .ics; depois exporta a estrutura para o próximo concurso | Recurso pessoal com fonte; aprendizado que passa de um concurso ao outro | Estúdio [NUVEM] | 1 por recurso | M | Rede, Estruturas da Guilda |

Fora da lista e para depois: **Pacto da Guilda** (compromisso semanal de horas entre os 12 alunos, só "cumpriu / não cumpriu" no porteiro) e **Dora Conector** (MCP).

### 3.1 Dora Agenda Viva (integração com agenda)

**Entrada (três caminhos, do mais simples ao mais cômodo):**
1. **Arquivo .ics** escolhido no app (exportação do Google Agenda, do Outlook, ou compartilhado do iPhone). Lido 100% no aparelho.
2. **Link iCal privado** (Google "endereço secreto em formato iCal", Outlook "publicar calendário", iCloud "calendário público"). O navegador não consegue buscar por causa de CORS, então entra o porteiro: `POST /agenda/ics {codigo, url}` → devolve o texto. Regras do proxy **[LOCAL]**: só `https`, lista de hosts permitidos (`calendar.google.com`, `outlook.office365.com`, `outlook.live.com`, `*.icloud.com`), limite de 1 MB, **não grava nem registra o conteúdo**, conta na cota diária. O link fica só no aparelho (`arenaTP.agenda.fontes`).
3. **Manual:** "compromissos fixos da semana" em uma grade (para quem não usa agenda).

**Leitor (`agenda.js`, sem biblioteca):** desdobra linhas, lê `VEVENT` (`DTSTART/DTEND` com `Z`, `TZID` ou dia inteiro; `DURATION`; `RRULE` com `FREQ=DAILY|WEEKLY`, `BYDAY`, `INTERVAL`, `UNTIL`, `COUNT`; `EXDATE`; `STATUS:CANCELLED`; `TRANSP:TRANSPARENT` = livre). Expande só os próximos 21 dias. Regra não suportada (mensal por posição etc.) vira aviso "confira este evento", nunca falha em silêncio.

**Privacidade:** o app guarda só `{ini, fim, tipo}`. O título é usado na hora para classificar e descartado (opção "guardar títulos" desligada por padrão).

**Classificação por palavra-chave (editável):** `transito` (trânsito, deslocamento, ônibus, metrô, voo, ou evento com `LOCATION` → margem de 30 min antes e depois), `saude` (consulta, médico, exame, fisioterapia → o bloco seguinte é leve), `trabalho`, `fixo`.

**Buracos:** janela acordado (padrão 06:30–22:30, editável por dia da semana) menos eventos, margens, refeições e 10 min entre blocos. Cada buraco recebe um tipo:
- **fundo** (≥ 50 min): tópico novo, PDF, simulado parcial;
- **médio** (25–49 min): questões, Treino Trançado;
- **micro** (10–24 min): Fila Única, Dora Reflexo;
- **trânsito**: Rádio de Bolso, Dora Rádio (sem tela).

**Encaixe:** a fila do ciclo vem da Bússola de Pontos (22). Algoritmo guloso: (1) revisões vencidas nos micros; (2) o tópico de maior ganho no melhor "fundo" do horário de pico do aluno (declarado no onboarding, depois medido pelo diário); (3) nunca dois blocos seguidos da mesma disciplina (intercalação); (4) teto diário de minutos; (5) a Guarda do Corte reserva blocos. Saída: `arenaTP.planoSemana = {gerado, dias:{'2026-11-22':[{id,ini,fim,tipo,top,disc,modo,feito}]}}`.

**Saída .ics:** o app gera `VCALENDAR` com um `VEVENT` por bloco: `UID` estável (`bloco-2026-11-22-1@doraguilda`), `SUMMARY` "Dora · Dados · Normalização (questões)", `URL` com link direto `estudio.html#hoje`, `VALARM` 5 min antes. Dois modos:
- **Baixar / compartilhar** (Web Share com arquivo): importa no celular. Funciona hoje, sem servidor. O alarme do .ics resolve o lembrete sem push.
- **Assinar** (`webcal://`): exige URL pública. `PUT /agenda/plano {codigo, ics}` grava no porteiro e `GET /agenda/<token>.ics` serve com token longo e revogável **[LOCAL]**. Opt-in; contém só nomes de tópicos; apagável. Google reassina em intervalos de horas, então é "plano da semana", não tempo real.

**Replanejar quando o dia falha:** ao abrir o app (ou no botão "meu dia mudou"): blocos passados sem Selo da Sessão vão para a **Dívida**. Regras: redistribui nos buracos livres dos próximos 3 dias, no máximo +20% por dia; o que não couber é **cortado pela ordem inversa da Mira**, com a lista "o que saiu e por quê" na tela; simulados e véspera não se movem; revisões vencidas têm prioridade sobre conteúdo novo. Sem culpa: a tela mostra o novo plano, não o atraso.

### 3.2 Carta da Manhã e Vitral da Semana (relatórios)

Conteúdo. **Carta da Manhã:** plano de hoje (blocos e horários), ontem (minutos, questões, acerto com n, erros por motivo, cartas feitas), uma observação da Sentinela, dias até a prova. **Vitral da Semana / do Mês:** infográfico com horas por disciplina × planejado, mapa do edital (cobertura e domínio com faixa), calibração, top 5 erros recorrentes, Guarda do Corte.

| Opção | Privacidade | Chega sem abrir o app? | Custo / esforço | Limite |
|---|---|---|---|---|
| A. No app (tela ao abrir + selo no ícone) | Total, nada sai | Não | Zero / P | Depende de abrir |
| B. Compartilhar (PNG por Web Share ou baixar; `mailto:` só com texto) | Total; o aluno escolhe o destino | Não | Zero / P | Manual; `mailto` não anexa |
| C. .ics com alarme (3.1) | Total no modo baixar | Sim (lembrete do plano) | Zero / P | Não leva desempenho |
| D. **Push "campainha"**: o cron do porteiro manda push **sem conteúdo** na hora escolhida; o service worker monta a notificação com um resumo que o app deixou no IndexedDB | Alta: o porteiro guarda só a inscrição de push, hora e fuso | Sim | Baixo / M (VAPID no worker) | iOS só com o PWA instalado; resumo é o da última abertura |
| E. **E-mail**: o app sincroniza um resumo agregado e o plano dos próximos 7 dias; cron do Worker envia por provedor transacional | Média: números e nomes de tópicos no D1, e o e-mail é dado pessoal | Sim | Provedor (plano gratuito costuma bastar para 12) / G | LGPD completa; clientes de e-mail removem SVG |

**Recomendação, em degraus:**
1. **Agora [NUVEM]: A + B + C.** Resolve o caso do Ronaldo em 15 dias, sem servidor e sem risco.
2. **Depois [LOCAL]: D.** O melhor custo-privacidade: o dado nunca sai do aparelho.
3. **Por último [LOCAL]: E**, só para quem pedir, com este desenho:
   - Opt-in em duas etapas (liga no app → confirma por link no e-mail).
   - Carga mínima: `{dia, min, q, ok, porDisc[{nome,min,q,ok}], revisoesVencidas, plano[{ini,fim,rotulo}]}`. Sem enunciados, sem notas, sem títulos de agenda.
   - D1: `relatorio_inscricao(codigo, email, hora, fuso, confirmado, token_sair)` e `relatorio_dia(codigo, dia, json)`, com retenção de 35 dias.
   - Rotas: `POST /relatorio/inscrever`, `POST /relatorio/dia`, `GET /relatorio/sair?t=`, `POST /relatorio/apagar`. Cron a cada 15 min envia para quem está na hora local.
   - Sem dado novo há 3 dias: um único e-mail "abra o app para replanejar" e silêncio. Nada de insistência.
   - E-mail em HTML de tabelas com barras em CSS; o infográfico completo (SVG) fica no app, com link.
   - Sem IA no texto: modelo fixo. Custo de IA zero.

### 3.3 PDF: Mesa + novas

Da Mesa: Legenda Viva (1), Carimbos (7), navegação com sumário, miniaturas e busca unificada, Ampulheta (4), áudio com marcadores, transcrição e replay, Teste esta Página (8), exportar PDF anotado e Resumo. **Novas:** Dora Sonda (2), Folha em Branco (3), Lupa da Banca e Fio de Ariadne (5), Tesoura da Guilda (6), Trilha do Avesso (15) e a ligação com a agenda (o buraco "fundo" abre direto no PDF e na página onde parou). Ordem para a sessão local: 4 → 1 → 7 → navegação → 8 → áudio → 9.

### 3.4 Dora Escudeira: modo assistido do Tec, completo

Mantém o fluxo da Mesa G e acrescenta:
1. **Confiança antes do resultado** (a ordem importa para a calibração): alternativa → confiança → o clique no site → leitura do resultado.
2. **Eliminações:** toque longo numa letra do pop-up risca a alternativa; grava quais foram eliminadas e se o gabarito estava entre elas (mede a qualidade da eliminação, não só o acerto).
3. **No erro, 20 segundos de autoexplicação:** "a certa é X porque…" (uma linha) antes de abrir o comentário. Opcional, um toque para pular.
4. **Legista em um toque** (12): papel do distrator escolhido.
5. **Tecelã:** disciplina e assunto do Tec → sugestão de tópico do edital; o aluno confirma uma vez e a regra `assunto do Tec → topicoId` fica guardada.
6. **Metadados da questão:** banca, órgão, ano, cargo (lidos da tela) → alimentam o Dossiê Vivo.
7. **Falha segura:** se o adaptador não ler o resultado, pergunta "acertou?"; se não achar o bloco da questão, guarda só o registro manual. Seletores isolados num arquivo de adaptador com teste.
8. **Ponte da Guilda:** a extensão tem outra origem; para o Estúdio enxergar as respostas, um content script no domínio do site grava o lote do dia via `postMessage` (ou o aluno importa `dora-guilda-evidencias` v1).
9. **Limites:** só a questão aberta pelo aluno, na sessão dele; nada de navegação automática nem coleta em lote; o print fica no aparelho.

### 3.5 Rede da Dora como espinha

1. **Índice por tópico:** cada documento do `rag.js` ganha `top` (id do tópico), preenchido pela Tecelã. `DoraRAG.porTopico(id)` alimenta a Sala do Tópico sem consulta.
2. **Busca do app = Rede:** a paleta Ctrl+K (`cpOpen`) passa a buscar também objetos (página de PDF, grifo, erro, carta) e, sem resultado, oferece "Perguntar à Dora" (`#pergunte`).
3. **Vizinhança sem IA:** "páginas parecidas com este erro", "questões parecidas com esta página", "cartas duplicadas" (mesmo motor BM25).
4. **Toda chamada de IA passa pela Rede** (`aicall(..., {rag})`) e toda resposta cita [F1] com link para página, erro ou ficha. Resposta sem fonte do aluno aparece marcada.
5. **Economia de cota:** cache por hash de (prompt + ids dos trechos) em `arenaTP.dora`; pedido repetido não gasta.
6. **Depois [LOCAL]:** um só índice para Estúdio e Draw (hoje são dois BM25: `rag.js` e `logica6`).

### 3.6 Dossiê Vivo da Banca e Censo da Guilda

- **Do próprio aluno:** cada resposta com `bancaId/orgaoId/ano/topicoId/formato` soma no perfil (2.3). Telas: "O que a Cesgranrio cobra em Dados" (tópicos por participação, com n e anos), "Como cobra" (formatos e papéis de distrator, da Legista), "Onde eu perco" (acerto do aluno × participação), "Este órgão × a banca em geral" (só quando n do órgão ≥ 20; abaixo disso, "amostra pequena").
- **Importado:** `questoes.json`, `inteligencia/incidencia.json` e o dossiê (app principal); CSV/JSON do aluno e Estruturas da Guilda (cópia pública).
- **Censo da Guilda [LOCAL], opt-in:** cada aluno envia só contagens `{banca, orgao, ano, disciplina, topico normalizado, formato, n}`, sem enunciado e sem desempenho. O porteiro só devolve células com contribuição de pelo menos 3 alunos. Doze alunos resolvendo 30 questões por dia formam, em um mês, um perfil que nenhum deles teria sozinho.
- **Regra de conteúdo:** nada vira "regra" sem teste cego e n (norma do `AGENTS.md`). O Dossiê mostra frequência observada; não afirma o que vai cair.

---

## 4. Front-end e UX: um app só

**Princípios:** identidade intacta (tokens, girassol, ícones 3D, 17 temas); a pergunta da tela inicial é "o que faço agora?"; o tópico é o centro; menos menus, mais contexto; celular primeiro; revelação progressiva (o avançado fica dobrado).

### 4.1 Navegação: 5 destinos + 2 gestos globais

| Destino | Rota nova | Absorve |
|---|---|---|
| **Hoje** | `#hoje` (rota padrão) | `home()`, `#plano`, tela Hoje do Draw, Carta da Manhã, Fila Única (resumo), Dívida |
| **Edital** | `#edital`, `#topico/<id>` | `#mira` (vira a ordenação "Onde mirar"), `#config` (vira `#edital/ajustar`), `#mt` (aba "Como cai" da Sala do Tópico), `#lab` e `#radar` (aba "Banca"), Dora Edital do Draw |
| **Treinar** | `#treinar` | `#cq`, `#ref`, `#met`, `#erros`, `#fc` e `#anki` (como "Memória"), Doroxandria, Arena, simulados |
| **Biblioteca** | `#biblioteca` | `#estante`, `#pergunte` (barra no topo), `#mapaia`, `#mm`, `#esq`, `#prancha`, `#v`, `#pod`, Estante do Draw (abre o leitor) |
| **Eu** | `#eu` | `#sim` (Oráculo) + Gêmeo, Vitral, `#agenda`, `#gem`, tema, Cofre, privacidade |

- **"+ Capturar"** (botão central na barra do celular; tecla `C`): erro, questão, nota, foto de página manuscrita, áudio. Cai na Caixa de entrada e a Tecelã sugere o tópico.
- **Paleta** (Ctrl+K ou `/`, já existe): ganha ações ("começar bloco", "registrar erro", "meu dia mudou") e objetos da Rede.
- **Celular:** barra de 72 px com Hoje · Edital · **+** · Treinar · Biblioteca; "Eu" no avatar do topo. **Computador:** o menu lateral `#sb` passa de 9 grupos para esses 5, com os módulos de dentro em segundo nível.
- **Rotas antigas continuam valendo** como atalhos (nenhum link salvo quebra); `guilda.js` ganha um campo de destino por item.
- **Draw dentro da casca:** a segunda tela (`#pn`, iframe `?embed=1`) já existe. O leitor de PDF, a Pena e o Quadro abrem ali por link direto (`draw/index.html#/leitor/<id>?p=`, já usado pela Rede). `draw/ponte.js` (arquivo nosso) pode esconder o menu do Draw quando houver `?embed=1`; o resto é pedido à sessão local.

### 4.2 Telas

1. **Hoje:** faixa "faltam N dias" e Guarda do Corte; linha do tempo com os blocos encaixados na agenda (cada um com "Começar"); "Memória: 34 cartas ≈ 12 min"; resumo de ontem em 3 números; uma observação da Sentinela; "Meu dia mudou".
2. **Edital:** mapa ou lista com 3 medidas por tópico (vale, cobri, domino com faixa); ordenações "Onde mirar", "Ordem do edital", "Menos visto".
3. **Sala do Tópico:** cabeçalho com domínio (n e faixa), tempo investido, próxima revisão. Abas: Como cai · Material (páginas, grifos, Tesoura) · Questões (Sonda, Trançado, Avesso) · Erros · Cartas · Mapa. Ação principal única, que muda com o estado: "Sondar" → "Ler p. 12–30" → "10 questões" → "Revisar".
4. **Treinar:** quatro entradas grandes (Questões, Memória, Erros, Simulado) e, dobrado, Reflexo, Métodos, Arena.
5. **Biblioteca:** "Pergunte à Dora" no topo; materiais com progresso e ritmo; Mapas; acervo.
6. **Eu:** Vitral, Oráculo (um estimador só), Agenda Viva, IA e cota restante, dados e privacidade (exportar tudo, apagar tudo).
7. **Primeiro acesso** (4 passos, pulável): (1) concurso, banca, data; (2) edital por PDF ou texto colado → conferir tópicos; (3) rotina: horas por dia, janela acordado, importar .ics; (4) código de acesso da IA (opcional) → cai no Hoje com o primeiro bloco pronto.
8. **Cartão de Voo / Véspera** (aparece sozinho a partir de D-2) e **Tribunal dos Recursos** (aparece depois da data da prova).

### 4.3 Nomes
Um nome por coisa: "Hoje" (o rótulo "Dora Missão do Dia" vira o título da tela), "Diário de Batalha" e "Caderno de Erros" passam a ser **Caderno de Erros** nos dois apps, "Dora Cartas" (cartões-questão) × "Dora Memória" (flashcards) mantidos, Oráculo e Gêmeo unificados sob **Dora Oráculo**. Registrar em `guilda.js` e `docs/dora-guilda.md`.

---

## 5. Plano em ondas

### Onda 1: Estúdio, agora (21 a 27/11, depois só correções, como manda o `AGENTS.md`)

Ordem por impacto na prova de 06/12. Tudo aditivo: nenhuma chave existente muda de formato.

| # | Item | Guia de implementação | Esf. |
|---|---|---|---|
| 1.1 | **Grafo e diário** | Novo `grafo.js` (`window.DoraGrafo`), carregado em `estudio.html` depois de `rag.js`; incluir em `sw.js` (`SHELL`, nova versão do cache) e na cópia do `publico/construir.py` (já copia `.js`). API: `topicos()` (no app principal: `IDX.disciplinas` + dossiê, id `top:<slug>:<número>`; na cópia pública: `ccGet().disc`, gravando `d.ids[j]` por hash na primeira leitura); `ev(obj)` acrescenta em `arenaTP.eventos` (lista compacta, teto de 8.000, os mais antigos viram soma diária em `arenaTP.eventos.dia`); `dominio(topId)` → `{n, p, lo, hi, ultimo}`; `doTopico(topId)` junta `erGet()`, `fiGet`, `mpAll`, `S.box`, `S.cq.log` e o Draw via `DoraRAG.lerDraw()`. Ganchos de uma linha: `cqLog`, `session` (cartas), `jogoRecord`, botões `data-ok`/`data-no` de `erros()`. | M |
| 1.2 | **Hoje** | Nova função `hoje()` e `case 'hoje'`; `default` do `route()` chama `hoje()` (manter `home()` em `#inicio`). Extrair o cálculo de `plano()` para `planoCalc()` (linhas `rows/ord/plan`) e o de `planoConcurso()` para reutilizar. Blocos vêm de `arenaTP.planoSemana`; sem agenda, usa as horas de `ccGet().horas`. Botão "Começar" = Selo da Sessão: estado em `arenaTP.sessaoAtiva {bloco, ini}`; ao fechar chama `DoraGrafo.ev({k:'ses',…})` e marca `feito`. Atualizar `tb` (barra do celular) e `contUpdate`. | M |
| 1.3 | **Agenda Viva (arquivo .ics, encaixe, exportar, replanejar)** | Novo `agenda.js` (`window.DoraAgenda`): `ler(texto)` → eventos; `expandir(eventos, de, ate)`; `buracos(dia, cfg)`; `encaixar(fila, buracos)`; `gerarIcs(plano)`; `replanejar()`. Rota `#agenda` com `agenda()`: entrada de arquivo, grade da semana, janela acordado, botões "Baixar .ics" e "Compartilhar" (`navigator.share({files:[new File([ics],'plano-dora.ics',{type:'text/calendar'})]})` com queda para download). Chaves: `arenaTP.agenda {fontes[], janela{}, ocupado[{ini,fim,tipo}], atualizado}` e `arenaTP.planoSemana`. Testes de `ler` e `encaixar` em `node --test` (funções puras, sem DOM). O link iCal fica desenhado, à espera da rota do porteiro. | M |
| 1.4 | **Guarda do Corte + Bússola de Pontos** | Em `planoCalc()`: para cada bloco do quadro (`PREV` e os cortes já escritos em `plano()`; na cópia pública, novo campo `min` por matéria em `configConcurso()`/`tabela`), calcular a faixa do esperado com `DoraGrafo.dominio`; se `lo` < corte, reservar no mínimo 25% do dia. Mostrar no Hoje e na Mira. | P |
| 1.5 | **Horizonte da Prova + Fila Única (visão)** | Em `session()` (cartas) e em `erros()` (`rev.prox` via `erSoma`): teto = `max(1, floor(dias até arenaTP.prova / 2))`; no app principal a data é fixa (06/12). Nova `filaHoje()` que soma cartas vencidas (`S.box`), revisões de erros (`rev.prox`) e, só leitura, cartas vencidas do Draw; mostrada no Hoje com tempo estimado (mediana de segundos por carta do diário). | P |
| 1.6 | **Carta da Manhã + Vitral** | Novo `relatorio.js`: `cartaDaManha()` (HTML no Hoje, uma vez por dia: `arenaTP.carta.visto`), `vitral(periodo)` → SVG com `var(--token)`; exportar com o `svgPng(svg,nome)` que já existe; `navigator.share` com o PNG. Rota `#relatorio`. O app também grava o resumo do dia no IndexedDB `dora-guilda` (loja `resumo`), já preparando o push "campainha". | M |
| 1.7 | **Balança da Dora** | Campo de confiança no formulário de `erros()` (`er_c`) e, em `cqSession`, pergunta de 3 botões antes de revelar (teclas 1-2-3 já existem para outra etapa: conferir conflito). Grava `c` no evento. Curva de calibração no Vitral. | P |
| 1.8 | **Sala do Tópico** | `case 'topico'` → `salaTopico(id)`, montada com `DoraGrafo.doTopico`. Aba "Como cai" reutiliza `fichaHtml`/`fiHtml`; "Material" lista páginas e grifos do Draw com link `data-panel="draw/index.html#/leitor/<id>?p=N"`; "Questões" usa `topicQB`. Links da Mira (`mirarow`) e da paleta (`cpOpen`) passam a apontar para `#topico/<id>`. | M |
| 1.9 | **Cartão de Voo e Rito da Véspera** | `case 'voo'` → `voo()`: 330 min divididos pelos blocos de `PREV`, ordem sugerida, pausas, checklist (reaproveita Esquemas → Véspera), logística em `arenaTP.voo`, evento .ics da prova com alarmes (usa `DoraAgenda.gerarIcs`). O Hoje troca de modo quando faltarem 2 dias ou menos. | P |
| 1.10 | **Tecelã, Trançado, Rádio de Bolso, Sentinela** | Só se sobrar tempo até 27/11. `DoraRAG.sugerirTopico(texto)` em `rag.js`; `trancado()` sobre `cqSession`; `radioDeBolso()` com `speechSynthesis` + `navigator.mediaSession`; `sentinela()` com 5 regras fixas em `relatorio.js`. | P cada |

**Para o Ronaldo, nestes 15 dias, o que mais pesa:** 1.2 + 1.3 (dia real, com lembrete no celular), 1.4 (não cair por corte), 1.5 (ver tudo ao menos uma vez antes da prova), 1.9 (dia da prova) e um Dora Ensaio manual nos dois simulados já previstos. O restante é produto de longo prazo e pode ir primeiro para a cópia pública.

### Onda 2: sessão local (dezembro)

| Item | Dono | Observação |
|---|---|---|
| Dora Escudeira (3.4) | extensão | Maior ganho diário de dados; formato `dora-guilda-evidencias` v1 |
| Ampulheta, Legenda Viva, Carimbos | fonte do Draw | Campos opcionais em `sessoes` e `grifos`; IndexedDB v7 aditivo |
| `?embed=1` no Draw e link direto para tópico e leitor | Draw | Para a casca única |
| `/agenda/ics` (proxy) e `/agenda/plano` + `/agenda/<token>.ics` | porteiro | Lista de hosts, sem registro de conteúdo, token revogável |
| Push "campainha" (VAPID, cron) | porteiro + `sw.js` | O `sw.js` do site é [NUVEM] |
| Tribunal dos Recursos | Estúdio [NUVEM] | Depois de 06/12, com o gabarito preliminar |

### Onda 3: produto (2027)
E-mail opt-in (3.2 E), Censo da Guilda, FSRS único nos dois apps, índice único da Rede, Teste esta Página, Olho da Dora, Dora Legista na extensão, Tesoura e Lupa dentro do leitor do Draw, onboarding por PDF do edital, Pacto da Guilda, Dora Conector (MCP), migração de `localStorage` para IndexedDB `dora-guilda`.

---

## 6. Riscos, métricas e o que não fazer

### Riscos

| Risco | Mitigação |
|---|---|
| Mexer no app a 15 dias da prova e quebrar o estudo | Só rotas novas e ganchos de uma linha; congelar em 27/11; testar no celular antes de publicar; nova versão do `sw.js` a cada envio |
| `localStorage` cheio (erros com enunciado + eventos) | Evento compacto, teto e soma diária; aviso aos 80% de uso; IndexedDB na Onda 3 |
| Duas sessões editando formatos | Tudo aditivo e versionado; atualizar `docs/contexto-sessao-nuvem.md` a cada entrega (mão dupla) |
| Leitura de .ics incompleta (regras raras, fusos) | Mostrar o que foi lido para o aluno conferir; aviso em regra não suportada; testes com exportações reais das três origens |
| Proxy de agenda virar proxy aberto | Lista de hosts, só GET, limite de tamanho, exige código, cota |
| Custo de IA | Onda 1 inteira custa zero; IA sempre sob demanda, com cache e contador de cota visível |
| Número que parece promessa | Sempre n e faixa; "pista" com n < 5; o texto nunca diz "vai cair" ou "você passa" |
| LGPD (e-mail, censo, agenda) | Opt-in, mínimo, retenção curta, "apagar tudo" em um toque, política de privacidade antes de abrir aos 12 |
| HTML do Tec mudar | Adaptador isolado e falha segura (pergunta ao aluno) |
| Excesso de recurso novo virar distração | O Hoje mostra uma ação principal; o resto fica dobrado |

### Métricas de sucesso (medidas no aparelho, pelo diário)
- **Adesão ao plano:** blocos com Selo ÷ blocos planejados (meta ≥ 70% na semana).
- **Cobertura ponderada do edital:** soma do peso dos tópicos com n ≥ 5 evidências.
- **Calibração:** distância entre confiança declarada e acerto real (deve cair semana a semana).
- **Reincidência:** erros que voltam depois de revisados (deve cair).
- **Fila em dia:** dias em que a Fila Única zerou.
- **Margem sobre o corte:** faixa inferior do esperado por bloco menos o mínimo.
- **Custo:** pedidos de IA por aluno por dia e proporção servida pelo cache.
- **Produto:** toques até começar a estudar a partir do ícone (meta: 2).

### O que NÃO fazer
1. Não coletar o Tec em massa, não navegar por ele automaticamente, não redistribuir questões nem comentários.
2. Não copiar código, tela ou texto de GoodNotes, UPDF, Bússola, Track ou qualquer app; só ideias gerais com implementação própria.
3. Não pôr chave de IA no cliente; não ativar faturamento do Google sem o Ronaldo pedir.
4. Não mandar dado pessoal ao servidor por padrão; nada de enunciado, nota ou título de agenda no D1.
5. Não rodar IA em lote nem em segundo plano; nada de "resumo automático de tudo".
6. Não criar o quarto agendador de revisão nem o terceiro "Hoje": unificar antes de acrescentar.
7. Não reintroduzir mitos da banca como regra; sem teste cego e n, é hipótese.
8. Não gamificar com sequência punitiva nem notificação insistente; o replanejamento é sem culpa.
9. Não mudar tokens, cores, girassol ou ícones; não editar `draw/` à mão (exceto `ponte.js`).
10. Não lançar recurso grande depois de 27/11: da data em diante, só correção até a prova.
