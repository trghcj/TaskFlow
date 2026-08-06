import { useState } from 'react';
import { 
  DndContext, 
  DragOverlay, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors, 
  type DragStartEvent, 
  type DragEndEvent 
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { KanbanColumn } from './KanbanColumn';
import { TaskCard } from './TaskCard';
import { type Task, type TaskStatus } from '@/store/useTaskStore';
import { useTasks, useUpdateTask } from '@/hooks/useTasks';

import Confetti from 'react-confetti';
import { useParseTaskAI } from '@/hooks/useAI';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Wand2, Loader2 } from 'lucide-react';
import { useCreateTask } from '@/hooks/useTasks';
const COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'review', title: 'Review' },
  { id: 'completed', title: 'Completed' },
];

export function KanbanBoard() {
  const { data: tasks = [] } = useTasks();
  const { mutate: updateTask } = useUpdateTask();
  const { mutate: createTask } = useCreateTask();
  const { mutate: parseTask, isPending: isParsing } = useParseTaskAI();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [smartTaskInput, setSmartTaskInput] = useState('');

  const handleSmartCreate = () => {
    if (!smartTaskInput.trim()) return;
    parseTask(smartTaskInput, {
      onSuccess: (parsed) => {
        createTask({
          title: parsed.title,
          due_date: parsed.due_date || undefined,
          due_time: parsed.due_time || undefined,
          priority: parsed.priority as 'low' | 'medium' | 'high',
          status: 'todo',
          reminder_offset: 0
        });
        setSmartTaskInput('');
      }
    });
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find(t => t.id === active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    
    if (!over) return;
    
    const taskId = active.id as string;
    const overId = over.id as string;
    
    // Check if dropping over a column
    const isOverColumn = COLUMNS.some(col => col.id === overId);
    
    let targetStatus = '';

    if (isOverColumn) {
      targetStatus = overId;
    } else {
      // Check if dropping over a task
      const overTask = tasks.find(t => t.id === overId);
      if (overTask && overTask.status !== (activeTask?.status || 'todo')) {
        targetStatus = overTask.status;
      }
    }

    if (targetStatus) {
      updateTask({ id: taskId, updates: { status: targetStatus as TaskStatus } });
      
      // Trigger confetti if moving to completed
      if (targetStatus === 'completed' && activeTask?.status !== 'completed') {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    }
  };

  return (
    <div className="flex flex-col h-full w-full gap-4 pb-4">
      <div className="flex items-center gap-2 max-w-xl mx-auto w-full bg-background/50 p-2 rounded-lg border shadow-sm mt-2">
        <Input 
          placeholder="✨ Try 'Buy groceries tomorrow at 5pm'..." 
          value={smartTaskInput} 
          onChange={(e) => setSmartTaskInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSmartCreate();
            }
          }}
          className="border-0 shadow-none focus-visible:ring-0 text-md"
        />
        <Button size="sm" onClick={handleSmartCreate} disabled={isParsing || !smartTaskInput.trim()} className="shrink-0 bg-primary/10 text-primary hover:bg-primary/20">
          {isParsing ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Wand2 className="w-4 h-4 mr-1" />}
          Smart Create
        </Button>
      </div>

      <div className="flex flex-1 gap-6 overflow-x-auto relative px-2">
        {showConfetti && (
          <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
            <Confetti 
              width={window.innerWidth} 
              height={window.innerHeight} 
              recycle={false}
              numberOfPieces={400}
              gravity={0.15}
            />
          </div>
        )}
        <DndContext 
          sensors={sensors} 
          collisionDetection={closestCorners} 
          onDragStart={handleDragStart} 
          onDragEnd={handleDragEnd}
        >
          {COLUMNS.map(col => (
            <KanbanColumn 
              key={col.id} 
              id={col.id} 
              title={col.title} 
              tasks={tasks.filter(t => t.status === col.id)} 
            />
          ))}
          
          <DragOverlay>
            {activeTask ? <TaskCard task={activeTask} isOverlay /> : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
