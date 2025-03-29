// Arreglo de productos con propiedades nombre, precio y categoría
const productos = [
    { 
        id: 1, 
        nombre: "Anillo Destello Eterno", 
        precio: 1299.99, 
        categoria: "anillos",
        descripcion: "Anillo de oro de 18k con diamante central de 0.5 quilates",
        imagen: "placeholder-anillo1.jpg"
    },
    { 
        id: 2, 
        nombre: "Collar de Perlas Akoya", 
        precio: 899.99, 
        categoria: "collares",
        descripcion: "Collar de perlas cultivadas con broche de oro",
        imagen: "placeholder-collar1.jpg"
    },
    { 
        id: 3, 
        nombre: "Aretes Clásicos", 
        precio: 89.99, 
        categoria: "aretes",
        descripcion: "Aretes pequeños con detalles en plata",
        imagen: "placeholder-aretes1.jpg"
    },
    { 
        id: 4, 
        nombre: "Pulsera Delicada", 
        precio: 59.99, 
        categoria: "pulseras",
        descripcion: "Pulsera fina de plata con dije minimalista",
        imagen: "placeholder-pulsera1.jpg"
    },
    { 
        id: 5, 
        nombre: "Anillo Simple", 
        precio: 49.99, 
        categoria: "anillos",
        descripcion: "Anillo minimalista de plata esterlina",
        imagen: "placeholder-anillo2.jpg"
    },
    { 
        id: 6, 
        nombre: "Brazalete Dorado", 
        precio: 129.99, 
        categoria: "pulseras",
        descripcion: "Brazalete rígido de oro con detalles grabados",
        imagen: "placeholder-pulsera2.jpg"
    },
    { 
        id: 7, 
        nombre: "Gargantilla Elegante", 
        precio: 1499.99, 
        categoria: "collares",
        descripcion: "Gargantilla de diamantes con cadena de oro blanco",
        imagen: "placeholder-collar2.jpg"
    },
    { 
        id: 8, 
        nombre: "Pendientes de Diamante", 
        precio: 2199.99, 
        categoria: "aretes",
        descripcion: "Pendientes con diamantes de alta calidad",
        imagen: "placeholder-aretes2.jpg"
    }
];

// Función para generar el HTML de un producto
function generarHTMLProducto(producto) {
    return `
        <div class="product">
            <img src="${producto.imagen}" alt="${producto.nombre}" />
            <h3>${producto.nombre}</h3>
            <p class="price">$${producto.precio.toFixed(2)}</p>
            <p>${producto.descripcion}</p>
            <button>Añadir al carrito</button>
        </div>
    `;
}

// Filtrar productos por categoría y mostrarlos en sus respectivas secciones
function mostrarProductosPorCategoria() {
    const anillosContainer = document.getElementById('anillos-container');
    const collaresContainer = document.getElementById('collares-container');
    const pulserasContainer = document.getElementById('pulseras-container');
    const aretesContainer = document.getElementById('aretes-container');
    
    // Filtrar y mostrar anillos
    const anillos = productos.filter(producto => producto.categoria === 'anillos');
    anillosContainer.innerHTML = anillos.map(generarHTMLProducto).join('');
    
    // Filtrar y mostrar collares
    const collares = productos.filter(producto => producto.categoria === 'collares');
    collaresContainer.innerHTML = collares.map(generarHTMLProducto).join('');
    
    // Filtrar y mostrar pulseras
    const pulseras = productos.filter(producto => producto.categoria === 'pulseras');
    pulserasContainer.innerHTML = pulseras.map(generarHTMLProducto).join('');
    
    // Filtrar y mostrar aretes
    const aretes = productos.filter(producto => producto.categoria === 'aretes');
    aretesContainer.innerHTML = aretes.map(generarHTMLProducto).join('');
}

// 2. Usar filter() para obtener productos que cuesten menos de $100
function mostrarProductosEconomicos() {
    const productosEconomicos = productos.filter(producto => producto.precio < 100);
    console.log("Productos por debajo de $100:", productosEconomicos);
    
    const listaProductosEconomicos = document.getElementById('productos-economicos');
    listaProductosEconomicos.innerHTML = productosEconomicos
        .map(producto => `<li>${producto.nombre} - $${producto.precio.toFixed(2)}</li>`)
        .join('');
    
    return productosEconomicos;
}

// 3. Usar sort() para ordenar alfabéticamente por nombre
function ordenarProductosAlfabeticamente(productos) {
    const productosOrdenados = [...productos].sort((a, b) => a.nombre.localeCompare(b.nombre));
    console.log("Productos ordenados alfabéticamente:", productosOrdenados);
    
    const listaProductosAlfabeticos = document.getElementById('productos-alfabeticos');
    listaProductosAlfabeticos.innerHTML = productosOrdenados
        .map(producto => `<li>${producto.nombre}</li>`)
        .join('');
    
    return productosOrdenados;
}

// 4. Usar map() para obtener solo los nombres
function obtenerNombresProductos(productos) {
    const nombresProductos = productos.map(producto => producto.nombre);
    console.log("Nombres de productos:", nombresProductos);
    
    const listaNombresProductos = document.getElementById('nombres-productos');
    listaNombresProductos.innerHTML = nombresProductos
        .map(nombre => `<li>${nombre}</li>`)
        .join('');
    
    return nombresProductos;
}

// 6. Método adicional: reduce para calcular el valor total del inventario
function calcularValorInventario() {
    const valorTotal = productos.reduce((total, producto) => total + producto.precio, 0);
    console.log("Valor total del inventario:", valorTotal);
    return valorTotal;
}

// Método adicional: some para verificar si hay productos premium (más de $1000)
function verificarProductosPremium() {
    const hayProductosPremium = productos.some(producto => producto.precio > 1000);
    console.log("¿Hay productos premium?", hayProductosPremium);
    
    // Si hay productos premium, mostrarlos
    if (hayProductosPremium) {
        const productosPremium = productos.filter(producto => producto.precio > 1000);
        const listaProductosPremium = document.getElementById('productos-premium');
        listaProductosPremium.innerHTML = productosPremium
            .map(producto => `<li>${producto.nombre} - $${producto.precio.toFixed(2)}</li>`)
            .join('');
    }
    
    return hayProductosPremium;
}

// Método adicional: every para verificar si todos los productos tienen descripción
function verificarDescripciones() {
    const todosConDescripcion = productos.every(producto => producto.descripcion && producto.descripcion.length > 0);
    console.log("¿Todos los productos tienen descripción?", todosConDescripcion);
    return todosConDescripcion;
}

// Mostrar información adicional usando los diferentes métodos
function mostrarInformacionAdicional() {
    const valorInventario = calcularValorInventario();
    const hayPremium = verificarProductosPremium();
    const todosConDescripcion = verificarDescripciones();
    
    const precioPromedio = valorInventario / productos.length;
    
    const infoAdicional = document.getElementById('info-adicional');
    infoAdicional.innerHTML = `
        <p><strong>Valor total del inventario:</strong> $${valorInventario.toFixed(2)}</p>
        <p><strong>Precio promedio de productos:</strong> $${precioPromedio.toFixed(2)}</p>
        <p><strong>¿Hay productos premium?</strong> ${hayPremium ? 'Sí' : 'No'}</p>
        <p><strong>¿Todos los productos tienen descripción?</strong> ${todosConDescripcion ? 'Sí' : 'No'}</p>
    `;
}

// Ejecutar todas las funciones cuando el documento esté listo
document.addEventListener('DOMContentLoaded', function() {
    mostrarProductosPorCategoria();
    
    // 2. Filtrar productos económicos
    const productosEconomicos = mostrarProductosEconomicos();
    
    // 3. Ordenar alfabéticamente
    const productosOrdenados = ordenarProductosAlfabeticamente(productosEconomicos);
    
    // 4. Obtener solo nombres
    obtenerNombresProductos(productosOrdenados);
    
    // Información adicional con otros métodos
    mostrarInformacionAdicional();
});
