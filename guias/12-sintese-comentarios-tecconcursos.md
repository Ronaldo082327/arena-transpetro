# Síntese dos comentários do TecConcursos (amostra)

Texto escrito com palavras próprias, a partir da leitura dos 76 registros. Não é cópia de professor nem de aluno.

## 1. Cobertura e limites

- **É uma amostra de 76 questões, não a base inteira.** A coleta foi bloqueada pelo site e ficou incompleta.
- Pelo conteúdo, todas as 76 são de Banco de Dados. Em 55 o campo `disc` diz "Dados" e há enunciado completo em `plataforma/questoes.json`. As outras 21 não têm disciplina, assunto nem gabarito no registro (ids como 200266, 265680, 265738, 2671160), mas tratam de MER, álgebra, índices e ANSI/SPARC.
- Assuntos dos 55 identificados: MER 32, modelo relacional 15, álgebra relacional 4, fases de projeto e modelagem 3, ANSI/SPARC 1.
- Nada de Português, Inglês, Projetos, Governança, Engenharia de Software, UX, BI, Lógica ou Segurança. Quase nada de SQL puro, normalização em profundidade ou DDL. **Não generalize** estas conclusões para essas áreas.
- 12 das 55 identificadas vêm de provas da Transpetro (6 de Processos de Negócios: 2695281, 2695285, 2695304, 2695322 de 2023; 638908, 638918 de 2018). O resto vem de BASA, BANESE, BNDES, UNIRIO, BB, CEF, IPEA, CNU e outras provas da Cesgranrio.
- Texto do professor presente em 65 registros. 11 não têm (1176474, 2327008, 265730, 265746, 2694738, 2695322, 2695422, 3346871, 3347101, 3347124, 3347155). 40 comentários de professor estão cortados em 2.200 caracteres, então o final da explicação (às vezes a análise das últimas alternativas) se perdeu.
- 200 comentários de alunos, 25 deles vazios (só o voto). O campo `nStud` veio zerado em todos, então não serve como medida de volume.
- Parte dos comentários de alunos é colada de outro site (QC) ou gerada por IA (alguns dizem isso). Trate como pista, não como verdade. As figuras dos diagramas não foram coletadas, e várias explicações só fazem sentido com a imagem.

## 2. Padrões por assunto

### MER: cardinalidade (min,max)
- Os professores repetem uma regra de leitura: o par (min,max) escrito ao lado de uma entidade responde "quantas desta aparecem para cada ocorrência da outra". Parece invertido. Vários alunos dizem que o jeito é aceitar e desenhar.
- O mínimo sai de palavras do texto. "Pode", "nem todo" e "poderá registrar" dão 0. "Deve", "exatamente" e "pelo menos" dão 1. "Vários" dá máximo n.
- Relacionamento ternário: a cardinalidade vale para pares de entidades (fixado um par, quantas ocorrências da terceira). Em 1175342 a diferença entre "pode" e "deve" na alternativa certa foi o que decidiu a questão.
- Questões com conjuntos e tuplas (K, L, M, T, S, X, Y, Z, A, C, D): a solução é mecânica. Para cada tupla confira o máximo. Para cada elemento de participação obrigatória, confira que aparece em alguma tupla. Os erros ficam escondidos: uma entidade ligada a duas ocorrências onde o máximo é 1 (1176474), a direção do par, um elemento que não existe no conjunto, um elemento fora da subclasse.
- Onde pôr o atributo: o que depende de duas entidades ao mesmo tempo vai no relacionamento (custo de transporte depende da transportadora e do endereço). O que pertence a uma só (valor mínimo do bloco) vai nela. Atributo de relacionamento existe em qualquer cardinalidade. No 1:N ele migra para o lado N.
- Contagem de atributos obrigatórios: a convenção defendida por alunos é considerar todos obrigatórios, exceto os marcados (0,1) ou (0,n). O professor do id 2671161 contou diferente.

### Generalização e especialização
- Duas perguntas independentes: total ou parcial (todo item do pai tem que estar em algum filho?) e exclusiva/disjunta ou sobreposta (o item pode estar em mais de um filho?).
- Traduzindo o enunciado: "pertence a uma única categoria" é exclusiva. "Alguns também exercem outra função" é sobreposta. "E apenas isso" fecha o conjunto, ou seja, total (3117564).
- Com conjuntos: total significa que a união dos filhos cobre o pai. Exclusiva significa interseção vazia. Parcial deixa sobrar elementos só no pai. Se o enunciado não lista um filho, deduza pelos relacionamentos de que ele participa (2041333).
- Herança vai do pai para o filho. O pai nunca herda atributos do filho (3347165).
- Hierarquia em mais de um nível (Funcionário, Fiscal, Auditor e Inspetor) apareceu como alternativa certa. Um aluno estranhou criar a categoria intermediária, outros mostraram que ela é o que permite a regra de compartilhamento (2695422).

### Mapeamento MER para relacional (esquemas de tabelas)
- N:N exige tabela própria, com a chave reunindo as chaves de ambas as entidades. Se a chave da tabela tem só parte delas, o professor aponta erro (1928229).
- 1:N: a chave da entidade do lado 1 vira FK na tabela do lado N. Se o relacionamento tem atributo e é opcional, a tabela própria também é defendida.
- 1:1 e (0,1)-(0,1): fusão de tabelas ou coluna extra. Se houve fusão, a cardinalidade só pode ser 0,1 ou 1,1 do lado fundido.
- Pista de código: `UNIQUE` sem `NOT NULL` indica participação 0,1. Com `NOT NULL`, indica 1,1 (638864).
- Entidade fraca tem linha dupla e chave composta: a parcial dela mais a chave da forte (2671160).
- Na notação da Cesgranrio, colchetes em coluna significam que aceita nulo. Sublinhado é chave.
- Autorrelacionamento 1:N vira FK na própria tabela, sem tabela nova.

### Modelo relacional: chaves e integridade
- Uma tabela tem exatamente uma chave primária, que pode ser composta. A PK não admite nulo e não repete.
- FK pode ser nula e pode repetir. A ausência de vínculo se representa só por NULL, nunca por número negativo. Uma PK pode ser ao mesmo tempo FK (tabela associativa).
- Superchave, chave candidata, chave primária e chave alternativa: o professor de 3117552 organiza em ordem de restrição. RG acrescentado a uma tabela cuja PK é CPF vira candidata/alternativa, não troca a PK.
- Domínio é o conjunto de valores permitidos, não "área do conhecimento" nem papel de chave. Linhas não têm ordem. Colunas têm ordem de esquema que não muda o significado (3347101).
- `CHECK` valida regra de domínio sobre a própria linha. Integridade referencial: o valor da FK é nulo ou existe na chave da tabela referenciada (836021).
- Para decidir se uma coluna "pode ser" PK ou FK, teste unicidade e nulos nos dados da tabela (1175341, 695113).

### Álgebra relacional
- Regra de bolso repetida por alunos: o SELECT do SQL corresponde à projeção (π) e o WHERE corresponde à seleção (σ). O nome engana, porque a seleção filtra linhas.
- Seleção filtra linhas. Projeção escolhe colunas e elimina duplicatas por definição de conjunto. Unárias: seleção, projeção, renomeação. Binárias: união, interseção, diferença, produto, junção, divisão (2695285).
- Armadilha de ordem: projetar uma coluna e depois filtrar por outra que já sumiu quebra a expressão (638859, 695109). Montar o SQL equivalente e traduzir ajuda.
- Em 2779624 a diferença entre alternativas está em o resultado final trazer CPF e nome, e não só o predicado da seleção.

### Níveis, modelos e desempenho
- Conceitual é independente de SGBD e de paradigma. Lógico depende do paradigma. Físico depende do SGBD (índices, partições, disco). A mesma tabela de comparação aparece em várias questões (2326962, 2695322).
- ANSI/SPARC: externo = visões de grupos; conceitual = visão comunitária de toda a estrutura; interno = armazenamento e caminhos de acesso. Independência lógica protege o externo; independência física protege o conceitual (2694738, 265762).
- Modelos pré-relacionais: hierárquico e rede. XML e orientado a objetos são mais recentes (277869).
- Desempenho: desnormalização controlada, menos junções nas consultas frequentes, índices escolhidos com critério. "Normalização extrema", "índice em tudo", "DISTINCT e ORDER BY sempre" são distratores (2695304, 3102719).
- Índice: B+ para igualdade, intervalo e ordenação; hash para igualdade; bitmap para baixa cardinalidade (265738).
- Transação: atomicidade é "tudo ou nada" (2041409). SERIALIZABLE é o nível mais restritivo e simula execução em série. Os níveis abaixo deixam passar leitura suja, não repetível ou fantasma (3117565).

### Notações
- IDEF1X versus pé de galinha: linha cheia, linha tracejada, bolinha vazia e posição da FK dentro ou fora do retângulo indicam relacionamento identificador ou não (265745, 2326973).
- Pé de galinha: cardinalidade mínima 0 vira relacionamento opcional.

## 3. Confusões frequentes de alunos

1. Ler a cardinalidade ao lado da entidade errada (a leitura cruzada).
2. Marcar mínimo 1 por achar que o sistema "precisa" da relação, quando o texto diz "poderá" ou "nem todo".
3. Misturar exclusiva/sobreposta com total/parcial. Um aluno não via por que a alternativa C estava errada se parecia igual à E (2695281).
4. Não conferir se um elemento da alternativa existe no conjunto dado (x7 em 3346871).
5. Esquecer a direção da tupla (a,c) versus (c,a) quando a participação é obrigatória (654524).
6. Ignorar a ressalva do professor ("pode" versus "deve") e marcar a alternativa que parecia óbvia no ternário (1175342).
7. Não saber qual é a chave de uma tabela associativa e em qual lado do 1:N fica a FK.
8. Trocar π e σ na álgebra por causa do SELECT/WHERE do SQL.
9. Achar que FK não aceita nulo (836021, 3118353) e que uma tabela pode ter duas PKs.
10. Confundir MER com DER, conceitual com lógico (2326962, 2694720).
11. Hesitar entre "desnormalizar tudo" e "desnormalizar com critério".
12. Sentir falta de informação: tabelas ilegíveis ou sem indicar qual coluna é PK (695113, 836021). Parte da dificuldade vem da imagem da prova, não do conceito.
13. Queixas recorrentes: questão pesada para cargo de nível médio (654524) e professor sem comentário (3347101, 3347124, 2695322).

## 4. Divergências de gabarito e questões contestáveis

**Professor propôs anulação ou apontou falha, e a banca manteve o gabarito:**
- 1757828: gabarito oficial B. O professor defende anulação (ou E), por causa do mapeamento de generalização para tabelas.
- 2671161: gabarito oficial E (nove atributos obrigatórios). O professor contou seis e propôs anulação. Alunos recorreram à convenção de que tudo é obrigatório salvo marcação.
- 2671171: gabarito oficial C. O professor propôs anulação porque todas as alternativas usam cardinalidade mínima 0 onde os conjuntos mostram vínculo total.
- 3038281: gabarito C. O professor diz que nenhuma alternativa está certa e que deveria ser anulada.
- 638908: gabarito A. O professor vê mais de um gabarito possível.

**Alunos discordam do gabarito ou da explicação:**
- 1175339: um aluno acha que sócio e cartão deveria ser 0..1 e que a resposta seria E. Outros defendem D porque o cartão nasce no cadastro.
- 265680: alunos divergem do professor sobre torcedor e cartão (1,1 ou 0,1) e sobre o motivo do erro da alternativa E.
- 265745: alunos acham que o diagrama mostra relacionamento não identificador e estranham o gabarito.
- 401546: aluno discorda do gabarito C e pergunta por que a E (data de entrega no pedido, motivo ligado a uma entrega) estaria errada.
- 2462831: gabarito A, mas muitos marcaram D. Aluno questiona a cardinalidade cliente-hotel (1,n).
- 1176499: aluno incomodado porque a definição matemática de função pediria (0:N)-(1:1). Aceitou D porque as outras não são função.
- 836021: aluno pergunta onde se afirma que A1 é PK (dado possivelmente perdido na coleta).
- 835998: aluno acha a alternativa E imprecisa ("entre linhas de tabelas" sem dizer diferentes). Outro lembra o autorrelacionamento.
- 277869: um comentário (voto negativo) contesta que rede seja modelo antigo. Os demais concordam com B.

**Dúvidas sem divergência real:** 1721059 (D versus E), 2695281 (C versus E), 2695422 (categoria intermediária), 2326962 (o professor chama o DER de lógico e os alunos de conceitual; a letra C coincide), 695113 (tabela ilegível).

## 5. Lições para o perfil da Cesgranrio

1. **Muito diagrama e cenário narrado.** O texto traz regras de negócio e a pergunta é qual diagrama ou esquema preserva a semântica. Leia cada frase como uma restrição.
2. **Alternativas quase iguais.** Elas diferem por uma cardinalidade, um sublinhado, um colchete ou uma chave. Não confie na primeira impressão.
3. **Verificação mecânica com conjuntos e tuplas:** testar máximo, mínimo e subclasse. Treine a rotina em vez de decorar teoria.
4. **Conceito curto e direto** no resto: domínio, FK nula, uma PK por tabela, atomicidade, σ versus π, conceitual versus físico. É ponto fácil se a definição estiver firme.
5. **Distratores de conceito vizinho:** domínio como área do conhecimento, FK sem nulo, projeção que filtra linhas, hierárquico misturado com XML.
6. **Notação própria.** A banca inventa sintaxe (REF, colchetes para nulo, sublinhado para chave) e explica na própria questão. A legenda é parte da prova.
7. **Reaproveitamento.** O mesmo tipo de questão reaparece em BB, BASA, BANESE, BNDES, CEF, IPEA, CNU e Transpetro. Resolver prova antiga da Cesgranrio treina o formato.
8. **Gabarito às vezes frágil.** Em 5 das 76 questões o professor viu motivo de anulação e a banca manteve. Em prova, marque a mais provável e siga adiante.
9. **Dificuldade de visualização, não de teoria.** MER com conjuntos foi descrito como pesado até para cargo de nível médio.

## 6. O que ainda falta coletar

- Comentários das outras disciplinas (Português, Inglês, Projetos, Governança, Eng. de Software/UX, BI, Lógica, Segurança). Nada sobre elas nesta amostra.
- SQL, normalização (1FN a 3FN), DDL/DML, transações e índices em maior volume. Aqui só apareceram de relance.
- Disciplina, assunto e gabarito dos 21 registros sem identificação.
- Comentário do professor inteiro nas 40 questões cortadas em 2.200 caracteres.
- As figuras (diagramas e tabelas) das questões, sem as quais várias explicações ficam abstratas.
- Os 11 registros sem comentário do professor.
- O número real de comentários de alunos (`nStud` veio zerado) e a ordem por votos.
- Confirmação independente do que a banca decidiu nas questões em que o professor propôs anulação.
- Questões de Processos de Negócios da Transpetro de outros anos, com comentário.
