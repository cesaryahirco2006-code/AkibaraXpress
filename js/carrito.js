/* ============================================================
   carrito.js — Panel de carrito de compras (todas las páginas)
   Persiste en localStorage para mantener el estado entre páginas.
   ============================================================ */

const Carrito = (() => {
    const STORAGE_KEY  = 'akibara_carrito';
    const ORDENES_KEY  = 'akibara_ordenes';

    let items = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

    const panel     = document.getElementById('panelCarrito');
    const overlay   = document.getElementById('carritoOverlay');
    const lista     = document.getElementById('carritoLista');
    const vacio     = document.getElementById('carritoVacio');
    const footer    = document.getElementById('carritoFooter');
    const totalEl   = document.getElementById('carritoTotal');
    const badge     = document.getElementById('carritoBadge');
    const iconoCart = document.querySelector('.carrito i');

    /* ── Persistencia ── */
    function guardar() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }

    /* ── Abrir / Cerrar ── */
    function abrir() {
        panel.classList.add('abierto');
        overlay.classList.add('visible');
        panel.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function cerrar() {
        panel.classList.remove('abierto');
        overlay.classList.remove('visible');
        panel.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    /* ── Agregar producto ── */
    function agregar(nombre, precio, categoria, imagen = '') {
        const existente = items.find(i => i.nombre === nombre);
        if (existente) {
            existente.cantidad += 1;
        } else {
            items.push({ nombre, precio: parseFloat(precio) || 0, categoria: categoria || 'General', cantidad: 1, imagen });
        }
        guardar();
        renderizar();
        animarIcono();
    }

    /* ── Cambiar cantidad ── */
    function cambiarCantidad(nombre, delta) {
        const item = items.find(i => i.nombre === nombre);
        if (!item) return;
        item.cantidad += delta;
        if (item.cantidad <= 0) {
            items = items.filter(i => i.nombre !== nombre);
        }
        guardar();
        renderizar();
    }

    /* ── Eliminar producto ── */
    function eliminar(nombre) {
        items = items.filter(i => i.nombre !== nombre);
        guardar();
        renderizar();
    }

    /* ── Vaciar carrito ── */
    function vaciar() {
        items = [];
        guardar();
        renderizar();
    }

    /* ── Totales ── */
    function calcularTotal() {
        return items.reduce((acc, i) => acc + i.precio * i.cantidad, 0);
    }

    function totalItems() {
        return items.reduce((acc, i) => acc + i.cantidad, 0);
    }

    /* ── Renderizar lista ── */
    function renderizar() {
        lista.innerHTML = '';

        const hayItems = items.length > 0;
        vacio.style.display  = hayItems ? 'none' : 'flex';
        lista.style.display  = hayItems ? 'flex' : 'none';
        footer.style.display = hayItems ? 'flex' : 'none';

        items.forEach(item => {
            const el = document.createElement('div');
            el.className = 'carrito-item nuevo';
            el.dataset.nombre = item.nombre;

            el.innerHTML = `
                <div class="carrito-item-imagen">
                    ${item.imagen
                        ? `<img src="${item.imagen}" alt="${item.nombre}">`
                        : '<i class="fa-regular fa-image"></i>'}
                </div>
                <div class="carrito-item-info">
                    <span class="carrito-item-nombre" title="${item.nombre}">${item.nombre}</span>
                    <span class="carrito-item-categoria">${item.categoria}</span>
                    <span class="carrito-item-precio">$${(item.precio * item.cantidad).toFixed(2)}</span>
                    <div class="carrito-item-controles">
                        <button class="carrito-cantidad-btn btn-menos" aria-label="Disminuir cantidad">
                            <i class="fa-solid fa-minus"></i>
                        </button>
                        <span class="carrito-cantidad-valor">${item.cantidad}</span>
                        <button class="carrito-cantidad-btn btn-mas" aria-label="Aumentar cantidad">
                            <i class="fa-solid fa-plus"></i>
                        </button>
                    </div>
                </div>
                <button class="carrito-item-eliminar" aria-label="Eliminar ${item.nombre}">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            `;

            el.querySelector('.btn-menos').addEventListener('click', () => cambiarCantidad(item.nombre, -1));
            el.querySelector('.btn-mas').addEventListener('click',   () => cambiarCantidad(item.nombre, 1));
            el.querySelector('.carrito-item-eliminar').addEventListener('click', () => eliminar(item.nombre));

            lista.appendChild(el);

            requestAnimationFrame(() => {
                setTimeout(() => el.classList.remove('nuevo'), 260);
            });
        });

        totalEl.textContent = `$${calcularTotal().toFixed(2)}`;
        actualizarBadge();
    }

    /* ── Badge del header ── */
    function actualizarBadge() {
        if (!badge) return;
        const n = totalItems();
        badge.textContent = n > 99 ? '99+' : n;
        badge.classList.add('pop');
        setTimeout(() => badge.classList.remove('pop'), 350);
    }

    /* ── Animación del ícono ── */
    function animarIcono() {
        if (!iconoCart) return;
        iconoCart.classList.add('animando');
        setTimeout(() => iconoCart.classList.remove('animando'), 520);
    }

    /* ── Guardar orden en localStorage ── */
    function guardarOrden() {
        const orden = {
            id:     'AKB-' + Date.now(),
            fecha:  new Date().toISOString(),
            items:  JSON.parse(JSON.stringify(items)),
            total:  calcularTotal(),
            estado: 'en-camino',
        };
        const ordenes = JSON.parse(localStorage.getItem(ORDENES_KEY) || '[]');
        ordenes.unshift(orden);
        localStorage.setItem(ORDENES_KEY, JSON.stringify(ordenes));
    }

    /* ── Modal de pago ── */
    function crearModalPago() {
        const overlay = document.createElement('div');
        overlay.className = 'pago-overlay';
        overlay.innerHTML = `
            <div class="pago-modal">
                <div class="pago-dots">
                    <span></span><span></span><span></span>
                </div>
                <svg class="pago-check" viewBox="0 0 72 72" aria-hidden="true">
                    <circle class="pago-check-circle" cx="36" cy="36" r="34"/>
                    <polyline class="pago-check-tick" points="20,37 31,48 52,26"/>
                </svg>
                <p class="pago-titulo">Procesando pago…</p>
                <p class="pago-subtitulo">Esto solo tomará un momento</p>
            </div>`;
        document.body.appendChild(overlay);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => overlay.classList.add('visible'));
        });

        /* Después de 1.8s → transición a éxito */
        setTimeout(() => {
            guardarOrden();
            vaciar();

            const dots     = overlay.querySelector('.pago-dots');
            const check    = overlay.querySelector('.pago-check');
            const titulo   = overlay.querySelector('.pago-titulo');
            const subtitulo = overlay.querySelector('.pago-subtitulo');

            dots.style.display    = 'none';
            check.style.display   = 'block';
            titulo.textContent    = '¡Pago exitoso!';
            subtitulo.textContent = 'Tu pedido está en camino 🛍';

        }, 1800);

        /* Después de 3.8s → cerrar modal y panel */
        setTimeout(() => {
            overlay.classList.remove('visible');
            cerrar();
            setTimeout(() => overlay.remove(), 300);
        }, 3800);
    }

    /* ── Eventos globales ── */
    function init() {
        /* Abrir al hacer clic en el ícono del header */
        document.querySelector('.carrito')?.addEventListener('click', abrir);

        /* Cerrar con botón X */
        document.getElementById('btnCerrarCarrito')?.addEventListener('click', cerrar);

        /* Cerrar al hacer clic en overlay */
        overlay?.addEventListener('click', cerrar);

        /* Vaciar */
        document.getElementById('btnVaciarCarrito')?.addEventListener('click', vaciar);

        /* Proceder al pago */
        document.querySelector('.carrito-btn-pago')?.addEventListener('click', () => {
            if (items.length === 0) return;
            cerrar();
            setTimeout(crearModalPago, 280);
        });

        /* Tecla Escape */
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && panel?.classList.contains('abierto')) cerrar();
        });

        /* Botones "Agregar al carrito" en tarjetas .producto-card */
        document.addEventListener('click', e => {
            const btn = e.target.closest('.btn-comprar');
            if (!btn) return;
            const card = btn.closest('.producto-card');
            if (!card) return;

            const nombre    = card.querySelector('.producto-nombre')?.textContent.trim()   || 'Producto';
            const categoria = card.querySelector('.producto-categoria')?.textContent.trim() || 'General';
            const precioTxt = card.querySelector('.producto-precio')?.textContent.replace(/[^0-9.]/g, '') || '0';
            const imagen    = card.querySelector('.producto-imagen img')?.src               || '';

            agregar(nombre, parseFloat(precioTxt), categoria, imagen);
        });

        /* Render inicial (carga el estado desde localStorage) */
        renderizar();
    }

    return { init, agregar, cerrar, vaciar };
})();

document.addEventListener('DOMContentLoaded', Carrito.init);
