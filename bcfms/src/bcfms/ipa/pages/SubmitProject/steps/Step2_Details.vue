<script setup lang="ts">
import { useTemplateRef, inject } from 'vue';
import type { Ref } from 'vue';

import InputText from 'primevue/inputtext';
import LabelledInput from '@/bcgov_arches_common/components/labelledinput/LabelledInput.vue';
import ConceptSelect from '@/bcgov_arches_common/components/ConceptSelect/ConceptSelect.vue';
import { Form, FormField, type FormInstance } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import DatePicker from 'primevue/datepicker';
import type { IPA } from '@/bcfms/ipa/schema/IPASchema.ts';
import { ProjectDetailsSchema } from '@/bcfms/ipa/schema/ProjectDetailsSchema.ts';
import { DATE_FORMAT } from '@/bcfms/constants.ts';

const ipa: typeof IPA = inject('ipa') as typeof IPA;
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
const zodEstimatedStartDatesResolver = zodResolver(
    ProjectDetailsSchema.shape.estimatedStartDate,
);
const zodEstimatedEndDatesResolver = zodResolver(
    ProjectDetailsSchema.shape.estimatedEndDate,
);
const isValid = () => {
    return projectDetailsForm.value?.valid;
};

defineExpose({ isValid });
</script>
<template>
    <Form
        ref="projectDetailsForm"
        v-slot="$form"
        name="projectDetailsForm"
        :validateOnBlur="true"
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
                <ConceptSelect
                    id="projectInitiator"
                    ref="projectInitiatorField"
                    v-model="ipa.projectDetails.projectInitiator"
                    graph-slug="project_assessment"
                    node-alias="project_initiator"
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
                    class="inline-block"
                />
            </LabelledInput>
        </FormField>
        <FormField
            :resolver="zodProjectAuthorizingAgencyResolver"
            name="projectAuthorizingAgency"
        >
            <LabelledInput
                label="Authorizing Agency"
                hint="Select the Agency that is authorizing the project"
                input-name="projectAuthorizingAgency"
                :error-message="$form.projectAuthorizingAgency?.error?.message"
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
        <FormField
            :resolver="zodLandActFileNumberResolver"
            name="landActFileNumber"
        >
            <LabelledInput
                label="Land Act #"
                input-name="landActFileNumber"
                :error-message="$form.landActFileNumber?.error?.message"
            >
                <InputText
                    id="landActFileNumber"
                    ref="landActFileNumberField"
                    v-model="ipa.projectDetails.landActFileNumber"
                    aria-describedby="land-act-number-help"
                    aria-required="true"
                    fluid
                    class="inline-block"
                />
            </LabelledInput>
        </FormField>
        <FormField
            :resolver="zodEstimatedStartDatesResolver"
            name="estimatedStartDate"
        >
            <LabelledInput
                label="Estimated Start Date"
                hint="Enter the estimated start date"
                input-name="estimatedStartDate"
                :error-message="$form.estimatedStartDate?.error?.message"
                :required="true"
            >
                <DatePicker
                    id="estimatedStartDate"
                    ref="estimatedStartDateField"
                    v-model="ipa.projectDetails.estimatedStartDate"
                    :dateFormat="DATE_FORMAT"
                    showIcon
                    aria-describedby="estimated-start-date-help"
                    aria-required="true"
                />
            </LabelledInput>
        </FormField>
        <FormField
            :resolver="zodEstimatedEndDatesResolver"
            name="estimatedEndDate"
        >
            <LabelledInput
                label="Estimated End Date"
                hint="Enter the estimated end date"
                input-name="estimatedEndDate"
                :error-message="$form.estimatedEndDate?.error?.message"
                :required="true"
            >
                <DatePicker
                    id="estimatedEndDate"
                    ref="estimatedEndDateField"
                    v-model="ipa.projectDetails.estimatedEndDate"
                    :dateFormat="DATE_FORMAT"
                    showIcon
                    aria-describedby="estimated-end-date-help"
                    aria-required="true"
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
