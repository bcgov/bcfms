import { z } from 'zod';

const ProjectTypeSchema = z.object({
    projectType: z
        .string({
            invalid_type_error: 'Project Type is required.',
        })
        .min(1, { message: 'Project Type is required.' })
        .max(250).nullable(),
    otherProjectType: z
        .string({
            invalid_type_error: 'Other Project Type is required.',
        })
        .min(1, { message: 'Other Project Type is required.' })
        .max(250).nullable(),
    proposedActivity: z
        .string({
            invalid_type_error: 'Proposed Activity is required.',
        })
        .min(1, { message: 'Proposed Activity is required.' })
        .max(250).nullable(),
});

const requiredProjectTypeSchema = ProjectTypeSchema.partial({
    projectType: true,
    otherProjectType: true,
    proposedActivity: true,
});
// @ts-ignore
type ProjectTypeType = z.infer<typeof ProjectTypeSchema>;

function getProjectType(): ProjectTypeType {
    return new ProjectType();
}

// @todo - Figure out object state - New/Updated/Deleted
class ProjectType implements ProjectTypeType {
    constructor() {
        this.projectType = '';
        this.otherProjectType = '';
        this.proposedActivity = '';
    }
    projectType: string;
    otherProjectType: string;
    proposedActivity: string;
}

export {
    ProjectType,
    ProjectTypeSchema,
    getProjectType,
    requiredProjectTypeSchema,
};
