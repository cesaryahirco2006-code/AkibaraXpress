/* ============================================================
   AkibaraXpress — Script principal
   Módulos:
     1. Dropdown "Más"
     2. Banner (slider automático)
     3. Carrusel infinito (fábrica reutilizable)
        - Carrusel de Figuras
        - Carrusel de Productos
     4. Menú hamburguesa (móvil)
     5. Modo oscuro
     6. Scroll del header
     7. Navegación a detalle de producto ← NUEVO
   ============================================================ */


/* ============================================================
   1. DROPDOWN "MÁS"
   ============================================================ */
const masBtn = document.getElementById('mas-btn');

masBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    this.classList.toggle('active');
});

document.addEventListener('click', function () {
    masBtn.classList.remove('active');
});


/* ============================================================
   2. BANNER / SLIDER
   ============================================================ */
const bannerTrack = document.getElementById('bannerTrack');
const dots = document.querySelectorAll('.dot');
let bannerIndex = 0;
const totalSlides = dots.length;

function goToSlide(index) {
    bannerIndex = index;
    bannerTrack.style.transform = `translateX(-${bannerIndex * 100}%)`;
    dots.forEach(d => d.classList.remove('active'));
    dots[bannerIndex].classList.add('active');
}

dots.forEach((dot, i) => {
    dot.addEventListener('click', () => goToSlide(i));
});

setInterval(() => {
    goToSlide((bannerIndex + 1) % totalSlides);
}, 4000);


/* ============================================================
   3. FÁBRICA DE CARRUSEL INFINITO
   ============================================================ */

/**
 * Inicializa un carrusel infinito.
 * @param {Object} config
 * @param {string} config.trackId         - ID del contenedor de items.
 * @param {string} config.btnIzqId        - ID del botón anterior.
 * @param {string} config.btnDerId        - ID del botón siguiente.
 * @param {string} config.itemSelector    - Selector CSS de cada item.
 * @param {number} config.gap             - Gap en px entre items (debe coincidir con CSS).
 * @param {number} config.autoplayMs      - Intervalo de autoplay en milisegundos.
 */
function crearCarrusel({ trackId, btnIzqId, btnDerId, itemSelector, gap, autoplayMs }) {
    const track  = document.getElementById(trackId);
    const btnIzq = document.getElementById(btnIzqId);
    const btnDer = document.getElementById(btnDerId);

    if (!track || !btnIzq || !btnDer) return; // Guard: evita errores si el elemento no existe en la página

    const itemsOriginales = Array.from(track.querySelectorAll(itemSelector));
    const total = itemsOriginales.length;

    // Clonar al FINAL
    itemsOriginales.forEach(item => track.appendChild(item.cloneNode(true)));

    // Clonar al INICIO
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
        track.style.transform = `translateX(-${index * getItemWidth()}px)`;
        posIndex = index;
    }

    window.addEventListener('load', () => irA(total, false));

    function mover(direccion) {
        if (animando) return;
        animando = true;
        irA(posIndex + direccion, true);
        setTimeout(() => {
            if (posIndex >= total * 2) irA(total, false);
            if (posIndex < total)      irA(posIndex + total, false);
            animando = false;
        }, 510);
    }

    btnIzq.addEventListener('click', () => mover(-1));
    btnDer.addEventListener('click', () => mover(1));

    setInterval(() => mover(1), autoplayMs);
}


/* ============================================================
   INICIALIZACIÓN DE CARRUSELES
   ============================================================ */

crearCarrusel({
    trackId:      'carruselTrack',
    btnIzqId:     'btnIzq',
    btnDerId:     'btnDer',
    itemSelector: '.carrusel-item',
    gap:          20,
    autoplayMs:   3000,
});

crearCarrusel({
    trackId:      'productosTrack',
    btnIzqId:     'btnIzqProd',
    btnDerId:     'btnDerProd',
    itemSelector: '.producto-card',
    gap:          20,
    autoplayMs:   4000,
});


/* ============================================================
   4. MENÚ HAMBURGUESA (móvil)
   ============================================================ */
const btnHamburguesa = document.getElementById('btnHamburguesa');
const subheader      = document.querySelector('.subheader');

btnHamburguesa.addEventListener('click', function () {
    const estaAbierto = subheader.classList.toggle('abierto');
    const icono = this.querySelector('i');
    icono.className = estaAbierto ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
});

window.addEventListener('resize', function () {
    if (window.innerWidth > 900) {
        subheader.classList.remove('abierto');
        btnHamburguesa.querySelector('i').className = 'fa-solid fa-bars';
    }
});


/* ============================================================
   5. MODO OSCURO
   ============================================================ */
const btnModo = document.getElementById('btnModo');

btnModo.addEventListener('click', function () {
    const oscuro = document.body.classList.toggle('modo-oscuro');
    const icono  = this.querySelector('i');
    icono.className = oscuro ? 'fa-solid fa-sun' : 'fa-solid fa-moon';

    // Persistir preferencia en localStorage
    localStorage.setItem('akibara-modo-oscuro', oscuro ? '1' : '0');
});

// Restaurar modo oscuro al cargar la página
(function restaurarModo() {
    if (localStorage.getItem('akibara-modo-oscuro') === '1') {
        document.body.classList.add('modo-oscuro');
        const icono = document.querySelector('#btnModo i');
        if (icono) icono.className = 'fa-solid fa-sun';
    }
})();


/* ============================================================
   6. SCROLL DEL HEADER
   ============================================================ */
const header = document.querySelector('header');

window.addEventListener('scroll', function () {
    if (window.scrollY > 20) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}, { passive: true });


/* ============================================================
   7. NAVEGACIÓN A DETALLE DE PRODUCTO
   Al hacer click en una tarjeta de producto o en un item del
   carrusel de figuras, se navega a producto.html con los datos
   del elemento pasados por parámetros de URL.
   ============================================================ */

/**
 * Navega a la página de detalle pasando nombre, categoría y precio.
 * @param {string} nombre    - Nombre del producto.
 * @param {string} categoria - Categoría del producto (p. ej. "Figuras").
 * @param {string} [precio]  - Precio (opcional).
 */
function irADetalle(nombre, categoria, precio) {
    const params = new URLSearchParams();
    params.set('nombre',    nombre);
    params.set('categoria', categoria);
    if (precio) params.set('precio', precio);
    window.location.href = `producto.html?${params.toString()}`;
}

/**
 * Agrega listeners de navegación a las tarjetas de producto del index.
 * Busca todos los .producto-card dentro del productosTrack.
 */
function initNavegacionProductos() {
    // ── Tarjetas de productos ──
    const productoCards = document.querySelectorAll('#productosTrack .producto-card');

    productoCards.forEach(card => {
        // Hacer que toda la tarjeta sea navegable (excepto los botones)
        card.style.cursor = 'pointer';

        card.addEventListener('click', function (e) {
            // Si hicieron click en un botón, dejar que el botón maneje el evento
            if (e.target.closest('.btn-ver, .btn-comprar')) return;

            const nombre    = this.querySelector('.producto-nombre')?.textContent   || 'Producto';
            const categoria = this.querySelector('.producto-categoria')?.textContent || 'General';
            const precio    = this.querySelector('.producto-precio')?.textContent    || '';

            irADetalle(nombre, categoria, precio);
        });

        // Los botones "Ver Producto" también navegan al detalle
        const btnVer = card.querySelector('.btn-ver');
        if (btnVer) {
            btnVer.addEventListener('click', function (e) {
                e.stopPropagation();
                const nombre    = card.querySelector('.producto-nombre')?.textContent   || 'Producto';
                const categoria = card.querySelector('.producto-categoria')?.textContent || 'General';
                const precio    = card.querySelector('.producto-precio')?.textContent    || '';
                irADetalle(nombre, categoria, precio);
            });
        }
    });

    // ── Items del carrusel de figuras ──
    const figuras = document.querySelectorAll('#carruselTrack .carrusel-item');

    figuras.forEach(item => {
        item.style.cursor = 'pointer';

        item.addEventListener('click', function () {
            const nombre = this.querySelector('span')?.textContent || 'Figura';
            irADetalle(nombre, 'Figuras');
        });
    });
}

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', initNavegacionProductos);
