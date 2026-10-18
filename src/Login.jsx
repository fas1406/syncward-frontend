import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from './api';
import { Server } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('alice');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
      <form onSubmit={handleSubmit} className="w-96 rounded-lg bg-gray-800 p-8 shadow-xl">
        <div className="mb-6 flex items-center justify-center gap-2">
          <Server className="text-blue-500" size={32} />
          <h1 className="text-2xl font-bold">SyncWard</h1>
        </div>
        
        {error && <div className="mb-4 text-red-400 text-sm">{error}</div>}
        
        <div className="mb-4">
          <label className="mb-1 block text-sm text-gray-400">Username</label>
          <input
            type="text" value={username} onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded bg-gray-700 p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="mb-6">
          <label className="mb-1 block text-sm text-gray-400">Password</label>
          <input
            type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded bg-gray-700 p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <button type="submit" className="w-full rounded bg-blue-600 p-2 font-semibold hover:bg-blue-700">
          Sign In
        </button>
      </form>
    </div>
  );
}