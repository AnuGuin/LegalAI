// hooks/use-chat.ts
import { useState, useCallback } from 'react';
import { apiService } from '@/lib/api.service';
import { type Conversation, type Message } from '@/types/chat.types';
import { useToast } from '@/hooks/use-toast';

export function useChat() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const { toast } = useToast();

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  // Load all conversations
  const loadConversations = useCallback(async () => {
    try {
      setIsLoadingConversations(true);
      const fetchedConversations = await apiService.getConversations();
      
      const transformedConversations = fetchedConversations.map(conv => ({
        ...conv,
        messages: conv.messages?.map(msg => ({
          ...msg,
          role: msg.role.toLowerCase() as "user" | "assistant" | "system"
        })) || [],
        lastMessage: conv.messages?.[conv.messages.length - 1]?.content || ''
      }));
      
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
  }, [toast]);

  // Create new conversation
  const createConversation = useCallback(async (
    mode: 'NORMAL' | 'AGENTIC',
    title: string
  ) => {
    try {
      const newConv = await apiService.createConversation(mode, title);
      
      const transformedConv = {
        ...newConv,
        messages: [],
        lastMessage: ''
      };
      
      setConversations(prev => [transformedConv, ...prev]);
      setActiveConversationId(newConv.id);
      
      return newConv.id;
    } catch (error) {
      console.error('Failed to create conversation:', error);
      toast({
        title: "Failed to create conversation",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
      throw error;
    }
  }, [toast]);

  // Load conversation messages
  const loadConversationMessages = useCallback(async (conversationId: string) => {
    try {
      const fullConversation = await apiService.getConversationMessages(conversationId);
      
      setConversations(prev => prev.map(c => 
        c.id === conversationId 
          ? {
              ...fullConversation,
              messages: fullConversation.messages?.map(msg => ({
                ...msg,
                role: msg.role.toLowerCase() as "user" | "assistant" | "system"
              })) || [],
              lastMessage: fullConversation.messages?.[fullConversation.messages.length - 1]?.content || ''
            }
          : c
      ));
    } catch (error) {
      console.error('Failed to load conversation messages:', error);
      toast({
        title: "Failed to load conversation",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Select conversation
  const selectConversation = useCallback(async (conversationId: string) => {
    const conv = conversations.find(c => c.id === conversationId);
    
    // Load messages if not already loaded
    if (!conv?.messages || conv.messages.length === 0) {
      await loadConversationMessages(conversationId);
    }
    
    setActiveConversationId(conversationId);
  }, [conversations, loadConversationMessages]);

  // Delete conversation
  const deleteConversation = useCallback(async (conversationId: string) => {
    try {
      await apiService.deleteConversation(conversationId);
      
      setConversations(prev => prev.filter(conv => conv.id !== conversationId));
      
      if (activeConversationId === conversationId) {
        setActiveConversationId(null);
      }

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
  }, [activeConversationId, toast]);

  // Update conversation locally
  const updateConversationLocally = useCallback((
    conversationId: string,
    updates: Partial<Conversation>
  ) => {
    setConversations(prev => prev.map(conv =>
      conv.id === conversationId ? { ...conv, ...updates } : conv
    ));
  }, []);

  // Add message to conversation locally
  const addMessageLocally = useCallback((
    conversationId: string,
    message: Message
  ) => {
    setConversations(prev => prev.map(conv =>
      conv.id === conversationId
        ? {
            ...conv,
            messages: [...(conv.messages || []), message],
            lastMessage: message.content
          }
        : conv
    ));
  }, []);

  return {
    conversations,
    activeConversation,
    activeConversationId,
    isLoading,
    isLoadingConversations,
    setIsLoading,
    setActiveConversationId,
    loadConversations,
    createConversation,
    selectConversation,
    deleteConversation,
    updateConversationLocally,
    addMessageLocally,
  };
}