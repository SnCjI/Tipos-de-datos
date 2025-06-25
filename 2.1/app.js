// Componente principal de la aplicación de contador de tareas
const { useState, useEffect, useMemo } = React;

// Función para crear iconos SVG
const Icon = ({ name, className = "icon" }) => {
    const iconMap = {
        clock: (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12,6 12,12 16,14"/>
            </svg>
        ),
        plus: (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
        ),
        play: (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polygon points="5,3 19,12 5,21"/>
            </svg>
        ),
        pause: (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="6" y="4" width="4" height="16"/>
                <rect x="14" y="4" width="4" height="16"/>
            </svg>
        ),
        trash: (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="3,6 5,6 21,6"/>
                <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
            </svg>
        ),
        checkCircle: (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22,4 12,14.01 9,11.01"/>
            </svg>
        )
    };
    
    return iconMap[name] || null;
};

// Componente de estadísticas
const StatsCard = ({ value, label, type }) => {
    return (
        <div className={`stat-card ${type}`}>
            <div className="stat-number">{value}</div>
            <div className="stat-label">{label}</div>
        </div>
    );
};

// Componente individual de tarea
const TaskItem = ({ task, onToggle, onComplete, onDelete }) => {
    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const getTaskClass = () => {
        if (task.completed) return 'completed';
        if (task.isRunning) return 'running';
        return 'default';
    };

    return (
        <div className={`task-item ${getTaskClass()}`}>
            <div className="task-left">
                <button
                    onClick={() => onComplete(task.id)}
                    className={`task-checkbox ${task.completed ? 'completed' : 'default'}`}
                >
                    {task.completed && <Icon name="checkCircle" className="icon" />}
                </button>
                <div className="task-info">
                    <h3 className={task.completed ? 'completed' : 'default'}>
                        {task.name}
                    </h3>
                    <div className="task-meta">
                        Tiempo: {formatTime(task.time)}
                        {task.isRunning && (
                            <span className="status-badge">En ejecución</span>
                        )}
                    </div>
                </div>
            </div>
            
            <div className="task-actions">
                {!task.completed && (
                    <button
                        onClick={() => onToggle(task.id)}
                        className={`btn-icon ${task.isRunning ? 'btn-pause' : 'btn-play'}`}
                        title={task.isRunning ? 'Pausar' : 'Iniciar'}
                    >
                        <Icon name={task.isRunning ? 'pause' : 'play'} />
                    </button>
                )}
                <button
                    onClick={() => onDelete(task.id)}
                    className="btn-icon btn-delete"
                    title="Eliminar tarea"
                >
                    <Icon name="trash" />
                </button>
            </div>
        </div>
    );
};

// Componente principal de la aplicación
const TaskTimer = () => {
    // Estados principales
    const [tasks, setTasks] = useState([
        { id: 1, name: 'Estudiar React Hooks', time: 3600, isRunning: false, completed: false },
        { id: 2, name: 'Practicar useEffect', time: 2400, isRunning: false, completed: false },
        { id: 3, name: 'Implementar useMemo', time: 1800, isRunning: false, completed: true },
        { id: 4, name: 'Leer documentación', time: 900, isRunning: true, completed: false }
    ]);
    
    const [newTaskName, setNewTaskName] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date());

    // useEffect #1: Actualizar la hora actual cada segundo
    useEffect(() => {
        console.log('🕒 Configurando reloj en tiempo real...');
        
        const timeInterval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        // Cleanup function - muy importante para evitar memory leaks
        return () => {
            console.log('🧹 Limpiando intervalo del reloj');
            clearInterval(timeInterval);
        };
    }, []); // Array de dependencias vacío = solo se ejecuta una vez

    // useEffect #2: Incrementar tiempo de tareas activas
    useEffect(() => {
        console.log('⏱️ Configurando temporizadores de tareas...');
        
        const taskInterval = setInterval(() => {
            setTasks(prevTasks => 
                prevTasks.map(task => {
                    // Solo incrementar si la tarea está corriendo y no está completada
                    if (task.isRunning && !task.completed) {
                        return { ...task, time: task.time + 1 };
                    }
                    return task;
                })
            );
        }, 1000);

        // Cleanup function
        return () => {
            console.log('🧹 Limpiando intervalos de tareas');
            clearInterval(taskInterval);
        };
    }, []); // Sin dependencias porque usamos la función de callback

    // useEffect #3: Efecto que se ejecuta cuando cambian las tareas
    useEffect(() => {
        const runningTasks = tasks.filter(task => task.isRunning).length;
        console.log(`📊 Estado actual: ${runningTasks} tareas en ejecución`);
        
        // Cambiar el título de la página si hay tareas corriendo
        if (runningTasks > 0) {
            document.title = `⏰ ${runningTasks} tareas activas - Contador de Tareas`;
        } else {
            document.title = 'Contador de Tareas';
        }
    }, [tasks]); // Se ejecuta cada vez que cambia el array de tareas

    // useMemo #1: Calcular estadísticas optimizadas
    const taskStats = useMemo(() => {
        console.log('📈 Recalculando estadísticas de tareas...');
        
        const totalTime = tasks.reduce((sum, task) => sum + task.time, 0);
        const completedTasks = tasks.filter(task => task.completed).length;
        const activeTasks = tasks.filter(task => task.isRunning).length;
        const pendingTasks = tasks.filter(task => !task.completed).length;
        
        return {
            totalTime,
            completedTasks,
            activeTasks,
            pendingTasks,
            totalTasks: tasks.length
        };
    }, [tasks]); // Solo recalcula cuando cambia el array de tareas

    // useMemo #2: Ordenar y filtrar tareas de manera optimizada
    const sortedTasks = useMemo(() => {
        console.log('🔄 Reordenando lista de tareas...');
        
        return [...tasks].sort((a, b) => {
            // Primero las tareas no completadas
            if (a.completed && !b.completed) return 1;
            if (!a.completed && b.completed) return -1;
            
            // Luego las que están corriendo
            if (a.isRunning && !b.isRunning) return -1;
            if (!a.isRunning && b.isRunning) return 1;
            
            // Finalmente ordenar por tiempo (mayor a menor)
            return b.time - a.time;
        });
    }, [tasks]);

    // useMemo #3: Formatear tiempo total de manera optimizada
    const formattedTotalTime = useMemo(() => {
        const formatTime = (seconds) => {
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const secs = seconds % 60;
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        };
        
        return formatTime(taskStats.totalTime);
    }, [taskStats.totalTime]);

    // Funciones de manejo de tareas
    const addTask = () => {
        if (newTaskName.trim()) {
            const newTask = {
                id: Date.now(), // ID simple basado en timestamp
                name: newTaskName.trim(),
                time: 0,
                isRunning: false,
                completed: false
            };
            
            setTasks(prevTasks => [...prevTasks, newTask]);
            setNewTaskName('');
            console.log('➕ Nueva tarea agregada:', newTask.name);
        }
    };

    const toggleTask = (taskId) => {
        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === taskId 
                    ? { ...task, isRunning: !task.isRunning }
                    : task
            )
        );
        console.log('▶️⏸️ Tarea toggled:', taskId);
    };

    const completeTask = (taskId) => {
        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === taskId 
                    ? { ...task, completed: !task.completed, isRunning: false }
                    : task
            )
        );
        console.log('✅ Tarea completada/descompletada:', taskId);
    };

    const deleteTask = (taskId) => {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
        console.log('🗑️ Tarea eliminada:', taskId);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    };

    // Render del componente
    return (
        <div className="app-container">
            <div className="main-content">
                {/* Header con reloj */}
                <div className="card">
                    <div className="header">
                        <h1 className="header-title">
                            <Icon name="clock" />
                            Contador de Tareas
                        </h1>
                        <div className="current-time">
                            <div className="time-display">
                                {currentTime.toLocaleTimeString()}
                            </div>
                            <div className="date-display">
                                {currentTime.toLocaleDateString('es-ES', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Panel de estadísticas */}
                    <div className="stats-grid">
                        <StatsCard 
                            value={taskStats.totalTasks} 
                            label="Total" 
                            type="total" 
                        />
                        <StatsCard 
                            value={taskStats.completedTasks} 
                            label="Completadas" 
                            type="completed" 
                        />
                        <StatsCard 
                            value={taskStats.pendingTasks} 
                            label="Pendientes" 
                            type="pending" 
                        />
                        <StatsCard 
                            value={taskStats.activeTasks} 
                            label="Activas" 
                            type="active" 
                        />
                        <StatsCard 
                            value={formattedTotalTime} 
                            label="Tiempo Total" 
                            type="time" 
                        />
                    </div>
                </div>

                {/* Formulario para agregar tareas */}
                <div className="card">
                    <h2 className="section-title">Agregar Nueva Tarea</h2>
                    <div className="add-task-form">
                        <input
                            type="text"
                            className="task-input"
                            value={newTaskName}
                            onChange={(e) => setNewTaskName(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Escribe el nombre de tu tarea..."
                            maxLength={100}
                        />
                        <button 
                            onClick={addTask} 
                            className="btn btn-primary"
                            disabled={!newTaskName.trim()}
                        >
                            <Icon name="plus" />
                            Agregar Tarea
                        </button>
                    </div>
                </div>

                {/* Lista de tareas */}
                <div className="card">
                    <h2 className="section-title">
                        Mis Tareas ({taskStats.totalTasks})
                    </h2>
                    
                    {sortedTasks.length === 0 ? (
                        <div className="empty-state">
                            <p>🎯 No tienes tareas aún.</p>
                            <p>¡Agrega una nueva tarea para comenzar a gestionar tu tiempo!</p>
                        </div>
                    ) : (
                        <div className="tasks-container">
                            {sortedTasks.map(task => (
                                <TaskItem
