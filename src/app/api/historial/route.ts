// src/app/api/historial/route.ts
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

    const usuario = await prisma.user.findUnique({
      where: { email: session.user.email as string },
      select: { id: true },
    });

    if (!usuario) {
      return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
    }

    // HISTORIAL: Solo solicitudes donde el usuario es el solicitante
    // Incluir reportes para poder acceder a los IDs de reporte cuando sea necesario
    const solicitudes = await prisma.solicitudProyecto.findMany({
      where: {
        solicitanteId: usuario.id
      },
      include: {
        reporteServicio: {
          select: {
            id: true
          }
        }
      },
      orderBy: { fechaSolicitud: 'desc' }
    });

    return NextResponse.json(solicitudes);

  } catch (error) {
    console.error('Error al obtener historial:', error);
    return NextResponse.json({ message: 'Error del servidor' }, { status: 500 });
  }
}