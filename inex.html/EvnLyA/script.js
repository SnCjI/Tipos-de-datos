// Modelo de la aplicación
class CafeModel {
    constructor() {
        this.orders = new Map();
        this.lastOrderId = 0;
        this.coffeeTypes = {
            'Espresso': 2000,
            'Americano': 3000,
            'Cappuccino': 4000,
            'Latte': 5000,
            'Mocha': 6000
        };
        this.stats = {
            pending: 0,
            completed: 0,
            total: 0
        };
    }
    
    createOrder(coffeeType) {
        const orderId = ++this.lastOrderId;
        const preparationTime = this.coffeeTypes[coffeeType] || 3000;
        
        const order = {
            id: orderId,
            coffeeType,
            status: 'pending',
            createdAt: new Date(),
            preparationTime,
            progress: 0
        };
        
        this.orders.set(orderId, order);
        this.stats.pending++;
        this.stats.total++;
        
        return order;
    }
    
    async processOrder(orderId) {
        const order = this.orders.get(orderId);
        if (!order || order.status !== 'pending') return null;
        
        // La promesa simulará el tiempo de preparación del café
        return new Promise((resolve) => {
            const startTime = Date.now();
            const intervalId = setInterval(() => {
                const elapsedTime = Date.now() - startTime;
                const progress = Math.min(100, Math.round((elapsedTime / order.preparationTime) * 100));
                
                // Actualizar el progreso
                order.progress = progress;
                this.updateOrderProgress(orderId, progress);
                
                if (progress >= 100) {
                    clearInterval(intervalId);
                    
                    // Actualizar el estado después de completar el pedido
                    this.updateOrderStatus(orderId, 'completed');
                    
                    resolve(order);
                }
            }, 100); // Actualiza cada 100ms para una animación suave
        });
    }
    
    updateOrderProgress(orderId, progress) {
        const order = this.orders.get(orderId);
        if (!order) return;
        
        order.progress = progress;
    }
    
    updateOrderStatus(orderId, status) {
        const order = this.orders.get(orderId);
        if (!order) return;
        
        const oldStatus = order.status;
        order.status = status;
        
        // Actualizar estadísticas
        if (oldStatus === 'pending' && status === 'completed') {
            this.stats.pending--;
            this.stats.completed++;
        }
    }
    
    getOrderById(orderId) {
        return this.orders.get(orderId);
    }
    
    getAllOrders() {
        return Array.from(this.orders.values());
    }
    
    getPendingOrders() {
        return Array.from(this.orders.values()).filter(order => order.status === 'pending');
    }
    
    getCompletedOrders() {
        return Array.from(this.orders.values()).filter(order => order.status === 'completed');
    }
    
    clearCompletedOrders() {
        const completedOrders = this.getCompletedOrders();
        
        for (const order of completedOrders) {
            this.orders.delete(order.id);
        }
        
        return completedOrders.length;
    }
    
    getStats() {
        return this.stats;
    }
}

// Vista de la aplicación
class CafeView {
    constructor() {
        this.ordersContainer = document.getElementById('orders-container');
        this.coffeeTypeSelect = document.getElementById('coffee-type');
        this.addOrderBtn = document.getElementById('add-order-btn');
        this.addMultipleBtn = document.getElementById('add-multiple-btn');
        this.clearCompletedBtn = document.getElementById('clear-completed-btn');
        this.pendingCountEl = document.getElementById('pending-count');
        this.completedCountEl = document.getElementById('completed-count');
        this.totalCountEl = document.getElementById('total-count');
    }
    
    renderOrder(order) {
        const existingOrder = document.getElementById(`order-${order.id}`);
        
        if (existingOrder) {
            // Actualizar orden existente
            const statusEl = existingOrder.querySelector('.order-status');
            const progressBarEl = existingOrder.querySelector('.progress-bar');
            
            if (order.status === 'completed') {
                statusEl.textContent = 'Completado';
                statusEl.className = 'order-status status-completed';
                progressBarEl.style.width = '100%';
                progressBarEl.classList.add('completed');
            } else {
                statusEl.textContent = 'En Proceso';
                statusEl.className = 'order-status status-pending';
                progressBarEl.style.width = `${order.progress}%`;
            }
        } else {
            // Crear nueva orden
            const orderCard = document.createElement('div');
            orderCard.className = 'order-card';
            orderCard.id = `order-${order.id}`;
            
            const statusClass = order.status === 'completed' ? 'status-completed' : 'status-pending';
            const statusText = order.status === 'completed' ? 'Completado' : 'En Proceso';
            
            orderCard.innerHTML = `
                <div class="order-header">
                    <div class="order-id">Orden #${order.id}</div>
                    <div class="order-status ${statusClass}">${statusText}</div>
                </div>
                <div class="order-details">
                    <div class="order-item">
                        <div>Tipo de Café:</div>
                        <div>${order.coffeeType}</div>
                    </div>
                    <div class="order-item">
                        <div>Tiempo de Preparación:</div>
                        <div>${order.preparationTime / 1000}s</div>
                    </div>
                </div>
                <div class="progress-bar ${order.status === 'completed' ? 'completed' : ''}" style="width: ${order.progress}%"></div>
            `;
            
            this.checkNoOrdersMessage();
            this.ordersContainer.appendChild(orderCard);
        }
    }
    
    checkNoOrdersMessage() {
        const noOrdersMessage = this.ordersContainer.querySelector('.no-orders');
        
        if (noOrdersMessage) {
            noOrdersMessage.remove();
        }
    }
    
    resetOrdersView() {
        this.ordersContainer.innerHTML = `
            <div class="no-orders">
                <p>No hay pedidos aún. ¡Agrega uno nuevo!</p>
            </div>
        `;
    }
    
    updateStats(stats) {
        this.pendingCountEl.textContent = stats.pending;
        this.completedCountEl.textContent = stats.completed;
        this.totalCountEl.textContent = stats.total;
        
        // Habilitar/deshabilitar botón de limpiar según haya completados
        this.clearCompletedBtn.disabled = stats.completed === 0;
    }
    
    getSelectedCoffeeType() {
        return this.coffeeTypeSelect.value;
    }
    
    disableControls() {
        this.addOrderBtn.disabled = true;
        this.addMultipleBtn.disabled = true;
        this.coffeeTypeSelect.disabled = true;
    }
    
    enableControls() {
        this.addOrderBtn.disabled = false;
        this.addMultipleBtn.disabled = false;
        this.coffeeTypeSelect.disabled = false;
    }
}

// Controlador de la aplicación
class CafeController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        
        // Vincular eventos
        this.view.addOrderBtn.addEventListener('click', () => this.handleAddOrder());
        this.view.addMultipleBtn.addEventListener('click', () => this.handleAddMultipleOrders());
        this.view.clearCompletedBtn.addEventListener('click', () => this.handleClearCompleted());
        
        // Inicializar la vista
        this.view.updateStats(this.model.getStats());
    }
    
    async handleAddOrder() {
        const coffeeType = this.view.getSelectedCoffeeType();
        const order = this.model.createOrder(coffeeType);
        
        // Actualizar la vista
        this.view.renderOrder(order);
        this.view.updateStats(this.model.getStats());
        
        // Procesar el pedido de manera asincrónica
        await this.processOrderAsync(order.id);
    }
    
    async handleAddMultipleOrders() {
        const coffeeTypes = Object.keys(this.model.coffeeTypes);
        
        // Deshabilitar controles durante la creación de múltiples pedidos
        this.view.disableControls();
        
        // Crear 5 pedidos aleatorios
        for (let i = 0; i < 5; i++) {
            // Seleccionar un tipo de café aleatorio
            const randomIndex = Math.floor(Math.random() * coffeeTypes.length);
            const coffeeType = coffeeTypes[randomIndex];
            
            // Crear el pedido
            const order = this.model.createOrder(coffeeType);
            this.view.renderOrder(order);
            this.view.updateStats(this.model.getStats());
            
            // Procesar el pedido de manera asincrónica (sin esperar)
            this.processOrderAsync(order.id);
            
            // Esperar un breve momento entre la creación de cada pedido
            if (i < 4) {
                await new Promise(resolve => setTimeout(resolve, 300));
            }
        }
        
        // Rehabilitar controles
        this.view.enableControls();
    }
    
    async processOrderAsync(orderId) {
        try {
            await this.model.processOrder(orderId);
            const updatedOrder = this.model.getOrderById(orderId);
            
            if (updatedOrder) {
                this.view.renderOrder(updatedOrder);
                this.view.updateStats(this.model.getStats());
            }
        } catch (error) {
            console.error(`Error al procesar el pedido #${orderId}:`, error);
        }
    }
    
    handleClearCompleted() {
        const clearedCount = this.model.clearCompletedOrders();
        
        if (clearedCount > 0) {
            // Actualizar la vista
            if (this.model.getAllOrders().length === 0) {
                this.view.resetOrdersView();
            } else {
                // Eliminar los elementos completados del DOM
                const completedElements = document.querySelectorAll('.order-card .status-completed');
                completedElements.forEach(el => {
                    const orderCard = el.closest('.order-card');
                    if (orderCard) {
                        orderCard.remove();
                    }
                });
            }
            
            // Actualizar estadísticas
            this.model.stats.completed = 0;
            this.view.updateStats(this.model.getStats());
        }
    }
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    const cafeModel = new CafeModel();
    const cafeView = new CafeView();
    const cafeController = new CafeController(cafeModel, cafeView);
});
