
import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Marketplace from './components/Marketplace';
import HerdManagement from './components/HerdManagement';
import HealthManagement from './components/HealthManagement';
import ReproductionManagement from './components/ReproductionManagement';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'marketplace':
        return <Marketplace />;
      case 'herd':
        return <HerdManagement />;
      case 'health':
        return <HealthManagement />;
      case 'reproduction':
        return <ReproductionManagement />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 p-12">
            <div className="w-24 h-24 bg-slate-100 rounded-3xl flex items-center justify-center mb-6 shadow-inner">
              <span className="text-5xl">🚜</span>
            </div>
            <h3 className="text-2xl font-black text-slate-600">Módulo en Construcción</h3>
            <p className="max-w-xs text-center mt-3 text-slate-400 font-medium">
              Estamos integrando sensores IoT y logística avanzada para habilitar {activeTab} pronto.
            </p>
            <button 
              onClick={() => setActiveTab('dashboard')}
              className="mt-8 px-8 py-3 bg-green-600 text-white font-bold rounded-2xl hover:bg-green-700 transition-all shadow-lg shadow-green-600/20"
            >
              Volver al Dashboard
            </button>
          </div>
        );
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        {renderContent()}
      </div>
    </Layout>
  );
};

export default App;
