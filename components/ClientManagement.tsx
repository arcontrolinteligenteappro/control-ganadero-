
import React, { useState, useMemo } from 'react';
import { MOCK_CLIENTS } from '../constants';
import { 
  Plus, Search, User, Phone, Mail, MapPin, X, CreditCard, 
  ChevronRight, FileText, UserPlus, Banknote, History, Save, TrendingDown, TrendingUp,
  Receipt, Wallet, Calendar, AlertCircle, Briefcase, Truck, ArrowRightLeft, Printer
} from 'lucide-react';
import { Client, ClientTransaction, ContactRole } from '../types';

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
    <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-2xl animate-in fade-in duration-300">
       <div className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden border border-slate-200 animate-in slide-in-from-bottom-10">
          <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-[#1a2421] text-white">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-amber-600 rounded-xl"><Banknote size={24} /></div>
               <div>
                 <h3 className="font-black text-xl uppercase tracking-tighter leading-none">Módulo de Tesorería</h3>
                 <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mt-1">{client.name}</p>
               </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all"><X size={24} /></button>
          </div>

          <div className="p-8 space-y-8">
             <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setType('Abono')} className={`p-6 rounded-[32px] flex flex-col items-center gap-3 border-4 transition-all ${type === 'Abono' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-slate-50 border-transparent text-slate-400 opacity-60'}`}>
                   <TrendingDown size={32} />
                   <div className="text-center">
                     <span className="text-[10px] font-black uppercase tracking-widest block">Abono / Pago</span>
                     <span className="text-[8px] font-bold opacity-70 uppercase tracking-tighter">{isProvider ? 'Pago que hacemos nosotros' : 'Cobro que recibimos'}</span>
                   </div>
                </button>
                <button onClick={() => setType('Cargo')} className={`p-6 rounded-[32px] flex flex-col items-center gap-3 border-4 transition-all ${type === 'Cargo' ? 'bg-red-50 border-red-500 text-red-700' : 'bg-slate-50 border-transparent text-slate-400 opacity-60'}`}>
                   <TrendingUp size={32} />
                   <div className="text-center">
                     <span className="text-[10px] font-black uppercase tracking-widest block">Cargo / Deuda</span>
                     <span className="text-[8px] font-bold opacity-70 uppercase tracking-tighter">{isProvider ? 'Nueva deuda con proveedor' : 'Nueva deuda del comprador'}</span>
                   </div>
                </button>
             </div>

             <div className="space-y-4">
                <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Monto de Operación ($)</label>
                   <input type="number" className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-3xl font-black text-4xl outline-none focus:border-amber-500 text-slate-800" placeholder="0.00" value={amount || ''} onChange={e => setAmount(Number(e.target.value))} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Concepto</label>
                    <input type="text" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none focus:border-amber-500" placeholder="Ej: Pago Lote Brahman" value={concept} onChange={e => setConcept(e.target.value)} />
                  </div>
                  <div className="col-span-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Ref. Pago / Factura</label>
                    <input type="text" className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none focus:border-amber-500" placeholder="#12345" value={reference} onChange={e => setReference(e.target.value)} />
                  </div>
                </div>
             </div>

             <div className="p-6 bg-slate-900 rounded-[32px] text-white flex justify-between items-center shadow-xl">
                <div>
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Saldo Actualizado Estimado</p>
                   <p className="text-2xl font-black text-amber-500 tracking-tighter">
                     ${(type === 'Abono' ? client.balance - amount : client.balance + amount).toLocaleString()}
                   </p>
                </div>
                <div className="flex flex-col items-end">
                   <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Límite Crédito</p>
                   <p className="text-xs font-bold text-slate-300">${client.creditLimit.toLocaleString()}</p>
                </div>
             </div>

             <button onClick={handleAddTransaction} className="w-full py-5 bg-slate-900 text-white font-black rounded-3xl hover:bg-black shadow-2xl transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-3 active:scale-95">
                <Save size={20} className="text-emerald-500" /> Aplicar Transacción Maestra
             </button>
          </div>
       </div>
    </div>
  );
};

const HistoryModal: React.FC<{ client: Client; onClose: () => void }> = ({ client, onClose }) => {
  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-3xl animate-in fade-in">
       <div className="bg-white w-full max-w-4xl rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in-95 border border-slate-200 flex flex-col max-h-[90vh]">
          <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50">
             <div className="flex items-center gap-6">
                <div className="p-4 bg-white rounded-3xl border shadow-sm text-amber-600"><History size={32} /></div>
                <div>
                  <h3 className="font-black text-2xl uppercase tracking-tighter leading-none">Expediente Comercial</h3>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">{client.name} • {client.role}</p>
                </div>
             </div>
             <div className="flex gap-3">
                <button onClick={() => window.print()} className="p-3.5 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition-all"><Printer size={20} /></button>
                <button onClick={onClose} className="p-3.5 bg-slate-100 text-slate-600 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all"><X size={20} /></button>
             </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-10 space-y-6 custom-scrollbar">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Balance Actual</p>
                   <p className={`text-2xl font-black ${client.balance > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                      ${Math.abs(client.balance).toLocaleString()}
                      <span className="text-xs ml-2 opacity-50">{client.balance > 0 ? '(Deuda)' : '(A favor)'}</span>
                   </p>
                </div>
                <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Límite de Crédito</p>
                   <p className="text-2xl font-black text-blue-600">${client.creditLimit.toLocaleString()}</p>
                </div>
                <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Operaciones</p>
                   <p className="text-2xl font-black text-slate-800">{client.transactionHistory?.length || 0}</p>
                </div>
             </div>

             <div className="space-y-3">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Historial de Cargos y Abonos</p>
                {client.transactionHistory?.map((t, i) => (
                  <div key={t.id} className="p-6 bg-white rounded-[32px] border border-slate-100 flex items-center justify-between hover:bg-slate-50 hover:shadow-lg transition-all group">
                     <div className="flex items-center gap-6">
                        <div className={`w-14 h-14 rounded-[20px] flex items-center justify-center shadow-sm ${t.type === 'Cargo' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                           {t.type === 'Cargo' ? <TrendingUp size={28} /> : <TrendingDown size={28} />}
                        </div>
                        <div>
                           <div className="flex items-center gap-2 mb-1">
                              <p className="font-black text-slate-900 uppercase tracking-tighter text-base">{t.concept}</p>
                              {t.reference && <span className="px-2 py-0.5 bg-slate-100 text-slate-400 rounded text-[8px] font-mono">#{t.reference}</span>}
                           </div>
                           <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-2">
                             <Calendar size={12} className="text-amber-500" /> {t.date}
                           </p>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className={`text-xl font-black ${t.type === 'Cargo' ? 'text-red-600' : 'text-emerald-600'}`}>
                           {t.type === 'Cargo' ? '+' : '-'}${t.amount.toLocaleString()}
                        </p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">Saldo Posterior: ${t.balanceAfter.toLocaleString()}</p>
                     </div>
                  </div>
                ))}
                {(!client.transactionHistory || client.transactionHistory.length === 0) && (
                  <div className="py-20 text-center opacity-30">
                     <Receipt size={80} className="mx-auto mb-4" />
                     <p className="font-black uppercase tracking-[0.2em] text-sm">Sin movimientos registrados</p>
                  </div>
                )}
             </div>
          </div>

          <div className="p-10 bg-slate-900 text-white flex justify-between items-center shadow-2xl">
             <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Estado de Cuenta</p>
                <p className="text-4xl font-black text-amber-500 tracking-tighter">${client.balance.toLocaleString()}</p>
             </div>
             <div className="flex gap-4">
                <button className="px-10 py-5 bg-white text-slate-900 rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-slate-100 transition-all active:scale-95">Conciliar Cuentas</button>
             </div>
          </div>
       </div>
    </div>
  );
};

const ClientManagement: React.FC = () => {
  const [activeRole, setActiveRole] = useState<'Comprador' | 'Proveedor' | 'Todos'>('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
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
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-tight">Directorio Comercial Maestro</h2>
          <p className="text-slate-500 font-bold text-sm italic">Gestión de Compradores, Proveedores, Créditos y Deudas.</p>
        </div>
        <button 
          onClick={() => alert("Alta de contacto comercial en AR CONTROL GANADERO")}
          className="flex items-center gap-3 bg-emerald-600 text-white px-10 py-5 rounded-[28px] font-black hover:bg-emerald-700 shadow-2xl shadow-emerald-600/20 transition-all uppercase tracking-widest active:scale-95 text-xs"
        >
          <UserPlus size={20} /> Nuevo Contacto
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="p-8 bg-white rounded-[40px] border border-slate-200 shadow-sm flex items-center gap-8 relative overflow-hidden group hover:shadow-xl transition-all">
            <div className="p-5 bg-red-50 text-red-600 rounded-3xl shadow-sm group-hover:scale-110 transition-transform"><TrendingUp size={32} /></div>
            <div>
               <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Cuentas por Cobrar (CxC)</p>
               <h3 className="text-3xl font-black text-red-600 tracking-tighter">${stats.cxc.toLocaleString()}</h3>
               <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Capital pendiente de compradores</p>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
         </div>
         <div className="p-8 bg-white rounded-[40px] border border-slate-200 shadow-sm flex items-center gap-8 relative overflow-hidden group hover:shadow-xl transition-all">
            <div className="p-5 bg-emerald-50 text-emerald-600 rounded-3xl shadow-sm group-hover:scale-110 transition-transform"><TrendingDown size={32} /></div>
            <div>
               <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Cuentas por Pagar (CxP)</p>
               <h3 className="text-3xl font-black text-emerald-600 tracking-tighter">${stats.cxp.toLocaleString()}</h3>
               <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Deuda pendiente con proveedores</p>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
         </div>
      </div>

      <div className="bg-white p-8 rounded-[48px] border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-center">
         <div className="relative flex-1 w-full">
           <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={24} />
           <input 
            type="text" 
            placeholder="Buscar por nombre, empresa o alias comercial..." 
            className="w-full pl-16 pr-6 py-5 bg-slate-50 border-none rounded-3xl font-bold text-sm outline-none focus:ring-8 focus:ring-amber-500/5 transition-all"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
           />
         </div>
         <div className="flex bg-slate-50 p-1.5 rounded-3xl border border-slate-100 shadow-inner w-full md:w-auto overflow-x-auto scrollbar-hide">
            {['Todos', 'Comprador', 'Proveedor'].map((role) => (
              <button 
                key={role}
                onClick={() => setActiveRole(role as any)}
                className={`px-8 py-3.5 rounded-[22px] text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${activeRole === role ? 'bg-[#1a2421] text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {role}s
              </button>
            ))}
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredClients.map((client) => (
          <div key={client.id} className="bg-white rounded-[48px] border border-slate-200 overflow-hidden shadow-sm hover:shadow-2xl transition-all group relative active:scale-[0.98] cursor-pointer">
            <div className="p-10">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 rounded-[32px] bg-slate-50 flex items-center justify-center border-2 border-slate-100 group-hover:border-amber-500 transition-all text-slate-300 shadow-inner">
                  {client.role === 'Proveedor' ? <Truck size={36} /> : <User size={36} />}
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${client.role === 'Comprador' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'}`}>
                       {client.role}
                    </span>
                  </div>
                  <h4 className="font-black text-slate-900 truncate uppercase text-xl tracking-tighter leading-none">{client.name}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2 italic">{client.alias || 'SIN ALIAS COMERCIAL'}</p>
                </div>
              </div>

              <div className="space-y-4 mb-10">
                <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                  <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-amber-600"><Phone size={16} /></div>
                  {client.phone}
                </div>
                <div className="flex items-center gap-4 text-xs font-bold text-slate-400 italic">
                  <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-amber-600 shrink-0"><MapPin size={16} /></div>
                  <span className="truncate">{client.address}</span>
                </div>
              </div>

              <div className={`p-8 rounded-[40px] flex justify-between items-center shadow-2xl relative overflow-hidden transition-all border ${client.balance > 0 ? 'bg-slate-900 border-slate-800' : (client.balance < 0 ? 'bg-emerald-900 border-emerald-800' : 'bg-slate-50 border-slate-200')}`}>
                <div className="relative z-10">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">
                    {client.balance > 0 ? 'Nos Debe (CxC)' : (client.balance < 0 ? 'Le Debemos (CxP)' : 'Cuentas Liquidadas')}
                  </p>
                  <p className={`text-2xl font-black tracking-tighter ${client.balance > 0 ? 'text-red-500' : (client.balance < 0 ? 'text-emerald-400' : 'text-slate-400')}`}>
                    ${Math.abs(client.balance).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2 relative z-10">
                  <button onClick={(e) => { e.stopPropagation(); setSelectedClient(client); setIsFinModalOpen(true); }} className="p-4 bg-white/5 hover:bg-amber-600 text-white rounded-2xl border border-white/5 transition-all shadow-lg active:scale-90" title="Nueva Transacción">
                     <ArrowRightLeft size={20} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); setSelectedClient(client); setIsHistoryModalOpen(true); }} className="p-4 bg-white/5 hover:bg-blue-600 text-white rounded-2xl border border-white/5 transition-all shadow-lg active:scale-90" title="Ver Historial Completo">
                     <History size={20} />
                  </button>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isFinModalOpen && selectedClient && (
        <FinancialModal client={selectedClient} onClose={() => setIsFinModalOpen(false)} />
      )}

      {isHistoryModalOpen && selectedClient && (
        <HistoryModal client={selectedClient} onClose={() => setIsHistoryModalOpen(false)} />
      )}
    </div>
  );
};

export default ClientManagement;
