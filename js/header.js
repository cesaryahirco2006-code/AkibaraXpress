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

/* ── 4. SINCRONIZACIÓN SUBHEADER — Solo en desktop ── */
if (header && subheader) {
    let rafId = null;

    function syncSubheaderTop() {
        subheader.style.top = header.offsetHeight + 'px';
    }

    function startSubheaderSync() {
        if (rafId) return;
        (function loop() {
            syncSubheaderTop();
            rafId = requestAnimationFrame(loop);
        })();
    }

    function stopSubheaderSync() {
        cancelAnimationFrame(rafId);
        rafId = null;
        syncSubheaderTop();
    }

    /* En desktop: desactiva la transición CSS de top y sincroniza con JS.
       En móvil: subheader es position:static, top no aplica; restaurar
       la transición para que funcione la animación del menú hamburguesa. */
    function aplicarModoSync() {
        if (window.innerWidth > 768) {
            subheader.style.transition = 'none';
            syncSubheaderTop();
        } else {
            subheader.style.removeProperty('transition');
            subheader.style.removeProperty('top');
        }
    }

    header.addEventListener('transitionstart',  e => { if (e.propertyName === 'height') startSubheaderSync(); });
    header.addEventListener('transitionend',    e => { if (e.propertyName === 'height') stopSubheaderSync(); });
    header.addEventListener('transitioncancel', e => { if (e.propertyName === 'height') stopSubheaderSync(); });

    aplicarModoSync();
    window.addEventListener('resize', aplicarModoSync);
}

// ── Buscador ──
function initBuscador() {
    const input = document.querySelector('.container input');
    const btn   = document.querySelector('.container button');
    if (!input || !btn) return;

    function buscar() {
        const q = input.value.trim();
        if (!q) return;
        navegarConFade(`resultados.html?q=${encodeURIComponent(q)}`);
    }

    btn.addEventListener('click', buscar);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') buscar(); });
}

document.addEventListener('DOMContentLoaded', initBuscador);


/* ── 6. NAVEGACIÓN DEL SUBHEADER ── */
function initNavItems() {
    // Items principales: Figuras, Mangas, Series, TCG, Apparel
    document.querySelectorAll('.nav-centro .nav-item:not(#mas-btn)').forEach(item => {
        item.addEventListener('click', function () {
            const q = this.querySelector('span')?.textContent.trim();
            if (q) navegarConFade(`resultados.html?q=${encodeURIComponent(q)}`);
        });
    });

    // Dropdown "Más": Juegos, Preventas, Promociones, Subastas, Mercancía
    document.querySelectorAll('#dropdown-mas a').forEach(a => {
        a.addEventListener('click', function (e) {
            e.preventDefault();
            const q = this.textContent.trim();
            if (q) navegarConFade(`resultados.html?q=${encodeURIComponent(q)}`);
        });
    });

    // Destacado: FIFA World Cup 26
    document.querySelector('.nav-item.destacado')?.addEventListener('click', function () {
        const q = this.querySelector('span')?.textContent.trim();
        if (q) navegarConFade(`resultados.html?q=${encodeURIComponent(q)}`);
    });
}

document.addEventListener('DOMContentLoaded', initNavItems);
