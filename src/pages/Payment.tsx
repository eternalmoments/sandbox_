import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CreditCard, Shield } from 'lucide-react';
import { useAuth } from '../contexts/Authcontext';
import { createCheckoutSession } from '../services/payment';
import StarBackground from '../components/StarBackground';

export default function Payment() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const setupSuccess = searchParams.get('setup') === 'success';

  useEffect(() => {
    const handleSubscription = async () => {
      if (setupSuccess && user) {
        try {
          await createCheckoutSession({
            priceId: import.meta.env.VITE_STRIPE_SUBSCRIPTION_PRICE_ID,
            successUrl: `${window.location.origin}/dashboard?subscription=success`,
            cancelUrl: `${window.location.origin}/pricing`,
            userId: user.id,
            mode: 'subscription'
          });
        } catch (error) {
          console.error('Subscription error:', error);
          alert('Failed to setup subscription. Please try again.');
        }
      }
    };

    handleSubscription();
  }, [setupSuccess, user]);

  if (!setupSuccess) {
    return (
      <div className="min-h-screen relative">
        <StarBackground />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Processando seu pagamento...</h1>
            <p className="text-gray-300">Por favor, aguarde enquanto redirecionamos você para o checkout.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <StarBackground />
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Configurando sua assinatura...</h1>
          <p className="text-gray-300">Você será redirecionado para configurar sua assinatura mensal.</p>
        </div>
      </div>
    </div>
  );
}