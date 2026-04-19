import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { BlogPost } from '../types';
import { Calendar, ArrowRight, Search, Hash, Eye, RefreshCw } from 'lucide-react';

const Posts: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await api.getPosts();
        // Sort posts by date (descending)
        const sortedPosts = data.sort((a, b) => {
          const dateA = new Date(`${a.pubDate || ''} ${a.pubTime || ''}`).getTime();
          const dateB = new Date(`${b.pubDate || ''} ${b.pubTime || ''}`).getTime();
          return dateB - dateA;
        });
        setPosts(sortedPosts);
      } catch (error) {
        console.error('Failed to fetch posts', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
    post.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (date: string) => {
    if (!date) return 'No date';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) return (
    <div className="flex justify-center items-center h-[60vh]">
      <RefreshCw className="animate-spin text-primary w-8 h-8" />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12 animate-in fade-in duration-700 pb-20">
      <header className="space-y-6">
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tighter text-white">
          All <span className="text-primary">Stories</span>.
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
          Browse through our complete collection of technical articles, deep dives, and engineering insights.
        </p>
        
        <div className="relative w-full max-w-2xl pt-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pt-4" size={20} />
          <input 
            type="text"
            placeholder="Search by title, tag, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-bg-card border border-border-subtle rounded-2xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-xl text-lg"
          />
        </div>
      </header>

      <section className="space-y-8">
        <div className="grid gap-8">
          {filteredPosts.length > 0 ? (
            filteredPosts.map(post => (
              <article key={post.slug} className="group relative bg-bg-card border border-border-subtle rounded-3xl p-6 sm:p-8 hover:border-primary/50 transition-all shadow-lg hover:shadow-primary/5 overflow-hidden break-words w-full">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {formatDate(post.pubDate || '')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye size={14} />
                        {post.views || 0}
                      </span>
                      <span className="flex items-center gap-1 text-slate-600">•</span>
                      <span className="flex items-center gap-1">
                        <Hash size={14} />
                        {post.tags?.[0] || 'Uncategorized'}
                      </span>
                    </div>
                    
                    <Link to={`/posts/${post.slug}`} className="block group-hover:text-primary transition-colors">
                      <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-3 break-words leading-tight">
                        {post.title}
                      </h3>
                    </Link>
                    
                    <p className="text-slate-400 leading-relaxed line-clamp-2 text-sm sm:text-base break-words">
                      {post.description || post.body?.substring(0, 160) + '...'}
                    </p>
                    
                    <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <Link to={`/posts/${post.slug}`} className="inline-flex items-center gap-2 text-primary font-bold text-sm group/btn">
                        Read Story 
                        <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                      
                      <div className="flex flex-wrap gap-2">
                        {post.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="px-3 py-1 bg-slate-800/50 text-slate-500 text-[10px] font-bold uppercase tracking-wider rounded-full border border-border-subtle">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="text-center py-20 border-2 border-dashed border-border-subtle rounded-3xl">
              <p className="text-slate-500">No posts found matching your search.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Posts;
