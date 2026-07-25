import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Bell } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export default function FocusView({ store }: { store: any }) {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            handleComplete();
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, seconds, minutes]);

  const handleComplete = () => {
    setIsActive(false);
    // Notify user
    if (Notification.permission === 'granted') {
      new Notification(mode === 'focus' ? 'انتهت فترة التركيز!' : 'انتهت فترة الاستراحة!');
    }
    
    if (mode === 'focus') {
      // Record session
      store.addFocusSession({
        id: uuidv4(),
        duration: 25,
        date: new Date().toISOString(),
        completed: true
      });
      setMode('break');
      setMinutes(5);
    } else {
      setMode('focus');
      setMinutes(25);
    }
    setSeconds(0);
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  };

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setMinutes(mode === 'focus' ? 25 : 5);
    setSeconds(0);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold">{mode === 'focus' ? 'وقت التركيز' : 'وقت الاستراحة'}</h2>
        <p className="text-slate-500 max-w-md mx-auto">
          {mode === 'focus' 
            ? 'ركز تماماً في مهمتك الحالية وتجنب أي مشتتات. حجب الإشعارات مفعل ذهنياً!'
            : 'خذ وقتاً للراحة، تمدد قليلاً وابتعد عن الشاشة.'}
        </p>
        <button onClick={requestNotificationPermission} className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline flex items-center justify-center gap-1 mx-auto mt-2">
          <Bell size={14} /> السماح بالتنبيهات
        </button>
      </div>

      <div className="relative">
        {/* Decorative background ring */}
        <div className="absolute inset-0 bg-emerald-500/10 rounded-full blur-3xl scale-150"></div>
        
        {/* Timer display */}
        <div className="relative w-72 h-72 rounded-full border-4 border-slate-200 dark:border-slate-800 flex items-center justify-center bg-white dark:bg-slate-900 shadow-2xl">
          <div className="text-7xl font-mono tracking-tighter tabular-nums font-bold text-slate-800 dark:text-slate-100">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button 
          onClick={toggleTimer}
          className="w-20 h-20 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
        >
          {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
        </button>
        <button 
          onClick={resetTimer}
          className="w-14 h-14 rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 flex items-center justify-center transition-colors"
        >
          <RotateCcw size={24} />
        </button>
      </div>
      
      <div className="flex gap-4">
        <button 
          onClick={() => { setMode('focus'); setMinutes(25); setSeconds(0); setIsActive(false); }}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${mode === 'focus' ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900' : 'bg-transparent text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        >
          تركيز (25 دقيقة)
        </button>
        <button 
          onClick={() => { setMode('break'); setMinutes(5); setSeconds(0); setIsActive(false); }}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${mode === 'break' ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900' : 'bg-transparent text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        >
          استراحة (5 دقائق)
        </button>
      </div>
    </div>
  );
}
