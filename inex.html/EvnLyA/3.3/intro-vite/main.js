// Importar estilos
import './style.css';

// Configuración del juego
const dificultades = {
    easy: { min: 1, max: 50, nombre: "Fácil" },
    medium: { min: 1, max: 100, nombre: "Medio" },
    hard: { min: 1, max: 500, nombre: "Difícil" }
};

// Variables globales del juego
let dificultadActual = 'medium';
let numeroSecreto = generarNumeroSecreto();
let intentos = 0;
let juegoTerminado = false;
let historialIntentos = [];
let mejorPuntaje = localStorage.getItem('mejorPuntaje') || null;

// Elementos del DOM
const inputNumero = document.getElementById('numero');
const botonAdivinar = document.getElementById('adivinar');
const botonReiniciar = document.getElementById('reiniciar');
const mensaje = document.getElementById('mensaje');
const selectorDificultad = document.getElementById('dificultad');
const intentosCount = document.getElementById('intentos-count');
const rangoDisplay = document.getElementById('rango-display');
const mejorPuntajeDisplay = document.getElementById('mejor-puntaje');
const historialContainer = document.getElementById('historial-container');
const historial = document.getElementById('historial');

// Inicialización del juego
function inicializar() {
    actualizarUI();
    if (mejorPuntaje) {
        mejorPuntajeDisplay.textContent = mejorPuntaje;
    }
    inputNumero.focus();
}

// Generar número secreto según la dificultad
function generarNumeroSecreto() {
    const config = dificultades[dificultadActual];
    return Math.floor(Math.random() * (config.max - config.min + 1)) + config.min;
}

// Actualizar interfaz según la dificultad
function actualizarUI() {
    const config = dificultades[dificultadActual];
    inputNumero.min = config.min;
    inputNumero.max = config.max;
    inputNumero.placeholder = `Número entre ${config.min} y ${config.max}`;
    rangoDisplay.textContent = `${config.min}-${config.max}`;
}

// Mostrar mensaje con estilo específico
function mostrarMensaje(texto, tipo) {
    mensaje.textContent = texto;
    mensaje.className = `mensaje-${tipo}`;
}

// Agregar intento al historial
function agregarAlHistorial(numero, resultado) {
    historialIntentos.push({ numero, resultado, intento: intentos });
    actualizarHistorial();
}

// Actualizar la visualización del historial
function actualizarHistorial() {
    if (historialIntentos.length > 0) {
        historialContainer.style.display = 'block';
        historial.innerHTML = historialIntentos.map(item => 
            `<div class="history-item">
                <span>Intento ${item.intento}: ${item.numero}</span>
                <span>${item.resultado}</span>
            </div>`
        ).join('');
    }
}

// Reiniciar el juego
function reiniciarJuego() {
    numeroSecreto = generarNumeroSecreto();
    intentos = 0;
    juegoTerminado = false;
    historialIntentos = [];
    inputNumero.value = '';
    inputNumero.disabled = false;
    botonAdivinar.disabled = false;
    mensaje.textContent = '';
    mensaje.className = '';
    intentosCount.textContent = '0';
    historialContainer.style.display = 'none';
    inputNumero.focus();
}

// Verificar y actualizar el mejor puntaje
function verificarMejorPuntaje() {
    if (!mejorPuntaje || intentos < parseInt(mejorPuntaje)) {
        mejorPuntaje = intentos;
        localStorage.setItem('mejorPuntaje', mejorPuntaje);
        mejorPuntajeDisplay.textContent = mejorPuntaje;
        return true;
    }
    return false;
}

// Obtener pista basada en la proximidad al número
function obtenerPista() {
    const diferencia = Math.abs(parseInt(inputNumero.value) - numeroSecreto);
    if (diferencia <= 5) return "¡Muy cerca! 🔥";
    if (diferencia <= 15) return "Cerca 😊";
    if (diferencia <= 30) return "Tibio 😐";
    return "Frío ❄️";
}

// Validar entrada del usuario
function validarEntrada(numero) {
    const config = dificultades[dificultadActual];
    
    if (isNaN(numero)) {
        return { valido: false, mensaje: "Por favor, ingresa un número válido. 🤨" };
    }
    
    if (numero < config.min || numero > config.max) {
        return { 
            valido: false, 
            mensaje: `El número debe estar entre ${config.min} y ${config.max}. 🤨` 
        };
    }
    
    return { valido: true };
}

// Procesar intento del jugador
function procesarIntento() {
    if (juegoTerminado) return;

    const numeroJugador = parseInt(inputNumero.value);
    const validacion = validarEntrada(numeroJugador);

    if (!validacion.valido) {
        mostrarMensaje(validacion.mensaje, 'warning');
        return;
    }

    intentos++;
    intentosCount.textContent = intentos;

    if (numeroJugador === numeroSecreto) {
        // ¡Ganó!
        const esNuevoRecord = verificarMejorPuntaje();
        const mensajeVictoria = esNuevoRecord 
            ? `🎉 ¡INCREÍBLE! ¡Nuevo récord en ${intentos} intentos! 🏆`
            : `🎉 ¡Felicidades! ¡Adivinaste en ${intentos} intentos! 🎊`;
        
        mostrarMensaje(mensajeVictoria, 'success');
        agregarAlHistorial(numeroJugador, '✅ ¡Correcto!');
        terminarJuego();

        // Efecto de celebración
        setTimeout(() => {
            mostrarMensaje(mensajeVictoria + ' 🎪🎭🎨🎪', 'success');
        }, 500);

    } else if (numeroJugador < numeroSecreto) {
        // Número muy bajo
        const pista = obtenerPista();
        mostrarMensaje(`📈 El número es más alto. ${pista}`, 'hint');
        agregarAlHistorial(numeroJugador, '⬆️ Más alto');
    } else {
        // Número muy alto
        const pista = obtenerPista();
        mostrarMensaje(`📉 El número es más bajo. ${pista}`, 'hint');
        agregarAlHistorial(numeroJugador, '⬇️ Más bajo');
    }

    // Limpiar input y mantener focus
    inputNumero.value = '';
    inputNumero.focus();
}

// Terminar el juego
function terminarJuego() {
    juegoTerminado = true;
    inputNumero.disabled = true;
    botonAdivinar.disabled = true;
}

// Event Listeners
selectorDificultad.addEventListener('change', (e) => {
    dificultadActual = e.target.value;
    actualizarUI();
    reiniciarJuego();
});

botonReiniciar.addEventListener('click', reiniciarJuego);

botonAdivinar.addEventListener('click', procesarIntento);

inputNumero.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !juegoTerminado) {
        procesarIntento();
    }
});

// Prevenir entrada de números negativos
inputNumero.addEventListener('input', (e) => {
    if (e.target.value < 0) {
        e.target.value = '';
    }
});

// Inicializar el juego al cargar la página
inicializar();
