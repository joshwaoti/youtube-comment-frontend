import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VideoInputComponent } from './components/video-input/video-input.component';
import { CommentsListComponent } from './components/comments-list/comments-list.component';

export const routes: Routes = [
  { 
    path: '', 
    component: VideoInputComponent 
  },
  { 
    path: 'comments/:videoId', 
    component: CommentsListComponent 
  },
  { 
    path: '**', 
    redirectTo: '' 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { } 