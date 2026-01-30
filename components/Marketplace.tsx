
import React, { useState, useMemo } from 'react';
import { MOCK_LISTINGS } from '../constants';
import { 
  Search, Filter, MapPin, Star, Heart, Tag, Sparkles, 
  Map as MapIcon, ChevronDown, BarChart3, ShoppingBasket, 
  Truck, ShieldCheck, X, SearchCode, Landmark, Plus
} from 'lucide-react';
import { estimateValue } from '../services/geminiService';
import { GoogleGenAI } from "@google/genai";

const Marketplace: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedState, setSelectedState] = useState('Todos');
  const [selectedCity, setSelectedCity] = useState('Todos');
  const [isEstimating, setIsEstimating] = useState(false);
  const [marketInsight, setMarketInsight] = useState<string | null>(null);
  const [isInsightLoading, setIsInsightLoading] = useState(false);

  // Datos geográficos para filtros (Enfocado en región Nayarit)
  const locations = {
    "Nayarit": ["Tepic", "El Macho", "Xalisco", "Santiago Ixcuintla", "Compostela", "Bahía de Banderas"],
    "Jalisco": ["Guadalajara", "Zapopan", "Tequila", "Puerto Vallarta"],
    "Sinaloa": ["Mazatlán", "Culiacán", "Escuinapa"]
  };

  const filteredListings = useMemo(() => {
    return MOCK_LISTINGS.filter(item => {
      const matchesSearch = item.breed.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           item.type.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCat = selectedCategory === 'Todos' || item.type === selectedCategory || item.category === selectedCategory;
      const matchesState = selectedState === 'Todos' || item.location.includes(selectedState);
      const matchesCity = selectedCity === 'Todos' || item.location.includes(selectedCity);
      
      return matchesSearch && matchesCat && matchesState && matchesCity;
    });
  }, [searchTerm, selectedCategory, selectedState, selectedCity]);

  const getMarketInsight = async () => {
    setIsInsightLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Actúa como un analista de mercado agropecuario experto. 
        Analiza la situación de compraventa de: ${selectedCategory === 'Todos' ? 'Ganado general' : selectedCategory} 
        en la zona de: ${selectedCity !== 'Todos' ? selectedCity : (selectedState !== 'Todos' ? selectedState : 'Nayarit y Occidente de México')}.
        Proporciona un breve reporte (máximo 4 líneas) sobre:
        1. Tendencia de precio (alza/baja).
        2. Demanda actual en esta ubicación.
        3. Un consejo estratégico para el ganadero vendedor.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      
      setMarketInsight(response.text || "No hay datos suficientes para esta zona.");
    } catch (error) {
      setMarketInsight("Error al conectar con el analista de mercado. Intente más tarde.");
    } finally {
      setIsInsightLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-1">Mercado de Compraventa</h2>
          <p className="text-slate-500 font-bold text-sm italic">Animales, insumos y servicios certificados - AR CONTROL GANADERO.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-2">
           <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border-2 border-slate-200 px-6 py-4 rounded-[22px] text-[10px] font-black text-slate-800 hover:bg-slate-50 transition-all uppercase tracking-widest active:scale-95 shadow-sm shrink-0">
             <ShoppingBasket size={18} /> Mis Compras
           </button>
           <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#1a2421] text-white px-8 py-4 rounded-[22px] text-[10px] font-black hover:bg-black shadow-xl transition-all uppercase tracking-widest active:scale-95 shrink-0">
             <Plus size={18} /> Publicar Venta
           </button>
        </div>
      </div>

      {/* PANEL DE FILTROS GEOGRÁFICOS Y BÚSQUEDA */}
      <div className="bg-white p-8 rounded-[48px] border border-slate-200 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-4 relative">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
             <input 
              type="text" 
              placeholder="Buscar raza, tipo o insumo..." 
              className="w-full pl-12 pr-4 py-5 bg-slate-50 border-none rounded-3xl font-bold text-sm outline-none focus:ring-4 focus:ring-amber-500/10 transition-all"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
             />
          </div>

          <div className="md:col-span-2">
             <div className="relative">
                <Landmark className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-600" size={18} />
                <select 
                  className="w-full pl-11 pr-4 py-5 bg-slate-50 border-none rounded-3xl font-black text-[10px] uppercase tracking-widest outline-none focus:ring-4 focus:ring-amber-500/10 appearance-none"
                  value={selectedState}
                  onChange={e => { setSelectedState(e.target.value); setSelectedCity('Todos'); }}
                >
                  <option value="Todos">Estado: Todos</option>
                  {Object.keys(locations).map(state => <option key={state} value={state}>{state}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
             </div>
          </div>

          <div className="md:col-span-2">
             <div className="relative">
                <MapIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-600" size={18} />
                <select 
                  className="w-full pl-11 pr-4 py-5 bg-slate-50 border-none rounded-3xl font-black text-[10px] uppercase tracking-widest outline-none focus:ring-4 focus:ring-amber-500/10 appearance-none disabled:opacity-50"
                  value={selectedCity}
                  disabled={selectedState === 'Todos'}
                  onChange={e => setSelectedCity(e.target.value)}
                >
                  <option value="Todos">Ciudad: Todas</option>
                  {selectedState !== 'Todos' && locations[selectedState as keyof typeof locations].map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
             </div>
          </div>

          <div className="md:col-span-2">
             <div className="relative">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-600" size={18} />
                <select 
                  className="w-full pl-11 pr-4 py-5 bg-slate-50 border-none rounded-3xl font-black text-[10px] uppercase tracking-widest outline-none focus:ring-4 focus:ring-amber-500/10 appearance-none"
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                >
                  <option value="Todos">Categoría: Todas</option>
                  <option value="Bovino">Bovinos</option>
                  <option value="Porcino">Porcinos</option>
                  <option value="Ovino">Ovinos</option>
                  <option value="Engorde">Engorde</option>
                  <option value="Reproductor">Reproductores</option>
                  <option value="Servicio">Servicios</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
             </div>
          </div>

          <div className="md:col-span-2 flex items-center justify-end">
             <button 
              onClick={getMarketInsight}
              disabled={isInsightLoading}
              className="w-full py-5 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
             >
               {isInsightLoading ? <Sparkles size={16} className="animate-spin" /> : <BarChart3 size={16} />}
               Análisis de Zona
             </button>
          </div>
        </div>

        {marketInsight && (
          <div className="p-6 bg-blue-50 border-2 border-blue-100 rounded-[32px] animate-in slide-in-from-top-4 flex items-start gap-5 relative overflow-hidden">
             <div className="p-4 bg-white rounded-2xl shadow-sm text-blue-600 shrink-0"><Sparkles size={24} className="animate-pulse" /></div>
             <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                   <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Reporte de Mercado IA - {selectedCity !== 'Todos' ? selectedCity : selectedState}</p>
                   <button onClick={() => setMarketInsight(null)} className="p-1 hover:bg-blue-100 rounded-lg transition-all"><X size={16} className="text-blue-400" /></button>
                </div>
                <p className="text-sm font-bold text-blue-900 leading-relaxed italic">"{marketInsight}"</p>
             </div>
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/50 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between px-4">
         <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-amber-600 shadow-sm"><SearchCode size={20} /></div>
            <div>
               <h3 className="font-black text-slate-800 uppercase tracking-tighter text-lg leading-none">Resultados Disponibles</h3>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{filteredListings.length} publicaciones encontradas</p>
            </div>
         </div>
         <div className="flex bg-white p-1 rounded-xl border border-slate-200">
            <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-[9px] font-black uppercase tracking-widest">Grid</button>
            <button className="px-4 py-2 text-slate-400 rounded-lg text-[9px] font-black uppercase tracking-widest hover:text-slate-600">Lista</button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredListings.map((listing) => (
          <div key={listing.id} className="bg-white rounded-[48px] border border-slate-200 overflow-hidden group hover:shadow-2xl transition-all hover:-translate-y-2 cursor-pointer active:scale-95 shadow-sm">
            <div className="relative h-64 overflow-hidden">
              <img 
                src={listing.imageUrl} 
                alt={listing.breed} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute top-6 left-6 flex flex-col gap-2">
                <div className="bg-white/90 backdrop-blur-xl px-4 py-2 rounded-2xl flex items-center gap-2 shadow-xl border border-white/20">
                  <Tag size={14} className="text-amber-600" />
                  <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">{listing.category}</span>
                </div>
                {listing.healthStatus === 'Excelente' && (
                  <div className="bg-emerald-500 text-white px-4 py-2 rounded-2xl flex items-center gap-2 shadow-xl border border-emerald-400">
                    <ShieldCheck size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Garantía Salud</span>
                  </div>
                )}
              </div>
              <button className="absolute top-6 right-6 p-3.5 bg-white/20 backdrop-blur-md hover:bg-white text-white hover:text-red-500 rounded-2xl transition-all shadow-xl">
                <Heart size={20} />
              </button>
              <div className="absolute bottom-6 right-6 bg-[#1a2421] text-white px-6 py-3 rounded-3xl text-2xl font-black shadow-2xl border border-white/10 group-hover:scale-110 transition-transform">
                ${listing.price?.toLocaleString()}
              </div>
            </div>

            <div className="p-8">
              <div className="mb-6">
                <h4 className="text-2xl font-black text-slate-900 tracking-tighter uppercase mb-2 truncate group-hover:text-amber-600 transition-colors">{listing.breed}</h4>
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <MapPin size={14} className="text-amber-600" />
                  <span className="truncate">{listing.location}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-8">
                 <div className="p-4 bg-slate-50 rounded-3xl border border-slate-100">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Peso aprox.</p>
                    <p className="text-lg font-black text-slate-800">{listing.weight} kg</p>
                 </div>
                 <div className="p-4 bg-slate-50 rounded-3xl border border-slate-100">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Edad</p>
                    <p className="text-lg font-black text-slate-800">{listing.age} meses</p>
                 </div>
              </div>

              <div className="flex items-center gap-4 pt-8 border-t border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center font-black text-amber-700 shadow-inner border-2 border-white">
                  {listing.sellerName[0]}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-[10px] font-black text-slate-900 truncate uppercase tracking-tighter">{listing.sellerName}</p>
                  <div className="flex items-center gap-1">
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                    <span className="text-[10px] font-black text-slate-400 uppercase">{listing.sellerRating} • Vendedor Verificado</span>
                  </div>
                </div>
                <button className="p-3.5 bg-slate-100 hover:bg-amber-600 text-slate-400 hover:text-white rounded-2xl transition-all active:scale-90">
                  <Truck size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredListings.length === 0 && (
        <div className="py-32 flex flex-col items-center justify-center bg-white rounded-[48px] border-4 border-dashed border-slate-100">
           <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6"><Search size={48} /></div>
           <h4 className="text-2xl font-black text-slate-300 uppercase tracking-tighter">Sin coincidencias exactas</h4>
           <p className="text-slate-400 font-bold mt-2 italic text-sm">Prueba ajustando los filtros de zona o categoría.</p>
           <button onClick={() => { setSelectedState('Todos'); setSelectedCity('Todos'); setSelectedCategory('Todos'); setSearchTerm(''); }} className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">Limpiar Filtros Maestros</button>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
