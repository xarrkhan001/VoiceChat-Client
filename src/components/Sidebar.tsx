
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
          <span className="text-xl font-semibold">Chat Wave</span>
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
        <div className="flex items-center space-x-3 mb-6">
          <Avatar className="h-12 w-12 border-2 border-primary/20">
            <AvatarImage src={userData.avatar} />
            <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{userData.name}</div>
            <div className="text-sm text-muted-foreground">{userData.email || 'Online'}</div>
          </div>
        </div>
      
        <nav className="space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              className={({ isActive }) => 
                `nav-item ${isActive ? 'nav-item-active' : ''}`
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
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-1" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
