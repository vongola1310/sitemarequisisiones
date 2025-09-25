// src/app/login/page.tsx

"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setMessage('Credenciales inválidas. Por favor, verifica tu correo y contraseña.');
      } else {
        setMessage('Inicio de sesión exitoso. Redirigiendo...');
        router.push('/dashboard');
      }
    } catch (error) {
      console.error(error);
      setMessage('Ocurrió un error inesperado. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative">
      {/* Efectos de fondo animados con TUS colores */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"
          style={{backgroundColor: '#72C054'}}
        ></div>
        <div 
          className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-pulse"
          style={{backgroundColor: '#008343', animationDelay: '2s'}}
        ></div>
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
          style={{backgroundColor: '#7C3996', animationDelay: '4s'}}
        ></div>
        <div 
          className="absolute top-20 right-1/4 w-60 h-60 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse"
          style={{backgroundColor: '#0D7680', animationDelay: '1s'}}
        ></div>
      </div>

      {/* Contenedor principal */}
      <div className="relative w-full max-w-md">
        {/* Card con efecto glassmorphism */}
        <div className="bg-black/90 backdrop-blur-lg border rounded-2xl shadow-2xl p-8 relative overflow-hidden"
             style={{borderColor: '#72C054' + '30'}}>
          {/* Brillo sutil en la parte superior */}
          <div className="absolute top-0 left-0 right-0 h-px"
               style={{background: `linear-gradient(90deg, transparent, #72C054, transparent)`}}></div>
          
          {/* Logo o icono */}
          <div className="text-center mb-8">
            <div 
              className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg"
              style={{background: `linear-gradient(135deg, #72C054 0%, #008343 100%)`}}
            >
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Bienvenido</h1>
            <p className="text-sm" style={{color: '#72C054'}}>Ingresa a tu cuenta para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo de email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-white text-sm font-medium">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5" style={{color: '#72C054'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-black/50 rounded-xl text-white transition-all duration-300 backdrop-blur-sm focus:outline-none placeholder:text-opacity-60"
                  style={{
                    border: `1px solid #72C054`,
                    color: 'white'
                  }}
                  placeholder="tu@email.com"
                  required
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
                />
              </div>
            </div>

            {/* Campo de contraseña */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-white text-sm font-medium">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5" style={{color: '#72C054'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-black/50 rounded-xl text-white transition-all duration-300 backdrop-blur-sm focus:outline-none placeholder:text-opacity-60"
                  style={{
                    border: `1px solid #72C054`,
                    color: 'white'
                  }}
                  placeholder="••••••••"
                  required
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
                />
              </div>
            </div>

            {/* Botón de submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full text-white py-3 px-4 rounded-xl font-medium focus:outline-none transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              style={{
                background: `linear-gradient(135deg, #72C054 0%, #008343 100%)`,
                boxShadow: `0 4px 15px #72C054` + '40'
              }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLButtonElement;
                target.style.background = `linear-gradient(135deg, #008343 0%, #72C054 100%)`;
                target.style.boxShadow = `0 6px 20px #72C054` + '60';
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLButtonElement;
                target.style.background = `linear-gradient(135deg, #72C054 0%, #008343 100%)`;
                target.style.boxShadow = `0 4px 15px #72C054` + '40';
              }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Iniciando sesión...</span>
                </div>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>

          {/* Mensaje de estado */}
          {message && (
            <div 
              className={`mt-6 p-4 rounded-xl border backdrop-blur-sm transition-all duration-300`}
              style={{
                backgroundColor: message.includes('exitoso') ? '#72C054' + '20' : '#7C3996' + '20',
                borderColor: message.includes('exitoso') ? '#72C054' : '#7C3996',
                color: 'white'
              }}
            >
              <div className="flex items-center space-x-2">
                {message.includes('exitoso') ? (
                  <svg className="w-5 h-5" style={{color: '#72C054'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" style={{color: '#7C3996'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                <span className="text-sm font-medium">{message}</span>
              </div>
            </div>
          )}

          {/* Enlaces adicionales */}
       
        </div>
      </div>
    </div>
  );
}