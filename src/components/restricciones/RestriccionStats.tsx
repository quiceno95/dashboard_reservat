import React from 'react';
import { Shield, ShieldCheck, Calendar, Server } from 'lucide-react';
import { RestriccionStatsProps } from '../../types/restriccion';

const RestriccionStats: React.FC<RestriccionStatsProps> = ({ stats, loading }) => {
  const statsData = [
    {
      title: 'Total Restricciones',
      value: stats.totalRestricciones,
      icon: Shield,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Restricciones Activas',
      value: stats.restriccionesActivas,
      icon: ShieldCheck,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    },
    {
      title: 'Bloqueos Mes Actual',
      value: stats.restriccionesMesActual,
      icon: Calendar,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
    {
      title: 'Servicios con Restricciones',
      value: stats.serviciosConRestricciones,
      icon: Server,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="animate-pulse">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  </div>
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
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`${stat.bgColor} p-2 rounded-full`}>
                    <Icon className={`h-6 w-6 ${stat.textColor}`} />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.title}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {stat.value.toLocaleString()}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className={`bg-gradient-to-r ${stat.color} h-1`}></div>
          </div>
        );
      })}
    </div>
  );
};

export default RestriccionStats;
