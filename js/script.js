gsap.registerPlugin(Observer);

/* ===== VIEWPORT FIX ===== */
function setVH() {
  document.documentElement.style.setProperty(
    '--vh',
    `${window.innerHeight * 0.01}px`
  );
}
setVH();
window.addEventListener('resize', setVH);
window.addEventListener('orientationchange', setVH);

/* ===== CAROUSEL ===== */
const carousel = document.getElementById('carousel');
const sections = gsap.utils.toArray('.section');
let index = 0;
let locked = false;
let observer;

/* ===== NAV ===== */
function goTo(i) {
  if (locked) return;
  index = (i + sections.length) % sections.length;
  gsap.to(carousel, {
    x: -index * window.innerWidth,
    duration: 0.8,
    ease: 'power3.inOut'
  });
}

/* ===== OBSERVER ===== */
function enableObserver() {
  observer = Observer.create({
    target: window,
    type: window.innerWidth < 768 ? "touch" : "wheel,touch",
    preventDefault: true,
    tolerance: 10,
    onDown: () => goTo(index + 1),
    onUp: () => goTo(index - 1)
  });
}
enableObserver();

/* ===== ENTER PAGE ===== */
document.querySelectorAll('.enter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const page = document.getElementById(btn.dataset.target);
    locked = true;
    observer.disable();

    /* УБИРАЕМ КАРУСЕЛЬ */
    gsap.to(carousel, {
      autoAlpha: 0,
      scale: 0.95,
      duration: 0.5,
      ease: 'power2.out'
    });

    page.style.display = 'block';
    document.body.style.overflow = 'hidden';

    gsap.fromTo(page,
      { y: '100%' },
      {
        y: '0%',
        duration: 0.7,
        ease: 'power3.out'
      }
    );
  });
});

/* ===== CLOSE PAGE ===== */
document.querySelectorAll('.close-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const page = btn.closest('.vertical-page');

    gsap.to(page, {
      y: '100%',
      duration: 0.5,
      ease: 'power3.in',
      onComplete() {
        page.style.display = 'none';
        page.style.transform = '';
        document.body.style.overflow = '';

        /* ВОЗВРАЩАЕМ КАРУСЕЛЬ */
        gsap.to(carousel, {
          autoAlpha: 1,
          scale: 1,
          duration: 0.4,
          ease: 'power2.out'
        });

        locked = false;
        enableObserver();
      }
    });
  });
});

/* ===== ARROWS ===== */
document.querySelectorAll('.left-arrow').forEach(b =>
  b.addEventListener('click', () => goTo(index - 1))
);
document.querySelectorAll('.right-arrow').forEach(b =>
  b.addEventListener('click', () => goTo(index + 1))
);
