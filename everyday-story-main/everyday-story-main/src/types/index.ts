export interface Student {
  id: string;
  name: string;
  subject: string;
  ratePerClass: number;
  createdAt: string;
}

export interface ClassRecord {
  id: string;
  studentId: string;
  date: string;
  status: 'taken' | 'absent' | 'pending';
  comment?: string;
}

export interface Account {
  id: string;
  name: string;
  type: 'cash' | 'bank' | 'bkash' | 'custom';
  balance: number;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'spending';
  amount: number;
  accountId: string;
  category?: string;
  comment?: string;
  date: string;
  time?: string;
}

export interface ScheduledWork {
  id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  reminderType: 'notification' | 'alarm';
  completed: boolean;
}

export interface ShoppingItem {
  id: string;
  name: string;
  expectedPrice: number;
  priority: 'low' | 'medium' | 'high';
  comment?: string;
  bought: boolean;
  createdAt: string;
}

export interface Note {
  id: string;
  type: 'quick' | 'exam' | 'class';
  title: string;
  content?: string;
  date?: string;
  time?: string;
  subject?: string;
  location?: string;
  dayOfWeek?: string;
  createdAt: string;
}

export type TabType = 'dashboard' | 'tuition' | 'finance' | 'schedule' | 'shopping' | 'notes';
