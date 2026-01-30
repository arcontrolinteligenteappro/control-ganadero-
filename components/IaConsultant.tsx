
import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Mic, MicOff, Send, User, Brain, 
  Globe, WifiOff, ShieldAlert, RefreshCcw, Info, Syringe, Leaf
} from 'lucide-react';
import { getGeneralConsultation } from '../services/geminiService';

const IaConsultant: React.FC = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string; id: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);
    return () => {
      window.removeEventListener('online', handleStatus);
      window.removeEventListener('offline', handleStatus);
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!query.trim() || isLoading) return;
    const userMsg = { role: 'user' as const, content: query, id: Date.now().toString() };
    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    if (!isOnline) {
      setMessages(prev => [...prev, { role: 'ai' as const, content: "🚨 ERROR: Se requiere conexión a Internet para procesar consultas avanzadas mediante Gemini IA.", id: (Date.now() + 1).toString() }]);
      return;
    }
    setIsLoading(true);
    try {
      const response = await getGeneralConsultation(query);
      setMessages(prev => [...prev, { role: 'ai' as const, content: response, id: (Date.now() + 1).toString() }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai' as const, content: "Error de comunicación con el motor de inteligencia.", id: (Date.now() + 1).toString() }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
           <div className="p-3 bg-amber-600 text-white rounded-2xl shadow-lg shadow-amber-900/40"><Sparkles size={20} /></div>
           <div>
             <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">Consultor Ganadero IA</h2>
             <p className="text-slate-500 font-bold text-[10px] italic mt-1">Powered by Gemini 3.1 Advanced Engine</p>
           </div>
        </div>
        <div className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border flex items-center gap-2 ${isOnline ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100 animate-pulse'}`}>
           {isOnline ? <Globe size={12} /> : <WifiOff size={12} />}
           {isOnline ? 'Core Online' : 'Core Offline'}
        </div>
      </div>

      <div className="flex-1 bg-white rounded-[32px] border border-slate-200 shadow-sm flex flex-col overflow-hidden relative">
         <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar bg-[radial-gradient(#f1f5f9_1.5px,transparent_1.5px)] [background-size:32px_32px]">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-8 py-10">
                 <div className="w-20 h-20 bg-slate-900 rounded-[28px] flex items-center justify-center text-amber-500 shadow-2xl relative">
                    <Brain size={40} className="z-10" />
                    <div className="absolute inset-0 bg-amber-500 rounded-[28px] blur-2xl opacity-20 animate-pulse"></div>
                 </div>
                 <div className="max-w-md space-y-2">
                    <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter leading-none">Terminal de Consultoría Técnica</h3>
                    <p className="text-slate-400 font-bold text-[9px] uppercase tracking-[0.2em] leading-relaxed italic px-4">Resolución de dudas sobre sanidad, manejo, raciones y análisis de mercado cárnico.</p>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-lg">
                    {[
                      { icon: <Syringe size={16} className="text-red-500" />, t: "Fármacos", q: "¿Dosis de Oxitetraciclina para becerros?" },
                      { icon: <Leaf size={16} className="text-emerald-500" />, t: "Pasturas", q: "¿Carga animal recomendada para Brizantha?" },
                    ].map((item, i) => (
                      <button key={i} onClick={() => setQuery(item.q)} className="p-4 bg-white hover:bg-slate-50 border-2 border-slate-100 rounded-2xl transition-all text-left flex items-center gap-4 hover:shadow-lg active:scale-95">
                         <div className="p-2.5 bg-slate-50 rounded-xl group-hover:scale-110 transition-transform">{item.icon}</div>
                         <span className="font-black text-[9px] uppercase tracking-widest text-slate-600">{item.t}</span>
                      </button>
                    ))}
                 </div>
              </div>
            )}
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-3`}>
                <div className={`max-w-[80%] flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-md ${m.role === 'user' ? 'bg-amber-600 text-white' : 'bg-slate-900 text-white border border-white/10'}`}>
                    {m.role === 'user' ? <User size={16} /> : <Sparkles size={16} />}
                  </div>
                  <div className={`p-5 rounded-2xl text-xs font-medium leading-relaxed shadow-sm ${m.role === 'user' ? 'bg-amber-50 text-amber-900 border border-amber-100 rounded-tr-none' : 'bg-slate-50 text-slate-800 border border-slate-200 rounded-tl-none shadow-slate-200/50'}`}>
                    {m.content.split('\n').map((line, i) => <p key={i} className={i > 0 ? "mt-2" : ""}>{line}</p>)}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start animate-in fade-in">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-amber-500"><Sparkles size={16} className="animate-spin" /></div>
                  <div className="bg-slate-100 h-10 w-24 rounded-2xl flex items-center justify-center space-x-1.5 border border-slate-200">
                     <div className="w-1 h-1 bg-amber-500 rounded-full animate-bounce"></div>
                     <div className="w-1 h-1 bg-amber-600 rounded-full animate-bounce delay-100"></div>
                     <div className="w-1 h-1 bg-amber-700 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
         </div>

         <div className="p-6 bg-slate-50 border-t border-slate-200 relative z-20">
            <div className="max-w-3xl mx-auto relative">
               <textarea 
                rows={1}
                disabled={isLoading || !isOnline}
                placeholder={isOnline ? "Instrucción o consulta técnica..." : "⚠️ Error: Nodo Offline..."} 
                className="w-full pl-6 pr-24 py-4 bg-white border-2 border-slate-200 rounded-2xl font-bold text-xs outline-none focus:ring-4 focus:ring-amber-500/5 focus:border-amber-500 transition-all shadow-lg resize-none disabled:bg-slate-50"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
               />
               <button 
                disabled={!query.trim() || isLoading || !isOnline}
                onClick={handleSend}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-slate-900 text-white rounded-xl hover:bg-black disabled:opacity-30 transition-all shadow-xl active:scale-95"
               >
                <Send size={18} />
               </button>
            </div>
            <p className="text-center text-[7px] font-black text-slate-400 uppercase tracking-[0.4em] mt-4 font-mono">
              AR_SYSTEM_CORE :: Gemini_Pro_v3.1 :: ENCRYPTED_LINK
            </p>
         </div>
      </div>
    </div>
  );
};

export default IaConsultant;
