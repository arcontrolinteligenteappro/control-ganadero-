
import React from 'react';
import { TrendingUp, Activity, ShieldCheck, Wallet, Zap, Terminal, Sparkles, Map, Plus } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Ene', valor: 32000 },
  { name: 'Feb', valor: 28000 },
  { name: 'Mar', valor: 45000 },
  { name: 'Abr', valor: 38000 },
  { name: 'May', valor: 52000 },
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-right-5 duration-700">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tighter uppercase leading-none mb-1 dark:text-emerald-400 text-slate-900">Centro de Comando Ganadero</h2>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest dark:text-emerald-700/60">Monitoreo Biométrico y Financiero en Tiempo Real.</p>
        </div>
        <div className="flex gap-2">
          <div className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border border-emerald-100 dark:border-emerald-800/30 flex items-center gap-2">
             <ShieldCheck size={14} className="text-emerald-600" />
             <span className="text-[8px] font-black uppercase text-emerald-900 dark:text-emerald-400 tracking-widest">CLOUD_SYNC:OK</span>
          </div>
          <div className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-100 dark:border-blue-800/30 flex items-center gap-2">
             <Zap size={14} className="text-blue-600" />
             <span className="text-[8px] font-black uppercase text-blue-900 dark:text-blue-400 tracking-widest">HIGH_PERFORMANCE</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Hato Activo', value: '152', sub: 'Unidades Animal', icon: <Activity size={18} className="text-blue-600" />, trend: '+5' },
          { label: 'Cartera Clientes', value: '$452k', sub: 'CxC Pendiente', icon: <TrendingUp size={18} className="text-emerald-600" />, trend: '12%' },
          { label: 'Cobertura Sanitaria', value: '98%', sub: 'Estatus Nayarit', icon: <ShieldCheck size={18} className="text-amber-600" />, trend: 'SECURE' },
          { label: 'EBITDA Mensual', value: '$12.8k', sub: 'Neto Estimado', icon: <Wallet size={18} className="text-purple-600" />, trend: 'STEADY' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white dark:bg-[#0a1411] p-5 rounded-[24px] border border-slate-200 dark:border-emerald-900/30 shadow-sm hover:shadow-xl transition-all group tech-card">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-slate-50 dark:bg-emerald-950/30 rounded-lg border border-slate-100 dark:border-emerald-800/30">{kpi.icon}</div>
              <span className="px-2 py-0.5 bg-slate-50 dark:bg-emerald-900/20 rounded-full text-[7px] font-black text-slate-400 dark:text-emerald-500 uppercase tracking-widest">{kpi.trend}</span>
            </div>
            <p className="text-slate-400 dark:text-emerald-700/60 text-[8px] font-black uppercase tracking-widest mb-1">{kpi.label}</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-emerald-400 tracking-tighter leading-none">{kpi.value}</h3>
            <p className="text-[8px] text-slate-400 dark:text-emerald-800 mt-2 font-bold uppercase italic">{kpi.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pb-12">
        <div className="lg:col-span-8 bg-white dark:bg-[#0a1411] p-6 rounded-[32px] border border-slate-200 dark:border-emerald-900/30 shadow-sm tech-card">
          <div className="flex justify-between items-center mb-6">
            <div>
               <h3 className="text-lg font-black text-slate-800 dark:text-emerald-400 tracking-tighter uppercase leading-none">Proyección de Mercado</h3>
               <p className="text-[8px] font-bold text-slate-400 dark:text-emerald-700 uppercase tracking-widest mt-1">Comparativa Regional Occidente (USD)</p>
            </div>
          </div>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#10b98110" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#10b98140', fontSize: 9, fontWeight: 'bold'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#10b98140', fontSize: 9, fontWeight: 'bold'}} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', background: '#0a1411', color: '#10b981', fontSize: '10px' }} />
                <Area type="monotone" dataKey="valor" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 bg-[#1a2421] dark:bg-[#0f1715] p-6 rounded-[32px] text-white shadow-2xl relative overflow-hidden group">
          <div className="relative z-10 h-full flex flex-col">
            <h3 className="text-sm font-black tracking-tight uppercase mb-4 flex items-center gap-2">
               <Terminal className="text-emerald-500" size={14} /> Acceso Directo
            </h3>
            <div className="space-y-2 flex-1">
              {[
                { label: 'Analítica Hato IA', icon: <Sparkles size={14} />, color: 'bg-emerald-600' },
                { label: 'Reporte Financiero', icon: <TrendingUp size={14} />, color: 'bg-blue-600' },
                { label: 'Logística Potreros', icon: <Map size={14} />, color: 'bg-purple-600' },
              ].map((btn, i) => (
                <button key={i} className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all active:scale-95 group/btn">
                  <div className={`p-2 ${btn.color} rounded-lg shadow-lg group-hover/btn:scale-110 transition-transform`}>{btn.icon}</div>
                  <span className="text-[9px] font-black uppercase tracking-widest font-mono">{btn.label}</span>
                </button>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-white/5">
               <p className="text-[7px] font-black text-white/40 uppercase tracking-widest mb-1 font-mono">AR_GANADERO_NODE_SECURE</p>
               <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-emerald-500 rounded-full animate-ping"></div>
                  <span className="text-[8px] font-bold text-emerald-500 font-mono">LATENCY: 4ms</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
