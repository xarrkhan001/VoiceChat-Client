
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  Mic, 
  MicOff, 
  Camera, 
  CameraOff, 
  PhoneOff,
  ScreenShare,
  FlipHorizontal,
  MoreVertical
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { mockContacts } from '@/lib/mockData';

const VideoCall = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [contact, setContact] = useState<any>(null);
  
  // Find contact info
  useEffect(() => {
    const foundContact = mockContacts.find(c => c.id === id);
    if (foundContact) {
      setContact(foundContact);
      // Simulate video loading
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    } else {
      toast({
        title: "Contact not found",
        description: "Could not find contact information",
        variant: "destructive"
      });
      navigate('/video-calls');
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
  
  const handleCameraToggle = () => {
    setCameraEnabled(!cameraEnabled);
    toast({
      title: cameraEnabled ? "Camera off" : "Camera on",
    });
  };
  
  const handleEndCall = () => {
    toast({
      title: "Call ended",
      description: `Call duration: ${formatTime(callDuration)}`,
    });
    navigate('/video-calls');
  };
  
  const handleFlipCamera = () => {
    toast({
      title: "Camera flipped",
    });
  };
  
  const handleScreenShare = () => {
    toast({
      title: "Screen sharing started",
      description: "Others can now see your screen",
    });
  };
  
  if (!contact) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="text-white">Loading call...</div>
      </div>
    );
  }
  
  return (
    <div className="relative h-screen bg-black overflow-hidden">
      {/* Remote video (fullscreen background) */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={contact.avatar} />
                <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="text-white text-xl">Connecting...</div>
              <div className="mt-4 flex space-x-2">
                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            {cameraEnabled ? (
              <img 
                src={`https://i.pravatar.cc/1000?img=${id}`} 
                alt="Remote Video" 
                className="min-h-full min-w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-black">
                <Avatar className="h-40 w-40">
                  <AvatarImage src={contact.avatar} />
                  <AvatarFallback className="text-4xl">{contact.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Call info */}
      <div className="absolute top-6 left-6 flex items-center space-x-3 bg-black/50 backdrop-blur-sm p-2 rounded-lg z-10">
        <h1 className="text-white font-semibold">{contact.name}</h1>
        <span className="text-white/70 text-sm">{formatTime(callDuration)}</span>
      </div>
      
      <div className="absolute top-6 right-6 z-10">
        <Button variant="ghost" size="icon" className="text-white">
          <MoreVertical className="h-6 w-6" />
        </Button>
      </div>
      
      {/* Self video */}
      <div className="absolute bottom-24 right-4 w-1/4 aspect-video bg-background/10 rounded-lg overflow-hidden border-2 border-white/20 z-10">
        {cameraEnabled ? (
          <img 
            src={localStorage.getItem('userAvatar') || 'https://i.pravatar.cc/150?img=3'} 
            alt="Self Video" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-black/80">
            <CameraOff className="h-8 w-8 text-white/70" />
          </div>
        )}
      </div>
      
      {/* Call controls */}
      <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-center z-10">
        <div className="flex items-center justify-center space-x-4 bg-black/30 backdrop-blur-md rounded-full px-6 py-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleFlipCamera}
                className="rounded-full h-12 w-12 bg-white/10 hover:bg-white/20 text-white"
              >
                <FlipHorizontal className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Flip Camera</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleScreenShare}
                className="rounded-full h-12 w-12 bg-white/10 hover:bg-white/20 text-white"
              >
                <ScreenShare className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Share Screen</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={micEnabled ? "ghost" : "destructive"}
                size="icon"
                className={`rounded-full h-12 w-12 ${micEnabled ? 'bg-white/10 hover:bg-white/20 text-white' : ''}`}
                onClick={handleMicToggle}
              >
                {micEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{micEnabled ? 'Mute' : 'Unmute'}</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="destructive"
                size="icon"
                className="rounded-full h-14 w-14"
                onClick={handleEndCall}
              >
                <PhoneOff className="h-6 w-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>End call</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={cameraEnabled ? "ghost" : "destructive"}
                size="icon"
                className={`rounded-full h-12 w-12 ${cameraEnabled ? 'bg-white/10 hover:bg-white/20 text-white' : ''}`}
                onClick={handleCameraToggle}
              >
                {cameraEnabled ? <Camera className="h-5 w-5" /> : <CameraOff className="h-5 w-5" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{cameraEnabled ? 'Turn off camera' : 'Turn on camera'}</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
