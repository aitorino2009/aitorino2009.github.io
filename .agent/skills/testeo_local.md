---
name: testeo_local
description: Iniciar un servidor web local ligero sin dependencias de NPM
---

# Testeo Local (Sin NPM)

Dado que hemos eliminado Vite y NPM, para probar la web localmente y evitar problemas de CORS al hacer pruebas complejas, podemos usar el módulo HTTP de Python.

## Ejecución
Abre la terminal en la raíz del proyecto y ejecuta:
```bash
python -m http.server 8000
```
*(En algunos sistemas, el comando es `python3`)*

Luego, abre tu navegador en `http://localhost:8000`.
