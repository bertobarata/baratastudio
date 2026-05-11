# Barata Studio — Kanban de Lançamento

> Regra: sem novos estilos até a paleta estar fechada (Sprint 1 concluído).
> Paralelo útil: Sprint 1 + Sprint 2 podem correr juntos. Sprint 3 só entra depois.

---

## Legenda

| Estado | Símbolo |
|--------|---------|
| TODO   | `[ ]`   |
| DOING  | `[→]`   |
| DONE   | `[x]`   |

| Prioridade | Significado |
|------------|-------------|
| P1 | Bloqueia lançamento |
| P2 | Degrada qualidade real |
| P3 | Nice-to-have antes de lançar |

---

## Sprint 1 — Congelar Direção

**Agentes:** `03-color-material-designer` (principal) · `00-creative-director` (decisão) · `01-brand-strategist` (validação curta)
**Paralelo com:** Sprint 2 (estrutura)
**Output:** `brand-lock` — tokens finais, combinações proibidas/aprovadas

| Prioridade | Estado | Tarefa | Agente |
|------------|--------|--------|--------|
| P1 | `[x]` | Acento petróleo final: `#1A6870` (era `#145A61`) | `03` |
| P1 | `[x]` | Paleta dark mode completa definida e locked | `03` |
| P1 | `[x]` | Paleta light mode completa definida e locked | `03` |
| P1 | `[x]` | BB logo: ratio ~14:1 sobre bg-dark, ~15:1 sobre bg-warm (AAA) | `03` |
| P1 | `[x]` | 3 combinações proibidas documentadas em `brand-lock.md` | `03` |
| P1 | `[x]` | 3 combinações aprovadas com rácios de uso em `brand-lock.md` | `03` |
| P2 | `[x]` | Regra 80/15/5 documentada formalmente | `03` |
| P2 | `[x]` | Materiais oficiais definidos (vidro fumado, metal petróleo, papel off-white, sombra suave) | `03` |
| P2 | `[ ]` | Validar paleta contra posicionamento (não cosmética, não startup tech) | `01` |
| P2 | `[x]` | Tokens CSS atualizados + `--teal-rgb` e `--text-light-rgb` adicionados | `03` |

**Done quando:** toda a equipa usa a mesma paleta; logo funciona em claro e escuro; petróleo já não parece morto.

---

## Sprint 2 — Cortar Redundância

**Agentes:** `04-homepage-ux-architect` (principal) · `06-copy-messaging` (copy) · `00-creative-director` (validação)
**Paralelo com:** Sprint 1
**Output:** `homepage-v2-outline` — ordem, objetivo por secção, headline, transição visual

| Prioridade | Estado | Tarefa | Agente |
|------------|--------|--------|--------|
| P1 | `[x]` | Process Summary (`#process`) removida do HTML — sem âncoras partidas | `04` |
| P1 | `[x]` | Presence grid mantida — objetivo narrativo distinto de Projects (craft visível vs resultados) | `04` |
| P1 | `[x]` | Estrutura final: Hero · Manifesto · BB Depth · Process Layers · Presence · Serviços · Projetos · CTA | `04` |
| P1 | `[x]` | Cada secção avança argumento uma vez — sem repetição narrativa | `04` |
| P2 | `[x]` | Headlines e transições visuais documentadas em `homepage-v2-outline.md` | `04` |
| P2 | `[x]` | Nota de transição dark→light→dark por secção em `homepage-v2-outline.md` | `04` |
| P2 | `[ ]` | Reescrever copy do manifesto (mais seco, menos explicativo) | `06` |
| P2 | `[ ]` | Reescrever copy do CTA final (confiante, sem urgência forçada) | `06` |
| P3 | `[ ]` | Rever eyebrow labels de cada secção (Posicionamento / Identidade / Processo / Resultado) | `06` |
| P3 | `[ ]` | Escrever 3 versões do hero subtitle: seco / editorial / comercial | `06` |

**Done quando:** scroll sem déjà vu; nenhuma secção se desculpa; cada uma avança a narrativa.

---

## Sprint 3 — Resolver Animação Principal

**Agentes:** `05-motion-director` (principal) · `00-creative-director` (decisão go/no-go) · `04-homepage-ux-architect` (contexto UX)
**Depende de:** Sprint 2 (estrutura fixada)
**Output:** `hero-motion-spec` — estado inicial, estado em scroll, mobile fallback, perf budget, kill conditions

| Prioridade | Estado | Tarefa | Agente |
|------------|--------|--------|--------|
| P1 | `[x]` | Diagnóstico: conflito CSS transform + GSAP + `transform-style: preserve-3d` ausente | `05` |
| P1 | `[x]` | Bug corrigido: `transform-style: preserve-3d` adicionado ao `.hero-bb` | `05` |
| P1 | `[x]` | GSAP usa `gsap.set()` para estado inicial — elimina conflito com CSS transform | `05` |
| P1 | `[x]` | Hero funciona: parallax 3D com rotationY diferenciado, scrub 2/1.5/1 por camada | `05` |
| P2 | `[x]` | Mobile fallback: só `y` sem rotation, 30/16/8px, preserva performance | `05` |
| P2 | `[x]` | Idle breathing: bbFront 8px/4s + bbMid 4px/5.5s — hero tem vida sem scroll | `05` |
| P2 | `[ ]` | Testar hero com `prefers-reduced-motion` ativo (já tem handler, verificar visualmente) | `05` |
| P3 | `[x]` | Separação em planos com rotationY diferenciado já implementada | `05` |
| P3 | `[ ]` | Explorar vidro translúcido e highlight petróleo sobre as camadas (pós-validação visual) | `05` |
| P3 | `[ ]` | Testar em iOS Safari (breathing + parallax com Lenis não usado — verificar nativo) | `05` |

**Done quando:** hero funciona sem glitches; mobile não sofre; animação continua forte mesmo reduzida.

---

## Sprint 4 — Harden Técnico

**Agentes:** `04-homepage-ux-architect` (implementação) · `05-motion-director` (perf) · `00-creative-director` (QA final)
**Depende de:** Sprints 1-3
**Output:** `launch-hardening-checklist`

| Prioridade | Estado | Tarefa | Agente | Ref. audit |
|------------|--------|--------|--------|------------|
| P1 | `[x]` | Focus trap + Escape no menu mobile — sem foco a escapar do overlay | `04` | A11y P1 |
| P1 | `[x]` | Footer `<h4>` → `<p class="footer-title">` — hierarquia h2→h4 corrigida | `04` | A11y P1 |
| P1 | `[x]` | `border-left: 2px solid` removido — highlight via background + border-color | `04` | Anti-pattern P1 |
| P2 | `[x]` | 17 rgba hardcoded substituídos por `rgba(var(--teal-rgb), ...)` e `rgba(var(--text-light-rgb), ...)` | `04` | Theming P2 |
| P2 | `[x]` | `.header-monogram` 40→44px | `04` | Responsive P2 |
| P2 | `[x]` | WhatsApp float: `bottom: max(24px, calc(24px + env(safe-area-inset-bottom, 0px)))` | `04` | Responsive P2 |
| P2 | `[x]` | `loading="lazy"` em bb-depth (3 imgs) e cta-bb-bg; hero sem lazy | `04` | Perf P2 |
| P2 | `[x]` | Skip link adicionado — "Saltar para o conteúdo" visível no focus | `04` | A11y P2 |
| P3 | `[ ]` | Self-host fontes ou preload `<link rel="preload" as="font">` | `04` | Perf P3 |
| P3 | `[ ]` | Remover/fundir `button--ghost-light` | `04` | Consistency P3 |
| P3 | `[ ]` | Rever `footer-columns` max-width vs `footer-top` alinhamento | `04` | Layout P3 |

**Done quando:** Lighthouse melhora; keyboard navigation passa; site mais sólido sem mudar a cara.

---

## Sprint 5 — Fechar Prova e Lançar

**Agentes:** `06-copy-messaging` (copy) · `04-homepage-ux-architect` (estrutura) · `00-creative-director` (aprovação final)
**Depende de:** Sprints 1-4
**Output:** `release-candidate`

| Prioridade | Estado | Tarefa | Agente |
|------------|--------|--------|--------|
| P1 | `[ ]` | Substituir "Em breve" por conceitos curados, estudos visuais ou 1 projeto demo honesto | `06` + `04` |
| P1 | `[ ]` | Afinar CTA final (headline + body + botão) | `06` |
| P1 | `[ ]` | Testar homepage em desktop + mobile + teclado (completo) | `00` |
| P2 | `[ ]` | Rever todos os anchors e links (`formulario.html`, `precos.html`, `faq.html`) | `04` |
| P2 | `[ ]` | Rever focus states em todos os elementos interativos | `04` |
| P2 | `[ ]` | Verificar microcopy: labels, tooltips, placeholders, botões | `06` |
| P3 | `[ ]` | Rever Open Graph image e meta description | `04` |
| P3 | `[ ]` | Confirmar manifest.json e PWA icons estão corretos | `04` |
| P3 | `[ ]` | Teste final cross-browser (Safari, Chrome, Firefox) | `00` |

**Done quando:** homepage vende-se sozinha; nenhuma parte pede desculpa por não existir.

---

## Resumo Executivo

| Sprint | Foco | Agentes-chave | Pode correr em paralelo com |
|--------|------|---------------|----------------------------|
| 1 | Paleta final | `03`, `00`, `01` | Sprint 2 |
| 2 | Estrutura / cortar | `04`, `06`, `00` | Sprint 1 |
| 3 | Hero / motion | `05`, `00`, `04` | — (depende de S1+S2) |
| 4 | Harden técnico | `04`, `05`, `00` | — (depende de S1-S3) |
| 5 | Prova + lançamento | `06`, `04`, `00` | — (depende de S1-S4) |

**Hoje (Sprint 1+2):** lock paleta · remover duplicação de processo · decidir hero fallback
**Amanhã (Sprint 3+4):** reimplementar hero · corrigir border-left e tokens · acessibilidade
**Depois (Sprint 5):** prova social · copy final · lançamento
