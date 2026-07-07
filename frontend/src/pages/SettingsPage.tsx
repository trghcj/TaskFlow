import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, User, Bell, Palette } from "lucide-react";

export function SettingsPage() {
  const { user, signOut } = useAuthStore();

  return (
    <div className="flex flex-col gap-8 h-full max-w-4xl mx-auto w-full pb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account settings and preferences.</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent mb-6 gap-6">
          <TabsTrigger 
            value="profile" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-2 py-3"
          >
            <User className="h-4 w-4 mr-2" /> Profile
          </TabsTrigger>
          <TabsTrigger 
            value="preferences" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-2 py-3"
          >
            <Palette className="h-4 w-4 mr-2" /> Preferences
          </TabsTrigger>
          <TabsTrigger 
            value="notifications" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-2 py-3"
          >
            <Bell className="h-4 w-4 mr-2" /> Notifications
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <div className="rounded-xl border bg-card shadow-sm">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">Personal Information</h3>
              <p className="text-sm text-muted-foreground">Update your photo and personal details here.</p>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-6">
                <div className="h-24 w-24 rounded-full bg-secondary flex items-center justify-center overflow-hidden border-2 border-primary/20">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-4xl text-muted-foreground uppercase">{user?.email?.charAt(0)}</span>
                  )}
                </div>
                <div className="space-y-2">
                  <Button variant="outline">Change Photo</Button>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue={user?.displayName || ""} disabled />
                  <p className="text-xs text-muted-foreground">Synced via Google Auth.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue={user?.email || ""} disabled />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-red-50 shadow-sm border-red-100">
            <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-red-700">Sign Out</h3>
                <p className="text-sm text-red-600/80">Log out of your TaskFlow account on this device.</p>
              </div>
              <Button variant="destructive" onClick={signOut} className="gap-2">
                <LogOut className="h-4 w-4" /> Sign Out
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <div className="rounded-xl border bg-card shadow-sm p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Appearance</h3>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">Switch between light and dark themes.</p>
                </div>
                <Switch />
              </div>
            </div>
            <hr />
            <div>
              <h3 className="text-lg font-semibold mb-4">Language & Region</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Input defaultValue="English (US)" disabled />
                </div>
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Input defaultValue="Pacific Time (PT)" disabled />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <div className="rounded-xl border bg-card shadow-sm p-6 space-y-6">
            <h3 className="text-lg font-semibold">Notification Preferences</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive a daily digest of tasks.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <hr />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Due Date Reminders</Label>
                  <p className="text-sm text-muted-foreground">Get alerted when a task is due soon.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <hr />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Product Updates</Label>
                  <p className="text-sm text-muted-foreground">Hear about new TaskFlow features.</p>
                </div>
                <Switch />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
