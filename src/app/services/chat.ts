// src/app/services/chat.service.ts
import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private apiUrl = 'http://127.0.0.1:8000/api/ai/query'; // ✅ Backend URL

  async sendMessage(message: string, userId: number) {
    try {
      const response = await axios.post(this.apiUrl, {
        message: message,
        user_id: userId,
      });

       console.log('Response from backend:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
}
