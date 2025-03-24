
import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Moon, 
  Lock, 
  Globe, 
  HardDrive, 
  Trash2, 
  HelpCircle, 
  LogOut, 
  Shield, 
  Volume2,
  Smartphone,
  Palette,
  ChevronRight
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '@/components/ThemeToggle';

const Settings = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    theme: 'system',
    darkMode: false,
    fontSize: 'medium',
    pushNotifications: true,
    messageNotifications: true,
    callNotifications: true,
    notificationSound: 'chime',
    readReceipts: true,
    onlineStatus: true,
    dataSaver: false
  });

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const updateSetting = (key, value) => {
    const updatedSettings = { ...settings, [key]: value };
    setSettings(updatedSettings);
    localStorage.setItem('userSettings', JSON.stringify(updatedSettings));
  };

  const saveSettings = () => {
    localStorage.setItem('userSettings', JSON.stringify(settings));
    toast.success("Settings saved successfully");
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userAvatar');
    toast.success('Successfully logged out');
    navigate('/login');
  };

  const openModal = (title) => {
    toast.info(`Opening ${title} settings...`);
    // This would normally open a modal, but we're just showing a toast for now
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-8 bg-background">
      <div className="p-4 border-b bg-card sticky top-0 z-10 shadow-sm">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Settings</h1>
        </div>
      </div>
      
      <div className="px-4 py-6 space-y-6 max-w-3xl mx-auto">
        {/* Appearance */}
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border-muted/40">
          <CardHeader className="bg-gradient-to-r from-background to-muted/20 rounded-t-lg">
            <div className="flex items-center space-x-2">
              <Palette className="h-5 w-5 text-primary" />
              <CardTitle>Appearance</CardTitle>
            </div>
            <CardDescription>Customize how Chat Wave looks on your device</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="theme">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">Switch between light and dark theme</p>
              </div>
              <ThemeToggle />
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <Label htmlFor="theme-select">Theme</Label>
              <Select 
                value={settings.theme} 
                onValueChange={(value) => updateSetting('theme', value)}
              >
                <SelectTrigger id="theme-select" className="border-input/60 focus:ring-primary/40">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Set theme based on your preference or system settings
              </p>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <Label htmlFor="font-size">Font Size</Label>
              <Select 
                value={settings.fontSize} 
                onValueChange={(value) => updateSetting('fontSize', value)}
              >
                <SelectTrigger id="font-size" className="border-input/60 focus:ring-primary/40">
                  <SelectValue placeholder="Select font size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Adjust the font size for better readability
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Notifications */}
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border-muted/40">
          <CardHeader className="bg-gradient-to-r from-background to-muted/20 rounded-t-lg">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-primary" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>Manage your notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-notifications">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications when you're not in the app</p>
              </div>
              <Switch 
                id="push-notifications" 
                checked={settings.pushNotifications}
                onCheckedChange={(checked) => updateSetting('pushNotifications', checked)}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="message-notifications">Message Notifications</Label>
                <p className="text-sm text-muted-foreground">Get notified about new messages</p>
              </div>
              <Switch 
                id="message-notifications" 
                checked={settings.messageNotifications}
                onCheckedChange={(checked) => updateSetting('messageNotifications', checked)}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="call-notifications">Call Notifications</Label>
                <p className="text-sm text-muted-foreground">Get notified about incoming calls</p>
              </div>
              <Switch 
                id="call-notifications" 
                checked={settings.callNotifications}
                onCheckedChange={(checked) => updateSetting('callNotifications', checked)}
              />
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <Label htmlFor="notification-sound">Notification Sound</Label>
              <Select 
                value={settings.notificationSound} 
                onValueChange={(value) => updateSetting('notificationSound', value)}
              >
                <SelectTrigger id="notification-sound" className="border-input/60 focus:ring-primary/40">
                  <SelectValue placeholder="Select sound" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="chime">Chime</SelectItem>
                  <SelectItem value="bell">Bell</SelectItem>
                  <SelectItem value="tone">Tone</SelectItem>
                  <SelectItem value="silent">Silent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        
        {/* Privacy & Security */}
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border-muted/40">
          <CardHeader className="bg-gradient-to-r from-background to-muted/20 rounded-t-lg">
            <div className="flex items-center space-x-2">
              <Lock className="h-5 w-5 text-primary" />
              <CardTitle>Privacy & Security</CardTitle>
            </div>
            <CardDescription>Manage your privacy and security settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            <div className="rounded-md border p-3 hover:bg-muted/50 cursor-pointer flex justify-between items-center" onClick={() => openModal('Two-Factor Authentication')}>
              <div className="space-y-0.5">
                <div className="font-medium">Two-Factor Authentication</div>
                <div className="text-sm text-muted-foreground">Add an extra layer of security to your account</div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
            
            <div className="rounded-md border p-3 hover:bg-muted/50 cursor-pointer flex justify-between items-center" onClick={() => openModal('Blocked Users')}>
              <div className="space-y-0.5">
                <div className="font-medium">Blocked Users</div>
                <div className="text-sm text-muted-foreground">Manage your blocked contacts</div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
            
            <div className="rounded-md border p-3 hover:bg-muted/50 cursor-pointer flex justify-between items-center" onClick={() => openModal('Change Password')}>
              <div className="space-y-0.5">
                <div className="font-medium">Change Password</div>
                <div className="text-sm text-muted-foreground">Update your password regularly for better security</div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
            
            <div className="flex items-center justify-between p-3">
              <div className="space-y-0.5">
                <Label htmlFor="read-receipts">Read Receipts</Label>
                <p className="text-sm text-muted-foreground">Let others know when you've read their messages</p>
              </div>
              <Switch 
                id="read-receipts" 
                checked={settings.readReceipts}
                onCheckedChange={(checked) => updateSetting('readReceipts', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between p-3">
              <div className="space-y-0.5">
                <Label htmlFor="online-status">Show Online Status</Label>
                <p className="text-sm text-muted-foreground">Allow others to see when you are online</p>
              </div>
              <Switch 
                id="online-status" 
                checked={settings.onlineStatus}
                onCheckedChange={(checked) => updateSetting('onlineStatus', checked)}
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Data & Storage */}
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border-muted/40">
          <CardHeader className="bg-gradient-to-r from-background to-muted/20 rounded-t-lg">
            <div className="flex items-center space-x-2">
              <HardDrive className="h-5 w-5 text-primary" />
              <CardTitle>Data & Storage</CardTitle>
            </div>
            <CardDescription>Manage your storage and data usage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            <div className="space-y-2">
              <Label>Storage Usage</Label>
              <div className="bg-muted rounded-full h-2.5">
                <div className="bg-primary h-2.5 rounded-full w-1/3"></div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>256 MB used</span>
                <span>1 GB total</span>
              </div>
            </div>
            
            <Separator className="my-3" />
            
            <div className="rounded-md border p-3 hover:bg-muted/50 cursor-pointer flex justify-between items-center" onClick={() => openModal('Media Auto-Download')}>
              <div className="space-y-0.5">
                <div className="font-medium">Media Auto-Download</div>
                <div className="text-sm text-muted-foreground">Manage automatic media downloads</div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
            
            <div className="rounded-md border p-3 hover:bg-muted/50 cursor-pointer flex justify-between items-center" onClick={() => {
              toast.success("Cache cleared successfully");
            }}>
              <div className="space-y-0.5">
                <div className="font-medium">Clear Cache</div>
                <div className="text-sm text-muted-foreground">Free up space by clearing cached data</div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
            
            <div className="flex items-center justify-between p-3">
              <div className="space-y-0.5">
                <Label htmlFor="data-saver">Data Saver Mode</Label>
                <p className="text-sm text-muted-foreground">Reduce data usage when using the app</p>
              </div>
              <Switch 
                id="data-saver" 
                checked={settings.dataSaver}
                onCheckedChange={(checked) => updateSetting('dataSaver', checked)}
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Help & Support */}
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border-muted/40">
          <CardHeader className="bg-gradient-to-r from-background to-muted/20 rounded-t-lg">
            <div className="flex items-center space-x-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              <CardTitle>Help & Support</CardTitle>
            </div>
            <CardDescription>Get help and learn more about Chat Wave</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            <div className="rounded-md border p-3 hover:bg-muted/50 cursor-pointer flex justify-between items-center" onClick={() => openModal('Help Center')}>
              <div className="space-y-0.5">
                <div className="font-medium">Help Center</div>
                <div className="text-sm text-muted-foreground">Get answers to common questions</div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
            
            <div className="rounded-md border p-3 hover:bg-muted/50 cursor-pointer flex justify-between items-center" onClick={() => openModal('Contact Support')}>
              <div className="space-y-0.5">
                <div className="font-medium">Contact Support</div>
                <div className="text-sm text-muted-foreground">Get help from our support team</div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
            
            <div className="rounded-md border p-3 hover:bg-muted/50 cursor-pointer flex justify-between items-center" onClick={() => openModal('Privacy Policy')}>
              <div className="space-y-0.5">
                <div className="font-medium">Privacy Policy</div>
                <div className="text-sm text-muted-foreground">Read our privacy policy</div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
            
            <div className="rounded-md border p-3 hover:bg-muted/50 cursor-pointer flex justify-between items-center" onClick={() => openModal('Terms of Service')}>
              <div className="space-y-0.5">
                <div className="font-medium">Terms of Service</div>
                <div className="text-sm text-muted-foreground">Read our terms of service</div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        {/* Account */}
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 border-muted/40">
          <CardHeader className="bg-gradient-to-r from-background to-muted/20 rounded-t-lg">
            <div className="flex items-center space-x-2">
              <Smartphone className="h-5 w-5 text-primary" />
              <CardTitle>Account</CardTitle>
            </div>
            <CardDescription>Manage your account settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            <div className="rounded-md border p-3 hover:bg-muted/50 cursor-pointer flex justify-between items-center" onClick={() => openModal('Change Email')}>
              <div className="space-y-0.5">
                <div className="font-medium">Change Email</div>
                <div className="text-sm text-muted-foreground">Update your email address</div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
            
            <div className="rounded-md border p-3 hover:bg-muted/50 cursor-pointer flex justify-between items-center" onClick={() => openModal('Change Phone Number')}>
              <div className="space-y-0.5">
                <div className="font-medium">Change Phone Number</div>
                <div className="text-sm text-muted-foreground">Update your phone number</div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
            
            <div className="rounded-md border p-3 hover:bg-muted/50 cursor-pointer flex justify-between items-center text-destructive" onClick={() => {
              toast.error("Account deletion requires confirmation via email");
            }}>
              <div className="space-y-0.5">
                <div className="font-medium">Delete Account</div>
                <div className="text-sm opacity-70">Permanently delete your account and all data</div>
              </div>
              <Trash2 className="h-5 w-5" />
            </div>
          </CardContent>
          <CardFooter className="bg-gradient-to-r from-muted/20 to-background rounded-b-lg">
            <Button 
              variant="outline" 
              className="w-full shadow-sm hover:shadow-md transition-shadow duration-200" 
              onClick={saveSettings}
            >
              Save Settings
            </Button>
          </CardFooter>
        </Card>
        
        <Button 
          variant="destructive" 
          className="w-full shadow-md hover:shadow-lg transition-shadow duration-300" 
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Settings;
