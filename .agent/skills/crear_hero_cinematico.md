---
name: crear_hero_cinematico
description: Receta para estructurar un Hero impactante y sin sobrecarga visual
---

# Skill: Crear Hero Cinematográfico

## 1. Grid Despejado
Para evitar que elementos como el texto y las tarjetas colisionen (clutter), usa un Grid asimétrico con un `gap` grande y alinea elementos verticalmente al centro.
```css
.hero-clean {
  min-height: 80vh;
  display: grid;
  grid-template-columns: 1.2fr 1fr; /* Más espacio al texto */
  gap: 5rem;
  align-items: center; /* En lugar de end, centrado para respirar */
}
```

## 2. Terminal Isométrica Flotante
Dale a un contenedor un efecto tridimensional suave para separarlo del fondo plano.
```css
.terminal-isometric {
  transform: perspective(1000px) rotateY(-15deg) rotateX(5deg) scale(0.9);
  box-shadow: 
    -20px 20px 50px rgba(0,0,0,0.5),
    0 0 100px rgba(0, 255, 136, 0.1); /* Resplandor */
  transition: transform 0.5s ease;
}
.terminal-isometric:hover {
  transform: perspective(1000px) rotateY(-5deg) rotateX(2deg) scale(0.95);
}
```

## 3. Micro-Badges
Sustituye bloques pesados de metadatos por insignias pequeñas (pills) para ahorrar espacio.
```css
.micro-badges-container {
  display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 2rem;
}
.micro-badge {
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.1);
  font-size: 0.7rem;
  color: var(--muted);
}
```
