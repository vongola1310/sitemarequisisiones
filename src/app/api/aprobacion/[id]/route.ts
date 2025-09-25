import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET - Obtener una solicitud para aprobación (solo gerentes)
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

    // Solo gerentes pueden ver solicitudes para aprobación
    if (usuario.role.name !== 'gerente') {
      return NextResponse.json({ message: 'No tienes permisos para realizar esta acción' }, { status: 403 });
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

    // Solo mostrar solicitudes en revisión
    if (solicitud.status !== 'En Revisión') {
      return NextResponse.json({ message: 'Esta solicitud no está disponible para aprobación' }, { status: 400 });
    }

    return NextResponse.json(solicitud);

  } catch (error) {
    console.error('Error al obtener la solicitud:', error);
    return NextResponse.json({ message: 'Error del servidor' }, { status: 500 });
  }
}

// PUT - Aprobar o rechazar una solicitud (solo gerentes)
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
    const { status, comments } = await request.json();

    // Obtener usuario actual con su rol
    const usuario = await prisma.user.findUnique({
      where: { email: session.user.email as string },
      include: { role: true },
    });

    if (!usuario) {
      return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
    }

    // Solo gerentes pueden aprobar/rechazar
    if (usuario.role.name !== 'gerente') {
      return NextResponse.json({ message: 'No tienes permisos para realizar esta acción' }, { status: 403 });
    }

    // Verificar que la solicitud existe
    const solicitudExistente = await prisma.solicitudProyecto.findUnique({
      where: { id: Number(resolvedParams.id) }
    });

    if (!solicitudExistente) {
      return NextResponse.json({ message: 'Solicitud no encontrada' }, { status: 404 });
    }

    // Solo se pueden aprobar/rechazar solicitudes en revisión
    if (solicitudExistente.status !== 'En Revisión') {
      return NextResponse.json({ message: 'Esta solicitud no puede ser modificada' }, { status: 400 });
    }

    // Validar estados válidos
    if (!['Aprobada', 'Rechazada'].includes(status)) {
      return NextResponse.json({ message: 'Estado inválido' }, { status: 400 });
    }

    // Definir el estado final basado en la acción del gerente
    const newStatus = status === 'Aprobada' ? 'En ejecución' : 'Rechazada';

    // Actualizar la solicitud
    const solicitudActualizada = await prisma.solicitudProyecto.update({
      where: {
        id: Number(resolvedParams.id),
      },
      data: {
        status: newStatus,
        comments,
        gerenteId: usuario.id, // Asignar el gerente que aprobó/rechazó
      },
    });

    return NextResponse.json({
      message: `Solicitud ${status.toLowerCase()} con éxito`,
      data: solicitudActualizada
    }, { status: 200 });

  } catch (error) {
    console.error('Error al actualizar la solicitud:', error);
    return NextResponse.json({ message: 'Error del servidor' }, { status: 500 });
  }
}