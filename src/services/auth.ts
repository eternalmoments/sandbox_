import { supabase } from '../lib/supabase';
import type { SignupCredentials, User } from '../types/auth';

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

 export  const  login = async (email: string, password: string): Promise<{ user: User }> => {
  console.log("Iniciando o login..."); // Log inicial

  try {
    console.log("Tentando autenticar com Supabase...");
    console.log("Credenciais fornecidas:", { email, password });

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    console.log("Resposta do Supabase (data):", authData ); // Log do retorno
    console.log("Erro do Supabase (error):", authError); // Log do erro, se houver

    if (authError) {
      console.error("Erro retornado pelo Supabase:", authError);
      throw authError;
    }

    if (!authData?.user) {
      console.error("Usuário não encontrado no retorno do Supabase.");
      throw new Error('Usuário não encontrado');
    }

    return {
      user: {
        id: authData.user.id,
        email: authData.user.email!,
        name: authData.user.user_metadata?.name || '',
        subscriptionStatus: authData.user.user_metadata?.subscription_status || 'inactive',
      },
    };
  } catch (error: any) {
    console.error("Erro capturado no login:", error); // Captura erros inesperados
    throw new Error(error.message || 'Erro ao fazer login');
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