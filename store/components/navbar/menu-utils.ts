// Conectores que van en minúscula dentro del nombre: "De Pie y de Banco", no "De Pie Y De Banco".
const MINUSCULAS = new Set(['y', 'de', 'del', 'para', 'con'])

/** Los nombres vienen cargados a mano con mayúsculas desparejas ("iNYECCIÓN"). */
export const formatearNombre = (nombre: string) =>
  nombre
    .toLocaleLowerCase('es')
    .split(' ')
    .map((palabra, i) => (i > 0 && MINUSCULAS.has(palabra) ? palabra : palabra.charAt(0).toLocaleUpperCase('es') + palabra.slice(1)))
    .join(' ')

export const cantidadProductos = (n: number) => `${n} ${n === 1 ? 'producto' : 'productos'}`
