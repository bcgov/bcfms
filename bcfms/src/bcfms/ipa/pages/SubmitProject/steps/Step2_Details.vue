<script setup lang="ts">
import { useTemplateRef, inject } from 'vue';
import type { Ref } from 'vue';

import InputText from 'primevue/inputtext';
import LabelledInput from '@/bcgov_arches_common/components/labelledinput/LabelledInput.vue';
import ConceptSelect from '@/bcgov_arches_common/components/ConceptSelect/ConceptSelect.vue';
import ResourceInstanceSelectWidget from '@/arches_component_lab/widgets/ResourceInstanceSelectWidget/ResourceInstanceSelectWidget.vue';
import { EDIT } from '@/arches_component_lab/widgets/constants.ts';
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
    ProjectDetailsSchema.shape.projectStartDate,
);
const zodEstimatedEndDatesResolver = zodResolver(
    ProjectDetailsSchema.shape.projectEndDate,
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
        :resolver="zodResolver(ProjectDetailsSchema)"
    >
        <div class="formfield-margin-bottom">
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
        </div>
        <div class="formfield-margin-bottom">
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
                    <ResourceInstanceSelectWidget
                        :mode="EDIT"
                        :initial-value="null"
                        graph-slug="project_assessment"
                        node-alias="project_initiator"
                        :show-label="false"
                    />
                </LabelledInput>
            </FormField>
        </div>
        <div class="formfield-margin-bottom">
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
        </div>
        <div class="formfield-margin-bottom flex-row">
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
                            v-model="
                                ipa.projectDetails.projectAuthorizingAgency
                            "
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
        </div>
        <div class="flex-row">
            <div class="formfield-flex-grow">
                <label for="estimatedStartDate">Estimated Start Date</label>
                <FormField
                    :resolver="zodEstimatedStartDatesResolver"
                    name="estimatedStartDate"
                >
                    <DatePicker
                        id="estimatedStartDate"
                        ref="estimatedStartDateField"
                        v-model="ipa.projectDetails.projectStartDate"
                        :dateFormat="DATE_FORMAT"
                        showIcon
                        placeholder="Project Start Date"
                        aria-describedby="estimated-start-date-help"
                        class="datepicker-width"
                        aria-required="true"
                    />
                </FormField>
            </div>
            <div class="formfield-flex-grow">
                <label for="estimatedEndDate"
                    >Estimated End Date (if known)</label
                >
                <FormField
                    :resolver="zodEstimatedEndDatesResolver"
                    name="estimatedEndDate"
                >
                    <DatePicker
                        id="estimatedEndDate"
                        ref="estimatedEndDateField"
                        v-model="ipa.projectDetails.projectEndDate"
                        :dateFormat="DATE_FORMAT"
                        showIcon
                        placeholder="Project End Date"
                        class="datepicker-width"
                        aria-describedby="estimated-start-date-help"
                    />
                </FormField>
            </div>
        </div>
    </Form>
</template>

<style>
.inline-block {
    display: inline-block;
    width: unset;
}

.formfield-margin-bottom {
    margin-bottom: 1rem;
}

.flex-row {
    display: flex;
    flex-direction: row;
}

.formfield-flex-grow {
    flex-grow: 2;
    margin-right: 1rem;
}

.p-datepicker-panel {
    background-color: #f9f9f9 !important;
}

.p-datepicker {
    background-color: #f9f9f9 !important;
    color: #000000 !important;
}

.p-datepicker-header {
    background-color: #f0f0f0 !important;
    color: #000000 !important;
}

.p-datepicker-prev,
.p-datepicker-next {
    color: #000000 !important;
}

.p-datepicker-calendar thead th {
    background-color: #f9f9f9 !important;
    color: #000000 !important;
    font-weight: 600;
}

.p-datepicker-calendar tbody td {
    background-color: #f9f9f9 !important;
}

.p-datepicker-calendar tbody td span {
    color: #000000 !important;
}

.p-datepicker-calendar td span.p-highlight {
    background-color: #e0e0e0 !important;
    color: #000000 !important;
}

.p-datepicker-calendar td span:hover {
    background-color: #eaeaea !important;
    color: #000000 !important;
}

.p-datepicker-calendar {
    background-color: #eaeaea !important;
    color: #000000 !important;
}

.p-datepicker-weekday {
    background-color: #eaeaea !important;
    color: #000000 !important;
}

.p-select-list-container {
    background-color: #f9f9f9 !important;
    color: #000000 !important;
    border: 1px solid #dcdcdc !important;
    border-radius: 4px;
}

.p-select-item {
    background-color: #f9f9f9 !important;
    color: #000000 !important;
}

.p-select-item.p-highlight {
    background-color: #e0e0e0 !important;
    color: #000000 !important;
}

.p-focus {
    background-color: #eaeaea !important;
    color: #000000 !important;
}

.datepicker-width {
    width: 85%;
}

.p-select-option-label {
    font-size: 0.9rem;
}
</style>
