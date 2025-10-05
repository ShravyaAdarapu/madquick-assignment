export interface PasswordOptions {
  length: number;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean;
}

const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
const SIMILAR_CHARS = 'il1Lo0O';

/**
 * Generates a strong random password based on the given options
 */
export const generatePassword = (options: PasswordOptions): string => {
  let charset = LOWERCASE + UPPERCASE;
  
  if (options.includeNumbers) {
    charset += NUMBERS;
  }
  
  if (options.includeSymbols) {
    charset += SYMBOLS;
  }
  
  if (options.excludeSimilar) {
    charset = charset.split('').filter(char => !SIMILAR_CHARS.includes(char)).join('');
  }
  
  if (charset.length === 0) {
    throw new Error('Invalid options: no characters available for password generation');
  }
  
  // Generate random password
  const passwordArray = new Uint32Array(options.length);
  window.crypto.getRandomValues(passwordArray);
  
  let password = '';
  for (let i = 0; i < options.length; i++) {
    password += charset[passwordArray[i] % charset.length];
  }
  
  return password;
};

/**
 * Calculates password strength (0-100)
 */
export const calculatePasswordStrength = (password: string): number => {
  if (!password) return 0;
  
  let strength = 0;
  
  // Length
  strength += Math.min(password.length * 4, 40);
  
  // Character variety
  if (/[a-z]/.test(password)) strength += 15;
  if (/[A-Z]/.test(password)) strength += 15;
  if (/[0-9]/.test(password)) strength += 15;
  if (/[^a-zA-Z0-9]/.test(password)) strength += 15;
  
  return Math.min(strength, 100);
};
