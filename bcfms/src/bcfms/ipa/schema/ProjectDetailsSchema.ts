import { z } from 'zod';

const ProjectDetailsSchema = z.object({
    projectName: z
        .string({
            invalid_type_error: 'Project Name is required.',
        })
        .min(1, { message: 'Project Name is required.' })
        .max(250)
        .nullable(),
    projectInitiator: z
        .string({
            invalid_type_error: 'Initiator is required.',
        })
        .min(1, { message: 'Initiator is required.' })
        .max(250)
        .nullable(),
    industryCompanyName: z
        .string({
            invalid_type_error:
                'Industry Company / Individual / Organization is required.',
        })
        .min(1, {
            message:
                'Industry Company / Individual / Organization is required.',
        })
        .max(250)
        .nullable(),
    projectAuthorizingAgency: z
        .string({
            invalid_type_error: 'Authorizing Agency is required.',
        })
        .min(1, { message: 'Authorizing Agency is required.' })
        .max(250)
        .nullable(),
    landActFileNumber: z.number().int().max(250).nullable(),
    projectStartDate: z.date({
        // This handles null values -> null !== typeof Date
        invalid_type_error: 'Estimated Start Date is required.',
    }),
    projectEndDate: z.date(),
    projectType: z
        .string({
            invalid_type_error: 'Project Type is required.',
        })
        .min(1, { message: 'Project Type is required.' })
        .max(250)
        .nullable(),
    otherProjectType: z
        .string({
            invalid_type_error: 'Other Project Type is required.',
        })
        .min(1, { message: 'Other Project Type is required.' })
        .max(250)
        .nullable(),
    proposedActivity: z
        .string({
            invalid_type_error: 'Proposed Activity is required.',
        })
        .min(1, { message: 'Proposed Activity is required.' })
        .max(250)
        .nullable(),
    locationDescription: z
        .string({
            invalid_type_error: 'Location Description is required.',
        })
        .min(1, { message: 'Location Description is required.' })
        .max(250)
        .nullable(),
    geometryQualifier: z.string().max(250).nullable(),
    multipleGeometryQualifier: z.string().max(250).nullable(),
});

const requiredProjectDetailsSchema = ProjectDetailsSchema.partial();
// @ts-ignore
type ProjectDetailsType = z.infer<typeof ProjectDetailsSchema>;

function getProjectDetails(): ProjectDetailsType {
    return new ProjectDetails();
}

// @todo - Figure out object state - New/Updated/Deleted
class ProjectDetails implements ProjectDetailsType {
    constructor() {
        this.projectName = '';
        this.projectInitiator = '';
        this.industryCompanyName = '';
        this.projectAuthorizingAgency = '';
        this.landActFileNumber = 0;
        this.projectStartDate = null;
        this.projectEndDate = null;
        this.projectType = '';
        this.otherProjectType = '';
        this.proposedActivity = '';
        this.locationDescription = '';
        this.geometryQualifier = '';
        this.multipleGeometryQualifier = '';
    }
    projectName: string;
    projectInitiator: string;
    industryCompanyName: string;
    projectAuthorizingAgency: string;
    landActFileNumber: number;
    projectStartDate: Date | null;
    projectEndDate: Date | null;
    projectType: string;
    otherProjectType: string;
    proposedActivity: string;
    locationDescription: string;
    geometryQualifier: string;
    multipleGeometryQualifier: string;
}

export {
    ProjectDetails,
    ProjectDetailsSchema,
    getProjectDetails,
    requiredProjectDetailsSchema,
};
