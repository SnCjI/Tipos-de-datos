const fs = require('fs');
const path = require('path');

// Ruta del archivo donde se guardarán las notas
const ARCHIVO_NOTAS = path.join(__dirname, 'notas.json');

// Función para cargar las notas existentes
function cargarNotas() {
  try {
    // Verificar si el archivo existe
    if (fs.existsSync(ARCHIVO_NOTAS)) {
      // Leer el contenido del archivo
      const data = fs.readFileSync(ARCHIVO_NOTAS, 'utf8');
      // Parsear el contenido a un objeto JavaScript
      return JSON.parse(data);
    } else {
      // Si el archivo no existe, devolver un array vacío
      return [];
    }
  } catch (error) {
    console.error('Error al cargar las notas:', error.message);
    // En caso de error, devolver un array vacío
    return [];
  }
}

// Función para guardar las notas en el archivo
function guardarNotas(notas) {
  try {
    // Convertir el array de notas a formato JSON
    const data = JSON.stringify(notas, null, 2);
    // Escribir en el archivo
    fs.writeFileSync(ARCHIVO_NOTAS, data);
    console.log('Notas guardadas correctamente.');
  } catch (error) {
    console.error('Error al guardar las notas:', error.message);
  }
}

// Función para agregar una nueva nota
function agregarNota(titulo, contenido) {
  // Cargar las notas actuales
  const notas = cargarNotas();
  
  // Verificar si ya existe una nota con el mismo título
  const notaExistente = notas.find(nota => nota.titulo === titulo);
  if (notaExistente) {
    console.log(`Ya existe una nota con el título "${titulo}".`);
    return;
  }
  
  // Crear nueva nota
  const nuevaNota = {
    titulo,
    contenido,
    fecha: new Date().toLocaleDateString()
  };
  
  // Agregar la nueva nota al array
  notas.push(nuevaNota);
  
  // Guardar las notas actualizadas
  guardarNotas(notas);
  
  console.log(`Nota "${titulo}" agregada correctamente.`);
}

// Función para listar todas las notas
function listarNotas() {
  // Cargar las notas actuales
  const notas = cargarNotas();
  
  if (notas.length === 0) {
    console.log('No hay notas guardadas.');
    return;
  }
  
  console.log('===== LISTA DE NOTAS =====');
  notas.forEach((nota, indice) => {
    console.log(`${indice + 1}. Título: ${nota.titulo}`);
    console.log(`   Contenido: ${nota.contenido}`);
    console.log(`   Fecha: ${nota.fecha}`);
    console.log('---------------------------');
  });
}

// Función para eliminar una nota por su título
function eliminarNota(titulo) {
  // Cargar las notas actuales
  const notas = cargarNotas();
  
  // Buscar el índice de la nota con el título especificado
  const indice = notas.findIndex(nota => nota.titulo === titulo);
  
  if (indice === -1) {
    console.log(`No se encontró ninguna nota con el título "${titulo}".`);
    return;
  }
  
  // Eliminar la nota del array
  notas.splice(indice, 1);
  
  // Guardar las notas actualizadas
  guardarNotas(notas);
  
  console.log(`Nota "${titulo}" eliminada correctamente.`);
}

// Procesamiento de argumentos de línea de comandos
function procesarComandos() {
  const [,, comando, ...args] = process.argv;
  
  switch (comando) {
    case 'agregar':
      if (args.length < 2) {
        console.log('Uso: node gestorNotas.js agregar <título> <contenido>');
        return;
      }
      const titulo = args[0];
      const contenido = args.slice(1).join(' ');
      agregarNota(titulo, contenido);
      break;
      
    case 'listar':
      listarNotas();
      break;
      
    case 'eliminar':
      if (args.length === 0) {
        console.log('Uso: node gestorNotas.js eliminar <título>');
        return;
      }
      eliminarNota(args[0]);
      break;
      
    default:
      console.log(`
Uso: node gestorNotas.js <comando> [argumentos]

Comandos disponibles:
  - agregar <título> <contenido>  : Agrega una nueva nota
  - listar                        : Muestra todas las notas
  - eliminar <título>             : Elimina una nota por su título
      `);
  }
}

// Ejecutar el procesamiento de comandos
procesarComandos();
