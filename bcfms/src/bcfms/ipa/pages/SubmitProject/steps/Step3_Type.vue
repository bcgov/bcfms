<script setup lang="ts">
import { useTemplateRef, inject } from 'vue';
import type { Ref } from 'vue';

import LabelledInput from '@/bcgov_arches_common/components/labelledinput/LabelledInput.vue';
import { Form, type FormInstance } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import type { IPA } from '@/bcfms/ipa/schema/IPASchema.ts';
import { ProjectDetailsSchema } from '@/bcfms/ipa/schema/ProjectDetailsSchema.ts';
import GenericWidget from '@/arches_component_lab/generics/GenericWidget/GenericWidget.vue';
import { EDIT } from '@/arches_component_lab/widgets/constants.ts';
import type { AliasedNodeData } from '@/arches_component_lab/types.ts';
import {
    isValid as baseIsValid,
    updateModelValue as baseUpdateModelValue,
} from '@/bcfms/utils.ts';
import { getFlattenResolver } from '@/bcgov_arches_common/validation-utils.ts';

const ipa = inject<Ref<IPA>>('ipa');

if (!ipa || !ipa.value) {
    throw new Error('IPA instance not provided.');
}

const emit = defineEmits(['update:stepIsValid']);

const projectTypeShape =
    ProjectDetailsSchema.shape['aliased_data'].shape['project_type'].shape[
        'aliased_data'
    ];

const projectTypeForm: Ref<FormInstance | null> = useTemplateRef(
    'projectTypeForm',
) as Ref<FormInstance | null>;
const projectTypeResolver = getFlattenResolver(zodResolver(projectTypeShape));

const isValid = () => {
    return baseIsValid(projectTypeForm as Ref<FormInstance>, projectTypeShape);
};
const updateModelValue = function (
    newValue: AliasedNodeData,
    attribute_name: string,
) {
    baseUpdateModelValue(
        newValue,
        attribute_name,
        ipa.value.aliased_data.project_details.aliased_data.project_type
            .aliased_data,
        projectTypeForm as Ref<FormInstance>,
    );
    emit('update:stepIsValid', isValid());
};

defineExpose({ isValid });
</script>
<template>
    <Form
        ref="projectTypeForm"
        name="projectTypeForm"
        :validateOnBlur="true"
        :validateOnValueUpdate="true"
        :resolver="projectTypeResolver"
    >
        <LabelledInput
            hint="Select type of project. If project type is not listed, select Other"
            input-name="projectType"
        >
            <GenericWidget
                graph-slug="project_assessment"
                node-alias="project_type"
                :mode="EDIT"
                :aliased-node-data="
                    ipa?.aliased_data?.project_details?.aliased_data
                        ?.project_type
                "
                @update:value="updateModelValue($event, 'project_type')"
            />
        </LabelledInput>
        <LabelledInput
            v-if="
                ipa?.aliased_data?.project_details?.aliased_data?.project_type
                    .aliased_data.project_type.node_value ===
                '54722cfa-61f7-41e9-9e02-5b676e3bcc3e'
            "
            hint="Enter a brief project type"
            input-name="otherProjectType"
        >
            <GenericWidget
                graph-slug="project_assessment"
                node-alias="other_project_type"
                :mode="EDIT"
                :aliased-node-data="
                    ipa?.aliased_data?.project_details?.aliased_data
                        ?.other_project_type
                "
                @update:value="updateModelValue($event, 'other_project_type')"
            />
        </LabelledInput>
        <LabelledInput
            hint="Enter the primary proposed activity"
            input-name="proposedActivity"
        >
            <GenericWidget
                graph-slug="project_assessment"
                node-alias="proposed_activity"
                :aliased-node-data="
                    ipa?.aliased_data?.project_details?.aliased_data
                        ?.project_type?.aliased_data.proposed_activity
                "
                :mode="EDIT"
                @update:value="updateModelValue($event, 'proposed_activity')"
            />
        </LabelledInput>
    </Form>
</template>

<style>
.inline-block {
    display: inline-block;
    width: unset;
}
</style>
