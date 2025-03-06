
const destinos = [];


const costosPorDestino = {
    'París': 800,
    'Roma': 700,
    'Barcelona': 600,
    'Tokio': 1200,
    'Nueva York': 900
};


const factoresPorTransporte = {
    'avión': 1.3,
    'tren': 0.8,
    'autobús': 0.5,
    'crucero': 1.7
};


const registrarDestino = (destino, fecha, transporte, personas = 1) => {
    // Validamos que tengamos todos los datos necesarios
    if (!destino || !fecha || !transporte) {
        throw new Error('Todos los campos son obligatorios');
    }

   
    const costo = calcularCosto(destino, transporte, personas);
    
    
    const viaje = {
        destino,
        fecha,
        transporte,
        personas,
        costo
    };


    destinos.push(viaje);
    
    return viaje;
};


const calcularCosto = (destino, transporte, personas) => {
    
    const costoBase = costosPorDestino[destino] || 500;
    
  
    const factorTransporte = factoresPorTransporte[transporte] || 1;
    

    const costoPorPersona = costoBase * factorTransporte;
  
    let descuento = 0;
    if (personas >= 5) {
        descuento = 0.1; 
    } else if (personas >= 3) {
        descuento = 0.05; 
    }
    
    // Costo total con descuento aplicado
    const costoTotal = (costoPorPersona * personas) * (1 - descuento);
    
    return Math.round(costoTotal); 


const obtenerDestinos = () => [...destinos];

const calcularCostoTotal = () => {

    return destinos.reduce((total, viaje) => total + viaje.costo, 0);
};

export { registrarDestino, obtenerDestinos, calcularCosto, calcularCostoTotal };
