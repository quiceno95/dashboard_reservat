import React from 'react';
import { RestriccionChartsProps } from '../../types/restriccion';

const RestriccionCharts: React.FC<RestriccionChartsProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, index) => (
          <div key={index} className="bg-white shadow rounded-lg p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded flex-1"></div>
                    <div className="h-4 bg-gray-200 rounded w-12"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const maxValueEstados = Math.max(...data.estados.map(item => item.value), 1);
  const maxValueMeses = Math.max(...data.bloqueosPorMes.map(item => item.value), 1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Distribución por Estado */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Distribución por Estado
        </h3>
        <div className="space-y-4">
          {data.estados.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <div className="flex-shrink-0 w-4 h-4 rounded-full bg-gradient-to-r opacity-80" 
                     style={{background: `linear-gradient(to right, ${item.color.replace('from-', '').replace('to-', '').replace('-500', '').replace('-600', '')})`}}>
                </div>
                <span className="text-sm font-medium text-gray-700 min-w-0 flex-1">
                  {item.name}
                </span>
              </div>
              <div className="flex items-center space-x-3 flex-1">
                <div className="flex-1 bg-gray-200 rounded-full h-2 relative overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-1000 ease-out`}
                    style={{
                      width: `${(item.value / maxValueEstados) * 100}%`,
                      animation: `slideIn 1s ease-out ${index * 0.2}s both`
                    }}
                  ></div>
                </div>
                <span className="text-sm font-semibold text-gray-900 w-8 text-right">
                  {item.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bloqueos por Mes */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Bloqueos por Mes (Últimos 6 meses)
        </h3>
        <div className="space-y-4">
          {data.bloqueosPorMes.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <div className="flex-shrink-0 w-4 h-4 rounded-full bg-gradient-to-r opacity-80" 
                     style={{background: `linear-gradient(to right, #ef4444, #dc2626)`}}>
                </div>
                <span className="text-sm font-medium text-gray-700 min-w-0 flex-1 capitalize">
                  {item.name}
                </span>
              </div>
              <div className="flex items-center space-x-3 flex-1">
                <div className="flex-1 bg-gray-200 rounded-full h-2 relative overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-1000 ease-out`}
                    style={{
                      width: `${(item.value / maxValueMeses) * 100}%`,
                      animation: `slideIn 1s ease-out ${index * 0.2}s both`
                    }}
                  ></div>
                </div>
                <span className="text-sm font-semibold text-gray-900 w-8 text-right">
                  {item.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            width: 0%;
          }
          to {
            width: var(--target-width);
          }
        }
      `}</style>
    </div>
  );
};

export default RestriccionCharts;
