// src/app/api/resumen-reporte/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface Context {
  params: Promise<{ id: string }>; // 👈 ahora es Promise
}

export async function GET(
  request: NextRequest,
  context: Context
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ message: 'No autenticado' }, { status: 401 });
    }

    // 👇 params se resuelve con await
    const { id } = await context.params;
    const finalId = Number(id);

    // Obtener usuario actual
    const usuario = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { role: true },
    });

    if (!usuario) {
      return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
    }

    // Obtener la solicitud completa
    const solicitudCompleta = await prisma.solicitudProyecto.findUnique({
      where: { id: finalId },
      include: {
        solicitante: { select: { name: true, email: true } },
        ingeniero: { select: { name: true, email: true } },
        gerente: { select: { name: true, email: true } },
        reporteServicio: {
          include: {
            usuario: { select: { name: true, email: true } },
            ingeniero: { select: { name: true, email: true } },
          },
        },
      },
    });

    if (!solicitudCompleta) {
      return NextResponse.json({ message: 'Solicitud no encontrada' }, { status: 404 });
    }

    // Validar permisos
    const rolUsuario = usuario.role.name;
    const esElSolicitante = solicitudCompleta.solicitanteId === usuario.id;
    const esGerente = rolUsuario === 'gerente';
    const esIngeniero = rolUsuario === 'ingeniero' && solicitudCompleta.ingenieroId === usuario.id;

    if (!esElSolicitante && !esGerente && !esIngeniero) {
      return NextResponse.json({ message: 'No tienes permisos para ver este resumen' }, { status: 403 });
    }

    // Validar que esté cerrado
    const estado = solicitudCompleta.status?.trim().toLowerCase();
    console.log("STATUS ENCONTRADO:", solicitudCompleta.status);

    if (estado !== "cerrado") {
      return NextResponse.json(
        { message: "Esta solicitud aún no está cerrada. No se puede generar el resumen." },
        { status: 400 }
      );
    }

    return NextResponse.json(solicitudCompleta);

  } catch (error) {
    console.error('Error al obtener el resumen completo:', error);
    return NextResponse.json(
      { message: 'Error del servidor al procesar la solicitud.' },
      { status: 500 }
    );
  }
}
