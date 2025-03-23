
import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MoreVertical, 
  Phone, 
  Video, 
  Smile, 
  Paperclip, 
  Mic, 
  Send,
  Image as ImageIcon,
  File,
  MapPin,
  Circle,
  CheckCheck,
  Check
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Mock user data
const users = {
  '1': { 
    id: '1', 
    name: 'Alice Johnson', 
    avatar: 'https://i.pravatar.cc/150?img=1',
    online: true,
    lastSeen: 'Active now'
  },
  '2': { 
    id: '2', 
    name: 'Bob Smith', 
    avatar: 'https://i.pravatar.cc/150?img=2',
    online: false,
    lastSeen: 'Last seen 1h ago'
  },
  '3': { 
    id: '3', 
    name: 'Carol Williams', 
    avatar: 'https://i.pravatar.cc/150?img=5',
    online: true,
    lastSeen: 'Active now'
  },
  '4': { 
    id: '4', 
    name: 'Dave Brown', 
    avatar: 'https://i.pravatar.cc/150?img=7',
    online: false,
    lastSeen: 'Last seen yesterday'
  },
  '5': { 
    id: '5', 
    name: 'Eve Davis', 
    avatar: 'https://i.pravatar.cc/150?img=9',
    online: true,
    lastSeen: 'Active now'
  },
};

// Mock message data
const initialMessages = [
  {
    id: '1',
    sender: '1',
    receiver: 'me',
    text: 'Hey there! How are you doing today?',
    timestamp: '10:30 AM',
    status: 'read',
    type: 'text'
  },
  {
    id: '2',
    sender: 'me',
    receiver: '1',
    text: 'Hi Alice! I\'m doing great, thanks for asking. How about you?',
    timestamp: '10:32 AM',
    status: 'read',
    type: 'text'
  },
  {
    id: '3',
    sender: '1',
    receiver: 'me',
    text: 'I\'m good too! Just finishing up some work. Are we still meeting today?',
    timestamp: '10:33 AM',
    status: 'read',
    type: 'text'
  },
  {
    id: '4',
    sender: 'me',
    receiver: '1',
    text: 'Yes, definitely! How about 3 PM at the usual cafe?',
    timestamp: '10:35 AM',
    status: 'read',
    type: 'text'
  },
  {
    id: '5',
    sender: '1',
    receiver: 'me',
    text: 'Perfect! I\'ll see you then. I\'ve been wanting to try their new pastries.',
    timestamp: '10:36 AM',
    status: 'read',
    type: 'text'
  },
  {
    id: '6',
    sender: 'me',
    receiver: '1',
    text: 'Check out this photo from my weekend hike!',
    timestamp: '10:40 AM',
    status: 'read',
    type: 'text'
  },
  {
    id: '7',
    sender: 'me',
    receiver: '1',
    mediaUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGlraW5nfGVufDB8fDB8fHww',
    timestamp: '10:40 AM',
    status: 'read',
    type: 'image'
  },
  {
    id: '8',
    sender: '1',
    receiver: 'me',
    text: 'Wow! That looks amazing! Where is that?',
    timestamp: '10:41 AM',
    status: 'read',
    type: 'text'
  },
  {
    id: '9',
    sender: 'me',
    receiver: '1',
    text: 'It\'s at Mount Rainier National Park. We should go sometime!',
    timestamp: '10:42 AM',
    status: 'delivered',
    type: 'text'
  },
];

const ChatDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(initialMessages);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const user = users[id as keyof typeof users];
  
  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    
    return () => clearInterval(interval);
  }, [isRecording]);
  
  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: (messages.length + 1).toString(),
        sender: 'me',
        receiver: id || '',
        text: message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'sent',
        type: 'text'
      };
      
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  if (!user) return <div>User not found</div>;

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <header className="p-3 border-b bg-card flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2 md:mr-4" 
            onClick={() => navigate('/chats')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            
            <div>
              <div className="font-medium">{user.name}</div>
              <div className="text-xs text-muted-foreground flex items-center">
                {user.online ? (
                  <>
                    <span className="h-2 w-2 bg-green-500 rounded-full mr-1"></span>
                    <span>Online</span>
                  </>
                ) : (
                  user.lastSeen
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Phone className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Voice Call</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Video className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Video Call</TooltipContent>
          </Tooltip>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Chat Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View contact</DropdownMenuItem>
              <DropdownMenuItem>Search messages</DropdownMenuItem>
              <DropdownMenuItem>Mute notifications</DropdownMenuItem>
              <DropdownMenuItem>Clear chat</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Block contact</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.type === 'text' ? (
              <div className={msg.sender === 'me' ? 'message-sent' : 'message-received'}>
                <p>{msg.text}</p>
                <div className="text-xs mt-1 flex justify-end items-center space-x-1">
                  <span className={`${msg.sender === 'me' ? 'text-white/70' : 'text-muted-foreground'}`}>
                    {msg.timestamp}
                  </span>
                  {msg.sender === 'me' && (
                    msg.status === 'read' ? (
                      <CheckCheck className="h-3 w-3 text-white/70" />
                    ) : msg.status === 'delivered' ? (
                      <CheckCheck className="h-3 w-3 text-white/70" />
                    ) : (
                      <Check className="h-3 w-3 text-white/70" />
                    )
                  )}
                </div>
              </div>
            ) : msg.type === 'image' && msg.mediaUrl ? (
              <div className={msg.sender === 'me' ? 'message-sent p-1' : 'message-received p-1'}>
                <img 
                  src={msg.mediaUrl} 
                  alt="Shared media" 
                  className="rounded-lg max-w-[240px] md:max-w-xs object-cover"
                />
                <div className="text-xs mt-1 flex justify-end items-center space-x-1">
                  <span className={`${msg.sender === 'me' ? 'text-white/70' : 'text-muted-foreground'}`}>
                    {msg.timestamp}
                  </span>
                  {msg.sender === 'me' && (
                    msg.status === 'read' ? (
                      <CheckCheck className="h-3 w-3 text-white/70" />
                    ) : msg.status === 'delivered' ? (
                      <CheckCheck className="h-3 w-3 text-white/70" />
                    ) : (
                      <Check className="h-3 w-3 text-white/70" />
                    )
                  )}
                </div>
              </div>
            ) : null}
          </div>
        ))}
        {/* Invisible element to scroll to */}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message input */}
      <div className="p-3 border-t bg-card">
        {isRecording ? (
          <div className="flex items-center justify-between px-4 py-2 rounded-full bg-secondary">
            <div className="flex items-center">
              <Circle className="h-3 w-3 text-red-500 animate-pulse mr-2" />
              <span>Recording... {formatRecordingTime(recordingTime)}</span>
            </div>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" onClick={toggleRecording}>
                Cancel
              </Button>
              <Button size="sm" onClick={toggleRecording}>
                Send
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <Paperclip className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem>
                  <ImageIcon className="h-4 w-4 mr-2" />
                  <span>Image</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <File className="h-4 w-4 mr-2" />
                  <span>Document</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>Location</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="mx-2"
            />
            
            {message ? (
              <Button variant="ghost" size="icon" onClick={handleSendMessage}>
                <Send className="h-5 w-5 text-primary" />
              </Button>
            ) : (
              <>
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <Smile className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={toggleRecording}>
                  <Mic className="h-5 w-5 text-muted-foreground" />
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatDetail;
