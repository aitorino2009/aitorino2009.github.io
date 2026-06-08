# Spec: Soundscape API (Diseño Sonoro)

## Descripción
Sintetizar efectos de sonido de interfaz (clicks, bleeps) usando exclusivamente `AudioContext` de HTML5, sin necesidad de cargar archivos `.mp3` pesados o lidiar con rutas.

## Lógica Web Audio API
1. Instanciar `new window.AudioContext()`.
2. Crear un oscilador (`createOscillator`) con tipo `sine`, `square` o `triangle`.
3. Crear un nodo de ganancia (`createGain`) para controlar el volumen (envelope) y evitar el chasquido inicial.
4. Conectar: Oscillator -> Gain -> Destination.

## Tipos de sonido
* **Click de Hover:** Frecuencia altísima (1000Hz), duración cortísima (0.05s).
* **Click de Typewriter:** Ruido blanco o pulsos cuadrados cortos.
* **Boot Hum:** Frecuencia baja (60Hz) con un gain bajo de 1 segundo simulando encendido de servidor.

## Restricciones
Los navegadores modernos bloquean el audio si el usuario no ha interactuado con la página. Se activará un botón "Sound: OFF / ON" en el HUD.
