/**
 * Fiscal Encryption Unit Tests
 * Tests for AES-256-GCM symmetric encryption/decryption used for sensitive fiscal data (RFC, CURP).
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { fiscalEncryption } from '../src/utils/security/fiscalEncryption.js';

describe('FiscalEncryption', () => {
  beforeAll(() => {
    // Ensure encryption key is set for tests
    process.env.FISCAL_ENCRYPTION_KEY = process.env.FISCAL_ENCRYPTION_KEY || 'test-fiscal-key-32-chars-long!!!';
  });

  describe('encrypt()', () => {
    it('should encrypt a plaintext string and return a non-empty ciphertext', () => {
      const plain = 'RFC123456789';
      const encrypted = fiscalEncryption.encrypt(plain);
      expect(encrypted).toBeTruthy();
      expect(encrypted).not.toBe(plain);
      expect(encrypted.split(':')).toHaveLength(3);
    });

    it('should produce different ciphertexts for the same plaintext (IV uniqueness)', () => {
      const plain = 'CURP1234567890AB';
      const encrypted1 = fiscalEncryption.encrypt(plain);
      const encrypted2 = fiscalEncryption.encrypt(plain);
      expect(encrypted1).not.toBe(encrypted2);
    });

    it('should return empty string when encrypting empty input', () => {
      const encrypted = fiscalEncryption.encrypt('');
      expect(encrypted).toBe('');
    });

    it('should encrypt unicode characters correctly', () => {
      const plain = 'ÑÁÉÍÓÚ123';
      const encrypted = fiscalEncryption.encrypt(plain);
      expect(encrypted).toBeTruthy();
      expect(encrypted.split(':')).toHaveLength(3);
    });
  });

  describe('decrypt()', () => {
    it('should decrypt ciphertext back to original plaintext', () => {
      const plain = 'RFCABCD123456789';
      const encrypted = fiscalEncryption.encrypt(plain);
      const decrypted = fiscalEncryption.decrypt(encrypted);
      expect(decrypted).toBe(plain);
    });

    it('should decrypt empty string correctly', () => {
      const encrypted = fiscalEncryption.encrypt('');
      const decrypted = fiscalEncryption.decrypt(encrypted);
      expect(decrypted).toBe('');
    });

    it('should decrypt unicode characters correctly', () => {
      const plain = 'ÑÁÉÍÓÚ123';
      const encrypted = fiscalEncryption.encrypt(plain);
      const decrypted = fiscalEncryption.decrypt(encrypted);
      expect(decrypted).toBe(plain);
    });

    it('should throw error for malformed ciphertext (missing colons)', () => {
      expect(() => fiscalEncryption.decrypt('invalid-ciphertext')).toThrow();
    });

    it('should throw error for ciphertext with wrong number of parts', () => {
      expect(() => fiscalEncryption.decrypt('iv:authTag')).toThrow();
      expect(() => fiscalEncryption.decrypt('a:b:c:d')).toThrow();
    });

    it('should throw error for non-hex IV or authTag', () => {
      expect(() => fiscalEncryption.decrypt('invalid-iv:invalid-tag:cipher')).toThrow();
    });
  });

  describe('roundtrip', () => {
    it('should handle long plaintext', () => {
      const plain = 'X'.repeat(1000);
      const encrypted = fiscalEncryption.encrypt(plain);
      const decrypted = fiscalEncryption.decrypt(encrypted);
      expect(decrypted).toBe(plain);
    });

    it('should handle plaintext with special characters', () => {
      const plain = 'RFC-1234_5678!@#$%^&*()_+-=[]{}|;:,.<>?';
      const encrypted = fiscalEncryption.encrypt(plain);
      const decrypted = fiscalEncryption.decrypt(encrypted);
      expect(decrypted).toBe(plain);
    });

    it('should handle numeric-only RFC/CURP style input', () => {
      const plain = '12345678901234567890';
      const encrypted = fiscalEncryption.encrypt(plain);
      const decrypted = fiscalEncryption.decrypt(encrypted);
      expect(decrypted).toBe(plain);
    });
  });
});
