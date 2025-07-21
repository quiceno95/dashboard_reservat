import React from 'react';
import { Package, CheckCircle, Tag, Building } from 'lucide-react';
import { ServicioStatsProps } from '../../types/servicio';

const ServicioStats: React.FC<ServicioStatsProps> = ({ stats, loading }) => {
  const statsConfig = [
    {
      title: 'Total Servicios',
      value: stats.totalServicios,
      icon: Package,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Servicios Activos',
      value: stats.serviciosActivos,
      icon: CheckCircle,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Tipos de Servicio',
      value: stats.serviciosPorTipo,
      icon: Tag,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Proveedores con Servicios',
      value: stats.proveedoresConServicios,
      icon: Building,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="animate-pulse">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsConfig.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <div key={index} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center">
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <IconComponent className={`h-6 w-6 ${stat.textColor}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stat.value.toLocaleString('es-ES')}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ServicioStats;
