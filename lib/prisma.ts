import { PrismaClient } from '../app/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is required to instantiate Prisma Client.');
}

const isAccelerate = databaseUrl.startsWith('prisma+postgres://');

let prisma: PrismaClient;

if (isAccelerate) {
  prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: databaseUrl }),
  });
} else {
  prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: databaseUrl }),
  });
}

if (process.env.NODE_ENV !== 'production') {
  const globalWithPrisma = globalThis as typeof globalThis & {
    prisma?: PrismaClient;
  };

  if (!globalWithPrisma.prisma) {
    globalWithPrisma.prisma = prisma;
  }

  prisma = globalWithPrisma.prisma;
}

export default prisma;
