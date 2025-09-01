import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { useMood } from '@/context/MoodContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Receipt, Plus, Users, DollarSign, QrCode, ArrowUpDown, Clock } from 'lucide-react';
import { formatAmount } from '@/utils/currency';

export const Bills = () => {
  const [newBillAmount, setNewBillAmount] = useState('');
  const [newBillDescription, setNewBillDescription] = useState('');
  const [participantsInput, setParticipantsInput] = useState('You, Friend');
  const [showAddForm, setShowAddForm] = useState(false);
  const { setSignals } = useMood();

  // Backend wiring
  const getToken = () => localStorage.getItem('token') || localStorage.getItem('accessToken') || '';

  // Local state derived from backend (fallback to empty arrays)
  const [groups, setGroups] = useState<Array<{ id: string; name: string; members?: number; activeExpenses?: number }>>([]);
  const [bills, setBills] = useState<Array<any>>([]);
  const [settlements, setSettlements] = useState<Array<any>>([]);

  // Fetch initial data
  useEffect(() => {
    const token = getToken();
    if (!token) {
      toast({ title: 'Login required', description: 'Sign in to load your bills.', variant: 'destructive' as any });
      return;
    }
    // Groups
    api.get('/bills/groups')
      .then(r => r.json()).then(j => setGroups(j.data || [])).catch(() => {});
    // Bills
    api.get('/bills/bills')
      .then(r => r.json()).then(j => setBills(j.data || [])).catch(() => {});
    // Settlements
    api.get('/bills/settlements')
      .then(r => r.json()).then(j => setSettlements(j.data || [])).catch(() => {});
  }, []);

  // Create bill (Quick Split) - optimistic update
  const parseParticipants = (input: string): string[] => {
    const raw = (input || '').split(',').map((s) => s.trim()).filter(Boolean);
    // Always include You once
    const withoutYou = raw.filter((n) => n.toLowerCase() !== 'you');
    const list = ['You', ...withoutYou];
    // de-dup while preserving order
    return Array.from(new Set(list));
  };

  const handleCreateQuickBill = async () => {
    const amount = parseFloat(newBillAmount);
    if (!newBillDescription.trim() || isNaN(amount) || amount <= 0) return;
    const token = getToken();
    const names = parseParticipants(participantsInput);
    const count = Math.max(1, names.length);
    // Equal split with rounding fix
    const base = Math.floor((amount / count) * 100) / 100;
    const remainder = Number((amount - base * count).toFixed(2));
    const shares = names.map((n, i) => base + (i === 0 ? remainder : 0));
    const temp = {
      id: `tmp-${Date.now()}`,
      description: newBillDescription.trim(),
      amount,
      paidBy: 'You',
      group: (groups[0]?.name || 'Personal'),
      date: new Date().toISOString().slice(0, 10),
      status: 'pending',
      participants: names,
      yourShare: shares[names.indexOf('You')] ?? base
    } as any;
    setBills(prev => [temp, ...prev]);
    setNewBillAmount('');
    setNewBillDescription('');
    setParticipantsInput('You, Friend');

    if (!token) {
      toast({ title: 'Login required', description: 'Sign in to create a bill.', variant: 'destructive' as any });
      return;
    }
    const payload = {
      groupId: groups[0]?.id || 'demo',
      title: temp.description,
      description: temp.description,
      totalAmount: amount,
      participants: names.map((n, i) => ({ userId: n, amount: shares[i] })),
      category: 'general',
      date: new Date()
    };
    try {
      await api.post('/bills/bills', payload);
    } catch (_e) {
      // ignore; backend is mock; keep optimistic entry
    }
  };

  const totalOwed = settlements
    .filter(s => s.from === 'You' && s.status === 'pending')
    .reduce((sum, s) => sum + s.amount, 0);

  const totalOwedToYou = settlements
    .filter(s => s.to === 'You' && s.status === 'pending')
    .reduce((sum, s) => sum + s.amount, 0);

  // Push overdue bills count into mood engine
  useEffect(() => {
    const pendingBills = bills.filter(b => b.status === 'pending').length;
    const pendingSettlements = settlements.filter(s => s.status === 'pending').length;
    setSignals({ overdueBills: pendingBills + pendingSettlements });
  }, [bills, settlements, setSignals]);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">Bill Splitter</h1>
          <p className="text-muted-foreground">Smart group expense management and settlements</p>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="glass-card">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="bills">Bills</TabsTrigger>
            <TabsTrigger value="groups">Groups</TabsTrigger>
            <TabsTrigger value="settlements">Settlements</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Balance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="glass-card p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-destructive/20">
                    <ArrowUpDown className="w-5 h-5 text-destructive" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">You Owe</p>
                    <p className="font-bold text-destructive">{formatAmount(totalOwed)}</p>
                  </div>
                </div>
              </Card>

              <Card className="glass-card p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-accent/20">
                    <DollarSign className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Owed to You</div>
                    <p className="font-bold text-accent">{formatAmount(totalOwedToYou)}</p>
                  </div>
                </div>
              </Card>

              <Card className="glass-card p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <Receipt className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active Bills</p>
                    <p className="font-bold text-primary">{bills.filter(b => b.status === 'pending').length}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-card p-6">
                <h2 className="text-xl font-semibold mb-4">Recent Bills</h2>
                <div className="space-y-3">
                  {bills.slice(0, 4).map((bill) => (
                    <div key={bill.id} className="flex items-center justify-between p-3 rounded-lg bg-background/20">
                      <div>
                        <p className="font-medium text-sm">{bill.description}</p>
                        <p className="text-xs text-muted-foreground">{bill.group || bill.category || '—'} • {bill.date?.slice?.(0,10) || ''}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm">{formatAmount(Number((bill.yourShare ?? bill.amount)) || Number(bill.amount) || 0)}</p>
                        <Badge variant={bill.status === 'settled' ? 'default' : 'secondary'} className="text-xs">
                          {bill.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="glass-card p-6">
                <h2 className="text-xl font-semibold mb-4">Quick Split</h2>
                <div className="space-y-4">
                  <Input
                    placeholder="Bill description (e.g., Dinner at Pizza Place)"
                    value={newBillDescription}
                    onChange={(e) => setNewBillDescription(e.target.value)}
                    className="glass-input"
                  />
                  <Input
                    type="number"
                    placeholder="Total amount"
                    value={newBillAmount}
                    onChange={(e) => setNewBillAmount(e.target.value)}
                    className="glass-input"
                  />
                  <Input
                    placeholder="Participants (comma separated): You, Alice, Bob"
                    value={participantsInput}
                    onChange={(e) => setParticipantsInput(e.target.value)}
                    className="glass-input"
                  />
                  <Button className="w-full neon-button" onClick={handleCreateQuickBill}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create & Split Bill
                  </Button>
                </div>

                <div className="mt-6 pt-4 border-t border-border/50">
                  <h3 className="font-medium mb-3">Your Groups</h3>
                  <div className="space-y-2">
                    {groups.map((group) => (
                      <div key={group.id} className="flex items-center justify-between text-sm">
                        <span>{group.name}</span>
                        {group.members ? <Badge variant="outline">{group.members} members</Badge> : null}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bills" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">All Bills</h2>
              <Button className="neon-button" onClick={() => setShowAddForm((v) => !v)}>
                <Plus className="w-4 h-4 mr-2" />
                {showAddForm ? 'Close' : 'Add Bill'}
              </Button>
            </div>

            {showAddForm && (
              <Card className="glass-card p-6">
                <h3 className="font-semibold mb-4">Create Bill</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    placeholder="Description"
                    value={newBillDescription}
                    onChange={(e) => setNewBillDescription(e.target.value)}
                    className="glass-input"
                  />
                  <Input
                    type="number"
                    placeholder="Amount"
                    value={newBillAmount}
                    onChange={(e) => setNewBillAmount(e.target.value)}
                    className="glass-input"
                  />
                  <Input
                    placeholder="Participants: You, Alice, Bob"
                    value={participantsInput}
                    onChange={(e) => setParticipantsInput(e.target.value)}
                    className="glass-input"
                  />
                </div>
                <div className="mt-4 flex justify-end">
                  <Button onClick={async () => { await handleCreateQuickBill(); setShowAddForm(false); }}>Save Bill</Button>
                </div>
              </Card>
            )}

            <div className="space-y-4">
              {bills.map((bill) => (
                <Card key={bill.id} className="glass-card p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">{bill.description || bill.title}</h3>
                      <p className="text-sm text-muted-foreground">{bill.group || bill.category || '—'} • {bill.date?.slice?.(0,10) || ''}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{formatAmount(Number(bill.amount || bill.totalAmount) || 0)}</p>
                      <p className="text-sm text-muted-foreground">Paid by {bill.paidBy}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Your share</span>
                      <span className="font-medium">${bill.yourShare.toFixed(2)}</span>
                    </div>
                    <Progress value={(bill.yourShare / bill.amount) * 100} className="h-2" />
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {(bill.participants || []).map((participant: any, index: number) => (
                      <Badge key={index} variant="outline">
                        <Users className="w-3 h-3 mr-1" />
                        {participant.name || participant.userId || participant}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge variant={bill.status === 'settled' ? 'default' : 'secondary'}>
                      {bill.status}
                    </Badge>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline">
                        <QrCode className="w-4 h-4 mr-2" />
                        QR Pay
                      </Button>
                      <Button size="sm" variant="outline">Edit</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="groups" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Your Groups</h2>
              <Button className="neon-button">
                <Plus className="w-4 h-4 mr-2" />
                Create Group
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groups.map((group) => (
                <Card key={group.id} className="glass-card p-6 cursor-pointer hover:scale-[1.02] transition-transform">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 rounded-lg bg-primary/20">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{group.name}</h3>
                      {group.members ? (
                        <p className="text-sm text-muted-foreground">{group.members} members</p>
                      ) : null}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Active expenses</span>
                      <span className="font-medium">{group.activeExpenses ?? 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total this month</span>
                      <span className="font-medium">$456.78</span>
                    </div>
                  </div>

                  <Button className="w-full mt-4" variant="outline">
                    View Details
                  </Button>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settlements" className="space-y-6">
            <h2 className="text-xl font-semibold">Pending Settlements</h2>
            
            <div className="space-y-4">
              {settlements.filter(s => s.status === 'pending').map((settlement, index) => (
                <Card key={index} className="glass-card p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-lg bg-warning/20">
                        <Clock className="w-5 h-5 text-warning" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {settlement.from === 'You' ? 'You owe' : `${settlement.from} owes you`}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {settlement.from === 'You' ? settlement.to : settlement.from}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-xl font-bold text-warning">{formatAmount(settlement.amount)}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Button size="sm" variant="outline">
                          <QrCode className="w-4 h-4 mr-2" />
                          Pay Now
                        </Button>
                        <Button size="sm" variant="outline">Remind</Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Settlement History</h3>
              <div className="space-y-3">
                {settlements.filter(s => s.status === 'completed').map((settlement, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-background/20">
                    <div>
                      <p className="font-medium text-sm">
                        {settlement.from === 'You' ? 'You paid' : `${settlement.from} paid you`} ${settlement.amount.toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {settlement.from === 'You' ? `to ${settlement.to}` : ''}
                      </p>
                    </div>
                    <Badge variant="default" className="text-xs">Completed</Badge>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};