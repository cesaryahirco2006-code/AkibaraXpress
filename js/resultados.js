/* ============================================================
   js/resultados.js — Lógica de la página de resultados
   Depende de: utils.js, catalogo.js, wishlist.js, carrito.js
   ============================================================ */

/* ── Leer query de la URL ── */
const params = new URLSearchParams(window.location.search);
const query  = params.get('q') || '';

/* ── Mostrar query en UI ── */
document.getElementById('queryLabel').textContent    = query;
document.getElementById('bcQuery').textContent       = `"${query}"`;
document.getElementById('resVacioQuery').textContent = query;

const searchInput = document.getElementById('searchInput');
if (searchInput) searchInput.value = query;

/* ── Estado global ── */
let ordenActual = 'relevancia';

/* ── Leer filtros activos ── */
function obtenerFiltros() {
    const cats    = [...document.querySelectorAll('#filtros-cat input:checked')].map(c => c.value);
    const precios = [...document.querySelectorAll('#filtros-precio input:checked')].map(c => c.value);
    const stocks  = [...document.querySelectorAll('#filtros-stock input:checked')].map(c => c.value);
    return { cats, precios, stocks };
}

/* ── Filtrar + ordenar ── */
function obtenerProductos() {
    const q = query.toLowerCase();
    const { cats, precios, stocks } = obtenerFiltros();

    let lista = CATALOGO.filter(p => {
        /* Búsqueda por texto */
        if (q) {
            const matchQ = p.nombre.toLowerCase().includes(q) ||
                           p.categoria.toLowerCase().includes(q) ||
                           p.serie.toLowerCase().includes(q);
            if (!matchQ) return false;
        }

        /* Categoría */
        if (cats.length && !cats.includes(p.categoria.toLowerCase())) return false;

        /* Precio */
        if (precios.length) {
            const ok = precios.some(rango => {
                if (rango === '0-500')     return p.precio <= 500;
                if (rango === '500-1000')  return p.precio > 500  && p.precio <= 1000;
                if (rango === '1000-2000') return p.precio > 1000 && p.precio <= 2000;
                if (rango === '2000+')     return p.precio > 2000;
                return false;
            });
            if (!ok) return false;
        }

        /* Disponibilidad */
        if (stocks.length && !stocks.includes(p.stock)) return false;

        return true;
    });

    /* Orden */
    if (ordenActual === 'precio-asc')  lista = [...lista].sort((a, b) => a.precio - b.precio);
    if (ordenActual === 'precio-desc') lista = [...lista].sort((a, b) => b.precio - a.precio);
    if (ordenActual === 'nombre')      lista = [...lista].sort((a, b) => a.nombre.localeCompare(b.nombre));

    return lista;
}

/* ── Crear tarjeta de producto ── */
function crearTarjeta(p) {
    const enWish    = Wishlist.tiene(p.id);
    const agotado   = p.stock === 'agotado';
    const preventa  = p.stock === 'preventa';
    const badgeHtml = agotado  ? '<span class="prod-badge agotado-badge">Agotado</span>'
                    : preventa ? '<span class="prod-badge preventa-badge">Preventa</span>'
                    : '';
    return `
        <div class="producto-card${agotado ? ' card-agotado' : ''}" data-product-id="${p.id}" data-nombre="${p.nombre}"
             data-categoria="${p.categoria}" data-precio="${p.precio}">
            <div class="producto-imagen">
                <img src="${p.imagen}" alt="${p.nombre}" loading="lazy">
                ${badgeHtml}
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
                    <button class="btn-comprar"${agotado ? ' disabled' : ''}>${agotado ? 'Agotado' : 'Agregar al carrito'}</button>
                </div>
            </div>
        </div>`;
}

/* ── Renderizar grid ── */
function renderizar(productos) {
    const grid  = document.getElementById('resGrid');
    const vacio = document.getElementById('resVacio');
    const count = document.getElementById('resCount');

    count.textContent = `${productos.length} producto${productos.length !== 1 ? 's' : ''} encontrado${productos.length !== 1 ? 's' : ''}`;

    if (productos.length === 0) {
        grid.innerHTML = '';
        vacio.hidden   = false;
        return;
    }

    vacio.hidden   = true;
    grid.innerHTML = productos.map(crearTarjeta).join('');

    grid.querySelectorAll('.producto-card').forEach(card => {
        card.addEventListener('click', e => {
            if (e.target.closest('.btn-ver, .btn-comprar, .btn-wishlist')) return;
            navegarConFade(`producto.html?id=${card.dataset.productId}&nombre=${encodeURIComponent(card.dataset.nombre)}&categoria=${encodeURIComponent(card.dataset.categoria)}&precio=${card.dataset.precio}`);
        });

        card.querySelector('.btn-ver')?.addEventListener('click', e => {
            e.stopPropagation();
            navegarConFade(`producto.html?id=${card.dataset.productId}&nombre=${encodeURIComponent(card.dataset.nombre)}&categoria=${encodeURIComponent(card.dataset.categoria)}&precio=${card.dataset.precio}`);
        });
    });
}

/* ── Actualizar (filtros + orden + render) ── */
function actualizar() {
    renderizar(obtenerProductos());
}

/* ── Escuchar cambios en checkboxes ── */
document.querySelectorAll('.res-checkbox input').forEach(cb => {
    cb.addEventListener('change', actualizar);
});

/* ── Ordenamiento ── */
document.getElementById('resOrden').addEventListener('change', function () {
    ordenActual = this.value;
    actualizar();
});

/* ── Filtros colapsables ── */
document.querySelectorAll('.res-filtro-titulo').forEach(btn => {
    btn.addEventListener('click', () => {
        const cuerpo  = btn.nextElementSibling;
        const abierto = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', !abierto);
        btn.classList.toggle('collapsed', abierto);
        cuerpo.classList.toggle('oculto', abierto);
        if (!abierto) cuerpo.style.maxHeight = cuerpo.scrollHeight + 'px';
        else          cuerpo.style.maxHeight = null;
    });

    const cuerpo = btn.nextElementSibling;
    cuerpo.style.maxHeight = cuerpo.scrollHeight + 'px';
});

/* ── Limpiar filtros ── */
document.getElementById('btnLimpiarFiltros').addEventListener('click', () => {
    document.querySelectorAll('.res-checkbox input').forEach(cb => cb.checked = false);
    actualizar();
});

/* ── Vista grilla / lista ── */
document.getElementById('btnGrid').addEventListener('click', () => {
    document.getElementById('resGrid').classList.remove('vista-lista');
    document.getElementById('btnGrid').classList.add('active');
    document.getElementById('btnLista').classList.remove('active');
});

document.getElementById('btnLista').addEventListener('click', () => {
    document.getElementById('resGrid').classList.add('vista-lista');
    document.getElementById('btnLista').classList.add('active');
    document.getElementById('btnGrid').classList.remove('active');
});

/* ── Toggle filtros (mobile) ── */
document.getElementById('btnToggleFiltros')?.addEventListener('click', function () {
    document.querySelector('.res-filtros').classList.toggle('visible');
    this.classList.toggle('abierto');
});

/* ── Init ── */
document.addEventListener('DOMContentLoaded', actualizar);
