// src/app/aprobacion/[id]/page.tsx

"use client";

import { useState, useEffect, use } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from 'next/link';

// Interfaz para los datos del formulario
interface FormData {
  id?: number; 
  folio?: string;
  fechaSolicitud: string;
  fechaEntregaFinal: string;
  proyectoDestino: string;
  areaSolicitante: string;
  paginaWeb: boolean;
  animacion2D3D: boolean;
  edicionVideo: boolean;
  postRedesSociales: boolean;
  modelo3D: boolean;
  aplicacionRVRA: boolean;
  disenoUX: boolean;
  streaming: boolean;
  otroProducto: string;
  descripcion: string;
  unrealEngine: boolean;
  unity: boolean;
  paqueteriaAdobe: boolean;
  blender: boolean;
  canva: boolean;
  visualStudioCode: boolean;
  microfonosCapturadora: boolean;
  otroRecurso: string;
  status?: string;
  comments?: string;
}

export default function AprobacionPage({ params }: { params: Promise<{ id: string }> }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = use(params);

  const [formData, setFormData] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [comments, setComments] = useState('');

  // Lógica de autenticación
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Cargar los datos de la solicitud desde la API de aprobación
  useEffect(() => {
    const fetchSolicitud = async () => {
      if (status === "authenticated") {
        try {
          const response = await fetch(`/api/aprobacion/${id}`);
          if (!response.ok) {
            throw new Error('No se pudo cargar la solicitud');
          }
          const data = await response.json();
          setFormData({
            ...data,
            ...data.productoSolicitado,
            ...data.recursosNecesarios,
            fechaSolicitud: data.fechaSolicitud ? new Date(data.fechaSolicitud).toISOString().split('T')[0] : '',
            fechaEntregaFinal: data.fechaEntregaFinal ? new Date(data.fechaEntregaFinal).toISOString().split('T')[0] : '',
          });
          // Si ya hay comentarios previos, cargarlos
          if (data.comments) {
            setComments(data.comments);
          }
        } catch (err) {
          setMessage('Ocurrió un error al cargar los datos.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchSolicitud();
  }, [id, status]);

  // Obtener rol del usuario
  const userRole = session?.user?.role;
  const isGerente = userRole === 'gerente';

  const handleAction = async (action: 'Aprobada' | 'Rechazada') => {
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch(`/api/aprobacion/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: action, comments }),
      });

      if (!response.ok) {
        throw new Error(`Error en el servidor: ${response.statusText}`);
      }

      const data = await response.json();
      setMessage(`¡Solicitud ${action} con éxito!`);
      router.push('/dashboard');
      
    } catch (error) {
      console.error('Error al actualizar el estado de la solicitud:', error);
      setMessage('Ocurrió un error al procesar la solicitud.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading" || loading || !formData) {
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

  if (!isGerente) {
    router.push('/dashboard');
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
      <div className="relative max-w-6xl mx-auto">
        {/* Header con botón de regresar */}
        <div className="bg-black/90 backdrop-blur-lg border rounded-2xl shadow-2xl p-6 mb-6 relative overflow-hidden"
             style={{borderColor: '#7C3996' + '30'}}>
          {/* Brillo sutil en la parte superior */}
          <div className="absolute top-0 left-0 right-0 h-px"
               style={{background: `linear-gradient(90deg, transparent, #7C3996, transparent)`}}></div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Botón de regresar */}
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
              
              {/* Icono y título */}
              <div className="flex items-center space-x-3">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{backgroundColor: '#7C3996'}}
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Panel de Aprobación</h1>
                  <p className="text-white/70">Folio: {formData.folio}</p>
                </div>
              </div>
            </div>

            {/* Info del gerente */}
            <div className="flex items-center space-x-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                style={{background: `linear-gradient(135deg, #7C3996 0%, #0D7680 100%)`}}
              >
                {session?.user?.name?.charAt(0).toUpperCase() || 'G'}
              </div>
              <div className="text-right">
                <p className="text-white font-medium">{session?.user?.name}</p>
                <p className="text-white/60 text-sm">Gerente</p>
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

        {/* Grid de secciones */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Detalles del Servicio */}
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
              <h2 className="text-xl font-semibold text-white">Detalles del Servicio</h2>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-medium mb-2 text-sm">Fecha de Solicitud</label>
                  <input 
                    type="date" 
                    value={formData.fechaSolicitud} 
                    readOnly 
                    className="w-full px-3 py-2 bg-black/50 border rounded-lg text-white text-sm"
                    style={{borderColor: '#72C054' + '50'}}
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2 text-sm">Fecha de Entrega</label>
                  <input 
                    type="date" 
                    value={formData.fechaEntregaFinal} 
                    readOnly 
                    className="w-full px-3 py-2 bg-black/50 border rounded-lg text-white text-sm"
                    style={{borderColor: '#72C054' + '50'}}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2 text-sm">Proyecto Destino</label>
                <input 
                  type="text" 
                  value={formData.proyectoDestino} 
                  readOnly 
                  className="w-full px-3 py-2 bg-black/50 border rounded-lg text-white text-sm"
                  style={{borderColor: '#72C054' + '50'}}
                />
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2 text-sm">Área Solicitante</label>
                <input 
                  type="text" 
                  value={formData.areaSolicitante} 
                  readOnly 
                  className="w-full px-3 py-2 bg-black/50 border rounded-lg text-white text-sm"
                  style={{borderColor: '#72C054' + '50'}}
                />
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2 text-sm">Descripción</label>
                <textarea 
                  value={formData.descripcion} 
                  readOnly 
                  className="w-full px-3 py-2 bg-black/50 border rounded-lg text-white text-sm resize-none"
                  style={{borderColor: '#72C054' + '50'}}
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Estado y Acciones */}
          <div className="space-y-6">
            {/* Estado Actual */}
            <div className="bg-black/90 backdrop-blur-lg border rounded-2xl shadow-2xl p-6 relative overflow-hidden"
                 style={{borderColor: '#0D7680' + '30'}}>
              <div className="absolute top-0 left-0 right-0 h-px"
                   style={{background: `linear-gradient(90deg, transparent, #0D7680, transparent)`}}></div>
              
              <div className="flex items-center mb-4">
                <div 
                  className="w-10 h-10 rounded-lg mr-4 flex items-center justify-center"
                  style={{backgroundColor: '#0D7680'}}
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-white">Estado Actual</h2>
              </div>

              <div className="text-center py-4">
                <div 
                  className={`inline-flex items-center px-6 py-3 rounded-xl font-bold text-lg shadow-lg ${
                    formData.status === 'Aprobada' ? 'text-white' :
                    formData.status === 'Rechazada' ? 'text-white' :
                    'text-black'
                  }`}
                  style={{
                    backgroundColor: formData.status === 'Aprobada' ? '#72C054' :
                                   formData.status === 'Rechazada' ? '#7C3996' :
                                   '#0D7680'
                  }}
                >
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {formData.status === 'Aprobada' ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    ) : formData.status === 'Rechazada' ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    )}
                  </svg>
                  {formData.status || 'Pendiente'}
                </div>
              </div>
            </div>

            {/* Comentarios */}
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-white">Comentarios</h2>
              </div>

              <textarea
                name="comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-black/50 border rounded-xl text-white transition-all duration-300 focus:outline-none resize-none"
                style={{borderColor: '#008343'}}
                placeholder="Agrega comentarios u observaciones..."
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
          </div>
        </div>

        {/* Botones de acción */}
        <div className="mt-8 grid md:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => handleAction('Rechazada')}
            disabled={isSubmitting}
            className="w-full py-4 px-6 rounded-xl font-bold text-lg text-white transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3"
            style={{
              background: `linear-gradient(135deg, #7C3996 0%, #0D7680 100())`,
              boxShadow: `0 6px 20px #7C3996` + '40'
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) {
                const target = e.target as HTMLButtonElement;
                target.style.background = `linear-gradient(135deg, #0D7680 0%, #7C3996 100%)`;
                target.style.boxShadow = `0 8px 25px #7C3996` + '60';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting) {
                const target = e.target as HTMLButtonElement;
                target.style.background = `linear-gradient(135deg, #7C3996 0%, #0D7680 100%)`;
                target.style.boxShadow = `0 6px 20px #7C3996` + '40';
              }
            }}
          >
            {isSubmitting ? (
              <>
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Procesando...</span>
              </>
            ) : (
              <>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Rechazar</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleAction('Aprobada')}
            disabled={isSubmitting}
            className="w-full py-4 px-6 rounded-xl font-bold text-lg text-white transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3"
            style={{
              background: `linear-gradient(135deg, #72C054 0%, #008343 100())`,
              boxShadow: `0 6px 20px #72C054` + '40'
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) {
                const target = e.target as HTMLButtonElement;
                target.style.background = `linear-gradient(135deg, #008343 0%, #72C054 100%)`;
                target.style.boxShadow = `0 8px 25px #72C054` + '60';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting) {
                const target = e.target as HTMLButtonElement;
                target.style.background = `linear-gradient(135deg, #72C054 0%, #008343 100())`;
                target.style.boxShadow = `0 6px 20px #72C054` + '40';
              }
            }}
          >
            {isSubmitting ? (
              <>
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Procesando...</span>
              </>
            ) : (
              <>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Aprobar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}