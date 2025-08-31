import { useEffect, useState } from 'react';
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

  const budgetData = {
    totalBudget: 2500,
    totalSpent: 1890,
    categories: [
      { name: 'Food & Dining', budget: 600, spent: 485, icon: Coffee, color: 'text-orange-500' },
      { name: 'Transportation', budget: 300, spent: 245, icon: Car, color: 'text-blue-500' },
      { name: 'Shopping', budget: 400, spent: 380, icon: ShoppingCart, color: 'text-purple-500' },
      { name: 'Housing', budget: 800, spent: 550, icon: Home, color: 'text-green-500' },
      { name: 'Entertainment', budget: 200, spent: 125, icon: Coffee, color: 'text-pink-500' },
      { name: 'Utilities', budget: 200, spent: 105, icon: Home, color: 'text-yellow-500' }
    ]
  };

  const recentExpenses = [
    { id: 1, description: 'Grocery Store', amount: 85.50, category: 'Food & Dining', date: '2024-01-15' },
    { id: 2, description: 'Gas Station', amount: 45.00, category: 'Transportation', date: '2024-01-15' },
    { id: 3, description: 'Amazon Purchase', amount: 67.99, category: 'Shopping', date: '2024-01-14' },
    { id: 4, description: 'Restaurant Dinner', amount: 42.75, category: 'Food & Dining', date: '2024-01-14' },
    { id: 5, description: 'Movie Tickets', amount: 28.00, category: 'Entertainment', date: '2024-01-13' }
  ];

  const insights = [
    {
      type: 'warning',
      title: 'Shopping Budget Alert',
      message: 'You\'ve used 95% of your shopping budget. Consider reducing spending in this category.',
      action: 'Review spending'
    },
    {
      type: 'success',
      title: 'Great Progress!',
      message: 'You\'re 20% under budget for utilities this month. Keep it up!',
      action: 'View trends'
    },
    {
      type: 'tip',
      title: 'Savings Opportunity',
      message: 'Based on your patterns, you could save $200/month by meal prepping.',
      action: 'Learn more'
    }
  ];

  const budgetPercentage = (budgetData.totalSpent / budgetData.totalBudget) * 100;

  // Push finance signal to mood engine
  useEffect(() => {
    setSignals({ budgetUsed: budgetPercentage });
  }, [budgetPercentage, setSignals]);

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
                  <Button className="w-full neon-button">
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