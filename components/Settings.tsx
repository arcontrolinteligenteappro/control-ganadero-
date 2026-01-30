
import React, { useState, useRef, useEffect } from 'react';
import { Shield, User, Bell, Globe, Database, Smartphone, LogOut, ChevronRight, Camera, Mail, Phone, MapPin, Save, Cloud, RefreshCw, LogIn } from 'lucide-react';
import { MOCK_BUSINESS_CONFIG } from '../constants';
import { GoogleUser } from '../types';
import { simulateGoogleLogin, syncToGoogleDrive } from '../services/googleDriveService';

const Settings: React.FC = () => {
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState('Perfil del Rancho');
  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: MOCK_BUSINESS_CONFIG.name,
    address: MOCK_BUSINESS_CONFIG.address,
    phone: MOCK_BUSINESS_CONFIG.phone,
    email: 'contacto@arcontrolganadero.com',
    taxId: MOCK_BUSINESS_CONFIG.taxId || ''
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('ar_google_user');
    if (savedUser) setGoogleUser(JSON.parse(savedUser));
  }, []);

  const handleGoogleLogin = async () => {
    const user = await simulateGoogleLogin();
    setGoogleUser(user);
    localStorage.setItem('ar_google_user', JSON.stringify(user));
    alert(`Conectado como ${user.name}. Carpeta de respaldo creada en Google Drive.`);
  };

  const handleBackup = async () => {
    if (!googleUser) {
      alert("Debes iniciar sesión con Google para realizar respaldos en la nube.");
      return;
    }
    setIsSyncing(true);
    const success = await syncToGoogleDrive({ formData, timestamp: new Date() });
    setIsSyncing(false);
    if (success) {
      const updatedUser = { ...googleUser, lastBackup: new Date().toISOString() };
      setGoogleUser(updatedUser);
      localStorage.setItem('ar_google_user', JSON.stringify(updatedUser));
      alert("Copia de seguridad enviada a Google Drive exitosamente.");
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Configuración Maestro</h2>
          <p className="text-slate-500 font-bold text-sm italic">Gestión de identidad, seguridad y respaldos Google Drive.</p>
        </div>
        <div className="hidden md:block">
           <span className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100">Versión 2.5 Pro Cloud</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20">
        <div className="lg:col-span-4 space-y-2">
           {[
             { label: 'Perfil del Rancho', icon: <User size={18} /> },
             { label: 'Seguridad', icon: <Shield size={18} /> },
             { label: 'Notificaciones', icon: <Bell size={18} /> },
             { label: 'Nube & Google Drive', icon: <Cloud size={18} /> },
             { label: 'Dispositivos', icon: <Smartphone size={18} /> },
           ].map((item, i) => (
             <button 
              key={i} 
              onClick={() => setActiveMenu(item.label)}
              className={`w-full flex items-center justify-between px-6 py-5 rounded-[24px] transition-all duration-300 active:scale-95 ${activeMenu === item.label ? 'bg-amber-600 text-white shadow-xl shadow-amber-600/30 translate-x-2' : 'hover:bg-white text-slate-500 font-bold text-sm bg-slate-50 border border-slate-100'}`}>
               <div className="flex items-center gap-4">
                 <span className={`${activeMenu === item.label ? 'text-white' : 'text-amber-600'}`}>{item.icon}</span>
                 <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
               </div>
               <ChevronRight size={14} className={activeMenu === item.label ? 'opacity-100' : 'opacity-0'} />
             </button>
           ))}
           <div className="pt-8">
             <button onClick={() => { localStorage.removeItem('ar_google_user'); setGoogleUser(null); }} className="w-full flex items-center gap-4 px-8 py-5 text-red-500 font-black text-xs uppercase tracking-widest hover:bg-red-50 rounded-[24px] transition-all border border-transparent hover:border-red-100">
               <LogOut size={18} /> Cerrar Sesión
             </button>
           </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-8 md:p-12 rounded-[48px] border border-slate-200 shadow-sm relative overflow-hidden">
             
             {activeMenu === 'Perfil del Rancho' && (
               <div className="space-y-12">
                 <div className="flex flex-col md:flex-row items-center gap-8 mb-12 relative z-10">
                   <div className="relative group">
                     <div className="w-32 h-32 md:w-40 md:h-40 bg-slate-100 rounded-[40px] flex items-center justify-center text-slate-300 border-4 border-white shadow-2xl overflow-hidden group-hover:border-amber-500 transition-all duration-500">
                       {profilePhoto ? (
                         <img src={profilePhoto} className="w-full h-full object-cover" alt="Profile" />
                       ) : (
                         <Globe size={60} className="group-hover:scale-110 transition-transform" />
                       )}
                     </div>
                     <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-2 -right-2 p-4 bg-amber-600 text-white rounded-[20px] shadow-xl hover:bg-amber-700 hover:scale-110 transition-all active:scale-90 border-4 border-white">
                       <Camera size={20} />
                     </button>
                     <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                   </div>
                   
                   <div className="text-center md:text-left">
                      <h4 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-1">{formData.name}</h4>
                      <p className="text-xs text-amber-600 font-black uppercase tracking-widest flex items-center justify-center md:justify-start gap-2">
                        <Shield size={14} className="text-emerald-500" /> Administrador Certificado
                      </p>
                   </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                   <div className="md:col-span-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Razón Social</label>
                     <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-5 bg-slate-50 border-none rounded-2xl font-bold text-sm outline-none focus:ring-4 focus:ring-amber-500/10" />
                   </div>
                   <div>
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Teléfono</label>
                     <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-5 bg-slate-50 border-none rounded-2xl font-bold text-sm outline-none focus:ring-4 focus:ring-amber-500/10" />
                   </div>
                   <div>
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Correo</label>
                     <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-5 bg-slate-50 border-none rounded-2xl font-bold text-sm outline-none focus:ring-4 focus:ring-amber-500/10" />
                   </div>
                   <button className="md:col-span-2 py-6 bg-amber-600 text-white font-black rounded-[28px] hover:bg-amber-700 shadow-xl transition-all active:scale-95 text-xs uppercase tracking-widest flex items-center justify-center gap-3">
                     <Save size={20} /> Guardar Perfil Local
                   </button>
                 </div>
               </div>
             )}

             {activeMenu === 'Nube & Google Drive' && (
                <div className="space-y-8 animate-in slide-in-from-right-4">
                   <div className="p-8 bg-blue-50 border-2 border-blue-100 rounded-[40px] flex flex-col md:flex-row items-center gap-8">
                      <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-blue-600 shadow-xl">
                         <Cloud size={40} />
                      </div>
                      <div className="flex-1 text-center md:text-left">
                         <h3 className="text-2xl font-black text-blue-900 uppercase tracking-tighter mb-2">Respaldo en la Nube</h3>
                         <p className="text-sm font-bold text-blue-700 leading-relaxed">Vincule su cuenta de Google Drive para asegurar sus datos ante pérdida de dispositivo.</p>
                      </div>
                      {!googleUser ? (
                        <button onClick={handleGoogleLogin} className="w-full md:w-auto px-8 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3 uppercase text-[10px] tracking-widest">
                           <LogIn size={18} /> Iniciar Sesión Google
                        </button>
                      ) : (
                        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-blue-200">
                           <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-blue-600">
                              <img src={googleUser.picture} className="w-full h-full" />
                           </div>
                           <span className="text-xs font-black text-blue-900 uppercase">{googleUser.name}</span>
                        </div>
                      )}
                   </div>

                   {googleUser && (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-8 bg-slate-900 rounded-[40px] text-white space-y-6">
                           <div>
                              <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">Estatus del Respaldo</p>
                              <p className="text-xs font-bold text-slate-400 italic">Carpeta: AR_CONTROL_GANADERO_BACKUP</p>
                           </div>
                           <div className="flex justify-between items-end border-t border-white/10 pt-4">
                              <div>
                                 <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Última Sincronización</p>
                                 <p className="text-lg font-black text-emerald-400">{googleUser.lastBackup ? new Date(googleUser.lastBackup).toLocaleString() : 'Nunca'}</p>
                              </div>
                              <button 
                                onClick={handleBackup}
                                disabled={isSyncing}
                                className={`p-4 rounded-2xl transition-all shadow-lg active:scale-90 ${isSyncing ? 'bg-amber-600 animate-spin' : 'bg-white/10 hover:bg-white/20'}`}
                              >
                                 <RefreshCw size={20} />
                              </button>
                           </div>
                           <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">Recuperar Datos de Drive</button>
                        </div>

                        <div className="p-8 bg-white border-2 border-slate-100 rounded-[40px] flex flex-col justify-center space-y-4">
                           <div className="flex items-center gap-3">
                              <Database className="text-amber-600" size={24} />
                              <h4 className="font-black text-slate-800 uppercase text-xs">Datos Sincronizados</h4>
                           </div>
                           <ul className="space-y-2">
                              {['Hato Maestro', 'Historial Sanitario', 'Finanzas & Nómina', 'Bitácora de Notas'].map((d, i) => (
                                <li key={i} className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                                   <ChevronRight size={12} className="text-amber-500" /> {d}
                                </li>
                              ))}
                           </ul>
                        </div>
                     </div>
                   )}
                </div>
             )}

             <div className="absolute top-0 right-0 w-96 h-96 bg-amber-600/5 rounded-full -mr-48 -mt-48 blur-3xl pointer-events-none"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
