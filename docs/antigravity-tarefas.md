# Tarefas prontas para o Antigravity (Gemini)

Estas tarefas rodam no computador do Ronaldo, com a conta Google dele. A sessão do Claude na nuvem não alcança o computador nem o Antigravity. Cada tarefa traz o pedido pronto para colar e o que conferir antes de aceitar.

**Antes de qualquer tarefa:**
1. Abra a pasta do repositório `arena-transpetro` no Antigravity.
2. Faça `git pull` para ficar com o `main` atualizado.
3. Peça ao agente que leia o `AGENTS.md` antes de começar.
4. Trabalhe num branch novo (`git checkout -b antigravity/<tarefa>`) e abra um PR. Não envie direto para o `main`.

Regra de ouro: **tudo é para a prova da Transpetro (Cesgranrio, 06/12/2026)**. Conteúdo técnico só dos `guias/`, dos `questoes.json`/`inteligencia/` e dos baralhos. Nada inventado.

---

## 1. Visual 3D com vários temas (quando houver a imagem de referência)

**Pedido para colar:**
> Leia o AGENTS.md. Vou anexar uma imagem de referência de visual com profundidade e efeito 3D. Aplique esse estilo em `estudio.html`, `expedicao.html` e `jogo.html` usando só CSS (sem build, sem bibliotecas novas): sombras em camadas, relevo, bordas com brilho, cartões que se elevam ao passar o mouse e leve perspectiva nos cartões principais. Crie um seletor de tema salvo em `localStorage` (chave `arenaTP.tema`) com: Laranja suave (atual), Claro, Escuro suave, Oceano (azul-petróleo), Grafite, Areia, Floresta e Alto contraste. Defina cada tema como variáveis CSS em `:root[data-theme="..."]`. Respeite `prefers-reduced-motion`. Teste em 390px e 1280px, sem rolagem horizontal. Atualize a versão do cache em `sw.js`.

**Conferir:** contraste de texto legível em todos os temas, a navegação por teclado continua funcionando, e as videoaulas continuam cabendo na tela.

## 2. Imagens ilustradas para os cartões do Anki

**Pedido para colar:**
> Leia o AGENTS.md e `anki/baralhos.json`. Para os cartões de nível 1 (campo `n` = 1) que têm `nc` ("não confunda com"), gere com o modelo de imagem do Gemini uma ilustração simples e didática que mostre a diferença entre os dois conceitos (sem texto dentro da imagem, estilo flat em tons laranja suave). Salve em `anki/img/<id>.webp` (máximo 60 KB cada) e crie `anki/imagens.json` mapeando id → arquivo. Não altere os textos dos cartões. No `estudio.html`, mostre a ilustração acima da imagem-esquema quando existir.

**Conferir:** abra 20 cartões ao acaso e veja se a imagem não contradiz o conteúdo. Uma imagem errada ensina errado: na dúvida, descarte.

## 3. Vídeos curtos a partir dos roteiros das videoaulas

**Pedido para colar:**
> Leia o AGENTS.md. No `estudio.html`, as funções `lessonTopic` e `lessonFormat` montam o roteiro de cada videoaula (lista de falas em `cues`). Escreva um script Node ou Python que exporte os roteiros das 20 aulas de tópico com maior peso (campo `peso` dos `expedicao/*.json`, priorizando os que já caíram na Transpetro) para `docs/roteiros/<disciplina>-<n>.md`. Depois, para cada roteiro, gere com as ferramentas de vídeo do Google um vídeo vertical de 60 a 90 segundos, com narração em português, e salve no Google Drive na pasta "Estúdio Cesgranrio · Artefatos para estudo / Vídeos". Não coloque os vídeos no repositório.

**Conferir:** assista aos 3 primeiros inteiros e compare com o roteiro. Fato errado no vídeo = descarte e regere.

## 4. Questões inéditas no padrão da banca (banco extra)

**Pedido para colar:**
> Leia o AGENTS.md, `inteligencia/radar.json` (mitos e regras) e `inteligencia/incidencia.json` (campo `rx` com formato, gatilho, técnica, armadilha e família). Para cada subitem com menos de 5 questões no banco, gere 5 questões inéditas no estilo Cesgranrio: 5 alternativas, o distrator é a definição correta de um conceito vizinho da `familia`, a correta nunca usa absoluto forte e nenhuma regra "mito" é usada. Salve em `inteligencia/geradas.json` com `origem: "gemini"` e um campo `revisado: false`. Não misture com `questoes.json`.

**Conferir:** essas questões não entram nas estatísticas do Laboratório (que usa só questões reais). Revise ao menos 1 em cada 5 antes de marcar `revisado: true`.

## 5. Lembrete diário no celular · ✅ feito pelo Claude em 20/11

Já estão na Agenda Google: "Transpetro: plano do dia" às 7h30, todo dia de 21/11 a 03/12, com o link do plano; "simulado completo" em 04/12; "véspera" em 05/12. Nada a fazer aqui.

---

Quando cada tarefa terminar, abra o PR e peça à sessão do Claude "Sprint final Transpetro app" uma revisão do conteúdo antes do merge.
