# Dora Guilda · versão pública (plano)

Objetivo: uma cópia sem os materiais do Ronaldo, para qualquer concurso, com todas as ferramentas.

## Separar conteúdo de motor
- **Motor** (fica): shell, temas, ícones, Mira, Reflexo, cartas, IA, Draw.
- **Conteúdo** (sai): `dossie/`, bancos de questões, `audio/`, cartas, Atlas, previstas, edital Transpetro. Versão pública entra com "Importar seus materiais" (arquivos ficam no navegador do aluno) e um edital configurável.

## Chave de IA: NÃO embutir no app
Qualquer chave dentro de HTML/JS/APK é pública em minutos; alguém esgota a cota ou gera cobrança. Caminho seguro:
1. **Proxy próprio** (Cloudflare Worker/Cloud Run): a chave fica no servidor, o app chama o proxy.
2. Cota por usuário (token de convite ou login), limite diário, CORS só no domínio do app, corte global.
3. Alternativa: cada aluno cola a própria chave gratuita (já funciona hoje, custo zero para você).

## Distribuição
- Navegador: GitHub Pages (PWA instalável).
- Windows: instalar o PWA pelo Edge/Chrome, ou empacotar com Electron/Tauri.
- Android: PWA instalável, ou TWA (Bubblewrap) para Play Store.

## Riscos jurídicos antes de distribuir
- Dora Draw foi derivado por engenharia reversa do Abussola Draw e o Track Concursos tem licença proprietária: só distribuir o que for implementação original.
- Questões e apostilas da Cesgranrio/terceiros têm direitos autorais: usar só conteúdo autoral ou licenciado.
- LGPD: se houver login/cota, precisa de política de privacidade.

## Estado (21/11)
- `python3 publico/construir.py` gera `publico/dist/` (ignorada pelo git): copia o motor e troca questões, cartas, dossiê, bancos, guias, áudio e o edital por esqueletos vazios + `concursos/modelo.json` ("Meu concurso"). Aborta se achar chave de API. Teste no Chromium: 9 páginas abrem sem erro.
- **Falta** (próximas etapas): textos fixos "Transpetro/Cesgranrio/ENFASE 5/06-12" nas telas (contagem de dias, jogo, expedição, Estúdio), importar materiais e edital pelo app, trocar estações da Expedição por trilha configurável, proxy de IA com cota, empacotar Windows/Android.

## Atualização (21/11, noite)
`construir.py` agora também: troca "Transpetro/Cesgranrio/Ênfase 5/06-12" por textos neutros, esconde Mapa-Mundi, Radar, Laboratório e Dora Central do catálogo e deixa a contagem regressiva configurável (`localStorage arenaTP.prova` = AAAA-MM-DD; sem data o chip some). Teste: 9 páginas sem erro; zero ocorrências de Transpetro/Cesgranrio nos HTML/JS do Estúdio, Doroxandria, Arena e Expedição.
**Ainda falta:** tela para o aluno informar concurso e data (hoje só via localStorage), importar edital/materiais pelo app, trilha da Expedição configurável, onboarding de 3 telas, o conteúdo em si (o aluno traz o dele), proxy de IA já pronto (porteiro) mas ainda não publicado.

## Tela "Meu concurso" (21/11)
Rota `estudio.html#config`: concurso, banca, cargo, data da prova, edital colado (matérias e tópicos) e peso/nº de questões por matéria. Grava em `arenaTP.concurso` e `arenaTP.prova`; a contagem regressiva usa essa data na versão pública. Fica no topo do menu "Começar" da cópia pública. Ainda não alimenta Mira/Plano/Examinador com as matérias do aluno.

## Mira e Plano do aluno (22/11)
Na cópia pública (`MODO_PUBLICO=true` pelo `construir.py`) a Mira e a Dora Missão do Dia usam as matérias de "Meu concurso": prioridade = peso da matéria × relevância (1 a 5) × erros do Caderno de Erros; o plano divide as horas do dia entre os 3 tópicos de maior prioridade e lembra as revisões vencidas. No app principal a Mira também soma os erros do caderno por tópico. Erros de cartas da Dora Memória voltam ao caderno como reincidência.

## Catálogo da cópia pública (22/11)
A cópia pública mostra só o que funciona sem conteúdo pronto: Meu concurso, Dora Missão do Dia, Mira da Guilda, Dora Memória, Caderno de Erros, Dora Mentora (IA), Dora Draw e a galeria da identidade. Ficam fora (dependem do conteúdo da Transpetro e voltam quando houver como o aluno gerar o próprio): Dora Oráculo, Dora Examinadora, Grimório de Métodos, Dora Reflexo, Mapas, Pergaminhos de Esquemas, Dora Cartas, Baralhos, Aulas, Rádio, Expedição, Arena e Doroxandria. Recomendação: gerar fichas e mapas por IA a partir de "Meu concurso" (próxima fase).

## Dora Examinadora na cópia pública (22/11)
`#mt` na cópia pública lista os tópicos de "Meu concurso" e gera a ficha com a IA do aluno (cobra, pergunta, armadilhas, sinais, método, macete e 4 a 6 cartas), guardada em `arenaTP.fichas`. As cartas entram na Dora Memória e a Mira mostra "ficha pronta". O prompt proíbe inventar dados de prova (usa [VERIFICAR]). Não testado com IA real, só com resposta simulada.

## Porteiro (22/11)
Contrato final: POST {url}/ia {codigo, prompt, sistema?, json?} -> {texto, modelo, prov, restanteHoje}; erro {erro:true, msg, volta?}. O aluno NÃO escolhe o modelo: o porteiro usa sempre o Gemini (Neon para pedidos pesados, Hydrogen para leves, pensamento alto) e só cai para a Claude (Opus 5.5, esforço médio) quando todo o Gemini está sem cota, dentro do teto em dólares. O app avisa quando restam 3 pedidos ou menos no dia. Teto global da Claude e limites por código ficam no worker (ver porteiro/LEIA-ME.md da sessão local); gestão em {url}/admin.

## IA na cópia pública (22/11)
A tela Dora Mentora da cópia pública mostra só o código de acesso (sem chave própria, sem escolha de modelo, sem teto de gasto). O endereço do porteiro pode vir embutido: `PORTEIRO_URL=https://... python3 publico/construir.py` (sem a variável, o aluno também cola o endereço). O servidor escolhe: Gemini sempre primeiro (Neon para pedidos pesados, Hydrogen para leves, pensamento alto) e Opus 5.5 médio só quando todo o Gemini está sem cota.

## Estante inteligente e Mapas da Dora (22/11)
- `#estante`: o aluno envia PDF/TXT/MD (até 10 MB cada). Contrato com o porteiro: POST {url}/estante/enviar com o ARQUIVO no corpo (binário) e cabeçalhos `x-codigo`, `x-nome` (encodeURIComponent) e `content-type`; POST /estante/listar {codigo}; /estante/apagar {codigo,id}; /estante/apagar-tudo {codigo} (LGPD). Aviso de guarda antes do 1º envio (`arenaTP.estanteAviso`).
- `/ia` aceita `estante:true` (File Search do Gemini com a store do código; se cair para a Claude, responde sem a estante).
- `#mapaia` (Mapas da Dora): a IA devolve a árvore em JSON e o app desenha o mapa em SVG com as cores do tema; salva os 30 últimos (`arenaTP.mapas`), baixa SVG e vira cartas na Dora Memória. Funciona no app principal (chave própria) e na cópia pública (porteiro, com opção "usar minha estante").

## Estante: contrato final do worker (22/11)
Envio binário com content-length (o fetch com body=File manda); erros 411/415/413 {maximoMB}/409 (20 arquivos ou 60 MB)/429 (30 envios no dia)/503 {tenteEm} (estante sendo criada: o app tenta de novo até 3 vezes)/502/422. listar traz `pronto` (o app mostra "preparando…" e atualiza a cada 20 s). apagar pode dar 409 {tenteEm:60} enquanto indexa. /ia com estante devolve `fontes` (até 6) e `semEstante`; os Mapas da Dora mostram os trechos usados e avisam quando o mapa saiu sem a estante.

## Cópia pré-configurada para um concurso (ex.: SEFAZ-AL 2026)
```
PORTEIRO_URL=https://<seu-porteiro> PRECONFIG=sefaz-al-auditor python3 publico/construir.py [pasta]
```
- **Primeiro acesso:** o app carrega `exemplos/sefaz-al-auditor.json` e abre direto no passo de domínio do assistente, com o aviso "Seu app já veio pronto". O aluno só informa o que domina e quando pode estudar.
- **Exemplos disponíveis:** `sefaz-al-auditor` (Cebraspe, prova em 20/12/2026), `bacen-analista-ti`, `receita-auditor` e `sefaz-es-auditor`. Para gerar um novo, ponha o texto do edital (`pdftotext -layout`) na pasta e acrescente-o à lista de `exemplos/gerar.js`.
- **IA:** continua pelo porteiro, com a chave do Ronaldo e o código de acesso do aluno.
- **App principal (Transpetro):** o assistente "Começar" e as outras bancas ficam escondidos. O Perfil da Banca mostra só a Cesgranrio.
