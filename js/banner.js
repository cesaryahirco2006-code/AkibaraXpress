/* ============================================================
   js/banner.js — Slider/banner automático
   Solo se usa en index.html
   ============================================================ */

const bannerTrack = document.getElementById('bannerTrack');
const dots        = document.querySelectorAll('.dot');
const totalSlides = dots.length;
let bannerIndex   = 0;

/**
 * Desplaza el slider al slide indicado y actualiza los puntos.
 * @param {number} index - Índice del slide destino.
 */
function goToSlide(index) {
    bannerIndex = index;
    bannerTrack.style.transform = `translateX(-${bannerIndex * 100}%)`;

    dots.forEach(d => d.classList.remove('active'));
    dots[bannerIndex].classList.add('active');
}

// Puntos clicables
dots.forEach((dot, i) => dot.addEventListener('click', () => goToSlide(i)));

// Autoplay cada 4 s
if (bannerTrack && totalSlides > 0) {
    setInterval(() => goToSlide((bannerIndex + 1) % totalSlides), 4000);
}
