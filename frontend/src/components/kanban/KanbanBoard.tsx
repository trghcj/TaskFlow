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

const COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'review', title: 'Review' },
  { id: 'completed', title: 'Completed' },
];

export function KanbanBoard() {
  const { data: tasks = [] } = useTasks();
  const { mutate: updateTask } = useUpdateTask();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

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
    <div className="flex h-full w-full gap-6 overflow-x-auto pb-4 relative">
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
  );
}
