import * as ___generated_prisma_client_runtime_library from '../generated/prisma-client/runtime/library';
import { PrismaClient, Prisma } from '../generated/prisma-client';

declare global {
    var prisma: PrismaClient | undefined;
}
declare const prisma: PrismaClient<Prisma.PrismaClientOptions, never, ___generated_prisma_client_runtime_library.DefaultArgs>;
type ListingPayload = Prisma.ListingGetPayload<{
    include: {
        address: {
            include: {
                parcel: {
                    include: {
                        zone: true;
                        assessments: true;
                        landUse: true;
                        femaFloodZone: true;
                    };
                };
            };
        };
        analyses: true;
    };
}>;

export { ListingPayload, prisma };
