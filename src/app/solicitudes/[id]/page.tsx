// src/app/solicitudes/[id]/page.tsx
"use client";

import { useState, useEffect, use } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface SolicitudDetalle {
  id: number;
  folio: string;
  fechaSolicitud: string;
  proyectoDestino: string;
  areaSolicitante: string;
  status: string;
  descripcion: string;
  fechaEntregaFinal?: string;
  recursosNecesarios?: Record<string, boolean | string>; // Cambio 1
  comments?: string;
}

export default function SolicitudDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { status } = useSession(); // Cambio 2: removí 'data: session' ya que no se usa aquí
  const router = useRouter();
  const [solicitud, setSolicitud] = useState<SolicitudDetalle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actualizando, setActualizando] = useState(false);
  
  // Estados para el formulario de completar solicitud
  const [fechaEjecucion, setFechaEjecucion] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [formCompleto, setFormCompleto] = useState(false);
  
  // Estados para los recursos (checkboxes)
  const [recursos, setRecursos] = useState({
    canva: false,
    unity: false,
    blender: false,
    unrealEngine: false,
    paqueteriaAdobe: false,
    visualStudioCode: false,
    microfonosCapturadora: false,
    otroRecurso: ''
  });

  // Función helper para formatear los recursos
  const formatearRecursos = (recursosObj: Record<string, boolean | string>): string => { // Cambio 3
    if (!recursosObj) return 'No especificado';
    
    if (typeof recursosObj === 'string') return recursosObj;
    
    if (typeof recursosObj === 'object') {
      const recursosSeleccionados = Object.entries(recursosObj)
        .filter(([, value]) => value && typeof value !== 'string') // Cambio 4: removí 'key' no usado
        .map(([key]) => key);
      
      const otroRecurso = recursosObj.otroRecurso || '';
      
      return recursosSeleccionados.join(', ') + (otroRecurso ? `, ${otroRecurso}` : '');
    }
    
    return 'No especificado';
  };

  // Función para manejar cambios en los checkboxes de recursos
  const handleRecursoChange = (recurso: string, value: boolean | string) => {
    setRecursos(prev => ({
      ...prev,
      [recurso]: value
    }));
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchSolicitud = async () => {
      try {
        const response = await fetch(`/api/solicitudes/${resolvedParams.id}`);
        if (!response.ok) {
          throw new Error('Error al cargar la solicitud');
        }
        const data = await response.json();
        setSolicitud(data);
        
        if (data.fechaEntregaFinal) setFechaEjecucion(data.fechaEntregaFinal.split('T')[0]);
        if (data.recursosNecesarios) {
          setRecursos({
            canva: data.recursosNecesarios.canva || false,
            unity: data.recursosNecesarios.unity || false,
            blender: data.recursosNecesarios.blender || false,
            unrealEngine: data.recursosNecesarios.unrealEngine || false,
            paqueteriaAdobe: data.recursosNecesarios.paqueteriaAdobe || false,
            visualStudioCode: data.recursosNecesarios.visualStudioCode || false,
            microfonosCapturadora: data.recursosNecesarios.microfonosCapturadora || false,
            otroRecurso: data.recursosNecesarios.otroRecurso || ''
          });
        }
        if (data.comments) setObservaciones(data.comments);
        
      } catch (err) {
        setError('No se pudo cargar la solicitud');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchSolicitud();
    }
  }, [resolvedParams.id, status]);

  useEffect(() => {
    const tieneRecursos = Object.keys(recursos).some(key => 
      key === 'otroRecurso' ? recursos.otroRecurso.trim() !== '' : recursos[key as keyof typeof recursos] === true
    );
    
    setFormCompleto(
      fechaEjecucion.trim() !== '' && tieneRecursos
    );
  }, [fechaEjecucion, recursos]);

  const completarSolicitud = async () => {
    if (!formCompleto) {
      setError('Por favor completa todos los campos requeridos');
      return;
    }

    setActualizando(true);
    try {
      const response = await fetch(`/api/solicitudes/${resolvedParams.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fechaEntregaFinal: fechaEjecucion,
          recursosNecesarios: recursos,
          status: 'En Revisión'
        }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la solicitud');
      }

      router.push('/dashboard');
    } catch (err) {
      setError('Error al completar la solicitud');
      console.error(err);
    } finally {
      setActualizando(false);
    }
  };

  // Cambio 5: Removí la función 'ejecutarSolicitud' ya que no se usa

  const { data: session } = useSession(); // Cambio 6: Movido aquí donde se necesita
  const userRole = session?.user?.role;
  const isIngeniero = userRole === 'ingeniero';
 
  
  if (status === "loading" || loading) {
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

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="bg-black/90 backdrop-blur-lg border rounded-2xl shadow-2xl p-8 text-center max-w-md"
              style={{borderColor: '#7C3996' + '30'}}>
          <h2 className="text-xl font-bold text-white mb-2">Error</h2>
          <p className="text-white/80 mb-6">{error}</p>
          <Link href="/dashboard">
            <button 
              className="px-6 py-3 rounded-xl font-medium text-white transition-all duration-300"
              style={{background: `linear-gradient(135deg, #72C054 0%, #008343 100%)`}}
            >
              Volver al Dashboard
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (!solicitud) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-black">Solicitud no encontrada</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-black/90 backdrop-blur-lg border rounded-2xl shadow-2xl p-6 mb-6"
             style={{borderColor: '#0D7680' + '30'}}>
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
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
                <h1 className="text-2xl font-bold text-white">Solicitud {solicitud.folio}</h1>
                <p className="text-white/70">{solicitud.proyectoDestino}</p>
              </div>
            </div>

            <span 
              className={`px-4 py-2 rounded-full text-sm font-semibold text-white ${
                solicitud.status === 'Pendiente' ? 'bg-yellow-500' :
                solicitud.status === 'En ejecución' ? 'bg-blue-500' :
                solicitud.status === 'En Revisión' ? 'bg-orange-500' :
                'bg-gray-500'
              }`}
            >
              {solicitud.status}
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-white font-semibold mb-2">Información General</h3>
              <div className="space-y-2 text-white/80">
                <p><strong>Folio:</strong> {solicitud.folio}</p>
                <p><strong>Proyecto:</strong> {solicitud.proyectoDestino}</p>
                <p><strong>Área:</strong> {solicitud.areaSolicitante}</p>
                <p><strong>Fecha:</strong> {new Date(solicitud.fechaSolicitud).toLocaleDateString('es-ES')}</p>
              </div>
            </div>
            
            {(solicitud.fechaEntregaFinal || solicitud.recursosNecesarios || solicitud.comments) && (
              <div>
                <h3 className="text-white font-semibold mb-2">Información Técnica</h3>
                <div className="space-y-2 text-white/80">
                  {solicitud.fechaEntregaFinal && (
                    <p><strong>Fecha de Entrega:</strong> {new Date(solicitud.fechaEntregaFinal).toLocaleDateString('es-ES')}</p>
                  )}
                  {solicitud.recursosNecesarios && (
                    <p><strong>Recursos:</strong> {formatearRecursos(solicitud.recursosNecesarios)}</p>
                  )}
                  {solicitud.comments && (
                    <p><strong>Observaciones:</strong> {solicitud.comments}</p>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <h3 className="text-white font-semibold mb-2">Descripción</h3>
          <p className="text-white/80 mb-6">{solicitud.descripcion}</p>

          {(isIngeniero && solicitud.status === 'Pendiente') && (
            <div className="mb-6 p-6 bg-white/5 rounded-xl border" style={{borderColor: '#72C054' + '30'}}>
              <h3 className="text-white font-semibold mb-4 flex items-center">
                <div 
                  className="w-6 h-6 rounded-full mr-2 flex items-center justify-center text-white text-xs"
                  style={{backgroundColor: '#72C054'}}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                Completar Información Técnica
              </h3>
              
              <div className="grid md:grid-cols-1 gap-4 mb-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Fecha de Entrega *
                  </label>
                  <input
                    type="date"
                    value={fechaEjecucion}
                    onChange={(e) => setFechaEjecucion(e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#72C054] focus:border-transparent"
                    style={{borderColor: '#72C054' + '30'}}
                    required
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-white/80 text-sm font-medium mb-3">
                  Recursos Necesarios *
                </label>
                <div className="grid md:grid-cols-2 gap-3 mb-3">
                  {[
                    { key: 'canva', label: 'Canva' },
                    { key: 'unity', label: 'Unity' },
                    { key: 'blender', label: 'Blender' },
                    { key: 'unrealEngine', label: 'Unreal Engine' },
                    { key: 'paqueteriaAdobe', label: 'Paquetería Adobe' },
                    { key: 'visualStudioCode', label: 'Visual Studio Code' },
                    { key: 'microfonosCapturadora', label: 'Micrófonos/Capturadora' }
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center space-x-3 text-white/80 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!recursos[key as keyof typeof recursos]}
                        onChange={(e) => handleRecursoChange(key, e.target.checked)}
                        className="w-4 h-4 rounded border-2 focus:ring-2 focus:ring-[#72C054] bg-white/10"
                        style={{
                          accentColor: '#72C054',
                          borderColor: '#72C054'
                        }}
                      />
                      <span className="text-sm">{label}</span>
                    </label>
                  ))}
                </div>
                
                <div>
                  <label className="block text-white/60 text-xs font-medium mb-2">
                    Otro recurso (especificar):
                  </label>
                  <input
                    type="text"
                    value={recursos.otroRecurso}
                    onChange={(e) => handleRecursoChange('otroRecurso', e.target.value)}
                    placeholder="Especifica otro recurso necesario..."
                    className="w-full px-3 py-2 bg-white/10 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#72C054] focus:border-transparent"
                    style={{borderColor: '#72C054' + '30'}}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Observaciones (Opcional)
                </label>
                <textarea
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  placeholder="Comentarios adicionales, consideraciones especiales..."
                  rows={3}
                  className="w-full px-3 py-2 bg-white/10 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#72C054] focus:border-transparent resize-none"
                  style={{borderColor: '#72C054' + '30'}}
                />
              </div>
              
              {!formCompleto && (
                <p className="text-yellow-400 text-sm mt-2 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  Completa la fecha de entrega y selecciona al menos un recurso necesario
                </p>
              )}
              
              <div className="flex justify-end mt-6">
                <button
                  onClick={completarSolicitud}
                  disabled={actualizando || !formCompleto}
                  className={`px-6 py-3 rounded-xl font-medium text-white transition-all duration-300 transform ${
                    !formCompleto || actualizando 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:scale-105 active:scale-95 shadow-lg'
                  }`}
                  style={{
                    background: formCompleto 
                      ? `linear-gradient(135deg, #72C054 0%, #008343 100%)` 
                      : '#6B7280',
                    boxShadow: formCompleto ? `0 6px 20px #72C054` + '40' : 'none'
                  }}
                >
                  {actualizando ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Enviando...</span>
                    </div>
                  ) : (
                    'Completar y Enviar a Revisión'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}