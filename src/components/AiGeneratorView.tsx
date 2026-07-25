import React, { useState } from 'react';
import { PenTool, Loader2, Download } from 'lucide-react';

export default function AiGeneratorView() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();
      
      if (data.error) throw new Error(data.error);
      if (data.result) {
        setImageUrl(data.result);
      }
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء التوليد');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-3 flex items-center justify-center gap-3">
          <PenTool className="text-emerald-500" size={32} />
          مولد الصور الذكي
        </h2>
        <p className="text-slate-500 max-w-lg mx-auto">
          صف الصورة التي تتخيلها وسيقوم الذكاء الاصطناعي برسمها لك. استخدمها لتوضيح مفاهيم دراسية أو للخرائط الذهنية.
        </p>
      </div>

      <form onSubmit={handleGenerate} className="bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex gap-2">
        <input 
          type="text" 
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="مثال: صورة مجهرية لخلية نباتية بأسلوب ثلاثي الأبعاد..."
          className="flex-1 bg-transparent border-none outline-none p-4 text-lg"
          disabled={isLoading}
        />
        <button 
          type="submit" 
          disabled={!prompt.trim() || isLoading}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 text-white px-8 rounded-xl font-medium transition-all flex items-center gap-2 min-w-[140px] justify-center"
        >
          {isLoading ? (
            <><Loader2 className="animate-spin" size={20} /> جاري...</>
          ) : (
            'توليد'
          )}
        </button>
      </form>

      {error && (
        <div className="bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 p-4 rounded-xl text-center">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 min-h-[400px] flex items-center justify-center shadow-inner">
        {imageUrl ? (
          <div className="space-y-4 w-full">
            <img src={imageUrl} alt="Generated" className="w-full max-w-2xl mx-auto rounded-xl shadow-lg" />
            <div className="flex justify-center">
              <a 
                href={imageUrl} 
                download={`thrive_generated_${Date.now()}.png`}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-xl font-medium transition-colors"
              >
                <Download size={20} /> تحميل الصورة
              </a>
            </div>
          </div>
        ) : (
          <div className="text-slate-400 dark:text-slate-600 text-center space-y-4">
            <PenTool size={64} className="mx-auto opacity-50" strokeWidth={1} />
            <p className="text-lg">سيتم عرض الصورة هنا بعد التوليد</p>
          </div>
        )}
      </div>
    </div>
  );
}
