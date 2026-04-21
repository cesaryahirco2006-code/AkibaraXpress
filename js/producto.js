/* ============================================================
   js/producto.js — Lógica de la página de detalle de producto
   Depende de: utils.js
   ============================================================ */

/* ── 1. GALERÍA — Miniaturas clicables ── */
const thumbs          = document.querySelectorAll('.pd-thumb');
const imagenPrincipal = document.getElementById('pdImagenPrincipal');

thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
        thumbs.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');

        // Cuando integres imágenes reales:
        // imagenPrincipal.querySelector('img').src = thumb.dataset.src;
    });
});


/* ── 2. CONTROL DE CANTIDAD ── */
const btnMenos  = document.getElementById('btnMenos');
const btnMas    = document.getElementById('btnMas');
const cantValor = document.getElementById('cantidadValor');

let cantidad    = 1;
const STOCK_MAX = 15;

function actualizarCantidad(nueva) {
    if (nueva < 1 || nueva > STOCK_MAX) return;
    cantidad = nueva;
    cantValor.textContent = cantidad;
    cantValor.classList.add('animado');
    setTimeout(() => cantValor.classList.remove('animado'), 200);
}

btnMenos?.addEventListener('click', () => actualizarCantidad(cantidad - 1));
btnMas?.addEventListener('click',   () => actualizarCantidad(cantidad + 1));


/* ── 3. TOAST — Confirmación al agregar al carrito ── */
const toast      = document.getElementById('pdToast');
const btnAgregar = document.getElementById('btnAgregarCarrito');
let toastTimeout;

function mostrarToast() {
    clearTimeout(toastTimeout);
    toast?.classList.add('visible');
    toastTimeout = setTimeout(() => toast?.classList.remove('visible'), 3000);
}

btnAgregar?.addEventListener('click', () => {
    mostrarToast();
    agregarAlCarrito();
});

/* Delegación para las tarjetas de productos relacionados (incluye clones) */
document.addEventListener('click', e => {
    const btn = e.target.closest('.pd-relacionados .btn-comprar');
    if (btn) {
        e.stopPropagation();
        agregarAlCarrito();
    }
});


/* ── 4. WISHLIST — Toggle de corazón con animación ── */
const btnWish = document.querySelector('.pd-btn-wish');

btnWish?.addEventListener('click', () => {
    const activo    = btnWish.classList.toggle('activo');
    const icono     = btnWish.querySelector('i');
    icono.className = activo ? 'fa-solid fa-heart' : 'fa-regular fa-heart';

    // Animación bounce del botón
    btnWish.classList.remove('animando');
    void btnWish.offsetWidth;
    btnWish.classList.add('animando');
    setTimeout(() => btnWish.classList.remove('animando'), 450);

    // Corazón flotante al activar
    if (activo) {
        const rect    = btnWish.getBoundingClientRect();
        const corazon = document.createElement('span');
        corazon.className   = 'pd-wish-float';
        corazon.textContent = '♥';
        corazon.style.left  = (rect.left + rect.width / 2 - 10) + 'px';
        corazon.style.top   = (rect.top - 4) + 'px';
        document.body.appendChild(corazon);
        setTimeout(() => corazon.remove(), 750);
    }
});


/* ── 5. CARRUSEL DE PRODUCTOS RELACIONADOS ── */
crearCarrusel({
    trackId:      'relacionadosTrack',
    btnIzqId:     'btnIzqRel',
    btnDerId:     'btnDerRel',
    itemSelector: '.producto-card',
    gap:          20,
    autoplayMs:   5000,
});


/* ── 6. DATOS — siempre muestra placeholder genérico ── */
(function initDatosDinamicos() {
    const params    = new URLSearchParams(window.location.search);
    const categoria = params.get('categoria');

    const NOMBRE = 'Nombre del Producto';
    const PRECIO = '$999.00';

    document.title = `${NOMBRE} — AkibaraXpress`;

    const bcProducto = document.getElementById('bc-producto');
    if (bcProducto) bcProducto.textContent = NOMBRE;

    const pdNombre = document.getElementById('pdNombre');
    if (pdNombre) pdNombre.textContent = NOMBRE;

    const pdNombreDesc = document.getElementById('pdNombreDesc');
    if (pdNombreDesc) pdNombreDesc.textContent = NOMBRE;

    const pdPrecio = document.getElementById('pdPrecio');
    if (pdPrecio) pdPrecio.textContent = PRECIO;

    if (categoria) {
        const bcCategoria = document.getElementById('bc-categoria');
        if (bcCategoria) bcCategoria.textContent = decodeURIComponent(categoria);
    }
})();
