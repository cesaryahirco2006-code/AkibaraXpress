/* ============================================================
   js/index.js — Lógica de la página principal
   Depende de: utils.js, catalogo.js, wishlist.js, carrito.js
   ============================================================ */

/* ── 1. RENDERIZAR TARJETAS ── */

function crearCardHTML(p) {
    const enWish = Wishlist.tiene(p.id);
    return `
        <div class="producto-card" data-product-id="${p.id}" data-nombre="${p.nombre}" data-categoria="${p.categoria}" data-precio="${p.precio}">
            <div class="producto-imagen">
                <img src="${p.imagen}" alt="${p.nombre}" loading="lazy">
                <button class="btn-wishlist${enWish ? ' activo' : ''}" data-id="${p.id}" title="Wishlist" aria-label="Wishlist">
                    <i class="fa-${enWish ? 'solid' : 'regular'} fa-heart"></i>
                </button>
            </div>
            <div class="producto-info">
                <span class="producto-precio">$${p.precio.toLocaleString('es-MX')}.00</span>
                <span class="producto-nombre">${p.nombre}</span>
                <span class="producto-categoria">${p.categoria}</span>
                <span class="producto-vendedor">${p.vendedor}</span>
                <div class="producto-botones">
                    <button class="btn-ver">Ver Producto</button>
                    <button class="btn-comprar">Agregar al carrito</button>
                </div>
            </div>
        </div>`;
}

const nuevos     = CATALOGO.filter(p => p.nuevo);
const destacados = CATALOGO.filter(p => p.categoria === 'Figuras');

document.getElementById('nuevoTrack').innerHTML     = nuevos.map(crearCardHTML).join('');
document.getElementById('productosTrack').innerHTML = destacados.map(crearCardHTML).join('');


/* ── 2. INICIALIZACIÓN DE CARRUSELES ── */

crearCarrusel({
    trackId:      'carruselTrack',
    btnIzqId:     'btnIzq',
    btnDerId:     'btnDer',
    itemSelector: '.carrusel-item',
    gap:          20,
    autoplayMs:   3000,
});

crearCarrusel({
    trackId:      'nuevoTrack',
    btnIzqId:     'btnIzqNuevo',
    btnDerId:     'btnDerNuevo',
    itemSelector: '.producto-card',
    gap:          20,
    autoplayMs:   3500,
});

crearCarrusel({
    trackId:      'productosTrack',
    btnIzqId:     'btnIzqProd',
    btnDerId:     'btnDerProd',
    itemSelector: '.producto-card',
    gap:          20,
    autoplayMs:   4000,
});


/* ── 3. NAVEGACIÓN A DETALLE DE PRODUCTO ── */

function irADetalle(id, nombre, categoria, precio) {
    const params = new URLSearchParams();
    if (id)       params.set('id',        id);
    params.set('nombre',    nombre);
    params.set('categoria', categoria);
    if (precio)   params.set('precio',    precio);
    navegarConFade(`producto.html?${params.toString()}`);
}

function bindNavCards(trackId) {
    document.querySelectorAll(`#${trackId} .producto-card`).forEach(card => {
        card.addEventListener('click', e => {
            if (e.target.closest('.btn-ver, .btn-comprar, .btn-wishlist')) return;
            irADetalle(card.dataset.productId, card.dataset.nombre, card.dataset.categoria, card.dataset.precio);
        });

        card.querySelector('.btn-ver')?.addEventListener('click', e => {
            e.stopPropagation();
            irADetalle(card.dataset.productId, card.dataset.nombre, card.dataset.categoria, card.dataset.precio);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    bindNavCards('nuevoTrack');
    bindNavCards('productosTrack');

    document.querySelectorAll('#carruselTrack .carrusel-item').forEach(item => {
        item.addEventListener('click', () => {
            const q = item.querySelector('span')?.textContent.trim() || 'Figuras';
            navegarConFade(`resultados.html?q=${encodeURIComponent(q)}`);
        });
    });
});


/* El carrito.js maneja globalmente todos los clics en .btn-comprar */
