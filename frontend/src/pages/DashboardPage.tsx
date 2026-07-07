import { useAuthStore } from "@/store/useAuthStore"
import { Button } from "@/components/ui/button"

export function DashboardPage() {
  const { user, signOut } = useAuthStore()

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p>Welcome, {user?.displayName}!</p>
      <Button onClick={signOut} className="mt-4">Sign Out</Button>
    </div>
  )
}
