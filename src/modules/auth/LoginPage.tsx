import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authApi } from '../../api/auth.api';
import { useAuthStore } from '../../store/authStore';
import { toast } from 'sonner';
import { useState } from 'react';
import { Car, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<{ email: string; password: string }>();
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/';

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    try {
      const res = await authApi.login(data);
      const payload = res.data;
      const token = payload?.token ?? payload?.accessToken ?? payload;
      if (!token) throw new Error('Sin token');
      login(token, { email: data.email });
      toast.success('Bienvenido');
      const stored = useAuthStore.getState().user;
      if (stored?.rol === 'ADMIN' || stored?.rol === 'VENDEDOR') {
        navigate('/admin', { replace: true });
      } else {
        navigate(from !== '/login' ? from : '/', { replace: true });
      }
    } catch {
      toast.error('Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  });

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-[#c9a84c]/20 to-transparent" />
        <div className="relative text-center px-12">
          <div className="w-16 h-16 bg-[#c9a84c] rounded-xl flex items-center justify-center mx-auto mb-6">
            <Car size={28} className="text-[#0f0f0f]" />
          </div>
          <h2 className="font-display font-bold text-4xl text-white mb-4">AutoElite</h2>
          <p className="text-white/40 font-body text-lg">Tu concesionaria premium de confianza</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#f8f8f8]">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="font-display font-bold text-2xl text-[#0f0f0f]">Iniciar sesión</h1>
            <p className="text-slate-500 text-sm mt-1">Accedé a tu cuenta</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="label-field">Email</label>
              <input
                {...register('email', { required: 'Requerido' })}
                type="email"
                placeholder="tu@email.com"
                className="input-field"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="label-field">Contraseña</label>
              <div className="relative">
                <input
                  {...register('password', { required: 'Requerido' })}
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="input-field pr-10"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-gold w-full mt-2">
              {loading ? 'Ingresando…' : 'Ingresar'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            ¿No tenés cuenta?{' '}
            <Link to="/registro" className="text-[#c9a84c] font-semibold hover:underline">Registrate</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
