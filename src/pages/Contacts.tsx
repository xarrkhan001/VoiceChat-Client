
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, UserPlus, MoreVertical, Phone, Video, Star, ChevronRight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data for contacts
const contactsData = [
  {
    id: '1',
    name: 'Alice Johnson',
    avatar: 'https://i.pravatar.cc/150?img=1',
    phone: '+1 (555) 123-4567',
    email: 'alice@example.com',
    online: true,
    favorite: true,
  },
  {
    id: '2',
    name: 'Bob Smith',
    avatar: 'https://i.pravatar.cc/150?img=2',
    phone: '+1 (555) 234-5678',
    email: 'bob@example.com',
    online: false,
    favorite: true,
  },
  {
    id: '3',
    name: 'Carol Williams',
    avatar: 'https://i.pravatar.cc/150?img=5',
    phone: '+1 (555) 345-6789',
    email: 'carol@example.com',
    online: true,
    favorite: false,
  },
  {
    id: '4',
    name: 'Dave Brown',
    avatar: 'https://i.pravatar.cc/150?img=7',
    phone: '+1 (555) 456-7890',
    email: 'dave@example.com',
    online: false,
    favorite: false,
  },
  {
    id: '5',
    name: 'Eve Davis',
    avatar: 'https://i.pravatar.cc/150?img=9',
    phone: '+1 (555) 567-8901',
    email: 'eve@example.com',
    online: true,
    favorite: false,
  },
  {
    id: '6',
    name: 'Frank Miller',
    avatar: 'https://i.pravatar.cc/150?img=11',
    phone: '+1 (555) 678-9012',
    email: 'frank@example.com',
    online: false,
    favorite: false,
  },
];

const Contacts = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredContacts = contactsData.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phone.includes(searchQuery) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const favoriteContacts = filteredContacts.filter(contact => contact.favorite);
  const allContacts = filteredContacts;

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b bg-card">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">Contacts</h1>
          <Button variant="ghost" size="icon">
            <UserPlus className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search contacts..."
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
              <TabsTrigger value="all" className="flex-1">All Contacts</TabsTrigger>
              <TabsTrigger value="favorites" className="flex-1">Favorites</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="all" className="mt-0">
            {allContacts.length > 0 ? (
              <div className="divide-y">
                {allContacts.map((contact) => (
                  <ContactItem key={contact.id} contact={contact} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 p-4 text-center">
                <Search className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No contacts found</h3>
                <p className="text-muted-foreground mt-1">Try a different search term</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="favorites" className="mt-0">
            {favoriteContacts.length > 0 ? (
              <div className="divide-y">
                {favoriteContacts.map((contact) => (
                  <ContactItem key={contact.id} contact={contact} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 p-4 text-center">
                <Star className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No favorite contacts</h3>
                <p className="text-muted-foreground mt-1">Mark contacts as favorites to see them here</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Floating action button */}
      <div className="fixed bottom-6 right-6">
        <Button size="icon" className="h-14 w-14 rounded-full shadow-lg">
          <UserPlus className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

interface ContactItemProps {
  contact: {
    id: string;
    name: string;
    avatar: string;
    phone: string;
    email: string;
    online: boolean;
    favorite: boolean;
  };
}

const ContactItem = ({ contact }: ContactItemProps) => {
  return (
    <div className="py-3 px-4 hover:bg-muted/40">
      <div className="flex items-center">
        <div className="relative mr-3">
          <Avatar>
            <AvatarImage src={contact.avatar} />
            <AvatarFallback>{contact.name[0]}</AvatarFallback>
          </Avatar>
          {contact.online && (
            <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-background"></div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center">
            <h3 className="font-medium truncate">{contact.name}</h3>
            {contact.favorite && (
              <Star className="h-3 w-3 text-amber-400 ml-1 fill-amber-400" />
            )}
          </div>
          <p className="text-sm text-muted-foreground truncate">{contact.phone}</p>
        </div>
        
        <div className="flex space-x-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Phone className="h-4 w-4 text-primary" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Video className="h-4 w-4 text-primary" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Contacts;
