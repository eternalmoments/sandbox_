export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePassword = (password: string): string | null => {
  if (password.length < 6) {
    return 'Password must be at least 6 characters long';
  }
  return null;
};

export const validateSignupForm = (name: string, email: string, password: string, confirmPassword: string): string | null => {
  if (!name || !email || !password || !confirmPassword) {
    return 'All fields are required';
  }

  if (!validateEmail(email)) {
    return 'Invalid email format';
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    return passwordError;
  }

  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }

  return null;
};