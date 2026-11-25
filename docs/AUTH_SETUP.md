# Contas no Puzzle Orbis
Por padrão, o jogo roda offline sem conta. A opção de conta é configurada separadamente e não sincroniza fotos, saves ou recordes. Nenhuma credencial de usuário é enviada ao GitHub.

## Criar e preparar o ambiente
1. Use um projeto **próprio do Puzzle Orbis** no Supabase. Não reutilize o 24 H2O.
2. No dashboard do projeto, habilite e-mail/senha, habilite confirmação por e-mail, configure uma política mínima de 12 caracteres, proteção contra abuso e um SMTP autorizado. Os e-mails padrão do Supabase não são suficientes para um lançamento público.
3. Defina Site URL no domínio oficial HTTPS e adicione o endereço **exato** da tela `account.html` aos redirecionamentos permitidos. O fluxo usa PKCE; para recuperar a senha, abra o link no mesmo navegador que fez o pedido.
4. Envie para o processo de build apenas a URL pública do projeto, a chave **publishable** com prefixo `sb_publishable_` e o redirecionamento HTTPS. Não use chave secreta, service role ou senha no navegador. A página de conta em um build padrão permanece inativa.
   - `ORBIS_SUPABASE_URL`
   - `ORBIS_SUPABASE_PUBLISHABLE_KEY`
   - `ORBIS_AUTH_REDIRECT_URL`
5. Rode `npm ci --prefix auth` e `npm run build:web:auth`. Publique somente em hospedagem HTTPS sob o endereço configurado.

Antes de lançamento: teste cadastro, confirmação, login, logout, recuperação e expiração contra **um projeto de teste real**, valide a proteção de abuso e implemente/verifique o processo de exclusão de contas. O SDK usa sessão por navegador; a página não configura tabelas, bucket nem sincronização. O preparo não configura nem cria um projeto real.

Referência: [Supabase Auth: e-mail e senha](https://supabase.com/docs/guides/auth/passwords).
