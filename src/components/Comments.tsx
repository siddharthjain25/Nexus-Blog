import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Comment } from '../types';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, Send, Trash2, Loader2, User, Reply, ChevronDown, ChevronUp, Pencil } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CommentsProps {
  postSlug: string;
}

interface CommentWithReplies extends Comment {
  replies: CommentWithReplies[];
}

// Helper to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: now.getFullYear() !== date.getFullYear() ? 'numeric' : undefined
  });
};

const CommentItem: React.FC<{ 
  comment: CommentWithReplies; 
  depth: number;
  isAuthenticated: boolean;
  user: any;
  isAdmin: boolean;
  onReply: (parentId: string, content: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (id: string, content: string) => Promise<void>;
  submitting: boolean;
}> = ({ comment, depth, isAuthenticated, user, isAdmin, onReply, onDelete, onUpdate, submitting }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [editContent, setEditContent] = useState(comment.content);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    await onReply(comment.id, replyContent);
    setReplyContent('');
    setIsReplying(false);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editContent.trim() || editContent === comment.content) {
      setIsEditing(false);
      return;
    }
    await onUpdate(comment.id, editContent);
    setIsEditing(false);
  };

  return (
    <div className={`relative ${depth > 0 ? 'mt-3' : 'mt-6'}`}>
      {/* Thread line */}
      {depth > 0 && (
        <div 
          className="absolute left-[-20px] top-0 bottom-0 w-[2px] bg-border-subtle hover:bg-primary/40 transition-colors cursor-pointer" 
          onClick={() => setIsCollapsed(!isCollapsed)}
        />
      )}

      <div className="flex gap-3">
        {/* User Icon / Avatar */}
        <div className="flex flex-col items-center shrink-0">
          <div className={`w-8 h-8 rounded-full bg-bg-deep border border-border-subtle flex items-center justify-center text-slate-500 shadow-sm ${isCollapsed ? 'opacity-50' : ''}`}>
            <User size={14} />
          </div>
          {!isCollapsed && comment.replies.length > 0 && (
            <div className="w-[2px] grow bg-border-subtle mt-2 mb-1" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            {comment.is_deleted ? (
              <span className="text-xs font-bold text-slate-500 italic">
                {comment.username}
              </span>
            ) : (
              <Link 
                to={`/user/${comment.username}`} 
                className={`text-xs font-bold hover:underline transition-colors ${comment.username === user?.username ? 'text-primary' : 'text-white'}`}
              >
                {comment.username}
              </Link>
            )}
            {!comment.is_deleted && comment.username === user?.username && (
              <span className="text-[10px] bg-primary/10 text-primary px-1.5 rounded font-bold uppercase tracking-tighter">OP</span>
            )}
            <span className="text-slate-500 text-[10px]">•</span>
            <span className="text-slate-500 text-[10px]">{formatDate(comment.created_at)}</span>
            {comment.is_edited && !comment.is_deleted && (
              <span className="text-slate-400 text-[10px] italic ml-1 font-medium">• edited</span>
            )}
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="ml-auto text-slate-500 hover:text-white p-1"
            >
              {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </button>
          </div>

          {!isCollapsed ? (
            <>
              {/* Content */}
              {isEditing ? (
                <form onSubmit={handleEditSubmit} className="mt-2 mb-3 space-y-3">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full bg-bg-deep border border-border-subtle rounded-xl p-3 text-sm text-white focus:border-primary/50 outline-none transition-all min-h-[100px] resize-none"
                    autoFocus
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setEditContent(comment.content);
                      }}
                      className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting || !editContent.trim() || editContent === comment.content}
                      className="flex items-center gap-2 px-4 py-1.5 bg-primary hover:bg-blue-600 text-white rounded-lg font-bold text-xs transition-all disabled:opacity-50"
                    >
                      {submitting ? <Loader2 className="animate-spin" size={12} /> : <Send size={12} />}
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <p className={`text-sm leading-relaxed mb-2 whitespace-pre-wrap ${comment.is_deleted ? 'text-slate-500 italic' : 'text-slate-300'}`}>
                  {comment.content}
                </p>
              )}

              {/* Actions */}
              {!comment.is_deleted && !isEditing && (
                <div className="flex items-center gap-4">
                  {isAuthenticated && depth < 5 && (
                    <button 
                      onClick={() => setIsReplying(!isReplying)}
                      className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary transition-colors"
                    >
                      <Reply size={14} />
                      Reply
                    </button>
                  )}
                  {user?.username === comment.username && (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary transition-colors"
                    >
                      <Pencil size={14} />
                      Edit
                    </button>
                  )}
                  {(user?.username === comment.username || isAdmin) && (
                    <button 
                      onClick={() => onDelete(comment.id)}
                      className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  )}
                </div>
              )}

              {/* Reply Form */}
              {isReplying && (
                <form onSubmit={handleReplySubmit} className="mt-4 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write a reply..."
                    className="w-full bg-bg-deep border border-border-subtle rounded-xl p-3 text-sm text-white placeholder:text-slate-600 focus:border-primary/50 outline-none transition-all min-h-[80px] resize-none"
                    autoFocus
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsReplying(false)}
                      className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting || !replyContent.trim()}
                      className="flex items-center gap-2 px-4 py-1.5 bg-primary hover:bg-blue-600 text-white rounded-lg font-bold text-xs transition-all disabled:opacity-50"
                    >
                      {submitting ? <Loader2 className="animate-spin" size={12} /> : <Send size={12} />}
                      Reply
                    </button>
                  </div>
                </form>
              )}

              {/* Nested Replies */}
              {comment.replies.length > 0 && (
                <div className="ml-4 md:ml-6">
                  {comment.replies.map(reply => (
                    <CommentItem 
                      key={reply.id} 
                      comment={reply} 
                      depth={depth + 1}
                      isAuthenticated={isAuthenticated}
                      user={user}
                      isAdmin={isAdmin}
                      onReply={onReply}
                      onDelete={onDelete}
                      onUpdate={onUpdate}
                      submitting={submitting}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-[10px] text-slate-500 italic">Thread collapsed</div>
          )}
        </div>
      </div>
    </div>
  );
};

const Comments: React.FC<CommentsProps> = ({ postSlug }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { user, isAuthenticated, isAdmin } = useAuth();

  const fetchComments = async () => {
    try {
      const data = await api.getComments(postSlug);
      setComments(data);
    } catch (error) {
      console.error('Failed to fetch comments', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postSlug]);

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || submitting) return;

    setSubmitting(true);
    try {
      const addedComment = await api.addComment(newComment, postSlug);
      setComments([addedComment, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = async (parentId: string, content: string) => {
    setSubmitting(true);
    try {
      const addedComment = await api.addComment(content, postSlug, parentId);
      setComments([addedComment, ...comments]);
    } catch (error) {
      console.error('Failed to add reply', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (commentId: string, content: string) => {
    setSubmitting(true);
    try {
      await api.updateComment(commentId, content);
      setComments(comments.map(c => 
        c.id === commentId ? { ...c, content, is_edited: true } : c
      ));
    } catch (error) {
      console.error('Failed to update comment', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    
    try {
      await api.deleteComment(commentId);
      // Update local state to show as deleted
      setComments(comments.map(c => 
        c.id === commentId 
          ? { ...c, is_deleted: true, content: '[Comment deleted by user]', username: '[deleted]' } 
          : c
      ));
    } catch (error) {
      console.error('Failed to delete comment', error);
    }
  };

  const buildCommentTree = (flatComments: Comment[]): CommentWithReplies[] => {
    const map = new Map<string, CommentWithReplies>();
    const roots: CommentWithReplies[] = [];

    flatComments.forEach(comment => {
      map.set(comment.id, { ...comment, replies: [] });
    });

    flatComments.forEach(comment => {
      const commentWithReplies = map.get(comment.id)!;
      if (comment.parent_id && map.has(comment.parent_id)) {
        map.get(comment.parent_id)!.replies.push(commentWithReplies);
      } else {
        roots.push(commentWithReplies);
      }
    });

    roots.forEach(root => {
      root.replies.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    });

    return roots;
  };

  const commentTree = buildCommentTree(comments);

  return (
    <div className="mt-16 pt-8 border-t border-border-subtle max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <MessageSquare size={18} className="text-primary" />
          <h3 className="text-lg font-bold text-white uppercase tracking-wider">Discussion</h3>
          <span className="text-slate-500 text-sm font-medium">({comments.length})</span>
        </div>
      </div>

      {isAuthenticated ? (
        <form onSubmit={handlePostComment} className="mb-12 group">
          <div className="relative">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="What are your thoughts?"
              className="w-full bg-bg-deep border border-border-subtle rounded-2xl p-4 text-sm text-white placeholder:text-slate-600 focus:border-primary/50 outline-none transition-all min-h-[120px] resize-none shadow-inner"
              required
            />
          </div>
          <div className="flex justify-end mt-3">
            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="flex items-center gap-2 px-6 py-2 bg-primary hover:bg-blue-600 text-white rounded-xl font-bold text-sm transition-all disabled:opacity-50 shadow-lg shadow-primary/20"
            >
              {submitting ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
              Comment
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-12 p-8 bg-bg-card/30 border border-border-subtle border-dashed rounded-3xl text-center">
          <p className="text-slate-400 text-sm mb-4">Log in to join the discussion</p>
          <Link 
            to="/login" 
            className="inline-flex items-center gap-2 px-6 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl font-bold text-sm transition-all border border-primary/20"
          >
            Sign in
          </Link>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin text-primary/50" size={32} />
        </div>
      ) : (
        <div className="space-y-2">
          {commentTree.length === 0 ? (
            <div className="text-center py-12 text-slate-600 text-sm italic border border-border-subtle/50 rounded-3xl border-dashed">
              No comments yet. Start the conversation!
            </div>
          ) : (
            commentTree.map((comment) => (
              <CommentItem 
                key={comment.id} 
                comment={comment} 
                depth={0}
                isAuthenticated={isAuthenticated}
                user={user}
                isAdmin={isAdmin}
                onReply={handleReply}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
                submitting={submitting}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Comments;
