import { z } from 'zod';

const RiskAssessmentSchema = z.object({
    fossilRanking: z
        .string()
        .max(250).nullable(),
    initialLevelOfRisk: z
        .string()
        .max(250).nullable(),
    initialInternalNotes: z
        .string({
            invalid_type_error: 'Initial Review Internal Notes are required.',
        })
        .min(1, { message: 'Initial Review Internal Notes are required.' })
        .max(4000),
});

const requiredRiskAssessmentSchema = RiskAssessmentSchema.partial();
// @ts-ignore
type RiskAssessmentType = z.infer<typeof RiskAssessmentSchema>;

function getRiskAssessment(): RiskAssessmentType {
    return new RiskAssessment();
}

// @todo - Figure out object state - New/Updated/Deleted
class RiskAssessment implements RiskAssessmentType {
    constructor() {
        this.fossilRanking = '';
        this.initialLevelOfRisk = '';
        this.initialInternalNotes = '';
    }
    fossilRanking: string;
    initialLevelOfRisk: string;
    initialInternalNotes: string;
}

export {
    RiskAssessment,
    RiskAssessmentSchema,
    getRiskAssessment,
    requiredRiskAssessmentSchema,
};
