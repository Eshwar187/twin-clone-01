import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const timezones = ['UTC', 'Asia/Kolkata', 'America/Los_Angeles', 'Europe/London'];
const currencies = ['USD', 'INR', 'EUR'];
const themes = ['system', 'light', 'dark'];

const Onboarding = () => {
  const navigate = useNavigate();
  const { markOnboardingComplete } = useAuth();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);

  // Profile
  const [name, setName] = useState('');
  const [timezone, setTimezone] = useState('UTC');
  const [currency, setCurrency] = useState('USD');

  // Preferences
  const [notifications, setNotifications] = useState(true);
  const [appearance, setAppearance] = useState('system');
  const [privacyPublicProfile, setPrivacyPublicProfile] = useState(false);

  const next = () => setStep((s) => Math.min(3, s + 1));
  const prev = () => setStep((s) => Math.max(1, s - 1));

  const saveProfile = async () => {
    setSaving(true);
    try {
      await Promise.all([
        api.patch('/user/profile', { name, timezone, currency }),
        api.patch('/user/preferences', { notifications, appearance, privacy: { publicProfile: privacyPublicProfile } }),
      ]);
      toast({ title: 'Saved', description: 'Profile and preferences saved.' });
      next();
    } catch (e: any) {
      toast({ title: 'Error', description: 'Failed to save. Please try again.', variant: 'destructive' as any });
    } finally {
      setSaving(false);
    }
  };

  const finish = async () => {
    setSaving(true);
    try {
      // Optionally confirm save again
      markOnboardingComplete();
      toast({ title: 'Welcome!', description: 'Setup complete.' });
      navigate('/');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold gradient-text mb-4">Let’s set up TWIN</h1>
        <p className="text-muted-foreground mb-6">Complete these quick steps to personalize your experience.</p>

        <Card className="glass-card p-6">
          <Tabs value={`step-${step}`}>
            <TabsList className="grid grid-cols-3 w-full mb-6">
              <TabsTrigger value="step-1">Profile</TabsTrigger>
              <TabsTrigger value="step-2">Preferences</TabsTrigger>
              <TabsTrigger value="step-3">Finish</TabsTrigger>
            </TabsList>

            <TabsContent value="step-1" className="space-y-4">
              <div>
                <label className="text-sm mb-1 block">Name</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm mb-1 block">Timezone</label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger><SelectValue placeholder="Select timezone" /></SelectTrigger>
                    <SelectContent>
                      {timezones.map((tz) => (
                        <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm mb-1 block">Currency</label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger><SelectValue placeholder="Select currency" /></SelectTrigger>
                    <SelectContent>
                      {currencies.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="secondary" onClick={next}>Skip</Button>
                <Button onClick={saveProfile} disabled={saving}>Save & Continue</Button>
              </div>
            </TabsContent>

            <TabsContent value="step-2" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm mb-1 block">Appearance</label>
                  <Select value={appearance} onValueChange={setAppearance}>
                    <SelectTrigger><SelectValue placeholder="Theme" /></SelectTrigger>
                    <SelectContent>
                      {themes.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm mb-1 block">Notifications</label>
                  <Select value={notifications ? 'on' : 'off'} onValueChange={(v) => setNotifications(v === 'on')}>
                    <SelectTrigger><SelectValue placeholder="Notifications" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="on">On</SelectItem>
                      <SelectItem value="off">Off</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-sm mb-1 block">Public profile</label>
                <Select value={privacyPublicProfile ? 'yes' : 'no'} onValueChange={(v) => setPrivacyPublicProfile(v === 'yes')}>
                  <SelectTrigger><SelectValue placeholder="Public profile" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={prev}>Back</Button>
                <Button onClick={next}>Continue</Button>
              </div>
            </TabsContent>

            <TabsContent value="step-3" className="space-y-4">
              <p className="text-muted-foreground">All set. You can change these anytime in Settings.</p>
              <div className="flex justify-between">
                <Button variant="outline" onClick={prev}>Back</Button>
                <Button onClick={finish} disabled={saving}>Finish</Button>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
