# Deploy a Vercel — instrucciones

> Bloqueante: el token Vercel está bajo SAML del team `jfrancesia-hues-projects`. Necesita re-auth interactiva del usuario antes del primer deploy. Después funciona sin tocar.

## 1 · Re-autenticar (una sola vez)

```bash
vercel logout
vercel login
# elegir GitHub o email · completar el SSO en el navegador
```

Verificar:
```bash
vercel whoami            # → jfrancesia-hue
vercel projects ls       # debería listar toori360-app, puis-nuevo, etc
```

## 2 · Primer deploy (preview)

```bash
cd E:\Usuario\Latitud360\apps\landing-master
vercel link --yes        # crea proyecto "latitud360" si no existe
vercel deploy            # → URL preview .vercel.app
```

Vercel detecta automáticamente que es estático (no hay `package.json`, sirve `index.html`). El `vercel.json` aplica:
- 7 security headers (HSTS, CSP, X-Frame-Options, etc.)
- Cache inmutable en `/videos/*.mp4` y fuentes
- Redirects internos (`/demo`, `/app`, `/minera360`, `/latitud`)

## 3 · Deploy a producción

```bash
vercel deploy --prod
```

Asignar dominio (cuando se compre `latitud360.com`):
```bash
vercel domains add latitud360.com
vercel alias <preview-url> latitud360.com
```

## 4 · Subir videos cuando estén

Los 5 videos (`01-hero.mp4` a `05-atardecer.mp4`) van en `videos/`. Después del próximo `vercel deploy --prod` quedan servidos con `Cache-Control: max-age=31536000, immutable`.

Si pesan >100 MB total, considerar:
- Cloudflare R2 + CDN para servir videos
- Cambiar `src="videos/01-hero.mp4"` por `src="https://videos.latitud360.com/01-hero.mp4"` en `index.html`

## 5 · Variables de entorno (futuro)

Si la landing se vuelve dinámica (form de demo a Resend / HubSpot):
```bash
vercel env add RESEND_API_KEY production
vercel env add HUBSPOT_TOKEN production
```

## CSP — qué permite y qué no

El CSP actual permite:
- Scripts: self + inline + eval (porque Babel standalone evalúa JSX en runtime) + cdn.tailwindcss.com + unpkg.com
- Fuentes: self + fonts.gstatic.com + data:
- Imágenes: self + data: + blob: + cualquier https
- Videos: self + blob: + cualquier https
- Frames: ninguno (DENY)

**Migración futura:** cuando se mueva a build estático con Vite (sin Babel runtime), eliminar `'unsafe-eval'` del `script-src` para hardening.
