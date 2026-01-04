import { useState } from 'react';
import { Plus, ShoppingBag, Check, Trash2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { ShoppingItem } from '@/types';

interface ShoppingListProps {
  items: ShoppingItem[];
  onAddItem: (item: Omit<ShoppingItem, 'id' | 'bought' | 'createdAt'>) => void;
  onToggleBought: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ShoppingList({ items, onAddItem, onToggleBought, onDelete }: ShoppingListProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [expectedPrice, setExpectedPrice] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    onAddItem({
      name,
      expectedPrice: expectedPrice ? parseFloat(expectedPrice) : 0,
      priority,
      comment,
    });

    setName('');
    setExpectedPrice('');
    setPriority('medium');
    setComment('');
    setIsAdding(false);
  };

  const pendingItems = items.filter(i => !i.bought);
  const boughtItems = items.filter(i => i.bought);
  const totalEstimate = pendingItems.reduce((sum, i) => sum + i.expectedPrice, 0);

  const priorityColors = {
    high: 'border-destructive/50 bg-destructive/5',
    medium: 'border-warning/50 bg-warning/5',
    low: 'border-muted',
  };

  const priorityBadge = {
    high: 'bg-destructive/10 text-destructive',
    medium: 'bg-warning/10 text-warning',
    low: 'bg-muted text-muted-foreground',
  };

  return (
    <div className="space-y-5 pb-20">
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h2 className="text-xl font-bold">Things to Buy</h2>
          <p className="text-sm text-muted-foreground">Your shopping list</p>
        </div>
        <Button onClick={() => setIsAdding(true)}>
          <Plus className="w-4 h-4" />
          Add Item
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3 animate-slide-up">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <ShoppingBag className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">Items Left</span>
            </div>
            <p className="text-xl font-bold">{pendingItems.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="w-4 h-4 text-accent" />
              <span className="text-xs text-muted-foreground">Estimated Cost</span>
            </div>
            <p className="text-xl font-bold text-accent">৳{totalEstimate}</p>
          </CardContent>
        </Card>
      </div>

      {/* Add Item Form */}
      {isAdding && (
        <Card className="animate-scale-in">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Add Item</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="name">Item Name</Label>
                <Input
                  id="name"
                  placeholder="What do you need?"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="price">Expected Price (৳)</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="0"
                    value={expectedPrice}
                    onChange={(e) => setExpectedPrice(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={priority} onValueChange={(v) => setPriority(v as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="comment">Comment (optional)</Label>
                <Input
                  id="comment"
                  placeholder="Add a note..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">Add Item</Button>
                <Button type="button" variant="secondary" onClick={() => setIsAdding(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Pending Items */}
      {pendingItems.length > 0 && (
        <div className="space-y-2 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <h3 className="text-sm font-semibold text-muted-foreground">
            To Buy ({pendingItems.length})
          </h3>
          {pendingItems
            .sort((a, b) => {
              const priorityOrder = { high: 0, medium: 1, low: 2 };
              return priorityOrder[a.priority] - priorityOrder[b.priority];
            })
            .map((item) => (
              <div
                key={item.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border transition-all duration-200",
                  priorityColors[item.priority]
                )}
              >
                <Button
                  variant="secondary"
                  size="icon-sm"
                  onClick={() => onToggleBought(item.id)}
                >
                  <Check className="w-4 h-4" />
                </Button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">{item.name}</p>
                    <span className={cn("px-1.5 py-0.5 text-[10px] rounded", priorityBadge[item.priority])}>
                      {item.priority}
                    </span>
                  </div>
                  {item.comment && (
                    <p className="text-xs text-muted-foreground truncate">{item.comment}</p>
                  )}
                </div>
                {item.expectedPrice > 0 && (
                  <p className="text-sm font-medium">৳{item.expectedPrice}</p>
                )}
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onDelete(item.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
        </div>
      )}

      {/* Bought Items */}
      {boughtItems.length > 0 && (
        <div className="space-y-2 animate-slide-up" style={{ animationDelay: '150ms' }}>
          <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
            <Check className="w-4 h-4 text-success" />
            Bought ({boughtItems.length})
          </h3>
          {boughtItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 p-3 rounded-lg border border-border bg-secondary/30 opacity-60"
            >
              <Button
                variant="success"
                size="icon-sm"
                onClick={() => onToggleBought(item.id)}
              >
                <Check className="w-4 h-4" />
              </Button>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm line-through">{item.name}</p>
              </div>
              {item.expectedPrice > 0 && (
                <p className="text-sm font-medium line-through">৳{item.expectedPrice}</p>
              )}
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => onDelete(item.id)}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {items.length === 0 && !isAdding && (
        <div className="text-center py-12 animate-fade-in">
          <ShoppingBag className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">No items to buy</p>
          <p className="text-sm text-muted-foreground/70">Add items to your shopping list</p>
        </div>
      )}
    </div>
  );
}
