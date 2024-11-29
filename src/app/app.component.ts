import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Material Imports
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';

// Components
import { VideoInputComponent } from './components/video-input/video-input.component';
import { CommentsListComponent } from './components/comments-list/comments-list.component';
import { CommentCardComponent } from './components/comment-card/comment-card.component';
import { ReplyThreadComponent } from './components/reply-thread/reply-thread.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    // Material Modules
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatToolbarModule,
    MatDividerModule,
    MatListModule,
    // Our Components
    VideoInputComponent,
    CommentsListComponent,
    CommentCardComponent,
    ReplyThreadComponent,
    LoadingSpinnerComponent,
    SidebarComponent
  ],
  template: `
    <mat-toolbar class="bg-gradient-to-r from-cyan-900 to-purple-900 border-b border-cyan-500/20 sticky top-0 z-50">
      <span class="font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
        YouTube Comments Viewer
      </span>
    </mat-toolbar>

    <div class="flex h-[calc(100vh-64px)]">
      <!-- Sidebar - hidden on mobile, shown on md and up -->
      <div class="hidden md:block w-80 h-full overflow-y-auto border-r border-gray-800">
        <app-sidebar />
      </div>

      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto p-4">
        <div class="container mx-auto max-w-4xl">
          <app-video-input></app-video-input>
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
    }
  `]
})
export class AppComponent {
  title = 'YouTube Comments Viewer';
}
