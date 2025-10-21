import { z } from 'zod';
import {
    ProjectDetailsSchema,
    getProjectDetails,
} from '@/bcfms/ipa/schema/ProjectDetailsSchema.ts';
import {
    InitialProjectReviewSchema,
    getInitialProjectReview,
} from '@/bcfms/ipa/schema/InitialProjectReviewSchema.ts';
import type { AssessmentDetailsType } from '@/bcfms/ipa/schema/AssessmentDetailsSchema.ts';
import { AssessmentDetails } from '@/bcfms/ipa/schema/AssessmentDetailsSchema.ts';

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
        this.initialProjectReview = getInitialProjectReview();
        this.assessment_details = new AssessmentDetails();
    }
    project_details: typeof ProjectDetailsSchema;
    assessment_details: AssessmentDetailsType;
    initialProjectReview: typeof InitialProjectReviewSchema;
}

console.log(requiredIPASchema);

export { IPASchema, IPA, getIPA, requiredIPASchema, type IPAType };
