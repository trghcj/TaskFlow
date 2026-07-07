import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '@/store/useTaskStore';
import { cn } from '@/lib/utils';
import { Calendar } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  isOverlay?: boolean;
}

export function TaskCard({ task, isOverlay }: TaskCardProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: task.id,
    data: { type: 'Task', task }
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform)
  };

  const priorityColors = {
    low: "bg-blue-100 text-blue-700 border-blue-200",
    medium: "bg-amber-100 text-amber-700 border-amber-200",
    high: "bg-red-100 text-red-700 border-red-200"
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "group relative flex cursor-grab flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm transition-all hover:shadow-md active:cursor-grabbing",
        isDragging && "opacity-50",
        isOverlay && "rotate-2 scale-105 shadow-xl cursor-grabbing"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-medium leading-tight">{task.title}</h4>
      </div>
      
      {task.description && (
        <p className="line-clamp-2 text-xs text-muted-foreground">{task.description}</p>
      )}

      <div className="mt-1 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={cn("px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border", priorityColors[task.priority])}>
            {task.priority}
          </span>
          {task.dueDate && (
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="mr-1 h-3 w-3" />
              {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </div>
          )}
        </div>
        <div className="h-6 w-6 rounded-full bg-secondary/50 flex items-center justify-center text-[10px] font-bold text-muted-foreground">
          U
        </div>
      </div>
    </div>
  );
}
