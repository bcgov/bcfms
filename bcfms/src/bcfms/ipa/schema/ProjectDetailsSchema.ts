import { z } from 'zod';
import type { StringValue } from '@/arches_component_lab/datatypes/string/types.ts';
import {
    currentDateValue,
    blankResourceInstanceValue,
    blankStringValue,
    blankFileListValue,
    blankGeoJSONValue,
} from '@/bcfms/utils.ts';
import { blankConceptValue } from '@/arches_component_lab/datatypes/concept/utils.ts';
import type { ConceptValue } from '@/arches_component_lab/datatypes/concept/types.ts';
import type { ResourceInstanceValue } from '@/arches_component_lab/datatypes/resource-instance/types.ts';
import type { DateValue } from '@/arches_component_lab/datatypes/date/types.ts';
import {
    ConceptValueRequiredSchema,
    ConceptValueSchema,
} from '@/bcgov_arches_common/datatypes/concept/validation/zod.ts';
import {
    getStringValueSchema,
    getStringValueRequiredSchema,
} from '@/bcgov_arches_common/datatypes/string/validation/zod.ts';
import { ResourceInstanceValueRequiredSchema } from '@/bcgov_arches_common/datatypes/resource-instance/validation/zod.ts';
import { FileListValueSchema } from '@/bcgov_arches_common/datatypes/file-list/validation/zod.ts';
import { DateValueSchema } from '@/bcgov_arches_common/datatypes/date/validation/zod.ts';
import type { FileListValue } from '@/arches_component_lab/datatypes/file-list/types.ts';
import type { GeoJSONFeatureCollectionValue } from '@/bcgov_arches_common/datatypes/geojson-feature-collection/types.ts';

const ProjectDetailsSchema = z.object({
    aliased_data: z.object({
        project_name: getStringValueRequiredSchema(120),
        project_initiator: ResourceInstanceValueRequiredSchema,
        industry_company_name: getStringValueRequiredSchema(60),
        project_authorizing_agency: ConceptValueRequiredSchema,
        land_act_file_number: getStringValueSchema(30),
        project_start_date: DateValueSchema,
        project_end_date: DateValueSchema,
        project_documents: FileListValueSchema,
        project_type: z.object({
            aliased_data: z.object({
                project_type: ConceptValueRequiredSchema,
                other_project_type: getStringValueSchema(60),
                proposed_activity: getStringValueRequiredSchema(60),
            }),
        }),
        project_site: z.object({
            aliased_data: z.object({
                location_description: getStringValueRequiredSchema(60),
                geometry_qualifier: ConceptValueSchema,
                multiple_geometry_qualifier: getStringValueSchema(120),
            }),
        }),
    }),
});

const ProjectDateValidationSchema = z
    .object({
        project_start_date: z.any().optional(),
        project_end_date: z.any().optional(),
    })
    .superRefine((data: any, ctx: any) => {
        const startVal = data?.project_start_date?.node_value;
        const endVal = data?.project_end_date?.node_value;

        if (startVal && endVal) {
            const startDate = new Date(startVal as string);
            const endDate = new Date(endVal as string);

            if (endDate < startDate) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message:
                        'Estimated Project End Date cannot be before the Start Date.',
                    path: ['project_end_date'],
                });
            }
        }
    });

const requiredProjectDetailsSchema = ProjectDetailsSchema.partial();
// @ts-ignore
type ProjectDetailsType = z.infer<typeof ProjectDetailsSchema>;

function getProjectDetails(): ProjectDetailsType {
    return new ProjectDetails();
}

class ProjectDetails implements ProjectDetailsType {
    constructor() {
        this.aliased_data = {
            project_name: blankStringValue(),
            project_initiator: blankResourceInstanceValue(),
            industry_company_name: blankStringValue(),
            project_authorizing_agency: blankConceptValue(),
            land_act_file_number: blankStringValue(),
            project_start_date: currentDateValue(),
            project_end_date: currentDateValue(),
            project_documents: {
                aliased_data: {
                    project_documents: blankFileListValue(),
                },
            },
            project_type: {
                aliased_data: {
                    project_type: blankConceptValue(),
                    other_project_type: blankStringValue(),
                    proposed_activity: blankStringValue(),
                },
            },
            project_site: {
                aliased_data: {
                    project_location: blankGeoJSONValue(),
                    location_description: blankStringValue(),
                    geometry_qualifier: blankConceptValue(),
                    multiple_geometry_qualifier: blankStringValue(),
                },
            },
        };
    }
    aliased_data: {
        project_name: StringValue;
        project_initiator: ResourceInstanceValue;
        industry_company_name: StringValue;
        project_authorizing_agency: ConceptValue;
        land_act_file_number: StringValue;
        project_start_date: DateValue;
        project_end_date: DateValue;
        project_documents: {
            aliased_data: {
                project_documents: FileListValue;
            };
        };
        project_type: {
            aliased_data: {
                project_type: ConceptValue;
                other_project_type: StringValue;
                proposed_activity: StringValue;
            };
        };
        project_site: {
            aliased_data: {
                project_location: GeoJSONFeatureCollectionValue;
                location_description: StringValue;
                geometry_qualifier: ConceptValue;
                multiple_geometry_qualifier: StringValue;
            };
        };
    };
}

export {
    ProjectDetails,
    ProjectDetailsSchema,
    ProjectDateValidationSchema,
    getProjectDetails,
    requiredProjectDetailsSchema,
    type ProjectDetailsType,
};
