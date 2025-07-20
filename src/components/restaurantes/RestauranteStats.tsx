import React, { useState, useEffect } from 'react';
import { Utensils, CheckCircle, Truck, Heart } from 'lucide-react';
import { RestauranteStats as RestauranteStatsType } from '../../types/restaurante';
import { restauranteService } from '../../services/restauranteService';

interface RestauranteStatsProps {
  loading: boolean;
}

const RestauranteStats: React.FC<RestauranteStatsProps> = ({ loading }) => {
  const [stats, setStats] = useState<RestauranteStatsType>({
    total: 0,
    verificados: 0,
    con_entrega: 0,
    pet_friendly: 0
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const statsData = await restauranteService.getRestauranteStats();
        setStats(statsData);
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    };

    if (!loading) {
      loadStats();
    }
  }, [loading]);

  const statsConfig = [
    {
      title: 'Total Restaurantes',
      value: stats.total,
      icon: Utensils,
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'bg-blue-500'
    },
    {
      title: 'Restaurantes Verificados',
      value: stats.verificados,
      icon: CheckCircle,
      color: 'green',
      bgColor: 'bg-green-50',
      iconColor: 'bg-green-500'
    },
    {
      title: 'Con Entrega a Domicilio',
      value: stats.con_entrega,
      icon: Truck,
      color: 'orange',
      bgColor: 'bg-orange-50',
      iconColor: 'bg-orange-500'
    },
    {
      title: 'Pet Friendly',
      value: stats.pet_friendly,
      icon: Heart,
      color: 'purple',
      bgColor: 'bg-purple-50',
      iconColor: 'bg-purple-500'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gray-200 rounded-md animate-pulse"></div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
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
      {statsConfig.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className={`${stat.bgColor} overflow-hidden shadow rounded-lg`}>
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`${stat.iconColor} rounded-md p-2`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className={`text-sm font-medium text-${stat.color}-600 truncate`}>
                      {stat.title}
                    </dt>
                    <dd>
                      <div className={`text-3xl font-bold text-${stat.color}-900`}>
                        {stat.value.toLocaleString()}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RestauranteStats;
