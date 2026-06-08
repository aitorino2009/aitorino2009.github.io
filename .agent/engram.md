# Memoria a Largo Plazo (Engram)

Este archivo contiene la memoria del agente, reglas innegociables, aprendizajes y el estado actual del proyecto para asegurar la continuidad entre sesiones.

## 📌 Estado Actual del Proyecto
* **Proyecto:** Web personal (`aitorino2009.github.io`).
* **Hito Actual:** Refactorización completada y desvinculada de NPM. Arquitectura puramente Vanilla, lista para GitHub Pages sin bundler.

## 📏 Reglas y Decisiones de Diseño
* **Idioma:** Castellano (español) para interacciones y nombres de archivos de agente.
* **Tecnologías:** HTML Semántico, Vanilla CSS (modularizado en `src/css/`), Vanilla JS (modularizado en `src/js/` usando ESM nativo). **Cero dependencias externas (NPM).**
* **Diseño UI:** Temática "Terminal/Hacker" nivel premium (Glassmorphism, animaciones fluidas `cubic-bezier`, fondo dinámico sutil).

## 🧠 Aprendizajes y Contexto
* Se ha prescindido de empaquetadores como Vite debido a las restricciones del entorno local, demostrando que ES Modules y Vanilla CSS pueden estructurar aplicaciones modernas nativamente.
* Se implementó un IntersectionObserver para revelar elementos al hacer scroll para un rendimiento óptimo.
