import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { useMood } from '@/context/MoodContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { formatAmount } from '@/utils/currency';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Car, 
  Home, 
  Coffee, 
  Plus, 
  AlertTriangle,
  Target,
  PieChart
} from 'lucide-react';

export const Budget = () => {
  const [newExpenseAmount, setNewExpenseAmount] = useState('');
  const [newExpenseCategory, setNewExpenseCategory] = useState('');
  const { setSignals } = useMood();

  // ZERO defaults for new accounts
  const [budgetData, setBudgetData] = useState({
    totalBudget: 0,
    totalSpent: 0,
    categories: [] as Array<{ name: string; budget: number; spent: number; icon: any; color: string }>,
  });

  const [recentExpenses, setRecentExpenses] = useState<Array<{ id: string | number; description: string; amount: number; category: string; date: string }>>([]);
  const [loading, setLoading] = useState(false);
  const getToken = () => localStorage.getItem('token') || localStorage.getItem('accessToken') || '';

  // Optionally show empty insights for new users
  const insights: Array<{ type: 'warning' | 'success' | 'tip'; title: string; message: string; action: string }> = [];

  const budgetPercentage = budgetData.totalBudget > 0
    ? (budgetData.totalSpent / budgetData.totalBudget) * 100
    : 0;

  // Load budget from backend (if available). Keeps zeros for new users.
  useEffect(() => {
    const token = getToken();
    if (!token) return; // guarded by ProtectedRoute, but keep safe
    (async () => {
      setLoading(true);
      try {
        // These endpoints are hypothetical; if backend 404s, we keep zeros.
        const [sumRes, catRes, expRes] = await Promise.allSettled([
          api.get('/budget/summary'),
          api.get('/budget/categories'),
          api.get('/budget/expenses?limit=5'),
        ]);

        if (sumRes.status === 'fulfilled' && sumRes.value.ok) {
          const j = await sumRes.value.json();
          const summary = j?.data || {};
          setBudgetData(prev => ({ ...prev, totalBudget: summary.totalBudget || 0, totalSpent: summary.totalSpent || 0 }));
        }
        if (catRes.status === 'fulfilled' && catRes.value.ok) {
          const j = await catRes.value.json();
          const cats = (j?.data || []).map((c: any) => ({
            name: c.name,
            budget: c.budget || 0,
            spent: c.spent || 0,
            icon: (c.icon === 'Car' ? Car : c.icon === 'Home' ? Home : c.icon === 'ShoppingCart' ? ShoppingCart : Coffee),
            color: c.color || 'text-primary',
          }));
          setBudgetData(prev => ({ ...prev, categories: cats }));
        }
        if (expRes.status === 'fulfilled' && expRes.value.ok) {
          const j = await expRes.value.json();
          const exps = (j?.data || []).map((e: any, idx: number) => ({
            id: e.id || idx,
            description: e.description || 'Expense',
            amount: e.amount || 0,
            category: e.category || 'General',
            date: e.date || new Date().toISOString().slice(0, 10),
          }));
          setRecentExpenses(exps);
        }
      } catch {
        // keep zeros
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Push finance signal to mood engine
  useEffect(() => {
    setSignals({ budgetUsed: budgetPercentage });
  }, [budgetPercentage, setSignals]);

  const handleQuickAdd = async () => {
    const token = getToken();
    if (!token) {
      toast({ title: 'Login required', description: 'Sign in to add expenses.', variant: 'destructive' as any });
      return;
    }
    const amount = parseFloat(newExpenseAmount);
    if (!newExpenseCategory.trim() || isNaN(amount) || amount <= 0) return;
    const payload = { description: newExpenseCategory.trim(), amount, category: newExpenseCategory.trim(), date: new Date().toISOString() };
    try {
      const res = await api.post('/budget/expenses', payload);
      if (res.ok) {
        setRecentExpenses(prev => [{ id: `tmp-${Date.now()}`, ...payload }, ...prev].slice(0, 5));
        setNewExpenseAmount('');
        setNewExpenseCategory('');
        // Optionally update totals locally
        setBudgetData(prev => ({ ...prev, totalSpent: (prev.totalSpent || 0) + amount }));
      }
    } catch {
      // No-op; if endpoint doesn't exist, we simply do nothing
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">Budget Assistant</h1>
          <p className="text-muted-foreground">AI-powered finance coaching and budget tracking</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="glass-card">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Budget Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="glass-card p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <DollarSign className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Monthly Budget</p>
                    <p className="font-bold text-primary">{formatAmount(budgetData.totalBudget)}</p>
                  </div>
                </div>
              </Card>

              <Card className="glass-card p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-destructive/20">
                    <TrendingUp className="w-5 h-5 text-destructive" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                    <p className="font-bold text-destructive">{formatAmount(budgetData.totalSpent)}</p>
                  </div>
                </div>
              </Card>

              <Card className="glass-card p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-accent/20">
                    <Target className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Remaining</p>
                    <p className="font-bold text-accent">{formatAmount(budgetData.totalBudget - budgetData.totalSpent)}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Budget Progress */}
            <Card className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Monthly Progress</h2>
                <Badge variant={budgetPercentage > 90 ? 'destructive' : budgetPercentage > 75 ? 'secondary' : 'default'}>
                  {budgetPercentage.toFixed(1)}% used
                </Badge>
              </div>
              <Progress value={budgetPercentage} className="h-4 mb-2" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{formatAmount(budgetData.totalSpent)} spent</span>
                <span>{formatAmount(budgetData.totalBudget)} budget</span>
              </div>
            </Card>

            {/* Category Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-card p-6">
                <h2 className="text-xl font-semibold mb-4">Category Breakdown</h2>
                <div className="space-y-4">
                  {budgetData.categories.slice(0, 4).map((category) => {
                    const percentage = (category.spent / category.budget) * 100;
                    const Icon = category.icon;
                    
                    return (
                      <div key={category.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Icon className={`w-4 h-4 ${category.color}`} />
                            <span className="text-sm font-medium">{category.name}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {formatAmount(category.spent)} / {formatAmount(category.budget)}
                          </span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </Card>

              <Card className="glass-card p-6">
                <h2 className="text-xl font-semibold mb-4">Quick Add Expense</h2>
                <div className="space-y-4">
                  <Input
                    placeholder="What did you spend on?"
                    value={newExpenseCategory}
                    onChange={(e) => setNewExpenseCategory(e.target.value)}
                    className="glass-input"
                  />
                  <Input
                    type="number"
                    placeholder="Amount ($)"
                    value={newExpenseAmount}
                    onChange={(e) => setNewExpenseAmount(e.target.value)}
                    className="glass-input"
                  />
                  <Button className="w-full neon-button" onClick={handleQuickAdd} disabled={loading}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Expense
                  </Button>
                </div>

                <div className="mt-6 pt-4 border-t border-border/50">
                  <h3 className="font-medium mb-3">Recent Expenses</h3>
                  <div className="space-y-2">
                    {recentExpenses.slice(0, 3).map((expense) => (
                      <div key={expense.id} className="flex items-center justify-between text-sm">
                        <span className="line-clamp-1">{expense.description}</span>
                        <span className="font-medium">{formatAmount(expense.amount)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Budget Categories</h2>
              <Button className="neon-button">
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {budgetData.categories.map((category) => {
                const percentage = (category.spent / category.budget) * 100;
                const Icon = category.icon;
                const remaining = category.budget - category.spent;
                
                return (
                  <Card key={category.name} className="glass-card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-primary/20">
                          <Icon className={`w-5 h-5 ${category.color}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold">{category.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            ${remaining.toFixed(2)} remaining
                          </p>
                        </div>
                      </div>
                      <Badge variant={percentage > 90 ? 'destructive' : percentage > 75 ? 'secondary' : 'default'}>
                        {percentage.toFixed(1)}%
                      </Badge>
                    </div>

                    <div className="mb-4">
                      <Progress value={percentage} className="h-3" />
                      <div className="flex justify-between text-sm text-muted-foreground mt-1">
                        <span>{formatAmount(category.spent)}</span>
                        <span>{formatAmount(category.budget)}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">Edit Budget</Button>
                      <Button size="sm" variant="outline" className="flex-1">View History</Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="expenses" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">All Expenses</h2>
              <Button className="neon-button">
                <Plus className="w-4 h-4 mr-2" />
                Add Expense
              </Button>
            </div>

            <div className="space-y-3">
              {recentExpenses.map((expense) => (
                <Card key={expense.id} className="glass-card p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-primary/20">
                        <DollarSign className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{expense.description}</p>
                        <p className="text-sm text-muted-foreground">{expense.category} • {expense.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{formatAmount(expense.amount)}</p>
                      <Button size="sm" variant="outline">Edit</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <h2 className="text-xl font-semibold">AI-Powered Insights</h2>
            
            <div className="space-y-4">
              {insights.map((insight, index) => (
                <Card key={index} className="glass-card p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-lg ${
                      insight.type === 'warning' ? 'bg-warning/20' :
                      insight.type === 'success' ? 'bg-accent/20' :
                      'bg-primary/20'
                    }`}>
                      {insight.type === 'warning' && <AlertTriangle className="w-5 h-5 text-warning" />}
                      {insight.type === 'success' && <Target className="w-5 h-5 text-accent" />}
                      {insight.type === 'tip' && <PieChart className="w-5 h-5 text-primary" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">{insight.title}</h3>
                      <p className="text-muted-foreground mb-4">{insight.message}</p>
                      <Button size="sm" variant="outline">{insight.action}</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Card className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-4">Monthly Report</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-lg bg-background/20">
                  <div className="text-2xl font-bold text-accent mb-1">$610</div>
                  <p className="text-sm text-muted-foreground">Potential Savings</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-background/20">
                  <div className="text-2xl font-bold text-primary mb-1">87%</div>
                  <p className="text-sm text-muted-foreground">Budget Efficiency</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-background/20">
                  <div className="text-2xl font-bold text-secondary mb-1">4.2</div>
                  <p className="text-sm text-muted-foreground">Financial Health Score</p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};