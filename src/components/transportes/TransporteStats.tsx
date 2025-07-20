import React from 'react';
import { Car, CheckCircle, Shield, Users } from 'lucide-react';
import { TransporteStats as TransporteStatsType } from '../../types/transporte';

interface TransporteStatsProps {
  stats: TransporteStatsType;
  loading: boolean;
}

const TransporteStats: React.FC<TransporteStatsProps> = ({ stats, loading }) => {
  const statsData = [
    {
      title: 'Total Transportes',
      value: stats.totalTransportes,
      icon: Car,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      bgIconColor: 'bg-blue-100'
    },
    {
      title: 'Transportes Disponibles',
      value: stats.transportesDisponibles,
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      bgIconColor: 'bg-green-100'
    },
    {
      title: 'Con Seguro Vigente',
      value: stats.transportesConSeguro,
      icon: Shield,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      bgIconColor: 'bg-purple-100'
    },
    {
      title: 'Capacidad Promedio',
      value: `${stats.capacidadPromedio} personas`,
      icon: Users,
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      bgIconColor: 'bg-orange-100'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="animate-pulse">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="ml-4 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsData.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <div key={index} className={`${stat.bgColor} rounded-lg shadow p-6`}>
            <div className="flex items-center">
              <div className={`${stat.bgIconColor} rounded-full p-3`}>
                <IconComponent className={`h-6 w-6 ${stat.iconColor}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TransporteStats;
