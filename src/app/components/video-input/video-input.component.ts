import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { YoutubeService } from '../../services/youtube.service';
import { LoadingService } from '../../services/loading.service';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-video-input',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule
  ],
  template: `
    <div class="input-container">
      <div class="glow-container">
        <div class="input-card">
          <h2 class="title">Enter YouTube Video URL</h2>
          
          <form [formGroup]="videoForm" (ngSubmit)="onSubmit()" class="form-content">
            <div class="input-wrapper">
              <input 
                type="text" 
                formControlName="videoUrl"
                placeholder="Paste your YouTube URL here..."
                [class.invalid]="videoForm.get('videoUrl')?.invalid && videoForm.get('videoUrl')?.touched"
              >
              <div class="input-border"></div>
            </div>
            
            <div class="error-message" *ngIf="videoForm.get('videoUrl')?.invalid && videoForm.get('videoUrl')?.touched">
              Please enter a valid YouTube URL
            </div>

            <button 
              type="submit" 
              [disabled]="videoForm.invalid"
              class="submit-button"
            >
              Fetch Comments
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .input-container {
      display: flex;
      justify-content: center;
      align-items: flex-start;
      min-height: 40vh;
      padding: 2rem;
      margin-top: -1.5rem;
    }

    .glow-container {
      position: relative;
      width: 100%;
      max-width: 600px;
      margin-top: 2rem;
      
      &::before {
        content: '';
        position: absolute;
        inset: -2px;
        background: linear-gradient(45deg, 
          rgba(6, 182, 212, 0.5),
          rgba(147, 51, 234, 0.5),
          rgba(6, 182, 212, 0.5)
        );
        border-radius: 1.5rem;
        filter: blur(8px);
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      &:hover::before {
        opacity: 1;
      }
    }

    .input-card {
      position: relative;
      background: rgba(17, 24, 39, 0.8);
      backdrop-filter: blur(10px);
      border-radius: 1.5rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 2rem;
      overflow: hidden;

      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 200%;
        height: 100%;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(255, 255, 255, 0.1),
          transparent
        );
        animation: shine 8s infinite;
      }
    }

    .title {
      font-size: 1.5rem;
      font-weight: bold;
      background: linear-gradient(to right, rgb(6, 182, 212), rgb(147, 51, 234));
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      text-align: center;
      margin-bottom: 2rem;
    }

    .form-content {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .input-wrapper {
      position: relative;
      
      input {
        width: 100%;
        background: rgba(255, 255, 255, 0.05);
        border: none;
        border-radius: 0.75rem;
        padding: 1rem 1.5rem;
        color: white;
        font-size: 1rem;
        transition: all 0.3s ease;

        &::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        &:focus {
          outline: none;
          background: rgba(255, 255, 255, 0.1);
        }

        &.invalid {
          border-color: rgb(239, 68, 68);
        }
      }

      .input-border {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(to right, rgb(6, 182, 212), rgb(147, 51, 234));
        transform: scaleX(0);
        transition: transform 0.3s ease;
      }

      input:focus + .input-border {
        transform: scaleX(1);
      }
    }

    .error-message {
      color: rgb(239, 68, 68);
      font-size: 0.875rem;
      margin-top: -0.5rem;
    }

    .submit-button {
      background: linear-gradient(to right, rgb(6, 182, 212), rgb(147, 51, 234));
      color: white;
      border: none;
      border-radius: 0.75rem;
      padding: 1rem 2rem;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;

      &:hover:not([disabled]) {
        transform: translateY(-2px);
        box-shadow: 0 0 20px rgba(6, 182, 212, 0.3);
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        background: linear-gradient(to right, rgb(75, 85, 99), rgb(107, 114, 128));
      }

      &::after {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: linear-gradient(
          45deg,
          transparent,
          rgba(255, 255, 255, 0.1),
          transparent
        );
        transform: rotate(45deg);
        animation: buttonShine 6s infinite;
      }
    }

    @keyframes shine {
      0% {
        left: -100%;
      }
      20%, 100% {
        left: 100%;
      }
    }

    @keyframes buttonShine {
      0% {
        transform: rotate(45deg) translateX(-100%);
      }
      20%, 100% {
        transform: rotate(45deg) translateX(100%);
      }
    }

    @media (max-width: 640px) {
      .input-container {
        padding: 1rem;
      }

      .input-card {
        padding: 1.5rem;
      }

      .title {
        font-size: 1.25rem;
      }

      input {
        font-size: 0.875rem;
        padding: 0.75rem 1rem;
      }

      .submit-button {
        padding: 0.75rem 1.5rem;
      }
    }
  `]
})
export class VideoInputComponent {
  videoForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private youtubeService: YoutubeService,
    private router: Router,
    private loadingService: LoadingService,
    private sidebarService: SidebarService
  ) {
    this.videoForm = this.fb.group({
      videoUrl: ['', [Validators.required, Validators.pattern(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/)]]
    });
  }

  onSubmit() {
    if (this.videoForm.valid) {
      const url = this.videoForm.get('videoUrl')?.value;
      const videoId = this.extractVideoId(url);
      
      if (videoId) {
        this.loadingService.startLoading();
        
        this.youtubeService.fetchComments(videoId).subscribe({
          next: (response) => {
            this.videoForm.reset();
            
            this.sidebarService.addNewVideo({
              video_id: videoId,
              title: response.title || 'Untitled Video',
              fetch_date: new Date().toISOString()
            });
            
            this.router.navigate(['/comments', videoId]);
            this.loadingService.stopLoading();
          },
          error: (error) => {
            console.error('Error fetching comments:', error);
            this.loadingService.stopLoading();
          }
        });
      }
    }
  }

  private extractVideoId(url: string): string | null {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }
}
