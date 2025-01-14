import { useEffect, useState } from 'react';

interface Props {
  startDate: string;
}

export default function RelationshipDuration({ startDate }: Props) {
  const [duration, setDuration] = useState({ years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateDuration = () => {
      const start = new Date(startDate);
      const now = new Date();
      const diff = now.getTime() - start.getTime();

      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      
      const years = Math.floor(days / 365);
      const months = Math.floor((days % 365) / 30);
      const remainingDays = days % 30;

      setDuration({
        years,
        months,
        days: remainingDays,
        hours: hours % 24,
        minutes: minutes % 60,
        seconds: seconds % 60
      });
    };

    calculateDuration();
    const interval = setInterval(calculateDuration, 1000);

    return () => clearInterval(interval);
  }, [startDate]);

  return (
    <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 text-center">
      <h3 className="text-xl font-semibold text-white mb-4">Juntos há</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1">
          <div className="text-3xl font-bold text-purple-400">{duration.years}</div>
          <div className="text-sm text-gray-300">Anos</div>
        </div>
        <div className="space-y-1">
          <div className="text-3xl font-bold text-pink-400">{duration.months}</div>
          <div className="text-sm text-gray-300">Meses</div>
        </div>
        <div className="space-y-1">
          <div className="text-3xl font-bold text-purple-400">{duration.days}</div>
          <div className="text-sm text-gray-300">Dias</div>
        </div>
        <div className="space-y-1">
          <div className="text-3xl font-bold text-pink-400">{duration.hours}</div>
          <div className="text-sm text-gray-300">Horas</div>
        </div>
        <div className="space-y-1">
          <div className="text-3xl font-bold text-purple-400">{duration.minutes}</div>
          <div className="text-sm text-gray-300">Minutos</div>
        </div>
        <div className="space-y-1">
          <div className="text-3xl font-bold text-pink-400">{duration.seconds}</div>
          <div className="text-sm text-gray-300">Segundos</div>
        </div>
      </div>
    </div>
  );
}