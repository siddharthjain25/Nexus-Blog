import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { BlogPost } from '../types';
import { Save, ArrowLeft, Loader2, Info, Eye, Edit3 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const PostEditor: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const isEditing = !!slug;

  const [post, setPost] = useState<BlogPost>({
    title: '',
    slug: '',
    description: '',
    body: '',
    pubDate: new Date().toISOString().split('T')[0],
    pubTime: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    author: 'Siddharth Jain',
    tags: [],
    featured: false,
    draft: true,
    timezone: 'Asia/Kolkata',
    hideEditPost: false,
    views: 0
  });

  const [tagString, setTagString] = useState('');
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'split'>('split');

  useEffect(() => {
    if (isEditing) {
      const fetchPost = async () => {
        try {
          const data = await api.getPost(slug);
          setPost(data);
          setTagString(data.tags?.join(', ') || '');
        } catch (error) {
          console.error('Failed to fetch post', error);
          navigate('/admin');
        } finally {
          setLoading(false);
        }
      };
      fetchPost();
    }
  }, [slug, isEditing, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updatedPost = {
        ...post,
        tags: tagString.split(',').map(t => t.trim()).filter(t => t !== ''),
      };
      await api.savePost(updatedPost);
      navigate('/admin');
    } catch (error) {
      console.error('Failed to save post', error);
      alert('Error saving post. Check console.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="animate-spin text-primary" size={32} />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex items-center gap-6">
          <Link to="/admin" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors">
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Back</span>
          </Link>
          <div className="flex bg-bg-card border border-border-subtle rounded-xl p-1">
            <button 
              onClick={() => setViewMode('edit')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${viewMode === 'edit' ? 'bg-primary text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Edit3 size={14} /> Edit
            </button>
            <button 
              onClick={() => setViewMode('split')}
              className={`hidden lg:flex px-3 py-1.5 rounded-lg text-xs font-bold transition-all items-center gap-2 ${viewMode === 'split' ? 'bg-primary text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Split
            </button>
            <button 
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${viewMode === 'preview' ? 'bg-primary text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Eye size={14} /> Preview
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            type="button"
            onClick={() => navigate('/admin')}
            className="flex-1 md:flex-none px-4 py-2 text-sm font-medium text-slate-400 hover:text-white"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-primary/20 font-bold text-sm disabled:opacity-50"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {isEditing ? 'Update' : 'Publish'}
          </button>
        </div>
      </div>

      <div className={`grid gap-8 ${viewMode === 'split' ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
        {/* Editor Side */}
        {(viewMode === 'edit' || viewMode === 'split') && (
          <div className="space-y-6 animate-in slide-in-from-left-4 duration-500">
            <div className="space-y-4 bg-bg-card border border-border-subtle rounded-3xl p-6 sm:p-8">
              <input 
                type="text"
                required
                placeholder="Story Title"
                value={post.title}
                onChange={(e) => setPost({...post, title: e.target.value, slug: isEditing ? post.slug : e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '')})}
                className="w-full text-3xl font-black bg-transparent border-none outline-none placeholder:text-slate-800 text-white"
              />
              
              <div className="flex flex-wrap gap-3 items-center text-xs">
                <div className="flex items-center gap-2 px-3 py-2 bg-bg-deep border border-border-subtle rounded-xl">
                  <span className="text-slate-500 font-mono">slug:</span>
                  <input 
                    type="text"
                    required
                    value={post.slug}
                    readOnly={isEditing}
                    onChange={(e) => setPost({...post, slug: e.target.value})}
                    className="bg-transparent border-none outline-none text-primary font-mono w-40"
                  />
                </div>
                
                <div className="flex items-center gap-2 px-3 py-2 bg-bg-deep border border-border-subtle rounded-xl">
                  <span className="text-slate-500">Tags:</span>
                  <input 
                    type="text"
                    placeholder="tech, react"
                    value={tagString}
                    onChange={(e) => setTagString(e.target.value)}
                    className="bg-transparent border-none outline-none text-slate-200 w-32"
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer select-none px-3 py-2 bg-bg-deep border border-border-subtle rounded-xl">
                  <input 
                    type="checkbox"
                    checked={post.featured}
                    onChange={(e) => setPost({...post, featured: e.target.checked})}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-primary focus:ring-primary"
                  />
                  <span className="text-slate-400">Featured</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none px-3 py-2 bg-bg-deep border border-border-subtle rounded-xl">
                  <input 
                    type="checkbox"
                    checked={post.draft}
                    onChange={(e) => setPost({...post, draft: e.target.checked})}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-primary focus:ring-primary"
                  />
                  <span className="text-slate-400">Draft</span>
                </label>
              </div>

              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-3 px-4 py-2 bg-bg-deep border border-border-subtle rounded-2xl">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Schedule</span>
                  <input 
                    type="date"
                    value={post.pubDate || ''}
                    onChange={(e) => setPost({...post, pubDate: e.target.value})}
                    className="bg-transparent border-none outline-none text-slate-300 text-xs font-bold"
                  />
                  <input 
                    type="time"
                    value={post.pubTime || ''}
                    onChange={(e) => setPost({...post, pubTime: e.target.value})}
                    className="bg-transparent border-none outline-none text-slate-300 text-xs font-bold"
                  />
                </div>
              </div>

              <textarea 
                rows={2}
                value={post.description}
                onChange={(e) => setPost({...post, description: e.target.value})}
                placeholder="A brief summary..."
                className="w-full p-4 bg-bg-deep border border-border-subtle rounded-2xl text-slate-300 focus:border-primary/50 outline-none transition-all resize-none text-sm"
              />

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Markdown Content</label>
                  <div className="flex items-center gap-1 text-[10px] text-slate-600 italic">
                    <Info size={10} /> Supports GFM
                  </div>
                </div>
                <textarea 
                  required
                  value={post.body}
                  onChange={(e) => setPost({...post, body: e.target.value})}
                  placeholder="Tell your story..."
                  className="w-full h-[600px] p-6 bg-bg-deep border border-border-subtle rounded-3xl text-slate-200 font-mono text-sm focus:border-primary/50 outline-none transition-all leading-relaxed shadow-inner overflow-y-auto custom-scrollbar"
                />
              </div>
            </div>
          </div>
        )}

        {/* Preview Side */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-500 lg:sticky lg:top-24 h-fit max-h-[calc(100vh-120px)] overflow-y-auto pr-2 custom-scrollbar">
            <div className="bg-bg-card border border-border-subtle rounded-3xl p-8 sm:p-12 min-h-[800px]">
              <div className="prose prose-invert max-w-none prose-pre:p-0">
                <h1 className="text-4xl font-black mb-8 text-white">{post.title || 'Untitled Story'}</h1>
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
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
                  {post.body || '*Start typing to see the preview...*'}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostEditor;
