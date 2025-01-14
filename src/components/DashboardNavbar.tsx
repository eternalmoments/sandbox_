import { LogOut, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/Authcontext';

export default function DashboardNavbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="fixed w-full bg-gray-900/50 backdrop-blur-sm z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-white">
              <Star className="text-yellow-400" />
              <span>StarMemories</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-gray-300">
              {user?.name}
            </span>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 rounded-md text-gray-300 hover:text-white transition-colors"
            >
              <LogOut className="h-5 w-5" />
              Sair
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}