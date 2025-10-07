<script setup lang="ts">
import { useTemplateRef, ref, inject } from 'vue';
import type { Ref } from 'vue';
import GenericWidget from '@/arches_component_lab/generics/GenericWidget/GenericWidget.vue';
import { EDIT } from '@/arches_component_lab/widgets/constants.ts';

import { Form, type FormInstance } from '@primevue/forms';
import type { FileReference } from '@/arches_component_lab/datatypes/file-list/types.ts';
import type { AliasedNodeData } from '@/arches_component_lab/types.ts';
import {
    isValid as baseIsValid,
    updateModelValue as baseUpdateModelValue,
} from '@/bcfms/utils.ts';
import type { IPA } from '@/bcfms/ipa/schema/IPASchema.ts';
import { ProjectDetailsSchema } from '@/bcfms/ipa/schema/ProjectDetailsSchema.ts';

const projectDocumentsForm: Ref<FormInstance | null> = useTemplateRef(
    'projectDocumentsForm',
) as Ref<FormInstance | null>;

const blankProjectDocuments = ref({
    display_value: '',
    node_value: [] as FileReference[],
});

const ipa = inject<Ref<IPA>>('ipa');

if (!ipa || !ipa.value) {
    throw new Error('IPA instance not provided.');
}

const isValid = () => {
    return baseIsValid(
        projectDocumentsForm as Ref<FormInstance>,
        ProjectDetailsSchema,
    );
};

const emit = defineEmits(['update:stepIsValid']);

const updateModelValue = function (
    newValue: AliasedNodeData,
    attribute_name: string,
) {
    baseUpdateModelValue(
        newValue,
        attribute_name,
        ipa.value.project_details,
        projectDocumentsForm as Ref<FormInstance>,
    );
    emit('update:stepIsValid', isValid());
};

defineExpose({ isValid });
</script>
<template>
    <Form
        ref="projectDocumentsForm"
        name="projectDocumentsForm"
        :validateOnBlur="true"
    >
        <p class="p-font-bold">
            Upload project documents such as Application Information
            Requirements (AIR) or Land Act project description document, if
            applicable
        </p>
        <div class="div-file-widget">
            <GenericWidget
                :mode="EDIT"
                :should-show-label="false"
                :aliased-node-data="blankProjectDocuments"
                graph-slug="project_assessment"
                node-alias="project_documents"
                @update:value="updateModelValue($event, 'project_documents')"
            />
        </div>
    </Form>
</template>

<style scoped>
.p-font-bold {
    font-weight: bold;
}
.div-file-widget {
    margin-top: 2rem;
    margin-left: 20rem;
}
</style>
