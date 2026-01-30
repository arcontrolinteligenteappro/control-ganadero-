
import React, { useState, useEffect } from 'react';
import { TrendingUp, Activity, ShieldCheck, Wallet, Zap, Terminal, Sparkles, Map, Plus, ShieldAlert, Cpu, Box, Radar } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Ene', valor: 85000 },
  { name: 'Feb', valor: 92000 },
  { name: 'Mar', valor: 115000 },
  { name: 'Abr', valor: 108000 },
  { name: 'May', valor: 142000 },
];

const Dashboard: React.FC = () => {
  const [securityLogs, setSecurityLogs] = useState<string[]>([]);

  useEffect(() => {
    const logs = [
      "ENCRYPTED_UPLINK::STABLE",
      "CHECKING_ARETE_SENSORS::OK",
      "SYNCING_FINANCE_DATA::DRIVE_NODE_B",
      "SECURITY_AUDIT::PASSED",
      "CALIBRATING_GPS_PADDOCKS::DONE",
      "MONITORING_MARKET_TRENDS::UP",
      "REPRODUCTION_ALERTS::CLEAN"
    ];
    let i = 0;
    const interval = setInterval(() => {
      setSecurityLogs(prev => [...prev.slice(-6), `[${new Date().toLocaleTimeString()}] ${logs[i % logs.length]}`]);
      i++;
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-1000 pb-24">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <h2 className="text-5xl font-black tracking-tighter uppercase leading-none mb-2 dark:text-[#10b981] text-slate-900">Mando Maestro</h2>
          <p className="text-slate-500 font-bold text-[11px] uppercase tracking-[0.25em] dark:text-[#10b981]/50 ml-1">Análisis Biométrico y Contable de Vanguardia</p>
        </div>
        <div className="flex gap-3">
          <div className="px-5 py-3 bg-emerald-50 dark:bg-[#10b981]/10 rounded-2xl border border-emerald-100 dark:border-[#10b981]/20 flex items-center gap-3 shadow-sm shadow-emerald-500/5">
             <ShieldCheck size={18} className="text-emerald-600 dark:text-[#10b981]" />
             <span className="text-[10px] font-black uppercase text-emerald-900 dark:text-[#10b981] tracking-widest">NODO::SINCRO_VIGENTE</span>
          </div>
          <div className="px-5 py-3 bg-slate-900 dark:bg-black rounded-2xl border border-white/10 flex items-center gap-3 text-white shadow-xl">
             <Radar size={18} className="text-amber-500 animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-widest font-mono">SCAN_LEVEL_7</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Hato Activo', value: '184', sub: 'Bio-Ejemplares', icon: <Activity size={24} className="text-blue-600" />, trend: '+8%' },
          { label: 'Valuación Hato', value: '$3.2M', sub: 'Activos Vivos', icon: <TrendingUp size={24} className="text-emerald-600" />, trend: '12%' },
          { label: 'Sanidad Lote', value: '98.5%', sub: 'Estatus Nayarit', icon: <ShieldAlert size={24} className="text-amber-600" />, trend: 'OK' },
          { label: 'Flujo Líquido', value: '$840k', sub: 'Neto Semestral', icon: <Wallet size={24} className="text-purple-600" />, trend: 'ESTABLE' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white dark:bg-[#0a1411] p-8 rounded-[48px] border border-slate-200 dark:border-[#10b981]/20 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all tech-card relative group cursor-pointer active:scale-95">
            <div className="flex justify-between items-start mb-8">
              <div className="p-4 bg-slate-50 dark:bg-black rounded-[22px] border border-slate-100 dark:border-[#10b981]/20 group-hover:bg-amber-600 group-hover:text-white transition-all shadow-inner">{kpi.icon}</div>
              <span className="px-4 py-1.5 bg-slate-50 dark:bg-[#10b981]/20 rounded-xl text-[9px] font-black text-slate-400 dark:text-[#10b981] uppercase tracking-widest border border-slate-100 dark:border-transparent">{kpi.trend}</span>
            </div>
            <p className="text-slate-400 dark:text-[#10b981]/40 text-[10px] font-black uppercase tracking-[0.25em] mb-1.5 ml-1">{kpi.label}</p>
            <h3 className="text-4xl font-black text-slate-900 dark:text-[#10b981] tracking-tighter leading-none">{kpi.value}</h3>
            <p className="text-[9px] text-slate-400 dark:text-[#10b981]/20 mt-3 font-bold uppercase italic ml-1">{kpi.sub}</p>
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#10b981]/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-[#10b981]/15 transition-all"></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white dark:bg-[#0a1411] p-10 rounded-[56px] border border-slate-200 dark:border-[#10b981]/20 shadow-sm tech-card">
          <div className="flex justify-between items-center mb-10">
            <div>
               <h3 className="text-2xl font-black text-slate-800 dark:text-[#10b981] tracking-tighter uppercase leading-none">Tendencias de Mercado Regional</h3>
               <p className="text-[10px] font-bold text-slate-400 dark:text-[#10b981]/40 uppercase tracking-widest mt-2 ml-0.5">Indicador de Engorda (USD / Semestre)</p>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#10b98110" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#10b98140', fontSize: 10, fontWeight: 'bold'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#10b98140', fontSize: 10, fontWeight: 'bold'}} />
                <Tooltip contentStyle={{ borderRadius: '32px', border: 'none', background: '#0a1411', color: '#10b981', fontSize: '11px', boxShadow: '0 20px 50px rgba(0,0,0,0.6)' }} />
                <Area type="monotone" dataKey="valor" stroke="#10b981" strokeWidth={5} fillOpacity={1} fill="url(#colorVal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 bg-[#1a2421] dark:bg-black p-10 rounded-[56px] text-white shadow-2xl relative overflow-hidden group border-2 border-white/5 dark:border-[#10b981]/30">
          <div className="relative z-10 h-full flex flex-col">
            <h3 className="text-sm font-black tracking-[0.2em] uppercase mb-8 flex items-center gap-3">
               <Terminal className="text-emerald-500 animate-pulse" size={20} /> Security Monitoring
            </h3>
            <div className="flex-1 space-y-4 font-mono text-[10px]">
               {securityLogs.map((log, i) => (
                 <div key={i} className="flex gap-3 items-center text-emerald-500/90 animate-in fade-in slide-in-from-left-4 duration-500">
                    <span className="text-white/20 select-none">>></span>
                    <span className="tracking-tight">{log}</span>
                 </div>
               ))}
               {securityLogs.length === 0 && <div className="text-white/10 italic">Initializing monitoring core...</div>}
            </div>
            <div className="mt-10 pt-10 border-t border-white/10">
               <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em] mb-1.5">Terminal Encryption</p>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
                      <span className="text-[11px] font-black text-emerald-500 uppercase tracking-widest">PRO_LINK::ACTIVE</span>
                    </div>
                  </div>
                  <div className="p-4 bg-white/5 rounded-3xl border border-white/10 group-hover:bg-[#10b981] group-hover:text-black transition-all shadow-xl group-hover:scale-110 active:scale-90">
                     <ShieldCheck size={28} />
                  </div>
               </div>
            </div>
          </div>
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#10b981]/5 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
