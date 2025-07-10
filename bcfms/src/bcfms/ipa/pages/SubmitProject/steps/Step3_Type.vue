<script setup lang="ts">
import { useTemplateRef, inject } from 'vue';
import type { Ref } from 'vue';

import InputText from 'primevue/inputtext';
import LabelledInput from '@/bcgov_arches_common/components/labelledinput/LabelledInput.vue';
import { Form, FormField, type FormInstance } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import ConceptSelect from '@/bcgov_arches_common/components/ConceptSelect/ConceptSelect.vue';
import type { IPA } from '@/bcfms/ipa/schema/IPASchema.ts';
import { ProjectDetailsSchema } from '@/bcfms/ipa/schema/ProjectDetailsSchema.ts';

const ipa = inject<IPA>('ipa');

if (!ipa) {
    throw new Error('IPA instance not provided.');
}

const projectTypeForm: Ref<FormInstance | null> = useTemplateRef(
    'projectTypeForm',
) as Ref<FormInstance | null>;
const zodProjectTypeResolver = zodResolver(
    ProjectDetailsSchema.shape.projectType,
);
const zodOtherProjectTypeResolver = zodResolver(
    ProjectDetailsSchema.shape.otherProjectType,
);
const zodProposedActivityResolver = zodResolver(
    ProjectDetailsSchema.shape.proposedActivity,
);
const isValid = () => {
    return projectTypeForm.value?.valid;
};

defineExpose({ isValid });
</script>
<template>
    <Form
        ref="projectTypeForm"
        v-slot="$form"
        name="projectTypeForm"
        :validateOnBlur="true"
    >
        <FormField
            :resolver="zodProjectTypeResolver"
            name="projectType"
        >
            <div class="formfield-margin-bottom">
                <LabelledInput
                    label="Project Type"
                    hint="Select type of project. If project type is not listed, select Other"
                    input-name="projectType"
                    :error-message="$form.projectType?.error?.message"
                    :required="true"
                >
                    <ConceptSelect
                        id="projectType"
                        ref="projectTypeField"
                        v-model="ipa.projectDetails.projectType"
                        graph-slug="project_assessment"
                        node-alias="project_type"
                    />
                </LabelledInput>
            </div>
        </FormField>
        <FormField
            :resolver="zodOtherProjectTypeResolver"
            name="otherProjectType"
        >
            <div class="formfield-margin-bottom">
                <LabelledInput
                    label="Other Project Type"
                    hint="Enter a brief project type"
                    input-name="otherProjectType"
                    :error-message="$form.otherProjectType?.error?.message"
                >
                    <InputText
                        id="otherProjectType"
                        ref="otherProjectTypeField"
                        v-model="ipa.projectDetails.otherProjectType"
                        aria-describedby="other-project-type-help"
                        aria-required="true"
                        fluid
                        placeholder="Other Project Type"
                        class="inline-block"
                    />
                </LabelledInput>
            </div>
        </FormField>
        <FormField
            :resolver="zodProposedActivityResolver"
            name="proposedActivity"
        >
            <LabelledInput
                label="Proposed Activity"
                hint="Enter the primary proposed activity"
                input-name="proposedActivity"
                :error-message="$form.proposedActivity?.error?.message"
                :required="true"
            >
                <InputText
                    id="proposedActivity"
                    ref="proposedActivityField"
                    v-model="ipa.projectDetails.proposedActivity"
                    aria-describedby="project-activity-help"
                    aria-required="true"
                    fluid
                    placeholder="Proposed Activity"
                    class="inline-block"
                />
            </LabelledInput>
        </FormField>
    </Form>
</template>

<style>
.inline-block {
    display: inline-block;
    width: unset;
}
</style>
