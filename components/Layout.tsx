
import React, { useState } from 'react';
import { NAV_ITEMS } from '../constants';
import { Menu, X, Bell, User, Search } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Mobile Header */}
      <header className="md:hidden bg-green-800 text-white p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-green-800 font-bold text-xl">AR</span>
          </div>
          <h1 className="font-bold text-lg">Control Ganadero</h1>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 transition-transform duration-300 transform
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0
      `}>
        <div className="p-6 hidden md:flex items-center gap-3">
          <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-900/20">
            <span className="text-white font-bold text-2xl">AR</span>
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-tight">ARControl</h1>
            <p className="text-xs text-slate-500">Gestión Inteligente</p>
          </div>
        </div>

        <nav className="mt-6 px-4 space-y-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsSidebarOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                ${activeTab === item.id 
                  ? 'bg-green-600 text-white shadow-lg shadow-green-600/20' 
                  : 'hover:bg-slate-800 hover:text-white'}
              `}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-8 left-0 w-full px-6">
          <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white">
                <User size={20} />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-white truncate">Juan Ganadero</p>
                <p className="text-xs text-slate-400">Premium</p>
              </div>
            </div>
            <button className="w-full py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs font-semibold transition-colors">
              Configuración
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top bar (Desktop) */}
        <div className="hidden md:flex bg-white border-b border-slate-200 px-8 py-4 justify-between items-center">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar animales, lotes o guías..."
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent focus:bg-white focus:border-green-500 rounded-xl text-sm transition-all outline-none"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-500 hover:text-green-600 bg-slate-100 hover:bg-green-50 rounded-xl transition-all relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200 mx-2"></div>
            <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-green-700 shadow-md shadow-green-600/20 transition-all">
              Nuevo Registro
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
