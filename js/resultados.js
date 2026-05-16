/* ============================================================
   js/resultados.js — Lógica de la página de resultados
   ============================================================ */

/* ── Datos de ejemplo (reemplaza con tu API/BD cuando tengas) ── */
const PRODUCTOS_DEMO = [
    { nombre: 'Figura Goku Ultra Instinct', categoria: 'Figuras', precio: 1299, vendedor: 'AkibaraXpress' },
    { nombre: 'Manga One Piece Vol. 105',   categoria: 'Mangas',  precio: 189,  vendedor: 'AkibaraXpress' },
    { nombre: 'Figura Naruto Shippuden',    categoria: 'Figuras', precio: 899,  vendedor: 'AkibaraXpress' },
    { nombre: 'TCG Pokémon Booster',        categoria: 'TCG',     precio: 299,  vendedor: 'AkibaraXpress' },
    { nombre: 'Manga Dragon Ball Super',    categoria: 'Mangas',  precio: 175,  vendedor: 'AkibaraXpress' },
    { nombre: 'Figura Rem Re:Zero',         categoria: 'Figuras', precio: 2199, vendedor: 'AkibaraXpress' },
    { nombre: 'Playera Akatsuki',           categoria: 'Apparel', precio: 450,  vendedor: 'AkibaraXpress' },
    { nombre: 'Figura Zenitsu Agatsuma',    categoria: 'Figuras', precio: 1099, vendedor: 'AkibaraXpress' },
    { nombre: 'Manga Jujutsu Kaisen Vol. 24', categoria: 'Mangas', precio: 189, vendedor: 'AkibaraXpress' },
    { nombre: 'TCG One Piece Card Game',    categoria: 'TCG',     precio: 350,  vendedor: 'AkibaraXpress' },
    { nombre: 'Figura Mikasa Ackermann',    categoria: 'Figuras', precio: 1599, vendedor: 'AkibaraXpress' },
    { nombre: 'Hoodie Dragon Ball Z',       categoria: 'Apparel', precio: 750,  vendedor: 'AkibaraXpress' },
];

/* ── Leer query de la URL ── */
const params = new URLSearchParams(window.location.search);
const query  = params.get('q') || '';

/* ── Mostrar query en UI ── */
document.getElementById('queryLabel').textContent  = query;
document.getElementById('bcQuery').textContent     = `"${query}"`;
document.getElementById('resVacioQuery').textContent = query;

// Pre-llenar el input del header con la búsqueda actual
const searchInput = document.getElementById('searchInput');
if (searchInput) searchInput.value = query;

/* ── Filtrar productos según query ── */
function filtrarProductos() {
    const q = query.toLowerCase();
    return PRODUCTOS_DEMO.filter(p =>
        p.nombre.toLowerCase().includes(q) ||
        p.categoria.toLowerCase().includes(q)
    );
}

/* ── Crear tarjeta de producto ── */
function crearTarjeta(producto) {
    return `
        <div class="producto-card" data-nombre="${producto.nombre}"
             data-categoria="${producto.categoria}" data-precio="${producto.precio}">
            <div class="producto-imagen"><i class="fa-regular fa-image"></i></div>
            <div class="producto-info">
                <span class="producto-precio">$${producto.precio.toLocaleString('es-MX')}.00</span>
                <span class="producto-nombre">${producto.nombre}</span>
                <span class="producto-categoria">${producto.categoria}</span>
                <span class="producto-vendedor">${producto.vendedor}</span>
                <div class="producto-botones">
                    <button class="btn-ver">Ver Producto</button>
                    <button class="btn-comprar">Agregar al carrito</button>
                </div>
            </div>
        </div>
    `;
}

/* ── Renderizar grid ── */
function renderizar(productos) {
    const grid  = document.getElementById('resGrid');
    const vacio = document.getElementById('resVacio');
    const count = document.getElementById('resCount');

    count.textContent = `${productos.length} producto${productos.length !== 1 ? 's' : ''} encontrado${productos.length !== 1 ? 's' : ''}`;

    if (productos.length === 0) {
        grid.innerHTML = '';
        vacio.hidden = false;
        return;
    }

    vacio.hidden = true;
    grid.innerHTML = productos.map(crearTarjeta).join('');

    // Navegación a detalle al hacer clic en tarjeta
    grid.querySelectorAll('.producto-card').forEach(card => {
        card.addEventListener('click', e => {
            if (e.target.closest('.btn-ver, .btn-comprar')) return;
            navegarConFade(`producto.html?nombre=${encodeURIComponent(card.dataset.nombre)}&categoria=${encodeURIComponent(card.dataset.categoria)}&precio=${card.dataset.precio}`);
        });

        card.querySelector('.btn-ver')?.addEventListener('click', e => {
            e.stopPropagation();
            navegarConFade(`producto.html?nombre=${encodeURIComponent(card.dataset.nombre)}&categoria=${encodeURIComponent(card.dataset.categoria)}&precio=${card.dataset.precio}`);
        });
    });
}

/* ── Ordenamiento ── */
document.getElementById('resOrden').addEventListener('change', function () {
    let lista = filtrarProductos();
    if (this.value === 'precio-asc')  lista.sort((a, b) => a.precio - b.precio);
    if (this.value === 'precio-desc') lista.sort((a, b) => b.precio - a.precio);
    if (this.value === 'nombre')      lista.sort((a, b) => a.nombre.localeCompare(b.nombre));
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
        else cuerpo.style.maxHeight = null;
    });

    // Inicializar altura
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

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => renderizar(filtrarProductos()));
