/* ============================================================
   usuario.js — Lógica de la página de perfil
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ── Tiempo de membresía ── */
    function calcularTiempoMiembro(fechaISO) {
        const inicio = new Date(fechaISO);
        const ahora  = new Date();
        let años  = ahora.getFullYear() - inicio.getFullYear();
        let meses = ahora.getMonth()    - inicio.getMonth();
        if (meses < 0) { años--; meses += 12; }
        const total = años * 12 + meses;
        if (total < 1)  return 'Nuevo miembro';
        if (total < 12) return `Miembro hace ${total} ${total === 1 ? 'mes' : 'meses'}`;
        if (meses === 0) return `Miembro hace ${años} ${años === 1 ? 'año' : 'años'}`;
        return `Miembro hace ${años} ${años === 1 ? 'año' : 'años'} y ${meses} ${meses === 1 ? 'mes' : 'meses'}`;
    }

    const elMiembro = document.querySelector('.usuario-miembro');
    if (elMiembro) {
        elMiembro.textContent = calcularTiempoMiembro(elMiembro.dataset.desde || '2023-01-01');
    }


    /* ── Tabs ── */
    const tabs   = document.querySelectorAll('.usuario-tab');
    const panels = document.querySelectorAll('.usuario-tab-panel');

    function activarTab(id) {
        tabs.forEach(t => t.classList.toggle('activo', t.dataset.tab === id));
        panels.forEach(p => p.classList.toggle('activo', p.id === `tab-${id}`));
        if (id === 'wishlist') Wishlist.renderizarTab('wishlistGrid', 'wishlistVacio');
    }

    tabs.forEach(tab => tab.addEventListener('click', () => activarTab(tab.dataset.tab)));

    document.querySelectorAll('.usuario-stat[data-tab]').forEach(stat => {
        stat.addEventListener('click', () => activarTab(stat.dataset.tab));
    });


    /* ── Feedback visual al guardar ── */
    function feedbackGuardado(btn) {
        const original = btn.innerHTML;
        btn.innerHTML  = '<i class="fa-solid fa-check"></i> Guardado';
        btn.disabled   = true;
        setTimeout(() => {
            btn.innerHTML = original;
            btn.disabled  = false;
        }, 2000);
    }


    /* ── Validación de teléfono ── */
    function validarTelefono(valor) {
        if (!valor) return true;
        const soloDigitos = valor.replace(/[\s\-()+]/g, '');
        return /^\d{10}$/.test(soloDigitos) && /^[\d\s\-()+]+$/.test(valor);
    }

    const inputTel = document.getElementById('cfg-tel');
    const telError = document.getElementById('telError');

    inputTel?.addEventListener('input', () => {
        const invalido = !validarTelefono(inputTel.value.trim());
        inputTel.classList.toggle('invalido', invalido);
        telError?.classList.toggle('visible', invalido);
    });


    /* ── Guardar información personal — actualiza toda la página ── */
    document.getElementById('btnGuardarInfo')?.addEventListener('click', () => {
        if (!validarTelefono(inputTel?.value.trim() || '')) {
            inputTel?.classList.add('invalido');
            telError?.classList.add('visible');
            inputTel?.focus();
            return;
        }

        const nombre   = document.getElementById('cfg-nombre')?.value.trim()   || '';
        const apellido = document.getElementById('cfg-apellido')?.value.trim() || '';

        const nombreCompleto = [nombre, apellido].filter(Boolean).join(' ');
        const iniciales      = (nombre.charAt(0) + apellido.charAt(0)).toUpperCase() || 'U';

        const elNombre = document.querySelector('.usuario-nombre');
        if (elNombre) elNombre.textContent = nombreCompleto;

        const elAvatar = document.querySelector('.usuario-avatar');
        if (elAvatar) elAvatar.textContent = iniciales;

        const elHeader = document.querySelector('.nombre-cliente');
        if (elHeader) elHeader.textContent = nombreCompleto;

        document.title = `${nombreCompleto} — AkibaraXpress`;

        feedbackGuardado(document.getElementById('btnGuardarInfo'));
    });

    /* ── Cambiar contraseña ── */
    const btnCambiarPass = document.getElementById('btnCambiarPass');
    if (btnCambiarPass) {
        const PASS_ACTUAL = 'CONTRASEÑA123';
        const inpActual   = document.getElementById('cfg-pass-actual');
        const inpNueva    = document.getElementById('cfg-pass-nueva');
        const inpConfirm  = document.getElementById('cfg-pass-confirm');
        const passError   = document.getElementById('passError');

        function mostrarError(msg) {
            passError.textContent = msg;
            passError.style.display = 'block';
        }

        btnCambiarPass.addEventListener('click', () => {
            passError.style.display = 'none';

            if (inpActual.value !== PASS_ACTUAL) {
                mostrarError('La contraseña actual no es correcta.');
                inpActual.focus();
                return;
            }
            if (inpNueva.value.length < 8) {
                mostrarError('La nueva contraseña debe tener al menos 8 caracteres.');
                inpNueva.focus();
                return;
            }
            if (inpNueva.value !== inpConfirm.value) {
                mostrarError('Las contraseñas no coinciden.');
                inpConfirm.focus();
                return;
            }

            inpActual.value  = '';
            inpNueva.value   = '';
            inpConfirm.value = '';
            feedbackGuardado(btnCambiarPass);
        });
    }


    /* ── Wishlist — quitar producto ── */
    document.addEventListener('click', e => {
        const btn = e.target.closest('.wish-quitar-btn');
        if (!btn) return;
        const card = btn.closest('.producto-card');
        if (!card) return;

        if (card.dataset.productId) Wishlist.toggle(card.dataset.productId);

        card.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
        card.style.opacity    = '0';
        card.style.transform  = 'scale(0.92)';
        setTimeout(() => {
            card.remove();
            actualizarConteoWishlist();
        }, 260);
    });

    function actualizarConteoWishlist() {
        const count    = document.querySelectorAll('#wishlistGrid .producto-card').length;
        const statWish = document.querySelector('.usuario-stat[data-tab="wishlist"] .usuario-stat-valor');
        if (statWish) statWish.textContent = count;

        const countEl = document.getElementById('wishlistCount');
        if (countEl) countEl.textContent = `(${count} producto${count !== 1 ? 's' : ''})`;

        const grid  = document.getElementById('wishlistGrid');
        const vacio = document.getElementById('wishlistVacio');
        if (grid && vacio) {
            grid.style.display  = count > 0 ? 'grid' : 'none';
            vacio.style.display = count > 0 ? 'none' : 'flex';
        }
    }


    /* ── Direcciones — eliminar ── */
    document.addEventListener('click', e => {
        const btn = e.target.closest('.direccion-btn-eliminar');
        if (!btn) return;
        const card = btn.closest('.direccion-card');
        if (!card) return;
        card.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
        card.style.opacity    = '0';
        card.style.transform  = 'scale(0.96)';
        setTimeout(() => card.remove(), 260);
    });


    /* ── Modal de proceso (pago / reembolso) ── */
    function mostrarModalProceso({ tituloInicio, subtituloInicio, tituloFin, subtituloFin, onMitad }) {
        const overlay = document.createElement('div');
        overlay.className = 'pago-overlay';
        overlay.innerHTML = `
            <div class="pago-modal">
                <div class="pago-dots"><span></span><span></span><span></span></div>
                <svg class="pago-check" viewBox="0 0 72 72" aria-hidden="true">
                    <circle class="pago-check-circle" cx="36" cy="36" r="34"/>
                    <polyline class="pago-check-tick" points="20,37 31,48 52,26"/>
                </svg>
                <p class="pago-titulo">${tituloInicio}</p>
                <p class="pago-subtitulo">${subtituloInicio}</p>
            </div>`;
        document.body.appendChild(overlay);
        requestAnimationFrame(() => requestAnimationFrame(() => overlay.classList.add('visible')));

        setTimeout(() => {
            if (onMitad) onMitad();
            overlay.querySelector('.pago-dots').style.display  = 'none';
            overlay.querySelector('.pago-check').style.display = 'block';
            overlay.querySelector('.pago-titulo').textContent    = tituloFin;
            overlay.querySelector('.pago-subtitulo').textContent = subtituloFin;
        }, 1800);

        setTimeout(() => {
            overlay.classList.remove('visible');
            setTimeout(() => overlay.remove(), 300);
        }, 3800);
    }

    /* ── Actualizar contador y estado vacío ── */
    function actualizarConteoOrdenes() {
        const cards   = document.querySelectorAll('.orden-card');
        const total   = cards.length;
        const countEl = document.getElementById('ordenesCount');
        const vaciEl  = document.getElementById('ordenesVacio');
        const lista   = document.getElementById('ordenesList');
        if (countEl) countEl.textContent = total > 0 ? `(${total} en total)` : '';
        if (vaciEl)  vaciEl.style.display = total === 0 ? 'flex' : 'none';
        if (lista)   lista.style.display  = total > 0  ? 'flex'  : 'none';
    }

    /* ── Cancelar orden ── */
    function cancelarOrden(card, ordenId) {
        mostrarModalProceso({
            tituloInicio:    'Procesando reembolso…',
            subtituloInicio: 'Esto puede tomar unos segundos',
            tituloFin:       '¡Reembolso completado!',
            subtituloFin:    'El monto será devuelto en 3–5 días hábiles',
            onMitad: () => {
                /* Eliminar del localStorage si es orden dinámica */
                if (ordenId) {
                    const guardadas = JSON.parse(localStorage.getItem('akibara_ordenes') || '[]');
                    localStorage.setItem('akibara_ordenes',
                        JSON.stringify(guardadas.filter(o => o.id !== ordenId)));
                }
                /* Animar salida de la tarjeta */
                card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
                card.style.opacity    = '0';
                card.style.transform  = 'scale(0.95)';
                setTimeout(() => { card.remove(); actualizarConteoOrdenes(); }, 380);
            },
        });
    }

    /* ── Agregar botón "Cancelar pedido" a una tarjeta ── */
    function agregarBtnCancelar(card, ordenId = null) {
        const acciones = card.querySelector('.orden-acciones');
        if (!acciones) return;
        const btn = document.createElement('button');
        btn.className   = 'btn-cancelar-orden';
        btn.textContent = 'Cancelar pedido';
        acciones.appendChild(btn);
        btn.addEventListener('click', () => cancelarOrden(card, ordenId));
    }

    /* ── Crear tarjeta de orden ── */
    function crearOrdenCard(orden) {
        const fecha  = new Date(orden.fecha).toLocaleDateString('es-MX', {
            day: 'numeric', month: 'long', year: 'numeric'
        });
        const thumbs = orden.items.slice(0, 3).map(i =>
            `<div class="orden-thumb">${i.imagen ? `<img src="${i.imagen}" alt="${i.nombre}">` : ''}</div>`
        ).join('');
        const extra  = orden.items.length > 3
            ? `<div class="orden-thumb-mas">+${orden.items.length - 3}</div>` : '';
        const total  = orden.total.toLocaleString('es-MX', { minimumFractionDigits: 2 });
        const count  = orden.items.reduce((s, i) => s + i.cantidad, 0);

        const card = document.createElement('div');
        card.className       = 'orden-card';
        card.dataset.ordenId = orden.id;
        card.innerHTML = `
            <div class="orden-header">
                <span class="orden-numero">${orden.id}</span>
                <span class="orden-fecha">${fecha}</span>
                <span class="orden-estado en-camino"><i class="fa-solid fa-truck"></i> En camino</span>
            </div>
            <div class="orden-cuerpo">
                <div class="orden-thumbs">${thumbs}${extra}</div>
                <div class="orden-resumen">
                    <span class="orden-total">$${total}</span>
                    <span class="orden-items-count">${count} producto${count !== 1 ? 's' : ''}</span>
                </div>
            </div>
            <div class="orden-acciones">
                <button class="btn-ver">Ver detalles</button>
                <button class="btn-comprar">Reordenar</button>
            </div>`;

        agregarBtnCancelar(card, orden.id);
        return card;
    }

    /* ── Órdenes desde localStorage (ordenadas por fecha desc) ── */
    function cargarOrdenesLS() {
        const lista = document.getElementById('ordenesList');
        if (!lista) return;

        const ordenes = JSON.parse(localStorage.getItem('akibara_ordenes') || '[]');
        ordenes.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        ordenes.forEach(orden => lista.appendChild(crearOrdenCard(orden)));

        actualizarConteoOrdenes();
    }

    cargarOrdenesLS();

    /* ── Tab inicial ── */
    activarTab('wishlist');
});
