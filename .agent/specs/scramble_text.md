# Especificación Técnica: Sistema de Scramble Text

## Objetivo
Extender el sistema de animación de texto con efecto "scramble" (caracteres aleatorios que convergen en el texto real) para cubrir dos casos de uso nuevos:
1. **Scramble en el Hero:** El título `h1.hero-name` ("Aitor Portales") recibe el efecto al cargar la página, sustituyendo el `fade-in` estático actual.
2. **Scramble Repetible en Scroll:** El encabezado `h2.scramble` ("Proyectos") dispara el efecto cada vez que el elemento entra en el viewport (tanto scrollando hacia abajo como hacia arriba), en lugar de una sola vez.

---

## Estado Actual del Sistema

La clase `TextScramble` en `main.js` (línea 550) ya está implementada y es funcional. La función `initScramble()` (línea 600) usa un `IntersectionObserver` que llama a `obs.unobserve(el)` tras el primer disparo, haciendo la animación de un solo uso.

---

## Cambios a Implementar

### 1. Scramble repetible para `.scramble` (encabezado "Proyectos")

**Problema:** `obs.unobserve(el)` descarta el elemento del observer tras la primera intersección, impidiendo repeticiones.

**Solución:** Separar la lógica en dos observers:
- **`initScrambleOnce()`** para elementos con clase `.scramble-once` (si se quiere preservar el comportamiento original en algún elemento futuro).
- **`initScramble()`** se modifica para que **no llame a `obs.unobserve(el)`**, permitiendo que el observer re-dispare cada vez que el elemento entre/salga del viewport.

Para evitar que la animación se solape consigo misma si el scroll es rápido, se añade una guarda: `if (el.dataset.scrambling === 'true') return;` que se activa al empezar y se limpia en el callback `.then()` de `setText()`.

### 2. Scramble en el Hero (`h1.hero-name`)

**Problema:** El `h1.hero-name` actualmente tiene la clase `fade-in d2` que usa una transición CSS. Hay que preservar la visibilidad del texto si JS falla (graceful degradation).

**Solución:**
- Añadir la clase `scramble-hero` al `h1.hero-name` en `index.html`.
- En `initScramble()`, tras inicializar el observer repetible para `.scramble`, añadir una llamada directa al cargar la página para los elementos `.scramble-hero`, sin observer (se dispara una sola vez al DOMContentLoaded).
- Quitar la clase `fade-in d2` del `h1` en el HTML ya que la animación de scramble la reemplaza visualmente (aunque se puede mantener `opacity: 0` inicial y darle `opacity: 1` antes de empezar el scramble).

---

## API de la Función Actualizada

```javascript
// Caso 1: Disparar UNA sola vez al cargar (Hero)
function initScrambleHero() {
  const el = document.querySelector('.scramble-hero');
  if (!el) return;
  const text = el.dataset.scrambleText || el.innerText;
  el.style.opacity = '1'; // Hacerlo visible antes de la animación
  const scrambler = new TextScramble(el);
  scrambler.setText(text);
}

// Caso 2: Re-disparar cada vez que entra en viewport (Proyectos)
function initScramble() {
  const elements = document.querySelectorAll('.scramble');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      if (el.dataset.scrambling === 'true') return; // guard anti-solapamiento
      el.dataset.scrambling = 'true';
      const text = el.dataset.scrambleText || el.innerText;
      const scrambler = new TextScramble(el);
      scrambler.setText(text).then(() => {
        el.dataset.scrambling = 'false';
      });
    });
    // SIN obs.unobserve() para que se repita
  }, { threshold: 0.5 });
  elements.forEach(el => observer.observe(el));
}
```

---

## HTML Requerido

```html
<!-- Hero: añadir clase scramble-hero y data-scramble-text -->
<h1 class="hero-name scramble-hero" data-scramble-text="Aitor Portales">Aitor Portales</h1>

<!-- Proyectos: ya tiene .scramble, no necesita cambios en el HTML -->
<h2 class="scramble">Proyectos</h2>
```

---

## Verificación
1. Al cargar la página, el título "Aitor Portales" debe aparecer con el efecto scramble (caracteres que resuelven al nombre real).
2. Al scrollar hasta la sección de "Proyectos", el h2 debe hacer scramble.
3. Al scrollar **hacia arriba** (sección de Proyectos fuera del viewport) y volver a bajar, el efecto debe repetirse.
4. Si el scroll es muy rápido y el elemento entra/sale varias veces, la animación NO debe solaparse (guarda activa).
