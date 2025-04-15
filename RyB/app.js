
function findGift(gifts, giftName, index = 0) {
  // Caso base 1: Si hemos revisado toda la lista y no encontramos el regalo
  if (index === gifts.length) {
    return `El regalo ${giftName} no se encuentra en la lista.`;
  }
  
  // Caso base 2: Si encontramos el regalo en la posición actual
  if (gifts[index] === giftName) {
    return `¡El regalo ${giftName} está en la posición ${index}!`;
  }
  
  // Llamada recursiva: Buscar en la siguiente posición
  return findGift(gifts, giftName, index + 1);
}

// Ejemplo de uso
const listaDeRegalos = [
  "Juego de mesa", 
  "Suéter", 
  "Chocolate", 
  "Libro", 
  "Consola de videojuegos"
];

console.log(findGift(listaDeRegalos, "Libro", 0));        // Debería encontrarlo
console.log(findGift(listaDeRegalos, "Bicicleta", 0));    // No debería encontrarlo
