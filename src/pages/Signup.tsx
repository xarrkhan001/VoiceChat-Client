
import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MessageSquare, Mail, Lock, User, Eye, EyeOff, UserPlus, CheckCircle, Shield, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

const Signup = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setAvatarUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName || !email || !password || !confirmPassword) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (!acceptTerms) {
      toast.error('Please accept the terms and conditions');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // For demo purposes, set authentication in localStorage
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userName', fullName);
      
      // Save the avatar URL
      if (avatarUrl) {
        localStorage.setItem('userAvatar', avatarUrl);
      } else {
        // Set a default avatar
        localStorage.setItem('userAvatar', `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 8) + 1}`);
      }
      
      toast.success('Account created successfully');
      setIsLoading(false);
      navigate('/chats');
    }, 1500);
  };

  const clearAvatar = () => {
    setAvatarUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gradient-to-b from-background to-background/80">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-5%] right-[-5%] h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-[-5%] left-[-5%] h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
      </div>
      
      <div className="relative z-10 w-full max-w-md">
        <Link to="/" className="block">
          <div className="flex justify-center mb-8">
            <div className="p-3 rounded-full bg-gradient-to-br from-primary/20 to-primary/5">
              <MessageSquare className="h-10 w-10 text-primary" />
            </div>
          </div>
        </Link>
        
        <Card className="border-none shadow-lg bg-card/90 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">Create an account</CardTitle>
            <p className="text-muted-foreground mt-2">Join our chat community today</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="flex flex-col items-center mb-6">
                <div className="relative">
                  <Avatar className="h-24 w-24 border-2 border-primary/20 cursor-pointer mb-2 hover:opacity-90 transition-opacity" onClick={() => fileInputRef.current?.click()}>
                    {avatarUrl ? (
                      <AvatarImage src={avatarUrl} alt="Avatar preview" />
                    ) : (
                      <>
                        <AvatarFallback className="bg-muted">
                          <User className="h-10 w-10 text-muted-foreground" />
                        </AvatarFallback>
                      </>
                    )}
                  </Avatar>
                  {avatarUrl && (
                    <Button 
                      type="button" 
                      variant="secondary" 
                      size="icon" 
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                      onClick={clearAvatar}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  className="mt-1 text-xs"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-3 w-3 mr-1" /> 
                  {avatarUrl ? 'Change Photo' : 'Upload Photo'}
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    className="pl-10"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              </div>
              
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
                <Label htmlFor="password">Password</Label>
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
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={acceptTerms} 
                  onCheckedChange={(checked) => setAcceptTerms(checked as boolean)} 
                />
                <Label htmlFor="terms" className="text-sm font-normal">
                  I accept the <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                </Label>
              </div>
              
              <div className="p-3 bg-primary/5 rounded-lg space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Your data is secure with us</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  We use industry-standard encryption to protect your personal information.
                </p>
              </div>
              
              <Button type="submit" className="w-full gap-2 bg-gradient-to-r from-primary to-primary/90 hover:opacity-90" disabled={isLoading}>
                {isLoading ? (
                  <>Creating Account...</>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" />
                    Create Account
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t px-6 py-4">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
