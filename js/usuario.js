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


    /* ── Guardar información personal — actualiza toda la página ── */
    document.getElementById('btnGuardarInfo')?.addEventListener('click', () => {
        const nombre   = document.getElementById('cfg-nombre')?.value.trim()   || '';
        const apellido = document.getElementById('cfg-apellido')?.value.trim() || '';

        const nombreCompleto = [nombre, apellido].filter(Boolean).join(' ');
        const iniciales      = (nombre.charAt(0) + apellido.charAt(0)).toUpperCase() || 'U';

        /* Hero */
        const elNombre = document.querySelector('.usuario-nombre');
        if (elNombre) elNombre.textContent = nombreCompleto;

        const elAvatar = document.querySelector('.usuario-avatar');
        if (elAvatar) elAvatar.textContent = iniciales;

        /* Header — nombre del cliente */
        const elHeader = document.querySelector('.nombre-cliente');
        if (elHeader) elHeader.textContent = nombreCompleto;

        /* Título de la pestaña del navegador */
        document.title = `${nombreCompleto} — AkibaraXpress`;

        feedbackGuardado(document.getElementById('btnGuardarInfo'));
    });

    /* Otros botones de guardar (seguridad, notificaciones) */
    document.querySelectorAll('.config-guardar:not(#btnGuardarInfo)').forEach(btn => {
        btn.addEventListener('click', () => feedbackGuardado(btn));
    });


    /* ── Wishlist — quitar producto ── */
    document.addEventListener('click', e => {
        const btn = e.target.closest('.wish-quitar-btn');
        if (!btn) return;
        const card = btn.closest('.producto-card');
        if (!card) return;
        card.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
        card.style.opacity    = '0';
        card.style.transform  = 'scale(0.92)';
        setTimeout(() => {
            card.remove();
            actualizarConteoWishlist();
        }, 260);
    });

    function actualizarConteoWishlist() {
        const count    = document.querySelectorAll('#tab-wishlist .producto-card').length;
        const statWish = document.querySelector('.usuario-stat[data-tab="wishlist"] .usuario-stat-valor');
        if (statWish) statWish.textContent = count;

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


    /* ── Tab inicial ── */
    activarTab('wishlist');
});
