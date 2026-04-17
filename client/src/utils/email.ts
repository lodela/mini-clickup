/**
 * Validate email format
 * @param email - Email string to validate
 * @returns Boolean indicating if email is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Parse emails from text (comma, space, or semicolon separated)
 * @param text - Text containing emails
 * @returns Array of trimmed email strings
 */
export function parseEmails(text: string): string[] {
  if (!text || text.trim() === '') {
    return [];
  }

  // Split by comma, space, or semicolon
  const emails = text
    .split(/[,\s;]+/)
    .map(email => email.trim())
    .filter(email => email.length > 0);

  return emails;
}

/**
 * Find duplicates in email array
 * @param emails - Array of emails
 * @returns Array of duplicate emails
 */
export function findDuplicates(emails: string[]): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  emails.forEach(email => {
    const normalized = email.toLowerCase();
    if (seen.has(normalized)) {
      duplicates.add(email);
    } else {
      seen.add(normalized);
    }
  });

  return Array.from(duplicates);
}

/**
 * Validate multiple emails and return validation results
 * @param emails - Array of emails to validate
 * @returns Object with valid, invalid, and duplicate emails
 */
export function validateEmails(emails: string[]): {
  valid: string[];
  invalid: string[];
  duplicates: string[];
} {
  const valid: string[] = [];
  const invalid: string[] = [];
  const duplicates: string[] = findDuplicates(emails);

  emails.forEach(email => {
    if (isValidEmail(email)) {
      valid.push(email);
    } else {
      invalid.push(email);
    }
  });

  return { valid, invalid, duplicates };
}

/**
 * Format email for display (truncate long emails)
 * @param email - Email to format
 * @param maxLength - Maximum length before truncation
 * @returns Formatted email string
 */
export function formatEmailForDisplay(email: string, maxLength: number = 30): string {
  if (email.length <= maxLength) {
    return email;
  }

  const [local, domain] = email.split('@');
  if (!domain) return email;

  const truncatedLocal = local.slice(0, maxLength - domain.length - 1) + '...';
  return `${truncatedLocal}@${domain}`;
}

export default {
  isValidEmail,
  parseEmails,
  findDuplicates,
  validateEmails,
  formatEmailForDisplay,
};
