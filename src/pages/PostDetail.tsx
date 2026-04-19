import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { BlogPost } from '../types';
import { Calendar, ArrowLeft, Clock, Share2, Check, List, Eye } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Comments from '../components/Comments';
import { PostDetailSkeleton } from '../components/Skeleton';

const PostDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [toc, setToc] = useState<{ id: string; text: string; level: number }[]>([]);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      try {
        const data = await api.getPost(slug);
        setPost(data);
        
        // Generate TOC from markdown body
        const headingLines = data.body.split('\n').filter(line => line.startsWith('##'));
        const extractedToc = headingLines.map(line => {
          const level = line.match(/^#+/)?.[0].length || 2;
          const text = line.replace(/^#+\s+/, '');
          const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
          return { id, text, level };
        });
        setToc(extractedToc);
      } catch (error) {
        console.error('Failed to fetch post', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  const handleShare = async () => {
    const shareData = {
      title: post?.title,
      text: post?.description,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy', err);
      }
    }
  };

  if (loading) return <PostDetailSkeleton />;

  if (!post) return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold text-white">Post not found</h2>
      <Link to="/" className="text-primary mt-4 inline-block underline">Go back home</Link>
    </div>
  );

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex flex-col lg:flex-row gap-8 relative items-start justify-center">
        {/* Table of Contents - Extreme Left Sidebar */}
        {toc.length > 0 && (
          <aside className="hidden xl:block w-72 shrink-0 h-fit sticky top-24 order-1 self-start">
            <div className="bg-bg-card/40 border border-border-subtle rounded-3xl p-8 backdrop-blur-sm shadow-2xl">
              <div className="flex items-center gap-3 mb-6 text-white font-black text-xs uppercase tracking-[0.2em]">
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                <span>Contents</span>
              </div>
              <nav className="space-y-4">
                {toc.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`block text-xs transition-all hover:text-primary leading-relaxed ${
                      item.level === 3 
                        ? 'pl-6 text-slate-500 border-l border-slate-800' 
                        : 'text-slate-400 font-bold hover:translate-x-1'
                    }`}
                  >
                    {item.text}
                  </a>
                ))}
              </nav>
            </div>
          </aside>
        )}

        {/* Main Content - Centered in Middle Space */}
        <article className="max-w-3xl w-full flex-1 min-w-0 animate-in fade-in slide-in-from-bottom-4 duration-700 order-2 lg:mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-8 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to stories
        </Link>

        <header className="space-y-6 mb-12">
          <div className="flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full border border-primary/20">
                {tag}
              </span>
            ))}
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-6 text-sm text-slate-400 border-b border-border-subtle pb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 font-bold border border-border-subtle">
                {post.author[0]?.toUpperCase()}
              </div>
              <span>{post.author}</span>
            </div>
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {new Date(post.pubDate || '').toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
              })}
            </span>
            <span className="hidden sm:flex items-center gap-1.5">
              <Clock size={14} />
              {Math.ceil((post.body || '').split(' ').length / 200)} min read
            </span>
            <span className="flex items-center gap-1.5">
              <Eye size={14} />
              {post.views || 0}
            </span>
          </div>
        </header>

        {/* Mobile TOC */}
        {toc.length > 0 && (
          <div className="lg:hidden mb-8 bg-bg-card/30 border border-border-subtle rounded-2xl p-4">
            <details className="group">
              <summary className="list-none flex items-center justify-between cursor-pointer font-bold text-white text-sm uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <List size={16} className="text-primary" />
                  <span>Table of Contents</span>
                </div>
                <div className="transition-transform group-open:rotate-180">↓</div>
              </summary>
              <nav className="mt-4 space-y-3 pt-4 border-t border-border-subtle/50">
                {toc.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`block text-sm text-slate-400 ${item.level === 3 ? 'pl-4' : ''}`}
                  >
                    {item.text}
                  </a>
                ))}
              </nav>
            </details>
          </div>
        )}

        <div className="prose prose-invert max-w-none prose-pre:p-0">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              h2: ({node, ...props}) => {
                const id = String(props.children).toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                return <h2 id={id} {...props} />;
              },
              h3: ({node, ...props}) => {
                const id = String(props.children).toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                return <h3 id={id} {...props} />;
              },
              code({ node, inline, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              }
            }}
          >
            {post.body || ''}
          </ReactMarkdown>
        </div>

        <footer className="mt-16 pt-8 border-t border-border-subtle">
          <div className="flex justify-between items-center">
            <div className="flex gap-4 items-center">
              <button 
                onClick={handleShare}
                className={`p-2 rounded-lg transition-all flex items-center gap-2 text-sm font-medium ${
                  copied ? 'bg-green-500/10 text-green-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {copied ? (
                  <>
                    <Check size={20} />
                    <span>Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 size={20} />
                    <span>Share Story</span>
                  </>
                )}
              </button>
            </div>
            <div className="text-slate-500 text-xs italic">
              Last updated: {new Date(post.pubDate || '').toLocaleDateString()}
            </div>
          </div>
        </footer>

        <Comments />
      </article>
    </div>
    </div>
  );
};

export default PostDetail;
