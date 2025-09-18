<script setup lang="ts">
import { useTemplateRef, inject } from 'vue';
import type { Ref } from 'vue';

import LabelledInput from '@/bcgov_arches_common/components/labelledinput/LabelledInput.vue';
import Editor from 'primevue/editor';
import { Form, type FormInstance } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import type { IPA } from '@/bcfms/ipa/schema/IPASchema.ts';
import { InitialProjectReviewSchema } from '@/bcfms/ipa/schema/InitialProjectReviewSchema.ts';
//import DOMPurify from 'dompurify';
import GenericWidget from '@/arches_component_lab/generics/GenericWidget/GenericWidget.vue';
import { EDIT } from '@/arches_component_lab/widgets/constants.ts';
import {
    isValid as baseIsValid,
    updateModelValue as baseUpdateModelValue,
} from '@/bcfms/utils.ts';
import type { AliasedNodeData } from '@/arches_component_lab/types.ts';
import { collapseFieldNames } from '@/bcgov_arches_common/validation-utils.ts';

const ipa = inject<Ref<IPA>>('ipa');
const emit = defineEmits(['update:stepIsValid']);

if (!ipa || !ipa.value) {
    throw new Error('IPA instance not provided.');
}

const projectRiskAssessmentForm: Ref<FormInstance | null> = useTemplateRef(
    'projectRiskAssessmentForm',
) as Ref<FormInstance | null>;
const baseZodResolver = zodResolver(InitialProjectReviewSchema);

const isValid = () => {
    return baseIsValid(
        projectRiskAssessmentForm as Ref<FormInstance>,
        InitialProjectReviewSchema,
    );
};
const updateModelValue = function (
    newValue: AliasedNodeData,
    attribute_name: string,
) {
    baseUpdateModelValue(
        newValue,
        attribute_name,
        ipa.value.projectDetails,
        projectRiskAssessmentForm as Ref<FormInstance>,
    );
    emit('update:stepIsValid', isValid());
};

const projectRiskAssessmentResolver /* : Resolver<Record<string, any>> */ =
    async (values: any) => {
        //  DOMPurify.sanitize(
        //             (ipa as any).value?.initialProjectReview
        //                 ?.initialReviewInternalNotes ?? '',
        //             { ALLOWED_TAGS: [] },
        //         )
        const base = (await baseZodResolver(values)) || {};
        const rawErrors = { ...(base.errors ?? {}) } as Record<
            string,
            Array<{ type?: string; message: string }>
        >;
        const errors = collapseFieldNames(rawErrors);
        return { errors };
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
                :aliased-node-data="ipa.initialProjectReview?.frpr"
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
                    ipa.initialProjectReview?.initial_review_level_of_risk
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
            <Editor
                id="initialReviewInternalNotes"
                ref="initialReviewInternalNotesField"
                v-model="ipa.initialProjectReview.initial_review_internal_notes"
                theme="snow"
                aria-describedby="initial-review-internal-notes-help"
                aria-required="true"
                fluid
                @update:value="
                    updateModelValue($event, 'initial_review_internal_notes')
                "
            />
        </LabelledInput>
    </Form>
</template>
