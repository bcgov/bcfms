<script setup lang="ts">
import { useTemplateRef } from 'vue';
import type { Ref } from 'vue';

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
        Upload project doocuments such as Application Information Requirements
        (AIR) or Land Act project description document , if applicable
    </Form>
</template>

<style>
.inline-block {
    display: inline-block;
    width: unset;
}
</style>
