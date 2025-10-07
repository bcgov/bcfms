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
const projectGeologyForm: Ref<FormInstance | null> = useTemplateRef(
    'projectGeologyForm',
) as Ref<FormInstance | null>;
const projectGeologyResolver = getFlattenResolver(
    zodResolver(InitialProjectReviewSchema),
);

const isValid = () => {
    return baseIsValid(
        projectGeologyForm as Ref<FormInstance>,
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
        ipa.value.project_details,
        projectGeologyForm as Ref<FormInstance>,
    );
    emit('update:stepIsValid', isValid());
};

defineExpose({ isValid });
</script>
<template>
    <Form
        ref="projectGeologyForm"
        name="projectGeologyForm"
        :validateOnBlur="true"
        :validateOnValueUpdate="true"
        :resolver="projectGeologyResolver"
    >
        <LabelledInput
            label="Metamorphic Rock"
            hint="Select option to best describe metamorphic rock, if present"
            input-name="metamorphicRock"
            :required="true"
        >
            <GenericWidget
                :mode="EDIT"
                :should-show-label="false"
                :aliased-node-data="ipa.initialProjectReview?.metamorphic_rock"
                placeholder="Select Metamorphic Rock"
                graph-slug="project_assessment"
                node-alias="metamorphic_rock"
                @update:value="updateModelValue($event, 'metamorphic_rock')"
            />
        </LabelledInput>
        <LabelledInput
            label="Igneous Rock"
            hint="Select option to best describe igneous rock, if present"
            input-name="igneousRock"
            :required="true"
        >
            <GenericWidget
                :mode="EDIT"
                :aliased-node-data="ipa.initialProjectReview?.igneous_rock"
                :should-show-label="false"
                placeholder="Select Igneous Rock"
                graph-slug="project_assessment"
                node-alias="igneous_rock"
                @update:value="updateModelValue($event, 'igneous_rock')"
            />
        </LabelledInput>
        <LabelledInput
            label="Sedimentary Rock"
            hint="Select option to best describe sedimentary rock, if present"
            input-name="sedimentaryRock"
            :required="true"
        >
            <GenericWidget
                :mode="EDIT"
                :aliased-node-data="ipa.initialProjectReview?.sedimentary_rock"
                :should-show-label="false"
                placeholder="Select Sedimentary Rock"
                graph-slug="project_assessment"
                node-alias="sedimentary_rock"
                @update:value="updateModelValue($event, 'sedimentary_rock')"
            />
        </LabelledInput>
        <LabelledInput
            label="Quaternary Sediments"
            hint="Select option to best describe quaternary sediments, if present"
            input-name="quaternarySediments"
            :required="true"
        >
            <GenericWidget
                :mode="EDIT"
                :aliased-node-data="
                    ipa.initialProjectReview?.quaternary_deposits
                "
                :should-show-label="false"
                placeholder="Select Quaternary Sediments"
                graph-slug="project_assessment"
                node-alias="quaternary_deposits"
                @update:value="updateModelValue($event, 'quaternary_deposits')"
            />
        </LabelledInput>
    </Form>
</template>
