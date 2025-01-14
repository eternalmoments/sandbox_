import { useState } from 'react';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import StarBackground from '../components/StarBackground';
import InputField from '../components/forms/InputField';
import { signup } from '../services/auth';
import { validateSignupForm } from '../utils/validation';
import Navbar from '../components/Navbar';

interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SignupFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validationError = validateSignupForm(
      formData.name,
      formData.email,
      formData.password,
      formData.confirmPassword
    );

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...credentials } = formData;
      await signup(credentials);
      navigate('/login?registered=true');
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta');
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
            <h2 className="text-3xl font-bold text-white">Crie sua conta</h2>
            <p className="mt-2 text-gray-300">
              Comece a capturar sua história de amor sob as estrelas
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6 bg-gray-900/30 backdrop-blur-sm p-8 rounded-xl border border-gray-700/50">
            <div className="space-y-4">
              <InputField
                label="Nome completo"
                type="text"
                id="name"
                value={formData.name}
                placeholder="John Doe"
                icon={<User className="h-5 w-5 text-gray-400" />}
                required
                onChange={handleChange}
              />

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

              <InputField
                label="Confirme sua senha"
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
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
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Criando conta...
                </span>
              ) : (
                <>
                  Criar conta
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <p className="text-center text-sm text-gray-400">
              Já tem uma conta?{' '}
              <Link to="/login" className="font-medium text-purple-400 hover:text-purple-300 transition-colors">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}