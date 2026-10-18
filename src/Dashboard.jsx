import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchWithAuth, logout } from './api';
import { Play, LogOut, List } from 'lucide-react';

export default function Dashboard() {
  const [servers, setServers] = useState([]);
  const [source, setSource] = useState('C:\\SyncWardTest\\Source');
  const [target, setTarget] = useState('C:\\SyncWardTest\\Target');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWithAuth('/servers').then(setServers).catch(console.error);
  }, []);

  async function triggerSync() {
    try {
      setLoading(true);
      const job = await fetchWithAuth('/jobs', {
        method: 'POST',
        body: JSON.stringify({
          type: 'sync',
          payload: { source, target, mirror: true }
        })
      });
      // Navigate to the job detail page to watch progress
      navigate(`/jobs/${job.id}`);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="flex items-center justify-between bg-gray-800 p-4">
        <h1 className="text-xl font-bold text-blue-500">SyncWard</h1>
        <div className="flex gap-4">
          <button onClick={() => navigate('/jobs')} className="flex items-center gap-2 hover:text-blue-400">
            <List size={18} /> Jobs History
          </button>
          <button onClick={() => { logout(); navigate('/'); }} className="flex items-center gap-2 text-red-400 hover:text-red-300">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </nav>

      <main className="mx-auto max-w-4xl p-8">
        <h2 className="mb-6 text-2xl font-bold">Trigger Sync</h2>
        
        <div className="mb-8 rounded-lg bg-gray-800 p-6 shadow-lg">
          <div className="mb-4">
            <label className="mb-1 block text-sm text-gray-400">Source Path</label>
            <input
              type="text" value={source} onChange={(e) => setSource(e.target.value)}
              className="w-full rounded bg-gray-700 p-2 text-white"
            />
          </div>
          <div className="mb-4">
            <label className="mb-1 block text-sm text-gray-400">Target Path</label>
            <input
              type="text" value={target} onChange={(e) => setTarget(e.target.value)}
              className="w-full rounded bg-gray-700 p-2 text-white"
            />
          </div>
          <button
            onClick={triggerSync} disabled={loading}
            className="flex items-center gap-2 rounded bg-blue-600 px-4 py-2 font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            <Play size={18} /> {loading ? 'Starting...' : 'Start Sync'}
          </button>
        </div>

        <h2 className="mb-6 text-2xl font-bold">Registered Servers</h2>
        <div className="rounded-lg bg-gray-800 shadow-lg">
          {servers.map(s => (
            <div key={s.id} className="flex items-center justify-between border-b border-gray-700 p-4 last:border-0">
              <div>
                <div className="font-bold">{s.name}</div>
                <div className="text-sm text-gray-400">{s.host}</div>
              </div>
              <div className="text-sm text-gray-500">{s.role}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}