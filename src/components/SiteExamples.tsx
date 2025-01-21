import { Compass, Moon, Sparkles, Star, Telescope } from 'lucide-react';

const examples = [
  {
    title: "Proposta estrelada",
    date: "Jan 12, 2025",
    preview: "images/imagem-1.jpg",
    description: "Sob uma chuva de meteoros no campo",
    icon: Star
  },
  {
    title: "Praia enluarada",
    date: "Mar 15, 2024",
    preview: "images/imagem-2.jpg",
    description: "Nosso primeiro beijo sob a lua cheia",
    icon: Moon
  },
  {
    title: "Aurora Boreal",
    date: "Sep 23, 2024",
    preview: "https://images.unsplash.com/photo-1483086431886-3590a88317fe",
    description: "Dançando sob a aurora na Islândia",
    icon: Sparkles
  },
  {
    title: "Data do Observatório",
    date: "July 8, 2024",
    preview: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0",
    description: "Onde descobrimos pela primeira vez o nosso amor pela astronomia",
    icon: Telescope
  },
  {
    title: "Observação das estrelas no deserto",
    date: "May 20, 2024",
    preview: "https://images.unsplash.com/photo-1465101162946-4377e57745c3",
    description: "Acampar sob o céu noturno mais claro",
    icon: Compass
  },
  {
    title: "Nosso primeiro acampamento",
    date: "Dez 13, 2024",
    preview: "images/imagem-4.jpg",
    description: "Acampar sob o céu noturno mais claro",
    icon: Compass
  }
  
];

export default function SiteExamples() {
  return (
    <div className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">
            Histórias de amor escritas nas estrelas
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Descubra como os casais imortalizaram seus momentos mágicos sob o céu estrelado
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {examples.map((example) => (
            <div key={example.title} className="group relative overflow-hidden rounded-xl bg-gray-900/50 backdrop-blur-sm">
              <img
                src={example.preview}
                alt={example.title}
                className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent flex flex-col justify-end p-6">
                <div className="flex items-center gap-2 mb-2">
                  <example.icon className="text-yellow-400" size={20} />
                  <span className="text-gray-300 text-sm">{example.date}</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{example.title}</h3>
                <p className="text-gray-300">{example.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}