import axios from 'axios';
import { BlogPost, AuthResponse, UserCreate, User, UserUpdate, Comment } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const getHeaders = (customHeaders?: Record<string, string>) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return { ...headers, ...customHeaders };
};

const cache: Record<string, { data: any; timestamp: number }> = {};
const CACHE_TTL = 60 * 1000; // 1 minute

export const api = {
  register: async (userData: UserCreate) => {
    const response = await axios.post<User>(`${API_URL}/register`, userData);
    return response.data;
  },

  login: async (username: string, password: string) => {
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);
    
    const response = await axios.post<AuthResponse>(`${API_URL}/token`, params);
    return response.data;
  },

  verifyToken: async (headers?: Record<string, string>) => {
    const response = await axios.get<User>(`${API_URL}/verify-token`, {
      headers: getHeaders(headers),
    });
    return response.data;
  },

  updateProfile: async (userData: UserUpdate, headers?: Record<string, string>) => {
    const response = await axios.put<User>(`${API_URL}/users/me`, userData, {
      headers: getHeaders(headers),
    });
    return response.data;
  },

  getUser: async (username: string) => {
    const response = await axios.get<User>(`${API_URL}/users/${username}`);
    return response.data;
  },

  getPosts: async (includeDrafts = false, includeScheduled = false, limit?: number, skip?: number, headers?: Record<string, string>) => {
    const cacheKey = `posts-${includeDrafts}-${includeScheduled}-${limit}-${skip}`;
    if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < CACHE_TTL) {
      return cache[cacheKey].data as BlogPost[];
    }
    const response = await axios.get<BlogPost[]>(`${API_URL}/posts`, {
      headers: getHeaders(headers),
      params: {
        include_drafts: includeDrafts,
        include_scheduled: includeScheduled,
        limit,
        skip
      }
    });
    cache[cacheKey] = { data: response.data, timestamp: Date.now() };
    return response.data;
  },
  
  getPost: async (slug: string, headers?: Record<string, string>) => {
    const response = await axios.get<BlogPost>(`${API_URL}/posts/${slug}`, {
      headers: getHeaders(headers),
    });
    return response.data;
  },

  likePost: async (slug: string) => {
    const response = await axios.post<{ likes: number }>(`${API_URL}/posts/${slug}/like`, {}, {
      headers: getHeaders(),
    });
    return response.data;
  },

  getUserPosts: async (username: string, headers?: Record<string, string>) => {
    const response = await axios.get<BlogPost[]>(`${API_URL}/posts/user/${username}`, {
      headers: getHeaders(headers),
    });
    return response.data;
  },
  
  savePost: async (post: BlogPost, headers?: Record<string, string>) => {
    const response = await axios.post<BlogPost>(`${API_URL}/posts/`, post, {
      headers: getHeaders(headers),
    });
    return response.data;
  },
  
  deletePost: async (slug: string, headers?: Record<string, string>) => {
    const response = await axios.delete(`${API_URL}/posts/${slug}`, {
      headers: getHeaders(headers),
    });
    return response.data;
  },
  
  searchPosts: async (query: string, headers?: Record<string, string>) => {
    const response = await axios.get<BlogPost[]>(`${API_URL}/posts/search?q=${query}`, {
      headers: getHeaders(headers),
    });
    return response.data;
  },

  getComments: async (postSlug: string) => {
    const response = await axios.get<Comment[]>(`${API_URL}/comments/${postSlug}`);
    return response.data;
  },

  addComment: async (content: string, postSlug: string, parentId?: string, headers?: Record<string, string>) => {
    const response = await axios.post<Comment>(`${API_URL}/comments/`, {
      content,
      post_slug: postSlug,
      parent_id: parentId,
    }, {
      headers: getHeaders(headers),
    });
    return response.data;
  },

  deleteComment: async (commentId: string, headers?: Record<string, string>) => {
    const response = await axios.delete(`${API_URL}/comments/${commentId}`, {
      headers: getHeaders(headers),
    });
    return response.data;
  },

  updateComment: async (commentId: string, content: string, headers?: Record<string, string>) => {
    const response = await axios.patch(`${API_URL}/comments/${commentId}`, {
      content,
    }, {
      headers: getHeaders(headers),
    });
    return response.data;
  },

  getAllUsers: async () => {
    const response = await axios.get<User[]>(`${API_URL}/admin/users`, {
      headers: getHeaders(),
    });
    return response.data;
  },

  updateUserRole: async (username: string, role: string) => {
    const response = await axios.patch<User>(`${API_URL}/admin/users/${username}/role?role=${role}`, {}, {
      headers: getHeaders(),
    });
    return response.data;
  },

  deleteUser: async (username: string) => {
    const response = await axios.delete(`${API_URL}/admin/users/${username}`, {
      headers: getHeaders(),
    });
    return response.data;
  },

  getAllComments: async () => {
    const response = await axios.get<Comment[]>(`${API_URL}/comments/`, {
      headers: getHeaders(),
    });
    return response.data;
  }
};
