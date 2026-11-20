# Guia para agentes (Antigravity, Gemini, Claude)

> Atualizado em 20/11/2026 com o Estúdio, a Expedição, o Relâmpago e a camada de inteligência.

## O projeto

Arena Transpetro Processos de Negócios: app de estudo para a prova Transpetro 2026, banca Cesgranrio, cargo Analista de Sistemas, Ênfase 5 Processos de Negócios. Prova em domingo, 06/12/2026, com 330 minutos (tempo adicional PcD). Usuário: Ronaldo. Tudo em português do Brasil.

Publicado em https://ronaldo082327.github.io/arena-transpetro/ (GitHub Pages, branch `main`, raiz). Existe também uma versão no Claude (artifact) e outra no Google AI Studio que baixa os JSON deste repositório.

## Arquivos

| Arquivo | O que é |
|---|---|
| `index.html` | App inteiro numa página: HTML, CSS e JS sem build. Abre direto no navegador |
| `questoes.json` | 1.000 questões reais da Cesgranrio: `{id, disc, caderno, concurso, ano, assunto, enunciado, alternativas:{A..E}, gabarito}` |
| `cards.json` | 1.541 flashcards: `{id, f, b, d, s}` (frente, verso, disciplina, subitem) |
| `banca.json` | Perfil da banca, 18 prioridades, 35 armadilhas, comentários do TecConcursos |
| `videos.json` | 38 videoaulas curadas com nota |
| `cadernos.json` | 91 cadernos do TecConcursos com URL |
| `familia.json` | 18 cenas do "Banca em Família" (parentes explicando pontos da prova), com links de vídeo |
| `musicas.json` | 20 paródias de estudo (letras originais para cantar em melodias conhecidas) |
| `links.json` | Ecossistema: versões do app, cadernos, Drive, NotebookLM, Gems, Canvas, Flow |

## Regras

1. **Sem build e sem dependências novas** no `index.html`. Bibliotecas só por CDN com versão fixa.
2. **Valide o JSON** depois de qualquer edição (`python -m json.tool arquivo.json`).
3. **Conteúdo técnico fiel à Cesgranrio.** Não invente fato de prova. Na dúvida, marque `[VERIFICAR]`.
4. **Progresso do usuário** fica no `localStorage` (chave `arenaTP.v2`). Não apague nem mude o formato sem migração.
5. **Nada de chaves de API, tokens ou senhas** no repositório. O repositório é público.
6. **Direitos autorais:** as paródias são letras novas; nunca acrescente versos de músicas originais. Comentários de professores do TecConcursos entram só parafraseados.
7. **Crianças da família** (João Miguel e Sophia) aparecem só como personagens desenhados, nunca a partir de fotos.
8. **Commits pequenos**, mensagem em português, e teste no navegador antes de enviar.

## Já implementado (02/11/2026)

- App instalável e offline no GitHub Pages: `manifest.json`, `sw.js` (cache com versão por data; revalida com o servidor) e ícones `icon-192.png`/`icon-512.png`.
- Exportar e importar o progresso (área Placar); no Claude, o download usa a permissão `downloads`.
- Labs de SQL com alasql 4.6.6 (12 desafios conferidos automaticamente).
- Relatório do simulado por bloco, calibração da margem (certeza, dúvida, chute) e tipos de erro.

Ao mudar arquivos servidos, o `sw.js` precisa de uma versão nova (o script `pwa_github.py` gera pela data).


## Já implementado (20/11/2026): Estúdio, Expedição e Relâmpago

Três páginas novas, sem build, no mesmo padrão do `index.html`. O visual é claro, laranja suave e com relevo, pedido do Ronaldo.

| Arquivo | O que é |
|---|---|
| `estudio.html` | Hub: Plano da prova, Simulador de aprovação (Monte Carlo), 197 videoaulas animadas e narradas, Métodos, Mapas mentais, Esquemas e Pranchas, Baralhos Anki com imagem-esquema, Flashcards, Reflexo (Vizinho em 6 s, Caça-sinal, Elimina em 30 s, Raio-X), Mapa Transpetro, Laboratório da Banca, Radar Transpetro, Gemini (chave do usuário, só no `localStorage`) |
| `expedicao.html` | Imersão: 10 terminais (disciplinas) e 115 estações (subitens), com questões comentadas |
| `jogo.html` | Arena Relâmpago: missão do dia, chefões, XP, conquistas, 40 macetes (`macetes.json`, conferidos contra os guias) |
| `expedicao/*.json` | Gerado de `guias/*.md` por `python3 expedicao/gerar.py` (tópicos, formatos, duelos, listas, véspera) |
| `inteligencia/padroes.json` | Padrões medidos em 1.413 questões, gerado por `python3 inteligencia/gerar.py` |
| `inteligencia/incidencia.json` | 546 questões dos cadernos por incidência (349 com raio-x), gerado por `inteligencia/importar_incidencia.py` |
| `inteligencia/radar.json` | Fatos da Transpetro com fonte, convergência, mitos × medido, como a banca monta a prova |
| `anki/baralhos.json` | 2.021 cartões dos 47 baralhos do Ronaldo, gerado por `anki/importar.py` |

Chaves de progresso: `arenaTP.jogo.v1`, `arenaTP.expedicao.v1`, `arenaTP.estudio.v1`, `arenaTP.gemini` e `arenaTP.claude` (chaves do usuário; a da Claude guarda também o teto mensal e o gasto estimado) e `arenaTP.ia` (qual IA usar).

**Mente do examinador** (`estudio.html#mt/<disciplina>/<índice>`): método por tópico. Cruza o guia (cobra, pergunta, confunde, macete), o raio-x de `inteligencia/incidencia.json` pelo subitem e as questões de `questoes.json` atribuídas ao tópico por palavra-chave do assunto. Mostra formatos medidos, armadilhas, vizinhos, sinais, método por formato (`FMT`), rascunho e treino filtrado. Amostra menor que 5 aparece como pista, não regra.

**IA**: Gemini ou Claude, escolhida em `#gem`. A Claude é chamada do navegador (`anthropic-dangerous-direct-browser-access`), modelo padrão `claude-opus-5-5`, e o app bloqueia o envio quando o gasto estimado do mês passa do teto definido pelo usuário. Nunca coloque chave no repositório. Nunca reutilize `arenaTP.v2`.

### Regras de conteúdo da inteligência (validadas com rigor)

- **Confirmados:**
  - absoluto forte (exclusivamente, necessariamente, nunca, qualquer) quase nunca é gabarito: 4/70 aqui e 3/85 no teste da Central, com exceção de definição literal de norma e de Lógica;
  - equilíbrio de letras por dezena (203 gabaritos oficiais): chute de cerca de 20% para cerca de 29–30%.
- **Mitos:** par espelho, alternativa mais longa, letra preferida, TRI, "bloco de SQL nas questões 21 a 35", "senoides". Não reintroduza nenhum deles como regra.
- **Neutros:** "nenhum" (22,5%), "pode", "apenas" (desconfie, não risque).
- Toda nova "regra" precisa de teste cego (detector definido antes de ver o gabarito), número de casos e comparação com o acaso. Sem isso, entra como hipótese, não como regra.

## Tarefas para o Antigravity

Veja `docs/antigravity-tarefas.md`: pedidos prontos, com o que conferir antes de enviar.

## Próximas ideias (até 27/11/2026, depois só correções)

- Gráfico de evolução do acerto por semana.
- Modo "revisão relâmpago" com 10 cards e 5 questões dos assuntos de pior acerto.
- Lembrete diário (notificação) quando o app estiver instalado.


## Identidade visual e temas (todos os apps)

Identidade "Reta Final": azul petróleo, verde-cana e laranja (referência de marca: Inter e Itaú). `tema.css` + `tema.js` são carregados por `estudio.html`, `expedicao.html`, `jogo.html` e `index.html` (depois do `<style>` da página) e definem 6 temas via `:root[data-theme]`: `retafinal` (padrão, claro com barra petróleo), `petroleo` (escuro), `laranja` (claro, estilo Inter), `cana` (verde-cana), `itau` (azul e laranja), `noite` (preto e laranja). `light` e `dark` são apelidos de `retafinal` e `petroleo`. Relevo 3D (`data-depth` 0, 1, 2). Chaves: `arenaTP.tema` e `arenaTP.relevo`; nomes antigos (pêssego, gelo etc.) migram para o padrão. Botão "🎨 Tema" flutuante em todas as páginas (`data-th-bottom` no `<html>` sobe o botão quando há barra inferior).

Regras: use só variáveis (`--bg --paper --ink --muted --line --accent --accent-soft --on-accent --brand --on-brand --bar --bar-ink --ok --warn --bad --gold --hi --hi2`), nunca cores fixas. `--accent` serve para texto e controles (contraste mínimo 4,5:1); `--brand` é o laranja vivo (ou verde-cana no tema `cana`) para botões primários, sempre com `--on-brand` escuro. Videoaulas (`.stage`) e rascunhos SVG continuam como folha clara de propósito.

## Links externos dentro do app (`abrir.js`)

Todo link `http(s)` externo (de qualquer página) abre no visualizador interno (`#vw`, estilo em `tema.css`, barra e cores do tema do app). Embutem: YouTube (via youtube-nocookie), arquivos, pastas, Docs, Planilhas, Apresentações e Formulários do Google (`/preview`, `/embed`), guias `.md` do `raw.githubusercontent.com` (renderizados no próprio app) e sites sem trava. Sites que recusam iframe (lista `BLOQ`: NotebookLM, AI Studio, Gemini, Claude, Anthropic, TecConcursos, GitHub etc.) mostram uma tela-ponte com "janela ao lado", "nova aba" e "copiar link". Não dá para aplicar o tema do app dentro de um site de outra origem: só a moldura é temada. Documentos privados do Google podem pedir login dentro do iframe (cookies de terceiros). Use `data-fora` no `<a>` para abrir fora, `data-titulo` para dar título. Esc e o botão Voltar do navegador fecham o visualizador.

## Navegação do Estúdio (menu lateral, busca e segunda tela)

- Menu lateral esquerdo (`#sb`), gerado de `TOOLS` (ferramentas agrupadas por intenção, cada uma com uma linha dizendo o que faz). No computador recolhe para ícones (`arenaTP.sb`); no celular vira gaveta (☰) com barra de atalhos embaixo (Hoje, Método, Treinar, Assistir, Mais).
- Barra superior com botões ← e → (histórico), título da ferramenta e do assunto, busca (Ctrl+K ou `/`; lista ferramentas e os 115 tópicos, Enter abre, Shift+Enter abre na segunda tela) e o botão 🎨 Tema (`#thslot`).
- Segunda tela (`#pn`): painel à direita com a ferramenta carregada num iframe `?embed=1` (esconde menu e barra; o tema vem do `localStorage`). Abre pelo botão ⧉ de cada item, Alt+clique ou qualquer elemento com `data-panel="#rota"`. No computador largo ela fica ao lado da tela principal; no celular ocupa a tela. Esc fecha.
- "Continuar" no menu guarda o último local (`arenaTP.ultima`). Cada troca de ferramenta tem uma animação curta de entrada e volta ao topo.

## Dora Guilda (nome do app final)

O app se chama **Dora Guilda · Engenharia Cognitiva para Concursos Públicos** (manifest, títulos e cabeçalhos). Catálogo de módulos com nome próprio em `guilda.js` (`window.GUILDA.groups`), usado pelo menu lateral do Estúdio e pelo "Menu da Guilda" das demais páginas. Nomes, regra de nomenclatura, nomes reservados para a Central e o Dora Draw, estrutura final e fases: `docs/dora-guilda.md`. Rotas e chaves técnicas não mudam; só o texto na tela. Todo recurso novo precisa de nome com "Dora" ou do mundo da guilda e entrar em `guilda.js`.

## Escada de modelos (Gemini, voz e Claude)

`estudio.html` chama a IA por uma escada: tenta sempre o melhor primeiro e, quando um modelo dá limite (429), sobrecarga (503) ou "não existe" (404), grava o bloqueio em `arenaTP.blk` e desce para o próximo; quando o bloqueio vence (cota esgotada: 5 h; por minuto: o tempo que a API informar; sobrecarga: 2 min), volta ao melhor.
- Gemini texto (`GLAD`): `gemini-4-neon` → `gemini-4-argon` → `gemini-4-carbon` → `gemini-4-hydrogen` → `gemini-3.8-flash` → `gemini-3.7-flash` → `gemini-3.5-flash` → `gemini-3.1-flash-lite`. Voz (`TTSL`): `gemini-3.8-flash-tts` → `gemini-3.1-flash-tts-preview` → `gemini-2.5-pro-preview-tts` → `gemini-2.5-flash-preview-tts` → `gemini-3.8-flash-lite-tts`. Claude (`CLAD`): Opus 5.5 → Sonnet 5.5 → Haiku 5.5. A voz cai para a voz do aparelho se nenhum modelo de voz responder.
- Observado em 20/11/2026 com a chave do AI Studio do Ronaldo (plano gratuito, pelo endpoint compatível com OpenAI): Neon, Argon, Carbon e Gemini 3.1 Pro responderam 429 com `limit: 0` (a chave não tem cota gratuita neles); Hydrogen, 3.7 Flash, 3.5 Flash e 3.1 Flash-Lite responderam; os modelos 2.5 retornam 404 ("no longer available to new users"). A voz (TTS) não foi testada com chave real. O botão "Testar voz humana" em ✨ Dora Mentora mostra o modelo que funcionou ou o erro.
- Nunca ative faturamento no projeto do Google para "destravar" o Neon sem o Ronaldo pedir: ele quer ficar só na cota gratuita.
