// Importamos nuestro módulo de planetas
const planetas = require('./planetas');
const readline = require('readline');

// Configuramos la interfaz de línea de comandos
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

class ExploradorEspacial {
  constructor() {
    this.planetasVisitados = [];
  }

  mostrarMenu() {
    console.clear();
    console.log('🚀 =======================================');
    console.log('🌌    EXPLORADOR ESPACIAL AVANZADO    🌌');
    console.log('🚀 =======================================');
    console.log('');
    console.log('¿Qué deseas hacer, explorador?');
    console.log('1. 🔍 Ver todos los planetas');
    console.log('2. 🪐 Buscar planeta por nombre');
    console.log('3. 📊 Estadísticas de exploración');
    console.log('4. ⭐ Marcar planeta como visitado');
    console.log('5. 🗺️  Ver planetas visitados');
    console.log('6. 🎲 Planeta aleatorio');
    console.log('7. 🚪 Salir');
    console.log('');
  }

  verTodosPlanetas() {
    console.log('\n🌌 CATÁLOGO COMPLETO DE PLANETAS:\n');
    planetas.forEach((planeta, index) => {
      const visitado = this.planetasVisitados.includes(planeta.nombre) ? '✅' : '⏳';
      console.log(`${visitado} ${index + 1}. ${planeta.nombre}`);
      console.log(`   📝 ${planeta.descripcion}`);
      console.log(`   📅 Descubierto: ${planeta.descubiertoEn}`);
      console.log('');
    });
  }

  buscarPlaneta(nombre) {
    const planeta = planetas.find(p => 
      p.nombre.toLowerCase().includes(nombre.toLowerCase())
    );
    
    if (planeta) {
      const visitado = this.planetasVisitados.includes(planeta.nombre) ? '✅ VISITADO' : '⏳ PENDIENTE';
      console.log(`\n🎯 ¡Planeta encontrado!`);
      console.log(`🪐 Nombre: ${planeta.nombre} ${visitado}`);
      console.log(`📝 Descripción: ${planeta.descripcion}`);
      console.log(`📅 Descubierto en: ${planeta.descubiertoEn}`);
    } else {
      console.log(`\n❌ No se encontró ningún planeta con el nombre "${nombre}"`);
    }
  }

  mostrarEstadisticas() {
    const totalPlanetas = planetas.length;
    const planetasVisitados = this.planetasVisitados.length;
    const porcentajeVisitado = ((planetasVisitados / totalPlanetas) * 100).toFixed(1);
    
    console.log('\n📊 ESTADÍSTICAS DE EXPLORACIÓN:');
    console.log(`🌌 Total de planetas conocidos: ${totalPlanetas}`);
    console.log(`✅ Planetas visitados: ${planetasVisitados}`);
    console.log(`⏳ Planetas pendientes: ${totalPlanetas - planetasVisitados}`);
    console.log(`📈 Progreso de exploración: ${porcentajeVisitado}%`);
    console.log(`🏆 Estado: ${this.obtenerRango(porcentajeVisitado)}`);
  }

  obtenerRango(porcentaje) {
    if (porcentaje === 100) return 'Maestro Explorador 🌟';
    if (porcentaje >= 80) return 'Explorador Experto 🚀';
    if (porcentaje >= 60) return 'Explorador Veterano 🛰️';
    if (porcentaje >= 40) return 'Explorador Intermedio 🌙';
    if (porcentaje >= 20) return 'Explorador Novato 🌠';
    return 'Aspirante a Explorador 🔭';
  }

  marcarComoVisitado(nombre) {
    const planeta = planetas.find(p => 
      p.nombre.toLowerCase().includes(nombre.toLowerCase())
    );
    
    if (planeta) {
      if (!this.planetasVisitados.includes(planeta.nombre)) {
        this.planetasVisitados.push(planeta.nombre);
        console.log(`\n✅ ¡${planeta.nombre} marcado como visitado!`);
        console.log(`🚀 ¡Continúa explorando el universo!`);
      } else {
        console.log(`\n⚠️  Ya has visitado ${planeta.nombre} anteriormente.`);
      }
    } else {
      console.log(`\n❌ No se encontró el planeta "${nombre}"`);
    }
  }

  verPlanetasVisitados() {
    if (this.planetasVisitados.length === 0) {
      console.log('\n🌌 Aún no has visitado ningún planeta.');
      console.log('¡Comienza tu aventura explorando nuevos mundos!');
      return;
    }

    console.log('\n🗺️  PLANETAS VISITADOS:');
    this.planetasVisitados.forEach((nombrePlaneta, index) => {
      const planeta = planetas.find(p => p.nombre === nombrePlaneta);
      console.log(`${index + 1}. ✅ ${planeta.nombre}`);
      console.log(`   📝 ${planeta.descripcion}`);
      console.log('');
    });
  }

  planetaAleatorio() {
    const indiceAleatorio = Math.floor(Math.random() * planetas.length);
    const planeta = planetas[indiceAleatorio];
    const visitado = this.planetasVisitados.includes(planeta.nombre) ? '✅' : '⏳';
    
    console.log('\n🎲 ¡PLANETA ALEATORIO SELECCIONADO!');
    console.log(`🪐 ${planeta.nombre} ${visitado}`);
    console.log(`📝 ${planeta.descripcion}`);
    console.log(`📅 Descubierto en: ${planeta.descubiertoEn}`);
  }

  iniciar() {
    this.mostrarMenu();
    this.preguntarOpcion();
  }

  preguntarOpcion() {
    rl.question('👉 Selecciona una opción (1-7): ', (respuesta) => {
      switch(respuesta) {
        case '1':
          this.verTodosPlanetas();
          this.continuar();
          break;
        case '2':
          rl.question('🔍 Ingresa el nombre del planeta a buscar: ', (nombre) => {
            this.buscarPlaneta(nombre);
            this.continuar();
          });
          break;
        case '3':
          this.mostrarEstadisticas();
          this.continuar();
          break;
        case '4':
          rl.question('⭐ Ingresa el nombre del planeta visitado: ', (nombre) => {
            this.marcarComoVisitado(nombre);
            this.continuar();
          });
          break;
        case '5':
          this.verPlanetasVisitados();
          this.continuar();
          break;
        case '6':
          this.planetaAleatorio();
          this.continuar();
          break;
        case '7':
          console.log('\n🚀 ¡Gracias por explorar el universo!');
          console.log('🌟 ¡Que la fuerza te acompañe en futuras misiones!');
          rl.close();
          break;
        default:
          console.log('\n❌ Opción no válida. Por favor selecciona del 1 al 7.');
          this.continuar();
      }
    });
  }

  continuar() {
    console.log('\n');
    rl.question('Presiona ENTER para continuar...', () => {
      this.mostrarMenu();
      this.preguntarOpcion();
    });
  }
}

// Iniciar la aplicación
const explorador = new ExploradorEspacial();
explorador.iniciar();
