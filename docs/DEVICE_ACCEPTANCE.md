# Aceitação em dispositivos físicos

Use o mesmo SHA do artefato aprovado em CI. Registre sistema, versão, modelo, SHA, artefato, resultado e evidência para cada cenário. Não use fotos pessoais: escolha três PNGs de teste distintos. Não confunda emulador ou simulador com hardware.

| Cenário | Resultado esperado |
|---|---|
| Instalação e abertura sem rede após preparação | Jogo disponível sem conta; nenhuma solicitação de login obrigatório |
| Selecionar PNG pelo seletor nativo | Imagem correta, tabuleiro utilizável; cancelar seletor preserva estado |
| Quatro modalidades de corte | Cada modalidade inicia e permite concluir uma partida de quatro peças |
| Uma, duas e três imagens | Todas as imagens selecionadas participam; conclusão exige todos os tabuleiros |
| Pausar por 10 segundos e retomar | Tempo não avança durante pausa; volta a avançar ao retomar |
| Concluir e aguardar 10 segundos | Cronômetro permanece parado; melhor tempo registrado |
| Repetir a mesma partida | Tempo atual reinicia; recorde anterior permanece até ser superado |
| Reiniciar processo após salvar | Tabuleiro, configuração e tempo salvo são restaurados |
| Desistir | Partida encerrada sem criar recorde de conclusão |
| Apagar partida salva | Confirmação explícita; partida apagada não reaparece após reiniciar |
| Alterar idioma e reabrir offline | Preferência preservada; controles legíveis inclusive em árabe e urdu |
| Rotação e janela pequena | Tabuleiro e controles acessíveis sem perda de estado |

## Registro por plataforma

- Android: APK debug em aparelho físico; não enviar à loja.
- iOS: requer pacote assinado para dispositivo; ZIP de simulador não satisfaz este requisito.
- Windows: executar ZIP portátil em máquina física.
- Linux: instalar DEB em máquina física compatível.

Não marque cenário como aprovado sem execução e evidência. Falhas devem registrar passos, resultado observado e esperado. Repetir cenários afetados após correção e vincular novo SHA. Não habilitar conta real sem projeto próprio e validação conforme AUTH_SETUP.md. Não publicar nas lojas durante esta etapa.
