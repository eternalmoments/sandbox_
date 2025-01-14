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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const resetAuth = () => {
    setUser(null);
    setHasActivePlan(false);
    setLoading(false);
    localStorage.clear();
    navigate('/');
  };

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        if (mounted) setLoading(true);

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        
        if (session?.user && mounted) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('name, subscription_status, stripe_customer_id')
            .eq('id', session.user.id)
            .single();

          if (profileError) throw profileError;

          if (profile && mounted) {
            const userData: User = {
              id: session.user.id,
              email: session.user.email!,
              name: profile.name || session.user.user_metadata?.name || '',
              subscriptionStatus: profile.subscription_status,
              stripeCustomerId: profile.stripe_customer_id
            };

            setUser(userData);
            setHasActivePlan(profile.subscription_status === 'active');
          }
        }
      } catch (error) {
        console.error('Session check error:', error);
        if (mounted) {
          resetAuth();
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (event === 'SIGNED_OUT') {
        resetAuth();
        return;
      }

      try {
        if (event === 'SIGNED_IN' && session?.user) {
          setLoading(true);
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('name, subscription_status, stripe_customer_id')
            .eq('id', session.user.id)
            .single();

          if (profileError) throw profileError;

          if (profile && mounted) {
            const userData: User = {
              id: session.user.id,
              email: session.user.email!,
              name: profile.name || session.user.user_metadata?.name || '',
              subscriptionStatus: profile.subscription_status,
              stripeCustomerId: profile.stripe_customer_id
            };

            setUser(userData);
            setHasActivePlan(profile.subscription_status === 'active');
            navigate('/dashboard');
          }
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        if (mounted) {
          resetAuth();
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setHasActivePlan(userData.subscriptionStatus === 'active');
    navigate('/dashboard');
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      resetAuth();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login: handleLogin,
      logout: handleLogout,
      isAuthenticated: !!user,
      hasActivePlan,
      loading,
      resetAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};