import React from 'react';
import { Trophy } from 'lucide-react';

export default function DashboardView({ store }: { store: any }) {
  const totalTasks = store.state.tasks.length;
  const completedTasks = store.state.tasks.filter((t: any) => t.completed).length;
  const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
  const focusHours = Math.round(store.state.focusSessions.reduce((acc: number, s: any) => acc + s.duration, 0) / 60);

  const getMotivationalTitle = (progress: number, totalTasks: number) => {
    if (totalTasks === 0) return { title: "باحث عن المعرفة", desc: "أضف مهامك الأولى للبدء 🎯", color: "text-slate-700 dark:text-slate-300", bg: "bg-slate-100 dark:bg-slate-800/50" };
    if (progress === 0) return { title: "مستعد للانطلاق", desc: "ابدأ الآن في إنجاز مهامك 🚀", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50" };
    if (progress <= 25) return { title: "شعلة النشاط", desc: "بداية ممتازة، واصل تقدمك 🌱", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/50" };
    if (progress <= 50) return { title: "نجم الإصرار", desc: "في منتصف الطريق، استمر! ⏳", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/50" };
    if (progress <= 75) return { title: "بطل التركيز", desc: "أداء مذهل، اقتربت من القمة ⛰️", color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-900/50" };
    if (progress < 100) return { title: "فارس الإنجاز", desc: "خطوة واحدة وتصل للهدف 🏅", color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-900/50" };
    return { title: "أسطورة المذاكرة", desc: "لقد أنهيت كل مهامك اليوم 🏆✨", color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-900/50" };
  };

  const motivation = getMotivationalTitle(progress, totalTasks);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">نظرة عامة</h2>
        <div className="text-sm text-slate-500 font-medium">مرحباً بك في Thrive 🚀</div>
      </div>
      
      <div className={`p-6 rounded-2xl flex items-center justify-between transition-all duration-500 shadow-sm ${motivation.bg}`}>
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl bg-white dark:bg-slate-900 shadow-sm ${motivation.color}`}>
            <Trophy size={28} />
          </div>
          <div>
            <h3 className={`text-xl font-bold ${motivation.color}`}>اللقب: {motivation.title}</h3>
            <p className="text-slate-600 dark:text-slate-400 mt-1 font-medium">{motivation.desc}</p>
          </div>
        </div>
        <div className={`text-4xl font-bold opacity-30 hidden sm:block ${motivation.color}`}>
          {progress}%
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Progress Ring Card */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center">
          <h3 className="text-lg font-semibold text-slate-500 mb-6 self-start w-full text-center">نسبة الإنجاز اليوم</h3>
          <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="10" />
              <circle 
                cx="50" cy="50" r="45" 
                fill="none" 
                className="stroke-emerald-500 transition-all duration-1000 ease-out" 
                strokeWidth="10" 
                strokeDasharray={`${2 * Math.PI * 45}`} 
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`} 
                strokeLinecap="round" 
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold">{progress}%</span>
            </div>
          </div>
        </div>

        {/* Focus Hours Card */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-500 mb-2">ساعات التركيز الإجمالية</h3>
            <p className="text-sm text-slate-400 mb-4">حصيلة استخدامك لوضع التركيز (بومودورو)</p>
          </div>
          <p className="text-5xl font-bold text-blue-600 dark:text-blue-500 text-center">
            {focusHours} <span className="text-2xl text-slate-400 font-medium">ساعة</span>
          </p>
        </div>

        {/* Tasks Stats Card */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <h3 className="text-lg font-semibold text-slate-500 mb-4">إحصائيات المهام</h3>
          <div className="space-y-4 flex-1 flex flex-col justify-center">
            <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <span className="text-slate-600 dark:text-slate-400">المهام المنجزة</span>
              <span className="text-xl font-bold text-emerald-600">{completedTasks}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <span className="text-slate-600 dark:text-slate-400">المهام المتبقية</span>
              <span className="text-xl font-bold text-amber-500">{totalTasks - completedTasks}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
