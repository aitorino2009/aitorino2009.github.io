# Spec: Componente Navbar Cinematográfica

## Descripción
Una barra de navegación estilo "píldora flotante" (Floating Pill), con un diseño inspirado en HUDs de ciencia ficción (sci-fi).

## Estructura HTML
Se utilizará un contenedor `<nav>` centralizado, sin ocupar el 100% del ancho (max-width limitado), separado del borde superior por un margen.

## Estilos CSS
*   **Fondo:** `rgba(10, 12, 15, 0.4)` con un desenfoque alto (`backdrop-filter: blur(24px)`).
*   **Bordes:** Borde semitransparente general y una sombra paralela pronunciada.
*   **Logo Glitch:** Al pasar el ratón, el nombre de usuario tendrá un efecto de sombra neón y separación de canales RGB rápida usando keyframes.
*   **Enlaces Escáner:** Los enlaces no tendrán un subrayado estático, sino una línea superior brillante que se mueve o crece desde el centro con un efecto de sombra cian (`box-shadow`).
