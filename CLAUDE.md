# Claude — Puzzle Orbis

Este repositório pode ser desenvolvido por Claude em colaboração assíncrona com ChatGPT e outros agentes por meio de issues e pull requests no GitHub.

**Obrigatório ler antes de alterar código:**
1. [AGENTS.md](AGENTS.md) — regras gerais de todos os agentes.
2. [docs/AI_COLLABORATION_ROADMAP.md](docs/AI_COLLABORATION_ROADMAP.md) — plano técnico completo, dependências, prioridades e QA.
3. [README.md](README.md) — estado público (validar contra o código, pois pode estar desatualizado).
4. `src/engine.js`, `src/app.js`, `src/timer.js`, `src/i18n.js` e testes correspondentes.

## Ao receber uma tarefa
- Conferir a issue e a branch HEAD; não assumir que o código permaneceu igual ao último contexto.
- Preferir uma issue de alta prioridade liberada e sem agente trabalhando nela.
- Criar branch específica para sua tarefa, com PR pequeno e testes.
- Executar `npm test` e `npm run build:web`; reportar logs e SHA real; se impossíveis, declarar bloqueio.
- Submeter para revisão independente por ChatGPT ou outra IA antes de integrar.
- Não trabalhar em `main` diretamente, não instalar serviços externos sem aprovação, não fazer mudanças fora do escopo.

## Regras fundamentais
- Preservar os 10 níveis e seus números exatos.
- Não acrescentar galeria temática, desafio diário, competição, cooperativo, ranking ou sincronização entre aparelhos.
- Recordes por imagem/configuração permanecem locais.
- Traduções de todos os quinze idiomas, multi-imagem, cortes e autenticação são planejados, não necessariamente prontos.
- Nenhuma alegação de jogo testado visualmente sem automação real ou teste manual documentado.

Quando terminar, fornecer PR, SHA, comandos executados, resultados, riscos e o próximo passo reproduzível.
