# Dora Draw — edição geral

Caderno de estudo para **qualquer concurso público**. Você monta o edital, escreve notas, faz mapa mental e desenho, cria cartões e questões, acompanha seus erros e planeja a semana. **Seus dados ficam só no seu computador.**

O Dora Draw é uma **extensão do Chrome ou do Edge**. Ela abre o app em uma janela própria e, de brinde, traz o **Dora Clipper**: um capturador para guardar textos, questões, recortes de tela e minutos de vídeo do navegador direto em um tópico do seu edital.

---

## 1. Instalar a extensão (uma vez só, uns 2 minutos)

1. **Não mova nem apague a pasta `extensao`** depois de instalar. O navegador lê os arquivos dela. Coloque a pasta do Dora Draw em um lugar fixo (por exemplo, `Documentos`).
2. Abra o navegador e digite na barra de endereço:
   - Chrome: `chrome://extensions`
   - Edge: `edge://extensions`
3. Ligue o **Modo do desenvolvedor** (chave no canto da tela).
4. Clique em **Carregar sem compactação** e escolha a pasta **`extensao`** (a que tem o arquivo `manifest.json`).
5. O Dora Draw aparece na lista. Clique no ícone de quebra-cabeça da barra do navegador e **fixe** o Dora Draw para ele ficar à mão.

> O Chrome pode mostrar, ao abrir, o aviso "Desative as extensões do modo de desenvolvedor". É normal para extensões carregadas assim: feche o aviso e **não desative** o Dora Draw.

## 2. Atalho na Área de Trabalho (abre como um programa)

1. Na pasta do Dora Draw, clique com o botão direito em **`criar-atalho.ps1`** e escolha **Executar com o PowerShell**.
2. Se o Windows bloquear, abra o PowerShell nessa pasta e rode: `powershell -ExecutionPolicy Bypass -File .\criar-atalho.ps1`
3. Aparece **Dora Draw** na Área de Trabalho. Ele abre em janela própria, sem barra de endereço.
4. Instalou a extensão no **Edge**? Rode: `.\criar-atalho.ps1 -Navegador edge`. Usa outro perfil do navegador? Acrescente `-Perfil "Profile 1"`.
5. Para tirar o atalho: `.\criar-atalho.ps1 -Remover`.

O endereço da extensão é fixo (o ID não muda), então o atalho continua funcionando depois de atualizações.

## 3. Primeiros passos

1. Em **Concursos**, crie o seu (ou veja o "concurso de exemplo" para conhecer o app e apague depois).
2. Em **Dora Edital**, preencha a ficha, **cole o texto do edital** e confira a proposta de disciplinas e tópicos. Ajuste o **Quadro da prova** (questões, pontos e mínimo por disciplina).
3. Abra um tópico: tem **Notas**, **Mapa mental**, **Quadro** (desenho), **Cartões**, **Questões**, **Materiais** e o campo **"Como a banca cobra"**.
4. Use **Estudar** (sessão do dia, por tópico, só erros, simulado relâmpago), **Dora Foco** (cronômetros), **Dora Revisões**, **Dora Ciclo** ou **Dora Agenda** para organizar a rotina.
5. Erros, acertos com dúvida ou chute e acertos lentos entram sozinhos no **Diário de Batalha** e saem depois de 2 acertos com certeza.

## 4. Dora Mentora (IA) — opcional, com a SUA chave

O app **não vem com nenhuma chave**. Para usar a IA:

- **Gemini (Google AI Studio):** entre em `aistudio.google.com/apikey`, crie uma chave e cole na tela **Dora Mentora**. O nível gratuito do Gemini não cobra nada.
- **Claude (Anthropic):** crie a chave em `console.anthropic.com` e cole na mesma tela. O uso do Claude é cobrado pela Anthropic, conforme a sua conta; por isso existe o **teto de gasto** (opcional) na tela.
- A chave fica guardada **só neste navegador** e **nunca entra em backup**. O botão **Apagar chave** remove na hora.
- **Escada de modelos:** o app tenta sempre o melhor modelo primeiro. Se der limite de uso, ele bloqueia esse modelo por 5 horas e desce para o próximo; depois volta ao melhor. A tela mostra o modelo ativo, os bloqueados e a hora em que cada um volta. O botão **Tentar o melhor agora** limpa os bloqueios.
- A IA explica questões, gera cartões e questões inéditas, resume o diário de erros e rascunha o "como a banca cobra". **Ela pode errar: confira.**

## 5. Dora Clipper (capturador do navegador)

Só age **quando você manda**, uma página ou questão por vez. Nada é enviado para fora.

| Como | O que faz |
|---|---|
| Botão direito em um texto selecionado > **Dora Clipper** | Salva como nota, cartão ou Dora Carta (questão) |
| **Alt+Shift+S** | Salvar o texto selecionado |
| **Alt+Shift+R** | Recortar uma área da tela e mandar para o Quadro de um tópico |
| **Alt+Shift+Q** | Capturar a questão aberta na página (enunciado, alternativas e, se estiverem visíveis, gabarito e resolução) |
| **Alt+Shift+M** | No YouTube, marcar o minuto do vídeo como nota com link |
| Botão direito > **salvar esta página** | Guarda título, endereço e um trecho |
| Ícone da extensão | Cronômetro de foco, nota rápida e os mesmos botões |

Depois de capturar, abre um **painel lateral** para você escolher o concurso, o tópico e o destino. Dá para deixar na **caixa de entrada** (tela Início) e classificar depois. Atalhos podem ser mudados em `chrome://extensions/shortcuts`.

**Importante:** respeite os termos de uso de cada site. Use as capturas só para o seu estudo, sem copiar em massa. O capturador de questões lê só o que já está na tela que você abriu; ele não entra em páginas por você, não burla login nem pagamento.

## 6. Backup e Dora Cofre

- O app faz **cópias de segurança sozinho** ao abrir (guarda as 20 mais recentes e 1 por dia nos últimos 30 dias). Veja e restaure na tela **Dora Cofre**.
- Em **Ajustes > Backup** você baixa um arquivo `.json` (com ou sem os PDFs da Estante). Guarde-o fora do computador de vez em quando.
- Se limpar os "dados de navegação" do Chrome/Edge, o banco do app pode ir junto: **faça backup antes**.
- **Perfis:** várias pessoas podem usar o mesmo computador, cada uma com os seus dados (tela Dora Cofre).
- **Estruturas da Guilda:** exporte um concurso pronto (ficha, edital, quadro da prova, links, simulados) em `.json` para dar a um colega, ou importe o de alguém. Não leva suas notas, seu progresso nem chaves.

## 7. Versão site (opcional)

A pasta `web` é o mesmo app como site/PWA, para quem não quiser instalar a extensão (sem o capturador). Precisa ser colocada em um servidor para funcionar; se for só testar no próprio computador, use um servidor local.

## 8. Privacidade e licenças

- Nada é enviado a servidores do Dora Draw (não existem). Os dados ficam no banco do navegador (IndexedDB).
- A única comunicação externa é a da IA, **só quando você pede**, para `generativelanguage.googleapis.com` (Google) ou `api.anthropic.com` (Anthropic), com a sua chave.
- Leitura de PDF: **PDF.js 4.4.168**, da Mozilla, licença Apache 2.0 (arquivos em `extensao/lib`; texto da licença no início de cada arquivo).
- O Dora Draw é obra original. Marcas e sites citados pertencem aos seus donos.

## 9. Para quem for distribuir

Não distribua a pasta `chaves-locais` (tem a chave PRIVADA da extensão). O pacote gerado por `node scripts/empacotar.js` já sai sem ela. Detalhes técnicos em `NOTAS-DEV.md`.
