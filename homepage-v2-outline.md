# Homepage v2 — Outline narrativo
Barata Studio · Revisão estrutural maio 2026

---

## O que mudou e porquê

### Removido: Process Summary (`#process`)

A secção `<section class="process-summary" id="process">` foi eliminada do `index.html`.

**Motivo:** Repetia os mesmos quatro passos (Briefing / Design / Build / Launch) já apresentados em Process Layers (`#process-layers`), mas num formato mais simples e menos impactante. Ter os dois blocos em sequência criava déjà vu narrativo — o utilizador chegava ao Process Summary com a sensação de "já vi isto". Num site editorial premium, a repetição de conteúdo destrói o ritmo de scroll mais do que qualquer problema visual. Como Process Layers apresenta o mesmo conteúdo com mais craft (painéis translúcidos, scroll sticky, animação sequencial), é a versão a manter.

### Mantido: Presence wireframe grid (`#presence`)

Apesar de também conter dois cards com descrição de projetos-tipo, esta secção serve um objetivo diferente dos Projects: não mostra casos reais, mas demonstra o raciocínio estrutural por detrás do trabalho (wireframes CSS que exibem o pensamento de layout). É a ponte entre o processo (como se faz) e o resultado (o que se entrega). Remover Presence criaria um salto narrativo de "como trabalho" para "o que faço" sem mostrar "o que entrego". Os dois "Em breve" visíveis nos Projects são placeholders de imagem dentro de uma secção coerente — diferente de ter duas secções independentes a mostrar vazios.

---

## Estrutura final — 7 secções de conteúdo

### 1. Hero
- **ID:** `#home`
- **Objetivo narrativo:** Identity reveal. Apresentar a marca como objeto — não como página web. O monograma BB é o protagonista visual antes de qualquer copy.
- **Headline:** "Do briefing ao launch: web feita à mão."
- **O que diz de novo:** Introduz a marca, o posicionamento e o tom. Nada antes disto.
- **Transição para a próxima:** O scroll hint (linha vertical) convida à descida; o monograma começa a separar-se em profundidade, preparando o terreno para o manifesto.
- **Mobile:** BB ocupa menos espaço relativo; copy centrada; CTAs em coluna. O scroll hint permanece visível.
- **Desktop:** BB grande e escultórico ocupa o centro do viewport; copy alinhada à esquerda ou sobreposta; CTAs em linha.

---

### 2. Manifesto / Posicionamento
- **ID:** `#manifesto`
- **Objetivo narrativo:** Transformar impacto visual em perceção de valor. Dizer o que o estúdio não é antes de dizer o que faz.
- **Headline:** "Sem fórmulas prontas. Sem sites com aspeto de template."
- **O que diz de novo:** Posicionamento explícito contra templates e soluções genéricas. A Hero mostrou; o Manifesto explica.
- **Transição para a próxima:** Fundo claro quente; ao scroll, entrada do bloco BB Depth com fundo que escurece progressivamente.
- **Mobile:** Texto em coluna única, muito espaçado; section-label como âncora visual. Nenhuma perda de conteúdo.
- **Desktop:** Bloco estreito e centrado editorialmente, com muito espaço negativo lateral.

---

### 3. BB Sculptural Depth
- **ID:** `#bb-depth`
- **Objetivo narrativo:** Mostrar a marca como objeto premium — identidade com profundidade material, não apenas logótipo plano.
- **Headline:** "Uma identidade construída com intenção."
- **O que diz de novo:** Enquanto a Hero apresenta o BB em contexto narrativo, esta secção isola-o como artefacto visual e explora o seu lado escultórico e artesanal.
- **Transição para a próxima:** Fundo escuro estabelecido aqui continua no Process Layers — continuidade tonal que agrupa visualmente as duas secções mais "técnicas".
- **Mobile:** Camadas de depth simplificadas (menos paralaxe); copy fica abaixo do visual, não ao lado.
- **Desktop:** Visual e copy em layout lado a lado; as três camadas do BB animam com parallax ao scroll.

---

### 4. Process Layers
- **ID:** `#process-layers`
- **Objetivo narrativo:** Dar corpo à promessa "web feita à mão". Transformar o processo de trabalho numa experiência de scroll — não numa lista.
- **Headline:** "Web feita à mão."
- **O que diz de novo:** Concretiza o processo de trabalho em 4 passos com craft visual (painéis translúcidos, scroll sticky). A secção anterior mostrou a identidade; esta mostra a metodologia.
- **Transição para a próxima:** Saída dos painéis escuros; entrada da secção Presence com fundo mais claro, marcando a transição de "como se faz" para "o que se entrega".
- **Mobile:** Painéis em empilhamento vertical com animação simplificada; progress bar mantém-se como indicador de posição.
- **Desktop:** Scroll sticky com 4 painéis em profundidade; painel ativo com mais opacidade e linha petróleo fina.

---

### 5. From Wireframe to Presence
- **ID:** `#presence`
- **Objetivo narrativo:** Fazer a ponte entre processo e resultado. Mostrar o tipo de outputs entregues antes de mostrar casos reais — demonstra raciocínio estrutural e craft de layout.
- **Headline:** "Do conceito à presença digital."
- **O que diz de novo:** Enquanto Process Layers mostra como se trabalha, Presence mostra o que se produz — estrutura, tipologia, intenção de cada entrega. Os wireframes CSS demonstram que o pensamento de layout é artesanal, não automático.
- **Transição para a próxima:** Grid de cards leva naturalmente à lista de serviços — de "tipos de output" para "modalidades de contratação".
- **Mobile:** Cards em coluna única; wireframe mockups redimensionados mas funcionais.
- **Desktop:** Grid de 2 cards; mockups com mais detalhe visual.

---

### 6. Serviços
- **ID:** `#services`
- **Objetivo narrativo:** Zona racional. Clarificar o que está disponível para contratação, sem perder o tom premium.
- **Headline:** "Serviços"
- **O que diz de novo:** Primeira secção puramente comercial. Após três secções de identidade e uma de processo, o utilizador já tem contexto para avaliar a oferta com intenção de compra.
- **Transição para a próxima:** Lista editorial leva ao portefólio — de "o que faço" para "o que já fiz / farei".
- **Mobile:** Lista vertical com espaçamento generoso; setas de navegação mantêm-se como detalhe premium.
- **Desktop:** Lista horizontal ou em grelha sóbria; muito espaço negativo.

---

### 7. Projetos Selecionados + CTA final
*(Duas secções distintas no HTML, mas contam o mesmo capítulo: prova e convite)*

#### 7a. Projetos Selecionados
- **ID:** `#projects`
- **Objetivo narrativo:** Prova de execução. Mesmo com placeholders, os cards com sector e brief estabelecem credibilidade e especificidade.
- **Headline:** "Projetos selecionados"
- **O que diz de novo:** Casos reais (ou futuros) com contexto de sector — diferente de Presence, que mostrava tipologias abstractas.
- **Mobile:** Cards em coluna única, imagem acima do meta.
- **Desktop:** Grid de 2 colunas; hover com detalhe petróleo.

#### 7b. CTA Final
- **ID:** `#contact`
- **Objetivo narrativo:** Fecho silencioso e confiante. Não urgente — o utilizador que chegou aqui já foi convencido pelo scroll.
- **Headline:** "Quando a presença digital pede mais do que um template."
- **O que diz de novo:** Convite direto à ação. BB como background reforça a identidade no momento de decisão.
- **Transição:** Fim da página; footer segue naturalmente.
- **Mobile:** Headline em tamanho reduzido mas mantendo peso; CTAs em coluna.
- **Desktop:** Headline grande; BB ghost no background; CTAs em linha.

---

## Sequência narrativa completa

```
Hero          → Quem sou (identidade emocional)
Manifesto     → O que recuso (posicionamento)
BB Depth      → Como me vejo (identidade material)
Process       → Como trabalho (metodologia com craft)
Presence      → O que entrego (tipos de output)
Serviços      → O que está disponível (oferta)
Projetos      → O que já fiz / farei (prova)
CTA           → Vamos trabalhar juntos (convite)
```

Cada secção avança o argumento. Nenhuma repete outra.

---

## Notas de implementação futura

- Os dois cards de Projetos com "Em breve" devem ser substituídos por casos reais assim que disponíveis — são o ponto mais frágil da narrativa atual.
- A secção Presence pode evoluir para uma transição animada de wireframe para mockup real (como descrito no DESIGN.md) quando houver assets visuais.
- O nav item `#process` que apontava para Process Summary deve ser atualizado ou removido do header — atualmente o header não tem link direto para `#process`, pelo que não há artefacto de navegação órfão.
