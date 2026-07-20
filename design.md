---
name: Barata Studio
description: "Do briefing ao launch: web feita à mão."
colors:
  teal: "#1A6870"
  teal-deep: "#164F58"
  teal-metal: "#2F6B73"
  teal-hover: "#4F98A3"
  bg-warm: "#F5F3EE"
  bg-warm-hi: "#FBF9F5"
  bg-dark: "#121315"
  bg-dark-hi: "#191B1F"
  bg-dark-mid: "#1E2024"
  text-dark: "#16171A"
  text-light: "#F4F1EA"
  text-muted: "#828990"
  text-muted-on-light: "#5B6065"
  text-subtle: "#9CA3A8"
  whatsapp: "#25D366"
typography:
  display:
    fontFamily: "Comico, cursive"
    fontSize: "clamp(2.25rem, 5vw, 4rem)"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "0.01em"
  headline:
    fontFamily: "Comico, cursive"
    fontSize: "clamp(1.75rem, 3.5vw, 3rem)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "0.01em"
  title:
    fontFamily: "Comico, cursive"
    fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)"
    fontWeight: 400
    lineHeight: 1.2
  body:
    fontFamily: "Zodiak, serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0.01em"
  label:
    fontFamily: "Zodiak, serif"
    fontSize: "0.72rem"
    fontWeight: 600
    letterSpacing: "0.12em"
rounded:
  input: "8px"
  md: "12px"
  lg: "20px"
  pill: "999px"
spacing:
  card: "24px"
  gutter: "32px"
  section: "120px"
components:
  button-primary:
    backgroundColor: "{colors.teal}"
    textColor: "#FFFFFF"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.85rem 1.75rem"
  button-primary-hover:
    backgroundColor: "{colors.teal-metal}"
    textColor: "#FFFFFF"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.text-light}"
    rounded: "{rounded.pill}"
    padding: "0.85rem 1.75rem"
  card:
    backgroundColor: "{colors.bg-dark-hi}"
    textColor: "{colors.text-light}"
    rounded: "{rounded.md}"
    padding: "{spacing.card}"
  input:
    backgroundColor: "#00000040"
    textColor: "{colors.text-light}"
    rounded: "{rounded.input}"
    padding: "0.65rem 0.85rem"
  section-label:
    textColor: "{colors.teal-hover}"
    typography: "{typography.label}"
---

# Design System: Barata Studio

## 1. Overview

**Creative North Star: "The Quiet Atelier"**

Barata Studio is a one-person web atelier that sells the opposite of a template. The site has to feel like the workshop of someone who cuts every joint by hand: dark, warm, unhurried, and confident enough to stay quiet. Nothing shouts. The petróleo (teal) accent is rationed to almost nothing, motion is slow and short, and the loudest thing on the page is a hand-drawn wordmark that literally looks made à mão. The tagline is the whole brief: "Do briefing ao launch: web feita à mão."

The system runs predominantly on warm-tinted darks (`#121315` charcoal, never pure black) with a few bright editorial breathing rooms in warm off-white (`#F5F3EE`, never pure white). Depth comes from tonal layering of dark surfaces and slow GSAP scroll choreography, not from decoration. This is a brand register: on this site the design *is* the product, so craft is the argument.

It explicitly rejects the SaaS-template look, "startup AI" aesthetics (neon purples/blues, glow-on-black), generic glassmorphism, and any effect that reads as a tech demo rather than a studio in control of form, rhythm, and detail.

**Key Characteristics:**
- Warm-tinted darkness: charcoal and off-white, never `#000` or `#fff`.
- Petróleo as a rare guest: teal appears on ~5% of any screen (eyebrows, hover, focus, small interface detail).
- Hand-drawn headings against a serif body: the pairing is the identity.
- Slow, short, few-things-at-once motion. Depth over spectacle.
- Editorial lists and generous negative space instead of icon-card grids.

## 2. Colors

A warm neutral system, dark-dominant, with a single petróleo accent held in reserve and one functional WhatsApp green.

### Primary
- **Petróleo** (`#1A6870`): The one accent. Primary buttons, focus/active states, the featured price card border, the service-number hover, progress fills. Alive but never neon.
- **Petróleo Deep** (`#164F58`): Reserved for subtle shadows, deep borders, and the radial glow behind the OG/hero atmosphere.
- **Petróleo Metal** (`#2F6B73`): Primary-button hover surface; a metallic half-step up from the base teal.
- **Petróleo Light** (`#4F98A3`): The luminous edge of the accent. Section eyebrows (`.section-label`), focus rings, hover text on ghost buttons, links, small motion highlights. This is the teal you actually *read*.

### Neutral (warm)
- **Warm Paper** (`#F5F3EE`): Light-section background (manifesto, presence, services, process summary) and inner-page canvas. The editorial breathing rooms.
- **Warm Paper Elevated** (`#FBF9F5`): Raised light surfaces on the warm sections.
- **Charcoal** (`#121315`): The dominant background. Warm-tinted near-black.
- **Charcoal Elevated** (`#191B1F`): Cards and the scrolled header surface.
- **Charcoal Mid** (`#1E2024`): The third tonal step for nested dark surfaces and image wells.
- **Ink** (`#16171A`): Text on warm surfaces.
- **Bone** (`#F4F1EA`): Primary text on dark surfaces. Warm off-white.
- **Muted (on dark)** (`#828990`): Secondary text on charcoal. Tuned to clear ≥4.5:1 on `#121315` and elevated cards.
- **Muted (on light)** (`#5B6065`): Secondary text on warm paper. The darker sibling that keeps ≥4.5:1 on `#F5F3EE`.
- **Subtle** (`#9CA3A8`): The lightest greyed text, for the least important labels on dark.

### Functional
- **WhatsApp Green** (`#25D366`): Only the floating WhatsApp/contact affordance. Never decorative, never brand.

### Named Rules
**The 5% Rule.** Petróleo touches at most ~5% of any screen: eyebrows, hover, focus, a single primary button, a progress line. Its rarity is the luxury. If teal starts to dominate a section, the section is wrong.

**The No-Pure Rule.** Never `#000`, never `#fff`. Every neutral is tinted warm. Backgrounds are charcoal or warm paper; text is bone or ink.

**The Surface-Aware Muted Rule.** Secondary text uses `text-muted` (#828990) on dark and `text-muted-on-light` (#5B6065) on warm. One grey never serves both surfaces: the dark needs a lighter muted, the light needs a darker one, both to hold 4.5:1.

## 3. Typography

**Display Font:** Comico (self-hosted, with `cursive` fallback)
**Body Font:** Zodiak (self-hosted variable serif, with `serif` fallback)

**Character:** Comico is a hand-drawn marker face: it is the literal rendering of "web feita à mão" and carries every heading and button. Zodiak is a refined editorial serif that grounds the hand-drawn headings with adult, readable body copy. The tension between the two, playful mark plus serious text, is the entire type identity. Luxury here comes from restraint: few scales, generous tracking on labels, no third font.

### Hierarchy
- **Display** (Comico 400, `clamp(2.25rem, 5vw, 4rem)`, line-height 1.02): Hero title and top-of-section H2s. Set in near-uppercase hand-drawn letterforms.
- **Headline** (Comico 400, `clamp(1.75rem, 3.5vw, 3rem)`, line-height 1.1): Section headings (manifesto, projects, services, CTA).
- **Title** (Comico 400, `clamp(1.25rem, 2.5vw, 1.75rem)`, line-height 1.2): Card titles, panel titles, price-plan names.
- **Body** (Zodiak 400, `1rem`, line-height 1.6, tracking 0.01em): All paragraph copy. Keep measure at 65–75ch on wide layouts.
- **Label** (Zodiak 600, `0.72rem`, tracking `0.12em`, uppercase): Section eyebrows (`.section-label`), meta sectors, kicker text. Petróleo Light on dark, muted on light.

### Named Rules
**The Two-Voice Rule.** Comico for anything titular or interactive (headings, buttons, numbers). Zodiak for anything you read in sentences. Never a third family; never Comico for body; never Zodiak for a button.

**The Few-Scales Rule.** The luxury is contention: four heading steps and one body size. Do not invent intermediate sizes; use weight, case, and the fixed clamp steps.

## 4. Elevation

Flat by default, dark-tonal by construction. Depth is built by stacking warm-charcoal tones (`#121315` to `#191B1F` to `#1E2024`), not by casting shadows on resting surfaces. Shadows appear only as a response to state (hover) or on the sculptural hero phone mockups, and they are always wide, soft, and low-opacity, never hard drop shadows.

### Shadow Vocabulary
- **Hover lift** (`box-shadow: 0 10px 30px rgba(0,0,0,0.35)`): Cards on hover, paired with a 4px translateY and a teal border.
- **Accent lift** (`box-shadow: 0 8px 24px rgba(26,104,112,0.35)`): Primary button on hover only. A soft petróleo halo.
- **Featured glow** (`box-shadow: 0 16px 40px rgba(26,104,112,0.12)`): The single featured price card, a barely-there teal elevation.
- **Sculptural device** (`box-shadow: 0 40px 80px rgba(0,0,0,0.6), 0 4px 16px rgba(0,0,0,0.4)`): The hero phone frames only. Deep, cinematic, layered.

### Named Rules
**The Flat-At-Rest Rule.** Surfaces are flat until touched. If a card has a shadow when nobody is hovering it, remove it and let the tonal step carry the depth.

## 5. Components

### Buttons
- **Shape:** Full pill (`border-radius: 999px`). Type set in Comico 600, tracking 0.03em, padding `0.85rem 1.75rem`.
- **Primary:** Petróleo (`#1A6870`) fill, white text. Hover shifts to Petróleo Metal (`#2F6B73`), lifts 1px, gains the accent halo shadow.
- **Ghost:** Transparent with a 1px `rgba(bone, 0.25)` border and bone text. Hover recolors border and text to Petróleo Light and lifts 1px. Variants `--ghost-dark` (warm surfaces, ink text) and `--ghost-light` mirror this on their backgrounds.

### Chips (service + project tags)
- **Style:** Small teal-tinted pills with Petróleo Light label text, uppercase, for capability tags (`DESIGN À MEDIDA`, `MOBILE-FIRST`). Quiet, informational, never primary.

### Cards / Containers
- **Corner Style:** 12px (`--radius`); large containers 20px (`--radius-lg`).
- **Background:** Charcoal Elevated (`#191B1F`) on dark sections.
- **Border:** Hairline `rgba(255,255,255,0.04)` at rest.
- **Shadow Strategy:** None at rest; Hover lift + teal border on hover (see Elevation).
- **Internal Padding:** 24px (`1.5rem`).
- **Featured price card:** Petróleo-tinted border + Featured glow to single it out. No other card competes.

### Inputs / Fields
- **Style:** Recessed wells: `rgba(0,0,0,0.25)` fill, 1px `rgba(255,255,255,0.1)` border, 8px radius, bone text.
- **Focus:** Border shifts to Petróleo (`#1A6870`) and the fill deepens to `rgba(0,0,0,0.4)`. No outline glow; the border shift is the signal. A visible `:focus-visible` ring exists globally for keyboard users.

### Navigation
- **Style:** Floating, near-invisible header: brand monogram left, four plain links center (Serviços, Projetos, Preços, FAQ) in Bone at 60% opacity, one pill CTA right. On scroll the header compacts and gains a hairline top shadow.
- **Mobile:** The four links become a full-screen editorial overlay (numbered items, sections Navegar/Falar, secondary CTAs, single 220ms fade-in). The overlay build is mobile-only (`max-width: 768px`); the desktop bar never inherits it.

### Signature Component: the BB hero devices
Sculptural phone mockups (`--phone-w: 320px`) with deep multi-layer shadows, a notch island, and GSAP scroll-driven swap on desktop / a card-deal marquee on mobile. This is the one place spectacle is allowed, and even here motion stays slow.

## 6. Do's and Don'ts

### Do:
- **Do** keep petróleo under ~5% of any screen: eyebrows, hover, focus, one primary button, progress lines.
- **Do** tint every neutral warm. Backgrounds charcoal (`#121315`) or warm paper (`#F5F3EE`); text bone (`#F4F1EA`) or ink (`#16171A`).
- **Do** set headings and buttons in Comico, body in Zodiak. Two voices, no third.
- **Do** use `text-muted` on dark and `text-muted-on-light` on warm so secondary text always clears 4.5:1.
- **Do** build depth by stacking charcoal tones; let shadows appear only on hover and on the hero devices.
- **Do** favor editorial lists and negative space over icon-in-a-circle card grids.
- **Do** keep motion slow, short in amplitude, one-thing-at-a-time (GSAP ScrollTrigger, ease-out, no bounce).

### Don't:
- **Don't** use `#000` or `#fff` anywhere.
- **Don't** let the site read as a SaaS template or "startup AI" marketing page (no neon purples/blues, no glow-on-black).
- **Don't** use decorative glassmorphism or heavy blur; depth comes from tone, not frosted panels.
- **Don't** use `border-left`/`border-right` greater than 1px as a colored accent stripe on cards, list items, or callouts. Light the leading number or tint the background instead.
- **Don't** use gradient text (`background-clip: text`); emphasize with weight, size, or the solid petróleo.
- **Don't** ship the hero-metric template (big number, small label, gradient) as filler. The two impact figures earn their place only because they carry real, labeled proof.
- **Don't** overshoot, bounce, or fly objects around. If motion feels like a demo, it is wrong.
- **Don't** introduce a third typeface or use Comico for body copy.
