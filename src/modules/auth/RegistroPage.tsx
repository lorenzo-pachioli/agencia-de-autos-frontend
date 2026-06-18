import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../api/auth.api';
import { useAuthStore } from '../../store/authStore';
import { toast } from 'sonner';
import { useState } from 'react';
import { Car } from 'lucide-react';

interface RegisterForm { nombre: string; apellido: string; email: string; password: string; }

export default function RegistroPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>();
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    try {
      const res = await authApi.register(data);
      const payload = res.data;
      const token = payload?.token ?? payload?.accessToken;
      if (token) { login(token, { email: data.email, nombre: data.nombre, apellido: data.apellido }); }
      toast.success('¡Cuenta creada! Bienvenido/a');
      navigate('/');
    } catch {
      toast.error('Error al registrarse. El email puede estar en uso.');
    } finally {
      setLoading(false);
    }
  });

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex">
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-[#c9a84c]/20 to-transparent" />
        <div className="relative text-center px-12">
          <div className="w-16 h-16 bg-[#c9a84c] rounded-xl flex items-center justify-center mx-auto mb-6">
            <Car size={28} className="text-[#0f0f0f]" />
          </div>
          <h2 className="font-display font-bold text-4xl text-white mb-4">AutoElite</h2>
          <p className="text-white/40 text-lg">Creá tu cuenta y accedé a nuestro catálogo completo</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#f8f8f8]">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="font-display font-bold text-2xl text-[#0f0f0f]">Crear cuenta</h1>
            <p className="text-slate-500 text-sm mt-1">Es gratis y solo lleva un minuto</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label-field">Nombre</label>
                <input {...register('nombre', { required: 'Requerido' })} placeholder="Juan" className="input-field" />
                {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>}
              </div>
              <div>
                <label className="label-field">Apellido</label>
                <input {...register('apellido', { required: 'Requerido' })} placeholder="Pérez" className="input-field" />
                {errors.apellido && <p className="text-red-500 text-xs mt-1">{errors.apellido.message}</p>}
              </div>
            </div>

            <div>
              <label className="label-field">Email</label>
              <input {...register('email', { required: 'Requerido' })} type="email" placeholder="juan@email.com" className="input-field" />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="label-field">Contraseña</label>
              <input {...register('password', { required: 'Requerido', minLength: { value: 6, message: 'Mínimo 6 caracteres' } })}
                type="password" placeholder="••••••••" className="input-field" />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-gold w-full mt-2">
              {loading ? 'Creando cuenta…' : 'Crear cuenta'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            ¿Ya tenés cuenta?{' '}
            <Link to="/login" className="text-[#c9a84c] font-semibold hover:underline">Iniciá sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
