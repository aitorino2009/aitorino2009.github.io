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
      this.ctx.resume().catch(() => {});
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
    upEl.innerText = `${h}:${m}:${s}`;
    
    // Draw Chart
    ctx.clearRect(0,0,200,40);
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(0, 255, 136, 0.6)';
    ctx.lineWidth = 1.5;
    history.forEach((v, i) => {
      let x = (i / 40) * 200;
      let y = 40 - (v / 100 * 40);
      if(i===0) ctx.moveTo(x, y);
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

  const promptHTML = `<span class="t-user">aitor</span><span class="t-at">@</span><span class="t-host">portfolio</span><span class="t-path">:~$</span> `;

  input.addEventListener('keydown', (e) => {
    // Ctrl+L = limpiar terminal (como en cualquier shell real)
    if (e.ctrlKey && e.key === 'l') {
      e.preventDefault();
      historyBox.innerHTML = '';
      const promptDiv = input.closest('.terminal-prompt');
      if (promptDiv) promptDiv.classList.add('terminal-pristine');
      return;
    }

    sfx.playKeystroke();
    if (e.key === 'Enter') {
      e.preventDefault();
      let cmd = input.innerText.trim();
      
      // Si el usuario pulsa Enter en blanco, ejecutamos el placeholder (help)
      if (cmd === '') {
        cmd = 'help';
      }

      // Quitamos la clase pristine para que no vuelva a salir el placeholder en los siguientes comandos
      const promptDiv = input.closest('.terminal-prompt');
      if (promptDiv) promptDiv.classList.remove('terminal-pristine');

      historyBox.innerHTML += `<div class="t-line">${promptHTML}<span class="t-cmd">${cmd}</span></div>`;
      
      const args = cmd.toLowerCase().split(' ');
      const command = args[0];

      if (command === 'help') {
        historyBox.innerHTML += `<div class="out">Comandos disponibles:<br>  whoami  - Ver perfil<br>  ls      - Listar proyectos<br>  skills  - Listar tecnologías<br>  clear   - Limpiar terminal<br>  hire    - Contactar</div>`;
      } else if (command === 'clear') {
        historyBox.innerHTML = '';
        if (promptDiv) promptDiv.classList.add('terminal-pristine');
      } else if (command === 'whoami') {
        historyBox.innerHTML += `<div class="out">Aitor Portales Crespí.<br>Estudiante de SMR (Sistemas Microinformáticos y Redes).<br>Apasionado por Linux, automatización y desarrollo web.</div>`;
      } else if (command === 'ls') {
        historyBox.innerHTML += `<div class="out" style="color: var(--cyan)">chromebook/   endeavouros/   github/</div>`;
      } else if (command === 'skills') {
        historyBox.innerHTML += `<div class="out">Linux, Bash, Redes, Arch, Windows Server, Python, Git, HTML/CSS/JS</div>`;
      } else if (command === 'hire' || command === 'sudo') {
        historyBox.innerHTML += `<div class="out" style="color: var(--green)">Iniciando protocolo de contratación...<br>Email: <a href="#contact" style="color:var(--green)">[Haga clic aquí o baje a Contacto]</a></div>`;
      } else if (cmd !== '') {
        historyBox.innerHTML += `<div class="out">bash: ${command}: command not found</div>`;
      }
      
      input.innerText = '';
      // Scroll al final del historial
      historyBox.scrollTop = historyBox.scrollHeight;
    }
  });
}

// ==========================================
// 5. SCRAMBLE TEXT EFFECT
// ==========================================
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\\\/[]{}—=+*^?#_';
    this.update = this.update.bind(this);
  }
  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => this.resolve = resolve);
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
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
  const elements = document.querySelectorAll('.scramble');
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.innerText;
        const scrambler = new TextScramble(el);
        scrambler.setText(text);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  elements.forEach(el => observer.observe(el));
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
      const rotateX = ((y - rect.height/2) / (rect.height/2)) * -4;
      const rotateY = ((x - rect.width/2) / (rect.width/2)) * 4;
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
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 150) {
          ctx.beginPath(); ctx.strokeStyle = `rgba(0, 255, 136, ${0.1 - dist/1500})`;
          ctx.lineWidth = 0.5; ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y); ctx.stroke();
        }
      }
      if (mouse.x != null) {
        const dx = mouse.x - particles[i].x, dy = mouse.y - particles[i].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 200) {
          ctx.beginPath(); ctx.strokeStyle = `rgba(0, 212, 255, ${0.2 - dist/1000})`;
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

  window.toggleProject = function(id) {
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
  
  window.triggerWarp = function() {
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
  initCustomCursor();
  initCanvasBackground();
  initTiltEffect();
  initScrollAnimations();
  initProjects();
  init3DGridScroll();
});
