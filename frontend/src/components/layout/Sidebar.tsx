import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { 
  Inbox, 
  CalendarDays, 
  LayoutDashboard, 
  Settings, 
  PieChart,
  ChevronLeft,
  ChevronRight,
  Plus
} from "lucide-react"
import { NavLink } from "react-router-dom"
import { useTaskStore } from "@/store/useTaskStore"
import { useTranslation } from "react-i18next"

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const { openModal } = useTaskStore()
  const { t } = useTranslation()
  const navItems = [
    { icon: Inbox, label: t('common.dashboard'), href: "/dashboard" },
    { icon: LayoutDashboard, label: t('common.projects'), href: "/projects" },
    { icon: CalendarDays, label: t('common.calendar'), href: "/calendar" },
    { icon: PieChart, label: t('common.analytics'), href: "/analytics" },
    { icon: Settings, label: t('common.settings'), href: "/settings" },
  ]

  return (
    <aside 
      className={cn(
        "relative hidden md:flex flex-col border-r bg-secondary/10 transition-all duration-300 ease-in-out h-full",
        isOpen ? "w-64" : "w-[72px]"
      )}
    >
      <div className="flex h-14 items-center justify-between px-4 py-4">
        {isOpen && (
          <div className="flex items-center gap-2 font-bold text-lg text-primary overflow-hidden">
            <img src="/taskflow_icon.png" alt="TaskFlow Logo" className="h-6 w-6 object-contain rounded-md" />
            TaskFlow
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn("h-8 w-8 text-muted-foreground ml-auto", !isOpen && "mx-auto ml-1")}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>

      <div className="px-3 py-4 flex-1 space-y-1">
        {/* Quick Add Button */}
        <Button 
          onClick={() => openModal()}
          className={cn(
            "w-full justify-start gap-2 mb-6 bg-primary/10 text-primary hover:bg-primary/20 shadow-none border-none",
            !isOpen && "justify-center px-0"
          )}
        >
          <Plus className="h-5 w-5" />
          {isOpen && "Add Task"}
        </Button>

        {/* Navigation */}
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) => cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
                !isOpen && "justify-center px-0"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {isOpen && <span className="truncate">{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  )
}
