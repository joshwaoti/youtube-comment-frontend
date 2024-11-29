import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Video } from '../interfaces/video.interface';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();

  addNewVideo(videoData: Partial<Video>) {
    this.isLoadingSubject.next(true);
    
    const newVideo: Video = {
      id: Date.now(),
      video_id: videoData.video_id!,
      title: videoData.title!,
      fetch_date: new Date().toISOString(),
      channel_title: '',
      comments: []
    };

    // Emit the new video to subscribers
    this.onNewVideo(newVideo);
    
    setTimeout(() => {
      this.isLoadingSubject.next(false);
    }, 1000);
  }

  private onNewVideo(video: Video) {
    // You can add additional logic here if needed
    console.log('New video added:', video);
  }
}
