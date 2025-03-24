
// Mock contacts for the chat app
export const mockContacts = [
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
  },
  {
    id: '4',
    name: 'David Brown',
    avatar: 'https://i.pravatar.cc/150?img=7',
    lastSeen: new Date(Date.now() - 1000 * 60 * 30),
    isOnline: true,
  },
  {
    id: '5',
    name: 'Emma Davis',
    avatar: 'https://i.pravatar.cc/150?img=9',
    lastSeen: new Date(Date.now() - 1000 * 60 * 120),
    isOnline: true,
  }
];

// Generate mock messages for chat detail
export const generateMockMessages = (contactId: string) => {
  const contact = mockContacts.find(c => c.id === contactId);
  const currentUser = {
    id: 'me',
    name: localStorage.getItem('userName') || 'You',
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

// Stories data
export const storiesData = [
  {
    id: '1',
    user: {
      id: 'me',
      name: 'Your Story',
      avatar: localStorage.getItem('userAvatar') || 'https://i.pravatar.cc/150?img=3',
    },
    stories: [],
    isYourStory: true,
  },
  {
    id: '2',
    user: {
      id: '1',
      name: 'Sarah Johnson',
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
      id: '2',
      name: 'Michael Chen',
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
      id: '3',
      name: 'Jessica Williams',
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
      id: '4',
      name: 'David Brown',
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

// Mock chat data
export const chatData = [
  {
    id: '1',
    name: 'Sarah Johnson',
    avatar: 'https://i.pravatar.cc/150?img=1',
    lastMessage: 'Hey, are we still meeting today?',
    time: '10:42 AM',
    unread: 3,
    online: true,
  },
  {
    id: '2',
    name: 'Michael Chen',
    avatar: 'https://i.pravatar.cc/150?img=2',
    lastMessage: "I've sent you the documents 📄",
    time: 'Yesterday',
    unread: 0,
    online: false,
  },
  {
    id: '3',
    name: 'Jessica Williams',
    avatar: 'https://i.pravatar.cc/150?img=5',
    lastMessage: 'Thanks for your help!',
    time: 'Yesterday',
    unread: 0,
    online: true,
  },
  {
    id: '4',
    name: 'David Brown',
    avatar: 'https://i.pravatar.cc/150?img=7',
    lastMessage: 'Let me check and get back to you',
    time: 'Monday',
    unread: 0,
    online: false,
  },
  {
    id: '5',
    name: 'Emma Davis',
    avatar: 'https://i.pravatar.cc/150?img=9',
    lastMessage: 'That sounds great! 👍',
    time: 'Monday',
    unread: 1,
    online: true,
  },
];
