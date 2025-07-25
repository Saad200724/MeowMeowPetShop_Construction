import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  initialHours: number;
  initialMinutes: number;
  initialSeconds: number;
}

export default function CountdownTimer({ 
  initialHours, 
  initialMinutes, 
  initialSeconds 
}: CountdownTimerProps) {
  const [time, setTime] = useState({
    hours: initialHours,
    minutes: initialMinutes,
    seconds: initialSeconds
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(prevTime => {
        let { hours, minutes, seconds } = prevTime;
        
        seconds--;
        if (seconds < 0) {
          seconds = 59;
          minutes--;
          if (minutes < 0) {
            minutes = 59;
            hours--;
            if (hours < 0) {
              hours = 23;
            }
          }
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (value: number) => value.toString().padStart(2, '0');

  return (
    <div className="flex items-center space-x-2">
      <div className="bg-white bg-opacity-20 rounded-lg px-2 py-1 text-center">
        <div className="text-lg font-bold">{formatTime(time.hours)}</div>
        <div className="text-xs uppercase">Hr</div>
      </div>
      <div className="text-white font-bold">:</div>
      <div className="bg-white bg-opacity-20 rounded-lg px-2 py-1 text-center">
        <div className="text-lg font-bold">{formatTime(time.minutes)}</div>
        <div className="text-xs uppercase">Min</div>
      </div>
      <div className="text-white font-bold">:</div>
      <div className="bg-white bg-opacity-20 rounded-lg px-2 py-1 text-center">
        <div className="text-lg font-bold">{formatTime(time.seconds)}</div>
        <div className="text-xs uppercase">Sec</div>
      </div>
    </div>
  );
}
