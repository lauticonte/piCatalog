/**
 * Saca del cajón "OTRO" los productos cuya categoría es obvia por el nombre.
 *
 * Paso 1 (solo lectura): genera un CSV con la propuesta para revisar.
 *   npx tsx scripts/normalize-categories.ts
 *   -> scripts/out/otro-propuesta.csv
 *
 * Paso 2 (escribe): aplica las filas del CSV. Se puede editar antes: borrar filas
 * que no convencen o cambiar la columna "sugerida" a mano. Las filas con la
 * sugerida vacía se ignoran. Antes de escribir guarda un backup para deshacer.
 *   npx tsx scripts/normalize-categories.ts --apply scripts/out/otro-propuesta.csv
 *
 * Deshacer:
 *   npx tsx scripts/normalize-categories.ts --restore scripts/out/otro-backup-<fecha>.json
 *
 * Ojo: admin/.env apunta a la base de desarrollo; producción está en .env.prod-backup.
 */
import { main, Rule } from './lib/recategorize'

// Nombres tal cual están en la base. Si alguno no existe, el script aborta.
const C = {
  manuales: 'HERRAMIENTAS MANUALES',
  electricas: 'ELÉCTRICAS DE MANO',
  neumaticas: 'NEUMÁTICAS',
  pintura: 'EQUIPOS DE PINTURA',
  hidraulicos: 'HIDRÁULICOS',
  taller: 'TALLER & RACING',
  inyeccion: 'iNYECCIÓN',
  soldadoras: 'SOLDADORAS',
  jardin: 'JARDÍN & AGRÍCOLA',
  hogar: 'HOGAR & RECREACIÓN',
  calefaccion: 'CALEFACCIÓN',
}

// Se evalúan en orden sobre el nombre en mayúsculas y sin tildes: gana la primera.
// Por eso los casos puntuales van antes que los genéricos (una "pistola para pintar
// neumática" es de pintura, no de neumáticas; un "juego de caballetes" es hidráulico).
// Lo que no matchea ninguna regla queda para revisión manual.
const RULES: Rule[] = [
  // Pintura
  [/^PISTOLA (DE|PARA) PINTAR/, C.pintura],

  // Inyección
  [/INYECTOR/, C.inyeccion],
  [/^PROBADOR DE (MOTORES PASO|BOBINAS|CUERPO MARIPOSA)/, C.inyeccion],

  // Neumáticas: todo lo que lo diga en el nombre (clavadoras, engrasadoras, sus clavos y
  // grampas), salvo los tubos de impacto, que son accesorios de mano.
  [/^(?!TUBO|PRENSA).*NEUMATIC[AO]/, C.neumaticas],

  // Hidráulicos
  [/^PRENSA HIDRAULICA|^PRENSA DE BANCO PESADA/, C.hidraulicos],
  [/^CRIQUE\b|^ELEVADOR|^GUINCHE|CABALLETES|^EXPANSOR PARA CHAPISTA/, C.hidraulicos],

  // Jardín (antes que taller: "carro barre hojas" no es un carro de taller)
  [/^CARRO (BARRE HOJAS|PARA MINITRACTOR)|^CORTA CERCO/, C.jardin],

  // Mobiliario y equipamiento de taller
  [/^BANCO (DE TRABAJO|DE MOTOR|SOPORTE MOTOR)/, C.taller],
  [/^(TABLERO|MESA RODANTE|GABINETE|CARRO|CAMILLA)\b|^SILLA BANQUITO/, C.taller],
  [/^BANDEJA RECOLECTORA/, C.taller],

  // Soldadura
  [/^(MIG\/TIG|TIG|TMIG)\b|ELECTRODOS|\bMMA\b|PARA SOLDAR|^ESTACION DE SOLDADO/, C.soldadoras],

  // Jardín
  [/^(DESMALEZADORA|PODADORA|SOPLADOR|HOYADORA|ESPARCIDOR|ESQUILADORA)\b/, C.jardin],

  // Hogar y calefacción
  [/^(SILLA|SOMBRILLA|MATE|TERMO|CAJA FUERTE|ESCALERA|MAQUINA DE COSER)\b/, C.hogar],
  [/^ESTUFA\b/, C.calefaccion],

  // Eléctricas de mano (antes que neumáticas: "pistola de impacto a batería")
  [/^PISTOLA DE CALOR|^PISTOLA DE IMPACTO A BATERIA|^CEPILLO \d+ MM - \d+ W|^AFILADOR ELECTRICO|^LUSTRA PULIDORA/, C.electricas],
  // Potencia en watts o "eléctrica 220v": es una máquina, no una herramienta de mano.
  [/\b\d{3,4} ?W\b|ELECTRICA.*220 ?V/, C.electricas],
  [
    /^(AMOLADORA|LIJADORA|LUSTRALIJADORA|ATORNILLADOR|ROTOMARTILLO|PULIDORA|MULTICORTADORA|ENGALLETADORA|FRESADORA|TERMOFUSORA)\b/,
    C.electricas,
  ],

  // Herramientas manuales: el grueso del catálogo de Bremen, Hamilton y Eurotech.
  [
    /^(TUBOS?|LLAVES?|JUEGOS?|PUNTAS?|PINZA|EXTRACTOR|EXRACTOR|ETXRACTOR|KIT|SET|CRIQUET|TORQUIMETRO|FORMON|PROLONGADOR|SACA|SACAFILTRO|ESCUADRA|NIVEL|MANIJA|MANGO|BARRETA|PUESTA A PUNTO|ADAPTADOR(ES)?|SONDAS|COMPRESOMETRO|PALANCA|ALICATE|REGLA|VACUOMETRO|GONIOMETRO|ESPEJO|CALIBRE|SEPARADOR|IMAN|LIMA|SERRUCHO|SARGENTO|MAZA|CINCEL|DESTORNILLADOR|TIJERAS|COLOCADOR|INSTALADOR|MULTIPLICADOR|IMPULSADOR|MAGNETIZADOR|REMACHADORA?|ENGRAPADORA|GRAMPADORA|PROBADOR DE FUGAS|MOVIMIENTO UNIVERSAL|VALIJA|MALETIN COMPLETO DE HERRAMIENTAS|REMACHES|REPUESTO (DE )?PALANCA|SURTIDO|LAPIZ PESCATUERCA|COMBO IMAN|PUNTO DE MARCAR|CUBO PARA PASTILLA|CEPILLO DE ACERO|ALARGUES|BASE MAGNETICA|RELOJ COMPARADOR|COMBIMETRO|ESTETOSCOPIO|MANOMETRO|MEDIDOR DE PRESION|TERMOMETRO|MULTIMETRO|VOLTIMETRO|DENSIMETRO|PICO PARA INFLAR)\b/,
    C.manuales,
  ],
  [/^CAJA DE (TUBOS|HERRAMIENTAS)|^(BANDEJA|PLATO).*IMANTADA|^BANDEJA PARA PIEZAS MAGNETICAS/, C.manuales],
  [/^PRENSA (RESORTE|ESPIRALES|AROS|VALVULAS|CALIPER)/, C.manuales],
]

// Excepciones que matchearían una regla genérica pero no corresponden.
const SKIP = [/^KIT DE RODILLOS/]

main({
  storeId: process.env.STORE_ID || '65ec0a796702c9c0e4c0895f',
  source: 'OTRO',
  rules: RULES,
  skip: SKIP,
  outName: 'otro',
})
