
import React, { useState, useRef, useMemo } from 'react';
import { MOCK_HEALTH_RECORDS, MOCK_ANIMALS, MOCK_VETERINARIANS, MOCK_PADDOCKS } from '../constants';
import { 
  Stethoscope, Calendar, Search, Filter, Plus, Sparkles, Camera, X, 
  Brain, CheckCircle, Download, AlertTriangle, ShieldCheck, Scan, 
  Phone, Mail, MapPin, User, Save, MessageCircle, ChevronRight, Activity, Trash2, Pencil, Droplets, Bug, Timer,
  Syringe, AlertCircle, Clock
} from 'lucide-react';
import { analyzeHealthProblem } from '../services/geminiService';
import { Veterinarian, HealthRecord, TickControlRecord, InfestationLevel, BathMethod, Animal } from '../types';

const VaccinationAlertPanel: React.FC = () => {
  const alerts = useMemo(() => {
    const today = new Date();
    const urgentDate = new Date();
    urgentDate.setMonth(today.getMonth() - 6); // 6 meses o más (Urgente)
    const warningDate = new Date();
    warningDate.setMonth(today.getMonth() - 5); // 5 meses (Próximo)

    const overdue: Animal[] = [];
    const upcoming: Animal[] = [];

    MOCK_ANIMALS.forEach(animal => {
      const records = MOCK_HEALTH_RECORDS.filter(r => r.animalId === animal.id && r.type.toLowerCase().includes('vacun'));
      if (records.length === 0) {
        overdue.push(animal);
        return;
      }
      
      const lastDate = new Date(records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date);
      if (lastDate < urgentDate) {
        overdue.push(animal);
      } else if (lastDate < warningDate) {
        upcoming.push(animal);
      }
    });

    return { overdue, upcoming };
  }, []);

  if (alerts.overdue.length === 0 && alerts.upcoming.length === 0) return null;

  return (
    <div className="space-y-4 mb-8 animate-in slide-in-from-top-4 duration-500">
      {alerts.overdue.length > 0 && (
        <div className="bg-gradient-to-r from-red-600 to-rose-700 rounded-[32px] p-8 text-white shadow-2xl shadow-red-900/20 relative overflow-hidden group">
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                <Syringe size={32} className="text-white animate-pulse" />
              </div>
              <div>
                <h3 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
                  Esquema Vencido <AlertCircle size={20} className="text-rose-200" />
                </h3>
                <p className="text-rose-100 font-bold text-sm">Se requiere vacunación inmediata para {alerts.overdue.length} ejemplares (6+ meses sin refuerzo).</p>
              </div>
            </div>
            <div className="flex -space-x-4">
              {alerts.overdue.slice(0, 5).map(a => (
                <div key={a.id} className="w-12 h-12 rounded-full border-4 border-rose-700 bg-white overflow-hidden shadow-lg" title={a.tagId}>
                  <img src={a.imageUrl} className="w-full h-full object-cover" />
                </div>
              ))}
              {alerts.overdue.length > 5 && (
                <div className="w-12 h-12 rounded-full border-4 border-rose-700 bg-rose-800 flex items-center justify-center text-[10px] font-black shadow-lg">
                  +{alerts.overdue.length - 5}
                </div>
              )}
            </div>
            <button className="bg-white text-rose-600 px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-50 transition-all shadow-xl active:scale-95 shrink-0">
              Vacunar Lote Crítico
            </button>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none"></div>
        </div>
      )}

      {alerts.upcoming.length > 0 && (
        <div className="bg-white border-2 border-amber-100 rounded-[32px] p-6 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><Clock size={24} /></div>
            <div>
              <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Aviso Preventivo</p>
              <h4 className="text-lg font-black text-slate-800 uppercase tracking-tighter leading-none">Próximos Refuerzos</h4>
              <p className="text-xs text-slate-500 font-medium">{alerts.upcoming.length} animales entrarán en periodo de vacunación este mes.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-5 py-2.5 bg-amber-50 text-amber-700 rounded-xl text-[10px] font-black uppercase hover:bg-amber-100 transition-all">Ver Lista</button>
            <button className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase hover:bg-black transition-all">Agendar</button>
          </div>
        </div>
      )}
    </div>
  );
};

const TickControlModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    paddockId: '',
    animalCount: 0,
    productName: '',
    method: 'Aspersión' as BathMethod,
    infestationLevel: 'Baja' as InfestationLevel,
    withdrawalDays: 30,
    notes: ''
  });

  const nextBathDate = useMemo(() => {
    const d = new Date(formData.date);
    d.setDate(d.getDate() + 21); // Sugerencia estándar para romper ciclo
    return d.toISOString().split('T')[0];
  }, [formData.date]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-in fade-in">
      <div className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-emerald-700 text-white">
          <div className="flex items-center gap-3">
            <Droplets size={24} />
            <div>
              <h3 className="font-black text-xl uppercase tracking-tighter">Registro de Baño Maestro</h3>
              <p className="text-[10px] font-bold text-emerald-100 uppercase tracking-widest">Control de Garrapatas AR CONTROL GANADERO</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all"><X size={24} /></button>
        </div>

        <div className="p-8 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Potrero / Lote a Bañar *</label>
               <select className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none" value={formData.paddockId} onChange={e => setFormData({...formData, paddockId: e.target.value})}>
                 <option value="">Seleccionar Ubicación...</option>
                 {MOCK_PADDOCKS.map(p => <option key={p.id} value={p.id}>{p.name} ({p.currentCount} animales)</option>)}
               </select>
            </div>
            <div>
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Fecha de Aplicación</label>
               <input type="date" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
            </div>
            <div>
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Cantidad de Animales</label>
               <input type="number" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none" value={formData.animalCount} onChange={e => setFormData({...formData, animalCount: Number(e.target.value)})} />
            </div>
            <div className="col-span-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Producto Acaricida / Garrapaticida</label>
               <input type="text" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none" placeholder="Ej: Amitraz, Ivermectina 1%..." value={formData.productName} onChange={e => setFormData({...formData, productName: e.target.value})} />
            </div>
            <div className="col-span-1">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Método</label>
               <select className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none" value={formData.method} onChange={e => setFormData({...formData, method: e.target.value as BathMethod})}>
                 <option value="Aspersión">Aspersión (Bomba)</option>
                 <option value="Inmersión">Inmersión (Tanque)</option>
                 <option value="Pour-on">Pour-on (Lomo)</option>
                 <option value="Inyectable">Inyectable</option>
               </select>
            </div>
            <div className="col-span-1">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Carga de Garrapata</label>
               <select className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none" value={formData.infestationLevel} onChange={e => setFormData({...formData, infestationLevel: e.target.value as InfestationLevel})}>
                 <option value="Baja">Baja (Pocas)</option>
                 <option value="Media">Media (Visible)</option>
                 <option value="Alta">Alta (Infestación)</option>
               </select>
            </div>
          </div>

          <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 flex items-center gap-4">
             <div className="p-3 bg-amber-600 text-white rounded-2xl shadow-lg"><Timer size={24} /></div>
             <div>
                <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Sugerencia AR CONTROL GANADERO IA</p>
                <p className="text-xs font-bold text-amber-800">Próximo baño programado: <span className="font-black underline">{nextBathDate}</span></p>
                <p className="text-[9px] text-amber-700 mt-1 uppercase font-black opacity-60">Basado en ciclo de vida biológico de la garrapata.</p>
             </div>
          </div>

          <button onClick={() => { alert('Baño registrado y programado en el calendario maestro'); onClose(); }} className="w-full py-5 bg-emerald-700 text-white font-black rounded-3xl hover:bg-emerald-800 shadow-xl transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2 active:scale-95">
            <Save size={18} /> Guardar Registro de Baño
          </button>
        </div>
      </div>
    </div>
  );
};

const VetModal: React.FC<{ onClose: () => void; vet?: Veterinarian }> = ({ onClose, vet }) => {
  const [photo, setPhoto] = useState<string | null>(vet?.photoUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<Partial<Veterinarian>>(vet || {
    name: '',
    alias: '',
    clinicName: '',
    phone: '',
    email: '',
    address: '',
    notes: ''
  });

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-blue-700 text-white">
          <div className="flex items-center gap-3">
            <User size={24} />
            <div>
              <h3 className="font-black text-xl uppercase tracking-tighter">{vet ? 'Editar Veterinario' : 'Registrar Profesional'}</h3>
              <p className="text-[10px] font-bold text-blue-100 uppercase tracking-widest opacity-80">Directorio Sanitario AR CONTROL GANADERO</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full"><X size={24} /></button>
        </div>
        
        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <div className="w-24 h-24 rounded-3xl bg-slate-100 overflow-hidden border-4 border-slate-50 shadow-inner flex items-center justify-center">
                {photo ? <img src={photo} className="w-full h-full object-cover" /> : <User size={40} className="text-slate-300" />}
              </div>
              <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-2 -right-2 p-2.5 bg-blue-600 text-white rounded-xl shadow-lg border-2 border-white hover:scale-110 transition-transform">
                <Camera size={14} />
              </button>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={e => {
                const file = e.target.files?.[0];
                if (file) setPhoto(URL.createObjectURL(file));
              }} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Nombre Completo *</label>
              <input type="text" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none focus:border-blue-500" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Alias</label>
              <input type="text" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none" value={formData.alias} onChange={e => setFormData({...formData, alias: e.target.value})} />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Clínica</label>
              <input type="text" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none" value={formData.clinicName} onChange={e => setFormData({...formData, clinicName: e.target.value})} />
            </div>
            <div className="col-span-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">WhatsApp / Tel *</label>
              <input type="tel" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
            <div className="col-span-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Email</label>
              <input type="email" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="col-span-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Especialidad / Notas</label>
              <textarea className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none h-24 resize-none" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
            </div>
          </div>
          <button onClick={() => { alert('Veterinario guardado'); onClose(); }} className="w-full py-5 bg-blue-700 text-white font-black rounded-3xl hover:bg-blue-800 shadow-xl transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2">
            <Save size={18} /> Confirmar Datos
          </button>
        </div>
      </div>
    </div>
  );
};

const ClinicalRecordModal: React.FC<{ onClose: () => void; record?: HealthRecord }> = ({ onClose, record }) => {
  const [formData, setFormData] = useState<Partial<HealthRecord>>(record || {
    animalId: '',
    date: new Date().toISOString().split('T')[0],
    type: 'Consulta General',
    description: '',
    veterinarianId: '',
    medication: '',
    dosage: '',
    progressNotes: '',
    isEmergency: false
  });

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <Stethoscope size={24} className="text-emerald-500" />
            <div>
              <h3 className="font-black text-xl uppercase tracking-tighter">{record ? 'Editar Tratamiento' : 'Registrar Acción Clínica'}</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-80">Seguimiento Sanitario Maestro</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full"><X size={24} /></button>
        </div>

        <div className="p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
             <div className="col-span-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Ejemplar / Paciente *</label>
               <select className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none" value={formData.animalId} onChange={e => setFormData({...formData, animalId: e.target.value})}>
                 <option value="">Seleccionar del Hato...</option>
                 {MOCK_ANIMALS.map(a => <option key={a.id} value={a.id}>{a.breed} (#{a.tagId})</option>)}
               </select>
             </div>
             <div>
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Fecha</label>
               <input type="date" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
             </div>
             <div>
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Tipo de Acción</label>
               <select className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                 <option>Consulta General</option>
                 <option>Vacunación</option>
                 <option>Desparasitación</option>
                 <option>Tratamiento de Infección</option>
                 <option>Cirugía</option>
                 <option>Otro</option>
               </select>
             </div>
             <div className="col-span-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Veterinario Responsable *</label>
               <select className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none" value={formData.veterinarianId} onChange={e => setFormData({...formData, veterinarianId: e.target.value})}>
                 <option value="">Elegir Profesional...</option>
                 {MOCK_VETERINARIANS.map(v => <option key={v.id} value={v.id}>{v.name} ({v.clinicName})</option>)}
               </select>
             </div>
             <div className="col-span-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Diagnóstico / Descripción</label>
               <input type="text" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Ej: Herida superficial, fiebre..." />
             </div>
             <div className="col-span-1">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Medicamento Aplicado</label>
               <input type="text" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none" value={formData.medication} onChange={e => setFormData({...formData, medication: e.target.value})} placeholder="Nombre comercial" />
             </div>
             <div className="col-span-1">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Dosis / Frecuencia</label>
               <input type="text" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none" value={formData.dosage} onChange={e => setFormData({...formData, dosage: e.target.value})} placeholder="Ej: 5ml IM" />
             </div>
             <div className="col-span-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Avances / Notas de Mejora</label>
               <textarea className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none h-20 resize-none" value={formData.progressNotes} onChange={e => setFormData({...formData, progressNotes: e.target.value})} placeholder="Cómo ha evolucionado el ejemplar..." />
             </div>
          </div>
          <button onClick={() => { alert('Registro clínico actualizado'); onClose(); }} className="w-full py-5 bg-slate-900 text-white font-black rounded-3xl hover:bg-black shadow-xl transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2">
            <Save size={18} className="text-emerald-500" /> Guardar en Historial Clínico
          </button>
        </div>
      </div>
    </div>
  );
};

const AiConsultModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [step, setStep] = useState<'upload' | 'processing' | 'result'>('upload');
  const [image, setImage] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [selectedAnimal, setSelectedAnimal] = useState('');
  const [aiResult, setAiResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const startConsult = async () => {
    if (!description || !selectedAnimal) return;
    setStep('processing');
    try {
      const animal = MOCK_ANIMALS.find(a => a.id === selectedAnimal);
      const animalInfo = animal ? `${animal.breed}, ${animal.weight}kg, ${animal.age} meses` : 'Desconocido';
      const result = await analyzeHealthProblem(image, description, animalInfo);
      setAiResult(result);
      setStep('result');
    } catch (error) {
      alert("Error procesando la consulta. Intente de nuevo.");
      setStep('upload');
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-500">
      <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 max-h-[90vh] flex flex-col border border-slate-200">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-blue-600 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl"><Sparkles size={24} className="animate-pulse" /></div>
            <div>
              <h3 className="font-black text-xl tracking-tighter">CONSULTA VETERINARIA IA</h3>
              <p className="text-[10px] font-bold text-blue-100 uppercase tracking-widest opacity-80">Asistente Clínico AR CONTROL GANADERO</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2.5 hover:bg-white/20 rounded-full transition-all">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
          {step === 'upload' && (
            <div className="space-y-8 animate-in slide-in-from-bottom-4">
              <div className="p-6 bg-amber-50 border border-amber-200 rounded-3xl flex gap-4">
                <AlertTriangle className="text-amber-600 shrink-0" size={24} />
                <div>
                   <p className="text-xs font-black text-amber-800 uppercase tracking-widest mb-1">Nota de Seguridad</p>
                   <p className="text-xs text-amber-700 font-medium leading-relaxed">Referencia académica AR CONTROL GANADERO. Los resultados deben ser validados por un profesional certificado.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col items-center justify-center border-4 border-dashed border-slate-200 rounded-[32px] p-6 hover:border-blue-500 hover:bg-blue-50/30 transition-all bg-white cursor-pointer h-64 relative overflow-hidden"
                     onClick={() => fileInputRef.current?.click()}>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" capture="environment" onChange={handleImageChange} />
                  {image ? (
                    <img src={image} className="absolute inset-0 w-full h-full object-cover animate-in fade-in" />
                  ) : (
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <Camera size={32} />
                      </div>
                      <p className="font-black text-slate-800 text-sm uppercase tracking-tighter">Subir Evidencia Visual</p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                   <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Seleccionar Paciente</label>
                    <select 
                      value={selectedAnimal}
                      onChange={(e) => setSelectedAnimal(e.target.value)}
                      className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl font-bold text-slate-800 outline-none transition-all shadow-sm"
                    >
                      <option value="">Buscar en el hato...</option>
                      {MOCK_ANIMALS.map(a => <option key={a.id} value={a.id}>{a.breed} (#{a.tagId})</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Sintomatología</label>
                    <textarea 
                      placeholder="Ej: Presenta inflamación en pezuña trasera derecha, cojera leve..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl font-bold text-slate-800 outline-none h-28 resize-none shadow-sm"
                    />
                  </div>
                </div>
              </div>

              <button 
                onClick={startConsult}
                disabled={!description || !selectedAnimal}
                className="w-full py-5 bg-blue-600 text-white font-black rounded-3xl hover:bg-blue-700 disabled:opacity-50 transition-all shadow-2xl flex items-center justify-center gap-3 text-sm uppercase tracking-widest active:scale-95"
              >
                <Brain size={20} /> Ejecutar Análisis Clínico IA
              </button>
            </div>
          )}

          {step === 'processing' && (
            <div className="py-24 flex flex-col items-center justify-center space-y-8 animate-in fade-in">
              <div className="relative w-32 h-32">
                <div className="absolute inset-0 border-8 border-blue-50 rounded-[40px] rotate-12"></div>
                <div className="absolute inset-0 border-8 border-blue-600 rounded-[40px] border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Brain className="text-blue-600 animate-pulse" size={48} />
                </div>
              </div>
              <div className="text-center">
                <h4 className="text-2xl font-black text-slate-900 tracking-tighter">ANALIZANDO PATRONES</h4>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2 animate-bounce">Consulando base de datos sanitaria...</p>
              </div>
            </div>
          )}

          {step === 'result' && aiResult && (
            <div className="space-y-6 animate-in slide-in-from-bottom-10 duration-700">
              <div className="p-5 bg-green-50 border border-green-200 rounded-3xl flex gap-4 items-center">
                <ShieldCheck className="text-green-600" size={28} />
                <div>
                   <p className="text-xs font-black text-green-800 uppercase tracking-widest">Análisis Completado</p>
                   <p className="text-xs text-green-700 font-bold">Hemos generado una recomendación clínica referencial.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 p-6 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Diagnóstico Presuntivo</p>
                  <p className="text-2xl font-black text-slate-900 tracking-tight">{aiResult.diagnosis}</p>
                </div>
                <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Medicamento Sugerido</p>
                  <p className="text-lg font-black text-blue-600 uppercase tracking-tighter">{aiResult.medication}</p>
                </div>
                <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Dosis Recomendada</p>
                  <p className="text-lg font-black text-slate-800 tracking-tighter">{aiResult.dosage}</p>
                </div>
              </div>

              <button 
                onClick={onClose}
                className="w-full py-5 bg-blue-600 text-white font-black rounded-[24px] hover:bg-blue-700 shadow-2xl flex items-center justify-center gap-3 text-xs uppercase tracking-widest transition-all active:scale-95"
              >
                <CheckCircle size={20} /> Finalizar Consulta
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const HealthManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'records' | 'vets' | 'ticks'>('records');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isVetModalOpen, setIsVetModalOpen] = useState(false);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [isTickModalOpen, setIsTickModalOpen] = useState(false);
  const [selectedVet, setSelectedVet] = useState<Veterinarian | undefined>(undefined);
  const [selectedRecord, setSelectedRecord] = useState<HealthRecord | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecords = useMemo(() => {
    return MOCK_HEALTH_RECORDS.filter(r => {
      const animal = MOCK_ANIMALS.find(a => a.id === r.animalId);
      const vet = MOCK_VETERINARIANS.find(v => v.id === r.veterinarianId);
      const search = searchTerm.toLowerCase();
      return (
        r.description.toLowerCase().includes(search) ||
        animal?.tagId.toLowerCase().includes(search) ||
        vet?.name.toLowerCase().includes(search) ||
        r.type.toLowerCase().includes(search)
      );
    });
  }, [searchTerm]);

  const contactVet = (vet: Veterinarian, channel: 'whatsapp' | 'email') => {
    if (channel === 'whatsapp') {
      const cleanPhone = vet.phone.replace(/[^0-9]/g, '');
      window.open(`https://wa.me/${cleanPhone}?text=Hola Dr. ${vet.alias || vet.name}, le contacto desde AR CONTROL GANADERO sobre un ejemplar en tratamiento.`, '_blank');
    } else {
      window.open(`mailto:${vet.email}?subject=Consulta Veterinaria - AR CONTROL GANADERO`, '_blank');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-1">Central Sanitaria</h2>
          <p className="text-slate-500 font-bold text-sm italic">Monitoreo clínico, vacunación y red de veterinarios - AR CONTROL GANADERO.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2">
          <button 
            onClick={() => setIsAiModalOpen(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-gradient-to-br from-blue-600 to-indigo-700 text-white px-8 py-4 rounded-[22px] font-black text-xs uppercase tracking-widest hover:shadow-2xl hover:shadow-blue-600/30 transition-all active:scale-95 shadow-lg shadow-blue-500/20 shrink-0"
          >
            <Sparkles size={20} className="animate-pulse" /> Consulta Médica IA
          </button>
          <button 
            onClick={() => {
              if (activeTab === 'records') setIsRecordModalOpen(true);
              else if (activeTab === 'vets') setIsVetModalOpen(true);
              else setIsTickModalOpen(true);
            }}
            className="p-4 bg-slate-900 text-white rounded-[22px] hover:bg-black shadow-xl transition-all active:scale-90 shrink-0"
          >
            <Plus size={24} />
          </button>
        </div>
      </div>

      <VaccinationAlertPanel />

      <div className="flex p-1.5 bg-white rounded-3xl border border-slate-200 shadow-sm w-fit overflow-x-auto scrollbar-hide">
        <button onClick={() => setActiveTab('records')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${activeTab === 'records' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}>Bitácora Clínica</button>
        <button onClick={() => setActiveTab('ticks')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${activeTab === 'ticks' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}>Control Garrapatas</button>
        <button onClick={() => setActiveTab('vets')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${activeTab === 'vets' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}>Directorio Veterinarios</button>
      </div>

      {activeTab === 'records' && (
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-center">
             <div className="relative flex-1 w-full">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
               <input 
                type="text" 
                placeholder="Buscar por ejemplar, veterinario o diagnóstico..." 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl font-bold text-xs outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
               />
             </div>
             <button className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 transition-all"><Filter size={20} /></button>
          </div>

          <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-sm">
            <div className="divide-y divide-slate-100">
              {filteredRecords.map((record) => {
                const animal = MOCK_ANIMALS.find(a => a.id === record.animalId);
                const vet = MOCK_VETERINARIANS.find(v => v.id === record.veterinarianId);
                return (
                  <div key={record.id} className="p-8 flex flex-col md:flex-row items-center gap-8 hover:bg-slate-50/80 transition-all group">
                    <div className="w-20 h-20 rounded-3xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 border border-blue-100 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm relative">
                      <Stethoscope size={32} />
                      {record.isEmergency && <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full border-2 border-white animate-pulse flex items-center justify-center"><AlertTriangle size={12} className="text-white" /></div>}
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4 mb-4">
                        <div>
                          <p className="font-black text-slate-900 text-xl tracking-tighter uppercase mb-1">{record.type}: {record.description}</p>
                          <div className="flex items-center justify-center md:justify-start gap-3">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ejemplar: {animal?.breed}</span>
                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-[9px] font-black border border-emerald-200">#{animal?.tagId}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                           <button onClick={() => { setSelectedRecord(record); setIsRecordModalOpen(true); }} className="p-3 bg-white hover:bg-amber-500 hover:text-white rounded-xl border border-slate-100 shadow-sm transition-all text-slate-400"><Pencil size={16} /></button>
                           <button className="p-3 bg-white hover:bg-red-500 hover:text-white rounded-xl border border-slate-100 shadow-sm transition-all text-slate-400"><Trash2 size={16} /></button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                         <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Medicamento / Dosis</p>
                            <p className="text-xs font-black text-slate-700">{record.medication || 'No registrado'} - {record.dosage}</p>
                         </div>
                         <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                            <p className="text-[8px] font-black text-emerald-600 uppercase tracking-widest mb-1">Seguimiento / Mejora</p>
                            <p className="text-xs font-bold text-emerald-800 italic truncate">{record.progressNotes || 'Sin notas de avance'}</p>
                         </div>
                         <div className="p-4 bg-white rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400"><User size={14} /></div>
                              <div>
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Atendió</p>
                                <p className="text-[10px] font-black text-slate-900">{vet?.alias || vet?.name}</p>
                              </div>
                            </div>
                            {vet && (
                              <div className="flex gap-1.5">
                                <button onClick={() => contactVet(vet, 'whatsapp')} className="p-2 bg-emerald-500 text-white rounded-lg shadow-md hover:scale-110 transition-transform"><MessageCircle size={14} /></button>
                                <button onClick={() => contactVet(vet, 'email')} className="p-2 bg-blue-600 text-white rounded-lg shadow-md hover:scale-110 transition-transform"><Mail size={14} /></button>
                              </div>
                            )}
                         </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'ticks' && (
        <div className="space-y-6">
           <div className="bg-white p-10 rounded-[48px] border border-slate-200 shadow-sm">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                 <div className="flex items-center gap-4">
                    <div className="p-4 bg-emerald-50 text-emerald-600 rounded-3xl"><Bug size={32} /></div>
                    <div>
                       <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">Status de Baños y Ectoparásitos</h3>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Monitoreo Territorial Nayarit</p>
                    </div>
                 </div>
                 <button onClick={() => setIsTickModalOpen(true)} className="w-full md:w-auto px-8 py-4 bg-emerald-600 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-xl hover:bg-emerald-700 transition-all active:scale-95 flex items-center justify-center gap-2">
                    <Droplets size={16} /> Registrar Baño del Día
                 </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                 {[
                   { label: 'Último Baño General', value: '18 May 2025', icon: <Calendar size={20} />, sub: 'Hace 6 días' },
                   { label: 'Potreros en Riesgo', value: '2', icon: <AlertTriangle size={20} />, sub: 'Infestación Media' },
                   { label: 'Eficacia Acumulada', value: '94%', icon: <ShieldCheck size={20} />, sub: 'Basado en histórico' }
                 ].map((stat, i) => (
                   <div key={i} className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 flex items-center gap-5">
                      <div className="p-4 bg-white rounded-2xl text-emerald-600 shadow-sm">{stat.icon}</div>
                      <div>
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                         <p className="text-xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
                         <p className="text-[10px] text-emerald-600 font-bold uppercase">{stat.sub}</p>
                      </div>
                   </div>
                 ))}
              </div>

              <div className="space-y-4">
                 <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Historial de Aplicaciones Recientes</h4>
                 {[
                   { id: '1', date: '2025-05-18', paddock: 'Potrero El Águila', count: 42, product: 'Amitraz 12.5%', level: 'Media', method: 'Aspersión' },
                   { id: '2', date: '2025-05-10', paddock: 'Corral de Manejo', count: 15, product: 'Ivermectina Pour-on', level: 'Baja', method: 'Pour-on' }
                 ].map((bath) => (
                   <div key={bath.id} className="p-6 bg-white border border-slate-200 rounded-[32px] hover:shadow-xl transition-all group flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="flex items-center gap-6">
                         <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-all"><Droplets size={24} /></div>
                         <div>
                            <p className="font-black text-slate-900 uppercase tracking-tighter text-lg">{bath.product}</p>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{bath.paddock} • {bath.method}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-12">
                         <div className="text-center">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Carga</p>
                            <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${bath.level === 'Alta' ? 'bg-red-100 text-red-600' : (bath.level === 'Media' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600')}`}>
                               {bath.level}
                            </span>
                         </div>
                         <div className="text-right">
                            <p className="text-xl font-black text-slate-900 tracking-tighter">{bath.count} Cab.</p>
                            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{bath.date}</p>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      )}

      {activeTab === 'vets' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {MOCK_VETERINARIANS.map(v => (
             <div key={v.id} className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all group p-8">
                <div className="flex justify-between items-start mb-8">
                   <div className="w-20 h-20 rounded-[28px] bg-slate-50 border-2 border-slate-100 flex items-center justify-center overflow-hidden group-hover:border-blue-500 transition-all shadow-inner">
                      {v.photoUrl ? <img src={v.photoUrl} className="w-full h-full object-cover" /> : <User size={32} className="text-slate-300" />}
                   </div>
                   <div className="flex gap-2">
                      <button onClick={() => { setSelectedVet(v); setIsVetModalOpen(true); }} className="p-2.5 bg-slate-50 hover:bg-blue-600 hover:text-white rounded-xl transition-all text-slate-400"><Pencil size={14} /></button>
                      <button className="p-2.5 bg-slate-50 hover:bg-red-500 hover:text-white rounded-xl transition-all text-slate-400"><Trash2 size={14} /></button>
                   </div>
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase mb-1">{v.name}</h3>
                <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest mb-6">{v.clinicName} {v.alias && `(${v.alias})`}</p>
                
                <div className="space-y-3 mb-8">
                   <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
                      <Phone size={14} className="text-blue-500" /> {v.phone}
                   </div>
                   <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
                      <Mail size={14} className="text-blue-500" /> {v.email}
                   </div>
                   <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 italic">
                      <MapPin size={14} className="text-amber-500 shrink-0" /> {v.address}
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                   <button onClick={() => contactVet(v, 'whatsapp')} className="py-3.5 bg-emerald-500 text-white font-black rounded-2xl flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all">
                      <MessageCircle size={16} /> WhatsApp
                   </button>
                   <button onClick={() => contactVet(v, 'email')} className="py-3.5 bg-blue-600 text-white font-black rounded-2xl flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all">
                      <Mail size={16} /> Contactar
                   </button>
                </div>
             </div>
           ))}
        </div>
      )}

      {isAiModalOpen && <AiConsultModal onClose={() => setIsAiModalOpen(false)} />}
      {isVetModalOpen && <VetModal vet={selectedVet} onClose={() => { setIsVetModalOpen(false); setSelectedVet(undefined); }} />}
      {isRecordModalOpen && <ClinicalRecordModal record={selectedRecord} onClose={() => { setIsRecordModalOpen(false); setSelectedRecord(undefined); }} />}
      {isTickModalOpen && <TickControlModal onClose={() => setIsTickModalOpen(false)} />}
    </div>
  );
};

export default HealthManagement;
