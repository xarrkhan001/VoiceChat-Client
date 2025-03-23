
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  MessageSquare, 
  Headphones, 
  Video, 
  Camera, 
  User, 
  Globe, 
  LogIn, 
  UserPlus,
  Sparkles,
  Shield,
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import ThemeToggle from '@/components/ThemeToggle';

const Welcome = () => {
  const navigate = useNavigate();

  const features = [
    { title: 'Instant Messaging', icon: MessageSquare, color: 'from-blue-500 to-blue-700', description: 'Chat with friends in real-time' },
    { title: 'Voice Messages', icon: Headphones, color: 'from-green-500 to-green-700', description: 'Send audio clips easily' },
    { title: 'Video Calls', icon: Video, color: 'from-purple-500 to-purple-700', description: 'Face-to-face conversations' },
    { title: 'Share Stories', icon: Camera, color: 'from-amber-500 to-amber-700', description: 'Share moments that matter' },
    { title: 'Rich Profiles', icon: User, color: 'from-pink-500 to-pink-700', description: 'Customize your presence' },
    { title: 'Global Reach', icon: Globe, color: 'from-cyan-500 to-cyan-700', description: 'Connect with people worldwide' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-background/80 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-15%] right-[-5%] h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-[-15%] left-[-5%] h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      </div>
      
      {/* Header */}
      <header className="relative z-10 p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="h-10 w-10 rounded-md bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
            <MessageSquare className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold">Chat Wave</span>
        </div>
        <div className="flex items-center space-x-3">
          <ThemeToggle />
          <Button variant="outline" size="sm" asChild className="gap-1">
            <Link to="/login">
              <LogIn className="h-4 w-4" />
              <span>Sign In</span>
            </Link>
          </Button>
          <Button size="sm" asChild className="gap-1">
            <Link to="/signup">
              <UserPlus className="h-4 w-4" />
              <span>Sign Up</span>
            </Link>
          </Button>
        </div>
      </header>
      
      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 py-12 flex-1 flex flex-col items-center justify-center max-w-5xl">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="mb-6 inline-flex p-5 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full">
            <MessageSquare className="h-14 w-14 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Connect with Chat Wave</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The modern messaging platform with everything you need to stay connected
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 w-full"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-card border rounded-xl p-6 flex flex-col items-center text-center hover:shadow-md transition-all hover:-translate-y-1"
            >
              <div className={`p-4 rounded-full bg-gradient-to-r ${feature.color} mb-4`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Security Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex flex-col items-center mb-12 border-t border-b py-8 px-4 w-full"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Safe and Secure
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            <div className="flex flex-col items-center text-center p-4">
              <Shield className="h-10 w-10 text-primary mb-3" />
              <h3 className="font-medium mb-1">Data Protection</h3>
              <p className="text-sm text-muted-foreground">Your conversations are protected</p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <Lock className="h-10 w-10 text-primary mb-3" />
              <h3 className="font-medium mb-1">Privacy First</h3>
              <p className="text-sm text-muted-foreground">Your information stays private</p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <User className="h-10 w-10 text-primary mb-3" />
              <h3 className="font-medium mb-1">Account Control</h3>
              <p className="text-sm text-muted-foreground">Manage your digital identity</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button size="lg" onClick={() => navigate('/signup')} className="px-8 gap-2">
            <UserPlus className="h-5 w-5" />
            Get Started
          </Button>
          <Button variant="outline" size="lg" onClick={() => navigate('/login')} className="px-8 gap-2">
            <LogIn className="h-5 w-5" />
            Sign In
          </Button>
        </motion.div>
      </div>
      
      {/* Footer */}
      <footer className="relative z-10 py-6 text-center border-t bg-card/50 backdrop-blur-sm">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Chat Wave. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Welcome;
