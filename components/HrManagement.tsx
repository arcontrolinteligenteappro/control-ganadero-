
import React, { useState, useRef } from 'react';
import { MOCK_EMPLOYEES } from '../constants';
import { 
  UserCheck, Plus, DollarSign, Wallet, Phone, ArrowUpCircle, X, 
  CheckCircle, FileText, Camera, Mail, MapPin, Calendar, 
  CreditCard, Banknote, History, Trash2, UserCircle, Save, Sparkles,
  AlertCircle, Clock, Info, CheckSquare, Pencil, NotebookPen, Share2, Printer, MessageSquare
} from 'lucide-react';
import { Employee, PaymentFrequency, PaymentMethod, AttendanceStatus } from '../types';

const AddEditEmployeeModal: React.FC<{ onClose: () => void; employee?: Employee }> = ({ onClose, employee }) => {
  const [photo, setPhoto] = useState<string | null>(employee?.photoUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [emp, setEmp] = useState<Partial<Employee>>(employee || {
    name: '',
    alias: '',
    position: 'Vaquero',
    salary: 0,
    frequency: 'Semanal',
    phone: '',
    email: '',
    address: '',
    notes: '',
    status: 'Activo',
    loans: 0
  });

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 border border-slate-200">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-[#1a2421] text-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-600 rounded-2xl">
              {employee ? <Pencil size={24} /> : <UserCheck size={24} />}
            </div>
            <div>
              <h3 className="font-black text-xl uppercase tracking-tighter">
                {employee ? 'Editar Colaborador' : 'Registrar Colaborador'}
              </h3>
              <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Capital Humano AR CONTROL GANADERO</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all"><X size={24} /></button>
        </div>
        
        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="flex flex-col md:flex-row gap-8 items-center">
             <div className="relative group">
                <div className="w-40 h-40 bg-slate-100 rounded-[40px] flex items-center justify-center border-4 border-slate-50 shadow-inner overflow-hidden">
                  {photo ? <img src={photo} className="w-full h-full object-cover" /> : <UserCircle size={80} className="text-slate-300" />}
                </div>
                <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-2 -right-2 p-4 bg-amber-600 text-white rounded-2xl shadow-xl hover:scale-110 transition-all border-4 border-white">
                  <Camera size={20} />
                </button>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" capture="user" onChange={handlePhoto} />
             </div>
             
             <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Nombre Completo *</label>
                  <input type="text" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none focus:border-amber-500" value={emp.name} onChange={e => setEmp({...emp, name: e.target.value})} placeholder="Requerido" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Alias / Apodo</label>
                  <input type="text" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none focus:border-amber-500" value={emp.alias} onChange={e => setEmp({...emp, alias: e.target.value})} placeholder="Ej: El Chato" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Puesto</label>
                  <input type="text" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none focus:border-amber-500" value={emp.position} onChange={e => setEmp({...emp, position: e.target.value})} placeholder="Ej: Vaquero" />
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="md:col-span-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Tipo de Pago</label>
                <select className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold" value={emp.frequency} onChange={e => setEmp({...emp, frequency: e.target.value as PaymentFrequency})}>
                  <option value="Diario">Diario</option>
                  <option value="Semanal">Semanal</option>
                  <option value="Quincenal">Quincenal</option>
                  <option value="Mensual">Mensual</option>
                  <option value="Eventual">Eventual / Otro</option>
                </select>
             </div>
             <div className="md:col-span-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Sueldo / Pago Pactado ($)</label>
                <input type="number" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-emerald-600 outline-none focus:border-amber-500" value={emp.salary} onChange={e => setEmp({...emp, salary: Number(e.target.value)})} />
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Teléfono *</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input type="tel" className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none focus:border-amber-500" value={emp.phone} onChange={e => setEmp({...emp, phone: e.target.value})} placeholder="Requerido" />
              </div>
            </div>
            <div className="col-span-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Correo Electrónico</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input type="email" className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none focus:border-amber-500" value={emp.email} onChange={e => setEmp({...emp, email: e.target.value})} placeholder="opcional@ejemplo.com" />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Dirección Particular</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input type="text" className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none focus:border-amber-500" value={emp.address} onChange={e => setEmp({...emp, address: e.target.value})} placeholder="Calle, Número, Localidad" />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Nota General / Bitácora Interna</label>
              <div className="relative">
                <NotebookPen className="absolute left-4 top-4 text-slate-300" size={16} />
                <textarea className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none focus:border-amber-500 h-24 resize-none" value={emp.notes} onChange={e => setEmp({...emp, notes: e.target.value})} placeholder="Información relevante del empleado..." />
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
           <button onClick={onClose} className="flex-1 py-4 bg-white border-2 border-slate-200 text-slate-400 font-black rounded-2xl hover:bg-slate-100 transition-all uppercase tracking-widest text-[10px]">Cancelar</button>
           <button onClick={() => { alert(employee ? 'Empleado actualizado exitosamente' : 'Empleado registrado exitosamente'); onClose(); }} className="flex-1 py-4 bg-amber-600 text-white font-black rounded-2xl hover:bg-amber-700 shadow-xl shadow-amber-600/20 transition-all uppercase tracking-widest text-[10px] flex items-center justify-center gap-2">
             <Save size={18} /> {employee ? 'Guardar Cambios' : 'Confirmar Alta'}
           </button>
        </div>
      </div>
    </div>
  );
};

const AttendanceModal: React.FC<{ employees: Employee[]; onClose: () => void }> = ({ employees, onClose }) => {
  const [attendance, setAttendance] = useState<Record<string, { status: AttendanceStatus; notes: string }>>(
    employees.reduce((acc, emp) => ({ ...acc, [emp.id]: { status: 'Asistió', notes: '' } }), {})
  );

  const setStatus = (id: string, status: AttendanceStatus) => setAttendance(prev => ({ ...prev, [id]: { ...prev[id], status } }));
  const setNotes = (id: string, notes: string) => setAttendance(prev => ({ ...prev, [id]: { ...prev[id], notes } }));

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-3xl rounded-[40px] shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-amber-600 text-white">
          <div className="flex items-center gap-3">
             <CheckSquare size={24} />
             <div>
               <h3 className="font-black text-xl uppercase tracking-tighter leading-none">Pase de Lista con Bitácora</h3>
               <p className="text-[10px] font-bold text-white/80 uppercase tracking-widest mt-1">Fecha: {new Date().toLocaleDateString()}</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full"><X size={24} /></button>
        </div>
        
        <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
           {employees.map(emp => (
             <div key={emp.id} className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-300 overflow-hidden border shadow-sm">
                      {emp.photoUrl ? <img src={emp.photoUrl} className="w-full h-full object-cover" /> : <UserCircle size={24} />}
                    </div>
                    <div>
                      <p className="font-black text-slate-800 uppercase tracking-tighter text-sm">{emp.name}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase">{emp.position}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-1.5 bg-white p-1 rounded-2xl border border-slate-200">
                     {[
                       { s: 'Asistió', icon: <CheckCircle size={14} />, color: 'bg-emerald-500 text-white' },
                       { s: 'Faltó', icon: <X size={14} />, color: 'bg-red-500 text-white' },
                       { s: 'Retardo', icon: <Clock size={14} />, color: 'bg-amber-500 text-white' },
                       { s: 'Justificado', icon: <Info size={14} />, color: 'bg-blue-500 text-white' }
                     ].map(opt => (
                       <button 
                        key={opt.s} 
                        onClick={() => setStatus(emp.id, opt.s as AttendanceStatus)}
                        className={`px-3 py-2 rounded-xl text-[9px] font-black uppercase transition-all flex items-center gap-1.5 ${attendance[emp.id].status === opt.s ? opt.color : 'text-slate-400 hover:bg-slate-50'}`}
                       >
                         {opt.icon} <span className="hidden sm:inline">{opt.s}</span>
                       </button>
                     ))}
                  </div>
                </div>

                <div className="relative">
                  <FileText className="absolute left-4 top-3.5 text-slate-300" size={14} />
                  <input 
                    type="text" 
                    placeholder="Bitácora del día (ej: Limpieza de corral 4, movió toros...)"
                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 focus:border-amber-500 outline-none"
                    value={attendance[emp.id].notes}
                    onChange={e => setNotes(emp.id, e.target.value)}
                  />
                </div>
             </div>
           ))}
        </div>
        <div className="p-8 bg-slate-50 border-t flex gap-4">
           <button onClick={() => { alert('Asistencia y Bitácora guardada. Pagos recalculados.'); onClose(); }} className="w-full py-5 bg-amber-600 text-white font-black rounded-3xl hover:bg-amber-700 shadow-xl transition-all uppercase tracking-widest text-xs">Guardar Lista Diaria</button>
        </div>
      </div>
    </div>
  );
};

const PayrollModal: React.FC<{ employee: Employee; onClose: () => void }> = ({ employee, onClose }) => {
  const [daysWorked, setDaysWorked] = useState(6);
  const [method, setMethod] = useState<PaymentMethod>('Efectivo');
  const [received, setReceived] = useState<number>(0);
  const [isPaid, setIsPaid] = useState(false);

  const baseSalary = employee.salary;
  const netToPay = (baseSalary * (daysWorked / 6)) - employee.loans;
  const change = Math.max(0, received - netToPay);

  const handleShare = (channel: 'whatsapp' | 'email' | 'other') => {
    const message = `Recibo de Pago - AR CONTROL GANADERO\n----------------------------\nColaborador: ${employee.name}\nNeto Pagado: $${netToPay.toLocaleString()}\nMetodo: ${method}\nFecha: ${new Date().toLocaleDateString()}\n----------------------------\n¡Gracias por tu trabajo!`;
    
    if (channel === 'whatsapp') {
      const url = `https://wa.me/${employee.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    } else if (channel === 'email') {
      const url = `mailto:${employee.email || ''}?subject=Recibo de Pago Nómina&body=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    } else {
      if (navigator.share) {
        navigator.share({ title: 'Comprobante de Pago', text: message }).catch(() => {});
      } else {
        alert("Compartir no soportado en este navegador.");
      }
    }
  };

  if (isPaid) {
    return (
      <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in">
        <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden border border-slate-200 p-10 text-center animate-in zoom-in-95">
           <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20">
              <CheckCircle size={48} className="animate-bounce" />
           </div>
           <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-2">¡Pago Exitoso!</h3>
           <p className="text-slate-500 font-bold mb-8 italic">Se ha liquidado la nómina para {employee.name}.</p>
           
           <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 mb-8 text-left space-y-2">
              <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                 <span>Folio Interno</span>
                 <span>#{Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                 <span className="text-sm font-black text-slate-800 uppercase">Monto Neto</span>
                 <span className="text-2xl font-black text-emerald-600">${netToPay.toLocaleString()}</span>
              </div>
           </div>

           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Enviar Comprobante a Colaborador</p>
           <div className="grid grid-cols-3 gap-3 mb-8">
              <button onClick={() => handleShare('whatsapp')} className="flex flex-col items-center gap-2 p-4 bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-100 transition-all group">
                 <MessageSquare size={24} className="group-hover:scale-110 transition-transform" />
                 <span className="text-[8px] font-black uppercase">WhatsApp</span>
              </button>
              <button onClick={() => handleShare('email')} className="flex flex-col items-center gap-2 p-4 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-100 transition-all group">
                 <Mail size={24} className="group-hover:scale-110 transition-transform" />
                 <span className="text-[8px] font-black uppercase">Email</span>
              </button>
              <button onClick={() => handleShare('other')} className="flex flex-col items-center gap-2 p-4 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition-all group">
                 <Share2 size={24} className="group-hover:scale-110 transition-transform" />
                 <span className="text-[8px] font-black uppercase">Otros</span>
              </button>
           </div>

           <button onClick={onClose} className="w-full py-5 bg-slate-900 text-white font-black rounded-3xl hover:bg-black transition-all uppercase tracking-widest text-xs">
              Finalizar Proceso
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 border border-slate-200">
        <div className="p-8 border-b border-slate-100 bg-[#2d3a3a] text-white flex justify-between items-center">
          <div>
            <h3 className="font-black text-xl uppercase tracking-tighter">Nómina: {employee.name}</h3>
            <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Base: ${employee.salary} ({employee.frequency})</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all"><X size={24} /></button>
        </div>
        
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
             <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Días Asistidos</label>
                <input type="number" className="w-full bg-transparent font-black text-2xl outline-none" value={daysWorked} onChange={e => setDaysWorked(Number(e.target.value))} />
             </div>
             <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
                <label className="text-[10px] font-black text-red-400 uppercase tracking-widest block mb-1">Retención Préstamo</label>
                <p className="font-black text-2xl text-red-600">-${employee.loans.toLocaleString()}</p>
             </div>
          </div>

          <div className="p-8 bg-emerald-600 rounded-[32px] text-white shadow-xl flex justify-between items-center">
             <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Neto Calculado (Bitácora)</p>
                <p className="text-4xl font-black tracking-tighter">${netToPay.toLocaleString()}</p>
             </div>
             <Wallet size={40} className="opacity-20" />
          </div>

          <div className="space-y-4">
             <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
               {['Efectivo', 'Transferencia', 'Tarjeta Crédito', 'Tarjeta Débito', 'Otro'].map(m => (
                 <button key={m} onClick={() => setMethod(m as PaymentMethod)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase border-2 transition-all shrink-0 ${method === m ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}`}>
                   {m}
                 </button>
               ))}
             </div>

             {method === 'Efectivo' && (
               <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-4">
                  <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                    <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest block mb-1">Paga con ($)</label>
                    <input type="number" className="w-full bg-transparent font-black text-2xl text-blue-900 outline-none" value={received} onChange={e => setReceived(Number(e.target.value))} placeholder="0.00" />
                  </div>
                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                    <label className="text-[10px] font-black text-amber-600 uppercase tracking-widest block mb-1">Cambio a Entregar</label>
                    <p className="font-black text-2xl text-amber-700">${change.toLocaleString()}</p>
                  </div>
               </div>
             )}
          </div>

          <button onClick={() => setIsPaid(true)} className="w-full py-5 bg-slate-900 text-white font-black rounded-[28px] hover:bg-black shadow-2xl transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-3 active:scale-95">
             <CheckCircle size={20} className="text-emerald-500" /> Procesar Pago de Nómina
          </button>
        </div>
      </div>
    </div>
  );
};

const HrManagement: React.FC = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`¿Seguro que deseas eliminar definitivamente a ${name} del sistema? Esta acción no se puede deshacer.`)) {
       alert(`${name} ha sido eliminado del sistema.`);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-tight">Gestión de Personal</h2>
          <p className="text-slate-500 font-bold text-sm italic">Asistencia, bitácora y pagos automatizados.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button onClick={() => setIsAttendanceOpen(true)} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border-2 border-slate-200 px-6 py-3.5 rounded-2xl text-[10px] font-black text-slate-800 hover:bg-slate-50 transition-all uppercase active:scale-95 shadow-sm">
            <CheckSquare size={16} /> Pase de Lista
          </button>
          <button onClick={() => setIsAddOpen(true)} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-amber-600 text-white px-8 py-3.5 rounded-2xl text-[10px] font-black hover:bg-amber-700 shadow-xl transition-all uppercase tracking-widest">
            <Plus size={16} /> Nuevo Ingreso
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_EMPLOYEES.map(emp => (
          <div key={emp.id} className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all group">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="w-20 h-20 bg-slate-50 rounded-[28px] flex items-center justify-center text-slate-300 border-2 border-slate-100 group-hover:bg-[#2d3a3a] group-hover:text-white transition-all shadow-inner overflow-hidden">
                   {emp.photoUrl ? <img src={emp.photoUrl} className="w-full h-full object-cover" /> : <UserCircle size={32} />}
                </div>
                <div className="flex flex-col items-end gap-1.5">
                   <div className="flex gap-2">
                      <button onClick={() => setEditingEmployee(emp as Employee)} className="p-2 bg-slate-100 hover:bg-amber-500 hover:text-white rounded-lg transition-all text-slate-400" title="Editar Personal">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(emp.id, emp.name)} className="p-2 bg-slate-100 hover:bg-red-500 hover:text-white rounded-lg transition-all text-slate-400" title="Eliminar Personal">
                        <Trash2 size={14} />
                      </button>
                   </div>
                   <span className="px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100">ACTIVO</span>
                </div>
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase mb-1">{emp.name}</h3>
              <p className="text-[10px] text-amber-600 font-black uppercase tracking-widest mb-6">{emp.position} {emp.alias && `(${emp.alias})`}</p>
              
              <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Sueldo {emp.frequency}</p>
                   <p className="text-lg font-black text-slate-800">${emp.salary.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                   <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest mb-1">Asistencia Mes</p>
                   <p className="text-lg font-black text-amber-800">24/24</p>
                </div>
              </div>

              <div className="space-y-3">
                <button onClick={() => setSelectedEmployee(emp as Employee)} className="w-full flex items-center justify-center gap-2 py-4 bg-[#2d3a3a] text-white font-black rounded-2xl hover:bg-black transition-all text-[10px] uppercase tracking-widest active:scale-95 shadow-lg">
                  <Banknote size={16} className="text-emerald-500" /> Liquidar Nómina
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {(isAddOpen || editingEmployee) && (
        <AddEditEmployeeModal 
          employee={editingEmployee || undefined} 
          onClose={() => { setIsAddOpen(false); setEditingEmployee(null); }} 
        />
      )}
      {isAttendanceOpen && <AttendanceModal employees={MOCK_EMPLOYEES as Employee[]} onClose={() => setIsAttendanceOpen(false)} />}
      {selectedEmployee && <PayrollModal employee={selectedEmployee} onClose={() => setSelectedEmployee(null)} />}
    </div>
  );
};

export default HrManagement;
