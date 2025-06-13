// Configuración de validaciones
const validationConfig = {
    nombre: {
        required: true,
        minLength: 2,
        maxLength: 50,
        pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
        messages: {
            required: 'El nombre es obligatorio',
            minLength: 'El nombre debe tener al menos 2 caracteres',
            maxLength: 'El nombre no puede exceder 50 caracteres',
            pattern: 'El nombre solo puede contener letras y espacios'
        }
    },
    correo: {
        required: true,
        pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        messages: {
            required: 'El correo electrónico es obligatorio',
            pattern: 'Por favor ingresa un correo electrónico válido'
        }
    },
    telefono: {
        required: true,
        pattern: /^[0-9]{10}$/,
        messages: {
            required: 'El teléfono es obligatorio',
            pattern: 'El teléfono debe tener exactamente 10 dígitos'
        }
    },
    fecha: {
        required: true,
        futureDate: true,
        messages: {
            required: 'La fecha del evento es obligatoria',
            futureDate: 'La fecha debe ser posterior a hoy'
        }
    },
    hora: {
        required: true,
        messages: {
            required: 'La hora es obligatoria'
        }
    }
};

// Referencias a elementos del DOM
const form = document.getElementById('registroEvento');
const successMessage = document.getElementById('successMessage');
const fileInput = document.getElementById('archivo');
const fileSelected = document.getElementById('fileSelected');

// Función para inicializar el formulario
function initializeForm() {
    setupRealTimeValidation();
    setupFileUpload();
    setupFormSubmission();
    setMinimumDate();
}

// Configurar validación en tiempo real
function setupRealTimeValidation() {
    // Validación para campos de texto
    Object.keys(validationConfig).forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field) {
            field.addEventListener('blur', () => validateField(fieldName));
            field.addEventListener('input', () => clearError(fieldName));
        }
    });

    // Validación para checkboxes de intereses
    const checkboxes = document.querySelectorAll('input[name="intereses"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', validateIntereses);
    });

    // Validación para radio buttons de horario
    const radioButtons = document.querySelectorAll('input[name="horario"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', validateHorario);
    });
}

// Configurar la subida de archivos
function setupFileUpload() {
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            fileSelected.textContent = `Archivo seleccionado: ${file.name}`;
            fileSelected.style.display = 'block';
            validateArchivo();
        } else {
            fileSelected.style.display = 'none';
        }
    });
}

// Configurar el envío del formulario
function setupFormSubmission() {
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        if (validateForm()) {
            handleSuccessfulSubmission();
        } else {
            scrollToFirstError();
        }
    });
}

// Establecer fecha mínima
function setMinimumDate() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('fecha').min = tomorrow.toISOString().split('T')[0];
}

// Función para validar un campo individual
function validateField(fieldName) {
    const field = document.getElementById(fieldName);
    const config = validationConfig[fieldName];
    const value = field.value.trim();

    // Limpiar errores anteriores
    clearError(fieldName);

    // Validación requerida
    if (config.required && !value) {
        showError(fieldName, config.messages.required);
        return false;
    }

    // Si el campo está vacío y no es requerido, no validar más
    if (!value && !config.required) {
        return true;
    }

    // Validación de longitud mínima
    if (config.minLength && value.length < config.minLength) {
        showError(fieldName, config.messages.minLength);
        return false;
    }

    // Validación de longitud máxima
    if (config.maxLength && value.length > config.maxLength) {
        showError(fieldName, config.messages.maxLength);
        return false;
    }

    // Validación de patrón
    if (config.pattern && !config.pattern.test(value)) {
        showError(fieldName, config.messages.pattern);
        return false;
    }

    // Validación de fecha futura
    if (config.futureDate && fieldName === 'fecha') {
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate <= today) {
            showError(fieldName, config.messages.futureDate);
            return false;
        }
    }

    // Si llegamos aquí, el campo es válido
    showSuccess(fieldName);
    return true;
}

// Validación de intereses
function validateIntereses() {
    const checkboxes = document.querySelectorAll('input[name="intereses"]:checked');
    if (checkboxes.length === 0) {
        showError('intereses', 'Debes seleccionar al menos un interés');
        return false;
    } else {
        clearError('intereses');
        return true;
    }
}

// Validación de horario
function validateHorario() {
    const selected = document.querySelector('input[name="horario"]:checked');
    if (!selected) {
        showError('horario', 'Debes seleccionar un horario preferido');
        return false;
    } else {
        clearError('horario');
        return true;
    }
}

// Validación de archivo
function validateArchivo() {
    const file = fileInput.files[0];
    if (!file) return true; // Es opcional

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
        showError('archivo', 'Solo se permiten archivos PDF, JPG y PNG');
        return false;
    }

    if (file.size > maxSize) {
        showError('archivo', 'El archivo no puede exceder 5MB');
        return false;
    }

    clearError('archivo');
    return true;
}

// Mostrar mensaje de error
function showError(fieldName, message) {
    const errorElement = document.getElementById('error' + fieldName.charAt(0).toUpperCase() + fieldName.slice(1));
    const fieldElement = document.getElementById(fieldName);
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
    
    if (fieldElement) {
        fieldElement.classList.add('input-error');
        fieldElement.classList.remove('input-success');
    }
}

// Mostrar estado de éxito
function showSuccess(fieldName) {
    const fieldElement = document.getElementById(fieldName);
    if (fieldElement) {
        fieldElement.classList.add('input-success');
        fieldElement.classList.remove('input-error');
    }
}

// Limpiar mensaje de error
function clearError(fieldName) {
    const errorElement = document.getElementById('error' + fieldName.charAt(0).toUpperCase() + fieldName.slice(1));
    const fieldElement = document.getElementById(fieldName);
    
    if (errorElement) {
        errorElement.classList.remove('show');
    }
    
    if (fieldElement) {
        fieldElement.classList.remove('input-error');
    }
}

// Validación completa del formulario
function validateForm() {
    let isValid = true;

    // Validar campos individuales
    Object.keys(validationConfig).forEach(fieldName => {
        if (!validateField(fieldName)) {
            isValid = false;
        }
    });

    // Validar intereses
    if (!validateIntereses()) {
        isValid = false;
    }

    // Validar horario
    if (!validateHorario()) {
        isValid = false;
    }

    // Validar archivo
    if (!validateArchivo()) {
        isValid = false;
    }

    return isValid;
}

// Manejar envío exitoso
function handleSuccessfulSubmission() {
    const submitBtn = document.querySelector('.submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Procesando...';

    // Simular procesamiento
    setTimeout(() => {
        successMessage.classList.add('show');
        form.style.display = 'none';
        
        // Resetear formulario después de mostrar éxito
        setTimeout(() => {
            resetForm();
            submitBtn.disabled = false;
            submitBtn.textContent = 'Registrarse al Evento';
        }, 3000);
    }, 1000);
}

// Resetear formulario
function resetForm() {
    form.reset();
    form.style.display = 'block';
    successMessage.classList.remove('show');
    
    // Limpiar todas las clases de validación
    document.querySelectorAll('.input-success, .input-error').forEach(el => {
        el.classList.remove('input-success', 'input-error');
    });
    
    // Ocultar mensajes de error
    document.querySelectorAll('.error-message').forEach(el => {
        el.classList.remove('show');
    });
    
    fileSelected.style.display = 'none';
}

// Hacer scroll al primer error
function scrollToFirstError() {
    const firstError = document.querySelector('.error-message.show');
    if (firstError) {
        firstError.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
    }
}

// Funciones utilitarias adicionales
const FormUtils = {
    // Obtener datos del formulario
    getFormData: function() {
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            if (data[key]) {
                // Si ya existe, convertir a array
                if (Array.isArray(data[key])) {
                    data[key].push(value);
                } else {
                    data[key] = [data[key], value];
                }
            } else {
                data[key] = value;
            }
        }
        
        return data;
    },
    
    // Limpiar todos los errores
    clearAllErrors: function() {
        document.querySelectorAll('.error-message').forEach(el => {
            el.classList.remove('show');
        });
        
        document.querySelectorAll('.input-error').forEach(el => {
            el.classList.remove('input-error');
        });
    },
    
    // Validar email con regex más estricta
    validateEmail: function(email) {
        const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        return regex.test(email);
    },
    
    // Formatear teléfono
    formatPhone: function(phone) {
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length === 10) {
            return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
        }
        return phone;
    }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initializeForm);

// Exportar funciones para uso externo si es necesario
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateField,
        validateForm,
        FormUtils
    };
}
