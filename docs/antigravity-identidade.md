# Identidade premium: pedidos prontos para o Google AI Studio, Flow e Antigravity

Símbolo: girassol de Fibonacci (sementes pelo ângulo de ouro 137,5°, ligadas em braços de 13, com uma espiral áurea fina e núcleo laranja brilhante). Arquivos de referência: `identidade/marca.svg`, `identidade/premium/icone-mestre-escuro.png`, `identidade/premium/capa-premium-3x1.png`. Paleta: laranja #e8853a, âmbar #f4a463, laranja vivo #ff9a4d, marrom #a64d14, fundo escuro #3a2e26→#211a16, creme #faf6f1. Sem texto nas imagens (o texto entra pelo app). Não colocar rostos de pessoas reais.

## 1. Ícone do app em 3D premium (Gemini Image / Nano Banana no AI Studio)
Anexe `icone-mestre-escuro.png` como referência de composição e peça:
> Recrie este ícone de app em render 3D premium: ladrilho quadrado arredondado em chocolate escuro com vidro fosco e borda de luz quente, o girassol feito de pequenas esferas laranja polidas ligadas por fios finos de metal cobre, em espiral de Fibonacci, com um núcleo luminoso no centro e luz volumétrica suave. Mantenha a mesma geometria e as mesmas cores. Fundo transparente, 1024×1024, sem texto.
Salve como `identidade/premium/icone-3d-escuro.png` e a versão clara como `icone-3d-claro.png`.

## 2. Capa e ilustrações (Gemini Image)
- Capa 3:1 (1500×500): "Campo de girassóis de nós ao amanhecer, em estilo ilustração premium, tons de laranja e marrom escuro, com a espiral áurea fina sobre o céu, sem texto, espaço vazio à esquerda para título."
- Onboarding (3 telas, 4:3): (1) um edital que se desdobra em uma árvore de nós; (2) uma flor de nós sendo montada peça por peça; (3) a mesma flor girando com um relógio de revisões ao redor.
- Estados vazios (6, 1:1): cartas, questões, resultados, estatísticas, revisões e anotações, todos com um pequeno girassol de nós como personagem.

## 3. Animação de abertura (Flow / Veo)
> Animação de 4 segundos em loop: o girassol de nós se forma a partir do núcleo luminoso, os braços de Fibonacci crescem em espiral, os nós acendem em sequência, rotação lenta no final. Fundo escuro #211a16, paleta laranja, sem texto. 16:9 e 1:1.
Salve como `identidade/premium/abertura.mp4`. Para uso leve no app já existe `identidade/marca-animada.svg`.

## 4. Antigravity (no seu computador, com o repositório clonado)
Tarefa para o agente: "Leia `AGENTS.md` e `docs/antigravity-identidade.md`. Gere as imagens acima com o Gemini Image, salve em `identidade/premium/`, converta para WebP (qualidade 90) e coloque `identidade/premium/<nome>.png` e `.webp`. Nada de chaves de API no repositório. Abra um PR e não mexa em cores, temas nem layout."

## O que eu já fiz (vetor, sem IA de imagem)
`identidade/premium/`: ícone mestre 1024 (escuro e claro), capa 3:1, banner social 1200×630 e padrão contínuo, tudo em SVG e PNG com as cores seguindo os tokens do tema.
