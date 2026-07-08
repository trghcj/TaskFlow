import { Outlet, Navigate } from "react-router-dom"
import { useEffect } from "react"
import { useAuthStore } from "@/store/useAuthStore"
import { Sidebar } from "./Sidebar"
import { useQuery } from "@tanstack/react-query"
import { getSettings } from "@/api/settings"
import { useSettingsStore } from "@/store/useSettingsStore"
import { TopNavbar } from "./TopNavbar"
import { TaskDetailsModal } from "@/components/kanban/TaskDetailsModal"
import { useTaskStore } from "@/store/useTaskStore"
import { useState } from "react"

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { user } = useAuthStore()
  const { isModalOpen, closeModal, selectedTaskId } = useTaskStore()
  const setAllSettings = useSettingsStore((state) => state.setAllSettings)

  const { data: serverSettings } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings,
    enabled: !!user,
  })

  useEffect(() => {
    if (serverSettings) {
      setAllSettings({
        theme: serverSettings.theme,
        emailNotifications: serverSettings.email_notifications,
        dueDateReminders: serverSettings.due_date_reminders,
        productUpdates: serverSettings.product_updates,
      })
    }
  }, [serverSettings, setAllSettings])

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopNavbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-auto p-6 md:p-8 bg-background">
          <Outlet />
        </main>
      </div>
      
      {/* Global Modals */}
      <TaskDetailsModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        taskId={selectedTaskId} 
      />
    </div>
  )
}
