import * as ___generated_prisma_client_runtime_library from '../generated/prisma-client/runtime/library';
import { Prisma } from '../generated/prisma-client';

declare const prisma: ___generated_prisma_client_runtime_library.DynamicClientExtensionThis<Prisma.TypeMap<___generated_prisma_client_runtime_library.InternalArgs<{
    [x: string]: {
        [x: string]: unknown;
    };
}, {
    [x: string]: {
        [x: string]: unknown;
    };
}, {
    [x: string]: {
        [x: string]: unknown;
    };
}, {
    [x: string]: unknown;
}> & {
    result: {
        parcel: {
            acres: () => {
                needs: {
                    sqft: true;
                };
                compute(parcel: {
                    sqft: number;
                }): number;
            };
        };
    };
    model: {};
    query: {};
    client: {};
}>, Prisma.TypeMapCb, {
    result: {
        parcel: {
            acres: () => {
                needs: {
                    sqft: true;
                };
                compute(parcel: {
                    sqft: number;
                }): number;
            };
        };
    };
    model: {};
    query: {};
    client: {};
}>;
type ExtendedPrismaClient = typeof prisma;
declare global {
    var prisma: ExtendedPrismaClient | undefined;
}
type ListingPayload = Prisma.ListingGetPayload<{
    include: {
        address: {
            include: {
                parcel: {
                    include: {
                        zone: true;
                        assessments: true;
                        landUse: true;
                    };
                };
            };
        };
    };
}>;

export { ListingPayload, prisma };
