# Spec: Terminal Avanzada (Autocompletado e Historial)

El objetivo de esta especificación es convertir nuestra simulación de terminal en una herramienta con UX de grado profesional, implementando las mecánicas clásicas de cualquier shell Unix real.

## Decisiones de Diseño Tomadas

1. **Comportamiento del Tab (Múltiples opciones):** Al igual que en Bash, si hay múltiples coincidencias para el autocompletado, la terminal imprimirá una línea mostrando las opciones disponibles sin borrar lo que el usuario ha escrito.
2. **Persistencia del Historial:** El historial de comandos (flecha arriba/abajo) vivirá en la memoria efímera de la sesión (un array en JS). Si se recarga la página, se pierde, emulando fielmente una sesión TTY temporal.

## Proposed Changes

### `src/js/main.js`
- **[MODIFY] main.js**
  - **Historial de Comandos:**
    - Añadir array global `let cmdHistory = [];` y un puntero `let historyIndex = -1;`.
    - En el evento `keydown`, capturar `ArrowUp`. Si se pulsa, decrementar el índice y reemplazar el texto del input por el comando histórico. Posicionar el cursor al final del texto.
    - Capturar `ArrowDown`. Incrementar el índice. Si llega al final, limpiar el input.
    - Al pulsar `Enter`, añadir el comando validado a `cmdHistory` y reiniciar el `historyIndex` a `cmdHistory.length`.
  - **Autocompletado (Tab):**
    - Añadir la constante `AVAILABLE_COMMANDS = ['help', 'clear', 'whoami', 'ls', 'skills', 'hire', 'sudo', 'neofetch']`.
    - Capturar la tecla `Tab` (`e.key === 'Tab'`) y usar `e.preventDefault()` para evitar el cambio de foco.
    - Filtrar el array buscando comandos que empiecen por el texto actual.
    - Si hay 1 coincidencia exacta: autocompletar el texto.
    - Si hay >1 coincidencia: inyectar un `<div class="out">` mostrando las coincidencias.
