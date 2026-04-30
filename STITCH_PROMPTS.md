# 🎨 STITCH PROMPTS — DISEÑO DE PANTALLAS LATITUD360

> Prompts listos para Google Stitch para diseñar las pantallas principales de la plataforma. Estética industrial premium minera con sistema unificado.

---

## 🎯 SISTEMA DE DISEÑO BASE (incluir en TODOS los prompts)

```
DESIGN SYSTEM — LATITUD360

Brand: Latitud360 — el sistema operativo de la minería del NOA argentino.

Aesthetic: Industrial premium, futurista pero anclado en lo real.
Inspirations: Linear, Vercel, Stripe Dashboard, Apple Vision Pro, Palantir.

Color Palette:
- Negro mina: #0A0A0A (background primario)
- Gris acero: #1F1F1F (cards, surfaces)
- Gris medio: #2A2A2A (borders, dividers)
- Naranja seguridad: #FF6B1A (Minera360, CTAs críticos, alertas HSE)
- Turquesa Andes: #00C2B8 (Contacto, datos en vivo, IA)
- Dorado litio: #D4AF37 (Latitud, premium accents)
- Blanco ártico: #F5F5F5 (texto principal)
- Gris niebla: rgba(255,255,255,0.6) (texto secundario)
- Verde OK: #00B86B (status positivo)
- Rojo alerta: #E63946 (status crítico)
- Amarillo alerta: #FFC93C (status medio)

Typography:
- Display: Instrument Serif Italic (titulares grandes con personalidad)
- UI: Barlow (Light 300, Regular 400, Medium 500, Semibold 600)
- Datos técnicos: JetBrains Mono o Space Mono

Layout:
- Generous whitespace
- 8px grid system
- Border radius: 8px (elements), 16px (cards), 24px (modals)
- Shadows: subtle, layered
- Glass effects en elementos premium

Iconography: Lucide icons, stroke 1.5, color contextual

Lenguaje: Español argentino, claro y directo (sin tecnicismos innecesarios)
```

---

## 📱 PROMPT 1 — DASHBOARD UNIFICADO (HOME)

**Pantalla:** `app.latitud360.com` después del login

```
Diseña el dashboard unificado de Latitud360 con las siguientes especificaciones:

LAYOUT:
- Sidebar izquierdo fijo (240px) con logo Latitud360, navegación principal y selector
  de producto (Minera360 / Contacto / Latitud)
- Topbar (64px) con search global, notificaciones, perfil de usuario y selector
  de tenant si tiene acceso a múltiples
- Main content area con padding generoso

CONTENIDO DEL HOME:
1. Saludo personalizado: "Hola Jorge, esto pasó en tus operaciones hoy"
   con timestamp en font-mono pequeño

2. Grid de 4 cards de producto (2x2) con altura ~220px:

   CARD 1 — MINERA360 (acento naranja #FF6B1A)
   • Ícono: Mountain (Lucide)
   • Title: "Minera360"
   • Subtitle: "Operaciones"
   • Stats principales:
     - "2 alertas HSE" (rojo)
     - "1 mantenimiento crítico" (amarillo)
     - "12 partes hoy" (texto normal)
   • Botón "Abrir →" abajo derecha

   CARD 2 — CONTACTO (acento turquesa #00C2B8)
   • Ícono: Users
   • Title: "Contacto"
   • Subtitle: "Comunicación interna"
   • Stats:
     - "3 publicaciones nuevas"
     - "47 reconocimientos esta semana"
     - "92% lectura de comunicados"
   • Botón "Abrir →"

   CARD 3 — LATITUD (acento dorado #D4AF37)
   • Ícono: Radio
   • Title: "Latitud"
   • Subtitle: "Medio sectorial"
   • Stats:
     - "1 nota nueva sobre tu mina"
     - "1 entrevista programada"
     - "12.4k visitas este mes"
   • Botón "Abrir →"

   CARD 4 — AI COPILOT (gradient sutil naranja+turquesa)
   • Ícono: Sparkles
   • Title: "Latitud Copilot"
   • Subtitle: "Inteligencia operativa"
   • Texto: "Detecté 3 riesgos para mañana en faena. ¿Querés verlos?"
   • Botón "Conversar →"

3. Sección "Lo que pasa ahora" con 3 columnas (debajo de las 4 cards):
   - Columna 1: Últimos incidentes (lista de 5 con badges de severidad)
   - Columna 2: Feed Contacto (últimas 5 publicaciones)
   - Columna 3: Latitud headlines (últimas 5 notas)

4. Footer minimalista con quick links

VISUAL DETAILS:
- Cards con bg #1F1F1F, border 1px #2A2A2A, hover lift sutil
- Numbers grandes con typography Instrument Serif Italic
- Status badges pill rounded-full con colores semánticos
- Iconos a 24x24 con accent color de cada producto
- Smooth transitions al hover (200ms)
- Dark theme dominante, no toggle (es la única vista)

RESPONSIVE:
- Desktop: layout 2x2 cards + 3 columnas abajo
- Tablet: cards en 2 columnas, secciones apiladas
- Mobile: todo apilado vertical, sidebar colapsado a drawer
```

---

## 📱 PROMPT 2 — SAFETYOPS DASHBOARD HSE

**Pantalla:** `app.latitud360.com/minera360/hse`

```
Diseña el dashboard HSE de Minera360 con las siguientes especificaciones:

CONTEXTO:
Es el dashboard que el HSE Manager mira primero cada mañana. Necesita ver de
un vistazo si hay algo crítico, los KPIs del mes y tendencias.

LAYOUT:
- Mantiene sidebar y topbar de Latitud360
- Header de página con: breadcrumb "Minera360 > SafetyOps > Dashboard"
- Filtros: dropdown de sitio, rango de fechas, área (chips removibles)
- Botón primario naranja "+ Reportar incidente"

CONTENIDO:
1. Hero KPI — "Días sin accidentes" (full-width, altura 200px)
   - Background gradient naranja sutil sobre negro
   - Número GIGANTE en Instrument Serif Italic (e.g., "127")
   - Label "Días sin accidentes con tiempo perdido"
   - Subtexto: "Récord histórico de Mina Hombre Muerto"
   - Icono celebración sutil

2. Grid de 4 KPIs (4 columnas):

   KPI 1: LTIFR
   - Número: 0.42
   - Label: "Lost Time Injury Frequency Rate"
   - Tendencia: ↓ 18% vs mes anterior (verde)
   - Mini sparkline

   KPI 2: TRIFR
   - Número: 1.28
   - Label: "Total Recordable Injury Frequency Rate"
   - Tendencia: ↓ 12% (verde)
   - Mini sparkline

   KPI 3: Severity Rate
   - Número: 8.4
   - Label: "Tasa de severidad"
   - Tendencia: → estable
   - Mini sparkline

   KPI 4: Cumplimiento inspecciones
   - Número: 94%
   - Label: "Cumplimiento de inspecciones planeadas"
   - Tendencia: ↑ 5% (verde)
   - Progress bar circular

3. Grid de 2 columnas (60/40):

   Columna izquierda (60%): Gráfico de incidentes por mes (12 meses)
   - Bar chart con colores por severidad
   - Hover reveals breakdown

   Columna derecha (40%): Top 5 incidentes recientes
   - Lista con badges severidad, sitio, fecha, status
   - Click abre detalle

4. Sección "Acciones pendientes":
   - Tabla con: descripción, asignado a, due date, severidad, status
   - Filtrable y ordenable
   - 10 rows visibles, scroll para más

5. Sección "Permisos de trabajo activos":
   - Cards horizontales con tipo de permiso, ubicación, validez, supervisor
   - Color por tipo (altura: rojo, confinado: amarillo, etc)

VISUAL DETAILS:
- KPIs con números en font-display gigantes
- Tendencias en pills con arrow icon + color
- Sparklines en turquesa Andes
- Tablas con zebra striping sutil (#1F1F1F y #1A1A1A)
- Charts con tooltip al hover, dark theme

CTAs:
- Botón principal arriba: "+ Reportar incidente" (naranja seguridad, prominente)
- Botones secundarios: "Generar reporte SRT", "Ver todos los incidentes"
```

---

## 📱 PROMPT 3 — MOBILE: REPORTAR INCIDENTE (operario)

**Pantalla:** App móvil Latitud360, flujo de reporte rápido

```
Diseña la pantalla de "Reportar incidente" para la app móvil React Native de Latitud360.

CONTEXTO:
La pantalla más crítica de la app. Un operario en faena vio algo y necesita
reportarlo en menos de 60 segundos. Puede no tener internet. Debe ser ultra
simple y rápido.

LAYOUT:
- Pantalla full-screen en modo modal
- Header con: botón "X" (cerrar), título "Reportar incidente", botón "Guardar borrador"
- Background negro mina, contenido con liquid-glass cards

FLUJO EN UNA SOLA PANTALLA (sin steps):

1. Tipo de incidente (4 chips horizontales scrollables):
   - Accidente (rojo, ícono cruz)
   - Casi accidente (amarillo, ícono triángulo)
   - Acto inseguro (naranja, ícono ojo)
   - Daño material (gris, ícono herramienta)

2. Severidad (4 botones grandes, mutuamente excluyentes):
   - Baja (verde)
   - Media (amarillo)
   - Alta (naranja)
   - Crítica (rojo, glow sutil)

3. ¿Dónde pasó? (input con ícono GPS)
   - Default: "Ubicación actual detectada"
   - Tap para cambiar manualmente
   - Map preview pequeño 80px alto

4. ¿Qué pasó? (textarea grande, mín 3 líneas)
   - Placeholder: "Contá qué pasó en tus palabras..."
   - Botón micrófono al lado para dictado por voz

5. Foto/Video (opcional)
   - Botón grande "+ Agregar foto" con ícono cámara
   - Si ya hay fotos: thumbnails horizontales con X para borrar

6. Personas involucradas (opcional)
   - Search/select con avatares de compañeros
   - Tags removibles

7. Botón principal abajo (sticky):
   - "Reportar ahora" (naranja seguridad, full-width, prominente)
   - Subtexto pequeño: "Se enviará a tu supervisor"

VISUAL DETAILS:
- Texto grande para uso con guantes
- Tap targets mínimo 48px
- Indicador "Sin conexión - se enviará al recuperar señal" en banner top si offline
- Loading state al enviar: spinner + "Enviando..."
- Success state: animación check verde + "Reporte enviado. Pronto te van a contactar."
- Animaciones suaves entre estados

RESPONSIVE:
- Optimizado para 360x800 (Android estándar) y 390x844 (iPhone)
- Soporte de modo gloves (botones más grandes)
- Soporte de bright sunlight mode (contraste alto)
```

---

## 📱 PROMPT 4 — CONTACTO: FEED SOCIAL

**Pantalla:** `app.latitud360.com/contacto/feed` (web) y mobile

```
Diseña el feed social de Contacto, similar a un Workplace/Yammer pero
verticalizado para minería.

LAYOUT WEB:
- Sidebar Latitud360 + topbar
- Main: 3 columnas (200px / 700px / 280px)
  - Columna izquierda: navegación interna de Contacto (Feed, Reconocimientos,
    Personas, Capacitaciones, Mi perfil)
  - Columna central: feed
  - Columna derecha: widget "Cumpleaños hoy", "Recientes", "Tu turno"

CONTENIDO DEL FEED CENTRAL:
1. Composer arriba (sticky):
   - Avatar usuario + "¿Qué querés compartir, Jorge?"
   - Tabs: Publicación / Reconocimiento / Encuesta / Evento
   - Tap abre modal de creación

2. Feed cronológico con tipos de post:

   POST TIPO 1 — COMUNICADO OFICIAL (badge "Oficial" naranja arriba)
   • Avatar de la empresa + nombre + timestamp
   • Si "requiere lectura confirmada": badge dorado
   • Título grande
   • Cuerpo del texto
   • Imagen/video adjunto
   • Footer: "423 leyeron · 87% confirmaron lectura"
   • CTA "Confirmar lectura" si aún no lo hizo

   POST TIPO 2 — RECONOCIMIENTO
   • Avatar quien reconoce + "reconoció a" + Avatar reconocido
   • Badge del valor: "🛡️ Seguridad ante todo"
   • Mensaje del reconocimiento
   • Reacciones: 👏 ❤️ 💡

   POST TIPO 3 — POST DE COMPAÑERO
   • Avatar + nombre + área + timestamp
   • Texto + imagen
   • Reacciones + comentarios + compartir

   POST TIPO 4 — CUMPLEAÑOS / ANIVERSARIO
   • Card especial con confeti sutil
   • "Hoy cumple 5 años en la empresa - Roberto Méndez"
   • Botón "Saludar" rápido

   POST TIPO 5 — ENCUESTA PULSO
   • "Encuesta breve - 1 pregunta"
   • Pregunta + 4 opciones tappables
   • "324 ya respondieron"

WIDGETS COLUMNA DERECHA:
- "Cumpleaños hoy" con avatares y nombre
- "Tu turno" con info contextual (turno actual, próximo descanso)
- "Te están reconociendo" con últimos 3 reconocimientos a vos
- "Próximos eventos" con 2-3 eventos

VISUAL DETAILS:
- Cards con bg #1F1F1F, hover lift
- Avatares circulares 40-48px
- Badges semánticos con color de su tipo
- Reacciones con count y animación al tap
- Lazy loading infinito con skeleton
- Responsive: en mobile, columnas se apilan, widgets en bottom drawer
```

---

## 📱 PROMPT 5 — LATITUD COPILOT (chat IA)

**Pantalla:** `app.latitud360.com/copilot`

```
Diseña la interfaz del Latitud Copilot, un agente IA conversacional
que cruza datos de los 3 productos.

LAYOUT:
- Sidebar Latitud360 + topbar
- Main full-height con dos paneles:
  - Izquierda (60%): chat conversacional
  - Derecha (40%): contexto que el copilot está usando ahora

PANEL IZQUIERDO — CHAT:

Header del chat:
- Avatar IA con gradient naranja-turquesa
- "Latitud Copilot" + status "En línea · Conectado a Minera360, Contacto, Latitud"
- Botón "Nueva conversación"

Área de mensajes:
- Mensajes del usuario: alineados derecha, bg gris acero, padding generoso
- Mensajes del copilot: alineados izquierda con avatar
  - Texto del copilot puede tener:
    - Bloques de código en font-mono
    - Listas con bullets
    - Cards de datos (e.g., card de incidente, card de empleado, card de equipo)
    - Botones de acción ("Ver detalle", "Asignar", "Notificar")

Ejemplo de mensaje del copilot complejo:
─────────────────────────────────────
🤖 Latitud Copilot

Detecté 3 alertas para mañana:

🔴 CRÍTICO — Camión 47
[Card con foto del camión + datos]
• Vibración: +18% últimos 7 días
• Probabilidad de falla: 73%
• Última inspección: hace 12 días

[Acciones: Ver historial · Asignar inspección · Notificar a Méndez]

🟡 MEDIO — 4 operarios sin recertificación
[Lista con avatares y nombres]
[Acciones: Ver detalle · Bloquear accesos]

🟢 INFO — Pronóstico viento >40km/h a las 14hs
[Mini gráfico meteorológico]
[Acciones: Suspender izaje · Notificar plataforma 3]

Quería ¿Algo más en lo que pueda ayudarte?
─────────────────────────────────────

Composer abajo (sticky):
- Input grande con placeholder "Preguntale algo al Copilot..."
- Botón micrófono
- Botón enviar (turquesa cuando hay texto)
- Sugerencias de prompts arriba del input:
  - "¿Qué riesgos tengo mañana?"
  - "Resumime el mes en seguridad"
  - "¿Cómo está el clima organizacional?"

PANEL DERECHO — CONTEXTO:

Header: "Datos consultados"

Lista de fuentes que el copilot usó en la última respuesta:
- Card "Minera360 → SafetyOps" con stat
- Card "Minera360 → AssetIQ" con stat
- Card "Contacto → Encuestas" con stat
- Card "Servicio meteorológico externo" con stat

Cada card es expandible para ver el dato exacto consultado.

Sección "Sugerencias proactivas":
- "Esta semana hay 3 cumpleaños críticos sin saludar"
- "Tu mina tiene 2 reportes ambientales sin publicar"
- Click ejecuta la acción o abre el módulo correspondiente

VISUAL DETAILS:
- Mensajes con border-radius 16px (asymmetric: 4px en esquina del avatar)
- Streaming del texto del copilot (typewriter effect)
- Loading state: "Pensando..." con dots animados
- Cards de datos con bg #1F1F1F, ícono del producto en esquina
- Botones de acción dentro de mensajes con bg sutil hover prominent
- Dark theme con acentos según contexto (naranja para alertas críticas)
```

---

## 📱 PROMPT 6 — LATITUD: PORTAL EDITORIAL (público)

**Pantalla:** `latitud.minera` (subdomain del medio público)

```
Diseña el portal público de Latitud, el medio especializado en minería del NOA.
Estética editorial premium mixta: autoridad sectorial tipo Bloomberg + cinematográfico
tipo The Information + documental tipo Atlas Obscura.

LAYOUT:
- Header sticky con logo "LATITUD" en Instrument Serif Italic, nav (Inicio,
  Noticias, Entrevistas, Análisis, En Vivo, Newsletter), botón "Suscribirse"
- Hero section variable según contenido
- Secciones de contenido editorial
- Footer corporativo

HOME (HOMEPAGE):

1. HERO CONDICIONAL:
   Si hay streaming en vivo:
   - Hero full-width con video player en vivo + chat lateral
   - Banner "EN VIVO" con animación pulse roja
   - Título de la transmisión + invitado

   Si no hay streaming:
   - Nota destacada full-width: imagen grande, kicker, título Instrument
     Serif Italic gigante, autor + tiempo de lectura, excerpt

2. NEWSLETTER PROMPT (banner sutil):
   "El briefing semanal del NOA minero. Cada martes en tu inbox."
   [Input email] [Suscribirme]

3. SECCIÓN "LO MÁS LEÍDO" (grid 3 columnas):
   - Cards con imagen, kicker, título, autor, fecha
   - Hover reveals excerpt

4. SECCIÓN "ENTREVISTAS RECIENTES" (carousel horizontal):
   - Cards verticales con thumbnail de video, nombre del invitado, cargo,
     duración, "Ver entrevista →"

5. SECCIÓN "EN PROFUNDIDAD" (1 análisis grande + 2 chicos):
   - Análisis grande: imagen full-width + texto largo
   - 2 análisis chicos al lado

6. SECCIÓN "EN TERRITORIO" (galería de reportajes):
   - 4 imágenes grandes con título overlay
   - Click abre reportaje

7. SECCIÓN "AUSPICIANTES":
   Banner discreto: "Latitud es posible gracias a..."
   Logos de sponsors en blanco/gris claro, en fila

8. FOOTER:
   - Sobre Latitud + Equipo + Contacto + Anunciar + Newsletter
   - "Parte del ecosistema Latitud360" con link
   - Logo "Nativos" pequeño

VISUAL DETAILS:
- Tipografía mucho más editorial que el resto de la plataforma
- Headlines grandes en Instrument Serif Italic
- Cuerpo de notas en Barlow con leading generoso
- Imágenes de alta calidad, full-bleed cuando posible
- Paleta más sobria: negro + dorado litio (#D4AF37) como acento
- Sin liquid-glass acá - estética más tradicional y editorial
- Mucho whitespace
- Numbered lists, pull quotes, drop caps en notas largas

RESPONSIVE:
- Mobile: 1 columna, hero adapt, navegación hamburger
- Tablet: 2 columnas
- Desktop: 3 columnas
```

---

## 📱 PROMPT 7 — ONBOARDING NUEVA MINERA (admin setup)

**Pantalla:** Wizard de onboarding cuando una minera nueva contrata Latitud360

```
Diseña el wizard de onboarding para que el org_admin de una nueva minera
configure Latitud360 paso a paso.

CONTEXTO:
Después de firmar contrato, el primer admin de la minera (CTO o Director de
Operaciones) entra y debe configurar todo. El wizard debe sentirse premium
y guiar de la mano. 6-7 pasos, tiempo estimado: 30 minutos.

LAYOUT:
- Full-screen wizard, no sidebar/topbar
- Progress bar arriba con steps numerados
- Contenido principal centrado, max-width 720px
- Botones "Atrás" / "Continuar" abajo derecha
- Botón "Saltar este paso" disponible en steps no críticos

PASO 1 — Bienvenida
- Hero: video corto del salar + headline "Bienvenido a Latitud360"
- Subtítulo personalizado: "Configuremos juntos {nombre minera}"
- Checklist visual de lo que vamos a hacer:
  ✓ Datos de tu empresa
  ✓ Sitios y áreas
  ✓ Importar usuarios
  ✓ Configurar productos activos
  ✓ Personalización visual
  ✓ Capacitación inicial
- Botón "Empecemos →"

PASO 2 — Datos de la empresa
- Form con: razón social, CUIT, dirección legal, industria principal,
  cantidad de empleados, sitios operativos
- Logo upload (drag & drop)
- Slug del subdomain: "tunombre.app.latitud360.com" (preview en vivo)

PASO 3 — Sitios y áreas
- Lista de sitios con map preview
- Botón "+ Agregar sitio"
- Por cada sitio: nombre, tipo (mina/planta/oficina), GPS, áreas (sub-list)
- Importar via CSV opcional

PASO 4 — Usuarios
- Tabs: "Importar CSV" / "Agregar manualmente" / "Conectar SSO"
- Si CSV: drag & drop, preview de columnas, mapeo, validación
- Si manual: tabla editable inline
- Si SSO: integración Google Workspace / Microsoft 365 con OIDC
- Stat live: "X usuarios listos para invitar"

PASO 5 — Productos activos
- Cards de los productos contratados:
  - Minera360 (configurado por defecto)
  - Contacto (configurar valores culturales)
  - Latitud (acceso a contenido)
- Por cada producto: configuraciones específicas mínimas
- Para Contacto: definir valores culturales (e.g., "Seguridad ante todo",
  "Trabajo en equipo", "Excelencia operativa")

PASO 6 — Personalización visual
- Color primario (paleta o picker)
- Logo en header
- Mensaje de bienvenida custom
- Preview en vivo del dashboard

PASO 7 — Capacitación inicial
- Cards con opciones:
  - "Capacitación en vivo con nuestro equipo" (botón agendar)
  - "Recorrido autoguiado por video" (4 videos de 5min cada uno)
  - "Documentación completa" (link a docs)
- "Recibirás un email con los próximos pasos"

PASO FINAL — Listo!
- Confeti sutil
- Mensaje: "Todo listo. Tu Latitud360 está activo."
- Stats: "Invitando a 247 usuarios... Configurando 3 sitios... Activando módulos..."
- Botón gigante: "Entrar a Latitud360 →"

VISUAL DETAILS:
- Tipografía premium, mucho aire
- Indicador de progreso visible siempre
- Microinteracciones en cada step (animation al completar)
- Ayuda contextual: "?" tooltip en cada campo crítico
- Tono cálido pero profesional
- Dark theme con acentos turquesa para success states
```

---

## 📱 PROMPT 8 — ADMIN: GESTIÓN DE SPONSORS (Latitud)

**Pantalla:** Backend admin de Latitud para gestionar sponsors

```
Diseña la interfaz admin para gestionar los sponsors de Latitud (el medio).

CONTEXTO:
Solo accesible para staff de Nativos y editor en jefe de Latitud.
Permite gestionar contratos, contenido sponsoreado, métricas.

LAYOUT:
- Mantiene estructura de Latitud360 (sidebar + topbar)
- En sidebar, sección "Latitud Admin" expandida
- Main con tabs: Sponsors / Contratos / Contenido pendiente / Métricas

VISTA "SPONSORS":

Header de página:
- Title: "Gestión de sponsors"
- Stats: "12 activos · USD 187k ARR · 3 vencen este mes"
- Botón primario: "+ Nuevo sponsor"

Filtros:
- Estado (activo, vencido, en negociación)
- Tier (base, medio, premium, estado)
- Buscar por nombre

Tabla de sponsors:
- Columnas: Logo, Nombre, Tier, Inicio, Vencimiento, ARR, Estado, Acciones
- Logo en small avatar
- Tier con badge color (base: gris, medio: turquesa, premium: dorado, estado: rojo)
- ARR en formato USD con typography mono
- Estado: pill semántico
- Acciones: Ver detalle, Editar, Renovar, Pausar

VISTA DETALLE DE SPONSOR (modal o página):

Header con logo grande + nombre empresa + tier badge

Tabs internos:
1. Información general (datos contractuales)
2. Contenido (notas publicadas, próximas, archivo)
3. Entrevistas (las grabadas + las programadas)
4. Métricas (alcance, lectura, engagement)
5. Facturación (history de pagos)

Tab 1 — Información general:
- Datos de contacto (nombre, email, teléfono)
- Empresa (legales, dirección)
- Contrato (fechas, monto, condiciones)
- Compromisos del tier (e.g., 2 notas/sem + 1 entrevista/mes)
- Cumplimiento de compromisos: progress bars
  - "Notas: 84/96 (mes en curso)"
  - "Entrevistas: 11/12"

Tab 2 — Contenido:
- Lista de todas las notas vinculadas al sponsor
- Cada nota con thumbnail, título, fecha, vistas, estado
- Botón "+ Crear nota desde comunicado"
  - Si lo clickea: form para subir el comunicado oficial del sponsor
  - El periodista lo transforma en nota

Tab 3 — Entrevistas:
- Calendario de entrevistas con sponsor
- Cards: invitado, tema, fecha, status (programada, grabada, editada, publicada)
- Botón "+ Agendar entrevista"

Tab 4 — Métricas:
- Total visitas a notas del sponsor
- Tiempo promedio de lectura
- Compartidos
- Comentarios
- Comparativa: tu sponsor vs promedio del medio

Tab 5 — Facturación:
- Tabla de facturas: número, fecha, monto, estado
- Botón "Generar factura" con MercadoPago/Stripe

VISUAL DETAILS:
- Tabla dense pero legible (con bg alternados sutil)
- Badges de tier con micro-icon distintivo
- Progress bars en colores semánticos
- Action buttons inline en cada fila
- Mucho uso de typography mono para datos numéricos
- Dark theme dominante
```

---

## ✅ NOTAS FINALES PARA STITCH

Para todos estos prompts:
1. **Mencionar que es dark theme dominante** (no toggle de light mode)
2. **Pedir variantes para mobile y tablet** cuando aplique
3. **Especificar que use Lucide icons** (no Material o Font Awesome)
4. **Pedir que muestre estados** (loading, empty, error) cuando aplique
5. **Branding consistente** con paleta y tipografías arriba
6. **Idioma español argentino** en todo el copy

Después de generar cada prompt, podés iterar pidiendo:
- "Hacé la versión móvil de esta pantalla"
- "Mostrame el estado loading"
- "Variante con menos densidad de información"
- "Versión light theme" (si necesitás para presentaciones)
