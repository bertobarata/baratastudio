# Barata Studio — Kanban por Fase

> Regra do sistema: o trabalho avança por gate aprovado. Se uma mudança nova tocar numa decisão já fechada, regressa à fase dona dessa decisão.

## Legenda

| Estado | Símbolo |
|---|---|
| Por fazer | `[ ]` |
| Em curso | `[→]` |
| Feito | `[x]` |
| Bloqueado | `[!]` |

## Fase 1 — Estratégia

- Agentes: `00-creative-director` + `01-brand-positioning-strategist`
- Output obrigatório: `positioning-brief`
- Gate: objetivo da página, público, objeções e prova fechados

| Estado | Prioridade | Tarefa |
|---|---|---|
| `[ ]` | P1 | Fechar `positioning-brief.md` com proposta de valor, objeções, provas e tom |
| `[ ]` | P1 | Validar se a homepage atual responde a confiança e contacto, não só craft |
| `[ ]` | P2 | Formalizar prova social mínima necessária para o lançamento |

## Fase 2 — Conversão e Estrutura

- Agentes: `02-conversion-ux-architect` + `00-creative-director`
- Output obrigatório: `page-flow-spec`
- Gate: narrativa, hierarquia e CTAs aprovados

| Estado | Prioridade | Tarefa |
|---|---|---|
| `[x]` | P1 | Estrutura-base da homepage documentada em `homepage-v2-outline.md` |
| `[ ]` | P1 | Promover `homepage-v2-outline.md` para `page-flow-spec.md` com CTA map por página |
| `[ ]` | P1 | Definir papel explícito de `precos.html`, `faq.html` e `formulario.html` no funil |
| `[ ]` | P2 | Garantir que pedidos como "melhorar hero" ou "refazer CTA" entram nesta fase antes de copy ou visual |

## Fase 3 — Sistema Visual

- Agentes: `03-visual-system-designer` + `00-creative-director`
- Output obrigatório: `visual-system-lock`
- Gate: tokens, tipografia, composição e consistência cross-page locked

| Estado | Prioridade | Tarefa |
|---|---|---|
| `[x]` | P1 | Base de tokens e materiais já documentada em `brand-lock.md` |
| `[ ]` | P1 | Promover `brand-lock.md` para `visual-system-lock.md` com regras por página |
| `[ ]` | P1 | Rever consistência visual entre `index.html`, `precos.html`, `faq.html` e `formulario.html` |
| `[ ]` | P2 | Formalizar componentes visuais aprovados e padrões proibidos |

## Fase 4 — Motion e Comportamento

- Agentes: `04-motion-interaction-director` + `00-creative-director`
- Output obrigatório: `motion-spec`
- Gate: motion útil, controlado e com fallbacks

| Estado | Prioridade | Tarefa |
|---|---|---|
| `[ ]` | P1 | Consolidar hero motion e restantes interações em `motion-spec.md` |
| `[ ]` | P1 | Definir budget de performance, fallbacks mobile e `prefers-reduced-motion` |
| `[ ]` | P2 | Separar claramente comportamento animado do sistema visual estático |

## Fase 5 — Copy

- Agentes: `05-copy-messaging-editor` + `00-creative-director`
- Output obrigatório: `copy-pack`
- Gate: headlines, CTA e microcopy aprovados

| Estado | Prioridade | Tarefa |
|---|---|---|
| `[ ]` | P1 | Criar `copy-pack.md` com hero, manifesto, CTA e microcopy crítica |
| `[ ]` | P1 | Reescrever texto repetitivo e reforçar prova social |
| `[ ]` | P2 | Garantir que `02` define slots e `05` define texto final sem sobreposição |

## Fase 6 — Implementação

- Agentes: `06-frontend-implementation-architect`
- Output obrigatório: `implementation-plan`
- Gate: backlog técnico claro, por ficheiro e com critérios de done

| Estado | Prioridade | Tarefa |
|---|---|---|
| `[ ]` | P1 | Criar `implementation-plan.md` com backlog por `index.html`, `precos.html`, `faq.html`, `formulario.html`, `css/styles.css` e JS relevante |
| `[ ]` | P1 | Mapear dependências entre specs e código atual |
| `[ ]` | P2 | Identificar riscos de performance e acessibilidade antes de editar frontend |

## Fase 7 — QA e Publicação

- Agentes: `07-qa-accessibility-release-manager`
- Output obrigatório: `release-checklist`
- Gate: ready para GitHub Pages

| Estado | Prioridade | Tarefa |
|---|---|---|
| `[x]` | P1 | Base técnica existente em `launch-hardening-checklist.md` |
| `[ ]` | P1 | Criar `release-checklist.md` com validação de links, anchors, keyboard flow, mobile e metadata |
| `[ ]` | P1 | Verificar readiness objetiva para GitHub Pages |
| `[ ]` | P2 | Distinguir bugs de release de melhorias pós-lançamento |

## Fase 8 — Iteração

- Agentes: `08-growth-analytics-optimizer` + `00-creative-director`
- Output obrigatório: `optimization-backlog`
- Gate: backlog pós-lançamento priorizado

| Estado | Prioridade | Tarefa |
|---|---|---|
| `[ ]` | P1 | Criar `optimization-backlog.md` com hipóteses de conversão e próximo ciclo |
| `[ ]` | P2 | Definir instrumentação mínima por CTA e página |
| `[ ]` | P2 | Priorizar melhorias após observação do site ao vivo |

## Estado dos artefactos

| Artefacto | Dono | Estado | Nota |
|---|---|---|---|
| `positioning-brief.md` | `01` | `[ ]` | por formalizar |
| `page-flow-spec.md` | `02` | `[ ]` | deve absorver `homepage-v2-outline.md` |
| `visual-system-lock.md` | `03` | `[ ]` | deve absorver `brand-lock.md` |
| `motion-spec.md` | `04` | `[ ]` | por formalizar |
| `copy-pack.md` | `05` | `[ ]` | por formalizar |
| `implementation-plan.md` | `06` | `[ ]` | por formalizar |
| `release-checklist.md` | `07` | `[ ]` | deve absorver `launch-hardening-checklist.md` |
| `optimization-backlog.md` | `08` | `[ ]` | por formalizar |
