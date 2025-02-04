import axios from 'axios';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardNavbar from '../components/DashboardNavbar';
import ManageSubscription from '../components/ManageSubscription';
import StarBackground from '../components/StarBackground';
import { useAuth } from '../contexts/Authcontext';

interface Site {
  id: string;
  title: string;
  meeting_date: string;
  created_at: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSites = async () => {
      if (!user) return; // Garante que o usuário está definido antes de fazer a request

      try {
        console.log('URL', import.meta.env.VITE_BASE_URL_API);
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL_API}sites/getSitesByUser`, {
          params: { user_id: user.id },
        });

        console.log('LOGANDO DADOS RETORNADOS NO DASHBOARD:', response.data);

        setSites(response.data);
      } catch (error) {
        console.error('Error fetching sites:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSites();
  }, [user]);

  return (
    <div className="relative min-h-screen">
      <StarBackground />
      <DashboardNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12 relative z-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Minhas Histórias</h1>
          {user?.stripeCustomerId && <ManageSubscription />}
        </div>

        {loading ? (
          <div className="text-white">Carregando...</div>
        ) : sites.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-300 mb-8">Você ainda não criou nenhuma história.</p>
            <Link
              to="/create-story"
              className="bg-purple-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-purple-500 transition inline-flex items-center justify-center"
              style={{ margin: '0 auto' }}
            >
              Criar minha primeira história
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sites.map((site) => (
              <Link
                key={site.id}
                to={`/sites/${site.id}`}
                className="block bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-purple-500/50 transition-colors"
              >
                <h3 className="text-xl font-semibold text-white mb-2">{site.title}</h3>
                <p className="text-gray-400">
                  Criado em {new Date(site.created_at).toLocaleDateString()}
                </p>
              </Link>
            ))}

            <Link
              to="/create-story"
              className="flex items-center justify-center bg-gray-900/30 backdrop-blur-sm rounded-xl p-6 border border-dashed border-gray-700 hover:border-purple-500 transition-colors group"
            >
              <div className="text-center">
                <Plus className="w-12 h-12 text-gray-400 group-hover:text-purple-400 mx-auto mb-4 transition-colors" />
                <p className="text-gray-400 group-hover:text-purple-400 transition-colors">
                  Criar nova história
                </p>
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
