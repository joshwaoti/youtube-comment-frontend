import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { YoutubeService } from '../../services/youtube.service';

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
    <div class="flex justify-center items-center min-h-[30vh] md:min-h-[50vh]">
      <mat-card class="w-full max-w-lg p-4 md:p-6 neon-card">
        <mat-card-header>
          <mat-card-title class="text-cyan-400">Enter YouTube Video URL</mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="videoForm" (ngSubmit)="onSubmit()" class="mt-4">
            <mat-form-field class="w-full" appearance="outline">
              <mat-label class="text-yellow-400 text-sm text-left">YouTube URL</mat-label>
              <input matInput formControlName="videoUrl" 
                     placeholder="https://www.youtube.com/watch?v=..."
                     class="text-white mt-4">
              <mat-error *ngIf="videoForm.get('videoUrl')?.invalid">
                Please enter a valid YouTube URL
              </mat-error>
            </mat-form-field>
            
            <div class="flex justify-end mt-4">
              <button mat-raised-button 
                      class="bg-gradient-to-r from-cyan-500 to-purple-500 text-white"
                      type="submit" 
                      [disabled]="videoForm.invalid">
                Fetch Comments
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      padding: 1rem;
    }

    ::ng-deep {
      .mat-mdc-form-field {
        .mdc-text-field--outlined {
          border-radius: 8px;
        }

        .mdc-notched-outline__notch {
          border-right: none;
        }
      }

      .mat-mdc-raised-button {
        background: linear-gradient(to right, rgb(6, 182, 212), rgb(147, 51, 234)) !important;
        color: white !important;
        padding: 0.5rem 1.5rem;
        border-radius: 0.5rem;
        transition: all 0.3s ease;

        &:hover:not([disabled]) {
          transform: translateY(-2px);
          box-shadow: 0 0 15px rgba(6, 182, 212, 0.5);
        }

        &[disabled] {
          opacity: 0.5;
          background: linear-gradient(to right, rgb(75, 85, 99), rgb(107, 114, 128)) !important;
        }
      }
    }
  `]
})
export class VideoInputComponent {
  videoForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private youtubeService: YoutubeService,
    private router: Router
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
        this.youtubeService.fetchComments(videoId).subscribe({
          next: (response) => {
            this.router.navigate(['/comments', videoId]);
          },
          error: (error) => {
            console.error('Error fetching comments:', error);
            // TODO: Add error handling UI
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
