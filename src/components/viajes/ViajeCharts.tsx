import React from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';
import { ViajeChartsProps } from '../../types/viaje';

const ViajeCharts: React.FC<ViajeChartsProps> = ({ chartData, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="animate-pulse">
              <div className="flex items-center mb-6">
                <div className="w-6 h-6 bg-gray-200 rounded mr-3"></div>
                <div className="h-5 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center">
                    <div className="w-20 h-4 bg-gray-200 rounded mr-3"></div>
                    <div className="flex-1 h-6 bg-gray-200 rounded mr-3"></div>
                    <div className="w-8 h-4 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const getEstadoColor = (estado: string) => {
    const colors = {
      'programado': 'from-blue-400 to-blue-600',
      'en_curso': 'from-yellow-400 to-yellow-600',
      'finalizado': 'from-green-400 to-green-600',
      'cancelado': 'from-red-400 to-red-600'
    };
    return colors[estado as keyof typeof colors] || 'from-gray-400 to-gray-600';
  };

  const getMesColor = (index: number) => {
    const colors = [
      'from-purple-400 to-purple-600',
      'from-indigo-400 to-indigo-600',
      'from-blue-400 to-blue-600',
      'from-cyan-400 to-cyan-600',
      'from-teal-400 to-teal-600',
      'from-emerald-400 to-emerald-600'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Distribución por Estado */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-6">
          <BarChart3 className="h-6 w-6 text-blue-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">Distribución por Estado</h3>
        </div>
        <div className="space-y-4">
          {chartData.estadoDistribution.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No hay datos disponibles</p>
          ) : (
            chartData.estadoDistribution.map((item, index) => (
              <div key={index} className="flex items-center">
                <div className="w-24 text-sm text-gray-600 font-medium capitalize">
                  {item.estado.replace('_', ' ')}
                </div>
                <div className="flex-1 mx-3">
                  <div className="bg-gray-200 rounded-full h-6 relative overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${getEstadoColor(item.estado)} transition-all duration-500 ease-out flex items-center justify-end pr-2`}
                      style={{ width: `${item.percentage}%` }}
                    >
                      <span className="text-white text-xs font-medium">
                        {item.percentage}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="w-12 text-right text-sm font-semibold text-gray-900">
                  {item.count}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Viajes por Mes */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-6">
          <TrendingUp className="h-6 w-6 text-green-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">Viajes por Mes</h3>
        </div>
        <div className="space-y-4">
          {chartData.viajePorMes.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No hay datos disponibles</p>
          ) : (
            chartData.viajePorMes.map((item, index) => {
              const maxCount = Math.max(...chartData.viajePorMes.map(v => v.count));
              const percentage = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
              
              return (
                <div key={index} className="flex items-center">
                  <div className="w-24 text-sm text-gray-600 font-medium">
                    {item.mes}
                  </div>
                  <div className="flex-1 mx-3">
                    <div className="bg-gray-200 rounded-full h-6 relative overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${getMesColor(index)} transition-all duration-500 ease-out flex items-center justify-end pr-2`}
                        style={{ width: `${percentage}%` }}
                      >
                        <span className="text-white text-xs font-medium">
                          {item.count}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="w-12 text-right text-sm font-semibold text-gray-900">
                    {item.count}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ViajeCharts;
