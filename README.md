# Propedéutico LLM — Escuela CICADA

Sitio introductorio, interactivo y sin backend para las dos semanas previas a la Escuela CICADA. Incluye seis jornadas obligatorias, dos bloques opcionales sobre redes neuronales, videos de 3Blue1Brown, actividades breves, glosario y progreso guardado localmente en el navegador.

Al final ofrece una extensión opcional de «manos al código» con dos notebooks equivalentes:

- [Python: transformers, embeddings y activaciones](notebooks/01_python_transformers.ipynb), también disponible para [abrir en Colab](https://colab.research.google.com/github/almadana/propedeutico-llms/blob/main/notebooks/01_python_transformers.ipynb).
- [R: transformers mediante reticulate](notebooks/02_r_transformers.ipynb).

La [guía de los notebooks](notebooks/README.md) explica contenidos, dependencias y ejecución local. Esta extensión no cuenta dentro de las cinco horas del trayecto principal.

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
