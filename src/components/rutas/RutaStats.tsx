import React from 'react';
import { Route, CheckCircle, Star, Clock } from 'lucide-react';
import { RutaStats as RutaStatsType } from '../../types/ruta';

interface RutaStatsProps {
  stats: RutaStatsType;
  loading: boolean;
}

const RutaStats: React.FC<RutaStatsProps> = ({ stats, loading }) => {
  const statsData = [
    {
      title: 'Total Rutas',
      value: stats.totalRutas,
      icon: Route,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      bgIconColor: 'bg-blue-100'
    },
    {
      title: 'Rutas Activas',
      value: stats.rutasActivas,
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      bgIconColor: 'bg-green-100'
    },
    {
      title: 'Rutas Recomendadas',
      value: stats.rutasRecomendadas,
      icon: Star,
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      bgIconColor: 'bg-orange-100'
    },
    {
      title: 'Duración Promedio',
      value: `${stats.duracionPromedio} min`,
      icon: Clock,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      bgIconColor: 'bg-purple-100'
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

export default RutaStats;
