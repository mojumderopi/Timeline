import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { TuitionTracker } from '@/components/tuition/TuitionTracker';
import { FinanceManager } from '@/components/finance/FinanceManager';
import { ScheduleManager } from '@/components/schedule/ScheduleManager';
import { ShoppingList } from '@/components/shopping/ShoppingList';
import { NotesManager } from '@/components/notes/NotesManager';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import type { TabType, Student, ClassRecord, Account, Transaction, ScheduledWork, ShoppingItem, Note } from '@/types';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

const defaultAccounts: Account[] = [
  { id: 'cash', name: 'Cash', type: 'cash', balance: 0 },
  { id: 'bank', name: 'Bank', type: 'bank', balance: 0 },
  { id: 'bkash', name: 'bKash', type: 'bkash', balance: 0 },
];

export default function Index() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [students, setStudents] = useLocalStorage<Student[]>('timeline-students', []);
  const [classRecords, setClassRecords] = useLocalStorage<ClassRecord[]>('timeline-class-records', []);
  const [accounts] = useLocalStorage<Account[]>('timeline-accounts', defaultAccounts);
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('timeline-transactions', []);
  const [scheduledWorks, setScheduledWorks] = useLocalStorage<ScheduledWork[]>('timeline-scheduled-works', []);
  const [shoppingItems, setShoppingItems] = useLocalStorage<ShoppingItem[]>('timeline-shopping-items', []);
  const [notes, setNotes] = useLocalStorage<Note[]>('timeline-notes', []);

  // Modal states for quick add from dashboard
  const [quickAddStudent, setQuickAddStudent] = useState(false);
  const [quickAddSpending, setQuickAddSpending] = useState(false);
  const [quickAddTask, setQuickAddTask] = useState(false);
  const [quickAddItem, setQuickAddItem] = useState(false);

  // Student handlers
  const handleAddStudent = (student: Omit<Student, 'id' | 'createdAt'>) => {
    const newStudent: Student = {
      ...student,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setStudents([...students, newStudent]);
    toast.success('Student added successfully');
  };

  const handleUpdateRecord = (record: ClassRecord) => {
    const existingIndex = classRecords.findIndex(r => r.id === record.id);
    if (existingIndex >= 0) {
      const updated = [...classRecords];
      updated[existingIndex] = record;
      setClassRecords(updated);
    } else {
      setClassRecords([...classRecords, record]);
    }
  };

  // Transaction handlers
  const handleAddTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
    };
    setTransactions([...transactions, newTransaction]);
    toast.success(`${transaction.type} recorded`);
  };

  // Scheduled work handlers
  const handleAddWork = (work: Omit<ScheduledWork, 'id' | 'completed'>) => {
    const newWork: ScheduledWork = {
      ...work,
      id: crypto.randomUUID(),
      completed: false,
    };
    setScheduledWorks([...scheduledWorks, newWork]);
    toast.success('Task added');
  };

  const handleToggleComplete = (id: string) => {
    setScheduledWorks(scheduledWorks.map(w => 
      w.id === id ? { ...w, completed: !w.completed } : w
    ));
  };

  const handleDeleteWork = (id: string) => {
    setScheduledWorks(scheduledWorks.filter(w => w.id !== id));
    toast.success('Task deleted');
  };

  // Shopping handlers
  const handleAddItem = (item: Omit<ShoppingItem, 'id' | 'bought' | 'createdAt'>) => {
    const newItem: ShoppingItem = {
      ...item,
      id: crypto.randomUUID(),
      bought: false,
      createdAt: new Date().toISOString(),
    };
    setShoppingItems([...shoppingItems, newItem]);
    toast.success('Item added');
  };

  const handleToggleBought = (id: string) => {
    setShoppingItems(shoppingItems.map(i => 
      i.id === id ? { ...i, bought: !i.bought } : i
    ));
  };

  const handleDeleteItem = (id: string) => {
    setShoppingItems(shoppingItems.filter(i => i.id !== id));
  };

  // Note handlers
  const handleAddNote = (note: Omit<Note, 'id' | 'createdAt'>) => {
    const newNote: Note = {
      ...note,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setNotes([...notes, newNote]);
    toast.success('Note added');
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
    toast.success('Note deleted');
  };

  // Quick add handlers from dashboard
  const handleQuickAddStudent = () => {
    setActiveTab('tuition');
  };

  const handleQuickAddSpending = () => {
    setActiveTab('finance');
  };

  const handleQuickAddTask = () => {
    setActiveTab('schedule');
  };

  const handleQuickAddItem = () => {
    setActiveTab('shopping');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            students={students}
            classRecords={classRecords}
            transactions={transactions}
            scheduledWorks={scheduledWorks}
            shoppingItems={shoppingItems}
            onAddStudent={handleQuickAddStudent}
            onAddSpending={handleQuickAddSpending}
            onAddTask={handleQuickAddTask}
            onAddItem={handleQuickAddItem}
          />
        );
      case 'tuition':
        return (
          <TuitionTracker
            students={students}
            classRecords={classRecords}
            onAddStudent={handleAddStudent}
            onUpdateRecord={handleUpdateRecord}
          />
        );
      case 'finance':
        return (
          <FinanceManager
            accounts={accounts}
            transactions={transactions}
            onAddTransaction={handleAddTransaction}
          />
        );
      case 'schedule':
        return (
          <ScheduleManager
            scheduledWorks={scheduledWorks}
            onAddWork={handleAddWork}
            onToggleComplete={handleToggleComplete}
            onDelete={handleDeleteWork}
          />
        );
      case 'shopping':
        return (
          <ShoppingList
            items={shoppingItems}
            onAddItem={handleAddItem}
            onToggleBought={handleToggleBought}
            onDelete={handleDeleteItem}
          />
        );
      case 'notes':
        return (
          <NotesManager
            notes={notes}
            onAddNote={handleAddNote}
            onDeleteNote={handleDeleteNote}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="px-4 py-5 max-w-lg mx-auto">
        {renderContent()}
      </main>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      <Toaster position="top-center" />
    </div>
  );
}
