import { Button } from '@/components/ui/button';
import { Avatar } from './Avatar';
import { 
  Brain, 
  Calendar, 
  Heart, 
  FileText, 
  Receipt, 
  TrendingUp,
  Menu,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  currentModule?: string;
  onModuleChange?: (module: string) => void;
  avatarState?: 'happy' | 'stressed' | 'calm' | 'tired' | 'energetic';
}

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Brain },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'health', label: 'Health', icon: Heart },
  { id: 'notes', label: 'Notes', icon: FileText },
  { id: 'expenses', label: 'Bills', icon: Receipt },
  { id: 'budget', label: 'Budget', icon: TrendingUp },
];

export const Header = ({ 
  currentModule = 'dashboard', 
  onModuleChange,
  avatarState = 'calm'
}: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 glass-card border-b border-border/50 backdrop-blur-xl">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Branding */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold gradient-text">
                Digital Twin
              </h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Button
                key={item.id}
                variant={currentModule === item.id ? "default" : "ghost"}
                size="sm"
                onClick={() => onModuleChange?.(item.id)}
                className={cn(
                  'relative transition-all duration-200',
                  currentModule === item.id && 'bg-primary/20 text-primary neon-glow'
                )}
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.label}
              </Button>
            ))}
          </nav>

          {/* Avatar & Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
            <Avatar state={avatarState} size="sm" />
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};