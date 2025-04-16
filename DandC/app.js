
function encontrarMaximo(arr, inicio, fin) {
    // Caso base: si el subarreglo tiene solo un elemento
    if (inicio === fin) {
        return arr[inicio];
    }
    
    // Caso base: si el subarreglo tiene dos elementos
    if (inicio + 1 === fin) {
        return Math.max(arr[inicio], arr[fin]);
    }
    
    // Dividir: encontrar el punto medio
    const medio = Math.floor((inicio + fin) / 2);
    
    // Conquistar: encontrar el máximo en cada mitad recursivamente
    const maxIzquierda = encontrarMaximo(arr, inicio, medio);
    const maxDerecha = encontrarMaximo(arr, medio + 1, fin);
    
    // Combinar: devolver el máximo entre ambas mitades
    return Math.max(maxIzquierda, maxDerecha);
}

function encontrarMaximoEnArreglo(arr) {
    // Verificar si el arreglo está vacío
    if (arr.length === 0) {
        throw new Error("El arreglo no puede estar vacío");
    }
    
    // Llamar a la función recursiva con los índices inicial y final
    return encontrarMaximo(arr, 0, arr.length - 1);
}

// Ejemplos de uso
function probarAlgoritmo() {
    const arreglos = [
        [3, 5, 2, 1, 7, 8, 2],
        [10, 5, 7, 9, 15, 2, 8, 12],
        [100, 50, 75, 99, 101, 150, 25],
        [1],
        [5, 5, 5, 5, 5]
    ];
    
    arreglos.forEach((arr, indice) => {
        console.log(`Arreglo ${indice + 1}: [${arr.join(', ')}]`);
        console.log(`El número máximo es: ${encontrarMaximoEnArreglo(arr)}`);
        console.log('-'.repeat(30));
    });
}

// Ejecutar las pruebas
probarAlgoritmo();

// Exportar las funciones para poder utilizarlas en otros archivos
module.exports = {
    encontrarMaximo,
    encontrarMaximoEnArreglo
};
