'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import TocDialog from '@/components/docs/terms/toc-dialog';
import PrivacyDialog from '@/components/docs/terms/privacy-dialog';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Ensure API_BASE_URL doesn't include /api suffix as endpoints already include it
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/api$/, '');

interface LoginFormProps {
  onAuthenticated?: (user: { name: string; email: string; avatar?: string }) => void;
}

export default function LoginForm({ onAuthenticated }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); //only for sign-up
  const [showPassword, setShowPassword] = useState(false);
  const [showTermsDialog, setShowTermsDialog] = useState(false);
  const [showPrivacyDialog, setShowPrivacyDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (!isLogin && !name) {
      toast({
        title: "Validation Error",
        description: "Please enter your name.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const body = isLogin 
        ? { email, password }
        : { email, password, name };

      console.log('Login Form: Attempting authentication', { 
        endpoint: `${API_BASE_URL}${endpoint}`, 
        isLogin,
        email: email ? email.substring(0, 3) + '***' : 'empty' // Log partial email for debugging
      });

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      console.log('Login Form: API Response', { 
        status: response.status, 
        ok: response.ok, 
        data: data 
      });

      if (!response.ok) {
        throw new Error(data.message || `${isLogin ? 'Login' : 'Registration'} failed`);
      }

      if (data.success && data.data) {
        // Store tokens
        localStorage.setItem('authToken', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        
        // Store user info
        const userData = {
          name: data.data.user.name,
          email: data.data.user.email,
          avatar: data.data.user.avatar,
        };
        
        // Store user data in localStorage for the AI page to access
        localStorage.setItem('user', JSON.stringify(userData));
        console.log('Login Form: User data stored in localStorage', userData);

        toast({
          title: "Success!",
          description: isLogin ? "Logged in successfully." : "Account created successfully.",
        });

        if (onAuthenticated) {
          onAuthenticated(userData);
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      toast({
        title: "Authentication Failed",
        description: error instanceof Error ? error.message : "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Redirect to Google OAuth
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  const handleFacebookLogin = () => {
    // Redirect to Facebook OAuth
    window.location.href = `${API_BASE_URL}/auth/facebook`;
  };
  
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Dark Dotted Grid Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900",
          backgroundImage: 
            `radial-gradient(circle, rgba(156,163,175,0.5) 1px, transparent 1px),
            radial-gradient(circle, rgba(107,114,128,0.3) 1px, transparent 1px)`,
          backgroundSize: "20px 20px, 40px 40px",
          backgroundPosition: "0 0, 10px 10px",
          }}
      />
      <div className="relative z-10 grid min-h-screen grid-cols-1 md:grid-cols-2 max-h-screen">
        <motion.div
          className="hidden flex-1 items-center justify-center space-y-8 p-8 text-center md:flex"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              className="space-y-6"
            >
              <motion.h1
                className="text-4xl md:text-6xl font-bold leading-tight tracking-tight bg-gradient-to-r from-blue-400 via-blue-300 to-blue-500 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              >
                LegalAI
              </motion.h1>
              <motion.p
                className="text-lg md:text-xl text-muted-foreground leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
              >
                Transform your legal intelligence with AI-powered solutions
              </motion.p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
              className="mt-8"
            >
              <Button 
                onClick={() => setIsLogin(false)}
                className="bg-gradient-to-r from-indigo-600 to-blue-600 text-center text-white hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Sign Up as a Lawyer
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Side - Login/Register Form */}
        <motion.div
          className="flex flex-1 items-center justify-center p-4 md:p-8 overflow-y-auto max-h-screen"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <motion.div
            className="w-full max-w-md my-auto"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          >
            <Card className="border-border/70 bg-card/20 w-full shadow-[0_10px_26px_#e0e0e0a1] backdrop-blur-lg dark:shadow-none max-h-[90vh] overflow-y-auto">
              <CardContent className="space-y-4 p-6 md:p-8">
                {/* Logo and Header */}
                <motion.div
                  className="space-y-4 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4, ease: 'easeOut' }}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <motion.span 
                      className="text-2xl font-bold tracking-tight md:text-4xl"
                      key={isLogin ? 'login-title' : 'register-title'}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      {isLogin ? 'Welcome Back' : 'Create Account'}
                    </motion.span>
                  </div>
                  <motion.p 
                    className="text-muted-foreground text-sm"
                    key={isLogin ? 'login-desc' : 'register-desc'}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    {isLogin 
                      ? 'Sign in to access your AI-powered legal assistant and streamline your legal queries.'
                      : 'Join LegalAI to get started with your AI-powered legal assistant.'
                    }
                  </motion.p>
                </motion.div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name Input (Register only) */}
                  {!isLogin && (
                    <motion.div
                      className="space-y-2"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your full name"
                        required={!isLogin}
                      />
                    </motion.div>
                  )}

                  {/* Email Input */}
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5, ease: 'easeOut' }}
                  >
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </motion.div>

                  {/* Password Input */}
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6, ease: 'easeOut' }}
                  >
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="border-border border pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </motion.div>

                  {/* Submit Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7, ease: 'easeOut' }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700" 
                      disabled={isLoading || !email || !password || (!isLogin && !name)}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {isLogin ? 'Signing in...' : 'Creating account...'}
                        </>
                      ) : (
                        isLogin ? 'Login' : 'Sign Up'
                      )}
                    </Button>
                  </motion.div>

                  {/* Toggle Login/Register */}
                  <div className="text-center text-sm">
                    <button
                      type="button"
                      onClick={() => setIsLogin(!isLogin)}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
                    </button>
                  </div>
                </form>

                {/* Divider */}
                <motion.div
                  className="relative"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.8, ease: 'easeOut' }}
                >
                  <div className="absolute inset-0 flex items-center">
                    <div className="border-border w-full border-t"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-slate-600 text-muted-foreground px-2">
                      Or continue with
                    </span>
                  </div>
                </motion.div>

                {/* OAuth Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.9, ease: 'easeOut' }}
                >
                  <div className="grid grid-cols-2 gap-3">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button 
                        type="button" 
                        onClick={handleFacebookLogin}
                        disabled={isLoading}
                        className="w-full bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 shadow-sm"
                      >
                        <svg
                          className="h-5 w-5 text-indigo-600"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        <span className="sr-only">Login with Facebook</span>
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button 
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        className="w-full bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 shadow-sm"
                      >
                        <svg
                          className="h-5 w-5 text-indigo-600"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        <span className="sr-only">Login with Google</span>
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Terms */}
                <motion.p
                  className="text-muted-foreground mt-1 text-center text-xs"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.0, ease: 'easeOut' }}
                >
                  By signing in you agree to LegalAI's{' '}
                  <button
                    type="button"
                    onClick={() => setShowTermsDialog(true)}
                    className="text-muted-foreground hover:text-primary underline cursor-pointer"
                  >
                    terms of service
                  </button>{' '}
                  and{' '}
                  <button
                    type="button"
                    onClick={() => setShowPrivacyDialog(true)}
                    className="text-muted-foreground hover:text-primary underline cursor-pointer"
                  >
                    privacy policy
                  </button>
                  .
                </motion.p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Terms and Privacy Dialogs */}
      <TocDialog 
        open={showTermsDialog} 
        onOpenChange={setShowTermsDialog} 
      />
      <PrivacyDialog 
        open={showPrivacyDialog} 
        onOpenChange={setShowPrivacyDialog} 
      />
    </div>
  );
}
