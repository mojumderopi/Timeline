import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, StickyNote, GraduationCap, BookOpen, Trash2, Calendar, Clock, MapPin } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { Note } from '@/types';

interface NotesManagerProps {
  notes: Note[];
  onAddNote: (note: Omit<Note, 'id' | 'createdAt'>) => void;
  onDeleteNote: (id: string) => void;
}

type NoteTab = 'quick' | 'exam' | 'class';

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function NotesManager({ notes, onAddNote, onDeleteNote }: NotesManagerProps) {
  const [activeTab, setActiveTab] = useState<NoteTab>('quick');
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    date: '',
    time: '',
    subject: '',
    location: '',
    dayOfWeek: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    onAddNote({
      type: activeTab,
      title: formData.title,
      content: formData.content || undefined,
      date: formData.date || undefined,
      time: formData.time || undefined,
      subject: formData.subject || undefined,
      location: formData.location || undefined,
      dayOfWeek: formData.dayOfWeek || undefined,
    });

    setFormData({ title: '', content: '', date: '', time: '', subject: '', location: '', dayOfWeek: '' });
    setIsOpen(false);
  };

  const filteredNotes = notes.filter(n => n.type === activeTab);

  const tabs = [
    { id: 'quick' as NoteTab, label: 'Quick Notes', icon: StickyNote },
    { id: 'exam' as NoteTab, label: 'Exams', icon: GraduationCap },
    { id: 'class' as NoteTab, label: 'Class Schedule', icon: BookOpen },
  ];

  const getFormFields = () => {
    switch (activeTab) {
      case 'quick':
        return (
          <>
            <Input
              placeholder="Note title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="bg-card border-border"
            />
            <Textarea
              placeholder="Note content..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="bg-card border-border min-h-[100px]"
            />
          </>
        );
      case 'exam':
        return (
          <>
            <Input
              placeholder="Exam name"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="bg-card border-border"
            />
            <Input
              placeholder="Subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="bg-card border-border"
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="bg-card border-border"
              />
              <Input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="bg-card border-border"
              />
            </div>
            <Input
              placeholder="Location / Room"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="bg-card border-border"
            />
            <Textarea
              placeholder="Notes..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="bg-card border-border"
            />
          </>
        );
      case 'class':
        return (
          <>
            <Input
              placeholder="Class name"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="bg-card border-border"
            />
            <Input
              placeholder="Subject / Course code"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="bg-card border-border"
            />
            <Select
              value={formData.dayOfWeek}
              onValueChange={(value) => setFormData({ ...formData, dayOfWeek: value })}
            >
              <SelectTrigger className="bg-card border-border">
                <SelectValue placeholder="Select day" />
              </SelectTrigger>
              <SelectContent>
                {daysOfWeek.map((day) => (
                  <SelectItem key={day} value={day}>{day}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="bg-card border-border"
            />
            <Input
              placeholder="Location / Room"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="bg-card border-border"
            />
          </>
        );
    }
  };

  const renderNoteCard = (note: Note) => {
    const formatTime = (time?: string) => {
      if (!time) return '';
      const [hours, minutes] = time.split(':');
      const h = parseInt(hours);
      const ampm = h >= 12 ? 'PM' : 'AM';
      const hour12 = h % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    };

    return (
      <Card key={note.id} className="card-hover border-border/50">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 space-y-2">
              <h3 className="font-medium text-foreground">{note.title}</h3>
              
              {note.subject && (
                <p className="text-sm text-muted-foreground">{note.subject}</p>
              )}
              
              {note.content && (
                <p className="text-sm text-muted-foreground line-clamp-2">{note.content}</p>
              )}
              
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                {note.date && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(note.date).toLocaleDateString()}
                  </span>
                )}
                {note.dayOfWeek && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {note.dayOfWeek}
                  </span>
                )}
                {note.time && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTime(note.time)}
                  </span>
                )}
                {note.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {note.location}
                  </span>
                )}
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDeleteNote(note.id)}
              className="text-muted-foreground hover:text-destructive shrink-0"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Notes</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5">
              <Plus className="w-4 h-4" />
              Add
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle>
                {activeTab === 'quick' && 'New Quick Note'}
                {activeTab === 'exam' && 'New Exam'}
                {activeTab === 'class' && 'New Class Schedule'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {getFormFields()}
              <Button type="submit" className="w-full">Save</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-card rounded-xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-sm font-medium transition-all",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Notes List */}
      <div className="space-y-3">
        {filteredNotes.length === 0 ? (
          <Card className="border-dashed border-border/50">
            <CardContent className="py-8 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-muted flex items-center justify-center">
                {activeTab === 'quick' && <StickyNote className="w-6 h-6 text-muted-foreground" />}
                {activeTab === 'exam' && <GraduationCap className="w-6 h-6 text-muted-foreground" />}
                {activeTab === 'class' && <BookOpen className="w-6 h-6 text-muted-foreground" />}
              </div>
              <p className="text-muted-foreground text-sm">
                {activeTab === 'quick' && 'No quick notes yet'}
                {activeTab === 'exam' && 'No exams scheduled'}
                {activeTab === 'class' && 'No class schedules yet'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredNotes.map(renderNoteCard)
        )}
      </div>
    </div>
  );
}