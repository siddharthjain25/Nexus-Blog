import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import { BlogPost, User, Comment } from "../types";
import {
  Edit,
  Trash2,
  Plus,
  RefreshCw,
  Search,
  FileText,
  Eye,
  Users,
  MessageSquare,
  Shield,
  UserCheck,
  MoreVertical,
  ChevronRight,
  ChevronDown
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

type Tab = "posts" | "users" | "comments";

const AdminDashboard: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [allComments, setAllComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("posts");
  const [searchQuery, setSearchQuery] = useState("");
  const { logout, user: currentUser, isAdmin } = useAuth();

  // For comments grouping
  const [expandedPosts, setExpandedPosts] = useState<Record<string, boolean>>({});

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "posts") {
        const data = await api.getPosts(true, true);
        setPosts(data);
      } else if (activeTab === "users" && isAdmin) {
        const data = await api.getAllUsers();
        setUsers(data);
      } else if (activeTab === "comments" && isAdmin) {
        const data = await api.getAllComments();
        setAllComments(data);
      }
    } catch (error: any) {
      if (error.response?.status === 401) logout();
      console.error(`Failed to fetch ${activeTab}`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleDeletePost = async (slug: string) => {
    const post = posts.find(p => p.slug === slug);
    if (!post) return;

    if (!isAdmin && post.username !== currentUser?.username) {
      alert("You can only delete your own posts.");
      return;
    }

    if (!window.confirm("Delete this post permanently?")) return;
    try {
      await api.deletePost(slug);
      setPosts(posts.filter((p) => p.slug !== slug));
    } catch (error: any) {
      alert(error.response?.data?.detail || "Failed to delete post");
    }
  };

  const handleDeleteUser = async (username: string) => {
    if (username === currentUser?.username) {
      alert("You cannot delete yourself.");
      return;
    }
    if (!window.confirm(`Delete user ${username} and all their data?`)) return;
    try {
      await api.deleteUser(username);
      setUsers(users.filter(u => u.username !== username));
    } catch (error: any) {
      alert(error.response?.data?.detail || "Failed to delete user");
    }
  };

  const handleUpdateRole = async (username: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "reader" : "admin";
    if (!window.confirm(`Change ${username}'s role to ${newRole}?`)) return;
    try {
      const updatedUser = await api.updateUserRole(username, newRole);
      setUsers(users.map(u => u.username === username ? updatedUser : u));
    } catch (error: any) {
      alert(error.response?.data?.detail || "Failed to update role");
    }
  };

  const handleDeleteComment = async (id: string) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await api.deleteComment(id);
      setAllComments(allComments.map(c => 
        c.id === id ? { ...c, is_deleted: true, content: "[Deleted]", username: "[deleted]" } : c
      ));
    } catch (error: any) {
      alert(error.response?.data?.detail || "Failed to delete comment");
    }
  };

  const isScheduled = (post: BlogPost) => {
    if (post.draft) return false;
    if (!post.pubDate) return false;

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const pubDay = new Date(post.pubDate);
      pubDay.setHours(0, 0, 0, 0);

      if (pubDay > today) return true;
      if (pubDay < today) return false;

      if (post.pubTime) {
        const [hours, minutes] = post.pubTime.split(":").map(Number);
        const pubDateTime = new Date(today);
        pubDateTime.setHours(hours, minutes, 0, 0);
        return pubDateTime > new Date();
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  // Group comments by post
  const commentsByPost = allComments.reduce((acc, comment) => {
    if (!acc[comment.post_slug]) {
      acc[comment.post_slug] = [];
    }
    acc[comment.post_slug].push(comment);
    return acc;
  }, {} as Record<string, Comment[]>);

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.slug.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredUsers = users.filter(
    (u) => 
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && (posts.length === 0 && users.length === 0 && allComments.length === 0))
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="animate-spin text-primary w-8 h-8" />
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Administration
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {activeTab === "posts" && "Manage your blog stories and drafts."}
            {activeTab === "users" && "Manage user accounts and permissions."}
            {activeTab === "comments" && "Moderate discussion across all posts."}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
          {/* Tabs */}
          <div className="flex bg-bg-card border border-border-subtle p-1 rounded-xl shadow-inner">
            <button 
              onClick={() => setActiveTab("posts")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "posts" ? "bg-primary text-white shadow-lg" : "text-slate-500 hover:text-slate-300"}`}
            >
              <FileText size={16} />
              Posts
            </button>
            {isAdmin && (
              <>
                <button 
                  onClick={() => setActiveTab("users")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "users" ? "bg-primary text-white shadow-lg" : "text-slate-500 hover:text-slate-300"}`}
                >
                  <Users size={16} />
                  Users
                </button>
                <button 
                  onClick={() => setActiveTab("comments")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "comments" ? "bg-primary text-white shadow-lg" : "text-slate-500 hover:text-slate-300"}`}
                >
                  <MessageSquare size={16} />
                  Comments
                </button>
              </>
            )}
          </div>

          <div className="flex gap-3">
            <div className="relative flex-1 sm:flex-none">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                size={16}
              />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-48 pl-10 pr-4 py-2.5 bg-bg-card border border-border-subtle rounded-xl text-sm focus:border-primary/50 outline-none transition-all shadow-inner"
              />
            </div>
            {activeTab === "posts" && (
              <Link
                to="/admin/new"
                className="flex items-center justify-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-primary/20 font-semibold text-sm"
              >
                <Plus size={18} />
                <span className="hidden sm:inline">New Post</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {loading && <div className="flex justify-center py-10"><RefreshCw className="animate-spin text-primary" /></div>}

      {/* Posts Tab */}
      {activeTab === "posts" && !loading && (
        <div className="bg-bg-card rounded-2xl border border-border-subtle overflow-hidden shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/30 border-b border-border-subtle text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <th className="px-6 py-4">Story Content</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Views</th>
                <th className="px-6 py-4">Author</th>
                <th className="px-6 py-4 text-right pr-8">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {filteredPosts.map((post) => (
                <tr key={post.slug} className="hover:bg-slate-800/20 transition-colors group">
                  <td className="px-6 py-5">
                    <Link to={`/posts/${post.slug}`} target="_blank" className="font-bold text-slate-100 group-hover:text-primary transition-colors">
                      {post.title}
                    </Link>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex gap-2">
                      {post.draft ? (
                        <span className="px-2 py-0.5 text-[10px] font-black bg-slate-800 text-slate-500 rounded-md uppercase tracking-wider border border-border-subtle">Draft</span>
                      ) : isScheduled(post) ? (
                        <span className="px-2 py-0.5 text-[10px] font-black bg-blue-500/10 text-blue-400 rounded-md uppercase tracking-wider border border-blue-500/20">Scheduled</span>
                      ) : (
                        <span className="px-2 py-0.5 text-[10px] font-black bg-green-500/10 text-green-400 rounded-md uppercase tracking-wider border border-green-500/20">Live</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm text-slate-400 font-bold">
                    <div className="flex items-center gap-1.5"><Eye size={14} className="text-slate-500" />{post.views || 0}</div>
                  </td>
                  <td className="px-6 py-5 text-xs text-slate-500 font-bold uppercase tracking-tighter">
                    {post.username}
                  </td>
                  <td className="px-6 py-5 text-right pr-8">
                    <div className="flex justify-end gap-2">
                      <Link to={`/admin/edit/${post.slug}`} className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"><Edit size={16} /></Link>
                      <button onClick={() => handleDeletePost(post.slug)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredPosts.length === 0 && <div className="py-20 text-center text-slate-500"><FileText size={48} className="mx-auto mb-4 opacity-20" /><p>No posts found.</p></div>}
        </div>
      )}

      {/* Users Tab */}
      {activeTab === "users" && isAdmin && !loading && (
        <div className="bg-bg-card rounded-2xl border border-border-subtle overflow-hidden shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/30 border-b border-border-subtle text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4 text-right pr-8">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {filteredUsers.map((u) => (
                <tr key={u.username} className="hover:bg-slate-800/20 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-xs">{u.username[0].toUpperCase()}</div>
                      <span className="font-bold text-slate-100">{u.username}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm text-slate-400">{u.email}</td>
                  <td className="px-6 py-5">
                    <span className={`px-2 py-0.5 text-[10px] font-black rounded-md uppercase tracking-wider border ${u.is_admin ? "bg-primary/10 text-primary border-primary/20" : "bg-slate-800 text-slate-500 border-border-subtle"}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right pr-8">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleUpdateRole(u.username, u.role)} className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all" title="Toggle Admin Role"><Shield size={16} /></button>
                      <button onClick={() => handleDeleteUser(u.username)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Comments Tab */}
      {activeTab === "comments" && isAdmin && !loading && (
        <div className="space-y-4">
          {Object.entries(commentsByPost).map(([slug, comments]) => (
            <div key={slug} className="bg-bg-card rounded-2xl border border-border-subtle overflow-hidden shadow-lg">
              <button 
                onClick={() => setExpandedPosts(prev => ({ ...prev, [slug]: !prev[slug] }))}
                className="w-full px-6 py-4 flex items-center justify-between bg-slate-800/20 hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText size={18} className="text-primary" />
                  <span className="font-bold text-slate-200">{slug}</span>
                  <span className="px-2 py-0.5 bg-slate-800 text-slate-500 text-[10px] font-bold rounded-full">{comments.length} comments</span>
                </div>
                {expandedPosts[slug] ? <ChevronDown size={20} className="text-slate-500" /> : <ChevronRight size={20} className="text-slate-500" />}
              </button>
              
              {expandedPosts[slug] && (
                <div className="divide-y divide-border-subtle border-t border-border-subtle">
                  {comments.map((comment) => (
                    <div key={comment.id} className="p-6 flex justify-between items-start hover:bg-slate-800/10 transition-colors group">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold ${comment.username === '[deleted]' ? 'text-slate-600 italic' : 'text-primary'}`}>{comment.username}</span>
                          <span className="text-slate-600 text-[10px] tracking-widest uppercase">{new Date(comment.created_at).toLocaleString()}</span>
                        </div>
                        <p className={`text-sm leading-relaxed ${comment.is_deleted ? 'text-slate-600 italic' : 'text-slate-300'}`}>
                          {comment.content}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {!comment.is_deleted && (
                          <button 
                            onClick={() => handleDeleteComment(comment.id)}
                            className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          {Object.keys(commentsByPost).length === 0 && <div className="py-20 text-center text-slate-500 border-2 border-dashed border-border-subtle rounded-3xl"><MessageSquare size={48} className="mx-auto mb-4 opacity-20" /><p>No comments to moderate.</p></div>}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
