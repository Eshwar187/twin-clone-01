import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export type AvatarState = 'happy' | 'stressed' | 'calm' | 'tired' | 'energetic';

interface AvatarProps {
  state: AvatarState;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  name?: string;
  showCaption?: boolean;
}

const avatarEmojis = {
  happy: '😊',
  stressed: '😰',
  calm: '😌',
  tired: '😴',
  energetic: '⚡'
};

const sizeClasses = {
  sm: 'w-12 h-12 text-2xl',
  md: 'w-16 h-16 text-3xl',
  lg: 'w-24 h-24 text-5xl',
  xl: 'w-32 h-32 text-7xl'
};

export const Avatar = ({ state, size = 'lg', className, name = 'Alex', showCaption = true }: AvatarProps) => {
  const [currentState, setCurrentState] = useState<AvatarState>(state);

  useEffect(() => {
    setCurrentState(state);
  }, [state]);

  return (
    <div className="flex flex-col items-center space-y-3">
      <div
        className={cn(
          'relative rounded-full border-2 border-border/20 backdrop-blur-sm',
          'flex items-center justify-center transition-all duration-500',
          `avatar-${currentState}`,
          'animate-float glass-card',
          sizeClasses[size],
          className
        )}
        style={{
          background: `radial-gradient(circle, hsl(var(--avatar-${currentState}) / 0.1), transparent)`
        }}
      >
        <span className="text-center select-none">
          {avatarEmojis[currentState]}
        </span>
        
        {/* Animated ring */}
        <div 
          className={cn(
            'absolute inset-0 rounded-full border-2 opacity-50 animate-pulse',
            currentState === 'happy' && 'border-avatar-happy',
            currentState === 'stressed' && 'border-avatar-stressed',
            currentState === 'calm' && 'border-avatar-calm',
            currentState === 'tired' && 'border-avatar-tired',
            currentState === 'energetic' && 'border-avatar-energetic'
          )}
        />
      </div>
      
      {showCaption && (
        <div className="text-center">
          <p className="text-foreground font-medium">{name}</p>
          <p className="text-muted-foreground text-sm capitalize font-mono">
            {currentState}
          </p>
        </div>
      )}
    </div>
  );
};