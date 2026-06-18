import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { usuariosApi } from '../../api/usuarios.api';
import { useRequestLog } from '../../hooks/useRequestLog';
import ApiResponseCard from '../../components/ApiResponseCard';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import type { Usuario } from '../../types/usuario';
import { Loader2 } from 'lucide-react';

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const listarLog = useRequestLog();
  const obtenerLog = useRequestLog();
  const actualizarLog = useRequestLog();
  const bajaLog = useRequestLog();
  const vendedorLog = useRequestLog();

  const obtenerForm = useForm<{ id: number }>({ defaultValues: { id: 0 } });
  const actualizarForm = useForm({ defaultValues: { id: 0, nombre: '', apellido: '', email: '' } });
  const bajaForm = useForm<{ id: number }>({ defaultValues: { id: 0 } });
  const vendedorForm = useForm({ defaultValues: { nombre: '', apellido: '', email: '', password: '' } });

  const handleListar = async () => {
    const res = await listarLog.execute('GET', '/usuarios', undefined, () => usuariosApi.listar());
    if (Array.isArray(res)) setUsuarios(res);
    else if (res && Array.isArray((res as { content?: Usuario[] }).content)) setUsuarios((res as { content: Usuario[] }).content);
  };

  const handleObtener = obtenerForm.handleSubmit(async ({ id }) => {
    await obtenerLog.execute('GET', `/usuarios/${id}`, undefined, () => usuariosApi.obtener(id));
  });

  const handleActualizar = actualizarForm.handleSubmit(async ({ id, ...data }) => {
    const payload = Object.fromEntries(Object.entries(data).filter(([, v]) => v !== ''));
    await actualizarLog.execute('PUT', `/usuarios/${id}`, payload, () => usuariosApi.actualizar(id, payload));
    toast.success('Usuario actualizado');
  });

  const handleBaja = bajaForm.handleSubmit(async ({ id }) => {
    await bajaLog.execute('PATCH', `/usuarios/${id}`, undefined, () => usuariosApi.darBaja(id));
    toast.success('Usuario dado de baja');
  });

  const handleVendedor = vendedorForm.handleSubmit(async (data) => {
    await vendedorLog.execute('POST', '/usuarios/vendedores', data, () => usuariosApi.crearVendedor(data));
    toast.success('Vendedor creado');
  });

  return (
    <div>
      <PageHeader title="Usuarios" subtitle="Gestión de usuarios del sistema." badge="5 endpoints" />

      <div className="space-y-4 max-w-2xl">
        {/* Listar */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="badge-get">GET</span>
              <code className="text-sm font-mono text-slate-700">/usuarios</code>
            </div>
            <button onClick={handleListar} disabled={listarLog.loading} className="btn-primary flex items-center gap-2">
              {listarLog.loading && <Loader2 size={14} className="animate-spin" />} Ejecutar
            </button>
          </div>
          {usuarios.length > 0 && (
            <DataTable
              columns={[
                { key: 'id', label: 'ID' },
                { key: 'nombre', label: 'Nombre' },
                { key: 'apellido', label: 'Apellido' },
                { key: 'email', label: 'Email' },
                { key: 'rol', label: 'Rol' },
                { key: 'activo', label: 'Activo', render: r => (r.activo ? '✅' : '❌') },
              ]}
              data={usuarios as unknown as Record<string, unknown>[]}
            />
          )}
          <ApiResponseCard log={listarLog.log} />
        </div>

        {/* Obtener por ID */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="badge-get">GET</span>
              <code className="text-sm font-mono text-slate-700">/usuarios/{'{id}'}</code>
            </div>
            <button onClick={handleObtener} disabled={obtenerLog.loading} className="btn-primary flex items-center gap-2">
              {obtenerLog.loading && <Loader2 size={14} className="animate-spin" />} Ejecutar
            </button>
          </div>
          <div className="border-t border-slate-100 pt-3">
            <label className="label">ID</label>
            <input {...obtenerForm.register('id', { valueAsNumber: true })} type="number" className="input max-w-xs" placeholder="1" />
          </div>
          <ApiResponseCard log={obtenerLog.log} />
        </div>

        {/* Actualizar */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="badge-put">PUT</span>
              <code className="text-sm font-mono text-slate-700">/usuarios/{'{id}'}</code>
            </div>
            <button onClick={handleActualizar} disabled={actualizarLog.loading} className="btn-primary flex items-center gap-2">
              {actualizarLog.loading && <Loader2 size={14} className="animate-spin" />} Ejecutar
            </button>
          </div>
          <div className="border-t border-slate-100 pt-3 grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="label">ID</label>
              <input {...actualizarForm.register('id', { valueAsNumber: true })} type="number" className="input" placeholder="1" />
            </div>
            <div>
              <label className="label">Nombre</label>
              <input {...actualizarForm.register('nombre')} className="input" placeholder="Juan" />
            </div>
            <div>
              <label className="label">Apellido</label>
              <input {...actualizarForm.register('apellido')} className="input" placeholder="Pérez" />
            </div>
            <div className="col-span-2">
              <label className="label">Email</label>
              <input {...actualizarForm.register('email')} className="input" placeholder="juan@email.com" />
            </div>
          </div>
          <ApiResponseCard log={actualizarLog.log} />
        </div>

        {/* Dar de baja */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="badge-patch">PATCH</span>
              <code className="text-sm font-mono text-slate-700">/usuarios/{'{id}'}</code>
              <span className="text-xs text-slate-400">— Dar de baja</span>
            </div>
            <button onClick={handleBaja} disabled={bajaLog.loading} className="btn-danger flex items-center gap-2">
              {bajaLog.loading && <Loader2 size={14} className="animate-spin" />} Ejecutar
            </button>
          </div>
          <div className="border-t border-slate-100 pt-3">
            <label className="label">ID del usuario</label>
            <input {...bajaForm.register('id', { valueAsNumber: true })} type="number" className="input max-w-xs" placeholder="1" />
          </div>
          <ApiResponseCard log={bajaLog.log} />
        </div>

        {/* Crear vendedor */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="badge-post">POST</span>
              <code className="text-sm font-mono text-slate-700">/usuarios/vendedores</code>
            </div>
            <button onClick={handleVendedor} disabled={vendedorLog.loading} className="btn-primary flex items-center gap-2">
              {vendedorLog.loading && <Loader2 size={14} className="animate-spin" />} Ejecutar
            </button>
          </div>
          <div className="border-t border-slate-100 pt-3 grid grid-cols-2 gap-3">
            <div>
              <label className="label">Nombre</label>
              <input {...vendedorForm.register('nombre')} className="input" placeholder="Ana" />
            </div>
            <div>
              <label className="label">Apellido</label>
              <input {...vendedorForm.register('apellido')} className="input" placeholder="García" />
            </div>
            <div>
              <label className="label">Email</label>
              <input {...vendedorForm.register('email')} className="input" placeholder="ana@agencia.com" />
            </div>
            <div>
              <label className="label">Password</label>
              <input {...vendedorForm.register('password')} type="password" className="input" placeholder="••••••••" />
            </div>
          </div>
          <ApiResponseCard log={vendedorLog.log} />
        </div>
      </div>
    </div>
  );
}
