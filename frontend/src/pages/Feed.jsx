import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { api } from '../api';
import { Copy, Plus, Loader2, Settings as SettingsIcon, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Feed() {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

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
    // Picks a random theme from preferences or defaults
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

  return (
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
          posts.map(post => (
            <article key={post.id} className="glass-card p-5 group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded-full">
                  {post.theme}
                </span>
                <span className="text-xs text-dac-500">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h3 className="font-bold text-lg mb-2 text-white leading-tight">{post.hook}</h3>
              <p className="text-sm text-dac-200 whitespace-pre-wrap leading-relaxed">{post.content}</p>
              
              {post.imagePrompt && (
                <div className="w-full mt-4 rounded-xl overflow-hidden border border-dac-700/50 shadow-inner">
                  <img 
                    src={`https://image.pollinations.ai/prompt/${encodeURIComponent(post.imagePrompt)}?width=800&height=800&nologo=true`} 
                    alt="AI Generated Context" 
                    className="w-full h-auto object-cover max-h-64"
                    loading="lazy"
                  />
                </div>
              )}
              
              {/* Actions */}
              <div className="mt-4 pt-4 border-t border-dac-800 flex justify-end space-x-3">
                <button 
                  onClick={() => window.open(`https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(post.hook + '\\n\\n' + post.content)}`, '_blank')}
                  className="flex items-center space-x-2 text-sm font-medium px-4 py-2 rounded-lg bg-[#0a66c2]/20 text-blue-400 hover:bg-[#0a66c2]/30 transition-colors"
                >
                  <span>Post to LinkedIn</span>
                </button>
                <button 
                  onClick={() => handleCopy(post.id, `${post.hook}\\n\\n${post.content}`)}
                  className="flex items-center space-x-2 text-sm font-medium px-4 py-2 rounded-lg bg-dac-800 hover:bg-dac-700 transition-colors"
                >
                  {copiedId === post.id ? <Check size={16} className="text-green-400"/> : <Copy size={16} className="text-dac-300"/>}
                  <span>{copiedId === post.id ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </article>
          ))
        )}
      </main>

      {/* FAB (Floating Action Button) */}
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
  );
}
