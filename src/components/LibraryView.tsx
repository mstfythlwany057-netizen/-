import React, { useState, useEffect } from 'react';
import { BookMarked, Search, FileText, Loader2, BookOpen, Download } from 'lucide-react';

const EDUCATIONAL_BOOKS = [
  // ثانوية عامة
  {
    id: 'edu-eg-thanawya-arabic',
    volumeInfo: {
      title: 'اللغة العربية - الصف الثالث الثانوي العام',
      authors: ['وزارة التربية والتعليم المصرية'],
      description: 'المنهج الرسمي للغة العربية للثانوية العامة: النحو، الصرف، البلاغة، الأدب والنصوص، والقراءة.',
      pageCount: 350,
      categories: ['ثانوية عامة', 'مناهج مصرية', 'لغة عربية'],
      infoLink: '#',
    }
  },
  {
    id: 'edu-eg-thanawya-physics',
    volumeInfo: {
      title: 'الفيزياء - الصف الثالث الثانوي العام',
      authors: ['وزارة التربية والتعليم المصرية'],
      description: 'منهج الفيزياء للثانوية العامة: الكهربية والتيار المتردد، والفيزياء الحديثة (ميكانيكا الكم والفيزياء الذرية).',
      pageCount: 420,
      categories: ['ثانوية عامة', 'مناهج مصرية', 'فيزياء'],
      infoLink: '#',
    }
  },
  {
    id: 'edu-eg-thanawya-math-pure',
    volumeInfo: {
      title: 'الرياضيات البحتة (التفاضل والتكامل) - ثانوية عامة',
      authors: ['وزارة التربية والتعليم المصرية'],
      description: 'كتاب الرياضيات البحتة (التفاضل والتكامل) لطلاب الصف الثالث الثانوي (علمي رياضة).',
      pageCount: 290,
      categories: ['ثانوية عامة', 'مناهج مصرية', 'رياضيات'],
      infoLink: '#',
    }
  },
  {
    id: 'edu-eg-thanawya-history',
    volumeInfo: {
      title: 'التاريخ - الصف الثالث الثانوي (أدبي)',
      authors: ['وزارة التربية والتعليم المصرية'],
      description: 'تاريخ مصر الحديث والمعاصر، وتاريخ العرب الحديث للثانوية العامة (القسم الأدبي).',
      pageCount: 310,
      categories: ['ثانوية عامة', 'مناهج مصرية', 'تاريخ'],
      infoLink: '#',
    }
  },
  // ثانوية أزهرية
  {
    id: 'edu-azhar-fiqh',
    volumeInfo: {
      title: 'الفقه المذهبي - ثانوية أزهرية',
      authors: ['قطاع المعاهد الأزهرية'],
      description: 'كتاب الفقه المقرر على طلاب الصف الثالث الثانوي الأزهري (القسمين العلمي والأدبي).',
      pageCount: 450,
      categories: ['ثانوية أزهرية', 'مناهج مصرية', 'علوم شرعية'],
      infoLink: '#',
    }
  },
  {
    id: 'edu-azhar-quran',
    volumeInfo: {
      title: 'القرآن الكريم والتجويد - ثانوية أزهرية',
      authors: ['قطاع المعاهد الأزهرية'],
      description: 'مقرر القرآن الكريم وأحكام التجويد لطلاب المرحلة الثانوية الأزهرية.',
      pageCount: 604,
      categories: ['ثانوية أزهرية', 'مناهج مصرية', 'قرآن كريم'],
      infoLink: '#',
    }
  },
  {
    id: 'edu-azhar-hadith',
    volumeInfo: {
      title: 'الحديث الشريف - ثانوية أزهرية',
      authors: ['قطاع المعاهد الأزهرية'],
      description: 'الأحاديث النبوية المقررة وشرحها لطلاب الثانوية الأزهرية.',
      pageCount: 220,
      categories: ['ثانوية أزهرية', 'مناهج مصرية', 'علوم شرعية'],
      infoLink: '#',
    }
  },
  // مراحل نقل وإعدادي
  {
    id: 'edu-eg-prep-science',
    volumeInfo: {
      title: 'العلوم - الصف الثالث الإعدادي',
      authors: ['وزارة التربية والتعليم المصرية'],
      description: 'منهج العلوم للشهادة الإعدادية: التفاعلات الكيميائية، الطاقة الفيزيائية، والجينات الوراثية.',
      pageCount: 180,
      categories: ['إعدادي', 'مناهج مصرية', 'علوم'],
      infoLink: '#',
    }
  },
  {
    id: 'edu-eg-primary-arabic',
    volumeInfo: {
      title: 'اللغة العربية (تواصل) - المرحلة الابتدائية',
      authors: ['وزارة التربية والتعليم المصرية'],
      description: 'منهج اللغة العربية الجديد للمرحلة الابتدائية في مصر.',
      pageCount: 150,
      categories: ['ابتدائي', 'مناهج مصرية', 'لغة عربية'],
      infoLink: '#',
    }
  },
  // جامعات
  {
    id: 'edu-uni-anatomy',
    volumeInfo: {
      title: 'أساسيات علم التشريح البشري',
      authors: ['نخبة من أساتذة كليات الطب'],
      description: 'المرجع الأساسي لطلاب كليات الطب والصيدلة في الجامعات المصرية.',
      pageCount: 850,
      categories: ['جامعات', 'بكالوريا', 'طب'],
      infoLink: '#',
    }
  },
  {
    id: 'edu-uni-engineering',
    volumeInfo: {
      title: 'مقدمة في الهندسة الإنشائية',
      authors: ['أساتذة كلية الهندسة'],
      description: 'كتاب تمهيدي لطلاب كليات الهندسة - قسم مدني.',
      pageCount: 520,
      categories: ['جامعات', 'بكالوريا', 'هندسة'],
      infoLink: '#',
    }
  }
];

export default function LibraryView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [books, setBooks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEducationalSearch, setIsEducationalSearch] = useState(false);

  const fetchBooks = async (query: string, eduSearch: boolean = false) => {
    setIsLoading(true);
    try {
      let apiQuery = query;
      if (eduSearch && !apiQuery.includes('منهج') && !apiQuery.includes('مدرسي')) {
        apiQuery = `${query} كتاب مدرسي منهج تعليمي`;
      }

      // Using Google Books API to fetch books from around the world
      const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(apiQuery)}&maxResults=24`);
      const data = await res.json();
      
      let fetchedItems = data.items || [];

      // Fallback for empty results: try broader search
      if (fetchedItems.length === 0) {
        const words = apiQuery.split(' ').filter(w => w.length > 2);
        if (words.length > 1) {
          const broaderQuery = words.join('+');
          const fallbackRes = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(broaderQuery)}&maxResults=24`);
          const fallbackData = await fallbackRes.json();
          fetchedItems = fallbackData.items || [];
        }
      }

      // Inject local educational curriculums if relevant
      const qLower = query.toLowerCase();
      const isCurriculumSearch = eduSearch || qLower.includes('منهج') || qLower.includes('دراسي') || qLower.includes('تعليم') || qLower.includes('مناهج');

      
      const localMatches = EDUCATIONAL_BOOKS.filter(book => 
        isCurriculumSearch ||
        book.volumeInfo.title.toLowerCase().includes(qLower) ||
        book.volumeInfo.categories.some(c => c.toLowerCase().includes(qLower)) ||
        book.volumeInfo.description.toLowerCase().includes(qLower)
      );

      // Combine local matches and fetched items
      let combined = [...localMatches, ...fetchedItems];
      
      // Remove duplicates
      combined = Array.from(new Map(combined.map(item => [item.id, item])).values());

      setBooks(combined);
    } catch (error) {
      console.error("Error fetching books:", error);
      // Fallback to local books on error
      const qLower = query.toLowerCase();
      const localMatches = EDUCATIONAL_BOOKS.filter(book => book.volumeInfo.title.toLowerCase().includes(qLower));
      setBooks(localMatches);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch some interesting books by default
  useEffect(() => {
    fetchBooks('ثانوية عامة مصرية أزهرية');
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      fetchBooks(searchTerm, isEducationalSearch);
    } else {
      fetchBooks('ثانوية عامة مصرية أزهرية', isEducationalSearch);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <BookMarked className="text-emerald-500" size={32} />
            المكتبة العالمية
          </h2>
          <p className="text-slate-500 mt-2">ابحث وتصفح ملايين الكتب من جميع أنحاء العالم في كافة التخصصات.</p>
        </div>
      </div>

      <div>
        <form onSubmit={handleSearch} className="relative w-full mb-3">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
          <input
            type="text"
            placeholder="ابحث عن أي كتاب، مؤلف، أو موضوع في العالم..."
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
        <div className="flex items-center gap-2 px-2">
          <input 
            type="checkbox" 
            id="edu-search"
            checked={isEducationalSearch}
            onChange={(e) => setIsEducationalSearch(e.target.checked)}
            className="w-4 h-4 text-emerald-600 bg-slate-100 border-slate-300 rounded focus:ring-emerald-500 dark:focus:ring-emerald-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600"
          />
          <label htmlFor="edu-search" className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
            تخصيص البحث في المناهج والنظم التعليمية (الكتب والمقررات الدراسية)
          </label>
        </div>
      </div>

      {/* Quick Searches */}
      <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
        {['ثانوية عامة', 'ثانوية أزهرية', 'مناهج مصرية', 'جامعات وبكالوريا', 'روايات عالمية'].map(term => (
           <button
             key={term}
             onClick={() => {
               setSearchTerm(term);
               fetchBooks(term, isEducationalSearch);
             }}
             type="button"
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-sm font-medium hover:bg-emerald-100 hover:text-emerald-700 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400 transition-colors whitespace-nowrap border border-slate-200 dark:border-slate-700"
          >
            {term}
          </button>
        ))}
      </div>

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
