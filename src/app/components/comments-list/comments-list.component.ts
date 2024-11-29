import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { YoutubeService } from '../../services/youtube.service';
import { CommentCardComponent } from '../comment-card/comment-card.component';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { Comment, PaginationControls } from '../../interfaces/video.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-comments-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    CommentCardComponent,
    LoadingSpinnerComponent
  ],
  template: `
    <div class="floating-bg">
      <div class="floating-element w-64 h-64" style="left: 10%; top: 20%; animation-delay: -4s;"></div>
      <div class="floating-element w-96 h-96" style="left: 60%; top: 40%; animation-delay: -8s;"></div>
      <div class="floating-element w-72 h-72" style="left: 30%; top: 70%; animation-delay: -12s;"></div>
      <div class="floating-element w-80 h-80" style="left: 80%; top: 10%; animation-delay: -16s;"></div>
    </div>

    <div class="container mx-auto px-4 py-8 relative z-10">
      @if (loading) {
        <div class="flex justify-center items-center min-h-[50vh]">
          <app-loading-spinner />
        </div>
      } @else if (error) {
        <div class="neon-card bg-red-900/20">
          <p class="text-red-400">{{ error }}</p>
        </div>
      } @else if (comments.length) {
        <div class="space-y-6">
          @for (comment of comments; track comment.id) {
            <app-comment-card [comment]="comment" />
          }
          
          <!-- Pagination Controls -->
          @if (pagination.totalPages > 1) {
            <div class="flex justify-center items-center gap-4 mt-8 pb-8">
              <button mat-icon-button 
                      [disabled]="!pagination.hasPrevious"
                      (click)="changePage(pagination.currentPage - 1)"
                      class="text-cyan-400 hover:text-purple-400 disabled:text-gray-600">
                <mat-icon>chevron_left</mat-icon>
              </button>
              
              <div class="flex items-center gap-2">
                @for (page of getPageRange(); track page) {
                  <button mat-mini-fab
                          [class]="page === pagination.currentPage ? 
                            'bg-gradient-to-r from-cyan-500 to-purple-500' : 
                            'bg-gray-800 hover:bg-gray-700'"
                          (click)="changePage(page)">
                    {{ page }}
                  </button>
                }
              </div>

              <button mat-icon-button 
                      [disabled]="!pagination.hasNext"
                      (click)="changePage(pagination.currentPage + 1)"
                      class="text-cyan-400 hover:text-purple-400 disabled:text-gray-600">
                <mat-icon>chevron_right</mat-icon>
              </button>
            </div>
          }
        </div>
      } @else {
        <div class="neon-card">
          <p class="text-center text-gray-400">No comments found for this video.</p>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background: var(--bg-dark);
    }

    ::ng-deep {
      .mat-mdc-mini-fab {
        width: 36px;
        height: 36px;
        
        &.mdc-fab--primary {
          background: linear-gradient(to right, rgb(6, 182, 212), rgb(147, 51, 234));
        }
      }
    }
  `]
})
export class CommentsListComponent implements OnInit, OnDestroy {
  comments: Comment[] = [];
  loading = true;
  error: string | null = null;
  private routeSubscription?: Subscription;
  
  pagination: PaginationControls = {
    currentPage: 1,
    totalPages: 1,
    hasNext: false,
    hasPrevious: false
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private youtubeService: YoutubeService
  ) {}

  ngOnInit() {
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      const videoId = params.get('videoId');
      const page = Number(this.route.snapshot.queryParams['page']) || 1;
      
      if (videoId) {
        this.loading = true;
        this.error = null;
        this.comments = [];
        this.loadComments(videoId, page);
      } else {
        this.error = 'No video ID provided';
        this.loading = false;
      }
    });
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  private loadComments(videoId: string, page: number = 1) {
    this.youtubeService.getComments(videoId, page).subscribe({
      next: (response) => {
        this.comments = response.results;
        this.pagination = {
          currentPage: page,
          totalPages: Math.ceil(response.count / 20), // Assuming 20 items per page
          hasNext: !!response.next,
          hasPrevious: !!response.previous
        };
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching comments:', err);
        this.error = 'Failed to load comments. Please try again.';
        this.loading = false;
      }
    });
  }

  changePage(page: number) {
    const videoId = this.route.snapshot.paramMap.get('videoId');
    if (videoId) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { page },
        queryParamsHandling: 'merge'
      });
      this.loadComments(videoId, page);
    }
  }

  getPageRange(): number[] {
    const range: number[] = [];
    const { currentPage, totalPages } = this.pagination;
    
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + 4);
    
    if (end - start < 4) {
      start = Math.max(1, end - 4);
    }
    
    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    
    return range;
  }
}
