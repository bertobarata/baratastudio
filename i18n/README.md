# Traduções (PT · EN · FR · ES)

O português é a fonte. As páginas em `/en/`, `/fr/` e `/es/` são **geradas**: não se editam à mão.

## Quando mudares texto em PT

1. Edita `index.html`, `faq.html` ou `formulario.html` (na raiz).
2. Corre:
   ```bash
   python3 scripts/build-i18n.py
   ```
3. Se aparecer `untranslated`, junta a frase PT e a tradução a `i18n/en.json`, `i18n/fr.json` e `i18n/es.json` (chave = texto PT exato) e corre outra vez.

O script também:
- escreve o seletor de idioma (header, hero e rodapé) e os `hreflang` em todas as versões, incluindo as PT;
- ajusta canonical, `og:url`, `og:locale` e `lang`;
- traduz o JSON-LD;
- regenera o `sitemap.xml` com as alternativas por língua.

## O que fica só em PT

Páginas legais (privacidade, cookies, termos) e as páginas do Meet Tracker. Nas outras línguas, o rodapé indica "(PT)".

## Texto no JavaScript

- `js/site.js`: menu mobile, botão do WhatsApp, validação e envio do formulário (`I18N`).
- `js/home.js`: terminal; pastas e mensagens por língua (`M` e `DEF`). Os nomes de pasta de qualquer língua funcionam em todas.
- `js/cookie-consent.js`: aviso de cookies (`TEXTS`).
