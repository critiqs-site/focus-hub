import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import type { Divider } from "@/types/todo";
import { getIconComponent } from "@/lib/icons";

interface TodoDividerProps {
  divider: Divider;
  onDelete: (id: string) => void;
}

const TodoDivider = ({ divider, onDelete }: TodoDividerProps) => {
  const IconComponent = getIconComponent(divider.icon);

  return (
    <div className="group flex items-center gap-3 my-8 animate-scroll-fade-in">
      <div className="p-2 rounded-xl bg-primary/10">
        <IconComponent className="h-6 w-6 text-primary" />
      </div>
      <h3 className="text-lg font-semibold text-foreground">{divider.name}</h3>
      <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
      <Button
        size="icon"
        variant="ghost"
        onClick={() => onDelete(divider.id)}
        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/20"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default TodoDivider;
