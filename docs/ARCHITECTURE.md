# Arquitetura web do Puzzle Orbis
O build estático inclui as telas de uma imagem (`index.html`), duas/três imagens (`multi.html`) e uma tela de conta opcional que não é ativada no build padrão.

- `src/engine.js`, `src/rectangular.js`, `src/variable-cuts.js`: regras puras, geometrias normalizadas, hit-testing e navegação por teclado. O modo quadrado usa grade aproximada; o misto reserva formas controladas e o aleatório usa uma semente derivada da imagem e nível.
- `src/app.js` e `src/multi-app.js`: captura de arquivos, desenho Canvas, entrada/toque/teclado e controle dos estados. `src/multi-engine.js` separa cálculo de contagem e permutação. O progresso final só acontece quando todas as posições estão corretas.
- `src/timer.js`: relógio monotônico e recordes. A identidade de recorde diferencia imagem(ns), nível, quantidade e corte; o modo múltiplo também diferencia a política de contagem.
- `src/multi-store.js` usa IndexedDB em dois registros independentes. Saves antigos de uma imagem em localStorage são aceitos; localStorage também é fallback quando IndexedDB não grava. Preferência de idioma e recordes continuam em localStorage.
- `src/i18n.js` e `src/locales.js`: catálogo das telas, troca de idioma, tags BCP 47 e RTL sem alterar coordenadas.
- `sw.js` pré-carrega o código e recursos essenciais ao jogo. Configuração da conta exige rede; o service worker não intercepta requisições ao Supabase nem é cache para credenciais. Nenhuma foto é enviada pelo código do jogo.
- `native/`: wrapper móvel Capacitor e desktop Electron, alimentados pelo mesmo build web. O desktop não habilita Node no renderer, usa uma origem local dedicada e não precisa abrir servidor HTTP para o usuário.

## Handoff de revisão
Confira testes, automações e o estado de `main` antes de partir para outro lote. Acrescente teste de regressão quando mudar geometria, temporizador, idioma, persistência ou empacotamento. Para publicação, siga a [lista de prontidão](RELEASE_CHECKLIST.md).
