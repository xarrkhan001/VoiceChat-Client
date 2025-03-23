
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Phone, Plus, PhoneCall, PhoneMissed, PhoneIncoming, PhoneOutgoing, Video } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data for calls
const callsData = [
  {
    id: '1',
    name: 'Alice Johnson',
    avatar: 'https://i.pravatar.cc/150?img=1',
    timestamp: '10:42 AM',
    type: 'incoming',
    status: 'answered',
    isVideo: false,
    duration: '5:23',
  },
  {
    id: '2',
    name: 'Bob Smith',
    avatar: 'https://i.pravatar.cc/150?img=2',
    timestamp: 'Yesterday',
    type: 'outgoing',
    status: 'answered',
    isVideo: true,
    duration: '15:07',
  },
  {
    id: '3',
    name: 'Carol Williams',
    avatar: 'https://i.pravatar.cc/150?img=5',
    timestamp: 'Yesterday',
    type: 'missed',
    status: 'missed',
    isVideo: false,
    duration: null,
  },
  {
    id: '4',
    name: 'Dave Brown',
    avatar: 'https://i.pravatar.cc/150?img=7',
    timestamp: 'Monday',
    type: 'incoming',
    status: 'answered',
    isVideo: false,
    duration: '2:45',
  },
  {
    id: '5',
    name: 'Eve Davis',
    avatar: 'https://i.pravatar.cc/150?img=9',
    timestamp: 'Monday',
    type: 'outgoing',
    status: 'missed',
    isVideo: true,
    duration: null,
  },
];

const Calls = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredCalls = callsData.filter(call => 
    call.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const allCalls = filteredCalls;
  const missedCalls = filteredCalls.filter(call => call.status === 'missed');

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b bg-card">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">Calls</h1>
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon">
              <PhoneIncoming className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <PhoneOutgoing className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search calls..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <Tabs defaultValue="all" className="w-full">
          <div className="px-4 pt-4">
            <TabsList className="w-full">
              <TabsTrigger value="all" className="flex-1">All Calls</TabsTrigger>
              <TabsTrigger value="missed" className="flex-1">Missed</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="all" className="mt-0">
            {allCalls.length > 0 ? (
              <div className="divide-y">
                {allCalls.map((call) => (
                  <CallItem key={call.id} call={call} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 p-4 text-center">
                <Phone className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No calls found</h3>
                <p className="text-muted-foreground mt-1">Try a different search term</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="missed" className="mt-0">
            {missedCalls.length > 0 ? (
              <div className="divide-y">
                {missedCalls.map((call) => (
                  <CallItem key={call.id} call={call} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 p-4 text-center">
                <PhoneMissed className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No missed calls</h3>
                <p className="text-muted-foreground mt-1">You haven't missed any calls</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Floating action button */}
      <div className="fixed bottom-6 right-6">
        <Button size="icon" className="h-14 w-14 rounded-full shadow-lg">
          <Phone className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

interface CallItemProps {
  call: {
    id: string;
    name: string;
    avatar: string;
    timestamp: string;
    type: string;
    status: string;
    isVideo: boolean;
    duration: string | null;
  };
}

const CallItem = ({ call }: CallItemProps) => {
  return (
    <div className="py-3 px-4 hover:bg-muted/40">
      <div className="flex items-center">
        <div className="mr-3">
          <Avatar>
            <AvatarImage src={call.avatar} />
            <AvatarFallback>{call.name[0]}</AvatarFallback>
          </Avatar>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center">
            <h3 className="font-medium truncate">{call.name}</h3>
          </div>
          <div className="flex items-center text-sm">
            {call.type === 'incoming' ? (
              <PhoneIncoming className="h-3 w-3 mr-1 text-green-500" />
            ) : call.type === 'outgoing' ? (
              <PhoneOutgoing className="h-3 w-3 mr-1 text-blue-500" />
            ) : (
              <PhoneMissed className="h-3 w-3 mr-1 text-red-500" />
            )}
            
            <span className={`${call.status === 'missed' ? 'text-red-500' : 'text-muted-foreground'}`}>
              {call.isVideo ? 'Video call' : 'Voice call'} • {call.timestamp}
              {call.duration && ` • ${call.duration}`}
            </span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
            {call.isVideo ? (
              <Video className="h-4 w-4 text-primary" />
            ) : (
              <Phone className="h-4 w-4 text-primary" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Calls;
