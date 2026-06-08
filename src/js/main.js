// Función para el efecto de escritura en la terminal
function initTypewriter() {
  const tCmd = document.getElementById('typewriter-cmd');
  const tCursor = document.getElementById('typewriter-cursor');
  
  if (!tCmd || !tCursor) return;
  
  const textToType = "whoami";
  let i = 0;
  
  // Limpiar antes de empezar
  tCmd.textContent = " ";
  
  setTimeout(() => {
    function typeWriter() {
      if (i < textToType.length) {
        tCmd.textContent += textToType.charAt(i);
        i++;
        setTimeout(typeWriter, 120); // Velocidad de escritura
      } else {
        // Al terminar, mostrar la salida después de un breve delay
        setTimeout(() => {
          document.querySelectorAll('.t-hidden').forEach(el => {
            el.style.display = 'block';
            el.classList.add('fade-in');
          });
        }, 400);
      }
    }
    typeWriter();
  }, 1000); // Esperar 1s al cargar la página
}

// Función para revelar elementos al hacer scroll
function initScrollAnimations() {
  const reveals = document.querySelectorAll('.reveal');
  
  if (!reveals.length) return;
  
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15 // 15% del elemento visible para activar
  };
  
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        obs.unobserve(entry.target); // Dejar de observar una vez que ya apareció
      }
    });
  }, observerOptions);
  
  reveals.forEach(el => observer.observe(el));
}

// Función para manejar el colapso/expansión de proyectos
function initProjects() {
  window.toggleProject = function(id) {
    const el = document.getElementById(id);
    if (el) {
      el.classList.toggle('open');
    }
  };
}

// Inicializar todo cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  initTypewriter();
  initScrollAnimations();
  initProjects();
});
