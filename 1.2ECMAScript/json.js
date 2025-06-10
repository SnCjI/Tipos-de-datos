// Datos iniciales de la biblioteca en formato JSON
let bibliotecaJSON = {
  libros: [
    {
      id: 1,
      titulo: "Cien años de soledad",
      autor: "Gabriel García Márquez",
      genero: "Realismo mágico",
      disponible: true
    },
    {
      id: 2,
      titulo: "Don Quijote de la Mancha",
      autor: "Miguel de Cervantes",
      genero: "Novela",
      disponible: false
    },
    {
      id: 3,
      titulo: "1984",
      autor: "George Orwell",
      genero: "Distopía",
      disponible: true
    },
    {
      id: 4,
      titulo: "El Principito",
      autor: "Antoine de Saint-Exupéry",
      genero: "Fábula",
      disponible: true
    }
  ]
};

// Función para simular la lectura de datos (operación asincrónica)
function leerDatos(callback) {
  console.log("📖 Leyendo datos de la biblioteca...");
  
  // Simular delay de lectura de archivo
  setTimeout(() => {
    try {
      // Simular posible error en la lectura
      if (Math.random() > 0.95) {
        callback(new Error("Error al leer los datos"), null);
      } else {
        callback(null, JSON.parse(JSON.stringify(bibliotecaJSON)));
      }
    } catch (error) {
      callback(error, null);
    }
  }, 1000);
}

// Función para simular la escritura de datos (operación asincrónica)
function escribirDatos(datos, callback) {
  console.log("💾 Guardando datos en la biblioteca...");
  
  // Simular delay de escritura de archivo
  setTimeout(() => {
    try {
      // Simular posible error en la escritura
      if (Math.random() > 0.95) {
        callback(new Error("Error al guardar los datos"));
      } else {
        bibliotecaJSON = JSON.parse(JSON.stringify(datos));
        callback(null);
      }
    } catch (error) {
      callback(error);
    }
  }, 800);
}

// Función para consultar todos los libros
function consultarLibros(callback) {
  leerDatos((error, datos) => {
    if (error) {
      callback(error, null);
      return;
    }
    
    console.log("\n📚 === INVENTARIO DE LIBROS ===");
    console.log("================================");
    
    if (datos.libros.length === 0) {
      console.log("No hay libros en la biblioteca.");
      callback(null, []);
      return;
    }
    
    datos.libros.forEach(libro => {
      const estado = libro.disponible ? "✅ Disponible" : "❌ Prestado";
      console.log(`ID: ${libro.id}`);
      console.log(`Título: ${libro.titulo}`);
      console.log(`Autor: ${libro.autor}`);
      console.log(`Género: ${libro.genero}`);
      console.log(`Estado: ${estado}`);
      console.log("--------------------------------");
    });
    
    callback(null, datos.libros);
  });
}

// Función para agregar un nuevo libro
function agregarLibro(nuevoLibro, callback) {
  leerDatos((error, datos) => {
    if (error) {
      callback(error);
      return;
    }
    
    // Generar nuevo ID
    const nuevoId = datos.libros.length > 0 
      ? Math.max(...datos.libros.map(libro => libro.id)) + 1 
      : 1;
    
    // Crear el libro con ID y disponibilidad por defecto
    const libroCompleto = {
      id: nuevoId,
      titulo: nuevoLibro.titulo,
      autor: nuevoLibro.autor,
      genero: nuevoLibro.genero,
      disponible: true
    };
    
    // Agregar el libro a la colección
    datos.libros.push(libroCompleto);
    
    // Guardar los datos actualizados
    escribirDatos(datos, (errorEscritura) => {
      if (errorEscritura) {
        callback(errorEscritura);
        return;
      }
      
      console.log(`\n✅ Libro "${nuevoLibro.titulo}" agregado exitosamente con ID ${nuevoId}`);
      callback(null);
    });
  });
}

// Función para actualizar la disponibilidad de un libro
function actualizarDisponibilidad(idLibro, nuevoEstado, callback) {
  leerDatos((error, datos) => {
    if (error) {
      callback(error);
      return;
    }
    
    // Buscar el libro por ID
    const libro = datos.libros.find(l => l.id === idLibro);
    
    if (!libro) {
      callback(new Error(`No se encontró un libro con ID ${idLibro}`));
      return;
    }
    
    // Actualizar el estado
    libro.disponible = nuevoEstado;
    
    // Guardar los datos actualizados
    escribirDatos(datos, (errorEscritura) => {
      if (errorEscritura) {
        callback(errorEscritura);
        return;
      }
      
      const estadoTexto = nuevoEstado ? "disponible" : "prestado";
      console.log(`\n✅ El libro "${libro.titulo}" ahora está ${estadoTexto}`);
      callback(null);
    });
  });
}

// Función para buscar libros por título o autor
function buscarLibros(termino, callback) {
  leerDatos((error, datos) => {
    if (error) {
      callback(error, null);
      return;
    }
    
    const terminoLower = termino.toLowerCase();
    const librosEncontrados = datos.libros.filter(libro => 
      libro.titulo.toLowerCase().includes(terminoLower) ||
      libro.autor.toLowerCase().includes(terminoLower)
    );
    
    console.log(`\n🔍 Resultados de búsqueda para "${termino}":`);
    console.log("=============================================");
    
    if (librosEncontrados.length === 0) {
      console.log("No se encontraron libros que coincidan con la búsqueda.");
    } else {
      librosEncontrados.forEach(libro => {
        const estado = libro.disponible ? "✅ Disponible" : "❌ Prestado";
        console.log(`ID: ${libro.id} | ${libro.titulo} - ${libro.autor} | ${estado}`);
      });
    }
    
    callback(null, librosEncontrados);
  });
}

// Función para obtener estadísticas de la biblioteca
function obtenerEstadisticas(callback) {
  leerDatos((error, datos) => {
    if (error) {
      callback(error, null);
      return;
    }
    
    const totalLibros = datos.libros.length;
    const librosDisponibles = datos.libros.filter(libro => libro.disponible).length;
    const librosPrestados = totalLibros - librosDisponibles;
    
    const generos = {};
    datos.libros.forEach(libro => {
      generos[libro.genero] = (generos[libro.genero] || 0) + 1;
    });
    
    const estadisticas = {
      totalLibros,
      librosDisponibles,
      librosPrestados,
      generos
    };
    
    console.log("\n📊 === ESTADÍSTICAS DE LA BIBLIOTECA ===");
    console.log("========================================");
    console.log(`Total de libros: ${totalLibros}`);
    console.log(`Libros disponibles: ${librosDisponibles}`);
    console.log(`Libros prestados: ${librosPrestados}`);
    console.log("\nLibros por género:");
    Object.entries(generos).forEach(([genero, cantidad]) => {
      console.log(`  ${genero}: ${cantidad}`);
    });
    
    callback(null, estadisticas);
  });
}

// Función principal para demostrar el uso del sistema
function demostrarSistema() {
  console.log("🏛️ SISTEMA DE GESTIÓN DE BIBLIOTECA");
  console.log("===================================\n");
  
  // 1. Consultar libros existentes
  consultarLibros((error, libros) => {
    if (error) {
      console.error("❌ Error al consultar libros:", error.message);
      return;
    }
    
    // 2. Agregar un nuevo libro
    setTimeout(() => {
      const nuevoLibro = {
        titulo: "Rayuela",
        autor: "Julio Cortázar",
        genero: "Novela experimental"
      };
      
      agregarLibro(nuevoLibro, (error) => {
        if (error) {
          console.error("❌ Error al agregar libro:", error.message);
          return;
        }
        
        // 3. Actualizar disponibilidad de un libro
        setTimeout(() => {
          actualizarDisponibilidad(1, false, (error) => {
            if (error) {
              console.error("❌ Error al actualizar disponibilidad:", error.message);
              return;
            }
            
            // 4. Buscar libros
            setTimeout(() => {
              buscarLibros("García", (error, resultados) => {
                if (error) {
                  console.error("❌ Error en la búsqueda:", error.message);
                  return;
                }
                
                // 5. Mostrar estadísticas
                setTimeout(() => {
                  obtenerEstadisticas((error, stats) => {
                    if (error) {
                      console.error("❌ Error al obtener estadísticas:", error.message);
                      return;
                    }
                    
                    // 6. Consultar libros actualizados
                    setTimeout(() => {
                      console.log("\n📚 === ESTADO FINAL DE LA BIBLIOTECA ===");
                      consultarLibros((error, librosFinales) => {
                        if (error) {
                          console.error("❌ Error al consultar libros finales:", error.message);
                        } else {
                          console.log("\n🎉 Demostración completada exitosamente!");
                        }
                      });
                    }, 1000);
                  });
                }, 1000);
              });
            }, 1000);
          });
        }, 1000);
      });
    }, 1000);
  });
}

// Ejecutar la demostración
demostrarSistema();

// Funciones de utilidad para uso interactivo
console.log("\n📝 FUNCIONES DISPONIBLES:");
console.log("========================");
console.log("• consultarLibros(callback)");
console.log("• agregarLibro(nuevoLibro, callback)");
console.log("• actualizarDisponibilidad(idLibro, nuevoEstado, callback)");
console.log("• buscarLibros(termino, callback)");
console.log("• obtenerEstadisticas(callback)");

// Ejemplos de uso:
console.log("\n📖 EJEMPLOS DE USO:");
console.log("==================");
console.log(`
// Consultar todos los libros
consultarLibros((error, libros) => {
  if (error) console.error(error);
  else console.log("Libros consultados:", libros.length);
});

// Agregar un nuevo libro
agregarLibro({
  titulo: "Crónica de una muerte anunciada",
  autor: "Gabriel García Márquez",
  genero: "Realismo mágico"
}, (error) => {
  if (error) console.error(error);
  else console.log("Libro agregado exitosamente");
});

// Marcar un libro como prestado
actualizarDisponibilidad(1, false, (error) => {
  if (error) console.error(error);
  else console.log("Disponibilidad actualizada");
});

// Buscar libros
buscarLibros("Cortázar", (error, resultados) => {
  if (error) console.error(error);
  else console.log("Libros encontrados:", resultados.length);
});
`);
