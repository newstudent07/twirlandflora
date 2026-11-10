# Twirl & Flora — AI Agent Guidelines & Architecture

Welcome to **Twirl & Flora**, an editorial, luxury floral e-commerce web application built with React, Vite, Framer Motion, and Swiper.

This document serves as the single source of truth for AI agents working in this repository.

---

## 1. Tech Stack & Environment

- **Framework**: React 19 (`react`, `react-dom`)
- **Bundler & Tooling**: Vite 8 (`vite`, `@vitejs/plugin-react`)
- **Routing**: React Router DOM v7 (`react-router-dom`)
- **Motion & Physics**: Framer Motion (`framer-motion`), Swiper 14 (`swiper`)
- **Linter**: Oxlint (`oxlint`)
- **Styling**: **Vanilla CSS**. We do **not** use Tailwind CSS. Component-level styles and global design tokens are strictly maintained in `.css` files.
- **Path Aliasing**: `@/` maps to `<root>/src/` (configured in `vite.config.js`).

---

## 2. Directory Structure

```
Twirlandflora/
├── public/                 # Static assets (high-res photography, SVGs, favicon)
│   ├── favicon.svg
│   ├── hero_floral.jpg
│   ├── hero_floral_2.jpg
│   ├── hero_floral_3.jpg
│   ├── product1.jpg
│   └── product2.jpg
├── src/
│   ├── components/         # Core UI and layout components
│   │   ├── v1/             # Interactive UI showcase components (e.g., skiper48)
│   │   │   ├── skiper48.jsx
│   │   │   └── skiper48.css
│   │   ├── CategoryGrid.jsx / .css
│   │   ├── DemoSkiper19.jsx / .css  # Continuous pink vine scroll trail
│   │   ├── Footer.jsx
│   │   ├── Hero.jsx / .css          # Hero section hosting Carousel_002
│   │   ├── Navbar.jsx / .css
│   │   ├── NewsletterBanner.jsx / .css
│   │   ├── ProductGrid.jsx / .css
│   │   ├── ScrollReveal.jsx
│   │   ├── ServiceStrip.jsx / .css
│   │   └── Story.jsx
│   ├── lib/
│   │   └── utils.js        # Helper utilities (e.g., cn classnames helper)
│   ├── pages/
│   │   ├── Home.jsx        # Landing page with scroll vine background
│   │   └── CategoryPage.jsx
│   ├── App.jsx             # Top-level routing and wrapper
│   ├── App.css
│   ├── index.css           # Global typography, color tokens, and base CSS
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── AGENTS.md
```

---

## 3. Design System & Aesthetic Principles

### Typography
- **Headings**: `'Playfair Display', serif`
- **Body & Controls**: `'Plus Jakarta Sans', sans-serif`

### Color Palette (CSS Variables in `index.css`)
- `--color-ivory`: `#FDF7ED` (Warm, creamy editorial background)
- `--color-olive`: `#4F5039` (Primary brand tone, headings, rich accents)
- `--color-charcoal`: `#625D55` (Body text, subtle outlines)
- `--color-rose`: `#CA7D7C` (Primary CTA color, active dots, badges)
- `--color-white`: `#FFFFFF`
- Scroll Trail Tone: `#FF7597` (Floral vine glowing path with soft drop-shadow)

### Styling Rules
1. **Pure Vanilla CSS**: Never introduce Tailwind CSS classes unless explicitly commanded by the user.
2. **Component CSS Pairs**: Keep component styles modular (e.g., `Hero.jsx` paired with `Hero.css`).
3. **No Placeholders**: Never use gray placeholder blocks. Always use curated high-resolution photography in `public/`.
4. **Rich Micro-Interactions**: Hover elevations, pill transitions, and smooth transforms should feel responsive and editorial.

---

## 4. Key Interactive Components

### 1. `Carousel_002` (`@/components/v1/skiper48`)
- **Technology**: Swiper with `EffectCards`, `Autoplay`, `Pagination`, and `Navigation`.
- **Location**: Mounted within the hero image area (`Hero.jsx`).
- **Features**: 3D stacked deck swipe, glassmorphic arrow controls, auto-advancing with hover-pause, and smooth pill pagination.

### 2. `DemoSkiper19` (Scroll Vine Effect)
- **Technology**: Framer Motion SVG path animation with `useScroll` and `useTransform`.
- **Location**: Rendered as an absolute background layer within `Home.jsx`.
- **Behavior**: Stretches across the full page height (`2800px` viewBox). It starts smoothly at the header and continues to the bottom of the page, eliminating static rest dot artifacts.

---

## 5. Development & Validation Workflow

### Running Locally
- The Vite development server runs on:
  ```bash
  npm run dev
  # Default port: http://localhost:5173/
  ```

### Verifying Changes
Before concluding any task, always validate syntax and build integrity:
1. **Linting**:
   ```bash
   npm run lint
   ```
2. **Production Bundle**:
   ```bash
   npm run build
   ```
   Ensures that imports, path aliases (`@/`), CSS stylesheets, and JSX syntax compile cleanly without errors.

---

## 6. Guidelines for AI Agents

1. **Maintain Documentation Integrity**: Preserve existing comments, docstrings, and established architectural patterns.
2. **Path Aliasing**: Use `@/` for imports within `src/` (e.g. `import { Carousel_002 } from '@/components/v1/skiper48';`).
3. **Responsive Sizing**: Test that responsive breakpoints (1200px, 768px, 480px) scale smoothly on mobile and desktop devices.
4. **Dev Server Persistence**: Keep the Vite development server running in the background—do not kill running dev servers unnecessarily.
