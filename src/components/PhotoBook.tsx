import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Photo {
  id: string;
  url: string;
  caption: string;
}

interface Props {
  photos: Photo[];
}

export default function PhotoBook({ photos }: Props) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  const turnPage = (direction: 'next' | 'prev') => {
    if (isFlipping) return;
    
    setIsFlipping(true);
    if (direction === 'next' && currentPage < photos.length - 1) {
      setCurrentPage(prev => prev + 1);
    } else if (direction === 'prev' && currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
    setTimeout(() => setIsFlipping(false), 600);
  };

  if (photos.length === 0) return null;

  return (
    <div className="relative max-w-5xl mx-auto h-[600px] flex items-center justify-center perspective">
      {/* Book */}
      <div className="relative w-full max-w-4xl h-[500px] flex book-shadow">
        {/* Left Page (Photo) */}
        <div className="w-1/2 h-full bg-white/10 backdrop-blur-sm rounded-l-lg overflow-hidden book-page">
          <img
            src={photos[currentPage].url}
            alt={photos[currentPage].caption}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Page (Caption) */}
        <div className="w-1/2 h-full bg-white/10 backdrop-blur-sm rounded-r-lg p-8 flex items-center justify-center book-page">
          <p className="text-white text-xl leading-relaxed font-serif italic text-center">
            {photos[currentPage].caption}
          </p>
        </div>

        {/* Page Turn Buttons */}
        {currentPage > 0 && (
          <button
            onClick={() => turnPage('prev')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 p-2 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors"
            disabled={isFlipping}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}
        {currentPage < photos.length - 1 && (
          <button
            onClick={() => turnPage('next')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 p-2 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors"
            disabled={isFlipping}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Page Numbers */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 -translate-y-8 text-white/80">
          Página {currentPage + 1} de {photos.length}
        </div>
      </div>

      <style>{`
        .perspective {
          perspective: 2000px;
        }
        
        .book-shadow {
          box-shadow: 0 0 100px rgba(255, 255, 255, 0.1);
        }
        
        .book-page {
          transition: transform 0.6s cubic-bezier(0.645, 0.045, 0.355, 1);
          transform-origin: center;
        }
        
        .book-page:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
}