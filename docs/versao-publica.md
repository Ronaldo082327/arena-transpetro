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
