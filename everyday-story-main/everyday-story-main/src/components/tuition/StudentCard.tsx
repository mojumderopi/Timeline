import { User, BookOpen, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { Student, ClassRecord } from '@/types';

interface StudentCardProps {
  student: Student;
  records: ClassRecord[];
  onClick: () => void;
}

export function StudentCard({ student, records, onClick }: StudentCardProps) {
  const weeklyRecords = records.filter(r => {
    const date = new Date(r.date);
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    return date >= startOfWeek;
  });

  const takenClasses = weeklyRecords.filter(r => r.status === 'taken').length;
  const absentClasses = weeklyRecords.filter(r => r.status === 'absent').length;

  return (
    <Card 
      className="cursor-pointer hover:border-primary/50 transition-all duration-200 hover:shadow-glow"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{student.name}</h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <BookOpen className="w-3 h-3" />
              <span>{student.subject}</span>
              <span>•</span>
              <span>৳{student.ratePerClass}/class</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="flex items-center gap-1.5 text-xs">
                <span className="w-2 h-2 rounded-full bg-success" />
                <span>{takenClasses}</span>
                <span className="w-2 h-2 rounded-full bg-destructive ml-1" />
                <span>{absentClasses}</span>
              </div>
              <p className="text-[10px] text-muted-foreground">This week</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
