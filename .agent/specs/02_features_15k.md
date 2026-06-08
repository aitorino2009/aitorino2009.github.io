# Spec: Funcionalidades Premium de "15.000€"

## Objetivo
Implementar micro-interacciones avanzadas y renderizado de alto nivel para darle a la web personal un acabado *top tier* y premium, manteniendo la arquitectura Vanilla sin dependencias externas.

## 1. Boot Sequence (Pantalla de carga)
*   **HTML:** Un `div.boot-sequence` que cubre toda la pantalla con un z-index altísimo (9999).
*   **CSS:** Estilo de terminal (`bg: #0a0c0f`, fuente monospace).
*   **JS:** Un array de strings simulando procesos de boot (ej. `[OK] Started kernel...`). Se imprimen rápido con `setTimeout` y al final se desvanece y se elimina del DOM.

## 2. Fondo de Partículas (Canvas Interactivo)
*   **HTML:** `<canvas id="bg-canvas"></canvas>` fijado al fondo.
*   **JS:** Un script de Vanilla JS que genera N partículas que rebotan por la pantalla. Si la distancia entre dos partículas es corta, se dibuja una línea. Reacciona a la posición del ratón.

## 3. Cursor Personalizado (Custom Cursor)
*   **CSS:** `cursor: none` en el `body`. Dos divs: `.cursor-dot` y `.cursor-ring`.
*   **JS:** `mousemove` actualiza las coordenadas. `requestAnimationFrame` para que el anillo siga al punto con un poco de retraso (interpolación lineal, lerp).
*   **Interacción:** Al hacer hover sobre un `a`, `button` o `.project`, el cursor crece o cambia de color.

## 4. Efecto Tilt 3D (Tarjetas Holográficas)
*   **CSS:** `.project { transform-style: preserve-3d; perspective: 1000px; }`.
*   **JS:** Al mover el ratón sobre `.project`, calculamos la posición relativa del ratón y aplicamos un `rotateX` y `rotateY` (rango de -5 a 5 grados). Además, movemos un gradiente radial interno para simular un reflejo de luz (holográfico).

## 5. Botones Magnéticos
*   **JS:** Al hacer hover sobre elementos `.btn` o nav links, se calcula la distancia del ratón al centro del elemento. El elemento se desplaza usando `transform: translate(x, y)` suavemente hacia el ratón (atracción magnética).

## 6. Carrusel Infinito (Tech Marquee)
*   **HTML:** Un contenedor con un track de elementos duplicados.
*   **CSS:** Animación linear `translateX(0) a translateX(-50%)` infinita.
