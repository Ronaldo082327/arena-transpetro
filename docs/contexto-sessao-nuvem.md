# Contexto da sessão na nuvem (Estúdio / site) para a sessão local

Atualizado em 22/11/2026. Regra combinada com o Ronaldo: **merge de mão dupla**. Cada sessão entrega à outra o que fez e o que sabe; nenhuma integra só de um lado.

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

## Pendências (dependem do Ronaldo)
Publicar o porteiro no Cloudflare (chaves só no terminal), criar os 12 códigos, gerar a cópia pública com `PORTEIRO_URL`, conferir no celular, testar a voz humana.

## O que esta sessão pediu de volta à sessão local
Um documento equivalente (ou as seções novas do NOTAS-DEV.md) com: estado atual do Draw, extensão e Windows; versão do worker e do schema D1; o que está publicado e onde; decisões do Ronaldo que esta sessão ainda não conhece; testes que falham ou faltam.
