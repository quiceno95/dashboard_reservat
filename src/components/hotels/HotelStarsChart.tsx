import React from 'react';
import { Star } from 'lucide-react';
import { HotelUnificado } from '../../types/hotel';

interface HotelStarsChartProps {
  hotels: HotelUnificado[];
  loading?: boolean;
}

export const HotelStarsChart: React.FC<HotelStarsChartProps> = ({ hotels, loading = false }) => {
  // Contar hoteles por número de estrellas
  const starsData = [1, 2, 3, 4, 5].map(stars => ({
    stars,
    label: `${stars} Estrella${stars > 1 ? 's' : ''}`,
    count: hotels.filter(hotel => hotel.estrellas === stars).length
  }));

  const maxValue = Math.max(...starsData.map(item => item.count));

  const getStarColor = (stars: number) => {
    const colors = {
      1: 'from-red-500 to-red-600',
      2: 'from-orange-500 to-orange-600', 
      3: 'from-yellow-500 to-yellow-600',
      4: 'from-green-500 to-green-600',
      5: 'from-blue-500 to-blue-600'
    };
    return colors[stars as keyof typeof colors];
  };

  const totalHotels = hotels.length;
  const getPercentage = (count: number) => {
    return totalHotels > 0 ? ((count / totalHotels) * 100).toFixed(1) : '0.0';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Star className="h-5 w-5 mr-2 text-yellow-500" />
            Distribución por Estrellas
          </h3>
          <p className="text-sm text-gray-600">Hoteles clasificados por calificación de estrellas</p>
        </div>
      </div>
      
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center animate-pulse">
              <div className="w-20 h-4 bg-gray-200 rounded"></div>
              <div className="flex-1 mx-4">
                <div className="bg-gray-200 rounded-full h-3"></div>
              </div>
              <div className="w-16 h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {starsData.map((item, index) => (
            <div key={index} className="flex items-center">
              <div className="w-20 text-sm text-gray-600 font-medium flex items-center">
                {[...Array(item.stars)].map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-gray-200 rounded-full h-3">
                  <div
                    className={`bg-gradient-to-r ${getStarColor(item.stars)} h-3 rounded-full transition-all duration-500`}
                    style={{
                      width: `${maxValue > 0 ? (item.count / maxValue) * 100 : 0}%`
                    }}
                  ></div>
                </div>
              </div>
              <div className="w-16 text-sm font-semibold text-gray-900 text-right">
                {item.count} ({getPercentage(item.count)}%)
              </div>
            </div>
          ))}
        </div>
      )}
      
      {!loading && starsData.every(item => item.count === 0) && (
        <div className="text-center py-8 text-gray-500">
          No hay datos de estrellas disponibles
        </div>
      )}
    </div>
  );
};
