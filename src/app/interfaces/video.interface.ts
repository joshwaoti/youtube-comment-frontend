export interface Video {
  id: number;
  video_id: string;
  title: string;
  channel_title: string;
  fetch_date: string;
  comments: Comment[];
}

export interface Comment {
  id: number;
  comment_id: string;
  author: string;
  author_channel_id: string;
  text: string;
  likes_count: number;
  reply_count: number;
  published_at: string;
  updated_at: string;
  replies: Reply[];
}

export interface Reply {
  id: number;
  reply_id: string;
  author: string;
  author_channel_id: string;
  text: string;
  likes_count: number;
  published_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface PaginationControls {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
