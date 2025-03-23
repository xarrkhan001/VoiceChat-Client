
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  MessageSquare, 
  Users, 
  Phone, 
  Video, 
  Image,
  User,
  Settings,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type SidebarProps = {
  onClose: () => void;
};

const Sidebar = ({ onClose }: SidebarProps) => {
  const isMobile = useIsMobile();
  
  const navigation = [
    { name: 'Chats', to: '/chats', icon: MessageSquare },
    { name: 'Contacts', to: '/contacts', icon: Users },
    { name: 'Stories', to: '/stories', icon: Image },
    { name: 'Calls', to: '/calls', icon: Phone },
    { name: 'Video Calls', to: '/video-calls', icon: Video },
    { name: 'Profile', to: '/profile', icon: User },
    { name: 'Settings', to: '/settings', icon: Settings },
  ];

  return (
    <div className="flex flex-col h-full bg-card border-r">
      <div className="p-4 flex items-center justify-between border-b">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
            <MessageSquare className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-semibold">Chat Wave</span>
        </div>
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-center space-x-3 mb-6">
          <Avatar className="h-12 w-12 border-2 border-primary/20">
            <AvatarImage src="https://i.pravatar.cc/150?img=3" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">Jane Doe</div>
            <div className="text-sm text-muted-foreground">Online</div>
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
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-1" />
            <span>Status</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
