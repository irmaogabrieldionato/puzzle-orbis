# Puzzle Orbis — Instruções para agentes de IA

**Leia primeiro:** [Plano Mestre — AI Collaboration Roadmap](docs/AI_COLLABORATION_ROADMAP.md).

Repositório: `irmaogabrieldionato/puzzle-orbis`.

## Objetivo
Implementar somente as funcionalidades aprovadas do Puzzle Orbis, por etapas independentes e verificadas. O documento principal tem prioridade para a sequência de implementação, matriz de testes e critérios de aceitação.

## Invariantes
- Dez níveis: `4,8,16,32,64,108,216,432,862,1724`.
- Quatro modalidades previstas: quadrados, retângulos, mistos, aleatórios.
- Uma, duas ou três imagens, com espaços distintos e peças misturadas.
- Quinze idiomas listados no `src/engine.js`, com tradução real conforme evolução.
- Cronômetro e recordes individuais persistidos **somente localmente**, separados por identidade da(s) imagem(ns), nível, quantidade e corte; registrar recorde apenas em vitória válida.
- Cadastro/login real quando serviço autorizado estiver configurado; não confundir autenticação com sincronização.
- Não implementar galeria temática, desafio diário, competição, cooperativo, rankings entre pessoas ou sincronização entre aparelhos.

## Antes de editar
1. Verifique o SHA atual de `main`, o status de `npm test`, `npm run build:web`, GitHub Actions e issues/PRs abertos.
2. Escolha uma issue disponível, indique nos comentários qual papel assumiu e evite conflitos com outras IAs.
3. Crie branch `agent/<identificador>/<issue>-<breve-descricao>`; nunca sobrescreva alterações alheias ou force push em `main`.
4. Leia código e testes relacionados; redija critérios de aceitação antes de começar.

## Durante a mudança
- Implementar → testar → corrigir → regressão → revisão → PR → próxima tarefa.
- Commit pequeno com testes e justificativa; preservar saves antigos ou documentar migração.
- Para validar localmente: `npm test` e `npm run build:web`.
- Teste de motor/simulação não equivale a jogar no navegador; descreva a diferença.
- PR deve indicar SHA testado, resultados reais, pendências, screenshots reais (se houver) e alterações de requisitos.
- Nunca declare o build, teste, integração ou publicação concluído se não houver evidência.

## Segurança
Não publique tokens, secrets, service-role, senhas ou dados pessoais. Arquivos de usuário ficam locais salvo autorização explícita.

## Handoff
Ao transferir tarefa para Claude, ChatGPT ou outra IA, registrar issue, branch, SHA, arquivos, decisões, evidência de testes, riscos e próximo passo.

**Este arquivo orienta agentes; não ativa nem conecta outras IAs automaticamente.**
