# Gerenciamento de Projetos e Produtos · Guia Cesgranrio de revisão e fixação

Sete questões em 2023 (54, 55, 65, 67, 68, 69, 70; 14% dos 50 pontos específicos), cinco de PMBOK clássico e duas de ágil; o bloco é decidido por lei seca do PMBOK 6 e do Guia do Scrum 2020, por três contrastes fixos (EAP × rede, M&C transversal × etapa, Scrum × Kanban) e por uma sessão de cálculo (rede, PERT, valor agregado).

## 1. Radar da banca

### 1.1 O que a Cesgranrio cobra nesta disciplina (todos os concursos, 2014–2026)

Base: caderno 04 (98 questões Cesgranrio, 2018–2026, 59 de 2023 em diante; contagens de `txt/indice_04.txt`) e a prova Transpetro 2023 comentada. Coluna 2018: questões da Ênfase 5 de 2018 presentes no caderno (IDs TecConcursos).

| Tópico | Questões no caderno (n e %) | Transpetro 2023 / 2018 | Prioridade |
|---|---|---|---|
| PMBOK 6: grupos e áreas (conceitos gerais) | 5 (5,1%) | 2023: Q55, Q70 · 2018: Q638822 (Infra) | máxima |
| Ciclo de vida, fases, curvas, preditivo × adaptativo | 12 (12,2%) | 2023: Q54 · 2018: Q638987 | máxima |
| EAP | 5 (5,1%) | 2023: Q67 · 2018: Q638983 | máxima |
| Scrum | 17 (17,3%) | 2023: Q65 · 2018: Q638888, Q638891 | máxima |
| Riscos (qualitativa, VME, respostas) | 7 (7,1%) | 2023: Q2695331 (SAP) | alta |
| Aquisições (contratos, processos, acordos) | 6 (6,1%) | 2023: Q2693794, Q2693795 (Administração) | alta |
| Rede, PERT/CPM, caminho crítico, folgas | 7 (7,1%) | 2023: Q2694694 (Infra) · 2018: Q639154 (SAP) | alta |
| Custos e valor agregado | 5 + 3 (8,2%) | 2018: Q638981 | alta |
| Escopo (coletar, definir, validar, controlar) | 3 (3,1%) | 2023: Q2695332 (SAP) · 2018: Q638988 | alta |
| Estruturas organizacionais (matriz) | 1 (1,0%) | 2023: Q69 | alta (caiu na Transpetro) |
| SAFe (PI) e Nexus | 2 (2,0%) | 2023: Q68 | alta (caiu na Transpetro) |
| Kanban (pull, WIP) | 3 (3,1%) | 2023: Q65, Q2695334 (SAP) | alta |
| Integração (termo de abertura, FAE, encerramento) | 3 (3,1%) | 2018: Q638981 | média |
| Gantt | 2 (2,0%) | 2023: Q2695335 (SAP) | média |
| PMO (suportivo, controlador, diretivo) | 1 (1,0%) | nenhuma | média (item 2.6 do edital) |
| Noções introdutórias (projeto, gerenciamento, objetivo) | 5 (5,1%) | 2023: Q2690910 (nível médio) | média |
| Partes interessadas; qualidade; estimativas; MS Project | 2 + 1 + 1 + 1 (5,1%) | 2023: Q2690868 (nível médio) | baixa a média |
| Outros (programas, mitos, decisão em grupo, PDP) | 6 (6,1%) | 2018: Q639150 (SAP) | baixa |
| PMBOK 7 (princípios, domínios, tailoring) | 0 | nenhuma | média (item 2.4; retorno binário) |
| Projeto × produto, MVP | 0 | nenhuma | média (item 2.2) |

Leitura: 33 questões (34%) são PMBOK 6 por grupo e área; 24 (24%) são ferramentas (rede, EAP, valor agregado, Gantt); 20 (20%) são Scrum e Kanban; 12 (12%) são ciclo de vida. Os itens 2.2, 2.4 (na parte da 7ª edição) e 2.6 não têm questão na Transpetro e quase nenhuma no caderno.

### 1.2 O que ela nunca (ou quase nunca) cobra

- PMBOK 7 pela letra (12 princípios, 8 domínios, tailoring): zero questão em 98 do caderno e zero na prova 2023; a banca pergunta com o vocabulário da 6ª. `[sem precedente localizado]`
- ITTO de processo específico em minúcia: duas questões em 98, ambas de 2018 (Q836011, Q637737).
- MS Project operacional: uma questão (linha de base, nível médio). Quantitativa de riscos além do VME: nenhuma. XP, Lean, Crystal, DSDM: nenhuma.
- Gestão de produto e MVP: nenhuma questão Cesgranrio localizada. `[sem precedente localizado]`

### 1.3 O que foi descartado deste guia e por quê

Arranjos organizacionais de PDP (Q620852, Engenharia de Produção 2018) e análise de sensibilidade de viabilidade (Q668120, Administração 2018): outras carreiras. Diagramas de poder/previsibilidade em detalhe (Q3120237, BNDES Engenharia 2024): fica só a matriz poder × interesse. Gerenciamento de programas como disciplina (Q3037551, CNU 2024): fica uma linha na lei seca. Contabilidade de projetos (ênfase SAP/Finanças): outra ênfase.

## 2. Os formatos de questão desta disciplina

### Formato A: definição canônica com distrator vizinho

Como reconhecer: "De acordo com o PMBOK, X é um(a)" com cinco definições de artefatos reais diferentes.

Exemplo real: EAP com a alternativa A "documento que descreve a sequência e as dependências lógicas entre as atividades" contra a D "representação hierárquica do escopo do trabalho, dividido em partes menores e mais gerenciáveis" (Cesgranrio · Transpetro 2023 · Q2695326, questão 67).

Procedimento: (1) classifique o conceito em o quê (escopo), quando (tempo), quanto (custo), e se (risco); (2) elimine as alternativas que respondem a outra pergunta; (3) escolha a que usa a palavra técnica oficial ("hierárquica", "entregas", "pacotes de trabalho").

Erro típico: aceitar a ferramenta correta da família errada (a rede é tão oficial quanto a EAP, mas responde "quando").

### Formato B: processo dado, pergunta o grupo (ou a área)

Como reconhecer: "Faz parte do Grupo de Processos de Planejamento o processo ___"; "a atividade descrita deve ser feita na etapa ___".

Exemplo real: "(A) Verificar e validar escopo (B) Controlar os custos (C) Definir as atividades (D) Realizar análise de stakeholders (E) Realizar análise de lições aprendidas" (Cesgranrio · Transpetro 2023 · Q2695333, SAP). Gabarito C.

Procedimento: leia o verbo. Definir, planejar, criar, estimar, sequenciar, identificar riscos = Planejamento; validar, controlar, monitorar = M&C; identificar partes interessadas e desenvolver o termo de abertura = Iniciação; encerrar e lições aprendidas finais = Encerramento; orientar, gerenciar (qualidade, equipe, comunicações), conduzir aquisições, implementar respostas = Execução.

Erro típico: "identificar" sempre como Iniciação (Identificar os Riscos é Planejamento).

### Formato C: sequência de grupos com M&C como processo de fundo

Como reconhecer: "a sequência correta de tais processos é", com M&C plantado na fila.

Exemplo real: "Iniciação → Planejamento → Execução → Encerramento, e a etapa de Monitoramento e Controle ocorre como um 'processo de fundo', executado durante praticamente todo o tempo do projeto" (Cesgranrio · Transpetro 2023 · Q2695338, SAP). Gabarito A.

Procedimento: (1) risque o que começa por Planejamento (autorização formal = Iniciação); (2) risque o que põe M&C entre duas etapas; (3) risque o que troca grupos por processos de escopo; (4) a que sobra pode até pular Execução (Q55 pulou).

Erro típico: procurar a alternativa "completa" com os cinco grupos; em 2023 nenhuma trazia.

### Formato D: cenário Scrum, pergunta o evento, o papel ou o artefato

Como reconhecer: narrativa curta ("ao final da Sprint o time quis adotar TDD"; "o PO soube que a sprint perdeu o valor") e cinco nomes.

Exemplo real: "A atividade designada no Scrum para discutir tópicos como esses é a reunião de (A) Alinhamento Técnico (B) Inspeção (C) Planejamento (D) Retrospectiva (E) Revisão" (Cesgranrio · CEF 2024 · Q2901980). Gabarito D.

Procedimento: (1) o cenário é sobre PRODUTO (Review, PO, Product Backlog), PROCESSO (Retrospectiva, SM, impedimentos) ou EXECUÇÃO DIÁRIA (Daily, Developers, Sprint Backlog)? (2) elimine nomes que não existem no Guia (Alinhamento Técnico, Scrum Manager, Supervisor de Sprint, Incremental Task); (3) decida pelo verbo do Guia: Review inspeciona o incremento; Retrospectiva planeja melhorias; Daily inspeciona o progresso e adapta o Sprint Backlog; Planning define por quê, o quê e como.

Erro típico: levar o problema ao PO ou ao SM quando o Guia manda tratá-lo na Daily (Q3804752, CEF 2026, gabarito C).

### Formato E: troca de atributos entre dois nomes

Como reconhecer: "Uma diferença marcante entre as duas abordagens é que o Scrum ..., enquanto o Kanban ..."; quatro alternativas invertem os atributos.

Exemplo real: "(A) Scrum utiliza iterações fixas de tempo (sprints), enquanto o Kanban não possui limite de tempo fixo" (Cesgranrio · Transpetro 2023 · questão 65). Gabarito A.

Procedimento: escreva uma linha por método antes de ler (Scrum = sprint + 3 papéis + 5 eventos + 3 artefatos; Kanban = quadro + limite de WIP + fluxo puxado, sem papéis nem iterações obrigatórias) e confira cada metade de cada alternativa.

Erro típico: aceitar "Kanban requer um Product Owner"; no pull, marcar "maximizar o trabalho em andamento" (Q2695334: o pull existe para assumir tarefa nova só quando há capacidade).

### Formato F: escala de autoridade

Como reconhecer: "Caracteriza-se por alto grau de influência do gerente de projeto a matriz ___"; "um EGP com nível de controle baixo tem função de ___".

Exemplo real: matriz forte (Cesgranrio · Transpetro 2023 · Q2695328, questão 69); EGP de controle baixo = "repositório de projetos, lições aprendidas" (Cesgranrio · IPEA 2024 · Q2780672).

Procedimento: monte a escala (funcional < fraca < balanceada < forte < projetizada; suportivo < controlador < diretivo) e conte os verbos de autoridade: fornecer/guardar = baixo; exigir = médio; designar/gerir = alto. Descarte nomes fora da taxonomia ("invertida") ou mistura ("composta").

Erro típico: na Q2780672, marcar E (capacitar, formulários, modelos); a banca deu C (a frase literal do PMBOK para o PMO de suporte).

### Formato G: afirmativas I a IV e curvas do ciclo de vida

Como reconhecer: "considere as afirmações" sobre custo, influência das partes interessadas, risco e custo de mudança ao longo do tempo.

Exemplo real: IPEA 2024 · Q2780680: I custo e mobilização baixos, sobem, caem (V); II influência das partes interessadas cai (V); III risco cresce (F); IV custo das mudanças cresce (V). Gabarito D (I, II e IV).

Procedimento: decore as curvas (custo e pessoal: baixo, pico, baixo; influência, risco e incerteza caem; custo das mudanças sobe) e marque F em qualquer inversão ou causalidade falsa ("o risco diminui como consequência do custo das mudanças", Q3037519).

### Formato H: cálculo (rede, folgas, PERT, valor agregado, VME)

Como reconhecer: tabela de atividades e predecessoras; três valores (VP, VA, CR); três estimativas; probabilidades e valores.

Exemplo real: "A folga total e a folga livre da tarefa R" (Cesgranrio · Transpetro 2023 · Q2694694, Infra); "qual caminho crítico o gerente encontrou?" (Cesgranrio · AgeRIO 2023 · Q2462885).

Procedimento (rede): término mais cedo de cada atividade = maior término das predecessoras + duração; a maior soma final é a duração; o caminho que soma exatamente isso é o crítico (folga zero). Folga total = IMT − IMC; folga livre = menor IMC das sucessoras − TMC. Valor agregado: tudo parte do VA (VA − CR, VA − VP, VA/CR, VA/VP; menor que 1 é ruim).

Erro típico: IDC com VP; folga livre lida como total; caminho com mais atividades em vez do mais longo.

### Formato I: palavra trocada e "NÃO é" (intruso)

Como reconhecer: alternativas quase idênticas diferindo por uma palavra ("incremental e interativa" × "iterativa"; "custo com preço fixo" × "custo reembolsável"), ou quatro frases do PMBOK e uma com restrição absoluta ("e não", "apenas", "independentemente").

Exemplo real: "incremental e iterativa" (Cesgranrio · AgeRIO 2023 · Q2462886, gabarito B); "acordos documentados em contratos, e não em memorandos de entendimento ou pedidos de compra" é o intruso (Cesgranrio · Transpetro 2023 · Q2693795, gabarito D).

Procedimento: leia com o dedo; "iter" é repetição, "inter" é interação; procure a restrição absoluta e teste se o PMBOK restringe.

## 3. Tópico a tópico

### 2.1 Scrum e Kanban

**Peso.** 20 questões no caderno (17 Scrum, 3 Kanban; 20,4%), de 2018 a 2026. Transpetro 2023: Q65 (Ênfase 6), Q2695334 e Q2695337 (SAP). Transpetro 2018 (Ênfase 5): Q638888 (quando ocorre a Retrospectiva), Q638891 (planning poker).

**O que a banca cobra.**
- Guia 2020: framework leve para gerar valor por soluções adaptativas a problemas complexos; iterativo e incremental; a Sprint ocorre "recorrentemente, de forma cíclica, várias vezes, até atingir o escopo" (Q639152, Transpetro 2018 SAP, gabarito D).
- Três pilares: transparência, inspeção, adaptação (Q1720937, BASA 2021; Q639060, Transpetro 2018 SAP; ambas gabarito E). Cinco valores: compromisso, foco, abertura, respeito, coragem.
- Responsabilidades: Product Owner maximiza valor, responde pelo Product Backlog e pela Meta do Produto; é "o papel que foca retorno do investimento e valor para o cliente e decide a prioridade do backlog" (Q3135940, BASA 2024, gabarito D). Scrum Master serve ao time, ao PO e à organização, remove impedimentos, não gerencia backlog. Developers criam e adaptam o Sprint Backlog. Time de até 10 pessoas.
- Eventos e timeboxes: Sprint ≤ 1 mês; Sprint Planning ≤ 8 h (por quê, o quê, como; é a reunião que "define e estima quais tarefas serão executadas no ciclo", Q2902016, CEF 2024, gabarito D; exige o Product Backlog definido e atualizado, Q1176465, UNIRIO 2019, gabarito A); Daily 15 min (dos Developers; onde se identifica o impedimento, Q3804752, CEF 2026, gabarito C); Sprint Review ≤ 4 h (inspeciona o incremento com stakeholders); Sprint Retrospective ≤ 3 h (inspeciona pessoas, processos, ferramentas e DoD; é onde o time decide adotar TDD, Q2901980, CEF 2024, gabarito D). A Retrospectiva fica entre a Review e a Planning da próxima Sprint (Q638888, Transpetro 2018, gabarito B).
- Artefatos e compromissos: Product Backlog e Meta do Produto; Sprint Backlog e Meta da Sprint (é o artefato que "apresenta as próximas execuções", Q3117587, BNDES 2024, gabarito D); Incremento e Definição de Pronto.
- Regras de autoridade: só os Developers alteram o Sprint Backlog durante a Sprint (Q634024, BASA 2018, gabarito C); só o PO cancela a Sprint (Q2780025, IPEA 2024: gabarito D, "o SM, a pedido do PO, encerra a sprint e inicia nova Planning"; o que a banca testou é que a decisão parte do PO e que não se injetam requisitos na sprint em curso); o time, não o PO, determina quais itens do backlog entram na sprint, e o PO não é responsável por prover recursos (Q2695337, Transpetro 2023 SAP, gabarito D).
- Satélites: planning poker 0, 1, 2, 3, 5, 8, 13, 20, 40, 100 (Q638891, Transpetro 2018, gabarito B); estimativa em homens-hora = "tempo ideal" (Q2461453, AgeRIO 2023, gabarito C); seis princípios do SBOK: controle de processos empíricos, auto-organização, colaboração, priorização baseada em valor, time-boxing, desenvolvimento iterativo (Q639149, Transpetro 2018 SAP, gabarito A).
- Kanban: visualizar o fluxo, limitar o WIP, gerir o fluxo (lead time, cycle time, throughput), políticas explícitas, feedback, melhoria colaborativa. Pull: "assumir uma tarefa nova apenas quando houver capacidade" (Q2695334, gabarito E). Escolhe-se Kanban por "limitar o número de tarefas concomitantes" (Q3102744, CEF 2024, gabarito A). Cartões em três murais = "Kanban de Produção" (Q3117586, BNDES 2024, gabarito C). Sem timebox, papéis ou eventos obrigatórios.

**Como ela pergunta.** Formato D (Q2901980, Q2902016, Q3804752, Q2780025); formato E (Q65); formato I (Q2462886); lista de pilares com valores misturados (Q639060, Q1720937); "quem pode" (Q634024).

**Onde ela confunde.** Valor no lugar de pilar ("compromisso, abertura e adaptação"); Review × Retrospectiva; PO no Sprint Backlog, SM gerenciando backlog, time cancelando sprint; Kanban com daily, PO, burndown ou sprint; "maximizar WIP"; "interativa"; nomes inventados.

**Macete.** Produto → PO/Review/Product Backlog; Processo → SM/Retrospectiva; Execução → Developers/Daily/Sprint Backlog. Pilares são três: T-I-A. Kanban LIMITA, nunca maximiza.

**Questão comentada 1.** (Cesgranrio · Transpetro 2023 · questão 65, `txt/prova2023.txt`) "Uma diferença marcante entre as duas abordagens é que o (A) Scrum utiliza iterações fixas de tempo (sprints), enquanto o Kanban não possui limite de tempo fixo. (B) Scrum organiza as tarefas em listas individuais, enquanto o Kanban utiliza burndown charts. (C) Scrum prioriza a entrega a partir dos requisitos acordados em contrato, enquanto o Kanban foca em iterações bem definidas. (D) Kanban enfatiza reuniões diárias, enquanto o Scrum não faz uso. (E) Kanban requer um Product Owner, enquanto o Scrum não tem essa função." **Gabarito: A.** Sprint é timebox; Kanban é fluxo contínuo. B: burndown é do Scrum. C: Scrum não é "por contrato" e Kanban não tem iterações. D: a Daily é do Scrum. E: o PO é do Scrum.

**Questão comentada 2.** (Cesgranrio · IPEA 2024 · Q2780025) O PO soube que uma portaria tornou a sprint em curso sem valor. "(A) o próprio time incorpora os novos requisitos ao backlog do produto e da sprint; (B) o PO insere novas tarefas no backlog da sprint em curso; (C) o SM insere novas tarefas no backlog da sprint; (D) o SM, a pedido do PO, encerra a sprint em curso e inicia uma reunião de planejamento; (E) o time, a pedido do PO, encerra a sprint." **Gabarito: D.** A sprint cuja meta perdeu sentido é cancelada por decisão do PO e segue-se nova Planning. A: o time não injeta requisitos no Product Backlog nem na sprint em curso. B e C: nem PO nem SM mexem no Sprint Backlog. E: o time não cancela a sprint. Observação: pela letra do Guia só o PO cancela; a banca aceitou o SM como executor da decisão do PO.

**Para o Anki.**
- Três pilares do Scrum → transparência, inspeção, adaptação (valores: compromisso, foco, abertura, respeito, coragem).
- Quem altera o Sprint Backlog durante a Sprint → só os Developers. Quem cancela a Sprint → só o PO.
- Review × Retrospectiva → incremento (produto, com stakeholders) × processo (só o Scrum Team).
- Objetivo do pull no Kanban → tarefa nova só quando há capacidade (limitar WIP).

### 2.2 Gestão de projeto versus gestão de produto

**Peso.** Nenhuma questão no caderno sobre a comparação ou sobre MVP; a definição de projeto e de gerenciamento aparece em cinco questões introdutórias (Q3805316 CEF 2026, Q2690910 Transpetro 2023 nível médio, Q2038531 Eletronuclear 2022, Q2461442 AgeRIO 2023). `[sem precedente localizado para projeto × produto e MVP]`

**O que a banca cobra.**
- Projeto: esforço temporário para criar produto, serviço ou resultado único; termina quando os objetivos são atingidos, quando não podem ser, quando a necessidade cessa ou por encerramento. Operação: contínua e repetitiva; suporte e manutenção não são projeto.
- Gerenciamento de projetos: "aplicação de conhecimentos, habilidades, ferramentas e técnicas às atividades do projeto a fim de cumprir os seus requisitos" (Q2690910, gabarito B). Objetivo: gerar valor para o cliente e para as partes interessadas (Q3805316, gabarito E); não é "garantir sucesso absoluto", "eliminar todos os riscos" nem "padronizar método rigidamente seguido".
- Produto: ciclo de vida próprio (introdução, crescimento, maturidade, declínio, retirada) que atravessa vários projetos; sucesso medido por valor e resultado (outcome), não só pela entrega (output). Gerente de projeto responde por escopo, prazo, custo e qualidade; gerente de produto (ou PO) por valor, roadmap, backlog e descoberta ao longo da vida do produto.
- MVP: versão mínima entregue a usuários para validar hipótese e aprender; não é a versão comercial nem vem depois da validação.
- PMBOK 7 traz isso como "sistema de entrega de valor": portfólios, programas, projetos e operações juntos geram valor; outputs viram outcomes e benefícios.

**Como ela pergunta (previsão).** Formato A ("enquanto o projeto é temporário, o produto ___") ou formato I ("NÃO é característica de um projeto").

**Onde ela confunde.** "Produto termina na entrega"; "projeto é contínuo"; "suporte é projeto"; "MVP é a primeira versão comercial completa"; gerente de produto respondendo pelo cronograma.

**Macete.** Projeto tem FIM; produto tem VIDA. Projeto mede entrega; produto mede valor. MVP existe para aprender, não para lançar.

**Questão-modelo (autoral, no formato da banca).** "Um sistema de faturamento recebe, ao longo de dez anos, sucessivas iniciativas de evolução. Sobre gestão de projeto e gestão de produto, é correto afirmar que (A) o produto é temporário e encerra-se quando o projeto entrega a primeira versão. (B) cada iniciativa é um projeto, temporário e com entrega definida, enquanto o produto é gerido continuamente com foco em valor ao longo de seu ciclo de vida. (C) o gerente de produto responde pelo cronograma e pelo orçamento de cada iniciativa. (D) o sucesso do produto é medido exclusivamente por escopo, prazo e custo. (E) a operação de suporte ao sistema é um projeto, pois gera resultado único." **Gabarito: B.** A inverte. C é papel do GP. D é medida de projeto. E: suporte é operação.

**Para o Anki.**
- Projeto × produto → temporário, entrega definida, output × contínuo, ciclo de vida próprio, valor (outcome).
- Objetivo do gerenciamento de projetos (CEF 2026) → gerar valor para cliente e partes interessadas.
- MVP → versão mínima para validar hipótese; não é versão comercial.

### 2.3 Práticas ágeis em escala, portfólio alinhado à estratégia e entregas incrementais com SAFe

**Peso.** 2 questões: Q2695327 (Transpetro 2023, questão 68, PI do SAFe) e Q3117539 (BNDES 2024, Nexus).

**O que a banca cobra.**
- SAFe: configurações Essential, Large Solution, Portfolio, Full. Agile Release Train: time de times, 50 a 125 pessoas (5 a 12 equipes). Program Increment: timebox de 8 a 12 semanas (4 iterações + 1 de inovação e planejamento) em que o ART entrega valor; abre com PI Planning (2 dias) e fecha com System Demo e Inspect & Adapt. A banca cobra a definição: "período fixo de tempo durante o qual um conjunto de equipes entrega ao cliente um valor" (Q2695327, gabarito C).
- Papéis de programa: Release Train Engineer, Product Management, System Architect, Business Owners. Portfólio: Lean Portfolio Management, temas estratégicos, épicos, Lean budgets, value streams (alinhamento à estratégia). Entregas incrementais: cada iteração gera incremento testado; cada PI, valor demonstrável.
- Nexus (Scrum.org): 3 a 9 times Scrum, um Product Backlog; accountability adicional = Nexus Integration Team (um time, com PO, SM e membros); eventos de integração. A banca cobrou o nome: "Time de Integração Nexus" (Q3117539, gabarito E). LeSS: um PO e um backlog para 2 a 8 times. Scrum of Scrums: representantes sincronizam.

**Como ela pergunta.** Formato A: definição de PI com distratores de outros níveis; nome da accountability do Nexus.

**Onde ela confunde.** PI como rituais diários (Daily, Scrum of Scrums), evento de backlog (refinamento), plano detalhado ou planejamento de portfólio; Nexus com cargos inventados ("Dono da Integração", "Nexus Boss"); ART tratado como um time.

**Macete.** PI = caixa de tempo (8 a 12 semanas) + vários times (ART) + valor entregue. Nexus adiciona um TIME.

**Questão comentada.** (Cesgranrio · Transpetro 2023 · Q2695327, questão 68) "O Program Increment (PI) refere-se a um(a) (A) conjunto de rituais diários para sincronizar atividades. (B) evento periódico para revisão e ajuste do backlog do produto. (C) período fixo de tempo durante o qual um conjunto de equipes entrega ao cliente um valor. (D) plano detalhado de entregas de todas as etapas de um projeto em escala. (E) prática de planejamento estratégico para alinhar o portfólio à estratégia." **Gabarito: C.** A: dailies. B: refinamento. D: plano detalhado não é ágil. E: nível de portfólio.

**Para o Anki.**
- PI (SAFe) → timebox de 8 a 12 semanas em que um ART (várias equipes) entrega valor; começa com PI Planning.
- Accountability adicional do Nexus → Nexus Integration Team (um time); Nexus = 3 a 9 times, um Product Backlog.
- ART → time de times, 50 a 125 pessoas; nível Portfolio alinha à estratégia (LPM, épicos, Lean budgets).

### 2.4 PMBOK 7ª edição

**Peso.** Zero questão sobre princípios, domínios ou tailoring no caderno e na prova 2023 (a planilha registra varredura de 168 questões da banca sem nenhum caso). As questões rotuladas "PMBOK" (Q55, Q67, Q70 de 2023) usam o vocabulário da 6ª. `[sem precedente localizado para a 7ª edição]`

**O que decorar.**
- 6ª é baseada em processos (5 grupos, 10 áreas, 49 processos, ITTO); 7ª é baseada em princípios e entrega de valor (12 princípios, 8 domínios, tailoring, modelos/métodos/artefatos). A 7ª não revoga a 6ª.
- Sistema de entrega de valor: portfólios, programas, projetos, produtos e operações formam um sistema que gera valor; governança, funções e ambiente.
- 12 princípios: administração diligente (stewardship); equipe colaborativa; partes interessadas; valor; pensamento sistêmico; liderança; tailoring; qualidade; complexidade; risco; adaptabilidade e resiliência; mudança.
- 8 domínios de desempenho: partes interessadas; equipe; abordagem de desenvolvimento e ciclo de vida; planejamento; trabalho do projeto; entrega; medição; incerteza.
- Chave: "Risco" é princípio (nº 10); o domínio chama-se "Incerteza". Partes interessadas e Equipe existem nos dois lados.
- Tailoring: adaptação deliberada de abordagem, governança e processos ao contexto. Abordagens: preditiva, adaptativa, híbrida.

**Como ela pergunta (previsão).** "Faz parte dos domínios de desempenho ___" com "Risco", "Integração", "Custos", "Aquisições" como iscas; "NÃO é princípio"; números-contraste.

**Onde ela confunde.** Área de conhecimento da 6ª como domínio da 7ª; domínio chamado "Risco"; 10 domínios ou 5 princípios; definição de domínio com redação de princípio.

**Macete.** 12 e 8 (7ª) contra 5, 10 e 49 (6ª). Princípio é verbo de conduta; domínio é área de atividade. O domínio é INCERTEZA.

**Questão-modelo (autoral, no formato da banca).** "Faz parte dos oito domínios de desempenho do PMBOK 7 o domínio de (A) Risco (B) Integração (C) Incerteza (D) Aquisições (E) Custos." **Gabarito: C.** A é princípio; B, D e E são áreas da 6ª.

**Para o Anki.**
- Números do PMBOK 7 × 6 → 12 princípios e 8 domínios × 5 grupos, 10 áreas, 49 processos.
- Os 8 domínios → partes interessadas, equipe, abordagem de desenvolvimento e ciclo de vida, planejamento, trabalho do projeto, entrega, medição, incerteza.
- "Risco" no PMBOK 7 → princípio; o domínio chama-se Incerteza.
- Tailoring → adaptar abordagem, governança e processos ao contexto.

### 2.5 Projetos e a organização

**Peso.** Q2695328 (Transpetro 2023, questão 69); integração ligada a fatores ambientais e patrocinador (Q836006, Liquigás 2018; Q2041450, Eletronuclear 2022); partes interessadas (Q3038514, CNU 2024).

**O que a banca cobra.**
- Estruturas e autoridade do GP (PMBOK 6): funcional (pouca ou nenhuma); matriz fraca (baixa; GP é coordenador ou expedidor); balanceada (baixa a moderada); forte (moderada a alta; GP em tempo integral, equipe quase dedicada); projetizada (alta a quase total; equipe dedicada, GP controla orçamento). Composta: combinação. "Alto grau de influência do GP" = matriz forte (Q2695328, gabarito C); "invertida" não existe.
- FAE × APO. FAE internos: cultura, estrutura, governança, distribuição geográfica, infraestrutura, recursos. FAE externos: mercado, leis e regulação (proteção de dados é externa), padrões, câmbio, inflação, ambiente físico, expectativas e limites de risco das partes interessadas. APO: políticas, procedimentos, modelos, lições aprendidas, informações históricas. Para o termo de abertura, "expectativas das partes interessadas" é FAE (Q836006, gabarito E); políticas, métodos de monitoramento, histórico e lições aprendidas são APO.
- Termo de abertura: autoriza formalmente o projeto e dá autoridade ao GP; emitido pelo patrocinador (Q2041450, gabarito B).
- Parte interessada: "indivíduo, grupo ou organização que pode afetar, ser afetado ou sentir-se afetado por decisão, atividade ou resultado" (Q3038514, gabarito E); inclui terceirizados; positiva ou negativa. Matriz poder × interesse: alto/alto gerenciar de perto; alto poder/baixo interesse manter satisfeito; baixo poder/alto interesse manter informado; baixo/baixo monitorar.
- Programa: projetos relacionados gerenciados de modo coordenado; foca interdependências e "soluções para restrições e conflitos entre os projetos" (Q3037551, CNU 2024, gabarito E). Portfólio: seleção para a estratégia. Gerenciamento de projetos "reduz os conflitos por poder e tem como objetivo as soluções" (Q3120240, BNDES 2024, gabarito C).

**Como ela pergunta.** Formato F (Q2695328); classificar entrada como FAE ou APO (Q836006); definição com restrição falsa ("apenas positivas", "excetuando terceirizados", Q3038514).

**Onde ela confunde.** "Composta" como grau de autoridade; projetizada × matriz forte; lei como fator interno; GP ou "todas as partes interessadas" emitindo o termo; partes interessadas só internas ou só positivas.

**Macete.** Matriz FORTE = gerente FORTE. Fator interno está dentro do muro da empresa. Patrocinador assina, gerente executa.

**Questão comentada 1.** (Cesgranrio · Transpetro 2023 · Q2695328, questão 69) "Caracteriza-se por um alto grau de influência do gerente de projeto a matriz (A) composta (B) fraca (C) forte (D) balanceada (E) invertida." **Gabarito: C.** A: combinação de estruturas. B: pouca autoridade. D: autoridade dividida. E: não existe.

**Questão comentada 2.** (Cesgranrio · Liquigás 2018 · Q836006) "Entre os fatores ambientais da empresa que podem influenciar o termo de abertura estão (A) políticas, processos e procedimentos (B) métodos de monitoramento e relatórios (C) informações históricas (D) lições aprendidas (E) expectativas das partes interessadas." **Gabarito: E.** A, B, C e D são ativos de processos organizacionais (o que a organização produziu e guarda).

**Para o Anki.**
- Escala de autoridade do GP → funcional < fraca < balanceada < forte < projetizada; composta é mistura.
- FAE × APO → cultura, mercado, leis, expectativas das partes interessadas × políticas, modelos, lições aprendidas, histórico.
- Quem emite o termo de abertura → o patrocinador.
- Parte interessada → quem pode afetar, ser afetado ou sentir-se afetado; inclui fornecedores; positiva ou negativa.

### 2.6 Escritório de projetos

**Peso.** 1 questão (Q2780672, IPEA 2024). Nenhuma na Transpetro.

**O que a banca cobra.** PMO padroniza a governança de projetos e compartilha recursos, metodologias e ferramentas. Três tipos: suportivo (controle baixo: consultivo, repositório, modelos, melhores práticas, treinamento, lições aprendidas); controlador (controle médio: suporte e exigência de conformidade com metodologias, modelos, governança); diretivo (controle alto: gerencia os projetos diretamente, designa gerentes que se reportam ao PMO). Funções: recursos compartilhados, metodologia e padrões, treinamento, conformidade, comunicação entre projetos. O GP foca o projeto; o PMO foca programa, recursos compartilhados e padrões.

**Como ela pergunta.** Formato F: nível de controle → função.

**Onde ela confunde.** "Fornecer suporte E exigir conformidade" no nível baixo (é médio); "designar gerentes" no baixo ou médio (é alto); duas alternativas suportivas (Q2780672: a banca preferiu a frase literal do PMBOK, "repositório, lições aprendidas", à "capacitar, formulários e modelos").

**Macete.** Zero autoridade = suportivo; "exige" = controlador; "gerencia, designa" = diretivo.

**Questão comentada.** (Cesgranrio · IPEA 2024 · Q2780672) "Um EGP com nível de controle baixo tem função de (A) fornecer suporte e exigir conformidade, como a adoção de metodologias. (B) designar gerentes de projetos. (C) atuar como repositório de projetos, fornecendo acesso a lições aprendidas. (D) fazer a gestão direta de gerentes subordinados ao EGP. (E) capacitar no uso de ferramentas e prover formulários e modelos." **Gabarito: C.** A: controlador. B e D: diretivo. E: também suportivo, mas sem a palavra-chave "repositório"; a banca a tratou como incompleta.

**Para o Anki.**
- PMO suportivo × controlador × diretivo → apoia (baixo) × exige conformidade (médio) × gerencia e designa gerentes (alto).
- Função literal do PMO de suporte (IPEA 2024) → repositório de projetos e acesso a lições aprendidas.

### 2.7 Modelos e características (ciclos de vida)

**Peso.** 12 questões (12,2%): CEF 2026 (Q3805317, Q3805318), IPEA 2024 (Q2780010, Q2780680), CNU 2024 (Q3037519), Transpetro 2023 (Q2693744, Q2694771, Q2696023, Q2696061, além de Q55 e Q70 classificadas aqui). Transpetro 2023 Ênfase 6: Q54 (cascata; Q2695313 no caderno 06). 2018: Q638987.

**O que a banca cobra.**
- Ciclo de vida: série de fases. Fase: conjunto de atividades logicamente relacionadas que culmina em uma ou mais entregas; tem prazo definido com início, fim ou ponto de controle; nome, número e duração definidos pelas necessidades de gerenciamento, natureza do projeto e área de aplicação; sequenciais, iterativas ou sobrepostas. Não têm "custos semelhantes independentemente do prazo" (Q2693744, gabarito A). Ponto de controle: compara desempenho ao plano para continuar, alterar ou encerrar (Q2694771, gabarito D).
- Curvas: custo e pessoal baixos, pico na execução, queda no fim; influência das partes interessadas, risco e incerteza caem; custo das mudanças sobe (Q2780680 gabarito D; Q2696023 "diminuir o risco e aumentar o custo de mudanças", gabarito C; Q3037519 "aprovação de mudanças mais criteriosa nas fases finais", gabarito B).
- Tipos (PMBOK 6): preditivo (escopo, prazo e custo nas fases iniciais, mudanças gerenciadas com cuidado; Q2780010, gabarito C; EAP na linha de base do escopo e alterável com controle, Q2696061, gabarito A); iterativo (repete ciclos; prazo e custo refinados); incremental (entregas sucessivas); adaptativo (ágil: iterativo e incremental, escopo a cada iteração, engajamento constante); híbrido.
- Cascata: fases sequenciais e lineares, cada uma dependendo da anterior; requisitos congelados (Q54, gabarito E). Restrições a determinar no início: escopo, cronograma, custos, qualidade, recursos (Q638987, gabarito E).
- Quando usar: requisitos estáveis pedem preditivo; voláteis pedem adaptativo. Vantagem do ágil: "maior flexibilidade para lidar com mudanças" (Q2838570, UNEMAT 2024, gabarito D); métodos que trocam documentação e plano prévio por comunicação constante e entrega = ágeis (Q2461442, AgeRIO 2023, gabarito A); para menor tempo de desenvolvimento, "abordagem ágil e iterativa" (Q3038200, CNU 2024, gabarito C).
- Planejamento ocorre "com detalhe no início ou durante as outras fases" (Q3805317, gabarito B); no planejamento o TAP e o business case são detalhados (Q3805318, gabarito B); equipe não precisa ser fixa, riscos não são eliminados.

**Como ela pergunta.** Formato A (cascata ou preditivo pela descrição); formato G (curvas); formato I ("NÃO é pertinente às fases"); formato C quando chama grupos de "etapas do ciclo de vida" (Q2695338).

**Onde ela confunde.** "Iterativa com fases sequenciais permitindo revisões contínuas" (contradição); requisitos durante todo o projeto ou sprints para cascata; risco crescendo; causalidade entre risco e custo; custos de mudança "inexistentes" no início; fases "determinadas pelo orçamento".

**Macete.** Cascata = sequencial, linear, congelado. O que é incerto cai (risco, incerteza, influência); o que é mudança sobe (custo de mudar). Preditivo define cedo; adaptativo define a cada iteração.

**Questão comentada 1.** (Cesgranrio · Transpetro 2023 · questão 54; Q2695313) "O modelo em cascata, em que (A) adota-se a filosofia de que mudanças nos requisitos são inevitáveis. (B) adota-se abordagem iterativa, com fases sequenciais, permitindo revisões e ajustes contínuos. (C) divide-se o projeto em iterações curtas e fixas, chamadas sprints. (D) o levantamento de requisitos é realizado durante todo o projeto. (E) as fases são realizadas de forma sequencial e linear, cada uma dependendo da conclusão da anterior." **Gabarito: E.** A e D: adaptativo. B: contraditória. C: Scrum.

**Questão comentada 2.** (Cesgranrio · Transpetro 2023 · Q2696023, Contabilidade) "Comportamento típico durante o ciclo de vida quanto ao risco e ao custo de mudanças: (A) aumentar o risco e diminuir o custo (B) aumentar ambos (C) diminuir o risco e aumentar o custo de mudanças (D) diminuir ambos (E) não alterar o risco e aumentar o custo." **Gabarito: C.** Risco cai conforme decisões são tomadas; custo de mudar sobe porque há mais trabalho a refazer.

**Para o Anki.**
- Cascata → fases sequenciais e lineares, cada uma depende da anterior; requisitos congelados.
- Curvas → risco, incerteza e influência das partes interessadas caem; custo das mudanças sobe.
- Preditivo × adaptativo → escopo, prazo e custo cedo × escopo a cada iteração (iterativo e incremental).
- O que NÃO caracteriza fases (Transpetro 2023) → "custos semelhantes independentemente do prazo".

### 3 Processos, grupos de processos e áreas de conhecimento

**Peso.** 33 questões (33,7%): conceitos gerais 5; integração 3; escopo 3; cronograma 1; custos 5; qualidade 1; riscos 7; aquisições 6; partes interessadas 2. Com as 24 de ferramentas, 57 questões (58% do caderno). Transpetro 2023 Ênfase 6: Q55, Q67, Q70. 2018 Ênfase 5: Q638988, Q638983, Q638981.

**O que a banca cobra.**
- 5 grupos: Iniciação (2 processos), Planejamento (24), Execução (10), Monitoramento e Controle (12), Encerramento (1) = 49. Grupos não são fases; o único que existe "em intensidades diferentes, durante todo o tempo" é M&C (Q638822, Transpetro 2018 Infra, gabarito E). M&C "monitora, rastreia, revisa o progresso e implementa medidas corretivas" (Q70, gabarito A "controle").
- 10 áreas: Integração 7, Escopo 6, Cronograma 6, Custos 4, Qualidade 3, Recursos 6, Comunicações 3, Riscos 7, Aquisições 3, Partes interessadas 4.
- Emblemáticos: Iniciação = Desenvolver o Termo de Abertura, Identificar as Partes Interessadas. Planejamento = Plano de Gerenciamento, Coletar Requisitos, Definir Escopo, Criar EAP, Definir Atividades (Q2695333, gabarito C), Sequenciar, Estimar Durações, Desenvolver Cronograma, Estimar Custos, Determinar Orçamento, Planejar Qualidade, Recursos, Comunicações, Riscos (identificar, analisar, planejar respostas), Aquisições, Engajamento. Execução = Orientar e Gerenciar o Trabalho, Gerenciar Conhecimento, Gerenciar Qualidade, Adquirir Recursos, Desenvolver e Gerenciar Equipe, Gerenciar Comunicações, Implementar Respostas, Conduzir Aquisições, Gerenciar Engajamento. M&C = Monitorar e Controlar o Trabalho, Controle Integrado de Mudanças, Validar e Controlar Escopo, Controlar Cronograma, Custos, Qualidade, Recursos, Monitorar Comunicações, Riscos, Controlar Aquisições, Monitorar Engajamento. Encerramento = Encerrar Projeto ou Fase (Integração; o grupo de Encerramento só se relaciona com Integração, Q836010, Liquigás 2018, gabarito C).
- Integração: termo de abertura pelo patrocinador; controle integrado de mudanças; no encerramento, "encerrar as contas do projeto" é ação dos critérios de conclusão (Q2041452, Eletronuclear 2022, gabarito C). Monitorar e Controlar o Trabalho tem o registro dos riscos como entrada (Q836011, gabarito B). Escopo novo independente, com equipe e tecnologia distintas, vira novo projeto: desenvolver um project charter (Q638981, Transpetro 2018, gabarito A), mesmo com CPI 1,2 e SPI 1,3.
- Decisão em grupo (PMBOK 5): unanimidade, maioria, pluralidade, ditadura (Q639150, Transpetro 2018 SAP, gabarito B). Restrições: escopo, cronograma, custos, qualidade, recursos, riscos.

**Como ela pergunta.** Formato B (Q2695333), formato C (Q55, Q2695338), formato A ("todo o trabalho requerido, e nada mais" = escopo, Q668117, gabarito B; "contratos e pedidos de compra" = aquisições, Q668111, gabarito C).

**Onde ela confunde.** M&C na fila; grupos como fases; processos de escopo como grupos; "validar escopo" e "controlar custos" como Planejamento; "análise de stakeholders" como Planejamento (identificar é Iniciação); lições aprendidas como Planejamento.

**Macete.** Iniciar = autorizar; planejar = definir; executar = fazer; monitorar e controlar = medir e corrigir (transversal); encerrar = formalizar. Grupo é QUANDO; área é O QUÊ.

**Questão comentada 1.** (Cesgranrio · Transpetro 2023 · Q2695314, questão 55) "Processos realizados sequencialmente a partir da autorização formal. A sequência correta é: (A) Iniciação, Monitoramento, Controle. (B) Iniciação, Planejamento, Encerramento. (C) Planejamento do Escopo, Definição do Escopo, Encerramento do Escopo. (D) Planejamento, Execução, Monitoramento e Controle. (E) Monitoramento e Controle do Escopo, Execução do Escopo, Iniciação do Escopo." **Gabarito: B.** Começa na Iniciação e respeita a ordem, mesmo pulando Execução. A: M&C como etapas. C e E: processos de escopo no lugar de grupos. D: sem Iniciação.

**Questão comentada 2.** (Cesgranrio · Transpetro 2023 · Q2695333, SAP) "Faz parte do Grupo de Planejamento: (A) Verificar e validar escopo (B) Controlar os custos (C) Definir as atividades (D) Realizar análise de stakeholders (E) Realizar análise de lições aprendidas." **Gabarito: C.** A e B: M&C. D: Iniciação. E: Encerramento.

**Para o Anki.**
- Números do PMBOK 6 → 5 grupos, 10 áreas, 49 processos (2, 24, 10, 12, 1).
- Grupo que existe durante todo o projeto → Monitoramento e Controle (fundo, não etapa).
- Único grupo ligado só à Integração → Encerramento.
- "Definir as atividades" → Planejamento; "validar escopo" e "controlar custos" → M&C.

### 3 · Escopo e EAP

**Peso.** 3 de escopo + 5 de EAP (8,2%): Transpetro 2023 (Q2695332 SAP; Q2695326 = Q67), Petrobras 2018 (Q619449), Transpetro 2018 (Q637737; Q638983 e Q638988 Ênfase 5), Liquigás 2018 (Q668117, Q836007).

**O que a banca cobra.**
- Seis processos: Planejar o Gerenciamento do Escopo; Coletar Requisitos (mapear expectativas das partes interessadas; Q2695332, gabarito A); Definir o Escopo (descrição detalhada; declaração do escopo); Criar a EAP (decomposição hierárquica); Validar o Escopo (M&C: aceitação formal das entregas; antes de passar de fase, Q638988, gabarito E); Controlar o Escopo (M&C: evitar desvios não autorizados).
- EAP: decomposição hierárquica do escopo total em entregas e pacotes de trabalho; componentes são produtos, serviços ou resultados verificáveis (Q619449, gabarito C; Q836007, gabarito E); nível mais baixo = pacote de trabalho; regra dos 100%; ferramentas: decomposição e opinião especializada (Q637737, gabarito A); dicionário da EAP; linha de base do escopo = declaração + EAP + dicionário. Pode ter profundidade diferente por ramo; inclui subprojetos contratados; pacotes não ficam obrigatoriamente no segundo nível. Contém escopo e entregas (Q638983, gabarito B), não riscos, orçamento, premissas ou equipe.

**Como ela pergunta.** Formato A (Q2695326, com a rede como distrator nº 1); associação atividade × etapa (Q2695332); cenário de passagem de fase (Q638988).

**Onde ela confunde.** EAP como sequência e dependências; "entregas e ATIVIDADES"; descrição detalhada atribuída a Criar a EAP; "evitar desvios" atribuído a Validar; "alinhar com o solicitado" atribuído a Definir; mesma profundidade em todos os ramos.

**Macete.** EAP responde "o quê" em hierarquia de entregas; se fala de tempo, sequência, custo ou risco, não é EAP. Coletar → Definir → Criar EAP (Planejamento); Validar (aceitar) e Controlar (impedir desvio) são M&C.

**Questão comentada 1.** (Cesgranrio · Transpetro 2023 · Q2695326, questão 67) "A EAP é um(a) (A) documento que descreve a sequência e as dependências lógicas entre as atividades. (B) plano estratégico com objetivos, metas e estratégias. (C) análise detalhada dos riscos, com probabilidade e impacto. (D) representação hierárquica do escopo do trabalho, dividido em partes menores e mais gerenciáveis. (E) técnica de estimativa de custos por recursos humanos e materiais." **Gabarito: D.** A: rede. B: termo de abertura. C: registro de riscos. E: estimativa bottom-up.

**Questão comentada 2.** (Cesgranrio · Transpetro 2023 · Q2695332, SAP) "Associa-se corretamente: (A) Mapear as expectativas das partes interessadas, na Coleta de Requisitos. (B) Criar hierarquia visual das entregas e atividades, no Controle do Escopo. (C) Criar descrição detalhada do escopo, na Criação da EAP. (D) Monitorar mudanças evitando desvios não autorizados, na Verificação do Escopo. (E) Garantir alinhamento com o solicitado pelas partes interessadas, na Definição do Escopo." **Gabarito: A.** B: Criar EAP (e de entregas). C: Definir. D: Controlar. E: Validar.

**Para o Anki.**
- EAP → decomposição hierárquica do escopo em entregas e pacotes de trabalho; distrator nº 1: diagrama de rede.
- Regra dos 100% e pacote de trabalho → todo o trabalho e nada além; nível mais baixo onde se estimam custo e duração.
- Validar × Controlar escopo → aceitação formal (fecha a fase) × impedir desvios não autorizados.
- Linha de base do escopo → declaração + EAP + dicionário.

### 3 · Cronograma, rede, caminho crítico, folgas, PERT e Gantt

**Peso.** 11 questões (11,2%): CEF 2026 (Q3805315), CNU 2024 (Q3037439, Q3037543), UNEMAT 2024 (Q2838564), AgeRIO 2023 (Q2462885, Q2462889), Transpetro 2023 (Q2694694 Infra; Q2695335 SAP), BASA 2021 (Q1721035), Petrobras 2018 (Q619445), Transpetro 2018 (Q639154 SAP). É onde a banca calcula.

**O que a banca cobra.**
- Processos: Planejar, Definir Atividades, Sequenciar (MDP: TI, II, TT, IT; antecipações e esperas), Estimar Durações, Desenvolver o Cronograma (caminho crítico, nivelamento, compressão por crashing e fast tracking), Controlar.
- Estimativas: análoga (projeto anterior como base); paramétrica (algoritmo estatístico com dados históricos e parâmetros, Q3037543, gabarito E); bottom-up; três pontos: triangular (O + M + P)/3 e Beta (O + 4M + P)/6 (Q2462889, gabarito C).
- Rede: identifica o caminho mais longo, que determina a duração mínima (Q3805315, gabarito D); não mostra responsabilidades, suprimentos ou custos. Caminho crítico: folga zero; alterar caminho não crítico não muda o crítico até ultrapassá-lo (Q3037439, gabarito E).
- Folga total: atraso sem atrasar o projeto; folga livre: sem atrasar a sucessora; livre ≤ total; crítica = 0 e 0.
- Gantt: barras horizontais cujo comprimento é a duração (Q2695335, gabarito B); serve ao planejamento e à execução, a qualquer porte, compatível com cascata; não é ferramenta de otimização (Q2838564, gabarito B). Linha de base no MS Project: comparar o andamento com a previsão original (Q2690868, gabarito B).

**Como ela pergunta.** Tabela pedindo caminho crítico (Q2462885, Q619445, Q639154), folgas (Q2694694) ou variação do crítico após alteração (Q1721035, Q3037439); definição de técnica (Q3037543); fórmula PERT em código (Q2462889); Gantt com restrições falsas (Q2695335).

**Onde ela confunde.** Caminho com mais atividades; folga livre por total; "folgas no caminho crítico" (são zero); Gantt como otimização ou "só para projetos pequenos"; PERT como média simples; paramétrica confundida com análoga.

**Macete.** Crítico = MAIS LONGO = duração mínima = folga zero. Folga total olha o fim do projeto; livre olha a próxima atividade. Beta: pesos 1-4-1 sobre 6. Gantt desenha, não otimiza.

**Questão comentada 1.** (Cesgranrio · Transpetro 2023 · Q2694694, Infra) Tarefas P, Q, R, S, T, U com 5, 3, 4, 2, 6, 7 dias; P inicial; Q e R dependem de P; S de Q; T de R. "Folga total e folga livre de R: (A) 0 e 0 (B) 0 e 1 (C) 1 e 0 (D) 1 e 2 (E) 2 e 1." **Gabarito: A.** P-Q-S = 10; P-R-T = 15; U isolada = 7. Duração 15; R está no caminho crítico, logo 0 e 0. As demais dão folga a uma atividade crítica; E ainda viola livre ≤ total.

**Questão comentada 2.** (Cesgranrio · AgeRIO 2023 · Q2462885) G 4; H 4 (G); J 8 (G); K 5 (H); L 3 (J); M 2 (H, L); P 7 (K, M); Q 3 (M); S 2 (P, Q). "Caminho crítico: (A) G,H,K,M,P,S (B) G,H,L,M,P,S (C) G,J,K,M,P,S (D) G,J,L,M,P,S (E) G,J,L,M,Q,S." **Gabarito: D.** Términos: G 4; H 8; J 12; K 13; L 15; M = máx(8, 15) + 2 = 17; P = máx(13, 17) + 7 = 24; Q = 20; S = máx(24, 20) + 2 = 26. G-J-L-M-P-S soma 26. A: 24 e viola precedência (K não precede M). B: L depende de J. C: K depende de H. E: via Q dá 22.

**Questão comentada 3.** (Cesgranrio · BASA 2021 · Q1721035) Quadro A: C 5 (início); A 10, B 5, D 5 (após C); E 15 (B); F 15 (A); G 10 (D). Quadro B: A 5, B 10 (início); C 10 (B); D 10 (A); E 15 (C); G 15 (A); F 5 (G). "O caminho crítico perdeu ou ganhou quantos dias?" **Gabarito: B (aumenta 5).** A: C-A-F = 30 (máximo). B: B-C-E = 35 (máximo). Diferença +5. C seria 10; D e E dizem que diminuiu.

**Para o Anki.**
- Caminho crítico → o mais longo; duração mínima; folga zero.
- Folga total × livre → sem atrasar o projeto × sem atrasar a sucessora; livre ≤ total.
- PERT Beta × triangular → (O + 4M + P)/6 × (O + M + P)/3.
- Análoga × paramétrica → projeto anterior como base × algoritmo estatístico com parâmetros.
- Gantt → barras = duração; acompanha execução; NÃO otimiza.

### 3 · Custos e valor agregado

**Peso.** 9 questões (9,2%): CEF 2026 (Q3805293), BNDES 2024 (Q3120239), Eletronuclear 2022 (Q2041444), Petrobras 2018 (Q619446, Q619926), BASA 2018 (Q634018), Liquigás 2018 (Q836008), Transpetro 2018 (Q638981), mais PERT (Q2462889).

**O que a banca cobra.**
- Processos: Planejar, Estimar os Custos, Determinar o Orçamento (linha de base + reservas de gerenciamento), Controlar os Custos (benefício: manter a linha de base atualizada; o esforço principal é analisar "o consumo financeiro e o trabalho realizado com esses gastos", Q836008, gabarito B). Sistema de controle: linha de base, custos reais, divulgação e avaliação (valor agregado), ações corretivas (Q3120239, gabarito D).
- Siglas: VP (orçamento aprovado para o trabalho agendado), VA (orçamento do trabalho concluído), CR (gasto real), ONT (orçamento no término).
- Fórmulas: VC = VA − CR; VPR = VA − VP; IDC = VA/CR; IDP = VA/VP; ENT = ONT/IDC (típico) ou CR + ONT − VA (atípico); EPT = ENT − CR; VNT = ONT − ENT; IDPT = (ONT − VA)/(ONT − CR). Menor que 1 ou negativo = ruim.
- Casos: IDC = 99/110 = 0,9 (Q2041444, gabarito B); VC = 1.000 − 1.200 = −200 mil (Q619446, gabarito A); VP 850, CR 680, VA 720: VPR −130 e VC +40, "atrasado e abaixo do custo" (Q634018, gabarito B); PV 500, EV 440, AC 550: SPI 0,88 e CPI 0,80, "atrasado e acima do orçamento" (Q3805293, gabarito A); IDP 0,875 de tabela (Q619926, gabarito E).

**Como ela pergunta.** Três valores e um índice; três valores e a interpretação; definição de Controlar os Custos.

**Onde ela confunde.** IDC com VP; VC = CR − VA (sinal trocado); "adiantado" com IDP < 1; "acabará dentro do orçamento" como conclusão certa de IDC > 1 (é tendência; Q634018, alternativa E).

**Macete.** Tudo parte do VA: VA − CR é custo; VA − VP é prazo; VA/CR é IDC; VA/VP é IDP. Menos que 1, mal.

**Questão comentada.** (Cesgranrio · CEF 2026 · Q3805293) PV 500, EV 440, AC 550 (mil). "(A) SPI 0,88 e CPI 0,80, atrasado e acima do orçamento (B) SPI 0,88 e CPI 0,80, adiantado e acima (C) SPI 0,88 e CPI 0,80, atrasado e abaixo (D) SPI 0,80 e CPI 1,88, adiantado e acima (E) SPI 0,80 e CPI 1,88, atrasado e acima." **Gabarito: A.** SPI = 440/500 = 0,88; CPI = 440/550 = 0,80; ambos < 1. B e C interpretam errado; D e E dividem errado.

**Para o Anki.**
- VC e VPR → VA − CR; VA − VP; negativo é ruim.
- IDC e IDP → VA/CR; VA/VP; menor que 1 = acima do orçamento / atrasado.
- ENT, EPT, VNT → ONT/IDC; ENT − CR; ONT − ENT.
- Identificar VP, VA e CR → orçamento do agendado; valor do trabalho concluído; despesa real.

### 3 · Riscos

**Peso.** 7 questões (7,1%): IPEA 2024 (Q2780682), CNU 2024 (Q3037723, Q3037743, Q3038525), Transpetro 2023 (Q2695331 SAP), Liquigás 2018 (Q668120, Q836011); mais categorias (Q2838572, UNEMAT 2024).

**O que a banca cobra.**
- Sete processos: Planejar o Gerenciamento; Identificar (primeiro passo concreto, Q3037743, gabarito B; registro dos riscos); Análise Qualitativa (probabilidade × impacto, matriz P×I); Análise Quantitativa (VME, Monte Carlo, árvore de decisão, sensibilidade); Planejar as Respostas (decidir a estratégia de cada risco, inclusive o que vai a contrato: transferir ao cliente, explorar, ignorar; Q2695331, gabarito D); Implementar (Execução); Monitorar (M&C).
- Risco: evento incerto com efeito positivo (oportunidade) ou negativo (ameaça). Ameaças: escalar, prevenir (eliminar, probabilidade zero), transferir (seguro, garantia, contrato), mitigar (reduzir probabilidade ou impacto: protótipo, redundância, monitoramento com plano de contingência preparado, Q3037723, gabarito C), aceitar (ativa: reserva de contingência, Q3038525, gabarito D; passiva: documentar). Oportunidades: escalar, explorar (garantir), compartilhar, melhorar (aumentar chance ou impacto), aceitar.
- VME = Σ probabilidade × impacto: 0,6 × 500 + 0,4 × (−500) = +100 mil (Q2780682, gabarito D).
- Categorias clássicas: externos previsíveis (custo do dinheiro, juros, câmbio, matéria-prima; Q2838572, gabarito C), externos imprevisíveis, internos técnicos, internos não técnicos, legais.

**Como ela pergunta.** Cenário → estratégia nomeada (Q3037723, Q3038525); "em qual etapa" (Q2695331); VME; "primeiro passo" (Q3037743); categoria.

**Onde ela confunde.** Seguro como mitigação (é transferência); reserva como mitigação (é aceitação ativa); prevenir com probabilidade apenas reduzida (prevenir é zero); decidir estratégia na Identificação ou no Monitoramento; explorar × melhorar.

**Macete.** Identificar LISTA; qualitativa ORDENA; quantitativa CALCULA; planejar DECIDE; implementar EXECUTA; monitorar ACOMPANHA. Seguro = transferir; reserva = aceitar; protótipo = mitigar; mudar o plano para zerar = prevenir.

**Questão comentada 1.** (Cesgranrio · Transpetro 2023 · Q2695331, SAP) Estratégias para informar se cada risco deve constar em contrato: transferido ao cliente, explorado como oportunidade ou ignorado. "Etapa: (A) Análise de Riscos (B) Identificação (C) Monitoramento e Controle (D) Planejamento de Respostas (E) Implementação das Respostas." **Gabarito: D.** Transferir, explorar e aceitar são estratégias; escolhê-las é Planejar as Respostas. A ordena e quantifica; B lista; C acompanha; E executa.

**Questão comentada 2.** (Cesgranrio · CNU 2024 · Q3038525) "A estratégia de aceitação do risco relaciona-se a (A) passar responsabilidade e propriedade do risco a terceiro. (B) desenvolver um protótipo para reduzir o risco. (C) pagar prêmio a terceiro que assuma a ameaça, como seguro. (D) estabelecer reserva de contingência de tempo, dinheiro ou recursos para a ameaça, caso ocorra. (E) alterar o plano para eliminar inteiramente a ameaça." **Gabarito: D.** A e C: transferir. B: mitigar. E: prevenir.

**Para o Anki.**
- Respostas a ameaças → escalar, prevenir, transferir, mitigar, aceitar; a oportunidades → escalar, explorar, compartilhar, melhorar, aceitar.
- Seguro → transferir; reserva de contingência → aceitar; protótipo ou redundância → mitigar; mudar o plano para zerar → prevenir.
- Onde se decide se o risco vai a contrato ou será explorado → Planejar as Respostas.
- VME → Σ probabilidade × impacto (prejuízo negativo).

### 3 · Aquisições, qualidade e partes interessadas

**Peso.** Aquisições 6 (6,1%): Transpetro 2023 (Q2693794, Q2693795, Administração), Petrobras 2018 (Q619338, Q619339, Q620920), Liquigás 2018 (Q668111). Qualidade 1 (Q836009). Partes interessadas 2 (tratadas em 2.5).

**O que a banca cobra.**
- Aquisições (PMBOK 6): Planejar (fazer ou comprar, tipo de contrato, critérios; benefício: determinar quanto e o que contratar, Q619339, gabarito B); Conduzir (obter propostas, selecionar o fornecedor, assinar; Q619338, gabarito E; "em qual processo o gerente seleciona o vendedor" = Conduzir, Q620920, gabarito B); Controlar (administrar, mudanças, encerrar; a 5ª tinha Encerrar as Aquisições). Acordos podem ser contrato, SLA, memorando de entendimento, pedido de compra; "documentados em contratos, e não em memorandos ou pedidos" é falso (Q2693795, gabarito D). Administrar contratos e pedidos de compra = aquisições (Q668111, gabarito C).
- Contratos: preço fixo (PFG, PFRI, PF-AEP) para escopo bem definido, risco no vendedor; custos reembolsáveis (CMRF, CMRI, CMRC) quando o escopo não está definido e há mudanças previstas, risco no comprador (Q2693794, gabarito B); tempo e material (híbrido). "Custo com preço fixo" e "preço reembolsável" são inventados.
- Qualidade: Planejar, Gerenciar, Controlar. Sete ferramentas: causa e efeito (Ishikawa), fluxograma, folha de verificação, Pareto (frequências da maior para a menor), histograma, gráfico de controle, dispersão (relaciona duas variáveis, Q836009, gabarito A).
- Partes interessadas: Identificar (Iniciação), Planejar, Gerenciar (Execução), Monitorar o Engajamento (M&C); níveis desinformado, resistente, neutro, apoiador, líder.

**Como ela pergunta.** Cenário de contrato antes do escopo fechado (formato A); "NÃO é próprio" (formato I); "em qual processo seleciona o vendedor" (formato B); ferramenta da qualidade pela descrição.

**Onde ela confunde.** Preço fixo para escopo indefinido; nomes híbridos inventados; Planejar como o processo que seleciona fornecedor; acordo "só por contrato"; Pareto × histograma; dispersão × Ishikawa.

**Macete.** Escopo fechado → preço fixo (risco do vendedor); aberto → custo reembolsável (risco do comprador). Planejar decide; Conduzir seleciona; Controlar administra. Dispersão = duas variáveis; Pareto = ordenado; Ishikawa = causas.

**Questão comentada.** (Cesgranrio · Transpetro 2023 · Q2693794, Administração) Contratações antes de o escopo estar definido, com mudanças significativas previstas. "Contrato apropriado: (A) custo com preço fixo (B) custo reembolsável (C) preço fixo (D) preço fixo com remuneração de incentivo (E) preço reembolsável." **Gabarito: B.** C e D exigem escopo definido; A e E não existem.

**Para o Anki.**
- Contrato para escopo indefinido × definido → custos reembolsáveis (risco no comprador) × preço fixo (risco no vendedor).
- Processos de aquisições → Planejar (decide) → Conduzir (seleciona e assina) → Controlar (administra e encerra).
- Acordos podem ser → contrato, SLA, memorando de entendimento, pedido de compra.
- Dispersão × Pareto × Ishikawa → duas variáveis × frequências ordenadas × causas.

## 4. Pares e pegadinhas da disciplina

| O par que a banca confunde | A distinção que resolve | Fonte ou [inferido] |
|---|---|---|
| Grupo de processos × área de conhecimento | Grupo é QUANDO; área é O QUÊ | Q2695333, Q836010 |
| Grupo × fase do ciclo de vida | Grupos repetem-se em cada fase e não são estanques | Q638822, Q2693744 |
| M&C transversal × M&C como etapa | Processo de fundo o tempo todo; nunca entra na fila | Q2695338, Q2695314 |
| Iniciação × Planejamento como início | A fila começa na Iniciação (termo de abertura) | Q2695314 |
| EAP × diagrama de rede | ESCOPO em ENTREGAS (hierarquia) × ATIVIDADES no tempo (sequência) | Q2695326 |
| EAP de entregas × de atividades | Componentes são produtos, serviços ou resultados verificáveis | Q619449, Q836007 |
| Coletar requisitos × Definir escopo | Expectativas das partes interessadas × descrição detalhada | Q2695332 |
| Validar × Controlar escopo | Aceitação formal × impedir desvios não autorizados | Q2695332, Q638988 |
| Risco × custo da mudança no tempo | Risco CAI; custo da mudança SOBE | Q2696023, Q2780680 |
| Preditivo × adaptativo | Escopo, prazo e custo cedo × escopo a cada iteração | Q2780010, Q2696061 |
| Iterativa × interativa | Repetição × interação; Scrum é iterativo e incremental | Q2462886 |
| Matriz fraca × balanceada × forte × projetizada | Autoridade do GP crescente; composta é mistura; invertida não existe | Q2695328 |
| FAE × APO | Cultura, mercado, leis, expectativas × políticas, modelos, lições aprendidas | Q836006 |
| Patrocinador × gerente (termo de abertura) | Patrocinador emite; GP recebe autoridade | Q2041450 |
| PMO suportivo × controlador × diretivo | Apoia × exige conformidade × gerencia e designa | Q2780672 |
| Projeto × operação | Temporário e único × contínua e repetitiva; suporte é operação | Q2038531, [inferido] |
| Projeto × produto | Temporário, mede entrega × contínuo, mede valor | [inferido, item 2.2] |
| Pilares × valores do Scrum | Transparência, inspeção, adaptação × compromisso, foco, abertura, respeito, coragem | Q639060, Q1720937 |
| PO × SM | Maximiza valor e ordena o Product Backlog × serve ao time, não gerencia backlog | Q3135940, Q2695337 |
| Product Backlog × Sprint Backlog | PO ordena × só os Developers alteram | Q634024, Q3117587 |
| Review × Retrospectiva | Incremento com stakeholders × processo só com o Scrum Team | Q2901980 |
| Daily × Retrospectiva para impedimentos | Impedimento do dia × melhoria de prática | Q3804752, Q2901980 |
| Cancelar a Sprint | Decisão do PO; ninguém injeta requisito na sprint em curso | Q2780025 |
| Scrum × Kanban | Timebox, papéis, eventos × fluxo contínuo, WIP, quadro | Q65 (2023) |
| Pull × push | Puxa só com capacidade (limita WIP) × empurra | Q2695334 |
| PI × Sprint × Daily | 8 a 12 semanas de vários times × timebox de um time × ritual diário | Q2695327 |
| Nexus Integration Team × cargo | Um TIME de integração | Q3117539 |
| Princípio × domínio (PMBOK 7) | Comportamento (12) × grupo de atividades (8) | [inferido, sem precedente] |
| Risco (princípio) × Incerteza (domínio) | O domínio chama-se Incerteza | [inferido, sem precedente] |
| PMBOK 6 × 7 (números) | 5, 10, 49 × 12, 8 | [inferido, sem precedente] |
| Caminho crítico × caminho com mais atividades | Crítico é o MAIS LONGO | Q2462885, Q619445 |
| Folga total × folga livre | Projeto × sucessora; livre ≤ total | Q2694694 |
| PERT Beta × triangular | (O + 4M + P)/6 × (O + M + P)/3 | Q2462889 |
| Análoga × paramétrica | Projeto anterior × relação estatística | Q3037543 |
| Gantt × CPM/PERT | Barras, não otimiza × rede e caminho crítico | Q2838564, Q2695335 |
| IDC × IDP; VC × VPR | VA/CR × VA/VP; VA − CR × VA − VP | Q2041444, Q3805293, Q619446 |
| Transferir × mitigar × aceitar × prevenir | Seguro × protótipo/contingência × reserva × mudar o plano para zerar | Q3038525, Q3037723 |
| Identificar × Planejar × Implementar respostas | Lista × decide × executa | Q2695331 |
| Preço fixo × custo reembolsável | Escopo fechado (risco do vendedor) × aberto (risco do comprador) | Q2693794 |
| Planejar × Conduzir × Controlar aquisições | Decide × seleciona e assina × administra | Q620920, Q619338 |
| Acordo = só contrato? | Não: SLA, memorando, pedido de compra | Q2693795 |
| Dispersão × Pareto × Ishikawa | Duas variáveis × frequências ordenadas × causas | Q836009 |
| Externo previsível × imprevisível | Câmbio, juros, matéria-prima × desastres | Q2838572 |

## 5. Lei seca e listas (o que precisa estar decorado literalmente)

**Os 5 grupos e o verbo de cada um.** Iniciação (autorizar: termo de abertura, partes interessadas) · Planejamento (definir) · Execução (fazer) · Monitoramento e Controle (medir e corrigir; transversal) · Encerramento (formalizar). Gatilho: "monitorar, rastrear, revisar o progresso e implementar medidas corretivas" = M&C; "a partir da autorização formal" = começa na Iniciação.

**As 10 áreas com o número de processos.** Integração 7 · Escopo 6 · Cronograma 6 · Custos 4 · Qualidade 3 · Recursos 6 · Comunicações 3 · Riscos 7 · Aquisições 3 · Partes interessadas 4 = 49. Por grupo: 2, 24, 10, 12, 1.

**Escopo em ordem.** Planejar → Coletar requisitos (expectativas) → Definir (descrição detalhada) → Criar EAP (hierarquia de entregas) → Validar (aceitação formal) → Controlar (desvios). EAP: entregas verificáveis; pacote de trabalho no nível mais baixo; regra dos 100%; decomposição e opinião especializada; dicionário; linha de base = declaração + EAP + dicionário.

**Riscos em ordem.** Planejar → Identificar → Qualitativa → Quantitativa → Planejar respostas → Implementar → Monitorar. Ameaças: escalar, prevenir, transferir, mitigar, aceitar. Oportunidades: escalar, explorar, compartilhar, melhorar, aceitar. Seguro = transferir; reserva = aceitar; protótipo = mitigar; zerar = prevenir.

**Cronograma.** Caminho crítico = mais longo = duração mínima; folga total = IMT − IMC; folga livre = menor IMC das sucessoras − TMC; Beta (O + 4M + P)/6; triangular (O + M + P)/3; desvio (P − O)/6. Estimativas: análoga, paramétrica, três pontos, bottom-up. Compressão: crashing, fast tracking.

**Valor agregado.** VC = VA − CR · VPR = VA − VP · IDC = VA/CR · IDP = VA/VP · ENT = ONT/IDC ou CR + ONT − VA · EPT = ENT − CR · VNT = ONT − ENT · IDPT = (ONT − VA)/(ONT − CR). VP = "aprovado para o agendado"; VA = "valor do trabalho concluído"; CR = "despesa realizada".

**Contratos.** Preço fixo: PFG, PFRI, PF-AEP (escopo definido; risco do vendedor). Custos reembolsáveis: CMRF, CMRI, CMRC (escopo indefinido; risco do comprador). Tempo e material. Processos: Planejar → Conduzir → Controlar.

**Estruturas por autoridade do GP.** Funcional < matriz fraca (coordenador/expedidor) < balanceada < forte (tempo integral) < projetizada (equipe dedicada). Composta = mistura.

**PMO.** Suportivo (baixo: repositório, modelos, lições aprendidas, treinamento) · Controlador (médio: exige conformidade) · Diretivo (alto: gerencia e designa gerentes).

**Ciclos de vida.** Preditivo · Iterativo · Incremental · Adaptativo · Híbrido. Curvas: custo e pessoal baixo-pico-baixo; influência, risco e incerteza caem; custo das mudanças sobe. Fases: prazo definido, atividades logicamente relacionadas, nome e duração pelas necessidades de gerenciamento; sequenciais, iterativas ou sobrepostas.

**Scrum (Guia 2020).** Pilares: transparência, inspeção, adaptação. Valores: compromisso, foco, abertura, respeito, coragem. PO, SM, Developers (≤ 10). Sprint ≤ 1 mês; Planning ≤ 8 h (por quê, o quê, como); Daily 15 min; Review ≤ 4 h; Retrospective ≤ 3 h. Product Backlog e Meta do Produto; Sprint Backlog e Meta da Sprint; Incremento e Definição de Pronto. Só Developers alteram o Sprint Backlog; só o PO cancela a Sprint; Retrospectiva entre a Review e a próxima Planning. Planning poker: 0, 1, 2, 3, 5, 8, 13, 20, 40, 100. SBOK: controle empírico, auto-organização, colaboração, priorização por valor, time-boxing, desenvolvimento iterativo.

**Kanban.** Visualizar o fluxo · limitar o WIP · gerir o fluxo (lead time, cycle time, throughput) · políticas explícitas · feedback · melhoria colaborativa. Pull: tarefa nova só com capacidade.

**SAFe e escala.** Essential, Large Solution, Portfolio, Full. ART: 50 a 125 pessoas, 5 a 12 times. PI: 8 a 12 semanas (4 + 1); PI Planning 2 dias; System Demo; Inspect & Adapt. RTE, Product Management, System Architect, Business Owners. LPM, temas estratégicos, épicos, Lean budgets. Nexus: 3 a 9 times, Nexus Integration Team. LeSS: 2 a 8 times, um PO.

**PMBOK 7.** 12 princípios: administração diligente, equipe, partes interessadas, valor, pensamento sistêmico, liderança, tailoring, qualidade, complexidade, risco, adaptabilidade e resiliência, mudança. 8 domínios: partes interessadas, equipe, abordagem de desenvolvimento e ciclo de vida, planejamento, trabalho do projeto, entrega, medição, incerteza.

**Listas curtas.** Sete ferramentas da qualidade: Ishikawa, fluxograma, folha de verificação, Pareto, histograma, gráfico de controle, dispersão. Decisão em grupo: unanimidade, maioria, pluralidade, ditadura. Restrições: escopo, cronograma, custos, qualidade, recursos, riscos. Categorias de risco: externos previsíveis, externos imprevisíveis, internos técnicos, internos não técnicos, legais. Definições: projeto = esforço temporário para resultado único; gerenciamento = conhecimentos, habilidades, ferramentas e técnicas para cumprir requisitos; objetivo = gerar valor; parte interessada = pode afetar, ser afetada ou sentir-se afetada; termo de abertura = autoriza e dá autoridade, emitido pelo patrocinador; linha de base = plano aprovado para comparar o andamento.

## 6. Revisão de véspera (checklist)

- Cinco grupos; M&C é fundo, nunca etapa; a fila começa na Iniciação (termo de abertura, patrocinador).
- "Monitorar, rastrear, revisar e corrigir" = controle. Definir atividades, criar EAP, planejar respostas = Planejamento. Validar escopo, controlar custos = M&C.
- 5 grupos, 10 áreas, 49 processos (2, 24, 10, 12, 1). Encerramento só se liga à Integração.
- EAP = hierarquia de ENTREGAS do escopo; distrator = rede. Entregas verificáveis; pacote no nível mais baixo; 100%; decomposição e opinião especializada.
- Coletar (expectativas) → Definir (descrição) → Criar EAP → Validar (aceitação) → Controlar (desvios). Antes de passar de fase: Validar.
- Escopo = todo o trabalho requerido e nada mais.
- Curvas: risco, incerteza e influência caem; custo da mudança sobe; custo e pessoal: baixo, pico, baixo.
- Cascata = sequencial, linear, congelado. Preditivo define cedo; adaptativo define a cada iteração.
- Fases: prazo definido, atividades relacionadas, nome e duração pelas necessidades de gerenciamento; NÃO custos semelhantes.
- Matriz forte = gerente forte; funcional < fraca < balanceada < forte < projetizada; composta é mistura.
- FAE: cultura, mercado, leis, expectativas. APO: políticas, modelos, lições aprendidas.
- PMO: suportivo apoia; controlador exige; diretivo gerencia e designa.
- Scrum: pilares T-I-A; 5 valores; PO, SM, Developers; Sprint ≤ 1 mês, Planning ≤ 8 h, Daily 15 min, Review ≤ 4 h, Retro ≤ 3 h.
- Só Developers alteram o Sprint Backlog; só o PO cancela a Sprint; nada entra na sprint em curso.
- Review = produto; Retrospectiva = processo, entre Review e próxima Planning; TDD vai à Retrospectiva; impedimento vai à Daily.
- Scrum é incremental e ITERATIVO; Sprint é cíclica. Planning poker: 0, 1, 2, 3, 5, 8, 13, 20, 40, 100. Homens-hora = tempo ideal.
- Kanban: quadro, limitar WIP, pull = tarefa nova só com capacidade; nada de "maximizar". Daily, PO e burndown são do Scrum.
- PI = 8 a 12 semanas de um ART; PI Planning. Nexus: 3 a 9 times, Nexus Integration Team.
- PMBOK 7: 12 princípios, 8 domínios; domínio Incerteza, princípio Risco; tailoring; sistema de entrega de valor.
- Projeto temporário mede entrega; produto contínuo mede valor; MVP valida hipótese.
- Caminho crítico = mais longo = duração mínima = folga zero. Folga total (projeto) × livre (sucessora).
- PERT Beta /6 com peso 4 no mais provável; triangular /3. Paramétrica = estatística; análoga = projeto anterior.
- Gantt: barras = duração; não otimiza; serve a qualquer porte e à execução.
- VC = VA − CR; VPR = VA − VP; IDC = VA/CR; IDP = VA/VP; < 1 ruim; ENT = ONT/IDC.
- Ameaças: escalar, prevenir, transferir, mitigar, aceitar. Oportunidades: escalar, explorar, compartilhar, melhorar, aceitar.
- Seguro = transferir; reserva = aceitar; protótipo = mitigar; zerar = prevenir. Estratégia se decide em Planejar as Respostas.
- VME = Σ p × impacto. Câmbio, juros e matéria-prima = externos previsíveis.
- Escopo aberto = custo reembolsável; fechado = preço fixo. Planejar → Conduzir (seleciona) → Controlar.
- Acordos: contrato, SLA, memorando, pedido de compra. Dispersão = duas variáveis; Pareto = ordenado; Ishikawa = causas.
- Decisão em grupo: unanimidade, maioria, pluralidade, ditadura. Restrições: escopo, cronograma, custos, qualidade, recursos, riscos.
- Escopo novo e independente = novo projeto = novo termo de abertura.
- Desconfie de "apenas", "somente", "e não", "independentemente", "sucesso absoluto", "eliminar todos os riscos".

## 7. Fontes usadas

- `cadernos/caderno04.txt`: 98 questões Cesgranrio 2018–2026 (IDs TecConcursos citados); contagens de `txt/indice_04.txt`.
- `txt/prova2023.txt`: Transpetro 2023, Prova 6, questões 54, 55, 65, 67, 68, 69, 70 com resolução e gabarito definitivo; distribuição por bloco.
- `cadernos/caderno06.txt`: ID da questão 54 de 2023 (Q2695313).
- `fontes/planilha_projetos.txt`: Padrão da Banca B2.01 a B2.09, Pares e Pegadinhas, Lei Seca, Resumos.
- `Conteudo_Programatico_Comentado_Transpetro2026.md`, linhas 525 a 610 e 200 a 218.
- `txt/dossie.txt` seção 2.6; `txt/relatorio_docx.txt` seção 3.4.
- Teoria de apoio: Passo Estratégico aula 18 (PMBOK 7), extraída para `txt/passo_18.txt`; TI Total Monitoria 24, extraída para `txt/monitoria24.txt`; PMBOK 6 (tabelas 1-4 e 2-1), Guia do Scrum 2020, Guia do Nexus e documentação do SAFe para as listas da seção 5.
