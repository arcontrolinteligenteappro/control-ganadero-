
import React, { useState } from 'react';
import { MOCK_EVENTS } from '../constants';
import { 
  ChevronLeft, ChevronRight, Plus, 
  Activity, Wallet, ShoppingCart, 
  Bell, CheckCircle, Clock, Info, Filter, PlusCircle, Search, X, Stethoscope
} from 'lucide-react';
import { FarmEvent, EventType, Priority } from '../types';

const EventModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'Recordatorio',
    customType: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    priority: 'Baja' as Priority
  });

  const [isOtherType, setIsOtherType] = useState(false);

  const handleSubmit = () => {
    const finalType = isOtherType ? formData.customType : formData.type;
    if (!formData.title || !finalType) {
      alert("Por favor complete el título y la categoría.");
      return;
    }
    alert(`Evento agendado en AR CONTROL GANADERO: ${finalType}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95">
        <div className="p-8 bg-amber-600 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-white/20 rounded-xl"><PlusCircle size={24} /></div>
             <div>
                <h3 className="font-black text-xl uppercase tracking-tighter leading-none">Agendar Evento IA</h3>
                <p className="text-[10px] font-bold text-white/80 uppercase tracking-widest mt-1">Bitácora AR CONTROL GANADERO</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all"><X size={24} /></button>
        </div>
        
        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Título del Evento / Recordatorio</label>
            <input 
              type="text" 
              className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none focus:border-amber-500" 
              placeholder="Ej: Vacunación Lote A"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className={isOtherType ? "col-span-1" : "col-span-2"}>
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Categoría</label>
               <select 
                className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none focus:border-amber-500"
                value={isOtherType ? "OTRO" : formData.type}
                onChange={e => {
                  const val = e.target.value;
                  if (val === "OTRO") {
                    setIsOtherType(true);
                  } else {
                    setIsOtherType(false);
                    setFormData({...formData, type: val});
                  }
                }}
               >
                  <option>Alimentación</option>
                  <option>Medicamento</option>
                  <option>Venta</option>
                  <option>Compra</option>
                  <option>Evento General</option>
                  <option value="OTRO">✨ OTRA CATEGORÍA...</option>
               </select>
            </div>
            {isOtherType && (
              <div className="col-span-1 animate-in slide-in-from-right-2">
                 <label className="text-[10px] font-black text-amber-600 uppercase tracking-widest ml-1 mb-2 block">¿Cuál Categoría?</label>
                 <input 
                  type="text" 
                  className="w-full p-4 bg-amber-50 border-2 border-amber-200 rounded-2xl font-bold outline-none" 
                  placeholder="Ej: Mantenimiento"
                  value={formData.customType}
                  onChange={e => setFormData({...formData, customType: e.target.value})}
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Prioridad</label>
               <select 
                className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none focus:border-amber-500"
                value={formData.priority}
                onChange={e => setFormData({...formData, priority: e.target.value as Priority})}
               >
                  <option value="Baja">Baja</option>
                  <option value="Media">Media</option>
                  <option value="Alta">Alta (Crítica)</option>
               </select>
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Fecha Programada</label>
              <input 
                type="date" 
                className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none" 
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
              />
            </div>
          </div>

          <button onClick={handleSubmit} className="w-full py-5 bg-amber-600 text-white font-black rounded-3xl hover:bg-amber-700 shadow-xl transition-all uppercase tracking-widest text-xs active:scale-95">Registrar Evento en Agenda</button>
        </div>
      </div>
    </div>
  );
};

const CalendarEvents: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const startDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'Alimentación': return <Activity size={16} className="text-emerald-500" />;
      case 'Medicamento': return <Stethoscope size={16} className="text-red-500" />;
      case 'Venta': return <ShoppingCart size={16} className="text-blue-500" />;
      default: return <Bell size={16} className="text-amber-500" />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-tight">Bitácora Global AR CONTROL GANADERO</h2>
          <p className="text-slate-500 font-bold text-sm italic">Seguimiento maestro de alimentación, medicamentos y operaciones.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-amber-600 text-white px-8 py-3.5 rounded-2xl text-[10px] font-black hover:bg-amber-700 shadow-xl transition-all uppercase active:scale-95 shrink-0">
          <Plus size={16} /> Agendar Recordatorio
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white p-10 rounded-[48px] border border-slate-200 shadow-sm">
           <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-4">
                 <h3 className="text-3xl font-black text-slate-800 tracking-tighter uppercase leading-none">{monthNames[currentDate.getMonth()]}</h3>
                 <span className="text-xl font-black text-amber-600 opacity-40">{currentDate.getFullYear()}</span>
              </div>
              <div className="flex gap-2">
                 <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))} className="p-3 hover:bg-slate-100 rounded-2xl transition-all"><ChevronLeft size={24} /></button>
                 <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))} className="p-3 hover:bg-slate-100 rounded-2xl transition-all"><ChevronRight size={24} /></button>
              </div>
           </div>

           <div className="grid grid-cols-7 gap-4">
              {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => (
                <div key={d} className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest pb-4">{d}</div>
              ))}
              {Array.from({ length: startDayOfMonth(currentDate.getFullYear(), currentDate.getMonth()) }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square"></div>
              ))}
              {Array.from({ length: daysInMonth(currentDate.getFullYear(), currentDate.getMonth()) }).map((_, i) => {
                const day = i + 1;
                const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const eventsOnDay = MOCK_EVENTS.filter(e => e.date === dateStr);
                return (
                  <div key={day} className={`aspect-square rounded-3xl p-3 flex flex-col justify-between border transition-all cursor-pointer relative ${day === 24 ? 'bg-[#1a2421] border-slate-800 text-white shadow-2xl' : 'bg-slate-50 border-slate-100 hover:bg-white hover:border-amber-200'}`}>
                    <span className="text-xs font-black">{day}</span>
                    <div className="flex gap-1 flex-wrap">
                       {eventsOnDay.slice(0, 3).map(e => (
                         <div key={e.id} className={`w-1.5 h-1.5 rounded-full ${e.type === 'Alimentación' ? 'bg-emerald-500' : e.type === 'Medicamento' ? 'bg-red-500' : 'bg-amber-500'}`}></div>
                       ))}
                    </div>
                  </div>
                );
              })}
           </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
              <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
                 <Clock size={16} className="text-amber-600" /> Próximos Eventos
              </h4>
              <div className="space-y-4">
                 {MOCK_EVENTS.map(event => (
                   <div key={event.id} className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 hover:border-amber-200 transition-all group cursor-pointer active:scale-95">
                      <div className="flex items-start gap-4">
                         <div className="p-3 bg-white rounded-2xl shadow-sm group-hover:bg-amber-600 group-hover:text-white transition-all">
                            {getEventIcon(event.type)}
                         </div>
                         <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{event.type} • {event.date}</p>
                            <p className="font-black text-slate-900 uppercase tracking-tighter text-sm mb-2">{event.title}</p>
                            <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-lg ${event.priority === 'Alta' ? 'bg-red-100 text-red-600' : 'bg-slate-200 text-slate-500'}`}>{event.priority}</span>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {isModalOpen && <EventModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default CalendarEvents;
