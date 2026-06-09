# Spec: Sistema de Archivos Simulado (vFS)

Esta especificación detalla la creación de un sistema de archivos virtual (vFS) en memoria dentro de nuestra terminal, permitiendo una experiencia de navegación interactiva real mediante `cd`, `ls`, y `cat`.

## Decisiones Tomadas
1. **Estructura del vFS:** Se ha optado por estructurar el vFS anidado con los proyectos principales y algunos archivos `.txt` para lectura.
2. **Autocompletado de Rutas:** Se implementará autocompletado avanzado para que si escribes `cd c` y pulsas Tab, autocomplete a `cd chromebook/` y lo mismo para archivos al usar `cat`.

## Proposed Changes

### `src/js/main.js`
- **Definición del vFS:**
  - Crear `const VFS = { chromebook: { 'info.txt': '...' }, endeavouros: { ... }, ... }`.
- **Estado del Path:**
  - `let currentPath = [];`.
  - Crear generador dinámico `getPromptHTML()` que calcule el path actual (`~`, `~/chromebook`, etc).
- **Parser de Rutas (Resolver):**
  - Crear `resolvePath(targetStr)` que maneje `.` , `..`, `/` y subcarpetas para devolver el nodo final apuntado.
- **Comandos Avanzados:**
  - `ls`: listar keys() de la ruta actual o la especificada por el arg.
  - `cd`: modificar `currentPath` usando `resolvePath`. Validar si existe y es objeto.
  - `cat`: imprimir el string apuntado.
- **Tab Avanzado:**
  - Si el input empieza por `cd ` o `cat ` o `ls `, extraer la ruta parcial, buscar en la carpeta superior, y ofrecer autocompletado para archivos y/o carpetas.
