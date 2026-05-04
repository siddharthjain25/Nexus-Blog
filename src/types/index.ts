export interface BlogPost {
  title: string;
  slug: string;
  description: string;
  body: string;
  pubDate?: string | null;
  pubTime?: string | null;
  username: string;
  tags: string[];
  draft: boolean;
  canonicalURL?: string | null;
  hideEditPost?: boolean;
  timezone?: string;
  views: number;
  likes: number;
}

export type UserRole = 'admin' | 'author' | 'reader';

export interface User {
  username: string;
  email: string;
  full_name?: string;
  bio?: string;
  is_admin: boolean;
  role: UserRole;
}

export interface UserCreate extends User {
  password: string;
}

export interface UserUpdate {
  email?: string;
  full_name?: string;
  bio?: string;
  password?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface Comment {
  id: string;
  content: string;
  post_slug: string;
  username: string;
  created_at: string;
  parent_id?: string;
  is_deleted: boolean;
  is_edited?: boolean;
}

