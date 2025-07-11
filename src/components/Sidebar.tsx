import React from 'react';
import { 
  Users, 
  Settings, 
  Star, 
  Building, 
  Car, 
  UtensilsCrossed, 
  Store, 
  Route, 
  MapPin, 
  Calendar, 
  Image,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const menuItems = [
  { id: 'usuarios', label: 'Usuarios', icon: Users },
  { id: 'servicios', label: 'Servicios', icon: Settings },
  { id: 'experiencias', label: 'Experiencias', icon: Star },
  { id: 'hoteles', label: 'Hoteles', icon: Building },
  { id: 'transportes', label: 'Transportes', icon: Car },
  { id: 'restaurantes', label: 'Restaurantes', icon: UtensilsCrossed },
  { id: 'mayoristas', label: 'Mayoristas', icon: Store },
  { id: 'rutas', label: 'Rutas', icon: Route },
  { id: 'viajes', label: 'Viajes', icon: MapPin },
  { id: 'fechas-bloqueadas', label: 'Restricciones', icon: Calendar },
  { id: 'fotos', label: 'Fotos', icon: Image },
];

export const Sidebar: React.FC<SidebarProps> = ({ 
  isCollapsed, 
  onToggle, 
  activeSection, 
  onSectionChange 
}) => {
  return (
    <div className={`bg-white border-r border-gray-200 transition-all duration-300 flex-shrink-0 ${
      isCollapsed ? 'w-16' : 'w-64'
    } flex flex-col h-full overflow-hidden`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <img 
              src="/logo-horizontal-color.png" 
              alt="ReservaT" 
              className="h-8"
            />
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="h-6 w-6 text-gray-600" />
          ) : (
            <ChevronLeft className="h-6 w-6 text-gray-600" />
          )}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2 rounded-lg transition-all duration-300 ${
                isActive 
                  ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon 
                className={`${isActive ? 'text-blue-700' : 'text-gray-500'} flex-shrink-0`}
                size={isCollapsed ? 22 : 20}
              />
              {!isCollapsed && (
                <span className="font-medium whitespace-nowrap">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};