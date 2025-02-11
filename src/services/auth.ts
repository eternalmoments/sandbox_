import axios from 'axios';
import type { SignupCredentials, User } from '../types/auth';

// Define a instância do axios com a URL base do .env
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL_API,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const signup = async ({ email, password, name }: SignupCredentials): Promise<void> => {
  try {
    // Faz a requisição ao endpoint do back-end para criar o usuário
    const response = await apiClient.post('/auth/signup', {
      email,
      password,
      name,
    });

    console.log('Usuário criado com sucesso:', response.data);
    return;
  } catch (error: any) {
    console.error('Erro ao fazer signup no back-end:', error.response?.data || error.message);

    if (error.response?.data?.error?.includes('already registered')) {
      throw new Error('Este e-mail já está cadastrado');
    }

    throw new Error(error.response?.data?.error || 'Erro ao criar conta.');
  }
};

export const login = async (email: string, password: string): Promise<{ user: User; token: string }> => {
  console.log('Iniciando o login...');

  try {
    // Faz a requisição ao endpoint do back-end
    const response = await apiClient.post('/auth/login', { email, password });

    const { token, user } = response.data;

    console.log('Usuário autenticado com sucesso:', user);
    return { user, token };
  } catch (error: any) {
    console.error('Erro ao fazer login no back-end:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error || 'Erro ao fazer login.');
  }
};

export const logout = async (): Promise<void> => {
  try {
    // Faz uma requisição ao endpoint de logout, se houver
    const response = await apiClient.post('/auth/logout');
    console.log('Logout realizado com sucesso:', response.data);
  } catch (error: any) {
    console.error('Erro ao fazer logout:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error || 'Erro ao fazer logout.');
  }
};
