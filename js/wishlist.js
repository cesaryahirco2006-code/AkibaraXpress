/* ============================================================
   wishlist.js — Sistema de wishlist con persistencia localStorage
   ============================================================ */

const Wishlist = (() => {
    const KEY = 'akibara_wishlist';

    function obtener() {
        return JSON.parse(localStorage.getItem(KEY) || '[]');
    }

    function guardar(ids) {
        localStorage.setItem(KEY, JSON.stringify(ids));
    }

    function tiene(id) {
        return obtener().includes(id);
    }

    function toggle(id) {
        const ids = obtener();
        const idx = ids.indexOf(id);
        if (idx >= 0) ids.splice(idx, 1);
        else ids.push(id);
        guardar(ids);
        return idx < 0;
    }

    /* HTML de una tarjeta de producto */
    function crearCardHTML(p, quitarBtn = false) {
        const enWish = tiene(p.id);
        const btnHTML = quitarBtn
            ? `<button class="wish-quitar-btn" data-id="${p.id}" title="Quitar de wishlist" aria-label="Quitar de wishlist"><i class="fa-solid fa-xmark"></i></button>`
            : `<button class="btn-wishlist${enWish ? ' activo' : ''}" data-id="${p.id}" title="${enWish ? 'Quitar de wishlist' : 'Agregar a wishlist'}" aria-label="Wishlist"><i class="fa-${enWish ? 'solid' : 'regular'} fa-heart"></i></button>`;

        return `
            <div class="producto-card" data-product-id="${p.id}" data-nombre="${p.nombre}" data-categoria="${p.categoria}" data-precio="${p.precio}">
                <div class="producto-imagen">
                    <img src="${p.imagen}" alt="${p.nombre}" loading="lazy">
                    ${btnHTML}
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

    /* Renderiza el tab de wishlist en usuario.html */
    function renderizarTab(gridId, vacioId) {
        const grid  = document.getElementById(gridId);
        const vacio = document.getElementById(vacioId);
        if (!grid || !vacio) return;

        const ids       = obtener();
        const productos = (typeof CATALOGO !== 'undefined')
            ? CATALOGO.filter(p => ids.includes(p.id))
            : [];

        const count = productos.length;

        if (count === 0) {
            grid.style.display  = 'none';
            vacio.style.display = 'flex';
        } else {
            vacio.style.display = 'none';
            grid.style.display  = 'grid';
            grid.innerHTML      = productos.map(p => crearCardHTML(p, true)).join('');
        }

        const statEl  = document.querySelector('.usuario-stat[data-tab="wishlist"] .usuario-stat-valor');
        if (statEl) statEl.textContent = count;

        const countEl = document.getElementById('wishlistCount');
        if (countEl) countEl.textContent = `(${count} producto${count !== 1 ? 's' : ''})`;
    }

    /* Actualiza estado visual de todos los .btn-wishlist de la página */
    function sincronizarBotones() {
        document.querySelectorAll('.btn-wishlist[data-id]').forEach(btn => {
            const activo = tiene(btn.dataset.id);
            btn.classList.toggle('activo', activo);
            btn.querySelector('i').className = `fa-${activo ? 'solid' : 'regular'} fa-heart`;
        });
    }

    /* Toggle al hacer clic en cualquier .btn-wishlist */
    document.addEventListener('click', e => {
        const btn = e.target.closest('.btn-wishlist[data-id]');
        if (!btn) return;
        e.stopPropagation();
        const ahora = toggle(btn.dataset.id);
        btn.classList.toggle('activo', ahora);
        btn.querySelector('i').className = `fa-${ahora ? 'solid' : 'regular'} fa-heart`;
    });

    document.addEventListener('DOMContentLoaded', sincronizarBotones);

    return { toggle, tiene, obtener, crearCardHTML, renderizarTab, sincronizarBotones };
})();
