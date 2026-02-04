import { Plus, ListTodo, Divide } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AddButtonProps {
  onAddTodo: () => void;
  onAddDivider: () => void;
}

const AddButton = ({ onAddTodo, onAddDivider }: AddButtonProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="w-full glass-card border-dashed border-2 border-primary/30 hover:border-primary/60 p-6 flex flex-col items-center justify-center gap-2 transition-all duration-300 hover:bg-primary/5 cursor-pointer group animate-scroll-fade-in">
          <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 group-hover:orange-glow transition-all duration-300">
            <Plus className="h-6 w-6 text-primary" />
          </div>
          <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
            Add new item
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="center"
        className="glass-card border-primary/20 bg-card/95 backdrop-blur-xl z-50"
      >
        <DropdownMenuItem
          onClick={onAddTodo}
          className="cursor-pointer hover:bg-primary/20 focus:bg-primary/20 flex flex-col items-start py-3"
        >
          <div className="flex items-center">
            <ListTodo className="mr-2 h-4 w-4 text-primary" />
            <span className="font-medium">New Habit</span>
          </div>
          <span className="text-xs text-muted-foreground ml-6">Track a daily activity</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onAddDivider}
          className="cursor-pointer hover:bg-primary/20 focus:bg-primary/20 flex flex-col items-start py-3"
        >
          <div className="flex items-center">
            <Divide className="mr-2 h-4 w-4 text-primary" />
            <span className="font-medium">New Section</span>
          </div>
          <span className="text-xs text-muted-foreground ml-6">Group habits by time of day</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AddButton;
