import { z } from 'zod';

const ProjectLocationSchema = z.object({
    locationDescription: z
        .string({
            invalid_type_error: 'Location Description is required.',
        })
        .min(1, { message: 'Location Description is required.' })
        .max(250).nullable(),
    geometryQualifier: z
        .string()
        .max(250).nullable(),
    multipleGeometryQualifier: z
        .string()
        .max(250).nullable(),
});

const requiredProjectLocationSchema = ProjectLocationSchema.partial({
    locationDescription: true,
});
// @ts-ignore
type ProjectLocationType = z.infer<typeof ProjectLocationSchema>;

function getProjectLocation(): ProjectLocationType {
    return new ProjectLocation();
}

// @todo - Figure out object state - New/Updated/Deleted
class ProjectLocation implements ProjectLocationType {
    constructor() {
        this.locationDescription = '';
        this.geometryQualifier = '';
        this.multipleGeometryQualifier = '';
    }
    locationDescription: string;
    geometryQualifier: string;
    multipleGeometryQualifier: string;
}

export {
    ProjectLocation,
    ProjectLocationSchema,
    getProjectLocation,
    requiredProjectLocationSchema,
};
