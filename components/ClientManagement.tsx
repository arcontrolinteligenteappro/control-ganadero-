import React, { useState, useMemo, useRef } from 'react';
import { MOCK_CLIENTS } from '../constants';
import { 
  Plus, Search, User, Phone, Mail, MapPin, X, CreditCard, 
  ChevronRight, FileText, UserPlus, Banknote, History, Save, TrendingDown, TrendingUp,
  Receipt, Wallet, Calendar, AlertCircle, Briefcase, Truck, ArrowRightLeft, Printer,
  Camera, Image as ImageIcon, Trash2, Pencil, NotebookPen, MessageCircle, CheckCircle
} from 'lucide-react';
import { Client, ClientTransaction, ContactRole } from '../types';

// MODAL PARA AGREGAR O EDITAR COMPRADORES / PROVEEDORES
const AddEditClientModal: React.FC<{ onClose: () => void; client?: Client }> = ({ onClose, client }) => {
  const [photo, setPhoto] = useState<string | null>(client?.photoUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<Partial<Client>>(client || {
    name: '',
    alias: '',
    role: 'Comprador',
    phone: '',
    email: '',
    address: '',
    notes: '',
    creditLimit: 0,
    balance: 0
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!formData.name || !formData.phone) {
      alert("Nombre y Teléfono son obligatorios.");
      return;
    }
    alert(`Contacto ${client ? 'actualizado' : 'registrado'} correctamente en el nodo central.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in">
      <div className="bg-white dark:bg-[#0a0f0d] w-full max-w-2xl rounded-[48px] shadow-2xl overflow-hidden border border-slate-200 dark:border-[#10b981]/20 animate-in zoom-in-95">
        <div className="p-8 bg-[#1a2421] dark:bg-[#10b981] text-white dark:text-black flex justify-between items-center">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 dark:bg-black/10 rounded-2xl shadow-inner">
                {formData.role === 'Proveedor' ? <Truck size={28} /> : <User size={28} />}
              </div>
              <div>
                 <h3 className="text-2xl font-black uppercase tracking-tighter leading-none">
                    {client ? 'Editar Identidad' : 'Alta de Contacto Comercial'}
                 </h3>
                 <p className="text-[10px] font-bold uppercase tracking-widest mt-2 opacity-70">Directorio Maestro :: Nodo_B</p>
              </div>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all"><X size={28} /></button>
        </div>

        <div className="p-10 space-y-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
           <div className="flex flex-col md:flex-row gap-10 items-center">
              <div className="relative group">
                 <div className="w-44 h-44 rounded-[40px] bg-slate-50 dark:bg-black border-4 border-slate-100 dark:border-[#10b981]/20 shadow-2xl overflow-hidden flex items-center justify-center text-slate-300">
                    {photo ? <img src={photo} className="w-full h-full object-cover" /> : <User size={80} />}
                 </div>
                 <div className="absolute -bottom-4 -right-4 flex gap-2">
                    <button onClick={() => fileInputRef.current?.click()} className="p-4 bg-amber-600 dark:bg-[#10b981] text-white dark:text-black rounded-2xl shadow-xl hover:scale-110 transition-all border-4 border-white dark:border-[#0a0f0d]">
                       <Camera size={24} />
                    </button>
                 </div>
                 <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoUpload} />
              </div>

              <div className="flex-1 space-y-5 w-full">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                       <label className="text-[10px] font-black text-slate-400 dark:text-[#10b981]/40 uppercase tracking-widest ml-1 mb-2 block">Nombre Comercial / Razón Social *</label>
                       <input type="text" className="w-full p-4 bg-slate-50 dark:bg-black border-2 border-slate-100 dark:border-[#10b981]/20 rounded-2xl font-black dark:text-[#10b981] outline-none focus:border-amber-500" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div className="col-span-1">
                       <label className="text-[10px] font-black text-slate-400 dark:text-[#10b981]/40 uppercase tracking-widest ml-1 mb-2 block">Alias / Marca</label>
                       <input type="text" className="w-full p-4 bg-slate-50 dark:bg-black border-2 border-slate-100 dark:border-[#10b981]/20 rounded-2xl font-bold dark:text-[#10b981] outline-none" value={formData.alias} onChange={e => setFormData({...formData, alias: e.target.value})} />
                    </div>
                    <div className="col-span-1">
                       <label className="text-[10px] font-black text-slate-400 dark:text-[#10b981]/40 uppercase tracking-widest ml-1 mb-2 block">Rol Comercial</label>
                       <select className="w-full p-4 bg-slate-50 dark:bg-black border-2 border-slate-100 dark:border-[#10b981]/20 rounded-2xl font-black text-[10px] uppercase dark:text-[#10b981]" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as ContactRole})}>
                          <option value="Comprador">Comprador</option>
                          <option value="Proveedor">Proveedor</option>
                          <option value="Ambos">Ambos (Mixto)</option>
                       </select>
                    </div>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                 <label className="text-[10px] font-black text-slate-400 dark:text-[#10b981]/40 uppercase tracking-widest ml-1 mb-2 block">Teléfono / WhatsApp *</label>
                 <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input type="tel" className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-black border-2 border-slate-100 dark:border-[#10b981]/20 rounded-2xl font-bold dark:text-[#10b981]" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                 </div>
              </div>
              <div>
                 <label className="text-[10px] font-black text-slate-400 dark:text-[#10b981]/40 uppercase tracking-widest ml-1 mb-2 block">Email Corporativo</label>
                 <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input type="email" className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-black border-2 border-slate-100 dark:border-[#10b981]/20 rounded-2xl font-bold dark:text-[#10b981]" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                 </div>
              </div>
              <div className="md:col-span-2">
                 <label className="text-[10px] font-black text-slate-400 dark:text-[#10b981]/40 uppercase tracking-widest ml-1 mb-2 block">Dirección de Entrega / Fiscal</label>
                 <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input type="text" className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-black border-2 border-slate-100 dark:border-[#10b981]/20 rounded-2xl font-bold dark:text-[#10b981]" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                 </div>
              </div>
              <div>
                 <label className="text-[10px] font-black text-slate-400 dark:text-[#10b981]/40 uppercase tracking-widest ml-1 mb-2 block">Límite de Crédito Pactado ($)</label>
                 <input type="number" className="w-full p-4 bg-slate-50 dark:bg-black border-2 border-slate-100 dark:border-[#10b981]/20 rounded-2xl font-black text-blue-600 dark:text-blue-400" value={formData.creditLimit} onChange={e => setFormData({...formData, creditLimit: Number(e.target.value)})} />
              </div>
              <div>
                 <label className="text-[10px] font-black text-slate-400 dark:text-[#10b981]/40 uppercase tracking-widest ml-1 mb-2 block">Saldo Inicial ($)</label>
                 <input type="number" className="w-full p-4 bg-slate-50 dark:bg-black border-2 border-slate-100 dark:border-[#10b981]/20 rounded-2xl font-black text-emerald-600 dark:text-emerald-400" value={formData.balance} onChange={e => setFormData({...formData, balance: Number(e.target.value)})} />
              </div>
              <div className="md:col-span-2">
                 <label className="text-[10px] font-black text-slate-400 dark:text-[#10b981]/40 uppercase tracking-widest ml-1 mb-2 block">Notas Internas de Negociación</label>
                 <textarea className="w-full p-4 bg-slate-50 dark:bg-black border-2 border-slate-100 dark:border-[#10b981]/20 rounded-2xl font-bold dark:text-[#10b981] h-24 resize-none" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
              </div>
           </div>

           <button onClick={handleSave} className="w-full py-6 bg-slate-900 dark:bg-[#10b981] text-white dark:text-black font-black rounded-[32px] shadow-2xl transition-all uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-4 active:scale-95">
              <Save size={20} /> {client ? 'Consolidar Cambios' : 'Registrar en Directorio Maestro'}
           </button>
        </div>
      </div>
    </div>
  );
};

// MODAL PARA REGISTRAR ABONOS O CARGOS FINANCIEROS
const FinancialModal: React.FC<{ client: Client; onClose: () => void }> = ({ client, onClose }) => {
  const [type, setType] = useState<'Abono' | 'Cargo'>('Abono');
  const [amount, setAmount] = useState<number>(0);
  const [concept, setConcept] = useState('');
  const [reference, setReference] = useState('');

  const handleAddTransaction = () => {
    if (amount <= 0 || !concept) {
      alert("Ingrese monto y concepto válidos");
      return;
    }
    alert(`${type} de $${amount.toLocaleString()} registrado para ${client.name}. Saldo actualizado en la nube.`);
    onClose();
  };

  const isProvider = client.role === 'Proveedor';

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-2xl animate-in fade-in duration-300">
       <div className="bg-white dark:bg-[#0a0f0d] w-full max-w-xl rounded-[48px] shadow-2xl overflow-hidden border border-slate-200 dark:border-[#10b981]/20 animate-in slide-in-from-bottom-10">
          <div className="p-8 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-[#1a2421] text-white">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-amber-600 rounded-xl"><Banknote size={24} /></div>
               <div>
                 <h3 className="font-black text-xl uppercase tracking-tighter leading-none">Módulo de Tesorería</h3>
                 <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mt-1">{client.name}</p>
               </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all"><X size={24} /></button>
          </div>

          <div className="p-10 space-y-10">
             <div className="grid grid-cols-2 gap-5">
                <button onClick={() => setType('Abono')} className={`p-8 rounded-[40px] flex flex-col items-center gap-4 border-4 transition-all ${type === 'Abono' ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-400 shadow-xl' : 'bg-slate-50 dark:bg-black border-transparent text-slate-300 dark:text-slate-700'}`}>
                   <TrendingDown size={40} />
                   <div className="text-center">
                     <span className="text-[11px] font-black uppercase tracking-widest block">Abono / Pago</span>
                     <span className="text-[9px] font-bold opacity-70 uppercase tracking-tighter">{isProvider ? 'Liquidamos deuda' : 'Recibimos cobro'}</span>
                   </div>
                </button>
                <button onClick={() => setType('Cargo')} className={`p-8 rounded-[40px] flex flex-col items-center gap-4 border-4 transition-all ${type === 'Cargo' ? 'bg-red-50 dark:bg-red-500/10 border-red-500 text-red-700 dark:text-red-400 shadow-xl' : 'bg-slate-50 dark:bg-black border-transparent text-slate-300 dark:text-slate-700'}`}>
                   <TrendingUp size={40} />
                   <div className="text-center">
                     <span className="text-[11px] font-black uppercase tracking-widest block">Cargo / Venta</span>
                     <span className="text-[9px] font-bold opacity-70 uppercase tracking-tighter">{isProvider ? 'Nueva compra' : 'Nueva venta'}</span>
                   </div>
                </button>
             </div>

             <div className="space-y-6">
                <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Monto de Operación ($)</label>
                   <input type="number" className="w-full p-8 bg-slate-50 dark:bg-black border-2 border-slate-100 dark:border-[#10b981]/20 rounded-[32px] font-black text-5xl outline-none focus:border-amber-500 text-slate-900 dark:text-[#10b981] text-center shadow-inner" placeholder="0.00" value={amount || ''} onChange={e => setAmount(Number(e.target.value))} />
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div className="col-span-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Concepto</label>
                    <input type="text" className="w-full p-5 bg-slate-50 dark:bg-black border-2 border-slate-100 dark:border-[#10b981]/20 rounded-2xl font-bold dark:text-[#10b981] outline-none" placeholder="Ej: Lote Novillos" value={concept} onChange={e => setConcept(e.target.value)} />
                  </div>
                  <div className="col-span-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Referencia / Folio</label>
                    <input type="text" className="w-full p-5 bg-slate-50 dark:bg-black border-2 border-slate-100 dark:border-[#10b981]/20 rounded-2xl font-bold dark:text-[#10b981] outline-none" placeholder="#001-AR" value={reference} onChange={e => setReference(e.target.value)} />
                  </div>
                </div>
             </div>

             <div className="p-8 bg-slate-900 dark:bg-black rounded-[40px] text-white flex justify-between items-center shadow-2xl border border-white/5">
                <div>
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Saldo Final Proyectado</p>
                   <p className="text-3xl font-black text-amber-500 tracking-tighter">
                     ${(type === 'Abono' ? client.balance - amount : client.balance + amount).toLocaleString()}
                   </p>
                </div>
                <div className="flex flex-col items-end">
                   <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Estatus</p>
                   <span className="text-[10px] font-black bg-white/5 px-4 py-2 rounded-xl border border-white/10 uppercase">EN_PROCESO</span>
                </div>
             </div>

             <button onClick={handleAddTransaction} className="w-full py-6 bg-slate-900 dark:bg-[#10b981] text-white dark:text-black font-black rounded-[32px] shadow-2xl transition-all uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-4 active:scale-95">
                <CheckCircle size={24} /> Aplicar Transacción Maestra
             </button>
          </div>
       </div>
    </div>
  );
};

// MODAL PARA HISTORIAL DE MOVIMIENTOS
const HistoryModal: React.FC<{ client: Client; onClose: () => void }> = ({ client, onClose }) => {
  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-3xl animate-in fade-in">
       <div className="bg-white dark:bg-[#0a0f0d] w-full max-w-4xl rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in-95 border border-slate-200 dark:border-[#10b981]/20 flex flex-col max-h-[90vh]">
          <div className="p-10 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50 dark:bg-black/50">
             <div className="flex items-center gap-6">
                <div className="p-4 bg-white dark:bg-black rounded-3xl border dark:border-[#10b981]/20 shadow-sm text-amber-600 dark:text-[#10b981]"><History size={32} /></div>
                <div>
                  <h3 className="font-black text-2xl uppercase tracking-tighter leading-none dark:text-[#10b981]">Expediente Comercial</h3>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">{client.name} • {client.role}</p>
                </div>
             </div>
             <div className="flex gap-3">
                <button onClick={() => window.print()} className="p-3.5 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-[#10b981] rounded-2xl hover:bg-slate-200 transition-all"><Printer size={20} /></button>
                <button onClick={onClose} className="p-3.5 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-red-400 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all"><X size={20} /></button>
             </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-10 space-y-6 custom-scrollbar">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-8 bg-slate-50 dark:bg-black rounded-[40px] border border-slate-100 dark:border-[#10b981]/10">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Balance Consolidado</p>
                   <p className={`text-3xl font-black ${client.balance > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                      ${Math.abs(client.balance).toLocaleString()}
                      <span className="text-[10px] ml-2 opacity-50 uppercase">{client.balance > 0 ? '(Deuda)' : '(Favor)'}</span>
                   </p>
                </div>
                <div className="p-8 bg-slate-50 dark:bg-black rounded-[40px] border border-slate-100 dark:border-[#10b981]/10">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Línea de Crédito</p>
                   <p className="text-3xl font-black text-blue-600 dark:text-blue-400">${client.creditLimit.toLocaleString()}</p>
                </div>
                <div className="p-8 bg-slate-50 dark:bg-black rounded-[40px] border border-slate-100 dark:border-[#10b981]/10">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Movimientos Totales</p>
                   <p className="text-3xl font-black text-slate-800 dark:text-[#10b981]">{client.transactionHistory?.length || 0}</p>
                </div>
             </div>

             <div className="space-y-4">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Bitácora Global de Movimientos</p>
                {client.transactionHistory?.map((t, i) => (
                  <div key={t.id} className="p-8 bg-white dark:bg-black/40 rounded-[40px] border border-slate-100 dark:border-[#10b981]/10 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-[#10b981]/5 hover:shadow-xl transition-all group">
                     <div className="flex items-center gap-8">
                        <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center shadow-sm border-2 ${t.type === 'Cargo' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                           {t.type === 'Cargo' ? <TrendingUp size={32} /> : <TrendingDown size={32} />}
                        </div>
                        <div>
                           <div className="flex items-center gap-3 mb-1">
                              <p className="font-black text-slate-900 dark:text-[#10b981] uppercase tracking-tighter text-xl">{t.concept}</p>
                              {t.reference && <span className="px-3 py-1 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-[#10b981]/50 rounded-lg text-[9px] font-mono border dark:border-[#10b981]/10">REF_#{t.reference}</span>}
                           </div>
                           <p className="text-[11px] text-slate-400 dark:text-[#10b981]/30 font-black uppercase tracking-widest flex items-center gap-2">
                             <Calendar size={14} className="text-amber-500" /> {t.date}
                           </p>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className={`text-4xl font-black tracking-tighter ${t.type === 'Cargo' ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                           {t.type === 'Cargo' ? '+' : '-'}${t.amount.toLocaleString()}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 dark:text-[#10b981]/20 uppercase tracking-[0.2em] mt-1">Saldo Post::${t.balanceAfter.toLocaleString()}</p>
                     </div>
                  </div>
                ))}
                {(!client.transactionHistory || client.transactionHistory.length === 0) && (
                  <div className="py-24 text-center opacity-30">
                     <Receipt size={100} className="mx-auto mb-6 text-slate-300" />
                     <p className="font-black uppercase tracking-[0.3em] text-lg text-slate-400">Sin historial de pagos registrados</p>
                  </div>
                )}
             </div>
          </div>

          <div className="p-12 bg-slate-900 dark:bg-black text-white flex flex-col md:flex-row justify-between items-center shadow-2xl border-t border-white/5">
             <div className="text-center md:text-left mb-6 md:mb-0">
                <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">Estado de Cuenta al {new Date().toLocaleDateString()}</p>
                <p className="text-6xl font-black text-amber-500 dark:text-[#10b981] tracking-tighter">${client.balance.toLocaleString()}</p>
             </div>
             <div className="flex gap-4">
                <button className="px-12 py-5 bg-white text-slate-900 rounded-[32px] font-black text-xs uppercase tracking-widest shadow-xl hover:bg-slate-100 transition-all active:scale-95">Conciliar Cuentas</button>
             </div>
          </div>
       </div>
    </div>
  );
};

// COMPONENTE PRINCIPAL
const ClientManagement: React.FC = () => {
  const [activeRole, setActiveRole] = useState<'Comprador' | 'Proveedor' | 'Todos'>('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isFinModalOpen, setIsFinModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  const filteredClients = useMemo(() => {
    return MOCK_CLIENTS.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           (c.alias?.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesRole = activeRole === 'Todos' || c.role === activeRole || c.role === 'Ambos';
      return matchesSearch && matchesRole;
    });
  }, [searchTerm, activeRole]);

  const stats = useMemo(() => {
    const totalCxC = MOCK_CLIENTS.filter(c => c.balance > 0).reduce((acc, c) => acc + c.balance, 0);
    const totalCxP = MOCK_CLIENTS.filter(c => c.balance < 0).reduce((acc, c) => acc + Math.abs(c.balance), 0);
    return { cxc: totalCxC, cxp: totalCxP };
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <h2 className="text-5xl font-black text-slate-900 dark:text-[#10b981] tracking-tighter uppercase leading-none mb-2">Ecosistema Comercial</h2>
          <p className="text-slate-500 dark:text-[#10b981]/50 font-bold text-sm uppercase tracking-widest italic opacity-70">Directorio Maestro de Compradores, Proveedores y Créditos.</p>
        </div>
        <button 
          onClick={() => { setSelectedClient(null); setIsEditModalOpen(true); }}
          className="flex items-center gap-4 bg-emerald-600 dark:bg-[#10b981] text-white dark:text-black px-12 py-6 rounded-[36px] font-black hover:bg-emerald-700 shadow-2xl transition-all uppercase tracking-widest active:scale-95 text-xs"
        >
          <UserPlus size={24} /> Nueva Identidad Comercial
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="p-10 bg-white dark:bg-[#0a1411] rounded-[56px] border border-slate-200 dark:border-[#10b981]/10 shadow-sm flex items-center gap-10 relative overflow-hidden group hover:shadow-xl transition-all tech-card">
            <div className="p-6 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 rounded-[32px] shadow-sm group-hover:scale-110 transition-transform"><TrendingUp size={40} /></div>
            <div>
               <p className="text-[11px] font-black text-slate-400 dark:text-[#10b981]/40 uppercase tracking-[0.2em] mb-1">Cuentas por Cobrar (CxC)</p>
               <h3 className="text-4xl font-black text-red-600 dark:text-red-400 tracking-tighter">${stats.cxc.toLocaleString()}</h3>
               <p className="text-[9px] font-bold text-slate-400 uppercase mt-2 tracking-widest">Activos fuera del rancho</p>
            </div>
            <div className="absolute top-0 right-0 w-48 h-48 bg-red-500/5 rounded-full -mr-24 -mt-24 blur-3xl pointer-events-none group-hover:bg-red-500/10 transition-all"></div>
         </div>
         <div className="p-10 bg-white dark:bg-[#0a1411] rounded-[56px] border border-slate-200 dark:border-[#10b981]/10 shadow-sm flex items-center gap-10 relative overflow-hidden group hover:shadow-xl transition-all tech-card">
            <div className="p-6 bg-emerald-50 dark:bg-[#10b981]/10 text-emerald-600 dark:text-[#10b981] rounded-[32px] shadow-sm group-hover:scale-110 transition-transform"><TrendingDown size={40} /></div>
            <div>
               <p className="text-[11px] font-black text-slate-400 dark:text-[#10b981]/40 uppercase tracking-[0.2em] mb-1">Cuentas por Pagar (CxP)</p>
               <h3 className="text-4xl font-black text-emerald-600 dark:text-[#10b981] tracking-tighter">${stats.cxp.toLocaleString()}</h3>
               <p className="text-[9px] font-bold text-slate-400 uppercase mt-2 tracking-widest">Deuda pendiente operativa</p>
            </div>
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full -mr-24 -mt-24 blur-3xl pointer-events-none group-hover:bg-emerald-500/10 transition-all"></div>
         </div>
      </div>

      <div className="bg-white dark:bg-[#0a1411] p-10 rounded-[56px] border border-slate-200 dark:border-[#10b981]/10 shadow-sm flex flex-col md:flex-row gap-8 items-center tech-card">
         <div className="relative flex-1 w-full">
           <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-300 dark:text-[#10b981]/40" size={28} />
           <input 
            type="text" 
            placeholder="Comando: Buscar nombre, empresa o marca comercial..." 
            className="w-full pl-20 pr-8 py-6 bg-slate-50 dark:bg-black border-none rounded-[36px] font-black text-sm outline-none focus:ring-8 focus:ring-amber-500/5 dark:focus:ring-[#10b981]/5 transition-all dark:text-[#10b981]"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
           />
         </div>
         <div className="flex bg-slate-50 dark:bg-black p-2 rounded-[32px] border border-slate-100 dark:border-[#10b981]/10 shadow-inner w-full md:w-auto overflow-x-auto scrollbar-hide">
            {['Todos', 'Comprador', 'Proveedor'].map((role) => (
              <button 
                key={role}
                onClick={() => setActiveRole(role as any)}
                className={`px-10 py-4 rounded-[24px] text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${activeRole === role ? 'bg-[#1a2421] dark:bg-[#10b981] text-white dark:text-black shadow-2xl' : 'text-slate-400 dark:text-[#10b981]/40 hover:text-slate-600 dark:hover:text-[#10b981]'}`}
              >
                {role}s
              </button>
            ))}
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredClients.map((client) => (
          <div key={client.id} className="bg-white dark:bg-[#0a1411] rounded-[64px] border border-slate-200 dark:border-[#10b981]/20 overflow-hidden shadow-sm hover:shadow-2xl transition-all group relative active:scale-[0.98] cursor-pointer tech-card">
            <div className="p-12">
              <div className="flex items-center gap-8 mb-10">
                <div className="w-24 h-24 rounded-[40px] bg-slate-50 dark:bg-black flex items-center justify-center border-2 border-slate-100 dark:border-[#10b981]/10 group-hover:border-amber-500 dark:group-hover:border-[#10b981] transition-all text-slate-300 dark:text-[#10b981]/40 shadow-inner overflow-hidden">
                  {client.photoUrl ? <img src={client.photoUrl} className="w-full h-full object-cover" /> : (client.role === 'Proveedor' ? <Truck size={40} /> : <User size={40} />)}
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border ${client.role === 'Comprador' ? 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20' : 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'}`}>
                       {client.role}
                    </span>
                  </div>
                  <h4 className="font-black text-slate-900 dark:text-[#10b981] truncate uppercase text-2xl tracking-tighter leading-none">{client.name}</h4>
                  <p className="text-[10px] text-slate-400 dark:text-[#10b981]/40 font-bold uppercase tracking-[0.2em] mt-3 italic">{client.alias || 'SIN_ALIAS_MAESTRO'}</p>
                </div>
              </div>

              <div className="space-y-5 mb-12">
                <div className="flex items-center gap-5 text-xs font-bold text-slate-500 dark:text-slate-400">
                  <div className="w-10 h-10 rounded-2xl bg-slate-50 dark:bg-black flex items-center justify-center text-amber-600 dark:text-[#10b981] shadow-sm"><Phone size={18} /></div>
                  {client.phone}
                </div>
                <div className="flex items-center gap-5 text-xs font-bold text-slate-400 dark:text-[#10b981]/40 italic">
                  <div className="w-10 h-10 rounded-2xl bg-slate-50 dark:bg-black flex items-center justify-center text-amber-600 dark:text-[#10b981] shrink-0 shadow-sm"><MapPin size={18} /></div>
                  <span className="truncate">{client.address}</span>
                </div>
              </div>

              <div className={`p-10 rounded-[48px] flex justify-between items-center shadow-2xl relative overflow-hidden transition-all border-2 ${client.balance > 0 ? 'bg-slate-900 border-slate-800' : (client.balance < 0 ? 'bg-emerald-900 border-emerald-800' : 'bg-slate-50 dark:bg-black border-slate-200 dark:border-[#10b981]/20')}`}>
                <div className="relative z-10">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">
                    {client.balance > 0 ? 'Nos Debe (CxC)' : (client.balance < 0 ? 'Le Debemos (CxP)' : 'Liquidado')}
                  </p>
                  <p className={`text-3xl font-black tracking-tighter ${client.balance > 0 ? 'text-red-500' : (client.balance < 0 ? 'text-emerald-400' : 'text-slate-400 dark:text-[#10b981]/20')}`}>
                    ${Math.abs(client.balance).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2 relative z-10">
                  <button onClick={(e) => { e.stopPropagation(); setSelectedClient(client); setIsFinModalOpen(true); }} className="p-5 bg-white/5 hover:bg-amber-600 dark:hover:bg-[#10b981] text-white dark:hover:text-black rounded-2xl border border-white/5 transition-all shadow-lg active:scale-90" title="Nuevo Abono/Cargo">
                     <ArrowRightLeft size={24} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); setSelectedClient(client); setIsHistoryModalOpen(true); }} className="p-5 bg-white/5 hover:bg-blue-600 dark:hover:bg-[#10b981] text-white dark:hover:text-black rounded-2xl border border-white/5 transition-all shadow-lg active:scale-90" title="Historial Comercial">
                     <History size={24} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); setSelectedClient(client); setIsEditModalOpen(true); }} className="p-5 bg-white/5 hover:bg-slate-700 dark:hover:bg-[#10b981] text-white dark:hover:text-black rounded-2xl border border-white/5 transition-all shadow-lg active:scale-90" title="Editar Datos">
                     <Pencil size={24} />
                  </button>
                </div>
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-24 -mt-24 blur-3xl pointer-events-none group-hover:bg-white/10 transition-all"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isEditModalOpen && (
        <AddEditClientModal 
           client={selectedClient || undefined} 
           onClose={() => { setIsEditModalOpen(false); setSelectedClient(null); }} 
        />
      )}

      {isFinModalOpen && selectedClient && (
        <FinancialModal client={selectedClient} onClose={() => { setIsFinModalOpen(false); setSelectedClient(null); }} />
      )}

      {isHistoryModalOpen && selectedClient && (
        <HistoryModal client={selectedClient} onClose={() => { setIsHistoryModalOpen(false); setSelectedClient(null); }} />
      )}
    </div>
  );
};

export default ClientManagement;