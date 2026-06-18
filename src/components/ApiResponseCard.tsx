import JsonViewer from './JsonViewer';
import type { RequestLog } from '../types/common';
import { Clock, AlertCircle } from 'lucide-react';

interface Props { log: RequestLog | null; }

const methodBadge: Record<string, string> = {
  GET: 'badge-get', POST: 'badge-post',
  PUT: 'badge-put', PATCH: 'badge-patch', DELETE: 'badge-delete',
};

export default function ApiResponseCard({ log }: Props) {
  if (!log) return null;

  const isError = !log.status || log.status >= 400 || !!log.error;
  const statusColor = isError ? 'text-red-600' : 'text-emerald-600';

  return (
    <div className="card p-4 space-y-4 mt-4">
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <span className={methodBadge[log.method] ?? 'badge-get'}>{log.method}</span>
        <span className="text-slate-500 font-mono text-xs truncate max-w-xs">{log.url}</span>
        {log.status && (
          <span className={`font-bold font-mono ${statusColor}`}>{log.status}</span>
        )}
        {log.duration !== undefined && (
          <span className="text-slate-400 flex items-center gap-1 text-xs ml-auto">
            <Clock size={12} /> {log.duration}ms
          </span>
        )}
      </div>

      {log.error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
          <AlertCircle size={14} />
          {String(log.error)}
        </div>
      )}

      {Boolean(log.payload) && (
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Request Payload</p>
          <JsonViewer data={log.payload as Record<string, unknown>} maxHeight="150px" />
        </div>
      )}

      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Response</p>
        <JsonViewer data={log.response ?? String(log.error ?? 'Sin respuesta')} />
      </div>
    </div>
  );
}
