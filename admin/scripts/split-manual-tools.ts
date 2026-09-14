/**
 * Divide "HERRAMIENTAS MANUALES" (≈670 productos, un tercio tubos) en categorías que
 * sigan cómo busca un mecánico. Lo que no matchea se queda en manuales.
 *
 *   npx tsx scripts/split-manual-tools.ts                                   (propuesta)
 *   npx tsx scripts/split-manual-tools.ts --apply scripts/out/manuales-propuesta.csv
 *   npx tsx scripts/split-manual-tools.ts --restore scripts/out/manuales-backup-<fecha>.json
 *
 * Las categorías nuevas se crean al aplicar. Ojo: admin/.env apunta a la base de
 * desarrollo; producción está en .env.prod-backup.
 */
import { main, Rule } from './lib/recategorize'

const C = {
  tubos: 'TUBOS & ACCESORIOS',
  llaves: 'LLAVES',
  puntas: 'PUNTAS & DESTORNILLADORES',
  especiales: 'EXTRACTORES & ESPECIALES',
}

// Sobre el nombre en mayúsculas y sin tildes; gana la primera. Las herramientas
// específicas de motor van primero: "llave 3 patas para tapa de tanque" o "kit tubos
// tapones de carter" son especiales aunque empiecen con "llave" o "tubos".
const RULES: Rule[] = [
  // Gatos hidráulicos que la pasada de "OTRO" dejó en manuales: "criquet" también es el
  // nombre de la llave de crique, y la regla no los distinguía.
  [/^CRIQUET (HIDRAULICO|CARRITO)/, 'HIDRÁULICOS'],

  // Herramientas específicas de motor, frenos y diagnóstico.
  [
    /^(E[XT]{1,2}R?ACTOR|KIT (DE )?EXTRACTOR|JUEGO DE (\d+ )?EXTRACTORES|SACA ?FILTROS?|KIT SACA|JUEGO DE SACAFILTROS|SACA BOLLOS|PRENSA|PUESTA A PUNTO|SEPARADOR|COLOCADOR|CUBO PARA PASTILLA|ESTETOSCOPIO|PROBADOR|COMPRESOMETRO|VACUOMETRO|MANOMETRO|MEDIDOR DE PRESION|(JUEGO DE )?SONDAS|PUNTA LOGICA|BARRETA SEPARADOR)/,
    C.especiales,
  ],
  [/^KIT (TAPONES|TUBOS TAPONES|TENSOR|PINZA Y EXTRACTORES)|^PINZA (PARA ACOPLES|COLOCADORA)/, C.especiales],
  [/^LLAVE (3 PATAS|CON GANCHO|PARA TAPON|VISCOSA|LARGA PLANA POLY)|^TUBO 33 DIENTES/, C.especiales],
  [/^(JUEGO DE (INSERTOS?|MACHOS)|KIT DE TERRAJAS)/, C.especiales],

  // Puntas antes que tubos: "juego de 4 puntas torx con tubo" es un juego de puntas.
  [/^(PUNTAS? SUELTA|PUNTAS |PUNTA MULTIESTRIA|JUEGO DE (\d+ )?PUNTAS|KIT DE PUNTAS|(JUEGO DE )?DESTORNILLADOR)/, C.puntas],

  // Tubos y todo lo que se usa para girarlos o extenderlos.
  [
    /^(TUBOS?|JUEGOS? (DE )?TUBOS|JUEGO SET TUBOS|KIT TUBOS|CAJA DE TUBOS|VALIJA JUEGO DE TUBOS|JUEGO DE BOCALLAVES|ADAPTADOR(ES)?|(JUEGO DE )?PROLONGADOR(ES)?|ALARGUES|MOVIMIENTO UNIVERSAL|MANGO|MANIJA|PALANCA|REPUESTO (DE )?PALANCA|LLAVE CRIQUE)\b/,
    C.tubos,
  ],

  // Llaves y medición de torque.
  [/^(LLAVES?|JUEGO (DE )?LLAVES?|SET DE (\d+ )?LLAVES?|TORQUIMETRO|GONIOMETRO|MULTIPLICADOR DE FUERZA)\b/, C.llaves],
]

main({
  storeId: process.env.STORE_ID || '65ec0a796702c9c0e4c0895f',
  source: 'HERRAMIENTAS MANUALES',
  rules: RULES,
  createMissing: true,
  outName: 'manuales',
})
