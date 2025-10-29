<script setup lang="ts">
import { useTemplateRef, inject } from 'vue';
import type { Ref } from 'vue';

import LabelledInput from '@/bcgov_arches_common/components/labelledinput/LabelledInput.vue';
import { Form, type FormInstance } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import type { IPA } from '@/bcfms/ipa/schema/IPASchema.ts';
import { InitialProjectReviewSchema } from '@/bcfms/ipa/schema/InitialProjectReviewSchema.ts';
import GenericWidget from '@/arches_component_lab/generics/GenericWidget/GenericWidget.vue';
import { EDIT } from '@/arches_component_lab/widgets/constants.ts';
import {
    isValid as baseIsValid,
    updateModelValue as baseUpdateModelValue,
} from '@/bcfms/utils.ts';
import type { AliasedNodeData } from '@/arches_component_lab/types.ts';
import { getFlattenResolver } from '@/bcgov_arches_common/validation-utils.ts';

const ipa = inject<Ref<IPA>>('ipa');
const emit = defineEmits(['update:stepIsValid']);

if (!ipa || !ipa.value) {
    throw new Error('IPA instance not provided.');
}

const projectRiskAssessmentForm: Ref<FormInstance | null> = useTemplateRef(
    'projectRiskAssessmentForm',
) as Ref<FormInstance | null>;
const projectRiskAssessmentResolver = getFlattenResolver(
    zodResolver(InitialProjectReviewSchema.shape['aliased_data']),
);

const isValid = () => {
    return baseIsValid(
        projectRiskAssessmentForm as Ref<FormInstance>,
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
        projectRiskAssessmentForm as Ref<FormInstance>,
    );
    emit('update:stepIsValid', isValid());
};

defineExpose({ isValid });
</script>
<template>
    <Form
        ref="projectRiskAssessmentForm"
        name="projectRiskAssessmentForm"
        :validateOnBlur="true"
        :validateOnValueUpdate="true"
        :resolver="projectRiskAssessmentResolver"
    >
        <LabelledInput
            label="Fossil Resource Potential Ranking"
            hint="???"
            input-name="FRPR"
            :required="true"
        >
            <GenericWidget
                :mode="EDIT"
                :should-show-label="false"
                :aliased-node-data="
                    ipa.initial_project_review?.aliased_data?.frpr
                "
                placeholder="Select FRPR value"
                graph-slug="project_assessment"
                node-alias="frpr"
                @update:value="updateModelValue($event, 'frpr')"
            />
        </LabelledInput>
        <LabelledInput
            label="Initial Level of Risk"
            hint="???"
            input-name="initialReviewLevelOfRisk"
            :required="true"
        >
            <GenericWidget
                :mode="EDIT"
                :should-show-label="false"
                :aliased-node-data="
                    ipa.initial_project_review?.aliased_data
                        ?.initial_review_level_of_risk
                "
                placeholder="Select Initial Review Level of Risk"
                graph-slug="project_assessment"
                node-alias="initial_review_level_of_risk"
                @update:value="
                    updateModelValue($event, 'initial_review_level_of_risk')
                "
            />
        </LabelledInput>
        <LabelledInput
            label="Initial Review Internal Notes"
            hint="???"
            input-name="initialReviewInternalNotes"
            :required="true"
        >
            <GenericWidget
                :mode="EDIT"
                :should-show-label="false"
                :aliased-node-data="
                    ipa.initial_project_review?.aliased_data
                        ?.initial_review_internal_notes
                "
                placeholder="Enter Initial Review Internal Notes"
                graph-slug="project_assessment"
                node-alias="initial_review_internal_notes"
                @update:value="
                    updateModelValue($event, 'initial_review_internal_notes')
                "
            />
        </LabelledInput>
    </Form>
</template>
