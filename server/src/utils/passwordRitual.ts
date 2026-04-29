export const VOWEL_MAP: Record<string, string> = {
  'a': '@',
  'e': '3',
  'i': '1',
  'o': '0',
  'u': '#',
};

/**
 * Validates a password against the corporate ritual rules:
 * - Min 10 characters
 * - At least one uppercase letter
 * - At least one number
 * - At least one special character from [!#$%&_-?*@]
 * - No characters outside the allowed set
 */
export function validatePassword(password: string): boolean {
  if (password.length < 10) return false;

  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!#$%&_\-?*@]/.test(password);
  
  // Check for any character NOT in the allowed set
  // We use a more robust way to check allowed characters
  const allowedChars = /^[a-zA-Z0-9!#$%&_\-?*@]*$/;
  if (!allowedChars.test(password)) return false;

  return hasUpper && hasNumber && hasSpecial;
}

/**
 * Generates a "funny password" by replacing the first and last vowels of each word.
 * Words are joined by an underscore.
 * Vowel map: a=@, e=3, i=1, o=0, u=#
 */
export function generateFunnyPassword(words: string[]): string {
  const processedWords = words.map(word => {
    const vowels = ['a', 'e', 'i', 'o', 'u'];
    const chars = word.split('');
    
    // Find indices of all vowels (case-insensitive)
    const vowelIndices: number[] = [];
    chars.forEach((char, index) => {
      if (vowels.includes(char.toLowerCase())) {
        vowelIndices.push(index);
      }
    });

    if (vowelIndices.length === 0) return word;

    // Replace first vowel
    const firstIdx = vowelIndices[0];
    const firstChar = chars[firstIdx].toLowerCase();
    chars[firstIdx] = VOWEL_MAP[firstChar] || chars[firstIdx];

    // Replace last vowel (if different from first)
    if (vowelIndices.length > 1) {
      const lastIdx = vowelIndices[vowelIndices.length - 1];
      const lastChar = chars[lastIdx].toLowerCase();
      chars[lastIdx] = VOWEL_MAP[lastChar] || chars[lastIdx];
    }

    return chars.join('');
  });

  return processedWords.join('_');
}
