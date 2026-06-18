import React from 'react';
import ApiResponseCard from './ApiResponseCard';
import type { RequestLog } from '../types/common';
import { Loader2 } from 'lucide-react';

interface Props {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  description?: string;
  log: RequestLog | null;
  loading: boolean;
  onExecute: () => void;
  children?: React.ReactNode;
}

const methodColors: Record<string, string> = {
  GET: 'badge-get', POST: 'badge-post',
  PUT: 'badge-put', PATCH: 'badge-patch', DELETE: 'badge-delete',
};

export default function EndpointSection({
  method, path, description, log, loading, onExecute, children,
}: Props) {
  return (
    <div className="card p-5 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={methodColors[method]}>{method}</span>
            <code className="text-sm text-slate-700 font-mono">{path}</code>
          </div>
          {description && <p className="text-xs text-slate-500">{description}</p>}
        </div>
        <button
          onClick={onExecute}
          disabled={loading}
          className="btn-primary shrink-0 flex items-center gap-2"
        >
          {loading ? <><Loader2 size={14} className="animate-spin" /> Ejecutando…</> : 'Ejecutar'}
        </button>
      </div>

      {children && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
          {children}
        </div>
      )}

      <ApiResponseCard log={log} />
    </div>
  );
}
