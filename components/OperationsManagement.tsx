
import React, { useState } from 'react';
import { MOCK_PADDOCKS, MOCK_PADDOCK_LOGS, MOCK_ANIMALS, MOCK_EMPLOYEES } from '../constants';
import { 
  MapPin, Plus, History, Activity, Users, ArrowRightLeft, 
  DollarSign, X, CheckCircle, FileText, Search, Layout, 
  Tag as TagIcon, Sparkles, PlusCircle, Save, CheckSquare, Square, 
  Maximize, Trees, Ruler, AlertTriangle
} from 'lucide-react';
import { Animal, Paddock } from '../types';

const AddPaddockModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    capacity: '',
    area: '',
    forageType: 'Pastura Estrella',
    status: 'Descanso' as any
  });

  const handleSubmit = () => {
    if(!formData.name || !formData.capacity) {
      alert("Nombre y capacidad son obligatorios");
      return;
    }
    alert("Potrero registrado en AR CONTROL GANADERO. El mapa de rotación ha sido actualizado.");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xl animate-in fade-in">
      <div className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 border border-slate-200">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-[#1a2421] text-white">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-emerald-600 rounded-2xl shadow-lg shadow-emerald-900/40"><MapPin size={24} /></div>
             <div>
                <h3 className="font-black text-xl uppercase tracking-tighter">Alta de Potrero Maestro</h3>
                <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Dimensionamiento Territorial</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all"><X size={24} /></button>
        </div>
        
        <div className="p-8 space-y-6">
           <div className="grid grid-cols-2 gap-5">
              <div className="col-span-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Nombre del Potrero / Área</label>
                 <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none focus:border-emerald-500 transition-all" placeholder="Ej: Loma del Águila" />
              </div>
              <div>
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Capacidad (Cabezas)</label>
                 <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input type="number" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} className="w-full pl-11 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black outline-none" placeholder="0" />
                 </div>
              </div>
              <div>
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Extensión (Hectáreas)</label>
                 <div className="relative">
                    <Maximize className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input type="text" value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} className="w-full pl-11 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black outline-none" placeholder="0.00" />
                 </div>
              </div>
              <div className="col-span-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Tipo de Forraje Dominante</label>
                 <select value={formData.forageType} onChange={e => setFormData({...formData, forageType: e.target.value})} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold">
                    <option>Pastura Estrella</option>
                    <option>Brizantha</option>
                    <option>Mombaza</option>
                    <option>Césped Natural</option>
                    <option>Leguminosas</option>
                 </select>
              </div>
           </div>

           <div className="p-6 bg-blue-50 rounded-[32px] border border-blue-100 flex items-center gap-4">
              <Trees size={24} className="text-blue-600" />
              <div>
                 <p className="text-[9px] font-black text-blue-600 uppercase tracking-[0.2em]">Sugerencia Biológica</p>
                 <p className="text-xs font-bold text-blue-900 leading-tight">Para {formData.capacity || '0'} cabezas en esta zona, se sugiere rotación cada 21 días para evitar compactación.</p>
              </div>
           </div>

           <div className="flex gap-4 pt-4">
              <button onClick={onClose} className="flex-1 py-4 bg-slate-100 text-slate-400 font-black rounded-2xl hover:bg-slate-200 transition-all uppercase tracking-widest text-[10px]">Cerrar</button>
              <button onClick={handleSubmit} className="flex-2 py-4 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-700 shadow-xl shadow-emerald-600/20 transition-all uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 px-10">
                 <Save size={18} /> Registrar Potrero
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

const MoveAnimalModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAnimals, setSelectedAnimals] = useState<Animal[]>([]);

  const filteredAnimals = MOCK_ANIMALS.filter(a => 
    a.tagId.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.breed.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleAnimalSelection = (animal: Animal) => {
    setSelectedAnimals(prev => 
      prev.find(a => a.id === animal.id) 
        ? prev.filter(a => a.id !== animal.id)
        : [...prev, animal]
    );
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 border border-slate-200">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-[#2d3a3a] text-white">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-amber-600 rounded-2xl"><ArrowRightLeft size={24} /></div>
             <div>
                <h3 className="font-black text-xl uppercase tracking-tighter">Traslado Múltiple</h3>
                <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Rotación de Lotes</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all"><X size={24} /></button>
        </div>
        
        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">1. Seleccionar Ejemplares ({selectedAnimals.length})</label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Buscar por Raza o Arete..." 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none focus:border-amber-500"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
               {filteredAnimals.map(a => {
                 const isSelected = !!selectedAnimals.find(sa => sa.id === a.id);
                 return (
                   <button key={a.id} onClick={() => toggleAnimalSelection(a)} className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all shrink-0 relative ${isSelected ? 'bg-amber-50 border-amber-500 shadow-lg scale-95' : 'bg-white border-slate-100'}`}>
                      <div className="w-10 h-10 rounded-xl overflow-hidden"><img src={a.imageUrl} className="w-full h-full object-cover" /></div>
                      <div className="text-left"><p className="text-[10px] font-black">{a.tagId}</p></div>
                      {isSelected && <CheckSquare className="absolute -top-1 -right-1 text-amber-600 bg-white rounded-full" size={16} />}
                   </button>
                 );
               })}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">2. Destino del Lote</label>
            <select className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-3xl font-black text-slate-800 outline-none">
              <option value="">Selecciona potrero de destino...</option>
              {MOCK_PADDOCKS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
        </div>

        <div className="p-8 bg-slate-50 border-t flex gap-4">
           <button onClick={onClose} className="flex-1 py-4 bg-white border-2 border-slate-200 text-slate-400 font-black rounded-2xl">Cancelar</button>
           <button disabled={selectedAnimals.length === 0} onClick={() => { alert(`Traslado de ${selectedAnimals.length} ejemplares registrado`); onClose(); }} className="flex-1 py-4 bg-amber-600 text-white font-black rounded-2xl shadow-xl shadow-amber-600/20 active:scale-95 transition-all">Confirmar Lote</button>
        </div>
      </div>
    </div>
  );
};

const OperationsManagement: React.FC = () => {
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [isAddPaddockOpen, setIsAddPaddockOpen] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Potreros y Rotación</h2>
          <p className="text-slate-500 font-bold text-sm italic">Control territorial y manejo de pastizales inteligente.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2">
          <button onClick={() => setIsMoveModalOpen(true)} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border-2 border-slate-200 px-6 py-3.5 rounded-2xl text-[10px] font-black text-slate-800 hover:bg-slate-50 transition-all shadow-sm">
            <ArrowRightLeft size={16} /> Trasladar Lote
          </button>
          <button onClick={() => setIsAddPaddockOpen(true)} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-emerald-600 text-white px-8 py-3.5 rounded-2xl text-[10px] font-black hover:bg-emerald-700 shadow-xl transition-all">
            <Plus size={16} /> Nuevo Potrero
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_PADDOCKS.map(p => (
          <div key={p.id} className="bg-white p-8 rounded-[48px] border border-slate-200 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden active:scale-95">
            <div className={`absolute top-0 right-0 px-8 py-3 rounded-bl-[32px] text-[10px] font-black uppercase tracking-widest ${p.status === 'Descanso' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
              {p.status}
            </div>
            <div className="flex justify-between items-start mb-6">
              <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-inner border border-slate-100">
                <MapPin size={24} />
              </div>
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase mb-2">{p.name}</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-black uppercase tracking-widest">Ocupación</span>
                <span className="font-black text-slate-800 tracking-tighter">{p.currentCount} / {p.capacity} Cab.</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-1000 ${p.currentCount/p.capacity > 0.8 ? 'bg-red-500' : 'bg-amber-500'}`} style={{ width: `${(p.currentCount/p.capacity)*100}%` }}></div>
              </div>
              <div className="pt-2 flex justify-between items-center">
                 <p className="text-[10px] text-slate-400 font-black uppercase">{p.area}</p>
                 <div className="flex items-center gap-1 text-[9px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase">
                    <Ruler size={10} /> {p.forageType || 'N/A'}
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isMoveModalOpen && <MoveAnimalModal onClose={() => setIsMoveModalOpen(false)} />}
      {isAddPaddockOpen && <AddPaddockModal onClose={() => setIsAddPaddockOpen(false)} />}
    </div>
  );
};

export default OperationsManagement;
