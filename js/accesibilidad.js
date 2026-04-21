/* ============================================================
   js/accesibilidad.js — Menú lateral de accesibilidad
   ============================================================ */

const STORAGE_CURSOR = 'akibara-cursor-grande';

// ── Apertura / cierre del panel ──────────────────────────────
const btnAccesibilidad = document.getElementById('btnAccesibilidad');
const panel            = document.getElementById('menuAccesibilidad');
const overlay          = document.getElementById('accesibilidadOverlay');
const btnCerrar        = document.getElementById('btnCerrarMenu');

function abrirMenu() {
    panel.classList.add('abierto');
    overlay.classList.add('visible');
    btnAccesibilidad.setAttribute('aria-expanded', 'true');
    panel.setAttribute('aria-hidden', 'false');
    btnCerrar.focus();
}

function cerrarMenu() {
    panel.classList.remove('abierto');
    overlay.classList.remove('visible');
    btnAccesibilidad.setAttribute('aria-expanded', 'false');
    panel.setAttribute('aria-hidden', 'true');
    btnAccesibilidad.focus();
}

btnAccesibilidad.addEventListener('click', abrirMenu);
btnCerrar.addEventListener('click', cerrarMenu);
overlay.addEventListener('click', cerrarMenu);

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && panel.classList.contains('abierto')) cerrarMenu();
});

// ── Modo oscuro (reutiliza aplicarModo() de modo-oscuro.js) ──
document.getElementById('btnModoOscuro').addEventListener('click', function () {
    const oscuro = document.body.classList.toggle('modo-oscuro');
    aplicarModo(oscuro);
    localStorage.setItem(STORAGE_KEY, oscuro ? '1' : '0');
});

// ── Cursor grande ─────────────────────────────────────────────
function aplicarCursorGrande(activar) {
    document.body.classList.toggle('cursor-grande', activar);
    document.getElementById('btnCursorGrande').classList.toggle('activo', activar);
}

aplicarCursorGrande(localStorage.getItem(STORAGE_CURSOR) === '1');

document.getElementById('btnCursorGrande').addEventListener('click', function () {
    const activo = !document.body.classList.contains('cursor-grande');
    aplicarCursorGrande(activo);
    localStorage.setItem(STORAGE_CURSOR, activo ? '1' : '0');
});
