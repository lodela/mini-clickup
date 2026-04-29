import { randomElement } from "./formatters";

/**
 * Funny Password Generator — palabras en español con reemplazos de vocales.
 *
 * Reglas acordadas:
 * - Dos palabras en español separadas por "_"
 * - Palabra 1: primera letra MAYÚSCULA + primera vocal reemplazada
 * - Palabra 2: primera letra MAYÚSCULA + última vocal reemplazada
 * - Mapa de vocales: a=@, e=3, i=1, o=0, u=#
 * - Ejemplo: "Cg@bra_Halc0n" — mínimo 10 chars con mayúscula, número y especial
 */
export function generateFunnyPassword(): string {
  const palabrasEspañol = [
    "aguila", "alcon", "ambar", "angel", "arbol", "artico",
    "barco", "burro", "buscon",
    "caballo", "cabra", "camino", "campo", "cangrejo", "castor", "ciervo",
    "cisne", "cobra", "cohete", "condor", "coral", "cosmos", "cristal",
    "cuerno",
    "delfin", "dragon",
    "espejo", "estrella",
    "faro", "flecha", "flor", "fuerza", "fuego",
    "gato", "genio", "globo", "grulla",
    "halcon", "hielo", "hormiga",
    "iguana",
    "jaguar",
    "karma",
    "lago", "leon", "limon", "lobo", "lumbre", "luna",
    "mango", "mapa", "montana", "mosca",
    "nieve", "nube",
    "origen", "oso",
    "pajaro", "paloma", "pantera", "pasion", "pato", "perro", "piedra",
    "pico", "pluma", "pulpo", "puma",
    "raton", "rayo", "ritual", "roca", "rosa",
    "salmon", "sapo", "selva", "serpiente", "sierra", "sol",
    "tigre", "toro", "tortuga", "trueno",
    "uva",
    "valle", "vibora", "viento", "volcan",
    "zorro",
  ];

  const vowelMap: Record<string, string> = {
    a: '@',
    e: '3',
    i: '1',
    o: '0',
    u: '#',
  };

  const vowels = ['a', 'e', 'i', 'o', 'u'];

  /** Capitaliza primera letra + reemplaza SOLO la primera vocal */
  const transformFirst = (word: string): string => {
    const chars = word.toLowerCase().split('');
    for (let i = 0; i < chars.length; i++) {
      if (vowels.includes(chars[i])) {
        chars[i] = vowelMap[chars[i]] ?? chars[i];
        break;
      }
    }
    chars[0] = chars[0].toUpperCase();
    return chars.join('');
  };

  /** Capitaliza primera letra + reemplaza SOLO la última vocal */
  const transformLast = (word: string): string => {
    const chars = word.toLowerCase().split('');
    for (let i = chars.length - 1; i >= 0; i--) {
      if (vowels.includes(chars[i])) {
        chars[i] = vowelMap[chars[i]] ?? chars[i];
        break;
      }
    }
    chars[0] = chars[0].toUpperCase();
    return chars.join('');
  };

  const word1 = randomElement(palabrasEspañol);
  const word2 = randomElement(palabrasEspañol);

  return `${transformFirst(word1)}_${transformLast(word2)}`;
}
