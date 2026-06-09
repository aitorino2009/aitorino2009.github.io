# Memoria a Largo Plazo (Engram)

Este archivo contiene la memoria del agente, reglas innegociables, aprendizajes y el estado actual del proyecto para asegurar la continuidad entre sesiones.

## 📌 Estado Actual del Proyecto
* **Proyecto:** Web personal (`aitorino2009.github.io`).
* **Hito Actual:** Refactorización completada y desvinculada de NPM. Arquitectura puramente Vanilla, lista para GitHub Pages sin bundler.

## 📏 Reglas y Decisiones de Diseño
* **Idioma:** Castellano (español) para interacciones y nombres de archivos de agente.
* **Tecnologías:** HTML Semántico, Vanilla CSS (modularizado en `src/css/`), Vanilla JS (modularizado en `src/js/` usando ESM nativo). **Cero dependencias externas (NPM).**
* **Diseño UI:** Nivel "75.000€ Sysadmin" Premium. Estética Dark/Cyber con altísimo contraste, efectos de cristal (Glassmorphism), fuertes brillos Neón (verde, cian y acentos morados) y texturas de cuadrícula técnica 3D dinámica. Incluye Terminal CLI interactiva simulada, HUD Canvas, Scramble Text, Sintetizador Web Audio, e inmersiones interactivas (Warp Speed + Hologramas SVG temáticos) al abrir proyectos. Todo 100% Vanilla.

## 🧠 Aprendizajes y Contexto
* Se ha prescindido de empaquetadores como Vite debido a las restricciones del entorno local, demostrando que ES Modules y Vanilla CSS pueden estructurar aplicaciones modernas nativamente.
* Se ha demostrado que es posible generar una experiencia audiovisual completa usando `AudioContext` nativo sin necesidad de cargar assets pesados de sonido (`.mp3`).
* Metodología de componentes estrictos: Para cada bloque importante se redacta primero una "Spec" y se documenta como una "Skill" reutilizable.
* Skills activas en `.agent/skills/`: testeo_local, animaciones_premium, crear_navbar_cinematica, crear_hero_cinematico, crear_terminal_interactiva, crear_texto_desencriptado, crear_monitor_sistemas, crear_sonidos_sinteticos.
* Se implementó un IntersectionObserver para revelar elementos al hacer scroll para un rendimiento óptimo.
