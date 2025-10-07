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
import {
    ConceptValueRequiredSchema,
    ConceptValueSchema,
} from '@/bcgov_arches_common/datatypes/concept/validation/zod.ts';
import {
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
    project_initiator: ResourceInstanceValueRequiredSchema,
    industry_company_name: getStringValueRequiredSchema(60),
    project_authorizing_agency: ConceptValueRequiredSchema,
    land_act_file_number: getStringValueSchema(30),
    project_start_date: DateValueRequiredSchema,
    project_end_date: DateValueSchema,
    project_type: ConceptValueRequiredSchema,
    other_project_type: getStringValueSchema(60),
    proposed_activity: getStringValueRequiredSchema(60),
    location_description: getStringValueRequiredSchema(60),
    geometry_qualifier: ConceptValueSchema,
    multiple_geometry_qualifier: getStringValueSchema(120),
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
        this.project_type = blankConceptValue();
        this.other_project_type = blankStringValue();
        this.proposed_activity = blankStringValue();
        this.location_description = blankStringValue();
        this.geometry_qualifier = blankConceptValue();
        this.multiple_geometry_qualifier = blankStringValue();
    }
    project_name: StringValue;
    project_initiator: ResourceInstanceValue;
    industry_company_name: StringValue;
    project_authorizing_agency: ConceptValue;
    land_act_file_number: StringValue;
    project_start_date: DateValue;
    project_end_date: DateValue;
    project_type: ConceptValue;
    other_project_type: StringValue;
    proposed_activity: StringValue;
    location_description: StringValue;
    geometry_qualifier: ConceptValue;
    multiple_geometry_qualifier: StringValue;
}

export {
    ProjectDetails,
    ProjectDetailsSchema,
    getProjectDetails,
    requiredProjectDetailsSchema,
    type ProjectDetailsType,
};
