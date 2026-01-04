import { GraduationCap, Wallet, TrendingUp, TrendingDown, Calendar, ShoppingBag } from 'lucide-react';
import { StatCard } from './StatCard';
import { QuickActions } from './QuickActions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Student, ClassRecord, Transaction, ScheduledWork, ShoppingItem } from '@/types';

interface DashboardProps {
  students: Student[];
  classRecords: ClassRecord[];
  transactions: Transaction[];
  scheduledWorks: ScheduledWork[];
  shoppingItems: ShoppingItem[];
  onAddStudent: () => void;
  onAddSpending: () => void;
  onAddTask: () => void;
  onAddItem: () => void;
}

export function Dashboard({
  students,
  classRecords,
  transactions,
  scheduledWorks,
  shoppingItems,
  onAddStudent,
  onAddSpending,
  onAddTask,
  onAddItem,
}: DashboardProps) {
  // Calculate this week's stats
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const weeklyClasses = classRecords.filter(r => {
    const date = new Date(r.date);
    return date >= startOfWeek && r.status === 'taken';
  });

  const weeklyDeposits = transactions
    .filter(t => t.type === 'deposit' && new Date(t.date) >= startOfWeek)
    .reduce((sum, t) => sum + t.amount, 0);

  const weeklySpending = transactions
    .filter(t => t.type === 'spending' && new Date(t.date) >= startOfWeek)
    .reduce((sum, t) => sum + t.amount, 0);

  const weeklyEarnings = weeklyClasses.reduce((sum, record) => {
    const student = students.find(s => s.id === record.studentId);
    return sum + (student?.ratePerClass || 0);
  }, 0);

  const pendingTasks = scheduledWorks.filter(w => !w.completed).length;
  const pendingItems = shoppingItems.filter(i => !i.bought).length;

  const upcomingTasks = scheduledWorks
    .filter(w => !w.completed)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-5 pb-20">
      <div className="animate-fade-in">
        <h2 className="text-xl font-bold mb-1">Dashboard</h2>
        <p className="text-sm text-muted-foreground">Your week at a glance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          title="Classes This Week"
          value={weeklyClasses.length}
          subtitle={`${students.length} students`}
          icon={GraduationCap}
          gradient="primary"
          delay={0}
        />
        <StatCard
          title="Weekly Earnings"
          value={`৳${weeklyEarnings}`}
          subtitle="From tuitions"
          icon={TrendingUp}
          gradient="success"
          delay={50}
        />
        <StatCard
          title="Weekly Spending"
          value={`৳${weeklySpending}`}
          subtitle={`Deposits: ৳${weeklyDeposits}`}
          icon={TrendingDown}
          gradient="accent"
          delay={100}
        />
        <StatCard
          title="Pending Tasks"
          value={pendingTasks}
          subtitle={`${pendingItems} items to buy`}
          icon={Calendar}
          gradient="primary"
          delay={150}
        />
      </div>

      {/* Quick Actions */}
      <QuickActions
        onAddStudent={onAddStudent}
        onAddSpending={onAddSpending}
        onAddTask={onAddTask}
        onAddItem={onAddItem}
      />

      {/* Upcoming Tasks */}
      {upcomingTasks.length > 0 && (
        <Card className="animate-slide-up" style={{ animationDelay: '300ms' }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              Upcoming Tasks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {upcomingTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
              >
                <div>
                  <p className="text-sm font-medium">{task.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(task.date).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    })} at {task.time}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Shopping Items Preview */}
      {pendingItems > 0 && (
        <Card className="animate-slide-up" style={{ animationDelay: '400ms' }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-warning" />
              Things to Buy ({pendingItems})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {shoppingItems
                .filter(i => !i.bought)
                .slice(0, 5)
                .map((item) => (
                  <span
                    key={item.id}
                    className="px-2.5 py-1 text-xs rounded-full bg-warning/10 text-warning border border-warning/20"
                  >
                    {item.name}
                  </span>
                ))}
              {pendingItems > 5 && (
                <span className="px-2.5 py-1 text-xs rounded-full bg-muted text-muted-foreground">
                  +{pendingItems - 5} more
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
