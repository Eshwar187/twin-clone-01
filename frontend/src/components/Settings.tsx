import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar as AvatarComponent, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Database, 
  Download,
  Trash2,
  Eye,
  EyeOff,
  Moon,
  Sun
} from 'lucide-react';

export const Settings = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    healthReminders: true,
    budgetAlerts: true,
    billReminders: true
  });

  const [profile, setProfile] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    timezone: 'America/New_York',
    currency: 'USD'
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: 'private',
    dataSharing: false,
    analytics: true,
    crashReporting: true
  });

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">Settings</h1>
          <p className="text-muted-foreground">Customize your Digital Doppelgänger experience</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="glass-card grid w-full grid-cols-5">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card className="glass-card p-6">
              <div className="flex items-center space-x-6 mb-6">
                <AvatarComponent className="w-20 h-20">
                  <AvatarImage src="/placeholder.svg" alt="Profile" />
                  <AvatarFallback className="text-lg font-bold">AJ</AvatarFallback>
                </AvatarComponent>
                <div className="space-y-2">
                  <Button variant="outline">Change Avatar</Button>
                  <p className="text-sm text-muted-foreground">Recommended: 256x256px</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    className="glass-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    className="glass-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input
                    id="timezone"
                    value={profile.timezone}
                    onChange={(e) => setProfile({...profile, timezone: e.target.value})}
                    className="glass-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Preferred Currency</Label>
                  <Input
                    id="currency"
                    value={profile.currency}
                    onChange={(e) => setProfile({...profile, currency: e.target.value})}
                    className="glass-input"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mt-6 pt-6 border-t border-border/50">
                <div>
                  <h3 className="font-semibold">Account Status</h3>
                  <p className="text-sm text-muted-foreground">Premium Member since Jan 2024</p>
                </div>
                <Button variant="outline">Manage Subscription</Button>
              </div>
            </Card>

            <Card className="glass-card p-6">
              <h3 className="font-semibold mb-4">Health Profile</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sleepGoal">Sleep Goal (hours)</Label>
                  <Input id="sleepGoal" type="number" defaultValue="8" className="glass-input" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="waterGoal">Water Goal (cups)</Label>
                  <Input id="waterGoal" type="number" defaultValue="8" className="glass-input" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stepsGoal">Steps Goal</Label>
                  <Input id="stepsGoal" type="number" defaultValue="10000" className="glass-input" />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card className="glass-card p-6">
              <h3 className="font-semibold mb-6">Notification Preferences</h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-muted-foreground">Receive updates via email</p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Push Notifications</h4>
                    <p className="text-sm text-muted-foreground">Browser notifications</p>
                  </div>
                  <Switch
                    checked={notifications.push}
                    onCheckedChange={(checked) => setNotifications({...notifications, push: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Health Reminders</h4>
                    <p className="text-sm text-muted-foreground">Water, sleep, and exercise reminders</p>
                  </div>
                  <Switch
                    checked={notifications.healthReminders}
                    onCheckedChange={(checked) => setNotifications({...notifications, healthReminders: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Budget Alerts</h4>
                    <p className="text-sm text-muted-foreground">Spending limit warnings</p>
                  </div>
                  <Switch
                    checked={notifications.budgetAlerts}
                    onCheckedChange={(checked) => setNotifications({...notifications, budgetAlerts: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Bill Reminders</h4>
                    <p className="text-sm text-muted-foreground">Upcoming bills and settlements</p>
                  </div>
                  <Switch
                    checked={notifications.billReminders}
                    onCheckedChange={(checked) => setNotifications({...notifications, billReminders: checked})}
                  />
                </div>
              </div>
            </Card>

            <Card className="glass-card p-6">
              <h3 className="font-semibold mb-4">Notification Schedule</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quietStart">Quiet Hours Start</Label>
                  <Input id="quietStart" type="time" defaultValue="22:00" className="glass-input" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quietEnd">Quiet Hours End</Label>
                  <Input id="quietEnd" type="time" defaultValue="07:00" className="glass-input" />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <Card className="glass-card p-6">
              <h3 className="font-semibold mb-6">Appearance Settings</h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                    <div>
                      <h4 className="font-medium">Dark Mode</h4>
                      <p className="text-sm text-muted-foreground">Toggle dark/light theme</p>
                    </div>
                  </div>
                  <Switch
                    checked={darkMode}
                    onCheckedChange={setDarkMode}
                  />
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Avatar Mood Settings</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {['Happy', 'Calm', 'Energetic', 'Tired', 'Stressed', 'Focused'].map((mood) => (
                      <Button key={mood} variant="outline" className="h-auto py-3">
                        <div className="text-center">
                          <div className="text-2xl mb-1">😊</div>
                          <div className="text-sm">{mood}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Color Scheme</h4>
                  <div className="grid grid-cols-4 gap-3">
                    {['Default', 'Blue', 'Green', 'Purple'].map((color) => (
                      <Button key={color} variant="outline" className="h-16">
                        <div className="w-8 h-8 rounded-full bg-primary"></div>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="glass-card p-6">
              <h3 className="font-semibold mb-4">Display Preferences</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fontSize">Font Size</Label>
                  <select className="w-full p-2 rounded-lg bg-background/50 border border-border/50">
                    <option>Small</option>
                    <option selected>Medium</option>
                    <option>Large</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <select className="w-full p-2 rounded-lg bg-background/50 border border-border/50">
                    <option selected>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                  </select>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <Card className="glass-card p-6">
              <h3 className="font-semibold mb-6">Privacy Settings</h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Data Sharing</h4>
                    <p className="text-sm text-muted-foreground">Share anonymized data for insights</p>
                  </div>
                  <Switch
                    checked={privacy.dataSharing}
                    onCheckedChange={(checked) => setPrivacy({...privacy, dataSharing: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Analytics</h4>
                    <p className="text-sm text-muted-foreground">Help improve the app with usage data</p>
                  </div>
                  <Switch
                    checked={privacy.analytics}
                    onCheckedChange={(checked) => setPrivacy({...privacy, analytics: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Crash Reporting</h4>
                    <p className="text-sm text-muted-foreground">Send crash reports to improve stability</p>
                  </div>
                  <Switch
                    checked={privacy.crashReporting}
                    onCheckedChange={(checked) => setPrivacy({...privacy, crashReporting: checked})}
                  />
                </div>
              </div>
            </Card>

            <Card className="glass-card p-6">
              <h3 className="font-semibold mb-4">Account Security</h3>
              <div className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Eye className="w-4 h-4 mr-2" />
                  Two-Factor Authentication
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <User className="w-4 h-4 mr-2" />
                  Connected Accounts
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="space-y-6">
            <Card className="glass-card p-6">
              <h3 className="font-semibold mb-6">Data Management</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-background/20">
                  <div>
                    <h4 className="font-medium">Export Data</h4>
                    <p className="text-sm text-muted-foreground">Download all your data in JSON format</p>
                  </div>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-background/20">
                  <div>
                    <h4 className="font-medium">Sync Data</h4>
                    <p className="text-sm text-muted-foreground">Backup and sync across devices</p>
                  </div>
                  <Button variant="outline">
                    <Database className="w-4 h-4 mr-2" />
                    Sync Now
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-destructive/10">
                  <div>
                    <h4 className="font-medium text-destructive">Delete Account</h4>
                    <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                  </div>
                  <Button variant="destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="glass-card p-6">
              <h3 className="font-semibold mb-4">Storage Usage</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Health Data</span>
                  <span className="text-sm text-muted-foreground">2.3 MB</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Notes & Journal</span>
                  <span className="text-sm text-muted-foreground">1.8 MB</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Financial Data</span>
                  <span className="text-sm text-muted-foreground">0.9 MB</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Calendar Events</span>
                  <span className="text-sm text-muted-foreground">0.4 MB</span>
                </div>
                <div className="pt-2 border-t border-border/50">
                  <div className="flex justify-between items-center font-medium">
                    <span>Total Storage</span>
                    <span>5.4 MB</span>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex justify-end space-x-4">
          <Button variant="outline">Cancel</Button>
          <Button className="neon-button">Save Changes</Button>
        </div>
      </div>
    </div>
  );
};