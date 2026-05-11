# Barata Studio — Agent System Rules

## Objetivo do sistema

A pasta `Agents/` é o manual operacional para melhorar o site do Barata Studio com uma equipa fixa de 9 agentes. O sistema existe para aumentar conversão, disciplina de decisão e consistência entre `index.html`, `precos.html`, `faq.html` e `formulario.html`.

## Ordem oficial do pipeline

1. `00-creative-director`
2. `01-brand-positioning-strategist`
3. `02-conversion-ux-architect`
4. `03-visual-system-designer`
5. `04-motion-interaction-director`
6. `05-copy-messaging-editor`
7. `06-frontend-implementation-architect`
8. `07-qa-accessibility-release-manager`
9. `08-growth-analytics-optimizer`

Nenhum pedido salta de fase sem uma razão documentada. Mudanças tardias regressam à fase dona da decisão.

## Fonte de verdade

- `SITE.md`: contexto de negócio, público, proposta, páginas e prioridades.
- `KANBAN.md`: estado operacional por fase, gate, responsável e próximos passos.
- `brand-lock.md`: `visual-system-lock` oficial atual.
- `homepage-v2-outline.md`: `page-flow-spec` oficial atual.
- `launch-hardening-checklist.md`: base do `release-checklist` técnico já executado.

## Artefactos oficiais do pipeline

- `positioning-brief.md`
- `page-flow-spec.md`
- `visual-system-lock.md`
- `motion-spec.md`
- `copy-pack.md`
- `implementation-plan.md`
- `release-checklist.md`
- `optimization-backlog.md`

Quando já existe um documento anterior útil, o artefacto oficial deve apontar para ele e absorver a sua decisão, não criar versões paralelas.

## Gates de aprovação

- Fase 1: Estratégia. Gate: objetivo, público, objeções e prova fechados.
- Fase 2: Conversão e estrutura. Gate: narrativa, ordem das secções e CTAs aprovados.
- Fase 3: Sistema visual. Gate: tokens, tipografia e regras de página locked.
- Fase 4: Motion e comportamento. Gate: motion reforça leitura, não cria risco de performance.
- Fase 5: Copy. Gate: headlines, microcopy e CTA sem ambiguidade nem duplicação.
- Fase 6: Implementação. Gate: backlog técnico implementável, com dependências e critérios.
- Fase 7: QA e publicação. Gate: regressões, acessibilidade, links e readiness de GitHub Pages validados.
- Fase 8: Iteração. Gate: backlog pós-lançamento priorizado por impacto.

## Regras de colaboração

- Cada agente decide apenas dentro do seu domínio.
- Todo output tem de ser concreto, aprovável e entregável ao próximo agente.
- `00-creative-director` aprova tradeoffs que mexem em posicionamento, scope, estética central ou prioridade.
- `02` define estrutura e papéis de secção; `05` escreve o texto dentro dessa estrutura.
- `03` define sistema visual estático; `04` define comportamento animado e fallbacks.
- `06` recebe specs, não briefs vagos.
- `07` valida critérios observáveis; não decide estratégia nova.
- `08` não reabre o trabalho concluído sem hipótese ou sinal claro.
