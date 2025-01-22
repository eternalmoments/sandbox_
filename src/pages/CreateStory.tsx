import { useState, useEffect } from 'react';
import { Calendar, Upload, MessageSquare, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StarBackground from '../components/StarBackground';
import DashboardNavbar from '../components/DashboardNavbar';
import PlacesAutocomplete from '../components/forms/PlacesAutocomplete';
import { getStarChart } from '../services/astronomy';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/Authcontext';
import { updateSubscriptionStatus } from '../services/payment';

interface FormData {
  title: string;
  skyDate: string;
  relationshipStartDate: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  photos: File[];
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
    location: {
      latitude: 0,
      longitude: 0,
      address: ''
    },
    photos: [],
    messages: ['']
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
          latitude: place.geometry!.location.lat(),
          longitude: place.geometry!.location.lng(),
          address: place.formatted_address || ''
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

    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...files]
    }));

    // Create preview URLs
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
    
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleMessageChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      messages: prev.messages.map((msg, i) => i === index ? value : msg)
    }));
  };

  const addMessage = () => {
    setFormData(prev => ({
      ...prev,
      messages: [...prev.messages, '']
    }));
  };

  const removeMessage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      messages: prev.messages.filter((_, i) => i !== index)
    }));
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
    
      console.log('Star Chart Image URL:', imageUrl);
    
      // Criação do registro do site
      const { data: site, error: siteError } = await supabase
        .from('sites')
        .insert([
          {
            user_id: user.id,
            title: formData.title,
            meeting_date: formData.relationshipStartDate,
            star_chart_url: imageUrl, // Aqui você usa a URL correta
            address: formData.location.address,
            latitude: formData.location.latitude,
            longitude: formData.location.longitude,
          },
        ])
        .select()
        .single();
        navigate('/dashboard');
      if (siteError) throw siteError;
    
    } catch (err) {
      console.error('Error creating story:', err);
      setError('Erro ao criar sua história. Por favor, tente novamente.');
    }
     finally {
      setLoading(false);
    }
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
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute top-2 right-2 p-2 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ))}
                
                {formData.photos.length < 10 && (
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
                )}
              </div>
              <p className="text-sm text-gray-400">
                Máximo de 10 fotos. Formatos aceitos: JPG, PNG
              </p>
            </div>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Mensagens</h2>
              <button
                type="button"
                onClick={addMessage}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 rounded-lg text-white hover:bg-purple-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Adicionar Mensagem
              </button>
            </div>
            
            <div className="space-y-4">
              {formData.messages.map((message, index) => (
                <div key={index} className="relative">
                  <textarea
                    value={message}
                    onChange={(e) => handleMessageChange(index, e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                    placeholder="Escreva uma mensagem especial..."
                    rows={3}
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeMessage(index)}
                      className="absolute top-2 right-2 p-2 bg-red-500 rounded-full opacity-0 hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4 text-white" />
                    </button>
                  )}
                </div>
              ))}
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