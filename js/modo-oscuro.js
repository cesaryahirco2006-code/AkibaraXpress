/* ============================================================
   js/modo-oscuro.js — Toggle de modo oscuro con persistencia
   ============================================================ */

const STORAGE_KEY = 'akibara-modo-oscuro';

/**
 * Aplica o quita la clase .modo-oscuro y actualiza el ícono del botón.
 * @param {boolean} activar
 */
function aplicarModo(activar) {
    document.body.classList.toggle('modo-oscuro', activar);
    const icono = document.querySelector('#btnModo i');
    if (icono) icono.className = activar ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
}

// Restaurar preferencia guardada al cargar
(function restaurarModo() {
    aplicarModo(localStorage.getItem(STORAGE_KEY) === '1');
})();

// Toggle al hacer click
const btnModo = document.getElementById('btnModo');

if (btnModo) {
    btnModo.addEventListener('click', function () {
        const oscuro = document.body.classList.toggle('modo-oscuro');
        aplicarModo(oscuro);
        localStorage.setItem(STORAGE_KEY, oscuro ? '1' : '0');
    });
}
