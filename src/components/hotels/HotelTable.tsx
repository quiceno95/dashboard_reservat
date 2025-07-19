import React from 'react';
import { HotelUnificado } from '../../types/hotel';

interface Props {
  hotels: HotelUnificado[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const HotelTable: React.FC<Props> = ({ hotels, onView, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto rounded-lg shadow border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">Proveedor</th>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">Ciudad</th>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">Email</th>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">Tipo Doc</th>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">Número Doc</th>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">Estrellas</th>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">Habitaciones</th>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">Recepción 24h</th>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">Piscina</th>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {hotels.map(h => (
            <tr key={h.id_hotel}>
              <td className="px-4 py-2 whitespace-nowrap">{h.nombre_proveedor}</td>
              <td className="px-4 py-2 whitespace-nowrap">{h.ciudad}</td>
              <td className="px-4 py-2 whitespace-nowrap">
                <span className="text-blue-600 text-xs">{h.email || 'N/A'}</span>
              </td>
              <td className="px-4 py-2 whitespace-nowrap">
                <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs">
                  {h.tipo_documento || 'N/A'}
                </span>
              </td>
              <td className="px-4 py-2 whitespace-nowrap">
                <span className="text-gray-600 text-xs font-mono">
                  {h.numero_documento || 'N/A'}
                </span>
              </td>
              <td className="px-4 py-2 whitespace-nowrap">{h.estrellas}</td>
              <td className="px-4 py-2 whitespace-nowrap">{h.numero_habitaciones}</td>
              <td className="px-4 py-2 whitespace-nowrap">
                {h.recepcion_24_horas ? (
                  <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs">Sí</span>
                ) : (
                  <span className="px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs">No</span>
                )}
              </td>
              <td className="px-4 py-2 whitespace-nowrap">
                {h.piscina ? (
                  <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs">Sí</span>
                ) : (
                  <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-600 text-xs">No</span>
                )}
              </td>
              {/* Acciones */}
              <td className="px-4 py-2 whitespace-nowrap">
                <div className="flex items-center space-x-2">
                  <button title="Ver" onClick={() => onView(h.id_hotel)} className="p-1 rounded hover:bg-gray-100 text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button 
                    title="Editar" 
                    onClick={() => onEdit(h.id_hotel)}
                    className="p-1 rounded hover:bg-gray-100 text-gray-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.586-9.414a2 2 0 112.828 2.828L11.828 15 9 15l0-2.828 9.414-9.414z" />
                    </svg>
                  </button>
                  <button 
                    title="Eliminar" 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onDelete(h.id_hotel);
                    }}
                    className="p-1 rounded hover:bg-red-50 text-red-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3m-4 0h14" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
