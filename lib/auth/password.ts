import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export async function verifyPassword(
  plain: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export function isPasswordStrong(password: string): {
  valid: boolean;
  message?: string;
} {
  if (password.length < 8) {
    return { valid: false, message: "Password must be at least 8 characters." };
  }
  if (!/[A-Z]/.test(password)) {
    return {
      valid: false,
      message: "Password must include at least one uppercase letter.",
    };
  }
  if (!/[0-9]/.test(password)) {
    return {
      valid: false,
      message: "Password must include at least one number.",
    };
  }
  return { valid: true };
}
