export const fetchUserSubscription = async (userId: string) => {
    try {
      const response = await fetch(`/api/subscriptions/${userId}`);
      
      if (!response.ok) {
        throw new Error('Erro ao buscar assinatura');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao obter assinatura:', error);
      return null;
    }
  };
  