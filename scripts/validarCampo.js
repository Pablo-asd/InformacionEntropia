import { PALABRAS, obtenerPalabraAleatoria, existePalabra } from './palabras.js';
import { calcularProbabilidades, calcularInformacion, calcularEntropia } from './calculos.js';

document.addEventListener('DOMContentLoaded', function() {
    // Variables para el tema
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = themeToggle.querySelector('i');

    // Variables para el input y tablero
    const input = document.querySelector('.palabra-input');
    const borrarBtn = document.querySelector('#borrar-btn');
    const confirmarBtn = document.querySelector('#confirmar-btn');
    const filas = document.querySelectorAll('.tablero-row');
    let filaActual = 0;

    // Palabra objetivo que el jugador debe adivinar
    let palabraObjetivo = obtenerPalabraAleatoria();
    console.log('Palabra a adivinar:', palabraObjetivo); // Para testing

    // Función para reiniciar el juego
    function reiniciarJuego() {
        // Obtener nueva palabra objetivo
        palabraObjetivo = obtenerPalabraAleatoria();
        console.log('Nueva palabra a adivinar:', palabraObjetivo);
        
        // Reiniciar fila actual
        filaActual = 0;
        
        // Habilitar controles
        input.disabled = false;
        confirmarBtn.disabled = true;
        borrarBtn.disabled = false;
        input.value = '';
        input.classList.remove('is-invalid');
        
        // Limpiar todas las celdas
        filas.forEach(fila => {
            const celdas = fila.querySelectorAll('.tablero-celda');
            celdas.forEach(celda => {
                celda.textContent = '';
                celda.classList.remove('celda-correcta', 'celda-presente', 'celda-incorrecta');
            });
        });

        // Ocultar palabra correcta
        document.querySelector('.palabra-correcta-container').style.display = 'none';
        document.getElementById('palabra-correcta').textContent = '';

        // Limpiar estadísticas
        ['probabilidades-container', 'informacion-container', 'entropia-container'].forEach(id => {
            document.getElementById(id).innerHTML = '';
        });

        // Ocultar mensaje de error si está visible
        document.querySelector('.invalid-feedback').style.display = 'none';

        // Enfocar el input
        input.focus();
    }

    // Función para cambiar el tema
    themeToggle.addEventListener('click', function() {
        const body = document.body;
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        body.setAttribute('data-theme', newTheme);
        
        // Cambiar el ícono
        if (newTheme === 'dark') {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
        
        // Guardar en localStorage
        localStorage.setItem('theme', newTheme);
    });

    // Cargar tema guardado
    window.addEventListener('load', () => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.body.setAttribute('data-theme', savedTheme);
        
        if (savedTheme === 'dark') {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    });

    // Validación del input
    input.addEventListener('input', function() {
        // Convertir a mayúsculas
        this.value = this.value.toUpperCase();
        
        // Solo permitir letras
        this.value = this.value.replace(/[^A-Z]/g, '');
        
        // Validar longitud
        if (this.value.length === 5) {
            this.classList.remove('is-invalid');
            confirmarBtn.disabled = false;
        } else {
            confirmarBtn.disabled = true;
        }
    });

    // Modificar el event listener del input para el Enter
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevenir el comportamiento por defecto
            if (this.value.length === 5) {
                confirmarBtn.click();
            }
        } else if (e.key === 'Escape') { // Opcional: agregar tecla Escape para borrar
            borrarBtn.click();
        }
    });

    // Función para borrar input
    borrarBtn.addEventListener('click', function() {
        input.value = '';
        input.classList.remove('is-invalid');
        confirmarBtn.disabled = true;
        document.querySelector('.invalid-feedback').style.display = 'none';
        input.focus(); // Mantener el foco en el input
    });

    // Modificar la función de obtener palabras coincidentes
    function obtenerPalabrasCoincidentes(letrasCorrectas, letrasPresentes, palabraIntentada, letrasIncorrectas) {
        // Si hay letras en posición correcta (verdes)
        if (Object.keys(letrasCorrectas).length > 0) {
            return PALABRAS.filter(palabra => {
                // Excluir la palabra intentada
                if (palabra === palabraIntentada) return false;
                
                // Verificar letras correctas (verdes)
                for (const [pos, letra] of Object.entries(letrasCorrectas)) {
                    if (palabra[pos] !== letra) return false;
                }

                // Excluir palabras que contengan letras incorrectas (grises)
                for (const letra in letrasIncorrectas) {
                    if (palabra.includes(letra)) return false;
                }

                return true;
            });
        }
        
        // Si solo hay letras presentes (amarillas) pero no correctas
        if (Object.keys(letrasPresentes).length > 0) {
            return PALABRAS.filter(palabra => {
                // Excluir la palabra intentada
                if (palabra === palabraIntentada) return false;
                
                // Verificar que la palabra contenga todas las letras presentes (amarillas)
                for (const [letra, cantidad] of Object.entries(letrasPresentes)) {
                    const cantidadEnPalabra = (palabra.match(new RegExp(letra, 'g')) || []).length;
                    if (cantidadEnPalabra < cantidad) return false;
                }

                // Excluir palabras que contengan letras incorrectas (grises)
                for (const letra in letrasIncorrectas) {
                    if (palabra.includes(letra)) return false;
                }

                return true;
            });
        }
        
        // Si no hay letras correctas ni presentes, mostrar todas las palabras excepto las que tienen letras incorrectas
        return PALABRAS.filter(palabra => {
            if (palabra === palabraIntentada) return false;
            
            // Excluir palabras que contengan letras incorrectas (grises)
            for (const letra in letrasIncorrectas) {
                if (palabra.includes(letra)) return false;
            }
            
            return true;
        });
    }

    // Función para contar ocurrencias de letras en una palabra
    function contarLetras(palabra) {
        return palabra.split('').reduce((acc, letra) => {
            acc[letra] = (acc[letra] || 0) + 1;
            return acc;
        }, {});
    }

    // Función para mostrar palabras en ternas con información adicional
    function mostrarPalabrasCoincidentes(palabras) {
        const container = document.getElementById('lista-palabras-coincidentes');
        container.innerHTML = '';

        if (palabras.length === 0) {
            container.innerHTML = '<div class="no-coincidencias">No hay palabras coincidentes</div>';
            return;
        }

        // Crear grupos de tres palabras
        for (let i = 0; i < palabras.length; i += 3) {
            const terna = document.createElement('div');
            terna.className = 'palabra-terna';
            
            const palabrasTerna = palabras.slice(i, i + 3);
            terna.textContent = palabrasTerna.join(' - ');
            
            container.appendChild(terna);
        }
    }

    function actualizarEstadisticas(palabrasCoincidentes) {
        // Calcular probabilidades
        const probabilidades = calcularProbabilidades(palabrasCoincidentes);
        const informacion = calcularInformacion(probabilidades);
        const entropia = calcularEntropia(probabilidades);

        // Mostrar probabilidades
        const probContainer = document.getElementById('probabilidades-container');
        probContainer.innerHTML = probabilidades.map((posicion, index) => {
            const topLetras = Object.entries(posicion)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 3);
            
            return topLetras.map(([letra, prob]) => `
                <div class="resultado-item">
                    <div class="resultado-label">Pos ${index + 1} - ${letra}</div>
                    <div class="resultado-valor">${(prob * 100).toFixed(1)}%</div>
                </div>
            `).join('');
        }).join('');

        // Mostrar información
        const infoContainer = document.getElementById('informacion-container');
        infoContainer.innerHTML = informacion.map((posicion, index) => {
            const topLetras = Object.entries(posicion)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 3);
            
            return topLetras.map(([letra, info]) => `
                <div class="resultado-item">
                    <div class="resultado-label">Pos ${index + 1} - ${letra}</div>
                    <div class="resultado-valor">${info.toFixed(2)} bits</div>
                </div>
            `).join('');
        }).join('');

        // Mostrar entropía
        const entContainer = document.getElementById('entropia-container');
        entContainer.innerHTML = entropia.map((ent, index) => `
            <div class="resultado-item">
                <div class="resultado-label">Posición ${index + 1}</div>
                <div class="resultado-valor">${ent.toFixed(2)} bits</div>
            </div>
        `).join('');

        // Agregar entropía total
        const entropiaTotal = entropia.reduce((sum, val) => sum + val, 0);
        entContainer.innerHTML += `
            <div class="resultado-item total">
                <div class="resultado-label">Entropía Total</div>
                <div class="resultado-valor">${entropiaTotal.toFixed(2)} bits</div>
            </div>
        `;
    }

    // Modificar el event listener del botón confirmar
    confirmarBtn.addEventListener('click', function() {
        const palabra = input.value.toUpperCase();
        
        // Validaciones iniciales
        if (palabra.length !== 5) {
            input.classList.add('is-invalid');
            document.querySelector('.invalid-feedback').textContent = 'La palabra debe tener 5 letras';
            document.querySelector('.invalid-feedback').style.display = 'block';
            return;
        }

        if (!existePalabra(palabra)) {
            input.classList.add('is-invalid');
            document.querySelector('.invalid-feedback').textContent = 'La palabra no está en el diccionario';
            document.querySelector('.invalid-feedback').style.display = 'block';
            return;
        }

        // Obtener la fila actual y sus celdas
        const filaActualElement = filas[filaActual];
        const celdas = filaActualElement.querySelectorAll('.tablero-celda');

        const letrasCorrectas = {};
        const letrasPresentes = {};
        const letrasIncorrectas = {};
        let letrasUsadas = new Set();

        // Primera pasada: marcar letras correctas
        for (let i = 0; i < palabra.length; i++) {
            celdas[i].textContent = palabra[i];
            
            if (palabra[i] === palabraObjetivo[i]) {
                celdas[i].classList.add('celda-correcta');
                letrasCorrectas[i] = palabra[i];
                letrasUsadas.add(i);
            }
        }

        // Segunda pasada: marcar letras presentes e incorrectas
        let palabraObjetivoTemp = palabraObjetivo;
        for (let i = 0; i < palabra.length; i++) {
            if (!letrasUsadas.has(i)) {
                if (palabraObjetivoTemp.includes(palabra[i])) {
                    celdas[i].classList.add('celda-presente');
                    letrasPresentes[palabra[i]] = (letrasPresentes[palabra[i]] || 0) + 1;
                    palabraObjetivoTemp = palabraObjetivoTemp.replace(palabra[i], '');
                } else {
                    celdas[i].classList.add('celda-incorrecta');
                    letrasIncorrectas[palabra[i]] = true;
                }
            }
        }

        // Obtener palabras coincidentes
        const palabrasCoincidentes = obtenerPalabrasCoincidentes(letrasCorrectas, letrasPresentes, palabra, letrasIncorrectas);

        // Actualizar el contenedor de palabras coincidentes
        const container = document.getElementById('lista-palabras-coincidentes');
        if (palabrasCoincidentes.length > 0) {
            container.innerHTML = `
                <div class="coincidencias-section">
                    <h5>${Object.keys(letrasCorrectas).length > 0 ? 
                        'Palabras con letras en posición correcta' : 
                        'Palabras con letras coincidentes'} (${palabrasCoincidentes.length})</h5>
                    ${mostrarTernas(palabrasCoincidentes)}
                </div>
            `;
        } else {
            container.innerHTML = `
                <div class="coincidencias-section">
                    <h5>No hay palabras coincidentes</h5>
                </div>
            `;
        }

        // Limpiar input y preparar siguiente intento
        input.value = '';
        input.classList.remove('is-invalid');
        confirmarBtn.disabled = true;
        document.querySelector('.invalid-feedback').style.display = 'none';
        
        // Avanzar a la siguiente fila
        filaActual++;

        // Verificar si ganó
        if (palabra === palabraObjetivo) {
            setTimeout(() => {
                // Limpiar panel de palabras coincidentes
                const container = document.getElementById('lista-palabras-coincidentes');
                container.innerHTML = `
                    <div class="coincidencias-section">
                        <h5>¡Felicitaciones!</h5>
                        <div class="palabra-ganadora">
                            La palabra era: ${palabraObjetivo}
                        </div>
                    </div>
                `;
                
                document.querySelector('.palabra-correcta-container').style.display = 'block';
                document.getElementById('palabra-correcta').textContent = palabraObjetivo;
                alert('¡Felicitaciones! ¡Has ganado!');
                preguntarNuevaPartida();
            }, 500);
            return;
        }

        // Verificar si perdió (sin más intentos)
        if (filaActual >= filas.length) {
            setTimeout(() => {
                // Limpiar panel de palabras coincidentes
                const container = document.getElementById('lista-palabras-coincidentes');
                container.innerHTML = `
                    <div class="coincidencias-section">
                        <h5>¡Juego terminado!</h5>
                        <div class="palabra-correcta-final">
                            La palabra correcta era: ${palabraObjetivo}
                        </div>
                    </div>
                `;
                
                document.querySelector('.palabra-correcta-container').style.display = 'block';
                document.getElementById('palabra-correcta').textContent = palabraObjetivo;
                alert('¡Juego terminado! La palabra era: ' + palabraObjetivo);
                preguntarNuevaPartida();
            }, 500);
        }

        // Enfocar el input para el siguiente intento
        input.focus();

        // Actualizar estadísticas
        actualizarEstadisticas(palabrasCoincidentes);
    });

    // Función auxiliar para mostrar palabras en ternas
    function mostrarTernas(palabras) {
        if (palabras.length === 0) {
            return '<div class="no-coincidencias">No hay palabras coincidentes</div>';
        }

        let html = '<div class="ternas-container">';
        for (let i = 0; i < palabras.length; i += 3) {
            const terna = palabras.slice(i, i + 3);
            html += `<div class="palabra-terna">${terna.join(' - ')}</div>`;
        }
        html += '</div>';
        return html;
    }

    // Nueva función para preguntar si quiere jugar de nuevo
    function preguntarNuevaPartida() {
        setTimeout(() => {
            const jugarDeNuevo = confirm('¿Quieres jugar otra vez?');
            if (jugarDeNuevo) {
                reiniciarJuego();
            } else {
                // Deshabilitar controles
                input.disabled = true;
                confirmarBtn.disabled = true;
                borrarBtn.disabled = true;
            }
        }, 100); // Pequeño delay para mejor UX
    }
});
