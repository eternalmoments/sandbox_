import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import StarBackground from '../components/StarBackground';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { sendContactForm } from '../services/contact';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await sendContactForm(formData);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar mensagem');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <StarBackground />
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-8 border border-white/10">
            <h1 className="text-3xl font-bold text-white mb-8">Entre em Contato</h1>
            
            <div className="space-y-6">
              <p className="text-gray-300 mb-8">
                Estamos aqui para ajudar a tornar sua história de amor ainda mais especial. 
                Entre em contato conosco por qualquer um dos meios abaixo.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4 text-gray-300">
                  <Mail className="h-6 w-6 text-purple-400" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p>contato@starmemories.com</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 text-gray-300">
                  <Phone className="h-6 w-6 text-purple-400" />
                  <div>
                    <p className="font-medium">Telefone</p>
                    <p>(11) 1234-5678</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 text-gray-300">
                  <MapPin className="h-6 w-6 text-purple-400" />
                  <div>
                    <p className="font-medium">Endereço</p>
                    <p>Rua das Estrelas, 123</p>
                    <p>São Paulo, SP - 01234-567</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-6">Envie uma Mensagem</h2>
            
            {success && (
              <div className="mb-6 p-4 bg-green-500/10 border border-green-500 rounded-lg text-green-400">
                Mensagem enviada com sucesso! Entraremos em contato em breve.
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-400">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nome
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                  placeholder="Seu nome completo"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                  placeholder="seu@email.com"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Assunto
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                  placeholder="Como podemos ajudar?"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Mensagem
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                  placeholder="Sua mensagem..."
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <Send className="h-5 w-5" />
                {loading ? 'Enviando...' : 'Enviar Mensagem'}
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}