import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '../lib/supabase';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface CheckoutSessionParams {
  priceId: string;
  subscriptionPriceId:string,
  successUrl: string;
  cancelUrl: string;
  userId: string;
  mode: 'payment' | 'subscription';
}

export const createCheckoutSession = async ({
  priceId,
  subscriptionPriceId,
  successUrl,
  cancelUrl,
  userId,
  mode
}: CheckoutSessionParams) => {
  try {
    const stripe = await stripePromise;
    if (!stripe) {
      throw new Error('Stripe failed to initialize');
    }

    // Get the current session
    
    
    
    let authenticationToken = localStorage.getItem('authToken');
    console.log("LOGANDO ID DO USUARIO PAGAMENTO", authenticationToken);
    console.log("LOGANDO TOKEN NO PAGAMENTO", authenticationToken);
    if (!authenticationToken) {
      throw new Error('No authentication token found');
    }

   
    
    console.log("LOGANDO USERID",userId);
    
    const response = await fetch('/api/payment/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authenticationToken}`
      },
      body: JSON.stringify({
        priceId,
        subscriptionPriceId,
        successUrl,
        cancelUrl,
        userId,
        mode
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      
      throw new Error(errorData.error || 'Failed to create checkout session');
      
      
    }

    const { sessionId } = await response.json();
    if (!sessionId) {
      throw new Error('No session ID returned from server');
    }

    // Redirect to checkout
    const { error: redirectError } = await stripe.redirectToCheckout({ sessionId });
    if (redirectError) {
      throw redirectError;
    }
  } catch (error) {
    console.error('Payment error:', error);
    throw error;
  }
};

export const createPortalSession = async (customerId: string) => {
  try {
    // Get the current session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch('/api/payment/create-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({
        customerId,
        returnUrl: `${window.location.origin}/dashboard`
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create portal session');
    }

    const { url } = await response.json();
    if (!url) {
      throw new Error('No portal URL returned from server');
    }

    window.location.href = url;
  } catch (error) {
    console.error('Portal session error:', error);
    throw new Error('Failed to access billing portal');
  }
};

export const updateSubscriptionStatus = async (userId: string, status: string) => {
  try {
    let authenticationToken = localStorage.getItem('authToken');
    if (!authenticationToken) {
      throw new Error('No authentication token found');
    }

    const response = await fetch('/api/profile/update-subscription', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authenticationToken}`
      },
      body: JSON.stringify({
        userId,
        status
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update subscription status');
    }

    console.log('Subscription status updated successfully');
  } catch (error) {
    console.error('Error updating subscription status:', error);
    throw error;
  }
};
