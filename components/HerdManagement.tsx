
import React, { useState, useMemo, useRef } from 'react';
import { MOCK_ANIMALS } from '../constants';
import { 
  Plus, QrCode, Search, Filter, ChevronRight, 
  X, Activity, Calendar as CalendarIcon, Sparkles,
  Tag as TagIcon, Save, Camera, FileDown
} from 'lucide-react';
import { Animal, AnimalCategory, AnimalType, HealthStatus } from '../types';
import { estimateValue } from '../services/geminiService';

const ManualAddAnimalModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [animal, setAnimal] = useState({
    tagId: '',
    type: AnimalType.BOVINO as string,
    breed: '',
    age: '',
    weight: '',
    sex: 'M',
    category: AnimalCategory.ENGORDE as string,
    location: 'Rancho Principal',
    price: ''
  });

  const [customType, setCustomType] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [isOtherType, setIsOtherType] = useState(false);
  const [isOtherCategory, setIsOtherCategory] = useState(false);
  const [isEstimating, setIsEstimating] = useState(false);

  const handleEstimateValue = async () => {
    if (!animal.type || !animal.breed || !animal.weight) {
      alert("Por favor ingresa Especie, Raza y Peso.");
      return;
    }
    setIsEstimating(true);
    try {
      const result = await estimateValue({
        type: (isOtherType ? customType : animal.type) as any,
        breed: animal.breed,
        age: parseInt(animal.age) || 0,
        weight: parseFloat(animal.weight) || 0,
        category: (isOtherCategory ? customCategory : animal.category) as any,
        location: animal.location
      });
      if (result.minPrice) setAnimal(prev => ({ ...prev, price: result.minPrice.toString() }));
    } catch (error) {
      console.error(error);
    } finally {
      setIsEstimating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-amber-600 text-white">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-white/20 rounded-2xl"><Plus size={24} /></div>
             <div>
                <h3 className="font-black text-xl uppercase tracking-tighter">Alta de Ejemplar Maestro</h3>
                <p className="text-[10px] font-bold text-white/80 uppercase tracking-widest">Gestión de Especies y Propósitos</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-all"><X size={24} /></button>
        </div>

        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-2 gap-5">
             <div className="col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Identificador Oficial (Arete)</label>
                <input 
                  type="text" 
                  placeholder="Ej: AR-9500" 
                  className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-3xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none font-black text-xl transition-all"
                  value={animal.tagId}
                  onChange={e => setAnimal({...animal, tagId: e.target.value})}
                />
             </div>
             
             <div className="col-span-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Especie / Tipo</label>
                <select 
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:border-amber-500 transition-all"
                  value={isOtherType ? "OTRO" : animal.type}
                  onChange={e => {
                    const val = e.target.value;
                    if (val === "OTRO") {
                      setIsOtherType(true);
                    } else {
                      setIsOtherType(false);
                      setAnimal({...animal, type: val});
                    }
                  }}
                >
                  {Object.values(AnimalType).map(t => <option key={t} value={t}>{t}</option>)}
                  <option value="OTRO" className="text-amber-600 font-black">✨ OTRA ESPECIE...</option>
                </select>
             </div>

             <div className="col-span-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Categoría / Uso</label>
                <select 
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:border-amber-500 transition-all"
                  value={isOtherCategory ? "OTRO" : animal.category}
                  onChange={e => {
                    const val = e.target.value;
                    if (val === "OTRO") {
                      setIsOtherCategory(true);
                    } else {
                      setIsOtherCategory(false);
                      setAnimal({...animal, category: val});
                    }
                  }}
                >
                  {Object.values(AnimalCategory).map(c => <option key={c} value={c}>{c}</option>)}
                  <option value="OTRO" className="text-amber-600 font-black">✨ OTRA CATEGORÍA...</option>
                </select>
             </div>

             {isOtherType && (
               <div className="col-span-1 animate-in slide-in-from-top-2">
                  <label className="text-[10px] font-black text-amber-600 uppercase tracking-widest ml-1 mb-2 block">Especifique Nueva Especie</label>
                  <input 
                    type="text" 
                    placeholder="Ej: Aves, Apícola..." 
                    className="w-full p-4 bg-amber-50 border-2 border-amber-200 rounded-2xl font-bold outline-none"
                    value={customType}
                    onChange={e => setCustomType(e.target.value)}
                  />
               </div>
             )}

             {isOtherCategory && (
               <div className="col-span-1 animate-in slide-in-from-top-2">
                  <label className="text-[10px] font-black text-amber-600 uppercase tracking-widest ml-1 mb-2 block">Especifique Nueva Categoría</label>
                  <input 
                    type="text" 
                    placeholder="Ej: Exhibición, Mascotas..." 
                    className="w-full p-4 bg-amber-50 border-2 border-amber-200 rounded-2xl font-bold outline-none"
                    value={customCategory}
                    onChange={e => setCustomCategory(e.target.value)}
                  />
               </div>
             )}

             <div className="col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Raza / Variedad</label>
                <input 
                  type="text" 
                  placeholder="Ej: Brahman Gris, Hampshire..." 
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none focus:border-amber-500 transition-all"
                  value={animal.breed}
                  onChange={e => setAnimal({...animal, breed: e.target.value})}
                />
             </div>

             <div className="col-span-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Peso Actual (KG)</label>
                <input 
                  type="number" 
                  placeholder="0.00" 
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-amber-600 text-lg outline-none"
                  value={animal.weight}
                  onChange={e => setAnimal({...animal, weight: e.target.value})}
                />
             </div>

             <div className="col-span-1">
                <div className="flex justify-between items-end mb-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Precio Mercado (USD)</label>
                  <button 
                    onClick={handleEstimateValue}
                    disabled={isEstimating}
                    className="flex items-center gap-1.5 text-[9px] font-black text-blue-600 uppercase bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100 hover:bg-blue-100 transition-all active:scale-95"
                  >
                    {isEstimating ? <Sparkles size={10} className="animate-spin" /> : <Sparkles size={10} />}
                    IA
                  </button>
                </div>
                <input 
                  type="number" 
                  placeholder="0.00" 
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-emerald-600 text-lg outline-none"
                  value={animal.price}
                  onChange={e => setAnimal({...animal, price: e.target.value})}
                />
             </div>
          </div>
        </div>

        <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
           <button onClick={onClose} className="flex-1 py-5 bg-white border-2 border-slate-200 text-slate-400 font-black rounded-3xl hover:bg-slate-100 transition-all uppercase tracking-widest text-[10px]">Cancelar</button>
           <button onClick={() => { alert('Ejemplar guardado correctamente'); onClose(); }} className="flex-1 py-5 bg-amber-600 text-white font-black rounded-3xl hover:bg-amber-700 shadow-xl shadow-amber-600/20 transition-all uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 active:scale-95">
             <Save size={18} /> Registrar en Hato
           </button>
        </div>
      </div>
    </div>
  );
};

const HerdManagement: React.FC = () => {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('Todos');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedHealth, setSelectedHealth] = useState('Todos');
  const [currentPage, setCurrentPage] = useState(1);
  const [isManualAddOpen, setIsManualAddOpen] = useState(false);
  
  const itemsPerPage = 8;
  const animalTypes = useMemo(() => ['Todos', ...Object.values(AnimalType)], []);
  const categories = useMemo(() => ['Todas', ...Object.values(AnimalCategory)], []);
  const healthOptions = useMemo(() => ['Todos', ...Object.values(HealthStatus)], []);

  const filteredAnimals = useMemo(() => {
    return MOCK_ANIMALS.filter(animal => {
      const searchStr = searchQuery.toLowerCase();
      const matchesSearch = animal.tagId.toLowerCase().includes(searchStr) || animal.breed.toLowerCase().includes(searchStr);
      const matchesType = selectedType === 'Todos' || animal.type === selectedType;
      const matchesCategory = selectedCategory === 'Todas' || animal.category === selectedCategory;
      const matchesHealth = selectedHealth === 'Todos' || animal.healthStatus === selectedHealth;
      return matchesSearch && matchesType && matchesCategory && matchesHealth;
    });
  }, [searchQuery, selectedType, selectedCategory, selectedHealth]);

  const paginatedAnimals = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAnimals.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAnimals, currentPage]);

  const handleExportCSV = () => {
    if (filteredAnimals.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }
    
    const headers = ["ID Arete", "Especie", "Raza", "Categoria", "Estado Salud", "Edad (Meses)", "Peso (KG)", "Precio Est.", "Fecha Registro"];
    const rows = filteredAnimals.map(a => [
      a.tagId,
      a.type,
      a.breed,
      a.category,
      a.healthStatus,
      a.age,
      a.weight,
      a.price || 0,
      a.registrationDate
    ]);
    
    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Hato_AR_CONTROL_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-tight">Gestión del Hato Maestro</h2>
          <p className="text-slate-500 font-bold text-sm italic">Inventario vivo: {filteredAnimals.length} ejemplares registrados.</p>
        </div>
        <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto pb-2">
          <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm shrink-0">
            <button onClick={() => setViewMode('list')} className={`p-3 rounded-xl transition-all ${viewMode === 'list' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400'}`}><Activity size={18} /></button>
            <button onClick={() => setViewMode('calendar')} className={`p-3 rounded-xl transition-all ${viewMode === 'calendar' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400'}`}><CalendarIcon size={18} /></button>
          </div>
          <button onClick={handleExportCSV} className="flex items-center gap-2 bg-white border-2 border-slate-200 px-6 py-3.5 rounded-2xl text-[10px] font-black text-slate-800 hover:bg-slate-50 shadow-sm transition-all uppercase tracking-widest active:scale-95 shrink-0">
            <FileDown size={16} /> Exportar CSV
          </button>
          <button onClick={() => setIsManualAddOpen(true)} className="flex items-center gap-2 bg-white border-2 border-slate-200 px-6 py-3.5 rounded-2xl text-[10px] font-black text-slate-800 hover:bg-slate-50 shadow-sm transition-all uppercase tracking-widest active:scale-95 shrink-0"><Plus size={16} /> Alta Manual</button>
          <button className="flex items-center gap-2 bg-amber-600 text-white px-8 py-3.5 rounded-2xl text-[10px] font-black hover:bg-amber-700 shadow-xl transition-all uppercase tracking-widest active:scale-95 shrink-0"><QrCode size={16} /> Escaneo QR</button>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-6 items-end">
        <div className="flex-1 w-full">
           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Buscar por Identificador</label>
           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Ej: AR-10..." 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-xs font-bold outline-none focus:ring-4 focus:ring-amber-500/10 transition-all"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
           </div>
        </div>
        <div className="w-full lg:w-40">
           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Especie</label>
           <select 
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="w-full p-4 bg-slate-50 border-none rounded-2xl text-xs font-bold outline-none focus:ring-4 focus:ring-amber-500/10 transition-all"
           >
             {animalTypes.map(t => <option key={t} value={t}>{t}</option>)}
           </select>
        </div>
        <div className="w-full lg:w-40">
           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Categoría</label>
           <select 
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="w-full p-4 bg-slate-50 border-none rounded-2xl text-xs font-bold outline-none focus:ring-4 focus:ring-amber-500/10 transition-all"
           >
             {categories.map(c => <option key={c} value={c}>{c}</option>)}
           </select>
        </div>
        <div className="w-full lg:w-40">
           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Estado de Salud</label>
           <select 
            value={selectedHealth}
            onChange={e => setSelectedHealth(e.target.value)}
            className="w-full p-4 bg-slate-50 border-none rounded-2xl text-xs font-bold outline-none focus:ring-4 focus:ring-amber-500/10 transition-all"
           >
             {healthOptions.map(h => <option key={h} value={h}>{h}</option>)}
           </select>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-[10px] uppercase tracking-widest font-black">
                <th className="px-8 py-6">Ejemplar</th>
                <th className="px-8 py-6">Ficha / Especie</th>
                <th className="px-8 py-6">ID Arete</th>
                <th className="px-8 py-6">Salud</th>
                <th className="px-8 py-6 text-right">Peso (KG)</th>
                <th className="px-8 py-6 text-right">Valor Est.</th>
                <th className="px-8 py-6 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-bold">
              {paginatedAnimals.map((animal) => (
                <tr key={animal.id} className="hover:bg-slate-50/80 transition-all group">
                  <td className="px-8 py-5">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-slate-100 shadow-sm group-hover:border-amber-400 transition-all">
                      <img src={animal.imageUrl} className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-slate-900 uppercase tracking-tighter">{animal.breed}</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest">{animal.type} • {animal.category}</p>
                  </td>
                  <td className="px-8 py-5">
                    <span className="px-3 py-1.5 bg-slate-900 text-amber-500 rounded-xl text-[10px] font-mono font-black border border-slate-800 flex items-center gap-2 w-fit">
                      <TagIcon size={12} /> {animal.tagId}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                      animal.healthStatus === HealthStatus.EXCELENTE ? 'bg-emerald-100 text-emerald-700' :
                      animal.healthStatus === HealthStatus.BUENO ? 'bg-blue-100 text-blue-700' :
                      animal.healthStatus === HealthStatus.EN_TRATAMIENTO ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {animal.healthStatus}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right text-slate-900">{animal.weight}</td>
                  <td className="px-8 py-5 text-right text-emerald-600 font-black">${animal.price?.toLocaleString() || '0'}</td>
                  <td className="px-8 py-5 text-center">
                    <button className="p-3 bg-white text-slate-300 hover:text-amber-600 rounded-xl border border-slate-100 transition-all shadow-sm"><ChevronRight size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isManualAddOpen && <ManualAddAnimalModal onClose={() => setIsManualAddOpen(false)} />}
    </div>
  );
};

export default HerdManagement;
