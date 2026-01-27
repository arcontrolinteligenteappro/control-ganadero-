
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  TrendingUp, 
  AlertCircle, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock,
  Sparkles
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const data = [
  { name: 'Ene', valor: 4000 },
  { name: 'Feb', valor: 3000 },
  { name: 'Mar', valor: 5000 },
  { name: 'Abr', valor: 4500 },
  { name: 'May', valor: 6000 },
  { name: 'Jun', valor: 5500 },
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header & IA Insight */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Panel de Control</h2>
          <p className="text-slate-500">Bienvenido de nuevo, Estancia La Linda.</p>
        </div>
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-2xl shadow-lg flex items-center gap-3">
          <Sparkles className="animate-pulse" size={20} />
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider opacity-80">Recomendación IA</p>
            <p className="text-sm font-semibold">Momento óptimo para venta de Lote #442 (Bovinos Engorde)</p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Animales', value: '452', sub: '+12 nacimientos', icon: <Users className="text-blue-600" />, trend: 'up' },
          { label: 'Producción Diaria', value: '1,240L', sub: 'Promedio 24L/vaca', icon: <TrendingUp className="text-green-600" />, trend: 'up' },
          { label: 'Alertas Sanitarias', value: '3', sub: '2 vacunas pendientes', icon: <AlertCircle className="text-amber-600" />, trend: 'down' },
          { label: 'Valoración Hato', value: '$84.2k', sub: '+5.4% este mes', icon: <TrendingUp className="text-purple-600" />, trend: 'up' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-slate-50 rounded-xl">{kpi.icon}</div>
              <span className={`flex items-center text-xs font-bold ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {kpi.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {kpi.trend === 'up' ? '12%' : '2%'}
              </span>
            </div>
            <p className="text-slate-500 text-sm mb-1">{kpi.label}</p>
            <h3 className="text-2xl font-bold text-slate-800">{kpi.value}</h3>
            <p className="text-xs text-slate-400 mt-2 font-medium">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts & Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800">Tendencia de Precios de Mercado</h3>
            <select className="bg-slate-100 border-none rounded-lg text-sm px-3 py-1 outline-none font-medium">
              <option>Bovinos Engorde</option>
              <option>Reproductores</option>
            </select>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: 'bold', color: '#16a34a' }}
                />
                <Area type="monotone" dataKey="valor" stroke="#16a34a" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-6">Actividad Reciente</h3>
          <div className="space-y-6">
            {[
              { type: 'Venta', title: 'Lote #12 vendido', time: 'hace 2 horas', status: 'completado' },
              { type: 'Sanidad', title: 'Vacunación Lote A', time: 'hace 5 horas', status: 'pendiente' },
              { type: 'Nacimiento', title: 'Nueva cría (ID: 994)', time: 'hace 1 día', status: 'registrado' },
              { type: 'Transporte', title: 'Envío solicitado', time: 'hace 2 días', status: 'en camino' },
            ].map((act, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-1 bg-green-500 rounded-full h-10 my-auto"></div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{act.title}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                    <Clock size={12} />
                    <span>{act.time}</span>
                    <span className="capitalize px-2 py-0.5 bg-slate-100 rounded text-slate-500 font-semibold">{act.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-3 text-sm font-bold text-green-600 hover:bg-green-50 rounded-xl transition-colors border border-green-200 border-dashed">
            Ver todo el historial
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
