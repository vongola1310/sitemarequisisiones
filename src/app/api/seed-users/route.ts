import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

let seeded = false; // Esto evitará correrlo varias veces en memoria

export async function GET() {
  try {
    if (seeded) {
      return NextResponse.json({ message: "Ya se ejecutó el seed una vez" }, { status: 400 });
    }

    // Crear roles
    const userRole = await prisma.role.upsert({
      where: { name: "usuario" },
      update: {},
      create: { name: "usuario" },
    });

    const gerenteRole = await prisma.role.upsert({
      where: { name: "gerente" },
      update: {},
      create: { name: "gerente" },
    });

    const ingenieroRole = await prisma.role.upsert({
      where: { name: "ingeniero" },
      update: {},
      create: { name: "ingeniero" },
    });

    // Crear usuarios
    const estelaPassword = await bcrypt.hash("Contraseña123", 10);
    const juanPassword = await bcrypt.hash("Contraseña456", 10);
    const gibranPassword = await bcrypt.hash("Contraseña789", 10);

    await prisma.user.upsert({
      where: { email: "estela.carrera@euroimmun.mx" },
      update: {},
      create: {
        name: "Estela Nizaye Carrera Sarmiento",
        email: "estela.carrera@euroimmun.mx",
        password: estelaPassword,
        roleId: userRole.id,
      },
    });

    await prisma.user.upsert({
      where: { email: "juan.ramirez@euroimmun.mx" },
      update: {},
      create: {
        name: "Juan Carlos Ramirez Hernandez",
        email: "juan.ramirez@euroimmun.mx",
        password: juanPassword,
        roleId: ingenieroRole.id,
      },
    });

    await prisma.user.upsert({
      where: { email: "gibran.pando@euroimmun.mx" },
      update: {},
      create: {
        name: "Gibran Pando Morales",
        email: "gibran.pando@euroimmun.mx",
        password: gibranPassword,
        roleId: gerenteRole.id,
      },
    });

    seeded = true;

    return NextResponse.json({ message: "Usuarios creados exitosamente" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error al crear usuarios" }, { status: 500 });
  }
}
