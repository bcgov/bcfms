import { describe, it, expect, beforeEach } from 'vitest';
import {
    AssessmentDetailsSchema,
    AssessmentDetails,
} from '@/bcfms/ipa/schema/AssessmentDetailsSchema.ts';

// ─── helpers ────────────────────────────────────────────────────────────────

const UUID = '3c144c58-3e36-4f1f-965f-2c88f18c2a0d';
const ISO_DATE = '2024-08-19';

const blankString = () => ({
    display_value: '',
    node_value: { en: { value: '', direction: 'ltr' } },
    details: [],
});

const blankConcept = () => ({
    display_value: '',
    node_value: null,
    details: [],
});

const validConcept = (overrides: Partial<Record<string, unknown>> = {}) => ({
    display_value: 'Foo',
    node_value: UUID,
    details: [],
    ...overrides,
});

const blankDate = () => ({
    display_value: '',
    node_value: null,
    details: [],
});

const requiredDate = (date = ISO_DATE) => ({
    display_value: date,
    node_value: date,
    details: [],
});

function validPayload(overrides: Partial<Record<string, unknown>> = {}): {
    aliased_data: Record<string, unknown>;
} {
    return {
        aliased_data: {
            ipa_number: blankString(),
            assessment_completion_date: blankDate(),
            assessment_start_date: requiredDate(),
            project_requirements: blankConcept(),
            fossil_repository_agreement: validConcept(),
            other_requirement_details: blankString(),
            ...overrides,
        },
    };
}

// ─── AssessmentDetailsSchema (zod) ──────────────────────────────────────────

describe('AssessmentDetailsSchema', () => {
    describe('valid data', () => {
        it('accepts a fully valid payload', () => {
            expect(
                AssessmentDetailsSchema.safeParse(validPayload()).success,
            ).toBe(true);
        });

        it('accepts a null assessment_completion_date node_value (optional)', () => {
            const result = AssessmentDetailsSchema.safeParse(
                validPayload({ assessment_completion_date: blankDate() }),
            );
            expect(result.success).toBe(true);
        });

        it('accepts a null project_requirements node_value (optional)', () => {
            const result = AssessmentDetailsSchema.safeParse(
                validPayload({ project_requirements: blankConcept() }),
            );
            expect(result.success).toBe(true);
        });

        it('accepts an empty ipa_number string value', () => {
            const result = AssessmentDetailsSchema.safeParse(
                validPayload({ ipa_number: blankString() }),
            );
            expect(result.success).toBe(true);
        });

        it('accepts an empty other_requirement_details string value', () => {
            const result = AssessmentDetailsSchema.safeParse(
                validPayload({ other_requirement_details: blankString() }),
            );
            expect(result.success).toBe(true);
        });
    });

    describe('assessment_start_date (required)', () => {
        it('rejects a null node_value', () => {
            const result = AssessmentDetailsSchema.safeParse(
                validPayload({ assessment_start_date: blankDate() }),
            );
            expect(result.success).toBe(false);
        });

        it('rejects a malformed date string', () => {
            const result = AssessmentDetailsSchema.safeParse(
                validPayload({
                    assessment_start_date: requiredDate('19-08-2024'),
                }),
            );
            expect(result.success).toBe(false);
        });

        it('rejects an invalid calendar date', () => {
            const result = AssessmentDetailsSchema.safeParse(
                validPayload({
                    assessment_start_date: requiredDate('2024-13-01'),
                }),
            );
            expect(result.success).toBe(false);
        });

        it('accepts a valid ISO date', () => {
            const result = AssessmentDetailsSchema.safeParse(
                validPayload({
                    assessment_start_date: requiredDate('2025-06-15'),
                }),
            );
            expect(result.success).toBe(true);
        });
    });

    describe('fossil_repository_agreement (required UUID)', () => {
        it('rejects a null node_value', () => {
            const result = AssessmentDetailsSchema.safeParse(
                validPayload({
                    fossil_repository_agreement: blankConcept(),
                }),
            );
            expect(result.success).toBe(false);
        });

        it('rejects a non-UUID string', () => {
            const result = AssessmentDetailsSchema.safeParse(
                validPayload({
                    fossil_repository_agreement: validConcept({
                        node_value: 'not-a-uuid',
                    }),
                }),
            );
            expect(result.success).toBe(false);
        });

        it('rejects an empty string', () => {
            const result = AssessmentDetailsSchema.safeParse(
                validPayload({
                    fossil_repository_agreement: validConcept({
                        node_value: '',
                    }),
                }),
            );
            expect(result.success).toBe(false);
        });

        it('accepts a valid UUID v4 string', () => {
            const result = AssessmentDetailsSchema.safeParse(
                validPayload({
                    fossil_repository_agreement: validConcept({
                        node_value: UUID,
                    }),
                }),
            );
            expect(result.success).toBe(true);
        });
    });

    describe('structure validation', () => {
        it('rejects a completely empty object', () => {
            expect(AssessmentDetailsSchema.safeParse({}).success).toBe(false);
        });

        it('rejects a missing aliased_data key', () => {
            expect(
                AssessmentDetailsSchema.safeParse({ other: 'junk' }).success,
            ).toBe(false);
        });
    });
});

// ─── AssessmentDetails class ─────────────────────────────────────────────────

describe('AssessmentDetails', () => {
    let instance: AssessmentDetails;

    beforeEach(() => {
        instance = new AssessmentDetails();
    });

    describe('top-level tile properties', () => {
        it('sets nodegroup to empty string', () => {
            expect(instance.nodegroup).toBe('');
        });

        it('sets tileid to null', () => {
            expect(instance.tileid).toBeNull();
        });

        it('sets parenttile to null', () => {
            expect(instance.parenttile).toBeNull();
        });

        it('sets provisionaledits to null', () => {
            expect(instance.provisionaledits).toBeNull();
        });

        it('sets resourceinstance to empty string', () => {
            expect(instance.resourceinstance).toBe('');
        });

        it('sets sortorder to 0', () => {
            expect(instance.sortorder).toBe(0);
        });
    });

    describe('aliased_data defaults', () => {
        it('initializes ipa_number as a blank string value', () => {
            const { ipa_number } = instance.aliased_data;
            expect(ipa_number.display_value).toBe('');
            expect(ipa_number.node_value?.['en']?.value).toBe('');
        });

        it("initializes assessment_start_date with today's ISO date", () => {
            const today = new Date().toISOString().split('T')[0];
            expect(instance.aliased_data.assessment_start_date.node_value).toBe(
                today,
            );
            expect(
                instance.aliased_data.assessment_start_date.display_value,
            ).toBe(today);
        });

        it("initializes assessment_completion_date with today's ISO date", () => {
            const today = new Date().toISOString().split('T')[0];
            expect(
                instance.aliased_data.assessment_completion_date.node_value,
            ).toBe(today);
        });

        it('initializes project_requirements as a blank concept (null node_value)', () => {
            const { project_requirements } = instance.aliased_data;
            expect(project_requirements.node_value).toBeNull();
            expect(project_requirements.display_value).toBe('');
        });

        it('initializes fossil_repository_agreement as a blank concept (null node_value)', () => {
            const { fossil_repository_agreement } = instance.aliased_data;
            expect(fossil_repository_agreement.node_value).toBeNull();
            expect(fossil_repository_agreement.display_value).toBe('');
        });

        it('initializes other_requirement_details as a blank string value', () => {
            const { other_requirement_details } = instance.aliased_data;
            expect(other_requirement_details.display_value).toBe('');
            expect(other_requirement_details.node_value?.['en']?.value).toBe(
                '',
            );
        });
    });

    describe('instance independence', () => {
        it('does not share aliased_data references between instances', () => {
            const other = new AssessmentDetails();
            other.aliased_data.ipa_number.display_value = 'IPA-999';
            expect(instance.aliased_data.ipa_number.display_value).toBe('');
        });
    });
});
