<script setup lang="ts">
import { useTemplateRef, inject } from 'vue';
import type { Ref } from 'vue';

import LabelledInput from '@/bcgov_arches_common/components/labelledinput/LabelledInput.vue';
import ConceptSelect from '@/bcgov_arches_common/components/ConceptSelect/ConceptSelect.vue';
import RichTextEditor from '@/bcgov_arches_common/components/richTextEditor/RichTextEditor.vue';
import { Form, FormField, type FormInstance } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import type { IPA } from '@/bcfms/ipa/schema/IPASchema.ts';
import { InitialProjectReviewSchema } from '@/bcfms/ipa/schema/InitialProjectReviewSchema.ts';

const ipa: typeof IPA = inject('ipa') as typeof IPA;
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
    return projectRiskAssessmentForm.value?.valid;
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
        <div class="formfield-margin-bottom flex-row">
            <FormField
                :resolver="zodFRPRResolver"
                name="FRPR"
            >
                <LabelledInput
                    label="Metamorphic Rock"
                    hint="???"
                    input-name="FRPR"
                    :error-message="$form.FRPR?.error?.message"
                    :required="true"
                >
                    <ConceptSelect
                        id="FRPR"
                        ref="FRPRField"
                        v-model="ipa.initialProjectReview.FRPR"
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
                    :error-message="
                        $form.initialReviewLevelOfRisk?.error?.message
                    "
                    :required="true"
                >
                    <ConceptSelect
                        id="initialReviewLevelOfRisk"
                        ref="initialReviewLevelOfRiskField"
                        v-model="
                            ipa.initialProjectReview.initialReviewLevelOfRisk
                        "
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
                    <RichTextEditor
                        id="initialReviewInternalNotes"
                        ref="initialReviewInternalNotesField"
                        v-model="
                            ipa.initialProjectReview.initialReviewInternalNotes
                        "
                    />
                </LabelledInput>
            </FormField>
        </div>
    </Form>
</template>

<style>
.inline-block {
    display: inline-block;
    width: unset;
}
.formfield-margin-bottom {
    margin-bottom: 1rem;
}
.flex-row {
    display: flex;
    flex-direction: row;
}
</style>
