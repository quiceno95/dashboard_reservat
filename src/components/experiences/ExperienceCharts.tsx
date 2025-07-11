import React from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';

interface ExperienceChartsProps {
  difficultyDistribution: { difficulty: string; count: number }[];
  languageDistribution: { language: string; count: number }[];
  chartsLoading?: boolean;
}

export const ExperienceCharts: React.FC<ExperienceChartsProps> = ({
  difficultyDistribution,
  languageDistribution,
  chartsLoading = false
}) => {
  const maxDifficultyValue = Math.max(...difficultyDistribution.map(item => item.count));
  const maxLanguageValue = Math.max(...languageDistribution.map(item => item.count));

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      'fácil': 'from-green-500 to-green-600',
      'moderado': 'from-yellow-500 to-yellow-600',
      'difícil': 'from-red-500 to-red-600',
      'extremo': 'from-purple-500 to-purple-600'
    };
    return colors[difficulty.toLowerCase() as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  const getLanguageColor = (language: string) => {
    const colors = {
      'español': 'from-orange-500 to-orange-600',
      'inglés': 'from-blue-500 to-blue-600',
      'francés': 'from-purple-500 to-purple-600',
      'portugués': 'from-green-500 to-green-600'
    };
    return colors[language.toLowerCase() as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
      {/* Distribución por Dificultad */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
              Distribución por Dificultad
            </h3>
            <p className="text-sm text-gray-600">Experiencias clasificadas por nivel de dificultad</p>
          </div>
        </div>
        
        {chartsLoading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="flex items-center animate-pulse">
                <div className="w-20 h-4 bg-gray-200 rounded"></div>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-200 rounded-full h-3"></div>
                </div>
                <div className="w-12 h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {difficultyDistribution.map((item, index) => (
              <div key={index} className="flex items-center">
                <div className="w-20 text-sm text-gray-600 font-medium capitalize">
                  {item.difficulty}
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-200 rounded-full h-3">
                    <div
                      className={`bg-gradient-to-r ${getDifficultyColor(item.difficulty)} h-3 rounded-full transition-all duration-500`}
                      style={{
                        width: `${maxDifficultyValue > 0 ? (item.count / maxDifficultyValue) * 100 : 0}%`
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
        )}
        
        {!chartsLoading && difficultyDistribution.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No hay datos de dificultad disponibles
          </div>
        )}
      </div>

      {/* Distribución por Idioma */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
              Distribución por Idioma
            </h3>
            <p className="text-sm text-gray-600">Experiencias disponibles por idioma</p>
          </div>
        </div>
        
        {chartsLoading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="flex items-center animate-pulse">
                <div className="w-20 h-4 bg-gray-200 rounded"></div>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-200 rounded-full h-3"></div>
                </div>
                <div className="w-12 h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {languageDistribution.map((item, index) => (
              <div key={index} className="flex items-center">
                <div className="w-20 text-sm text-gray-600 font-medium capitalize">
                  {item.language}
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-200 rounded-full h-3">
                    <div
                      className={`bg-gradient-to-r ${getLanguageColor(item.language)} h-3 rounded-full transition-all duration-500`}
                      style={{
                        width: `${maxLanguageValue > 0 ? (item.count / maxLanguageValue) * 100 : 0}%`
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
        )}
        
        {!chartsLoading && languageDistribution.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No hay datos de idioma disponibles
          </div>
        )}
      </div>
    </div>
  );
};