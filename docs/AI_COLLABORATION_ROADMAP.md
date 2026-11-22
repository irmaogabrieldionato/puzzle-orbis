# Puzzle Orbis — Plano mestre de desenvolvimento colaborativo (ChatGPT, Claude e outras IAs)

**Versão do plano:** 2026-11-22  
**Repositório:** https://github.com/irmaogabrieldionato/puzzle-orbis  
**Estado:** documento de planejamento e contratos de colaboração; não comprova implementação nem testes.  
**Princípio:** implementar → testar → corrigir → testar regressões → revisar → integrar → próxima funcionalidade.

> Este documento é a fonte de coordenação para humanos e agentes de IA. Toda alteração deve partir do estado atual do GitHub. Nenhuma IA deve anunciar sucesso, testes, builds, integração ou publicação sem evidência reproduzível.

## 0. Escopo e proibições inegociáveis

### Escopo aprovado
- Jogo Puzzle Orbis com imagens fornecidas pelo jogador.
- Dez níveis com exatamente **4, 8, 16, 32, 64, 108, 216, 432, 862, 1724 peças**.
- Quatro modalidades de corte: **quadrados, retângulos, mistura de quadrados e retângulos, aleatórios**.
- Seleção de **1, 2 ou 3 imagens**; em partidas multi-imagem, misturar as peças e oferecer espaços/tabuleiros individuais, permitindo reconhecer a imagem à qual pertence cada peça.
- Seleção de quinze idiomas na ordem oficial registrada no código.
- Registro/login real por e-mail, nome e senha, conforme requisitos do produto, somente quando houver backend adequado e fluxo de segurança; **não** inferir que autenticação signifique sincronização de partidas.
- Cronômetro de cada partida; melhor tempo individual por imagem, nível, contagem de imagens e modalidade; repetir para tentar superar a própria marca; pausa, continuação, reinício, desistência, restauração e atualização de recorde **somente após vitória válida**.
- Experiência web/PWA e preparação gradativa para Android, iOS, Windows e Linux, com testes por plataforma antes de dizer que está pronto.

### Fora do escopo — NÃO IMPLEMENTAR
1. Galeria temática.
2. Desafio diário.
3. Competição ou ranking entre usuários.
4. Cooperativo.
5. Sincronização entre aparelhos de progresso, imagens, partidas ou recordes.

Manter o armazenamento de partidas/recordes por navegador; contas podem autenticar usuários, mas não pressupor sincronização de estado. Não integrar analytics, publicidade, terceiros nem telemetria sem aprovação específica.

## 1. Foto verificada do código — consultar novamente ao assumir uma tarefa

Na inspeção de 22/11/2026:
- `package.json`: `npm test` executa `node --test`; `npm run build:web` executa `node scripts/build.mjs`.
- Workflow `.github/workflows/qa.yml`: push/PR, Node 22, roda testes e build web.
- `src/engine.js`: `CUTS` com 10 contagens; 15 nomes de idiomas; grade aproximadamente quadrada, embaralhamento, permutação, troca, `pieceRect`, `pieceAt` e ajuste sem deformação `containedFit`.
- `src/app.js`: UI de um tabuleiro e uma imagem; troca por dois cliques; carregar imagem local (limite de 8 MB), dica, embaralhar, reiniciar, salvar/restaurar localmente; cronômetro, recorde, pausa e desistência, replay e estados de partida.
- `src/timer.js`: relógio monotônico, recorde por chave composta, leitura/gravação com verificação, formatação.
- `src/i18n.js`: textos em português e inglês, os demais idiomas atualmente caem no português.
- `index.html`: interface simples, um canvas, botões de partida e cronômetro.
- `sw.js`, `manifest.webmanifest`: base PWA, não equivalem à validação de instalação real.
- `test/`: testes de engine, geometria, recorte, idiomas, carregamento assíncrono, service worker, cronômetro, restauração e partidas simuladas.
- `README.md` está defasado em alguns detalhes (por exemplo, menciona ausência de traduções, embora português/inglês já existam). Atualizar somente com evidências.

**CI:** a consulta em 22/11/2026 encontrou várias execuções do GitHub Actions em `in_progress`. Status histórico não valida HEAD; sempre consultar o SHA exato, jobs e conclusão. Não confundir simulações em Python/Node com teste visual real e não interpretar workflow cancelado como aprovado.

## 2. Governança multi-IA: evitar conflitos e perda de código

### Responsabilidades sugeridas (papéis, não atribuições automáticas)

| Papel | Especialidade principal | Entrega mínima |
|---|---|---|
| ChatGPT / integrador | visão geral, requisitos, prioridade, revisões, integração e comunicação com autor | PRs integrados após QA e relatório com links |
| Claude / implementação | extração de módulos, arquitetura, alterações de engine/UI com testes de unidade | branch própria, PR pequeno, testes e justificativa |
| IA revisora independente | riscos, segurança, regressão, propriedade dos dados e QA | revisão documentada, cenários que falham, sugestões |
| IA de internacionalização | tradução, revisão contextual e testes de chaves | catálogo de idiomas, cobertura e testes |
| IA de acessibilidade e UX | teclado, toque, navegação, desempenho visual, mobile | testes de acessibilidade, screenshots quando disponíveis |
| Autor humano | decisões de produto e aprovações | confirmar mudanças fora das especificações |

Qualquer agente pode executar um papel, desde que deixe explícito qual função assumiu. Nenhuma IA ganha acesso ao GitHub por aparecer nesta lista.

### Fluxo obrigatório
1. Ler este documento, `README.md`, commits recentes, issues abertas, PRs em andamento e resultados de Actions. Registrar SHA base.
2. Escolher **uma** tarefa/issue; comentar intenção, escopo e arquivos planejados. Checar se outra IA está trabalhando no mesmo trecho.
3. Criar branch exclusiva: `agent/<papel>/<id-issue>-<resumo>`. Não escrever diretamente em `main` nas tarefas novas.
4. Planejar alteração mínima com invariantes e testes **antes** de codificar. Não substituir arquivos inteiros sem preservar alterações paralelas.
5. Implementar em incrementos pequenos, com testes do módulo e casos de erro.
6. Rodar `npm test` e `npm run build:web`; para UI, executar testes em browser ou explicar claramente se indisponível.
7. Revisar código e riscos, validar regressões; criar PR para `main`, mencionar issue e anexar evidência: comandos, saída, SHA, plataforma e screenshots se reais.
8. Solicitar revisão por agente diferente (Claude implementa → ChatGPT/IA QA revisa, ou o inverso).
9. Integrar somente com CI verde no **HEAD do PR** e conflitos resolvidos. Não contornar testes sem uma justificativa documentada e decisão humana.
10. Atualizar issue e documento de progresso: o que foi feito, testes executados e não executados, alterações de escopo, pendências. Partir da próxima issue após aprovação.

### Convenções
- Commits convencionais: `feat:`, `fix:`, `test:`, `refactor:`, `docs:`, `ci:`.
- Evitar PRs com muitos subsistemas; preferir PR vertical pequeno e revisável.
- **Sem auto-merge** de agentes sem evidência de QA.
- Usar objetos de dados serializáveis e versionar esquema de partidas (`saveVersion`).
- Sem segredos ou senhas em repositório, testes ou issue.
- Cada bug deverá ter teste de regressão reproduzível, quando automatizável.
- Resultados de CI são por commit, não por branch nominal.
- Conservar compatibilidade de dados locais quando viável; planejar migrações antes de alterar chaves.

## 3. Sequência de etapas e critério de desbloqueio

### P0 — Estabilizar o projeto e obter baseline verificável (PRIORIDADE 1)
**Objetivo:** saber se a versão atual funciona antes de expandir.
- [ ] Conferir status de todos os workflows relevantes e o HEAD de `main`, encontrar execução final do HEAD e investigar falhas/cancelamentos.
- [ ] Garantir `npm test` e `npm run build:web` reproduzíveis em Node 22 limpo; registrar quantidade real de testes e falhas.
- [ ] Auditar carregamento de imagem, `newGame`, `draw`, `finishIfSolved`, `save` e `restore` com teste end-to-end real.
- [ ] Corrigir a documentação desatualizada no README após verificar as capacidades efetivas.
- [ ] Criar testes com fixtures de imagem PNG/JPEG/WebP em licença apropriada ou geradas no próprio teste; cenários: retrato, paisagem, quadrada, transparente, limites de tamanho e arquivo inválido.
- [ ] Executar playthrough completo para cada contagem oficial (além de testes unitários) em navegador compatível.
- [ ] Registrar capturas de tela reais por breakpoint, se possível.
**Aceite:** testes + build finalizados com sucesso no mesmo SHA; nenhuma regressão P0 aberta; demonstrar partida válida end-to-end. Se browser real indisponível, apontar bloqueio explicitamente.

### P1 — Confiabilidade do cronômetro e recordes (PRIORIDADE 2)
**Arquivos de referência:** `src/timer.js`, `src/app.js`, `test/timer*.test.js`, `test/playthrough.test.js`.
- [ ] Definir estados de partida como máquina de estados: `not_started`, `running`, `paused`, `abandoned`, `completed`. Transições inválidas não pontuam.
- [ ] Cronômetro monotônico: começar quando partida válida começar; congelar em pausa, desistência, conclusão e fechamento; restaurar somente tempo acumulado.
- [ ] Ao carregar jogo salvo, validar `saveVersion`, peças, nível, identidade da imagem, elapsedMs, estados e compatibilidade.
- [ ] Recorde guardado apenas em vitória válida e em milissegundos; distinguir tempo da tentativa e melhor tempo; proteger contra escrita silenciosamente malsucedida, quotas e navegação privada.
- [ ] **Identidade de recorde:** normalizar hash consistente do(s) conteúdo(s) de imagem (não apenas nome do arquivo), nível, quantidade e modalidade. Definir ordem de imagens para comparações equivalentes; evitar colisões de hash.
- [ ] Repetir jogo: zerar tempo e movimentos, preservar recorde e permitir comparar resultados equivalentes.
- [ ] Trocar nível, imagem, quantidade ou modo: criar outra chave de recorde; nunca misturar resultados.
- [ ] Testar: pausa/retomada, duplo finish, clique após conclusão, reiniciar, desistir, salvar/restaurar todos os estados, timer atrasado, storage indisponível, validação contra estado corrompido.
- [ ] Exibir o tempo final explicitamente após vitória; recorde novo deve ser indicado somente quando gravação for confirmada.
- [ ] Considerar se dica será permitida com recorde: regra atual não proíbe dica, então preservar, não inventar penalidade.
**Aceite:** testes reproduzíveis no mesmo SHA; nenhuma ação fora de vitória registra recorde; repetição é previsível.

### P2 — Separar lógica de jogo, desenho e UI (PRIORIDADE 3)
- [ ] Refatorar `src/app.js` monolítico sem reescrever tudo simultaneamente. Separar estado de partida, renderização, armazenamento, manipulação de imagem, controladores DOM.
- [ ] Introduzir funções puras para regras e validadores; manter `engine.js` modular.
- [ ] Criar contrato de estado versionado, com eventos de estado e modelo de múltiplos tabuleiros previsto sem ativá-lo.
- [ ] Formalizar dimensões, coordenadas normalizadas, peças, bordas, aspect ratio e hit-testing.
- [ ] Garantir que falhas de FileReader/Image antigos não substituam carregamento mais recente.
- [ ] Resolver redimensionamento e retenção de estado sem perder progresso.
- [ ] Cobrir com testes de regressão antes de dividir módulos.
**Aceite:** comportamento observável inalterado; suíte e build verde; menor acoplamento DOM/engine; documentação de interfaces.

### P3 — Quatro modalidades de corte (PRIORIDADE 4)
**Requisito:** quadrados, retângulos, quadrados + retângulos, cortes aleatórios.
- [ ] Formalizar algoritmo de partição **sem lacunas e sem sobreposição**, com exatamente N peças em cada um dos dez níveis.
- [ ] `square`: peças quadradas geométricas quando factível sem distorcer a imagem; documentar limitações para aspect ratios irregulares e quantidades não fatoráveis.
- [ ] `rectangle`: peças retangulares, mantendo cada peça íntegra; evitar deformação do conteúdo.
- [ ] `mixed`: mistura real de dois tipos; percentuais/gerador determinísticos quando necessário para testes.
- [ ] `random`: partição aleatória controlada por semente; repetir a mesma imagem com mesma semente pode reproduzir desafio.
- [ ] Identificar e conservar geometria de cada peça durante troca/montagem, inclusive peças de tamanhos diferentes; implementar hit-testing sobre regiões reais.
- [ ] Definir UI para escolher modalidade antes da partida e apresentar preview; preservar seleção em save.
- [ ] Garantir recordes separados por modalidade e, caso a geometria aleatória varie, por definição/seed do desafio para comparação justa.
- [ ] Cobrir imagens retrato/paisagem e recortes de borda; testar 4 e 1724 peças e todas as contagens intermediárias.
**Aceite:** quatro escolhas realmente alteram recortes, montagem, hit-testing e recordes; testes matemáticos e browser sem sobreposições/lacunas.

### P4 — Duas e três imagens simultâneas (PRIORIDADE 5)
- [ ] Seletor 1/2/3 imagens, aceitando um arquivo válido por entrada.
- [ ] Espaços/tabuleiros **distintos** para cada imagem, com peças de todas as imagens em conjunto misturadas.
- [ ] Definir a distribuição de contagem por imagem e significado de N antes de codificar: explicitar se cada tabuleiro tem N peças ou N total e obter confirmação do autor se não estiver decidido.
- [ ] Peça deve conter `imageId`, `sourceRegion`, `targetBoard`, `targetSlot`, ID estável, shape e índice; validação de permutação entre tabuleiros.
- [ ] Permitir escolher peça de uma origem e encaixar no tabuleiro correto; posição errada não destrói dados.
- [ ] Indicador de progresso geral e por imagem; completar somente quando **todos** os tabuleiros estiverem corretos.
- [ ] Salvar/restaurar imagens, espaços, peças, estados e tempo sem perder informações.
- [ ] Identidade de recorde deve incluir o conjunto de imagens, quantidade de imagens, nível e modo.
- [ ] Testes com 1/2/3 imagens; trocas entre imagens; identificação por espaços; revisão de memória e performance em 1724 peças.
**Aceite:** multi-imagem funcional visualmente e em QA, compatibilidade preservada com 1 imagem.

### P5 — Internacionalização completa (PRIORIDADE 6)
Idiomas oficiais na ordem: **inglês, chinês mandarim, hindi, espanhol, francês, árabe padrão moderno, bengali, russo, português, indonésio, urdu, alemão, japonês, suaíli, marathi**.
- [ ] Organizar catálogo por locale BCP 47, sem usar índice como identidade persistida; mapear seleção atual para compatibilidade.
- [ ] Traduzir **todas** as chaves, nomes dos dez níveis, textos de erro, instruções, cronômetro, recordes, seleção de imagem, cortes e múltiplas imagens.
- [ ] Revisão de sentido por idioma, não apenas substituição automática.
- [ ] Garantir RTL (árabe e urdu): `dir=rtl`, adaptação do layout, sem espelhar geometricamente o tabuleiro ou os movimentos.
- [ ] Persistir idioma localmente, sem sincronização.
- [ ] Testar fallback explícito, nomes, interpolação, truncamento e caracteres.
- [ ] Não apresentar idioma como traduzido se fallback em português ainda predominar.
**Aceite:** cobertura de 100% de chaves nos 15 idiomas, testes e revisão contextual documentada.

### P6 — Cadastro/login real e limites de privacidade (PRIORIDADE 7)
- [ ] Registrar nome, e-mail e senha em provedor de autenticação aprovado; fazer login por **e-mail e senha**. Se login por nome ainda for exigência, definir mecanismo explícito de username único e resolução segura; não usar nome público como segredo.
- [ ] Planejar Supabase Auth quando conexão, projeto e configuração forem disponibilizados pelo autor, sem inventar credenciais.
- [ ] Validação e mensagens genéricas, verificação de email quando configurada, recuperação de senha, sessão segura, logout, rate limiting e proteções contra enumeração.
- [ ] Utilizar variáveis de ambiente somente para configurações públicas; nunca expor service role ou secrets.
- [ ] Proteger dados pessoais, políticas de retenção, exclusão de conta e conformidade legal relevante; revisão de segurança antes de uso real.
- [ ] **Não sincronizar** progresso, fotos, peças, recordes e partidas entre aparelhos. É aceitável autenticar a conta em mais de um dispositivo, mas cada aparelho mantém seus dados locais.
- [ ] Testar autenticação real em ambiente de testes seguro, inclusive sessões expiradas e rede offline; distinguir mocks da verificação real.
**Aceite:** cadastro e login reais comprovados contra serviço configurado, sem expor segredos e sem sincronização de jogo.

### P7 — Usabilidade, acessibilidade e desempenho (PRIORIDADE 8)
- [ ] Layout adaptável a celular, desktop e tablet; interface de 4 até 1724 peças.
- [ ] Suporte real a toque, mouse e teclado; foco visível, navegação acessível, labels, mensagens claras e contraste.
- [ ] Evitar que elementos de interface fiquem inacessíveis em tela pequena e modo paisagem.
- [ ] Medir latência de desenho, alocação de memória e consumo de CPU nos níveis 862/1724; otimizar renderização e hit-testing com perfis, sem sacrificar correção.
- [ ] Evitar `localStorage` para base64 grandes quando excede quota; decidir alternativa estritamente local, como IndexedDB, sem sincronização.
- [ ] Informar estado da partida, resultado final e recorde com semântica acessível.
- [ ] Testar imagens JPG, JPEG, PNG e WebP, orientações e transparência.
**Aceite:** UX verificável em dispositivos reais e/ou navegador automatizado; métricas reproduzíveis e sem regressão.

### P8 — Segurança, resiliência e offline (PRIORIDADE 9)
- [ ] Avaliar MIME verdadeiro e decodificação; limites de bytes, pixels e memória, não confiar apenas em `file.type`.
- [ ] Evitar XSS/injeção: tratar texto e dados de storage como não confiáveis, não inserir conteúdo não sanitizado como HTML.
- [ ] Auditar service worker e caching: atualização de versão, erros de cache, invalidar assets antigos, compatibilidade offline.
- [ ] Considerar privacidade de imagens locais, exclusão explícita de salvamentos, limpeza de recordes com confirmação, quota e comportamento em navegação privada.
- [ ] Inspecionar dependências, licenças e permissões de cada futuro empacotamento.
- [ ] Testar falhas de rede, armazenamento e carregamento concorrente.
**Aceite:** checklist de ameaças documentado, testes de resiliência e nenhum segredo exposto.

### P9 — Empacotamento por plataforma (PRIORIDADE 10)
- [ ] Web/PWA: build completo, acessibilidade, HTTPS, manifesto, service worker, instalação e offline reais.
- [ ] Android: definir wrapper/framework permitido, ícones, permissões, assinatura, build e teste em dispositivo/emulador.
- [ ] iOS: adaptar plataforma e políticas, certificados/perfis necessários, build e teste em dispositivo/simulador.
- [ ] Windows/Linux: empacotamento apropriado, instalação/desinstalação, acesso a arquivos e smoke tests.
- [ ] Considerar compatibilidade e consistência do save local, sem presumir portabilidade entre aparelhos.
- [ ] Publicação somente após QA, conformidade, materiais da loja e aprovação humana explícita.
**Aceite:** artefatos reais por plataforma com logs; nunca chamar build web de APK/IPA ou declarar lançamento sem publicação.

### P10 — Documentação e entrega operacional
- [ ] Atualizar README com estado verdadeiro, instruções para desenvolvimento, teste e build.
- [ ] Criar `CONTRIBUTING.md`: padrão de branch, PR, commits, revisões, QA, rollback.
- [ ] Criar `docs/ARCHITECTURE.md`: módulos, eventos, storage, esquema de save, ciclo de imagem e geometria.
- [ ] Criar `docs/TEST_MATRIX.md`: cenários por nivel x modo x quantidade de imagens x tipo de arquivo x idioma x estado do cronômetro.
- [ ] Criar `docs/CHANGELOG.md` com commits comprovados e regressões corrigidas.
- [ ] Registrar decisões de produto ambíguas com ADR ou issue, antes de arquitetura irreversível.
**Aceite:** outra IA consegue retomar a implementação a partir de GitHub sem depender de contexto de conversa.

## 4. Matriz de teste recomendada

| Área | Casos obrigatórios | Prova |
|---|---|---|
| Níveis | 4, 8, 16, 32, 64, 108, 216, 432, 862, 1724 | unit + E2E |
| Imagens | JPEG/JPG, PNG, WebP; retrato, paisagem, quadrada, transparência | fixture + browser |
| Geometria | soma de áreas, não sobreposição, limites, hit-test, cortes diferentes | testes de propriedade |
| Peças | embaralhar, dois cliques, trocar, resolver, reiniciar, dica | E2E/simulação |
| Multi-imagem | 1/2/3 imagens, peças misturadas e espaços distintos | E2E |
| Recordes | vitória válida, replay, melhor/pior, diferentes imagens/níveis/modos | unit + E2E |
| Tempo | pausado, retomado, restaurado, abandonado, finalizado, aba fechada | relógio falso + browser |
| Storage | inexistente, cheio, escrita ignorada, dados corrompidos, migração | unit + browser |
| Idiomas | todas as chaves dos 15 idiomas; RTL | unit + screenshot |
| Segurança | inputs inválidos, storage malicioso, tokens, privacidade | teste/revisão |
| CI | test e build no mesmo SHA, PR aprovado | GitHub Actions |
| Distribuição | instalação, abertura, offline, arquivos, assinatura | dispositivos |

**Importante:** a matriz é um objetivo futuro, não um resultado de execução.

## 5. Fila de issues sugerida e independências

| ID planejado | Prioridade | Escopo | Dependência |
|---|---|---|---|
| ORB-001 | P0 | Baseline CI, logs e correção de falhas do HEAD | nenhuma |
| ORB-002 | P0 | Testes de partida reais com imagens e navegador | ORB-001 |
| ORB-003 | P1 | Máquina de estados do cronômetro e desistência/restauração | ORB-001 |
| ORB-004 | P1 | Recordes robustos e identidade estável da imagem | ORB-003 |
| ORB-005 | P2 | Refatoração incremental engine/UI/storage | ORB-002/003 |
| ORB-006 | P3 | Cortes quadrados e retangulares | ORB-005 |
| ORB-007 | P3 | Cortes mistos e aleatórios + seed | ORB-006 |
| ORB-008 | P4 | Modelo e UI de 2 e 3 imagens | ORB-005/007 |
| ORB-009 | P5 | 15 idiomas e RTL | textos estáveis |
| ORB-010 | P6 | Segurança e cadastro/login real | backend aprovado |
| ORB-011 | P7 | Acessibilidade e performance | ORB-008 |
| ORB-012 | P8 | Segurança, storage e offline | ORB-005 |
| ORB-013 | P9 | Builds por plataforma e testes reais | ORB-001 a 012 |
| ORB-014 | P10 | Documentação e QA final | contínua |

Podem existir subissues por idioma, plataforma e bug. Não criar prazos fictícios e não considerar essa tabela como issues já criadas.

## 6. Modelo de issue para cada agente

```markdown
### Objetivo
[problema concreto e por que importa]

### Base / restrições
- SHA de main consultado:
- Issue/PR relacionados:
- Funcionalidades proibidas preservadas:
- Compatibilidade de saves:
- Arquivos planejados:

### Implementação
- [ ] alteração mínima
- [ ] casos de borda e erros
- [ ] testes automatizados
- [ ] documentação

### Critérios de aceitação
- [ ] ...
- [ ] `npm test` com saída:
- [ ] `npm run build:web` com saída:
- [ ] browser/E2E real (ou bloqueio explicitado):
- [ ] regressão:
- [ ] review independente:

### Entrega
- Branch:
- PR:
- SHA:
- Riscos:
- Pendente:
```

## 7. Protocolo de passagem entre IAs

Ao terminar cada bloco, deixar comentário no PR/issue com:
- **Feito:** arquivos alterados e comportamento comprovado.
- **Evidência:** comandos reais, saída resumida, SHA, links para Actions e screenshots/artefatos quando houver.
- **Não feito:** testes, builds, revisão, publicação ou ambientes indisponíveis.
- **Riscos e hipóteses:** quais decisões foram assumidas e dependem do autor.
- **Próximo agente:** o menor próximo passo reproduzível e os arquivos relevantes.
- **Conflitos:** branch base, PR paralelo, compatibilidade com schema anterior.

**Claude/ChatGPT/outra IA não devem declarar colaboração simultânea ativa sem agentes de fato conectados e operando.** O GitHub permite handoff via issues e PRs.

## 8. Instrução curta para uma IA recém-chegada

> Trabalhe no repositório `irmaogabrieldionato/puzzle-orbis`. Leia `docs/AI_COLLABORATION_ROADMAP.md`, `README.md`, Actions e issues abertas. Confirme o SHA de `main`, escolha somente a primeira issue desbloqueada que não esteja em andamento por outro agente, crie branch isolada, implemente e teste sem modificar escopo excluído. Use fluxo implementar → testar → corrigir → regressão → revisão → PR. Nunca alegue execução, aprovação, publicação ou integração não confirmada. Preserve os dez níveis, os quinze idiomas previstos, os recordes estritamente locais, as imagens dos usuários e o funcionamento existente.

## 9. Critérios globais de conclusão

Uma etapa é **concluída** apenas quando código, testes no SHA relevante, revisão de regressões, documentação e (onde aplicável) validação visual real estão registrados. Caso uma ferramenta falhe, classificar **bloqueada** ou **pendente**, nunca aprovada. A palavra **publicado** só pode aparecer após evidência de distribuição real.
