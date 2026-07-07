import { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { publicApiClient } from './api/client';
import { router } from './routes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 1000 * 60 * 5 },
  },
});

export default function App() {
  const [serverReady, setServerReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let retryTimer: number | undefined;

    const waitForServer = async () => {
      try {
        await publicApiClient.get('/auth/healthcheck', { timeout: 5000 });
        if (!cancelled) {
          setServerReady(true);
        }
      } catch {
        if (!cancelled) {
          retryTimer = window.setTimeout(waitForServer, 2000);
        }
      }
    };

    void waitForServer();

    return () => {
      cancelled = true;
      if (retryTimer) {
        window.clearTimeout(retryTimer);
      }
    };
  }, []);

  if (!serverReady) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="mx-auto mb-6 h-16 w-16 rounded-full border border-white/15 border-t-[#c9a84c] animate-spin" />
          <p className="font-display text-3xl font-bold tracking-tight">Levantando el servidor</p>
          <p className="mt-3 text-sm text-white/55 leading-relaxed">
            Estamos despertando la API. Esta pantalla se actualiza sola cada 2 segundos hasta que el servidor responda.
          </p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster richColors position="top-right" closeButton />
    </QueryClientProvider>
  );
}
