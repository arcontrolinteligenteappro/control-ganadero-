
import React, { useState, useMemo } from 'react';
import { MOCK_TRANSACTIONS, MOCK_CLIENTS } from '../constants';
import { 
  Wallet, Plus, ArrowUpCircle, ArrowDownCircle, Search, Filter, 
  FileText, Share2, X, Printer as TicketIcon, Layout as DocIcon, 
  ShoppingCart, Activity, History, TrendingUp, TrendingDown, Save
} from 'lucide-react';
import { Transaction, TransactionType } from '../types';

const ReceiptPreview: React.FC<{ transaction: Transaction; onClose: () => void }> = ({ transaction, onClose }) => {
  const [format, setFormat] = useState<'ticket' | 'doc'>('ticket');
  const client = MOCK_CLIENTS.find(c => c.id === transaction.clientId);
  
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-800 rounded-[40px] p-2 flex flex-col md:flex-row gap-4 max-w-4xl w-full max-h-[90vh]">
        <div className="p-6 flex flex-col gap-4 bg-slate-900 rounded-[32px] w-full md:w-56 border border-white/5">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center mb-2">Formato Maestro</p>
          <button 
            onClick={() => setFormat('ticket')}
            className={`flex items-center gap-3 p-4 rounded-2xl font-bold text-xs transition-all ${format === 'ticket' ? 'bg-amber-600 text-white shadow-xl' : 'bg-slate-800 text-slate-400 border border-white/5 hover:bg-slate-700'}`}
          >
            <TicketIcon size={18} /> Ticket Térmico
          </button>
          <button 
            onClick={() => setFormat('doc')}
            className={`flex items-center gap-3 p-4 rounded-2xl font-bold text-xs transition-all ${format === 'doc' ? 'bg-amber-600 text-white shadow-xl' : 'bg-slate-800 text-slate-400 border border-white/5 hover:bg-slate-700'}`}
          >
            <DocIcon size={18} /> Documento Oficio
          </button>
          <div className="mt-auto space-y-2">
            <button className="w-full flex items-center justify-center gap-2 p-5 bg-emerald-600 text-white rounded-2xl font-black text-xs hover:bg-emerald-700 shadow-xl transition-all">
              <Share2 size={16} /> WhatsApp
            </button>
            <button onClick={onClose} className="w-full p-5 bg-slate-700 text-slate-300 rounded-2xl font-black text-xs hover:bg-slate-600 transition-all">
              Cerrar
            </button>
          </div>
        </div>

        <div className="flex-1 bg-slate-200 p-8 overflow-y-auto rounded-[32px] flex justify-center custom-scrollbar">
          <div className={`bg-white shadow-2xl transition-all duration-500 ${format === 'ticket' ? 'w-[80mm] min-h-[140mm]' : 'w-[210mm] min-h-[297mm]'} p-10 text-slate-900 font-mono text-xs border border-slate-300`}>
            <div className="text-center border-b-4 border-double border-slate-200 pb-8 mb-8">
              <h2 className="text-2xl font-black uppercase tracking-tight">AR CONTROL GANADERO</h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">EMSaD 16 "El Macho"</p>
              <p className="text-[9px] text-slate-400 mt-0.5">Nayarit, México :: Pro Cloud v2.9</p>
            </div>

            <div className="flex justify-between text-[11px] font-black text-slate-400 uppercase mb-8">
              <span>Folio: {transaction.id.slice(0,10).toUpperCase()}</span>
              <span>{transaction.date}</span>
            </div>

            {client && (
              <div className="mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-200">
                <p className="text-[9px] font-black text-slate-400 uppercase mb-1.5">Entidad Comercial</p>
                <p className="text-base font-black text-slate-900">{client.name}</p>
                <p className="text-[11px] text-slate-500 mt-1">{client.phone} • {client.alias}</p>
              </div>
            )}

            <div className="space-y-6 mb-12">
              <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                <div className="flex-1">
                   <p className="text-sm font-black uppercase text-slate-800">{transaction.category}</p>
                   <p className="text-xs text-slate-500 mt-1 italic">{transaction.description}</p>
                </div>
                <p className="text-base font-black ml-4">${transaction.amount.toLocaleString()}</p>
              </div>
            </div>

            <div className="space-y-3 border-t-4 border-slate-900 pt-6">
              <div className="flex justify-between items-center">
                <p className="text-sm font-black uppercase">Monto Total de Operación</p>
                <p className="text-3xl font-black tracking-tighter">${transaction.amount.toLocaleString()}</p>
              </div>
              <div className="flex justify-between text-[10px] font-bold text-slate-400 pt-4">
                 <span>Metodo: Transferencia SPEI</span>
                 <span>Status: LIQUIDADO</span>
              </div>
            </div>

            <div className="mt-20 text-center border-t border-slate-200 pt-8 opacity-50">
               <p className="text-[8px] font-black uppercase tracking-widest leading-relaxed">Documento Fiscal Electrónico Generado por AR CONTROL Ganadero<br/>www.arcontrolinteligente.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TransactionModal: React.FC<{ onClose: () => void; type: TransactionType }> = ({ onClose, type }) => {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 border border-slate-200">
        <div className={`p-8 border-b border-slate-100 flex justify-between items-center ${type === 'Ingreso' ? 'bg-emerald-600' : 'bg-red-600'} text-white`}>
          <div className="flex items-center gap-4">
            {type === 'Ingreso' ? <ArrowUpCircle size={28} /> : <ArrowDownCircle size={28} />}
            <div>
               <h3 className="font-black uppercase tracking-tighter text-xl leading-none">Registrar {type}</h3>
               <p className="text-[10px] font-bold uppercase tracking-widest mt-1 opacity-70">Operaciones AR Control Ganadero</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-10 space-y-8">
          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Monto de Operación ($) *</label>
              <input type="number" placeholder="0.00" className="w-full p-8 bg-slate-50 border-2 border-slate-100 rounded-[32px] focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 font-black text-5xl outline-none transition-all text-slate-900 shadow-inner" />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="col-span-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Concepto / Glosa *</label>
                 <input type="text" placeholder="Ej: Venta de Lote Hereford #42..." className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold outline-none focus:border-amber-500 transition-all shadow-inner" />
               </div>
               <div className="col-span-1">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Rubro Maestro</label>
                 <select className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-[10px] uppercase outline-none shadow-inner">
                   <option>Venta de Ganado</option>
                   <option>Compra de Alimento</option>
                   <option>Insumos Médicos</option>
                   <option>Pago de Nómina</option>
                   <option>Mantenimiento Equipo</option>
                   <option>Servicios Profesionales</option>
                 </select>
               </div>
               <div className="col-span-1">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Fecha Efectiva</label>
                 <input type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-xs outline-none shadow-inner" />
               </div>
            </div>
          </div>

          <button onClick={() => { alert('Operación financiera consolidada en el libro mayor.'); onClose(); }} className={`w-full py-6 text-white font-black rounded-[28px] shadow-2xl transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-3 active:scale-95 ${type === 'Ingreso' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20' : 'bg-red-600 hover:bg-red-700 shadow-red-600/20'}`}>
            <Save size={20} /> Guardar Movimiento en Nube
          </button>
        </div>
      </div>
    </div>
  );
};

const FinanceManagement: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<TransactionType>('Ingreso');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const stats = useMemo(() => {
    const totalIngresos = MOCK_TRANSACTIONS.filter(t => t.type === 'Ingreso').reduce((acc, t) => acc + t.amount, 0);
    const totalGastos = MOCK_TRANSACTIONS.filter(t => t.type === 'Gasto').reduce((acc, t) => acc + t.amount, 0);
    return { ingresos: totalIngresos, gastos: totalGastos, balance: totalIngresos - totalGastos };
  }, []);

  const filteredTransactions = useMemo(() => {
    return MOCK_TRANSACTIONS.filter(t => 
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-tight">Tesorería y Flujo de Caja</h2>
          <p className="text-slate-500 font-bold text-sm italic">Libro mayor, tickets de venta y egresos operativos - AR CONTROL.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <button 
            onClick={() => { setModalType('Ingreso'); setIsModalOpen(true); }}
            className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-emerald-600 text-white px-8 py-5 rounded-[22px] text-[10px] font-black hover:bg-emerald-700 shadow-xl shadow-emerald-600/20 transition-all uppercase tracking-widest active:scale-95 shrink-0"
          >
            <ArrowUpCircle size={20} /> Nuevo Ingreso
          </button>
          <button 
            onClick={() => { setModalType('Gasto'); setIsModalOpen(true); }}
            className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-red-600 text-white px-8 py-5 rounded-[22px] text-[10px] font-black hover:bg-red-700 shadow-xl shadow-red-600/20 transition-all uppercase tracking-widest active:scale-95 shrink-0"
          >
            <ArrowDownCircle size={20} /> Nuevo Gasto
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-slate-900 p-8 rounded-[40px] shadow-2xl flex items-center gap-6 relative overflow-hidden group">
            <div className="p-4 bg-emerald-500 text-black rounded-2xl shadow-lg relative z-10"><Wallet size={28} /></div>
            <div className="relative z-10">
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Balance Consolidado</p>
               <h3 className="text-3xl font-black text-emerald-400 tracking-tighter">${stats.balance.toLocaleString()}</h3>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
         </div>
         <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm flex items-center gap-6 group hover:shadow-xl transition-all">
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl shadow-sm"><TrendingUp size={28} /></div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Entradas</p>
               <h3 className="text-2xl font-black text-slate-900 tracking-tighter">${stats.ingresos.toLocaleString()}</h3>
            </div>
         </div>
         <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm flex items-center gap-6 group hover:shadow-xl transition-all">
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl shadow-sm"><TrendingDown size={28} /></div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Salidas</p>
               <h3 className="text-2xl font-black text-slate-900 tracking-tighter">${stats.gastos.toLocaleString()}</h3>
            </div>
         </div>
      </div>

      <div className="bg-white rounded-[48px] border border-slate-200 overflow-hidden shadow-sm">
         <div className="p-10 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-50/30">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-white border border-slate-200 rounded-2xl shadow-sm"><History size={24} className="text-amber-600" /></div>
               <div>
                  <h4 className="font-black text-slate-800 uppercase tracking-widest text-sm">Historial de Transacciones</h4>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">Sincronización Cloud Automática</p>
               </div>
            </div>
            <div className="relative w-full md:w-96">
               <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
               <input 
                type="text" 
                placeholder="Buscar por folio, cliente o categoría..." 
                className="w-full pl-12 pr-6 py-4.5 bg-white border-2 border-slate-100 rounded-3xl font-bold text-sm outline-none focus:ring-8 focus:ring-amber-500/5 focus:border-amber-500 transition-all shadow-inner"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
               />
            </div>
         </div>
         <div className="divide-y divide-slate-100">
            {filteredTransactions.map(t => (
              <div key={t.id} className="p-10 flex flex-col md:flex-row items-center justify-between hover:bg-slate-50/80 transition-all group gap-8">
                 <div className="flex items-center gap-8 w-full md:w-auto">
                    <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center border-2 transition-all group-hover:scale-110 shadow-sm ${t.type === 'Ingreso' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                       {t.type === 'Ingreso' ? <ArrowUpCircle size={32} /> : <ArrowDownCircle size={32} />}
                    </div>
                    <div>
                       <p className="font-black text-slate-900 text-xl tracking-tighter uppercase mb-1">{t.description}</p>
                       <div className="flex items-center gap-3">
                          <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[9px] font-black uppercase tracking-widest">{t.category}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                             <Activity size={12} className="text-amber-500" /> {t.date}
                          </span>
                       </div>
                    </div>
                 </div>
                 <div className="flex items-center gap-10 w-full md:w-auto justify-between md:justify-end">
                    <div className="text-right">
                       <p className={`text-3xl font-black tracking-tighter ${t.type === 'Ingreso' ? 'text-emerald-600' : 'text-red-600'}`}>
                          {t.type === 'Ingreso' ? '+' : '-'}${t.amount.toLocaleString()}
                       </p>
                       <p className="text-[9px] font-bold text-slate-300 uppercase mt-1">Ref: {t.id.slice(0,8).toUpperCase()}</p>
                    </div>
                    <div className="flex gap-2">
                       <button onClick={() => setSelectedTransaction(t)} className="p-4 bg-white hover:bg-slate-900 hover:text-white rounded-2xl border border-slate-100 shadow-sm transition-all text-slate-400 active:scale-90" title="Imprimir Recibo">
                          <TicketIcon size={20} />
                       </button>
                    </div>
                 </div>
              </div>
            ))}
            {filteredTransactions.length === 0 && (
              <div className="py-32 text-center opacity-30">
                 <ShoppingCart size={80} strokeWidth={1} className="mx-auto mb-4" />
                 <p className="font-black uppercase tracking-[0.2em] text-sm">Sin transacciones registradas en este rubro</p>
              </div>
            )}
         </div>
      </div>

      {isModalOpen && <TransactionModal type={modalType} onClose={() => setIsModalOpen(false)} />}
      {selectedTransaction && <ReceiptPreview transaction={selectedTransaction} onClose={() => setSelectedTransaction(null)} />}
    </div>
  );
};

export default FinanceManagement;
