import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { BlogPost } from '../types';
import { Calendar, ArrowRight, Search, Hash, Star, Eye } from 'lucide-react';
import { HomeSkeleton } from '../components/Skeleton';

const Home: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await api.getPosts();
        setPosts(data.filter(p => !p.draft));
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
    post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const featuredPosts = filteredPosts.filter(p => p.featured);
  const regularPosts = filteredPosts.filter(p => !p.featured);

  const formatDate = (date: string) => {
    if (!date) return 'No date';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) return <HomeSkeleton />;

  return (
    <div className="space-y-16 animate-in fade-in duration-700 pb-20">
      <header className="space-y-6">
        <h1 className="text-3xl sm:text-6xl font-extrabold tracking-tighter text-white leading-tight break-words">
          Thoughts, stories <br className="hidden sm:block" />
          and <span className="text-primary underline decoration-primary/30 underline-offset-8">ideas</span>.
        </h1>
        <p className="text-slate-400 text-base sm:text-lg max-w-2xl leading-relaxed">
          Explore the latest articles on technology, design, and software engineering. 
          A minimalist space for deep dives and quick tips.
        </p>
        
        <div className="relative w-full max-w-md pt-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pt-4" size={20} />
          <input 
            type="text"
            placeholder="Search posts or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-bg-card border border-border-subtle rounded-2xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-xl"
          />
        </div>
      </header>

      {/* Featured Section */}
      {featuredPosts.length > 0 && (
        <section className="space-y-8">
          <div className="flex items-center gap-3">
            <Star size={20} className="text-amber-500 fill-amber-500" />
            <h2 className="text-xl font-bold tracking-tight text-white uppercase tracking-widest text-xs">Featured Stories</h2>
          </div>
          <div className="grid gap-8">
            {featuredPosts.map(post => (
              <article key={post.slug} className="group relative bg-bg-card border-2 border-primary/20 rounded-3xl p-6 sm:p-10 hover:border-primary/50 transition-all shadow-2xl shadow-primary/5 overflow-hidden break-words w-full">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Star size={120} fill="currentColor" className="text-primary" />
                </div>
                <div className="relative z-10 space-y-6">
                  <div className="flex flex-wrap gap-3">
                    {post.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full border border-primary/20">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <Link to={`/posts/${post.slug}`} className="block">
                    <h3 className="text-2xl sm:text-4xl font-black tracking-tight text-white group-hover:text-primary transition-colors leading-tight">
                      {post.title}
                    </h3>
                  </Link>
                  
                  <p className="text-slate-400 text-base sm:text-lg leading-relaxed line-clamp-3 max-w-3xl">
                    {post.description || post.body?.substring(0, 200) + '...'}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-border-subtle/50">
                    <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        {formatDate(post.pubDate || '')}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Eye size={14} />
                        {post.views || 0}
                      </span>
                    </div>
                    <Link to={`/posts/${post.slug}`} className="inline-flex items-center gap-2 text-primary font-bold text-sm group/btn">
                      Read Featured Story 
                      <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Regular Posts Section */}
      <section className="space-y-8">
        {featuredPosts.length > 0 && <h2 className="text-xl font-bold tracking-tight text-white uppercase tracking-widest text-xs border-l-4 border-slate-800 pl-4">Latest Updates</h2>}
        <div className="grid gap-8">
          {regularPosts.length > 0 ? (
            regularPosts.map(post => (
              <article key={post.slug} className="group relative bg-bg-card border border-border-subtle rounded-3xl p-5 sm:p-8 hover:border-primary/50 transition-all shadow-lg hover:shadow-primary/5 overflow-hidden break-words w-full">
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
                      <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-3 break-words">
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
            !loading && regularPosts.length === 0 && featuredPosts.length === 0 && (
              <div className="text-center py-20 border-2 border-dashed border-border-subtle rounded-3xl">
                <p className="text-slate-500">No posts found matching your search.</p>
              </div>
            )
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
