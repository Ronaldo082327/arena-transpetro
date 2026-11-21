# Dora Guilda · Engenharia Cognitiva para Concursos Públicos

Nome único do app final. Este documento é o catálogo oficial de nomes e o plano de união dos dois projetos:
o repositório `arena-transpetro` (páginas estáticas, GitHub Pages) e o trabalho feito na pasta
`Sprint Final Transpetro` no computador (Central Reta Final, Dora Draw, Dora Clipper, temas 3D, Atlas, dossiê).

## Regra de nomes

Todo recurso tem **nome próprio com "Dora" ou do mundo da guilda** (Guilda, Grimório, Pergaminho, Mapa, Mestre, Missão, Oráculo, Diário, Atlas, Salão)
e, ao lado, uma linha simples dizendo o que faz. Quem usa não precisa adivinhar. As rotas e as chaves técnicas **não mudam**; muda só o texto na tela.

## Catálogo (fonte única: `guilda.js`)

| Rota ou arquivo | Nome na tela | O que faz |
|---|---|---|
| `estudio.html#plano` | Dora Missão do Dia | O que estudar agora e o plano até a prova |
| `estudio.html#sim` | Dora Oráculo | Chance de passar em 10.000 provas simuladas |
| `estudio.html#mt` | Dora Examinadora | Como a banca cobra cada tópico e onde pega |
| `estudio.html#met` | Grimório de Métodos | Passo a passo por tipo de questão |
| `estudio.html#ref` | Dora Reflexo | Treinos de 6 segundos |
| `estudio.html#mm` | Mapas da Guilda | Mapas mentais |
| `estudio.html#esq` | Pergaminhos de Esquemas | Duelos, listas e desenhos para a prova |
| `estudio.html#cq` | Dora Cartas | Cartões-questão com explicação de cada alternativa |
| `estudio.html#fc` | Dora Memória | Flashcards com repetição espaçada |
| `estudio.html#anki` | Baralhos da Guilda | Baralhos do Anki com imagem |
| `estudio.html#v` | Dora Aulas | Videoaulas animadas e narradas |
| `estudio.html#pod` | Dora Rádio | Resumos em áudio (NotebookLM) |
| `estudio.html#lab` | Laboratório da Banca | Mitos e fatos medidos |
| `estudio.html#radar` | Radar da Guilda | Tendências da prova e da Transpetro |
| `estudio.html#geo` | Mapa-Mundi Transpetro | Onde a empresa atua |
| `estudio.html#gem` | Dora Mentora (IA) | Gemini ou Claude |
| `expedicao.html` | Dora Expedição | 115 estações |
| `jogo.html` | Arena Relâmpago | Jogo com XP |
| `index.html` | Doroxandria | Biblioteca de 1.000 questões e caderno de erros |

### Nomes reservados para o que veio da Central e do Dora Draw

| Recurso (nome de trabalho) | Nome oficial |
|---|---|
| Central Reta Final | **Dora Central** |
| Dora Draw | **Dora Draw** (mantém o nome) |
| Cartões-questão v2 (3.229) | **Dora Cartas** (une com o `#cq` do Estúdio) |
| Caderno de erros | **Diário de Batalha** |
| Rascunhos de prova interativos | **Dora Rascunho** |
| Inglês do zero | **Dora Babel** |
| Tela Examinador, 118 fichas | **Dora Examinadora** (une com o `#mt`) |
| Ficha do dia | **Ficha do Mestre** |
| Atlas (69 SVG) | **Atlas da Guilda** |
| Galeria (vídeos Veo e infográficos) | **Galeria da Guilda** |
| Mural | **Mural da Guilda** |
| Palácio | **Palácio da Memória** |
| Simulados 1 e 2, Calibradas C1–C3, Provas Previstas | **Simulados da Guilda** |
| Treinador de Tipos | **Dora Treinador** |
| Sistema de Resolução | **Sistema Dora de Resolução** |
| Dora Clipper (extensão do navegador) | **Dora Clipper** (mantém o nome) |
| Extensão Reta Final | **Dora Guilda para o navegador** |

## Estrutura final (um app só)

1. **Casca única:** menu lateral da Dora Guilda (`guilda.js` + `estudio.html`), busca Ctrl+K, segunda tela, temas (`tema.css`/`tema.js`), visualizador de links (`abrir.js`). As outras páginas já mostram o mesmo menu ("Menu da Guilda").
2. **Dados únicos:** uma só base de questões e um só progresso. Chaves atuais: `arenaTP.v2` (Doroxandria), `arenaTP.estudio.v1`, `arenaTP.jogo.v1`, `arenaTP.expedicao.v1`. O Dora Draw e a Central devem gravar nelas, não em banco próprio.
3. **Módulos:** cada recurso da tabela acima é uma rota ou página, com o mesmo cabeçalho e as mesmas variáveis de tema.
4. **Versões independentes:** o mesmo código sai como site (GitHub Pages), como app instalável (PWA) e como extensão do navegador (Dora Guilda para o navegador / Dora Clipper).

## Fases

- **Fase 1 (feita):** marca "Dora Guilda", catálogo de nomes, menu comum, temas, segunda tela, visualizador de links.
- **Fase 2:** receber o código da Central e do Dora Draw em `legado/` (ver pedido ao outro agente).
- **Fase 3:** portar a persistência dos artifacts (`window.claude` db, user, downloads) para `localStorage` e unir os dados (3.229 cartas, 118 fichas, simulados).
- **Fase 4:** trocar o legado pelos módulos finais, empacotar a extensão e o app de Windows com o nome Dora Guilda.

## Pedido ao agente da pasta `Sprint Final Transpetro`

1. Enviar o código para o repositório `Ronaldo082327/arena-transpetro`, no branch `peer/dora-central`, em `legado/central/` e `legado/dora-draw/`, sem mídia pesada (vídeos Veo, imagens grandes).
2. Incluir `legado/LEIA-ME-INTEGRACAO.md` com: arquivos de entrada, arquivos de dados e tamanhos, como cada artifact grava dados, comandos de teste e onde estão a extensão e a versão Windows.
3. Não editar `index.html`, `estudio.html`, `expedicao.html`, `jogo.html`, `tema.css`, `tema.js`, `guilda.js` e `abrir.js` no `main` até a união.
4. Adotar a marca e os nomes deste documento na Central e no Dora Draw.

## Acompanhamento do estudo (vem do Dora Draw, edição geral)

Ideias gerais de organizadores de concurso (ficha do concurso, cobertura do edital, ciclo e agenda, cronômetros, revisões agendadas, simulados com análise, estruturas em JSON, perfis e cópias de segurança) estão sendo implementadas **do zero** no Dora Draw, edição geral. A Dora Guilda **integra** esse código quando ele chegar à pasta privada do Drive; não duplica.

**Origem e licença:** a referência foi a descrição pública do app Track Concursos (michel-softwares/track-concursos, licença proprietária que proíbe modificar e redistribuir). Nenhum código, tela, texto, imagem, marca ou nome dele foi copiado nem submetido a engenharia reversa. Não faça isso: só ideias gerais de funcionalidade, com código, design e nomes próprios.

Nomes reservados no catálogo (rotas a criar na integração):

| Rota | Nome |
|---|---|
| `#foco` | Dora Foco (regressivo, foco e pausa, livre, lançamento manual) |
| `#rev` | Dora Revisões (agendadas e reforçadas) |
| `#simu` | Diário de Simulados (nota por pesos e mínimos, análise por disciplina) |
| `#ciclo` | Dora Ciclo (ciclo de estudos por peso × fraqueza) |
| `#agenda` | Dora Agenda (semanal, com estimativa de cobertura do edital) |
| `#edital` | Dora Edital (ficha do concurso, cobertura, quadro da prova, materiais por tópico) |
| `#estruturas` | Estruturas da Guilda (concursos prontos em JSON) |
| `#cofre` | Dora Cofre (perfis e cópias de segurança) |
