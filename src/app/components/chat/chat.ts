import { Component, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Api } from '../../services/api'; // custom API service

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrls: ['./chat.scss']
})
export class Chat {
  // --------------------------
  // 🔹 Variables
  // --------------------------
  userInput: string = '';       // Stores user's input text
  messages: any[] = [];         // Stores chat messages (both user + AI)
  userId: number = 1;           // Example user ID (can be dynamic later)
  isLoading: boolean = false;   // For showing a loading indicator

  @ViewChild('chatBox') chatBox!: ElementRef;

  constructor(private api: Api) {}

    ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom() {
    try {
      this.chatBox.nativeElement.scrollTop = this.chatBox.nativeElement.scrollHeight;
    } catch {}
  }

  // --------------------------
  // 🔹 Send message to backend
  // --------------------------
 async sendMessage() {
  const message = this.userInput.trim();
  if (!message) return;

  // Add user message to chat
  this.messages.push({ sender: 'user', text: message });
  this.userInput = '';

  // Add placeholder AI message
  const aiMessage = { sender: 'ai', text: '' };
  this.messages.push(aiMessage);

  try {
    // ✅ Use streaming API call
    await this.api.queryAIStream(message, this.userId, (chunk) => {
      // Append text chunk as it arrives
      aiMessage.text += chunk;

      // Force UI refresh (Angular may not detect small updates automatically)
      this.messages = [...this.messages];
    });
  } catch (err) {
    console.error('Streaming error:', err);
    aiMessage.text = '⚠️ Error receiving AI response.';
  }
}

}
