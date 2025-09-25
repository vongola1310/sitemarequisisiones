// src/lib/prisma.ts

import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

// Se necesita una solución global para Prisma Client
// porque `next dev` reinicia el módulo en cada cambio
declare global {
  var prisma: PrismaClient | undefined;
}

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;