import { useState } from 'react';
import { Plus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StudentCard } from './StudentCard';
import { WeeklyView } from './WeeklyView';
import { AddStudentModal } from './AddStudentModal';
import type { Student, ClassRecord } from '@/types';

interface TuitionTrackerProps {
  students: Student[];
  classRecords: ClassRecord[];
  onAddStudent: (student: Omit<Student, 'id' | 'createdAt'>) => void;
  onUpdateRecord: (record: ClassRecord) => void;
}

export function TuitionTracker({ 
  students, 
  classRecords, 
  onAddStudent, 
  onUpdateRecord 
}: TuitionTrackerProps) {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  if (selectedStudent) {
    const studentRecords = classRecords.filter(r => r.studentId === selectedStudent.id);
    return (
      <WeeklyView
        student={selectedStudent}
        records={studentRecords}
        onBack={() => setSelectedStudent(null)}
        onUpdateRecord={onUpdateRecord}
      />
    );
  }

  // Calculate summary stats
  const thisWeekRecords = classRecords.filter(r => {
    const date = new Date(r.date);
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    return date >= startOfWeek;
  });

  const totalTaken = thisWeekRecords.filter(r => r.status === 'taken').length;
  const totalAbsent = thisWeekRecords.filter(r => r.status === 'absent').length;
  const totalEarnings = thisWeekRecords
    .filter(r => r.status === 'taken')
    .reduce((sum, r) => {
      const student = students.find(s => s.id === r.studentId);
      return sum + (student?.ratePerClass || 0);
    }, 0);

  return (
    <div className="space-y-5 pb-20">
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h2 className="text-xl font-bold">Tuition Tracker</h2>
          <p className="text-sm text-muted-foreground">Manage your students</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-4 h-4" />
          Add Student
        </Button>
      </div>

      {/* Weekly Summary */}
      <div className="grid grid-cols-3 gap-2 animate-slide-up">
        <div className="p-3 rounded-lg bg-success/10 border border-success/20 text-center">
          <p className="text-2xl font-bold text-success">{totalTaken}</p>
          <p className="text-[10px] text-muted-foreground">Classes Taken</p>
        </div>
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-center">
          <p className="text-2xl font-bold text-destructive">{totalAbsent}</p>
          <p className="text-[10px] text-muted-foreground">Absent</p>
        </div>
        <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-center">
          <p className="text-2xl font-bold text-primary">৳{totalEarnings}</p>
          <p className="text-[10px] text-muted-foreground">This Week</p>
        </div>
      </div>

      {/* Students List */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
          <Users className="w-4 h-4" />
          Students ({students.length})
        </h3>
        {students.length === 0 ? (
          <div className="text-center py-12 animate-fade-in">
            <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">No students yet</p>
            <p className="text-sm text-muted-foreground/70">Add your first student to get started</p>
          </div>
        ) : (
          <div className="space-y-2">
            {students.map((student, index) => (
              <div
                key={student.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <StudentCard
                  student={student}
                  records={classRecords.filter(r => r.studentId === student.id)}
                  onClick={() => setSelectedStudent(student)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <AddStudentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={onAddStudent}
      />
    </div>
  );
}
