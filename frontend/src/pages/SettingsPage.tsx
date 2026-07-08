import { useEffect, useState, useRef } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { updateProfile, updateEmail } from "firebase/auth";
import apiClient from "@/api/axios";
import { useSettingsStore } from "@/store/useSettingsStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LogOut, User, Bell, Palette, Loader2 } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getSettings, updateSettings } from "@/api/settings";
import { useTranslation } from "react-i18next";

export function SettingsPage() {
  const { t } = useTranslation();
  const { user, signOut, updateUser } = useAuthStore();
  const [isUploading, setIsUploading] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isGoogleUser = user?.providerData?.some(p => p.providerId === 'google.com');
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");
  const { 
    theme, 
    setTheme, 
    emailNotifications, 
    setEmailNotifications,
    dueDateReminders,
    setDueDateReminders,
    productUpdates,
    setProductUpdates,
    language,
    setLanguage,
    timezone,
    setTimezone,
    setAllSettings
  } = useSettingsStore();

  const { data: serverSettings } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings,
  });

  const mutation = useMutation({
    mutationFn: updateSettings,
  });

  // Sync initial server state to local state
  useEffect(() => {
    if (serverSettings) {
      setAllSettings({
        theme: serverSettings.theme,
        emailNotifications: serverSettings.email_notifications,
        dueDateReminders: serverSettings.due_date_reminders,
        productUpdates: serverSettings.product_updates,
        language: serverSettings.language || "English (US)",
        timezone: serverSettings.timezone || "Pacific Time (PT)",
      });
    }
  }, [serverSettings, setAllSettings]);

  const handleThemeChange = (checked: boolean) => {
    const newTheme = checked ? 'dark' : 'light';
    setTheme(newTheme);
    mutation.mutate({ theme: newTheme });
  };

  const handleEmailChange = (checked: boolean) => {
    setEmailNotifications(checked);
    mutation.mutate({ email_notifications: checked });
  };

  const handleDueDateChange = (checked: boolean) => {
    setDueDateReminders(checked);
    mutation.mutate({ due_date_reminders: checked });
  };

  const handleProductUpdatesChange = (checked: boolean) => {
    setProductUpdates(checked);
    mutation.mutate({ product_updates: checked });
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    mutation.mutate({ language: value });
  };

  const handleTimezoneChange = (value: string) => {
    setTimezone(value);
    mutation.mutate({ timezone: value });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      
      const response = await apiClient.post<{photoURL: string}>("/users/me/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      const photoURL = response.data.photoURL;
      
      await updateProfile(user, { photoURL });
      updateUser({ photoURL });
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    try {
      setIsSavingProfile(true);
      if (displayName !== user.displayName) {
        await updateProfile(user, { displayName });
      }
      if (email !== user.email) {
        await updateEmail(user, email);
      }
      await apiClient.put("/users/me", { display_name: displayName, email });
      updateUser({ displayName, email });
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsSavingProfile(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 h-full max-w-4xl mx-auto w-full pb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('settings.title')}</h1>
        <p className="text-muted-foreground mt-2">{t('settings.subtitle')}</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent mb-6 gap-6 overflow-x-auto overflow-y-hidden">
          <TabsTrigger 
            value="profile" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-2 py-3 whitespace-nowrap"
          >
            <User className="h-4 w-4 mr-2" /> {t('settings.profile')}
          </TabsTrigger>
          <TabsTrigger 
            value="preferences" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-2 py-3 whitespace-nowrap"
          >
            <Palette className="h-4 w-4 mr-2" /> {t('settings.preferences')}
          </TabsTrigger>
          <TabsTrigger 
            value="notifications" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-2 py-3 whitespace-nowrap"
          >
            <Bell className="h-4 w-4 mr-2" /> {t('settings.notifications')}
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <div className="rounded-xl border bg-card shadow-sm">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">{t('settings.personalInfo')}</h3>
              <p className="text-sm text-muted-foreground">{t('settings.personalInfoDesc')}</p>
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
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleFileChange}
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {t('settings.changePhoto')}
                  </Button>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('settings.fullName')}</Label>
                  <Input id="name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} disabled={isGoogleUser} />
                  {isGoogleUser && <p className="text-xs text-muted-foreground">{t('settings.syncedGoogle')}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t('settings.emailAddress')}</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isGoogleUser} />
                </div>
              </div>
              {!isGoogleUser && (
                <Button onClick={handleSaveProfile} disabled={isSavingProfile}>
                  {isSavingProfile ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Save Profile
                </Button>
              )}
            </div>
          </div>

          <div className="rounded-xl border bg-red-50 dark:bg-red-950/20 shadow-sm border-red-100 dark:border-red-900/50">
            <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-red-700 dark:text-red-400">Sign Out</h3>
                <p className="text-sm text-red-600/80 dark:text-red-400/80">Log out of your TaskFlow account on this device.</p>
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
              <h3 className="text-lg font-semibold mb-4">{t('settings.appearance')}</h3>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">{t('settings.darkMode')}</Label>
                  <p className="text-sm text-muted-foreground">{t('settings.darkModeDesc')}</p>
                </div>
                <Switch 
                  checked={theme === 'dark'}
                  onCheckedChange={handleThemeChange}
                />
              </div>
            </div>
            <hr />
            <div>
              <h3 className="text-lg font-semibold mb-4">{t('settings.languageRegion')}</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>{t('settings.language')}</Label>
                  <Select value={language} onValueChange={handleLanguageChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English (US)">English (US)</SelectItem>
                      <SelectItem value="Spanish">Spanish</SelectItem>
                      <SelectItem value="French">French</SelectItem>
                      <SelectItem value="German">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{t('settings.timezone')}</Label>
                  <Select value={timezone} onValueChange={handleTimezoneChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pacific Time (PT)">Pacific Time (PT)</SelectItem>
                      <SelectItem value="Eastern Time (ET)">Eastern Time (ET)</SelectItem>
                      <SelectItem value="Coordinated Universal Time (UTC)">Coordinated Universal Time (UTC)</SelectItem>
                      <SelectItem value="Central European Time (CET)">Central European Time (CET)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <div className="rounded-xl border bg-card shadow-sm p-6 space-y-6">
            <h3 className="text-lg font-semibold">{t('settings.notificationPrefs')}</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">{t('settings.emailNotifications')}</Label>
                  <p className="text-sm text-muted-foreground">{t('settings.emailNotificationsDesc')}</p>
                </div>
                <Switch 
                  checked={emailNotifications}
                  onCheckedChange={handleEmailChange}
                />
              </div>
              <hr />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">{t('settings.dueDateReminders')}</Label>
                  <p className="text-sm text-muted-foreground">{t('settings.dueDateRemindersDesc')}</p>
                </div>
                <Switch 
                  checked={dueDateReminders}
                  onCheckedChange={handleDueDateChange}
                />
              </div>
              <hr />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">{t('settings.productUpdates')}</Label>
                  <p className="text-sm text-muted-foreground">{t('settings.productUpdatesDesc')}</p>
                </div>
                <Switch 
                  checked={productUpdates}
                  onCheckedChange={handleProductUpdatesChange}
                />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
