// Variables globales
const API_URL = 'https://rickandmortyapi.com/api/character';
const dataContainer = document.getElementById('data-container');
const methodInfo = document.getElementById('method-info');
const statsContainer = document.getElementById('stats-container');
const fetchBtn = document.getElementById('fetch-btn');
const axiosBtn = document.getElementById('axios-btn');

/**
 * Función para mostrar el estado de carga
 */
function showLoading() {
    dataContainer.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Cargando personajes...</p>
        </div>
    `;
    fetchBtn.disabled = true;
    axiosBtn.disabled = true;
}

/**
 * Función para ocultar el estado de carga
 */
function hideLoading() {
    fetchBtn.disabled = false;
    axiosBtn.disabled = false;
}

/**
 * Función para mostrar errores
 * @param {string} message - Mensaje de error
 * @param {string} method - Método utilizado (Fetch o Axios)
 */
function showError(message, method) {
    dataContainer.innerHTML = `
        <div class="error">
            <h3>❌ Error al cargar datos con ${method}</h3>
            <p>${message}</p>
        </div>
    `;
    hideLoading();
}

/**
 * Función para mostrar información del método utilizado
 * @param {string} method - Método utilizado
 * @param {number} startTime - Tiempo de inicio de la petición
 */
function showMethodInfo(method, startTime) {
    const endTime = performance.now();
    const duration = (endTime - startTime).toFixed(2);
    
    const methodDescriptions = {
        'Fetch': 'Fetch API es nativa de JavaScript moderno. Utiliza Promises y requiere manejo manual de errores HTTP.',
        'Axios': 'Axios es una librería externa que simplifica las peticiones HTTP con mejor manejo de errores y más funcionalidades.'
    };

    methodInfo.innerHTML = `
        <div class="method-info">
            <h3>🔧 Método utilizado: ${method}</h3>
            <p>${methodDescriptions[method]}</p>
            <p><strong>⏱️ Tiempo de respuesta:</strong> ${duration} ms</p>
        </div>
    `;
}

/**
 * Función para mostrar estadísticas de los personajes
 * @param {Array} characters - Array de personajes
 */
function showStats(characters) {
    const alive = characters.filter(char => char.status === 'Alive').length;
    const dead = characters.filter(char => char.status === 'Dead').length;
    const unknown = characters.filter(char => char.status === 'unknown').length;

    statsContainer.innerHTML = `
        <div class="stats">
            <div class="stat">
                <div class="stat-number">${characters.length}</div>
                <div class="stat-label">Total</div>
            </div>
            <div class="stat">
                <div class="stat-number">${alive}</div>
                <div class="stat-label">Vivos</div>
            </div>
            <div class="stat">
                <div class="stat-number">${dead}</div>
                <div class="stat-label">Muertos</div>
            </div>
            <div class="stat">
                <div class="stat-number">${unknown}</div>
                <div class="stat-label">Desconocido</div>
            </div>
        </div>
    `;
}

/**
 * Función para mostrar los personajes en el DOM
 * @param {Array} characters - Array de personajes
 */
function displayCharacters(characters) {
    dataContainer.innerHTML = characters.map(character => `
        <div class="character-card">
            <img src="${character.image}" alt="${character.name}" class="character-image">
            <div class="character-name">${character.name}</div>
            <div class="character-info">
                <div class="character-detail">
                    <span class="detail-label">Estado:</span>
                    <span class="status ${character.status.toLowerCase()}">${character.status}</span>
                </div>
                <div class="character-detail">
                    <span class="detail-label">Especie:</span>
                    <span class="detail-value">${character.species}</span>
                </div>
                <div class="character-detail">
                    <span class="detail-label">Género:</span>
                    <span class="detail-value">${character.gender}</span>
                </div>
                <div class="character-detail">
                    <span class="detail-label">Origen:</span>
                    <span class="detail-value">${character.origin.name}</span>
                </div>
                <div class="character-detail">
                    <span class="detail-label">Ubicación:</span>
                    <span class="detail-value">${character.location.name}</span>
                </div>
            </div>
        </div>
    `).join('');
}

/**
 * Función para obtener datos usando FETCH API
 */
async function fetchWithFetch() {
    const startTime = performance.now();
    showLoading();
    
    try {
        console.log('🔍 Iniciando petición con Fetch...');
        
        // Realizar la petición
        const response = await fetch(API_URL);
        
        // Verificar si la respuesta es exitosa
        // Fetch NO rechaza automáticamente para códigos de error HTTP
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
        }
        
        // Convertir la respuesta a JSON
        const data = await response.json();
        
        console.log('✅ Datos recibidos con Fetch:', data);
        
        // Mostrar los personajes y estadísticas
        displayCharacters(data.results);
        showStats(data.results);
        showMethodInfo('Fetch', startTime);
        
    } catch (error) {
        console.error('❌ Error con Fetch:', error);
        
        // Manejo específico de errores
        let errorMessage = error.message;
        
        if (error instanceof TypeError) {
            errorMessage = 'Error de red: Verifique su conexión a internet';
        }
        
        showError(errorMessage, 'Fetch');
    } finally {
        hideLoading();
    }
}

/**
 * Función para obtener datos usando AXIOS
 */
async function fetchWithAxios() {
    const startTime = performance.now();
    showLoading();
    
    try {
        console.log('🔍 Iniciando petición con Axios...');
        
        // Realizar la petición con Axios
        const response = await axios.get(API_URL, {
            timeout: 10000, // Timeout de 10 segundos
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log('✅ Datos recibidos con Axios:', response.data);
        
        // Mostrar los personajes y estadísticas
        displayCharacters(response.data.results);
        showStats(response.data.results);
        showMethodInfo('Axios', startTime);
        
    } catch (error) {
        console.error('❌ Error con Axios:', error);
        
        let errorMessage = 'Error desconocido';
        
        // Axios proporciona información detallada sobre el error
        if (error.response) {
            // El servidor respondió con un código de error
            errorMessage = `Error del servidor: ${error.response.status} - ${error.response.statusText}`;
        } else if (error.request) {
            // La petición fue enviada pero no se recibió respuesta
            errorMessage = 'Error de red: No se pudo conectar con el servidor';
        } else {
            // Error en la configuración de la petición
            errorMessage = `Error de configuración: ${error.message}`;
        }
        
        showError(errorMessage, 'Axios');
    } finally {
        hideLoading();
    }
}

/**
 * Configuración de event listeners
 */
function setupEventListeners() {
    fetchBtn.addEventListener('click', fetchWithFetch);
    axiosBtn.addEventListener('click', fetchWithAxios);
}

/**
 * Función de inicialización
 */
function init() {
    console.log('🚀 Aplicación iniciada');
    setupEventListeners();
    // Cargar datos iniciales con Fetch
    fetchWithFetch();
}

// Inicializar la aplicación cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', init);

// Funciones adicionales para debugging (opcional)
window.debugApp = {
    fetchData: fetchWithFetch,
    axiosData: fetchWithAxios,
    clearData: () => {
        dataContainer.innerHTML = '';
        methodInfo.innerHTML = '';
        statsContainer.innerHTML = '';
    }
};
