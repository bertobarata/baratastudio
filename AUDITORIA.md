# Auditoria unificada: Barata Studio (light glass + terminal)

Fontes: **[I]** impeccable audit, **[U]** ui-ux-pro-max, **[T]** tasteskill.
Branch: `design/redesign` (sem commit). Atualizado a 2026-10-01 depois da ronda de correções com foco em mobile.

## Resultado

| | Antes | Depois |
|---|---|---|
| Pontuação impeccable | 13/20 (aceitável) | **18/20 (excelente, polimento)** |
| Lighthouse mobile, homepage | não medido | **Performance 99 · Acessibilidade 100 · Boas práticas 100 · SEO 100** |
| Lighthouse mobile, FAQ | não medido | Performance 99 · Acessibilidade 100 |
| Lighthouse mobile, formulário | não medido | Performance 93 · Acessibilidade 100 · SEO 100 |
| LCP mobile (homepage) | 3,2 s | **2,0 s** |
| CLS / bloqueio | 0 / 0 ms | 0 / 0 ms |
| Peso das fontes | 584 KB | **122 KB** |
| Elementos com blur na homepage | 16 | **2** (header + terminal do hero) |
| Etiquetas `// ` na homepage | 7 | **3** |

| Dimensão (impeccable) | Antes | Depois | Nota |
|---|---|---|---|
| Acessibilidade | 3 | 4 | Lighthouse 100; terminal focável; erros de formulário anunciados |
| Performance | 2 | 4 | Fontes em subset e com preload; hero sem depender de JS; blur reduzido |
| Responsivo | 3 | 4 | Alvos de 44px em toque; iOS sem zoom no terminal; zonas seguras |
| Tema | 3 | 3 | Tokens completos; light-only é decisão registada (sem modo escuro) |
| Anti-padrões | 2 | 3 | Restam o vidro como material e o terminal no hero, ambos escolhas tuas |

Medições: Lighthouse 12 local em modo mobile com throttling simulado; ecrãs a 390px e 1920px; contraste calculado em OKLCH.

---

## Estado dos 29 pontos

Legenda: ✅ feito · ⚠️ feito com nota · ⏸️ por decidir/precisa de ti

### P1

| # | Problema | Estado | O que foi feito |
|---|---|---|---|
| 1 | Hero invisível até o JS correr | ✅ | Entrada do hero por CSS puro (o título só desliza, nunca fica invisível). O reveal por scroll aplica-se só ao que está abaixo da dobra no carregamento. |
| 2 | Comico com 340 KB | ⚠️ | Subset latino de **50 KB** em `assets/fonts/web/`, com preload em todas as páginas, `font-display: optional` e cache no service worker. Nota: sem as alternativas contextuais, as letras repetidas ficam iguais. Numa primeira visita muito lenta pode aparecer a Zodiak no título; da segunda página em diante aparece sempre a Comico. Zodiak e JetBrains Mono também em subset. |
| 3 | Histórico do terminal não focável | ✅ | `tabindex="0"`, `role="log"`, `aria-label`, anel de foco visível. |
| 4 | Etiquetas `//` em 7 secções | ✅ | Ficam 3: hero, Processo, Projetos. |

### P2

| # | Problema | Estado | O que foi feito |
|---|---|---|---|
| 5 | Hero fora das regras | ✅ | Título a toda a largura, em **2 linhas** no desktop; texto + botões à esquerda e terminal à direita por baixo; frase "Resposta em menos de 24h..." retirada do hero (já está no CTA final e no terminal); padding do topo reduzido. |
| 6 | 4 rótulos para a mesma intenção | ✅ | **"Pedir proposta"** em header, hero, serviços, CTA final, rodapé, menu mobile e tooltip do botão flutuante. O segundo botão do CTA final passou a **"Falar no WhatsApp"** (intenção diferente). |
| 7 | Cabeçalho dividido + 4 secções seguidas em duas colunas | ✅ | Manifesto empilhado; processo empilhado (título em cima, log a toda a largura). Agora há no máximo 2 secções seguidas em colunas. |
| 8 | Alvos de toque pequenos | ✅ | Em ecrãs de toque: chips 44px, campo do terminal 44px, links do terminal com área maior, "Ver projeto", links do rodapé, contactos do CTA, logótipo, navegação e aviso de cookies a 44px. |
| 9 | Formulário sem estados | ✅ | Validação ao sair do campo; mensagens em português por baixo de cada campo, ligadas por `aria-describedby`; resumo "Há N campos por corrigir" numa linha de estado; foco no primeiro erro; botão "A abrir o WhatsApp…" enquanto abre; reposição ao voltar; `<noscript>` com o email. Nomes dos campos inalterados. |
| 10 | Sem modo escuro | ⚠️ | **Decidi light-only** por defeito (foi a tua escolha de tema) e registei-o em `PRODUCT.md` e com `<meta name="color-scheme" content="light">`. Se quiseres modo escuro, é uma ronda à parte. |
| 11 | 16 camadas de blur | ✅ | Blur só em header, terminal do hero, menu mobile e aviso de cookies. O resto passou a painel translúcido sem blur. Adicionado `prefers-reduced-transparency`. |
| 12 | Terminal como hero | ⚠️ | Mantido (decisão tua). Agora é mais útil: lista numerada de projetos e comando `abrir N`, que abre o site do projeto. Captura real no hero não adicionada, para não sobrecarregar. |
| 13 | Métricas em cartão e números por verificar | ✅ | Visual corrigido: linhas tipográficas em vez de cartões. O "Performance Google 100/100" do Greenbond era falso (Lighthouse: 65 mobile, 85-86 desktop) e foi trocado por **"Acessibilidade Google 100/100"**, verificado no Lighthouse a 2026-10-01 em mobile e desktop. "800+ agendas" mantido (dado do cliente, não verificável por mim). |
| 14 | `precos.html` com 404 | ✅ | `precos.html` mínima com redirect para a home, `noindex` e canonical. `Redirect 301` no `.htaccess` (caso um dia uses Apache). Fora do sitemap. |
| 15 | `servico-exemplo.html` órfã | ✅ | Apagada. |
| 16 | Escala de cantos sem regra | ✅ | pill / 28 / 22 / 12, documentada no topo do CSS e no `design.md`. |
| 17 | `DESIGN.md` desatualizado | ✅ | `design.md` e `DESIGN.json` reescritos para o sistema light glass + terminal. |

### P3

| # | Problema | Estado | O que foi feito |
|---|---|---|---|
| 18 | Pontos de janela em todo o lado | ✅ | Só no terminal do hero. Saíram do terminal do processo e das 7 molduras de projeto. |
| 19 | Cursor a piscar no logótipo | ✅ | Removido. Fica só o cursor nativo no campo do terminal. |
| 20 | `addEventListener('scroll')` | ✅ | Trocado por IntersectionObserver com sentinela; leitura de posições agrupada (sem reflow forçado). |
| 21 | Ficheiros mortos e `cnr.webp` pesado | ✅ | 4 `phone-*.webp` apagados; `cnr.webp` 232 → 142 KB (foto de folhagem, q60). |
| 22 | Imagens sem `width`/`height` | ✅ | 1200×750 em todas, mais `decoding="async"`. |
| 23 | Etiquetas mono pequenas | ✅ | Mínimo 0,78rem (12,5px). |
| 24 | Teal a 3,9:1 sobre a aurora | ✅ | Etiquetas pequenas em `--teal-deep` (10:1). |
| 25 | z-index arbitrário | ✅ | Tokens: float 90, header 100, overlay 120, toast 150, skip 200. |
| 26 | Cores soltas | ✅ | Tudo em tokens (`--ok`, `--dot-*`, `--whatsapp`, `--term-chip`...). |
| 27 | Humor no terminal | ✅ | "sudo" removido; mensagens funcionais. |
| 28 | Em dashes no texto legal | ✅ | Os 3 travessões da política de privacidade do Meet Tracker trocados por parênteses, com aprovação do Berto. Zero em dashes visíveis no site (fora dos `<title>`). |
| 29 | `color-scheme` em falta | ✅ | Adicionado em todas as páginas. |

### Extra (mobile, fora da lista original)

- Aviso de cookies quase opaco: o link tinha 2,98:1 sobre o terminal (Lighthouse). Agora passa.
- `scroll-padding-top` para os links de âncora não ficarem escondidos debaixo do header fixo.
- Botão do WhatsApp e aviso de cookies respeitam a zona segura do iPhone.
- Menu mobile com scroll próprio e itens de 56px.
- Botões ocupam a largura toda em ecrãs até 560px.

---

## O que falta

1. **Testar num telemóvel real** (o Berto testa em casa). Medi em emulação: Lighthouse mobile e iframe a 390px.
2. Link inverso e estilo partilhado no `bertobarata.com`.
3. Rever o "800+ agendas" da Ludy Artes se houver número atualizado.
