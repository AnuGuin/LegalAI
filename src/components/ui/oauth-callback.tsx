"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BounceLoader from "@/components/ui/bounce-loader";
import { useToast } from "@/hooks/use-toast";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/api$/, '');

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const handleCallback = async () => {
      // Get tokens from URL params
      const token = searchParams.get('token');
      const refreshToken = searchParams.get('refreshToken');
      const error = searchParams.get('error');

      if (error) {
        toast({
          title: "Authentication Failed",
          description: error,
          variant: "destructive",
        });
        router.push('/auth');
        return;
      }

      if (token && refreshToken) {
        try {
          // Store tokens
          localStorage.setItem('authToken', token);
          localStorage.setItem('refreshToken', refreshToken);

          // Fetch user info using the token
          const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            
            if (data.success && data.data) {
              localStorage.setItem('user', JSON.stringify(data.data));
              
              toast({
                title: "Success!",
                description: "Logged in successfully.",
              });

              // Redirect to AI page
              router.push('/ai');
            } else {
              throw new Error('Failed to fetch user data');
            }
          } else {
            throw new Error('Authentication failed');
          }
        } catch (error) {
          console.error('OAuth callback error:', error);
          toast({
            title: "Error",
            description: "Failed to complete authentication. Please try again.",
            variant: "destructive",
          });
          router.push('/auth');
        }
      } else {
        toast({
          title: "Error",
          description: "Missing authentication tokens.",
          variant: "destructive",
        });
        router.push('/auth');
      }
    };

    handleCallback();
  }, [searchParams, router, toast]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <BounceLoader />
        <p className="text-muted-foreground">Completing authentication...</p>
      </div>
    </div>
  );
}