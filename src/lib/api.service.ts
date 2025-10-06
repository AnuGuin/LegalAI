// lib/api.service.ts
const NEXT_PUBLIC_API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/api$/, '');

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

interface Message {
  id: string;
  content: string;
  role: "USER" | "ASSISTANT" | "SYSTEM";
  createdAt: string;
  attachments?: string[];
  metadata?: any;
}

interface Conversation {
  id: string;
  userId: string;
  title: string;
  mode: "NORMAL" | "AGENTIC";
  documentId?: string;
  documentName?: string;
  sessionId?: string;
  createdAt: string;
  updatedAt: string;
  messages?: Message[];
}

interface SendMessageResponse {
  message: Message;
  conversation: {
    id: string;
    sessionId?: string;
    documentId?: string;
  };
}

class ApiService {
  private getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getAuthToken();
    
    const headers: Record<string, string> = {
      ...options.headers as Record<string, string>,
    };

    // Only add Content-Type for non-FormData requests
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const url = `${NEXT_PUBLIC_API_URL}${endpoint}`;
      console.log('API Request:', { method: options.method || 'GET', url });
      
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: response.status === 404 ? 'Route not found' : 'An error occurred',
        }));
        
        const errorMessage = errorData.message || `HTTP error! status: ${response.status}`;
        console.error('API Error:', { 
          url, 
          status: response.status, 
          message: errorMessage 
        });
        
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // ==================== Conversation APIs ====================

  /**
   * Create a new conversation
   */
  async createConversation(
    mode: 'NORMAL' | 'AGENTIC',
    title?: string,
    documentId?: string,
    documentName?: string,
    sessionId?: string
  ): Promise<Conversation> {
    const response = await this.request<ApiResponse<Conversation>>(
      '/api/chat/conversations',
      {
        method: 'POST',
        body: JSON.stringify({
          mode,
          title,
          documentId,
          documentName,
          sessionId,
        }),
      }
    );

    if (!response.success || !response.data) {
      throw new Error('Failed to create conversation');
    }

    return response.data;
  }

  /**
   * Get all conversations for the user
   */
  async getConversations(): Promise<Conversation[]> {
    const response = await this.request<ApiResponse<Conversation[]>>(
      '/api/chat/conversations'
    );

    if (!response.success || !response.data) {
      throw new Error('Failed to fetch conversations');
    }

    console.log('API getConversations response:', response.data);
    response.data.forEach((conv, index) => {
      console.log(`Conversation ${index} (${conv.id}) has ${conv.messages?.length || 0} messages:`, conv.messages);
    });

    return response.data;
  }

  /**
   * Get a specific conversation with all messages
   */
  async getConversationMessages(conversationId: string): Promise<Conversation> {
    const response = await this.request<ApiResponse<Conversation>>(
      `/api/chat/conversations/${conversationId}`
    );

    if (!response.success || !response.data) {
      throw new Error('Failed to fetch conversation messages');
    }

    console.log('API getConversationMessages response:', response.data);
    console.log('Messages from backend:', response.data.messages);

    return response.data;
  }

  /**
   * Get conversation info (without messages)
   */
  async getConversationInfo(conversationId: string): Promise<Conversation> {
    const response = await this.request<ApiResponse<Conversation>>(
      `/api/chat/conversations/${conversationId}/info`
    );

    if (!response.success || !response.data) {
      throw new Error('Failed to fetch conversation info');
    }

    return response.data;
  }

  /**
   * Send a message in a conversation
   */
  async sendMessage(
    conversationId: string,
    message: string,
    mode: 'NORMAL' | 'AGENTIC',
    file?: File
  ): Promise<SendMessageResponse> {
    let body: FormData | string;
    let headers: HeadersInit = {};

    if (file) {
      // Use FormData for file uploads
      const formData = new FormData();
      formData.append('message', message);
      formData.append('mode', mode);
      formData.append('file', file);
      body = formData;
      // Don't set Content-Type, let browser set it with boundary
    } else {
      // Use JSON for text-only messages
      body = JSON.stringify({ message, mode });
      headers['Content-Type'] = 'application/json';
    }

    const response = await this.request<ApiResponse<SendMessageResponse>>(
      `/api/chat/conversations/${conversationId}/messages`,
      {
        method: 'POST',
        headers,
        body,
      }
    );

    if (!response.success || !response.data) {
      throw new Error('Failed to send message');
    }

    return response.data;
  }

  /**
   * Delete a conversation
   */
  async deleteConversation(conversationId: string): Promise<void> {
    const response = await this.request<ApiResponse<void>>(
      `/api/chat/conversations/${conversationId}`,
      {
        method: 'DELETE',
      }
    );

    if (!response.success) {
      throw new Error('Failed to delete conversation');
    }
  }

  /**
   * Delete all conversations
   */
  async deleteAllConversations(): Promise<{ deletedCount: number }> {
    const response = await this.request<ApiResponse<{ deletedCount: number }>>(
      '/api/chat/conversations',
      {
        method: 'DELETE',
      }
    );

    if (!response.success || !response.data) {
      throw new Error('Failed to delete conversations');
    }

    return response.data;
  }
}

export const apiService = new ApiService();
export type { Conversation, Message, SendMessageResponse };