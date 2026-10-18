import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchWithAuth } from './api';
import { ArrowLeft, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export default function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [liveStatus, setLiveStatus] = useState('queued');

  // 1. Fetch initial state
  useEffect(() => {
    fetchWithAuth(`/jobs/${id}`).then(data => {
      setJob(data);
      setLiveStatus(data.status);
    }).catch(console.error);
  }, [id]);

  // 2. Connect WebSocket for live updates
  useEffect(() => {
    const token = localStorage.getItem('token');
    const ws = new WebSocket(`ws://localhost:3000/ws?token=${token}`);

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      // Only update if it's OUR job
      if (msg.eventType === 'job.status' && msg.data.jobId === Number(id)) {
        setLiveStatus(msg.data.status);
        // Refetch full details to get the result/errors
        fetchWithAuth(`/jobs/${id}`).then(setJob).catch(console.error);
      }
    };

    return () => ws.close();
  }, [id]);

  if (!job) return <div className="p-8 text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800 p-4">
        <Link to="/dashboard" className="flex items-center gap-2 text-blue-400 hover:text-blue-300">
          <ArrowLeft size={18} /> Back to Dashboard
        </Link>
      </nav>

      <main className="mx-auto max-w-3xl p-8">
        <div className="rounded-lg bg-gray-800 p-6 shadow-xl">
          <div className="mb-6 flex items-center justify-between border-b border-gray-700 pb-4">
            <h1 className="text-2xl font-bold">Job #{job.id}</h1>
            <StatusBadge status={liveStatus} />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Type:</span> {job.type}
            </div>
            <div>
              <span className="text-gray-400">Created:</span> {new Date(job.created_at).toLocaleString()}
            </div>
            <div className="col-span-2">
              <span className="text-gray-400">Payload:</span>
              <pre className="mt-1 rounded bg-gray-900 p-2 text-xs text-green-400">
                {JSON.stringify(job.payload, null, 2)}
              </pre>
            </div>
            
            {job.status === 'succeeded' && (
              <div className="col-span-2 mt-4">
                <span className="text-gray-400">Result:</span>
                <pre className="mt-1 rounded bg-gray-900 p-2 text-xs text-blue-400">
                  {JSON.stringify(job.result, null, 2)}
                </pre>
              </div>
            )}

            {job.status === 'failed' && (
              <div className="col-span-2 mt-4">
                <span className="text-red-400">Error:</span>
                <pre className="mt-1 rounded bg-red-900/20 p-2 text-xs text-red-400">
                  {job.error}
                </pre>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function StatusBadge({ status }) {
  if (status === 'succeeded') return <span className="flex items-center gap-1 text-green-400"><CheckCircle2 size={18} /> Succeeded</span>;
  if (status === 'failed') return <span className="flex items-center gap-1 text-red-400"><XCircle size={18} /> Failed</span>;
  if (status === 'running') return <span className="flex items-center gap-1 text-blue-400"><Loader2 size={18} className="animate-spin" /> Running</span>;
  return <span className="flex items-center gap-1 text-gray-400">Queued</span>;
}