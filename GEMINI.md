# Barata Studio — Engineering & Design Mandates (Standard: IMPECCABLE)

Esta diretiva estabelece o padrão de execução para qualquer intervenção futura no Barata Studio v2. Qualquer agente que opere neste repositório deve respeitar rigorosamente estes princípios.

## 1. Experiência Visual & Scroll
*   **Rítmo Editorial:** O site utiliza GSAP ScrollTrigger para narrativas "pinned" (como o Hero e o Processo). Nunca quebrar a lógica de "passo-a-passo" obrigatório em secções críticas.
*   **Zero Overlap:** O layout Hero deve manter a separação rígida entre o texto (esquerda) e o portfólio dinâmico (canais verticais à direita).
*   **Marca de Água:** O sistema de Watermarks (opacidade ~0.012) deve ser mantido como elemento de preenchimento subliminar do espaço negativo.

## 2. Padrões Técnicos
*   **GSAP Optimization:** Preferir sempre `autoAlpha` em vez de `opacity` para otimização de performance e remoção de elementos invisíveis da árvore de interação.
*   **Imagens:** Priorizar formato `.webp` com dimensões explícitas e `alt text` orientado a SEO e acessibilidade.
*   **Cursor:** O cursor customizado (`.cursor-dot`, `.cursor-ring`) deve manter `z-index` superior a qualquer outro elemento do DOM.

## 3. Estratégia Comercial & SEO
*   **CTAs de Intenção:** Manter a diferenciação entre "Escolher Plano" (WhatsApp direto com mensagem preenchida) e "Pedir Orçamento" (Formulário).
*   **SEO Local:** Títulos e Meta Tags devem sempre conter keywords relevantes como "Web Design", "Websites Personalizados" e "Portugal".
*   **Professionalismo:** O email `berto.barata77@gmail.com` deve estar sempre integrado de forma limpa, mantendo o tom premium do estúdio.

## 4. Auditoria Obrigatória
Qualquer alteração estrutural deve ser seguida de um `/impeccable audit` para validar a integridade de marca e a fluidez da experiência.
