import { useReporteStock } from '../../shared/hooks/useVehiculos';
import { useQuery } from '@tanstack/react-query';
import { transaccionesApi } from '../../api/transacciones.api';
import StatCard from '../../shared/components/StatCard';
import Spinner from '../../shared/components/Spinner';
import { formatPrice, obtenerFechaHace30Dias, obtenerFechaHoy } from '../../shared/utils/format';
import { Package, TrendingUp, DollarSign, Users } from 'lucide-react';
import { useState } from 'react';
import { useAuditoria, useCambiosEstado, useCambiosPrecio } from '../../shared/hooks/useAuditoria';
import { useQueryClient } from '@tanstack/react-query';

export default function ReportesPage() {
  const qc = useQueryClient();
  const { data: stock, isLoading: ls } = useReporteStock();
  const [fechaDesde, setFechaDesde] = useState(obtenerFechaHace30Dias());
  const [fechaHasta, setFechaHasta] = useState(obtenerFechaHoy());
  const [vendedorId, setVendedorId] = useState('');
  const [vendedorSeleccionado, setVendedorSeleccionado] = useState<number | null>(null);
  const { data: rendimiento, isLoading: lr } = useQuery({
    queryKey: ['transacciones', 'rendimiento'],
    queryFn: () => transaccionesApi.rendimiento(fechaDesde, fechaHasta).then(r => r.data),
  });

  const {
    data: comisionVendedor,
    isLoading: lc,
    error,
    isError,
  } = useQuery({
    queryKey: [
      'transacciones',
      'comision-vendedor',
      vendedorSeleccionado,
      fechaDesde,
      fechaHasta,
    ],
    queryFn: () =>
      transaccionesApi
        .comisionVendedor(
          vendedorSeleccionado!,
          fechaDesde,
          fechaHasta
        )
        .then(r => r.data),
    enabled: vendedorSeleccionado !== null,
  });

  const { data: auditorias } = useAuditoria({
    page: 0,
    size: 10,
    fechaDesde,
    fechaHasta,
  });

  const { data: cambiosEstado } =
    useCambiosEstado(
      fechaDesde,
      fechaHasta
    );

  const { data: cambiosPrecio } =
    useCambiosPrecio(
      fechaDesde,
      fechaHasta
    );

  const s = (stock as Record<string, number>) ?? {};
  const r = (rendimiento as Record<string, unknown>) ?? {};

  if (ls || lr) return <Spinner size={36} className="py-24" />;


  return (
    <div>
      <div className="mb-8">
        <h1 className="admin-page-title">Reportes</h1>
        <p className="text-slate-500 text-sm mt-1">Métricas operativas y financieras</p>
      </div>

      {/* filtros de fechas */}
      <div className="flex items-center gap-1.5">
        <span className="text-slate-500 text-xs font-medium">Desde:</span>
        <input
          type="date"
          value={fechaDesde}
          onChange={(e) => setFechaDesde(e.target.value)}
          className="border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-slate-400 bg-white"
        />
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-slate-500 text-xs font-medium">Hasta:</span>
        <input
          type="date"
          value={fechaHasta}
          onChange={(e) => setFechaHasta(e.target.value)}
          className="border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-slate-400 bg-white"
        />
      </div>

      <button
        onClick={() => {
          qc.refetchQueries({
            predicate: (query) =>
              query.queryKey[0] === 'transacciones'
          });

          qc.refetchQueries({
            predicate: (query) =>
              query.queryKey[0] === 'auditoria'
          });
        }}
      >
        Refrescar datos
      </button>

      <div className="space-y-8">

        {/* Ganancias */}
        <section>
          <h2 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
            <TrendingUp size={18} />
            Balance Financiero
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Ingresos Brutos"
              value={formatPrice(
                Number(r.precios_final_total ?? 0)
              )}
              color="text-emerald-600"
            />

            <StatCard
              label="Comisiones Pagadas"
              value={formatPrice(
                Number(r.comisiones_total ?? 0)
              )}
              color="text-amber-600"
            />

            <StatCard
              label="Costo Vehículos Vendidos"
              value={formatPrice(
                Number(r.costos_vehiculos_vendidos ?? 0)
              )}
              color="text-red-600"
            />

            <StatCard
              label="Ingreso Neto"
              value={formatPrice(
                Number(r.ingreso_final ?? 0)
              )}
              color="text-blue-600"
            />
          </div>
        </section>

        {/* Stock */}
        <section>
          <h2 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><Package size={18} /> Stock de vehículos</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Disponibles" value={s.disponibles ?? s.cantidadDisponible ?? '—'} color="text-emerald-600" />
            <StatCard label="Reservados" value={s.reservados ?? s.cantidadReservado ?? '—'} color="text-amber-600" />
            <StatCard label="Vendidos" value={s.vendidos ?? s.cantidadVendido ?? '—'} color="text-slate-600" />
            <StatCard label="Total inventario" value={s.total ?? s.cantidadTotal ?? '—'} />
          </div>
          {s.valorInventario && (
            <div className="mt-4">
              <StatCard label="Valor total del inventario" value={formatPrice(s.valorInventario)} icon={<DollarSign size={28} />} color="text-blue-600" sub="Suma de precios de venta en stock" />
            </div>
          )}
        </section>

        {/* Actividad Reciente */}
        <section>
          <h2 className="font-bold text-slate-700 mb-4">
            Actividad Reciente
          </h2>

          <div className="card-admin overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Fecha</th>
                  <th className="text-left p-3">Transacción</th>
                  <th className="text-left p-3">Vendedor</th>
                </tr>
              </thead>

              <tbody>
                {auditorias?.content?.map((a: any) => (
                  <tr key={a.id} className="border-b">
                    <td className="p-3">
                      {a.created_at}
                    </td>

                    <td className="p-3">
                      #{a.transaccion_id}
                    </td>

                    <td className="p-3">
                      #{a.vendedor_id}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>


        {/* Cambios de Estado */}
        <section>
          <h2 className="font-bold text-slate-700 mb-4">
            Cambios de Estado
          </h2>

          <div className="card-admin overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="p-3 text-left">
                    Fecha
                  </th>

                  <th className="p-3 text-left">
                    Transacción
                  </th>

                  <th className="p-3 text-left">
                    Estado Anterior
                  </th>

                  <th className="p-3 text-left">
                    Estado Nuevo
                  </th>
                </tr>
              </thead>

              <tbody>
                {cambiosEstado?.content?.map((a: any) => (
                  <tr key={a.id} className="border-b">
                    <td className="p-3">
                      {a.created_at}
                    </td>

                    <td className="p-3">
                      #{a.transaccion_id}
                    </td>

                    <td className="p-3">
                      {a.estadoAnterior}
                    </td>

                    <td className="p-3">
                      {a.estadoNuevo}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        {/* Cambios de Precio */}
        <section>
          <h2 className="font-bold text-slate-700 mb-4">
            Cambios de Precio
          </h2>

          <div className="card-admin overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="p-3 text-left">
                    Fecha
                  </th>

                  <th className="p-3 text-left">
                    Transacción
                  </th>

                  <th className="p-3 text-left">
                    Precio Anterior
                  </th>

                  <th className="p-3 text-left">
                    Precio Nuevo
                  </th>
                </tr>
              </thead>

              <tbody>
                {cambiosPrecio?.content?.map((a: any) => (
                  <tr key={a.id} className="border-b">
                    <td className="p-3">
                      {a.created_at}
                    </td>

                    <td className="p-3">
                      #{a.transaccion_id}
                    </td>

                    <td className="p-3">
                      {formatPrice(
                        Number(a.precioFinalAnterior ?? 0)
                      )}
                    </td>

                    <td className="p-3">
                      {formatPrice(
                        Number(a.precioFinalNuevo ?? 0)
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Comisiones de Vendedores */}
        <div className="card-admin p-4 mt-4">
          <h3 className="font-semibold text-slate-700 mb-4">
            Consulta de comisión por vendedor
          </h3>

          <div className="flex flex-wrap gap-3 items-end">
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                ID Vendedor
              </label>

              <input
                type="number"
                min="1"
                value={vendedorId}
                onChange={(e) =>
                  setVendedorId(e.target.value)
                }
                className="border border-slate-200 rounded px-3 py-2 text-sm"
              />
            </div>

            <button
              onClick={() => {
                if (!vendedorId) return;
                setVendedorSeleccionado(
                  Number(vendedorId)
                );
              }}
              className="px-4 py-2 rounded bg-slate-800 text-white text-sm hover:bg-slate-700"
            >
              Consultar comisión
            </button>
          </div>
        </div>
        {lc && (
          <div className="mt-4">
            <Spinner size={24} />
          </div>
        )}

        {isError && (
          <div className="card-admin p-4 border border-red-200 bg-red-50">
            <p className="text-red-600 text-sm">
              {
                (error as any)?.response?.data?.message ??
                'Error al consultar la comisión'
              }
            </p>
          </div>
        )}

        {comisionVendedor && (
          <section>
            <h2 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
              <DollarSign size={18} />
              Comisión del vendedor
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatCard
                label="ID Vendedor"
                value={comisionVendedor.vendedor_id}
              />

              <StatCard
                label="Nombre"
                value={comisionVendedor.nombre_completo}
              />

              <StatCard
                label="Email"
                value={comisionVendedor.email}
              />

              <StatCard
                label="Comisión Total"
                value={formatPrice(
                  comisionVendedor.comision_total
                )}
                color="text-emerald-600"
              />
            </div>
          </section>
        )}

        {/* Rendimiento */}
        {!lr && r && Object.keys(r).length > 0 && (
          <section>
            <h2 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><Users size={18} /> Rendimiento de vendedores</h2>
            <div className="card-admin p-6">
              <pre className="text-xs text-slate-600 overflow-auto">{JSON.stringify(r, null, 2)}</pre>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
