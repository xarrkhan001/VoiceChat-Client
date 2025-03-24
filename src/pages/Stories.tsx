
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, MoreVertical, Image as ImageIcon, Smile, Send, X, ArrowLeft, ArrowRight, Camera, Video as VideoIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { storiesData } from '@/lib/mockData';
import EmojiPicker from '@/components/EmojiPicker';

const Stories = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const isMobile = useIsMobile();
  const [stories, setStories] = useState(storiesData);
  const { toast } = useToast();
  const [showStoryUpload, setShowStoryUpload] = useState(false);
  
  // Check if user has their own story
  useEffect(() => {
    const userName = localStorage.getItem('userName') || 'User';
    const userAvatar = localStorage.getItem('userAvatar') || 'https://i.pravatar.cc/150?img=3';
    
    // If user doesn't have a story entry yet, create one
    if (!stories.some(s => s.user.id === 'me')) {
      setStories(prevStories => [
        {
          id: 'my-story',
          user: {
            id: 'me',
            name: userName,
            avatar: userAvatar
          },
          stories: [],
          isYourStory: true
        },
        ...prevStories
      ]);
    }
  }, []);
  
  const filteredStories = stories.filter(story => 
    story.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddStory = (url: string, type: 'image' | 'video', duration?: number) => {
    const myStoryIndex = stories.findIndex(s => s.user.id === 'me');
    
    if (myStoryIndex !== -1) {
      // Add to existing stories array
      const updatedStories = [...stories];
      updatedStories[myStoryIndex] = {
        ...updatedStories[myStoryIndex],
        stories: [
          ...updatedStories[myStoryIndex].stories,
          {
            id: `s${Date.now()}`,
            type,
            url,
            timestamp: 'Just now',
            duration: duration || 5 // Default 5 seconds for images, actual duration for videos
          }
        ]
      };
      
      setStories(updatedStories);
      toast({
        title: "Story added successfully",
        description: "Your story will be visible for 24 hours",
      });
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b bg-card">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">Stories</h1>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setShowStoryUpload(true)}
          >
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
      
      {/* Story Upload Dialog */}
      <Dialog open={showStoryUpload} onOpenChange={setShowStoryUpload}>
        <DialogContent className="sm:max-w-md">
          <div className="p-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add Story</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowStoryUpload(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <StoryUploader 
                type="image" 
                onUploadComplete={(url) => {
                  handleAddStory(url, 'image');
                  setShowStoryUpload(false);
                }} 
              />
              
              <StoryUploader 
                type="video" 
                onUploadComplete={(url, duration) => {
                  handleAddStory(url, 'video', duration);
                  setShowStoryUpload(false);
                }} 
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
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

interface StoryUploaderProps {
  type: 'image' | 'video';
  onUploadComplete: (url: string, duration?: number) => void;
}

const StoryUploader: React.FC<StoryUploaderProps> = ({ type, onUploadComplete }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const isCorrectType = type === 'image' 
      ? file.type.startsWith('image/') 
      : file.type.startsWith('video/');
    
    if (!isCorrectType) {
      toast({
        title: `Invalid file type`,
        description: `Please select a ${type} file`,
        variant: "destructive"
      });
      return;
    }
    
    // Simulate file upload
    setIsUploading(true);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          
          // Create object URL for the selected file
          const url = URL.createObjectURL(file);
          
          if (type === 'video') {
            // Create a temporary video element to get the duration
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.onloadedmetadata = () => {
              onUploadComplete(url, video.duration);
            };
            video.onerror = () => {
              // Fall back to default duration if we can't get the actual duration
              onUploadComplete(url, 10);
            };
            video.src = url;
          } else {
            onUploadComplete(url);
          }
          
          return 0;
        }
        return prev + 10;
      });
    }, 300);
  };
  
  return (
    <div className="flex flex-col items-center">
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="h-32 w-full rounded-lg border-2 border-dashed border-muted-foreground/50 flex flex-col items-center justify-center hover:bg-muted/50 cursor-pointer transition-colors"
      >
        {isUploading ? (
          <div className="flex flex-col items-center w-full p-4">
            <div className="text-sm mb-2">Uploading... {uploadProgress}%</div>
            <Progress value={uploadProgress} className="w-full h-2" />
          </div>
        ) : (
          <>
            {type === 'image' ? (
              <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
            ) : (
              <VideoIcon className="h-8 w-8 text-muted-foreground mb-2" />
            )}
            <p className="text-sm text-muted-foreground text-center">
              Click to upload {type}
            </p>
          </>
        )}
      </div>
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden"
        accept={type === 'image' ? 'image/*' : 'video/*'}
        onChange={handleFileSelect}
      />
      <Button 
        variant="outline" 
        className="mt-2 w-full"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
      >
        Select {type}
      </Button>
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
      duration?: number;
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
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [videoMuted, setVideoMuted] = useState(false);
  
  const hasStories = story.stories.length > 0;
  const activeStory = hasStories ? story.stories[activeStoryIndex] : null;
  
  const handleNextStory = () => {
    if (activeStoryIndex < story.stories.length - 1) {
      setActiveStoryIndex(activeStoryIndex + 1);
      setProgress(0);
      setIsPaused(false);
    } else {
      setOpen(false);
    }
  };
  
  const handlePrevStory = () => {
    if (activeStoryIndex > 0) {
      setActiveStoryIndex(activeStoryIndex - 1);
      setProgress(0);
      setIsPaused(false);
    }
  };
  
  const handleSendReply = () => {
    if (replyText.trim()) {
      toast({
        title: "Reply sent",
        description: `You replied to ${story.user.name}'s story`
      });
      setReplyText('');
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setReplyText(prev => prev + emoji);
  };
  
  const togglePause = () => {
    if (activeStory?.type === 'video' && videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().catch(err => console.error("Video play error:", err));
        setIsPaused(false);
      } else {
        videoRef.current.pause();
        setIsPaused(true);
      }
    } else {
      setIsPaused(!isPaused);
    }
  };
  
  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setVideoMuted(!videoMuted);
    }
  };
  
  // Handle video loading and autoplay
  useEffect(() => {
    if (open && activeStory?.type === 'video' && videoRef.current) {
      // Configure video element
      videoRef.current.onloadedmetadata = () => {
        if (videoRef.current) {
          setVideoDuration(videoRef.current.duration);
          // Auto-play video when story is opened
          videoRef.current.play()
            .then(() => {
              setIsPaused(false);
            })
            .catch(err => {
              console.error("Video autoplay failed:", err);
              // Some browsers block autoplay with sound
              if (videoRef.current) {
                videoRef.current.muted = true;
                setVideoMuted(true);
                // Try again with muted audio
                videoRef.current.play().catch(err => console.error("Muted autoplay failed:", err));
              }
            });
        }
      };
      
      // Handle video end
      videoRef.current.onended = () => {
        handleNextStory();
      };
    }
  }, [open, activeStory, activeStoryIndex]);
  
  // Progress timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (open && hasStories && !isPaused) {
      const storyDuration = activeStory?.type === 'video' 
        ? (videoDuration || activeStory.duration || 10) * 1000 
        : (activeStory?.duration || 5) * 1000;
        
      const interval = 50; // Update every 50ms for smooth progress
      const increment = (interval / storyDuration) * 100;
      
      timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            handleNextStory();
            return 0;
          }
          return prev + increment;
        });
      }, interval);
    }
    
    return () => {
      clearInterval(timer);
    };
  }, [open, activeStoryIndex, hasStories, isPaused, videoDuration, activeStory]);
  
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
                <div className="flex items-center space-x-1">
                  {activeStory?.type === 'video' && (
                    <Button variant="ghost" size="icon" className="text-white" onClick={toggleMute}>
                      {videoMuted ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="1" y1="1" x2="23" y2="23"></line>
                          <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
                          <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 5L6 9H2v6h4l5 4zM22 9l-6 6M16 9l6 6"></path>
                        </svg>
                      )}
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" className="text-white" onClick={() => setOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
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
              {activeStory?.type === 'video' ? (
                <video 
                  ref={videoRef}
                  src={activeStory.url} 
                  className="max-h-full max-w-full object-contain"
                  playsInline
                />
              ) : (
                <img 
                  src={activeStory?.url} 
                  alt={story.user.name} 
                  className="max-h-full max-w-full object-contain"
                />
              )}
              
              {/* Pause indicator */}
              {isPaused && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center">
                    <div className="h-14 w-14 rounded-full bg-white/40 flex items-center justify-center">
                      <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center">
                        <Play className="h-6 w-6 text-black" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Story controls */}
              <div className="absolute inset-0 flex">
                <div className="w-1/3" onClick={handlePrevStory}></div>
                <div className="w-1/3" onClick={togglePause}></div>
                <div className="w-1/3" onClick={handleNextStory}></div>
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
                
                <EmojiPicker onEmojiSelect={handleEmojiSelect} />
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleSendReply} 
                  disabled={!replyText.trim()}
                >
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

// Missing Play icon
const Play = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
);

export default Stories;
