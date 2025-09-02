import { z } from 'zod';
import type { StringValue } from '@/arches_component_lab/datatypes/string/types.ts';
import {
    currentDateValue,
    blankResourceInstanceValue,
    blankStringValue,
} from '@/bcfms/utils.ts';
import { blankConceptValue } from '@/arches_component_lab/datatypes/concept/utils.ts';
import type { ConceptValue } from '@/arches_component_lab/datatypes/concept/types.ts';
import type { ResourceInstanceValue } from '@/arches_component_lab/datatypes/resource-instance/types.ts';
import type { DateValue } from '@/arches_component_lab/datatypes/date/types.ts';
import { ConceptValueRequiredSchema } from '@/bcgov_arches_common/datatypes/concept/validation/zod.ts';
import {
    StringValueSchema,
    StringValueRequiredSchema,
    getStringValueSchema,
    getStringValueRequiredSchema,
} from '@/bcgov_arches_common/datatypes/string/validation/zod.ts';
import { ResourceInstanceValueRequiredSchema } from '@/bcgov_arches_common/datatypes/resource-instance/validation/zod.ts';
import {
    DateValueSchema,
    DateValueRequiredSchema,
} from '@/bcgov_arches_common/datatypes/date/validation/zod.ts';

const ProjectDetailsSchema = z.object({
    project_name: getStringValueRequiredSchema(120),
    // z
    // .string({
    //     invalid_type_error: 'Project Name is required.',
    // })
    // .min(1, { message: 'Project Name is required.' })
    // .max(120)
    // .nullable(),
    project_initiator: ResourceInstanceValueRequiredSchema,
    // z
    // .string()
    // .uuidv4({ message: 'Initiator is required.' })
    // .nullable(),
    industry_company_name: getStringValueRequiredSchema(60),
    // z.string({
    //     invalid_type_error:
    //         'Industry Company / Individual / Organization is required.',
    // })
    // .min(1, {
    //     message:
    //         'Industry Company / Individual / Organization is required.',
    // })
    // .max(60)
    // .nullable(),
    project_authorizing_agency: ConceptValueRequiredSchema,
    // Need to get this working
    land_act_file_number: getStringValueSchema(30),
    // land_act_file_number: StringValueSchema,
    // z.string()
    // .max(30)
    // .transform((val: string, ctx: any) => {
    //     const parsed = parseInt(val);
    //
    //     if (isNaN(parsed)) {
    //         ctx.addIssue({
    //             code: z.ZodIssueCode.custom,
    //             message: 'Land Act # must be a valid number.',
    //         });
    //         return z.NEVER;
    //     }
    //
    //     return parsed;
    // })
    // .nullable(),
    project_start_date: DateValueRequiredSchema,
    //     z.date({
    //     // This handles null values -> null !== typeof Date
    //     invalid_type_error: 'Estimated Start Date is required.',
    // }),
    project_end_date: DateValueSchema,
    project_type: z
        .string()
        .uuidv4({ message: 'Project Type is required.' })
        .nullable(),
    other_project_type: z.string().max(60).nullable(),
    proposed_activity: z
        .string({
            invalid_type_error: 'Proposed Activity is required.',
        })
        .min(1, { message: 'Proposed Activity is required.' })
        .max(60)
        .nullable(),
    location_description: z
        .string({
            invalid_type_error: 'Location Description is required.',
        })
        .min(1, { message: 'Location Description is required.' })
        .max(60)
        .nullable(),
    geometry_qualifier: z.uuidv4().nullable(),
    multiple_geometry_qualifier: z.string().nullable(),
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
        this.project_name = blankStringValue();
        this.project_initiator = blankResourceInstanceValue();
        this.industry_company_name = blankStringValue();
        this.project_authorizing_agency = blankConceptValue();
        this.land_act_file_number = blankStringValue();
        this.project_start_date = currentDateValue();
        this.project_end_date = currentDateValue();
        this.project_type = '';
        this.other_project_type = '';
        this.proposed_activity = '';
        this.location_description = '';
        this.geometry_qualifier = '';
        this.multiple_geometry_qualifier = '';
    }
    project_name: StringValue;
    project_initiator: ResourceInstanceValue;
    industry_company_name: StringValue;
    project_authorizing_agency: ConceptValue;
    land_act_file_number: StringValue;
    project_start_date: DateValue;
    project_end_date: DateValue;
    project_type: string;
    other_project_type: string;
    proposed_activity: string;
    location_description: string;
    geometry_qualifier: string;
    multiple_geometry_qualifier: string;
}

export {
    ProjectDetails,
    ProjectDetailsSchema,
    getProjectDetails,
    requiredProjectDetailsSchema,
};
