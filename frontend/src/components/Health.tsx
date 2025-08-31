import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Heart, Droplets, Moon, Activity, Plus, Target, TrendingUp } from 'lucide-react';

export const Health = () => {
  const [waterCount, setWaterCount] = useState(6);
  const [sleepHours, setSleepHours] = useState(7.5);
  const [steps, setSteps] = useState(8432);

  const healthStats = {
    waterGoal: 8,
    sleepGoal: 8,
    stepsGoal: 10000,
    workoutStreak: 12,
    caloriesBurned: 245
  };

  const weeklyData = [
    { day: 'Mon', sleep: 7, water: 8, steps: 9500 },
    { day: 'Tue', sleep: 6.5, water: 6, steps: 7200 },
    { day: 'Wed', sleep: 8, water: 9, steps: 11000 },
    { day: 'Thu', sleep: 7.5, water: 7, steps: 8900 },
    { day: 'Fri', sleep: 6, water: 5, steps: 6800 },
    { day: 'Sat', sleep: 9, water: 8, steps: 12000 },
    { day: 'Sun', sleep: 8.5, water: 7, steps: 9200 },
  ];

  const habits = [
    { id: 1, name: 'Morning Meditation', streak: 15, completed: true },
    { id: 2, name: 'Evening Walk', streak: 8, completed: false },
    { id: 3, name: 'Vitamin D', streak: 22, completed: true },
    { id: 4, name: 'No Social Media Before Bed', streak: 5, completed: false },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">Health & Habits</h1>
          <p className="text-muted-foreground">Track your wellness journey and build healthy routines</p>
        </div>

        <Tabs defaultValue="today" className="space-y-6">
          <TabsList className="glass-card">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="habits">Habits</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Droplets className="w-6 h-6 text-accent" />
                    <div>
                      <p className="text-sm text-muted-foreground">Water</p>
                      <p className="font-bold text-accent">{waterCount}/{healthStats.waterGoal} cups</p>
                    </div>
                  </div>
                  <Button size="sm" onClick={() => setWaterCount(prev => Math.min(prev + 1, healthStats.waterGoal))}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <Progress value={(waterCount / healthStats.waterGoal) * 100} className="h-2" />
              </Card>

              <Card className="glass-card p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Moon className="w-6 h-6 text-secondary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Sleep</p>
                    <p className="font-bold text-secondary">{sleepHours}h</p>
                  </div>
                </div>
                <Progress value={(sleepHours / healthStats.sleepGoal) * 100} className="h-2" />
              </Card>

              <Card className="glass-card p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Activity className="w-6 h-6 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Steps</p>
                    <p className="font-bold text-primary">{steps.toLocaleString()}</p>
                  </div>
                </div>
                <Progress value={(steps / healthStats.stepsGoal) * 100} className="h-2" />
              </Card>

              <Card className="glass-card p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Heart className="w-6 h-6 text-destructive" />
                  <div>
                    <p className="text-sm text-muted-foreground">Calories</p>
                    <p className="font-bold text-destructive">{healthStats.caloriesBurned}</p>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">Burned today</div>
              </Card>
            </div>

            {/* Detailed Tracking */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-card p-6">
                <h2 className="text-xl font-semibold mb-4">Quick Log</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-background/20">
                    <span>Water Intake</span>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline" onClick={() => setWaterCount(prev => Math.max(prev - 1, 0))}>-</Button>
                      <span className="w-8 text-center">{waterCount}</span>
                      <Button size="sm" variant="outline" onClick={() => setWaterCount(prev => prev + 1)}>+</Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-background/20">
                    <span>Sleep Hours</span>
                    <Input
                      type="number"
                      value={sleepHours}
                      onChange={(e) => setSleepHours(parseFloat(e.target.value))}
                      className="w-20 glass-input"
                      step="0.5"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-background/20">
                    <span>Steps</span>
                    <Input
                      type="number"
                      value={steps}
                      onChange={(e) => setSteps(parseInt(e.target.value))}
                      className="w-24 glass-input"
                    />
                  </div>
                </div>
              </Card>

              <Card className="glass-card p-6">
                <h2 className="text-xl font-semibold mb-4">Health Score</h2>
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold gradient-text mb-2">8.2</div>
                  <p className="text-muted-foreground">Overall Health Score</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Hydration</span>
                    <span className="text-sm text-accent font-medium">Good</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Sleep Quality</span>
                    <span className="text-sm text-secondary font-medium">Excellent</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Activity Level</span>
                    <span className="text-sm text-primary font-medium">Active</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Consistency</span>
                    <span className="text-sm text-warning font-medium">Improving</span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="habits" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Daily Habits</h2>
                  <Button size="sm" className="neon-button">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Habit
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {habits.map((habit) => (
                    <div key={habit.id} className="flex items-center justify-between p-4 rounded-lg bg-background/20">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={habit.completed}
                          className="rounded border-border"
                        />
                        <div>
                          <p className="font-medium">{habit.name}</p>
                          <p className="text-sm text-muted-foreground">{habit.streak} day streak</p>
                        </div>
                      </div>
                      <Target className={`w-5 h-5 ${habit.completed ? 'text-accent' : 'text-muted-foreground'}`} />
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="glass-card p-6">
                <h2 className="text-xl font-semibold mb-4">Streak Stats</h2>
                <div className="space-y-4">
                  <div className="text-center p-4 rounded-lg bg-background/20">
                    <div className="text-3xl font-bold text-primary mb-1">🔥</div>
                    <div className="text-2xl font-bold text-primary">{healthStats.workoutStreak}</div>
                    <p className="text-sm text-muted-foreground">Day workout streak</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 rounded-lg bg-background/20">
                      <div className="text-xl font-bold text-accent">15</div>
                      <p className="text-xs text-muted-foreground">Water goal hits</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-background/20">
                      <div className="text-xl font-bold text-secondary">8</div>
                      <p className="text-xs text-muted-foreground">Sleep quality</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card className="glass-card p-6">
              <h2 className="text-xl font-semibold mb-6">Weekly Trends</h2>
              <div className="space-y-6">
                {['sleep', 'water', 'steps'].map((metric) => (
                  <div key={metric} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium capitalize">{metric}</span>
                      <TrendingUp className="w-4 h-4 text-accent" />
                    </div>
                    <div className="flex items-end space-x-2 h-20">
                      {weeklyData.map((day, index) => {
                        const value = day[metric as keyof typeof day] as number;
                        const maxValue = metric === 'steps' ? 12000 : metric === 'water' ? 10 : 10;
                        const height = (value / maxValue) * 100;
                        
                        return (
                          <div key={index} className="flex-1 flex flex-col items-center">
                            <div
                              className="w-full bg-primary/80 rounded-t"
                              style={{ height: `${height}%` }}
                            />
                            <span className="text-xs text-muted-foreground mt-1">{day.day}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};