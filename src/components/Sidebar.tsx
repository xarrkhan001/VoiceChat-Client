
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  MessageSquare, 
  Users, 
  Phone, 
  Video, 
  Image,
  User,
  Settings,
  X,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ThemeToggle from './ThemeToggle';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type SidebarProps = {
  onClose: () => void;
};

const Sidebar = ({ onClose }: SidebarProps) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: 'User',
    email: '',
    avatar: 'https://i.pravatar.cc/150?img=3'
  });
  
  const navigation = [
    { name: 'Chats', to: '/chats', icon: MessageSquare },
    { name: 'Contacts', to: '/contacts', icon: Users },
    { name: 'Stories', to: '/stories', icon: Image },
    { name: 'Calls', to: '/calls', icon: Phone },
    { name: 'Video Calls', to: '/video-calls', icon: Video },
    { name: 'Profile', to: '/profile', icon: User },
    { name: 'Settings', to: '/settings', icon: Settings },
  ];

  // Load user data from localStorage
  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail') || '';
    const userName = localStorage.getItem('userName') || 'User';
    const userAvatar = localStorage.getItem('userAvatar') || 'https://i.pravatar.cc/150?img=3';

    setUserData({
      name: userName,
      email: userEmail,
      avatar: userAvatar
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userAvatar');
    toast.success('Successfully logged out');
    navigate('/login');
  };

  return (
    <div className="flex flex-col h-full bg-card border-r">
      <div className="p-4 flex items-center justify-between border-b">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
            <MessageSquare className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">ChatterBox</span>
        </div>
        <div className="flex items-center space-x-1">
          <ThemeToggle />
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center space-x-3 mb-6 bg-muted/30 p-3 rounded-lg">
          <Avatar className="h-14 w-14 border-2 border-primary/20 ring-2 ring-primary/10 ring-offset-2 ring-offset-background">
            <AvatarImage src={userData.avatar} alt={userData.name} />
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {userData.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-foreground">{userData.name}</div>
            <div className="text-sm text-muted-foreground truncate max-w-[140px]">{userData.email || 'Online'}</div>
          </div>
        </div>
      
        <nav className="space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              className={({ isActive }) => 
                `flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-colors duration-200 ${
                  isActive 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'text-foreground hover:bg-muted/70'
                }`
              }
              onClick={isMobile ? onClose : undefined}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      
      <div className="mt-auto p-4 border-t">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm">Active</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout} className="hover:bg-destructive/10 hover:text-destructive">
            <LogOut className="h-4 w-4 mr-1" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
