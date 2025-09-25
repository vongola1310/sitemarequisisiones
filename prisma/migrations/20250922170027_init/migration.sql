-- CreateTable
CREATE TABLE "public"."Role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "roleId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SolicitudProyecto" (
    "id" SERIAL NOT NULL,
    "folio" TEXT NOT NULL,
    "fechaSolicitud" TIMESTAMP(3) NOT NULL,
    "fechaEntregaFinal" TIMESTAMP(3),
    "proyectoDestino" TEXT NOT NULL,
    "areaSolicitante" TEXT NOT NULL,
    "productoSolicitado" JSONB,
    "descripcion" TEXT NOT NULL,
    "recursosNecesarios" JSONB,
    "solicitanteId" INTEGER NOT NULL,
    "ingenieroId" INTEGER NOT NULL,
    "gerenteId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SolicitudProyecto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ReporteServicio" (
    "id" SERIAL NOT NULL,
    "folioSolicitud" TEXT NOT NULL,
    "fechaEntrega" TIMESTAMP(3) NOT NULL,
    "proyecto" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "responsable" TEXT NOT NULL,
    "correoResponsable" TEXT NOT NULL,
    "informacionServicio" JSONB,
    "accionesRealizadas" TEXT NOT NULL,
    "observaciones" TEXT NOT NULL,
    "descripcionEntregables" TEXT NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "ingenieroId" INTEGER NOT NULL,
    "solicitudId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReporteServicio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "public"."Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "SolicitudProyecto_folio_key" ON "public"."SolicitudProyecto"("folio");

-- CreateIndex
CREATE UNIQUE INDEX "ReporteServicio_folioSolicitud_key" ON "public"."ReporteServicio"("folioSolicitud");

-- CreateIndex
CREATE UNIQUE INDEX "ReporteServicio_solicitudId_key" ON "public"."ReporteServicio"("solicitudId");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "public"."Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SolicitudProyecto" ADD CONSTRAINT "SolicitudProyecto_solicitanteId_fkey" FOREIGN KEY ("solicitanteId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SolicitudProyecto" ADD CONSTRAINT "SolicitudProyecto_ingenieroId_fkey" FOREIGN KEY ("ingenieroId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SolicitudProyecto" ADD CONSTRAINT "SolicitudProyecto_gerenteId_fkey" FOREIGN KEY ("gerenteId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ReporteServicio" ADD CONSTRAINT "ReporteServicio_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ReporteServicio" ADD CONSTRAINT "ReporteServicio_ingenieroId_fkey" FOREIGN KEY ("ingenieroId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ReporteServicio" ADD CONSTRAINT "ReporteServicio_solicitudId_fkey" FOREIGN KEY ("solicitudId") REFERENCES "public"."SolicitudProyecto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
