<script setup lang="ts">
import { useTemplateRef, inject, ref } from 'vue';
import type { Ref } from 'vue';

import LabelledInput from '@/bcgov_arches_common/components/labelledinput/LabelledInput.vue';
import Editor from 'primevue/editor';
import { Form, FormField, type FormInstance } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import type { IPA } from '@/bcfms/ipa/schema/IPASchema.ts';
import { InitialProjectReviewSchema } from '@/bcfms/ipa/schema/InitialProjectReviewSchema.ts';
import DOMPurify from 'dompurify';
import GenericWidget from '@/arches_component_lab/generics/GenericWidget/GenericWidget.vue';
import { EDIT } from '@/arches_component_lab/widgets/constants.ts';
import { blankConceptValue } from '@/arches_component_lab/datatypes/concept/utils.ts';

const ipa = inject<IPA>('ipa');
const blankFrpr = ref(blankConceptValue());
const blankLevelOfRisk = ref(blankConceptValue());

if (!ipa) {
    throw new Error('IPA instance not provided.');
}

const projectRiskAssessmentForm: Ref<FormInstance | null> = useTemplateRef(
    'projectRiskAssessmentForm',
) as Ref<FormInstance | null>;
const zodFRPRResolver = zodResolver(InitialProjectReviewSchema.shape.FRPR);
const zodInitialLevelOfRiskResolver = zodResolver(
    InitialProjectReviewSchema.shape.initialReviewLevelOfRisk,
);
const zodInitialReviewInternalNotesResolver = zodResolver(
    InitialProjectReviewSchema.shape.initialReviewInternalNotes,
);
const isValid = () => {
    return (
        (projectRiskAssessmentForm.value?.valid &&
            !(
                projectRiskAssessmentForm.value?.states.FRPR.pristine ||
                projectRiskAssessmentForm.value?.states.initialReviewLevelOfRisk
                    .pristine ||
                projectRiskAssessmentForm.value?.states
                    .initialReviewInternalNotes.pristine
            )) ||
        ((ipa as any).value?.initialProjectReview.FRPR &&
            (ipa as any).value?.initialProjectReview.initialReviewLevelOfRisk &&
            DOMPurify.sanitize(
                (ipa as any).value?.initialProjectReview
                    ?.initialReviewInternalNotes ?? '',
                { ALLOWED_TAGS: [] },
            ))
    );
};

defineExpose({ isValid });
</script>
<template>
    <Form
        ref="projectRiskAssessmentForm"
        v-slot="$form"
        name="projectRiskAssessmentForm"
        :validateOnBlur="true"
        :resolver="zodResolver(InitialProjectReviewSchema)"
    >
        <FormField
            :resolver="zodFRPRResolver"
            name="FRPR"
        >
            <LabelledInput
                label="Fossil Resource Potential Ranking"
                hint="???"
                input-name="FRPR"
                :error-message="$form.FRPR?.error?.message"
                :required="true"
            >
                <GenericWidget
                    :mode="EDIT"
                    :should-show-label="false"
                    :aliased-node-data="blankFrpr"
                    placeholder="Select FRPR value"
                    graph-slug="project_assessment"
                    node-alias="frpr"
                />
            </LabelledInput>
        </FormField>
        <FormField
            :resolver="zodInitialLevelOfRiskResolver"
            name="initialReviewLevelOfRisk"
        >
            <LabelledInput
                label="Initial Level of Risk"
                hint="???"
                input-name="initialReviewLevelOfRisk"
                :error-message="$form.initialReviewLevelOfRisk?.error?.message"
                :required="true"
            >
                <GenericWidget
                    :mode="EDIT"
                    :should-show-label="false"
                    :aliased-node-data="blankLevelOfRisk"
                    placeholder="Select Initial Review Level of Risk"
                    graph-slug="project_assessment"
                    node-alias="initial_review_level_of_risk"
                />
            </LabelledInput>
        </FormField>
        <FormField
            :resolver="zodInitialReviewInternalNotesResolver"
            name="initialReviewInternalNotes"
        >
            <LabelledInput
                label="Initial Review Internal Notes"
                hint="???"
                input-name="initialReviewInternalNotes"
                :error-message="
                    $form.initialReviewInternalNotes?.error?.message
                "
                :required="true"
            >
                <Editor
                    id="initialReviewInternalNotes"
                    ref="initialReviewInternalNotesField"
                    v-model="
                        ipa.initialProjectReview.initialReviewInternalNotes
                    "
                    theme="snow"
                    aria-describedby="initial-review-internal-notes-help"
                    aria-required="true"
                    fluid
                />
            </LabelledInput>
        </FormField>
    </Form>
</template>
