import { z } from 'zod';
import { ProjectDetailsSchema } from '@/bcfms/schema/ProjectDetailsSchema.ts';
import { ProjectTypeSchema } from '@/bcfms/schema/ProjectTypeSchema.ts';
import { ProjectLocationSchema } from '@/bcfms/schema/ProjectLocationSchema.ts';
import { FossilDetailsSchema } from '@/bcfms/schema/FossilDetailsSchema.ts';
import { GeologySchema } from '@/bcfms/schema/GeologySchema.ts';
import { RiskAssessment } from '@/bcfms/schema/RiskAssessmentSchema.ts';

const IPASchema = z.object({
    projectDetails: z.array(ProjectDetailsSchema),
    projectType: z.array(ProjectTypeSchema),
    projectLocation: z.array(ProjectLocationSchema),
    fossilDetails: z.array(FossilDetailsSchema),
    geology: z.array(GeologySchema),
    riskAssessment: z.array(RiskAssessment),
});

const requiredIPASchema = IPASchema.partial();
// @ts-ignore
type IPAType = z.infer<typeof IPASchema>;

function getIPA(): IPAType {
    return new IPA();
}

// @todo - Figure out object state - New/Updated/Deleted
class IPA implements IPAType {
    constructor() {
        this.projectDetails = {};
        this.projectType = {};
        this.projectLocation = {};
        this.fossilDetails = {};
        this.geology = {};
        this.riskAssessment = {};
    }
    projectDetails: object;
    projectType: object;
    projectLocation: object;
    fossilDetails: object;
    geology: object;
    riskAssessment: object;
}

console.log(requiredIPASchema);

export {
    IPASchema,
    IPA,
    getIPA,
    requiredIPASchema,
};
