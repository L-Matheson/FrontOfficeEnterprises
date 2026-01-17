/**
 * ChatHandler - Centralized API handler for all chat operations
 * Manages communication with the backend chat API
 * 
 * Message Types
 *  - Normal: Standard user message
 *  - Modular: Message that renders as modules
 *      - Can be clickable or not clickable
 *
 */
class ChatHandler {
  constructor(baseUrl = 'http://localhost:5000/api') {
    this.baseUrl = baseUrl;
  }

  /**
   * Send a message to a specific AI
   * @param {string} aiId - The AI identifier
   * @param {string} message - The message content
   * @returns {Promise<object>} Response data with status and response text
   */
  async sendMessage(aiId, message) {
    try {
      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ai_id: aiId,
          message: message,
        })
      });

      const data = await response.json();

      if (data.status === 'success') {
        return {
          success: true,
          response: data.response,
          aiId: data.ai_id,
          messageType: data.message_type,
          mosPlan: data.mos_plan,
          assignments: data.assignments,
          nonSyllabusText: data.non_syllabus_text
        };
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      return {
        success: false,
        error: error.message,
        errorDetails: `❌ Error: ${error.message}\n\nMake sure:\n1. Backend server is running (python app.py)\n2. Server is on http://localhost:5000\n3. All Python dependencies are installed`
      };
    }
  }

  /**
   * Get token count for a specific AI's chat history
   * @param {string} aiId - The AI identifier
   * @returns {Promise<number>} The token count
   */
  async getTokenCount(aiId) {
    try {
      const response = await fetch(`${this.baseUrl}/token-count/${aiId}`);
      const data = await response.json();
      return data.token_count || 0;
    } catch (error) {
      console.error('Error fetching token count:', error);
      return 0;
    }
  }

  /**
   * Reset the chat session for a specific AI
   * @param {string} aiId - The AI identifier
   * @returns {Promise<boolean>} Success status
   */
  async resetChat(aiId) {
    try {
      const response = await fetch(`${this.baseUrl}/reset-chat/${aiId}`, {
        method: 'POST'
      });
      
      const data = await response.json();
      return data.status === 'success';
    } catch (error) {
      console.error('Error resetting chat:', error);
      return false;
    }
  }

  /**
   * List all available AI assistants
   * @returns {Promise<Array>} List of AI objects with id, name, and description
   */
  async listAIs() {
    try {
      const response = await fetch(`${this.baseUrl}/list-ais`);
      const data = await response.json();
      return data.ais || [];
    } catch (error) {
      console.error('Error listing AIs:', error);
      return [];
    }
  }
}

export default ChatHandler;
