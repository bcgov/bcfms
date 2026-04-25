import { z } from 'zod';
import type { StringValue } from '@/arches_component_lab/datatypes/string/types.ts';
import { currentDateValue, blankStringValue } from '@/bcfms/utils.ts';
import { blankConceptValue } from '@/arches_component_lab/datatypes/concept/utils.ts';
import type { ConceptValue } from '@/arches_component_lab/datatypes/concept/types.ts';
import type { DateValue } from '@/arches_component_lab/datatypes/date/types.ts';
import type { AliasedTileData } from '@/arches_component_lab/types.ts';
import {
    DateValueSchema,
    DateValueRequiredSchema,
} from '@/bcgov_arches_common/datatypes/date/validation/zod.ts';
import { StringValueSchema } from '@/bcgov_arches_common/datatypes/string/validation/zod.ts';
import {
    ConceptValueRequiredSchema,
    ConceptValueSchema,
} from '@/bcgov_arches_common/datatypes/concept/validation/zod.ts';

export const AssessmentDetailsSchema = z.object({
    aliased_data: z.object({
        ipa_number: StringValueSchema,
        assessment_completion_date: DateValueSchema,
        assessment_start_date: DateValueRequiredSchema,
        project_requirements: ConceptValueSchema,
        fossil_repository_agreement: ConceptValueRequiredSchema,
        other_requirement_details: StringValueSchema,
    }),
});

export interface AssessmentDetailsType extends AliasedTileData {
    aliased_data: {
        ipa_number: StringValue;
        assessment_completion_date: DateValue;
        assessment_start_date: DateValue;
        project_requirements: ConceptValue; // if this is multi-select in your graph, switch to your multi-concept type
        fossil_repository_agreement: ConceptValue; // UUID-backed concept
        other_requirement_details: StringValue;
    };
}

export class AssessmentDetails implements AssessmentDetailsType {
    constructor() {
        this.nodegroup = '';
        this.parenttile = null;
        this.provisionaledits = null;
        this.resourceinstance = '';
        this.sortorder = 0;
        this.tileid = null;
        this.aliased_data = {
            ipa_number: blankStringValue(),
            assessment_completion_date: currentDateValue(),
            assessment_start_date: currentDateValue(),
            project_requirements: blankConceptValue(),
            fossil_repository_agreement: blankConceptValue(),
            other_requirement_details: blankStringValue(),
        };
    }
    nodegroup: string;
    parenttile: string | null;
    provisionaledits: object | null;
    resourceinstance: string;
    sortorder: number;
    tileid: string | null;
    aliased_data: {
        ipa_number: StringValue;
        assessment_completion_date: DateValue;
        assessment_start_date: DateValue;
        project_requirements: ConceptValue;
        fossil_repository_agreement: ConceptValue;
        other_requirement_details: StringValue;
    };
}
