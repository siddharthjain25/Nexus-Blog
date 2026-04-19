import axios from 'axios';
import { BlogPost, AuthResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const getHeaders = () => {
  const token = localStorage.getItem('admin_token');
  if (!token) return { 'Content-Type': 'application/json' };
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export const api = {
  // ... (login unchanged)
  login: async (username: string, password: string) => {
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);
    
    const response = await axios.post<AuthResponse>(`${API_URL}/token`, params);
    return response.data;
  },

  getPosts: async (includeDrafts = false, includeScheduled = false) => {
    const headers = getHeaders();
    const response = await axios.get<BlogPost[]>(`${API_URL}/posts`, {
      headers,
      params: {
        include_drafts: includeDrafts,
        include_scheduled: includeScheduled
      }
    });
    return response.data;
  },
  
  getPost: async (slug: string) => {
    const response = await axios.get<BlogPost>(`${API_URL}/posts/${slug}`);
    return response.data;
  },
  
  savePost: async (post: BlogPost) => {
    const response = await axios.post<BlogPost>(`${API_URL}/posts/`, post, {
      headers: getHeaders(),
    });
    return response.data;
  },
  
  deletePost: async (slug: string) => {
    const response = await axios.delete(`${API_URL}/posts/${slug}`, {
      headers: getHeaders(),
    });
    return response.data;
  },
  
  searchPosts: async (query: string) => {
    const response = await axios.get<BlogPost[]>(`${API_URL}/posts/search?q=${query}`);
    return response.data;
  }
};
