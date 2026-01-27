
import React from 'react';
import { MOCK_HEALTH_RECORDS, MOCK_ANIMALS } from '../constants';
import { Stethoscope, Calendar, Search, Filter, Plus } from 'lucide-react';

const HealthManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Control Sanitario</h2>
          <p className="text-slate-500">Historial de vacunaciones, tratamientos y alertas veterinarias.</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all">
          <Plus size={18} /> Nuevo Registro Médico
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-sm mb-1">Vacunas este mes</p>
          <h3 className="text-2xl font-bold text-slate-800">42</h3>
          <div className="mt-2 text-xs text-green-600 font-bold">↑ 8% vs mes pasado</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-sm mb-1">En tratamiento</p>
          <h3 className="text-2xl font-bold text-amber-600">5</h3>
          <div className="mt-2 text-xs text-slate-400 font-medium">Requieren seguimiento diario</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-sm mb-1">Inversión Sanidad</p>
          <h3 className="text-2xl font-bold text-slate-800">$1,450</h3>
          <div className="mt-2 text-xs text-slate-400 font-medium">Medicamentos e insumos</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h4 className="font-bold text-slate-700">Últimas Intervenciones</h4>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-white rounded-lg transition-colors"><Search size={18} className="text-slate-400" /></button>
            <button className="p-2 hover:bg-white rounded-lg transition-colors"><Filter size={18} className="text-slate-400" /></button>
          </div>
        </div>
        <div className="divide-y divide-slate-100">
          {MOCK_HEALTH_RECORDS.map((record) => {
            const animal = MOCK_ANIMALS.find(a => a.id === record.animalId);
            return (
              <div key={record.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                  <Stethoscope size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-slate-800">{record.type}: {record.description}</p>
                      <p className="text-xs text-slate-500">Animal: {animal?.breed} (#{animal?.tagId})</p>
                    </div>
                    <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                      <Calendar size={12} /> {record.date}
                    </span>
                  </div>
                  <p className="text-xs mt-1 text-slate-400 font-medium uppercase tracking-wider">Responsable: {record.veterinarian}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HealthManagement;
