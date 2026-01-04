import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Transaction, Account } from '@/types';

interface AddTransactionModalProps {
  isOpen: boolean;
  type: 'deposit' | 'withdrawal' | 'spending';
  accounts: Account[];
  onClose: () => void;
  onAdd: (transaction: Omit<Transaction, 'id'>) => void;
}

const spendingCategories = [
  'Food', 'Transport', 'Clothes', 'Entertainment', 'Education', 'Health', 'Bills', 'Other'
];

export function AddTransactionModal({ isOpen, type, accounts, onClose, onAdd }: AddTransactionModalProps) {
  const [amount, setAmount] = useState('');
  const [accountId, setAccountId] = useState('');
  const [category, setCategory] = useState('');
  const [comment, setComment] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !accountId) return;

    const now = new Date();
    onAdd({
      type,
      amount: parseFloat(amount),
      accountId,
      category: type === 'spending' ? category : undefined,
      comment,
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().slice(0, 5),
    });

    setAmount('');
    setAccountId('');
    setCategory('');
    setComment('');
    onClose();
  };

  const titles = {
    deposit: 'Add Deposit',
    withdrawal: 'Add Withdrawal',
    spending: 'Add Spending',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-card border border-border rounded-t-2xl sm:rounded-2xl p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">{titles[type]}</h2>
          <Button variant="icon" size="icon-sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (৳)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="account">Account</Label>
            <Select value={accountId} onValueChange={setAccountId} required>
              <SelectTrigger>
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {type === 'spending' && (
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {spendingCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="comment">Comment (optional)</Label>
            <Input
              id="comment"
              placeholder="Add a note..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full">
            {titles[type]}
          </Button>
        </form>
      </div>
    </div>
  );
}
