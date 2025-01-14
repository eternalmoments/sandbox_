const examples = [
  {
    image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486",
    title: "Sob as estrelas de Paris",
    description: "Uma noite romântica na Torre Eiffel"
  },
  {
    image: "https://images.unsplash.com/photo-1496062031456-07b8f162a322",
    title: "Pôr do sol na praia",
    description: "Primeiro encontro em Venice Beach"
  },
  {
    image: "https://images.unsplash.com/photo-1514222709107-a180c68d72b4",
    title: "Pico da montanha",
    description: "Proposta sob a Aurora Boreal"
  }
];

export default function Examples() {
  return (
    <div className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Histórias de amor inspiradoras
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Veja como outros casais capturaram seus momentos mágicos
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {examples.map((example) => (
            <div key={example.title} className="group relative overflow-hidden rounded-xl">
              <img
                src={example.image}
                alt={example.title}
                className="w-full h-96 object-cover transform group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-xl font-semibold text-white mb-2">{example.title}</h3>
                <p className="text-gray-200">{example.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}