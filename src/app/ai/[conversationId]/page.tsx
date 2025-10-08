"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChatMessagesArea } from "@/components/chat/chat-message";
import { ConversationSkeleton } from "@/components/chat/conversation-skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/lib/api.service";
import { type Message, type Conversation } from "@/types/chat.types";

export default function ConversationPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const messagesAreaRef = useRef<{ scrollToBottom: () => void; scrollToTop: () => void }>(null);

  const conversationId = params.conversationId as string;

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const [streamingContent, setStreamingContent] = useState<string>("");

  // Get user from localStorage
  const userStr = typeof window !== 'undefined' ? localStorage.getItem("user") : null;
  const user = userStr ? JSON.parse(userStr) : { name: "Guest", email: "" };

  // Determine mode from conversation
  const selectedMode = conversation?.mode === 'AGENTIC' ? 'agentic' : 'chat';

  // Load conversation on mount
  useEffect(() => {
    if (conversationId) {
      loadConversation();
    }
  }, [conversationId]);

  const loadConversation = async () => {
    try {
      setIsLoading(true);
      console.log('Loading conversation:', conversationId);
      
      const fetchedConversation = await apiService.getConversationMessages(conversationId);
      
      console.log('Conversation loaded:', fetchedConversation);
      
      // Transform messages to frontend format
      const transformedMessages = fetchedConversation.messages?.map(msg => ({
        id: msg.id,
        content: msg.content,
        role: (msg.role === "USER" ? "user" : msg.role === "ASSISTANT" ? "assistant" : "system") as "user" | "assistant" | "system",
        attachments: msg.attachments,
        metadata: msg.metadata,
        createdAt: msg.createdAt
      })) || [];
      
      setConversation({
        ...fetchedConversation,
        messages: transformedMessages,
        lastMessage: transformedMessages[transformedMessages.length - 1]?.content || ''
      });
      
    } catch (error) {
      console.error('Failed to load conversation:', error);
      toast({
        title: "Failed to load conversation",
        description: error instanceof Error ? error.message : "This conversation may not exist",
        variant: "destructive",
      });
      
      // Redirect to welcome page if conversation not found
      router.push('/ai');
    } finally {
      setIsLoading(false);
    }
  };

  // Stream text effect for AI responses
  const streamText = (text: string, messageId: string) => {
    const words = text.split(' ');
    let currentIndex = 0;
    
    const streamInterval = setInterval(() => {
      if (currentIndex >= words.length) {
        clearInterval(streamInterval);
        setStreamingMessageId(null);
        setStreamingContent("");
        return;
      }

      const wordsToAdd = Math.min(3, words.length - currentIndex);
      currentIndex += wordsToAdd;
      const nextChunk = words.slice(0, currentIndex).join(' ');
      setStreamingContent(nextChunk);
      
      // Update conversation messages with streaming content
      setConversation(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          messages: prev.messages?.map(msg =>
            msg.id === messageId ? { ...msg, content: nextChunk } : msg
          ) || [],
          lastMessage: nextChunk
        };
      });
    }, 60);

    return () => clearInterval(streamInterval);
  };

  const handleSendMessage = async (content: string, file?: File) => {
    if (!content.trim() && !file) return;
    if (!conversation) return;

    try {
      // Add user message to UI immediately
      const userMessage: Message = {
        id: `temp-${Date.now()}`,
        content,
        role: "user",
        attachments: file ? [file.name] : [],
        createdAt: new Date().toISOString()
      };

      setConversation(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          messages: [...(prev.messages || []), userMessage],
          lastMessage: content
        };
      });

      setIsSendingMessage(true);

      // Send message to backend
      const mode = conversation.mode || 'NORMAL';
      // console.log('Sending message to conversation:', conversationId);
      
      const response = await apiService.sendMessage(
        conversationId,
        content,
        mode,
        file
      );

      // Refetch conversation to get assistant's response
      const updatedConversation = await apiService.getConversationMessages(conversationId);
      
      setIsSendingMessage(false);

      // Transform messages
      const transformedMessages = updatedConversation.messages?.map(msg => ({
        id: msg.id,
        content: msg.content,
        role: (msg.role === "USER" ? "user" : msg.role === "ASSISTANT" ? "assistant" : "system") as "user" | "assistant" | "system",
        attachments: msg.attachments,
        metadata: msg.metadata,
        createdAt: msg.createdAt
      })) || [];
      
      // Find the last assistant message
      const lastAssistantMessage = transformedMessages.filter(m => m.role === 'assistant').pop();
      
      // Update conversation
      setConversation({
        ...updatedConversation,
        messages: transformedMessages,
        lastMessage: lastAssistantMessage?.content || "",
        sessionId: response.conversation.sessionId,
        documentId: response.conversation.documentId
      });

      // Start streaming effect for the assistant's response
      if (lastAssistantMessage) {
        setStreamingMessageId(lastAssistantMessage.id);
        streamText(lastAssistantMessage.content, lastAssistantMessage.id);
      }

    } catch (error) {
      console.error('Failed to send message:', error);
      setIsSendingMessage(false);
      
      toast({
        title: "Failed to send message",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });

      // Show fallback error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm having trouble processing your request right now. Please try again.",
        role: "assistant",
        createdAt: new Date().toISOString()
      };

      setConversation(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          messages: [...(prev.messages || []), errorMessage]
        };
      });
    }
  };

  const handleRegenerate = (content: string) => {
    handleSendMessage(content);
  };

  // Show skeleton while loading
  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="flex-1 overflow-y-auto metallic-scrollbar">
          <ConversationSkeleton />
        </div>
      </div>
    );
  }

  // Show error if no conversation (shouldn't happen due to redirect)
  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2 text-neutral-300">
            Conversation not found
          </h2>
          <p className="text-neutral-500">
            This conversation may have been deleted or doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <ChatMessagesArea
        ref={messagesAreaRef}
        user={user}
        activeConversation={conversation}
        isLoading={isSendingMessage}
        selectedMode={selectedMode}
        streamingMessageId={streamingMessageId}
        streamingContent={streamingContent}
        onSendMessage={handleSendMessage}
        isNewConversationSelected={false}
        onRegenerate={handleRegenerate}
      />
    </div>
  );
}