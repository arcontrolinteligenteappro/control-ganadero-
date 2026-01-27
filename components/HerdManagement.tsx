
import React, { useState, useMemo } from 'react';
import { MOCK_ANIMALS, MOCK_HEALTH_RECORDS, MOCK_REPRODUCTION_RECORDS } from '../constants';
import { 
  Plus, QrCode, Search, Filter, FileText, ChevronRight, 
  X, Info, Stethoscope, Baby, Activity, Weight, Calendar, MapPin, Sparkles,
  Tag as TagIcon, CreditCard, Scan
} from 'lucide-react';
import { Animal, AnimalCategory, HealthStatus, AnimalType } from '../types';
import { getHealthRecommendation } from '../services/geminiService';

const TagRegistrationModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [selectedAnimal, setSelectedAnimal] = useState('');
  const [tagId, setTagId] = useState('');
  const [tagType, setTagType] = useState<'RFID' | 'QR' | 'Visual'>('RFID');

  const handleRegister = () => {
    // Aquí iría la lógica para actualizar el animal en el backend/estado
    alert(`Arete ${tagId} (${tagType}) asignado exitosamente.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-black text-slate-800 flex items-center gap-2">
            <TagIcon size={20} className="text-green-600" />
            Registro de Arete
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <div className="p-8 space-y-6">
          {step === 1 ? (
            <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
              <p className="text-sm text-slate-500 font-medium text-center">Seleccione el animal al que desea asignar un nuevo identificador.</p>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Buscar Animal</label>
                <select 
                  className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-green-500 font-bold text-slate-700"
                  value={selectedAnimal}
                  onChange={(e) => setSelectedAnimal(e.target.value)}
                >
                  <option value="">Seleccionar ejemplar...</option>
                  {MOCK_ANIMALS.map(a => (
                    <option key={a.id} value={a.id}>{a.breed} - {a.tagId} (#{a.id})</option>
                  ))}
                </select>
              </div>
              <button 
                disabled={!selectedAnimal}
                onClick={() => setStep(2)}
                className="w-full py-4 bg-green-600 text-white font-black rounded-2xl hover:bg-green-700 disabled:opacity-50 transition-all shadow-lg shadow-green-600/20"
              >
                Continuar
              </button>
            </div>
          ) : (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="flex justify-center gap-4">
                {[
                  { id: 'RFID', icon: <CreditCard size={20} />, label: 'RFID' },
                  { id: 'QR', icon: <Scan size={20} />, label: 'QR' },
                  { id: 'Visual', icon: <TagIcon size={20} />, label: 'Visual' }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTagType(t.id as any)}
                    className={`flex-1 p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                      tagType === t.id ? 'border-green-500 bg-green-50 text-green-700' : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'
                    }`}
                  >
                    {t.icon}
                    <span className="text-[10px] font-black uppercase">{t.label}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Código del Arete</label>
                <input 
                  type="text" 
                  placeholder="Ej: RFID-900234..."
                  className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-green-500 font-bold text-slate-700 placeholder:text-slate-300"
                  value={tagId}
                  onChange={(e) => setTagId(e.target.value)}
                />
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setStep(1)}
                  className="flex-1 py-4 bg-slate-100 text-slate-600 font-black rounded-2xl hover:bg-slate-200 transition-all"
                >
                  Atrás
                </button>
                <button 
                  disabled={!tagId}
                  onClick={handleRegister}
                  className="flex-1 py-4 bg-green-600 text-white font-black rounded-2xl hover:bg-green-700 disabled:opacity-50 transition-all shadow-lg shadow-green-600/20"
                >
                  Asignar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AnimalDetailModal: React.FC<{ animal: Animal; onClose: () => void }> = ({ animal, onClose }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'health' | 'repro'>('info');
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const healthRecords = useMemo(() => MOCK_HEALTH_RECORDS.filter(r => r.animalId === animal.id), [animal.id]);
  const reproRecords = useMemo(() => MOCK_REPRODUCTION_RECORDS.filter(r => r.animalId === animal.id), [animal.id]);

  const handleAiAnalysis = async () => {
    setLoadingAi(true);
    const result = await getHealthRecommendation(animal, healthRecords);
    setAiInsight(result);
    setLoadingAi(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-4 duration-300">
        {/* Header con Imagen */}
        <div className="relative h-48 md:h-64 shrink-0">
          <img src={animal.imageUrl} className="w-full h-full object-cover" alt={animal.breed} />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition-all z-10"
          >
            <X size={24} />
          </button>
          <div className="absolute bottom-6 left-8 text-white">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 bg-green-500 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <TagIcon size={10} /> {animal.tagId}
              </span>
              <span className="px-2 py-0.5 bg-white/20 backdrop-blur-md rounded text-[10px] font-bold uppercase">
                {animal.category}
              </span>
            </div>
            <h2 className="text-3xl font-bold">{animal.breed} <span className="text-slate-300 font-light ml-1 text-2xl">#{animal.id}</span></h2>
          </div>
        </div>

        {/* Pestañas de Navegación */}
        <div className="flex border-b border-slate-100 px-8 bg-white sticky top-0 z-20">
          {[
            { id: 'info', label: 'General', icon: <Info size={18} /> },
            { id: 'health', label: 'Sanidad', icon: <Stethoscope size={18} /> },
            { id: 'repro', label: 'Reproducción', icon: <Baby size={18} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all border-b-2 ${
                activeTab === tab.id ? 'border-green-600 text-green-600' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Contenido Desplazable */}
        <div className="flex-1 overflow-y-auto p-8">
          {activeTab === 'info' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="text-slate-400 mb-1 flex items-center gap-2"><Activity size={14} /> <span className="text-[10px] font-black uppercase tracking-tighter">Tipo</span></div>
                  <p className="font-bold text-slate-800">{animal.type}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="text-slate-400 mb-1 flex items-center gap-2"><Weight size={14} /> <span className="text-[10px] font-black uppercase tracking-tighter">Peso</span></div>
                  <p className="font-bold text-slate-800">{animal.weight} kg</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="text-slate-400 mb-1 flex items-center gap-2"><Calendar size={14} /> <span className="text-[10px] font-black uppercase tracking-tighter">Edad</span></div>
                  <p className="font-bold text-slate-800">{animal.age} meses</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="text-slate-400 mb-1 flex items-center gap-2"><TagIcon size={14} /> <span className="text-[10px] font-black uppercase tracking-tighter">Arete</span></div>
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-slate-800 truncate">{animal.tagId}</p>
                    <button className="text-[10px] font-black text-green-600 hover:underline">Cambiar</button>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2 text-green-700">
                    <Sparkles size={20} className="animate-pulse" />
                    <h4 className="font-bold">Análisis Sanitario Predictivo IA</h4>
                  </div>
                  {!aiInsight && (
                    <button 
                      onClick={handleAiAnalysis}
                      disabled={loadingAi}
                      className="px-4 py-2 bg-green-600 text-white text-xs font-bold rounded-xl hover:bg-green-700 transition-all disabled:opacity-50 shadow-md shadow-green-600/20"
                    >
                      {loadingAi ? 'Analizando Historial...' : 'Generar Reporte IA'}
                    </button>
                  )}
                </div>
                {aiInsight ? (
                  <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-white">
                    <p className="text-sm text-green-900 leading-relaxed whitespace-pre-line">
                      {aiInsight}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-green-600/70 italic">
                    Utilice la IA para analizar los {healthRecords.length} registros sanitarios actuales y predecir necesidades futuras de este ejemplar.
                  </p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'health' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              {healthRecords.length > 0 ? (
                healthRecords.map((record) => (
                  <div key={record.id} className="flex gap-4 p-5 border border-slate-100 rounded-2xl hover:bg-slate-50 hover:border-blue-100 transition-all">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                      <Stethoscope size={24} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <h5 className="font-bold text-slate-800">{record.type}</h5>
                        <span className="text-xs text-slate-400 font-bold bg-slate-100 px-2 py-1 rounded-lg">{record.date}</span>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{record.description}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vet. Responsable: {record.veterinarian}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16 text-slate-400 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                  <Stethoscope size={48} className="mx-auto mb-4 opacity-10" />
                  <p className="font-medium">No hay registros sanitarios históricos.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'repro' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              {reproRecords.length > 0 ? (
                reproRecords.map((record) => (
                  <div key={record.id} className="flex gap-4 p-5 border border-slate-100 rounded-2xl hover:bg-slate-50 hover:border-purple-100 transition-all">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                      <Baby size={24} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <h5 className="font-bold text-slate-800">{record.event}</h5>
                        <span className="text-xs text-slate-400 font-bold bg-slate-100 px-2 py-1 rounded-lg">{record.date}</span>
                      </div>
                      {record.result && (
                        <span className="inline-block text-[10px] font-black text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full mb-2 uppercase">
                          Resultado: {record.result}
                        </span>
                      )}
                      {record.notes && <p className="text-sm text-slate-600 italic">"{record.notes}"</p>}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16 text-slate-400 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                  <Baby size={48} className="mx-auto mb-4 opacity-10" />
                  <p className="font-medium">Sin actividad reproductiva registrada.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer del Modal */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 shrink-0">
          <button className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-100 transition-all text-sm shadow-sm">
            Editar Ficha
          </button>
          <button className="px-6 py-2.5 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all shadow-lg shadow-green-600/20 text-sm">
            Registrar Novedad
          </button>
        </div>
      </div>
    </div>
  );
};

const HerdManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('Todos');
  const [selectedBreed, setSelectedBreed] = useState('Todas');
  const [selectedHealth, setSelectedHealth] = useState('Todos');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  
  const itemsPerPage = 8;

  const breeds = useMemo(() => {
    const b = new Set(MOCK_ANIMALS.map(a => a.breed));
    return ['Todas', ...Array.from(b)].sort();
  }, []);

  const animalTypes = useMemo(() => {
    return ['Todos', ...Object.values(AnimalType)];
  }, []);

  const filteredAnimals = useMemo(() => {
    return MOCK_ANIMALS.filter(animal => {
      const matchesSearch = 
        animal.tagId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        animal.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
        animal.type.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = selectedType === 'Todos' || animal.type === selectedType;
      const matchesBreed = selectedBreed === 'Todas' || animal.breed === selectedBreed;
      const matchesHealth = selectedHealth === 'Todos' || animal.healthStatus === selectedHealth;
      const matchesCategory = selectedCategory === 'Todas' || animal.category === selectedCategory;

      return matchesSearch && matchesType && matchesBreed && matchesHealth && matchesCategory;
    });
  }, [searchQuery, selectedType, selectedBreed, selectedHealth, selectedCategory]);

  const paginatedAnimals = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAnimals.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAnimals, currentPage]);

  const totalPages = Math.ceil(filteredAnimals.length / itemsPerPage);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedType('Todos');
    setSelectedBreed('Todas');
    setSelectedHealth('Todos');
    setSelectedCategory('Todas');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header Seccional */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Mi Hato</h2>
          <p className="text-slate-500 font-medium">Gestión integral de {filteredAnimals.length} cabezas de ganado.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsTagModalOpen(true)}
            className="flex items-center gap-2 bg-white border border-slate-200 px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 shadow-sm transition-all"
          >
            <QrCode size={18} /> Registro de Arete
          </button>
          <button className="flex items-center gap-2 bg-green-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-green-700 shadow-lg shadow-green-600/20 transition-all">
            <Plus size={18} /> Nuevo Registro
          </button>
        </div>
      </div>

      {/* Filtros Avanzados */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por ID, raza o tipo de animal..." 
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-2xl text-sm border-none focus:ring-2 focus:ring-green-500 transition-all outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="flex flex-col gap-1.5 min-w-[130px]">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-wider">Tipo de Animal</label>
              <select 
                value={selectedType}
                onChange={(e) => { setSelectedType(e.target.value); setCurrentPage(1); }}
                className="bg-slate-50 border-none rounded-xl text-sm px-4 py-2.5 outline-none font-bold text-slate-700 focus:ring-2 focus:ring-green-500 cursor-pointer"
              >
                {animalTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5 min-w-[130px]">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-wider">Raza</label>
              <select 
                value={selectedBreed}
                onChange={(e) => { setSelectedBreed(e.target.value); setCurrentPage(1); }}
                className="bg-slate-50 border-none rounded-xl text-sm px-4 py-2.5 outline-none font-bold text-slate-700 focus:ring-2 focus:ring-green-500 cursor-pointer"
              >
                {breeds.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5 min-w-[130px]">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-wider">Salud</label>
              <select 
                value={selectedHealth}
                onChange={(e) => { setSelectedHealth(e.target.value); setCurrentPage(1); }}
                className="bg-slate-50 border-none rounded-xl text-sm px-4 py-2.5 outline-none font-bold text-slate-700 focus:ring-2 focus:ring-green-500 cursor-pointer"
              >
                <option value="Todos">Todos</option>
                {Object.values(HealthStatus).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5 min-w-[130px]">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-wider">Categoría</label>
              <select 
                value={selectedCategory}
                onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                className="bg-slate-50 border-none rounded-xl text-sm px-4 py-2.5 outline-none font-bold text-slate-700 focus:ring-2 focus:ring-green-500 cursor-pointer"
              >
                <option value="Todas">Todas</option>
                {Object.values(AnimalCategory).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex flex-col justify-end pb-0.5">
              <button 
                onClick={resetFilters}
                className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                title="Limpiar todos los filtros"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla Principal */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-[11px] uppercase tracking-[0.1em] font-black">
                <th className="px-6 py-5">Ejemplar</th>
                <th className="px-6 py-5">Identificador</th>
                <th className="px-6 py-5">Categoría</th>
                <th className="px-6 py-5">Salud</th>
                <th className="px-6 py-5 text-right">Peso Actual</th>
                <th className="px-6 py-5 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedAnimals.length > 0 ? (
                paginatedAnimals.map((animal) => (
                  <tr 
                    key={animal.id} 
                    onClick={() => setSelectedAnimal(animal)}
                    className="hover:bg-green-50/40 transition-all group cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200 group-hover:border-green-200 transition-colors">
                          <img src={animal.imageUrl} className="w-full h-full object-cover" alt={animal.breed} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm group-hover:text-green-700 transition-colors">{animal.breed}</p>
                          <p className="text-xs text-slate-500 font-medium">{animal.type} • {animal.age} meses</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1.5 bg-slate-100 rounded-xl text-[11px] font-mono font-black text-slate-600 group-hover:bg-white transition-colors border border-transparent group-hover:border-slate-200 flex items-center gap-1 w-fit">
                        <TagIcon size={10} className="text-slate-400" />
                        {animal.tagId}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-slate-600">{animal.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-2.5 h-2.5 rounded-full ring-4 ring-white shadow-sm ${
                          animal.healthStatus === 'Excelente' ? 'bg-green-500 shadow-green-200' : 
                          (animal.healthStatus === 'En Tratamiento' ? 'bg-amber-500 shadow-amber-200' : 'bg-red-500 shadow-red-200')
                        }`}></div>
                        <span className="text-sm font-bold text-slate-700">{animal.healthStatus}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-black text-slate-800">{animal.weight} <span className="text-slate-400 font-medium text-[10px]">kg</span></span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button className="p-2.5 bg-white text-slate-400 hover:text-green-600 rounded-xl shadow-sm border border-slate-200 hover:border-green-200 transition-all">
                          <FileText size={18} />
                        </button>
                        <div className="p-2.5 bg-white text-slate-400 group-hover:text-green-600 rounded-xl shadow-sm border border-slate-200 group-hover:border-green-200 transition-all">
                          <ChevronRight size={18} />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-24 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 border border-dashed border-slate-300">
                        <Search size={40} />
                      </div>
                      <div className="space-y-1">
                        <p className="font-black text-slate-800">Sin resultados</p>
                        <p className="text-sm text-slate-400">Intente ajustar los términos de búsqueda o filtros.</p>
                      </div>
                      <button 
                        onClick={resetFilters}
                        className="text-sm font-black text-green-600 hover:text-green-700 bg-green-50 px-6 py-2 rounded-xl transition-all border border-green-100"
                      >
                        Restablecer Filtros
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Paginación */}
        {filteredAnimals.length > 0 && (
          <div className="p-5 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-50/50">
            <p className="text-sm text-slate-500 font-medium">Mostrando <span className="text-slate-800 font-bold">{paginatedAnimals.length}</span> de <span className="text-slate-800 font-bold">{filteredAnimals.length}</span> resultados</p>
            <div className="flex items-center gap-3">
              <button 
                disabled={currentPage === 1}
                onClick={(e) => { e.stopPropagation(); setCurrentPage(prev => Math.max(1, prev - 1)); }}
                className="px-5 py-2.5 bg-white border border-slate-200 rounded-2xl hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed font-bold text-sm transition-all shadow-sm"
              >
                Anterior
              </button>
              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={(e) => { e.stopPropagation(); setCurrentPage(page); }}
                    className={`w-10 h-10 rounded-xl text-sm font-black transition-all ${
                      currentPage === page 
                      ? 'bg-green-600 text-white shadow-lg shadow-green-600/30 ring-2 ring-green-500 ring-offset-2' 
                      : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200 shadow-sm'
                    }`}
                  >
                    {page}
                  </button>
                )).slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))}
              </div>
              <button 
                disabled={currentPage === totalPages}
                onClick={(e) => { e.stopPropagation(); setCurrentPage(prev => Math.min(totalPages, prev + 1)); }}
                className="px-5 py-2.5 bg-white border border-slate-200 rounded-2xl hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed font-bold text-sm transition-all shadow-sm"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Detalle */}
      {selectedAnimal && (
        <AnimalDetailModal 
          animal={selectedAnimal} 
          onClose={() => setSelectedAnimal(null)} 
        />
      )}

      {/* Modal de Registro de Arete */}
      {isTagModalOpen && (
        <TagRegistrationModal onClose={() => setIsTagModalOpen(false)} />
      )}
    </div>
  );
};

export default HerdManagement;
