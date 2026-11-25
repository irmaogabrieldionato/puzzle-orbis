# 🧩 Puzzle Orbis

Jogo de quebra-cabeças com imagens escolhidas pelo usuário. Este repositório contém uma implementação web inicial; **não representa um aplicativo nativo publicado**.

## Disponível no código atual

- Dez níveis com 4, 8, 16, 32, 64, 108, 216, 432, 862 e 1.724 peças.
- Carregamento de uma imagem local (até 8 MB), embaralhamento, troca de peças por dois cliques, dica visual, reinício e indicador de progresso.
- Salvamento e restauração **local no mesmo navegador** via localStorage; não há sincronização entre aparelhos.
- Modo separado para duas ou três imagens: tabuleiros distintos, peças misturadas, escolha entre contagem total ou por imagem e salvamento local em IndexedDB. A interface deste modo está em português.
- Quatro modalidades: quadrados (grade próxima de quadrada), retângulos, mistos e aleatórios. Os modos misto e aleatório ajustam os recortes à proporção do tabuleiro; os aleatórios são reproduzíveis para a mesma imagem e nível.
- Quinze opções no seletor de idioma; há textos de interface em português e inglês, mas **não há tradução completa dos quinze idiomas**.
- Cronômetro por partida com pausa, retomada, desistência, repetição e tempo final; melhor tempo pessoal armazenado somente neste navegador, separado por identidade da imagem, nível, quantidade de imagens e modalidade de corte.
- Arquivos de PWA e service worker; instalação e uso offline dependem de navegador e hospedagem compatíveis.

## Ainda não implementado ou não validado

- Tradução efetiva da interface nos quinze idiomas.
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
