import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { BlogPost } from '../types';
import { Calendar, ArrowRight, Eye, Zap } from 'lucide-react';
import { HomeSkeleton } from '../components/Skeleton';

const Home: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await api.getPosts();
        // Backend returns sorted posts, but we keep a fallback sort just in case
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

  const latestPost = posts[0];
  const recentPosts = posts.slice(1, 5);

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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-24 animate-in fade-in duration-700 pb-20">
      <header className="space-y-6">
        <h1 className="text-3xl sm:text-6xl font-extrabold tracking-tighter text-white leading-tight break-words">
          Thoughts, stories <br className="hidden sm:block" />
          and <span className="text-primary underline decoration-primary/30 underline-offset-8">ideas</span>.
        </h1>
        <p className="text-slate-400 text-base sm:text-lg max-w-2xl leading-relaxed">
          Explore the latest articles on technology, design, and software engineering. 
          A minimalist space for deep dives and quick tips.
        </p>
      </header>

      {/* Hero / Latest Post Section */}
      {latestPost && (
        <section className="space-y-8">
          <div className="flex items-center gap-3">
            <Zap size={20} className="text-primary fill-primary" />
            <h2 className="text-xl font-bold tracking-tight text-white uppercase tracking-widest text-xs">Latest Story</h2>
          </div>
          <article className="group relative bg-bg-card border-2 border-primary/20 rounded-3xl p-6 sm:p-10 hover:border-primary/50 transition-all shadow-2xl shadow-primary/5 overflow-hidden break-words w-full">
            <div className="relative z-10 space-y-6">
              <div className="flex flex-wrap gap-3">
                {latestPost.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full border border-primary/20">
                    {tag}
                  </span>
                ))}
              </div>
              
              <Link to={`/posts/${latestPost.slug}`} className="block">
                <h3 className="text-2xl sm:text-4xl font-black tracking-tight text-white group-hover:text-primary transition-colors leading-tight">
                  {latestPost.title}
                </h3>
              </Link>
              
              <p className="text-slate-400 text-base sm:text-lg leading-relaxed line-clamp-3 max-w-3xl">
                {latestPost.description || latestPost.body?.substring(0, 200) + '...'}
              </p>
              
              <div className="flex items-center justify-between pt-4 border-t border-border-subtle/50">
                <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    {formatDate(latestPost.pubDate || '')}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Eye size={14} />
                    {latestPost.views || 0}
                  </span>
                </div>
                <Link to={`/posts/${latestPost.slug}`} className="inline-flex items-center gap-2 text-primary font-bold text-sm group/btn">
                  Read Full Story 
                  <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </article>
        </section>
      )}

      {/* Recent Stories Section */}
      {recentPosts.length > 0 && (
        <section className="space-y-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <h2 className="text-xl font-bold tracking-tight text-white uppercase tracking-widest text-xs">Recent Stories</h2>
            </div>
            <Link to="/posts" className="text-xs font-bold text-primary hover:underline uppercase tracking-widest">
              View All
            </Link>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-6">
            {recentPosts.map(post => (
              <article key={post.slug} className="group bg-bg-card border border-border-subtle rounded-2xl p-6 hover:border-primary/30 transition-all flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <Calendar size={12} />
                    {formatDate(post.pubDate || '')}
                  </div>
                  <Link to={`/posts/${post.slug}`}>
                    <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed">
                    {post.description || post.body?.substring(0, 100) + '...'}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-border-subtle/50 flex items-center justify-between">
                  <div className="flex gap-2">
                    {post.tags.slice(0, 1).map(tag => (
                      <span key={tag} className="text-[9px] font-bold text-slate-500 uppercase">#{tag}</span>
                    ))}
                  </div>
                  <Link to={`/posts/${post.slug}`} className="text-primary hover:translate-x-1 transition-transform">
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="pt-6 text-center">
            <Link to="/posts" className="inline-flex items-center gap-2 bg-slate-800/50 hover:bg-slate-800 text-slate-300 px-8 py-4 rounded-2xl border border-border-subtle transition-all font-bold group">
              Explore All Stories
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>
      )}

      {!loading && posts.length === 0 && (
        <div className="text-center py-20 border-2 border-dashed border-border-subtle rounded-3xl">
          <p className="text-slate-500">No stories published yet.</p>
          <Link to="/admin/new" className="text-primary hover:underline mt-4 inline-block font-bold">Create your first story</Link>
        </div>
      )}
    </div>
  );
};

export default Home;
