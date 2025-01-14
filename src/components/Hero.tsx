import { Star, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/Authcontext';

export default function Hero() {
  const navigate = useNavigate();
  const { isAuthenticated, hasActivePlan } = useAuth();

  const handleCreateMemory = () => {
    if (!isAuthenticated) {
      navigate('/signup');
      return;
    }
    
    if (!hasActivePlan) {
      navigate('/pricing');
      return;
    }
    
    navigate('/create-story');
  };

  return (
    <div className="relative min-h-[60vh] flex items-center">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="text-center">
          <div className="flex justify-center gap-2 mb-6">
            <Star className="text-yellow-400" size={32} />
            <Heart className="text-pink-500" size={32} />
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6">
            Capture sua história de amor sob as estrelas
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Crie um lindo site mostrando o céu exato da noite em que vocês se conheceram,
            compartilhe suas fotos e conte sua história de amor única.
          </p>
          <button 
            onClick={handleCreateMemory}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Crie sua memória
          </button>
        </div>
      </div>
    </div>
  );
}