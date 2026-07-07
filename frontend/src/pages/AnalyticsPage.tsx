import { useTaskStore } from '@/store/useTaskStore';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

export function AnalyticsPage() {
  const { tasks } = useTaskStore();

  // Data processing for Status Pie Chart
  const statusCounts = {
    todo: 0,
    'in-progress': 0,
    review: 0,
    completed: 0
  };
  
  // Data processing for Priority Bar Chart
  const priorityCounts = {
    low: 0,
    medium: 0,
    high: 0
  };

  tasks.forEach(task => {
    statusCounts[task.status]++;
    priorityCounts[task.priority]++;
  });

  const statusData = [
    { name: 'To Do', value: statusCounts.todo, color: '#94a3b8' }, // slate-400
    { name: 'In Progress', value: statusCounts['in-progress'], color: '#3b82f6' }, // blue-500
    { name: 'Review', value: statusCounts.review, color: '#f59e0b' }, // amber-500
    { name: 'Completed', value: statusCounts.completed, color: '#10b981' } // emerald-500
  ];

  const priorityData = [
    { name: 'Low', count: priorityCounts.low, fill: '#3b82f6' },
    { name: 'Medium', count: priorityCounts.medium, fill: '#f59e0b' },
    { name: 'High', count: priorityCounts.high, fill: '#ef4444' }
  ];

  const totalTasks = tasks.length;
  const completionRate = totalTasks === 0 ? 0 : Math.round((statusCounts.completed / totalTasks) * 100);

  return (
    <div className="flex flex-col gap-6 h-full pb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics Overview</h1>
        <p className="text-muted-foreground mt-2">Track your project progress and task distribution.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground">Total Tasks</h3>
          <div className="mt-2 text-3xl font-bold">{totalTasks}</div>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground">Completion Rate</h3>
          <div className="mt-2 text-3xl font-bold">{completionRate}%</div>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground">In Progress</h3>
          <div className="mt-2 text-3xl font-bold text-blue-600">{statusCounts['in-progress']}</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2 mt-4">
        {/* Status Pie Chart */}
        <div className="rounded-xl border bg-card p-6 shadow-sm flex flex-col">
          <h3 className="font-semibold mb-6">Task Distribution by Status</h3>
          <div className="h-[300px] w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Bar Chart */}
        <div className="rounded-xl border bg-card p-6 shadow-sm flex flex-col">
          <h3 className="font-semibold mb-6">Tasks by Priority Level</h3>
          <div className="h-[300px] w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={priorityData}
                margin={{ top: 20, right: 30, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
