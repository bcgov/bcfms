import { z } from 'zod';
import {
    ProjectDetailsSchema,
    getProjectDetails,
} from '@/bcfms/ipa/schema/ProjectDetailsSchema.ts';
import { InitialProjectReviewSchema } from '@/bcfms/ipa/schema/InitialProjectReviewSchema.ts';

const IPASchema = z.object({
    project_details: z.array(ProjectDetailsSchema),
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
        this.project_details = getProjectDetails();
        this.initialProjectReview = {};
    }
    project_details: typeof ProjectDetailsSchema;
    initialProjectReview: typeof InitialProjectReviewSchema;
}

console.log(requiredIPASchema);

export { IPASchema, IPA, getIPA, requiredIPASchema, type IPAType };
