
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Headphones, Video, Camera, User, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const Welcome = () => {
  const navigate = useNavigate();

  const features = [
    { title: 'Instant Messaging', icon: MessageSquare, color: 'from-blue-400 to-blue-600' },
    { title: 'Voice Messages', icon: Headphones, color: 'from-green-400 to-green-600' },
    { title: 'Video Calls', icon: Video, color: 'from-purple-400 to-purple-600' },
    { title: 'Share Stories', icon: Camera, color: 'from-amber-400 to-amber-600' },
    { title: 'Customizable Profile', icon: User, color: 'from-pink-400 to-pink-600' },
    { title: 'Connect Globally', icon: Globe, color: 'from-cyan-400 to-cyan-600' },
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
    <div className="min-h-screen flex flex-col bg-background overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-15%] right-[-5%] h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-[-15%] left-[-5%] h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      </div>
      
      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 py-12 flex-1 flex flex-col items-center justify-center max-w-5xl">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="mb-4 inline-flex p-2 bg-primary/10 rounded-lg">
            <MessageSquare className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to Chat Wave</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A modern messaging platform with everything you need to stay connected
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
              className="bg-card border rounded-xl p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow"
            >
              <div className={`p-3 rounded-full bg-gradient-to-r ${feature.color} mb-4`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button size="lg" onClick={() => navigate('/chats')} className="px-8">
            Get Started
          </Button>
          <Button variant="outline" size="lg" onClick={() => window.open('#', '_blank')} className="px-8">
            Learn More
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
