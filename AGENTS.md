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


## Temas e relevo (Estúdio)

9 temas (Pêssego, Gelo, Menta, Lavanda, Rosa, Noite, Grafite, Petróleo, Aurora) via `:root[data-theme]`, escolhidos no botão 🎨. Relevo 3D plano/suave/forte via `data-depth` (variáveis `--o`, `--b`, `--sh-d`, `--sh-l`). Chaves: `arenaTP.tema` e `arenaTP.relevo`. Ao criar CSS novo, use as variáveis (`--paper`, `--hi`, `--accent-soft`, `--shadow`, `--raise`), nunca cores claras fixas. As telas de videoaula (`.stage`) e os rascunhos em SVG ficam como folha clara de propósito. `expedicao.html` e `jogo.html` ainda usam só claro/escuro.
