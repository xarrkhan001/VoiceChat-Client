
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, MoreVertical, Image as ImageIcon, Smile, Send, X, ArrowLeft, ArrowRight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useIsMobile } from '@/hooks/use-mobile';

// Mock stories data
const storiesData = [
  {
    id: '1',
    user: {
      id: '1',
      name: 'Your Story',
      avatar: 'https://i.pravatar.cc/150?img=3',
    },
    stories: [],
    isYourStory: true,
  },
  {
    id: '2',
    user: {
      id: '2',
      name: 'Alice Johnson',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    stories: [
      {
        id: 's1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1617501884912-17de21c40d1c?w=800&auto=format&fit=crop',
        timestamp: '2 hours ago',
      },
      {
        id: 's2',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1673191897612-8bba1e33fd56?w=800&auto=format&fit=crop',
        timestamp: '1 hour ago',
      },
    ],
  },
  {
    id: '3',
    user: {
      id: '3',
      name: 'Bob Smith',
      avatar: 'https://i.pravatar.cc/150?img=2',
    },
    stories: [
      {
        id: 's3',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1533050487297-09b450131914?w=800&auto=format&fit=crop',
        timestamp: '5 hours ago',
      },
    ],
  },
  {
    id: '4',
    user: {
      id: '4',
      name: 'Carol Williams',
      avatar: 'https://i.pravatar.cc/150?img=5',
    },
    stories: [
      {
        id: 's4',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1516203294340-5ba5f612dc6a?w=800&auto=format&fit=crop',
        timestamp: '8 hours ago',
      },
      {
        id: 's5',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1535913775056-4374754663c9?w=800&auto=format&fit=crop',
        timestamp: '7 hours ago',
      },
      {
        id: 's6',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1624836018860-8bf21e244bfe?w=800&auto=format&fit=crop',
        timestamp: '6 hours ago',
      },
    ],
  },
  {
    id: '5',
    user: {
      id: '5',
      name: 'Dave Brown',
      avatar: 'https://i.pravatar.cc/150?img=7',
    },
    stories: [
      {
        id: 's7',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1569931727741-dd7f6482e65f?w=800&auto=format&fit=crop',
        timestamp: '12 hours ago',
      },
    ],
  },
];

const Stories = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const isMobile = useIsMobile();
  
  const filteredStories = storiesData.filter(story => 
    story.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b bg-card">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">Stories</h1>
          <Button variant="ghost" size="icon">
            <Plus className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search stories..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredStories.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      </div>
    </div>
  );
};

interface StoryCardProps {
  story: {
    id: string;
    user: {
      id: string;
      name: string;
      avatar: string;
    };
    stories: {
      id: string;
      type: string;
      url: string;
      timestamp: string;
    }[];
    isYourStory?: boolean;
  };
}

const StoryCard = ({ story }: StoryCardProps) => {
  const isMobile = useIsMobile();
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  
  const hasStories = story.stories.length > 0;
  const activeStory = hasStories ? story.stories[activeStoryIndex] : null;
  
  const handleNextStory = () => {
    if (activeStoryIndex < story.stories.length - 1) {
      setActiveStoryIndex(activeStoryIndex + 1);
      setProgress(0);
    } else {
      setOpen(false);
    }
  };
  
  const handlePrevStory = () => {
    if (activeStoryIndex > 0) {
      setActiveStoryIndex(activeStoryIndex - 1);
      setProgress(0);
    }
  };
  
  const handleSendReply = () => {
    if (replyText.trim()) {
      console.log('Sending reply:', replyText);
      setReplyText('');
    }
  };
  
  // Progress timer
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (open && hasStories) {
      timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            handleNextStory();
            return 0;
          }
          return prev + 1;
        });
      }, 50);
    }
    
    return () => {
      clearInterval(timer);
    };
  }, [open, activeStoryIndex, hasStories]);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="relative rounded-xl overflow-hidden cursor-pointer aspect-[3/4] bg-muted/50 hover:opacity-90 transition-opacity">
          {hasStories ? (
            <>
              <img 
                src={story.stories[0].url} 
                alt={story.user.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40" />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
          
          <div className="absolute top-3 left-3 flex items-center">
            <div className={`${hasStories ? 'story-ring' : ''}`}>
              <div className="relative">
                <Avatar className="h-10 w-10 border-2 border-background">
                  <AvatarImage src={story.user.avatar} />
                  <AvatarFallback>{story.user.name[0]}</AvatarFallback>
                </Avatar>
                {story.isYourStory && (
                  <div className="absolute bottom-0 right-0 bg-primary rounded-full p-1 border-2 border-background">
                    <Plus className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-3 left-3 right-3">
            <div className="text-white font-medium text-sm">{story.user.name}</div>
            {hasStories && (
              <div className="text-white/80 text-xs">{story.stories.length} {story.stories.length === 1 ? 'story' : 'stories'}</div>
            )}
          </div>
        </div>
      </DialogTrigger>
      
      {hasStories && (
        <DialogContent className="sm:max-w-md p-0 bg-background overflow-hidden max-h-[90vh] sm:max-h-[80vh]">
          <div className="relative h-full flex flex-col">
            {/* Story header */}
            <div className="absolute top-0 left-0 right-0 z-10 p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <Button variant="ghost" size="icon" className="text-white" onClick={() => setOpen(false)}>
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <Avatar className="h-8 w-8 border border-white">
                    <AvatarImage src={story.user.avatar} />
                    <AvatarFallback>{story.user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium text-white">{story.user.name}</div>
                    <div className="text-xs text-white/70">{activeStory?.timestamp}</div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-white" onClick={() => setOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              {/* Progress bars */}
              <div className="flex space-x-1 mt-3">
                {story.stories.map((s, idx) => (
                  <Progress 
                    key={s.id} 
                    value={idx === activeStoryIndex ? progress : idx < activeStoryIndex ? 100 : 0} 
                    className="h-1 flex-1"
                  />
                ))}
              </div>
            </div>
            
            {/* Story content */}
            <div className="relative flex-1 flex items-center justify-center bg-black">
              <img 
                src={activeStory?.url} 
                alt={story.user.name} 
                className="max-h-full max-w-full object-contain"
              />
              
              {/* Story controls */}
              <div className="absolute inset-0 flex">
                <div className="w-1/2" onClick={handlePrevStory}></div>
                <div className="w-1/2" onClick={handleNextStory}></div>
              </div>
            </div>
            
            {/* Story reply */}
            <div className="p-3 border-t bg-card">
              <div className="flex items-center">
                <Input
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Reply to story..."
                  className="mr-2"
                />
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <Smile className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleSendReply} disabled={!replyText.trim()}>
                  <Send className={`h-5 w-5 ${replyText.trim() ? 'text-primary' : 'text-muted-foreground'}`} />
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default Stories;
