// src/app/solicitud-requisicion/page.tsx

"use client";

import { useState } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SolicitudRequisicionPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const areas = [
    "Dirección General",
    "Departamento de Ventas",
    "Departamento de Finanzas",
    "Departamento de Recursos humanos",
    "Departamento de Sistemas",
    "Departamento de Seguridad e Higiene",
    "Departamento de Gestion de Calidad",
    "Departamento de Almacen",
    "Departamento de Compras",
    "Departamento de Atencion a Clientes",
    "Departamento de Mantenimiento",
    "Departamrnto de Administración",
    "Departamento de Biomédica,Ciencia y Biotecnología",
  ];

  const [formData, setFormData] = useState({
    fechaSolicitud: '',
    fechaEntregaFinal: '',
    proyectoDestino: '',
    areaSolicitante: '',
    paginaWeb: false,
    animacion2D3D: false,
    edicionVideo: false,
    postRedesSociales: false,
    modelo3D: false,
    aplicacionRVRA: false,
    disenoUX: false,
    streaming: false,
    otroProducto: '',
    descripcion: '',
    unrealEngine: false,
    unity: false,
    paqueteriaAdobe: false,
    blender: false,
    canva: false,
    visualStudioCode: false,
    microfonosCapturadora: false,
    otroRecurso: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData(prevState => ({
        ...prevState,
        [name]: target.checked,
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/solicitud', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Error en el servidor: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Respuesta de la API:', data);
      alert('¡Solicitud enviada con éxito!');

      setFormData({
        fechaSolicitud: '',
        fechaEntregaFinal: '',
        proyectoDestino: '',
        areaSolicitante: '',
        paginaWeb: false,
        animacion2D3D: false,
        edicionVideo: false,
        postRedesSociales: false,
        modelo3D: false,
        aplicacionRVRA: false,
        disenoUX: false,
        streaming: false,
        otroProducto: '',
        descripcion: '',
        unrealEngine: false,
        unity: false,
        paqueteriaAdobe: false,
        blender: false,
        canva: false,
        visualStudioCode: false,
        microfonosCapturadora: false,
        otroRecurso: '',
      });

    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      alert('Ocurrió un error al enviar la solicitud.');
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const userRole = session?.user?.role;
  const isIngeniero = userRole === 'ingeniero';

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative">
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

      <div className="relative w-full max-w-5xl">
        <div className="bg-black/90 backdrop-blur-lg border rounded-2xl shadow-2xl p-6 mb-6 relative overflow-hidden"
             style={{borderColor: '#72C054' + '30'}}>
          <div className="absolute top-0 left-0 right-0 h-px"
               style={{background: `linear-gradient(90deg, transparent, #72C054, transparent)`}}></div>
          
          <div className="text-center">
            <div 
              className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg"
              style={{background: `linear-gradient(135deg, #72C054 0%, #008343 100%)`}}
            >
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Formato de Requisiciones</h1>
            <p className="text-lg" style={{color: '#72C054'}}>Entornos Virtuales</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-black/90 backdrop-blur-lg border rounded-2xl shadow-2xl p-8 relative overflow-hidden"
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
              <h2 className="text-2xl font-semibold text-white">Detalles del Servicio</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-medium mb-2">Fecha de Solicitud</label>
                <input
                  type="date"
                  name="fechaSolicitud"
                  value={formData.fechaSolicitud}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black/50 rounded-xl text-white transition-all duration-300 focus:outline-none"
                  style={{border: `1px solid #72C054`}}
                  onFocus={(e) => {
                    const target = e.target as HTMLInputElement;
                    target.style.boxShadow = `0 0 0 2px #72C054`;
                    target.style.borderColor = '#008343';
                  }}
                  onBlur={(e) => {
                    const target = e.target as HTMLInputElement;
                    target.style.boxShadow = 'none';
                    target.style.borderColor = '#72C054';
                  }}
                  required
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">Fecha de Entrega Final</label>
                <input
                  type="date"
                  name="fechaEntregaFinal"
                  value={formData.fechaEntregaFinal}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-black/50 rounded-xl text-white transition-all duration-300 focus:outline-none ${
                    !isIngeniero ? 'opacity-60 cursor-not-allowed' : ''
                  }`}
                  style={{border: `1px solid #72C054`}}
                  readOnly={!isIngeniero}
                  onFocus={(e) => {
                    if (isIngeniero) {
                      const target = e.target as HTMLInputElement;
                      target.style.boxShadow = `0 0 0 2px #72C054`;
                      target.style.borderColor = '#008343';
                    }
                  }}
                  onBlur={(e) => {
                    if (isIngeniero) {
                      const target = e.target as HTMLInputElement;
                      target.style.boxShadow = 'none';
                      target.style.borderColor = '#72C054';
                    }
                  }}
                />
                {!isIngeniero && (
                  <p className="text-xs mt-1" style={{color: '#72C054'}}>
                    * Solo editable por ingenieros
                  </p>
                )}
              </div>
              <div>
                <label className="block text-white font-medium mb-2">Proyecto a donde va dirigido</label>
                <input
                  type="text"
                  name="proyectoDestino"
                  value={formData.proyectoDestino}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black/50 rounded-xl text-white transition-all duration-300 focus:outline-none"
                  style={{border: `1px solid #72C054`}}
                  onFocus={(e) => {
                    const target = e.target as HTMLInputElement;
                    target.style.boxShadow = `0 0 0 2px #72C054`;
                    target.style.borderColor = '#008343';
                  }}
                  onBlur={(e) => {
                    const target = e.target as HTMLInputElement;
                    target.style.boxShadow = 'none';
                    target.style.borderColor = '#72C054';
                  }}
                  required
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">Área que Solicita</label>
                <select
                  name="areaSolicitante"
                  value={formData.areaSolicitante}
                  onChange={handleChange as unknown as React.ChangeEventHandler<HTMLSelectElement>}
                  className="w-full px-4 py-3 bg-black/50 rounded-xl text-white transition-all duration-300 focus:outline-none"
                  style={{border: `1px solid #72C054`}}
                  onFocus={(e) => {
                    const target = e.target as HTMLSelectElement;
                    target.style.boxShadow = `0 0 0 2px #72C054`;
                    target.style.borderColor = '#008343';
                  }}
                  onBlur={(e) => {
                    const target = e.target as HTMLSelectElement;
                    target.style.boxShadow = 'none';
                    target.style.borderColor = '#72C054';
                  }}
                  required
                >
                  <option value="" disabled>Selecciona un área...</option>
                  {areas.map((area) => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-black/90 backdrop-blur-lg border rounded-2xl shadow-2xl p-8 relative overflow-hidden"
               style={{borderColor: '#008343' + '30'}}>
            <div className="absolute top-0 left-0 right-0 h-px"
                 style={{background: `linear-gradient(90deg, transparent, #008343, transparent)`}}></div>
            
            <div className="flex items-center mb-6">
              <div 
                className="w-10 h-10 rounded-lg mr-4 flex items-center justify-center"
                style={{backgroundColor: '#008343'}}
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-white">Producto Solicitado</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'paginaWeb', label: 'Página web' },
                { name: 'animacion2D3D', label: 'Animación 2D o 3D' },
                { name: 'edicionVideo', label: 'Edición o Creación de video' },
                { name: 'postRedesSociales', label: 'Post de Redes Sociales' },
                { name: 'modelo3D', label: 'Modelo 3D' },
                { name: 'aplicacionRVRA', label: 'Aplicación RV o RA' },
                { name: 'disenoUX', label: 'Diseño UX' },
                { name: 'streaming', label: 'Streaming' }
              ].map((item) => (
                <label key={item.name} className="flex items-center space-x-3 p-3 rounded-lg border transition-all duration-300 hover:shadow-md cursor-pointer"
                        style={{
                          borderColor: formData[item.name as keyof typeof formData] ? '#008343' : '#008343' + '30',
                          backgroundColor: formData[item.name as keyof typeof formData] ? '#008343' + '20' : 'transparent'
                        }}>
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      name={item.name} 
                      checked={formData[item.name as keyof typeof formData] as boolean} 
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div 
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-300 ${
                        formData[item.name as keyof typeof formData] ? 'text-white' : ''
                      }`}
                      style={{
                        borderColor: '#008343',
                        backgroundColor: formData[item.name as keyof typeof formData] ? '#008343' : 'transparent'
                      }}
                    >
                      {formData[item.name as keyof typeof formData] && (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-white font-medium">{item.label}</span>
                </label>
              ))}
            </div>
            
            <div className="mt-6">
              <label className="block text-white font-medium mb-2">Otro:</label>
              <input
                type="text"
                name="otroProducto"
                value={formData.otroProducto}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black/50 rounded-xl text-white transition-all duration-300 focus:outline-none"
                style={{border: `1px solid #008343`}}
                placeholder="Especifica otro producto..."
                onFocus={(e) => {
                  const target = e.target as HTMLInputElement;
                  target.style.boxShadow = `0 0 0 2px #008343`;
                  target.style.borderColor = '#72C054';
                }}
                onBlur={(e) => {
                  const target = e.target as HTMLInputElement;
                  target.style.boxShadow = 'none';
                  target.style.borderColor = '#008343';
                }}
              />
            </div>
          </div>

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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-white">Descripción</h2>
            </div>

            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows={6}
              className="w-full px-4 py-3 bg-black/50 rounded-xl text-white transition-all duration-300 focus:outline-none resize-none"
              style={{border: `1px solid #0D7680`}}
              placeholder="Describe detalladamente tu proyecto..."
              onFocus={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.boxShadow = `0 0 0 2px #0D7680`;
                target.style.borderColor = '#72C054';
              }}
              onBlur={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.boxShadow = 'none';
                target.style.borderColor = '#0D7680';
              }}
              required
            ></textarea>
          </div>

          {isIngeniero && (
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-white">Recursos Necesarios <span className="text-sm" style={{color: '#7C3996'}}>(llenado por EVND)</span></h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'unrealEngine', label: 'Unreal Engine' },
                  { name: 'unity', label: 'Unity' },
                  { name: 'paqueteriaAdobe', label: 'Paquetería Adobe' },
                  { name: 'blender', label: 'Blender' },
                  { name: 'canva', label: 'Canva' },
                  { name: 'visualStudioCode', label: 'Visual Studio Code' },
                  { name: 'microfonosCapturadora', label: 'Micrófonos y Capturadora' }
                ].map((item) => (
                  <label key={item.name} className="flex items-center space-x-3 p-3 rounded-lg border transition-all duration-300 hover:shadow-md cursor-pointer"
                          style={{
                            borderColor: formData[item.name as keyof typeof formData] ? '#7C3996' : '#7C3996' + '30',
                            backgroundColor: formData[item.name as keyof typeof formData] ? '#7C3996' + '20' : 'transparent'
                          }}>
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        name={item.name} 
                        checked={formData[item.name as keyof typeof formData] as boolean} 
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div 
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-300 ${
                          formData[item.name as keyof typeof formData] ? 'text-white' : ''
                        }`}
                        style={{
                          borderColor: '#7C3996',
                          backgroundColor: formData[item.name as keyof typeof formData] ? '#7C3996' : 'transparent'
                        }}
                      >
                        {formData[item.name as keyof typeof formData] && (
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="text-white font-medium">{item.label}</span>
                  </label>
                ))}
              </div>
              
              <div className="mt-6">
                <label className="block text-white font-medium mb-2">Otro:</label>
                <input
                  type="text"
                  name="otroRecurso"
                  value={formData.otroRecurso}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black/50 rounded-xl text-white transition-all duration-300 focus:outline-none"
                  style={{border: `1px solid #7C3996`}}
                  placeholder="Especifica otro recurso..."
                  onFocus={(e) => {
                    const target = e.target as HTMLInputElement;
                    target.style.boxShadow = `0 0 0 2px #7C3996`;
                    target.style.borderColor = '#72C054';
                  }}
                  onBlur={(e) => {
                    const target = e.target as HTMLInputElement;
                    target.style.boxShadow = 'none';
                    target.style.borderColor = '#7C3996';
                  }}
                />
              </div>
            </div>
          )}

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
                  <span>Enviando Solicitud...</span>
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  <span>Enviar Solicitud</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}