import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { YoutubeService } from '../../services/youtube.service';
import { Video, PaginationControls } from '../../interfaces/video.interface';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
  ],
  template: `
    <div
      class="h-full bg-gray-900/50 backdrop-blur-lg border-r border-cyan-500/10 p-4 w-full flex flex-col"
    >
      <h2
        class="text-lg font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400"
      >
        Recent Videos
      </h2>

      @if (recentVideos.length) {
      <div class="space-y-2 flex-grow overflow-y-auto">
        @for (video of recentVideos; track video.id) {
        <a
          [routerLink]="['/comments', video.video_id]"
          class="block p-3 rounded-lg hover:bg-cyan-500/10 transition-all cursor-pointer group"
          [class.active]="video.video_id === activeVideoId"
          (click)="onVideoSelect(video.video_id)"
        >
          <div class="flex items-center gap-3">
            <mat-icon
              [class]="
                video.video_id === activeVideoId
                  ? 'text-purple-400'
                  : 'text-cyan-400 group-hover:text-purple-400'
              "
            >
              {{
                video.video_id === activeVideoId
                  ? 'play_circle_filled'
                  : 'play_circle'
              }}
            </mat-icon>
            <div class="flex-grow">
              <h3
                class="text-sm font-medium"
                [class]="
                  video.video_id === activeVideoId
                    ? 'text-purple-400'
                    : 'text-gray-200 group-hover:text-cyan-400'
                "
              >
                {{ video.title }}
              </h3>
              <p class="text-xs text-gray-400 mt-1">
                {{ formatDate(video.fetch_date) }}
              </p>
            </div>
          </div>
        </a>
        }
      </div>

      <!-- Pagination Controls -->
      @if (pagination.totalPages > 1) {
      <div
        class="flex justify-center items-center gap-2 mt-4 pt-4 border-t border-cyan-500/10"
      >
        <button
          mat-icon-button
          [disabled]="!pagination.hasPrevious"
          (click)="changePage(pagination.currentPage - 1)"
          class="text-cyan-400 hover:text-purple-400 disabled:text-gray-600 scale-75"
        >
          <mat-icon>chevron_left</mat-icon>
        </button>

        <span class="text-sm text-gray-400">
          {{ pagination.currentPage }} / {{ pagination.totalPages }}
        </span>

        <button
          mat-icon-button
          [disabled]="!pagination.hasNext"
          (click)="changePage(pagination.currentPage + 1)"
          class="text-cyan-400 hover:text-purple-400 disabled:text-gray-600 scale-75"
        >
          <mat-icon>chevron_right</mat-icon>
        </button>
      </div>
      } } @else {
      <p class="text-gray-400 text-sm">No videos yet</p>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
      }

      .active {
        background: rgb(6 182 212 / 0.1);
        border-left: 2px solid rgb(6 182 212);
      }

      ::-webkit-scrollbar {
        width: 6px;
      }

      ::-webkit-scrollbar-track {
        background: transparent;
      }

      ::-webkit-scrollbar-thumb {
        background: rgb(6 182 212 / 0.3);
        border-radius: 3px;
      }

      ::-webkit-scrollbar-thumb:hover {
        background: rgb(6 182 212 / 0.5);
      }
    `,
  ],
})
export class SidebarComponent implements OnInit {
  recentVideos: Video[] = [];
  activeVideoId: string | null = null;

  pagination: PaginationControls = {
    currentPage: 1,
    totalPages: 1,
    hasNext: false,
    hasPrevious: false,
  };

  constructor(
    private youtubeService: YoutubeService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadRecentVideos(1);

    this.router.events.subscribe(() => {
      const urlSegments = this.router.url.split('/');
      if (urlSegments.includes('comments')) {
        this.activeVideoId = urlSegments[urlSegments.length - 1];
      } else {
        this.activeVideoId = null;
      }
    });
  }

  loadRecentVideos(page: number) {
    this.youtubeService.getRecentVideos(page).subscribe({
      next: (response) => {
        this.recentVideos = response.results;
        this.pagination = {
          currentPage: page,
          totalPages: Math.ceil(response.count / 10), // Assuming 10 items per page
          hasNext: !!response.next,
          hasPrevious: !!response.previous,
        };
      },
      error: (error) => {
        console.error('Error loading recent videos:', error);
      },
    });
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.pagination.totalPages) {
      this.loadRecentVideos(page);
    }
  }

  onVideoSelect(videoId: string) {
    this.activeVideoId = videoId;
  }

  formatDate(date: string): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
