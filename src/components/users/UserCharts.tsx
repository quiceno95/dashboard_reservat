import React from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';

interface UserChartsProps {
  monthlyRegistrations: { month: string; count: number }[];
  recentLogins: { date: string; count: number }[];
}

export const UserCharts: React.FC<UserChartsProps> = ({
  monthlyRegistrations,
  recentLogins
}) => {
  const maxMonthlyValue = Math.max(...monthlyRegistrations.map(item => item.count));
  const maxRecentValue = Math.max(...recentLogins.map(item => item.count));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
      {/* Registros Mensuales */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
              Registros por Mes
            </h3>
            <p className="text-sm text-gray-600">Usuarios registrados en los últimos meses</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {monthlyRegistrations.map((item, index) => (
            <div key={index} className="flex items-center">
              <div className="w-20 text-sm text-gray-600 font-medium">
                {item.month}
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${maxMonthlyValue > 0 ? (item.count / maxMonthlyValue) * 100 : 0}%`
                    }}
                  ></div>
                </div>
              </div>
              <div className="w-12 text-sm font-semibold text-gray-900 text-right">
                {item.count}
              </div>
            </div>
          ))}
        </div>
        
        {monthlyRegistrations.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No hay datos de registros disponibles
          </div>
        )}
      </div>

      {/* Logins Recientes */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
              Logins Últimos 5 Días
            </h3>
            <p className="text-sm text-gray-600">Actividad de login reciente</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {recentLogins.map((item, index) => (
            <div key={index} className="flex items-center">
              <div className="w-20 text-sm text-gray-600 font-medium">
                {new Date(item.date).toLocaleDateString('es-ES', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${maxRecentValue > 0 ? (item.count / maxRecentValue) * 100 : 0}%`
                    }}
                  ></div>
                </div>
              </div>
              <div className="w-12 text-sm font-semibold text-gray-900 text-right">
                {item.count}
              </div>
            </div>
          ))}
        </div>
        
        {recentLogins.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No hay datos de logins recientes
          </div>
        )}
      </div>
    </div>
  );
};