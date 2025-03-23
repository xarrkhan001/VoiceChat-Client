import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ArrowLeft, 
  MoreVertical, 
  Phone, 
  Video, 
  Image as ImageIcon, 
  Paperclip, 
  Mic, 
  SendHorizontal,
  Check,
  CheckCheck,
  Clock
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
import VoiceRecorder from '@/components/VoiceRecorder';

// Mock data for a chat
const mockContacts = [
  {
    id: '1',
    name: 'Sarah Johnson',
    avatar: 'https://i.pravatar.cc/150?img=1',
    lastSeen: new Date(),
    isOnline: true,
  },
  {
    id: '2',
    name: 'Michael Chen',
    avatar: 'https://i.pravatar.cc/150?img=2',
    lastSeen: new Date(Date.now() - 1000 * 60 * 15),
    isOnline: false,
  },
  {
    id: '3',
    name: 'Jessica Williams',
    avatar: 'https://i.pravatar.cc/150?img=5',
    lastSeen: new Date(Date.now() - 1000 * 60 * 60),
    isOnline: false,
  }
];

// Mock message data
const generateMockMessages = (contactId: string) => {
  const contact = mockContacts.find(c => c.id === contactId);
  const currentUser = {
    id: 'me',
    name: 'You',
    avatar: localStorage.getItem('userAvatar') || 'https://i.pravatar.cc/150?img=3',
  };
  
  if (!contact) return [];
  
  return [
    {
      id: '1',
      sender: contact,
      content: 'Hey there! How are you doing today?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      status: 'read',
    },
    {
      id: '2',
      sender: currentUser,
      content: 'I\'m doing great! Just finished a big project at work.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5).toISOString(),
      status: 'read',
    },
    {
      id: '3',
      sender: contact,
      content: 'That\'s awesome! Was it the one you were telling me about last week?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
      status: 'read',
    },
    {
      id: '4',
      sender: currentUser,
      content: 'Yes, exactly! It was challenging but I learned a lot from it.',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      status: 'read',
    },
    {
      id: '5',
      sender: contact,
      content: 'Would you like to meet up for coffee this weekend and tell me more about it?',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      status: 'read',
    },
  ];
};

const ChatDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [contact, setContact] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  
  // Load contact and messages
  useEffect(() => {
    if (id) {
      const foundContact = mockContacts.find(c => c.id === id);
      if (foundContact) {
        setContact(foundContact);
        setMessages(generateMockMessages(id));
      }
    }
  }, [id]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingDuration(0);
    }
    
    return () => clearInterval(interval);
  }, [isRecording]);
  
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message = {
      id: Date.now().toString(),
      sender: {
        id: 'me',
        name: 'You',
        avatar: localStorage.getItem('userAvatar') || 'https://i.pravatar.cc/150?img=3',
      },
      content: newMessage,
      timestamp: new Date().toISOString(),
      status: 'sent',
    };
    
    setMessages(prev => [...prev, message]);
    setNewMessage('');
    
    // Simulate received message
    setTimeout(() => {
      const replyMessage = {
        id: (Date.now() + 1).toString(),
        sender: contact,
        content: 'Thanks for letting me know!',
        timestamp: new Date().toISOString(),
        status: 'read',
      };
      
      setMessages(prev => [...prev, replyMessage]);
    }, 3000);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Function to handle voice message completion
  const handleVoiceMessageComplete = (audioBlob: Blob) => {
    // Create an audio URL for preview
    const audioUrl = URL.createObjectURL(audioBlob);
    
    // Create a simulated voice message
    const voiceMessage = {
      id: Date.now().toString(),
      sender: {
        id: '1', // Current user's ID
        name: 'You',
        avatar: localStorage.getItem('userAvatar') || 'https://i.pravatar.cc/150?img=3',
      },
      content: '',
      timestamp: new Date().toISOString(),
      isVoice: true,
      voiceUrl: audioUrl,
      status: 'sent',
    };
    
    // Add to messages
    setMessages(prev => [...prev, voiceMessage]);
    setIsRecording(false);
  };
  
  // Format timestamp
  const formatMessageTime = (timestamp: string) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };
  
  // Render message status icon
  const renderMessageStatus = (status: string) => {
    switch (status) {
      case 'sent':
        return <Check className="h-4 w-4 text-muted-foreground" />;
      case 'delivered':
        return <CheckCheck className="h-4 w-4 text-muted-foreground" />;
      case 'read':
        return <CheckCheck className="h-4 w-4 text-primary" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };
  
  if (!contact) {
    return <div className="flex items-center justify-center h-full">Loading chat...</div>;
  }
  
  const ChatHeader = () => (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/chats')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <Avatar>
          <AvatarImage src={contact.avatar} />
          <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
        </Avatar>
        
        <div>
          <div className="font-medium">{contact.name}</div>
          <div className="text-xs text-muted-foreground">
            {contact.isOnline ? 'Online' : `Last seen ${formatDistanceToNow(contact.lastSeen, { addSuffix: true })}`}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon">
          <Phone className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Video className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
  
  const MessageItem = ({ message }: { message: any }) => {
    const isCurrentUser = message.sender.id === 'me';
    
    return (
      <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className="flex gap-2 max-w-[80%]">
          {!isCurrentUser && (
            <Avatar className="h-8 w-8">
              <AvatarImage src={message.sender.avatar} />
              <AvatarFallback>{message.sender.name.charAt(0)}</AvatarFallback>
            </Avatar>
          )}
          
          <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
            <div 
              className={`rounded-lg p-3 ${
                isCurrentUser 
                  ? 'bg-primary text-primary-foreground rounded-br-none' 
                  : 'bg-muted rounded-bl-none'
              }`}
            >
              {message.isVoice ? (
                <audio src={message.voiceUrl} controls className="max-w-[200px]" />
              ) : (
                <p className="whitespace-pre-wrap">{message.content}</p>
              )}
            </div>
            
            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
              {formatMessageTime(message.timestamp)}
              {isCurrentUser && renderMessageStatus(message.status)}
            </div>
          </div>
          
          {isCurrentUser && (
            <Avatar className="h-8 w-8">
              <AvatarImage src={message.sender.avatar} />
              <AvatarFallback>{message.sender.name.charAt(0)}</AvatarFallback>
            </Avatar>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <div className="flex flex-col h-full">
      <ChatHeader />
      
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full p-4">
          {messages.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </ScrollArea>
      </div>
      
      <div className="p-4 border-t flex items-end gap-2">
        {isRecording ? (
          <div className="flex-1 flex items-center gap-3 bg-muted/50 p-3 rounded-xl">
            <span className="animate-pulse w-3 h-3 rounded-full bg-destructive"></span>
            <span className="text-sm text-muted-foreground">Recording... {recordingDuration}s</span>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => setIsRecording(false)}
              className="ml-auto"
            >
              Cancel
            </Button>
          </div>
        ) : (
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 max-h-32"
            onKeyDown={handleKeyDown}
          />
        )}
        
        {!isRecording && !newMessage && (
          <Button 
            onClick={() => setIsRecording(true)} 
            size="icon" 
            variant="ghost"
          >
            <Mic className="h-5 w-5" />
          </Button>
        )}
        
        {isRecording ? (
          <VoiceRecorder 
            onRecordComplete={handleVoiceMessageComplete}
            onRecordStart={() => {}}
          />
        ) : (
          <Button 
            onClick={handleSendMessage} 
            size="icon" 
            disabled={!newMessage.trim() && !isRecording}
          >
            <SendHorizontal className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ChatDetail;
