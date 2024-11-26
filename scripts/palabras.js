const PALABRAS = [
    "PERRO", "GATOS", "TANGO", "DULCE", "PLATA", "VERDE", "NEGRO", "BANCO",
    "LIBRO", "PAPEL", "RADIO", "CARNE", "PASTA", "BARCO", "FUEGO", "VIENTO",
    "CIELO", "PLAYA", "PLAZA", "BOLSO", "TERMO", "YERBA", "DISCO", "BAILE",
    "NOCHE", "TARDE", "LUNES", "CHICO", "LINDO", "FIERO", "GORDO", "FLACO",
    "SUAVE", "CALOR", "HUMOS", "ARENA", "BARRO", "PASTO", "ARBOL", "FLORA",
    "ROSAS", "ROJOS", "CALLE", "PUCHO", "TECHO", "PARED", "PISOS", "SILLA",
    "MESAS", "CAMAS", "ROPAS", "BOTAS", "GORRA", "MALLA", "BONDI", "PALTA",
    "BIRRA", "MANGO", "PIOLA", "MORFI", "MATES", "PIZZA", "BOCHO", "CHETO",
    "ABAJO", "ABRIR", "ACTOR", "AGUAS", "AHORA", "AIRES", "AMIGO", "AMOR",
    "ANDAR", "ANGEL", "ANTES", "ARMAR", "ARROZ", "ATRAS", "AVION", "AZUL",
    "BAJAR", "BEBER", "BESAR", "BLUSA", "BRAVO", "BRAZO", "BRUJA", "BURRO",
    "CABAL", "CABRA", "CAJON", "CAMPO", "CANAL", "CANTO", "CAOBA", "CARAS",
    "CARGA", "CARPA", "CARRO", "CARTA", "CASAR", "CASCO", "CAUCE", "CAUSA",
    "CAZAR", "CERCA", "CERDO", "CESTA", "CHAPA", "CHILE", "CHINA", "CINCO",
    "CINTA", "CIRCO", "CLARA", "CLASE", "CLAVE", "CLIMA", "COBRA", "COCHE",
    "COMER", "CONDE", "CORAL", "CORTE", "COSTA", "CREMA", "CRUDO", "CUEVA",
    "CULPA", "DAMAS", "DANZA", "DATOS", "DEDOS", "DICHA", "DOSIS", "DROGA",
    "DUCHA", "DUEÑO", "DURAR", "EDEMA", "ELLOS", "ERROR", "ETAPA", "FALTA",
    "FANGO", "FAUNA", "FECHA", "FELIZ", "FIBRA", "FICHA", "FINCA", "FIRMA",
    "FONDO", "FORMA", "FORRO", "FRASE", "FRENO", "FRUTA", "GAFAS", "GANAS",
    "GARRA", "GASTO", "GENTE", "GLOBO", "GOLPE", "GOMAS", "GOTAS", "GRAMO",
    "GRANO", "GRASA", "GRIPE", "GRUPO", "GUSTO", "HABER", "HABLA", "HACER",
    "HACHA", "HECHO", "HIELO", "HOGAR", "HONGO", "HOTEL", "HUEVO", "IGUAL",
    "INDIA", "JABON", "JAMON", "JAULA", "JOVEN", "JUEGO", "JUGAR", "JUNIO",
    "JUNTO", "JUSTO", "LABIO", "LABOR", "LECHE", "LENTO", "LEÑAR", "LETRA",
    "LIMON", "LLAVE", "LLENO", "LOBOS", "LOGRO", "LUCHA", "LUNAR", "MADRE",
    "MAGIA", "MANTA", "MARCA", "MARCO", "MAREA", "MEDIR", "MENOR", "METAL",
    "METRO", "MIEDO", "MIELO", "MINAR", "MITAD", "MODAL", "MOLER", "MONTE",
    "MOTOR", "MOUSE", "MUJER", "MUNDO", "NADAR", "NARIZ", "NIEVE", "NOBLE",
    "NOVIA", "NUEVE", "NUEVO", "OBRAR", "OESTE", "OLIVA", "ORDEN", "OREJA",
    "PADRE", "PAGAR", "PALMA", "PANEL", "PARAR", "PASAR", "PATIO", "PELAR",
    "PESAR", "PESCA", "PIANO", "PIEZA", "PINOS", "PINZA", "PLANO", "PLUMA",
    "PODER", "POLLO", "POLVO", "PRESO", "PRIMO", "PULPO", "QUESO", "RADIO",
    "RAMPA", "RANGO", "RASGO", "RATON", "RAYOS", "RECTA", "REINA", "RELOJ",
    "RENTA", "RESTO", "RIEGO", "RISAR", "RITMO", "RIVAL", "ROBLE", "ROCAS",
    "RONDA", "RUBIO", "RUEDA", "RUIDO", "SABIO", "SABOR", "SALIR", "SALSA",
    "SALTO", "SAMBA", "SANTO", "SECAR", "SELLO", "SELVA", "SERIE", "SIETE",
    "SIGLO", "SIGNO", "SOCIO", "SOLAR", "SONAR", "SUELA", "SUEÑO", "TABLA",
    "TACTO", "TALLA", "TALLO", "TAPAR", "TAREA", "TELAR", "TEMAS", "TEMOR",
    "TENIS", "TENSO", "TIRAR", "TOCAR", "TOMAR", "TONTO", "TORTA", "TRAJE",
    "TRATO", "TRIBU", "TRIGO", "TROPA", "TURNO", "VACIO", "VALLE", "VASCO",
    "VELAR", "VIEJO", "VILLA", "VINOS", "YERNO", "YOGUR", "ZORRO"
];

// Función para obtener una palabra aleatoria
function obtenerPalabraAleatoria() {
    const indice = Math.floor(Math.random() * PALABRAS.length);
    return PALABRAS[indice];
}

// Función para verificar si una palabra existe en el diccionario
function existePalabra(palabra) {
    return PALABRAS.includes(palabra.toUpperCase());
}

// Exportar las funciones y el array
export { PALABRAS, obtenerPalabraAleatoria, existePalabra }; 