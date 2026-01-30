
import React, { useState, useEffect } from 'react';
import { NAV_ITEMS } from '../constants';
// FIX: Added Wallet to lucide-react imports
import { 
  Menu, X, Bell, User, Search, Terminal, Moon, Sun, 
  Calculator, Notebook, Calendar, ArrowRightLeft,
  Settings, ShieldAlert, Wifi, Info, Activity, ShieldCheck, Wallet
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
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<any>(null);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const fullText = "Ingeniería Ganadera Inteligente – www.arcontrolinteligente.com";

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const handleType = () => {
      setDisplayText(prev => {
        if (!isDeleting) {
          if (prev.length < fullText.length) return fullText.slice(0, prev.length + 1);
          timeout = setTimeout(() => setIsDeleting(true), 5000);
          return prev;
        } else {
          if (prev.length > 0) return fullText.slice(0, prev.length - 1);
          setIsDeleting(false);
          return "";
        }
      });
    };
    timeout = setTimeout(handleType, isDeleting ? 30 : 60);
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting]);

  return (
    <div className={`min-h-screen flex flex-col md:flex-row overflow-hidden transition-colors duration-700 ${theme === 'dark' ? 'bg-[#050807] text-[#10b981]' : 'bg-[#fdfbf7] text-slate-800'}`}>
      <QuickTools activeTool={activeTool} onClose={() => setActiveTool(null)} />
      {theme === 'dark' && <div className="scanline"></div>}

      <aside className={`fixed inset-y-0 left-0 z-[150] w-64 transition-all duration-500 border-r ${theme === 'dark' ? 'bg-[#0a0f0d] border-[#10b981]/20' : 'bg-[#1a2421] border-white/5 shadow-2xl'} ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 flex flex-col`}>
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-transform hover:rotate-6 ${theme === 'dark' ? 'bg-[#10b981] text-black shadow-[#10b981]/30' : 'bg-amber-600 text-white shadow-amber-900/40'}`}>
              <span className="font-black text-3xl italic">AR</span>
            </div>
            <div>
              <h1 className={`font-black text-lg tracking-tighter uppercase leading-none ${theme === 'dark' ? 'glitch-text text-[#10b981]' : 'text-white'}`}>AR CONTROL</h1>
              <p className="text-[8px] font-black uppercase tracking-[0.3em] mt-1.5 text-emerald-500">PECUARIO PRO</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 mt-8 px-5 space-y-2.5 overflow-y-auto scrollbar-hide">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-[22px] transition-all group relative overflow-hidden ${activeTab === item.id ? (theme === 'dark' ? 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30 shadow-lg' : 'bg-amber-600 text-white shadow-xl') : (theme === 'dark' ? 'text-[#065f46] hover:bg-[#10b981]/10 hover:text-[#10b981]' : 'text-slate-400 hover:bg-white/5 hover:text-white')}`}
            >
              <span className={`transition-transform duration-500 ${activeTab === item.id ? 'scale-125' : 'group-hover:scale-110'}`}>{item.icon}</span>
              <span className="font-black text-[11px] uppercase tracking-widest">{item.label}</span>
              {activeTab === item.id && <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>}
            </button>
          ))}
          <button
            onClick={() => { setActiveTab('settings'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-[22px] transition-all group ${activeTab === 'settings' ? (theme === 'dark' ? 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30 shadow-lg' : 'bg-amber-600 text-white shadow-xl') : (theme === 'dark' ? 'text-[#065f46] hover:bg-[#10b981]/10 hover:text-[#10b981]' : 'text-slate-400 hover:bg-white/5 hover:text-white')}`}
          >
            <Settings size={20} />
            <span className="font-black text-[11px] uppercase tracking-widest">Ajustes</span>
          </button>
        </nav>
        
        <div className="p-5 border-t border-white/5">
           <button onClick={toggleTheme} className={`w-full py-5 rounded-3xl flex items-center justify-center gap-3 transition-all active:scale-95 ${theme === 'dark' ? 'bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20' : 'bg-white/10 text-white border border-white/10 hover:bg-white/20'}`}>
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              <span className="text-[10px] font-black uppercase tracking-widest">{theme === 'dark' ? 'Interfaz Rancho' : 'Interfaz Hacker'}</span>
           </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className={`hidden md:flex border-b px-10 py-5 justify-between items-center z-[100] backdrop-blur-3xl ${theme === 'dark' ? 'bg-[#0a0f0d]/90 border-[#10b981]/20' : 'bg-white/90 border-slate-200'}`}>
          <div className="flex items-center gap-6">
             <div className={`px-5 py-2.5 rounded-2xl border flex items-center gap-4 ${theme === 'dark' ? 'bg-[#10b981]/10 border-[#10b981]/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'bg-slate-50 border-slate-200 shadow-sm'}`}>
                <Terminal size={14} className={theme === 'dark' ? 'text-[#10b981]' : 'text-amber-600'} />
                <span className={`text-[11px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-[#10b981] font-mono' : 'text-slate-500'}`}>GANADERO_CORE::UPLINK_{activeTab.toUpperCase()}</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                <span className="text-[9px] font-black uppercase tracking-[0.25em] opacity-40">System Stable</span>
             </div>
          </div>
          
          <div className="flex items-center gap-5">
             <div className="relative group">
                <Search className={`absolute left-4 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-[#10b981]/40' : 'text-slate-400'}`} size={16} />
                <input type="text" placeholder="Comandos de búsqueda..." className={`w-56 pl-12 pr-6 py-3 rounded-2xl text-[11px] font-black outline-none transition-all ${theme === 'dark' ? 'bg-[#10b981]/5 border border-[#10b981]/20 text-[#10b981] focus:w-80 focus:bg-[#10b981]/10' : 'bg-slate-100 border border-transparent focus:bg-white focus:ring-4 focus:ring-amber-500/10 focus:w-80'}`} />
             </div>
             
             <div className="relative">
                <button 
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className={`p-3.5 rounded-2xl border transition-all relative group ${theme === 'dark' ? 'bg-[#10b981]/5 border-[#10b981]/20 text-[#10b981] hover:bg-[#10b981]/20' : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-amber-600'}`}
                >
                  <Bell size={20} />
                  <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 border-2 border-white dark:border-[#0a0f0d] rounded-full animate-bounce"></span>
                </button>

                {isNotificationsOpen && (
                  <div className={`absolute top-full right-0 mt-4 w-96 rounded-[36px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border p-3 z-[300] animate-in slide-in-from-top-4 duration-300 ${theme === 'dark' ? 'bg-[#0a0f0d] border-[#10b981]/40' : 'bg-white border-slate-200'}`}>
                    <div className="p-5 border-b border-white/10 flex justify-between items-center">
                       <h4 className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2">
                         <ShieldAlert size={14} className="text-red-500" /> Alertas del Rancho
                       </h4>
                       <button onClick={() => setIsNotificationsOpen(false)} className="p-1 hover:bg-white/10 rounded-lg"><X size={16} /></button>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto p-2 space-y-2 custom-scrollbar">
                       {[
                         { t: 'Sanidad Crítica', m: 'Arete AR-2004 requiere desparasitación.', p: 'Alta', icon: <Activity size={16} /> },
                         { t: 'Finanzas', m: 'Cobro de $125k pendiente Distribuidora Gold.', p: 'Media', icon: <Wallet size={16} /> },
                         { t: 'Sincronización', m: 'Respaldo Cloud completado con éxito.', p: 'Info', icon: <Wifi size={16} /> }
                       ].map((n, i) => (
                         <div key={i} className={`p-5 rounded-3xl border transition-all flex gap-4 items-start cursor-pointer hover:translate-x-1 ${theme === 'dark' ? 'bg-[#10b981]/5 border-[#10b981]/10 hover:bg-[#10b981]/15' : 'bg-slate-50 hover:bg-slate-100 border-transparent shadow-sm'}`}>
                            <div className={`p-3 rounded-2xl shrink-0 ${n.p === 'Alta' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'}`}>{n.icon}</div>
                            <div>
                               <p className="text-[11px] font-black uppercase tracking-tighter leading-none mb-1.5">{n.t}</p>
                               <p className="text-[10px] font-bold opacity-60 leading-relaxed">{n.m}</p>
                            </div>
                         </div>
                       ))}
                    </div>
                    <div className="p-4 text-center border-t border-white/5">
                      <button className="text-[9px] font-black uppercase tracking-widest text-amber-600 hover:underline">Ver Historial Completo</button>
                    </div>
                  </div>
                )}
             </div>

             <div className={`h-10 w-px ${theme === 'dark' ? 'bg-white/10' : 'bg-slate-200'}`}></div>
             
             <div className="flex items-center gap-4 group cursor-pointer">
                <div className="hidden lg:block text-right">
                   <p className={`text-[11px] font-black uppercase leading-none mb-1 ${theme === 'dark' ? 'text-[#10b981]' : 'text-slate-900'}`}>Admin Pecuario</p>
                   <p className="text-[9px] font-bold text-emerald-500 leading-none tracking-widest uppercase">Nodo::Premium</p>
                </div>
                <div className={`w-12 h-12 rounded-[18px] flex items-center justify-center transition-all group-hover:scale-110 ${theme === 'dark' ? 'bg-[#10b981] text-black shadow-lg shadow-emerald-500/30' : 'bg-slate-900 text-amber-500 shadow-xl shadow-slate-900/20'}`}>
                  <User size={22} />
                </div>
             </div>
          </div>
        </header>

        <header className={`md:hidden p-6 flex justify-between items-center z-[140] shadow-2xl ${theme === 'dark' ? 'bg-[#0a0f0d] border-b border-[#10b981]/20' : 'bg-[#1a2421] text-white'}`}>
           <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-2xl ${theme === 'dark' ? 'bg-[#10b981] text-black' : 'bg-amber-600 shadow-xl shadow-amber-600/30'}`}>
                 <span className="font-black text-2xl italic">AR</span>
              </div>
              <h1 className={`font-black text-base tracking-tighter uppercase ${theme === 'dark' ? 'text-[#10b981]' : 'text-white'}`}>AR GANADERO</h1>
           </div>
           <button onClick={() => setIsSidebarOpen(true)} className={`p-4 rounded-2xl active:scale-75 transition-all shadow-xl ${theme === 'dark' ? 'bg-[#10b981]/10 text-[#10b981]' : 'bg-amber-600 text-white shadow-amber-600/20'}`}>
              <Menu size={24} />
           </button>
        </header>

        <div className={`flex-1 overflow-y-auto p-8 transition-colors duration-700 ${theme === 'dark' ? 'bg-[#050807]' : 'bg-[#fdfbf7]'}`}>
          {children}
        </div>

        <footer className={`fixed bottom-0 left-0 md:left-64 right-0 border-t z-[130] py-2.5 px-10 flex justify-center backdrop-blur-md ${theme === 'dark' ? 'bg-[#0a0f0d]/90 border-[#10b981]/20 text-[#10b981]' : 'bg-white/95 border-slate-100 text-slate-400 shadow-[0_-10px_30px_rgba(0,0,0,0.02)]'}`}>
           <p className={`font-mono text-[9px] font-black uppercase tracking-[0.3em] writing-animation ${theme === 'dark' ? 'shadow-glow' : ''}`}>{displayText}</p>
        </footer>

        {/* BOTÓN FLOTANTE "AR" MAESTRO MEJORADO */}
        <div className="fixed bottom-14 right-10 z-[280] flex flex-col items-end gap-4">
           {isFloatingOpen && (
             <div className="flex flex-col gap-4 mb-4 animate-in slide-in-from-bottom-10 fade-in duration-500">
                {[
                  { id: 'calc', icon: <Calculator size={24} />, label: 'Calculadora Pro', color: theme === 'dark' ? 'bg-[#0f1715] text-[#10b981] border-[#10b981]/30 hover:bg-[#10b981] hover:text-black shadow-emerald-500/20' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-900 hover:text-white' },
                  { id: 'conv', icon: <ArrowRightLeft size={24} />, label: 'Conversor Técnico', color: theme === 'dark' ? 'bg-[#0f1715] text-[#10b981] border-[#10b981]/30 hover:bg-[#10b981] hover:text-black shadow-emerald-500/20' : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-600 hover:text-white' },
                  { id: 'notes', icon: <Notebook size={24} />, label: 'Notas Rápidas', color: theme === 'dark' ? 'bg-[#0f1715] text-[#10b981] border-[#10b981]/30 hover:bg-[#10b981] hover:text-black shadow-emerald-500/20' : 'bg-white text-slate-700 border-slate-200 hover:bg-amber-600 hover:text-white' },
                  { id: 'calendar_mini', icon: <Calendar size={24} />, label: 'Calendario', color: theme === 'dark' ? 'bg-[#0f1715] text-[#10b981] border-[#10b981]/30 hover:bg-[#10b981] hover:text-black shadow-emerald-500/20' : 'bg-white text-slate-700 border-slate-200 hover:bg-blue-600 hover:text-white' },
                ].map((tool) => (
                  <button 
                    key={tool.id}
                    onClick={() => { setActiveTool(tool.id); setIsFloatingOpen(false); }}
                    className={`flex items-center gap-5 px-7 py-5 rounded-[32px] shadow-2xl border transition-all hover:scale-105 hover:-translate-x-2 active:scale-90 group ${tool.color}`}
                  >
                    <span className="shrink-0">{tool.icon}</span>
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] whitespace-nowrap">{tool.label}</span>
                  </button>
                ))}
             </div>
           )}
           <button 
            onClick={() => setIsFloatingOpen(!isFloatingOpen)}
            className={`w-24 h-24 rounded-[40px] shadow-[0_30px_80px_-15px_rgba(0,0,0,0.4)] flex flex-col items-center justify-center transition-all hover:scale-110 active:scale-75 relative overflow-hidden float-anim ${theme === 'dark' ? 'bg-[#10b981] text-black border-4 border-[#10b981]/50' : 'bg-amber-600 text-white shadow-amber-600/40 border-4 border-white'}`}
           >
              {isFloatingOpen ? <X size={36} /> : (
                <>
                  <span className="text-4xl font-black italic tracking-tighter z-10 leading-none">AR</span>
                  <span className="text-[9px] font-black uppercase tracking-widest z-10 opacity-70 mt-1.5">Pro Tools</span>
                </>
              )}
              {isFloatingOpen && <div className="absolute inset-0 bg-white/20 animate-pulse"></div>}
           </button>
        </div>
      </main>
      <style>{`.shadow-glow { text-shadow: 0 0 12px rgba(16, 185, 129, 0.6); }`}</style>
    </div>
  );
};

export default Layout;
