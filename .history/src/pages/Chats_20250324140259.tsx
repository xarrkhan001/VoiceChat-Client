
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, MoreVertical, Phone, Video } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { chatData, storiesData } from '@/lib/mockData';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Chats = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  
  const filteredChats = chatData.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAudioCall = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    navigate(`/audio-call/${chatId}`);
  };

  const handleVideoCall = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    navigate(`/video-call/${chatId}`);
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="p-4 border-b bg-card shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">ChatterBox</h1>
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon">
              <Phone className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Video className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {/* Stories */}
      <div className="px-4 py-3 overflow-x-auto">
        <div className="flex space-x-4">
          {storiesData.map((story) => (
            <div 
              key={story.id} 
              className="flex flex-col items-center space-y-1 min-w-[64px]"
              onClick={() => navigate('/stories')}
            >
              <div className={`${story.stories.length > 0 ? 'story-ring' : 'p-[2px]'}`}>
                <div className="relative">
                  <Avatar className="h-16 w-16 border-2 border-background">
                    <AvatarImage src={story.user.avatar} />
                    <AvatarFallback>{story.user.name[0]}</AvatarFallback>
                  </Avatar>
                  {story.isYourStory && (
                    <div className="absolute bottom-0 right-0 bg-primary rounded-full p-1 border-2 border-background">
                      <Plus className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
              </div>
              <span className="text-xs truncate w-full text-center">{story.user.name}</span>
            </div>
          ))}
        </div>
      </div>
      
      <Separator />
      
      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length > 0 ? (
          <div className="divide-y">
            {filteredChats.map((chat) => (
              <div 
                key={chat.id}
                className="p-4 hover:bg-muted/40 cursor-pointer transition-colors"
                onClick={() => navigate(`/chats/${chat.id}`)}
              >
                <div className="flex items-center">
                  <div className="relative mr-3">
                    <Avatar>
                      <AvatarImage src={chat.avatar} />
                      <AvatarFallback>{chat.name[0]}</AvatarFallback>
                    </Avatar>
                    {chat.online && (
                      <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-background"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium truncate">{chat.name}</h3>
                      <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{chat.time}</span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                      {chat.unread > 0 && (
                        <Badge variant="default" className="ml-2 bg-primary hover:bg-primary">
                          {chat.unread}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center ml-2 space-x-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={(e) => handleAudioCall(e, chat.id)}
                    >
                      <Phone className="h-4 w-4 text-muted-foreground hover:text-primary" />
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={(e) => handleVideoCall(e, chat.id)}
                    >
                      <Video className="h-4 w-4 text-muted-foreground hover:text-primary" />
                    </Button>
                  
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8" 
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Mute notifications</DropdownMenuItem>
                        <DropdownMenuItem>Pin conversation</DropdownMenuItem>
                        <DropdownMenuItem>Mark as read</DropdownMenuItem>
                        <DropdownMenuItem>Archive chat</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Delete chat</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No conversations found</h3>
            <p className="text-muted-foreground mt-1">Try a different search term</p>
          </div>
        )}
      </div>
      
      {/* Floating action button */}
      <div className="fixed bottom-6 right-6">
        <Button size="icon" className="h-14 w-14 rounded-full shadow-lg">
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default Chats;
