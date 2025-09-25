// src/app/api/reporte-servicio/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";


export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ message: "No autorizado" }, { status: 403 });
    }

    // Buscar el reporte con toda la información relacionada
    const reporte = await prisma.reporteServicio.findUnique({
      where: { id: Number(id) },
      include: {
        solicitud: {
          select: {
            id: true,
            folio: true,
            fechaSolicitud: true,
            proyectoDestino: true,
            areaSolicitante: true,
            descripcion: true,
            status: true,
          }
        },
        ingeniero: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      },
    });

    if (!reporte) {
      return NextResponse.json({ message: "Reporte no encontrado" }, { status: 404 });
    }

    return NextResponse.json(reporte, { status: 200 });

  } catch (error) {
    console.error("Error en GET /reporte-servicio:", error);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}


// Crear reporte de servicio (Ingeniero)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ingeniero") {
      return NextResponse.json({ message: "No autorizado" }, { status: 403 });
    }

    const body = await request.json();
    const { accionesRealizadas, descripcionEntregables, observaciones } = body;

    // Buscar la solicitud
    const solicitud = await prisma.solicitudProyecto.findUnique({
      where: { id: Number(id) },
    });

    if (!solicitud || solicitud.status !== "En ejecución") {
      return NextResponse.json(
        { message: "Solicitud no encontrada o no está en ejecución" },
        { status: 404 }
      );
    }

    // Crear reporte
    const reporte = await prisma.reporteServicio.create({
      data: {
        solicitudId: solicitud.id,
        folioSolicitud: solicitud.folio,
        fechaEntrega: new Date(),
        proyecto: solicitud.proyectoDestino,
        area: solicitud.areaSolicitante,
        responsable: session.user.name ?? "",
        correoResponsable: session.user.email!,
        informacionServicio: solicitud.productoSolicitado,
        accionesRealizadas,
        descripcionEntregables,
        observaciones: observaciones ?? "",
        usuarioId: solicitud.solicitanteId,
        ingenieroId: (await prisma.user.findUnique({
          where: { email: session.user.email ?? "" },
          select: { id: true },
        }))?.id!,
      },
    });

    // Cambiar solicitud a "Pendiente de firma"
    await prisma.solicitudProyecto.update({
      where: { id: solicitud.id },
      data: { status: "Pendiente de firma" },
    });

    return NextResponse.json(
      { message: "Reporte creado con éxito", data: reporte },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error en POST /reporte-servicio:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
