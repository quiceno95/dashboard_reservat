import React from 'react';
import { BarChart3, MapPin } from 'lucide-react';
import { ServicioChartsProps } from '../../types/servicio';

const ServicioCharts: React.FC<ServicioChartsProps> = ({ chartData, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded flex-1"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const maxTipoValue = Math.max(...chartData.tipoServicioData.map(item => item.value), 1);
  const maxCiudadValue = Math.max(...chartData.ciudadData.map(item => item.cantidad), 1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico de Tipos de Servicio */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-2 mb-6">
          <BarChart3 className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Distribución por Tipo de Servicio</h3>
        </div>
        
        {chartData.tipoServicioData.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No hay datos disponibles
          </div>
        ) : (
          <div className="space-y-4">
            {chartData.tipoServicioData.map((item, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-20 text-sm text-gray-600 truncate" title={item.name}>
                  {item.name}
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${(item.value / maxTipoValue) * 100}%`,
                      background: `linear-gradient(90deg, ${item.color}CC, ${item.color})`
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-700">
                      {item.value}
                    </span>
                  </div>
                </div>
                <div className="w-12 text-sm text-gray-500 text-right">
                  {((item.value / chartData.tipoServicioData.reduce((sum, d) => sum + d.value, 0)) * 100).toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Gráfico de Servicios por Ciudad */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-2 mb-6">
          <MapPin className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Servicios por Ciudad (Top 6)</h3>
        </div>
        
        {chartData.ciudadData.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No hay datos disponibles
          </div>
        ) : (
          <div className="space-y-4">
            {chartData.ciudadData.map((item, index) => {
              const colors = [
                '#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'
              ];
              const color = colors[index % colors.length];
              
              return (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-20 text-sm text-gray-600 truncate" title={item.ciudad}>
                    {item.ciudad}
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${(item.cantidad / maxCiudadValue) * 100}%`,
                        background: `linear-gradient(90deg, ${color}CC, ${color})`
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-700">
                        {item.cantidad}
                      </span>
                    </div>
                  </div>
                  <div className="w-12 text-sm text-gray-500 text-right">
                    {((item.cantidad / chartData.ciudadData.reduce((sum, d) => sum + d.cantidad, 0)) * 100).toFixed(1)}%
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicioCharts;
