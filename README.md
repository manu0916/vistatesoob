# Tesoob — página inicial independente

Esta versão contém somente a página inicial e o painel `/admin`. Não há loja, contas de clientes nem chat no site. Os botões de encomenda abrem o WhatsApp; links de referências incluem a identificação da peça na mensagem. O contato é editável pelo painel.

## Desenvolvimento local

Requer Node.js 22.13 ou mais recente.

1. `npm ci`
2. Copie `.dev.vars.example` para `.dev.vars` e defina um e-mail e uma senha forte (12 caracteres ou mais). O arquivo real é ignorado pelo Git.
3. `npm run dev`
4. Acesse `/admin`, entre e salve o número com DDI (ex.: `+55 35 99999-9999`) ou um link oficial `https://wa.me/5535999999999`.

O desenvolvimento usa um D1 local. Antes da primeira configuração, os botões abrem o WhatsApp sem destinatário fixo. Não há número de cliente ou credenciais gravados no repositório.

## Publicação

O projeto Cloudflare Pages `vistatesoob` usa o banco D1 separado `tesoob-temp`, vinculado como `DB`. No Pages, o comando de build deve ser `npm run build:pages` e a saída `.pages-dist`. A configuração usada pelo deploy manual fica em `deploy/wrangler.pages.jsonc`, fora da raiz, para não substituir o comando de build da integração Git. Configure `TESOOB_ADMIN_EMAIL` e `TESOOB_ADMIN_PASSWORD` como secrets do Pages. Não compartilhe o banco nem as credenciais com o site original. O esquema é criado automaticamente no primeiro acesso. Execute `npm run deploy` para validar e publicar a aplicação.
