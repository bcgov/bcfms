import { z } from 'zod';

const GeologySchema = z.object({
    metamorphicRock: z
        .string()
        .max(250).nullable(),
    igneousRock: z
        .string()
        .max(250).nullable(),
    sedimentaryRock: z
        .string()
        .max(250).nullable(),
    quaternarySediments: z.string()
        .max(250).nullable(),
});

const requiredGeologySchema = GeologySchema.partial();
// @ts-ignore
type GeologyType = z.infer<typeof GeologySchema>;

function getGeology(): GeologyType {
    return new Geology();
}

// @todo - Figure out object state - New/Updated/Deleted
class Geology implements GeologyType {
    constructor() {
        this.metamorphicRock = '';
        this.igneousRock = '';
        this.sedimentaryRock = '';
        this.quaternarySediments = '';
    }
    metamorphicRock: string;
    igneousRock: string;
    sedimentaryRock: string;
    quaternarySediments: string;
}

export {
    Geology,
    GeologySchema,
    getGeology,
    requiredGeologySchema,
};
