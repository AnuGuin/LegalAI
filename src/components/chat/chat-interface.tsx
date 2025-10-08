"use client"

import { useState, useRef, useEffect } from "react"
import ChatSidebar from "@/components/misc/chat-sidebar"
import { ChatMessagesArea } from "./chat-message"
import { ChatModeSelector } from "../misc/mode-selector"
import { useAiMode } from '@/context/ai-mode-context';
import { useToast } from "@/hooks/use-toast"
import { apiService, type Conversation as BackendConversation, type Message as BackendMessage } from "@/lib/api.service"
import { type Message, type MessageRole, type Conversation } from "@/types/chat.types"
import { ConversationSkeleton } from "./conversation-skeleton"
import { DeleteConversationDialog } from "./delete-conversation-dialog"

interface ChatInterfaceProps {
  user: { name: string; email: string; avatar?: string }
  onLogout: () => void
}

// Transform backend message format to frontend format
function transformMessage(msg: BackendMessage): Message {
  return {
    id: msg.id,
    content: msg.content,
    role: (msg.role === "USER" ? "user" : msg.role === "ASSISTANT" ? "assistant" : "system") as MessageRole,
    attachments: msg.attachments,
    metadata: msg.metadata,
    createdAt: msg.createdAt
  }
}

export function ChatInterface({ user, onLogout }: ChatInterfaceProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingConversations, setIsLoadingConversations] = useState(true)
  const [isNewConversationSelected, setIsNewConversationSelected] = useState(false)
  // Use shared mode from context
  const { selectedMode } = useAiMode();
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null)
  const [streamingContent, setStreamingContent] = useState<string>("")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const messagesAreaRef = useRef<{ scrollToBottom: () => void; scrollToTop: () => void }>(null)
  const { toast } = useToast()

  const activeConversation = conversations.find(c => c.id === activeConversationId)

  // Load conversations on mount
  useEffect(() => {
    loadConversations()
  }, [])

  const loadConversations = async () => {
    try {
      setIsLoadingConversations(true)
      const fetchedConversations = await apiService.getConversations()
      
      console.log('Fetched conversations:', fetchedConversations)
      
      // Transform conversations to include messages array
      const transformedConversations = fetchedConversations.map(conv => {
        const transformedMessages = conv.messages?.map(transformMessage) || []
        console.log(`Conversation ${conv.id} messages:`, transformedMessages)
        return {
          ...conv,
          messages: transformedMessages,
          lastMessage: transformedMessages[transformedMessages.length - 1]?.content || ''
        }
      })
      
      setConversations(transformedConversations)
    } catch (error) {
      console.error('Failed to load conversations:', error)
      toast({
        title: "Failed to load conversations",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsLoadingConversations(false)
    }
  }

  // Mode changes are handled at the layout via context provider

  // Stream text effect for AI responses
  const streamText = (text: string, messageId: string, conversationId: string) => {
    const words = text.split(' ')
    let currentIndex = 0
    
    const streamInterval = setInterval(() => {
      if (currentIndex >= words.length) {
        clearInterval(streamInterval)
        setStreamingMessageId(null)
        setStreamingContent("")
        return
      }

      const wordsToAdd = Math.min(3, words.length - currentIndex)
      currentIndex += wordsToAdd
      const nextChunk = words.slice(0, currentIndex).join(' ')
      setStreamingContent(nextChunk)
      
      setConversations(prev => prev.map(conv => 
        conv.id === conversationId
          ? { 
              ...conv, 
              messages: conv.messages?.map(msg =>
                msg.id === messageId ? { ...msg, content: nextChunk } : msg
              ) || [],
              lastMessage: nextChunk
            }
          : conv
      ))
    }, 60)

    return () => clearInterval(streamInterval)
  }

  const handleSendMessage = async (content: string, file?: File) => {
    if (!content.trim() && !file) return

    try {
      let currentConversation = activeConversation
      let conversationId = activeConversationId

      // Create new conversation if none exists
      if (!currentConversation) {
        setIsLoading(true)
        const mode = selectedMode === 'chat' ? 'NORMAL' : 'AGENTIC'
        const title = content.length > 50 ? content.substring(0, 50) + "..." : content
        
        const newConv = await apiService.createConversation(mode, title)
        
        const transformedConv = {
          ...newConv,
          messages: [],
          lastMessage: content
        }
        
        setConversations(prev => [transformedConv, ...prev])
        setActiveConversationId(newConv.id)
        conversationId = newConv.id
        currentConversation = transformedConv
      }

      // Add user message to UI immediately
      const userMessage: Message = {
        id: `temp-${Date.now()}`,
        content,
        role: "user",
        attachments: file ? [file.name] : [],
        createdAt: new Date().toISOString()
      }

      setConversations(prev => prev.map(conv => 
        conv.id === conversationId
          ? { 
              ...conv, 
              messages: [...(conv.messages || []), userMessage],
              lastMessage: content
            }
          : conv
      ))

      setIsLoading(true)

      // Send message to backend
      const mode = selectedMode === 'chat' ? 'NORMAL' : 'AGENTIC'
      // Debug: log sendMessage parameters to diagnose HTTP 422 validation errors
      console.log('Calling apiService.sendMessage with:', { conversationId, content, mode, hasFile: !!file });
      const response = await apiService.sendMessage(
        conversationId!,
        content,
        mode,
        file
      )

      // After sending message, refetch the conversation to get the complete message history
      // including the assistant's response from the backend
      const updatedConversation = await apiService.getConversationMessages(conversationId!)
      
      setIsLoading(false)

      // Transform messages to frontend format
      const transformedMessages = updatedConversation.messages?.map(transformMessage) || []
      
      // Find the last assistant message (the response we just received)
      const lastAssistantMessage = transformedMessages.filter(m => m.role === 'assistant').pop()
      
      // Update conversation with all messages from backend
      setConversations(prev => prev.map(conv => 
        conv.id === conversationId!
          ? { 
              ...updatedConversation,
              messages: transformedMessages,
              lastMessage: lastAssistantMessage?.content || "",
              sessionId: response.conversation.sessionId,
              documentId: response.conversation.documentId
            }
          : conv
      ))

      // Start streaming effect for the assistant's response
      if (lastAssistantMessage) {
        setStreamingMessageId(lastAssistantMessage.id)
        streamText(lastAssistantMessage.content, lastAssistantMessage.id, conversationId!)
      }

    } catch (error) {
      console.error('Failed to send message:', error)
      setIsLoading(false)
      
      toast({
        title: "Failed to send message",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      })

      // Show fallback error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm having trouble processing your request right now. Please try again.",
        role: "assistant",
        createdAt: new Date().toISOString()
      }

      if (activeConversationId) {
        setConversations(prev => prev.map(conv => 
          conv.id === activeConversationId
            ? { 
                ...conv, 
                messages: [...(conv.messages || []), errorMessage]
              }
            : conv
        ))
      }
    }
  }

  const handleNewConversation = () => {
    setActiveConversationId(null)
  }

  const handleSelectConversation = async (id: string) => {
    try {
      // Always fetch full conversation with messages to ensure we have all user and assistant messages
      const fullConversation = await apiService.getConversationMessages(id)
      
      console.log('Full conversation loaded:', fullConversation)
      console.log('Messages received:', fullConversation.messages)
      
      // Transform messages to frontend format
      const transformedMessages = fullConversation.messages?.map(transformMessage) || []
      console.log('Transformed messages:', transformedMessages)
      
      setConversations(prev => prev.map(c => 
        c.id === id 
          ? {
              ...fullConversation,
              messages: transformedMessages,
              lastMessage: transformedMessages[transformedMessages.length - 1]?.content || ''
            }
          : c
      ))
      
      setActiveConversationId(id)
      setIsNewConversationSelected(true)
      setTimeout(() => setIsNewConversationSelected(false), 100)
    } catch (error) {
      console.error('Failed to load conversation:', error)
      toast({
        title: "Failed to load conversation",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      })
    }
  }

  const handleShareConversation = () => {
    if (!activeConversation) return

    // Call backend to enable sharing and get secure link
    (async () => {
      try {
        const result = await apiService.shareConversation(activeConversation.id, true)

        if (result.link) {
          try {
            await navigator.clipboard.writeText(result.link)
            toast({
              title: "Share link copied",
              description: "A secure shareable link has been created and copied to your clipboard.",
            })
          } catch (err) {
            // Copy failed, but sharing succeeded — show link in toast
            console.error('Failed to copy share link to clipboard:', err)
            toast({
              title: "Share link created",
              description: result.link,
            })
          }
        } else if (result.message) {
          toast({
            title: "Share status",
            description: result.message,
          })
        } else {
          toast({
            title: "Sharing updated",
            description: "Sharing status updated successfully.",
          })
        }
      } catch (error) {
        console.error('Failed to update sharing status:', error)
        toast({
          title: "Failed to share conversation",
          description: error instanceof Error ? error.message : "Please try again",
          variant: "destructive",
        })
      }
    })()
  }

  const handleDeleteConversation = () => {
    if (!activeConversation) return
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteConversation = async () => {
    if (!activeConversation) return
    
    try {
      await apiService.deleteConversation(activeConversation.id)
      
      setConversations(prev => prev.filter(conv => conv.id !== activeConversation.id))
      
      if (activeConversationId === activeConversation.id) {
        setActiveConversationId(null)
      }

      toast({
        title: "Conversation deleted",
        description: "The conversation has been deleted successfully.",
      })
    } catch (error) {
      console.error('Failed to delete conversation:', error)
      toast({
        title: "Failed to delete",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      })
    }
  }

  const handleTempChatClick = () => {
    // Handle temporary chat functionality
    console.log('Temporary chat clicked')
    handleNewConversation()
  }

  if (isLoadingConversations) {
    return (
      <div className="flex h-screen relative overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            background: "rgb(33, 33, 33)",
            backgroundSize: "30px 30px",
            backgroundPosition: "0 0",
          }}
        />
        <ChatSidebar
          user={user}
          conversations={[]}
          activeConversationId={undefined}
          onSelectConversation={() => {}}
          onNewConversation={() => {}}
          onLogout={onLogout}
        />
        <div className="flex-1 flex flex-col relative z-10 min-w-0 overflow-hidden">
          <div className="sticky top-0 z-20 bg-[rgb(33,33,33)]">
            <ChatModeSelector
              variant="default"
              onTempChatClick={handleTempChatClick}
              onShareClick={handleShareConversation}
              onDeleteClick={handleDeleteConversation}
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            <ConversationSkeleton />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen relative overflow-hidden chat-interface-container" style={{ maxWidth: '100vw' }}>
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "rgb(33, 33, 33)",
          backgroundSize: "30px 30px",
          backgroundPosition: "0 0",
        }}
      />
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
        onLogout={onLogout}
      />
      
      <div className="flex-1 flex flex-col relative z-10 min-w-0 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]" style={{ maxWidth: 'calc(100vw - 65px)' }}>
        <div className="sticky top-0 z-20 bg-[rgb(33,33,33)]">
          <ChatModeSelector
            variant={activeConversation ? 'chat-selected' : 'default'}
            onTempChatClick={handleTempChatClick}
            onShareClick={handleShareConversation}
            onDeleteClick={handleDeleteConversation}
          />
        </div>

        <ChatMessagesArea
          ref={messagesAreaRef}
          user={user}
          activeConversation={activeConversation ? {
            ...activeConversation,
            messages: activeConversation.messages || [],
            lastMessage: activeConversation.lastMessage || ""
          } : undefined}
          isLoading={isLoading}
          selectedMode={selectedMode}
          streamingMessageId={streamingMessageId}
          streamingContent={streamingContent}
          onSendMessage={handleSendMessage}
          isNewConversationSelected={isNewConversationSelected}
          onRegenerate={handleSendMessage}
        />
      </div>

      <DeleteConversationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDeleteConversation}
        conversationTitle={activeConversation?.title}
      />
    </div>
  )
}