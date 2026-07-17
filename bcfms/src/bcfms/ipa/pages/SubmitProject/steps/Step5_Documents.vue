<script setup lang="ts">
import { useTemplateRef, inject, onMounted } from 'vue';
import type { Ref } from 'vue';
import GenericWidget from '@/arches_component_lab/generics/GenericWidget/GenericWidget.vue';
import { EDIT } from '@/arches_component_lab/widgets/constants.ts';

import { Form, type FormInstance } from '@primevue/forms';
import type { AliasedNodeData } from '@/arches_component_lab/types.ts';
import {
    isValid as baseIsValid,
    updateModelValue as baseUpdateModelValue,
} from '@/bcfms/utils.ts';
import type { IPA } from '@/bcfms/ipa/schema/IPASchema.ts';
import { ProjectDetailsSchema } from '@/bcfms/ipa/schema/ProjectDetailsSchema.ts';
import { getFlattenResolver } from '@/bcgov_arches_common/validation-utils.ts';
import { zodResolver } from '@primevue/forms/resolvers/zod';

const ipa = inject<Ref<IPA>>('ipa');

if (!ipa || !ipa.value) {
    throw new Error('IPA instance not provided.');
}

const projectDocumentsForm: Ref<FormInstance | null> = useTemplateRef(
    'projectDocumentsForm',
) as Ref<FormInstance | null>;

const projectDocumentsResolver = getFlattenResolver(
    zodResolver(ProjectDetailsSchema.shape['aliased_data']),
);

const isValid = () => {
    const files =
        ipa.value.aliased_data?.project_details?.aliased_data?.project_documents
            ?.node_value;

    if (!files?.length) {
        return true;
    }

    return baseIsValid(
        projectDocumentsForm as Ref<FormInstance>,
        ProjectDetailsSchema.shape['aliased_data'],
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
        ipa.value.aliased_data?.project_details?.aliased_data?.project_documents
            ?.aliased_data,
        projectDocumentsForm as Ref<FormInstance>,
    );
    emit('update:stepIsValid', isValid());
};

onMounted(async () => {
    emit('update:stepIsValid', isValid());
});

defineExpose({ isValid });
</script>
<template>
    <Form
        ref="projectDocumentsForm"
        name="projectDocumentsForm"
        :validate-on-blur="true"
        :validate-on-value-update="true"
        :resolver="projectDocumentsResolver"
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
                :aliased-node-data="
                    ipa?.aliased_data?.project_details.aliased_data
                        ?.project_documents
                "
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
}
[data-node-alias='project_documents'] {
    max-width: 500px;
    max-height: 350px;
    margin-left: auto;
    margin-right: auto;
    overflow-y: clip;
}
</style>
