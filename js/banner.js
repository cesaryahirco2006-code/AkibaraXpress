/* ============================================================
   js/banner.js — Slider/banner automático con flechas y dots
   Solo se usa en index.html
   ============================================================ */

const bannerTrack  = document.getElementById('bannerTrack');
const dots         = document.querySelectorAll('.dot');
const btnBannerIzq = document.getElementById('btnBannerIzq');
const btnBannerDer = document.getElementById('btnBannerDer');
const totalSlides  = dots.length;
let bannerIndex    = 0;
let autoplayTimer;

function goToSlide(index) {
    // Ciclo infinito
    if (index < 0)           index = totalSlides - 1;
    if (index >= totalSlides) index = 0;

    bannerIndex = index;
    bannerTrack.style.transform = `translateX(-${bannerIndex * 100}%)`;

    dots.forEach(d => d.classList.remove('active'));
    dots[bannerIndex].classList.add('active');
}

function resetAutoplay() {
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(() => goToSlide(bannerIndex + 1), 4000);
}

// Dots clicables
dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
        goToSlide(i);
        resetAutoplay();
    });
});

// Flechas
btnBannerIzq?.addEventListener('click', () => {
    goToSlide(bannerIndex - 1);
    resetAutoplay();
});

btnBannerDer?.addEventListener('click', () => {
    goToSlide(bannerIndex + 1);
    resetAutoplay();
});

// Swipe táctil
let touchStartX = 0;
bannerTrack?.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
bannerTrack?.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
        goToSlide(bannerIndex + (diff > 0 ? 1 : -1));
        resetAutoplay();
    }
});

// Arrancar autoplay
if (bannerTrack && totalSlides > 0) resetAutoplay();
