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

/* Generic Widget schemas
  @todo - Split into separate file
 */

const CollectionItemSchema = z.object({
    key: z.string(),
    label: z.string(),
    conceptid: z.string(),
    sortOrder: z.string().nullish(),
    get children() {
        return z.array(CollectionItemSchema);
    },
});

const ConceptValueSchema = z.object({
    display_value: z.string(),
    node_value: z.string().uuidv4(),
    details: z.array(CollectionItemSchema),
});

const ConceptValueRequiredSchema = ConceptValueSchema.safeExtend({
    node_value: z.string().uuidv4().min(1),
});

/* Internal StringValue types */
const languages = ['en'];
const LanguageValueSchema = z.object({
    value: z.string().nullable(),
    direction: z.enum(['ltr', 'rtl']),
});
const StringNodeValueSchema = z.looseObject({ en: LanguageValueSchema });

const StringNodeValueRequiredSchema = z.looseObject({
    en: LanguageValueSchema.safeExtend({
        value: z.string().min(1, { message: 'Value is required.' }),
    }),
});
/* END Internal StringValue types */

const StringValueSchema = z.object({
    display_value: z.string(),
    node_value: StringNodeValueSchema,
});

const StringValueRequiredSchema = z.object({
    display_value: z.string(),
    node_value: StringNodeValueRequiredSchema,
});

const ResourceInstanceReferenceSchema = z.object({
    resourceId: z.string().uuidv4(),
    ontologyProperty: z.string().nullable(),
    resourceXresourceId: z.string().nullable(),
    inverseOntologyProperty: z.string().nullable(),
});

const ResourceInstanceValueDetailsSchema = z.object({
    display_value: z.string(),
    resource_id: z.string().uuidv4(),
});
const ResourceInstanceValueSchema = z.object({
    display_value: z.string(),
    node_value: ResourceInstanceReferenceSchema.nullable(),
    details: z.array(ResourceInstanceValueDetailsSchema),
});
const ResourceInstanceValueRequiredSchema =
    ResourceInstanceValueSchema.safeExtend({
        node_value: ResourceInstanceReferenceSchema,
    });

const DateValueRequiredSchema = z.object({
    display_value: z.string().nullish(),
    node_value: z.iso.date(),
});

const DateValueSchema = DateValueRequiredSchema.safeExtend({
    node_value: z.iso.date().nullish(),
});
/* End Generic Widget Schemas */

const ProjectDetailsSchema = z.object({
    project_name: StringValueRequiredSchema,
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
    industry_company_name: StringValueRequiredSchema,
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
    land_act_file_number: StringValueSchema,
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
        this.land_act_file_number = 0;
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
    land_act_file_number: number;
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
