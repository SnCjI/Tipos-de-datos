
import { registrarDestino } from 'viajes.js';
import { mostrarItinerario, mostrarError, limpiarFormulario } from 'ui.js';


document.addEventListener('DOMContentLoaded', () => {
    
    const formularioElements = {
        destino: document.getElementById('destino'),
        fecha: document.getElementById('fecha'),
        transporte: document.getElementById('transporte'),
        personas: document.getElementById('personas'),
        btnRegistrar: document.getElementById('btn-registrar'),
        btnMostrar: document.getElementById('btn-mostrar')
    };
    
    
    formularioElements.btnRegistrar.addEventListener('click', () => {
        
        const destino = formularioElements.destino.value;
        const fecha = formularioElements.fecha.value;
        const transporte = formularioElements.transporte.value;
        const personas = parseInt(formularioElements.personas.value, 10) || 1;
        
        try {
            
            registrarDestino(destino, fecha, transporte, personas);
            
            
            limpiarFormulario();
            mostrarItinerario(); 
        } catch (error) {
        
            mostrarError(error.message);
        }
    });
    
    formularioElements.btnMostrar.addEventListener('click', mostrarItinerario);
});
