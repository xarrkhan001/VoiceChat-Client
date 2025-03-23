
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MessageSquare, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Extract a name from the email for demo purposes
      const userName = email.split('@')[0]
        .split('.')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
      
      // For demo purposes, set authentication in localStorage
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userName', userName);
      
      // Set a default avatar if none exists
      if (!localStorage.getItem('userAvatar')) {
        localStorage.setItem('userAvatar', 'https://i.pravatar.cc/150?img=3');
      }
      
      toast.success('Login successful');
      setIsLoading(false);
      navigate('/chats');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gradient-to-b from-background to-background/80">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-5%] right-[-5%] h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-[-5%] left-[-5%] h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
      </div>
      
      <div className="relative z-10 w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="p-3 rounded-full bg-primary/10">
            <MessageSquare className="h-10 w-10 text-primary" />
          </div>
        </div>
        
        <Card className="border-none shadow-lg bg-card/90 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <p className="text-muted-foreground mt-2">Sign in to your account to continue</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" checked={rememberMe} onCheckedChange={(checked) => setRememberMe(checked as boolean)} />
                <Label htmlFor="remember" className="text-sm font-normal">Remember me</Label>
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
              
              {/* Demo shortcut for testing */}
              <Button 
                type="button" 
                variant="outline" 
                className="w-full" 
                onClick={() => {
                  setEmail('demo@example.com');
                  setPassword('password');
                  toast.info('Demo credentials filled in. Click Sign In to continue.');
                }}
              >
                Use Demo Account
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t px-6 py-4">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary hover:underline font-medium">
                Create account
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
