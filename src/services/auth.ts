import { supabase } from '../lib/supabase';
import type { SignupCredentials, User } from '../types/auth';
import axios from 'axios';


export const signup = async ({ email, password, name }: SignupCredentials): Promise<void> => {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          subscription_status: 'inactive'
        }
      }
    });

    if (authError) {
      if (authError.message.includes('already registered')) {
        throw new Error('Este e-mail já está cadastrado');
      }
      throw authError;
    }

    if (!authData.user) {
      throw new Error('Erro ao criar usuário');
    }

    return;
  } catch (error: any) {
    console.error('Signup error:', error);
    throw new Error(error.message || 'Erro ao criar conta');
  }
};

export const login = async (email: string, password: string): Promise<{ user: User; token: string }> => {
  console.log('Iniciando o login...'); // Log inicial

  try {
    console.log('Enviando credenciais ao back-end...');

    // Fazendo a requisição ao endpoint do back-end
    const response = await axios.post('/api/auth/login', { email, password });

    // Obtendo os dados da resposta
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
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error: any) {
    console.error('Logout error:', error);
    throw new Error(error.message || 'Erro ao fazer logout');
  }
};