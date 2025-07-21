import React from 'react';
import { LogOut, User, Mail, Shield, Clock, Menu } from 'lucide-react';
import { UserData } from '../types/auth';
import { Sidebar } from './Sidebar';
import { UsersSection } from './users/UsersSection';
import { ExperiencesSection } from './experiences/ExperiencesSection';
import { HotelsSection } from './hotels/HotelsSection';
import MayoristasSection from './mayoristas/MayoristasSection';
import RestaurantesSection from './restaurantes/RestaurantesSection';
import RutasSection from './rutas/RutasSection';
import TransportesSection from './transportes/TransportesSection';
import ViajesSection from './viajes/ViajesSection';
import RestriccionesSection from './restricciones/RestriccionesSection';
import FotosSection from './fotos/FotosSection';
import ServiciosSection from './servicios/ServiciosSection';

interface DashboardProps {
  user: UserData;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState('usuarios');

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'usuarios':
        return <UsersSection />;
      case 'servicios':
        return <ServiciosSection />;
      case 'experiencias':
        return <ExperiencesSection />;
      case 'hoteles':
        return <HotelsSection />;
      case 'mayoristas':
        return <MayoristasSection />;
      case 'restaurantes':
        return <RestaurantesSection />;
      case 'rutas':
        return <RutasSection />;
      case 'transportes':
        return <TransportesSection />;
      case 'viajes':
        return <ViajesSection />;
      case 'fechas-bloqueadas':
        return <RestriccionesSection />;
      case 'fotos':
        return <FotosSection />;
      default:
        return <div className="text-center py-12 text-gray-500">Sección en desarrollo</div>;
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleSidebar}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <Menu className="h-5 w-5 text-gray-600" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                Panel de Administración
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>{user.email}</span>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto">
        {renderContent()}
      </main>
        </div>
    </div>
  );
};