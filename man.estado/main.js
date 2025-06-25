// Estado de la aplicación
let productos = [];
let filtroActual = 'todos';

// Referencias a elementos del DOM
const nuevoProductoInput = document.getElementById('nuevo-producto');
const agregarBtn = document.getElementById('agregar-btn');
const productosLista = document.getElementById('productos-lista');
const emptyMessage = document.getElementById('empty-message');
const noFilterMessage = document.getElementById('no-filter-message');
const cleanupActions = document.getElementById('cleanup-actions');
const limpiarCompletadosBtn = document.getElementById('limpiar-completados');
const limpiarTodoBtn = document.getElementById('limpiar-todo');

// Contadores
const totalCount = document.getElementById('total-count');
const completedCount = document.getElementById('completed-count');
const pendingCount = document.getElementById('pending-count');
const completedCleanupCount = document.getElementById('completed-cleanup-count');

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Botón agregar
    agregarBtn.addEventListener('click', agregarProducto);
    
    // Enter en el input
    nuevoProductoInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            agregarProducto();
        }
    });
    
    // Input para habilitar/deshabilitar botón
    nuevoProductoInput.addEventListener('input', function() {
        agregarBtn.disabled = !this.value.trim();
    });
    
    // Filtros
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Remover clase active de todos los botones
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            // Agregar clase active al botón clickeado
            this.classList.add('active');
            
            filtroActual = this.dataset.filter;
            mostrarProductos();
        });
    });
    
    // Botones de limpieza
    limpiarCompletadosBtn.addEventListener('click', limpiarCompletados);
    limpiarTodoBtn.addEventListener('click', limpiarTodo);
    
    // Inicializar
    actualizarEstadisticas();
    mostrarProductos();
});

// Función para agregar un nuevo producto
function agregarProducto() {
    const nombre = nuevoProductoInput.value.trim();
    
    if (nombre === '') return;
    
    const producto = {
        id: Date.now(), // ID único basado en timestamp
        nombre: nombre,
        completado: false,
        fechaCreacion: new Date().toLocaleString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    };
    
    productos.push(producto);
    nuevoProductoInput.value = '';
    agregarBtn.disabled = true;
    
    actualizarUI();
}

// Función para eliminar un producto
function eliminarProducto(id) {
    productos = productos.filter(producto => producto.id !== id);
    actualizarUI();
}

// Función para marcar/desmarcar un producto como completado
function toggleCompletado(id) {
    productos = productos.map(producto => 
        producto.id === id 
            ? { ...producto, completado: !producto.completado }
            : producto
    );
    actualizarUI();
}

// Función para limpiar productos completados
function limpiarCompletados() {
    productos = productos.filter(producto => !producto.completado);
    actualizarUI();
}

// Función para limpiar toda la lista
function limpiarTodo() {
    if (confirm('¿Estás seguro de que quieres eliminar todos los productos?')) {
        productos = [];
        actualizarUI();
    }
}

// Función para filtrar productos
function filtrarProductos() {
    switch (filtroActual) {
        case 'completados':
            return productos.filter(producto => producto.completado);
        case 'pendientes':
            return productos.filter(producto => !producto.completado);
        default:
            return productos;
    }
}

// Función para mostrar productos en el DOM
function mostrarProductos() {
    const productosFiltrados = filtrarProductos();
    
    // Limpiar lista
    productosLista.innerHTML = '';
    
    // Mostrar/ocultar mensajes
    if (productos.length === 0) {
        emptyMessage.style.display = 'block';
        noFilterMessage.style.display = 'none';
    } else if (productosFiltrados.length === 0) {
        emptyMessage.style.display = 'none';
        noFilterMessage.style.display = 'block';
    } else {
        emptyMessage.style.display = 'none';
        noFilterMessage.style.display = 'none';
        
        // Crear elementos para cada producto
        productosFiltrados.forEach(producto => {
            const li = document.createElement('li');
            li.className = `product-item ${producto.completado ? 'completed' : ''}`;
            
            li.innerHTML = `
                <div class="product-checkbox ${producto.completado ? 'checked' : ''}" 
                     onclick="toggleCompletado(${producto.id})">
                    <i class="fas fa-check"></i>
                </div>
                <span class="product-name ${producto.completado ? 'completed' : ''}">
                    ${producto.nombre}
                </span>
                <span class="product-date">
                    ${producto.fechaCreacion}
                </span>
                <button class="delete-btn" onclick="eliminarProducto(${producto.id})" title="Eliminar producto">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            
            productosLista.appendChild(li);
        });
    }
}

// Función para actualizar estadísticas
function actualizarEstadisticas() {
    const total = productos.length;
    const completados = productos.filter(p => p.completado).length;
    const pendientes = total - completados;
    
    totalCount.textContent = total;
    completedCount.textContent = completados;
    pendingCount.textContent = pendientes;
    completedCleanupCount.textContent = completados;
    
    // Mostrar/ocultar acciones de limpieza
    if (total > 0) {
        cleanupActions.style.display = 'flex';
        limpiarCompletadosBtn.style.display = completados > 0 ? 'flex' : 'none';
    } else {
        cleanupActions.style.display = 'none';
    }
}

// Función para actualizar toda la UI
function actualizarUI() {
    actualizarEstadisticas();
    mostrarProductos();
}

// Funciones auxiliares para crear elementos
function crearElemento(tag, className, contenido) {
    const elemento = document.createElement(tag);
    if (className) elemento.className = className;
    if (contenido) elemento.innerHTML = contenido;
    return elemento;
}

// Función para mostrar notificaciones (opcional)
function mostrarNotificacion(mensaje, tipo = 'info') {
    const notificacion = document.createElement('div');
    notificacion.className = `notification ${tipo}`;
    notificacion.textContent = mensaje;
    
    // Estilos para la notificación
    notificacion.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        background: ${tipo === 'success' ? '#10b981' : '#4f46e5'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notificacion);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notificacion.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            if (document.body.contains(notificacion)) {
                document.body.removeChild(notificacion);
            }
        }, 300);
    }, 3000);
}

// Agregar animaciones CSS para notificaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(style);

// Función para exportar lista (funcionalidad extra)
function exportarLista() {
    const texto = productos.map(p => 
        `${p.completado ? '✓' : '○'} ${p.nombre} (${p.fechaCreacion})`
    ).join('\n');
    
    const blob = new Blob([texto], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lista-compras.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    mostrarNotificacion('Lista exportada exitosamente', 'success');
}

// Función para importar lista desde localStorage (funcionalidad extra)
function guardarEnStorage() {
    localStorage.setItem('listaCompras', JSON.stringify(productos));
}

function cargarDeStorage() {
    const datosGuardados = localStorage.getItem('listaCompras');
    if (datosGuardados) {
        productos = JSON.parse(datosGuardados);
        actualizarUI();
    }
}

// Auto-guardar cada vez que cambia la lista
function actualizarUIConStorage() {
    actualizarUI();
    guardarEnStorage();
}

// Reemplazar las llamadas a actualizarUI() con actualizarUIConStorage() si quieres persistencia
// (Comentado por defecto para seguir las instrucciones del taller)

// Cargar datos al iniciar (descomenta si quieres persistencia)
// document.addEventListener('DOMContentLoaded', cargarDeStorage);
