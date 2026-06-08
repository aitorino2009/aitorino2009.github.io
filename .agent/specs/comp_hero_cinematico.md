# Spec: Componente Hero Cinematográfico

## Descripción
Un Hero despejado, inmersivo y de alto impacto visual, resolviendo la sobrecarga de información del diseño anterior.

## Reestructuración
El layout será un grid asimétrico o flexbox con dos bloques claramente separados.
1.  **Bloque Izquierdo (Texto):** 
    *   Nombre grande, tipografía extendida o bold, ocupando máximo 2 líneas.
    *   Descripción más corta y separada.
    *   Sustitución de la "Caja de Datos" por **Micro-Badges** minimalistas, integrados visualmente debajo de la descripción sin romper el flujo.
2.  **Bloque Derecho (Terminal):**
    *   La terminal se convertirá en un objeto flotante protagonista.
    *   Tendrá una sombra intensa, un efecto 3D persistente (un `rotateY` o `rotateX` fijo que le da perspectiva isométrica suave), y un resplandor ambiental de color verde detrás.

## Micro-Badges
Elementos inline pequeños (`padding: 4px 10px`, `border-radius: 20px`, `border: 1px solid #333`) que muestran información clave sin ocupar espacio de grid.
*   Ej: `[Punto Verde] Buscando Prácticas`
*   Ej: `Palma de Mallorca`
