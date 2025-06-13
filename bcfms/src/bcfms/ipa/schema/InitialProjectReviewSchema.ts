import { z } from 'zod';

const InitialProjectReviewSchema = z.object({
    dateSubmitted: z.date({
        // This handles null values -> null !== typeof Date
        invalid_type_error: 'Date Submitted is required.',
    }),
    assessmentDueDate: z.date(),
    intersectsIFA: z.boolean().default(false),
    proximityToFossils: z
        .string({
            invalid_type_error: 'Proximity To Fossils is required.',
        })
        .min(1, { message: 'Proximity To Fossils is required.' })
        .max(250)
        .nullable(),
    groundDisturbance: z
        .string({
            invalid_type_error: 'Ground Disturbance is required.',
        })
        .min(1, { message: 'Ground Disturbance is required.' })
        .max(250)
        .nullable(),
    metamorphicRock: z.string().max(250).nullable(),
    igneousRock: z.string().max(250).nullable(),
    sedimentaryRock: z.string().max(250).nullable(),
    quaternarySediments: z.string().max(250).nullable(),
    FRPR: z.string().max(250).nullable(),
    initialReviewLevelOfRisk: z.string().max(250).nullable(),
    initialReviewInternalNotes: z
        .string({
            invalid_type_error: 'Initial Review Internal Notes are required.',
        })
        .min(1, { message: 'Initial Review Internal Notes are required.' })
        .max(4000),
});

const requiredInitialProjectReviewSchema = InitialProjectReviewSchema.partial();
// @ts-ignore
type InitialProjectReviewType = z.infer<typeof InitialProjectReviewSchema>;

function getInitialProjectReview(): InitialProjectReviewType {
    return new InitialProjectReview();
}

class InitialProjectReview implements InitialProjectReviewType {
    constructor() {
        this.dateSubmitted = null;
        this.assessmentDueDate = null;
        this.intersectsIFA = false;
        this.proximityToFossils = '';
        this.groundDisturbance = '';
        this.metamorphicRock = '';
        this.igneousRock = '';
        this.sedimentaryRock = '';
        this.quaternarySediments = '';
        this.FRPR = '';
        this.initialReviewLevelOfRisk = '';
        this.initialReviewInternalNotes = '';
    }
    dateSubmitted: Date | null;
    assessmentDueDate: Date | null;
    intersectsIFA: boolean;
    proximityToFossils: string;
    groundDisturbance: string;
    FRPR: string;
    initialReviewLevelOfRisk: string;
    initialReviewInternalNotes: string;
    metamorphicRock: string;
    igneousRock: string;
    sedimentaryRock: string;
    quaternarySediments: string;
}

export {
    InitialProjectReview,
    InitialProjectReviewSchema,
    getInitialProjectReview,
    requiredInitialProjectReviewSchema,
};
