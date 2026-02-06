import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Loader2 } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useTodos } from "@/hooks/useTodos";
import { useNotes } from "@/hooks/useNotes";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("todos");
  const [showAddTodo, setShowAddTodo] = useState(false);
  const [showAddDivider, setShowAddDivider] = useState(false);

  const {
    todos,
    dividers,
    loading: todosLoading,
    handleToggleDay,
    handleEdit,
    handleDelete,
    handleAddTodo,
    handleAddDivider,
    handleDeleteDivider,
  } = useTodos(user?.id);

  const {
    notes,
    loading: notesLoading,
    handleAddNote,
    handleEditNote,
    handleDeleteNote,
  } = useNotes(user?.id);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const isLoading = todosLoading || notesLoading;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Subtle smoke/gradient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/3 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* Sign out button */}
        <div className="flex justify-end mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={signOut}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign out
          </Button>
        </div>

        <Header activeTab={activeTab} onTabChange={setActiveTab} />

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : activeTab === "todos" ? (
          <>
            {todos.length > 0 && (
              <DateDisplay
                weekStart={new Date(
                  todos.reduce(
                    (oldest, todo) =>
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
