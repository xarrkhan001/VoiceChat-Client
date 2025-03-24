
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
  SendHorizontal,
  Check,
  CheckCheck,
  Clock
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import VoiceRecorder from '@/components/VoiceRecorder';
import EmojiPicker from '@/components/EmojiPicker';
import { mockContacts, generateMockMessages } from '@/lib/mockData';

const ChatDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const [contact, setContact] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  
  useEffect(() => {
    if (id) {
      const foundContact = mockContacts.find(c => c.id === id);
      if (foundContact) {
        setContact(foundContact);
        setMessages(generateMockMessages(id));
      } else {
        toast({
          title: "Contact not found",
          description: "Could not find this conversation",
          variant: "destructive"
        });
        navigate('/chats');
      }
    }
  }, [id, navigate, toast]);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message = {
      id: Date.now().toString(),
      sender: {
        id: 'me',
        name: localStorage.getItem('userName') || 'You',
        avatar: localStorage.getItem('userAvatar') || 'https://i.pravatar.cc/150?img=3',
      },
      content: newMessage,
      timestamp: new Date().toISOString(),
      status: 'sent',
    };
    
    setMessages(prev => [...prev, message]);
    setNewMessage('');
    
    // Simulate message delivered
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === message.id 
            ? { ...msg, status: 'delivered' } 
            : msg
        )
      );
      
      // Simulate message read
      setTimeout(() => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === message.id 
              ? { ...msg, status: 'read' } 
              : msg
          )
        );
      }, 1000);
    }, 1000);
    
    // Simulate reply after a delay
    setTimeout(() => {
      const replyMessage = {
        id: (Date.now() + 1).toString(),
        sender: contact,
        content: 'Thanks for letting me know!',
        timestamp: new Date().toISOString(),
        status: 'read',
      };
      
      setMessages(prev => [...prev, replyMessage]);
      
      toast({
        title: `New message from ${contact.name}`,
        description: replyMessage.content,
      });
    }, 3000);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
  };

  const handleVoiceMessageComplete = (audioBlob: Blob) => {
    const audioUrl = URL.createObjectURL(audioBlob);
    
    const voiceMessage = {
      id: Date.now().toString(),
      sender: {
        id: 'me',
        name: localStorage.getItem('userName') || 'You',
        avatar: localStorage.getItem('userAvatar') || 'https://i.pravatar.cc/150?img=3',
      },
      content: '',
      timestamp: new Date().toISOString(),
      isVoice: true,
      voiceUrl: audioUrl,
      status: 'sent',
    };
    
    setMessages(prev => [...prev, voiceMessage]);
    setIsRecording(false);
    
    // Simulate message delivered and read
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === voiceMessage.id 
            ? { ...msg, status: 'delivered' } 
            : msg
        )
      );
      
      setTimeout(() => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === voiceMessage.id 
              ? { ...msg, status: 'read' } 
              : msg
          )
        );
        
        // Simulate reply to voice message
        setTimeout(() => {
          const replyMessage = {
            id: (Date.now() + 1).toString(),
            sender: contact,
            content: 'I just listened to your voice message. Thanks!',
            timestamp: new Date().toISOString(),
            status: 'read',
          };
          
          setMessages(prev => [...prev, replyMessage]);
          
          toast({
            title: `New message from ${contact.name}`,
            description: replyMessage.content,
          });
        }, 2000);
      }, 1000);
    }, 1000);
  };
  
  const formatMessageTime = (timestamp: string) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };
  
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
  
  const initiateAudioCall = () => {
    navigate(`/audio-call/${id}`);
  };
  
  const initiateVideoCall = () => {
    navigate(`/video-call/${id}`);
  };
  
  if (!contact) {
    return <div className="flex items-center justify-center h-full">Loading chat...</div>;
  }
  
  const ChatHeader = () => (
    <div className="flex items-center justify-between p-4 border-b bg-card shadow-sm sticky top-0 z-10">
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
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={initiateAudioCall}>
              <Phone className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Audio Call</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={initiateVideoCall}>
              <Video className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Video Call</TooltipContent>
        </Tooltip>
        
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
    <div className="flex flex-col h-full bg-background">
      <ChatHeader />
      
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full p-4">
          {messages.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </ScrollArea>
      </div>
      
      <div className="p-4 border-t bg-card shadow-sm flex flex-col gap-2">
        {!isRecording && (
          <div className="flex items-end gap-2">
            <Button variant="ghost" size="icon">
              <Paperclip className="h-5 w-5" />
            </Button>
            
            <Button variant="ghost" size="icon">
              <ImageIcon className="h-5 w-5" />
            </Button>
            
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 max-h-32 bg-muted/50"
              onKeyDown={handleKeyDown}
            />
            
            <EmojiPicker onEmojiSelect={handleEmojiSelect} />
            
            {newMessage.trim() ? (
              <Button 
                onClick={handleSendMessage} 
                size="icon"
                className="rounded-full"
              >
                <SendHorizontal className="h-5 w-5" />
              </Button>
            ) : (
              <VoiceRecorder 
                onRecordComplete={handleVoiceMessageComplete}
                onRecordStart={() => setIsRecording(true)}
                onCancel={() => setIsRecording(false)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatDetail;
