import React from 'react';
import { Car, Activity } from 'lucide-react';
import { TransporteChartData } from '../../types/transporte';

interface TransporteChartsProps {
  chartData: TransporteChartData;
  loading: boolean;
}

const TransporteCharts: React.FC<TransporteChartsProps> = ({ chartData, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="animate-pulse">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gray-200 rounded-full mr-3"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center">
                    <div className="w-20 h-4 bg-gray-200 rounded mr-3"></div>
                    <div className="flex-1 h-6 bg-gray-200 rounded"></div>
                    <div className="w-12 h-4 bg-gray-200 rounded ml-3"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const renderChart = (data: { name: string; value: number; color: string }[], title: string, icon: React.ReactNode) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-6">
          {icon}
          <h3 className="text-lg font-semibold text-gray-900 ml-3">{title}</h3>
        </div>
        
        <div className="space-y-4">
          {data.map((item, index) => {
            const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0;
            
            return (
              <div key={index} className="flex items-center">
                <div className="w-20 text-sm text-gray-600 font-medium">
                  {item.name}
                </div>
                <div className="flex-1 mx-3">
                  <div className="bg-gray-200 rounded-full h-6 relative overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${item.color} transition-all duration-500 ease-out flex items-center justify-end pr-2`}
                      style={{ width: `${percentage}%` }}
                    >
                      {percentage > 15 && (
                        <span className="text-white text-xs font-medium">
                          {percentage}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="w-12 text-right text-sm font-semibold text-gray-900">
                  {item.value}
                </div>
              </div>
            );
          })}
        </div>
        
        {total === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No hay datos disponibles</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {renderChart(
        chartData.tiposVehiculo,
        'Distribución por Tipo de Vehículo',
        <Car className="h-6 w-6 text-blue-600" />
      )}
      
      {renderChart(
        chartData.estados,
        'Transportes por Estado',
        <Activity className="h-6 w-6 text-green-600" />
      )}
    </div>
  );
};

export default TransporteCharts;
