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
