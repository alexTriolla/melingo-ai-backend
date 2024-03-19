import { ValidationArguments } from 'class-validator';

export function constrainedMessage(message?: string, args: any = {}) {
  return (a: ValidationArguments) => {
    const { constraints } = a;
    let { value } = a;
    if (typeof value === 'string') {
      value = value.replace(/\|/g, '');
    }

    return `${JSON.stringify({ value, message, constraints, ...args })}`;
  };
}

export function generateRandomPassword(length: number = 8): string {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*';

  const allChars = uppercase + lowercase + numbers + symbols;
  let password = '';

  // Ensure the password includes at least one character from each required group
  password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
  password += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
  password += numbers.charAt(Math.floor(Math.random() * numbers.length));
  password += symbols.charAt(Math.floor(Math.random() * symbols.length));

  // Fill the rest of the password length with random characters from all groups
  for (let i = 4; i < length; i++) {
    password += allChars.charAt(Math.floor(Math.random() * allChars.length));
  }

  // Shuffle the password to avoid predictable order
  return shuffleString(password);
}

// Utility function to shuffle the characters in the password
function shuffleString(str: string): string {
  const arr = str.split('');
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap elements
  }
  return arr.join('');
}
