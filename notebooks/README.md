# Notebooks opcionales: manos al código

Estos cuadernos extienden el propedéutico sin formar parte de las cinco horas del recorrido principal. Ambos recorren los mismos conceptos con modelos pequeños que pueden ejecutarse en CPU:

- [Python: transformers, embeddings y activaciones](01_python_transformers.ipynb). Puede abrirse directamente en [Google Colab](https://colab.research.google.com/github/almadana/propedeutico-llms/blob/main/notebooks/01_python_transformers.ipynb).
- [R: transformers mediante reticulate](02_r_transformers.ipynb). Requiere un kernel de R para Jupyter y un entorno Python accesible desde `reticulate`.

## Contenido

1. Generación básica con una `pipeline`.
2. Tokenización real.
3. Embeddings de entrada y activaciones contextuales.
4. Embeddings de oraciones mediante *mean pooling*.
5. Evolución de las activaciones por capa.
6. Visualización de una matriz de atención.

Se usan `HuggingFaceTB/SmolLM2-135M-Instruct` para la generación y `distilbert-base-multilingual-cased` para inspeccionar representaciones internas. Los pesos se descargan de Hugging Face la primera vez.

## Entorno local

Para Python:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r notebooks/requirements.txt
jupyter lab
```

Para R, instalá `IRkernel`, `reticulate` y `ggplot2`. Después asegurate de que `reticulate::py_config()` muestre un Python que tenga instalados `transformers` y `torch`. El cuaderno incluye instrucciones de diagnóstico e instalación.

## Nota de interpretación

Las visualizaciones reducen objetos de alta dimensión y muestran una sola cabeza o un resumen agregado. Son herramientas para construir intuición: una matriz de atención no es, por sí sola, una explicación causal de una predicción.
