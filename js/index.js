/* ============================================================
   js/index.js — Lógica exclusiva de la página principal (index.html)
   Depende de: utils.js
   ============================================================ */

/* ── 1. INICIALIZACIÓN DE CARRUSELES ── */

// Carrusel de Figuras de Anime
crearCarrusel({
    trackId:      'carruselTrack',
    btnIzqId:     'btnIzq',
    btnDerId:     'btnDer',
    itemSelector: '.carrusel-item',
    gap:          20,
    autoplayMs:   3000,
});

// Carrusel Lo Más Nuevo
crearCarrusel({
    trackId:      'nuevoTrack',
    btnIzqId:     'btnIzqNuevo',
    btnDerId:     'btnDerNuevo',
    itemSelector: '.producto-card',
    gap:          20,
    autoplayMs:   3500,
});

// Carrusel de Productos Destacados
crearCarrusel({
    trackId:      'productosTrack',
    btnIzqId:     'btnIzqProd',
    btnDerId:     'btnDerProd',
    itemSelector: '.producto-card',
    gap:          20,
    autoplayMs:   4000,
});


/* ── 2. NAVEGACIÓN A DETALLE DE PRODUCTO ── */

function irADetalle(nombre, categoria, precio) {
    const params = new URLSearchParams();
    params.set('nombre',    nombre);
    params.set('categoria', categoria);
    if (precio) params.set('precio', precio);
    navegarConFade(`producto.html?${params.toString()}`);
}

function bindNavegacionCards(trackId) {
    document.querySelectorAll(`#${trackId} .producto-card`).forEach(card => {
        card.addEventListener('click', function (e) {
            if (e.target.closest('.btn-ver, .btn-comprar')) return;
            irADetalle(
                this.querySelector('.producto-nombre')?.textContent   || 'Producto',
                this.querySelector('.producto-categoria')?.textContent || 'General',
                this.querySelector('.producto-precio')?.textContent    || ''
            );
        });

        const btnVer = card.querySelector('.btn-ver');
        if (btnVer) {
            btnVer.addEventListener('click', e => {
                e.stopPropagation();
                irADetalle(
                    card.querySelector('.producto-nombre')?.textContent   || 'Producto',
                    card.querySelector('.producto-categoria')?.textContent || 'General',
                    card.querySelector('.producto-precio')?.textContent    || ''
                );
            });
        }
    });
}

function initNavegacionProductos() {
    bindNavegacionCards('nuevoTrack');
    bindNavegacionCards('productosTrack');

    // Items del carrusel de figuras
    document.querySelectorAll('#carruselTrack .carrusel-item').forEach(item => {
        item.addEventListener('click', function () {
            irADetalle(
                this.querySelector('span')?.textContent || 'Figura',
                'Figuras'
            );
        });
    });
}

document.addEventListener('DOMContentLoaded', initNavegacionProductos);


/* ── 3. AGREGAR AL CARRITO — delegación para cubrir clones del carrusel ── */
document.addEventListener('click', e => {
    const btn = e.target.closest('.producto-card .btn-comprar');
    if (btn) {
        e.stopPropagation();
        agregarAlCarrito();
    }
});
