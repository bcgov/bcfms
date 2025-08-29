<script setup lang="ts">
import { useTemplateRef, inject, ref } from 'vue';
import type { Ref } from 'vue';

import InputText from 'primevue/inputtext';
import LabelledInput from '@/bcgov_arches_common/components/labelledinput/LabelledInput.vue';
import { EDIT } from '@/arches_component_lab/widgets/constants.ts';
import { Form, FormField, type FormInstance } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
// @ts-ignore
import { camelCase } from 'lodash';
import GenericWidget from '@/arches_component_lab/generics/GenericWidget/GenericWidget.vue';
import type { IPA } from '@/bcfms/ipa/schema/IPASchema.ts';
import {
    ProjectDetails,
    ProjectDetailsSchema,
} from '@/bcfms/ipa/schema/ProjectDetailsSchema.ts';
import { blankConceptValue } from '@/arches_component_lab/datatypes/concept/utils.ts';
import type { AliasedNodeData } from '@/arches_component_lab/types.ts';

const ipa = inject<Ref<IPA>>('ipa');
const blankProjectStart = ref({ display_value: '', node_value: null });
const blankProjectEnd = ref({ display_value: '', node_value: null });
const blankAuthorizingAgency = ref(blankConceptValue());

if (!ipa || !ipa.value) {
    throw new Error('IPA instance not provided.');
}

ipa.value.projectDetails = ref(new ProjectDetails());

const projectDetailsForm: Ref<FormInstance | null> = useTemplateRef(
    'projectDetailsForm',
) as Ref<FormInstance | null>;

const isValid = () => {
    return (
        (projectDetailsForm.value?.valid &&
            !(
                projectDetailsForm.value?.states.project_name.pristine ||
                projectDetailsForm.value?.states.project_initiator?.pristine ||
                projectDetailsForm.value?.states.industry_company_name
                    .pristine ||
                projectDetailsForm.value?.states.project_authorizing_agency
                    .pristine ||
                projectDetailsForm.value?.states.project_start_date?.pristine
            )) ||
        ((ipa as Ref<IPA>).value?.projectDetails.project_name &&
            (ipa as any).value?.projectDetails.project_initiator &&
            (ipa as any).value?.projectDetails.industry_company_name &&
            (ipa as any).value?.projectDetails.project_authorizing_agency &&
            (ipa as any).value?.projectDetails.project_start_date)
    );
};
const updateModelValue = function (
    newValue: AliasedNodeData,
    attribute_name: string,
) {
    console.log('updateModelValue', attribute_name, newValue);
    if (ipa.value.projectDetails[attribute_name] === newValue) return;

    const validator = ProjectDetailsSchema.shape[attribute_name];
    const result = validator.safeParse(newValue);

    if (result.success) {
        ipa.value.projectDetails[attribute_name] = result.data;
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
        <LabelledInput
            hint="Enter a specific project name, in sentence case, that includes the geographic location and project type"
            input-name="projectName"
            :error-message="$form.project_name?.error?.message"
        >
            <GenericWidget
                :mode="EDIT"
                :aliased-node-data="ipa?.projectDetails.project_name"
                graph-slug="project_assessment"
                node-alias="project_name"
                @update:value="updateModelValue($event, 'project_name')"
            />
        </LabelledInput>
        <LabelledInput
            label="Initiator"
            hint="Select the organization or individual initiating the assessment"
            input-name="projectInitiator"
            :error-message="$form.projectInitiator?.error?.message"
            :required="true"
        >
            <GenericWidget
                :mode="EDIT"
                :aliased-node-data="null"
                graph-slug="project_assessment"
                node-alias="project_initiator"
                @update:value="updateModelValue($event, 'project_initiator')"
            />
        </LabelledInput>
        <LabelledInput
            label="Industry Company / Individual / Organization"
            hint="Enter the name of Company / Individual / Organization that is responsible for executing the project"
            input-name="industryCompanyName"
            :error-message="$form.industryCompanyName?.error?.message"
            :required="true"
        >
            <GenericWidget
                :mode="EDIT"
                :aliased-node-data="null"
                graph-slug="project_assessment"
                node-alias="industry_company_name"
                placeholder="Industry Company / Individual / Organization"
                @update:value="
                    updateModelValue($event, 'industry_company_name')
                "
            />
        </LabelledInput>
        <div class="formfield-flex-grow">
            <LabelledInput
                label="Authorizing Agency"
                hint="Select the Agency that is authorizing the project"
                input-name="projectAuthorizingAgency"
                :error-message="$form.projectAuthorizingAgency?.error?.message"
                :required="true"
            >
                <GenericWidget
                    :mode="EDIT"
                    :aliased-node-data="blankAuthorizingAgency"
                    graph-slug="project_assessment"
                    node-alias="project_authorizing_agency"
                    @update:value="
                        updateModelValue($event, 'project_authorizing_agency')
                    "
                />
            </LabelledInput>
        </div>
        <LabelledInput
            label="Land Act Number"
            input-name="landActFileNumber"
            :error-message="$form.landActFileNumber?.error?.message"
        >
            <GenericWidget
                :mode="EDIT"
                :aliased-node-data="ipa?.projectDetails?.land_act_file_number"
                graph-slug="project_assessment"
                node-alias="land_act_file_number"
                placeholder="Land Act Number"
                @update:value="updateModelValue($event, 'land_act_file_number')"
            />
        </LabelledInput>
        <div class="flex-row">
            <div class="formfield-flex-grow">
                <GenericWidget
                    :mode="EDIT"
                    :should-show-label="false"
                    :aliased-node-data="blankProjectStart"
                    graph-slug="project_assessment"
                    node-alias="project_start_date"
                    placeholder="Project Start Date"
                    @update:value="
                        updateModelValue($event, 'project_start_date')
                    "
                />
            </div>
            <div class="formfield-flex-grow">
                <GenericWidget
                    :mode="EDIT"
                    :should-show-label="false"
                    :aliased-node-data="blankProjectEnd"
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
