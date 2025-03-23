
import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MoreVertical, 
  Send, 
  Phone, 
  Video, 
  Paperclip, 
  Image as ImageIcon, 
  Smile,
  Mic,
  Play,
  File
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import VoiceRecorder from '@/components/VoiceRecorder';

// Mock data for the selected chat
const chatData = {
  id: '1',
  name: 'Alice Johnson',
  avatar: 'https://i.pravatar.cc/150?img=1',
  online: true,
  lastSeen: 'Active now',
};

// Mock messages data
const mockMessages = [
  {
    id: '1',
    text: 'Hey there! How are you doing?',
    sender: 'them',
    time: '10:20 AM',
    status: 'read',
  },
  {
    id: '2',
    text: 'I\'m good, thanks! Just finishing up some work. How about you?',
    sender: 'me',
    time: '10:21 AM',
    status: 'read',
  },
  {
    id: '3',
    text: 'Pretty good! I was wondering if you wanted to grab lunch later this week?',
    sender: 'them',
    time: '10:22 AM',
    status: 'read',
  },
  {
    id: '4',
    text: 'That sounds great! How about Thursday at noon?',
    sender: 'me',
    time: '10:25 AM',
    status: 'read',
  },
  {
    id: '5',
    text: 'Thursday works perfectly. Let\'s meet at that new place downtown.',
    sender: 'them',
    time: '10:26 AM',
    status: 'read',
  },
  {
    id: '6',
    text: 'Perfect! Looking forward to it. 😊',
    sender: 'me',
    time: '10:27 AM',
    status: 'delivered',
  },
  {
    id: '7',
    type: 'audio',
    audioUrl: null, // This will be populated dynamically when sent
    sender: 'them',
    time: '10:30 AM',
    status: 'read',
    duration: 8, // seconds
  }
];

const ChatDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(mockMessages);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [isAttachMenuOpen, setIsAttachMenuOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Function to add a new message
  const addMessage = (content: string | Blob, type: 'text' | 'audio' | 'image' = 'text') => {
    const newMessage = {
      id: Date.now().toString(),
      text: type === 'text' ? content as string : '',
      type,
      sender: 'me',
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }),
      status: 'sent',
    } as any;

    if (type === 'audio') {
      newMessage.audioUrl = URL.createObjectURL(content as Blob);
      newMessage.duration = 0; // This would be calculated from the audio
    } else if (type === 'image') {
      newMessage.imageUrl = URL.createObjectURL(content as Blob);
    }

    setMessages([...messages, newMessage]);
    scrollToBottom();
  };

  // Handle send button click
  const handleSendMessage = () => {
    if (message.trim()) {
      addMessage(message.trim());
      setMessage('');
    }
  };

  // Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle voice message
  const handleSendVoice = (audioBlob: Blob) => {
    addMessage(audioBlob, 'audio');
    setShowVoiceRecorder(false);
  };

  // Handle file attachment
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (file.type.startsWith('image/')) {
        addMessage(file, 'image');
      } else {
        toast.error('Only image files are supported');
      }
      
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Auto scroll to bottom on new messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Initialize call dialog
  const handleVideoCall = () => {
    navigate('/video-calls');
  };

  const handleVoiceCall = () => {
    navigate('/calls');
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="p-3 border-b bg-card flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/chats')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center" onClick={() => navigate(`/profile/${id}`)}>
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src={chatData.avatar} />
              <AvatarFallback>{chatData.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{chatData.name}</div>
              <div className="text-xs text-muted-foreground">{chatData.online ? 'Online' : chatData.lastSeen}</div>
            </div>
          </div>
        </div>
        <div className="flex space-x-1">
          <Button variant="ghost" size="icon" onClick={handleVoiceCall}>
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleVideoCall}>
            <Video className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View profile</DropdownMenuItem>
              <DropdownMenuItem>Search in conversation</DropdownMenuItem>
              <DropdownMenuItem>Mute notifications</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Block user</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-secondary/10">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] ${
                msg.sender === 'me' 
                  ? 'bg-primary text-primary-foreground rounded-2xl rounded-tr-sm' 
                  : 'bg-background border rounded-2xl rounded-tl-sm'
              } px-4 py-2 shadow-sm`}
            >
              {msg.type === 'audio' ? (
                <div className="flex items-center space-x-2 my-1">
                  {msg.audioUrl ? (
                    <audio controls src={msg.audioUrl} className="h-8 max-w-[200px]" />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Play className="h-4 w-4" />
                      <span>Voice message ({msg.duration}s)</span>
                    </div>
                  )}
                </div>
              ) : msg.type === 'image' ? (
                <div className="relative">
                  <img 
                    src={msg.imageUrl} 
                    alt="Shared image" 
                    className="rounded-md max-h-60 object-contain"
                  />
                </div>
              ) : (
                <div>{msg.text}</div>
              )}
              <div 
                className={`text-[10px] mt-1 ${
                  msg.sender === 'me' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                }`}
              >
                {msg.time}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input area */}
      <div className="border-t p-3 bg-card">
        {showVoiceRecorder ? (
          <VoiceRecorder 
            onSend={handleSendVoice} 
            onCancel={() => setShowVoiceRecorder(false)} 
          />
        ) : (
          <div className="flex items-center space-x-2">
            {/* Attachment button */}
            <DropdownMenu open={isAttachMenuOpen} onOpenChange={setIsAttachMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Paperclip className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem 
                  className="cursor-pointer"
                  onClick={() => {
                    fileInputRef.current?.click();
                    setIsAttachMenuOpen(false);
                  }}
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  <span>Image</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <File className="h-4 w-4 mr-2" />
                  <span>Document</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange}
            />
            
            {/* Text input */}
            <div className="flex-1 relative">
              <Input
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pr-10"
              />
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-0 top-0 h-full"
              >
                <Smile className="h-5 w-5 text-muted-foreground" />
              </Button>
            </div>
            
            {/* Voice message button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowVoiceRecorder(true)}
            >
              <Mic className="h-5 w-5" />
            </Button>
            
            {/* Send button */}
            <Button
              size="icon"
              className="rounded-full"
              onClick={handleSendMessage}
              disabled={!message.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatDetail;
