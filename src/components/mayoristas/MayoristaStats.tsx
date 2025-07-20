import React from 'react';
import { Users, CheckCircle, Shield, Repeat } from 'lucide-react';
import { MayoristaStats as MayoristaStatsType } from '../../types/mayorista';

interface MayoristaStatsProps {
  stats: MayoristaStatsType;
  loading: boolean;
}

const MayoristaStats: React.FC<MayoristaStatsProps> = ({ stats, loading }) => {
  const statsData = [
    {
      title: 'Total Mayoristas',
      value: stats.total,
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      title: 'Mayoristas Activos',
      value: stats.activos,
      icon: CheckCircle,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      title: 'Mayoristas Verificados',
      value: stats.verificados,
      icon: Shield,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700'
    },
    {
      title: 'Mayoristas Recurrentes',
      value: stats.recurrentes,
      icon: Repeat,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-8 bg-gray-200 rounded animate-pulse w-16"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsData.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <div key={index} className="bg-white rounded-lg shadow p-6 transition-all duration-200 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                {loading ? (
                  <div className="h-8 bg-gray-200 rounded animate-pulse mt-2"></div>
                ) : (
                  <p className="text-3xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
                )}
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <IconComponent className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MayoristaStats;
