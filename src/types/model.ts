// Types matching Backend Go models (shared/model/model.go)

export interface Post {
  post_id: string;
  user_id: string;
  user: string;
  message: string;
  url: string;
  type: string;
  deleted: boolean;
  deleted_at: number;
  like_count: number;
  shared_count: number;
  created_at: number; // unix seconds
}

export interface User {
  user_id: string;
  username: string;
  password: string;
  age: number;
  gender: string;
}

export interface Comment {
  comment_id: string;
  parent_comment_id: string;
  root_comment_id: string;
  user_id: string;
  post_id: string;
  depth: number;
  content: string;
  created_at: number;
  deleted: boolean;
  deleted_at: number;
}

export interface Follow {
  follow_id: string;
  follower_id: string;
  followee_id: string;
  created_at: string;
}

export interface Message {
  message_id: string; // "<conversation_id>:<seq>"
  conversation_id: string;
  seq: number; // gap-free order within the conversation
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
}

export interface Notification {
  notification_id: string;
  user_id: string;
  type: string;
  actor_id: string;
  post_id: string;
  read: boolean;
  created_at: number;
}

// API response types

export interface SearchResponse {
  posts: Post[];
}

export interface SigninResponse {
  token: string;
}

export interface SignupResponse {
  user_id: string;
}

export interface UploadResponse {
  post_id: string;
}

export interface CommentResponse {
  comment_id: string;
}

// GET /post/{id}/comments — oldest first; next_cursor is absent on the last page.
export interface CommentPage {
  comments: Comment[];
  next_cursor?: string;
}

export interface MessageResponse {
  message: string;
}
