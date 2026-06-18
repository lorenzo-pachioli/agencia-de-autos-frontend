import { useForm } from 'react-hook-form';
import { getConfig, saveConfig } from '../../api/config'
import type { ApiConfig } from '../../api/config';
import { toast } from 'sonner';
import PageHeader from '../../components/PageHeader';
import { Save, Info } from 'lucide-react';

export default function ConfigPage() {
  const { register, handleSubmit } = useForm<ApiConfig>({ defaultValues: getConfig() });

  const onSubmit = (data: ApiConfig) => {
    saveConfig(data);
    toast.success('Configuración guardada correctamente');
  };

  return (
    <div>
      <PageHeader
        title="Configuración"
        subtitle="Define la URL base de la API y el JWT token de autenticación."
      />

      <div className="max-w-xl space-y-6">
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
          <Info size={16} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Cómo usar</p>
            <p className="text-blue-700 mt-1">
              Configurá la URL base de tu API. Luego podés ir al módulo <strong>Auth</strong> para hacer login
              y el token se guardará automáticamente aquí.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="card p-6 space-y-5">
          <div>
            <label className="label">Base URL de la API</label>
            <input
              {...register('baseUrl')}
              className="input"
              placeholder="http://localhost:8080"
            />
            <p className="text-xs text-slate-400 mt-1">Sin barra al final. Ej: http://localhost:8080</p>
          </div>

          <div>
            <label className="label">JWT Token</label>
            <textarea
              {...register('token')}
              rows={5}
              className="input font-mono text-xs resize-none"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            />
            <p className="text-xs text-slate-400 mt-1">
              Se agrega automáticamente en el header <code className="bg-slate-100 px-1 rounded">Authorization: Bearer …</code> en cada request.
            </p>
          </div>

          <button type="submit" className="btn-primary flex items-center gap-2">
            <Save size={14} /> Guardar configuración
          </button>
        </form>
      </div>
    </div>
  );
}
