# Skill: Implementar Scramble Text

## Cuándo usar esta skill
Cuando necesites añadir el efecto de texto con caracteres aleatorios que convergen en el texto real ("scramble") a cualquier elemento del portfolio.

---

## Clases CSS disponibles

| Clase | Comportamiento |
|-------|----------------|
| `.scramble` | Se dispara **cada vez** que el elemento entra en el viewport (scrollando en cualquier dirección). |
| `.scramble-hero` | Se dispara **una sola vez** al cargar la página (ideal para el título principal). |

---

## Receta: Añadir scramble a un elemento nuevo

### Paso 1: HTML
```html
<!-- Para efecto repetible (scroll) -->
<h2 class="scramble" data-scramble-text="Mi Título">Mi Título</h2>

<!-- Para efecto de carga única (hero) -->
<h1 class="scramble-hero" data-scramble-text="Aitor Portales">Aitor Portales</h1>
```

> El atributo `data-scramble-text` es opcional. Si no existe, el sistema lee `el.innerText` directamente. Úsalo si el `innerText` puede variar por el propio efecto.

### Paso 2: JS (ya implementado en main.js)
No es necesario tocar `main.js`. Las funciones `initScramble()` e `initScrambleHero()` ya procesan automáticamente todos los elementos con esas clases.

### Paso 3: CSS (ya implementado)
El estilo de los caracteres aleatorios (color `--cyan`, opacidad reducida) está definido en `components.css` bajo `.scramble-dud`.

---

## Implementación de Referencia (main.js)

```javascript
// ==========================================
// 5. SCRAMBLE TEXT EFFECT
// ==========================================
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#_';
    this.update = this.update.bind(this);
  }
  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => this.resolve = resolve);
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }
  // ... update() sin cambios
}

// Disparar CADA VEZ que entra en viewport (con guarda anti-solapamiento)
function initScramble() {
  const elements = document.querySelectorAll('.scramble');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      if (el.dataset.scrambling === 'true') return;
      el.dataset.scrambling = 'true';
      const text = el.dataset.scrambleText || el.innerText;
      const scrambler = new TextScramble(el);
      scrambler.setText(text).then(() => {
        el.dataset.scrambling = 'false';
      });
    });
    // No hay unobserve() → el efecto se repite
  }, { threshold: 0.5 });
  elements.forEach(el => observer.observe(el));
}

// Disparar UNA SOLA VEZ al cargar la página (Hero)
function initScrambleHero() {
  const el = document.querySelector('.scramble-hero');
  if (!el) return;
  el.style.opacity = '1';
  const text = el.dataset.scrambleText || el.innerText;
  const scrambler = new TextScramble(el);
  scrambler.setText(text);
}
```

---

## Notas importantes
- La clase `TextScramble` vive en `main.js`. No duplicarla.
- El `data-scramble-text` evita que el scramble lea caracteres intermedios (HTML corrompido) como texto de origen en las re-ejecuciones.
- Para el hero, quitar `fade-in` del CSS del elemento o anular `opacity: 0` antes de llamar al scramble para que el texto sea visible.
