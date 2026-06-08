# Spec: Componente Terminal Interactiva

## Descripción
Convertir el bloque estático del Hero en un mini-intérprete de comandos (CLI) funcional basado en Vanilla JS.

## Estructura HTML
* Contenedor con historial de salida (`div.t-history`).
* Línea actual de entrada activa: contiene el prompt estático y un `<span contenteditable="true" spellcheck="false" class="t-input"></span>`.
* El `contenteditable` debe atrapar el evento `keydown` (Enter para ejecutar).

## Lógica JS
* Mantener siempre el foco en el input al hacer clic en cualquier parte de la terminal.
* Comandos soportados:
  * `help`: Lista de comandos.
  * `whoami`: Imprime el perfil.
  * `ls`: Lista proyectos.
  * `clear`: Borra el historial.
  * `hire` / `sudo hire`: Muestra el email con estilo hacker.
  * Cualquier otro: `Command not found`.
* Auto-scroll al fondo de la terminal tras ejecutar.
