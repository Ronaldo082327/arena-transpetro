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

Design único da Dora Guilda, o mesmo da Dora Central e do Dora Draw (pacote 3D). Arquivos:
- `temas.css`: **gerado** (não editar à mão) a partir de `fonte-temas.js` do pacote da Central. 17 temas por tokens em `:root[data-theme="<id>"]`: `auto` (padrão, segue o sistema), `claro`, `escuro`, `grafite`, `meia-noite`, `oceano`, `floresta`, `lavanda`, `areia`, `neon`, `alto-contraste` e os da Dora Guilda `retafinal`, `petroleo`, `laranja`, `cana`, `itau`, `noite`. Contraste conferido (texto 4,5:1).
- `tema.css`: camada de design. Define a compatibilidade com os nomes antigos (`--brand`, `--bar`, `--shadow`...), relevo em botões e cartões (`--grad-btn`, `--sombra-btn`, `--sombra-afundado`), botão principal (`--grad-btn-p`), cabeçalho de vidro (`--vidro`), ladrilhos por seção (`data-sec` treino, memoria, acompanhar, apoio), seletor de tema, menu da Guilda e visualizador de links. Cantos 16/11/22 px, movimento 180 ms, barra inferior de 72 px.
- `tema.js`: aplica o tema salvo (`arenaTP.tema`, padrão `auto`), "Movimento reduzido" (`arenaTP.movimento`), "Texto grande" (`arenaTP.texto`) e monta o botão 🎨 Tema. Temas antigos (pêssego etc.) voltam para `auto`.
- Estúdio: menu lateral em vidro (desktop) e barra flutuante de 72 px (celular), tela `#mais` (grade por seção), chip com a contagem de dias até 06/12/2026.

Regras: componentes só com `var(--token)`, nunca cor literal; botão principal com `--grad-btn-p` e texto `--on-destaque`. Para mudar uma cor de tema, edite `fonte-temas.js` na Central (ou o par de blocos em `temas.css` com o mesmo cuidado de contraste) e rode `contraste.js`. As telas de videoaula (`.stage`) e os rascunhos SVG continuam como folha clara de propósito.

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

## Dossiê do examinador (118 fichas, vindo da Central)

`dossie/*.json` (10 arquivos, ~500 KB, gerados na Dora Central; fonte: `dossie-topicos/publicar` do pacote `legado/`). Estrutura: `{bloco, nome, resumo.secoes[], subitens[{id, edital, esperado, chance, fraca, evidencia, vizinhos, examinador, tipos[{nome, pct, reconhecer, gesto[], tempo, exemplo}], sinais[], pegadinhas[{rotulo, como, desarmar, par}], macete, rascunho{passos, vinte}, versao, checklist[], treinar[{id, gab}]}]}`. O `ingles.json` traz também `roteiro` (10 passos) e `termos.lista` (40 termos).
No Estúdio (`estudio.html`): a ficha aparece no topo de cada tópico em `#mt/<bloco>/<índice>` (casamento pelo número do tópico, ex.: `1.4`), com a análise automática do banco dobrada abaixo como "complementar". Português e Inglês têm fichas por **tipo de questão** em `#mt/<bloco>/f/<id>` (ids `LP.*` e `LI.*`). O resumo do bloco ("onde estão os pontos") e o esperado de cada tópico aparecem na lista. Não editar os JSON à mão: regerar na Central e recopiar.
Ainda não integrados do pacote `legado/`: Provas Previstas e Calibradas (14 MB), as 3.229 cartas do Dora Draw, Atlas da Guilda (69 SVG), a extensão e o app Windows. O Drive é privado; só entram no repositório público os arquivos pequenos que o Ronaldo aprovou.

## Dora Draw (edição geral) dentro da Dora Guilda

`draw/` é a versão web/PWA do Dora Draw edição geral (organizador de estudo para qualquer concurso), vinda do pacote da outra sessão (`dora-draw-geral/Dora-Draw-geral-v1.0.0.zip`, pasta `web/`), com código próprio, sem chave de API e sem copiar código de terceiros. Tem edital, tópicos, Dora Cartas (SM-2), Diário de Batalha, importação de questões, Estante com PDF, Dora Foco, Dora Revisões, Dora Ciclo, Dora Agenda, Diário de Simulados, Discursivas, Estruturas da Guilda, Dora Mentora e Dora Cofre. Dados só no aparelho (IndexedDB e `doraDraw.*` no localStorage); a chave de IA dele é separada da do Estúdio (cole de novo em Dora Mentora, dentro do Dora Draw).
- `draw/ponte.js` (único arquivo nosso): herda o tema de `arenaTP.tema`, espelha a troca de tema do Draw para `arenaTP.tema` e põe o atalho "🏰 Dora Guilda". Não edite os outros arquivos de `draw/` à mão: regere o pacote na outra sessão e recopie `web/` (e confira `ponte.js` no `index.html` e no `sw.js`).
- A extensão do navegador (Dora Clipper e Dora Guilda para o navegador) e o app Windows continuam fora do repositório, no computador do Ronaldo (`Apps para instalar`) e no Drive privado (`dora-draw-geral/Dora-Draw-extensao-v1.0.0.zip`).

## Mira da Guilda e Defenda o gabarito

- `#mira` (Estúdio): ordena os tópicos (fichas do dossiê) por prioridade = questões esperadas × (1 − acerto estimado), com acerto suavizado `(acertos+1)/(tentativas+2)` (50% sem respostas). Fontes de acerto: log das Dora Cartas (`S.cq.log`: cartas `g<bloco><índice>_…` e `x<id>` do raio-x) e `arenaTP.v2.hist` do Doroxandria (questões atribuídas ao tópico por palavra-chave). Português e Inglês usam o acerto do bloco inteiro. Dedupe: tópicos que dividem a mesma ficha aparecem uma vez.
- "🛡️ Defenda o gabarito": botão no verso de cada carta (quando há IA): o aluno escreve por que a certa é certa; a IA avalia o raciocínio, o sinal ignorado, a pegadinha e dá uma frase de método.


## Identidade gráfica "Constelação da Guilda" (21/11)
- `identidade/gerar.py` gera marca, logo, capa e avatares por patente (SVG). `identidade/gerar-png.js` gera os PNGs do app (PWA e Dora Draw).
- `guilda.js` tem 24 ícones próprios (`G.ICONS`, `G.svg`, `G.ico`) em traço `currentColor` com nós em `var(--destaque)`: seguem os 17 temas. Não mudar cores/tokens de tema.
- Galeria: `identidade/index.html`.

## Identidade B "D-Grafo" aplicada (21/11)
Substitui a proposta A: `identidade/` agora tem marca/logo/capa/sprites/mascotes da proposta B (feita na sessão local). `guilda.js` usa `identidade/sprite.svg` (`G.MAPA` liga as chaves antigas aos nomes `dg-*`); `G.BASE` resolve o caminho. Não mudar cores/tokens. Ícones de app: `icon-192/512/maskable-512.png`. Ícones do Dora Draw (`draw/icones/`) ficam com a sessão local.

## Identidade final: girassol de Fibonacci (22/11)
Símbolo escolhido pelo Ronaldo: sementes pelo ângulo de ouro ligadas em braços de Fibonacci. `identidade/marca.svg` e `marca-compacta.svg` (mesmo desenho aprovado pelo Ronaldo: 55 sementes, braços de 13 e a espiral áurea fina atravessando; mais pontos foi rejeitado; usado inline em `guilda.js` `G.SIMBOLO`). Cores por token (`--accent`, `--destaque`, `--destaque-2`) com fallback laranja, então seguem os 17 temas. Ícones do app: `node identidade/gerar-png.js` gera `icon-192/512.png`, `icon-maskable-512.png` e `identidade/final/icone-claro-512.png`; o ícone principal do app é o ESCURO. Propostas descartadas ficam em `identidade/propostas*`. Substitui o escudo provisório e o D com cérebro (rejeitado).

## Kit premium do girassol aplicado (22/11)
Vindo da sessão local (Drive `identidade-premium`): `identidade/marca.svg` = símbolo-mestre com volume e tokens de tema (`G.SIMBOLO` em `guilda.js` usa o mesmo desenho inline); `icon-192/512.png`, `icon-maskable-512.png` (escuros) e `apple-touch-icon-180.png`; `favicon.svg`; `identidade/abertura-logo.svg` abre no primeiro acesso do Estúdio (flag `arenaTP.abertura`, fecha com Entrar/Esc/9 s); OG e capa de redes em `identidade/premium/oficial/`. Regra do kit: até 32 px usar a versão de 21 sementes e 48-64 px a de 34 (não baixadas aqui; só o favicon vem pronto). Não baixados do Drive: logotipos, pecas/, android/, vídeos.
