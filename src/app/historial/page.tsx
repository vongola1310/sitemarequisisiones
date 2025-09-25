"use client";

import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Solicitud {
  id: number;
  folio: string;
  fechaSolicitud: string;
  proyectoDestino: string;
  areaSolicitante: string;
  status: string;
  reporteServicio?: {
    id: number;
  } | null;
}

export default function HistorialPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchSolicitudes = async () => {
      if (status === "authenticated") {
        try {
          const response = await fetch("/api/historial");
          if (!response.ok) {
            throw new Error('Error al cargar las solicitudes');
          }
          const data: Solicitud[] = await response.json();
          setSolicitudes(data);
        } catch (err) {
          setError('No se pudieron cargar las solicitudes. Inténtalo de nuevo.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchSolicitudes();
  }, [status]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pendiente': return '#72C054';
      case 'En Revisión': return '#008343';
      case 'En ejecución': return '#0D7680';
      case 'Pendiente de firma': return '#7C3996';
      case 'Cerrado': return '#6B7280';
      case 'Rechazada': return '#DC2626';
      default: return '#6B7280';
    }
  };

  const renderActionButton = (solicitud: Solicitud) => {
    if (solicitud.status === 'Pendiente de firma' && solicitud.reporteServicio) {
      return (
        <Link href={`/firmar-reporte/${solicitud.reporteServicio.id}`}>
          <button
            className="px-4 py-2 rounded-lg font-medium text-white transition-all duration-300 transform hover:scale-105 active:scale-95 inline-flex items-center space-x-2"
            style={{
              background: `linear-gradient(135deg, #7C3996 0%, #0D7680 100%)`,
              boxShadow: `0 4px 15px rgba(124, 57, 150, 0.3)`
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Firmar</span>
          </button>
        </Link>
      );
    }

    if (solicitud.status === 'Cerrado' && solicitud.reporteServicio) {
      return (
        <Link href={`/resumen-reporte/${solicitud.reporteServicio.id}`}>
          <button
            className="px-4 py-2 rounded-lg font-medium text-white transition-all duration-300 transform hover:scale-105 active:scale-95 inline-flex items-center space-x-2"
            style={{
              background: `linear-gradient(135deg, #72C054 0%, #008343 100%)`,
              boxShadow: `0 4px 15px rgba(114, 192, 84, 0.3)`
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>Ver Resumen</span>
          </button>
        </Link>
      );
    }

    return (
      <span className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 bg-gray-700/50">
        Sin acciones
      </span>
    );
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div 
            className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
            style={{borderColor: '#72C054', borderTopColor: 'transparent'}}
          ></div>
          <p className="text-black text-lg font-medium">Cargando historial...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="bg-black/90 backdrop-blur-lg border rounded-2xl shadow-2xl p-8 text-center max-w-md relative"
              style={{borderColor: '#7C3996' + '30'}}>
          <div className="absolute top-0 left-0 right-0 h-px"
                style={{background: `linear-gradient(90deg, transparent, #7C3996, transparent)`}}></div>
          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
               style={{backgroundColor: '#7C3996'}}>
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Error de Conexión</h2>
          <p className="text-white/80 mb-6">{error}</p>
          <Link href="/dashboard">
            <button 
              className="px-6 py-3 rounded-xl font-medium text-white transition-all duration-300 transform hover:scale-105"
              style={{background: `linear-gradient(135deg, #72C054 0%, #008343 100%)`}}
            >
              Volver al Dashboard
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 relative">
      {/* Fondos animados */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse" style={{backgroundColor: '#72C054'}}></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-12 animate-pulse" style={{backgroundColor: '#008343', animationDelay: '2s'}}></div>
        <div className="absolute top-1/3 right-1/4 w-60 h-60 rounded-full mix-blend-multiply filter blur-xl opacity-8 animate-pulse" style={{backgroundColor: '#7C3996', animationDelay: '4s'}}></div>
        <div className="absolute bottom-1/3 left-1/4 w-60 h-60 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse" style={{backgroundColor: '#0D7680', animationDelay: '1s'}}></div>
      </div>

      {/* Contenedor */}
      <div className="relative max-w-7xl mx-auto">
        {/* Header + Botón Volver */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/dashboard">
            <button
              className="px-4 py-2 rounded-lg font-medium text-white transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center space-x-2"
              style={{
                background: `linear-gradient(135deg, #7C3996 0%, #0D7680 100%)`,
                boxShadow: `0 4px 15px rgba(124, 57, 150, 0.3)`
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Volver al Dashboard</span>
            </button>
          </Link>

          <h1 className="text-3xl font-bold text-white">Historial de Solicitudes</h1>
        </div>

        {/* Tabla */}
        <div className="bg-black/90 backdrop-blur-lg border rounded-2xl shadow-2xl relative overflow-hidden" style={{borderColor: '#008343' + '30'}}>
          <div className="absolute top-0 left-0 right-0 h-px" style={{background: `linear-gradient(90deg, transparent, #008343, transparent)`}}></div>
          <div className="p-6">
            {solicitudes.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b" style={{borderColor: '#008343' + '20'}}>
                      <th className="text-left py-4 px-6 text-white font-semibold">Folio</th>
                      <th className="text-left py-4 px-6 text-white font-semibold">Proyecto</th>
                      <th className="text-left py-4 px-6 text-white font-semibold">Área</th>
                      <th className="text-left py-4 px-6 text-white font-semibold">Fecha</th>
                      <th className="text-left py-4 px-6 text-white font-semibold">Estado</th>
                      <th className="text-left py-4 px-6 text-white font-semibold">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {solicitudes.map((solicitud, index) => (
                      <tr key={solicitud.id} className="border-b hover:bg-white/5 transition-colors duration-300" style={{borderColor: '#008343' + '20'}}>
                        <td className="py-4 px-6 text-white font-medium">#{index + 1} - {solicitud.folio}</td>
                        <td className="py-4 px-6 text-white/80">{solicitud.proyectoDestino}</td>
                        <td className="py-4 px-6 text-white/80">{solicitud.areaSolicitante}</td>
                        <td className="py-4 px-6 text-white/80">{new Date(solicitud.fechaSolicitud).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                        <td className="py-4 px-6">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold text-white" style={{backgroundColor: getStatusColor(solicitud.status)}}>
                            {solicitud.status}
                          </span>
                        </td>
                        <td className="py-4 px-6">{renderActionButton(solicitud)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{backgroundColor: '#0D7680' + '20'}}>
                  <svg className="w-10 h-10" style={{color: '#0D7680'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No hay solicitudes</h3>
                <p className="text-white/60 mb-8">Aún no has creado ninguna requisición.</p>
                <Link href="/solicitud-requisicion">
                  <button className="px-8 py-3 rounded-xl font-medium text-white transition-all duration-300 transform hover:scale-105 inline-flex items-center space-x-2" style={{background: `linear-gradient(135deg, #72C054 0%, #008343 100%)`, boxShadow: `0 6px 20px rgba(114, 192, 84, 0.4)`}}>
                    Crear Primera Solicitud
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
