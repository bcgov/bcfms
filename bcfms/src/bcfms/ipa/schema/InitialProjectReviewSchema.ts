import { z } from 'zod';

const InitialProjectReviewSchema = z.object({
    dateSubmitted: z.date({
        // This handles null values -> null !== typeof Date
        invalid_type_error: 'Date Submitted is required.',
    }),
    assessmentDueDate: z.date(),
    intersectsIFA: z.boolean().default(false),
    proximityToFossils: z
        .string()
        .uuid({ message: 'Proximity To Fossils is required.' })
        .nullable(),
    groundDisturbance: z
        .string()
        .uuid({ message: 'Ground Disturbance is required.' })
        .nullable(),
    metamorphicRock: z.string().uuid().nullable(),
    igneousRock: z.string().uuid().nullable(),
    sedimentaryRock: z.string().uuid().nullable(),
    quaternarySediments: z.string().uuid().nullable(),
    FRPR: z.string().uuid().nullable(),
    initialReviewLevelOfRisk: z.string().uuid().nullable(),
    initialReviewInternalNotes: z
        .string({
            invalid_type_error: 'Initial Review Internal Notes are required.',
        })
        .min(1, { message: 'Initial Review Internal Notes are required.' })
        .max(500),
    initialReviewOutcome: z.string().max(500),
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
        this.initialReviewOutcome = '';
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
    initialReviewOutcome: string;
}

export {
    InitialProjectReview,
    InitialProjectReviewSchema,
    getInitialProjectReview,
    requiredInitialProjectReviewSchema,
};
