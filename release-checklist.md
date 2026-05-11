# release-checklist

Status: in progress
Owner: `07-qa-accessibility-release-manager`
Updated: 2026-05-11

## Estado atual

Base técnica anterior absorvida de [`launch-hardening-checklist.md`](/Users/berto_barata/Developer/bertobarata-website/launch-hardening-checklist.md).

## Fechado no repositório

- `skip-link` presente nas páginas principais e legais
- menu mobile com focus trap, `Escape`, clique fora, `aria-current` e lock de scroll
- links internos do footer já apontam para páginas existentes
- formulário convertido para abertura de mensagem via WhatsApp com dados preenchidos
- `canonical`, `og:url`, `og:image`, `theme-color` e `manifest.json` alinhados
- `sitemap.xml` atualizado com páginas legais
- `service-worker.js` com cache version nova para invalidar assets antigos
- validação local de sintaxe do `js/site.js` concluída
- o fluxo antigo de `wa.me` ficou removido das páginas principais, da página de exemplo e do template de referência

## Ainda por validar em browser real

- keyboard flow completo em mobile menu, FAQ e formulário
- comportamento visual mobile, safe areas e botão WhatsApp
- animações e sticky sections na homepage
- compatibilidade Safari / Chrome / Firefox
- partilha Open Graph e favicon/apple touch icon em dispositivos reais
- submissão do formulário e abertura correta da mensagem no WhatsApp

## Riscos abertos

- é preciso confirmar em browser real que o WhatsApp abre com todos os campos preenchidos como esperado
- textos legais são base operacional e devem ser revistos juridicamente antes de produção final

## Go/No-Go

- `No-Go` para lançamento cego sem teste real em browser
- `Go condicional` depois de validar formulário, mobile, teclado e smoke test em GitHub Pages
