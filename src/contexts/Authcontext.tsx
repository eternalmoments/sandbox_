import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { User } from '../types/auth';

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  hasActivePlan: boolean;
  loading: boolean;
  resetAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [hasActivePlan, setHasActivePlan] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const resetAuth = () => {
    setUser(null);
    setHasActivePlan(false);
    setLoading(false);
    localStorage.removeItem('authUser');
    navigate('/login');
  };

  const fetchUserProfile = async (userId: string): Promise<User> => {
    try {
      const { data: subscription, error: subscriptionError } = await supabase
        .from('subscriptions')
        .select('status, stripe_customer_id')
        .eq('user_id', userId)
        .single();
  
      if (subscriptionError) {
        console.error('Erro ao buscar perfil:', subscriptionError);
        throw subscriptionError;
      }

      return {
        id: userId,
        subscriptionStatus: subscription?.status ?? 'inactive',
        stripeCustomerId: subscription?.stripe_customer_id ?? '',
      };
    } catch (error) {
      console.error('Erro ao buscar perfil do usuário:', error);
      return {
        id: userId,
        subscriptionStatus: 'inactive',
        stripeCustomerId: '',
      };
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        console.log("Usuário autenticado após retorno do Stripe:", session.user);
        
        const userProfile = await fetchUserProfile(session.user.id);
        if (userProfile) {
          setUser(userProfile);
          setHasActivePlan(userProfile.subscriptionStatus === 'active');
          localStorage.setItem('authUser', JSON.stringify(userProfile));
        }
      } else {
        // Verifica se há um usuário salvo no localStorage e restaura os dados
        const storedUser = localStorage.getItem('authUser');
        if (storedUser) {
          const parsedUser: User = JSON.parse(storedUser);
          setUser(parsedUser);
          setHasActivePlan(parsedUser.subscriptionStatus === 'active');
        } else {
          resetAuth();
        }
      }

      setLoading(false);
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        resetAuth();
      } else if (event === 'SIGNED_IN' && session?.user) {
        fetchUserProfile(session.user.id).then((userProfile) => {
          if (userProfile) {
            setUser(userProfile);
            setHasActivePlan(userProfile.subscriptionStatus === 'active');
            localStorage.setItem('authUser', JSON.stringify(userProfile));
            navigate('/dashboard');
          }
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setHasActivePlan(userData.subscriptionStatus === 'active');
    localStorage.setItem('authUser', JSON.stringify(userData));
    navigate('/dashboard');
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      resetAuth();
    } catch (error) {
      console.error('Erro ao deslogar:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login: handleLogin,
        logout: handleLogout,
        isAuthenticated: !!user,
        hasActivePlan,
        loading,
        resetAuth,
      }}
    >
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
