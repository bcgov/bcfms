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

const ipa: typeof IPA = inject('ipa') as typeof IPA;
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
            <LabelledInput
                label="Authorizing Agency"
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
        </FormField>
        <FormField
            :resolver="zodOtherProjectTypeResolver"
            name="otherProjectType"
        >
            <LabelledInput
                label="Other Project Type"
                hint="Enter a brief project type"
                input-name="otherProjectType"
                :error-message="$form.otherProjectType?.error?.message"
                :required="true"
            >
                <InputText
                    id="otherProjectType"
                    ref="otherProjectTypeField"
                    v-model="ipa.projectDetails.otherProjectType"
                    aria-describedby="other-project-type-help"
                    aria-required="true"
                    fluid
                    class="inline-block"
                />
            </LabelledInput>
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
