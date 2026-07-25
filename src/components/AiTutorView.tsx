import React, { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, Loader2, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage } from '../types';
import { v4 as uuidv4 } from 'uuid';

export default function AiTutorView() {
  const [messages, setMessages] = useState<ChatMessage[]>([{
    id: '1',
    role: 'model',
    content: 'عامل ايه يا برو انا معاك لحد ما تحقق حلمك، عايز تبدا منين؟'
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAttachedImage(event.target?.result as string);
        setMimeType(file.type);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !attachedImage) return;

    const userMsg: ChatMessage = {
      id: uuidv4(),
      role: 'user',
      content: input,
      imageUrl: attachedImage || undefined
    };

    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    const currentImg = attachedImage;
    const currentMime = mimeType;
    
    setInput('');
    setAttachedImage(null);
    setMimeType(null);
    setIsLoading(true);

    try {
      let res;
      if (currentImg) {
        res = await fetch('/api/analyze-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: currentInput, imageBase64: currentImg, mimeType: currentMime })
        });
      } else {
        res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: currentInput, history: messages })
        });
      }
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setMessages(prev => [...prev, {
        id: uuidv4(),
        role: 'model',
        content: data.result
      }]);
    } catch (err: any) {
      setMessages(prev => [...prev, {
        id: uuidv4(),
        role: 'model',
        content: 'عذراً، حدث خطأ أثناء الاتصال بالخادم: ' + err.message
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] md:h-[calc(100vh-6rem)]">
      <h2 className="text-3xl font-bold mb-4 shrink-0">المعلم الذكي</h2>
      
      <div className="flex-1 overflow-y-auto bg-white dark:bg-slate-900 rounded-t-2xl border border-b-0 border-slate-200 dark:border-slate-800 p-4 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} group`}>
            <div className={`max-w-[85%] md:max-w-[70%] p-4 rounded-2xl relative ${msg.role === 'user' ? 'bg-emerald-600 text-white rounded-tl-sm' : 'bg-slate-100 dark:bg-slate-800 rounded-tr-sm'}`}>
              <button 
                onClick={() => handleCopy(msg.content, msg.id)}
                className={`absolute top-2 left-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity ${msg.role === 'user' ? 'bg-emerald-700/50 hover:bg-emerald-700' : 'bg-slate-200/50 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                title="نسخ النص"
              >
                {copiedId === msg.id ? <Check size={16} /> : <Copy size={16} />}
              </button>
              {msg.imageUrl && (
                <img src={msg.imageUrl} alt="مرفق" className="max-w-full rounded-lg mb-3 object-cover max-h-64" />
              )}
              <div className={`prose ${msg.role === 'user' ? 'prose-invert' : 'dark:prose-invert'} max-w-none text-sm md:text-base leading-relaxed mt-2`}>
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl rounded-tr-sm flex items-center gap-2">
              <Loader2 className="animate-spin text-emerald-600" size={20} />
              <span className="text-slate-500 text-sm">جاري التفكير...</span>
            </div>
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-b-2xl border border-slate-200 dark:border-slate-800 shrink-0">
        {attachedImage && (
          <div className="relative inline-block mb-3">
            <img src={attachedImage} alt="Preview" className="h-20 rounded-lg border border-slate-300" />
            <button onClick={() => setAttachedImage(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600">✕</button>
          </div>
        )}
        <form onSubmit={handleSend} className="flex items-end gap-2">
          <button 
            type="button" 
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-slate-500 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors shrink-0"
            title="إرفاق صورة"
          >
            <ImageIcon size={24} />
          </button>
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
          />
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="اسأل معلمك الذكي لطلب حلول الواجبات، الأكواد، أو المساعدة الدراسية..."
            className="flex-1 resize-none bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-emerald-500 max-h-32 min-h-[52px]"
            rows={input.split('\n').length > 1 ? Math.min(input.split('\n').length, 4) : 1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend(e);
              }
            }}
          />
          <button 
            type="submit" 
            disabled={(!input.trim() && !attachedImage) || isLoading}
            className="p-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:hover:bg-emerald-600 text-white rounded-xl transition-colors shrink-0 flex items-center justify-center"
          >
            <Send size={24} className={document.documentElement.dir === 'rtl' ? 'rotate-180' : ''} />
          </button>
        </form>
      </div>
    </div>
  );
}
