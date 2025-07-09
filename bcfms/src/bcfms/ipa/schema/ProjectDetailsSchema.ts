import { z } from 'zod';

const ProjectDetailsSchema = z.object({
    projectName: z
        .string({
            invalid_type_error: 'Project Name is required.',
        })
        .min(1, { message: 'Project Name is required.' })
        .max(120)
        .nullable(),
    projectInitiator: z
        .string()
        .uuid({ message: 'Initiator is required.' })
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
        .max(60)
        .nullable(),
    projectAuthorizingAgency: z
        .string()
        .uuid({ message: 'Authorizing Agency is required.' })
        .nullable(),
    landActFileNumber: z
        .string()
        .max(30)
        .transform((val: string, ctx: any) => {
            const parsed = parseInt(val);

            if (isNaN(parsed)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Land Act # must be a valid number.',
                });
                return z.NEVER;
            }

            return parsed;
        })
        .nullable(),
    projectStartDate: z.date({
        // This handles null values -> null !== typeof Date
        invalid_type_error: 'Estimated Start Date is required.',
    }),
    projectEndDate: z.date(),
    projectType: z
        .string()
        .uuid({ message: 'Project Type is required.' })
        .nullable(),
    otherProjectType: z.string().max(60).nullable(),
    proposedActivity: z
        .string({
            invalid_type_error: 'Proposed Activity is required.',
        })
        .min(1, { message: 'Proposed Activity is required.' })
        .max(60)
        .nullable(),
    locationDescription: z
        .string({
            invalid_type_error: 'Location Description is required.',
        })
        .min(1, { message: 'Location Description is required.' })
        .max(60)
        .nullable(),
    geometryQualifier: z.string().uuid().max(250).nullable(),
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
