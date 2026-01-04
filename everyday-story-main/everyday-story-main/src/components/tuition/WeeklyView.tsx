import { useState } from 'react';
import { ArrowLeft, Check, X, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { Student, ClassRecord } from '@/types';

interface WeeklyViewProps {
  student: Student;
  records: ClassRecord[];
  onBack: () => void;
  onUpdateRecord: (record: ClassRecord) => void;
}

export function WeeklyView({ student, records, onBack, onUpdateRecord }: WeeklyViewProps) {
  const [commentingDay, setCommentingDay] = useState<string | null>(null);
  const [comment, setComment] = useState('');

  // Get the 7 days of the current week
  const getWeekDays = () => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const weekDays = getWeekDays();

  const getRecordForDate = (date: Date): ClassRecord | undefined => {
    const dateStr = date.toISOString().split('T')[0];
    return records.find(r => r.date === dateStr);
  };

  const handleStatusChange = (date: Date, status: 'taken' | 'absent') => {
    const dateStr = date.toISOString().split('T')[0];
    const existingRecord = getRecordForDate(date);

    if (existingRecord) {
      onUpdateRecord({ ...existingRecord, status });
    } else {
      onUpdateRecord({
        id: crypto.randomUUID(),
        studentId: student.id,
        date: dateStr,
        status,
      });
    }
  };

  const handleCommentSave = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const existingRecord = getRecordForDate(date);

    if (existingRecord) {
      onUpdateRecord({ ...existingRecord, comment });
    } else {
      onUpdateRecord({
        id: crypto.randomUUID(),
        studentId: student.id,
        date: dateStr,
        status: 'pending',
        comment,
      });
    }
    setCommentingDay(null);
    setComment('');
  };

  const totalTaken = records.filter(r => r.status === 'taken').length;
  const totalAbsent = records.filter(r => r.status === 'absent').length;
  const totalEarnings = totalTaken * student.ratePerClass;

  return (
    <div className="space-y-5 pb-20">
      <div className="flex items-center gap-3">
        <Button variant="icon" size="icon-sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h2 className="text-lg font-bold">{student.name}</h2>
          <p className="text-xs text-muted-foreground">{student.subject}</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-3 rounded-lg bg-success/10 border border-success/20 text-center">
          <p className="text-2xl font-bold text-success">{totalTaken}</p>
          <p className="text-[10px] text-muted-foreground">Taken</p>
        </div>
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-center">
          <p className="text-2xl font-bold text-destructive">{totalAbsent}</p>
          <p className="text-[10px] text-muted-foreground">Absent</p>
        </div>
        <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-center">
          <p className="text-2xl font-bold text-primary">৳{totalEarnings}</p>
          <p className="text-[10px] text-muted-foreground">Earned</p>
        </div>
      </div>

      {/* Weekly Calendar */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">This Week</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {weekDays.map((day, index) => {
            const record = getRecordForDate(day);
            const isToday = day.toDateString() === new Date().toDateString();
            const dateStr = day.toISOString().split('T')[0];

            return (
              <div
                key={index}
                className={cn(
                  "p-3 rounded-lg border transition-all duration-200",
                  isToday && "border-primary/50 bg-primary/5",
                  !isToday && "border-border bg-secondary/30"
                )}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={cn(
                      "font-medium text-sm",
                      isToday && "text-primary"
                    )}>
                      {day.toLocaleDateString('en-US', { weekday: 'long' })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={record?.status === 'taken' ? 'success' : 'secondary'}
                      size="icon-sm"
                      onClick={() => handleStatusChange(day, 'taken')}
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={record?.status === 'absent' ? 'destructive' : 'secondary'}
                      size="icon-sm"
                      onClick={() => handleStatusChange(day, 'absent')}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={record?.comment ? 'accent' : 'secondary'}
                      size="icon-sm"
                      onClick={() => {
                        setCommentingDay(dateStr);
                        setComment(record?.comment || '');
                      }}
                    >
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {record?.comment && commentingDay !== dateStr && (
                  <p className="mt-2 text-xs text-muted-foreground italic bg-muted/50 p-2 rounded">
                    "{record.comment}"
                  </p>
                )}
                {commentingDay === dateStr && (
                  <div className="mt-2 flex gap-2">
                    <Input
                      placeholder="Add a comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="text-sm"
                    />
                    <Button size="sm" onClick={() => handleCommentSave(day)}>
                      Save
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
