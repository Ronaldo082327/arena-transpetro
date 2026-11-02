# Engenharia de Software · Guia Cesgranrio de revisão e fixação

Cinco questões em 2023 (23, 24, 25, 31, 32), 10% da prova específica; o bloco é decidido por quatro gestos: classificar requisito pelo verbo, achar a frase decisiva no cenário de teste, rotular o modelo de ciclo de vida pelo adjetivo e escolher o diagrama UML pela descrição textual.

## 1. Radar da banca

### 1.1 O que a Cesgranrio cobra nesta disciplina (todos os concursos, 2014–2026)

Contagens do índice do caderno 06 (193 questões, `txt/indice_06.txt`); a coluna Transpetro indica as questões da Prova 6 de 2023 (ênfase Processos de Negócios) e, entre colchetes, as da prova irmã SAP do mesmo dia e as de 2018, quando o assunto é o mesmo.

| Tópico (assunto do caderno) | Questões no caderno (n e %) | Transpetro 2023 / 2018 | Prioridade |
|---|---|---|---|
| Engenharia de Requisitos | 15 (7,8%) | 2023: Q24 [SAP: RNF organizacional] · 2018: 7 questões (Transpetro + Petrobras) | Máxima |
| Testes de software (conceitos e tipos) | 21 (10,9%) | 2023: Q23, Q31 · 2018: mutação | Máxima |
| Modelos de ciclo de vida (cascata, V, evolucionários, prototipação, outros) | 15 (7,8%) | 2023: Q25, Q54 [SAP: espiral] · 2018: incremental, iterativo, espiral, cascata | Máxima |
| RUP / Processo Unificado | 11 (5,7%) | 2018: elaboração (2x) [SAP 2023: 4+1, lista de riscos, elaboração] | Alta |
| UML | 36 (18,7%) | 2018: casos de uso [SAP 2023: 7 questões] | Alta (por descrição textual) |
| Análise estruturada e OO (técnicas de modelagem) | 3 (1,6%) | 2023: Q32 (sobrecarga) · 2018: nenhuma na ênfase (Liquigás 2018: 2) | Alta (OO) / Média (estruturada) |
| Qualidade de software (V&V, custos da qualidade) | 3 (1,6%) | 2018: custo de prevenção; Petrobras 2018: verificação | Alta (pelo par V&V) |
| Metodologias ágeis (Scrum, XP, TDD, DevOps, Kanban) | 35 (18,1%) | 2023: Scrum × Kanban (bloco Projetos) [SAP: pares, Kanban] | Média em ES (paradigma ágil, TDD, CI); Scrum fica no guia de Projetos |
| Gerência de configuração, Git, CI/CD, build | 10 (5,2%) | nenhuma na ênfase (CEF 2024, CNU 2024, BNDES 2024) | Média |
| Padrões de projeto (GoF) | 16 (8,3%) | nenhuma na ênfase | Descartar (fora do edital 2026) |
| Análise de Pontos de Função | 10 (5,2%) | 2018: 1 (Transpetro) | Baixa (só as 5 funções) |
| IHC / UX / e-MAG / e-PING | 7 (3,6%) | vão para o guia 07 (UX) | Ver guia 07 |
| Conceitos gerais, manutenção, outros | 11 (5,7%) | 2023: Q33, Q58 (UX, classificadas aqui pelo site) | Baixa |

Leitura rápida: tirando ágeis (guia de Projetos) e GoF/APF (fora do edital), sobram cerca de 115 questões úteis, concentradas em requisitos, testes, ciclos de vida (com RUP) e UML por descrição. Em 2023, as cinco questões da ênfase vieram desses assuntos mais um de OO.

### 1.2 O que ela nunca (ou quase nunca) cobra

- Diagrama UML desenhado na ênfase de Processos de Negócios: as 14 questões com figura do caderno são da ênfase SAP, do IPEA ou da UNIRIO. Na sua prova, UML é texto ("qual diagrama usar para...", "qual relação...", "quantas features com visibilidade X").
- Código-fonte para executar ou corrigir (a única questão com Java, UNIRIO 2019 · tec 1176594, pede fidelidade a um diagrama de classes).
- Métricas além do nome das cinco funções da APF (única questão Transpetro: 2018 · tec 638890; em 2023 o assunto sumiu).
- CMMI/MPS.BR, ISO 12207 por processo, ISO 25010 por subcaracterística, OCL e sintaxe formal de UML: zero questões no caderno.

### 1.3 O que foi descartado deste guia e por quê

- Padrões de projeto GoF (16 questões, 8,3% do caderno): o item 5.3 do edital 2026 não cita padrões e nenhuma questão de GoF caiu na ênfase em 2018 ou 2023. Fica uma linha de reconhecimento em 5.3.
- APF além do nome das cinco funções (ALI, AIE, EE, SE, CE): nove das dez questões são de outras ênfases, com cálculo.
- Scrum, Kanban e XP como framework (papéis, eventos, artefatos, práticas): pertencem ao item 2.x e vão no guia de Projetos. Aqui ficam apenas o paradigma ágil (iterativo-incremental, adaptativo), TDD e integração contínua, que o edital coloca em 5.2, 5.4 e 5.5.
- Maven, Jenkins, CVS por comando (5 questões): a banca só cobrou isso em cargos de desenvolvimento (IPEA, UNIRIO, BASA). O que fica é o conceito de build, pipeline e repositório.
- RPA, arquitetura de referência, CX, MTTR (questões de "outros tópicos"): fora dos cinco subitens.

## 2. Os formatos de questão desta disciplina

### Formato A: caso narrativo com uma frase decisiva

Como reconhecer: enunciado de 4 a 10 linhas com personagens ("o chefe acompanhou o diálogo", "uma equipe pretende convidar representantes dos usuários") e pergunta de classificação (qual teste, modelo, diagrama). Quase todo o texto é ruído; uma frase decide.

Exemplo real: (Cesgranrio · BNDES 2024 · tec 3117535). Ao integrar módulos, o comportamento esperado não era alcançado; "as funções individuais... não estavam retornando os resultados esperados, mesmo antes da integração". Gabarito: unidade. O enunciado fala de integração duas vezes para você marcar "integração".

Procedimento:
1. Leia a pergunta final primeiro (o que está sendo classificado).
2. Volte ao texto procurando a frase com o critério da classificação (quem, em que momento, com que objeto; se há repetição, risco, fluxo de pessoas ou de objetos).
3. Responda com ela, ignorando o resto.
4. Confira se a alternativa escolhida não é o "vizinho" da resposta (sistema × aceitação, atividades × colaboração, incremental × iterativo).

Erro típico: responder pelo tema dominante do texto (integração, colaboração, risco mencionado e descartado) em vez de pela frase decisiva.

### Formato B: definição canônica com o distrator vizinho ao lado

Como reconhecer: a banca transcreve uma frase de norma ou de livro (ISO 9000, Sommerville, Pressman) e oferece o conceito-irmão entre as alternativas.

Exemplo real: (Cesgranrio · Petrobras 2018 · tec 619477). "Confirmar, com evidência objetiva, que os requisitos especificados fossem cumpridos." Gabarito: verificação; "validação" está na alternativa D para derrubar.

Procedimento:
1. Identifique a palavra-âncora da definição ("requisitos especificados" = verificação; "uso pretendido" = validação; "orientado por riscos" = espiral; "cada fase concluída antes da próxima" = sequencial).
2. Elimine o vizinho pela âncora oposta.
3. Elimine os que definem outra coisa (auditoria, garantia da qualidade).

Erro típico: trocar o par por associação de som ("validar os requisitos" soa como validação).

### Formato C: lista com negativa em caixa alta (NÃO, EXCETO)

Como reconhecer: "Qual sentença NÃO é um requisito não funcional", "são pares (categoria; exemplo), EXCETO", "NÃO se inclui o seguinte".

Exemplo real: (Cesgranrio · Petrobras 2018 · tec 619483). Quatro RNFs (tempo de espera entre 8 e 15 s, disponibilidade 99,5%, formato conforme legislação municipal, compatível com smartphone) e um RF: "o usuário deve selecionar o cinema". Gabarito: D.

Procedimento:
1. Classifique cada alternativa isoladamente, sem olhar as outras (RF/RNF; estruturado/OO; estático/dinâmico).
2. A única de classe diferente é a resposta.
3. Releia o enunciado para confirmar se pede a exceção ou a regra.

Erro típico: ler "NÃO" como "é" e marcar a primeira alternativa correta que aparece.

### Formato D: qual diagrama ou modelo para o cenário

Como reconhecer: descrição de um comportamento ou de uma necessidade de modelagem; alternativas são nomes de diagramas UML, de modelos de processo ou de técnicas.

Exemplo real: (Cesgranrio · Petrobras 2018 · tec 619478). Casos de uso descreviam como dois gerentes "colaboravam em um fluxo de tarefas" para gerar o relatório anual. Gabarito: atividades. "Colaboravam" empurra para colaboração; "fluxo de tarefas" decide.

Procedimento:
1. Encontre o substantivo que nomeia o que será modelado: fluxo de tarefas, troca de mensagens no tempo, reação a evento, estrutura estática, funcionalidade por ator.
2. Mapeie: fluxo → atividades; mensagens no tempo → sequência; evento assíncrono/ciclo de vida de um objeto → máquina de estados; funcionalidades e atores → casos de uso; estrutura → classes.
3. Descarte o distrator lexical (a palavra do enunciado que parece nome de diagrama).

Erro típico: deixar a palavra do enunciado escolher o diagrama.

### Formato E: pescar o único do grupo (ou o único par) entre quatro famosos

Como reconhecer: o enunciado define um grupo (técnicas estáticas, requisitos funcionais, modelos sequenciais) e a lista traz quatro itens do grupo oposto e um do grupo pedido.

Exemplo real: (Cesgranrio · Transpetro 2023 · Q23 · tec 2695282). "Uma das técnicas mais importantes para a execução de testes estáticos é a de" regressão, walk-through, análise do valor limite, análise de casos de uso, particionamento de equivalência. Gabarito: walk-through.

Procedimento:
1. Rotule mentalmente cada alternativa com o grupo a que pertence.
2. A única com rótulo diferente é a resposta; não é preciso saber a definição completa de cada uma.
3. Em questões de par (Q25), rotule os dois termos de cada alternativa; o par com dois rótulos iguais ao pedido é o único correto.

Erro típico: achar que um item "famoso" (regressão, incremental) pertence ao grupo porque aparece em todas as provas.

### Formato F: cálculo curto

Como reconhecer: um grafo, nós e arestas; ou um total e um número de ocorrências.

Exemplo real: (Cesgranrio · UNEMAT 2024 · tec 2838610). Grafo com 9 nós e 11 arestas: V(G) = 11 − 9 + 2 = 4 caminhos independentes. Gabarito: A.

Procedimento: V(G) = E − N + 2P (P = 1 para um só grafo) = nós de decisão + 1. Erro típico: inverter para N − E + 2.

## 3. Tópico a tópico

### 5.1 Levantamento, análise e gerenciamento de requisitos

**Peso.** 15 questões no caderno (7,8%), além de 1 de prototipação como técnica de validação (BASA 2018). Caiu na Transpetro 2023 (Q24, RF entre RNFs) e na prova SAP do mesmo dia (RNF organizacional, tec 2695418); em 2018, sete questões entre Transpetro (SAP: categorias de RNF, etnografia, QFD, requisitos de produto) e Petrobras (NÃO é RNF; prática da etapa de análise). É o assunto de maior densidade histórica da ênfase.

**O que a banca cobra.**
- Requisito funcional (RF): serviço, função, cálculo ou comportamento que o sistema executa ("o sistema deve permitir/gerar/calcular/cadastrar"; "o usuário seleciona o cinema").
- Requisito não funcional (RNF): restrição sobre o serviço ou sobre o processo de desenvolvimento: desempenho, disponibilidade, segurança, padrão tecnológico, legislação, ambiente. Número, unidade, percentual, nome de padrão ou tecnologia no texto indicam RNF.
- Classificação de Sommerville dos RNFs em três categorias: de produto (usabilidade, eficiência [desempenho e espaço], confiança/confiabilidade, proteção/segurança), organizacionais (ambientais, operacionais, de desenvolvimento: entrega, implementação, padrões da empresa) e externos (reguladores, éticos, legislativos [contábeis, de segurança/proteção]). A banca cobrou a lista de subcategorias duas vezes (SAP 2018: "usabilidade, confiança, proteção e eficiência" são de produto; SAP 2023: "operacionais" é organizacional).
- Requisitos de domínio: derivam do domínio de aplicação, podem ser funcionais ou não (cálculo com fórmula do domínio é funcional).
- Níveis de abstração (Wiegers): requisitos de negócio (visão e escopo; influenciam os de usuário), de usuário (casos de uso, histórias), de sistema/funcionais; regras de negócio são fonte, não requisito.
- Processo de desenvolvimento de requisitos em quatro etapas e suas práticas (Wiegers, cobrado literalmente três vezes): elicitação (definir visão e escopo, identificar usuários, entrevistas, workshops, identificar eventos e respostas), análise (criar protótipos, criar diagrama de contexto, priorizar, modelar, alocar requisitos a subsistemas), especificação (escrever o SRS, registrar regras de negócio, especificar atributos de qualidade, usar linguagem não ambígua), validação (inspecionar o documento, definir critérios de aceitação, escrever casos de teste). Gerenciamento é a quinta disciplina: controle de mudanças, rastreabilidade, baseline, volatilidade.
- Técnicas de elicitação: entrevista (aberta/fechada), questionário, observação/etnografia (imersão do analista no ambiente de trabalho do usuário; descobre requisitos implícitos e "como o trabalho realmente é feito"), JAD/workshop, brainstorming, análise de documentos, cenários e casos de uso, prototipação (também técnica de validação: "demonstrar conceitos, experimentar opções de projeto, descobrir erros e omissões"), QFD (requisitos normais = explícitos e satisfazem; esperados = implícitos, causam insatisfação significativa se faltarem; fascinantes/excitantes = além do esperado, encantam).
- Técnicas de validação: revisão (comentários), walk-through (conduzido pelo autor, informal) e inspeção (processo estritamente definido, em fases, com papéis), prototipação, geração de casos de teste, verificação de consistência automatizada.
- Características de um bom requisito e de um bom SRS: correto, não ambíguo, completo, consistente, verificável/testável, modificável, rastreável, priorizado; critérios de aceitação por requisito melhoram a qualidade da especificação.
- Rastreabilidade: ligação origem → requisito → projeto → código → teste; matriz de rastreabilidade. Volatilidade: requisitos estáveis (derivam do domínio) × voláteis (mutáveis, emergentes, consequentes, de compatibilidade).
- Objetivo da disciplina de requisitos (RUP): entendimento comum com clientes, delimitar o sistema, base para estimar custo e prazo.

**Como ela pergunta.**
- Formato E (pescar o RF entre RNFs): (Cesgranrio · Transpetro 2023 · Q24 · tec 2695283), software de mísseis: a velocidade calculada por v(t) = v0 + at. O inverso em (Cesgranrio · IPEA 2024 · tec 2780428): o único RNF entre quatro funções é "tempo de resposta de até 8 segundos".
- Formato C (NÃO é RNF / EXCETO): (Cesgranrio · Petrobras 2018 · tec 619483) e (Cesgranrio · Transpetro SAP 2018 · tec 639061), em que a isca é uma função rotulada como "usabilidade".
- Formato B (definição de técnica): (Cesgranrio · Transpetro SAP 2018 · tec 639064) etnografia = imersão do analista no ambiente de trabalho do usuário; (tec 639065) QFD, esperados = implícitos.
- Lista de categoria: (Cesgranrio · Transpetro SAP 2023 · tec 2695418) na categoria organizacional estão os requisitos operacionais (legais e reguladores são externos; eficiência e usabilidade, de produto).
- Prática por etapa: (Cesgranrio · Petrobras 2018 · tec 619514) análise → criar protótipos; (Cesgranrio · Liquigás 2018 · tec 835972) especificação → regras de negócio; (Cesgranrio · IPEA 2024 · tec 2780368) validação → critérios de aceitação.

**Onde ela confunde.**
- "A interface deve fornecer imagens por câmeras de alta resolução e infravermelho" começa com verbo de função, mas descreve equipamento e qualidade de interface: a banca tratou como não funcional (Q24, alternativa B).
- Uma função escrita com vocabulário de qualidade: "(usabilidade; o professor lança as faltas)" é RF disfarçado (SAP 2018).
- Legal/regulador (externo) oferecido como organizacional; eficiência (produto) oferecida como organizacional.
- Prototipação aparece em duas etapas: prática de análise (Wiegers) e técnica de validação (Sommerville); decida pelo verbo ("criar protótipos" = análise; "validar, descobrir omissões" = validação).
- "Requisitos de negócio são descobertos a partir dos de usuário": inverso. "Reunião no ambiente do usuário" não é etnografia (é observação, não reunião).

**Macete.** Teste do verbo: pergunte "o sistema FAZ isso?" (RF) ou "o sistema É assim / está sujeito a isso?" (RNF). Número, unidade, percentual, nome de padrão ou tecnologia = RNF. Para a categoria: lei/ética/regulador = externo; política, prazo, padrão ou ambiente da empresa = organizacional; qualidade do software em uso = produto.

**Questão comentada 1.** (Cesgranrio · Transpetro 2023 · Q24 · tec 2695283)
Uma empresa desenvolve software para lançar mísseis de plataformas móveis e rastreá-los; a lista de requisitos foi obtida com técnicos militares. Dentre os requisitos funcionais dessa lista, está o de que
(A) a velocidade planejada de um míssil deve ser calculada segundo a equação v(t) = v0 + at.
(B) a interface com os operadores deve fornecer imagens por câmeras de alta resolução e de infravermelho.
(C) as novas versões do software não poderão ser carregadas nas plataformas enquanto houver mísseis no ar.
(D) o atraso máximo no envio de um comando tem de ser de um milésimo de segundo.
(E) os dados devem trafegar criptografados no padrão AES com 256 bits.
**Gabarito: A.** Um cálculo que o sistema executa é um serviço: funcional (requisito de domínio funcional).
B: descreve o equipamento e a qualidade da interface (resolução, infravermelho): restrição de interface/tecnologia, não função.
C: restrição operacional sobre quando algo pode ser feito (organizacional/operacional).
D: desempenho, número com unidade.
E: segurança, padrão tecnológico nomeado.

**Questão comentada 2.** (Cesgranrio · Transpetro SAP 2018 · tec 639061)
Autores classificam RNFs em de produto, organizacionais e externos, com subdivisões. Para um sistema acadêmico, são pares (categoria; exemplo), EXCETO
(A) (eficiência; os relatórios de notas devem ser impressos em menos de cinco segundos).
(B) (segurança; o sistema deve prover registro de ponto do professor por impressão digital).
(C) (ética; cada trabalho proposto possuirá um único prazo para todos os alunos do curso).
(D) (usabilidade; o professor lança as faltas dos alunos das turmas nas quais leciona).
(E) (ambiental; os servidores devem trabalhar entre 40% e 55% de umidade e 5º a 15º de temperatura).
**Gabarito: D.** "Lançar faltas" é uma função do sistema (RF); rotulá-la como usabilidade é o erro.
A: tempo de resposta é eficiência (produto). Correta como par.
B: autenticação biométrica é proteção/segurança (produto). Correta como par.
C: isonomia entre alunos é requisito ético (externo). Correta como par.
E: condições físicas dos servidores são requisito ambiental (organizacional). Correta como par.

**Questão comentada 3.** (Cesgranrio · Transpetro SAP 2018 · tec 639065)
Ao especificar requisitos, um analista usou QFD. Nessa técnica, os requisitos esperados têm como característica ser
(A) explícitos e causar insatisfação significante se não implementados.
(B) implícitos e causar insatisfação significante se não implementados.
(C) explícitos e causar satisfação se implementados.
(D) implícitos e causar satisfação se implementados.
(E) desconhecidos e causar satisfação significante se implementados.
**Gabarito: B.** Esperados = implícitos (o cliente nem os declara) e sua ausência gera insatisfação forte.
A: explícito é o requisito normal, não o esperado.
C: normais são explícitos e satisfazem quando implementados.
D: implícito + satisfação mistura esperado com fascinante.
E: desconhecidos que encantam = fascinantes (excitantes).

**Para o Anki.**
- RF × RNF, o teste → RF responde "o que o sistema faz"; RNF responde "quão bem / sob que restrição"; número, unidade ou tecnologia nomeada = RNF.
- Categorias de RNF (Sommerville) → produto (usabilidade, eficiência, confiança, proteção) · organizacionais (ambientais, operacionais, de desenvolvimento) · externos (reguladores, éticos, legislativos).
- Etapas do desenvolvimento de requisitos → elicitação → análise → especificação → validação; gerenciamento acompanha tudo (mudança, rastreabilidade, baseline).
- Etnografia → imersão/observação do analista no ambiente de trabalho do usuário; revela requisitos implícitos.
- QFD: normais × esperados × fascinantes → explícitos e satisfazem · implícitos e sua falta insatisfaz · inesperados e encantam.
- Prática de validação de requisitos (Wiegers) → inspecionar o SRS, definir critérios de aceitação, escrever casos de teste; "criar protótipos" e "diagrama de contexto" são análise.

### 5.2 Ciclo de vida de sistemas e seus paradigmas

**Peso.** 15 questões de modelos de ciclo de vida (cascata 2, evolucionários 6, prototipação 3, outros 4) + 11 de RUP + 4 de princípios ágeis + 3 de TDD + 3 de DevOps (as de Scrum/XP/Kanban ficam no guia de Projetos). Transpetro 2023: Q25 (sequenciais) e Q54 (cascata, no bloco de Projetos); SAP 2023: espiral orientado por riscos, elaboração do UP, lista de riscos, 4+1. Transpetro 2018: elaboração (2x), incremental × iterativo, espiral, cascata, características do UP.

**O que a banca cobra.**
- Cascata (clássico, linear): fases sequenciais, cada fase depende da conclusão da anterior, documentação ao fim de cada fase; adequado quando os requisitos são bem conhecidos e estáveis; mudanças são caras. Ciclo de vida preditivo: escopo, prazo e custo fixados no início (UNIRIO 2019).
- Modelo V: extensão da cascata; cada estágio de desenvolvimento tem um nível de teste correspondente (requisitos ↔ aceitação, projeto de sistema ↔ sistema, projeto detalhado ↔ integração, codificação ↔ unidade). Sequencial como a cascata.
- Incremental: divide o sistema em incrementos (fatias de funcionalidade); cada incremento é uma versão operacional entregue ao cliente, que acrescenta funcionalidades à anterior; "versões sucessivas e cada vez mais completas"; combina cascata aplicada de forma iterativa, filosofia usada nos ágeis.
- Iterativo: todo o sistema desde o início, com baixa fidelidade, refinado a cada ciclo até a fidelidade máxima. Incremental × iterativo é o par-isca; "interativo" com R é erro de grafia plantado.
- Evolucionário (Sommerville): especificação, desenvolvimento e validação intercalados; prototipação evolucionária (o protótipo vira o sistema) × descartável (só esclarece requisitos).
- Espiral (Boehm): dirigido a riscos; quatro quadrantes por ciclo (definir objetivos/alternativas/restrições → avaliar alternativas e identificar e resolver riscos → desenvolver e verificar o produto do nível → planejar o próximo ciclo); a análise de riscos precede a construção do protótipo em todo ciclo; se os riscos forem mitigados, a próxima etapa começa; o primeiro ciclo produz o conceito de operação.
- RAD: equipes paralelas, prazo curto (60–90 dias); CBD: montagem de componentes reutilizáveis.
- Processo Unificado (RUP): iterativo e incremental, dirigido por casos de uso, centrado na arquitetura, com foco em riscos. Quatro fases: Concepção (escopo, caso de negócio, viabilidade, visão), Elaboração (entender o domínio, definir e validar a arquitetura, eliminar os maiores riscos, plano detalhado; marco = arquitetura executável), Construção (implementar e testar; marco = capacidade operacional inicial), Transição (implantar, treinar; marco = release). Nove disciplinas: seis de engenharia (modelagem de negócios, requisitos, análise e design, implementação, teste, implantação) e três de apoio (configuração e mudanças, gerência de projeto, ambiente). Requisitos atua em todas as fases; a lista de riscos é artefato da gerência de projeto. Visão 4+1 (Kruchten): lógica, de processo (concorrência, paralelismo), de implementação, de implantação e casos de uso (+1). Cada iteração produz um sistema parcial, testável e integrável; UP não é alternativa ao ágil.
- Paradigma ágil: iterativo e incremental, adaptativo, entrega frequente; agilidade = reagir e se adaptar a mudanças mais rápido que a taxa das mudanças (Eletronuclear 2022); Manifesto: 4 valores e 12 princípios ("software funcionando é a medida primária de progresso"; "simplicidade: maximizar o trabalho não feito"). Preditivo × adaptativo.
- XP como paradigma: programação em pares (inspeção em tempo real melhora a qualidade do código), TDD (teste antes do código), integração contínua, refatoração, propriedade coletiva.
- DevOps/CI/CD em nível conceitual (detalhado em 5.5): integração contínua, entrega contínua, implantação contínua, pipeline, shift-left testing.

**Como ela pergunta.**
- Formato E com par: (Cesgranrio · Transpetro 2023 · Q25 · tec 2695284) "processos sequenciais, cada fase concluída antes do início da próxima": em V e em cascata.
- Formato B: (Cesgranrio · Transpetro SAP 2023 · tec 2695362) "orientado por riscos: se todos os riscos forem mitigados, a próxima etapa será iniciada": espiral; (Cesgranrio · IBGE 2016 · tec 401544) "extensão da cascata, cada estágio de verificação tem um correspondente de validação": V; (Cesgranrio · Transpetro SAP 2018 · tec 639059) "todas as funcionalidades com fidelidade baixa, aumentando a fidelidade por ciclos": iterativo.
- Formato A: (Cesgranrio · Petrobras 2018 · tec 619485) diálogo diretor/usuário/desenvolvedor; frase decisiva "versões sucessivas e cada vez mais completas" + "não contem nada para o especialista em risco": incremental (não espiral).
- Condição de uso: (Cesgranrio · Transpetro SAP 2018 · tec 639058) cascata só se "os requisitos são bem conhecidos"; (Cesgranrio · Transpetro 2023 · Q54 · tec 2695313) cascata = fases sequenciais e lineares, cada uma dependendo da anterior.
- RUP por fase: (Cesgranrio · Transpetro 2018 · tec 638883) elaboração → definir a arquitetura; (Cesgranrio · Transpetro SAP 2023 · tec 2695361) domínio + arquitetura + riscos → Elaboration; (Cesgranrio · CEF 2024 · tec 3102860) as quatro fases; (Cesgranrio · CEF 2021 · tec 1854444) requisitos em todas as fases; (Cesgranrio · Transpetro SAP 2023 · tec 2695346) lista de riscos → gerenciamento de projetos; (tec 2695339) concorrência → Process View.
- TDD: (Cesgranrio · BASA 2024 · tec 3135890) ciclo teste → falha → código → refatorar → repetir.

**Onde ela confunde.**
- "Incremental e em cascata" como par de sequenciais (Q25, alternativa A): incremental repete ciclos.
- Incremental (fatias completas, por partes) × iterativo (tudo com baixa fidelidade, por repetições). A frase "versões sucessivas, acrescentando funcionalidades" é incremental; "aumentar a fidelidade até a máxima" é iterativo.
- Espiral × prototipação evolucionária: as duas têm protótipos; só a espiral é dirigida a riscos. Se o enunciado descarta a análise de riscos, não é espiral.
- Elaboração × Construção no RUP: elaboração = arquitetura + riscos + plano; construção = implementar e testar; concepção = escopo, caso de negócio, viabilidade; transição = implantar e treinar. "Implementação dos elementos de maior risco" é elaboração, não construção.
- UP "como alternativa aos métodos ágeis" ou "partindo de requisitos perenes": falso; UP é iterativo, aceita mudança e pode ser ágil.
- Cascata descrita como "iterativa, com revisões contínuas" (Q54, alternativa B): contraditório. "Espiral é ágil": não.
- TDD "escrever todos os testes, depois todo o código": falso; é um teste por vez.

**Macete.** Um adjetivo por modelo: cascata = sequencial; V = sequencial com testes pareados; incremental = por partes; iterativo = por repetições; espiral = iterativo dirigido a riscos; prototipação = exploratória; RUP = iterativo-incremental em 4 fases (CECT: Concepção, Elaboração, Construção, Transição); ágil = iterativo-incremental adaptativo. Palavra "risco" no enunciado → espiral (ou elaboração, se for RUP). "Fase concluída antes da seguinte" → cascata ou V.

**Questão comentada 1.** (Cesgranrio · Transpetro 2023 · Q25 · tec 2695284)
Alguns modelos de ciclo de vida se caracterizam por serem sequenciais: cada fase deve ser concluída antes do início da próxima. Nessa categoria estão os modelos
(A) incremental e em cascata
(B) iterativo e em espiral
(C) ágil e em espiral
(D) em V e em cascata
(E) em V e incremental
**Gabarito: D.** Cascata é o sequencial clássico; o V é a cascata dobrada com teste pareado por fase: também sequencial.
A: cascata serve, mas incremental repete ciclos (cascata aplicada iterativamente).
B: iterativo e espiral repetem ciclos.
C: ágil é iterativo-incremental; espiral é cíclico.
E: V serve, mas incremental não.

**Questão comentada 2.** (Cesgranrio · Petrobras 2018 · tec 619485)
Diálogo: o usuário diz que "ainda não temos todas as funcionalidades bem definidas"; o desenvolvedor propõe "especificar e implementar algumas funcionalidades mais importantes e construir uma primeira versão até o fim do mês. Depois acrescentaríamos outras funcionalidades à medida que as fôssemos construindo, gerando versões sucessivas e cada vez mais completas"; o usuário pede "não contem nada para aquele especialista em risco". O chefe deverá optar pelo modelo
(A) RAD
(B) incremental
(C) cascata
(D) espiral
(E) baseado em componentes
**Gabarito: B.** "Primeira versão com as funcionalidades mais importantes" + "versões sucessivas e cada vez mais completas" é a definição de incremental.
A: RAD depende de componentes e equipes paralelas com prazo fixo curto; não é o descrito.
C: cascata exige requisitos definidos; o usuário diz que não estão.
D: espiral é dirigida a riscos; o diálogo descarta explicitamente a análise de risco.
E: CBD monta componentes prontos; nada no texto indica reuso.

**Questão comentada 3.** (Cesgranrio · Transpetro SAP 2023 · tec 2695361)
Há uma fase do Processo Unificado em que é feita a análise do domínio do problema, são definidas as bases de uma arquitetura robusta e são eliminados os elementos de maior risco. Essa fase é
(A) Construction
(B) Elaboration
(C) Implementation
(D) Inception
(E) Transition
**Gabarito: B.** Domínio + arquitetura + riscos é a tríade da elaboração.
A: construção implementa e testa sobre a arquitetura já definida.
C: implementação é disciplina, não fase.
D: concepção define escopo, caso de negócio e viabilidade.
E: transição implanta e treina usuários.

**Para o Anki.**
- Modelos sequenciais → cascata e V (cada fase concluída antes da próxima); V = cascata com teste pareado por fase.
- Incremental × iterativo → incremental entrega fatias completas, "versões sucessivas e cada vez mais completas"; iterativo faz tudo com baixa fidelidade e refina a cada ciclo.
- Espiral (Boehm) → dirigido a riscos; análise de riscos antes do protótipo em cada ciclo; 1º ciclo = conceito de operação.
- Cascata: quando usar → requisitos bem conhecidos e estáveis; ciclo preditivo (escopo, prazo e custo fixados no início).
- RUP: 4 fases e marcos → Concepção (escopo, caso de negócio) · Elaboração (arquitetura + riscos) · Construção (código e testes) · Transição (implantação).
- RUP: 4+1 → lógica, processo (concorrência), implementação, implantação + casos de uso; lista de riscos = gerência de projeto; requisitos em todas as fases.
- TDD → escrever um teste, vê-lo falhar (vermelho), código mínimo para passar (verde), refatorar; repetir.
- CI × entrega contínua × implantação contínua → integrar/testar várias vezes ao dia · artefato sempre pronto, deploy manual · deploy automático.
### 5.3 Modelos, metodologias, técnicas e ferramentas de análise e projeto (estruturado e orientado a objetos)

**Peso.** Análise estruturada 2 (Liquigás 2018), OO 1 (BANESE 2025), UML 36 (18,7% do caderno; 14 com figura, nenhuma delas na ênfase de Processos). Transpetro 2023: Q32 (sobrecarga); SAP 2023: 7 questões de UML (relações de casos de uso, multiplicidade, máquina de estados, visibilidade, duas figuras, 4+1). Transpetro 2018: casos de uso como interação ator–sistema; Petrobras 2018: fluxo de tarefas → atividades. Padrões GoF: 16 questões, descartadas.

**O que a banca cobra.**
Análise estruturada (Yourdon/DeMarco, "análise estruturada moderna"):
- Técnica top-down, passo a passo; ferramenta principal: DFD, que representa processos e fluxos de dados entre eles, particionando o sistema em módulos de detalhe gerenciável (Liquigás 2018).
- DFD: processo (bolha), fluxo de dados (seta), depósito de dados (duas linhas), entidade externa (retângulo). Diagrama de contexto = DFD de nível 0 com um único processo (o sistema inteiro) e as entidades externas; a decomposição começa no nível seguinte.
- Modelo essencial = modelo ambiental + modelo comportamental. Ambiental: declaração de objetivos, diagrama de contexto e lista de eventos. Comportamental preliminar: DFD preliminar (um processo por evento da lista) + diagrama entidade-relacionamento + dicionário de dados; depois, DFDs nivelados, especificações de processo (miniespecs) e diagrama de transição de estados (DTE) para sistemas de tempo real.
- Dicionário de dados: define cada fluxo e depósito (composição, tipos, domínios). DFD modela função; DER modela dados; DTE modela controle/estados.

Orientação a objetos:
- Classe (molde), objeto (instância), atributo, método/operação, mensagem. Análise OO identifica classes a partir dos objetos do domínio e define a estrutura pelo modo como os objetos interagem (BANESE 2025).
- Encapsulamento (esconder estado; acesso por métodos; visibilidades), abstração, herança (subclasse reutiliza e especializa), polimorfismo (mesma mensagem, comportamentos diferentes).
- Sobrecarga (overloading): mesmo nome de método, mesma classe, listas de parâmetros diferentes; polimorfismo estático. Sobrescrita (overriding): subclasse redefine método herdado com a mesma assinatura; polimorfismo dinâmico.
- Interface (contrato sem implementação; a classe "realiza" a interface) × classe abstrata (pode ter implementação parcial; não é instanciada).
- Associação (uma classe tem uma propriedade/atributo do tipo da outra: UNEMAT 2024, IPEA 2024), agregação (todo–parte fraca, losango vazio, a parte existe sem o todo; é um tipo especial de associação), composição (todo–parte forte, losango cheio, a parte morre com o todo), dependência (uso temporário: parâmetro, variável local), generalização (herança), realização (interface).
- Coesão (quanto os elementos de um módulo pertencem a uma só responsabilidade: deve ser alta) × acoplamento (quanto um módulo depende de outro: deve ser baixo).
- Visibilidades UML: + público, − privado, # protegido, ~ pacote. Multiplicidade: 1, 0..1, 0..*, 1..*, n..m.

UML 2 por descrição:
- Estruturais: classes, objetos, componentes, implantação, pacotes, estrutura composta, perfil. Comportamentais: casos de uso, atividades, máquina de estados; de interação (subgrupo dos comportamentais): sequência, comunicação (antiga colaboração), visão geral de interação, tempo.
- Casos de uso: relações entre atores (entidades externas) e funcionalidades; cada caso de uso é uma interação entre ator e sistema (não um único cenário); o diagrama descreve o contexto do sistema na análise OO. Relações: ator–caso de uso = associação; include (o base necessita, para sua execução, de operações de outro caso; obrigatório), extend (comportamento opcional/condicional, com ponto de extensão), generalização (entre casos de uso ou entre atores; a única relação permitida entre atores). "Relações que exploram similaridades entre casos de uso": inclusão e generalização (SAP 2023).
- Atividades: fluxo de trabalho/processo de negócio, com decisão, bifurcação/junção (paralelismo), partições (raias), guardas ([condição]).
- Sequência: objetos/atores interagindo ao longo do tempo, mensagens na ordem em que ocorrem, linhas de vida; mensagem perdida/encontrada (ponto preto).
- Comunicação: mesma informação da sequência, enfatizando a estrutura/links, numeração das mensagens.
- Máquina de estados: ciclo de vida de um objeto; estados, transições disparadas por eventos (inclusive assíncronos: sensor notifica, semáforo muda; SAP 2023).
- Objetos: instantâneo de instâncias com valores (nomes sublinhados). Associação qualificada (retângulo junto à classe), ternária, classe de associação: só reconhecer.
- Padrões GoF (só reconhecimento, fora do edital): Singleton = uma instância; Factory = criação delegada; Adapter = converte interface; Facade = fachada simplificada; Composite = árvore parte-todo com operações uniformes; Decorator = responsabilidades dinâmicas; Observer = notifica dependentes; Strategy = algoritmos intercambiáveis; Template Method = esqueleto na superclasse, passos nas subclasses.

**Como ela pergunta.**
- Formato D: (Cesgranrio · Petrobras 2018 · tec 619478) fluxo de tarefas entre gerentes → atividades; (Cesgranrio · Transpetro SAP 2023 · tec 2695364) acionamento de semáforo como consequência de evento assíncrono do sensor → máquina de estados; (Cesgranrio · UNEMAT 2024 · tec 2838618) "interação ao longo do tempo, mensagens e a ordem em que ocorrem" → sequência; (Cesgranrio · UNIRIO 2019 · tec 1175332) contexto do sistema na análise OO → casos de uso.
- Definição de conceito OO: (Cesgranrio · Transpetro 2023 · Q32 · `txt/prova2023.txt`; não consta do caderno 06) três métodos com o mesmo nome na mesma classe e parâmetros diferentes → sobrecarga.
- Relação pela descrição do código: (Cesgranrio · UNEMAT 2024 · tec 2838611) "classe P possui propriedade que guarda instância de Q" → associação; (Cesgranrio · IPEA 2024 · tec 2780413) o inverso.
- Par estrutural/comportamental: (Cesgranrio · BASA 2024 · tec 3135420) classes e atividades.
- Componentes de casos de uso: (Cesgranrio · Transpetro SAP 2018 · tec 639124) inclusão = "necessita, para sua execução, de uma sequência de operações de outro"; (Cesgranrio · UNEMAT 2024 · tec 2838605) o diagrama representa relações entre entidades externas e funcionalidades.
- Contagem: (Cesgranrio · Transpetro SAP 2023 · tec 2695415) classe com atributos #a1, +a2, #a3 e operações +, −, #, #, +: zero features com visibilidade de pacote (~).
- Análise estruturada: (Cesgranrio · Liquigás 2018 · tec 835973) modelo comportamental preliminar = DFD preliminar + DER; (tec 835975) metodologia top-down cuja ferramenta principal representa processos e fluxos de dados → estruturada.

**Onde ela confunde.**
- Atividades × comunicação/colaboração × sequência: "colaboravam" e "interagiam" no enunciado são iscas lexicais; o critério é o objeto modelado (fluxo de trabalho de pessoas = atividades; mensagens entre objetos = sequência/comunicação).
- Include × extend: "necessita para sua execução" = include; "opcional, sob condição" = extend. Extend "entre dois atores" é falso (é entre casos de uso).
- Agregação × composição: as duas são todo–parte; composição tem losango cheio e a parte não existe sem o todo. "Um objeto de Cd composto por pelo menos um Ef" = composição com multiplicidade 1..*.
- Sobrecarga × sobrescrita lado a lado (D e E na Q32): decida pelo lugar (mesma classe × subclasse) e pela assinatura (diferente × igual).
- Modelo ambiental × comportamental: ambiental = objetivos + contexto + lista de eventos; comportamental = DFD preliminar + DER + dicionário. Casos de uso dentro do "modelo ambiental" é mistura de paradigmas.
- Diagrama de objetos oferecido como "de classes" (nomes sublinhados e valores = objetos, SAP 2018); o equivalente OO do diagrama de contexto é casos de uso.

**Macete.** Para escolher o diagrama, pergunte "o que está sendo modelado?" e ignore os verbos do enunciado: fluxo de trabalho → atividades; mensagens no tempo → sequência; reação a eventos / estados de um objeto → máquina de estados; quem usa o quê → casos de uso; estrutura → classes. Para OO: mesma classe + parâmetros diferentes = sobreCARGA; subclasse + mesma assinatura = sobrESCRITA. Para análise estruturada: a tríade ambiental é objetivos + contexto + eventos, sem exceção.

**Questão comentada 1.** (Cesgranrio · Transpetro 2023 · Q32 · `txt/prova2023.txt`, gabarito oficial D)
Um desenvolvedor pretende criar três métodos com o mesmo nome em uma mesma classe, mas com parâmetros diferentes, usando uma técnica do paradigma OO. Qual o nome da técnica?
(A) Herança
(B) Interface
(C) Instanciação
(D) Sobrecarga
(E) Sobrescrita
**Gabarito: D.** Mesmo nome, mesma classe, assinaturas diferentes = sobrecarga (overloading).
A: herança é reuso/especialização entre classes.
B: interface é contrato de operações sem implementação.
C: instanciação cria objetos a partir da classe.
E: sobrescrita exige subclasse redefinindo método herdado com a mesma assinatura.

**Questão comentada 2.** (Cesgranrio · Petrobras 2018 · tec 619478)
Ao ler casos de uso de um sistema novo, um desenvolvedor percebeu que eles descreviam como o gerente financeiro e o gerente administrativo colaboravam em um fluxo de tarefas que levava à criação do relatório anual. Para mapear esse fluxo de tarefas, deve escolher o diagrama UML de
(A) atividades
(B) sequência
(C) colaboração
(D) estados
(E) casos de uso
**Gabarito: A.** Fluxo de tarefas (workflow) entre pessoas, com passos, decisões e possível paralelismo, é o domínio do diagrama de atividades.
B: sequência modela mensagens entre objetos ao longo do tempo, não tarefas de pessoas.
C: colaboração (comunicação) também é interação entre objetos; a palavra "colaboravam" é a isca.
D: estados modela o ciclo de vida de um objeto.
E: casos de uso mostra funcionalidades por ator, não a ordem das tarefas.

**Questão comentada 3.** (Cesgranrio · Transpetro SAP 2018 · tec 639124)
O diagrama de casos de uso modela a interação entre um sistema e o meio ambiente. Um de seus componentes é o
(A) ator, que representa um objeto de negócio interno ao sistema e descreve seus aspectos estruturais.
(B) relacionamento de comunicação, que indica como um ator troca informações com outro ator ou com um caso de uso.
(C) relacionamento de extensão, que indica o comportamento opcional entre dois atores.
(D) relacionamento de generalização, que permite que um caso de uso herde características de um ator.
(E) relacionamento de inclusão, quando um caso de uso necessita, para sua execução, de uma sequência de operações de outro caso de uso.
**Gabarito: E.** Include é a dependência obrigatória: o caso base precisa do incluído para executar.
A: ator é externo ao sistema (pessoa, sistema, dispositivo), não objeto interno.
B: atores não se comunicam entre si no diagrama; a associação liga ator a caso de uso.
C: extend é entre casos de uso, não entre atores.
D: generalização é entre atores ou entre casos de uso, nunca cruzada.

**Para o Anki.**
- Sobrecarga × sobrescrita → sobrecarga: mesmo nome, mesma classe, parâmetros diferentes (estático); sobrescrita: subclasse redefine com a mesma assinatura (dinâmico).
- Qual diagrama UML para "fluxo de tarefas / processo de negócio" → atividades (não colaboração, mesmo que o texto diga "colaboravam").
- Qual diagrama UML para "evento assíncrono dispara reação / ciclo de vida de um objeto" → máquina de estados.
- Include × extend → include: obrigatório, o base necessita do incluído; extend: opcional/condicional, com ponto de extensão.
- Agregação × composição → losango vazio, parte sobrevive ao todo × losango cheio, parte morre com o todo; ambas são associações todo–parte.
- Modelo ambiental (análise essencial) → declaração de objetivos + diagrama de contexto + lista de eventos; o comportamental preliminar = DFD preliminar + DER + dicionário.
- Elementos do DFD → processo, fluxo de dados, depósito de dados, entidade externa; diagrama de contexto = um único processo.
- Visibilidades UML → + público · − privado · # protegido · ~ pacote.
- Diagramas de interação da UML → sequência, comunicação, visão geral de interação, tempo (subgrupo dos comportamentais).

### 5.4 Verificação, validação e teste

**Peso.** 21 questões de testes (10,9%) + 3 de qualidade (V&V, custo da qualidade) + 3 de TDD. Transpetro 2023: Q23 (técnica estática) e Q31 (aceitação); 2018: mutação (Transpetro), verificação pela frase da ISO e custo de prevenção (Petrobras/Transpetro). Catorze questões de 2023 em diante: níveis, regressão, stub/mock, alfa/beta, ciclomática, ordem dos testes, momento de envolver testadores.

**O que a banca cobra.**
- Verificação: "confirmação, por exame e fornecimento de evidência objetiva, de que os requisitos especificados foram atendidos" (ISO 9000); "estamos construindo o produto corretamente?". Validação: "confirmação de que os requisitos para um uso ou aplicação pretendidos foram atendidos"; "estamos construindo o produto certo?"; expectativa do cliente. V&V é processo de suporte (ISO 12207); auditoria e garantia da qualidade são outros processos de suporte.
- Garantia da qualidade: processos e métodos ao longo de todo o ciclo (BANESE 2025); preventiva, sobre o processo. Controle: detectivo, sobre o produto. Custos da qualidade: prevenção (planejar, treinar, coordenar), avaliação (revisões, testes, métricas), falha interna (retrabalho) e externa (suporte, reputação).
- Teste estático (não executa o software; examina artefatos): revisão, walk-through (conduzido pelo autor, informal), inspeção (formal, papéis definidos, checklist, fases), análise estática automatizada (SAST). Teste dinâmico (executa): tudo o mais.
- Níveis: unidade/componente (menor parte, isolada, pelo desenvolvedor; usa stubs e drivers), integração (interfaces e comunicação entre módulos: top-down, bottom-up, sanduíche, big bang; inclui testes de interfaces com o usuário e cenários de uso), sistema (produto completo contra os requisitos, pela equipe de teste independente), aceitação (representantes dos usuários/cliente decidem se aceitam; antes de liberar para produção). Ordem: unidade → integração → validação/sistema → aceitação (Pressman: unidade, integração, validação, sistema). Quem executa: desenvolvedor (unitário/integração), equipe de teste (sistema), usuário (aceitação).
- Alfa: na organização desenvolvedora, equipe interna simulando o usuário final (ou usuários convidados, no ambiente do desenvolvedor), antes de liberar. Beta: usuários reais, no ambiente deles, versão quase final, relatando problemas (CEF 2024: pesquisadores testam no local de trabalho por um ano = beta).
- Tipos: funcional, regressão (reexecutar testes após mudança para garantir que o que funcionava continua funcionando), desempenho/carga/estresse, segurança, usabilidade, configuração, fumaça, exploratório, mutação (gera versões levemente modificadas do programa e compara comportamentos para avaliar a suíte de testes).
- Caixa-branca (estrutural): conhece o código; caminho básico com complexidade ciclomática V(G) = E − N + 2P = número de decisões + 1 = número de regiões; cobertura de comandos, decisões, condições, caminhos; teste de fluxo de dados (definição e uso de variáveis); teste de laços. Caixa-preta (funcional): só entradas e saídas; partição de equivalência (classes válidas/inválidas, um representante por classe), análise de valor limite (fronteiras das classes: mínimo, máximo e vizinhos), tabela de decisão, transição de estados, matriz ortogonal, casos de uso.
- TDD: teste antes do código; vermelho → verde → refatorar, um teste por vez. BDD: critérios de aceitação em Dado/Quando/Então. Shift-left: a equipe de testes se envolve na etapa de requisitos (IPEA 2024).
- Dublês de teste: stub (fornece respostas prontas para isolar a unidade; valida resultado), mock (objeto pré-programado que verifica se métodos foram chamados, com que argumentos e quantas vezes: valida comportamento/interação), dummy (preenche parâmetro, não é usado), fake (implementação simplificada funcional), spy. Para testar unidade que chama API externa: criar um mock da API.
- Defeito (no código) × erro (humano) × falha (comportamento observado). Teste mostra a presença de defeitos, não a ausência. Pirâmide: muitos unitários, menos de integração, poucos de interface.

**Como ela pergunta.**
- Formato E: (Cesgranrio · Transpetro 2023 · Q23 · tec 2695282) técnica de teste estático → walk-through entre quatro dinâmicas.
- Formato A: (Cesgranrio · Transpetro 2023 · Q31 · tec 2695290) e (Cesgranrio · IPEA 2024 · tec 2780429) representantes dos usuários testam antes de liberar → aceitação; (Cesgranrio · BNDES 2024 · tec 3117535) "mesmo antes da integração" → unidade; (Cesgranrio · CEF 2024 · tec 3102748) usuários testam no local de trabalho durante um ano → beta; (Cesgranrio · CEF 2024 · tec 2902002) "teste alfa" → equipe interna simula o usuário antes da liberação.
- Formato B: (Cesgranrio · Petrobras 2018 · tec 619477) "evidência objetiva... requisitos especificados" → verificação; (Cesgranrio · Transpetro 2018 · tec 638884) "versões levemente modificadas do programa" → mutação; (Cesgranrio · IPEA 2024 · tec 2780425) stub = respostas prontas; (Cesgranrio · IPEA 2024 · tec 2780422) e (Cesgranrio · IBGE 2016 · tec 401543) "o que funcionava continua funcionando" → regressão.
- Lista: (Cesgranrio · IPEA 2024 · tec 2780418) os quatro níveis; (Cesgranrio · AgeRIO 2023 · tec 2462891) ordem unidade → integração → validação → sistema; (Cesgranrio · UNIRIO 2019 · tec 1176564) desenvolvedor / equipe de teste / usuário → unitário-integração / sistema / aceitação.
- Formato F: (Cesgranrio · UNEMAT 2024 · tec 2838610) 9 nós e 11 arestas → 4 caminhos. Caixa-branca por descrição: (Cesgranrio · Liquigás 2018 · tec 835958) definição e uso de variáveis → fluxo de dados.
- Custo da qualidade: (Cesgranrio · Transpetro 2018 · tec 638886) prevenção → gerência para planejar e coordenar controle e garantia (revisões e testes são avaliação; retrabalho é falha).

**Onde ela confunde.**
- Verificação × validação: a frase da ISO para verificação é dada e "validação" está na alternativa vizinha. Âncora: "requisitos especificados" = verificação; "uso pretendido / expectativa do cliente" = validação.
- Sistema × aceitação: os dois testam o produto completo; a diferença é quem testa e para quê (equipe de teste contra requisitos × usuários decidindo aceitar).
- Integração (tema dominante do texto) × unidade (frase decisiva "mesmo antes da integração").
- Alfa × beta: os dois com usuários; alfa no ambiente do desenvolvedor (controlado), beta no ambiente do usuário (real). "Distribuir para grupo externo em condições reais" = beta.
- Walk-through "contra" partição de equivalência e valor limite: estas são caixa-preta dinâmicas; walk-through é estático.
- Regressão oferecida como teste de desempenho ou "não funcional": regressão é reexecução após mudança, independentemente do tipo.
- Stub × mock: stub responde (estado); mock verifica chamadas (comportamento).
- Inspeção × walk-through: inspeção é a mais formal ("processo definido estritamente e em várias fases"); walk-through é conduzido pelo autor. "Equipe de testes só entra na homologação": falso, entra em requisitos (shift-left).

**Macete.** Ache o MOMENTO, o OBJETO e o EXECUTOR do teste: função isolada antes da integração = unidade; módulos conversando = integração; produto inteiro pela equipe de teste = sistema; representantes do usuário decidindo liberar = aceitação; sem executar = estático. Frase "requisitos especificados" = verificação. Ciclomática: E − N + 2 (ou decisões + 1).

**Questão comentada 1.** (Cesgranrio · Transpetro 2023 · Q23 · tec 2695282)
O principal objetivo dos testes estáticos é reduzir os defeitos do software por meio da redução de defeitos na documentação a partir da qual o software foi desenvolvido. Uma das técnicas mais importantes para a execução de testes estáticos é a de
(A) regressão
(B) walk-through
(C) análise do valor limite
(D) análise de casos de uso
(E) particionamento de equivalência
**Gabarito: B.** Walk-through examina o documento ou código sem executar: o autor conduz a equipe pelo artefato.
A: regressão reexecuta testes após mudanças (dinâmico).
C: valor limite é técnica caixa-preta de projeto de casos de teste (dinâmica).
D: derivar testes de casos de uso gera casos para execução (dinâmica).
E: partição de equivalência é caixa-preta dinâmica.

**Questão comentada 2.** (Cesgranrio · Transpetro 2023 · Q31 · tec 2695290)
Uma equipe pretende convidar representantes dos usuários finais de uma solução aparentemente completa para testar sua última versão antes de disponibilizá-la no mercado; se aprovada, vai para produção. A situação faz referência aos testes
(A) unitários
(B) de aceitação
(C) de desempenho
(D) de integração
(E) de sistema
**Gabarito: B.** Representantes dos usuários + aprovação que libera a produção = aceitação.
A: unitário testa componentes isolados, pelo desenvolvedor.
C: desempenho mede tempo e carga, não aprovação do usuário.
D: integração testa interfaces entre módulos.
E: sistema também testa o produto inteiro, mas pela equipe de teste contra requisitos, não pelos usuários decidindo aceitar.

**Questão comentada 3.** (Cesgranrio · BNDES 2024 · tec 3117535)
Em um projeto, os desenvolvedores perceberam que, ao integrar diferentes módulos, o comportamento esperado não estava sendo alcançado. Notaram que as funções individuais dentro de cada módulo não estavam retornando os resultados esperados, mesmo antes da integração. Para identificar a origem dos problemas, devem ser priorizados os testes de
(A) aceitação
(B) independência
(C) modularidade
(D) carga
(E) unidade
**Gabarito: E.** A frase decisiva é "funções individuais... mesmo antes da integração": o defeito está na unidade.
A: aceitação é com o usuário, no fim.
B: "independência" não é nível de teste.
C: "modularidade" é atributo de projeto, não teste.
D: carga mede comportamento sob volume, irrelevante aqui.

**Para o Anki.**
- Verificação × validação (frase da ISO) → "confirmação, com evidência objetiva, de que os requisitos especificados foram cumpridos" = verificação (construir certo); uso pretendido / expectativa do cliente = validação (produto certo).
- Técnicas estáticas → revisão, walk-through (autor conduz, informal), inspeção (formal, papéis, fases), análise estática; tudo que executa é dinâmico.
- Níveis de teste: quem e o quê → unidade (dev, componente isolado) · integração (interfaces) · sistema (equipe de teste, produto inteiro × requisitos) · aceitação (usuários aprovam antes de produção).
- Alfa × beta → alfa: ambiente do desenvolvedor, equipe interna/usuários convidados; beta: ambiente do usuário real, versão quase final.
- Complexidade ciclomática → V(G) = E − N + 2P = decisões + 1 = número de caminhos independentes (caixa-branca, caminho básico).
- Caixa-preta: duas técnicas-assinatura → partição de equivalência (um representante por classe) e análise de valor limite (fronteiras das classes).
- Regressão → reexecutar testes após mudança para garantir que o que funcionava continua funcionando; não é teste de desempenho.
- Stub × mock → stub fornece respostas prontas (valida resultado); mock verifica se/como os métodos foram chamados (valida interação).
- Teste de mutação → gera versões levemente modificadas do programa e compara com o original para avaliar a suíte de testes.
- Custos da qualidade → prevenção (planejar, treinar, coordenar) · avaliação (revisões, testes, métricas) · falha interna (retrabalho) · falha externa (suporte, reputação).

### 5.5 Ambientes de desenvolvimento de software

**Peso.** 10 questões no caderno (gerência de configuração 2, Git 2, CVS/SVN 1, Maven 1, Jenkins 2, conceitos de projeto 2) + 3 de DevOps/CI/IaC. [sem precedente na ênfase de Processos de Negócios: nenhuma questão na Transpetro 2018 ou 2023; os precedentes são CEF 2024/2021, CNU 2024, BNDES 2024, BASA 2024, IPEA 2024, UNIRIO 2019.] A planilha registra o formato "qual NÃO é ferramenta de X" (CASE × middleware) de prova anterior ao caderno.

**O que a banca cobra.**
- IDE: editor + compilador/interpretador + depurador + integração com controle de versão e build (Eclipse, IntelliJ, VS Code, Visual Studio). Ferramentas CASE: modelagem (ERwin, PowerDesigner, Astah, Enterprise Architect). Categorias que a banca mistura: CASE/modelagem × IDE × controle de versão × build × CI/CD × middleware/mensageria (ActiveMQ, RabbitMQ) × conteinerização/orquestração (Docker, Kubernetes, OpenShift).
- Gerência de configuração de software (GCS): identificação dos itens de configuração, controle de versões, controle de mudanças (toda mudança registrada, com justificativa, rastreável), auditoria de configuração, relato de status; baseline = configuração formalmente aprovada que só muda por controle de mudanças. GCS não testa, não estima e não é só controle de acesso ao repositório (CEF 2024).
- Controle de versão: centralizado (CVS, SVN: um repositório, commit direto) × distribuído (Git, Mercurial: cada clone é repositório completo). Vocabulário Git: repositório, commit (registrar mudanças locais no repositório), branch (ramificação para desenvolver funcionalidade sem afetar a linha principal, no mesmo repositório), merge (integrar um branch em outro), rebase (reaplicar commits sobre outra base), tag (marcar ponto importante no histórico), fork (cópia independente do repositório para desenvolvimento paralelo), clone, push (enviar commits ao remoto), pull (trazer e integrar mudanças do remoto), pull request/merge request (pedido de revisão e integração), conflito de merge. Fluxo para integrar o branch de correção na main: `git checkout main`, `git merge solvebugio`, `git push origin main`. Comando de registrar mudanças em SVN/CVS: commit.
- Build: compilar, resolver dependências, empacotar, rodar testes; ferramentas Maven/Gradle (Java), npm, Make.
- Integração contínua (CI): cada commit dispara build e testes automáticos em servidor de integração (Jenkins, GitLab CI, GitHub Actions). Entrega contínua (CD): artefato sempre implantável, deploy manual aprovado. Implantação contínua: deploy automático em produção. Pipeline: estágios build → test → deploy.
- Ambientes: desenvolvimento → teste/QA → homologação/staging → produção; conteinerização (Docker) garante que o código rode de forma consistente em diferentes ambientes; orquestração (Kubernetes) escala e balanceia. IaC: declarativa (estado desejado) × imperativa (passos). Rastreamento de defeitos (Jira, Bugzilla) integrado ao versionamento.

**Como ela pergunta.**
- Definição de GCS: (Cesgranrio · CEF 2024 · tec 3102843) prática essencial = registrar e justificar toda mudança no código, permitindo rastreabilidade e controle de versões.
- Vocabulário Git: (Cesgranrio · CNU 2024 · tec 3038236) propósito do fork = cópia independente do repositório para desenvolvimento paralelo (branch é o isolamento dentro do mesmo repositório; tag marca ponto; push envia; pull atualiza); (Cesgranrio · BNDES 2024 · tec 3118439) integrar branch na main = checkout main, merge, push; (Cesgranrio · CEF 2021 · tec 1854511) registrar mudanças locais no repositório SVN/CVS = commit.
- DevOps conceitual: (Cesgranrio · BASA 2024 · tec 3135917) consistência entre ambientes = conteinerização; (Cesgranrio · CEF 2021 · tec 1854436) shift-left = testar desde o início; (Cesgranrio · BNDES 2024 · tec 3117630) IaC que define o estado desejado = declarativa.

**Onde ela confunde.**
- Fork × branch: fork é outro repositório (cópia independente); branch é linha paralela dentro do mesmo repositório. A alternativa E da CNU 2024 descreve branch para derrubar quem lê rápido.
- Push × pull × commit: commit registra localmente; push envia ao remoto; pull traz do remoto. "Save/store" não existem.
- Integração contínua × entrega contínua × implantação contínua: diferem no ponto de automação (build/teste; artefato pronto; deploy automático).
- GCS "é testar o software", "é só documentar", "é só controle de acesso ao repositório": alternativas absolutas e reduzidas são erradas.
- CI × conteinerização: CI integra e testa; conteinerização empacota com dependências para rodar igual em todo ambiente.
- Ferramenta de categoria errada na lista (middleware entre ferramentas CASE; IDE entre ferramentas de build).

**Macete.** Classifique cada ferramenta/termo pela categoria antes de ler as alternativas: modelagem, IDE, versionamento, build, CI/CD, contêiner, middleware. Em Git, pergunte "mesmo repositório?" (branch) ou "outro repositório?" (fork), "local" (commit) ou "remoto" (push/pull).

**Questão comentada 1.** (Cesgranrio · CNU 2024 · tec 3038236)
Em um ambiente DevOps, equipes usam Git com branch, tag, fork, push e pull. Qual é o propósito de criar um fork no Git?
(A) Marcar um ponto específico como importante no histórico.
(B) Criar uma cópia independente do repositório para desenvolvimento paralelo.
(C) Enviar alterações locais para o repositório remoto.
(D) Atualizar o repositório local com as alterações do remoto.
(E) Isolar o desenvolvimento de uma funcionalidade sem afetar a linha principal, dentro do mesmo repositório.
**Gabarito: B.** Fork = cópia independente (outro repositório), típica de contribuição externa.
A: tag.
C: push.
D: pull.
E: branch (mesmo repositório).

**Questão-modelo (autoral), no formato da banca.** Cada commit dispara automaticamente a compilação e os testes unitários, com aviso imediato em caso de falha; a implantação em produção continua aprovada manualmente. A prática é (A) implantação contínua (B) integração contínua (C) entrega contínua (D) infraestrutura como código (E) conteinerização. Gabarito: B. A frase decisiva é "cada commit dispara compilação e testes"; o deploy manual exclui implantação contínua; "artefato sempre pronto" não foi mencionado.

**Para o Anki.**
- Gerência de configuração: núcleo → identificar itens, controlar versões, registrar e justificar toda mudança (rastreabilidade), auditar; baseline só muda por controle de mudanças.
- Fork × branch → fork: cópia independente do repositório; branch: linha paralela dentro do mesmo repositório.
- commit × push × pull → registra localmente · envia ao remoto · traz do remoto e integra.
- Integrar branch na main (Git) → git checkout main · git merge <branch> · git push origin main.
- Centralizado × distribuído → CVS/SVN: um repositório central; Git: cada clone é repositório completo.
- Conteinerização × CI → contêiner garante consistência entre ambientes; CI integra e testa a cada commit.
- IaC declarativa × imperativa → declarativa descreve o estado desejado; imperativa descreve os passos.
- Shift-left testing → testar desde as fases iniciais do ciclo de vida.

## 4. Pares e pegadinhas da disciplina

| O par que a banca confunde | A distinção que resolve | Fonte ou [inferido] |
|---|---|---|
| Verificação × validação | Verificação: requisitos especificados, evidência objetiva ("construindo certo"); validação: uso pretendido, expectativa do cliente ("produto certo") | Petrobras 2018 · tec 619477 |
| Requisito funcional × não funcional | RF: o que o sistema faz; RNF: quão bem / sob que restrição; número, unidade ou tecnologia = RNF | Transpetro 2023 Q24; Petrobras 2018 · tec 619483 |
| RNF de produto × organizacional × externo | Produto: qualidade do software em uso; organizacional: política, processo, ambiente e padrões da empresa; externo: lei, ética, regulador | SAP 2023 · tec 2695418; SAP 2018 · tec 639066 |
| Requisito de negócio × de usuário | Negócio define visão e escopo e vem primeiro; usuário descreve o que o usuário faz | BASA 2018 · tec 633992 |
| Etnografia × JAD | Etnografia: observação/imersão do analista no ambiente do usuário; JAD: reunião estruturada com grupos | SAP 2018 · tec 639064 |
| Walk-through × inspeção × revisão | Inspeção: formal, papéis, fases, checklist; walk-through: autor conduz, informal; revisão/comentários: leitura por especialista | BASA 2018 · tec 633994 |
| Incremental × iterativo | Incremental: fatias completas, versões sucessivas mais completas; iterativo: tudo com baixa fidelidade, refinado por ciclos | Petrobras 2018 · tec 619485; SAP 2018 · tec 639059 |
| Cascata × modelo V | Ambos sequenciais; V acrescenta a correspondência fase ↔ nível de teste | Transpetro 2023 Q25; IBGE 2016 · tec 401544 |
| Espiral × prototipação evolucionária | Espiral: dirigido a riscos, análise de riscos em todo ciclo; prototipação: dirigida a requisitos instáveis | SAP 2023 · tec 2695362; SAP 2018 · tec 639063 |
| RUP: concepção × elaboração × construção × transição | Escopo e caso de negócio × arquitetura e riscos × implementar e testar × implantar e treinar | Transpetro 2018 · tec 638883; SAP 2023 · tec 2695361 |
| Visão de processo × lógica (4+1) | Processo trata concorrência, paralelismo e desempenho; lógica trata classes e funcionalidade | SAP 2023 · tec 2695339 |
| Diagrama de atividades × sequência × comunicação | Atividades: fluxo de trabalho; sequência: mensagens no tempo; comunicação: mensagens com ênfase nos links | Petrobras 2018 · tec 619478; UNEMAT 2024 · tec 2838618 |
| Máquina de estados × atividades | Estados: ciclo de vida de UM objeto reagindo a eventos; atividades: fluxo de um processo | SAP 2023 · tec 2695364 |
| Estrutural × comportamental | Estrutural: classes, objetos, componentes, implantação, pacotes (o que É); comportamental: casos de uso, atividades, estados, interação (o que FAZ) | BASA 2024 · tec 3135420 |
| Include × extend | Include: obrigatório, base necessita do incluído; extend: opcional/condicional | SAP 2018 · tec 639124 |
| Agregação × composição × associação | Agregação: todo–parte fraca (losango vazio); composição: parte morre com o todo (losango cheio); ambas são associações | UNIRIO 2019 · tec 1175309; SAP 2023 · tec 2695421 |
| Sobrecarga × sobrescrita | Mesmo nome, mesma classe, parâmetros diferentes × subclasse redefine com a mesma assinatura | Transpetro 2023 Q32 |
| Diagrama de contexto × DFD nível 1 | Contexto: um único processo e as entidades externas; nível 1 decompõe | Liquigás 2018 · tec 835973 |
| Modelo ambiental × comportamental | Ambiental: objetivos + contexto + lista de eventos; comportamental: DFD preliminar + DER + dicionário | Liquigás 2018 · tec 835973 |
| Teste unitário × integração | Unidade: função isolada, antes da integração; integração: módulos conversando | BNDES 2024 · tec 3117535 |
| Teste de sistema × aceitação | Sistema: equipe de teste, produto inteiro × requisitos; aceitação: usuários decidem liberar | Transpetro 2023 Q31 |
| Alfa × beta | Alfa: ambiente do desenvolvedor, equipe interna simula usuário; beta: usuários reais no ambiente deles | CEF 2024 · tec 2902002 e tec 3102748 |
| Estático × dinâmico | Estático não executa (revisão, walk-through, inspeção, análise estática); dinâmico executa | Transpetro 2023 Q23 |
| Caixa-branca × caixa-preta | Branca: estrutura, caminhos, ciclomática, fluxo de dados; preta: entradas/saídas, partição, valor limite | UNEMAT 2024 · tec 2838610; Liquigás 2018 · tec 835958 |
| Regressão × desempenho | Regressão reexecuta após mudança; desempenho mede tempo/carga | IPEA 2024 · tec 2780422 |
| Stub × mock | Stub responde (estado); mock verifica chamadas (comportamento) | IPEA 2024 · tec 2780425; CNU 2024 · tec 3038238 |
| Garantia × controle de qualidade | Garantia: processo, preventiva; controle: produto, detectiva | BANESE 2025 · tec 3347026 |
| Custo de prevenção × avaliação × falha | Planejar/treinar × revisar/testar/medir × retrabalho (interna) e suporte (externa) | Transpetro 2018 · tec 638886 |
| TDD: ordem | Teste antes do código, um por vez; "todos os testes depois todo o código" é falso | BASA 2024 · tec 3135890 |
| Fork × branch | Outro repositório × mesmo repositório | CNU 2024 · tec 3038236 |
| CI × entrega contínua × implantação contínua | Build/teste a cada commit × artefato pronto, deploy manual × deploy automático | [inferido]; CEF 2021 · tec 1854436 (shift-left) |
| Conteinerização × CI | Consistência entre ambientes × integração e teste a cada commit | BASA 2024 · tec 3135917 |

## 5. Lei seca e listas (o que precisa estar decorado literalmente)

- Verificação (ISO 9000): "confirmação, por meio de evidência objetiva, de que os requisitos especificados foram atendidos". Validação: "confirmação, por meio de evidência objetiva, de que os requisitos para um uso ou aplicação pretendidos foram atendidos". Gatilho: "evidência objetiva... requisitos especificados" → verificação.
- Categorias de RNF (Sommerville): produto (usabilidade, eficiência [desempenho, espaço], confiança, proteção/segurança); organizacionais (ambientais, operacionais, de desenvolvimento); externos (reguladores, éticos, legislativos [contábeis, segurança]). Gatilho: "três categorias: organizacionais, externos e de produto".
- Etapas do desenvolvimento de requisitos (Wiegers): elicitação, análise, especificação, validação (+ gerenciamento). Práticas-assinatura: elicitação = visão e escopo, identificar usuários, eventos e respostas; análise = protótipos, diagrama de contexto, priorização, alocação a subsistemas; especificação = SRS, regras de negócio, atributos de qualidade; validação = inspeção do SRS, critérios de aceitação, casos de teste.
- Técnicas de elicitação: entrevista, questionário, observação/etnografia, JAD/workshop, brainstorming, análise de documentos, cenários/casos de uso, prototipação, QFD.
- Técnicas de validação de requisitos: revisão (comentários), walk-through, inspeção, prototipação, geração de casos de teste.
- Modelos de ciclo de vida e seu adjetivo: cascata (sequencial, preditivo), V (sequencial com testes pareados), incremental (por partes), iterativo (por repetições), espiral (dirigido a riscos), prototipação (exploratória, descartável ou evolutiva), RAD (componentes, 60–90 dias), CBD (reuso), RUP (iterativo-incremental, casos de uso, arquitetura), ágil (iterativo-incremental adaptativo).
- Espiral (Boehm), quadrantes: objetivos e alternativas → análise e resolução de riscos (protótipo) → desenvolver e verificar → planejar o próximo ciclo. Primeiro ciclo: conceito de operação.
- RUP, 4 fases (CECT): Concepção, Elaboração, Construção, Transição. Marcos: objetivos do ciclo de vida, arquitetura do ciclo de vida, capacidade operacional inicial, release do produto.
- RUP, 9 disciplinas: modelagem de negócios, requisitos, análise e design, implementação, teste, implantação (engenharia); gerência de configuração e mudanças, gerência de projeto, ambiente (apoio).
- 4+1 (Kruchten): lógica, processo, implementação (desenvolvimento), implantação (física) + casos de uso.
- Manifesto Ágil, princípios-gatilho: "software funcionando é a medida primária de progresso"; "simplicidade, a arte de maximizar o trabalho não feito"; "as melhores arquiteturas emergem de times auto-organizáveis". TDD: vermelho → verde → refatorar.
- Diagramas UML 2 (14): estruturais = classes, objetos, componentes, implantação, pacotes, estrutura composta, perfil; comportamentais = casos de uso, atividades, máquina de estados, sequência, comunicação, visão geral de interação, tempo (os quatro últimos são de interação).
- Relações de casos de uso: associação (ator–caso), include, extend, generalização (atores ou casos). Relações entre classes: associação, agregação, composição, dependência, generalização, realização. Visibilidades: + − # ~.
- Elementos do DFD: processo, fluxo, depósito, entidade externa. Modelo ambiental: objetivos, contexto, lista de eventos. Comportamental preliminar: DFD preliminar, DER, dicionário de dados.
- Níveis de teste (ordem): unidade → integração → sistema → aceitação (Pressman: unidade, integração, validação, sistema). Executores: desenvolvedor, equipe de teste, usuário.
- Técnicas estáticas: revisão, walk-through, inspeção, análise estática. Caixa-branca: caminho básico (ciclomática E − N + 2P), cobertura de comandos/decisões/condições, fluxo de dados, laços. Caixa-preta: partição de equivalência, valor limite, tabela de decisão, transição de estados, matriz ortogonal. Dublês: dummy, stub, spy, mock, fake.
- Custos da qualidade: prevenção, avaliação, falha interna, falha externa. GCS: identificação, controle de versões, controle de mudanças, auditoria, relato de status; baseline.
- APF (só o nome): ALI, AIE (funções de dados); EE, SE, CE (funções de transação).

## 6. Revisão de véspera (checklist)

1. RF = o sistema FAZ (calcula, cadastra, emite); RNF = o sistema É ou está sujeito a (tempo, %, padrão, lei, ambiente).
2. Número, unidade, percentual ou tecnologia nomeada na frase: quase sempre RNF.
3. "A interface deve fornecer imagens por câmeras infravermelho" foi tratada como RNF (Q24, 2023).
4. Uma função rotulada como "usabilidade" é o EXCETO (SAP 2018).
5. RNF: produto (usabilidade, eficiência, confiança, proteção) · organizacional (ambiental, operacional, desenvolvimento) · externo (regulador, ético, legal).
6. Operacional é organizacional; legal e regulador são externos; eficiência e usabilidade são de produto.
7. Requisitos: elicitação → análise → especificação → validação; gerenciamento acompanha (mudança, rastreabilidade, baseline).
8. Validação de requisitos = inspecionar o SRS, critérios de aceitação, casos de teste. Análise = protótipos, diagrama de contexto, priorização.
9. Etnografia = imersão/observação no ambiente do usuário. QFD: esperado = implícito, sua falta insatisfaz. Requisito de negócio vem antes dos de usuário.
10. Sequenciais: cascata e V. Incremental NÃO é sequencial.
11. Incremental = versões sucessivas mais completas; iterativo = tudo com baixa fidelidade, refinando. "Interativo" é erro plantado.
12. Espiral = dirigido a riscos; análise de riscos antes do protótipo em cada ciclo; 1º ciclo = conceito de operação.
13. Se o diálogo descarta o especialista em risco, não é espiral: é incremental (Petrobras 2018).
14. Cascata só quando os requisitos são bem conhecidos; ciclo preditivo fixa escopo, prazo e custo.
15. RUP: Concepção (escopo, caso de negócio) · Elaboração (arquitetura + riscos) · Construção (código e testes) · Transição (implantação).
16. Lista de riscos = gerência de projeto; requisitos atua nas 4 fases; cada iteração gera sistema parcial testável e integrável.
17. 4+1: visão de processo = concorrência e paralelismo. UP não é alternativa ao ágil.
18. Agilidade = reagir e se adaptar mais rápido que a taxa de mudança. "Software funcionando é a medida primária de progresso."
19. TDD: um teste, falha, código mínimo, refatora, repete. Teste antes do código.
20. Fluxo de tarefas / processo de negócio → atividades, mesmo que o texto diga "colaboravam".
21. Mensagens entre objetos no tempo → sequência; evento assíncrono / ciclo de vida de um objeto → máquina de estados.
22. Casos de uso = relações entre atores (externos) e funcionalidades; equivale ao diagrama de contexto na análise OO.
23. Include = obrigatório ("necessita para sua execução"); extend = opcional/condicional. Entre atores só há generalização.
24. Estruturais: classes, objetos, componentes, implantação, pacotes. Comportamentais: casos de uso, atividades, estados, sequência, comunicação.
25. Sobrecarga = mesma classe, parâmetros diferentes; sobrescrita = subclasse, mesma assinatura.
26. Propriedade do tipo da outra classe = associação. Agregação (vazio) × composição (cheio, parte morre com o todo). Visibilidades + − # ~.
27. DFD: processo, fluxo, depósito, entidade externa. Contexto = um único processo. Análise estruturada = top-down.
28. Modelo ambiental = objetivos + contexto + lista de eventos. Comportamental preliminar = DFD preliminar + DER + dicionário.
29. "Confirmação, com evidência objetiva, de que os requisitos especificados foram cumpridos" = VERIFICAÇÃO. Uso pretendido = validação.
30. Estático = não executa: revisão, walk-through, inspeção, análise estática. Valor limite, partição, regressão são dinâmicos.
31. Inspeção é a mais formal (processo definido, fases, papéis); walk-through é conduzido pelo autor.
32. Unidade: função isolada, "mesmo antes da integração". Integração: interfaces entre módulos.
33. Sistema: equipe de teste, produto inteiro contra requisitos. Aceitação: representantes dos usuários decidem liberar.
34. Alfa: ambiente do desenvolvedor, equipe interna simula usuário. Beta: usuários reais no ambiente deles.
35. Regressão: reexecutar após mudança para garantir que nada quebrou; não é desempenho.
36. Ciclomática V(G) = E − N + 2 = decisões + 1 (9 nós, 11 arestas → 4).
37. Caixa-preta: partição de equivalência (um por classe) e valor limite (fronteiras). Caixa-branca: caminho básico, fluxo de dados.
38. Mutação: versões levemente modificadas do programa para avaliar os testes.
39. Stub responde (resultado); mock verifica chamadas (comportamento); API externa em teste unitário → mock.
40. Equipe de testes entra na etapa de requisitos (shift-left).
41. Custo de prevenção = planejar, treinar, coordenar; revisões e testes = avaliação; retrabalho = falha interna.
42. Garantia da qualidade = processo, preventiva; controle = produto, detectivo.
43. GCS = registrar e justificar toda mudança, rastreabilidade, versões, baseline; não testa, não estima.
44. Fork = outro repositório; branch = mesmo repositório; tag = marca ponto; commit = local; push = envia; pull = traz. Integrar: checkout main → merge → push.
45. CI = build e testes a cada commit; entrega contínua = artefato pronto, deploy manual; implantação contínua = deploy automático; contêiner = consistência entre ambientes; IaC declarativa = estado desejado.

## 7. Fontes usadas

- `cadernos/caderno06.txt` (193 questões Cesgranrio 2016–2026 de Engenharia de Software e UX; usadas neste guia as de requisitos, ciclos de vida, RUP, princípios ágeis, TDD, DevOps, análise estruturada, OO, UML, testes, qualidade, gerência de configuração e Git).
- `txt/indice_06.txt` (contagens por assunto).
- `txt/prova2023.txt` (Prova 6, Transpetro 2023: questões 23, 24, 25, 31, 32 com resolução comentada e gabarito oficial definitivo de 09/01/2024; distribuição por bloco na página 1).
- `fontes/planilha_es.txt` (Padrão da Banca B5.01–B5.06, Pares e Pegadinhas, Lei Seca, Questões-Chave, Resumo).
- `C:\Users\ronal\Downloads\Conteudo_Programatico_Comentado_Transpetro2026.md`, linhas 146–174 (famílias E e U) e 667–730 (Bloco 5).
- `txt/dossie.txt`, seção 2.4; `txt/relatorio_docx.txt`, seção 3.3.
- Teoria de apoio: GranCursos, 06 - Engenharia de Software, resumos 001–004 (conceitos gerais e ciclos de vida), 007–013 (requisitos), 014–023 (testes), extraídos para `txt/es_NNN.txt`; Sommerville (Engenharia de Software, 9ª/10ª ed.), Pressman (Engenharia de Software, 7ª/8ª ed.), Wiegers (Software Requirements), Kruchten (RUP), OMG UML 2.5, Yourdon (Análise Estruturada Moderna), ISO 9000 (definições de verificação e validação).
