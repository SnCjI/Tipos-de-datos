document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const pantallaContraseña = document.getElementById('pantallaContraseña');
    const deslizadorLongitud = document.getElementById('deslizadorLongitud');
    const valorLongitud = document.getElementById('valorLongitud');
    const casillaMayusculas = document.getElementById('casillaMayusculas');
    const casillaMinusculas = document.getElementById('casillaMinusculas');
    const casillaNumeros = document.getElementById('casillaNumeros');
    const casillaSímbolos = document.getElementById('casillaSímbolos');
    const textoSeguridad = document.getElementById('textoSeguridad');
    const barrasSeguridad = document.getElementById('barrasSeguridad');
    const botonGenerar = document.getElementById('botonGenerar');
    const botonCopiar = document.getElementById('botonCopiar');
    const alertaCopiado = document.getElementById('alertaCopiado');

    // Conjuntos de caracteres
    const caracteresMayusculas = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const caracteresMinusculas = 'abcdefghijklmnopqrstuvwxyz';
    const caracteresNumeros = '0123456789';
    const caracteresSímbolos = '!@#$%^&*()_+-=[]{}|;:\'",.<>/?\\';

    // Actualizar el valor de longitud cuando cambia el deslizador
    deslizadorLongitud.addEventListener('input', function() {
        valorLongitud.textContent = deslizadorLongitud.value;
        actualizarIndicadorSeguridad();
    });

    // Actualizar la seguridad cuando cambia cualquier opción
    [casillaMayusculas, casillaMinusculas, casillaNumeros, casillaSímbolos].forEach(casilla => {
        casilla.addEventListener('change', actualizarIndicadorSeguridad);
    });

    // Generar contraseña cuando se hace clic en el botón
    botonGenerar.addEventListener('click', generarContraseña);

    // Copiar contraseña al portapapeles
    botonCopiar.addEventListener('click', function() {
        if (pantallaContraseña.textContent) {
            navigator.clipboard.writeText(pantallaContraseña.textContent)
                .then(() => {
                    mostrarAlertaCopiado();
                })
                .catch(err => {
                    console.error('No se pudo copiar el texto: ', err);
                });
        }
    });

    // Generar contraseña inicial
    generarContraseña();

    // Funciones
    function generarContraseña() {
        const longitud = deslizadorLongitud.value;
        const incluirMayusculas = casillaMayusculas.checked;
        const incluirMinusculas = casillaMinusculas.checked;
        const incluirNumeros = casillaNumeros.checked;
        const incluirSímbolos = casillaSímbolos.checked;

        // Asegurar que al menos una opción esté seleccionada
        if (!incluirMayusculas && !incluirMinusculas && !incluirNumeros && !incluirSímbolos) {
            casillaMinusculas.checked = true;
            actualizarIndicadorSeguridad();
            return;
        }

        let conjuntoCaracteres = '';
        if (incluirMayusculas) conjuntoCaracteres += caracteresMayusculas;
        if (incluirMinusculas) conjuntoCaracteres += caracteresMinusculas;
        if (incluirNumeros) conjuntoCaracteres += caracteresNumeros;
        if (incluirSímbolos) conjuntoCaracteres += caracteresSímbolos;

        let contraseña = '';
        let tieneCaracteresRequeridos = false;

        // Seguir generando hasta que tengamos al menos uno de cada tipo de carácter seleccionado
        while (!tieneCaracteresRequeridos) {
            contraseña = '';
            for (let i = 0; i < longitud; i++) {
                const indiceAleatorio = Math.floor(Math.random() * conjuntoCaracteres.length);
                contraseña += conjuntoCaracteres[indiceAleatorio];
            }

            // Verificar si la contraseña tiene al menos uno de cada tipo de carácter seleccionado
            tieneCaracteresRequeridos = true;
            if (incluirMayusculas && !contieneAlguno(contraseña, caracteresMayusculas)) tieneCaracteresRequeridos = false;
            if (incluirMinusculas && !contieneAlguno(contraseña, caracteresMinusculas)) tieneCaracteresRequeridos = false;
            if (incluirNumeros && !contieneAlguno(contraseña, caracteresNumeros)) tieneCaracteresRequeridos = false;
            if (incluirSímbolos && !contieneAlguno(contraseña, caracteresSímbolos)) tieneCaracteresRequeridos = false;
        }

        pantallaContraseña.textContent = contraseña;
        actualizarIndicadorSeguridad();
    }

    function contieneAlguno(str, conjuntoCaracteres) {
        return [...conjuntoCaracteres].some(caracter => str.includes(caracter));
    }

    function actualizarIndicadorSeguridad() {
        const longitud = parseInt(deslizadorLongitud.value);
        const opciones = [
            casillaMayusculas.checked,
            casillaMinusculas.checked,
            casillaNumeros.checked,
            casillaSímbolos.checked
        ].filter(Boolean).length;

        // Calcular la seguridad basada en la longitud y el número de tipos de caracteres
        let seguridad = 0;
        
        // Factor de longitud de contraseña
        if (longitud < 8) {
            seguridad = 1;
        } else if (longitud < 12) {
            seguridad = 2;
        } else if (longitud < 16) {
            seguridad = 3;
        } else {
            seguridad = 4;
        }
        
        // Factor de variedad de caracteres
        seguridad = Math.min(seguridad, opciones);

        // Actualizar la interfaz de usuario basada en la seguridad
        barrasSeguridad.className = 'barras-seguridad';
        
        switch (seguridad) {
            case 1:
                textoSeguridad.textContent = 'DÉBIL';
                barrasSeguridad.classList.add('debil');
                break;
            case 2:
                textoSeguridad.textContent = 'MEDIA';
                barrasSeguridad.classList.add('media');
                break;
            case 3:
                textoSeguridad.textContent = 'FUERTE';
                barrasSeguridad.classList.add('fuerte');
                break;
            case 4:
                textoSeguridad.textContent = 'MUY FUERTE';
                barrasSeguridad.classList.add('muy-fuerte');
                break;
            default:
                textoSeguridad.textContent = 'DÉBIL';
                barrasSeguridad.classList.add('debil');
        }
    }

    function mostrarAlertaCopiado() {
        alertaCopiado.classList.add('mostrar');
        setTimeout(() => {
            alertaCopiado.classList.remove('mostrar');
        }, 2000);
    }
});
