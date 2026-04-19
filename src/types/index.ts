export interface BlogPost {
  title: string;
  slug: string;
  description: string;
  body: string;
  pubDate?: string | null;
  pubTime?: string | null;
  author: string;
  tags: string[];
  featured: boolean;
  draft: boolean;
  canonicalURL?: string | null;
  hideEditPost?: boolean;
  timezone?: string;
  views: number;
}

export interface User {
  username: string;
  email: string;
  full_name?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}
