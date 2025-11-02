import { Injectable } from '@angular/core';
import axios from 'axios';

// const API_BASE = 'http://127.0.0.1:8000/api';
@Injectable({ providedIn: 'root' })
export class Api {
  private BASE_URL = 'http://127.0.0.1:8000/api/ai/query'; // ✅ Backend URL

  constructor() {}

  // 🔹 Streaming version (Server-Sent Events)
  async queryAIStream(message: string, userId: number, onChunk: (text: string) => void) {
    const response = await fetch(this.BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, user_id: userId })
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error('Stream not supported.');
    }

    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split('\n\n');

      for (const part of parts) {
        if (part.startsWith('data: ')) {
          const chunk = part.replace('data: ', '').trim();
          if (chunk === '[DONE]') return;
          if (chunk && !chunk.startsWith('[ERROR]')) {
            onChunk(chunk);
          }
        }
      }
      buffer = '';
    }
  }
}