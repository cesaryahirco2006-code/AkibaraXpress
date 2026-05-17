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

/* ── Filtrar productos ── */
function filtrarProductos() {
    const q = query.toLowerCase();
    return CATALOGO.filter(p =>
        p.nombre.toLowerCase().includes(q)    ||
        p.categoria.toLowerCase().includes(q) ||
        p.serie.toLowerCase().includes(q)
    );
}

/* ── Crear tarjeta de producto ── */
function crearTarjeta(p) {
    const enWish = Wishlist.tiene(p.id);
    return `
        <div class="producto-card" data-product-id="${p.id}" data-nombre="${p.nombre}"
             data-categoria="${p.categoria}" data-precio="${p.precio}">
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

    vacio.hidden     = true;
    grid.innerHTML   = productos.map(crearTarjeta).join('');

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

/* ── Ordenamiento ── */
document.getElementById('resOrden').addEventListener('change', function () {
    let lista = filtrarProductos();
    if (this.value === 'precio-asc')  lista = [...lista].sort((a, b) => a.precio - b.precio);
    if (this.value === 'precio-desc') lista = [...lista].sort((a, b) => b.precio - a.precio);
    if (this.value === 'nombre')      lista = [...lista].sort((a, b) => a.nombre.localeCompare(b.nombre));
    renderizar(lista);
});

/* ── Filtros colapsables ── */
document.querySelectorAll('.res-filtro-titulo').forEach(btn => {
    btn.addEventListener('click', () => {
        const cuerpo = btn.nextElementSibling;
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
    const filtros = document.querySelector('.res-filtros');
    filtros.classList.toggle('visible');
    this.classList.toggle('abierto');
});

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => renderizar(filtrarProductos()));
