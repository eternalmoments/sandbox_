export interface User {
  id: string;
  subscriptionStatus?: string;
  stripeCustomerId?: string;
}

export interface AuthResponse {
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  name: string;
}