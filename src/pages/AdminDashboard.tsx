import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import { BlogPost } from "../types";
import {
  Edit,
  Trash2,
  Plus,
  RefreshCw,
  Search,
  FileText,
  Eye,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const AdminDashboard: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { logout } = useAuth();

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await api.getPosts(true, true);
      setPosts(data);
    } catch (error: any) {
      if (error.response?.status === 401) logout();
      console.error("Failed to fetch posts", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (slug: string) => {
    if (!window.confirm("Delete this post permanently?")) return;
    try {
      await api.deletePost(slug);
      setPosts(posts.filter((p) => p.slug !== slug));
    } catch (error: any) {
      alert("Failed to delete post");
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

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.slug.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="animate-spin text-primary w-8 h-8" />
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Dashboard
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage your blog stories and drafts.
          </p>
        </div>
        <div className="flex w-full sm:w-auto gap-3">
          <div className="relative flex-1 sm:flex-none">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              size={16}
            />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-bg-card border border-border-subtle rounded-xl text-sm focus:border-primary/50 outline-none transition-all shadow-inner"
            />
          </div>
          <Link
            to="/admin/new"
            className="flex items-center justify-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-primary/20 font-semibold text-sm"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Create New</span>
          </Link>
        </div>
      </div>

      <div className="bg-bg-card rounded-2xl border border-border-subtle overflow-x-auto shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/30 border-b border-border-subtle text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <th className="px-6 py-4">Story Content</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Views</th>
              <th className="px-6 py-4">Published</th>
              <th className="px-6 py-4 text-right pr-8">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {filteredPosts.map((post) => (
              <tr
                key={post.slug}
                className="hover:bg-slate-800/20 transition-colors group"
              >
                <td className="px-6 py-5">
                  <Link
                    to={`/posts/${post.slug}`}
                    target="_blank"
                    className="text-slate-600 hover:text-slate-400 transition-colors"
                  >
                    <div className="font-bold text-slate-100 group-hover:text-primary transition-colors flex items-center gap-1.5">
                      {post.title}
                    </div>
                  </Link>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-wrap gap-2">
                    {post.draft ? (
                      <span className="px-2 py-0.5 text-[10px] font-black bg-slate-800 text-slate-500 rounded-md uppercase tracking-wider border border-border-subtle">
                        Draft
                      </span>
                    ) : isScheduled(post) ? (
                      <span className="px-2 py-0.5 text-[10px] font-black bg-blue-500/10 text-blue-400 rounded-md uppercase tracking-wider border border-blue-500/20">
                        Scheduled
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-[10px] font-black bg-green-500/10 text-green-400 rounded-md uppercase tracking-wider border border-green-500/20">
                        Live
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-5 text-sm text-slate-400 font-bold">
                  <div className="flex items-center gap-1.5">
                    <Eye size={14} className="text-slate-500" />
                    {post.views || 0}
                  </div>
                </td>
                <td className="px-6 py-5 text-sm text-slate-400 font-medium whitespace-nowrap">
                  {post.pubDate
                    ? `${new Date(post.pubDate).toLocaleDateString()} ${post.pubTime || ""}`
                    : "N/A"}
                </td>
                <td className="px-6 py-5 text-right pr-8">
                  <div className="flex justify-end gap-3">
                    <Link
                      to={`/admin/edit/${post.slug}`}
                      className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                    >
                      <Edit size={18} />
                    </Link>
                    <button
                      onClick={() => handleDelete(post.slug)}
                      className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredPosts.length === 0 && (
          <div className="py-20 text-center text-slate-500">
            <FileText size={48} className="mx-auto mb-4 opacity-20" />
            <p>No posts found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
