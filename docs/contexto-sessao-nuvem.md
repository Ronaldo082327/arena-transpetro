# Contexto da sessão na nuvem (Estúdio / site) para a sessão local

Atualizado em 21/11/2026 (à tarde), depois da Onda 1 da visão 360. Regra combinada com o Ronaldo: **merge de mão dupla**. Cada sessão entrega à outra o que fez e o que sabe; nenhuma integra só de um lado.

## O que existe no site (repositório arena-transpetro, branch main, GitHub Pages)
- **Estúdio** (`estudio.html`): hub da Dora Guilda. Telas próprias desta sessão:
  - `#config` Meu concurso (edital → matérias e tópicos; relevância 1–5 pela IA do aluno; peso e questões).
  - `#erros` Caderno de Erros da Guilda (tipos teoria/pegadinha/leitura/chute; causa, regra e cartas por IA; revisão 1-3-7-15-30; import/export `dora-guilda-erros` v1 com o mapeamento de tipos do Draw).
  - `#fc` Dora Memória (cartas do caderno de erros e das fichas entram nas caixas 1-3-7-14-30; erro em carta volta ao caderno como reincidência).
  - `#mira` Mira da Guilda (soma erros do caderno por tópico; na cópia pública usa peso × relevância × erros).
  - `#mt` Dora Examinadora (no app principal: dossiê da Transpetro; na cópia pública: ficha gerada pela IA por tópico, `arenaTP.fichas`).
  - `#mapaia` Mapas da Dora (árvore JSON da IA → SVG no tema; baixar SVG; virar cartas; "usar minha estante"; mostra `fontes`).
  - `#estante` Estante inteligente (envio binário ao porteiro, preparando…, apagar, apagar tudo, aviso LGPD antes do 1º envio).
  - `#gem` IA: no app principal, chave própria Gemini/Claude com escada; na cópia pública, **só o código de acesso** (sem escolha de modelo).
- **Draw** (`draw/`): edição geral 1.2.0 (pacote da sessão local) + `draw/ponte.js` (tema e atalho; no cache do `draw/sw.js`).
- **Identidade**: girassol de Fibonacci (55 sementes), kit premium (símbolo com tokens, ícones escuros, favicon, apple-touch, abertura `identidade/abertura-logo.svg` no 1º acesso, vídeo do Flow em `identidade/video/`). Ícones de interface, molduras, selos, capas, estados vazios e mascotes da proposta B. Girassol gira no menu (48 s) e no carregando (4,5 s); respeita movimento reduzido.
- **Versão pública**: `python3 publico/construir.py [saída]` gera cópia sem conteúdo da Transpetro e sem chaves; `PORTEIRO_URL=https://... ` embute o endereço do porteiro. Catálogo público: Meu concurso, Missão do Dia, Mira, Dora Examinadora, Mapas da Dora, Estante, Dora Memória, Caderno de Erros, Dora Mentora, Dora Draw, Identidade.

## Contratos com o porteiro que o Estúdio usa
- `POST /ia {codigo, prompt, json, estante?}` → `{texto, modelo, prov, restanteHoje, fontes?, semEstante?}`; erro `{erro:true, msg, volta?}`. O app avisa com `restanteHoje ≤ 3`.
- `POST /conta {codigo}` → `{nome, ativo, gemini:{usado,limite}, claude}` (botão Testar código).
- Estante: `/estante/enviar` (corpo binário, `x-codigo`, `x-nome`, `content-type`), `/estante/listar`, `/estante/apagar`, `/estante/apagar-tudo`; trata 503 {tenteEm}, 409 {tenteEm}, 413 {maximoMB}, `pronto`.

## Decisões do Ronaldo registradas aqui
- Aluno não escolhe modelo; Gemini sempre primeiro (orquestração alta; Neon pesado, Hydrogen leve), Claude Opus 5.5 médio só sem cota do Gemini; volta ao Gemini quando a cota renova.
- Nada de NotebookLM por trás (sem API pública; risco à conta; LGPD) → Estante com File Search do Gemini.
- 12 alunos previstos; teto Claude US$ 150 no porteiro + US$ 200 no console da Anthropic.
- Nome "Dora Examinadora". Ícone principal do app: girassol escuro.

## Novidades do Estúdio nesta rodada (branch claude/rede-da-dora, PR #29)
- **Plano geral:** `docs/visao-360.md` (análise 360 feita com o Fable): grafo do concurso, 33 ideias, cinco destinos de navegação (Hoje, Edital, Treinar, Biblioteca, Eu) e plano em ondas. A **Onda 2 é da sessão local**:
  - Dora Escudeira (modo assistido do Tec completo);
  - Ampulheta, Legenda Viva e Carimbos no leitor;
  - `?embed=1` no Draw;
  - rotas de agenda e push no porteiro.
- **Rede da Dora** (`rag.js`): BM25 local sobre tudo, inclusive o IndexedDB do Draw (só leitura, só se o banco existir).
  - `aicall(..., {rag})` cola os trechos antes do pedido e cita [F1].
  - Tela `#pergunte`.
  - `DoraRAG.sugerirTopico(texto, lista)` é a Tecelã.
- **Diário de evidências** (`grafo.js`, `arenaTP.eventos`): `{t (s), k:'resp'|'rev'|'ses'|'erro', top, d, ok, c:1|2|3, m, qn, qok, n, f, r}`.
  - Proposta: a extensão e o Draw exportam no mesmo formato como **`dora-guilda-evidencias` v1**: `{formato:'dora-guilda-evidencias', versao:1, eventos:[...]}`. O Estúdio passa a aceitar a importação assim que a sessão local confirmar.
- **Telas novas:**
  - `#hoje` (rota padrão): blocos nos horários livres, Selo da Sessão, Carta da Manhã, Guarda do Corte, Fila da Memória.
  - `#agenda` (Agenda Viva): importa .ics, guarda só `{ini, fim, tipo}`, exporta o plano em .ics com alarme. Motor em `rotina.js`.
  - `#relatorio` (Vitral em SVG/PNG).
  - `#voo` (Cartão de Voo e Rito da Véspera, com .ics da prova).
  - `#topico/<d>/<t>` (Sala do Tópico: grifos do Draw agrupados pela cor, legenda amarelo/verde/azul/rosa = conceito/lei seca/exemplo/pegadinha).
  - `#bolso` (Rádio de Bolso).
- **Horizonte da Prova:** os intervalos de revisão do Estúdio ficam limitados à metade dos dias até a prova. Sugestão para o FSRS do Draw: o mesmo teto.

## Rodada seguinte (21/11, tarde)
- **Assistente `#comecar` e Motor de Pesos (`motor.js`, sem IA):** o edital em PDF vira matérias, tópicos, quadro de provas e pesos. Detalhes no `AGENTS.md`.
- **Perfis de bancas:** `bancas/perfis.json` (8 bancas).
- **Exemplos públicos:** Bacen TI, Receita Auditor e SEFAZ-ES, em `exemplos/`.
- **Disponibilidade por dia da semana:** `arenaTP.agenda.disp = {0..6: [{de, ate}]}`.
- **Sugestão para o Draw:** o "edital por PDF" do Draw pode usar o mesmo `motor.js` (código próprio, sem dependências).
- **ANPD:** ainda não tem edital (previsto para dezembro de 2026, banca a confirmar).
- **TCU:** o edital não estava acessível nesta rede.

## Pedidos desta sessão à sessão local (Onda 2)
1. **Legenda Viva no leitor:** gravar `grifos.significado` (conceito, lei, exemplo, pegadinha) junto da cor. A Sala do Tópico já lê a cor como significado. Se a paleta mudar, avise.
2. **Escudeira no Tec:** confiança antes do resultado, dificuldade, motivo, print e tópico. Exportar as respostas como `dora-guilda-evidencias` v1, ou gravar via content script no domínio do site.
3. **`?embed=1` no Draw:** esconde o menu quando aberto na segunda tela do Estúdio. O `ponte.js` pode fazer isso se preferir; diga.
4. **Porteiro:**
   - `POST /agenda/ics {codigo, url}`: proxy do link iCal privado (só https, hosts do Google, Outlook e iCloud, até 1 MB, sem registrar conteúdo).
   - Depois, push "campainha" (VAPID e cron, sem conteúdo).
   - E-mail opt-in só na Onda 3 (desenho em `docs/visao-360.md` 3.2).

## Pendências (dependem do Ronaldo)
Publicar o porteiro no Cloudflare (chaves só no terminal), criar os 12 códigos, gerar a cópia pública com `PORTEIRO_URL`, conferir no celular, testar a voz humana.

## O que esta sessão pediu de volta à sessão local
Um documento equivalente (ou as seções novas do NOTAS-DEV.md) com: estado atual do Draw, extensão e Windows; versão do worker e do schema D1; o que está publicado e onde; decisões do Ronaldo que esta sessão ainda não conhece; testes que falham ou faltam.
