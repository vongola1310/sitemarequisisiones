// src/app/api/solicitud/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const {
      fechaSolicitud,
      fechaEntregaFinal,
      proyectoDestino,
      areaSolicitante,
      paginaWeb,
      animacion2D3D,
      edicionVideo,
      postRedesSociales,
      modelo3D,
      aplicacionRVRA,
      disenoUX,
      streaming,
      otroProducto,
      descripcion,
      unrealEngine,
      unity,
      paqueteriaAdobe,
      blender,
      canva,
      visualStudioCode,
      microfonosCapturadora,
      otroRecurso
    } = await request.json();

    // Verificación básica de los datos
    if (!fechaSolicitud || !proyectoDestino || !areaSolicitante || !descripcion) {
      return NextResponse.json({ message: 'Faltan campos obligatorios' }, { status: 400 });
    }

    // Se asume que el usuario que hace la solicitud es el mismo que está logueado
    // Necesitamos una forma de obtener el ID del usuario autenticado.
    // Esto lo veremos en el siguiente paso con Next-Auth.
    // Por ahora, usaremos un ID de ejemplo o lo dejaremos pendiente.
    const solicitanteId = 1; // ID de usuario de ejemplo
    const ingenieroId = 2; // ID de ingeniero de ejemplo

    // Crear un objeto JSON para los productos y recursos
    const productos = {
        paginaWeb,
        animacion2D3D,
        edicionVideo,
        postRedesSociales,
        modelo3D,
        aplicacionRVRA,
        disenoUX,
        streaming,
        otroProducto
    };

    const recursos = {
        unrealEngine,
        unity,
        paqueteriaAdobe,
        blender,
        canva,
        visualStudioCode,
        microfonosCapturadora,
        otroRecurso
    };

    // Guardar los datos en la base de datos
    const nuevaSolicitud = await prisma.solicitudProyecto.create({
      data: {
        folio: Math.random().toString(36).substring(2, 8).toUpperCase(), // Genera un folio único simple
        fechaSolicitud: new Date(fechaSolicitud),
        fechaEntregaFinal: fechaEntregaFinal ? new Date(fechaEntregaFinal) : null,
        proyectoDestino,
        areaSolicitante,
        productoSolicitado: productos,
        descripcion,
        recursosNecesarios: recursos,
        solicitanteId: solicitanteId,
        ingenieroId: ingenieroId,
        // El gerenteId se puede agregar en otro paso cuando autorice
      },
    });

    return NextResponse.json({ message: 'Solicitud enviada con éxito', data: nuevaSolicitud }, { status: 201 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Ocurrió un error en el servidor' }, { status: 500 });
  }
}