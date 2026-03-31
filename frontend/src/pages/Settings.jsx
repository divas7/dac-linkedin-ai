import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Save, ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const AVAILABLE_THEMES = [
  'Analytics', 'Technology', 'Entrepreneurship', 
  'Startups', 'Marketing', 'Finance', 'Leadership', 'Design'
];

export default function Settings() {
  const { user, updatePreferences, logout } = useContext(AuthContext);
  const [selected, setSelected] = useState(user?.preferences || ['Technology']);
  const [saving, setSaving] = useState(false);

  const toggleTheme = (theme) => {
    if (selected.includes(theme)) {
      if (selected.length === 1) return; // Must have at least one
      setSelected(selected.filter(t => t !== theme));
    } else {
      setSelected([...selected, theme]);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updatePreferences(selected);
      alert('Preferences saved!');
    } catch(err) {
      alert('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col h-[100dvh]">
      <header className="p-4 flex items-center justify-between sticky top-0 bg-dac-950/80 backdrop-blur-md z-10 border-b border-dac-800">
        <div className="flex items-center space-x-2">
          <Link to="/" className="text-dac-400 hover:text-white"><ArrowLeft size={20}/></Link>
          <h1 className="text-xl font-bold text-white">Settings</h1>
        </div>
      </header>
      
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-white mb-2">Content Themes</h2>
          <p className="text-sm text-dac-400 mb-4">Select the topics you want DAC to generate LinkedIn posts about.</p>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_THEMES.map(theme => (
              <button 
                key={theme}
                onClick={() => toggleTheme(theme)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                  selected.includes(theme) 
                    ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300' 
                    : 'bg-dac-900 border-dac-800 text-dac-300 hover:border-dac-600'
                }`}
              >
                {theme}
              </button>
            ))}
          </div>
        </div>
        
        <div className="pt-6 border-t border-dac-800">
          <p className="text-xs text-dac-500 mb-2">Logged in as {user?.email}</p>
          <button 
            onClick={handleSave} 
            disabled={saving}
            className="w-full flex items-center justify-center space-x-2 py-3 primary-gradient text-white rounded-xl font-bold shadow-lg shadow-indigo-500/25 disabled:opacity-50"
          >
            {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            <span>Save Preferences</span>
          </button>
        </div>
        <button onClick={logout} className="w-full py-3 bg-red-500/20 text-red-400 rounded-xl font-bold shadow-lg hover:bg-red-500/30 transition-colors">
          Logout
        </button>
      </main>
    </div>
  );
}
