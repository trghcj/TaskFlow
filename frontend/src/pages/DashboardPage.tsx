import { useAuthStore } from "@/store/useAuthStore"
import { useTaskStore } from "@/store/useTaskStore"
import { TaskCard } from "@/components/kanban/TaskCard"

export function DashboardPage() {
  const { user } = useAuthStore()
  const { tasks } = useTaskStore()
  
  const todayTasks = tasks.filter(t => t.status !== 'completed')

  return (
    <div className="flex h-full flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Good morning, {user?.displayName?.split(' ')[0] || "there"}!</h1>
        <p className="text-muted-foreground mt-2">Here's a look at what's on your plate today.</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="col-span-full xl:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">Up Next</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {todayTasks.slice(0, 4).map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
