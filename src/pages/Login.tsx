import { useState } from 'react';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import StarBackground from '../components/StarBackground';
import InputField from '../components/forms/InputField';
import { login } from '../services/auth';
import { useAuth } from '../contexts/Authcontext';
import Navbar from '../components/Navbar';

const MessageBox = ({ message, type }: { message: string; type: 'success' | 'error' }) => (
  <div
    className={`${
      type === 'success' ? 'bg-green-500/10 border-green-500 text-green-500' : 'bg-red-500/10 border-red-500 text-red-500'
    } border px-4 py-3 rounded relative`}
  >
    <span className="block sm:inline">{message}</span>
  </div>
);

export default function Login() {
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);
  
    try {
      console.log('INICIANDO LOGIN');
  
      // Chamada ao serviço de login
      const { user, token } = await login(formData.email, formData.password);
  
      console.log('Resposta do login:', user);
  
      // Armazenar o token no localStorage (ou cookies)
      localStorage.setItem('authToken', token);
  
      // Atualizar o contexto de autenticação
      authLogin({
        id: user.id,
        email: user.email,
        name: user.name,
        subscriptionStatus: user.subscriptionStatus,
      });
  
      // Redirecionar o usuário
      navigate('/dashboard');
      console.log('Redirecionando para o dashboard...');
    } catch (err: any) {
      console.error('Erro ao fazer login:', err);
      setError(err?.message || 'Ocorreu um erro ao fazer login.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen relative">
      <StarBackground />
      <Navbar />

      <div className="pt-24 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 relative">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">Bem-vindo de volta!</h2>
            <p className="mt-2 text-gray-300">Continue sua jornada sob as estrelas</p>
          </div>

          {success && <MessageBox message={success} type="success" />}
          {error && <MessageBox message={error} type="error" />}

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-6 bg-gray-900/30 backdrop-blur-sm p-8 rounded-xl border border-gray-700/50"
          >
            <div className="space-y-4">
              <InputField
                label="Email"
                type="email"
                id="email"
                value={formData.email}
                placeholder="you@example.com"
                icon={<Mail className="h-5 w-5 text-gray-400" />}
                required
                onChange={handleChange}
              />
              <InputField
                label="Senha"
                type="password"
                id="password"
                value={formData.password}
                placeholder="••••••••"
                icon={<Lock className="h-5 w-5 text-gray-400" />}
                required
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Entrando...
                </span>
              ) : (
                <>
                  Entrar
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <p className="text-center text-sm text-gray-400">
              Não tem uma conta?{' '}
              <Link
                to="/signup"
                className="font-medium text-purple-400 hover:text-purple-300 transition-colors"
              >
                Cadastre-se
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
