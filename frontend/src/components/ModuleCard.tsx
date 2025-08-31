import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface ModuleCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  children?: ReactNode;
  className?: string;
  progress?: number;
  status?: 'active' | 'warning' | 'success' | 'neutral';
  onClick?: () => void;
}

export const ModuleCard = ({
  title,
  description,
  icon: Icon,
  children,
  className,
  progress,
  status = 'neutral',
  onClick
}: ModuleCardProps) => {
  return (
    <Card 
      className={cn(
        'glass-card p-6 cursor-pointer transition-all duration-300',
        'hover:scale-[1.02] hover:shadow-neon group',
        onClick && 'hover:border-primary/50',
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={cn(
            'p-2 rounded-lg transition-colors',
            status === 'active' && 'bg-primary/20 text-primary',
            status === 'warning' && 'bg-warning/20 text-warning',
            status === 'success' && 'bg-accent/20 text-accent',
            status === 'neutral' && 'bg-muted/50 text-muted-foreground'
          )}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {title}
            </h3>
          </div>
        </div>
        
        {progress !== undefined && (
          <div className="text-right">
            <div className="text-xs text-muted-foreground font-mono">
              {Math.round(progress)}%
            </div>
          </div>
        )}
      </div>
      
      <p className="text-muted-foreground text-sm mb-4">
        {description}
      </p>
      
      {progress !== undefined && (
        <div className="w-full bg-muted/30 rounded-full h-2 mb-4">
          <div 
            className={cn(
              'h-2 rounded-full transition-all duration-500',
              status === 'active' && 'bg-gradient-to-r from-primary to-secondary',
              status === 'warning' && 'bg-warning',
              status === 'success' && 'bg-accent',
              status === 'neutral' && 'bg-muted-foreground'
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      
      {children && (
        <div className="space-y-2">
          {children}
        </div>
      )}
    </Card>
  );
};