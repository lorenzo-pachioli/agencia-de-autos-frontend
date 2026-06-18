import { useForm } from 'react-hook-form';
import { useAuthStore } from '../../store/authStore';
import { usuariosApi } from '../../api/usuarios.api';
import { toast } from 'sonner';
import { useState } from 'react';
import { User } from 'lucide-react';

export default function MiCuentaPage() {
  const { user, updateUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm({
    defaultValues: { nombre: user?.nombre ?? '', apellido: user?.apellido ?? '', email: user?.email ?? '' },
  });

  const onSubmit = handleSubmit(async (data) => {
    if (!user?.id) return toast.error('No se pudo identificar tu cuenta');
    setLoading(true);
    try {
      await usuariosApi.actualizar(user.id, data);
      updateUser(data);
      toast.success('Perfil actualizado');
    } catch {
      toast.error('Error al actualizar');
    } finally { setLoading(false); }
  });

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <div className="mb-8 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-[#c9a84c] flex items-center justify-center">
          <User size={24} className="text-[#0f0f0f]" />
        </div>
        <div>
          <h1 className="font-display font-bold text-2xl">{user?.nombre} {user?.apellido}</h1>
          <p className="text-slate-500 text-sm capitalize">{user?.rol?.toLowerCase()} · {user?.email}</p>
        </div>
      </div>

      <div className="bg-white border border-[#e8e8e8] rounded-sm p-8">
        <h2 className="font-display font-bold text-lg mb-6">Datos personales</h2>
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-field">Nombre</label>
              <input {...register('nombre')} className="input-field" />
            </div>
            <div>
              <label className="label-field">Apellido</label>
              <input {...register('apellido')} className="input-field" />
            </div>
          </div>
          <div>
            <label className="label-field">Email</label>
            <input {...register('email')} type="email" className="input-field" />
          </div>
          <div className="pt-2">
            <button type="submit" disabled={loading} className="btn-gold">
              {loading ? 'Guardando…' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
