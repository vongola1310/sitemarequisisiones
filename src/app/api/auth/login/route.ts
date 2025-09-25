// src/app/api/auth/login/route.ts

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '../../../../lib/prisma.ts';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // 1. Validar los datos de entrada
    if (!email || !password) {
      return NextResponse.json({ message: 'El correo electrónico y la contraseña son obligatorios' }, { status: 400 });
    }

    // 2. Buscar al usuario en la base de datos
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        role: true, // Incluye la información del rol del usuario
      },
    });

    // 3. Verificar si el usuario existe
    if (!user) {
      return NextResponse.json({ message: 'Credenciales inválidas' }, { status: 401 });
    }

    // 4. Comparar la contraseña proporcionada con el hash almacenado
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Credenciales inválidas' }, { status: 401 });
    }

    // 5. Autenticación exitosa
    // En este punto, el usuario es válido. En el siguiente paso
    // vamos a generar un token de sesión o un cookie para mantener la sesión.
    // Por ahora, solo devolveremos los datos del usuario.

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role.name, // El nombre del rol
    };

    return NextResponse.json({
      message: 'Inicio de sesión exitoso',
      user: userData,
    }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Ocurrió un error en el servidor' }, { status: 500 });
  }
}