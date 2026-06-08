---
name: crear_terminal_interactiva
description: Receta para construir un emulador de terminal real en la web
---

# Skill: Terminal Interactiva en JS

## Base HTML
```html
<div class="terminal" onclick="document.getElementById('cmd-input').focus()">
  <div id="history"></div>
  <div class="input-line">
    <span class="prompt">user@host:~$ </span>
    <span id="cmd-input" contenteditable="true" spellcheck="false"></span>
  </div>
</div>
```

## CSS Clave
```css
#cmd-input { outline: none; border: none; font-family: monospace; color: white; display: inline-block; min-width: 10px; }
#cmd-input:empty::before { content: ' '; }
```

## Lógica JS
```javascript
const input = document.getElementById('cmd-input');
const history = document.getElementById('history');

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault(); // Evitar saltos de línea
    const cmd = input.innerText.trim();
    
    // Imprimir comando en el historial
    history.innerHTML += `<div><span class="prompt">user@host:~$ </span>${cmd}</div>`;
    
    // Procesar
    if (cmd === 'help') history.innerHTML += `<div class="out">Comandos: help, clear</div>`;
    else if (cmd === 'clear') history.innerHTML = '';
    else if (cmd !== '') history.innerHTML += `<div class="out">${cmd}: command not found</div>`;
    
    input.innerText = '';
  }
});
```
