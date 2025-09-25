// src/app/api/solicitudes/route.ts (VERSION DEBUG)
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ message: 'No autenticado' }, { status: 401 });
    }

    // Obtener usuario actual con su rol
    const usuario = await prisma.user.findUnique({
      where: { email: session.user.email as string },
      include: { role: true },
    });

    if (!usuario) {
      return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
    }

    const rolUsuario = usuario.role.name;
    console.log('🔍 DEBUG - Usuario logueado:', {
      nombre: usuario.name,
      email: usuario.email,
      rol: rolUsuario,
      id: usuario.id
    });
    
    let solicitudes;

    if (rolUsuario === 'ingeniero') {
      // PASO 1: Ver TODAS las solicitudes en la base de datos
      const todasLasSolicitudes = await prisma.solicitudProyecto.findMany({
        select: {
          id: true,
          folio: true,
          status: true,
          ingenieroId: true,
          solicitanteId: true,
          proyectoDestino: true,
        },
      });
      
      console.log('🔍 DEBUG - TODAS las solicitudes en la BD:');
      todasLasSolicitudes.forEach(sol => {
        console.log(`   ID: ${sol.id}, Folio: ${sol.folio}, Status: ${sol.status}, IngenieroID: ${sol.ingenieroId}, SolicitanteID: ${sol.solicitanteId}`);
      });

      // PASO 2: Ver las asignadas a este ingeniero (sin filtro de status)
      const solicitudesDelIngeniero = await prisma.solicitudProyecto.findMany({
        where: {
          ingenieroId: usuario.id,
        },
        select: {
          id: true,
          folio: true,
          status: true,
          fechaSolicitud: true,
          proyectoDestino: true,
          areaSolicitante: true,
        },
      });
      
      console.log('🔍 DEBUG - Solicitudes asignadas a este ingeniero (sin filtro):');
      solicitudesDelIngeniero.forEach(sol => {
        console.log(`   ID: ${sol.id}, Folio: ${sol.folio}, Status: ${sol.status}, Proyecto: ${sol.proyectoDestino}`);
      });
      
      // PASO 3: Aplicar el filtro de status ACTUALIZADO
      solicitudes = await prisma.solicitudProyecto.findMany({
        where: {
          ingenieroId: usuario.id,
          status: {
            in: ['Pendiente', 'En ejecución', 'En Revisión', 'Rechazada'] // INCLUIR TODOS LOS ESTADOS
          }
        },
        orderBy: { fechaSolicitud: 'desc' },
        select: {
          id: true,
          folio: true,
          fechaSolicitud: true,
          proyectoDestino: true,
          areaSolicitante: true,
          status: true,
        },
      });
      
      console.log('🔍 DEBUG - Solicitudes después del filtro [Pendiente, En ejecución, En Revisión, Rechazada]:');
      solicitudes.forEach(sol => {
        console.log(`   ID: ${sol.id}, Folio: ${sol.folio}, Status: ${sol.status}, Proyecto: ${sol.proyectoDestino}`);
      });
      
    } else if (rolUsuario === 'gerente') {
      solicitudes = await prisma.solicitudProyecto.findMany({
        where: {
          status: 'En Revisión'
        },
        orderBy: { fechaSolicitud: 'desc' },
        select: {
          id: true,
          folio: true,
          fechaSolicitud: true,
          proyectoDestino: true,
          areaSolicitante: true,
          status: true,
        },
      });
      
      console.log('🔍 DEBUG - Solicitudes para gerente [En Revisión]:', solicitudes.length);
      
    } else {
      // Usuario regular
      solicitudes = await prisma.solicitudProyecto.findMany({
        where: {
          solicitanteId: usuario.id
        },
        orderBy: { fechaSolicitud: 'desc' },
        select: {
          id: true,
          folio: true,
          fechaSolicitud: true,
          proyectoDestino: true,
          areaSolicitante: true,
          status: true,
        },
      });
      
      console.log('🔍 DEBUG - Solicitudes del usuario:', solicitudes.length);
    }

    console.log('🔍 DEBUG - Solicitudes que se enviarán al frontend:', solicitudes.length);
    return NextResponse.json(solicitudes);

  } catch (error) {
    console.error('❌ Error al obtener solicitudes:', error);
    return NextResponse.json({ message: 'Error del servidor' }, { status: 500 });
  }
}