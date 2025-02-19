// la clase Libro
class Libro {
    constructor(titulo, autor, anio) {
        this.titulo = titulo;
        this.autor = autor;
        this.anio = anio;
        this.estado = 'disponible';
        this.capitulos = [];
    }

    // describir el libro
    describirLibro() {
        return `Libro titulado ${this.titulo}, escrito por ${this.autor} en el año ${this.anio}, el estado es: ${this.estado}.`;
    }

    // agregar un capítulo
    agregarCapitulo(nombreCapitulo) {
        this.capitulos.push(nombreCapitulo);
        return `Capítulo "${nombreCapitulo}" agregado exitosamente.`;
    }

    // para eliminar un capítulo
    eliminarCapitulo(nombreCapitulo) {
        const indice = this.capitulos.indexOf(nombreCapitulo);
        if (indice !== -1) {
            this.capitulos.splice(indice, 1);
            return `Capítulo "${nombreCapitulo}" eliminado exitosamente.`;
        }
        return `Capítulo "${nombreCapitulo}" no encontrado.`;
    }

    //  para listar todos los capítulos
    listarCapitulos() {
        if (this.capitulos.length === 0) {
            return "El libro no tiene capítulos registrados.";
        }
        return `Capítulos del libro:\n${this.capitulos.join('\n')}`;
    }

    //cambiar el estado del libro
    cambiarEstado(nuevoEstado) {
        if (nuevoEstado === 'disponible' || nuevoEstado === 'prestado') {
            this.estado = nuevoEstado;
            return `Estado del libro actualizado a: ${nuevoEstado}`;
        }
        return "Estado no válido. Use 'disponible' o 'prestado'";
    }
}

// Ejemplo de uso
const miLibro = new Libro('Don Quijote de la Mancha', 'Miguel de Cervantes', 1605);

// Ejemplos de uso de los métodos
console.log(miLibro.describirLibro());

// Agregar capítulos
console.log(miLibro.agregarCapitulo('Capítulo 1: El ingenioso hidalgo'));
console.log(miLibro.agregarCapitulo('Capítulo 2: La primera salida'));

// Listar capítulos
console.log(miLibro.listarCapitulos());

// Cambiar estado
console.log(miLibro.cambiarEstado('prestado'));
console.log(miLibro.describirLibro());

// Eliminar capítulo
console.log(miLibro.eliminarCapitulo('Capítulo 1: El ingenioso hidalgo'));
console.log(miLibro.listarCapitulos());
