import { describe, it, expect, vi } from 'vitest';
import { validatePassword, generateFunnyPassword } from '../src/utils/passwordRitual';

const passwordRitual = {
  validatePassword,
  generateFunnyPassword
};

describe('Password Ritual - Regex Validation', () => {
  const { validatePassword } = passwordRitual;

  it('should pass for a valid password meeting all criteria', () => {
    // Min 10 chars, Uppercase, Number, Special [!#$%&_-?*@]
    expect(validatePassword('SecurePass1!#')).toBe(true);
  });

  it('should fail if password is less than 10 characters', () => {
    expect(validatePassword('Sec1!#')).toBe(false);
  });

  it('should fail if password has no uppercase letter', () => {
    expect(validatePassword('securepass1!#')).toBe(false);
  });

  it('should fail if password has no number', () => {
    expect(validatePassword('SecurePass!!#')).toBe(false);
  });

  it('should fail if password has no special character from the allowed set', () => {
    expect(validatePassword('SecurePass123')).toBe(false);
  });

  it('should fail if password uses a special character NOT in the allowed set', () => {
    // Using '.' which is not in [!#$%&_-?*@]
    expect(validatePassword('SecurePass1.')).toBe(false);
  });

  it('should pass with various allowed special characters', () => {
    expect(validatePassword('Pass123456%')).toBe(true);
    expect(validatePassword('Pass123456_')).toBe(true);
    expect(validatePassword('Pass123456@')).toBe(true);
    expect(validatePassword('Pass123456?')).toBe(true);
  });
});

describe('Password Ritual - Funny Password Algorithm', () => {
  const { generateFunnyPassword } = passwordRitual;

  it('should replace first and last vowels and separate words with underscore', () => {
    // Mock words
    const words = ['apple', 'banana'];
    
    // Expected transformation:
    // apple: first 'a' -> '@', last 'e' -> '3' => '@ppl3'
    // banana: first 'a' -> '@', last 'a' -> '@' => 'b@nan@'
    // Result: '@ppl3_b@nan@'
    
    expect(generateFunnyPassword(words)).toBe('@ppl3_b@nan@');
  });

  it('should handle words with only one vowel correctly', () => {
    const words = ['cat'];
    // first and last vowel is the same 'a' -> '@'
    expect(generateFunnyPassword(words)).toBe('c@t');
  });

  it('should handle words with no vowels', () => {
    const words = ['sky'];
    expect(generateFunnyPassword(words)).toBe('sky');
  });

  it('should follow the vowel map: a=@/4, e=3, i=1, o=0, u=#', () => {
    const words = ['aura']; 
    // first 'a' -> '@', last 'a' -> '@' (or 4? the prompt says a=@/4, usually first/last might differ or just follow a map)
    // Assuming a simple map for now: a=@, e=3, i=1, o=0, u=#
    expect(generateFunnyPassword(['aura'])).toBe('@ur@');
  });
});
