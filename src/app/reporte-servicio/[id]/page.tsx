// src/app/reporte-servicio/[id]/page.tsx
"use client";

import { useState, useEffect, use } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface SolicitudDetalle {
  id: number;
  folio: string;
  fechaSolicitud: string;
  fechaEntregaFinal?: string;
  proyectoDestino: string;
  areaSolicitante: string;
  productoSolicitado?: Record<string, boolean | string>; // Cambio aquí
  status: string;
  descripcion?: string;
  solicitante?: {
    id: number;
    name: string;
    email: string;
  };
}

export default function ReporteServicioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = resolvedParams;

  const [solicitud, setSolicitud] = useState<SolicitudDetalle | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const [reporteData, setReporteData] = useState({
    accionesRealizadas: "",
    observaciones: "",
    descripcionEntregables: "",
  });

  // Redirigir si no está autenticado
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Cargar datos de la solicitud
  useEffect(() => {
    const fetchSolicitud = async () => {
      if (status === "authenticated") {
        try {
          const response = await fetch(`/api/solicitudes/${id}`);
          if (!response.ok) throw new Error("No se pudo cargar la solicitud");
          const data = await response.json();
          setSolicitud(data);
        } catch (err) {
          setMessage("Ocurrió un error al cargar los datos.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchSolicitud();
  }, [id, status]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setReporteData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch(`/api/reporte-servicio/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...reporteData,
          solicitudId: id,
          fechaEntrega: new Date().toISOString(),
          folioSolicitud: solicitud?.folio,
        }),
      });

      if (!response.ok)
        throw new Error(`Error en el servidor: ${response.statusText}`);

      await response.json();
      setMessage("Reporte de servicio guardado con éxito!");
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch (error) {
      console.error("Error al guardar el reporte:", error);
      setMessage("Ocurrió un error al guardar el reporte.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading" || loading || !solicitud) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div 
            className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
            style={{borderColor: '#72C054', borderTopColor: 'transparent'}}
          ></div>
          <p className="text-black text-lg font-medium">Cargando solicitud...</p>
        </div>
      </div>
    );
  }

  if (session?.user?.role !== "ingeniero" || solicitud.status !== "En ejecución") {
    router.push("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-white p-4 relative">
      {/* Efectos de fondo animados con TUS colores */}
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
             style={{borderColor: '#0D7680' + '30'}}>
          {/* Brillo sutil en la parte superior */}
          <div className="absolute top-0 left-0 right-0 h-px"
               style={{background: `linear-gradient(90deg, transparent, #0D7680, transparent)`}}></div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Botón de regresar */}
              <Link href="/dashboard">
                <button 
                  className="p-3 rounded-xl font-medium text-white transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center space-x-2"
                  style={{
                    background: `linear-gradient(135deg, #7C3996 0%, #0D7680 100%)`,
                    boxShadow: `0 4px 15px #7C3996` + '30'
                  }}
                  onMouseEnter={(e) => {
                    const target = e.target as HTMLButtonElement;
                    target.style.background = `linear-gradient(135deg, #0D7680 0%, #7C3996 100())`;
                    target.style.boxShadow = `0 6px 20px #7C3996` + '40';
                  }}
                  onMouseLeave={(e) => {
                    const target = e.target as HTMLButtonElement;
                    target.style.background = `linear-gradient(135deg, #7C3996 0%, #0D7680 100())`;
                    target.style.boxShadow = `0 4px 15px #7C3996` + '30';
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
              </Link>
              
              {/* Icono y título */}
              <div className="flex items-center space-x-3">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{backgroundColor: '#0D7680'}}
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Reporte de Servicio</h1>
                  <p className="text-white/70">Folio: {solicitud.folio}</p>
                </div>
              </div>
            </div>

            {/* Info del ingeniero */}
            <div className="flex items-center space-x-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                style={{background: `linear-gradient(135deg, #0D7680 0%, #7C3996 100())`}}
              >
                {session?.user?.name?.charAt(0).toUpperCase() || 'I'}
              </div>
              <div className="text-right">
                <p className="text-white font-medium">{session?.user?.name}</p>
                <p className="text-white/60 text-sm">Ingeniero</p>
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

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Información del Servicio */}
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white">Información del Servicio</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-3">
                <div>
                  <span className="text-white/60 text-sm font-medium">Proyecto</span>
                  <p className="text-white font-semibold">{solicitud.proyectoDestino}</p>
                </div>
                <div>
                  <span className="text-white/60 text-sm font-medium">Área Solicitante</span>
                  <p className="text-white font-semibold">{solicitud.areaSolicitante}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="text-white/60 text-sm font-medium">Solicitado por</span>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{backgroundColor: '#72C054'}}
                    >
                      {solicitud.solicitante?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{solicitud.solicitante?.name || 'Usuario'}</p>
                      <p className="text-white/60 text-xs">{solicitud.solicitante?.email}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <span className="text-white/60 text-sm font-medium">Descripción</span>
                <p className="text-white/80 text-sm">{solicitud.descripcion}</p>
              </div>
            </div>
          </div>

          {/* Acciones Realizadas */}
          <div className="bg-black/90 backdrop-blur-lg border rounded-2xl shadow-2xl p-6 relative overflow-hidden"
               style={{borderColor: '#008343' + '30'}}>
            <div className="absolute top-0 left-0 right-0 h-px"
                 style={{background: `linear-gradient(90deg, transparent, #008343, transparent)`}}></div>
            
            <div className="flex items-center mb-6">
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

            <textarea
              name="accionesRealizadas"
              value={reporteData.accionesRealizadas}
              onChange={handleChange}
              rows={5}
              className="w-full px-4 py-3 bg-black/50 border rounded-xl text-white transition-all duration-300 focus:outline-none resize-none"
              style={{borderColor: '#008343'}}
              placeholder="Describe detalladamente las acciones realizadas durante el servicio..."
              required
              onFocus={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.boxShadow = `0 0 0 2px #008343`;
                target.style.borderColor = '#72C054';
              }}
              onBlur={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.boxShadow = 'none';
                target.style.borderColor = '#008343';
              }}
            />
          </div>

          {/* Entregables */}
          <div className="bg-black/90 backdrop-blur-lg border rounded-2xl shadow-2xl p-6 relative overflow-hidden"
               style={{borderColor: '#7C3996' + '30'}}>
            <div className="absolute top-0 left-0 right-0 h-px"
                 style={{background: `linear-gradient(90deg, transparent, #7C3996, transparent)`}}></div>
            
            <div className="flex items-center mb-6">
              <div 
                className="w-10 h-10 rounded-lg mr-4 flex items-center justify-center"
                style={{backgroundColor: '#7C3996'}}
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white">Descripción de Entregables</h2>
            </div>

            <textarea
              name="descripcionEntregables"
              value={reporteData.descripcionEntregables}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 bg-black/50 border rounded-xl text-white transition-all duration-300 focus:outline-none resize-none"
              style={{borderColor: '#7C3996'}}
              placeholder="Describe los entregables del servicio realizado..."
              required
              onFocus={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.boxShadow = `0 0 0 2px #7C3996`;
                target.style.borderColor = '#72C054';
              }}
              onBlur={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.boxShadow = 'none';
                target.style.borderColor = '#7C3996';
              }}
            />
          </div>

          {/* Botón de envío */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-12 py-4 rounded-xl font-bold text-lg text-white transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-3"
              style={{
                background: `linear-gradient(135deg, #72C054 0%, #008343 100%)`,
                boxShadow: `0 8px 25px #72C054` + '40'
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  const target = e.target as HTMLButtonElement;
                  target.style.background = `linear-gradient(135deg, #008343 0%, #72C054 100())`;
                  target.style.boxShadow = `0 12px 35px #72C054` + '60';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) {
                  const target = e.target as HTMLButtonElement;
                  target.style.background = `linear-gradient(135deg, #72C054 0%, #008343 100())`;
                  target.style.boxShadow = `0 8px 25px #72C054` + '40';
                }
              }}
            >
              {isSubmitting ? (
                <>
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Guardando Reporte...</span>
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  <span>Guardar y Finalizar Servicio</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}