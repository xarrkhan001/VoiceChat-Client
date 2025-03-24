
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  Mic, 
  MicOff, 
  PhoneOff,
  Phone,
  Speaker,
  Volume2,
  MoreVertical 
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { mockContacts } from '@/lib/mockData';

const AudioCall = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [micEnabled, setMicEnabled] = useState(true);
  const [speakerEnabled, setSpeakerEnabled] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [contact, setContact] = useState<any>(null);
  
  // Find contact info
  useEffect(() => {
    const foundContact = mockContacts.find(c => c.id === id);
    if (foundContact) {
      setContact(foundContact);
    } else {
      toast({
        title: "Contact not found",
        description: "Could not find contact information",
        variant: "destructive"
      });
      navigate('/calls');
    }
  }, [id, navigate, toast]);
  
  // Call timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };
  
  const handleMicToggle = () => {
    setMicEnabled(!micEnabled);
    toast({
      title: micEnabled ? "Microphone off" : "Microphone on",
    });
  };
  
  const handleSpeakerToggle = () => {
    setSpeakerEnabled(!speakerEnabled);
    toast({
      title: speakerEnabled ? "Speaker off" : "Speaker on",
    });
  };
  
  const handleEndCall = () => {
    toast({
      title: "Call ended",
      description: `Call duration: ${formatTime(callDuration)}`,
    });
    navigate('/calls');
  };
  
  if (!contact) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="text-white">Loading call...</div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center justify-between h-screen bg-gradient-to-b from-black to-background/90 p-6">
      <div className="absolute top-6 left-6">
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white"
          onClick={() => navigate('/calls')}
        >
          <MoreVertical className="h-6 w-6" />
        </Button>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center">
        <Avatar className="h-36 w-36 mb-8 ring-4 ring-primary/20 ring-offset-4 ring-offset-background/10">
          <AvatarImage src={contact.avatar} />
          <AvatarFallback className="text-4xl">{contact.name.charAt(0)}</AvatarFallback>
        </Avatar>
        
        <h1 className="text-3xl font-bold text-white mb-2">{contact.name}</h1>
        <div className="text-xl text-white/80 mb-6">{formatTime(callDuration)}</div>
        
        <div className="flex items-center space-x-2 text-white/60">
          <div className={`w-2 h-2 rounded-full ${micEnabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span>{micEnabled ? 'Microphone on' : 'Microphone off'}</span>
        </div>
      </div>
      
      <div className="pb-10 w-full max-w-md">
        <div className="flex items-center justify-center space-x-6">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={micEnabled ? "outline" : "destructive"}
                size="icon"
                className="h-14 w-14 rounded-full bg-white/10 backdrop-blur-lg border-white/20"
                onClick={handleMicToggle}
              >
                {micEnabled ? <Mic className="h-6 w-6 text-white" /> : <MicOff className="h-6 w-6" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{micEnabled ? 'Mute microphone' : 'Unmute microphone'}</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="destructive"
                size="icon"
                className="h-16 w-16 rounded-full"
                onClick={handleEndCall}
              >
                <PhoneOff className="h-8 w-8" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>End call</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={speakerEnabled ? "outline" : "secondary"}
                size="icon"
                className="h-14 w-14 rounded-full bg-white/10 backdrop-blur-lg border-white/20"
                onClick={handleSpeakerToggle}
              >
                {speakerEnabled ? 
                  <Volume2 className="h-6 w-6 text-white" /> : 
                  <Speaker className="h-6 w-6 text-white" />
                }
              </Button>
            </TooltipTrigger>
            <TooltipContent>{speakerEnabled ? 'Turn off speaker' : 'Turn on speaker'}</TooltipContent>
          </Tooltip>
        </div>
        
        <div className="mt-8 flex justify-center">
          <div className="animate-pulse flex items-center space-x-2 text-white/60 text-sm">
            <div className="h-2 w-2 rounded-full bg-green-400"></div>
            <span>Secure call · End-to-end encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioCall;
