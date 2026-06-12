// ==========================================
// 1. SOUNDSCAPE API (WEB AUDIO)
// ==========================================
class UISound {
  constructor() {
    this.enabled = true; // Activado por defecto visualmente
    this.ctx = null;

    // Auto-iniciar AudioContext en la primera interacción para cumplir políticas del navegador
    const initAudio = () => {
      this.init();
      document.removeEventListener('click', initAudio);
      document.removeEventListener('keydown', initAudio);
    };
    document.addEventListener('click', initAudio);
    document.addEventListener('keydown', initAudio);
  }
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => { });
    }
  }
  toggle() {
    this.enabled = !this.enabled;
    if (this.enabled) this.init();
    return this.enabled;
  }
  playHover() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx || this.ctx.state === 'suspended') return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.5, this.ctx.currentTime + 0.01); // Subido a 50% volumen
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.06);
  }
  playKeystroke() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx || this.ctx.state === 'suspended') return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, this.ctx.currentTime);

    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.4, this.ctx.currentTime + 0.01); // Subido a 40% volumen
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }
  playBoot() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx || this.ctx.state === 'suspended') return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(50, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(80, this.ctx.currentTime + 1.0);

    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.6, this.ctx.currentTime + 0.3); // Subido a 60% volumen
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 1.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 1.3);
  }
}
const sfx = new UISound();

// ==========================================
// 2. BOOT SEQUENCE
// ==========================================
function initBootSequence() {
  const bootContainer = document.getElementById('boot-sequence');
  const bootLogs = document.getElementById('boot-logs');
  if (!bootContainer || !bootLogs) return;

  const logs = [
    "[ OK ] Started Kernel Logging Service.",
    "[ OK ] Reached target Basic System.",
    "[ OK ] Found device /dev/nvme0n1p1.",
    "[ OK ] Mounting /boot/efi...",
    "[ OK ] Started D-Bus System Message Bus.",
    "Starting User Manager for UID 1000...",
    "[ OK ] Started User Manager for UID 1000.",
    "Mounting Antigravity Engine...",
    "[ OK ] Loaded 75k€ Sysadmin Features.",
    "Starting display manager..."
  ];

  let delay = 0;
  logs.forEach((log, index) => {
    setTimeout(() => {
      const p = document.createElement('p');
      p.textContent = log;
      bootLogs.appendChild(p);
      bootLogs.scrollTop = bootLogs.scrollHeight;
      sfx.playKeystroke();

      if (index === logs.length - 1) {
        setTimeout(() => {
          bootContainer.classList.add('hide');
          setTimeout(() => bootContainer.remove(), 600);
        }, 300);
      }
    }, delay);
    delay += Math.floor(Math.random() * 80) + 30;
  });
}

// ==========================================
// 3. SYSADMIN HUD
// ==========================================
function initHUD() {
  const cpuEl = document.getElementById('hud-cpu');
  const netEl = document.getElementById('hud-net');
  const upEl = document.getElementById('hud-up');
  const canvas = document.getElementById('hud-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const history = Array(40).fill(10);
  let startTime = Date.now();

  const soundBtn = document.getElementById('btn-sound');
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      const isOn = sfx.toggle();
      soundBtn.textContent = `[ AUDIO: ${isOn ? 'ON' : 'OFF'} ]`;
      if (isOn) {
        soundBtn.classList.remove('off');
        sfx.playBoot();
      } else {
        soundBtn.classList.add('off');
      }
    });
  }

  setInterval(() => {
    // Generar datos suavizados
    let last = history[history.length - 1];
    let val = Math.max(2, Math.min(98, last + (Math.random() - 0.5) * 30));
    history.shift();
    history.push(val);

    cpuEl.innerText = val.toFixed(1);
    netEl.innerText = (Math.random() * 200 + 10).toFixed(1);

    // Uptime
    let diff = Math.floor((Date.now() - startTime) / 1000);
    let h = String(Math.floor(diff / 3600)).padStart(2, '0');
    let m = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
    let s = String(diff % 60).padStart(2, '0');
    let uptimeStr = `${h}:${m}:${s}`;
    upEl.innerText = uptimeStr;

    // Live update para neofetch si existe
    document.querySelectorAll('.nf-live-uptime').forEach(el => el.innerText = uptimeStr);

    // Draw Chart
    ctx.clearRect(0, 0, 200, 40);
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(0, 255, 136, 0.6)';
    ctx.lineWidth = 1.5;
    history.forEach((v, i) => {
      let x = (i / 40) * 200;
      let y = 40 - (v / 100 * 40);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Fill under line
    ctx.lineTo(200, 40);
    ctx.lineTo(0, 40);
    ctx.fillStyle = 'rgba(0, 255, 136, 0.1)';
    ctx.fill();
  }, 250);
}

// ==========================================
// 4. TERMINAL INTERACTIVA
// ==========================================
function initInteractiveTerminal() {
  const input = document.getElementById('cmd-input');
  const historyBox = document.getElementById('cmd-history');
  if (!input || !historyBox) return;

  // ------------------------------------------
  // VIRTUAL FILE SYSTEM (vFS)
  // ------------------------------------------
  const VFS = {
    "chromebook": {
      "leeme.txt": "Proyecto: Resurrecci\u00f3n del Chromebook N22\n\nTransform\u00e9 un Lenovo N22 con ChromeOS obsoleto en una m\u00e1quina\ndual-boot con Windows 11 Pro y Arch Linux + Hyprland.\n\nEl reto: disco eMMC soldado de solo 30 GB.\nSoluci\u00f3n: particionado quir\u00fargico, desbloqueo de firmware y drivers\nde audio y teclado espec\u00edficos para Celeron."
    },
    "endeavouros": {
      "info.txt": "Proyecto: Instalaci\u00f3n y Configuraci\u00f3n de EndeavourOS\n\nPr\u00e1ctica de instalaci\u00f3n del m\u00f3dulo SOM (1\u00ba SMR).\nEleg\u00ed EndeavourOS \u2014 Arch-based con instalador gr\u00e1fico \u2014 para profundizar\nm\u00e1s all\u00e1 del temario. Instalada en hardware real: Intel i5-7500, 8GB RAM.",
      "notas.md": "## Por qu\u00e9 EndeavourOS\n\nArch puro requiere instalaci\u00f3n desde TTY.\nEndeavour mantiene esa filosof\u00eda con instalador gr\u00e1fico:\nideal para entender el sistema real sin perderse en el particionado."
    },
    "instalador-arch": {
      "instalador.sh": "#!/bin/bash\n# Instalador Autom\u00e1tico de Arch Linux v3.x\n# Autor: aitorino2009 | GitHub: https://github.com/aitorino2009\n# Licencia: MIT\nset -euo pipefail\n\necho '=== Arch Linux Auto-Installer ==='",
      "readme.md": "::url::https://github.com/aitorino2009/Instalador-Arch-Linux#readme",
      "cifrado.conf": "# Configuraci\u00f3n LUKS2\n# Cifrado: aes-xts-plain64\n# Tama\u00f1o de clave: 512 bits\n# Hash: sha256\n# Tiempo de iteraci\u00f3n: 2000ms"
    },
    "github": {
      "enlaces.txt": "Perfil de GitHub:\n\ud83d\udc49 https://github.com/aitorino2009\n\nRepositorios destacados:\n  - instalador-arch  (Script Bash producci\u00f3n)\n  - aitorino2009.github.io  (Este portfolio)"
    },
    "acerca.txt": "¡Hola! Soy Aitor. Tengo 16 años y curso un CFGM de SMR.\nEstudio esto porque me encanta y dedico mi tiempo libre a aprender sobre GNU/Linux, Bash y desarrollo web (Vanilla).\nVivo en Mallorca 📍 y busco mi primer trabajo para seguir aprendiendo en un entorno real."
  };

  // Mapa: nombre de carpeta \u2192 ID de proyecto en el DOM
  const VFS_PROJECT_MAP = {
    'chromebook': 'p1',
    'endeavouros': 'p2',
    'instalador-arch': 'p3'
  };

  let currentPath = []; // [] === '~'

  const getPromptHTML = () => {
    const pathStr = currentPath.length === 0 ? '~' : '~/' + currentPath.join('/');
    return `<span class="t-user">aitor</span><span class="t-at">@</span><span class="t-host">portfolio</span><span class="t-path">:${pathStr}$</span> `;
  };

  const resolvePath = (targetStr) => {
    if (!targetStr || targetStr === '.') return { node: VFS, isDir: true, error: null, resolvedPath: currentPath };
    let tempPath = [...currentPath];
    if (targetStr.startsWith('/')) tempPath = [];
    if (targetStr.startsWith('~')) {
      tempPath = [];
      targetStr = targetStr.substring(1);
      if (targetStr.startsWith('/')) targetStr = targetStr.substring(1);
    }

    const parts = targetStr.split('/').filter(p => p !== '' && p !== '.');
    let currentNode = VFS;
    for (let p of tempPath) currentNode = currentNode[p];

    for (let part of parts) {
      if (part === '..') {
        if (tempPath.length > 0) {
          tempPath.pop();
          currentNode = VFS;
          for (let p of tempPath) currentNode = currentNode[p];
        }
      } else {
        if (typeof currentNode === 'object' && currentNode !== null && part in currentNode) {
          currentNode = currentNode[part];
          tempPath.push(part);
        } else {
          return { error: `No such file or directory` };
        }
      }
    }
    return { node: currentNode, isDir: typeof currentNode === 'object', resolvedPath: tempPath, error: null };
  };

  // ------------------------------------------
  // ESTADO Y NAVEGACIÓN
  // ------------------------------------------
  const cmdHistory = [];
  let historyIndex = -1;
  const BASE_COMMANDS = ['help', 'clear', 'whoami', 'ls', 'cd', 'cat', 'skills', 'hire', 'sudo', 'neofetch'];

  const moveCursorToEnd = (el) => {
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(el);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
  };

  input.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'l') {
      e.preventDefault();
      historyBox.innerHTML = '';
      const promptDiv = input.closest('.terminal-prompt');
      if (promptDiv) promptDiv.classList.add('terminal-pristine');
      return;
    }

    // Autocompletado (Tab) Avanzado
    if (e.key === 'Tab') {
      e.preventDefault();
      const currentText = input.innerText.toLowerCase();
      if (!currentText.trim()) return;

      const parts = currentText.split(' ');
      let matches = [];
      let prefixToReplace = '';

      if (parts.length === 1) {
        matches = BASE_COMMANDS.filter(cmd => cmd.startsWith(parts[0]));
        prefixToReplace = parts[0];
      } else {
        const cmd = parts[0];
        if (['cd', 'cat', 'ls'].includes(cmd)) {
          const target = parts[parts.length - 1];
          const lastSlash = target.lastIndexOf('/');
          const baseDirStr = lastSlash !== -1 ? target.substring(0, lastSlash) : '';
          const searchPrefix = lastSlash !== -1 ? target.substring(lastSlash + 1) : target;

          const res = resolvePath(baseDirStr);
          if (!res.error && res.isDir) {
            matches = Object.keys(res.node).filter(k => k.startsWith(searchPrefix));
            // Añadir '/' si es carpeta para hacer la experiencia más real
            matches = matches.map(m => typeof res.node[m] === 'object' ? m + '/' : m);
            prefixToReplace = searchPrefix;
          }
        }
      }

      if (matches.length === 1) {
        const completion = matches[0].substring(prefixToReplace.length);
        input.innerText += completion;
        moveCursorToEnd(input);
      } else if (matches.length > 1) {
        historyBox.innerHTML += `<div class="t-line">${getPromptHTML()}<span class="t-cmd">${currentText}</span></div>`;
        historyBox.innerHTML += `<div class="out" style="color: var(--cyan)">${matches.join('   ')}</div>`;
        historyBox.scrollTop = historyBox.scrollHeight;
      }
      return;
    }

    // Historial
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      if (historyIndex === -1) historyIndex = cmdHistory.length - 1;
      else if (historyIndex > 0) historyIndex--;
      input.innerText = cmdHistory[historyIndex];
      moveCursorToEnd(input);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        if (historyIndex < cmdHistory.length - 1) {
          historyIndex++;
          input.innerText = cmdHistory[historyIndex];
          moveCursorToEnd(input);
        } else {
          historyIndex = -1;
          input.innerText = '';
        }
      }
      return;
    }

    sfx.playKeystroke();
    if (e.key === 'Enter') {
      e.preventDefault();
      let cmd = input.innerText.trim();

      const promptDiv = input.closest('.terminal-prompt');
      const isPristine = promptDiv ? promptDiv.classList.contains('terminal-pristine') : false;

      if (cmd === '') {
        if (isPristine) {
          cmd = 'help';
        } else {
          historyBox.innerHTML += `<div class="t-line">${getPromptHTML()}<span class="t-cmd"></span></div>`;
          input.innerText = '';
          historyBox.scrollTop = historyBox.scrollHeight;
          return;
        }
      } else {
        if (cmdHistory[cmdHistory.length - 1] !== cmd) cmdHistory.push(cmd);
        historyIndex = -1;
      }

      if (promptDiv) promptDiv.classList.remove('terminal-pristine');

      historyBox.innerHTML += `<div class="t-line">${getPromptHTML()}<span class="t-cmd">${cmd}</span></div>`;

      const args = cmd.split(' ').filter(a => a !== '');
      const command = args[0].toLowerCase();

      if (command === 'help') {
        historyBox.innerHTML += `<div class="out">Comandos disponibles:<br>  whoami    - Ver perfil<br>  ls [dir]  - Listar archivos<br>  tree [dir]- Árbol de directorios<br>  cd [dir]  - Navegar<br>  cat [archivo]- Leer archivo<br>  skills    - Listar tecnologías<br>  neofetch  - Info sistema<br>  clear     - Limpiar<br>  hire      - Contactar</div>`;
      } else if (command === 'clear') {
        historyBox.innerHTML = '';
        if (promptDiv) promptDiv.classList.add('terminal-pristine');
      } else if (command === 'whoami') {
        historyBox.innerHTML += `<div class="out">Aitor Portales Crespí. 16 años.<br>Cursando 1º de SMR (Sistemas Microinformáticos y Redes).<br>Disfruto aprendiendo administración GNU/Linux, scripting y desarrollo web Vanilla.</div>`;
      } else if (command === 'neofetch') {
        const res = `${window.innerWidth}x${window.innerHeight}`;
        const upEl = document.getElementById('hud-up');
        const up = upEl ? upEl.innerText : '00:00:00';
        historyBox.innerHTML += `
<div class="out" style="display: flex; gap: 1.5rem; align-items: flex-start; margin-top: 10px; margin-bottom: 10px;">
  <div style="color: var(--cyan); white-space: pre; line-height: 1.1; font-weight: bold; font-size: 0.85rem; text-shadow: 0 0 5px var(--cyan);">
       /\\
      /  \\
     /    \\
    /      \\
   /   ,,   \\
  /   |  |   \\
 /_-''    ''-_\\
  </div>
  <div style="font-size: 0.75rem; line-height: 1.4;">
    <span style="color: var(--cyan); font-weight: bold;">aitor</span>@<span style="color: var(--cyan); font-weight: bold;">portfolio</span><br>
    -------------------------<br>
    <span style="color: var(--cyan); font-weight: bold;">OS:</span> AitorOS v2.4.1 (Web)<br>
    <span style="color: var(--cyan); font-weight: bold;">Host:</span> Portfolio Sysadmin<br>
    <span style="color: var(--cyan); font-weight: bold;">Kernel:</span> JS-Vanilla-vFS-1.0<br>
    <span style="color: var(--cyan); font-weight: bold;">Uptime:</span> <span class="nf-live-uptime">${up}</span><br>
    <span style="color: var(--cyan); font-weight: bold;">Shell:</span> bash-sim<br>
    <span style="color: var(--cyan); font-weight: bold;">Resolution:</span> <span class="nf-live-res">${res}</span><br>
    <span style="color: var(--cyan); font-weight: bold;">DE:</span> CSS3 + HTML5<br>
    <span style="color: var(--cyan); font-weight: bold;">Terminal:</span> tty1-browser<br>
    <br>
    <span style="display:inline-block; width:12px; height:12px; background:#111418;"></span>
    <span style="display:inline-block; width:12px; height:12px; background:#ff4400;"></span>
    <span style="display:inline-block; width:12px; height:12px; background:#00ff9d;"></span>
    <span style="display:inline-block; width:12px; height:12px; background:#ffcc00;"></span>
    <span style="display:inline-block; width:12px; height:12px; background:#00e5ff;"></span>
    <span style="display:inline-block; width:12px; height:12px; background:#9d00ff;"></span>
    <span style="display:inline-block; width:12px; height:12px; background:#00d4ff;"></span>
    <span style="display:inline-block; width:12px; height:12px; background:#f0f5fa;"></span>
  </div>
</div>`;
      } else if (command === 'ls') {
        const target = args[1] || '.';
        const res = resolvePath(target);
        if (res.error) historyBox.innerHTML += `<div class="out">ls: ${target}: ${res.error}</div>`;
        else if (!res.isDir) historyBox.innerHTML += `<div class="out">${target}</div>`;
        else {
          const keys = Object.keys(res.node);
          if (keys.length > 0) {
            const formatted = keys.map(k => typeof res.node[k] === 'object' ? `<span style="color:var(--cyan); font-weight:bold">${k}/</span>` : k).join('   ');
            historyBox.innerHTML += `<div class="out">${formatted}</div>`;
          }
        }
      } else if (command === 'cd') {
        const target = args[1] || '~';
        const res = resolvePath(target);
        if (res.error) historyBox.innerHTML += `<div class="out">cd: ${target}: ${res.error}</div>`;
        else if (!res.isDir) historyBox.innerHTML += `<div class="out">cd: ${target}: Not a directory</div>`;
        else {
          currentPath = res.resolvedPath;
          const promptSpan = input.parentElement.querySelector('.t-path');
          if (promptSpan) {
            const pathStr = currentPath.length === 0 ? '~' : '~/' + currentPath.join('/');
            promptSpan.innerText = `:${pathStr}$`;
          }
          // Si la carpeta es un proyecto, hacer scroll y abrir el acordeón
          const topFolder = res.resolvedPath[0];
          const projectId = topFolder ? VFS_PROJECT_MAP[topFolder] : null;
          if (projectId && window.toggleProject) {
            historyBox.innerHTML += `<div class="out" style="color:var(--cyan)">→ Abriendo proyecto en pantalla...</div>`;
            historyBox.scrollTop = historyBox.scrollHeight;
            setTimeout(() => {
              const projectEl = document.getElementById(projectId);
              if (projectEl) {
                // Primero abrimos la tarjeta (y se desencadena el warp effect)
                window.toggleProject(projectId);
                // Una vez que empieza a abrirse, hacemos el scroll suave calculando la posición exacta
                setTimeout(() => {
                  const yOffset = -120; // Espacio para la navbar (80px) + margen
                  const y = projectEl.getBoundingClientRect().top + window.scrollY + yOffset;
                  window.scrollTo({ top: y, behavior: 'smooth' });
                }, 300);
              }
            }, 150);
          }
        }
      } else if (command === 'cat') {
        const target = args[1];
        if (!target) historyBox.innerHTML += `<div class="out">cat: missing operand</div>`;
        else {
          const res = resolvePath(target);
          if (res.error) historyBox.innerHTML += `<div class="out">cat: ${target}: ${res.error}</div>`;
          else if (res.isDir) historyBox.innerHTML += `<div class="out">cat: ${target}: Is a directory</div>`;
          else if (typeof res.node === 'string' && res.node.startsWith('::url::')) {
            const url = res.node.replace('::url::', '');
            historyBox.innerHTML += `<div class="out" style="color:var(--cyan)">→ Abriendo documentación en GitHub...<br><a href="${url}" target="_blank" style="color:var(--green)">${url}</a></div>`;
            setTimeout(() => window.open(url, '_blank'), 400);
          } else {
            historyBox.innerHTML += `<div class="out" style="white-space: pre-wrap; font-family: monospace;">${res.node}</div>`;
          }
        }
      } else if (command === 'tree') {
        const target = args[1] || '.';
        const res = resolvePath(target);
        if (res.error) {
          historyBox.innerHTML += `<div class="out">tree: ${target}: ${res.error}</div>`;
        } else if (!res.isDir) {
          historyBox.innerHTML += `<div class="out">${target}</div>`;
        } else {
          const buildTree = (node, prefix = '') => {
            const keys = Object.keys(node);
            let out = '';
            keys.forEach((k, i) => {
              const isLast = i === keys.length - 1;
              const connector = isLast ? '└── ' : '├── ';
              const childPrefix = prefix + (isLast ? '    ' : '│   ');
              if (typeof node[k] === 'object') {
                out += `${prefix}${connector}<span style="color:var(--cyan);font-weight:bold">${k}/</span>\n`;
                out += buildTree(node[k], childPrefix);
              } else {
                out += `${prefix}${connector}${k}\n`;
              }
            });
            return out;
          };
          const dirName = res.resolvedPath.length > 0 ? res.resolvedPath[res.resolvedPath.length - 1] + '/' : '~/';
          historyBox.innerHTML += `<div class="out" style="white-space:pre;font-family:monospace"><span style="color:var(--cyan);font-weight:bold">${dirName}</span>\n${buildTree(res.node)}</div>`;
        }
      } else if (command === 'skills') {
        historyBox.innerHTML += `<div class="out">Linux, Bash, Redes, Arch, Windows Server, Python, Git, HTML/CSS/JS</div>`;
      } else if (command === 'hire' || command === 'sudo') {
        historyBox.innerHTML += `<div class="out" style="color: var(--green)">Iniciando protocolo de contratación...<br>Email: <a href="#contact" style="color:var(--green)">[Haga clic aquí o baje a Contacto]</a></div>`;
      } else {
        historyBox.innerHTML += `<div class="out">bash: ${command}: command not found</div>`;
      }

      input.innerText = '';
      historyBox.scrollTop = historyBox.scrollHeight;
    }
  });

  window.addEventListener('resize', () => {
    const liveRes = `${window.innerWidth}x${window.innerHeight}`;
    document.querySelectorAll('.nf-live-res').forEach(el => el.innerText = liveRes);
  }, { passive: true });
}

// ==========================================
// 5. SCRAMBLE TEXT EFFECT
// ==========================================
class TextScramble {
  // speed: multiplicador de velocidad. 1 = normal (hero), 3 = rápido (scroll)
  constructor(el, speed = 1) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}=+*^?#';
    this.speed = speed;
    this.update = this.update.bind(this);
  }
  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => this.resolve = resolve);
    this.queue = [];
    const maxStart = Math.floor(40 / this.speed);
    const maxExtra = Math.floor(40 / this.speed);
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * maxStart);
      const end = start + Math.floor(Math.random() * maxExtra);
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }
  update() {
    let output = '';
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.chars[Math.floor(Math.random() * this.chars.length)];
          this.queue[i].char = char;
        }
        output += `<span class="scramble-dud">${char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) this.resolve();
    else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
}

function initScramble() {
  const elements = [...document.querySelectorAll('.scramble')];
  if (!elements.length) return;

  function isInViewport(el) {
    const rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  }

  function triggerScramble(el) {
    if (el.dataset.scrambling === 'true') return;
    el.dataset.scrambling = 'true';
    const text = el.dataset.scrambleText || el.innerText;
    // speed = 3 para animación rápida y snappy en scroll
    const scrambler = new TextScramble(el, 3);
    scrambler.setText(text).then(() => {
      el.dataset.scrambling = 'false';
    });
  }

  // Disparar en cada evento scroll (throttle a 120ms para no saturar)
  let scrollTimer = null;
  window.addEventListener('scroll', () => {
    if (scrollTimer) return;
    scrollTimer = setTimeout(() => {
      scrollTimer = null;
      elements.forEach(el => {
        if (isInViewport(el)) triggerScramble(el);
      });
    }, 120);
  }, { passive: true });
}

function initScrambleHero() {
  const el = document.querySelector('.scramble-hero');
  if (!el) return;
  // Asegurarse de que el elemento sea visible antes de animar
  el.style.opacity = '1';
  const text = el.dataset.scrambleText || el.innerText;
  // speed = 1 (normal) para el hero: animación completa y cinematográfica
  const scrambler = new TextScramble(el, 1);
  scrambler.setText(text);
}

// ==========================================
// 6. CUSTOM CURSOR & TILT
// ==========================================
function initCustomCursor() {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX, ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX; mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  function renderCursor() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  document.querySelectorAll('a, button, .project-top, .btn, .terminal-prompt').forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.classList.add('hovered');
      sfx.playHover();
    });
    el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
  });
}

function initTiltEffect() {
  document.querySelectorAll('.project').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -4;
      const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 4;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
  });
}

// ==========================================
// 7. CANVAS BACKGROUND & SCROLL REVEAL
// ==========================================
function initCanvasBackground() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height, particles = [];

  function resize() { width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight; }
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.x = Math.random() * width; this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.5; this.vy = (Math.random() - 0.5) * 0.5;
      this.size = Math.random() * 1.5;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }
    draw() {
      ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 255, 136, 0.4)'; ctx.fill();
    }
  }

  for (let i = 0; i < 40; i++) particles.push(new Particle());
  let mouse = { x: null, y: null };
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update(); particles[i].draw();
      for (let j = i; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath(); ctx.strokeStyle = `rgba(0, 255, 136, ${0.1 - dist / 1500})`;
          ctx.lineWidth = 0.5; ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y); ctx.stroke();
        }
      }
      if (mouse.x != null) {
        const dx = mouse.x - particles[i].x, dy = mouse.y - particles[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          ctx.beginPath(); ctx.strokeStyle = `rgba(0, 212, 255, ${0.2 - dist / 1000})`;
          ctx.lineWidth = 1; ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
}

function initScrollAnimations() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        obs.unobserve(entry.target);
      }
    });
  }, { root: null, rootMargin: '0px', threshold: 0.15 });
  reveals.forEach(el => observer.observe(el));
}

function initProjects() {
  const container = document.getElementById('project-holograms');
  const svgs = {
    p1: [
      `<svg viewBox="0 0 100 100" class="hologram-icon holo-1"><path d="M0 15 L45 8 L45 48 L0 48 Z M50 7 L100 0 L100 48 L50 48 Z M0 52 L45 52 L45 92 L0 85 Z M50 52 L100 52 L100 100 L50 93 Z"/></svg>`,
      `<svg viewBox="0 0 100 100" class="hologram-icon holo-2"><path d="M50 5 L95 95 L75 95 L50 45 L25 95 L5 95 Z M40 80 L60 80 L50 60 Z"/></svg>`
    ],
    p2: [
      `<svg viewBox="0 0 100 100" class="hologram-icon holo-1"><path d="M50 5 L95 95 L75 95 L50 45 L25 95 L5 95 Z M40 80 L60 80 L50 60 Z"/></svg>`,
      `<svg viewBox="0 0 100 100" class="hologram-icon holo-2"><path d="M10 10 L90 10 L90 40 L10 40 Z M20 20 L30 20 L30 30 L20 30 Z M40 20 L50 20 L50 30 L40 30 Z M10 60 L90 60 L90 90 L10 90 Z M20 70 L30 70 L30 80 L20 80 Z M40 70 L50 70 L50 80 L40 80 Z"/></svg>`
    ],
    p3: [
      `<svg viewBox="0 0 100 100" class="hologram-icon holo-1"><path d="M10 20 L40 50 L10 80 L20 90 L60 50 L20 10 Z M50 80 L90 80 L90 95 L50 95 Z"/></svg>`,
      `<svg viewBox="0 0 100 100" class="hologram-icon holo-2"><path d="M30 40 L30 25 C30 10 70 10 70 25 L70 40 L80 40 L80 95 L20 95 L20 40 Z M40 40 L60 40 L60 25 C60 15 40 15 40 25 Z"/></svg>`,
      `<svg viewBox="0 0 100 100" class="hologram-icon holo-3"><path d="M50 5 L95 95 L75 95 L50 45 L25 95 L5 95 Z M40 80 L60 80 L50 60 Z"/></svg>`
    ]
  };

  window.toggleProject = function (id) {
    const el = document.getElementById(id);
    if (!el) return;

    const isOpen = el.classList.contains('open');

    // Modo Acordeón: Cerrar todos los demás
    document.querySelectorAll('.project').forEach(p => p.classList.remove('open'));

    if (!isOpen) {
      el.classList.add('open');
      if (window.triggerWarp) window.triggerWarp();

      // Mostrar SVGs Holográficos
      if (container) {
        container.innerHTML = (svgs[id] || []).join('');
        // Pequeño delay para que el warp empiece antes
        setTimeout(() => container.classList.add('active'), 200);
      }
    } else {
      if (container) {
        container.classList.remove('active');
        setTimeout(() => container.innerHTML = '', 1500);
      }
    }
  };
}

// ==========================================
// 8. 3D GRID SCROLL ANIMATION
// ==========================================
let warpSpeed = 0;
let warpMultiplier = 0.8;

function init3DGridScroll() {
  const grid = document.getElementById('grid-3d');
  if (!grid) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    grid.style.backgroundPositionY = `${scrolled * 0.8 + warpSpeed}px`;
  }, { passive: true });

  // Bucle de renderizado para el efecto Warp
  function renderWarp() {
    if (warpMultiplier > 0.8) {
      warpSpeed += warpMultiplier * 8; // Velocidad de avance
      warpMultiplier *= 0.94; // Fricción suave
      if (warpMultiplier < 0.81) warpMultiplier = 0.8;

      const scrolled = window.scrollY;
      grid.style.backgroundPositionY = `${scrolled * 0.8 + warpSpeed}px`;
      requestAnimationFrame(renderWarp);
    }
  }

  window.triggerWarp = function () {
    warpMultiplier = 15; // Aceleración masiva inicial
    renderWarp();
  };
}

// ==========================================
// INICIALIZACIÓN PRINCIPAL
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.overflow = 'hidden';
  setTimeout(() => document.body.style.overflow = '', 1000);

  initBootSequence();
  initHUD();
  initInteractiveTerminal();
  initScramble();
  initScrambleHero();
  initCustomCursor();
  initCanvasBackground();
  initTiltEffect();
  initScrollAnimations();
  initProjects();
  init3DGridScroll();
});
