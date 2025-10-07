// lib/api.service.ts
const NEXT_PUBLIC_API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:10000').replace(/\/api$/, '');

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

interface ShareConversationResponse {
  link?: string;
  message?: string;
}

interface Translation {
  id: string;
  userId: string;
  sourceText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  createdAt: string;
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
      // Prepare a small, safe representation of the body for debugging logs
      let requestBodyForLog: any = undefined;
      try {
        if (options.body instanceof FormData) {
          // List keys for FormData (do not log file contents)
          requestBodyForLog = Array.from((options.body as FormData).keys());
        } else if (typeof options.body === 'string') {
          // Try to JSON.parse for nicer display, otherwise keep as string (trimmed)
          try {
            requestBodyForLog = JSON.parse(options.body as string);
          } catch {
            requestBodyForLog = (options.body as string).slice(0, 1000);
          }
        }
      } catch (e) {
        requestBodyForLog = 'Unable to inspect body for log';
      }

      console.log('API Request:', { method: options.method || 'GET', url, headers, body: requestBodyForLog });
      
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        // Try to read raw text to preserve any validation details the server returns
        const responseText = await response.text().catch(() => '');
        let errorData: any = undefined;
        try {
          errorData = responseText ? JSON.parse(responseText) : undefined;
        } catch {
          // not JSON, keep raw text
        }

        const errorMessageFromBody = (errorData && (errorData.message || errorData.error)) || responseText || `HTTP error! status: ${response.status}`;

        console.error('API Error:', {
          url,
          status: response.status,
          headers,
          requestBody: requestBodyForLog,
          responseText: responseText.slice ? responseText.slice(0, 2000) : responseText,
          parsedError: errorData,
        });

        throw new Error(`HTTP ${response.status}: ${errorMessageFromBody}`);
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

  /**
   * Share or unshare a conversation. Returns a link when sharing is enabled.
   */
  async shareConversation(conversationId: string, share: boolean): Promise<ShareConversationResponse> {
    const response = await this.request<ApiResponse<ShareConversationResponse>>(
      `/api/chat/conversations/${conversationId}/share`,
      {
        method: 'POST',
        body: JSON.stringify({ share }),
      }
    );

    if (!response.success || !response.data) {
      throw new Error('Failed to update sharing status');
    }

    return response.data;
  }

  /**
   * Get a shared conversation by secure link (public endpoint)
   */
  async getSharedConversation(shareLink: string): Promise<{ userName: string; conversation: Conversation }> {
    const response = await this.request<ApiResponse<{ userName: string; conversation: Conversation }>>(
      `/api/chat/shared/${encodeURIComponent(shareLink)}`
    );

    if (!response.success || !response.data) {
      throw new Error('Failed to fetch shared conversation');
    }

    return response.data;
  }

  // ==================== Translation APIs ====================

  /**
   * Translate text
   */
  async translateText(params: {
    text: string;
    sourceLang: string;
    targetLang: string;
  }): Promise<ApiResponse<Translation>> {
    const response = await this.request<ApiResponse<Translation>>(
      '/api/translation/translate',
      {
        method: 'POST',
        body: JSON.stringify(params),
      }
    );

    return response;
  }

  /**
   * Detect language of text
   */
  async detectLanguage(text: string): Promise<ApiResponse<{ language: string; display_name: string }>> {
    const response = await this.request<ApiResponse<{ language: string; display_name: string }>>(
      '/api/translation/detect-language',
      {
        method: 'POST',
        body: JSON.stringify({ text }),
      }
    );

    return response;
  }

  /**
   * Get translation history
   */
  async getTranslationHistory(): Promise<ApiResponse<Translation[]>> {
    const response = await this.request<ApiResponse<Translation[]>>(
      '/api/translation/history'
    );

    return response;
  }
}

export const apiService = new ApiService();
export type { Conversation, Message, SendMessageResponse, Translation };