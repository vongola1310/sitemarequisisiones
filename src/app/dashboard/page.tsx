// src/app/dashboard/page.tsx

"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";

// Interfaz para las solicitudes
interface Solicitud {
  id: number;
  folio: string;
  fechaSolicitud: string;
  proyectoDestino: string;
  areaSolicitante: string;
  status: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loadingSolicitudes, setLoadingSolicitudes] = useState(true);
  const [errorSolicitudes, setErrorSolicitudes] = useState('');

  // Obtener rol del usuario e identificar si es ingeniero o gerente
  const userRole = session?.user?.role;
  const isIngeniero = userRole === 'ingeniero';
  const isGerente = userRole === 'gerente';

  // Cargar solicitudes asignadas para ingenieros
  useEffect(() => {
    const fetchSolicitudes = async () => {
      setLoadingSolicitudes(true);
      try {
        const response = await fetch("/api/solicitudes");
        if (!response.ok) {
          throw new Error('Error al cargar las solicitudes');
        }
        const data: Solicitud[] = await response.json();
        setSolicitudes(data);
      } catch (err) {
        setErrorSolicitudes('No se pudieron cargar las solicitudes.');
        console.error(err);
      } finally {
        setLoadingSolicitudes(false);
      }
    };

    if (isIngeniero || isGerente) {
      fetchSolicitudes();
    } else {
      setLoadingSolicitudes(false);
    }
  }, [isIngeniero, isGerente, status]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div 
            className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
            style={{borderColor: '#72C054', borderTopColor: 'transparent'}}
          ></div>
          <p className="text-black text-lg font-medium">Cargando...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  const handleSignOut = async () => {
    setIsLoading(true);
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative">
      {/* Efectos de fondo animados */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
          style={{backgroundColor: '#72C054'}}
        ></div>
        <div 
          className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse"
          style={{backgroundColor: '#008343', animationDelay: '2s'}}
        ></div>
        <div 
          className="absolute top-1/3 right-1/4 w-60 h-60 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"
          style={{backgroundColor: '#7C3996', animationDelay: '4s'}}
        ></div>
        <div 
          className="absolute bottom-1/3 left-1/4 w-60 h-60 rounded-full mix-blend-multiply filter blur-xl opacity-12 animate-pulse"
          style={{backgroundColor: '#0D7680', animationDelay: '1s'}}
        ></div>
      </div>

      {/* Contenedor principal */}
      <div className="relative w-full max-w-4xl">
        {/* Header con información del usuario */}
        <div className="bg-black/90 backdrop-blur-lg border rounded-2xl shadow-2xl p-6 mb-6 relative overflow-hidden"
             style={{borderColor: '#72C054' + '30'}}>
          <div className="absolute top-0 left-0 right-0 h-px"
               style={{background: `linear-gradient(90deg, transparent, #72C054, transparent)`}}></div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg"
                style={{background: `linear-gradient(135deg, #72C054 0%, #008343 100%)`}}
              >
                {session?.user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">
                  ¡Hola, {session?.user?.name}!
                </h1>
                <div className="flex items-center space-x-2">
                  <span className="text-white/80">Rol:</span>
                  <span 
                    className="px-3 py-1 rounded-full text-sm font-semibold text-white"
                    style={{backgroundColor: '#72C054'}}
                  >
                    {session?.user?.role}
                  </span>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleSignOut}
              disabled={isLoading}
              className="px-4 py-2 rounded-xl font-medium text-white transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
              style={{
                background: `linear-gradient(135deg, #7C3996 0%, #0D7680 100%)`,
                boxShadow: `0 4px 15px #7C3996` + '30'
              }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLButtonElement;
                target.style.background = `linear-gradient(135deg, #0D7680 0%, #7C3996 100%)`;
                target.style.boxShadow = `0 6px 20px #7C3996` + '40';
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLButtonElement;
                target.style.background = `linear-gradient(135deg, #7C3996 0%, #0D7680 100%)`;
                target.style.boxShadow = `0 4px 15px #7C3996` + '30';
              }}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Saliendo...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Cerrar Sesión</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Renderizado condicional basado en el rol del usuario */}
        {isIngeniero ? (
          // Contenido del dashboard para el Ingeniero
          <div className="bg-black/90 backdrop-blur-lg border rounded-2xl shadow-2xl p-8 relative overflow-hidden"
               style={{borderColor: '#0D7680' + '30'}}>
            <div className="absolute top-0 left-0 right-0 h-px"
                 style={{background: `linear-gradient(90deg, transparent, #0D7680, transparent)`}}></div>
            
            <div className="flex items-center mb-6">
              <div 
                className="w-10 h-10 rounded-lg mr-4 flex items-center justify-center"
                style={{backgroundColor: '#0D7680'}}
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-white">Mis Solicitudes</h2>
            </div>
            
            {loadingSolicitudes ? (
              <p className="text-white/60">Cargando solicitudes...</p>
            ) : errorSolicitudes ? (
              <p className="text-red-400">{errorSolicitudes}</p>
            ) : solicitudes.length > 0 ? (
              <div className="space-y-4 mt-6">
                {solicitudes.map(solicitud => (
                  <div key={solicitud.id} className="bg-white/10 p-4 rounded-lg flex flex-col md:flex-row justify-between md:items-center">
                    <div>
                      <p className="font-semibold text-white text-lg">{solicitud.proyectoDestino}</p>
                      <p className="text-sm text-white/60">Folio: {solicitud.folio}</p>
                    </div>

                    {/* Botones de acción del ingeniero */}
                    <div className="mt-4 md:mt-0 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                        {solicitud.status === 'Pendiente' && (
                            <Link href={`/solicitudes/${solicitud.id}`} passHref>
                                <button className="px-4 py-2 rounded-lg text-white font-medium transition-colors duration-300"
                                        style={{backgroundColor: '#0D7680'}}>
                                    Ver/Completar
                                </button>
                            </Link>
                        )}
                        {solicitud.status === 'En ejecución' && (
                            <Link href={`/reporte-servicio/${solicitud.id}`} passHref>
                                <button className="px-4 py-2 rounded-lg text-white font-medium transition-colors duration-300"
                                        style={{backgroundColor: '#72C054'}}>
                                    Realizar Reporte
                                </button>
                            </Link>
                        )}
                        {(solicitud.status === 'En Revisión' || solicitud.status === 'Rechazada') && (
                            <Link href={`/solicitudes/${solicitud.id}`} passHref>
                                <button className="px-4 py-2 rounded-lg text-white font-medium transition-colors duration-300"
                                        style={{backgroundColor: '#7C3996'}}>
                                    Ver Detalles
                                </button>
                            </Link>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/60">No tienes solicitudes asignadas.</p>
            )}
          </div>
        ) : isGerente ? (
          // Contenido del dashboard para el Gerente
          <div className="bg-black/90 backdrop-blur-lg border rounded-2xl shadow-2xl p-8 relative overflow-hidden"
               style={{borderColor: '#7C3996' + '30'}}>
            <div className="absolute top-0 left-0 right-0 h-px"
                 style={{background: `linear-gradient(90deg, transparent, #7C3996, transparent)`}}></div>
            
            <div className="flex items-center mb-6">
              <div 
                className="w-10 h-10 rounded-lg mr-4 flex items-center justify-center"
                style={{backgroundColor: '#7C3996'}}
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2zM5 19V6a2 2 0 012-2h10a2 2 0 012 2v13a2 2 0 01-2 2H7a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-white">Solicitudes para Aprobar</h2>
            </div>
            {loadingSolicitudes ? (
              <p className="text-white/60">Cargando solicitudes...</p>
            ) : errorSolicitudes ? (
              <p className="text-red-400">{errorSolicitudes}</p>
            ) : solicitudes.length > 0 ? (
              <div className="space-y-4 mt-6">
                {solicitudes.map(solicitud => (
                  <div key={solicitud.id} className="bg-white/10 p-4 rounded-lg flex flex-col md:flex-row justify-between md:items-center">
                    <div>
                      <p className="font-semibold text-white text-lg">{solicitud.proyectoDestino}</p>
                      <p className="text-sm text-white/60">Folio: {solicitud.folio}</p>
                    </div>
                    <Link href={`/aprobacion/${solicitud.id}`} passHref>
                      <button className="mt-4 md:mt-0 px-4 py-2 rounded-lg text-white font-medium transition-colors duration-300"
                              style={{backgroundColor: '#7C3996', boxShadow: `0 4px 15px #7C3996` + '30'}}>
                        Revisar
                      </button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/60">No hay solicitudes pendientes de aprobación.</p>
            )}
          </div>
        ) : (
          // Contenido del dashboard para el Usuario (Estela)
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-black/90 backdrop-blur-lg border rounded-2xl shadow-2xl p-8 relative overflow-hidden"
                 style={{borderColor: '#72C054' + '30'}}>
              <div className="absolute top-0 left-0 right-0 h-px"
                   style={{background: `linear-gradient(90deg, transparent, #72C054, transparent)`}}></div>
              
              <div className="flex items-center space-x-4 mb-4">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{backgroundColor: '#72C054'}}
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Llenar Formulario</h3>
                  <p className="text-white/60 text-sm">Crea una nueva solicitud</p>
                </div>
              </div>
              <Link href="/solicitud-requisicion" passHref>
                <button
                  className="w-full text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg inline-flex items-center justify-center space-x-3"
                  style={{
                    background: `linear-gradient(135deg, #72C054 0%, #008343 100%)`,
                    boxShadow: `0 6px 25px #72C054` + '40'
                  }}
                  onMouseEnter={(e) => {
                    const target = e.target as HTMLButtonElement;
                    target.style.background = `linear-gradient(135deg, #008343 0%, #72C054 100%)`;
                    target.style.boxShadow = `0 8px 30px #72C054` + '60';
                  }}
                  onMouseLeave={(e) => {
                    const target = e.target as HTMLButtonElement;
                    target.style.background = `linear-gradient(135deg, #72C054 0%, #008343 100%)`;
                    target.style.boxShadow = `0 6px 25px #72C054` + '40';
                  }}
                >
                  <span>Llenar Solicitud</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </Link>
            </div>

            <div className="bg-black/90 backdrop-blur-lg border rounded-2xl shadow-2xl p-8 relative overflow-hidden"
                 style={{borderColor: '#0D7680' + '30'}}>
              <div className="absolute top-0 left-0 right-0 h-px"
                   style={{background: `linear-gradient(90deg, transparent, #0D7680, transparent)`}}></div>
              
              <div className="flex items-center space-x-4 mb-4">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{backgroundColor: '#0D7680'}}
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Mis Solicitudes</h3>
                  <p className="text-white/60 text-sm">Revisa el estado de tus requisiciones</p>
                </div>
              </div>
              <Link href="/historial" passHref>
                <button 
                  className="w-full text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg inline-flex items-center justify-center space-x-3"
                  style={{
                    background: `linear-gradient(135deg, #0D7680 0%, #7C3996 100%)`,
                    boxShadow: `0 6px 25px #0D7680` + '40'
                  }}
                  onMouseEnter={(e) => {
                    const target = e.target as HTMLButtonElement;
                    target.style.background = `linear-gradient(135deg, #7C3996 0%, #0D7680 100%)`;
                    target.style.boxShadow = `0 8px 30px #0D7680` + '60';
                  }}
                  onMouseLeave={(e) => {
                    const target = e.target as HTMLButtonElement;
                    target.style.background = `linear-gradient(135deg, #0D7680 0%, #7C3996 100%)`;
                    target.style.boxShadow = `0 6px 25px #0D7680` + '40';
                  }}
                >
                  <span>Ver Historial</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}