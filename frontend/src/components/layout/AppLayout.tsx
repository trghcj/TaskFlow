import { useState } from "react"
import { Outlet } from "react-router-dom"
import { Sidebar } from "./Sidebar"
import { TopNavbar } from "./TopNavbar"
import { TaskDetailsModal } from "@/components/kanban/TaskDetailsModal"
import { useTaskStore } from "@/store/useTaskStore"

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { isModalOpen, closeModal, selectedTaskId } = useTaskStore()

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
