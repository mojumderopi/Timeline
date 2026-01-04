import { useState } from 'react';
import { Plus, ArrowDownCircle, ArrowUpCircle, ShoppingCart, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TransactionCard } from './TransactionCard';
import { AddTransactionModal } from './AddTransactionModal';
import type { Transaction, Account } from '@/types';

interface FinanceManagerProps {
  accounts: Account[];
  transactions: Transaction[];
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

export function FinanceManager({ accounts, transactions, onAddTransaction }: FinanceManagerProps) {
  const [modalType, setModalType] = useState<'deposit' | 'withdrawal' | 'spending' | null>(null);
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('week');

  const getFilteredTransactions = (type?: 'deposit' | 'withdrawal' | 'spending') => {
    const now = new Date();
    let startDate = new Date();

    if (period === 'day') {
      startDate.setHours(0, 0, 0, 0);
    } else if (period === 'week') {
      startDate.setDate(now.getDate() - now.getDay());
      startDate.setHours(0, 0, 0, 0);
    } else {
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
    }

    return transactions
      .filter(t => {
        const date = new Date(t.date);
        return date >= startDate && (!type || t.type === type);
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const totalDeposits = getFilteredTransactions('deposit').reduce((sum, t) => sum + t.amount, 0);
  const totalWithdrawals = getFilteredTransactions('withdrawal').reduce((sum, t) => sum + t.amount, 0);
  const totalSpending = getFilteredTransactions('spending').reduce((sum, t) => sum + t.amount, 0);
  const netBalance = totalDeposits - totalWithdrawals - totalSpending;

  const periodLabels = {
    day: 'Today',
    week: 'This Week',
    month: 'This Month',
  };

  return (
    <div className="space-y-5 pb-20">
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h2 className="text-xl font-bold">Finance Manager</h2>
          <p className="text-sm text-muted-foreground">Track your money</p>
        </div>
      </div>

      {/* Period Selector */}
      <div className="flex gap-2 animate-slide-up">
        {(['day', 'week', 'month'] as const).map((p) => (
          <Button
            key={p}
            variant={period === p ? 'default' : 'secondary'}
            size="sm"
            onClick={() => setPeriod(p)}
          >
            {periodLabels[p]}
          </Button>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 animate-slide-up" style={{ animationDelay: '50ms' }}>
        <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-success" />
              <span className="text-xs text-muted-foreground">Deposits</span>
            </div>
            <p className="text-xl font-bold text-success">৳{totalDeposits}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown className="w-4 h-4 text-destructive" />
              <span className="text-xs text-muted-foreground">Spending</span>
            </div>
            <p className="text-xl font-bold text-destructive">৳{totalSpending}</p>
          </CardContent>
        </Card>
      </div>

      {/* Net Balance */}
      <Card className="animate-slide-up" style={{ animationDelay: '100ms' }}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-primary" />
              <span className="font-medium">Net Balance ({periodLabels[period]})</span>
            </div>
            <p className={`text-xl font-bold ${netBalance >= 0 ? 'text-success' : 'text-destructive'}`}>
              {netBalance >= 0 ? '+' : ''}৳{netBalance}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Add Buttons */}
      <div className="grid grid-cols-3 gap-2 animate-slide-up" style={{ animationDelay: '150ms' }}>
        <Button
          variant="secondary"
          className="flex-col h-auto py-3 gap-1.5"
          onClick={() => setModalType('deposit')}
        >
          <ArrowDownCircle className="w-5 h-5 text-success" />
          <span className="text-[10px]">Deposit</span>
        </Button>
        <Button
          variant="secondary"
          className="flex-col h-auto py-3 gap-1.5"
          onClick={() => setModalType('withdrawal')}
        >
          <ArrowUpCircle className="w-5 h-5 text-destructive" />
          <span className="text-[10px]">Withdraw</span>
        </Button>
        <Button
          variant="secondary"
          className="flex-col h-auto py-3 gap-1.5"
          onClick={() => setModalType('spending')}
        >
          <ShoppingCart className="w-5 h-5 text-accent" />
          <span className="text-[10px]">Spending</span>
        </Button>
      </div>

      {/* Transactions List */}
      <Tabs defaultValue="all" className="animate-slide-up" style={{ animationDelay: '200ms' }}>
        <TabsList className="w-full">
          <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
          <TabsTrigger value="deposits" className="flex-1">Deposits</TabsTrigger>
          <TabsTrigger value="spending" className="flex-1">Spending</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-3 space-y-2">
          {getFilteredTransactions().length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No transactions yet</p>
          ) : (
            getFilteredTransactions().map((transaction) => (
              <TransactionCard
                key={transaction.id}
                transaction={transaction}
                account={accounts.find(a => a.id === transaction.accountId)}
              />
            ))
          )}
        </TabsContent>
        <TabsContent value="deposits" className="mt-3 space-y-2">
          {getFilteredTransactions('deposit').map((transaction) => (
            <TransactionCard
              key={transaction.id}
              transaction={transaction}
              account={accounts.find(a => a.id === transaction.accountId)}
            />
          ))}
        </TabsContent>
        <TabsContent value="spending" className="mt-3 space-y-2">
          {getFilteredTransactions('spending').map((transaction) => (
            <TransactionCard
              key={transaction.id}
              transaction={transaction}
              account={accounts.find(a => a.id === transaction.accountId)}
            />
          ))}
        </TabsContent>
      </Tabs>

      {modalType && (
        <AddTransactionModal
          isOpen={true}
          type={modalType}
          accounts={accounts}
          onClose={() => setModalType(null)}
          onAdd={onAddTransaction}
        />
      )}
    </div>
  );
}
