import React, { useState, useEffect } from 'react';
import { BookMarked, Search, FileText, Loader2, BookOpen, Download, ShieldAlert, ShieldCheck } from 'lucide-react';

// قائمة بالكلمات المحظورة لتفعيل الوضع الآمن
const BANNED_KEYWORDS = [
  'محظور', 'ممنوع', 'جنس', 'sex', 'porn', 'adult', 'erotica', '+18', 'للبالغين', 'kamastra', 'kama sutra'
];

const isSafeContent = (text?: string) => {
  if (!text) return true;
  const lowerText = text.toLowerCase();
  return !BANNED_KEYWORDS.some(keyword => lowerText.includes(keyword));
};

export default function LibraryView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [books, setBooks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [safeModeAlert, setSafeModeAlert] = useState(false);

  const fetchBooks = async (query: string) => {
    setIsLoading(true);
    setSafeModeAlert(false);
    try {
      const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=40`);
      const data = await res.json();
      
      let fetchedItems = data.items || [];
      
      // تطبيق الوضع الآمن (فلترة الكتب المحظورة)
      fetchedItems = fetchedItems.filter((book: any) => {
        const info = book.volumeInfo;
        return (
          isSafeContent(info.title) &&
          isSafeContent(info.description) &&
          isSafeContent(info.categories?.join(' '))
        );
      });

      // أخذ أول 24 كتاب سليم
      setBooks(fetchedItems.slice(0, 24));
    } catch (error) {
      console.error("Error fetching books:", error);
      setBooks([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch some interesting books by default
  useEffect(() => {
    fetchBooks('تطوير الذات والبرمجة');
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      if (!isSafeContent(searchTerm)) {
        setBooks([]);
        setSafeModeAlert(true);
        return;
      }
      fetchBooks(searchTerm);
    } else {
      fetchBooks('تطوير الذات والبرمجة');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <BookMarked className="text-emerald-500" size={32} />
            المكتبة (الوضع الآمن)
            <ShieldCheck className="text-emerald-500" size={24} title="الوضع الآمن مفعل" />
          </h2>
          <p className="text-slate-500 mt-2">ابحث وتصفح ملايين الكتب في بيئة نظيفة وآمنة وخالية من المحتوى المحظور.</p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="relative w-full">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
        <input
          type="text"
          placeholder="ابحث عن أي كتاب، مؤلف، أو موضوع..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pr-12 pl-28 py-4 outline-none focus:ring-2 focus:ring-emerald-500 text-lg shadow-sm"
        />
        <button 
          type="submit"
          disabled={isLoading}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {isLoading ? <Loader2 size={20} className="animate-spin" /> : 'بحث'}
        </button>
      </form>

      {/* Quick Searches */}
      <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
        {['تطوير الذات والبرمجة', 'الذكاء الاصطناعي', 'التاريخ الإسلامي', 'روايات عالمية', 'علم النفس والفلسفة'].map(term => (
          <button
            key={term}
            onClick={() => {
              setSearchTerm(term);
              if (isSafeContent(term)) fetchBooks(term);
            }}
            type="button"
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-sm font-medium hover:bg-emerald-100 hover:text-emerald-700 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400 transition-colors whitespace-nowrap border border-slate-200 dark:border-slate-700"
          >
            {term}
          </button>
        ))}
      </div>

      {safeModeAlert && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-4 rounded-xl flex items-center gap-3">
          <ShieldAlert size={24} />
          <p className="font-medium">تم حظر عملية البحث. الكلمة المدخلة تحتوي على محتوى غير لائق ومخالف للوضع الآمن.</p>
        </div>
      )}

      {/* Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {books.length > 0 ? (
          books.map(book => {
            const info = book.volumeInfo;
            // Convert to https to avoid mixed content warnings
            const coverUrl = info.imageLinks?.thumbnail?.replace('http:', 'https:') || null;
            
            return (
              <div key={book.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="h-56 bg-slate-100 dark:bg-slate-800 flex items-center justify-center relative overflow-hidden">
                  {coverUrl ? (
                    <img src={coverUrl} alt={info.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="flex flex-col items-center text-slate-400">
                      <FileText size={48} strokeWidth={1} />
                      <span className="text-sm mt-2 font-medium">لا يوجد غلاف</span>
                    </div>
                  )}
                  {info.categories?.[0] && (
                    <div className="absolute top-3 right-3 text-white/90 text-xs font-medium bg-black/60 backdrop-blur-md px-2 py-1 rounded">
                      {info.categories[0]}
                    </div>
                  )}
                </div>
                
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-lg font-bold mb-1 line-clamp-2" title={info.title}>{info.title}</h3>
                  <p className="text-emerald-600 dark:text-emerald-400 text-sm mb-3 font-medium">
                    {info.authors?.join('، ') || 'مؤلف غير معروف'}
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3 mb-4 flex-1">
                    {info.description || 'لا يوجد وصف متاح لهذا الكتاب.'}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-xs text-slate-400 font-medium">
                      {info.pageCount ? `${info.pageCount} صفحة` : ''}
                    </span>
                    <div className="flex gap-2">
                      <a 
                        href={info.previewLink || info.infoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 px-3 py-2 rounded-lg transition-colors font-bold"
                      >
                        <BookOpen size={14} /> تصفح
                      </a>
                      <a 
                        href={book.accessInfo?.pdf?.downloadLink || book.accessInfo?.epub?.downloadLink || info.infoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 px-3 py-2 rounded-lg transition-colors font-bold"
                        title="تنزيل إلى الجهاز"
                      >
                        <Download size={14} /> تنزيل
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : !isLoading ? (
          <div className="col-span-full py-20 text-center text-slate-500 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 border-dashed">
            <BookMarked size={64} className="mx-auto mb-4 opacity-20" />
            <p className="text-xl font-bold mb-2 text-slate-700 dark:text-slate-300">لم يتم العثور على نتائج</p>
            <p className="text-slate-500">جرب البحث بكلمات مختلفة أو اسم مؤلف آخر.</p>
          </div>
        ) : null}
      </div>
      
      {isLoading && books.length === 0 && (
        <div className="flex justify-center items-center py-32">
           <Loader2 size={48} className="animate-spin text-emerald-500" />
        </div>
      )}
    </div>
  );
}
