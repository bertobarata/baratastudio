# Auditoria: navegação em telemóvel e tablet (baratastudio.com)

Fontes: **[I]** impeccable audit, **[U]** ui-ux-pro-max, **[T]** tasteskill.
Data: 2026-11-09. Base: `origin/main` (de76100 + PRs #18 e #19). Foco pedido pelo Berto: menu/header em tablet e telemóvel.
A auditoria geral anterior (2026-10-01, 18/20) continua no histórico do git deste ficheiro.

## 1. Resumo

- Lighthouse mobile, homepage (servidor local sem compressão): **Performance 92 · Acessibilidade 100 · Boas práticas 100 · SEO 100**. FCP 1,7 s, LCP 3,2 s, TBT 110 ms, CLS 0.
- impeccable: **16/20** (bom). A descida face aos 18/20 de outubro vem toda do Responsivo.
- Problemas: **2 P1**, **2 P2**, **2 P3**.
- Causa principal: um brilho decorativo alarga a página. No telemóvel isso desloca o header e corta o menu aberto. No tablet, o header das páginas interiores não cabe.

## 2. Notas por ferramenta

### impeccable

| Dimensão | Score | Achado-chave |
|---|---|---|
| Acessibilidade | 4 | Lighthouse 100; alvos de 44px no header e no menu |
| Performance | 3 | 92 em local; LCP 3,2 s (outubro: 2,0 s), a medir de novo em produção |
| Responsivo | 2 | Scroll horizontal na home em todas as larguras; header do tablet transborda até 168px |
| Theming | 4 | Tokens completos, header usa o mesmo vidro em todas as páginas |
| Anti-padrões | 3 | Vidro e terminal são escolhas registadas; sem travessões no header |
| **Total** | **16/20** | Bom |

### ui-ux-pro-max

| Categoria | Veredito |
|---|---|
| 1 Acessibilidade | Passa (Lighthouse 100, foco visível, `aria-expanded` no botão Menu) |
| 2 Toque | Passa no header (44px). O menu aberto perde 4px à direita no telemóvel (P1-1) |
| 3 Performance | Aceitável (92), sem impacto da navegação |
| 4 Layout | **Falha**: scroll horizontal (P1-1) e header que não cabe entre 769 e 900px (P1-2) |
| 5 Tipografia e cor | Passa |
| 6 Animação | Passa (menu com fade de 220 ms, respeita `prefers-reduced-motion`) |
| 7 Estilo | Passa |

### tasteskill

- **Design Read:** estúdio de uma pessoa, artesanal e calmo, com vidro claro e um toque técnico de terminal.
- **Dials:** variância 6 (manter 6), densidade 4 (manter 4), movimento 4 (manter 4).
- **Pre-Flight, só para a navegação:** 9 de 11 passam. Falham "sem scroll horizontal em nenhum breakpoint" e "nav colapsa antes de partir".

## 3. Problemas unificados

### P1

**P1-1. A home é mais larga do que o ecrã em todas as larguras** [I][U][T]
- Local: `css/styles.css:372`, `.hero-terminal::before, .ice-glow::before { inset: -18% -10% }`. O culpado é o `.ice-glow` da secção de processo (`index.html:361`).
- Evidência (Playwright):

  | Ecrã | Área da página | Efeito |
  |---|---|---|
  | 390px (telemóvel) | 410px | header de 16 a 394px, assimétrico; no menu aberto as setas → e o botão "Pedir proposta" ficam 4px fora do ecrã |
  | 820px | 864px | scroll horizontal |
  | 1280px | 1348px | scroll horizontal |

  Desligando o `.ice-glow::before`, a página fica com 390px e 820px exatos.
- Correção: `html { overflow-x: clip; }`. Testado: 390, 820 e 1280 ficam exatos e os brilhos continuam visíveis. Usar `clip` e não `hidden`, para não partir `position: sticky`.

**P1-2. Header das páginas interiores transborda no tablet (769 a 900px)** [I][U][T]
- Local: `css/styles.css:273` (header em flex) e `:813` (o menu "Menu" só entra até 768px). Afeta FAQ, formulário, páginas legais e MetTracker, nas 4 línguas.
- Evidência: o conteúdo do header ultrapassa o próprio header em 168px a 769px, 119px a 820px e 39px a 900px. O botão "Pedir proposta" fica cortado a partir de "PEDIR PR". A marca, os 3 links, o seletor de idioma e o botão somam cerca de 900px.
- Na home, o header passou a aparecer no tablet com o PR #18. Cabe, mas é diferente do das outras páginas.
- Correção:
  - usar o menu "Menu" (o mesmo do telemóvel) até 1024px, em todas as páginas;
  - no `site.js` há 3 sítios com `max-width: 768px` (`:218`, `:243`, `:257`) que passam a usar o mesmo limite;
  - o seletor de idioma continua no rodapé e no hero.

### P2

**P2-1. O aviso de cookies tapa o menu aberto no primeiro acesso** [U]
- Local: `css/styles.css:755`, `#cookie-banner` com `z-index: var(--z-toast)` (150), acima do menu (120).
- Evidência: captura do menu aberto a 390px. O aviso cobre "@berto_barata" e o rodapé do menu.
- Correção: com o menu aberto, esconder o aviso (`body:has(.top-nav ul.open) #cookie-banner { visibility: hidden }`). Ele volta quando o menu fecha.

**P2-2. Botão do WhatsApp e header têm comportamentos diferentes entre 769 e 1024px** [U]
- Local: `js/site.js:257`. Até 768px o botão abre o WhatsApp diretamente; acima disso abre o formulário, também num tablet com toque.
- Correção: usar o mesmo limite de 1024px, ou decidir pelo tipo de dispositivo (`pointer: coarse`).

### P3

**P3-1. O limite 768px está repetido em 3 sítios do `site.js`.** Passar para uma única constante, para não voltarem a ficar diferentes do CSS. [I]

**P3-2. O LCP mobile voltou a 3,2 s** (era 2,0 s em outubro). Medido em local, sem compressão nem cache. Medir em produção antes de agir. [I]

## 4. O que está bem

- Header e menu com alvos de 44px, `aria-expanded`, foco visível, fecho com Esc, X e toque num link.
- Menu do telemóvel bem desenhado: secções Navegar e Falar, botão claro para pedir proposta.
- Acessibilidade Lighthouse 100.
- A afirmação "100/100 Acessibilidade Google" no projeto Greenbond foi verificada nesta sessão e está certa: greenbond.pt dá 100.

## 5. Ordem de ataque

1. **Lote 1 (um PR):** P1-1 + P1-2 + P2-1 + P2-2 + P3-1. Verificar a 390, 768, 820, 1024, 1025 e 1280px, em PT e FR, que é a língua com os rótulos mais longos.
2. **Lote 2:** P3-2. Correr o Lighthouse em produção e só depois decidir.

## 6. Decisões do Berto

- Menu "Menu" até 1024px em vez de links no header do tablet. Recomendado: é o que garante que nada parte com rótulos mais longos em FR e ES.
