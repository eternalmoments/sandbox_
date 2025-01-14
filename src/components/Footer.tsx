import { Star, Heart, Github, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <Star className="text-yellow-400" size={24} />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                StarMemories
              </span>
            </Link>
            <p className="text-gray-400">
              Capture sua história de amor sob as estrelas
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Produtos</h3>
            <ul className="space-y-2">
              <li><Link to="/pricing" className="text-gray-400 hover:text-white transition-colors">Preços</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Suporte</h3>
            <ul className="space-y-2">
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contato</Link></li>
              <li><Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacidade</Link></li>

            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Siga-nos</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github size={20} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2024 StarMemories. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-2">
              <Heart size={16} className="text-pink-500" />
              <span className="text-gray-400 text-sm">Feito com amor para os apaixonados</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}