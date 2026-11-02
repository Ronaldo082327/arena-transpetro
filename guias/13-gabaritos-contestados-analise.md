# Gabaritos contestados: Banco de Dados (ER e modelo relacional)

Fonte: TecConcursos (enunciados, figuras e comentários dos professores lidos em 02/11/2026). As figuras foram vistas diretamente.

## Resumo

| id | banca/prova | oficial | resposta recomendada | confiança |
|---|---|---|---|---|
| 1757828 | BB 2021 (especialização no relacional) | B | B | alta |
| 2671161 | Liquigás 2015 (atributos obrigatórios) | E (9) | E (9) | alta |
| 2671171 | Liquigás 2015 (conjuntos e cardinalidades) | C | C | alta |
| 3038281 | CNU 2024 SPF (conjuntos e especialização) | C | C | alta |
| 638908 | Transpetro 2018 (esquema relacional) | A | A | alta |

Regra geral: o professor que pede anulação costuma exigir mais do que a banca pergunta, ou errou a conta. Nas cinco questões, a alternativa oficial é a única que não viola nenhuma regra do diagrama.

Convenção de cardinalidade da Cesgranrio (Heuser): o par (mín,máx) escrito ao lado de uma entidade diz com quantas ocorrências dessa entidade UMA ocorrência da outra entidade se relaciona. Os gabaritos de 1757828, 2671171 e 638908 só fecham com essa leitura, e os três fecham juntos. Isso é boa evidência de que é a convenção da banca.

---

## 1) Questão 1757828 (BB 2021, Agente de Tecnologia)

1. Figura. XB (id x1, atributo x2) liga-se pelo relacionamento S (atributo s1) a TA (id t1, atributo t2). Cardinalidade (0,n) ao lado de XB e (0,1) ao lado de TA. TA tem especialização "exclusiva e total" em TB (t3, t4) e TC (t5).
2. Alternativas.
   - A: junta tudo em TA (t3, t4, t5 sem colchetes) e põe t1 e s1 em XB sem colchetes. Erra a especialização exclusiva e total e erra a nulidade.
   - B: XB, TA(t1,t2,tipo), TB e TC com PK t1 referenciando TA, e tabela S(x1,t1,s1) com PK só x1. Correta: especialização por tabelas separadas, e a PK x1 garante no máximo um TA por XB.
   - C: TA única com t3, t4, t5 anuláveis (não impõe exclusiva e total) e S com PK composta (x1,t1), que permite N:M. Erra.
   - D: igual a C, mas S sem nenhuma PK sublinhada. Erra.
   - E: especialização correta (igual à B), mas t1 e s1 dentro de XB sem colchetes. Como o mínimo é 0, deveriam estar entre colchetes. A notação de colchetes está no enunciado justamente para testar isso.
3. Oficial: B.
4. Professor (Felipe Barreto): admite que B é "exatamente o que o diagrama pede", mas diz que E também está certa (adição de colunas é a forma preferida de Heuser para 1:N). Propõe anulação ou E. Alunos: um pergunta por que t1 não está sublinhado em S (resposta: a PK é só x1); outro explica que, por causa de s1 e da normalização, tabela própria para S é boa opção.
5. Conclusão: marcar B. Confiança alta. O argumento do professor sobre E ignora que t1 e s1 não admitiriam nulo em E, o que contradiz o mínimo 0. Se alguém ler a cardinalidade pela outra convenção (participação), todas as alternativas ficam erradas e a anulação seria possível, mas B continuaria sendo o gabarito mantido.
6. Lição. Em mapeamento ER para relacional, confira três coisas em cada alternativa: (a) a chave primária da tabela do relacionamento (quem aparece sozinho na PK é o lado "no máximo um"); (b) se colunas que vêm de mínimo 0 estão entre colchetes ou sem NOT NULL; (c) se a especialização total e exclusiva foi preservada (tabelas separadas com PK = FK, ou tabela única com tipo e restrições). Alternativa "quase certa" que esquece o nulo é a armadilha clássica.

---

## 2) Questão 2671161 (Liquigás 2015, Tecnologia da Informação)

1. Figura. C (c1 identificador, c2 (0,n), c3 (1,n)), D (d1 identificador, d2 (1,n), d3), E (e1 identificador, e2 (0,n), e3). Relacionamento R entre C (1,1) e D (0,n). Relacionamento S entre D (0,n) e E (0,n), com atributos s1 (1,n) e s2. Opções: 2, 3, 5, 6, 9.
2. Contagem. Total de atributos: 3+3+3+2 = 11. Cardinalidade omitida significa (1,1), ou seja, obrigatório e monovalorado. Os únicos explicitamente não obrigatórios são c2 (0,n) e e2 (0,n). Logo 11 - 2 = 9 obrigatórios. O 6 é o resultado de quem trata atributo sem cardinalidade como opcional.
3. Oficial: E (9).
4. Professor (Heitor Pasti): conta só identificadores e atributos com mínimo 1 escrito (c1, c3, d1, d2, e1, s1 = 6) e propõe anulação porque 6 não é o gabarito. Um aluno cita o curso do Prof. Thiago Cavalcanti: sem anotação, o atributo é obrigatório e monovalorado, e contam-se todos menos os (0,1) e (0,n). Esse aluno está certo.
5. Conclusão: marcar E (9). Confiança alta. A regra de omissão (1,1) é de Heuser, base da Cesgranrio. O professor aplicou uma regra que não existe: "sem anotação = opcional".
6. Lição. Em figura ER da Cesgranrio, "sem par entre parênteses" não quer dizer "sem informação". Quer dizer (1,1). Conte por exclusão: total menos os que mostram mínimo 0.

---

## 3) Questão 2671171 (Liquigás 2015, Tecnologia da Informação)

1. Figura. Cada alternativa é um diagrama com G ligado a J por S e J ligado a I por R, só mudando as cardinalidades. Estado do banco: G={G1..G4}, J={J1,J2}, I={I1..I4}, R={(J1,I1),(J1,I2),(J2,I3)}, S={(G1,J1),(G2,J1),(G3,J2),(G4,J2)}. Alternativas (cardinalidade ao lado de cada entidade):
   - A: S: G(0,n) J(1,n); R: J(0,1) I(0,1).
   - B: S: G(0,1) J(1,n); R: J(0,n) I(0,n).
   - C: S: G(0,n) J(0,1); R: J(0,1) I(1,n).
   - D: S: G(0,n) J(0,1); R: J(1,1) I(1,n).
   - E: S: G(0,n) J(0,n); R: J(1,n) I(0,n).
2. Análise (convenção Heuser). Fatos do estado: cada J tem 2 G; cada G tem exatamente 1 J; cada J tem 1 ou 2 I; cada I tem 0 ou 1 J (I4 não tem J).
   - A: em R, "I (0,1)" limita cada J a no máximo um I, mas J1 tem dois. Viola.
   - B: em S, "G (0,1)" limita cada J a no máximo um G, mas J1 tem dois. Viola.
   - C: S: um J com muitos G (ok), um G com 0 ou 1 J (ok, tem 1). R: um I com 0 ou 1 J (ok, I4 tem 0), um J com 1 ou mais I (ok). Nenhuma violação.
   - D: "J (1,1)" em R exige que todo I tenha um J, mas I4 não tem. Viola.
   - E: "J (1,n)" em R exige o mesmo. I4 viola.
   Só C resiste.
3. Oficial: C.
4. Professor (Heitor Pasti): diz que entre G e J a relação seria N:M, que então "não pode ser 0:n", e que todas as alternativas trazem um 0, logo não há gabarito. Não há comentários de alunos. O erro: a pergunta é "regras que não são violadas". Mínimo 0 nunca é violado por dados que participam; apenas deixa de exigir. E o dado mostra que cada G tem um único J, ou seja, 1:N, não N:M.
5. Conclusão: marcar C. Confiança alta. É a única sem violação, e o raciocínio depende só de testar cada regra contra os pares dados.
6. Lição. Em "qual diagrama não é violado pelo banco", teste cada cardinalidade contra os dados: só há violação quando o dado sai do intervalo. Mínimo 0 e máximo n são permissivos. Elimine primeiro as alternativas com máximo 1 onde o dado tem 2 e as com mínimo 1 onde existe elemento sem par.

---

## 4) Questão 3038281 (CNU 2024, SPF, Bloco 2)

1. Figura. Cinco diagramas de generalização/especialização com A, B, C, D, E:
   - A: A gera B e C (total e compartilhada); B gera D e E (parcial e exclusiva).
   - B: A gera D e C (parcial e compartilhada), com B subtipo de E e de D (parcial e exclusiva cada). Hierarquia estranha.
   - C: A gera B e C (parcial e compartilhada); B gera D e E (parcial e exclusiva).
   - D: A gera B, C, D, E (total e compartilhada).
   - E: A gera B, C, D, E (parcial e exclusiva).
2. Análise dos conjuntos. B∪C = x1..x10, e x11, x12 só estão em A, então A para {B,C} é parcial. B∩C = {x8}, então compartilhada. D e E estão dentro de B e D∩E é vazio, então exclusiva.
   - A: diz total entre A e {B,C}. Viola (x11, x12).
   - B: faz B subtipo de E e de D, mas B não está contido em D nem em E. Viola.
   - C: parcial e compartilhada em A; parcial e exclusiva em B. Nenhuma regra violada.
   - D: total (viola) e hierarquia achatada, ignorando que D e E estão dentro de B.
   - E: exclusiva entre B e C, mas x8 está nos dois. Viola.
3. Oficial: C.
4. Professor (Ivan Baierle): concorda que C é a melhor, mas diz que no dado D∪E = B, logo o correto seria "total" entre B e {D,E}, e a alternativa C diz "parcial". Conclui que não há alternativa correta e pede anulação. Alunos: um explica que parcial não exige que sobrem elementos em B, só deixa de exigir, então dado "total por acaso" é compatível com restrição parcial; outro cita o gabarito extraoficial do Estratégia, que mantém C.
5. Conclusão: marcar C. Confiança alta. A pergunta é "compatível", não "descreve exatamente". Parcial é a restrição mais fraca; total é uma regra a mais. Nenhuma outra alternativa é compatível, e a "total em B" que o professor queria nem está entre as opções.
6. Lição. "Compatível" é diferente de "equivalente". Procure primeiro as violações duras: total onde sobra elemento, exclusiva onde há interseção, subtipo que não está contido no supertipo. Parcial nunca é violada por dados; total pode ser.

---

## 5) Questão 638908 (Transpetro 2018, Análise de Sistemas/Processos de Negócios)

1. Figura. A (identificadores a1 e a2, atributo a3) liga-se por RA a B (identificador b1, atributo b2): (0,n) ao lado de A e (0,1) ao lado de B. B liga-se por RB a C (c1 identificador, c2, c3): (0,1) dos dois lados.
2. Leitura. RA: cada A tem no máximo um B (FK do lado A, anulável, sem UNIQUE); cada B pode ter vários A. RB: 1:1 com participação opcional dos dois lados, ou seja, FK com UNIQUE e sem NOT NULL, ou tabela própria com PK em um lado e UNIQUE no outro.
   - A: B1 anulável em A com FK (certo para RA). RB como tabela: PK C1, B1 NOT NULL UNIQUE (certo para 1:1 opcional). Correta.
   - B: coloca a FK (A1,A2) em B, invertendo o lado N. Erra.
   - C: RA com PK composta (A1,A2,B1) permite que um A se ligue a vários B. Erra o máximo 1.
   - D: RA com PK só B1 impede que um B tenha vários A. Erra o máximo n.
   - E: B1 em A e C1 em B com NOT NULL, impondo participação obrigatória. Erra o mínimo 0.
3. Oficial: A.
4. Professor (Ivan Baierle): abre dizendo que A é a correta mas que "possui mais de um gabarito", e pede anulação. No próprio desenvolvimento, porém, mostra que B, C, D e E estão erradas, cada uma por um motivo concreto, e não indica qual outra seria também certa. A conclusão não é sustentada pelo próprio texto. Aluno do QC chega à mesma análise (A é a certa).
5. Conclusão: marcar A. Confiança alta. É prova da própria Transpetro (mesmo cargo e área do candidato), então o estilo tende a se repetir em 2026.
6. Lição. Para cada alternativa SQL, faça o checklist: (a) a FK está na tabela do lado "no máximo um"? (b) há NOT NULL onde o mínimo é 0? (c) há UNIQUE onde o máximo é 1 dos dois lados? (d) a PK da tabela de relacionamento impede o que o diagrama permite, ou permite o que o diagrama proíbe?

---

## Lições transversais

- Marque a alternativa oficial nas cinco. Em todas, o pedido de anulação vem de leitura mais exigente que a da banca, ou de erro de conta (2671161).
- Cardinalidade (mín,máx) ao lado da entidade, padrão Heuser: quantas dessa entidade por uma da outra. Ao ver "1:N", localize o lado com máximo 1 e ponha a FK nele.
- Atributo sem anotação = (1,1) = obrigatório.
- Mínimo 0 não é violado por dado nenhum. Mínimo 1 é violado por qualquer elemento sem par.
- Parcial é permissiva; total e exclusiva são as que se violam.
- Em SQL: NOT NULL = mínimo 1; UNIQUE = máximo 1; PK composta na tabela de relacionamento = N:M liberado.
