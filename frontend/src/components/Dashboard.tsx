import { useState, useEffect } from 'react';
import { useMood } from '@/context/MoodContext';
import { ModuleCard } from './ModuleCard';
import { HeroSection } from './HeroSection';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar, 
  Heart, 
  FileText, 
  Receipt, 
  TrendingUp,
  Clock,
  Target,
  Zap,
  Droplets,
  Moon,
  DollarSign
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DashboardProps {
  onModuleSelect?: (module: string) => void;
}

export const Dashboard = ({ onModuleSelect }: DashboardProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { toast } = useToast();
  const { setSignals } = useMood();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Mock data - in real app this would come from Supabase
  const mockData = {
    health: {
      sleep: 7.5,
      water: 6,
      steps: 8432
    },
    finance: {
      budgetUsed: 68,
      splitBills: 3
    },
    productivity: {
      tasksCompleted: 5,
      totalTasks: 8
    }
  };

  // Feed multi-domain signals to global mood engine
  useEffect(() => {
    setSignals({
      budgetUsed: mockData.finance.budgetUsed,
      overdueBills: mockData.finance.splitBills, // treat split bills as pending bills for now
      sleepHours: mockData.health.sleep,
      waterCups: mockData.health.water,
      steps: mockData.health.steps,
      tasksCompleted: mockData.productivity.tasksCompleted,
      totalTasks: mockData.productivity.totalTasks,
      eventsToday: 4, // placeholder; wire to calendar count when available
    });
  }, [setSignals]);

  const handleQuickAction = (_action: string) => {
    // Intentionally no-op until wired to real actions
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection 
        currentTime={currentTime}
        onQuickAction={handleQuickAction}
      />

      {/* Main Content */}
      <section className="py-8 px-6">
        <div className="container mx-auto max-w-7xl">

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="glass-card p-4">
              <div className="flex items-center space-x-3">
                <Moon className="w-5 h-5 text-secondary" />
                <div>
                  <p className="text-sm text-muted-foreground">Sleep</p>
                  <p className="font-bold text-secondary">{mockData.health.sleep}h</p>
                </div>
              </div>
            </Card>
            
            <Card className="glass-card p-4">
              <div className="flex items-center space-x-3">
                <Droplets className="w-5 h-5 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Water</p>
                  <p className="font-bold text-accent">{mockData.health.water}/8 cups</p>
                </div>
              </div>
            </Card>
            
            <Card className="glass-card p-4">
              <div className="flex items-center space-x-3">
                <Target className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Tasks</p>
                  <p className="font-bold text-primary">{mockData.productivity.tasksCompleted}/{mockData.productivity.totalTasks}</p>
                </div>
              </div>
            </Card>
            
            <Card className="glass-card p-4">
              <div className="flex items-center space-x-3">
                <DollarSign className="w-5 h-5 text-warning" />
                <div>
                  <p className="text-sm text-muted-foreground">Budget</p>
                  <p className="font-bold text-warning">{mockData.finance.budgetUsed}%</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Modules */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ModuleCard
              title="Calendar & Productivity"
              description="Manage events, meetings, and track your daily productivity"
              icon={Calendar}
              status="active"
              progress={Math.round((mockData.productivity.tasksCompleted / mockData.productivity.totalTasks) * 100)}
              onClick={() => onModuleSelect?.('calendar')}
            >
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Today's focus</span>
                <span className="text-primary font-medium">Deep Work Session</span>
              </div>
            </ModuleCard>

            <ModuleCard
              title="Health & Habits"
              description="Track sleep, water intake, exercise, and build healthy habits"
              icon={Heart}
              status="success"
              progress={Math.round(((mockData.health.sleep/8 + mockData.health.water/8) / 2) * 100)}
              onClick={() => onModuleSelect?.('health')}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Steps today</span>
                  <span className="text-accent font-medium">{mockData.health.steps.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Sleep quality</span>
                  <span className="text-secondary font-medium">Good</span>
                </div>
              </div>
            </ModuleCard>

            <ModuleCard
              title="Notes & Journal"
              description="Capture thoughts, daily reflections, and important notes"
              icon={FileText}
              status="neutral"
              onClick={() => onModuleSelect?.('notes')}
            >
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Last entry</span>
                <span className="text-foreground font-medium">2 hours ago</span>
              </div>
            </ModuleCard>

            <ModuleCard
              title="Bill Splitter"
              description="Smart group expense management and bill splitting"
              icon={Receipt}
              status="active"
              onClick={() => onModuleSelect?.('expenses')}
            >
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Pending splits</span>
                <span className="text-primary font-medium">{mockData.finance.splitBills} bills</span>
              </div>
            </ModuleCard>

            <ModuleCard
              title="Budget Assistant"
              description="AI-powered finance coaching and budget tracking"
              icon={TrendingUp}
              status={mockData.finance.budgetUsed > 80 ? 'warning' : 'success'}
              progress={mockData.finance.budgetUsed}
              onClick={() => onModuleSelect?.('budget')}
            >
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">This month</span>
                <span className={`font-medium ${mockData.finance.budgetUsed > 80 ? 'text-warning' : 'text-accent'}`}>
                  ${(2500 * mockData.finance.budgetUsed / 100).toFixed(0)} / $2500
                </span>
              </div>
            </ModuleCard>

            <ModuleCard
              title="Quick Actions"
              description="Rapid logging and instant updates"
              icon={Zap}
              status="active"
            >
              <div className="space-y-2">
                <Button size="sm" variant="outline" className="w-full text-left justify-start">
                  <Droplets className="w-4 h-4 mr-2" />
                  Log water intake
                </Button>
                <Button size="sm" variant="outline" className="w-full text-left justify-start">
                  <Clock className="w-4 h-4 mr-2" />
                  Start focus session
                </Button>
              </div>
            </ModuleCard>
          </div>
        </div>
      </section>
    </div>
  );
};