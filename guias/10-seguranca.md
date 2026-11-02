# Segurança da Informação · Guia Cesgranrio de revisão e fixação

Sete questões em 2023 (38 a 44, 14% da prova específica), projeção de 7 a 9 em 2026 para 21 subitens do Anexo IV: o bloco se decide por vocabulário (uma frase por sigla, o número de cada norma, a ferramenta pela função, a chave certa de quem), não por técnica profunda.

## 1. Radar da banca

### 1.1 O que a Cesgranrio cobra nesta disciplina (todos os concursos, 2014–2026)

Base: `cadernos/caderno09.txt` (198 questões Cesgranrio, 2016–2025, 52 de 2023 em diante) e `txt/indice_09.txt` (238 classificações, porque o TecConcursos marca algumas questões em mais de um assunto). Atenção a um fato que muda a leitura do índice: o arquivo do caderno termina na categoria 05.06 (Tópicos Mesclados de Recursos). As categorias 06 a 12 do índice (Segurança Física 1, Incidentes/SIEM 5, Pentest 1, Programação Segura 8, Frameworks 18 com ATT&CK 7, NIST 5, CIS 4, OWASP 2, Blockchain 2, Mesclados 3) não estão no arquivo. Para esses assuntos o único precedente disponível é a prova Transpetro 2023 comentada (`txt/prova2023.txt`), e é assim que ele é citado aqui. Percentuais abaixo são sobre as 238 classificações do índice.

| Tópico | Questões no caderno Cesgranrio (n e %) | Transpetro 2023 / 2018 (nº das questões) | Prioridade |
|---|---|---|---|
| Ferramentas de perímetro: firewall, proxy, DMZ, IDS/IPS, WAF | 20 (8,4%) | 2023: Q43 (SIEM); 2018 PN: tec 638941 (firewall ACL) | máxima |
| Criptografia: conceitos, chaves, envelope, algoritmos pelo nome | 22 (9,2%) | 2023: Q41 (envelope digital); 2018 PN: nenhuma direta | máxima |
| Certificado digital, ICP-Brasil, assinatura digital, hash | 21 (8,8%) | 2018 PN: tec 638948, 638950, 619543, 619548 | máxima |
| Malware por tipo | 12 (5,0%) | 2018 PN: tec 638945 (bot); 2023 outras ênfases: rootkit, keylogger, Stuxnet | máxima |
| Gestão / família ISO 27000 (SGSI, riscos 27005, organização, classificação, continuidade 22301) | 33 (13,9%) | 2023: Q44 (27002 malware em operações); 2018 PN: tec 638939, 638940 | alta |
| Ataques: DoS/DDoS, spoofing, engenharia social, web (XSS, CSRF, SQLi, path traversal) | 28 (11,8%) | 2023 PN: nenhuma; 2023 Ênfase 7: nove questões | alta |
| Conceitos e pilares (CID, autenticidade, irretratabilidade, ataque passivo × ativo) | 10 (4,2%) | 2018 PN: tec 619545 (ataque passivo → confidencialidade) | alta |
| Controle de acesso: autenticação, SSO, biometria, RBAC/ABAC/DAC/MAC, IAM, federação | 9 (3,8%) | 2023: Q39 (ABAC); 2018 PN: tec 619550 (SSO), 638949 (SAML) | alta |
| Protocolos seguros: TLS/HTTPS, IPsec, Wi-Fi/802.1X, SFTP | 26 (10,9%) | 2023 Ênfase 7: seis questões; 2018 PN: tec 638942 (VPN tunelamento) | média (só o conceito) |
| VPN | 7 (2,9%) | 2018 PN: tec 638942 | média |
| Frameworks: NIST, MITRE ATT&CK, CIS, OWASP (ausentes do arquivo; só na prova 2023) | 18 no índice, 0 no arquivo | 2023: Q40 (tática ATT&CK), Q42 (NIST 800-61) | alta |
| Programação segura, SAST/DAST, DevSecOps (ausentes do arquivo) | 8 no índice, 0 no arquivo | 2023: Q38 (DAST) | alta |
| Backup, antivírus, gestão de vulnerabilidades (NVD) | 5 (2,1%) | nenhuma na Transpetro | média |
| Incidentes, CSIRT, SIEM (ausentes do arquivo; uma questão de 800-61 classificada em Conceitos) | 5 no índice, 1 no arquivo | 2023: Q42, Q43 | alta |
| Hardening, forense, pentest, blockchain, correio eletrônico | 7 (2,9%) | nenhuma | baixa / descartar |

Leitura do radar: em 2023 a Ênfase 5 recebeu sete questões e nenhuma delas foi de malware, ataque ou firewall clássico; foram DAST, ABAC, tática ATT&CK, envelope digital, NIST 800-61, SIEM e seção da ISO 27002. Ou seja: a banca usou o bloco para cobrar as siglas novas do edital, e os temas históricos (malware, criptografia, perímetro) ficaram para as outras ênfases. Em 2026 a aposta racional é a mesma mistura: três ou quatro questões de sigla nova (9.2, 9.5, 9.10 a 9.16, 9.20, 9.21) e três ou quatro do núcleo histórico (9.3, 9.4, 9.19).

### 1.2 O que ela nunca (ou quase nunca) cobra

- Configuração ou comando de ferramenta na Ênfase 5. A única questão de comando do caderno (PowerShell do Windows Firewall, tec 2695573) é da Ênfase 7 de 2023.
- Cálculo criptográfico (fórmula do RSA, tec 2695434; tamanho de bloco do AES, tec 2695431; truncamento do HMAC no AH, tec 2695439): sempre na Ênfase 7, nunca na 5 nem na Petrobras PN.
- Payload de ataque para analisar linha a linha. Quando aparece código (tec 1175324, tec 2694701), é para reconhecer o nome do ataque, não para corrigir o código.
- Perguntas de "qual afirmativa é falsa" com cinco afirmativas longas. O formato dominante é enunciado curto, uma função, cinco nomes.
- Segurança física isolada (catraca, CFTV, nobreak): uma única classificação no índice e nenhuma questão no arquivo.
- Blockchain, forense computacional, hardening, correio eletrônico (porta 587, filtro bayesiano): aparecem em BANESE e IPEA, nunca em Petrobras/Transpetro para a ênfase de processos.

### 1.3 O que foi descartado deste guia e por quê

Descartadas as 37 questões Transpetro 2023 da Ênfase 7 (Segurança Cibernética) e congêneres que pedem internals: matemática do RSA e logaritmo discreto (tec 2695434, 2695432), modos de operação de cifra de bloco (tec 2695437), AH/ESP/IKE/ICV do IPsec (tec 2695439, 2695452, 2694697, 2780849, 638771, 1720961, 1175327, 643501), handshake TLS em detalhe e versões (tec 2695438, 2695436, 3116459, 3347090, 2695484), WPA/WEP/802.1X/EAP/RADIUS (tec 3347869, 2780846, 3116452, 3117659, 3135929, 2695443, 2041385, 1720958, 2695545), SAML por protocolo interno (tec 638949), varredura furtiva IDLE scan (tec 2695450, 3116421), ferramentas de ataque pelo nome (hydra tec 2695446, setoolkit tec 2695447), produtos (Windows Defender ASR tec 2838006, SpamAssassin tec 3117637, PowerShell tec 2695573), hardening (tec 3347852), porta 587 (tec 2780861), FTPES (tec 3135933), roteador (tec 3135930), métrica de eficácia de TI (tec 401486) e percentual de inconsistência de inventário (tec 2041454). Regra usada: se a questão pede cálculo, campo de protocolo, comando ou nome de produto, não é desta ênfase. Dessas, aproveitei apenas o conceito de uma linha quando ele serve de distrator em questão de vocabulário (por exemplo, "TLS é a camada de segurança do HTTPS", tec 2780796).

## 2. Os formatos de questão desta disciplina

### Formato A: "a tecnologia/mecanismo que faz X é" (função → nome)

Como reconhecer: enunciado de três a seis linhas descrevendo UMA função ("agrega e analisa eventos e logs de várias fontes", "intermedia a comunicação no nível de aplicação", "produz o código de verificação de integridade") e cinco siglas ou nomes. Quatro alternativas são definições corretas de outras coisas.

Exemplo real: (Cesgranrio · Transpetro 2023 · Q43) "solução de software que fornece uma visão holística da segurança da informação de uma organização, agregando e analisando eventos e logs de segurança de várias fontes em toda a infraestrutura de TI" → SIEM, com CASB, WAF, DLP e proxy como distratores. Outro: (Cesgranrio · BANESE 2025 · tec 3346350) "mecanismo amplamente usado para produzir o código de verificação de integridade" → resumo de mensagem, com certificado digital e envelope digital como distratores.

Procedimento:
1. Sublinhe o verbo e o objeto da função no enunciado (agregar logs; intermediar aplicação; produzir código de integridade).
2. Antes de ler as alternativas, diga o nome que corresponde ao verbo.
3. Leia as alternativas só para confirmar; cada distrator tem o seu próprio verbo, e o verbo dele não é o do enunciado.
4. Se duas alternativas parecem servir, pergunte "em que camada" (rede, aplicação, endpoint, nuvem, dado, log) e "só olha ou corta".

Erro típico: escolher a sigla mais famosa (firewall, RBAC, certificado) em vez da que tem o verbo pedido; a banca conta com isso e põe a famosa como distrator (RBAC em Q39, certificado em tec 3346350).

### Formato B: "qual chave, de quem, em que momento" (criptografia)

Como reconhecer: remetente, destinatário, chave pública, chave privada, chave secreta/simétrica, e a pergunta é "com qual chave" cifrar, decifrar, assinar ou verificar. As cinco alternativas permutam dono (remetente, destinatário, AC/terceiro) e tipo (pública, privada, simétrica).

Exemplo real: (Cesgranrio · Transpetro 2023 · Q41, tec 2695300) envelope digital: "a chave secreta usada nesse esquema é criptografada utilizando-se um algoritmo de criptografia assimétrica com a chave" → pública do destinatário.

Procedimento:
1. Identifique a propriedade pedida: sigilo, autenticidade/assinatura, verificação, decifração.
2. Aplique a regra fixa: sigilo usa a PÚBLICA DE QUEM RECEBE; decifra-se com a privada de quem recebe; assina-se com a PRIVADA DE QUEM ENVIA; verifica-se com a pública de quem enviou; a AC assina certificados com a privada DELA.
3. Se o enunciado é de criptografia simétrica, a resposta é "a chave secreta compartilhada" e nada de pública/privada (tec 2041484, 2694690).
4. Elimine "terceiro confiável": a AC não participa da troca de mensagens.

Erro típico: inverter remetente e destinatário no sigilo (marcar "pública do remetente"), ou achar que a chave privada do signatário fica no certificado (nunca fica: o certificado leva a pública).

### Formato C: "a norma/publicação que trata de X é" (decidida pelo número)

Como reconhecer: enunciado descreve um conteúdo (ciclo de vida de resposta a incidentes; seleção de controles; continuidade de negócios) e as alternativas são cinco números reais de normas.

Exemplo real: (Cesgranrio · Transpetro 2023 · Q42) "Um Ciclo de Vida de Resposta a Incidentes está definido na publicação do" → NIST SP 800-61, contra 800-30, 800-34, ISO 27033-5 e ISO 27034-1. Outro: (Cesgranrio · Eletronuclear 2022 · tec 2041478) "referência na seleção de controles dentro do processo de implementação de um SGSI" → 27002.

Procedimento:
1. Traduza o enunciado para uma palavra-tema: incidente, risco, contingência, controles, requisitos, continuidade, privacidade.
2. Vá à tabela de números da seção 5 e pegue o número da palavra-tema.
3. Não tente deduzir pela descrição longa; ela é decorativa.

Erro típico: confundir o número vizinho (27001 × 27002; 31000 × 27005; 22301 × 22313; 800-61 × 800-30).

### Formato D: "dentro da norma, em que seção/fase/opção está X" (sumário)

Como reconhecer: a norma já está nomeada no enunciado e a pergunta é estrutural: em que seção, em que fase, qual opção de tratamento, qual item da avaliação de desempenho.

Exemplo real: (Cesgranrio · Transpetro 2023 · Q44, tec 2695303) proteção contra malware é objetivo da seção "segurança nas operações" da ISO 27002:2013. (Cesgranrio · IPEA 2024 · tec 2780872) a fase do 800-61 que "determina se um incidente aconteceu, a partir da análise de precursores e indicadores" → detecção e análise. (Cesgranrio · IPEA 2024 · tec 2780875) opção da 27005 que "gerencia o nível de risco por inclusão, exclusão ou alteração de controles" → modificação do risco.

Procedimento:
1. Reconheça a norma e recupere a lista decorada (14 seções da 27002:2013; 4 temas da 2022; 4 fases do 800-61; 4 opções da 27005; cláusulas 9 e 10 da 27001).
2. Encontre a palavra do enunciado dentro da lista.
3. Se a lista não vem à cabeça, elimine por tema: "malware" não é RH, nem comunicações, nem física.

Erro típico: achar que a 27001 lista controles técnicos (ela lista requisitos do sistema de gestão; os controles estão no Anexo A e detalhados na 27002).

### Formato E: narrativa situacional com ataque ou malware ("qual característica o diferencia")

Como reconhecer: um profissional "identifica a presença de um X" ou "observa uma situação atípica" e a pergunta é o nome do ataque/malware ou a característica específica. As alternativas descrevem corretamente os vizinhos.

Exemplo real: (Cesgranrio · Transpetro 2023 · tec 2690857) rootkit: "ocultar-se extremamente bem e interceptar chamadas ao sistema operacional, habilitando o acesso como administrador"; as outras quatro definem trojan, worm, phishing e spyware. (Cesgranrio · Transpetro 2023 · tec 2695440) IP do roteador associado dinamicamente ao MAC de uma estação que opera como man-in-the-middle → ARP spoofing.

Procedimento:
1. Extraia o verbo-assinatura da narrativa (oculta-se, replica-se sozinho, disfarça-se, coleta, cifra e cobra, engaja em armada, associa IP a MAC falso, usa a sessão autenticada da vítima).
2. Case com a tabela verbo → nome da seção 5.
3. Confirme que a alternativa escolhida não contém o verbo de outro malware.

Erro típico: marcar a alternativa que descreve o efeito mais grave ("coleta dados confidenciais") em vez da que descreve a característica DIFERENCIADORA pedida.

### Formato F: afirmativas I/II/III ou "assinale a correta" com uma inversão plantada

Como reconhecer: três ou cinco frases sobre duas tecnologias vizinhas; exatamente uma inverte o papel (IDS bloqueia; filtro de pacotes é mais complexo que o proxy; RBAC substitui a autenticação).

Exemplo real: (Cesgranrio · BNDES 2024 · tec 3117533) RBAC "será responsável por determinar as permissões dos usuários com base em seus papéis, enquanto a autenticação verificará a identidade dos usuários antes de atribuir esses papéis" é a correta; as erradas dizem que RBAC lida com autenticação, que substitui MFA, ou que é independente dela. (Cesgranrio · BNDES 2024 · tec 3117648) cinco definições corretas (filtro de pacotes, proxy, stateful, IDS, VPN) e a pergunta é qual delas é o firewall proxy.

Procedimento:
1. Para cada frase, pergunte "quem faz o quê": autenticação diz quem é; autorização diz o que pode; IDS avisa; IPS corta.
2. A inversão sempre troca os dois lados de um par da seção 4. Localize o par.
3. Nunca marque "apenas" ou "exclusivamente" sem confirmar a lista inteira (tec 2695480: controles de RH valem antes, durante e no encerramento; "apenas" derruba as outras quatro).

Erro típico: aceitar a frase que soa técnica ("RBAC atribui permissões sem considerar a identidade") sem testar o par autenticação × autorização.

### Formato G: definição da norma letra por letra (ISO 22301, 27005, 27002:2022)

Como reconhecer: "no contexto dessa norma, X é definido como" e cinco definições oficiais de termos vizinhos (política, sistema de gestão, BIA, plano de continuidade, continuidade de negócios).

Exemplo real: (Cesgranrio · AgeRIO 2023 · tec 2462904) plano de continuidade de negócios = "informação documentada que orienta a organização a responder a uma disrupção e retomar, recuperar e restaurar a entrega de produtos e serviços"; (Cesgranrio · Eletronuclear 2022 · tec 2041480) continuidade de negócios = "capacidade de uma organização continuar a entrega de produtos e serviços em um nível aceitável durante uma disrupção".

Procedimento:
1. Classifique a palavra pedida: é um documento (plano, política), um processo (BIA, avaliação) ou uma capacidade/estado (continuidade, resiliência).
2. Elimine as alternativas de categoria diferente: "plano" não é "capacidade", "BIA" não é "lista de eventos".
3. Entre as restantes, procure o verbo do termo: plano orienta a responder; BIA analisa impacto ao longo do tempo; continuidade é capacidade de continuar.

Erro típico: trocar plano de continuidade (documento) por continuidade de negócios (capacidade) porque ambos falam de "retomar e recuperar".

## 3. Tópico a tópico (um bloco por subitem do edital, na ordem do Anexo IV)

### 9.1 Segurança física e lógica

**Peso.** 10 questões de "Conceitos, Princípios e Atributos" (BANESE 2025, IPEA 2024, CNU 2024, BNDES 2024, Transpetro 2023 Ênfase 7, Petrobras 2018 PN, UNIRIO 2016) e 4 de ataque passivo × ativo em outros assuntos. Segurança física isolada: zero no arquivo. Petrobras 2018 PN cobrou uma (tec 619545).

**O que a banca cobra.**
- Pilares na redação oficial: confidencialidade (só autorizados leem); integridade ("alterações detectáveis"); disponibilidade; autenticidade ("origem ou entidade são exatamente quem reivindicam ser"); irretratabilidade/não repúdio ("proteção contra a negação falsa de envolvimento em uma comunicação"; "evidências apresentáveis a terceiros para resolver disputas").
- Pilar ↔ mecanismo: integridade → hash; autenticidade e não repúdio → assinatura digital; confidencialidade → cifragem; disponibilidade → backup e redundância.
- Ataque passivo (monitoramento, análise de tráfego) ameaça a confidencialidade e "descobre informações sem afetar recursos"; ativo (disfarce, repetição, modificação, DoS) altera ou cria fluxo.
- Controle de acesso "impede uso não autorizado, o que requer prévia autenticação" (tec 374127).
- Princípios de projeto (Saltzer e Schroeder): economia de mecanismo (design simples e pequeno), padrões seguros em falha, mediação completa, design aberto, separação de privilégios, privilégio mínimo, mínimo mecanismo comum, aceitabilidade psicológica.
- Física protege o ativo tangível e o local (perímetro, crachá, catraca, CFTV, nobreak, descarte); lógica protege dado e acesso ao sistema (senha, ACL, criptografia, firewall, log). Biometria na porta é física; no login é lógica. Controles: preventivo, detectivo, corretivo; "determinar permissões desde a contratação" é prevenção (tec 2780015).

**Como ela pergunta.** Propriedade pela descrição: irretratabilidade (Cesgranrio · Transpetro 2023 · tec 2695430; BNDES 2024 · tec 3116448; CNU 2024 · tec 3038223); ataque passivo → confidencialidade (Cesgranrio · Petrobras 2018 PN · tec 619545); princípio → economia de mecanismo (Cesgranrio · IPEA 2024 · tec 2780486). Classificar físico × lógico: [sem precedente localizado].

**Onde ela confunde.** "Irretroatividade" como isca fonética (aparece em tec 3116448 e 2695430). Autenticidade onde se pede não repúdio (prova quem enviou × impede negar depois). Certificado onde a resposta é hash (tec 3346350). "Fingir ser outra entidade" como ataque passivo (é ativo).

**Macete.** O que o controle impede? Ler → confidencialidade; alterar sem perceber → integridade; parar → disponibilidade; fingir ser → autenticidade; negar que fez → não repúdio. Porta arrombada → física; senha roubada → lógica.

**Questão comentada.** (Cesgranrio · BNDES 2024 · tec 3116448) Medida que "fornece evidências armazenáveis, apresentadas a terceiros para resolver disputas quando uma comunicação é negada por uma das entidades".
(A) integridade (B) autenticidade (C) irretroatividade (D) irretratabilidade (E) confidencialidade.
**Gabarito: D.** Evidência contra negação de envolvimento é não repúdio. A: detecta alteração. B: confirma origem no momento, sem prova para terceiros. C: termo inexistente. E: impede leitura.

**Para o Anki.**
- Serviço que impede a negação falsa de envolvimento em uma comunicação → Irretratabilidade (não repúdio); isca: "irretroatividade".
- Ataque passivo ameaça qual pilar? → Confidencialidade; "descobre informações sem afetar os recursos".
- Design "o mais simples e o menor possível" → Economia de mecanismo.

### 9.2 Operação de segurança (firewall, proxy, IPS/IDS, DLP, CASB, SIEM, antivírus, EDR, WAF, gestão de vulnerabilidades, monitoração, backup)

**Peso.** O maior do caderno: firewall/proxy/DMZ 15, IDS/IPS 5, backup 2, antivírus 2, NVD 1 (25, 10,5%) + SIEM na Transpetro 2023 Q43. Transpetro 2018 PN: tec 638941 (firewall com ACL). Ênfase 7 de 2023: IDS, proxy, WAF.

**O que a banca cobra.** Uma frase por ferramenta, com camada e ação:
- Filtro de pacotes: "listas de controle de acesso com regras que determinam se um pacote atravessa" (IP, porta); fica "em um gargalo de entrada e saída" (tec 2837988); função "controlar o tráfego para permitir ou impedir comunicação com base em regras" (tec 2690858). Stateful: "rastreia o estado das conexões ativas".
- Firewall proxy: "opera no nível de aplicação como intermediário entre estações internas e servidores externos, inspeciona o conteúdo e aplica política de acesso a sítios"; autentica usuário; resposta de seis questões (tec 2780871, 3116441, 3117648, 3135926, 1176578, 638768, 836012). Proxy reverso: "recebe as solicitações dos usuários, verifica a legitimidade e encaminha aos servidores web" (tec 3117538). DMZ: sub-rede dos servidores públicos entre interna e externa.
- IDS: "monitora o tráfego por anomalia e assinaturas; se detecta, gera alerta" (tec 3347863); passivo; detecta SYN flood e inundação de worm (tec 2694704, 2695455, 1175321). IPS/NIPS: em linha, "capaz de executar contramedidas" (tec 643498).
- WAF: "firewall de nível de aplicação entre cliente e servidor web, filtra e bloqueia tráfego HTTP malicioso" (tec 2462901); contra XSS, SQLi, cookie poisoning (tec 2041382).
- DLP: impede saída de dado sensível (uso, trânsito, repouso). CASB: entre a empresa e o SaaS (visibilidade, conformidade, dados, ameaças). SIEM: "agrega e analisa eventos e logs de várias fontes, visão holística" (Q43); correlaciona e alerta, não bloqueia; SOAR automatiza resposta; XDR estende a detecção. EDR: telemetria e resposta no endpoint (isolar, investigar). Antivírus: assinatura + heurística; vírus polimórfico muda o código a cada infecção (tec 3117639).
- Gestão de vulnerabilidades: scan → priorizar por CVSS (0 a 10) → patch. CVE identifica; NVD "lista vulnerabilidades já descobertas para serem consertadas" (tec 3116392); CWE tipifica fraquezas (tec 2695441); zero-day sem correção. NOC rede × SOC segurança.
- Backup: completo; incremental = desde o último backup de qualquer tipo (rápido de fazer, restaura a cadeia); diferencial = "modificados e adicionados desde o último completo" (tec 3347873), "incremental cumulativo" (tec 634020), restaura com dois conjuntos. Regra 3-2-1. Contra ransomware: "backups frequentes" (tec 2837995).
- RTO = tempo máximo parado; RPO = perda máxima de dados; MTPD ≥ RTO.

**Como ela pergunta.** Formato A: firewall proxy, IDS, SIEM (Q43), WAF. Formato F com cinco definições corretas (tec 3117648). Backup pelo critério "desde o último completo". RTO × RPO: [sem precedente localizado]; a planilha B9.03 registra enunciado real sem ID.

**Onde ela confunde.** IDS bloqueando (só alerta). Filtro de pacotes como o mais moderno e complexo (é o inverso do proxy). WAF como firewall de rede. SIEM como prevenção. DLP como distrator de IDS (tec 2694704). Diferencial "desde o último incremental". Proxy reverso descrito como VPN.

**Macete.** Camada: rede (firewall) → web (WAF) → endpoint (EDR) → nuvem (CASB) → dado saindo (DLP) → log de todos (SIEM). Ação: só olha (IDS, SIEM) × corta (IPS, firewall, WAF, DLP). "Incremental incrementa sobre o anterior; diferencial difere do completo." RT-O tempo; RP-O ponto.

**Questão comentada 1.** (Cesgranrio · Transpetro 2023 · Q43) Solução que "fornece visão holística, agregando e analisando eventos e logs de segurança de várias fontes em toda a infraestrutura de TI".
(A) CASB (B) WAF (C) DLP (D) SIEM (E) Proxy.
**Gabarito: D.** Correlação de logs de várias fontes é o SIEM. A: uso de nuvem. B: HTTP de aplicação web. C: vazamento de dados. E: intermediação de tráfego.

**Questão comentada 2.** (Cesgranrio · BNDES 2024 · tec 3117648) "Dentre os componentes do perímetro, o firewall proxy"
(A) usa campos de origem e destino do cabeçalho para filtrar pacotes na camada de rede. (B) serve como intermediário entre as solicitações dos usuários e os recursos, filtrando mensagens na camada de aplicação. (C) rastreia o estado das conexões ativas nas camadas de rede e transporte. (D) monitora a rede por assinaturas ou anomalias como analisador de tráfego. (E) implementa rede privada sobre rede pública por túnel seguro.
**Gabarito: B.** A: filtro de pacotes. C: stateful. D: IDS. E: gateway VPN. Decore as cinco linhas.

**Para o Anki.**
- Agrega, correlaciona e analisa logs de várias fontes → SIEM (não bloqueia; SOAR automatiza a resposta).
- IDS × IPS → Detecta e alerta (passivo) × bloqueia em linha (contramedidas).
- Intermediário na camada de aplicação que inspeciona conteúdo e aplica política de sites → Firewall proxy.
- Backup diferencial × incremental → Desde o último COMPLETO (2 conjuntos) × desde o último backup QUALQUER (cadeia inteira).
- RTO × RPO → Tempo máximo parado × perda máxima de dados; ambos saem do BIA.
- CVE × CVSS × NVD × CWE → Identificador × nota 0 a 10 × base das descobertas × tipos de fraqueza.

### 9.3 Softwares maliciosos

**Peso.** 12 de malware + 3 de botnet/C&C (6,3%): Transpetro 2023 (rootkit, keylogger, Stuxnet, C&C), Transpetro 2018 (ransomware, bot), BANESE 2025 (RAT, cryptojacking, polimórfico), BNDES 2024 (trojan, formjacking). Não caiu na Ênfase 5 em 2023, mas é o tema mais estável desde 2016.

**O que a banca cobra.** Um verbo por praga, na redação dos gabaritos:
- Vírus: anexa-se a hospedeiro e precisa do usuário; polimórfico cifra o código com chave nova a cada infecção (tec 3117639).
- Worm: "replicação e disseminação para outros sistemas" sozinho pela rede; Stuxnet atacou SCADA/Siemens (tec 2695558).
- Trojan: "apresenta-se como programa legítimo"; não se replica; vetor "mais indicado para implantar um spyware" (tec 3116341); RAT = trojan que "camufla um backdoor" (tec 3347856).
- Backdoor: "permite o retorno do invasor por serviços criados ou modificados" (tec 2041396).
- Rootkit: "oculta-se e intercepta chamadas ao SO, habilitando acesso como administrador" (tec 2690857).
- Spyware: "coleta informações pessoais e confidenciais"; keylogger "monitora login e senha fornecidos a uma aplicação" (tec 2695449); adware exibe propaganda.
- Ransomware: "criptografa os dados e cobra resgate pela chave" (tec 638797); dupla extorsão; defesa: backups (tec 2837995).
- Bot: "engaja o computador em uma armada para atacar alvos sem o conhecimento do dono" (tec 638945); armada = botnet (tec 1176454); comandada por servidor C&C (tec 2694705); Mirai é a de IoT.
- Cryptojacking: minera criptomoeda com a CPU da vítima (tec 3347859). Formjacking: JavaScript que rouba cartão no checkout (tec 3116433). Fileless: só em memória. Bomba lógica: condição. Wiper: destrói. Dropper: instala outro malware.
- Phishing, spear phishing e engenharia social NÃO são malware (distratores em tec 2690857 e 3116341).

**Como ela pergunta.** Formato E: "característica específica do rootkit" (Cesgranrio · Transpetro 2023 · tec 2690857); "monitora login e senha" → keylogger (Cesgranrio · Transpetro 2023 · tec 2695449); "engaja em armada" → bot (Cesgranrio · Transpetro 2018 PN · tec 638945); contramedida: ransomware → backups (Cesgranrio · UNEMAT 2024 · tec 2837995).

**Onde ela confunde.** Vírus "se replica autonomamente pela rede" (worm). Worm "se replica na memória de um único dispositivo" (falso). Rootkit coletando dados (spyware). Botnet "engana o usuário a dar credenciais" (phishing). Trojan × backdoor: disfarce de entrada × porta para voltar.

**Macete.** Esconder/admin → rootkit. Replicar sozinho → worm. Fingir legítimo → trojan. Coletar → spyware; teclas → keylogger. Cifrar/resgate → ransomware. Anexar-se e esperar o usuário → vírus. Armada → bot; general → C&C. Voltar → backdoor. Minerar → cryptojacking.

**Questão comentada 1.** (Cesgranrio · Transpetro 2023 · tec 2690857) Características do Rootkit que o diferenciam de outros malwares:
(A) Apresentar-se como programa legítimo. (B) Focar na replicação para outros sistemas. (C) Propor link para página falsa. (D) Coletar informações pessoais e confidenciais. (E) Ocultar-se extremamente bem e interceptar chamadas ao SO, habilitando acesso como administrador.
**Gabarito: E.** A: trojan. B: worm. C: phishing. D: spyware. A prova do padrão: quatro definições corretas de outras coisas.

**Questão comentada 2.** (Cesgranrio · BNDES 2024 · tec 3116341) Malware mais indicado para implantar um spyware:
(A) trojan, pois o usuário terá interesse em usá-lo e é silencioso. (B) vírus, pois se replica autonomamente em diversos computadores da rede. (C) worm, pois se replica em diversas áreas da memória de um único dispositivo. (D) spear phishing, pois usa computadores controlados para infectar um alvo. (E) botnet, pois engana o usuário a fornecer credenciais ao botmaster.
**Gabarito: A.** B: descreve worm. C: worm se espalha entre dispositivos. D: técnica, não malware; a descrição é de botnet. E: a descrição é de phishing.

**Para o Anki.**
- Oculta-se, intercepta chamadas ao SO e habilita acesso de administrador → Rootkit.
- Precisa de hospedeiro e do usuário × replica-se sozinho pela rede → Vírus × Worm.
- Disfarça-se de legítimo e não se replica → Trojan; RAT = trojan com backdoor.
- Engaja o computador em armada controlada por C&C → Bot; armada = botnet; Mirai = de IoT.
- Minera criptomoeda com a CPU da vítima × JavaScript que rouba cartão → Cryptojacking × Formjacking.

### 9.4 Ataques (DDoS, SQL injection, XSS, CSRF, path traversal etc.)

**Peso.** 28 questões (11,8%): engenharia social 5, spoofing 4, DoS 3, senhas 1, web 5, redes 5, mescladas 5. Nove na Transpetro 2023 Ênfase 7, nenhuma na Ênfase 5 nem na Petrobras PN 2018.

**O que a banca cobra.** Mecanismo e vítima:
- DoS × DDoS: uma × muitas origens (botnet). Volumétrico: "consumo excessivo da largura de banda" → flooding (tec 2695442). Protocolo: SYN flood, "conexões TCP com origem falsificada; o servidor responde e esgota recursos" (tec 2695459). Aplicação: slowloris, "divide requisições HTTP e envia cabeçalhos aos poucos para manter conexões abertas" (tec 2695448). Refletido (DRDoS): bots "se disfarçam como a vítima" (endereço do alvo na origem) e pedem a servidores legítimos, que respondem para a vítima (tec 2041338, 374130, 2780488); amplificação quando a resposta é maior (DNS, NTP). Smurf: ICMP para broadcast. Indireto: via terceiro agente (tec 2695458).
- SQL injection: entrada concatenada na consulta (tec 1175324: `"SELECT * FROM clientes WHERE clienteID='" + request.getParameter("id") + "'"`). Defesa: consultas parametrizadas, validação, menor privilégio no banco.
- XSS: script roda no navegador de outro usuário. Refletido (payload na URL volta na resposta, tec 2694701), armazenado (gravado no servidor), DOM-based ("o cliente realiza a injeção na página", tec 2695441). Defesa: codificação de saída, CSP.
- CSRF: "usuário autenticado clica em link com requisição válida; o navegador a envia, executada em seu nome" (tec 2041389). Não injeta código; abusa da sessão. Defesa: token anti-CSRF, SameSite.
- Path traversal: `../../../../etc/passwd` devolve arquivo fora do diretório (tec 2462902). Buffer overflow, XXE, SSRF, LDAP/XPath injection: só pelo nome.
- Spoofing: IP ("falsifica o endereço IP de envio", tec 3347854); ARP ("MAC do atacante associado ao IP do gateway", MITM na LAN, tec 3116429, 2695440); DNS/cache poisoning (pharming: redireciona sem clique); rogue DHCP (responde antes do legítimo, tec 3116426, 2695454); evil twin (AP falso imitando SSID, tec 3347855). Disfarce = "posar como entidade autorizada" (tec 3116417).
- Sniffing: escuta passiva; análise de tráfego (tec 2695444). MITM; SSL stripping (HTTPS com o servidor, HTTP com a vítima, tec 2695457). Replay.
- Senhas: força bruta, dicionário, credential stuffing (pares vazados), password spraying (uma senha em muitas contas), rainbow table; hydra "testa listas de login e senha contra um serviço" (tec 2695446). Criptoanálise explora o algoritmo (tec 374128).
- Engenharia social: phishing (e-mail com link para página falsa, tec 2780848); spear (alvo específico); whaling (executivo); vishing (voz); smishing (SMS); BEC; baiting ("falsas promessas, jogos grátis", tec 3347860); tailgating ("seguir membro autorizado pela porta", tec 3116437); pretexting; quid pro quo; watering hole; scareware.
- Zero-day, APT, supply chain: pelo nome.

**Como ela pergunta.** Formato E: ARP spoofing (Cesgranrio · Transpetro 2023 · tec 2695440); path traversal (Cesgranrio · AgeRIO 2023 · tec 2462902); CSRF (Cesgranrio · Eletronuclear 2022 · tec 2041389); DOM XSS (Cesgranrio · Transpetro 2023 · tec 2695441). Formato A: baiting (Cesgranrio · BANESE 2025 · tec 3347860).

**Onde ela confunde.** XSS × CSRF (injeta script × forja requisição). XSS × SQLi (navegador × banco). "XSS exige código no servidor" (só o stored). DRDoS: a origem falsificada é o ALVO (tec 374130). Spoofing × sniffing. Phishing × pharming. Spear phishing descrito como botnet.

**Macete.** Quem executa? Banco → SQLi; navegador da vítima → XSS; servidor confiando na sessão → CSRF; sistema de arquivos → path traversal; terceiros respondendo à vítima → DRDoS. Canal: e-mail → phishing; telefone → vishing; SMS → smishing; porta → tailgating; brinde → baiting; executivo → whaling.

**Questão comentada 1.** (Cesgranrio · Eletronuclear 2022 · tec 2041389) Usuário autenticado no banco clica em link de e-mail cuja URL é requisição válida; o navegador a envia e ela é executada em seu nome. Vulnerável a:
(A) SQL Injection (B) XPATH Injection (C) Buffer Overflow (D) CSRF (E) XSS.
**Gabarito: D.** A e B: injeção em consulta. C: estouro de memória. E: exigiria script injetado; aqui há só um link.

**Questão comentada 2.** (Cesgranrio · Eletronuclear 2022 · tec 2041338) Bots "se disfarçam como a vítima e enviam solicitações a nós não comprometidos, que respondem para a vítima":
(A) EDoS (B) DDoS (C) DRDoS (D) MDoS (E) BDoS.
**Gabarito: C.** Reflexão com origem = vítima. B: ataque direto. A, D, E: siglas sem esse significado.

**Para o Anki.**
- XSS × CSRF → Script injetado roda no navegador de outro usuário × requisição forjada com a sessão autenticada da vítima, sem script.
- Três tipos de XSS → Refletido (volta na resposta da URL), Armazenado (servidor), DOM-based (o cliente injeta, sem servidor).
- `../../../../etc/passwd` → Path traversal. Entrada concatenada na consulta → SQL injection (defesa: parametrização).
- DRDoS: quem está na origem dos pacotes dos zumbis? → O ALVO; servidores legítimos respondem para a vítima.
- ARP spoofing → MAC do atacante associado ao IP do gateway (e vice-versa): MITM na LAN.
- Baiting × tailgating × vishing × smishing × whaling → Isca × porta × voz × SMS × executivo.

### 9.5 Desenvolvimento seguro, SAST/DAST/IAST

**Peso.** O índice registra 8 classificações de programação segura e 2 de OWASP, nenhuma no arquivo. Precedentes: Transpetro 2023 Q38 (DAST), IPEA 2024 tec 2780486 (princípio), UNIRIO 2019 tec 1175324 (injection). Estreou na Ênfase 5 em 2023.

**O que a banca cobra.**
- SDL/SSDLC: segurança desde requisitos (treinamento, requisitos, modelagem de ameaças no projeto, revisão de código, testes, resposta). OWASP SAMM (maturidade), ASVS (requisitos). DevSecOps: segurança automatizada no pipeline (shift left).
- SAST: código-fonte SEM executar; caixa-branca; cedo; aponta a linha; falsos positivos. DAST: "análise em tempo de execução do software totalmente compilado, com todos os componentes integrados" (Q38); caixa-preta; de fora; não vê código. IAST: agente instrumentado DENTRO da aplicação em execução. SCA: dependências de terceiros com CVE. RASP: proteção embutida em runtime.
- OWASP Top 10 2021: A01 Controle de acesso quebrado; A02 Falhas criptográficas; A03 Injeção; A04 Design inseguro; A05 Configuração incorreta; A06 Componentes vulneráveis; A07 Identificação e autenticação; A08 Integridade de software e dados; A09 Registro e monitoramento; A10 SSRF. 2025: A01 Controle de acesso; A02 Configuração incorreta; A03 Falhas na cadeia de suprimentos de software (nova); A04 Criptografia; A05 Injeção; A06 Design inseguro; A07 Autenticação; A08 Integridade; A09 Registro e alerta; A10 Tratamento inadequado de condições excepcionais (nova).
- Princípios: menor privilégio, defesa em profundidade, falha segura, validação de entrada, codificação de saída, segredos fora do código, economia de mecanismo, design aberto.
- STRIDE, DREAD, PASTA, VAST são modelagem de ameaças (projeto), não teste; os três apareceram como distratores em Q38.

**Como ela pergunta.** Formato A: DAST (Cesgranrio · Transpetro 2023 · Q38); economia de mecanismo (Cesgranrio · IPEA 2024 · tec 2780486); código concatenando parâmetro → Injection (Cesgranrio · UNIRIO 2019 · tec 1175324). OWASP pelo nome da categoria: [sem precedente localizado].

**Onde ela confunde.** SAST ↔ DAST. "DAST aponta a linha" (não vê o código). SCA chamado de SAST. STRIDE/DREAD/VAST como testes. Privilégio mínimo onde se pede economia de mecanismo.

**Macete.** S de Static = parado, caixa-branca, cedo. D de Dynamic = rodando, caixa-preta, de fora. I de Interactive = agente dentro. SCA = Composition = bibliotecas. Termina em -IDE ou -EAD: modelagem, não teste.

**Questão comentada.** (Cesgranrio · Transpetro 2023 · Q38) "Teste muito utilizado é a análise em tempo de execução do software totalmente compilado, verificando funcionalidades que só podem ser testadas com todos os componentes integrados e em execução":
(A) SAST (B) DAST (C) VAST (D) DREAD (E) STRIDE.
**Gabarito: B.** A: estático, sem executar. C: modelagem Visual, Agile, Simple Threat. D: pontuação de ameaças. E: categorias de ameaça no projeto.

**Para o Anki.**
- SAST × DAST × IAST → Código sem executar, caixa-branca, aponta linha × aplicação compilada rodando, caixa-preta × agente dentro da aplicação em execução.
- SCA × RASP → Bibliotecas de terceiros × proteção embutida em runtime.
- STRIDE, DREAD, VAST, PASTA são testes? → Não: modelagem de ameaças (projeto); distratores de DAST em 2023.
- OWASP Top 10 2021 A01 e A03 → Controle de acesso quebrado; Injeção (2025: A03 virou Cadeia de suprimentos de software; injeção é A05).

### 9.6 VPN

**Peso.** 7 questões (UNEMAT 2024, Eletronuclear 2022, BASA 2021, UNIRIO 2019, Transpetro 2018 PN tec 638942, Transpetro 2018 Telecom, Liquigás 2018); 5 de IPsec descartadas. Não caiu em 2023 na Ênfase 5.

**O que a banca cobra.**
- "Enlace virtual seguro entre duas pontas, com criptografia e autenticação, sobre infraestrutura pública ou compartilhada" (tec 2041390). Tunelamento: "encapsula os pacotes da rede interna no protocolo da rede pública e desencapsula só no destino"; "pacote inteiro dentro de outro, com criptografia" (tec 638942).
- Topologias: host-to-host; host-to-gateway (acesso remoto: funcionário em casa); gateway-to-gateway (site-to-site: matriz e filial "como se estivessem na rede local", tec 2837987).
- IPsec (camada de rede; AH autentica, ESP cifra e tunela, IKE negocia chaves; é "um padrão de VPN", tec 836014) × SSL/TLS VPN (aplicação, pelo navegador, clientless). PPTP e L2TP puro: obsoletos. Split tunneling: só o tráfego corporativo pelo túnel.
- VPN protege o CANAL; não autentica na aplicação nem substitui controle de acesso. Boa prática: intranet com certificado digital e VPN para conexões externas (tec 3346039).

**Como ela pergunta.** Formato A: tunneling (Cesgranrio · Eletronuclear 2022 · tec 2041390); filial acessando a intranet → VPN (Cesgranrio · UNEMAT 2024 · tec 2837987); padrão de VPN → IPsec (Cesgranrio · Liquigás 2018 · tec 836014). Site-to-site × acesso remoto nomeados: [sem precedente localizado].

**Onde ela confunde.** VPN como distrator de proxy reverso (tec 3117538) e de proxy (tec 3117648). "VPN autentica na aplicação." Tunelamento chamado de encaminhamento. ESP × TLS (IPsec × HTTPS).

**Macete.** VPN = túnel cifrado sobre rede pública. Filial ↔ matriz = site-to-site. Casa = acesso remoto. IPsec rede; TLS aplicação.

**Questão comentada.** (Cesgranrio · Transpetro 2018 PN · tec 638942) "Técnica que permite o encapsulamento de um pacote inteiro em outro pacote na VPN host-to-gateway, de forma segura, usando criptografia":
(A) empacotamento (B) encaminhamento (C) tunelamento (D) reflexão segura (E) inundação segura.
**Gabarito: C.** A e B: termos genéricos. D e E: vocabulário de DDoS deslocado.

**Para o Anki.**
- VPN em uma frase → Túnel cifrado (encapsulamento + criptografia) sobre rede pública; protege o canal, não autentica na aplicação.
- Site-to-site × acesso remoto → Gateway-to-gateway (filial) × host-to-gateway (funcionário em casa).
- IPsec × SSL/TLS VPN → Camada de rede (AH, ESP, IKE) × aplicação, pelo navegador.

### 9.7 MDM

**Peso.** [sem precedente localizado] no caderno nem nas provas Transpetro/Petrobras. Estreia 2026; a CIO da Transpetro cita "monitoramento de dispositivos móveis" (dossiê).

**O que a banca cobra.**
- MDM (Mobile Device Management): gestão centralizada de celulares, tablets e notebooks: inventário; políticas (PIN obrigatório, cifragem, bloqueio de câmera/USB); distribuição de apps e configurações (Wi-Fi, VPN, e-mail); localização; bloqueio e apagamento remoto (wipe total ou seletivo); detecção de jailbreak/root; conformidade antes de liberar acesso.
- MAM: só os apps corporativos e seus dados (contêiner), típico de BYOD. EMM = MDM + MAM + conteúdo. UEM: todos os endpoints (desktops, IoT).
- Propriedade: BYOD (do empregado), COPE (da empresa, uso pessoal permitido), COBO (só corporativo). Contêiner separa dados corporativos dos pessoais; wipe seletivo apaga só o contêiner.
- ISO 27002:2022: controles 6.7 (trabalho remoto) e 8.1 (dispositivos endpoint).

**Como ela pergunta (previsão).** "Solução que aplica política de senha e cifragem e apaga remotamente um smartphone perdido" → MDM; distratores EDR, DLP, CASB, VPN.

**Onde ela confunde.** MDM × EDR (configura e governa × detecta e responde). MDM × MAM (dispositivo × apps). "MDM cifra o tráfego" (VPN). "MDM inspeciona dado saindo" (DLP).

**Macete.** MDM = administrador remoto do celular: política, inventário, wipe. "Dispositivo perdido / apagar remotamente" → MDM.

**Questão-modelo (autoral).** Técnicos de campo recebem smartphones; a TI precisa impor PIN e cifragem, instalar o app corporativo em todos e apagar remotamente um aparelho extraviado. A solução é um(a)
(A) EDR (B) MDM (C) CASB (D) DLP (E) WAF.
**Gabarito: B.** A: detecta ameaça, não distribui política nem apaga. C: governa SaaS. D: dado saindo. E: aplicação web.

**Para o Anki.**
- Aplica políticas, inventaria, distribui apps e apaga remotamente dispositivos móveis → MDM.
- MDM × MAM × UEM → Dispositivo inteiro × só apps corporativos (contêiner, BYOD) × todos os endpoints.
- BYOD × COPE × COBO → Do empregado × da empresa com uso pessoal × da empresa só corporativo.

### 9.8 SSO

**Peso.** 1 de SSO (Petrobras 2018 PN, tec 619550), 1 de federação (Transpetro 2018 Infra, tec 638795), 1 de SAML interno (Transpetro 2018 PN, tec 638949, descartada). Não caiu em 2023.

**O que a banca cobra.**
- SSO: "uso simultâneo de várias aplicações sem autenticações distintas em cada uma" (tec 619550). Conveniência; a credencial única vira alvo único, por isso SSO combina com MFA.
- Federação: "autoridade local aceita credenciais estrangeiras validadas por autoridade estrangeira" entre organizações com relação de confiança (tec 638795). IdP autentica; SP confia na asserção.
- Em uma linha: SAML 2.0 = SSO federado por XML (asserções), corporativo. OAuth 2.0 = AUTORIZAÇÃO delegada por tokens; não autentica. OpenID Connect = AUTENTICAÇÃO sobre o OAuth (ID token JWT), login social. Kerberos = SSO por tíquetes no AD (KDC, TGT). LDAP = diretório, não é SSO.
- SSO reduz logins; MFA aumenta fatores: opostos em propósito, complementares.

**Como ela pergunta.** Formato A: SSO contra siglas inventadas e OTP (Cesgranrio · Petrobras 2018 PN · tec 619550); federação de identidades (Cesgranrio · Transpetro 2018 Infra · tec 638795). OAuth × OIDC × SAML: [sem precedente localizado].

**Onde ela confunde.** OTP como SSO. OAuth como autenticação. "SSO aumenta a segurança" (aumenta a conveniência). Delegação (um app age em nome do usuário) × federação (confiança entre autoridades).

**Macete.** SSO = single, um login. Cruza empresas = federação. SAML fala XML; OAuth autoriza; OIDC autentica sobre OAuth; Kerberos tíquete.

**Questão comentada.** (Cesgranrio · Petrobras 2018 PN · tec 619550) Infraestrutura para usar muitas aplicações "sem que o usuário tenha de fazer autenticações distintas em cada uma":
(A) ULC (B) Single Sign-On (SSO) (C) One-Time Password (OTP) (D) OTT (E) UAD.
**Gabarito: B.** A, D, E: inventadas. C: senha descartável de MFA, não elimina logins.

**Para o Anki.**
- Uma autenticação para várias aplicações → SSO (conveniência; combine com MFA).
- Autoridade local aceita credenciais validadas por outra organização → Federação de identidades (IdP × SP).
- OAuth 2.0 × OpenID Connect × SAML → Autorização por tokens × autenticação sobre OAuth (JWT) × SSO federado em XML.

### 9.9 MFA

**Peso.** Biometria (CNU 2024, tec 3038222); posse da chave privada como "algo que possui" (Transpetro 2023 Ênfase 7, tec 2695542); RBAC não substitui MFA (BNDES 2024, tec 3117533). "São fatores de autenticação": [sem precedente localizado] como pergunta direta.

**O que a banca cobra.**
- Fatores: SABE (senha, PIN, pergunta secreta); TEM (token, cartão, celular com OTP, certificado em smartcard: "algo que o usuário possui, como um certificado digital", tec 2695542); É (biometria: "características físicas únicas, impressões digitais, reconhecimento facial", tec 3038222). Extras: onde está, o que faz.
- MFA exige categorias DIFERENTES: senha + pergunta secreta não é; senha + token é. 2FA = dois.
- Mecanismos: OTP por SMS (SIM swap), TOTP (tempo), HOTP (contador), push (fadiga de MFA), FIDO2/WebAuthn e passkeys (anti-phishing), smartcard (prova de posse da chave privada).
- Autenticação (quem) antes de autorização (o quê): RBAC vem depois (tec 3117533). Senha única sofre força bruta (tec 2695446).

**Como ela pergunta.** Afirmativa correta → biometria (Cesgranrio · CNU 2024 · tec 3038222); "verificar se o usuário tem a posse da" → chave privada par da pública do certificado (Cesgranrio · Transpetro 2023 · tec 2695542).

**Onde ela confunde.** "Senha + pergunta é MFA." Biometria como "sabe". Certificado como "sabe". Senha "simples e segura". DAC descrito corretamente para distrair (tec 3038222).

**Macete.** Categoria de cada fator: iguais → não é MFA. Sabe / tem / é = cabeça / bolso / corpo.

**Questão comentada.** (Cesgranrio · Transpetro 2023 · tec 2695542) Validado o certificado digital enviado, o sistema deve verificar se o usuário tem a posse da
(A) chave pública par da privada do certificado. (B) chave privada par da pública que consta do certificado. (C) assinatura gerada pela chave pública do certificado. (D) assinatura gerada pela chave privada que consta do certificado. (E) assinatura gerada pela chave pública fornecida pelo sistema.
**Gabarito: B.** O certificado leva a pública; a posse se prova com a privada. A, D: a privada nunca consta do certificado. C, E: não se assina com pública.

**Para o Anki.**
- Três fatores → SABE (senha, PIN) · TEM (token, celular, certificado) · É (biometria).
- Senha + pergunta secreta é MFA? → Não: mesma categoria. MFA exige categorias diferentes.
- Certificado como fator prova o quê? → Posse da chave PRIVADA par da pública do certificado.
- SSO × MFA → Menos logins × mais fatores; complementares.

### 9.10 Gestão de identidade e acesso (autenticação, autorização, auditoria), RBAC e ABAC

**Peso.** 9 de controle de acesso lógico (3,8%) + Transpetro 2023 Q39 (ABAC, tec 2695298, Ênfase 5), BANESE 2025 tec 3347058 (RBAC), BNDES 2024 tec 3117533, UNIRIO 2016 tec 374127.

**O que a banca cobra.**
- IAM: ciclo de vida da identidade: provisionamento, autenticação, autorização, revisão/recertificação, desprovisionamento. IGA (governança), PAM (contas privilegiadas: cofre, sessão gravada, just-in-time).
- AAA: autenticação (quem), autorização (o quê), auditoria/accounting (o que fez, em log). "Controle de acesso requer prévia autenticação" (tec 374127).
- Modelos: DAC (dono decide e pode repassar); MAC (rótulos impostos pelo sistema, clearance ≥ classificação; militar); RBAC ("funções com permissões predefinidas atribuídas aos usuários, controle centralizado", tec 3347058); ABAC ("combinação de atributos: localização, recurso, contexto, condições ambientais, avaliados contra políticas", Q39); ACL = lista anexada ao objeto (estrutura, não modelo).
- Princípios: menor privilégio, need-to-know, segregação de funções ("reduz fraude, erro e desvio", tec 2690869), direitos de acesso privilegiado (tec 2695476), revisão periódica. NIST SP 800-63: IAL/AAL/FAL. Zero trust: verificar sempre identidade, dispositivo e contexto.

**Como ela pergunta.** Formato A: ABAC (Cesgranrio · Transpetro 2023 · Q39); RBAC (Cesgranrio · BANESE 2025 · tec 3347058). Formato F: RBAC × autenticação (Cesgranrio · BNDES 2024 · tec 3117533).

**Onde ela confunde.** RBAC como distrator de ABAC. DAC × MAC. ACL como modelo. "RBAC lida com autenticação" (autorização). "Permissões por localização e horário" na questão de RBAC (é ABAC, tec 3347058 alternativa D).

**Macete.** Substantivo que concede: papel/cargo → RBAC; atributo/contexto/horário/local → ABAC; dono → DAC; rótulo → MAC; lista no objeto → ACL. Quem é → autenticação; o que pode → autorização; o que fez → auditoria.

**Questão comentada 1.** (Cesgranrio · Transpetro 2023 · Q39, tec 2695298) Permissões "com base em combinação de atributos: localização, recurso, contexto da requisição e condições ambientais, em relação a políticas e regras". A abordagem é
(A) ABAC (B) RBAC (C) DAC (D) MAC (E) ACL.
**Gabarito: A.** B: papel fixo. C: dono decide. D: rótulos obrigatórios. E: lista por objeto.

**Questão comentada 2.** (Cesgranrio · BNDES 2024 · tec 3117533) MFA junto com RBAC; o RBAC
(A) atribuirá permissões por funções sem considerar a identidade, enquanto a autenticação atribuirá permissões. (B) lidará exclusivamente com autenticação. (C) determinará as permissões com base nos papéis, enquanto a autenticação verificará a identidade antes de atribuir os papéis. (D) será independente da autenticação. (E) substituirá a MFA.
**Gabarito: C.** A: autenticação não atribui permissões. B: RBAC é autorização. D: dependem um do outro. E: autorização não substitui autenticação.

**Para o Anki.**
- Papel/cargo × atributos e contexto → RBAC × ABAC.
- DAC × MAC → Dono decide (e repassa) × sistema decide por rótulo obrigatório.
- AAA → Autenticação (quem) · Autorização (o quê) · Auditoria (o que fez).
- ACL é modelo de controle de acesso? → Não: lista de permissões anexada ao objeto; distrator.
- PAM → Contas privilegiadas: cofre de senhas, sessão gravada, acesso just-in-time.

### 9.11 Gerenciamento de resposta a incidente (NIST SP 800-61)

**Peso.** Transpetro 2023 Q42 (Ênfase 5) e IPEA 2024 tec 2780872 (fase). O índice registra 5 classificações de incidentes/CSIRT/SIEM ausentes do arquivo. O vizinho NIST CSF caiu em IPEA 2024 (tec 2780863).

**O que a banca cobra.**
- NIST SP 800-61 (Computer Security Incident Handling Guide): QUATRO fases: (1) Preparação; (2) Detecção e Análise ("determinar se um incidente aconteceu, a partir de precursores e indicadores e de informações correlacionadas", tec 2780872); (3) Contenção, Erradicação e Recuperação (uma fase só); (4) Atividade Pós-Incidente (lições aprendidas, evidências, métricas). Ciclo, "não uma atividade linear" (Q42).
- Evento (ocorrência observável) × incidente (violação ou ameaça iminente de violação de política). Precursor (pode ocorrer) × indicador (ocorreu). Contenção → erradicação (causa) → recuperação (restaurar e monitorar). Priorização por impacto funcional, informacional e recuperabilidade.
- CSIRT/CERT (equipe de resposta; CERT.br); SOC. Comunicação à direção, à ANPD (LGPD; 3 dias úteis pelo regulamento da ANPD) e a clientes.
- Revisão 3 (2025): guia reorganizado pelas seis funções do CSF 2.0 (Govern, Identify, Protect, Detect, Respond, Recover); as quatro fases seguem sendo o que a banca cobrou.
- Vizinhos: 800-30 risco; 800-34 contingência; 800-53 controles; 800-82 OT; 800-63 identidade; 800-115 testes; 800-207 zero trust. ISO 27035 incidentes; 27033 redes; 27034 aplicações. CSF 1.1: Identificar ("compreensão organizacional para gerenciar o risco", tec 2780863), Proteger, Detectar, Responder, Recuperar; 2.0 soma Governar.

**Como ela pergunta.** Formato C: "ciclo de vida de resposta a incidentes está definido na publicação" → 800-61 (Cesgranrio · Transpetro 2023 · Q42). Formato D: fase pela descrição (Cesgranrio · IPEA 2024 · tec 2780872). Função do CSF pela descrição (Cesgranrio · IPEA 2024 · tec 2780863).

**Onde ela confunde.** Contenção, erradicação e recuperação como fases separadas (são uma). Misturar com as funções do CSF. 800-30 e 800-34 vizinhos. "Termina na recuperação" (o pós-incidente fecha o ciclo).

**Macete.** 800-61 = 4: Prepara, Detecta e analisa, Contém-erradica-recupera (juntas), Pós. "Lições aprendidas" = fase 4. "Precursores e indicadores" = fase 2. Sessenta e um = incidente.

**Questão comentada 1.** (Cesgranrio · Transpetro 2023 · Q42) "Um Ciclo de Vida de Resposta a Incidentes está definido na publicação do"
(A) NIST SP 800-30 (B) NIST SP 800-34 (C) NIST SP 800-61 (D) ISO 27033-5 (E) ISO 27034-1.
**Gabarito: C.** A: riscos. B: contingência. D: redes. E: aplicações.

**Questão comentada 2.** (Cesgranrio · IPEA 2024 · tec 2780872) Fase "encarregada de determinar se um incidente aconteceu, a partir da análise de precursores e indicadores e da procura de informações correlacionadas":
(A) contenção (B) erradicação (C) preparação (D) recuperação (E) detecção e análise.
**Gabarito: E.** A, B, D: partes da fase 3, após confirmação. C: fase 1, antes de qualquer sinal.

**Para o Anki.**
- As 4 fases do NIST SP 800-61 → 1 Preparação · 2 Detecção e Análise · 3 Contenção, Erradicação e Recuperação (juntas) · 4 Atividade Pós-Incidente. Ciclo.
- Fase que analisa precursores e indicadores → Detecção e Análise. "Lições aprendidas" → Pós-Incidente.
- NIST 800-30 / 800-34 / 800-53 / 800-61 / 800-82 → Risco / contingência / controles / incidentes / ICS-OT.
- 800-61 × NIST CSF → 4 fases de incidente × 5 funções (Identificar, Proteger, Detectar, Responder, Recuperar; 2.0 soma Governar).
- Evento × incidente → Ocorrência observável × violação (ou ameaça iminente) de política.

### 9.12 Threat intel, threat hunting

**Peso.** [sem precedente localizado] em todo o acervo Cesgranrio. Estreia 2026; a ISO 27002:2022 trouxe "inteligência de ameaças" como controle novo (5.7).

**O que a banca cobra.**
- Threat intelligence: coletar, processar, analisar e disseminar conhecimento sobre ameaças (atores, motivações, TTPs, indicadores). Ciclo: direção, coleta, processamento, análise, disseminação, feedback. Níveis: estratégica (tendências, direção), tática (TTPs, SOC), operacional (campanhas iminentes), técnica (IoCs para ferramentas). Fontes: OSINT, feeds, ISACs, CERT.br. Formatos: STIX (descrição) e TAXII (transporte). Plataforma: MISP/TIP.
- IoC (indicador de comprometimento: já ocorreu; hash, IP, domínio) × IoA (ataque em andamento: comportamento). Pirâmide da dor: hash → IP → domínio → artefatos → ferramentas → TTPs.
- Threat hunting: busca PROATIVA, por hipótese, de adversários já presentes e não detectados pelos alertas; "assume breach"; usa ATT&CK para formular hipóteses; ciclo hipótese → investigação (SIEM, EDR) → descoberta → nova detecção automatizada. Diferente de resposta a incidente (reativa) e de monitoramento (passivo).
- Honeypot: isca para observar e enganar, não bloqueia. Sandbox: executa amostra isolada.

**Como ela pergunta (previsão).** "Atividade proativa, por hipótese, que busca adversários já na rede sem alerta" → hunting; "hash, IP e domínio de C&C" → IoC; "controle 5.7 da 27002:2022" → inteligência de ameaças; "formato para compartilhar inteligência" → STIX/TAXII.

**Onde ela confunde.** Hunting como resposta a alerta. Intel como bloqueio. IoC × IoA. Honeypot como bloqueio.

**Macete.** Intelligence = conhecer a ameaça (insumo). Hunting = caçar o invasor que já entrou, por hipótese, sem alerta; "assume que foi invadido".

**Questão-modelo (autoral).** Sem alerta do SIEM, a equipe formula a hipótese de persistência via tarefas agendadas em servidores de supervisão e examina proativamente logs e telemetria para confirmá-la. A atividade é
(A) resposta a incidente (B) threat hunting (C) análise de vulnerabilidades (D) threat intelligence (E) pentest.
**Gabarito: B.** A: reativa a alerta. C: procura falhas, não adversários presentes. D: produz o conhecimento que alimenta a caça. E: ataque simulado autorizado.

**Para o Anki.**
- Threat intelligence × threat hunting → Conhecimento sobre ameaças (TTPs, IoCs), insumo × busca proativa, por hipótese, de invasor já presente, sem alerta.
- IoC × IoA → Já comprometido (hash, IP, domínio) × ataque em andamento (comportamento).
- STIX × TAXII → Formato para descrever inteligência × protocolo para transportá-la.
- Honeypot → Isca para observar e enganar o atacante; não bloqueia.

### 9.13 Testes de penetração

**Peso.** [sem precedente localizado] como pergunta direta; 1 classificação no índice, ausente do arquivo. Ferramentas aparecem como alternativas na Ênfase 7 (hydra tec 2695446; setoolkit/burp/msfvenom tec 2695447).

**O que a banca cobra.**
- Pentest: ataque simulado AUTORIZADO que EXPLORA vulnerabilidades para comprovar impacto. Varredura de vulnerabilidades: apenas IDENTIFICA e lista, automaticamente (Nessus, OpenVAS). Análise de vulnerabilidades: scan + validação manual, sem explorar.
- Conhecimento prévio: caixa-preta (nenhum; "teste cego"; atacante externo), caixa-branca (código, arquitetura, credenciais; mais profundo), caixa-cinza (parcial). Posição: externo × interno.
- Fases: pré-engajamento (escopo, regras, autorização escrita), reconhecimento (OSINT), varredura/enumeração, análise de vulnerabilidades, exploração, pós-exploração (escalada, movimento lateral, evidências), relatório. Metodologias pelo nome: PTES, OSSTMM, OWASP Testing Guide, NIST SP 800-115.
- Ferramentas pela função: nmap (portas), Nessus/OpenVAS (vulnerabilidades), Metasploit (exploração), Burp/ZAP (web), hydra (força bruta de login), Wireshark (sniffer), setoolkit (engenharia social).
- Red team (adversário simulado, contínuo, testa a DETECÇÃO) × blue team (defesa) × purple (colaboração). Bug bounty.

**Como ela pergunta (previsão).** "Avaliador sem informação prévia" → caixa-preta; "varredura × pentest" → identifica × explora; "escalada e movimento lateral" → pós-exploração; "varredura de portas" → nmap.

**Onde ela confunde.** Scanner chamado de pentest. Caixas invertidas. Red team = pentest (contínuo × pontual). Pentest sem autorização. DAST (automatizado, aplicação) × pentest (pessoa, ambiente).

**Macete.** EXPLORAR/COMPROVAR: lista → scanner; invade → pentest. Preta = cego; branca = tudo; cinza = parcial.

**Questão-modelo (autoral).** A equipe contratada recebe apenas o nome da organização, sem endereços, credenciais ou código, e simula atacante externo. O teste é de caixa
(A) branca (B) cinza (C) preta (D) aberta (E) fechada.
**Gabarito: C.** A: conhecimento total. B: parcial. D, E: termos inexistentes.

**Para o Anki.**
- Varredura de vulnerabilidades × pentest → Identifica e lista (automático) × explora e comprova (autorizado).
- Caixa-preta × cinza × branca → Nenhum conhecimento × parcial × total.
- Fases do pentest → Autorização → reconhecimento → varredura → análise de vulnerabilidades → exploração → pós-exploração → relatório.
- Pentest × red team → Pontual e escopado × contínuo, testa a detecção do blue team.
- nmap × Nessus × Metasploit × Burp → Portas × vulnerabilidades × exploração × aplicação web.

### 9.14 Modelagem de ameaças (STRIDE etc.)

**Peso.** [sem precedente localizado] como pergunta direta. STRIDE, DREAD e VAST foram distratores de DAST na Transpetro 2023 Q38: a banca conhece os nomes.

**O que a banca cobra.**
- Modelagem de ameaças: atividade de PROJETO (design do SDL): diagrama de fluxo de dados com fronteiras de confiança → ameaças por elemento → classificação/pontuação → mitigações. Quatro perguntas: o que construímos, o que pode dar errado, o que fazer, fizemos bem.
- STRIDE (Microsoft), pares fixos: Spoofing → Autenticidade; Tampering → Integridade; Repudiation → Não repúdio; Information Disclosure → Confidencialidade; Denial of Service → Disponibilidade; Elevation of Privilege → Autorização.
- DREAD: pontuação por Damage, Reproducibility, Exploitability, Affected users, Discoverability. PASTA: sete estágios, centrado no risco de negócio e em simulação de ataque. VAST: visual, ágil, escala corporativa. Árvores de ataque. LINDDUN (privacidade). OCTAVE (risco organizacional).
- STRIDE × ATT&CK: design × comportamento observado. STRIDE × CVSS: categoria de ameaça × nota de vulnerabilidade.

**Como ela pergunta (previsão).** "No STRIDE, Tampering viola" → integridade; "categoria que viola a disponibilidade" → DoS; "modelo que pontua dano, reprodutibilidade…" → DREAD; "em que fase se usa" → projeto.

**Onde ela confunde.** Spoofing com integridade (autenticidade). Repudiation com integridade (não repúdio). Elevation com autenticidade (autorização). STRIDE como resposta a incidente ou teste. DREAD como categorias (é pontuação).

**Macete.** Coluna da direita na ordem do nome: S-T-R-I-D-E = Autenticidade, Integridade, Não repúdio, Confidencialidade, Disponibilidade, Autorização. Spoofing engana quem; Tampering mexe no quê; Elevation sobe o que pode.

**Questão-modelo (autoral).** A ameaça de um operador negar depois ter emitido um comando de fechamento de válvula pertence, no STRIDE, à categoria
(A) Spoofing (B) Tampering (C) Repudiation (D) Information Disclosure (E) Elevation of Privilege.
**Gabarito: C.** Negar ter feito = repúdio; mitigação: assinatura digital e log confiável. A: fingir ser outro. B: alterar dado. D: vazar. E: ganhar permissão indevida.

**Para o Anki.**
- STRIDE → propriedade → S Spoofing → Autenticidade · T Tampering → Integridade · R Repudiation → Não repúdio · I Information Disclosure → Confidencialidade · D Denial of Service → Disponibilidade · E Elevation of Privilege → Autorização.
- DREAD → Pontuação: Damage, Reproducibility, Exploitability, Affected users, Discoverability.
- PASTA × VAST → Simulação de ataque centrada no risco de negócio, 7 estágios × modelagem visual e ágil em escala.
- Fase da modelagem de ameaças → Projeto/design, a partir do DFD com fronteiras de confiança.

### 9.15 Táticas do framework MITRE ATT&CK

**Peso.** Transpetro 2023 Q40 (Ênfase 5). O índice registra 7 classificações de ATT&CK ausentes do arquivo. A lista decorada decide.

**O que a banca cobra.**
- ATT&CK (Adversarial Tactics, Techniques and Common Knowledge, MITRE): base de conhecimento de táticas e técnicas observadas no mundo real; matrizes Enterprise (Windows, Linux, macOS, nuvem, rede, contêineres), Mobile e ICS.
- Tática = o PORQUÊ (objetivo da etapa). Técnica = o COMO (ID Txxxx; subtécnicas Txxxx.yyy). Procedimento = implementação por grupo (Gxxxx) ou software (Sxxxx). Mitigações (Mxxxx).
- 14 táticas Enterprise na ordem: 1 Reconhecimento; 2 Desenvolvimento de recursos; 3 Acesso inicial; 4 Execução; 5 Persistência; 6 Escalada de privilégio; 7 Evasão de defesa; 8 Acesso a credenciais; 9 Descoberta; 10 Movimento lateral; 11 Coleta; 12 Comando e controle; 13 Exfiltração; 14 Impacto.
- Técnicas-exemplo (os distratores de Q40): verificação de vulnerabilidade (Reconhecimento), comunicação entre processos (Execução), manipulação de conta (Persistência), evasão do depurador (Evasão de defesa); phishing (Acesso inicial); dumping de credenciais (Acesso a credenciais); serviços remotos (Movimento lateral); dados cifrados para impacto (Impacto).
- Usos: mapear detecções, hunting, emulação de adversário, cobertura de controles.
- Vizinhos: Cyber Kill Chain (Lockheed Martin), 7 fases SEQUENCIAIS: reconhecimento, armamento, entrega, exploração, instalação, comando e controle, ações no objetivo; ATT&CK é matriz não sequencial. MITRE CAPEC (padrões de ataque), D3FEND (contramedidas), CVE (vulnerabilidades).

**Como ela pergunta.** Cinco itens, quatro técnicas e uma tática: "acesso à credencial" (Cesgranrio · Transpetro 2023 · Q40). Previsão: "organiza o conhecimento em" → táticas, técnicas e procedimentos; "7 fases sequenciais" → Kill Chain.

**Onde ela confunde.** Técnica como tática (Q40). ATT&CK como lista de vulnerabilidades (CVE). ATT&CK como sequência (Kill Chain). "Armamento" e "entrega" como táticas ATT&CK (são Kill Chain).

**Macete.** Tática cabe em "o adversário está tentando ___" (reconhecer, preparar, entrar, executar, persistir, escalar, evadir, obter credenciais, descobrir, mover-se, coletar, comandar, exfiltrar, impactar). Procedimento concreto ("manipulação de conta") = técnica.

**Questão comentada.** (Cesgranrio · Transpetro 2023 · Q40) "Dentre as táticas adversárias listadas na MITRE ATT&CK, está a(o)"
(A) verificação de vulnerabilidade (B) comunicação entre processos (C) manipulação de conta (D) evasão do depurador (E) acesso à credencial.
**Gabarito: E.** A: técnica de Reconhecimento. B: técnica de Execução. C: técnica de Persistência. D: subtécnica de Evasão de defesa.

**Para o Anki.**
- Tática × técnica × procedimento → Porquê (objetivo) × como (ação, Txxxx) × implementação específica de um grupo.
- As 14 táticas ATT&CK Enterprise → Reconhecimento · Desenvolvimento de recursos · Acesso inicial · Execução · Persistência · Escalada de privilégio · Evasão de defesa · Acesso a credenciais · Descoberta · Movimento lateral · Coleta · Comando e controle · Exfiltração · Impacto.
- "Manipulação de conta", "evasão do depurador", "verificação de vulnerabilidade" → Técnicas (Persistência, Evasão de defesa, Reconhecimento); a tática da questão: Acesso a credenciais.
- ATT&CK × Cyber Kill Chain → Matriz não sequencial × 7 fases em ordem (reconhecimento, armamento, entrega, exploração, instalação, C2, ações no objetivo).
- Matrizes do ATT&CK → Enterprise, Mobile, ICS.

### 9.16 Gestão de riscos (ISO 31000), continuidade (ISO 22301) e Sarbanes-Oxley

**Peso.** Continuidade: 6 (BNDES 2024 ×2, AgeRIO 2023, Transpetro 2023 Infra, Eletronuclear 2022, IBGE 2016). Riscos: 8, todas pela 27005 (IPEA 2024 ×3, BNDES 2024, Transpetro 2023 Ênfase 7 ×2, Eletronuclear 2022 ×2). ISO 31000 direta e SOX: [sem precedente localizado]. Nada na Ênfase 5 em 2023.

**O que a banca cobra.**
- ISO 31000:2018: diretrizes genéricas de gestão de riscos, qualquer organização e risco; NÃO certificável. Risco = "efeito da incerteza nos objetivos". Princípios + estrutura (liderança; integração, concepção, implementação, avaliação, melhoria) + processo: comunicação e consulta; escopo, contexto e critérios; avaliação de riscos = identificação → análise → avaliação (tec 2041481 pela 27005); tratamento; monitoramento; registro e relato. Apetite × tolerância; inerente × residual.
- ISO 27005 (riscos de SI): opções = modificação ("incluir, excluir ou alterar controles para reavaliar o residual", tec 2780875), retenção, ação de evitar, compartilhamento (tec 2041503); qualitativa (escalas pequena/média/grande) × quantitativa (tec 2695478); vulnerabilidade = "fraqueza de um ativo ou controle que pode ser explorada" (tec 3116400); ameaça = causa potencial de incidente.
- ISO 22301:2019: REQUISITOS do SGCN, certificável. 22313: diretrizes, "seis elementos" (tec 3116403). 27031: prontidão de TIC. Termos: continuidade = "capacidade de continuar a entrega em nível aceitável durante disrupção" (tec 2041480); PCN = "informação documentada que orienta a responder, retomar, recuperar e restaurar" (tec 2462904); BIA = "processo documentado de analisar o impacto de uma disrupção ao longo do tempo"; "BIA e avaliação de riscos" é o elemento que fornece parâmetros para as estratégias (tec 3116403). Do BIA saem RTO, RPO, MTPD, MBCO. PCN (negócio) × PRD (recuperar a TI) × plano de crise. Benefícios na redação da norma: negócio → "contribui para a resiliência organizacional" (tec 2694692); processos internos → "permanecer eficaz durante disrupções" (tec 3116414); financeiro → reduz exposição legal e financeira; partes interessadas → reputação.
- Sarbanes-Oxley (SOX, EUA, 2002, pós-Enron): governança e CONTROLES INTERNOS SOBRE RELATÓRIOS FINANCEIROS de listadas em bolsa americana e controladas; criou o PCAOB. Seção 302: CEO e CFO certificam os relatórios. Seção 404: a administração avalia e reporta a eficácia dos controles internos, com atestação do auditor. 409: divulgação em tempo real; 802/906: penas criminais. Framework COSO; em TI, COBIT e ITGC (acesso lógico, mudanças, operações, desenvolvimento), segregação de funções, trilhas de auditoria. Petrobras é listada na NYSE; a Transpetro, controlada, é certificada SOx: daí controle de acesso, SoD e log nos sistemas financeiros.

**Como ela pergunta.** Formato G: definições da 22301 (Cesgranrio · AgeRIO 2023 · tec 2462904; Eletronuclear 2022 · tec 2041480); benefício por perspectiva (Cesgranrio · Transpetro 2023 Infra · tec 2694692); elemento da 22313 (Cesgranrio · BNDES 2024 · tec 3116403). Formato D na 27005: opção pela descrição (Cesgranrio · IPEA 2024 · tec 2780875); as quatro opções (Cesgranrio · Eletronuclear 2022 · tec 2041503); ordem (tec 2041481). Previsão: "diretrizes genéricas de risco, não certificável" → 31000; "lei dos EUA de 2002, seções 302 e 404" → SOX.

**Onde ela confunde.** 31000 × 27005. 22301 × 22313 × 27031. Plano (documento) × continuidade (capacidade) × BIA (processo) × política × sistema de gestão (as cinco aparecem juntas em tec 2462904 e 2041480). Tratamento dentro da avaliação de riscos (vem depois). SOX como lei de privacidade ou norma de TI. "Risco é probabilidade de perda" (é efeito da incerteza).

**Macete.** 31000 = risco geral; 27005 = risco de SI; 22301 = continuidade (requisitos); 22313 = diretrizes; 27031 = TIC; SOX = fraude contábil, 2002, 302 e 404. BIA responde "quanto tempo aguento parado e quanto dado posso perder" (RTO, RPO). PCN é do negócio; PRD é da TI.

**Questão comentada 1.** (Cesgranrio · AgeRIO 2023 · tec 2462904) Na ISO 22301, plano de continuidade de negócios é
(A) lista de intenções e direções expressas pela alta direção. (B) conjunto de elementos inter-relacionados para estabelecer políticas, objetivos e processos. (C) lista de eventos que podem levar à disrupção. (D) processo documentado de analisar o impacto de uma disrupção ao longo do tempo. (E) informação documentada que orienta a organização a responder a uma disrupção e retomar, recuperar e restaurar a entrega de produtos e serviços.
**Gabarito: E.** A: política. B: sistema de gestão. C: não é termo da norma. D: BIA.

**Questão comentada 2.** (Cesgranrio · Eletronuclear 2022 · tec 2041503) Opções de tratamento do risco na 27005:
(A) modificação, retenção, ação de evitar e compartilhamento. (B) modificação, retenção e evitar, apenas. (C) modificação, evitar e compartilhamento, apenas. (D) retenção, evitar e compartilhamento, apenas. (E) retenção e evitar, apenas.
**Gabarito: A.** As quatro, não excludentes; B a E suprimem ao menos uma com o "apenas".

**Para o Anki.**
- Risco (ISO 31000) → "Efeito da incerteza nos objetivos"; norma genérica, não certificável.
- Processo de avaliação de riscos na ordem → Identificação → análise → avaliação; tratamento vem depois.
- 4 opções de tratamento (27005) → Modificação · retenção · ação de evitar · compartilhamento.
- ISO 22301 × 22313 × 27031 → Requisitos do SGCN (certificável) × diretrizes × prontidão de TIC.
- BIA → Analisa o impacto de uma disrupção ao longo do tempo; gera RTO, RPO, MTPD, MBCO.
- PCN × PRD → Plano do negócio (responder, retomar, recuperar) × recuperação de desastres da TI.
- Sarbanes-Oxley → EUA, 2002, controles internos sobre relatórios financeiros; 302 (executivos certificam) e 404 (avaliação dos controles); Transpetro certificada por ser controlada de listada na NYSE; TI entra pelos ITGC.

### 9.17 Políticas de segurança da informação

**Peso.** 2 de PSI (BNDES 2024 tec 3116485; Liquigás 2018 tec 835980) + 7 de organização da segurança pela 27002 (Transpetro 2023 PTNM tec 2690869; Transpetro 2023 Ênfase 7 tec 2695476, 2695477; Liquigás 2018 tec 835982; Transpetro 2018 PN tec 638940) + 2 de RH (tec 2695480, 3116487).

**O que a banca cobra.**
- PSI: alto nível (o quê, não o como); "espelha as decisões da empresa sobre manipulação e proteção da informação"; "definida, aprovada pela direção, publicada e comunicada a todos os funcionários e partes externas relevantes" (tec 835980); analisada criticamente a intervalos planejados. Na 27002:2022, controle 5.1, com políticas específicas por tema.
- Hierarquia: política (diretrizes, alta direção) → normas (regras obrigatórias: senhas, uso aceitável, classificação, backup, acesso remoto, mesa e tela limpas, dispositivos móveis) → procedimentos (passo a passo).
- Controles que a banca extrai: segregação de funções "reduz fraude, erro e desvio de controles" (tec 2690869); acesso "restrito às redes e aos serviços especificamente autorizados" (tec 835982); controle de acesso à rede com "autenticação de usuários remotos" (tec 638940); RH "antes, durante e no encerramento ou mudança da contratação" (tec 2695480); análise crítica da SI "assegura que a segurança está implementada conforme políticas e procedimentos" (tec 2695477); direitos de acesso privilegiado (tec 2695476).

**Como ela pergunta.** Público da PSI (Cesgranrio · Liquigás 2018 · tec 835980); propósito da segregação (Cesgranrio · Transpetro 2023 · tec 2690869); acesso a redes (Cesgranrio · Liquigás 2018 · tec 835982); RH (Cesgranrio · Transpetro 2023 · tec 2695480). Diretrizes × normas × procedimentos: [sem precedente localizado].

**Onde ela confunde.** "Apenas diretores/gerentes." "Irrestrito às redes, restrito aos serviços." "Apenas" nos controles de RH. PSI aprovada pela TI. PSI como documento técnico detalhado.

**Macete.** PSI = alta direção aprova, todos recebem, revisão periódica, alto nível. "Apenas" em abrangência: desconfie. Política diz o quê; norma a regra; procedimento o como.

**Questão comentada.** (Cesgranrio · Transpetro 2023 · tec 2690869) Propósito da segregação de funções segundo a 27002:
(A) Assegurar a adequação contínua da direção de gestão. (B) Assegurar o fluxo adequado de informações de segurança. (C) Conscientizar funcionários. (D) Estabelecer estrutura aprovada para a gestão de segurança. (E) Reduzir o risco de fraude, erro e desvio de controles de segurança da informação.
**Gabarito: E.** A: análise crítica pela direção. B: contato com autoridades. C: conscientização. D: organização interna.

**Para o Anki.**
- PSI: quem aprova, para quem, revisão → Alta direção; todos os funcionários e partes externas relevantes; intervalos planejados.
- Política × norma × procedimento → O quê (diretrizes) × regras obrigatórias por tema × passo a passo.
- Propósito da segregação de funções → Reduzir fraude, erro e desvio de controles.
- Acesso a redes e serviços (27002) → Restrito ao especificamente autorizado. RH: antes, durante e no encerramento.

### 9.18 Classificação de informações

**Peso.** 4 (Transpetro 2018 PN tec 638939; Liquigás 2018 tec 835978; Petrobras 2018 PN tec 619548; Eletronuclear 2022 tec 2041498) + Petrobras 2015 na planilha (sem ID). Tema da ênfase em 2018.

**O que a banca cobra.**
- Objetivo: "assegurar nível adequado de proteção conforme a importância"; classificar "para indicar necessidade, prioridades e grau de proteção".
- "Processo de decisão de negócios, requer o papel ativo do setor gerencial para determinar o que é confidencial, de uso interno ou público" (tec 638939). Quem classifica: o proprietário/dono (negócio), não TI, segurança ou terceiros.
- "Para todas as informações, independentemente de mídia e de estarem assinadas" (tec 835978).
- Diretrizes da 27002: rotular "informações e saídas dos sistemas segundo valor e sensibilidade" (tec 619548); revisar ao longo do ciclo de vida; não manter rótulos de outras organizações automaticamente; tratamento proporcional ao nível.
- Critérios: confidencialidade, criticidade e prazo de retenção (Petrobras 2015, planilha). Níveis típicos: pública, interna, confidencial, secreta. LAI 12.527/2011: ultrassecreta 25 anos, secreta 15, reservada 5. ABNT NBR 16167: "diretrizes para classificação, rotulação, tratamento e gestão da informação" (tec 2041498). 27002:2022: controles 5.12, 5.13.

**Como ela pergunta.** Natureza do processo (Cesgranrio · Transpetro 2018 PN · tec 638939); abrangência (Cesgranrio · Liquigás 2018 · tec 835978); diretriz de rotulagem (Cesgranrio · Petrobras 2018 PN · tec 619548); norma ABNT (Cesgranrio · Eletronuclear 2022 · tec 2041498); critérios (Cesgranrio · Petrobras 2015 · planilha).

**Onde ela confunde.** Classificação pela TI, pela segurança, pela segurança física ou por empresa externa (tec 638939, A a D). Só mídia digital ou só assinados. "Manter rótulos de outras organizações" (tec 619548, C). Trios organizacionais ("área, nível hierárquico, autorização") no lugar de atributos da informação.

**Macete.** Quem classifica é o DONO (negócio). Vale para TUDO. Rótulo por VALOR e SENSIBILIDADE. Nos critérios, procure RETENÇÃO. Norma ABNT: 16167.

**Questão comentada.** (Cesgranrio · Transpetro 2018 PN · tec 638939) O processo de classificação da informação é
(A) executado pelo coordenador de TI. (B) executado por empresa externa. (C) de decisão estratégica, pelo agente de segurança física. (D) de decisão estratégica, pelo profissional de segurança. (E) de decisão de negócios, e requer o papel ativo do setor gerencial para determinar o que é confidencial, de uso interno ou público.
**Gabarito: E.** A: TI implementa. B: terceiros não conhecem o valor. C: nada a ver com rótulo. D: apoia, não decide.

**Para o Anki.**
- Classificação da informação é decisão de quem? → De NEGÓCIO, pelo proprietário/setor gerencial; não TI nem segurança.
- Quais informações classificar? → Todas, qualquer mídia, assinadas ou não.
- Critérios mínimos (Petrobras 2015) → Confidencialidade, criticidade e prazo de RETENÇÃO.
- Norma ABNT de classificação → NBR 16167. LAI: ultrassecreta 25 · secreta 15 · reservada 5.

### 9.19 Norma ISO 27002, criptografia, certificação digital e assinatura digital

**Peso.** O eixo histórico: SGSI 3 + organização 7 + criptografia 43 (conceitos 15, algoritmos 7, hash 4, assinatura 4, certificado/ICP 13). Transpetro 2023 Ênfase 5: Q41 (envelope, tec 2695300) e Q44 (27002, tec 2695303). Transpetro 2018 PN: tec 638948, 638950; Petrobras 2018 PN: tec 619543, 619548. BANESE 2025 trouxe oito.

**O que a banca cobra.**

Normas:
- 27001 = REQUISITOS do SGSI, certificável, "deve"; cláusulas 4 contexto, 5 liderança, 6 planejamento, 7 apoio, 8 operação, 9 avaliação de desempenho (monitoramento e medição, auditoria interna, análise crítica pela direção: tec 2780874, 2695475), 10 melhoria (não conformidade e ação corretiva: tec 3116487); Anexo A; PDCA iterativo (tec 3116395); "requisitos genéricos para qualquer organização".
- 27002 = código de prática, "referência para seleção de controles no SGSI ou orientação para implementar controles comumente aceitos" (tec 2041478); "convém que"; não certificável. 2013: 14 seções (5 políticas; 6 organização; 7 RH; 8 ativos; 9 acesso; 10 criptografia; 11 física; 12 operações; 13 comunicações; 14 aquisição e desenvolvimento; 15 fornecedores; 16 incidentes; 17 continuidade; 18 conformidade), 114 controles; malware em 12.2 (Q44). 2022: 4 temas (5 organizacionais 37; 6 pessoas 8; 7 físicos 14; 8 tecnológicos 34), 93 controles, 11 novos (5.7 threat intel, 5.23 nuvem, 5.30 prontidão de TIC, 7.4 monitoramento físico, 8.9 configuração, 8.10 exclusão, 8.11 mascaramento, 8.12 DLP, 8.16 monitoramento, 8.23 filtragem web, 8.28 codificação segura); malware = 8.7; atributos: tipo, propriedades CID, conceitos de cibersegurança, capacidades operacionais, domínios (Governança_e_Ecossistema, Proteção, Defesa, Resiliência: tec 3116485).
- Vizinhas: 27005 riscos; 27701 privacidade; 27017 nuvem; 27018 PII em nuvem; 27035 incidentes; 29134 PIA (tec 2695482). Petrobras/BR 2008 (planilha): a 27002 recomenda especificar requisitos de segurança "nas especificações de requisitos de negócio".

Criptografia:
- Simétrica: uma chave secreta compartilhada; rápida; confidencialidade (tec 3347175); o destinatário precisa "apenas da chave secreta compartilhada" (tec 2694690, 2041484). AES (bloco, tec 2780492), DES/3DES (tec 836013), RC4 (fluxo, tec 2780858), ChaCha20, IDEA.
- Assimétrica: par; "a pública é usada por quem envia; só o dono lê com a privada" (tec 2690851); lenta; resolve distribuição. RSA (tec 643500), ECC/ECDSA ("autenticidade e irretratabilidade", tec 2694691), Diffie-Hellman (troca de chaves). Híbrida: TLS acorda chave simétrica via assimétrica.
- Regras: sigilo → PÚBLICA DO DESTINATÁRIO (tec 836017, 638794, 3347857, Q41). Assinatura → PRIVADA DO REMETENTE; verifica com a pública dele (tec 3346878, 2780856). Tudo junto: "cifrar com Sr, depois com Pj, enviar hash" (tec 3116358).
- Envelope digital: dados com chave simétrica; chave simétrica cifrada com a PÚBLICA DO DESTINATÁRIO (Q41); confidencialidade.
- Hash: unidirecional, "bloco de bits de tamanho fixo" (tec 3116473), "código de verificação de integridade" (tec 3346350, 3347864); sem chave; colisão; maior saída, menos colisão (SHA-512 > SHA-256 > SHA-1 > MD5, tec 1175326); MD5 128 bits/32 hex, SHA-1 160/40, SHA-256 256/64 (tec 2695435); HMAC = hash com chave; não recupera o documento (tec 619543).
- Assinatura digital: hash cifrado com a PRIVADA do signatário; o receptor decifra "com a pública de J, presente em CertJ" (tec 2780856); integridade + autenticidade + não repúdio; NÃO confidencialidade. "Mecanismo de autenticidade" → assinatura (tec 3347861, 2901930). SHA256RSA = SHA-256 + RSA assimétrico (tec 638948). Lei 14.063/2020: simples, avançada, qualificada (ICP-Brasil, tec 3347865).
- Certificado X.509: vincula identidade a CHAVE PÚBLICA; contém titular, emissor, validade, série, algoritmo, PÚBLICA do titular e ASSINATURA DO EMISSOR (tec 2041495, 638777, 3347858); nunca a privada; "apenas a assinatura da AC emissora" (tec 2695433, 2780491). Validar assinatura do signatário: "pública do signatário no certificado" (tec 836016, 643499). Validação: íntegro, autêntico, no prazo, não revogado (LCR/OCSP), cadeia confiável.
- ICP-Brasil: MP 2.200-2/2001; raiz ÚNICA (tec 638798); AC-Raiz = ITI (tec 643497), emite só para ACs ("certificado da AC subsequente assinado apenas pela Raiz", tec 638950); AC emite; AR identifica, não assina. A1 software 1 ano; A3 token até 5 anos.
- TLS: camada de segurança do HTTPS (tec 2780796); sucessor do SSL (tec 3347090); servidor sempre autenticado, cliente opcional (tec 2695436).

**Como ela pergunta.** Formato B: envelope (Q41); "C assina K e cifra com a chave" → pública de S (tec 638794); "decriptar a AD com" → pública de J (tec 2780856). Formato A: integridade → resumo de mensagem (tec 3346350, 3116473); autenticidade → assinatura (tec 3347861); confidencialidade → simétrica (tec 3347175). Formato D: seção da 27002 (Q44); cláusula 9 da 27001 (tec 2780874, 2695475); domínios (tec 3116485). Formato C: seleção de controles → 27002 (tec 2041478). Certificado: contém a pública do titular (tec 3347858); assinado só pela AC emissora (tec 2780491).

**Onde ela confunde.** 27001 × 27002. Certificado onde se pede hash (tec 3346350) ou assinatura (tec 3347861). Envelope como autenticidade. "Privada no certificado." "Assinado pela Raiz e pelo titular." "Raiz emite para usuário." "AR assina." Simétrica × assimétrica com "chave secreta compartilhada". "Assinatura cifra a mensagem" (cifra o hash). "RSA simétrico" (tec 638948). Cláusula 9 misturada com 6 e 8.

**Macete.** Propriedade primeiro: detectar alteração → hash; provar quem enviou → assinatura; ninguém mais lê → cifragem; pessoa ↔ chave pública → certificado. Depois, de quem é a chave: sigilo = pública de quem RECEBE; assinatura = privada de quem ENVIA; AC assina com a privada DELA. "Deve" → 27001; "convém" → 27002. Malware: seção 12 operações (2013), 8.7 tecnológico (2022).

**Questão comentada 1.** (Cesgranrio · Transpetro 2023 · Q41, tec 2695300) No envelope digital, a chave secreta é cifrada com a chave
(A) privada do remetente (B) privada do destinatário (C) pública do remetente (D) pública do destinatário (E) pública de um terceiro confiável.
**Gabarito: D.** A: assina, não dá sigilo. B: decifra, não cifra. C: não dá sigilo a ninguém. E: a AC não recebe mensagens.

**Questão comentada 2.** (Cesgranrio · Transpetro 2023 · Q44, tec 2695303) Na ISO 27002, proteção contra malware é objetivo da segurança
(A) nas operações (B) nas comunicações (C) em recursos humanos (D) no controle de acesso (E) física e do ambiente.
**Gabarito: A.** Seção 12 (2013), 12.2; na 2022, controle 8.7. B: redes. C: pessoas. D: acesso. E: perímetro e ambiente.

**Questão comentada 3.** (Cesgranrio · Eletronuclear 2022 · tec 2041495) O certificado do usuário contém dados do requerente, do emissor, validade, a chave
(A) pública do requerente e assinatura do requerente. (B) pública do emissor e assinatura do emissor. (C) pública do requerente e a assinatura digital do emissor. (D) privada do emissor e assinatura do requerente. (E) privada do requerente e assinatura do emissor.
**Gabarito: C.** A: o titular não assina o próprio certificado. B: a pública do emissor está no certificado DO emissor. D, E: privada nunca está em certificado.

**Para o Anki.**
- ISO 27001 × 27002 → Requisitos do SGSI, certificável, "deve" × código de prática com controles, "convém", referência para seleção.
- Cláusula 9 da 27001 (avaliação de desempenho) → Monitoramento e medição · auditoria interna · análise crítica pela direção. Cláusula 10: não conformidade e ação corretiva.
- Onde está "proteção contra malware" na 27002 → 2013: seção 12, operações (12.2). 2022: controle 8.7, tecnológico.
- 27002:2022 temas → Organizacionais 37 · pessoas 8 · físicos 14 · tecnológicos 34 = 93; domínios: Governança_e_Ecossistema, Proteção, Defesa, Resiliência.
- Sigilo × assinatura: qual chave → Pública do DESTINATÁRIO × privada do REMETENTE (verifica com a pública dele).
- Envelope digital → Dados com simétrica; chave simétrica cifrada com a PÚBLICA DO DESTINATÁRIO; confidencialidade.
- Hash × assinatura × certificado → Integridade (sem chave) × integridade + autenticidade + não repúdio × vincula identidade a chave pública, assinado pela AC.
- Certificado X.509 contém / não contém → Pública do titular + assinatura do EMISSOR / nunca a privada; nem assinatura do titular ou da Raiz.
- ICP-Brasil → Raiz única = ITI (só emite para ACs) · AC emite · AR identifica. A1 software 1 ano; A3 token até 5 anos.
- MD5 × SHA-1 × SHA-256 → 32 hex × 40 hex × 64 hex; maior, menos colisão. SHA256RSA = SHA-256 + RSA assimétrico.

### 9.20 Conceitos de segurança em nuvem

**Peso.** [sem precedente localizado] em questão direta; CASB distrator em Q43; 27018 distrator em tec 2041478. Estreia na Ênfase 5.

**O que a banca cobra.**
- Responsabilidade compartilhada: provedor = segurança DA nuvem (datacenter, hardware, rede física, hipervisor); cliente = segurança NA nuvem (dados, classificação, identidades e acessos, configuração, aplicação). IaaS: cliente do SO para cima; PaaS: aplicação, dados, acessos; SaaS: dados, usuários, permissões, configuração. DADO e IDENTIDADE são sempre do cliente.
- Riscos: configuração incorreta (bucket público, chave exposta) é a causa número um; identidades sem MFA; APIs inseguras; multi-tenancy; shadow IT; residência de dados e LGPD; lock-in; SLA.
- Controles: IAM com menor privilégio e MFA; criptografia em repouso e trânsito; KMS (BYOK traz a chave; HYOK guarda fora); CASB (uso de SaaS); CSPM (postura de configuração); CWPP (cargas); zero trust/SASE; logs para o SIEM; backup multi-região; segmentação por VPC.
- Normas: ISO 27017 (controles para nuvem), 27018 (PII em nuvem pública), CSA CCM/STAR, NIST SP 800-145 (definição: 5 características, 3 modelos de serviço, 4 de implantação), 27002:2022 controle 5.23.

**Como ela pergunta (previsão).** "No modelo de responsabilidade compartilhada, cabe ao cliente" → dados, identidades, configuração; "configurações incorretas nas contas" → CSPM; "visibilidade sobre uso de SaaS" → CASB; "controles para serviços em nuvem" → 27017; "dados pessoais em nuvem" → 27018.

**Onde ela confunde.** "Responsabilidade pelos dados passa ao provedor." "Em SaaS o cliente não responde por nada." CASB × CSPM. 27017 × 27018.

**Macete.** DA nuvem = provedor; NA nuvem = cliente. Quanto mais "aaS", menos sobra, mas dado e identidade são sempre do cliente. A alternativa que dá ao cliente dados e controle de acesso costuma ser a certa.

**Questão-modelo (autoral).** Sistema migrado para SaaS: um ex-funcionário continuou acessando porque a conta não foi desativada, e um relatório sensível foi configurado como público por engano. No modelo de responsabilidade compartilhada, a responsabilidade é
(A) do provedor, pois em SaaS responde por tudo. (B) do cliente, pois identidades, permissões e configuração de compartilhamento são do cliente em qualquer modelo. (C) dividida: provedor pela conta, cliente pelo relatório. (D) do provedor, dono do hipervisor. (E) de ninguém, pois SaaS transfere o risco.
**Gabarito: B.** A, D: provedor cuida da infraestrutura. C: as duas falhas são do cliente. E: risco não some com terceirização.

**Para o Anki.**
- Responsabilidade compartilhada → Provedor: DA nuvem (físico, rede, hipervisor). Cliente: NA nuvem (dados, identidades, configuração), inclusive em SaaS.
- Principal causa de incidente em nuvem → Configuração incorreta; ferramenta: CSPM.
- CASB × CSPM → Uso de SaaS (shadow IT, DLP em nuvem) × postura de configuração das contas.
- ISO 27017 × 27018 → Controles para nuvem × dados pessoais em nuvem pública.

### 9.21 Segurança em IoT

**Peso.** [sem precedente localizado] como pergunta de segurança. Vizinhos: Stuxnet contra SCADA (Cesgranrio · Transpetro 2023 · tec 2695558); C&C (tec 2694705); Mirai como alternativa (tec 2695448); IoT como conceito na Transpetro 2023 Q61 (governança).

**O que a banca cobra.**
- Superfície: credenciais padrão de fábrica; firmware sem atualização; serviços e portas desnecessários (Telnet, UPnP); protocolos leves sem cifragem (MQTT, CoAP, Modbus); pouca capacidade (sem antivírus); vida longa sem patch; quantidade e dispersão. OWASP IoT Top 10: I1 senhas fracas ou embutidas; I2 serviços de rede inseguros; I3 interfaces inseguras; I4 falta de atualização segura; I5 componentes desatualizados; I6 privacidade; I7 transferência e armazenamento inseguros; I8 falta de gestão; I9 configurações padrão; I10 hardening físico.
- Mirai (2016): botnet de câmeras e roteadores com senha padrão, DDoS recorde.
- Medidas: inventário; trocar credenciais padrão, credencial única por dispositivo; atualização OTA assinada; desligar serviços; SEGMENTAÇÃO (VLAN própria, DMZ industrial); autenticação mútua por certificado; cifragem (TLS/DTLS); monitoramento; hardening físico.
- OT/ICS: SCADA (supervisão e aquisição de dados), PLC/CLP (controlador), HMI (interface), RTU (unidade remota nos dutos); Modbus, DNP3, OPC UA. Prioridade invertida: DISPONIBILIDADE e safety acima de confidencialidade; patch exige janela; legados; convergência TI/OT. Referências: IEC 62443 (zonas e conduítes), NIST SP 800-82, modelo de Purdue (níveis 0 a 5, DMZ industrial), ATT&CK for ICS, diodo de dados. Stuxnet (2010): worm que atacou PLCs Siemens via USB, ar-gap não bastou (tec 2695558). Transpetro: malha de dutos telecomandada, centros de controle, sensores.

**Como ela pergunta (previsão).** "Principal vulnerabilidade de IoT" → senha padrão e firmware; "medida de rede" → segmentação; "em ICS a propriedade prioritária" → disponibilidade; "worm de SCADA" → Stuxnet; "botnet de IoT" → Mirai; "norma de automação industrial" → IEC 62443; "guia NIST de OT" → 800-82.

**Onde ela confunde.** SQLi como problema de IoT. "OT tem os mesmos requisitos da TI." "Patch imediato em PLC." "Ar-gap garante." "Mirai é ransomware." 800-82 × 800-61.

**Macete.** IoT: SENHA PADRÃO e FALTA DE ATUALIZAÇÃO; mitigação: SEGMENTAR. OT/SCADA: DISPONIBILIDADE primeiro; IEC 62443 e 800-82. Stuxnet worm de SCADA; Mirai botnet de IoT.

**Questão-modelo (autoral).** Sensores de pressão de dutos operam com credenciais de fábrica, nunca atualizados, e foram incorporados a uma botnet. A medida que melhor reduz o risco para a rede de supervisão é
(A) antivírus de assinatura em cada sensor. (B) segmentar os dispositivos em rede própria isolada, com credenciais únicas e atualização de firmware. (C) WAF na saída da planta. (D) migrar o SCADA para SaaS. (E) desativar o SIEM.
**Gabarito: B.** A: sensores não comportam antivírus; o problema é senha e firmware. C: WAF é HTTP. D: não trata o dispositivo. E: absurdo.

**Para o Anki.**
- Duas vulnerabilidades típicas de IoT → Credenciais padrão não alteradas e firmware sem atualização (OWASP IoT I1, I4).
- Medida de rede contra IoT comprometido → Segmentação (VLAN própria, DMZ industrial) + credencial única + OTA assinada.
- Mirai × Stuxnet → Botnet de IoT para DDoS (2016, senha padrão) × worm contra PLC/SCADA Siemens (2010, USB).
- TI × OT/ICS: prioridade → Confidencialidade × DISPONIBILIDADE e safety; patch em OT exige janela.
- IEC 62443 × NIST SP 800-82 × Purdue → Norma de automação industrial × guia NIST de OT × níveis 0 a 5 com DMZ industrial.

## 4. Pares e pegadinhas da disciplina

| O par que a banca confunde | A distinção que resolve | Fonte ou [inferido] |
|---|---|---|
| IDS × IPS | Detecta e alerta (passivo) × bloqueia em linha, contramedidas | tec 3347863, 643498 |
| Filtro de pacotes × firewall proxy | Regras IP/porta na camada de rede, simples × intermediário na aplicação, inspeciona conteúdo, autentica | tec 3117648, 638941 |
| Firewall × WAF | Regra de rede × entende HTTP (XSS, SQLi) | tec 2462901, 2041382 |
| Proxy × proxy reverso | Protege o cliente saindo × protege o servidor recebendo | tec 3117538 |
| SIEM × SOAR × XDR | Correlaciona logs e alerta × automatiza resposta × detecção estendida | Q43; [inferido] |
| DLP × CASB × CSPM | Dado saindo × uso de SaaS × postura de configuração | Q43; [inferido] |
| MDM × EDR | Governa e configura o dispositivo (wipe) × detecta e responde | [inferido] |
| Incremental × diferencial | Desde o último backup qualquer × desde o último completo | tec 3347873, 634020 |
| RTO × RPO | Tempo máximo parado × perda máxima de dados | planilha B9.03 |
| CVE × CVSS × NVD × CWE | Identificador × nota 0 a 10 × base × tipos de fraqueza | tec 3116392, 2695441 |
| Vírus × worm | Hospedeiro e usuário × replica-se sozinho pela rede | tec 3116341 |
| Trojan × backdoor | Disfarce de entrada × porta para voltar | tec 2041396, 3347856 |
| Rootkit × spyware × keylogger | Oculta e dá admin × coleta × captura teclas | tec 2690857, 2695449 |
| Bot × botnet × C&C | Máquina escravizada × armada × servidor que comanda | tec 638945, 1176454, 2694705 |
| Cryptojacking × formjacking | Minera com a CPU da vítima × JavaScript rouba cartão | tec 3347859, 3116433 |
| Phishing × pharming | Isca por mensagem × DNS envenenado, sem clique | tec 2780848; [inferido] |
| Spear × whaling × vishing × smishing | Alvo específico × executivo × voz × SMS | [inferido] |
| Baiting × tailgating | Isca com brinde × seguir pela porta | tec 3347860, 3116437 |
| XSS × SQL injection | Navegador da vítima × banco de dados | tec 2694701, 1175324 |
| XSS × CSRF | Injeta script × forja requisição com a sessão válida | tec 2041389 |
| XSS refletido × armazenado × DOM | Volta na resposta × gravado no servidor × cliente injeta | tec 2694701, 2695441 |
| DoS × DDoS × DRDoS | Uma origem × muitas × refletido, origem = vítima | tec 2041338, 374130 |
| SYN flood × slowloris | Esgota conexões TCP × segura conexões HTTP | tec 2695459, 2695448 |
| Spoofing × sniffing | Falsificar origem × escutar | tec 3347854, 2695444 |
| IP × ARP × DNS spoofing | IP de origem falso × MAC do atacante no IP do gateway × resposta DNS falsa | tec 3347854, 3116429 |
| Rogue DHCP × evil twin | DHCP falso entrega gateway falso × AP Wi-Fi falso | tec 3116426, 3347855 |
| Ataque passivo × ativo | Observa (confidencialidade) × altera ou cria fluxo | tec 619545, 3116417 |
| Força bruta × dicionário × credential stuffing | Todas as combinações × lista × pares vazados de outro site | tec 2695446; [inferido] |
| SAST × DAST × IAST | Código parado × rodando, de fora × agente dentro | Q38 |
| Teste × modelagem de ameaças | SAST/DAST verificam × STRIDE/DREAD/VAST identificam no projeto | Q38 |
| Scanner × pentest × red team | Identifica × explora (pontual) × contínuo, testa a detecção | [inferido] |
| Threat intel × threat hunting | Conhecer × caçar por hipótese sem alerta | [inferido] |
| IoC × IoA | Já comprometido × ataque em andamento | [inferido] |
| SSO × MFA | Menos logins × mais fatores | tec 619550; [inferido] |
| SSO × federação | Uma organização × confiança entre organizações | tec 619550, 638795 |
| Autenticação × autorização | Quem é × o que pode | tec 3117533, 374127 |
| OAuth 2.0 × OIDC × SAML | Autoriza por token × autentica sobre OAuth × SSO federado XML | [inferido] |
| RBAC × ABAC | Papel × atributos e contexto | Q39, tec 3347058 |
| DAC × MAC × ACL | Dono decide × rótulo do sistema × lista no objeto (não é modelo) | tec 3038222; Q39 |
| Sabe × tem × é | Senha × token, certificado × biometria | tec 2695542, 3038222 |
| Hash × assinatura × certificado | Integridade × + autenticidade e não repúdio × vincula identidade a chave pública | tec 3346350, 3347861, 2041495 |
| Assinatura × envelope | Privada do remetente (autenticidade) × pública do destinatário (sigilo) | Q41, tec 3347861 |
| Chave pública × privada | Cifra e verifica × decifra e assina | tec 3346878, 2780856 |
| Simétrica × assimétrica | Uma chave, rápida × par, lenta, resolve distribuição | tec 2690851, 2041484 |
| AC × AR × AC-Raiz | Emite e assina × identifica, não assina × só emite para ACs (ITI) | tec 638950, 643497 |
| MD5 × SHA-1 × SHA-256 | 32 hex × 40 hex × 64 hex | tec 2695435, 1175326 |
| ISO 27001 × 27002 | "Deve", requisitos, certificável × "convém", controles | tec 2041478, 2780874 |
| 27002:2013 × 2022 | 14 seções, 114 controles × 4 temas, 93 controles, atributos | Q44, tec 3116485 |
| ISO 27005 × 31000 | Risco de SI × risco genérico | tec 2780875; [inferido] |
| 22301 × 22313 × 27031 | Requisitos × diretrizes × TIC | tec 3116403, 2462904 |
| 27017 × 27018 | Controles para nuvem × PII em nuvem | [inferido] |
| Continuidade × PCN × BIA | Capacidade × documento × processo de análise de impacto | tec 2041480, 2462904 |
| Avaliação × tratamento de riscos | Identificar, analisar, avaliar × modificar, reter, evitar, compartilhar | tec 2041481, 2041503 |
| 800-61 × CSF | 4 fases de incidente × 5 (6) funções | Q42, tec 2780863 |
| 800-30 × 800-34 × 800-53 × 800-61 × 800-82 | Risco × contingência × controles × incidentes × OT | Q42; [inferido] |
| STRIDE × ATT&CK × Kill Chain | Design × matriz observada × 7 fases sequenciais | Q38, Q40; [inferido] |
| Tática × técnica | Porquê × como | Q40 |
| SOX × LGPD | Relatórios financeiros, EUA 2002 × dados pessoais, Brasil 2018 | [inferido] |
| Segurança da × na nuvem | Provedor × cliente (dados e identidades sempre do cliente) | [inferido] |
| TI × OT/ICS | Confidencialidade × disponibilidade e safety | tec 2695558; [inferido] |
| Física × lógica | Barra o corpo × barra a credencial | planilha B9.01 |
| Irretratabilidade × irretroatividade | Não repúdio × isca fonética | tec 3116448, 2695430 |

## 5. Lei seca e listas (o que precisa estar decorado literalmente)

**Normas pelo número (gatilho: "a norma/publicação que trata de X é").** ISO 27000 vocabulário · 27001 requisitos do SGSI, "deve", certificável (cláusulas 4 contexto, 5 liderança, 6 planejamento, 7 apoio, 8 operação, 9 avaliação de desempenho, 10 melhoria; Anexo A) · 27002 controles, "convém" · 27005 riscos de SI · 27017 nuvem · 27018 PII em nuvem · 27031 prontidão de TIC · 27033 redes · 27034 aplicações · 27035 incidentes · 27701 privacidade · 29134 PIA · ISO 31000 riscos genéricos, não certificável · ISO 22301 requisitos do SGCN · 22313 diretrizes · ABNT NBR 16167 classificação · NIST SP 800-30 risco · 800-34 contingência · 800-53 controles · 800-61 incidentes · 800-63 identidade · 800-82 OT/ICS · 800-115 testes · 800-145 nuvem · 800-207 zero trust · NIST CSF: Identificar, Proteger, Detectar, Responder, Recuperar (+ Governar no 2.0) · IEC 62443 automação industrial · Sarbanes-Oxley 2002, seções 302 e 404 · Lei 14.063/2020 assinaturas simples, avançada, qualificada · MP 2.200-2/2001 ICP-Brasil · LAI 12.527/2011: 25/15/5 anos · LGPD 13.709/2018.

**ISO 27002:2013, 14 seções (gatilho: "objetivo listado para o contexto da segurança…").** 5 Políticas · 6 Organização · 7 RH · 8 Ativos · 9 Controle de acesso · 10 Criptografia · 11 Física e do ambiente · 12 Operações (malware, backup, logs) · 13 Comunicações · 14 Aquisição, desenvolvimento e manutenção · 15 Fornecedores · 16 Incidentes · 17 Continuidade · 18 Conformidade. **2022, 4 temas:** 5 Organizacionais (37) · 6 Pessoas (8) · 7 Físicos (14) · 8 Tecnológicos (34) = 93. Domínios: Governança_e_Ecossistema, Proteção, Defesa, Resiliência.

**NIST SP 800-61, 4 fases.** 1 Preparação · 2 Detecção e Análise · 3 Contenção, Erradicação e Recuperação (uma fase) · 4 Atividade Pós-Incidente. Ciclo.

**ISO 27005, 4 opções de tratamento.** Modificação · Retenção · Ação de evitar · Compartilhamento. **Avaliação de riscos:** identificação → análise → avaliação; depois tratamento. **Risco (31000):** efeito da incerteza nos objetivos.

**ISO 22301, termos.** Continuidade = capacidade de continuar a entrega em nível aceitável durante disrupção. PCN = informação documentada que orienta a responder, retomar, recuperar e restaurar. BIA = processo documentado de analisar o impacto ao longo do tempo (gera RTO, RPO, MTPD, MBCO). Política = intenções da alta direção. Sistema de gestão = elementos inter-relacionados. Benefícios: resiliência (negócio), eficácia durante disrupções (processos), exposição legal e financeira (financeiro), reputação (partes interessadas).

**STRIDE, 6 pares.** Spoofing → Autenticidade · Tampering → Integridade · Repudiation → Não repúdio · Information Disclosure → Confidencialidade · Denial of Service → Disponibilidade · Elevation of Privilege → Autorização. **DREAD:** Damage, Reproducibility, Exploitability, Affected users, Discoverability.

**MITRE ATT&CK Enterprise, 14 táticas.** 1 Reconhecimento · 2 Desenvolvimento de recursos · 3 Acesso inicial · 4 Execução · 5 Persistência · 6 Escalada de privilégio · 7 Evasão de defesa · 8 Acesso a credenciais · 9 Descoberta · 10 Movimento lateral · 11 Coleta · 12 Comando e controle · 13 Exfiltração · 14 Impacto. Tática = porquê; técnica = como. Matrizes: Enterprise, Mobile, ICS. **Kill Chain, 7 fases:** reconhecimento, armamento, entrega, exploração, instalação, C2, ações no objetivo.

**Malware, um verbo por praga.** Vírus: hospedeiro e usuário. Worm: replica-se sozinho pela rede. Trojan: disfarça-se. RAT: trojan com backdoor. Backdoor: porta para voltar. Rootkit: oculta-se, acesso de admin. Spyware: coleta. Keylogger: teclas. Adware: propaganda. Ransomware: cifra e cobra. Bot: armada (botnet) comandada por C&C. Cryptojacking: minera. Formjacking: rouba cartão. Polimórfico: muda o código. Fileless: só memória. Bomba lógica: condição. Wiper: destrói. Phishing NÃO é malware.

**Ferramentas pela função.** Firewall filtra por regra · stateful acompanha conexões · proxy intermedia na aplicação e autentica · proxy reverso protege o servidor · DMZ isola servidores públicos · IDS detecta e alerta · IPS bloqueia · WAF protege HTTP · DLP impede dado sair · CASB controla SaaS · CSPM acha configuração errada · SIEM correlaciona logs · SOAR automatiza · EDR responde no endpoint · XDR estende · antivírus assinatura e heurística · MDM governa dispositivos móveis · VPN tunela cifrado · honeypot engana · scanner lista vulnerabilidades · pentest explora · nmap portas · Nessus vulnerabilidades · Metasploit exploração · Burp web · Wireshark sniffer.

**Backup.** Completo · incremental (desde o último qualquer; restaura a cadeia) · diferencial (desde o último completo; "incremental cumulativo"; 2 conjuntos) · regra 3-2-1 · RTO tempo · RPO dado · MTPD ≥ RTO.

**Criptografia, regras de chave.** Sigilo: pública do destinatário; decifra com a privada dele. Assinatura: hash cifrado com a privada do remetente; verifica com a pública dele. Envelope: simétrica nos dados + pública do destinatário na chave. Certificado: pública do titular + assinatura da AC emissora; nunca a privada. AC-Raiz (ITI) só assina ACs; AR identifica. Simétricos: AES, DES, 3DES, RC4 (fluxo), ChaCha20, IDEA. Assimétricos: RSA, ECC/ECDSA, Diffie-Hellman. Hash: MD5 32 hex, SHA-1 40, SHA-256 64; HMAC = hash com chave. Pilar → mecanismo: integridade → hash; autenticidade e não repúdio → assinatura; confidencialidade → cifragem; identidade ↔ chave pública → certificado.

**Autenticação e acesso.** Sabe (senha, PIN) · tem (token, celular, certificado) · é (biometria); MFA = categorias diferentes. SSO um login; federação entre organizações; OAuth autoriza; OIDC autentica; SAML XML; Kerberos tíquetes. RBAC papel; ABAC atributo; DAC dono; MAC rótulo; ACL lista.

**OWASP Top 10 2021.** A01 Controle de acesso quebrado · A02 Falhas criptográficas · A03 Injeção · A04 Design inseguro · A05 Configuração incorreta · A06 Componentes vulneráveis · A07 Identificação e autenticação · A08 Integridade de software e dados · A09 Registro e monitoramento · A10 SSRF. **2025:** A01 Controle de acesso · A02 Configuração incorreta · A03 Cadeia de suprimentos de software · A04 Criptografia · A05 Injeção · A06 Design inseguro · A07 Autenticação · A08 Integridade · A09 Registro e alerta · A10 Condições excepcionais.

**Princípios de projeto (Saltzer e Schroeder).** Economia de mecanismo · padrões seguros em falha · mediação completa · design aberto · separação de privilégios · privilégio mínimo · mínimo mecanismo comum · aceitabilidade psicológica.

**Engenharia social pelo canal.** Phishing (mensagem) · spear (alvo) · whaling (executivo) · vishing (voz) · smishing (SMS) · BEC (e-mail corporativo) · pharming (DNS) · baiting (isca) · tailgating (porta) · pretexting (história) · quid pro quo (favor) · watering hole (site frequentado) · scareware (alarme falso).

## 6. Revisão de véspera (checklist)

1. Formato dominante: uma função, cinco nomes; quatro definem outra coisa. Diga o nome antes de ler as alternativas.
2. SIEM correlaciona logs; não bloqueia. SOAR automatiza; XDR estende.
3. IDS alerta; IPS bloqueia; WAF só HTTP; DLP dado saindo; CASB nuvem; EDR endpoint; MDM celular.
4. Firewall proxy = intermediário na aplicação, inspeciona conteúdo, autentica. Filtro de pacotes = regra IP/porta, simples.
5. Proxy reverso protege o servidor; direto protege o cliente.
6. Incremental: desde o último qualquer. Diferencial: desde o último completo. RTO tempo; RPO dado.
7. CVE identifica; CVSS pontua; NVD lista; CWE tipifica.
8. Rootkit oculta e dá admin; worm replica sozinho; vírus precisa de hospedeiro; trojan disfarça; spyware coleta; keylogger teclas; ransomware cifra e cobra; bot armada (C&C); backdoor volta; cryptojacking minera; formjacking cartão.
9. Phishing não é malware.
10. XSS no navegador da vítima (refletido, armazenado, DOM); CSRF usa a sessão sem injetar; SQLi no banco (parametrização); path traversal usa ../.
11. DRDoS: origem falsificada = vítima. SYN flood esgota conexões; slowloris segura HTTP.
12. ARP spoofing: MAC do atacante no IP do gateway. Rogue DHCP: gateway falso. Evil twin: Wi-Fi falso.
13. Ataque passivo ameaça confidencialidade; disfarce, repetição, modificação e DoS são ativos.
14. Irretratabilidade = não negar autoria; "irretroatividade" é isca.
15. Integridade → hash; autenticidade e não repúdio → assinatura; confidencialidade → cifragem; identidade ↔ chave pública → certificado.
16. Sigilo: pública do destinatário. Assinatura: privada do remetente. Envelope: simétrica nos dados + pública do destinatário na chave.
17. Certificado: pública do titular + assinatura da AC emissora; nunca a privada; sem assinatura da Raiz ou do titular.
18. ICP-Brasil: raiz única, ITI; Raiz só assina ACs; AR identifica; A1 1 ano, A3 até 5.
19. MD5 32 hex, SHA-1 40, SHA-256 64. SHA256RSA = SHA-256 + RSA assimétrico.
20. Simétrica: uma chave, rápida (AES, 3DES, RC4). Assimétrica: par, lenta (RSA, ECDSA, DH).
21. DAST = execução, compilado, caixa-preta. SAST = código, caixa-branca. IAST = agente dentro. SCA = bibliotecas. STRIDE/DREAD/VAST = modelagem.
22. STRIDE: Autenticidade, Integridade, Não repúdio, Confidencialidade, Disponibilidade, Autorização.
23. ATT&CK: tática porquê, técnica como; 14 táticas na ordem; matriz. Kill Chain 7 fases.
24. 800-61: Preparação; Detecção e Análise; Contenção+Erradicação+Recuperação; Pós-Incidente. CSF: Identificar, Proteger, Detectar, Responder, Recuperar (+ Governar).
25. 800-30 risco; 800-34 contingência; 800-53 controles; 800-82 OT.
26. 27001 deve, requisitos, certificável (cláusula 9: monitoramento, auditoria interna, análise crítica; 10: não conformidade). 27002 convém, controles.
27. 27002:2013 malware na seção 12; 2022: 4 temas, 93 controles, 8.7; domínios Governança_e_Ecossistema, Proteção, Defesa, Resiliência.
28. 27005: modificação, retenção, evitar, compartilhamento; identificação → análise → avaliação. 31000: risco = efeito da incerteza, não certificável.
29. 22301 requisitos (certificável); 22313 diretrizes; 27031 TIC. BIA gera RTO/RPO. PCN documento; continuidade capacidade.
30. SOX 2002, EUA, relatórios financeiros, 302 e 404; Transpetro certificada; TI pelos ITGC e SoD.
31. PSI: alta direção aprova, todos recebem, revisão periódica. Política → norma → procedimento.
32. Segregação reduz fraude, erro e desvio. Acesso restrito ao autorizado. RH: antes, durante, encerramento.
33. Classificação: decisão de NEGÓCIO pelo dono; todas as mídias; rótulo por valor e sensibilidade; confidencialidade, criticidade, RETENÇÃO; NBR 16167; LAI 25/15/5.
34. ABAC atributos; RBAC papel; DAC dono; MAC rótulo; ACL lista. Autenticação quem; autorização o quê; auditoria o que fez.
35. MFA só com categorias diferentes; certificado prova posse da PRIVADA. SSO um login; federação entre organizações; OAuth autoriza, OIDC autentica, SAML XML.
36. VPN túnel cifrado; site-to-site filial; acesso remoto casa; IPsec rede, TLS aplicação.
37. Threat intel conhece (IoC, TTP, STIX/TAXII); hunting caça por hipótese sem alerta.
38. Scanner identifica; pentest explora; caixa-preta/cinza/branca; red team contínuo.
39. Nuvem: provedor DA, cliente NA; dado e identidade do cliente; misconfiguration; CASB uso, CSPM postura; 27017, 27018.
40. IoT: senha padrão e firmware; segmentar; Mirai. OT: disponibilidade; Stuxnet; IEC 62443; 800-82; Purdue.
41. "Apenas" em lista de abrangência derruba a alternativa. Entregar tudo ao provedor, à TI ou à alta gerência costuma ser erro.
42. Economia de mecanismo = design simples. Baiting isca; tailgating porta; vishing voz; smishing SMS; whaling executivo; pharming DNS.

## 7. Fontes usadas

- `cadernos/caderno09.txt`: 198 questões Cesgranrio 2016–2025, lidas integralmente; IDs citados ao longo do guia. O arquivo cobre as categorias 01 a 05.06 do índice; as categorias 06 a 12 (física, incidentes/SIEM, pentest, programação segura, frameworks, blockchain) não constam dele.
- `txt/indice_09.txt`: 238 classificações por assunto.
- `txt/prova2023.txt`: Transpetro 2023, Ênfase 5, questões 38 a 44 com resolução e gabarito definitivo de 09/01/2024.
- `fontes/planilha_seguranca.txt`: Padrão da Banca B9.01 a B9.19, Pares e Pegadinhas, Lei Seca, Questões-Chave (Petrobras 2015, Petrobras/BR 2008, CMB 2012, BANESE 2025).
- `txt/dossie.txt` seção 2.3 e `txt/relatorio_docx.txt` seção 3.2.
- `C:\Users\ronal\Downloads\Conteudo_Programatico_Comentado_Transpetro2026.md`, linhas 186–200 e 843–1015.
- Teoria de apoio (extraída para `txt/gran_seg_*.txt` e `txt/passo_aula21.txt`): GranCursos resumos 004 DAST, 006 Backup, 016 EDR/XDR, 023 OWASP Top 10 2025, 026 Tratamento de Incidentes, 029 Pentest, 034 ISO 31000, 093 MITRE ATT&CK, 102 Compliance em nuvem; Passo Estratégico Aula 21. Usadas só para conferir listas; nenhuma estatística delas entrou como "padrão da banca".
