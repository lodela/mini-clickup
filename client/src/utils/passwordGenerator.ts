import { randomElement } from "./formatters";

/**
 * Generates a "funny" secure password based on a curated list of words.
 * Rules:
 * 1. Picks 2 random words.
 * 2. Joins them with '_'.
 * 3. Replaces the first and last vowel of each word based on the map:
 *    a -> @ or 4, e -> 3, i -> 1, o -> 0, u -> #
 */
export function generateFunnyPassword(): string {
  const curatedWords = [
    "apple", "banana", "cactus", "dragon", "eagle", "falcon", "guitar", "hammer",
    "island", "jungle", "kitten", "lemon", "monkey", "nebula", "ocean", "panda",
    "quartz", "rabbit", "sunset", "tiger", "umbrella", "velvet", "walnut", "xenon",
    "yellow", "zebra", "mountain", "river", "forest", "cloud", "storm", "bridge",
    "castle", "knight", "wizard", "goblin", "phoenix", "spirit", "shadow", "light",
    "coffee", "cookie", "donut", "pizza", "burger", "taco", "sushi", "pasta",
    "rocket", "planet", "galaxy", "comet", "star", "moon", "sun", "void",
    "glitch", "cyber", "matrix", "binary", "pixel", "vector", "logic", "code",
    "happy", "funny", "crazy", "wild", "calm", "bold", "swift", "keen",
    "azure", "crimson", "golden", "silver", "emerald", "ruby", "onyx", "pearl"
  ];

  const vowelMap: Record<string, string> = {
    'a': '@', // simplified to @, logic can be expanded
    'e': '3',
    'i': '1',
    'o': '0',
    'u': '#',
  };

  const transformWord = (word: string): string => {
    const vowels = ['a', 'e', 'i', 'o', 'u'];
    const chars = word.toLowerCase().split('');
    
    let firstVowelIdx = -1;
    let lastVowelIdx = -1;

    for (let i = 0; i < chars.length; i++) {
      if (vowels.includes(chars[i])) {
        if (firstVowelIdx === -1) firstVowelIdx = i;
        lastVowelIdx = i;
      }
    }

    if (firstVowelIdx !== -1) {
      chars[firstVowelIdx] = vowelMap[chars[firstVowelIdx]] || chars[firstVowelIdx];
      // If there's only one vowel, lastVowelIdx is same as firstVowelIdx
      if (lastVowelIdx !== firstVowelIdx) {
        chars[lastVowelIdx] = vowelMap[chars[lastVowelIdx]] || chars[lastVowelIdx];
      }
    }

    return chars.join('');
  };

  const word1 = randomElement(curatedWords);
  const word2 = randomElement(curatedWords);

  return `${transformWord(word1)}_${transformWord(word2)}`;
}
