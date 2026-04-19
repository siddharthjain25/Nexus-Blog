import axios from 'axios';
import { BlogPost, AuthResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const getHeaders = () => {
  const token = localStorage.getItem('admin_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export const api = {
  login: async (formData: FormData) => {
    const response = await axios.post<AuthResponse>(`${API_URL}/token`, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },

  getPosts: async () => {
    const response = await axios.get<BlogPost[]>(`${API_URL}/posts`);
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
