import { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { publicApiClient } from './api/client';
import { marcasApi } from './api/marcas.api';
import { modelosApi } from './api/modelos.api';
import { vehiculosApi } from './api/vehiculos.api';
import { router } from './routes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 1000 * 60 * 5 },
  },
});

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export default function App() {
  const [serverReady, setServerReady] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Verificando conexión con el servidor...');

  useEffect(() => {
    let cancelled = false;
    let retryTimer: number | undefined;

    const waitForServer = async () => {
      try {
        if (cancelled) return;
        setLoadingMessage('Conectando con el servidor...');
        // 1. Healthcheck básico
        await publicApiClient.get('/auth/healthcheck', { timeout: 5000 });
        await delay(250);

        if (cancelled) return;
        setLoadingMessage('Cargando marcas...');
        // 2. Prefetch de Marcas en la cache de React Query
        await queryClient.prefetchQuery({
          queryKey: ['marcas'],
          queryFn: () => marcasApi.listar().then(r => r.data),
        });
        await delay(250);

        if (cancelled) return;
        setLoadingMessage('Cargando modelos...');
        // 3. Prefetch de Modelos en la cache de React Query
        await queryClient.prefetchQuery({
          queryKey: ['modelos'],
          queryFn: () => modelosApi.listar().then(r => r.data),
        });
        await delay(250);

        if (cancelled) return;
        setLoadingMessage('Cargando catálogo de vehículos...');
        // 4. Prefetch de Vehículos Disponibles en la cache de React Query
        await queryClient.prefetchQuery({
          queryKey: ['vehiculos', 'busqueda', { estado: 'DISPONIBLE' }],
          queryFn: () => vehiculosApi.busqueda({ estado: 'DISPONIBLE' }).then(r => r.data),
        });

        if (!cancelled) {
          setServerReady(true);
        }
      } catch {
        if (!cancelled) {
          setLoadingMessage('Despertando la base de datos... Reintentando conexión...');
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
            {loadingMessage}
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
