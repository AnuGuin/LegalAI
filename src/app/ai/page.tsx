"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextShimmer } from "@/components/ui/text-shimmer";
import AI_Input from "@/components/misc/ai-chat";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/lib/api.service";

export default function AIWelcomePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedMode, setSelectedMode] = useState<'chat' | 'agentic'>('chat');
  const [isCreating, setIsCreating] = useState(false);

  // Get user from localStorage
  const userStr = typeof window !== 'undefined' ? localStorage.getItem("user") : null;
  const user = userStr ? JSON.parse(userStr) : { name: "Guest" };

  const handleSendMessage = async (content: string, file?: File) => {
    if (!content.trim() && !file) return;
    if (isCreating) return;

    try {
      setIsCreating(true);
      
      // Create conversation
      const mode = selectedMode === 'chat' ? 'NORMAL' : 'AGENTIC';
      const title = content.length > 50 ? content.substring(0, 50) + "..." : content;
      
      console.log('Creating new conversation with mode:', mode, 'title:', title);
      const newConversation = await apiService.createConversation(mode, title);
      
      console.log('Conversation created:', newConversation.id);
      
      // Send the first message
      await apiService.sendMessage(newConversation.id, content, mode, file);
      
      // Navigate to the new conversation
      router.push(`/ai/${newConversation.id}`);
      
    } catch (error) {
      console.error('Failed to create conversation:', error);
      setIsCreating(false);
      
      toast({
        title: "Failed to start conversation",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6 overflow-hidden">
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
            onSendMessage={handleSendMessage} 
            mode={selectedMode}
            showModeIndicator={true}
            disabled={isCreating}
          />
        </div>
      </div>
    </div>
  );
}