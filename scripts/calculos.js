// Funciones para cálculos estadísticos
export function calcularProbabilidades(palabrasPosibles) {
    const totalPalabras = palabrasPosibles.length;
    const probabilidadesPorPosicion = Array(5).fill().map(() => ({}));
    
    // Calcular frecuencias por posición
    palabrasPosibles.forEach(palabra => {
        palabra.split('').forEach((letra, posicion) => {
            if (!probabilidadesPorPosicion[posicion][letra]) {
                probabilidadesPorPosicion[posicion][letra] = 0;
            }
            probabilidadesPorPosicion[posicion][letra]++;
        });
    });

    // Convertir frecuencias a probabilidades
    probabilidadesPorPosicion.forEach(posicion => {
        Object.keys(posicion).forEach(letra => {
            posicion[letra] = posicion[letra] / totalPalabras;
        });
    });

    return probabilidadesPorPosicion;
}

export function calcularInformacion(probabilidadesPorPosicion) {
    const informacionPorPosicion = Array(5).fill().map(() => ({}));
    
    probabilidadesPorPosicion.forEach((posicion, index) => {
        Object.entries(posicion).forEach(([letra, prob]) => {
            // I(x) = -log₂(P(x))
            informacionPorPosicion[index][letra] = -Math.log2(prob);
        });
    });

    return informacionPorPosicion;
}

export function calcularEntropia(probabilidadesPorPosicion) {
    const entropiaPorPosicion = Array(5).fill(0);
    
    probabilidadesPorPosicion.forEach((posicion, index) => {
        Object.entries(posicion).forEach(([letra, prob]) => {
            // H = -∑ P(x) * log₂(P(x))
            entropiaPorPosicion[index] += -prob * Math.log2(prob);
        });
    });

    return entropiaPorPosicion;
} 