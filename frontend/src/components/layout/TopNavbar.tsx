import { Search, Bell, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/store/useAuthStore"

interface TopNavbarProps {
  toggleSidebar: () => void
}

export function TopNavbar({ toggleSidebar }: TopNavbarProps) {
  const { user, signOut } = useAuthStore()

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
          placeholder="Search tasks..." 
          className="w-full bg-secondary/20 rounded-lg border-none pl-9 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-shadow"
        />
      </div>

      <div className="ml-auto flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Bell className="h-5 w-5" />
        </Button>
        <button 
          onClick={signOut}
          className="h-8 w-8 rounded-full overflow-hidden border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          title="Sign out"
        >
          {user?.photoURL ? (
            <img src={user.photoURL} alt="Profile" className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              {user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
            </div>
          )}
        </button>
      </div>
    </header>
  )
}
