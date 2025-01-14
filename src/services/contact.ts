import { supabase } from '../lib/supabase';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const sendContactForm = async (formData: ContactForm) => {
  try {
    const { error } = await supabase
      .from('contact_messages')
      .insert([formData]);

    if (error) throw error;
    
    return { message: 'Mensagem enviada com sucesso!' };
  } catch (error) {
    console.error('Error sending contact form:', error);
    throw new Error('Falha ao enviar mensagem. Por favor, tente novamente.');
  }
};