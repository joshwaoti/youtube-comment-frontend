import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Reply } from '../../interfaces/video.interface';

@Component({
  selector: 'app-reply-thread',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule
  ],
  template: `
    <div class="space-y-4">
      @for (reply of replies; track reply.id) {
        <div class="border-l-2 border-gray-200 pl-4">
          <div class="flex justify-between items-start">
            <div>
              <h4 class="font-medium">{{ reply.author }}</h4>
              <p class="text-sm text-gray-500">
                {{ reply.published_at | date:'medium' }}
              </p>
            </div>
            <div class="flex items-center text-gray-600">
              <mat-icon class="text-sm">thumb_up</mat-icon>
              <span class="ml-1 text-sm">{{ reply.likes_count }}</span>
            </div>
          </div>
          <p class="mt-2 whitespace-pre-line">{{ reply.text }}</p>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ReplyThreadComponent {
  @Input({ required: true }) replies: Reply[] = [];
}
