import React, { useState, useEffect } from 'react';
import { BarChart3, Utensils } from 'lucide-react';
import { RestauranteChartData } from '../../types/restaurante';
import { restauranteService } from '../../services/restauranteService';

interface RestauranteChartsProps {
  loading: boolean;
}

const RestauranteCharts: React.FC<RestauranteChartsProps> = ({ loading }) => {
  const [chartData, setChartData] = useState<RestauranteChartData>({
    tipos_cocina: [],
    servicios: []
  });

  useEffect(() => {
    const loadChartData = async () => {
      try {
        const data = await restauranteService.getRestauranteChartData();
        setChartData(data);
      } catch (error) {
        console.error('Error loading chart data:', error);
      }
    };

    if (!loading) {
      loadChartData();
    }
  }, [loading]);

  // Colores para los gráficos
  const colors = [
    'from-red-500 to-red-600',
    'from-orange-500 to-orange-600',
    'from-yellow-500 to-yellow-600',
    'from-green-500 to-green-600',
    'from-blue-500 to-blue-600',
    'from-purple-500 to-purple-600',
    'from-pink-500 to-pink-600',
    'from-emerald-500 to-emerald-600'
  ];

  const renderChart = (
    title: string,
    icon: React.ReactNode,
    data: Array<{ [key: string]: string | number }>,
    valueKey: string,
    labelKey: string
  ) => {
    if (loading) {
      return (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center mb-4">
            <div className="w-5 h-5 bg-gray-200 rounded animate-pulse mr-2"></div>
            <div className="h-6 bg-gray-200 rounded animate-pulse w-48"></div>
          </div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="flex-1 h-6 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-12 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (data.length === 0) {
      return (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center mb-4">
            {icon}
            <h3 className="text-lg font-medium text-gray-900 ml-2">{title}</h3>
          </div>
          <div className="text-center py-8 text-gray-500">
            No hay datos disponibles
          </div>
        </div>
      );
    }

    const maxValue = Math.max(...data.map(item => Number(item[valueKey])));
    const total = data.reduce((sum, item) => sum + Number(item[valueKey]), 0);

    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center mb-4">
          {icon}
          <h3 className="text-lg font-medium text-gray-900 ml-2">{title}</h3>
        </div>
        <div className="space-y-3">
          {data.slice(0, 8).map((item, index) => {
            const value = Number(item[valueKey]);
            const percentage = total > 0 ? (value / total) * 100 : 0;
            const widthPercentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
            
            return (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-20 text-sm text-gray-600 truncate">
                  {String(item[labelKey])}
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${colors[index % colors.length]} transition-all duration-500 ease-out rounded-full`}
                    style={{ width: `${widthPercentage}%` }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-700">
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="w-12 text-sm font-medium text-gray-900 text-right">
                  {value}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {renderChart(
        'Distribución por Tipo de Cocina',
        <BarChart3 className="h-5 w-5 text-purple-600" />,
        chartData.tipos_cocina,
        'count',
        'tipo'
      )}
      
      {renderChart(
        'Servicios Principales',
        <Utensils className="h-5 w-5 text-orange-600" />,
        chartData.servicios,
        'count',
        'servicio'
      )}
    </div>
  );
};

export default RestauranteCharts;
