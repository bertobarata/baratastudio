# Barata Studio — Brand Color Lock
_Locked: 2025-05-04_

---

## Paleta Final

| Token CSS         | Hex       | RGB             | Papel na identidade                                      |
|-------------------|-----------|-----------------|----------------------------------------------------------|
| `--teal`          | `#1A6870` | 26, 104, 112    | Acento principal. Aparece em 5% do layout.               |
| `--teal-deep`     | `#164F58` | 22, 79, 88      | Sombra do acento, bordes de hover, estado activo escuro. |
| `--teal-metal`    | `#2F6B73` | 47, 107, 115    | Superfície metálica, stroke de vidro fumado.             |
| `--teal-hover`    | `#4F98A3` | 79, 152, 163    | Luz de acento, focus ring, highlight, detalhe fino.      |
| `--bg-warm`       | `#F5F3EE` | 245, 243, 238   | Fundo claro principal (modo claro).                      |
| `--bg-warm-hi`    | `#FBF9F5` | 251, 249, 245   | Superfície clara elevada, cards em modo claro.           |
| `--bg-dark`       | `#121315` | 18, 19, 21      | Fundo escuro principal (modo escuro, hero).              |
| `--bg-dark-hi`    | `#191B1F` | 25, 27, 31      | Superfície escura elevada, cards e painéis.              |
| `--bg-dark-mid`   | `#1E2024` | 30, 32, 36      | Camada intermédia, separadores de secção escura.         |
| `--text-dark`     | `#16171A` | 22, 23, 26      | Texto principal em modo claro.                           |
| `--text-light`    | `#F4F1EA` | 244, 241, 234   | Texto principal em modo escuro.                          |
| `--text-muted`    | `#6F7478` | 111, 116, 120   | Texto secundário, metadados, labels.                     |
| `--text-subtle`   | `#9CA3A8` | 156, 163, 168   | Texto terciário, placeholders, notas de rodapé.          |

### Tokens auxiliares (rgba)

```css
--teal-rgb:       26, 104, 112;
--text-light-rgb: 244, 241, 234;
```

Uso: `rgba(var(--teal-rgb), 0.15)` para overlays sem hardcode de hex.

---

## Nota sobre a decisão do petróleo

O `#145A61` anterior tinha luminosidade perceptual (L*) muito próxima dos fundos escuros — desaparecia em bg-dark e ficava morto em bg-warm. O `#1A6870` resolve isso: sobe ~6 pontos de L* sem aproximar do cyan saturado. Mantém seriedade e material, mas agora tem vida própria quando isolado.

---

## Superfícies — Modo Escuro

| Camada              | Token           | Hex       | Uso típico                              |
|---------------------|-----------------|-----------|-----------------------------------------|
| Base                | `--bg-dark`     | `#121315` | Hero, footer, secções principais        |
| Elevada (nível 1)   | `--bg-dark-hi`  | `#191B1F` | Cards, painéis, header após scroll      |
| Elevada (nível 2)   | `--bg-dark-mid` | `#1E2024` | Tooltips, modais, detalhe sobreexposto  |
| Stroke/Divisor      | `--teal-metal`  | `#2F6B73` | Linhas finas, bordas de vidro fumado    |
| Acento              | `--teal`        | `#1A6870` | CTA, hover, focus, detalhe de motion    |

Nota: o monograma BB em `--text-light` (`#F4F1EA`) sobre `--bg-dark` (`#121315`) tem ratio de contraste ~14:1. WCAG AAA.

---

## Superfícies — Modo Claro

| Camada              | Token          | Hex       | Uso típico                              |
|---------------------|----------------|-----------|-----------------------------------------|
| Base                | `--bg-warm`    | `#F5F3EE` | Secção manifesto, secção serviços       |
| Elevada             | `--bg-warm-hi` | `#FBF9F5` | Cards, mockups editoriais, citações     |
| Texto principal     | `--text-dark`  | `#16171A` | Corpo, headings                         |
| Texto secundário    | `--text-muted` | `#6F7478` | Labels, metadados, data                 |
| Acento              | `--teal`       | `#1A6870` | Links, hover, focus ring                |

Nota: o monograma BB em `--text-dark` (`#16171A`) sobre `--bg-warm` (`#F5F3EE`) tem ratio ~15:1. WCAG AAA.

---

## Regra de Uso da Cor

```
80% — Neutros quentes e escuros (bg-dark, bg-warm, text-dark, text-light)
15% — Preto/branco e contraste estrutural (superfícies elevadas, text-muted, text-subtle)
 5% — Petróleo (--teal, --teal-hover, --teal-metal: linhas, hovers, focus, CTAs)
```

O petróleo não deve dominar. Quando aparece pouco, ganha peso de luxo. Quando aparece em demasia, passa a ser cor de fundo e perde função de acento.

---

## 3 Combinações Proibidas

### 1. `--teal` sobre `--bg-dark` como texto corrido
**Por que não:** O ratio de contraste de `#1A6870` sobre `#121315` é ~3.2:1 — insuficiente para WCAG AA em texto normal (mínimo 4.5:1). Funciona como detalhe gráfico mas falha como texto legível. Usar `--teal-hover` (`#4F98A3`) se for necessário texto sobre escuro, mas mesmo assim apenas em títulos grandes (AA Large exige 3:1).

### 2. `--bg-warm` como fundo de secções escuras com texto em `--text-light`
**Por que não:** O `--text-light` (`#F4F1EA`) sobre `--bg-warm` (`#F5F3EE`) tem ratio de contraste ~1.02:1 — texto invisível. São dois offs-white muito próximos. Texto claro só sobre fundos escuros.

### 3. Múltiplos tons de petróleo na mesma área de interface
**Por que não:** Usar `--teal`, `--teal-metal` e `--teal-hover` juntos no mesmo componente (ex: border + background + text todos em petróleo) destrói a regra dos 5% e cria ruído de cor. O petróleo deve aparecer num único papel por componente.

---

## 3 Combinações Aprovadas

### 1. `--text-light` sobre `--bg-dark` — texto principal em modo escuro
```css
background: var(--bg-dark);
color: var(--text-light);
```
Contraste ~14:1. Base de toda a experiência escura. O ligeiro bege de `--text-light` aquece o off-black e evita o look de terminal.

### 2. `--teal` como stroke/border sobre `--bg-dark-hi` — vidro fumado
```css
background: rgba(var(--teal-rgb), 0.06);
border: 1px solid rgba(var(--teal-rgb), 0.25);
```
Cria a superfície de vidro fumado sem saturar. O teal aparece como material, não como cor plana. Ideal para os painéis de processo (Briefing, Strategy, Design, Launch).

### 3. `--teal-hover` como focus ring ou detalhe de motion sobre qualquer fundo
```css
outline: 2px solid var(--teal-hover);
outline-offset: 3px;
```
O `#4F98A3` é suficientemente luminoso para ser visível tanto sobre escuro como sobre o neutro quente, sem parecer neon. Funciona como único momento de cor saturada visível no layout.

---

## Direção de Materiais

### Vidro Fumado
Para painéis translúcidos (secção Process Layers, cards sobre hero).

```css
.glass-panel {
  background: rgba(var(--teal-rgb), 0.05);
  border: 1px solid rgba(var(--teal-rgb), 0.20);
  backdrop-filter: blur(12px) saturate(1.1);
  -webkit-backdrop-filter: blur(12px) saturate(1.1);
}

/* Estado activo / em foco */
.glass-panel--active {
  background: rgba(var(--teal-rgb), 0.10);
  border-color: rgba(var(--teal-rgb), 0.45);
}
```

Princípio: blur moderado (8–14px), opacidade de fundo baixa (4–12%), stroke petróleo a 20–45%. Nunca blur >20px nem opacidade >20% — vira glassmorphism genérico.

### Metal Petróleo Escuro
Para detalhes do monograma BB, hover states, progress line.

```css
.bb-stroke {
  stroke: var(--teal-metal);
  stroke-width: 1.5px;
  fill: none;
}

/* Hover com transição de luminosidade */
.bb-stroke:hover {
  stroke: var(--teal-hover);
  transition: stroke 280ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

Princípio: o metal petróleo (`#2F6B73`) funciona como estado de repouso; o petróleo hover (`#4F98A3`) como estado de luz. A transição entre os dois simula reflexo de material metálico.

### Papel Off-White
Para secções claras, manifesto, mockups editoriais.

```css
.section--light {
  background: var(--bg-warm);
  color: var(--text-dark);
}

.card--editorial {
  background: var(--bg-warm-hi);
  border: 1px solid rgba(22, 23, 26, 0.07); /* --text-dark com opacidade mínima */
}
```

Princípio: os neutros quentes já têm temperatura ligeiramente amarelada (não azul). Não adicionar sombras coloridas nem borders com cor — apenas separação por luminosidade e bordas com preto muito transparente.

### Sombra Suave (nunca dura)
Para cards, header após scroll, elementos flutuantes.

```css
/* Sombra editorial — larga, difusa, sem cor */
.shadow-soft {
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.04),
    0 8px 24px rgba(0, 0, 0, 0.08),
    0 24px 48px rgba(0, 0, 0, 0.06);
}

/* Versão com toque petróleo — para elementos flutuantes sobre escuro */
.shadow-teal {
  box-shadow:
    0 4px 16px rgba(var(--teal-rgb), 0.12),
    0 16px 40px rgba(0, 0, 0, 0.24);
}
```

Princípio: três camadas de sombra com opacidades diferentes criam profundidade natural. Evitar `box-shadow: 0 4px 8px rgba(0,0,0,0.5)` — demasiado dura, destrói o registo premium. A sombra com toque petróleo é reservada para o botão flutuante BB e para elementos com foco activo.
