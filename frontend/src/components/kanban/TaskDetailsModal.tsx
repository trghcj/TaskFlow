import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useTasks, useCreateTask, useUpdateTask, useCreateSubTask, useUpdateSubTask, useDeleteSubTask } from "@/hooks/useTasks";
import { useBreakdownTaskAI } from "@/hooks/useAI";
import { Wand2, Loader2 } from "lucide-react";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["todo", "in-progress", "review", "completed"]),
  priority: z.enum(["low", "medium", "high"]),
  due_date: z.string().optional(),
  due_time: z.string().optional(),
  reminder_offset: z.number().optional(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface TaskDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string | null; 
}

export function TaskDetailsModal({ isOpen, onClose, taskId }: TaskDetailsModalProps) {
  const { data: tasks = [] } = useTasks();
  const { mutate: createTask } = useCreateTask();
  const { mutate: updateTask } = useUpdateTask();
  const existingTask = taskId ? tasks.find((t) => t.id === taskId) : null;

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
      due_date: "",
      due_time: "",
      reminder_offset: 0,
    },
  });

  useEffect(() => {
    if (existingTask) {
      form.reset({
        title: existingTask.title,
        description: existingTask.description || "",
        status: existingTask.status,
        priority: existingTask.priority,
        due_date: existingTask.due_date || "",
        due_time: existingTask.due_time || "",
        reminder_offset: existingTask.reminder_offset || 0,
      });
    } else {
      form.reset({
        title: "",
        description: "",
        status: "todo",
        priority: "medium",
        due_date: "",
        due_time: "",
        reminder_offset: 0,
      });
    }
  }, [existingTask, form, isOpen]);

  const { mutate: createSubTask } = useCreateSubTask();
  const { mutate: updateSubTask } = useUpdateSubTask();
  const { mutate: deleteSubTask } = useDeleteSubTask();
  const { mutate: breakdownTask, isPending: isBreakingDown } = useBreakdownTaskAI();
  
  const [newSubTaskTitle, setNewSubTaskTitle] = useState("");

  const handleAddSubTask = () => {
    if (newSubTaskTitle.trim() && existingTask) {
      createSubTask({ taskId: existingTask.id, title: newSubTaskTitle.trim() });
      setNewSubTaskTitle("");
    }
  };

  const handleMagicBreakdown = () => {
    if (existingTask) {
      breakdownTask({ 
        title: existingTask.title, 
        description: existingTask.description, 
        taskId: existingTask.id 
      });
    }
  };

  const onSubmit = (data: TaskFormValues) => {
    if (existingTask) {
      updateTask({ id: existingTask.id, updates: data });
    } else {
      createTask(data);
    }
    onClose();
  };

  const subtasks = existingTask?.subtasks || [];
  const completedSubtasks = subtasks.filter(st => st.is_completed).length;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{existingTask ? "Edit Task" : "Create New Task"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Task title..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Add a more detailed description..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="todo">To Do</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="review">Review</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="due_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="due_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="reminder_offset"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reminder</FormLabel>
                  <Select onValueChange={(val) => field.onChange(parseInt(val, 10))} value={field.value?.toString() || "0"}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select reminder offset" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0">At time of due</SelectItem>
                      <SelectItem value="15">15 minutes before</SelectItem>
                      <SelectItem value="30">30 minutes before</SelectItem>
                      <SelectItem value="60">1 hour before</SelectItem>
                      <SelectItem value="1440">1 day before</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Subtasks Section */}
            {existingTask && (
              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Sub-tasks</h4>
                  <div className="flex items-center gap-4">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleMagicBreakdown} 
                      disabled={isBreakingDown}
                      className="h-8 text-primary font-medium bg-primary/10 hover:bg-primary/20"
                    >
                      {isBreakingDown ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Wand2 className="w-4 h-4 mr-2" />}
                      Magic Breakdown
                    </Button>
                    <span className="text-xs text-muted-foreground">{completedSubtasks}/{subtasks.length}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {subtasks.map(subtask => (
                    <div key={subtask.id} className="flex items-center justify-between gap-2 bg-secondary/20 p-2 rounded-md">
                      <div className="flex items-center gap-3">
                        <Checkbox 
                          checked={subtask.is_completed} 
                          onCheckedChange={(checked) => updateSubTask({ id: subtask.id, updates: { is_completed: checked as boolean } })} 
                        />
                        <span className={`text-sm ${subtask.is_completed ? 'line-through text-muted-foreground' : ''}`}>
                          {subtask.title}
                        </span>
                      </div>
                      <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive shrink-0" onClick={() => deleteSubTask(subtask.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <Input 
                    placeholder="Add a subtask..." 
                    value={newSubTaskTitle} 
                    onChange={(e) => setNewSubTaskTitle(e.target.value)} 
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSubTask();
                      }
                    }}
                    className="flex-1"
                  />
                  <Button type="button" variant="secondary" size="icon" onClick={handleAddSubTask}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">{existingTask ? "Save Changes" : "Create Task"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
