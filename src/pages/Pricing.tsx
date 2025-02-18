import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Shield } from 'lucide-react';
import { useAuth } from '../contexts/Authcontext';
import { createCheckoutSession } from '../services/payment';
import { updateSubscriptionStatus } from '../services/payment';
import StarBackground from '../components/StarBackground';
import Navbar from '../components/Navbar';

const plans = [
  {
    id: 'basic',
    name: 'Plano Básico',
    price: 29.99,
    maintenance: 19.99,
    pages: 1,
    features: [
      "1 História de amor",
      "Mapa estelar interativo",
      "Mensagens personalizadas",
      "Responsivo móvel",
      "Suporte 24/7"
    ],
    priceId: import.meta.env.VITE_STRIPE_PRICE_ID_1,
    subscriptionPriceId: import.meta.env.VITE_STRIPE_SUBSCRIPTION_PRICE_ID
  },
  {
    id: 'premium',
    name: 'Plano Premium',
    price: 49.99,
    maintenance: 29.99,
    pages: 3,
    features: [
      "3 Histórias de amor",
      "Mapa estelar interativo",
      "Mensagens personalizadas",
      "Galeria de fotos ilimitada",
      "Suporte premium 24/7"
    ],
    priceId: import.meta.env.VITE_STRIPE_PRODUCT_2,
    subscriptionPriceId: import.meta.env.VITE_STRIPE_SUBSCRIPTION_PRICE_ID
  },
  {
    id: 'exclusive',
    name: 'Plano Exclusivo',
    price: 79.99,
    maintenance: 39.99,
    pages: 5,
    features: [
      "5 Histórias de amor",
      "Mapa estelar interativo",
      "Mensagens personalizadas",
      "Galeria de fotos ilimitada",
      "Página personalizada com domínio próprio",
      "Suporte VIP 24/7"
    ],
    priceId: import.meta.env.VITE_STRIPE_PRODUCT_3,
    subscriptionPriceId: import.meta.env.VITE_STRIPE_SUBSCRIPTION_PRICE_ID
  }
];

export default function Pricing() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleCheckout = async (plan: typeof plans[0], mode: 'one-time' | 'subscription') => {
    if (!isAuthenticated) {
      navigate('/signup');
      return;
    }
  
    if (!user) {
      console.error('No user found');
      return;
    }
  
    // 🔹 Salvar usuário no localStorage antes do checkout
    localStorage.setItem('authUser', JSON.stringify(user));
  
    setLoading(true);
    setError('');
    console.log('Iniciando checkout para userID:', user.id);
  
    try {
      await createCheckoutSession({
        priceId: mode === 'one-time' ? plan.priceId : plan.subscriptionPriceId,
        successUrl: `${window.location.origin}/dashboard`,
        cancelUrl: `${window.location.origin}/pricing`,
        userId: user.id,
        mode: mode === 'one-time' ? 'payment' : 'subscription'
      });
  
      if (mode === 'subscription') {
        await updateSubscriptionStatus(user.id, 'active');
      }
    } catch (error) {
      console.error('Erro no pagamento:', error);
      setError('Falha ao processar pagamento. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen">
      <StarBackground />
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">
            Escolha o plano perfeito para sua história de amor
          </h1>
          <p className="text-xl text-gray-300">
            Crie memórias eternas que durarão para sempre
          </p>
        </div>

        {error && (
          <div className="max-w-md mx-auto mb-8 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-center">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="max-w-md mx-auto mb-8 p-4 bg-green-500/10 border border-green-500 rounded-lg text-green-500 text-center">
            {successMessage}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-gray-900/50 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10"
            >
              <div className="px-6 py-8 bg-gradient-to-r from-purple-600 to-pink-600">
                <div className="flex items-center justify-center gap-2">
                  <CreditCard className="h-8 w-8 text-white" />
                  <h3 className="text-2xl leading-8 font-extrabold text-white">
                    {plan.name}
                  </h3>
                </div>
                <div className="mt-4 flex items-baseline justify-center text-white">
                  <span className="text-5xl font-extrabold tracking-tight">R${plan.price}</span>
                  <span className="ml-1 text-2xl font-medium">/setup</span>
                </div>
                <p className="mt-4 text-lg text-purple-100 text-center">
                  + R${plan.maintenance}/mês manutenção
                </p>
              </div>
              <div className="px-6 pt-6 pb-8 bg-gray-800/50">
                <ul className="space-y-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0">
                        <Shield className="h-6 w-6 text-green-400" />
                      </div>
                      <p className="ml-3 text-base text-gray-300">{feature}</p>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 space-y-4">
                  <button
                    onClick={() => handleCheckout(plan, 'one-time')}
                    disabled={loading}
                    className="w-full px-6 py-4 text-lg font-semibold rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 flex items-center justify-center"
                  >
                    {loading ? 'Processando...' : 'Comprar Pagamento Único'}
                  </button>

                  <button
                    onClick={() => handleCheckout(plan, 'subscription')}
                    disabled={loading}
                    className="w-full px-6 py-4 text-lg font-semibold rounded-md text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 flex items-center justify-center"
                  >
                    {loading ? 'Processando...' : 'Comprar com Assinatura'}
                  </button>
                </div>
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-400">
                    Cancele a qualquer momento. Sem taxas ocultas.
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
