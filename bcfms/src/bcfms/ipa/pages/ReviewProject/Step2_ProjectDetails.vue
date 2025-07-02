<script setup lang="ts">
import { useTemplateRef, inject } from 'vue';
import type { Ref } from 'vue';

import LabelledInput from '@/bcgov_arches_common/components/labelledinput/LabelledInput.vue';
import ConceptSelect from '@/bcgov_arches_common/components/ConceptSelect/ConceptSelect.vue';
import { Form, FormField, type FormInstance } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import DatePicker from 'primevue/datepicker';
import RadioButton from 'primevue/radiobutton';
import type { IPA } from '@/bcfms/ipa/schema/IPASchema.ts';
import { InitialProjectReviewSchema } from '@/bcfms/ipa/schema/InitialProjectReviewSchema.ts';
import { DATE_FORMAT } from '@/bcfms/constants.ts';

const ipa: typeof IPA = inject('ipa') as typeof IPA;
const projectDetailsForm: Ref<FormInstance | null> = useTemplateRef(
    'projectDetailsForm',
) as Ref<FormInstance | null>;
const zodDateSubmittedResolver = zodResolver(
    InitialProjectReviewSchema.shape.estimatedStartDate,
);
const zodAssessmentDueDateResolver = zodResolver(
    InitialProjectReviewSchema.shape.assessmentDueDate,
);
const zodProximityToFossilsResolver = zodResolver(
    InitialProjectReviewSchema.shape.proximityToFossils,
);
const zodGroundDisturbanceResolver = zodResolver(
    InitialProjectReviewSchema.shape.groundDisturbance,
);
const zodIntersectsResolver = zodResolver(
    InitialProjectReviewSchema.shape.intersectsIFA,
);
const isValid = () => {
    return projectDetailsForm.value?.valid;
};

defineExpose({ isValid });
</script>
<template>
    <Form
        ref="projectDetailsForm"
        v-slot="$form"
        name="projectDetailsForm"
        :validateOnBlur="true"
        :resolver="zodResolver(InitialProjectReviewSchema)"
    >
        <div class="flex-row">
            <FormField
                :resolver="zodDateSubmittedResolver"
                name="dateSubmitted"
            >
                <LabelledInput
                    label="Date Submitted"
                    hint="Date the project was submitted"
                    input-name="dateSubmitted"
                    :error-message="$form.dateSubmitted?.error?.message"
                    :required="true"
                >
                    <DatePicker
                        id="dateSubmitted"
                        ref="dateSubmittedField"
                        v-model="ipa.initialProjectReview.dateSubmitted"
                        :dateFormat="DATE_FORMAT"
                        showIcon
                        aria-describedby="date-submitted-help"
                        aria-required="true"
                    />
                </LabelledInput>
            </FormField>
            <FormField
                :resolver="zodAssessmentDueDateResolver"
                name="assessmentDueDate"
            >
                <LabelledInput
                    label="Assessment Due Date"
                    hint="Date the review must be submitted"
                    input-name="assessmentDueDate"
                    :error-message="$form.assessmentDueDate?.error?.message"
                    :required="true"
                >
                    <DatePicker
                        id="assessmentDueDate"
                        ref="assessmentDueDateField"
                        v-model="ipa.initialProjectReview.assessmentDueDate"
                        :dateFormat="DATE_FORMAT"
                        showIcon
                        aria-describedby="assessment-due-date-help"
                        aria-required="true"
                    />
                </LabelledInput>
            </FormField>
        </div>
        <FormField
            :resolver="zodIntersectsResolver"
            name="intersectsIFA"
        >
            <div class="flex items-center gap-2">
                Intersects with Important Fossil Area
            </div>
            <div class="flex items-center">
                <RadioButton
                    v-model="ipa.initialProjectReview.intersectsIFA"
                    inputId="intersectsIFA1"
                    name="intersectsIFA"
                    :value="1"
                />
                <label for="intersectsIFA1">Yes</label>
            </div>
            <div class="flex items-center">
                <RadioButton
                    v-model="ipa.initialProjectReview.intersectsIFA"
                    inputId="intersectsIFA0"
                    name="intersectsIFA"
                    :value="0"
                />
                <label for="intersectsIFA0">No</label>
            </div></FormField
        >
        <div class="formfield-margin-bottom flex-row">
            <FormField
                :resolver="zodProximityToFossilsResolver"
                name="proximityToFossils"
            >
                <LabelledInput
                    label="Proximity To Fossils"
                    hint="Identify the project proximity to known fossils"
                    input-name="proximityToFossils"
                    :error-message="$form.proximityToFossils?.error?.message"
                    :required="true"
                >
                    <ConceptSelect
                        id="proximityToFossils"
                        ref="proximityToFossilsField"
                        v-model="ipa.initialProjectReview.proximityToFossils"
                        graph-slug="project_assessment"
                        node-alias="proximity_to_fos"
                    />
                </LabelledInput>
            </FormField>
            <FormField
                :resolver="zodGroundDisturbanceResolver"
                name="groundDisturbance"
            >
                <LabelledInput
                    label="Ground Disturbance"
                    hint="Choose type of ground disturbance"
                    input-name="groundDisturbance"
                    :error-message="$form.groundDisturbance?.error?.message"
                    :required="true"
                >
                    <ConceptSelect
                        id="groundDisturbance"
                        ref="groundDisturbanceField"
                        v-model="ipa.initialProjectReview.groundDisturbance"
                        graph-slug="project_assessment"
                        node-alias="ground_disturbance"
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
