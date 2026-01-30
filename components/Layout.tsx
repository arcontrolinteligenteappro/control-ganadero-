
import React, { useState, useEffect } from 'react';
import { NAV_ITEMS } from '../constants';
import { 
  Menu, X, Bell, User, Search, Terminal, Moon, Sun, 
  Calculator, Ruler, Notebook, Calendar, ArrowRightLeft,
  Settings
} from 'lucide-react';
import QuickTools from './QuickTools';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, theme, toggleTheme }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFloatingOpen, setIsFloatingOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<any>(null);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const fullText = "Desarrollado por ChrisRey91 – www.arcontrolinteligente.com";

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const handleType = () => {
      setDisplayText(prev => {
        if (!isDeleting) {
          if (prev.length < fullText.length) return fullText.slice(0, prev.length + 1);
          timeout = setTimeout(() => setIsDeleting(true), 4000);
          return prev;
        } else {
          if (prev.length > 0) return fullText.slice(0, prev.length - 1);
          setIsDeleting(false);
          return "";
        }
      });
    };
    timeout = setTimeout(handleType, isDeleting ? 20 : 50);
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting]);

  return (
    <div className={`min-h-screen flex flex-col md:flex-row overflow-hidden transition-colors duration-500 ${theme === 'dark' ? 'bg-[#050807] text-[#10b981]' : 'bg-[#fdfbf7] text-slate-800'}`}>
      <QuickTools activeTool={activeTool} onClose={() => setActiveTool(null)} />
      {theme === 'dark' && <div className="scanline"></div>}

      <aside className={`fixed inset-y-0 left-0 z-[150] w-64 transition-all duration-500 border-r ${theme === 'dark' ? 'bg-[#0a0f0d] border-[#10b981]/20' : 'bg-[#1a2421] border-white/5'} ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 flex flex-col`}>
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-2xl ${theme === 'dark' ? 'bg-[#10b981] text-black shadow-[#10b981]/30' : 'bg-amber-600 text-white shadow-amber-900/40'}`}>
              <span className="font-black text-2xl italic">AR</span>
            </div>
            <div>
              <h1 className={`font-black text-base tracking-tighter uppercase leading-none ${theme === 'dark' ? 'glitch-text text-[#10b981]' : 'text-white'}`}>AR CONTROL</h1>
              <p className="text-[8px] font-black uppercase tracking-[0.2em] mt-1 text-emerald-500">GANADERO PRO</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 mt-6 px-4 space-y-2 overflow-y-auto scrollbar-hide">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group ${activeTab === item.id ? (theme === 'dark' ? 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30 shadow-lg shadow-emerald-900/10' : 'bg-amber-600 text-white shadow-xl shadow-amber-900/20') : (theme === 'dark' ? 'text-[#065f46] hover:bg-[#10b981]/5 hover:text-[#10b981]' : 'text-slate-400 hover:bg-white/5 hover:text-white')}`}
            >
              <span className={`transition-transform duration-300 ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>{item.icon}</span>
              <span className="font-black text-[11px] uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
          <button
            onClick={() => { setActiveTab('settings'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group ${activeTab === 'settings' ? (theme === 'dark' ? 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30 shadow-lg shadow-emerald-900/10' : 'bg-amber-600 text-white shadow-xl shadow-amber-900/20') : (theme === 'dark' ? 'text-[#065f46] hover:bg-[#10b981]/5 hover:text-[#10b981]' : 'text-slate-400 hover:bg-white/5 hover:text-white')}`}
          >
            <Settings size={20} />
            <span className="font-black text-[11px] uppercase tracking-widest">Ajustes</span>
          </button>
        </nav>
        
        <div className="p-4 space-y-2 border-t border-white/5">
           <button onClick={toggleTheme} className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 transition-all ${theme === 'dark' ? 'bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20 hover:bg-[#10b981]/20' : 'bg-white/10 text-white border border-white/10 hover:bg-white/20'}`}>
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              <span className="text-[9px] font-black uppercase tracking-widest">{theme === 'dark' ? 'Interfaz Institucional' : 'Interfaz Hacker'}</span>
           </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className={`hidden md:flex border-b px-8 py-4 justify-between items-center z-[100] backdrop-blur-3xl ${theme === 'dark' ? 'bg-[#0a0f0d]/80 border-[#10b981]/20' : 'bg-white/80 border-slate-200'}`}>
          <div className="flex items-center gap-4">
             <div className={`px-4 py-2 rounded-xl border flex items-center gap-3 ${theme === 'dark' ? 'bg-[#10b981]/5 border-[#10b981]/20' : 'bg-slate-50 border-slate-200'}`}>
                <Terminal size={12} className={theme === 'dark' ? 'text-[#10b981]' : 'text-amber-600'} />
                <span className={`text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-[#10b981] font-mono' : 'text-slate-400'}`}>SISTEMA_GANADERO::EXEC_{activeTab.toUpperCase()}</span>
             </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="relative group">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-[#10b981]/40' : 'text-slate-300'}`} size={14} />
                <input type="text" placeholder="Terminal command..." className={`w-48 pl-10 pr-4 py-2.5 rounded-2xl text-[10px] font-bold outline-none transition-all ${theme === 'dark' ? 'bg-[#10b981]/5 border border-[#10b981]/20 text-[#10b981] focus:w-64' : 'bg-slate-100 focus:bg-white focus:ring-4 focus:ring-amber-500/10'}`} />
             </div>
             <button className={`p-3 rounded-2xl border transition-all ${theme === 'dark' ? 'bg-[#10b981]/5 border-[#10b981]/20 text-[#10b981]' : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-amber-600'}`}><Bell size={18} /></button>
             <div className={`h-8 w-px ${theme === 'dark' ? 'bg-white/10' : 'bg-slate-200'}`}></div>
             <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${theme === 'dark' ? 'bg-[#10b981] text-black shadow-lg shadow-emerald-500/20' : 'bg-slate-900 text-amber-500 shadow-lg'}`}><User size={18} /></div>
                <div className="hidden lg:block text-left">
                   <p className={`text-[10px] font-black uppercase leading-none mb-0.5 ${theme === 'dark' ? 'text-[#10b981]' : 'text-slate-900'}`}>Master Admin</p>
                   <p className="text-[8px] font-bold text-emerald-500 leading-none tracking-widest">STATUS::ONLINE</p>
                </div>
             </div>
          </div>
        </header>

        <header className={`md:hidden p-5 flex justify-between items-center z-[140] shadow-xl ${theme === 'dark' ? 'bg-[#0a0f0d] border-b border-[#10b981]/20' : 'bg-[#1a2421] text-white'}`}>
           <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${theme === 'dark' ? 'bg-[#10b981] text-black' : 'bg-amber-600 shadow-xl'}`}>
                 <span className="font-black text-xl italic">AR</span>
              </div>
              <h1 className={`font-black text-sm tracking-tighter uppercase ${theme === 'dark' ? 'text-[#10b981]' : 'text-white'}`}>AR GANADERO</h1>
           </div>
           <button onClick={() => setIsSidebarOpen(true)} className={`p-3 rounded-xl active:scale-75 transition-all ${theme === 'dark' ? 'bg-[#10b981]/10 text-[#10b981]' : 'bg-amber-600 text-white'}`}>
              <Menu size={20} />
           </button>
        </header>

        <div className={`flex-1 overflow-y-auto p-6 transition-colors duration-500 ${theme === 'dark' ? 'bg-[#050807]' : 'bg-[#fdfbf7]'}`}>
          {children}
        </div>

        <footer className={`fixed bottom-0 left-0 md:left-64 right-0 border-t z-[130] py-2 px-10 flex justify-center backdrop-blur-md ${theme === 'dark' ? 'bg-[#0a0f0d]/90 border-[#10b981]/20 text-[#10b981]' : 'bg-white/90 border-slate-100 text-slate-400'}`}>
           <p className={`font-mono text-[9px] font-black uppercase tracking-[0.2em] writing-animation ${theme === 'dark' ? 'shadow-glow' : ''}`}>{displayText}</p>
        </footer>

        {/* BOTÓN FLOTANTE "AR" MAESTRO RECONSTRUIDO (SIN OCR NI DICCIONARIO) */}
        <div className="fixed bottom-14 right-8 z-[280] flex flex-col items-end gap-3">
           {isFloatingOpen && (
             <div className="flex flex-col gap-3 mb-3 animate-in slide-in-from-bottom-10 fade-in duration-500">
                {[
                  { id: 'calc', icon: <Calculator size={22} />, label: 'Calculadora Pro', color: theme === 'dark' ? 'bg-[#0f1715] text-[#10b981] border-[#10b981]/30 hover:bg-[#10b981] hover:text-black' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-900 hover:text-white' },
                  { id: 'conv', icon: <ArrowRightLeft size={22} />, label: 'Conversor Técnico', color: theme === 'dark' ? 'bg-[#0f1715] text-[#10b981] border-[#10b981]/30 hover:bg-[#10b981] hover:text-black' : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-600 hover:text-white' },
                  { id: 'notes', icon: <Notebook size={22} />, label: 'Notas Rápidas', color: theme === 'dark' ? 'bg-[#0f1715] text-[#10b981] border-[#10b981]/30 hover:bg-[#10b981] hover:text-black' : 'bg-white text-slate-700 border-slate-200 hover:bg-amber-600 hover:text-white' },
                  { id: 'calendar_mini', icon: <Calendar size={22} />, label: 'Calendario', color: theme === 'dark' ? 'bg-[#0f1715] text-[#10b981] border-[#10b981]/30 hover:bg-[#10b981] hover:text-black' : 'bg-white text-slate-700 border-slate-200 hover:bg-blue-600 hover:text-white' },
                ].map((tool) => (
                  <button 
                    key={tool.id}
                    onClick={() => { setActiveTool(tool.id); setIsFloatingOpen(false); }}
                    className={`flex items-center gap-4 px-6 py-4 rounded-[28px] shadow-2xl border transition-all hover:scale-105 active:scale-90 group ${tool.color}`}
                  >
                    <span className="shrink-0">{tool.icon}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">{tool.label}</span>
                  </button>
                ))}
             </div>
           )}
           <button 
            onClick={() => setIsFloatingOpen(!isFloatingOpen)}
            className={`w-20 h-20 rounded-[32px] shadow-2xl flex flex-col items-center justify-center transition-all hover:scale-110 active:scale-75 relative overflow-hidden float-anim ${theme === 'dark' ? 'bg-[#10b981] text-black border-4 border-[#10b981]/50' : 'bg-amber-600 text-white shadow-amber-600/30'}`}
           >
              {isFloatingOpen ? <X size={32} /> : (
                <>
                  <span className="text-3xl font-black italic tracking-tighter z-10 leading-none">AR</span>
                  <span className="text-[8px] font-black uppercase tracking-widest z-10 opacity-70 mt-1">Tools</span>
                </>
              )}
           </button>
        </div>
      </main>
      <style>{`.shadow-glow { text-shadow: 0 0 10px rgba(16, 185, 129, 0.5); }`}</style>
    </div>
  );
};

export default Layout;
