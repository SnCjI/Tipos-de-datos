
function findLongestWord(text) {
    // Dividir el texto en palabras individuales
    const words = text.split(' ');
    
    // Inicializar variables para seguimiento
    let longestWord = '';
    let maxLength = 0;
    
    // Aplicar técnica de Sliding Window para recorrer cada palabra
    for (let i = 0; i < words.length; i++) {
        // Limpiar la palabra de signos de puntuación
        const cleanWord = words[i].replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
        
        // Comparar la longitud con la palabra más larga encontrada hasta ahora
        if (cleanWord.length > maxLength) {
            maxLength = cleanWord.length;
            longestWord = cleanWord;
        }
    }
    
    return longestWord;
}

// Ejemplo de uso
const texto = "En este párrafo, la palabra extraordinariamente es probablemente la más larga de todas.";
console.log(`La palabra más larga es: ${findLongestWord(texto)}`);

// Probemos con otro ejemplo más complejo
const textoComplejo = "El desarrollo de aplicaciones web requiere conocimientos interdisciplinarios que abarcan desde programación hasta diseño de interfaces.";
console.log(`La palabra más larga es: ${findLongestWord(textoComplejo)}`);
