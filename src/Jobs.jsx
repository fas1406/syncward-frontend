import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchWithAuth } from './api';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchWithAuth('/jobs').then(setJobs).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 p-8 text-white">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Job History</h1>
          <Link to="/dashboard" className="text-blue-400 hover:text-blue-300">← Dashboard</Link>
        </div>
        
        <div className="rounded-lg bg-gray-800">
          {jobs.map(job => (
            <Link key={job.id} to={`/jobs/${job.id}`} className="flex items-center justify-between border-b border-gray-700 p-4 last:border-0 hover:bg-gray-750">
              <div>
                <span className="font-mono text-gray-400 mr-4">#{job.id}</span>
                <span className="font-bold">{job.type}</span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-400">{new Date(job.created_at).toLocaleString()}</span>
                <span className={`font-semibold ${job.status === 'succeeded' ? 'text-green-400' : job.status === 'failed' ? 'text-red-400' : 'text-blue-400'}`}>
                  {job.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}