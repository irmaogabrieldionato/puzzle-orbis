# 🧩 Puzzle Orbis

**Aplicativo multiplataforma de quebra-cabeças com imagens personalizadas (licença MIT).**

Este é o repositório oficial de **Puzzle Orbis**. O nome do aplicativo e do repositório é Puzzle Orbis.

## Funcionalidades planejadas e implementadas no pacote de desenvolvimento

- 10 níveis de 4 a 1.724 peças por imagem
- 1, 2 ou 3 imagens e mistura das peças
- cortes quadrados, retangulares, mistos e aleatórios
- 15 idiomas, zoom, dica, jogo por toque ou arraste
- PWA instalável em navegadores compatíveis
- projetos-base Capacitor (Android/iOS) e Tauri (Windows/Linux/macOS)
- autenticação Supabase preparada, ainda sem serviço ativo neste repositório

> **Status:** repositório inicializado. O código integral e os arquivos de build ainda precisam ser enviados. Não considerar o jogo publicado nem o cadastro habilitado até a conclusão dessa etapa.

## Verificação

Após enviar os arquivos completos, execute `npm test` no Codespaces ou no computador. O pacote revisado inclui testes de todas as 120 combinações (10 níveis × 4 cortes × 1–3 imagens) e de integridade das traduções.

Consulte a aba **Issues** para acompanhar publicação, testes e melhorias.

## Segurança

Não colocar chaves Supabase de serviço, senhas, SMTP nem credenciais no GitHub. O aplicativo lida com imagens localmente no navegador.
