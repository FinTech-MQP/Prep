import * as ___generated_prisma_client_runtime from '../generated/prisma-client/runtime';
import * as ___generated_prisma_client from '../generated/prisma-client';
import { PrismaClient } from '../generated/prisma-client';

declare global {
    var prisma: PrismaClient | undefined;
}
declare const prisma: PrismaClient<___generated_prisma_client.Prisma.PrismaClientOptions, never, ___generated_prisma_client.Prisma.RejectOnNotFound | ___generated_prisma_client.Prisma.RejectPerOperation | undefined, ___generated_prisma_client_runtime.DefaultArgs>;

export { prisma };
