import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Receipt, Plus, Users, DollarSign, QrCode, ArrowUpDown, Clock } from 'lucide-react';

export const Bills = () => {
  const [newBillAmount, setNewBillAmount] = useState('');
  const [newBillDescription, setNewBillDescription] = useState('');

  const mockGroups = [
    { id: 1, name: 'Roommates', members: 4, activeExpenses: 3 },
    { id: 2, name: 'Trip Friends', members: 6, activeExpenses: 8 },
    { id: 3, name: 'Office Team', members: 12, activeExpenses: 2 },
  ];

  const mockBills = [
    {
      id: 1,
      description: 'Grocery Shopping',
      amount: 156.50,
      paidBy: 'You',
      group: 'Roommates',
      date: '2024-01-15',
      status: 'pending',
      participants: ['Alice', 'Bob', 'Charlie', 'You'],
      yourShare: 39.13
    },
    {
      id: 2,
      description: 'Dinner at Italian Restaurant',
      amount: 240.00,
      paidBy: 'Alice',
      group: 'Trip Friends',
      date: '2024-01-14',
      status: 'settled',
      participants: ['Alice', 'Bob', 'David', 'Emma', 'Frank', 'You'],
      yourShare: 40.00
    },
    {
      id: 3,
      description: 'Uber to Airport',
      amount: 45.00,
      paidBy: 'Bob',
      group: 'Trip Friends',
      date: '2024-01-13',
      status: 'pending',
      participants: ['Bob', 'You'],
      yourShare: 22.50
    },
    {
      id: 4,
      description: 'Netflix Subscription',
      amount: 15.99,
      paidBy: 'Charlie',
      group: 'Roommates',
      date: '2024-01-12',
      status: 'pending',
      participants: ['Alice', 'Bob', 'Charlie', 'You'],
      yourShare: 4.00
    }
  ];

  const settlements = [
    { from: 'You', to: 'Alice', amount: 42.50, status: 'pending' },
    { from: 'Bob', to: 'You', amount: 18.75, status: 'pending' },
    { from: 'Charlie', to: 'You', amount: 15.25, status: 'completed' }
  ];

  const totalOwed = settlements
    .filter(s => s.from === 'You' && s.status === 'pending')
    .reduce((sum, s) => sum + s.amount, 0);

  const totalOwedToYou = settlements
    .filter(s => s.to === 'You' && s.status === 'pending')
    .reduce((sum, s) => sum + s.amount, 0);

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
                    <p className="font-bold text-destructive">${totalOwed.toFixed(2)}</p>
                  </div>
                </div>
              </Card>

              <Card className="glass-card p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-accent/20">
                    <DollarSign className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Owed to You</p>
                    <p className="font-bold text-accent">${totalOwedToYou.toFixed(2)}</p>
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
                    <p className="font-bold text-primary">{mockBills.filter(b => b.status === 'pending').length}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-card p-6">
                <h2 className="text-xl font-semibold mb-4">Recent Bills</h2>
                <div className="space-y-3">
                  {mockBills.slice(0, 4).map((bill) => (
                    <div key={bill.id} className="flex items-center justify-between p-3 rounded-lg bg-background/20">
                      <div>
                        <p className="font-medium text-sm">{bill.description}</p>
                        <p className="text-xs text-muted-foreground">{bill.group} • {bill.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm">${bill.yourShare.toFixed(2)}</p>
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
                  <Button className="w-full neon-button">
                    <Plus className="w-4 h-4 mr-2" />
                    Create & Split Bill
                  </Button>
                </div>

                <div className="mt-6 pt-4 border-t border-border/50">
                  <h3 className="font-medium mb-3">Your Groups</h3>
                  <div className="space-y-2">
                    {mockGroups.map((group) => (
                      <div key={group.id} className="flex items-center justify-between text-sm">
                        <span>{group.name}</span>
                        <Badge variant="outline">{group.members} members</Badge>
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
              <Button className="neon-button">
                <Plus className="w-4 h-4 mr-2" />
                Add Bill
              </Button>
            </div>

            <div className="space-y-4">
              {mockBills.map((bill) => (
                <Card key={bill.id} className="glass-card p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">{bill.description}</h3>
                      <p className="text-sm text-muted-foreground">{bill.group} • {bill.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">${bill.amount.toFixed(2)}</p>
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
                    {bill.participants.map((participant, index) => (
                      <Badge key={index} variant="outline">
                        <Users className="w-3 h-3 mr-1" />
                        {participant}
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
              {mockGroups.map((group) => (
                <Card key={group.id} className="glass-card p-6 cursor-pointer hover:scale-[1.02] transition-transform">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 rounded-lg bg-primary/20">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{group.name}</h3>
                      <p className="text-sm text-muted-foreground">{group.members} members</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Active expenses</span>
                      <span className="font-medium">{group.activeExpenses}</span>
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
                      <p className="text-xl font-bold text-warning">${settlement.amount.toFixed(2)}</p>
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