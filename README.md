# Propedéutico LLM — Escuela CICADA

Sitio introductorio, interactivo y sin backend para las dos semanas previas a la Escuela CICADA. Incluye seis jornadas, videos de 3Blue1Brown, actividades breves, glosario y progreso guardado localmente en el navegador.

## Desarrollo local

Requiere Node.js 22 o posterior.

```bash
npm install
npm run dev
```

## Publicación en GitHub Pages

1. Crear un repositorio y copiar allí este proyecto.
2. En **Settings → Pages**, elegir **GitHub Actions** como fuente.
3. Hacer push a la rama `main`.

El workflow `.github/workflows/pages.yml` construye y publica el sitio. Detecta automáticamente si se aloja en la raíz de una cuenta u organización, o bajo el nombre de un repositorio.

El sitio no requiere base de datos ni servicios propios. Los videos se reproducen desde YouTube y el avance se guarda mediante `localStorage` en cada dispositivo.
