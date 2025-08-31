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
  const [avatarState, setAvatarState] = useState<'happy' | 'stressed' | 'calm' | 'tired' | 'energetic'>('calm');
  const { toast } = useToast();

  const handleModuleChange = (module: string) => {
    setCurrentModule(module);
    
    // Show coming soon toast for non-dashboard modules
    if (module !== 'dashboard') {
      toast({
        title: `${module.charAt(0).toUpperCase() + module.slice(1)} Module`,
        description: "This feature is coming soon! Connect to Supabase to enable full functionality.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        currentModule={currentModule}
        onModuleChange={handleModuleChange}
        avatarState={avatarState}
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
