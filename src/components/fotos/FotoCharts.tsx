import React from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';
import { FotoChartsProps } from '../../types/foto';

const FotoCharts: React.FC<FotoChartsProps> = ({ chartData, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
              {[...Array(4)].map((_, j) => (
                <div key={j} className="flex items-center space-x-3">
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                  <div className="h-6 bg-gray-200 rounded flex-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-8"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  const maxValueEstado = Math.max(...chartData.estadoData.map(item => item.value));
  const maxValueSubidas = Math.max(...chartData.subidasMesData.map(item => item.cantidad));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico de Distribución por Estado */}
      <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-medium text-gray-900">Distribución por Estado</h3>
          </div>
        </div>
        
        <div className="space-y-4">
          {chartData.estadoData.map((item, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-16 text-sm font-medium text-gray-600 text-right">
                {item.name}
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: maxValueEstado > 0 ? `${(item.value / maxValueEstado) * 100}%` : '0%',
                    background: `linear-gradient(90deg, ${item.color}, ${item.color}dd)`
                  }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-700">
                    {item.value}
                  </span>
                </div>
              </div>
              <div className="w-12 text-sm font-medium text-gray-600">
                {maxValueEstado > 0 ? Math.round((item.value / maxValueEstado) * 100) : 0}%
              </div>
            </div>
          ))}
        </div>

        {chartData.estadoData.length === 0 && (
          <div className="text-center py-8">
            <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Sin datos</h3>
            <p className="mt-1 text-sm text-gray-500">No hay datos para mostrar en este gráfico</p>
          </div>
        )}
      </div>

      {/* Gráfico de Subidas por Mes */}
      <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-medium text-gray-900">Subidas por Mes</h3>
          </div>
        </div>
        
        <div className="space-y-4">
          {chartData.subidasMesData.map((item, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-16 text-sm font-medium text-gray-600 text-right">
                {item.mes}
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: maxValueSubidas > 0 ? `${(item.cantidad / maxValueSubidas) * 100}%` : '0%',
                    background: 'linear-gradient(90deg, #10B981, #059669)'
                  }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-700">
                    {item.cantidad}
                  </span>
                </div>
              </div>
              <div className="w-12 text-sm font-medium text-gray-600">
                {item.cantidad}
              </div>
            </div>
          ))}
        </div>

        {chartData.subidasMesData.length === 0 && (
          <div className="text-center py-8">
            <TrendingUp className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Sin datos</h3>
            <p className="mt-1 text-sm text-gray-500">No hay datos para mostrar en este gráfico</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FotoCharts;
