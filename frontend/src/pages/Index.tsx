import { useState } from 'react';
import { Header } from '@/components/Header';
import { Dashboard } from '@/components/Dashboard';
import { Calendar } from '@/components/Calendar';
import { Health } from '@/components/Health';
import { Notes } from '@/components/Notes';
import { Bills } from '@/components/Bills';
import { Budget } from '@/components/Budget';
import { Settings } from '@/components/Settings';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [currentModule, setCurrentModule] = useState('dashboard');
  const { toast } = useToast();

  const handleModuleChange = (module: string) => {
    setCurrentModule(module);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        currentModule={currentModule}
        onModuleChange={handleModuleChange}
      />
      
      <main>
        {currentModule === 'dashboard' && (
          <Dashboard onModuleSelect={handleModuleChange} />
        )}
        {currentModule === 'calendar' && <Calendar />}
        {currentModule === 'health' && <Health />}
        {currentModule === 'notes' && <Notes />}
        {currentModule === 'expenses' && <Bills />}
        {currentModule === 'budget' && <Budget />}
        {currentModule === 'settings' && <Settings />}
      </main>
    </div>
  );
};

export default Index;
