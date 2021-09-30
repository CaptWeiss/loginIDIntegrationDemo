// lib/prisma.ts
import { PrismaClient } from '@prisma/client';
// import { IWed, global } from 'lib/prisma';

declare let global: typeof globalThis & { prisma: any };

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;
