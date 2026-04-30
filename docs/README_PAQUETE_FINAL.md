# 🤖 PAQUETE FINAL PARA CLAUDE CODE — LATITUD360

> Versión final. Incluye PRD de Procurement como vertical separado documentado.
> Listo para arrancar el desarrollo de Fase 1 sin desviaciones.

---

## 📦 QUÉ HAY EN ESTE PAQUETE

```
claude-code-final/
├── CLAUDE.md                      ← El cerebro del proyecto (ROOT del repo)
├── prd-fase-1.md                  ← Lo que construimos AHORA (SafetyOps + Contacto)
├── prd-procurement.md             ← Vertical separado documentado para tu amigo
└── PROMPTS_CLAUDE_CODE.md         ← Los prompts paso a paso
```

### 📋 Función de cada archivo

#### 1. `CLAUDE.md` — El cerebro del proyecto

Va al **root del repo**. Claude Code lo lee automáticamente y entiende:
- Qué es Latitud360 y para qué sirve
- 3 productos + módulos en Minera360 con fases de madurez
- **Productos verticales SEPARADOS** que NO se construyen en este repo: EnergiAI y Procurement
- Stack técnico fijo, arquitectura multi-tenant, branding
- Schemas Prisma completos para Fase 1
- Reglas estrictas

**Cambio importante vs versión anterior:** Procurement salió de la lista de módulos de Minera360 y ahora aparece como **producto vertical separado**, igual que EnergiAI. Esto le dice claramente a Claude Code: "no codees Procurement en este repo".

#### 2. `prd-fase-1.md` — Lo que construimos AHORA

PRD completo de Fase 1 (SafetyOps + Contacto MVP). 10 EPICs, 4 personas, user stories detalladas. **Sin cambios respecto al paquete anterior.**

#### 3. `prd-procurement.md` — El nuevo vertical 🆕

PRD profesional y completo del producto Procurement (marketplace B2B mineras-proveedores). **27 KB de spec detallada.**

Incluye:
- Resumen ejecutivo y posicionamiento dentro del ecosistema
- 4 personas detalladas
- 5 EPICs con user stories completas
- Schemas Prisma completos (suppliers, RFQs, OCs, ratings, compliance)
- Pantallas principales para mineras, proveedores y gobierno
- Modelo de negocio con 4 fuentes de revenue + proyección 36 meses
- **Estrategia para resolver el chicken-egg del marketplace** (clave para que funcione)
- Riesgos y mitigaciones
- Roadmap tentativo de cuándo construirlo
- Equipo mínimo y presupuesto
- Próximos pasos concretos para validar con tu amigo

**Para qué te sirve este archivo:**
- ✅ Mostrarle a tu amigo algo serio y profesional
- ✅ Convertir una charla informal en un acuerdo concreto
- ✅ Cuando llegue el momento, Claude Code puede arrancar el desarrollo con specs claras
- ✅ Material para presentar a posibles inversores del vertical
- ✅ Documento que mejora tu posición en cualquier negociación

#### 4. `PROMPTS_CLAUDE_CODE.md` — Los prompts paso a paso

11 prompts maestros (PROMPT 0 al 10) listos para copiar y pegar en Claude Code en orden secuencial. **Sin cambios respecto al paquete anterior.** Te llevan desde monorepo vacío hasta demo vendible de Fase 1.

---

## 🚀 CÓMO USAR EL PAQUETE

### Para arrancar el desarrollo (Latitud360 core)

```bash
# 1. Crear el repo
gh repo create nativos/latitud360 --private
git clone https://github.com/nativos/latitud360.git
cd latitud360

# 2. Copiar los archivos al repo
cp ~/Downloads/CLAUDE.md ./CLAUDE.md
mkdir -p docs
cp ~/Downloads/prd-fase-1.md ./docs/prd-fase-1.md
cp ~/Downloads/prd-procurement.md ./docs/prd-procurement.md

# 3. Primer commit
git add .
git commit -m "docs: initial CLAUDE.md, PRD Fase 1, PRD Procurement"
git push

# 4. Abrir Claude Code
claude
```

Y pegás el **PROMPT 0** del archivo de prompts. Claude Code arranca a construir SafetyOps + Contacto. **NO va a tocar Procurement** porque está marcado como vertical separado.

### Para presentar Procurement a tu amigo

1. **Mandale el archivo `prd-procurement.md`** por mail o WhatsApp
2. **Agendá una reunión de 1 hora** para revisarlo juntos
3. **Conversá los 4 próximos pasos** que detalla el PRD al final:
   - Validación de interés
   - Validación con cliente potencial (entrevistar Procurement Managers)
   - Estructura societaria del vertical
   - Plan de arranque

**Tip importante:** no te apures a comprometerlo. Que él se entusiasme primero. El PRD profesional vende solo.

---

## 🎯 LA DECISIÓN ESTRATÉGICA QUE TOMASTE

Recapitulando lo que decidimos juntos:

| Decisión | Tu elección | Beneficio |
|---|---|---|
| Cómo construir Latitud360 | Fase 1 = SafetyOps + Contacto (sin cambios) | Foco maniático en MVP vendible |
| Cómo manejar Procurement | Documentar pero NO construir ahora | Vertical futuro con socio dedicado |
| Quién lidera Procurement | Tu amigo potencial | Vos seguís enfocado en Latitud360 core |
| Cuándo arranca Procurement | Cuando él se comprometa formalmente | Sin distraer a Latitud360 |

**Esta es la mejor decisión posible** porque:
- Mantenés tu foco en cerrar el primer piloto (mes 3)
- Tenés el PRD listo para tu amigo (cero costo de oportunidad)
- Si tu amigo se compromete, arrancan con specs profesionales
- Si tu amigo no se compromete, el PRD queda para una eventual inversión
- No rompés el plan de desarrollo de Latitud360

---

## 📋 CHECKLIST DE PRÓXIMOS PASOS

### Esta semana

```
LATITUD360 CORE:
[ ] Crear repo en GitHub
[ ] Copiar CLAUDE.md, prd-fase-1.md y prd-procurement.md al repo
[ ] Setup local (Node 20, pnpm, Claude Code)
[ ] Crear cuentas: Supabase, Vercel, Render, Resend
[ ] Comprar dominio latitud360.com
[ ] Ejecutar PROMPT 0 + PROMPT 1 (monorepo setup)

PROCUREMENT:
[ ] Mandar prd-procurement.md a tu amigo
[ ] Agendar reunión para revisarlo juntos
[ ] No comprometer nada todavía - dejarlo digerir
```

### Próximas 2 semanas

```
LATITUD360 CORE:
[ ] PROMPT 2 (Backend + DB)
[ ] PROMPT 3 (Auth multi-tenant)
[ ] Comenzar Fase 1 con PROMPT 4 (SafetyOps backend)

PROCUREMENT:
[ ] Reunión con tu amigo
[ ] Si hay interés, validar con 2-3 Procurement Managers
[ ] Definir estructura societaria si avanza
```

### Mes 1-3

```
LATITUD360 CORE:
[ ] Fase 1 completa (PROMPTS 4 al 9)
[ ] Demo navegable
[ ] Primer piloto en negociación

PROCUREMENT:
[ ] Decisión definitiva de tu amigo (sí/no)
[ ] Si sí: plan de arranque + setup de equipo separado
[ ] Si no: PRD queda documentado para futuro
```

---

## 💡 TIPS FINALES

### El CLAUDE.md es sagrado

Cada nueva sesión de Claude Code:
```
Hola Claude. Leé el CLAUDE.md del repo y docs/prd-fase-1.md.
Después contame qué entendiste y arrancamos.
```

### Si te preguntan por Procurement durante el desarrollo

Decile a Claude Code:
```
Procurement es un producto vertical SEPARADO documentado en
docs/prd-procurement.md. NO lo construimos en este repo.
Si te lo piden, recordá que es proyecto aparte.
```

### Cuando tu amigo se decida

Si avanza el deal con tu amigo, **NO mezclar repos**. Crear un repo nuevo:
```bash
gh repo create nativos/procurement --private
```

Y arrancar de cero ahí, usando el `prd-procurement.md` como base. Compartir solo:
- Auth (Supabase)
- Cliente Organization
- Notifications hub
- Billing

Pero código separado, deploy separado, equipo separado.

---

## ⚠️ ERRORES COMUNES A EVITAR

| Error | Por qué pasa | Solución |
|---|---|---|
| Pedirle a Claude Code que construya Procurement en el repo de Latitud360 | Tentación de "ya que estamos" | Repos separados SIEMPRE |
| Comprometerte con tu amigo antes de validar | Entusiasmo inicial | Conversar PRD primero, luego validar con cliente, después comprometer |
| Distraerte con Procurement antes de cerrar primer piloto SafetyOps | Síndrome del founder con 10 ideas | Foco en mes 3 (primer piloto). Procurement puede esperar |
| Mezclar discusiones de ambos productos en la misma reunión | Confusión natural | Reuniones SEPARADAS para cada producto |

---

## 🚀 ¡A CONSTRUIR JORGE!

Tenés ahora:
- ✅ Plan claro de Fase 1 (3 meses)
- ✅ PRD profesional para presentar a tu amigo
- ✅ Documentación completa para Claude Code
- ✅ Foco maniático sin desviaciones
- ✅ Vertical futuro con potencial socio

**Lo más importante:** las decisiones estratégicas ya están tomadas. Ahora es ejecución pura.

Cualquier duda durante el desarrollo, vení y armamos prompts específicos.

Jorge Eduardo Francesia · Nativos · Catamarca · 2026
