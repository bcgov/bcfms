import { z } from 'zod';

const ProjectDetailsSchema = z.object({
    projectName: z
        .string({
            invalid_type_error: 'Project Name is required.',
        })
        .min(1, { message: 'Project Name is required.' })
        .max(250).nullable(),
    initiator: z
        .string({
            invalid_type_error: 'Initiator is required.',
        })
        .min(1, { message: 'Initiator is required.' })
        .max(250).nullable(),
    companyIndividualOrganization: z
        .string({
            invalid_type_error: 'Industry Company / Individual / Organization is required.',
        })
        .min(1, { message: 'Industry Company / Individual / Organization is required.' })
        .max(250).nullable(),
    authorizingAgency: z
        .string({
            invalid_type_error: 'Authorizing Agency is required.',
        })
        .min(1, { message: 'Authorizing Agency is required.' })
        .max(250).nullable(),
    landActNumber: z.number().int().max(250).nullable(),
    estimatedStartDate: z.date({
        // This handles null values -> null !== typeof Date
        invalid_type_error: 'Estimated start date is required.',
    }),
    estimatedEndDate: z.date(),
});

const requiredProjectDetailsSchema = ProjectDetailsSchema.partial({
    projectName: true,
    initiator: true,
    companyIndividualOrganization: true,
    authorizingAgency: true,
    landActNumber: true,
    estimatedStartDate: true,
});
// @ts-ignore
type ProjectDetailsType = z.infer<typeof ProjectDetailsSchema>;

function getProjectDetails(): ProjectDetailsType {
    return new ProjectDetails();
}

// @todo - Figure out object state - New/Updated/Deleted
class ProjectDetails implements ProjectDetailsType {
    constructor() {
        this.projectName = '';
        this.initiator = '';
        this.companyIndividualOrganization = '';
        this.authorizingAgency = '';
        this.landActNumber = 0;
        this.estimatedStartDate = null;
        this.estimatedEndDate = null;
    }
    projectName: string;
    initiator: string;
    companyIndividualOrganization: string;
    authorizingAgency: string;
    landActNumber: number;
    estimatedStartDate: Date | null;
    estimatedEndDate: Date | null;
}

export {
    ProjectDetails,
    ProjectDetailsSchema,
    getProjectDetails,
    requiredProjectDetailsSchema,
};
