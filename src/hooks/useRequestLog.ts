import { useState } from 'react';
import type { RequestLog } from '../types/common';

export function useRequestLog() {
  const [log, setLog] = useState<RequestLog | null>(null);
  const [loading, setLoading] = useState(false);

  async function execute<T>(
    method: string,
    url: string,
    payload: unknown,
    fn: () => Promise<{ data: T; status: number }>
  ): Promise<T | null> {
    setLoading(true);
    const start = Date.now();
    try {
      const res = await fn();
      setLog({
        method, url, payload,
        response: res.data,
        status: res.status,
        duration: Date.now() - start,
      });
      return res.data;
    } catch (err: unknown) {
      const e = err as { response?: { status: number; data: unknown }; message: string };
      setLog({
        method, url, payload,
        status: e.response?.status,
        response: e.response?.data,
        error: e.message,
        duration: Date.now() - start,
      });
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { log, loading, execute };
}
