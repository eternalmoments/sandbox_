import { LogOut, Star } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Importe useNavigate
import { useAuth } from '../contexts/Authcontext';

export default function DashboardNavbar() {
  const { user, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate(); // Defina o navigate

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const handleCancelClick = () => {
    navigate('/delete'); // Direciona para /delete
  };

  return (
    <>
      <nav className="fixed w-full bg-gray-900/80 backdrop-blur-sm z-50 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-white">
                <Star className="text-yellow-400" />
                <span>StarMemories</span>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <span className="text-gray-300 flex items-center gap-2 cursor-pointer">
                  {user?.name}
                  <button
                    onClick={toggleModal}
                    className="text-gray-300 hover:text-yellow-400 transition-colors"
                  >
                    <span className="text-xl">&gt;</span>
                  </button>
                </span>

                {/* Modal */}
                {isModalOpen && (
                  <div className="absolute top-10 right-0 bg-gray-800 text-white rounded-lg shadow-lg w-60">
                    <div className="p-4 border-b border-gray-700">
                      <h2 className="text-lg font-semibold text-blue-400">Opções do Usuário</h2>
                    </div>
                    <ul className="p-4 space-y-2">
                      <li>
                        <button
                          className="text-gray-300 hover:text-blue-400 w-full text-left"
                          onClick={() => alert('Abrir perfil')}
                        >
                          Criar Nova História
                        </button>
                      </li>
                      <li>
                        <button
                          className="text-gray-300 hover:text-blue-400 w-full text-left"
                          onClick={handleCancelClick}
                        >
                          Cancelar meu plano
                        </button>
                      </li>
                    </ul>
                    <div className="p-4 border-t border-gray-700">
                      <button
                        onClick={toggleModal}
                        className="w-full px-4 py-2 bg-blue-700 hover:bg-gray-600 text-gray-300 rounded-md"
                      >
                        Fechar
                      </button>
                    </div>
                  </div>
                )}
              </div>

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
    </>
  );
}
