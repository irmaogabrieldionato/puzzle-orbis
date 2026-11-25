# Pacotes do Puzzle Orbis para teste
O workflow **Pacotes de teste Puzzle Orbis** compila a revisão selecionada e disponibiliza artefatos apenas se a etapa do respectivo sistema passar.

| Sistema | Artefato | Tipo de validação |
| --- | --- | --- |
| Windows x64 | ZIP portátil | Executa o binário e confirma abertura das telas de uma e várias imagens |
| Linux x64 | TAR.GZ portátil | Executa o binário e confirma abertura das duas telas com Xvfb |
| Android | APK de depuração e AAB release sem chave de produção | Compilação; o APK serve para testar em dispositivo aprovado |
| iOS | ZIP com App.app para simulador | Compilação sem assinatura; serve para simulador, não para iPhone |

Os binários portáteis não são instaladores assinados. O APK de depuração não deve ser enviado à loja. O pacote de simulador iOS não é um IPA. Teste o seletor de arquivos, save, idioma e jogo completo em hardware antes de publicar.

## Repetir localmente
Use Node 22 ou posterior, execute `npm ci --prefix native` e `npm run build:web`, copie `www` para `native/www` e siga o workflow. As pastas nativas são geradas a partir de dependências fixadas, não do navegador hospedado. Não é preciso provisionar servidor para testar o jogo local.

## Assinatura e lojas
O identificador atual de teste é `br.com.puzzleorbis.app`; confirme o identificador definitivo antes do primeiro envio. O titular deve fazer a configuração de assinatura, aprovar contas/termos e autorizar o envio. Configure as credenciais no gerenciador de segredos da plataforma, nunca no código ou pelo chat. As contas de autenticação, quando configuradas, não devem enviar imagens, recordes ou saves a um servidor.
