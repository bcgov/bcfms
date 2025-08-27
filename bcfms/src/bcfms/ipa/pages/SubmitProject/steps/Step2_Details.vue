<script setup lang="ts">
import { useTemplateRef, inject } from 'vue';
import type { Ref } from 'vue';

import InputText from 'primevue/inputtext';
import LabelledInput from '@/bcgov_arches_common/components/labelledinput/LabelledInput.vue';
import ConceptSelect from '@/bcgov_arches_common/components/ConceptSelect/ConceptSelect.vue';
import { EDIT } from '@/arches_component_lab/widgets/constants.ts';
import { Form, FormField, type FormInstance } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
// @ts-ignore
import { camelCase } from 'lodash';
import GenericWidget from '@/arches_component_lab/generics/GenericWidget/GenericWidget.vue';
import type { IPA } from '@/bcfms/ipa/schema/IPASchema.ts';
import { ProjectDetailsSchema } from '@/bcfms/ipa/schema/ProjectDetailsSchema.ts';

const ipa = inject<IPA>('ipa');

if (!ipa) {
    throw new Error('IPA instance not provided.');
}

const projectDetailsForm: Ref<FormInstance | null> = useTemplateRef(
    'projectDetailsForm',
) as Ref<FormInstance | null>;
const zodProjectNameResolver = zodResolver(
    ProjectDetailsSchema.shape.projectName,
);
const zodProjectInitiatorResolver = zodResolver(
    ProjectDetailsSchema.shape.projectInitiator,
);
const zodIndustryCompanyNameResolver = zodResolver(
    ProjectDetailsSchema.shape.industryCompanyName,
);
const zodProjectAuthorizingAgencyResolver = zodResolver(
    ProjectDetailsSchema.shape.projectAuthorizingAgency,
);
const zodLandActFileNumberResolver = zodResolver(
    ProjectDetailsSchema.shape.landActFileNumber,
);
const isValid = () => {
    return (
        (projectDetailsForm.value?.valid &&
            !(
                projectDetailsForm.value?.states.projectName.pristine ||
                projectDetailsForm.value?.states.project_initiator?.pristine ||
                projectDetailsForm.value?.states.industryCompanyName.pristine ||
                projectDetailsForm.value?.states.projectAuthorizingAgency
                    .pristine ||
                projectDetailsForm.value?.states.project_start_date?.pristine
            )) ||
        ((ipa as any).value?.projectDetails.projectName &&
            (ipa as any).value?.projectDetails.project_initiator &&
            (ipa as any).value?.projectDetails.industryCompanyName &&
            (ipa as any).value?.projectDetails.projectAuthorizingAgency &&
            (ipa as any).value?.projectDetails.project_start_date)
    );
};
const updateModelValue = function (newValue: object, attribute_name: string) {
    console.log('updateModelValue', attribute_name, newValue);

    const validator = ProjectDetailsSchema.shape[camelCase(attribute_name)];
    const result = validator.safeParse(newValue);

    if (result.success) {
        ipa.projectDetails[attribute_name] = result.data;
    }
};

defineExpose({ isValid });
</script>
<template>
    <Form
        ref="projectDetailsForm"
        v-slot="$form"
        name="projectDetailsForm"
        :validateOnBlur="true"
        :resolver="zodResolver(ProjectDetailsSchema)"
    >
        <FormField
            :resolver="zodProjectNameResolver"
            name="projectName"
        >
            <LabelledInput
                label="Project Name"
                hint="Enter a specific project name, in sentence case, that includes the geographic location and project type"
                input-name="projectName"
                :error-message="$form.projectName?.error?.message"
                :required="true"
            >
                <InputText
                    id="projectName"
                    ref="projectNameField"
                    v-model="ipa.projectDetails.projectName"
                    aria-describedby="project-name-help"
                    aria-required="true"
                    fluid
                    placeholder="Project Name"
                    class="inline-block"
                />
            </LabelledInput>
        </FormField>
        <FormField
            :resolver="zodProjectInitiatorResolver"
            name="projectInitiator"
        >
            <LabelledInput
                label="Initiator"
                hint="Select the organization or individual initiating the assessment"
                input-name="projectInitiator"
                :error-message="$form.projectInitiator?.error?.message"
                :required="true"
            >
                <GenericWidget
                    :mode="EDIT"
                    :should-show-label="false"
                    :aliasedNodeData="null"
                    graph-slug="project_assessment"
                    node-alias="project_initiator"
                    placeholder="Project End Date"
                    group-direction="column"
                    @update:value="
                        updateModelValue($event, 'project_initiator')
                    "
                />
            </LabelledInput>
        </FormField>
        <FormField
            :resolver="zodIndustryCompanyNameResolver"
            name="industryCompanyName"
        >
            <LabelledInput
                label="Industry Company / Individual / Organization"
                hint="Enter the name of Company / Individual / Organization that is responsible for executing the project"
                input-name="industryCompanyName"
                :error-message="$form.industryCompanyName?.error?.message"
                :required="true"
            >
                <InputText
                    id="industryCompanyName"
                    ref="industryCompanyNameField"
                    v-model="ipa.projectDetails.industryCompanyName"
                    aria-describedby="project-initiator-help"
                    aria-required="true"
                    fluid
                    placeholder="Enter the company name"
                    class="inline-block"
                />
            </LabelledInput>
        </FormField>
        <div class="formfield-flex-grow">
            <FormField
                :resolver="zodProjectAuthorizingAgencyResolver"
                name="projectAuthorizingAgency"
            >
                <LabelledInput
                    label="Authorizing Agency"
                    hint="Select the Agency that is authorizing the project"
                    input-name="projectAuthorizingAgency"
                    :error-message="
                        $form.projectAuthorizingAgency?.error?.message
                    "
                    :required="true"
                >
                    <ConceptSelect
                        id="projectAuthorizingAgency"
                        ref="projectAuthorizingAgencyField"
                        v-model="ipa.projectDetails.projectAuthorizingAgency"
                        graph-slug="project_assessment"
                        node-alias="project_authorizing_agency"
                    />
                </LabelledInput>
            </FormField>
        </div>
        <FormField
            :resolver="zodLandActFileNumberResolver"
            name="landActFileNumber"
        >
            <LabelledInput
                label="Land Act Number"
                input-name="landActFileNumber"
                :error-message="$form.landActFileNumber?.error?.message"
            >
                <InputText
                    id="landActFileNumber"
                    ref="landActFileNumberField"
                    v-model="ipa.projectDetails.landActFileNumber"
                    aria-describedby="land-act-number-help"
                    fluid
                    placeholder="Land Act Number"
                    class="inline-block"
                />
            </LabelledInput>
        </FormField>
        <div class="flex-row">
            <div class="formfield-flex-grow">
                <GenericWidget
                    :mode="EDIT"
                    :should-show-label="false"
                    :aliasedNodeData="null"
                    graph-slug="project_assessment"
                    node-alias="project_start_date"
                    placeholder="Project Start Date"
                    group-direction="column"
                    @update:value="
                        updateModelValue($event, 'project_start_date')
                    "
                />
            </div>
            <div class="formfield-flex-grow">
                <GenericWidget
                    :mode="EDIT"
                    :should-show-label="false"
                    :aliasedNodeData="null"
                    graph-slug="project_assessment"
                    node-alias="project_end_date"
                    placeholder="Project End Date"
                    group-direction="column"
                    @update:value="updateModelValue($event, 'project_end_date')"
                />
            </div>
        </div>
    </Form>
</template>

<style>
.inline-block {
    display: inline-block;
    width: unset;
}

.flex-row {
    display: flex;
    flex-direction: row;
}

.formfield-flex-grow {
    flex-grow: 2;
    margin-right: 1rem;
}

.datepicker-width {
    width: 85%;
}
</style>
