# Dora Mesa de Estudo: PDF, Pena, relógio, áudio e modo assistido do Tec

Proposta da sessão nuvem (21/11/2026) para a sessão local, dona do código do Dora Draw (`extensao/` → `web/` → `draw/` no site). Não editar `draw/` à mão; implementar na fonte e recopiar.

**Regras:**
- O GoodNotes e o UPDF foram estudados só por descrição pública (sites, App Store, blogs, reviews). Nada de engenharia reversa. Aqui entram ideias gerais, e o código é nosso.
- A Bússola Draw segue a mesma regra.
- Tec Concursos: só a questão que o aluno está resolvendo, na sessão dele, para uso pessoal. Nada de coleta em massa.

## 1. O que o Draw 1.2.0 já tem

| Recurso | GoodNotes | UPDF | Dora Draw 1.2.0 |
|---|---|---|---|
| Caneta, marca-texto, borracha | sim | parcial | sim (Dora Pena) |
| Laço, formas que se endireitam | sim | formas | sim |
| Fita para tapar alternativas, laser, calculadora | fita | não | sim |
| Grifo de texto do PDF com cor e nota | marca-texto | sim | sim (`grifos`) |
| Áudio sincronizado com o traço | sim | não | sim (`penas.audios`) |
| Cronômetro, temporizador, Pomodoro | não | não | sim (Pena) |
| Busca no texto do PDF | sim | sim | sim (Estante) |
| Chat com o PDF citando a página | sim | sim | RAG local do Dora Estúdio |
| Cartões com repetição espaçada | Study Sets | não | Dora Cartas (FSRS) |
| Mapa mental | não | sim | sim (por tópico) |
| Resumo das anotações em lista | **não** | **não** | Transformar marcações (manual) |
| Modo assistido em site de questões | não | não | sim (alternativa, motivo, "Errei esta") |

**Faltam:**
- sublinhado, tachado e ondulado no texto do PDF;
- notas adesivas, carimbos e régua;
- marcadores, sumário e outline do PDF;
- busca no que foi escrito à mão;
- OCR de apostila escaneada;
- exportar o PDF anotado;
- resumo automático, mapa de calor das páginas e ritmo de leitura;
- no modo assistido: dificuldade, tópico, print e questão também no acerto.

## 2. Ideias, por bloco

### A. Legenda viva: a cor decide para onde vai
Cada caneta e marca-texto tem um significado, e o significado tem um destino automático. Usa e estende `doraDraw.marcSignificados`.

| Cor (padrão, editável) | Significado | Destino automático |
|---|---|---|
| Amarelo | Conceito-chave | **Resumo do tópico**, em ordem de página |
| Verde | Lei seca / artigo / definição | Resumo + Dora Carta de lacuna |
| Vermelho | Pegadinha / exceção | "Como a banca cobra" + carta |
| Azul | Exemplo / jurisprudência | Resumo (bloco "Exemplos") |
| Roxo | Decorar (prazo, número, lista) | Dora Carta básica |
| Laranja | Dúvida | Fila "Perguntar à Dora" no Estúdio |

- **Interruptor por PDF:** "Mandar meus grifos para o Resumo automaticamente" (ligado por padrão). Desligado, os grifos se comportam como hoje.
- **Pasta de resumos do tópico:** cada item guarda `{materialId, pagina, cor, texto, nota, criado}` e um link "abrir na página". Não é texto solto em `notaHtml`.
- **Escrita à mão:** quando o laço fecha um trecho manuscrito, o trecho vira um recorte (imagem) no resumo. O botão "Ler minha letra" pede transcrição à IA (porteiro ou chave do aluno) e grava o texto ao lado, o que deixa o manuscrito buscável.
- **Sem duplicatas:** chave = material + página + texto normalizado.
- O resumo se atualiza ao apagar o grifo: o item some, mas não apaga uma carta já estudada.

### B. Carimbos de concurso, notas adesivas e régua
- **Carimbos com um toque:** "Cai muito", "Pegadinha", "Lei seca", "Revisar", "Decorar", "Errei aqui" e "Cesgranrio adora". Cada carimbo é uma etiqueta da página e vai para o filtro da Estante ("me mostre todas as páginas Pegadinha").
- **Nota adesiva:** dobrável na margem, entra no Resumo.
- **Régua e linha reta:** segurar Shift ou o dedo parado ao fim do traço.
- **Sublinhado, tachado e ondulado** como tipos de grifo de texto (`grifos.estilo`).

### C. Navegar no PDF grande
- Lê o sumário embutido do PDF (pdf.js `getOutline`) e permite criar marcadores próprios.
- Painel lateral com **miniaturas que mostram onde há grifos e carimbos**.
- Busca unificada: texto do PDF, notas, texto transcrito do manuscrito e carimbos.
- OCR para apostila escaneada: pela IA, página a página, sob demanda e com aviso de cota. Nada roda em lote sem o aluno pedir.

### D. Relógio de estudo que entende o PDF
- O Pomodoro (25/5, 50/10 ou livre) já existe. O que falta é **ligar cada sessão ao material, à página e ao tópico** (`sessoes` com `materialId`, `pagIni` e `pagFim`).
- **Ritmo de leitura:** páginas por hora deste PDF. Daí sai a **projeção**: "faltam 212 páginas ≈ 9 h; no seu ritmo de 1 h/dia termina em 30/11, antes da prova (06/12)".
- **Mapa de calor das páginas:** onde você passou mais tempo, grifou mais e errou mais questões do tópico.
- Fim do Pomodoro com uma pergunta, que é **recordação ativa**: "Em uma frase, o que esta página dizia?". A resposta vai para o Resumo, e a IA confere se o aluno pedir.

### E. Áudio que vira estudo
- Já existe: tocar no traço toca o trecho.
- **Marcadores de tempo** no áudio ("aqui o professor falou da exceção").
- **Transcrever** (opcional, pela IA): o texto vai para o Resumo, com o tempo ao lado, e entra na busca.
- **Replay da aula:** os traços aparecem na ordem em que foram feitos, junto com o áudio.

### F. Revisar o próprio PDF
- **"Teste esta página":** gera de 3 a 5 questões no estilo Cesgranrio (A–E) a partir dos grifos da página, e o acerto vai para as estatísticas.
- **Revisão por cor:** "só meus vermelhos (pegadinhas) deste PDF", em modo cartas.
- **Exportar PDF anotado** (pdf-lib, local) e **exportar o Resumo** em PDF ou Markdown.

### G. Modo assistido no Tec, completo
Fluxo em um único pop-up, logo abaixo da questão:
1. **Alternativa:** A–E (ou Certo/Errado conforme a questão). O aluno marca no pop-up e a extensão clica a mesma alternativa no site. O resultado do site (certo ou errado e o gabarito) é lido da página **depois** que o próprio site mostra.
2. **Confiança:** certeza, dúvida ou chute. Acerto com dúvida ou chute conta como **acerto frágil** e entra na revisão.
3. **Dificuldade:** fácil, média ou difícil.
4. **Por que errei** (só aparece no erro, um toque), mapeado para `L.TIPOS_ERRO` mais os novos:
   - Não sabia o conteúdo → `conteudo`
   - Caí na pegadinha / não reconheci → `reconhecer`
   - Errei a conta ou o passo → `execucao`
   - Li errado / desatenção → `leitura`
   - Faltou tempo → `leitura` (nota "tempo")
   - Confundi dois conceitos → `reconhecer` (nota "confusão")
   - Esqueci a lei, o número ou o prazo → `conteudo` (nota "memória")
   - Chutei → `chute`
5. **Automático, sem clicar em nada:**
   - tempo gasto na questão;
   - print da questão (`captureVisibleTab` recortado no bloco da questão);
   - id ou URL da questão, para não duplicar;
   - disciplina e assunto que o Tec mostra, para a **sugestão de tópico** do edital (semelhança de título; o aluno só confirma).
6. **Grava sempre**, acerto ou erro: a questão (enunciado, alternativas, gabarito, print) vai para o banco de questões. A resposta vai para `respostas` com `topicoId`, confiança, dificuldade e motivo. O erro vai também para o Diário com o motivo.
7. **Painel do dia**, num canto da página e na tela Hoje:
   - resolvidas, acertos e erros, com taxa;
   - meta do dia;
   - erros por motivo e por tópico;
   - sequência de acertos;
   - "você costuma errar por leitura depois de 40 min: faça uma pausa".

**Compatibilidade:**
- `respostas` e `erros` ganham só campos novos e opcionais (`dificuldade`, `confianca`, `motivoNota`, `printId`, `questaoId`).
- O formato `dora-guilda-erros` v1 continua igual. Se a sessão local quiser levar `dificuldade` e `motivoNota` para o Caderno de Erros do Estúdio, propõe-se `v1` com campos opcionais (o Estúdio ignora o que não conhece), avisando a sessão nuvem.

## 3. Ordem sugerida (cada passo é entregável sozinho)
1. **Modo assistido completo (G):** é o que mais muda o dia a dia de questões.
2. **Legenda viva + Pasta de resumos (A)**, com carimbos e estilos de grifo (B).
3. **Relógio ligado ao PDF (D):** ritmo, projeção, mapa de calor, pergunta ao fim do Pomodoro.
4. **Navegação (C), áudio (E) e revisão (F)**, com exportação.

**Testes em cada passo:**
- `node --test testes/` com as funções puras novas: destino por cor, dedup, ritmo e projeção, mapeamento de motivo;
- Edge na extensão;
- no Chrome real: o adaptador do Tec, captureVisibleTab e a leitura do resultado.

**Limites honestos:**
- A leitura do resultado no Tec depende do HTML do site, que pode mudar. O adaptador precisa falhar com segurança: se não ler, pergunta ao aluno "acertou?".
- A transcrição e o OCR gastam cota de IA e são sempre sob demanda.
