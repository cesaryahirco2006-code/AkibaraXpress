/* ============================================================
   js/modo-oscuro.js — Lógica de modo oscuro con persistencia
   ============================================================ */

const STORAGE_KEY = 'akibara-modo-oscuro';

// Aplica o quita la clase .modo-oscuro y sincroniza el botón del menú.
function aplicarModo(activar) {
    document.body.classList.toggle('modo-oscuro', activar);
    const icono = document.querySelector('#btnModoOscuro i');
    const label = document.querySelector('#btnModoOscuro span');
    if (icono) icono.className = activar ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    if (label) label.textContent = activar ? 'Modo claro' : 'Modo oscuro';
    const btn = document.getElementById('btnModoOscuro');
    if (btn) btn.classList.toggle('activo', activar);
}

// Restaurar preferencia guardada al cargar
(function restaurarModo() {
    aplicarModo(localStorage.getItem(STORAGE_KEY) === '1');
})();
