
import React, { useState } from 'react';
import { MOCK_LISTINGS } from '../constants';
import { Search, Filter, MapPin, Star, Heart, Tag, Sparkles } from 'lucide-react';
import { estimateValue } from '../services/geminiService';

const Marketplace: React.FC = () => {
  const [filter, setFilter] = useState('Todos');
  const [isEstimating, setIsEstimating] = useState(false);
  const [estimate, setEstimate] = useState<any>(null);

  const handleEstimate = async () => {
    setIsEstimating(true);
    const result = await estimateValue({
      type: 'Bovino' as any,
      breed: 'Angus',
      age: 24,
      weight: 450,
      category: 'Engorde' as any
    });
    setEstimate(result);
    setIsEstimating(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Mercado Ganadero</h2>
          <p className="text-slate-500">Encuentra los mejores ejemplares y lotes verificados.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50">
            <Filter size={18} /> Filtros
          </button>
          <button className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-green-700 shadow-lg shadow-green-600/20">
            Publicar Venta
          </button>
        </div>
      </div>

      {/* AI Tool Mini Card */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="max-w-md">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="text-yellow-400" size={20} />
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-200">Herramienta Premium IA</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Estimador de Precio de Mercado</h3>
            <p className="text-sm text-indigo-100 mb-4">Utiliza nuestra inteligencia artificial para calcular el valor justo de tus animales basado en peso, raza y tendencia regional.</p>
            <button 
              onClick={handleEstimate}
              disabled={isEstimating}
              className="bg-white text-indigo-900 px-6 py-2 rounded-xl text-sm font-bold hover:bg-indigo-50 transition-colors flex items-center gap-2"
            >
              {isEstimating ? 'Calculando...' : 'Iniciar Estimación'}
            </button>
          </div>
          
          {estimate && (
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl w-full md:w-auto min-w-[300px]">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-indigo-200 uppercase">Resultado Sugerido</span>
                <span className="px-2 py-0.5 bg-green-500 rounded text-[10px] font-bold">ACTUALIZADO</span>
              </div>
              <div className="mb-4">
                <p className="text-3xl font-black">${estimate.minPrice} - ${estimate.maxPrice}</p>
                <p className="text-xs text-indigo-200">Rango estimado por unidad ({estimate.currency})</p>
              </div>
              <p className="text-[11px] leading-relaxed italic opacity-80 line-clamp-3">"{estimate.justification}"</p>
            </div>
          )}
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {['Todos', 'Bovinos', 'Porcinos', 'Ovinos', 'Subastas', 'Insumos'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
              filter === cat ? 'bg-green-600 text-white shadow-md' : 'bg-white text-slate-500 border border-slate-200 hover:border-green-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {MOCK_LISTINGS.map((listing) => (
          <div key={listing.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden group hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="relative h-48">
              <img 
                src={listing.imageUrl} 
                alt={listing.breed} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                <Tag size={12} className="text-green-600" />
                <span className="text-[10px] font-bold text-slate-700 uppercase">{listing.category}</span>
              </div>
              <button className="absolute top-3 right-3 p-2 bg-white/50 backdrop-blur hover:bg-white rounded-full transition-colors text-slate-700">
                <Heart size={16} />
              </button>
              <div className="absolute bottom-3 right-3 bg-green-600 text-white px-3 py-1 rounded-lg text-lg font-black shadow-lg">
                ${listing.price}
              </div>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-lg font-bold text-slate-800">{listing.breed} - {listing.type}</h4>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                <MapPin size={12} />
                <span>{listing.location}</span>
                <span className="mx-1">•</span>
                <span>{listing.weight} kg</span>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs">
                  {listing.sellerName[0]}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-xs font-bold text-slate-700 truncate">{listing.sellerName}</p>
                  <div className="flex items-center gap-1">
                    <Star size={10} className="fill-yellow-400 text-yellow-400" />
                    <span className="text-[10px] font-bold text-slate-500">{listing.sellerRating}</span>
                  </div>
                </div>
                <button className="px-4 py-1.5 bg-slate-100 hover:bg-green-600 hover:text-white rounded-lg text-[10px] font-bold transition-all">
                  Contactar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;
