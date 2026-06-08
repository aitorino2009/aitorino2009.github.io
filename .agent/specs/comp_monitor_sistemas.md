# Spec: Componente HUD Sysadmin

## Descripción
Panel de monitorización simulado (HUD) superpuesto al diseño, mostrando métricas en tiempo real que reaccionan a los movimientos del usuario o al scroll para dar sensación de servidor vivo.

## Elementos Visuales
* **Gráfico de CPU:** Pequeño canvas o SVG dibujando una onda en movimiento continuo.
* **Uptime Counter:** Contador que incrementa segundos.
* **Net I/O:** Simulación de paquetes enviados/recibidos.

## CSS
Estilo `fixed` en la esquina inferior izquierda o derecha, con `pointer-events: none` para no entorpecer la interacción. Opacidad baja (`0.3` a `0.6`), color cian o verde.

## JS
Un bucle `requestAnimationFrame` o `setInterval` actualizando los números y dibujando líneas en el canvas del gráfico para simular fluctuaciones de carga (ruido Perlin o Random suavizado).
