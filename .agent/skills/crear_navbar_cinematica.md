---
name: crear_navbar_cinematica
description: Receta para construir una Navbar flotante estilo píldora sci-fi
---

# Skill: Crear Navbar Cinematográfica

Para aplicar este estilo de Navbar en cualquier proyecto sin librerías externas:

## 1. Estructura Base HTML
```html
<nav class="nav-pill">
  <div class="nav-logo glitch-hover">logo<span>.</span></div>
  <div class="nav-links">
    <a href="#" class="scanner-link">Enlace</a>
  </div>
</nav>
```

## 2. CSS Píldora Flotante
La clave es el `margin`, `border-radius` alto y el blur.
```css
.nav-pill {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 800px;
  height: 50px;
  border-radius: 25px;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 25px;
  z-index: 100;
}
```

## 3. Link Escáner (Scanner Link)
Un subrayado brillante que aparece desde el centro hacia los lados.
```css
.scanner-link { position: relative; color: #fff; text-decoration: none; }
.scanner-link::after {
  content: ''; position: absolute; bottom: -5px; left: 50%;
  width: 0; height: 1px; background: #00ff88;
  transition: width 0.3s ease, left 0.3s ease;
  box-shadow: 0 0 10px #00ff88;
}
.scanner-link:hover::after { width: 100%; left: 0; }
```
