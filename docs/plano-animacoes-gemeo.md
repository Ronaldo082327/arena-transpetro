# Plano conjunto: animações cinematográficas do Gêmeo Digital e dos agentes sintéticos

Pedido do Ronaldo (21/11): elevar as animações do Gêmeo Digital e dos agentes sintéticos com Antigravity, Veo, Flow e as melhores ferramentas do Google, aproveitando a identidade do girassol. Esta é a proposta da sessão nuvem para a sessão local, para planejarmos juntas. Responda no `contexto-sessao-local.md`, ou num arquivo novo na mesma pasta do Drive, com o que muda.

## Princípio: vídeo é ambiente, dados são canvas
- Um vídeo do Veo não pode mostrar os números de cada aluno, porque eles mudam todo dia e ficam só no aparelho.
- **Arquitetura já pronta no site (`gemeo.js`):**
  - o canvas desenha os dados reais (linha do gêmeo, faixa de 80%, sementes acesas, contadores, campo sintético);
  - os clipes de vídeo entram como camadas desenhadas dentro do próprio canvas: o fundo em loop por baixo, e o marco e o final no modo "screen", em que o preto some;
  - a gravação em vídeo pelo botão "🎬 Gravar em vídeo" (MediaRecorder) captura tudo junto.
- **Sem os clipes, a animação continua só com o canvas.** Nada quebra.

## Modelo para os artefatos no Google (pedido do Ronaldo)
Todo artefato criado no ecossistema Google (prompts, roteiros, imagens, vídeos, documentos, páginas pelo Antigravity) usa o **Gemini 4 Neon** como orquestrador, com raciocínio alto (thinkingLevel HIGH). O Veo e o Flow geram o vídeo, mas o pedido, a revisão e a escolha das tomadas passam pelo Neon. Se a cota do Neon acabar, pare e avise; não troque de modelo sem o Ronaldo saber.

## Clipes pedidos (gerar no Veo/Flow pelo Antigravity, no computador do Ronaldo)
**Regras de todos os clipes:**
- sem texto, sem pessoas reais, sem marcas;
- paleta do tema escuro: fundo #1b1410, laranja #e07a2e, dourado #f2b544, creme #fff6e8;
- fundo **preto puro** nos clipes de efeito (marco e final), para o modo screen;
- 24 ou 30 fps; WebM (VP9) e MP4 (H.264); até 4 MB cada.

| Arquivo | Uso | Duração | Formato | Prompt base (Veo) |
|---|---|---|---|---|
| `gemeo-fundo.webm/.mp4` | fundo em loop (horizontal) | 8–10 s, loop perfeito | 1920×1080 | "Slow cinematic drift through a dark warm cosmos, soft golden dust and faint constellation lines forming Fibonacci spirals, deep brown-black background (#1b1410), subtle orange and gold glows, no text, seamless loop, calm, elegant, 4k" |
| `gemeo-fundo-v.webm/.mp4` | fundo em loop (celular) | 8–10 s | 1080×1920 | o mesmo, vertical |
| `gemeo-marco.webm/.mp4` | explosão nos marcos (100 questões, recorde, sequência) | 2–3 s | 1920×1080 | "Burst of golden sunflower seeds and luminous petals exploding outward from the center in slow motion, sparks and light trails, pure black background, no text" |
| `gemeo-final.webm/.mp4` | fecho (hoje) | 4–5 s | 1920×1080 | "A luminous Fibonacci sunflower (55 seeds, golden-angle spiral) blooming fully, seeds igniting one by one along the spiral, god rays, camera slowly pulling back, pure black background, no text" |
| `gemeo-abertura.webm/.mp4` (opcional) | substitui o carregando | 3–4 s | 1920×1080 | "A single golden seed in darkness sprouts into a glowing spiral of light, camera push-in, pure black background, no text" |

**Onde salvar:**
- **Drive:** `Dora Guilda - legado (20-11)/para-o-site/gemeo/`.
- **Repositório:** os clipes vão para `identidade/video/`, junto com o manifesto `identidade/video/gemeo.json`:
```json
{"fundo":"identidade/video/gemeo-fundo.webm","fundoV":"identidade/video/gemeo-fundo-v.webm","marco":"identidade/video/gemeo-marco.webm","final":"identidade/video/gemeo-final.webm"}
```

**O que conferir antes de aceitar um clipe:**
- loop sem emenda visível no fundo;
- preto puro de verdade nos clipes de efeito (sem cinza);
- nada de texto nem rostos;
- leve no celular.

## Divisão do trabalho
**Sessão local (Antigravity, Veo/Flow e Draw):**
1. Gerar os clipes acima, escolher as melhores tomadas e subir no Drive.
2. No Draw: o Gêmeo (Beta + FSRS + Monte Carlo) e os agentes sintéticos (TRI 3PL) são mais completos que o gêmeo do Estúdio.
   - **Proposta:** exportar por dia `{dia, med, lo, hi, percentil_agentes}` no formato `dora-guilda-gemeo` v1 (JSON).
   - Quando existir no IndexedDB do Draw (ou importado), o Estúdio usa essa série em vez da própria e mostra "agentes TRI 3PL do Draw".
3. Se quiser, levar o mesmo player (canvas + camadas de vídeo) para a tela do Gêmeo dentro do Draw: `gemeo.js` é autônomo, sem dependências.

**Sessão nuvem (site):**
1. Já pronto: player em camadas, sincronia do clipe de marco com os marcos reais, clipe final, gravação em vídeo, fundo vertical no celular, movimento reduzido.
2. Quando os clipes chegarem:
   - baixar do Drive e otimizar;
   - criar o `gemeo.json`;
   - pôr os clipes no cache do `sw.js` (só os do celular) e testar no iPhone e no computador.
3. Ler a série `dora-guilda-gemeo` v1 do Draw assim que o formato for confirmado.

## Opção sem o Google (feita aqui)
O botão "🎬 Gravar em vídeo" já gera um vídeo (WebM, ~5 MB por 20 s) da jornada real do aluno, para compartilhar. Ele é a versão "feita pelo app" e funciona com ou sem os clipes do Veo.

## Constelação da Guilda (21/11)
- O mesmo pedido vale para a galáxia de conhecimento (`constelacao.js`, rota `#constelacao`): um clipe de fundo cósmico com nebulosa em espiral de Fibonacci (`constelacao-fundo.webm`, loop de 10 s, sem texto) pode entrar como camada, como no Gêmeo.
- O cofre exportado (Meus Dados → .zip Markdown) abre no Obsidian com a visão de grafo nativa.
