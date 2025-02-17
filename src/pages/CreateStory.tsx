import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardNavbar from '../components/DashboardNavbar';
import StarBackground from '../components/StarBackground';
import { useAuth } from '../contexts/Authcontext';
import { uploadPhoto } from '../services/photo';
import { supabase } from '../lib/supabase';
import { getStarChart } from '../services/astronomy';
import { fetchUserSubscription } from '../services/subscriptions';

interface FormData {
  title: string;
  skyDate: string;
  relationshipStartDate: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  photos: { file: File; caption: string }[];
  messages: string[];
}

export default function CreateStory() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    skyDate: '',
    relationshipStartDate: '',
    location: { latitude: 0, longitude: 0, address: '' },
    photos: [],
    messages: [],
  });

  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [error, setError] = useState('');

  // Verifica a assinatura do usuário antes de permitir criar a história
  useEffect(() => {
    const checkSubscription = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        const subscription = await fetchUserSubscription(user.id);

        if (!subscription || subscription.status !== 'active') {
          navigate('/pricing'); // Redireciona para a página de planos se a assinatura não estiver ativa
        } else {
          setHasActiveSubscription(true);
        }
      } catch (err) {
        console.error('Erro ao verificar assinatura:', err);
        setError('Erro ao verificar assinatura. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    checkSubscription();
  }, [user, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
    if (place.geometry?.location) {
      setFormData(prev => ({
        ...prev,
        location: {
          latitude: place.geometry.location.lat(),
          longitude: place.geometry.location.lng(),
          address: place.formatted_address || '',
        },
      }));
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + formData.photos.length > 10) {
      setError('Você pode enviar no máximo 10 fotos');
      return;
    }

    const newPhotos = files.map(file => ({ file, caption: '' }));

    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...newPhotos],
    }));

    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const handleCaptionChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.map((photo, i) =>
        i === index ? { ...photo, caption: value } : photo
      ),
    }));
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));

    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      // Gerar o Star Chart
      const { imageUrl } = await getStarChart({
        date: formData.skyDate,
        latitude: formData.location.latitude,
        longitude: formData.location.longitude,
      });

      // Criar o registro do site
      const { data: site, error: siteError } = await supabase
        .from('sites')
        .insert([{
          user_id: user.id,
          title: formData.title,
          meeting_date: formData.relationshipStartDate,
          star_chart_url: imageUrl,
          address: formData.location.address,
          latitude: formData.location.latitude,
          longitude: formData.location.longitude,
        }])
        .select()
        .single();

      if (siteError) throw siteError;

      console.log('LOGANDO ID DO SITE', site.id);

      const photoUploadPromises = formData.photos.map(async ({ file, caption }) => {
        const result = await uploadPhoto({ siteId: site.id, file });
        return supabase
          .from('photos')
          .insert([{ site_id: site.id, url: result.url, caption }]);
      });

      await Promise.all(photoUploadPromises);
      navigate(`/sites/${site.id}`);
    } catch (err) {
      console.error('Erro ao criar a história:', err);
      setError('Erro ao criar sua história. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white">Verificando assinatura...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <StarBackground />
      <DashboardNavbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
        <h1 className="text-3xl font-bold text-white mb-8">Crie sua História de Amor</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-4">Informações Básicas</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Título da História
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                  placeholder="Ex: Nosso Primeiro Encontro"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Criando...' : 'Criar História'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
