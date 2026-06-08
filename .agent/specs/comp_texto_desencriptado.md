# Spec: Componente Scramble Text (Desencriptación)

## Descripción
Efecto donde el texto cambia rápidamente por caracteres aleatorios antes de estabilizarse en la palabra original. Perfecto para revelar elementos al hacer scroll.

## Lógica JS
* Se define el abecedario de símbolos (ej. `!<>-_\\/[]{}—=+*^?#_`).
* Una función recursiva con `requestAnimationFrame` avanza el texto original caracter por caracter desde la izquierda.
* La parte restante de la cadena se llena con caracteres aleatorios en cada frame.
* Se activa al detectar que el elemento entra en pantalla usando `IntersectionObserver`.
