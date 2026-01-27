
import React from 'react';
import { MOCK_REPRODUCTION_RECORDS, MOCK_ANIMALS } from '../constants';
import { Baby, Calendar, Plus, Heart, Timer } from 'lucide-react';

const ReproductionManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Ciclo Reproductivo</h2>
          <p className="text-slate-500">Gestión de inseminaciones, preñeces y nacimientos.</p>
        </div>
        <button className="flex items-center gap-2 bg-purple-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-purple-700 shadow-lg shadow-purple-600/20 transition-all">
          <Plus size={18} /> Registrar Evento
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Gestantes', value: '18', icon: <Heart className="text-pink-500" /> },
          { label: 'Próx. Partos', value: '4', icon: <Timer className="text-purple-500" /> },
          { label: 'Nacimientos Mes', value: '12', icon: <Baby className="text-blue-500" /> },
          { label: 'Tasa Fertilidad', value: '84%', icon: <Calendar className="text-green-500" /> },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-slate-50 rounded-xl">{stat.icon}</div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
              <p className="text-xl font-black text-slate-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <h4 className="font-bold text-slate-700">Cronología Reproductiva</h4>
        </div>
        <div className="divide-y divide-slate-100">
          {MOCK_REPRODUCTION_RECORDS.map((record) => {
            const animal = MOCK_ANIMALS.find(a => a.id === record.animalId);
            return (
              <div key={record.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                  <Baby size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-slate-800">{record.event}</p>
                      <p className="text-sm text-slate-500">Ejemplar: {animal?.breed} (#{animal?.tagId})</p>
                    </div>
                    <span className="text-xs font-bold text-slate-400">{record.date}</span>
                  </div>
                  {record.result && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                        {record.result}
                      </span>
                      {record.notes && <span className="text-xs text-slate-400 italic">{record.notes}</span>}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ReproductionManagement;
