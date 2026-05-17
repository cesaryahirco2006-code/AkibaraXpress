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

// ── Texto grande ───────────────────────────────────────────────
const STORAGE_TEXTO = 'akibara-texto-grande';

function aplicarTextoGrande(activar) {
    document.body.classList.toggle('texto-grande', activar);
    document.getElementById('btnTextoGrande').classList.toggle('activo', activar);
}

aplicarTextoGrande(localStorage.getItem(STORAGE_TEXTO) === '1');

document.getElementById('btnTextoGrande').addEventListener('click', function () {
    const activo = !document.body.classList.contains('texto-grande');
    aplicarTextoGrande(activo);
    localStorage.setItem(STORAGE_TEXTO, activo ? '1' : '0');
});

// ── Reducir movimiento ─────────────────────────────────────────
const STORAGE_ANIM = 'akibara-sin-animaciones';

function aplicarSinAnimaciones(activar) {
    document.body.classList.toggle('sin-animaciones', activar);
    document.getElementById('btnSinAnimaciones').classList.toggle('activo', activar);
}

aplicarSinAnimaciones(localStorage.getItem(STORAGE_ANIM) === '1');

document.getElementById('btnSinAnimaciones').addEventListener('click', function () {
    const activo = !document.body.classList.contains('sin-animaciones');
    aplicarSinAnimaciones(activo);
    localStorage.setItem(STORAGE_ANIM, activo ? '1' : '0');
});

// ── Alto contraste ─────────────────────────────────────────────
const STORAGE_CONT = 'akibara-alto-contraste';

function aplicarAltoContraste(activar) {
    document.body.classList.toggle('alto-contraste', activar);
    document.getElementById('btnAltoContraste').classList.toggle('activo', activar);
}

aplicarAltoContraste(localStorage.getItem(STORAGE_CONT) === '1');

document.getElementById('btnAltoContraste').addEventListener('click', function () {
    const activo = !document.body.classList.contains('alto-contraste');
    aplicarAltoContraste(activo);
    localStorage.setItem(STORAGE_CONT, activo ? '1' : '0');
});
