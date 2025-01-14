import { useEffect, useState } from 'react';

const INITIAL_COUNT = 300;
const DAILY_INCREMENT = 3;

export default function Counter() {
  const [count, setCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    // Calculate days since Jan 1, 2024
    const start = new Date('2024-01-01').getTime();
    const now = new Date().getTime();
    const daysSince = Math.floor((now - start) / (1000 * 60 * 60 * 24));
    const targetCount = INITIAL_COUNT + (daysSince * DAILY_INCREMENT);

    // Animate counter
    if (isAnimating) {
      let current = 0;
      const interval = setInterval(() => {
        if (current >= targetCount) {
          setIsAnimating(false);
          clearInterval(interval);
          return;
        }
        
        const increment = Math.max(1, Math.floor((targetCount - current) / 20));
        current += increment;
        setCount(current);
      }, 50);

      return () => clearInterval(interval);
    }
  }, [isAnimating]);

  return (
    <div className="relative z-10 text-center py-16">
      <div className="inline-block text-6xl font-bold text-white mb-4">
        {count.toLocaleString()}+
      </div>
      <p className="text-xl text-gray-300 mt-4">
        Histórias de amor eternizadas sob as estrelas
      </p>
    </div>
  );
}