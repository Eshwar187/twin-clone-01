import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar as CalendarIcon, Clock, Plus, Target, TrendingUp } from 'lucide-react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

export const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [newEvent, setNewEvent] = useState('');

  const mockEvents = [
    { id: 1, title: 'Team Meeting', time: '09:00', date: new Date(), type: 'work' },
    { id: 2, title: 'Gym Session', time: '18:00', date: new Date(), type: 'health' },
    { id: 3, title: 'Doctor Appointment', time: '14:30', date: new Date(), type: 'health' },
  ];

  const mockTasks = [
    { id: 1, title: 'Review project proposal', completed: false, priority: 'high' },
    { id: 2, title: 'Update portfolio website', completed: true, priority: 'medium' },
    { id: 3, title: 'Call insurance company', completed: false, priority: 'low' },
  ];

  const productivityStats = {
    tasksCompleted: 5,
    totalTasks: 8,
    focusTime: 4.5,
    meetings: 3
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">Calendar & Productivity</h1>
          <p className="text-muted-foreground">Manage your schedule and track productivity</p>
        </div>

        <Tabs defaultValue="calendar" className="space-y-6">
          <TabsList className="glass-card">
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="stats">Productivity</TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Calendar Component */}
              <Card className="glass-card p-6 lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Schedule</h2>
                  <Button size="sm" className="neon-button">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Event
                  </Button>
                </div>
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border-0"
                />
              </Card>

              {/* Today's Events */}
              <Card className="glass-card p-6">
                <h2 className="text-xl font-semibold mb-4">Today's Events</h2>
                <div className="space-y-3">
                  {mockEvents.map((event) => (
                    <div key={event.id} className="flex items-center space-x-3 p-3 rounded-lg bg-background/20">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{event.title}</p>
                        <p className="text-xs text-muted-foreground flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {event.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-border/50">
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Quick add event..."
                      value={newEvent}
                      onChange={(e) => setNewEvent(e.target.value)}
                      className="glass-input"
                    />
                    <Button size="sm" variant="outline">Add</Button>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Active Tasks</h2>
                  <Button size="sm" className="neon-button">
                    <Plus className="w-4 h-4 mr-2" />
                    New Task
                  </Button>
                </div>
                <div className="space-y-3">
                  {mockTasks.map((task) => (
                    <div key={task.id} className="flex items-center space-x-3 p-3 rounded-lg bg-background/20">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        className="rounded border-border"
                      />
                      <div className="flex-1">
                        <p className={`font-medium text-sm ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {task.title}
                        </p>
                        <p className={`text-xs ${
                          task.priority === 'high' ? 'text-destructive' :
                          task.priority === 'medium' ? 'text-warning' :
                          'text-muted-foreground'
                        }`}>
                          {task.priority} priority
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="glass-card p-6">
                <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Target className="w-4 h-4 mr-2" />
                    Start Focus Session
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Clock className="w-4 h-4 mr-2" />
                    Time Block Planning
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    Weekly Review
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="glass-card p-4">
                <div className="flex items-center space-x-3">
                  <Target className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Tasks</p>
                    <p className="font-bold text-primary">{productivityStats.tasksCompleted}/{productivityStats.totalTasks}</p>
                  </div>
                </div>
              </Card>
              
              <Card className="glass-card p-4">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-accent" />
                  <div>
                    <p className="text-sm text-muted-foreground">Focus Time</p>
                    <p className="font-bold text-accent">{productivityStats.focusTime}h</p>
                  </div>
                </div>
              </Card>
              
              <Card className="glass-card p-4">
                <div className="flex items-center space-x-3">
                  <CalendarIcon className="w-5 h-5 text-secondary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Meetings</p>
                    <p className="font-bold text-secondary">{productivityStats.meetings}</p>
                  </div>
                </div>
              </Card>
              
              <Card className="glass-card p-4">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-5 h-5 text-warning" />
                  <div>
                    <p className="text-sm text-muted-foreground">Efficiency</p>
                    <p className="font-bold text-warning">87%</p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};