import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, X, CheckCircle, XCircle, MapPin, Clock, Users, Star, Globe, Eye, Edit, Trash2 } from 'lucide-react';
import { ExperienciaCompleta } from '../../types/experience';
import { ExperienceDetailModal } from './ExperienceDetailModal';
import { EditExperienceModal } from './EditExperienceModal';
import { experienceService } from '../../services/experienceService';
import Swal from 'sweetalert2';

interface ExperienceTableProps {
  experiences: ExperienciaCompleta[];
  searchTerm: string;
  isSearching: boolean;
  onSearchChange: (term: string) => void;
  onClearSearch: () => void;
  loading: boolean;
  currentPage: number;
  totalPages: number;
  totalExperiences: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onDataChange?: () => void; // Nueva prop para notificar cambios
}

export const ExperienceTable: React.FC<ExperienceTableProps> = ({
  experiences,
  searchTerm,
  isSearching,
  onSearchChange,
  onClearSearch,
  loading,
  currentPage,
  totalPages,
  totalExperiences,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onDataChange
}) => {
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedExperienceId, setSelectedExperienceId] = useState<string | null>(null);
  const [experienceDetailData, setExperienceDetailData] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editExperienceData, setEditExperienceData] = useState<any>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const safeExperiences = Array.isArray(experiences) ? experiences : [];
  const displayExperiences = safeExperiences;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getVerificationBadge = (isVerified: boolean) => {
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isVerified 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
      }`}>
        {isVerified ? (
          <>
            <CheckCircle className="h-3 w-3 mr-1" />
            Verificado
          </>
        ) : (
          <>
            <XCircle className="h-3 w-3 mr-1" />
            No Verificado
          </>
        )}
      </span>
    );
  };

  const getDifficultyBadge = (difficulty: string) => {
    const colors = {
      'fácil': 'bg-green-100 text-green-800',
      'moderado': 'bg-yellow-100 text-yellow-800',
      'difícil': 'bg-red-100 text-red-800',
      'extremo': 'bg-purple-100 text-purple-800'
    };

    const normalizedDifficulty = difficulty.toLowerCase();
    const colorClass = colors[normalizedDifficulty as keyof typeof colors] || 'bg-gray-100 text-gray-800';

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
      </span>
    );
  };

  const getLanguageBadge = (language: string) => {
    const colors = {
      'español': 'bg-orange-100 text-orange-800',
      'inglés': 'bg-blue-100 text-blue-800',
      'francés': 'bg-purple-100 text-purple-800',
      'portugués': 'bg-green-100 text-green-800'
    };

    const normalizedLanguage = language.toLowerCase();
    const colorClass = colors[normalizedLanguage as keyof typeof colors] || 'bg-gray-100 text-gray-800';

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
        <Globe className="h-3 w-3 mr-1" />
        {language}
      </span>
    );
  };

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const handleLocalSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    const newTimeout = setTimeout(() => {
      onSearchChange(value);
    }, 500);
    
    setSearchTimeout(newTimeout);
  };

  const handleClearSearch = () => {
    setLocalSearchTerm('');
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    onClearSearch();
  };

  const handleViewExperience = async (experienceId: string) => {
    try {
      setSelectedExperienceId(experienceId);
      setDetailModalOpen(true);
      setDetailLoading(true);
      setExperienceDetailData(null);
      
      console.log('👁️ Cargando detalles de experiencia:', experienceId);
      
      const data = await experienceService.getExperienceById(experienceId);
      setExperienceDetailData(data);
    } catch (error) {
      console.error('Error cargando detalles de experiencia:', error);
      
      await Swal.fire({
        title: 'Error',
        text: 'No se pudieron cargar los detalles de la experiencia',
        icon: 'error',
        confirmButtonColor: '#dc2626',
        confirmButtonText: 'Entendido',
        customClass: {
          popup: 'rounded-xl shadow-2xl',
          title: 'text-xl font-bold text-gray-900',
          confirmButton: 'px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg',
        },
        buttonsStyling: false
      });
      
      setDetailModalOpen(false);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleEditExperience = async (experienceId: string) => {
    try {
      setEditModalOpen(true);
      setEditLoading(true);
      setEditExperienceData(null);
      
      console.log('✏️ Cargando datos para editar experiencia:', experienceId);
      
      const data = await experienceService.getExperienceById(experienceId);
      setEditExperienceData(data);
    } catch (error) {
      console.error('Error cargando datos para edición:', error);
      
      await Swal.fire({
        title: 'Error',
        text: 'No se pudieron cargar los datos de la experiencia para editar',
        icon: 'error',
        confirmButtonColor: '#dc2626',
        confirmButtonText: 'Entendido',
        customClass: {
          popup: 'rounded-xl shadow-2xl',
          title: 'text-xl font-bold text-gray-900',
          confirmButton: 'px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg',
        },
        buttonsStyling: false
      });
      
      setEditModalOpen(false);
    } finally {
      setEditLoading(false);
    }
  };

  const handleSaveExperience = async (experienceData: any) => {
    if (!selectedExperienceId) return;
    
    try {
      setSaveLoading(true);
      
      console.log('💾 Guardando cambios en experiencia:', selectedExperienceId);
      
      const result = await experienceService.updateExperience(selectedExperienceId, experienceData);
      
      // Cerrar modal
      setEditModalOpen(false);
      setEditExperienceData(null);
      
      // Mostrar mensaje de éxito
      await Swal.fire({
        title: '¡Experiencia Actualizada!',
        text: result.message || 'La experiencia se ha actualizado correctamente',
        icon: 'success',
        confirmButtonColor: '#059669',
        confirmButtonText: 'Perfecto',
        customClass: {
          popup: 'rounded-xl shadow-2xl',
          title: 'text-xl font-bold text-gray-900',
          confirmButton: 'px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg',
        },
        buttonsStyling: false,
        timer: 3000,
        timerProgressBar: true
      });
      
      // Notificar al componente padre que los datos han cambiado
      if (onDataChange) {
        onDataChange();
      }
      
    } catch (error) {
      console.error('Error guardando experiencia:', error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Error al actualizar la experiencia';
      
      await Swal.fire({
        title: 'Error al Guardar',
        text: errorMessage,
        icon: 'error',
        confirmButtonColor: '#dc2626',
        confirmButtonText: 'Entendido',
        customClass: {
          popup: 'rounded-xl shadow-2xl',
          title: 'text-xl font-bold text-gray-900',
          confirmButton: 'px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg',
        },
        buttonsStyling: false
      });
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDeleteExperience = async (experienceId: string) => {
    // Find the experience to get their name for the confirmation
    const experienceToDelete = experiences.find(exp => exp.id_experiencia === experienceId);
    const experienceName = experienceToDelete ? experienceToDelete.proveedor_nombre : 'esta experiencia';

    const result = await Swal.fire({
      title: '¿Estás seguro?',
      html: `
        <div class="text-center">
          <div class="mb-4">
            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
          <p class="text-gray-600 mb-2">Vas a eliminar la experiencia de:</p>
          <p class="font-semibold text-gray-900 text-lg">${experienceName}</p>
          <p class="text-sm text-gray-500 mt-2">Esta acción no se puede deshacer</p>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      customClass: {
        popup: 'rounded-xl shadow-2xl',
        title: 'text-xl font-bold text-gray-900',
        confirmButton: 'px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg',
        cancelButton: 'px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg',
      },
      buttonsStyling: false,
      focusConfirm: false,
      focusCancel: true
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      console.log('🗑️ Intentando eliminar experiencia con ID:', experienceId);
      const result = await experienceService.deleteExperience(experienceId);
      console.log('✅ Experiencia eliminada exitosamente:', result);
      
      // Show success message from API or default message
      const successMessage = (result && typeof result === 'object' && 'message' in result) 
        ? result.message 
        : 'Experiencia eliminada correctamente';
      
      // Show success alert
      await Swal.fire({
        title: '¡Eliminada!',
        text: successMessage,
        icon: 'success',
        confirmButtonColor: '#059669',
        confirmButtonText: 'Entendido',
        customClass: {
          popup: 'rounded-xl shadow-2xl',
          title: 'text-xl font-bold text-gray-900',
          confirmButton: 'px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg',
        },
        buttonsStyling: false,
        timer: 3000,
        timerProgressBar: true
      });
      
      // Notificar al componente padre que los datos han cambiado
      if (onDataChange) {
        onDataChange();
      }
      
    } catch (error) {
      console.error('❌ Error eliminando experiencia:', error);
      
      // Show the specific error message from the API
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Error al eliminar la experiencia';
      
      // Show error alert
      await Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error',
        confirmButtonColor: '#dc2626',
        confirmButtonText: 'Entendido',
        customClass: {
          popup: 'rounded-xl shadow-2xl',
          title: 'text-xl font-bold text-gray-900',
          confirmButton: 'px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg',
        },
        buttonsStyling: false
      });
    }
  };

  const closeDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedExperienceId(null);
    setExperienceDetailData(null);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditExperienceData(null);
    setSaveLoading(false);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm">
      {/* Search Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {isSearching ? (
              <span>
                Resultados de búsqueda: <span className="text-blue-600">{totalExperiences}</span> experiencias encontradas
                {searchTerm && (
                  <span className="text-sm font-normal text-gray-600 ml-2">
                    para "{searchTerm}"
                  </span>
                )}
              </span>
            ) : (
              `Lista de Experiencias (${totalExperiences} total)`
            )}
          </h3>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Mostrar:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span className="text-sm text-gray-600">por página</span>
          </div>
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className={`h-5 w-5 ${isSearching ? 'text-blue-500' : 'text-gray-400'}`} />
          </div>
          <input
            type="text"
            placeholder="Buscar experiencias por proveedor, ciudad, idioma, dificultad..."
            value={localSearchTerm}
            onChange={handleLocalSearchChange}
            className={`block w-full pl-10 pr-12 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              isSearching ? 'border-blue-300 bg-blue-50' : 'border-gray-300'
            }`}
          />
          {(localSearchTerm || isSearching) && (
            <button
              onClick={handleClearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              title="Limpiar búsqueda"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        
        {isSearching && (
          <div className="mt-2 text-sm text-blue-600 flex items-center">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
            Buscando en toda la base de datos...
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Proveedor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ubicación
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Experiencia
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Detalles
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Registro
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayExperiences.map((experience) => (
              <tr key={experience.id_experiencia} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {experience.proveedor_nombre.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {experience.proveedor_nombre}
                      </div>
                      <div className="text-sm text-gray-500">
                        {experience.proveedor_email}
                      </div>
                      <div className="flex items-center mt-1">
                        <Star className="h-3 w-3 text-yellow-400 mr-1" />
                        <span className="text-xs text-gray-600">
                          {experience.proveedor_rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                    <div>
                      <div>{experience.proveedor_ciudad}</div>
                      <div className="text-xs text-gray-500">{experience.proveedor_pais}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    {getDifficultyBadge(experience.dificultad)}
                    {getLanguageBadge(experience.idioma)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {experience.duracion}h
                    </div>
                    <div className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      Máx. {experience.grupo_maximo}
                    </div>
                    {experience.guia_incluido && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        Guía incluido
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getVerificationBadge(experience.proveedor_verificado)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(experience.fecha_registro)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleViewExperience(experience.id_experiencia)}
                      className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                      title="Ver detalles"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleEditExperience(experience.id_experiencia)}
                     onMouseEnter={() => setSelectedExperienceId(experience.id_experiencia)}
                      className="text-yellow-600 hover:text-yellow-900 p-2 rounded-lg hover:bg-yellow-50 transition-colors"
                      title="Editar experiencia"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteExperience(experience.id_experiencia)}
                      className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors"
                      title="Eliminar experiencia"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {displayExperiences.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              {isSearching || searchTerm ? (
                <div>
                  <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">No se encontraron resultados</p>
                  <p className="text-gray-500">
                    No hay experiencias que coincidan con "{searchTerm || localSearchTerm}"
                  </p>
                  <button
                    onClick={handleClearSearch}
                    className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Limpiar búsqueda
                  </button>
                </div>
              ) : (
                'No hay experiencias registradas'
              )}
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Mostrando {((currentPage - 1) * pageSize) + 1} a {Math.min(currentPage * pageSize, totalExperiences)} de {totalExperiences} experiencias
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-500"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Anterior
              </button>
              
              <div className="flex items-center space-x-1">
                {generatePageNumbers().map((page, index) => (
                  <React.Fragment key={index}>
                    {page === '...' ? (
                      <span className="px-3 py-2 text-sm text-gray-500">...</span>
                    ) : (
                      <button
                        onClick={() => onPageChange(page as number)}
                        className={`px-3 py-2 text-sm font-medium rounded-lg ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    )}
                  </React.Fragment>
                ))}
              </div>
              
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-500"
              >
                Siguiente
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Experience Detail Modal */}
      <ExperienceDetailModal
        isOpen={detailModalOpen}
        onClose={closeDetailModal}
        experienceData={experienceDetailData}
        loading={detailLoading}
      />

      {/* Experience Edit Modal */}
      <EditExperienceModal
        isOpen={editModalOpen}
        onClose={closeEditModal}
        experienceData={editExperienceData}
        onSave={handleSaveExperience}
        loading={editLoading}
        saveLoading={saveLoading}
      />
    </div>
  );
};