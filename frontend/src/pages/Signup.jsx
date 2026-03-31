import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(email, password);
      // Immediately redirect to main feed upon signup 
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="w-[22rem] max-w-[90vw] glass-card p-8 flex flex-col space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text primary-gradient">DAC</h1>
        <p className="text-sm text-dac-300 mt-2">Create Account</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">{error}</div>}
        <input 
          type="email" 
          placeholder="Email address"
          className="w-full p-3 bg-dac-800/50 border border-dac-700 rounded-lg focus:outline-none focus:border-dac-500 transition-colors"
          value={email} onChange={e => setEmail(e.target.value)} required 
        />
        <input 
          type="password" 
          placeholder="Password"
          className="w-full p-3 bg-dac-800/50 border border-dac-700 rounded-lg focus:outline-none focus:border-dac-500 transition-colors"
          value={password} onChange={e => setPassword(e.target.value)} required 
        />
        <button className="w-full p-3 primary-gradient text-white rounded-lg font-semibold shadow-lg shadow-indigo-500/20 hover:opacity-90 transition-opacity">
          Sign Up
        </button>
      </form>
      <p className="text-center text-dac-300 text-sm">
        Already have an account? <Link to="/login" className="text-indigo-400 hover:text-indigo-300">Sign In</Link>
      </p>
    </div>
  );
}
