# 🎨 Stitch Prompts — Latitud360 (refinados)

> Versiones depuradas de los 8 prompts originales. Compactos, específicos, listos para pegar en Google Stitch sin edición. Pegar el **System** una vez al inicio del proyecto, después usar cada **Prompt** individual.

---

## 🧱 SYSTEM PROMPT (pegar en Stitch al iniciar el proyecto)

```
Sos diseñador senior de UI para Latitud360 — el sistema operativo de la minería del NOA argentino. Estás trabajando en un design system industrial premium consistente con Linear / Vercel / Apple Vision Pro / Palantir, pero anclado al universo minero del NOA.

ESTÉTICA:
- Industrial premium, futurista pero anclado en lo real.
- Dark theme dominante (no toggle de light, salvo que se pida explícito).
- Mucho whitespace generoso, jerarquía clara, tipografía con personalidad.

PALETA (usar exactos):
- Negro mina:        #0A0A0A   (background primario)
- Gris acero:        #1F1F1F   (cards, surfaces)
- Gris niebla:       #2A2A2A   (borders, dividers)
- Naranja seguridad: #FF6B1A   (Minera360, CTAs críticos, alertas HSE)
- Turquesa Andes:    #00C2B8   (Contacto, datos vivos, IA)
- Dorado litio:      #D4AF37   (Latitud, premium accents)
- Blanco ártico:     #F5F5F5   (texto principal)
- Verde OK:          #00B86B / Amarillo: #FFC93C / Rojo: #E63946

TIPOGRAFÍA:
- Display (titulares grandes con personalidad): Instrument Serif Italic
- UI (toda etiqueta y body): Barlow (300/400/500/600)
- Datos técnicos / mono / kickers: JetBrains Mono o Space Mono

LAYOUT:
- 8px grid system. Border radius: 8px (elementos), 16px (cards), 24px (modals), 9999px (pills).
- Iconos: Lucide, stroke 1.5, color contextual.

LENGUAJE:
- Español argentino claro y directo, sin tecnicismos innecesarios.
- Voseo en CTAs ("Reportá", "Confirmá", "Solicitá").

ESTADOS:
- Cuando aplique, mostrá variantes loading / empty / error.
- Para mobile, optimizá tap targets ≥ 48px (operario con guantes) y contraste alto (sol intenso de altura).

CONSISTENCIA:
- Todas las pantallas comparten el mismo Sidebar + Topbar (excepto landings públicas y wizards full-screen).
- Numbers en KPIs siempre Instrument Serif Italic gigantes con tracking-tight.
- Status badges siempre rounded-pill con color semántico.
```

---

## 1️⃣ Dashboard unificado (home)

```
Pantalla: app.latitud360.com/ — home post-login.

CONTEXTO: Es lo primero que ve el HSE Manager o el Director de Operaciones cada mañana. Necesita ver de un saque qué pasa en sus 3 productos (Minera360, Contacto, Latitud) + 1 acceso al Copilot IA.

LAYOUT:
- Sidebar fijo izquierdo 240px con secciones: General · Minera360 · Contacto · Plataforma. Selector de tenant arriba.
- Topbar 64px con search global, notificaciones, avatar.

CONTENIDO:
1. Saludo personalizado con timestamp font-mono pequeño:
   "Hola Jorge, esto pasó en tus operaciones hoy"

2. Grid 2×2 de cards de producto, altura ~220px cada una. Card con bg #1F1F1F, ring sutil del color del producto, hover lift 1px.
   - Card 1: MINERA360 (icono Mountain, ring naranja). Stats: "2 alertas HSE" (rojo), "1 mantenimiento crítico" (amarillo), "12 partes hoy".
   - Card 2: CONTACTO (Users, ring turquesa). "3 publicaciones nuevas", "47 reconocimientos esta semana", "92% lectura comunicados".
   - Card 3: LATITUD (Radio, ring dorado). "1 nota nueva sobre tu mina", "1 entrevista programada", "12.4k visitas mes".
   - Card 4: LATITUD COPILOT (Sparkles, gradient sutil naranja+turquesa). "Detecté 3 riesgos para mañana en faena. ¿Querés verlos?" + botón "Conversar →".

3. Sección "Lo que pasa ahora" con 3 columnas iguales:
   - Últimos incidentes (5 items con SeverityBadge + título truncado + tiempo relativo)
   - Feed Contacto (5 últimos posts en una línea con emoji)
   - Latitud headlines (5 titulares editoriales)

4. Footer minimalista discreto.

VISUAL:
- Numbers en stats de cada card en font-heading italic gigante con leading-none.
- Hover en cards: ring color sube intensidad, translate-y -1px, transition 200ms.

RESPONSIVE: desktop 2×2 → tablet 2 cols → mobile stacked, sidebar a drawer.

ESTADOS extra: empty (sin productos contratados) y skeleton loading.
```

---

## 2️⃣ SafetyOps · Dashboard HSE

```
Pantalla: app.latitud360.com/dashboard/minera360 — Dashboard del HSE Manager.

CONTEXTO: Lo primero que el HSE Manager mira cada mañana. Tiene que ver en menos de 10 segundos si hay algo crítico, KPIs del mes vs anterior, y permisos activos del día.

ELEMENTOS:
1. Breadcrumb pequeño: "Minera360 → SafetyOps → Dashboard". Filtros: dropdown sitio, rango fechas, área (chips removibles). CTA primario naranja: "+ Reportar incidente".

2. HERO KPI full-width (200px alto): "Días sin accidentes con tiempo perdido". Background gradient naranja sutil sobre negro mina. Número GIGANTE en Instrument Serif Italic ("127"), label, subtexto "Récord histórico de Mina Hombre Muerto", icono trofeo sutil esquina.

3. Grid de 4 KPI cards:
   - LTIFR: 0.42 · ↓18% mes anterior (verde) · sparkline turquesa
   - TRIFR: 1.28 · ↓12% (verde) · sparkline turquesa
   - Severity Rate: 8.4 · → estable (gris) · sparkline gris
   - Cumplimiento inspecciones: 94% · ↑5% (verde) · progress bar circular

4. Grid 60/40:
   - Izquierda: bar chart "Incidentes por mes (12 meses)" con colores por severidad. Hover muestra breakdown.
   - Derecha: Top 5 incidentes recientes (severity badge + título + fecha + status). Click → detalle.

5. Tabla "Acciones preventivas pendientes": columnas Acción · Asignado · Vence · Severidad · Status. Zebra sutil. 10 rows + scroll. Filtro y orden.

6. Cards horizontales "Permisos activos" — color por tipo (altura: rojo, confinado: amarillo, eléctrico: naranja, otros: turquesa).

VISUAL:
- KPIs con números en font-heading italic 4xl con tracking-tight.
- Tendencias en pills con flecha + color semántico.
- Charts en dark theme con tooltip al hover.

CTAs secundarios: "Generar reporte SRT", "Ver todos los incidentes".
```

---

## 3️⃣ Mobile · Reportar incidente (operario, ultra rápido)

```
Pantalla: app móvil React Native — modal full-screen "Reportar incidente".

CONTEXTO: La pantalla más crítica de toda la plataforma. Un operario en faena (4000m, sol intenso, posiblemente con guantes) acaba de ver algo y necesita reportarlo en <60 segundos. Puede no tener internet — tiene que funcionar offline y sincronizar después.

LAYOUT: Full-screen modal. Header con [X] cerrar, título "Reportar incidente", botón "Guardar borrador". Background negro mina.

FLUJO EN UNA SOLA PANTALLA (sin steps separados):
1. TIPO (chips horizontales scrollables, 4 opciones, tap target 48px+):
   - Accidente (rojo, ícono cruz)
   - Casi accidente (amarillo, ícono triángulo) — DEFAULT
   - Acto inseguro (naranja, ícono ojo)
   - Daño material (gris, ícono herramienta)

2. SEVERIDAD (4 botones grandes mutuamente excluyentes, 25% ancho cada uno):
   Baja (verde) · Media (amarillo) · Alta (naranja) · Crítica (rojo, glow sutil al estar seleccionado)
   Al tocar: emoji semáforo grande + label + cambio de color.

3. ¿DÓNDE PASÓ? — input con ícono GPS. Default: "Ubicación actual detectada" (auto). Tap para editar manual. Map preview pequeño 80px alto.

4. ¿QUÉ PASÓ? — textarea grande mínimo 3 líneas. Placeholder: "Contá qué pasó en tus palabras…". Botón micrófono al lado para dictado por voz (Speech-to-Text en español argentino).

5. FOTO/VIDEO (opcional) — botón grande "+ Agregar foto" con ícono cámara. Ya hay fotos: thumbnails horizontales con X para borrar.

6. PERSONAS INVOLUCRADAS (opcional, colapsado por defecto) — search/select con avatares de compañeros. Tags removibles.

7. CTA STICKY ABAJO: "Reportar ahora" naranja seguridad full-width prominente. Subtexto pequeño: "Se enviará a tu supervisor".

ESTADOS:
- BANNER OFFLINE: "Sin conexión — se enviará al recuperar señal" arriba del todo.
- LOADING al enviar: spinner + "Enviando…".
- SUCCESS: animación check verde + "Reporte enviado. Pronto te van a contactar."

VISUAL:
- Texto grande para guantes (mín 16px en inputs, 18px en CTAs).
- Tap targets mínimo 48px.
- Modo "bright sunlight": contraste alto, no semitransparencias en surfaces críticos.

DEVICES: Optimizado para 360×800 (Android estándar) y 390×844 (iPhone).
```

---

## 4️⃣ Contacto · Feed social

```
Pantalla: app.latitud360.com/dashboard/contacto — feed estilo Workplace verticalizado para minería.

LAYOUT WEB: Sidebar Latitud360 + topbar. Main 3 columnas (200px / 700px / 280px):
- Izquierda: nav interna (Feed, Reconocimientos, Personas, Capacitaciones, Mi perfil).
- Centro: feed cronológico.
- Derecha: widgets ("Cumpleaños hoy", "Tu turno", "Te están reconociendo", "Próximos eventos").

COMPOSER (sticky arriba del feed):
- Avatar usuario + "¿Qué querés compartir, Jorge?".
- Tabs: Publicación / Reconocimiento / Encuesta / Evento.
- Tap abre modal de creación.

TIPOS DE POST EN EL FEED:
1. COMUNICADO OFICIAL — badge "OFICIAL" naranja arriba. Si requiere ack: badge dorado "Confirma lectura". Avatar empresa, título grande, body, media. Footer: "423 leyeron · 87% confirmaron". CTA "Confirmar lectura" si aún no lo hizo.

2. RECONOCIMIENTO — card con bg turquesa/[0.06] y border turquesa/20. Avatar quien reconoce + "reconoció a" + Avatar reconocido. Badge del valor (ícono + label "Seguridad ante todo"). Mensaje. Reacciones: 👏 ❤️ 💡.

3. POST DE COMPAÑERO — Avatar + nombre + área + timestamp. Texto + imagen. Reacciones + comentarios + compartir.

4. CUMPLEAÑOS / ANIVERSARIO — card especial con confeti sutil. "Hoy cumple 5 años en la empresa: Roberto Méndez". Botón "Saludar" rápido.

5. ENCUESTA PULSO — "Encuesta breve · 1 pregunta". Pregunta + 4 opciones tappables. "324 ya respondieron" en footer.

VISUAL:
- Cards bg #1F1F1F, hover lift sutil.
- Avatares circulares 40-48px con gradient ring naranja-dorado-turquesa.
- Badges semánticos con color del tipo.
- Reacciones con count y micro-animación al tap.

INFINITE SCROLL con skeleton.

RESPONSIVE: tablet 2 cols, mobile feed solo + bottom drawer para widgets.
```

---

## 5️⃣ Latitud Copilot (chat IA)

```
Pantalla: app.latitud360.com/dashboard/copilot — chat conversacional con el agente IA.

LAYOUT: Sidebar + topbar. Main full-height dividido 60/40:
- Izquierda 60%: chat conversacional.
- Derecha 40%: panel de contexto (qué datos consultó el agente).

PANEL CHAT:
HEADER:
- Avatar IA con gradient naranja → turquesa, ícono Sparkles.
- "Latitud Copilot" + status "● En línea · Conectado a Minera360, Contacto, Latitud" (dot pulse).
- Botón "Nueva conversación".

MENSAJES:
- Usuario: alineado derecha, bg naranja, texto blanco, rounded-2xl con esquina inferior-derecha 4px.
- Copilot: izquierda, avatar al lado, bg gris acero, rounded-2xl con esquina inferior-izquierda 4px.
- Texto del Copilot puede contener:
  · Bloques de código font-mono
  · Listas con bullets
  · CARDS DE DATOS (incidente, empleado, equipo) con icono del producto en esquina
  · Botones de acción inline ("Ver detalle", "Asignar", "Notificar a Méndez")

EJEMPLO DE MENSAJE COMPLEJO:
"Detecté 3 alertas para mañana:
🔴 CRÍTICO — Camión 47 [card con foto + datos vibración +18%, prob. falla 73%]
   [Acciones: Ver historial · Asignar inspección · Notificar a Méndez]
🟡 MEDIO — 4 operarios sin recertificación [lista avatares]
🟢 INFO — Pronóstico viento >40km/h a las 14hs [mini gráfico met]"

COMPOSER STICKY ABAJO:
- Sugerencias arriba del input (chips scrollables): "¿Qué riesgos tengo mañana?" · "Resumime el mes en seguridad" · "¿Cómo está el clima organizacional?"
- Input grande con placeholder "Preguntale algo al Copilot…".
- Botón micrófono.
- Botón enviar (turquesa cuando hay texto).

PANEL DERECHO — CONTEXTO:
- "Datos consultados" con cards expandibles por fuente (Minera360 → SafetyOps · 247 incidentes 90d · etc).
- Cada card con dot del color del producto.
- Sección "Sugerencias proactivas" con 3-4 acciones que el Copilot detectó.

VISUAL:
- Streaming del texto (typewriter effect con cursor parpadeante).
- Loading: "Pensando…" con dots animados.
- Reduced motion: sin typewriter, render directo.
```

---

## 6️⃣ Latitud · Portal editorial público

```
Pantalla: latitud.minera (subdomain) — el medio público especializado en NOA minero.

ESTÉTICA: Editorial premium mixta — autoridad sectorial tipo Bloomberg + cinematográfico tipo The Information + documental tipo Atlas Obscura. SIN liquid-glass acá; estética más tradicional editorial. Paleta más sobria: negro + dorado litio (#D4AF37) como acento principal. Mucho whitespace.

ESTRUCTURA:
1. Header sticky:
   - Logo "LATITUD" en Instrument Serif Italic muy grande.
   - Nav: Inicio · Noticias · Entrevistas · Análisis · En vivo · Newsletter.
   - Botón "Suscribirse" (dorado).

2. HERO CONDICIONAL:
   - Si hay streaming en vivo: video player full-width + chat lateral. Banner "EN VIVO" con animación pulse roja. Título de la transmisión + invitado.
   - Si no: nota destacada full-width — imagen grande, kicker tipográfico, título Instrument Serif Italic gigante, autor + tiempo de lectura, excerpt.

3. NEWSLETTER PROMPT (banner sutil entre secciones):
   "El briefing semanal del NOA minero. Cada martes en tu inbox."
   [Input email] [Suscribirme] (dorado)

4. SECCIÓN "LO MÁS LEÍDO" — grid 3 cols con thumbnail, kicker, título serif italic, autor, fecha. Hover muestra excerpt.

5. SECCIÓN "ENTREVISTAS RECIENTES" — carousel horizontal. Cards verticales con thumbnail video, nombre invitado, cargo, duración, "Ver entrevista →".

6. SECCIÓN "EN PROFUNDIDAD" — 1 análisis grande (full-width imagen + texto largo) + 2 análisis chicos al lado.

7. SECCIÓN "EN TERRITORIO" — galería de 4 imágenes grandes con título overlay. Click abre reportaje.

8. SECCIÓN "AUSPICIANTES" — banner discreto: "Latitud es posible gracias a…" + logos en blanco/gris claro en fila.

9. FOOTER:
   - Sobre Latitud · Equipo · Contacto · Anunciar · Newsletter
   - "Parte del ecosistema Latitud360" con link
   - Logo "Nativos" pequeño

VISUAL:
- Headlines grandes Instrument Serif Italic con kerning tight.
- Cuerpo Barlow leading 1.7.
- Imágenes full-bleed cuando posible.
- Drop caps en notas largas, pull quotes, numbered lists.

RESPONSIVE: mobile 1 col + nav hamburger; tablet 2 cols; desktop 3.
```

---

## 7️⃣ Onboarding nueva minera (admin setup)

```
Pantalla: wizard full-screen para que el org_admin de una nueva minera configure Latitud360.

CONTEXTO: Después de firmar contrato. El primer admin (CTO o Director de Ops) entra y debe configurar todo. Tiene que sentirse premium y guiar de la mano. 7 pasos · ~30 minutos.

LAYOUT:
- Full-screen wizard, sin sidebar/topbar.
- Progress bar arriba con 7 steps numerados (paso actual destacado en naranja, anteriores con check, futuros en gris).
- Contenido principal centrado, max-width 720px.
- Botones inferiores: "← Atrás" (ghost) / "Continuar →" (naranja primary).
- "Saltar este paso" disponible sólo en steps no críticos.

PASOS:
1. BIENVENIDA — hero con video corto del salar de Hombre Muerto + headline serif italic "Bienvenido a Latitud360". Subtítulo personalizado: "Configuremos juntos {nombre minera}". Checklist visual de lo que vamos a hacer (datos · sitios · usuarios · productos · personalización · capacitación). Botón gigante "Empecemos →".

2. DATOS DE LA EMPRESA — form: razón social, CUIT, dirección legal, industria principal, cantidad empleados, sitios operativos. Logo upload (drag & drop con preview). Slug subdomain "tunombre.app.latitud360.com" con preview en vivo + check de disponibilidad.

3. SITIOS Y ÁREAS — lista de sitios con map preview. Botón "+ Agregar sitio". Por sitio: nombre, tipo (mina/planta/oficina), GPS lat/lng (con map picker), áreas (sub-list). Importar via CSV opcional.

4. USUARIOS — tabs:
   - Importar CSV (drag & drop, preview de columnas, mapeo, validación inline)
   - Agregar manualmente (tabla editable inline)
   - Conectar SSO (integración Google Workspace / Microsoft 365 con OIDC)
   Stat live: "{N} usuarios listos para invitar".

5. PRODUCTOS ACTIVOS — cards de productos contratados. Configuración mínima por producto (Minera360 default; Contacto: definir valores culturales como "Seguridad ante todo", "Trabajo en equipo", etc; Latitud: acceso a contenido).

6. PERSONALIZACIÓN VISUAL — color primario (paleta + picker), logo en header, mensaje de bienvenida custom. PREVIEW EN VIVO del dashboard al lado.

7. CAPACITACIÓN INICIAL — cards opciones:
   - "Capacitación en vivo con nuestro equipo" (botón agendar Calendly)
   - "Recorrido autoguiado por video" (4 videos de 5min)
   - "Documentación completa" (link a docs)
   "Recibirás un email con los próximos pasos."

PASO FINAL — LISTO:
- Confeti sutil. Mensaje: "Todo listo. Tu Latitud360 está activo."
- Stats animados: "Invitando a 247 usuarios… Configurando 3 sitios… Activando módulos…"
- Botón gigante: "Entrar a Latitud360 →".

VISUAL:
- Tipografía premium con mucho aire.
- Microinteracciones en cada step (checkmark animado al completar).
- Tooltips "?" contextuales en cada campo crítico.
- Tono cálido pero profesional. Acentos turquesa para success states.
```

---

## 8️⃣ Admin · Gestión de sponsors (Latitud)

```
Pantalla: backend admin para gestionar sponsors del medio Latitud. Sólo accesible para staff Nativos + editor en jefe.

LAYOUT: Mantiene Sidebar + Topbar de Latitud360. Sidebar muestra sección "Latitud Admin" expandida. Main con tabs horizontales: Sponsors / Contratos / Contenido pendiente / Métricas.

VISTA "SPONSORS":
- Header: title "Gestión de sponsors". Stats: "12 activos · USD 187k ARR · 3 vencen este mes". Botón primario: "+ Nuevo sponsor".
- Filtros: estado (activo/vencido/en negociación), tier (base/medio/premium/estado), search por nombre.

TABLA SPONSORS:
Columnas: Logo · Nombre · Tier · Inicio · Vencimiento · ARR · Estado · Acciones
- Logo small avatar.
- Tier con badge color (base: gris, medio: turquesa, premium: dorado, estado: rojo) + micro-icon distintivo.
- ARR formato USD con tipografía mono.
- Estado: pill semántico.
- Acciones inline: Ver detalle · Editar · Renovar · Pausar.

DETALLE DE SPONSOR (modal o página):
HEADER: logo grande + nombre + tier badge.

TABS INTERNOS:
1. INFORMACIÓN GENERAL — datos contractuales (contacto, empresa, contrato, fechas, monto). Compromisos del tier con progress bars: "Notas: 84/96 (mes en curso)" · "Entrevistas: 11/12".

2. CONTENIDO — lista de notas vinculadas (thumbnail, título, fecha, vistas, status). Botón "+ Crear nota desde comunicado oficial".

3. ENTREVISTAS — calendario de entrevistas + cards (invitado, tema, fecha, status: programada/grabada/editada/publicada). Botón "+ Agendar entrevista".

4. MÉTRICAS — total visitas a notas del sponsor, tiempo promedio lectura, compartidos, comentarios. Comparativa: tu sponsor vs promedio del medio (chart).

5. FACTURACIÓN — tabla facturas (número, fecha, monto, estado). Botón "Generar factura" con MercadoPago/Stripe.

VISUAL:
- Tabla densa pero legible (zebra striping #1F1F1F y #1A1A1A).
- Progress bars en colores semánticos.
- Mucho uso de tipografía mono para datos numéricos.
- Action buttons inline en cada fila con hover state.
```

---

## 📋 Notas finales para Stitch

Para todos los prompts:
1. **Idioma del UI: español argentino** (voseo en CTAs).
2. **Iconos Lucide** (no Material, no Font Awesome).
3. **Mostrar al menos 1 estado alternativo** (loading, empty, o error) cuando aplique.
4. **Mobile/tablet variants** explícitas si la pantalla es navegable en mobile.
5. **Los assets reutilizables** (Sidebar, Topbar, Avatar, SeverityBadge) deben ser componentes consistentes entre pantallas.

Iteración sugerida después de generar cada pantalla:
- "Hacé la versión mobile de esta pantalla"
- "Mostrame el estado loading"
- "Variante con menos densidad de información"
- "Versión light theme" (sólo si necesitás para presentaciones offline)
