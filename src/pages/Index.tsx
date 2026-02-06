import { useState } from "react";
import { toast } from "sonner";
import { format, addDays, isAfter, isSameDay } from "date-fns";
import Header from "@/components/Header";
import DateDisplay from "@/components/DateDisplay";
import TodoItem from "@/components/TodoItem";
import TodoDivider from "@/components/TodoDivider";
import AddButton from "@/components/AddButton";
import ComingSoon from "@/components/ComingSoon";
import AddTodoDialog from "@/components/AddTodoDialog";
import AddDividerDialog from "@/components/AddDividerDialog";
import AIChat from "@/components/AIChat";
import NotesSection from "@/components/NotesSection";
import type { Todo, Divider, MoodNote, MoodType } from "@/types/todo";

const initialDividers: Divider[] = [
  { id: "morning", name: "Morning", icon: "Sun" },
  { id: "night", name: "Night", icon: "Moon" },
];

const today = format(new Date(), 'yyyy-MM-dd');

const initialTodos: Todo[] = [
  { id: "1", text: "Workout for 30 Minutes", dividerId: "morning", icon: "Dumbbell", createdAt: today, completions: [] },
  { id: "2", text: "Meditate for 10 Minutes", dividerId: "morning", icon: "PersonStanding", createdAt: today, completions: [] },
  { id: "3", text: "Read Before Sleep", dividerId: "night", icon: "BookOpen", createdAt: today, completions: [] },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState("todos");
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [dividers, setDividers] = useState<Divider[]>(initialDividers);
  const [notes, setNotes] = useState<MoodNote[]>([]);
  const [showAddTodo, setShowAddTodo] = useState(false);
  const [showAddDivider, setShowAddDivider] = useState(false);

  const handleToggleDay = (id: string, dayIndex: number) => {
    setTodos((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;

        const targetDate = addDays(new Date(t.createdAt), dayIndex);
        const todayDate = new Date();

        // Prevent toggling future dates
        if (isAfter(targetDate, todayDate) && !isSameDay(targetDate, todayDate)) {
          return t;
        }

        const dateStr = format(targetDate, 'yyyy-MM-dd');

        if (t.completions.includes(dateStr)) {
          return { ...t, completions: t.completions.filter(d => d !== dateStr) };
        } else {
          return { ...t, completions: [...t.completions, dateStr] };
        }
      })
    );
  };

  const handleEdit = (id: string, text: string) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, text } : t)));
    toast.success("Habit updated");
  };

  const handleDelete = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
    toast.success("Habit deleted");
  };

  const handleAddTodo = (text: string, dividerId: string, icon: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      dividerId,
      icon,
      createdAt: format(new Date(), 'yyyy-MM-dd'),
      completions: [],
    };
    setTodos((prev) => [...prev, newTodo]);
    toast.success("Habit added");
  };

  const handleAddDivider = (name: string, icon: string) => {
    const newDivider: Divider = {
      id: Date.now().toString(),
      name,
      icon,
    };
    setDividers((prev) => [...prev, newDivider]);
    toast.success("Section added");
  };

  const handleDeleteDivider = (id: string) => {
    setDividers((prev) => prev.filter((d) => d.id !== id));
    setTodos((prev) => prev.filter((t) => t.dividerId !== id));
    toast.success("Section and its habits deleted");
  };

  const handleAddNote = (date: string, mood: MoodType, note: string) => {
    const existingIndex = notes.findIndex(n => n.date === date);
    if (existingIndex >= 0) {
      // Update existing
      setNotes(prev => prev.map((n, i) =>
        i === existingIndex ? { ...n, mood, note } : n
      ));
      toast.success("Entry updated");
    } else {
      // Add new
      const newNote: MoodNote = {
        id: Date.now().toString(),
        date,
        mood,
        note,
        createdAt: new Date().toISOString(),
      };
      setNotes(prev => [...prev, newNote]);
      toast.success("Entry saved");
    }
  };

  const handleEditNote = (id: string, mood: MoodType, note: string) => {
    setNotes(prev => prev.map(n =>
      n.id === id ? { ...n, mood, note } : n
    ));
    toast.success("Entry updated");
  };

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    toast.success("Entry deleted");
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Subtle smoke/gradient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/3 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        <Header activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "todos" ? (
          <>
            {todos.length > 0 && (
              <DateDisplay 
                weekStart={new Date(
                  todos.reduce((oldest, todo) => 
                    todo.createdAt < oldest ? todo.createdAt : oldest, 
                    todos[0].createdAt
                  )
                )} 
              />
            )}

            <div className="space-y-4">
              {dividers.map((divider, index) => {
                const dividerTodos = todos.filter((t) => t.dividerId === divider.id);
                return (
                  <div key={divider.id} style={{ animationDelay: `${0.2 + index * 0.1}s` }}>
                    <TodoDivider divider={divider} onDelete={handleDeleteDivider} />
                    {dividerTodos.length > 0 ? (
                      <div className="space-y-3">
                        {dividerTodos.map((todo) => (
                          <TodoItem
                            key={todo.id}
                            todo={todo}
                            onToggleDay={handleToggleDay}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm italic pl-8 mb-4">
                        No habits yet
                      </p>
                    )}
                  </div>
                );
              })}

              {/* Inline Add Button */}
              <div className="pt-4">
                <AddButton
                  onAddTodo={() => setShowAddTodo(true)}
                  onAddDivider={() => setShowAddDivider(true)}
                />
              </div>
            </div>

            <AddTodoDialog
              open={showAddTodo}
              onOpenChange={setShowAddTodo}
              onAdd={handleAddTodo}
              dividers={dividers}
            />

            <AddDividerDialog
              open={showAddDivider}
              onOpenChange={setShowAddDivider}
              onAdd={handleAddDivider}
            />
          </>
        ) : activeTab === "notes" ? (
          <NotesSection
            notes={notes}
            onAddNote={handleAddNote}
            onEditNote={handleEditNote}
            onDeleteNote={handleDeleteNote}
          />
        ) : activeTab === "ai" ? (
          <AIChat todos={todos} dividers={dividers} notes={notes} />
        ) : (
          <ComingSoon section={activeTab} />
        )}
      </div>
    </div>
  );
};

export default Index;
