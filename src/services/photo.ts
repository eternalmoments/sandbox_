import { Import } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface UploadPhotoParams {
  siteId: string;
  file: File;
}

export const uploadPhoto = async ({ siteId, file }: UploadPhotoParams) => {
  try {
    // Obtém o token de autenticação do usuário
    const { data: session } = await supabase.auth.getSession();
    const authToken = localStorage.getItem('authToken');
    console.log("token na request para criação de fotos",authToken);
    
    if (!authToken) {
      throw new Error('Usuário não autenticado.');
    }

    // FormData para envio da foto
    const formData = new FormData();
    formData.append("photo", file);
    formData.append("siteId", siteId);

    // Chama a API do back-end para upload da foto
    const response = await fetch(`${import.meta.env.VITE_BASE_URL_API}photos/upload_photos`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro ao fazer upload da foto.');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao fazer upload da foto:', error);
    throw error;
  }
};
