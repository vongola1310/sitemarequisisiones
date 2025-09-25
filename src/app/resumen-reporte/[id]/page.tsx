"use client";

import { useState, useEffect, use } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface SolicitudCompleta {
  id: number;
  folio: string;
  fechaSolicitud: string;
  fechaEntregaFinal: string;
  proyectoDestino: string;
  areaSolicitante: string;
  productoSolicitado: any;
  descripcion: string;
  recursosNecesarios: any;
  status: string;
  comments: string;
  solicitante: {
    name: string;
    email: string;
  };
  ingeniero: {
    name: string;
    email: string;
  };
  gerente?: {
    name: string;
    email: string;
  };
  reporteServicio?: {
    id: number;
    folioSolicitud: string;
    fechaEntrega: string;
    proyecto: string;
    area: string;
    responsable: string;
    correoResponsable: string;
    informacionServicio: any;
    accionesRealizadas: string;
    observaciones: string;
    descripcionEntregables: string;
    usuario: {
      name: string;
      email: string;
    };
    ingeniero: {
      name: string;
      email: string;
    };
  };
}

export default function ResumenReportePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [solicitudCompleta, setSolicitudCompleta] =
    useState<SolicitudCompleta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchResumenCompleto = async () => {
      try {
        const response = await fetch(
          `/api/resumen-reporte/${resolvedParams.id}`,
          {
            credentials: "include", // 🔑 Para enviar cookies de sesión
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.message || "Error al cargar el resumen");
        }

        const data = await response.json();
        setSolicitudCompleta(data);
      } catch (err: any) {
        setError(err.message || "No se pudo cargar el resumen completo");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchResumenCompleto();
    }
  }, [resolvedParams.id, status]);

  // Función helper para formatear recursos
  const formatearRecursos = (recursosObj: any): string => {
    if (!recursosObj) return "No especificado";
    if (typeof recursosObj === "string") return recursosObj;
    if (typeof recursosObj === "object") {
      const recursosSeleccionados = Object.entries(recursosObj)
        .filter(([key, value]) => value && key !== "otroRecurso")
        .map(([key]) => key);
      const otroRecurso = recursosObj.otroRecurso || "";
      return (
        recursosSeleccionados.join(", ") +
        (otroRecurso ? `, ${otroRecurso}` : "")
      );
    }
    return "No especificado";
  };

  // Función helper para formatear productos solicitados
  const formatearProductos = (productosObj: any): string => {
    if (!productosObj) return "No especificado";
    if (typeof productosObj === "string") return productosObj;
    if (typeof productosObj === "object") {
      const productos = Object.entries(productosObj)
        .filter(([key, value]) => value && key !== "otroProducto")
        .map(([key]) => key);
      const otroProducto = productosObj.otroProducto || "";
      return productos.join(", ") + (otroProducto ? `, ${otroProducto}` : "");
    }
    return "No especificado";
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div
            className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: "#72C054", borderTopColor: "transparent" }}
          ></div>
          <p className="text-black text-lg font-medium">
            Cargando resumen completo...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div
          className="bg-black/90 backdrop-blur-lg border rounded-2xl shadow-2xl p-8 text-center max-w-md"
          style={{ borderColor: "#7C3996" + "30" }}
        >
          <h2 className="text-xl font-bold text-white mb-2">Error</h2>
          <p className="text-white/80 mb-6">{error}</p>
          <Link href="/historial">
            <button
              className="px-6 py-3 rounded-xl font-medium text-white transition-all duration-300"
              style={{
                background: `linear-gradient(135deg, #72C054 0%, #008343 100%)`,
              }}
            >
              Volver al Historial
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (!solicitudCompleta) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-black">Resumen no encontrado</p>
      </div>
    );
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
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-black/90 backdrop-blur-lg border rounded-2xl shadow-2xl p-6 mb-6"
             style={{borderColor: '#72C054' + '30'}}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/historial">
                <button 
                  className="p-3 rounded-xl font-medium text-white transition-all duration-300"
                  style={{background: `linear-gradient(135deg, #0D7680 0%, #7C3996 100%)`}}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
              </Link>
              
              <div>
                <h1 className="text-3xl font-bold text-white">Resumen Completo</h1>
                <p className="text-white/70">Folio: {solicitudCompleta.folio}</p>
              </div>
            </div>

            <span 
              className="px-4 py-2 rounded-full text-sm font-semibold text-white bg-gray-600"
            >
              {solicitudCompleta.status}
            </span>
          </div>
        </div>

        {/* Información de la Solicitud Original */}
        <div className="bg-black/90 backdrop-blur-lg border rounded-2xl shadow-2xl p-6 mb-6"
             style={{borderColor: '#008343' + '30'}}>
          <div className="absolute top-0 left-0 right-0 h-px"
               style={{background: `linear-gradient(90deg, transparent, #008343, transparent)`}}></div>
          
          <div className="flex items-center space-x-3 mb-6">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{backgroundColor: '#008343'}}
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white">Solicitud Original</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div>
                <h4 className="text-white font-semibold mb-2">Información General</h4>
                <div className="space-y-2 text-white/80 text-sm">
                  <p><strong>Proyecto:</strong> {solicitudCompleta.proyectoDestino}</p>
                  <p><strong>Área:</strong> {solicitudCompleta.areaSolicitante}</p>
                  <p><strong>Fecha de Solicitud:</strong> {new Date(solicitudCompleta.fechaSolicitud).toLocaleDateString('es-ES')}</p>
                  {solicitudCompleta.fechaEntregaFinal && (
                    <p><strong>Fecha de Entrega:</strong> {new Date(solicitudCompleta.fechaEntregaFinal).toLocaleDateString('es-ES')}</p>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-2">Participantes</h4>
                <div className="space-y-1 text-white/80 text-sm">
                  <p><strong>Solicitante:</strong> {solicitudCompleta.solicitante.name}</p>
                  <p><strong>Ingeniero:</strong> {solicitudCompleta.ingeniero.name}</p>
                  {solicitudCompleta.gerente && (
                    <p><strong>Gerente:</strong> {solicitudCompleta.gerente.name}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-white font-semibold mb-2">Productos Solicitados</h4>
                <p className="text-white/80 text-sm">{formatearProductos(solicitudCompleta.productoSolicitado)}</p>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-2">Recursos Necesarios</h4>
                <p className="text-white/80 text-sm">{formatearRecursos(solicitudCompleta.recursosNecesarios)}</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-2">Descripción del Proyecto</h4>
            <p className="text-white/80 text-sm bg-white/5 p-4 rounded-lg">{solicitudCompleta.descripcion}</p>
          </div>
        </div>

        {/* Información del Reporte de Servicio */}
        {solicitudCompleta.reporteServicio && (
          <div className="bg-black/90 backdrop-blur-lg border rounded-2xl shadow-2xl p-6"
               style={{borderColor: '#7C3996' + '30'}}>
            <div className="absolute top-0 left-0 right-0 h-px"
                 style={{background: `linear-gradient(90deg, transparent, #7C3996, transparent)`}}></div>
            
            <div className="flex items-center space-x-3 mb-6">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{backgroundColor: '#7C3996'}}
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m-3 7h3m-3-7l3-3m-6 0h6m-6 4h6" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">Reporte de Servicio</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-white font-semibold mb-2">Información de Entrega</h4>
                  <div className="space-y-2 text-white/80 text-sm">
                    <p><strong>Fecha de Entrega:</strong> {new Date(solicitudCompleta.reporteServicio.fechaEntrega).toLocaleDateString('es-ES')}</p>
                    <p><strong>Responsable:</strong> {solicitudCompleta.reporteServicio.responsable}</p>
                    <p><strong>Correo:</strong> {solicitudCompleta.reporteServicio.correoResponsable}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-white font-semibold mb-2">Información del Servicio</h4>
                  <div className="text-white/80 text-sm">
                    {solicitudCompleta.reporteServicio.informacionServicio && 
                     typeof solicitudCompleta.reporteServicio.informacionServicio === 'object' ? (
                      <ul className="space-y-1">
                        {Object.entries(solicitudCompleta.reporteServicio.informacionServicio)
                          .filter(([key, value]) => value)
                          .map(([key, value]) => (
                            <li key={key}>• {key}: {String(value)}</li>
                          ))}
                      </ul>
                    ) : (
                      <p>{solicitudCompleta.reporteServicio.informacionServicio || 'No especificado'}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-white font-semibold mb-2">Acciones Realizadas</h4>
                <p className="text-white/80 text-sm bg-white/5 p-4 rounded-lg">
                  {solicitudCompleta.reporteServicio.accionesRealizadas}
                </p>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-2">Descripción de Entregables</h4>
                <p className="text-white/80 text-sm bg-white/5 p-4 rounded-lg">
                  {solicitudCompleta.reporteServicio.descripcionEntregables}
                </p>
              </div>

              {solicitudCompleta.reporteServicio.observaciones && (
                <div>
                  <h4 className="text-white font-semibold mb-2">Observaciones</h4>
                  <p className="text-white/80 text-sm bg-white/5 p-4 rounded-lg">
                    {solicitudCompleta.reporteServicio.observaciones}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}