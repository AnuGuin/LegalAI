"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ChatSidebar from "@/components/misc/chat-sidebar";
import { ChatModeSelector } from "@/components/misc/mode-selector";
import BounceLoader from "@/components/ui/bounce-loader";
import { useToast } from "@/hooks/use-toast";
import { apiService, type Conversation as BackendConversation } from "@/lib/api.service";
import { type Conversation } from "@/types/chat.types";

interface User {
  name: string;
  email: string;
  avatar?: string;
}

export default function AILayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  const [user, setUser] = useState<User | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [selectedMode, setSelectedMode] = useState<'chat' | 'agentic'>('chat');

  // Extract active conversation ID from pathname
  const activeConversationId = pathname.startsWith('/ai/') && pathname !== '/ai' 
    ? pathname.split('/ai/')[1] 
    : null;

  // Check authentication on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const authToken = localStorage.getItem("authToken");
    
    console.log("AI Layout: Checking authentication...", { 
      hasUser: !!storedUser, 
      hasToken: !!authToken 
    });
    
    if (storedUser && authToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log("AI Layout: User authenticated", parsedUser);
        setUser(parsedUser);
        setIsCheckingAuth(false);
      } catch (error) {
        console.error("Failed to parse user data:", error);
        router.push("/auth");
      }
    } else {
      console.log("AI Layout: No authentication found, redirecting");
      router.push("/auth");
    }
  }, [router]);

  // Load conversations after authentication
  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  const loadConversations = async () => {
    try {
      setIsLoadingConversations(true);
      const fetchedConversations = await apiService.getConversations();
      
      console.log('Layout: Fetched conversations:', fetchedConversations);
      
      // Transform conversations for sidebar
      const transformedConversations = fetchedConversations.map(conv => {
        const messages = conv.messages?.map(msg => ({
          id: msg.id,
          content: msg.content,
          role: (msg.role === "USER" ? "user" : msg.role === "ASSISTANT" ? "assistant" : "system") as "user" | "assistant" | "system",
          attachments: msg.attachments,
          metadata: msg.metadata,
          createdAt: msg.createdAt
        })) || [];
        
        return {
          ...conv,
          messages,
          lastMessage: messages[messages.length - 1]?.content || ''
        };
      });
      
      setConversations(transformedConversations);
    } catch (error) {
      console.error('Failed to load conversations:', error);
      toast({
        title: "Failed to load conversations",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoadingConversations(false);
    }
  };

  const handleModeChange = (mode: string) => {
    setSelectedMode(mode as 'chat' | 'agentic');
  };

  const handleNewConversation = () => {
    router.push('/ai');
  };

  const handleSelectConversation = (id: string) => {
    router.push(`/ai/${id}`);
  };

  const handleShareConversation = async () => {
    if (!activeConversationId) return;

    try {
      const result = await apiService.shareConversation(activeConversationId, true);

      if (result.link) {
        try {
          await navigator.clipboard.writeText(result.link);
          toast({
            title: "Share link copied",
            description: "A secure shareable link has been created and copied to your clipboard.",
          });
        } catch (err) {
          console.error('Failed to copy share link to clipboard:', err);
          toast({
            title: "Share link created",
            description: result.link,
          });
        }
      } else if (result.message) {
        toast({
          title: "Share status",
          description: result.message,
        });
      }
    } catch (error) {
      console.error('Failed to update sharing status:', error);
      toast({
        title: "Failed to share conversation",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleDeleteConversation = async () => {
    if (!activeConversationId) return;
    
    try {
      await apiService.deleteConversation(activeConversationId);
      
      // Remove from local state
      setConversations(prev => prev.filter(conv => conv.id !== activeConversationId));
      
      // Navigate to welcome screen
      router.push('/ai');

      toast({
        title: "Conversation deleted",
        description: "The conversation has been deleted successfully.",
      });
    } catch (error) {
      console.error('Failed to delete conversation:', error);
      toast({
        title: "Failed to delete",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleTempChatClick = () => {
    // For now, just navigate to welcome screen
    // Future: Could implement ephemeral conversations
    handleNewConversation();
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    setUser(null);
    router.push("/");
  };

  // Expose function to add new conversation (will be called from children)
  const addConversation = (conversation: Conversation) => {
    setConversations(prev => [conversation, ...prev]);
  };

  // Show loader while checking auth
  if (isCheckingAuth || !user) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="loader"
          className="fixed inset-0 flex items-center justify-center bg-background z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <BounceLoader />
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div className="flex h-screen relative overflow-hidden" style={{ maxWidth: '100vw' }}>
      {/* Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "rgb(33, 33, 33)",
          backgroundSize: "30px 30px",
          backgroundPosition: "0 0",
        }}
      />

      {/* Sidebar - Persists across route changes */}
      <ChatSidebar
        user={user}
        conversations={conversations.map(c => ({
          id: c.id,
          title: c.title,
          messages: c.messages || [],
          lastMessage: c.lastMessage || ""
        }))}
        activeConversationId={activeConversationId || undefined}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
        onLogout={handleLogout}
      />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col relative z-10 min-w-0 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] h-full" style={{ maxWidth: 'calc(100vw - 65px)' }}>
        {/* Mode Selector - Persists across route changes */}
        <div className="sticky top-0 z-20 bg-[rgb(33,33,33)] flex-shrink-0">
          <ChatModeSelector
            variant={activeConversationId ? 'chat-selected' : 'default'}
            onModeChange={handleModeChange}
            onTempChatClick={handleTempChatClick}
            onShareClick={handleShareConversation}
            onDeleteClick={handleDeleteConversation}
          />
        </div>

        {/* Page content - This changes based on route */}
        {/*
          When there is no active conversation (welcome /ai), place the
          children inside an absolutely centered container so the input
          and welcome message sit perfectly in the middle. For active
          conversations keep the normal flow.
        */}
        <div className="flex-1 overflow-hidden min-h-0 relative">
          {activeConversationId ? (
            <div className="h-full overflow-hidden min-h-0">{children}</div>
          ) : (
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex items-center justify-center p-6" style={{ top: 'calc(50% - 30px)' }}>
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}