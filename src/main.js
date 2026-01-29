import './style.css'

/* -------------------------------------------------------------------------- */
/*  1. CACHE & CORE VARIABLES                                                 */
/* -------------------------------------------------------------------------- */
const navbar = document.getElementById('navbar');
const heroText = document.querySelector('.hero-content');
const anatomySection = document.getElementById('anatomy');
const anatomyContainer = document.querySelector('.anatomy-container');

let scrolled = window.scrollY;
let winHeight = window.innerHeight;

/* -------------------------------------------------------------------------- */
/*  2. PERFORMANCE LOOP (rAF)                                                 */
/* -------------------------------------------------------------------------- */
function updatePerformanceLoop() {
  scrolled = window.scrollY;

  // Navbar Toggle
  if (scrolled > 50) {
    if (!navbar.classList.contains('scrolled')) {
      navbar.classList.add('scrolled', 'glass');
    }
  } else {
    if (navbar.classList.contains('scrolled')) {
      navbar.classList.remove('scrolled');
    }
  }

  // Hero Parallax (only if visible)
  if (heroText && scrolled < winHeight) {
    const yPos = scrolled * 0.4;
    const opacity = 1 - scrolled / (winHeight * 0.8);
    heroText.style.transform = `translate3d(0, ${yPos}px, 0)`;
    heroText.style.opacity = Math.max(0, opacity);
  }

  // Anatomy Trigger (Simple Check)
  if (anatomySection) {
    const rect = anatomySection.getBoundingClientRect();
    if (rect.top < winHeight * 0.7 && rect.bottom > 200) {
      anatomyContainer.classList.add('anatomy-active');
    } else {
      anatomyContainer.classList.remove('anatomy-active');
    }
  }

  requestAnimationFrame(updatePerformanceLoop);
}

// Start Loop
requestAnimationFrame(updatePerformanceLoop);

// Refresh height on resize
window.addEventListener('resize', () => {
  winHeight = window.innerHeight;
}, { passive: true });


/* -------------------------------------------------------------------------- */
/*  3. OPTIMIZED INTERSECTION OBSERVER                                        */
/* -------------------------------------------------------------------------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('h2, .feature-content p, .tech-card, .tag, .dispatch-card, .mission-card').forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});


/* -------------------------------------------------------------------------- */
/*  4. TACTICAL VIEWER & COLOR SYNC                                           */
/* -------------------------------------------------------------------------- */
const viewer = document.getElementById('main-product-viewer');
const modeBtns = document.querySelectorAll('.mode-btn');
const diagLayers = document.querySelectorAll('.diagnostic-layer');
const diagLabel = document.getElementById('diag-label');
const diagValue = document.getElementById('diag-value');

const diagnosticData = {
  'EXT': { label: 'MISSION: EVEREST (KHUMBU)', value: 'ALTITUDE: 8,848M | O2: 32%' },
  'CORE': { label: 'CHASSIS: CARBON V3 skeleton', value: 'TORSIONAL FLEX: 0.2% @ -40°C' },
  'APEX': { label: 'TRACTION: APEX-GRIP compound', value: 'ICE FRICTION COEFF: 0.98' }
};

modeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.target;

    // Reset UI
    modeBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Trigger Scanner Effect
    viewer.classList.remove('scanning');
    void viewer.offsetWidth; // Force reflow
    viewer.classList.add('scanning');

    // Switch Layers
    diagLayers.forEach(layer => {
      layer.classList.toggle('active', layer.dataset.mode === target);
    });

    // Update Data
    diagLabel.textContent = diagnosticData[target].label;
    diagValue.textContent = diagnosticData[target].value;
  });
});

// Optimized Color Selector affecting all Diagnostic Images
document.querySelectorAll('.swatch').forEach(swatch => {
  swatch.addEventListener('click', () => {
    const color = swatch.dataset.color;
    let hueRotation = '-155deg'; // Volt Green (Blue -> Green/Yellow)
    let saturation = '0.9';

    switch (color) {
      case '#ff4433': hueRotation = '125deg'; saturation = '1.1'; break; // Red Alert
      case '#33aaff': hueRotation = '0deg'; saturation = '1.2'; break; // Blue Alpine
      case '#ffffff': hueRotation = '0deg'; saturation = '0'; break; // Slate White
    }

    // Apply to all layers
    document.querySelectorAll('.diagnostic-layer img').forEach(img => {
      img.style.filter = `hue-rotate(${hueRotation}) saturate(${saturation}) contrast(1.1) brightness(0.9) drop-shadow(0 0 30px ${color}66)`;
    });
  });
});


/* -------------------------------------------------------------------------- */
/*  5. FAQ ACCORDION                                                          */
/* -------------------------------------------------------------------------- */
document.querySelectorAll('.faq-trigger').forEach(trigger => {
  trigger.addEventListener('click', () => {
    const item = trigger.parentElement;
    const isActive = item.classList.contains('active');

    // Close all other items (exclusive mode)
    document.querySelectorAll('.faq-item').forEach(other => {
      if (other !== item) other.classList.remove('active');
    });

    // Toggle current
    item.classList.toggle('active');
  });
});

/* -------------------------------------------------------------------------- */
/*  6. NEWSLETTER SIMULATION                                                 */
/* -------------------------------------------------------------------------- */
const newsletterForm = document.getElementById('summit-form');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = newsletterForm.querySelector('.submit-btn');
    const input = newsletterForm.querySelector('input');

    // Simulate tactial verification
    btn.textContent = 'VERIFYING...';
    btn.style.opacity = '0.7';
    input.disabled = true;

    setTimeout(() => {
      btn.textContent = 'ACCESS GRANTED';
      btn.style.background = 'var(--accent)';
      btn.style.color = '#000';
      btn.style.boxShadow = '0 0 30px var(--accent)';

      // Reset after success
      setTimeout(() => {
        newsletterForm.reset();
        btn.textContent = 'Request Access';
        btn.style = '';
        input.disabled = false;
      }, 3000);
    }, 1500);
  });
}

/* -------------------------------------------------------------------------- */
/*  7. TERMINAL FOOTER: REAL-TIME DATA                                        */
/* -------------------------------------------------------------------------- */
function updateTerminalData() {
  const clock = document.getElementById('alpine-clock');
  const ping = document.getElementById('ping-ms');

  if (clock) {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-GB', { hour12: false });
    clock.textContent = `${timeStr} CET`;
  }

  if (ping) {
    const latency = Math.floor(Math.random() * 15) + 5;
    ping.textContent = `${latency}ms`;
  }
}

updateTerminalData();
setInterval(updateTerminalData, 1000);

/* -------------------------------------------------------------------------- */
/*  8. VIDEO MODAL SYSTEM                                                     */
/* -------------------------------------------------------------------------- */
const videoModal = document.getElementById('video-modal');
const videoIframe = document.getElementById('video-iframe');
const closeModalBtn = document.getElementById('close-modal');
const modalOverlay = document.querySelector('.modal-overlay');

// Open modal on video button click
document.querySelectorAll('.video-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const videoUrl = btn.dataset.video;
    videoIframe.src = videoUrl;
    videoModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
});

// Close modal
function closeModal() {
  videoModal.classList.remove('active');
  videoIframe.src = '';
  document.body.style.overflow = '';
}

closeModalBtn.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);

// Close on ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && videoModal.classList.contains('active')) {
    closeModal();
  }
});
// 1. Animación de la montaña (independiente)
const path = document.getElementById('mountain-path');
let offset = 300;

function animateMountain() {
  offset -= 2;
  if (offset < -300) offset = 300;
  if (path) path.style.strokeDashoffset = offset;
  requestAnimationFrame(animateMountain);
}
animateMountain();

window.addEventListener('load', () => {
  const loader = document.getElementById('simple-loader');
  setTimeout(() => {
    if (loader) {
      loader.style.opacity = '0';

      // ESTA ES LA LÍNEA QUE TIENES QUE AÑADIR:
      document.body.classList.add('loaded');

      setTimeout(() => {
        loader.style.display = 'none';
      }, 800);
    }
  }, 600);
});