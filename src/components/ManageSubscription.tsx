import { useState } from 'react';
import { useAuth } from '../contexts/Authcontext';
import { createPortalSession } from '../services/payment';

export default function ManageSubscription() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleManageSubscription = async () => {
    if (!user?.stripeCustomerId) return;
    
    setLoading(true);
    setError('');
    
    try {
      await createPortalSession(user.stripeCustomerId);
    } catch (error) {
      console.error('Failed to open billing portal:', error);
      setError('Falha ao abrir o portal de pagamento. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleManageSubscription}
        disabled={loading}
        className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700 disabled:opacity-50 flex items-center"
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Carregando...
          </>
        ) : (
          'Gerenciar Assinatura'
        )}
      </button>
      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}