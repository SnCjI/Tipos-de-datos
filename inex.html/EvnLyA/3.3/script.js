// ====================================
// SISTEMA DE RESERVAS DE RESTAURANTE
// Proyecto: Promesas y Async/Await
// ====================================

// Configuración del restaurante
const MESAS_DISPONIBLES = 10;

// ====================================
// 1. VERIFICAR DISPONIBILIDAD DE MESAS
// ====================================
/**
 * Verifica si hay mesas disponibles para la reserva
 * @param {number} mesasSolicitadas - Número de mesas que el cliente solicita
 * @returns {Promise} - Promesa que se resuelve si hay disponibilidad, se rechaza si no
 */
function verificarDisponibilidad(mesasSolicitadas) {
    return new Promise((resolve, reject) => {
        console.log(`🔍 Verificando disponibilidad para ${mesasSolicitadas} mesa(s)...`);
        
        // Simular tiempo de verificación en base de datos
        setTimeout(() => {
            if (mesasSolicitadas <= MESAS_DISPONIBLES) {
                const mensaje = `✅ Perfecto! Hay ${mesasSolicitadas} mesa(s) disponible(s)`;
                console.log(mensaje);
                resolve(mensaje);
            } else {
                const error = `❌ Lo sentimos, solo hay ${MESAS_DISPONIBLES} mesas disponibles, pero solicitas ${mesasSolicitadas}`;
                console.log(error);
                reject(error);
            }
        }, 1000); // Simula 1 segundo de consulta a BD
    });
}

// ====================================
// 2. ENVÍO DE CONFIRMACIÓN POR CORREO
// ====================================
/**
 * Simula el envío de un correo de confirmación
 * @param {string} nombreCliente - Nombre del cliente
 * @returns {Promise} - Promesa que simula el envío de correo
 */
function enviarConfirmacionReserva(nombreCliente) {
    return new Promise((resolve, reject) => {
        console.log(`📧 Enviando correo de confirmación a ${nombreCliente}...`);
        
        setTimeout(() => {
            // Simular fallo ocasional en el envío (20% probabilidad de error)
            const exito = Math.random() > 0.2;
            
            if (exito) {
                const mensaje = `📧 Correo de confirmación enviado exitosamente a ${nombreCliente}`;
                console.log(mensaje);
                resolve(mensaje);
            } else {
                const error = `❌ Error al enviar el correo de confirmación a ${nombreCliente}. Por favor, intente nuevamente.`;
                console.log(error);
                reject(error);
            }
        }, 1500); // Simula 1.5 segundos de envío de correo
    });
}

// ====================================
// 3. FUNCIÓN PRINCIPAL - HACER RESERVA
// ====================================
/**
 * Función principal que maneja todo el flujo de reserva
 * @param {string} nombreCliente - Nombre del cliente
 * @param {number} mesasSolicitadas - Número de mesas solicitadas
 * @returns {Object} - Objeto con el resultado de la operación
 */
async function hacerReserva(nombreCliente, mesasSolicitadas) {
    console.log(`\n🍽️ Iniciando proceso de reserva para ${nombreCliente}...`);
    
    try {
        // PASO 1: Verificar disponibilidad de mesas
        console.log('📋 Paso 1: Verificando disponibilidad...');
        const disponibilidad = await verificarDisponibilidad(mesasSolicitadas);
        
        // PASO 2: Si hay disponibilidad, enviar confirmación por correo
        console.log('📧 Paso 2: Enviando confirmación por correo...');
        const confirmacion = await enviarConfirmacionReserva(nombreCliente);
        
        // ÉXITO: Reserva completada
        const mensajeExito = `🎉 ¡Reserva confirmada para ${nombreCliente}!\n\n${disponibilidad}\n${confirmacion}\n\n¡Nos vemos pronto en el restaurante!`;
        console.log('✅ Reserva completada exitosamente!');
        
        return {
            exito: true,
            mensaje: mensajeExito
        };
        
    } catch (error) {
        // MANEJO DE ERRORES: Cualquier error en el proceso
        console.log('❌ Error en el proceso de reserva:', error);
        
        return {
            exito: false,
            mensaje: `❌ Error en la reserva: ${error}`
        };
    }
}

// ====================================
// 4. MANEJO DE LA INTERFAZ DE USUARIO
// ====================================

/**
 * Muestra resultados en la interfaz con animaciones
 * @param {string} mensaje - Mensaje a mostrar
 * @param {string} tipo - Tipo de mensaje (exito, error, procesando)
 */
function mostrarResultado(mensaje, tipo) {
    const resultado = document.getElementById('resultado');
    
    // Remover clases anteriores
    resultado.classList.remove('show');
    
    // Aplicar nuevos estilos
    setTimeout(() => {
        resultado.className = `resultado ${tipo}`;
        resultado.innerHTML = mensaje;
        resultado.classList.add('show');
    }, 100);
}

/**
 * Llena el formulario con datos de prueba exitosa
 */
function llenarFormularioExito() {
    document.getElementById('nombreCliente').value = 'Juan Pérez';
    document.getElementById('mesasSolicitadas').value = '3';
    console.log('📝 Formulario llenado para demo exitosa');
}

/**
 * Llena el formulario con datos que generarán error
 */
function llenarFormularioError() {
    document.getElementById('nombreCliente').value = 'María González';
    document.getElementById('mesasSolicitadas').value = '15';
    console.log('📝 Formulario llenado para demo de error');
}

// ====================================
// 5. EVENT LISTENERS Y MANEJO DE EVENTOS
// ====================================

// Evento principal del formulario
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('reservaForm');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Obtener datos del formulario
        const nombreCliente = document.getElementById('nombreCliente').value.trim();
        const mesasSolicitadas = parseInt(document.getElementById('mesasSolicitadas').value);
        const btnReservar = document.getElementById('btnReservar');
        
        // Validación básica
        if (!nombreCliente || !mesasSolicitadas || mesasSolicitadas < 1) {
            mostrarResultado('❌ Por favor, complete todos los campos correctamente', 'error');
            return;
        }

        // Deshabilitar botón durante el proceso
        btnReservar.disabled = true;
        btnReservar.textContent = 'Procesando...';
        
        // Mostrar estado inicial
        mostrarResultado('<div class="spinner"></div>Verificando disponibilidad de mesas...', 'procesando');

        try {
            // Actualizar mensaje durante el proceso
            setTimeout(() => {
                const resultado = document.getElementById('resultado');
                if (resultado.classList.contains('procesando')) {
                    mostrarResultado('<div class="spinner"></div>Enviando confirmación por correo...', 'procesando');
                }
            }, 1200);

            // Ejecutar el proceso de reserva
            const resultado = await hacerReserva(nombreCliente, mesasSolicitadas);
            
            // Mostrar resultado final
            mostrarResultado(resultado.mensaje, resultado.exito ? 'exito' : 'error');
            
            // Si fue exitosa, limpiar el formulario
            if (resultado.exito) {
                form.reset();
            }
            
        } catch (error) {
            // Manejo de errores inesperados
            console.error('Error inesperado:', error);
            mostrarResultado(`❌ Error inesperado: ${error.message}`, 'error');
        } finally {
            // Siempre rehabilitar el botón
            btnReservar.disabled = false;
            btnReservar.textContent = 'Hacer Reserva';
        }
    });
});

// ====================================
// 6. PRUEBAS AUTOMÁTICAS DEL SISTEMA
// ====================================

// Ejecutar pruebas al cargar la página
console.log('\n🧪 ===== EJECUTANDO PRUEBAS DEL SISTEMA =====');

// Prueba 1: Reserva exitosa (caso normal)
console.log('\n📝 PRUEBA 1: Reserva exitosa (5 mesas)');
hacerReserva('Usuario Test 1', 5).then(resultado => {
    console.log('📊 Resultado Prueba 1:', resultado);
});

// Prueba 2: Error por falta de mesas
console.log('\n📝 PRUEBA 2: Error por falta de mesas (15 mesas)');
hacerReserva('Usuario Test 2', 15).then(resultado => {
    console.log('📊 Resultado Prueba 2:', resultado);
});

// Prueba 3: Caso límite (todas las mesas disponibles)
console.log('\n📝 PRUEBA 3: Caso límite (10 mesas - todas disponibles)');
hacerReserva('Usuario Test 3', 10).then(resultado => {
    console.log('📊 Resultado Prueba 3:', resultado);
});

// Prueba 4: Caso de una sola mesa
console.log('\n📝 PRUEBA 4: Reserva mínima (1 mesa)');
hacerReserva('Usuario Test 4', 1).then(resultado => {
    console.log('📊 Resultado Prueba 4:', resultado);
});

console.log('\n✅ Todas las pruebas iniciadas. Revisa los resultados arriba.');
console.log('💡 Interactúa con el formulario para ver el sistema en acción!');

// ====================================
// 7. FUNCIONES AUXILIARES Y UTILIDADES
// ====================================

/**
 * Función para resetear el sistema (útil para testing)
 */
function resetearSistema() {
    document.getElementById('reservaForm').reset();
    document.getElementById('resultado').className = 'resultado';
    document.getElementById('resultado').innerHTML = '';
    console.log('🔄 Sistema reseteado');
}

/**
 * Función para mostrar estadísticas del restaurante
 */
function mostrarEstadisticas() {
    console.log('\n📊 ===== ESTADÍSTICAS DEL RESTAURANTE =====');
    console.log(`🪑 Mesas totales: ${MESAS_DISPONIBLES}`);
    console.log(`🕐 Horario: 18:00 - 23:00`);
    console.log(`📧 Tasa de éxito en correos: ~80%`);
    console.log(`⏱️ Tiempo promedio de reserva: 2.5 segundos`);
}

// Mostrar estadísticas al cargar
mostrarEstadisticas();
