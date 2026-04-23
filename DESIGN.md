---
name: LingoFlow
colors:
  surface: '#fbf9f8'
  surface-dim: '#dbd9d9'
  surface-bright: '#fbf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f3'
  surface-container: '#efeded'
  surface-container-high: '#eae8e7'
  surface-container-highest: '#e4e2e2'
  on-surface: '#1b1c1c'
  on-surface-variant: '#3f4a36'
  inverse-surface: '#303030'
  inverse-on-surface: '#f2f0f0'
  outline: '#6f7b64'
  outline-variant: '#becbb1'
  surface-tint: '#2b6c00'
  primary: '#2b6c00'
  on-primary: '#ffffff'
  primary-container: '#58cc02'
  on-primary-container: '#1e5000'
  inverse-primary: '#6be026'
  secondary: '#006590'
  on-secondary: '#ffffff'
  secondary-container: '#2fb8ff'
  on-secondary-container: '#004666'
  tertiary: '#755b00'
  on-tertiary: '#ffffff'
  tertiary-container: '#ddad00'
  on-tertiary-container: '#574300'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#87fe45'
  primary-fixed-dim: '#6be026'
  on-primary-fixed: '#082100'
  on-primary-fixed-variant: '#1f5100'
  secondary-fixed: '#c8e6ff'
  secondary-fixed-dim: '#88ceff'
  on-secondary-fixed: '#001e2e'
  on-secondary-fixed-variant: '#004c6e'
  tertiary-fixed: '#ffdf92'
  tertiary-fixed-dim: '#f4bf00'
  on-tertiary-fixed: '#241a00'
  on-tertiary-fixed-variant: '#594400'
  background: '#fbf9f8'
  on-background: '#1b1c1c'
  surface-variant: '#e4e2e2'
typography:
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '800'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '500'
    lineHeight: '1.5'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  gutter: 16px
  margin: 24px
---
 
```markdown
# Design System Documentation: The Kinetic Studio
 
## 1. Overview & Creative North Star
**Creative North Star: "The Kinetic Studio"**
 
To move beyond the sea of generic, flat gamification, this design system adopts the philosophy of **Kinetic Studio**. We are not just building an interface; we are crafting a physical workspace that responds with weight, tactile satisfaction, and high-end editorial clarity. 
 
While inspired by high-energy learning platforms, we elevate the experience by replacing "childish" flat colors with **chromatic depth** and **intentional asymmetry**. We break the rigid, templated look by using oversized typography scales and overlapping elements that suggest the UI is a series of stacked, physical objects. Every interaction should feel like pressing a well-crafted mechanical button, and every screen should feel like a premium magazine spread designed for play.
 
---
 
## 2. Colors & Surface Philosophy
 
The color palette is vibrant and high-contrast, rooted in a "functional color" logic where hue indicates action and state.
 
### Tonal Foundations
- **Primary (`#2b6c00` / `#58cc02`):** Used for "Success" and progress. 
- **Secondary (`#006590` / `#2fb8ff`):** Used for informational accents and secondary actions.
- **Tertiary (`#755b00` / `#ddad00`):** Reserved for "Warning" and "Streak" indicators.
- **Neutral Surface:** We utilize the `surface` (`#fbf9f8`) through `surface-container-highest` (`#e4e2e2`) range to create depth.
 
### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders for sectioning or containment. Boundaries must be defined solely through:
1.  **Background Color Shifts:** A `surface-container-low` card sitting on a `surface` background.
2.  **Tonal Transitions:** Using the hierarchy of the surface tokens to distinguish content blocks.
 
### Surface Hierarchy & Nesting
Treat the UI as a series of nested physical layers. 
- The base of the app is `surface`. 
- Primary content areas reside on `surface-container-low`.
- Interactive cards or "floating" widgets use `surface-container-lowest` (pure white) to provide a "pop" against the off-white background.
 
### The "Glass & Gradient" Rule
To achieve a signature, custom feel, use **Glassmorphism** for navigation bars or floating action menus. Use a semi-transparent `surface` color with a `backdrop-filter: blur(20px)`. 
- **Signature Texture:** For Hero CTAs, do not use a flat hex. Transition from `primary_container` to `primary` in a 15-degree linear gradient. This adds "soul" and mimics natural light hitting a physical object.
 
---
 
## 3. Typography
 
The typography uses **Plus Jakarta Sans**, a rounded sans-serif that balances playfulness with professional geometry.
 
- **Display (Large/Medium):** Reserved for "Big Win" moments or milestone screens. These should be set with tight letter-spacing (-0.02em) to feel punchy.
- **Headline (Small/Medium):** Used for section headers. These drive the "Editorial" feel—don't be afraid of generous top-padding to let these breathe.
- **Title (Medium/Small):** Primary interaction labels.
- **Body:** All reading material. Ensure a line height of at least 1.5x for maximum legibility in high-energy contexts.
 
The hierarchy is intentionally steep. A `display-lg` (3.5rem) may sit directly above a `body-md` (0.875rem), creating a "High-End Editorial" contrast that feels modern and curated.
 
---
 
## 4. Elevation & Depth
 
We eschew traditional drop shadows in favor of **Tonal Layering** and **Extruded Physics**.
 
### The Layering Principle
Depth is achieved by "stacking" surface tokens. Place a `surface-container-lowest` card on a `surface-container-high` section to create an effortless, soft lift.
 
### Ambient Shadows
When a component must "float" (e.g., a modal or a floating action button), use a **Tinted Ambient Shadow**. 
- **Recipe:** Blur: 32px, Y-Offset: 8px, Color: `on-surface` at 6% opacity. 
- This mimics natural light rather than a digital "glow."
 
### The "Ghost Border" Fallback
If high-contrast accessibility is required and a border is unavoidable, use a **Ghost Border**: the `outline-variant` token at 15% opacity. Never use 100% opaque borders.
 
---
 
## 5. Components
 
### 3D Tactile Buttons
Buttons are the "hero" of this system. They must feel pressable.
- **Style:** 16pt rounded corners.
- **The "Extrusion":** Use a solid bottom border (4px) that is a darker shade of the button’s color (e.g., if the button is `primary_container`, the extrusion is `primary`).
- **Interaction:** On "Press," the button should shift down 2px and the extrusion should shrink to 2px, simulating a mechanical click.
 
### Chunky Progress Bars
- **Background:** `surface-container-highest`.
- **Fill:** `primary_container` or `secondary_container`.
- **Height:** 12pt to 16pt. 
- **Detail:** Add a subtle "shimmer" gradient or a rounded inner-cap to the fill to make the progress feel "liquid" and high-end.
 
### Cards & Lists
- **Rule:** No divider lines. 
- Use 16pt to 24pt of vertical whitespace to separate list items. 
- For cards, use `surface-container-low` with a `DEFAULT` (1rem) roundedness scale.
 
### Input Fields
Avoid the "box" look. Use a `surface-container-lowest` background with a subtle "Ghost Border." When focused, the border should animate to a 2pt `secondary` color.
 
---
 
## 6. Do's and Don'ts
 
### Do:
- **Do** use intentional asymmetry. A large headline can be left-aligned with a 32pt top margin, while the body text follows the standard 16pt grid.
- **Do** use "Breathing Room." In a high-energy system, white space acts as a palette cleanser.
- **Do** use tinted shadows. If the background is slightly green, the shadow should have a hint of green.
 
### Don't:
- **Don't** use 1px black or grey dividers. They create "visual noise" and cheapen the editorial feel.
- **Don't** use flat, 2D buttons for primary actions. If it’s important, it needs a "3D extrusion."
- **Don't** cram content. If a screen feels busy, increase the `surface-container` nesting to group elements visually without adding lines.
- **Don't** use standard iOS "Blue" for links. Use the `secondary` or `primary` tokens to maintain the system's signature palette.
 
---
**Director's Note:** This design system is about the *feel* of the tap. If it looks like a template, you’ve failed. If it feels like a physical, premium toy that belongs in a gallery, you’ve succeeded.```
