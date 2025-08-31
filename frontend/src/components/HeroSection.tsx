import { Avatar } from './Avatar';
import { useMood } from '@/context/MoodContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Zap, Brain, Heart, TrendingUp } from 'lucide-react';
import heroImage from '@/assets/hero-avatar.jpg';

interface HeroSectionProps {
  currentTime: Date;
  onQuickAction?: (action: string) => void;
}

export const HeroSection = ({ currentTime, onQuickAction }: HeroSectionProps) => {
  const greeting = currentTime.getHours() < 12 ? 'Morning' : currentTime.getHours() < 18 ? 'Afternoon' : 'Evening';
  const userName = (() => {
    try { return JSON.parse(localStorage.getItem('user') || '{}')?.name || 'User'; } catch { return 'User'; }
  })();
  const { mood } = useMood();
  
  return (
    <section className="relative py-16 px-6 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 opacity-20">
        <img 
          src={heroImage} 
          alt="Digital Avatar Interface" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/80 to-transparent" />
      </div>
      
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Avatar & Welcome */}
          <div className="text-center lg:text-left space-y-6">
            <div className="flex justify-center lg:justify-start">
              <Avatar state={mood} size="xl" name={userName} />
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold">
                <span className="gradient-text">Good {greeting}!</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                {currentTime.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              <p className="text-lg text-muted-foreground max-w-md">
                Your AI companion is here to help optimize your lifestyle, health, and finances.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <Button 
                onClick={() => onQuickAction?.('focus')}
                className="bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 neon-glow"
              >
                <Zap className="w-4 h-4 mr-2" />
                Start Focus Session
              </Button>
              <Button 
                variant="outline" 
                onClick={() => onQuickAction?.('log')}
                className="border-secondary/30 text-secondary hover:bg-secondary/10"
              >
                <Heart className="w-4 h-4 mr-2" />
                Quick Log
              </Button>
            </div>
          </div>

          {/* Right Side - Stats Cards */}
          <div className="space-y-4">
            <Card className="glass-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold gradient-text">Digital Twin Status</h3>
                  <p className="text-muted-foreground">Your AI is learning and adapting</p>
                </div>
                <Brain className="w-8 h-8 text-primary animate-pulse" />
              </div>
            </Card>
            
            <div className="grid grid-cols-2 gap-4">
              <Card className="glass-card p-4 text-center">
                <Heart className="w-6 h-6 text-accent mx-auto mb-2" />
                <div className="text-2xl font-bold text-accent">7.5</div>
                <div className="text-xs text-muted-foreground">Wellness Score</div>
              </Card>
              
              <Card className="glass-card p-4 text-center">
                <TrendingUp className="w-6 h-6 text-warning mx-auto mb-2" />
                <div className="text-2xl font-bold text-warning">68%</div>
                <div className="text-xs text-muted-foreground">Budget Used</div>
              </Card>
            </div>

            <Card className="glass-card p-4">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">Today's Focus</p>
                <p className="font-semibold text-primary">Complete Health Tracking Setup</p>
                <div className="w-full bg-muted/30 rounded-full h-2">
                  <div className="w-3/4 h-2 bg-gradient-primary rounded-full"></div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};