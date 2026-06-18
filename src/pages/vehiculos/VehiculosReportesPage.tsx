import { useRequestLog } from '../../hooks/useRequestLog';
import { vehiculosApi } from '../../api/vehiculos.api';
import ApiResponseCard from '../../components/ApiResponseCard';
import PageHeader from '../../components/PageHeader';
import { Loader2, TrendingUp, Package, Clock } from 'lucide-react';

export default function VehiculosReportesPage() {
  const gananciasLog = useRequestLog();
  const stockLog = useRequestLog();
  const ultimosLog = useRequestLog();

  return (
    <div>
      <PageHeader title="Reportes de Vehículos" subtitle="Métricas y estadísticas del inventario." badge="3 endpoints" />

      <div className="space-y-4 max-w-2xl">
        {/* Ganancias */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                <TrendingUp size={16} className="text-emerald-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="badge-get">GET</span>
                  <code className="text-sm font-mono text-slate-700">/vehiculos/reportes/ganancias</code>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Reporte de ganancias por ventas</p>
              </div>
            </div>
          </div>
          <ApiResponseCard log={gananciasLog.log} />
        </div>

        {/* Stock */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <Package size={16} className="text-blue-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="badge-get">GET</span>
                  <code className="text-sm font-mono text-slate-700">/vehiculos/reportes/stock</code>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Estado actual del inventario</p>
              </div>
            </div>
            <button
              onClick={() => stockLog.execute('GET', '/vehiculos/reportes/stock', undefined, () => vehiculosApi.reporteStock())}
              disabled={stockLog.loading}
              className="btn-primary flex items-center gap-2"
            >
              {stockLog.loading && <Loader2 size={14} className="animate-spin" />} Ejecutar
            </button>
          </div>
          <ApiResponseCard log={stockLog.log} />
        </div>

        {/* Últimos */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                <Clock size={16} className="text-purple-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="badge-get">GET</span>
                  <code className="text-sm font-mono text-slate-700">/vehiculos/reportes/ultimos</code>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Últimos vehículos ingresados</p>
              </div>
            </div>
            <button
              onClick={() => ultimosLog.execute('GET', '/vehiculos/reportes/ultimos', undefined, () => vehiculosApi.reporteUltimos())}
              disabled={ultimosLog.loading}
              className="btn-primary flex items-center gap-2"
            >
              {ultimosLog.loading && <Loader2 size={14} className="animate-spin" />} Ejecutar
            </button>
          </div>
          <ApiResponseCard log={ultimosLog.log} />
        </div>
      </div>
    </div>
  );
}
