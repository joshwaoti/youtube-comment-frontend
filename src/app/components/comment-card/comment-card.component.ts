import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReplyThreadComponent } from '../reply-thread/reply-thread.component';
import { Comment } from '../../interfaces/video.interface';

@Component({
  selector: 'app-comment-card',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, ReplyThreadComponent],
  template: `
    <div class="neon-card">
      <div class="flex items-start gap-4">
        <div class="flex-shrink-0">
          <div class="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center justify-center text-lg font-bold">
            {{ comment.author[0] }}
          </div>
        </div>
        
        <div class="flex-grow">
          <div class="flex items-center gap-2">
            <h3 class="font-medium">{{ comment.author }}</h3>
            <span class="text-sm text-gray-400">{{ formatDate(comment.published_at) }}</span>
          </div>
          <p class="text-gray-200 mb-3" [innerHTML]="comment.text"></p>
          <div class="flex items-center gap-4 text-sm text-gray-400">
            <div class="flex items-center gap-1">
              <mat-icon class="text-cyan-400 text-base">thumb_up</mat-icon>
              <span>{{ comment.likes_count }}</span>
            </div>
            @if (comment.reply_count > 0) {
              <button 
                mat-button 
                class="flex items-center gap-1 text-purple-400"
                (click)="toggleReplies()">
                <mat-icon class="text-base">{{ showReplies ? 'expand_less' : 'expand_more' }}</mat-icon>
                {{ comment.reply_count }} {{ comment.reply_count === 1 ? 'reply' : 'replies' }}
              </button>
            }
          </div>

          @if (showReplies && comment.replies.length) {
            <div class="mt-4 pl-4 border-l-2 border-purple-500/30">
              @for (reply of comment.replies; track reply.id) {
                <div class="mb-4">
                  <div class="flex items-start gap-2">
                    <div class="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-cyan-500 flex items-center justify-center text-sm font-bold">
                      {{ reply.author[0] }}
                    </div>
                    <div>
                      <div class="flex items-center gap-2">
                        <span class="font-bold text-purple-400">{{ reply.author }}</span>
                        <span class="text-sm text-gray-400">{{ formatDate(reply.published_at) }}</span>
                      </div>
                      <p class="text-gray-300 text-sm mt-1" [innerHTML]="reply.text"></p>
                      <div class="flex items-center gap-2 mt-1 text-sm text-gray-400">
                        <mat-icon class="text-purple-400 text-base">thumb_up</mat-icon>
                        <span>{{ reply.likes_count }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    
    .mat-icon {
      height: 18px;
      width: 18px;
      font-size: 18px;
    }
  `]
})
export class CommentCardComponent {
  @Input() comment!: Comment;
  showReplies = false;

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  toggleReplies() {
    this.showReplies = !this.showReplies;
  }
}
