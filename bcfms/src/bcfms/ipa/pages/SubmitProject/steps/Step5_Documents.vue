<script setup lang="ts">
import { useTemplateRef } from 'vue';
import type { Ref } from 'vue';
import FileListWidget from '@/arches_component_lab/widgets/FileListWidget/FileListWidget.vue';
import { EDIT } from '@/arches_component_lab/widgets/constants.ts';

import { Form, type FormInstance } from '@primevue/forms';
//import type { IPA } from '@/bcfms/ipa/schema/IPASchema.ts';

//const ipa: typeof IPA = inject('ipa') as typeof IPA;
const projectDocumentsForm: Ref<FormInstance | null> = useTemplateRef(
    'projectDocumentsForm',
) as Ref<FormInstance | null>;

const isValid = () => {
    return projectDocumentsForm.value?.valid;
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
            <FileListWidget
                :mode="EDIT"
                :initial-value="null"
                graph-slug="project_assessment"
                node-alias="project_documents"
                :show-label="false"
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
