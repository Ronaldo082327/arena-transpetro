# Arena Transpetro Processos de Negócios

App de estudo para a prova Transpetro 2026 (Cesgranrio, Analista de Sistemas, Ênfase 5 Processos de Negócios, 06/12/2026).

- 1.000 questões reais da Cesgranrio com correção, simulados, flashcards com revisão espaçada, aba Banca (perfil, prioridades, armadilhas, comentários, videoaulas) e links do ecossistema.
- Página estática: abra `index.html` por um servidor (por exemplo GitHub Pages). O progresso fica salvo no navegador (localStorage).
- O tutor com IA só aparece quando o app roda dentro do Claude (artifact). Fora dele a página funciona sem o tutor.

Dados: `questoes.json`, `cards.json`, `banca.json`, `videos.json`, `links.json`.

## Arena Relâmpago (`jogo.html`)

Revisão gamificada que usa os mesmos dados: Missão do dia (pontos fracos), Relâmpago de 5 minutos com combo, Chefão por disciplina, flashcards em 5 caixas, Caça-armadilha (`banca.json`) e 40 macetes (`macetes.json`). XP, níveis, sequência de dias e conquistas ficam em `localStorage` na chave `arenaTP.jogo.v1`, separada do `arenaTP.v2`.

## Expedição Cesgranrio (`expedicao.html`)

Experiência imersiva de aprendizagem: uma viagem noturna de petroleiro por 10 terminais (disciplinas) e 115 estações (subitens do edital). Cada estação percorre Radar (peso no caderno e se já caiu na Transpetro), O que a banca cobra, Como ela pergunta, Onde ela confunde, Macete, Questões comentadas interativas, Cartões e um Desafio com questão real de `questoes.json`. Cada terminal também tem Radar da banca, Formatos de questão (com procedimento passo a passo), Pares e pegadinhas, Decorar e Véspera. Narração em voz (pt-BR) e som do mar opcionais.

O conteúdo vem dos guias em `guias/`. Depois de editar um guia, rode `python3 expedicao/gerar.py` para regenerar `expedicao/*.json`. O progresso fica em `arenaTP.expedicao.v1`, e o XP ganho entra no Arena Relâmpago (`arenaTP.jogo.v1`).
