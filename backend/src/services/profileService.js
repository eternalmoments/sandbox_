import { supabase } from '../lib/supabase';

export const updateSubscriptionStatus = async (userId, status) => {
  const { data, error } = await supabase
    .from('profiles')
    .update({ subscription_status: status })
    .eq('id', userId);

  if (error) {
    console.error('Error updating subscription status:', error);
    throw new Error('Failed to update subscription status');
  }

  return data;
};
