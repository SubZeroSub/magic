gsap.registerPlugin(Observer);

const carousel = document.getElementById('carousel');
const dots = document.querySelectorAll('.dot');
let currentIndex = 0;
const total = 3;

function updateDots() {
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === currentIndex);
  });
}

function goTo(index) {
  currentIndex = (index + total) % total;

  // Убираем предыдущие классы эффектов
  carousel.classList.remove('transition-glitch', 'transition-distortion', 'transition-scanlines');

  // Рандомный эффект
  const effects = ['transition-glitch'];
  const randomEffect = effects[Math.floor(Math.random() * effects.length)];
  carousel.classList.add(randomEffect);

  gsap.to(carousel, {
    x: -currentIndex * window.innerWidth,
    duration: 1.2,
    ease: "power2.inOut",
    onComplete: () => {
      // Убираем класс после завершения, чтобы не накапливалось
      carousel.classList.remove(randomEffect);
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

// Свайп / колесо мыши / тач
Observer.create({
  target: carousel,
  type: "wheel,touch,pointer",
  wheelSpeed: -1,
  tolerance: 50,
  preventDefault: true,
  onLeft: () => goTo(currentIndex + 1),
  onRight: () => goTo(currentIndex - 1)
});

// Открытие вертикальной страницы
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

// Закрытие и возврат в карусель
document.querySelectorAll('.close-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const page = btn.parentElement;
    page.style.display = 'none';
    document.body.style.overflowY = 'hidden';
    carousel.style.display = 'flex';
    gsap.fromTo(carousel, { opacity: 0 }, { opacity: 1, duration: 0.6 });
  });
});

// Инициализация индикаторов
updateDots();

// Частицы — магический дым/искры
particlesJS('carousel', {
  particles: {
    number: { value: 40 },
    color: { value: '#ff0000' },
    shape: { type: 'circle' },
    opacity: { value: 0.4, random: true },
    size: { value: 4, random: true },
    line_linked: { enable: false },
    move: {
      enable: true,
      speed: 1,
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
      onclick: { enable: false }
    }
  },
  retina_detect: true
});

// Лайтбокс для галереи
const lightbox = document.getElementById('lightbox');
const lightboxInner = document.getElementById('lightbox-inner');
const lightboxClose = document.getElementById('lightbox-close');

document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    if (item.querySelector('iframe')) {
      const src = item.querySelector('iframe').src;
      lightboxInner.innerHTML = `<iframe src="${src}" frameborder="0" allowfullscreen></iframe>`;
    } else {
      // Для заглушек фото (потом заменишь на реальные img)
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