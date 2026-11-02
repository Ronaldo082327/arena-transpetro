# Lógica Matemática · Guia Cesgranrio de revisão e fixação

Quatro questões em 2023 (28, 35, 36 anulada, 37; 8% dos 50 pontos específicos): um argumento simbólico, uma categórica e dois problemas aplicados; o bloco é decidido por três reflexos (contrapositiva inverte e nega; condicional falsa entrega os dois valores; comece pela premissa que fixa valores) e por volume de questões.

## 1. Radar da banca

### 1.1 O que a Cesgranrio cobra nesta disciplina (todos os concursos, 2014–2026)

Base: `txt/indice_08.txt` (47 questões Cesgranrio; o caderno não está em texto no acervo), a prova 2023 comentada, as Questões-Chave da planilha (Petrobras 2018 e 2012, com ID) e as questões Cesgranrio comentadas nas aulas 00 a 05 do Estratégia (`txt/estrategia_logica_NN.txt`; citadas por concurso e ano, sem ID).

| Tópico | Questões no caderno (n e %) | Transpetro 2023 / 2018 | Prioridade |
|---|---|---|---|
| Equivalências e negação de compostas | 8 (17,0%) | 2023: Q35 · 2018: p ∧ ¬(q ∧ r) (Estratégia aula 02) | máxima |
| Argumentos: métodos da tabela-verdade | 7 (14,9%) | 2023: Q28 · 2018: "Ana gosta de Matemática" (aula 05) | máxima |
| Argumentos: diagramas, categóricas, negação de quantificadores | 6 (12,8%) | 2023: Q35 | máxima |
| Associação de informações | 3 (6,4%) | 2023: Q37 | alta |
| Sequências | 4 (8,5%) | nenhuma | média |
| Orientação no plano, espaço e tempo | 3 (6,4%) | nenhuma | média |
| Verdade e mentira | 2 (4,3%) | nenhuma | média |
| Tabela-verdade, valoração, tautologia/contradição | 1 + 1 (4,3%) + embutido | 2018: "qual é uma contradição?" (aula 01) | alta (modelo Petrobras 2018) |
| Condição necessária e suficiente; álgebra de proposições | 1 + 1 (4,3%) | 2018: p ∧ ¬(q ∧ r) | média |
| Lógica de primeira ordem (tradução) | 1 (2,1%) | 2018: "Todo aluno de Informática" (aula 04) | média |
| Datas, sudoku, outros exercícios | 1 + 1 + 7 (19,1%) | 2023: Q36 (ordenação, anulada) | baixa a média |
| FBF, sistemas dedutivos, decidibilidade (8.5, 8.6, 8.7) | 0 | nenhuma | média (edital; retorno binário) |

Leitura: 30 de 47 questões (64%) são lógica de proposições; equivalência/negação e argumentação somam 21 (45%). As quatro de 2023 foram argumento simbólico, categórica com De Morgan e dois problemas aplicados; o bloco de quatro da Petrobras 2018 (Analista de Sistemas) foi equivalência, valoração e dois argumentos.

### 1.2 O que ela nunca (ou quase nunca) cobra

- Demonstrações formais longas, lógica modal, fuzzy, circuitos: nenhuma. `[sem precedente localizado]`
- FBF por inspeção (8.5): nenhuma direta; só a definição indireta "equivalentes sse p ↔ q é tautologia" (Petrobras 2012). `[sem precedente direto]`
- Decidibilidade e completude pelo nome (8.6, 8.7): nenhuma. `[sem precedente localizado]`
- Tabela-verdade com quatro ou mais variáveis: a banca prefere valoração ou inspeção.

### 1.3 O que foi descartado deste guia e por quê

Matemática básica dos Mapas da Lulu 1.5 a 1.26 (não é Lógica Matemática do Anexo IV); argumentos falaciosos informais e raciocínio crítico (aulas 06 e 07 do Estratégia, sem questão Cesgranrio; ficam só as duas falácias formais); sudoku e calendários (uma questão cada, nenhuma na Transpetro).

## 2. Os formatos de questão desta disciplina

### Formato L1: equivalência de frase em português (contrapositiva)

Como reconhecer: "Essa sentença é logicamente equivalente a", partindo de "Se ..., então ..." e oferecendo cinco condicionais.

Exemplo real: "Se dois números inteiros são pares, então a soma é par" ≡ "(C) Se a soma é ímpar, então algum desses números é ímpar" (Cesgranrio · Petrobras 2018 · Q878397).

Procedimento: (1) escreva p → q; (2) inverta E negue: ¬q → ¬p; só inverteu é recíproca, só negou é inversa; (3) ao negar "e", "ou" ou quantificador embutido, aplique De Morgan ou troque o quantificador (¬"os dois são pares" = "algum é ímpar"); (4) se nenhuma alternativa for condicional, use ¬p ∨ q.

Erro típico: "os dois são ímpares" (D) e a recíproca (E).

### Formato L2: negação de proposição composta em português

Como reconhecer: "A negação é", "o que João disse não era verdade, portanto", "é falso se, e somente se".

Exemplo real: "Se chovesse, o show não seria cancelado" era falso, portanto "(E) choveu, e o show foi cancelado" (Cesgranrio · Liquigás 2018, Estratégia aula 02).

Procedimento: simbolize ("mas", "porém", "nem" são ∧; "das duas, pelo menos uma" é ∨); negue: ¬(p → q) = p ∧ ¬q; ¬(p ∧ q) = ¬p ∨ ¬q; ¬(p ∨ q) = ¬p ∧ ¬q; reescreva, comutando se preciso.

Erro típico: negar condicional com condicional; negar "e" com "e".

### Formato L3: negação de proposição quantificada

Como reconhecer: "é falsa a afirmação: Todos ..."; "a negação de 'Todo A é B' é".

Exemplo real: falsa "Todos os habitantes possuem pelo menos uma bicicleta" dá "(B) há pelo menos um habitante que não possui bicicleta" (Cesgranrio · Eletronuclear 2022, Estratégia aula 03).

Procedimento: troque o quantificador (todo ↔ algum) e negue o predicado; elimine alternativas que mantêm "todos" ou "nenhum".

Erro típico: negar "todo" com "nenhum"; negar "pelo menos 18" com "mais de 18" (é "menos de 18").

### Formato L4: valoração ("a condicional é falsa; qual o valor de ...")

Como reconhecer: "o valor lógico de (¬p) → (¬q) é FALSO"; "que valoração torna a fórmula falsa"; "quantas linhas tem a tabela".

Exemplo real: "(¬p) → (¬q) é FALSO. O valor de p ∨ (¬q) é igual ao de (E) p ∧ q" (Cesgranrio · Petrobras 2018 · Q878398).

Procedimento: condicional falsa é V → F: ¬p = V (p = F), ¬q = F (q = V); substitua nas alternativas e compare; não tabule. Linhas = 2ⁿ, n = átomos distintos.

Erro típico: não ver que a condicional falsa fixa os dois átomos; contar ocorrências em vez de átomos.

### Formato L5: tautologia, contradição ou contingência por inspeção

Como reconhecer: "Qual das proposições é uma contradição?" com cinco fórmulas.

Exemplo real: "(C) ¬(P ∨ Q) ↔ (P ∨ Q)" (Cesgranrio · Transpetro 2018, Estratégia aula 01).

Procedimento: procure o "sempre": p ∨ ¬p (V), p ∧ ¬p (F), X ↔ X (V), X ↔ ¬X (F); "ou" com termo V é V; "e" com termo F é F; condicional com antecedente sempre F é V. Tabule só o que sobrar; respeite a precedência (p ∨ q → q é (p ∨ q) → q).

Erro típico: achar (P ∧ ¬P) → Q contradição (é tautologia).

### Formato L6: argumento, "qual conclusão torna válido" (símbolos ou português)

Como reconhecer: premissas (uma delas conjunção ou proposição simples) e cinco conclusões; ou encadeamento de "se ... então" com um fato final ("Ora, como viajei").

Exemplo real: P1 ¬A → (¬D ∨ E); P2 D ∧ ¬E; P3 ¬A ∨ B; conclusão "(D) B" (Cesgranrio · Transpetro 2023 · questão 28).

Procedimento: (1) comece pela premissa que fixa valores; (2) propague: condicional V com consequente F derruba o antecedente (MT); com antecedente V levanta o consequente (MP); "ou" V com um lado F levanta o outro (SD); bicondicional V iguala; (3) a conclusão é a que ficou obrigatoriamente V; (4) se só se obtém ¬(c ∧ v), conclua ¬c ∨ ¬v (CEFET-RJ 2014).

Erro típico: começar pela condicional e tabular quatro variáveis; fortalecer a conclusão ("não choveu e não ventou"); esquecer que conclusão condicional com antecedente F é V (a AgeRIO 2023 ficou com dois gabaritos por isso).

### Formato L7: regra de inferência pelo nome

Como reconhecer: "pela regra do silogismo disjuntivo"; "quais regras justificam a validade"; "para inferir ¬p, pode-se assumir".

Exemplo real: "para inferir ¬p sem refutar p → q, assuma (B) ¬q" (Cesgranrio · Transpetro 2012, Estratégia aula 05); (¬A ∧ ¬G) → ¬P mais P ⊢ A ∨ G por "(D) Modus Tollens e Lei de De Morgan" (Cesgranrio · Petrobras 2018 · Q878400).

Procedimento: identifique a forma (MP, MT, SH, SD, dilema construtivo); elimine nomes que não são regras ("paradoxo", "contingência"); conclusão disjuntiva com antecedente de negações conjuntas = MT + De Morgan.

Erro típico: afirmar o consequente como modus ponens; a banca chama o dilema construtivo de "silogismo disjuntivo" (Petrobras 2012): aceite as duas leituras.

### Formato L8: proposição categórica, consequência lógica e diagramas

Como reconhecer: "consequência lógica de 'Todo ...'"; "alguns ... e nenhum ..., então é possível afirmar"; premissas com nome próprio ("Chico é orgulhoso").

Exemplo real: "Todo profissional do posto é médico ou enfermeiro" dá "(B) quem não é médico e não é enfermeiro não é profissional do posto" (Cesgranrio · Transpetro 2023 · questão 35).

Procedimento: "todo A é B" = ∀x (A → B), só rende a contrapositiva; desenhe círculos (A dentro de B; disjuntos para "nenhum"; ponto na interseção para "algum") e teste cada alternativa em todos os desenhos; escolha a mais fraca e literal ("pelo menos um"); "ou" é inclusivo.

Erro típico: "todo B é A"; "ou" exclusivo; "nenhum" quando os desenhos admitem interseção.

### Formato L9: tradução para lógica de primeira ordem

Como reconhecer: predicados definidos e cinco fórmulas com ∀ e ∃.

Exemplo real: "Todo aluno de Informática estuda algum tópico de Matemática Discreta" = "(A) ∀x((A(x) ∧ I(x)) → ∃y(T(y) ∧ E(x, y)))" (Cesgranrio · Transpetro 2018, Estratégia aula 04).

Procedimento: "todo" pede ∀ com →; "algum" pede ∃ com ∧; condição de pertencer no antecedente; variável nova para objeto novo; "necessário" fica depois da seta.

Erro típico: ∀x (A ∧ B); inverter necessário e suficiente.

### Formato L10: raciocínio aplicado (associação, ordenação, verdade e mentira)

Como reconhecer: três pessoas, três profissões, três cores; "N chegou antes de P"; "um deles mente".

Exemplo real: "(E) Armando é o professor e veste branco; Beto é o médico; Carlos veste verde" (Cesgranrio · Transpetro 2023 · questão 37).

Procedimento: associação = tabelas de dupla entrada, X nas proibições, fechar linhas e colunas, conferir fato por fato; ordenação = linha e setas, verificar unicidade (Q36 de 2023 foi anulada por admitir duas ordens); verdade/mentira = hipótese, propagação, contradição.

Erro típico: marcar a alternativa "quase toda certa" (dois fatos certos e um errado, antes da certa).

### Formato L11: álgebra de proposições e definições teóricas

Como reconhecer: "p ∧ ¬(q ∧ r) é equivalente a"; "os operadores podem ser deduzidos de"; "moléculas sempre falsas constituem uma".

Exemplo real: "(C) (p ∧ ¬q) ∨ (p ∧ ¬r)" (Cesgranrio · Transpetro 2018, Estratégia aula 02).

Procedimento: De Morgan primeiro, distributiva depois; decore: equivalência = bicondicional tautológica; {¬, ∧} basta; contradição = sempre falsa.

## 3. Tópico a tópico

### 8.1 Sentido lógico-matemático convencional dos conectivos

**Peso.** Embutido em quase todas as 30 questões de proposições. Diretas: conectivo de "José corre, mas não alcança o ônibus" (Petrobras 2010, aula 00); condição necessária e suficiente (1 no caderno; AgeRIO 2023, BR 2012). Em 2023 entrou embutido em Q28 e Q35 (o "ou" inclusivo).

**O que a banca cobra.**
- Proposição: declarativa, V ou F, nunca ambos; não são proposições perguntas, ordens, sentenças abertas, paradoxos.
- Tabelas: ¬ inverte; ∧ V só em VV; ∨ F só em FF; ⊻ V com valores diferentes; → F só em VF; ↔ V com valores iguais.
- Tradução: "mas", "porém", "embora", "nem" (= e não) → ∧; "ou" inclusivo por padrão; "ou ... ou", "somente uma" → ⊻; "das duas, pelo menos uma" → ∨; "se p, então q", "quando p, q", "sempre que p, q", "q, se p", "p somente se q", "p é suficiente para q", "q é necessária para p" → p → q; "se e somente se", "necessária e suficiente" → ↔; "p, a menos que q" → ¬q → p.
- Suficiente × necessária: em p → q, p é suficiente e q é necessária. "Ser analista é condição necessária para ser engenheiro" = E → A (BR 2012, gabarito E). "Se um carro é azul, então não é pequeno nem caro" situa "pequeno ou caro" como suficiente para "não azul" (contrapositiva com De Morgan; AgeRIO 2023, gabarito B).

**Como ela pergunta.** Pergunta direta de conectivo; reescrita de condição necessária/suficiente; tradução simbólica (8.4).

**Onde ela confunde.** "Mas" como disjunção; "ou" exclusivo; "p somente se q" como q → p; "necessário" trocado por "suficiente".

**Macete.** Adversativa é "e". "Se" é antecedente; "somente se" é consequente. Necessário fica depois da seta.

**Questão comentada 1.** (Cesgranrio · AgeRIO 2023, Estratégia aula 02) "'Se um carro é azul, então não é pequeno, nem caro' situa não ser pequeno e não ser caro como necessária para ser azul. Também situa a (A) condição de não ser pequeno e não ser caro como suficiente para ser azul. (B) condição de ser pequeno ou caro como suficiente para não ser azul. (C) ser pequeno como necessária para ser azul. (D) ser caro como necessária para ser azul. (E) ser azul como necessária para não ser pequeno nem caro." **Gabarito: B.** a → (¬p ∧ ¬c) ≡ (p ∨ c) → ¬a. A é a recíproca. C e D contrariam o consequente. E inverte a direção.

**Questão comentada 2.** (Cesgranrio · Petrobras 2010, Estratégia aula 00) "Conectivo de 'José corre, mas não alcança o ônibus': (A) Conjunção (B) Condicional (C) Negação (D) Disjunção (E) Disjunção exclusiva." **Gabarito: A.** "Mas" é "e" em lógica; a negação em C está dentro da segunda parcela.

**Para o Anki.**
- "Mas", "porém", "embora", "nem" → conjunção; "nem" = "e não".
- "p somente se q" → p → q; "p se q" → q → p.
- Necessária × suficiente → em p → q, p é suficiente e q é necessária; "A necessária para B" = B → A.
- "p, a menos que q" → ¬q → p.

### 8.2 Argumentos

**Peso.** 13 questões (27,7%; 7 por tabela-verdade, 6 por diagramas, vistas em 8.4). Transpetro 2023: Q28. Transpetro 2018: "Ana gosta de Matemática" (gabarito A). Petrobras 2018: Q878400 (regras, gabarito D) e argumento com conclusão omitida (gabarito A). AgeRIO 2023: chuva, bola, vento (banca: A). Transpetro 2012: inferir ¬p (B). BR 2012: código legível (C). Petrobras 2012: silogismo disjuntivo (D). Petrobras 2010: definição de validade (A). CEFET-RJ 2014 e CHESF 2012: encadeamentos.

**O que a banca cobra.**
- Válido: impossível premissas V e conclusão F; "para todas as linhas em que as premissas forem verdadeiras a conclusão também for verdadeira" (Petrobras 2010, gabarito A). Validade é forma; verdade é conteúdo. Válido com premissas V = sólido.
- Métodos: conclusão falsa (suponha F e premissas V; contradição = válido); premissas verdadeiras (extraia valores e teste); transitividade (a → p e p → ¬b dão a → ¬b, Transpetro 2018, gabarito A; i → l e l → f dão i → f, BR 2012, gabarito C).
- Regras: Modus Ponens (p → q, p ⊢ q); Modus Tollens (p → q, ¬q ⊢ ¬p; para inferir ¬p assume-se ¬q, Transpetro 2012, gabarito B); Silogismo Hipotético (p → q, q → r ⊢ p → r); Silogismo Disjuntivo (p ∨ q, ¬p ⊢ q); Dilema Construtivo (p → q, r → s, p ∨ r ⊢ q ∨ s; a banca chamou de "silogismo disjuntivo" na Petrobras 2012, gabarito D "comprarei livros ou comprarei um carro"); Dilema Destrutivo; Simplificação (p ∧ q ⊢ p); Conjunção; Adição (p ⊢ p ∨ q); Absorção.
- Falácias formais: afirmação do consequente (p → q, q ⊢ p) e negação do antecedente (p → q, ¬p ⊢ ¬q).
- Padrão literal: (¬A ∧ ¬G) → ¬P e P dão, por Modus Tollens, ¬(¬A ∧ ¬G) e, por De Morgan, A ∨ G (Q878400, gabarito D; a alternativa A oferecia "Paradoxo e Contingência").

**Como ela pergunta.** Formato L6 (Q28, Petrobras 2018, AgeRIO 2023, Transpetro 2018, CEFET, BR); formato L7 (Q878400, Petrobras 2012, Transpetro 2012); definição (Petrobras 2010).

**Onde ela confunde.** "Válido tem conclusão verdadeira"; afirmar o consequente como MP; conclusão forte quando só se garante a fraca; nomes que não são regras; conclusão condicional com antecedente F.

**Macete.** Comece pela premissa que fixa valores. Consequente F derruba o antecedente; antecedente V levanta o consequente; "ou" com um lado F levanta o outro. Conclusão válida = a que ficou obrigatoriamente V.

**Questão comentada 1.** (Cesgranrio · Transpetro 2023 · questão 28) "P1: ¬A → (¬D ∨ E). P2: D ∧ ¬E. P3: ¬A ∨ B. Conclusão que torna válido: (A) ¬D (B) E (C) ¬A (D) B (E) ¬B." **Gabarito: D.** P2 V: D = V, E = F. Em P1, ¬D ∨ E = F ∨ F = F; condicional V com consequente F exige ¬A = F, A = V (MT). Em P3, ¬A = F exige B = V (SD). A, B, C e E são falsas.

**Questão comentada 2.** (Cesgranrio · Petrobras 2018, Estratégia aula 05) "P1: p → [(¬r) ∨ (¬s)]. P2: [p ∨ (¬q)] ∧ [q ∨ (¬p)]. P3: r ∧ s. Conclusão: (A) ¬(p ∨ q) (B) (¬q) ∧ p (C) (¬p) ∧ q (D) p ∧ q (E) p ∨ q." **Gabarito: A.** P3: r = s = V. P1: consequente ¬r ∨ ¬s = F, logo p = F (MT). P2: p ∨ ¬q ≡ q → p e q ∨ ¬p ≡ p → q, juntos p ↔ q; com p = F, q = F. Então ¬(p ∨ q) = V. B, C, D têm termo falso; E é F ∨ F.

**Questão comentada 3.** (Cesgranrio · Petrobras 2018 · Q878400, Questão-Chave; enunciado condensado do registro da planilha, alternativas intermediárias não registradas) Premissas (¬A ∧ ¬G) → ¬P e P; conclusão A ∨ G. "Regras que justificam: (A) Paradoxo e Contingência ... (D) Modus Tollens e Lei de De Morgan." **Gabarito: D.** MT dá ¬(¬A ∧ ¬G); De Morgan dá A ∨ G. "Paradoxo" e "contingência" não são regras; as demais combinavam nomes reais na ordem errada.

**Questão comentada 4.** (Cesgranrio · AgeRIO 2023, Estratégia aula 05) "Se choveu, então a bola caiu ou o vento soprou. Se o vento soprou, o pássaro voou. Choveu, mas a bola não caiu. Conclusão: (A) o pássaro voou. (B) o vento não soprou. (C) o pássaro não voou. (D) se chover, a bola não irá cair. (E) se a bola não caiu, é porque não choveu." **Gabarito da banca: A.** P3: c = V, b = F. P1: c V exige b ∨ v = V; b = F, logo v = V. P2: v V exige p = V. A é V. B e C são F. E é V → F (F). D (c → ¬b) também é V → V = V: a questão tinha dois gabaritos; a banca ficou com a conclusão simples.

**Para o Anki.**
- Argumento válido → impossível premissas V e conclusão F; validade é forma, não verdade.
- Método da conclusão falsa → suponha conclusão F e premissas V; contradição = válido.
- MP × MT → p → q, p ⊢ q × p → q, ¬q ⊢ ¬p.
- Falácias formais → afirmar o consequente; negar o antecedente.
- Padrão Petrobras 2018 → (¬A ∧ ¬G) → ¬P mais P: Modus Tollens + De Morgan = A ∨ G.

### 8.3 A lógica sentencial

**Peso.** Guarda-chuva das 30 questões de proposições (63,8%); equivalências e negações (8; 17%) são o carro-chefe. Diretas sobre o sistema: linhas da tabela "na lógica sentencial clássica" (Petrobras 2012, gabarito B, 8); operadores deduzidos de {¬, ∧} (Petrobras 2011, gabarito B); p ∧ ¬(q ∧ r) (Transpetro 2018, gabarito C).

**O que a banca cobra.**
- Sintaxe (átomos, conectivos, parênteses) e semântica (valoração). Equivalências: p → q ≡ ¬p ∨ q ≡ ¬q → ¬p; p ∨ q ≡ ¬p → q; p ↔ q ≡ (p → q) ∧ (q → p) ≡ (p ∧ q) ∨ (¬p ∧ ¬q); ¬¬p ≡ p; De Morgan; distributivas; absorção; exportação ((p ∧ q) → r ≡ p → (q → r)); distribuição do antecedente: (p ∨ q) → r ≡ (p → r) ∧ (q → r) e (p ∧ q) → r ≡ (p → r) ∨ (q → r).
- Negações: ¬(p → q) ≡ p ∧ ¬q (a mais cobrada; nunca é outra condicional); ¬(p ∧ q) ≡ ¬p ∨ ¬q; ¬(p ∨ q) ≡ ¬p ∧ ¬q; ¬(p ↔ q) ≡ p ⊻ q.
- Recíproca (q → p), inversa (¬p → ¬q), contrapositiva (¬q → ¬p): só a contrapositiva é equivalente; recíproca e inversa equivalem entre si.
- Conjuntos completos de conectivos: {¬, ∧}, {¬, ∨}, {¬, →}, NAND, NOR; {∧, ∨} não gera negação.
- Casos reais: "Se Maria é advogada, então Joana é engenheira ou médica" ≡ "Se Joana não é engenheira, nem médica, então Maria não é advogada" (Eletronuclear 2022, gabarito C); "Se a entrega fosse amanhã, eu conseguiria concluir", dita dia 15, vira dia 16 "Se eu não consegui concluir, então a data não foi hoje, foi anteontem" (Liquigás 2018, gabarito E); "João não foi trabalhar, mas saiu com amigos" nega-se por "João foi trabalhar ou não saiu com amigos" (Liquigás 2018, gabarito A); "das duas, pelo menos uma: o depósito é amplo e claro, ou não fica em Albuquerque" é falso sse "fica em Albuquerque e não é amplo ou não é claro" (Liquigás 2018, gabarito A); negar "o leão não é feroz e a girafa não gorjeia" = l ∨ g = "se o leão não é feroz, então a girafa gorjeia" (Transpetro 2011, gabarito A).

**Como ela pergunta.** Formato L1, L2, L11. Os distratores de L1 são sempre a recíproca, a inversa e uma contrapositiva com o quantificador mal negado.

**Onde ela confunde.** Recíproca e inversa; negação de condicional como condicional; De Morgan sem trocar o conectivo; "os dois são pares" negado como "os dois são ímpares"; distribuição do antecedente mantendo o conectivo.

**Macete.** Contrapositiva = inverta E negue. Negar condicional = mantém o antecedente, troca a seta por "e", nega o consequente. De Morgan = nega tudo e troca e/ou. "Os dois" nega-se por "pelo menos um".

**Questão comentada 1.** (Cesgranrio · Petrobras 2018 · Q878397) "'Se dois inteiros são pares, então a soma é par' equivale a (A) Se dois inteiros são ímpares, a soma é ímpar. (B) Se algum dos dois é ímpar, a soma é ímpar. (C) Se a soma é ímpar, então algum desses números é ímpar. (D) Se a soma é ímpar, então esses dois números são ímpares. (E) Se a soma é par, então os dois são pares." **Gabarito: C.** d → s ≡ ¬s → ¬d; ¬d = "algum é ímpar". A e B: inversa (A ainda nega mal). D: contrapositiva com ¬d mal negado. E: recíproca.

**Questão comentada 2.** (Cesgranrio · Eletronuclear 2022, Estratégia aula 02) "'Se Maria é advogada, então Joana é engenheira ou médica' equivale a (A) Se Maria não é advogada, Joana não é engenheira ou não é médica. (B) Se Maria não é advogada, Joana não é engenheira nem médica. (C) Se Joana não é engenheira nem médica, então Maria não é advogada. (D) Se Joana é engenheira ou médica, então Maria é advogada. (E) Maria é advogada, mas Joana não é engenheira e médica." **Gabarito: C.** a → (e ∨ m) ≡ (¬e ∧ ¬m) → ¬a. A e B: inversas. D: recíproca. E: negação.

**Questão comentada 3.** (Cesgranrio · Liquigás 2018, Estratégia aula 02) "'João disse que, se chovesse, o show não seria cancelado.' Aquilo que João falou não era verdade. Portanto, (A) o show não foi cancelado porque choveu. (B) o show foi cancelado porque não choveu. (C) não choveu e o show não foi cancelado. (D) não choveu e o show foi cancelado. (E) choveu e o show foi cancelado." **Gabarito: E.** ¬(c → ¬s) ≡ c ∧ s. A e B inventam causalidade; C e D negam c.

**Questão comentada 4.** (Cesgranrio · Transpetro 2018, Estratégia aula 02) "p ∧ ¬(q ∧ r) é equivalente a (A) (p ∧ ¬q) ∧ (p ∧ ¬r) (B) (p ∨ ¬q) ∧ (p ∨ ¬r) (C) (p ∧ ¬q) ∨ (p ∧ ¬r) (D) (¬p ∨ q) ∧ (¬p ∨ r) (E) (¬p ∧ q) ∨ (¬p ∧ r)." **Gabarito: C.** De Morgan: p ∧ (¬q ∨ ¬r); distributiva: (p ∧ ¬q) ∨ (p ∧ ¬r). A exige ¬q e ¬r juntos. B troca o conectivo. D e E negam p.

**Para o Anki.**
- Negação de p → q → p ∧ ¬q.
- Equivalentes de p → q → ¬q → ¬p e ¬p ∨ q; recíproca e inversa NÃO equivalem.
- De Morgan → ¬(p ∧ q) ≡ ¬p ∨ ¬q; ¬(p ∨ q) ≡ ¬p ∧ ¬q.
- Distribuição do antecedente → (p ∨ q) → r vira "e"; (p ∧ q) → r vira "ou".
- Conectivos suficientes → {¬, ∧}, {¬, ∨}, {¬, →}; {∧, ∨} não basta.

### 8.4 A lógica de predicados de primeira ordem

**Peso.** 6 de diagramas e quantificadores (12,8%) + 1 de primeira ordem (2,1%). Transpetro 2023: Q35. Transpetro 2018: tradução "Todo aluno de Informática" (A). Petrobras 2012: Q486637 (gerente/funcionário, E) e "Todo professor usa óculos" (E). Eletronuclear 2022: bicicletas (B); orgulhoso/eletricista (E). Petrobras 2010: pesquisadores/pianistas (D). BR 2010: todo W é X (A). IBGE 2014: 18 anos (E). Transpetro 2012: chefe/departamento (D). BR 2012: gerente é programador (E). Liquigás 2012: gosta de si mesmo (A).

**O que a banca cobra.**
- Predicado P(x) vira proposição ao fixar x ou quantificar. ∀ (todo, qualquer, cada) e ∃ (algum, existe, pelo menos um, há).
- Traduções: "Todo A é B" = ∀x (A → B); "Algum A é B" = ∃x (A ∧ B); "Nenhum A é B" = ∀x (A → ¬B); "Algum A não é B" = ∃x (A ∧ ¬B). Dois objetos: "Todo chefe chefia um departamento" = ∀x (chefe(x) → ∃y (departamento(y) ∧ chefia(x, y))) (Transpetro 2012, D); "se uma pessoa não gosta de si mesma, não gosta de qualquer outra" = ¬g(i, i) → ∀x ¬g(i, x) (Liquigás 2012, A). "Todo gerente é programador" como ¬P(x) → ¬G(x) (BR 2012, E).
- Negações: ¬∀x P ≡ ∃x ¬P; ¬∃x P ≡ ∀x ¬P. Em português: "todo A é B" nega-se por "algum A não é B" (não "nenhum"); "algum A é B" por "nenhum A é B". "Todos têm pelo menos 18" nega-se por "pelo menos um tem menos de 18" (IBGE 2014, E); "Todo professor de matemática usa óculos" por "existe algum professor de matemática que não usa" (Petrobras 2012, E).
- Diagramas de Euler/Venn: "todo" = A dentro de B; "nenhum" = disjuntos; "algum" = ponto na interseção. Conclusão = o que vale em todos os desenhos. De "todo W é X, todo X é Y, todo Y é Z" só segue "todo X é Z" (BR 2010, A). "Alguns pesquisadores são atletas e nenhum pianista é atleta" só garante "algum pesquisador não é pianista" (Petrobras 2010, D). "Todo orgulhoso julga; eletricista não julga; Chico é orgulhoso" dá "Chico não é eletricista" (Eletronuclear 2022, E).
- Consequência de "todo A é B": a contrapositiva (Q35). Conclusão válida é a mais fraca: "pelo menos um" vence "mais de um" e "exatamente um" (Petrobras 2012, Q486637, E: a alternativa que só repete as premissas). ∀x∃y ≠ ∃y∀x.

**Como ela pergunta.** Formatos L8, L3, L9.

**Onde ela confunde.** "Todo" negado com "nenhum"; "todo A é B" convertido; "nenhum" ou "algum" afirmados quando os desenhos admitem ambos; ∀ com ∧; "exatamente um"; "ou" exclusivo.

**Macete.** Todo = ∀ com →; algum = ∃ com ∧. Negar todo = algum não; negar algum = nenhum. Desenhe e escolha a alternativa mais tímida.

**Questão comentada 1.** (Cesgranrio · Transpetro 2023 · questão 35) "Consequência lógica de 'Todo profissional de um posto de saúde é médico ou enfermeiro': (A) Todo médico do posto também é enfermeiro. (B) Se alguém não é médico e não é enfermeiro, então não é profissional do posto. (C) Nenhum enfermeiro do posto é médico. (D) Alguns profissionais do posto não são médicos nem enfermeiros. (E) Profissionais do posto não podem ser médicos e enfermeiros ao mesmo tempo." **Gabarito: B.** ∀x (P → (M ∨ E)); contrapositiva ¬(M ∨ E) → ¬P = (¬M ∧ ¬E) → ¬P. A: conversão. C e E: "ou" exclusivo. D: negação da afirmação.

**Questão comentada 2.** (Cesgranrio · Petrobras 2010, Estratégia aula 03) "Alguns pesquisadores são atletas e nenhum pianista é atleta, então (A) nenhum pianista é pesquisador. (B) nenhum pesquisador é pianista. (C) algum pianista é pesquisador. (D) algum pesquisador não é pianista. (E) algum pesquisador é pianista." **Gabarito: D.** O pesquisador atleta não é pianista. A, B, C e E dependem de o círculo dos pianistas cruzar o dos pesquisadores, o que as premissas não fixam.

**Questão comentada 3.** (Cesgranrio · Transpetro 2018, Estratégia aula 04) "'Todo aluno do curso de Informática estuda algum tópico de Matemática Discreta', com A(x) aluno, I(x) de Informática, E(x, y) x estuda y, T(x) tópico. Tradução: (A) ∀x((A(x) ∧ I(x)) → ∃y(T(y) ∧ E(x, y))) (B) ∀x(A(x) ∧ I(x)) ∧ ∀y(T(y) → E(x, y)) (C) ∃x∀y(A(x) ∧ I(x) ∧ T(y) ∧ ¬E(x, y)) (D) ∀x((A(x) ∧ I(x)) → ∀y(T(y) → E(x, y))) (E) ∃x∀y(A(x) ∧ I(x) ∧ T(y) ∧ E(x, y))." **Gabarito: A.** "Todo" = ∀ com →; "algum tópico" = ∃y com ∧. B afirma que todo x é aluno de Informática. C e E começam com ∃x. D diz que estuda todos os tópicos.

**Questão comentada 4.** (Cesgranrio · Eletronuclear 2022, Estratégia aula 03) "É falsa: 'Todos os habitantes possuem, pelo menos, uma bicicleta'. Portanto, (A) há pelo menos um habitante com duas bicicletas. (B) há pelo menos um habitante que não possui bicicleta. (C) todos possuem mais de uma. (D) nenhum possui mais de uma. (E) todos possuem uma." **Gabarito: B.** ¬∀ = ∃¬. C, D e E mantêm quantificador universal; A nega o predicado errado.

**Para o Anki.**
- "Todo A é B" × "Algum A é B" → ∀x (A → B) × ∃x (A ∧ B).
- Negação de "Todo A é B" → "Algum A não é B"; de "Algum A é B" → "Nenhum A é B".
- Única consequência segura de "Todo A é B" → a contrapositiva; "todo B é A" é conversão indevida.
- Conclusão em diagramas → a mais fraca e literal, válida em todos os desenhos; "pelo menos um".

### 8.5 Regras de formação de fórmulas

**Peso.** Nenhuma questão pede para reconhecer uma FBF. `[sem precedente localizado]` Aparece de lado: "duas fórmulas bem formadas p e q são equivalentes é o mesmo que afirmar que é tautologia p ↔ q" (Petrobras 2012, gabarito A) e a precedência em "p ∨ q → q" (Petrobras 2010).

**O que decorar.** Alfabeto: variáveis, conectivos, parênteses. Regras recursivas: (1) variável é FBF; (2) se A é FBF, ¬A é FBF; (3) se A e B são FBFs, (A ∧ B), (A ∨ B), (A → B), (A ↔ B) são FBFs; (4) nada mais. Convenções: parênteses externos omitidos; precedência ¬ > ∧ > ∨ > → > ↔; → associa à direita (p → q → r = p → (q → r)). Mal formadas: binário com um operando (p ∧), dois binários seguidos (p ∧ ∨ q), parênteses desbalanceados. Primeira ordem: termos, fórmulas atômicas P(t1, ..., tn), ∀x A e ∃x A; variável livre × ligada; sentença = sem variável livre.

**Como ela pergunta (previsão).** "Assinale a sequência que é uma FBF" ou "NÃO é FBF"; leitura por precedência.

**Onde ela confunde.** Fórmula ambígua apresentada como mal formada (p ∨ q → r é bem formada); "¬" tratado como binário.

**Macete.** Conte parênteses e verifique que todo binário tem dois vizinhos-fórmula.

**Questão-modelo (autoral).** "Sequências: I. (p ∧ q) → ¬r; II. p ∨ → q; III. ¬(p ↔ (q ∨ r)); IV. (p ∧ (q ∨ r). São FBFs APENAS (A) I e II (B) I e III (C) II e IV (D) I, III e IV (E) III e IV." **Gabarito: B.** II tem dois binários seguidos; IV fecha um parêntese a menos.

**Para o Anki.**
- Regras de FBF → átomo; ¬A; (A ∧ B), (A ∨ B), (A → B), (A ↔ B); nada mais.
- Precedência → ¬ > ∧ > ∨ > → > ↔; "p ∨ q → r" = "(p ∨ q) → r".
- Duas FBFs equivalentes é o mesmo que → p ↔ q tautologia (Petrobras 2012).

### 8.6 Sistemas dedutivos

**Peso.** Nenhuma questão nomeando sistema, correção ou completude. `[sem precedente localizado]` A parte prática (regras, validade) está em 8.2.

**O que decorar.** Sistema dedutivo = linguagem + axiomas + regras de inferência; produz derivações sintáticas. Γ ⊢ A: derivável (sintaxe). Γ ⊨ A: consequência semântica (toda valoração que satisfaz Γ satisfaz A). Tipos: axiomático (Hilbert: muitos axiomas, modus ponens); dedução natural (Gentzen: introdução e eliminação por conectivo); cálculo de sequentes; tableaux (refutação); resolução (forma clausal; base do Prolog). Correção: se Γ ⊢ A então Γ ⊨ A (não prova falsidade). Completude: se Γ ⊨ A então Γ ⊢ A (toda consequência tem prova; Gödel 1930 para a primeira ordem; não confundir com a incompletude de 1931, sobre a aritmética). Consistência: não deriva A e ¬A. Teorema da dedução: Γ, A ⊢ B sse Γ ⊢ A → B. Tabela-verdade e conclusão falsa são semânticos (⊨); regras nomeadas são sintáticas (⊢); na lógica clássica coincidem.

**Como ela pergunta (previsão).** Definição pareada: "toda fórmula derivável é válida" (correção); ⊢ × ⊨; "regras de introdução e eliminação" (dedução natural); "técnica do Prolog" (resolução).

**Onde ela confunde.** Correção por completude; completude (1930) por incompletude (1931); tabela-verdade como sintática.

**Macete.** Correção = NÃO PROVA BESTEIRA. Completude = NÃO DEIXA VERDADE SEM PROVA. ⊢ é regra; ⊨ é tabela.

**Questão-modelo (autoral).** "A propriedade que garante que toda fórmula derivável de um conjunto de premissas é também consequência semântica delas denomina-se (A) completude (B) consistência (C) correção (D) decidibilidade (E) compacidade." **Gabarito: C.** A é a recíproca; B é não derivar contradição; D é existir algoritmo; E trata de conjuntos infinitos.

**Para o Anki.**
- Correção × completude → ⊢ ⇒ ⊨ (não prova falsidade) × ⊨ ⇒ ⊢ (toda verdade tem prova).
- ⊢ × ⊨ → derivável sintaticamente × consequência semântica.
- Sistemas pelo nome → Hilbert (axiomático), Gentzen (dedução natural), sequentes, tableaux, resolução (Prolog).

### 8.7 Decidibilidade da lógica sentencial

**Peso.** Nenhuma questão localizada. `[sem precedente localizado]`

**O que decorar.** Decidível = existe algoritmo que sempre termina e responde sim ou não. Sentencial é decidível: a tabela com 2ⁿ linhas decide tautologia, contradição, contingência e validade em tempo finito (custo exponencial; SAT é NP-completo, mas termina). Primeira ordem é indecidível (Church e Turing, 1936) e semidecidível: há procedimento que confirma validade quando ela existe (enumeração de provas, garantida pela completude), mas pode não parar quando não. Completude e decidibilidade são independentes: a primeira ordem é completa e indecidível. Fragmentos decidíveis: lógica monádica. Procedimentos de decisão da sentencial: tabela, tableaux, resolução proposicional, formas normais.

**Como ela pergunta (previsão).** "Sobre a decidibilidade da lógica proposicional e da de primeira ordem" com a isca "a primeira ordem é decidível porque é completa".

**Onde ela confunde.** Decidível por completo; "indecidível" como "sem sistema de prova"; tabela-verdade para a primeira ordem.

**Macete.** Proposicional: decidível (a tabela termina). Primeira ordem: semidecidível. Completude ≠ decidibilidade.

**Questão-modelo (autoral).** "É correto afirmar que (A) a lógica sentencial é indecidível, pois a tabela cresce exponencialmente. (B) a de primeira ordem é decidível, pois tem sistema dedutivo completo. (C) a lógica sentencial é decidível, pois a tabela-verdade sempre termina em número finito de passos. (D) nenhuma lógica clássica é decidível. (E) a de primeira ordem é decidível por tabela-verdade." **Gabarito: C.** A confunde custo com decidibilidade; B confunde completude com decidibilidade; D é falsa para a sentencial; E: tabela não se aplica a domínios de primeira ordem.

**Para o Anki.**
- Sentencial é decidível porque → a tabela-verdade (2ⁿ) sempre termina.
- Primeira ordem → indecidível (Church, Turing), semidecidível e completa (Gödel 1930); completude ≠ decidibilidade.

### 8.8 Valores-verdade das proposições

**Peso.** Tabela-verdade 1, tautologia/contradição 1, álgebra 1, mais valoração embutida. Transpetro 2018: contradição (C). Petrobras 2011: valorações de (P → Q) → (¬P ∧ Q) (C, duas); "moléculas sempre falsas" (B). Petrobras 2010: tautologia (A); p → (q → r) falsa (D). IBGE 2014: (p ∧ q) ∨ (¬p ∨ ¬q) é tautologia (E).

**O que a banca cobra.**
- Tabelas (8.1). Classificação: tautologia (p ∨ ¬p; (p ∧ ¬p) → q; p ↔ p; disjunção com termo tautológico; condicional com antecedente contraditório); contradição (p ∧ ¬p; X ↔ ¬X; conjunção com termo contraditório); contingência. Equivalência = p ↔ q tautologia; implicação lógica = p → q tautologia.
- Casos: ¬(P ∨ Q) ↔ (P ∨ Q) é contradição (lados sempre opostos); (P ∧ ¬P) → Q é tautologia; (P ↔ Q) ∨ (Q ∨ ¬Q) é tautologia; (P ↔ P) ∧ (P ∨ Q) é contingência. (P → Q) → (¬P ∧ Q) é V em duas valorações (VV: V → F = F; VF: F → F = V; FV: V → V = V; FF: V → F = F). p → (q → r) é F só com p = V, q = V, r = F. (q → p) → (p → (q → p)) é tautologia (o consequente já é).

**Como ela pergunta.** Formato L5, L4, definição.

**Onde ela confunde.** F → V como F; (P ∧ ¬P) → Q como contradição; tabela de cinco fórmulas feita na pressa; precedência ignorada.

**Macete.** Procure o "sempre": p ∨ ¬p (V), p ∧ ¬p (F), X ↔ ¬X (F). "Ou" com um V é V; "e" com um F é F; "se" com antecedente F é V.

**Questão comentada 1.** (Cesgranrio · Transpetro 2018, Estratégia aula 01) "Qual é uma contradição? (A) (P → Q) ∨ ¬Q (B) (P ∧ ¬P) → Q (C) ¬(P ∨ Q) ↔ (P ∨ Q) (D) (P ↔ P) ∧ (P ∨ Q) (E) (P ↔ Q) ∨ (Q ∨ ¬Q)." **Gabarito: C.** Bicondicional entre fórmula e sua negação é sempre F. A: pode ser V (P → Q é V em três linhas). B: tautologia. D: contingência (vale P ∨ Q). E: tautologia (Q ∨ ¬Q).

**Questão comentada 2.** (Cesgranrio · Petrobras 2011, Estratégia aula 01) "(P → Q) → (¬P ∧ Q) assume valor verdade em quantas valorações? (A) 0 (B) 1 (C) 2 (D) 3 (E) 4." **Gabarito: C.** VV: F; VF: V; FV: V; FF: F.

**Questão comentada 3.** (Cesgranrio · Petrobras 2010, Estratégia aula 00) "p → (q → r). Que valoração torna a fórmula falsa? (A) p F, q V, r F (B) p F, q F, r V (C) p V, q F, r V (D) p V, q V, r F (E) p V, q V, r V." **Gabarito: D.** F só se p = V e q → r = F (q = V, r = F). A e B: p = F. C: q = F. E: r = V.

**Para o Anki.**
- Único caso de p → q falso → p V e q F.
- Tautologia × contradição × contingência → V sempre × F sempre × depende.
- Atalhos → p ∨ ¬p tautologia; p ∧ ¬p contradição; X ↔ ¬X contradição; (p ∧ ¬p) → q tautologia.
- p → (q → r) falsa somente quando → p V, q V, r F.

### 8.9 Funções de avaliação (valoração)

**Peso.** Embutido: Petrobras 2018 Q878398 (E); Petrobras 2012 (8 linhas, B; contagem de F ao completar ¬p → q, B); Petrobras 2010 (8 linhas, D); BNDES 2011 (P, Q, R, X, Y: 32 linhas); Liquigás 2012 ((X ∧ Y) ∨ (¬X ∧ Z) satisfeita por F, F, V, E); Liquigás 2018 ("no máximo 8 de 11 se aposentarão" = "pelo menos 3 não", B).

**O que a banca cobra.**
- Valoração v: atribui V/F aos átomos e se estende de modo único: v(¬A) = V sse v(A) = F; v(A ∧ B) = V sse ambos V; v(A ∨ B) = F sse ambos F; v(A → B) = F sse A V e B F; v(A ↔ B) = V sse iguais. n átomos distintos → 2ⁿ linhas (conte proposições simples, não ocorrências nem conectivos: "o dia está bonito então vou passear se e somente se o pneu está cheio" tem três átomos, 8 linhas).
- Satisfeita (v = V), satisfatível (alguma v), válida (toda v).
- Modelo de prova: a banca dá o valor de uma composta e pede outra. Condicional F fixa (V, F); conjunção V fixa (V, V); disjunção F fixa (F, F); bicondicional V fixa igualdade. Substitua e compare; atenção se pede "mesmo valor" ou "verdadeira".

**Como ela pergunta.** Formato L4.

**Onde ela confunde.** Pedir a fórmula de MESMO valor (falso) e o candidato procurar a verdadeira; contar ocorrências; ¬p = V dá p = F.

**Macete.** Condicional falsa é ouro: antecedente V, consequente F. Substitua e compare. 2ⁿ com n = átomos distintos.

**Questão comentada 1.** (Cesgranrio · Petrobras 2018 · Q878398) "(¬p) → (¬q) é FALSO. O valor de p ∨ (¬q) é igual ao de (A) (¬q) → p (B) (¬q) → (¬p) (C) (¬p) ∨ (¬q) (D) (¬p) ∧ q (E) p ∧ q." **Gabarito: E.** p = F, q = V; p ∨ ¬q = F; procura-se a alternativa FALSA: A = V; B = V; C = V; D = V; E = F ∧ V = F.

**Questão comentada 2.** (Cesgranrio · Petrobras 2012, Estratégia aula 01) "Dada uma linguagem L com p, q e r, quantas linhas tem a tabela de [(¬p ∧ ¬q) ∨ (¬p ∧ r)] ↔ r? (A) 4 (B) 8 (C) 16 (D) 24 (E) 32." **Gabarito: B.** Três átomos distintos, 2³ = 8.

**Questão comentada 3.** (Cesgranrio · Liquigás 2012, Estratégia aula 00) "(X ∧ Y) ∨ (¬X ∧ Z) é satisfeita quando X, Y, Z valem (A) V, F, V (B) V, F, F (C) F, V, F (D) F, F, F (E) F, F, V." **Gabarito: E.** Com X = F, vale ¬X ∧ Z = Z; precisa Z = V. A e B: X = V exigiria Y = V. C e D: Z = F.

**Para o Anki.**
- Valoração → atribui V/F aos átomos e se estende pelas tabelas; n átomos distintos → 2ⁿ linhas.
- Compostas que fixam átomos → condicional F (V, F); conjunção V (V, V); disjunção F (F, F); bicondicional V (iguais).
- Q878398 → (¬p) → (¬q) falsa dá p = F, q = V; p ∨ ¬q é F; marque a de MESMO valor: p ∧ q.

### Raciocínio lógico aplicado (associação, ordenação, verdade e mentira, sequências)

**Peso.** Associação 3, verdade/mentira 2, sequências 4, orientação 3, datas 1, sudoku 1, outros 7 (21; 44,7%). Transpetro 2023: Q36 (ordenação, anulada) e Q37 (associação, E). Fora do texto literal do edital, mas cobrado.

**O que a banca cobra.**
- Associação: tabela de dupla entrada, X nas proibições, O onde sobra uma opção, fechar linhas e colunas. Q37: professor veste branco; advogado = Carlos; médico ≠ Armando e ≠ verde. Médico não é Carlos nem Armando → Beto; Armando é professor → branco; Beto não veste verde nem branco → azul; Carlos → verde.
- Ordenação: linha e setas; verifique se as pistas fixam todas as posições. Q36: N antes de P; Q antes de P; N e Q sem relação → duas ordens (N, Q, P e Q, N, P) → anulada.
- Verdade e mentira: suponha cada hipótese, propague, procure contradição; a consistente é a resposta.
- Sequências: diferenças entre vizinhos (PA), razões (PG), Fibonacci, intercaladas, saltos no alfabeto. Orientação: horário N → L → S → O; dias da semana módulo 7.

**Como ela pergunta.** Formato L10. A alternativa certa lista três fatos; as erradas erram um.

**Onde ela confunde.** Alternativa quase toda certa antes da certa (D da Q37); informação insuficiente.

**Macete.** Tabela, X, O, fechar, conferir fato por fato. Se sobrar mais de uma ordem, a questão é indeterminada.

**Questão comentada 1.** (Cesgranrio · Transpetro 2023 · questão 37) "O professor veste branco; o advogado é o Carlos; o médico não veste verde e não é o Armando. (A) Armando veste branco; Beto veste verde; Carlos veste azul. (B) Armando veste azul; Beto é o professor e veste branco; Carlos é o advogado e veste verde. (C) Armando é o advogado e veste branco; Beto é o médico e veste azul; Carlos é o professor e veste verde. (D) Armando é o professor e veste branco; Carlos é o advogado e veste azul; Beto é o médico e veste verde. (E) Armando é o professor e veste branco; Beto é o médico; Carlos veste verde." **Gabarito: E.** Armando professor/branco; Beto médico/azul; Carlos advogado/verde. A: Beto não veste verde. B: Beto não é professor. C: Armando não é advogado. D: Carlos veste verde.

**Questão comentada 2.** (Cesgranrio · Transpetro 2023 · questão 36, anulada) "N chegou antes de P; P não chegou antes de Q. Ordem: (A) N, P, Q (B) N, Q, P (C) Q, N, P (D) P, Q, N (E) P, N, Q." **Gabarito oficial: anulada.** B e C satisfazem as pistas; A, D e E violam uma. Lição: duas alternativas compatíveis = indeterminação.

**Para o Anki.**
- Associação → tabela de dupla entrada, X, O, fechar; conferir cada alternativa fato por fato.
- Ordenação → linha e setas; se sobra mais de uma ordem, indeterminada (Q36 anulada).
- Verdade e mentira → hipótese, propagação, contradição.

## 4. Pares e pegadinhas da disciplina

| O par que a banca confunde | A distinção que resolve | Fonte ou [inferido] |
|---|---|---|
| Contrapositiva × recíproca | ¬q → ¬p (equivalente) × q → p (não) | Petrobras 2018 Q878397; Eletronuclear 2022 |
| Contrapositiva × inversa | ¬q → ¬p × ¬p → ¬q (não; equivale à recíproca) | Petrobras 2018 Q878397 |
| Negação de p → q × "contrária" | p ∧ ¬q × p → ¬q (não é negação) | Liquigás 2018 (show) |
| Negação de "os dois são pares" | "Algum é ímpar"; "os dois são ímpares" é mais forte | Petrobras 2018 Q878397 |
| "Mas" × "ou" | Adversativa é conjunção | Petrobras 2010; Liquigás 2018 |
| "Nem" | "E não"; negação de "nem A nem B" é "A ou B" | AgeRIO 2023; Eletronuclear 2022 |
| "Ou" inclusivo × exclusivo | Inclusivo por padrão; só "ou ... ou" é exclusivo | Transpetro 2023 Q35; Liquigás 2018 |
| "Se A" × "A somente se B" | Antecedente × consequente | [inferido da planilha B8.01] |
| Necessária × suficiente | Em p → q, p suficiente, q necessária; "A necessária para B" = B → A | BR 2012; AgeRIO 2023 |
| Negação de "Todo A é B" × "Nenhum A é B" | "Algum A não é B"; "nenhum" é contrário | Petrobras 2012; Eletronuclear 2022 |
| Negação de "Algum A é B" | "Nenhum A é B" | BB 2010 (aula 03) |
| "Pelo menos 18" × "mais de 18" | Negação é "menos de 18" | IBGE 2014 |
| "Todo A é B" × "Todo B é A" | Conversão indevida | BR 2010; Eletronuclear 2022 |
| "Pelo menos um" × "exatamente um" | Conclusão válida usa o mais fraco | Petrobras 2012 Q486637 |
| ∀ com → × ∀ com ∧ | "Todo A é B" é ∀x (A → B) | Transpetro 2018 (aula 04) |
| ∀x∃y × ∃y∀x | "Cada um tem o seu" × "um serve para todos" | [inferido da planilha B8] |
| Modus Ponens × afirmar o consequente | Válido × falácia | [inferido do item 8.2] |
| Modus Tollens × negar o antecedente | Válido × falácia | Transpetro 2012 |
| Silogismo disjuntivo × dilema construtivo | p ∨ q, ¬p ⊢ q × p → q, r → s, p ∨ r ⊢ q ∨ s (a banca chamou de "silogismo disjuntivo") | Petrobras 2012 |
| Regra × nome que não é regra | "Paradoxo", "contingência" não são regras | Petrobras 2018 Q878400 |
| Validade × verdade | Forma × conteúdo | Petrobras 2010 |
| Conclusão forte × fraca | De ¬(c ∧ v) conclua ¬c ∨ ¬v | CEFET-RJ 2014 |
| Conclusão condicional com antecedente F | É verdadeira (dois gabaritos) | AgeRIO 2023 |
| (p ∧ ¬p) → q | Tautologia, não contradição | Transpetro 2018 |
| X ↔ ¬X × X ↔ X | Contradição × tautologia | Transpetro 2018 |
| Mesmo valor × valor verdadeiro | Q878398 pede a de MESMO valor (falso) | Petrobras 2018 Q878398 |
| Átomos distintos × ocorrências | 2ⁿ conta átomos distintos | Petrobras 2012; Petrobras 2010 |
| Equivalência × bicondicional tautológica | p ≡ q sse p ↔ q é tautologia | Petrobras 2012 |
| {¬, ∧} × {∧, ∨} | Gera todos × não gera negação | Petrobras 2011 |
| De Morgan × distributiva | ¬(q ∧ r) = ¬q ∨ ¬r × p ∧ (a ∨ b) = (p ∧ a) ∨ (p ∧ b) | Transpetro 2018 |
| Distribuir antecedente "ou" × "e" | (p ∨ q) → r vira "e"; (p ∧ q) → r vira "ou" | [inferido da planilha B8] |
| Correção × completude | ⊢ ⇒ ⊨ × ⊨ ⇒ ⊢ | [inferido, sem precedente] |
| ⊢ × ⊨ | Sintaxe × semântica | [inferido, sem precedente] |
| Decidível × semidecidível | Proposicional × primeira ordem | [inferido, sem precedente] |
| Completude × decidibilidade | Primeira ordem é completa E indecidível | [inferido, sem precedente] |
| Gödel 1930 × 1931 | Completude da primeira ordem × incompletude da aritmética | [inferido] |
| FBF × fórmula ambígua | p ∨ q → r é bem formada; p ∨ → q não | [inferido] |
| Ordenação determinada × indeterminada | Duas alternativas compatíveis = sem resposta única | Transpetro 2023 Q36 |
| Alternativa quase certa × certa | Dois fatos certos e um errado | Transpetro 2023 Q37 |

## 5. Lei seca e listas (o que precisa estar decorado literalmente)

**Tabelas (a linha que decide).** ¬ inverte · ∧ V só em VV · ∨ F só em FF · ⊻ V com diferentes · → F só em VF · ↔ V com iguais. Gatilho: "é falsa a condicional" = antecedente V, consequente F.

**Dicionário de tradução.** "e", "mas", "porém", "contudo", "embora", "nem" → ∧ · "ou", "pelo menos uma" → ∨ · "ou ... ou", "somente uma" → ⊻ · "se p, então q", "quando p, q", "sempre que p, q", "q, se p", "p somente se q", "p suficiente para q", "q necessária para p" → p → q · "se e somente se", "necessária e suficiente" → ↔ · "p, a menos que q" → ¬q → p · "todo", "qualquer", "cada" → ∀ com → · "algum", "existe", "pelo menos um", "há" → ∃ com ∧ · "nenhum A é B" → ∀x (A → ¬B).

**Equivalências obrigatórias.** p → q ≡ ¬p ∨ q ≡ ¬q → ¬p · p ∨ q ≡ ¬p → q · p ↔ q ≡ (p → q) ∧ (q → p) ≡ (p ∧ q) ∨ (¬p ∧ ¬q) · ¬¬p ≡ p · ¬(p ∧ q) ≡ ¬p ∨ ¬q · ¬(p ∨ q) ≡ ¬p ∧ ¬q · p ∧ (q ∨ r) ≡ (p ∧ q) ∨ (p ∧ r) · p ∨ (q ∧ r) ≡ (p ∨ q) ∧ (p ∨ r) · (p ∧ q) → r ≡ p → (q → r) · (p ∨ q) → r ≡ (p → r) ∧ (q → r) · (p ∧ q) → r ≡ (p → r) ∨ (q → r) · p ∨ (p ∧ q) ≡ p · p ∧ (p ∨ q) ≡ p.

**Negações obrigatórias.** ¬(p → q) ≡ p ∧ ¬q · ¬(p ∧ q) ≡ ¬p ∨ ¬q · ¬(p ∨ q) ≡ ¬p ∧ ¬q · ¬(p ↔ q) ≡ p ⊻ q · ¬∀x P ≡ ∃x ¬P · ¬∃x P ≡ ∀x ¬P. Em português: "todo A é B" → "algum A não é B"; "algum A é B" → "nenhum A é B"; "nenhum A é B" → "algum A é B"; "os dois são pares" → "pelo menos um é ímpar"; "se chove, molha" → "chove e não molha"; "pelo menos 18" → "menos de 18"; "no máximo 8 de 11" → "pelo menos 3 não".

**As três derivadas de p → q.** Recíproca q → p · inversa ¬p → ¬q · contrapositiva ¬q → ¬p (a única equivalente).

**Regras de inferência.** MP: p → q, p ⊢ q · MT: p → q, ¬q ⊢ ¬p · SH: p → q, q → r ⊢ p → r · SD: p ∨ q, ¬p ⊢ q · Dilema construtivo: p → q, r → s, p ∨ r ⊢ q ∨ s · Dilema destrutivo: p → q, r → s, ¬q ∨ ¬s ⊢ ¬p ∨ ¬r · Simplificação: p ∧ q ⊢ p · Conjunção: p, q ⊢ p ∧ q · Adição: p ⊢ p ∨ q · Absorção: p → q ⊢ p → (p ∧ q). Falácias: afirmar o consequente; negar o antecedente. Combinação favorita: MT + De Morgan.

**Métodos de validade.** Tabela (toda linha com premissas V tem conclusão V) · conclusão falsa (contradição = válido) · premissas verdadeiras (comece pela conjunção ou átomo; propague por MP, MT, SD) · transitividade.

**Classificação de fórmulas.** Tautologia (p ∨ ¬p; p → p; (p ∧ ¬p) → q; p → (q → p)) · contradição (p ∧ ¬p; X ↔ ¬X) · contingência. Equivalência = bicondicional tautológica; implicação lógica = condicional tautológica. Conectivos completos: {¬, ∧}, {¬, ∨}, {¬, →}, NAND, NOR.

**Valoração.** n átomos distintos → 2ⁿ linhas (2 → 4, 3 → 8, 4 → 16, 5 → 32). Fixam átomos: condicional F (V, F); conjunção V (V, V); disjunção F (F, F); bicondicional V (iguais) ou F (diferentes).

**Categóricas.** A "todo A é B" (A dentro de B) · E "nenhum A é B" (disjuntos) · I "algum A é B" (ponto na interseção) · O "algum A não é B" (ponto em A fora de B). Contraditórias: A × O, E × I. De "todo A é B" só segue a contrapositiva.

**Os quatro itens teóricos.** FBF: átomo; ¬A; (A ∧ B), (A ∨ B), (A → B), (A ↔ B); nada mais. Precedência ¬ > ∧ > ∨ > → > ↔. Sistemas: Hilbert, Gentzen, sequentes, tableaux, resolução. Correção ⊢ ⇒ ⊨; completude ⊨ ⇒ ⊢; consistência; teorema da dedução. Decidibilidade: sentencial decidível; primeira ordem indecidível, semidecidível, completa.

**Procedimentos aplicados.** Associação: tabela, X, O, fechar, conferir. Ordenação: linha, setas, unicidade. Verdade/mentira: hipótese, propagação, contradição. Sequências: diferenças; intercaladas; Fibonacci. Orientação: N → L → S → O; módulo 7.

## 6. Revisão de véspera (checklist)

- Condicional só é falsa em V → F; F → qualquer coisa é V. Bicondicional V com iguais; ou exclusivo V com diferentes.
- "Mas", "porém", "embora", "nem" são "e"; "nem" = "e não". "Ou" é inclusivo.
- "Se" marca o antecedente; "somente se" marca o consequente. Em p → q, p é suficiente e q é necessária.
- "p, a menos que q" = ¬q → p.
- Contrapositiva: inverta E negue. Só inverteu = recíproca; só negou = inversa; ambas erradas.
- Negação de p → q é p ∧ ¬q; nunca outra condicional.
- De Morgan: nega tudo e troca e/ou. p → q ≡ ¬p ∨ q; p ∨ q ≡ ¬p → q.
- (p ∨ q) → r vira "e" de condicionais; (p ∧ q) → r vira "ou".
- Negar "todo A é B" = "algum A não é B"; negar "algum" = "nenhum".
- Negar "os dois são pares" = "pelo menos um é ímpar". Negar "pelo menos 18" = "menos de 18".
- "Todo A é B" = ∀x (A → B); "algum A é B" = ∃x (A ∧ B); "nenhum" = ∀x (A → ¬B).
- De "todo A é B" só segue "quem não é B não é A". Diagramas: conclusão mais fraca, válida em todos os desenhos.
- ∀x∃y não é ∃y∀x. Variável nova para objeto novo; "necessário" depois da seta.
- Argumento válido: impossível premissas V e conclusão F; forma, não verdade.
- Conclusão falsa: suponha F e premissas V; contradição = válido.
- Comece pela premissa que fixa valores; propague por MP, MT, SD; bicondicional iguala.
- Consequente F derruba o antecedente; antecedente V levanta o consequente; "ou" com lado F levanta o outro.
- Conclusão garantida é a que ficou V; condicional com antecedente F também é V.
- Só ¬(c ∧ v)? Conclua ¬c ∨ ¬v.
- MP, MT, SH, SD, dilema construtivo. Falácias: afirmar o consequente; negar o antecedente.
- "Paradoxo", "contingência" não são regras. Padrão Petrobras 2018: MT + De Morgan = A ∨ G.
- Para inferir ¬p de p → q, assuma ¬q.
- Tautologia: p ∨ ¬p; (p ∧ ¬p) → q. Contradição: p ∧ ¬p; X ↔ ¬X. Contingência: depende.
- "Ou" com termo V é V; "e" com termo F é F; "se" com antecedente F é V.
- Precedência ¬, ∧, ∨, →, ↔; p ∨ q → r é (p ∨ q) → r.
- 2ⁿ linhas com n átomos distintos; conte átomos, não ocorrências.
- Condicional falsa entrega os dois átomos; conjunção V e disjunção F também.
- Q878398: (¬p) → (¬q) falsa dá p = F, q = V; p ∨ ¬q é F; marque a de MESMO valor (p ∧ q).
- Equivalência = bicondicional tautológica. {¬, ∧} gera todos os conectivos.
- p ∧ ¬(q ∧ r) = (p ∧ ¬q) ∨ (p ∧ ¬r): De Morgan, depois distributiva.
- FBF: átomo; ¬A; binários com parênteses; nada mais. Conte parênteses.
- Correção: não prova besteira (⊢ ⇒ ⊨). Completude: toda verdade tem prova (⊨ ⇒ ⊢). ⊢ sintaxe; ⊨ semântica.
- Hilbert, Gentzen, sequentes, tableaux, resolução (Prolog).
- Sentencial decidível (tabela termina). Primeira ordem indecidível, semidecidível, completa. Completude ≠ decidibilidade.
- Associação: tabela, X, O, fechar; confira os três fatos (a quase certa vem antes).
- Ordenação: linha e setas; duas ordens = indeterminada (Q36 anulada).
- Verdade e mentira: hipótese, propagação, contradição.
- Sequências: diferenças; intercaladas; Fibonacci. Orientação: N → L → S → O; módulo 7.

## 7. Fontes usadas

- `txt/prova2023.txt`: Transpetro 2023, Prova 6, questões 28, 35, 36 (anulada) e 37 com resolução e gabarito definitivo; distribuição por bloco.
- `txt/indice_08.txt`: contagens do caderno de Raciocínio Lógico (47 questões); o caderno em texto não está no acervo.
- `fontes/planilha_logica.txt`: Padrão da Banca B8.01 a B8.09, Pares e Pegadinhas, Lei Seca, Questões-Chave (Petrobras 2018 Q878397, Q878398, Q878400; Petrobras 2012 Q486637), Resumos.
- `Conteudo_Programatico_Comentado_Transpetro2026.md`, linhas 780 a 843 e 174 a 186.
- `txt/dossie.txt` seção 2.7; `txt/relatorio_docx.txt` seção 3.8.
- Estratégia Concursos, Lógica Matemática para Transpetro 2026 (Ênfase 5), aulas 00 a 05, extraídas para `txt/estrategia_logica_00.txt` a `_05.txt`: questões Cesgranrio comentadas, citadas por concurso e ano (Transpetro 2018, 2012, 2011; Petrobras 2018, 2012, 2011, 2010; AgeRIO 2023; Eletronuclear 2022; Liquigás 2018, 2012; BR 2012, 2010; IBGE 2014; CEFET-RJ 2014; BNDES 2011). Aulas 06 e 07 (falácias informais, raciocínio crítico) não têm questões Cesgranrio.
- GranCursos, Lógica Matemática (resumos 001 a 039) e Mapas da Lulu 1.1 a 1.4: apoio de teoria para a seção 5.
- WebSearch: tentativa de localizar o texto integral da Q878400 e os IDs das questões Transpetro 2018; sem resultado com gabarito confiável, por isso essas questões são citadas por concurso e ano e a Q878400 pelo registro da planilha.
