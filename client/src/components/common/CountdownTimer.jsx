import { useState, useEffect } from 'react';

export default function CountdownTimer({ targetDate, className = '' }) {
  const calcRemaining = () => {
    const diff = new Date(targetDate) - new Date();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      expired: false,
    };
  };

  const [time, setTime] = useState(calcRemaining);

  useEffect(() => {
    const timer = setInterval(() => setTime(calcRemaining), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (time.expired) return null;

  const pad = (n) => String(n).padStart(2, '0');
  const segments = [
    { label: 'Days', value: time.days },
    { label: 'Hours', value: time.hours },
    { label: 'Mins', value: time.minutes },
    { label: 'Secs', value: time.seconds },
  ];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {segments.map((seg, i) => (
        <div key={seg.label} className="text-center">
          <div className="bg-white/20 backdrop-blur rounded-xl px-3 py-2 min-w-[52px]">
            <span className="text-2xl font-bold text-white tabular-nums">{pad(seg.value)}</span>
          </div>
          <p className="text-[10px] text-white/70 mt-1 uppercase tracking-wider">{seg.label}</p>
        </div>
      ))}
    </div>
  );
}
