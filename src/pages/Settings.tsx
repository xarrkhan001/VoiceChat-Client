
import React from 'react';
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
import { toast } from '@/hooks/use-toast';

const Settings = () => {
  const saveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your settings have been saved successfully.",
    });
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-8">
      <div className="p-4 border-b bg-card sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Settings</h1>
        </div>
      </div>
      
      <div className="px-4 py-6 space-y-6 max-w-3xl mx-auto">
        {/* Appearance */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Palette className="h-5 w-5 text-primary" />
              <CardTitle>Appearance</CardTitle>
            </div>
            <CardDescription>Customize how Chat Wave looks on your device</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="theme">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">Switch between light and dark theme</p>
              </div>
              <Switch id="theme" />
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <Label htmlFor="theme-select">Theme</Label>
              <Select defaultValue="system">
                <SelectTrigger id="theme-select">
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
              <Select defaultValue="medium">
                <SelectTrigger id="font-size">
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
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-primary" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>Manage your notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-notifications">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications when you're not in the app</p>
              </div>
              <Switch id="push-notifications" defaultChecked />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="message-notifications">Message Notifications</Label>
                <p className="text-sm text-muted-foreground">Get notified about new messages</p>
              </div>
              <Switch id="message-notifications" defaultChecked />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="call-notifications">Call Notifications</Label>
                <p className="text-sm text-muted-foreground">Get notified about incoming calls</p>
              </div>
              <Switch id="call-notifications" defaultChecked />
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <Label htmlFor="notification-sound">Notification Sound</Label>
              <Select defaultValue="chime">
                <SelectTrigger id="notification-sound">
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
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Lock className="h-5 w-5 text-primary" />
              <CardTitle>Privacy & Security</CardTitle>
            </div>
            <CardDescription>Manage your privacy and security settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-md border p-3 hover:bg-muted/50 cursor-pointer flex justify-between items-center">
              <div className="space-y-0.5">
                <div className="font-medium">Two-Factor Authentication</div>
                <div className="text-sm text-muted-foreground">Add an extra layer of security to your account</div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
            
            <div className="rounded-md border p-3 hover:bg-muted/50 cursor-pointer flex justify-between items-center">
              <div className="space-y-0.5">
                <div className="font-medium">Blocked Users</div>
                <div className="text-sm text-muted-foreground">Manage your blocked contacts</div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
            
            <div className="rounded-md border p-3 hover:bg-muted/50 cursor-pointer flex justify-between items-center">
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
              <Switch id="read-receipts" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between p-3">
              <div className="space-y-0.5">
                <Label htmlFor="online-status">Show Online Status</Label>
                <p className="text-sm text-muted-foreground">Allow others to see when you are online</p>
              </div>
              <Switch id="online-status" defaultChecked />
            </div>
          </CardContent>
        </Card>
        
        {/* Data & Storage */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <HardDrive className="h-5 w-5 text-primary" />
              <CardTitle>Data & Storage</CardTitle>
            </div>
            <CardDescription>Manage your storage and data usage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
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
            
            <div className="rounded-md border p-3 hover:bg-muted/50 cursor-pointer flex justify-between items-center">
              <div className="space-y-0.5">
                <div className="font-medium">Media Auto-Download</div>
                <div className="text-sm text-muted-foreground">Manage automatic media downloads</div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
            
            <div className="rounded-md border p-3 hover:bg-muted/50 cursor-pointer flex justify-between items-center">
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
              <Switch id="data-saver" />
            </div>
          </CardContent>
        </Card>
        
        {/* Help & Support */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              <CardTitle>Help & Support</CardTitle>
            </div>
            <CardDescription>Get help and learn more about Chat Wave</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-md border p-3 hover:bg-muted/50 cursor-pointer flex justify-between items-center">
              <div className="space-y-0.5">
                <div className="font-medium">Help Center</div>
                <div className="text-sm text-muted-foreground">Get answers to common questions</div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
            
            <div className="rounded-md border p-3 hover:bg-muted/50 cursor-pointer flex justify-between items-center">
              <div className="space-y-0.5">
                <div className="font-medium">Contact Support</div>
                <div className="text-sm text-muted-foreground">Get help from our support team</div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
            
            <div className="rounded-md border p-3 hover:bg-muted/50 cursor-pointer flex justify-between items-center">
              <div className="space-y-0.5">
                <div className="font-medium">Privacy Policy</div>
                <div className="text-sm text-muted-foreground">Read our privacy policy</div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
            
            <div className="rounded-md border p-3 hover:bg-muted/50 cursor-pointer flex justify-between items-center">
              <div className="space-y-0.5">
                <div className="font-medium">Terms of Service</div>
                <div className="text-sm text-muted-foreground">Read our terms of service</div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        {/* Account */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Smartphone className="h-5 w-5 text-primary" />
              <CardTitle>Account</CardTitle>
            </div>
            <CardDescription>Manage your account settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-md border p-3 hover:bg-muted/50 cursor-pointer flex justify-between items-center">
              <div className="space-y-0.5">
                <div className="font-medium">Change Email</div>
                <div className="text-sm text-muted-foreground">Update your email address</div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
            
            <div className="rounded-md border p-3 hover:bg-muted/50 cursor-pointer flex justify-between items-center">
              <div className="space-y-0.5">
                <div className="font-medium">Change Phone Number</div>
                <div className="text-sm text-muted-foreground">Update your phone number</div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
            
            <div className="rounded-md border p-3 hover:bg-muted/50 cursor-pointer flex justify-between items-center text-destructive">
              <div className="space-y-0.5">
                <div className="font-medium">Delete Account</div>
                <div className="text-sm opacity-70">Permanently delete your account and all data</div>
              </div>
              <Trash2 className="h-5 w-5" />
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={saveSettings}>
              Save Settings
            </Button>
          </CardFooter>
        </Card>
        
        <Button variant="destructive" className="w-full">
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Settings;
