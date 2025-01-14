import { LogIn, Star, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/Authcontext';

export default function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="fixed w-full bg-white/80 backdrop-blur-sm z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              StarMemories
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-gray-600">{user?.name}</span>
                <Link 
                  to="/dashboard"
                  className="px-4 py-2 rounded-md bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90 transition-opacity"
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="px-4 py-2 rounded-md text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2"
                >
                  <LogOut size={20} />
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 rounded-md text-gray-600 hover:text-gray-900 transition-colors">
                  Entrar
                </Link>
                <Link 
                  to="/signup"
                  className="px-4 py-2 rounded-md bg-gradient-to-r from-purple-600 to-pink-600 text-white flex items-center gap-2 hover:opacity-90 transition-opacity"
                >
                  <LogIn size={20} />
                  Cadastrar
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}