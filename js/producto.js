/* ============================================================
   js/producto.js — Lógica de la página de detalle de producto
   Depende de: utils.js, catalogo.js, wishlist.js, carrito.js
   ============================================================ */

/* ── 1. GALERÍA — Miniaturas clicables ── */
const thumbs          = document.querySelectorAll('.pd-thumb');
const imagenPrincipal = document.getElementById('pdImagenPrincipal');

thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
        thumbs.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
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

function agregarAlCarrito() {
    const nombre    = document.getElementById('pdNombre')?.textContent.trim()    || 'Producto';
    const precioTxt = document.getElementById('pdPrecio')?.textContent.replace(/[^0-9.]/g, '') || '0';
    const categoria = document.getElementById('bc-categoria')?.textContent.trim() || 'General';
    const precio    = parseFloat(precioTxt) || 999;
    const imagen    = document.getElementById('pdImagenPrincipal')?.querySelector('img')?.src || '';

    for (let i = 0; i < cantidad; i++) {
        Carrito.agregar(nombre, precio, categoria, imagen);
    }
}

btnAgregar?.addEventListener('click', () => {
    mostrarToast();
    agregarAlCarrito();
});

document.getElementById('btnComprar')?.addEventListener('click', () => {
    mostrarToast();
    agregarAlCarrito();
});

/* Botones "Agregar al carrito" en tarjetas de relacionados (carrito.js ya los maneja globalmente) */


/* ── 4. TARJETA HTML — misma estructura que index.js ── */
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


/* ── 5. INICIALIZACIÓN PRINCIPAL ── */
(function initDatosDinamicos() {
    const params = new URLSearchParams(window.location.search);
    const id     = params.get('id');

    const prod = (typeof CATALOGO !== 'undefined' && id)
        ? CATALOGO.find(p => p.id === id)
        : null;

    const NOMBRE    = prod ? prod.nombre    : (params.get('nombre')    ? decodeURIComponent(params.get('nombre'))    : 'Nombre del Producto');
    const PRECIO_N  = prod ? prod.precio    : (parseFloat(params.get('precio')) || 999);
    const PRECIO    = `$${PRECIO_N.toLocaleString('es-MX')}.00`;
    const CATEGORIA = prod ? prod.categoria : (params.get('categoria') ? decodeURIComponent(params.get('categoria')) : 'General');
    const VENDEDOR  = prod ? prod.vendedor  : 'AkibaraXpress';

    document.title = `${NOMBRE} — AkibaraXpress`;

    const bcProducto  = document.getElementById('bc-producto');
    if (bcProducto) bcProducto.textContent = NOMBRE;

    const bcCategoria = document.getElementById('bc-categoria');
    if (bcCategoria) {
        bcCategoria.textContent = CATEGORIA;
        bcCategoria.addEventListener('click', e => {
            e.preventDefault();
            navegarConFade(`resultados.html?q=${encodeURIComponent(CATEGORIA)}`);
        });
    }

    const pdNombre = document.getElementById('pdNombre');
    if (pdNombre) pdNombre.textContent = NOMBRE;

    const pdNombreDesc = document.getElementById('pdNombreDesc');
    if (pdNombreDesc) pdNombreDesc.textContent = NOMBRE;

    const pdPrecio = document.getElementById('pdPrecio');
    if (pdPrecio) pdPrecio.textContent = PRECIO;

    const vendedorLink = document.querySelector('.pd-vendedor-link');
    if (vendedorLink) vendedorLink.textContent = VENDEDOR;

    /* Imagen principal */
    if (prod?.imagen) {
        const contenedor = document.getElementById('pdImagenPrincipal');
        if (contenedor) {
            const icono = contenedor.querySelector('i');
            if (icono) icono.remove();
            const img = document.createElement('img');
            img.src   = prod.imagen;
            img.alt   = prod.nombre;
            img.style.cssText = 'width:100%;height:100%;object-fit:contain;padding:12px;box-sizing:border-box;';
            contenedor.prepend(img);
        }

        const thumb0 = document.querySelector('.pd-thumb[data-index="0"]');
        if (thumb0) {
            thumb0.innerHTML = `<img src="${prod.imagen}" alt="${prod.nombre}" style="width:100%;height:100%;object-fit:contain;padding:4px;box-sizing:border-box;">`;
        }
    }

    /* ── Wishlist button ── */
    const btnWish = document.querySelector('.pd-btn-wish');
    if (btnWish && prod) {
        const aplicarEstadoWish = (estaEnWish) => {
            const icono = btnWish.querySelector('i');
            btnWish.classList.toggle('activo', estaEnWish);
            icono.className = estaEnWish ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
        };

        aplicarEstadoWish(Wishlist.tiene(prod.id));

        btnWish.addEventListener('click', () => {
            const agregado = Wishlist.toggle(prod.id);
            aplicarEstadoWish(agregado);

            btnWish.classList.remove('animando');
            void btnWish.offsetWidth;
            btnWish.classList.add('animando');
            setTimeout(() => btnWish.classList.remove('animando'), 450);

            if (agregado) {
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
    } else if (btnWish) {
        /* Sin ID de producto: comportamiento visual simple */
        btnWish.addEventListener('click', () => {
            const activo = btnWish.classList.toggle('activo');
            btnWish.querySelector('i').className = activo ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
        });
    }

    /* ── Productos relacionados ── */
    const track = document.getElementById('relacionadosTrack');
    if (track && typeof CATALOGO !== 'undefined') {
        const relacionados = CATALOGO.filter(p =>
            p.id !== (prod?.id) &&
            (prod ? (p.categoria === prod.categoria || p.serie === prod.serie) : true)
        );

        /* Si hay pocos, completa con más de la misma categoría */
        let lista = relacionados;
        if (lista.length < 4 && prod) {
            const extras = CATALOGO.filter(p => p.id !== prod.id && !lista.includes(p));
            lista = [...lista, ...extras].slice(0, 10);
        }

        track.innerHTML = lista.map(crearCardHTML).join('');

        /* Navegación desde tarjetas relacionadas */
        track.querySelectorAll('.producto-card').forEach(card => {
            card.addEventListener('click', e => {
                if (e.target.closest('.btn-ver, .btn-comprar, .btn-wishlist')) return;
                const p = new URLSearchParams();
                p.set('id',        card.dataset.productId);
                p.set('nombre',    card.dataset.nombre);
                p.set('categoria', card.dataset.categoria);
                p.set('precio',    card.dataset.precio);
                navegarConFade(`producto.html?${p.toString()}`);
            });

            card.querySelector('.btn-ver')?.addEventListener('click', e => {
                e.stopPropagation();
                const p = new URLSearchParams();
                p.set('id',        card.dataset.productId);
                p.set('nombre',    card.dataset.nombre);
                p.set('categoria', card.dataset.categoria);
                p.set('precio',    card.dataset.precio);
                navegarConFade(`producto.html?${p.toString()}`);
            });
        });
    }

    /* ── Carrusel de relacionados (se inicia después de llenar el track) ── */
    crearCarrusel({
        trackId:      'relacionadosTrack',
        btnIzqId:     'btnIzqRel',
        btnDerId:     'btnDerRel',
        itemSelector: '.producto-card',
        gap:          20,
        autoplayMs:   5000,
    });
})();
