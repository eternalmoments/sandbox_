import { useState, useEffect } from 'react';
import { Calendar, Upload, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardNavbar from '../components/DashboardNavbar';
import PlacesAutocomplete from '../components/forms/PlacesAutocomplete';
import StarBackground from '../components/StarBackground';
import { useAuth } from '../contexts/Authcontext';
import { uploadPhoto } from '../services/photo';
import { supabase } from '../lib/supabase';
import { getStarChart } from '../services/astronomy';

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
  const { user, hasActivePlan } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    skyDate: '',
    relationshipStartDate: '',
    location: { latitude: 0, longitude: 0, address: '' },
    photos: [],
    messages: []
  });

  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!hasActivePlan) {
      navigate('/pricing');
    }
  }, [hasActivePlan, navigate]);

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
        }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      const { imageUrl } = await getStarChart({
        date: formData.skyDate,
        latitude: formData.location.latitude,
        longitude: formData.location.longitude,
      });

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

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
    
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleCaptionChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.map((photo, i) =>
        i === index ? { ...photo, caption: value } : photo
      )
    }));
  };

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

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Data do Céu
              </label>
              <div className="flex items-center gap-2">
                <Calendar className="text-gray-400" />
                <input
                  type="datetime-local"
                  name="skyDate"
                  value={formData.skyDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Data de Início do Relacionamento
              </label>
              <div className="flex items-center gap-2">
                <Calendar className="text-gray-400" />
                <input
                  type="date"
                  name="relationshipStartDate"
                  value={formData.relationshipStartDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Localização
              </label>
              <PlacesAutocomplete onPlaceSelect={handlePlaceSelect} />
            </div>
          </div>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h2 className="text-xl font-semibold text-white mb-4">Fotos</h2>
          <div className="space-y-4">
          {formData.photos.map((photo, index) => (
  <div key={index} className="flex items-center gap-4">
    <img
      src={previewUrls[index]}
      alt={`Foto ${index + 1}`}
      className="w-32 h-32 object-cover rounded-lg"
    />
    <textarea
      value={photo.caption}
      onChange={(e) => handleCaptionChange(index, e.target.value)}
      placeholder="Adicione uma legenda"
      className="flex-1 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
    />
    <button
      type="button"
      onClick={() => removePhoto(index)}
      className="p-2 bg-red-500 rounded-full text-white"
    >
      <Trash2 />
    </button>
  </div>
))}

              <label className="flex items-center justify-center w-full h-48 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-purple-500 transition-colors">
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <span className="mt-2 block text-sm font-medium text-gray-300">
                  Adicionar foto
                </span>
              </div>
              <input
                type="file"
                onChange={handlePhotoChange}
                accept="image/*"
                className="hidden"
                multiple
              />
            </label>
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
