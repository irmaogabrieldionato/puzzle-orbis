# 🧩 Puzzle Orbis

Jogo de quebra-cabeças com imagens escolhidas pelo usuário. Este repositório contém uma implementação web inicial; **não representa um aplicativo nativo publicado**.

## Disponível no código atual

- Dez níveis com 4, 8, 16, 32, 64, 108, 216, 432, 862 e 1.724 peças.
- Carregamento de uma imagem local (até 8 MB), embaralhamento, troca de peças por dois cliques, dica visual, reinício e indicador de progresso.
- Salvamento e restauração **local no mesmo navegador** via IndexedDB, com compatibilidade para saves antigos em localStorage; não há sincronização entre aparelhos.
- Modo separado para duas ou três imagens: tabuleiros distintos, peças misturadas, escolha entre contagem total ou por imagem e salvamento local em IndexedDB.
- Quatro modalidades: quadrados (grade próxima de quadrada), retângulos, mistos e aleatórios. Os modos misto e aleatório ajustam os recortes à proporção do tabuleiro; os aleatórios são reproduzíveis para a mesma imagem e nível.
- Quinze idiomas para as duas telas web, preferências locais e direção RTL para árabe e urdu. As traduções ainda precisam de revisão linguística humana.
- Cronômetro por partida com pausa, retomada, desistência, repetição e tempo final; melhor tempo pessoal armazenado somente neste navegador, separado por identidade da imagem, nível, quantidade de imagens e modalidade de corte.
- Arquivos de PWA e service worker; instalação e uso offline dependem de navegador e hospedagem compatíveis.

## Ainda não implementado ou não validado

- Cadastro/login com autenticação real por e-mail.
- Aplicativos nativos Android, iOS, Windows e Linux: builds e testes nativos não demonstrados neste repositório.
- Inspeção visual e testes de interação em navegadores e dispositivos reais.

## Verificação

Com Node.js instalado, execute:

```sh
npm test
npm run build:web
```

O GitHub Actions executa os testes automatizados e a compilação web. Consulte a aba **Actions** e confira o commit associado antes de considerar um resultado aprovado. Testes de geometria e recorte não substituem testes visuais nem comprovam funcionalidades ainda ausentes.

## Escopo excluído

Não incluir galeria temática, desafio diário, competição, cooperativo ou sincronização entre aparelhos.

## Segurança

Não enviar senhas, chaves de serviço Supabase, credenciais SMTP ou outros segredos ao GitHub. Imagens e salvamentos atuais são processados localmente no navegador.

## Instalar a versão web (PWA)
Abra o jogo servido por HTTPS. Em navegadores compatíveis, use **Instalar app** ou **Adicionar à tela inicial**; no iOS, use o menu Compartilhar do Safari. Após a primeira visita online, o jogo e o modo de duas/três imagens podem abrir offline no mesmo endereço. A instalação web não é uma publicação nas lojas. O pacote `puzzle-orbis-web` fica nos artefatos de uma execução aprovada do GitHub Actions; sirva seu conteúdo por HTTPS em produção, não por `file://`.
