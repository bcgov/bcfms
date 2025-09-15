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
    collapseFieldNames,
} from '@/bcfms/utils.ts';

const ipa = inject<Ref<IPA>>('ipa');

if (!ipa || !ipa.value) {
    throw new Error('IPA instance not provided.');
}

const emit = defineEmits(['update:stepIsValid']);

const projectTypeForm: Ref<FormInstance | null> = useTemplateRef(
    'projectTypeForm',
) as Ref<FormInstance | null>;
const baseZodResolver = zodResolver(ProjectDetailsSchema);

const isValid = () => {
    return baseIsValid(
        projectTypeForm as Ref<FormInstance>,
        ProjectDetailsSchema,
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
        projectTypeForm as Ref<FormInstance>,
    );
    emit('update:stepIsValid', isValid());
};

const projectTypeResolver /* : Resolver<Record<string, any>> */ = async (
    values: any,
) => {
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
        ref="projectTypeForm"
        v-slot="$form"
        name="projectTypeForm"
        :validateOnBlur="true"
        :validateOnValueUpdate="true"
        :resolver="projectTypeResolver"
    >
        <LabelledInput
            hint="Select type of project. If project type is not listed, select Other"
            input-name="projectType"
            :error-message="$form.projectType?.error?.message"
        >
            <GenericWidget
                graph-slug="project_assessment"
                node-alias="project_type"
                :mode="EDIT"
                :aliased-node-data="ipa?.projectDetails.project_type"
                @update:value="updateModelValue($event, 'project_type')"
            />
        </LabelledInput>
        <LabelledInput
            hint="Enter a brief project type"
            input-name="otherProjectType"
            :error-message="$form.otherProjectType?.error?.message"
        >
            <GenericWidget
                graph-slug="project_assessment"
                node-alias="other_project_type"
                :mode="EDIT"
                :aliased-node-data="ipa?.projectDetails?.other_project_type"
                @update:value="updateModelValue($event, 'other_project_type')"
            />
        </LabelledInput>
        <LabelledInput
            hint="Enter the primary proposed activity"
            input-name="proposedActivity"
            :error-message="$form.proposedActivity?.error?.message"
        >
            <GenericWidget
                graph-slug="project_assessment"
                node-alias="proposed_activity"
                :aliased-node-data="ipa?.projectDetails?.proposed_activity"
                :mode="EDIT"
                @update:value="updateModelValue($event, 'other_project_type')"
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
