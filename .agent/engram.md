# 🧠 .agent/engram.md — Memoria del Agente (Engram)

Este archivo almacena la memoria persistente del Agente para asegurar la coherencia del desarrollo a lo largo de las múltiples sesiones de trabajo. **No debe ser borrado ni alterado de forma destructiva.**

---

## 🚨 Reglas Críticas e Innegociables
Estas reglas han sido indicadas por el usuario y son de obligado cumplimiento bajo cualquier circunstancia:

1. **Protocolo de Inicio de Sesión:** Al iniciar cualquier tarea o sesión, el agente debe:
   * Leer **SIEMPRE** el archivo `agent.md` en la raíz.
   * Seguir estrictamente los protocolos de Memoria (Engram) y Skills definidos allí.
   * Respetar e integrar las especificaciones técnicas guardadas en `.agent/specs/`.
2. **Localización y Estilo:** Hablar siempre en **castellano** y mantener el estilo técnico, ameno, riguroso y divertido ("Nivel 75.000€ Sysadmin Premium").
3. **Pureza del Stack (Vanilla):** El proyecto tiene prohibido terminantemente el uso de dependencias externas en NPM (React, Tailwind, Vue, Vite, etc.). Todo se debe construir usando Vanilla HTML5, CSS3 y JS (ESM) para garantizar máxima ligereza y compatibilidad directa en GitHub Pages.
4. **Cero Dependencias Visuales/Auditivas Pesadas:** Prohibido cargar archivos `.mp3` o librerías masivas de iconos. Los efectos de sonido se generan vía `AudioContext` nativo y los iconos se inyectan como rutas SVG (`<svg><path/></svg>`) directamente en el DOM.
5. **Nombrado de Archivos en Castellano:** Cualquier archivo nuevo creado en el repositorio (especificaciones, habilidades, planes, etc.) debe tener obligatoriamente su nombre de archivo escrito en castellano (ej. `inmersion_dinamica.md` en lugar de `dynamic_immersion.md`).
6. **Paciencia y Protocolo (Quien mucho abarca poco aprieta):** Nunca agrupes múltiples fases en una sola respuesta. El flujo de desarrollo es estricto y secuencial: Idea → Plan de Implementación (`.agent/specs/`) → Aprobación del Usuario → Ejecución.
7. **Estética Cyber/Sysadmin Innegociable:** La UI debe apoyarse siempre en el contraste táctico (`#03050a` de fondo), brillos Neón (`--cyan`, `--green`, `--purple`), texturas técnicas (grid) y Glassmorphism (`backdrop-filter`).

---

## 💡 Aprendizajes Recientes del Proyecto
* **Mecánica del HUD en Tiempo Real:** Para evitar saturar el hilo principal con cálculos pesados en el monitor de sistemas (`canvas`), la actualización se realiza mediante un `setInterval` que interpola valores matemáticos (`Math.random` con histórico) y redibuja únicamente las coordenadas necesarias, logrando 60fps sin librerías externas de gráficos.
* **Warp Speed y Aceleración de Hardware:** Para simular el "salto hiperespacial" al abrir un proyecto, se prescindió de animaciones CSS tradicionales en favor de un bucle `requestAnimationFrame` en JS que inyecta un multiplicador de velocidad dinámico (`warpMultiplier`) al `backgroundPositionY` del grid 3D. Esto permite aplicar fricción matemática (`*= 0.94`) logrando una inercia perfecta.
* **Máquina de Estados de Acordeón para Proyectos:** Se reestructuró la lógica de apertura de proyectos en `main.js` (`toggleProject`). Ahora, antes de añadir la clase `open` al proyecto objetivo, se itera sobre todos los elementos `.project` eliminando la clase. Esto centraliza el estado y asegura la exclusividad de la inmersión holográfica.
* **⚠️ REGLA CRÍTICA — Rutas SVG en el DOM:** Se intentó usar SVGs externos, pero generaba parpadeos y peticiones de red innecesarias. La solución definitiva fue embeber las rutas de los iconos (Arch Linux, Bash, Windows, LUKS) como constantes de texto (Template Strings) dentro de `main.js` e inyectarlas a través de `innerHTML` solo cuando el contenedor holográfico se activa.
* **⚠️ BUG CRÍTICO — Neofetch estático frente a ventana dinámica:** Originalmente, el comando `neofetch` de la terminal evaluaba `window.innerWidth` al momento de teclear y dejaba el string "muerto". Si el usuario redimensionaba la pantalla, la salida era incorrecta. Solución implementada: envolver los valores críticos (Resolución y Uptime) en `<span class="nf-live-res">` y `<span class="nf-live-uptime">`, creando listeners (`resize` y `setInterval`) que buscan iterativamente esos selectores para sobreescribir su contenido, convirtiendo la salida de la terminal en un dashboard en vivo.
* **Inyección Eficiente con IntersectionObserver:** Las animaciones complejas (tilt effect, scramble text, hologramas) penalizaban el Time-To-Interactive (TTI). Se solucionó encapsulando la inicialización de observadores visuales en un `IntersectionObserver`, garantizando que el DOM solo renderiza los efectos pesados cuando la tarjeta entra en el Viewport del usuario.
* **Síntesis Modular de Audio:** En lugar de disparar `AudioContext` en cada clic (lo que causa latencia), se instancian osciladores persistentes con un nodo de ganancia (`GainNode`) en `0`. Al hacer hover o clic, se modula exponencialmente el volumen (`exponentialRampToValueAtTime`), logrando un sonido mecánico instantáneo y libre de clipping (chasquidos de audio).
* **Virtual File System (vFS) en memoria:** La terminal implementa un árbol de directorios como objeto JS anidado (`VFS`). La función `resolvePath(targetStr)` interpreta rutas absolutas (`/`), relativas (`..`) y alias de home (`~`), devolviendo el nodo del árbol o un error. Los comandos `ls`, `cd` y `cat` operan sobre este árbol. El prompt del terminal es dinámico (`getPromptHTML()`) y refleja la ruta actual en tiempo real. El autocompletado con `Tab` es consciente del contexto: si el input empieza por `cd`, `cat` o `ls`, busca coincidencias en el `VFS`; si no, busca entre los comandos base.

---

## 📊 Estado Actual del Proyecto
* **Versión actual:** Web personal estable y refactorizada (100% Vanilla JS/CSS). Desplegable de forma inmediata mediante GitHub Pages.
* **Módulos Críticos:** Terminal simulada con vFS navegable (`cd`, `ls`, `cat`), historial de comandos (flechas), autocompletado avanzado de comandos y rutas (Tab), `neofetch` dinámico en tiempo real, HUD Canvas activo, Grid 3D interactivo con Warp Speed y Sintetizador de SFX de UI.
* **Skills Activas:** `.agent/skills/` cuenta con múltiples recetas de componentes, incluyendo la nueva `crear_sistema_archivos_virtual.md`.
* **Specs Implementadas:** `Operación Supernova`, `Inmersión Dinámica`, `Terminal Avanzada` y `VFS Terminal` desarrolladas con éxito e integradas en `main.js`.

---

## 🗺️ Roadmap de Mejoras Sugeridas (Futuros Pasos)
Si deseas expandir el proyecto, aquí hay ideas altamente recomendadas que se pueden abordar en las siguientes sesiones:
* [x] **Sistema de Autocompletado (Tab) en Terminal:** Implementado. Autocompletado de comandos y de rutas del vFS con `Tab`.
* [x] **Historial de Comandos (Flechas Arriba/Abajo):** Implementado. Navegación por historial de sesión.
* [x] **Sistema de Archivos Simulado (vFS):** Implementado. Comandos `ls [dir]`, `cd [dir]`, `cat [file]` funcionando sobre el árbol `VFS`. Prompt dinámico que refleja el directorio actual.
* [ ] **Modo "Hacker" / CRT Filter:** Añadir un comando secreto (`sudo hacker`) que inyecte globalmente una capa de scanlines y aberración cromática imitando un monitor CRT antiguo.
