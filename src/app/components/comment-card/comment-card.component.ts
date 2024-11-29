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
      <div class="flex items-start gap-2 sm:gap-4">
        <div class="flex-shrink-0">
          <div class="avatar-circle">
            {{ comment.author[0] }}
          </div>
        </div>

        <div class="flex-grow min-w-0">
          <div class="flex items-center gap-1 sm:gap-2 flex-wrap">
            <h3
              class="font-medium text-sm sm:text-base truncate max-w-[150px] sm:max-w-none"
            >
              {{ comment.author }}
            </h3>
            <span class="hidden sm:inline text-sm text-gray-400">
              {{ formatDate(comment.published_at) }}
            </span>
          </div>

          <p
            class="text-gray-200 mb-2 sm:mb-3 text-sm sm:text-base line-clamp-3 sm:line-clamp-none"
            [innerHTML]="comment.text"
          ></p>

          <div class="flex items-center gap-2 sm:gap-4 mt-2 sm:mt-3">
            <div class="flex items-center gap-1 text-gray-400">
              <mat-icon class="!text-cyan-400 icon-small">thumb_up</mat-icon>
              <span class="text-xs sm:text-sm">{{ comment.likes_count }}</span>
            </div>

            @if (comment.reply_count > 0) {
            <button
              mat-button
              class="reply-button"
              (click)="showReplies = !showReplies"
            >
              <mat-icon class="icon-small">
                {{ showReplies ? 'expand_less' : 'expand_more' }}
              </mat-icon>
              <span class="text-xs sm:text-sm">
                {{ showReplies ? 'Hide' : 'Show' }}
                {{ comment.reply_count }}
                {{ comment.reply_count === 1 ? 'reply' : 'replies' }}
              </span>
            </button>
            }
          </div>

          @if (showReplies && comment.replies.length) {
          <div
            class="mt-3 sm:mt-4 pl-2 sm:pl-4 border-l border-l-purple-500/30 sm:border-l-2"
          >
            @for (reply of comment.replies; track reply.id) {
            <div class="mb-3 sm:mb-4">
              <div class="flex items-start gap-1.5 sm:gap-2">
                <div class="reply-avatar">
                  {{ reply.author[0] }}
                </div>
                <div class="min-w-0">
                  <div class="flex items-center gap-1 sm:gap-2 flex-wrap">
                    <span
                      class="font-bold text-purple-400 text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none"
                    >
                      {{ reply.author }}
                    </span>
                    <span class="hidden sm:inline text-xs text-gray-400">
                      {{ formatDate(reply.published_at) }}
                    </span>
                  </div>
                  <p
                    class="text-gray-300 text-xs sm:text-sm mt-0.5 sm:mt-1 line-clamp-2 sm:line-clamp-none"
                    [innerHTML]="reply.text"
                  ></p>
                  <div
                    class="flex items-center gap-1 mt-1 text-xs sm:text-sm text-gray-400"
                  >
                    <mat-icon class="text-purple-400 icon-small"
                      >thumb_up</mat-icon
                    >
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
  styles: [
    `
    :host {
      display: block;
    }

    .avatar-circle {
      @apply w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 
             flex items-center justify-center font-bold text-sm sm:text-lg;
    }

    .reply-avatar {
      @apply w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-purple-400 to-cyan-500 
             flex items-center justify-center font-bold text-xs sm:text-sm;
    }

    .reply-button {
      @apply text-cyan-400 hover:text-purple-400 flex items-center gap-1 text-xs sm:text-sm;
    }

    .icon-small {
      @apply text-base sm:text-lg !w-4 !h-4 sm:!w-[18px] sm:!h-[18px];
    }

    ::ng-deep {
      .mat-mdc-button {
        --mdc-text-button-label-text-color: rgb(34, 211, 238);
        min-width: 0;
        padding: 0 4px;

        @media (min-width: 640px) {
          padding: 0 8px;
        }
      }

      .mat-icon {
        font-family: 'Material Icons';
        line-height: 1;
        vertical-align: middle;
      }
    }
  `,
  ],
})
export class CommentCardComponent {
  @Input() comment!: Comment;
  showReplies = false;

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}
