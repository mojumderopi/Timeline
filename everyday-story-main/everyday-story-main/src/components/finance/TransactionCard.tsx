import { ArrowDownCircle, ArrowUpCircle, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Transaction, Account } from '@/types';

interface TransactionCardProps {
  transaction: Transaction;
  account?: Account;
}

export function TransactionCard({ transaction, account }: TransactionCardProps) {
  const icons = {
    deposit: ArrowDownCircle,
    withdrawal: ArrowUpCircle,
    spending: ShoppingCart,
  };

  const colors = {
    deposit: 'text-success bg-success/10',
    withdrawal: 'text-destructive bg-destructive/10',
    spending: 'text-accent bg-accent/10',
  };

  const Icon = icons[transaction.type];

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
      <div className={cn("p-2 rounded-lg", colors[transaction.type])}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">
          {transaction.comment || transaction.category || transaction.type}
        </p>
        <p className="text-xs text-muted-foreground">
          {account?.name} • {new Date(transaction.date).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          })}
          {transaction.time && ` at ${transaction.time}`}
        </p>
      </div>
      <p className={cn(
        "font-semibold",
        transaction.type === 'deposit' && "text-success",
        transaction.type === 'withdrawal' && "text-destructive",
        transaction.type === 'spending' && "text-accent"
      )}>
        {transaction.type === 'deposit' ? '+' : '-'}৳{transaction.amount}
      </p>
    </div>
  );
}
