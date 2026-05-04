import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, ShieldCheck, LogOut, Edit2, Save, X, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, logout, isAdmin, updateUser, isLoading, error } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [email, setEmail] = useState(user?.email || '');
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Sync state with user data when it loads or changes
  React.useEffect(() => {
    if (user && !isEditing) {
      setEmail(user.email);
      setFullName(user.full_name || '');
      setBio(user.bio || '');
    }
  }, [user, isEditing]);

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    try {
      await updateUser({
        email,
        full_name: fullName,
        bio,
        ...(password ? { password } : {}),
      });
      setIsEditing(false);
      setPassword('');
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      // Error is handled in AuthContext
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEmail(user.email);
    setFullName(user.full_name || '');
    setBio(user.bio || '');
    setPassword('');
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="bg-bg-card rounded-3xl border border-border-subtle overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Profile Header Background */}
        <div className="h-32 bg-gradient-to-r from-primary/20 to-blue-500/20" />
        
        <div className="px-8 pb-8">
          <div className="relative -mt-12 mb-6 flex justify-between items-end">
            <div className="inline-flex p-1 bg-bg-card rounded-3xl">
              <div className="w-24 h-24 bg-bg-deep rounded-2xl flex items-center justify-center text-primary border border-border-subtle shadow-xl">
                <User size={48} />
              </div>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl font-bold transition-all border border-primary/20"
              >
                <Edit2 size={18} />
                Edit Profile
              </button>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">
                {user.full_name || user.username}
              </h1>
              <p className="text-slate-400 mt-1">@{user.username}</p>
            </div>

            {successMessage && (
              <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-400 text-sm animate-in fade-in duration-300">
                <CheckCircle2 size={18} className="shrink-0" />
                <p>{successMessage}</p>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm animate-in shake duration-300">
                <AlertCircle size={18} className="shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-bg-deep border border-border-subtle rounded-2xl text-sm focus:border-primary/50 outline-none transition-all shadow-inner"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-bg-deep border border-border-subtle rounded-2xl text-sm focus:border-primary/50 outline-none transition-all shadow-inner"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Bio</label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell us about yourself..."
                      rows={4}
                      className="w-full px-4 py-4 bg-bg-deep border border-border-subtle rounded-2xl text-sm focus:border-primary/50 outline-none transition-all shadow-inner resize-none"
                    />
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">New Password (optional)</label>
                    <div className="relative group">
                      <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Leave blank to keep current"
                        className="w-full pl-12 pr-4 py-4 bg-bg-deep border border-border-subtle rounded-2xl text-sm focus:border-primary/50 outline-none transition-all shadow-inner"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center gap-2 py-4 px-6 bg-primary hover:bg-blue-600 text-white rounded-2xl font-bold transition-all shadow-lg shadow-primary/25 disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center gap-2 py-4 px-6 bg-bg-deep hover:bg-slate-800 text-slate-400 rounded-2xl font-bold transition-all border border-border-subtle"
                  >
                    <X size={18} />
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-bg-deep rounded-2xl border border-border-subtle space-y-1">
                    <div className="flex items-center gap-2 text-slate-500 mb-1">
                      <Mail size={16} />
                      <span className="text-xs font-bold uppercase tracking-widest">Email</span>
                    </div>
                    <p className="text-white font-medium">{user.email}</p>
                  </div>

                  <div className="p-4 bg-bg-deep rounded-2xl border border-border-subtle space-y-1">
                    <div className="flex items-center gap-2 text-slate-500 mb-1">
                      {isAdmin ? <ShieldCheck size={16} className="text-primary" /> : <Shield size={16} />}
                      <span className="text-xs font-bold uppercase tracking-widest">Role</span>
                    </div>
                    <p className="text-white font-medium">
                      {isAdmin ? 'Administrator' : 'Community Member'}
                    </p>
                  </div>

                  {user.bio && (
                    <div className="md:col-span-2 p-4 bg-bg-deep rounded-2xl border border-border-subtle space-y-1">
                      <div className="flex items-center gap-2 text-slate-500 mb-1">
                        <Edit2 size={16} />
                        <span className="text-xs font-bold uppercase tracking-widest">Bio</span>
                      </div>
                      <p className="text-slate-300 text-sm leading-relaxed">{user.bio}</p>
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-border-subtle flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={logout}
                    className="flex-1 flex items-center justify-center gap-2 py-4 px-6 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-2xl font-bold transition-all border border-red-500/20"
                  >
                    <LogOut size={18} />
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
