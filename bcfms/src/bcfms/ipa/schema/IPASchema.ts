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
    aliased_data: z.object({
        project_details: z.array(ProjectDetailsSchema),
        initial_project_review: z.array(InitialProjectReviewSchema),
    }),
});

const requiredIPASchema = IPASchema.partial();
// @ts-ignore
type IPAType = z.infer<typeof IPASchema>;

function getIPA(): IPAType {
    return new IPA();
}

class IPA implements IPAType {
    constructor() {
        this.aliased_data = {
            project_details: getProjectDetails(),
            initial_project_review: getInitialProjectReview(),
            assessment_details: new AssessmentDetails(),
        };
    }
    aliased_data: {
        project_details: typeof ProjectDetailsSchema;
        initial_project_review: typeof InitialProjectReviewSchema;
        assessment_details: AssessmentDetailsType;
    };
}

console.log(requiredIPASchema);

export { IPASchema, IPA, getIPA, requiredIPASchema, type IPAType };
