let listaDeCompras = [];

// Obtener referencias a elementos del DOM
const productoInput = document.getElementById('productoInput');
const agregarBtn = document.getElementById('agregarBtn');
const listaProductos = document.getElementById('listaProductos');
const listaVacia = document.getElementById('listaVacia');

/**
 * Agrega un nuevo producto a la lista de compras si no existe.
 * @param {string} producto - El nombre del producto a agregar.
 * @returns {boolean} - true si se agregó el producto, false si ya existía.
 */
const agregarProducto = (producto) => {
  // Validar que no esté vacío
  if (!producto.trim()) {
    alert('Por favor ingresa un producto válido');
    return false;
  }
  
  // Verificar si el producto ya existe en la lista (ignorando mayúsculas/minúsculas)
  const productoNormalizado = producto.trim().toLowerCase();
  const existe = listaDeCompras.some(p => p.toLowerCase() === productoNormalizado);
  
  if (!existe) {
    listaDeCompras.push(producto.trim());
    actualizarInterfaz();
    return true;
  } else {
    alert(`"${producto}" ya está en la lista.`);
    return false;
  }
};

/**
 * Elimina un producto de la lista de compras.
 * @param {string} producto - El nombre del producto a eliminar.
 * @returns {boolean} - true si se eliminó el producto, false si no existía.
 */
const eliminarProducto = (producto) => {
  const indice = listaDeCompras.findIndex(p => p === producto);
  if (indice !== -1) {
    listaDeCompras.splice(indice, 1);
    actualizarInterfaz();
    return true;
  }
  return false;
};

/**
 * Muestra todos los productos en la lista de compras.
 * @returns {string[]} - El arreglo con los productos de la lista.
 */
const mostrarLista = () => {
  return listaDeCompras;
};

/**
 * Actualiza la interfaz para mostrar los productos actuales
 */
const actualizarInterfaz = () => {
  // Limpiar la lista actual
  listaProductos.innerHTML = '';
  
  // Mostrar mensaje de lista vacía si corresponde
  if (listaDeCompras.length === 0) {
    listaVacia.style.display = 'block';
  } else {
    listaVacia.style.display = 'none';
    
    // Agregar cada producto a la lista
    listaDeCompras.forEach((producto) => {
      const li = document.createElement('li');
      
      // Texto del producto
      const textoProducto = document.createTextNode(producto);
      li.appendChild(textoProducto);
      
      // Botón de eliminar
      const eliminarBtn = document.createElement('button');
      eliminarBtn.textContent = 'Eliminar';
      eliminarBtn.className = 'eliminar-btn';
      eliminarBtn.onclick = () => eliminarProducto(producto);
      
      li.appendChild(eliminarBtn);
      listaProductos.appendChild(li);
    });
  }
};

// Event Listeners
agregarBtn.addEventListener('click', () => {
  agregarProducto(productoInput.value);
  productoInput.value = ''; // Limpiar el campo de entrada
  productoInput.focus();    // Volver a enfocar el campo
});

productoInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    agregarProducto(productoInput.value);
    productoInput.value = '';
  }
});

// Inicializar la interfaz
actualizarInterfaz();
