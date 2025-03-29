/**
 * Encuentra el primer par de invitados consecutivos cuyos nombres empiezan con la misma letra
 * @param {string[]} invitados - Lista de nombres de invitados ordenada alfabéticamente
 * @return {string[] | null} - Array con los dos nombres o null si no se encuentra ningún par
 */
function encontrarParInvitados(invitados) {
    // Verificar si hay suficientes invitados
    if (!invitados || invitados.length < 2) {
      return null;
    }
    
    // Inicializar los punteros
    let puntero1 = 0;
    let puntero2 = 1;
    
    // Recorrer la lista con los dos punteros
    while (puntero2 < invitados.length) {
      // Obtener la primera letra de cada nombre y convertirla a minúscula para comparar
      const primeraLetra1 = invitados[puntero1].charAt(0).toLowerCase();
      const primeraLetra2 = invitados[puntero2].charAt(0).toLowerCase();
      
      // Comparar las iniciales
      if (primeraLetra1 === primeraLetra2) {
        // Si coinciden, devolver los nombres
        return [invitados[puntero1], invitados[puntero2]];
      }
      
      // Si no coinciden, avanzar ambos punteros
      puntero1++;
      puntero2++;
    }
    
    // Si no se encontró ningún par, devolver null
    return null;
  }
  
  // Ejemplo de uso
  const listaInvitados = ["Ana", "Antonio", "Bernardo", "Carlos", "Carmen", "Daniel"];
  const resultado = encontrarParInvitados(listaInvitados);
  
  console.log(resultado); // ["Ana", "Antonio"]
