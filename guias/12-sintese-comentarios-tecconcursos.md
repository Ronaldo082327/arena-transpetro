# Síntese dos comentários do TecConcursos (280 questões)

Texto escrito com palavras próprias, a partir da leitura dos 280 registros (comentário do professor e comentários de alunos) e dos enunciados em `plataforma/questoes.json`. Não reproduz frases de professores nem de alunos. Substitui a síntese anterior, que cobria só 76 questões de Banco de Dados.

Prova-alvo: Transpetro 2026, Ênfase 5 (Analista de Sistemas, Processos de Negócios), Cesgranrio, 06/12/2026.

---

## 1. Cobertura e limites

**É uma amostra, não a base inteira.** São 280 questões coletadas até o site bloquear a coleta. Toda conclusão abaixo vale para essa amostra. Não generalize para a prova inteira sem cuidado.

| Disciplina (campo `disc`) | Registros | Sem comentário do professor | Comentário do professor cortado (2.200 caracteres) | Comentários de alunos (vazios) |
|---|---|---|---|---|
| Dados | 93 | 11 | 58 | 269 (30) |
| Sem disciplina (todos de Banco de Dados pelo conteúdo) | 25 | 3 | 11 | 47 (7) |
| BI e Ciência de Dados | 34 | 8 | 20 | 100 (21) |
| Engenharia de Software e UX | 34 | 5 | 12 | 91 (5) |
| Segurança | 34 | 21 | 10 | 85 (7) |
| Projetos | 26 | 0 | 23 | 53 (11) |
| Governança e LGPD | 34 | 1 | 17 | 88 (13) |
| **Total** | **280** | **49** | **151** | **733 (94)** |

- **Banco de Dados domina.** Somando os 25 registros sem disciplina, são 118 questões de Dados (42% da amostra). Os 25 sem disciplina não têm enunciado, assunto nem gabarito no registro. Só o texto do professor permite saber o tema. Quatro deles são novos em relação à síntese anterior: 200241, 2324413, 2327007, 265749.
- **Origem das provas.** BANESE 41, IPEA 39, BNDES 36, CEF 32, BASA 21, Transpetro 21, CNU 18, UNEMAT 9, UNIRIO 8, Liquigás 8, BB 6 e outras. Anos: 2024 (137), 2025 (41), 2023 (26), 2026 (10), anteriores (36), sem ano (25).
- **Transpetro.** 21 questões: 18 de Dados, 2 marcadas como Governança e 1 de Projetos. As de Processos de Negócios (o cargo-alvo) são 2695280, 2695281, 2695285, 2695286, 2695304, 2695316, 2695322, 2695323 (2023) e 638908, 638918, 638930 (2018). Todas de Dados, exceto 2695316 (LGPD).
- **Lacunas grandes.** Nada de Português, Inglês ou Lógica. Nada de BPM ou BPMN, apesar de ser o núcleo do cargo (há 4 questões de BPM em `questoes.json`, mas sem comentário coletado). Em "Engenharia de Software e UX", UX quase não aparece: só prototipação (2838606) e, de passagem, teste de carga (3347020). Projetos tem só 26 questões.
- **Segurança com pouca explicação.** 21 das 34 não têm professor. São quase todas da BANESE 2025 (Suporte). Ali a explicação vem só de alunos, e vários comentários se apresentam como gerados por IA. Use como pista.
- **Comentários cortados.** 151 textos de professor pararam em 2.200 caracteres. Muitas vezes a análise das últimas alternativas se perdeu.
- **Figuras ausentes.** Diagramas, tabelas e sublinhados não vieram. Em 835993 (Liquigás 2018), 638930 (Transpetro 2018) e 2694191 (Transpetro 2023) alternativas aparecem idênticas porque a marcação de chave sumiu. Nessas, não dá para julgar o gabarito só com o texto.
- **Classificação errada no site.** 2902007 (complemento de dois) está como Álgebra Relacional. 2694768 (ciclo de vida de projeto) está como Governança. O enunciado de 2780898 veio misturado com pedaços de outra questão.
- **Comentários de alunos são pista, não fonte.** Parte foi colada de outros sites (QC, Estratégia) e parte é de IA. Usei o número de votos como sinal de aceitação, nada além disso. O campo `nStud` vem zerado em 80 registros e não foi usado.

---

## 2. Por disciplina

### 2.1 Dados (118 questões, contando as 25 sem disciplina)

A síntese anterior (76 questões) continua válida no essencial. Aqui entram os acréscimos das 42 novas e o quadro consolidado.

**Explicações-chave por tipo de questão**

- *Cardinalidade (min,max) em MER.* Os professores reforçam a leitura cruzada: o par escrito ao lado de uma entidade diz quantas dela correspondem a uma ocorrência da outra. Em 3347127 o professor monta passo a passo: "cada pedido tem exatamente um cliente" vira (1,1) do lado de Cliente; "cliente pode fazer vários, mas nem todo faz" vira (0,n) do lado de Pedido. Mínimo sai das palavras "pode", "nem todo" (0) e "deve", "exatamente" (1).
- *Conjuntos e tuplas.* Teste cada regra contra os dados. Máximo 1 é violado por quem aparece duas vezes. Mínimo 1 é violado por quem não aparece. Mínimo 0 nunca é violado. Comece pelo relacionamento menor (2695280). Em 2401433 e 2690881 o erro escondido é um elemento do lado "no máximo um" que aparece com dois parceiros.
- *Generalização.* Total ou parcial (a união dos filhos cobre o pai?) e exclusiva ou sobreposta (há interseção?). PRÉDIO residencial, comercial ou misto, "e apenas isso", é total e sobreposta (3117564). Em exclusiva e parcial, o conjunto vazio para a outra subclasse é válido (3346871). Herança desce do supertipo para o subtipo, nunca sobe (3347165).
- *Mapeamento ER para relacional.* Vários professores usam a mesma regra prática (Heuser): fusão só em 1:1 e nunca em (0,1)-(0,1); adição de coluna no lado N em 1:N; tabela própria obrigatória em N:N, com chave reunindo as chaves das entidades (e atributos do relacionamento, se houver). A chave da tabela do relacionamento revela a cardinalidade: se só uma das FKs é PK, aquele lado tem máximo 1 (1176543, 1928229, 638864). `UNIQUE` sem `NOT NULL` indica (0,1); com `NOT NULL`, (1,1). Em 3347155 a alternativa certa reúne as regras: autorrelacionamento com FK na própria tabela, tabela por subtipo com PK que também é FK, tabela separada para atributo multivalorado.
- *Normalização (12 questões novas).* Roteiro dos comentários: 1FN proíbe multivalorado; 2FN só pode falhar se a chave for composta (dependência de parte da chave); 3FN proíbe não chave determinando não chave. Exemplos: NumAgencia determina NomeAgencia com chave (NumAgencia, Conta) quebra a 2FN (3347120); codAgencia determina telefone em ContaCorrente quebra a 2FN (3135435); cidade determina UF quebra a 3FN e gera tabela CIDADE (1927609); município determina UF quebra a 3FN (2780898). Sem chave composta e sem transitivas, nada mais precisa ser feito (619532). Contar tabelas: em 2041265 só um atributo depende de parte da chave, então bastam 2 tabelas para a 2FN.
- *Chaves.* PK é única, não nula, e uma só por tabela, podendo ser composta. FK aceita nulo e repete. PK pode ser FK ao mesmo tempo (3135883). Acrescentar RG não muda a PK CPF; RG vira candidata (3117552). Em TRANSFERENCIA, com no máximo uma transferência por segundo entre duas contas, a PK tem todos os atributos menos o valor (1927614). Entidade fraca se reconhece pela chave que inclui a chave da forte: TURMA (COD_DISCIPLINA, NUMERO) (2901972).
- *SQL (7 questões).* `HAVING` filtra grupos depois do `GROUP BY` (2779626). `IN` com subconsulta e `EXISTS` correlacionado se somam com AND (2780882). `NOT EXISTS` devolve também quem não tem nenhuma linha na outra tabela, e o limite estrito importa: valor 10 não é menor que 10 (3135437). Coluna nova é `ALTER TABLE ... ADD COLUMN` (3038239). `UPDATE` sem `WHERE` altera tudo (3804817). Visão com junção gera atualização ambígua (3347173).
- *Álgebra relacional.* SELECT do SQL corresponde à projeção; WHERE, à seleção. Ordem segura: junção, depois seleção, depois projeção. Em 2779624 a alternativa errada até tem as operações certas, mas o resultado final não traz CPF e nome.
- *Conceitos soltos.* Domínio é o conjunto de valores permitidos (3102810). `CHECK` testa uma regra sobre o próprio valor (3117566). SERIALIZABLE é o maior isolamento; dizer que roda uma transação por vez é exagero (3117565). Linhas não têm ordem; trocar colunas de lugar não muda o significado (3347101). ANSI/SPARC: mudar o nível interno sem tocar conceitual e externo (2694738, 3347097). Desempenho: desnormalização dirigida a junções frequentes, nunca "tudo" (2695304, 3102719).

**Confusões que os alunos relatam**

1. Aceitar a leitura cruzada da cardinalidade. Vários dizem que só resolve desenhando.
2. Achar que todo relacionamento vira tabela (634014) ou que 1:N com atributo exige tabela própria (1176543).
3. Esquecer que `NOT EXISTS` inclui quem não tem empréstimo nenhum.
4. Não entender por que as contas entram na PK de TRANSFERENCIA (resposta de um aluno: outras contas podem transferir no mesmo segundo).
5. Entidade fraca: um aluno a define como "só chaves estrangeiras" e depois corrige; fraca pode ter chave parcial própria.
6. Tabelas e sublinhados perdidos na plataforma (638930, 2780903, 2901972, 2694191). Parte da dificuldade é visual.
7. Ternário: avaliar a cardinalidade por pares (1175342, 2462831).
8. Queixa de excesso de conteúdo e de nível pesado para cargos de nível médio (654524, 3805026).

**Pegadinhas recorrentes**

- Alternativas iguais exceto por um sublinhado, um colchete, um `NOT NULL` ou um `UNIQUE`.
- Elemento que não existe no conjunto (x7 em 3346871, x0 em 836024).
- FK do lado errado do 1:N.
- Sintaxe inventada: `PRIME KEY`, `CHECKE`, tipo `DAT`, vírgula faltando (3347163); `INCLUDE COLUMN`, `MODIFY TABLE` (3038239).
- Campos trocados no SELECT (3805026).
- "A chave composta deveria ter um atributo só" e "duas chaves primárias" como distratores.
- Dependência não ligada à chave (RG determina nome) oferecida como violação de 2FN (2780898).

**O que isso revela da Cesgranrio**

Cenário narrado, notação própria explicada no enunciado (colchetes, sublinhado, REF) e verificação mecânica. Em BD a banca premia rotina, não memória. A notação de cardinalidade segue Heuser, como mostram as cinco questões analisadas em `gabaritos_contestados.md`.

### 2.2 BI e Ciência de Dados (34 questões)

**Explicações-chave por tipo de questão**

- *Python (5 questões).* `"{:.1f}".format()` arredonda para uma casa; `.1g` e `.1e` mudam a notação; `round(x,0)` dá 12.0 (2779647). `all()` equivale a "nenhum ímpar"; a alternativa mais marcada invertia a lógica e parava no primeiro par (2779649). Em herança múltipla, `super()` segue a ordem da esquerda para a direita na declaração (2779650). Lista é mutável, aceita repetidos e tipos misturados (2779651). Em list comprehension, os parênteses decidem a combinação de `or` e `and` (3804819).
- *Big Data.* Spark Core cuida de agendamento, memória e distribuição; SQL, Streaming, MLlib e GraphX são módulos à parte (2779605). HDFS tolera falhas dividindo em blocos e replicando em máquinas diferentes (3038309). MapReduce é a solução simples de processamento paralelo (2779619).
- *Ingestão.* Lote roda em intervalos; streaming processa enquanto o dado nasce (2779608). Monitorar trânsito ou clima pede tempo real (2779611). Na transformação, dado não estruturado pode exigir NLP ou reconhecimento de imagem (2779601).
- *Enriquecimento.* Acrescentar dado que não existia na origem: fonte externa ou coluna derivada, como sentimento de um comentário (2779642, 3117668). Imputar ausentes com média do próprio conjunto não é enriquecimento.
- *Governança e qualidade de dados (DAMA).* Registro único compartilhado por organizações é MDM (2780012). Precisão e completude são gerenciamento da qualidade (2780450). Monitorar qualidade exige indicadores contínuos (3117563). Padrões de integração: migração (uma vez), transmissão (um para muitos, contínuo), sincronização bidirecional, correlação (só o que é comum), agregação (muitos para um) (2780459).
- *Modelagem dimensional.* Medida numérica vai no fato; data, local e categoria vão em dimensão (2780498). Tempo é a dimensão sempre presente (3102806). Tabela com FKs e valores orçado e executado é o fato (3117556). Soma de leitos é aditiva; taxa de mortalidade não se soma nem se tira média simples (3117558). Para sair do estado para uma cidade: drill down e depois slice (3038306). O processo que leva dado do transacional ao DW é ETL (3135881).
- *Data lake e DW.* DW define estrutura antes de gravar (3118351). Metadados de data lake podem ser descobertos em parte de forma automática (3117562). Sem metadado descritivo não se avalia qualidade (3117664).
- *Processos de mineração.* CRISP-DM: na compreensão dos dados se exploram características e relação com o negócio (3115515). TDSP: na aquisição e entendimento se monta o fluxo que atualiza os dados (3118372). Discretização por histograma é não supervisionada (3118375; o professor só deixou links).
- *IA e operação.* Prever demanda com histórico é aprendizado supervisionado (3347354). Prometheus coleta métricas, ElasticSearch guarda logs, Zabbix vigia disponibilidade, Grafana mostra (3347361). AIOps usa aprendizado para antecipar falhas e automatizar correção (3347364). Kafka com Druid forma um gerenciador de análise de fluxo (3117607).

**Confusões dos alunos**

- Por que imputação de ausentes não é enriquecimento (2779642).
- Média ou soma em modelo dimensional (3117558): um aluno achou que C e E serviriam.
- O gabarito de 3102806 já esteve errado na plataforma, segundo alunos.
- Kafka e Druid (3117607): termo pouco conhecido; um aluno sugere ir pela tradução e pela ideia de decisão em tempo real.
- Medo de alternativa óbvia demais (2780450, 3117556).

**Pegadinhas recorrentes**

- Nomes em inglês plausíveis e inventados (Data Event Pipeline, Data Science Manager, Entity Manager Factory).
- Palavras absolutas ("sempre transferidos sem transformação", "exclusivamente por APIs").
- Inverter a lógica em código (all com `!=`, `and` no lugar de `or`).
- Taxa tratada como medida aditiva.

**Estilo revelado.** Enunciado longo com resposta curta. A palavra-chave do enunciado costuma bater com o nome do conceito (registro único e MDM; um para muitos contínuo e transmissão). Python cobra leitura de código, não sintaxe rara.

### 2.3 Engenharia de Software e UX (34 questões)

**Explicações-chave por tipo de questão**

- *Scrum.* Só o PO cancela a Sprint, e só quando a meta fica obsoleta (2780025). Melhorar o processo do time vai para a Retrospectiva; inspecionar o produto vai para a Review (2901980). A primeira reunião do ciclo é a Planning (2902016). A lista do trabalho da Sprint é o Sprint Backlog (3117587). Valor e prioridade do backlog são do PO (3135940). Impedimento vai para a Daily seguinte, não espera a Review (3804752). No Nexus, a peça nova é o Time de Integração (3117539).
- *Ágil em geral.* Histórias de usuário têm cartão, conversa e confirmação (2901986). Story points estimam esforço relativo, não horas nem custo (2901989). Perfil ágil: abertura a mudança e contato com o cliente; RUP e requisitos fechados indicam o tradicional (2901934). Kanban limita trabalho em andamento (WIP) (3102744); quadro a fazer, fazendo, feito é o Kanban de produção (3117586).
- *UML.* Ator é quem interage diretamente com o sistema; o passageiro que só fala com o atendente não é ator, a balança é (2780042). Associação aparece como atributo que guarda o outro objeto; dependência aparece como parâmetro de método (2780413, 2838611). Mensagens ao longo do tempo é diagrama de sequência (2838618). Par estrutural e comportamental: classes e atividades (3135420). Caso de uso mostra a relação entre atores externos e funções (2838605).
- *Processos e modelos.* Espiral: o primeiro ciclo produz o conceito de operação (2838601). Processo Unificado: concepção, elaboração (arquitetura e plano detalhado), construção e transição (3102860, 3135412).
- *Testes e qualidade.* TDD: escrever um teste, ver falhar, implementar o mínimo, refatorar, repetir (2780424, 3135890). Limite de capacidade e tempo de resposta é teste de carga (3347020). Garantia da qualidade atua no ciclo de vida inteiro (3347026).
- *DevOps e arquitetura.* IaC declarativa descreve o estado final desejado (3117630). Funcionar igual em vários ambientes é conteinerização (3135917). Plataforma completa sobre Kubernetes com gestão de ciclo de vida é OpenShift (3347370). Arquitetura de referência não ignora interoperabilidade (3102846).
- *Padrões de projeto.* Árvore de pastas e arquivos tratados igual: Composite (3346894). Esqueleto fixo na superclasse com passos nas subclasses: Template Method (3346896).
- *UX.* Protótipo em papel, detalhando um caso de uso: vertical, descartável e de baixa fidelidade (2838606). É o único item claro de UX na amostra.

**Confusões dos alunos**

- Quem cancela a Sprint: muitos não sabiam que é só o PO.
- Passageiro como ator (2780042): parte dos alunos insistiu que ele participa.
- Associação versus dependência (2838611): um aluno resume com vínculo duradouro e encontro passageiro.
- "Todos os testes já criados" na alternativa certa de TDD (3135890) assustou quem desconfia de palavras absolutas.
- Kanban de produção versus movimentação (3117586).
- Alunos relatam que a plataforma já mostrou gabarito errado em 3102846.

**Pegadinhas recorrentes**

- Papel ou evento inexistente (Scrum Manager, Product Owner Talk, Nexus Boss, Supervisor de Sprint).
- Trocar Review por Retrospectiva.
- Story points em horas.
- Diagrama da categoria errada no par estrutural e comportamental.
- Alternativa "quase certa" que delega o que não pode ser delegado (cancelar Sprint).

**Estilo revelado.** Situação de time com uma regra do guia (Scrum Guide, Nexus) por trás. A Cesgranrio às vezes escolhe a versão menos rigorosa (2780025) e a mantém. UX praticamente não aparece; não conclua que a prova não cobrará UX.

### 2.4 Segurança (34 questões)

**Explicações-chave por tipo de questão**

- *Princípios e serviços.* Economia de mecanismo: projeto pequeno e simples (2780486). Irretratabilidade é o mesmo que não repúdio, impede negar a autoria (3038223, 3116448). Cifra simétrica dá confidencialidade (3347175).
- *Mecanismos criptográficos.* Integridade sai do resumo de mensagem (hash), como MD5 (3346350, 3347864). Autenticidade sai da assinatura digital (3347861). Assinar usa a chave privada do remetente; conferir usa a pública dele (3346878). Para enviar a chave secreta só ao destinatário, cifre-a com a chave pública dele: é o envelope digital (3347857). Certificado de pessoa física contém obrigatoriamente a chave pública dela (3347858). Maior confiabilidade com ICP-Brasil: assinatura eletrônica qualificada (3347865). TLS substituiu o SSL 3.0 (3347090).
- *Normas ISO.* Na 27001, avaliação de desempenho inclui análise crítica pela direção (2780874); melhoria inclui não conformidade e ação corretiva (3116487). Um aluno organizou: auditoria interna, monitoramento e análise crítica ficam em avaliação de desempenho; tratamento de riscos fica em operação. PDCA é iterativo (3116395). Na 27005:2019, as opções de tratamento são modificar, reter, evitar e compartilhar; incluir ou alterar controles é modificar (2780875). Na 27005:2023, vulnerabilidade é fraqueza explorável; causa potencial é ameaça; fonte de risco e incidente são outros termos (3116400). Na 27002:2022, o atributo "domínios de segurança" tem Governança_e_Ecossistema, Proteção, Defesa e Resiliência (3116485). O professor avisa que essas questões são literais.
- *NIST.* No CSF 1.1, compreender riscos de sistemas, pessoas e ativos é a função Identificar (2780863); um aluno lembra que a versão 2.0 acrescentou Governar. No SP 800-61, decidir se houve incidente é a fase de detecção e análise (2780872).
- *Controle de acesso e rede.* Definir permissões desde a contratação é prevenção pelo menor privilégio (2780015). RBAC atribui papéis; permissão individual é DAC; atributos como horário são ABAC (3347058). 802.1X: o autenticador fica entre o requerente e o servidor (3347869). Intranet com certificado e VPN para acesso externo (3346039).
- *Ataques e defesas.* Ataque passivo só observa (3347853). Falsificar IP de origem é spoofing (3347854). Ponto de acesso falso com o mesmo SSID é Evil Twin (3347855). Troiano com porta dos fundos é RAT (3347856). Minerar cripto no computador da vítima é cryptojacking (3347859). Isca com brinde é baiting (3347860). Filtro de spam por probabilidade é bayesiano (3347862). Monitorar e alertar é IDS (3347863). Configurar para eliminar vulnerabilidades conhecidas é hardening (3347852). Backup diferencial copia o que mudou e o que é novo desde o último completo (3347873).

**Confusões dos alunos**

- Autenticidade versus irretratabilidade.
- Hash garante integridade, mas não autoria; para autoria entra a chave privada.
- Qual chave usar em cada operação (assinar versus cifrar para alguém).
- Diferencial versus incremental.
- Em que cláusula da 27001 cada item fica (3116487): o professor se apoia na seção de análise crítica, e não na de melhoria; a explicação dos alunos, cláusula por cláusula, está mais clara.

**Pegadinhas recorrentes**

- Termos inexistentes ao lado do certo: irretroatividade, sealing, jamming, evading, misleading, DNR.
- Trocar CID (confidencialidade, integridade, disponibilidade) pelos domínios da 27002.
- "Aceitação" como opção da 27005:2019, que fala em retenção.
- Assinatura com chave pública.

**Estilo revelado.** Definição de norma quase literal e cenário bancário. Cobra vocabulário em inglês. Como 21 questões não têm professor, esta é a disciplina com explicação menos confiável na amostra.

### 2.5 Projetos (26 questões)

**Explicações-chave por tipo de questão**

- *Ciclo de vida e abordagens.* Escopo, prazo e custo fixados no início, como cascata: preditivo (2780010). Entregar com pouca documentação e muita conversa: ágil (2461442). A vantagem principal do ágil é a flexibilidade diante de mudanças (2838570).
- *Curvas do ciclo genérico.* Custo e pessoal começam baixos, sobem e caem no fim. Risco e influência das partes interessadas começam altos e caem. Custo de mudança cresce (2780680, 3037519, 2694768). Por isso, mudança no fim pede mais critério (3037519).
- *Riscos.* Primeiro passo é identificar (3037743). Reserva de contingência é aceitação; seguro é transferência; mudar o plano para zerar a ameaça é prevenir (3038525). Monitorar o clima e ter cobertura pronta é mitigação (3037723). Custo do dinheiro e matéria-prima são riscos externos previsíveis na classificação de Wideman (2838572). VME: 0,6 vezes 500 mil menos 0,4 vezes 500 mil dá lucro de 100 mil (2780682).
- *Cronograma.* Paramétrica usa relação estatística com dados históricos; análoga copia projeto parecido; três pontos usa média ponderada; bottom-up soma a EAP (3037543). Caminho crítico é o mais longo e define a duração mínima (3805315). Alongar um caminho que não é crítico, sem passar dele, não muda a duração (3037439). Gantt mostra barras no tempo e não otimiza (2838564).
- *Custos e valor agregado.* SPI = VA/VP; CPI = VA/CR; abaixo de 1 é atraso e estouro (3805293). Controle de custos: linha de base, custos reais, comparação com valor agregado e ação corretiva (3120239).
- *Organização e partes interessadas.* EGP de suporte (controle baixo) guarda lições aprendidas; de controle exige conformidade; diretivo gerencia os gerentes (2780672). Parte interessada é quem afeta, é afetado ou se sente afetado (3038514). Baixo poder e alto interesse: manter informado (3120237). Programa trata conflitos entre projetos do grupo; portfólio trata escolha e alinhamento estratégico (3037551).
- *Conceitos gerais.* Definição de gerenciamento de projetos do PMBOK (2690910). Objetivo é gerar valor, não garantir sucesso absoluto nem eliminar riscos (3805316). Planejamento acontece no início e volta ao longo do projeto (3805317).

**Confusões dos alunos**

- Risco cresce ou cai ao longo do projeto (cai).
- Mitigar versus aceitar com contingência (3037723): alunos discutiram se D também seria mitigação.
- VME: alguns nunca tinham visto a técnica.
- Ciclo de vida com 4 ou 5 fases (3805317): o PMBOK 6 fala em fases genéricas; o enunciado listou os grupos de processos como fases.
- PMBOK 7: um aluno lembra que a versão atual troca processos por princípios e domínios, o que derruba alternativas de padrão rígido.

**Pegadinhas recorrentes**

- Inverter o sentido das curvas (risco baixo no início).
- Métodos inexistentes ("métodos sobrepostos").
- Absolutos: "eliminar todos os riscos", "garantir sucesso absoluto", "equipe fixa".
- Folga no caminho crítico (é zero).
- Confundir programa com portfólio.

**Estilo revelado.** Texto quase copiado do PMBOK 6, com cálculos rápidos (VME, SPI, CPI, caminho crítico). Questões da CEF 2026 já trazem PMBOK 7. Em 3 das 26 o professor viu problema de redação (2838564, 3805315, 3805317).

### 2.6 Governança e LGPD (34 questões: 17 de LGPD, 17 de governança e gestão de TI)

**Explicações-chave por tipo de questão**

- *LGPD, definições e princípios.* Anonimização é a perda de associação com a pessoa por meios técnicos razoáveis (2398872, 2462910: o mesmo texto da lei, duas vezes). Dado sensível tem lista fechada; CPF e estado civil não entram (3117863, 2868848). Princípios por palavra-chave: propósito informado é finalidade; compatibilidade é adequação; mínimo necessário é necessidade; consulta gratuita é livre acesso; informação clara é transparência (2780868, 3103170, 3804766). Direitos humanos estão entre os fundamentos do art. 2, que são diferentes dos princípios do art. 6 (3135067).
- *LGPD, aplicação e bases legais.* Vale para pessoa natural ou jurídica, com regra de território (2695316, prova Transpetro). Compartilhar com parceiro exige consentimento específico (2461201). Autorização genérica não é hipótese válida (2482254). Agência reguladora pedindo dados: obrigação legal ou regulatória (3135382). Encarregado faz a ponte com a ANPD (2901893). A ANPD pode exigir o relatório de impacto do controlador; não é tarefa do encarregado nem obrigação automática com dado sensível (3037522). Uso compartilhado no poder público pede formato interoperável e estruturado (3037797). Segurança: controle de acesso com registro e treinamento (3102586). Privacidade do titular impede informar terceiro (2300088).
- *ITIL.* Central de serviços é o primeiro nível (2780011). Problema é causa raiz (2901976, 3117593). Nível de serviço define SLA (3117590). CAB e RFC medem gestão de mudança (3117543). Alinhar processos a políticas e integrar ao COBIT é o componente governança do sistema de valor (3135939).
- *COBIT e BSC.* COBIT 5: ver a organização como um todo é abordagem holística (2780019). COBIT 2019: integrar risco de TI ao risco corporativo fica em APO (2901978); EDM é o domínio de governança. BSC: processos internos tratam eficiência dos processos críticos (2780007). No BSC de TI do COBIT 5, o compromisso da alta gestão com decisões de TI fica na dimensão financeira (3038234), o que surpreende; um aluno propõe uma regra de bolso para as quatro dimensões.
- *Sistemas de informação.* Relatório resumido para gerência média é SIG; simulação de cenários é SAD; visão estratégica é SIE (2838608, 3038246).
- *Maturidade.* Nível 5 do CMMI equivale ao A do MPS.BR (2901992). Os dois tratam de melhoria de processo, não certificam produto; MPS.BR tem 7 níveis (3102804, sem professor).
- *Contratações e indicadores.* ROI conta só os custos do próprio projeto; os lançados em projetos antigos ficam fora: (445.890 menos 113.790) dividido por 113.790 dá cerca de 292% (3117542). Contratação de TIC no SISP: planejamento, seleção do fornecedor e gestão do contrato (3117589; o professor cita a IN 1/2019, o assunto do site cita a IN 94/2022).

**Confusões dos alunos**

- Fundamentos (art. 2) versus princípios (art. 6).
- Dado pessoal versus sensível; um aluno traz decisão do STJ sobre dano moral em vazamento de dado comum.
- Dimensão do BSC de TI (3038234).
- Quais custos entram no ROI.
- Comentários sem conteúdo em questões fáceis de LGPD (piadas em 2300088).

**Pegadinhas recorrentes**

- Palavras genéricas no lugar do termo da lei ("obrigação essencial", "recomendada", "restritiva").
- "Apenas sensíveis exigem consentimento", "sem extraterritorialidade", "revogação apaga tudo".
- Responsável errado pelo relatório de impacto.
- Agências com sigla parecida (ANP, ANAC, ANEEL, ANVISA) no lugar da ANPD.
- Função de outro processo ITIL atribuída à central de serviços.

**Estilo revelado.** LGPD é cobrada pelo texto literal do artigo, embrulhado num caso. Governança de TI mistura ITIL v3 e v4, COBIT 5 e 2019 na mesma prova. Questão da Transpetro 2023 Infraestrutura (2694768) sobre ciclo de vida apareceu como "governança", sinal de que a banca mistura temas.

---

## 3. Divergências de gabarito e questões que professores dizem ser anuláveis

**As cinco já analisadas com figura** (1757828, 2671161, 2671171, 3038281, 638908): ver `gabaritos_contestados.md`. Conclusão de lá: marcar o gabarito oficial nas cinco, com confiança alta.

**Demais casos da amostra**

| id | Disciplina e prova | Oficial | Quem contesta e por quê | Minha avaliação |
|---|---|---|---|---|
| 2694191 | Dados, Transpetro 2023 Infra | A | Professor: D, porque não se funde (1,1)-(0,n); vê recurso | Oficial A é plausível. No texto coletado, D (e E, que veio idêntica) põe nome da disciplina em CURSOU, o que fere a 2FN. O ponto do professor (professor sem disciplina se perderia) é razoável, mas sem a figura não dá para fechar. Confiança média |
| 3102775 | Dados, CEF 2024 | A | Banca trocou C por A (aluno cita alteração no site da Cesgranrio) | A é a única definição correta de normalização. Alta |
| 835993 | Dados, Liquigás 2018 | C | Alunos: tabela de N:N com chave só em a1, deveria anular | Alternativas vieram idênticas (sublinhado perdido). Não avaliável sem a figura |
| 2401460 | Dados, BB 2023 | D | Aluno: R1 sozinho bastaria como chave (E) | D (X1, Y1, R1) é coerente com um N:N que se repete para o mesmo par, distinguido por R1. Sem a figura, média alta para D |
| 2779626 | Dados, IPEA 2024 | B | Aluno: comando devolve produto, não fornecedor | A frase do enunciado já fala em produtos; B completa. Alta para B |
| 1175339, 265680, 265745, 401546, 2462831 | Dados | D, D, B, C, A | Alunos discordam de cardinalidades ou da notação (ver síntese anterior) | Sem figura; oficial é o mais provável. Média |
| 2779619 | BI, IPEA 2024 | A | Professor: mais de uma correta, deveria anular | A é a mais segura. B fala em "um ou mais pares" por registro, quando map pode emitir zero; isso a enfraquece. Anulação pouco provável |
| 3102806 | BI, CEF 2024 | E | Alunos: a plataforma mostrava outro gabarito | E (tempo) é o consenso. Alta |
| 3117558 | BI, BNDES 2024 | E | Aluno: média (C) também serviria | Média simples de taxas não representa o estado. Alta para E |
| 2780025 | Eng. Software, IPEA 2024 | D | Professor propõe anular: só o PO cancela, e D põe o SM encerrando a pedido do PO | Argumento forte pelo Scrum Guide, mas nenhuma alternativa mostra o PO cancelando sozinho. Anulação plausível (média). Na prova, a banca manteve D |
| 2780369 | Eng. Software, IPEA 2024 | A | Professor propõe anular (justificativa cortada) | Sem figura e sem o fim do comentário. Não avaliável |
| 3102846 | Eng. Software, CEF 2024 | A | Alunos: a plataforma tinha B | A é a única falsa, como pede o "NÃO". Alta |
| 3135890 | Eng. Software, BASA 2024 | C | Aluno estranha "todos os testes já criados" | Rodar todos os testes a cada ciclo é parte do TDD. Alta |
| 2780672 | Projetos, IPEA 2024 | C | Banca alterou o gabarito para C | EGP de suporte, controle baixo. Alta |
| 3037439 | Projetos, CNU 2024 | E | O professor escreveu "Letra D" no topo, mas sua conta leva a E | Erro de digitação do professor. Alta para E |
| 2838564 | Projetos, UNEMAT 2024 | B | Professor: não vê razão clara para B ser melhor que A | Gantt como ferramenta que não otimiza é leitura clássica de administração da produção. Alta para B |
| 3805315 | Projetos, CEF 2026 | D | Professor: A também correta (folga zero existe), anular | D é a definição canônica; A é ambígua. Anulação de baixa a média |
| 3805317 | Projetos, CEF 2026 | B | Professor: enunciado confunde fases com grupos de processos | Premissa mal escrita, mas B é coerente. Anulação média |
| 2838572 | Projetos, UNEMAT 2024 | C | Aluno pede anulação | Classificação de Wideman fecha com C. Alta |
| 3037723 | Projetos, CNU 2024 | C | Aluno: D também seria mitigação | Reprogramar a atividade muda o plano (mais perto de evitar) e não garante o prazo. Média alta para C |
| 2868848 | Governança, BNB 2024 | D | Professor: redação truncada, passível de anulação, mas mantém D | Dados citados não são sensíveis. D se sustenta. Anulação baixa |
| 3116487 | Segurança, BNDES 2024 | C | Ninguém contesta, mas o professor justifica pela seção de análise crítica, não pela de melhoria | C (não conformidade e ação corretiva) está certa |

**Leitura de conjunto.** Em cerca de 15 das 280 questões um professor apontou problema. A banca manteve o gabarito em quase todas e alterou em duas (2780672, 3102775). Em pelo menos três casos o erro estava na plataforma ou no professor, não na banca (3037439, 3102806, 3102846). Conclusão prática: na prova, marque a alternativa mais defensável segundo a fonte que a banca usa (Heuser, PMBOK, Scrum Guide, texto da lei) e siga em frente.

---

## 4. Lições gerais para a prova

1. **Leia a palavra-chave e associe ao conceito.** A Cesgranrio repete a definição da fonte (artigo da LGPD, norma ISO, PMBOK, Scrum Guide) quase ao pé da letra. Em LGPD, ISO e PMBOK, decorar a frase certa rende ponto rápido.
2. **Monte um checklist por tipo.** BD: lado da FK, nulo, UNIQUE, chave da tabela de relacionamento, elemento fora do conjunto. Normalização: chave composta? parcial? transitiva? SQL: tem FROM? tem WHERE? IN e EXISTS? limite estrito?
3. **Desconfie de absolutos, mas não às cegas.** "Eliminar todos os riscos", "garantir sucesso absoluto", "sempre" e "apenas" costumam cair. Porém "todos os testes já criados" estava certo no TDD (3135890).
4. **Termo inventado é sinal de distrator.** Irretroatividade, sealing, Scrum Manager, Nexus Boss, métodos sobrepostos, PRIME KEY. Se você nunca viu o nome e a alternativa vizinha usa o termo oficial, fique com o oficial.
5. **Enunciado longo, resposta curta.** Em 3117556 e 2780898 o texto assusta e a resposta é direta. Leia a pergunta antes do cenário.
6. **Conta rápida vale ouro.** VME, SPI, CPI, caminho crítico, ROI, complemento de dois. Faça no papel, sem atalho mental.
7. **Banco de Dados é a maior aposta da amostra**, sobretudo nas provas da própria Transpetro (18 das 21). Mapeamento ER, cardinalidade e normalização aparecem em todas as edições coletadas.
8. **Gabarito pode ser frágil.** A banca raramente anula. Se duas parecem certas, escolha a que segue a fonte da banca e a que não exige suposição extra.
9. **Não confie cegamente na plataforma nem em comentário de IA.** Houve gabarito errado no site e letra errada no comentário do professor.

---

## 5. O que ainda falta coletar

- Português, Inglês e Lógica (nada na amostra).
- BPM e BPMN, núcleo do cargo de Processos de Negócios (nada comentado na amostra).
- UX de verdade: usabilidade, heurísticas, acessibilidade, design centrado no usuário.
- Mais Projetos (só 26), em especial PMBOK 7 e ágil escalado.
- Governança: ITIL 4 por práticas, COBIT 2019 (fatores de desenho), LGPD dos arts. 11 a 22 e 52 (sanções).
- Comentário completo dos 151 textos cortados e das 49 questões sem professor (21 só em Segurança).
- As figuras e os sublinhados das questões de MER e normalização, para avaliar 2694191, 835993, 2780369 e os casos com alternativas idênticas.
- Disciplina, assunto e gabarito dos 25 registros sem identificação.
- Resultado oficial dos recursos (gabarito definitivo) nas questões que professores mandaram anular.
- Mais provas da própria Transpetro (Processos de Negócios de 2018, 2023 e outras ênfases), com comentário.
