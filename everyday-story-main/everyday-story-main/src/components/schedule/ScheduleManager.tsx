import { useState } from 'react';
import { Plus, Calendar, Clock, Bell, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { ScheduledWork } from '@/types';

interface ScheduleManagerProps {
  scheduledWorks: ScheduledWork[];
  onAddWork: (work: Omit<ScheduledWork, 'id' | 'completed'>) => void;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ScheduleManager({ scheduledWorks, onAddWork, onToggleComplete, onDelete }: ScheduleManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !time) return;

    onAddWork({
      title,
      description,
      date,
      time,
      reminderType: 'notification',
    });

    setTitle('');
    setDescription('');
    setDate('');
    setTime('');
    setIsAdding(false);
  };

  const sortedWorks = [...scheduledWorks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime();
  });

  const today = new Date().toISOString().split('T')[0];
  const todayWorks = sortedWorks.filter(w => w.date === today);
  const upcomingWorks = sortedWorks.filter(w => w.date > today);
  const pastWorks = sortedWorks.filter(w => w.date < today);

  const WorkItem = ({ work }: { work: ScheduledWork }) => {
    const isPast = new Date(work.date) < new Date(today);
    const isToday = work.date === today;

    return (
      <div className={cn(
        "flex items-center gap-3 p-3 rounded-lg border transition-all duration-200",
        work.completed && "opacity-50",
        isToday && !work.completed && "border-primary/50 bg-primary/5",
        !isToday && "border-border bg-secondary/30"
      )}>
        <Button
          variant={work.completed ? 'success' : 'secondary'}
          size="icon-sm"
          onClick={() => onToggleComplete(work.id)}
        >
          {work.completed ? <Check className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
        </Button>
        <div className="flex-1 min-w-0">
          <p className={cn(
            "font-medium text-sm",
            work.completed && "line-through"
          )}>
            {work.title}
          </p>
          {work.description && (
            <p className="text-xs text-muted-foreground truncate">{work.description}</p>
          )}
          <p className="text-xs text-muted-foreground mt-0.5">
            {new Date(work.date).toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric' 
            })} at {work.time}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => onDelete(work.id)}
          className="text-muted-foreground hover:text-destructive"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-5 pb-20">
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h2 className="text-xl font-bold">Scheduled Work</h2>
          <p className="text-sm text-muted-foreground">Manage your tasks</p>
        </div>
        <Button onClick={() => setIsAdding(true)}>
          <Plus className="w-4 h-4" />
          Add Task
        </Button>
      </div>

      {/* Add Task Form */}
      {isAdding && (
        <Card className="animate-scale-in">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">New Task</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Task title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Input
                  id="description"
                  placeholder="Add details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">Add Task</Button>
                <Button type="button" variant="secondary" onClick={() => setIsAdding(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Today's Tasks */}
      {todayWorks.length > 0 && (
        <div className="space-y-2 animate-slide-up">
          <h3 className="text-sm font-semibold text-primary flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Today ({todayWorks.length})
          </h3>
          {todayWorks.map((work) => (
            <WorkItem key={work.id} work={work} />
          ))}
        </div>
      )}

      {/* Upcoming Tasks */}
      {upcomingWorks.length > 0 && (
        <div className="space-y-2 animate-slide-up" style={{ animationDelay: '50ms' }}>
          <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Upcoming ({upcomingWorks.length})
          </h3>
          {upcomingWorks.map((work) => (
            <WorkItem key={work.id} work={work} />
          ))}
        </div>
      )}

      {/* Past Tasks */}
      {pastWorks.filter(w => !w.completed).length > 0 && (
        <div className="space-y-2 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <h3 className="text-sm font-semibold text-destructive flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Overdue ({pastWorks.filter(w => !w.completed).length})
          </h3>
          {pastWorks.filter(w => !w.completed).map((work) => (
            <WorkItem key={work.id} work={work} />
          ))}
        </div>
      )}

      {scheduledWorks.length === 0 && !isAdding && (
        <div className="text-center py-12 animate-fade-in">
          <Calendar className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">No scheduled tasks</p>
          <p className="text-sm text-muted-foreground/70">Add your first task to get started</p>
        </div>
      )}
    </div>
  );
}
