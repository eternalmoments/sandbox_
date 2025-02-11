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
    priceId: import.meta.env.VITE_STRIPE_PRICE_ID
  }
];

export default function Pricing() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleStartNow = async (plan: typeof plans[0]) => {
    if (!isAuthenticated) {
      navigate('/signup');
      return;
    }
  
    if (!user) {
      console.error('No user found');
      return;
    }
  
    setLoading(true);
    setError('');
    console.log("logando userID",user.id);
    
    try {
      await createCheckoutSession({
        priceId: plan.priceId,
        successUrl: `${window.location.origin}/dashboard`,
        cancelUrl: `${window.location.origin}/pricing`,
        userId: user.id,
        mode: 'payment'
      });
  
      // Atualizar o status de assinatura do usuário
      await updateSubscriptionStatus(user.id, 'active');
    } catch (error) {
      console.error('Payment error:', error);
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
                <div className="mt-8">
                  <button
                    onClick={() => handleStartNow(plan)}
                    disabled={loading}
                    className="w-full px-6 py-4 text-lg leading-6 font-semibold rounded-md text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processando...
                      </>
                    ) : (
                      'Comece agora'
                    )}
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
