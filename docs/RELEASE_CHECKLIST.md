# Puzzle Orbis: prontidão para lançamento
Esta lista separa a prévia jogável privada da publicação de uma versão final. Para qualquer entrega, registre a revisão exata e o resultado de cada plataforma; não reutilize resultados de um commit diferente para afirmar que a revisão atual passou.

## Testes já automatizados
- `npm test` testa a lógica, dez contagens, geometria/limites, tradução, cronômetro, recordes, salvamento, integração de interface e cache.
- `npm run build:web` cria `www/`. Os testes de Chromium cobrem abertura, jogabilidade por toque em viewport móvel, teclado, 1/2/3 imagens, troca entre tabuleiros, saves antigos, um save grande, localização persistida e RTL, imagens PNG dos ícones e primeira visita seguida de abertura offline.
- O fluxo nativo cria Android (APK debug e AAB sem chave de produção), Windows x64 portátil, DEB Linux x64 e app para simulador iOS. Os computadores de CI validam inicialização no Windows/Linux; uma compilação móvel não substitui teste instalado.

## Casos mínimos em hardware
1. Android e iOS: instalação da build de teste; abrir JPG em retrato, PNG transparente, WebP e paisagem. Trocar e pausar nos quatro cortes, alternar a orientação, fechar/reabrir e recuperar o save. A build do simulador iOS não instala em iPhone.
2. Windows/Linux: instalar quando aplicável, abrir arquivos do usuário, restaurar partida com imagem grande e validar desinstalação sem surpreender o usuário sobre dados locais.
3. Web por HTTPS: abrir em Safari/Chrome, instalar como PWA onde suportado, desligar a rede e confirmar os dois modos. Testar 4, 862 e 1724 peças, alteração de zoom, navegação por teclado e tempo de redraw; registrar ambiente e medições. Não confundir motores de browser com celulares físicos.
4. Idiomas: verificar textos das duas telas nos 15 idiomas, inclusive árabe e urdu com os tabuleiros sem espelhamento. Nomes e nuance precisam de revisão linguística humana antes de uma distribuição final multilíngue.

## Privacidade e conta
- A versão padrão roda sem conta. Imagens, recordes e saves não sincronizam.
- Concluir o fluxo em um projeto de autenticação dedicado e testar e-mail e recuperação reais, limite de tentativas, sessões expiradas e revogação. Ver [AUTH_SETUP.md](AUTH_SETUP.md).
- Especificar e testar exclusão de conta antes de oferecê-la publicamente. Preparar política de privacidade com coleta e retenção que reflitam a configuração real e revisar exigências das lojas para a região. Apoiar apagar saves locais sem misturar essa operação com apagar conta.
- Não enviar chaves secretas, credenciais ou fotos de teste ao GitHub e não ativar integrações pagas por padrão.

## Preparar a entrega
- Capturas reais por plataforma e descrição fiel, sem anunciar conta, sincronização ou distribuição ainda indisponíveis.
- Confirmar identificador definitivo, versão, certificados e processo de assinatura com o titular. Ver [NATIVE_BUILDS.md](NATIVE_BUILDS.md).
- Usar canal de teste interno, validar em hardware, registrar critérios de aceite e obter aprovação do titular antes do envio público.
