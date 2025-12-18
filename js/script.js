gsap.registerPlugin(Observer);

const carousel = document.getElementById('carousel');
let currentIndex = 0;
const total = 3;

// Только глитч везде (на мобилке и десктопе)
const effects = ['transition-glitch'];

function goTo(index) {
  currentIndex = (index + total) % total;

  const isMobile = window.innerWidth <= 768;
  const duration = isMobile ? 0.8 : 1.2;

  // Убираем старые эффекты
  effects.forEach(effect => carousel.classList.remove(effect));

  // Используем px от реальной ширины экрана — фикс для iPhone
  gsap.to(carousel, {
    x: -currentIndex * window.innerWidth,
    duration: duration,
    ease: "power3.inOut",
    onComplete: () => {
      if (!isMobile && effects.length > 0) {
        const randomEffect = effects[Math.floor(Math.random() * effects.length)];
        carousel.classList.add(randomEffect);
        setTimeout(() => carousel.classList.remove(randomEffect), duration * 1000);
      }
    }
  });

  updateDots();
}

// Навигация стрелками
document.querySelectorAll('.left-arrow').forEach(el => {
  el.addEventListener('click', () => goTo(currentIndex - 1));
});
document.querySelectorAll('.right-arrow').forEach(el => {
  el.addEventListener('click', () => goTo(currentIndex + 1));
});

// Свайп / колесо / тач
Observer.create({
  target: carousel,
  type: "wheel,touch,pointer",
  wheelSpeed: -1,
  tolerance: 50,
  preventDefault: true,
  onLeft: () => goTo(currentIndex + 1),
  onRight: () => goTo(currentIndex - 1)
});

// Открытие контента
document.querySelectorAll('.enter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const page = document.getElementById(btn.dataset.target);
    gsap.to(carousel, {
      opacity: 0,
      duration: 0.6,
      onComplete: () => {
        carousel.style.display = 'none';
        page.style.display = 'flex';
        document.body.style.overflowY = 'auto';
      }
    });
  });
});

// Закрытие — стабильный возврат без чёрного и миниатюр
document.querySelectorAll('.close-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const page = btn.parentElement;
    page.style.display = 'none';
    document.body.style.overflowY = 'hidden';

    carousel.style.display = 'flex';
    carousel.style.opacity = '0';

    // Принудительная установка позиции
    gsap.set(carousel, { x: -currentIndex * 100 + 'vw' });

    gsap.to(carousel, {
      opacity: 1,
      duration: 0.6,
      ease: "power2.out"
    });
  });
});

// Частицы — только на десктопе
if (window.innerWidth > 768) {
  particlesJS('carousel', {
    particles: {
      number: { value: 30 },
      color: { value: '#ff3333' },
      shape: { type: 'circle' },
      opacity: { value: 0.6, random: true },
      size: { value: 4, random: true },
      line_linked: { enable: false },
      move: {
        enable: true,
        speed: 1.5,
        direction: 'none',
        random: true,
        straight: false,
        out_mode: 'out'
      }
    },
    interactivity: {
      detect_on: 'canvas',
      events: {
        onhover: { enable: true, mode: 'repulse' },
        onclick: { enable: true, mode: 'push' }
      }
    },
    retina_detect: true
  });
}

// Лайтбокс
const lightbox = document.getElementById('lightbox');
const lightboxInner = document.getElementById('lightbox-inner');
const lightboxClose = document.getElementById('lightbox-close');

document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    if (item.querySelector('iframe')) {
      const src = item.querySelector('iframe').src;
      lightboxInner.innerHTML = `<iframe src="${src}" frameborder="0" allowfullscreen></iframe>`;
    } else {
      lightboxInner.innerHTML = '<div class="placeholder" style="font-size:3rem; padding:50px;">[Твоё фото здесь]</div>';
    }
    lightbox.style.display = 'flex';
    gsap.fromTo(lightboxInner, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5 });
  });
});

lightboxClose.addEventListener('click', () => {
  gsap.to(lightboxInner, {
    scale: 0.8,
    opacity: 0,
    duration: 0.3,
    onComplete: () => {
      lightbox.style.display = 'none';
      lightboxInner.innerHTML = '';
    }
  });
});