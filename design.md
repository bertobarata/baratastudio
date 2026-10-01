---
name: Barata Studio
description: "Do briefing ao launch: web feita à mão."
colors:
  paper: "oklch(0.962 0.014 88)"
  paper-hi: "oklch(0.985 0.01 90)"
  ink: "oklch(0.21 0.03 215)"
  ink-2: "oklch(0.42 0.025 215)"
  teal: "oklch(0.47 0.075 208)"
  teal-deep: "oklch(0.34 0.06 212)"
  teal-lit: "oklch(0.8 0.1 195)"
  sand: "oklch(0.87 0.07 82)"
  ok: "oklch(0.8 0.12 155)"
  term: "oklch(0.2 0.026 215 / 0.84)"
  term-solid: "oklch(0.22 0.026 215 / 0.94)"
  term-ink: "oklch(0.93 0.012 90)"
  term-dim: "oklch(0.72 0.02 215)"
  glass: "oklch(0.99 0.012 90 / 0.5)"
  glass-strong: "oklch(0.99 0.012 90 / 0.74)"
  panel: "oklch(0.99 0.012 90 / 0.68)"
  hair: "oklch(0.25 0.03 215 / 0.14)"
  whatsapp: "oklch(0.62 0.17 150)"
typography:
  display:
    fontFamily: "Comico, Zodiak, serif"
    fontSize: "clamp(2.5rem, 6.3vw, 5.6rem)"
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: "0.005em"
  headline:
    fontFamily: "Comico, Zodiak, serif"
    fontSize: "clamp(2.2rem, 5vw, 4rem)"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "0.005em"
  title:
    fontFamily: "Zodiak, Georgia, serif"
    fontSize: "clamp(1.2rem, 2.2vw, 1.55rem)"
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Zodiak, Georgia, serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "normal"
  label:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.78rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.1em"
  terminal:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.84rem"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "normal"
rounded:
  sm: "12px"
  lg: "22px"
  xl: "28px"
  pill: "999px"
spacing:
  gutter: "clamp(1rem, 4vw, 2rem)"
  section: "clamp(3.5rem, 9vw, 8rem)"
  wrap: "1180px"
components:
  button-primary:
    backgroundColor: "{colors.teal}"
    textColor: "{colors.paper-hi}"
    typography: "{typography.display}"
    rounded: "{rounded.pill}"
    padding: "0.95rem 1.7rem"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.teal-deep}"
    textColor: "{colors.paper-hi}"
  button-ghost:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0.95rem 1.7rem"
    height: "48px"
  terminal:
    backgroundColor: "{colors.term-solid}"
    textColor: "{colors.term-ink}"
    typography: "{typography.terminal}"
    rounded: "{rounded.lg}"
  terminal-chip:
    textColor: "{colors.term-ink}"
    rounded: "{rounded.pill}"
    height: "36px"
  input:
    backgroundColor: "{colors.paper-hi}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0.8rem 0.95rem"
    height: "48px"
  panel:
    backgroundColor: "{colors.panel}"
    rounded: "{rounded.lg}"
  tag:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink-2}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
---

# Design System: Barata Studio

## 1. Overview: The Glass Workbench

Light, warm paper with a soft aurora of petróleo, sand and sky behind everything; frosted glass and dark terminal windows sit on top. The handmade side comes from the Comico wordmark and headlines; the technical side from JetBrains Mono labels and an interactive terminal in the hero. It is a light-only site by decision (the visitor is a business owner reading in daylight, comparing studios); there is no dark mode.

Layout is a 1180px wrap with a 12-col feel, left-aligned and asymmetric. Every section uses a different layout family: hero (full-width headline, then copy + terminal), stacked manifesto, mark + copy split, full-width process log, typeset proof rows, service list, project plates, drenched CTA. No more than two consecutive two-column sections.

## 2. Colors: Paper, Ink and Petróleo

- **Paper** `oklch(0.962 0.014 88)` is the page; never pure white. **Ink** `oklch(0.21 0.03 215)` for text (15.8:1), **Ink-2** for secondary copy (7.5:1 on paper, 5:1 on the darkest aurora area).
- **Petróleo** (`teal`) is the single accent: buttons, links, focus rings. **Teal-deep** for small mono labels (10:1), the final CTA block and hovers. **Teal-lit** only on dark surfaces (terminal, CTA).
- Terminal surfaces: `term` (blurred, hero only) and `term-solid` (everywhere else). Terminal text 9.4:1, dim text 4.7:1.
- Strategy: Restrained on the page, one Drenched block (final CTA). WhatsApp green only on the floating button.

## 3. Typography: Handmade Display, Readable Body

- **Comico** (display): H1 and H2, logo wordmark, buttons, big numbers. All-caps by design, so never for anything longer than a headline. Served as a 50 KB Latin subset without contextual alternates, preloaded, `font-display: optional`.
- **Zodiak** (body): paragraphs, H3s, FAQ questions, form text. Measure capped at 58 to 68ch.
- **JetBrains Mono Nerd Font Mono** (labels and terminal, 17 KB subsets with the few icons used): section labels (`// LABEL`, max 3 per page), nav links, tags, terminal. Minimum 12px.
- Scale ratio stays at or above 1.25 between steps; fluid `clamp()` for headings. The hero H1 must sit on two lines at desktop.

## 4. Elevation: Glass, Panels and Shadows

- **Real blur** (`backdrop-filter`) only on four things: the header (on a pseudo-element, so the mobile menu is not trapped inside it), the hero terminal, the mobile menu overlay and the cookie banner. Everything else is a **panel**: same translucent colour, no blur (cheap on phones).
- Shadows are tinted with the ink hue, never black: `--shadow-glass` (inset highlight + long soft drop) for glass, `--shadow-soft` for panels.
- `prefers-reduced-transparency` removes all blur and makes surfaces solid.
- z-index scale: float 90, header 100, overlay controls 120, toast 150, skip link 200.

## 5. Components

- **Buttons**: pill, 48px tall, Comico label, one line (`white-space: nowrap`). Primary petróleo; ghost on panel. `scale(0.97)` on press. One label per intent across the site: "Pedir proposta" (form), "Ver projetos", "Falar no WhatsApp".
- **Hero terminal (main focus)**: a tiny shell over the site in **frosted ice** (translucent pale-green glass, matte grain, green light behind it, dark green ink; every text colour 4.6:1 or better). `ls` / `ls -l` lists folders (projetos, servicos, processo, sobre, faq, contacto), `cd <pasta>` opens the section or page on Enter, `cd projetos` then `ls` lists the client sites and `cd <site>` opens it in a new tab; `cd ..`, `pwd`, `whoami`, `ajuda`, `clear`/Ctrl+L, Tab completion, history on the arrow keys, friendly aliases (portfolio, info, sobre-mim...). Every folder in the output and every shortcut chip is clickable; the chips are links, so they work without JavaScript. The `ls -l` is in the HTML (fixed-height output, no layout shift); on load the prompt only ghost-types "cd projetos" as a hint. Soft grey instructions sit under the window. Font: JetBrains Mono Nerd Font Mono (folder and link icons).
- **Process terminal**: dark solid window (`term-solid`), no dots, read-only log.
- **Project plate**: panel with 10px padding around a real screenshot (16:10, 12px inner radius), caption below (sector in mono, title in Zodiak 650, brief, link).
- **Proof rows**: number in Comico (moderate size) + label in mono, beside the project and claim. Not metric cards.
- **Forms**: label above input (mono caps), 48px fields, 12px radius, inline error under each field announced through `aria-describedby`, a status line after the submit button, busy state while WhatsApp opens.
- **Header**: floating pill, logo mask (colour from CSS), mono nav, CTA. Mobile: "Menu" opens a full-screen frosted overlay.

## 6. Do's and Don'ts

**Do**
- Keep the hero visible without JavaScript; entrance motion is CSS only, scroll reveal only below the fold.
- Use the radius scale: pill / 28 / 22 / 12. Use tokens for every colour.
- Give every touch target at least 44px on coarse pointers.
- Show real work (screenshots) and real, verifiable numbers.

**Don't**
- No prices anywhere: every project is quoted individually.
- No more than 3 mono section labels per page; no numbered eyebrows.
- No blur on lists of cards; no decorative dots outside the hero terminal; no infinite animations.
- No em dashes in copy; no new CTA labels for the same intent; no dark sections other than the terminal windows and the final CTA.
