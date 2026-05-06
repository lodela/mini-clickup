import crypto from 'crypto';

/**
 * FiscalEncryption handles symmetric encryption for sensitive Mexican fiscal data (RFC, CURP, etc.)
 * Using AES-256-GCM for authenticated encryption.
 */
class FiscalEncryption {
  private readonly algorithm = 'aes-256-gcm';
  private readonly ivLength = 16;
  private readonly tagLength = 16;
  private readonly key: Buffer;

  constructor() {
    // In production, this key must come from an environment variable (process.env.FISCAL_ENCRYPTION_KEY)
    // It must be a 32-byte key.
    const secret = process.env.FISCAL_ENCRYPTION_KEY || 'default_secret_key_for_dev_only_32_chars_';
    this.key = crypto.scryptSync(secret, 'salt', 32);
  }

  /**
   * Encrypts a string value.
   * @param text The plain text to encrypt.
   * @returns Encrypted string in format iv:authTag:cipherText
   */
  encrypt(text: string): string {
    if (!text) return '';

    const iv = crypto.randomBytes(this.ivLength);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag().toString('hex');
    
    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
  }

  /**
   * Decrypts an encrypted string.
   * @param encryptedText The text in format iv:authTag:cipherText
   * @returns The decrypted plain text.
   */
  decrypt(encryptedText: string): string {
    if (!encryptedText) return '';

    const [ivHex, tagHex, cipherText] = encryptedText.split(':');
    if (!ivHex || !tagHex || !cipherText) {
      throw new Error('Invalid encrypted text format. Expected iv:authTag:cipherText');
    }

    const iv = Buffer.from(ivHex, 'hex');
    const tag = Buffer.from(tagHex, 'hex');
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
    
    decipher.setAuthTag(tag);
    
    let decrypted = decipher.update(cipherText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}

export const fiscalEncryption = new FiscalEncryption();
