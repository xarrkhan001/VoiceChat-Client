
import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MoreVertical, Phone, Video, Smile, Paperclip, Send, Image as ImageIcon, Mic, User, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import VoiceRecorder from '@/components/VoiceRecorder';

// Sample data for chat details
const chatData = [
  {
    id: '1',
    name: 'Alice Johnson',
    avatar: 'https://i.pravatar.cc/150?img=1',
    status: 'Online',
    lastSeen: 'Last seen today at 3:45 PM',
    phone: '+1 (555) 123-4567',
    email: 'alice.johnson@example.com',
  },
  {
    id: '2',
    name: 'Bob Smith',
    avatar: 'https://i.pravatar.cc/150?img=2',
    status: 'Offline',
    lastSeen: 'Last seen yesterday at 9:30 PM',
    phone: '+1 (555) 987-6543',
    email: 'bob.smith@example.com',
  },
  {
    id: '3',
    name: 'Carol Williams',
    avatar: 'https://i.pravatar.cc/150?img=5',
    status: 'Online',
    lastSeen: 'Online',
    phone: '+1 (555) 234-5678',
    email: 'carol.williams@example.com',
  },
  {
    id: '4',
    name: 'Dave Brown',
    avatar: 'https://i.pravatar.cc/150?img=7',
    status: 'Offline',
    lastSeen: 'Last seen 2 days ago',
    phone: '+1 (555) 876-5432',
    email: 'dave.brown@example.com',
  },
  {
    id: '5',
    name: 'Eve Davis',
    avatar: 'https://i.pravatar.cc/150?img=9',
    status: 'Online',
    lastSeen: 'Online',
    phone: '+1 (555) 345-6789',
    email: 'eve.davis@example.com',
  },
];

// Mock message data
const messagesData = {
  '1': [
    { id: '1', text: 'Hey Alice! How are you doing today?', sender: 'me', time: '10:30 AM', status: 'read' },
    { id: '2', text: 'Hi! I\'m doing great, thanks for asking. How about you?', sender: 'them', time: '10:32 AM', status: 'read' },
    { id: '3', text: 'Pretty good! Just working on some projects.', sender: 'me', time: '10:33 AM', status: 'read' },
    { id: '4', text: 'That sounds interesting! What kind of projects?', sender: 'them', time: '10:35 AM', status: 'read' },
    { id: '5', text: 'Mostly web development stuff. Working on a new chat application actually.', sender: 'me', time: '10:36 AM', status: 'read' },
    { id: '6', text: 'That\'s so cool! I\'d love to see it when it\'s ready.', sender: 'them', time: '10:38 AM', status: 'read' },
    { id: '7', text: 'Sure! I\'ll share it with you once it\'s done.', sender: 'me', time: '10:40 AM', status: 'read' },
    { id: '8', text: 'Are we still meeting for coffee tomorrow?', sender: 'them', time: '10:42 AM', status: 'read' },
    { id: '9', type: 'audio', audioUrl: '/demo-audio.mp3', sender: 'me', time: '10:45 AM', status: 'read', duration: 15 },
    { id: '10', type: 'image', imageUrl: 'https://images.unsplash.com/photo-1698697399428-cd6224df0728', sender: 'them', time: '10:50 AM', status: 'read' },
  ],
  '2': [
    { id: '1', text: 'Hi Bob, did you get the documents I sent?', sender: 'me', time: '2:15 PM', status: 'read' },
    { id: '2', text: 'Yes, I received them. Thanks!', sender: 'them', time: '2:20 PM', status: 'read' },
    { id: '3', text: 'I\'ll review them and get back to you tomorrow.', sender: 'them', time: '2:22 PM', status: 'read' },
    { id: '4', text: 'That sounds good. Let me know if you have any questions.', sender: 'me', time: '2:25 PM', status: 'read' },
    { id: '5', type: 'audio', audioUrl: '/demo-audio.mp3', sender: 'them', time: '2:30 PM', status: 'read', duration: 8 },
  ],
  '3': [
    { id: '1', text: 'Hey Carol, how\'s the project coming along?', sender: 'me', time: '11:00 AM', status: 'read' },
    { id: '2', text: 'It\'s going well! We\'re on track to finish by the deadline.', sender: 'them', time: '11:05 AM', status: 'read' },
    { id: '3', text: 'That\'s great to hear!', sender: 'me', time: '11:07 AM', status: 'read' },
    { id: '4', text: 'Would you be able to join the review meeting on Friday?', sender: 'them', time: '11:10 AM', status: 'read' },
    { id: '5', text: 'Yes, I\'ll be there. What time is it?', sender: 'me', time: '11:12 AM', status: 'read' },
    { id: '6', text: '2 PM Eastern. I\'ll send a calendar invite.', sender: 'them', time: '11:15 AM', status: 'read' },
    { id: '7', text: 'Perfect, thanks!', sender: 'me', time: '11:17 AM', status: 'read' },
    { id: '8', type: 'image', imageUrl: 'https://images.unsplash.com/photo-1593642532400-2682810df593', sender: 'me', time: '11:20 AM', status: 'read' },
  ],
  '4': [
    { id: '1', text: 'Hi Dave, are you available for a quick call?', sender: 'me', time: '3:30 PM', status: 'read' },
    { id: '2', text: 'I\'m in a meeting right now. Can I call you in about an hour?', sender: 'them', time: '3:35 PM', status: 'read' },
    { id: '3', text: 'Sure, that works for me.', sender: 'me', time: '3:36 PM', status: 'read' },
    { id: '4', text: 'Great, talk to you soon.', sender: 'them', time: '3:38 PM', status: 'read' },
    { id: '5', type: 'audio', audioUrl: '/demo-audio.mp3', sender: 'me', time: '4:45 PM', status: 'read', duration: 22 },
  ],
  '5': [
    { id: '1', text: 'Eve, have you seen the latest design updates?', sender: 'me', time: '9:00 AM', status: 'read' },
    { id: '2', text: 'Not yet, can you share them with me?', sender: 'them', time: '9:05 AM', status: 'read' },
    { id: '3', text: 'Sure, I\'ll send them over right away.', sender: 'me', time: '9:07 AM', status: 'read' },
    { id: '4', text: 'Thanks, I appreciate it!', sender: 'them', time: '9:10 AM', status: 'read' },
    { id: '5', type: 'image', imageUrl: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e', sender: 'me', time: '9:15 AM', status: 'read' },
    { id: '6', text: 'These look great! I especially like the color scheme.', sender: 'them', time: '9:20 AM', status: 'read' },
    { id: '7', text: 'Thanks! I thought the colors would work well for our brand.', sender: 'me', time: '9:22 AM', status: 'read' },
    { id: '8', text: 'Absolutely. Let\'s implement these changes.', sender: 'them', time: '9:25 AM', status: 'read' },
  ],
};

const ChatDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [chat, setChat] = useState<any>(null);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  // Initialize chat data
  useEffect(() => {
    if (id) {
      const currentChat = chatData.find(chat => chat.id === id);
      const currentMessages = messagesData[id as keyof typeof messagesData] || [];
      
      setChat(currentChat);
      setMessages(currentMessages);
    }
  }, [id]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim() || audioBlob) {
      const newMessage = {
        id: String(Date.now()),
        text: message,
        sender: 'me',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'sent'
      };
      
      setMessages([...messages, newMessage]);
      setMessage('');
      toast.success('Message sent');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const triggerFilePicker = () => {
    fileInputRef.current?.click();
    setShowAttachMenu(false);
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const url = URL.createObjectURL(file);
      
      if (file.type.startsWith('image/')) {
        setPreviewImage(url);
        setShowImagePreview(true);
      }
    }
  };

  const handleSendImage = () => {
    if (previewImage) {
      const newMessage = {
        id: String(Date.now()),
        type: 'image',
        imageUrl: previewImage,
        sender: 'me',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'sent'
      };
      
      setMessages([...messages, newMessage]);
      setShowImagePreview(false);
      setPreviewImage('');
      toast.success('Image sent');
    }
  };

  const handleRecordingComplete = (blob: Blob) => {
    setAudioBlob(blob);
    setIsRecording(false);
    
    const newMessage = {
      id: String(Date.now()),
      type: 'audio',
      audioUrl: URL.createObjectURL(blob),
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
      duration: 0, // You can calculate actual duration if needed
    };
    
    setMessages([...messages, newMessage]);
    toast.success('Voice message sent');
  };

  const handleCancelRecording = () => {
    setIsRecording(false);
    setAudioBlob(null);
  };

  if (!chat) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-full flex flex-col">
      {/* Chat header */}
      <div className="p-3 border-b bg-card flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => navigate('/chats')} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src={chat.avatar} />
            <AvatarFallback>{chat.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{chat.name}</div>
            <div className="text-xs text-muted-foreground flex items-center">
              {chat.status === 'Online' ? (
                <>
                  <span className="h-2 w-2 rounded-full bg-green-500 mr-1.5"></span>
                  Online
                </>
              ) : (
                chat.lastSeen
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="icon" onClick={() => navigate('/calls')}>
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => navigate('/video-calls')}>
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Chat messages */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.map((msg) => {
          const isMe = msg.sender === 'me';
          
          return (
            <div 
              key={msg.id} 
              className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${isMe ? 'bg-primary text-primary-foreground' : 'bg-muted'} rounded-2xl p-3 px-4 ${isMe ? 'rounded-tr-sm' : 'rounded-tl-sm'}`}>
                {msg.type === 'audio' && (
                  <div className="flex items-center space-x-2 min-w-[200px]">
                    <Button variant={isMe ? "secondary" : "outline"} size="icon" className="h-8 w-8">
                      <Mic className="h-4 w-4" />
                    </Button>
                    <div className="flex-1">
                      <Progress value={45} className="h-1.5" />
                      <div className="flex justify-between text-xs mt-1">
                        <span>0:00</span>
                        <span>{msg.duration}s</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {msg.type === 'image' && (
                  <div className="rounded-md overflow-hidden">
                    <img 
                      src={msg.imageUrl} 
                      alt="Chat image" 
                      className="max-w-full h-auto object-cover"
                    />
                  </div>
                )}
                
                {!msg.type && <p>{msg.text}</p>}
                
                <div className={`text-xs mt-1 ${isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'} flex justify-end items-center`}>
                  {msg.time}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Image preview */}
      {showImagePreview && (
        <div className="p-3 border-t bg-card">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium">Image Preview</h3>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => {
                setShowImagePreview(false);
                setPreviewImage('');
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative mb-3">
            <img 
              src={previewImage} 
              alt="Preview" 
              className="max-h-60 rounded-md object-contain mx-auto" 
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSendImage}>
              <Send className="h-4 w-4 mr-2" />
              Send Image
            </Button>
          </div>
        </div>
      )}

      {/* Attachment menu */}
      {showAttachMenu && (
        <div className="p-3 border-t bg-card">
          <div className="flex space-x-4">
            <div 
              className="flex flex-col items-center cursor-pointer"
              onClick={triggerFilePicker}
            >
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <ImageIcon className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xs mt-1">Image</span>
            </div>
            
            <div className="flex flex-col items-center cursor-pointer">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Paperclip className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xs mt-1">Document</span>
            </div>
            
            <div className="flex flex-col items-center cursor-pointer">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xs mt-1">Contact</span>
            </div>
          </div>
        </div>
      )}

      {/* Chat input */}
      {isRecording ? (
        <div className="p-3 border-t bg-card">
          <div className="flex items-center">
            <div className="flex-1 bg-muted rounded-md p-3">
              <div className="flex items-center">
                <Badge variant="destructive" className="animate-pulse mr-2">
                  Recording
                </Badge>
                <div className="flex-1">
                  <Progress value={45} className="h-1.5" />
                </div>
                <span className="text-sm ml-2">0:15</span>
              </div>
            </div>
            
            <div className="flex ml-2">
              <Button 
                variant="destructive"
                size="icon" 
                className="rounded-full"
                onClick={handleCancelRecording}
              >
                <X className="h-5 w-5" />
              </Button>
              <Button 
                variant="default"
                size="icon" 
                className="rounded-full ml-2"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-3 border-t bg-card">
          <div className="flex items-center">
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileSelected}
            />
            
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setShowAttachMenu(!showAttachMenu)}
            >
              <Paperclip className="h-5 w-5" />
            </Button>
            
            <div className="flex-1 mx-2">
              <Input
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                className="bg-muted border-0"
              />
            </div>
            
            {message.trim() ? (
              <Button 
                size="icon" 
                className="rounded-full"
                onClick={handleSendMessage}
              >
                <Send className="h-5 w-5" />
              </Button>
            ) : (
              <VoiceRecorder 
                onRecordingComplete={handleRecordingComplete}
                onRecordingStart={() => setIsRecording(true)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatDetail;
