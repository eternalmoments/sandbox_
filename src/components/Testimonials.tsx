import { Star } from 'lucide-react';

const testimonials = [
  {
    name: "Maria e João",
    image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2",
    text: "Criar nossa história aqui foi mágico! O mapa estelar da noite em que nos conhecemos ficou perfeito.",
    rating: 5
  },
  {
    name: "Ana e Pedro",
    image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2",
    text: "Uma maneira única e especial de guardar nossas memórias. Recomendo muito!",
    rating: 5
  },
  {
    name: "Júlia e Lucas",
    image: "https://images.unsplash.com/photo-1621252179027-94459d278660",
    text: "Simplesmente incrível! Nossos amigos e família adoraram ver nossa história.",
    rating: 5
  },
  {
    name: "Carolina e Miguel",
    image: "https://images.unsplash.com/photo-1522098635833-216c03d81fbe",
    text: "A forma como o site captura o céu da nossa primeira noite juntos é simplesmente mágica!",
    rating: 5
  },
  {
    name: "Beatriz e Rafael",
    image: "https://images.unsplash.com/photo-1544717302-de2939b7ef71",
    text: "Cada detalhe foi pensado com tanto carinho. Nossa história ficou ainda mais especial.",
    rating: 5
  },
  {
    name: "Isabela e Thiago",
    image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf",
    text: "Uma plataforma incrível para eternizar momentos. O mapa estelar é simplesmente perfeito!",
    rating: 5
  }
];

export default function Testimonials() {
  return (
    <div className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">
            O que dizem nossos casais apaixonados
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Histórias reais de amor eternizadas em nossa plataforma
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-white/10 transform hover:scale-105 transition-transform duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold text-white">{testimonial.name}</h3>
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-300 italic">"{testimonial.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}