---
name: crear_sysadmin_hud
description: Receta para crear un Dashboard de Servidor falso hiperrealista
---

# Skill: Sysadmin HUD (Métricas Falsas)

## HTML Base
```html
<div id="sys-hud">
  <div class="hud-box">CPU: <span id="hud-cpu">12</span>%</div>
  <div class="hud-box">NET: <span id="hud-net">84.2</span> Mbps</div>
  <canvas id="hud-chart" width="100" height="30"></canvas>
</div>
```

## CSS HUD
```css
#sys-hud {
  position: fixed; bottom: 20px; left: 20px;
  font-family: monospace; font-size: 10px; color: rgba(0, 255, 136, 0.5);
  pointer-events: none; z-index: 50; display: flex; flex-direction: column; gap: 5px;
}
```

## Lógica JS
```javascript
const cpuEl = document.getElementById('hud-cpu');
const netEl = document.getElementById('hud-net');
const ctx = document.getElementById('hud-chart').getContext('2d');
const history = Array(50).fill(10);

setInterval(() => {
  // Generar datos aleatorios suavizados
  let last = history[history.length - 1];
  let val = Math.max(2, Math.min(98, last + (Math.random() - 0.5) * 20));
  history.shift();
  history.push(val);
  
  cpuEl.innerText = val.toFixed(1);
  netEl.innerText = (Math.random() * 100 + 50).toFixed(1);
  
  // Dibujar gráfico
  ctx.clearRect(0,0,100,30);
  ctx.beginPath();
  ctx.strokeStyle = 'rgba(0, 255, 136, 0.5)';
  history.forEach((v, i) => {
    let y = 30 - (v / 100 * 30);
    if(i===0) ctx.moveTo(i*2, y);
    else ctx.lineTo(i*2, y);
  });
  ctx.stroke();
}, 200);
```
