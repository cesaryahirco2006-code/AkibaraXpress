/* ============================================================
   js/header.js — Dropdown "Más", Menú hamburguesa y Scroll del header
   ============================================================ */

/* ── 1. DROPDOWN "MÁS" ── */
const masBtn = document.getElementById('mas-btn');

if (masBtn) {
    masBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        this.classList.toggle('active');
    });

    // Cerrar al hacer click fuera
    document.addEventListener('click', () => masBtn.classList.remove('active'));
}


/* ── 2. MENÚ HAMBURGUESA (móvil) ── */
const btnHamburguesa = document.getElementById('btnHamburguesa');
const subheader      = document.querySelector('.subheader');

if (btnHamburguesa && subheader) {
    btnHamburguesa.addEventListener('click', function () {
        const estaAbierto = subheader.classList.toggle('abierto');
        const icono       = this.querySelector('i');
        icono.className   = estaAbierto ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    });

    // Restaurar estado al redimensionar a desktop
    window.addEventListener('resize', function () {
        if (window.innerWidth > 900) {
            subheader.classList.remove('abierto');
            btnHamburguesa.querySelector('i').className = 'fa-solid fa-bars';
        }
    });
}


/* ── 3. SCROLL DEL HEADER ── */
const header = document.querySelector('header');

if (header) {
    window.addEventListener('scroll', function () {
        header.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
}
