import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Video, Comment, Reply, PaginatedResponse } from '../interfaces/video.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class YoutubeService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  fetchComments(videoId: string): Observable<Video> {
    return this.http.post<Video>(`${this.apiUrl}/videos/fetch_comments/`, { video_id: videoId });
  }

  getComments(videoId: string, page: number = 1): Observable<PaginatedResponse<Comment>> {
    return this.http.get<PaginatedResponse<Comment>>(`${this.apiUrl}/comments/`, {
      params: {
        video_id: videoId,
        page: page.toString()
      }
    });
  }

  getReplies(commentId: string): Observable<Reply[]> {
    return this.http.get<Reply[]>(`${this.apiUrl}/replies/`, {
      params: { comment_id: commentId }
    });
  }

  getRecentVideos(page: number = 1): Observable<PaginatedResponse<Video>> {
    return this.http.get<PaginatedResponse<Video>>(`${this.apiUrl}/videos/recent/`, {
      params: { page: page.toString() }
    });
  }
}