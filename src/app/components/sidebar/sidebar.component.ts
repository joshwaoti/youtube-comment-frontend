import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { YoutubeService } from '../../services/youtube.service';
import { Video, PaginationControls } from '../../interfaces/video.interface';
import { BehaviorSubject } from 'rxjs';
import { SidebarService } from '../../services/sidebar.service';

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
    <div class="h-full flex items-center justify-center p-4">
      <div 
        class="max-h-[70vh] w-full bg-gray-900/50 backdrop-blur-lg border border-cyan-500/10 rounded-xl shadow-xl 
               hover:shadow-cyan-500/20 transition-all duration-300 flex flex-col bounce-scroll"
      >
        @if (isLoading) {
          <div class="absolute top-0 left-0 w-full h-1 overflow-hidden">
            <div class="loading-bar"></div>
          </div>
        }

        <h2
          class="text-lg font-bold p-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 
                 border-b border-cyan-500/10 flex items-center justify-between"
        >
          Recent Videos
          @if (isLoading) {
            <span class="text-sm font-normal text-cyan-400 animate-pulse">Adding new video...</span>
          }
        </h2>

        @if (recentVideos.length) {
        <div class="space-y-2 flex-grow overflow-y-auto p-4 scroll-smooth">
          @for (video of recentVideos; track video.id) {
          <a
            [routerLink]="['/comments', video.video_id]"
            class="block p-3 rounded-lg hover:bg-cyan-500/10 transition-all cursor-pointer group"
            [class.active]="video.video_id === activeVideoId"
            (click)="onVideoSelect(video.video_id)"
          >
            <div class="flex items-center mx-auto gap-3">
              <mat-icon
                [class]="
                  video.video_id === activeVideoId
                    ? 'text-purple-400'
                    : 'text-cyan-400 group-hover:text-purple-400'
                "
                class="flex-shrink-0 ml-2"
              >
                {{
                  video.video_id === activeVideoId
                    ? 'play_circle_filled'
                    : 'play_circle'
                }}
              </mat-icon>
              <div class="flex-grow ml-3">
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

        @if (pagination.totalPages > 1) {
        <div
          class="flex justify-center items-center gap-2 p-4 border-t border-cyan-500/10"
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
        <p class="text-gray-400 text-sm p-4">No videos yet</p>
        }
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }

    .active {
      background: rgb(6 182 212 / 0.1);
      border-left: 2px solid rgb(6 182 212);
    }

    .bounce-scroll {
      scroll-behavior: smooth;
      overflow-y: auto;
      box-shadow: 0 0 20px rgba(6, 182, 212, 0.1);
      animation: float 6s ease-in-out infinite;
    }

    @keyframes float {
      0% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-10px);
      }
      100% {
        transform: translateY(0px);
      }
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

    .bounce-scroll:hover {
      animation-play-state: paused;
    }

    .loading-bar {
      position: absolute;
      width: 100%;
      height: 2px;
      background: linear-gradient(
        90deg,
        transparent,
        rgb(6, 182, 212),
        rgb(147, 51, 234),
        transparent
      );
      animation: loading 1.5s infinite;
    }

    @keyframes loading {
      0% {
        transform: translateX(-100%);
      }
      100% {
        transform: translateX(100%);
      }
    }

    .new-video-enter {
      animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
  `]
})
export class SidebarComponent implements OnInit {
  recentVideos: Video[] = [];
  activeVideoId: string | null = null;
  isLoading = false;

  pagination: PaginationControls = {
    currentPage: 1,
    totalPages: 1,
    hasNext: false,
    hasPrevious: false,
  };

  constructor(
    private youtubeService: YoutubeService,
    private router: Router,
    private route: ActivatedRoute,
    private sidebarService: SidebarService
  ) {}

  ngOnInit() {
    this.loadRecentVideos(1);

    this.sidebarService.isLoading$.subscribe(
      isLoading => this.isLoading = isLoading
    );

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
