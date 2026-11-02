# Guia para agentes (Antigravity, Gemini, Claude)

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

## Próximas ideias (até 27/11/2026, depois só correções)

- Gráfico de evolução do acerto por semana.
- Modo "revisão relâmpago" com 10 cards e 5 questões dos assuntos de pior acerto.
- Lembrete diário (notificação) quando o app estiver instalado.
