const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type PasswordCheck = {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
};

export function validateEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

export function checkPassword(password: string): PasswordCheck {
  return {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };
}

export function isPasswordValid(password: string): boolean {
  const checks = checkPassword(password);
  return Object.values(checks).every(Boolean);
}

export function validateInviteCode(code: string): boolean {
  const validCode = process.env.NEXT_PUBLIC_TEACHER_INVITE_CODE ?? "";
  return code.trim() === validCode;
}
