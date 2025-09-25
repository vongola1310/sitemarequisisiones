import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET - Obtener una solicitud específica
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ message: 'No autenticado' }, { status: 401 });
    }

    const resolvedParams = await params;

    // Obtener usuario actual con su rol
    const usuario = await prisma.user.findUnique({
      where: { email: session.user.email as string },
      include: { role: true },
    });

    if (!usuario) {
      return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
    }

    const solicitud = await prisma.solicitudProyecto.findUnique({
      where: {
        id: Number(resolvedParams.id),
      },
      include: {
        solicitante: {
          select: { name: true, email: true }
        },
        ingeniero: {
          select: { name: true, email: true }
        }
      }
    });

    if (!solicitud) {
      return NextResponse.json({ message: 'Solicitud no encontrada' }, { status: 404 });
    }

    // Verificar permisos
    const rolUsuario = usuario.role.name;
    const puedeVer = 
      rolUsuario === 'gerente' || // Gerente puede ver todas
      (rolUsuario === 'ingeniero' && solicitud.ingenieroId === usuario.id) || // Ingeniero asignado
      (rolUsuario === 'usuario' && solicitud.solicitanteId === usuario.id); // Usuario solicitante

    if (!puedeVer) {
      return NextResponse.json({ message: 'No tienes permisos para ver esta solicitud' }, { status: 403 });
    }

    return NextResponse.json(solicitud);

  } catch (error) {
    console.error('Error al obtener la solicitud:', error);
    return NextResponse.json({ message: 'Error del servidor' }, { status: 500 });
  }
}

// PUT - Actualizar el estado de una solicitud (para ingenieros)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ message: 'No autenticado' }, { status: 401 });
    }

    const resolvedParams = await params;
    const { status, comments, fechaEjecucion, recursosNecesarios, observaciones } = await request.json();

    // Obtener usuario actual con su rol
    const usuario = await prisma.user.findUnique({
      where: { email: session.user.email as string },
      include: { role: true },
    });

    if (!usuario) {
      return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
    }

    // Solo ingenieros pueden actualizar el estado
    if (usuario.role.name !== 'ingeniero') {
      return NextResponse.json({ message: 'No tienes permisos para realizar esta acción' }, { status: 403 });
    }

    // Verificar que la solicitud existe y está asignada a este ingeniero
    const solicitudExistente = await prisma.solicitudProyecto.findUnique({
      where: { id: Number(resolvedParams.id) }
    });

    if (!solicitudExistente) {
      return NextResponse.json({ message: 'Solicitud no encontrada' }, { status: 404 });
    }

    if (solicitudExistente.ingenieroId !== usuario.id) {
      return NextResponse.json({ message: 'Esta solicitud no está asignada a ti' }, { status: 403 });
    }

    // Validar transiciones de estado válidas
    const estadosValidos = ['En Revisión', 'Completada'];
    if (!estadosValidos.includes(status)) {
      return NextResponse.json({ message: 'Estado inválido' }, { status: 400 });
    }

    // Preparar datos para actualizar
    const datosActualizacion: any = {
      status,
      comments: comments || solicitudExistente.comments,
    };

    // Si se están enviando datos técnicos (cuando pasa de Pendiente a En Revisión)
    if (fechaEjecucion) {
      datosActualizacion.fechaEntregaFinal = new Date(fechaEjecucion);
    }
    if (recursosNecesarios) {
      // Los recursos vienen como objeto completo desde el frontend
      datosActualizacion.recursosNecesarios = recursosNecesarios;
    }
    if (observaciones !== undefined) {
      datosActualizacion.comments = observaciones;
    }

    // Actualizar la solicitud
    const solicitudActualizada = await prisma.solicitudProyecto.update({
      where: {
        id: Number(resolvedParams.id),
      },
      data: datosActualizacion,
    });

    return NextResponse.json({
      message: 'Solicitud actualizada con éxito',
      data: solicitudActualizada
    }, { status: 200 });

  } catch (error) {
    console.error('Error al actualizar la solicitud:', error);
    return NextResponse.json({ message: 'Error del servidor' }, { status: 500 });
  }
}