import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { authApi } from '../../api/auth.api';
import { saveConfig, getConfig } from '../../api/config';
import { useRequestLog } from '../../hooks/useRequestLog';
import ApiResponseCard from '../../components/ApiResponseCard';
import PageHeader from '../../components/PageHeader';
import { Copy, Check } from 'lucide-react';
import type { LoginRequest, RegisterRequest } from '../../types/auth';

export default function AuthPage() {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [receivedToken, setReceivedToken] = useState('');
  const [copied, setCopied] = useState(false);

  const loginLog = useRequestLog();
  const registerLog = useRequestLog();

  const loginForm = useForm<LoginRequest>({
    defaultValues: { email: '', password: '' },
  });
  const registerForm = useForm<RegisterRequest>({
    defaultValues: { nombre: '', apellido: '', email: '', password: '' },
  });

  const handleLogin = loginForm.handleSubmit(async (data) => {
    const res = await loginLog.execute('POST', '/auth/login', data, () => authApi.login(data));
    if (res?.data?.token || (res as { token?: string })?.token) {
      const token = (res as { token?: string })?.token ?? (res as { data?: { token?: string } })?.data?.token ?? '';
      if (token) {
        setReceivedToken(token);
        saveConfig({ ...getConfig(), token });
        toast.success('Login exitoso — token guardado en configuración');
      }
    }
  });

  const handleRegister = registerForm.handleSubmit(async (data) => {
    await registerLog.execute('POST', '/auth/register', data, () => authApi.register(data));
    toast.success('Registro ejecutado — revisá la respuesta');
  });

  const copyToken = () => {
    navigator.clipboard.writeText(receivedToken);
    setCopied(true);
    toast.success('Token copiado al portapapeles');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <PageHeader title="Autenticación" subtitle="Login y registro de usuarios." badge="2 endpoints" />

      <div className="flex gap-2 mb-6">
        {(['login', 'register'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {t === 'login' ? 'POST /auth/login' : 'POST /auth/register'}
          </button>
        ))}
      </div>

      {tab === 'login' && (
        <div className="max-w-lg">
          <div className="card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="badge-post">POST</span>
                <code className="text-sm font-mono text-slate-700">/auth/login</code>
              </div>
              <button
                onClick={handleLogin}
                disabled={loginLog.loading}
                className="btn-primary"
              >
                {loginLog.loading ? 'Ejecutando…' : 'Ejecutar'}
              </button>
            </div>
            <div className="grid gap-3 pt-2 border-t border-slate-100">
              <div>
                <label className="label">Email</label>
                <input {...loginForm.register('email')} className="input" placeholder="usuario@email.com" />
              </div>
              <div>
                <label className="label">Password</label>
                <input {...loginForm.register('password')} type="password" className="input" placeholder="••••••••" />
              </div>
            </div>
          </div>

          {receivedToken && (
            <div className="card p-4 mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Token recibido</p>
                <button onClick={copyToken} className="btn-secondary flex items-center gap-1.5 text-xs py-1">
                  {copied ? <><Check size={12} /> Copiado</> : <><Copy size={12} /> Copiar</>}
                </button>
              </div>
              <p className="font-mono text-xs text-slate-600 break-all bg-slate-50 rounded p-2">
                {receivedToken}
              </p>
            </div>
          )}

          <ApiResponseCard log={loginLog.log} />
        </div>
      )}

      {tab === 'register' && (
        <div className="max-w-lg">
          <div className="card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="badge-post">POST</span>
                <code className="text-sm font-mono text-slate-700">/auth/register</code>
              </div>
              <button
                onClick={handleRegister}
                disabled={registerLog.loading}
                className="btn-primary"
              >
                {registerLog.loading ? 'Ejecutando…' : 'Ejecutar'}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              <div>
                <label className="label">Nombre</label>
                <input {...registerForm.register('nombre')} className="input" placeholder="Juan" />
              </div>
              <div>
                <label className="label">Apellido</label>
                <input {...registerForm.register('apellido')} className="input" placeholder="Pérez" />
              </div>
              <div className="col-span-2">
                <label className="label">Email</label>
                <input {...registerForm.register('email')} className="input" placeholder="juan@email.com" />
              </div>
              <div className="col-span-2">
                <label className="label">Password</label>
                <input {...registerForm.register('password')} type="password" className="input" placeholder="••••••••" />
              </div>
            </div>
          </div>
          <ApiResponseCard log={registerLog.log} />
        </div>
      )}
    </div>
  );
}
