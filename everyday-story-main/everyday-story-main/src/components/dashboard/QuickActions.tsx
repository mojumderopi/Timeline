import { Plus, BookOpen, Receipt, CalendarPlus, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuickActionsProps {
  onAddStudent: () => void;
  onAddSpending: () => void;
  onAddTask: () => void;
  onAddItem: () => void;
}

export function QuickActions({ onAddStudent, onAddSpending, onAddTask, onAddItem }: QuickActionsProps) {
  const actions = [
    { icon: BookOpen, label: 'Student', onClick: onAddStudent, color: 'text-primary' },
    { icon: Receipt, label: 'Spending', onClick: onAddSpending, color: 'text-accent' },
    { icon: CalendarPlus, label: 'Task', onClick: onAddTask, color: 'text-success' },
    { icon: ShoppingCart, label: 'Buy Item', onClick: onAddItem, color: 'text-warning' },
  ];

  return (
    <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
      <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Quick Add</h3>
      <div className="grid grid-cols-4 gap-2">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Button
              key={action.label}
              variant="secondary"
              className="flex-col h-auto py-3 gap-1.5"
              onClick={action.onClick}
            >
              <Icon className={`w-5 h-5 ${action.color}`} />
              <span className="text-[10px] font-medium">{action.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
