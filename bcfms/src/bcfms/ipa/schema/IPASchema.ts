import { z } from 'zod';
import { ProjectDetailsSchema } from '@/bcfms/schema/ProjectDetailsSchema.ts';
import { InitialProjectReviewSchema } from '@/bcfms/schema/InitialProjectReviewSchema.ts';

const IPASchema = z.object({
    projectDetails: z.array(ProjectDetailsSchema),
    initialProjectReview: z.array(InitialProjectReviewSchema),
});

const requiredIPASchema = IPASchema.partial();
// @ts-ignore
type IPAType = z.infer<typeof IPASchema>;

function getIPA(): IPAType {
    return new IPA();
}

class IPA implements IPAType {
    constructor() {
        this.projectDetails = {};
        this.initialProjectReview = {};
    }
    projectDetails: object;
    initialProjectReview: object;
}

console.log(requiredIPASchema);

export { IPASchema, IPA, getIPA, requiredIPASchema };
