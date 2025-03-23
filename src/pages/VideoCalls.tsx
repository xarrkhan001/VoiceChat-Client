
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Video, 
  Plus, 
  Users, 
  Mic, 
  MicOff, 
  Camera, 
  CameraOff, 
  PhoneOff, 
  MoreVertical,
  Share,
  ScreenShare,
  MessageSquare,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Mock data for recent video calls
const recentCallsData = [
  {
    id: '1',
    name: 'Alice Johnson',
    avatar: 'https://i.pravatar.cc/150?img=1',
    timestamp: '3 hours ago',
    duration: '15:42',
    participants: 2,
  },
  {
    id: '2',
    name: 'Team Meeting',
    avatar: 'https://i.pravatar.cc/150?img=12',
    timestamp: 'Yesterday',
    duration: '45:20',
    participants: 5,
  },
  {
    id: '3',
    name: 'Bob Smith',
    avatar: 'https://i.pravatar.cc/150?img=2',
    timestamp: 'Yesterday',
    duration: '10:15',
    participants: 2,
  },
  {
    id: '4',
    name: 'Product Demo',
    avatar: 'https://i.pravatar.cc/150?img=15',
    timestamp: 'Monday',
    duration: '32:08',
    participants: 4,
  },
];

// Mock contacts for new call
const contactsData = [
  {
    id: '1',
    name: 'Alice Johnson',
    avatar: 'https://i.pravatar.cc/150?img=1',
    online: true,
  },
  {
    id: '2',
    name: 'Bob Smith',
    avatar: 'https://i.pravatar.cc/150?img=2',
    online: false,
  },
  {
    id: '3',
    name: 'Carol Williams',
    avatar: 'https://i.pravatar.cc/150?img=5',
    online: true,
  },
  {
    id: '4',
    name: 'Dave Brown',
    avatar: 'https://i.pravatar.cc/150?img=7',
    online: false,
  },
  {
    id: '5',
    name: 'Eve Davis',
    avatar: 'https://i.pravatar.cc/150?img=9',
    online: true,
  },
];

const VideoCalls = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCallDialogOpen, setActiveCallDialogOpen] = useState(false);
  const [newCallDialogOpen, setNewCallDialogOpen] = useState(false);
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  
  const filteredCalls = recentCallsData.filter(call => 
    call.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredContacts = contactsData.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMicToggle = () => {
    setMicEnabled(!micEnabled);
  };

  const handleCameraToggle = () => {
    setCameraEnabled(!cameraEnabled);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b bg-card">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">Video Calls</h1>
          <Dialog open={newCallDialogOpen} onOpenChange={setNewCallDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Plus className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <div className="p-1">
                <h2 className="text-xl font-semibold mb-4">New Video Call</h2>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search contacts..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="space-y-2 max-h-[50vh] overflow-y-auto">
                  {filteredContacts.map((contact) => (
                    <div 
                      key={contact.id}
                      className="flex items-center p-2 hover:bg-muted rounded-md cursor-pointer"
                      onClick={() => {
                        setNewCallDialogOpen(false);
                        setActiveCallDialogOpen(true);
                      }}
                    >
                      <div className="relative mr-3">
                        <Avatar>
                          <AvatarImage src={contact.avatar} />
                          <AvatarFallback>{contact.name[0]}</AvatarFallback>
                        </Avatar>
                        {contact.online && (
                          <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-background"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{contact.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {contact.online ? 'Online' : 'Offline'}
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Video className="h-4 w-4 text-primary" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search video calls..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {/* Active Call Dialog */}
      <Dialog open={activeCallDialogOpen} onOpenChange={setActiveCallDialogOpen}>
        <DialogContent className="sm:max-w-4xl p-0 h-[80vh]">
          <div className="relative h-full flex flex-col bg-black">
            {/* Video area */}
            <div className="flex-1 flex">
              {/* Remote video (full screen) */}
              <div className="relative w-full h-full">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src="https://i.pravatar.cc/150?img=1" />
                    <AvatarFallback>AJ</AvatarFallback>
                  </Avatar>
                </div>
                
                {/* Self video (picture-in-picture) */}
                <div className="absolute bottom-4 right-4 w-1/4 aspect-video bg-gray-800 rounded-lg overflow-hidden border-2 border-background">
                  <div className="w-full h-full flex items-center justify-center">
                    {cameraEnabled ? (
                      <Avatar className="h-14 w-14">
                        <AvatarImage src="https://i.pravatar.cc/150?img=3" />
                        <AvatarFallback>You</AvatarFallback>
                      </Avatar>
                    ) : (
                      <CameraOff className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                </div>
                
                {/* Call info */}
                <div className="absolute top-4 left-4 flex items-center space-x-3 bg-black/50 backdrop-blur-sm p-2 rounded-lg">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://i.pravatar.cc/150?img=1" />
                    <AvatarFallback>AJ</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium text-white">Alice Johnson</div>
                    <div className="text-xs text-white/70">00:05:32</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Call controls */}
            <div className="p-4 bg-card border-t flex items-center justify-between">
              <div className="flex space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem>
                      <ScreenShare className="h-4 w-4 mr-2" />
                      <span>Share screen</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      <span>Chat</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Users className="h-4 w-4 mr-2" />
                      <span>Add people</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="flex space-x-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={micEnabled ? "secondary" : "destructive"}
                      size="icon"
                      className="rounded-full h-12 w-12"
                      onClick={handleMicToggle}
                    >
                      {micEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{micEnabled ? 'Mute microphone' : 'Unmute microphone'}</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={cameraEnabled ? "secondary" : "destructive"}
                      size="icon"
                      className="rounded-full h-12 w-12"
                      onClick={handleCameraToggle}
                    >
                      {cameraEnabled ? <Camera className="h-5 w-5" /> : <CameraOff className="h-5 w-5" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{cameraEnabled ? 'Turn off camera' : 'Turn on camera'}</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="rounded-full h-12 w-12"
                      onClick={() => setActiveCallDialogOpen(false)}
                    >
                      <PhoneOff className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>End call</TooltipContent>
                </Tooltip>
              </div>
              
              <div className="flex space-x-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                    >
                      <Share className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Share</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Recent calls */}
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-3">Recent</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCalls.map((call) => (
            <Card key={call.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-muted/30 p-4 flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={call.avatar} />
                    <AvatarFallback>{call.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-medium">{call.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {call.participants} participants • {call.timestamp} • {call.duration}
                    </p>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Video className="h-4 w-4 mr-2" />
                        Join
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-4xl p-0 h-[80vh]">
                      {/* Call interface would go here, same as activeCallDialog */}
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Scheduled calls */}
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-3">Scheduled</h2>
        <Card className="bg-muted/30">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <Video className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="font-medium text-lg mb-2">No scheduled calls</h3>
            <p className="text-muted-foreground mb-4">
              You don't have any upcoming video calls scheduled.
            </p>
            <Button onClick={() => setNewCallDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Schedule a call
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {/* Floating action button */}
      <div className="fixed bottom-6 right-6">
        <Button size="icon" className="h-14 w-14 rounded-full shadow-lg" onClick={() => setNewCallDialogOpen(true)}>
          <Video className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default VideoCalls;
