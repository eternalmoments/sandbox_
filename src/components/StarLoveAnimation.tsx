import { useEffect, useRef } from 'react';

export default function StarLoveAnimation() {
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="love-message">
        <span className="letter">I</span>
        <span className="heart">❤️</span>
        <span className="letter">Y</span>
        <span className="letter">O</span>
        <span className="letter">U</span>
      </div>
      
      <div className="stars-message">
        E AS ESTRELAS VÃO CONTINUAR GUIANDO NOSSO CAMINHO
        <span className="stars">
          <span className="star">⭐</span>
          <span className="star">⭐</span>
          <span className="star">⭐</span>
        </span>
      </div>

      <style>{`
        .love-message {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          padding: 2rem;
        }

        .letter {
          color: white;
          font-size: 4rem;
          font-weight: bold;
          opacity: 0;
          animation: fadeIn 0.5s ease forwards;
        }

        .heart {
          font-size: 4rem;
          display: inline-block;
          opacity: 0;
          transform: scale(0);
          animation: popIn 0.5s ease forwards;
          animation-delay: 1s;
        }

        .letter:nth-child(1) { animation-delay: 0s; }
        .letter:nth-child(3) { animation-delay: 1.5s; }
        .letter:nth-child(4) { animation-delay: 1.7s; }
        .letter:nth-child(5) { animation-delay: 1.9s; }

        .stars-message {
          color: white;
          font-size: 1.5rem;
          font-weight: 500;
          opacity: 0;
          text-align: center;
          animation: fadeInUp 0.5s ease forwards;
          animation-delay: 2.2s;
        }

        .stars {
          display: inline-flex;
          margin-left: 10px;
        }

        .star {
          opacity: 0;
          animation: twinkle 1.5s ease-in-out infinite;
        }

        .star:nth-child(1) { animation-delay: 2.5s; }
        .star:nth-child(2) { animation-delay: 2.7s; }
        .star:nth-child(3) { animation-delay: 2.9s; }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes popIn {
          from {
            opacity: 0;
            transform: scale(0);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes twinkle {
          0% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1.2); }
          100% { opacity: 0; transform: scale(0.5); }
        }
      `}</style>
    </div>
  );
}