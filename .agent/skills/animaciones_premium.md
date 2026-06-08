---
name: animaciones_premium
description: Plantillas de CSS/JS para efectos de glassmorphism y físicas 3D
---

# Animaciones Premium (Vanilla)

Esta skill almacena recetas reutilizables para efectos "Top Tier" sin librerías externas.

## 1. Glassmorphism Avanzado (CSS)
Para aplicarlo a cualquier contenedor nuevo:
```css
.glass-panel {
  background: rgba(17, 20, 24, 0.4);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}
```

## 2. Tilt 3D Holográfico (JS Core)
Lógica básica para calcular la rotación en base a la posición del ratón:
```javascript
function applyTilt(element, event) {
  const rect = element.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  
  const rotateX = ((y - centerY) / centerY) * -5; // Max 5 grados
  const rotateY = ((x - centerX) / centerX) * 5;
  
  element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
}
```
