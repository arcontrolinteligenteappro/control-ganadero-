
import React, { useState, useRef, useEffect } from 'react';
import { 
  Shield, User, Globe, Camera, Save, Cloud, LogIn, FileText,
  Type, Image as ImageIcon, Receipt, ChevronRight,
  ShieldCheck, Bell, Database, HardDrive, Lock, Cpu, Activity, Zap, RefreshCw, Terminal
} from 'lucide-react';
import { MOCK_BUSINESS_CONFIG } from '../constants';
import { GoogleUser, BusinessConfig } from '../types';
import { simulateGoogleLogin } from '../services/googleDriveService';

const Settings: React.FC = () => {
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState('Perfil del Rancho');
  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Terminal Logs State
  const [systemLogs, setSystemLogs] = useState<string[]>([
    "INITIALIZING_SECURITY_PROTOCOL_V4...",
    "DATABASE_INTEGRITY_CHECK::OK",
    "ENCRYPTION_LAYER_ACTIVE::AES-256",
  ]);

  const [receiptConfig, setReceiptConfig] = useState<BusinessConfig>(() => {
    const saved = localStorage.getItem('ar_receipt_config');
    return saved ? JSON.parse(saved) : MOCK_BUSINESS_CONFIG;
  });

  const [formData, setFormData] = useState({
    name: receiptConfig.name,
    address: receiptConfig.address,
    phone: receiptConfig.phone,
    email: 'contacto@arproganadero.com',
    taxId: receiptConfig.taxId || ''
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('ar_google_user');
    if (savedUser) setGoogleUser(JSON.parse(savedUser));

    if (activeMenu === 'Seguridad y Nodos') {
      const interval = setInterval(() => {
        const events = [
          "NODE_SYNC::SUCCESS", 
          "MEMORY_OPTIMIZATION::DONE", 
          "SSL_HANDSHAKE::VERIFIED", 
          "BACKUP_DAEMON::IDLE",
          "CORE_TEMP::NORMAL"
        ];
        setSystemLogs(prev => [...prev.slice(-8), `[${new Date().toLocaleTimeString()}] ${events[Math.floor(Math.random() * events.length)]}`]);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [activeMenu]);

  const handleSaveReceiptConfig = () => {
    localStorage.setItem('ar_receipt_config', JSON.stringify(receiptConfig));
    alert("CONFIGURACIÓN MAESTRA ACTUALIZADA :: El sistema ha sincronizado los folios fiscales.");
  };

  const handleGoogleLogin = async () => {
    const user = await simulateGoogleLogin();
    setGoogleUser(user);
    localStorage.setItem('ar_google_user', JSON.stringify(user));
  };

  const menuItems = [
    { label: 'Perfil del Rancho', icon: <User size={20} /> },
    { label: 'Comprobantes y PDF', icon: <Receipt size={20} /> },
    { label: 'Seguridad y Nodos', icon: <Shield size={20} /> },
    { label: 'Google Cloud Drive', icon: <Cloud size={20} /> },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-24">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-5xl font-black text-slate-900 dark:text-[#10b981] tracking-tighter uppercase leading-none mb-2">Panel de Control Maestro</h2>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest italic opacity-60">Configuración Global y Auditoría de Sistema</p>
        </div>
        <div className="hidden md:flex gap-3">
           <div className="px-5 py-2.5 bg-emerald-50 dark:bg-[#10b981]/10 rounded-2xl border border-emerald-100 dark:border-[#10b981]/20 flex items-center gap-3">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 dark:text-[#10b981]">Core_Stable</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-3">
           {menuItems.map((item, i) => (
             <button 
              key={i} 
              onClick={() => setActiveMenu(item.label)}
              className={`w-full flex items-center justify-between px-7 py-6 rounded-[32px] transition-all duration-500 active:scale-95 border ${activeMenu === item.label ? 'bg-amber-600 dark:bg-[#10b981] text-white dark:text-black shadow-2xl shadow-amber-600/40 border-transparent translate-x-2' : 'bg-white dark:bg-[#0a0f0d] text-slate-500 dark:text-[#10b981]/60 border-slate-200 dark:border-[#10b981]/10 hover:bg-slate-50 dark:hover:bg-[#10b981]/5'}`}>
               <div className="flex items-center gap-4">
                 <span className={`${activeMenu === item.label ? 'text-white' : 'text-amber-600 dark:text-[#10b981]'}`}>{item.icon}</span>
                 <span className="text-[11px] font-black uppercase tracking-[0.2em]">{item.label}</span>
               </div>
               <ChevronRight size={16} className={activeMenu === item.label ? 'opacity-100' : 'opacity-0'} />
             </button>
           ))}
        </div>

        <div className="lg:col-span-8">
          <div className="bg-white dark:bg-[#0a1411] p-10 md:p-14 rounded-[56px] border border-slate-200 dark:border-[#10b981]/20 shadow-sm relative overflow-hidden min-h-[600px] tech-card">
             
             {activeMenu === 'Perfil del Rancho' && (
               <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500">
                 <div className="flex flex-col md:flex-row items-center gap-10 mb-12">
                   <div className="relative group">
                     <div className="w-36 h-36 md:w-44 md:h-44 bg-slate-100 dark:bg-black rounded-[48px] flex items-center justify-center text-slate-300 border-4 border-white dark:border-[#10b981]/30 shadow-2xl overflow-hidden group-hover:border-amber-500 transition-all cursor-pointer">
                       {profilePhoto ? <img src={profilePhoto} className="w-full h-full object-cover" /> : <Globe size={70} />}
                     </div>
                     <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-3 -right-3 p-5 bg-amber-600 dark:bg-[#10b981] text-white dark:text-black rounded-3xl shadow-2xl border-4 border-white dark:border-[#0a1411] hover:scale-110 transition-transform"><Camera size={24} /></button>
                     <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) setProfilePhoto(URL.createObjectURL(file));
                     }} />
                   </div>
                   <div className="text-center md:text-left">
                      <h4 className="text-4xl font-black text-slate-900 dark:text-[#10b981] uppercase tracking-tighter mb-2">{formData.name}</h4>
                      <p className="text-[11px] text-amber-600 dark:text-emerald-500 font-black uppercase tracking-[0.3em]">ADMIN_RANCHO_MASTER :: ID_311099</p>
                   </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="md:col-span-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block">Nombre Comercial / Razón Social</label>
                     <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-5 bg-slate-50 dark:bg-black border-2 border-slate-100 dark:border-[#10b981]/20 rounded-3xl font-black outline-none focus:border-amber-500 dark:focus:border-[#10b981] dark:text-[#10b981] transition-all shadow-inner" />
                   </div>
                   <div className="md:col-span-2 grid grid-cols-2 gap-6">
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block">Teléfono de Enlace Técnico</label>
                        <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-5 bg-slate-50 dark:bg-black border-2 border-slate-100 dark:border-[#10b981]/20 rounded-3xl font-black outline-none dark:text-[#10b981]" />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Email de Soporte</label>
                        <input type="text" value={formData.email} className="w-full p-5 bg-slate-50 dark:bg-black border-2 border-slate-100 dark:border-[#10b981]/20 rounded-3xl font-black outline-none dark:text-[#10b981]" />
                      </div>
                   </div>
                   <button className="md:col-span-2 py-6 bg-slate-900 dark:bg-[#10b981] text-white dark:text-black font-black rounded-[32px] transition-all uppercase text-[11px] tracking-[0.25em] flex items-center justify-center gap-4 shadow-xl active:scale-95">
                     <Save size={20} /> Consolidar Perfil Maestro
                   </button>
                 </div>
               </div>
             )}

             {activeMenu === 'Comprobantes y PDF' && (
               <div className="space-y-10 animate-in slide-in-from-right-8 duration-500">
                  <div className="flex items-center gap-5 mb-8">
                     <div className="p-4 bg-amber-50 dark:bg-[#10b981]/10 rounded-2xl text-amber-600 dark:text-[#10b981] shadow-inner"><Receipt size={32} /></div>
                     <div>
                        <h4 className="text-2xl font-black text-slate-800 dark:text-[#10b981] uppercase tracking-tighter leading-none">Diseño de Documentación</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">Personalización de Facturación y Guías SINIIGA</p>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-6">
                        <div>
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block">RFC / Identificador Fiscal</label>
                           <input 
                            type="text" 
                            className="w-full p-5 bg-slate-50 dark:bg-black border-2 border-slate-100 dark:border-[#10b981]/20 rounded-3xl font-black dark:text-[#10b981] outline-none shadow-inner uppercase" 
                            value={receiptConfig.taxId || ''}
                            onChange={e => setReceiptConfig({...receiptConfig, taxId: e.target.value})}
                            placeholder="Ej: GAN-MX-95..."
                           />
                        </div>
                        <div>
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block">Lema Comercial (Pie de Recibo)</label>
                           <textarea 
                            className="w-full p-5 bg-slate-50 dark:bg-black border-2 border-slate-100 dark:border-[#10b981]/20 rounded-3xl font-black dark:text-[#10b981] outline-none h-32 resize-none shadow-inner" 
                            value={receiptConfig.receiptNote || ''}
                            onChange={e => setReceiptConfig({...receiptConfig, receiptNote: e.target.value})}
                            placeholder="Mensaje final..."
                           />
                        </div>
                     </div>

                     <div className="p-8 bg-slate-50 dark:bg-black/40 rounded-[48px] border-2 border-dashed border-slate-200 dark:border-[#10b981]/20 flex flex-col items-center justify-center text-center space-y-5 hover:bg-slate-100 dark:hover:bg-[#10b981]/5 transition-all cursor-pointer group">
                        <div className="w-20 h-20 bg-white dark:bg-black rounded-[28px] flex items-center justify-center text-slate-300 dark:text-[#10b981]/40 shadow-xl group-hover:scale-110 transition-transform">
                           <ImageIcon size={40} />
                        </div>
                        <div>
                           <p className="text-[11px] font-black text-slate-600 dark:text-[#10b981] uppercase tracking-widest">Logo Oficial del Hato</p>
                           <p className="text-[9px] font-bold text-slate-400 mt-2 italic px-4">Aparecerá en todos los tickets térmicos y reportes PDF</p>
                        </div>
                        <button className="px-8 py-3 bg-white dark:bg-[#10b981]/15 border border-slate-200 dark:border-[#10b981]/30 rounded-2xl text-[10px] font-black uppercase text-slate-700 dark:text-[#10b981] hover:shadow-xl transition-all">Sustituir Logo</button>
                     </div>
                  </div>

                  <button 
                    onClick={handleSaveReceiptConfig}
                    className="w-full py-6 bg-amber-600 dark:bg-[#10b981] text-white dark:text-black font-black rounded-[32px] shadow-2xl transition-all uppercase text-[11px] tracking-[0.25em] flex items-center justify-center gap-4 active:scale-95"
                  >
                     <Save size={20} /> Guardar Cambios en Plantillas
                  </button>
               </div>
             )}

             {activeMenu === 'Seguridad y Nodos' && (
               <div className="space-y-8 animate-in zoom-in-95 duration-500 flex flex-col h-full">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     {[
                       { label: 'Cifrado de Datos', val: 'AES-256-GCM', icon: <Lock size={20} className="text-blue-500" /> },
                       { label: 'Salud de Nodos', val: '99.9% Uptime', icon: <Cpu size={20} className="text-emerald-500" /> },
                       { label: 'Integridad DB', icon: <Database size={20} className="text-amber-500" />, val: 'Verified' }
                     ].map((st, i) => (
                       <div key={i} className="p-6 bg-slate-50 dark:bg-black/60 rounded-[32px] border border-slate-100 dark:border-[#10b981]/10">
                          <div className="flex items-center gap-3 mb-3">
                             {st.icon}
                             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{st.label}</span>
                          </div>
                          <p className="text-lg font-black text-slate-800 dark:text-[#10b981] tracking-tighter">{st.val}</p>
                       </div>
                     ))}
                  </div>

                  <div className="flex-1 bg-slate-900 dark:bg-black rounded-[40px] p-8 font-mono relative overflow-hidden border border-white/5 shadow-2xl">
                     <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                        <Terminal size={18} className="text-emerald-500" />
                        <h5 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">System_Audit_Terminal::UPLINK_B</h5>
                     </div>
                     <div className="space-y-2 max-h-[250px] overflow-y-auto custom-scrollbar">
                        {systemLogs.map((log, i) => (
                          <div key={i} className="flex gap-4 items-start animate-in slide-in-from-left-2">
                             <span className="text-emerald-500 opacity-30 select-none">[{i+1}]</span>
                             <span className="text-[10px] text-emerald-400/90 tracking-tight">{log}</span>
                          </div>
                        ))}
                     </div>
                     <div className="absolute bottom-4 right-8 flex items-center gap-2">
                        <RefreshCw size={14} className="text-emerald-500 animate-spin" />
                        <span className="text-[8px] font-bold text-emerald-500/50 uppercase tracking-widest">Escaneando Nodos...</span>
                     </div>
                  </div>

                  <div className="p-6 bg-amber-50 dark:bg-amber-900/10 rounded-[32px] border border-amber-100 dark:border-amber-800/30 flex items-center gap-6">
                     <Zap size={32} className="text-amber-600 shrink-0" />
                     <p className="text-[10px] font-bold text-amber-900 dark:text-amber-200 leading-relaxed uppercase">
                        El sistema AR CONTROL opera bajo protocolos de redundancia local. Incluso sin conexión, sus datos biómetricos permanecen seguros y encriptados en el dispositivo.
                     </p>
                  </div>
               </div>
             )}

             {activeMenu === 'Google Cloud Drive' && (
                <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
                   <div className="p-10 bg-blue-50 dark:bg-blue-900/10 rounded-[48px] border border-blue-100 dark:border-blue-800/30 flex flex-col md:flex-row items-center gap-8">
                      <div className="w-24 h-24 bg-white dark:bg-black rounded-3xl flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-xl border border-blue-100/50">
                         <HardDrive size={48} />
                      </div>
                      <div className="flex-1 text-center md:text-left">
                         <h3 className="text-2xl font-black text-blue-900 dark:text-blue-400 uppercase tracking-tighter mb-2">Copia de Seguridad en la Nube</h3>
                         <p className="text-sm font-bold text-blue-700 dark:text-blue-400/60 leading-relaxed">Sincronización total de su inventario, finanzas y bitácoras sanitarias con Google Drive.</p>
                      </div>
                      {!googleUser ? (
                        <button onClick={handleGoogleLogin} className="px-10 py-5 bg-blue-600 text-white font-black rounded-2xl shadow-xl hover:bg-blue-700 transition-all uppercase text-[10px] tracking-widest flex items-center gap-3 active:scale-95">
                           <LogIn size={18} /> Vincular Google Drive
                        </button>
                      ) : (
                        <div className="flex items-center gap-4 px-6 py-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800/30">
                           <ShieldCheck size={24} className="text-emerald-600" />
                           <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">Enlace Sincronizado</span>
                        </div>
                      )}
                   </div>
                </div>
             )}

             <div className="absolute top-0 right-0 w-80 h-80 bg-amber-600/5 dark:bg-[#10b981]/5 rounded-full -mr-40 -mt-40 blur-3xl pointer-events-none animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
