# Spec: Operación "Obra Maestra" (Arquitectura y UI)

## Objetivo
Refactorizar `aitorino2009.github.io` desde un monolito `index.html` hacia un entorno de Vite con Vanilla JS/CSS. El propósito es crear una base escalable y altamente pulida, con efectos de "obra maestra".

## 1. Arquitectura de Archivos
Se usará Vite. La estructura principal dentro del proyecto será:
* `index.html`: Punto de entrada semántico.
* `src/css/`:
  * `variables.css`: Tokens de diseño (colores, fuentes, bordes).
  * `base.css`: Reset y estructura del body.
  * `components.css`: Tarjetas, terminal, barra de navegación.
  * `animations.css`: Keyframes.
* `src/js/`:
  * `main.js`: Lógica principal, importa todo.
  * `terminal.js`: Lógica del efecto typewriter.
  * `animations.js`: Lógica del IntersectionObserver para revelado al scroll.
  * `projects.js`: Gestión del estado de las tarjetas.

## 2. Decisiones de Diseño UI (Glassmorphism & Micro-interacciones)
- Se aumentará el desenfoque (`backdrop-filter: blur()`) de la navegación para dar sensación "premium".
- Las tarjetas usarán transiciones `all 0.3s cubic-bezier(0.4, 0, 0.2, 1)`.
- El efecto Typewriter imprimirá los comandos del hero línea por línea para emular una terminal real con `setTimeout`.

## 3. Comandos de Desarrollo
* Inicialización: `npx -y create-vite@latest ./ --template vanilla`
* Dev: `npm run dev`
* Build: `npm run build`
