<script setup lang="ts">
import { useTemplateRef, inject, ref } from 'vue';
import type { Ref } from 'vue';

import LabelledInput from '@/bcgov_arches_common/components/labelledinput/LabelledInput.vue';
import { Form, FormField, type FormInstance } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
// @ts-ignore
import { camelCase } from 'lodash';
import GenericWidget from '@/arches_component_lab/generics/GenericWidget/GenericWidget.vue';
import RadioButton from 'primevue/radiobutton';
import type { IPA } from '@/bcfms/ipa/schema/IPASchema.ts';
import { InitialProjectReviewSchema } from '@/bcfms/ipa/schema/InitialProjectReviewSchema.ts';
import { EDIT } from '@/arches_component_lab/widgets/constants.ts';
import { blankConceptValue } from '@/arches_component_lab/datatypes/concept/utils.ts';

const ipa = inject<IPA>('ipa');
const blankGroundDisturbance = ref(blankConceptValue());
const blankProximityToFossils = ref(blankConceptValue());
const blankCompletionDate = ref({ display_value: '', node_value: '' });
const blankStartDate = ref({ display_value: '', node_value: '' });

if (!ipa) {
    throw new Error('IPA instance not provided.');
}

const projectDetailsForm: Ref<FormInstance | null> = useTemplateRef(
    'projectDetailsForm',
) as Ref<FormInstance | null>;
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
    return (
        (projectDetailsForm.value?.valid &&
            !(
                projectDetailsForm.value?.states.assessment_start_date
                    ?.pristine ||
                projectDetailsForm.value?.states.proximityToFossils.pristine ||
                projectDetailsForm.value?.states.groundDisturbance.pristine
            )) ||
        ((ipa as any).value?.initialProjectReview.assessment_start_date &&
            (ipa as any).value?.initialProjectReview.proximityToFossils &&
            (ipa as any).value?.initialProjectReview.groundDisturbance)
    );
};
const updateModelValue = function (newValue: object, attribute_name: string) {
    console.log('updateModelValue', attribute_name, newValue);

    const validator =
        InitialProjectReviewSchema.shape[camelCase(attribute_name)];
    const result = validator.safeParse(newValue);

    if (result.success) {
        ipa.initialProjectReview[attribute_name] = result.data;
    }
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
                <GenericWidget
                    :mode="EDIT"
                    :should-show-label="false"
                    :aliased-node-data="blankStartDate"
                    graph-slug="project_assessment"
                    node-alias="assessment_start_date"
                    placeholder="Assessment Start Date"
                    group-direction="column"
                    @update:value="
                        updateModelValue($event, 'assessment_start_date')
                    "
                />
            </div>
            <div class="formfield-flex-grow">
                <GenericWidget
                    :mode="EDIT"
                    :should-show-label="false"
                    :aliased-node-data="blankCompletionDate"
                    graph-slug="project_assessment"
                    node-alias="assessment_completion_date"
                    placeholder="Assessment Completion Date"
                    group-direction="column"
                    @update:value="
                        updateModelValue($event, 'assessment_completion_date')
                    "
                />
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
                <GenericWidget
                    :mode="EDIT"
                    :should-show-label="false"
                    :aliased-node-data="blankProximityToFossils"
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
                <GenericWidget
                    :mode="EDIT"
                    :should-show-label="false"
                    :aliased-node-data="blankGroundDisturbance"
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
