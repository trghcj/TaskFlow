import { useState } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  parseISO 
} from 'date-fns';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTaskStore } from '@/store/useTaskStore';
import { cn } from '@/lib/utils';

export function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { tasks, openModal } = useTaskStore();

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const priorityColors: Record<string, string> = {
    low: "bg-blue-100 text-blue-700 border-blue-200",
    medium: "bg-amber-100 text-amber-700 border-amber-200",
    high: "bg-red-100 text-red-700 border-red-200"
  };

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between pb-6">
        <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={goToToday} className="hidden sm:flex">
            Today
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="w-40 text-center text-lg font-semibold">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={() => openModal()} className="gap-2">
            <Plus className="h-4 w-4" /> New Task
          </Button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    let startDateOfWeek = startOfWeek(currentDate);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="py-3 text-center text-sm font-medium text-muted-foreground">
          {format(addDays(startDateOfWeek, i), 'EEEE')}
        </div>
      );
    }
    return <div className="grid grid-cols-7 border-b">{days}</div>;
  };

  const renderCells = () => {
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, 'd');
        const cloneDay = day;
        
        // Find tasks for this day
        const dayTasks = tasks.filter(task => {
          if (!task.dueDate) return false;
          return isSameDay(parseISO(task.dueDate), cloneDay);
        });

        days.push(
          <div
            key={day.toString()}
            className={cn(
              "min-h-[120px] border-b border-r p-2 transition-colors hover:bg-secondary/10",
              !isSameMonth(day, monthStart) && "bg-secondary/20 text-muted-foreground",
              isSameDay(day, new Date()) && "bg-primary/5"
            )}
            onClick={() => {
              openModal();
            }}
          >
            <div className="flex justify-between">
              <span className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium",
                isSameDay(day, new Date()) ? "bg-primary text-primary-foreground" : ""
              )}>
                {formattedDate}
              </span>
            </div>
            <div className="mt-2 flex flex-col gap-1">
              {dayTasks.map(task => (
                <div 
                  key={task.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    openModal(task.id);
                  }}
                  className={cn(
                    "cursor-pointer truncate rounded px-2 py-1 text-xs font-medium border",
                    priorityColors[task.priority]
                  )}
                >
                  {task.title}
                </div>
              ))}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="flex flex-col bg-card overflow-hidden">{rows}</div>;
  };

  return (
    <div className="flex h-full flex-col">
      {renderHeader()}
      <div className="flex-1 overflow-auto rounded-xl border bg-background shadow-sm">
        {renderDays()}
        {renderCells()}
      </div>
    </div>
  );
}
