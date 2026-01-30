
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Marketplace from './components/Marketplace';
import HerdManagement from './components/HerdManagement';
import HealthManagement from './components/HealthManagement';
import ReproductionManagement from './components/ReproductionManagement';
import ClientManagement from './components/ClientManagement';
import FinanceManagement from './components/FinanceManagement';
import OperationsManagement from './components/OperationsManagement';
import HrManagement from './components/HrManagement';
import CalendarEvents from './components/CalendarEvents';
import Settings from './components/Settings';
import IaConsultant from './components/IaConsultant';
import NotesManagement from './components/NotesManagement';
import { Activity, Stethoscope, Baby, Map, UserCheck, ShoppingBag, Wallet, Users } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [subTab, setSubTab] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('ar_theme') as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('ar_theme', theme);
  }, [theme]);

  // Reset subtab when changing main tab
  useEffect(() => {
    if (activeTab === 'bio_control') setSubTab('herd');
    else if (activeTab === 'operations') setSubTab('paddocks');
    else if (activeTab === 'business') setSubTab('marketplace');
    else setSubTab(null);
  }, [activeTab]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const renderSubTabs = (items: { id: string; label: string; icon: React.ReactNode }[]) => (
    <div className="flex p-1.5 bg-white dark:bg-[#0a0f0d] rounded-2xl border border-slate-200 dark:border-[#10b981]/20 shadow-sm mb-6 w-fit animate-in fade-in zoom-in-95">
      {items.map(item => (
        <button
          key={item.id}
          onClick={() => setSubTab(item.id)}
          className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${subTab === item.id ? (theme === 'dark' ? 'bg-[#10b981] text-black' : 'bg-slate-900 text-white shadow-lg') : 'text-slate-400 hover:text-slate-600 dark:hover:text-[#10b981]'}`}
        >
          {item.icon}
          {item.label}
        </button>
      ))}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'ai_consultant': return <IaConsultant />;
      case 'bio_control':
        return (
          <div className="space-y-4">
            {renderSubTabs([
              { id: 'herd', label: 'Mi Hato', icon: <Activity size={14} /> },
              { id: 'health', label: 'Sanidad', icon: <Stethoscope size={14} /> },
              { id: 'reproduction', label: 'Reproducción', icon: <Baby size={14} /> }
            ])}
            {subTab === 'herd' && <HerdManagement />}
            {subTab === 'health' && <HealthManagement />}
            {subTab === 'reproduction' && <ReproductionManagement />}
          </div>
        );
      case 'operations':
        return (
          <div className="space-y-4">
            {renderSubTabs([
              { id: 'paddocks', label: 'Potreros', icon: <Map size={14} /> },
              { id: 'hr', label: 'Personal', icon: <UserCheck size={14} /> }
            ])}
            {subTab === 'paddocks' && <OperationsManagement />}
            {subTab === 'hr' && <HrManagement />}
          </div>
        );
      case 'business':
        return (
          <div className="space-y-4">
            {renderSubTabs([
              { id: 'marketplace', label: 'Mercado', icon: <ShoppingBag size={14} /> },
              { id: 'finances', label: 'Finanzas', icon: <Wallet size={14} /> },
              { id: 'clients', label: 'Directorio', icon: <Users size={14} /> }
            ])}
            {subTab === 'marketplace' && <Marketplace />}
            {subTab === 'finances' && <FinanceManagement />}
            {subTab === 'clients' && <ClientManagement />}
          </div>
        );
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} theme={theme} toggleTheme={toggleTheme}>
      <div className="animate-in fade-in slide-in-from-right-4 duration-500 ease-out h-full">
        {renderContent()}
      </div>
    </Layout>
  );
};

export default App;
