import { z } from 'zod';
//import DOMPurify from 'dompurify';
import type { StringValue } from '@/arches_component_lab/datatypes/string/types.ts';
import { currentDateValue, blankStringValue } from '@/bcfms/utils.ts';
import { blankConceptValue } from '@/arches_component_lab/datatypes/concept/utils.ts';
import type { ConceptValue } from '@/arches_component_lab/datatypes/concept/types.ts';
import type { DateValue } from '@/arches_component_lab/datatypes/date/types.ts';
import { ConceptValueRequiredSchema } from '@/bcgov_arches_common/datatypes/concept/validation/zod.ts';
import {
    DateValueSchema,
    DateValueRequiredSchema,
} from '@/bcgov_arches_common/datatypes/date/validation/zod.ts';
import { getStringValueRequiredSchema } from '@/bcgov_arches_common/datatypes/string/validation/zod.ts';

const InitialProjectReviewSchema = z.object({
    date_submitted: DateValueRequiredSchema,
    assessment_due_date: DateValueSchema,
    intersects_ifa: z.boolean().default(false),
    proximity_to_fos: ConceptValueRequiredSchema,
    ground_disturbance: ConceptValueRequiredSchema,
    metamorphic_rock: ConceptValueRequiredSchema,
    igneous_rock: ConceptValueRequiredSchema,
    sedimentary_rock: ConceptValueRequiredSchema,
    quaternary_deposits: ConceptValueRequiredSchema,
    frpr: ConceptValueRequiredSchema,
    initial_review_level_of_risk: ConceptValueRequiredSchema,
    initial_review_internal_notes: getStringValueRequiredSchema(500),
    initial_review_outcome: getStringValueRequiredSchema(500),
});

const requiredInitialProjectReviewSchema = InitialProjectReviewSchema.partial();
// @ts-ignore
type InitialProjectReviewType = z.infer<typeof InitialProjectReviewSchema>;

function getInitialProjectReview(): InitialProjectReviewType {
    return new InitialProjectReview();
}

class InitialProjectReview implements InitialProjectReviewType {
    constructor() {
        this.date_submitted = currentDateValue();
        this.assessment_due_date = currentDateValue();
        this.intersects_ifa = false;
        this.proximity_to_fos = blankConceptValue();
        this.ground_disturbance = blankConceptValue();
        this.metamorphic_rock = blankConceptValue();
        this.igneous_rock = blankConceptValue();
        this.sedimentary_rock = blankConceptValue();
        this.quaternary_deposits = blankConceptValue();
        this.frpr = blankConceptValue();
        this.initial_review_level_of_risk = blankConceptValue();
        this.initial_review_internal_notes = blankStringValue();
        this.initial_review_outcome = blankStringValue();
    }
    date_submitted: DateValue;
    assessment_due_date: DateValue;
    intersects_ifa: boolean;
    proximity_to_fos: ConceptValue;
    ground_disturbance: ConceptValue;
    frpr: ConceptValue;
    initial_review_level_of_risk: ConceptValue;
    initial_review_internal_notes: StringValue;
    metamorphic_rock: ConceptValue;
    igneous_rock: ConceptValue;
    sedimentary_rock: ConceptValue;
    quaternary_deposits: ConceptValue;
    initial_review_outcome: StringValue;
}

export {
    InitialProjectReview,
    InitialProjectReviewSchema,
    getInitialProjectReview,
    requiredInitialProjectReviewSchema,
};
