<script setup lang="ts">
import { useTemplateRef, inject } from 'vue';
import type { Ref } from 'vue';

import LabelledInput from '@/bcgov_arches_common/components/labelledinput/LabelledInput.vue';
import { Form, type FormInstance } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import GenericWidget from '@/arches_component_lab/generics/GenericWidget/GenericWidget.vue';
import RadioButton from 'primevue/radiobutton';
import type { IPA } from '@/bcfms/ipa/schema/IPASchema.ts';
import { InitialProjectReviewSchema } from '@/bcfms/ipa/schema/InitialProjectReviewSchema.ts';
import { EDIT } from '@/arches_component_lab/widgets/constants.ts';
import type { AliasedNodeData } from '@/arches_component_lab/types.ts';
import {
    isValid as baseIsValid,
    updateModelValue as baseUpdateModelValue,
} from '@/bcfms/utils.ts';
import { getFlattenResolver } from '@/bcgov_arches_common/validation-utils.ts';

const ipa = inject<Ref<IPA>>('ipa');
const emit = defineEmits(['update:stepIsValid']);

if (!ipa || !ipa.value) {
    throw new Error('IPA instance not provided.');
}

const projectDetailsForm: Ref<FormInstance | null> = useTemplateRef(
    'projectDetailsForm',
) as Ref<FormInstance | null>;
const projectDetailsResolver = getFlattenResolver(
    zodResolver(InitialProjectReviewSchema.shape['aliased_data']),
);
const isValid = () => {
    return baseIsValid(
        projectDetailsForm as Ref<FormInstance>,
        InitialProjectReviewSchema.shape['aliased_data'],
    );
};
const updateModelValue = function (
    newValue: AliasedNodeData,
    attribute_name: string,
) {
    baseUpdateModelValue(
        newValue,
        attribute_name,
        ipa.value.initial_project_review?.aliased_data,
        projectDetailsForm as Ref<FormInstance>,
    );
    emit('update:stepIsValid', isValid());
};

defineExpose({ isValid });
</script>
<template>
    <Form
        ref="projectDetailsForm"
        name="projectDetailsForm"
        :validateOnBlur="true"
        :validateOnValueUpdate="true"
        :resolver="projectDetailsResolver"
    >
        <div class="flex-row">
            <div class="formfield-flex-grow">
                <LabelledInput
                    hint="Date the project was submitted"
                    input-name="proximityToFossils"
                >
                    <GenericWidget
                        :mode="EDIT"
                        :aliased-node-data="
                            ipa.initial_project_review?.aliased_data
                                ?.assessment_start_date
                        "
                        graph-slug="project_assessment"
                        node-alias="assessment_start_date"
                        placeholder="Assessment Start Date"
                        @update:value="
                            updateModelValue($event, 'assessment_start_date')
                        "
                    />
                </LabelledInput>
            </div>
            <div class="formfield-flex-grow">
                <LabelledInput
                    hint="Date the review must be completed"
                    input-name="proximityToFossils"
                >
                    <GenericWidget
                        :mode="EDIT"
                        :aliased-node-data="
                            ipa.initial_project_review?.aliased_data
                                ?.assessment_completion_date
                        "
                        graph-slug="project_assessment"
                        node-alias="assessment_completion_date"
                        placeholder="Assessment Completion Date"
                        @update:value="
                            updateModelValue(
                                $event,
                                'assessment_completion_date',
                            )
                        "
                /></LabelledInput>
            </div>
        </div>
        <p>Intersects with Important Fossil Area</p>
        <div class="flex-row">
            <RadioButton
                v-model="ipa.initial_project_review.aliased_data.intersects_ifa"
                inputId="intersects_ifa1"
                class="margin-bottom"
                :value="true"
            />
            <label
                class="margin-left"
                for="intersects_ifa1"
                >Yes</label
            >
            <RadioButton
                v-model="ipa.initial_project_review.aliased_data.intersects_ifa"
                inputId="intersects_ifa0"
                :value="false"
                class="margin-left margin-bottom"
            />
            <label
                class="margin-left"
                for="intersects_ifa0"
                >No</label
            >
        </div>
        <LabelledInput
            hint="Identify the project proximity to known fossils"
            input-name="proximityToFossils"
        >
            <GenericWidget
                :mode="EDIT"
                :aliased-node-data="
                    ipa.initial_project_review?.aliased_data?.proximity_to_fos
                "
                placeholder="Fossil Proximity"
                graph-slug="project_assessment"
                node-alias="proximity_to_fos"
                @update:value="updateModelValue($event, 'proximity_to_fos')"
            />
        </LabelledInput>
        <LabelledInput
            hint="Choose type of ground disturbance"
            input-name="groundDisturbance"
        >
            <GenericWidget
                :mode="EDIT"
                :aliased-node-data="
                    ipa.initial_project_review?.aliased_data?.ground_disturbance
                "
                placeholder="Ground Disturbance"
                graph-slug="project_assessment"
                node-alias="ground_disturbance"
                @update:value="updateModelValue($event, 'ground_disturbance')"
            />
        </LabelledInput>
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
