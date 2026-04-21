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

btnAgregar?.addEventListener('click', mostrarToast);


/* ── 4. WISHLIST — Toggle de corazón ── */
const btnWish = document.querySelector('.pd-btn-wish');

btnWish?.addEventListener('click', () => {
    const activo    = btnWish.classList.toggle('activo');
    const icono     = btnWish.querySelector('i');
    icono.className = activo ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
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


/* ── 6. DATOS DINÁMICOS desde URL ── */
(function initDatosDinamicos() {
    const params    = new URLSearchParams(window.location.search);
    const nombre    = params.get('nombre');
    const categoria = params.get('categoria');
    const precio    = params.get('precio');

    if (nombre) {
        const decoded = decodeURIComponent(nombre);

        document.title = `${decoded} — AkibaraXpress`;

        const bcProducto = document.getElementById('bc-producto');
        if (bcProducto) bcProducto.textContent = decoded;

        // Sincroniza nombre en panel derecho y módulo descripción
        const pdNombre = document.getElementById('pdNombre');
        if (pdNombre) pdNombre.textContent = decoded;

        const pdNombreDesc = document.getElementById('pdNombreDesc');
        if (pdNombreDesc) pdNombreDesc.textContent = decoded;
    }

    if (categoria) {
        const decoded     = decodeURIComponent(categoria);
        const bcCategoria = document.getElementById('bc-categoria');
        if (bcCategoria) bcCategoria.textContent = decoded;
    }

    if (precio) {
        const pdPrecio = document.getElementById('pdPrecio');
        if (pdPrecio) pdPrecio.textContent = decodeURIComponent(precio);
    }
})();
