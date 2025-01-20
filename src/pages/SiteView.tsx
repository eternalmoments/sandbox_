import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/Authcontext';
import InteractiveStarBackground from '../components/InteractiveStarBackground';
import RelationshipDuration from '../components/RelationshipDuration';
import PhotoBook from '../components/PhotoBook';
import StarLoveAnimation from '../components/StarLoveAnimation';

interface Site {
  id: string;
  title: string;
  meeting_date: string;
  star_chart_url: string;
  photos: { id: string; url: string; caption: string }[];
  messages: { id: string; content: string; position_x: number; position_y: number }[];
}

export default function SiteView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [site, setSite] = useState<Site | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSite = async () => {
      if (!id || !user) return;
  
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL_API}sites/viewSite/${id}`, {
          params: { user_id: user.id },
        });
        
        // Verifica se os dados retornaram corretamente
        if (response.status !== 200) {
          throw new Error(`Failed to fetch site: ${response.statusText}`);
        }
  
        setSite(response.data);
      } catch (err: any) {
        console.error('Error fetching site:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load site');
      } finally {
        setLoading(false);
      }
    };
  
    fetchSite();
  }, [id, user]);
  
  

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Carregando sua história...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-500 text-xl text-center">
          <p>{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 px-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors"
          >
            Voltar ao painel
          </button>
        </div>
      </div>
    );
  }

  if (!site) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">História não encontrada</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative">
      <InteractiveStarBackground />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <button
          onClick={() => navigate('/dashboard')}
          className="fixed top-4 left-4 z-50 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white flex items-center gap-2 hover:bg-white/20 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar ao painel
        </button>

        {/* Star Chart Section */}
        <div className="pt-24 pb-12 text-center">
          <h2 className="text-2xl text-purple-400 mb-4">O céu estava assim quando</h2>
          <h1 className="text-4xl font-bold text-white mb-8">{site.title}</h1>
          
          {/* Star Chart Display */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={site.star_chart_url}
                alt="Star Chart"
                className="w-full h-auto object-cover"
                style={{ maxHeight: '70vh' }}
              />
            </div>
          </div>
          
          {/* Relationship Duration */}
          <div className="max-w-lg mx-auto mb-12">
            <RelationshipDuration startDate={site.meeting_date} />
          </div>

          {/* Photo Book */}
          {site.photos.length > 0 && (
            <div className="max-w-6xl mx-auto mb-12">
              <h2 className="text-2xl text-purple-400 mb-8">Nosso álbum de memórias</h2>
              <PhotoBook photos={site.photos} />
            </div>
          )}

          {/* Star Love Animation */}
          <div className="mt-24">
            <StarLoveAnimation />
          </div>
        </div>
      </div>
    </div>
  );
}