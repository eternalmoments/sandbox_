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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [hasActivePlan, setHasActivePlan] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUserProfile = async (userId: string): Promise<User | null> => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('status, stripe_customer_id')
        .eq('user_id', userId)
        .single();

      if (error) throw error;

      return {
        id: userId,
        subscriptionStatus: data?.status ?? 'inactive',
        stripeCustomerId: data?.stripe_customer_id ?? '',
      };
    } catch (error) {
      console.error('Erro ao buscar perfil do usuário:', error);
      return null;
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) throw error;
        if (!session?.user) {
          setLoading(false);
          return;
        }

        const userProfile = await fetchUserProfile(session.user.id);
        if (userProfile) {
          setUser(userProfile);
          setHasActivePlan(userProfile.subscriptionStatus === 'active');
        }
      } catch (error) {
        console.error('Erro ao verificar sessão:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setHasActivePlan(false);
        navigate('/login');
      } else if (event === 'SIGNED_IN' && session?.user) {
        fetchUserProfile(session.user.id).then((userProfile) => {
          if (userProfile) {
            setUser(userProfile);
            setHasActivePlan(userProfile.subscriptionStatus === 'active');
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
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setHasActivePlan(false);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, login: handleLogin, logout: handleLogout, isAuthenticated: !!user, hasActivePlan, loading }}>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-white">Carregando...</p>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  return context;
};
