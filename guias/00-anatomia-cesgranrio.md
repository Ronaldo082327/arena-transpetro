# Anatomia da Cesgranrio · como a banca pergunta e como se responde

Este capítulo vale para as 70 questões. Ele reúne o que se repete em todos os concursos da Cesgranrio analisados (Transpetro 2011, 2018 e 2023; Petrobras 2004 a 2018; BNDES 2008 a 2024; Banco do Brasil 2018 a 2023; Caixa 2021 a 2026; BASA 2022 e 2024; Banese 2025; IPEA, AgeRIO, Eletronuclear, CNU, Liquigás, Bacen, Chesf, CEFET-RJ), a partir de cerca de 1.000 questões dos cadernos do TecConcursos, 16 gabaritos oficiais da Transpetro 2023 e as provas reais da Ênfase 5. Os guias por disciplina aplicam estas regras tópico a tópico.

## 1. O que a prova é

| Fato | Consequência |
|---|---|
| 70 questões, 5 alternativas (A a E), 1 ponto cada, sem desconto por erro | Marque as 70. Chute é obrigatório, mas chute calculado (seção 6) |
| Específicas 21 a 70 (50), Português 1 a 10, Inglês 11 a 20 | As específicas vêm misturadas por tema, não em blocos |
| Eliminação: menos de 25/50 nas específicas, menos de 10/20 nas gerais, zero em Português ou Inglês | Inglês é trava: garanta as questões mecânicas |
| Habilitação só pela nota das específicas; classificação final pela soma | Cada ponto de Inglês vale o mesmo que um de Dados na ordem final |
| 330 minutos (4h30 + 60 min deferidos) | 3,5 min por questão com folga para transcrição e segunda passada |
| Programa da Ênfase 5 idêntico ao de 2023 (então Ênfase 6), bloco a bloco | A prova de 2023 é o espelho mais fiel; a Banese 2025 mostra o estilo atual |

Peso real em 2023 nas 50 específicas: Dados e BI 17, Engenharia de Software e UX 10, Segurança 7, Projetos 7, Governança e LGPD 5, Lógica 4.

## 2. Os seis comportamentos que se repetem em todos os concursos

**1. O distrator é a definição correta de outra coisa.** A questão-assinatura é a do rootkit (Transpetro 2023): o enunciado pergunta o que diferencia o rootkit e as cinco alternativas são as definições exatas de rootkit, trojan, worm, phishing e spyware. O mesmo molde aparece em ACID (as quatro definições permutadas entre as letras), nas fases do ETL (a definição de transformação oferecida na pergunta sobre extração), nas operações OLAP, nos papéis do Scrum, nas técnicas de ideação, nas ferramentas de segurança. Quem sabe uma frase por conceito acerta; quem sabe muito sobre um conceito e nada sobre os vizinhos erra. Por isso o material de memorização útil é o comparativo ("X versus Y em uma linha"), e os decks Anki deste pacote são quase todos de contraste.

**2. Caso narrativo com uma frase decisiva no meio do ruído.** No BNDES 2024 um enunciado inteiro descreve problemas na integração de módulos e a resposta é teste de unidade, porque uma frase diz "mesmo antes da integração". Na Petrobras 2018 gerentes "colaboravam num fluxo de tarefas" e a palavra "colaboravam" está lá para empurrar ao diagrama de colaboração, quando a resposta é o de atividades. Na Transpetro 2023 Q61, a frase final de finalidade ("tomada de decisão baseada em dados") aponta para o distrator (IA) e o substantivo central ("rede de sensores") aponta para a resposta (IoT). Treino que isso pede: sublinhar a frase que decide antes de olhar as alternativas.

**3. Distratores recheados de absolutos.** "Apenas", "somente", "sempre", "nunca", "todos", "obrigatoriamente", "exclusivamente", "incapacidade de". A correta tende a ser a mais moderada e a mais abrangente. Confirmado literalmente nas questões de Data Lake, Data Mart, independência de dados e esquema estrela da Transpetro 2023: todas as erradas eram restritivas e a certa era flexível. Exceção: lei seca (LGPD) e normas, onde o absoluto pode ser literal ("apenas o controlador e o operador são agentes de tratamento").

**4. Inversão lado a lado.** Na questão estrela × floco de neve (Transpetro 2023, Ênfase 7), duas alternativas afirmam exatamente o oposto da correta, trocando "normalizado" por "desnormalizado" e "mais junções" por "menos". Quando duas alternativas dizem o contrário uma da outra, uma delas é o gabarito. Vale para roll-up × drill-down, verificação × validação, IDS × IPS, estático × dinâmico.

**5. Em banco de dados, código literal.** CREATE TABLE completo, SELECT com JOIN e subconsulta, WITH RECURSIVE, Cypher: cinco alternativas diferindo por uma cláusula. O formato mais recorrente é "qual comando será executado sem erro", que apareceu em quatro provas (Transpetro 2018 e 2023, Eletronuclear 2022, BASA 2022) e mistura de propósito erro de integridade referencial, erro de sintaxe (número de valores diferente do número de colunas) e coluna inexistente. A habilidade cobrada é ler cinco comandos quase idênticos e achar o que difere, com os dados do enunciado.

**6. A banca repete, inclusive entre ênfases do mesmo dia.** ETL e OLAP da Ênfase 7 e ACID e Data Lake da Ênfase 6 da Transpetro 2023 saíram do mesmo conjunto base. As quatro ênfases de TI de 2026 terão prova no mesmo dia; as quatro provas de TI de 2023 são o treino mais preditivo que existe.

## 3. O que a Cesgranrio nunca faz neste perfil de prova

Não usa certo/errado (sempre A a E). Não cobra 4FN ou 5FN nem álgebra relacional com símbolos. Não cobra tuning de SGBD específico. Não cobra MOLAP/ROLAP/HOLAP em detalhe. Não cobra configuração de ferramenta de segurança (cobra conceito e função). Não cobrou, em 168 questões de PMBOK, os 12 princípios nem os 8 domínios da 7ª edição (quem cobra isso é FGV, Cebraspe e IBFC). Não cobra fórmula de Excel em "manipulação de dados em planilhas". Não usa ambiguidade em Português (planta erro gramatical objetivo). Não põe glossário nem tradução no texto de Inglês. Não cobra IA generativa nesta ênfase (ML aparece aplicado, e só nas ênfases de Ciência de Dados e Infraestrutura).

## 4. Os formatos de questão e o gesto que resolve cada um

| Formato | Como reconhecer | Gesto que resolve |
|---|---|---|
| Definição canônica com vizinho | "X é", "caracteriza-se por", "o conceito que descreve" | Diga a frase canônica do conceito antes de ler as alternativas; elimine a que define OUTRO conceito |
| Permutação de definições | As mesmas quatro frases embaralhadas entre as letras | Ancore em duas definições que você tem certeza; a alternativa em que as duas estão no lugar certo é a resposta |
| Caso narrativo | Personagens, empresa, situação de 3 a 6 linhas | Sublinhe a frase decisiva; ignore o resto; classifique (nível de teste, tipo de requisito, diagrama, ferramenta) |
| Código ou figura para executar | Tabela com dados, DER com instâncias, SQL, Cypher, DDL | Execute na mão com os dados do enunciado; em SQL, ache a cláusula que difere entre as cinco |
| "Qual roda sem erro" | Cinco comandos quase iguais | Checklist: número de valores = número de colunas? coluna existe? FK aponta para pai existente? PK duplicada ou nula? |
| Afirmativas I, II, III | "Está correto o que se afirma em" | Procure a única inversão plantada; decida uma afirmativa com certeza e elimine as combinações incompatíveis |
| Narrativa de navegação | "A analista via X por estado e passou a ver só Y" | Traduza cada movimento em uma operação (drill-down, roll-up, slice, dice, pivot, drill-through) |
| Norma, lei ou guia pelo número ou pela letra | "A norma que trata de", "segundo o Guia Scrum", "nos termos da LGPD" | Número junto com a função; frase do guia com uma palavra trocada é lei seca |
| Negativa ("NÃO", "EXCETO", "INCORRETA") | Maiúsculas no enunciado | Marque no caderno a palavra; procure a alternativa falsa; quatro verdadeiras confirmam |
| Reescrita (Português e Inglês) | "mantém o sentido e a correção", "could be replaced by" | Teste sentido primeiro, depois correção gramatical; a certa preserva os dois |

## 5. Heurísticas universais na dúvida (em ordem de força)

1. **Tema.** A alternativa que fala de outro assunto ou de outra sigla está errada.
2. **Absoluto.** "Apenas", "sempre", "nunca", "todos", "exclusivamente" marcam a errada (exceto lei seca).
3. **Espelho.** Duas alternativas opostas: uma delas é o gabarito.
4. **Moderação e abrangência.** Entre duas plausíveis, a mais moderada e mais abrangente.
5. **Vizinho.** Em Segurança, UX, BI e Projetos, a alternativa que define outro conceito da mesma família está errada.
6. **Última frase do enunciado.** Costuma ser isca; a resposta está no substantivo central.
7. **Opção óbvia ausente.** Se a sua resposta não está nas alternativas, teste as que estão (Transpetro 2023 Q22, generalização parcial e compartilhada).
8. **Aridade.** Cardinalidade em relacionamento ternário fala dos pares das outras duas entidades (Transpetro 2023 Q27, gabarito C e não A).

## 6. Chute calculado: a regra do bloco de 10

Com 16 gabaritos oficiais da Transpetro 2023 (1.114 questões), a Cesgranrio equilibra as letras dentro de cada bloco de 10 questões (1 a 10, 11 a 20, 21 a 30 e assim por diante), além de no caderno inteiro. O modelo de máxima entropia ajustado por máxima verossimilhança rejeita a independência das letras com folga, e a regra ótima é simples:

1. Ao fechar cada bloco de 10, conte quantas vezes cada letra apareceu nas suas respostas com certeza.
2. Em cada chute do bloco, entre as alternativas que sobraram depois da eliminação, marque a letra com a menor contagem no bloco.
3. Empate: desempate pela menor contagem do caderno inteiro.
4. Não some os chutes à contagem.

Backtest com validação cruzada, 70% de certezas: acerto no chute vai de 20% para 31% sem eliminar nada, e de 33% para 45% eliminando duas alternativas. Em pontos, com cerca de 20 chutes, algo entre 2 e 5 pontos. Se em 2026 as letras forem independentes, a regra acerta os mesmos 20% do chute cego: não há como piorar. O grosso do ganho continua sendo eliminar alternativas pelas heurísticas da seção 5.

## 7. Como usar este pacote nos 34 dias

**Os guias.** Um por disciplina, todos com a mesma estrutura: radar da banca, formatos de questão, tópico a tópico (o que cobra, como pergunta, onde confunde, macete, questão comentada, cards), pares e pegadinhas, lei seca, checklist de véspera. Leia a seção 3 do guia antes da sessão de questões do dia no TecConcursos; depois de errar, volte ao subitem e ao macete.

**O deck Anki.** Um arquivo único, importável, com uma tag por disciplina e subitem. Importe uma vez; estude 25 minutos por dia; cards novos limitados a 30 por dia nas semanas 1 e 2 e a 15 nas semanas 3 e 4. Suspenda os cards que você acerta três vezes seguidas com facilidade. Crie cards novos só a partir de erro.

**A taxonomia de erro.** Todo erro em questão recebe um tipo: conteúdo (não sabia), leitura (perdeu a frase decisiva), tempo (travou e chutou), chute errado (eliminou mal). Acerto por eliminação sem saber o porquê conta como erro de conteúdo. Erros de leitura pedem treino de sublinhar; erros de conteúdo pedem card e releitura do subitem; erros de tempo pedem a regra do salto (3 minutos em conceitual, 6 em execução).

**A véspera.** No dia 05/12, só a seção 6 de cada guia (checklists) e este capítulo. Nada de questão nova.

## 8. Protocolo do dia da prova em dez linhas

1. Chegue 1h30 antes; confirme com o fiscal o horário de término com os 60 minutos, o apoio de perna, a mesa e cadeira e o protetor auricular.
2. Escreva no caderno a hora de início e os marcos: Inglês 0h50, Q45 2h05, Q70 3h30, Português 4h05, conferência 5h10.
3. Inglês primeiro (45 min): perguntas antes do texto; número, pronome, conectivo, ideia principal, sinônimo, informação específica. Transcreva as 10.
4. Específicas 21 a 45 e 46 a 70, 3 minutos por questão; marque na margem ✔, as letras que sobraram ou ×. Transcreva a cada 25.
5. Regra do salto: conceitual aos 3 minutos, execução aos 6; provisória e "?".
6. Pausa de postura de 1 minuto a cada 50; água em goles; banheiro acompanhado uma vez, por volta de 2h30.
7. Português por último (35 min). Transcreva as 10.
8. Segunda passada: "?" com motivo concreto; depois × com a regra do bloco de 10. Nenhuma em branco.
9. Conferência: cartão sem campo vazio ou duplo, assinatura, cópia das 70 respostas no Cartão de Confirmação.
10. Atraso de 15 minutos num marco: corte a segunda passada, nunca a conferência.

## 9. Fontes

Edital nº 04 TRANSPETRO/PSP/TERRA/NÍVEL SUPERIOR 2026.4 e retificação de setembro (prova em 06/12/2026). Provas Cesgranrio Transpetro 2023 (Ênfases 4, 6 e 7) e 2018 (Processos de Negócio). Seis cadernos TecConcursos "Treino massivo Cesgranrio 10 anos" (cerca de 1.000 questões, 2016 a 2026). Dezesseis gabaritos oficiais Transpetro 2023 (modelo do chute). Relatório de Inteligência da Prova (30/08/2026) e Dossiê Estratégico (31/08/2026). Conteúdo Programático Comentado e prova 2023 comentada (02/11/2026).
