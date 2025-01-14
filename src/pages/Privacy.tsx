import StarBackground from '../components/StarBackground';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function Privacy() {
  return (
    <div className="min-h-screen">
      <StarBackground />
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Main Content */}
          <div className="space-y-8">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-8 border border-white/10">
              <h1 className="text-3xl font-bold text-white mb-8">Política de Privacidade</h1>
              
              <div className="space-y-6 text-gray-300">
                <section>
                  <h2 className="text-xl font-semibold text-white mb-4">1. Informações que coletamos</h2>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Informações de registro (nome, e-mail)</li>
                    <li>Fotos que você envia</li>
                    <li>Dados de localização para o mapa estelar</li>
                    <li>Mensagens e textos que você cria</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-white mb-4">2. Como usamos suas informações</h2>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Para criar e manter sua conta</li>
                    <li>Para gerar mapas estelares personalizados</li>
                    <li>Para salvar e exibir suas histórias</li>
                    <li>Para melhorar nossos serviços</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-white mb-4">3. Compartilhamento de dados</h2>
                  <p>Não vendemos suas informações pessoais. Seus dados são compartilhados apenas:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Com serviços necessários para operação</li>
                    <li>Quando você escolhe compartilhar sua história</li>
                    <li>Se exigido por lei</li>
                  </ul>
                </section>
              </div>
            </div>
          </div>

          {/* Right Column - Additional Content */}
          <div className="space-y-8">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-8 border border-white/10">
              <section>
                <h2 className="text-xl font-semibold text-white mb-4">4. Segurança</h2>
                <div className="flex gap-6">
                  <img 
                    src="https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800"
                    alt="Security"
                    className="w-32 h-32 rounded-lg object-cover"
                  />
                  <div className="space-y-2 text-gray-300">
                    <p>Implementamos medidas rigorosas de segurança:</p>
                    <ul className="list-disc pl-6">
                      <li>Criptografia de dados</li>
                      <li>Acesso restrito</li>
                      <li>Monitoramento 24/7</li>
                      <li>Backups regulares</li>
                    </ul>
                  </div>
                </div>
              </section>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-8 border border-white/10">
              <section>
                <h2 className="text-xl font-semibold text-white mb-4">5. Seus direitos</h2>
                <div className="flex gap-6">
                  <img 
                    src="https://images.unsplash.com/photo-1633265486064-086b219458ec?w=800"
                    alt="User Rights"
                    className="w-32 h-32 rounded-lg object-cover"
                  />
                  <div className="space-y-2 text-gray-300">
                    <p>Você tem direito a:</p>
                    <ul className="list-disc pl-6">
                      <li>Acessar seus dados</li>
                      <li>Corrigir informações</li>
                      <li>Solicitar exclusão</li>
                      <li>Exportar dados</li>
                    </ul>
                  </div>
                </div>
              </section>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-8 border border-white/10">
              <section>
                <h2 className="text-xl font-semibold text-white mb-4">6. Contato</h2>
                <div className="flex gap-6">
                  <img 
                    src="https://images.unsplash.com/photo-1596524430615-b46475ddff6e?w=800"
                    alt="Contact"
                    className="w-32 h-32 rounded-lg object-cover"
                  />
                  <div className="space-y-2 text-gray-300">
                    <p>Dúvidas sobre privacidade:</p>
                    <ul className="list-none space-y-1">
                      <li>📧 privacy@starmemories.com</li>
                      <li>📞 (11) 1234-5678</li>
                      <li>📍 Rua das Estrelas, 123</li>
                    </ul>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center text-gray-400">
          <p>Última atualização: 10 de Janeiro de 2024</p>
        </div>
      </div>

      <Footer />
    </div>
  );
}