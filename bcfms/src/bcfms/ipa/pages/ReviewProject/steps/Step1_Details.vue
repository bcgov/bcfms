<script setup lang="ts">
import { useTemplateRef, inject } from 'vue';
import type { Ref } from 'vue';

import LabelledInput from '@/bcgov_arches_common/components/labelledinput/LabelledInput.vue';
import ConceptSelect from '@/bcgov_arches_common/components/ConceptSelect/ConceptSelect.vue';
import { Form, FormField, type FormInstance } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import DateWidget from '@/arches_component_lab/widgets/DateWidget/DateWidget.vue';
import RadioButton from 'primevue/radiobutton';
import type { IPA } from '@/bcfms/ipa/schema/IPASchema.ts';
import { InitialProjectReviewSchema } from '@/bcfms/ipa/schema/InitialProjectReviewSchema.ts';
import { EDIT } from '@/arches_component_lab/widgets/constants.ts';

const ipa = inject<IPA>('ipa');

if (!ipa) {
    throw new Error('IPA instance not provided.');
}

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
            <div class="formfield-flex-grow">
                <FormField
                    :resolver="zodDateSubmittedResolver"
                    name="dateSubmitted"
                >
                    <DateWidget
                        id="dateSubmitted"
                        v-model="ipa.initialProjectReview.dateSubmitted"
                        :mode="EDIT"
                        :value="ipa.initialProjectReview.dateSubmitted"
                        graph-slug="project_assessment"
                        node-alias="assessment_start_date"
                        :show-label="true"
                    />
                </FormField>
            </div>
            <div class="formfield-flex-grow">
                <FormField
                    :resolver="zodAssessmentDueDateResolver"
                    name="assessmentDueDate"
                >
                    <DateWidget
                        id="assessmentDueDate"
                        v-model="ipa.initialProjectReview.assessmentDueDate"
                        :mode="EDIT"
                        :value="ipa.initialProjectReview.assessmentDueDate"
                        graph-slug="project_assessment"
                        node-alias="assessment_completion_date"
                        :show-label="true"
                    />
                </FormField>
            </div>
        </div>
        <FormField
            :resolver="zodIntersectsResolver"
            name="intersectsIFA"
        >
            <p>Intersects with Important Fossil Area</p>
            <div class="flex-row">
                <RadioButton
                    v-model="ipa.initialProjectReview.intersectsIFA"
                    inputId="intersectsIFA1"
                    class="margin-bottom"
                    :value="true"
                />
                <label
                    class="margin-left"
                    for="intersectsIFA1"
                    >Yes</label
                >
                <RadioButton
                    v-model="ipa.initialProjectReview.intersectsIFA"
                    inputId="intersectsIFA0"
                    :value="false"
                    class="margin-left margin-bottom"
                />
                <label
                    class="margin-left"
                    for="intersectsIFA0"
                    >No</label
                >
            </div></FormField
        >
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
                    placeholder="Fossil Proximity"
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
                    placeholder="Ground Disturbance"
                    graph-slug="project_assessment"
                    node-alias="ground_disturbance"
                />
            </LabelledInput>
        </FormField>
    </Form>
</template>

<style scoped>
.flex-row {
    display: flex;
}
.formfield-flex-grow {
    flex-grow: 2;
    margin-right: 1rem;
}
.margin-left {
    margin-left: 0.5rem;
}

.margin-bottom {
    margin-bottom: 0.3rem;
}
</style>
