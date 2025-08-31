import { useEffect, useMemo, useState } from 'react';
import { useMood } from '@/context/MoodContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar as CalendarIcon, Clock, Plus, Target, TrendingUp } from 'lucide-react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

export const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [newEvent, setNewEvent] = useState('');
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL as string | undefined;
  const getToken = () => localStorage.getItem('token') || localStorage.getItem('accessToken') || '';
  const { setSignals } = useMood();

  const fetchEvents = async (start?: Date, end?: Date) => {
    const token = getToken();
    if (!API_URL || !token) return;
    const params = new URLSearchParams();
    if (start) params.set('start', start.toISOString());
    if (end) params.set('end', end.toISOString());
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/calendar/events?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (res.ok) setEvents(json.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load current month range on mount and when selected month changes
    const base = selectedDate || new Date();
    const start = new Date(base.getFullYear(), base.getMonth(), 1);
    const end = new Date(base.getFullYear(), base.getMonth() + 1, 0, 23, 59, 59, 999);
    fetchEvents(start, end);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate?.getFullYear(), selectedDate?.getMonth()]);

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

  const todaysEvents = useMemo(() => {
    if (!selectedDate) return [] as any[];
    const y = selectedDate.getFullYear();
    const m = selectedDate.getMonth();
    const d = selectedDate.getDate();
    return events.filter((e) => {
      const start = new Date(e.startTime);
      return (
        start.getFullYear() === y &&
        start.getMonth() === m &&
        start.getDate() === d
      );
    }).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }, [events, selectedDate]);

  // Feed schedule and todo signals
  useEffect(() => {
    const eventsCount = todaysEvents.length;
    setSignals({ eventsToday: eventsCount });
  }, [todaysEvents.length, setSignals]);

  const addQuickEvent = async () => {
    const token = getToken();
    if (!API_URL || !token || !selectedDate || !newEvent.trim()) return;
    // Default 1-hour block starting at 09:00 of selected day
    const start = new Date(selectedDate);
    start.setHours(9, 0, 0, 0);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    const payload = { title: newEvent.trim(), startTime: start, endTime: end, allDay: false, category: 'personal', attendees: [] };
    const res = await fetch(`${API_URL}/calendar/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      setNewEvent('');
      // Refresh events for the same range
      const base = selectedDate || new Date();
      const startRange = new Date(base.getFullYear(), base.getMonth(), 1);
      const endRange = new Date(base.getFullYear(), base.getMonth() + 1, 0, 23, 59, 59, 999);
      fetchEvents(startRange, endRange);
    }
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
                  {loading && <div className="text-xs text-muted-foreground">Loading...</div>}
                  {!loading && todaysEvents.length === 0 && (
                    <div className="text-xs text-muted-foreground">No events</div>
                  )}
                  {todaysEvents.map((event) => (
                    <div key={event._id} className="flex items-center space-x-3 p-3 rounded-lg bg-background/20">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{event.title}</p>
                        <p className="text-xs text-muted-foreground flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                    <Button size="sm" variant="outline" onClick={addQuickEvent} disabled={!newEvent.trim()}>Add</Button>
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