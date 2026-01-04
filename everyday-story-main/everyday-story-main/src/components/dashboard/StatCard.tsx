import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  gradient?: 'primary' | 'accent' | 'success';
  delay?: number;
}

export function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend,
  gradient = 'primary',
  delay = 0 
}: StatCardProps) {
  const gradientClasses = {
    primary: 'from-primary/20 to-primary/5 border-primary/20',
    accent: 'from-accent/20 to-accent/5 border-accent/20',
    success: 'from-success/20 to-success/5 border-success/20',
  };

  const iconClasses = {
    primary: 'bg-primary/20 text-primary',
    accent: 'bg-accent/20 text-accent',
    success: 'bg-success/20 text-success',
  };

  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-xl border bg-gradient-to-br p-4 transition-all duration-300 hover:scale-[1.02] animate-slide-up",
        gradientClasses[gradient]
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          {subtitle && (
            <p className="text-[10px] text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className={cn(
          "p-2.5 rounded-lg",
          iconClasses[gradient]
        )}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      {trend && (
        <div className={cn(
          "absolute bottom-0 left-0 right-0 h-1",
          trend === 'up' && "bg-success/50",
          trend === 'down' && "bg-destructive/50",
          trend === 'neutral' && "bg-muted"
        )} />
      )}
    </div>
  );
}
