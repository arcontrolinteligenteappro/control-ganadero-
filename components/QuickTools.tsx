
import React, { useState, useEffect } from 'react';
import { 
  X, Calculator, Ruler, Notebook, Save, ArrowRightLeft,
  Calendar, ChevronLeft, ChevronRight
} from 'lucide-react';

type ToolType = 'calc' | 'conv' | 'notes' | 'calendar_mini' | null;

const QuickTools: React.FC<{ activeTool: ToolType; onClose: () => void }> = ({ activeTool, onClose }) => {
  const [calcValue, setCalcValue] = useState('0');
  const [convValue, setConvValue] = useState<string>('0');
  const [convType, setConvType] = useState('kg-lb');

  if (!activeTool) return null;

  const addToCalc = (val: string) => {
    setCalcValue(prev => {
        if (prev === '0' && !['/', '*', '-', '+', '.', ')'].includes(val)) return val;
        if (['/', '*', '-', '+', '.'].includes(val) && ['/', '*', '-', '+', '.'].includes(prev.slice(-1))) return prev;
        return prev + val;
    });
  };

  const solveCalc = () => {
    try {
      const sanitized = calcValue.replace(/[^-()\d/*+.]/g, '');
      if (!sanitized) return;
      const result = new Function(`return ${sanitized}`)();
      setCalcValue(Number.isFinite(result) ? result.toLocaleString('en-US', { maximumFractionDigits: 4 }) : 'ERROR');
    } catch {
      setCalcValue('ERROR');
      setTimeout(() => setCalcValue('0'), 1500);
    }
  };

  const convert = (val: string) => {
    const num = parseFloat(val) || 0;
    switch(convType) {
      case 'kg-lb': return (num * 2.20462).toFixed(2) + ' Lbs';
      case 'lb-kg': return (num / 2.20462).toFixed(2) + ' Kgs';
      case 'ha-m2': return (num * 10000).toLocaleString() + ' m²';
      case 'm2-ha': return (num / 10000).toFixed(4) + ' Ha';
      case 'lt-gl': return (num * 0.264172).toFixed(2) + ' Gal';
      case 'ft-m': return (num * 0.3048).toFixed(2) + ' m';
      default: return '0';
    }
  };

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 md:p-10 pointer-events-none">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl pointer-events-auto animate-in fade-in" onClick={onClose} />
      
      <div className="bg-white dark:bg-[#0a0f0d] w-full max-w-xl rounded-[48px] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.8)] border border-slate-200 dark:border-[#10b981]/30 overflow-hidden pointer-events-auto animate-in zoom-in-95 relative flex flex-col max-h-[90vh]">
        <header className="p-8 bg-[#1a2421] dark:bg-[#10b981] text-white dark:text-black flex justify-between items-center shrink-0">
          <div className="flex items-center gap-5">
             <div className="p-3.5 bg-white/20 dark:bg-black/10 rounded-2xl shadow-lg backdrop-blur-md">
                {activeTool === 'calc' && <Calculator size={28} />}
                {activeTool === 'conv' && <ArrowRightLeft size={28} />}
                {activeTool === 'notes' && <Notebook size={28} />}
                {activeTool === 'calendar_mini' && <Calendar size={28} />}
             </div>
             <div>
               <h3 className="font-black text-2xl uppercase tracking-tighter leading-none">AR MASTER TOOLS</h3>
               <p className="text-[10px] font-bold uppercase tracking-[0.2em] mt-1.5 opacity-70 font-mono">MODULE::{activeTool.toUpperCase()}</p>
             </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/10 dark:hover:bg-black/10 rounded-full transition-all active:scale-75"><X size={28} /></button>
        </header>

        <div className="p-8 flex-1 overflow-y-auto custom-scrollbar space-y-6">
          {activeTool === 'calc' && (
            <div className="space-y-5 animate-in slide-in-from-bottom-6">
               <div className="bg-slate-900 dark:bg-black p-10 rounded-[32px] text-right overflow-hidden shadow-2xl border border-white/5">
                  <div className="text-[10px] font-mono font-black text-emerald-500/40 uppercase tracking-[0.3em] mb-2">Display Output</div>
                  <div className="text-5xl font-mono font-black text-[#10b981] truncate">{calcValue}</div>
               </div>
               <div className="grid grid-cols-4 gap-3.5">
                  {['C', '(', ')', '/', '7', '8', '9', '*', '4', '5', '6', '-', '1', '2', '3', '+', '0', '.', '=', '⌫'].map(b => (
                    <button 
                      key={b} 
                      onClick={() => {
                        if (b === '=') solveCalc();
                        else if (b === 'C') setCalcValue('0');
                        else if (b === '⌫') setCalcValue(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
                        else addToCalc(b);
                      }}
                      className={`h-16 rounded-[22px] font-black text-xl transition-all active:scale-90 shadow-lg border-2 flex items-center justify-center ${
                        ['/', '*', '-', '+', '=', 'C', '⌫'].includes(b) 
                        ? 'bg-amber-600 dark:bg-[#10b981] text-white dark:text-black border-transparent' 
                        : 'bg-white dark:bg-[#10b981]/5 text-slate-800 dark:text-[#10b981] border-slate-100 dark:border-[#10b981]/20'
                      } ${b === '=' ? 'col-span-2' : ''}`}
                    >
                      {b}
                    </button>
                  ))}
               </div>
            </div>
          )}

          {activeTool === 'conv' && (
            <div className="space-y-8 animate-in slide-in-from-bottom-6">
               <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[{id:'kg-lb', l:'Kg ➜ Lb'}, {id:'lb-kg', l:'Lb ➜ Kg'}, {id:'ha-m2', l:'Ha ➜ m²'}, {id:'lt-gl', l:'Lt ➜ Gal'}, {id:'m2-ha', l:'m² ➜ Ha'}, {id:'ft-m', l:'Ft ➜ m'}].map(t => (
                    <button key={t.id} onClick={() => setConvType(t.id)} className={`p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${convType === t.id ? 'bg-emerald-50 dark:bg-[#10b981]/20 border-emerald-500 dark:border-[#10b981] text-emerald-700 dark:text-[#10b981]' : 'bg-white dark:bg-black/40 border-slate-100 dark:border-[#10b981]/10 text-slate-400'}`}>
                      {t.l}
                    </button>
                  ))}
               </div>
               <div className="space-y-6">
                  <input type="number" className="w-full p-10 bg-slate-50 dark:bg-black border-2 border-slate-100 dark:border-[#10b981]/30 rounded-[40px] font-black text-5xl text-center outline-none dark:text-[#10b981]" value={convValue} onChange={e => setConvValue(e.target.value)} />
                  <div className="p-12 bg-slate-900 dark:bg-[#10b981]/5 rounded-[48px] text-center shadow-xl border border-white/5">
                     <p className="text-[11px] font-black text-amber-500 dark:text-[#10b981] uppercase tracking-[0.4em] mb-3">Resultado Técnico</p>
                     <p className="text-6xl font-black text-white dark:text-[#10b981] tracking-tighter">{convert(convValue)}</p>
                  </div>
               </div>
            </div>
          )}

          {activeTool === 'notes' && (
            <div className="animate-in slide-in-from-bottom-6 space-y-6">
                <textarea rows={12} placeholder="Escriba una bitácora rápida..." className="w-full p-10 bg-amber-50 dark:bg-black border-2 border-amber-100 dark:border-[#10b981]/20 rounded-[48px] font-medium text-slate-700 dark:text-[#10b981] outline-none transition-all shadow-inner resize-none text-xl leading-relaxed" defaultValue={localStorage.getItem('ar_mini_note') || ''} onChange={e => localStorage.setItem('ar_mini_note', e.target.value)} />
                <div className="flex items-center gap-4 px-8 py-4 bg-emerald-50 dark:bg-[#10b981]/5 rounded-3xl border border-emerald-100 dark:border-[#10b981]/10">
                   <Save size={18} className="text-emerald-500" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-[#10b981]/60">Sincronización de Sesión Activa</span>
                </div>
            </div>
          )}

          {activeTool === 'calendar_mini' && (
            <div className="animate-in slide-in-from-bottom-6 space-y-6">
               <div className="flex justify-between items-center px-4">
                  <h4 className="font-black text-xl text-slate-800 dark:text-[#10b981] uppercase tracking-tighter">Agenda Mayo 2025</h4>
                  <div className="flex gap-2">
                     <button className="p-2 bg-slate-50 dark:bg-black rounded-xl border dark:border-[#10b981]/20"><ChevronLeft size={16} /></button>
                     <button className="p-2 bg-slate-50 dark:bg-black rounded-xl border dark:border-[#10b981]/20"><ChevronRight size={16} /></button>
                  </div>
               </div>
               <div className="grid grid-cols-7 gap-2">
                  {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map(d => <div key={d} className="text-center text-[10px] font-black text-slate-300 uppercase">{d}</div>)}
                  {Array.from({length: 31}).map((_, i) => (
                    <div key={i} className={`aspect-square rounded-2xl flex items-center justify-center text-xs font-bold border transition-all ${i+1 === 24 ? 'bg-amber-600 text-white border-transparent shadow-lg' : 'bg-white dark:bg-black/40 dark:text-[#10b981] border-slate-100 dark:border-[#10b981]/10'}`}>
                      {i+1}
                    </div>
                  ))}
               </div>
               <div className="p-6 bg-slate-50 dark:bg-[#10b981]/5 rounded-3xl border border-slate-100 dark:border-[#10b981]/10">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Evento para hoy:</p>
                  <div className="flex items-center gap-3">
                     <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                     <p className="text-xs font-black text-slate-800 dark:text-[#10b981]">Vacunación Lote Norte (14:00 hrs)</p>
                  </div>
               </div>
            </div>
          )}
        </div>
        
        <footer className="p-6 bg-slate-50 dark:bg-black/60 border-t border-slate-100 dark:border-[#10b981]/10 flex justify-center shrink-0">
            <p className="text-[8px] font-black text-slate-400 dark:text-[#10b981]/20 uppercase tracking-[0.4em] font-mono">
               AR_SYSTEM_CORE_PRO :: SECURITY_ENABLED :: {Math.random().toString(36).substr(2, 8).toUpperCase()}
            </p>
        </footer>
      </div>
    </div>
  );
};

export default QuickTools;
