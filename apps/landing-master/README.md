# Latitud360 · Landing Master

Single-page cinematográfica para **latitud360.com**. La master del ecosistema (Minera360 + Latitud + Contacto + Toori).

Stack CDN-only · React 18 + Tailwind + Framer Motion 11 · Babel standalone in-browser · 6 secciones full-height · liquid-glass · `FadingVideo` con rAF · `BlurText` word-by-word.

---

## Cómo correr en local

No requiere build, instalación ni Node. Solo necesita servir vía HTTP (no `file://` porque los `<video>` no levantan):

### Opción A — Python
```bash
cd E:\Usuario\Latitud360\apps\landing-master
python -m http.server 5500
# abrir http://localhost:5500
```

### Opción B — Node sin instalar nada
```bash
npx serve .
```

### Opción C — VS Code Live Server
Abrir `index.html` con la extensión Live Server (clic derecho → "Open with Live Server").

---

## Estructura

```
landing-master/
├── index.html              ← single-file: todo el React + Tailwind + estilos
├── README.md               ← este archivo
├── videos/
│   ├── README.md           ← prompts Sora/Runway/Veo y specs ffmpeg
│   ├── 01-hero.mp4         ← (a generar)
│   ├── 02-cordillera.mp4   ← (a generar)
│   ├── 03-control-room.mp4 ← (a generar)
│   ├── 04-industrias.mp4   ← (a generar)
│   └── 05-atardecer.mp4    ← (a generar)
└── assets/                 ← (logos sponsors, etc — vacío por ahora)
```

**Sin videos aún:** la landing se ve igual de cinematográfica gracias a los **mesh gradients animados** que cubren el fondo de cada sección con la paleta correcta (negro mina + naranja seguridad + turquesa Andes + dorado litio + acentos morados). El `FadingVideo` queda en opacity 0 cuando no encuentra el archivo, y abajo se ve la capa CSS.

---

## Secciones

1. **Hero** — Salar Hombre Muerto · headline `Una latitud. Todas tus operaciones.` · 3 stats HSE · trust bar provincias
2. **Tres productos** — Minera360 (naranja) · Latitud (dorado) · Contacto (turquesa) · banner add-on Toori
3. **AI Copilot** — split copy + chat mockup con mensaje real de alertas predictivas
4. **Industrias** — Litio · Oro · Cobre · Salares (4 cards con stats sectoriales NOA)
5. **Casos** — logos targets (Livent, Eramet, Ganfeng, Allkem, CAEM, CAMYEN, Min. Minería, Repsol) + testimonial Jorge Francesia
6. **CTA + Footer** — atardecer cordillera · botón demo · footer con LinkedIn/X/YouTube/Instagram + 4 columnas

---

## Sistema de diseño aplicado

- **Tipografía:** Instrument Serif Italic (display) · Barlow (UI) · JetBrains Mono (datos técnicos)
- **Border radius default:** `9999px` (pill por defecto, override solo en cards)
- **Liquid-glass:** 4 variantes (base, strong, +tints orange/turquoise/gold)
- **Paleta:** `#0A0A0A` `#1F1F1F` `#FF6B1A` `#00C2B8` `#D4AF37` `#F5F5F5`
- **Animaciones:** `BlurText` word-by-word (IntersectionObserver) · `FadingVideo` rAF custom · entrada de stats con stagger 0.4 → 1.4s

---

## Performance & a11y

- ✅ Sin gradiente CSS overlay encima de videos (contraste viene del liquid-glass chrome)
- ✅ Lazy-load implícito: `<video preload="auto">` solo descarga cuando el browser entra al viewport (en mesh gradients abajo)
- ✅ `prefers-reduced-motion` deshabilita animaciones
- ✅ `aria-label` en navbar + redes
- ✅ `focus-visible` rings en color naranja seguridad
- ✅ Mobile-first responsive (stats en columna, cards apiladas, navbar con drawer)
- ✅ Grain overlay sutil en cada sección para textura cinemática

---

## Próximos pasos sugeridos

1. Generar los 5 videos siguiendo `videos/README.md`
2. Mover a `pnpm` + Vite + estructura de monorepo Turborepo (`E:\Usuario\Latitud360\turbo.json`) para integrar con `apps/web`, `apps/api`, `apps/mobile`
3. Cuando esté listo, deploy a Vercel apuntando `latitud360.com` → `apps/landing-master`
4. Wireup de form de demo (capturar a Supabase / Resend / HubSpot)

---

**Nativos Consultora Digital · Catamarca · 2026**
