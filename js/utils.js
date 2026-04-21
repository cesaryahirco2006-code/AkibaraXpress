/* ============================================================
   js/utils.js — Utilidades compartidas entre todas las páginas
   ============================================================ */

/**
 * Incrementa el contador del carrito y dispara la animación del ícono.
 * Se usa desde index.js y producto.js.
 */
function agregarAlCarrito() {
    const badge      = document.getElementById('carritoBadge');
    const carritoIcon = document.querySelector('.carrito i');

    if (badge) {
        badge.textContent = (parseInt(badge.textContent) || 0) + 1;
        badge.classList.remove('pop');
        void badge.offsetWidth; // reflow para reiniciar animación
        badge.classList.add('pop');
        setTimeout(() => badge.classList.remove('pop'), 300);
    }

    if (carritoIcon) {
        carritoIcon.classList.remove('animando');
        void carritoIcon.offsetWidth;
        carritoIcon.classList.add('animando');
        setTimeout(() => carritoIcon.classList.remove('animando'), 500);
    }
}

/**
 * Fábrica de carrusel infinito reutilizable.
 * Clona los items al inicio y al final para lograr el efecto infinito.
 *
 * @param {Object} config
 * @param {string} config.trackId      - ID del contenedor de items.
 * @param {string} config.btnIzqId     - ID del botón "anterior".
 * @param {string} config.btnDerId     - ID del botón "siguiente".
 * @param {string} config.itemSelector - Selector CSS de cada item.
 * @param {number} config.gap          - Gap en px entre items (debe coincidir con CSS).
 * @param {number} config.autoplayMs   - Intervalo de autoplay en milisegundos.
 */
function crearCarrusel({ trackId, btnIzqId, btnDerId, itemSelector, gap, autoplayMs }) {
    const track  = document.getElementById(trackId);
    const btnIzq = document.getElementById(btnIzqId);
    const btnDer = document.getElementById(btnDerId);

    // Guard: si algún elemento no existe en la página, no hace nada
    if (!track || !btnIzq || !btnDer) return;

    const itemsOriginales = Array.from(track.querySelectorAll(itemSelector));
    const total           = itemsOriginales.length;

    // Clonar al FINAL para scroll hacia la derecha
    itemsOriginales.forEach(item => track.appendChild(item.cloneNode(true)));

    // Clonar al INICIO para scroll hacia la izquierda
    [...itemsOriginales].reverse().forEach(item => {
        track.insertBefore(item.cloneNode(true), track.firstChild);
    });

    let posIndex = total;
    let animando = false;

    function getItemWidth() {
        return track.querySelector(itemSelector).getBoundingClientRect().width + gap;
    }

    function irA(index, conAnimacion = true) {
        track.style.transition = conAnimacion ? 'transform 0.5s ease' : 'none';
        track.style.transform  = `translateX(-${index * getItemWidth()}px)`;
        posIndex = index;
    }

    // Posicionar sin animación al cargar
    window.addEventListener('load', () => irA(total, false));

    function mover(direccion) {
        if (animando) return;
        animando = true;
        irA(posIndex + direccion, true);

        setTimeout(() => {
            // Salto invisible al clon opuesto para crear el efecto infinito
            if (posIndex >= total * 2) irA(total, false);
            if (posIndex < total)      irA(posIndex + total, false);
            animando = false;
        }, 510); // Ligeramente mayor que la duración de la transición CSS
    }

    btnIzq.addEventListener('click', () => mover(-1));
    btnDer.addEventListener('click', () => mover(1));

    // Autoplay
    setInterval(() => mover(1), autoplayMs);
}
