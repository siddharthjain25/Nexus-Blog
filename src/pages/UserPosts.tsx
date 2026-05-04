import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { BlogPost } from '../types';
import { Calendar, ArrowRight, Eye, User, BookOpen, Edit2, Heart } from 'lucide-react';
import { HomeSkeleton } from '../components/Skeleton';

interface UserDetails {
  username: string;
  full_name?: string;
  bio?: string;
}

const UserPosts: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { user: loggedUser } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [user, setUser] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const isOwner = loggedUser?.username === username;

  useEffect(() => {
    const fetchData = async () => {
      if (!username) return;
      try {
        const [postsData, userData] = await Promise.all([
          api.getUserPosts(username),
          api.getUser(username)
        ]);
        setPosts(postsData);
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [username]);

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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12 animate-in fade-in duration-700 pb-20">
      <header className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shrink-0">
              <User size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">
                Stories by <span className="text-primary">{user?.full_name || username}</span>
              </h1>
              {user?.bio && (
                <p className="text-slate-400 text-sm mt-2 max-w-xl leading-relaxed italic">
                  {user.bio}
                </p>
              )}
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-4">
                {posts.length} {posts.length === 1 ? 'Published Story' : 'Published Stories'}
              </p>
            </div>
          </div>

          {isOwner && (
            <Link 
              to="/profile" 
              className="flex items-center justify-center gap-2 px-6 py-3 bg-bg-card border border-border-subtle hover:border-primary/50 text-white rounded-2xl font-bold text-sm transition-all shadow-xl group"
            >
              <Edit2 size={16} className="text-primary group-hover:scale-110 transition-transform" />
              Edit Profile
            </Link>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {posts.length > 0 ? (
          posts.map((post) => (
            <article key={post.slug} className="group bg-bg-card border border-border-subtle rounded-3xl p-6 sm:p-8 hover:border-primary/30 transition-all flex flex-col justify-between shadow-xl">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <Calendar size={12} />
                    {formatDate(post.pubDate || '')}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                    <Eye size={12} />
                    {post.views}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-rose-500/80">
                    <Heart size={12} className="fill-rose-500/20" />
                    {post.likes || 0}
                  </div>
                </div>
                
                <Link to={`/posts/${post.slug}`}>
                  <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                    {post.title}
                  </h3>
                </Link>
                
                <p className="text-slate-400 text-sm line-clamp-3 leading-relaxed">
                  {post.description || post.body?.substring(0, 150) + '...'}
                </p>
                
                <div className="flex flex-wrap gap-2 pt-2">
                  {post.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="text-[9px] font-bold px-2 py-1 bg-slate-800/50 text-slate-400 rounded-md border border-border-subtle uppercase">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-border-subtle/50 flex items-center justify-between">
                <Link to={`/posts/${post.slug}`} className="text-primary font-bold text-sm flex items-center gap-2 group/btn">
                  Read Story
                  <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
                {post.draft && (
                  <span className="text-[10px] font-bold bg-amber-500/10 text-amber-500 px-2 py-1 rounded-md border border-amber-500/20 uppercase">
                    Draft
                  </span>
                )}
              </div>
            </article>
          ))
        ) : (
          <div className="col-span-full text-center py-20 border-2 border-dashed border-border-subtle rounded-3xl">
            <BookOpen size={48} className="mx-auto text-slate-700 mb-4" />
            <p className="text-slate-500 text-lg">This user hasn't published any stories yet.</p>
            <Link to="/" className="text-primary hover:underline mt-4 inline-block font-bold">
              Explore other stories
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPosts;
