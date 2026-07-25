import React, { useState } from 'react';
import { BookMarked, Download, Search, FileText } from 'lucide-react';

const STATIC_BOOKS = [
  {
    id: '1',
    title: 'أساسيات الفيزياء',
    category: 'العلوم',
    author: 'أ. ديفيد هاليدي',
    pages: 450,
    coverColor: 'bg-blue-500',
    description: 'كتاب شامل يغطي أساسيات الميكانيكا والحرارة والموجات.',
    url: '#', // In a real app, this would be a link to a PDF
  },
  {
    id: '2',
    title: 'مقدمة في الخوارزميات',
    category: 'علوم الحاسب',
    author: 'توماس كورمن',
    pages: 1312,
    coverColor: 'bg-emerald-600',
    description: 'المرجع الأساسي لتعلم الخوارزميات وهياكل البيانات.',
    url: '#',
  },
  {
    id: '3',
    title: 'تاريخ العالم الحديث',
    category: 'التاريخ',
    author: 'بالمر وكولتون',
    pages: 800,
    coverColor: 'bg-amber-600',
    description: 'نظرة شاملة على الأحداث التاريخية منذ النهضة وحتى العصر الحديث.',
    url: '#',
  },
  {
    id: '4',
    title: 'الرياضيات المتقدمة',
    category: 'الرياضيات',
    author: 'د. جورج توماس',
    pages: 650,
    coverColor: 'bg-indigo-500',
    description: 'شرح مفصل للتفاضل والتكامل والهندسة التحليلية.',
    url: '#',
  },
  {
    id: '5',
    title: 'قواعد اللغة العربية',
    category: 'اللغات',
    author: 'أحمد الهاشمي',
    pages: 320,
    coverColor: 'bg-rose-500',
    description: 'شرح مبسط ووافٍ لقواعد النحو والصرف.',
    url: '#',
  },
  {
    id: '6',
    title: 'علم النفس الإدراكي',
    category: 'علم النفس',
    author: 'روبرت ستيرنبرغ',
    pages: 540,
    coverColor: 'bg-purple-500',
    description: 'دراسة لكيفية تفكير الإنسان، تعلمه، وتذكره للأشياء.',
    url: '#',
  }
];

export default function LibraryView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');

  const categories = ['الكل', ...Array.from(new Set(STATIC_BOOKS.map(b => b.category)))];

  const filteredBooks = STATIC_BOOKS.filter(book => {
    const matchesSearch = book.title.includes(searchTerm) || book.author.includes(searchTerm);
    const matchesCategory = selectedCategory === 'الكل' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDownload = (bookTitle: string) => {
    // In a real application, this would trigger a file download.
    alert(`بدأ تحميل كتاب: ${bookTitle} بصيغة PDF`);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <BookMarked className="text-emerald-500" size={32} />
            المكتبة الدراسية
          </h2>
          <p className="text-slate-500 mt-2">تصفح وحمل الكتب والمراجع بصيغة PDF لمساعدتك في المذاكرة.</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="ابحث عن كتاب أو مؤلف..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pr-10 pl-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl whitespace-nowrap font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.length > 0 ? (
          filteredBooks.map(book => (
            <div key={book.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
              {/* Book Cover Placeholder */}
              <div className={`h-40 ${book.coverColor} flex items-center justify-center relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/10 mix-blend-multiply"></div>
                <FileText size={64} className="text-white/80" strokeWidth={1} />
                <div className="absolute bottom-2 right-3 text-white/90 text-sm font-medium bg-black/20 px-2 py-1 rounded">
                  {book.category}
                </div>
              </div>
              
              {/* Book Info */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-xl font-bold mb-1 line-clamp-1" title={book.title}>{book.title}</h3>
                <p className="text-slate-500 text-sm mb-3">{book.author}</p>
                <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-4 flex-1">
                  {book.description}
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-xs text-slate-400 font-medium">{book.pages} صفحة</span>
                  <button 
                    onClick={() => handleDownload(book.title)}
                    className="flex items-center gap-2 text-sm bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 px-3 py-2 rounded-lg transition-colors font-medium"
                  >
                    <Download size={16} /> تحميل PDF
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-slate-500 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <BookMarked size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg">لم يتم العثور على كتب مطابقة لبحثك.</p>
          </div>
        )}
      </div>
    </div>
  );
}
