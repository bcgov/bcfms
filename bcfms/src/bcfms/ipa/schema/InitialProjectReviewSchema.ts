import { z } from 'zod';
import type { StringValue } from '@/arches_component_lab/datatypes/string/types.ts';
import { blankStringValue } from '@/bcfms/utils.ts';
import { blankConceptValue } from '@/arches_component_lab/datatypes/concept/utils.ts';
import type { ConceptValue } from '@/arches_component_lab/datatypes/concept/types.ts';
import { ConceptValueRequiredSchema } from '@/bcgov_arches_common/datatypes/concept/validation/zod.ts';
import { getRichTextValueRequiredSchema } from '@/bcgov_arches_common/datatypes/string/validation/zod.ts';

const InitialProjectReviewSchema = z.object({
    aliased_data: z.object({
        intersects_ifa: z.boolean().default(false),
        proximity_to_fos: ConceptValueRequiredSchema,
        ground_disturbance: ConceptValueRequiredSchema,
        metamorphic_rock: ConceptValueRequiredSchema,
        igneous_rock: ConceptValueRequiredSchema,
        sedimentary_rock: ConceptValueRequiredSchema,
        quaternary_deposits: ConceptValueRequiredSchema,
        frpr: ConceptValueRequiredSchema,
        initial_review_level_of_risk: ConceptValueRequiredSchema,
        initial_review_internal_notes: getRichTextValueRequiredSchema(500),
        initial_review_outcome: getRichTextValueRequiredSchema(500),
    }),
});

const requiredInitialProjectReviewSchema = InitialProjectReviewSchema.partial();
// @ts-ignore
type InitialProjectReviewType = z.infer<typeof InitialProjectReviewSchema>;

function getInitialProjectReview(): InitialProjectReviewType {
    return new InitialProjectReview();
}

class InitialProjectReview implements InitialProjectReviewType {
    constructor() {
        this.aliased_data = {
            intersects_ifa: false,
            proximity_to_fos: blankConceptValue(),
            ground_disturbance: blankConceptValue(),
            metamorphic_rock: blankConceptValue(),
            igneous_rock: blankConceptValue(),
            sedimentary_rock: blankConceptValue(),
            quaternary_deposits: blankConceptValue(),
            frpr: blankConceptValue(),
            initial_review_level_of_risk: blankConceptValue(),
            initial_review_internal_notes: blankStringValue(),
            initial_review_outcome: blankStringValue(),
        };
    }
    aliased_data: {
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
    };
}

export {
    InitialProjectReview,
    InitialProjectReviewSchema,
    getInitialProjectReview,
    requiredInitialProjectReviewSchema,
    type InitialProjectReviewType,
};
