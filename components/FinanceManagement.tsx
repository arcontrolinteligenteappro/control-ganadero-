
import React, { useState, useMemo } from 'react';
import { MOCK_TRANSACTIONS, MOCK_CLIENTS, MOCK_BUSINESS_CONFIG } from '../constants';
import { 
  Wallet, Plus, ArrowUpCircle, ArrowDownCircle, Search, Filter, 
  FileText, Share2, X, Printer as TicketIcon, Layout as DocIcon, 
  ShoppingCart, Activity, History, TrendingUp, TrendingDown, Save, Receipt, CheckCircle,
  User
} from 'lucide-react';
import { Transaction, TransactionType, BusinessConfig } from '../types';

// Componente para previsualización de recibos
const ReceiptPreview: React.FC<{ transaction: Transaction; onClose: () => void }> = ({ transaction, onClose }) => {
  const [format, setFormat] = useState<'ticket' | 'doc'>('ticket');
  const client = MOCK_CLIENTS.find(c => c.id === transaction.clientId);
  
  // Cargar configuración dinámica desde localStorage
  const businessConfig: BusinessConfig = useMemo(() => {
    const saved = localStorage.getItem('ar_receipt_config');
    return saved ? JSON.parse(saved) : MOCK_BUSINESS_CONFIG;
  }, []);
  
  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-slate-900/95 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-800 rounded-[48px] p-2 flex flex-col md:flex-row gap-4 max-w-5xl w-full max-h-[95vh] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] border border-white/10">
        <div className="p-8 flex flex-col gap-4 bg-slate-900 rounded-[40px] w-full md:w-72 border border-white/5">
          <div className="flex items-center gap-3 mb-6 px-2">
             <div className="w-10 h-10 bg-[#10b981] rounded-xl flex items-center justify-center text-black font-black italic">AR</div>
             <p className="text-[10px] font-black text-white uppercase tracking-widest">Receipt_Engine_v4</p>
          </div>
          
          <button 
            onClick={() => setFormat('ticket')}
            className={`flex items-center gap-3 p-5 rounded-[24px] font-black text-[10px] uppercase tracking-widest transition-all ${format === 'ticket' ? 'bg-[#10b981] text-black shadow-xl shadow-emerald-500/20' : 'bg-slate-800 text-slate-400 border border-white/5 hover:bg-slate-700'}`}
          >
            <TicketIcon size={18} /> Formato Térmico (80mm)
          </button>
          <button 
            onClick={() => setFormat('doc')}
            className={`flex items-center gap-3 p-5 rounded-[24px] font-black text-[10px] uppercase tracking-widest transition-all ${format === 'doc' ? 'bg-[#10b981] text-black shadow-xl shadow-emerald-500/20' : 'bg-slate-800 text-slate-400 border border-white/5 hover:bg-slate-700'}`}
          >
            <DocIcon size={18} /> Documento Oficio (A4)
          </button>

          <div className="mt-auto space-y-3">
            <button className="w-full flex items-center justify-center gap-3 p-6 bg-emerald-600 text-white rounded-[24px] font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 shadow-xl transition-all">
              <Share2 size={16} /> Compartir Digital
            </button>
            <button onClick={onClose} className="w-full p-6 bg-slate-700 text-slate-300 rounded-[24px] font-black text-[10px] uppercase tracking-widest hover:bg-slate-600 transition-all">
              Volver al Mando
            </button>
          </div>
        </div>

        <div className="flex-1 bg-slate-200 dark:bg-black/90 p-10 overflow-y-auto rounded-[40px] flex justify-center custom-scrollbar shadow-inner relative">
          <div className={`bg-white shadow-2xl transition-all duration-700 ${format === 'ticket' ? 'w-[80mm] min-h-[160mm]' : 'w-[210mm] min-h-[297mm]'} p-10 text-slate-900 font-mono text-[11px] border border-slate-300`}>
            <div className="text-center border-b-4 border-double border-slate-900 pb-8 mb-8">
              <h2 className="text-2xl font-black uppercase tracking-tighter leading-none">{businessConfig.name}</h2>
              <p className="text-[10px] font-bold uppercase mt-3 italic">{businessConfig.address}</p>
              <p className="text-[10px] font-bold text-slate-500 mt-1">{businessConfig.phone} • {businessConfig.taxId || 'IDENTIDAD_LOCAL'}</p>
            </div>

            <div className="flex justify-between font-black uppercase mb-10 text-[10px] border-b border-slate-100 pb-4">
              <span>Folio: AR-{transaction.id.toUpperCase().slice(0,6)}</span>
              <span>Emisión: {transaction.date}</span>
            </div>

            {client && (
              <div className="mb-10 p-6 bg-slate-50 border border-slate-200 rounded-2xl">
                {/* Fix: Added missing User icon import from lucide-react */}
                <p className="text-[9px] font-black text-slate-400 uppercase mb-2 tracking-widest flex items-center gap-2"><User size={10}/> Contraparte Comercial</p>
                <p className="text-base font-black uppercase leading-none">{client.name}</p>
                <p className="text-[10px] text-slate-500 mt-2 font-bold">{client.alias} • Tel: {client.phone}</p>
              </div>
            )}

            <div className="space-y-6 mb-16">
              <div className="flex justify-between items-start border-b-2 border-dashed border-slate-200 pb-6">
                <div className="flex-1 pr-10">
                   <p className="text-xs font-black uppercase leading-none mb-2">{transaction.category}</p>
                   <p className="text-[10px] text-slate-500 italic leading-relaxed">{transaction.description}</p>
                </div>
                <p className="text-base font-black ml-4 whitespace-nowrap">${transaction.amount.toLocaleString()}</p>
              </div>
            </div>

            <div className="space-y-4 border-t-4 border-slate-900 pt-8">
              <div className="flex justify-between items-center">
                <p className="text-xs font-black uppercase tracking-widest">Total Operación</p>
                <p className="text-4xl font-black tracking-tighter">${transaction.amount.toLocaleString()}</p>
              </div>
              <div className="flex justify-between text-[9px] font-black text-slate-400 pt-8 uppercase tracking-widest">
                 <span>Metodo: SPEI / Digital</span>
                 <span>Estado: LIQUIDADO</span>
              </div>
            </div>

            <div className="mt-24 text-center border-t border-slate-200 pt-10">
               <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed text-slate-400">
                 {businessConfig.receiptNote || 'Compromiso con la Calidad Pecuaria'}
               </p>
               <div className="mt-10 opacity-30">
                  <p className="text-[8px] uppercase font-bold">Documento Digital Autenticado por</p>
                  <p className="text-[10px] font-black italic">AR CONTROL GANADERO PRO</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente para modal de transacciones
const TransactionModal: React.FC<{ onClose: () => void; type: TransactionType }> = ({ onClose, type }) => {
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-[#0a0f0d] w-full max-w-xl rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in-95 border border-slate-200 dark:border-[#10b981]/20">
        <div className={`p-10 border-b border-white/5 flex justify-between items-center ${type === 'Ingreso' ? 'bg-emerald-600' : 'bg-red-600'} text-white`}>
          <div className="flex items-center gap-5">
            <div className="p-3 bg-white/20 rounded-2xl shadow-lg">{type === 'Ingreso' ? <ArrowUpCircle size={32} /> : <ArrowDownCircle size={32} />}</div>
            <div>
               <h3 className="font-black uppercase tracking-tighter text-2xl leading-none">Registrar {type}</h3>
               <p className="text-[10px] font-bold uppercase tracking-[0.2em] mt-2 opacity-70">Tesorería_Master::Nodo_B</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-full transition-all">
            <X size={28} />
          </button>
        </div>

        <div className="p-10 space-y-10">
          <div className="space-y-8">
            <div>
              <label className="text-[10px] font-black text-slate-400 dark:text-[#10b981]/40 uppercase tracking-[0.2em] ml-2 mb-3 block">Monto de Operación ($) *</label>
              <input type="number" placeholder="0.00" className="w-full p-10 bg-slate-50 dark:bg-black border-2 border-slate-100 dark:border-[#10b981]/30 rounded-[40px] focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 font-black text-6xl outline-none transition-all text-slate-900 dark:text-[#10b981] shadow-inner text-center" />
            </div>
            <div className="grid grid-cols-2 gap-5">
               <div className="col-span-2">
                 <label className="text-[10px] font-black text-slate-400 dark:text-[#10b981]/40 uppercase tracking-[0.2em] ml-2 mb-3 block">Glosa de Concepto *</label>
                 <input type="text" placeholder="Ej: Venta Lote Brangus..." className="w-full p-6 bg-slate-50 dark:bg-black border-2 border-slate-100 dark:border-[#10b981]/30 rounded-3xl font-black text-xs outline-none focus:border-amber-500 transition-all shadow-inner dark:text-[#10b981] uppercase" />
               </div>
               <div className="col-span-1">
                 <label className="text-[10px] font-black text-slate-400 dark:text-[#10b981]/40 uppercase tracking-[0.2em] ml-2 mb-3 block">Rubro Contable</label>
                 <select className="w-full p-6 bg-slate-50 dark:bg-black border-2 border-slate-100 dark:border-[#10b981]/30 rounded-3xl font-black text-[10px] uppercase outline-none shadow-inner dark:text-[#10b981] appearance-none">
                   <option>Ganado en Pie</option>
                   <option>Insumos Forraje</option>
                   <option>Nómina Personal</option>
                   <option>Servicios Veterinarios</option>
                 </select>
               </div>
               <div className="col-span-1">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 mb-3 block">Fecha de Registro</label>
                 <input type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full p-6 bg-slate-50 dark:bg-black border-2 border-slate-100 dark:border-[#10b981]/30 rounded-3xl font-black text-xs outline-none shadow-inner dark:text-[#10b981]" />
               </div>
            </div>
          </div>

          <button onClick={() => { alert('Operación consolidada y sincronizada.'); onClose(); }} className={`w-full py-6 text-white dark:text-black font-black rounded-[32px] shadow-2xl transition-all uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-4 active:scale-95 ${type === 'Ingreso' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20' : 'bg-red-600 hover:bg-red-700 shadow-red-500/20'}`}>
            <Save size={20} /> Ejecutar Transacción Maestro
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente principal de gestión financiera
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
          <h2 className="text-4xl font-black text-slate-900 dark:text-[#10b981] tracking-tighter uppercase leading-none">Tesorería Global</h2>
          <p className="text-slate-500 font-bold text-sm italic">Flujo de caja, facturación técnica y arqueo contable.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={() => { setModalType('Ingreso'); setIsModalOpen(true); }}
            className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-emerald-600 text-white px-8 py-5 rounded-2xl text-[10px] font-black hover:bg-emerald-700 shadow-xl shadow-emerald-600/20 transition-all uppercase tracking-widest active:scale-95 shrink-0"
          >
            <ArrowUpCircle size={20} /> Nuevo Ingreso
          </button>
          <button 
            onClick={() => { setModalType('Gasto'); setIsModalOpen(true); }}
            className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-red-600 text-white px-8 py-5 rounded-2xl text-[10px] font-black hover:bg-red-700 shadow-xl shadow-red-600/20 transition-all uppercase tracking-widest active:scale-95 shrink-0"
          >
            <ArrowDownCircle size={20} /> Nuevo Gasto
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-slate-900 dark:bg-black p-8 rounded-[48px] shadow-2xl flex items-center gap-8 border border-white/10 group transition-all hover:scale-[1.02]">
            <div className="p-5 bg-emerald-500 text-black rounded-3xl shadow-lg group-hover:bg-[#10b981] transition-all"><Wallet size={32} /></div>
            <div>
               <p className="text-[10px] font-black text-slate-500 dark:text-[#10b981]/40 uppercase tracking-[0.2em] mb-1">Caja Chica Consolidada</p>
               <h3 className="text-4xl font-black text-emerald-400 tracking-tighter">${stats.balance.toLocaleString()}</h3>
            </div>
         </div>
         <div className="bg-white dark:bg-[#0a1411] p-8 rounded-[48px] border border-slate-200 dark:border-[#10b981]/10 flex items-center gap-8 group hover:shadow-xl transition-all">
            <div className="p-5 bg-emerald-50 dark:bg-[#10b981]/10 text-emerald-600 dark:text-[#10b981] rounded-3xl group-hover:scale-110 transition-transform"><TrendingUp size={32} /></div>
            <div>
               <p className="text-[10px] font-black text-slate-400 dark:text-[#10b981]/40 uppercase tracking-[0.2em] mb-1">Entradas de Capital</p>
               <h3 className="text-2xl font-black text-slate-900 dark:text-[#10b981] tracking-tighter">${stats.ingresos.toLocaleString()}</h3>
            </div>
         </div>
         <div className="bg-white dark:bg-[#0a1411] p-8 rounded-[48px] border border-slate-200 dark:border-[#10b981]/10 flex items-center gap-8 group hover:shadow-xl transition-all">
            <div className="p-5 bg-red-50 dark:bg-red-900/10 text-red-600 rounded-3xl group-hover:scale-110 transition-transform"><TrendingDown size={32} /></div>
            <div>
               <p className="text-[10px] font-black text-slate-400 dark:text-[#10b981]/40 uppercase tracking-[0.2em] mb-1">Egresos Operativos</p>
               <h3 className="text-2xl font-black text-slate-900 dark:text-[#10b981] tracking-tighter">${stats.gastos.toLocaleString()}</h3>
            </div>
         </div>
      </div>

      <div className="bg-white dark:bg-[#0a0f0d] rounded-[48px] border border-slate-200 dark:border-[#10b981]/20 overflow-hidden shadow-sm">
         <div className="p-10 border-b border-slate-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-50/50 dark:bg-black/50">
            <div className="flex items-center gap-5">
               <div className="p-4 bg-white dark:bg-black border border-slate-200 dark:border-[#10b981]/30 rounded-2xl shadow-sm text-amber-600"><History size={28} /></div>
               <div>
                  <h4 className="font-black text-slate-800 dark:text-[#10b981] uppercase tracking-[0.2em] text-sm leading-none">Libro Mayor de Transacciones</h4>
                  <p className="text-[9px] font-bold text-slate-400 dark:text-[#10b981]/40 uppercase tracking-widest mt-2">Seguridad Bancaria::Nodo_Verificado</p>
               </div>
            </div>
            <div className="relative w-full md:w-96">
               <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 dark:text-[#10b981]/40" />
               <input 
                type="text" 
                placeholder="Filtrar libro mayor..." 
                className="w-full pl-14 pr-6 py-5 bg-white dark:bg-black border-2 border-slate-100 dark:border-[#10b981]/30 rounded-[28px] font-black text-xs outline-none focus:border-amber-500 dark:focus:border-[#10b981] transition-all shadow-inner dark:text-[#10b981]"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
               />
            </div>
         </div>
         <div className="divide-y divide-slate-100 dark:divide-white/5">
            {filteredTransactions.map(t => (
              <div key={t.id} className="p-10 flex flex-col md:flex-row items-center justify-between hover:bg-slate-50 dark:hover:bg-[#10b981]/5 transition-all group gap-8">
                 <div className="flex items-center gap-8 w-full md:w-auto">
                    <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center border-2 transition-all group-hover:scale-110 shadow-sm ${t.type === 'Ingreso' ? 'bg-emerald-50 dark:bg-[#10b981]/10 text-emerald-600 dark:text-[#10b981] border-emerald-100 dark:border-[#10b981]/30' : 'bg-red-50 dark:bg-red-900/10 text-red-600 border-red-100 dark:border-red-900/30'}`}>
                       {t.type === 'Ingreso' ? <ArrowUpCircle size={32} /> : <ArrowDownCircle size={32} />}
                    </div>
                    <div>
                       <p className="font-black text-slate-900 dark:text-[#10b981] text-xl tracking-tighter uppercase mb-1">{t.description}</p>
                       <div className="flex items-center gap-4">
                          <span className="px-3 py-1 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-[#10b981]/60 rounded-lg text-[9px] font-black uppercase tracking-widest border dark:border-[#10b981]/10">{t.category}</span>
                          <span className="text-[10px] text-slate-400 dark:text-[#10b981]/40 font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                             <Activity size={12} className="text-amber-500" /> {t.date}
                          </span>
                       </div>
                    </div>
                 </div>
                 <div className="flex items-center gap-10 w-full md:w-auto justify-between md:justify-end">
                    <div className="text-right">
                       <p className={`text-3xl font-black tracking-tighter ${t.type === 'Ingreso' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                          {t.type === 'Ingreso' ? '+' : '-'}${t.amount.toLocaleString()}
                       </p>
                       <p className="text-[9px] font-bold text-slate-300 dark:text-[#10b981]/20 uppercase tracking-widest mt-1">UUID::{t.id.slice(0,8).toUpperCase()}</p>
                    </div>
                    <button onClick={() => setSelectedTransaction(t)} className="p-5 bg-white dark:bg-black hover:bg-slate-900 dark:hover:bg-[#10b981] hover:text-white dark:hover:text-black rounded-[22px] border border-slate-200 dark:border-[#10b981]/20 shadow-sm transition-all text-slate-400 dark:text-[#10b981] active:scale-90" title="Generar Documento Fiscal">
                       <Receipt size={24} />
                    </button>
                 </div>
              </div>
            ))}
         </div>
      </div>

      {isModalOpen && <TransactionModal type={modalType} onClose={() => setIsModalOpen(false)} />}
      {selectedTransaction && <ReceiptPreview transaction={selectedTransaction} onClose={() => setSelectedTransaction(null)} />}
    </div>
  );
};

export default FinanceManagement;
