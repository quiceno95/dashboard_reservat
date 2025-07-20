import React from 'react';
import { BarChart3, PieChart } from 'lucide-react';
import { MayoristaChartData } from '../../types/mayorista';

interface MayoristaChartsProps {
  data: MayoristaChartData;
  loading: boolean;
}

const MayoristaCharts: React.FC<MayoristaChartsProps> = ({ data, loading }) => {

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {[...Array(2)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gray-200 rounded animate-pulse mr-3"></div>
              <div className="h-6 bg-gray-200 rounded animate-pulse w-48"></div>
            </div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                  </div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Distribución por Estados */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center mb-4">
          <BarChart3 className="w-5 h-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Distribución por Estados</h3>
        </div>
        <div className="space-y-3">
          {data.estados.map((item, index) => {
            const total = data.estados.reduce((sum, i) => sum + i.count, 0);
            const percentage = total > 0 ? (item.count / total) * 100 : 0;
            const colors = ['from-green-500 to-green-600', 'from-red-500 to-red-600'];
            return (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center flex-1">
                  <span className="text-sm font-medium text-gray-700 w-20">{item.estado}</span>
                  <div className="flex-1 mx-3">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full bg-gradient-to-r ${colors[index]} transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-600 w-16 text-right">
                    {item.count} ({percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Gráfico de Verificación */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center mb-4">
          <PieChart className="w-5 h-5 text-green-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Estado de Verificación</h3>
        </div>
        <div className="space-y-3">
          {data.verificacion.map((item, index) => {
            const total = data.verificacion.reduce((sum, i) => sum + i.count, 0);
            const percentage = total > 0 ? (item.count / total) * 100 : 0;
            const colors = ['from-blue-500 to-blue-600', 'from-orange-500 to-orange-600'];
            return (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center flex-1">
                  <span className="text-sm font-medium text-gray-700 w-24">{item.tipo}</span>
                  <div className="flex-1 mx-3">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full bg-gradient-to-r ${colors[index]} transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-600 w-16 text-right">
                    {item.count} ({percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MayoristaCharts;
