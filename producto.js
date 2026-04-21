/* ============================================================
   producto.js — Lógica de la página de detalle de producto
   Módulos:
     1. Miniaturas de galería
     2. Control de cantidad
     3. Selector de variantes
     4. Toast de carrito
     5. Wishlist toggle
     6. Carrusel de productos relacionados
   ============================================================ */


/* ============================================================
   1. GALERÍA — Miniaturas clicables
   ============================================================ */
const thumbs = document.querySelectorAll('.pd-thumb');
const imagenPrincipal = document.getElementById('pdImagenPrincipal');

thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
        // Quitar activo de todos
        thumbs.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');

        // Aquí, cuando tengas imágenes reales, harías:
        // const src = thumb.dataset.src;
        // imagenPrincipal.querySelector('img').src = src;
    });
});


/* ============================================================
   2. CONTROL DE CANTIDAD
   ============================================================ */
const btnMenos   = document.getElementById('btnMenos');
const btnMas     = document.getElementById('btnMas');
const cantValor  = document.getElementById('cantidadValor');
let cantidad = 1;
const STOCK_MAX = 15;

btnMenos.addEventListener('click', () => {
    if (cantidad > 1) {
        cantidad--;
        cantValor.textContent = cantidad;
        // Animación de feedback
        cantValor.classList.add('animado');
        setTimeout(() => cantValor.classList.remove('animado'), 200);
    }
});

btnMas.addEventListener('click', () => {
    if (cantidad < STOCK_MAX) {
        cantidad++;
        cantValor.textContent = cantidad;
        cantValor.classList.add('animado');
        setTimeout(() => cantValor.classList.remove('animado'), 200);
    }
});


/* ============================================================
   3. SELECTOR DE VARIANTES
   ============================================================ */
const varianteBtns        = document.querySelectorAll('.pd-variante-btn');
const varianteSeleccionada = document.getElementById('varianteSeleccionada');

varianteBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        varianteBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        varianteSeleccionada.textContent = btn.textContent;
    });
});


/* ============================================================
   4. TOAST — Confirmación de carrito
   ============================================================ */
const toast          = document.getElementById('pdToast');
const btnAgregar     = document.getElementById('btnAgregarCarrito');
let toastTimeout;

function mostrarToast() {
    clearTimeout(toastTimeout);
    toast.classList.add('visible');
    toastTimeout = setTimeout(() => toast.classList.remove('visible'), 3000);
}

btnAgregar.addEventListener('click', mostrarToast);


/* ============================================================
   5. WISHLIST — Toggle corazón
   ============================================================ */
const btnWish = document.querySelector('.pd-btn-wish');

btnWish.addEventListener('click', () => {
    const activo = btnWish.classList.toggle('activo');
    const icono  = btnWish.querySelector('i');
    icono.className = activo ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
});


/* ============================================================
   6. CARRUSEL DE RELACIONADOS
   ============================================================ */
crearCarrusel({
    trackId:      'relacionadosTrack',
    btnIzqId:     'btnIzqRel',
    btnDerId:     'btnDerRel',
    itemSelector: '.producto-card',
    gap:          20,
    autoplayMs:   5000,
});


/* ============================================================
   7. BREADCRUMB DINÁMICO
   Puede recibir parámetros por URL (?nombre=...&categoria=...)
   para actualizar las migas de pan dinámicamente.
   ============================================================ */
(function initBreadcrumb() {
    const params    = new URLSearchParams(window.location.search);
    const nombre    = params.get('nombre');
    const categoria = params.get('categoria');

    if (nombre) {
        const bcProducto = document.getElementById('bc-producto');
        if (bcProducto) {
            bcProducto.textContent = decodeURIComponent(nombre);
            document.title = `${decodeURIComponent(nombre)} — AkibaraXpress`;

            // También actualizar el título en la página
            const pdNombre = document.getElementById('pdNombre');
            if (pdNombre) pdNombre.textContent = decodeURIComponent(nombre);
        }
    }

    if (categoria) {
        const bcCategoria = document.getElementById('bc-categoria');
        if (bcCategoria) {
            bcCategoria.textContent = decodeURIComponent(categoria);
        }
    }

    const pdPrecio = document.getElementById('pdPrecio');
    const precio   = params.get('precio');
    if (precio && pdPrecio) {
        pdPrecio.textContent = decodeURIComponent(precio);
    }
})();
