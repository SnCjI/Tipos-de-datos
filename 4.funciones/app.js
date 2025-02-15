// array vacío para guardar los libros
var librosLeidos = [];

// agregar un libro a la lista
function agregarLibro(titulo) {
  librosLeidos.push(titulo);
  console.log("Libro agregado: " + titulo);
}

//mostrar todos los libros leídos
function mostrarLibrosLeidos() {
  console.log("Lista de libros leídos:");
  
  if (librosLeidos.length === 0) {
    console.log("No has leído ningún libro todavía");
  } else {
    for (var i = 0; i < librosLeidos.length; i++) {
      console.log((i + 1) + ". " + librosLeidos[i]);
    }
  }
}

// Ejemplo
/*
agregarLibro("Don Quijote");
agregarLibro("El principito");
mostrarLibrosLeidos();
*/
