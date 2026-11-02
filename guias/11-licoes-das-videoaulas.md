# Lições das videoaulas · Guia Cesgranrio de revisão e fixação

O que 38 videoaulas de resolução de questões da Cesgranrio (e de bancas vizinhas) ensinam sobre pegadinhas, eliminação e macetes, organizado por disciplina. É um guia de apoio: reforça os guias 01 a 10 e o capítulo 00, mas não substitui a prática com questões.

Tudo aqui é paráfrase e organização própria a partir das legendas automáticas dos vídeos. Nenhum trecho foi copiado. Cada ponto traz o ID do vídeo entre crases para você conferir na fonte.

## 1. Como usar este guia e quanto confiar nele

Leia a seção 6 (ressalvas) antes de apostar em qualquer número ou gabarito citado aqui. As legendas são automáticas, parte dos vídeos é de outras bancas e há lacunas importantes (PMBOK, LGPD, Scrum, UML).

| Selo | Significado |
|---|---|
| `ID do vídeo` | Onde o professor diz isso. Confira antes de decorar |
| [inferido] | Dedução minha a partir do que o vídeo mostra |
| [VERIFICAR] | Ponto incerto na legenda ou que pode ter mudado no edital 2026 |
| [sem precedente localizado] | Não há vídeo ou questão de apoio para esse ponto |

Como encaixar no plano dos 34 dias: use as duas primeiras seções antes da sessão de questões do dia, abra o vídeo de nota 5 do tema quando errar duas seguidas, e deixe a seção 7 para a véspera.

## 2. O que os professores repetem sobre a Cesgranrio (vale para tudo)

### 2.1 Retrato da banca

- Cobra o que está no edital, de forma direta. Não é filosófica como a Cebraspe nem viaja na interpretação como a FGV. Mas pune a base mal feita (`z5Q_fYEwQ-k`, `7-jAP9Yx_Qw`).
- Cria distratores plausíveis: termo parecido, conceito invertido (descreve X e chama de Y), definição certa no assunto errado e duas alternativas "quase certas", uma mais completa.
- Usa enunciado longo com historinha. O detalhe escondido decide. Sublinhe números, quem faz o quê e o que a pergunta pede (inclusive "NÃO").
- Repete padrões entre provas. Petrobras e Transpetro são "gêmeas" em perfil. Provas de 2023 em diante são o melhor treino de estilo (`z5Q_fYEwQ-k`).
- A prova é longa. Quem trava deve pular, deixar marcação e voltar.

### 2.2 A técnica de resolução ensinada (`7-jAP9Yx_Qw`)

1. Questão difícil: pule, mas antes risque as alternativas que já eliminou. O chute final parte de menos opções.
2. Procure o erro, não a certeza. É mais fácil achar o detalhe que derruba uma alternativa do que provar que outra é perfeita.
3. Sinal de alerta: palavras absolutas (sempre, nunca, exclusivamente, apenas, somente). Costumam marcar a errada, mas não é regra absoluta. Em lei seca e norma o absoluto pode ser literal.
4. Historinha: sublinhe os dados. Lista ou enumeração: estude como conjunto, porque a banca monta alternativas com itens da lista.
5. Português: leia as perguntas antes do texto. Algumas nem exigem o texto.
6. Se travar, pausa curta de poucos segundos para soltar a tensão.
7. Compare as alternativas entre si e fique com a mais específica e completa.

### 2.3 O que os vídeos confirmam do capítulo 00

| Regra do capítulo 00 | O que os vídeos mostram |
|---|---|
| O distrator é a definição correta de outra coisa | Mapeamento de processos (IPEA): todas as alternativas descrevem fases reais do ciclo BPM, só uma é mapeamento (`Db16XkGEyGY`). Malware: alternativas são definições de outros malwares (`ThdlEQuMXz0`) |
| Caso narrativo com frase decisiva | Segurança: quem é o "intermediário" no 802.1X decide a questão (`ThdlEQuMXz0`). SQL: o filtro de especialidade no enunciado decide o UPDATE (`KJLnLUTGZZs`) |
| Absolutos marcam a errada | Citado como sinal de alerta, com ressalva de que não é regra fixa (`7-jAP9Yx_Qw`) |
| Código literal em banco de dados | Maioria das questões de BB em BD era SELECT com junção; "qual INSERT falha" aparece em Basa e Eletrobras (`E0g9GrGQ9KY`, `6rdWqiJ5qBA`, `Z7q2NWgnm7I`) |
| A banca repete | Padrões repetidos entre Petrobras e Transpetro (`z5Q_fYEwQ-k`) |

Nada nos vídeos contradiz o capítulo 00. A única regra nova é a heurística de blocos de 5 (seção 4), que não está validada.

## 3. Lições por disciplina

### 3.1 Banco de Dados

Maior fonte de questões de TI nos vídeos. Segundo o Prof. Rogerão, em TI de desenvolvimento a Cesgranrio cobra Java em primeiro lugar e banco de dados em segundo (`E0g9GrGQ9KY`).

**Pegadinhas**

- Classificação de comandos com verbos trocados: "inserir registro" oferecido como DQL, "criar tabela" como DML. Regra: CREATE/ALTER/DROP/TRUNCATE = DDL; INSERT/UPDATE/DELETE = DML; SELECT = DQL; GRANT/REVOKE = DCL; COMMIT/ROLLBACK = controle de transação (`gz89cfU04I0`, `KJLnLUTGZZs`).
- UPDATE sem WHERE altera a tabela inteira. Se o enunciado limita a uma especialidade ou categoria, só serve a alternativa com filtro. SELECT só exibe, mesmo com cálculo. INSERT cria linhas novas, não reajusta as antigas (`KJLnLUTGZZs`).
- "Empresas que NÃO têm X": a resposta usa subconsulta de quem tem X com NOT IN. JOIN com "diferente de X" traz a empresa que tem X e também outra característica (`E0g9GrGQ9KY`).
- FROM A, B sem junção é produto cartesiano. Com 5 e 10 linhas, são 50 (`E0g9GrGQ9KY`).
- Alternativas inventam GROUP BY, UNION ou agrupamento que a consulta não tem (`E0g9GrGQ9KY`).
- Colunas retornadas: alternativa com SELECT * ou com coluna de outra tabela cai (`E0g9GrGQ9KY`).
- Código numérico comparado com sigla de texto é alternativa errada (`E0g9GrGQ9KY`).

**Técnica para "qual INSERT/UPDATE/DELETE falha"** (`6rdWqiJ5qBA`, `Z7q2NWgnm7I`). Cheque nesta ordem:

1. Sem lista de colunas, é preciso informar todas, na ordem.
2. NOT NULL violado por coluna omitida.
3. Tipo de dado (texto entre aspas, data compatível).
4. Chave primária repetida.
5. Chave estrangeira apontando para linha que não existe.
6. Alterar chave primária já referenciada.
7. Coluna que não existe.

Um DELETE com WHERE válido não dá erro mesmo sem achar linha. Nulo é diferente de texto vazio. Leia se a pergunta é "qual falha", "qual NÃO falha" ou "independentemente dos dados".

**Modelagem ER e mapeamento**

- Cardinalidade é lida no sentido contrário. O mínimo (0 ou 1) diz se é opcional ou obrigatório; o máximo diz um ou muitos (`6rdWqiJ5qBA`).
- Com conjuntos de registros, teste cada alternativa nos dois lados: quantas vezes cada elemento aparece e se todos aparecem ao menos uma vez (`E0g9GrGQ9KY`).
- Mapeamento: n:n vira tabela própria; 1:n leva a chave estrangeira para o lado n; 1:1 costuma fundir, mas não é a única forma. Se a chave primária da tabela de relacionamento é só a de A, cada A se liga a no máximo um B (`6rdWqiJ5qBA`).
- Especialização total e exclusiva: a pessoa é funcionário OU não funcionário. Atributos comuns ficam na entidade geral (`gz89cfU04I0`).
- A Cesgranrio sublinha as chaves primárias. Leia o sublinhado antes de analisar dependências.
- Chave composta: o menor conjunto que torna a linha única pela regra do enunciado. Exemplo: no máximo uma transferência por segundo entre duas contas dá origem, destino e data/hora até o segundo. O valor não entra (`6rdWqiJ5qBA`).

**Normalização**

- 1FN: atômico. 2FN: sem dependência parcial (só importa com chave composta). 3FN: sem dependência transitiva. 4FN: multivalorada. Boyce-Codd existe, mas o professor diz que a banca pouco cobra (`gz89cfU04I0`).
- Cascata: se viola a 1FN, não está na 2FN nem na 3FN. Elimina alternativas rápido.
- Verdadeiro: "uma tabela na 2FN pode ter dependência transitiva". Coluna multivalorada é 1FN; dependência multivalorada é 4FN.
- Objetivo: reduzir redundância e aumentar integridade. "Melhora o desempenho" é distrator; normalizar demais gera junções.
- Nota de coerência: o capítulo 00 diz que a banca não cobra 4FN neste perfil. Os vídeos mostram a 4FN só como contraste de termos [inferido].

**SGBD**

- Três esquemas: externo (visões), conceitual, interno (físico). Independência lógica: muda o conceitual sem mudar o externo. Independência física: muda o interno sem mudar o conceitual (`gz89cfU04I0`).
- Funções do SGBD: controle de acesso, concorrência, índices. Não são funções: alertar vírus ou controlar a ordem de execução de programas (`0KfHmYndpTE`).

**Erros comuns**: responder o que "faz sentido" sem ler o que o enunciado pede; marcar SELECT como se alterasse dados; achar que normalização melhora desempenho; ler a cardinalidade no sentido direto.

### 3.2 BI e Data Warehouse

Fontes: `yHOY-Ud9TQE`, `gz89cfU04I0`, `jEj6kA1jEGo`. O Prof. Pacheco diz que a Cesgranrio cobra DW de forma objetiva e que modelagem avançada é mais FGV.

**Pegadinhas**

- Características do DW: orientado a assunto, integrado, variante no tempo, não volátil. Alternativas falsas: "volátil", "atemporal", "alterado a cada transação", "dados detalhados de toda a empresa", "mesma estrutura do transacional". DW guarda dado sumarizado para decisão; OLTP é atual e detalhado.
- DW serve à decisão tática e estratégica, não só operacional. Nunca devolve dados ao sistema transacional.
- Estrela: uma fato central com as dimensões em volta. O valor vai na fato; a data vai em dimensão; o evento (venda, transferência) é fato; participantes (cliente, vendedor, conta, loja, produto) são dimensões. Cidade é atributo da loja, não fato.
- Floco de neve: dimensões normalizadas, sem criar novas fatos. Na estrela, dimensões não são normalizadas.
- Alternativas absurdas: "tabelão único", mais de uma fato por cubo, "cliente como fato".
- Data mart é DW menor de uma área. "É preciso um data mart por fonte" é falsa, porque os dois autores clássicos divergem sobre top-down e bottom-up.
- ETL: extrair, transformar, carregar. Staging é a camada intermediária de tratamento e não serve ao usuário final. Data mart não é camada de ETL.
- OLAP: drill-down detalha em sequência, sem pular nível; roll-up agrega; drill-across pula nível; slice fatia; dice faz subcubo; pivot rotaciona. A banca erra a grafia de propósito ou troca nomes.
- Dado, informação, conhecimento, inteligência: dado sem contexto; informação com contexto; conhecimento é padrão tirado de várias informações; inteligência é decisão a partir do conhecimento (`0KfHmYndpTE`).
- Big data: os três V (volume, velocidade, variedade) foram cobrados em 2023 (`0KfHmYndpTE`).

**Eliminação**: ache o termo que parece certo mas é de outro modelo (estrela x floco) e use a regra do espelho: duas alternativas opostas, uma delas é o gabarito.

**Erros comuns**: tratar a data como medida; achar que o floco de neve cria fatos novas; achar que DW é volátil.

**Ressalva**: o professor de `jEj6kA1jEGo` associa DW a dado estruturado e data lake a não estruturado. É a leitura dele. Confira no guia 08 antes de usar [VERIFICAR].

### 3.3 Engenharia de Software, UML e métodos ágeis

Poucos vídeos, e o de UML é antigo (BR Distribuidora 2008 e 2012, `o1OyrrDhTTI`). Use para o conteúdo, não para o estilo atual.

**UML**

- Multiplicidade em caso de uso: 0..1 é opcional. Alternativa com "obrigatório" é pegadinha.
- Include é obrigatório; extend é opcional. Ponto de extensão só existe em extend.
- Generalização de atores: a seta aponta para o pai; o filho herda. A banca inverte o sentido na alternativa.
- Classes de análise (RUP): fronteira faz a interface com o ator; controle coordena o fluxo; entidade persiste. Não precisam ter todos os atributos e métodos, isso é refinamento de projeto. O professor diz que a Cesgranrio cobra pouco isso e que cai mais em Cebraspe.
- Diagrama de sequência teve poucas questões; máquina de estados dá questões longas.

**Ágil** (`cUx37UvceKQ`, aula simplificada para a Caixa)

- Scrum: dono do produto, mestre, time autogerenciável; backlog priorizado; sprint; reunião diária; revisão (o que foi feito) e retrospectiva (o que melhorar).
- Kanban: quadro visual. Lean: valor, fluxo contínuo, produção puxada. XP: pares, testes automatizados, integração contínua.
- Pegadinhas: "qual NÃO é ágil" costuma levar à análise estruturada; documentação detalhada não é característica ágil; atribuir a Scrum o que é XP; dizer que Scrum e XP proíbem mudar escopo; apontar um obstáculo genérico quando há outro mais específico.
- [VERIFICAR] O vídeo cita sprint de 3 a 4 semanas e diária de 5 a 10 minutos. O Guia do Scrum fala em sprint de até um mês e diária de 15 minutos. Siga o Guia.

**Erros comuns**: confundir include com extend; ler a seta de generalização de trás para a frente; tratar Scrum e XP como sinônimos.

### 3.4 Segurança da Informação

Fontes: `ThdlEQuMXz0` (nota 5, reta final Transpetro), `KJLnLUTGZZs`, `yQk5Z3Uf7lo`, `FxJDOL4QwJE`, `bZUO87R9V9w`, `0l7bfwpM9us`, `VLV0ay2tdno`. A análise de `wPtkkMBc0lU` coloca segurança como o assunto de informática mais cobrado em concursos bancários da banca (cerca de 11% no levantamento do professor).

**Princípios**: CIDA (confidencialidade/sigilo, integridade, disponibilidade, autenticidade). "Garante que a origem é quem diz ser" é autenticidade. Interceptar e ler quebra só o sigilo. Alterar um bloco criptografado quebra a integridade com o sigilo preservado.

**Malware: palavra-chave que decide**

| Conceito | Palavra-chave |
|---|---|
| Vírus | Precisa ser executado, tem hospedeiro |
| Worm | Replica-se sozinho pela rede, explora falha |
| Trojan | Parece legítimo; é o meio mais comum de implantar spyware |
| Backdoor / RAT | Porta oculta / acesso remoto |
| Botnet | Rede de zumbis, usada em DDoS |
| Keylogger / screenlogger | Teclado / tela e cliques |
| Spyware / adware | Espião em geral / propaganda |
| Rootkit | Esconder a presença do invasor |
| Ransomware | Sequestro de dados com resgate |
| Cryptojacking | Minera moeda com sua CPU; não criptografa seus dados |
| Formjacking | JavaScript malicioso em formulário de pagamento |
| Vírus polimórfico | Muda a própria assinatura; não é ransomware |
| Stuxnet | Worm contra sistema industrial (USB, compartilhamento) |

**Engenharia social**: phishing (isca por e-mail ou link), spear phishing (alvo específico), vishing (voz). Firewall não bloqueia engenharia social. Evil twin: ponto de acesso falso com o mesmo SSID de um legítimo.

**Criptografia e assinatura**

- Hash: resumo de mensagem, via única, tamanho fixo, serve à integridade (MD5, SHA). Simétricas: AES, 3DES, RC4. Assimétricas: RSA, curvas elípticas.
- Assinatura digital: o remetente assina com a chave privada dele; o destinatário confere com a chave pública do remetente. Prova autoria e integridade. Cifrar com a chave pública do destinatário dá sigilo, não autoria. Uma questão do Banese 2025 cobrou essa troca (`KJLnLUTGZZs`). [VERIFICAR] a letra: a legenda ficou ambígua, o conteúdo está claro.
- Criptografia não garante disponibilidade.

**Backup** (`ThdlEQuMXz0`, `VLV0ay2tdno`): completo copia tudo; diferencial copia o que mudou desde o último completo e não marca (cumulativo); incremental copia o que mudou desde o último backup e marca. Restauração com diferencial = último completo + último diferencial. Macete do professor: normal e incremental "marcam"; diferencial não. A questão de 2014 do cronograma misto ficou confusa na legenda [VERIFICAR].

**Redes e autenticação**

- VPN em modo túnel = encapsulamento com criptografia. IPsec: AH (integridade, autenticação da origem, anti-replay), ESP (confidencialidade, integridade, autenticação, anti-replay), ISAKMP/IKE (negocia as associações). TLS é do HTTPS. PPTP e L2TP são distratores.
- 802.1X: suplicante (quer entrar), autenticador (switch ou AP, o intermediário), servidor de autenticação (RADIUS). EAP carrega a autenticação.
- Negação de serviço: flooding consome banda; DRDoS reflete resposta com IP falsificado; Slowloris esgota conexões HTTP abertas. Spoofing, sniffing e scanning são distratores.
- AAA: autenticação (sabe, tem ou é; multifator = mais de um), autorização (nível de acesso), auditoria (registro).

**Erros comuns**: trocar autenticidade por sigilo; achar que cifrar com a chave pública do destinatário prova quem enviou; achar que "cripto" no nome quer dizer criptografia; usar vírus e worm como sinônimos.

### 3.5 Projetos, PMBOK e Gestão de Riscos

Não há vídeo Cesgranrio de PMBOK além de riscos [sem precedente localizado]. Fontes: `wCePAhh7gyo` (nota 5), `KJLnLUTGZZs`.

**Resposta a ameaças**: evitar (abandonar a atividade), transferir ou compartilhar (seguro, terceirizar), mitigar (reduzir probabilidade e/ou impacto), aceitar (não agir), escalar (fora da alçada do projeto). Questão Cesgranrio de 2024: comprar seguro = transferir. "Prevenir" parece certo, mas atua na probabilidade e se aproxima de mitigar. Na live `KJLnLUTGZZs`, um aluno sugeriu prevenir no chat, e o professor explicou a lógica de transferir.

**ISO 31000**

- Princípios: integrada, estruturada e abrangente, personalizada, inclusiva, dinâmica, melhor informação disponível, fatores humanos e culturais, melhoria contínua. Distratores: "fragmentada", "restrita", "genérica", "desagregada".
- Avaliação de riscos = identificação, análise e avaliação. Tratamento vem depois; definição de escopo vem antes.
- Análise: probabilidade, impacto e controles existentes. Inerente = sem considerar controles; residual = depois dos controles. Controle é qualquer medida que modifica o risco, não precisa ser política formal.
- Aceitar o risco não é eliminá-lo. Risco significativo pode vir da falha da medida de tratamento. Tratar risco não exige atuar ao mesmo tempo em probabilidade e consequência.

**Erros comuns**: escolher "prevenir" para seguro; tratar "aceitar" como eliminar; incluir tratamento dentro da avaliação.

### 3.6 Governança de TI, LGPD e estratégia

LGPD: nenhum vídeo coletado [sem precedente localizado]. Use o guia 05 e a lei seca.

- COBIT x ITIL (`EVexuT0gb5w`, nota 3, não é da Cesgranrio): governança (avaliar, dirigir, monitorar) é diferente de gestão (planejar, construir, executar). COBIT 5 tem cinco princípios e sete habilitadores. Incidente = restaurar rápido, com solução de contorno. Problema = causa raiz.
- Planejamento estratégico (`R0w0uh2eSt0`, Cesgranrio): missão é a razão de ser; SWOT separa interno (forças, fraquezas) de externo (oportunidades, ameaças); cobertura negativa da mídia é ameaça externa. Alternativas com "exclusivamente", "uma única vez" ou que misturam interno com externo caem. Integração vertical = assumir etapa adjacente da cadeia. Setor fragmentado = muitas empresas pequenas.

### 3.7 Lógica e Matemática

Atenção: os vídeos são de BB, Banese e Caixa. Nos editais Transpetro de nível superior a Matemática tende a ser mais simples [VERIFICAR no edital 2026]. Serve como treino geral.

- Pegadinha das prateleiras (`66ALTuwj558`): duas prateleiras de 92 cm. Não some 184 cm e divida. Calcule quantos livros cabem em cada uma e some, porque o livro não se divide entre prateleiras.
- Tempo conjunto (`wgmr-YzzGUk`): produto dos tempos sobre a soma. O resultado tem de ser menor que o menor tempo individual, o que elimina alternativas.
- Dividir por 5 é dobrar e andar uma casa. Dividir por 0,5 é dobrar. Porcentagem sem valor: adote 100 (`wgmr-YzzGUk`, `T-RRfLfifa4`).
- Regra do 72: tempo para dobrar um capital em juros compostos é 72 dividido pela taxa em %. Valor presente: divida cada parcela por (1+i) elevado ao período.
- Combinatória: "e" multiplica, "ou" soma. Eventos independentes multiplicam.
- Traduzir o texto em equação é a habilidade central (`T-RRfLfifa4`).

Os vídeos de lógica proposicional da Cesgranrio não foram localizados [sem precedente localizado]. Use o guia 09.

### 3.8 Português

Fontes: `Umkm3Utnqus`, `2L-cdGoyZy8`, `maITuzLGR1o`.

- Gramática em contexto, com interpretação primeiro: ideia central, referentes, implícitos. Prioridade: interpretação, coesão e conectivos, crase/regência/pronomes, reescrita.
- Alternativas próximas diferem em uma palavra. Leia o comando, volte ao trecho e só então compare. Ler as alternativas cedo demais faz "enxergar" no texto o que não está lá.
- "Adequado" não é "certo": em contexto informal, uma construção coloquial é adequada.
- Crase: não vai antes de verbo, de artigo indefinido nem diante de palavra masculina ou plural sem artigo feminino.
- Texto longo (`2L-cdGoyZy8`): a banca troca o referente e inverte causa e consequência. Pergunta sobre estratégia argumentativa pede a ordem de exposição do texto.
- Conectivos (`maITuzLGR1o`): "mas" é adversativa, exceto em "não só... mas também" (adição). "Embora" e "mesmo que" iniciam concessiva. Pronome relativo retoma o antecedente e pode virar "o qual"; "que" integrante não retoma. Oração adjetiva sem vírgula é restritiva; com vírgula é explicativa.

**Erros comuns**: responder pelo que "parece lógico" sem checar o referente; ler o texto inteiro antes das perguntas quando a questão não precisa dele.

### 3.9 Inglês

Fontes: `4YxL-tdVI60`, `rCqUuZW_tzo` (provas Transpetro 2023.2 resolvidas), `iBKuJTePVLM`, `zWCVlGkItdg`. A prova de 2023.2 tinha um texto e dez questões, todas de leitura.

- Comece pelo título e pelas questões. Várias nem exigem ler o texto: conectivo (however = oposição, moreover = adição), referente de "which", "they", "it" e sinônimo no contexto.
- Ideia principal: elimine o tom oposto ao do título (crítica, perigo, custo) quando o texto é sobre benefícios.
- Vocabulário: veja o conjunto de alternativas; a banca coloca "palavras absurdas" para encher. Em "palavras de navegação", avalie cada par.
- Cognatos e falsos amigos citados: paper = artigo científico; journal = publicação; guideline = diretriz; outline = descrever; pivotal = essencial.
- Macete do Baggio: a palavra que antecede o substantivo é adjetivo em potencial; present perfect liga o passado ao presente.
- Como o Inglês é trava eliminatória (capítulo 00), garanta primeiro as mecânicas.

### 3.10 Processos de Negócios e BPM (o coração da ênfase)

Fontes: `Db16XkGEyGY` (nota 5, Cesgranrio/IPEA), `oZ8wtZDyuzs` (Cebraspe), `uEMDIMHiXYA` (FGV).

- Ciclo de vida BPM (CBOK, como o professor descreve): organização e estratégia; mudança na arquitetura de processos (modelagem, análise de desempenho, desenho, simulação); iniciativas; implementação; medição. As-is = como é hoje; benchmark = referência; to-be = como deve ser.
- Pegadinha IPEA: "mapeamento de processos consiste em..." com alternativas que descrevem outras fases (simulação, redesenho, benchmarking, métricas). Mapeamento é registrar o processo em níveis de detalhe, com atores, eventos e resultados. O professor diz que tudo estava "certo" dentro do BPM, mas fora do escopo de mapeamento. [VERIFICAR] a letra do gabarito: a legenda não a diz.
- BPMN é notação gráfica padronizada para processos de negócio (BPMN 2.0, OMG). Não é para arquitetura de software (UML), nem ER, nem fluxo de dados.
- O desenho é uma etapa e não representa toda a realidade organizacional. "BPMN representa integralmente o BPM" é falsa.
- Eventos: início (borda simples), intermediário (borda dupla), fim (borda grossa). Gatilhos: condicional, mensagem, ligação, sinal, tempo. Piscina e raias para os atores. Uma questão que dizia que eventos de borda dupla "ocorrem ao longo do processo" foi dada como errada por não dizer "intermediários": seja literal (`oZ8wtZDyuzs`, Cebraspe).
- Diagramas: orquestração (processo detalhado), coreografia (troca de mensagens entre participantes; "+" é subcoreografia recolhida), conversação (alto nível).
- BPMS executa e automatiza o processo desenhado (muitas vezes low code), integra sistemas e permite acompanhamento em tempo real. Errado: "processos rígidos", "parar de acompanhar", "tirar as pessoas", "só relatórios no fim" (`uEMDIMHiXYA`).

**Erros comuns**: tratar mapeamento como simulação, melhoria ou benchmarking; confundir BPMN com BPM e com UML.

## 4. A heurística de chute do vídeo Dq_hks-zCew: NÃO validada

**O que o vídeo diz** (`Dq_hks-zCew`, O Primo Concursado, nota 3). Dividir o cartão em blocos de 5. Marcar só o que se sabe, eliminar o que está errado e chutar nas lacunas. Segundo o autor, o padrão mais comum num bloco de 5 é uma letra repetida duas vezes e as outras três diferentes (cerca de 55%), depois duas letras repetidas (cerca de 30%). Cinco letras diferentes seria raro (cerca de 6%). A letra repetida de um bloco raramente se repete no bloco vizinho. O nome "21110" parece descrever o padrão 2-1-1-1-0 [inferido do título].

**Por que não está validada**

- A amostra é do próprio autor. A legenda não diz quantas provas, de qual ano nem de qual cargo.
- Os percentuais saíram com ruído na legenda.
- Não há teste com os gabaritos oficiais da Transpetro.
- Os números do vídeo se afastam do acaso, o que é plausível se a banca equilibra letras, mas a magnitude não foi conferida.

Para comparar, calculei o que o puro acaso daria em blocos de 5 com 5 letras equiprováveis e independentes:

| Padrão no bloco de 5 | Acaso puro | Afirmação do vídeo |
|---|---|---|
| 2-1-1-1-0 (uma letra dobrada, três únicas, uma ausente) | 38,4% | cerca de 55% |
| 2-2-1-0-0 (dois pares) | 28,8% | cerca de 30% |
| 3-1-1-0-0 (uma letra tripla) | 19,2% | não citado |
| 1-1-1-1-1 (todas diferentes) | 3,8% | cerca de 6% |
| 3-2, 4-1 e 5 | 9,8% somados | não citado |

Leitura: só o padrão 2-1-1-1-0 diverge muito do acaso. Se o vídeo estiver certo, a banca tende a evitar letra tripla, o que é compatível com a ideia de equilíbrio, mas isso é [inferido] e não está medido.

**Comparação com a regra do bloco de 10 já adotada** (capítulo 00, seção 6)

| Ponto | Regra do projeto (bloco de 10) | Vídeo (bloco de 5) |
|---|---|---|
| Base de dados | 16 gabaritos oficiais da Transpetro 2023 (1.114 questões) | Amostra do autor, sem detalhes |
| Método | Máxima entropia ajustada por verossimilhança; validação cruzada | Contagem informal |
| Regra prática | Em cada chute, marque a letra menos usada no bloco de 10 entre as que sobraram; desempate pelo caderno inteiro; não some os chutes | Letra repetida de um bloco raramente se repete no vizinho |
| Ganho medido | Chute sobe de 20% para 31% sem eliminar nada e para 45% eliminando duas | Nenhum |
| Risco | Se as letras forem independentes, acerta os mesmos 20% do chute cego | Igual |

**Decisão para a prova**: mantenha só a regra do bloco de 10. Não misture as duas, porque os blocos de 5 e de 10 se sobrepõem e o vídeo não tem validação. A parte aproveitável do vídeo já faz parte do protocolo do projeto: marcar primeiro o que se sabe, eliminar e só então chutar. Nenhum chute substitui estudo; o grosso do ganho vem de eliminar alternativas pelas heurísticas do capítulo 00, seção 5.

## 5. Tabela dos vídeos mais úteis

Notas 5 e 4 (utilidade para o perfil de analista de Processos de Negócios com a banca Cesgranrio). A lista completa dos 38 está em `videos.json`.

| Nota | Título | Canal | URL |
|---|---|---|---|
| 5 | Mapeamento de Processos BPM: resolução de questão CESGRANRIO | Gestão em Curso | https://www.youtube.com/watch?v=Db16XkGEyGY |
| 5 | Comentando questões de TI: Banco de Dados para CESGRANRIO | Professor Rogerão Araújo | https://www.youtube.com/watch?v=gz89cfU04I0 |
| 5 | Questões da CESGRANRIO sobre BANCO DE DADOS - Concurso BNDES | Arnaldo Junior | https://www.youtube.com/watch?v=6rdWqiJ5qBA |
| 5 | Aula em Questões de Data Warehouse focada na Cesgranrio. | Professor Gabriel Pacheco | https://www.youtube.com/watch?v=yHOY-Ud9TQE |
| 5 | Gestão de riscos: questões comentadas da CESGRANRIO | Prof. Marcelo Soares | https://www.youtube.com/watch?v=wCePAhh7gyo |
| 5 | Prova de inglês da Petrobras corrigida: mesmo estilo da Transpetro (banca Cesgranrio) | Inglês com Simone | https://www.youtube.com/watch?v=4YxL-tdVI60 |
| 5 | Prova de inglês da Transpetro (Cesgranrio) resolvida: 10 questões com gabarito | Inglês com Simone | https://www.youtube.com/watch?v=rCqUuZW_tzo |
| 5 | Transpetro (Reta Final) - Segurança da Informação: Dicas e Questões Comentadas. | Pratique Concursos | https://www.youtube.com/watch?v=ThdlEQuMXz0 |
| 5 | TRANSPETRO TI: DETONANDO A BANCA CESGRANRIO / RESOLUÇÃO DE QUESTÕES | Prof. Max William - Concursos de TI | https://www.youtube.com/watch?v=KJLnLUTGZZs |
| 4 | Resolução de Questões BPMN para Concursos | Gestão em Curso | https://www.youtube.com/watch?v=oZ8wtZDyuzs |
| 4 | Comentando questões de TI Banco de Dados para CESGRANRIO Parte II | Professor Rogerão Araújo | https://www.youtube.com/watch?v=E0g9GrGQ9KY |
| 4 | Questões Comentadas sobre DATA WAREHOUSE / Concurso BB 2026 - Agente de Tecnologia | Arnaldo Junior | https://www.youtube.com/watch?v=jEj6kA1jEGo |
| 4 | Análise de Sistemas para Transpetro | Estratégia Concursos | https://www.youtube.com/watch?v=jyLlqhwt1b8 |
| 4 | INGLÊS PARA TRANSPETRO - CESGRANRIO | Prof. Renato Baggio | https://www.youtube.com/watch?v=zWCVlGkItdg |
| 4 | CONCURSO TRANSPETRO 2026 - RESOLUÇÃO DE QUESTÕES LÍNGUA INGLESA / Cesgranrio | Cursos do Portal | https://www.youtube.com/watch?v=iBKuJTePVLM |
| 4 | Concurso Petrobras 2026 / Qual é o padrão por trás da banca Cesgranrio? | Nova Concursos | https://www.youtube.com/watch?v=z5Q_fYEwQ-k |
| 4 | TRANSPETRO 2026: PORTUGUÊS CESGRANRIO / AULÃO COMPLETO + QUESTÕES | Pablo Jamilk | https://www.youtube.com/watch?v=2L-cdGoyZy8 |
| 4 | Concurso Transpetro 2026 / Como a Cesgranrio cobra Português? Dicas para a prova! | Nova Concursos | https://www.youtube.com/watch?v=Umkm3Utnqus |
| 4 | Português Transpetro / Dominando CONECTIVOS da banca Cesgranrio | Décio Terror | https://www.youtube.com/watch?v=maITuzLGR1o |
| 4 | Questão de SQL - Controle de Passes de Metrô CESGRANRIO / EMBRAPA - ENGENHARIA DE SOFTWARE | Arnaldo Junior | https://www.youtube.com/watch?v=Z7q2NWgnm7I |
| 4 | Como é a prova da CESGRANRIO? 7 Dicas matadoras | Concursar - Como estudar para concurso público | https://www.youtube.com/watch?v=7-jAP9Yx_Qw |
| 4 | Videoaulas ITnerantes: UML em Exercícios CESGRANRIO - Prof. Felipe Leite (Aula 07) | Provas de TI | https://www.youtube.com/watch?v=o1OyrrDhTTI |

Ordem de estudo sugerida por retorno: BPM (`Db16XkGEyGY`, depois `oZ8wtZDyuzs`), Riscos (`wCePAhh7gyo`), Banco de Dados (`gz89cfU04I0`, `6rdWqiJ5qBA`, `E0g9GrGQ9KY`), DW/BI (`yHOY-Ud9TQE`), Segurança (`ThdlEQuMXz0`), SQL Transpetro (`KJLnLUTGZZs`), UML (`o1OyrrDhTTI`), Inglês (`4YxL-tdVI60`, `rCqUuZW_tzo`), Português (`Umkm3Utnqus`, `2L-cdGoyZy8`, `maITuzLGR1o`), técnica geral (`7-jAP9Yx_Qw`, `z5Q_fYEwQ-k`).

## 6. Ressalvas da síntese

1. **Legendas automáticas.** Têm ruído: nomes trocados, letras de alternativa confusas e números errados. Onde o gabarito não ficou claro, o texto marca [VERIFICAR]. Nunca decore uma letra de gabarito citada aqui.
2. **Vídeos de outras bancas.** Os de BPMN/BPMS são de Cebraspe (`oZ8wtZDyuzs`) e FGV (`uEMDIMHiXYA`). Servem para o conteúdo. O estilo da Cesgranrio é outro: múltipla escolha, enunciado longo, alternativas parecidas. Os de Banco do Brasil, Caixa e Banese (`jEj6kA1jEGo`, `cUx37UvceKQ`, `0KfHmYndpTE`) são da mesma banca ou de bancas mistas, mas de outros cargos.
3. **Lacunas.** Sem vídeo Cesgranrio de PMBOK (só riscos), de LGPD, de Scrum específico nem de BPMN da própria banca. Há só um vídeo de UML, antigo. Complemente com questões do TecConcursos e com os guias 04, 05 e 06.
4. **Divisão do bloco "Processos de Negócios" de 2023.** A live `jyLlqhwt1b8` (Estratégia, edital de 29/09/2023, prova em 10/12/2023) diz que o bloco era uma mistura de gestão de projetos, banco de dados/ciência de dados e normas, e que Português e Inglês eram eliminatórios (mínimo de 50% no bloco básico, sem zerar) e não contavam para a classificação. Isso vale para 2023. [VERIFICAR] no edital 2026. O capítulo 00 deste projeto já registra, para 2026, a eliminação por nota mínima e a classificação pela soma; prevalece o edital e o capítulo 00, não a live. Outro vídeo (`WgOh8QWL_JI`, foco em engenharia) fala em Português e Inglês como "desempate", o que conflita com a live; trate como incerto.
5. **Banca até 2028.** O vídeo `z5Q_fYEwQ-k` diz que a Petrobras contratou a Cesgranrio até julho de 2028 e que a mesma banca aplicou a prova Transpetro/Petrobras de 2023.2.
6. **Nove vídeos sem transcrição** ficaram de fora da análise.
7. **Frequência por assunto** (`wPtkkMBc0lU`) é de concursos bancários e de informática, não da Transpetro. Não use como peso de estudo.

## 7. Revisão de véspera (checklist)

1. UPDATE sem WHERE muda tudo; SELECT só exibe; INSERT cria.
2. DDL estrutura, DML manipula, DQL consulta, DCL permissão.
3. "NÃO tem X" = subconsulta com NOT IN.
4. FROM A, B sem junção = produto cartesiano (linhas A vezes linhas B).
5. "Qual comando falha": colunas, NOT NULL, tipo, PK, FK, coluna inexistente.
6. Cardinalidade lida no sentido contrário; mínimo 0 = opcional.
7. n:n vira tabela; 1:n leva FK ao lado n.
8. 1FN atômico, 2FN sem parcial, 3FN sem transitiva; falhou a 1FN, falhou a 2FN e a 3FN.
9. Normalizar reduz redundância; "melhora desempenho" é distrator.
10. DW: assunto, integrado, tempo, não volátil, sumarizado.
11. Estrela: evento é fato, participante é dimensão, valor na fato, data na dimensão.
12. Drill-down detalha em sequência; drill-across pula; roll-up agrega.
13. Staging não serve ao usuário final.
14. Include obrigatório, extend opcional; seta de generalização aponta para o pai.
15. "Qual NÃO é ágil": análise estruturada e documentação detalhada.
16. Rootkit esconde; keylogger teclado; screenlogger tela; worm sozinho; vírus precisa de execução.
17. "Cripto" no nome não é criptografia: cryptojacking minera.
18. Hash: resumo, via única, integridade.
19. Assinatura: chave privada do remetente assina, pública dele confere.
20. Diferencial não marca e acumula; incremental marca.
21. 802.1X: o intermediário é o autenticador.
22. Seguro = transferir. Evitar, transferir, mitigar, aceitar, escalar.
23. Inerente sem controles; residual com controles.
24. Avaliação de riscos = identificar, analisar, avaliar.
25. Mapeamento registra o processo atual; simulação prevê; benchmark compara.
26. BPMN é notação de processo, não UML nem ER.
27. Borda simples início, dupla intermediário, grossa fim.
28. Incidente restaura; problema acha a causa raiz.
29. SWOT: interno (forças, fraquezas), externo (oportunidades, ameaças).
30. Tempo conjunto menor que o menor tempo.
31. Português: volte ao trecho; "mas" é adversativa, exceto em "não só... mas também".
32. Inglês: título e perguntas primeiro; however = oposição.
33. Chute: só a regra do bloco de 10; ignore a heurística de blocos de 5.
34. Pule, risque o que eliminou, volte depois.

## 8. Fontes usadas

`yt\sintese_youtube_cesgranrio.md` (paráfrase de 38 videoaulas), `yt\videos.json` (lista curada com notas), capítulo 00 deste pacote (regras da banca e regra do bloco de 10). Os vídeos citados estão na seção 5; as transcrições brutas ficam só no ambiente local e não foram reproduzidas.
