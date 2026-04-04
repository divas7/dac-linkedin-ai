import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { api } from '../api';
import { Copy, Plus, Loader2, Settings as SettingsIcon, Check, X, Download, ExternalLink, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

// ── LinkedIn Preview Modal ────────────────────────────────────────────────────
function LinkedInPreview({ post, user, onClose }) {
  const imageUrl = post.imagePrompt
    ? `https://image.pollinations.ai/prompt/${encodeURIComponent(post.imagePrompt + ' professional linkedin digital art')}&width=1200&height=627&seed=${post.id?.slice(0, 8) || 42}&nologo=true&model=flux`
    : null;

  const handleDownloadImage = () => {
    if (!imageUrl) return;
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `dac-post-${Date.now()}.jpg`;
    a.target = '_blank';
    a.click();
  };

  const handlePostToLinkedIn = () => {
    const text = `${post.hook}\n\n${post.content}`;
    window.open(`https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-lg bg-white rounded-2xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="font-bold text-gray-800 text-sm">LinkedIn Post Preview</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        {/* LinkedIn Post Card UI */}
        <div className="p-4">
          {/* Profile Row */}
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              {(user?.name || user?.email || 'U')[0].toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">{user?.name || user?.email}</p>
              <p className="text-xs text-gray-500">DAC · Just now · 🌐</p>
            </div>
          </div>

          {/* Post Text */}
          <div className="text-gray-800 text-sm leading-relaxed mb-3 whitespace-pre-wrap">
            <span className="font-semibold">{post.hook}</span>
            {'\n\n'}
            {post.content}
          </div>

          {/* Image */}
          {imageUrl && (
            <div className="w-full rounded-lg overflow-hidden border border-gray-200 mb-3">
              <img src={imageUrl} alt="Post visual" className="w-full h-auto object-cover" />
              <div className="p-2 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                <p className="text-xs text-gray-500 truncate">AI-generated image for this post</p>
                <button
                  onClick={handleDownloadImage}
                  className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-700 font-medium ml-2 flex-shrink-0"
                >
                  <Download size={12} />
                  <span>Download</span>
                </button>
              </div>
            </div>
          )}

          {/* LinkedIn Reactions Row */}
          <div className="flex items-center space-x-4 pt-2 border-t border-gray-100 text-gray-500 text-xs">
            <span>👍 Like</span>
            <span>💬 Comment</span>
            <span>🔁 Repost</span>
            <span>📤 Send</span>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-2">
          {imageUrl && (
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              💡 <strong>Tip:</strong> LinkedIn doesn't allow auto-uploading images from web apps. Download the image above, then attach it manually after clicking "Post to LinkedIn".
            </p>
          )}
          <div className="flex space-x-2">
            {imageUrl && (
              <button
                onClick={handleDownloadImage}
                className="flex-1 flex items-center justify-center space-x-2 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-semibold text-sm transition-colors"
              >
                <Download size={16} />
                <span>Download Image</span>
              </button>
            )}
            <button
              onClick={handlePostToLinkedIn}
              className="flex-1 flex items-center justify-center space-x-2 py-3 bg-[#0a66c2] hover:bg-[#004182] text-white rounded-xl font-semibold text-sm transition-colors"
            >
              <ExternalLink size={16} />
              <span>Post to LinkedIn</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Feed Component ───────────────────────────────────────────────────────
export default function Feed() {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [previewPost, setPreviewPost] = useState(null);

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async () => {
    try {
      const data = await api.get('/posts');
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (generating) return;
    setGenerating(true);
    const themes = user?.preferences?.length ? user.preferences : ['Technology', 'Startups', 'Leadership'];
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];
    try {
      const newPost = await api.post('/posts/generate', { theme: randomTheme });
      setPosts([newPost, ...posts]);
    } catch (err) {
      alert(err.message || 'Failed to generate post. Check backend logs.');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getImageUrl = (post) => {
    if (!post.imagePrompt) return null;
    return `https://image.pollinations.ai/prompt/${encodeURIComponent(post.imagePrompt + ' professional linkedin digital art')}&width=800&height=400&seed=${post.id?.slice(0, 8) || 42}&nologo=true&model=flux`;
  };

  return (
    <>
      {previewPost && (
        <LinkedInPreview post={previewPost} user={user} onClose={() => setPreviewPost(null)} />
      )}

      <div className="w-full max-w-md mx-auto flex flex-col h-[100dvh]">
        {/* Header */}
        <header className="p-4 flex items-center justify-between sticky top-0 bg-dac-950/80 backdrop-blur-md z-10 border-b border-dac-800">
          <h1 className="text-xl font-bold text-transparent bg-clip-text primary-gradient">DAC</h1>
          <Link to="/settings" className="text-dac-400 hover:text-white transition-colors">
            <SettingsIcon size={20} />
          </Link>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 flex flex-col space-y-4">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="animate-spin text-dac-500" size={32} />
            </div>
          ) : posts.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 px-4">
              <div className="w-16 h-16 rounded-full bg-dac-800 flex items-center justify-center text-dac-400">
                <Plus size={32} />
              </div>
              <h2 className="text-lg font-semibold text-white">No Posts Yet</h2>
              <p className="text-sm text-dac-400">Generate your first AI content piece to engage your audience today.</p>
            </div>
          ) : (
            posts.map(post => {
              const imageUrl = getImageUrl(post);
              return (
                <article key={post.id} className="glass-card p-5 group cursor-pointer" onClick={() => setPreviewPost(post)}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded-full">{post.theme}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-dac-500">{new Date(post.createdAt).toLocaleDateString()}</span>
                      <span className="text-xs text-dac-500 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Eye size={12} />
                        <span>Preview</span>
                      </span>
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-white leading-tight">{post.hook}</h3>
                  <p className="text-sm text-dac-200 whitespace-pre-wrap leading-relaxed line-clamp-3">{post.content}</p>

                  {/* Image */}
                  {imageUrl && (
                    <div className="w-full mt-4 rounded-xl overflow-hidden border border-dac-700/50 shadow-inner bg-dac-800/40 min-h-[140px] flex items-center justify-center">
                      <img
                        src={imageUrl}
                        alt="AI Generated"
                        className="w-full h-auto object-cover"
                        loading="lazy"
                        onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.style.display = 'none'; }}
                      />
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-4 pt-4 border-t border-dac-800 flex justify-between items-center" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => setPreviewPost(post)}
                      className="flex items-center space-x-1.5 text-sm font-medium px-3 py-2 rounded-lg bg-dac-800 hover:bg-dac-700 transition-colors text-dac-300"
                    >
                      <Eye size={15} />
                      <span>Preview</span>
                    </button>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleCopy(post.id, `${post.hook}\n\n${post.content}`)}
                        className="flex items-center space-x-1.5 text-sm font-medium px-3 py-2 rounded-lg bg-dac-800 hover:bg-dac-700 transition-colors"
                      >
                        {copiedId === post.id ? <Check size={15} className="text-green-400" /> : <Copy size={15} className="text-dac-300" />}
                        <span>{copiedId === post.id ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </main>

        {/* FAB */}
        <div className="p-4 bg-gradient-to-t from-dac-950 to-transparent pb-8 shrink-0">
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="w-full flex items-center justify-center space-x-2 py-4 primary-gradient text-white rounded-xl font-bold shadow-lg shadow-indigo-500/25 disabled:opacity-50 transition-opacity"
          >
            {generating ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
            <span>{generating ? 'Summoning AI...' : 'Generate Daily Post'}</span>
          </button>
        </div>
      </div>
    </>
  );
}
