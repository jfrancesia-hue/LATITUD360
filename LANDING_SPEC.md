# 🎬 BUILD PROMPT — LANDING CINEMATOGRÁFICA LATITUD360

> Single-page landing site para `latitud360.com` con estética cinematográfica industrial premium. La landing master del ecosistema. 6 secciones full-height con video loops 4K, sistema liquid-glass, animaciones Framer Motion. Inspirada en SpaceX/Apple/Aeon Aerospace pero aplicada al universo minero del NOA argentino.

---

## 🎯 CONCEPTO CREATIVO

**Tagline maestro:** *"Una latitud. Todas tus operaciones."*

**Tagline alternativo:** *"El sistema operativo de la minería del NOA."*

**Mood visual:**
- Cinematográfico, premium, futurista pero anclado en lo real del NOA
- Paleta dominante: negros profundos + naranja seguridad (#FF6B1A) + turquesa Andes (#00C2B8) + dorado litio (#D4AF37) + blanco ártico
- Texturas reales: salar de Hombre Muerto aéreo, polvo de mina iluminado nocturno, cordillera al amanecer, drones, camiones CAT 793, sensores IoT con LEDs, salas de control con holografías, trabajadores mineros con casco
- Sin stock photo genérico

**Comparables visuales:**
- aeon.co · spacex.com · apple.com/vision-pro · rivian.com · palantir.com · linear.app

---

## 🛠️ STACK TÉCNICO (CDN-only)

```html
<script src="https://cdn.tailwindcss.com"></script>
<script src="https://unpkg.com/react@18.3.1/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js"></script>
<script src="https://unpkg.com/framer-motion@11.11.17/dist/framer-motion.js"></script>
<script>window.Motion = window.FramerMotion;</script>
```

Body bg `#000`. App React montada en `#root`. Componentes vía `<script type="text/babel">` exportando `window.X = X`.

---

## 🔤 TIPOGRAFÍA

```
family=Instrument+Serif:ital@0;1&family=Barlow:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400
```

Tailwind config:
- `font-heading` → `'Instrument Serif', serif` (italic en titulares grandes)
- `font-body` → `'Barlow', sans-serif`
- `font-mono` → `'JetBrains Mono', monospace`

Border radius default: `DEFAULT: "9999px"` (pill por defecto).

---

## 🌫️ LIQUID-GLASS UTILITIES

```css
.liquid-glass {
  background: rgba(255,255,255,0.01);
  background-blend-mode: luminosity;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border: none;
  box-shadow: inset 0 1px 1px rgba(255,255,255,0.1);
  position: relative;
  overflow: hidden;
}
.liquid-glass::before {
  content: "";
  position: absolute; inset: 0;
  border-radius: inherit;
  padding: 1.4px;
  background: linear-gradient(180deg,
    rgba(255,255,255,0.45) 0%,
    rgba(255,255,255,0.15) 20%,
    rgba(255,255,255,0) 40%,
    rgba(255,255,255,0) 60%,
    rgba(255,255,255,0.15) 80%,
    rgba(255,255,255,0.45) 100%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}
.liquid-glass-strong {
  background: rgba(255,255,255,0.01);
  background-blend-mode: luminosity;
  backdrop-filter: blur(50px);
  -webkit-backdrop-filter: blur(50px);
  border: none;
  box-shadow: 4px 4px 4px rgba(0,0,0,0.05), inset 0 1px 1px rgba(255,255,255,0.15);
  position: relative;
  overflow: hidden;
}
.liquid-glass-strong::before {
  content: "";
  position: absolute; inset: 0;
  border-radius: inherit;
  padding: 1.4px;
  background: linear-gradient(180deg,
    rgba(255,255,255,0.5) 0%,
    rgba(255,255,255,0.2) 20%,
    rgba(255,255,255,0) 40%,
    rgba(255,255,255,0) 60%,
    rgba(255,255,255,0.2) 80%,
    rgba(255,255,255,0.5) 100%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

/* Variantes por producto */
.liquid-glass-orange::before {
  background: linear-gradient(180deg, rgba(255,107,26,0.45) 0%, rgba(255,107,26,0.15) 20%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 60%, rgba(255,107,26,0.15) 80%, rgba(255,107,26,0.45) 100%);
}
.liquid-glass-turquoise::before {
  background: linear-gradient(180deg, rgba(0,194,184,0.45) 0%, rgba(0,194,184,0.15) 20%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 60%, rgba(0,194,184,0.15) 80%, rgba(0,194,184,0.45) 100%);
}
.liquid-glass-gold::before {
  background: linear-gradient(180deg, rgba(212,175,55,0.45) 0%, rgba(212,175,55,0.15) 20%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 60%, rgba(212,175,55,0.15) 80%, rgba(212,175,55,0.45) 100%);
}
```

---

## 📺 FadingVideo COMPONENT

```javascript
const FadingVideo = ({ src, className, style }) => {
  const ref = React.useRef(null);
  const rafRef = React.useRef(null);
  const fadingOutRef = React.useRef(false);
  const FADE_MS = 500;
  const FADE_OUT_LEAD = 0.55;

  const fadeTo = (target, duration = FADE_MS) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const v = ref.current;
    if (!v) return;
    const start = performance.now();
    const from = parseFloat(v.style.opacity || 0);
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      v.style.opacity = from + (target - from) * t;
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  React.useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.style.opacity = 0;
    const onLoaded = () => { v.play(); fadeTo(1); };
    const onTimeUpdate = () => {
      if (!fadingOutRef.current && v.duration - v.currentTime <= FADE_OUT_LEAD && v.duration - v.currentTime > 0) {
        fadingOutRef.current = true;
        fadeTo(0);
      }
    };
    const onEnded = () => {
      v.style.opacity = 0;
      setTimeout(() => {
        v.currentTime = 0;
        v.play();
        fadingOutRef.current = false;
        fadeTo(1);
      }, 100);
    };
    v.addEventListener('loadeddata', onLoaded);
    v.addEventListener('timeupdate', onTimeUpdate);
    v.addEventListener('ended', onEnded);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      v.removeEventListener('loadeddata', onLoaded);
      v.removeEventListener('timeupdate', onTimeUpdate);
      v.removeEventListener('ended', onEnded);
    };
  }, []);

  return <video ref={ref} src={src} autoPlay muted playsInline preload="auto" className={className} style={style} />;
};
```

`loop` OFF — looping manual via `ended`. Sin transiciones CSS.

---

## 🧠 BlurText COMPONENT (word-by-word blur-in)

```javascript
const BlurText = ({ text, className, delayBase = 0 }) => {
  const ref = React.useRef(null);
  const [visible, setVisible] = React.useState(false);
  const { motion } = window.Motion;

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const words = text.split(' ');
  return (
    <p ref={ref} className={className} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', rowGap: '0.1em' }}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ filter: 'blur(10px)', opacity: 0, y: 50 }}
          animate={visible ? {
            filter: ['blur(10px)', 'blur(5px)', 'blur(0px)'],
            opacity: [0, 0.5, 1],
            y: [50, -5, 0]
          } : {}}
          transition={{ duration: 0.7, times: [0, 0.5, 1], ease: 'easeOut', delay: delayBase + (i * 100) / 1000 }}
          style={{ display: 'inline-block', marginRight: '0.28em' }}
        >
          {word}
        </motion.span>
      ))}
    </p>
  );
};
```

---

## 🎬 SECCIÓN 1 — HERO

### Background video
**Concepto:** Aerial drone shot al amanecer del **Salar del Hombre Muerto (Catamarca)**. Piletones de evaporación de litio formando patrones geométricos turquesa-blanco. Cámara desciende lentamente revelando escala industrial. Cielo despejado tonos rosados-azules.

```
src: [URL del video render — ver prompts de generación al final]
class: absolute left-1/2 top-0 -translate-x-1/2 object-cover object-top z-0
style: { width: "120%", height: "120%" }
```

Sin overlay. Capa `z-10` contiene Navbar → Hero content → Trust bar.

### Navbar (fixed top-4, px-8 / lg:px-16, z-50)

- **Izquierda:** círculo liquid-glass 48×48 con logo Latitud360 (una "L" estilizada en serif itálica blanca, o símbolo de meridiano + 360)
- **Centro (desktop):** pill liquid-glass `px-1.5 py-1.5` con 6 links: **Plataforma · Productos · Industrias · Casos · Latitud · Contacto** + botón blanco pill **Solicitar Demo** + ArrowUpRight icon
- **Derecha:** spacer 48×48 invisible

### Hero content (centered, pt-24 px-4)

Animaciones Framer Motion: `initial: {filter: 'blur(10px)', opacity: 0, y: 20}`, easeOut.

**Badge (delay 0.4s):** liquid-glass rounded-full pill. Contiene chip blanco "NUEVO" (`bg-white text-black px-3 py-1 text-xs font-semibold`) + texto "Lanzamiento 2026 en Catamarca, Salta y Jujuy" (`text-sm text-white/90 pr-3`).

**Headline (BlurText word-by-word):**
> **"Una latitud. Todas tus operaciones."**

Classes: `text-6xl md:text-7xl lg:text-[5.5rem] font-heading italic text-white leading-[0.8] max-w-4xl justify-center tracking-[-4px]`

**Subheading (delay 0.8s):**
> "El sistema operativo de la minería del NOA. Una sola plataforma que unifica operaciones, comunicación interna y medio sectorial. Construida en Catamarca con IA predictiva entrenada para el Triángulo del Litio."

Classes: `mt-4 text-sm md:text-base text-white max-w-2xl font-body font-light leading-tight`

**CTAs (delay 1.1s, flex items-center gap-6 mt-6):**
- Primary: liquid-glass-strong `rounded-full px-5 py-2.5 text-sm font-medium text-white` con "Solicitar Demo" + ArrowUpRight (h-5 w-5)
- Secondary: link bare, "Ver plataforma" + Play icon (h-4 w-4 filled)

**Stats row (delay 1.3s, flex items-stretch gap-4 mt-8):** 3 cards liquid-glass `p-5 w-[220px] rounded-[1.25rem]`:

| Card | Ícono | Número | Label |
|---|---|---|---|
| 1 | Shield | **-32%** | Reducción incidentes HSE |
| 2 | Cog | **-25%** | Downtime no planificado |
| 3 | Users | **+300%** | Engagement del trabajador |

Números en Instrument Serif italic blanco `text-4xl tracking-[-1px] leading-none`. Labels `text-xs text-white font-body font-light mt-2`.

### Trust bar (bottom hero, delay 1.4s)

`flex flex-col items-center gap-4 pb-8`:
- Chip liquid-glass `px-3.5 py-1 text-xs font-medium text-white`: "Construido en Catamarca para la minería de Argentina, Bolivia y Chile"
- Fila en Instrument Serif italic blanco, `text-2xl md:text-3xl tracking-tight`, `gap-12/md:gap-16`:
  **Catamarca · Salta · Jujuy · La Rioja · Antofagasta**

---

## 🎬 SECCIÓN 2 — TRES PRODUCTOS UNIFICADOS

### Background video
**Concepto:** Time-lapse cinematográfico de la cordillera del NOA al amanecer, transición lenta a operación minera diurna. Sirve como fondo neutro sutil.

```
src: [URL — ver prompts]
class: absolute inset-0 w-full h-full object-cover z-0
```

### Content (`relative z-10 px-8 md:px-16 lg:px-20 pt-24 pb-10 flex flex-col min-h-screen`)

**Header (mb-auto, centrado):**
- Kicker: `text-sm font-body text-white/80 mb-6` → `// La plataforma`
- Heading: `font-heading italic text-white text-6xl md:text-7xl lg:text-[6rem] leading-[0.9] tracking-[-3px]`:
  > **"Tres productos.**
  > **Una sola plataforma."**

- Subtext (`mt-6 text-base text-white/80 font-body font-light max-w-2xl mx-auto`):
  > "Latitud360 unifica operaciones mineras, comunicación interna y medio sectorial en un solo sistema con IA. Login único, datos cruzados, inteligencia compuesta."

### Tres cards grandes (grid grid-cols-1 md:grid-cols-3 gap-6 mt-16)

Cada card: `liquid-glass rounded-[1.5rem] p-8 min-h-[480px] flex flex-col`. Cada producto tiene su variante de glow (orange/gold/turquoise).

**CARD 1 — MINERA360** (liquid-glass-orange)
```
Top: ícono Mountain en liquid-glass square 56×56 (color naranja)
Tags pills: HSE · Ambiente · Mantenimiento · Capacitación
Título: "Minera360"
Subtítulo: font-mono text-xs text-orange-400 uppercase → "MINING OPERATIONS"
Body:
  "La plataforma operativa para mineras del NOA. Seguridad, ambiente,
   mantenimiento y capacitación en un solo sistema con IA predictiva.
   Reduce 30% los incidentes y 25% el downtime."
Footer: link "Conocer Minera360 →"
```

**CARD 2 — LATITUD** (liquid-glass-gold)
```
Top: ícono Radio/Antenna en liquid-glass square 56×56 (color dorado)
Tags pills: Portal · Streaming · Sponsors · Newsletter
Título: "Latitud"
Subtítulo: font-mono text-xs text-yellow-400 uppercase → "MEDIO SECTORIAL"
Body:
  "El medio especializado del NOA minero. Estudio de streaming propio,
   cobertura editorial profesional y comunicación estratégica para
   empresas, Estado y comunidad."
Footer: link "Conocer Latitud →"
```

**CARD 3 — CONTACTO** (liquid-glass-turquoise)
```
Top: ícono Users en liquid-glass square 56×56 (color turquesa)
Tags pills: Muro social · Onboarding · Recibos · Cultura
Título: "Contacto"
Subtítulo: font-mono text-xs text-cyan-400 uppercase → "RRHH MINERA"
Body:
  "La intranet móvil del minero. Comunicación interna, RRHH operativo
   y cultura para tu fuerza laboral en faena. Diseñado para turnos
   rotativos y campamentos sin señal."
Footer: link "Conocer Contacto →"
```

### Add-on opcional (mt-12, banner horizontal)

Card pequeña liquid-glass full-width:
```
[Ícono Wrench] TOORI SERVICIOSYA — Add-on opcional
"¿Necesitás contratar prestadores externos? Activalo on-demand
 desde tu plataforma. Marketplace verificado de servicios."
[Botón "Saber más →"]
```

---

## 🎬 SECCIÓN 3 — AI COPILOT

### Background video
**Concepto:** **Sala de control minera futurista** con pantallas holográficas mostrando datos en vivo: mapa de mina con camiones georreferenciados, gráficos de vibración, alertas de seguridad. Operador supervisando. Cyan/turquesa con acentos naranja.

```
src: [URL]
class: absolute inset-0 w-full h-full object-cover z-0
```

### Layout split

`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-screen px-8 md:px-16 lg:px-20`

**Columna izquierda:**
- Kicker: `// Latitud Copilot`
- Heading: `font-heading italic text-white text-6xl lg:text-[5rem] leading-[0.85]`:
  > **"Tu cerebro operativo. Que nunca duerme."**
- Body (`mt-6 text-base text-white/80 font-body font-light max-w-md`):
  "El primer agente de IA entrenado en datos cruzados de los 3 productos. Predice incidentes combinando seguridad, ambiente, mantenimiento y comunicación interna. Te dice qué va a fallar antes de que falle."
- 3 features con check icon naranja (mt-6 space-y-3 text-sm):
  - "Predice incidentes cruzando 5+ fuentes de datos"
  - "Genera reportes ejecutivos en 30 segundos"
  - "Responde en español argentino, no en gringlés corporativo"
- CTA liquid-glass-strong (mt-8): "Ver demo del Copilot →"

**Columna derecha — chat mockup flotante:**
Card liquid-glass-strong (`rounded-[1.5rem] p-6`) simulando chat:

```
┌──────────────────────────────────────────┐
│ 🤖 Latitud Copilot                       │
├──────────────────────────────────────────┤
│                                          │
│  [Op] ¿Qué riesgos tengo mañana en faena?│
│                                          │
│  [🔶 Copilot]                            │
│  "Buenos días Jorge. Detecté 3 alertas   │
│   para mañana:                           │
│                                          │
│   🔴 CRÍTICO — Camión 47 con vibración   │
│      fuera de rango (+18% últimos 7d).   │
│      Probabilidad de falla: 73%.         │
│                                          │
│   🟡 MEDIO — 4 operarios turno noche con │
│      recertificación de manejo defensivo │
│      vencida. Bloqueé sus accesos.       │
│                                          │
│   🟢 INFO — Pronóstico viento >40km/h    │
│      a las 14hs. Suspender izaje en      │
│      plataforma 3. Notifiqué a Méndez."  │
│                                          │
└──────────────────────────────────────────┘
```

Texto en `font-mono text-sm` para verse técnico. Mensajes con avatares circulares.

---

## 🎬 SECCIÓN 4 — INDUSTRIAS DEL NOA

### Background video
**Concepto:** Mosaico cinematográfico de 4 escenas mineras del NOA con dissolves: salar de litio aéreo, mina de oro al amanecer, mina de cobre con polvo iluminado, salar al atardecer.

### Content

Header centrado:
- Kicker: `// Industrias`
- Heading (`font-heading italic text-white text-6xl lg:text-[5.5rem] leading-[0.85]`):
  > **"Construido para la realidad del NOA"**

### Grid 4 cards (mt-16, grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6)

Cada card: imagen cover oscurecida 60% con liquid-glass overlay en bottom + chip stat. `min-h-[400px] rounded-[1.25rem] overflow-hidden relative`.

| Industria | Imagen background | Stat key |
|---|---|---|
| **Litio** | Salar de evaporación aéreo turquesa | "60% del litio argentino se produce en NOA" |
| **Oro** | Tajo abierto al amanecer dorado | "8 proyectos activos en Catamarca y Salta" |
| **Cobre** | Excavadora gigante con polvo iluminado | "MARA + Agua Rica = USD 4.500M inversión" |
| **Salares** | Drone shot piletones geométricos | "Triángulo del litio = 56% reservas mundo" |

Cada card tiene en la parte inferior:
- Chip pequeño liquid-glass: nombre industria
- Título Instrument Serif italic blanco grande
- Stat en font-mono `text-xs text-white/70`
- Link "Casos de uso →"

---

## 🎬 SECCIÓN 5 — CASOS Y CLIENTES

### Background sutil (no video, gradiente negro)

Header centrado:
- Kicker: `// Confianza`
- Heading: **"Trabajamos con quienes mueven el NOA"**

### Logos grid (mt-12)
Fila horizontal de logos en blanco/gris claro de:
- Mineras objetivo (al inicio mostrar como "En conversaciones con": Livent, Eramet, Ganfeng, Allkem)
- Cámaras: CAEM, CAMYEN
- Estado: Ministerio de Minería de Catamarca
- Aceleradoras: Repsol Fondo de Emprendedores

### Testimonial card grande (mt-12)
Liquid-glass-strong centrado, max-w-3xl, `p-12 rounded-[1.5rem]`:

```
"Estamos construyendo desde Catamarca la infraestructura
 digital que toda la minería del NOA necesita. Latitud360
 no es un software más: es el operating system del sector."

— Jorge Eduardo Francesia
   Founder & CEO, Nativos
```

Avatar circular de Jorge a la izquierda + texto a la derecha.

---

## 🎬 SECCIÓN 6 — CTA FINAL + FOOTER

### Background video
**Concepto:** Paisaje del NOA al atardecer con cordillera y salares. Cámara estática meditativa.

### Content centrado

```
[Chip pequeño liquid-glass]
PARA MINERAS DEL TRIÁNGULO DEL LITIO

[Headline gigante BlurText]
Tu próxima
revolución operativa
empieza acá.

[Subheading]
Agendá una demo personalizada con nuestro equipo.
30 minutos. Sin compromiso. Te mostramos exactamente
cómo Latitud360 se aplicaría a tu operación.

[CTA principal — botón gigante liquid-glass-strong]
Solicitar demo →

[Trust line tipográfica]
Catamarca · Argentina · 2026
```

### Footer minimalista

Border-top sutil, footer en `liquid-glass border-t border-white/5`:

```
┌────────────────────────────────────────────────────┐
│                                                    │
│  LATITUD360                                        │
│  Una latitud. Todas tus operaciones.               │
│                                                    │
│  ────────────────────────────────────────          │
│                                                    │
│  PRODUCTOS    PLATAFORMA    EMPRESA    LEGAL       │
│  Minera360    Seguridad     Nosotros   Privacidad  │
│  Latitud      Compliance    Equipo     Términos    │
│  Contacto     API           Carreras   Cookies     │
│  Toori        Estado        Prensa                 │
│                                                    │
│  ────────────────────────────────────────          │
│                                                    │
│  © 2026 Nativos Consultora Digital                 │
│  Catamarca, Argentina                              │
│                                                    │
│  [LinkedIn] [X] [YouTube] [Instagram]              │
│                                                    │
└────────────────────────────────────────────────────┘
```

---

## 🎥 VIDEOS A GENERAR — PROMPTS PARA RUNWAY/SORA/VEO/KLING

### Video 1 — Hero (Salar Hombre Muerto amanecer)
```
Cinematic aerial drone shot, sunrise over the Salar del Hombre Muerto in Catamarca,
Argentina, 4000m altitude. Vast lithium evaporation ponds in geometric turquoise,
white and earth-tone patterns. Slow descending camera movement revealing massive
industrial scale. Andean cordillera silhouette in distant horizon. Soft pastel sky
with pink and blue hues. Photorealistic, ultra detailed, 4K, no text, no people,
no logos. 15 second loop, gentle motion.
```

### Video 2 — Cordillera al amanecer (sección 2 productos)
```
Cinematic time-lapse of the Andes mountains in Catamarca province, sunrise to early
morning. Snow-capped peaks transitioning from purple to orange to white. Slow
forward dolly movement. Mining infrastructure barely visible in valleys below.
Awe-inspiring scale, ultra detailed, 4K, photorealistic, no text. 15 second loop.
```

### Video 3 — AI Copilot (sala de control)
```
Futuristic mining operations control room. Multiple holographic displays floating
in the air showing real-time mine maps with vehicle GPS tracking, equipment vibration
graphs, safety alerts highlighted in orange. A supervisor wearing a mining helmet
observing the screens, soft profile lighting on his face. Dark room with cyan and
orange ambient lighting, deep depth of field, particles in air, 4K cinematic, ultra
detailed, photorealistic. 15 second loop.
```

### Video 4 — Industrias mosaico
```
Aerial cinematic montage of mining operations in the NOA region of Argentina.
Sequential shots: lithium salt flats with geometric ponds at golden hour, open-pit
gold mine at sunrise with golden light, copper mine with massive excavator and dust
clouds illuminated, Andean landscape with snow-capped peaks. Slow dissolving
transitions. 4K, ultra detailed, photorealistic, no text, no logos. 20 second loop.
```

### Video 5 — Atardecer cordillera (CTA final)
```
Cinematic landscape shot of the Andes mountains in northwest Argentina at sunset.
Distant lithium salt flats reflecting purple and orange sky. Static camera with
very subtle natural sway. Meditative, vast, awe-inspiring. Sky transitioning from
orange to deep purple with first stars appearing. 4K ultra detailed, photorealistic,
no text, no people, no logos. 15 second loop.
```

---

## 🎨 ELEMENTOS 3D OPCIONALES (avanzado)

Si querés sumar complejidad visual con Three.js / R3F:

**1. Globo terráqueo 3D rotando**
Centrado en Sudamérica con pins luminosos en cada operación minera del NOA. Usable en sección Industrias.

**2. Modelo 3D camión CAT 793**
Rotando lentamente sobre fondo transparente, con datos flotantes (GPS, vibración, horas operativas). Usable como decorador en sección Minera360.

**3. Visualización 3D de partículas**
Datos fluyendo entre los 3 productos hacia el AI Copilot central. Usable como transición.

CDN sugerido:
```html
<script src="https://unpkg.com/three@0.160.0/build/three.module.js"></script>
```

---

## 🎨 PALETA EXACTA

```css
:root {
  --negro-mina:        #0A0A0A;  /* fondo dominante */
  --gris-acero:        #1F1F1F;  /* secundario */
  --naranja-seguridad: #FF6B1A;  /* Minera360, CTAs, alertas */
  --turquesa-andes:    #00C2B8;  /* Contacto, datos, IA */
  --dorado-litio:      #D4AF37;  /* Latitud, premium */
  --blanco-artico:     #F5F5F5;  /* texto principal */
  --gris-niebla:       rgba(255,255,255,0.6);
  --verde-ok:          #00B86B;
  --rojo-alerta:       #E63946;
}
```

---

## ✅ NOTAS FINALES

- Texto blanco; sin gradientes de fondo
- Sin transiciones CSS en videos — solo rAF
- Videos full-bleed sin overlay oscuro — contraste viene del liquid-glass chrome
- Mobile: stats row pasa a `flex-col`, cards de productos a `grid-cols-1`
- Performance: lazy-load de videos por sección con IntersectionObserver
- Accessibility: alt text en todas las imágenes, focus rings visibles, prefers-reduced-motion respetado
