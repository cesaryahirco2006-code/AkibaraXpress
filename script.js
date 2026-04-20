/* ============================================================
   AkibaraXpress — Script principal
   Módulos:
     1. Dropdown "Más"
     2. Banner (slider automático)
     3. Carrusel infinito (fábrica reutilizable)
        - Carrusel de Figuras
        - Carrusel de Productos
   ============================================================ */


/* ============================================================
   1. DROPDOWN "MÁS"
   Se abre/cierra con click y se cierra al hacer click fuera.
   ============================================================ */
const masBtn = document.getElementById('mas-btn');

masBtn.addEventListener('click', function (e) {
    e.stopPropagation(); // Evita que el click global lo cierre inmediatamente
    this.classList.toggle('active');
});

// Cerrar dropdown al hacer click en cualquier otra parte de la página
document.addEventListener('click', function () {
    masBtn.classList.remove('active');
});


/* ============================================================
   2. BANNER / SLIDER
   Avanza automáticamente cada 4 segundos.
   Los dots son clicables para ir a un slide específico.
   ============================================================ */
const bannerTrack = document.getElementById('bannerTrack');
const dots = document.querySelectorAll('.dot');
let bannerIndex = 0;
const totalSlides = dots.length;

/**
 * Desplaza el banner al slide indicado y actualiza los dots.
 * @param {number} index - Índice del slide destino (0-based).
 */
function goToSlide(index) {
    bannerIndex = index;
    bannerTrack.style.transform = `translateX(-${bannerIndex * 100}%)`;

    dots.forEach(d => d.classList.remove('active'));
    dots[bannerIndex].classList.add('active');
}

// Dots clicables
dots.forEach((dot, i) => {
    dot.addEventListener('click', () => goToSlide(i));
});

// Auto-avance circular
setInterval(() => {
    goToSlide((bannerIndex + 1) % totalSlides);
}, 4000);


/* ============================================================
   3. FÁBRICA DE CARRUSEL INFINITO
   Recibe los IDs del track y los botones, y devuelve
   un carrusel completamente funcional con clonado de items.

   Técnica de clonado:
   - Se duplican los items al FINAL (para avanzar sin saltos).
   - Se duplican los items al INICIO (para retroceder sin saltos).
   - Cuando el índice sale del rango original, se salta
     silenciosamente al bloque equivalente con transition: none.
   ============================================================ */

/**
 * Inicializa un carrusel infinito.
 * @param {Object} config
 * @param {string} config.trackId         - ID del elemento contenedor de items.
 * @param {string} config.btnIzqId        - ID del botón izquierdo/anterior.
 * @param {string} config.btnDerId        - ID del botón derecho/siguiente.
 * @param {string} config.itemSelector    - Selector CSS de cada item (ej. '.carrusel-item').
 * @param {number} config.gap             - Gap en px entre items (debe coincidir con el CSS).
 * @param {number} config.autoplayMs      - Intervalo de autoplay en milisegundos.
 */
function crearCarrusel({ trackId, btnIzqId, btnDerId, itemSelector, gap, autoplayMs }) {
    const track = document.getElementById(trackId);
    const btnIzq = document.getElementById(btnIzqId);
    const btnDer = document.getElementById(btnDerId);

    // Guardar los items originales antes de clonar
    const itemsOriginales = Array.from(track.querySelectorAll(itemSelector));
    const total = itemsOriginales.length;

    // Clonar al FINAL (permite avanzar más allá del último item)
    itemsOriginales.forEach(item => {
        track.appendChild(item.cloneNode(true));
    });

    // Clonar al INICIO (permite retroceder antes del primer item)
    [...itemsOriginales].reverse().forEach(item => {
        track.insertBefore(item.cloneNode(true), track.firstChild);
    });

    // El índice inicial apunta al primer item ORIGINAL (saltando los clones del inicio)
    let posIndex = total;
    let animando = false;

    /** Calcula el ancho de un item incluyendo el gap */
    function getItemWidth() {
        return track.querySelector(itemSelector).getBoundingClientRect().width + gap;
    }

    /**
     * Mueve el track al índice indicado.
     * @param {number} index         - Posición destino.
     * @param {boolean} conAnimacion - Si false, el salto es instantáneo (para el reset).
     */
    function irA(index, conAnimacion = true) {
        track.style.transition = conAnimacion ? 'transform 0.5s ease' : 'none';
        track.style.transform = `translateX(-${index * getItemWidth()}px)`;
        posIndex = index;
    }

    // Posicionar al inicio sin animación para no mostrar un salto al cargar la página
    window.addEventListener('load', () => irA(total, false));

    /**
     * Avanza o retrocede el carrusel un paso.
     * @param {number} direccion - 1 para avanzar, -1 para retroceder.
     */
    function mover(direccion) {
        if (animando) return;
        animando = true;

        irA(posIndex + direccion, true);

        // Tras completar la animación, verificar si hay que hacer un salto silencioso
        setTimeout(() => {
            if (posIndex >= total * 2) irA(total, false);       // Pasó del último → volver al inicio real
            if (posIndex < total) irA(posIndex + total, false); // Antes del primero → ir al final real
            animando = false;
        }, 510); // Ligeramente mayor a la duración de la transición (500ms)
    }

    // Eventos de los botones
    btnIzq.addEventListener('click', () => mover(-1));
    btnDer.addEventListener('click', () => mover(1));

    // Autoplay
    setInterval(() => mover(1), autoplayMs);
}


/* ============================================================
   INICIALIZACIÓN DE CARRUSELES
   ============================================================ */

// Carrusel de Figuras de Anime
crearCarrusel({
    trackId: 'carruselTrack',
    btnIzqId: 'btnIzq',
    btnDerId: 'btnDer',
    itemSelector: '.carrusel-item',
    gap: 20,
    autoplayMs: 3000,
});

// Carrusel de Productos Destacados
crearCarrusel({
    trackId: 'productosTrack',
    btnIzqId: 'btnIzqProd',
    btnDerId: 'btnDerProd',
    itemSelector: '.producto-card',
    gap: 20,
    autoplayMs: 4000,
});

/* ============================================================
   MENÚ HAMBURGUESA (móvil)
   Abre y cierra el subheader al hacer click en el botón.
   También cierra el menú si se cambia a pantalla grande.
   ============================================================ */
const btnHamburguesa = document.getElementById('btnHamburguesa');
const subheader = document.querySelector('.subheader');
 
btnHamburguesa.addEventListener('click', function () {
    const estaAbierto = subheader.classList.toggle('abierto');
 
    // Cambiar ícono según estado del menú
    const icono = this.querySelector('i');
    icono.className = estaAbierto ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
});
 
// Si el usuario rota el dispositivo o agranda la ventana,
// cerrar el menú y restaurar el ícono para evitar estado inconsistente
window.addEventListener('resize', function () {
    if (window.innerWidth > 900) {
        subheader.classList.remove('abierto');
        btnHamburguesa.querySelector('i').className = 'fa-solid fa-bars';
    }
});

/* ============================================================
   MODO OSCURO
   ============================================================ */
const btnModo = document.getElementById('btnModo');

btnModo.addEventListener('click', function () {
    const oscuro = document.body.classList.toggle('modo-oscuro');
    const icono = this.querySelector('i');
    icono.className = oscuro ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
});