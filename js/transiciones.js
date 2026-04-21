/* ============================================================
   js/transiciones.js — Loader, fade de página, like, newsletter
   ============================================================ */

/* ── 1. BARRA DE CARGA ── */
(function initLoader() {
    const fill  = document.getElementById('barra-carga-fill');
    const barra = document.getElementById('barra-carga');
    if (!fill || !barra) return;

    // Avanza rápido al 75% simulando actividad
    setTimeout(() => { fill.style.width = '75%'; }, 60);

    window.addEventListener('load', () => {
        fill.style.width = '100%';
        setTimeout(() => {
            barra.classList.add('listo');
            setTimeout(() => barra.remove(), 450);
        }, 400);
    });
})();


/* ── 2. FADE ENTRE PÁGINAS ── */

/**
 * Hace fade-out y navega a la URL dada.
 * Se expone globalmente para que index.js y producto.js la usen.
 */
function navegarConFade(url) {
    document.body.classList.add('saliendo');
    setTimeout(() => { window.location.href = url; }, 260);
}

// Intercepta <a> internos para hacer fade antes de navegar
document.addEventListener('click', e => {
    const link = e.target.closest('a[href]');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href ||
        href.startsWith('#') ||
        href.startsWith('http') ||
        href.startsWith('//') ||
        href.startsWith('mailto') ||
        href.startsWith('tel') ||
        href.startsWith('javascript')) return;

    e.preventDefault();
    navegarConFade(href);
}, true);



/* ── 4. VALIDACIÓN NEWSLETTER — 10 dígitos ── */
document.addEventListener('DOMContentLoaded', () => {
    const form  = document.querySelector('.newsletter-form');
    const input = form?.querySelector('input');
    const btn   = form?.querySelector('button');
    const msg   = form?.querySelector('.newsletter-msg');
    if (!form || !input || !btn || !msg) return;

    input.classList.add('newsletter-input');

    function validar() {
        const digitos = input.value.replace(/\D/g, '');

        if (digitos.length === 0) {
            form.classList.remove('error', 'exito');
            msg.textContent = '';
            return false;
        }

        if (digitos.length !== 10) {
            form.classList.add('error');
            form.classList.remove('exito');
            msg.textContent = 'Ingresa un número de teléfono de 10 dígitos.';
            return false;
        }

        form.classList.add('exito');
        form.classList.remove('error');
        msg.textContent = '¡Número válido!';
        return true;
    }

    input.addEventListener('input', validar);

    btn.addEventListener('click', () => {
        if (validar()) {
            msg.textContent = '¡Suscripción enviada con éxito!';
            input.value = '';
            form.classList.remove('exito', 'error');
            setTimeout(() => { msg.textContent = ''; }, 3000);
        }
    });
});
