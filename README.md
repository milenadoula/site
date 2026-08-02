# Site Milena Brandão — HTML estático

Site em HTML puro: sem build, sem dependências. Basta servir a pasta.

## Páginas
- `index.html` — home
- `doulagem.html`
- `amamentacao.html`
- `laserterapia.html`
- `aluguel-bombas.html`

## Estrutura
- `css/site.css` — estilos do site; importa os tokens do design system (`colors.css`, `typography.css`, `spacing.css`, `styles.css`)
- `js/site.js` — animação de entrada das seções e o formulário do e-book
- `assets/` — fotos e imagens de produto
- `assets/social/` — **a preencher**: prints de depoimento (`depo-1.jpg` … `depo-5.jpg`), avatar (`ig-avatar.jpg`) e posts do Instagram (`ig-1.jpg` … `ig-6.jpg`)

## Antes de publicar
1. Coloque as imagens de `assets/social/` (hoje os espaços aparecem vazios).
2. WhatsApp: o número `5544991252383` está nos links `https://wa.me/...`; troque com um localizar-e-substituir se mudar.
3. O formulário do e-book só simula o envio — conecte ao seu provedor de e-mail em `js/site.js`.

## Publicando
Funciona em qualquer hospedagem estática (GitHub Pages, Netlify, Vercel, Hostinger). No GitHub Pages, aponte para esta pasta ou mova o conteúdo para a raiz do repositório.
