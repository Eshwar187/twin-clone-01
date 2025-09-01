import { Button } from '@/components/ui/button';
import { Avatar } from './Avatar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useMood } from '@/context/MoodContext';
import { 
  Brain, 
  Zap,
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
  onModuleChange
}: HeaderProps) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { mood } = useMood();
  const authed = !!localStorage.getItem('token');
  const userName = (() => {
    try { return JSON.parse(localStorage.getItem('user') || '{}')?.name || 'User'; } catch { return 'User'; }
  })();
  return (
    <header className="sticky top-0 z-50 glass-card border-b border-border/50 backdrop-blur-xl">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Branding */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-fuchsia-500 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold gradient-text">
                TWIN
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

          {/* Auth & Actions */}
          <div className="flex items-center space-x-4">
            {!authed ? (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>Login</Button>
                <Button size="sm" onClick={() => navigate('/register')}>Sign up</Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => onModuleChange?.('settings')}>
                  <Settings className="w-4 h-4" />
                </Button>
                <Avatar state={mood} size="sm" name={userName} showCaption={false} />
                <Button variant="outline" size="sm" onClick={() => { logout(); navigate('/login'); }}>Logout</Button>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};