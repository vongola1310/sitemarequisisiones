// src/app/api/reporte-servicio/[id]/firmar/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Usuario acepta el reporte → cierra la solicitud
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ message: "No autorizado" }, { status: 403 });
    }

    // Buscar reporte
    const reporte = await prisma.reporteServicio.findUnique({
      where: { id: Number(id) },
      include: { solicitud: true },
    });

    if (!reporte) {
      return NextResponse.json({ message: "Reporte no encontrado" }, { status: 404 });
    }

    // Verificar que quien firma es el solicitante
    if (reporte.usuarioId !== (await prisma.user.findUnique({
      where: { email: session.user.email ?? "" },
      select: { id: true },
    }))?.id) {
      return NextResponse.json({ message: "No autorizado para firmar" }, { status: 403 });
    }

    // Cambiar estado de la solicitud a "Cerrado"
    await prisma.solicitudProyecto.update({
      where: { id: reporte.solicitudId },
      data: { status: "Cerrado" },
    });

    return NextResponse.json({ message: "Reporte firmado, solicitud cerrada" });
  } catch (error) {
    console.error("Error en PUT /reporte-servicio/firmar:", error);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}
