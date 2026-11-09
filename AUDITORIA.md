# Auditoria completa: baratastudio.com

Fontes: **[I]** impeccable audit, **[U]** ui-ux-pro-max, **[T]** tasteskill. **[B]** é feedback direto do Berto.
Data: 2026-11-09, produção depois do PR #20 (b84fa86). Âmbito:
- 12 páginas: PT, mais a home em EN, FR e ES;
- 2 larguras: 1440x900 e 390x844 (telemóvel);
- tema claro e tema escuro.

A auditoria focada na navegação (Lote 1, já corrigido) e a de outubro estão no histórico do git deste ficheiro.

## 1. Resumo

- Lighthouse mobile em produção:

  | Página | Performance | Acessibilidade | Boas práticas | SEO | LCP |
  |---|---|---|---|---|---|
  | Home | 99 | 100 | 100 | 100 | 1,9 s |
  | FAQ | 100 | 100 | 100 | 100 | 1,7 s |
  | Formulário | 100 | 100 | 100 | 100 | 1,8 s |

  CLS 0 em todas.
- impeccable: **17/20** (bom).
- Problemas: **1 P1**, **4 P2**, **3 P3**.
- As medições técnicas estão limpas: 0 scroll horizontal e 0 textos com contraste insuficiente nas 48 combinações (12 páginas x 2 larguras x 2 temas).
- O ponto fraco é a experiência do menu no telemóvel e no tablet, e algum texto e alvos de toque pequenos.

## 2. Notas por ferramenta

### impeccable

| Dimensão | Score | Achado-chave |
|---|---|---|
| Acessibilidade | 4 | Lighthouse 100 nas 3 páginas; 0 falhas de contraste; foco visível; imagens com alt; títulos sem saltos |
| Performance | 4 | 99 a 100, LCP 1,7 a 1,9 s, CLS 0; imagens com lazy loading e dimensões |
| Responsivo | 3 | Sem scroll horizontal; menu móvel apertado (P1); alguns alvos e textos pequenos (P2) |
| Theming | 4 | Tokens completos; tema escuro sem falhas de contraste |
| Anti-padrões | 2 | Travessões nos títulos das páginas PT; vidro em 8 regras CSS; terminal falso no hero do desktop (decisão registada) |
| **Total** | **17/20** | Bom |

### ui-ux-pro-max

| Categoria | Veredito |
|---|---|
| 1 Acessibilidade | Passa |
| 2 Toque | **Falha parcial**: seletor de idioma no rodapé com 40px de altura, caixa de consentimento com 22x22 |
| 3 Performance | Passa |
| 4 Layout | **Falha**: menu do telemóvel e do tablet apertado, secção de projetos com 5.114px de altura no telemóvel |
| 5 Tipografia e cor | Falha parcial: texto abaixo de 14px no telemóvel (o mais pequeno é o © no rodapé, com 10,4px) |
| 6 Animação | Passa (respeita `prefers-reduced-motion` no CSS e no JS) |
| 7 Estilo | Passa |
| Pre-Delivery | Passa: contraste, foco, alt, reduced motion e as larguras 375, 768, 1024 e 1440. Falha: alvos de 44px |

### tasteskill

- **Design Read:** estúdio de uma pessoa em Lisboa; artesanal, calmo e credível; vidro claro com um toque técnico de terminal; registo de marca.
- **Dials:**

  | Dial | Atual | Recomendado |
  |---|---|---|
  | Variância | 6 | 6 |
  | Densidade | 4 | 3 no menu móvel, 4 no resto |
  | Movimento | 4 | 4 |
- **Pre-Flight:** 20 de 23 passam.
  - Falha: travessões nos títulos (9.G).
  - Falha: pontos médios em excesso, 3 linhas com 2 ou mais "·" (9.F).
  - Falha: terminal falso no hero (9.F). É uma decisão de marca registada e só aparece no desktop desde o PR #18.
  - Passa: só 3 etiquetas por cima dos títulos em 8 secções (o limite é 3).

## 3. Problemas unificados

### P1

**P1-1. O menu do telemóvel e do tablet está apertado e confuso** [B][U][T]
- Local: `js/site.js:152` (`enhanceMobileMenu`) e o bloco `@media (max-width: 1024px)` em `css/styles.css`.
- Evidência, a partir das capturas do menu aberto a 390px e 820px:

  | O que se vê | Porque é um problema |
  |---|---|
  | 9 blocos empilhados e centrados na vertical: "NAVEGAR", 3 links, "FALAR", botão, 3 contactos em texto simples, texto de rodapé | Tudo amontoado no meio do ecrã |
  | Os primeiros 230px do ecrã ficam vazios, só com um X | Espaço desperdiçado |
  | A marca desaparece e o botão "Fechar" fica tapado pelo próprio menu | Há dois controlos de fechar e um deles não se vê |
  | No tablet o botão estica a 756px e as setas ficam a 756px dos rótulos | O menu parece esticado e vazio |
  | Não há seletor de idioma | Nas páginas interiores do telemóvel o idioma só se muda no rodapé |
- Correção:
  1. O header fica por cima do menu, com a marca e "Menu"/"Fechar" no mesmo sítio, e sai o X flutuante.
  2. Os links principais ficam no topo, com mais espaço entre eles; saem as etiquetas "NAVEGAR" e "FALAR" e o texto de rodapé.
  3. As ações ficam em baixo: o botão, uma linha com 3 botões de contacto e o seletor de idioma.
  4. Coluna com no máximo 560px.
  5. Entrada suave dos itens, desligada com `prefers-reduced-motion`.

### P2

**P2-1. Travessões nos títulos das 8 páginas PT** [I][T]
- Local: `<title>`, `og:title` e `twitter:title` de `index.html`, `faq.html`, `formulario.html`, das páginas legais e das do MetTracker. Exemplo: "FAQ — Perguntas Frequentes — Barata Studio".
- Evidência: o varrimento encontrou 8 páginas PT. As versões EN, FR e ES já não os têm.
- Os títulos aparecem no separador do browser e nos resultados do Google.
- Correção: "FAQ · Barata Studio" ou "FAQ | Barata Studio".

**P2-2. Alvos de toque abaixo de 44px no telemóvel** [I][U]
- Evidência:

  | Elemento | Tamanho | Onde |
  |---|---|---|
  | Seletor de idioma do rodapé | 45x40 | 14 páginas |
  | Caixa de consentimento do formulário | 22x22 | formulário |
  | Link "FAQ" no rodapé EN/FR | 33x44 | home EN e FR |
- Correção: `min-height: 44px` no seletor do rodapé; área de toque de 44px na caixa, através do `label`; `min-width: 44px` nos links do rodapé.

**P2-3. Texto abaixo de 14px no telemóvel** [U]
- Evidência:

  | Texto | Tamanho | Onde |
  |---|---|---|
  | © do rodapé | 10,4px | todas as páginas |
  | Estados das apps, "Em desenvolvimento" e etiqueta "Email" | 11,84px | home |
  | Título do rodapé e etiquetas de secção | 12,48px | home e rodapé |
  | Botão "Menu" | 13,44px | todas as páginas |

  O texto corrido (17px) está bem.
- Correção: mínimo de 12,5px nas etiquetas mono em maiúsculas e 13px no ©. Não é preciso chegar aos 14px em tudo: as maiúsculas com espaçamento leem-se maiores.

**P2-4. A secção de projetos ocupa 38% da home no telemóvel** [U][T]
- Evidência: a secção tem 5.114px de altura numa página de 13.287px a 390px. No desktop tem 2.800 de 9.296px.
- Correção: no telemóvel mostrar os 2 projetos em destaque e pôr "Outros projetos" numa lista compacta que abre ao toque.
- É uma decisão de conteúdo (secção 6).

### P3

**P3-1. Pontos médios em excesso.** "SwiftUI · SwiftData · CloudKit", "Next.js · Ollama · LanceDB" e a linha das línguas. Usar vírgulas ou quebras de linha. [T]

**P3-2. O aviso de cookies é alto no telemóvel.** Tem cerca de 230px a 390px e tapa o início dos projetos na primeira visita. Pôr o texto numa linha e os botões lado a lado. [U]

**P3-3. Vidro em 8 regras CSS.** É uma escolha registada. Manter, mas não acrescentar mais. [I]

## 4. O que está bem

- Performance e acessibilidade de topo em produção: 99 a 100, CLS 0, LCP abaixo de 2 s.
- Contraste aprovado em todos os textos, no tema claro e no escuro.
- i18n completo: 5 hreflang por página, canonical certo, sitemap com 17 URLs e alternates.
- Imagens com alt, dimensões e lazy loading; títulos sem saltos; foco visível; movimento reduzido respeitado.
- O "100/100 Acessibilidade Google" do Greenbond é verdade (Lighthouse 100).
- Header do desktop limpo e navegação sem scroll horizontal (PR #20).

## 5. Ordem de ataque

1. **Lote 2:** P1-1, o redesenho do menu móvel.
2. **Lote 3:** P2-1, P2-2, P2-3 e P3-1 (títulos, alvos, tamanhos, pontos).
3. **Lote 4:** P2-4 e P3-2, depois da decisão de conteúdo.

## 6. Decisões do Berto

- P2-4: encurtar a lista de projetos no telemóvel?
- Terminal no hero do desktop: manter, porque é a assinatura da marca (decisão já registada).
