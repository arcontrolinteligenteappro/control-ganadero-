
import React, { useState, useMemo } from 'react';
import { MOCK_NOTES } from '../constants';
import { 
  Notebook, Plus, Search, Filter, Trash2, Pencil, 
  Save, X, Paperclip, Palette, Clock, FileText, 
  Download, MoreVertical, LayoutGrid, List, CheckCircle2
} from 'lucide-react';
import { Note, NoteAttachment } from '../types';

const COLORS = [
  { name: 'Rojo', val: '#fee2e2' },
  { name: 'Naranja', val: '#ffedd5' },
  { name: 'Amarillo', val: '#fef3c7' },
  { name: 'Verde', val: '#dcfce7' },
  { name: 'Azul', val: '#dbeafe' },
  { name: 'Morado', val: '#f3e8ff' },
  { name: 'Gris', val: '#f1f5f9' },
  { name: 'Blanco', val: '#ffffff' }
];

const NoteModal: React.FC<{ note?: Note; onClose: () => void }> = ({ note, onClose }) => {
  const [formData, setFormData] = useState<Partial<Note>>(note || {
    title: '',
    content: '',
    color: '#ffffff',
    attachments: []
  });
  const [isUploading, setIsUploading] = useState(false);

  const handleAddAttachment = () => {
    setIsUploading(true);
    // Simular subida
    setTimeout(() => {
      const newAtt: NoteAttachment = {
        id: Date.now().toString(),
        name: `documento_${Math.floor(Math.random()*100)}.pdf`,
        type: 'application/pdf',
        size: '1.5 MB'
      };
      setFormData(prev => ({ ...prev, attachments: [...(prev.attachments || []), newAtt] }));
      setIsUploading(false);
    }, 1000);
  };

  const removeAttachment = (id: string) => {
    setFormData(prev => ({ ...prev, attachments: prev.attachments?.filter(a => a.id !== id) }));
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col border border-slate-200">
        <div className="p-8 flex justify-between items-center bg-[#1a2421] text-white">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-amber-600 rounded-xl"><Notebook size={24} /></div>
             <div>
               <h3 className="font-black text-xl uppercase tracking-tighter leading-none">{note ? 'Editar Nota Maestra' : 'Nueva Nota Técnica'}</h3>
               <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-1">Sincronizado con AR CONTROL</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all"><X size={24} /></button>
        </div>

        <div className="p-8 flex-1 overflow-y-auto space-y-6 custom-scrollbar" style={{ backgroundColor: formData.color + '40' }}>
           <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Título de la nota..." 
                className="w-full bg-transparent border-b-2 border-slate-200 pb-3 font-black text-2xl text-slate-800 outline-none focus:border-amber-500 transition-all placeholder:text-slate-300"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
              <textarea 
                placeholder="Escribe el contenido aquí..."
                rows={10}
                className="w-full bg-transparent p-4 rounded-3xl border-2 border-dashed border-slate-200/50 font-medium text-slate-700 outline-none focus:border-amber-500/30 transition-all resize-none custom-scrollbar"
                value={formData.content}
                onChange={e => setFormData({...formData, content: e.target.value})}
              />
           </div>

           <div className="space-y-3">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2"><Palette size={14} /> Color de Etiqueta</p>
              <div className="flex gap-3 flex-wrap">
                 {COLORS.map(c => (
                   <button 
                    key={c.val} 
                    onClick={() => setFormData({...formData, color: c.val})}
                    className={`w-10 h-10 rounded-2xl border-4 transition-all hover:scale-110 shadow-sm ${formData.color === c.val ? 'border-amber-500 scale-110' : 'border-white'}`}
                    style={{ backgroundColor: c.val }}
                    title={c.name}
                   />
                 ))}
              </div>
           </div>

           <div className="space-y-4">
              <div className="flex justify-between items-center">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2"><Paperclip size={14} /> Archivos Adjuntos</p>
                 <button 
                  onClick={handleAddAttachment}
                  disabled={isUploading}
                  className="text-[10px] font-black text-amber-600 bg-amber-50 px-4 py-1.5 rounded-xl border border-amber-100 hover:bg-amber-100 transition-all uppercase flex items-center gap-2"
                 >
                    {isUploading ? <span className="animate-spin text-xs">...</span> : <Plus size={14} />}
                    Vincular Archivo
                 </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                 {formData.attachments?.map(att => (
                   <div key={att.id} className="p-4 bg-white/60 backdrop-blur-md rounded-2xl border border-slate-200 flex items-center justify-between group shadow-sm">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="p-2 bg-slate-100 rounded-xl text-slate-400"><FileText size={18} /></div>
                        <div className="overflow-hidden">
                           <p className="text-xs font-black text-slate-700 truncate">{att.name}</p>
                           <p className="text-[9px] text-slate-400 font-bold">{att.size}</p>
                        </div>
                      </div>
                      <button onClick={() => removeAttachment(att.id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><X size={16} /></button>
                   </div>
                 ))}
                 {formData.attachments?.length === 0 && (
                   <div className="col-span-2 py-8 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl opacity-40">
                      <FileText size={24} className="mb-2" />
                      <p className="text-[10px] font-black uppercase tracking-widest">Sin archivos vinculados</p>
                   </div>
                 )}
              </div>
           </div>
        </div>

        <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
           <button onClick={onClose} className="flex-1 py-4 bg-white border-2 border-slate-200 text-slate-400 font-black rounded-2xl hover:bg-slate-100 transition-all uppercase tracking-widest text-[10px]">Descartar</button>
           <button onClick={() => { alert('Nota guardada y sincronizada.'); onClose(); }} className="flex-1 py-4 bg-amber-600 text-white font-black rounded-2xl hover:bg-amber-700 shadow-xl transition-all uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 active:scale-95">
             <Save size={18} /> Guardar Nota
           </button>
        </div>
      </div>
    </div>
  );
};

const NotesManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | undefined>(undefined);

  const filteredNotes = useMemo(() => {
    return MOCK_NOTES.filter(n => n.title.toLowerCase().includes(searchTerm.toLowerCase()) || n.content.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700 h-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-1">Control de Notas Técnicas</h2>
          <p className="text-slate-500 font-bold text-sm italic">Gestión de bitácoras, adjuntos y registros administrativos.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-2">
           <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm shrink-0">
              <button onClick={() => setViewMode('grid')} className={`p-3 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400'}`}><LayoutGrid size={18} /></button>
              <button onClick={() => setViewMode('list')} className={`p-3 rounded-xl transition-all ${viewMode === 'list' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400'}`}><List size={18} /></button>
           </div>
           <button 
            onClick={() => { setSelectedNote(undefined); setIsModalOpen(true); }}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-amber-600 text-white px-8 py-4 rounded-[22px] text-[10px] font-black hover:bg-amber-700 shadow-xl transition-all uppercase tracking-widest active:scale-95 shrink-0"
           >
             <Plus size={18} /> Nueva Nota
           </button>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[48px] border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-center">
         <div className="relative flex-1 w-full">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
           <input 
            type="text" 
            placeholder="Buscar en el historial de notas..." 
            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl font-bold text-xs outline-none focus:ring-4 focus:ring-amber-500/10 transition-all"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
           />
         </div>
         <button className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 transition-all"><Filter size={20} /></button>
      </div>

      <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20" : "space-y-4 pb-20"}>
         {filteredNotes.map(note => (
           <div 
            key={note.id} 
            className="group relative bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-1 cursor-pointer"
            onClick={() => { setSelectedNote(note); setIsModalOpen(true); }}
           >
              <div className="absolute top-0 left-0 w-full h-3" style={{ backgroundColor: note.color }}></div>
              <div className="p-8 space-y-4" style={{ backgroundColor: note.color + '15' }}>
                 <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                       <Clock size={12} className="text-amber-500" /> {note.date}
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-all flex gap-2">
                       <button className="p-2 bg-white text-slate-400 hover:text-amber-600 rounded-xl shadow-sm border border-slate-100"><Pencil size={14} /></button>
                       <button className="p-2 bg-white text-slate-400 hover:text-red-600 rounded-xl shadow-sm border border-slate-100"><Trash2 size={14} /></button>
                    </div>
                 </div>
                 
                 <h4 className="text-xl font-black text-slate-800 uppercase tracking-tighter leading-tight group-hover:text-amber-600 transition-colors">{note.title}</h4>
                 <p className="text-sm font-medium text-slate-500 line-clamp-4 leading-relaxed">{note.content}</p>
                 
                 <div className="pt-4 flex items-center justify-between">
                    <div className="flex -space-x-2">
                       {note.attachments.map((att, i) => (
                         <div key={att.id} className="w-8 h-8 rounded-full bg-white border-2 border-slate-100 flex items-center justify-center text-amber-600 shadow-sm" title={att.name}>
                            <FileText size={12} />
                         </div>
                       ))}
                       {note.attachments.length > 0 && <span className="text-[9px] font-black text-slate-400 uppercase ml-4 mt-2">+{note.attachments.length} Adjuntos</span>}
                    </div>
                    <CheckCircle2 size={20} className="text-slate-200 group-hover:text-emerald-500 transition-colors" />
                 </div>
              </div>
           </div>
         ))}
         
         {filteredNotes.length === 0 && (
           <div className="col-span-full py-40 flex flex-col items-center justify-center text-slate-300 opacity-50">
              <Notebook size={80} strokeWidth={1} className="mb-4" />
              <p className="font-black uppercase tracking-[0.2em] text-sm">No hay notas que coincidan</p>
           </div>
         )}
      </div>

      {isModalOpen && <NoteModal note={selectedNote} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default NotesManagement;
