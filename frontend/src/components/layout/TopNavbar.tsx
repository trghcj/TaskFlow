import { Search, Bell, Menu, LogOut, Settings, BellRing } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/store/useAuthStore"
import { Task } from "@/store/useTaskStore"
import { useTasks } from "@/hooks/useTasks"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface TopNavbarProps {
  toggleSidebar: () => void
}

export function TopNavbar({ toggleSidebar }: TopNavbarProps) {
  const { user, signOut } = useAuthStore()
  const { data: tasks = [] } = useTasks()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredTasks = searchQuery.trim() === "" 
    ? [] 
    : tasks.filter((task: Task) => task.title.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleSelectTask = (_taskId: string) => {
    setSearchQuery("")
    // If we had a task detail view, we'd navigate there. For now, go to dashboard.
    navigate("/dashboard")
  }

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
      <Button 
        variant="ghost" 
        size="icon" 
        className="md:hidden" 
        onClick={toggleSidebar}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>

      {/* Global Search */}
      <div className="flex-1 max-w-md ml-auto md:ml-0 hidden md:flex items-center relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <input 
          type="search" 
          placeholder={t('common.searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-secondary/20 rounded-lg border-none pl-9 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-shadow"
        />
        {searchQuery.trim() !== "" && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-card border rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task: Task) => (
                <button
                  key={task.id}
                  onClick={() => handleSelectTask(task.id)}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-secondary/50 focus:bg-secondary/50 outline-none flex flex-col"
                >
                  <span className="font-medium">{task.title}</span>
                  {task.due_date && <span className="text-xs text-muted-foreground">Due: {task.due_date}</span>}
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-muted-foreground text-center">
                {t('common.noResults')}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="ml-auto flex items-center gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="text-muted-foreground relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h4 className="font-semibold text-sm">Notifications</h4>
              <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-muted-foreground hover:text-primary">
                Mark all read
              </Button>
            </div>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <BellRing className="h-6 w-6 text-primary" />
              </div>
              <h5 className="font-medium text-sm">You're all caught up!</h5>
              <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
                Check back later for new tasks, due dates, and product updates.
              </p>
            </div>
          </PopoverContent>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button 
              className="h-8 w-8 rounded-full overflow-hidden border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              title="User menu"
            >
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                  {user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
                </div>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.displayName || "User"}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/settings" className="cursor-pointer flex items-center w-full">
                <Settings className="mr-2 h-4 w-4" />
                <span>{t('common.settings')}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut} className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/50 cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>{t('common.signOut')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
