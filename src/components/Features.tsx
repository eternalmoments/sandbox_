import { Stars, Image, Heart, Share2 } from 'lucide-react';

const features = [
  {
    icon: Stars,
    title: "Recreação no céu noturno",
    description: "Veja o padrão exato da constelação da sua noite especial"
  },
  {
    icon: Image,
    title: "Galeria de fotos",
    description: "Envie e mostre seus momentos favoritos juntos"
  },
  {
    icon: Heart,
    title: "Mensagens de amor",
    description: "Adicione notas e memórias pessoais em toda a sua linha do tempo"
  },
  {
    icon: Share2,
    title: "Compartilhamento fácil",
    description: "Compartilhe sua história de amor única com amigos e familiares"
  }
];

export default function Features() {
  return (
    <div className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Crie sua surpresa perfeita
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tudo o que você precisa para criar uma experiência digital memorável para alguém especial
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <feature.icon className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}