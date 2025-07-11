import React from 'react';
import { Star, CheckCircle, Globe, MessageCircle } from 'lucide-react';

interface ExperienceStatsProps {
  totalExperiences: number;
  verificadas: number;
  espanol: number;
  ingles: number;
  loading?: boolean;
}

export const ExperienceStats: React.FC<ExperienceStatsProps> = ({
  totalExperiences,
  verificadas,
  espanol,
  ingles,
  loading = false
}) => {
  const stats = [
    {
      title: 'Total Experiencias',
      value: totalExperiences,
      icon: Star,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      title: 'Experiencias Verificadas',
      value: verificadas,
      icon: CheckCircle,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      title: 'Experiencias en Español',
      value: espanol,
      icon: MessageCircle,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700'
    },
    {
      title: 'Experiencias en Inglés',
      value: ingles,
      icon: Globe,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className={`${stat.bgColor} rounded-xl p-6 border border-gray-100`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {stat.title}
                </p>
                {loading ? (
                  <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-16"></div>
                  </div>
                ) : (
                  <p className={`text-3xl font-bold ${stat.textColor}`}>
                    {stat.value.toLocaleString()}
                  </p>
                )}
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};