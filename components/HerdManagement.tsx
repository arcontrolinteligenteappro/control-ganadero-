
import React, { useState, useMemo, useRef } from 'react';
import { MOCK_ANIMALS, MOCK_HEALTH_RECORDS, MOCK_REPRODUCTION_RECORDS, MOCK_VETERINARIANS } from '../constants';
import { 
  Plus, QrCode, Search, Filter, ChevronRight, ChevronDown,
  X, Activity, Calendar as CalendarIcon, Sparkles,
  Tag as TagIcon, Save, Camera, FileDown, Trash2, Pencil,
  MapPin, Scale, Baby, History, Microscope, ShieldCheck,
  Stethoscope, Heart, Info, ArrowUpRight
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
      <div className="bg-white dark:bg-[#0a0f0d] w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden border border-slate-200 dark:border-[#10b981]/20 animate-in zoom-in-95">
        <div className="p-8 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-amber-600 dark:bg-[#10b981] text-white dark:text-black">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-white/20 dark:bg-black/10 rounded-2xl"><Plus size={24} /></div>
             <div>
                <h3 className="font-black text-xl uppercase tracking-tighter">Alta de Ejemplar Maestro</h3>
                <p className="text-[10px] font-bold text-white/80 dark:text-black/60 uppercase tracking-widest">Gestión de Especies y Propósitos</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-all"><X size={24} /></button>
        </div>

        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-2 gap-5">
             <div className="col-span-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-[#10b981]/40 uppercase tracking-widest ml-1 mb-2 block">Identificador Oficial (Arete)</label>
                <input 
                  type="text" 
                  placeholder="Ej: AR-9500" 
                  className="w-full p-5 bg-slate-50 dark:bg-black border-2 border-slate-100 dark:border-[#10b981]/20 rounded-3xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 dark:focus:border-[#10b981] outline-none font-black text-xl transition-all dark:text-[#10b981]"
                  value={animal.tagId}
                  onChange={e => setAnimal({...animal, tagId: e.target.value})}
                />
             </div>
             
             <div className="col-span-1">
                <label className="text-[10px] font-black text-slate-400 dark:text-[#10b981]/40 uppercase tracking-widest ml-1 mb-2 block">Especie / Tipo</label>
                <select 
                  className="w-full p-4 bg-slate-50 dark:bg-black border-2 border-slate-100 dark:border-[#10b981]/20 rounded-2xl font-bold text-slate-700 dark:text-[#10b981] outline-none focus:border-amber-500 transition-all"
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
                <label className="text-[10px] font-black text-slate-400 dark:text-[#10b981]/40 uppercase tracking-widest ml-1 mb-2 block">Categoría / Uso</label>
                <select 
                  className="w-full p-4 bg-slate-50 dark:bg-black border-2 border-slate-100 dark:border-[#10b981]/20 rounded-2xl font-bold text-slate-700 dark:text-[#10b981] outline-none focus:border-amber-500 transition-all"
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
                    className="w-full p-4 bg-amber-50 dark:bg-black border-2 border-amber-200 dark:border-[#10b981]/40 rounded-2xl font-bold outline-none dark:text-[#10b981]"
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
                    className="w-full p-4 bg-amber-50 dark:bg-black border-2 border-amber-200 dark:border-[#10b981]/40 rounded-2xl font-bold outline-none dark:text-[#10b981]"
                    value={customCategory}
                    onChange={e => setCustomCategory(e.target.value)}
                  />
               </div>
             )}

             <div className="col-span-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-[#10b981]/40 uppercase tracking-widest ml-1 mb-2 block">Raza / Variedad</label>
                <input 
                  type="text" 
                  placeholder="Ej: Brahman Gris, Hampshire..." 
                  className="w-full p-4 bg-slate-50 dark:bg-black border-2 border-slate-100 dark:border-[#10b981]/20 rounded-2xl font-bold outline-none focus:border-amber-500 dark:text-[#10b981] transition-all"
                  value={animal.breed}
                  onChange={e => setAnimal({...animal, breed: e.target.value})}
                />
             </div>

             <div className="col-span-1">
                <label className="text-[10px] font-black text-slate-400 dark:text-[#10b981]/40 uppercase tracking-widest ml-1 mb-2 block">Peso Actual (KG)</label>
                <input 
                  type="number" 
                  placeholder="0.00" 
                  className="w-full p-4 bg-slate-50 dark:bg-black border-2 border-slate-100 dark:border-[#10b981]/20 rounded-2xl font-black text-amber-600 dark:text-[#10b981] text-lg outline-none"
                  value={animal.weight}
                  onChange={e => setAnimal({...animal, weight: e.target.value})}
                />
             </div>

             <div className="col-span-1">
                <div className="flex justify-between items-end mb-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-[#10b981]/40 uppercase tracking-widest ml-1 block">Precio Mercado (USD)</label>
                  <button 
                    onClick={handleEstimateValue}
                    disabled={isEstimating}
                    className="flex items-center gap-1.5 text-[9px] font-black text-blue-600 dark:text-[#10b981] uppercase bg-blue-50 dark:bg-[#10b981]/10 px-3 py-1.5 rounded-xl border border-blue-100 dark:border-[#10b981]/30 hover:bg-blue-100 transition-all active:scale-95"
                  >
                    {isEstimating ? <Sparkles size={10} className="animate-spin" /> : <Sparkles size={10} />}
                    IA
                  </button>
                </div>
                <input 
                  type="number" 
                  placeholder="0.00" 
                  className="w-full p-4 bg-slate-50 dark:bg-black border-2 border-slate-100 dark:border-[#10b981]/20 rounded-2xl font-black text-emerald-600 dark:text-[#10b981] text-lg outline-none"
                  value={animal.price}
                  onChange={e => setAnimal({...animal, price: e.target.value})}
                />
             </div>
          </div>
        </div>

        <div className="p-8 bg-slate-50 dark:bg-black/50 border-t border-slate-100 dark:border-white/5 flex gap-4">
           <button onClick={onClose} className="flex-1 py-5 bg-white dark:bg-black border-2 border-slate-200 dark:border-[#10b981]/20 text-slate-400 dark:text-[#10b981]/40 font-black rounded-3xl hover:bg-slate-100 transition-all uppercase tracking-widest text-[10px]">Cancelar</button>
           <button onClick={() => { alert('Ejemplar guardado correctamente'); onClose(); }} className="flex-1 py-5 bg-amber-600 dark:bg-[#10b981] text-white dark:text-black font-black rounded-3xl hover:bg-amber-700 shadow-xl shadow-amber-600/20 transition-all uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 active:scale-95">
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
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  const itemsPerPage = 10;
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

  const handleRowClick = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleExportCSV = () => {
    if (filteredAnimals.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }
    const headers = ["ID Arete", "Especie", "Raza", "Categoria", "Estado Salud", "Edad (Meses)", "Peso (KG)", "Precio Est.", "Fecha Registro"];
    const rows = filteredAnimals.map(a => [a.tagId, a.type, a.breed, a.category, a.healthStatus, a.age, a.weight, a.price || 0, a.registrationDate]);
    let csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Hato_AR_CONTROL_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-[#10b981] tracking-tighter uppercase leading-tight">Inventario Biométrico</h2>
          <p className="text-slate-500 dark:text-[#10b981]/50 font-bold text-sm italic">Hato Activo: {filteredAnimals.length} ejemplares registrados.</p>
        </div>
        <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto pb-2">
          <div className="flex bg-white dark:bg-[#0a0f0d] p-1.5 rounded-2xl border border-slate-200 dark:border-[#10b981]/20 shadow-sm shrink-0">
            <button onClick={() => setViewMode('list')} className={`p-3 rounded-xl transition-all ${viewMode === 'list' ? (window.document.documentElement.classList.contains('dark') ? 'bg-[#10b981] text-black shadow-lg shadow-[#10b981]/30' : 'bg-slate-900 text-white shadow-lg') : 'text-slate-400 dark:text-[#10b981]/40'}`}><Activity size={18} /></button>
            <button onClick={() => setViewMode('calendar')} className={`p-3 rounded-xl transition-all ${viewMode === 'calendar' ? (window.document.documentElement.classList.contains('dark') ? 'bg-[#10b981] text-black shadow-lg shadow-[#10b981]/30' : 'bg-slate-900 text-white shadow-lg') : 'text-slate-400 dark:text-[#10b981]/40'}`}><CalendarIcon size={18} /></button>
          </div>
          <button onClick={handleExportCSV} className="flex items-center gap-2 bg-white dark:bg-[#0a0f0d] border-2 border-slate-200 dark:border-[#10b981]/20 px-6 py-3.5 rounded-2xl text-[10px] font-black text-slate-800 dark:text-[#10b981] hover:bg-slate-50 dark:hover:bg-[#10b981]/10 shadow-sm transition-all uppercase tracking-widest active:scale-95 shrink-0">
            <FileDown size={16} /> Exportar
          </button>
          <button onClick={() => setIsManualAddOpen(true)} className="flex items-center gap-2 bg-white dark:bg-[#0a0f0d] border-2 border-slate-200 dark:border-[#10b981]/20 px-6 py-3.5 rounded-2xl text-[10px] font-black text-slate-800 dark:text-[#10b981] hover:bg-slate-50 dark:hover:bg-[#10b981]/10 shadow-sm transition-all uppercase tracking-widest active:scale-95 shrink-0"><Plus size={16} /> Alta Manual</button>
          <button className="flex items-center gap-2 bg-amber-600 dark:bg-[#10b981] text-white dark:text-black px-8 py-3.5 rounded-2xl text-[10px] font-black hover:bg-amber-700 dark:hover:bg-[#10b981]/80 shadow-xl transition-all uppercase tracking-widest active:scale-95 shrink-0"><QrCode size={16} /> Escaneo QR</button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0a1411] p-8 rounded-[40px] border border-slate-200 dark:border-[#10b981]/20 shadow-sm flex flex-col lg:flex-row gap-6 items-end tech-card">
        <div className="flex-1 w-full">
           <label className="text-[10px] font-black text-slate-400 dark:text-[#10b981]/40 uppercase tracking-widest ml-1 mb-2 block">Filtrar por Arete / Raza</label>
           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-[#10b981]/40" size={18} />
              <input 
                type="text" 
                placeholder="Ej: AR-10..." 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-black border-none rounded-2xl text-xs font-bold outline-none focus:ring-4 focus:ring-amber-500/10 dark:focus:ring-[#10b981]/10 transition-all dark:text-[#10b981]"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
           </div>
        </div>
        <div className="w-full lg:w-48">
           <label className="text-[10px] font-black text-slate-400 dark:text-[#10b981]/40 uppercase tracking-widest ml-1 mb-2 block">Especie</label>
           <select value={selectedType} onChange={e => setSelectedType(e.target.value)} className="w-full p-4 bg-slate-50 dark:bg-black dark:text-[#10b981] border-none rounded-2xl text-xs font-bold outline-none transition-all appearance-none">
             {animalTypes.map(t => <option key={t} value={t}>{t}</option>)}
           </select>
        </div>
        <div className="w-full lg:w-48">
           <label className="text-[10px] font-black text-slate-400 dark:text-[#10b981]/40 uppercase tracking-widest ml-1 mb-2 block">Estado de Salud</label>
           <select value={selectedHealth} onChange={e => setSelectedHealth(e.target.value)} className="w-full p-4 bg-slate-50 dark:bg-black dark:text-[#10b981] border-none rounded-2xl text-xs font-bold outline-none transition-all appearance-none">
             {healthOptions.map(h => <option key={h} value={h}>{h}</option>)}
           </select>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0a0f0d] rounded-[40px] border border-slate-200 dark:border-[#10b981]/20 overflow-hidden shadow-sm relative">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-black text-slate-400 dark:text-[#10b981]/40 text-[10px] uppercase tracking-widest font-black">
                <th className="px-8 py-6">Perfil</th>
                <th className="px-8 py-6">Ejemplar / Raza</th>
                <th className="px-8 py-6">ID Arete</th>
                <th className="px-8 py-6">Salud</th>
                <th className="px-8 py-6 text-right">Peso (KG)</th>
                <th className="px-8 py-6 text-right">Valor Est.</th>
                <th className="px-8 py-6 text-center w-20"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-bold">
              {paginatedAnimals.map((animal) => {
                const healthRecords = MOCK_HEALTH_RECORDS.filter(r => r.animalId === animal.id);
                const reproductionRecords = MOCK_REPRODUCTION_RECORDS.filter(r => r.animalId === animal.id);
                
                return (
                  <React.Fragment key={animal.id}>
                    <tr 
                      onClick={() => handleRowClick(animal.id)}
                      className={`cursor-pointer transition-all duration-300 group ${expandedId === animal.id ? 'bg-amber-50/50 dark:bg-[#10b981]/5' : 'hover:bg-slate-50/80 dark:hover:bg-[#10b981]/5'}`}
                    >
                      <td className="px-8 py-5">
                        <div className="w-14 h-14 rounded-[22px] overflow-hidden border-2 border-slate-100 dark:border-[#10b981]/20 shadow-sm group-hover:border-amber-400 dark:group-hover:border-[#10b981] transition-all">
                          <img src={animal.imageUrl} className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <p className="text-slate-900 dark:text-[#10b981] uppercase tracking-tighter text-lg">{animal.breed}</p>
                        <p className="text-[9px] text-slate-400 dark:text-[#10b981]/40 uppercase tracking-widest">{animal.type} • {animal.category}</p>
                      </td>
                      <td className="px-8 py-5">
                        <span className="px-4 py-2 bg-slate-900 dark:bg-[#10b981]/10 text-amber-500 dark:text-[#10b981] rounded-2xl text-[10px] font-mono font-black border border-slate-800 dark:border-[#10b981]/30 flex items-center gap-2 w-fit shadow-lg">
                          <TagIcon size={12} /> {animal.tagId}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${
                          animal.healthStatus === HealthStatus.EXCELENTE ? 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-500 dark:border-emerald-500/30' :
                          animal.healthStatus === HealthStatus.BUENO ? 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-500 dark:border-blue-500/30' :
                          animal.healthStatus === HealthStatus.EN_TRATAMIENTO ? 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-500 dark:border-amber-500/30' :
                          'bg-red-100 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-500 dark:border-red-500/30'
                        }`}>
                          {animal.healthStatus}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right text-slate-900 dark:text-[#10b981] text-lg tracking-tighter">{animal.weight}</td>
                      <td className="px-8 py-5 text-right text-emerald-600 dark:text-emerald-400 font-black text-lg tracking-tighter">${animal.price?.toLocaleString() || '0'}</td>
                      <td className="px-8 py-5 text-center">
                        <div className={`p-2 rounded-full transition-transform duration-500 ${expandedId === animal.id ? 'rotate-180 bg-amber-200 dark:bg-[#10b981] text-amber-900 dark:text-black' : 'text-slate-300 dark:text-[#10b981]/20 hover:bg-slate-100'}`}>
                          <ChevronDown size={20} />
                        </div>
                      </td>
                    </tr>
                    
                    {expandedId === animal.id && (
                      <tr className="animate-in fade-in slide-in-from-top-4 duration-500">
                        <td colSpan={7} className="px-10 py-12 bg-slate-50/80 dark:bg-black/40 border-y border-slate-100 dark:border-[#10b981]/10">
                          <div className="flex flex-col lg:flex-row gap-12">
                            {/* Visual & Core Controls */}
                            <div className="lg:w-1/3 space-y-8">
                              <div className="aspect-video rounded-[40px] overflow-hidden border-4 border-white dark:border-[#10b981]/20 shadow-2xl relative group">
                                 <img src={animal.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                    <button className="flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest"><Camera size={14} /> Actualizar Foto</button>
                                 </div>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <div className="p-5 bg-white dark:bg-black rounded-3xl border border-slate-100 dark:border-[#10b981]/10 shadow-sm">
                                   <div className="flex items-center gap-3 text-amber-600 mb-2"><Scale size={18} /> <span className="text-[9px] font-black uppercase">Masa Corporal</span></div>
                                   <p className="text-3xl font-black text-slate-800 dark:text-[#10b981] tracking-tighter">{animal.weight} KG</p>
                                </div>
                                <div className="p-5 bg-white dark:bg-black rounded-3xl border border-slate-100 dark:border-[#10b981]/10 shadow-sm">
                                   <div className="flex items-center gap-3 text-blue-600 mb-2"><Baby size={18} /> <span className="text-[9px] font-black uppercase">Edad</span></div>
                                   <p className="text-3xl font-black text-slate-800 dark:text-[#10b981] tracking-tighter">{animal.age} M</p>
                                </div>
                              </div>

                              <div className="p-6 bg-[#1a2421] dark:bg-[#10b981]/10 rounded-[32px] border border-white/5 dark:border-[#10b981]/20">
                                <h5 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-4 flex items-center gap-2"><MapPin size={12}/> Geoubicación</h5>
                                <p className="text-white dark:text-[#10b981] font-black text-lg uppercase tracking-tighter">{animal.location}</p>
                                <p className="text-slate-400 dark:text-[#10b981]/50 text-[9px] font-bold uppercase mt-1 tracking-widest">Sincronizado vía GPS_CORE</p>
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                <button className="flex items-center justify-center gap-2 py-4 bg-white dark:bg-black border border-slate-200 dark:border-[#10b981]/20 rounded-2xl text-[10px] font-black uppercase text-slate-700 dark:text-[#10b981] hover:bg-slate-50 transition-all shadow-sm">
                                  <Pencil size={14} /> Editar Perfil
                                </button>
                                <button className="flex items-center justify-center gap-2 py-4 bg-white dark:bg-black border border-slate-200 dark:border-[#10b981]/20 rounded-2xl text-[10px] font-black uppercase text-red-500 hover:bg-red-50 transition-all shadow-sm">
                                  <Trash2 size={14} /> Baja del Hato
                                </button>
                              </div>
                            </div>

                            {/* Deep Data Columns */}
                            <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8">
                               {/* Sanidad Column */}
                               <div className="space-y-6">
                                  <div className="flex justify-between items-center px-2">
                                     <h4 className="text-[11px] font-black text-slate-400 dark:text-[#10b981]/40 uppercase tracking-[0.3em] flex items-center gap-2">
                                        <Stethoscope size={16} className="text-red-500" /> Bitácora Sanitaria
                                     </h4>
                                     <button className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg"><Plus size={14} /></button>
                                  </div>
                                  <div className="space-y-3">
                                     {healthRecords.length > 0 ? healthRecords.map(hr => {
                                       const vet = MOCK_VETERINARIANS.find(v => v.id === hr.veterinarianId);
                                       return (
                                         <div key={hr.id} className="p-5 bg-white dark:bg-black/60 rounded-3xl border border-slate-100 dark:border-[#10b981]/10 shadow-sm group">
                                            <div className="flex justify-between items-start mb-2">
                                               <p className="text-[10px] font-black text-slate-900 dark:text-[#10b981] uppercase">{hr.type}</p>
                                               <span className="text-[9px] font-bold text-slate-400">{hr.date}</span>
                                            </div>
                                            <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">{hr.description}</p>
                                            <div className="flex items-center justify-between border-t border-slate-50 dark:border-white/5 pt-3">
                                               <div className="flex items-center gap-2">
                                                  <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-[8px] font-black">{vet?.name[0]}</div>
                                                  <span className="text-[9px] font-black text-slate-400 uppercase">{vet?.alias || vet?.name}</span>
                                               </div>
                                               <ArrowUpRight size={12} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                         </div>
                                       );
                                     }) : (
                                       <div className="py-10 text-center bg-white dark:bg-black/20 rounded-[32px] border border-dashed border-slate-200 dark:border-[#10b981]/10">
                                          <ShieldCheck size={32} className="mx-auto text-slate-200 dark:text-[#10b981]/10 mb-2" />
                                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sin antecedentes clínicos</p>
                                       </div>
                                     )}
                                  </div>
                               </div>

                               {/* Reproducción & Genética Column */}
                               <div className="space-y-6">
                                  <div className="flex justify-between items-center px-2">
                                     <h4 className="text-[11px] font-black text-slate-400 dark:text-[#10b981]/40 uppercase tracking-[0.3em] flex items-center gap-2">
                                        <Heart size={16} className="text-pink-500" /> Ciclo Reproductivo
                                     </h4>
                                     <button className="p-1.5 hover:bg-pink-50 text-pink-500 rounded-lg"><Plus size={14} /></button>
                                  </div>
                                  <div className="space-y-3">
                                     {reproductionRecords.length > 0 ? reproductionRecords.map(rr => (
                                       <div key={rr.id} className="p-5 bg-white dark:bg-black/60 rounded-3xl border border-slate-100 dark:border-[#10b981]/10 shadow-sm">
                                          <div className="flex justify-between items-start mb-2">
                                             <p className="text-[10px] font-black text-pink-600 dark:text-[#10b981] uppercase">{rr.event}</p>
                                             <span className="text-[9px] font-bold text-slate-400">{rr.date}</span>
                                          </div>
                                          <div className="flex items-center gap-2 mb-2">
                                             <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase ${rr.result === 'Pendiente' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>{rr.result}</span>
                                          </div>
                                          <p className="text-[10px] italic text-slate-400 leading-relaxed">"{rr.notes || 'Sin anotaciones adicionales'}"</p>
                                       </div>
                                     )) : (
                                       <div className="py-10 text-center bg-white dark:bg-black/20 rounded-[32px] border border-dashed border-slate-200 dark:border-[#10b981]/10">
                                          <Info size={32} className="mx-auto text-slate-200 dark:text-[#10b981]/10 mb-2" />
                                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sin registros reproductivos</p>
                                       </div>
                                     )}
                                  </div>
                                  
                                  <div className="mt-8 space-y-3">
                                     <h4 className="text-[11px] font-black text-slate-400 dark:text-[#10b981]/40 uppercase tracking-[0.3em] px-2 mb-4">Herramientas Pro</h4>
                                     <button className="w-full p-5 bg-slate-900 dark:bg-[#10b981] text-white dark:text-black rounded-[24px] font-black text-[11px] uppercase tracking-widest flex items-center justify-between hover:scale-[1.02] transition-all shadow-xl">
                                        <div className="flex items-center gap-3"><Sparkles size={18} /> Valuación Mercado IA</div>
                                        <ChevronRight size={16} />
                                     </button>
                                     <button className="w-full p-5 bg-white dark:bg-black border-2 border-slate-100 dark:border-[#10b981]/20 text-slate-700 dark:text-[#10b981] rounded-[24px] font-black text-[11px] uppercase tracking-widest flex items-center justify-between hover:bg-slate-50 transition-all">
                                        <div className="flex items-center gap-3"><QrCode size={18} className="text-amber-500" /> Exportar Ficha SINIIGA</div>
                                        <ChevronRight size={16} />
                                     </button>
                                  </div>
                               </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
        
        <div className="p-8 bg-slate-50 dark:bg-black border-t border-slate-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="text-[10px] font-black text-slate-400 dark:text-[#10b981]/40 uppercase tracking-widest">
              Mostrando {paginatedAnimals.length} de {filteredAnimals.length} ejemplares
           </div>
           <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-6 py-3 bg-white dark:bg-black border border-slate-200 dark:border-[#10b981]/20 rounded-xl font-black text-[10px] uppercase tracking-widest disabled:opacity-30 hover:bg-slate-50 transition-all dark:text-[#10b981]"
              >
                Anterior
              </button>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(Math.ceil(filteredAnimals.length / itemsPerPage), prev + 1))}
                disabled={currentPage >= Math.ceil(filteredAnimals.length / itemsPerPage)}
                className="px-6 py-3 bg-white dark:bg-black border border-slate-200 dark:border-[#10b981]/20 rounded-xl font-black text-[10px] uppercase tracking-widest disabled:opacity-30 hover:bg-slate-50 transition-all dark:text-[#10b981]"
              >
                Siguiente
              </button>
           </div>
        </div>
      </div>

      {isManualAddOpen && <ManualAddAnimalModal onClose={() => setIsManualAddOpen(false)} />}
    </div>
  );
};

export default HerdManagement;
