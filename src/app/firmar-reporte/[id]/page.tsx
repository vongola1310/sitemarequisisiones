// src/app/firmar-reporte/[id]/page.tsx
"use client";

import { useState, useEffect, use } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ReporteDetalle {
  id: number;
  solicitudId: number;
  folioSolicitud: string;
  fechaEntrega: string;
  proyecto: string;
  area: string;
  responsable: string;
  correoResponsable: string;
  accionesRealizadas: string;
  descripcionEntregables: string;
  observaciones?: string;
  solicitud?: {
    id: number;
    folio: string;
    fechaSolicitud: string;
    proyectoDestino: string;
    areaSolicitante: string;
    descripcion: string;
    status: string;
  };
  ingeniero?: {
    id: number;
    name: string;
    email: string;
  };
}

export default function FirmarReportePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = resolvedParams;

  const [reporte, setReporte] = useState<ReporteDetalle | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  // Redirigir si no está autenticado
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Cargar datos del reporte
  useEffect(() => {
    const fetchReporte = async () => {
      if (status === "authenticated") {
        try {
          const response = await fetch(`/api/reporte-servicio/${id}`);
          if (!response.ok) throw new Error("No se pudo cargar el reporte");
          const data = await response.json();
          setReporte(data);
        } catch (err) {
          setMessage("Ocurrió un error al cargar los datos del reporte.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchReporte();
  }, [id, status]);

  const handleFirmar = async () => {
    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch(`/api/reporte-servicio/${id}/firmar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok)
        throw new Error(`Error en el servidor: ${response.statusText}`);

      await response.json();
      setMessage("Reporte firmado con éxito! La solicitud ha sido cerrada.");
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch (error) {
      console.error("Error al firmar el reporte:", error);
      setMessage("Ocurrió un error al firmar el reporte.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading" || loading || !reporte) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div 
            className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
            style={{borderColor: '#72C054', borderTopColor: 'transparent'}}
          ></div>
          <p className="text-black text-lg font-medium">Cargando reporte...</p>
        </div>
      </div>
    );
  }

  // Verificar que el usuario pueda firmar este reporte
  if (session?.user?.role === "ingeniero") {
    router.push("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-white p-4 relative">
      {/* Efectos de fondo animados */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse"
          style={{backgroundColor: '#72C054'}}
        ></div>
        <div 
          className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-12 animate-pulse"
          style={{backgroundColor: '#008343', animationDelay: '2s'}}
        ></div>
        <div 
          className="absolute top-1/3 right-1/4 w-60 h-60 rounded-full mix-blend-multiply filter blur-xl opacity-8 animate-pulse"
          style={{backgroundColor: '#7C3996', animationDelay: '4s'}}
        ></div>
        <div 
          className="absolute bottom-1/3 left-1/4 w-60 h-60 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"
          style={{backgroundColor: '#0D7680', animationDelay: '1s'}}
        ></div>
      </div>

      {/* Contenedor principal */}
      <div className="relative max-w-5xl mx-auto">
        {/* Header con botón de regresar */}
        <div className="bg-black/90 backdrop-blur-lg border rounded-2xl shadow-2xl p-6 mb-6 relative overflow-hidden"
             style={{borderColor: '#008343' + '30'}}>
          <div className="absolute top-0 left-0 right-0 h-px"
               style={{background: `linear-gradient(90deg, transparent, #008343, transparent)`}}></div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <button 
                  className="p-3 rounded-xl font-medium text-white transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center space-x-2"
                  style={{
                    background: `linear-gradient(135deg, #0D7680 0%, #7C3996 100%)`,
                    boxShadow: `0 4px 15px #0D7680` + '30'
                  }}
                  onMouseEnter={(e) => {
                    const target = e.target as HTMLButtonElement;
                    target.style.background = `linear-gradient(135deg, #7C3996 0%, #0D7680 100%)`;
                    target.style.boxShadow = `0 6px 20px #0D7680` + '40';
                  }}
                  onMouseLeave={(e) => {
                    const target = e.target as HTMLButtonElement;
                    target.style.background = `linear-gradient(135deg, #0D7680 0%, #7C3996 100%)`;
                    target.style.boxShadow = `0 4px 15px #0D7680` + '30';
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
              </Link>
              
              <div className="flex items-center space-x-3">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{backgroundColor: '#008343'}}
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Firma de Reporte</h1>
                  <p className="text-white/70">Folio: {reporte.folioSolicitud}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                style={{background: `linear-gradient(135deg, #008343 0%, #72C054 100%)`}}
              >
                {session?.user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="text-right">
                <p className="text-white font-medium">{session?.user?.name}</p>
                <p className="text-white/60 text-sm">Solicitante</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mensaje de estado */}
        {message && (
          <div 
            className={`mb-6 p-4 rounded-xl border backdrop-blur-sm transition-all duration-300`}
            style={{
              backgroundColor: message.includes('éxito') ? '#72C054' + '20' : '#7C3996' + '20',
              borderColor: message.includes('éxito') ? '#72C054' : '#7C3996',
              color: 'black'
            }}
          >
            <div className="flex items-center space-x-2">
              {message.includes('éxito') ? (
                <svg className="w-5 h-5" style={{color: '#72C054'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5" style={{color: '#7C3996'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <span className="font-medium">{message}</span>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Información del Proyecto */}
          <div className="bg-black/90 backdrop-blur-lg border rounded-2xl shadow-2xl p-6 relative overflow-hidden"
               style={{borderColor: '#72C054' + '30'}}>
            <div className="absolute top-0 left-0 right-0 h-px"
                 style={{background: `linear-gradient(90deg, transparent, #72C054, transparent)`}}></div>
            
            <div className="flex items-center mb-6">
              <div 
                className="w-10 h-10 rounded-lg mr-4 flex items-center justify-center"
                style={{backgroundColor: '#72C054'}}
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white">Información del Proyecto</h2>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-white/60 text-sm font-medium">Proyecto</span>
                <p className="text-white font-semibold">{reporte.proyecto}</p>
              </div>
              <div>
                <span className="text-white/60 text-sm font-medium">Área</span>
                <p className="text-white font-semibold">{reporte.area}</p>
              </div>
              <div>
                <span className="text-white/60 text-sm font-medium">Descripción Original</span>
                <p className="text-white/80 text-sm">{reporte.solicitud?.descripcion}</p>
              </div>
              <div>
                <span className="text-white/60 text-sm font-medium">Fecha de Entrega</span>
                <p className="text-white font-semibold">
                  {new Date(reporte.fechaEntrega).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Información del Responsable */}
          <div className="bg-black/90 backdrop-blur-lg border rounded-2xl shadow-2xl p-6 relative overflow-hidden"
               style={{borderColor: '#0D7680' + '30'}}>
            <div className="absolute top-0 left-0 right-0 h-px"
                 style={{background: `linear-gradient(90deg, transparent, #0D7680, transparent)`}}></div>
            
            <div className="flex items-center mb-6">
              <div 
                className="w-10 h-10 rounded-lg mr-4 flex items-center justify-center"
                style={{backgroundColor: '#0D7680'}}
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white">Ingeniero Responsable</h2>
            </div>

            <div className="text-center py-6">
              <div 
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-xl font-bold shadow-lg"
                style={{background: `linear-gradient(135deg, #0D7680 0%, #7C3996 100%)`}}
              >
                {reporte.responsable?.charAt(0).toUpperCase() || 'I'}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{reporte.responsable}</h3>
              <p className="text-white/60 text-sm">{reporte.correoResponsable}</p>
              <div 
                className="inline-flex items-center mt-3 px-3 py-1 rounded-full text-xs font-semibold text-white"
                style={{backgroundColor: '#0D7680'}}
              >
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Reporte Completado
              </div>
            </div>
          </div>

          {/* Acciones Realizadas */}
          <div className="bg-black/90 backdrop-blur-lg border rounded-2xl shadow-2xl p-6 relative overflow-hidden"
               style={{borderColor: '#008343' + '30'}}>
            <div className="absolute top-0 left-0 right-0 h-px"
                 style={{background: `linear-gradient(90deg, transparent, #008343, transparent)`}}></div>
            
            <div className="flex items-center mb-4">
              <div 
                className="w-10 h-10 rounded-lg mr-4 flex items-center justify-center"
                style={{backgroundColor: '#008343'}}
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white">Acciones Realizadas</h2>
            </div>

            <div className="bg-black/30 p-4 rounded-lg border border-white/10">
              <p className="text-white/90 text-sm leading-relaxed whitespace-pre-line">
                {reporte.accionesRealizadas}
              </p>
            </div>
          </div>

          {/* Entregables */}
          <div className="bg-black/90 backdrop-blur-lg border rounded-2xl shadow-2xl p-6 relative overflow-hidden"
               style={{borderColor: '#7C3996' + '30'}}>
            <div className="absolute top-0 left-0 right-0 h-px"
                 style={{background: `linear-gradient(90deg, transparent, #7C3996, transparent)`}}></div>
            
            <div className="flex items-center mb-4">
              <div 
                className="w-10 h-10 rounded-lg mr-4 flex items-center justify-center"
                style={{backgroundColor: '#7C3996'}}
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white">Entregables</h2>
            </div>

            <div className="bg-black/30 p-4 rounded-lg border border-white/10">
              <p className="text-white/90 text-sm leading-relaxed whitespace-pre-line">
                {reporte.descripcionEntregables}
              </p>
            </div>
          </div>
        </div>

        {/* Botón de firma */}
        <div className="mt-8 text-center">
          <div className="bg-black/90 backdrop-blur-lg border rounded-2xl shadow-2xl p-8 relative overflow-hidden"
               style={{borderColor: '#72C054' + '30'}}>
            <div className="absolute top-0 left-0 right-0 h-px"
                 style={{background: `linear-gradient(90deg, transparent, #72C054, transparent)`}}></div>
            
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-3">Confirmar Recepción del Servicio</h3>
              <p className="text-white/70">
                Al firmar este reporte, confirmas que has recibido el servicio solicitado 
                y estás conforme con el trabajo realizado. La solicitud se marcará como cerrada.
              </p>
            </div>

            <button
              onClick={handleFirmar}
              disabled={isSubmitting}
              className="px-12 py-4 rounded-xl font-bold text-lg text-white transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-3 mx-auto"
              style={{
                background: `linear-gradient(135deg, #72C054 0%, #008343 100%)`,
                boxShadow: `0 8px 25px #72C054` + '40'
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  const target = e.target as HTMLButtonElement;
                  target.style.background = `linear-gradient(135deg, #008343 0%, #72C054 100%)`;
                  target.style.boxShadow = `0 12px 35px #72C054` + '60';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) {
                  const target = e.target as HTMLButtonElement;
                  target.style.background = `linear-gradient(135deg, #72C054 0%, #008343 100%)`;
                  target.style.boxShadow = `0 8px 25px #72C054` + '40';
                }
              }}
            >
              {isSubmitting ? (
                <>
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Firmando Reporte...</span>
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Firmar y Cerrar Solicitud</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}