import React from 'react';
import { Moon, Sun, Trash2 } from 'lucide-react';

export default function SettingsView({ store }: { store: any }) {
  const handleClearData = () => {
    if (confirm('هل أنت متأكد من مسح جميع البيانات المحلية (المهام، الجلسات)؟')) {
      localStorage.removeItem('thrive_study_assistant_data');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold">الإعدادات</h2>
      
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
        <div className="p-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">المظهر</h3>
            <p className="text-slate-500 text-sm mt-1">تغيير وضع الألوان للتطبيق لمزيد من راحة العين أثناء المذاكرة.</p>
          </div>
          <button 
            onClick={store.toggleTheme}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors font-medium"
          >
            {store.state.theme === 'dark' ? (
              <><Sun size={20} /> الوضع الفاتح</>
            ) : (
              <><Moon size={20} /> الوضع الداكن</>
            )}
          </button>
        </div>

        <div className="p-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-red-600 dark:text-red-400">مسح البيانات</h3>
            <p className="text-slate-500 text-sm mt-1">حذف كافة المهام وجلسات التركيز من التخزين المحلي.</p>
          </div>
          <button 
            onClick={handleClearData}
            className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-xl transition-colors font-medium"
          >
            <Trash2 size={20} /> مسح الكل
          </button>
        </div>
      </div>
    </div>
  );
}
