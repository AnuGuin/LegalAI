"use client";

import { forwardRef, useImperativeHandle, useRef, useEffect, useState } from "react";
import { TextShimmer } from "../ui/text-shimmer";
import AITextLoading from "../misc/ai-text-loading";
import AI_Input from "../misc/ai-chat";
import { Response as MarkdownResponse } from "../misc/response";
import { Actions, Action } from "../misc/actions";
import { Copy, ThumbsUp, ThumbsDown, RotateCcw, Paperclip } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Message, Conversation } from "@/types/chat.types";
import CookiePolicyDialog from '@/components/docs/terms/cookie-dialog';


interface ChatMessagesAreaProps {
  user: { name: string; email: string; avatar?: string };
  activeConversation: Conversation | undefined;
  isLoading: boolean;
  selectedMode: 'chat' | 'agentic';
  streamingMessageId: string | null;
  streamingContent: string;
  onSendMessage: (content: string, file?: File) => void;
  isNewConversationSelected: boolean;
  onRegenerate?: (content: string) => void;
  onFileUpload?: (file: File) => void;
}

interface ChatMessagesAreaRef {
  scrollToBottom: () => void;
  scrollToTop: () => void;
}

// ---------------- Individual Chat Message ----------------
function ChatMessage({ message, isStreaming, streamingContent, onRegenerate, messages }: {
  message: Message;
  userAvatar?: string;
  userName?: string;
  isStreaming?: boolean;
  streamingContent?: string;
  onRegenerate?: (content: string) => void;
  messages?: Message[];
}) {
  const isUser = message.role === "user";
  const displayContent = isStreaming ? streamingContent : message.content;
  const [isHovered, setIsHovered] = useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(displayContent || '');
    toast({
      variant: "default",
      title: "Copied to clipboard!",
      description: "Message content has been copied.",
    });
  };

  const handleLike = () => {
    toast({
      variant: "success",
      title: (
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M7 11v8a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-7a1 1 0 0 1 1 -1h3a4 4 0 0 0 4 -4v-1a2 2 0 0 1 4 0v5h3a2 2 0 0 1 2 2l-1 5a2 3 0 0 1 -2 2h-7a3 3 0 0 1 -3 -3" />
          </svg>
          <span>Liked</span>
        </div>
      ) as any,
      description: "Thanks for your feedback!",
    });
  };

  const handleDislike = () => {
    toast({
      variant: "destructive",
      title: (
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M7 13v-8a1 1 0 0 0 -1 -1h-2a1 1 0 0 0 -1 1v7a1 1 0 0 0 1 1h3a4 4 0 0 1 4 4v1a2 2 0 0 0 4 0v-5h3a2 2 0 0 0 2 -2l-1 -5a2 3 0 0 0 -2 -2h-7a3 3 0 0 0 -3 3" />
          </svg>
          <span>Disliked</span>
        </div>
      ) as any,
      description: "We'll work on improving our responses.",
    });
  };

  const handleRegenerate = () => {
    if (onRegenerate && messages) {
      // Find the user message that prompted this assistant message
      const currentIndex = messages.findIndex(m => m.id === message.id);
      if (currentIndex > 0) {
        for (let i = currentIndex - 1; i >= 0; i--) {
          if (messages[i].role === 'user') {
            onRegenerate(messages[i].content);
            break;
          }
        }
      }
    }
  };

  return (
    <div key={message.id} className="w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
      {isUser ? (
        // User message 
        <div className="flex justify-end">
          <div className="max-w-[70%] bg-blue-600 text-white rounded-2xl px-4 py-3 shadow-lg transform transition-all duration-200 hover:shadow-xl">
            {/* Show file attachments if any */}
            {message.attachments && message.attachments.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-2">
                {message.attachments.map((fileName, idx) => (
                  <div key={idx} className="flex items-center gap-1 bg-blue-700 px-2 py-1 rounded text-xs">
                    <Paperclip className="w-3 h-3" />
                    <span>{fileName}</span>
                  </div>
                ))}
              </div>
            )}
            <p className="whitespace-pre-wrap leading-relaxed text-sm">
              {message.content}
            </p>
          </div>
        </div>
      ) : (
        // Assistant message 
        <div className="w-full relative group">
          <div 
            className="text-neutral-100 rounded-2xl p-4 relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="text-sm leading-relaxed">
              <MarkdownResponse 
                className="prose prose-invert prose-sm max-w-none
                  prose-headings:text-neutral-100 prose-headings:font-semibold
                  prose-p:text-neutral-200 prose-p:leading-relaxed
                  prose-strong:text-neutral-100 prose-strong:font-semibold
                  prose-code:text-blue-300 prose-code:bg-neutral-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                  prose-pre:bg-neutral-900 prose-pre:border prose-pre:border-neutral-700
                  prose-blockquote:border-l-blue-500 prose-blockquote:text-neutral-300
                  prose-ul:text-neutral-200 prose-ol:text-neutral-200
                  prose-li:text-neutral-200
                  prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline"
              >
                {displayContent || ''}
              </MarkdownResponse>
              {isStreaming && (
                <div className="inline-block w-2 h-4 bg-blue-400 animate-pulse ml-1" />
              )}
            </div>
            
            {/* Actions */}
            <div className={`
              absolute bottom-2 right-2 transition-all duration-300 ease-out transform
              ${isHovered ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95 pointer-events-none'}
            `}>
              <div className="bg-neutral-800/90 backdrop-blur-sm border border-neutral-700/50 rounded-lg p-1 shadow-lg">
                <Actions>
                  <Action
                    tooltip="Copy message"
                    onClick={handleCopy}
                    className="hover:bg-neutral-700/50 text-neutral-400 hover:text-neutral-200"
                  >
                    <Copy className="w-4 h-4" />
                  </Action>
                  <Action
                    tooltip="Like response"
                    onClick={handleLike}
                    className="hover:bg-neutral-700/50 text-neutral-400 hover:text-green-400"
                  >
                    <ThumbsUp className="w-4 h-4" />
                  </Action>
                  <Action
                    tooltip="Dislike response"
                    onClick={handleDislike}
                    className="hover:bg-neutral-700/50 text-neutral-400 hover:text-red-400"
                  >
                    <ThumbsDown className="w-4 h-4" />
                  </Action>
                  <Action
                    tooltip="Regenerate response"
                    onClick={handleRegenerate}
                    className="hover:bg-neutral-700/50 text-neutral-400 hover:text-blue-400"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Action>
                </Actions>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------- Loading Message ----------------
function LoadingMessage() {
  return (
    <div className="flex gap-3 p-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-50/20 via-transparent to-blue-100/20 dark:from-blue-950/20 dark:via-transparent dark:to-blue-900/20 border border-blue-200/30 dark:border-blue-800/30 flex items-center justify-center">
        <div className="w-4 h-4 bg-blue-400 rounded-full animate-pulse" />
      </div>
      <div className="flex-1 flex justify-start items-center">
        <div className="w-auto">
          <AITextLoading 
            texts={[
              "Analyzing legal context...",
              "Processing your query...",
              "Researching relevant laws...",
              "Formulating response...",
            ]}
            className="!text-sm !font-mono !font-normal !text-neutral-300 !justify-start !text-left"
            interval={1000}
          />
        </div>
      </div>
    </div>
  );
}

// ---------------- Streaming Message ----------------
function StreamingMessage({ streamingContent, onRegenerate }: { 
  streamingContent: string; 
  onRegenerate?: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(streamingContent || '');
    toast({
      variant: "default",
      title: "Copied to clipboard!",
      description: "Message content has been copied.",
    });
  };

  const handleLike = () => {
    toast({
      variant: "success",
      title: (
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M7 11v8a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-7a1 1 0 0 1 1 -1h3a4 4 0 0 0 4 -4v-1a2 2 0 0 1 4 0v5h3a2 2 0 0 1 2 2l-1 5a2 3 0 0 1 -2 2h-7a3 3 0 0 1 -3 -3" />
          </svg>
          <span>Liked</span>
        </div>
      ) as any,
      description: "Thanks for your feedback!",
    });
  };

  const handleDislike = () => {
    toast({
      variant: "destructive",
      title: (
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M7 13v-8a1 1 0 0 0 -1 -1h-2a1 1 0 0 0 -1 1v7a1 1 0 0 0 1 1h3a4 4 0 0 1 4 4v1a2 2 0 0 0 4 0v-5h3a2 2 0 0 0 2 -2l-1 -5a2 3 0 0 0 -2 -2h-7a3 3 0 0 0 -3 3" />
          </svg>
          <span>Disliked</span>
        </div>
      ) as any,
      description: "We'll work on improving our responses.",
    });
  };

  const handleRegenerate = () => {
    if (onRegenerate) {
      onRegenerate();
    }
  };

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="w-full relative group">
        <div 
          className="text-neutral-100 rounded-2xl p-4 relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="text-sm leading-relaxed">
            <MarkdownResponse 
              className="prose prose-invert prose-sm max-w-none
                prose-headings:text-neutral-100 prose-headings:font-semibold
                prose-p:text-neutral-200 prose-p:leading-relaxed
                prose-strong:text-neutral-100 prose-strong:font-semibold
                prose-code:text-blue-300 prose-code:bg-neutral-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                prose-pre:bg-neutral-900 prose-pre:border prose-pre:border-neutral-700
                prose-blockquote:border-l-blue-500 prose-blockquote:text-neutral-300
                prose-ul:text-neutral-200 prose-ol:text-neutral-200
                prose-li:text-neutral-200
                prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline"
            >
              {streamingContent}
            </MarkdownResponse>
            <div className="inline-block w-2 h-4 bg-blue-400 animate-pulse ml-1" />
          </div>
          
          {/* Actions */}
          <div className={`
            absolute bottom-2 right-2 transition-all duration-300 ease-out transform
            ${isHovered ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95 pointer-events-none'}
          `}>
            <div className="bg-neutral-800/90 backdrop-blur-sm border border-neutral-700/50 rounded-lg p-1 shadow-lg">
              <Actions>
                <Action
                  tooltip="Copy message"
                  onClick={handleCopy}
                  className="hover:bg-neutral-700/50 text-neutral-400 hover:text-neutral-200"
                >
                  <Copy className="w-4 h-4" />
                </Action>
                <Action
                  tooltip="Like response"
                  onClick={handleLike}
                  className="hover:bg-neutral-700/50 text-neutral-400 hover:text-green-400"
                >
                  <ThumbsUp className="w-4 h-4" />
                </Action>
                <Action
                  tooltip="Dislike response"
                  onClick={handleDislike}
                  className="hover:bg-neutral-700/50 text-neutral-400 hover:text-red-400"
                >
                  <ThumbsDown className="w-4 h-4" />
                </Action>
                <Action
                  tooltip="Regenerate response"
                  onClick={handleRegenerate}
                  className="hover:bg-neutral-700/50 text-neutral-400 hover:text-blue-400"
                >
                  <RotateCcw className="w-4 h-4" />
                </Action>
              </Actions>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------- Welcome Input ----------------
function WelcomeScreen({ user, onSendMessage, selectedMode }: {
  user: { name: string; email: string; avatar?: string };
  onSendMessage: (content: string, file?: File) => void;
  selectedMode: 'chat' | 'agentic';
}) {
  return (
    <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex items-center justify-center p-6" style={{ top: 'calc(50% - 30px)' }}>
      <div className="text-center max-w-2xl w-full">
        <div className="mb-4">
          <h1 className="text-4xl font-semibold mb-4 text-blue-400">
            Hello {user.name.split(' ')[0]}
          </h1>
          <div>
            <TextShimmer className='font-medium text-sm' duration={4}>
              How can I assist you with your legal questions?
            </TextShimmer>
          </div>
        </div>
        <div className="w-full">
          <AI_Input 
            onSendMessage={onSendMessage} 
            mode={selectedMode}
            showModeIndicator={true}
          />
        </div>
      </div>
    </div>
  );
}

// ---------------- Main Chat Area ----------------
export const ChatMessagesArea = forwardRef<ChatMessagesAreaRef, ChatMessagesAreaProps>(
  ({ 
    user,
    activeConversation, 
    isLoading, 
    selectedMode,
    streamingMessageId,
    streamingContent, 
    onSendMessage,
    isNewConversationSelected,
    onRegenerate
  }, ref) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isCookieOpen, setIsCookieOpen] = useState(false);

    const handleRegenerateMessage = (content: string) => {
      if (onRegenerate) {
        onRegenerate(content);
      }
    };

    const handleRegenerateStreaming = () => {
      const msgs = activeConversation?.messages;
      if (!msgs || msgs.length === 0) return;

      for (let i = msgs.length - 1; i >= 0; i--) {
        if (msgs[i].role === 'user') {
          onSendMessage(msgs[i].content);
          break;
        }
      }
    };

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const scrollToTop = () => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
    };

    useImperativeHandle(ref, () => ({
      scrollToBottom,
      scrollToTop
    }));

    useEffect(() => {
      if (isNewConversationSelected) {
        scrollToTop();
      } else {
        scrollToBottom();
      }
    }, [activeConversation?.messages, isNewConversationSelected]);

  const hasMessages = !!activeConversation && (activeConversation.messages?.length ?? 0) > 0;

    return (
      <>
        {/* Messages Area */}
        <div 
          ref={scrollContainerRef} 
          className={`flex-1 metallic-scrollbar relative transition-all duration-200 ${
            hasMessages ? 'overflow-y-auto' : 'overflow-hidden'
          }`}
        >
          {hasMessages ? (
            <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
              {activeConversation!.messages!.map((message) => (
                <ChatMessage 
                  key={message.id}
                  message={message}
                  userAvatar={user.avatar}
                  userName={user.name}
                  isStreaming={streamingMessageId === message.id}
                  streamingContent={streamingMessageId === message.id ? streamingContent : undefined}
                  onRegenerate={message.role === 'assistant' ? handleRegenerateMessage : undefined}
                  messages={activeConversation!.messages!}
                />
              ))}
              {streamingMessageId && !activeConversation!.messages!.find(m => m.id === streamingMessageId) && (
                <StreamingMessage 
                  streamingContent={streamingContent}
                  onRegenerate={handleRegenerateStreaming}
                />
              )}
              {isLoading && !streamingMessageId && <LoadingMessage />}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <WelcomeScreen 
              user={user}
              onSendMessage={onSendMessage}
              selectedMode={selectedMode}
            />
          )}
        </div>

        {/* Input Area - Only show when there's an active conversation */}
        {hasMessages && (
          <div className="pt-1 pb-4">
            <div className="max-w-6xl mx-auto">
              <AI_Input 
                onSendMessage={onSendMessage} 
                mode={selectedMode}
                showModeIndicator={false}
              />
            </div>
            <div className="flex items-center justify-center font-light text-xs gap-1">
              <p>
                LegalAI can make mistakes. For more information refer to 
              </p>
              <a href="#cookies" onClick={(e) => { e.preventDefault(); setIsCookieOpen(true); }}
                className="text-white/70 hover:text-white transition-colors"
              > Cookie Policies 
              </a>
            </div>
            <CookiePolicyDialog open={isCookieOpen} onOpenChange={setIsCookieOpen} />
          </div>
        )}
      </>
    );
  }
);

ChatMessagesArea.displayName = "ChatMessagesArea";

export { ChatMessage };