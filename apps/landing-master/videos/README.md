# Videos de la landing master

5 video loops 4K que se cargan como background de cada sección. Si los archivos no están presentes, la landing usa **mesh gradients animados** como fallback (el `FadingVideo` queda en opacity 0 y se ve la capa CSS de abajo).

## Archivos esperados

| Archivo | Sección | Duración loop |
|---|---|---|
| `01-hero.mp4` | Hero — Salar Hombre Muerto amanecer | 15 s |
| `02-cordillera.mp4` | Productos — cordillera del NOA | 15 s |
| `03-control-room.mp4` | Copilot — sala de control futurista | 15 s |
| `04-industrias.mp4` | Industrias — mosaico minero NOA | 20 s |
| `05-atardecer.mp4` | CTA final — atardecer cordillera | 15 s |

**Specs técnicas:**
- Codec: H.264 (compatibilidad amplia) o H.265 si querés mejor compresión
- Resolución: 1920×1080 mínimo, 3840×2160 ideal
- Bitrate: 8–12 Mbps para 1080p, 25 Mbps para 4K
- Audio: ninguno (los `<video>` son `muted`)
- Tamaño objetivo: < 8 MB cada uno (lazy-loaded por sección)

---

## Prompts para Runway / Sora / Veo / Kling

### 1 · Hero — Salar Hombre Muerto amanecer
```
Cinematic aerial drone shot, sunrise over the Salar del Hombre Muerto in
Catamarca, Argentina, 4000m altitude. Vast lithium evaporation ponds in
geometric turquoise, white and earth-tone patterns. Slow descending camera
movement revealing massive industrial scale. Andean cordillera silhouette in
distant horizon. Soft pastel sky with pink and blue hues. Photorealistic,
ultra detailed, 4K, no text, no people, no logos. 15 second loop, gentle motion.
```

### 2 · Cordillera al amanecer
```
Cinematic time-lapse of the Andes mountains in Catamarca province, sunrise to
early morning. Snow-capped peaks transitioning from purple to orange to white.
Slow forward dolly movement. Mining infrastructure barely visible in valleys
below. Awe-inspiring scale, ultra detailed, 4K, photorealistic, no text. 15
second loop.
```

### 3 · Sala de control AI Copilot
```
Futuristic mining operations control room. Multiple holographic displays
floating in the air showing real-time mine maps with vehicle GPS tracking,
equipment vibration graphs, safety alerts highlighted in orange. A supervisor
wearing a mining helmet observing the screens, soft profile lighting on his
face. Dark room with cyan and orange ambient lighting, deep depth of field,
particles in air, 4K cinematic, ultra detailed, photorealistic. 15 second loop.
```

### 4 · Industrias mosaico
```
Aerial cinematic montage of mining operations in the NOA region of Argentina.
Sequential shots: lithium salt flats with geometric ponds at golden hour,
open-pit gold mine at sunrise with golden light, copper mine with massive
excavator and dust clouds illuminated, Andean landscape with snow-capped peaks.
Slow dissolving transitions. 4K, ultra detailed, photorealistic, no text, no
logos. 20 second loop.
```

### 5 · Atardecer cordillera CTA
```
Cinematic landscape shot of the Andes mountains in northwest Argentina at
sunset. Distant lithium salt flats reflecting purple and orange sky. Static
camera with very subtle natural sway. Meditative, vast, awe-inspiring. Sky
transitioning from orange to deep purple with first stars appearing. 4K ultra
detailed, photorealistic, no text, no people, no logos. 15 second loop.
```

---

## Optimización post-render

Después de renderizar, comprimir con `ffmpeg`:

```bash
ffmpeg -i input.mp4 \
  -c:v libx264 -preset slow -crf 23 \
  -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2" \
  -an -movflags +faststart \
  01-hero.mp4
```

`-movflags +faststart` mueve el moov atom al inicio para reproducción inmediata via streaming.
