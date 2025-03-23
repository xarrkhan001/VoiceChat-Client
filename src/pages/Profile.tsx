
import React, { useState, useRef, useEffect } from 'react';
import { Camera, Edit, Save, Pencil, ChevronRight, Paperclip, Upload } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState('https://i.pravatar.cc/150?img=3');
  const [showPhotoDialog, setShowPhotoDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileData, setProfileData] = useState({
    name: 'Jane Doe',
    username: 'jane_doe',
    bio: 'Product designer based in San Francisco. I love creating beautiful and functional interfaces.',
    phone: '+1 (555) 123-4567',
    email: 'jane.doe@example.com',
    location: 'San Francisco, CA',
    theme: 'light',
    notifications: true,
    statusVisible: true,
    readReceipts: true,
  });

  // Load profile data from localStorage on component mount
  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    const storedName = localStorage.getItem('userName');
    const storedAvatar = localStorage.getItem('userAvatar');
    
    if (storedEmail) {
      setProfileData(prevData => ({
        ...prevData,
        email: storedEmail
      }));
    }
    
    if (storedName) {
      setProfileData(prevData => ({
        ...prevData,
        name: storedName
      }));
    }
    
    if (storedAvatar) {
      setProfileImage(storedAvatar);
    }
  }, []);

  const handleSaveProfile = () => {
    setIsEditing(false);
    
    // Save to localStorage
    localStorage.setItem('userName', profileData.name);
    localStorage.setItem('userEmail', profileData.email);
    localStorage.setItem('userAvatar', profileImage);
    
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  const handleToggleChange = (name: string, checked: boolean) => {
    setProfileData({
      ...profileData,
      [name]: checked,
    });
  };

  const handlePhotoClick = () => {
    setShowPhotoDialog(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const newAvatar = event.target.result as string;
          setProfileImage(newAvatar);
          localStorage.setItem('userAvatar', newAvatar);
          setShowPhotoDialog(false);
          toast({
            title: "Photo updated",
            description: "Your profile photo has been updated successfully.",
          });
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarSelect = (imgNum: number) => {
    const newAvatar = `https://i.pravatar.cc/150?img=${imgNum}`;
    setProfileImage(newAvatar);
    localStorage.setItem('userAvatar', newAvatar);
    setShowPhotoDialog(false);
    toast({
      title: "Avatar selected",
      description: "Your profile avatar has been updated.",
    });
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-8">
      <div className="p-4 border-b bg-card sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Profile</h1>
          {isEditing ? (
            <Button size="sm" onClick={handleSaveProfile}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
              <Edit className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      <div className="px-4 py-6">
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <Avatar className="h-24 w-24 border-4 border-background cursor-pointer" onClick={handlePhotoClick}>
              <AvatarImage src={profileImage} />
              <AvatarFallback>{profileData.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div 
              className="absolute bottom-0 right-0 bg-primary rounded-full p-1.5 border-2 border-background cursor-pointer"
              onClick={handlePhotoClick}
            >
              <Camera className="h-4 w-4 text-white" />
            </div>
          </div>

          {isEditing ? (
            <div className="w-full max-w-sm space-y-3 text-center">
              <Input
                name="name"
                value={profileData.name}
                onChange={handleInputChange}
                className="text-xl font-semibold text-center"
              />
              <Input
                name="username"
                value={profileData.username}
                onChange={handleInputChange}
                className="text-muted-foreground text-center"
              />
            </div>
          ) : (
            <div className="text-center">
              <h2 className="text-xl font-semibold">{profileData.name}</h2>
              <p className="text-muted-foreground">@{profileData.username}</p>
            </div>
          )}
        </div>

        {/* Photo Update Dialog */}
        <Dialog open={showPhotoDialog} onOpenChange={setShowPhotoDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Update Profile Photo</DialogTitle>
              <DialogDescription>
                Choose a new profile photo or upload one from your device.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-32 w-32 border-4 border-background">
                  <AvatarImage src={profileImage} />
                  <AvatarFallback>{profileData.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <Button onClick={triggerFileInput} className="w-full">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Photo
                </Button>
              </div>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <Avatar 
                    key={num} 
                    className="h-16 w-16 cursor-pointer border-2 hover:border-primary transition-all"
                    onClick={() => handleAvatarSelect(num)}
                  >
                    <AvatarImage src={`https://i.pravatar.cc/150?img=${num}`} />
                    <AvatarFallback>{num}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </div>
            <DialogFooter className="sm:justify-end">
              <Button variant="secondary" onClick={() => setShowPhotoDialog(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Tabs defaultValue="profile" className="w-full max-w-3xl mx-auto">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="profile" className="flex-1">Profile</TabsTrigger>
            <TabsTrigger value="settings" className="flex-1">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
                <CardDescription>Share information about yourself</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  {isEditing ? (
                    <Textarea
                      id="bio"
                      name="bio"
                      value={profileData.bio}
                      onChange={handleInputChange}
                      placeholder="Write a little bit about yourself"
                      className="resize-none"
                    />
                  ) : (
                    <p className="text-sm">{profileData.bio}</p>
                  )}
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Contact Information</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="phone">Phone</Label>
                      {isEditing ? (
                        <Input
                          id="phone"
                          name="phone"
                          value={profileData.phone}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <p className="text-sm">{profileData.phone}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="email">Email</Label>
                      {isEditing ? (
                        <Input
                          id="email"
                          name="email"
                          value={profileData.email}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <p className="text-sm">{profileData.email}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="location">Location</Label>
                      {isEditing ? (
                        <Input
                          id="location"
                          name="location"
                          value={profileData.location}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <p className="text-sm">{profileData.location}</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Linked Accounts</CardTitle>
                  <CardDescription>Connect your accounts for a better experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between items-center py-2">
                    <div className="flex items-center space-x-3">
                      <div className="h-9 w-9 rounded-full bg-[#1DA1F2] flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                      </div>
                      <div>
                        <h3 className="font-medium">Twitter</h3>
                        <p className="text-sm text-muted-foreground">Not connected</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Connect</Button>
                  </div>

                  <div className="flex justify-between items-center py-2">
                    <div className="flex items-center space-x-3">
                      <div className="h-9 w-9 rounded-full bg-[#4267B2] flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                      </div>
                      <div>
                        <h3 className="font-medium">Facebook</h3>
                        <p className="text-sm text-muted-foreground">Connected</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Disconnect</Button>
                  </div>

                  <div className="flex justify-between items-center py-2">
                    <div className="flex items-center space-x-3">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                      </div>
                      <div>
                        <h3 className="font-medium">Instagram</h3>
                        <p className="text-sm text-muted-foreground">Not connected</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Connect</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>Manage your app settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="theme">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">Switch between light and dark theme</p>
                  </div>
                  <Switch
                    id="theme"
                    checked={profileData.theme === 'dark'}
                    onCheckedChange={(checked) => handleToggleChange('theme', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications for new messages</p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={profileData.notifications}
                    onCheckedChange={(checked) => handleToggleChange('notifications', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="statusVisible">Status Visibility</Label>
                    <p className="text-sm text-muted-foreground">Allow others to see when you're online</p>
                  </div>
                  <Switch
                    id="statusVisible"
                    checked={profileData.statusVisible}
                    onCheckedChange={(checked) => handleToggleChange('statusVisible', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="readReceipts">Read Receipts</Label>
                    <p className="text-sm text-muted-foreground">Let others know when you've read their messages</p>
                  </div>
                  <Switch
                    id="readReceipts"
                    checked={profileData.readReceipts}
                    onCheckedChange={(checked) => handleToggleChange('readReceipts', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy & Security</CardTitle>
                  <CardDescription>Manage your privacy and security settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <button className="w-full flex justify-between items-center py-2 hover:bg-muted/50 rounded px-1 transition-colors">
                    <span>Blocked Users</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                  <button className="w-full flex justify-between items-center py-2 hover:bg-muted/50 rounded px-1 transition-colors">
                    <span>Account Privacy</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                  <button className="w-full flex justify-between items-center py-2 hover:bg-muted/50 rounded px-1 transition-colors">
                    <span>Two-Factor Authentication</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                  <button className="w-full flex justify-between items-center py-2 hover:bg-muted/50 rounded px-1 transition-colors">
                    <span>Change Password</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                </CardContent>
                <CardFooter>
                  <Button variant="destructive" className="w-full">Logout</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
